# OLAP 每日论文精选（arXiv） 2026-03-19

> 数据来源: [arXiv](https://arxiv.org/) | 共 8 篇候选论文 | 生成时间: 2026-03-19 01:25 UTC

---

# OLAP 每日论文精选（arXiv）

## 1. 今日 Top 论文

### **GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**

这篇论文是今天最值得 OLAP 读者关注的一篇，因为它直接挑战了传统查询引擎的基本范式：不再维护一个通用执行引擎，而是针对每条查询即时合成执行代码。对 OLAP 领域而言，这不仅触及查询优化器、代码生成、执行器设计等核心问题，也重新定义了“数据库系统工程”与“自动化系统合成”的边界。论文还给出了与 DuckDB、Umbra、MonetDB、ClickHouse、PostgreSQL 等主流分析引擎的对比，并宣称在 OLAP workload 上取得显著优势，话题性和潜在影响都很强。即便其结果仍需谨慎验证，这也是一篇非常值得数据库研究者和查询引擎工程师尽快跟进的工作。

---

## 2. 论文速览

### 标题
**GenDB: The Next Generation of Query Processing -- Synthesized, Not Engineered**

### 作者
Jiale Lao, Immanuel Trummer

### 发布时间
2026-03-02

### 研究问题
传统 OLAP/查询处理系统依赖长期演进的通用数据库内核，虽然性能强，但系统复杂、扩展成本高，而且难以及时适应新硬件、新 workload 和新优化技术。论文提出的问题是：**能否用 LLM 驱动的自动合成方式，为每条查询生成定制化执行代码，从而替代大部分手工构建的通用查询引擎？**

### 核心方法
作者提出 **GenDB**，一个基于 LLM 的 agentic 查询处理系统。其核心思想是：针对输入查询、特定数据分布、目标 workload 与硬件环境，自动生成实例优化（instance-optimized）的执行代码，而不是依赖固定的执行器与算子框架。论文实现了一个早期原型，基于多代理流程完成代码生成、执行与评测，并使用 TPC-H 以及一个为降低 LLM 训练数据泄漏风险而新构造的 benchmark 进行评估。

---

## 3. 与 OLAP 的关系

这篇论文和 OLAP 的关系非常直接，而且触达多个基础层面：

### 对查询引擎的意义
GenDB 的核心主张是“**query engine per query**”，即每条查询生成自己的执行程序。这比传统 Volcano、向量化、JIT、代码生成型引擎更激进：它不是在既有引擎框架内做代码生成，而是试图跳过通用引擎本身。对 OLAP 引擎设计来说，这意味着未来可能从“构建一个越来越复杂的通用系统”转向“构建一个可靠的系统合成平台”。

### 对优化器的意义
传统优化器主要在已有物理算子空间中搜索计划；GenDB 则把优化空间扩展到了**执行代码与系统结构本身**。这使优化问题从“选计划”变成“合成实现”，也意味着 cost model、验证机制、鲁棒性保障将成为新的关键问题。对数据库研究者来说，这是一个很有冲击力的方向。

### 对分析型负载的意义
OLAP workload 往往具有查询复杂、扫描密集、数据布局敏感、硬件差异明显等特点，正适合“为特定查询和数据定制执行路径”的思路。若该方法能在更多 benchmark 和真实 workload 中复现，其潜在收益可能体现在更高的 scan/filter/join/aggregate 效率，以及更少的框架性开销。

### 对 Benchmark 与评测方法的意义
论文特别提到构造新 benchmark 以降低训练数据泄漏问题，这一点非常重要。当前所有“LLM 生成数据库代码并跑赢现有系统”的结论，都高度依赖 benchmark 设计是否公正、是否存在记忆效应、是否覆盖真实 workload。对于 OLAP 社区而言，这篇论文不仅提出了系统方向，也在推动**新的评测规范**。

### 对 Lakehouse / 数据基础设施的启发
虽然论文聚焦查询处理，但其思想对 lakehouse 也有潜在影响：未来 lakehouse 计算层未必只有通用 SQL engine，也可能出现面向特定租户、特定数据域、特定 pipeline 的“即时合成执行后端”。这对多租户隔离、缓存复用、编译延迟、结果可重复性都会提出新的工程问题。

---

## 4. 值得继续关注

### **Bespoke OLAP: Synthesizing Workload-Specific One-size-fits-one Database Engines**
这是与 GenDB 非常接近、且更聚焦 OLAP 的工作。它强调针对固定 workload 自动合成“one-size-fits-one”数据库引擎，而不是 per-query 合成，可能更贴近现实中的专用数仓、报表集和固定分析任务场景。

### **Enhancing OLAP Resilience at LinkedIn**
如果你更关注工业界 OLAP 基础设施，这篇非常值得看。它不讨论“更快”，而是讨论在 Apache Pinot 上如何实现 workload isolation、无扰动 rebalance、容灾感知与自适应路由，属于真正影响生产 SLA 的系统工程论文。

--- 

如果你愿意，我还可以继续把这 8 篇论文整理成一个 **“值得读 / 可跳过 / 重点跟踪”** 的分级清单。

---
*本日报由 [agents-radar](https://github.com/Baymine/OLAP-radar) 自动生成。*