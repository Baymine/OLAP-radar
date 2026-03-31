# Apache Doris 生态日报 2026-03-31

> Issues: 11 | PRs: 164 | 覆盖项目: 10 个 | 生成时间: 2026-03-31 01:28 UTC

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

# Apache Doris 项目动态日报（2026-03-31）

## 1. 今日速览

过去 24 小时，Apache Doris 保持**高强度开发活跃度**：Issues 更新 11 条、PR 更新 164 条，远高于一般稳态开源项目的日常水平。  
从内容看，今天的主线非常明确：一是 **FE 文件系统抽象 / Cloud 存储接口重构** 持续推进，二是 **执行引擎与表达式执行链路重构**，三是围绕 **多 Catalog / Iceberg / Paimon / 云存储兼容性** 的持续补强。  
稳定性方面，新增 Bug 主要集中在 **Cloud Mode、TVF、Variant/Arrow Flight、聚合表 double key 崩溃、升级兼容性** 等高风险路径，说明 4.x 新能力在复杂场景下仍处于快速打磨阶段。  
整体健康度评价：**开发热度高、架构演进积极，但云化与新类型能力的边缘稳定性仍需重点关注**。

---

## 2. 项目进展

> 今日无新版本发布，以下聚焦已合并/关闭的重要 PR 与正在推进的关键 PR。

### 2.1 存储与文件系统抽象重构持续落地

#### 1）统一 FE 文件系统 SPI 的前置解耦与第一阶段接口重构
- PR #61859 / #61862（已关闭）  
  链接: apache/doris PR #61859  
  链接: apache/doris PR #61862  

- PR #61908（已关闭）  
  链接: apache/doris PR #61908  

- PR #61909（已关闭）  
  链接: apache/doris PR #61909  

- 关联 Issue #61860（进行中）  
  链接: apache/doris Issue #61860  

**进展解读：**  
今天 Doris 在 FE 文件系统层面的重构推进非常明显。核心方向是把当前依赖 Hadoop、Status 返回、String 路径与 RemoteFile 的老接口，逐步迁移到更清晰、可测试、可模块化拆分的 **新 FileSystem API + value objects + Maven SPI 模块化设计**。  
这类改造短期看是“重构工程”，但中长期价值非常大：

- 降低 FE 对 Hadoop 生态的硬耦合；
- 为 S3 / OSS / COS / OBS / BOS / Azure 等对象存储提供统一扩展模型；
- 改善测试能力与插件化能力；
- 为 Cloud Mode 与多种远端存储后端统一治理打基础。

这是**架构演进类高价值工作**，通常会直接影响后续云存储能力迭代速度与稳定性。

---

#### 2）Cloud 模式对象存储抽象并轨
- PR #61911（OPEN）  
  链接: apache/doris PR #61911
- PR #61910（OPEN, Draft）  
  链接: apache/doris PR #61910

**进展解读：**  
#61911 直接对应 #61860，目标是把 cloud.storage 下的 `Remote*` 继承体系迁移到新的 `fs.obj` 模块，消除 Cloud 模式中“对象存储抽象重复实现”的历史包袱。  
这意味着 Doris 正在把**Cloud 模式存储栈**从“分叉发展”重新拉回统一抽象层，对于后续：

- 云存储兼容性一致化，
- Bug 修复成本下降，
- 新对象存储后端接入，
- 元数据与 IO 路径统一治理，

都具有非常直接的正向作用。

---

### 2.2 查询执行引擎重构：表达式执行与聚合执行继续清理技术债

#### 3）旧 VExpr 执行接口迁移到 `execute_column`
- PR #61912（OPEN）  
  链接: apache/doris PR #61912

**进展解读：**  
该 PR 将部分旧表达式执行接口迁移到新的列式执行入口 `execute_column`。从摘要看，涉及 hash join build-side expr 等路径，目标是：

- 直接使用 `ColumnPtr`；
- 消除 `result_col_idx` 和间接 block 取列；
- 进一步统一列式执行模型。

这类工作虽不直接体现为“新功能”，但对 Doris 作为 OLAP 引擎的核心竞争力非常关键：  
它会影响 **表达式执行性能、算子接口统一性、代码可维护性**，也是后续算子向更纯粹 vectorized / pipeline 模型演进的重要基础。

---

#### 4）聚合执行代码重构
- PR #61690（OPEN）  
  链接: apache/doris PR #61690

**进展解读：**  
该 PR 针对聚合执行中的 “God Object” 问题进行重构，将原先一个 `AggSharedState` 承担多种语义的设计拆分。  
这说明 Doris 正在系统性清理复杂执行器中的历史负担，预计收益包括：

- 降低不同聚合语义（GroupBy / UngroupBy / InlineCount）之间的耦合；
- 更容易定位 correctness bug；
- 为后续内存控制、状态管理和性能优化打基础。

这与下文的全局扫描内存控制一起看，反映出 Doris 正在对执行层进行**结构性治理**，而非仅做局部补丁。

---

#### 5）扫描节点全局内存控制
- PR #61271（OPEN）  
  链接: apache/doris PR #61271

**进展解读：**  
该 PR 聚焦 scan node 的全局内存控制，是非常典型的 OLAP 引擎“资源治理”增强。  
若最终合入，价值主要体现在：

- 降低大查询 / 多并发扫描时的内存失控风险；
- 减少 scan 阶段对下游算子和整体 query memory budget 的冲击；
- 提升复杂负载下的稳定性和可预测性。

对于生产环境用户，**内存约束能力**往往比单点性能提升更重要，因此这是值得持续跟踪的核心改进项。

---

### 2.3 多 Catalog / 湖仓生态兼容性持续增强

#### 6）统一外部元数据缓存框架
- PR #60937（CLOSED）  
  链接: apache/doris PR #60937

**进展解读：**  
该 PR 将多 Catalog 外部元数据缓存向统一框架收敛，是数据湖查询体验优化的重要基础设施。  
作用包括：

- 降低 Iceberg / Paimon / 其他 external catalog 的实现分裂；
- 统一 TTL 解析与缓存语义；
- 改善 catalog 级别缓存管理能力。

---

#### 7）Paimon 元数据缓存改为 per-catalog 双层缓存
- PR #60478（CLOSED）  
  链接: apache/doris PR #60478

**进展解读：**  
把 Paimon cache 从全局实例改为每 catalog 实例，并引入 table + snapshot 两级结构，这对多租户、多 catalog 场景更友好，也能减少 cache 污染与失效控制不精确的问题。

---

#### 8）Iceberg 外表复杂类型 schema change 支持
- PR #60169（CLOSED）  
  链接: apache/doris PR #60169

#### 9）Iceberg v3 row lineage 支持
- PR #61398（CLOSED）  
  链接: apache/doris PR #61398

#### 10）Aliyun DLF Iceberg REST Catalog 支持
- PR #60796（CLOSED）  
  链接: apache/doris PR #60796

**进展解读：**  
这几项一起看，表明 Doris 对 Iceberg 的投入不仅停留在“能查”，而是在持续补齐：

- schema evolution；
- v3 特性；
- 云厂商 REST catalog 兼容；
- 更复杂表语义支持。

这对 Doris 作为“湖仓查询加速层”的定位是明显利好。

---

### 2.4 存储兼容性与企业集成增强

#### 11）JuiceFS 作为 HDFS-compatible scheme 支持
- PR #61031（CLOSED）  
  链接: apache/doris PR #61031

#### 12）Apache Ozone 存储属性支持
- PR #60809（CLOSED）  
  链接: apache/doris PR #60809

#### 13）MaxCompute RAM Role / ECS RAM Role 认证支持
- PR #60649（CLOSED）  
  链接: apache/doris PR #60649

#### 14）LDAPS 支持
- PR #60275（CLOSED）  
  链接: apache/doris PR #60275

#### 15）LDAP 空密码登录控制
- PR #61440（OPEN）  
  链接: apache/doris PR #61440

**进展解读：**  
今天关闭/活跃的多项 PR 体现 Doris 在企业落地层面的持续投入：  
对象存储、文件系统、认证、云数仓接入等能力都在增强，说明项目正在不断降低企业接入成本，提升在混合云与异构存储环境中的适配能力。

---

## 3. 社区热点

### 热点 1：标准 SQL `MERGE INTO` 诉求升温
- Issue #56259（OPEN）  
  链接: apache/doris Issue #56259

**现象：**  
用户明确提出希望 Doris 支持**标准 SQL 语法级别**的 `MERGE INTO`，并引用 PostgreSQL 标准文档作为参考。

**技术诉求分析：**
- 用户需求已从“特定表格式支持 upsert”升级为“统一 SQL 兼容性”；
- 这反映 Doris 用户群体正在从分析场景向**分析 + 数据维护 + 湖仓一体写入**扩展；
- 值得注意的是，PR #60482 已经为 **Iceberg 表**实现了 `UPDATE/DELETE/MERGE INTO` 能力：  
  链接: apache/doris PR #60482

**判断：**  
短期内，`MERGE INTO` 更可能先在 **外部表/湖表语义** 上继续增强；  
若要扩展为 Doris 原生表的标准 SQL 能力，还需要处理事务语义、唯一键/主键模型、planner 与执行器改造，复杂度更高。

---

### 热点 2：文件系统与对象存储抽象统一成为今日最强主线
- Issue #61860（OPEN）  
  链接: apache/doris Issue #61860
- PR #61911（OPEN）  
  链接: apache/doris PR #61911
- PR #61908（CLOSED）  
  链接: apache/doris PR #61908

**技术诉求分析：**
- FE 与 Cloud 模式并存两套 filesystem abstraction，已经开始拖累演进效率；
- 社区已明确选择“统一抽象 + 模块化拆分”的方向；
- 该问题本质上不是功能缺失，而是**架构收敛与平台化建设**。

**判断：**  
这是未来几个迭代中最值得追踪的技术主题之一，影响云存储支持、对象存储故障修复效率、测试质量与后续插件生态。

---

### 热点 3：执行引擎基础设施重构
- PR #61690（OPEN）  
  链接: apache/doris PR #61690
- PR #61912（OPEN）  
  链接: apache/doris PR #61912
- PR #61271（OPEN）  
  链接: apache/doris PR #61271

**技术诉求分析：**
- 统一表达式列式执行接口；
- 清理聚合执行历史耦合；
- 引入全局内存控制。

这三者表面分散，实则都指向 Doris 的核心目标：  
**让执行引擎更可控、更统一、更适合大规模生产负载。**

---

## 4. Bug 与稳定性

> 按潜在严重程度排序，并结合现有数据判断是否已有 fix PR 线索。

### P1：BE crash - 聚合表以 double 作为 key 导致崩溃
- Issue #61797（OPEN）  
  链接: apache/doris Issue #61797

**影响评估：**  
这是今天最值得警惕的问题之一。BE crash 级别问题通常意味着：
- 可能触发节点退出或查询中断；
- 影响面可能跨 2.x / 3.x / 4.x；
- 涉及聚合表 key 语义，可能不是边缘特性。

**状态：**  
当前未见对应 fix PR。  
**建议：** 使用 double 作为 agg key 的用户应优先规避，维护者应尽快补充复现与最小修复。

---

### P1：Cloud Mode Stream Load 偶发失败
- Issue #61905（OPEN）  
  链接: apache/doris Issue #61905

**影响评估：**  
问题描述指出 flush 后文件 close 为异步，后续 segment 若立即可见性检查可能失败。  
这属于典型的**异步 IO / 云存储一致性窗口**问题，风险在于：
- 导致导入偶发失败；
- 在 Cloud Mode 生产环境下难以稳定复现；
- 用户侧感知为“不稳定”。

**状态：**  
未见 fix PR。  
**判断：** 若属实，这类问题优先级很高，因为直接影响云上导入链路 SLA。

---

### P1：TVF 持续导入长跑任务触发 NPE
- Issue #61897（OPEN）  
  链接: apache/doris Issue #61897

**影响评估：**  
错误信息显示 `ConnectContext.getExecutor()` 返回 null，随后调用 `getSummaryProfile()` 触发 NPE。  
这说明在 TVF 持续导入、长时间运行任务、较多大文件场景下，某些上下文生命周期管理存在缺陷。

**风险点：**
- 长作业运行一段时间后失败；
- 更接近生产真实负载，而非短期功能测试；
- 可能与 profile、异步执行、任务上下文回收时序有关。

**状态：**  
暂无 fix PR。

---

### P2：Cross-cluster Catalog + Arrow Flight 无法读取 Variant 类型
- Issue #61883（OPEN）  
  链接: apache/doris Issue #61883

**影响评估：**  
这是典型的**新类型 + 跨集群 + Arrow Flight** 交叉兼容问题。  
当前 Doris 正在加速推进 Variant / 文档型能力（见 PR #61895）：
- PR #61895（OPEN）  
  链接: apache/doris PR #61895

**判断：**  
#61895 是类型系统层面的演进，不一定直接修复该问题，但说明 Variant 仍处在快速变动期。  
对于使用 Variant 的跨集群用户，应谨慎升级与验证 Arrow Flight 路径。

---

### P2：AuditLoaderPlugin 审计日志偶发中文乱码
- Issue #61901（OPEN）  
  链接: apache/doris Issue #61901

**影响评估：**  
不一定影响核心查询正确性，但会影响审计可读性与运维取证。  
对中文场景用户尤其敏感，可能涉及：
- 编码声明不一致；
- 字符集转换链路；
- plugin 写入/消费端编码处理不统一。

**状态：** 暂无 fix PR。

---

### P2：`allow_zero_date` 配置不生效
- Issue #61789（OPEN）  
  链接: apache/doris Issue #61789

**影响评估：**  
属于配置语义与行为不一致问题，会影响 MySQL 兼容性预期和历史数据迁移。  
若用户依赖 zero date 兼容，这可能造成导入或查询行为偏差。

---

### P2：安全集群场景 ErrorURL 不可访问
- Issue #61780（CLOSED）  
  链接: apache/doris Issue #61780

**状态：** 已关闭。  
**解读：** 今天已对该问题完成处理，说明安全集群下错误回显链路已被修正或纳入修复流程。  
这是一个正向信号：与云化、安全化部署相关的问题有在持续得到响应。

---

### P3：1.2.8 升级到 2.0.0 元数据兼容测试中 `SHOW FRONTENDS` 报错
- Issue #61866（OPEN）  
  链接: apache/doris Issue #61866

**影响评估：**  
这是升级兼容性问题，虽然未必影响所有用户，但对于存量老集群非常关键。  
如果元数据兼容链路仍有缺口，会抬高老用户升级成本，也会影响企业版本推进节奏。

---

### P3：历史连接问题已关闭
- Issue #10495（CLOSED）  
  链接: apache/doris Issue #10495

**解读：**  
老的 Flink 连接 BE 内外网地址问题今天被关闭，更多体现为陈旧问题清理，不代表新修复，但有助于减少 issue backlog 噪音。

---

## 5. 功能请求与路线图信号

### 5.1 `MERGE INTO` 标准语法需求值得重点关注
- Issue #56259（OPEN）  
  链接: apache/doris Issue #56259
- PR #60482（CLOSED）  
  链接: apache/doris PR #60482

**信号判断：**
- 用户已明确提出标准 SQL 级 `MERGE INTO`；
- 社区已在 Iceberg 上实现 `UPDATE/DELETE/MERGE INTO`；
- 说明 planner/语法层已有一定积累。

**结论：**  
`MERGE INTO` 很可能会继续沿着“先外表/湖表、后更广义表模型”的路径推进，是**下一阶段 SQL 兼容性增强的重要观察点**。

---

### 5.2 Variant / 文档模式能力仍在深化
- PR #61895（OPEN）  
  链接: apache/doris PR #61895
- Issue #61883（OPEN）  
  链接: apache/doris Issue #61883

**信号判断：**
- `enable_doc_mode` 从列级提升到类型级，是非常典型的“能力正式化”动作；
- 这类改造意味着 Variant 不再只是附着在列定义上的特殊参数，而是进入更统一的类型系统表达。

**结论：**  
Variant / 半结构化文档能力大概率会继续纳入 Doris 4.x 后续小版本重点打磨范围，但跨集群和 Arrow Flight 等高级场景还需要更多稳定性补课。

---

### 5.3 云存储与文件系统模块化将成为未来数个版本的重要主题
- Issue #61860（OPEN）  
  链接: apache/doris Issue #61860
- PR #61911（OPEN）  
  链接: apache/doris PR #61911
- PR #61910（OPEN）  
  链接: apache/doris PR #61910

**结论：**  
这不是一次性重构，而是未来多个迭代都会持续推进的“平台工程”。  
对于依赖对象存储、多云部署、Cloud Mode 的用户，这条路线很可能最终转化为：
- 更稳定的导入/读取链路；
- 更规范的配置模型；
- 更快的后端适配与故障修复。

---

## 6. 用户反馈摘要

### 6.1 真实生产场景正在向“云化 + 长任务 + 大文件”集中
- Issue #61897  
  链接: apache/doris Issue #61897
- Issue #61905  
  链接: apache/doris Issue #61905

**提炼：**
- 用户不是在问简单 SQL 语法，而是在真实大规模导入与 Cloud Mode 生产场景中暴露问题；
- 长时间任务、异步 flush/close、大量大文件，这些都说明 Doris 已被用于更复杂、更接近生产核心链路的负载。

---

### 6.2 兼容性诉求从“能连”升级为“标准化 + 平滑迁移”
- Issue #56259  
  链接: apache/doris Issue #56259
- Issue #61866  
  链接: apache/doris Issue #61866
- Issue #10495  
  链接: apache/doris Issue #10495

**提炼：**
- 用户期待标准 SQL `MERGE INTO`；
- 老版本用户关心跨大版本升级元数据兼容；
- 连接器/网络地址暴露问题虽然是旧问题，但仍说明 Doris 部署网络模型对用户有一定门槛。

---

### 6.3 中文用户对审计与错误可观测性要求提升
- Issue #61901  
  链接: apache/doris Issue #61901
- Issue #61780  
  链接: apache/doris Issue #61780
- PR #61075  
  链接: apache/doris PR #61075

**提炼：**
- 审计日志乱码、ErrorURL 可访问性、插入报错信息长度可配置等，说明用户越来越关注：
  - 可观测性，
  - 运维可诊断性，
  - 安全集群下的错误回显质量。

这类诉求通常来自**生产化运维成熟阶段**，是项目走向企业深水区的典型信号。

---

## 7. 待处理积压

### 7.1 长期未处理的标准 SQL 能力请求
- Issue #56259（OPEN, Stale）  
  链接: apache/doris Issue #56259

**提醒：**  
虽然目前标记为 Stale，但其背后是清晰的 SQL 路线诉求，不建议简单按低活跃度忽略。  
尤其在 Iceberg 已支持 `MERGE INTO` 的背景下，用户会自然期待 Doris 主体 SQL 兼容继续跟进。

---

### 7.2 长期悬而未决的执行/优化类 PR
- PR #56694（OPEN, Stale）  
  链接: apache/doris PR #56694

**提醒：**  
该 PR 已长期处于 Stale 状态，若其涉及 runtime filter v1/v2 合并，可能关系到查询优化链路统一。  
建议维护者明确：
- 是否仍有合并价值；
- 是否需要拆分重提；
- 是否应正式关闭避免认知负担。

---

### 7.3 关键重构 PR 需要重点跟进评审节奏
- PR #61271  
  链接: apache/doris PR #61271
- PR #61690  
  链接: apache/doris PR #61690
- PR #61911  
  链接: apache/doris PR #61911
- PR #61912  
  链接: apache/doris PR #61912

**提醒：**  
这些 PR 虽非“立刻对外可见的新功能”，但都属于会影响后续多个版本质量的基础设施改造。  
若评审周期过长，容易形成新的技术债堆积。

---

## 8. 结论

今天的 Apache Doris 呈现出非常鲜明的双重特征：

1. **架构层面快速演进**：  
   文件系统 SPI、Cloud 存储抽象、表达式执行与聚合执行都在进行深层重构，显示项目在为未来版本做“地基加固”。

2. **云化与新能力边界仍有稳定性压力**：  
   Cloud Mode stream load、TVF 长跑任务、Variant + Arrow Flight、double key 崩溃等问题说明，新能力组合场景仍需加快收敛。

如果从项目健康度来看，Doris 当前属于典型的**高活跃、高投入、快速演进期**：  
优势是路线清晰、功能面不断扩张；挑战是必须同步控制复杂度，避免云存储、多 Catalog、半结构化数据等新战线带来回归风险。

如需，我可以继续把这份日报进一步整理成：
- **面向管理层的 1 页摘要版**
- **面向研发团队的风险追踪版**
- **按“查询引擎 / 存储 / 湖仓生态 / 稳定性”四象限的周报模板**。

---

## 横向引擎对比

# OLAP / 分析型存储引擎开源生态横向对比报告  
**基于 2026-03-31 社区动态**

---

## 1. 生态全景

过去 24 小时内，OLAP 与分析型存储开源生态整体呈现出**高活跃、高演进、高分化**的态势：一方面，Apache Doris、ClickHouse、StarRocks、DuckDB 等核心引擎仍在高频推进执行引擎、湖仓兼容、对象存储与 SQL 能力；另一方面，Arrow、Velox、Gluten、Iceberg、Delta Lake 等“底座型项目”也在同步强化数据交换、连接器、执行抽象与多引擎协同。  
从项目共性看，当前行业焦点已不再只是“单机查询快不快”，而是转向**云对象存储适配、外部表/湖表生态、复杂 SQL 正确性、流批一体、可观测性与升级稳定性**。  
从风险面看，高速迭代也带来了明显代价：多个项目都暴露出**wrong result、性能回退、云存储边缘一致性、连接器行为不一致**等问题，说明 2026 年的竞争重点正从“功能覆盖”进入“复杂场景稳定收敛”。  
整体判断：该生态已经进入**平台化与生产化深水区**，技术选型应同时关注功能前沿和工程收敛能力。

---

## 2. 各项目活跃度对比

| 项目 | Issues 更新 | PR 更新 | 今日 Release | 健康度评估 | 简要判断 |
|---|---:|---:|---|---|---|
| **ClickHouse** | 74 | 461 | 无 | 高活跃 / 风险中高 | 生态体量最大之一，创新快，但新版本回归与正确性问题需重点盯 |
| **Apache Doris** | 11 | 164 | 无 | 高活跃 / 积极演进 | 架构重构强烈，云化与湖仓方向投入明显，边缘稳定性仍在打磨 |
| **StarRocks** | 37 | 115 | **有（3.5.15）** | 高活跃 / 风险偏高 | 多分支维护能力强，但当天暴露多项安全与一致性高危问题 |
| **DuckDB** | 17 | 51 | 无 | 高活跃 / 整体良好 | 嵌入式分析龙头，修复效率高，但高级 SQL correctness 风险需关注 |
| **Apache Iceberg** | 9 | 44 | 无 | 中高活跃 / 稳健 | 更偏接口和多引擎生态演进，连接器与 REST Catalog 是重点 |
| **Delta Lake** | 3 | 47 | 无 | 中高活跃 / 良好 | Kernel 化和 Flink Sink 是主线，PR 堆叠较深，集成吞吐需关注 |
| **Apache Arrow** | 21 | 17 | 无 | 中高活跃 / 修复导向 | 数据交换底座持续收敛，正确性和语言绑定兼容性是主轴 |
| **Velox** | 3 | 50 | 无 | 高活跃 / 工程健康较好 | 执行引擎底层持续演进，GPU、类型系统、扫描下推值得关注 |
| **Apache Gluten** | 5 | 23 | 无 | 中高活跃 / 偏收口 | 处于 Spark 4.x 与 Velox 能力补齐阶段，发布前稳定性打磨特征明显 |
| **Databend** | 4 | 14 | **有（2 个 patch）** | 稳健活跃 / 健康较好 | 功能补强与内核修复并行，节奏稳，社区规模较核心头部略小 |

### 活跃度分层观察
- **超高活跃层**：ClickHouse、Doris、StarRocks  
- **高活跃层**：DuckDB、Velox、Iceberg、Delta Lake  
- **稳健活跃层**：Arrow、Gluten、Databend  

---

## 3. Apache Doris 在生态中的定位

### 3.1 优势
相较同类项目，Apache Doris 当前的优势主要体现在三点：

1. **一体化分析数据库定位清晰**  
   Doris 兼具 MPP OLAP、湖仓查询加速、多 Catalog、半结构化数据、云对象存储能力，产品边界比传统数仓更宽，比纯湖格式项目更完整。

2. **架构演进力度大**  
   当天最突出的动作包括：
   - FE 文件系统 SPI 重构
   - Cloud 模式对象存储抽象统一
   - 执行引擎表达式 `execute_column` 迁移
   - 聚合执行重构
   - scan 节点全局内存治理  
   这说明 Doris 正在做“平台级重构”，不是单纯堆功能。

3. **湖仓生态兼容持续增强**  
   Doris 对 Iceberg / Paimon / 外部 Catalog / 云存储 / JuiceFS / Ozone / MaxCompute 认证等方向的投入非常连续，说明其目标不是只做内部存储，而是争夺**统一分析入口层**。

