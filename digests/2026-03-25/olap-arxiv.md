# OLAP 每日论文精选（arXiv） 2026-03-25

> 数据来源: [arXiv](https://arxiv.org/) | 共 8 篇候选论文 | 生成时间: 2026-03-25 01:21 UTC

---

# OLAP 每日论文精选（arXiv）

## 1. 今日 Top 论文

### **GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**

这篇论文是今天最值得 OLAP 读者关注的一篇，因为它直接挑战了分析型数据库的一个基础假设：高性能查询处理必须依赖长期演进、人工精细工程化的通用执行引擎。作者提出用 LLM 驱动的 agent 系统，为**每条查询即时合成执行代码**，并根据数据、工作负载和硬件环境做实例级优化。若论文结果可靠，这不仅是“又一个优化器技巧”，而是对 **query engine 的构建范式** 本身提出替代路径。对 OLAP 社区而言，它的价值不只在性能数字，更在于打开了“按 workload / instance 合成执行器”的新研究方向。

---

## 2. 论文速览

### 标题
**GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**

### 作者
Jiale Lao, Immanuel Trummer

### 发布时间
2026-03-02

### 研究问题
传统 OLAP / SQL 查询引擎依赖多年手工工程优化，扩展困难、演进缓慢、开发成本高。随着硬件、数据特征和用户需求快速变化，现有通用引擎很难持续对每类场景都保持最优。论文要回答的问题是：**是否可以不用维护复杂通用引擎，而是让 LLM 为每个输入查询自动生成高度定制的执行代码？**

### 核心方法
作者提出 **GenDB**，一个 LLM-powered 的 agentic query processing 系统。其核心思想是：不再完全依赖固定的执行器与物理算子库，而是针对具体查询、具体数据实例、具体硬件资源，**合成 instance-optimized execution code**。论文实现了一个早期原型，底层使用 Claude Code Agent 作为多智能体系统组件，并在 OLAP workload 上评估，使用 TPC-H 以及一个为减少训练数据泄漏而设计的新 benchmark，与 DuckDB、Umbra、MonetDB、ClickHouse、PostgreSQL 等系统比较。

---

## 3. 与 OLAP 的关系

这篇论文和 OLAP 的关系非常直接，主要体现在以下几个层面：

- **查询引擎架构层面**：  
  它不是在传统 Volcano、vectorized、codegen 这些既有框架上做局部改进，而是在追问：**通用 query engine 是否能被 query-specific synthesis 替代？** 这对分析型数据库内核是非常根本的挑战。

- **优化器层面**：  
  传统优化器输出的是执行计划，GenDB 试图进一步输出**可执行实现**。这意味着优化目标从“选算子/选顺序”扩展到“生成算子实现、数据布局、执行策略”，让优化边界从 plan space 走向 code space。

- **分析型负载层面**：  
  OLAP 查询通常结构复杂、扫描/聚合密集，而且 benchmark 比较成熟，非常适合验证“按查询特化”的收益。若该路线成立，在固定 schema、高重复分析模式、硬件特征稳定的场景中，可能显著优于通用引擎。

- **Benchmark 与方法论层面**：  
  作者特别提到构造了新 benchmark 以减少 LLM 训练数据泄漏问题，这一点很关键。对于所有“LLM for DB”工作，**评测可信度** 都是核心问题，尤其是在 TPC-H 这类高度公开 workload 上。

- **工程现实意义**：  
  即便短期内它未必取代 DuckDB / ClickHouse / Umbra 这类成熟系统，它也提示了一个非常现实的方向：未来 OLAP 引擎可能演化为**通用底座 + 自动合成特化执行模块**，而不是纯手工维护的 monolithic engine。

---

## 4. 值得继续关注

### **Bespoke OLAP: Synthesizing Workload-Specific One-size-fits-one Database Engines**
这篇和 GenDB 形成很强呼应，但更进一步：它强调的不是“为单条查询生成代码”，而是**为给定 workload 自动合成整套专用 OLAP 引擎**。如果你关注 workload specialization、自动化系统构建、以及“通用引擎 vs 定制引擎”的边界，这篇非常值得对照阅读。

### **Enhancing OLAP Resilience at LinkedIn**
相比合成式引擎的前沿探索，这篇更偏工业落地，聚焦 Apache Pinot 在生产环境中的**弹性与 SLA 稳定性**，包括 workload isolation、impact-free rebalancing、zone-aware replica placement、adaptive server selection。对做实时 OLAP 平台、服务化查询集群和多租户治理的工程团队来说，实用价值很高。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*