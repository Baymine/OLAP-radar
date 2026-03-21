# OLAP 每日论文精选（arXiv） 2026-03-21

> 数据来源: [arXiv](https://arxiv.org/) | 共 8 篇候选论文 | 生成时间: 2026-03-21 01:14 UTC

---

# OLAP 每日论文精选（arXiv）

## 1. 今日 Top 论文
**GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**

这篇论文最值得 OLAP 读者关注，因为它直接挑战了一个数据库领域的核心假设：查询执行引擎必须靠长期人工工程化演进。作者提出用 LLM 为每条查询“即时合成”执行代码，而不是维护一个通用型复杂引擎，这对 OLAP 引擎架构、优化器边界、执行层生成方式都有很强的颠覆性。论文不仅给出系统原型，还在 TPC-H 和一个为降低训练数据泄漏而构造的新 benchmark 上，与 DuckDB、Umbra、MonetDB、ClickHouse、PostgreSQL 做了正面比较。无论最终结论是否完全成立，这都是 2026 年 OLAP/查询处理方向非常值得跟进的一篇“范式型”工作。

---

## 2. 论文速览

### 标题
**GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**

### 作者
Jiale Lao, Immanuel Trummer

### 发布时间
2026-03-02

### 研究问题
传统 OLAP/分析型数据库依赖人工设计和持续优化的通用查询引擎，但这类系统复杂、演进慢、扩展成本高。论文关注的问题是：**能否用 LLM 按查询实例自动合成执行代码，从而替代传统通用查询引擎的大量人工工程？**

### 核心方法
作者提出 **GenDB**，一个 LLM 驱动的 agentic 查询处理系统。其核心思路不是在既有引擎里做局部优化，而是针对**具体查询、具体数据、具体工作负载和具体硬件环境**，自动生成定制化执行代码。系统采用多 agent 方式协同生成、验证和改进代码，并通过实验将其与多个主流 OLAP/query engine 进行对比，展示实例定制执行路径的性能潜力。

---

## 3. 与 OLAP 的关系

这篇工作与 OLAP 的关系非常直接，且影响面很广：

- **对查询引擎架构的意义**  
  它把“通用执行器 + 优化器”的经典范式，推向“按查询生成专用执行器”的新方向。对于 OLAP 这类长查询、复杂算子、硬件敏感的场景，实例级代码定制理论上能比通用 vectorized engine 或 interpreted engine 进一步降低抽象开销。

- **对优化器的意义**  
  传统优化器主要输出物理计划，而 GenDB 的终点是**可执行代码合成**。这意味着优化边界从 join order、operator selection，扩展到数据结构选择、代码布局、并行方式乃至硬件适配，可能把“优化器”演化成“程序综合器”。

- **对分析型负载的意义**  
  OLAP 查询通常具有高算子复杂度、聚合/连接密集、对 CPU cache/SIMD/并行化敏感，正适合做 workload-specific specialization。论文若结论稳健，说明未来分析型负载可能从“引擎跑查询”走向“查询生成引擎”。

- **对 Benchmark 与研究评估的意义**  
  作者特别构造了一个降低 LLM 训练泄漏影响的新 benchmark，这一点很关键。对 LLM-for-DB 研究来说，benchmark 是否被模型“见过”会直接影响结论可信度，因此这篇论文也在推动 OLAP/DB 社区重新思考新型系统论文的评测方法。

- **对 Lakehouse / 新系统工程的意义**  
  如果查询执行逻辑可以按需合成，未来 lakehouse 上层未必需要一个高度厚重、长期演进的单体查询内核，而可能转向更薄的元数据/事务/调度层 + 动态生成的执行层。这对下一代 lakehouse/query engine 的模块分层有潜在启发。

---

## 4. 值得继续关注

- **Bespoke OLAP: Synthesizing Workload-Specific One-size-fits-one Database Engines**  
  和 GenDB 非常接近，但更进一步强调**面向固定 workload 合成“专用数据库引擎”**，而不是仅为单条查询生成代码。若你关注 workload-specific engine、自动化系统设计、LLM 合成数据库内核，这篇很值得对照阅读。

- **Enhancing OLAP Resilience at LinkedIn**  
  如果你的关注点更偏生产系统而非前沿范式，这篇可能更“落地”。它围绕 Apache Pinot 在大规模实时 OLAP 中的隔离、rebalance、容灾和 server selection 机制展开，对建设低延迟、高可用分析平台很有参考价值。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*