### 3.2 与同类路线差异
与其他主流项目相比，Doris 的路线有明显差异：

- **对比 ClickHouse**：  
  ClickHouse 更强于极致执行性能、MergeTree 体系、函数与格式生态深度；Doris 更强调**数据库一体化体验、云化、Catalog/湖仓接入与企业集成**。

- **对比 StarRocks**：  
  两者都走“高性能 MPP + 湖仓增强”路线，但 Doris 当前更明显地在推进**文件系统 / Cloud 存储统一抽象**，StarRocks 则更强烈地表现出**多分支回溯、优化器统计精化与 shared-data / Lake PK 路线**。

- **对比 DuckDB**：  
  DuckDB 是嵌入式/单机分析引擎，优势在本地执行与开放格式；Doris 是面向服务端、分布式、多租户与在线生产负载的数据库系统。

- **对比 Iceberg / Delta Lake**：  
  后两者核心是表格式与多引擎协议层；Doris 是直接面向查询服务和数据平台的数据库产品，更多承担**执行与服务层**角色。

### 3.3 社区规模对比
按当天的 Issues/PR 数据：
- Doris 活跃度明显高于 Iceberg、Delta、DuckDB、Arrow、Databend、Gluten
- 低于 ClickHouse 的超大规模活跃度
- 与 StarRocks 同属头部 OLAP 数据库活跃阵营

**结论**：Doris 已处于开源 OLAP 头部社区梯队，且在“架构重构 + 云化治理”维度上表现得比很多同类更激进。

---

## 4. 共同关注的技术方向

以下是多个项目同时涌现的共性主题。

### 4.1 云对象存储与文件系统抽象统一
**涉及项目**：Doris、ClickHouse、DuckDB、StarRocks、Arrow、Gluten、Iceberg  
**具体诉求**：
- Doris：统一 FE 文件系统 SPI、Cloud 对象存储抽象收敛
- ClickHouse：S3 TTL PUT 放大、对象存储行为可预测性
- DuckDB：S3 分区 COPY OOM
- StarRocks：shared-data / storage volume / Iceberg 文件裁剪
- Arrow：远程 IO、seekable buffered stream
- Gluten：S3 生命周期 finalize 问题
- Iceberg：S3 IO、连接器与 catalog 兼容  
**本质**：对象存储已成为分析引擎默认运行环境，挑战从“能连”升级为“抽象统一、行为稳定、成本可控”。

---

### 4.2 湖仓生态与外部表兼容
**涉及项目**：Doris、StarRocks、ClickHouse、Iceberg、Delta Lake、Arrow  
**具体诉求**：
- Doris：Iceberg schema evolution、v3 row lineage、Aliyun DLF REST catalog
- StarRocks：Iceberg quickstart、manifest stats 裁剪
- ClickHouse：DeltaLake Azure 兼容与 silent wrong result
- Iceberg：REST relation endpoint、Spark/Flink 适配、Kafka Connect
- Delta Lake：Kernel 化、多引擎 Flink Sink、CDC
- Arrow：Parquet / Flight SQL / ODBC  
**本质**：分析引擎正全面转向“数据库 + 数据湖接口层”双重角色。

---

### 4.3 执行引擎重构与资源治理
**涉及项目**：Doris、ClickHouse、DuckDB、Velox、Gluten、Databend  
**具体诉求**：
- Doris：表达式列式执行、聚合状态拆分、scan 全局内存控制
- ClickHouse：parallel replicas、MergeTree 读路径优化、后台锁竞争降低
- DuckDB：窗口函数绑定重构、LATERAL / DISTINCT correctness 修复
- Velox：HashTable stats、spill 上限、类型 coercion
- Gluten：Velox parallel execution POC、Spark 4.x 测试恢复
- Databend：planner overflow 修复、block/stream 管理、去全局单例化  
**本质**：各家都在从“功能可用”转向“算子接口统一、内存受控、边界正确”。

---

### 4.4 SQL 兼容性与复杂语义正确性
**涉及项目**：Doris、ClickHouse、DuckDB、StarRocks、Gluten、Velox、Databend  
**具体诉求**：
- Doris：标准 SQL `MERGE INTO`
- ClickHouse：`generate_series`、`JSON_VALUE`、WITH trailing comma
- DuckDB：窗口函数、LATERAL、宏、timestamptz、CLI SQL 格式化
- StarRocks：sql_mode 更严格，information_schema / explain / connector 类型映射
- Gluten / Velox：ANSI CAST、时间函数边界、Presto 兼容函数
- Databend：递归 CTE、binary literal `X'...'`、Variant cast  
**本质**：竞争焦点已从基础 SELECT 走向**标准 SQL、一致行为、复杂语义兼容**。

---

### 4.5 可观测性、调试与生产运维能力
**涉及项目**：Doris、StarRocks、Delta Lake、Databend、Gluten、Velox  
**具体诉求**：
- Doris：审计日志乱码、ErrorURL、报错信息长度配置
- StarRocks：安全接口、BE 配置与事务路径可见性
- Delta Lake：UC Commit Metrics
- Databend：OTLP trace dump、HTTP JSON result mode
- Gluten：UI fallback 信息与 Spark SQL tab 对齐
- Velox：runtime stats 规范化  
**本质**：用户越来越关心“为什么慢/为什么 fallback/为什么失败”，可观测性已成为核心竞争力。

---

## 5. 差异化定位分析

### 5.1 存储格式 / 数据模型定位

| 项目 | 核心定位 |
|---|---|
| **Apache Doris** | 自有存储 + 外部表/湖仓统一查询入口 |
| **ClickHouse** | MergeTree 自有存储主导，外部格式兼容强 |
| **StarRocks** | 自有 MPP 存储 + Lake / shared-data 并行 |
| **DuckDB** | 本地嵌入式列式执行，强开放格式能力 |
| **Iceberg** | 开放表格式标准，非执行引擎 |
| **Delta Lake** | 事务型湖表格式，偏 Spark / Kernel 生态 |
| **Arrow** | 列式内存与交换格式底座 |
| **Velox** | 执行引擎底座，不定义表格式 |
| **Gluten** | Spark 原生执行加速层，依赖 Velox/CH 后端 |
| **Databend** | 云原生数仓，自有存储与 SQL 服务并重 |

---

### 5.2 查询引擎设计差异

| 项目 | 查询引擎特征 |
|---|---|
| **Doris** | MPP + 向量化 + Pipeline，强调服务端一体化 |
| **ClickHouse** | 高性能列式执行，MergeTree 深度耦合，工程成熟度高 |
| **StarRocks** | MPP + CBO + Lake 查询优化，偏企业数仓 |
| **DuckDB** | 单机嵌入式、轻量但 SQL 覆盖深 |
| **Velox** | 可嵌入的通用执行引擎，服务 Presto/Spark/Gluten 等 |
| **Gluten** | Spark physical plan 下沉到原生引擎执行 |
| **Databend** | 云原生 SQL 引擎，兼顾 OLAP 与服务化 API |

---

### 5.3 目标负载类型差异

| 项目 | 更擅长的负载 |
|---|---|
| **Doris** | 实时分析、统一数仓、企业 BI、湖仓加速、云上导入 |
| **ClickHouse** | 海量明细分析、日志/事件分析、高吞吐读写 |
| **StarRocks** | 企业分析、Lakehouse 查询、混合部署 |
| **DuckDB** | 本地分析、嵌入式 ETL、Notebook / 数据科学 |
| **Iceberg / Delta** | 作为多引擎共享表层，服务 Spark/Flink/Trino/Doris 等 |
| **Arrow** | 数据交换、中间层、语言绑定、内存计算 |
| **Velox / Gluten** | 作为其他计算引擎的加速内核 |
| **Databend** | 云原生分析服务、SQL over HTTP、数据平台场景 |

---

### 5.4 SQL 兼容性侧重点
- **Doris / StarRocks**：MySQL 生态兼容 + 分析型扩展 + 湖表 DML
- **ClickHouse**：分析函数 / JSON / PostgreSQL 风格兼容逐步增强
- **DuckDB**：标准 SQL 与分析型高级语义覆盖极强
- **Databend**：标准 SQL 补齐中，逐步增强复杂语义
- **Velox / Gluten**：更多追随 Presto / Spark 语义
- **Iceberg / Delta / Arrow**：SQL 本身不是主战场，更偏协议与执行配套

---

## 6. 社区热度与成熟度

### 6.1 处于快速迭代阶段的项目
这些项目 PR/Issue 活跃，架构和功能都在明显扩张：
- **Apache Doris**
- **ClickHouse**
- **StarRocks**
- **DuckDB**
- **Delta Lake**
- **Velox**

特点：
- 新能力多
- 重构动作大
- 边界 bug 也多
- 需要持续回归验证

### 6.2 处于质量巩固 + 能力外延阶段的项目
- **Apache Iceberg**
- **Apache Arrow**
- **Apache Gluten**
- **Databend**

特点：
- 更多是接口完善、兼容性修补、连接器与工具链增强
- 核心定位已比较清晰
- 质量与生态闭环成为重点

### 6.3 成熟度判断
- **成熟且高速演进**：ClickHouse、Doris、DuckDB  
- **成熟但需重点盯稳定性窗口**：StarRocks  
- **生态底座型成熟项目**：Arrow、Iceberg  
- **快速成长期**：Databend、Gluten、Velox、Delta Lake Kernel 化路线

---

## 7. 值得关注的趋势信号

### 趋势 1：分析引擎正在全面“云对象存储原生化”
对象存储已不是附加能力，而是主战场。  
**对架构师建议**：选型时不能只看 S3/OSS“是否支持”，要看：
- 文件系统抽象是否统一
- close/flush/一致性窗口是否成熟
- TTL / PUT / 元数据访问成本是否可控
- 长任务与导入链路是否稳定

---

### 趋势 2：湖仓接口层成为数据库竞争核心
Doris、StarRocks、ClickHouse、DuckDB 都在加强 Iceberg/Delta/Parquet/Arrow 等能力；Iceberg、Delta、Arrow 本身也在补足连接器和协议层。  
**对数据工程师建议**：未来平台设计应优先采用**开放格式 + 可替换执行层**架构，而不是绑定单一引擎私有格式。

---

### 趋势 3：正确性问题比性能问题更受重视
多个项目都出现 wrong result、silent wrong result、NULL/NaN 语义偏差、窗口函数错误、Decimal 聚合错误、复杂类型过滤损坏。  
**启示**：生产选型中应把“复杂 SQL correctness 回归能力”放到与性能同等重要的位置，尤其在升级和跨引擎互通场景。

---

### 趋势 4：可观测性正在成为数据库工程能力分水岭
错误回显、trace、commit metrics、fallback 可视化、runtime stats 等能力正在快速增强。  
**对平台团队建议**：优先选择那些能暴露 query profile、执行路径、fallback 原因、对象存储行为的系统，便于降低长期运维成本。

---

### 趋势 5：执行引擎底座化趋势增强
Velox、Arrow、Gluten、Delta Kernel、Iceberg REST relation endpoint 都说明行业正在从“单体数据库”转向“协议层 + 执行层 + 服务层”解耦。  
**对技术决策者建议**：未来架构更值得投资的是：
- 开放表格式
- 可替换执行引擎
- 标准化数据交换接口
- 可观测、可治理的服务层

---

### 趋势 6：Doris 所代表的“一体化分析平台”路线仍具竞争力
在多项目分层解耦的大趋势下，Doris 依然坚持数据库一体化路线，但同时积极拥抱 Iceberg/Paimon/对象存储/多 Catalog。  
**参考价值**：对于需要“较低平台集成成本、统一 SQL 入口、企业级运维体验”的团队，Doris 这类路线仍然非常有吸引力；而对于追求多引擎自治、开放格式优先的团队，则更适合围绕 Iceberg/Delta/Arrow/Velox 组合式构建。

---

## 结论

从 2026-03-31 的横向动态看，OLAP 与分析型存储引擎生态已经进入**平台化竞争**阶段：  
竞争不再只是“谁更快”，而是“谁在开放格式、云存储、复杂 SQL、连接器、可观测性、升级稳定性上更完整”。  

对 **Apache Doris** 而言，其当前处于非常有竞争力的位置：  
- 社区活跃度处于头部梯队  
- 架构重构方向明确  
- 云化与湖仓兼容投入大  
- 但 Cloud Mode、新类型、边缘复杂场景稳定性仍需继续收敛  

如果用于技术决策，可用一句话概括：  
**Doris 正在从高性能 OLAP 数据库，进一步演进为面向云与湖仓的一体化分析平台；而整个生态则在同步向开放格式、可替换执行层和生产级治理能力收敛。**

如果你愿意，我还可以继续把这份报告整理成以下任一版本：
1. **管理层 1 页摘要版**
2. **面向研发负责人的技术风险跟踪版**
3. **适合飞书/邮件同步的表格精简版**

---

## 同赛道引擎详细报告

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse 项目动态日报（2026-03-31）

## 1. 今日速览

过去 24 小时内，ClickHouse 仓库保持**高活跃度**：Issues 更新 74 条、PR 更新 461 条，说明核心开发、CI 修复、功能迭代与社区反馈都非常密集。  
从内容结构看，今日重点集中在 **查询执行性能、并行副本、MergeTree 读路径、列统计、窗口函数优化、格式兼容性** 等方向。  
稳定性方面，社区持续暴露出若干值得关注的问题，包括 **26.2 INSERT 性能回退、Decimal 聚合正确性、S3 TTL PUT 放大、skip index 在 projection 场景失效、CI crash/sanitizer 问题**。  
与此同时，PR 侧显示项目仍在快速推进中，尤其是 **并行读取、自动统计信息、Arrow/Parquet/ORC 兼容性、Kafka 资源释放、JSON_VALUE 扩展、generate_series SQL 兼容** 等改进，整体项目健康度仍然较强。  

---

## 2. 项目进展

> 说明：给定数据未提供“今日已合并 PR 明细”，以下以**今日更新且最具影响力的 PR**为主，结合已关闭 Issue 判断当前推进方向。

### 查询引擎与执行层

- **并行副本错误修复：修复 parallel replicas 中 `Shard number is greater than shard count`**
  - PR: #101208  
  - 链接: ClickHouse/ClickHouse PR #101208
  - 价值：针对 Distributed 外层查询与 `_shard_num` 透传导致的逻辑错误，属于**分布式执行正确性修复**，有助于提升 parallel replicas 在复杂路由场景下的稳定性。

- **单 part 的 read-in-order 并行化优化**
  - PR: #100391  
  - 链接: ClickHouse/ClickHouse PR #100391
  - 价值：引入 `PrefetchingConcatProcessor`，改善单个 MergeTree part 被拆成多流时的读取效率，属于**MergeTree 读路径性能优化**。这与近期社区对查询性能与读放大的关注高度一致。

- **新增 `parallel_replicas_prefer_local_replica` 设置**
  - PR: #100139  
  - 链接: ClickHouse/ClickHouse PR #100139
  - 价值：允许并行读取时不强制优先本地副本，让负载均衡策略更灵活，对**多副本查询调度**和跨节点负载均衡是实用增强。

- **窗口函数上的谓词下推能力**
  - PR: #100784  
  - 链接: ClickHouse/ClickHouse PR #100784
  - 价值：为 `window` 场景增加 filter pushdown 设置，直接回应长期问题 #51203。该改动有望提升包含窗口函数视图的查询效率，但 PR 也明确提示**可能改变部分查询结果**，应视为“带语义风险的性能优化”。

### 存储引擎与统计信息

- **新列自动创建 minmax + uniq 统计信息**
  - PR: #101275  
  - 链接: ClickHouse/ClickHouse PR #101275
  - 价值：这是列统计能力落地的重要一步，直接呼应长期讨论 Issue #55065。若后续稳定，将推动 **Join Reordering、PREWHERE 选择性优化、自动类型/编码优化** 等更高级优化器能力。

- **Reduce lock contention in MergeTreeBackgroundExecutor**
  - PR: #98573  
  - 链接: ClickHouse/ClickHouse PR #98573
  - 价值：减少后台任务执行器锁竞争，属于**MergeTree 后台调度稳定性/吞吐优化**，对 merge/mutation/background task 密集场景有积极意义。

- **Better `DiskLocal` startup**
  - PR: #101199  
  - 链接: ClickHouse/ClickHouse PR #101199
  - 价值：简化 `DiskLocalCheckThread` 与访问检查逻辑，偏向**本地磁盘初始化与访问检测可靠性**改进。

### SQL 功能与兼容性

- **`JSON_VALUE` 支持 tuple / array 输出**
  - PR: #101102  
  - 链接: ClickHouse/ClickHouse PR #101102
  - 价值：允许一次调用提取多个 JSONPath，减少重复解析 JSON 的成本，兼顾**表达能力与性能**。

- **`generate_series` 支持负 step**
  - PR: #101056  
  - 链接: ClickHouse/ClickHouse PR #101056
  - 价值：提升与 PostgreSQL 的行为兼容度，是典型的**SQL 易用性/兼容性增强**。

- **Play UI 悬浮信息交互优化**
  - PR: #101118  
  - 链接: ClickHouse/ClickHouse PR #101118
  - 价值：虽非内核改动，但改善了 Web UI 的交互细节，体现项目对开发者体验的持续投入。

### 外部格式与连接生态

- **Arrow Flight SQL 支持**
  - PR: #91170  
  - 链接: ClickHouse/ClickHouse PR #91170
  - 价值：这是面向生态互联的重要特性，若合入，将显著增强 ClickHouse 与现代分析工具链之间的高速互通能力。

- **支持 `Nullable(Tuple)` 在 Arrow / ArrowStream / ORC / legacy Parquet**
  - PR: #101272  
  - 链接: ClickHouse/ClickHouse PR #101272
  - 价值：提升复杂嵌套类型在多格式间的兼容性，对数据交换链路非常关键。

- **Kafka 表 `DROP TABLE` 卡死修复**
  - PR: #101158  
  - 链接: ClickHouse/ClickHouse PR #101158
  - 价值：针对 broker 不可达 + rebalance 中的 librdkafka 阻塞问题，属于**外部连接器稳定性修复**，对流式接入用户很重要。

---

## 3. 社区热点

### 1）26.2 版本 INSERT 性能回退 3 倍
- Issue: #99241  
- 链接: ClickHouse/ClickHouse Issue #99241
- 热度：评论 23
- 分析：这是今天最值得关注的生产级反馈之一。问题明确指向 **25.12 → 26.2 升级后 ReplacingMergeTree 相同 INSERT 查询变慢 3 倍**。  
- 背后诉求：用户最关心的是**版本升级后的吞吐可预测性**，尤其在写入密集型 OLAP 场景中，任何版本回归都会直接影响扩容成本和 SLA。  
- 关注点：目前未见直接关联 fix PR 出现在给定数据中，建议维护者优先建立最小复现、profile、perf flamegraph 对比。

### 2）ClickHouse 2026 路线图持续讨论
- Issue: #93288  
- 链接: ClickHouse/ClickHouse Issue #93288
- 热度：评论 21，👍 5
- 分析：路线图仍在活跃更新，说明项目方向并未冻结。结合今日 PR，可观察到路线图上的几个实际落点：**列统计、格式支持、实验性缓存、并行副本、SQL 兼容增强**。

### 3）URL 处理函数需求持续存在
- Issue: #54485  
- 链接: ClickHouse/ClickHouse Issue #54485
- 热度：评论 18
- 分析：`resolveRelativeURL` 是典型“看似小功能、实则高频 ETL 需求”的请求，反映 ClickHouse 正被越来越多用作**半结构化文本/网页数据处理引擎**，而不仅仅是传统数仓。

### 4）CI crash：MergeTreeRangeReader 调整最后 granule 潜在问题
- Issue: #100769  
- 链接: ClickHouse/ClickHouse Issue #100769
- 热度：评论 13
- 分析：虽然来自机器人自动上报，但位置落在 MergeTreeRangeReader，说明**底层读路径仍存在潜在边界条件问题**。若与近期读优化 PR 叠加，需要特别注意回归风险。

### 5）WITH 子句末尾 trailing comma 支持
- Issue: #90780  
- 链接: ClickHouse/ClickHouse Issue #90780
- 热度：评论 8
- 分析：这是典型 SQL 书写便利性诉求。随着 ClickHouse 被更广泛用于交互式分析、LLM 生成 SQL、自动化模板拼接，此类语法宽容度需求会持续增加。

---

## 4. Bug 与稳定性

> 按严重程度排序，并标注是否看到潜在修复线索。

### P1：生产性能回退

1. **INSERT 查询在 26.2 较 25.12 慢 3 倍**
   - Issue: #99241  
   - 链接: ClickHouse/ClickHouse Issue #99241
   - 影响：高，直接影响升级决策和写入 SLA。
   - 状态：Open
   - 是否已有 fix PR：**未见明确对应 PR**

### P1：查询正确性问题

2. **`MAX()/MIN()` on Decimal + `GROUP BY` 返回错误结果**
   - Issue: #100740  
   - 链接: ClickHouse/ClickHouse Issue #100740
   - 影响：高，属于**结果错误**，比性能问题更严重。
   - 范围：自 26.1 起，正负值混合数据集。
   - 状态：Open
   - 是否已有 fix PR：**未见明确对应 PR**

3. **布尔语义/类型转换异常：`(2147483648 > b) AND 2147483648` 与预期不一致**
   - Issue: #101269  
   - 链接: ClickHouse/ClickHouse Issue #101269
   - 影响：高，SQLancer 发现，属于**表达式语义一致性/正确性缺陷**。
   - 状态：Open
   - 是否已有 fix PR：未见

4. **Azure DeltaLake 时间旅行设置被静默忽略，返回错误数据而非报错**
   - Issue: #100502  
   - 链接: ClickHouse/ClickHouse Issue #100502
   - 影响：高，属于“**silent wrong result**”类型。
   - 状态：Open
   - 是否已有 fix PR：未见

### P2：索引/优化器失效

5. **`use_skip_indexes_on_data_read=1` 在带 projection 的表上绕过 skip indexes**
   - Issue: #100783  
   - 链接: ClickHouse/ClickHouse Issue #100783
   - 影响：中高，会造成**查询放大和性能退化**，且 EXPLAIN 显示与实际执行不一致，容易误导排障。
   - 状态：Open
   - 是否已有 fix PR：未见

6. **新 analyzer 读行数更多**
   - Issue: #78166  
   - 链接: ClickHouse/ClickHouse Issue #78166
   - 影响：中高，说明新优化器/分析器在某些查询上未达到旧行为的效率。
   - 状态：Open
   - 是否已有 fix PR：暂无直接对应，但列统计、窗口 pushdown 等改动显示优化器仍在快速演进。

### P2：对象存储与外部表稳定性

7. **S3 TTL 触发大量 PUT 请求**
   - Issue: #100960  
   - 链接: ClickHouse/ClickHouse Issue #100960
   - 影响：中高，可能显著增加对象存储成本与 TTL 迁移抖动。
   - 状态：Open
   - 是否已有 fix PR：未见

8. **`deltaLakeAzure` 读取 schema evolution 表时报 `NOT_IMPLEMENTED`**
   - Issue: #100438  
   - 链接: ClickHouse/ClickHouse Issue #100438
   - 影响：中，限制 Azure Delta Lake 接入可用性。
   - 状态：Open
   - 是否已有 fix PR：未见

9. **Kafka 表 `DROP TABLE` 卡死**
   - PR: #101158  
   - 链接: ClickHouse/ClickHouse PR #101158
   - 影响：中高，涉及资源释放和 DDL 可用性。
   - 状态：**已有修复 PR**

### P3：CI / Crash / Sanitizer

10. **MergeTreeRangeReader granule 调整潜在 crash**
    - Issue: #100769  
    - 链接: ClickHouse/ClickHouse Issue #100769
    - 状态：Open
    - 是否已有 fix PR：未见

11. **USearch ASan heap-buffer-overflow**
    - Issue: #100556  
    - 链接: ClickHouse/ClickHouse Issue #100556
    - 状态：Open
    - 是否已有 fix PR：未见

12. **MemorySanitizer use-of-uninitialized-value**
    - Issue: #101232  
    - 链接: ClickHouse/ClickHouse Issue #101232
    - 状态：Open
    - 是否已有 fix PR：未见

13. **EXECUTE AS + analyzer 触发逻辑错误**
    - Issue: #100695  
    - 链接: ClickHouse/ClickHouse Issue #100695
    - 状态：Open
    - 是否已有 fix PR：未见

### 今日已关闭、代表性稳定性问题

- **SELECT/WHERE 复用表达式导致 `AMBIGUOUS_COLUMN_NAME`**
  - Issue: #95319  
  - 链接: ClickHouse/ClickHouse Issue #95319
  - 状态：Closed  
  - 意义：说明 analyzer / 名称解析类问题在持续收敛。

- **浮点过滤下主键索引不使用**
  - Issue: #38051  
  - 链接: ClickHouse/ClickHouse Issue #38051
  - 状态：Closed  
  - 意义：历史性能类问题继续被清理。

- **带 window function 的 view 不做谓词下推**
  - Issue: #51203  
  - 链接: ClickHouse/ClickHouse Issue #51203
  - 状态：Closed  
  - 对应推进：PR #100784 提供功能型解决方案。

