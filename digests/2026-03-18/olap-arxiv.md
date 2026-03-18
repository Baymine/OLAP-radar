# OLAP 每日论文精选（arXiv） 2026-03-18

> 数据来源: [arXiv](https://arxiv.org/) | 共 8 篇候选论文 | 生成时间: 2026-03-18 02:04 UTC

---

# OLAP 每日论文精选（arXiv）

## 1. 今日 Top 论文

### **Bespoke OLAP: Synthesizing Workload-Specific One-size-fits-one Database Engines**
我会把这篇作为今天最值得 OLAP 读者关注的论文。原因有三点：第一，它直接挑战了“通用 OLAP 引擎”的默认范式，提出为固定 workload 自动合成专用数据库引擎；第二，这个方向比“在现有系统上做局部优化”更激进，潜在上限也更高；第三，论文强调的是**从存储到执行的整机级自动合成**，而不是只生成算子代码或 SQL rewrite，这对未来查询引擎架构有很强的启发性。若实验结果可靠，这类“one-size-fits-one engine”可能会成为 OLAP/benchmark 驱动系统设计的重要新路线。

---

## 2. 论文速览

### 标题
**Bespoke OLAP: Synthesizing Workload-Specific One-size-fits-one Database Engines**

### 作者
Johannes Wehrstein, Timo Eckmann, Matthias Jasny, Carsten Binnig

### 发布时间
2026-03-02

### 研究问题
现代 OLAP 引擎为了支持任意分析负载，通常引入了大量通用性开销，例如 schema 解释、抽象层、间接访问和通用执行框架。这些设计提升了适用范围，但也限制了在固定 workload 上的极致性能。论文试图回答的问题是：**能否借助 LLM 驱动的自动合成，为特定 workload 生成一个“专用型”数据库引擎，从而显著超过通用系统？**

### 核心方法
论文提出一个**全自动 synthesis pipeline**，面向给定 workload 从零生成高性能 OLAP 引擎。其关键不在于一次性让 LLM 生成完整系统，而是通过**迭代式性能评估、自动验证与结构化 refinement**，逐步联合优化存储布局、数据结构与查询执行逻辑。作者声称该方法能在分钟到小时级时间内生成 workload-specific engine，并在性能上相对 DuckDB 等通用系统达到数量级提升。

---

## 3. 与 OLAP 的关系

这篇论文与 OLAP 的关系非常直接，而且影响面很广：

- **对查询引擎设计的意义**  
  它提出的不是“改进通用引擎”，而是“按 workload 生成引擎”。这意味着未来 OLAP 系统可能从 handcrafted engine 走向 synthesized engine，查询处理器的边界会被重新定义。

- **对存储与执行一体化优化的意义**  
  传统 workload tuning 往往停留在索引、物化视图、分区、参数调优层面；这篇工作试图进一步下沉到**存储布局、执行算法、代码结构**的联合定制。对列存、向量化执行、预编译执行路径等方向都具有启发意义。

- **对优化器研究的意义**  
  这里的“优化器”不再只是选择 join order 或 physical operator，而可能升级为**系统生成器**：根据 workload 直接搜索并合成最优物理实现。对 cost model、自动调参、learned optimization 都是很强的延展。

- **对 benchmark-driven engineering 的意义**  
  如果系统可以围绕固定查询集自动生成，那么 TPC-H、ClickBench 甚至企业内部报表 workload，不仅是“评测基准”，还可以变成“生成输入”。这会让 benchmark 从比较工具转向系统构建工具。

- **对分析型负载的实际价值**  
  在大量企业场景中，OLAP workload 并非完全 ad hoc，而是有稳定 query template、固定 schema 和周期性报表。对这类负载，专用引擎可能比通用数据库更具性价比，尤其适合嵌入式分析、数据产品化部署和高重复查询场景。

---

## 4. 值得继续关注

- **GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**  
  与 Bespoke OLAP 类似，也是在推动“由 LLM 合成查询处理系统”这一方向，但更强调**针对单条查询生成实例优化执行代码**。如果 Bespoke OLAP 偏向 workload-level engine synthesis，那么 GenDB 更像 query-level execution synthesis，值得对比阅读。

- **Enhancing OLAP Resilience at LinkedIn**  
  这篇更偏工业界实战，但对生产 OLAP 非常重要。它聚焦 Apache Pinot 在高并发、故障和 rebalancing 场景下的 SLA 韧性保障，涵盖 workload isolation、impact-free rebalancing、adaptive routing 等机制，对建设实时分析平台很有参考价值。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*