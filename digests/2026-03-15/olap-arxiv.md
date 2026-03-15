# OLAP 每日论文精选（arXiv） 2026-03-15

> 数据来源: [arXiv](https://arxiv.org/) | 共 8 篇候选论文 | 生成时间: 2026-03-15 01:28 UTC

---

# OLAP 每日论文精选（arXiv）

## 1. 今日 Top 论文

### **GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**

这篇论文是今天最值得 OLAP 读者关注的一篇，因为它直接挑战了分析型数据库几十年来的一个核心假设：**查询执行引擎必须靠长期工程化迭代来获得高性能**。作者提出用 LLM 为每条查询、结合具体数据与硬件条件，**动态合成执行代码**，试图把“构建通用引擎”转向“按查询即时生成引擎”。  
对 OLAP 社区而言，这不是单点优化，而是对 **查询处理体系结构、代码生成、优化器边界** 的重新定义。虽然论文结论需要谨慎看待，但如果其结果可复现，它对 DuckDB、ClickHouse、Umbra 等现有分析引擎的设计范式都具有明显冲击力。

---

## 2. 论文速览

### 标题
**GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**

### 作者
Jiale Lao, Immanuel Trummer

### 发布时间
2026-03-02

### 研究问题
传统 OLAP / 查询引擎依赖大量专家手工设计与持续工程优化，但面对快速变化的硬件、负载和新需求，通用引擎往往扩展慢、维护成本高。论文关注的问题是：  
**能否不再围绕“固定数据库内核”做工程优化，而是让 LLM 按查询自动生成最适合当前实例的执行代码？**

### 核心方法
作者提出 **GenDB**，一个基于 LLM 的 agentic query processing 系统。其核心思想是：  
- 不预先实现一个庞大的通用执行引擎；  
- 而是在查询到来后，基于 **具体数据特征、目标 workload、硬件资源** 合成定制化执行代码；  
- 通过多代理流程完成代码生成、验证与执行；  
- 在实验中以 OLAP 场景为主，使用 TPC-H 以及一个为降低训练数据泄漏风险而构造的新 benchmark，与 DuckDB、Umbra、MonetDB、ClickHouse、PostgreSQL 对比。

---

## 3. 与 OLAP 的关系

这篇论文与 OLAP 的关系非常直接，而且影响面很大：

### 1) 对查询引擎架构的意义
GenDB 提出的是一种 **query-specific engine synthesis** 范式。  
传统 OLAP 引擎即使有 codegen/JIT，本质上仍是在固定执行框架内做局部专用化；而 GenDB 进一步主张：**整段执行逻辑都可以按 workload 临时生成**。这对向量化执行、pipeline、operator 边界、运行时抽象层是否必要，提出了更激进的挑战。

### 2) 对优化器的意义
在经典数据库里，优化器负责从既定算子与执行策略空间中选计划；而 GenDB 把问题改写成：  
**不仅选计划，还要生成计划对应的执行实现。**  
这意味着优化器边界从“plan search”扩展到“implementation synthesis”，可能把代价模型、代码生成、自动调优、物理设计进一步耦合起来。

### 3) 对分析型负载的意义
OLAP 查询通常结构复杂、扫描量大、聚合/连接重、且对硬件局部性敏感，因此最容易从专用实现中获益。  
如果论文结果成立，那么在 **固定 schema、高重复 workload、资源可预测** 的分析场景下，按实例专门化生成执行代码，可能比通用引擎更有优势。

### 4) 对 Benchmark 与评测的意义
这篇论文也提醒社区重新审视 **LLM-for-DB** 论文中的评测可信度问题，尤其是训练数据泄漏、benchmark 污染和复现性。作者专门构造新 benchmark 来降低数据泄漏风险，这一点对未来数据库 AI 系统评测很重要。

### 5) 对 Lakehouse / 现代分析系统的潜在影响
虽然论文重点不是 Lakehouse 存储层，但其思想很适合与现代数据栈结合：  
在 Lakehouse 中，底层存储相对通用，而上层 query path 可以针对表布局、文件统计信息、查询模板、机器类型做激进专用化。若走通，这可能形成“**通用存储 + 合成执行层**”的新分工模式。

---

## 4. 值得继续关注

### **Bespoke OLAP: Synthesizing Workload-Specific One-size-fits-one Database Engines**
这篇和 GenDB 形成了非常好的呼应，但更强调 **面向固定 workload 合成专属 OLAP 引擎**，而非按单条查询即时生成。对“通用引擎 vs workload-specific engine”这条研究线非常关键，适合一起阅读比较方法论与评测口径。

### **FluxSieve: Unifying Streaming and Analytical Data Planes for Scalable Cloud Observability**
这篇更偏生产型 RTOLAP / observability 场景，核心价值在于把 **摄取时预计算/过滤** 与分析面统一起来。对于 Pinot、DuckDB、实时分析平台和高并发观测类 OLAP 负载，这是一条很实用、也很有工程意义的方向。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*