---

## 5. 功能请求与路线图信号

### 值得关注的新/热功能诉求

1. **`resolveRelativeURL` 函数**
   - Issue: #54485  
   - 链接: ClickHouse/ClickHouse Issue #54485
   - 信号：属于轻量但高实用性的字符串/URL 处理增强，适合纳入常规版本。

2. **`h3PolygonToCellsExperimental`**
   - Issue: #98981  
   - 链接: ClickHouse/ClickHouse Issue #98981
   - 信号：地理空间分析仍在增强，说明 H3 相关函数仍有扩展空间。

3. **rolling hash 函数**
   - Issue: #81183  
   - 链接: ClickHouse/ClickHouse Issue #81183
   - 信号：显示 ClickHouse 想覆盖更复杂的文本切分、内容去重、CDC/分块识别等高级场景。

4. **`port_offset` 配置参数**
   - Issue: #96407  
   - 链接: ClickHouse/ClickHouse Issue #96407
   - 信号：偏开发测试体验，但很适合多实例本地开发与 CI 环境。

5. **WITH 前支持 trailing comma**
   - Issue: #90780  
   - 链接: ClickHouse/ClickHouse Issue #90780
   - 信号：SQL 宽容语法和易用性在持续被重视。

### 已有 PR 显示“可能进入下一版本”的方向

- **列统计自动化**
  - Issue: #55065 + PR #101275  
  - 链接: ClickHouse/ClickHouse Issue #55065 / ClickHouse/ClickHouse PR #101275
  - 判断：很可能是下一阶段优化器能力建设的核心基础设施。

- **Arrow Flight SQL**
  - PR: #91170  
  - 链接: ClickHouse/ClickHouse PR #91170
  - 判断：若测试成熟，潜在影响面很大，属于生态战略级能力。

- **FSST serialization**
  - PR: #91416  
  - 链接: ClickHouse/ClickHouse PR #91416
  - 判断：实验性较强，但若压缩/序列化收益显著，未来可能影响文本列存储与传输效率。

- **PartialAggregateCache**
  - PR: #93757  
  - 链接: ClickHouse/ClickHouse PR #93757
  - 判断：若实验效果稳定，将是 GROUP BY 场景的重要性能卖点。

---

## 6. 用户反馈摘要

### 升级后的性能可预测性仍是第一痛点
- 代表 Issue: #99241  
- 链接: ClickHouse/ClickHouse Issue #99241
- 用户核心诉求：**升级不应显著牺牲写入性能**，尤其在 ReplacingMergeTree 等常见引擎上，用户期望有明确的回归检测与版本建议。

### 优化器“看起来生效、实际没生效”的问题最难排查
- 代表 Issue: #100783  
- 链接: ClickHouse/ClickHouse Issue #100783
- 用户痛点：`EXPLAIN` 与真实执行路径不一致时，用户很难建立对优化器的信任，也会加大支持成本。

### 对象存储成本敏感度很高
- 代表 Issue: #100960  
- 链接: ClickHouse/ClickHouse Issue #100960
- 用户场景：冷热分层、TTL 到 S3 是常见部署方式；大量意外 PUT 会直接变成云账单问题，而不仅是技术问题。

### 湖仓/外部格式接入要“正确失败”，不能静默错
- 代表 Issues: #100438, #100502  
- 链接: ClickHouse/ClickHouse Issue #100438 / ClickHouse/ClickHouse Issue #100502
- 用户诉求：面对 Delta Lake / Azure 等外部格式场景，用户更能接受“不支持时报错”，而不能接受“悄悄忽略设置并返回错误数据”。

### SQL 易用性需求明显上升
- 代表 Issue/PR: #90780, #101056, #101102  
- 链接: ClickHouse/ClickHouse Issue #90780 / ClickHouse/ClickHouse PR #101056 / ClickHouse/ClickHouse PR #101102
- 用户期待：更接近 PostgreSQL 的行为、更灵活的 JSON 提取、更宽容的语法，都说明 ClickHouse 正被更频繁地用于交互式 SQL 工作流。

---

## 7. 待处理积压

> 这里重点提示“长期存在且仍有现实价值”的议题。

### 长期功能/架构类议题

- **Column statistics**
  - Issue: #55065  
  - 链接: ClickHouse/ClickHouse Issue #55065
  - 状态：自 2023-09 起持续讨论
  - 关注原因：这是优化器能力演进的基石；当前已有 PR #101275，建议维护者加快形成可交付闭环。

- **`resolveRelativeURL`**
  - Issue: #54485  
  - 链接: ClickHouse/ClickHouse Issue #54485
  - 状态：自 2023-09 起
  - 关注原因：实现复杂度可能不高，但对日志/网页抓取/ETL 用户价值明显。

- **WSL 文件句柄占用导致 rename EACCESS**
  - Issue: #56288  
  - 链接: ClickHouse/ClickHouse Issue #56288
  - 状态：自 2023-11 起，👍 6
  - 关注原因：虽然不是主流生产环境，但影响开发者体验，且涉及文件生命周期管理。

### 长周期实验性 PR

- **FSST serialization**
  - PR: #91416  
  - 链接: ClickHouse/ClickHouse PR #91416
  - 状态：2025-12 创建，仍在推进
  - 关注原因：序列化与压缩栈是 ClickHouse 的长期差异化能力，建议明确实验边界和 benchmark。

- **Arrow Flight SQL**
  - PR: #91170  
  - 链接: ClickHouse/ClickHouse PR #91170
  - 状态：2025-12 创建，仍未落地
  - 关注原因：生态价值高，建议维护者明确剩余 blocker。

- **PartialAggregateCache**
  - PR: #93757  
  - 链接: ClickHouse/ClickHouse PR #93757
  - 状态：2026-01 创建
  - 关注原因：一旦稳定，可能成为大查询缓存的重要卖点，值得继续投入。

---

## 8. 总结判断

今天的 ClickHouse 呈现出非常典型的“**高速演进中的成熟分析数据库**”特征：  
一方面，PR 面显示项目在 **执行引擎、MergeTree、统计信息、格式生态、SQL 易用性** 上持续扩张；另一方面，Issue 面也暴露出高速迭代伴随的压力，尤其是 **版本性能回归、查询正确性、对象存储行为、外部格式一致性**。  

从项目健康度看：
- **活跃度：高**
- **创新速度：高**
- **稳定性风险：中等偏高，集中在新版本回归与实验/边界场景**
- **中短期重点建议：优先处理 26.2 INSERT 回退、Decimal 聚合错误、skip index + projection 失效、DeltaLake Azure silent wrong result**

如果你愿意，我还可以继续把这份日报整理成更适合团队内部同步的两种格式之一：
1. **面向管理层的一页简报版**
2. **面向内核开发者的技术跟踪版**

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

以下是 **DuckDB 项目 2026-03-31 动态日报**。

---

# DuckDB 项目动态日报 · 2026-03-31

## 1. 今日速览

过去 24 小时 DuckDB 维持了**高活跃度**：Issues 更新 17 条、PR 更新 51 条，说明核心开发与社区反馈循环都非常密集。  
从内容看，今天的重点集中在三类：**查询正确性修复、CLI/开发者体验增强、Variant/Arrow/ADBC 生态兼容性处理**。  
已关闭 8 个 Issue、已合并/关闭 24 个 PR，表明维护团队在快速清理问题与推进分支合并，但同时仍有多起**错误结果（wrong result）/回归类问题**新近出现，需要持续关注稳定性。  
整体健康度仍然良好，不过 1.5.x 线附近暴露出一些**窗口函数、LATERAL、宏、时区类型、CLI on Windows** 的边缘回归信号。  

---

## 2. 项目进展

### 2.1 今日关闭/合并的重点 PR

#### ① 修复 ADBC use-after-free 内存安全问题
- PR: #21605 `fix(adbc): err use after free`  
- 状态: **已关闭**
- 链接: duckdb/duckdb PR #21605

该 PR 针对 #21584 所报告的 ADBC 场景下 **use-after-free** 缺陷，识别出 4 处相同模式并通过单元测试修复。  
这类问题虽然主要影响客户端接口层，但属于**内存安全级别**问题，若可被稳定触发，可能导致驱动崩溃甚至未定义行为。  
它表明 DuckDB 在 Arrow/ADBC 生态集成层的测试覆盖正在增强。

---

#### ② 主分支合并 `v1.5-variegata`
- PR: #21720 `Merge v1.5-variegata into main`
- 状态: **已关闭**
- 链接: duckdb/duckdb PR #21720

这是今天最关键的工程推进之一，意味着 1.5 分支上的一批改动已继续向主线汇合。  
摘要中特别提到 `window_self_join.cpp` 合并时需要“creative”处理，说明**窗口优化器相关逻辑仍在复杂演进中**。  
结合今日多个窗口函数/分区排序相关问题，可以判断：**窗口函数绑定与优化仍是近期核心改动面，也是回归高风险区域**。

---

#### ③ 测试基础设施向版本统一靠拢
- PR: #21708 `Test runner: Support replacement without dollar ({i} instead of ${i}) in loop iterators`
- 状态: **已关闭**
- 链接: duckdb/duckdb PR #21708

这属于测试框架层改进，为统一测试参数写法做准备。  
虽然对最终用户不可见，但对 DuckDB 这种 SQL 引擎项目非常重要：**测试 DSL 统一通常意味着未来会更容易批量覆盖语义矩阵、回归组合和版本 backport 场景**。

---

#### ④ 对外开放更多过滤器/Join 内部结构只读接口
- PR: #21695 `Add read-only accessors to BloomFilter and BFTableFilter`
- PR: #21696 `Add read-only accessors to PerfectHashJoinExecutor and PerfectHashJoinFilter`
- PR: #21697 `Add read-only accessors to PrefixRangeFilter and PrefixRangeTableFilter`
- 状态: **均已关闭**
- 链接:
  - duckdb/duckdb PR #21695
  - duckdb/duckdb PR #21696
  - duckdb/duckdb PR #21697

这些 PR 的共同方向是：向扩展/外部系统暴露执行器过滤结构的**只读 introspection 接口**。  
这释放出两个信号：
1. DuckDB 正在继续增强**扩展生态的可观测性/可集成性**；
2. 执行器中的 Bloom Filter、Perfect Hash Join、Prefix Range Filter 等机制，正在从“内部实现”逐步转为“可被扩展感知和利用”的能力。

对做联邦查询、远端执行、定制存储/索引插件的开发者尤其有价值。

---

#### ⑤ LEFT LATERAL 过滤错误已有修复尝试
- PR: #21687 `Preserve LEFT LATERAL filters during pushdown`
- 状态: **已关闭**
- 链接: duckdb/duckdb PR #21687

该 PR 直接对应 wrong-result Issue #21609。  
虽然 PR 最终关闭，但可以确认维护者已快速定位问题根因：**FilterPushdown 在 LEFT dependent/delim join 上错误地下推了应保留的过滤条件**。  
这类问题说明优化器在高级 SQL 语义（LATERAL + NULL-rejecting filter）上仍需更多保护性测试。

---

### 2.2 今日活跃中的重点 PR

#### ⑥ CLI 将支持 SQL 格式化
- PR: #21725 `Add support for formatting SQL statements to the CLI`
- 状态: **OPEN**
- 链接: duckdb/duckdb PR #21725

这是今天最具“用户可见度”的新功能之一。  
计划支持：
- `duckdb -format-file [FILE]`
- 对 stdin / 交互式 SQL 进行格式化
- 依托 CLI bunded 的 `autocomplete` extension 实现

这会明显改善 DuckDB 作为本地分析终端/教学工具/脚本工具的体验，尤其利好 notebook、脚本生成 SQL、测试最小复现整理等场景。

---

#### ⑦ Variant 编码兼容性回补
- PR: #21710 `[Variant] Re-add the removed variant_legacy_encoding setting`
- 状态: **OPEN**
- 链接: duckdb/duckdb PR #21710

这是今天很强的**格式兼容性信号**。  
原因是外部 writer 端尚未及时跟进 Parquet `VariantLogicalType`，导致 DuckDB 需要重新兼容旧编码路径。  
这说明：
- Variant 生态仍在落地期；
- 真实世界 Parquet/Delta/外部 writer 兼容性比规范推进更慢；
- DuckDB 团队愿意为兼容性做现实妥协，而不是强行只保留“理想格式”。

---

#### ⑧ 窗口函数绑定重构继续推进
- PR: #21562 `Internal #8500: Window Function Binding`
- 状态: **OPEN / Ready For Review**
- 链接: duckdb/duckdb PR #21562

该 PR 涉及：
- 将 window binding 从 `TransformFuncCall` 挪到 `BindWindow`
- `LEAD/LAG` 处理方式调整
- `RESPECT/IGNORE NULLS` 校验移到 binder

这是较大的**语义层重构**。  
它有望提升 SQL 兼容性与实现一致性，但也与今日多个窗口函数相关回归 Issue 构成呼应：**近期窗口子系统需要重点回归测试**。

---

#### ⑨ CREATE TRIGGER 的 catalog 支持
- PR: #21438 `Add catalog storage and introspection for CREATE TRIGGER`
- 状态: **OPEN**
- 链接: duckdb/duckdb PR #21438

该 PR 表明 DuckDB 正在向更完整的数据库对象模型推进。  
目前重点是：
- TriggerCatalogEntry
- `CREATE TRIGGER` 绑定校验
- introspection / `ToSQL`

这并不意味着触发器执行语义已完全落地，但至少说明**DDL 元数据层面已在铺路**。

---

#### ⑩ 统计函数 overflow 行为拟改为 IEEE-754 风格
- PR: #21673 `Return inf/nan instead of throwing for stddev/variance overflow`
- 状态: **OPEN / CI Failure**
- 链接: duckdb/duckdb PR #21673

若该改动被接受，DuckDB 在统计聚合上会更接近某些数值计算系统的行为：  
溢出时返回 `inf/nan`，而不是抛出异常。  
这对分析型工作负载更友好，但也会改变部分应用对错误处理的预期，值得关注是否会成为后续版本行为变更点。

---

## 3. 社区热点

### 3.1 历史高关注功能请求关闭：Arrow Flight SQL
- Issue: #3099 `FR: implement Arrow Flight SQL`
- 状态: **CLOSED**
- 👍: 18 / 评论: 16
- 链接: duckdb/duckdb Issue #3099

这是今天反应数最高的 Issue。  
Arrow Flight SQL 的诉求，本质上是希望 DuckDB 更深地融入 Arrow 生态中的**高性能 client-server SQL 通道**。  
该需求被关闭，说明现阶段 DuckDB 可能仍将重心放在：
- 嵌入式/本地执行引擎
- Arrow 数据交换能力
- ADBC / 文件格式 / 扩展集成  
而不是直接走完整的 Flight SQL 服务端协议路线。

**技术诉求分析：**
用户希望 DuckDB 不只是“能读写 Arrow”，而是成为 Arrow 原生生态中的查询后端节点。  
关闭并不等于需求消失，但说明其优先级目前不高。

---

### 3.2 S3 分区 COPY 内存占用过高仍在审查
- Issue: #11817 `Out-of-memory error when performing partitioned copy to S3`
- 状态: **OPEN / under review**
- 评论: 14 / 👍: 9
- 链接: duckdb/duckdb Issue #11817

这是今天最值得持续跟踪的性能/资源管理问题之一。  
场景是：
- 执行 `COPY ... TO S3`
- 使用 hive partitioning
- 数据量不大却在较高内存限制下 OOM

**背后技术诉求：**
用户期待 DuckDB 在云对象存储写出时具备更好的**分区写流式化能力、内存上界可预测性、分区并发控制**。  
这类问题直接影响 DuckDB 作为 ETL/湖仓工具的可靠性。

---

### 3.3 `.duckdb` 文件持续膨胀问题已关闭
- Issue: #17778 `[reproduced] .duckdb file size growing`
- 状态: **CLOSED**
- 评论: 15
- 链接: duckdb/duckdb Issue #17778

该 Issue 来自实际缓存数据库使用场景：将大量 JSON 存入单字段表。  
文件体积增长问题被关闭，说明相关解释、修复或使用建议已给出。  
这类反馈非常典型，反映用户正在把 DuckDB 当作：
- 本地缓存数据库
- 嵌入式对象存储索引
- 半结构化数据暂存层

其核心诉求是**空间回收机制透明、VACUUM/检查点行为可理解**。

---

### 3.4 “LIMIT + read_parquet” 打开文件过多问题仍未解决
- Issue: #18831 `Too many open files read_parquet with LIMIT`
- 状态: **OPEN / under review, Needs Documentation**
- 链接: duckdb/duckdb Issue #18831

这个问题很有代表性：  
不加 `LIMIT` 正常，带 `LIMIT` 反而触发 too many open files。  
它提示 DuckDB 在 Parquet 扫描的**早停策略、文件句柄生命周期、并行调度**上可能存在特殊路径。  
由于已经被标注 `Needs Documentation`，很可能部分行为与当前实现方式有关，但从用户视角看仍是不符合直觉的。

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P0 / 查询正确性与数据错误风险

#### 1) `row_number() OVER (PARTITION BY ...)` 在列顺序不一致时静默交换列值
- Issue: #21722
- 状态: **OPEN / needs triage**
- 链接: duckdb/duckdb Issue #21722

这是今天最严重的新问题之一。  
描述指出：当 `PARTITION BY` 列顺序与表 schema 顺序不一致时，输出列值会被**静默交换**，属于**数据损坏/错误结果**级别回归。  
且明确标注为 **v1.5.1 regression**。  
**尚未看到对应 fix PR。**

---

#### 2) `SELECT DISTINCT` in CTE + LEFT JOIN empty table 间歇性返回缺失行
- Issue: #21719
- 状态: **OPEN**
- 链接: duckdb/duckdb Issue #21719

这是另一个 wrong-result 问题，而且最危险之处在于**间歇性**。  
当 `DISTINCT` 替换成 `GROUP BY` 后问题消失，暗示优化器/去重实现与后续 join 交互存在错误。  
**尚未看到 fix PR。**

---

#### 3) LEFT JOIN LATERAL 过滤错误结果问题已关闭
- Issue: #21609
- 状态: **CLOSED**
- 链接: duckdb/duckdb Issue #21609
- 相关 PR: #21687

问题表现为：外层 `WHERE l.col IS NOT NULL` 本应滤掉无匹配行，但 DuckDB 保留了来自 `LEFT JOIN LATERAL ... ON TRUE` 的行。  
这是典型的优化器下推破坏 SQL 语义。  
虽然关联 PR 已关闭，但 Issue 已关闭，说明修复可能已通过其他方式吸收或确认处理。

---

#### 4) CTE + ROW_NUMBER + 混合 VARCHAR/DATE 分区导致 INTERNAL Error
- Issue: #21560
- 状态: **CLOSED**
- 链接: duckdb/duckdb Issue #21560

这是窗口函数 + predicate pushdown 的另一个复杂错误。  
问题根因是 DuckDB 在谓词下推时混淆了 VARCHAR 与 DATE 列位置，触发断言。  
已关闭说明问题已被修复或通过 PR 处理，进一步佐证：**窗口/推导绑定路径是当前活跃修复区。**

---

### P1 / 崩溃、内存安全、接口稳定性

#### 5) ADBC prepared statements 触发 heap-use-after-free
- Issue: #21626
- 状态: **OPEN / reproduced**
- 链接: duckdb/duckdb Issue #21626
- 相关 PR: #21605

这是非常明确的内存安全问题。  
虽然 #21605 已处理同类模式，但该 Issue 仍处于 Open，说明还需要确认是否完全覆盖。  
建议维护者继续验证 ADBC 生命周期管理是否还有遗漏。

---

#### 6) Arrow format string 参数化类型解析崩溃
- Issue: #21691
- 状态: **CLOSED**
- 链接: duckdb/duckdb Issue #21691

`std::stoi` 在处理 Arrow C Data Interface format string 时崩溃，涉及 fixed-size binary / fixed-size list / 参数化类型（如带 CRS 的 GEOMETRY）。  
这表明 Arrow schema parser 对复杂格式字符串的鲁棒性存在边角问题。  
已关闭是积极信号，说明修复响应迅速。

---

#### 7) Windows 11 CLI 显示异常/提示符错误
- Issues:
  - #21585 `Duckdb 1.5.0 CLI does not prompt correctly on Windows 11`
  - #21571 `DuckDB CLI: Windows 11 Command Prompt & PowerShell in Admin Mode Show Random Characters`
  - #21378 `.tables` / `-table` 输出问题
- 状态: **均已关闭**
- 链接:
  - duckdb/duckdb Issue #21585
  - duckdb/duckdb Issue #21571
  - duckdb/duckdb Issue #21378

这些问题集中反映 1.5.x CLI 在 Windows 终端兼容性上的回归。  
今天已关闭多项，说明维护者对用户最直观的 CLI 体验问题响应较快。

---

### P2 / 性能、资源与兼容性问题

#### 8) `COPY` 到 S3 分区写时 OOM
- Issue: #11817
- 状态: **OPEN / under review**
- 链接: duckdb/duckdb Issue #11817

对对象存储/数据湖工作负载影响较大，建议持续关注。

---

#### 9) `read_parquet(... LIMIT ...)` 导致 too many open files
- Issue: #18831
- 状态: **OPEN / under review**
- 链接: duckdb/duckdb Issue #18831

偏执行资源管理问题，影响大目录场景稳定性。

---

#### 10) 更新列为 NULL 性能从 2 秒降到 3 分钟
- Issue: #21675
- 状态: **OPEN / reproduced**
- 链接: duckdb/duckdb Issue #21675

该问题很可能涉及：
- 索引维护
- MVCC/update path
- NULL 值相关统计/存储布局  
虽然不是 correctness bug，但性能退化幅度极大，值得重视。

---

#### 11) 宏中使用 `timestamptz` 出现回归
- Issue: #21682
- 状态: **OPEN / reproduced**
- 链接: duckdb/duckdb Issue #21682

这说明时间类型与宏展开/绑定路径之间存在回归。  
若影响范围广，会波及模板 SQL、参数化分析脚本等高级用户场景。

---

#### 12) 同一 session 中第二次连接未正确使用新的 attach string
- Issue: #21618
- 状态: **OPEN / reproduced**
- 链接: duckdb/duckdb Issue #21618

这是连接管理/会话状态复用问题，特别影响 Python 多连接或 DuckLake/远端附加场景。  
从用户描述看，存在**旧 attach 参数残留**的风险。

---

#### 13) 无法创建空 Variant 对象
- Issue: #21717
- 状态: **OPEN / needs triage**
- 链接: duckdb/duckdb Issue #21717

`select {}::VARIANT` 语法失败，而带字段对象正常。  
这是 Variant 语法/类型系统边界行为问题。  
严重性不高，但影响新类型的完整性与直觉一致性。

---

## 5. 功能请求与路线图信号

### 5.1 CLI 正在朝“更完整开发工具”演进
- PR: #21725
- 链接: duckdb/duckdb PR #21725

SQL 格式化能力进入 CLI，说明 DuckDB 不再只是“执行 SQL 的壳”，而是在强化：
- 可读性
- 复现整理
- 交互式开发体验

这一特性**很可能较快进入下一小版本**，因为实现边界清晰、用户价值明确、风险相对可控。

---

### 5.2 Trigger 元数据能力是中期路线信号
- PR: #21438
- 链接: duckdb/duckdb PR #21438

虽然未必马上交付完整触发器执行语义，但 catalog/introspection 先行，是典型的“先打地基”路线。  
这通常意味着 DuckDB 在逐步补齐更传统数据库对象能力，用于兼容更多 SQL DDL 工作流。

---

### 5.3 JSON 功能仍在扩展
- PR: #21668 `Add json_merge_patch_diff()`
- 状态: **OPEN / Changes Requested**
- 链接: duckdb/duckdb PR #21668

该 PR 提议增加：
- `json_merge_patch_diff(old, new) -> JSON`

这是对现有 `json_merge_patch` 的逆操作补全。  
如果被接纳，会显著提升 DuckDB 在 JSON 文档差异计算、审计、CDC 补丁生成方面的表达力。  
但目前被要求修改，进入下一版本的确定性一般。

---

### 5.4 Arrow/ADBC/Variant 生态兼容仍是重要方向
- Issue: #3099（Flight SQL，已关闭）
- Issue: #21626（ADBC 内存安全）
- PR: #21710（Variant legacy encoding）
- 链接:
  - duckdb/duckdb Issue #3099
  - duckdb/duckdb Issue #21626
  - duckdb/duckdb PR #21710

综合来看，DuckDB 的路线不是简单扩展 SQL 方言，而是在努力巩固其作为**嵌入式分析引擎 + 开放格式枢纽**的角色。  
其中真正优先级高的不是 Flight SQL 服务化，而是：
- ADBC 稳定性
- Parquet/Variant 兼容性
- Arrow schema/类型系统鲁棒性

---

## 6. 用户反馈摘要

### 6.1 用户把 DuckDB 当“本地分析数据库 + 缓存层 + 半结构化存储”
- 相关 Issue: #17778
- 链接: duckdb/duckdb Issue #17778

