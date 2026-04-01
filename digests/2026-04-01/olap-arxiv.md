# OLAP 每日论文精选（arXiv） 2026-04-01

> 数据来源: [arXiv](https://arxiv.org/) | 共 8 篇候选论文 | 生成时间: 2026-04-01 01:49 UTC

---

# OLAP 每日论文精选（arXiv）

## 1. 今日 Top 论文

### **GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**

这篇论文是今天最值得 OLAP 读者关注的一篇，因为它直接挑战了过去几十年分析型数据库的基本范式：**查询执行器不再是长期人工工程化构建的系统，而是按查询即时合成**。对 OLAP 来说，这不仅关系到优化器和执行引擎的未来形态，也触及“通用引擎 vs workload-specific engine”的核心争论。论文还给出了与 DuckDB、Umbra、MonetDB、ClickHouse、PostgreSQL 的对比，并使用 TPC-H 及一个降低训练数据泄漏风险的新 benchmark 做评估，说明作者有意识地把工作放在严肃的 OLAP 语境中讨论。即便最终结论还需要更多复现与审慎验证，这篇论文也代表了 **LLM 驱动查询处理** 方向的一个重要信号。

---

## 2. 论文速览

**标题**: GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered  
**作者**: Jiale Lao, Immanuel Trummer  
**发布时间**: 2026-03-02  
**分类**: cs.DB, cs.AI, cs.CL, cs.LG, cs.MA

### 研究问题
传统查询引擎依赖长期积累的复杂工程优化，但这类系统扩展成本高、适应新硬件/新工作负载慢。论文试图回答：**能否用 LLM 按每条查询自动合成实例最优、硬件感知的执行代码，从而替代通用查询引擎的大量人工设计？**

### 核心方法
作者提出 **GenDB**，一个 LLM-powered 的多代理系统。其核心思想不是在现有引擎上再加一个智能助手，而是**针对每个输入查询，直接生成定制化执行代码**，并使其适配具体数据特征、工作负载模式与硬件资源。实验使用 OLAP 场景下的 TPC-H 及一个新构造 benchmark，对比 DuckDB、Umbra、MonetDB、ClickHouse、PostgreSQL，论文声称取得了显著性能优势。

---

## 3. 与 OLAP 的关系

这篇论文和 OLAP 的关系非常直接，主要体现在四个方面：

### 3.1 对查询引擎架构的意义
GenDB 提出的是一种“**查询即代码生成**”的范式，潜在替代传统 Volcano、向量化执行、编译执行等经典执行架构。对 OLAP 引擎研究者而言，它提出了一个激进问题：未来高性能分析型引擎是否会从“维护一个通用执行器”转向“按 workload 合成执行器”。

### 3.2 对优化器的意义
传统优化器做的是 plan search、cost estimation、rule/cascade 优化；而 GenDB 进一步把优化空间扩展到**执行代码与数据结构级别**。这意味着优化器边界可能从“选算子/选 join order”扩展为“生成何种专用实现”，这对复杂分析查询尤其重要。

### 3.3 对分析型负载与 Benchmark 的意义
论文明确使用 **TPC-H**，并额外设计新 benchmark 以降低 LLM 训练集泄漏影响，这一点对数据库社区很关键。因为在 LLM 参与系统生成时，benchmark contamination 会直接影响结论可信度；作者至少意识到了这一评估问题，值得继续关注其实验设计是否充分。

### 3.4 对 Lakehouse / 通用 OLAP 系统演进的意义
如果这种方法成立，未来 Lakehouse 或云数仓中的 query engine 可能不再只是 Presto/Spark/DuckDB/ClickHouse 这类固定执行内核，而是**在统一元数据与存储层之上，动态生成 workload-specific 的执行后端**。这将影响数据库内核与数据平台的职责划分，也可能改变“引擎产品化”的方式。

---

## 4. 值得继续关注

- **Bespoke OLAP: Synthesizing Workload-Specific One-size-fits-one Database Engines**  
  这篇与 GenDB 形成很强呼应，但更强调**为固定 workload 从零合成专用 OLAP 引擎**，而不是逐查询生成执行代码。若你关注“通用引擎是否会被 workload-specific synthesis 替代”，这篇很值得对照阅读。

- **Enhancing OLAP Resilience at LinkedIn**  
  如果你更偏工业界 OLAP 基础设施，这篇关于 **Apache Pinot 在生产环境中的韧性设计** 很有参考价值，覆盖 workload isolation、rebalancing、zone awareness、adaptive server selection，属于直接可迁移到大规模分析平台建设的经验总结。  

如果你愿意，我还可以继续把这 8 篇按 **“引擎架构 / LLM+SQL / 实时 OLAP / 隐私与可用性”** 分组，整理成一版更适合团队内部分享的 weekly briefing。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*