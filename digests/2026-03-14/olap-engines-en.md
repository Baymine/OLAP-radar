# Apache Doris Ecosystem Digest 2026-03-14

> Issues: 5 | PRs: 134 | Projects covered: 10 | Generated: 2026-03-14 01:15 UTC

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

# Apache Doris Project Digest — 2026-03-14

## 1. Today's Overview

Apache Doris remained highly active over the last 24 hours, with **134 pull requests updated** and **5 issues updated**, indicating strong ongoing engineering throughput despite no new release cut today. The balance of **69 merged/closed vs. 65 open PRs** suggests the project is moving work steadily through review and integration, especially around query execution, search semantics, file cache behavior, and cloud/external data integrations. Current activity shows a clear emphasis on **engine correctness, branch backports, connector evolution, and analytical SQL feature expansion**. Overall, project health appears strong on development velocity, though several older user-facing issues around **performance, Nereids correctness, and external catalog interoperability** remain unresolved.

---

## 2. Project Progress

### Merged / Closed PRs advancing the engine

#### Query engine and SQL capabilities
- **ASOF JOIN support merged and backported**
  - Main PR: [#59591](https://github.com/apache/doris/pull/59591)
  - Branch picks: [#61321](https://github.com/apache/doris/pull/61321), [#61320](https://github.com/apache/doris/pull/61320)
  - Impact: This is one of the most important analytical SQL additions in the current stream. ASOF joins are valuable for time-series, market data, observability, and event correlation workloads, and signal Doris is continuing to improve its support for non-trivial analytical join semantics.

- **Nereids optimizer refinement for SUM rewrite**
  - Main PR: [#61224](https://github.com/apache/doris/pull/61224)
  - Backport: [#61308](https://github.com/apache/doris/pull/61308)
  - Impact: Removes redundant widening integer casts in `SumLiteralRewrite`, improving execution efficiency and reducing unnecessary type inflation. This is a small but meaningful optimizer correctness/performance improvement in the Nereids planner.

#### Search / inverted index correctness
- **Fix for MUST_NOT search semantics with NULL rows**
  - Main PR: [#61200](https://github.com/apache/doris/pull/61200)
  - Backports: [#61322](https://github.com/apache/doris/pull/61322), [#61323](https://github.com/apache/doris/pull/61323)
  - Impact: Fixes a correctness bug where `search('NOT msg:omega')` could incorrectly include NULL rows. This is a significant fix for users relying on inverted index search predicates and confirms active maintenance of search semantics across stable branches.

#### Storage / cache stability
- **File cache self-healing improvement**
  - PR: [#61205](https://github.com/apache/doris/pull/61205)
  - Impact: Addresses a restart-window inconsistency where metadata could mark blocks as downloaded although local cache files were missing. The self-heal behavior improves resilience and reduces read failures in file cache scenarios—important for cloud/disaggregated storage usage.

#### Export / data portability
- **Native export format support merged**
  - Main PR: [#58711](https://github.com/apache/doris/pull/58711)
  - Branch cherry-pick: [#61286](https://github.com/apache/doris/pull/61286)
  - Impact: Native format export is a strategic feature for backup, high-throughput data movement, and Doris-to-Doris or engine-adjacent interoperability workflows.

#### Tooling / contributor experience
- **Fix VSCode Java Language Server initialization issue**
  - PR: [#61265](https://github.com/apache/doris/pull/61265)
  - Impact: While not user-facing at query runtime, this reduces contributor friction and should improve developer productivity for FE contributors using Maven + VSCode tooling.

#### PRs closed as stale
- **Profile bug fix PR closed stale**: [#54042](https://github.com/apache/doris/pull/54042)
- **Paimon split performance optimization PR closed stale**: [#55600](https://github.com/apache/doris/pull/55600)
- **Routine Load Amazon Kinesis draft closed**: [#60051](https://github.com/apache/doris/pull/60051)

These stale closures are a mixed signal: they keep backlog cleaner, but at least one item—Paimon split planning performance—still reflects a relevant need for external lakehouse workloads.

---

## 3. Community Hot Topics

### Most discussed / visible items

#### 1) Release note for Doris 3.0.0
- Issue: [#37502](https://github.com/apache/doris/issues/37502)
- Signals: **7 comments, 13 reactions**
- Why it matters: This remains the most visible issue in the current update list and highlights strong community attention to the **3.0.0 milestone**, especially the **compute-storage decoupled architecture**.
- Technical need behind it: Users are tracking Doris not just as a tightly coupled MPP database, but increasingly as a **cloud-native analytical engine** where compute isolation, elastic scale, and storage separation matter.

#### 2) JDBC scan path unification
- PR: [#61141](https://github.com/apache/doris/pull/61141)
- Compatibility/testing companion: [#61206](https://github.com/apache/doris/pull/61206)
- Why it matters: Refactoring JDBC scanning into the unified `FileQueryScanNode/JniReader` framework is a substantial architectural signal.
- Technical need behind it: Doris is trying to **reduce duplicated connector execution paths**, likely improving maintainability, optimization consistency, and future pushdown/runtime reuse across external sources.

#### 3) Single-node query performance complaint
- Issue: [#26097](https://github.com/apache/doris/issues/26097)
- Why it matters: Although marked stale, it was updated today and reflects persistent user perception issues around **out-of-box performance on small deployments**.
- Technical need behind it: Better sizing guidance, profiling defaults, and troubleshooting visibility for low-scale or standalone use cases.

#### 4) Nereids result-field mismatch
- Issue: [#27993](https://github.com/apache/doris/issues/27993)
- Why it matters: This is a planner correctness concern, not just performance.
- Technical need behind it: Users need the newer Nereids planner to be fully result-compatible with the legacy planner before adopting it broadly in production.

#### 5) Nessie REST catalog with Iceberg can list metadata but cannot query data
- Issue: [#61191](https://github.com/apache/doris/issues/61191)
- Why it matters: A fresh issue involving **Doris 4.0.3** and modern lakehouse interoperability.
- Technical need behind it: Stronger Iceberg/Nessie external table compatibility, especially for REST-catalog deployments.

---

## 4. Bugs & Stability

Ranked by likely user impact and severity from the current data.

### High severity

#### 1) Query correctness bug in search NOT semantics with NULLs — fixed
- Fixed by: [#61200](https://github.com/apache/doris/pull/61200)
- Backports: [#61322](https://github.com/apache/doris/pull/61322), [#61323](https://github.com/apache/doris/pull/61323)
- Severity: **High**
- Why: Incorrect filtering semantics can silently return wrong analytical results, which is among the most serious database failure modes.
- Status: Good response from maintainers; already merged and backported.

#### 2) Nereids result-field mismatch vs legacy planner — still open
- Issue: [#27993](https://github.com/apache/doris/issues/27993)
- Severity: **High**
- Why: Planner differences that alter output fields undermine trust in the new optimizer and block migration.
- Fix PR status: No direct fix linked in today’s dataset.

### Medium severity

#### 3) Iceberg + Nessie REST catalog can browse but not query data
- Issue: [#61191](https://github.com/apache/doris/issues/61191)
- Severity: **Medium-High**
- Why: External metadata visibility without queryability breaks a core interoperability scenario for lakehouse users.
- Fix PR status: No matching fix PR visible in today’s list.

#### 4) File cache stale DOWNLOADED state after restart — fixed
- PR: [#61205](https://github.com/apache/doris/pull/61205)
- Severity: **Medium**
- Why: Could produce local read failures in certain restart windows; especially important in environments using file cache heavily.
- Status: Fixed.

### Lower severity / chronic usability issues

#### 5) Single-node Doris queries extremely slow
- Issue: [#26097](https://github.com/apache/doris/issues/26097)
- Severity: **Medium**, but context-dependent
- Why: The report is sparse, but it highlights recurring pain in deployment tuning, likely around schema, indexing, configuration, or execution environment.

#### 6) “many case when” SQL is slow — closed stale
- Issue: [#55641](https://github.com/apache/doris/issues/55641)
- Severity: **Low-Medium**
- Why: Performance issue may still be real, but the issue lacks actionable detail and was closed stale.

---

## 5. Feature Requests & Roadmap Signals

Today’s PR stream gives several strong hints about where Doris is heading.

### Likely near-term product directions

#### External data source unification
- PR: [#61141](https://github.com/apache/doris/pull/61141)
- Signal: JDBC is being moved onto shared scan infrastructure.
- Prediction: Expect more **connector convergence**, better pushdown consistency, and lower maintenance overhead across JDBC/file/external readers in upcoming versions.

#### More lakehouse and cloud ingestion support
- Routine Load IAM auth for AWS MSK: [#61324](https://github.com/apache/doris/pull/61324)
- External table condition cache: [#60897](https://github.com/apache/doris/pull/60897)
- Signal: Doris is investing in **cloud-managed Kafka**, external-table acceleration, and cloud-native auth models.
- Prediction: These are strong candidates for upcoming 4.x line improvements.

#### SQL surface expansion
- Aggregate function `entropy`: [#60833](https://github.com/apache/doris/pull/60833)
- `SPLIT_BY_STRING` with `limit`: [#60892](https://github.com/apache/doris/pull/60892)
- BM25 scoring in inverted index query_v2: [#59847](https://github.com/apache/doris/pull/59847)
- Signal: Doris continues to add both **analytics functions** and **search-oriented SQL capabilities**.
- Prediction: Expect the next versions to emphasize richer built-ins for data science, text/search analytics, and compatibility with user expectations from other SQL engines.

#### Resource governance and memory control
- Username-based workload policy: [#60559](https://github.com/apache/doris/pull/60559)
- Multi-level partition spilling: [#61212](https://github.com/apache/doris/pull/61212)
- Cloud FE memory reduction: [#61318](https://github.com/apache/doris/pull/61318)
- Signal: The project is clearly prioritizing **predictable resource isolation** and **graceful degradation under memory pressure**.
- Prediction: These are foundational for larger multi-tenant and cloud deployments, so they are likely to land in an upcoming minor release.

#### Data portability / native ecosystem tooling
- Native export format: [#58711](https://github.com/apache/doris/pull/58711)
- Signal: Doris wants stronger native movement/export workflows, possibly laying groundwork for faster backup, replication, or migration paths.

---

## 6. User Feedback Summary

### Main user pain points observed

#### 1) Performance expectations on small deployments
- Issue: [#26097](https://github.com/apache/doris/issues/26097)
- Users still expect strong responsiveness even in single-node setups with modest data sizes. This suggests Doris may need clearer best-practice guidance for standalone deployments and better diagnostics for unexpectedly slow queries.

#### 2) Planner trust and migration confidence
- Issue: [#27993](https://github.com/apache/doris/issues/27993)
- Users care not only about Nereids performance, but also whether it preserves output semantics exactly. Compatibility with legacy behavior remains a prerequisite for broader planner adoption.

#### 3) Modern lakehouse interoperability
- Issue: [#61191](https://github.com/apache/doris/issues/61191)
- Users are actively connecting Doris to Iceberg via Nessie REST catalogs. The issue indicates metadata integration is not enough; production users expect full queryability and compatibility.

#### 4) Demand for cloud-native ingestion and security models
- PR: [#61324](https://github.com/apache/doris/pull/61324)
- Support for AWS MSK IAM authentication reflects practical enterprise demand: users want Doris to fit managed cloud streaming platforms without custom credential workarounds.

#### 5) Search and hybrid analytical retrieval correctness
- PR: [#61200](https://github.com/apache/doris/pull/61200)
- The rapid fix/backport path here suggests users are using Doris search features seriously enough that subtle boolean/NULL semantics matter in production.

---

## 7. Backlog Watch

These items appear to deserve maintainer attention because they are either old, user-impacting, or strategically important.

### Open issues

- **Nereids result mismatch issue remains open since 2023**
  - [#27993](https://github.com/apache/doris/issues/27993)
  - Why watch: Long-lived correctness concerns in the new planner can slow migration and damage confidence.

- **Single-node severe slowness issue still open/stale**
  - [#26097](https://github.com/apache/doris/issues/26097)
  - Why watch: Even if user details are incomplete, such reports often indicate onboarding friction or poor default observability.

- **Release note issue for 3.0.0 still active**
  - [#37502](https://github.com/apache/doris/issues/37502)
  - Why watch: High community attention; useful as a proxy for how the project communicates major architectural changes such as compute-storage decoupling.

- **Nessie REST + Iceberg query failure**
  - [#61191](https://github.com/apache/doris/issues/61191)
  - Why watch: Fresh issue, likely important to lakehouse adoption in Doris 4.x.

### Open PRs needing review or resolution

- **JDBC scan unification**
  - [#61141](https://github.com/apache/doris/pull/61141)
  - Why watch: Significant connector architecture change with likely broad impact.

- **Condition cache for external tables**
  - [#60897](https://github.com/apache/doris/pull/60897)
  - Why watch: Potentially valuable for repeated external queries, but marked `lfs-detected!`, which may slow merge readiness.

- **Multi-level spill repartition**
  - [#61212](https://github.com/apache/doris/pull/61212)
  - Why watch: Important for memory-bound joins/aggregations and large-scale workloads.

- **2Q-LRU / segmented file cache**
  - [#57410](https://github.com/apache/doris/pull/57410)
  - Why watch: Old but strategically useful for protecting hot data under scan-heavy workloads.

- **BM25 scoring in inverted index query_v2**
  - [#59847](https://github.com/apache/doris/pull/59847)
  - Why watch: Could materially improve Doris’s hybrid search + analytics story.

---

## 8. Overall Health Assessment

Apache Doris shows **strong engineering momentum** today, especially in branch maintenance and feature integration for the 4.x line. The most meaningful progress areas are **advanced SQL joins, search correctness, native export, optimizer polish, and cloud/external ecosystem support**. The main risk areas are not release cadence, but rather **long-tail correctness and interoperability issues**—especially around **Nereids** and **modern lakehouse connectors**. In short: Doris looks healthy and fast-moving, with a clear roadmap toward a more cloud-native, connector-rich, and hybrid analytical engine, but still needs continued attention on planner trust and external compatibility.

---

## Key Links

- Release notes issue: [#37502](https://github.com/apache/doris/issues/37502)
- Single-node slowness: [#26097](https://github.com/apache/doris/issues/26097)
- Nereids mismatch bug: [#27993](https://github.com/apache/doris/issues/27993)
- Nessie/Iceberg query issue: [#61191](https://github.com/apache/doris/issues/61191)
- JDBC unification: [#61141](https://github.com/apache/doris/pull/61141)
- Search NULL/MUST_NOT fix: [#61200](https://github.com/apache/doris/pull/61200)
- Native export format: [#58711](https://github.com/apache/doris/pull/58711)
- ASOF join: [#59591](https://github.com/apache/doris/pull/59591)
- Multi-level spilling: [#61212](https://github.com/apache/doris/pull/61212)
- RoutineLoad IAM auth: [#61324](https://github.com/apache/doris/pull/61324)

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-14

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains extremely active, with most major projects simultaneously advancing **cloud-native storage**, **lakehouse interoperability**, **SQL correctness**, and **operational governance**. A clear pattern across engines is that innovation is no longer limited to raw scan speed: communities are investing heavily in **connector quality, planner correctness, object-store efficiency, and enterprise control-plane features**. Another strong signal is ecosystem convergence around **Iceberg/Delta/Parquet**, **disaggregated or external storage**, and **hybrid search + analytics** use cases. Overall, the landscape is healthy, but many projects are balancing aggressive feature delivery with stabilization pressure from recent releases or major architectural transitions.

---

## 2. Activity Comparison

### 24h Community Activity Snapshot

| Engine | Issues Updated | PRs Updated | Release Today | Health Score* | Key Current State |
|---|---:|---:|---|---:|---|
| **Apache Doris** | 5 | 134 | No | **8.8/10** | Strong feature velocity, active backports, some long-tail correctness/interoperability debt |
| **ClickHouse** | 37 | 265 | No | **8.6/10** | Very high throughput, but meaningful 26.2 regression/stability pressure |
| **DuckDB** | 16 | 41 | No | **8.3/10** | Healthy velocity, post-1.5.0 stabilization, especially S3/Parquet and planner regressions |
| **StarRocks** | 8 | 103 | No | **8.5/10** | Strong multi-branch maintenance, optimizer and lakehouse focus, enterprise auth issues to watch |
| **Apache Iceberg** | 13 | 50 | No | **8.1/10** | Healthy standards/storage evolution, but several operational semantics bugs remain important |
| **Delta Lake** | 0 | 33 | No | **8.2/10** | Engineering-led progress, DSv2 and UC correctness focus, low visible user issue churn today |
| **Databend** | 3 | 9 | No | **7.9/10** | Smaller volume but coherent execution/planner progress and metadata refactoring |
| **Velox** | 6 | 47 | No | **8.0/10** | Strong infra/GPU/connector progress, some correctness and backlog risks |
| **Apache Gluten** | 5 | 29 | No | **8.0/10** | Healthy backend integration work, Spark 4.x compatibility and correctness still central |
| **Apache Arrow** | 27 | 17 | No | **8.1/10** | Solid maintenance pace, packaging/CI/Gandiva hardening, less headline engine work |

\*Health score is a qualitative assessment based on visible velocity, merge responsiveness, backlog risk, correctness/stability signals, and release-engineering posture from the digest.

### Readout
- **Most active by raw PR volume:** ClickHouse, Doris, StarRocks.
- **Most stabilization-heavy today:** ClickHouse, DuckDB, Arrow.
- **Most architecture/interop-focused:** Doris, StarRocks, Iceberg, Delta.
- **Most specialized infrastructure-layer projects:** Velox, Arrow, Gluten.

---

## 3. Apache Doris's Position

### Where Doris is strong versus peers
Apache Doris is in a strong position as a **full-stack analytical database** that is simultaneously expanding **core SQL**, **search**, **cloud-native storage behavior**, and **external data access**. Compared with peers, Doris shows an unusually balanced mix of work across:
- **Analytical SQL surface**: e.g. `ASOF JOIN`
- **Hybrid search + analytics**: inverted index correctness, BM25 in progress
- **Cloud/disaggregated storage hardening**: file cache self-healing
- **Connector convergence**: JDBC scan path unification
- **Operational features**: workload policy, spilling, FE memory reduction

This is broader than engines that are more narrowly focused on either:
- pure execution/storage internals (Velox, Arrow),
- embedded analytics (DuckDB),
- format/table-layer standards (Iceberg, Delta),
- or ultra-high-throughput OLAP with heavier current regression pressure (ClickHouse).

### Technical approach differences
Doris differs from several peers in that it is pursuing a **single integrated MPP database platform** with:
- its own query engine and optimizer,
- internal storage plus external table access,
- search/inverted-index semantics,
- growing cloud-native/disaggregated architecture.

By contrast:
- **ClickHouse** leans toward ultra-fast OLAP with deep storage-engine specialization.
- **DuckDB** focuses on embedded/local analytics and file-native execution.
- **StarRocks** is closest architecturally to Doris, but currently shows stronger visible emphasis on external lakehouse optimizer quality and enterprise auth integration.
- **Iceberg/Delta** are table formats / transaction layers rather than complete OLAP databases.
- **Velox/Arrow/Gluten** are enabling layers rather than end-user database products.

### Community size comparison
On current visible activity:
- Doris is in the **top activity tier**, but below ClickHouse’s very large PR/issue volume.
- Doris appears roughly comparable to StarRocks in engineering intensity.
- Doris has materially more visible day-level development throughput than DuckDB, Databend, Delta, Iceberg, Velox, Gluten, or Arrow in this snapshot.
- Community maturity looks strong, especially due to **active backport discipline**, which is an important signal for production readiness.

### Main caution areas for Doris
Relative to its momentum, Doris still needs to keep addressing:
- **Nereids planner trust/correctness**
- **external catalog interoperability**, especially Iceberg/Nessie
- **small deployment performance perception**
- some older unresolved user-facing issues

---

## 4. Shared Technical Focus Areas

### A. Lakehouse and external table interoperability
**Engines:** Doris, StarRocks, ClickHouse, Iceberg, Delta Lake, Velox, DuckDB  
**Needs observed:**
- better Iceberg/Nessie/REST compatibility (Doris, StarRocks, Iceberg, Delta)
- Unity Catalog / managed catalog correctness (ClickHouse, Delta)
- Parquet type compatibility and schema evolution (StarRocks, Velox, Arrow, DuckDB)
- external scan optimization and pruning (Doris, StarRocks, DuckDB)

**Interpretation:** Users increasingly expect every analytical engine to function well against **external open-table formats and cloud catalogs**, not just native storage.

### B. Object storage efficiency and cloud-native behavior
**Engines:** Doris, DuckDB, Iceberg, Delta Lake, Arrow, Databend  
**Needs observed:**
- S3 request reduction / remote scan efficiency (DuckDB)
- file cache correctness and self-healing (Doris)
- connection pooling / FileIO behavior in cloud storage (Iceberg)
- planning client lifecycle and resource management (Delta)
- packaging/build integration for storage dependencies (Arrow)
- control-plane behavior when object storage is unreachable (Databend)

**Interpretation:** Object-store access cost and behavior are now first-order architectural concerns, not implementation details.

### C. SQL planner correctness and migration confidence
**Engines:** Doris, ClickHouse, DuckDB, Databend, Gluten  
**Needs observed:**
- planner/result compatibility with old planner paths (Doris)
- analyzer crashes and wrong results (ClickHouse)
- binder/planner regressions in advanced SQL (DuckDB)
- decorrelation and large-IN-list stability (Databend)
- Spark plan/backend translation correctness (Gluten)

**Interpretation:** As engines modernize optimizers and execution stacks, users care deeply about **semantic stability**, not just speed.

### D. Memory control, spill, and workload governance
**Engines:** Doris, ClickHouse, StarRocks, DuckDB, Velox  
**Needs observed:**
- spilling and repartition under memory pressure (Doris)
- scheduler and resource races (ClickHouse)
- memory lifecycle fixes and skew handling (StarRocks)
- ingestion memory growth (DuckDB)
- execution micro-efficiency and CI/runtime scaling (Velox)

**Interpretation:** Multi-tenant and cloud deployments are pushing projects toward **predictable resource isolation** and **graceful degradation**.

### E. Search / text / vector-like analytical retrieval
**Engines:** Doris, ClickHouse, Velox  
**Needs observed:**
- inverted index boolean correctness, BM25 scoring (Doris)
- text index correctness fixes (ClickHouse)
- vector/array analytics functions like `dot_product`, `vector_sum` (Velox)

**Interpretation:** The market is pulling analytical engines toward **hybrid retrieval workloads** spanning SQL, search, and vector-style functions.

### F. Enterprise governance and auth correctness
**Engines:** StarRocks, Delta Lake, ClickHouse, Doris  
**Needs observed:**
- Ranger/LDAP propagation across HA control-plane roles (StarRocks)
- UC-managed table metadata safety (Delta)
- row policy/audit/query log correctness (ClickHouse)
- workload/user-based governance and cloud-native auth in ingestion (Doris)

**Interpretation:** Enterprise adoption increasingly depends on **governance correctness**, not just query throughput.

---

## 5. Differentiation Analysis

### Storage format / persistence model
- **Doris / StarRocks / ClickHouse / Databend**: full database engines with native storage plus varying external table/lakehouse integration.
- **DuckDB**: embedded analytical DB, highly file-native and local/portable in design.
- **Iceberg / Delta Lake**: transactional table/storage abstraction layers over object stores and file formats.
- **Arrow / Velox / Gluten**: infrastructure layers rather than primary storage systems.

### Query engine design
- **Doris / StarRocks / ClickHouse**: distributed OLAP engines with integrated optimizer + execution layers.
- **DuckDB**: in-process vectorized engine optimized for local and embedded analytics.
- **Velox**: reusable vectorized execution engine for other systems.
- **Gluten**: Spark acceleration layer using backends such as Velox.
- **Arrow**: data/compute interoperability substrate, not a complete SQL engine.
- **Iceberg / Delta**: rely on compute engines like Spark, Trino, Flink, etc.

### Target workloads
- **Doris**: interactive OLAP, real-time analytics, hybrid search + analytics, cloud-native MPP.
- **ClickHouse**: very high-throughput OLAP, observability, event analytics, low-latency aggregation at scale.
- **StarRocks**: MPP analytics with strong lakehouse and enterprise federation positioning.
- **DuckDB**: notebook, local analytics, embedded app analytics, developer-centric data workflows.
- **Iceberg / Delta**: durable, interoperable data lake table management for batch + streaming ecosystems.
- **Databend**: cloud data warehouse style workloads with modern metadata/versioning evolution.
- **Velox / Gluten / Arrow**: enable execution acceleration, interoperability, and engine embedding.

### SQL compatibility posture
- **Doris / StarRocks**: actively expanding warehouse-style SQL while improving planner correctness.
- **ClickHouse**: expanding SQL breadth, but still visibly managing analyzer and edge-case semantics.
- **DuckDB**: very strong SQL usability reputation, though currently handling several advanced-path regressions.
- **Iceberg / Delta**: SQL semantics depend on upstream engines, but correctness around table operations is crucial.
- **Gluten**: SQL compatibility mediated through Spark plan translation.
- **Velox / Arrow**: compatibility concerns arise through functions, connectors, and downstream integrations.

---

## 6. Community Momentum & Maturity

### Tier 1: High-velocity, broad-scope communities
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

These projects show the strongest raw engineering throughput. They are rapidly iterating on execution, storage, SQL features, and integrations, with Doris and StarRocks showing especially strong evidence of deliberate backport/release-line maintenance.

### Tier 2: High-value, focused iteration
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **Velox**
- **Apache Arrow**

These projects are highly relevant and healthy, but their work is more concentrated:
- DuckDB: post-release stabilization + file/object-store optimization
- Iceberg: format/runtime semantics and connector correctness
- Delta: DSv2 and catalog correctness
- Velox: engine infrastructure/GPU/connector capabilities
- Arrow: packaging, CI, Gandiva, Flight SQL polish

### Tier 3: Smaller but coherent and technically meaningful iteration
- **Databend**
- **Apache Gluten**

These are active and strategically interesting, but at lower visible volume. Both are still advancing important architectural areas:
- Databend: planner robustness, recursive CTEs, metadata/tag evolution
- Gluten: Spark 4.x compatibility, backend correctness, simplification of optimizer stack

### Stabilizing vs rapidly iterating
**Rapidly iterating:** Doris, ClickHouse, StarRocks, DuckDB  
**Architecture/refinement phase:** Iceberg, Delta, Velox, Databend, Gluten  
**Stabilization-heavy today:** ClickHouse, DuckDB, Arrow

---

## 7. Trend Signals

### 1. Lakehouse interoperability is now table stakes
Data engineers increasingly expect engines to query **Iceberg, Delta, Parquet, external catalogs, and cloud object stores** with native-like reliability. For architects, this means engine selection should be based not only on benchmark speed, but also on **catalog semantics, pruning quality, and external table correctness**.

### 2. Query correctness is overtaking feature count as a buying criterion
Across Doris, ClickHouse, DuckDB, Databend, and Gluten, communities are spending visible effort on **wrong-result bugs, planner mismatches, and analyzer/binder stability**. This is valuable for decision-makers because it highlights where production trust is being built—or stressed.

### 3. Cloud object-store efficiency is a competitive differentiator
S3/GCS request amplification, cache correctness, FileIO pooling, and remote planning behavior are recurring themes. For platform teams, this translates directly into **latency, cloud cost, and operational predictability**.

### 4. Governance and enterprise control-plane behavior matter more than before
Ranger, Unity Catalog, row policies, audit logging, managed-table semantics, workload controls, and auth propagation are prominent. This suggests modern OLAP engine evaluation increasingly needs a **security/governance checklist**, not just a performance test.

### 5. SQL engines are converging with search and vector-style analytics
Doris’s inverted index and BM25 work, ClickHouse text index fixes, and Velox vector math requests all point toward a broader trend: analytical systems are being pulled into **hybrid retrieval + analytics** use cases.

### 6. Infrastructure-layer projects are increasingly strategic
Arrow, Velox, Gluten, Iceberg, and Delta are not “secondary” projects anymore; they shape the capabilities of many user-facing engines. For architects, this means long-term platform bets should consider not only the database itself, but also the **underlying execution and table-format ecosystem**.

---

## Bottom Line for Apache Doris

Apache Doris currently sits in a strong competitive position among open-source analytical engines: it combines **high engineering velocity**, **broad feature ambition**, **cloud-native architectural movement**, and a differentiated **hybrid analytics + search** story. Compared with peers, Doris looks especially compelling for teams wanting an integrated analytical platform rather than a narrow execution engine or table format layer. Its main gaps relative to best-in-class trust signals are still **planner correctness confidence** and **external lakehouse/catalog interoperability**, but current momentum suggests those areas are receiving real attention.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-14

## 1) Today’s Overview

ClickHouse had another very active day: **37 issues** and **265 pull requests** were updated in the last 24 hours, with **93 PRs merged/closed** and **no new release tags** published. The signal from today’s activity is mixed but healthy: development velocity remains high, while the issue stream shows a concentration of **26.2 regressions, analyzer-related crashes, and fuzz/CI findings**. Several bugfix PRs already appeared for issues reported within the same day, which suggests maintainers are responding quickly to correctness and stability problems. Overall, the project looks **high-throughput and responsive**, but current master/release work is clearly spending meaningful effort on **stabilization around storage internals, SQL analyzer behavior, and observability**.

## 2) Project Progress

With **93 PRs merged/closed** in the last 24h, the clearest progress areas were bugfixing, storage correctness, and incremental feature work.

### Storage engine and metadata correctness
- **Compact MergeTree checksum determinism fixed** in closed PR [#97522](https://github.com/ClickHouse/ClickHouse/pull/97522), addressing non-deterministic `uncompressed_hash` calculation for Compact parts. This is important for replication/debuggability and suggests ongoing hardening of MergeTree part semantics.
- **Implicit minmax index metadata parsing** was fixed in closed PR [#99383](https://github.com/ClickHouse/ClickHouse/pull/99383), indicating continued cleanup around metadata compatibility on the 25.12 line.

### SQL behavior and parser/analyzer fixes
- The row policy parser issue reported in [Issue #99314](https://github.com/ClickHouse/ClickHouse/issues/99314) already has a corresponding fix PR: [#99463](https://github.com/ClickHouse/ClickHouse/pull/99463), which corrects inconsistent AST formatting for `CREATE ROW POLICY` with aliases.
- A **text index query correctness bug** reported in [Issue #99468](https://github.com/ClickHouse/ClickHouse/issues/99468) also got a same-day fix candidate in [PR #99481](https://github.com/ClickHouse/ClickHouse/pull/99481), showing fast turnaround for full-text-search regressions.

### Operational visibility and query logging
- PR [#99464](https://github.com/ClickHouse/ClickHouse/pull/99464) aims to **log more internal queries**, and PR [#99466](https://github.com/ClickHouse/ClickHouse/pull/99466) improves **skip index logging in query logs**. Together, these changes point to a push toward better introspection for production debugging and workload analysis.

### Feature development still moving in parallel
Even amid stabilization work, notable feature PRs remain active:
- [#93830](https://github.com/ClickHouse/ClickHouse/pull/93830) — `ADD ENUM VALUES`
- [#91170](https://github.com/ClickHouse/ClickHouse/pull/91170) — **Arrow Flight SQL support**
- [#99373](https://github.com/ClickHouse/ClickHouse/pull/99373) — **WASM UDF improvements**
- [#99369](https://github.com/ClickHouse/ClickHouse/pull/99369) — new settings for **bounded shard skipping**
- [#99137](https://github.com/ClickHouse/ClickHouse/pull/99137) — improvements to the `stem` function

Net: today’s merged/closed work advanced **storage consistency**, **metadata correctness**, and **SQL parser stability**, while open PR flow shows the feature roadmap is still active.

## 3) Community Hot Topics

### 1. INSERT slowdown after upgrade to 26.2
- [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241) — **INSERT queries are 3x slower after upgrading from 25.12 to 26.2**
- Labels: `performance`, `v26.2-affected`
- Comments: 18

This is the most-discussed user-facing issue today and likely the most important operational signal. The report points to a **major ingestion regression on ReplacingMergeTree workloads** after moving to 26.2. The underlying technical need is clear: users want **predictable upgrade behavior on write-heavy pipelines**, especially for MergeTree-family engines where ingest rate often dominates TCO.

### 2. CI/storage crash in compact parts
- [Issue #98949](https://github.com/ClickHouse/ClickHouse/issues/98949) — **Double free or corruption in MergeTreeDataPartCompact**
- Labels: `crash-ci`
- Comments: 7

This is a strong signal that compact-part internals remain an active risk area. Together with checksum/determinism fixes in compact parts, it suggests maintainers are still tightening memory safety and lifecycle correctness in that code path.

### 3. Repeated decompression in a single query
- [Issue #99236](https://github.com/ClickHouse/ClickHouse/issues/99236) — **Compressed data is decompressed repeatedly for a single query**
- Comments: 5

This is a sophisticated performance complaint rather than a simple bug report. It points to user expectations around **efficient reuse of decompressed blocks/subcolumns** during analytical scans. If validated, it could affect CPU efficiency substantially on compressed string-heavy datasets.

### 4. Wrong/no-part behavior after detach operations in 26.2
- [Issue #99395](https://github.com/ClickHouse/ClickHouse/issues/99395) — **No such part error after detaching two tables**
- Labels: `bug`, `fuzz`, `v26.2-affected`
- Comments: 3

Another 26.2 regression signal around part lifecycle/state transitions.

### 5. Projection-related sort order violation
- [Issue #99388](https://github.com/ClickHouse/ClickHouse/issues/99388) — **Logical error: Sort order of blocks violated for column with projection index**
- Labels: `bug`, `fuzz`
- Comments: 3

This issue highlights ongoing complexity around **projection indexes and sorted block guarantees**, an area that affects both performance and correctness.

### 6. Long-running roadmap item resurfacing
- [Issue #59304](https://github.com/ClickHouse/ClickHouse/issues/59304) — **`Remote` database engine**
- Labels: `feature`, `warmup task`
- 👍 4

This older issue resurfacing today is notable because it touches federation and multi-instance management—still a strategic gap for some users.

## 4) Bugs & Stability

Below is a severity-ranked summary of notable problems reported or active today.

### Critical / High severity

1. **Potential data-path or ingestion regression in 26.2**
   - [#99241](https://github.com/ClickHouse/ClickHouse/issues/99241) — 3x slower INSERTs after upgrade
   - Severity: **High**
   - Why it matters: direct production impact on write throughput and upgrade confidence
   - Fix PR: **none visible in provided data**

2. **Analyzer-triggered server crash with nested `GLOBAL IN` on Distributed**
   - [#99362](https://github.com/ClickHouse/ClickHouse/issues/99362) — crash in `MergeTreeData::supportsTrivialCountOptimization`
   - Severity: **High**
   - Why it matters: hard server crash under valid query patterns; analyzer-related
   - Fix PR: **none visible in provided data**

3. **CI crash: double free/corruption in compact parts**
   - [#98949](https://github.com/ClickHouse/ClickHouse/issues/98949)
   - Severity: **High**
   - Why it matters: memory corruption findings in storage internals can indicate real latent bugs
   - Related fix context: closed compact-part determinism PR [#97522](https://github.com/ClickHouse/ClickHouse/pull/97522), though not a direct fix for this crash

4. **Concurrency bug in CPU workload scheduler**
   - [#99233](https://github.com/ClickHouse/ClickHouse/issues/99233) — race in `CPUSlotsAllocation`
   - Severity: **High**, but note label `obsolete-version`
   - Why it matters: repeated SIGABRT/SIGSEGV in pods under scheduler race conditions
   - Fix PR: none visible

### Correctness issues

5. **Correlated EXISTS on same table returns wrong result**
   - [#99310](https://github.com/ClickHouse/ClickHouse/issues/99310)
   - Severity: **High**
   - Why it matters: silent wrong answers are among the most serious DB defects
   - Fix PR: none visible

6. **ALTER TABLE can create conflicting EPHEMERAL column leading to LOGICAL_ERROR**
   - [#99437](https://github.com/ClickHouse/ClickHouse/issues/99437)
   - Severity: **Medium-High**
   - Why it matters: schema DDL permits invalid state that later breaks SELECT
   - Fix PR: none visible

7. **Projection index can trigger sort-order logical error**
   - [#99388](https://github.com/ClickHouse/ClickHouse/issues/99388)
   - Severity: **Medium-High**
   - Why it matters: violations of sort guarantees can compromise execution assumptions

8. **parseDateTimeBestEffort accepts invalid month words**
   - [#99345](https://github.com/ClickHouse/ClickHouse/issues/99345)
   - Severity: **Medium**
   - Why it matters: permissive parsing can silently normalize bad input

9. **expire_snapshots double-counts shared files**
   - [#99340](https://github.com/ClickHouse/ClickHouse/issues/99340)
   - Severity: **Medium**
   - Why it matters: metadata/accounting correctness for snapshot cleanup

### Feature-area instability / integration bugs

10. **NOT_FOUND_COLUMN_IN_BLOCK with full text search**
    - [#99468](https://github.com/ClickHouse/ClickHouse/issues/99468)
    - Severity: **Medium**
    - Fix PR exists: [#99481](https://github.com/ClickHouse/ClickHouse/pull/99481)

11. **Prometheus HTTP handlers missing row/byte metrics and query log entries**
    - [#99475](https://github.com/ClickHouse/ClickHouse/issues/99475)
    - Severity: **Medium**
    - Why it matters: observability gaps for Prometheus-compatible endpoints

12. **Unity Catalog integration cannot read streaming tables/materialized views**
    - [#99469](https://github.com/ClickHouse/ClickHouse/issues/99469)
    - Severity: **Medium**
    - Why it matters: connector completeness for modern lakehouse deployments

13. **system.query_log.used_row_policies empty for VIEW/subquery access**
    - [#99456](https://github.com/ClickHouse/ClickHouse/issues/99456)
    - Severity: **Medium**
    - Why it matters: auditing/compliance visibility issue

### Closed/fixed signals today

- [Issue #99258](https://github.com/ClickHouse/ClickHouse/issues/99258) — fuzz failure closed
- [Issue #99190](https://github.com/ClickHouse/ClickHouse/issues/99190) — **S3 schema validation in 26.2 breaking change**, now closed
- [Issue #88722](https://github.com/ClickHouse/ClickHouse/issues/88722) — regression on `EXISTS` with `LIMIT/OFFSET`, closed
- [PR #99463](https://github.com/ClickHouse/ClickHouse/pull/99463) — fixes row policy AST formatting issue
- [PR #99481](https://github.com/ClickHouse/ClickHouse/pull/99481) — fixes text index column-not-found issue
- [PR #99447](https://github.com/ClickHouse/ClickHouse/pull/99447) — **backport** for segfault in recursive CTE with `remote()` + `view()` on 26.2

## 5) Feature Requests & Roadmap Signals

### Strong roadmap signals

1. **Arrow Flight SQL**
   - [PR #91170](https://github.com/ClickHouse/ClickHouse/pull/91170)
   - This is a major interoperability feature for BI/client ecosystems and high-performance RPC-based SQL access. Given its maturity and long runtime, it remains one of the most strategic upcoming interface additions.

2. **ADD ENUM VALUES**
   - [PR #93830](https://github.com/ClickHouse/ClickHouse/pull/93830)
   - This addresses long-standing schema evolution friction. It looks likely to land in a near-term release because it solves a concrete DDL ergonomics problem.

3. **Remote database engine**
   - [Issue #59304](https://github.com/ClickHouse/ClickHouse/issues/59304)
   - A remote-attached database abstraction would simplify federation and migration scenarios. Still looks more like a medium-term feature than an immediate next-version item.

4. **WASM UDF improvements**
   - [PR #99373](https://github.com/ClickHouse/ClickHouse/pull/99373)
   - Experimental, but important as a signal that ClickHouse is investing in extensibility and sandboxed custom computation.

5. **Bounded skipping of unavailable shards**
   - [PR #99369](https://github.com/ClickHouse/ClickHouse/pull/99369)
   - This is a practical distributed query control feature and has a good chance of making a near release because it is operationally useful and narrowly scoped.

6. **Grant restrictions by table engine**
   - [Issue #46652](https://github.com/ClickHouse/ClickHouse/issues/46652)
   - This reflects demand for finer-grained governance in multi-tenant or platform environments.

### Most likely to appear soon
Based on current PR maturity and operational value, the most plausible near-version candidates are:
- [#99369](https://github.com/ClickHouse/ClickHouse/pull/99369) — shard skip thresholds
- [#93830](https://github.com/ClickHouse/ClickHouse/pull/93830) — `ADD ENUM VALUES`
- [#99464](https://github.com/ClickHouse/ClickHouse/pull/99464) / [#99466](https://github.com/ClickHouse/ClickHouse/pull/99466) — logging and observability improvements
- [#99137](https://github.com/ClickHouse/ClickHouse/pull/99137) — `stem` function improvement

## 6) User Feedback Summary

Today’s user feedback clusters around a few recurring pain points:

### Upgrade safety is a top concern
- [#99241](https://github.com/ClickHouse/ClickHouse/issues/99241) and [#99190](https://github.com/ClickHouse/ClickHouse/issues/99190) show users are sensitive to **behavior changes in 26.2**, especially around ingestion performance and schema validation semantics.
- This indicates that users value ClickHouse’s pace, but expect **stable upgrade paths for production clusters**.

### SQL correctness still matters as much as speed
- [#99310](https://github.com/ClickHouse/ClickHouse/issues/99310) and the older now-closed [#88722](https://github.com/ClickHouse/ClickHouse/issues/88722) show users are actively testing SQL edge cases around `EXISTS`, correlation, `LIMIT/OFFSET`, and analyzer semantics.
- The demand here is not for new syntax, but for **more complete and trustworthy SQL behavior**.

### Analyzer adoption is still uneven
- [#99308](https://github.com/ClickHouse/ClickHouse/issues/99308) and [#99362](https://github.com/ClickHouse/ClickHouse/issues/99362) suggest that enabling the newer analyzer can still surface compatibility problems or crashes in real workloads.
- This implies some users remain cautious about fully switching query stacks without more stabilization.

### Observability and governance are active production needs
- [#99475](https://github.com/ClickHouse/ClickHouse/issues/99475), [#99456](https://github.com/ClickHouse/ClickHouse/issues/99456), and [#46652](https://github.com/ClickHouse/ClickHouse/issues/46652) reflect demand for better logs, policy visibility, and guardrails.
- This is typical of maturing enterprise usage: users want not just performance, but also **auditability and operational control**.

### Lakehouse and connector completeness keeps rising in importance
- [#99469](https://github.com/ClickHouse/ClickHouse/issues/99469) and [#83776](https://github.com/ClickHouse/ClickHouse/issues/83776) show continued pressure on integrations with **Unity Catalog** and **MaterializedPostgreSQL**.
- The user base increasingly expects ClickHouse to fit smoothly into broader data platform stacks.

## 7) Backlog Watch

These older or strategically important items likely deserve maintainer attention:

1. **Remote database engine**
   - [Issue #59304](https://github.com/ClickHouse/ClickHouse/issues/59304)
   - Why watch: strategic federation feature; updated today after long dormancy

2. **Grant on create table with specific engine**
   - [Issue #46652](https://github.com/ClickHouse/ClickHouse/issues/46652)
   - Why watch: important for managed platforms, governance, and tenant safety

3. **Preemptive CPU scheduling not applied during index analysis**
   - [Issue #88304](https://github.com/ClickHouse/ClickHouse/issues/88304)
   - Why watch: workload management gaps can materially affect SLA isolation

4. **MaterializedPostgreSQL column mismatch on schema change**
   - [Issue #83776](https://github.com/ClickHouse/ClickHouse/issues/83776)
   - Why watch: practical replication/CDC reliability issue for users integrating with PostgreSQL

5. **Arrow Flight SQL**
   - [PR #91170](https://github.com/ClickHouse/ClickHouse/pull/91170)
   - Why watch: major ecosystem feature with strategic impact

6. **ADD ENUM VALUES**
   - [PR #93830](https://github.com/ClickHouse/ClickHouse/pull/93830)
   - Why watch: highly practical schema-evolution improvement that many users will understand immediately

---

## Bottom line

ClickHouse remains **extremely active and fast-moving**, with strong evidence of both feature progress and quick bug response. The main health concern today is **stability around 26.2**, especially **insert performance regressions, analyzer crashes, and storage edge cases**. The positive counter-signal is that maintainers are landing or proposing fixes quickly, especially for parser/query-log/text-index issues. For operators, the prudent takeaway is: **watch 26.2 upgrade behavior closely, especially on MergeTree write paths and analyzer-enabled workloads**, while keeping an eye on upcoming improvements in observability, SQL ergonomics, and distributed query controls.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-14

## 1) Today’s Overview

DuckDB remains highly active, with **41 PRs** and **16 issues** updated in the last 24 hours, indicating strong maintainer and contributor throughput. Activity is concentrated around **Parquet/S3 scan performance**, **query planner/filter pushdown behavior**, and a cluster of **1.5.0 regressions/internal errors** affecting SQL correctness and stability. No new release was published today, but the issue/PR mix suggests the project is in an active **post-1.5.0 stabilization and optimization** phase. Overall health looks solid from a velocity standpoint, though recent reports point to some elevated regression risk in advanced SQL paths, variant handling, and external storage access.

## 3) Project Progress

Merged/closed work today shows progress in both **stability cleanup** and **storage/query planning improvements**:

- **Parquet planning/cardinality estimation**
  - Closed PR [#21358](https://github.com/duckdb/duckdb/pull/21358) proposed using cached Parquet metadata to improve cardinality estimates for Parquet scans. Although closed, it clearly signals active optimization work around better planning for file-based analytics.
- **Variant/Parquet compatibility**
  - Closed PR [#21357](https://github.com/duckdb/duckdb/pull/21357) addressed writing unsupported DuckDB variant types to Parquet by converting them to `INT64` where possible, tied to issue #21311. This is a practical interoperability improvement around newly evolving variant support.
- **Memory tooling / diagnostics**
  - Closed PR [#21063](https://github.com/duckdb/duckdb/pull/21063) enabled profiling in jemalloc, which may help future investigation of memory-heavy workloads and allocation behavior.

In active PRs, the strongest progress signals are:

- **Reduced S3 request overhead and better Parquet scan efficiency**
  - [#21373](https://github.com/duckdb/duckdb/pull/21373): allow merging prefetch column ranges even when some filters are present; explicitly described as a partial fix for issue [#21348](https://github.com/duckdb/duckdb/issues/21348).
  - [#21374](https://github.com/duckdb/duckdb/pull/21374): improve cardinality estimates when globbing Parquet directories by using file sizes from listings.
  - [#21375](https://github.com/duckdb/duckdb/pull/21375): add row-group skipping support for `MAP` columns in the Parquet reader.
- **Planner/filter pushdown**
  - [#21350](https://github.com/duckdb/duckdb/pull/21350): introduces `TryPushdownRelaxedFilter`, targeting missed pushdowns caused by timestamp/timestamptz casting semantics.
- **SQL semantics and parser work**
  - [#21275](https://github.com/duckdb/duckdb/pull/21275): fixes column pruning for CTEs.
  - [#21331](https://github.com/duckdb/duckdb/pull/21331): PEG grammar fixes.
  - [#21194](https://github.com/duckdb/duckdb/pull/21194): nicer variable syntax using `$`.
- **Build/developer infrastructure**
  - [#21376](https://github.com/duckdb/duckdb/pull/21376): fix GCC compile flags on reconfigure.
  - [#21371](https://github.com/duckdb/duckdb/pull/21371): define a well-specified MinGW build environment.
  - [#21368](https://github.com/duckdb/duckdb/pull/21368): more fine-grained CI retry logic.

## 4) Community Hot Topics

### 1. S3 + hive-partitioned Parquet regressions in 1.5.0
- Issue [#21348](https://github.com/duckdb/duckdb/issues/21348) — ``QUALIFY ROW_NUMBER() OVER (...) = 1` causes ~50x more S3 requests in 1.5.0``
- Issue [#21347](https://github.com/duckdb/duckdb/issues/21347) — `Hive partition filters discover all files before pruning in 1.5.0`
- PR [#21373](https://github.com/duckdb/duckdb/pull/21373) — prefetch-range merging for Parquet reads
- PR [#21374](https://github.com/duckdb/duckdb/pull/21374) — better cardinality estimates from file listings

This is the clearest hot spot today. Users are reporting that workloads over **S3-hosted hive-partitioned Parquet** are generating dramatically more HTTP GETs in 1.5.0, with slower wall-clock performance. The underlying technical need appears to be better **early pruning**, **scan planning**, and **request coalescing** in remote-object-store scenarios, where metadata and I/O amplification dominate cost.

### 2. Variant type rollout pain
- Issue [#21352](https://github.com/duckdb/duckdb/issues/21352) — `Internal error when converting json to variant`
- Issue [#21321](https://github.com/duckdb/duckdb/issues/21321) — `storage_compatibility_version on 'latest' or 'v1.5.0' doesn't allow variant types` (closed as expected behavior / docs-related)
- Closed PR [#21357](https://github.com/duckdb/duckdb/pull/21357) — Parquet variant conversion fallback

Variant support is clearly an evolving area. Users are exploring JSON→Variant conversion and storage compatibility behavior, but the reports suggest rough edges around **encoding**, **storage compatibility gates**, and **Parquet interoperability**.

### 3. SQL regression/internal error cluster
- Issue [#21322](https://github.com/duckdb/duckdb/issues/21322) — `Regression in unnest with joins`
- Issue [#21367](https://github.com/duckdb/duckdb/issues/21367) — `min/max with partition by causing error`
- Issue [#21372](https://github.com/duckdb/duckdb/issues/21372) — `Failed to bind column reference (inequal types)`
- Issue [#21364](https://github.com/duckdb/duckdb/issues/21364) — `Repeat PushCollation`

These reports all point to stress in **binder/planner/rewriter** paths, especially around complex expressions, joins with nested types, collations, and window functions.

### 4. Security/configuration ergonomics
- Issue [#21335](https://github.com/duckdb/duckdb/issues/21335) — `enable_external_access=false blocks WAL checkpoint on persistent databases`
- Issue [#21369](https://github.com/duckdb/duckdb/issues/21369) — ``duckdb_set_config` cannot set `VARCHAR[]` config options``
- PR [#20938](https://github.com/duckdb/duckdb/pull/20938) — `allowed_configs` for `lock_configurations`

This theme reflects enterprise and embedded deployment needs: users want **tighter configuration locking**, but also need those controls to remain operational and consistent for persistent DB and API-level setup.

## 5) Bugs & Stability

Ranked by likely severity/impact:

### Critical / High

1. **Remote Parquet/S3 regression causing major I/O amplification**
   - [#21348](https://github.com/duckdb/duckdb/issues/21348)
   - [#21347](https://github.com/duckdb/duckdb/issues/21347)
   - Impact: high for production analytics on data lakes/S3; reported ~50x more requests and materially slower execution after upgrading to 1.5.0.
   - Fix status: likely in progress via [#21373](https://github.com/duckdb/duckdb/pull/21373) and related planning work in [#21374](https://github.com/duckdb/duckdb/pull/21374).

2. **Internal crash converting JSON to Variant**
   - [#21352](https://github.com/duckdb/duckdb/issues/21352)
   - Impact: high for adopters testing new variant support; internal error suggests engine bug rather than user misuse.
   - Fix status: no direct fix PR in today’s list, but nearby variant/Parquet work exists in [#21357](https://github.com/duckdb/duckdb/pull/21357).

3. **Regression in `UNNEST` with joins causing internal error**
   - [#21322](https://github.com/duckdb/duckdb/issues/21322)
   - Impact: high due to correctness and query failure in SQL involving nested data/list functions.
   - Fix status: no linked fix PR yet.

4. **Appender API memory growth / OOM in C#**
   - [#21142](https://github.com/duckdb/duckdb/issues/21142)
   - Impact: high for ingestion-heavy embedded workloads; report mentions ~9K msgs/sec and eventual out-of-memory.
   - Fix status: under review; no explicit linked PR today.

### Medium

5. **Window/min-max with partitioning triggers serialization error with PandasScan**
   - [#21367](https://github.com/duckdb/duckdb/issues/21367)
   - Impact: medium-high for Python users combining DataFrame scans and window functions.

6. **Persistent DB checkpoint blocked by `enable_external_access=false`**
   - [#21335](https://github.com/duckdb/duckdb/issues/21335)
   - Impact: medium-high for secure embedded deployments; may break expected durability/maintenance workflows.

7. **Hive partition behavior varies by nesting level**
   - [#21370](https://github.com/duckdb/duckdb/issues/21370)
   - Impact: medium for users writing/reading partitioned data layouts.

8. **Bind/type internal error**
   - [#21372](https://github.com/duckdb/duckdb/issues/21372)
   - Impact: medium; another sign of binder robustness issues in complex queries.

9. **Collation handling duplication**
   - [#21364](https://github.com/duckdb/duckdb/issues/21364)
   - Impact: medium; likely planner/binder hygiene issue affecting `COLLATE`.

### Lower / Resolved Today

10. **CLI `.multiline` startup error**
   - [#21308](https://github.com/duckdb/duckdb/issues/21308)
   - Closed; appears resolved/documented quickly.

11. **Recursive CTE + `APPROX_QUANTILE OVER` transaction assertion**
   - [#21354](https://github.com/duckdb/duckdb/issues/21354)
   - Closed quickly, a good sign of rapid triage for internal assertion failures.

12. **FreeBSD test SIGILL**
   - [#21262](https://github.com/duckdb/duckdb/issues/21262)
   - Still open; important for portability but probably lower end-user blast radius.

## 6) Feature Requests & Roadmap Signals

Strong roadmap signals from current PRs/issues:

- **Better lakehouse/object-store execution**
  - [#21373](https://github.com/duckdb/duckdb/pull/21373), [#21374](https://github.com/duckdb/duckdb/pull/21374), [#21375](https://github.com/duckdb/duckdb/pull/21375)
  - Likely near-term direction: improved remote Parquet scan planning, lower request counts, better row-group skipping, better statistics use.

- **Configuration governance / secure embedding**
  - [#20938](https://github.com/duckdb/duckdb/pull/20938) `allowed_configs`
  - [#21369](https://github.com/duckdb/duckdb/issues/21369) array-valued config support in C API
  - Prediction: likely candidates for an upcoming release because they solve practical deployment/security pain.

- **SQL ergonomics**
  - [#21194](https://github.com/duckdb/duckdb/pull/21194) nicer `$` variable syntax
  - This has a good chance of landing in a future minor release because it improves usability without major engine risk.

- **Transactional semantics improvements**
  - [#21171](https://github.com/duckdb/duckdb/pull/21171) transactional multi-statements and PRAGMAs
  - This is strategically important but potentially invasive; may take longer due to semantic implications.

- **Parser and standards/compatibility**
  - [#21331](https://github.com/duckdb/duckdb/pull/21331), [#21213](https://github.com/duckdb/duckdb/pull/21213), [#21310](https://github.com/duckdb/duckdb/pull/21310)
  - Signals continued investment in parser consistency and modernizing the codebase.

Most likely next-version inclusions, based on maturity and urgency:
1. S3/Parquet scan optimizations
2. Config/security improvements
3. Smaller SQL/parser usability features
4. Targeted regression fixes around binder/planner behavior

## 7) User Feedback Summary

Today’s user feedback highlights a few consistent pain points:

- **Upgrade regressions are very noticeable in cloud/object-store workloads.**
  - The strongest dissatisfaction comes from users reading **hive-partitioned Parquet on S3**, where performance changes are immediately visible in GET counts and runtime.
- **Embedded/high-throughput ingestion remains a serious use case.**
  - Issue [#21142](https://github.com/duckdb/duckdb/issues/21142) shows DuckDB being used for **offline FHIR ingestion at ~9K messages/sec**, reinforcing its role as an embedded analytical store in data-intensive applications.
- **Users are actively testing advanced/new type features.**
  - Variant-related reports show demand for semi-structured data support, but also expose rough edges in conversion and storage compatibility.
- **Security-conscious deployments need more polished config behavior.**
  - Users want strict startup configuration and limited filesystem access, but not at the expense of persistence and checkpointing.
- **Python/DataFrame and nested SQL workflows remain important.**
  - Errors involving `PandasScan`, `UNNEST`, windows, and collations suggest DuckDB is widely used in compositional analytics pipelines where correctness matters more than basic happy-path support.

## 8) Backlog Watch

Items that appear to need maintainer attention due to importance, age, or merge-readiness:

- **High-priority open issue**
  - [#21142](https://github.com/duckdb/duckdb/issues/21142) — Appender API memory consumption in C#  
    Under review and likely important for production ingestion scenarios.

- **Ready or near-ready PRs**
  - [#20938](https://github.com/duckdb/duckdb/pull/20938) — `allowed_configs` for locked configuration environments  
    Labeled ready/needs approval; valuable for secure embedding.
  - [#20976](https://github.com/duckdb/duckdb/pull/20976) — configurable `isAdjustedToUTC` for Parquet timestamps  
    Ready to merge and useful for interoperability.
  - [#21194](https://github.com/duckdb/duckdb/pull/21194) — nicer variable syntax  
    Needs docs but likely user-visible and beneficial.
  - [#21310](https://github.com/duckdb/duckdb/pull/21310) — bump C++ standard to 17  
    Important internal modernization, but may require careful ecosystem coordination.

- **Open semantic/engine work with changes requested**
  - [#21350](https://github.com/duckdb/duckdb/pull/21350) — relaxed filter pushdown
  - [#21171](https://github.com/duckdb/duckdb/pull/21171) — transactional multi-statements/PRAGMAs  
    Both touch deep semantics and deserve sustained maintainer review.

## Overall Health Assessment

DuckDB’s project health remains **strong in contributor velocity and responsiveness**, especially around storage-engine optimization and quick triage of edge-case failures. The main risk signal today is **post-release regression pressure in 1.5.0**, particularly for **S3/Parquet workloads** and a set of **internal SQL engine errors** involving nested data, windows, and type/binder interactions. The presence of targeted PRs responding directly to reported regressions is encouraging and suggests the team is actively stabilizing these areas.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-14

## 1. Today's Overview

StarRocks remained highly active over the last 24 hours, with **103 pull requests updated** and **8 issues updated**, indicating a strong maintainer and contributor cadence. Development activity is concentrated around **optimizer improvements, external table compatibility (especially Iceberg/Paimon), skew handling, test/platform portability, and backporting fixes across supported release lines**. No new release was published today, but the volume of merged and backported changes suggests active stabilization work for **3.5, 4.0, and 4.1** branches. Overall project health looks solid, though there are still notable user-facing pain points around **query correctness, Ranger authorization on follower FEs, and Java UDF robustness**.

## 2. Project Progress

Today’s merged/closed PRs show progress in three main areas: **query engine optimization**, **external catalog/table support**, and **stability/backport maintenance**.

### Query engine and optimizer improvements
- **Optimize window functions with skewed partition keys by splitting into UNION** — merged  
  PR: [#67944](https://github.com/StarRocks/starrocks/pull/67944)  
  This is a meaningful optimizer enhancement for analytical workloads with skewed `PARTITION BY` keys in window functions. It targets a common OLAP pain point: single-node hotspots caused by skew during analytic execution.
- **Support explicit skew hint for window functions** — closed  
  PR: [#68739](https://github.com/StarRocks/starrocks/pull/68739)  
  Adds explicit user control to trigger skew-aware rewrites, signaling StarRocks is exposing more optimizer steering knobs for difficult real-world workloads.
- **Handle join skew hint in OptExpressionDuplicator** — closed  
  PR: [#68964](https://github.com/StarRocks/starrocks/pull/68964)  
  This complements skew-related optimizer work and improves plan rewriting correctness when skew hints interact with duplicated expressions.

### External table / lakehouse interoperability
- **Fix typo in `toIcebergTable`: `common` -> `comment`** — merged and backported  
  Main PR: [#70267](https://github.com/StarRocks/starrocks/pull/70267)  
  Backports: [#70270](https://github.com/StarRocks/starrocks/pull/70270), [#70271](https://github.com/StarRocks/starrocks/pull/70271), [#70272](https://github.com/StarRocks/starrocks/pull/70272)  
  Small on the surface, but notable because it was immediately propagated to multiple maintained branches, showing responsiveness on SQL/catalog compatibility issues.
- **Fix `get_json_string` flatten logic** — closed  
  PR: [#68797](https://github.com/StarRocks/starrocks/pull/68797)  
  Improves JSON function correctness for flat JSON structures with type conflicts, relevant for semi-structured analytics workloads.
- **Use column-level statistics for Iceberg `averageRowSize` estimation** — issue closed, backport PR open  
  Issue: [#68784](https://github.com/StarRocks/starrocks/issues/68784)  
  Backport PR: [#70256](https://github.com/StarRocks/starrocks/pull/70256)  
  This matters for optimizer quality and memory estimation for Iceberg scans, reducing underestimation risk.

### Runtime / infrastructure / test stability
- **Change deallocation order in `exec_env->destroy` to prevent Use-After-Free in `MemTracker::~MemTracker`** — merged/closed and backported  
  Main PR: [#67027](https://github.com/StarRocks/starrocks/pull/67027)  
  Backports: [#67313](https://github.com/StarRocks/starrocks/pull/67313), [#67327](https://github.com/StarRocks/starrocks/pull/67327)  
  Important low-level stability work in memory lifecycle management.
- **Check aggregator errors in `sorted_aggregate_streaming_sink_operator`** — closed  
  PR: [#57288](https://github.com/StarRocks/starrocks/pull/57288)  
  Helps prevent silent aggregation failures from being ignored.
- **Replace deprecated regex test API for Python 3.12** — closed  
  PR: [#63456](https://github.com/StarRocks/starrocks/pull/63456)  
  Signals ongoing CI/test modernization.
- **Import Darwin thirdparty libraries for BE** — closed  
  PR: [#70268](https://github.com/StarRocks/starrocks/pull/70268)  
- **Make `base_test` work on macOS** — open  
  PR: [#70275](https://github.com/StarRocks/starrocks/pull/70275)  
  Together these indicate a push toward improved macOS developer experience and broader contributor accessibility.

## 3. Community Hot Topics

### 1) Paimon + Ranger authorization on follower FE
- Issue: [#70255](https://github.com/StarRocks/starrocks/issues/70255) — **CREATE VIEW on Paimon catalog fails on Follower FE due to Ranger permission check**
- Issue: [#70264](https://github.com/StarRocks/starrocks/issues/70264) — **Delete Paimon view permission denied when Paimon catalog reuses Ranger Hive service**
- Related closed issue: [#70077](https://github.com/StarRocks/starrocks/issues/70077) — **LDAP groups lost when follower FE forwards request to leader FE**

This is the clearest hot spot today. Multiple reports point to a shared underlying need: **consistent identity and authorization context propagation across FE request forwarding**, especially for **external catalogs** and **Ranger-backed access control**. The repeated appearance of Paimon + Ranger + follower FE suggests enterprise users are testing StarRocks in realistic HA deployments, and authorization semantics across federated metadata paths remain a sensitive integration area.

### 2) Iceberg optimizer/statistics quality
- Issue: [#68784](https://github.com/StarRocks/starrocks/issues/68784) — **Use column-level statistics for Iceberg averageRowSize estimation**
- Backport PR: [#70256](https://github.com/StarRocks/starrocks/pull/70256)
- Open PR: [#70252](https://github.com/StarRocks/starrocks/pull/70252) — **Expose variant subfield access paths for HDFS and Iceberg scans**
- Open PR: [#70226](https://github.com/StarRocks/starrocks/pull/70226) — **Read `FIXED_LEN_BYTE_ARRAY` as `TYPE_VARBINARY`**

The technical need here is straightforward: users expect StarRocks to behave as a first-class lakehouse query engine over **Iceberg and HDFS-backed data**, with accurate stats, pruning, and Parquet type compatibility. These changes point toward better **scan planning, semi-structured pruning, and data type interoperability**.

### 3) Window skew optimization
- PR: [#67944](https://github.com/StarRocks/starrocks/pull/67944)
- PR: [#68739](https://github.com/StarRocks/starrocks/pull/68739)
- PR: [#68964](https://github.com/StarRocks/starrocks/pull/68964)

This cluster signals strong focus on **handling skew in distributed analytic execution**. The demand comes from production analytical workloads where partition skew can destroy parallelism and create query tail latency.

### 4) Query correctness concern
- Issue: [#70145](https://github.com/StarRocks/starrocks/issues/70145) — **Simple query result wrong / missing rows**

Even though it is closed, correctness bugs always deserve elevated attention. Missing rows in a “simple query” is one of the highest-severity categories for an OLAP engine because it undermines trust in results.

## 4. Bugs & Stability

Ranked by likely severity based on user impact:

### Critical
1. **Wrong query result / missing rows**
   - Issue: [#70145](https://github.com/StarRocks/starrocks/issues/70145) — closed  
   Query correctness is the most serious class of bug in analytical databases. The issue is now closed, which is positive, but this kind of report should remain on watch until the associated fix is clearly traced into release branches.

### High
2. **Follower FE loses LDAP group context when forwarding to leader FE**
   - Issue: [#70077](https://github.com/StarRocks/starrocks/issues/70077) — closed  
   This affects security correctness in HA deployments and can block DDL against external catalogs under Ranger.
3. **CREATE VIEW fails on Paimon catalog on follower FE due to Ranger permission check**
   - Issue: [#70255](https://github.com/StarRocks/starrocks/issues/70255) — open  
4. **DROP VIEW permission denied on Paimon catalog when reusing Ranger Hive service**
   - Issue: [#70264](https://github.com/StarRocks/starrocks/issues/70264) — open  
   These likely belong to the same family as #70077 and may or may not be fully fixed by it. No explicit fix PR is listed in the provided data for the two new open reports.

### Medium
5. **`CREATE JAVA UDF` causes StackOverflow**
   - Issue: [#70262](https://github.com/StarRocks/starrocks/issues/70262) — open  
   A crash-level failure in UDF creation is serious for extensibility users, though narrower in blast radius than core query correctness or auth failures. No fix PR is visible yet.
6. **`starrocks-python` Alembic `NotImplementedError` with `op.to_diff_tuple()`**
   - Issue: [#69264](https://github.com/StarRocks/starrocks/issues/69264) — closed  
   This is more ecosystem/tooling than core engine, but relevant for application developers using SQLAlchemy/Alembic workflows.

### Lower but important engineering quality
7. **Use-after-free in `MemTracker` destruction order**
   - PR: [#67027](https://github.com/StarRocks/starrocks/pull/67027) and backports  
   Strongly positive sign that maintainers are addressing hard-to-debug lifecycle bugs.
8. **Aggregation error propagation bug**
   - PR: [#57288](https://github.com/StarRocks/starrocks/pull/57288)  
   Important because ignored execution errors can turn into silent failure modes.

## 5. Feature Requests & Roadmap Signals

### Multi-tenant data management
- Issue: [#64984](https://github.com/StarRocks/starrocks/issues/64984) — open  
This is the clearest explicit roadmap signal from users. The request highlights challenges in **usability, data skew handling, and adaptive management in multi-tenant analytical environments**. Given StarRocks’ growing enterprise positioning, this is a strategically aligned feature area, though likely too broad for a short-term point release.

### Likely near-term features based on active PRs
1. **Better Iceberg compatibility and scan intelligence**
   - [#70252](https://github.com/StarRocks/starrocks/pull/70252)
   - [#70226](https://github.com/StarRocks/starrocks/pull/70226)
   - [#70256](https://github.com/StarRocks/starrocks/pull/70256)  
   These are strong candidates for the next minor version because they are concrete, scoped, and directly improve external table usability.

2. **More explicit optimizer controls for skew**
   - [#68739](https://github.com/StarRocks/starrocks/pull/68739)
   - [#67944](https://github.com/StarRocks/starrocks/pull/67944)  
   This looks like a deliberate roadmap thread rather than isolated fixes.

3. **Operational improvements for sync materialized view recovery**
   - [#70029](https://github.com/StarRocks/starrocks/pull/70029) — open documentation PR  
   Although this is a doc PR, it references a useful operational feature: `DROP MATERIALIZED VIEW ... FORCE` recovery behavior for stuck synchronous MVs. That suggests the feature is already landing or has landed and is being documented for 4.0/4.1 users.

### Prediction
Most likely to appear in the next version or patch train:
- Iceberg stats and type compatibility improvements
- Additional external scan pruning for variant/semi-structured data
- Fixes for Paimon + Ranger follower FE authorization behavior
- Continued skew-aware optimizer improvements

## 6. User Feedback Summary

Today’s user feedback reflects a few very concrete production concerns:

- **Trust in correctness remains paramount.**  
  The closed missing-rows report [#70145](https://github.com/StarRocks/starrocks/issues/70145) is a reminder that even isolated correctness bugs have outsized importance in OLAP systems.

- **Enterprise security integrations are a real deployment blocker.**  
  The Paimon/Ranger/follower FE issues [#70255](https://github.com/StarRocks/starrocks/issues/70255), [#70264](https://github.com/StarRocks/starrocks/issues/70264), and related [#70077](https://github.com/StarRocks/starrocks/issues/70077) show that users are running StarRocks with **LDAP, Ranger, external catalogs, and HA FE topologies**. Their pain point is not raw performance but **permission consistency across distributed control-plane paths**.

- **Lakehouse compatibility is a major adoption driver.**  
  Requests and fixes around Iceberg stats, Parquet fixed-length byte arrays, variant pruning, and Paimon views suggest users increasingly judge StarRocks by how smoothly it queries **external open-table formats**.

- **Extensibility and tooling still have rough edges.**
  - Java UDF stack overflow: [#70262](https://github.com/StarRocks/starrocks/issues/70262)
  - SQLAlchemy/Alembic integration bug: [#69264](https://github.com/StarRocks/starrocks/issues/69264)  
  This indicates demand from developers embedding StarRocks into broader data platforms and application stacks.

- **Developer experience is improving.**  
  macOS-related work [#70268](https://github.com/StarRocks/starrocks/pull/70268), [#70275](https://github.com/StarRocks/starrocks/pull/70275), plus Python 3.12 test compatibility [#63456](https://github.com/StarRocks/starrocks/pull/63456), reflects investment in contributor productivity.

## 7. Backlog Watch

These items appear to deserve continued maintainer attention:

### Open issues needing follow-up
- **Multi-tenant data management**
  - [#64984](https://github.com/StarRocks/starrocks/issues/64984)  
  Broad but strategically important. It has low discussion so far, which may indicate it needs product/architecture triage rather than routine issue handling.
- **Paimon/Ranger authorization failures on follower FE**
  - [#70255](https://github.com/StarRocks/starrocks/issues/70255)
  - [#70264](https://github.com/StarRocks/starrocks/issues/70264)  
  These are fresh issues but high operational importance; they likely need rapid classification and linkage to the earlier closed auth-context bug.

### Open PRs worth watching
- **Variant subfield access paths for HDFS and Iceberg scans**
  - [#70252](https://github.com/StarRocks/starrocks/pull/70252)  
  Important for semi-structured external analytics and likely impactful if merged.
- **Support `FIXED_LEN_BYTE_ARRAY` as `TYPE_VARBINARY`**
  - [#70226](https://github.com/StarRocks/starrocks/pull/70226)  
  A practical compatibility fix for Iceberg/Parquet users with UUID-like columns.
- **Use column-level stats for Iceberg `averageRowSize` estimation backport**
  - [#70256](https://github.com/StarRocks/starrocks/pull/70256)  
  Worth tracking because it improves optimizer realism in maintained release lines.
- **Make base_test work on macOS**
  - [#70275](https://github.com/StarRocks/starrocks/pull/70275)  
  Helpful for contributor ecosystem growth, especially if StarRocks wants broader local-development accessibility.

## 8. Overall Health Assessment

StarRocks shows **strong engineering throughput and healthy backport discipline**, especially across multiple maintained branches. The most visible technical direction is clear: **improve optimizer intelligence for skewed analytics, strengthen lakehouse interoperability, and harden operational stability**. The biggest caution area is **enterprise integration correctness**—particularly authorization propagation across FE roles and external catalogs—because these issues can block production adoption despite otherwise strong engine progress. Net assessment: **healthy and fast-moving project, with excellent patch velocity but a few high-priority correctness/security integration issues to watch closely**.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-14

## 1) Today’s Overview

Apache Iceberg showed **high development activity** over the last 24 hours, with **50 PRs updated** and **13 issues updated**, indicating an actively moving codebase even though **no new release** was published today. The workstream is broadly split across **Spark correctness fixes, REST/catalog infrastructure, Flink and Kafka Connect integration questions, and forward-looking metadata/spec work for V4**. A notable pattern is that the community is currently surfacing **operational correctness and storage lifecycle concerns**—especially around purge behavior, partition evolution, remote scan planning, cleanup semantics, and connector/runtime dependencies. Overall project health looks **strong on engineering throughput**, but several user-facing bugs in Spark and catalog/file I/O behavior suggest maintainers are balancing feature evolution with compatibility hardening.

## 2) Project Progress

### Merged/closed PRs today
Only one PR in the provided set was clearly closed today:

- [#15627 Core: Rename MAX_ATTEMPTS to MAX_RETRIES in RESTTableScan](https://github.com/apache/iceberg/pull/15627) — **closed**
  - This appears to be a small internal API/terminology cleanup in `RESTTableScan`.
  - While not a user-visible feature, it aligns with ongoing work around **remote scan planning** and cleaner REST scan internals.

### What development moved forward today
Even without many merges, the active PR set shows where the project is advancing:

- **Spark read-path and REST scan correctness**
  - [#15448 Spark 4.1: Pass FileIO on Spark's read path](https://github.com/apache/iceberg/pull/15448)
  - [#15595 Core: Simplify RESTTableScan by removing catalog internals](https://github.com/apache/iceberg/pull/15595)
  - [#15511 Core: Load snapshot after it has been committed to prevent accidental cleanup of files](https://github.com/apache/iceberg/pull/15511)
  - These indicate active work on **remote planning, credential-aware file access, and safer file cleanup semantics**.

- **Spark SQL correctness / branch semantics**
  - [#15592 Spark: Fix wap branch delete scan/write to the wrong branch](https://github.com/apache/iceberg/pull/15592)
  - This is important for **WAP branch correctness**, especially in governed or staged-write deployments.

- **Metadata and file rewrite reliability**
  - [#15470 Core: update manifest delete file size after rewrite table action](https://github.com/apache/iceberg/pull/15470)
  - [#15079 Core: Fix rewrite_position_delete_files failure with array/map columns](https://github.com/apache/iceberg/pull/15079)
  - These improve **rewrite actions**, especially where delete-file metadata and nested types interact badly.

- **Flink and SQL compatibility**
  - [#14932 API, Flink: Correct Handling of Table Names Containing Dots](https://github.com/apache/iceberg/pull/14932)
  - [#15047 Flink: Rewrite DataFile Support Parquet Merge](https://github.com/apache/iceberg/pull/15047)
  - This suggests Iceberg continues improving **catalog naming compatibility** and **maintenance actions for Flink**.

- **Forward-looking spec and format work**
  - [#15049 API, Core: Introduce foundational types for V4 manifest support](https://github.com/apache/iceberg/pull/15049)
  - [#15630 [SPEC] Add relative paths to v4 spec](https://github.com/apache/iceberg/pull/15630)
  - These are strong roadmap signals toward **next-generation metadata/manifests and more flexible path handling**.

## 3) Community Hot Topics

### Most active issues
- [#14743 DROP TABLE ... PURGE does not trigger a purge request in SparkCatalog](https://github.com/apache/iceberg/issues/14743) — 10 comments  
  This is the most-discussed active bug in the issue list and points to a **Spark SQL semantics mismatch**: users expect `DROP TABLE ... PURGE` to propagate a purge request, but the catalog path appears to ignore it. The underlying need is **trustworthy table lifecycle management**, especially in environments where metadata deletion without data deletion is unacceptable.

- [#14874 [Docs] Schema Doc is Missing V3 Types](https://github.com/apache/iceberg/issues/14874) — 8 comments  
  Documentation debt is becoming visible as **V3 types** such as geo, NanoTS, and variant enter user workflows. The technical signal is clear: the feature surface is expanding faster than docs, and users now need **authoritative schema/type guidance**.

- [#15411 GCSFileIO - how to connection pooling - exploding number of TCP connections](https://github.com/apache/iceberg/issues/15411) — 7 comments  
  This reflects an operational pain point in cloud object storage access. The community need here is **connection reuse and transport efficiency** in `GCSFileIO`, especially for Spark merge-heavy workloads.

- [#15425 Kafka connect S3tables support](https://github.com/apache/iceberg/issues/15425) — 5 comments  
  This shows demand for **Kafka Connect compatibility with S3 Tables / REST catalogs using vended credentials**. The issue is less about core table format and more about **connector deployment realism** in managed lakehouse environments.

### Most strategically significant active PRs
- [#13979 [REST | SPARK]: Send referenced-by to all endpoints](https://github.com/apache/iceberg/pull/13979)  
  This is important because it improves **context propagation** between Spark/views and REST endpoints, likely relevant for authorization, auditing, and view-aware resolution.

- [#14853 Spark, Arrow, Parquet: Add vectorized read support for parquet RLE encoded data pages](https://github.com/apache/iceberg/pull/14853)  
  This has potentially broad performance impact. It addresses a real technical need for **faster Parquet reads in Spark**, particularly for files using Parquet v2 encodings.

- [#15049 API, Core: Introduce foundational types for V4 manifest support](https://github.com/apache/iceberg/pull/15049)  
  This is a roadmap-level change, signaling continuing investment in **V4 metadata structures** and likely scalability improvements.

## 4) Bugs & Stability

Ranked by likely severity and user impact:

### 1. High severity — Spark DROP PURGE semantics may be incorrect
- [#14743 DROP TABLE ... PURGE does not trigger a purge request in SparkCatalog](https://github.com/apache/iceberg/issues/14743)
  - Impact: Users may believe data is purged while only metadata/catalog drop happens.
  - Risk: **Data lifecycle and compliance issue**.
  - Fix PR visible today: **none directly linked** in the provided list.

### 2. High severity — SPJ regression after partition evolution
- [#15610 SPJ Broken After Partition Evolution (Iceberg 1.10.0)](https://github.com/apache/iceberg/issues/15610)
  - Impact: **Storage-partitioned join behavior breaks for MERGE INTO** after partition evolution.
  - Risk: Query planning/performance regression and potentially correctness implications if expected optimization paths are invalidated.
  - Fix PR visible today: **none directly linked**.

### 3. High severity — Potential accidental cleanup/file safety concerns
- Related active fix:
  - [#15511 Core: Load snapshot after it has been committed to prevent accidental cleanup of files](https://github.com/apache/iceberg/pull/15511)
  - Impact: Protects against **unsafe file cleanup after commit optimizations**.
  - This is not a newly filed issue today, but it is a significant stability effort with broad consequences for snapshot/file safety.

### 4. Medium severity — Rewrite position delete files failure with complex columns
- [#15079 Core: Fix rewrite_position_delete_files failure with array/map columns](https://github.com/apache/iceberg/pull/15079)
  - Impact: Maintenance actions fail on schemas containing arrays/maps.
  - Risk: Operational inability to compact or rewrite delete files on complex-schema tables.
  - This appears to be an active fix, which is a good sign.

### 5. Medium severity — WAP branch writes/deletes may target the wrong branch
- [#15592 Spark: Fix wap branch delete scan/write to the wrong branch](https://github.com/apache/iceberg/pull/15592)
  - Impact: Incorrect branch targeting in WAP workflows.
  - Risk: **Serious governance/correctness issue** for users depending on isolated publish flows.
  - Fix is in progress.

### 6. Medium severity — GCSFileIO excessive TCP connections
- [#15411 GCSFileIO - how to connection pooling - exploding number of TCP connections](https://github.com/apache/iceberg/issues/15411)
  - Impact: Operational instability, resource pressure, noisy networking footprint.
  - Risk: Throughput degradation and infrastructure cost.

### 7. Medium/low severity — Prefix stripping bug due to regex semantics
- [#15558 Core: fix propertiesWithPrefix to strip prefix literally, not as regex](https://github.com/apache/iceberg/pull/15558)
  - Impact: Misread property keys when prefixes contain dots.
  - Risk: Configuration correctness bugs, especially around format-specific write properties.

### 8. Security/dependency watch — Kafka Connect runtime dependency
- [#15621 Kafka Connect: GHSA-72hv-8253-57qq in jackson-core](https://github.com/apache/iceberg/issues/15621)
  - Impact: Security exposure in distributed runtime packaging.
  - Risk: Depends on exploitability in shaded packaging and actual runtime usage, but this deserves maintainer review.

## 5) Feature Requests & Roadmap Signals

### Strong user requests
- [#15628 Core: Add JMH benchmarks for Variants](https://github.com/apache/iceberg/issues/15628)  
  Immediately followed by:
  - [#15629 Core: Add JMH benchmarks for Variants](https://github.com/apache/iceberg/pull/15629)
  - Signal: Variant support is maturing, and contributors now want **performance characterization**, not just basic functionality.

- [#14874 Docs: Schema Doc is Missing V3 Types](https://github.com/apache/iceberg/issues/14874)
  - Signal: **V3 types are becoming real user-facing features** and likely to get more polish in upcoming releases.

- [#15425 Kafka connect S3tables support](https://github.com/apache/iceberg/issues/15425)
  - Signal: Connectors are increasingly expected to work with **managed/cloud-native catalog products**.

- [#15411 GCSFileIO connection pooling](https://github.com/apache/iceberg/issues/15411)
  - Signal: FileIO implementations are now under scrutiny as users scale production workloads.

### Roadmap indicators from PRs
- [#15049 V4 manifest support foundations](https://github.com/apache/iceberg/pull/15049)
- [#15630 [SPEC] Add relative paths to v4 spec](https://github.com/apache/iceberg/pull/15630)
- [#14782 Spark: Support View Schema Mode and CREATE TABLE LIKE sort order](https://github.com/apache/iceberg/pull/14782)
- [#14853 Vectorized read support for parquet RLE encoded pages](https://github.com/apache/iceberg/pull/14853)
- [#15471 Flink SQL: Add variant avro dynamic record generator](https://github.com/apache/iceberg/pull/15471)

### Likely candidates for the next version
Based on current momentum, the next release is likely to include some combination of:
1. **Spark correctness fixes** around branching, purge semantics, read path FileIO propagation, and rewrite actions.
2. **Variant/V3-type improvements**, including docs, Flink ingestion support, and benchmarks.
3. **REST/V4 groundwork**, especially around manifest support and path semantics.
4. **Performance improvements** in Parquet vectorized reads if [#14853](https://github.com/apache/iceberg/pull/14853) lands.

## 6) User Feedback Summary

The user feedback today is less about “missing headline features” and more about **production reliability, cloud integration, and semantic correctness**.

### Main pain points reported
- **Table/data deletion semantics are confusing or broken**
  - [#14743](https://github.com/apache/iceberg/issues/14743)
  - [#15611 Snapshot Retention Optimization via Spark Action API Deletes Metadata but Retains Data Files](https://github.com/apache/iceberg/issues/15611)
  - [#15612 Support for Orphan File Cleanup in Iceberg Java SDK Comparable to Spark Action API](https://github.com/apache/iceberg/issues/15612)
  - Users want predictable understanding of what operations delete **metadata only** vs **data files too**.

- **Cloud object-store behavior still needs operational tuning**
  - [#15411](https://github.com/apache/iceberg/issues/15411)
  - The complaint is concrete: too many TCP connections during GCS-backed merge workloads.

- **Spark optimization/correctness regressions matter**
  - [#15610](https://github.com/apache/iceberg/issues/15610)
  - Users depend on partition-aware optimization like SPJ to remain stable even through table evolution.

- **Connector interoperability remains a practical adoption blocker**
  - [#15425](https://github.com/apache/iceberg/issues/15425)
  - [#15621](https://github.com/apache/iceberg/issues/15621)
  - Kafka Connect users are hitting both **feature support uncertainty** and **dependency hygiene questions**.

### Positive signal
Several issues and PRs are accompanied by contributors offering fixes or active implementation work, suggesting **healthy contributor engagement**, especially around variants, rewrite actions, and Spark/core internals.

## 7) Backlog Watch

These items look important and likely need maintainer attention due to age, impact, or strategic relevance:

- [#13979 [REST | SPARK]: Send referenced-by to all endpoints](https://github.com/apache/iceberg/pull/13979)  
  Long-running and strategically important for REST/view integration.

- [#14853 Spark, Arrow, Parquet: Add vectorized read support for parquet RLE encoded data pages](https://github.com/apache/iceberg/pull/14853)  
  Potentially high-value performance work that has remained open for months.

- [#14932 API, Flink: Correct Handling of Table Names Containing Dots](https://github.com/apache/iceberg/pull/14932)  
  Small but practical compatibility fix; lingering too long risks avoidable user pain.

- [#14782 Spark: Support View Schema Mode and CREATE TABLE LIKE sort order](https://github.com/apache/iceberg/pull/14782)  
  Important for Spark 4-era SQL/view compatibility.

- [#13765 Handle cases that definitely cannot match for notStartsWith() Predicate in StrictMetricsEvaluator](https://github.com/apache/iceberg/issues/13765)  
  Old, still open, and tied to **predicate evaluation precision**—worth attention because metrics evaluators influence pruning and correctness/performance tradeoffs.

- [#15411 GCSFileIO connection pooling](https://github.com/apache/iceberg/issues/15411)  
  Not old, but impactful enough operationally that it merits quick maintainer guidance or design clarification.

- [#14743 DROP TABLE ... PURGE does not trigger a purge request in SparkCatalog](https://github.com/apache/iceberg/issues/14743)  
  High user-impact semantics bug that should likely be prioritized.

---

## Bottom line

Iceberg is having a **busy and technically meaningful day**, with visible effort on **Spark correctness, REST scan architecture, V4 metadata groundwork, and variant support**. The key risk area is **user trust in operational semantics**—purge, cleanup, branch correctness, and partition-evolution behavior all surfaced in today’s issue stream. If maintainers can convert the active Spark/core PRs into near-term merges, the next release should improve both **cloud/runtime reliability** and **query engine correctness** substantially.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-14

## 1. Today's Overview

Delta Lake showed **strong pull request activity** over the last 24 hours, with **33 PRs updated** and **10 merged/closed**, while **no issues were updated** and **no new releases** were published. The absence of issue traffic suggests the day was driven more by **implementation and review throughput** than by new user-reported problems. Current work is concentrated around **Spark DataSource V2 (DSv2)** evolution, **kernel-spark read semantics**, **catalog/Unity Catalog integration**, and **storage correctness/stability hardening**. Overall, project health looks **active and engineering-led**, with meaningful progress on infrastructure and compatibility rather than user-facing release milestones.

## 3. Project Progress

### Merged/closed PRs today

#### 1. CRC / checkpoint compatibility improvements
- [#6281](https://github.com/delta-io/delta/pull/6281) — **[Kernel] Add Delta-Spark compatibility for CRCInfo.fileSizeHistogram**  
- [#6282](https://github.com/delta-io/delta/pull/6282) — **[SPARK] Write fileSizeHistogram (and not histogramOpt) as field name in CRC file**

These two PRs point to active work on **cross-component metadata compatibility** between Delta Kernel and Delta Spark. The change around `fileSizeHistogram` suggests maintainers are tightening schema/field-name consistency in CRC-side metadata, which is important for **checkpoint/read interoperability**, tooling compatibility, and preventing subtle reader/writer mismatches.

#### 2. Kernel-Spark DSv2 read-option support being refined through stacked PRs
- [#6246](https://github.com/delta-io/delta/pull/6246) — **[kernel-spark] Support skipChangeCommits and ignoreDeletes read option in dsv2**  
- [#6245](https://github.com/delta-io/delta/pull/6245) — **[kernel-spark] Support read option ignoreDeletes in dsv2**

Although closed, these look like **intermediate stack slices** that were superseded by more granular follow-up PRs still open:
- [#6249](https://github.com/delta-io/delta/pull/6249) — **Support ignoreChanges read option in dsv2**
- [#6250](https://github.com/delta-io/delta/pull/6250) — **Support ignoreFileDeletion read option in dsv2**

This indicates concrete progress toward **feature parity of legacy read semantics in DSv2**, a key milestone for migration to newer Spark interfaces.

#### 3. Unity Catalog governance correctness
- [#6243](https://github.com/delta-io/delta/pull/6243) — **[Spark] Block metadata changes on UC-managed tables**

This is a significant **catalog consistency / governance safety** improvement. The PR addresses a case where local metadata mutations could succeed while leaving Unity Catalog state inconsistent, which is exactly the kind of correctness edge case that matters in enterprise deployments.

#### 4. Query correctness and stability fixes
- [#6260](https://github.com/delta-io/delta/pull/6260) — **[Spark] Fix timestamp overflow in dataskipping**
- [#6283](https://github.com/delta-io/delta/pull/6283) — **[Spark] Deflake PartitionLikeDataSkippingSuite**

These suggest maintainers are actively improving **data skipping correctness** and **test reliability**. Timestamp overflow in skipping logic is especially relevant because it can affect **file pruning correctness**, potentially leading either to wrong query results or degraded performance.

#### 5. Resource lifecycle / planning client cleanup
- [#6268](https://github.com/delta-io/delta/pull/6268) — **Add lifecycle management for IcebergRESTCatalogPlanningClient**

This looks like a practical fix for **connection/resource leakage** in server-side planning infrastructure. It signals continued investment in **interop and remote-catalog planning paths**, including Iceberg-adjacent integrations.

## 4. Community Hot Topics

No comment counts or reaction counts were provided, so “hot topics” must be inferred from **recentness**, **stack depth**, and **architectural importance**.

### A. DSv2 write path build-out
- [#6230](https://github.com/delta-io/delta/pull/6230) — **[DSv2] Add executor writer: DataWriter, DeltaWriterCommitMessage**
- [#6231](https://github.com/delta-io/delta/pull/6231) — **[DSv2] Add factory + transport: DataWriterFactory, BatchWrite**

This is one of the clearest roadmap signals in the current snapshot. Delta Lake is building out the **full DSv2 writer stack**, which is foundational for better Spark integration, future write extensibility, and long-term retirement of older write paths. The underlying technical need is clear: **modern Spark-native connector architecture** with cleaner execution and commit boundaries.

### B. DSv2 read semantics parity in kernel-spark
- [#6249](https://github.com/delta-io/delta/pull/6249) — **Support ignoreChanges read option in dsv2**
- [#6250](https://github.com/delta-io/delta/pull/6250) — **Support ignoreFileDeletion read option in dsv2**
- [#6276](https://github.com/delta-io/delta/pull/6276) — **Override columnarSupportMode in DSv2 SparkScan**
- [#6224](https://github.com/delta-io/delta/pull/6224) — **Implement SupportsReportPartitioning in DSv2 SparkScan**

These PRs show that kernel-spark is a major focus area. The technical need behind them is **performance and semantics parity**: users want the benefits of DSv2 without losing mature behaviors such as change-handling options, partition-aware optimization, or predictable vectorized read behavior.

### C. Catalog and managed table semantics
- [#6166](https://github.com/delta-io/delta/pull/6166) — **[Delta-Spark] Extend stagingCatalog for non-Spark session catalog**
- [#6233](https://github.com/delta-io/delta/pull/6233) — **[Delta][CI] Add temporary UC-main test setup**
- [#6243](https://github.com/delta-io/delta/pull/6243) — **Block metadata changes on UC-managed tables**

This cluster indicates ongoing pressure to make Delta work cleanly across **catalog implementations**, especially with **Unity Catalog** and non-default session catalog contexts. That points to enterprise users pushing on **multi-catalog correctness, RTAS/CTAS flows, and managed table governance**.

### D. Storage-layer correctness hardening
- [#6221](https://github.com/delta-io/delta/pull/6221) — **[Kernel][Test] Add corruption detection tests for Deletion Vectors**
- [#6205](https://github.com/delta-io/delta/pull/6205) — **Update delta protocol to specify remove file path must byte match add file path**

These are important signs that maintainers are investing in **protocol precision** and **corruption detection**. The need here is less about new features and more about **durability, recovery, and implementation consistency across engines**.

## 5. Bugs & Stability

Ranked by likely severity based on the summaries provided.

### High severity

#### 1. Potential metadata/catalog inconsistency on managed tables
- [#6243](https://github.com/delta-io/delta/pull/6243) — **[Spark] Block metadata changes on UC-managed tables**  
Status: **Closed**

This appears to address a serious correctness/governance issue: local metadata mutation could succeed while leaving the external catalog inconsistent. In managed environments, that can create operational breakage and hard-to-debug state drift. A fix exists and was closed today.

#### 2. Timestamp overflow in data skipping
- [#6260](https://github.com/delta-io/delta/pull/6260) — **[Spark] Fix timestamp overflow in dataskipping**  
Status: **Closed**

Data skipping participates directly in query planning and pruning. Overflow bugs here can lead to **incorrect pruning** or at minimum unreliable optimization behavior. A fix PR was closed today.

### Medium severity

#### 3. HTTP client connection leak in planning path
- [#6268](https://github.com/delta-io/delta/pull/6268) — **Add lifecycle management for IcebergRESTCatalogPlanningClient**  
Status: **Closed**

This is a stability/resource issue rather than a correctness bug, but in long-running services it can materially affect reliability. The presence of a closed fix is a good sign.

#### 4. Possible non-deterministic failures in data-skipping test coverage
- [#6283](https://github.com/delta-io/delta/pull/6283) — **[Spark] Deflake PartitionLikeDataSkippingSuite**  
Status: **Closed**

Test flakes are not end-user defects directly, but they often hide race conditions or brittle optimizer assumptions. This improves CI confidence around data-skipping behavior.

### Lower severity but important hardening

#### 5. Deletion Vector corruption detection coverage
- [#6221](https://github.com/delta-io/delta/pull/6221) — **[Kernel][Test] Add corruption detection tests for Deletion Vectors**  
Status: **Open**

This is test-only, but it targets **error-path verification for corrupted DV payloads**, which is highly relevant to storage robustness.

#### 6. Thread safety in transaction file reads
- [#6097](https://github.com/delta-io/delta/pull/6097) — **[Spark] Make txn readFiles and readTheWholeTable thread safe**  
Status: **Open**

This may be important if concurrent planning or transaction internals can race. It is worth watching because thread-safety bugs can produce intermittent correctness or stability issues that are difficult to reproduce.

## 6. Feature Requests & Roadmap Signals

Although no new issues were recorded today, the PR stream itself gives strong roadmap clues.

### Most likely near-term delivery themes

#### A. DSv2 becoming a first-class Spark integration path
Evidence:
- [#6230](https://github.com/delta-io/delta/pull/6230)
- [#6231](https://github.com/delta-io/delta/pull/6231)
- [#6224](https://github.com/delta-io/delta/pull/6224)
- [#6276](https://github.com/delta-io/delta/pull/6276)
- [#6249](https://github.com/delta-io/delta/pull/6249)
- [#6250](https://github.com/delta-io/delta/pull/6250)

Prediction: the next version is likely to include more complete **DSv2 read/write support**, especially around **writer plumbing, partition reporting, columnar support negotiation, and legacy read option compatibility**.

#### B. Better catalog abstraction and UC compatibility
Evidence:
- [#6166](https://github.com/delta-io/delta/pull/6166)
- [#6233](https://github.com/delta-io/delta/pull/6233)
- [#6243](https://github.com/delta-io/delta/pull/6243)

Prediction: expect continued work on **non-session catalog support**, **managed table semantics**, and **Unity Catalog-aligned behavior**, especially for CREATE/REPLACE/RTAS-style operations.

#### C. Protocol/spec tightening
Evidence:
- [#6205](https://github.com/delta-io/delta/pull/6205)

Prediction: Delta may continue clarifying the protocol to reduce ambiguity for independent implementations, especially around **path equality**, metadata field naming, and compatibility across Spark/Kernel.

#### D. Legacy cleanup and modernization
Evidence:
- [#5874](https://github.com/delta-io/delta/pull/5874) — **Remove the old scala LogStores**

Prediction: older internal APIs are being phased out in favor of cleaner, probably more portable Java-based abstractions. This is a long-horizon maintainability and connector modernization effort.

## 7. User Feedback Summary

Since there were **no issue updates in the last 24 hours**, there is no direct fresh user-reported feedback stream today. Still, the active PR set implies several real user pain points:

- **Migration friction to DSv2**: users want DSv2 support without losing familiar Delta read options and optimization behaviors.  
  Relevant PRs: [#6249](https://github.com/delta-io/delta/pull/6249), [#6250](https://github.com/delta-io/delta/pull/6250), [#6224](https://github.com/delta-io/delta/pull/6224), [#6276](https://github.com/delta-io/delta/pull/6276)

- **Enterprise catalog correctness matters**: managed tables and UC integrations need guardrails to prevent silent inconsistency.  
  Relevant PR: [#6243](https://github.com/delta-io/delta/pull/6243)

- **Performance-sensitive users care about pruning and vectorization correctness**: timestamp data-skipping fixes and columnar-mode support indicate ongoing pressure to keep query performance both fast and safe.  
  Relevant PRs: [#6260](https://github.com/delta-io/delta/pull/6260), [#6276](https://github.com/delta-io/delta/pull/6276)

- **Operators care about robustness in storage metadata and services**: corruption detection tests, CRC field compatibility, and planning-client lifecycle management all point to production hardening needs.  
  Relevant PRs: [#6221](https://github.com/delta-io/delta/pull/6221), [#6281](https://github.com/delta-io/delta/pull/6281), [#6282](https://github.com/delta-io/delta/pull/6282), [#6268](https://github.com/delta-io/delta/pull/6268)

## 8. Backlog Watch

These are older or strategically important open PRs that likely deserve maintainer attention.

### 1. Old LogStore cleanup
- [#5874](https://github.com/delta-io/delta/pull/5874) — **[Spark] Remove the old scala LogStores**  
Created: 2026-01-18

This is the oldest visible open PR in the list and appears strategically important for technical debt reduction. Because LogStore behavior affects commit durability and object-store integrations, this deserves careful but timely review.

### 2. Transaction thread safety
- [#6097](https://github.com/delta-io/delta/pull/6097) — **[Spark] Make txn readFiles and readTheWholeTable thread safe**  
Created: 2026-02-20

Potential concurrency correctness issues in transaction internals can have outsized impact. This looks like an important but non-trivial fix that should not linger too long.

### 3. Catalog abstraction / RTAS stack
- [#6166](https://github.com/delta-io/delta/pull/6166) — **[Delta-Spark] Extend stagingCatalog for non-Spark session catalog**  
- [#6233](https://github.com/delta-io/delta/pull/6233) — **[Delta][CI] Add temporary UC-main test setup**

These are likely part of a larger stack. Since catalog and RTAS behavior can block platform adoption, the stack seems worth prioritizing.

### 4. Protocol clarification on remove/add path matching
- [#6205](https://github.com/delta-io/delta/pull/6205) — **Update delta protocol to specify remove file path must byte match add file path**

Specification clarity is critical for ecosystem interoperability. Even if code impact is low, getting this resolved helps all downstream implementations.

### 5. Deletion Vector corruption tests
- [#6221](https://github.com/delta-io/delta/pull/6221) — **[Kernel][Test] Add corruption detection tests for Deletion Vectors**

This is test-focused but important for confidence in failure handling. Good candidate for quick merge if review is straightforward.

---

## Bottom line

Delta Lake’s day was defined by **high engineering velocity without release activity**. The strongest themes are **DSv2 maturation**, **catalog/UC correctness**, **metadata/protocol compatibility**, and **storage/query-path hardening**. If this trajectory continues, the next release will likely emphasize **Spark DSv2 completeness and reliability improvements** more than flashy end-user features.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-14

## 1. Today's Overview

Databend showed moderate day-to-day engineering activity over the last 24 hours, with **3 issues updated** and **9 pull requests updated**, including **2 closed PRs** and **7 still open**. The current work is concentrated in the **query engine and planner**, with notable focus on **recursive CTE execution, scalar subquery decorrelation, runtime filtering behavior, and large IN-list planning stability**. On the storage/catalog side, maintainers are continuing a broader **table branch/tag model transition**, including removal of legacy logic and introduction of a new KV-backed tagging mechanism for FUSE snapshots. Overall, project health looks solid: no flood of new regressions, but several updates point to active refinement of correctness, execution robustness, and metadata model evolution.

## 2. Project Progress

### Merged/closed PRs today

#### 1) Skip S3 refresh for attached tables in HTTP catalog endpoints
- PR: [#19548](https://github.com/databendlabs/databend/pull/19548)
- Type: bugfix
- Status: closed
- Author: @TCeason

This change addresses a practical catalog-availability problem: when **attached tables depend on S3 storage that is unreachable from the manage service**, HTTP catalog endpoints could fail. The fix adds `disable_table_info_refresh` behavior to HTTP catalog endpoints so they can avoid triggering S3 snapshot refresh in those cases.

**Why it matters**
- Improves **control-plane resiliency** for deployments with mixed accessibility between metadata and object storage.
- Reduces unnecessary hard failures in metadata APIs.
- Especially relevant for **hybrid/cloud management architectures** and attached/externalized table setups.

#### 2) Remove legacy table branch/tag implementation
- PR: [#19534](https://github.com/databendlabs/databend/pull/19534)
- Type: refactor
- Status: closed
- Author: @zhyass

This PR removes the older implementation of **table branch/tag** support. It is clearly part of a larger metadata redesign now visible in the open feature work for experimental table tags.

**Why it matters**
- Simplifies metadata code paths by eliminating legacy branch/tag logic.
- Signals that Databend is consolidating around a **newer snapshot/tagging model**, likely to improve maintainability and future feature velocity.
- Important groundwork for storage-versioning and snapshot governance features.

### Notable open progress areas

#### Recursive CTE streaming execution
- PR: [#19545](https://github.com/databendlabs/databend/pull/19545)

This is one of the most strategically important open items. It targets **streaming execution for recursive CTEs**, with explicit reference to inability to execute a Sudoku-style recursive query previously. This suggests Databend is improving support for more demanding recursive workloads while reducing execution bottlenecks.

#### Experimental table tags for FUSE snapshots
- PR: [#19549](https://github.com/databendlabs/databend/pull/19549)

Introduces a **new KV-backed table tag model** for FUSE snapshots, replacing legacy table-ref branch/tag reuse. This is a clear roadmap signal toward more robust snapshot labeling/versioning semantics.

#### Planner/query correctness and robustness
- Decorrelate correlated scalar subquery `LIMIT`: [#19532](https://github.com/databendlabs/databend/pull/19532)
- Flatten IN-list OR predicates safely: [#19546](https://github.com/databendlabs/databend/pull/19546)
- Scope runtime filter selectivity to bloom only: [#19547](https://github.com/databendlabs/databend/pull/19547)
- Hash shuffle refactor: [#19505](https://github.com/databendlabs/databend/pull/19505)

These indicate sustained investment in **SQL compatibility, optimizer correctness, and distributed execution stability**.

## 3. Community Hot Topics

There was not much discussion volume in the provided data—most items had **0 reactions** and very low comment counts—so “hot topics” are best inferred from engineering concentration and architectural significance rather than social engagement.

### A) Recursive query execution maturity
- PR: [#19545](https://github.com/databendlabs/databend/pull/19545)

This appears to be a major ongoing theme. Recursive CTE support is a key SQL completeness feature for analytical databases, and the mention of a Sudoku query is a strong signal that users are pushing Databend on **nontrivial recursive evaluation patterns**. The technical need here is better **streaming execution and recursion handling without materialization bottlenecks or unsupported execution plans**.

### B) Table versioning/tagging architecture transition
- PR: [#19549](https://github.com/databendlabs/databend/pull/19549)
- PR: [#19499](https://github.com/databendlabs/databend/pull/19499)
- Closed PR: [#19534](https://github.com/databendlabs/databend/pull/19534)

This cluster suggests an active redesign around **table branch/tag semantics**, especially for **FUSE snapshots**. The underlying need is likely better snapshot management, cleaner metadata ownership, and more predictable versioned table references for operational workflows.

### C) Planner robustness under complex SQL rewrites
- PR: [#19532](https://github.com/databendlabs/databend/pull/19532)
- PR: [#19546](https://github.com/databendlabs/databend/pull/19546)
- PR: [#19547](https://github.com/databendlabs/databend/pull/19547)

These PRs point to real-world pressure on the optimizer from:
- correlated scalar subqueries with `LIMIT`
- very large `IN (...)` lists
- runtime filter heuristics affecting join performance and correctness tradeoffs

The technical need is clear: **broader SQL compatibility without introducing stack depth issues, plan instability, or overaggressive filter suppression**.

## 4. Bugs & Stability

Ranked by likely operational severity based on the available descriptions.

### 1) Memory leak in `GROUP_CONCAT(DISTINCT ...)` during grouped final aggregation
- Issue: [#19543](https://github.com/databendlabs/databend/issues/19543)
- Status: closed
- Severity: High

This is the most serious issue in the current batch because it concerns a **memory leak in aggregation**, which can directly impact cluster stability and long-running analytical workloads. The bug affects `GROUP_CONCAT(DISTINCT ...)` in grouped final aggregation, a combination that can appear in reporting and deduped string aggregation use cases.

**Impact**
- Memory growth during aggregation
- Potential OOM risk under high-cardinality group-by workloads
- Reduced reliability for production analytical queries

**Fix status**
- The issue is closed, suggesting it was addressed, though no direct fixing PR is listed in the provided dataset.

### 2) Missing error for non-existent stage file in `SELECT ... FROM @stage/...`
- Issue: [#13267](https://github.com/databendlabs/databend/issues/13267)
- Status: closed
- Severity: Medium

Historically, querying a nonexistent stage file appears to have returned **0 rows** instead of an explicit error. This is a correctness/usability issue rather than a crash, but it can silently mask user mistakes and produce misleading downstream results.

**Impact**
- Silent failure mode
- Poor debuggability in ingestion/query workflows
- Risk of unnoticed data absence in pipelines

**Fix status**
- Closed, implying this behavior has likely been corrected or resolved by related changes.

### 3) Backtrace decoding usability issue
- Issue: [#17729](https://github.com/databendlabs/databend/issues/17729)
- Status: closed
- Severity: Low to Medium

This issue centers on **how to decode a backtrace** from a Databend image. It reflects supportability and operational debugging friction rather than engine correctness.

**Impact**
- Harder incident diagnosis
- Slower root-cause analysis in production/debug builds

**Fix status**
- Closed. The resolution may have been documentation, tooling guidance, or environment-specific clarification.

### Related stability work in open PRs

Several open PRs suggest active prevention of future correctness/stability regressions:

- Large IN-list stack overflow prevention: [#19546](https://github.com/databendlabs/databend/pull/19546)
- Correlated scalar subquery correctness with `LIMIT`: [#19532](https://github.com/databendlabs/databend/pull/19532)
- Runtime filter heuristic correction: [#19547](https://github.com/databendlabs/databend/pull/19547)

## 5. Feature Requests & Roadmap Signals

### Experimental table tags for FUSE snapshots
- PR: [#19549](https://github.com/databendlabs/databend/pull/19549)

This is the clearest near-term roadmap signal. Databend appears to be formalizing a **new table tag model backed by KV metadata** for FUSE snapshot workflows.

**Likely next-version probability:** High for experimental availability.

### Recursive CTE execution improvements
- PR: [#19545](https://github.com/databendlabs/databend/pull/19545)

If merged soon, this would significantly improve SQL expressiveness and standards coverage for recursive workloads.

**Likely next-version probability:** Medium to High, depending on execution semantics and test maturity.

### Ongoing table branch refactor
- PR: [#19499](https://github.com/databendlabs/databend/pull/19499)

Together with the removal of legacy branch/tag logic, this suggests a broader metadata refactor still in flight.

**Likely next-version probability:** Medium, likely as part of an internal architecture transition rather than a user-facing “headline” feature.

### Implicit user-facing asks from closed issues
- Better stage file error reporting: [#13267](https://github.com/databendlabs/databend/issues/13267)
- Better debugging/backtrace workflows: [#17729](https://github.com/databendlabs/databend/issues/17729)

These are not large roadmap features, but they show demand for **operational clarity and safer UX defaults**.

## 6. User Feedback Summary

Based on today’s issue and PR set, user pain points cluster into four areas:

1. **Query correctness under edge-case SQL**
   - Correlated scalar subqueries with `LIMIT`
   - `IN`-list expansion behavior
   - Distinct string aggregation memory safety  
   Users are clearly exercising Databend with sophisticated SQL patterns, and they expect behavior that is both standards-aligned and stable.

2. **Operational resilience in cloud/object-store environments**
   - HTTP catalog failures caused by unreachable S3 for attached tables: [#19548](https://github.com/databendlabs/databend/pull/19548)  
   This reflects real deployment complexity, where metadata services and storage services do not always share identical reachability.

3. **Metadata/versioning ergonomics**
   - Table branch/tag redesign and FUSE snapshot tags: [#19549](https://github.com/databendlabs/databend/pull/19549), [#19499](https://github.com/databendlabs/databend/pull/19499), [#19534](https://github.com/databendlabs/databend/pull/19534)  
   Users likely want cleaner and more predictable primitives for table snapshot organization and reproducibility.

4. **Debuggability and explicit failure behavior**
   - Missing file should error, not silently return zero rows: [#13267](https://github.com/databendlabs/databend/issues/13267)
   - Backtrace decoding guidance: [#17729](https://github.com/databendlabs/databend/issues/17729)  
   These are signs that Databend users value **clear diagnostics** as much as raw performance.

Overall sentiment from the available data is not negative; rather, it suggests a maturing project where users are pushing into **advanced SQL semantics, production operations, and metadata lifecycle management**.

## 7. Backlog Watch

These items deserve maintainer attention because they are either older, strategically important, or indicate broad architectural work still in progress.

### 1) Table branch refactor remains open
- PR: [#19499](https://github.com/databendlabs/databend/pull/19499)
- Created: 2026-03-01

This has been open for nearly two weeks and is part of a larger metadata transition. Given that legacy branch/tag code was already removed in [#19534](https://github.com/databendlabs/databend/pull/19534), maintainers should ensure the remaining refactor lands cleanly to avoid transitional complexity.

### 2) Hash shuffle refactor is still in flight
- PR: [#19505](https://github.com/databendlabs/databend/pull/19505)
- Created: 2026-03-04

Hash shuffle is central to distributed query execution. Any prolonged refactor here deserves close review because it can affect **performance, exchange correctness, and cluster-wide execution behavior**.

### 3) Recursive CTE streaming execution needs careful prioritization
- PR: [#19545](https://github.com/databendlabs/databend/pull/19545)

Although new, this is high-value. Recursive CTE support tends to expose planner and executor edge cases, so this should receive strong review attention due to its likely user impact.

### 4) Historically old issues only now closed
- Issue: [#13267](https://github.com/databendlabs/databend/issues/13267), created 2023-10-16
- Issue: [#17729](https://github.com/databendlabs/databend/issues/17729), created 2025-04-08

Even though these are now closed, their age suggests there may still be other **low-visibility UX and operability issues** lingering in the backlog.

## 8. Overall Health Assessment

Databend’s current trajectory looks healthy and engineering-driven. The visible work is not dominated by emergency regressions; instead, it reflects a mix of **planner correctness**, **execution robustness**, **metadata architecture cleanup**, and **operational hardening**. The strongest signals for upcoming user-visible improvement are **recursive CTE execution**, **snapshot/table tag capabilities**, and continued SQL edge-case compatibility fixes. The main risk area to watch is whether the ongoing branch/tag refactor and query engine changes land cohesively without introducing migration or behavioral inconsistencies.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-14

## 1. Today's Overview

Velox showed **high development activity** over the last 24 hours, with **47 pull requests updated** and **6 issues updated**, indicating an active contributor and maintainer loop. The balance of activity leans strongly toward **ongoing feature work and infrastructure improvements**, especially around CI/build performance, GPU/cuDF integration, SQL/function coverage, and connector capabilities. No new releases were published, so today’s signal is more about **integration velocity and roadmap movement** than packaged delivery. Overall project health looks solid, though there are still notable stability concerns in **macOS builds/tests**, **Parquet writer edge cases**, and **fuzzer-discovered correctness issues**.

## 3. Project Progress

Merged and closed work today advanced both engine internals and execution features:

- **MarkSorted operator merged** — a meaningful execution-engine addition for pipelines that depend on sorted inputs. The new operator validates sortedness on specified keys and appends a marker column, helping detect corruption or contract violations before downstream operators consume the data. This is a useful building block for query correctness and defensive execution in sort-sensitive plans.  
  Link: [PR #16652](https://github.com/facebookincubator/velox/pull/16652)

- **Low-level helper optimization merged** — preallocation in `expandRepeatedRanges` was merged, suggesting ongoing attention to micro-efficiency and memory behavior in common utility paths. While small in scope, these kinds of changes typically improve execution predictability in vectorized internals.  
  Link: [PR #16765](https://github.com/facebookincubator/velox/pull/16765)

Closed issues also suggest recent progress on bug resolution:

- **Build fix area closed** for `-DVELOX_MONO_LIBRARY=OFF`, implying movement on modular build configurations and better support for non-monolithic builds.  
  Link: [Issue #16745](https://github.com/facebookincubator/velox/issues/16745)

- **macOS Hive connector test crash closed**, which points to progress on platform stability for local/testing workflows.  
  Link: [Issue #16305](https://github.com/facebookincubator/velox/issues/16305)

- **Parquet writer rotation empty-file bug closed**, a storage correctness improvement that addresses generation of unreadable 0-byte Parquet files.  
  Link: [Issue #16527](https://github.com/facebookincubator/velox/issues/16527)

## 4. Community Hot Topics

The hottest themes today are less about issue volume and more about **strategic engineering focus**:

### CI and developer productivity
- **Optimize fuzzer artifact upload/download in scheduled CI**  
  Link: [PR #16767](https://github.com/facebookincubator/velox/pull/16767)  
  This PR addresses substantial CI inefficiency from uploading 14 large fuzzer binaries separately and repeatedly downloading them in downstream jobs. The underlying need is clear: Velox’s validation matrix has grown large enough that **CI throughput is becoming a first-order productivity constraint**.

- **Optimize CI with test splitting and 32-core runner**  
  Link: [PR #16691](https://github.com/facebookincubator/velox/pull/16691)  
  This points to a broader need to keep the project’s test surface scalable as modules, connectors, and execution paths expand.

### GPU/cuDF maturation
- **Reduce GPU CI cuDF unit test runtime**  
  Link: [Issue #16708](https://github.com/facebookincubator/velox/issues/16708)

- **Use `enqueueForDevice` for cuDF buffered input data source**  
  Link: [PR #16732](https://github.com/facebookincubator/velox/pull/16732)

- **Update cuDF and related dependency pins**  
  Link: [PR #16752](https://github.com/facebookincubator/velox/pull/16752)

These updates collectively show that GPU execution remains a significant investment area. The need is twofold: **performance parity in CI/development workflows** and **correct/efficient device-side I/O behavior** for hybrid scan and reader paths.

### SQL/function surface expansion
- **Add `vector_sum` aggregate for element-wise array summation**  
  Link: [Issue #16756](https://github.com/facebookincubator/velox/issues/16756)

- **Re-add `dot_product` UDF**  
  Link: [PR #16740](https://github.com/facebookincubator/velox/pull/16740)

- **Add `ceil(DECIMAL)` for PrestoSQL**  
  Link: [PR #16253](https://github.com/facebookincubator/velox/pull/16253)

These point to continued demand for **analytics-oriented vector/array functions** and **better SQL dialect completeness**, especially for Presto compatibility.

### Format and connector evolution
- **Parquet type widening support for INT→Decimal and Decimal→Decimal**  
  Link: [PR #16611](https://github.com/facebookincubator/velox/pull/16611)

- **Iceberg positional update support**  
  Link: [PR #16761](https://github.com/facebookincubator/velox/pull/16761)

The technical need here is stronger interoperability with **modern lakehouse schema evolution** and **merge-on-read table maintenance patterns**.

## 5. Bugs & Stability

Ranked by likely user impact and severity:

### 1. Query correctness / engine stability: fuzzer-discovered failure
- **Presto Bias Fuzzer run failed with seed 3827**  
  Link: [Issue #16712](https://github.com/facebookincubator/velox/issues/16712)  
  Severity: **High**  
  Fuzzer-found failures are often early indicators of correctness bugs in expression evaluation, type handling, or planner/execution edge cases. No linked fix PR is visible in the provided data, so this remains an active risk area.

### 2. Storage correctness: empty file during Parquet writer rotation
- **[Parquet] Empty file generated during writer rotation**  
  Link: [Issue #16527](https://github.com/facebookincubator/velox/issues/16527)  
  Severity: **High**, but now **closed**  
  A 0-byte Parquet file causing downstream read failures is a serious storage-layer issue. Closure suggests a fix has landed or been validated, reducing risk for rotating-writer workloads.

### 3. Platform stability: macOS Hive connector test crash
- **`velox_hive_connector_test` release crash on macOS**  
  Link: [Issue #16305](https://github.com/facebookincubator/velox/issues/16305)  
  Severity: **Medium-High**, now **closed**  
  Segfaults in release-mode tests are a significant confidence issue for developers on macOS and potentially for connector code quality generally. Closure is positive, but this area should still be watched for recurrence.

### 4. Build regression / portability
- **Failed to build with `-DVELOX_MONO_LIBRARY=OFF`**  
  Link: [Issue #16745](https://github.com/facebookincubator/velox/issues/16745)  
  Severity: **Medium**, now **closed**  
  This affects users building Velox in modular form, relevant for embedders and downstream integrators. Closure suggests maintainers are responsive on build-system breakage.

### 5. GPU I/O path correctness/performance concern
- **Re-add `enqueueForDevice` for cuDF buffered input data source**  
  Link: [PR #16732](https://github.com/facebookincubator/velox/pull/16732)  
  Severity: **Medium**  
  While raised via PR rather than issue, this implies a regression or missing optimization in GPU data-source handling, especially for hybrid scan.

## 6. Feature Requests & Roadmap Signals

Several user-facing features stand out as likely near-term roadmap candidates:

- **`vector_sum` aggregate for arrays**  
  Link: [Issue #16756](https://github.com/facebookincubator/velox/issues/16756)  
  Strong signal of demand for richer **vector/embedding-style analytics** primitives. Given recent `dot_product` work, this fits an emerging theme and could plausibly land in an upcoming version.

- **`dot_product` UDF restoration**  
  Link: [PR #16740](https://github.com/facebookincubator/velox/pull/16740)  
  This reinforces the above trend: Velox appears to be expanding support for **array math and ML-adjacent SQL functions**.

- **PrestoSQL `ceil(DECIMAL)`**  
  Link: [PR #16253](https://github.com/facebookincubator/velox/pull/16253)  
  Likely candidate for the next release because it fills a clear SQL compatibility gap and already appears well-scoped.

- **Parquet schema evolution support**  
  Link: [PR #16611](https://github.com/facebookincubator/velox/pull/16611)  
  Very strong roadmap signal. Support for widening reads aligns with Spark 4.0 behavior and directly improves lakehouse interoperability, making it a high-value candidate for inclusion soon.

- **Iceberg positional updates**  
  Link: [PR #16761](https://github.com/facebookincubator/velox/pull/16761)  
  This is a substantial connector capability enhancement and signals deeper investment in **Iceberg merge-on-read semantics**.

- **RPC plan node groundwork**  
  Link: [PR #16727](https://github.com/facebookincubator/velox/pull/16727)  
  Suggests longer-term architectural expansion toward asynchronous RPC-backed execution components.

## 7. User Feedback Summary

Recent user and contributor feedback indicates these pain points:

- **Build and CI cost are too high**: multiple PRs target artifact upload time, test splitting, runner sizing, and dependency updater diagnostics. This suggests contributors are feeling friction in both day-to-day iteration and scheduled validation.  
  Links: [PR #16767](https://github.com/facebookincubator/velox/pull/16767), [PR #16691](https://github.com/facebookincubator/velox/pull/16691), [PR #16332](https://github.com/facebookincubator/velox/pull/16332)

- **GPU enablement is valuable but operationally expensive**: long-running cuDF CI tests and dependency pin churn show that GPU support is increasingly real, but still costly to validate and maintain.  
  Links: [Issue #16708](https://github.com/facebookincubator/velox/issues/16708), [PR #16752](https://github.com/facebookincubator/velox/pull/16752)

- **Users want broader analytical SQL coverage**: requests for array/vector functions and fixes for decimal semantics suggest Velox is being pushed into richer analytical and compatibility-sensitive workloads.  
  Links: [Issue #16756](https://github.com/facebookincubator/velox/issues/16756), [PR #16740](https://github.com/facebookincubator/velox/pull/16740), [PR #16253](https://github.com/facebookincubator/velox/pull/16253)

- **Lakehouse interoperability matters**: Parquet widening and Iceberg positional updates indicate real-world demand for schema evolution and row-level mutation support across open table formats.  
  Links: [PR #16611](https://github.com/facebookincubator/velox/pull/16611), [PR #16761](https://github.com/facebookincubator/velox/pull/16761)

## 8. Backlog Watch

These older or strategically important items appear to need maintainer attention:

- **DuckDB upgrade from 0.8.1 to 1.4.4**  
  Link: [PR #16650](https://github.com/facebookincubator/velox/pull/16650)  
  Important dependency modernization with likely broad testing implications. It has been open since 2026-03-05 and could unblock compatibility/performance improvements.

- **Array concat signature enforcement**  
  Link: [PR #15756](https://github.com/facebookincubator/velox/pull/15756)  
  Marked stale despite addressing a behavioral inconsistency between signature validation and runtime enforcement. This affects correctness and SQL semantics, so it deserves review.

- **ROUND ROBIN ROW support in cuDF local partition**  
  Link: [PR #14641](https://github.com/facebookincubator/velox/pull/14641)  
  A long-lived GPU feature PR dating back to 2025-08-28. Its age suggests either review bandwidth issues or unresolved design questions.

- **Run cuDF tests in CI**  
  Link: [PR #15700](https://github.com/facebookincubator/velox/pull/15700)  
  Marked ready-to-merge, but still open. Given current emphasis on GPU CI, this seems particularly worth resolving.

- **MarkDistinct Fuzzer**  
  Link: [PR #16600](https://github.com/facebookincubator/velox/pull/16600)  
  High-value validation tooling that could catch correctness regressions earlier; should be prioritized alongside active fuzzer failure investigation.

---

### Overall assessment

Velox is in a **healthy, fast-moving engineering phase** with strong momentum in execution features, CI scaling, GPU integration, and open table format support. The absence of a release today is offset by meaningful groundwork for future versions. The main risks remain **correctness edge cases uncovered by fuzzing**, **build/platform regressions**, and **review backlog on strategically important PRs**, especially around GPU and compatibility work.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-14

## 1. Today's Overview

Apache Gluten remained highly active over the last 24 hours, with **29 pull requests updated** and **5 issues updated**, indicating a strong development cadence despite **no new release cut today**. The bulk of activity is concentrated around the **Velox backend**, **Spark 4.x compatibility**, **CI/build modernization**, and a series of **correctness/memory-safety fixes** in core execution paths. A notable project-level change is the **removal of RAS**, suggesting maintainers are simplifying the optimization stack to reduce maintenance burden. Overall, the project looks healthy and fast-moving, with most changes focused on hardening execution behavior and reducing operational friction rather than landing a large user-facing feature drop.

---

## 3. Project Progress

### Merged/closed PRs today

These merged/closed items show where Gluten advanced most today:

- **Remove RAS**
  - PR: [#11756](https://github.com/apache/incubator-gluten/pull/11756)
  - Issue: [#11578](https://github.com/apache/incubator-gluten/issues/11578)
  - Impact: This is the most significant architectural change today. The RAS optimizer was removed because it created more maintenance cost than benefit. This simplifies the optimizer surface area and should reduce long-term complexity.
  - Breaking change: option renamed from `spark.gluten.ras.costModel` to `spark.gluten.costModel`.

- **Fix AssertNotNull mapping**
  - PR: [#11749](https://github.com/apache/incubator-gluten/pull/11749)
  - Impact: Improves **SQL expression compatibility/correctness** between Spark plans and Gluten translation, likely reducing execution mismatches for nullability-sensitive queries.

- **Redact credentials from build info**
  - Issue: [#11750](https://github.com/apache/incubator-gluten/issues/11750)
  - Related PR likely closed quickly as the issue was closed same day.
  - Impact: Important **security/build hygiene** improvement; prevents accidental leakage of `user:password` in generated build info and logs.

- **Trigger GPU docker build if script changes**
  - PR: [#11695](https://github.com/apache/incubator-gluten/pull/11695)
  - Impact: Improves **infra reliability** by ensuring container build paths are revalidated when scripts change, reducing stale CI coverage for GPU-related environments.

- **Adding context executor**
  - PR: [#11648](https://github.com/apache/incubator-gluten/pull/11648)
  - Impact: Suggests progress in **Velox execution/runtime infrastructure**, likely around execution context management or task scheduling support.

- **tools: fix gen function support script**
  - PR: [#11732](https://github.com/apache/incubator-gluten/pull/11732)
  - Impact: Helps **tooling and function support generation**, which can accelerate SQL function coverage and backend maintenance.

- **Add VeloxDelta.md for Delta Lake feature support**
  - PR: [#11733](https://github.com/apache/incubator-gluten/pull/11733)
  - Impact: Documentation progress around **Delta Lake support on Velox**, a useful signal for lakehouse compatibility maturation.

- **Closed but not merged / deferred items**
  - PR: [#11758](https://github.com/apache/incubator-gluten/pull/11758) — CPU cache batch support
  - PR: [#11759](https://github.com/apache/incubator-gluten/pull/11759) — lazy `numBytes` set for `ColumnarBatch`
  - Impact: These closures may indicate design reconsideration, supersession, or a need for rework in performance-sensitive data path changes.

### What this says about project direction
Today’s completed work leans toward:
- reducing optimizer/platform complexity,
- improving Spark semantic compatibility,
- tightening build/security processes,
- clarifying backend/lakehouse support documentation.

---

## 4. Community Hot Topics

### 1) Velox upstream gap tracking
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585) — **[VL] useful Velox PRs not merged into upstream**
- Activity: **16 comments, 4 👍**
- Why it matters: This is the clearest community hotspot. Gluten depends heavily on Velox, and contributors are tracking patches that are useful for Gluten but still not upstreamed. This points to a structural need: **faster upstream convergence** to reduce downstream maintenance and rebasing burden.
- Technical need behind it:
  - less patch carry in `gluten/velox`,
  - lower integration cost,
  - more predictable backend behavior across versions.

### 2) Spark 4.x disabled test tracking
- Issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550) — **Spark 4.x: Tracking disabled test suites**
- Activity: **6 comments**
- Why it matters: This is a roadmap-significant tracker. Spark 4.x enablement is clearly still in-progress, with disabled suites being explicitly managed.
- Technical need behind it:
  - improved Spark 4.0/4.1 semantic compatibility,
  - reduced gap in newer SQL features such as Variant/shredding paths,
  - re-enablement of coverage before broader adoption.

### 3) MacOS build enablement via VCPKG
- PR: [#11563](https://github.com/apache/incubator-gluten/pull/11563)
- Why it matters: Although comment counts are unavailable, this has remained active since early February, suggesting persistent demand for easier **Mac developer onboarding/build reproducibility**.
- Technical need:
  - standardized dependency management,
  - lower friction for local development and contributor setup.

### 4) Join optimization work: pullout pre-project
- PR: [#10851](https://github.com/apache/incubator-gluten/pull/10851)
- Why it matters: A long-lived WIP on **join support pullout pre-project** indicates continued interest in deeper join planning optimization across Velox and ClickHouse backends.
- Technical need:
  - better projection push/pull placement around joins,
  - reduced unnecessary computation,
  - stronger backend-specific physical planning.

---

## 5. Bugs & Stability

Ranked by likely severity based on user impact:

### High severity

#### 1) Shuffle ID retrieval broken by `ColumnarToCarrierRow` wrapping
- Issue: [#11752](https://github.com/apache/incubator-gluten/issues/11752)
- Title: **Fix AdaptiveSparkPlanExec wrapped by ColumnarToCarrierRow breaks shuffle IDs retrieval**
- Severity: **High**
- Why: This affects interaction with Spark adaptive planning and shuffle identification logic. Anything that breaks shuffle ID retrieval can destabilize AQE behavior, stage materialization assumptions, or downstream planning/execution correctness.
- Fix status: **No linked PR in provided data yet**.
- Risk area: Spark 4.x / adaptive execution integration.

#### 2) Memory leak in `ColumnarCollectLimitExec`
- PR: [#11754](https://github.com/apache/incubator-gluten/pull/11754)
- Severity: **High**
- Why: Leaking `ColumnarBatch` objects in skipped/sliced batch paths can create executor memory pressure and long-running job instability.
- Fix status: **Open PR exists**.
- Risk area: limit/offset processing in columnar execution paths.

### Medium severity

#### 3) Expression fallback bypass due to `Some(null)`
- PR: [#11757](https://github.com/apache/incubator-gluten/pull/11757)
- Severity: **Medium**
- Why: Returning `Some(null)` instead of `None` prevents expected fallback transformation logic, which can cause unsupported-expression handling bugs or incorrect planning behavior.
- Fix status: **Open PR exists**.
- Risk area: core expression conversion and compatibility fallback.

#### 4) Driver should avoid submitting subqueries during file format validation
- PR: [#11748](https://github.com/apache/incubator-gluten/pull/11748)
- Related issue: references [#11692](https://github.com/apache/incubator-gluten/issues/11692)
- Severity: **Medium**
- Why: Unnecessary subquery submission on the driver during validation can create side effects, overhead, or unexpected planning behavior.
- Fix status: **Open PR**.
- Risk area: planning-time correctness and driver overhead.

#### 5) Disabled Spark 4.x suites remain unresolved
- Issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550)
- Severity: **Medium**
- Why: Not a single bug, but a stability signal that some Spark 4.x functionality remains below the project’s desired confidence threshold.
- Fix status: partial progress via [#11726](https://github.com/apache/incubator-gluten/pull/11726).

### Low severity / operational

#### 6) Credential leakage in build info
- Issue: [#11750](https://github.com/apache/incubator-gluten/issues/11750)
- Severity: **Low-to-Medium**
- Why: This is an operational security concern rather than query correctness, but still important in CI and enterprise environments.
- Fix status: **Closed same day**.

---

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### Spark 4.x compatibility completion
- Tracker: [#11550](https://github.com/apache/incubator-gluten/issues/11550)
- Supporting PR: [#11726](https://github.com/apache/incubator-gluten/pull/11726)
- Signal: Very likely to remain a near-term priority. Re-enabling Variant-related suites for Spark 4.0/4.1 suggests the next meaningful milestone will include **broader Spark 4.x readiness**.

#### Better Velox parity and upstream alignment
- Tracker: [#11585](https://github.com/apache/incubator-gluten/issues/11585)
- Daily bump PR: [#11755](https://github.com/apache/incubator-gluten/pull/11755)
- Signal: Expect continued frequent Velox syncs and selective adoption of upstream capabilities. This is not a user-facing feature by itself, but it strongly predicts **backend feature unlocks and bug fixes** in upcoming versions.

#### Delta Lake support clarification and likely expansion
- Doc PR: [#11733](https://github.com/apache/incubator-gluten/pull/11733)
- Signal: Documentation investments often precede or consolidate broader adoption. Delta Lake support on Velox is becoming important enough to document explicitly, which suggests continued work in that area.

#### MacOS build improvements
- PR: [#11563](https://github.com/apache/incubator-gluten/pull/11563)
- Signal: This may land soon because it addresses contributor usability and build portability rather than controversial runtime semantics.

#### File size configuration for writes
- PR: [#11606](https://github.com/apache/incubator-gluten/pull/11606)
- Signal: This is a practical user-facing tuning enhancement for write path behavior and could plausibly appear in the next release if review completes.

### Less certain / exploratory
- CPU-cache batch support: [#11758](https://github.com/apache/incubator-gluten/pull/11758) was closed, so this optimization path may need redesign before resurfacing.
- Join pre-project pullout: [#10851](https://github.com/apache/incubator-gluten/pull/10851) remains longer-term and likely needs more maintainer bandwidth before landing.

---

## 7. User Feedback Summary

Based on today’s issue and PR stream, user/operator pain points are fairly clear:

- **Spark compatibility matters more than novelty right now.**
  - The Spark 4.x disabled-suite tracker ([#11550](https://github.com/apache/incubator-gluten/issues/11550)) and variant-suite enablement work ([#11726](https://github.com/apache/incubator-gluten/pull/11726)) show users want Gluten to behave reliably on newer Spark lines.

- **Users are sensitive to execution correctness in planner edge cases.**
  - Issues around adaptive plans, shuffle ID retrieval, null/assert mapping, and expression fallback indicate that planner/backend interop remains a real-world concern.

- **Operational polish is increasingly important.**
  - Credential redaction in build info ([#11750](https://github.com/apache/incubator-gluten/issues/11750)) and CI concurrency fixes ([#11760](https://github.com/apache/incubator-gluten/pull/11760)) suggest enterprise users and contributors need safer logs and more reliable automation.

- **Memory/resource handling remains a practical concern.**
  - The batch leak fix attempt in [#11754](https://github.com/apache/incubator-gluten/pull/11754) reflects sensitivity to long-running executor stability and memory efficiency.

- **Developer experience and portability are still active needs.**
  - MacOS VCPKG enablement ([#11563](https://github.com/apache/incubator-gluten/pull/11563)) suggests contributors want a smoother local build story.

Overall, feedback today is less about “please add major new SQL surface area” and more about “make the engine predictable, compatible, and easier to operate.”

---

## 8. Backlog Watch

These older or long-running items deserve maintainer attention:

### 1) Long-running join optimization WIP
- PR: [#10851](https://github.com/apache/incubator-gluten/pull/10851)
- Concern: Open since **2025-10-08**. This likely needs a maintainer decision: narrow scope, split into smaller PRs, or explicitly defer.
- Why important: Join planning is core to analytical performance.

### 2) MacOS VCPKG build support
- PR: [#11563](https://github.com/apache/incubator-gluten/pull/11563)
- Concern: Open since **2026-02-04**.
- Why important: Contributor onboarding and cross-platform build reproducibility.

### 3) Max write file size configuration
- PR: [#11606](https://github.com/apache/incubator-gluten/pull/11606)
- Concern: Open since **2026-02-11**.
- Why important: Write-path tunability is a practical feature for data lake workloads and file layout control.

### 4) Velox upstream dependency tracker
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)
- Concern: High-value but inherently open-ended.
- Why important: This tracker reflects ongoing backend technical debt and should remain visible to maintainers.

### 5) Spark 4.x disabled test tracker
- Issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550)
- Concern: Compatibility debt persists.
- Why important: This is probably the strongest blocker to full confidence on newer Spark versions.

---

## Overall Health Assessment

Apache Gluten appears **active and technically healthy**, with strong momentum in backend integration and maintenance work. The biggest positive signal is the project’s willingness to **remove costly complexity** (RAS) while continuing to improve **Spark 4.x compatibility**, **Velox alignment**, and **runtime correctness**. The main risks remain in **planner edge-case correctness**, **memory/resource handling**, and **unfinished compatibility debt** for newer Spark versions. No release was published today, but the current stream of fixes and cleanups looks like foundation work for a more stable next release.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-14

## 1. Today's Overview

Apache Arrow showed **moderate-to-high day-to-day maintenance activity** over the last 24 hours: **27 issues updated** and **17 PRs updated**, with **no new releases**. The work pattern is notably skewed toward **stability, CI reliability, packaging correctness, and low-level C++/Gandiva fixes**, rather than large new end-user features landing today. A visible theme is **Flight SQL / ODBC platform readiness**, especially around macOS support, alongside continued polishing of **Python docs/type infrastructure** and **Parquet C++ capabilities**. Overall project health looks solid: multiple bug reports were turned around quickly with matching PRs, but there are still several older infrastructure and Substrait-related items sitting in backlog.

## 2. Project Progress

### Merged/closed PRs today

The following PRs were closed/merged and represent concrete progress in engine correctness, platform support, and developer experience:

- **[GH-49507: [CI][Python] Doctest fails when pyarrow._cuda absent](https://github.com/apache/arrow/pull/49507)**  
  Closed quickly to stop false CI/documentation failures when CUDA modules are not built. This improves **documentation build stability** and reduces noise for Python contributors.  
  Related issue: **[Issue #49506](https://github.com/apache/arrow/issues/49506)**

- **[GH-49439: [C++][Gandiva] Optimize LPAD/RPAD functions](https://github.com/apache/arrow/pull/49439)**  
  Important for **SQL-expression execution quality** in Gandiva. It fixes a potential **memory safety issue** and improves padding performance, which matters for SQL-style string functions used in analytical pipelines.  
  Related issue: **[Issue #49438](https://github.com/apache/arrow/issues/49438)**

- **[GH-49455: [C++][Gandiva] Fix castVARCHAR_timestamp for pre-epoch timestamps](https://github.com/apache/arrow/pull/49455)**  
  A **query correctness fix**: formatting timestamps before 1970 no longer produces invalid negative millisecond fragments. This is directly relevant to historical datasets and SQL casting behavior.  
  Related issue: **[Issue #49454](https://github.com/apache/arrow/issues/49454)**

- **[GH-49453: [Python] Reintroduce docstring injection for stubfiles](https://github.com/apache/arrow/pull/49453)**  
  This advances Arrow’s **Python typing and API usability** story. Better stubs improve IDE support and downstream developer productivity, especially as `pyarrow`’s type annotations mature.  
  Related issue: **[Issue #49452](https://github.com/apache/arrow/issues/49452)**

- **[GH-49267: [C++][FlightRPC] Fix ODBC tests for MacOS](https://github.com/apache/arrow/pull/49267)**  
  This is meaningful for **Flight SQL connector portability**. Passing ODBC tests on macOS removes a blocker for broader platform support in Arrow’s SQL connectivity stack.  
  Related issue: **[Issue #49268](https://github.com/apache/arrow/issues/49268)**

- **[GH-49421: [C++][Gandiva] Fix castVARCHAR memory allocation and len<=0 handling](https://github.com/apache/arrow/pull/49421)**  
  A mix of **performance cleanup and edge-case correctness** in Gandiva string casting. These small expression-engine fixes often matter disproportionately for robustness in production SQL workloads.  
  Related issue: **[Issue #49420](https://github.com/apache/arrow/issues/49420)**

- **[GH-47294: [Parquet][C++] Rle BitPacked parser](https://github.com/apache/arrow/pull/47294)**  
  This is the most substantial storage-engine-facing item among closed PRs today. It introduces lower-level abstractions for **RLE/bit-packed decoding**, which can enable cleaner internals and future performance work in Parquet decoding paths.

### What this means technically

Today’s shipped progress is less about flagship features and more about **making Arrow safer and more correct at the execution/storage boundary**:
- **Gandiva** got multiple SQL-function correctness and safety improvements.
- **Flight SQL ODBC** moved closer to practical cross-platform usability.
- **Parquet C++ internals** advanced with a foundational decoding parser.
- **Python** developer ergonomics and CI reliability improved.

## 3. Community Hot Topics

### 1) Flight SQL ODBC on macOS
- **[Issue #47876: ODBC macOS `.pkg` Installer](https://github.com/apache/arrow/issues/47876)** — 5 comments  
- **[PR #46099: Arrow Flight SQL ODBC layer](https://github.com/apache/arrow/pull/46099)**  
- **[Issue #49268: Fix ODBC tests for MacOS](https://github.com/apache/arrow/issues/49268)**  
- **[PR #49267: Fix ODBC tests for MacOS](https://github.com/apache/arrow/pull/49267)**

**Why it matters:** This cluster shows Arrow is still investing in **Flight SQL as a real connector surface**, not just a protocol. The new installer request suggests users want a polished **distribution/install story**, not merely source-build capability. The underlying technical need is clear: if Flight SQL is to compete as a transport for BI and database interoperability, **ODBC packaging, test coverage, and platform parity** are essential.

### 2) Gandiva correctness and hardening
- **[Issue #49420](https://github.com/apache/arrow/issues/49420)** / **[PR #49421](https://github.com/apache/arrow/pull/49421)**
- **[Issue #49438](https://github.com/apache/arrow/issues/49438)** / **[PR #49439](https://github.com/apache/arrow/pull/49439)**
- **[Issue #49454](https://github.com/apache/arrow/issues/49454)** / **[PR #49455](https://github.com/apache/arrow/pull/49455)**
- **[PR #49471: Fix crashes in substring_index and truncate with extreme integer values](https://github.com/apache/arrow/pull/49471)**

**Why it matters:** There is concentrated attention on **string and scalar function behavior in Gandiva**, especially memory safety, overflow/extreme-input behavior, and SQL-compatible formatting. This suggests downstream users still depend on Gandiva for expression execution and are sensitive to **edge-case correctness**. The technical need is not new features but **trustworthiness under adversarial or unusual inputs**.

### 3) Python documentation, doctests, and typing
- **[Issue #49511: Table.join_asof occasionally fails in doctest](https://github.com/apache/arrow/issues/49511)** — 3 comments  
- **[Issue #49509: Minimize warnings and docutils errors for Sphinx build html](https://github.com/apache/arrow/issues/49509)**  
- **[PR #49510: Minimize warnings and docutils errors for Sphinx build html](https://github.com/apache/arrow/pull/49510)**  
- **[Issue #49506](https://github.com/apache/arrow/issues/49506)** / **[PR #49507](https://github.com/apache/arrow/pull/49507)**
- **[PR #48622: Add internal type system stubs](https://github.com/apache/arrow/pull/48622)**

**Why it matters:** Arrow’s Python surface is increasingly treated as a **typed, documented platform API**, not just bindings. The mix of doctest flakiness, Sphinx cleanup, and stub/type-system work reflects demand for **reliable docs, better static analysis, and smoother contributor workflows**.

### 4) Packaging / build integration pain
- **[Issue #49499: Snappy and Brotli debug libraries linked in Release builds with vcpkg multi-config](https://github.com/apache/arrow/issues/49499)** — 3 comments  
- **[PR #48964: Upgrade Abseil/Protobuf/GRPC/Google-Cloud-CPP bundled versions](https://github.com/apache/arrow/pull/48964)**

**Why it matters:** Consumers embedding Arrow in larger C++ systems continue to hit **toolchain and dependency integration friction**. This is a classic analytical-engine adoption problem: correctness alone is not enough if **Windows/vcpkg/CMake multi-config builds** are brittle.

## 4. Bugs & Stability

Ranked by likely production impact:

### High severity

1. **[Issue #49499: Release builds link debug Snappy/Brotli via vcpkg multi-config](https://github.com/apache/arrow/issues/49499)**  
   **Impact:** Build failure / ABI mismatch on Windows (`LNK2038`), affecting downstream integrators using Arrow as a dependency.  
   **Severity rationale:** This can block adoption in enterprise C++ environments.  
   **Fix PR:** None linked yet.

2. **[PR #49471: Gandiva crashes in `substring_index` and `truncate` with extreme integer values](https://github.com/apache/arrow/pull/49471)**  
   **Impact:** Runtime crashes (`SIGBUS`, `SIGSEGV`) in expression evaluation.  
   **Severity rationale:** Crashes in query-expression engines are serious, especially with untrusted/generated SQL.  
   **Fix status:** PR open; related issue appears to be bundled into the PR narrative rather than separately listed here.

3. **[Issue #49511: `Table.join_asof` occasionally fails in doctest](https://github.com/apache/arrow/issues/49511)**  
   **Impact:** Intermittent failures around `join_asof`, a core analytical join primitive.  
   **Severity rationale:** Even if currently observed in doctests, flakiness around temporal joins can hint at underlying nondeterminism or timing-sensitive semantics.  
   **Fix PR:** None yet.

### Medium severity

4. **[Issue #49506](https://github.com/apache/arrow/issues/49506)** / **[PR #49507](https://github.com/apache/arrow/pull/49507)**  
   **Impact:** Python doctests fail when CUDA extension is absent.  
   **Status:** Closed quickly.  
   **Severity rationale:** CI/docs issue, not a core data correctness bug.

5. **[Issue #49454](https://github.com/apache/arrow/issues/49454)** / **[PR #49455](https://github.com/apache/arrow/pull/49455)**  
   **Impact:** Wrong timestamp string output for pre-epoch values.  
   **Status:** Fixed/closed.  
   **Severity rationale:** Query correctness bug for historical timestamps.

6. **[Issue #49438](https://github.com/apache/arrow/issues/49438)** / **[PR #49439](https://github.com/apache/arrow/pull/49439)**  
   **Impact:** LPAD/RPAD had memory safety and performance issues.  
   **Status:** Fixed/closed.  
   **Severity rationale:** Could affect SQL string operation safety and efficiency.

7. **[Issue #49420](https://github.com/apache/arrow/issues/49420)** / **[PR #49421](https://github.com/apache/arrow/pull/49421)**  
   **Impact:** `castVARCHAR` had inefficiencies and missing `len<=0` handling.  
   **Status:** Fixed/closed.  
   **Severity rationale:** Edge-case correctness and memory waste, less severe than crashers.

### Lower severity but noteworthy

8. **[Issue #48743: Re-enable timezone tests once GCC fixes chrono::time_zone::get_info](https://github.com/apache/arrow/issues/48743)**  
   **Impact:** Test coverage gap due to upstream compiler/runtime behavior.  
   **Severity rationale:** Not an Arrow logic bug, but it delays confidence in C++20 timezone paths.

## 5. Feature Requests & Roadmap Signals

### Strong signals

1. **Flight SQL / ODBC packaging and multi-platform support**
   - **[Issue #47876: macOS `.pkg` installer](https://github.com/apache/arrow/issues/47876)**
   - **[PR #46099: Arrow Flight SQL ODBC layer](https://github.com/apache/arrow/pull/46099)**

   **Roadmap read:** Very likely to continue in the next release cycle. The combination of runtime support, tests, and packaging requests signals a push toward **production-ready SQL connectivity**.

2. **Parquet enhancements**
   - **[PR #49334: Support reading encrypted bloom filters](https://github.com/apache/arrow/pull/49334)**
   - **[PR #48468: limit row group size in bytes](https://github.com/apache/arrow/pull/48468)**

   **Roadmap read:** These are strong candidates for upcoming releases because they address practical storage-engine needs:
   - encrypted metadata interoperability,
   - more controllable writer behavior for file layout and performance.

3. **Python type system expansion**
   - **[PR #48622: internal type system stubs](https://github.com/apache/arrow/pull/48622)**
   - **[Issue #49505: DictionaryArray converter for `large_string` / `large_binary`](https://github.com/apache/arrow/issues/49505)**

   **Roadmap read:** Expect continued improvements in **typing, converters, and Python usability**. The `large_string`/`large_binary` converter gap is user-facing and likely to be addressed if maintainers want feature parity across Arrow scalar/container types.

4. **Substrait interoperability backlog**
   - **[Issue #31080](https://github.com/apache/arrow/issues/31080)**
   - **[Issue #20109](https://github.com/apache/arrow/issues/20109)**
   - **[Issue #20108](https://github.com/apache/arrow/issues/20108)**

   **Roadmap read:** These are important strategically, but the stale status suggests **not imminent** unless a dedicated contributor picks them up. They remain significant for Arrow’s role in cross-engine query planning and type interchange.

## 6. User Feedback Summary

The latest user-facing signals point to a few recurring pain points:

- **Installation and packaging friction still matters.**  
  The macOS Flight SQL ODBC installer request (**[Issue #47876](https://github.com/apache/arrow/issues/47876)**) and vcpkg multi-config linking bug (**[Issue #49499](https://github.com/apache/arrow/issues/49499)**) show users need Arrow to be easier to consume in real toolchains, especially outside Linux.

- **Edge-case SQL/function behavior is closely scrutinized.**  
  Multiple Gandiva reports show users are testing with unusual values: pre-epoch timestamps, zero/negative lengths, and extreme integer inputs. That implies Arrow is being used in environments where **function behavior must match SQL-engine expectations**, not just work for happy-path analytics.

- **Python users care about polished docs and typing.**  
  The burst of work around doctests, Sphinx warnings, and stubfiles suggests contributors and users want `pyarrow` to feel mature in IDEs, static checkers, and documentation workflows.

- **Feature gaps in Python containers remain visible.**  
  **[Issue #49505](https://github.com/apache/arrow/issues/49505)** shows users expect dictionary arrays to work consistently with `large_string` and `large_binary`, which is a reasonable expectation given Arrow’s type-system breadth.

## 7. Backlog Watch

These older items look important but under-attended and may need maintainer prioritization:

- **[Issue #32381: Improve error handling for hash table merges](https://github.com/apache/arrow/issues/32381)**  
  Old C++ enhancement with renewed activity. Since hash-table merges can underpin compute internals, weak error handling here may hide correctness or observability problems.

- **[Issue #31083: Store generated Flight protocol buffer headers in `src/generated`](https://github.com/apache/arrow/issues/31083)**  
  Build hygiene issue in FlightRPC. Not flashy, but generated-file layout affects packaging, reproducibility, and contributor ergonomics.

- **[Issue #31087: [FlightRPC][Docs] Document the authentication methods](https://github.com/apache/arrow/issues/31087)**  
  This is strategically important for adoption. Authentication ambiguity can slow production use of FlightRPC even if the protocol itself is technically sound.

- **Substrait-related stale items**
  - **[Issue #31080: extension types for different timestamp resolutions](https://github.com/apache/arrow/issues/31080)**
  - **[Issue #20109: compute functionality for Substrait types](https://github.com/apache/arrow/issues/20109)**
  - **[Issue #20108: correctly handle Substrait nullability](https://github.com/apache/arrow/issues/20108)**

  These matter for Arrow’s broader ecosystem positioning in interoperable analytical query engines, but their stale status suggests limited current bandwidth.

- **[PR #46099: Arrow Flight SQL ODBC layer](https://github.com/apache/arrow/pull/46099)**  
  Long-running and strategically important. It likely needs sustained review to prevent Flight SQL ODBC support from dragging across release cycles.

- **[PR #48964: Upgrade bundled Abseil/Protobuf/GRPC/Google-Cloud-CPP versions](https://github.com/apache/arrow/pull/48964)**  
  Dependency refreshes are essential but risky. This one likely needs careful maintainer attention because it may introduce **public API breakage**.

---

## Overall Health Assessment

Apache Arrow appears **healthy and responsive**, especially on bug turnaround and contributor throughput. The current workstream emphasizes **hardening**: function correctness, crash prevention, CI stabilization, packaging reliability, and platform support. The main risk is not lack of activity, but **review bandwidth on older strategic work**—notably Flight SQL ODBC, dependency upgrades, and Substrait interoperability.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*