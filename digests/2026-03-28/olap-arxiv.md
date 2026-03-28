# OLAP 每日论文精选（arXiv） 2026-03-28

> 数据来源: [arXiv](https://arxiv.org/) | 共 8 篇候选论文 | 生成时间: 2026-03-28 01:21 UTC

---

# OLAP 每日论文精选（arXiv）

## 1. 今日 Top 论文

### **GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**

这篇论文是今天最值得 OLAP 读者关注的一篇，因为它直接挑战了过去几十年数据库系统的核心范式：**查询处理器不再是长期手工工程化产物，而是按查询即时合成**。  
对 OLAP 来说，这一设想非常激进：系统不再依赖固定的执行器、算子库和优化框架，而是为特定数据、工作负载和硬件生成实例化执行代码。  
更重要的是，作者不仅提出概念，还拿 TPC-H 和一个专门降低训练泄漏风险的新 benchmark 与 DuckDB、Umbra、MonetDB、ClickHouse、PostgreSQL 做了对比，并声称取得显著性能优势。  
无论你最终是否认同其结论，这篇文章都很可能成为 2026 年 OLAP / Query Engine 方向最具争议也最具启发性的话题之一。

---

## 2. 论文速览

- **标题**: *GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered*  
- **作者**: Jiale Lao, Immanuel Trummer  
- **发布时间**: 2026-03-02  
- **arXiv**: http://arxiv.org/abs/2603.02081v1

### 研究问题
传统查询引擎依赖大量人工设计与长期优化，但这类系统：
1. 难以快速吸收新硬件、新 workload、新执行策略；  
2. 内部结构复杂，扩展成本高；  
3. 很难做到针对具体实例进行深度定制。  

论文试图回答：**能否利用 LLM 直接为每条查询合成执行代码，从而替代通用型查询引擎的大部分固定工程结构？**

### 核心方法
作者提出 **GenDB**，一个 LLM 驱动的 agentic query processing system，其基本思路是：

- 以查询、数据特征、工作负载模式和硬件资源为输入；
- 由多智能体系统自动生成面向该查询的执行代码；
- 对生成结果进行验证、执行与性能评估；
- 面向 OLAP workload 产生“实例最优”的定制执行路径，而不是走通用引擎的固定算子与执行框架。

论文实现了一个早期原型，底层使用 Claude Code Agent，并在 OLAP 任务上评测其效果。

---

## 3. 与 OLAP 的关系

这篇工作与 OLAP 的关系非常直接，而且可能影响多个核心层面：

### 1）对查询引擎架构的冲击
现有 OLAP 引擎如 DuckDB、ClickHouse、Umbra、Doris、Pinot，本质上都建立在“**通用执行内核 + 优化器 + 算子实现**”之上。  
GenDB 提出的则是“**按查询生成执行器**”的路线，相当于把传统 engine architecture 推向更细粒度、更动态的极端 specialization。  
如果这一方向成立，未来 OLAP 引擎的核心竞争力可能从“手工优化的执行框架”转向“高质量代码合成 + 自动验证 + 反馈优化闭环”。

### 2）对优化器研究的意义
传统优化器主要做 join order、谓词下推、列裁剪、并行度、访问路径等决策。  
而在 GenDB 设定下，优化问题不再只是“从已有算子树中挑一个计划”，而可能变成：**直接合成新的数据结构、算子实现和执行流程**。  
这意味着优化器边界会从 plan search 扩展到 **program synthesis**，这是对数据库优化理论和系统实现边界的重大拓展。

### 3）对分析型负载的现实价值
OLAP 负载通常具备查询复杂、扫描大、聚合重、硬件敏感的特征，也因此最适合从 specialization 中获益。  
如果系统能够根据具体 schema、数据分布、查询模板、CPU cache/SIMD 特性生成定制代码，那么在特定 benchmark 或稳定 workload 下超越通用引擎是有现实可能性的。  
因此，这篇论文至少为“**one-size-fits-all OLAP engine 是否已到瓶颈**”提供了一个值得认真讨论的新答案。

### 4）对 Benchmark 与评测方法的提醒
论文特别提到构建了一个**降低 LLM 训练数据泄漏风险的新 benchmark**。  
这点对数据库社区很重要，因为一旦系统依赖 LLM 生成代码，benchmark contamination、prompt sensitivity、可复现性、正确性验证都会成为新的评测重点。  
未来 OLAP benchmark 可能不仅要测吞吐和延迟，还要测：
- synthesis 时间  
- correctness guarantee  
- 对数据/查询变化的稳定性  
- 生成结果的可解释性与可复现性  

---

## 4. 值得继续关注

### **Bespoke OLAP: Synthesizing Workload-Specific One-size-fits-one Database Engines**
这篇与 GenDB 形成很强呼应，但更聚焦于**面向固定 workload 合成专用 OLAP 引擎**，而不是面向单条查询即时生成。  
如果你关注“通用引擎 vs workload-specific engine”的未来演进，这篇很值得与 GenDB 对照阅读。

### **FluxSieve: Unifying Streaming and Analytical Data Planes for Scalable Cloud Observability**
这篇对实时分析和 observability 场景很有现实意义。它把部分过滤和预计算前移到 ingestion path，在 Apache Pinot 与 DuckDB 上展示明显收益，适合关注 **RTOLAP / 流批一体 / 可观测性分析平台** 的读者。

--- 

如果你愿意，我还可以继续把这 8 篇论文按 **“引擎架构 / AI SQL / 实时 OLAP / 隐私分析”** 四个主题做一版分组导读。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*