用户将大量 JSON 放入单列表作为缓存，体现出 DuckDB 正被用于轻量嵌入式数据层。  
痛点集中在：
- 文件膨胀可解释性
- 空间回收预期
- 长期运行的存储稳定性

---

### 6.2 云对象存储工作负载对资源控制要求越来越高
- 相关 Issue: #11817
- 链接: duckdb/duckdb Issue #11817

用户期待在 S3 分区写出时：
- 更低峰值内存
- 更明确的 partition writer 生命周期
- 更接近流式系统的资源行为

这说明 DuckDB 已深度进入数据湖 ETL 场景，不再只是本地 CSV/Parquet 分析器。

---

### 6.3 用户对“LIMIT 应该更轻量”的直觉很强
- 相关 Issue: #18831
- 链接: duckdb/duckdb Issue #18831

`LIMIT` 反而导致文件句柄耗尽，很违背用户认知。  
这类问题即使技术上可解释，也会显著损害对引擎执行策略“可预测性”的信任。

---

### 6.4 Windows CLI 仍是重要用户入口
- 相关 Issues: #21585, #21571, #21378
- 链接:
  - duckdb/duckdb Issue #21585
  - duckdb/duckdb Issue #21571
  - duckdb/duckdb Issue #21378

连续多个 Windows CLI 反馈说明：
- CLI 并非边缘组件，而是重要分发入口；
- Windows CMD/PowerShell/管理员模式兼容性对实际采用率有影响；
- 团队对这类问题关闭较快，说明对开发者体验较重视。

---

### 6.5 高阶 SQL 用户正在密集验证边缘语义
- 相关 Issues: #21609, #21560, #21722, #21719, #21682
- 链接:
  - duckdb/duckdb Issue #21609
  - duckdb/duckdb Issue #21560
  - duckdb/duckdb Issue #21722
  - duckdb/duckdb Issue #21719
  - duckdb/duckdb Issue #21682

这些问题共同反映：  
DuckDB 用户群已不再满足于简单聚合查询，而是在大量使用：
- CTE
- DISTINCT
- LATERAL
- WINDOW
- 宏
- 时区类型

这对优化器与 binder 的正确性提出了更高要求。

---

## 7. 待处理积压

以下是建议维护者重点关注的长期或高价值积压项：

### 7.1 S3 分区 COPY OOM
- Issue: #11817
- 创建时间: 2024-04-24
- 状态: **OPEN / under review**
- 链接: duckdb/duckdb Issue #11817

存在时间较长，且影响对象存储输出稳定性。  
建议提升优先级，因为这关系到 DuckDB 在湖仓 ETL 生产场景的口碑。

---

### 7.2 `read_parquet + LIMIT` 文件句柄耗尽
- Issue: #18831
- 创建时间: 2025-09-02
- 状态: **OPEN / under review**
- 链接: duckdb/duckdb Issue #18831

属于资源泄漏/调度策略异常感知问题，用户体验较差。  
如果短期无法修复，至少应补充文档解释和规避建议。

---

### 7.3 CREATE TRIGGER catalog 支持 PR 长期开启
- PR: #21438
- 创建时间: 2026-03-17
- 状态: **OPEN**
- 链接: duckdb/duckdb PR #21438

这是面向未来 SQL DDL 能力的重要基础设施 PR。  
建议维护者明确其范围边界，避免长期挂起导致设计分散。

---

### 7.4 窗口函数绑定重构 PR 风险与价值都高
- PR: #21562
- 创建时间: 2026-03-23
- 状态: **OPEN / Ready For Review**
- 链接: duckdb/duckdb PR #21562

考虑到今日多起窗口相关回归/错误结果问题，该 PR 值得尽快完成严格评审。  
它可能是减少后续窗口语义分裂的重要整理点，但也应伴随更全面回归测试。

---

### 7.5 Arrow Flight SQL 需求虽关闭，但生态诉求仍未消失
- Issue: #3099
- 创建时间: 2022-02-16
- 状态: **CLOSED**
- 链接: duckdb/duckdb Issue #3099

虽然已经关闭，但它代表的“DuckDB 作为 Arrow 原生查询服务节点”的需求仍然存在。  
建议后续通过文档明确官方立场：  
是暂不支持、建议使用 ADBC、还是鼓励第三方封装。

---

## 8. 总结判断

今天 DuckDB 展现出**高活跃、高修复效率、但 correctness 风险偏高**的一天。  
正面看：
- Windows CLI 问题快速收敛；
- ADBC/Arrow/Variant 生态兼容持续推进；
- CLI 格式化、Trigger catalog、扩展 introspection 等功能都在向前走。  

需要警惕的是：
- **窗口函数、LATERAL、DISTINCT/CTE、宏+timestamptz** 这些高级 SQL 路径今天继续暴露出回归或错误结果问题；
- `v1.5.x` 周边仍处于较高变动期，建议用户在生产中对复杂查询做额外回归验证。

如果你愿意，我还可以继续把这份日报整理成更适合团队周报/飞书消息的 **精简版** 或 **表格版**。

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks 项目动态日报（2026-03-31）

## 1. 今日速览

过去 24 小时内，StarRocks 社区保持高活跃度：Issues 更新 37 条、PR 更新 115 条，并发布了 1 个新版本，显示出核心维护与版本分支回溯都在持续推进。  
从 PR 动态看，当前工作重心比较明确：一方面是 **3.4/3.5/4.0/4.1 多分支 backport 与稳定性修复**，另一方面是 **统计信息、聚合执行路径和大二进制列处理的底层重构**。  
Issue 侧则呈现出两类信号：其一是若干 **高严重度安全/一致性问题** 在 3 月 30 日集中被报告；其二是大量历史 stale issue 在同日被集中关闭，说明维护者在做存量工单清理。  
整体健康度评价：**活跃度高，工程推进快，但需要重点关注新暴露的安全面与事务/快照一致性风险**。

---

## 2. 版本发布

