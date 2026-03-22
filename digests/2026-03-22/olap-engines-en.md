# Apache Doris Ecosystem Digest 2026-03-22

> Issues: 16 | PRs: 78 | Projects covered: 10 | Generated: 2026-03-22 01:22 UTC

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

## Apache Doris Deep Dive

# Apache Doris Project Digest — 2026-03-22

## 1. Today's Overview

Apache Doris showed **high code activity** over the last 24 hours, with **78 pull requests updated** and **16 issues updated**, but much of the issue movement was administrative closure of stale items rather than fresh triage. The PR stream indicates ongoing work across **query execution, lakehouse/multi-catalog access, cloud storage integration, SQL function expansion, and stability fixes**. There were **no new releases** today, so the main signal is engineering throughput rather than packaged delivery. Overall project health looks **active on development**, but the issue side suggests some **backlog pressure**, with many older feature and bug reports being closed as stale instead of clearly resolved.

## 2. Project Progress

Today’s merged/closed PR activity advanced Doris in several important areas:

### Query engine, SQL semantics, and function support
- **NDV aggregate support for DECIMALV2** was added and backported, improving aggregate function compatibility for decimal workloads:  
  - [PR #61546](https://github.com/apache/doris/pull/61546)  
  - [PR #61577](https://github.com/apache/doris/pull/61577)
- **ORC reader stability** improved via a fix for a heap-use-after-free in `rewriteLeaves`, which is a meaningful runtime correctness/stability improvement for external file queries:  
  - [PR #61138](https://github.com/apache/doris/pull/61138)  
  - [PR #61589](https://github.com/apache/doris/pull/61589)  
  - [PR #61590](https://github.com/apache/doris/pull/61590)

### Platform/build reliability
- A small but practical developer-experience fix landed for **macOS compilation**:  
  - [PR #61591](https://github.com/apache/doris/pull/61591)

### In-flight work with strong near-term impact
Although not merged yet, several active PRs show where engineering effort is concentrated:
- **Schema change safety under replica lag / partial publish states**: [PR #61143](https://github.com/apache/doris/pull/61143)
- **MaxCompute connector memory leak fix and large-write optimization**: [PR #61245](https://github.com/apache/doris/pull/61245)
- **Deterministic inverted-index reader selection** for multi-index columns: [PR #61596](https://github.com/apache/doris/pull/61596)
- **MATCH crash fix on alias slots** with virtual-column pushdown: [PR #61584](https://github.com/apache/doris/pull/61584)
- **Variant/nested predicate normalization**: [PR #61548](https://github.com/apache/doris/pull/61548)
- **Data lake reader refactor** in multi-catalog path: [PR #61485](https://github.com/apache/doris/pull/61485)

Taken together, these suggest active hardening of both **core OLAP execution paths** and **external/lakehouse query integration**.

## 3. Community Hot Topics

### 1) 2025 roadmap discussion
- [Issue #47948 — Doris Roadmap 2025](https://github.com/apache/doris/issues/47948)  
  8 comments, 27 👍

This is the most visible community thread in the current issue set. The roadmap emphasis on **lakehouse**, **semi-structured data**, and broader federated analytics aligns closely with current PR activity around variant processing, Iceberg/Hive/Paimon metadata, and connector work. The technical need behind this discussion is clear: Doris users increasingly want it to serve not only as a native OLAP engine, but also as a **high-performance unified query layer across open table formats and cloud object storage**.

### 2) Broken internal statistics table
- [Issue #53633 — `__internal_schema`.`column_statistics` is broken](https://github.com/apache/doris/issues/53633)

This is the only issue still open in the listed set. The underlying need is stronger **statistics correctness and internal metadata robustness**, especially in non-trivial network/backend deployments. Because `column_statistics` can affect optimizer decisions and observability, a broken system table may degrade both planning quality and operator trust.

### 3) Lakehouse/catalog extensibility themes
A cluster of now-stale feature issues shows repeated demand in the same direction:
- [Issue #55999 — Optimize Hive, Iceberg, Paimon metadata access performance](https://github.com/apache/doris/issues/55999)
- [Issue #56002 — Support Iceberg small file compaction and Snapshot management](https://github.com/apache/doris/issues/56002)
- [Issue #56004 — Support Snowflake Iceberg table engine](https://github.com/apache/doris/issues/56004)
- [Issue #56010 — Support Hive 4 transaction table](https://github.com/apache/doris/issues/56010)
- [Issue #56011 — Support Doris Catalog for federated queries across multiple Doris clusters](https://github.com/apache/doris/issues/56011)
- [Issue #56016 — File system pluginization](https://github.com/apache/doris/issues/56016)
- [Issue #56017 — JDBC Catalog pluginization](https://github.com/apache/doris/issues/56017)

Even though these were stale-closed, together they show durable community demand for **catalog performance, pluginized connectors, and federated execution**.

## 4. Bugs & Stability

Ranked by likely severity and user impact:

### High severity
1. **ORC heap-use-after-free / coredump**
   - Bug fix PR: [PR #61138](https://github.com/apache/doris/pull/61138)
   - Backports: [PR #61589](https://github.com/apache/doris/pull/61589), [PR #61590](https://github.com/apache/doris/pull/61590)

This is the most concrete severe defect in today’s data because it involves a **runtime crash** in file-format handling. The fact that it was merged and backported indicates maintainers consider it important and likely user-facing.

2. **Schema change under partial replica catch-up**
   - Open fix PR: [PR #61143](https://github.com/apache/doris/pull/61143)

This addresses a subtle but serious correctness/stability risk: if schema change or rollup proceeds before lagging base replicas are caught up, data consistency and task execution safety may be compromised.

### Medium severity
3. **MATCH crash on alias slots**
   - Open fix PR: [PR #61584](https://github.com/apache/doris/pull/61584)

A query crash in text/nested search paths affects correctness and confidence in advanced search features, especially when expressions involve aliases and joins.

4. **Inverted index nondeterministic reader selection**
   - Open fix PR: [PR #61596](https://github.com/apache/doris/pull/61596)

This is a correctness/consistency issue. Nondeterministic index selection can lead to unstable query behavior across runs, especially problematic for production search analytics.

5. **Load path concurrency issue**
   - Open fix PR: [PR #61593](https://github.com/apache/doris/pull/61593)

Changing `_try_close` to atomic suggests a real race condition in load/streaming close behavior. These bugs tend to manifest as intermittent failures and are difficult for users to diagnose.

6. **MaxCompute connector memory leak**
   - Open fix PR: [PR #61245](https://github.com/apache/doris/pull/61245)

Memory leaks and inefficient large-data writes directly affect connector reliability for federated or hybrid data pipelines.

### Open/previously reported bugs updated today
7. **Broken internal column statistics**
   - Open issue: [Issue #53633](https://github.com/apache/doris/issues/53633)

8. **Stream load failure after drop column with materialized view**
   - Closed stale: [Issue #55272](https://github.com/apache/doris/issues/55272)

9. **Storage policy not saved on alter add partition**
   - Closed stale issue: [Issue #55967](https://github.com/apache/doris/issues/55967)  
   - Related fix existed earlier: [PR #55931](https://github.com/apache/doris/pull/55931)

10. **`COALESCE(ARRAY(1,2), ARRAY())` error**
   - Closed stale: [Issue #55904](https://github.com/apache/doris/issues/55904)

11. **Delete job hangs when a BE is permanently dead**
   - Closed stale: [Issue #55971](https://github.com/apache/doris/issues/55971)

The stale closures reduce visible backlog count, but they also make it harder to tell which bugs were truly fixed versus simply aged out.

## 5. Feature Requests & Roadmap Signals

Several active or recently updated PRs/issues point to what may arrive in upcoming Doris versions.

### Likely near-term features
- **JSON table functions**: `json_each`, `json_each_text`  
  [PR #60910](https://github.com/apache/doris/pull/60910)  
  This is a strong SQL-compatibility signal, especially for PostgreSQL-style semi-structured workflows.

- **`array_combinations` function**  
  [PR #60192](https://github.com/apache/doris/pull/60192)  
  Useful for analytical SQL and combinatorial processing.

- **Expanded PostgreSQL type support in streaming jobs**  
  [PR #61551](https://github.com/apache/doris/pull/61551)  
  Adds `macaddr8/xml/hstore` and array element type handling, indicating investment in heterogeneous ingestion and CDC/ETL compatibility.

- **Alibaba Cloud OSS native storage vault with STS AssumeRole**  
  [PR #61329](https://github.com/apache/doris/pull/61329)  
  This is a strong cloud adoption signal, especially for users operating Doris on Alibaba Cloud.

### Broader roadmap signals
- **Lakehouse reader and metadata optimization**  
  [PR #61485](https://github.com/apache/doris/pull/61485)  
  plus stale feature issues around Iceberg/Hive/Paimon  
  This remains one of the clearest roadmap themes.

- **Connector/plugin architecture**
  - [Issue #56016](https://github.com/apache/doris/issues/56016)
  - [Issue #56017](https://github.com/apache/doris/issues/56017)
  - [Issue #56015](https://github.com/apache/doris/issues/56015)
  These suggest Doris is moving toward more standardized and extensible external data access.

### Prediction for next version
The most likely candidates for inclusion in an upcoming release branch appear to be:
1. **Connector and cloud integration improvements**  
2. **Semi-structured/JSON and variant query enhancements**  
3. **Search/inverted-index correctness fixes**  
4. **Lakehouse reader and metadata-path optimizations**

## 6. User Feedback Summary

Today’s user and contributor signals point to several recurring pain points:

- **External catalog and lakehouse performance matters a lot.** Users want faster metadata access and more complete support for Hive, Iceberg, Paimon, and cloud-native storage systems.
- **Semi-structured data support is a strategic expectation.** Requests and PRs around variant, nested predicates, JSON functions, and PostgreSQL-compatible types show demand for richer document-style analytics inside SQL.
- **Operational correctness remains critical.** Reports about hanging delete jobs, schema-change safety, storage policy persistence, and stream load failures indicate users are sensitive to edge-case reliability in production clusters.
- **Cloud deployment ergonomics are increasingly important.** OSS/STS integration and cloud-mode test fixes suggest Doris is being used in more managed or hybrid cloud setups where IAM and object storage integration are first-class requirements.
- **SQL compatibility gaps are still visible.** Function support (`NDV` on `DECIMALV2`, JSON table functions, array behavior) continues to be an area where users expect Doris to behave more like mainstream analytical SQL engines.

## 7. Backlog Watch

These items look like they need maintainer attention due to age, openness, or strategic importance:

### Open issues/PRs needing attention
- [Issue #53633 — `__internal_schema`.`column_statistics` is broken](https://github.com/apache/doris/issues/53633)  
  Still open and potentially impacts optimizer/statistics reliability.

- [PR #56303 — prepare statement placeholder literal support](https://github.com/apache/doris/pull/56303)  
  Long-open SQL-preparation improvement with practical correctness implications.

- [PR #56307 — exchange param checking](https://github.com/apache/doris/pull/56307)  
  Infrastructure validation PRs can be easy to overlook, but they often prevent subtle distributed execution bugs.

- [PR #56322 — UI remove unused dependencies](https://github.com/apache/doris/pull/56322)  
  Low-risk cleanup, but stale open frontend maintenance work suggests review bandwidth imbalance.

- [PR #60192 — support `array_combinations`](https://github.com/apache/doris/pull/60192)  
  Feature PR open for two months; likely waiting on review or polish.

- [PR #60910 — `json_each`, `json_each_text`](https://github.com/apache/doris/pull/60910)  
  Important SQL compatibility feature and likely user-visible.

### Strategic items closed as stale but still important
These deserve monitoring because they align with roadmap direction even if current issue state is closed:
- [Issue #55999 — Hive/Iceberg/Paimon metadata access optimization](https://github.com/apache/doris/issues/55999)
- [Issue #56002 — Iceberg compaction and snapshot management](https://github.com/apache/doris/issues/56002)
- [Issue #56004 — Snowflake Iceberg engine support](https://github.com/apache/doris/issues/56004)
- [Issue #56010 — Hive 4 transaction table support](https://github.com/apache/doris/issues/56010)
- [Issue #56011 — federated Doris Catalog across clusters](https://github.com/apache/doris/issues/56011)

## Overall Health Assessment

Apache Doris remains **engineering-active and strategically focused**, especially around **lakehouse interoperability, cloud integration, semi-structured analytics, and query/runtime correctness**. The strongest positive signal today is the continued flow of substantive fixes and branch backports for crash and correctness issues. The main caution is that issue maintenance appears somewhat **stale-driven**, which may obscure unresolved user pain points. Net assessment: **strong development momentum, moderate backlog management risk, and clear alignment with modern OLAP/lakehouse demand**.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-22

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, with strong engineering investment across query execution, lakehouse interoperability, cloud integration, and correctness hardening. A clear pattern across projects is the convergence of traditional OLAP engines and open table/storage ecosystems: engines increasingly need to query Iceberg, Hive, ORC, Parquet, object storage, and external catalogs with production-grade semantics. Another strong trend is that feature growth is now tightly coupled with stability work—many projects are balancing new SQL/type-system capabilities with regression containment, memory safety, and CI hardening. Overall, the landscape is healthy, but increasingly competitive on operational correctness, federated access, and semi-structured data support rather than raw scan speed alone.

---

## 2. Activity Comparison

### Daily project activity snapshot

| Project | Issues Updated | PRs Updated | Release Status | Health Score* | Notes |
|---|---:|---:|---|---:|---|
| **Apache Doris** | 16 | 78 | No release | **8.4/10** | High development throughput; some backlog pressure due to stale closures |
| **ClickHouse** | 24 | 188 | No release | **8.8/10** | Highest visible code velocity; strong core/CI momentum, some regression risk |
| **DuckDB** | 9 | 15 | No release | **8.1/10** | Solid maintenance pace; responsive to correctness regressions |
| **StarRocks** | 1 | 7 | No release | **7.6/10** | Focused but quieter day; correctness and connector work continue |
| **Apache Iceberg** | 8 | 19 | No release | **8.0/10** | Active and strategic, with Spark/API backlog accumulation |
| **Delta Lake** | 1 | 19 | No final release; 4.2.0-RC0 testing | **8.3/10** | Healthy release-cycle execution; enterprise integration focus |
| **Databend** | 0 | 9 | **Patch release shipped** | **8.0/10** | Stable patch-train behavior; issue visibility limited |
| **Velox** | 0 | 43 | No release | **8.2/10** | Strong integration velocity, especially around Iceberg and engine hardening |
| **Apache Gluten** | 3 | 6 | No release | **7.7/10** | Focused on correctness/testing integrity rather than broad feature growth |
| **Apache Arrow** | 19 | 3 | No release | **7.8/10** | Stable but maintenance-heavy; more backlog grooming than feature acceleration |

\*Health score is an analytical estimate based on activity, visible progress, release hygiene, and backlog/stability signals from today’s digest.

### Approximate activity tiers
- **Very high activity:** ClickHouse, Doris
- **High activity:** Velox, Iceberg, Delta Lake
- **Moderate activity:** DuckDB, Databend, Arrow
- **Focused/lower-volume activity:** StarRocks, Gluten

---

## 3. Apache Doris's Position

### Where Doris looks strong versus peers
Apache Doris is in a strong position among open-source OLAP engines because it combines **high core-engine activity** with visible investment in **lakehouse access, cloud-native storage integration, semi-structured data support, and search/index correctness**. Compared with StarRocks, Doris currently shows broader raw community throughput. Compared with ClickHouse, Doris has lower total velocity but appears more explicitly concentrated on **multi-catalog / external data access and unified analytics** rather than only pushing the native engine frontier. Versus DuckDB, Doris is much more clearly oriented toward **distributed serving and federated enterprise deployments** rather than embedded/local analytics.

### Technical approach differences
Doris’s current trajectory suggests a strategy centered on:
- **Native MPP OLAP engine**
- **Unified SQL access across internal tables and external/lakehouse catalogs**
- **Cloud object storage integration**
- **Growing semi-structured and inverted-index/search support**

This differs from:
- **ClickHouse**, which remains heavily optimized around its own storage engine and native execution pipeline, though lakehouse support is growing
- **DuckDB**, which is optimized for embedded/local analytical execution
- **Iceberg / Delta**, which are storage-table-format ecosystems rather than full OLAP serving engines
- **Velox / Arrow**, which are foundational execution/data layers rather than end-user warehouse products

### Community size comparison
By visible daily GitHub movement, Doris sits in the **upper tier of active OLAP engines**, behind ClickHouse in sheer PR volume but ahead of most peers except perhaps Iceberg/Delta when counting broader ecosystem relevance. Community size and maintainer bandwidth appear solid, though issue hygiene is less convincing than code throughput because many issue updates were stale closures rather than active resolution. In practical terms, Doris looks like a **large, engineering-forward project with meaningful momentum**, but not yet the highest-scale community in the field.

---

## 4. Shared Technical Focus Areas

Several technical requirements are clearly emerging across multiple engines:

### A. Lakehouse and open table format interoperability
**Engines:** Doris, ClickHouse, StarRocks, Iceberg, Delta Lake, Velox, Arrow  
**Specific needs:**
- Better **Iceberg compatibility** and metadata handling
- Faster **Hive/Iceberg/Paimon catalog access**
- Correct **partition evolution / refresh semantics**
- Better **ORC/Parquet predicate pushdown and statistics use**
- More reliable **external MV / federated query behavior**

This is the clearest ecosystem-wide signal: engines are being forced to operate across open storage/table ecosystems, not just their own native storage.

### B. Correctness and regression containment
**Engines:** Doris, ClickHouse, DuckDB, Iceberg, Gluten, Velox, Delta Lake  
**Specific needs:**
- Crash fixes (heap-use-after-free, segfaults, double-free patterns)
- Schema evolution correctness
- Query correctness for edge SQL cases
- Streaming/CDC offset correctness
- Better test fidelity and CI stability

Across the ecosystem, users are rewarding engines that avoid wrong results and upgrade regressions more than those shipping headline features quickly.

### C. Semi-structured / variant / JSON support
**Engines:** Doris, ClickHouse, DuckDB, Delta Lake, Arrow  
**Specific needs:**
- JSON table/scalar functions
- Variant or flexible type correctness
- Nested predicate handling
- Deterministic JSON serialization / manipulation
- Better schema/type compatibility across connectors

This shows the market expects analytical engines to process document-style and heterogeneous data natively.

### D. Cloud-native auth, object storage, and managed deployment support
**Engines:** Doris, Delta Lake, Arrow, Velox, StarRocks  
**Specific needs:**
- Object storage integration (OSS/S3/GCS)
- STS / AssumeRole / OAuth / credential refresh
- Managed-catalog integration
- Build/runtime compatibility in cloud-oriented environments

The control plane and IAM layer are now central product requirements, not deployment details.

### E. SQL compatibility and planner semantics
**Engines:** Doris, ClickHouse, DuckDB, Databend, Gluten  
**Specific needs:**
- Better function completeness
- Correct alias handling
- DDL determinism
- aggregate semantics correctness
- parser handling of complex SQL forms

This remains important for migrations from mainstream warehouses and BI-generated SQL.

---

## 5. Differentiation Analysis

### Storage format orientation
- **Doris / ClickHouse / StarRocks / Databend:** Full analytical databases with native storage plus increasing external/lakehouse reach
- **DuckDB:** Embedded analytical database with strong local file-format ergonomics
- **Iceberg / Delta Lake:** Table/storage layer standards and runtime ecosystems rather than direct OLAP serving engines
- **Arrow / Velox:** Foundational data/compute substrate used by other engines
- **Gluten:** Acceleration layer for Spark using Velox/native backends

### Query engine design
- **Doris / StarRocks / ClickHouse:** Distributed MPP analytical engines
- **DuckDB:** In-process vectorized execution engine
- **Velox:** Reusable vectorized execution framework for multiple systems
- **Gluten:** Spark-native acceleration via native execution backend
- **Arrow:** Compute + memory model + dataset infrastructure, not a warehouse planner in the same sense
- **Iceberg / Delta:** Rely on external engines (Spark, Trino, Flink, etc.) for execution

### Target workloads
- **Doris:** Interactive OLAP, federated analytics, lakehouse query acceleration
- **ClickHouse:** High-performance analytics, observability, event/log analytics, native warehouse workloads
- **DuckDB:** Local analytics, notebooks, embedded ETL, data science
- **StarRocks:** MPP analytics with growing external-catalog and MV focus
- **Iceberg / Delta:** Lakehouse table management, interoperability, batch/streaming data platforms
- **Databend:** Cloud data warehouse/lakehouse workloads with ongoing architecture maturation
- **Velox / Arrow / Gluten:** Infrastructure for query engines and processing stacks

### SQL compatibility posture
- **Most aggressive breadth push:** Doris, ClickHouse, DuckDB
- **Compatibility in service of external ecosystems:** StarRocks, Databend
- **Spec/runtime semantics more than end-user SQL dialect:** Iceberg, Delta, Arrow, Velox
- **Spark semantic fidelity:** Gluten, Delta Lake

---

## 6. Community Momentum & Maturity

### Rapidly iterating
- **ClickHouse:** Highest visible throughput; aggressively evolving engine, CI, and SQL surface
- **Apache Doris:** Strong day-to-day implementation momentum, especially across engine + lakehouse paths
- **Velox:** High integration velocity, especially as a systems substrate
- **Delta Lake:** Actively moving through release-candidate and architectural integration work

### Iterating with visible stabilization pressure
- **DuckDB:** Fast bug response, but more focused on correctness and polish than broad expansion today
- **Apache Iceberg:** Strong strategic motion, but some meaningful open backlog around Spark and schema edge cases
- **Databend:** Shipping patches and core refactors; appears disciplined, though public issue signal is thin

### More selective / stabilizing
- **StarRocks:** Steady but lower visible volume; targeted investment in Iceberg, MVs, and connectors
- **Apache Arrow:** Mature and stable, with more backlog grooming and incremental infrastructure evolution
- **Apache Gluten:** Focused on correctness, test integrity, and upstream dependency management

### Maturity read
- **Most mature ecosystem-scale platforms:** ClickHouse, Arrow, Iceberg, Delta
- **Mature and still expanding aggressively:** Doris, DuckDB
- **Maturing challengers/infrastructure layers:** StarRocks, Databend, Velox, Gluten

---

## 7. Trend Signals

### 1) The OLAP engine is becoming a lakehouse query fabric
Data engineers increasingly expect one engine to query:
- native warehouse tables
- Iceberg/Delta/Hive/Paimon catalogs
- object storage
- external search or JDBC systems

This trend benefits architectures that want fewer specialized query tiers.

### 2) Reliability now differentiates more than raw feature count
Across Doris, ClickHouse, DuckDB, Iceberg, and Gluten, the most meaningful user pain points are:
- crashes
- silent wrong results
- upgrade regressions
- schema evolution failures
- flaky production semantics

For architects, this means evaluation should weight **operational correctness and upgrade safety** at least as heavily as benchmark speed.

### 3) Semi-structured data is now a baseline expectation
JSON, Variant, nested predicates, array behavior, and PostgreSQL-like type compatibility are recurring needs. Engines that cannot natively support mixed-structure analytics will increasingly lose ground in real-world workloads.

### 4) Cloud IAM and managed catalog integration are first-class product requirements
OAuth refresh, AssumeRole, STS, GCS/S3/OSS behavior, and managed catalog interoperability are no longer edge features. They are central for modern platform adoption in enterprises.

### 5) Ecosystem layering is becoming more important
The stack is stratifying:
- **table formats**: Iceberg, Delta
- **execution substrates**: Velox, Arrow
- **accelerators**: Gluten
- **full OLAP databases**: Doris, ClickHouse, StarRocks, Databend, DuckDB

For architects, this creates more composability—but also more design decisions about where correctness, governance, and performance responsibilities should live.

### 6) Practical value for decision-makers
For data engineers and architects, the main takeaway is:
- choose **Doris / ClickHouse / StarRocks / Databend** when you need a serving engine
- choose **DuckDB** for embedded and local analytical workflows
- choose **Iceberg / Delta** when table interoperability and storage semantics are central
- watch **Velox / Arrow / Gluten** if you are building or extending analytical platforms rather than only consuming them

---

## Bottom Line on Apache Doris

Apache Doris remains one of the strongest engine-level projects in this comparison for teams that want a **distributed OLAP engine with serious lakehouse ambitions**. Its current momentum is especially favorable in **external catalog access, cloud integration, semi-structured support, and runtime correctness hardening**. The main competitive gap versus the top ecosystem leaders is not direction, but **community scale and backlog discipline**—especially compared with ClickHouse’s volume and Iceberg/Delta’s ecosystem centrality. For organizations seeking a unified analytical engine rather than only a table format or embedded database, Doris is positioned as a **credible upper-tier choice with strong forward momentum**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-22

## 1. Today's Overview

ClickHouse remains highly active: **24 issues** and **188 PRs** were updated in the last 24 hours, with **69 PRs merged/closed** and **no new releases**. The overall signal is one of a fast-moving core engine project balancing **feature expansion**, **stability work**, and **CI/process evolution**. The strongest themes today are **26.2 regression/stability follow-up**, **Variant/type-system correctness**, **Iceberg compatibility**, and **CI reliability**. Project health looks solid from a throughput perspective, but there are notable user-facing concerns around **insert performance regressions** and **new-format compatibility bugs** that deserve close attention.

## 2. Project Progress

With 69 PRs merged/closed in the last day, the repository appears to be advancing on several fronts even without a release cut.

### Query engine and SQL behavior
Recent open and active PRs indicate ongoing work in SQL semantics and planner/analyzer correctness:

- **Execute ALTER commands in declaration order** — improves DDL determinism and expected behavior for sequential schema changes: [#100288](https://github.com/ClickHouse/ClickHouse/pull/100288)
- **Fix WITH function-expression alias in CREATE VIEW with IN clause** — a SQL correctness fix around alias substitution and identifier qualification: [#100042](https://github.com/ClickHouse/ClickHouse/pull/100042)
- **Fix quadratic number of queries with distributed index analysis** — addresses distributed-query planning inefficiency: [#100287](https://github.com/ClickHouse/ClickHouse/pull/100287)
- **Optimize Analyzer with repeat aliases** — performance-oriented analyzer improvement, likely useful for complex generated SQL: [#88043](https://github.com/ClickHouse/ClickHouse/pull/88043)

### Execution engine and memory efficiency
There are strong signs of execution-pipeline tuning:

- **Limit simultaneously active streams in UNION ALL to reduce peak memory** — an important runtime optimization for wide/branch-heavy analytical workloads: [#100176](https://github.com/ClickHouse/ClickHouse/pull/100176)
- **Fix heap-use-after-free in MergeTreeReadTask::createReaders** — critical low-level storage/read-path stability work, marked must-backport: [#99483](https://github.com/ClickHouse/ClickHouse/pull/99483)

### Extensibility and product surface area
ClickHouse is also expanding user-facing capabilities:

- **CREATE/DROP/ALTER HANDLER queries** — SQL-native management of custom HTTP handlers instead of XML-only configuration: [#100203](https://github.com/ClickHouse/ClickHouse/pull/100203)
- **Experimental AI SQL functions** — direct SQL access to LLM and embedding providers, signaling product experimentation beyond traditional OLAP: [#99579](https://github.com/ClickHouse/ClickHouse/pull/99579)

### Build/CI platform direction
Infrastructure work is increasingly strategic:

- **RFC: migrate from GitHub Actions to a native CI execution engine** — major process/platform signal: [#100291](https://github.com/ClickHouse/ClickHouse/issues/100291)
- **Randomize more optimize_* settings in clickhouse-test** — deeper test coverage for optimizer-sensitive behavior: [#97547](https://github.com/ClickHouse/ClickHouse/pull/97547)
- **Filter ASan false positives in stderr-fatal checks** — reducing CI noise to improve signal quality: [#100301](https://github.com/ClickHouse/ClickHouse/pull/100301)

## 3. Community Hot Topics

These are the most notable discussions by activity, comments, or strategic importance.

### 1) Intern tasks 2025/2026
- Issue: [#87836](https://github.com/ClickHouse/ClickHouse/issues/87836)
- 71 comments

This is the most commented active issue in the snapshot. While not a product bug, it is a strong signal of ClickHouse’s contributor pipeline and the breadth of subprojects available. It suggests the project continues to scale through community onboarding and maintains a healthy stream of smaller, mentorable tasks.

### 2) INSERT queries are 3x slower after upgrading from 25.12 to 26.2
- Issue: [#99241](https://github.com/ClickHouse/ClickHouse/issues/99241)
- 21 comments

This is the most important user-facing operational concern in today’s issue list. A **3x insert slowdown** on `ReplacingMergeTree` after upgrading to 26.2 indicates possible write-path, deduplication, part handling, or background processing regressions. The technical need underneath is clear: users want **predictable upgrade safety** and stronger performance regression detection before stable release adoption.

### 3) CI crash: Double deletion of MergeTreeDataPartCompact in multi_index
- Issue: [#99799](https://github.com/ClickHouse/ClickHouse/issues/99799)
- 12 comments

This is one of the more serious CI-discovered crashes because it points to a potential memory lifecycle bug in storage internals. Combined with the active critical PR fixing a read-path use-after-free, it suggests maintainers are currently spending real effort on hardening low-level MergeTree memory safety.

### 4) RFC: Native CI execution engine
- Issue: [#100291](https://github.com/ClickHouse/ClickHouse/issues/100291)

Low comment count so far, but strategically important. This could materially change developer velocity, test reproducibility, and infrastructure cost/control. It also reflects ClickHouse’s growing confidence in its internal CI framework, Praktika.

### 5) Experimental AI functions from SQL
- PR: [#99579](https://github.com/ClickHouse/ClickHouse/pull/99579)

This is a roadmap signal more than a hot discussion metric in the provided data. It reflects user demand for **in-database AI orchestration**, especially classification, extraction, SQL generation, translation, and embedding generation from analytical workflows.

## 4. Bugs & Stability

Below are the most important bug and stability items, roughly ranked by severity.

### Critical / High

#### A. 26.2 insert regression: 3x slower INSERTs
- Issue: [#99241](https://github.com/ClickHouse/ClickHouse/issues/99241)

A direct performance regression affecting production upgrades. This is high severity because it impacts ingestion throughput and upgrade confidence. No explicit fix PR is linked in the provided data.

#### B. Heap use-after-free in MergeTree reader creation
- PR: [#99483](https://github.com/ClickHouse/ClickHouse/pull/99483)

This is one of the most serious active fixes in flight. It is labeled **must-backport** and **critical-bugfix**, and the summary notes multiple occurrences of the same root cause. This likely addresses real crash risk in the read path.

#### C. CI crash: Double deletion of MergeTreeDataPartCompact
- Issue: [#99799](https://github.com/ClickHouse/ClickHouse/issues/99799)

Potential double-free class bug in MergeTree internals. Even if currently observed in CI, this category is serious because similar patterns can surface in production under concurrency or edge execution paths.

#### D. CI crash: Failed preparation of data source in pipeline execution
- Issue: [#100296](https://github.com/ClickHouse/ClickHouse/issues/100296)

A fresh crash from master/release branch testing. This raises concern around execution-pipeline robustness.

### Medium

#### E. IcebergS3 fails to parse valid Iceberg v2 metadata
- Issue: [#100304](https://github.com/ClickHouse/ClickHouse/issues/100304)

This is significant for lakehouse interoperability. If reproduced broadly, it weakens ClickHouse’s Iceberg v2 story for S3-backed deployments. No fix PR is visible in the provided snapshot.

#### F. Variant semantics: WHERE silently returns 0 rows when all alternatives are incompatible
- Issue: [#100251](https://github.com/ClickHouse/ClickHouse/issues/100251)

A query-correctness problem is often more dangerous than a crash because it can lead to silent wrong results. This one should be treated seriously.

#### G. arrayFirst/arrayLast wrong type for some Variant types
- Issue: [#100253](https://github.com/ClickHouse/ClickHouse/issues/100253)

Another correctness issue in the newer Variant/type-system area, specifically with combinations like `Variant(Date, Bool)`.

#### H. Duplicate alias does not work with distributed table
- Issue: [#85895](https://github.com/ClickHouse/ClickHouse/issues/85895)

Analyzer/distributed-table mismatch causing `NUMBER_OF_COLUMNS_DOESNT_MATCH`. Important for federated/distributed SQL compatibility.

#### I. MaterializedPostgreSQL column mismatch when column is added
- Issue: [#83776](https://github.com/ClickHouse/ClickHouse/issues/83776)

Connector/schema-evolution friction remains a practical issue for CDC/replication users.

### Lower severity but notable

- **Randomized-settings test diagnosis idea**: [#100178](https://github.com/ClickHouse/ClickHouse/issues/100178) — not a product bug, but important for improving reproducibility of flaky failures.
- **ColumnVariant creation during decompression failed**: [#100211](https://github.com/ClickHouse/ClickHouse/issues/100211) — another Variant-related crash signature worth watching.

## 5. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### SQL management for HTTP handlers
- PR: [#100203](https://github.com/ClickHouse/ClickHouse/pull/100203)

This looks likely to land in a near-term version because it is concrete, user-facing, and aligned with operational convenience. It reduces dependence on static XML config and makes ClickHouse more dynamically manageable.

#### Experimental AI functions
- PR: [#99579](https://github.com/ClickHouse/ClickHouse/pull/99579)

These are explicitly experimental, so likely not yet a mainstream stable headline, but they strongly suggest the next versions may continue adding **AI-adjacent SQL primitives**. This is particularly relevant for users building retrieval, classification, or enrichment workflows in the warehouse.

#### More debug metadata in `system.error_log`
- Issue: [#74561](https://github.com/ClickHouse/ClickHouse/issues/74561)

A practical observability feature request. This is the kind of “easy task” that could realistically appear in an upcoming minor release because it has clear debugging value and bounded scope.

#### `avg` for `Date` and `DateTime`
- Issue closed: [#89030](https://github.com/ClickHouse/ClickHouse/issues/89030)

Since this feature request was closed, it likely indicates completion or supersession. Either way, it reflects continued work on SQL ergonomics and type completeness.

#### MATERIALIZED / NOT MATERIALIZED CTE support
- Issue closed: [#53449](https://github.com/ClickHouse/ClickHouse/issues/53449)

This is a high-interest SQL compatibility topic with strong user demand. Closure suggests progress or resolution, and it aligns with broader efforts to improve SQL dialect completeness.

### What may show up next version
Most plausible candidates for near-term visible release notes based on current activity:

1. **Fixes for Variant correctness and function behavior**
2. **Memory/stability backports in MergeTree read paths**
3. **Distributed planner/analyzer performance fixes**
4. **Operational SQL features like handler DDL**
5. **Incremental Iceberg interoperability fixes**

## 6. User Feedback Summary

Today’s user feedback highlights a few recurring operational pain points:

### Upgrade safety matters more than raw feature velocity
The 26.2 insert regression report is the clearest signal: users expect ClickHouse upgrades to preserve write performance, especially on `ReplacingMergeTree` workloads. Even one major regression can slow adoption of otherwise feature-rich releases.

### Lakehouse interoperability remains a strategic expectation
Multiple Iceberg-related items remain in circulation:
- [#100304](https://github.com/ClickHouse/ClickHouse/issues/100304)
- [#91583](https://github.com/ClickHouse/ClickHouse/pull/91583)
- [#96811](https://github.com/ClickHouse/ClickHouse/issues/96811)
- [#87890](https://github.com/ClickHouse/ClickHouse/issues/87890)

Users clearly want ClickHouse to behave as a reliable engine across modern table formats, especially under schema evolution and metadata versioning.

### Type-system expansion is exposing edge cases
Variant-related issues and function/adaptor problems suggest that newer flexible typing features are useful but still maturing:
- [#100251](https://github.com/ClickHouse/ClickHouse/issues/100251)
- [#100253](https://github.com/ClickHouse/ClickHouse/issues/100253)
- [#100211](https://github.com/ClickHouse/ClickHouse/issues/100211)

### Distributed SQL correctness and connector schema evolution remain practical concerns
Issues like:
- distributed alias mismatch: [#85895](https://github.com/ClickHouse/ClickHouse/issues/85895)
- MaterializedPostgreSQL schema changes: [#83776](https://github.com/ClickHouse/ClickHouse/issues/83776)

show that production users care deeply about edge-case correctness in distributed execution and data integration layers, not just benchmark performance.

## 7. Backlog Watch

These items look important and may need additional maintainer attention due to age, relevance, or strategic weight.

### Long-running / strategically important open items

#### Optimize Analyzer with repeat aliases
- PR: [#88043](https://github.com/ClickHouse/ClickHouse/pull/88043)
- Created: 2025-10-02

Long-lived performance work in the analyzer. Given the ongoing analyzer-related bug reports, this likely deserves continued review priority.

#### Allow attach-detach Iceberg local tables
- PR: [#91583](https://github.com/ClickHouse/ClickHouse/pull/91583)
- Created: 2025-12-05

Still relevant given active Iceberg issues. Keeping this pending too long may slow operational maturity for lakehouse users.

#### Add more information to `system.error_log`
- Issue: [#74561](https://github.com/ClickHouse/ClickHouse/issues/74561)
- Created: 2025-01-14

Low-complexity, high-utility observability work. This feels like good leverage for maintainers.

#### Duplicate alias with distributed table
- Issue: [#85895](https://github.com/ClickHouse/ClickHouse/issues/85895)
- Created: 2025-08-19

A relatively old analyzer/distributed correctness issue. Worth attention because these problems disproportionately affect advanced SQL workloads and migration compatibility.

#### MaterializedPostgreSQL schema-change mismatch
- Issue: [#83776](https://github.com/ClickHouse/ClickHouse/issues/83776)
- Created: 2025-07-15

This affects real integration scenarios and schema evolution, an area where users have little tolerance for inconsistency.

## Overall Health Assessment

ClickHouse shows **strong engineering throughput** and active investment in both the core engine and developer infrastructure. The project is healthy in terms of momentum, but the current snapshot suggests maintainers should keep prioritizing **regression containment**, **memory safety**, and **correctness in newer type-system/lakehouse features**. If the insert slowdown in 26.2 and the Iceberg/Variant issues are addressed promptly, the project remains in a strong position heading into the next release cycle.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-22

## 1) Today’s Overview

DuckDB showed moderate-to-high maintenance activity over the last 24 hours: 9 issues were updated and 15 PRs saw movement, with 4 issues closed and 3 PRs merged/closed. The day was dominated by CLI/JSON correctness fixes, parser and planner refactors, and lower-level engine/storage work around vectors and Parquet encoding. Project health looks solid from a throughput perspective: recently reported regressions are being closed quickly, while deeper architectural work continues in parallel. The main risk signals today are a newly reported CLI/database segfault, an ASOF join correctness bug, and a lingering TRY_CAST behavior mismatch versus documentation.

## 3) Project Progress

### Merged/closed PRs today

#### 1. JSON `COPY TO` pipeline fix
- PR: [#21522](https://github.com/duckdb/duckdb/pull/21522) — **Make JSON copy to file no longer bind twice**
- Related issue: [#21466](https://github.com/duckdb/duckdb/issues/21466)

This was the most concrete user-facing fix completed in the period. DuckDB removed a double-binding behavior in JSON `COPY TO`, which was causing failures for cases like reading JSON from `/dev/stdin` and writing to `/dev/stdout`. Besides fixing correctness for streaming-style workflows, this also reduces unnecessary planning/binding overhead and improves robustness for non-repeatable inputs.

#### 2. Path suffix handling cleanup
- PR: [#21527](https://github.com/duckdb/duckdb/pull/21527) — **Unify adding suffixes to path in `Path::AddSuffixToPath`**
  
This closed PR addressed path handling around WAL/temp-directory suffix construction, especially when database paths include query parameters. While narrow, this is important for filesystem abstraction correctness and affects storage/runtime behavior in environments using URI-like database paths.

#### 3. Internal vector header refactor
- PR: [#21526](https://github.com/duckdb/duckdb/pull/21526) — **Move vector types / vector buffer types to different headers**

This was an internal codebase cleanup rather than a feature. It signals ongoing maintainability work in DuckDB’s vectorized execution layer, likely intended to simplify compilation boundaries and prepare for more substantial vector-structure changes such as the open StructVector layout work.

### Broader progress signals from open PRs

- **Execution engine internals:** [#21534](https://github.com/duckdb/duckdb/pull/21534) aims to align `StructVector` layout with `DataChunk`, which would reduce impedance for generic vector-processing code.
- **Storage/file format correctness:** [#21532](https://github.com/duckdb/duckdb/pull/21532) fixes Parquet dictionary bit-width computation, a subtle but important standards/compression correctness improvement.
- **Catalog and SQL engine architecture:** [#21446](https://github.com/duckdb/duckdb/pull/21446) adds real window-function catalog entries; [#21524](https://github.com/duckdb/duckdb/pull/21524) refactors `UPDATE` handling around a dedicated query node.
- **Optimization:** [#21056](https://github.com/duckdb/duckdb/pull/21056) continues work on limited-distinct optimization for `SELECT DISTINCT ... LIMIT n`.

## 4) Community Hot Topics

### 1. TRY_CAST inconsistency versus docs
- Issue: [#13097](https://github.com/duckdb/duckdb/issues/13097) — **TRY_CAST(1::BIT AS SMALLINT) throws error**
- Activity: 7 comments, 1 reaction

This remains the most discussed issue in the current set. The technical need is clear: users expect `TRY_CAST` to be a hard guarantee against conversion exceptions, especially in data-cleaning pipelines. Any exception path here undermines SQL ergonomics and trust in defensive casting semantics.

### 2. Empty-result JSON output from CLI
- Issues: [#21512](https://github.com/duckdb/duckdb/issues/21512), [#21530](https://github.com/duckdb/duckdb/issues/21530)
  
These duplicate/related reports were closed quickly, indicating responsive triage around CLI output correctness. The need underneath is machine-consumable CLI behavior for scripting, automation, and integration into shell pipelines. Returning `[{]` instead of `[]` breaks downstream tooling immediately.

### 3. ASOF LEFT JOIN correctness on empty right-hand input
- Issue: [#21514](https://github.com/duckdb/duckdb/issues/21514)

This is a meaningful analytical SQL correctness topic. ASOF joins are heavily used in time-series and event alignment workloads; incorrect behavior when the right side is empty breaks left-preserving semantics and may silently distort result sets in production ETL or feature-engineering jobs.

### 4. New JSON function proposals
- PR: [#21531](https://github.com/duckdb/duckdb/pull/21531) — **Add `json_serialize_sorted()` and `json_deep_merge()`**

This is a good signal of demand for richer semi-structured data handling directly in DuckDB SQL. The underlying need is deterministic JSON canonicalization and composable document manipulation for analytics, testing, caching, and API-oriented data prep.

### 5. Windows and platform support
- PR: [#20983](https://github.com/duckdb/duckdb/pull/20983) — **Support long paths on Windows**
- PR: [#19962](https://github.com/duckdb/duckdb/pull/19962) — **Add LoongArch64 support with 16KB page size**

These reflect continued community pressure for broader deployment compatibility. DuckDB’s user base is clearly extending beyond default Linux/macOS developer setups into Windows-heavy and niche-architecture environments.

## 5) Bugs & Stability

Ranked by likely severity and user impact.

### Critical / High

#### 1. Segmentation fault on `.open` / `.tables`
- Issue: [#21536](https://github.com/duckdb/duckdb/issues/21536) — **`.open musicbrainz-cmudb2026.db` results in a segmentation fault**

A segfault is the most serious newly reported issue in this batch because it indicates a native crash rather than a handled error. It appears tied to opening a specific database file and then enumerating tables, which may point to corruption handling, catalog loading, or CLI/database compatibility issues. No fix PR is listed yet.

#### 2. ASOF LEFT JOIN returns empty result with empty right table
- Issue: [#21514](https://github.com/duckdb/duckdb/issues/21514)

This is a query correctness bug in a nontrivial SQL feature. Severity is high because it can silently return wrong results instead of raising an error, and ASOF joins are often used in financial/time-series settings where result integrity matters. No linked fix PR yet.

### Medium

#### 3. TRY_CAST can still throw
- Issue: [#13097](https://github.com/duckdb/duckdb/issues/13097)

This is both a docs mismatch and a runtime semantics problem. It is especially problematic for users relying on `TRY_CAST` to sanitize heterogeneous data without aborting queries.

#### 4. CLI argument ordering regression with `-init` and `-cmd`
- Issue: [#21535](https://github.com/duckdb/duckdb/issues/21535)

This looks like a behavior/docs regression in the CLI. It affects startup scripting, configuration injection, and reproducible automation flows. Severity is moderate because it impacts tooling rather than core SQL execution, but it can break established workflows.

#### 5. Invalid JSON emitted for empty result sets in CLI
- Issues: [#21512](https://github.com/duckdb/duckdb/issues/21512), [#21530](https://github.com/duckdb/duckdb/issues/21530)

These were closed quickly, which is a positive stability sign. The issue was severe for CLI automation but appears to have been triaged/resolved promptly.

#### 6. Prepared statement unary-minus overflow inconsistency
- Issue: [#21077](https://github.com/duckdb/duckdb/issues/21077)

Closed during the period. This was a SQL execution consistency bug between ordinary and prepared statements for minimum `BIGINT` negation. Closure here suggests ongoing cleanup of edge-case numeric semantics.

#### 7. JSON `COPY TO` from STDIN to STDOUT failure
- Issue: [#21466](https://github.com/duckdb/duckdb/issues/21466)
- Fix PR: [#21522](https://github.com/duckdb/duckdb/pull/21522)

Also resolved quickly, and importantly with a targeted code-path simplification.

## 6) Feature Requests & Roadmap Signals

### User-requested features

#### 1. Add `OPTIONS` to HTTP request enum
- Issue: [#21533](https://github.com/duckdb/duckdb/issues/21533)

This is a small but telling feature request. It suggests users are pushing DuckDB’s HTTP capabilities toward more general API interoperability and capability discovery. This feels plausible for a near-term release because the scope appears limited.

#### 2. New JSON scalar functions
- PR: [#21531](https://github.com/duckdb/duckdb/pull/21531)

`json_serialize_sorted()` and `json_deep_merge()` align with a broader roadmap trend: making DuckDB stronger for semi-structured analytics without forcing external preprocessing. If reviewed favorably, these are realistic candidates for the next minor release because they are additive and user-facing.

#### 3. CLI environment-variable path support in `ATTACH`
- PR: [#21529](https://github.com/duckdb/duckdb/pull/21529)

This points to a roadmap emphasis on better scripting ergonomics and deployment friendliness. It is a practical feature with low conceptual risk, though parser changes can prolong review.

### Engine/platform roadmap signals

- **Window function cataloging:** [#21446](https://github.com/duckdb/duckdb/pull/21446) suggests continued catalog-system maturation.
- **Function multi-versioning for vector ops:** [#20439](https://github.com/duckdb/duckdb/pull/20439) indicates ongoing interest in architecture-aware performance tuning.
- **Windows long-path support:** [#20983](https://github.com/duckdb/duckdb/pull/20983) is a strong quality-of-life signal for enterprise and Windows users.
- **LoongArch64 support:** [#19962](https://github.com/duckdb/duckdb/pull/19962) shows platform portability remains on the radar.

### Likely next-version candidates
Most plausible:
- fix for empty-result CLI JSON output (already closed via issue handling)
- JSON `COPY TO` robustness improvements from [#21522](https://github.com/duckdb/duckdb/pull/21522)
- Parquet dictionary bit-width fix from [#21532](https://github.com/duckdb/duckdb/pull/21532), if merged soon
- possibly CLI/env-path ergonomics from [#21529](https://github.com/duckdb/duckdb/pull/21529)

## 7) User Feedback Summary

Current user feedback clusters around three practical pain points:

1. **CLI reliability for automation**
   - Invalid JSON on empty outputs: [#21512](https://github.com/duckdb/duckdb/issues/21512), [#21530](https://github.com/duckdb/duckdb/issues/21530)
   - `-init` / `-cmd` ordering surprise: [#21535](https://github.com/duckdb/duckdb/issues/21535)
   - env var usage in `ATTACH`: [#21529](https://github.com/duckdb/duckdb/pull/21529)

   Users are clearly treating DuckDB CLI as a scripting interface, not just an interactive shell. Deterministic output and argument semantics matter a lot.

2. **Analytical SQL correctness**
   - ASOF left join behavior: [#21514](https://github.com/duckdb/duckdb/issues/21514)
   - `TRY_CAST` semantics: [#13097](https://github.com/duckdb/duckdb/issues/13097)
   - prepared statement numeric edge case: [#21077](https://github.com/duckdb/duckdb/issues/21077)

   This indicates users are stress-testing SQL semantics in production-style edge conditions, especially around time-series joins and defensive type conversion.

3. **Semi-structured and streaming JSON workflows**
   - JSON `COPY TO` stdin/stdout fix: [#21466](https://github.com/duckdb/duckdb/issues/21466), [#21522](https://github.com/duckdb/duckdb/pull/21522)
   - proposed JSON scalar extensions: [#21531](https://github.com/duckdb/duckdb/pull/21531)

   DuckDB continues to be used as a lightweight transformation engine in pipelines, where JSON support and stream-friendly I/O are increasingly important.

There is no strong explicit positive feedback in this dataset, but the fast closure of multiple CLI/JSON bugs suggests maintainers are responsive to concrete user breakages.

## 8) Backlog Watch

### Important items needing maintainer attention

#### 1. TRY_CAST should not throw
- Issue: [#13097](https://github.com/duckdb/duckdb/issues/13097)

Created in 2024 and still open in 2026, this stands out as a long-lived semantic inconsistency. Because it touches both docs and execution guarantees, it deserves attention.

#### 2. Windows long path support
- PR: [#20983](https://github.com/duckdb/duckdb/pull/20983)

Marked stale but updated today. This is likely valuable for Windows users working with deep directory trees, generated paths, or enterprise environments. It appears review bandwidth, not relevance, is the blocker.

#### 3. Function multi-versioning for vector ops
- PR: [#20439](https://github.com/duckdb/duckdb/pull/20439)

A significant performance-oriented proposal that has been open since January. It is ready for review and strategically important, but likely needs careful benchmarking and compiler/portability evaluation.

#### 4. LoongArch64 with 16KB page size
- PR: [#19962](https://github.com/duckdb/duckdb/pull/19962)

This has lingered since 2025 and is marked with CI failure. It may be niche, but unresolved architecture support patches can accumulate maintenance debt if left too long.

#### 5. Limited Distinct optimization
- PR: [#21056](https://github.com/duckdb/duckdb/pull/21056)

This is a meaningful optimizer enhancement with direct analytical-query payoff. Since it has changes requested, it likely needs reviewer engagement to avoid stalling.

---

## Overall Health Assessment

DuckDB remains healthy and active, with good closure velocity on newly reported regressions and a steady stream of engine, parser, and storage improvements. The strongest near-term concern is not project responsiveness but correctness/stability in edge cases: segfaults, special-case join semantics, and semantic guarantees like `TRY_CAST`. The roadmap signals are positive, especially around JSON workflows, execution internals, and platform compatibility, suggesting the project is still balancing user-facing polish with deeper architectural evolution.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-22

## 1. Today's Overview

StarRocks showed **moderate engineering activity** over the last 24 hours, with **7 pull requests updated** and **1 active issue**, but **no new releases**. The workstream is concentrated on **query execution improvements**, **materialized view correctness for external catalogs**, and **connector/SQL surface expansion**, especially around Iceberg and OpenSearch. Two PRs were closed, both indicating ongoing branch maintenance and backport/test stabilization rather than major feature landings. Overall, project health looks **steady and development-focused**, with attention split between **new capabilities** and **correctness hardening for analytical workloads**.

## 2. Project Progress

### Merged/Closed PRs today

#### 1) Window-function optimization backport closed
- **PR:** [#70613](https://github.com/StarRocks/starrocks/pull/70613) — *Optimize window functions with skewed partition keys by splitting into UNION (backport #67944)*
- **Status:** Closed
- **What it advances:** This points to continued work on the **query engine’s handling of skewed window-function workloads**, a common pain point in OLAP systems where highly imbalanced partition keys can cause stragglers and poor parallel efficiency.
- **Technical significance:** Even as a backport-related closure, it signals that StarRocks is actively refining execution strategies for **window-heavy analytical SQL**, likely improving runtime stability and tail latency on skewed datasets.

#### 2) Test stability fix for branch/cherry-pick maintenance
- **PR:** [#70612](https://github.com/StarRocks/starrocks/pull/70612) — *Fix UnionDictionaryManagerTest after cherry-pick on 3.5-cc*
- **Status:** Closed
- **What it advances:** This is a **branch maintenance and test repair** change, ensuring that cherry-picked fixes do not destabilize CI or release branches.
- **Technical significance:** While not user-visible, this kind of work is important for **release engineering quality**, especially for multi-branch support in a fast-moving analytical database.

### Open PRs indicating current development direction

#### 3) Adaptive lazy materialization work
- **PR:** [#70618](https://github.com/StarRocks/starrocks/pull/70618) — *global lazy materialize adaptive strategy*
- **Status:** Open
- **Roadmap signal:** Suggests ongoing effort to improve **scan/project execution efficiency**, likely by reducing unnecessary column materialization during query processing.

#### 4) External MV refresh correctness for Iceberg-like connectors
- **PR:** [#70589](https://github.com/StarRocks/starrocks/pull/70589) — *[MV] Fix precise external MV refresh fallback for Iceberg-like connectors*
- **Status:** Open
- **Roadmap signal:** Materialized view refresh semantics over external catalogs remain a key integration area, especially for **incremental/partition-aware lakehouse scenarios**.

#### 5) Iceberg partition evolution SQL support
- **PR:** [#70508](https://github.com/StarRocks/starrocks/pull/70508) — *Support Iceberg ALTER TABLE REPLACE PARTITION COLUMN*
- **Status:** Open
- **Roadmap signal:** StarRocks is pushing further into **Iceberg SQL compatibility and table evolution support**, which is strategically important for lakehouse adoption.

#### 6) OpenSearch connector development
- **PR:** [#70542](https://github.com/StarRocks/starrocks/pull/70542) — *Add OpenSearch connector (Phase 1 - HTTP)*
- **Status:** Open
- **Roadmap signal:** Connector breadth is expanding beyond traditional data lake/storage formats into **search/analytics ecosystem interoperability**.

#### 7) Explicit skew hint for window functions
- **PR:** [#70614](https://github.com/StarRocks/starrocks/pull/70614) — *Support explicit skew hint for window function (backport #68739)*
- **Status:** Open
- **Roadmap signal:** This complements automatic skew optimization with **manual control for power users**, useful in enterprise tuning scenarios.

## 3. Community Hot Topics

Given the limited issue volume today, the hottest topics are primarily active PRs shaping the near-term roadmap:

### A. External MV refresh behavior on Iceberg-like catalogs
- **PR:** [#70589](https://github.com/StarRocks/starrocks/pull/70589)
- **Why it matters:** The PR addresses a subtle correctness/performance boundary: StarRocks had applied `enable_materialized_view_external_table_precise_refresh` broadly, but some connectors do not support truly partition-granular metadata refresh.
- **Underlying technical need:** Users want **reliable external materialized views** without silent assumptions about connector metadata capabilities. This is a classic lakehouse integration problem: balancing **precision refresh** with **connector-specific limitations**.

### B. Iceberg partition evolution support
- **PR:** [#70508](https://github.com/StarRocks/starrocks/pull/70508)
- **Why it matters:** Supporting `ALTER TABLE ... REPLACE PARTITION COLUMN ... WITH ...` makes StarRocks more aligned with real-world Iceberg lifecycle operations.
- **Underlying technical need:** Users increasingly expect StarRocks to function as a **first-class SQL engine over evolving lakehouse tables**, not just a read layer.

### C. OpenSearch connector
- **PR:** [#70542](https://github.com/StarRocks/starrocks/pull/70542)
- **Why it matters:** This expands StarRocks’ federated query reach into OpenSearch 2.9.x.
- **Underlying technical need:** Enterprises want to **join search-oriented operational datasets with analytical warehouse data** using SQL, reducing ETL duplication.

### D. Window-function skew handling
- **PRs:** [#70613](https://github.com/StarRocks/starrocks/pull/70613), [#70614](https://github.com/StarRocks/starrocks/pull/70614)
- **Why it matters:** Skew remains one of the biggest execution problems in distributed analytical systems.
- **Underlying technical need:** Users need both **automatic mitigation** and **explicit hints** when workloads exhibit non-uniform partition distributions.

### E. Partition expression error messaging
- **Issue:** [#68567](https://github.com/StarRocks/starrocks/issues/68567) — *The error message for partition expr is not correct.*
- **Why it matters:** It is labeled **bug** and **good first issue**, suggesting the problem is understood and likely localized.
- **Underlying technical need:** Better diagnostics during DDL reduce onboarding friction and support time, especially for users building partitioned tables and MVs.

## 4. Bugs & Stability

Ranked by likely user impact based on available data:

### High severity
#### 1) External MV refresh fallback may behave incorrectly for Iceberg-like connectors
- **PR:** [#70589](https://github.com/StarRocks/starrocks/pull/70589)
- **Risk area:** **Query correctness / freshness correctness** for external materialized views.
- **Why severe:** If a connector lacks true partition-level metadata refresh support but the system still enters a precise refresh path, users may get incorrect assumptions about refresh scope or miss expected fallback behavior.
- **Fix status:** **Open fix PR exists.**

### Medium severity
#### 2) Incorrect partition expression error message
- **Issue:** [#68567](https://github.com/StarRocks/starrocks/issues/68567)
- **Risk area:** **Developer usability / SQL DDL diagnostics**
- **Why medium:** This does not appear to be an execution crash or data corruption bug, but misleading DDL errors can slow adoption and make schema debugging harder.
- **Fix status:** No linked fix PR in today’s data.

### Low-to-medium severity
#### 3) Test regression after cherry-pick on release branch
- **PR:** [#70612](https://github.com/StarRocks/starrocks/pull/70612)
- **Risk area:** **Release stability / CI confidence**
- **Why lower severity for users:** This is mainly internal engineering friction, but if left unresolved it can delay branch stabilization.
- **Fix status:** PR closed, suggesting the branch issue was handled administratively or superseded.

## 5. Feature Requests & Roadmap Signals

Today’s PR stream gives strong signals about where StarRocks is headed next:

### Likely near-term features
#### 1) Better adaptive scan execution via lazy materialization
- **PR:** [#70618](https://github.com/StarRocks/starrocks/pull/70618)
- **Prediction:** Likely to appear in an upcoming version because it targets a core execution optimization area with broad performance upside.

#### 2) More complete Iceberg SQL compatibility
- **PR:** [#70508](https://github.com/StarRocks/starrocks/pull/70508)
- **Prediction:** High chance of landing in a near release, as Iceberg interoperability is strategically important and this PR includes both implementation and documentation.

#### 3) Safer external MV refresh semantics for lakehouse connectors
- **PR:** [#70589](https://github.com/StarRocks/starrocks/pull/70589)
- **Prediction:** Very likely to be prioritized because it addresses correctness and connector-aware behavior, both important for production external catalog deployments.

#### 4) OpenSearch federated querying
- **PR:** [#70542](https://github.com/StarRocks/starrocks/pull/70542)
- **Prediction:** Possible candidate for staged release behind limited-scope support, since the PR explicitly calls this **Phase 1** and excludes HTTPS/TLS and auth for now.

#### 5) Manual and automatic skew optimization for window functions
- **PRs:** [#70613](https://github.com/StarRocks/starrocks/pull/70613), [#70614](https://github.com/StarRocks/starrocks/pull/70614)
- **Prediction:** Strong chance of appearing in branch releases/backports where performance tuning for complex analytical SQL is a priority.

## 6. User Feedback Summary

From today’s activity, the clearest user needs are:

- **Clearer DDL diagnostics**, especially around partition expressions and schema design.
  - Reference: [#68567](https://github.com/StarRocks/starrocks/issues/68567)
- **Reliable materialized view behavior on external/lakehouse tables**, particularly when connector metadata semantics vary.
  - Reference: [#70589](https://github.com/StarRocks/starrocks/pull/70589)
- **Deeper Iceberg management support**, showing users want to manage evolving lakehouse tables directly from StarRocks SQL.
  - Reference: [#70508](https://github.com/StarRocks/starrocks/pull/70508)
- **Better performance on skewed analytical workloads**, especially for window functions.
  - References: [#70613](https://github.com/StarRocks/starrocks/pull/70613), [#70614](https://github.com/StarRocks/starrocks/pull/70614)
- **Broader federated connectivity**, with OpenSearch emerging as a practical integration target.
  - Reference: [#70542](https://github.com/StarRocks/starrocks/pull/70542)

Overall, feedback patterns suggest users are running StarRocks in increasingly **heterogeneous data architectures**: internal tables, Iceberg/lakehouse metadata, external MVs, and federated connectors. The pressure is not only on raw performance, but also on **compatibility, correctness, and operational clarity**.

## 7. Backlog Watch

### Important items needing maintainer attention

#### 1) DDL error messaging bug remains open since January
- **Issue:** [#68567](https://github.com/StarRocks/starrocks/issues/68567)
- **Created:** 2026-01-28
- **Why watch it:** Even though it is tagged **good first issue**, it has remained open for nearly two months. Small UX bugs in SQL diagnostics often linger but have outsized impact on new users and support burden.

### Open PRs that may need careful review due to scope
#### 2) OpenSearch connector Phase 1
- **PR:** [#70542](https://github.com/StarRocks/starrocks/pull/70542)
- **Why watch it:** New connectors are high-surface-area changes involving schema mapping, predicate pushdown limits, type coercion, and operational edge cases. The lack of HTTPS/TLS and auth in Phase 1 may limit production readiness.

#### 3) Iceberg partition replacement support
- **PR:** [#70508](https://github.com/StarRocks/starrocks/pull/70508)
- **Why watch it:** Partition evolution is subtle and can affect compatibility guarantees, metadata correctness, and user expectations around table maintenance.

#### 4) External MV precise refresh fallback
- **PR:** [#70589](https://github.com/StarRocks/starrocks/pull/70589)
- **Why watch it:** This touches correctness-sensitive logic across multiple connector types and likely warrants strong regression coverage.

---

## Project Health Assessment

- **Activity level:** Moderate
- **Release activity:** None today
- **Primary engineering themes:** Query execution optimization, Iceberg compatibility, external MV correctness, connector expansion
- **Risk outlook:** Low immediate risk from today’s issue volume, but **connector-aware correctness** and **feature breadth** remain the key areas to monitor

If you want, I can also turn this into a **short executive summary**, a **weekly trend view**, or a **Markdown newsletter format**.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-22

## 1. Today's Overview

Apache Iceberg showed **moderate-to-high development activity** over the last 24 hours, with **19 PRs updated** and **8 issues updated**, though only **1 PR/issue closure event of note on the PR side** and **no new releases**. Current work is concentrated in three areas: **Spark execution correctness/performance**, **REST/catalog API evolution**, and **format/runtime plumbing for future metadata features**. A noticeable pattern in today’s updates is that several changes target **operational reliability under scale**—especially around Spark rewrite jobs, delete-file handling, and manifest filtering deadlocks. Overall, project health looks active, but there are also signs of **review backlog accumulation** in stale Spark/API work and a few unresolved correctness bugs.

## 2. Project Progress

### Merged/closed PRs today

- [#15701](https://github.com/apache/iceberg/pull/15701) — **Core: Throw exception when non-vectorized reader set recordsPerBatch** *(closed)*
  - This change area touches **reader configuration correctness** across Spark/Parquet/Data/Flink/ORC codepaths.
  - Even though the PR was closed rather than merged, it indicates maintainers are actively refining behavior around **vectorized vs non-vectorized read settings**, which is important for preventing silent misconfiguration and inconsistent batch-read behavior.
  - This is a signal that Iceberg continues tightening **engine/runtime safety checks** rather than allowing ambiguous execution settings.

### Issues closed today

- [#11648](https://github.com/apache/iceberg/issues/11648) — **SparkExecutorCache causes slowness of RewriteDataFilesSparkAction**
  - This was a long-running Spark maintenance/performance complaint tied to rewrite actions.
  - Its closure is highly relevant because two fresh PRs appear directly related:
    - [#15714](https://github.com/apache/iceberg/pull/15714) — **Spark: revert disabling deletes cache for rewrites**
    - [#15712](https://github.com/apache/iceberg/pull/15712) — **Spark: preload delete files to avoid deadlocks**
  - Net effect: the project is actively rebalancing **rewrite performance vs cache behavior vs connection safety** in Spark maintenance actions.

- [#14016](https://github.com/apache/iceberg/issues/14016) — **Strict metrics evaluation for `startsWith` predicate**
  - This closure suggests progress in **query planning correctness** and metadata-based pruning semantics.
  - It matters for SQL/filter pushdown behavior where strict evaluation of string predicates affects **file skipping accuracy** and correctness guarantees.

## 3. Community Hot Topics

### 1) Spark memory leak during iterator-heavy foreachPartition usage
- [Issue #13297](https://github.com/apache/iceberg/issues/13297) — **Spark: Coalesce + foreachPartition leaks memory heavy iterators**
- Activity: **30 comments**
- Why it matters:
  - This is the most discussed issue in the set and points to a real user need around **safe row iteration over Iceberg-backed Spark datasets**.
  - The underlying technical demand is for **predictable memory behavior in low-level Spark actions**, especially when users bypass standard write/query paths and consume iterators directly.
  - This kind of issue tends to affect **ETL jobs, custom partition-level processing, and long-running Spark executors**.

### 2) Schema evolution regression when dropping highest field ID
- [Issue #13850](https://github.com/apache/iceberg/issues/13850) — **Schema update fails when dropping column with highest field ID**
- Activity: **11 comments, 1 reaction**
- Why it matters:
  - This is a core metadata correctness issue, not just an engine integration problem.
  - The technical need here is stronger assurance around **schema evolution invariants**, especially after upgrades.
  - Since the reporter explicitly ties it to **1.9.2**, users are sensitive to **upgrade regressions in DDL evolution workflows**.

### 3) Spark rewrite/cache/deadlock cluster
- [PR #15714](https://github.com/apache/iceberg/pull/15714) — **revert disabling deletes cache for rewrites**
- [PR #15712](https://github.com/apache/iceberg/pull/15712) — **preload delete files to avoid deadlocks**
- [PR #15713](https://github.com/apache/iceberg/pull/15713) — **close entries iterable in ManifestFilterManager**
- Why it matters:
  - These three updates together show a concentrated maintainer effort around **rewrite stability under constrained resources**.
  - The underlying need is enterprise-grade behavior in environments with **limited HTTP/client connections, many delete files, and manifest-heavy planning**.
  - This is a strong signal that production users are running Iceberg in **large-scale maintenance and compaction workflows**, not just query-serving mode.

### 4) Forward-looking Spark indexing work
- [PR #15311](https://github.com/apache/iceberg/pull/15311) — **Bloom filter index POC**
- Why it matters:
  - Even if still stale/WIP, this is one of the clearest roadmap signals toward **file-skipping acceleration via Puffin-backed auxiliary indexes**.
  - Technical demand: lower planning/read costs for selective queries in Spark 4.1 environments.

## 4. Bugs & Stability

Ranked by likely impact/severity based on reported behavior and subsystem affected.

### High severity

1. [#13850](https://github.com/apache/iceberg/issues/13850) — **Schema update fails when dropping column with highest field ID**
   - Impact: **core schema evolution failure**
   - Risk: blocks DDL changes after upgrade; could affect broad table lifecycle management.
   - Fix PR: **none visible in today’s data**
   - Why severe: this is a **metadata correctness/regression** issue in a fundamental API area.

2. [#13297](https://github.com/apache/iceberg/issues/13297) — **Spark memory leak with coalesce + foreachPartition**
   - Impact: **executor memory growth / job instability**
   - Risk: can trigger OOMs or degraded Spark job reliability.
   - Fix PR: **none visible in today’s data**
   - Why severe: memory leaks in Spark iteration paths are hard for users to mitigate safely.

3. [#15332](https://github.com/apache/iceberg/issues/15332) — **Null partition handling in hive migration**
   - Impact: **migration correctness**
   - Risk: incorrect or failed migration from Hive-partitioned tables, especially where `__HIVE_DEFAULT_PARTITION__` is present.
   - Fix PR: **none visible in today’s data**
   - Why severe: migration bugs can block onboarding existing lakehouse datasets into Iceberg.

### Medium severity

4. [#15708](https://github.com/apache/iceberg/issues/15708) — **Z-order rewrite fails when table has a column named `ICEZVALUE`**
   - Impact: **Spark rewrite operation failure with misleading error**
   - Fix PR exists: [#15706](https://github.com/apache/iceberg/pull/15706)
   - Why medium: narrow trigger condition, but the failure mode is confusing and affects maintenance optimization workflows.

5. [#14146](https://github.com/apache/iceberg/issues/14146) — **Incorrect UGI handling in Spark master**
   - Impact: likely **security/identity propagation correctness**
   - Fix PR: **none visible**
   - Why medium: likely environment-specific, but potentially serious in secured Hadoop/Spark deployments.

### Stability improvements in flight

- [#15712](https://github.com/apache/iceberg/pull/15712) — **preload delete files to avoid deadlocks**
- [#15713](https://github.com/apache/iceberg/pull/15713) — **close entries iterable in ManifestFilterManager**
- [#15714](https://github.com/apache/iceberg/pull/15714) — **revert disabling deletes cache for rewrites**

These are important because they address operational failure modes that often emerge only at scale: **connection starvation, manifest scan deadlocks, and rewrite slowness**.

## 5. Feature Requests & Roadmap Signals

### Active feature requests

- [#14220](https://github.com/apache/iceberg/issues/14220) — **Adding week partition transform**
  - Clear user ask for a `week(...)` partition transform alongside day/month/year/hour.
  - This is a practical analytics need for **business-calendar and reporting workloads**.

### Strong roadmap signals from open PRs

- [#15311](https://github.com/apache/iceberg/pull/15311) — **Bloom filter index POC**
  - Potential future direction: **advisory secondary indexes** for file skipping.
  - Likelihood next-version: **low to medium** for immediate release, since it is a POC and stale.

- [#14948](https://github.com/apache/iceberg/pull/14948) — **Spark 4.1 SupportsReportOrdering DSv2 API**
  - Strong signal for continued **Spark 4.1 integration and DSv2 compatibility**.
  - Likelihood next-version: **medium**, depending on dependency PR review.

- [#15669](https://github.com/apache/iceberg/pull/15669) — **Batch load endpoints for tables and views**
  - Important REST/catalog evolution.
  - Likelihood next-version: **high**, because it is recent, concrete, and aligned with catalog scalability needs.

- [#15049](https://github.com/apache/iceberg/pull/15049) — **Foundational types for V4 manifest support**
  - This is one of the most important architectural signals in today’s queue.
  - It points toward **future metadata format evolution / adaptive metadata tree work**.
  - Likelihood next-version: **medium**, as foundational pieces may land incrementally before full user-visible support.

- [#15433](https://github.com/apache/iceberg/pull/15433) — **Flink passthroughRecords option**
  - Strong signal that Iceberg is still investing in **Flink sink throughput optimization**.
  - Likelihood next-version: **medium to high**.

- [#15697](https://github.com/apache/iceberg/pull/15697) — **Document Spark SQL transform functions**
  - Documentation-only, but it highlights a user-facing compatibility concern: discoverability of **system namespace SQL transform functions**.
  - Likelihood next-version: **high**.

### Most likely near-term inclusions
Based on freshness and concreteness, the strongest candidates for the next release are:
1. [#15669](https://github.com/apache/iceberg/pull/15669) REST batch load APIs  
2. [#15706](https://github.com/apache/iceberg/pull/15706) Z-order `ICEZVALUE` validation fix  
3. [#15712](https://github.com/apache/iceberg/pull/15712) / [#15713](https://github.com/apache/iceberg/pull/15713) Spark/core deadlock fixes  
4. [#15433](https://github.com/apache/iceberg/pull/15433) Flink sink passthrough optimization  

## 6. User Feedback Summary

Today’s user feedback clusters around a few recurring pain points:

- **Spark maintenance/rewrite operations remain operationally sensitive**
  - Users report slowness, deadlocks, cache behavior issues, and misleading failures in rewrite jobs.
  - Relevant items:
    - [#11648](https://github.com/apache/iceberg/issues/11648)
    - [#15712](https://github.com/apache/iceberg/pull/15712)
    - [#15714](https://github.com/apache/iceberg/pull/15714)
    - [#15708](https://github.com/apache/iceberg/issues/15708)

- **Schema evolution and migrations need stronger edge-case reliability**
  - Users are hitting failures in column drops and Hive null-partition migration.
  - Relevant items:
    - [#13850](https://github.com/apache/iceberg/issues/13850)
    - [#15332](https://github.com/apache/iceberg/issues/15332)

- **Performance users want lower overhead in both planning and writes**
  - Bloom filter file-skipping, Flink passthrough pipelines, and Kafka Connect DV-mode work all show demand for **higher-throughput, lower-latency data operations**.
  - Relevant items:
    - [#15311](https://github.com/apache/iceberg/pull/15311)
    - [#15433](https://github.com/apache/iceberg/pull/15433)
    - [#14797](https://github.com/apache/iceberg/pull/14797)

- **Users need clearer SQL/documentation ergonomics**
  - The Spark SQL transform docs PR suggests some features exist but are not easily discoverable.
  - Relevant item:
    - [#15697](https://github.com/apache/iceberg/pull/15697)

Overall sentiment from the data is that Iceberg is valued for advanced capabilities, but users continue to pressure the project on **production robustness, edge-case correctness, and operational clarity**.

## 7. Backlog Watch

These items look important and likely need maintainer attention due to age, staleness, or architectural importance.

### Important open issues

- [#13297](https://github.com/apache/iceberg/issues/13297) — **Spark iterator memory leak**
  - Old, heavily discussed, still open and stale.
  - Needs resolution because it impacts job stability and user trust in direct Spark iteration patterns.

- [#13850](https://github.com/apache/iceberg/issues/13850) — **Dropping highest field ID fails**
  - A likely regression-level issue in schema evolution.
  - Needs core maintainer investigation and likely backport consideration once fixed.

- [#14146](https://github.com/apache/iceberg/issues/14146) — **UGI propagation issue**
  - Low comment volume but potentially important for secure enterprise deployments.

- [#14220](https://github.com/apache/iceberg/issues/14220) — **Week partition transform**
  - Not urgent for stability, but a useful roadmap item that could improve partitioning ergonomics.

### Important open PRs

- [#15311](https://github.com/apache/iceberg/pull/15311) — **Bloom filter index POC**
  - Strategically important for performance, but stale.
  - Needs product/architecture direction from maintainers.

- [#14948](https://github.com/apache/iceberg/pull/14948) — **Spark 4.1 SupportsReportOrdering**
  - Important for Spark compatibility.
  - Blocked by prior review chain; needs coordinated maintainer bandwidth.

- [#14876](https://github.com/apache/iceberg/pull/14876) — **Encrypting IO as DelegateFileIO**
  - Important for users combining encryption with bulk operations.
  - Likely deserves attention because it affects real production deployment constraints.

- [#15049](https://github.com/apache/iceberg/pull/15049) — **V4 manifest support foundations**
  - High strategic importance.
  - Even if not immediately mergeable, this area likely needs active design shepherding.

## 8. Links Index

For quick access, here are the most consequential items from today:

- [Issue #13297](https://github.com/apache/iceberg/issues/13297) — Spark memory leak in `foreachPartition`
- [Issue #13850](https://github.com/apache/iceberg/issues/13850) — Schema evolution drop-column failure
- [Issue #15332](https://github.com/apache/iceberg/issues/15332) — Hive migration null partition bug
- [Issue #15708](https://github.com/apache/iceberg/issues/15708) — Z-order `ICEZVALUE` name collision
- [PR #15706](https://github.com/apache/iceberg/pull/15706) — Fix/validate `ICEZVALUE` collision early
- [PR #15712](https://github.com/apache/iceberg/pull/15712) — Preload delete files to avoid deadlocks
- [PR #15713](https://github.com/apache/iceberg/pull/15713) — Close entries iterable in `ManifestFilterManager`
- [PR #15714](https://github.com/apache/iceberg/pull/15714) — Revert disabling deletes cache for rewrites
- [PR #15669](https://github.com/apache/iceberg/pull/15669) — REST batch load endpoints
- [PR #15049](https://github.com/apache/iceberg/pull/15049) — V4 manifest support foundations
- [PR #15311](https://github.com/apache/iceberg/pull/15311) — Bloom filter index POC
- [PR #15433](https://github.com/apache/iceberg/pull/15433) — Flink passthrough records optimization

**Bottom line:** Iceberg remains highly active, with today’s work skewing toward **Spark operational hardening**, **catalog/API expansion**, and **future metadata/performance architecture**. The biggest near-term project health issue is not lack of development, but ensuring that **older high-impact bugs and stale strategic PRs** receive enough maintainer attention to convert momentum into shipped stability.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-22

## 1. Today's Overview

Delta Lake showed **moderate-to-high development activity** over the last 24 hours, with **19 pull requests updated** and **1 issue updated**, but **no new official release published**. The strongest signal is that the project is in an active **post-release-candidate stabilization and feature-integration phase** around **Delta 4.2.0**, with the newly opened release-cut issue pointing users to **4.2.0-RC0 for testing**. Engineering attention is concentrated in a few clear areas: **Kernel maturity**, **CDC/streaming offset management**, **Unity Catalog / Server Side Planning integration**, and **test/CI stabilization**. Overall project health looks good: maintainers are landing cleanup and reliability fixes while continuing to push deeper catalog and connector capabilities.

## 2. Project Progress

### Merged/closed PRs today

Although there were **no new releases**, several PRs were closed recently that indicate concrete progress in engine behavior, platform integration, and reliability.

- **[Build] Change branch version to 4.2.0-SNAPSHOT** ([#6340](https://github.com/delta-io/delta/pull/6340))  
  This is an important release-process signal: mainline development has moved forward after the release candidate cut, implying that **4.2.0 work is being finalized** and **subsequent development has resumed** on snapshot versions.

- **[ServerSidePlanning] Add OAuth + credential refresh support** ([#6292](https://github.com/delta-io/delta/pull/6292))  
  Closed in favor of a newer PR, but strategically significant. It advances **catalog-aware query planning** and **secure credential handling**, replacing static bearer-token patterns with **refreshable OAuth-backed credential providers**. This is a strong signal that Delta is improving for **managed, multi-tenant, Unity Catalog-driven deployments**.

- **[ServerSidePlanning] Add e2e OAuth test with mock token server** ([#6295](https://github.com/delta-io/delta/pull/6295))  
  Even though this specific PR is closed, it shows work toward **production-grade authentication validation** for Server Side Planning. The use of an end-to-end test around OAuth refresh behavior suggests maintainers are hardening cloud/catalog integration paths.

- **[Spark] Fix flaky testPlanInputPartitionsGroupsFilesByPartition** ([#6344](https://github.com/delta-io/delta/pull/6344))  
  This improves **Spark connector test reliability** around file grouping and partition planning. While not user-facing on its own, it reduces CI noise and improves confidence in data scan planning behavior.

- **Improve comment clarity in UniForm example** ([#6341](https://github.com/delta-io/delta/pull/6341))  
  Small documentation-quality improvement, clarifying async Iceberg metadata conversion behavior in a UniForm example. This reflects continued investment in **interoperability UX**.

- **[KERNEL] Add collations table feature** ([#5718](https://github.com/delta-io/delta/pull/5718))  
  A long-running kernel-oriented PR was closed. Even without merge context here, its closure signals that **SQL semantic compatibility topics such as collations** remain active design territory for Delta Kernel.

### What was advanced technically

Across open and recently closed work, the project is moving forward on:

- **CDC streaming semantics** in kernel-spark
- **OAuth/credential refresh** for server-side planning
- **Variant type support** in Delta Kernel Java
- **Decimal cast correctness** in the Kernel expression layer
- **Pushdown support** in the Delta V2 connector
- **Protocol clarification** around checkpoint/domainMetadata semantics
- **CI/test flakiness reduction** in Spark and catalog-managed table paths

## 3. Community Hot Topics

### 1) Delta 4.2.0 release candidate testing
- **Issue:** **Delta 4.2.0 Release Cut** ([#6345](https://github.com/delta-io/delta/issues/6345))  
- Author: @openinx  
- Comments: 1

This is the clearest community focal point today. The release-cut issue announces **4.2.0-RC0** and emphasizes improvements for **Unity Catalog Managed Tables** and **streaming reads in UC-oriented environments**. The technical need underneath this is clear: users increasingly run Delta in **catalog-governed, enterprise data platform setups**, and need Delta behavior to align more tightly with external metadata/control planes.

### 2) CDC streaming offset management stack
- **PR:** **[kernel-spark][Part 1] CDC streaming offset management (initial snapshot)** ([#6075](https://github.com/delta-io/delta/pull/6075))  
- **PR:** **[kernel-spark][Part 2] ... add commit processing logic for incremental changes** ([#6076](https://github.com/delta-io/delta/pull/6076))  
- **PR:** **[kernel-spark][Part 3] ... finish wiring up incremental change processing** ([#6336](https://github.com/delta-io/delta/pull/6336))

This stacked series is one of the most strategically important active efforts. It points to demand for **robust CDC consumption through streaming**, especially around how offsets are computed across **initial snapshots plus incremental commits**. The underlying need is reliable exactly-once/consistent progress tracking for downstream systems consuming Delta Change Data Feed.

### 3) Server-side planning with OAuth and refreshable credentials
- **PR:** **[ServerSidePlanning] Add OAuth + credential refresh support** ([#6346](https://github.com/delta-io/delta/pull/6346))

This continues the earlier closed SSP work and shows that catalog-mediated access is becoming more dynamic. The need here is operational: users do not want to embed static storage credentials in long-lived jobs. Instead they need **short-lived, refreshable, provider-backed credentials** integrated into planning and execution paths.

### 4) Delta REST Catalog API v1 client integration
- **PR:** **Delta REST Catalog API v1 client integration** ([#6347](https://github.com/delta-io/delta/pull/6347))

Even though the summary is sparse, the title is meaningful. It suggests a broader roadmap toward **standardized remote catalog access**, likely important for interoperability with managed catalog services and remote planning models.

## 4. Bugs & Stability

Ranked by likely severity based on impact signals in the data.

### High
1. **Potential correctness/consistency complexity in CDC streaming offset handling**
   - PRs: [#6075](https://github.com/delta-io/delta/pull/6075), [#6076](https://github.com/delta-io/delta/pull/6076), [#6336](https://github.com/delta-io/delta/pull/6336)
   - Why it matters: streaming CDC offset bugs can lead to **missed changes, duplicate consumption, or incorrect replay boundaries**.
   - Fix status: **Active development in a multi-part stacked PR series**.

### Medium
2. **Flaky retention behavior in catalog-owned table tests**
   - PR: **[CI Improvements] Fix flaky DeltaRetentionWithCatalogOwnedBatch1Suite test** ([#6348](https://github.com/delta-io/delta/pull/6348))
   - Symptom: intermittent failure asserting old Delta log files should have been deleted.
   - Why it matters: primarily a **stability/CI reliability** issue, but tied to retention semantics that are operationally important in production.
   - Fix status: **Open**.

3. **Flaky Spark file-grouping partition planning test**
   - PR: **[Spark] Fix flaky testPlanInputPartitionsGroupsFilesByPartition** ([#6344](https://github.com/delta-io/delta/pull/6344))
   - Why it matters: test-only on the surface, but related to **scan partitioning behavior**, which can affect performance assumptions.
   - Fix status: **Closed**.

### Medium-Low
4. **Decimal literal and implicit cast handling in Kernel**
   - PRs: [#6257](https://github.com/delta-io/delta/pull/6257), [#6259](https://github.com/delta-io/delta/pull/6259)
   - Why it matters: these are **query correctness / expression semantics** issues, especially for Java users and systems relying on exact decimal behavior.
   - Fix status: **Open**.

### Low
5. **Protocol ambiguity around tombstoned domain metadata in checkpoints**
   - PR: [#6337](https://github.com/delta-io/delta/pull/6337)
   - Why it matters: mostly a **spec clarification**, but important to avoid divergent implementations across readers/writers.
   - Fix status: **Open**.

## 5. Feature Requests & Roadmap Signals

Several active PRs provide strong signals about likely near-term roadmap priorities.

### Likely near-term / 4.2.x relevant
- **Unity Catalog managed table improvements**
  - Signaled directly in the release-cut issue ([#6345](https://github.com/delta-io/delta/issues/6345)).
  - This is the strongest indicator of what users should expect in the next version line.

- **CDC streaming offset management in kernel-spark**
  - PRs [#6075](https://github.com/delta-io/delta/pull/6075), [#6076](https://github.com/delta-io/delta/pull/6076), [#6336](https://github.com/delta-io/delta/pull/6336)
  - Very likely to shape future **streaming/CDF usability** if completed soon.

- **Server Side Planning + OAuth credential refresh**
  - PR [#6346](https://github.com/delta-io/delta/pull/6346)
  - Strong candidate for near-term adoption in enterprise deployments using UC and remote planning APIs.

- **Delta REST Catalog API v1 client integration**
  - PR [#6347](https://github.com/delta-io/delta/pull/6347)
  - Suggests Delta is expanding its **catalog interoperability surface**.

### Medium-term signals
- **Variant support in Kernel Java**
  - PRs [#6349](https://github.com/delta-io/delta/pull/6349), [#6350](https://github.com/delta-io/delta/pull/6350)
  - Indicates ongoing effort to make semi-structured/variant data a first-class capability in kernel-based consumers.

- **Pushdown improvements in kernel-based Spark connector**
  - PR [#6332](https://github.com/delta-io/delta/pull/6332)
  - `SupportsPushDownLimit` can improve efficiency for selective reads and short-result queries.

- **SQL type compatibility work**
  - PRs [#6257](https://github.com/delta-io/delta/pull/6257), [#6259](https://github.com/delta-io/delta/pull/6259), and historically [#5718](https://github.com/delta-io/delta/pull/5718)
  - Signals broader investment in **Kernel SQL semantics parity**.

## 6. User Feedback Summary

Based on the issue/PR mix, current user and operator pain points appear to be:

- **Managed catalog compatibility**  
  Users want Delta to behave cleanly in **Unity Catalog-controlled environments**, especially for managed tables, auth flows, and storage credential delegation. This is the loudest platform-level need today, reflected in [#6345](https://github.com/delta-io/delta/issues/6345) and [#6346](https://github.com/delta-io/delta/pull/6346).

- **Reliable CDC streaming consumption**  
  The large stacked CDC PR chain suggests demand for **predictable offset semantics** when consuming incremental changes. This is a common production pain point for replication, warehousing sync, and downstream event-driven pipelines.

- **Kernel maturity for non-Spark consumers**  
  Variant support, decimal semantics, and test decoupling from Spark indicate a push to make **Delta Kernel more self-sufficient** and easier to embed in broader ecosystems.

- **Operational reliability over headline features**  
  Multiple PRs are about flaky tests and auth refresh hardening rather than new syntax or format expansion. That suggests users care strongly about **stability, cloud auth correctness, and deterministic behavior**.

There is **no strong negative sentiment spike** in the provided data; instead, feedback appears to be mostly in the form of engineering refinements and release testing.

## 7. Backlog Watch

These items look important and worthy of maintainer attention due to age, scope, or architectural impact.

- **[kernel-spark][Part 1] CDC streaming offset management** ([#6075](https://github.com/delta-io/delta/pull/6075))  
  Open since **2026-02-19**. Foundational for the rest of the CDC stack; prolonged review delays could stall downstream parts.

- **[kernel-spark][Part 2] CDC streaming offset management** ([#6076](https://github.com/delta-io/delta/pull/6076))  
  Also open since **2026-02-19**. Important for commit-processing logic and likely tightly coupled to correctness.

- **[Kernel] Support implicit cast between DECIMAL types with different precisions** ([#6257](https://github.com/delta-io/delta/pull/6257))  
  Open since **2026-03-12**. Relevant to type compatibility and expression correctness.

- **[Kernel] Fix Literal.ofDecimal to handle precision < scale from Java BigDecimal** ([#6259](https://github.com/delta-io/delta/pull/6259))  
  Open since **2026-03-12**. This looks like a meaningful correctness edge case in the Java API surface.

- **[kernel-spark] Implement SupportsPushDownLimit in Delta V2 connector** ([#6332](https://github.com/delta-io/delta/pull/6332))  
  Open since **2026-03-20**. Lower urgency than correctness bugs, but valuable for connector efficiency and Spark integration parity.

- **Delta REST Catalog API v1 client integration** ([#6347](https://github.com/delta-io/delta/pull/6347))  
  Newer, but strategically important. If this stalls, it could slow broader catalog interoperability efforts.

## 8. Overall Health Assessment

Delta Lake appears **healthy and actively maintained**, with momentum centered on **enterprise catalog integration**, **streaming CDC semantics**, and **Kernel maturation**. The absence of a final release today is offset by a clear **4.2.0-RC0 testing cycle** and version branch progression to **4.2.0-SNAPSHOT**, indicating normal release engineering flow. The main risk area is not visible user-reported breakage, but rather the complexity of in-flight architectural work—especially around **CDC offsets** and **server-side planning auth flows**. If those land cleanly, the next version should materially improve Delta’s fit in governed, cloud-native analytical platforms.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-22

## 1. Today’s Overview

Databend showed **moderate development activity** over the last 24 hours, with **9 pull requests updated**, **4 closed/merged**, **5 still open**, and **no issue activity**. The work pattern is concentrated on **query/parser correctness**, **storage engine refactoring**, and **optimizer improvements**, which suggests the team is currently prioritizing engine quality and internal architecture over broad new surface-area expansion. A new patch release was published, indicating active maintenance and willingness to ship incremental fixes quickly. Overall, project health looks **stable and execution-focused**, though the lack of issue activity limits visibility into fresh user-reported problems.

---

## 2. Releases

## New Release: [v1.2.888-patch-2](https://github.com/databendlabs/databend/compare/v1.2.889-nightly...v1.2.888-patch-2)

A new patch release, **v1.2.888-patch-2**, was published today. The provided release metadata does not include detailed notes beyond the generated changelog link, so the safest interpretation is that this is a **maintenance/patch train release** rather than a major feature milestone.

### Likely change themes reflected in nearby PR activity
Based on the PRs closed today, this patch line is likely associated with:
- **SQL/parser correctness fixes**, especially around **parenthesized UNION / grouped set operations**
- **Compatibility adjustments** in unload behavior
- **Testing and observability improvements** for sqllogictest diagnostics

### Breaking changes
No explicit breaking changes are described in the available release text.

### Migration notes
No migration steps are explicitly required from the release note snippet. For operators, the main recommendation is:
- verify workloads involving **UNION/set operations**
- recheck **UNLOAD** flows using `include_query_id=true` and `use_raw_path=true`
- benefit from improved test diagnostics if tracking CI instability

---

## 3. Project Progress

### Merged/closed PRs advancing the project today

#### 1. SQL parser correctness for grouped set operations
- [#19585](https://github.com/databendlabs/databend/pull/19585) — **fix(parser): preserve parentheses for grouped set operations**
- [#19586](https://github.com/databendlabs/databend/pull/19586) — **fix(parser): preserve parentheses for grouped set operations**

These fixes address a parser/AST problem where parentheses around `UNION` expressions were lost, leading to panics or invalid query re-display. This is a meaningful **SQL compatibility and correctness improvement**, especially for tooling, query normalization, and complex generated SQL.

#### 2. Compatibility fix for unload options
- [#19583](https://github.com/databendlabs/databend/pull/19583) — **fix: unload allow `include_query_id=true use_raw_path=true` for compat.**

This closed PR improves practical compatibility in `UNLOAD` behavior. Although the options are logically conflicting, the system now appears to tolerate the combination for backward compatibility. This is a pragmatic stability move that reduces operational breakage for existing users and automation.

#### 3. Better failure diagnostics in sqllogictest
- [#19528](https://github.com/databendlabs/databend/pull/19528) — **feat(test): display query_id on sqllogictest failure**

This improves internal developer productivity and debuggability by surfacing `query_id` during sqllogictest failures. While not directly user-facing, it strengthens Databend’s quality pipeline and should shorten turnaround on flaky or difficult-to-reproduce query failures.

### Open work likely to shape near-term progress

#### Storage engine refactor
- [#19576](https://github.com/databendlabs/databend/pull/19576) — **refactor(storage): extract fuse block format abstraction**

This is an important architectural refactor: introducing a `FuseBlockFormat` abstraction and unifying read transforms across native/parquet pathways. If merged, it should reduce duplication and make future storage-format evolution easier.

#### Optimizer work
- [#19581](https://github.com/databendlabs/databend/pull/19581) — **feat(optimizer): introduce type shrinking rules for aggregates and joins**

This points to ongoing performance-oriented planner work. Type shrinking can reduce memory footprint and improve execution efficiency in analytical workloads.

#### Snapshot/table metadata features
- [#19549](https://github.com/databendlabs/databend/pull/19549) — **feat(query): support experimental table tags for FUSE table snapshots**

This is a roadmap-relevant feature for data versioning / snapshot management workflows and could become notable for reproducibility and branch/tag-like lakehouse operations.

---

## 4. Community Hot Topics

There were **no updated issues** in the last 24 hours, and the provided PR data does not include usable comment counts or reaction volume. So the best proxy for “hot topics” is the cluster of related PRs updated or closed today.

### 1. SQL parenthesis preservation in UNION/set operations
- [#19587](https://github.com/databendlabs/databend/pull/19587) — open
- [#19586](https://github.com/databendlabs/databend/pull/19586) — closed
- [#19585](https://github.com/databendlabs/databend/pull/19585) — closed

**Technical need:** robust support for complex SQL syntax trees, especially when generated by BI tools, transpilers, or query builders. Parenthesis-preserving parsing is not cosmetic; it is necessary for correct AST round-tripping and safe display/normalization.

### 2. Recursive view safety
- [#19584](https://github.com/databendlabs/databend/pull/19584) — **fix(query): avoid create or alter recursive views**

**Technical need:** guardrails around invalid metadata definitions and recursive query/view structures. This points to a user need for stronger validation at DDL time rather than runtime failure later.

### 3. Storage abstraction cleanup in Fuse
- [#19576](https://github.com/databendlabs/databend/pull/19576) — **refactor(storage): extract fuse block format abstraction**

**Technical need:** reducing codepath fragmentation across physical formats and preparing the storage layer for maintainability, optimization, or future format support.

### 4. Experimental table tags
- [#19549](https://github.com/databendlabs/databend/pull/19549) — **support experimental table tags for FUSE table snapshots**

**Technical need:** better snapshot navigation, reproducibility, and lightweight version semantics over table state. This is aligned with lakehouse-style operational patterns.

---

## 5. Bugs & Stability

Ranked by likely severity based on the available descriptions.

### High severity: parser panic / assertion failures on UNION with parentheses
- [#19587](https://github.com/databendlabs/databend/pull/19587) — open fix
- [#19586](https://github.com/databendlabs/databend/pull/19586) — closed fix
- [#19585](https://github.com/databendlabs/databend/pull/19585) — closed fix

**Impact:** queries with parenthesized set operations could trigger parser assertions or panics, affecting correctness and reliability.  
**Status:** fix PRs were closed/merged today, so this appears actively addressed.  
**Why it matters:** this is a query correctness issue with crash potential, making it the most serious problem visible in today’s data.

### Medium severity: recursive view creation/alteration allowed
- [#19584](https://github.com/databendlabs/databend/pull/19584) — open

**Impact:** recursive views can create semantic invalidity, planner/runtime recursion problems, or undefined behavior.  
**Status:** fix proposed but still open.  
**Why it matters:** this is a metadata integrity and safety issue rather than an obvious crash, but it can create difficult downstream failures.

### Medium-to-low severity: unload option compatibility regression/behavior conflict
- [#19583](https://github.com/databendlabs/databend/pull/19583) — closed

**Impact:** existing workflows may have broken or behaved unexpectedly when combining `include_query_id=true` with `use_raw_path=true`.  
**Status:** compatibility fix closed today.  
**Why it matters:** operational compatibility issues are painful in ETL/export automation even when not engine-critical.

### Low severity but quality-relevant: poor failure observability in sqllogictest
- [#19528](https://github.com/databendlabs/databend/pull/19528) — closed

**Impact:** slower triage of CI/query failures.  
**Status:** improved with `query_id` reporting.  
**Why it matters:** stronger diagnostics indirectly improve stability over time.

---

## 6. Feature Requests & Roadmap Signals

No new issues were posted today, so explicit user-submitted feature requests are absent in this snapshot. Still, several open PRs strongly signal near-term roadmap direction.

### Strong roadmap signals

#### 1. Experimental table tags for FUSE snapshots
- [#19549](https://github.com/databendlabs/databend/pull/19549)

This is the clearest user-facing feature under active development. It suggests Databend is moving toward richer **snapshot lifecycle and version-reference semantics**, likely useful for reproducible analytics, rollback-like workflows, and dev/test branching patterns.

**Prediction:** likely to appear in an upcoming release behind an experimental flag before broader stabilization.

#### 2. Type shrinking in optimizer
- [#19581](https://github.com/databendlabs/databend/pull/19581)

This points to continued focus on **execution efficiency**, especially memory reduction in aggregates and joins. For OLAP workloads, this can translate into better concurrency and lower resource pressure.

**Prediction:** strong candidate for near-term release inclusion if benchmarks remain positive.

#### 3. Fuse block format abstraction
- [#19576](https://github.com/databendlabs/databend/pull/19576)

Though framed as refactoring, this often precedes broader support for new storage behaviors or easier optimization across formats.

**Prediction:** not necessarily a headline feature next version, but likely foundational for upcoming storage improvements.

#### 4. Recursive view validation
- [#19584](https://github.com/databendlabs/databend/pull/19584)

This is less a feature request than a correctness enhancement, but it signals continuing work to tighten SQL DDL semantics.

---

## 7. User Feedback Summary

Because there were **no active issues updated today**, direct user feedback is limited. The available PRs nonetheless reveal several practical pain points:

### Observed user pain points
- **Complex SQL generated by tools can break parser assumptions**, especially around nested `UNION` and parentheses.
- **DDL validation gaps** such as recursive view definitions are undesirable and should be caught early.
- **Backward compatibility matters** in export/unload workflows; users appear to rely on option combinations that are not perfectly clean semantically.
- **Test/debug visibility** remains important for contributors and operators diagnosing query failures.

### Satisfaction / confidence signals
- Fast closure of parser and unload-related fixes suggests the team is responsive on **SQL correctness** and **compatibility maintenance**.
- Presence of optimizer and storage refactor work suggests confidence to continue investing in performance and architecture, not just firefighting.

---

## 8. Backlog Watch

These items appear to merit maintainer attention based on importance and ongoing status.

### Open PRs needing follow-through

#### [#19576](https://github.com/databendlabs/databend/pull/19576) — refactor(storage): extract fuse block format abstraction
Important internal refactor with potentially wide storage-engine impact. Because it unifies read pipeline construction, review depth matters; prolonged delay could slow related storage work.

#### [#19581](https://github.com/databendlabs/databend/pull/19581) — feat(optimizer): introduce type shrinking rules for aggregates and joins
High-value optimizer work with performance implications. This looks strategically important and likely deserves benchmark scrutiny and timely review.

#### [#19549](https://github.com/databendlabs/databend/pull/19549) — support experimental table tags for FUSE table snapshots
A notable feature PR that could become user-visible roadmap material. It likely needs product-level review around semantics, metadata model, and compatibility.

#### [#19584](https://github.com/databendlabs/databend/pull/19584) — avoid create or alter recursive views
This should be prioritized from a correctness perspective since it prevents invalid object definitions from entering the system.

### Backlog risk assessment
There is **no visible issue backlog pressure** in today’s dataset, but that also means public issue flow may be temporarily underrepresenting user demand. Current risk is not volume but **review bandwidth** on several meaningful open PRs spanning storage, optimizer, and SQL semantics.

---

## Linked Items Referenced

- Release: [v1.2.888-patch-2](https://github.com/databendlabs/databend/compare/v1.2.889-nightly...v1.2.888-patch-2)
- [#19576](https://github.com/databendlabs/databend/pull/19576)
- [#19584](https://github.com/databendlabs/databend/pull/19584)
- [#19587](https://github.com/databendlabs/databend/pull/19587)
- [#19581](https://github.com/databendlabs/databend/pull/19581)
- [#19528](https://github.com/databendlabs/databend/pull/19528)
- [#19586](https://github.com/databendlabs/databend/pull/19586)
- [#19585](https://github.com/databendlabs/databend/pull/19585)
- [#19549](https://github.com/databendlabs/databend/pull/19549)
- [#19583](https://github.com/databendlabs/databend/pull/19583)

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-22

## 1. Today's Overview

Velox showed **high pull-request activity** over the last 24 hours, with **43 PRs updated** and **26 merged/closed**, while **no issues were updated** and **no releases were published**. The activity pattern suggests a day focused more on **code integration, cleanup, and incremental feature delivery** than on outward-facing release management or issue triage. The strongest themes were **Iceberg write/read support maturation**, **build-system correctness**, **join/filter stability fixes**, and **SQL/functionality expansion for Presto and Spark dialects**. Overall project health looks solid: the absence of fresh issue churn combined with a large batch of merged work points to **active maintainer throughput and ongoing stabilization of storage and engine subsystems**.

## 3. Project Progress

### Merged/closed PRs advancing the engine and storage stack

#### Iceberg support continued to mature significantly
A substantial share of closed work clustered around **Iceberg connector and writer functionality**, indicating this remains a major investment area.

- **Support iceberg compatible min max stats** — merged  
  https://github.com/facebookincubator/velox/pull/16060  
  This adds **Iceberg-compatible Parquet statistics encoding**, including correct handling for decimal endian encoding and binary/string ordering semantics. This is important for **metadata correctness**, **file pruning**, and interoperability with Iceberg readers.

- **Add Iceberg partition name generator** — merged  
  https://github.com/facebookincubator/velox/pull/15461  
  This advances support for **writing partitioned Iceberg tables** by implementing Iceberg-specific partition naming rules, a prerequisite for correct layout and downstream table interoperability.

- **Add Iceberg connector** — merged  
  https://github.com/facebookincubator/velox/pull/15581  
  This refactors Iceberg away from Hive-oriented plumbing, signaling a move toward a more **independent Iceberg connector architecture**.

- **Incorrect min max stats when values are infinity / -infinity** — merged  
  https://github.com/facebookincubator/velox/pull/14603  
  This fixes a subtle **statistics correctness bug** in Parquet writing for floating-point edge cases. It matters because corrupted or nonstandard stats can affect **predicate pushdown and file skipping accuracy**.

- **Delete an iceberg redundant test case** — merged  
  https://github.com/facebookincubator/velox/pull/16091  
  This removes a misleading test whose data was not truly partitioned, improving **test suite validity**.

- **Remove velox_dwio_parquet_field_id from Iceberg link library** — merged  
  https://github.com/facebookincubator/velox/pull/16106  
  This addressed a **build failure when Parquet is disabled**, improving portability across build configurations.

Older Iceberg-related PRs were also closed without merging, which likely reflects cleanup of stale branches after successor work landed:

- **Support Iceberg partition transforms** — closed  
  https://github.com/facebookincubator/velox/pull/13874
- **Rename iceberg cmake target name** — closed  
  https://github.com/facebookincubator/velox/pull/14518
- **Collect iceberg data file statistics during insertion** — closed  
  https://github.com/facebookincubator/velox/pull/14146
- **Add unit test for Iceberg data file statistics** — closed  
  https://github.com/facebookincubator/velox/pull/14147

Taken together, these indicate that the project is moving from **prototype Iceberg support toward production-grade connector, writer, and metadata behavior**.

#### Query engine correctness and stability improved
- **fix: Skip filter evaluation in HashProbe when no rows are selected** — open but actively updated  
  https://github.com/facebookincubator/velox/pull/16868  
  This addresses a **debug-time crash** in `DictionaryVector::validate` during anti-join filter evaluation. Even though still open, it highlights active hardening of **join execution correctness**, especially around corner cases with filtered ANTI joins.

- **fix: Pre-load lazy probe input vectors before the non-reclaimable probe loop** — open but actively updated  
  https://github.com/facebookincubator/velox/pull/16774  
  This improves memory/reclaim behavior and avoids scattered lazy loads in the probe path, indicating continued work on **memory arbitration robustness** in execution pipelines.

#### SQL compatibility and language surface expanded
- **Add TIME type support for DuckDbQueryRunner** — merged  
  https://github.com/facebookincubator/velox/pull/15016  
  This improves test and validation coverage for **TIME semantics**, useful for SQL compatibility assurance.

- **Add BaseVector::createFromVariants convenience API** — merged  
  https://github.com/facebookincubator/velox/pull/15955  
  While developer-facing, this should simplify test construction and generic vector creation, helping **faster implementation of functions and operators**.

- **fix(gcs): Optional config hive.gcs.endpoint is accessed when not set** — merged  
  https://github.com/facebookincubator/velox/pull/14104  
  This resolves an **operational correctness issue** when accessing GCS-backed tables without an optional endpoint configuration.

#### Tooling and developer workflow
- **fix: Pre-commit regex error on python14** — merged  
  https://github.com/facebookincubator/velox/pull/15893  
  This improves contributor workflow and CI/pre-commit reliability.

## 4. Community Hot Topics

There were **no issues updated**, and the provided PR data does not include usable comment counts, so “hot topics” must be inferred from the concentration of updates and technical themes rather than explicit discussion volume.

### Most notable active PRs

- **fix(build): IcebergParquetStatsCollector requires ParquetWriter**  
  https://github.com/facebookincubator/velox/pull/16867  
  Technical need: build correctness for the Iceberg/Parquet path. This suggests the Iceberg writer stack is still being modularized and link dependencies are being tightened.

- **[draft] Fix missing parquet writer link in iceberg splitreader CMake**  
  https://github.com/facebookincubator/velox/pull/16877  
  https://github.com/facebookincubator/velox/pull/16867  
  Together these two PRs point to the same need: **build-system consistency around optional Parquet-enabled Iceberg code paths**.

- **feat: Add toPrestoTypeSql() for Presto SQL type formatting**  
  https://github.com/facebookincubator/velox/pull/16876  
  Technical need: reusable, production-grade **Presto SQL type serialization**. This is a signal that Velox is pushing more dialect-aware logic from test utilities into supported runtime code.

- **feat(spark): Add approx_count_distinct_for_intervals SparkSql aggregate function**  
  https://github.com/facebookincubator/velox/pull/16595  
  Technical need: tighter **Spark SQL semantic parity**, specifically for cost-based optimizer histogram/NDV workflows involving interval types.

- **fix: Skip filter evaluation in HashProbe when no rows are selected**  
  https://github.com/facebookincubator/velox/pull/16868  
  Technical need: robust handling of **empty selections and filtered join edge cases** in the execution engine.

### Underlying themes
The day’s active work suggests the community is most focused on:
1. **Iceberg production readiness**: connector separation, partition semantics, file statistics, writer correctness.
2. **SQL dialect completeness**: especially **Presto formatting utilities** and **Spark aggregate compatibility**.
3. **Engine stability under edge conditions**: anti joins, lazy loading, reclaim-aware execution.
4. **Build modularity**: especially around optional Parquet/Iceberg components.

## 5. Bugs & Stability

Ranked by likely severity and user impact:

### 1. Join-path crash in `HashProbe` under ANTI join filter edge case
- PR: **Skip filter evaluation in HashProbe when no rows are selected**  
  https://github.com/facebookincubator/velox/pull/16868  
- Severity: **High**
- Impact: Can trigger a **debug-only crash** involving `DictionaryVector::validate`, but the underlying bug suggests unsafe behavior in a nuanced join/filter execution path.
- Status: **Fix in open PR**

### 2. Memory/reclaim instability during lazy probe loading
- PR: **Pre-load lazy probe input vectors before the non-reclaimable probe loop**  
  https://github.com/facebookincubator/velox/pull/16774  
- Severity: **High**
- Impact: Appears related to failures when lazy loading occurs inside a non-reclaimable section, which can create **memory arbitration or execution instability**.
- Status: **Fix in open PR**

### 3. Iceberg build/link errors around Parquet writer dependencies
- PRs:  
  - https://github.com/facebookincubator/velox/pull/16867  
  - https://github.com/facebookincubator/velox/pull/16877  
- Severity: **Medium**
- Impact: Breaks or complicates builds in configurations where Iceberg and Parquet features interact.
- Status: **Open**

### 4. Optional GCS endpoint config causing runtime failures
- PR: **fix(gcs): Optional config hive.gcs.endpoint is accessed when not set**  
  https://github.com/facebookincubator/velox/pull/14104  
- Severity: **Medium**
- Impact: Could cause query or insert failures on GCS-backed workloads when optional config is absent.
- Status: **Merged**

### 5. Incorrect Parquet stats for infinity values
- PR: **Incorrect min max stats when the column value are infinity or -infinity**  
  https://github.com/facebookincubator/velox/pull/14603  
- Severity: **Medium**
- Impact: Could degrade **pruning correctness/interoperability** for files with extreme floating-point values.
- Status: **Merged**

Overall, the stability picture is positive: the surfaced bugs are mostly accompanied by concrete fixes or merged resolutions, especially in storage correctness and execution engine edge cases.

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### 1. Iceberg is a top-priority roadmap area
Evidence:
- https://github.com/facebookincubator/velox/pull/15581
- https://github.com/facebookincubator/velox/pull/15461
- https://github.com/facebookincubator/velox/pull/16060
- https://github.com/facebookincubator/velox/pull/16867
- https://github.com/facebookincubator/velox/pull/16877

Prediction: the next version is likely to further improve:
- **Iceberg write support**
- **partition transform coverage**
- **metadata/statistics compatibility**
- **connector modularity and build reliability**

#### 2. More SQL dialect parity work is coming
Evidence:
- **Presto type SQL formatting**  
  https://github.com/facebookincubator/velox/pull/16876
- **Spark approx_count_distinct_for_intervals**  
  https://github.com/facebookincubator/velox/pull/16595

Prediction: upcoming work likely includes:
- more **Spark-specific aggregates/functions**
- more **Presto SQL serialization and planner-facing utilities**
- continued type-system alignment across engines

#### 3. Execution-engine resilience remains active
Evidence:
- https://github.com/facebookincubator/velox/pull/16868
- https://github.com/facebookincubator/velox/pull/16774

Prediction: near-term changes will likely continue targeting:
- join correctness
- lazy vector/materialization behavior
- reclaim/memory arbitration interactions
- debug/runtime assertion cleanup

## 7. User Feedback Summary

There was **no direct issue-based user feedback recorded in the last 24 hours**, so sentiment must be inferred from the PR stream.

### Implied user pain points
- **Interoperability with Iceberg ecosystems** is a real need, especially around partitioning, statistics, and Parquet metadata correctness.
- **Spark compatibility** remains important, particularly for optimizer-visible semantics like approximate distinct counting over intervals.
- **Operational smoothness in heterogeneous storage backends** matters, as shown by the GCS config fix.
- **Reliability under complex join and memory scenarios** remains a practical concern for production users running large analytical workloads.

### Satisfaction signals
- A large batch of merged PRs with several production-facing fixes suggests maintainers are effectively addressing **correctness and compatibility pain points**.
- The move of utilities like Presto type SQL formatting into production code hints that users or downstream integrators increasingly need **stable reusable interfaces**, not just test-only helpers.

## 8. Backlog Watch

### Important open PRs needing maintainer attention

- **Spark SQL aggregate: approx_count_distinct_for_intervals**  
  https://github.com/facebookincubator/velox/pull/16595  
  Open since 2026-03-02. This looks strategically important for **Spark optimizer compatibility**, and lingering here may block backend completeness for Spark-based deployments.

- **Pre-load lazy probe input vectors before the non-reclaimable probe loop**  
  https://github.com/facebookincubator/velox/pull/16774  
  Given the memory arbitration implications, this deserves timely review.

- **IcebergParquetStatsCollector requires ParquetWriter**  
  https://github.com/facebookincubator/velox/pull/16867  
  Small build fixes like this often unblock downstream builds quickly and should be low-friction to land.

- **Fix missing parquet writer link in iceberg splitreader CMake**  
  https://github.com/facebookincubator/velox/pull/16877  
  Closely related to the above; likely worth consolidating or resolving promptly to reduce churn in Iceberg build logic.

- **Add toPrestoTypeSql() for Presto SQL type formatting**  
  https://github.com/facebookincubator/velox/pull/16876  
  This may become foundational utility code if more planner/runtime components need dialect-aware type rendering.

### Stale/closed work worth noting
Several older Iceberg PRs were closed after long dormancy:
- https://github.com/facebookincubator/velox/pull/13874
- https://github.com/facebookincubator/velox/pull/14518
- https://github.com/facebookincubator/velox/pull/14146
- https://github.com/facebookincubator/velox/pull/14147

This is not necessarily negative; in context, it more likely means the project is **consolidating Iceberg work into newer merged PRs** rather than abandoning the area. Still, maintainers should ensure any remaining unmerged functionality from those branches has a clear successor path.

---

## Bottom line

Velox had a **strong integration day** centered on **Iceberg maturation, engine stability fixes, and SQL compatibility expansion**. The lack of new issues and releases makes this look like an internal progress-and-hardening cycle rather than a user-escalation day. The clearest roadmap signal is continued investment in **Iceberg as a first-class analytical table format**, with parallel work on **Spark/Presto compatibility** and **robust execution behavior under edge conditions**.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-22

## 1. Today's Overview

Apache Gluten showed **moderate but meaningful engineering activity** over the last 24 hours: 3 issues were updated and 6 PRs saw movement, with **2 PRs closed and 1 issue closed**. The main theme today is **test correctness and SQL correctness hardening**, especially around Spark 4.0/4.1 test infrastructure and `collect_list` behavior on the Velox backend. There were **no new releases**, so current momentum appears focused on stabilizing internals rather than packaging a new version. Overall project health looks **active and technically focused**, with maintainers addressing both **false-positive testing risks** and **real query result correctness bugs**.

---

## 3. Project Progress

### Merged/Closed PRs today

#### 1) Fix PlanStability test suites for Velox backend
- [PR #11799](https://github.com/apache/incubator-gluten/pull/11799) — **CLOSED**
- Theme: **test infrastructure correctness / backend validation**
- This change fixed a serious testing gap: some Spark 4.0/4.1 PlanStability suites were passing **without actually loading the Gluten plugin**, meaning they were validating vanilla Spark rather than Gluten execution.
- Technical impact:
  - Improves confidence in **query plan validation**
  - Reduces risk of **false regressions being missed**
  - Strengthens backend-specific verification for **Velox integration**

#### 2) Update sort elimination rules for Hash Aggregate
- [PR #9473](https://github.com/apache/incubator-gluten/pull/9473) — **CLOSED**
- Related issue: [Issue #8227](https://github.com/apache/incubator-gluten/issues/8227)
- Theme: **SQL correctness / aggregation semantics**
- This change refines optimizer behavior so sort elimination is only applied when converting from a sort aggregate to hash aggregate in cases where input ordering is not semantically required.
- Technical impact:
  - Advances **SQL compatibility**
  - Fixes a **query result mismatch** involving `collect_list` with `sort by`
  - Improves correctness of aggregation planning on the **Velox backend**

### Open PRs pushing current progress

#### 3) Replace incorrect test trait usage for Spark 4.0/4.1
- [PR #11800](https://github.com/apache/incubator-gluten/pull/11800) — **OPEN**
- Continues the effort to ensure test suites create a **Gluten-enabled SparkSession** instead of accidentally running on plain Spark.
- This is important for validating actual **offload behavior** and backend execution coverage.

#### 4) Add golden file comparison for PlanStability suites
- [PR #11805](https://github.com/apache/incubator-gluten/pull/11805) — **OPEN**
- Adds **Gluten-specific golden file comparison** to catch unexpected query plan changes.
- This signals a push toward stronger **regression detection** for plan generation and plugin behavior.

#### 5) Include missing Velox metric in Spark UI
- [PR #11709](https://github.com/apache/incubator-gluten/pull/11709) — **OPEN**
- Theme: **observability / performance diagnostics**
- Proposes adding `kPreloadSplitPrepareTimeNanos` into `kDataSourceAddSplitWallNanos`.
- This improves operator-level timing visibility, though it explicitly notes a **breaking UI metric change**.

---

## 4. Community Hot Topics

### 1) Tracking useful Velox PRs not yet upstreamed
- [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585) — 16 comments, 4 👍
- The most active thread today is a tracker for **Velox PRs contributed by the Gluten community but not yet merged upstream**.
- Underlying technical need:
  - Gluten depends heavily on Velox
  - Missing upstream merges create friction in **feature availability**, **maintenance burden**, and **rebase cost**
  - The project is trying to avoid carrying too many custom patches in `gluten/velox`
- Roadmap implication:
  - Upstream coordination with Velox remains a strategic dependency for Gluten’s backend evolution

### 2) `collect_list` correctness with ordered aggregation
- [Issue #8227](https://github.com/apache/incubator-gluten/issues/8227) — 13 comments
- [PR #9473](https://github.com/apache/incubator-gluten/pull/9473) — closed fix
- This bug drew sustained attention because it affects **query result correctness**, not just performance.
- Underlying technical need:
  - Better semantic handling of **order-sensitive aggregates**
  - Safer optimizer rules around **sort elimination**
  - More comprehensive aggregate-function regression coverage

### 3) OOM despite available memory
- [Issue #11747](https://github.com/apache/incubator-gluten/issues/11747) — active
- The issue reports an **OOM-like failure even when memory appears sufficient**, with a Velox runtime `INVALID_STATE` during `TableScan`.
- Underlying technical need:
  - Better memory accounting / memory-state diagnosis
  - Improved failure messaging for users
  - More robust scan operator memory handling under Velox

### 4) Collect-list test coverage remains open
- [PR #11526](https://github.com/apache/incubator-gluten/pull/11526) — open, stale
- This PR adds broad type and fallback coverage for `collect_list`.
- It aligns strongly with the correctness bug fixed in #9473, suggesting community demand for **deeper aggregate-function test coverage**.

---

## 5. Bugs & Stability

Ranked by severity:

### High severity

#### A) OOM reported even when memory is sufficient
- [Issue #11747](https://github.com/apache/incubator-gluten/issues/11747) — **OPEN**
- Backend: Velox
- Symptoms:
  - Runtime failure during `TableScan`
  - Error path suggests memory/state inconsistency rather than a straightforward out-of-memory condition
- Severity rationale:
  - Can block production queries
  - Hard to diagnose from user perspective
  - May indicate deeper memory lifecycle or operator-state issues
- Fix status:
  - **No linked fix PR in today’s data**

#### B) Result mismatch in `collect_list` when `sort by` is involved
- [Issue #8227](https://github.com/apache/incubator-gluten/issues/8227) — **CLOSED**
- Fix:
  - [PR #9473](https://github.com/apache/incubator-gluten/pull/9473)
- Severity rationale:
  - Direct **query correctness bug**
  - Impacts SQL semantics for order-sensitive aggregation
- Status:
  - Appears resolved via optimizer-rule tightening
  - Still worth monitoring for adjacent regressions until expanded tests land

### Medium severity

#### C) Tests falsely passed without Gluten plugin enabled
- [PR #11799](https://github.com/apache/incubator-gluten/pull/11799) — **CLOSED**
- [PR #11800](https://github.com/apache/incubator-gluten/pull/11800) — **OPEN**
- [PR #11805](https://github.com/apache/incubator-gluten/pull/11805) — **OPEN**
- Severity rationale:
  - Not a user-facing runtime crash, but a **serious quality risk**
  - Could allow backend regressions to slip through CI
- Status:
  - Core fix closed
  - Follow-up strengthening still in progress

### Low/medium severity

#### D) Metrics definition inconsistency in Spark UI
- [PR #11709](https://github.com/apache/incubator-gluten/pull/11709) — **OPEN**
- Severity rationale:
  - Affects observability rather than execution semantics
  - Important for performance analysis and operator cost attribution
- Notable caveat:
  - Introduces a **breaking change in displayed metric values**

---

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### 1) Better upstream Velox integration
- [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585)
- This is the clearest roadmap signal today.
- Expect continued work on:
  - Reducing divergence from upstream Velox
  - Landing Gluten-driven improvements into Velox first
  - Avoiding long-term maintenance of private patch stacks

#### 2) Stronger plan regression tooling
- [PR #11805](https://github.com/apache/incubator-gluten/pull/11805)
- Golden-file plan comparison suggests Gluten is investing in:
  - Stable query plan outputs
  - Easier detection of backend regressions
  - Safer support for Spark 4.0/4.1 evolution

#### 3) More complete aggregate-function correctness coverage
- [PR #11526](https://github.com/apache/incubator-gluten/pull/11526)
- User demand is less about new SQL functions today and more about making existing functions, especially `collect_list`, **fully correct across data types and fallback paths**.

#### 4) Better runtime metrics and operator observability
- [PR #11709](https://github.com/apache/incubator-gluten/pull/11709)
- This points toward ongoing investment in:
  - Scan-path performance instrumentation
  - Better Spark UI integration
  - Tighter visibility into Velox execution overheads

### Likely candidates for the next version
Based on current activity, the next release is likely to include:
- Spark 4.0/4.1 **test and plan-stability improvements**
- `collect_list` / ordered aggregate **correctness fixes**
- Velox runtime and metric **observability enhancements**
- Possibly more backend-alignment work driven by **upstream Velox dependency management**

---

## 7. User Feedback Summary

Current user pain points are fairly clear:

### 1) Correctness matters more than raw speed in current discussions
- The `collect_list` issue shows users are sensitive to **SQL semantic mismatches**, especially when ordering clauses are involved.
- For an analytical engine, wrong answers are a much bigger problem than slower answers.

### 2) Memory failures remain difficult to trust and diagnose
- [Issue #11747](https://github.com/apache/incubator-gluten/issues/11747)
- The complaint “OOM but memory is enough” reflects a common production concern:
  - users need clearer memory diagnostics
  - failures that look inconsistent undermine trust in backend stability

### 3) Users need confidence that Gluten-specific behavior is actually being tested
- The PlanStability fixes show an internal but important form of user feedback:
  - maintainers recognized tests were not exercising real Gluten execution
  - this directly affects confidence in compatibility claims and regression safety

### 4) Metrics fidelity is important for performance users
- [PR #11709](https://github.com/apache/incubator-gluten/pull/11709)
- Users running performance-sensitive workloads want Spark UI metrics to reflect the **true cost of split preparation and scan setup**.

Overall, feedback signals a user base focused on:
- **correct results**
- **predictable memory behavior**
- **trustworthy observability**
- **reliable backend-specific validation**

---

## 8. Backlog Watch

### Needs maintainer attention

#### 1) Stale but strategically relevant aggregate test expansion
- [PR #11526](https://github.com/apache/incubator-gluten/pull/11526) — **OPEN, stale**
- Why it matters:
  - Directly related to a correctness area that just produced a closed bug/fix cycle
  - Expanded coverage could prevent future regressions in `collect_list`
- Recommended attention:
  - Review and merge or clearly scope remaining blockers

#### 2) Velox upstream-tracking issue remains active
- [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585) — **OPEN**
- Why it matters:
  - Not a typical bug, but strategically important for reducing integration drag
  - High comment volume indicates ongoing relevance
- Recommended attention:
  - Maintain visibility and convert key tracked PRs into actionable milestones where possible

#### 3) Memory-state/OOM anomaly lacks an associated fix
- [Issue #11747](https://github.com/apache/incubator-gluten/issues/11747) — **OPEN**
- Why it matters:
  - Potential production stability issue
  - Limited discussion so far suggests it may need triage help or reproducer refinement
- Recommended attention:
  - Prioritize triage, reproduction steps, and root-cause classification

#### 4) Test-infrastructure follow-up still incomplete
- [PR #11800](https://github.com/apache/incubator-gluten/pull/11800) — **OPEN**
- [PR #11805](https://github.com/apache/incubator-gluten/pull/11805) — **OPEN**
- Why it matters:
  - The core bug is understood, but full hardening is not yet complete
  - Until follow-ups merge, some regression-detection gaps may remain

---

## Overall Health Assessment

Apache Gluten appears **healthy and actively maintained**, with current work concentrated on **correctness, testing integrity, and backend observability** rather than new end-user features. Today’s most significant progress is the closure of a **real SQL correctness bug** and the continued cleanup of **misconfigured test suites** that could have masked regressions. The biggest near-term risks are **Velox-related memory stability** and the operational burden of depending on **upstream Velox merges**.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-22

## 1. Today’s Overview

Apache Arrow showed **moderate maintenance activity** over the last 24 hours: **19 issues updated**, **3 PRs updated**, and **no new releases**. The activity mix was tilted toward **backlog grooming and stale issue churn**, with many older enhancement tickets being touched or closed, while a smaller set of current work focused on **Ruby file-format support**, **Apple clang build compatibility**, and **ORC dataset pushdown infrastructure**. Overall, project health looks **stable but maintenance-heavy** rather than release-driven today. The strongest forward-looking signals are around **storage-engine pruning/predicate pushdown**, **developer ergonomics**, and **cross-platform build reliability**.

## 3. Project Progress

### Closed / merged work advancing the project

#### 1) Ruby reader benchmarking landed
- **PR:** [#49545](https://github.com/apache/arrow/pull/49545) — `GH-49544: [Ruby] Add benchmark for readers`
- **Related issue:** [#49544](https://github.com/apache/arrow/issues/49544)

This was the clearest concrete progress item today. The merged Ruby work adds benchmarks for **file and streaming readers**, plus support for **`mmap` in streaming reader** paths. While this is not a query-engine feature in the SQL sense, it is directly relevant to Arrow’s analytical-storage role: it improves the project’s ability to **measure reader performance regressions**, compare I/O paths, and optimize ingestion/read throughput for file-based analytics workflows.

**Why it matters technically**
- Better benchmarking is a prerequisite for **storage read-path optimization**.
- `mmap` support in the reader benchmark path helps evaluate **zero-copy / low-overhead access patterns**, important for columnar analytics.
- This is especially useful for downstream engines and bindings that rely on Arrow as a **high-performance interchange and file access layer**.

### Related roadmap progress visible in active issues/PRs

#### 2) ORC predicate pushdown infrastructure is moving
- **Issue:** [#49361](https://github.com/apache/arrow/issues/49361) — `[C++][Dataset] Add OrcFileFragment with stripe filtering and predicate pushdown`

This open issue is strategically important for Arrow’s dataset layer. It proposes an `OrcFileFragment` analogous to Parquet’s fragment abstraction, allowing **ORC stripe statistics** to participate in Arrow’s expression evaluation and **skip stripes at scan time**.

**Analytical engine significance**
- Advances **storage pruning** and **scan-time optimization**
- Improves Arrow Dataset’s competitiveness as a **lakehouse scan layer**
- Brings ORC closer to Parquet in terms of **predicate pushdown capabilities**

#### 3) Apple clang compatibility fix is close
- **PR:** [#49570](https://github.com/apache/arrow/pull/49570) — `[CI][Python][C++] Add check targetting Apple clang on deciding whether to use std::bit_width or std::log2p1`

This open PR addresses a compile failure on Homebrew LLVM / Apple-oriented toolchains. It is a **build-system and portability fix**, not a user-facing feature, but important for keeping Arrow healthy on macOS development environments widely used by data engineers and contributors.

## 4. Community Hot Topics

### Most discussed and visible items

#### [#45722](https://github.com/apache/arrow/issues/45722) — `[C++] StructBuilder should have UnsafeAppend methods`
- **Comments:** 15

This was the most actively discussed current issue. The request is to add:
- `UnsafeAppend()`
- `UnsafeAppendNull()`
- `UnsafeAppendNulls(int64_t length)`

to `StructBuilder`.

**Underlying technical need**
This is a clear signal from performance-sensitive users building nested arrays at scale. Arrow already exposes unsafe append paths in other builders to avoid repeated bounds/capacity checks when the caller has pre-reserved space. Missing parity in `StructBuilder` becomes a bottleneck for **high-throughput nested data construction**, especially for ingestion pipelines, execution engines, and serializers generating struct-heavy schemas.

**Why it matters**
- Improves **builder API consistency**
- Reduces overhead in **nested column construction**
- Likely valuable to engine developers and ETL pipelines working with semi-structured data

---

#### [#31466](https://github.com/apache/arrow/issues/31466) — `[C++] Option for match_substring* to return false on NULL input`
- **Comments:** 4

This older enhancement remains relevant because it touches **expression semantics** and **null handling behavior**. The request is effectively about making substring matching optionally behave as false rather than null when input is null.

**Underlying technical need**
Users want semantics that align better with practical filtering needs in analytics and data-frame workflows. This kind of request often emerges when users bridge Arrow compute with systems that favor **two-valued logic in filters** or have established convenience semantics in higher-level bindings like R.

---

#### [#31459](https://github.com/apache/arrow/issues/31459) — `[Doc][C++][Python] Building on M1 with conda and "-DARROW_JEMALLOC=OFF"`
- **Comments:** 4

This documentation issue remains active because macOS ARM + conda builds continue to be a real onboarding pain point.

**Underlying technical need**
The community still needs clearer guidance on **non-default build matrix combinations**, especially around M1/M2, conda environments, and allocator settings. Build friction directly affects contributor velocity and downstream packaging reliability.

---

#### [#31455](https://github.com/apache/arrow/issues/31455) — `[C++] Substrait SinkNode Modification for usability`
- **Comments:** 3

This is a notable query-engine integration topic. It suggests improving how Substrait execution captures results so that more `SinkNode` variants can be used naturally.

**Underlying technical need**
Users integrating Arrow Acero/Substrait want more flexible terminal-node behavior in execution plans. This points to demand for **better composability in Arrow’s streaming execution engine**, important for embedding Arrow execution into larger analytical runtimes.

---

#### [#48959](https://github.com/apache/arrow/issues/48959) — `[Python] A "personal data" boolean in field metadata`
- **Comments:** 2

This newer request is noteworthy despite low discussion volume because it reflects a growing trend: attaching **governance and compliance metadata** to schemas.

**Underlying technical need**
Users increasingly need Arrow schemas to carry lightweight privacy semantics that can survive across system boundaries. This is less about compute correctness and more about **data governance interoperability**.

## 5. Bugs & Stability

No major runtime crash or data-corruption report surfaced in today’s visible updates, but several **stability and correctness-adjacent** items deserve attention.

### Ranked by severity

#### High: Cross-platform build failure on Apple/Homebrew clang
- **PR:** [#49570](https://github.com/apache/arrow/pull/49570)

This appears to address a real compile regression/failure involving selection between `std::bit_width` and fallback logic. Build failures on mainstream macOS toolchains are high severity for contributors and package maintainers because they block adoption and CI reliability.

**Fix status:** Open PR, marked **awaiting merge**

---

#### Medium: Potential semantic mismatch in null handling for substring matching
- **Issue:** [#31466](https://github.com/apache/arrow/issues/31466)

This is not a crash, but can become a **query correctness / user expectation** issue depending on how filters are composed in compute kernels and higher-level language bindings.

**Fix status:** No active linked fix in today’s data

---

#### Medium: M1 + conda build/documentation failure mode
- **Issue:** [#31459](https://github.com/apache/arrow/issues/31459)

This is primarily a documentation/build usability problem, but repeated failure to document such cases tends to generate recurring support burden and hidden contributor churn.

**Fix status:** No active PR visible in today’s data

---

#### Medium-Low: Python Flight RPC error classification
- **Issue:** [#31444](https://github.com/apache/arrow/issues/31444)

The inability to distinguish intentional server-side exceptions from accidental ones affects **operability, debugging, and production observability** in Flight deployments.

**Fix status:** No visible fix PR in today’s data

---

#### Low but important for performance validation: Ruby reader benchmarks
- **Issue:** [#49544](https://github.com/apache/arrow/issues/49544)
- **PR:** [#49545](https://github.com/apache/arrow/pull/49545)

Not a bug fix directly, but benchmark coverage reduces the risk of unnoticed performance regressions in file and streaming readers.

## 6. Feature Requests & Roadmap Signals

### Strongest roadmap signals from current activity

#### ORC predicate pushdown in Dataset
- **Issue:** [#49361](https://github.com/apache/arrow/issues/49361)

This is the most important roadmap signal for analytical storage engines today. Adding ORC stripe filtering and predicate pushdown would materially improve Arrow’s role as a **scan optimizer over data lakes**. This is exactly the kind of feature likely to matter to OLAP and federated query engines.

**Prediction:** Good candidate for inclusion in a forthcoming release if implementation lands cleanly, because it has clear performance value and aligns with Arrow Dataset architecture.

---

#### StructBuilder unsafe append APIs
- **Issue:** [#45722](https://github.com/apache/arrow/issues/45722)

This enhancement fits Arrow’s long-standing emphasis on **high-performance memory construction primitives**.

**Prediction:** Also plausible for a near-term release, especially since it is tagged **good-first-issue** but addresses a meaningful performance gap.

---

#### Footer custom metadata in Ruby / GLib
- **Issue:** [#49576](https://github.com/apache/arrow/issues/49576)
- **PR:** [#49577](https://github.com/apache/arrow/pull/49577)

This extends file-format metadata access into Ruby and GLib bindings.

**Prediction:** Likely to merge soon because there is already an implementation PR and the scope appears contained.

---

#### Schema-level personal-data annotation
- **Issue:** [#48959](https://github.com/apache/arrow/issues/48959)

This is an interesting governance-oriented feature request. It may not become a standardized Arrow feature quickly, but it reflects demand for richer metadata conventions.

**Prediction:** More likely to emerge first as **convention/documentation/binding-level support** than as core format-level standardization.

---

#### Substrait sink usability improvements
- **Issue:** [#31455](https://github.com/apache/arrow/issues/31455)

This suggests continued interest in Arrow as an embedded execution runtime, not just a format library.

**Prediction:** Worth watching, but backlog age suggests slower movement unless tied to broader Substrait execution work.

## 7. User Feedback Summary

Today’s issue mix reveals several recurring user pain points:

### 1) Performance-sensitive users want lower-level construction APIs
- Evidence: [#45722](https://github.com/apache/arrow/issues/45722)
- Users building nested data structures care about **avoiding overhead in append paths**.
- This is typical of engine authors, converters, and bulk-ingestion pipelines.

### 2) Build and toolchain compatibility remains a real friction point
- Evidence: [#31459](https://github.com/apache/arrow/issues/31459), [#49570](https://github.com/apache/arrow/pull/49570)
- macOS ARM, conda, Apple clang, and mixed toolchain environments continue to generate user pain.
- This affects both contributors and downstream package builders.

### 3) Users want more predictable semantics in compute APIs
- Evidence: [#31466](https://github.com/apache/arrow/issues/31466), [#31453](https://github.com/apache/arrow/issues/31453)
- There is demand for behavior that aligns more closely with **host-language expectations** and practical filtering workflows, especially around nulls and text matching.

### 4) Governance metadata is becoming a real use case
- Evidence: [#48959](https://github.com/apache/arrow/issues/48959)
- Users increasingly want Arrow schemas to carry **business/regulatory annotations**, not just physical types.

### 5) Ecosystem bindings still need parity with core format features
- Evidence: [#49576](https://github.com/apache/arrow/issues/49576), [#49577](https://github.com/apache/arrow/pull/49577)
- The Ruby/GLib work indicates users expect binding layers to expose **the same metadata and file-format capabilities** available in core implementations.

## 8. Backlog Watch

These are long-standing items that look important enough to merit maintainer attention:

### [#31466](https://github.com/apache/arrow/issues/31466) — `match_substring*` null-input behavior
- Open since **2022-03-28**
- Relevance: touches **compute semantics and filter behavior**
- Risk: inconsistent expectations across bindings and analytical contexts

### [#31455](https://github.com/apache/arrow/issues/31455) — Substrait SinkNode usability
- Open since **2022-03-26**
- Relevance: execution-plan composability and **Substrait integration ergonomics**
- Risk: limits practical use of Arrow’s execution engine in embedded query scenarios

### [#31459](https://github.com/apache/arrow/issues/31459) — M1/conda build docs
- Open since **2022-03-28**
- Relevance: contributor onboarding and platform support clarity
- Risk: recurring build failures without canonical documentation

### [#31444](https://github.com/apache/arrow/issues/31444) — Flight RPC intentional vs unintentional error handling
- Open since **2022-03-24**
- Relevance: production observability in Flight services
- Risk: operational ambiguity and weaker debugging signals

### [#20166](https://github.com/apache/arrow/issues/20166) — Windows timezone DB path via environment variable
- Open since **2022-03-24**
- Relevance: platform-specific deployment usability
- Risk: avoidable friction for Windows users handling timezone support

### [#31450](https://github.com/apache/arrow/issues/31450) — R schema method for `arrow_dplyr_query`
- Open since **2022-03-25**
- Relevance: query introspection and developer ergonomics in R
- Risk: weaker usability for schema-aware analytical workflows

---

## Overall Health Signal

Apache Arrow appears **stable and actively maintained**, but today’s snapshot is dominated by **backlog maintenance and incremental improvements** rather than major new capabilities or releases. The most strategically important forward work is **ORC predicate pushdown**, while the most immediate practical wins are **Ruby metadata/benchmarking improvements** and **Apple clang build compatibility fixes**. For OLAP and analytical storage engine observers, Arrow’s direction remains consistent: **better scan-time optimization, stronger low-level performance primitives, and improved ecosystem parity across bindings**.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*