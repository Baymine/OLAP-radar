# OLAP 每日论文精选（arXiv） 2026-03-20

> 数据来源: [arXiv](https://arxiv.org/) | 共 8 篇候选论文 | 生成时间: 2026-03-20 01:18 UTC

---

# OLAP 每日论文精选（arXiv）

## 1. 今日 Top 论文

### **GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**

这篇论文是今天最值得 OLAP 方向读者关注的一篇，因为它直接挑战了过去几十年数据库系统的一个核心前提：**查询执行引擎需要长期手工设计与演进**。作者提出让 LLM 按查询、数据与硬件条件**即时合成专用执行代码**，而不是依赖通用型 query engine 的固定架构，这对 OLAP 查询处理范式是非常激进且潜在颠覆性的。  
更重要的是，论文不只是概念讨论，而是给出了原型系统，并在 **TPC-H** 以及一个专门用于降低训练数据泄漏风险的新 benchmark 上，与 **DuckDB、Umbra、MonetDB、ClickHouse、PostgreSQL** 做了对比。无论最终结论是否完全成立，这篇工作都很可能成为未来几年“**LLM for DBMS internals**”方向的重要讨论起点。

---

## 2. 论文速览

### 标题
**GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**

### 作者
Jiale Lao, Immanuel Trummer

### 发布时间
2026-03-02

### 研究问题
传统 OLAP / 查询处理系统高度依赖人工工程优化：执行器、算子、代码生成、向量化、并行调度、缓存利用等都需要长期积累。但新硬件、新 workload、新优化目标不断出现，使得通用引擎越来越复杂，也越来越难快速适配。  
这篇论文关注的问题是：**是否可以用 LLM 直接为每个查询合成专用执行代码，从而替代传统“构建一个长期维护的通用引擎”的路线？**

### 核心方法
作者提出 **GenDB**，一个 LLM 驱动的 agentic query processing 系统。其核心思想是：  
- 针对每个输入查询，不走固定执行器，而是**自动合成实例优化（instance-optimized）的执行代码**；  
- 合成过程会结合**具体数据特征、负载特点与硬件资源**做定制；  
- 系统采用多 agent 结构，并以 Claude Code Agent 作为底层组件之一；  
- 最终生成的执行代码直接承担 OLAP workload 的执行任务。  

论文还构造了一个新的 benchmark，用于减少 LLM 训练数据污染对评测的影响，这一点对当前 LLM+DB 论文尤其关键。

---

## 3. 与 OLAP 的关系

这篇工作与 OLAP 的关系非常直接，而且影响面很广：

### 对查询引擎
它提出了一种不同于 DuckDB / ClickHouse / Umbra / MonetDB 这类通用分析引擎的路线：  
**从“设计一个通用执行框架”转向“按查询生成一次性专用执行器”。**  
如果这种方法能稳定成立，未来 OLAP engine 的竞争点可能不再只是算子实现、vectorization 或 JIT，而会扩展到**代码合成质量、验证机制、合成成本与可靠性控制**。

### 对优化器
传统优化器输出的是物理计划；GenDB 更进一步，试图让系统输出**可执行实现本身**。  
这意味着优化边界从 join order / access path / pipeline 切换，扩展到：  
- 数据结构如何布局  
- 算子如何融合  
- 是否生成特化循环与分支  
- 如何面向特定硬件做 code specialization  

这会模糊“optimizer”和“execution engine”之间的边界。

### 对分析型负载
OLAP 场景最适合这种思路，因为：  
- 查询通常较重，值得付出更高编译/生成成本；  
- workload 中存在大量可特化机会，例如固定 schema、已知谓词模式、聚合与 join 结构稳定；  
- 数据规模大，哪怕执行效率提升有限，也可能带来显著端到端收益。  

如果 GenDB 的结果可复现，那么它对复杂分析查询、特定 benchmark、固定报表类 workload 都很有吸引力。

### 对 Benchmark 与评测方法
论文特别提到构造了一个**降低数据泄漏风险的新 benchmark**，这对当前 LLM 驱动数据库研究很重要。  
因为在 LLM 参与查询生成、代码生成、甚至优化时，传统 benchmark（如 TPC-H）容易引发一个问题：模型可能已经“见过题”。  
因此，这篇论文不仅讨论性能，也触及了一个新研究议题：**LLM-native DBMS 应该如何被公平评测。**

### 对系统研究的意义
这篇工作代表了数据库系统研究中的一个新趋势：  
**不再只是把 LLM 当 NL2SQL 或 UDF 接口工具，而是把它放进 DBMS 内核生成路径里。**  
这比“让 LLM 写 SQL”更贴近 OLAP 核心问题，也更值得数据库研究者严肃对待。

---

## 4. 值得继续关注

### **Bespoke OLAP: Synthesizing Workload-Specific One-size-fits-one Database Engines**
这篇和 GenDB 形成很强呼应，但更进一步强调**面向固定 workload 直接合成一套专用数据库引擎**，而不是只针对单条查询做代码生成。若你关心“LLM 是否会改变 OLAP engine 的工程方式”，这篇值得和 GenDB 对照阅读。

### **Enhancing OLAP Resilience at LinkedIn**
如果你更偏工业落地，而不是前沿生成式系统，这篇可能更有现实价值。它聚焦 **Apache Pinot** 在生产环境中的韧性设计，包括 workload isolation、无影响 rebalance、故障域感知与自适应 server selection，对实时 OLAP 平台非常实用。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*