## 3.5.15 发布
- Release: **3.5.15**
- 链接：<https://github.com/StarRocks/StarRocks/releases>  
- 相关变更 PR：[#70004](https://github.com/StarRocks/starrocks/pull/70004)

### 核心更新
本次版本的显著变更集中在 **`sql_mode` 行为收紧**：

- 当开启 `DIVISION_BY_ZERO` 或 `FAIL_PARSE_DATE` 模式时：
  - **除零** 不再被静默忽略，而是直接返回错误
  - `str_to_date` / `str2date` 的 **日期解析失败** 也会直接报错，而不是吞掉异常

### 行为变化 / 潜在破坏性影响
这属于典型的 **行为兼容性变更**，对依赖“宽松容错”语义的老业务可能有影响：

- 旧查询可能在历史版本中“成功返回但结果含隐式容错”
- 升级到 3.5.15 后，在特定 `sql_mode` 下将直接失败
- 受影响场景包括：
  - ETL 中的脏日期字符串解析
  - 报表 SQL 中的除法运算未做零值保护
  - 依赖 MySQL 风格宽松模式的兼容性查询

### 迁移注意事项
建议升级前做以下检查：

1. **排查 session/global `sql_mode` 配置**
   - 特别关注是否显式启用了 `DIVISION_BY_ZERO`、`FAIL_PARSE_DATE`

2. **扫描高风险 SQL**
   - `a / b` 类表达式是否对 `b=0` 做了保护
   - `str_to_date` / `str2date` 是否处理了非标准日期格式

3. **在灰度环境回放关键 ETL / BI 查询**
   - 重点检查报错率变化
   - 比对升级前后失败 SQL 数量

4. **必要时增加保护性写法**
   - 例如 `a / nullif(b, 0)`
   - 对日期字符串先做预清洗或格式判断

---

## 3. 项目进展

以下为今日值得关注的 PR 进展，重点反映查询引擎、存储层和 SQL 统计推断方向。

### 3.1 存储统计口径修正：`be_tablets.DATA_SIZE` 更贴近真实列数据大小
- PR: [#70735](https://github.com/StarRocks/starrocks/pull/70735)
- 状态：OPEN
- 标签：`documentation, 3.5, 4.0, 4.1`

#### 进展解读
该 PR 调整了 `Rowset::data_disk_size()` 与 tablet 统计口径，使 `be_tablets.DATA_SIZE` 更偏向 **rowset 列数据字节数**，而非混入更多 footprint/index 相关体积。  
对 Lake PK 表还特别避免把 **持久化 PK index 字节** 计入 DATA_SIZE。

#### 技术意义
- 运维视角下的存储监控更准确
- 容量评估、冷热数据分析、压缩率判断会更可靠
- 有助于减少“表看起来过大但其实是索引/附属结构膨胀”的误判

---

### 3.2 统计信息采集优化：跳过虚拟列
- PR: [#70968](https://github.com/StarRocks/starrocks/pull/70968)
- 状态：OPEN

#### 进展解读
该 PR 避免为 **virtual columns** 收集统计信息，理由是虚拟列通常近似常量，收集收益低且会带来无意义开销。

#### 技术意义
- 降低统计收集成本
- 避免优化器被低价值统计噪音干扰
- 体现出优化器侧在向“更精准的统计采集策略”演进

---

### 3.3 Delvec 元数据一致性修复：处理 publish batch 中写入与 compaction 交错问题
- PR: [#71001](https://github.com/StarRocks/starrocks/pull/71001)
- 状态：OPEN
- 标签：`3.5, 4.0, 4.1`

#### 进展解读
该 PR 修复了在 **同一 publish batch 中同时应用 write txn 与 compaction txn** 时，可能留下 **delvec orphan entries** 的问题。  
问题根源是 compaction 删除了 segment，但未清理对应 delvec 元数据中的残留项。

#### 技术意义
- 这是典型的 **存储元数据一致性修复**
- 对主键模型、更新删除频繁场景尤为关键
- 若不修复，可能引发查询异常、元数据膨胀或后续 compaction/读取问题

---

### 3.4 优化器统计能力增强：MCV 传播和空值谓词建模持续推进
- PR: [#71000](https://github.com/StarRocks/starrocks/pull/71000) - OPEN
- PR: [#70991](https://github.com/StarRocks/starrocks/pull/70991) - CLOSED
- PR: [#70966](https://github.com/StarRocks/starrocks/pull/70966) - CLOSED

#### 进展解读
今天围绕 **MCV（Most Common Values，最常见值）** 的一组工作比较集中：

- `IS NULL` 谓词开始支持结合 MCV 做统计推断 [#70991](https://github.com/StarRocks/starrocks/pull/70991)
- skew rule 中对 MCV 的常量构造改为显式 cast，避免类型偏差 [#70966](https://github.com/StarRocks/starrocks/pull/70966)
- 进一步推进 `IF` 表达式与常量上的 MCV 传播 [#71000](https://github.com/StarRocks/starrocks/pull/71000)

#### 技术意义
这类工作虽不直接面向用户，但对 **基数估计、倾斜识别、Join/Filter 代价模型** 影响很大，属于优化器“精细化”建设的重要信号。

---

### 3.5 聚合与大二进制列处理的底层重构在持续收口
相关 PR：
- [#70805](https://github.com/StarRocks/starrocks/pull/70805) - CLOSED
- [#70826](https://github.com/StarRocks/starrocks/pull/70826) - CLOSED
- [#70789](https://github.com/StarRocks/starrocks/pull/70789) - CLOSED
- [#70782](https://github.com/StarRocks/starrocks/pull/70782) - CLOSED
- [#70765](https://github.com/StarRocks/starrocks/pull/70765) - CLOSED
- 以及对应 backport：[#71006](https://github.com/StarRocks/starrocks/pull/71006), [#71007](https://github.com/StarRocks/starrocks/pull/71007)

#### 进展解读
这一系列 PR 继续围绕聚合函数内部数据结构、`AggDataTypeTraits`、binary container、`ArrayAggAggregateState` 等模块做重构和抽象统一。

#### 技术意义
- 提升大 binary/string 列场景下的处理一致性
- 为后续性能优化和多分支 backport 降低复杂度
- 表明 `#69067` 相关大型重构正在分步骤稳定落地

---

### 3.6 3.4 分支稳定性回补
- PR: [#70976](https://github.com/StarRocks/starrocks/pull/70976)
- 状态：CLOSED
- 标签：`version:3.4.11`

#### 进展解读
该 backport 修复 “不同 NullableColumns 不应共享同一 NullColumn” 问题，属于典型的内存/列对象语义正确性修复。

#### 技术意义
这类问题往往隐蔽，但可能造成：
- 数据污染
- 空值位图共享导致的错误结果
- 非预期写时复制行为

---

## 4. 社区热点

## 4.1 “用 SQL 数据库存储 Meta” 的架构诉求再次出现
- Issue: [#62005](https://github.com/StarRocks/starrocks/issues/62005)
- 状态：CLOSED
- 评论：5，👍 3

### 热点分析
该议题聚焦于 **Kubernetes 场景下元数据高可用**：当前 StarRocks 元数据依赖本地文件系统，使得容器化部署中的 HA 设计变得复杂。  
用户点名对标 RisingWave 使用 SQL 数据库存储元数据的方式，反映出社区对 **云原生控制面架构** 的持续关注。

### 技术诉求
- FE 元数据外置化
- K8s 环境下更简单的故障恢复
- 降低本地持久卷与主备切换复杂度

虽然该 Issue 已关闭，但它代表的需求不会消失，值得作为中长期架构演进参考。

---

## 4.2 Iceberg 体验与性能仍是外部表方向的焦点
- Issue: [#63220](https://github.com/StarRocks/starrocks/issues/63220) — Iceberg quickstart is slow
- Issue: [#71005](https://github.com/StarRocks/starrocks/issues/71005) — Iceberg: skip files before open() using runtime filter min/max vs manifest column stats

### 热点分析
Iceberg 相关反馈今天仍较集中，一类是 **上手链路偏慢**，另一类是更深入的 **执行层文件裁剪优化**。  
新提的 #71005 明确提出，希望在 `open()` 之前，结合 **runtime filter 的 min/max 与 manifest column stats** 先做文件跳过，这说明用户已不满足于基础可用，而在追求更接近原生湖仓引擎的 selective scan 效率。

### 技术诉求
- 提升 Iceberg 首次体验和 quickstart 路径
- 更强文件级/manifest 级裁剪
- 降低星型模型下大事实表的无效文件打开成本

---

## 4.3 存储与 compaction 异常仍困扰 shared-data 场景用户
- Issue: [#63632](https://github.com/StarRocks/starrocks/issues/63632)
- 状态：OPEN
- 评论：3

### 热点分析
该问题描述了 shared-data 集群在开启 `enable_json_flat = true` 后出现 tablet compaction 失败、并无限重试。  
这类问题对线上影响大，因为 compaction 是存储维护的核心后台流程，一旦阻塞，会持续恶化写放大和空间回收。

### 技术诉求
- shared-data 模式下的 compaction 稳定性
- JSON flatten 相关存储编码/位置索引健壮性
- 出错后的重试熔断与诊断能力

---

## 4.4 SQL 生态与兼容性需求持续发酵
相关 Issues：
- [#63328](https://github.com/StarRocks/starrocks/issues/63328) — `INSERT INTO FILES` 支持 CSV 压缩
- [#63730](https://github.com/StarRocks/starrocks/issues/63730) — `information_schema.columns.EXTRA` 未暴露 `auto_increment`
- [#63735](https://github.com/StarRocks/starrocks/issues/63735) — Kafka Connector 类型映射和 schema evolution
- [#63716](https://github.com/StarRocks/starrocks/issues/63716) — explain return type

### 热点分析
这些问题共同反映出 StarRocks 正被放到更复杂的数据平台场景中使用，用户不再只关注查询性能，也开始重视：
- 元数据兼容性
- 外部连接器能力
- SQL introspection/调试体验
- 导出与数据交换能力

---

## 5. Bug 与稳定性

以下按严重程度排序。

## P0 / 高危：3 月 30 日集中出现的一组安全与一致性问题
这些 Issue 多带有 `[source:ai-detected]` 标签，尚未看到对应 fix PR，建议维护者优先分诊核实。

### 5.1 Arrow Flight SQL 结果抓取基本无认证
- Issue: [#70948](https://github.com/StarRocks/starrocks/issues/70948)
- 状态：OPEN
- 严重性：**Critical**
- 组件：BE Arrow Flight SQL Service
- 当前 fix PR：**未见**

风险：BE Arrow Flight 服务使用 `NoOpAuthHandler` / `NoOpBearerAuthServerMiddlewareFactory`，意味着结果抓取面可能处于未鉴权状态。  
影响：可能导致数据越权读取。

---

### 5.2 未认证调用可远程关闭 BE 节点
- Issue: [#70945](https://github.com/StarRocks/starrocks/issues/70945)
- 状态：OPEN
- 严重性：**Critical**
- 组件：BE HTTP Service
- 当前 fix PR：**未见**

风险：`/api/_stop_be` 若无认证保护，外部请求可直接触发进程快速退出。  
影响：远程 DoS，节点可用性受威胁。

---

### 5.3 未认证接口可修改 BE 在线配置
- Issue: [#70946](https://github.com/StarRocks/starrocks/issues/70946)
- 状态：OPEN
- 严重性：**Critical**
- 组件：BE HTTP Service
- 当前 fix PR：**未见**

风险：`POST /api/update_config` 可在未认证情况下变更运行配置。  
影响：配置篡改、稳定性下降、潜在安全绕过。

---

### 5.4 Stream Load 事务后续请求未重新鉴权
- Issue: [#70947](https://github.com/StarRocks/starrocks/issues/70947)
- 状态：OPEN
- 严重性：**Critical**
- 组件：BE HTTP Service / Stream Load
- 当前 fix PR：**未见**

风险：事务 `begin` 之外的 `commit/rollback` 路径可能未做重新认证。  
影响：事务劫持、错误提交/回滚。

---

### 5.5 PK-index 快路径忽略 snapshot version，可能破坏 REPEATABLE READ
- Issue: [#70944](https://github.com/StarRocks/starrocks/issues/70944)
- 状态：OPEN
- 严重性：**Critical**
- 组件：BE Storage Engine
- 当前 fix PR：**未见**

风险：快照语义与当前 live mapping 混用，可能出现非可重复读。  
影响：查询正确性与事务隔离级别承诺受损。

---

### 5.6 INSERT Load 回放兼容性问题：txn replay 回调为空
- Issue: [#70942](https://github.com/StarRocks/starrocks/issues/70942)
- 状态：OPEN
- 严重性：**Critical**
- 组件：Transaction Manager / Load
- 当前 fix PR：**未见**

风险：FE 崩溃恢复后，INSERT load 可见/终止状态回放不完整。  
影响：恢复后事务状态不一致、作业丢失或元数据异常。

---

### 5.7 Shared-data 存储卷管理可能泄露 DB 读锁
- Issue: [#70941](https://github.com/StarRocks/starrocks/issues/70941)
- 状态：OPEN
- 严重性：**Critical**
- 组件：Shared-Data Storage Volume Manager
- 当前 fix PR：**未见**

风险：显式绑定存储卷场景下读锁未释放。  
影响：元数据锁竞争、DDL/管理操作阻塞。

---

### 5.8 函数名校验使用 defaultDb 而非限定符 DB
- Issue: [#70949](https://github.com/StarRocks/starrocks/issues/70949)
- 状态：OPEN
- 严重性：高
- 组件：SQL Analyzer
- 当前 fix PR：**未见**

影响：backup/restore 中带限定符函数名校验错误，属于 SQL 语义正确性问题。

---

## 中高优先级：已有修复推进中的稳定性问题

### 5.9 publish batch 中写入/compaction 交错导致 delvec orphan entries
- PR: [#71001](https://github.com/StarRocks/starrocks/pull/71001)
- 状态：OPEN

这是今天最明确、最实质性的存储一致性修复之一，建议优先关注合并进度。

---

### 5.10 统计收集误触 virtual columns
- PR: [#70968](https://github.com/StarRocks/starrocks/pull/70968)
- 状态：OPEN

虽然严重性不如 P0 问题，但它会影响统计任务效率与优化器质量。

---

### 5.11 历史已关闭但值得关注的查询计划错误问题
- Issue: [#67665](https://github.com/StarRocks/starrocks/issues/67665)
- 状态：CLOSED

问题表现为 `prunedPartitionPredicates` 中包含 required column，引发 invalid query plan。  
虽然今日已关闭，但其性质属于 **优化器正确性问题**，说明分区裁剪与列需求推导交互仍是敏感区域。

---

## 6. 功能请求与路线图信号

## 6.1 Iceberg 深度优化大概率会持续投入
- Issue: [#71005](https://github.com/StarRocks/starrocks/issues/71005)
- Issue: [#63220](https://github.com/StarRocks/starrocks/issues/63220)

结合近期 StarRocks 在湖仓查询上的持续投入，这类需求被纳入后续版本的可能性较高。特别是：
- manifest stats 裁剪
- runtime filter 与外部表文件跳过协同
- quickstart / 文档体验优化

**判断：高概率进入后续版本或设计讨论。**

---

## 6.2 Kafka Connector 类型映射与 schema evolution 是明显的连接器短板
- Issue: [#63735](https://github.com/StarRocks/starrocks/issues/63735)

用户明确对标 Doris Connector，希望支持更多 Kafka logical types / Debezium 类型及 schema evolution。  
这类需求通常与 CDC 场景直接相关，商业价值高。

**判断：中高概率纳入连接器路线图。**

---

## 6.3 `INSERT INTO FILES` 支持 CSV 压缩具备实用价值
- Issue: [#63328](https://github.com/StarRocks/starrocks/issues/63328)

该需求面向数据导出/卸载场景，使用价值明确，且实现边界相对清晰。

**判断：中概率进入中短期增强项。**

---

## 6.4 Explain 返回类型、系统表兼容性、视图类型支持等生态细节会持续补齐
相关：
- [#63716](https://github.com/StarRocks/starrocks/issues/63716) — explain return type
- [#63730](https://github.com/StarRocks/starrocks/issues/63730) — auto_increment 元数据暴露
- [#63682](https://github.com/StarRocks/starrocks/issues/63682) — view 支持 Decimal256

这类需求不一定优先级最高，但对 BI 工具兼容、元数据治理、SQL 可观测性非常重要。

**判断：中低到中概率，以零散修复/增强形式进入版本。**

---

## 7. 用户反馈摘要

### 7.1 云原生部署用户关注“元数据 HA 复杂度”
- Issue: [#62005](https://github.com/StarRocks/starrocks/issues/62005)

K8s 用户的核心痛点不是单点性能，而是控制面元数据的可恢复性与运维复杂度。  
这说明 StarRocks 正被用于更标准化的平台型部署环境，而不仅是传统自管集群。

---

### 7.2 湖仓用户关注“能否少扫文件、快启动、快裁剪”
- Issues: [#63220](https://github.com/StarRocks/starrocks/issues/63220), [#71005](https://github.com/StarRocks/starrocks/issues/71005)

用户已从“能查 Iceberg”转向“查得是否足够高效”。  
这类反馈通常意味着产品已跨过基础可用门槛，正在进入体验与效率竞争阶段。

---

### 7.3 shared-data 用户对 compaction 稳定性敏感
- Issue: [#63632](https://github.com/StarRocks/starrocks/issues/63632)

一旦 compaction 卡住，就会演变成存储维护层面的系统性问题。  
说明 shared-data 模式仍需要更多线上复杂场景验证，尤其是 JSON 扁平化等新能力与 compaction 的协同。

---

### 7.4 兼容性用户在意“信息模式、视图类型、SQL 行为是否足够像 MySQL/生态系统”
- Issues: [#63730](https://github.com/StarRocks/starrocks/issues/63730), [#63682](https://github.com/StarRocks/starrocks/issues/63682), [#63524](https://github.com/StarRocks/starrocks/issues/63524)

这表明用户不仅把 StarRocks 当查询引擎，也当作面向外部工具和上层平台的 SQL 服务端。  
因此系统函数正确性、`information_schema` 完整度、类型系统兼容性会越来越关键。

---

## 8. 待处理积压

以下是值得维护者继续关注的长期未充分解决问题：

### 8.1 shared-data + JSON flatten 导致 compaction 失败
- Issue: [#63632](https://github.com/StarRocks/starrocks/issues/63632)
- 状态：OPEN

这是典型的高影响线上问题，且已存在较长时间，建议优先补充诊断信息与复现。

---

### 8.2 Iceberg quickstart 体验偏慢
- Issue: [#63220](https://github.com/StarRocks/starrocks/issues/63220)
- 状态：OPEN

虽然不一定是内核缺陷，但属于用户首次体验关键路径，影响产品采纳率。

---

### 8.3 `INSERT INTO FILES` 缺失 CSV 压缩
- Issue: [#63328](https://github.com/StarRocks/starrocks/issues/63328)
- 状态：OPEN

对实际数据卸载流程很实用，且已有用户点赞，值得评估实现成本。

---

### 8.4 `information_schema.columns.EXTRA` 未体现 `auto_increment`
- Issue: [#63730](https://github.com/StarRocks/starrocks/issues/63730)
- 状态：OPEN

会影响上层工具/ORM 的元数据判断，属于“小问题但兼容性影响广”。

---

### 8.5 Kafka Connector 类型映射与 schema evolution
- Issue: [#63735](https://github.com/StarRocks/starrocks/issues/63735)
- 状态：OPEN

这是连接器能力成熟度的重要缺口，若长期不处理，可能限制 CDC/流批一体接入场景。

---

## 总结

今天的 StarRocks 呈现出非常鲜明的“双线态势”：

- **正向推进线**：发布 3.5.15，继续完善 `sql_mode` 语义；PR 侧在统计信息、聚合执行框架、存储元数据一致性、多分支 backport 上稳步推进。
- **风险暴露线**：多项新报告的高危问题集中指向 **BE 管理接口鉴权、Arrow Flight 安全、事务回放、快照一致性**，如果确认属实，优先级应显著高于常规功能开发。

综合判断：**项目工程活跃度与迭代节奏很强，但接下来 1-3 天的重点应是安全与一致性问题的快速分诊、复现和补丁落地。**

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg 项目动态日报（2026-03-31）

## 1. 今日速览

过去 24 小时内，Apache Iceberg 社区保持较高活跃度：Issues 更新 9 条、PR 更新 44 条，明显以代码提案和分支维护工作为主。  
从内容看，今日重点集中在 **Spark / Flink 引擎适配、REST Catalog 能力扩展、Kafka Connect 安全修复回补**，同时也出现了若干影响可用性的连接器与读取正确性问题。  
关闭事项数量不多（Issues 关闭 2、PR 合并/关闭 10），说明当前节奏更偏向于 **功能推进与问题收敛中的中间阶段**，而不是集中发布阶段。  
整体健康度良好：一方面有持续的规范与接口演进，另一方面也暴露出多引擎、多连接器场景下的兼容性边界仍在快速被用户验证。

---

## 3. 项目进展

> 今日无新版本发布，以下聚焦已关闭/推进中的重要 PR 与其代表的项目方向。

### 3.1 已关闭/处理的重要 PR

#### 1) Kafka Connect 依赖安全修复开始向 1.10.x 回补
- PR: **#15829** `[1.10.x] Fix CVE-2025-67721 in io.airlift:aircompressor`  
  链接: apache/iceberg PR #15829
- 进展：该 PR 于 3/30 创建、3/31 更新，针对 Kafka Connect 运行时依赖 `io.airlift:aircompressor` 的 CVE 修复做 1.10.x 分支 backport。
- 意义：这是对已关闭安全 Issue **#15378** 的直接工程响应，说明维护者正在把安全问题从主线修复落实到稳定分支。
- 技术点：backport 并不干净，需要调整 `build.gradle` 的 `resolutionStrategy`，反映出 Iceberg 多模块构建和分支维护成本较高。

#### 2) Spark Action 选项校验修复已关闭
- PR: **#15828** `[spark] Fix option validation in RewritePositionDeleteFilesSparkAction`  
  链接: apache/iceberg PR #15828
- 状态：已关闭
- 影响：修复 `RewritePositionDeleteFilesSparkAction` 中 `validateAndInitOptions()` 错误重复加入 planner valid options、遗漏 runner valid options 的问题。
- 推进价值：属于 **Spark 运维型 Action 的参数兼容性修复**，虽然作者说明当前“实际影响有限”，但这类修复对后续扩展 runner 选项十分关键，可减少运维自动化脚本误报。

#### 3) 多个 stale PR 被关闭，积压清理持续进行
- PR: **#15397** Infra: Optimize - Run CI workflows on fork compute via push triggers  
- PR: **#15391** AWS: Add S3 checksum policy configuration tied to s3.checksum-enabled  
- PR: **#15379** [FLINK] Fix s3 IO unclosed instance  
- PR: **#15210** S3 Multipart Upload 相关资源清理优化  
- 状态：均已关闭  
- 观察：这表明维护者在持续清理未推进的历史提案，但也意味着部分 **CI 成本优化、S3 兼容性、资源回收稳定性** 的改进暂未进入主线，需要后续有新的、更聚焦的 PR 重新推动。

### 3.2 正在推进、值得关注的 PR

#### 4) Spark 4.1 DSv2 能力增强
- PR: **#14948** `Spark 4.1: Implement SupportsReportOrdering DSv2 API`  
  链接: apache/iceberg PR #14948
- 价值：实现 Spark DSv2 `SupportsReportOrdering`，帮助 Spark 在分区排序场景进行 **sort elimination** 优化。
- 判断：这是典型的 **查询规划优化** 工作，若合入，将改善 Spark 与 Iceberg 的协同执行效率，特别是已排序/天然顺序较强的数据布局场景。

#### 5) REST Catalog 正在向“关系对象统一加载”演进
- PR: **#15830** `[OPENAPI] REST Spec: Add single and batch endpoints for loading relational objects`
- PR: **#15831** `[core] Add Java reference implementation for relation load endpoints`
- 链接: apache/iceberg PR #15830 / #15831
- 价值：将 table、view 以及未来 materialized view 统一纳入 relation load endpoint。
- 判断：这是今天最明确的 **路线图信号** 之一，说明 Iceberg REST 生态正从“表中心”进一步向“统一元数据对象访问”扩展，为视图、未来 MV、跨引擎 Catalog 一致性打基础。

#### 6) Flink Dynamic Sink 配置能力继续补齐
- PR: **#15780** `Flink: SQL: Make Dynamic sink options to be configurable in SQL`  
  链接: apache/iceberg PR #15780
- 价值：支持从 SQL 配置动态 sink 的并行度、分布模式等参数，而不是只能依赖全局配置或 write properties。
- 判断：若合入，将显著改善 Flink SQL 用户在多租户、动态目标表场景下的易用性。

#### 7) Spark 统计信息估算准确性改进
- PR: **#15693** `Use actual file sizes instead of schema-based estimates for table statistics`  
  链接: apache/iceberg PR #15693
- 价值：从基于 schema defaultSize 的粗略估算，转向基于实际文件大小的统计。
- 影响：有望改进 Spark Join 选择与整体执行计划质量，属于 **性能与 CBO 质量优化**。

#### 8) V4 Manifest 基础类型持续铺设
- PR: **#15049** `Introduce foundational types for V4 manifest support`  
  链接: apache/iceberg PR #15049
- 价值：为 v4 adaptive metadata tree / manifest 读写奠定基础。
- 判断：这是长期演进项，虽然短期用户感知弱，但它对应的是 Iceberg 元数据层的未来能力扩展。

---

## 4. 社区热点

### 热点 1：Kafka Connect 动态路由写入失败
- Issue: **#13457** `[bug] Kafka Connect sink fails to write snapshot when using dynamic routing with SMTs`  
  链接: apache/iceberg Issue #13457
- 数据：评论 9，👍 3，是今日最活跃 Issue。
- 背后诉求：
  - 用户希望 Kafka Connect Sink 在使用 SMT（Single Message Transforms）+ 动态路由时稳定写入 Iceberg；
  - 这反映出 Iceberg 连接器已进入更复杂的生产集成阶段，不再只是静态单表落地；
  - 动态路由、CDC、多主题汇聚是流式入湖中的典型真实场景。
- 分析：该问题的高讨论度说明 **连接器正确性与可配置性** 正成为 Iceberg 用户体验的关键短板之一。

### 热点 2：REST Catalog 开始统一 table/view/MV 访问模型
- PR: **#15830**、**#15831**  
  链接: apache/iceberg PR #15830 / #15831
- 虽未给出评论数，但从内容密度和设计范围看，是当天最值得关注的架构方向。
- 背后诉求：
  - 统一 Catalog API，减少 table/view 分裂接口；
  - 为未来 materialized view 提前铺设协议层与 Java 参考实现；
  - 方便多引擎通过 REST Catalog 获得一致语义。

### 热点 3：Spark 4.1 优化与 Spark 2 历史包袱清理并行推进
- PR: **#14948**、**#15823**
- Issue: **#15821**
- 链接: apache/iceberg PR #14948 / PR #15823 / Issue #15821
- 观察：
  - 一边在接入 Spark 4.1 的新 DSv2 能力；
  - 一边开始显式移除 Spark 2 遗留测试假设。
- 这说明项目在 Spark 生态中的策略已经很明确：**资源投入转向现代 Spark 版本的能力增强，而非继续兼容历史版本。**

---

## 5. Bug 与稳定性

以下按严重程度与用户影响排序。

### P1：读取正确性问题 —— 嵌套字段作为 identifier 时列读取失败
- Issue: **#15826** `[bug] Unable to read data when using nested field as identifier`  
  链接: apache/iceberg Issue #15826
- 场景：表使用嵌套字段作为 identifier，`select *` 正常，但读取个别列时报 `IllegalArgumentException`。
- 影响评估：
  - 涉及 **查询正确性/列投影读取路径**；
  - 若属通用逻辑缺陷，可能影响依赖 identifier field 的高级 schema 设计用户。
- fix PR：**暂无明确关联 PR**
- 严重性：高

### P1：Kafka Connect 动态路由写入快照失败
- Issue: **#13457** `[bug] Kafka Connect sink fails to write snapshot when using dynamic routing with SMTs`  
  链接: apache/iceberg Issue #13457
- 场景：静态表配置可正常提交，动态路由 + SMT 时失败。
- 影响评估：
  - 直接影响流式入湖链路；
  - 涉及连接器生产可用性，容易导致数据延迟或任务失败。
- fix PR：**暂无**
- 严重性：高

### P1：Spark 运行时工件 sources/javadoc 为空
- Issue: **#15824** `[bug] Sources and Javadoc-Jar of spark-runtime-4.0_2.13 is empty`  
  链接: apache/iceberg Issue #15824
- 场景：Maven Central 上 `iceberg-spark-runtime-4.0_2.13:1.10.1` 的 sources/javadoc jar 为空。
- 影响评估：
  - 不影响生产运行；
  - 但严重影响 IDE 调试、源码定位、二次开发与生态集成体验。
- fix PR：**暂无**
- 严重性：中

### P2：Flink DynamicIcebergSink 并行度未继承上游
- Issue: **#15827** `Flink DynamicIcebergSink: DynamicRecordProcessor does not inherit upstream parallelism`  
  链接: apache/iceberg Issue #15827
- 场景：`DynamicRecordProcessor` 未显式设置 parallelism，退回环境默认值。
- 影响评估：
  - 可能引发吞吐异常、资源分配不均、执行拓扑与预期不一致；
  - 对 Flink 生产任务稳定性有实际影响。
- fix PR：**暂无直接修复 PR**，但与动态 sink 能力增强 PR **#15780** 在主题上相关。
- 严重性：中高

### P2：Kafka Connector 是否支持 upsert 的功能/行为疑问
- Issue: **#15046** `[question] Does kafka connector it support upsert`  
  链接: apache/iceberg Issue #15046
- 现象：用户反馈 Apache 版本存在重复数据，即便启用 upsert-mode，而 io.tabular 版本表现正常。
- 影响评估：
  - 这虽然被标记为 question，但实际上可能指向 **行为差异、文档不清、甚至功能缺失**；
  - 对 CDC / 主键更新场景用户非常关键。
- fix PR：暂无
- 严重性：中高

### P3：已关闭问题 —— Kafka Connect 依赖 CVE
- Issue: **#15378** `Kafka Connect: CVE-2025-67721 in io.airlift:aircompressor 2.0.2`  
  链接: apache/iceberg Issue #15378
- 状态：已关闭
- 对应修复推进：**#15829**
- 说明：安全问题已确认进入回补流程，风险趋于可控。

### P3：已关闭问题 —— Spark 视图被当成表展示
- Issue: **#15779** `[bug] Spark: Iceberg views are not created as views and are appearing as tables.`  
  链接: apache/iceberg Issue #15779
- 状态：已关闭
- 说明：视图元数据/目录呈现相关的问题已有处理结果，表明维护者对 SQL 对象语义一致性仍有持续关注。

---

## 6. 功能请求与路线图信号

### 6.1 新功能请求

#### 1) 增加 `write.parquet.page-version` 表属性
- Issue: **#15677** `[improvement] Add write.parquet.page-version table property`  
  链接: apache/iceberg Issue #15677
- 诉求：让用户可以选择 Parquet DataPage V1/V2。
- 价值：这是典型的 **存储格式写入细粒度控制** 需求，关系到压缩率、兼容性和读取行为。
- 纳入下一版本概率：**中等偏高**  
  原因：需求边界清晰、实现相对局部、与现有 `write.parquet.*` 体系一致。

#### 2) 移除 Spark2 时代测试假设
- Issue: **#15821** `[improvement, good first issue] Remove tests assumption for Spark2`
- PR: **#15823** `Spark: Remove Spark 2 test assumptions for write projection`
- 链接: apache/iceberg Issue #15821 / PR #15823
- 判断：这类清理工作很可能会被快速纳入，因为已有对应 PR，且符合项目已放弃 Spark 2 支持的现实。

### 6.2 明确的路线图信号

#### 3) REST relation load endpoint
- PR: **#15830**、**#15831**
- 链接: apache/iceberg PR #15830 / PR #15831
- 信号：Iceberg Catalog 抽象正在从 table-centric 向 relation-centric 演进。
- 可能影响：
  - 视图与未来物化视图的一等公民化；
  - 客户端 SDK 简化；
  - 跨引擎 Catalog 互操作增强。

#### 4) Materialized View 规范长期推进
- PR: **#11041** `Materialized View Spec`  
  链接: apache/iceberg PR #11041
- 信号：虽然是长期开放 PR，但结合今日 relation endpoint 的演进，MV 并非边缘议题，而是在逐步积累基础设施。

#### 5) Spark 查询优化持续深化
- PR: **#14948**、**#15693**、**#15385**
- 链接: apache/iceberg PR #14948 / PR #15693 / PR #15385
- 信号：
  - DSv2 排序能力上报；
  - 统计信息更准确；
  - variant_get 谓词下推支持文件跳过。
- 说明：Spark 方向不仅是兼容，更是 **优化器层面的深度集成**。

---

## 7. 用户反馈摘要

### 7.1 流式入湖用户最关心“连接器行为是否符合预期”
- 代表 Issue:
  - **#13457** Kafka Connect 动态路由写入失败
  - **#15046** Kafka connector upsert 支持疑问
- 链接: apache/iceberg Issue #13457 / #15046
- 提炼：
  - 用户已不满足于“能写入”，而是在验证 **动态路由、SMT、upsert、CDC 去重** 等真实生产能力；
  - 一旦 Apache 版本与商业发行版/下游分发版本行为不一致，用户会立即感知并提出对比反馈。

### 7.2 Spark 用户关注对象语义与开发体验
- 代表 Issue:
  - **#15779** 视图被展示为表
  - **#15824** sources/javadoc jar 为空
- 链接: apache/iceberg Issue #15779 / #15824
- 提炼：
  - 用户不仅在乎查询是否跑通，还在乎 **view/table 语义是否一致、IDE 是否可调试、发布工件是否完整**；
  - 这表明 Iceberg 已被广泛用于平台化开发，而非仅作底层库调用。

### 7.3 Flink 用户开始深入关注执行拓扑与参数控制
- 代表 Issue/PR:
  - **#15827** 并行度继承问题
  - **#15780** SQL 配置动态 sink 选项
- 链接: apache/iceberg Issue #15827 / PR #15780
- 提炼：
  - 用户诉求从“支持 Flink Sink”升级为“支持对并行度、分布模式、写入参数做精细控制”；
  - 说明 Flink + Iceberg 已进入性能调优与生产工程化阶段。

---

## 8. 待处理积压

以下是值得维护者重点关注的长期或高价值积压项。

### 1) Materialized View Spec 长期开启
- PR: **#11041** `Materialized View Spec`  
  链接: apache/iceberg PR #11041
- 状态：自 2024-08-29 开启，至今仍在更新
- 风险：若长期无法收敛，会影响 view/MV 生态对外预期与 REST Catalog 设计稳定性。
- 建议：明确剩余分歧点，拆分成可独立合入的小规范 PR。

### 2) V4 Manifest 基础类型仍在铺垫阶段
- PR: **#15049** `Introduce foundational types for V4 manifest support`  
  链接: apache/iceberg PR #15049
- 状态：自 2026-01-14 开启
- 风险：这是底层元数据演进关键基础，长期未定会拖慢后续 adaptive metadata tree 相关工作。
- 建议：增加设计状态说明，帮助社区理解阶段性目标与兼容策略。

### 3) Spark 4.1 DSv2 能力实现推进较慢但价值高
- PR: **#14948** `Implement SupportsReportOrdering DSv2 API`  
  链接: apache/iceberg PR #14948
- 状态：2025-12-31 创建，仍开放
- 风险：若迟迟不合入，可能错过 Spark 新版本生态窗口。
- 建议：优先组织 review，明确 API 行为与回归测试范围。

### 4) Spark 统计估算优化值得尽快评审
- PR: **#15693** `Use actual file sizes instead of schema-based estimates for table statistics`  
  链接: apache/iceberg PR #15693
- 风险：这是高用户价值的性能优化，拖延会持续影响 Spark 查询计划质量。
- 建议：尽快补齐 benchmark 或回归验证，推动结论化评审。

### 5) Kafka Connect 动态路由缺陷需尽快建立修复链路
- Issue: **#13457**  
  链接: apache/iceberg Issue #13457
- 风险：这是高讨论度、高场景真实性的问题，若长期无 fix PR，容易削弱用户对官方 connector 的信心。
- 建议：尽快标注根因归属（routing / SMT / schema mapping / commit path），并关联修复 PR 或 workaround。

---

## 总结

今天的 Apache Iceberg 动态显示出一个典型的“高活跃、强演进、待收敛”的开源项目状态：  
- **Spark** 方向持续深化性能优化与版本升级适配；  
- **Flink** 方向开始补齐动态 sink 的工程化控制能力；  
- **REST Catalog** 正在向统一 relation 对象模型演化，具有明显中长期战略价值；  
- **Kafka Connect** 则是当前最需要关注的稳定性前线，既有安全依赖修复，也有真实生产场景下的动态路由/upsert痛点。  

从健康度看，项目主线清晰、活跃度高，但连接器与多引擎边界问题仍需更快闭环。

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake 项目动态日报（2026-03-31）

## 1. 今日速览

过去 24 小时，Delta Lake 社区保持**高活跃度**：Issues 更新 3 条，PR 更新 47 条，其中 38 条仍在待合并，说明当前开发重心仍集中在**功能演进与大规模特性分支推进**，而不是版本收口。  
从主题看，今日最显著的工作流集中在三条主线：**Flink Sink 建设**、**Kernel/Spark 迁移与 CDC 流式能力增强**、以及 **Unity Catalog Commit Metrics** 的可观测性补强。  
同时，Spark/Python 生态也有兼容性修复与接口增强在推进，表明项目并非只做底层内核演进，也在持续处理实际用户集成问题。  
整体判断：**项目健康度良好，研发节奏快，架构演进明确，但待合并 PR 数量较高，后续需要关注评审与合并吞吐。**

---

## 3. 项目进展

> 注：过去 24 小时无新 Release；已合并/关闭 PR 9 条，以下列出从数据中能明确识别、且技术价值较高的变更。

### 3.1 UC Commit Metrics 基础链路 PR 关闭，指标体系进入更完整阶段
- **PR #6155** `[CLOSED] [UC Commit Metrics] Add skeleton transport wiring and smoke tests`  
  链接：delta-io/delta PR #6155

该 PR 作为 **UC Commit Metrics** 堆叠 PR 的基础层，已在今日关闭，结合仍在推进的：
- **PR #6156** `[OPEN] Add full payload construction and schema tests`
- **PR #6333** `[OPEN] Add feature flag and async dispatch`

可以判断该方向已从“传输骨架/冒烟测试”推进到：
1. **完整指标 payload 构造**
2. **schema 级测试完善**
3. **异步发送与 feature flag 控制**

这意味着 Delta Lake 正在补齐与 **Unity Catalog 托管提交链路**相关的**提交可观测性**能力，后续有望支持更细粒度的提交统计，如文件数、字节数、行数和直方图等。这对线上运维、审计与性能诊断都很重要。  
相关链接：
- delta-io/delta PR #6155
- delta-io/delta PR #6156
- delta-io/delta PR #6333

---

### 3.2 Spark V2 Connector 过滤下推能力完善
- **PR #6355** `[CLOSED] [kernel-spark] [Spark] Add AlwaysTrue/AlwaysFalse filter pushdown to V2 connector`  
  链接：delta-io/delta PR #6355

该变更为 Spark V2 Connector 增加了 `AlwaysTrue` / `AlwaysFalse` 到 Kernel 谓词的转换支持。技术意义主要体现在：
- `AlwaysFalse` 可让 Kernel **直接跳过全部文件**，减少无意义扫描
- `AlwaysTrue` 作为正确的 no-op 传递，提升表达式处理一致性

这属于**查询引擎侧的小而关键的正确性/性能增强**：  
一方面提升了 Spark V2 与 Kernel 表达语义对齐程度；另一方面能减少某些极端查询路径中的不必要 IO。对于推进 **Spark ↔ Kernel** 融合也具有基础性价值。  
相关链接：delta-io/delta PR #6355

---

## 4. 社区热点

### 4.1 Flink Sink 开发继续推进，成为近期最明确的新增能力主线
- **Issue #5901** `[OPEN] [delta-kernel] [Flink] Create Delta Kernel based Flink Sink`  
  链接：delta-io/delta Issue #5901
- **PR #6190** `[OPEN] [Flink] Add Sink Writer and Committer`  
  链接：delta-io/delta PR #6190

这是当前最清晰的路线图信号之一。Issue #5901 明确把 **基于 Delta Kernel 的 Flink Sink** 定义为一个 epic；PR #6190 则继续补齐 **Sink Writer 和 Committer**，说明工作已经从项目脚手架进入到**写入与提交协议实现**阶段。

背后的技术诉求：
- 用户希望 Delta Lake 不仅服务于 Spark，也能在 **Flink 原生流式写入场景**中具备一等支持
- 采用 Kernel 作为核心能力层，说明项目在努力实现**多引擎共享协议与读写逻辑**

这条线如果顺利推进，将显著扩大 Delta Lake 在实时数仓/流批一体生态中的适用面。  
相关链接：
- delta-io/delta Issue #5901
- delta-io/delta PR #6190

---

### 4.2 Kernel-Spark CDC 大型堆叠 PR 持续活跃，流式正确性是重点
相关 PR：
- **PR #6075** `[kernel-spark][Part 1] CDC streaming offset management (initial snapshot)`  
- **PR #6076** `[kernel-spark][Part 2] CDC commit processing`
- **PR #6391** `[Part 2.5] CDC admission limits for commit processing`
- **PR #6359** `[Part 4] CDC data reading`
- **PR #6362** `[Part 5] CDC schema coordination`
- **PR #6370** `[Part 7] DV+CDC same-path pairing and DeletionVector support`
- **PR #6298** `E2E tests on all data loss scenarios during initial snapshot`

链接：对应 delta-io/delta PR #6075 / #6076 / #6391 / #6359 / #6362 / #6370 / #6298

这组 PR 表明 Delta Lake 在 **Kernel-Spark CDC 流式链路**上投入很大，关注点覆盖：
- offset 管理
- commit 处理
- admission limit
- 数据读取
- schema 协调
- DV（Deletion Vector）协同
- 数据丢失场景的端到端测试

背后的技术诉求非常明确：用户要的不只是“能跑”，而是**在 initial snapshot、CDC 增量消费、Deletion Vector 共存场景下的严格正确性与鲁棒性**。  
这通常意味着目标用户已进入较复杂的生产流式场景，对 CDC 的一致性要求很高。

---

### 4.3 Unity Catalog Commit Metrics 进入落地阶段
- **PR #6156** `[OPEN] [UC Commit Metrics] Add full payload construction and schema tests`  
- **PR #6333** `[OPEN] [UC Commit Metrics] Add feature flag and async dispatch`  
链接：delta-io/delta PR #6156 / #6333

UC Commit Metrics 相关 PR 在今天持续更新，说明社区对**提交过程可观测性**需求旺盛。  
技术诉求主要包括：
- 统计提交产出规模（文件、字节、行数）
- 支持结构化 payload
- 通过 feature flag 降低功能上线风险
- 采用 async dispatch 避免对主提交流程造成额外阻塞

这类能力通常不是“锦上添花”，而是服务于托管平台、数据治理平台和大规模表运维场景的刚需。

---

### 4.4 Spark→Kernel 迁移抽象层开始成形
- **PR #6438** `[OPEN] [SPARK] Add DeltaV2TableManager trait for Kernel migration`  
  链接：delta-io/delta PR #6438

该 PR 的核心是引入 `DeltaV2TableManager` trait，把 `DeltaLog` 作为表操作入口的角色抽象出来，为后续将 Delta protocol reading 从 `DeltaLog` 迁移到 **Kernel** 奠定基础。  
这是较强的架构信号：  
Delta Lake 正在逐步从“Spark 内聚实现”走向“Kernel 为底座，多引擎共享”的方向。

---

## 5. Bug 与稳定性

以下按影响面和严重程度排序。

### 5.1 中高优先级：Python + Hive + JDBC 组合依赖冲突
- **PR #6441** `[OPEN] [Python] Add extra_excludes param to configure_spark_with_delta_pip (fix #5178)`  
  链接：delta-io/delta PR #6441

问题现象：
- 使用 `configure_spark_with_delta_pip`
- 同时启用 `enableHiveSupport()`
- 再搭配 JDBC connector（如 PostgreSQL）时
- 可能触发 `NoClassDefFoundError: org/apache/derby/client/ClientAutoloadedDriver`

影响分析：
- 这是一个**真实集成场景中的类路径/依赖冲突问题**
- 对 Python 用户尤其敏感，因为许多用户依赖 `pip + SparkSession` 快速搭环境
- 虽不属于数据正确性错误，但会直接导致功能不可用

修复状态：
- **已有 fix PR：#6441（开放中）**

---

### 5.2 中高优先级：流式 CDC 初始快照阶段的数据丢失风险防护仍在加强
- **PR #6298** `[OPEN] [kernel-spark] E2E tests on all data loss scenarios during initial snapshot`  
  链接：delta-io/delta PR #6298

问题性质：
- 当前不是单个已确认 bug issue，而是通过 E2E 测试系统性覆盖**initial snapshot 阶段可能出现的数据丢失场景**
- 说明维护者认为这一链路存在较高复杂度，必须通过全面测试兜底

影响分析：
- 涉及 CDC/流式场景的数据完整性
- 若存在缺陷，其严重程度将高于一般性能问题

修复状态：
- **已有测试/修复推进中的 PR：#6298**
- 相关功能性补丁散布在 CDC 堆叠 PR 中（#6075、#6076、#6391、#6359、#6362、#6370）

---

### 5.3 中优先级：V2/V1 写路径判断不稳，可能影响 Spark 写入兼容性
- **PR #5804** `[OPEN] [SPARK] Improve check for V2WriteCommand with fallback to V1 in PrepareDeltaScan`  
  链接：delta-io/delta PR #5804

问题性质：
- 现有逻辑曾假设写入总是面向 Delta 表，或所有 V2 都会回退到 V1
- 在某些情况下这一假设并不成立

影响分析：
- 可能引发 Spark 写路径判断失准
- 属于 **SQL/写入兼容性修复** 范畴，对使用 Spark 多数据源/多 catalog 的用户较重要

修复状态：
- **已有 fix PR：#5804（开放中）**

---

### 5.4 中优先级：读取 schema 校验不足，可能造成 Kernel 读路径行为不一致
- **Issue #2149** `[enhancement] [Kernel] Validate readSchema is a subset of the table schema in ScanBuilder`  
  链接：delta-io/delta Issue #2149

虽然被标注为 enhancement，但本质上与**读请求参数合法性校验**相关。若 `readSchema` 未严格限制为表 schema 子集，可能在某些情况下引入：
- 读取行为不一致
- 运行时报错晚发现
- 上层连接器集成时的 schema 约束不明确

修复状态：
- **暂未看到对应 fix PR 出现在今日列表中**

---

## 6. 功能请求与路线图信号

### 6.1 Flink Sink 几乎可以确定是下一阶段重点能力
- **Issue #5901**  
- **PR #6190**

从 epic + 具体实现 PR 的组合来看，**Kernel-based Flink Sink** 已不再是概念验证，而是进入分阶段交付状态。  
判断：**非常可能进入后续版本主线能力**。  
相关链接：
- delta-io/delta Issue #5901
- delta-io/delta PR #6190

---

### 6.2 Spark Kernel 化迁移将持续推进
- **PR #6438** `Add DeltaV2TableManager trait for Kernel migration`

这是典型的架构基础设施型 PR，短期内用户未必直接感知，但一旦持续推进，后续会影响：
- Spark 连接层代码组织
- 多引擎共享逻辑的边界
- 协议读取实现的可复用性

判断：**高概率属于中长期路线图核心方向**。  
相关链接：delta-io/delta PR #6438

---

### 6.3 UC Commit Metrics 很可能被纳入近期版本
- **PR #6156**
- **PR #6333**

已有完整 payload、schema tests、feature flag、async dispatch 等典型“上线前完善动作”，说明这项能力较接近可交付状态。  
判断：**大概率会被纳入下一批次版本或平台集成发布中**。  
相关链接：
- delta-io/delta PR #6156
- delta-io/delta PR #6333

---

### 6.4 Python 配置接口增强反映真实用户集成需求
- **PR #6441** `Add extra_excludes param to configure_spark_with_delta_pip`

这不是底层协议能力，但它直接改善了 Python 用户在复杂 Spark 依赖环境中的可用性。  
判断：若维护者希望降低上手摩擦，这类增强**很有机会尽快合入**。  
相关链接：delta-io/delta PR #6441

---

## 7. 用户反馈摘要

基于今日更新的 Issues/PR，可提炼出几个明确的用户痛点：

### 7.1 用户希望 Delta 在非 Spark 引擎里也具备一等体验
- 代表项：**Issue #5901 / PR #6190**
- 痛点本质：用户不满足于 Spark 专属能力，希望在 **Flink 流式写入**中也能稳定接入 Delta Lake。
- 说明：Delta 社区用户群已明显扩展到多引擎实时处理场景。  
链接：
- delta-io/delta Issue #5901
- delta-io/delta PR #6190

### 7.2 用户对 CDC 场景最关心的是正确性，而不只是性能
- 代表项：**PR #6298** 及整组 kernel-spark CDC 堆叠 PR
- 痛点本质：在初始快照、提交处理、Deletion Vector 并存等复杂场景里，用户最担心的是**数据漏读/错读/重复读**。  
链接：
- delta-io/delta PR #6298
- delta-io/delta PR #6075
- delta-io/delta PR #6076

### 7.3 Python 用户在“简化接入”与“复杂依赖环境”之间存在摩擦
- 代表项：**PR #6441**
- 痛点本质：`configure_spark_with_delta_pip` 虽简化接入，但在 Hive/JDBC 等真实环境下仍会暴露依赖冲突问题。
- 说明：用户期待官方工具不仅能“快速 demo”，也要能适配生产集成。  
链接：delta-io/delta PR #6441

### 7.4 内核侧 schema/commit 协议边界仍有待收紧
- 代表项：**Issue #2149 / Issue #5118**
- 痛点本质：无论是读 schema 校验，还是 UC v0 commit 特判处理，用户与维护者都在推动**边界条件显式化**，以减少协议层特殊分支。  
链接：
- delta-io/delta Issue #2149
- delta-io/delta Issue #5118

---

## 8. 待处理积压

以下为值得维护者关注的长期未完全收敛项：

### 8.1 Kernel 读 schema 子集校验问题存在时间较长
- **Issue #2149**  
  创建：2023-10-06，今日仍有更新  
  链接：delta-io/delta Issue #2149

这是一个存在较久的 Kernel 读路径约束问题。虽然被标记为 `good first issue`，但其意义并不小，涉及 API 合法性与读取一致性。长期未收敛说明该问题优先级偏低，但建议尽快安排实现。

---

### 8.2 Spark 写路径 V2/V1 fallback 修复 PR 挂起时间偏长
- **PR #5804**  
  创建：2026-01-08，仍处于 OPEN  
  链接：delta-io/delta PR #5804

该 PR 处理的是 Spark 写入路径判断问题，影响兼容性。挂起时间较长，建议维护者评估是否需要：
- 拆分范围
- 补更多回归测试
- 尽快给出 review 结论

---

### 8.3 UC 托管提交 v0 特殊处理仍未彻底抽象化
- **Issue #5118**  
  链接：delta-io/delta Issue #5118

该问题聚焦 `UCCatalogManagedClient` 对 UC ratifying v0 commit 的特殊分支处理。  
这类 issue 虽然短期看不一定阻塞功能，但若长期保留，会持续增加代码路径复杂度与维护成本。

---

### 8.4 CDC 大型堆叠 PR 过多，存在评审与集成压力
- 代表项：**#6075 / #6076 / #6391 / #6359 / #6362 / #6370**
- 链接：对应各 delta-io/delta PR

这一组工作技术价值很高，但堆叠层次较深，容易带来：
- 评审成本高
- 合并顺序依赖复杂
- 回归验证压力大

建议维护者持续关注主干集成节奏，避免长期堆积影响发布可预测性。

---

## 总结判断

Delta Lake 今日呈现出非常清晰的三条演进主轴：

1. **多引擎扩展**：Flink Sink 正在从规划走向实装  
2. **Kernel 化架构升级**：Spark 与 Kernel 的边界重构持续推进  
3. **生产级可观测性与稳定性**：UC Commit Metrics、CDC 正确性测试、Python 依赖兼容性问题同步推进

从健康度看，项目当前**不是维护型低频状态，而是明显的演进高峰期**。  
从风险看，最大挑战不在缺少方向，而在于**待合并 PR 较多、堆叠 PR 较深**，后续需要持续关注评审吞吐与集成节奏。

如果你愿意，我还可以继续把这份日报整理成更适合内部汇报的两种格式：
1. **面向管理层的 1 页简报版**
2. **面向研发团队的技术追踪版**

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend 项目动态日报 · 2026-03-31

## 1. 今日速览

过去 24 小时内，Databend 保持了较高的工程活跃度：Issues 更新 4 条、PR 更新 14 条，并发布了 2 个 patch 版本，说明项目在持续推进功能迭代的同时，也在积极处理稳定性与回归问题。  
从合并/关闭的 PR 看，今日重点集中在 **递归 CTE 能力补齐、查询规划器溢出修复、类型转换兼容性修复、字符串函数性能优化** 等方向，兼顾 SQL 语义正确性与执行效率。  
待合并 PR 也显示出明显的中期演进方向：**HTTP 查询结果格式增强、OTLP Trace 调试工具、去全局单例化重构、轻量开发构建支持、recluster 存储优化**。  
整体判断：**项目健康度高，研发节奏稳健，当前处于“功能补强 + 内核重构 + 稳定性修复”并行推进阶段。**

---

## 2. 版本发布

过去 24 小时有 2 个新版本发布：

### v1.2.881-patch-1
- 发布说明：v1.2.881-patch-1  
- Changelog: https://github.com/databendlabs/databend/compare/v1.2.891-nightly...v1.2.881-patch-1

### v1.2.833-patch-1
- 发布说明：v1.2.833-patch-1  
- Changelog: https://github.com/databendlabs/databend/compare/v1.2.891-nightly...v1.2.833-patch-1

### 发布解读
从提供的数据看，这两个版本均为 **patch 线路修补发布**，但当前 release note 未列出具体提交明细，因此无法直接确认包含哪些修复。结合今日已关闭/合并 PR，推测 patch 版本大概率围绕以下问题进行回补：

- 查询规划阶段 `UInt64` 全范围统计信息导致的 overflow panic 修复  
  关联 Issue: #19555  
  关联 PR: #19632  
  链接：  
  - https://github.com/databendlabs/databend/issues/19555  
  - https://github.com/databendlabs/databend/pull/19632

- 递归 CTE 正确性问题修复（数独案例）  
  关联 Issue: #18237  
  关联 PR: #19599  
  链接：  
  - https://github.com/databendlabs/databend/issues/18237  
  - https://github.com/databendlabs/databend/pull/19599

### 破坏性变更与迁移注意事项
基于当前数据，**未看到明确标注的 breaking change**。  
但建议升级用户重点关注以下兼容性变化：

1. **递归 CTE 行为可能与旧版本不同**  
   某些过去报错的查询现在会被正确执行，建议回归验证依赖 recursive CTE 的业务 SQL。  
   链接：https://github.com/databendlabs/databend/pull/19599

2. **数值统计推导更安全**  
   规划器不再因 `UInt64` 全范围统计而 panic，这属于修复性变化，通常无需迁移，但建议对依赖表统计信息的复杂查询执行计划进行抽样对比。  
   链接：https://github.com/databendlabs/databend/pull/19632

3. **若后续合入 `X'...'` 二进制字面量修复，SQL 解析语义会更标准化**  
   该项目前仍在 open 状态，后续版本若包含，可能影响依赖旧解析路径的边缘 SQL。  
   链接：  
   - https://github.com/databendlabs/databend/pull/19636  
   - https://github.com/databendlabs/databend/pull/19635

---

## 3. 项目进展

以下为今日合并/关闭的重点 PR，按影响方向归类：

### 3.1 查询引擎功能推进

#### 递归 CTE 支持数独求解场景
- PR: #19599 feat: recursive cte support sudoku  
- 状态：已关闭（从上下文看应为完成修复）  
- 链接：https://github.com/databendlabs/databend/pull/19599

该 PR 直接修复了递归 CTE 在复杂递归求解场景中的正确性问题，对应关闭了长期跟踪问题中的一项子任务。它表明 Databend 在 **高级 SQL、尤其是递归 CTE 的执行正确性** 上继续逼近成熟数据库行为。

对应 Issue：
- #18237 Bug: using recursive CTE to solve sudoku returns error  
  https://github.com/databendlabs/databend/issues/18237
- #18144 Tracking: improve CTE  
  https://github.com/databendlabs/databend/issues/18144

**意义**：这是面向分析型 SQL 复杂表达能力的重要补齐，尤其对图遍历、层级数据、递归生成类查询有现实价值。

---

### 3.2 稳定性与规划器修复

#### 修复 `UInt64` 全范围列统计导致的 planner panic
- PR: #19632 fix(sql): avoid uint ndv overflow in scan stats  
- 状态：已关闭  
- 链接：https://github.com/databendlabs/databend/pull/19632

该修复针对 `Scan::derive_stats` 在处理 `UInt64` 列统计范围 `[0, u64::MAX]` 时的 NDV 推导溢出，避免规划阶段直接 panic。  
对应 Issue：
- #19555 bug: planner panic on UInt64 full-range column stats  
  https://github.com/databendlabs/databend/issues/19555

**意义**：这是典型的高优先级稳定性修复，因为它会导致查询在规划阶段崩溃，而非仅产生错误结果或性能下降。

---

### 3.3 SQL 兼容性与表达式行为修正

#### 修复 Variant 到 Number 的转换行为
- PR: #19623 fix(query): fix variant cast to number  
- 状态：已关闭  
- 链接：https://github.com/databendlabs/databend/pull/19623

该 PR 允许浮点型 variant 值转换为整数，并按 round 语义处理。  
**意义**：改善半结构化数据处理体验，提升 JSON/Variant 与数值类型交互时的可用性，减少用户在 ETL 和宽表分析中的显式转换成本。

#### 多表插入失败时保留流状态
- PR: #19637 fix: skip on_finish in CommitMultiTableInsert on error to preserve stream  
- 状态：已关闭  
- 链接：https://github.com/databendlabs/databend/pull/19637

该修复避免在 `CommitMultiTableInsert` 出错时错误执行 `on_finish`，从而破坏 stream。  
**意义**：属于写入链路的容错修复，对多表写入、复杂导入流程的稳定性有实际帮助。

---

### 3.4 性能优化

#### 字符串函数快速路径优化
- PR: #19628 feat: add fast paths for substr and string column concat  
- 状态：已关闭  
- 链接：https://github.com/databendlabs/databend/pull/19628

优化点包括：
- `substr` 常见 ASCII / 单字符场景快速路径
- 字符串列拼接避开通用 Arrow concat 路径

**意义**：这类改动通常对日志分析、文本维度处理、SQL 侧字符串清洗等高频场景有直接收益，属于典型的 OLAP 内核微优化。

---

### 3.5 依赖维护

#### bump dtparse
- PR: #19640 chore: bump dtparse to 7a9e40f  
- 状态：已关闭  
- 链接：https://github.com/databendlabs/databend/pull/19640

虽然是依赖升级，但对时间解析、日期文本兼容性等相关功能可能有间接改善，建议关注后续回归反馈。

---

## 4. 社区热点

今天的数据里，评论数和 reaction 数都不高，说明讨论热度并未集中爆发，更多体现为 **维护者主导的高效率工程推进**。结合技术影响面，以下条目值得重点关注：

### 4.1 CTE 路线图持续推进
- Issue: #18144 Tracking: improve CTE  
- 链接：https://github.com/databendlabs/databend/issues/18144

这是当前最明确的路线图信号之一。Issue 中列出了多个已完成与待完成事项，其中：
- #18237 已完成
- #18421 仍未完成
- “Support distributed execution of recursive CTEs” 仍待支持

**技术诉求分析**：  
Databend 不仅在修复 recursive CTE 的 correctness，还在向 **分布式递归执行** 这一更高难度目标推进。对于 OLAP 数据库而言，支持递归 CTE 只是第一步，如何让其在分布式环境下高效且可控地执行，才决定其生产可用性。

---

### 4.2 HTTP 查询接口可观测性增强
- PR: #19642 feat(query): add trace_debug OTLP dump utilities for direct and HTTP query tracing  
- 链接：https://github.com/databendlabs/databend/pull/19642

**技术诉求分析**：  
这是明显面向可观测性的增强。Databend 在 direct SQL 与 `/v1/query` HTTP 路径上增加 OTLP dump 工具，说明项目正在强化：
- 查询链路排障能力
- OpenTelemetry 对接
- HTTP 查询服务的可诊断性

这对云服务、托管场景和复杂 SQL 的线上调优尤其重要。

---

### 4.3 HTTP 结果格式能力增强
- PR: #19639 feat: add http_json_result_mode and refactor HTTP result string encoding  
- 链接：https://github.com/databendlabs/databend/pull/19639

**技术诉求分析**：  
该 PR 直接面向 API 消费者，涉及 HTTP 查询结果 JSON 输出模式与字符串序列化路径重构。  
这反映了用户对 Databend 作为“SQL over HTTP”服务端的需求正在增强，典型场景包括：
- BI 中间层接入
- 自定义网关/数据服务
- SDK / Web 应用查询接口

---

## 5. Bug 与稳定性

按严重程度排序如下：

### P1 · 查询规划器崩溃
#### `UInt64` 全范围统计触发 overflow panic
- Issue: #19555  
  https://github.com/databendlabs/databend/issues/19555
- Fix PR: #19632  
  https://github.com/databendlabs/databend/pull/19632
- 状态：Issue 已关闭，修复已提交

**影响**：查询在 planning 阶段 panic，属于高严重度稳定性问题。  
**现状**：已有回归测试，风险基本受控。

---

### P1 · 递归 CTE 查询正确性
#### recursive CTE 求解数独报错
- Issue: #18237  
  https://github.com/databendlabs/databend/issues/18237
- Fix PR: #19599  
  https://github.com/databendlabs/databend/pull/19599
- 状态：Issue 已关闭

**影响**：高级 SQL 能力不完整，影响递归查询正确性与用户信心。  
**现状**：已修复，但 CTE 总体路线图仍未完成，后续还需关注分布式执行支持。

---

### P2 · 多表插入错误处理可能破坏流
- PR: #19637  
  https://github.com/databendlabs/databend/pull/19637
- 状态：已关闭

**影响**：写入链路异常处理不当，可能影响流式写入稳定性。  
**现状**：已修复，建议关注多表 insert / stream 相关回归。

---

### P2 · SQL 二进制字面量解析不符合标准
- PR: #19636  
  https://github.com/databendlabs/databend/pull/19636
- PR: #19635  
  https://github.com/databendlabs/databend/pull/19635
- 状态：均为 OPEN

**问题**：`X'...'` 当前被错误走到整数字面量路径，而不是 SQL 标准 binary literal。  
**影响**：SQL 兼容性问题，尤其影响跨库迁移与标准 SQL 用户。  
**现状**：已有 fix PR，预计较快落地。

---

### P3 · 文档链接检查报错
- Issue: #19643 Link Checker Report  
- 链接：https://github.com/databendlabs/databend/issues/19643
- 状态：OPEN

**影响**：不影响引擎运行，但影响文档可信度与开发者体验。  
**现状**：自动化机器人发现 1 条错误链接，建议尽快修复。

---

## 6. 功能请求与路线图信号

### 6.1 recursive CTE 能力仍在持续扩展
- Tracking Issue: #18144  
  https://github.com/databendlabs/databend/issues/18144

从跟踪列表看，Databend 已经逐步解决 recursive CTE 的多个子问题，但仍有两类重要需求未完全落地：
- 分布式执行 recursive CTE
- 尚未完成的若干子任务（如 #18421）

**判断**：CTE 仍是下一阶段查询引擎的重要演进方向，很可能继续进入后续版本。

---

### 6.2 HTTP 查询接口将更适合作为产品化 API
- PR: #19639  
  https://github.com/databendlabs/databend/pull/19639
- PR: #19642  
  https://github.com/databendlabs/databend/pull/19642

这两个 PR 组合起来很有信号意义：
- 一个增强 HTTP 结果表示层
- 一个增强 HTTP/Direct 查询链路 tracing

**判断**：Databend 正在加强“作为云原生查询服务”的接口能力，后续版本可能继续补：
- 更稳定的 JSON schema 输出
- 更细粒度 trace/debug 开关
- 更好的 SDK / API 集成体验

---

### 6.3 内核架构朝更易维护方向演进
- PR: #19638 refactor(query): phase 1 of removing global service lookups  
  https://github.com/databendlabs/databend/pull/19638
- PR: #19644 refactor(query): retain optional gates for lean dev builds  
  https://github.com/databendlabs/databend/pull/19644

**判断**：这类 PR 不直接暴露给最终用户，但会明显影响未来开发效率、模块解耦、测试可维护性和 contributor 体验。  
对开源项目健康度来说，这是积极信号，说明团队并未只堆功能，而在同步偿还架构债务。

---

## 7. 用户反馈摘要

基于今日 Issues/PR 内容，可提炼出以下真实用户痛点与使用场景：

1. **高级 SQL 正确性是刚需**  
   recursive CTE 数独案例虽然看似“极端”，但本质上代表用户在使用 Databend 处理复杂递归推理、层级展开、生成式 SQL。用户期待的不只是“支持语法”，而是“复杂案例也正确”。

2. **跨库兼容性要求持续上升**  
   `X'...'` 二进制字面量解析问题说明，用户越来越倾向将标准 SQL 或其他数据库 SQL 直接迁移到 Databend，希望少改写、少踩坑。

3. **半结构化数据分析场景在增长**  
   Variant 到 number 的 cast 修复表明，JSON / Variant 与结构化数值类型之间的互转是高频诉求，Databend 在数据湖与灵活 schema 场景中的使用正在增加。

4. **线上排障与可观测性诉求增强**  
   OTLP trace dump 工具的推进，说明维护者已感知到真实环境中对 query tracing、HTTP 路径诊断的需要。这通常来自复杂生产部署和 SaaS/云服务用户。

---

## 8. 待处理积压

以下条目值得维护者后续重点关注：

### 8.1 CTE 长线任务仍未完成
- Issue: #18144 Tracking: improve CTE  
- 链接：https://github.com/databendlabs/databend/issues/18144

虽然多个子任务已完成，但该跟踪问题仍显示：
- #18421 未完成
- recursive CTE 分布式执行未完成

**建议**：继续拆解里程碑，明确 correctness、optimizer、distributed execution 三阶段目标，否则容易在功能“可用但不完整”的状态停留过久。

---

### 8.2 BlockPartitionStream 大块拆分 PR 仍待推进
- PR: #19627 refactor: split oversized blocks in BlockPartitionStream and add unit tests  
- 链接：https://github.com/databendlabs/databend/pull/19627

该 PR 已存在数日，涉及 block 大小控制与单测补强，对执行链路和资源控制有现实意义。  
**建议**：尽快明确 review 结论，避免数据块尺寸问题在边界场景持续影响内存与下游算子表现。

---

### 8.3 `X'...'` binary literal 修复存在重复/并行 PR
- PR: #19636  
  https://github.com/databendlabs/databend/pull/19636
- PR: #19635  
  https://github.com/databendlabs/databend/pull/19635

两条 PR 目标高度相近，说明该问题已被快速响应，但也可能带来 review 分流与重复劳动。  
**建议**：尽快收敛到单一实现，避免合并策略不清晰。

---

## 附：今日重点链接汇总

- Releases  
  - v1.2.881-patch-1: https://github.com/databendlabs/databend/compare/v1.2.891-nightly...v1.2.881-patch-1  
  - v1.2.833-patch-1: https://github.com/databendlabs/databend/compare/v1.2.891-nightly...v1.2.833-patch-1

- 重要 Issues  
  - #18144 CTE 跟踪: https://github.com/databendlabs/databend/issues/18144  
  - #18237 recursive CTE 数独报错: https://github.com/databendlabs/databend/issues/18237  
  - #19555 UInt64 统计溢出 panic: https://github.com/databendlabs/databend/issues/19555  
  - #19643 Link Checker Report: https://github.com/databendlabs/databend/issues/19643

- 重要 PR  
  - #19599 recursive cte support sudoku: https://github.com/databendlabs/databend/pull/19599  
  - #19632 avoid uint ndv overflow: https://github.com/databendlabs/databend/pull/19632  
  - #19623 fix variant cast to number: https://github.com/databendlabs/databend/pull/19623  
  - #19628 substr / concat fast paths: https://github.com/databendlabs/databend/pull/19628  
  - #19639 HTTP JSON result mode: https://github.com/databendlabs/databend/pull/19639  
  - #19642 trace_debug OTLP dump: https://github.com/databendlabs/databend/pull/19642  
  - #19638 remove global service lookups phase 1: https://github.com/databendlabs/databend/pull/19638  
  - #19641 recluster compact phase optimization: https://github.com/databendlabs/databend/pull/19641  
  - #19636 / #19635 X'...' binary literal fix: https://github.com/databendlabs/databend/pull/19636 / https://github.com/databendlabs/databend/pull/19635

如果你愿意，我还可以把这份日报进一步整理成：
1. **适合发在飞书/Slack 的简版晨报**，或  
2. **适合周报汇总的趋势版（按查询引擎/存储/兼容性分组）**。

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

以下为 **Velox 项目 2026-03-31 动态日报**。

---

# Velox 项目日报 · 2026-03-31

## 1. 今日速览

过去 24 小时，Velox 社区保持 **高活跃度**：共有 **50 条 PR 更新**、**3 条 Issue 更新**，但 **无新版本发布**。  
从变更结构看，当前工作重心仍集中在 **查询执行能力增强、类型系统扩展、Hive/Parquet 读取优化、CI/开发者体验改进** 等方向。  
当天已有 **21 条 PR 合并或关闭**，说明主线开发推进顺畅；同时仍有 **29 条 PR 待合并**，积压主要分布在 SQL 函数补齐、类型转换规则、cuDF 集成和性能观测能力等主题。  
Issue 侧新增讨论不多，但涉及 **GPU/cuDF 架构统一**、**spill 层级上限**、**Python 代码格式导致 pre-commit 失败** 等，反映出项目正在同时处理 **架构演进、稳定性与开发流程治理**。

---

## 2. 项目进展

### 今日已合并/关闭的重要 PR

#### 2.1 移除 `function_scheduler` shim，减少外部依赖路径复杂度
- **PR**: #16969  
- **状态**: 已合并  
- **链接**: facebookincubator/velox PR #16969

该 PR 将 `xplat/folly/experimental` 中的 `function_scheduler` shim 移除并改写引用路径。  
这类改动虽不直接面向 SQL 功能，但对 Velox 这类嵌入式执行引擎非常重要：它有助于降低依赖层历史包袱，减少跨仓库同步时的兼容成本，并提升后续构建与平台整合的可维护性。  
从基础设施角度看，这属于 **工程健康度提升**，有利于后续性能与功能改动更稳定落地。

---

#### 2.2 调整 `HashTable` 运行时统计定义顺序，改善内部统计组织
- **PR**: #16965  
- **状态**: 已合并  
- **链接**: facebookincubator/velox PR #16965

该 PR 将 `HashTable` 中 `addRuntimeStats` 的位置移动到所有统计定义之后。  
这是一个偏内部重构的改动，但值得关注：Velox 的 HashTable 是聚合、Join 等关键算子的核心基础设施，统计口径和注册顺序的规范化，有助于后续 **性能分析、调优工具链和诊断指标一致性**。  
结合近期多个“runtime stats”“adaptive sampling”相关 PR，可见项目正在持续强化 **可观测性体系**。

---

#### 2.3 文档/站点改进：README/博客展示增强
- **PR**: #16970  
- **状态**: 已合并  
- **链接**: facebookincubator/velox PR #16970

该 PR 将侧边栏博客展示数量由默认 5 篇扩展到 24 篇。  
虽然不直接影响执行引擎，但说明维护者正在加强项目对外传播与信息可见性，对开源社区吸引外部贡献者和用户理解路线图都有帮助。  
结合仍在进行中的 README 自动更新 pre-commit hook（#16955），可判断维护团队正在推进 **开发流程自动化 + 文档治理**。

---

## 3. 社区热点

### 3.1 cuDF 算子统一基类架构
- **Issue**: #16885  
- **状态**: Open  
- **评论**: 12  
- **链接**: facebookincubator/velox Issue #16885

**主题**：将 `CudfTopN`、`CudfLimit`、`CudfOrderBy` 等 cuDF 算子统一到公共基类架构。  

这是今日最值得关注的架构型讨论之一。其技术诉求非常明确：当前多个 GPU/cuDF 算子各自直接继承 `exec::Operator` 与 `NvtxHelper`，造成逻辑重复、生命周期管理分散、公共行为难以沉淀。  
背后反映的是 Velox 在 **GPU 执行路径逐步扩展** 后，开始面临典型的“功能先落地、再统一抽象”的阶段性问题。  
若该改造推进成功，将可能带来：
- 更统一的 GPU 算子生命周期与资源管理；
- 更容易扩展新的 cuDF operator；
- 更清晰的 profiling / NVTX 埋点能力；
- 更低的维护成本。

这与当前另一个 cuDF 方向 PR **#16444 `feat(cuDF): Add CudfPlanNodeChecker`** 形成呼应，说明 Velox 的 GPU 执行支持正在从“零散能力点”走向“体系化建设”。

---

### 3.2 Spill 层级上限配置诉求
- **Issue**: #15400  
- **状态**: Open  
- **评论**: 6  
- **👍**: 1  
- **链接**: facebookincubator/velox Issue #15400

**主题**：将 `SpillPartitionId::kMaxSpillLevel` 从 3 调整为 7。  

该问题来自 Gluten 用户场景，用户在生产使用中遇到：
`Spill level 4 exceeds max spill level 3`。  
这说明某些高压力查询或内存受限环境中，当前 spill 层级上限可能成为实际瓶颈，且无法通过现有 `max_spill_level` 配置绕开。  

背后的技术信号：
- Velox 在大规模 Join / Aggregation / Sort 场景的外溢机制，可能仍存在 **硬编码限制与配置语义不一致** 的问题；
- 上游用户（尤其是 Gluten/Presto/Spark 生态）已经在更高复杂度工作负载下触碰边界；
- 若该问题持续，可能影响 Velox 作为统一执行引擎在内存受限 OLAP 环境中的稳定性口碑。

该 Issue 虽不是新开，但依然是非常关键的 **生产可用性反馈**。

---

### 3.3 Python pre-commit 格式失败问题已快速关闭
- **Issue**: #16952  
- **状态**: Closed  
- **评论**: 2  
- **链接**: facebookincubator/velox Issue #16952

该问题指出新增 Python 文件未通过 `ruff-format`，导致任何包含这些文件 diff 的 PR 都会触发 pre-commit 失败。  
虽然问题本身影响范围有限，但它暴露了一个典型风险：**pre-commit 只在 PR 上跑、不在 main push 上跑**，会使主干存在“隐藏格式债务”。  
这个问题已在一天内关闭，说明维护者对 **开发者体验和 CI 正确性** 反应较快。

---

## 4. Bug 与稳定性

以下按严重程度排序。

### P1：Spill 层级超过上限，影响高压力查询稳定性
- **Issue**: #15400  
- **状态**: Open  
- **链接**: facebookincubator/velox Issue #15400

**问题描述**：用户在 Gluten 1.5.0 环境中遭遇 `Spill level 4 exceeds max spill level 3`。  
**影响范围**：可能影响内存紧张场景下的多轮 spill 查询，涉及执行稳定性。  
**严重性判断**：高。因为这不是简单功能缺失，而是可能导致查询失败。  
**是否已有 fix PR**：当前提供数据中 **未看到明确对应修复 PR**。  
**建议关注**：应尽快明确是编码位宽限制、默认上限保守，还是配置项未生效/语义不一致。

---

### P2：`make_timestamp` 边界校验 off-by-one，存在查询正确性风险
- **PR**: #16944  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16944

**问题描述**：`make_timestamp` 的输入校验将 `hour=24`、`minute=60` 误判为合法，因为使用了 `>` 而非 `>=`。  
**影响范围**：SQL 时间构造函数结果可能不正确，属于典型的 **查询正确性 bug**。  
**严重性判断**：中高。  
**是否已有 fix PR**：**有，修复 PR 已提交但未合并**。  
这类 bug 对 OLAP 引擎尤其敏感，因为它会在结果层面产生“静默错误”，比直接失败更危险。

---

### P3：Python 文件格式问题导致 pre-commit 失败
- **Issue**: #16952  
- **状态**: Closed  
- **链接**: facebookincubator/velox Issue #16952

**问题描述**：部分新增 Python 脚本不符合 `ruff-format`，导致 PR pre-commit 工作流失败。  
**影响范围**：主要影响贡献流程，不直接影响查询运行时。  
**严重性判断**：中低。  
**是否已有 fix**：**问题已关闭**，且相关流程治理也在通过 #16955 持续完善。

---

### P3：PARQUET 零 offset 读取支持，属于边界兼容性修复
- **PR**: #16456  
- **状态**: Open，ready-to-merge  
- **链接**: facebookincubator/velox PR #16456

该 PR 支持读取 **zero offset** 的 Parquet 文件。  
这更像是存储格式兼容边界修复：在某些文件元数据布局下，`file_offset` 可能为 0。  
对使用异构生成链路写出的 Parquet 文件的用户而言，这类修复价值很高，能减少“文件能打开但部分 row group 无法正确处理”的风险。  
目前已 ready-to-merge，建议优先处理。

---

## 5. 功能请求与路线图信号

### 5.1 cuDF 体系化建设正在加速
- **Issue**: #16885  
- **PR**: #16444  
- **链接**:  
  - facebookincubator/velox Issue #16885  
  - facebookincubator/velox PR #16444

一边是统一 cuDF operator 基类，一边是新增 `CudfPlanNodeChecker` 用于在 Presto coordinator 级别提前校验可否走 cuDF 路径。  
这表明 Velox 对 GPU 加速的推进已从“单算子实现”转向“执行前校验 + operator 复用抽象 + 运行期埋点”的完整体系。  
**判断**：这是非常强的路线图信号，后续版本很可能继续增加 GPU 可执行性检查、算子覆盖率和统一抽象层。

---

### 5.2 SQL 函数兼容性继续向 Presto Java 对齐
相关 PR 较多，且集中在补齐函数族能力：

- **#16487** `array_least_frequent`
- **#16048** `array_top_n` 支持 transform lambda
- **#16162** `map_top_n_keys` 支持 transform lambda
- **#16235** Base32 编解码
- **#15511** S2 Presto UDFs  
- **链接**: 对应各 PR 链接均为 `facebookincubator/velox PR #编号`

这些改动的共同点是：
1. 明确以 **Presto/Trino 生态兼容** 为目标；
2. 既补齐基础编码函数，也扩展数组/Map/地理空间相关表达能力；
3. 说明 Velox 正持续增强作为 SQL 执行层的函数完备性。  

**判断**：其中 `Base32`、`array_*` 系列和 `map_*` 系列最有可能进入下一批版本，因为它们兼容性收益高、实现边界清晰。

---

### 5.3 类型系统正在从内建类型走向可扩展强规则化
- **PR**: #16461, #16821  
- **链接**:  
  - facebookincubator/velox PR #16461  
  - facebookincubator/velox PR #16821

`CastRulesRegistry` 的引入与 `CastRule cost` 的传播修复，共同说明 Velox 类型强制转换系统正在升级。  
其目标并非简单“支持更多 cast”，而是让 **自定义类型**（如 `TIMESTAMP WITH TIME ZONE`）也能参与隐式类型推导与重载决策。  
这对于连接器自定义类型、扩展 SQL 类型、函数重载解析都很关键。  
**判断**：这是中长期架构演进方向，很可能成为未来版本的重要能力基石。

---

### 5.4 Hive/ScanSpec pushdown 和索引统计能力持续增强
- **PR**: #16968, #16926  
- **链接**:  
  - facebookincubator/velox PR #16968  
  - facebookincubator/velox PR #16926

`#16968` 将 extraction pushdown 与 `HiveDataSource` 集成，意味着 Velox 试图把结构化抽取逻辑更早地下推到扫描层，减少无效读取与上层表达式开销。  
`#16926` 则为 Hive 索引查找链路补充 runtime stats。  
两者一起构成清晰信号：**Velox 正在加强扫描层的下推优化与可观测性闭环**。  
这对 OLAP 存储读取性能提升价值较大，尤其适用于复杂嵌套列、Map key filter、struct 字段裁剪场景。

---

## 6. 用户反馈摘要

### 6.1 生产用户最真实的痛点仍是“资源受限下的查询能否跑完”
- **来源**: #15400  
- **链接**: facebookincubator/velox Issue #15400

来自 Gluten 的反馈非常典型：用户不是在讨论抽象设计，而是在生产环境中直接遇到 spill 层数超限导致的失败。  
这说明 Velox 在实际部署里已经承载较重的 OLAP 工作负载，用户关心的核心不是“是否支持 spill”，而是 **极端情况下 spill 机制是否足够鲁棒、参数是否真正可控**。

---

### 6.2 贡献者对 GPU 路径的可维护性诉求上升
- **来源**: #16885, #16444  
- **链接**:  
  - facebookincubator/velox Issue #16885  
  - facebookincubator/velox PR #16444

cuDF 方向的讨论反映出，随着功能点增多，开发者已经开始被重复继承关系、重复逻辑、分散验证逻辑拖慢。  
这通常意味着某条子系统已经从实验阶段进入“需要平台化”的阶段。  
对项目健康度来说，这是一种正向信号：说明功能不再只是 PoC，而是在向可持续维护演进。

---

### 6.3 开发者体验问题能被快速修复，社区响应效率较好
- **来源**: #16952, #16955  
- **链接**:  
  - facebookincubator/velox Issue #16952  
  - facebookincubator/velox PR #16955

Python 格式问题虽然不大，但会直接影响贡献效率。  
Issue 快速关闭、同时配套 pre-commit 自动化 PR 跟进，说明维护者对于“降低提交摩擦”是重视的。  
这有助于保持外部贡献活跃度。

---

## 7. 待处理积压

以下是值得维护者重点关注的长期或停留时间较长的 PR/Issue。

### 7.1 `array_least_frequent` 功能补齐已持续一个多月
- **PR**: #16487  
- **创建**: 2026-02-23  
- **状态**: Open  
- **链接**: facebookincubator/velox PR #16487

该函数属于明显的 SQL 兼容性补齐项，需求明确、用户价值清晰。若长期未合并，可能影响与 Presto 行为对齐节奏。  
建议维护者确认剩余阻塞点是语义边界、性能、还是代码风格问题。

---

### 7.2 Base32 支持与公共编码工具重构存在链式依赖
- **PR**: #16235, #16176  
- **创建**: 2026-02-04 / 2026-01-30  
- **链接**:  
  - facebookincubator/velox PR #16235  
  - facebookincubator/velox PR #16176

`Base32` 功能依赖 `BaseEncoderUtils` 提取，两个 PR 已持续较久。  
这类“功能 PR + 基础重构 PR”绑定的情况容易造成合并阻塞。  
建议拆解评估：若基础工具已足够稳定，可优先合并基础层，释放上层函数功能。

---

### 7.3 `array_top_n` / `map_top_n_keys` lambda 版本推进较慢
- **PR**: #16048, #16162  
- **创建**: 2026-01-16 / 2026-01-29  
- **链接**:  
  - facebookincubator/velox PR #16048  
  - facebookincubator/velox PR #16162

这两项都是 Presto 兼容增强，且属于较常用的高阶函数能力。  
长期未合并可能意味着：
- lambda 语义一致性仍需打磨；
- 类型推导/执行性能存在顾虑；
- 测试覆盖要求较高。  

若项目近期希望强化 SQL 完备性，这两项应属于优先清理积压对象。

---

### 7.4 自定义类型 coercion 体系仍在积压
- **PR**: #16461, #16821  
- **链接**:  
  - facebookincubator/velox PR #16461  
  - facebookincubator/velox PR #16821

这组改动对长期架构意义大，但若久拖不决，会使自定义类型相关功能继续受限。  
建议维护者尽快统一设计口径，因为它直接影响后续类型扩展与函数解析能力。

---

### 7.5 Spill 上限 Issue 属于应尽快响应的生产级积压
- **Issue**: #15400  
- **链接**: facebookincubator/velox Issue #15400

虽然不是当天新开，但它的业务影响明显高于一般 enhancement。  
建议维护者至少先给出：
- 当前限制是否设计如此；
- 是否可通过配置/补丁绕过；
- 是否已有计划提高上限或修改编码方案。

---

## 8. 总体判断

Velox 当前处于 **高活跃、持续演进且工程健康度较好** 的状态。  
短期重点呈现为三条主线：

1. **执行引擎与连接器优化**：Hive 扫描下推、索引统计、Parquet 边界兼容；
2. **SQL 兼容性增强**：数组/Map 高阶函数、Base32、S2 UDF；
3. **基础设施与可维护性提升**：类型 coercion 规则化、cuDF 架构统一、CI/pre-commit 改进。

需要特别关注的风险点是：  
- **spill 机制边界** 是否会继续影响生产查询稳定性；  
- **时间函数正确性修复** 是否能尽快合入；  
- 多个 **长期开放的兼容性 PR** 是否会拖慢版本价值释放。

整体看，项目健康度良好，且路线图清晰，尤其在 **GPU 执行、类型系统扩展、扫描下推优化** 三个方向上已有明显信号。

--- 

如果你愿意，我还可以继续把这份日报整理成：
1. **适合飞书/Slack 发布的精简版**，或  
2. **按“查询引擎 / 存储 / SQL / CI”四大模块分栏版**。

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten 项目动态日报（2026-03-31）

## 1. 今日速览

过去 24 小时内，Apache Gluten 保持较高活跃度：Issues 更新 5 条、PR 更新 23 条，说明项目仍处于密集迭代阶段，且以功能补齐、测试恢复、兼容性修复为主。  
从变更结构看，Velox 后端仍是当前开发重心，涉及并行执行、Kafka 读取、TimestampNTZ、Parquet 类型拓宽、ANSI CAST 行为等多个方向；同时 ClickHouse 后端也出现了新的 SQL 正确性修复。  
当天没有新版本发布，但从多条 PR 内容判断，项目正在为 Spark 4.x 适配完善、SQL 语义对齐和原生执行能力增强持续清障。  
整体健康度偏积极：关闭/合并了 7 条 PR，新增问题数量不高，但仍存在一些长期跟踪型 issue 和基础稳定性问题，尤其在 spill、S3 生命周期、测试禁用项方面需要持续关注。

---

## 2. 项目进展

以下为今日已关闭/完成的较重要 PR，反映了项目在查询引擎能力、文档治理、工具链和异常处理上的推进。

### 2.1 文档与版本支持信息更新
- **PR #11851 - [DOC] Update documentation for Spark version support and TLP graduation**  
  链接: apache/gluten PR #11851  
  该 PR 更新了过期文档，移除了对 Spark 3.2 的陈旧描述，补充 Spark 4.0/4.1 支持信息，并反映项目从 Incubator 向 Top-Level Project 毕业的状态变更。  
  **意义**：这类文档同步虽不直接改变执行引擎能力，但对用户选型和兼容性预期非常关键，尤其有助于减少 Spark 版本误配导致的集成风险。

### 2.2 Velox 测试与基准工具修正
- **PR #11792 - [VL] Gluten-it: Rename column `c_last_review_date` to `c_last_review_date_sk`**  
  链接: apache/gluten PR #11792  
  修正 TPC-DS v2.7 schema 字段命名不一致问题，避免内部测试尤其是 Q30 出现偏差。  
  **意义**：属于测试基准与数据集一致性修复，对性能回归分析和结果可信度有直接帮助。

### 2.3 Velox 原生 Parquet 复杂类型写入能力落地
- **PR #11788 - [VL] Enable native Parquet write for complex types (Struct/Array/Map)**  
  链接: apache/gluten PR #11788  
  为 Velox 后端启用复杂类型的原生 Parquet 写入能力，依托 Arrow Parquet writer 的嵌套类型支持。  
  **意义**：这是今天最值得关注的已关闭 PR 之一。它意味着 Gluten 在 Velox 路径上对复杂 schema 的写出能力进一步增强，有助于数据湖场景中 struct/array/map 类型的原生落盘，减少回退 Spark 的概率。对 Iceberg / Parquet-heavy workload 尤其重要。

### 2.4 依赖安全与工具链维护
- **PR #11846 - Bump pyasn1 from 0.4.8 to 0.6.3**
- **PR #11842 - Bump requests from 2.32.4 to 2.33.0**  
  链接: apache/gluten PR #11846 / #11842  
  两个 PR 都是 benchmark_velox 分析工具目录下的 Python 依赖升级。  
  **意义**：对核心执行路径影响有限，但有助于降低工具链安全债务。

### 2.5 异常传播语义修复
- **PR #11841 - Preserve exception type in ClosableIterator.translateException()**  
  链接: apache/gluten PR #11841  
  修复 RuntimeException 被重复包装为 GlutenException 的问题。  
  **意义**：这项修复改善了异常可观测性和调用方兼容性，便于上层框架精确捕获具体异常类型，对问题定位和稳定性治理是正向改进。

---

## 3. 社区热点

### 3.1 Velox 上游 PR 跟踪仍是最热议话题
- **Issue #11585 - [VL] useful Velox PRs not merged into upstream**  
  链接: apache/gluten Issue #11585  
  评论数 16，👍 4，为今日最活跃 issue。  
  这是一个长期 tracker，用于记录 Gluten 社区提交但尚未被 Velox upstream 合并的有价值 PR。  
  **技术诉求分析**：  
  - 社区希望减少维护 fork / pick patch 的成本  
  - 希望 Gluten 与 Velox 上游节奏更一致，降低 rebase 压力  
  - 反映出 Gluten 对 Velox 的依赖深且互动频繁，上游合并效率直接影响 Gluten 功能交付速度

### 3.2 Spark 4.x 测试恢复是近期主线
- **Issue #11550 - Spark 4.x: Tracking disabled test suites**  
  链接: apache/gluten Issue #11550  
- 相关 PR：  
  - **PR #11833 - Enable GlutenLogicalPlanTagInSparkPlanSuite (150/150 tests)**  
  - **PR #11848 - Enable GlutenCsvExpressionsSuite**  
  - **PR #11847 - Add GlutenTestSetWithSystemPropertyTrait, enable 6 suites...**  
  链接: apache/gluten PR #11833 / #11848 / #11847  

  **技术诉求分析**：  
  Spark 4.x 适配并不只是“能跑”，而是要求 Gluten 在 physical plan 替换、tag 传播、异常行为、SparkContext 生命周期管理等细节上与 Spark 原生行为对齐。  
  今日多个 PR 围绕该 tracker 收敛，说明 Spark 4.x 已进入从“功能可用”向“测试稳定、语义一致”推进的阶段。

### 3.3 TimestampNTZ 支持成为 Velox 兼容性热点
- **PR #11626 - Add basic TIMESTAMP_NTZ type support**  
- **PR #11720 - Add config to disable TimestampNTZ validation fallback**  
- **PR #11656 - Add validation tests for CurrentTimestamp and now(foldable)**  
  链接: apache/gluten PR #11626 / #11720 / #11656  

  **技术诉求分析**：  
  这组 PR 说明用户对 Spark 现代时间类型语义的要求正在上升。当前 Gluten/Velox 在 TimestampNTZ 上仍处于“逐步放开 + 验证兜底”的阶段，开发者希望先通过配置关闭 fallback 限制，再逐步补齐原生支持与测试覆盖。

### 3.4 UI 可观测性也成为关注点
- **PR #11853 - Fix fallback info for V2 writes and align plan with Spark SQL tab**  
  链接: apache/gluten PR #11853  
  **技术诉求分析**：  
  随着 Gluten 在生产场景使用增多，用户不再满足于“加速是否发生”，而是希望在 Spark UI 中准确看到哪些节点 fallback、为何 fallback、计划树与 Spark SQL tab 是否一致。这体现了项目从“内核优化”向“可运维、可解释”演进。

---

## 4. Bug 与稳定性

以下按严重程度排序：

### P1：查询/作业执行稳定性问题

#### 4.1 Velox spill 层级越界错误
- **Issue #11018 - [VL] "Spill level 4 exceeds max spill level 3" error**  
  链接: apache/gluten Issue #11018  
  这是今天最需要关注的运行时稳定性问题之一。错误信息显示在 HashProbe reclaim / spill 路径中发生状态异常，可能影响大内存压力查询或发生 spill 的 join/probe 场景。  
  **影响**：可能导致查询失败，属于执行期稳定性问题。  
  **现状**：暂无明确关联 fix PR 出现在今日列表中。  
  **建议关注**：排查 spill 策略层级控制、operator state 切换与内存回收协同逻辑。

#### 4.2 S3 文件系统生命周期未正确 finalize
- **Issue #11796 - [VL] finalizeS3FileSystem is never called**  
  链接: apache/gluten Issue #11796  
  描述表明 AWS SDK C++ teardown 未被调用，而 Velox 使用静态对象管理 S3 FileSystem。  
  **影响**：更可能表现为进程退出期资源清理异常、静态对象析构顺序问题，潜在引发退出 crash、资源泄露或不稳定行为。  
  **现状**：今日未见对应修复 PR。  
  **严重性**：对长生命周期服务、嵌入式执行环境和对象存储访问场景具有较高风险。

### P2：SQL 正确性问题

#### 4.3 ClickHouse 后端聚合语义错误：应返回 NULL 却返回 NaN
- **Issue #11849 - [CH] var_samp returns NaN instead of NULL when effective row count < 2**  
  链接: apache/gluten Issue #11849  
- **Fix PR #11850 - [CH] Fix diff for var_samp returns NaN instead of NULL...**  
  链接: apache/gluten PR #11850  

  该问题是今天新增且最明确的 SQL 正确性 bug：`var_samp` / `covar_samp` 在有效样本数不足时，结果应遵循 Spark/SQL 期望返回 `NULL`，但当前返回 `NaN`。  
  **影响**：属于结果正确性偏差，可能影响统计分析、BI 校验和回归测试。  
  **现状**：已有同日 fix PR，响应速度较快。  
  **判断**：问题边界清晰，预计较大概率在近期合入。

### P3：测试稳定性与兼容性债务

#### 4.4 Spark 4.x disabled test suites 持续跟踪
- **Issue #11550 - Spark 4.x: Tracking disabled test suites**  
  链接: apache/gluten Issue #11550  
  虽然这不是直接面向生产用户的 bug，但它反映出 Spark 4.x 兼容性仍存在一批未完全收口的问题。  
  **好消息**：今日已有多个启用测试套件的 PR 与之关联，说明问题在持续被消化。

---

## 5. 功能请求与路线图信号

### 5.1 Velox 并行执行能力进入探索阶段
- **PR #11852 - [VL] Proof of concept enable Velox parallel execution**  
  链接: apache/gluten PR #11852  
  虽然仍是 Draft，且作者明确表示“code TBD, bugs to fix, perf is unsure”，但这是非常强的路线图信号。  
  **判断**：若推进顺利，将显著影响 Velox 后端的吞吐能力和多核利用率，是中长期性能演进的重要方向。

### 5.2 Velox Kafka 读取支持可能纳入后续版本
- **PR #11801 - [VL] Adding kafka read support for Velox backend**  
  链接: apache/gluten PR #11801  
  **意义**：这是典型的新连接器/数据源能力扩展。  
  **判断**：如果代码成熟并通过兼容性验证，Kafka source 支持很可能成为后续版本的重要卖点，尤其面向流批一体或近实时 ingestion 场景。

### 5.3 TimestampNTZ 支持正在从验证走向功能化
- **PR #11626 - Add basic TIMESTAMP_NTZ type support**  
- **PR #11720 - Add config to disable TimestampNTZ validation fallback**  
  链接: apache/gluten PR #11626 / #11720  
  **判断**：这组改动意味着 TimestampNTZ 很可能进入“先提供基础支持，再逐步完善语义一致性”的交付路径，属于下一阶段较有机会进入版本说明的兼容性增强项。

### 5.4 ANSI CAST 语义补齐
- **PR #11854 - [VL] Add ANSI mode support for Spark CAST(NumericType as integral)**  
  链接: apache/gluten PR #11854  
  **意义**：这不是新增函数，而是 SQL 标准/ANSI 模式语义的重要补齐。  
  **判断**：若合入，将直接提升 Gluten 在严格 SQL 模式下的可替换性，对企业用户较关键。

### 5.5 Parquet 类型拓宽支持持续完善
- **PR #11719 - [VL] Add Parquet type widening support**  
  链接: apache/gluten PR #11719  
  **意义**：这关系到 schema evolution、parquet-thrift 兼容与更广泛的数据湖读场景。  
  **判断**：结合今日复杂类型原生写入已关闭，Parquet 读写能力正在成为 Velox 路线上的重点投资方向。

---

## 6. 用户反馈摘要

基于今日活跃 issue/PR，可提炼出以下用户真实痛点：

1. **用户希望减少无感 fallback，且能看清 fallback 原因**  
   见 **PR #11853**。这说明生产用户已不满足于“用了 Gluten”，而是希望通过 UI/计划树准确审计哪些算子真正下推到了原生引擎。  
   链接: apache/gluten PR #11853

2. **Spark 4.x 迁移用户高度关注测试覆盖与行为一致性**  
   见 **Issue #11550** 及其关联 PR。用户场景很可能是升级 Spark 主版本后，需要确认 Gluten 不仅功能可用，而且异常语义、plan tag、suite 行为与 Spark 保持一致。  
   链接: apache/gluten Issue #11550

3. **对象存储与退出清理问题在真实环境中暴露**  
   见 **Issue #11796**。这类问题往往来自云环境、S3 访问或长时间服务型进程，说明 Gluten/Velox 已在更复杂的生产部署方式中被使用。  
   链接: apache/gluten Issue #11796

4. **统计函数结果正确性仍是用户敏感点**  
   见 **Issue #11849**。哪怕只是 `NaN` vs `NULL` 这样看似边界值的差异，也会直接影响数据校验、报表一致性和 SQL 兼容结论。  
   链接: apache/gluten Issue #11849

---

## 7. 待处理积压

以下是值得维护者额外关注的长期或重要积压项：

### 7.1 Velox 上游未合并 PR 跟踪长期存在
- **Issue #11585**  
  链接: apache/gluten Issue #11585  
  创建于 2026-02-07，至今仍活跃。它虽是 tracker，但实际上代表了 Gluten 对上游合并效率的长期依赖风险。若积压继续扩大，将增加 patch 搬运、rebase 和行为漂移成本。

### 7.2 Spark 4.x disabled tests 仍未完全清零
- **Issue #11550**  
  链接: apache/gluten Issue #11550  
  尽管今日有明显进展，但该 issue 说明 Spark 4.x 适配工作仍在收尾，建议持续追踪剩余 suite 的启用节奏，并优先解决阻塞 CI 稳定的问题。

### 7.3 Maven 依赖缓存优化 PR 持续未合入
- **PR #11655 - [VL][CI] cache maven deps m2 repo**  
  链接: apache/gluten PR #11655  
  创建于 2026-02-25。虽然不是功能级改动，但 CI 性能和构建效率会直接影响贡献者体验与合并速度，值得维护者尽快评审。

### 7.4 Kafka 读取支持仍在推进中
- **PR #11801 - [VL] Adding kafka read support for Velox backend**  
  链接: apache/gluten PR #11801  
  这是高价值功能，但已挂起多日未见关闭。若维护资源允许，建议尽快明确设计边界、测试要求和合入条件。

### 7.5 Spill 与 S3 生命周期问题暂无 fix
- **Issue #11018**
- **Issue #11796**  
  链接: apache/gluten Issue #11018 / #11796  
  两者都属于偏底层稳定性问题，且对生产运行风险高于一般测试问题。建议维护者提高优先级。

---

## 8. 总结判断

今天的 Apache Gluten 呈现出典型的“版本前打磨期”特征：没有新 release，但大量 PR 聚焦于 Spark 4.x 兼容性、Velox 后端能力增强、Parquet/时间类型/ANSI 语义补齐，以及 UI 和异常处理等工程化细节。  
从方向上看，**Velox 仍是绝对核心主线**，而且已从单纯性能优化扩展到 **执行能力、可观测性、数据源支持、语义一致性** 的全面推进。  
风险方面，**spill、S3 生命周期、测试禁用项** 仍是主要稳定性与可发布性隐患；积极信号则是 **ClickHouse 正确性 bug 当天即有修复 PR**，说明社区响应速度不错。  
整体来看，项目健康度良好，活跃度高，短期重点应继续放在 **Spark 4.x 收口、Velox 兼容性补齐和生产稳定性问题清理** 上。

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow 项目动态日报（2026-03-31）

## 1. 今日速览

过去 24 小时内，Apache Arrow 项目保持了较高活跃度：Issues 更新 21 条、PR 更新 17 条，但**无新版本发布**。  
从更新结构看，今天的核心主题集中在 **C++/Parquet 数据正确性修复、R 生态兼容性补丁、CI 稳定性治理，以及 Flight SQL ODBC 能力建设**。  
关闭/合并项数量不低，说明维护节奏稳定；但同时也有一批 2022 年遗留 enhancement 被 stale 流程反复触发，反映出**路线图层面的长期能力需求仍在积压**。  
整体健康度评价：**中高活跃、修复导向明显、核心引擎持续收敛，但基础设施与长期设计债仍需维护者持续清理。**

---

## 3. 项目进展

### 已合并 / 已关闭的重要 PR

#### 1) 修复 list 过滤导致数据损坏的问题
- **PR:** #49602 `[C++][Compute] Fix fixed-width gather byte offset overflow in list filtering`
- **状态:** 已关闭（对应问题应已处理）
- **关联 Issue:** #49392
- **链接:** apache/arrow PR #49602 / apache/arrow Issue #49392

这是今天最值得关注的引擎层修复之一。问题表现为：对包含 `list<double>` 列的数据执行 filter 时，结果可能从错误的 child span 读取值，导致**查询结果静默损坏**。  
PR 的修复点聚焦在 **fixed-width gather 的字节偏移溢出**，属于典型的底层向量化执行/内存布局错误，会直接影响过滤结果正确性，尤其是 Parquet → PyArrow / Pandas 路径中的列表列读取。  
这类修复对 OLAP/分析场景意义很大，因为它影响的不是性能，而是**结果可信度**。

#### 2) 补全文档：Arrow C++ 安全模型
- **PR:** #49489 `[Doc][C++] Document security model for Arrow C++`
- **状态:** 已关闭
- **关联 Issue:** #49274
- **链接:** apache/arrow PR #49489 / apache/arrow Issue #49274

该项虽然是文档更新，但对于嵌入 Arrow C++ 的数据库、执行引擎、数据服务非常重要。它明确了：
- 数据校验边界
- API 误用与非法输入的区别
- Arrow-valid 数据 vs. 程序安全使用方式

这会帮助下游引擎在接入 Arrow 作为列式内存层时，更清楚地划分**输入可信度假设与防御性校验责任**。

#### 3) 修复 Windows AMD64 R release CI 中 S3 bucket 配置失效
- **PR:** #49610 `[CI][R] AMD64 Windows R release fails with IOError: Bucket 'ursa-labs-r-test' not found`
- **状态:** 已关闭
- **关联 Issue:** #49609
- **链接:** apache/arrow PR #49610 / apache/arrow Issue #49609

该修复属于基础设施稳定性治理：原测试 bucket 不可用，导致 R 发布链路在 Windows AMD64 上失败。  
虽然不直接涉及查询引擎能力，但会影响：
- R 包发布可靠性
- 多平台回归验证覆盖率
- 下游对 Windows/R 发行质量的信心

#### 4) 文档类 PR 关闭：Python 文档导航与 PyCapsule 生态说明
- **PR:** #49550 `[Docs] PyCapsule protocol implementation status`
- **PR:** #49557 `[Docs][Python] Add nested grouping to Python docs TOC`
- **状态:** 均已关闭
- **链接:** apache/arrow PR #49550 / apache/arrow PR #49557

这两项未继续推进，意味着 Python 文档可发现性与跨生态协议采用状态的透明度，短期内仍有提升空间。

---

### 正在推进的重要 PR

#### 5) Parquet 时间戳写入溢出保护
- **PR:** #49615 `[C++][Parquet] Check for integer overflow when coercing timestamps`
- **状态:** Open，awaiting committer review
- **链接:** apache/arrow PR #49615

这是一个高价值的存储正确性修复。写 Parquet 时对 timestamp 单位换算使用乘法，如果没有溢出检查，可能**静默写出错误数据**。  
该 PR 增加溢出保护，属于典型的“写路径数据安全”增强，若合入，将明显提升 Parquet 作为分析存储格式时的可靠性。

#### 6) IPC fuzzing 加强：验证所有 batch
- **PR:** #49618 `[C++][CI] Validate all batches in IPC file fuzzer`
- **状态:** Open，awaiting review
- **关联 Issue:** #49617
- **链接:** apache/arrow PR #49618 / apache/arrow Issue #49617

该改动强化了 IPC file vs stream differential fuzzing 的验证环节，目的是避免未校验 batch 被继续处理，从而触发**无效内存访问**。  
这是典型的底层稳定性/安全性工作，虽不直接暴露给最终用户，但对 Arrow 作为嵌入式分析内核非常关键。

#### 7) Flight SQL ODBC 驱动持续建设
- **PR:** #46099 `[C++] Arrow Flight SQL ODBC layer`
- **PR:** #49585 `DRAFT: set up static build of ODBC FlightSQL driver`
- **状态:** 均 Open
- **链接:** apache/arrow PR #46099 / apache/arrow PR #49585

这条线是今天最明确的“生态扩张”信号。  
现阶段重点包括：
- Windows 下 Flight SQL ODBC DLL / driver 构建
- 静态构建方案与 CI 验证

如果这一方向继续推进，Arrow 将进一步强化作为**SQL over Flight / BI 连接层**的定位，利好接入 ODBC 工具链、BI 工具以及跨语言查询客户端。

---

## 4. 社区热点

### 热点 1：列表列过滤导致数据损坏
- **Issue:** #49392 `[C++][Python] Filtering corrupts data in column containing a list array`
- **评论:** 8，👍 3
- **状态:** 已关闭
- **链接:** apache/arrow Issue #49392

这是今天最值得关注的用户问题之一，因为它直接来自真实场景：**Parquet 读取到 Pandas DataFrame 时，带 filter 的列表列出现值损坏**。  
背后技术诉求非常明确：
- 用户希望 Arrow 的 filter / projection 路径在嵌套类型上与标量列一样可靠
- 列式执行引擎需要保证 list/struct 等复杂类型在 predicate pushdown 或 scan 后仍保持正确 child offset
- PyArrow 与 Pandas 集成路径中，任何静默损坏都比 crash 更危险

### 热点 2：Python 对象提取 Arrow 类型信息
- **Issue:** #31209 `[Python] Extracting Type information from Python Objects`
- **评论:** 33
- **状态:** 已关闭
- **链接:** apache/arrow Issue #31209

这是评论数最高的话题之一，虽然今天关闭，但它反映的需求长期存在：  
用户希望从 Python 类型注解/对象签名中更自然地推断 Arrow 类型，以支持：
- UDF 定义
- 开发者体验更好的 API
- 类型安全的数据处理函数

这类诉求本质上是希望 Arrow 在 Python 中从“底层数据库件”进一步走向“更 Pythonic 的计算接口”。

### 热点 3：Scanner API 去语义化、向 ScanNode 收敛
- **Issue:** #31786 `[C++][Python][R] Deprecate "scanner" from public API`
- **Issue:** #31787 `[C++] Scanner -> ScanNode`
- **状态:** Open
- **链接:** apache/arrow Issue #31786 / apache/arrow Issue #31787

这是一组非常重要的架构信号。Arrow 社区显然在长期推动：
- 将原有 scanner 语义从公共 API 中弱化
- 将扫描、投影、过滤等职责更多迁移到执行引擎 / ExecPlan / ScanNode 上

背后诉求是：**统一查询执行抽象，减少“原型期 API”与正式执行引擎并存造成的概念重叠。**  
对 OLAP 引擎开发者来说，这意味着未来 Arrow Dataset API 可能更强调 plan/node 级别组合，而不是 scanner 作为顶层对象。

### 热点 4：大于内存数据集的 hash join
- **Issue:** #31769 `[C++] Support hash-join on larger than memory datasets`
- **状态:** Open
- **链接:** apache/arrow Issue #31769

这是一个典型的分析引擎能力缺口。当前描述表明现有实现会把 build/probe 侧和哈希表排队到内存，导致超内存数据集直接 OOM。  
该问题体现出 Arrow 执行引擎在向更成熟 OLAP 能力演进时，用户已经在期待：
- spill-to-disk
- 分区式 join
- 流式处理更大数据集

---

## 5. Bug 与稳定性

以下按严重程度排序：

### P1：查询结果正确性 / 数据损坏

#### 1) list 列 filter 后数据损坏
- **Issue:** #49392
- **状态:** 已关闭
- **Fix PR:** #49602
- **链接:** apache/arrow Issue #49392 / apache/arrow PR #49602

影响过滤结果正确性，属于最高优先级问题之一。已出现 fix，风险暂时受控。

#### 2) Parquet 时间戳写入可能发生整数溢出并静默写坏数据
- **PR:** #49615
- **状态:** Open
- **链接:** apache/arrow PR #49615

这属于写路径的高风险正确性问题。虽然当前表现为“修复 PR 正在审阅”，但在合入前仍需谨慎看待使用极值 timestamp 的写入场景。

---

### P2：潜在崩溃 / 非法内存访问

#### 3) IPC file fuzzer 未校验所有 batch，可能导致后续无效内存访问
- **Issue:** #49617
- **Fix PR:** #49618
- **状态:** 均 Open
- **链接:** apache/arrow Issue #49617 / apache/arrow PR #49618

虽然暴露在 fuzzing 测试中，但这类问题通常意味着底层 reader 在处理恶意/损坏输入时仍有防御空间。

#### 4) C++ bridge 中潜在 nullptr 解引用
- **Issue:** #49445
- **状态:** Open
- **链接:** apache/arrow Issue #49445

这是典型的底层 API 安全问题，目前尚未看到对应 fix PR。若触发条件真实存在，可能造成崩溃。

#### 5) MinGW 下 arrow-json-test 间歇性 segfault
- **PR:** #49462
- **状态:** Open
- **链接:** apache/arrow PR #49462

属于 CI 稳定性问题，但间歇性段错误常常意味着平台相关的并发、内存或 ABI 边界问题，值得继续跟踪。

---

### P3：CI / 平台兼容性

#### 6) MATLAB workflow 因 action 权限策略失败
- **Issue:** #49611
- **状态:** Open
- **链接:** apache/arrow Issue #49611

这是 GitHub Actions 权限策略导致的工作流失效，并非核心引擎 bug，但会影响 MATLAB 绑定持续集成覆盖。

#### 7) Windows AMD64 R release 因 bucket 不存在失败
- **Issue:** #49609
- **Fix PR:** #49610
- **状态:** 已关闭
- **链接:** apache/arrow Issue #49609 / apache/arrow PR #49610

已有修复，问题已收敛。

#### 8) R 零长度 POSIXct + 空 tzone 属性导致崩溃
- **PR:** #49619
- **状态:** Open，awaiting changes
- **历史 PR:** #48854 已关闭
- **链接:** apache/arrow PR #49619 / apache/arrow PR #48854

说明该兼容性问题尚未完全稳定落地，尤其与 R 4.5.2+ 行为变化有关。

---

## 6. 功能请求与路线图信号

### 1) Flight SQL ODBC 驱动是短中期高概率落地方向
- **PR:** #46099, #49585
- **链接:** apache/arrow PR #46099 / apache/arrow PR #49585

已有持续中的实现与构建工作，说明 Arrow 正在补强 SQL 访问层与企业集成能力。  
这对分析数据库生态的意义在于：
- 更容易接入 BI/报表工具
- 更方便做跨语言标准连接
- 有助于 Flight SQL 从协议走向可部署驱动

**判断：较大概率进入后续版本的持续增量更新。**

### 2) R 端 Azure Blob Filesystem 暴露
- **PR:** #49553 `[R] Expose azure blob filesystem`
- **状态:** Open
- **链接:** apache/arrow PR #49553

Arrow C++ 和 PyArrow 已有 Azure 支持，R 端补齐后将改善多云对象存储访问一致性。  
**判断：较有机会在下一版本或近期版本中纳入，属于功能补全型需求。**

### 3) R dplyr 语义扩展
- **PR:** #49536 `[R] Implement dplyr recode_values(), replace_values(), and replace_when()`
- **状态:** Open
- **链接:** apache/arrow PR #49536

这类改动增强的是 Arrow 在 R 中作为分析后端时的函数覆盖率。  
对用户来说，意义不在底层存储，而在于**提高 dplyr 管道兼容性，减少回退到内存 data.frame 的概率**。  
**判断：如果审阅顺利，较适合作为近期版本的易感知功能增强。**

### 4) 长期路线图信号：超内存 join、ScanNode 化、seekable buffered stream
- **Issue:** #31769, #31786, #31787, #31733
- **链接:** apache/arrow Issue #31769 / #31786 / #31787 / #31733

这些问题虽然老旧，但都直指 Arrow 执行引擎成熟度：
- 大数据集 hash join
- 扫描 API 重构
- 远程对象存储上的 seek + buffering 优化

**判断：重要但短期内不一定进入最近版本，更像中长期架构演进方向。**

---

## 7. 用户反馈摘要

### 真实痛点 1：嵌套类型正确性比性能更关键
- **来源:** #49392
- **链接:** apache/arrow Issue #49392

用户是在 **Parquet → PyArrow → Pandas** 真实链路中发现 list 列过滤结果损坏。  
这说明 Arrow 在生产场景中的首要预期是：
1. 结果必须正确  
2. 其次才是扫描/过滤性能

### 真实痛点 2：对象存储/远程 IO 仍是核心使用场景
- **来源:** #31733, #31174, #31760
- **链接:** apache/arrow Issue #31733 / #31174 / #31760

多条 issue 都指向同一类诉求：
- S3 上大文件随机读取要更高效
- 分区裁剪时不要做过多目录/文件 IO
- mmap 默认开启在某些文件系统上不友好

这表明 Arrow 被广泛用于**湖仓/对象存储上的分析型读取层**，用户非常在意扫描代价与远程 IO 行为。

### 真实痛点 3：语言绑定兼容性需要跟进上游生态变化
- **来源:** #49619, #49608, #49611, #49609
- **链接:** apache/arrow PR #49619 / #49608 / apache/arrow Issue #49611 / #49609

R、MATLAB 等语言绑定的兼容性问题仍然频繁出现，反映：
- 上游语言/工具链小改动可能破坏 Arrow 集成
- 非 C++/Python 用户依赖 CI 保证可用性
- 社区对多语言支持有真实需求，而不是边缘场景

### 真实痛点 4：开发者希望更自然的类型系统与 API 抽象
- **来源:** #31209, #31786, #31787
- **链接:** apache/arrow Issue #31209 / #31786 / #31787

用户并不满足于“底层能力存在”，他们希望：
- Python 类型提示能直通 Arrow 类型
- 公共 API 更简洁一致
- scanner / execution engine 的边界更清晰

---

## 8. 待处理积压

以下为值得维护者重点关注的长期积压项：

### 1) 超内存 hash join
- **Issue:** #31769
- **状态:** Open，2022 年创建，今日仍活跃
- **链接:** apache/arrow Issue #31769

这是执行引擎走向更完整 OLAP 能力的关键缺口。缺失 spill / partitioned join 会限制 Arrow 在大规模分析任务中的适用性。

### 2) Scanner 公共 API 去除与 ScanNode 迁移
- **Issue:** #31786, #31787
- **状态:** Open
- **链接:** apache/arrow Issue #31786 / #31787

这两项属于架构整合问题，影响 API 演进一致性。长期悬而未决，容易让用户面对双重抽象。

### 3) BufferedInputStream 支持 seek()
- **Issue:** #31733
- **状态:** Open
- **链接:** apache/arrow Issue #31733

对云存储随机访问优化有直接价值，尤其适合大文件跳读、小块多次读取的分析场景。

### 4) Parquet 元数据映射到 Arrow Schema metadata 不一致
- **Issue:** #31723
- **状态:** Open，Priority: Critical
- **链接:** apache/arrow Issue #31723

这是一个被标记为 **Critical** 的老问题，涉及 Parquet `key_value_metadata` 与 Arrow schema metadata 的映射一致性。  
对依赖 schema-level 自定义元数据的系统来说，这会影响**数据交换语义完整性**。

### 5) 依赖升级大 PR 长时间悬挂
- **PR:** #48964 `Upgrade Abseil/Protobuf/GRPC/Google-Cloud-CPP bundled versions`
- **状态:** Open
- **链接:** apache/arrow PR #48964

这是典型的高风险但高必要性维护工作，且明确提示可能存在公共 API breaking changes。  
建议维护者尽快明确：
- breaking surface
- 分阶段合并策略
- 下游迁移提示

### 6) Flight SQL ODBC 主线 PR 仍在长周期推进
- **PR:** #46099
- **状态:** Open，自 2025-04-10 起
- **链接:** apache/arrow PR #46099

该项战略价值高，但周期较长。建议维护者考虑拆分可交付里程碑，降低审阅成本，提升落地速度。

---

## 附：重点链接清单

- 数据损坏问题：apache/arrow Issue #49392  
- 对应修复 PR：apache/arrow PR #49602  
- Parquet 时间戳溢出修复：apache/arrow PR #49615  
- IPC fuzzer 校验增强：apache/arrow Issue #49617 / PR #49618  
- Flight SQL ODBC：apache/arrow PR #46099 / PR #49585  
- R Azure Blob 支持：apache/arrow PR #49553  
- R dplyr 新函数：apache/arrow PR #49536  
- Scanner API 演进：apache/arrow Issue #31786 / #31787  
- 超内存 join：apache/arrow Issue #31769  
- Parquet metadata 映射：apache/arrow Issue #31723  

如果你愿意，我还可以继续把这份日报整理成更适合团队同步的两种格式之一：
1. **面向管理层的 1 页简报版**
2. **面向研发负责人/内核工程师的技术跟踪版**

</details>

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*