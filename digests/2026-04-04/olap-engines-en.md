# Apache Doris Ecosystem Digest 2026-04-04

> Issues: 4 | PRs: 153 | Projects covered: 10 | Generated: 2026-04-04 01:21 UTC

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

# Apache Doris Project Digest — 2026-04-04

## 1. Today's Overview

Apache Doris remained **very active** over the last 24 hours, with **153 PR updates** and **4 issue updates**, indicating strong ongoing engineering throughput despite no new release being published. The day’s activity was dominated by **backend/FE fixes, optimizer work, storage-path improvements, and branch backports**, which suggests the project is in a period of heavy stabilization and feature refinement across multiple maintained versions. Several PRs focused on **query correctness, stream load safety/security, and execution-engine behavior**, all of which are high-value for production users. Overall, project health looks solid: contribution velocity is high, but the open queue also shows continued pressure around **stability, external integrations, and developer usability**.

## 3. Project Progress

### Merged/closed PRs today and what they advanced

#### Cluster policy extensibility added in FE
- [#62031](https://github.com/apache/doris/pull/62031) — **[feat](fe) Add ClusterGuard SPI interface for cluster-level policy enforcement**  
  This is a notable architectural improvement. It introduces a Service Provider Interface for cluster-level policy checks, decoupling policy enforcement from FE core logic. This signals continued movement toward **pluggability and enterprise policy integration**, useful for managed deployments and customized governance.

#### Query execution / point-query correctness
- [#61177](https://github.com/apache/doris/pull/61177) — **[fix](short-circuit) flatten multi-layer projections in short-circuit point queries**  
  This addresses a correctness problem in Nereids-generated multi-layer projections for point queries. It improves the reliability of **short-circuit execution paths**, especially for expression-heavy predicates and projection rewrites.

#### Cloud/logging operability
- [#61766](https://github.com/apache/doris/pull/61766) — **[fix](cloud) Fix cloud not print ms log**  
  This improves operational visibility in cloud/K8s deployments by restoring missing ms logs. While not a performance feature, it directly improves **diagnosability and production maintainability**.

#### Housekeeping closures
A number of older or stale PRs were closed automatically, including:
- [#56322](https://github.com/apache/doris/pull/56322) — UI dependency cleanup
- [#56383](https://github.com/apache/doris/pull/56383) — expression/plan consistency check
- [#56447](https://github.com/apache/doris/pull/56447) — branch-3.0 MySQL error handling cherry-pick
- [#62022](https://github.com/apache/doris/pull/62022) — FS SPI phase cleanup draft
- [#62112](https://github.com/apache/doris/pull/62112) — test PR closed due to LFS detection

These closures don’t materially move the product forward, but they do help keep the backlog cleaner.

### Important in-flight progress worth watching
Although still open, several PRs indicate where engineering attention is concentrated:
- [#61495](https://github.com/apache/doris/pull/61495) — **bucketed hash aggregation operator** for the pipeline engine
- [#61535](https://github.com/apache/doris/pull/61535) — **adaptive batch sizing for SegmentIterator**
- [#60601](https://github.com/apache/doris/pull/60601) — **multi-mode CBO CTE inline strategy**
- [#61707](https://github.com/apache/doris/pull/61707) — optimize `length(str_col)` using subcolumn access
- [#61783](https://github.com/apache/doris/pull/61783) — multi-catalog data lake reader refactoring

Together these suggest Doris is actively advancing in **query engine efficiency, optimizer sophistication, and lakehouse connector architecture**.

## 4. Community Hot Topics

Given the provided data, comment/reaction counts are limited, but the most strategically important active threads are:

### ANN index limitations by table model
- [Issue #61712](https://github.com/apache/doris/issues/61712) — **Why ANN index is only supported on Duplicate Key table model?**  
  This question reflects growing user interest in Doris’s **vector search / AI retrieval** capabilities. The underlying technical need is support for ANN on richer table semantics like **Unique Key** and **Aggregate Key** models, which is difficult because vector index maintenance interacts with update/merge semantics and compaction behavior. This issue is a roadmap signal that users want Doris to become more practical for **hybrid analytical + vector workloads**.

### Third-party Docker startup optimization
- [Issue #62101](https://github.com/apache/doris/issues/62101) — **[Track Issue] Optimize third-party Docker startup time and usability**  
  This is a broad developer experience and integration pain point. The issue highlights slow startup and heavyweight dependencies around Hive, Iceberg, and other external systems. The technical need is clearer local/integration-test ergonomics, likely via **modular containers, lazy startup, and lighter dependency orchestration**.

### JDBC query TVF column alias correctness
- [PR #61939](https://github.com/apache/doris/pull/61939) — **Preserve query TVF column aliases across JDBC catalogs**  
  This is important for **SQL compatibility and federated query correctness**. Users expect aliases defined in passthrough SQL to survive catalog boundaries; the PR addresses that expectation directly.

### Storage/scan correctness in runtime filter handling
- [PR #62114](https://github.com/apache/doris/pull/62114) — **Preserve IN_LIST runtime filter predicates when key range is a scope range**
- [PR #62115](https://github.com/apache/doris/pull/62115) — same fix in another branch/context  
  These PRs expose an execution nuance in how runtime filters and key range pruning interact. The underlying need is maintaining **aggressive scan pruning without sacrificing correctness**.

## 5. Bugs & Stability

### Severity 1 — Backend crash
- [Issue #61095](https://github.com/apache/doris/issues/61095) — **[Bug] BE crashed with a query**  
  Status: Closed  
  A backend crash is the most severe user-reported issue in today’s issue set because it implies process termination under query load. The summary indicates a BE crash in v4.0.2. Even though the issue is now closed, crashes in BE execution paths remain top-priority from an operator perspective. No explicit linked fix PR is shown in the provided data.

### Severity 2 — Stream load transaction / correctness / security path issues
A cluster of new FE/BE stream load fixes indicates active hardening in this area:
- [PR #62110](https://github.com/apache/doris/pull/62110) — **Validate stream load content length before group commit**
- [PR #62108](https://github.com/apache/doris/pull/62108) — **Mask sensitive headers in stream load logs**
- [PR #62109](https://github.com/apache/doris/pull/62109) — **Return early for non-master stream load precommit**
- [PR #62111](https://github.com/apache/doris/pull/62111) — **Reject invalid stream load tokens on commit and rollback**

These are highly relevant for production ingestion users. They point to prior weaknesses in **request validation, security hygiene, leadership routing, and transaction API consistency**.

Related user-facing historical issue:
- [Issue #56438](https://github.com/apache/doris/issues/56438) — **Stream load CDC aggregation transaction stuck in prepare stage**  
  Status: Closed as stale  
  Although stale-closed, the underlying problem is serious for CDC workloads: transactions lingering in prepare can block ingestion and operational recovery.

### Severity 3 — Query correctness bugs
- [PR #62043](https://github.com/apache/doris/pull/62043) — **fix wrong result of window funnel v2 + deduplication/fixed mode**  
  This is a correctness bug in a specialized aggregate function, important for event-sequence analytics.
- [PR #62094](https://github.com/apache/doris/pull/62094) — **Preserve coalesce nullability after conditional rewrite**  
  This addresses a planner/rewriter nullability regression in Nereids.
- [PR #61939](https://github.com/apache/doris/pull/61939) — **Preserve JDBC query TVF aliases**  
  Also a correctness/compatibility issue.

### Severity 4 — Execution/planning regressions and performance-affecting behavior
- [PR #62054](https://github.com/apache/doris/pull/62054) — **local shuffle exchange incorrectly marked as serial in pooling mode**
- [PR #61704](https://github.com/apache/doris/pull/61704) — **fix unstable test cases**
- [PR #62036](https://github.com/apache/doris/pull/62036) — **Avoid dict reads on mixed-encoding Iceberg position delete files**

These are lower severity than crashes, but important for performance stability, planner behavior, and external table reliability.

## 6. Feature Requests & Roadmap Signals

### Likely roadmap signals from today

#### 1) Better vector search integration with core Doris table models
- [Issue #61712](https://github.com/apache/doris/issues/61712)  
  User demand is clear: ANN should ideally work beyond Duplicate Key tables. This likely requires deeper work in **index maintenance semantics, mutable row handling, and compaction/update coordination**. It feels more like a **mid-term roadmap item** than an immediate patch release feature.

#### 2) Faster and more usable integration environments
- [Issue #62101](https://github.com/apache/doris/issues/62101)  
  This track issue suggests maintainers are aware that local/integration startup around Hive/Iceberg ecosystems is too heavy. Expect future work on **developer tooling, optionalized services, and more ergonomic Docker flows**—likely to land incrementally rather than as a headline feature.

#### 3) Query engine and optimizer sophistication
Open PRs strongly indicate the next version may include:
- [#61495](https://github.com/apache/doris/pull/61495) — bucketed aggregation operator
- [#60601](https://github.com/apache/doris/pull/60601) — multi-mode CBO CTE inline strategy
- [#61707](https://github.com/apache/doris/pull/61707) — string-length optimization via offset subcolumn reads
- [#61535](https://github.com/apache/doris/pull/61535) — adaptive SegmentIterator batch sizing

These are plausible candidates for upcoming minor releases because they improve **execution efficiency and optimizer quality** without obvious user-facing migration burden.

#### 4) Extensibility/SPIs in core architecture
- [#62031](https://github.com/apache/doris/pull/62031)
- [#62023](https://github.com/apache/doris/pull/62023)  
  The presence of ClusterGuard SPI and FS SPI work suggests Doris is becoming more modular, likely for **cloud, enterprise, and custom deployment environments**.

## 7. User Feedback Summary

Today’s user and contributor signals point to several recurring pain points:

### Production ingestion reliability matters a lot
The stream load-related fix cluster shows that users care deeply about:
- transaction correctness,
- better validation of malformed requests,
- proper master routing behavior,
- and avoiding token/header security mistakes.

This reflects real production use in **CDC, batch ingestion, and service-mediated loading**.

### SQL correctness across optimizer and federation layers is under scrutiny
Several active PRs target subtle correctness bugs in:
- Nereids rewrites,
- window funnel semantics,
- runtime filters,
- JDBC TVF alias preservation.

This suggests users are increasingly exercising Doris in **complex SQL and federated query scenarios**, where small semantic mismatches are highly visible.

### External ecosystem usability is still a friction point
The Docker startup tracking issue indicates that users working with **Hive/Iceberg and stateful third-party dependencies** face setup and testing friction. This is common for lakehouse-oriented deployments and may affect contributor onboarding too.

### Interest in AI/vector workloads is growing
The ANN index question is especially telling. Users are not just testing the feature—they want it aligned with Doris’s mainstream table models, implying a desire to use Doris for **hybrid analytical + semantic retrieval applications** rather than isolated demos.

## 8. Backlog Watch

These items appear to deserve maintainer attention due to strategic importance or aging status:

### Important open items
- [Issue #61712](https://github.com/apache/doris/issues/61712) — ANN index support limitations  
  Important because it touches future product positioning in vector/AI analytics.
- [Issue #62101](https://github.com/apache/doris/issues/62101) — third-party Docker startup usability  
  Important for contributor productivity and integration-test experience.

### Longer-running PRs with meaningful impact
- [PR #60601](https://github.com/apache/doris/pull/60601) — multi-mode CBO CTE inline strategy  
  Open since 2026-02-09; high optimizer significance.
- [PR #61495](https://github.com/apache/doris/pull/61495) — bucketed agg operator  
  Potentially impactful execution-engine enhancement.
- [PR #61535](https://github.com/apache/doris/pull/61535) — adaptive SegmentIterator batch sizing  
  Valuable storage/scan-path optimization.
- [PR #61783](https://github.com/apache/doris/pull/61783) — data lake reader refactoring  
  Important for maintainability and external catalog evolution.
- [PR #61939](https://github.com/apache/doris/pull/61939) — JDBC alias preservation  
  Worth prioritizing because it fixes visible SQL/federation behavior.

### Stale-closure caution
- [Issue #56438](https://github.com/apache/doris/issues/56438) — stream load CDC transaction stuck in prepare  
  Even though stale-closed, the workload described is operationally important. If similar reports recur, it may indicate a lingering ingestion/transaction edge case that deserves deeper triage rather than auto-closure.

---

## Overall Health Assessment

Apache Doris shows **strong engineering momentum** with heavy PR throughput and visible work across FE, BE, optimizer, storage, cloud, and ecosystem integration layers. The strongest positive signal is the balance between **forward-looking architecture work** and **practical correctness/stability fixes**. The main risks visible today are not lack of activity, but rather the breadth of active surfaces—**stream load reliability, planner correctness, and integration complexity** all continue to demand attention. Overall, the project appears healthy, highly active, and focused on making Doris more robust for both **core OLAP workloads and emerging lakehouse/vector use cases**.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-04-04

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains extremely active, but the center of gravity has shifted from “basic speed” to **correctness, interoperability, cloud-native operation, and developer ergonomics**. Across engines, the strongest signals are continued investment in **lakehouse connectivity, semi-structured/vector data support, optimizer sophistication, and production hardening**. The ecosystem is also fragmenting by architectural style: integrated MPP databases (Doris, ClickHouse, StarRocks), embedded analytics engines (DuckDB), table-format/storage layers (Iceberg, Delta Lake), and execution substrates (Velox, Arrow, Gluten). For technical decision-makers, this means the choice is increasingly less about raw benchmark performance and more about **fit to workload model, operational risk tolerance, and ecosystem alignment**.

---

## 2. Activity Comparison

### Daily activity and project health snapshot

| Project | Issues Updated | PRs Updated | Release Today | Health Score* | Key Signal |
|---|---:|---:|---|---:|---|
| **Apache Doris** | 4 | 153 | No | **8.7/10** | Very high throughput; strong balance of fixes + architectural work |
| **ClickHouse** | 50 | 184 | No | **8.5/10** | Huge activity; heavy correctness and regression stabilization load |
| **DuckDB** | 14 | 46 | No | **8.4/10** | Healthy and responsive; edge-case correctness under pressure |
| **StarRocks** | 7 | 77 | No | **8.3/10** | Strong execution on cloud-native PK/storage work; some serious security/stability issues |
| **Apache Iceberg** | 4 | 42 | No | **8.0/10** | Active implementation cycle; review bandwidth looks constrained |
| **Delta Lake** | 2 | 27 | No | **8.1/10** | Strong roadmap momentum; stacked PR complexity is the main risk |
| **Databend** | 2 | 11 | No | **7.9/10** | Lower volume but good responsiveness; meaningful feature work in flight |
| **Velox** | 4 | 50 | No | **7.8/10** | Strong momentum; CI/GPU-path instability is current caution |
| **Apache Gluten** | 3 | 9 | No | **7.7/10** | Focused progress; upstream dependency on Velox remains strategic constraint |
| **Apache Arrow** | 14 | 19 | No | **8.0/10** | Maintenance-heavy but healthy; strong ecosystem reliability work |

\*Health score is a qualitative synthesis of activity level, responsiveness, bug mix, architectural progress, and visible operational risk from today’s digest.

### Interpretation
- **Highest raw activity**: ClickHouse and Doris.
- **Most balanced momentum**: Doris, DuckDB, Iceberg.
- **Most feature-stack dependent/review-constrained**: Delta Lake, Iceberg, Gluten.
- **Most visibly under stabilization pressure**: ClickHouse, StarRocks, Velox.

---

## 3. Apache Doris’s Position

### Where Doris currently stands well vs peers

**Apache Doris is in a strong middle position between warehouse-style MPP databases and lakehouse-facing analytical engines.** Relative to peers, its advantages today are:

- **Very high engineering throughput** without looking chaotic.
- Simultaneous work across **FE, BE, optimizer, storage, cloud, ingestion, and extensibility/SPIs**.
- Strong attention to **production ingestion reliability** and **SQL correctness**, both highly relevant to enterprise adoption.
- Architectural movement toward **modularity** via ClusterGuard SPI and FS SPI work, which is a positive enterprise/cloud signal.

### Advantages vs peers

**Vs ClickHouse**
- Doris appears somewhat more focused on **enterprise operability and federated/lakehouse integration discipline**, while ClickHouse shows broader feature expansion but more visible wrong-result and regression pressure.
- Doris’s recent stream-load hardening suggests a stronger near-term focus on **ingestion governance and transactional safety**.

**Vs StarRocks**
- Doris looks more balanced across optimizer, SQL correctness, extensibility, and ingestion.
- StarRocks is currently more concentrated on **shared-data mode and persistent-index internals**, especially PK-table publish/init performance.

**Vs DuckDB**
- Doris is clearly positioned for **distributed, service-based OLAP** rather than embedded/local analytics.
- DuckDB leads in embedded developer adoption and single-node SQL ergonomics, but Doris is stronger for **always-on cluster analytics and ingestion pipelines**.

**Vs Iceberg/Delta Lake**
- Doris is not just a table-format/control-plane layer; it is a full serving engine.
- That gives Doris an advantage for teams wanting **one system for ingestion + acceleration + SQL serving**, rather than composing multiple layers.

### Technical approach differences

Doris’s technical posture today suggests:
- **Integrated FE/BE MPP database design**
- Strong internal investment in **Nereids optimizer correctness**
- Continued work on **pipeline execution**, scan-path tuning, and external catalog federation
- Expanding support for **enterprise policy hooks** and modular deployment behavior

This contrasts with:
- **ClickHouse**: highly optimized columnar engine with deep custom storage semantics
- **DuckDB**: embedded vectorized OLAP engine
- **StarRocks**: similar MPP OLAP category, but more aggressively cloud-native/shared-data PK oriented
- **Iceberg/Delta**: storage-table abstractions rather than full interactive compute engines

### Community size comparison

On today’s activity alone:
- **ClickHouse** has the largest visible issue/PR surface.
- **Doris** is in the top tier for contributor velocity and active maintenance.
- Doris looks larger and more active than **DuckDB, Iceberg, Delta, Databend, Velox, Gluten, Arrow** on current day throughput.
- Relative to **StarRocks**, Doris appears to have a broader active contribution footprint today, though both are healthy.

**Bottom line:** Doris is currently one of the most active full-stack OLAP engines in the open-source ecosystem, and likely in the **top tier by engineering momentum**.

---

## 4. Shared Technical Focus Areas

The same themes are showing up across multiple engines, which is useful for roadmap and vendor-selection decisions.

### A. Query correctness and optimizer safety
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Velox  
**Need:** Prevent silent wrong results as optimizers become more aggressive.

- **Doris**: runtime filters, nullability rewrites, point-query projection flattening, window funnel correctness
- **ClickHouse**: join rewrite wrong results, JSON index filtering dropping rows, function dispatch bugs
- **DuckDB**: wrong results in window optimizer and DISTINCT/CTE join scenarios
- **StarRocks**: follower FE queryability correctness, schema mismatch crash paths
- **Velox**: join correctness backlog, GPU zero-column edge-case semantics

**Takeaway:** The ecosystem is entering a phase where **semantic stability matters more than marginal micro-optimizations**.

### B. Lakehouse and external ecosystem interoperability
**Engines:** Doris, ClickHouse, StarRocks, Iceberg, Delta Lake, Arrow, Gluten  
**Need:** Better behavior across Iceberg, JDBC, REST, Parquet, Hadoop, ODBC, and object-store workflows.

- **Doris**: JDBC alias correctness, Docker usability for Hive/Iceberg stacks, data lake reader refactoring
- **ClickHouse**: URL engine extensibility, Parquet issues, external compatibility requests
- **StarRocks**: Iceberg V3 support demand, JDBC/Iceberg catalog noise
- **Iceberg**: Spark branch/snapshot correctness, REST planning, Kafka Connect reliability
- **Delta**: DSv2 + Kernel + CDC + REST/UC managed commit evolution
- **Arrow**: Hadoop LZ4 compatibility, Flight SQL ODBC packaging
- **Gluten**: Spark 4.0 and Iceberg metadata compatibility

**Takeaway:** The modern expectation is no longer isolated OLAP; it is **OLAP embedded in a heterogeneous lakehouse stack**.

### C. Cloud-native operability and production hardening
**Engines:** Doris, StarRocks, ClickHouse, Iceberg, Delta Lake  
**Need:** Better observability, safe admin behavior, remote planning resilience, and easier deployment.

- **Doris**: cloud log visibility, stream-load validation/security fixes, third-party Docker startup simplification
- **StarRocks**: shared-data mode tracing, security endpoint concerns, CVE response
- **ClickHouse**: query_log semantics, Docker env regression, operational telemetry demands
- **Iceberg**: REST planning timeout configurability
- **Delta**: managed commit path maturity, commit metadata tagging

### D. Semi-structured and advanced data types
**Engines:** ClickHouse, DuckDB, Delta Lake, Arrow, Databend, Doris  
**Need:** Safe support for JSON/Variant/Parquet/large types and newer interchange encodings.

- **ClickHouse**: JSON indexing correctness, Dynamic/Variant edge cases
- **DuckDB**: VARIANT to Parquet, HUGEINT precision preservation
- **Arrow**: large string/binary DictionaryArray support
- **Databend**: CSV/TEXT encoding, AUTO datetime parsing
- **Delta**: protocol precision and CDC/deletion-vector correctness
- **Doris**: ANN/vector-search demand beyond Duplicate Key tables

### E. Developer experience and test/integration ergonomics
**Engines:** Doris, ClickHouse, DuckDB, Arrow, Gluten, Velox  
**Need:** Faster CI, lighter local environments, better test reproducibility.

- **Doris**: third-party Docker startup optimization
- **ClickHouse**: machine-assisted issue triage, CI/sanitizer activity
- **DuckDB**: CI job computation improvements
- **Arrow**: CI policy fixes across language bindings
- **Gluten**: Docker/CI compliance with ASF policy
- **Velox**: macOS test discoverability fixes

---

## 5. Differentiation Analysis

## A. Storage format and system boundary

| Engine | Primary Identity |
|---|---|
| **Apache Doris** | Integrated MPP analytical database |
| **ClickHouse** | Integrated high-performance columnar OLAP DB |
| **DuckDB** | Embedded analytical database |
| **StarRocks** | MPP OLAP DB with strong cloud-native/shared-data focus |
| **Apache Iceberg** | Open table format + metadata layer |
| **Delta Lake** | Open table format + transaction protocol |
| **Databend** | Cloud data warehouse / analytical DB with object-storage-centric design |
| **Velox** | Execution engine library |
| **Gluten** | Spark acceleration layer |
| **Arrow** | Cross-language in-memory columnar data platform |

**Key distinction:** Doris competes most directly with **ClickHouse** and **StarRocks**, not with Iceberg/Delta/Arrow, which sit lower or adjacent in the stack.

## B. Query engine design

- **Doris**: distributed MPP SQL engine with FE/BE architecture, active optimizer and pipeline evolution.
- **ClickHouse**: highly specialized OLAP engine optimized for scan-heavy analytical execution.
- **DuckDB**: vectorized embedded engine optimized for local/in-process analytics.
- **StarRocks**: MPP engine with strong investment in shared-data/cloud-native PK table behavior.
- **Velox/Gluten**: components enabling execution acceleration under other systems rather than standalone analytical platforms.

## C. Target workloads

| Engine | Best-fit workload profile |
|---|---|
| **Doris** | Interactive BI, real-time ingestion + OLAP, federated/lakehouse analytics |
| **ClickHouse** | Large-scale analytical serving, logs/observability/event analytics |
| **DuckDB** | Local analytics, notebooks, embedded ETL, developer workflows |
| **StarRocks** | Cloud-native OLAP, PK-heavy real-time analytics, lakehouse serving |
| **Iceberg** | Open table management for large lakehouse data estates |
| **Delta Lake** | Transactional lakehouse pipelines, Spark-centric governed data platforms |
| **Databend** | Cloud warehouse + data versioning/branching-oriented workflows |

## D. SQL compatibility posture

- **Doris**: increasingly focused on SQL correctness across optimizer and federation layers.
- **ClickHouse**: powerful but still visibly wrestling with SQL standard compatibility and edge-case semantics.
- **DuckDB**: generally strong SQL ergonomics, but advanced optimizer correctness is under active hardening.
- **StarRocks**: practical SQL warehouse posture, but current visible work is more storage/cloud than SQL language expansion.
- **Delta/Iceberg**: SQL compatibility depends heavily on surrounding compute engines.
- **Velox/Gluten**: compatibility is downstream-engine dependent, especially with Spark/Presto semantics.

---

## 6. Community Momentum & Maturity

### Activity tiers

#### Tier 1: Very high momentum
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

These projects show the highest visible engineering throughput.  
Difference:
- ClickHouse: highest scale, but also highest correctness/regression noise
- Doris: best balance of throughput and architectural coherence
- StarRocks: intense focus on cloud-native storage path hardening

#### Tier 2: High momentum, focused evolution
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **Velox**

These are highly active but with more concentrated agendas:
- DuckDB: correctness + SQL/parser/storage polish
- Iceberg: spec/connector correctness + review bottlenecks
- Delta: major roadmap stacks around Kernel/DSv2/CDC
- Velox: execution-engine and GPU-path iteration

#### Tier 3: Selective but meaningful momentum
- **Databend**
- **Apache Arrow**
- **Apache Gluten**

These are healthy, but with smaller visible daily volume or more specialized scope.

### Rapidly iterating vs stabilizing

**Rapidly iterating**
- ClickHouse
- Doris
- StarRocks
- Delta Lake
- Velox

**More stabilization-oriented**
- DuckDB
- Iceberg
- Arrow
- Gluten

**Mixed mode**
- Databend: moderate feature expansion, but still focused on correctness in key semantics

### Maturity readout

- **Most mature integrated OLAP communities by visible operating scale**: ClickHouse, Doris
- **Most mature table-format communities**: Iceberg, Delta
- **Most mature embedded analytics community**: DuckDB
- **Fast-rising but still cloud-path hardening**: StarRocks, Databend

---

## 7. Trend Signals

### 1. Wrong-result bugs are now treated as top-tier incidents
Across Doris, ClickHouse, DuckDB, and StarRocks, the community is increasingly sensitive to **silent correctness failures**, not just crashes.  
**Value for architects:** benchmark wins are insufficient; optimizer maturity and semantic guardrails should be part of platform evaluation.

### 2. Lakehouse interoperability is now baseline, not premium
Doris, StarRocks, ClickHouse, Iceberg, Delta, Arrow, and Gluten all show active pressure around **Iceberg/Delta/Parquet/JDBC/REST/Hadoop/Spark integration**.  
**Value for data engineers:** choose engines based on how cleanly they fit into your existing metadata, object storage, and compute ecosystem.

### 3. Cloud-native operational safety is becoming a buying criterion
Security of admin endpoints, commit-path governance, REST planning behavior, observability semantics, and easier Docker/dev startup all appear as recurring needs.  
**Value for platform teams:** operational ergonomics and security posture are now first-class differentiators.

### 4. Semi-structured and hybrid workloads are expanding fast
JSON, Variant, vector/ANN, deletion vectors, Arrow view types, and large-type fidelity are all active themes.  
**Value for architects:** future-proof analytical stacks need to handle **structured + semi-structured + AI-adjacent retrieval** in one operational model.

### 5. Developer productivity is part of engine competitiveness
Faster CI, lighter integration environments, reproducible tests, and packaging quality matter across almost every project.  
**Value for engineering leaders:** adoption cost increasingly depends on how painful local testing, upgrades, and ecosystem integration are.

### 6. Doris-specific trend signal
Doris is notably well aligned with the current market direction:
- stronger **federated/lakehouse usage**
- continued **real-time ingestion hardening**
- growing **vector search interest**
- more **enterprise-grade extensibility and policy integration**

**Decision-maker takeaway:** Doris is well positioned for teams that want a single analytical serving layer spanning **real-time OLAP, federated SQL, and evolving lakehouse/AI-adjacent requirements**, while still maintaining high contributor momentum.

---

## Final Takeaway

For 2026-04-04, **Apache Doris stands out as one of the healthiest full-stack OLAP engines in the ecosystem**: high activity, visible architectural progress, and a strong balance between forward-looking features and production hardening. ClickHouse remains the highest-volume peer but is carrying more correctness/regression complexity. StarRocks is strong in cloud-native storage internals, DuckDB remains dominant in embedded analytics, and Iceberg/Delta continue to define the table-format control plane. For teams choosing an engine today, the key differentiator is no longer just speed—it is **how well the project balances correctness, operability, ecosystem compatibility, and roadmap execution**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-04-04

## 1) Today's Overview

ClickHouse remains extremely active: **50 issues** and **184 PRs** saw updates in the last 24 hours, with **67 PRs merged/closed** and **8 issues closed**. The current signal is mixed but healthy: there is strong engineering throughput, while a noticeable share of issue traffic is focused on **query correctness**, **crash fixes**, **CI/sanitizer failures**, and **edge-case regressions** in newer functionality like JSON, Variant/Dynamic, and optimizer rewrites. No new release was published today, so most attention is on stabilizing trunk and backportable bug fixes rather than packaging. Overall, project health looks good from an activity perspective, but the issue mix suggests the team is still paying down complexity introduced by rapid feature expansion in SQL semantics, storage internals, and semi-structured data support.

## 3) Project Progress

With **67 PRs merged/closed** in the last 24h, progress appears concentrated around validation, correctness, and operational safety rather than headline features.

Notable closed/landed work includes:

- **Prevent creating materialized views that write to nonexistent columns** — a significant usability/safety improvement for MV workflows, reducing silent schema mistakes in production pipelines.  
  PR: [#74481](https://github.com/ClickHouse/ClickHouse/pull/74481)

- **Allow altering database comments** — a smaller SQL/DDL quality-of-life feature that improves metadata management and schema governance.  
  PR: [#75622](https://github.com/ClickHouse/ClickHouse/pull/75622)

Closed issues also indicate progress on correctness and dependency hygiene:

- **USearch ASan heap-buffer-overflow** was closed, suggesting sanitizer-discovered third-party vector/search stack problems are being addressed.  
  Issue: [#100556](https://github.com/ClickHouse/ClickHouse/issues/100556)

- **Compound interval literal support request** was closed, though without the PR list showing the implementation path here; worth watching whether this was resolved, rejected, or superseded.  
  Issue: [#99611](https://github.com/ClickHouse/ClickHouse/issues/99611)

- Several **ClickGap-reported code-quality/correctness items** were opened and some closed quickly the same day, indicating maintainers are actively triaging machine-assisted findings.  
  Closed examples: [#101719](https://github.com/ClickHouse/ClickHouse/issues/101719), [#101717](https://github.com/ClickHouse/ClickHouse/issues/101717)

Open PRs updated today show where engineering effort is going next:

- **Crash and correctness fixes in expression folding and joins**:  
  [#101690](https://github.com/ClickHouse/ClickHouse/pull/101690), [#101684](https://github.com/ClickHouse/ClickHouse/pull/101684), [#101675](https://github.com/ClickHouse/ClickHouse/pull/101675)

- **MergeTree reader invariant fix**:  
  [#101683](https://github.com/ClickHouse/ClickHouse/pull/101683)

- **Patch-part optimization** and **Bloom filter performance work**:  
  [#101679](https://github.com/ClickHouse/ClickHouse/pull/101679), [#100201](https://github.com/ClickHouse/ClickHouse/pull/100201)

- **Join runtime filter adaptivity via statistics**:  
  [#97501](https://github.com/ClickHouse/ClickHouse/pull/97501)

- **Experimental part-level aggregate caching** for MergeTree GROUP BY:  
  [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757)

## 4) Community Hot Topics

Most active discussions and the technical needs behind them:

- **CI crash: Double deletion of MergeTreeDataPartCompact in multi_index**  
  Issue: [#99799](https://github.com/ClickHouse/ClickHouse/issues/99799)  
  This is the most commented open issue today and points to a potentially serious **lifecycle/ownership bug in MergeTree part management**. The community need here is clear: confidence that storage-engine internals remain safe under advanced indexing and merge paths.

- **Query logged as ExceptionBeforeStart despite long runtime and memory usage**  
  Issue: [#97459](https://github.com/ClickHouse/ClickHouse/issues/97459)  
  This reflects user demand for **accurate observability semantics** in `query_log`. For operators, misclassified failures distort troubleshooting, billing, and SLO analysis.

- **Support JSON type in `generateRandom()`**  
  Issue: [#92360](https://github.com/ClickHouse/ClickHouse/issues/92360)  
  Benchmarking and test-data generation for semi-structured data is becoming a real need. This is a strong sign that **JSON is moving from novelty toward routine workload support**.

- **MinMax index on JSON column silently drops valid rows**  
  Issue: [#101700](https://github.com/ClickHouse/ClickHouse/issues/101700)  
  This is a high-interest correctness topic because it touches the dangerous class of bugs where the engine returns **wrong results without obvious failure**. It also highlights pressure to make JSON interact safely with classic indexing infrastructure.

- **URL engine/schema extensibility**  
  Issue: [#59617](https://github.com/ClickHouse/ClickHouse/issues/59617)  
  Longstanding demand continues for more flexible URL/file/s3 semantics, suggesting users want **a more unified external-data access layer** across table functions and engines.

- **SQL standard compatibility mode**  
  Issue: [#98600](https://github.com/ClickHouse/ClickHouse/issues/98600)  
  This request is strategically important. It reflects broader adoption by teams wanting ClickHouse performance without paying a large SQL dialect migration cost.

On the PR side, the most strategically meaningful open work today includes:

- **PartialAggregateCache**  
  PR: [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757)  
  Suggests ongoing investment in **repeated-query acceleration** for MergeTree analytics.

- **Statistics-based disabling of join runtime filters**  
  PR: [#97501](https://github.com/ClickHouse/ClickHouse/pull/97501)  
  Indicates a maturing cost/benefit approach in the query optimizer.

## 5) Bugs & Stability

Ranked by likely severity and user impact:

### Critical: wrong results / silent correctness hazards

1. **MinMax index on JSON can silently drop valid rows**  
   Issue: [#101700](https://github.com/ClickHouse/ClickHouse/issues/101700)  
   Severity is high because the failure mode is **incorrect query results**, not a loud exception. No linked fix PR is shown in the provided data.

2. **`tryConvertJoinToIn` allows ALL strictness, reducing row counts on duplicate keys**  
   Issue: [#101698](https://github.com/ClickHouse/ClickHouse/issues/101698)  
   Another optimizer-induced wrong-result bug; this is especially important because `INNER JOIN` defaults can make the behavior less obviously exotic. No fix PR listed here.

3. **`positiveModulo(tuple, number)` dispatches to division path**  
   Issue: [#101699](https://github.com/ClickHouse/ClickHouse/issues/101699)  
   A function dispatch bug causing mathematically wrong output. Likely narrower blast radius than join/index issues, but still correctness-sensitive.

### High: crashes and storage-engine safety

4. **Double deletion in MergeTree compact part handling**  
   Issue: [#99799](https://github.com/ClickHouse/ClickHouse/issues/99799)  
   A storage-engine crash in CI is serious even if not yet confirmed in production workloads.

5. **Primary key type mismatch crash after ALTER TABLE**  
   PR: [#101063](https://github.com/ClickHouse/ClickHouse/pull/101063)  
   A fix is in flight and marked for backport, which raises confidence this is understood and considered operationally important.

6. **Crash in comparison constant folding with Variant NULL and LowCardinality**  
   PR: [#101690](https://github.com/ClickHouse/ClickHouse/pull/101690)  
   Good example of the complex interactions emerging as ClickHouse extends type-system features.

7. **Join constraint overwrite in Cross/Comma joins causing projection folding crash**  
   PR: [#101684](https://github.com/ClickHouse/ClickHouse/pull/101684)

8. **Assertion failure involving DDL worker / transaction state**  
   Issue: [#101615](https://github.com/ClickHouse/ClickHouse/issues/101615)  
   Could indicate concurrency/transactional edge cases in distributed DDL paths.

### Medium: regressions and operator-facing failures

9. **`extract-from-config` not resolving `from_env` in 26.2.5, breaking Docker entrypoint flows**  
   Issue: [#101704](https://github.com/ClickHouse/ClickHouse/issues/101704)  
   High operational relevance because it may affect containerized deployments on upgrade.

10. **Parquet read error in v26.2.4.23 with binary string column and predicate**  
    Issue: [#99019](https://github.com/ClickHouse/ClickHouse/issues/99019)  
    Important for lakehouse-style ingestion and federated analytics.

11. **`materialize_skip_indexes_on_merge=false` not respected for text indexes**  
    Issue: [#101666](https://github.com/ClickHouse/ClickHouse/issues/101666)  
    More of a settings/behavior consistency bug, but meaningful for merge-cost management.

12. **Disk cache thread-pool startup crash**  
    PR: [#101712](https://github.com/ClickHouse/ClickHouse/pull/101712)  
    A targeted fix appears available.

### CI / fuzz / sanitizer watch

- **MemorySanitizer use-of-uninitialized-value**  
  Issue: [#101649](https://github.com/ClickHouse/ClickHouse/issues/101649)

- **Failed to rename temporary part during merge**  
  Issue: [#99307](https://github.com/ClickHouse/ClickHouse/issues/99307)

These continue to show strong internal test coverage, even if they add noise to issue volume.

## 6) Feature Requests & Roadmap Signals

Strong user-requested themes today:

- **JSON support in `generateRandom()`**  
  Issue: [#92360](https://github.com/ClickHouse/ClickHouse/issues/92360)  
  This feels plausible for a near-term release because it is scoped, useful for testing, and aligned with broader JSON adoption.

- **SQL standard compatibility setting/mode**  
  Issue: [#98600](https://github.com/ClickHouse/ClickHouse/issues/98600)  
  Harder to land quickly because it spans many settings and semantics, but it is strategically important. Expect incremental movement rather than a full compatibility mode in one release.

- **Unified/extended URL engine schemas and relative URLs**  
  Issue: [#59617](https://github.com/ClickHouse/ClickHouse/issues/59617)  
  This has roadmap value for data access ergonomics, especially if ClickHouse keeps expanding table-function and object-store workflows.

- **`system.query_log.used_index_types` telemetry column**  
  Issue: [#101673](https://github.com/ClickHouse/ClickHouse/issues/101673)  
  This is highly actionable and aligns with observability needs; it has a good chance of landing relatively soon because it is concrete and low-risk.

- **HTTP redirect support for URL-engine writes**  
  PR: [#98977](https://github.com/ClickHouse/ClickHouse/pull/98977)  
  Already in PR form and likely a good candidate for an upcoming version if review goes smoothly.

- **Alter database comment**  
  PR: [#75622](https://github.com/ClickHouse/ClickHouse/pull/75622)  
  Already closed, so likely to surface in a future packaged release if not already included elsewhere.

Most likely near-next-version candidates from today’s signals:
1. Targeted bug fixes around joins, constant folding, MergeTree reader behavior.
2. Small operational/observability enhancements like index usage logging.
3. Narrow feature additions around URL engine behavior and SQL metadata DDL.

## 7) User Feedback Summary

Real user pain points visible in today’s issue set:

- **Upgrade regressions matter more than new features**: users are reporting behavior changes in **26.2.x**, including config/env resolution and Parquet reading. This suggests production users are closely tracking minor-version reliability.  
  Issues: [#101704](https://github.com/ClickHouse/ClickHouse/issues/101704), [#99019](https://github.com/ClickHouse/ClickHouse/issues/99019)

- **Observability and logging semantics are still rough in edge cases**: users want query lifecycle classification, timeout behavior, and query log contents to match reality.  
  Issues: [#97459](https://github.com/ClickHouse/ClickHouse/issues/97459), [#101579](https://github.com/ClickHouse/ClickHouse/issues/101579), [#101673](https://github.com/ClickHouse/ClickHouse/issues/101673)

- **Semi-structured data support is under scrutiny**: JSON is increasingly used, but indexing, comparability, and test tooling are not yet consistently safe or ergonomic.  
  Issues: [#101700](https://github.com/ClickHouse/ClickHouse/issues/101700), [#92360](https://github.com/ClickHouse/ClickHouse/issues/92360)

- **Compatibility with broader ecosystems remains a priority**: SQL standard behavior, MySQL dictionaries, URL/file/s3 schemes, Docker env flows, and HTTP POST redirect handling all point to demand for smoother integration into heterogeneous stacks.  
  Issues/PRs: [#98600](https://github.com/ClickHouse/ClickHouse/issues/98600), [#101578](https://github.com/ClickHouse/ClickHouse/issues/101578), [#59617](https://github.com/ClickHouse/ClickHouse/issues/59617), [#98977](https://github.com/ClickHouse/ClickHouse/pull/98977)

- **Users still hit sharp edges in distributed SQL and dictionaries**: older issues about distributed joins and dictionary failures remain active, implying these areas are functionally important but still operationally sensitive.  
  Issues: [#52605](https://github.com/ClickHouse/ClickHouse/issues/52605), [#53341](https://github.com/ClickHouse/ClickHouse/issues/53341)

## 8) Backlog Watch

Long-lived or strategically important items that appear to need maintainer attention:

- **Extending schemas and relative URLs in URL engine**  
  Issue: [#59617](https://github.com/ClickHouse/ClickHouse/issues/59617)  
  Open since 2024 and still relevant to external-data usability.

- **Distributed joins + union/subquery alias resolution bug**  
  Issue: [#52605](https://github.com/ClickHouse/ClickHouse/issues/52605)  
  Open since 2023; impacts complex SQL workloads and planner/name-resolution confidence.

- **Dictionary update failure behavior**  
  Issue: [#53341](https://github.com/ClickHouse/ClickHouse/issues/53341)  
  Also open since 2023; dictionaries remain a key integration surface and deserve clearer ownership.

- **SQL standard compatibility setting**  
  Issue: [#98600](https://github.com/ClickHouse/ClickHouse/issues/98600)  
  Newer but strategically important; likely needs design-level maintainer input rather than routine triage.

- **PartialAggregateCache experimental PR**  
  PR: [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757)  
  Large performance feature, open since January 2026. This likely needs focused review to avoid stagnation.

- **Statistics-based join runtime filter disabling**  
  PR: [#97501](https://github.com/ClickHouse/ClickHouse/pull/97501)  
  Important optimizer work that could materially improve query efficiency in real workloads.

---

### Bottom line

Today’s ClickHouse signal is that of a **fast-moving, high-throughput project** with strong ongoing engineering work, but with meaningful stabilization pressure around **correctness**, **advanced type interactions**, **optimizer rewrites**, and **operational compatibility**. The healthiest signs are the volume of active fixes and targeted PRs; the biggest risks are the wrong-result issues involving JSON indexes and join rewrites, plus upgrade-related regressions in 26.2.x.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-04-04

## 1) Today’s Overview

DuckDB showed **high development activity** over the last 24 hours, with **46 PRs updated** and **14 issues updated**, indicating an actively maintained core engine and fast response to incoming regressions. The work is concentrated in three areas: **query correctness**, **SQL/parser/binder behavior**, and **storage/serialization reliability**—especially around Parquet, sequences, views, and window processing. There were **no new releases**, so current progress is happening on mainline development and review rather than through a packaged milestone. Overall project health looks **strong but bug-heavy at the edge**, with multiple correctness and internal-error reports being triaged or already paired with candidate fixes.

---

## 2) Project Progress

### Merged/closed PRs today

Several PRs were closed or merged, showing forward motion on engine internals, parser features, and CI reliability:

- [PR #21800](https://github.com/duckdb/duckdb/pull/21800) — **Fix ADBC data race**  
  Closed after addressing a use-after-free/data race scenario reported through ADBC bindings. This is significant for embedded and client-library stability, especially in GC-heavy environments such as Go.

- [PR #21693](https://github.com/duckdb/duckdb/pull/21693) — **Add expression as DatabasePath argument to ATTACH**  
  Closed/merged, advancing SQL flexibility in `ATTACH` by allowing expressions for database paths in the new parser path. This is a useful compatibility and ergonomics improvement for dynamic attachment workflows.

- [PR #21775](https://github.com/duckdb/duckdb/pull/21775) — **TopN Window Sets**  
  Closed after adding a schema projection when optimization is used by set operations. This suggests continuing refinement of **window execution and optimization correctness**.

- [PR #21562](https://github.com/duckdb/duckdb/pull/21562) — **Window Function Binding**  
  Closed after a broad refactor moving window binding into the binder/functions, including LEAD/LAG argument handling and NULLS validation. This is a notable internal cleanup that should make future window-function behavior more consistent and extensible.

- [PR #21799](https://github.com/duckdb/duckdb/pull/21799) — **Compute CI jobs and save_cache dynamically**  
  Closed, improving CI efficiency and job staging. Not user-facing, but helpful for maintaining high development velocity.

- [PR #21817](https://github.com/duckdb/duckdb/pull/21817) — **Fix CreateViewInfo::Copy() not copying names**  
  Closed quickly and superseded by [PR #21819](https://github.com/duckdb/duckdb/pull/21819), indicating active iteration on a view metadata copying bug.

### What this means technically

Today’s completed work points to progress in:
- **Window function infrastructure**
- **Connector/client stability**
- **Parser and SQL expressiveness**
- **Metadata/catalog correctness**
- **CI/developer tooling**

This is consistent with a project that is both expanding SQL coverage and hardening internals as new optimizations land.

---

## 3) Community Hot Topics

### Most active issues

- [Issue #19804](https://github.com/duckdb/duckdb/issues/19804) — **Incorrect Historical DST Handling in TIMESTAMPTZ Display**  
  21 comments  
  Although closed, this was the most discussed issue in the updated set. The underlying need is clear: users expect **historically correct timezone offset rendering**, not application of a current offset to past timestamps. This is especially important for analytics involving audit logs, finance, and historical event replay.

- [Issue #21779](https://github.com/duckdb/duckdb/issues/21779) — **INTERNAL Error writing VARIANT column to Parquet**  
  6 comments  
  This highlights demand for reliable **semi-structured data export**. DuckDB users increasingly push JSON/VARIANT workflows into Parquet pipelines, so failures here hit real ETL workloads.

- [Issue #21180](https://github.com/duckdb/duckdb/issues/21180) — **Loss of Precision when Writing HUGEINT Columns to Parquet**  
  6 comments  
  The technical need is robust preservation of very large integers in lakehouse/Parquet interchange. This is a critical issue for IDs, blockchain, telemetry counters, and scientific datasets.

- [Issue #21592](https://github.com/duckdb/duckdb/issues/21592) — **WindowSelfJoinOptimizer produces wrong results for ROWS frames**  
  4 comments  
  This reflects a recurring pattern: aggressive optimizer rules need tighter semantic guards. Users care more about correctness than optimization wins when window frames are involved.

### Most interesting active PR discussions

- [PR #21634](https://github.com/duckdb/duckdb/pull/21634) — **Support DML statements as CTE bodies**  
  This is a strong SQL feature signal. It would bring DuckDB closer to systems that support data-modifying CTEs and improve compatibility with advanced SQL workflows.

- [PR #21762](https://github.com/duckdb/duckdb/pull/21762) — **Unify TableFilters with Expressions**  
  This is an architectural PR with potentially broad impact. It suggests maintainers are trying to reduce duplicated predicate logic and make optimization/pushdown machinery more coherent.

- [PR #21776](https://github.com/duckdb/duckdb/pull/21776) — **Pull up projections with non-colref expressions**  
  This points to continued optimizer sophistication, especially around projection movement and plan simplification.

- [PR #21818](https://github.com/duckdb/duckdb/pull/21818) — **Window Function Binding**  
  Together with earlier related PRs, this indicates window semantics are an active subsystem under refactor.

---

## 4) Bugs & Stability

Ranked roughly by severity and likely user impact:

### 1. Query correctness bugs
These are the most serious class because they can silently produce wrong answers.

- [Issue #21592](https://github.com/duckdb/duckdb/issues/21592) — **Wrong results from WindowSelfJoinOptimizer for `ROWS` frames**  
  Severity: **Critical**  
  The optimizer appears to apply a transformation valid only for full-partition windows to explicit `ROWS` frames. This is a classic semantic bug in query optimization. No linked fix PR is listed in the provided data.

- [Issue #21757](https://github.com/duckdb/duckdb/issues/21757) — **Intermittent wrong results with `SELECT DISTINCT` in CTE + `LEFT JOIN` on empty table**  
  Severity: **Critical**  
  Wrong-result bugs that are intermittent and parallelism-sensitive are especially dangerous in production analytics.  
  Fix appears to exist: [PR #21804](https://github.com/duckdb/duckdb/pull/21804) — **Fix intermittent wrong result for DISTINCT CTE with LEFT JOIN on empty table**.

### 2. Internal errors / crashes
These halt workloads and erode confidence, but are usually easier to detect than silent wrong results.

- [Issue #21779](https://github.com/duckdb/duckdb/issues/21779) — **INTERNAL error writing VARIANT to Parquet**  
  Severity: **High**  
  Impacts export pipelines involving `JSON -> VARIANT -> Parquet`. No fix PR is visible in this dataset.

- [Issue #21820](https://github.com/duckdb/duckdb/issues/21820) — **INTERNAL Error: attempted to access index 5 within vector of size 5 only in release build**  
  Severity: **High**  
  Release-only failures are concerning because they may evade debug validation and affect production builds disproportionately. No fix PR listed yet.

- [Issue #16792](https://github.com/duckdb/duckdb/issues/16792) — **Fatal error while ingesting CSV file**  
  Severity: **High**  
  This is old and under review/stale, but CSV ingestion remains a core use case. Lack of a reproducer makes progress harder.

### 3. Data corruption / type fidelity risks

- [Issue #21180](https://github.com/duckdb/duckdb/issues/21180) — **Precision loss writing HUGEINT to Parquet**  
  Severity: **High**  
  Silent precision loss on export is a serious interoperability issue.  
  Candidate fix exists: [PR #21252](https://github.com/duckdb/duckdb/pull/21252) — **Fix HUGEINT/UHUGEINT precision loss when writing to Parquet**.

### 4. SQL/catalog/parser correctness

- [Issue #21813](https://github.com/duckdb/duckdb/issues/21813) — **`CREATE SEQUENCE minvalue` parameter ignored**  
  Severity: **Medium**  
  Important metadata/DDL correctness issue.  
  Fix appears to exist immediately: [PR #21821](https://github.com/duckdb/duckdb/pull/21821).

- [Issue #21753](https://github.com/duckdb/duckdb/issues/21753) — **Java: typed macros error under physical storage mode**  
  Severity: **Medium**  
  Indicates a mismatch between reported storage version and feature gating. This affects embedded Java users and macro portability.

- [Issue #21809](https://github.com/duckdb/duckdb/issues/21809) — **Parser misses `NOT(IS NULL)` / `NOT(IS NOT NULL)` elimination**  
  Severity: **Low-Medium**  
  More of a parser simplification/normalization issue than a correctness bug, but it matters for consistency.

### 5. Recently resolved stability items

- [Issue #21602](https://github.com/duckdb/duckdb/issues/21602) — **Windows PyInstaller + `LOAD motherduck` access violation**  
  Closed, suggesting progress on Windows extension loading stability.

- [Issue #21582](https://github.com/duckdb/duckdb/issues/21582) — **Could not find CTE definition for CTE reference**  
  Closed, removing one internal-error class in macro/CTE interaction.

- [Issue #21579](https://github.com/duckdb/duckdb/issues/21579) — **markdown output mode not available for describe statement**  
  Closed/fixed on nightly, a smaller usability win for CLI/reporting workflows.

---

## 5) Feature Requests & Roadmap Signals

### Strong roadmap signals from active PRs

- [PR #21634](https://github.com/duckdb/duckdb/pull/21634) — **DML statements as CTE bodies**  
  This is the clearest user-facing SQL feature in flight. If merged, it would improve compatibility with PostgreSQL-style advanced SQL and orchestration patterns using `WITH ... INSERT/UPDATE/DELETE ... RETURNING`.

- [PR #21794](https://github.com/duckdb/duckdb/pull/21794) — **Expose column tags via `duckdb_columns()`**  
  Signals continued investment in **metadata introspection** and governance-oriented use cases.

- [PR #21693](https://github.com/duckdb/duckdb/pull/21693) — **Expression as `ATTACH` database path argument**  
  A convenience feature, but one that helps dynamic SQL generation and embedded use cases.

- [PR #21818](https://github.com/duckdb/duckdb/pull/21818) and [PR #21562](https://github.com/duckdb/duckdb/pull/21562) — **Window function binding work**  
  Suggest that richer or more consistent window-function support is an active internal roadmap theme.

- [PR #21762](https://github.com/duckdb/duckdb/pull/21762) — **Unify TableFilters with Expressions**  
  Not directly a feature request, but an enabling change that could unlock cleaner predicate pushdown, optimization, and extension behavior.

### Likely next-version candidates

Based on current activity, the most likely near-term inclusions are:
1. **Sequence DDL fix** via [PR #21821](https://github.com/duckdb/duckdb/pull/21821)
2. **Wrong-result fix for DISTINCT/CTE join case** via [PR #21804](https://github.com/duckdb/duckdb/pull/21804)
3. **Parquet HUGEINT fix** via [PR #21252](https://github.com/duckdb/duckdb/pull/21252)
4. **Metadata exposure improvements** like [PR #21794](https://github.com/duckdb/duckdb/pull/21794)
5. Potentially, **DML-in-CTE support** if review converges on semantics

---

## 6) User Feedback Summary

A few user pain points stand out clearly from today’s issue stream:

- **Correctness over speed**: users are hitting optimizer-related wrong-result bugs in window and join/distinct scenarios. This indicates production users are exercising more complex plans and need stronger guarantees around semantic preservation.
- **Parquet remains mission-critical**: multiple reports involve writing to Parquet, especially with edge types like `VARIANT` and `HUGEINT`. Users expect DuckDB to be a dependable interchange engine for both structured and semi-structured data.
- **Embedded/runtime-specific breakage matters**: Java storage-version behavior, Windows PyInstaller extension loading, and ADBC race fixes all show DuckDB is heavily used as an embedded analytics library, not just a CLI database.
- **Metadata and SQL compatibility continue to matter**: `CREATE SEQUENCE`, typed macros, `ATTACH`, `duckdb_columns()`, and DML CTE support all reflect demand for richer SQL behavior and introspection.
- **Timezone/date semantics are scrutinized**: the DST display issue’s high comment count shows strong user sensitivity to timestamp correctness, especially for historical data.

Overall sentiment from the issue mix is that DuckDB is valued for ambitious functionality, but users are now pushing enough edge cases that **engine correctness and type fidelity** are becoming the dominant quality expectations.

---

## 7) Backlog Watch

These items appear to deserve maintainer attention due to age, severity, or lack of visible resolution:

- [Issue #16792](https://github.com/duckdb/duckdb/issues/16792) — **Fatal error while ingesting CSV file**  
  Old, still open, marked under review/stale. CSV ingestion is too central a workflow for this to linger indefinitely, though missing repro data is a blocker.

- [Issue #21180](https://github.com/duckdb/duckdb/issues/21180) — **HUGEINT precision loss to Parquet**  
  Important and long-lived, though it does have an active fix candidate in [PR #21252](https://github.com/duckdb/duckdb/pull/21252). This should remain high priority until merged.

- [Issue #21592](https://github.com/duckdb/duckdb/issues/21592) — **WindowSelfJoinOptimizer wrong results**  
  High severity due to silent incorrect results. Needs prompt maintainer action if not already being fixed elsewhere.

- [Issue #21779](https://github.com/duckdb/duckdb/issues/21779) — **VARIANT-to-Parquet internal crash**  
  Newer but important because it affects modern semi-structured ETL.

- [Issue #21753](https://github.com/duckdb/duckdb/issues/21753) — **Java typed macro/storage mode issue**  
  Not the highest severity, but worth attention because Java embedding is a strategic ecosystem surface.

- [PR #21634](https://github.com/duckdb/duckdb/pull/21634) — **DML statements as CTE bodies**  
  Changes requested; substantial SQL feature with compatibility implications. Worth tracking because it could become a headline feature if merged.

- [PR #21762](https://github.com/duckdb/duckdb/pull/21762) — **Unify TableFilters with Expressions**  
  Architecturally important and potentially high impact; likely needs careful review bandwidth.

---

## 8) Linked Items Index

For convenience, here are the most relevant links from today’s digest:

- [Issue #21757](https://github.com/duckdb/duckdb/issues/21757) / [PR #21804](https://github.com/duckdb/duckdb/pull/21804) — DISTINCT CTE wrong-result bug and proposed fix
- [Issue #21180](https://github.com/duckdb/duckdb/issues/21180) / [PR #21252](https://github.com/duckdb/duckdb/pull/21252) — HUGEINT Parquet precision loss and fix
- [Issue #21813](https://github.com/duckdb/duckdb/issues/21813) / [PR #21821](https://github.com/duckdb/duckdb/pull/21821) — `CREATE SEQUENCE MINVALUE` parsing bug and fix
- [Issue #21592](https://github.com/duckdb/duckdb/issues/21592) — window optimizer wrong results
- [Issue #21779](https://github.com/duckdb/duckdb/issues/21779) — VARIANT Parquet internal error
- [Issue #19804](https://github.com/duckdb/duckdb/issues/19804) — historical DST handling
- [PR #21634](https://github.com/duckdb/duckdb/pull/21634) — DML as CTE bodies
- [PR #21762](https://github.com/duckdb/duckdb/pull/21762) — unify filters with expressions
- [PR #21818](https://github.com/duckdb/duckdb/pull/21818) — window function binding
- [PR #21794](https://github.com/duckdb/duckdb/pull/21794) — expose column tags in `duckdb_columns()`

If you want, I can also turn this into a **short executive briefing**, a **release-manager view**, or a **table-formatted triage report**.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-04-04

## 1. Today's Overview

StarRocks showed **very high development velocity** over the last 24 hours, with **77 PRs updated** and **45 merged/closed**, versus only **7 issues updated**. The day’s engineering focus was clearly on **storage-engine and cloud-native primary key table internals**, especially persistent index rebuild/init performance, correctness, and backports across maintained branches. There was also visible attention to **stability and security**, with new reports covering a BE shutdown endpoint exposure, ZooKeeper CVEs, a SIGSEGV in shared-data mode, and JDBC/Iceberg catalog noise. Overall, the project looks **active and healthy**, with strong maintainer throughput, but several newly reported bugs point to continued complexity in shared-data mode, external catalog integration, and operational hardening.

---

## 3. Project Progress

Today’s merged/closed PRs indicate progress in three major areas: **persistent index performance**, **column/type system evolution**, and **internal codebase refactoring**.

### Storage and persistent index improvements
A substantial portion of the day’s completed work centered on **LakePersistentIndex** and cloud-native PK-table publish/init paths:

- **Skip already-covered rows during persistent index rebuild** was merged and backported, reducing unnecessary IO during rebuild/publish workflows:
  - Mainline: [#71082](https://github.com/StarRocks/starrocks/pull/71082)
  - Backport replacement: [#71285](https://github.com/StarRocks/starrocks/pull/71285)
  - Earlier automerge attempt: [#71282](https://github.com/StarRocks/starrocks/pull/71282)

  This is a meaningful storage-engine optimization: StarRocks avoids reading rows that are already superseded by SSTables, which should lower publish latency and remote-storage traffic in lake deployments.

- **Parallelize SSTable opening during persistent index init** was closed/merged in mainline and moved through backport flow:
  - Mainline: [#71145](https://github.com/StarRocks/starrocks/pull/71145)
  - Backport attempt: [#71279](https://github.com/StarRocks/starrocks/pull/71279)

  This directly targets startup/init latency for cloud-native PK tablets, especially when many SSTables are stored remotely.

- **Trace instrumentation added to `LakePersistentIndex::init()`** improves observability for slow publish diagnostics:
  - Backport: [#71143](https://github.com/StarRocks/starrocks/pull/71143)
  - Additional backport chain: [#71281](https://github.com/StarRocks/starrocks/pull/71281)

  This is operationally important because it makes storage-layer latency decomposition more visible in production.

- **AdaptiveNullableColumn support in column visitor adapters** was closed:
  - [#71268](https://github.com/StarRocks/starrocks/pull/71268)

  While not user-facing by itself, it suggests continuing work on internal column abstraction flexibility.

### Query/metadata correctness and distributed consistency
Several active PRs updated today target correctness in distributed or schema-evolution paths:

- **Follower FE queryability fix in shared-data mode**:
  - [#71263](https://github.com/StarRocks/starrocks/pull/71263)

  This addresses a race between FE journal replay and StarMgr journal replay that can leave follower FEs unaware of new shards, causing “no queryable replica” errors. This is important for HA correctness in lake/shared-data deployments.

- **Partial tablet schema / short key mismatch fix**:
  - [#71274](https://github.com/StarRocks/starrocks/pull/71274)

  This addresses a BE DCHECK crash during column-mode partial update on PK tables with separate sort keys.

- **Persistent index rebuild boundary bug fix**:
  - [#71284](https://github.com/StarRocks/starrocks/pull/71284)

  This complements the rebuild optimization by fixing segment coverage edge cases.

- **UpdateTabletSchemaTask signature collision fix**:
  - [#71242](https://github.com/StarRocks/starrocks/pull/71242)

  This improves reliability when multiple alter jobs execute rapidly on the same table/partition.

### Codebase refactoring
Several refactor PRs were closed or opened, indicating internal cleanup work around runtime filter plumbing and layout abstractions:

- Closed:
  - [#71287 Introduce RuntimeFilterRegistry](https://github.com/StarRocks/starrocks/pull/71287)
  - [#71286 Remove WithLayoutMixin](https://github.com/StarRocks/starrocks/pull/71286)
- Open:
  - [#71288 Remove from add_rf_event ExecEnv](https://github.com/StarRocks/starrocks/pull/71288)

These are signals of ongoing effort to simplify execution-engine internals, likely to improve maintainability and enable later optimizer/runtime-filter work.

---

## 4. Community Hot Topics

### 1) Iceberg V3 support demand
- Issue: [#60956 Add support for Apache Iceberg V3 Table Specification](https://github.com/StarRocks/starrocks/issues/60956)
- Signals: **14 👍**, 3 comments

This is the clearest roadmap signal from the issue tracker. Users increasingly expect StarRocks to remain compatible with the **latest Iceberg table spec**, especially as Spark and Trino ecosystems adopt V3 features. The underlying need is not just file-format compatibility, but maintaining StarRocks’ position as a high-performance SQL engine over open lakehouse metadata standards.

### 2) Arrow type compatibility expansion
- Issue: [#71280 Support Arrow StringView (Utf8View) and BinaryView types in Arrow-to-StarRocks converter](https://github.com/StarRocks/starrocks/issues/71280)

This reflects growing demand for **modern Arrow interoperability**. Supporting zero-copy or more efficient Arrow encodings matters for connectors, UDF/data interchange, and vectorized ingestion pathways. It suggests users are pushing StarRocks deeper into mixed-engine analytical pipelines.

### 3) Cloud-native PK tablet optimization work
Most PR movement today clustered around:
- [#71082](https://github.com/StarRocks/starrocks/pull/71082)
- [#71145](https://github.com/StarRocks/starrocks/pull/71145)
- [#71284](https://github.com/StarRocks/starrocks/pull/71284)
- [#71143](https://github.com/StarRocks/starrocks/pull/71143)

The technical need underneath these changes is clear: **shared-data/lake mode PK tables still have expensive publish/rebuild/init paths**, and users are feeling that cost in IO, latency, and troubleshooting complexity.

### 4) Operational safety and security exposure
- Issue: [#71249 Security Issues of the /api/_stop_be Interface](https://github.com/StarRocks/starrocks/issues/71249)
- Issue: [#71266 [CVE] zookeeper](https://github.com/StarRocks/starrocks/issues/71266)

These issues point to a growing operator expectation that StarRocks should be secure by default, especially for HTTP admin endpoints and bundled/transitive infrastructure dependencies.

---

## 5. Bugs & Stability

Ranked by likely operational severity:

### Critical
#### Unauthenticated BE shutdown endpoint
- Issue: [#71249 Security Issues of the /api/_stop_be Interface](https://github.com/StarRocks/starrocks/issues/71249)

If confirmed, this is the most severe report today: a BE process may be stoppable via `/api/_stop_be` **without permission verification**. That would represent a direct denial-of-service risk in exposed environments. No linked fix PR is visible in today’s data.

#### High-severity ZooKeeper CVEs
- Issue: [#71266 [CVE-2026-24281][CVE-2026-24308] zookeeper](https://github.com/StarRocks/starrocks/issues/71266)

This is a supply-chain/dependency risk rather than a StarRocks logic bug, but still high priority. If affected deployments use the vulnerable ZooKeeper version, operators will expect either a dependency upgrade or mitigation guidance quickly.

### High
#### SIGSEGV during publish_version in shared-data mode
- Issue: [#71283 SIGSEGV in `ColumnReader::~ColumnReader()`](https://github.com/StarRocks/starrocks/issues/71283)

A segmentation fault in metadata caching / publish paths is a major stability concern, especially in cloud-native deployments. The stack involving protobuf memory accounting and column reader destruction suggests a possible lifetime or memory ownership bug. No fix PR appears in today’s list.

#### Follower FE “no queryable replica” race
- Fix PR open: [#71263](https://github.com/StarRocks/starrocks/pull/71263)

This is already being addressed. The bug can cause query failures on follower FEs after DDL in shared-data mode due to StarMgr replay lag, making it a high-priority correctness/HA issue.

### Medium
#### ThreadPool use-after-free on thread creation failure
- Fix PR open: [#71276](https://github.com/StarRocks/starrocks/pull/71276)

This is a serious systems bug, but likely less commonly triggered. It indicates robustness gaps in failure paths rather than normal-path query correctness.

#### Partial update / schema mismatch crashes
- Fix PRs:
  - [#71274](https://github.com/StarRocks/starrocks/pull/71274)
  - [#69652](https://github.com/StarRocks/starrocks/pull/69652)

These continue a pattern: **PK tables + partial update + schema evolution/separate sort keys** remain a sensitive area. The corruption/crash implications are important for production users relying on high-write OLAP workloads.

#### Initial backfill issue for async MV IVM auto mode
- Closed issue: [#69558](https://github.com/StarRocks/starrocks/issues/69558)

This issue was closed today, which is positive. It concerned `partition_refresh_number` not being respected during initial backfill, potentially causing all partitions to ingest at once and fail. The closure suggests progress, though no linked PR is shown in the provided data.

### Medium-Low
#### JDBC Catalog logs errors/warnings while querying external Iceberg data
- Issue: [#71277 JDBC Catalog](https://github.com/StarRocks/starrocks/issues/71277)

This appears to be more of an integration-quality and observability concern than a confirmed correctness failure, but it affects operator confidence and may conceal real degradation.

---

## 6. Feature Requests & Roadmap Signals

### Strongest roadmap signal: Iceberg V3 support
- [#60956](https://github.com/StarRocks/starrocks/issues/60956)

This is the standout feature request by community support. Given StarRocks’ strategic emphasis on lakehouse interoperability, **Iceberg V3 support looks like a likely medium-term roadmap item**. Whether it lands in the very next release depends on implementation complexity around metadata semantics, row lineage/deletion models, and compatibility guarantees.

### Likely near-term compatibility enhancement: Arrow StringView/BinaryView
- [#71280](https://github.com/StarRocks/starrocks/issues/71280)

This is relatively scoped and aligns with ecosystem compatibility work. Compared with Iceberg V3, this request appears **more likely to land sooner**, possibly in a minor release, because it is bounded to converter/type handling.

### Documentation / upgrade-path hardening
- PR: [#71170 Warning about downgrading 4.1](https://github.com/StarRocks/starrocks/pull/71170)

Not a feature request, but an important roadmap signal: StarRocks is still absorbing **4.1 branch transition complexity**, and the project is actively documenting upgrade/downgrade constraints. That usually accompanies stabilization before broader adoption.

### Security hardening likely to rise in priority
- [#71249](https://github.com/StarRocks/starrocks/issues/71249)
- [#71266](https://github.com/StarRocks/starrocks/issues/71266)

These are not feature requests, but they may trigger short-term roadmap work on **admin endpoint authentication**, dependency hygiene, and secure-by-default defaults.

---

## 7. User Feedback Summary

Today’s user-reported feedback highlights a few concrete pain points:

1. **Lakehouse compatibility remains a top user concern.**
   - Iceberg V3 support request: [#60956](https://github.com/StarRocks/starrocks/issues/60956)
   - JDBC catalog with external Iceberg logs warnings/errors: [#71277](https://github.com/StarRocks/starrocks/issues/71277)

   Users are clearly using StarRocks as a query layer over external/open-table-format data and want fewer compatibility gaps and cleaner operational behavior.

2. **Shared-data mode is valuable but still operationally complex.**
   - SIGSEGV report: [#71283](https://github.com/StarRocks/starrocks/issues/71283)
   - Follower FE queryability fix: [#71263](https://github.com/StarRocks/starrocks/pull/71263)
   - Persistent index optimization and instrumentation PRs: [#71082](https://github.com/StarRocks/starrocks/pull/71082), [#71145](https://github.com/StarRocks/starrocks/pull/71145), [#71143](https://github.com/StarRocks/starrocks/pull/71143)

   The pattern suggests users are actively exercising cloud-native storage paths, but these paths still generate performance and correctness edge cases.

3. **PK tables and partial updates remain a high-value but fragile workload.**
   - Corruption fix PR: [#69652](https://github.com/StarRocks/starrocks/pull/69652)
   - Schema mismatch crash fix: [#71274](https://github.com/StarRocks/starrocks/pull/71274)

   Users likely appreciate the feature set, but reliability around advanced PK update modes still needs hardening.

4. **Operators expect better security posture.**
   - BE stop endpoint exposure: [#71249](https://github.com/StarRocks/starrocks/issues/71249)
   - ZooKeeper CVEs: [#71266](https://github.com/StarRocks/starrocks/issues/71266)

   These reports show that production users are now evaluating StarRocks not only for performance, but for platform security and operational safety.

---

## 8. Backlog Watch

### Important older issue with strong demand but no recent momentum
#### Iceberg V3 table spec support
- [#60956](https://github.com/StarRocks/starrocks/issues/60956)

Created in 2025-07 and still open with **14 reactions**, this is the most visible long-lived feature request in today’s data. It deserves maintainer attention because it carries strategic ecosystem implications.

### Older open bug fix PR with serious impact
#### PK tablet corruption in column-mode partial update
- [#69652](https://github.com/StarRocks/starrocks/pull/69652)

Opened 2026-03-01 and still open, this PR addresses a severe corruption/crash scenario affecting PK tables. Because the described impact includes BE crashes and replica-wide corruption behavior, it should remain high on the maintainer watchlist until merged and backported.

### Documentation debt around 4.1 downgrade behavior
- [#71170](https://github.com/StarRocks/starrocks/pull/71170)

This is not stale yet, but it is operationally important. If 4.1 deployments cannot safely downgrade below 4.0.6, prominent documentation and release-note visibility are essential.

### New security reports needing quick triage
- [#71249](https://github.com/StarRocks/starrocks/issues/71249)
- [#71266](https://github.com/StarRocks/starrocks/issues/71266)

These are fresh rather than stale, but they belong on the watchlist because delayed maintainer response would create outsized risk relative to ordinary bug backlog.

---

## Overall Health Assessment

StarRocks appears **highly active and shipping-oriented**, with strong branch maintenance and rapid backporting, especially in the storage engine. The project is making tangible progress on **cloud-native PK-table performance and observability**, which is strategically aligned with modern analytical workloads. The main caution flags today are **security hardening**, **shared-data mode crash/race reports**, and the continued fragility of **advanced PK partial-update paths**. In short: **project momentum is strong, but production-hardening work remains just as important as new feature velocity**.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-04-04

## 1. Today's Overview

Apache Iceberg showed **high pull request activity** over the last 24 hours, with **42 PRs updated** versus only **4 issues updated**, suggesting the project is currently in a strong implementation/review cycle rather than a heavy bug-triage phase. No new release was published today, but work is active across **Spark, core metadata/REST behavior, API-level predicate evaluation, Kafka Connect, and documentation**. A notable pattern is that several older PRs were closed as **stale**, while a smaller set of fresh PRs addresses concrete correctness and operability gaps. Overall, project health looks **active but review-constrained**: innovation continues, but some substantial proposals remain open for long periods or are being dropped without merge.

---

## 2. Project Progress

### Merged/closed PRs today and what they indicate

While no major merged feature release landed today, the set of **closed PRs** reveals where Iceberg is advancing and where effort is being pruned.

- [#15877](https://github.com/apache/iceberg/pull/15877) **[CLOSED] Spark 4.1: Focus Coverage of async planner stream tests**  
  This reflects continuing work around **async micro-batch planning** in Spark structured streaming. Even though this particular PR was closed, it points to active optimization and test restructuring around streaming planner performance.

- [#15437](https://github.com/apache/iceberg/pull/15437) **[CLOSED] Core: Support reading Avro local-timestamp-* logical types**  
  This was aimed at improving **format compatibility** with external Avro writers using `local-timestamp-millis/micros/nanos`. Its closure as stale suggests the need remains relevant, especially for interoperability-heavy users.

- [#15282](https://github.com/apache/iceberg/pull/15282) **[CLOSED] Flink: Add CDC streaming read support**  
  This would have been a substantial **query engine feature** for Flink, enabling changelog semantics with proper `RowKind`. Its stale closure indicates that **CDC remains strategically important but not yet converged** in implementation.

- [#15209](https://github.com/apache/iceberg/pull/15209) **[CLOSED] Kafka Connect: Add Default Value Support**  
  This targeted connector usability and schema evolution ergonomics. Closure means no immediate progress here, but it confirms sustained demand for stronger **Kafka Connect schema/default handling**.

- [#15445](https://github.com/apache/iceberg/pull/15445) **[CLOSED] PoC: Introduce column update metadata**  
  This is roadmap-significant. Even as a proof of concept, it indicates interest in richer metadata evolution for columns, likely relevant to future table format/spec evolution.

- [#6110](https://github.com/apache/iceberg/pull/6110) **[CLOSED] API: Hash floats -0.0 and 0.0 to the same bucket**  
  Though old, this touches a subtle **query correctness / partitioning consistency** concern: treating `-0.0` and `0.0` equivalently in bucket transforms.

### Active progress signals from newly updated open PRs

Several open PRs look especially meaningful:

- [#15883](https://github.com/apache/iceberg/pull/15883) — API fix for `StrictMetricsEvaluator.notStartsWith`
- [#15863](https://github.com/apache/iceberg/pull/15863) — configurable timeout for REST async scan planning
- [#15590](https://github.com/apache/iceberg/pull/15590) — auto-flushing accumulated data files to manifests
- [#15840](https://github.com/apache/iceberg/pull/15840) — Spark cache correctness for snapshot/branch-aware reads
- [#15854](https://github.com/apache/iceberg/pull/15854) — v4 `TrackedFile` implementation groundwork
- [#15280](https://github.com/apache/iceberg/pull/15280) — staged-table credential refresh in REST/OpenAPI

These point to steady advancement in **correctness, scalability, and REST/spec maturity**.

---

## 3. Community Hot Topics

### 1) Spark cache correctness for time travel and branches
- [PR #15840](https://github.com/apache/iceberg/pull/15840) — **SparkTable equals/hashCode should include snapshotId and branch**

This is one of the most practically important updates. The PR describes Spark returning cached results incorrectly when switching between snapshot/branch reads because equality only used table name. The underlying need is clear: as Iceberg’s branch/tag/time-travel semantics become mainstream, connector integrations must treat snapshot identity as first-class to avoid **silent stale reads**.

### 2) Predicate pruning quality in metrics evaluation
- [Issue #15882](https://github.com/apache/iceberg/issues/15882) — `StrictMetricsEvaluator` does not use bounds for `notStartsWith`
- [PR #15883](https://github.com/apache/iceberg/pull/15883) — implementation of `notStartsWith` bounds check

This issue/PR pair is a strong signal that users care about **residual elimination and file pruning efficiency**, especially for string predicates. The technical need is improved planner intelligence from file-level metrics, reducing unnecessary scans and tightening correctness/strictness semantics.

### 3) Kafka Connect reliability under AWS Glue concurrency
- [Issue #15878](https://github.com/apache/iceberg/issues/15878) — Connector enters silent broken state after `CommitFailedException`

This is a high-value operational topic because it affects **streaming ingestion reliability**. The issue suggests connector liveness and error propagation shortcomings in real cloud deployments where Glue catalog concurrent updates happen.

### 4) Manifest scaling and bulk-write memory pressure
- [PR #15590](https://github.com/apache/iceberg/pull/15590) — Auto-flush accumulated data files to manifests

This reflects ongoing demand from large-scale operators for **lower peak memory and smoother manifest generation** during massive write operations. The design indicates Iceberg usage at very large file counts, where snapshot production can become a bottleneck.

### 5) REST catalog async planning operability
- [PR #15863](https://github.com/apache/iceberg/pull/15863) — Configurable REST scan planning poll timeout

This suggests growing adoption of remote planning workflows and a need for better control over **latency tolerance and failure behavior** in REST-based deployments.

---

## 4. Bugs & Stability

Ranked by likely severity and operational impact:

### High severity
1. [Issue #15878](https://github.com/apache/iceberg/issues/15878) — **Kafka Connect silent broken state after `CommitFailedException`**
   - Impact: After Glue detects concurrent updates, the connector reportedly stops writing data and surfaces no clear error.
   - Why severe: This is a **silent data ingestion failure** risk, worse than a loud crash because pipelines may appear healthy while data is lost/delayed.
   - Fix PR: **No linked fix PR in today’s data.**

2. [PR #15840](https://github.com/apache/iceberg/pull/15840) — **Spark cached query results can be stale across branch/time-travel reads**
   - Impact: Users may read incorrect results when switching branches/snapshots.
   - Why severe: This is a **query correctness** issue.
   - Status: Open PR exists, which is a strong positive sign.

### Medium severity
3. [Issue #15882](https://github.com/apache/iceberg/issues/15882) / [PR #15883](https://github.com/apache/iceberg/pull/15883) — **`notStartsWith` strict evaluator ignores bounds**
   - Impact: Reduced ability to prove file-level non-match; may lead to over-scanning and weaker strict filtering behavior.
   - Why medium: More performance/correctness-tightness than outright wrong answers.
   - Status: Fix PR opened immediately, indicating fast response.

4. [Issue #13886](https://github.com/apache/iceberg/issues/13886) — **Inconsistent redundant transform checks between `PartitionSpec` construction and update**
   - Impact: Behavioral inconsistency in schema/partition evolution APIs.
   - Why medium: Confusing developer experience and possible unexpected validation behavior.
   - Status: Issue closed, but closure reason appears tied to inactivity/staleness rather than visible feature delivery.

### Lower severity / operational polish
5. [PR #15863](https://github.com/apache/iceberg/pull/15863) — **REST scan planning timeout configurability**
   - Impact: Better failure handling in long-running remote plan generation.
   - Why lower: Operability improvement, not necessarily a correctness bug.

---

## 5. Feature Requests & Roadmap Signals

### Strong signals from current requests

- [Issue #15677](https://github.com/apache/iceberg/issues/15677) — **Add `write.parquet.page-version` table property**  
  This is a clear user request for deeper **Parquet writer configurability**, especially around V1 vs V2 data pages. This feels realistic for a near-term release because it is scoped, table-property driven, and aligns with existing writer property patterns.

- [PR #15280](https://github.com/apache/iceberg/pull/15280) — **Credential refresh on staged tables in REST/OpenAPI**  
  Strong roadmap signal for **REST catalog maturity** and cloud-native workflows. Likely to matter for secure long-lived staged operations.

- [PR #15854](https://github.com/apache/iceberg/pull/15854) — **TrackedFile struct for v4**  
  This is deeper infrastructure work and likely part of broader **table format v4 / single-file commit / tracking metadata** efforts.

- [PR #15084](https://github.com/apache/iceberg/pull/15084) — **Ability to undelete a column**  
  This is an important schema evolution ergonomics feature and a meaningful SQL/catalog usability enhancement.

- [PR #11041](https://github.com/apache/iceberg/pull/11041) — **Materialized View Spec**  
  Still open for a long time, showing this remains a strategic but unresolved roadmap item.

### Likely next-version candidates

Based on scope and recency, the features most likely to appear in an upcoming release are:

1. [#15883](https://github.com/apache/iceberg/pull/15883) — `notStartsWith` evaluator improvement  
2. [#15863](https://github.com/apache/iceberg/pull/15863) — REST scan planning timeout config  
3. [#15677](https://github.com/apache/iceberg/issues/15677) — Parquet page version property  
4. [#15840](https://github.com/apache/iceberg/pull/15840) — Spark branch/snapshot cache correctness fix  
5. [#15590](https://github.com/apache/iceberg/pull/15590) — manifest auto-flush for large writes

These are relatively self-contained and directly tied to user-visible correctness or operability.

---

## 6. User Feedback Summary

Today’s user feedback points to a few recurring pain points:

- **Streaming/ingestion robustness matters a lot**, especially in cloud catalog environments.  
  The Kafka Connect Glue issue ([#15878](https://github.com/apache/iceberg/issues/15878)) shows users need stronger retry/error surfacing semantics, not just commit failure handling.

- **Correctness around advanced table semantics is under pressure.**  
  Branching, snapshot reads, and time travel are increasingly used in practice, and Spark integration must preserve correctness ([#15840](https://github.com/apache/iceberg/pull/15840)).

- **Users want more tunable storage-writer behavior.**  
  The Parquet page-version request ([#15677](https://github.com/apache/iceberg/issues/15677)) indicates that advanced operators are tuning low-level file-format behavior for interoperability or performance reasons.

- **Large-scale write workloads continue to stress metadata handling.**  
  The manifest auto-flush proposal ([#15590](https://github.com/apache/iceberg/pull/15590)) implies users are hitting memory/IO spikes in bulk ingest or compaction-like operations.

- **Developer ergonomics remain important.**  
  Docs and tooling PRs like [#15881](https://github.com/apache/iceberg/pull/15881) and migration caveats like [#15874](https://github.com/apache/iceberg/pull/15874) show a healthy focus on reducing avoidable integration mistakes.

Overall sentiment is not “feature scarcity”; it is more “**make advanced Iceberg usage safer and more predictable**.”

---

## 7. Backlog Watch

These items appear to need maintainer attention due to age, strategic importance, or closure patterns:

- [PR #11041](https://github.com/apache/iceberg/pull/11041) — **Materialized View Spec**  
  Long-running and strategically important. It likely needs focused design resolution rather than passive review.

- [PR #15084](https://github.com/apache/iceberg/pull/15084) — **Undelete a column**  
  Valuable schema evolution capability, but aging. Worth clarifying whether blockers are semantic, spec-related, or implementation-quality related.

- [PR #15235](https://github.com/apache/iceberg/pull/15235) — **BasicTLSConfigurer for custom keystore/truststore support**  
  Security and enterprise integration features tend to matter disproportionately to adopters; this could use active review.

- [PR #15280](https://github.com/apache/iceberg/pull/15280) — **Credential refresh for staged tables**  
  Important for REST catalog/cloud workflows and likely worth prioritizing if REST adoption is growing.

- [PR #15590](https://github.com/apache/iceberg/pull/15590) — **Manifest auto-flush scaling improvement**  
  A strong candidate for reducing operational pain in large installs.

- [Issue #15878](https://github.com/apache/iceberg/issues/15878) — **Kafka Connect silent failure after Glue concurrent update**  
  New, but urgent enough that it should not linger.

- [Closed stale proposals worth revisiting]**
  - [#15282](https://github.com/apache/iceberg/pull/15282) — Flink CDC reads  
  - [#15437](https://github.com/apache/iceberg/pull/15437) — Avro local timestamp support  
  - [#15209](https://github.com/apache/iceberg/pull/15209) — Kafka Connect default value support  

These stale closures suggest potentially valuable work is being lost to review bandwidth rather than lack of user need.

---

## 8. Overall Health Assessment

Apache Iceberg remains **technically active and strategically healthy**, with strong momentum in connector correctness, metadata scaling, and REST/catalog capabilities. The most encouraging sign is the quick issue-to-PR turnaround for the `StrictMetricsEvaluator` gap ([#15882](https://github.com/apache/iceberg/issues/15882) → [#15883](https://github.com/apache/iceberg/pull/15883)). The main caution is that several meaningful features are aging or being closed as stale, which may indicate **maintainer bandwidth pressure**. In short: **execution is strong, but prioritization and review throughput appear to be the limiting factors.**

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-04-04

## 1. Today's Overview

Delta Lake had a **high PR-update day but low issue volume**: 27 pull requests were updated in the last 24 hours, versus just 2 active issues and no closures. The activity pattern suggests the project is currently in a **feature-integration and review-heavy phase**, especially around **Delta Kernel, DSv2, CDC streaming, UniForm, and Delta REST/Unity Catalog managed commit paths**. There were **no new releases**, so today’s signal comes from implementation progress rather than packaged deliverables. Overall project health looks **active and forward-moving**, with substantial engineering momentum but also a growing stack of open, interdependent PR chains that may require maintainer bandwidth to land cleanly.

---

## 3. Project Progress

### Merged/closed PRs today
There was **1 merged/closed PR** in the last 24 hours, but the specific merged item is not included in the provided listing. Even without its details, the surrounding PR activity clearly shows where Delta Lake engineering effort is concentrated:

- **DSv2 write path completion**
  - [#6483](https://github.com/delta-io/delta/pull/6483) — **[DSv2] Add WriteBuilder and wire SparkTable.newWriteBuilder**
  - [#6482](https://github.com/delta-io/delta/pull/6482) — **[DSv2] Add batch write implementation**
  - [#6449](https://github.com/delta-io/delta/pull/6449) — **Add CreateTableBuilder + V2Mode routing + integration tests**
  - [#6450](https://github.com/delta-io/delta/pull/6450) — **Wire DeltaCatalog.createTable() to DSv2 + Kernel path**

  These PRs indicate substantial progress toward a more complete **Spark DataSource V2 integration**, especially for **table creation and batch writes via Kernel-backed transaction management**. This is strategically important for connector modernization, better Spark API alignment, and cleaner integration points for future write features.

- **Kernel + CDC streaming stack**
  - [#6075](https://github.com/delta-io/delta/pull/6075) — **[kernel-spark][Part 1] CDC streaming offset management (initial snapshot)**
  - [#6076](https://github.com/delta-io/delta/pull/6076) — **[kernel-spark][Part 2] CDC commit processing**
  - [#6391](https://github.com/delta-io/delta/pull/6391) — **CDC admission limits for commit processing**
  - [#6336](https://github.com/delta-io/delta/pull/6336) — **CDC streaming offset management**
  - [#6359](https://github.com/delta-io/delta/pull/6359) — **CDC data reading**
  - [#6362](https://github.com/delta-io/delta/pull/6362) — **CDC schema coordination**
  - [#6363](https://github.com/delta-io/delta/pull/6363) — **End-to-end CDC streaming integration tests**
  - [#6370](https://github.com/delta-io/delta/pull/6370) — **DV+CDC same-path pairing and DeletionVector support**
  - [#6388](https://github.com/delta-io/delta/pull/6388) — **allowOutOfRange for CDC startingVersion in DSv2 streaming**

  This is the strongest technical theme of the day. Delta Lake is pushing toward a more complete **Kernel-backed CDC streaming implementation in Spark/DSv2**, including offsets, admission control, schema coordination, and **Deletion Vector-aware change processing**. That points to ongoing work to improve **incremental consumption correctness** and make Kernel-based readers/writers production-ready.

- **Managed commit and REST path evolution**
  - [#6347](https://github.com/delta-io/delta/pull/6347) — **Plumb UC-managed schema evolution through Delta REST commits**

  This advances support for **Unity Catalog–managed schema evolution through Delta REST v1 managed commits**, a notable step for hosted/governed deployments where metadata changes need to travel through managed transaction infrastructure rather than legacy local optimistic paths.

- **Commit metadata / observability**
  - [#6484](https://github.com/delta-io/delta/pull/6484) — **[Kernel] Add withCommitTags API to write custom tags to commitInfo**
  - [#6476](https://github.com/delta-io/delta/pull/6476) — **[Test] Write file size histogram in VersionChecksum**

  These changes suggest emphasis on **commit metadata richness and operational observability**, valuable for lineage, synchronization tools, and table-health diagnostics.

- **UniForm work**
  - [#6488](https://github.com/delta-io/delta/pull/6488) — **[UniForm][Prototype] Fix field ID assignment**
  - [#6485](https://github.com/delta-io/delta/pull/6485) — **[UniForm][Deprecated] Support commit with UniForm metadata atomically for UCCommitCoordinatorClient**
  - [#6486](https://github.com/delta-io/delta/pull/6486) — **[UniForm] Support commit with UniForm metadata atomically for UCCommitCoordinatorClient**

  UniForm-related updates imply continued work on **cross-format interoperability and atomic metadata handling**, especially in UC-coordinated environments.

---

## 4. Community Hot Topics

Because comment counts are mostly unavailable in the provided PR metadata, the “hot topics” are best inferred from **clusters of related PRs and issue/PR linkage**.

### 1) Kernel commit tags support
- Issue: [#6167](https://github.com/delta-io/delta/issues/6167) — **Support commit tags in commitInfo for Delta Kernel**
- PR: [#6484](https://github.com/delta-io/delta/pull/6484) — **[Kernel] Add withCommitTags API**

**Why it matters:**  
This is a strong example of user feedback converting quickly into implementation work. The underlying need is **custom transaction metadata propagation** in Kernel-based writers, especially for tools such as **Apache XTable**, replication/sync frameworks, governance systems, and operational lineage pipelines. This is a practical interoperability and observability request, not just an API nicety.

### 2) DSv2 connector maturation
- [#6483](https://github.com/delta-io/delta/pull/6483)
- [#6482](https://github.com/delta-io/delta/pull/6482)
- [#6449](https://github.com/delta-io/delta/pull/6449)
- [#6450](https://github.com/delta-io/delta/pull/6450)

**Why it matters:**  
A concentrated burst of DSv2 work usually signals a roadmap push toward **modern Spark connector architecture**, better **write-path maintainability**, and improved alignment with Spark’s evolving table APIs. For users, this can unlock cleaner integration, future SQL capability parity, and possibly reduced dependence on legacy V1 pathways.

### 3) CDC streaming over Kernel-Spark
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6391](https://github.com/delta-io/delta/pull/6391)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)
- [#6388](https://github.com/delta-io/delta/pull/6388)

**Why it matters:**  
This is the most strategically significant topic in the current backlog. The PR stack shows Delta Lake tackling **end-to-end CDC streaming semantics**, including snapshot initialization, offset tracking, commit processing, schema coordination, range handling, and deletion vectors. The technical need underneath is clear: users want **robust incremental data consumption** with behavior that is predictable under schema changes and advanced storage features.

### 4) Protocol/documentation precision
- Issue: [#6480](https://github.com/delta-io/delta/issues/6480) — **docs: clarify binary partition value serialization format in protocol spec**

**Why it matters:**  
This reflects a recurring need in open table formats: **precise protocol wording matters for ecosystem interoperability**. Ambiguity in serialization specs can create cross-engine incompatibilities or hidden correctness bugs in independent implementations.

---

## 5. Bugs & Stability

No major crash, corruption, or regression issues were reported in the last 24 hours based on the provided issue list. Stability signals today are more about **preventive correctness work** than urgent break/fix firefighting.

### Ranked by severity

#### Medium: Protocol ambiguity could cause cross-implementation incompatibility
- [#6480](https://github.com/delta-io/delta/issues/6480) — **clarify binary partition value serialization format in protocol spec**

**Risk:**  
Ambiguous serialization rules for binary partition values can lead to **incorrect parsing or mismatched behavior across Delta implementations**. This is especially important for engines or libraries implementing the protocol independently.

**Status:**  
Open issue, no linked fix PR in the provided data.

#### Medium: Missing Kernel API for commit tags limits metadata correctness/lineage workflows
- [#6167](https://github.com/delta-io/delta/issues/6167) — **Support commit tags in commitInfo for Delta Kernel**
- Fix in progress: [#6484](https://github.com/delta-io/delta/pull/6484)

**Risk:**  
Not a crash bug, but a **functional limitation** affecting metadata tracking, synchronization tools, and external orchestration systems. Without commit tags, some user workflows may be forced into workarounds or lose observability fidelity.

**Status:**  
Actively being addressed by a new Kernel PR.

### Stability-positive engineering work
Several open PRs are likely to improve correctness and operational stability once merged:

- [#6363](https://github.com/delta-io/delta/pull/6363) — end-to-end CDC streaming integration tests
- [#6370](https://github.com/delta-io/delta/pull/6370) — DV + CDC same-path pairing support
- [#6391](https://github.com/delta-io/delta/pull/6391) — CDC admission limits
- [#6476](https://github.com/delta-io/delta/pull/6476) — file size histogram in VersionChecksum tests

These all point to **hardening of streaming and metadata validation paths**, which are typically high-impact areas for correctness.

---

## 6. Feature Requests & Roadmap Signals

### Clear user-requested feature
- [#6167](https://github.com/delta-io/delta/issues/6167) — **Support commit tags in commitInfo for Delta Kernel**
- Implementation: [#6484](https://github.com/delta-io/delta/pull/6484)

**Roadmap signal:**  
Very likely to appear in an upcoming release if review proceeds normally. It is narrowly scoped, clearly justified, and already has an implementation PR.

### Strong roadmap themes from PR traffic

#### 1) Kernel as a first-class write/read substrate
Relevant PRs:
- [#6484](https://github.com/delta-io/delta/pull/6484)
- [#6482](https://github.com/delta-io/delta/pull/6482)
- [#6483](https://github.com/delta-io/delta/pull/6483)
- [#6449](https://github.com/delta-io/delta/pull/6449)
- [#6450](https://github.com/delta-io/delta/pull/6450)

**Prediction:**  
The next version is likely to continue improving **Kernel-backed authoring and DSv2 integration**, especially around table creation, write builders, and transaction metadata.

#### 2) CDC/streaming completeness
Relevant PRs:
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)
- [#6388](https://github.com/delta-io/delta/pull/6388)
- [#6391](https://github.com/delta-io/delta/pull/6391)

**Prediction:**  
Expect future releases to emphasize **CDC streaming semantics, DSv2 support, and deletion-vector-aware incremental reads**.

#### 3) Governed/managed metadata evolution
- [#6347](https://github.com/delta-io/delta/pull/6347)

**Prediction:**  
Managed commit paths and hosted-governance integration, especially with **Unity Catalog and Delta REST**, look like an important enterprise roadmap direction.

#### 4) UniForm interoperability
- [#6485](https://github.com/delta-io/delta/pull/6485)
- [#6486](https://github.com/delta-io/delta/pull/6486)
- [#6488](https://github.com/delta-io/delta/pull/6488)

**Prediction:**  
Interoperability features remain active, though some of this work appears experimental/prototype-stage.

---

## 7. User Feedback Summary

Today’s user-visible pain points are mostly inferred from issues and PR intent rather than explicit sentiment threads.

### Main pain points

- **Need for richer commit metadata in Kernel**
  - [#6167](https://github.com/delta-io/delta/issues/6167)
  
  Users building synchronization, lineage, or governance-aware systems need to **write structured tags into commitInfo**. This suggests Delta Kernel adoption is expanding into real operational systems where metadata is as important as data writes.

- **Need for clearer protocol specification**
  - [#6480](https://github.com/delta-io/delta/issues/6480)

  Users and implementers need **unambiguous serialization definitions** to avoid incompatibilities. This often comes from developers building alternative readers/writers or validating protocol compliance.

- **Demand for more complete DSv2 and CDC behavior**
  - [#6482](https://github.com/delta-io/delta/pull/6482), [#6483](https://github.com/delta-io/delta/pull/6483), [#6075](https://github.com/delta-io/delta/pull/6075) and related stack

  The breadth of implementation work indicates users care about **modern Spark integration**, **incremental processing**, and **correct behavior under evolving schemas and deletion vectors**.

### Satisfaction signals
There are no explicit positive user testimonials in the provided data, but one encouraging sign is that a user-requested enhancement ([#6167](https://github.com/delta-io/delta/issues/6167)) appears to have quickly translated into a candidate patch ([#6484](https://github.com/delta-io/delta/pull/6484)). That suggests healthy responsiveness on at least some actionable feature requests.

---

## 8. Backlog Watch

These are the items that look important and may need focused maintainer attention due to scope, age, or dependency structure.

### High-priority review backlog

#### Long-running CDC stack
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)
- [#6388](https://github.com/delta-io/delta/pull/6388)
- [#6391](https://github.com/delta-io/delta/pull/6391)

**Why watch it:**  
This is a **large stacked series** spanning more than a month in some cases. While technically coherent, long dependency chains can stall if review bandwidth is limited. Given the importance of CDC streaming, this deserves sustained maintainer attention.

#### DSv2 create/write path stack
- [#6449](https://github.com/delta-io/delta/pull/6449)
- [#6450](https://github.com/delta-io/delta/pull/6450)
- [#6482](https://github.com/delta-io/delta/pull/6482)
- [#6483](https://github.com/delta-io/delta/pull/6483)

**Why watch it:**  
This stack appears to be converging on **end-to-end DSv2 table creation and batch write support**. Because these changes are foundational, delayed review could slow multiple downstream features.

#### Managed commit evolution
- [#6347](https://github.com/delta-io/delta/pull/6347)

**Why watch it:**  
This touches **schema evolution under managed commit infrastructure**, which is both strategically important and potentially sensitive for correctness and governance expectations.

### Issue backlog needing timely response

- [#6167](https://github.com/delta-io/delta/issues/6167) — now effectively in progress via [#6484](https://github.com/delta-io/delta/pull/6484); should be easy to close if the API design is accepted.
- [#6480](https://github.com/delta-io/delta/issues/6480) — protocol-doc ambiguity; small on surface area, but important for interoperability and should not linger.

---

## Bottom Line

Delta Lake is showing **strong engineering momentum**, especially in **Kernel-backed DSv2 writes, CDC streaming, managed commit flows, and interoperability-related work**. The biggest health signal is not bug churn but **a deep queue of substantial open PR stacks**, which is positive for roadmap progress but may create integration risk if reviews bottleneck. Near-term likely wins include **Kernel commit tags**, **DSv2 write path completion**, and continued **CDC streaming hardening**. The main recommendation from today’s data: prioritize maintainer attention on the large stacked PR series so this implementation energy converts into shipped capabilities.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-04-04

## 1. Today's Overview

Databend showed moderate-to-high development activity over the last 24 hours, with **11 pull requests updated** and **2 issues updated**, while **no new release** was published. The day’s changes were concentrated in the query layer, SQL semantics, storage metadata safety, and CI/build improvements. Overall project health looks solid: one notable storage metadata bug was quickly closed with a corresponding fix PR, while several larger feature and refactor PRs remain actively in flight. The mix of work suggests the team is balancing **correctness/stability fixes** with **forward-looking capabilities** such as table branching, geometry support, file encoding support, and memory-pressure handling.

## 2. Project Progress

### Merged/closed PRs today

#### 1. Flashback/time-travel metadata consistency safeguards
- PR: [#19653](https://github.com/databendlabs/databend/pull/19653) — **CLOSED**
- Related issue: [#19661](https://github.com/databendlabs/databend/issues/19661) — **CLOSED**

This was the most consequential stability item of the day. The PR addresses metadata inconsistency after **`ALTER TABLE ... FLASHBACK TO`** and related historical snapshot navigation, especially where schema-dependent metadata such as bloom index options, policies, indexes, cluster keys, and constraints could drift from the reverted schema. This directly advances storage-engine safety and time-travel correctness, reducing the risk of **write failures, query errors, and silent corruption scenarios**.

#### 2. Session setting isolation for SET_VAR hints
- PR: [#19663](https://github.com/databendlabs/databend/pull/19663) — **CLOSED**

This fix corrects how `SET_VAR` hints write into shared query settings. The change appears aimed at preventing session/query-setting leakage or unintended cross-query side effects, which is important for predictable optimizer/runtime behavior in multi-query or concurrent environments. It is a query-layer correctness fix with likely operational impact for users relying on statement-level tuning hints.

#### 3. macOS CI coverage added
- PR: [#19662](https://github.com/databendlabs/databend/pull/19662) — **CLOSED**

This adds a native macOS PR validation check. While not user-facing, it strengthens build/test coverage and should improve portability and earlier detection of platform-specific regressions.

### Notable active progress in open PRs

#### Experimental table branch support
- PR: [#19551](https://github.com/databendlabs/databend/pull/19551)

This is one of the strongest roadmap signals right now. It introduces **table branches for FUSE tables**, including branch creation, branch-qualified reads/writes, branch lifecycle metadata, and branch-aware garbage collection. If merged, this would materially expand Databend’s data versioning and isolated experimentation story.

#### Geometry scalar and aggregate functions
- PR: [#19620](https://github.com/databendlabs/databend/pull/19620)

Adds geometry functions plus aggregate/overlay support for operations like union/intersection/difference. This points to growing SQL analytical breadth, especially for geospatial-style workloads.

#### Optional query-path modularization
- PR: [#19644](https://github.com/databendlabs/databend/pull/19644)

This refactor extracts optional query paths into support crates and wires feature gates more cleanly. This should improve modular builds, reduce binary surface area, and make feature composition easier.

#### Binder alias semantics stabilization
- PR: [#19618](https://github.com/databendlabs/databend/pull/19618)

A substantial SQL refactor targeting alias semantics across `WHERE`, `HAVING`, `QUALIFY`, and `ORDER BY`. This is a strong SQL compatibility/correctness effort and likely addresses subtle planner/binder edge cases.

## 3. Community Hot Topics

### 1. Optimizer constant folding ignoring session context
- Issue: [#19656](https://github.com/databendlabs/databend/issues/19656)
- Comments: 2

This is the most active issue by discussion. The report says optimizer/planner code paths use `FunctionContext::default()` instead of the actual session context during constant folding and expression evaluation. The technical need here is clear: **optimization must preserve session-dependent semantics**. If unresolved, functions affected by session settings could produce values during planning that differ from runtime semantics, creating correctness mismatches that are especially dangerous because they are silent.

### 2. Flashback metadata inconsistency
- Issue: [#19661](https://github.com/databendlabs/databend/issues/19661)
- Fixed by PR: [#19653](https://github.com/databendlabs/databend/pull/19653)

Although this issue had no comments, it is operationally significant. It highlights a core technical need in analytical storage engines: **schema and metadata must revert atomically and coherently during snapshot navigation**. The quick closure indicates maintainers treated it as high priority.

### 3. Large roadmap PRs drawing sustained attention
While comment counts are not available for PRs in this dataset, the following updated PRs are strategically important and likely under active review:
- [#19551](https://github.com/databendlabs/databend/pull/19551) — table branches
- [#19620](https://github.com/databendlabs/databend/pull/19620) — geometry functions
- [#19644](https://github.com/databendlabs/databend/pull/19644) — modular query support crates
- [#19618](https://github.com/databendlabs/databend/pull/19618) — binder alias semantics

Underlying needs: safer data versioning, richer analytical SQL surface, cleaner architecture, and fewer SQL semantic surprises.

## 4. Bugs & Stability

Ranked by likely severity based on impact described.

### High severity

#### A. Flashback metadata inconsistency could lead to corruption-like outcomes
- Issue: [#19661](https://github.com/databendlabs/databend/issues/19661)
- Fix PR: [#19653](https://github.com/databendlabs/databend/pull/19653)

Impact included **write failures, query errors, or silent data corruption** after reverting to historical snapshots when metadata no longer matched schema state. This is the most severe bug in today’s set because it touches durability and correctness around storage metadata. Mitigation exists and was closed quickly.

### Medium severity

#### B. Optimizer constant folding may ignore session semantics
- Issue: [#19656](https://github.com/databendlabs/databend/issues/19656)

This can cause query planning to evaluate expressions with the wrong context. Severity is high for correctness-sensitive workloads, though the exact blast radius depends on which functions/settings are involved. No fix PR is listed yet in today’s data, so this remains an item to watch closely.

#### C. SET_VAR hint writing into shared query settings
- PR: [#19663](https://github.com/databendlabs/databend/pull/19663)

This bug suggests mutable/shared setting state could be affected incorrectly by hints. The risk is query interference or non-isolated behavior rather than storage corruption, so it ranks below the flashback issue. It appears resolved.

### Lower-severity but important operational/stability work

#### D. macOS CI validation gap addressed
- PR: [#19662](https://github.com/databendlabs/databend/pull/19662)

Not a runtime bug, but an infrastructure fix that lowers future regression risk.

#### E. Broadcast join with merge-limit build
- PR: [#19652](https://github.com/databendlabs/databend/pull/19652) — OPEN

This open fix targets cluster execution for a specific broadcast join plan shape. It points to distributed execution correctness gaps in more complex physical plans and is relevant for production workloads using joins plus limits in clustered mode.

## 5. Feature Requests & Roadmap Signals

### Strong signals likely to influence the next version

#### 1. Table branches for FUSE tables
- PR: [#19551](https://github.com/databendlabs/databend/pull/19551)

This is the clearest major feature candidate. Branch-qualified reads/writes and branch-aware GC are non-trivial additions that suggest Databend is pushing further into **Git-like data workflow semantics** for analytical tables.

#### 2. Geometry functions
- PR: [#19620](https://github.com/databendlabs/databend/pull/19620)

Support for geometry scalar and aggregate functions indicates expansion toward richer SQL analytics and potentially geospatial processing use cases.

#### 3. AUTO datetime format detection
- PR: [#19659](https://github.com/databendlabs/databend/pull/19659)

Adds a session setting for deterministic auto-detection of non-ISO datetime formats. This is a practical SQL usability feature that may land soon because it is relatively self-contained and directly improves ingestion/query convenience.

#### 4. CSV/TEXT encoding support
- PR: [#19660](https://github.com/databendlabs/databend/pull/19660)

This addresses a real ingestion compatibility gap by adding charset decoding and a minimal malformed-input policy. This is the kind of feature that often gets prioritized because it removes friction for heterogeneous enterprise datasets.

#### 5. Spill backoff under global memory pressure
- PR: [#19655](https://github.com/databendlabs/databend/pull/19655)

This is a performance/stability feature rather than surface SQL functionality. It suggests Databend is tuning behavior for overloaded multi-tenant or memory-constrained environments, trying to avoid unnecessary spill churn.

### Prediction

Most likely near-term merges from the current open set:
- [#19659](https://github.com/databendlabs/databend/pull/19659) AUTO datetime detection
- [#19660](https://github.com/databendlabs/databend/pull/19660) CSV/TEXT encoding support
- [#19652](https://github.com/databendlabs/databend/pull/19652) broadcast join fix
- [#19655](https://github.com/databendlabs/databend/pull/19655) spill backoff

Most strategically important but potentially longer-review features:
- [#19551](https://github.com/databendlabs/databend/pull/19551) table branches
- [#19618](https://github.com/databendlabs/databend/pull/19618) binder alias semantics refactor
- [#19620](https://github.com/databendlabs/databend/pull/19620) geometry support
- [#19644](https://github.com/databendlabs/databend/pull/19644) support crate modularization

## 6. User Feedback Summary

The day’s user-visible pain points cluster around **correctness and compatibility**, not raw performance complaints.

- Users care that optimizer behavior respects **session-level semantics**, as seen in [#19656](https://github.com/databendlabs/databend/issues/19656). This reflects real-world use cases where query behavior depends on session settings, and any planner/runtime mismatch is unacceptable.
- Storage users need **safe flashback/time-travel operations**, highlighted by [#19661](https://github.com/databendlabs/databend/issues/19661). This implies active adoption of historical snapshot features and sensitivity to metadata integrity.
- Ingestion compatibility remains a practical need, reflected by [#19660](https://github.com/databendlabs/databend/pull/19660) and [#19659](https://github.com/databendlabs/databend/pull/19659): users want Databend to accept messy real-world datetime and text encodings with less manual preprocessing.
- SQL semantics consistency is also a visible concern, suggested by [#19618](https://github.com/databendlabs/databend/pull/19618). Users likely encounter ambiguity around aliases and clause rewrites, a common source of migration friction from other SQL engines.

There is no explicit positive satisfaction signal in today’s issue data such as praise on performance gains or release adoption, but the feature pipeline suggests maintainers are responding to practical workload needs.

## 7. Backlog Watch

These items appear important and deserve maintainer attention due to risk, scope, or strategic value.

### Needs prompt attention

#### 1. Session-context bug in optimizer constant folding
- Issue: [#19656](https://github.com/databendlabs/databend/issues/19656)

This is still open and could affect semantic correctness broadly. It should likely be prioritized unless the affected function set is narrow.

### Large open PRs with strategic importance

#### 2. Experimental table branch support
- PR: [#19551](https://github.com/databendlabs/databend/pull/19551)

Open since 2026-03-15. This is a major feature with architectural implications; long review cycles are understandable, but it merits close maintainer engagement because it is a strong differentiator.

#### 3. Binder alias semantics refactor
- PR: [#19618](https://github.com/databendlabs/databend/pull/19618)

A cross-cutting SQL semantic refactor can easily stall if review bandwidth is limited. Given its impact on compatibility and planner correctness, it should not linger too long without clear review direction.

#### 4. Geometry function support
- PR: [#19620](https://github.com/databendlabs/databend/pull/19620)

Potentially substantial in scope and likely needing careful review for type semantics, function behavior, and performance characteristics.

#### 5. Query-path modularization into support crates
- PR: [#19644](https://github.com/databendlabs/databend/pull/19644)

Important for codebase maintainability and feature gating, but refactors like this can remain open unless maintainers actively drive closure.

---

## Overall Health Assessment

Databend remains **actively maintained and technically ambitious**. Today’s activity shows a healthy pattern: serious correctness bugs are being fixed quickly, CI coverage is improving, and the open PR queue contains meaningful advances in SQL features, ingestion compatibility, storage branching, and execution behavior. The main risk area is **semantic correctness across optimizer/binder/session interactions**, which appears in both the open issue [#19656](https://github.com/databendlabs/databend/issues/19656) and ongoing SQL refactor work like [#19618](https://github.com/databendlabs/databend/pull/19618). If maintainers continue closing correctness gaps while landing the current feature set, the next release should be notably stronger in both usability and engine maturity.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-04-04

## 1. Today's Overview

Velox showed **high pull-request activity** over the last 24 hours, with **50 PRs updated** and **19 PRs merged or closed**, while issue volume remained low at **4 updated issues**. The day’s most important signal is a **fresh cuDF regression affecting mainline CI**, indicating active GPU-path development but also short-term instability in that area. In parallel, the project continued to advance **SQL function parity**, **test infrastructure fixes**, and **engine/runtime cleanup** through a mix of merged work and active proposals. Overall, project health looks **active but slightly CI-stressed**, with core development continuing at a strong pace.

## 3. Project Progress

### Merged/closed PRs today: notable advances

#### GPU / cuDF execution
- **[PR #16769](https://github.com/facebookincubator/velox/pull/16769)** — `feat(cudf): Add config to set timestamp unit`  
  Merged work on configurable timestamp units improves interoperability between **Spark-style microsecond timestamps** and **Presto-style nanosecond timestamps**. This is a meaningful compatibility enhancement for Velox’s GPU execution path and suggests ongoing investment in cross-engine semantics.

- **[Issue #16492](https://github.com/facebookincubator/velox/issues/16492)** — `[cuDF] Implement/fix COUNT(*) (global) and re-enable test`  
  This issue was closed, indicating progress on **global aggregation correctness in GPU mode**, specifically for `COUNT(*)`. That strengthens confidence in cuDF aggregation support, though today’s newly reported cuDF regression shows the subsystem is still evolving rapidly.

#### Test quality / reliability
- **[PR #15748](https://github.com/facebookincubator/velox/pull/15748)** — `test: Use VectorFuzzer for random RowVector generation...`  
  Merged to improve test robustness and reduce dependence on ad hoc randomness. This is a positive reliability signal: fuzz-driven input generation usually improves reproducibility and broadens coverage of operator edge cases.

#### Engine correctness and concurrency cleanup
Several older PRs were closed today, reflecting backlog churn rather than fresh merges, but they reveal technical themes maintainers are dealing with:
- **[PR #15179](https://github.com/facebookincubator/velox/pull/15179)** — `fix: Remove tsan_lock_guard`
- **[PR #15140](https://github.com/facebookincubator/velox/pull/15140)** — `fix: Rewrite tsan atomic to always use std atomic`
- **[PR #11771](https://github.com/facebookincubator/velox/pull/11771)** — `fix: Fix smj result mismatch issue in semi, anti and full outer join`

These indicate sustained attention to **thread-safety tooling consistency** and **join correctness**, both critical for analytical execution engines.

#### Build / dependency / developer tooling
- **[PR #15791](https://github.com/facebookincubator/velox/pull/15791)** — `feat(build): Upgrade fmt to 12.1.0`
- **[PR #15735](https://github.com/facebookincubator/velox/pull/15735)** — trace directory configuration support
- **[PR #15763](https://github.com/facebookincubator/velox/pull/15763)** — selective reader string optimization control
- **[PR #15606](https://github.com/facebookincubator/velox/pull/15606)** — CI dependency bump for cibuildwheel
- **[PR #15877](https://github.com/facebookincubator/velox/pull/15877)** — improve `uv` install permissions handling

Even where not merged today, these updates point to steady work on **build reproducibility**, **developer ergonomics**, and **reader-path configurability**.

## 4. Community Hot Topics

### 1) cuDF regression breaking CI
- **[Issue #17028](https://github.com/facebookincubator/velox/issues/17028)** — `[CI] Persistent cuDF test failure: ToCudfSelectionTest.zeroColumnCountConstantFallsBack`
- **[Issue #17027](https://github.com/facebookincubator/velox/issues/17027)** — `[bug, cudf] CudfToVelox::getOutput() returns empty vector for zero-column plans`

This is the clearest hot topic today. The issue affects the **Linux GCC cudf-tests workflow** and appears to have been introduced by a recent merge. The underlying technical need is better handling of **zero-column plans**, an edge case that matters in projection, selection, and constant-expression pipelines. In analytical engines, these “empty schema but non-empty row count” cases are subtle and often break interoperability between CPU and GPU execution backends.

### 2) macOS test discoverability
- **[Issue #17023](https://github.com/facebookincubator/velox/issues/17023)** — grouped tests break individual test discovery on macOS
- **[PR #17026](https://github.com/facebookincubator/velox/pull/17026)** — disable grouped tests on macOS for individual test discovery

This is a developer-experience topic rather than an end-user feature, but it matters. Grouped test binaries improve link/build efficiency, yet they interfere with `ctest -R <TestName>` workflows on macOS. The proposed fix shows maintainers are balancing **build scalability** against **local debuggability**, which is important for contributor productivity.

### 3) SQL function parity with Presto
- **[PR #16048](https://github.com/facebookincubator/velox/pull/16048)** — `array_top_n` with transform lambda
- **[PR #16162](https://github.com/facebookincubator/velox/pull/16162)** — `map_top_n_keys` with transform lambda
- **[PR #16487](https://github.com/facebookincubator/velox/pull/16487)** — `array_least_frequent`

These open PRs highlight ongoing demand for **Presto-compatible higher-order functions**. The technical need here is clear: users embedding Velox under SQL engines want broad coverage of advanced array/map semantics without fallback to another engine layer.

## 5. Bugs & Stability

Ranked by severity:

### Critical
1. **Persistent cuDF CI regression on main**
   - **[Issue #17028](https://github.com/facebookincubator/velox/issues/17028)**
   - **[Issue #17027](https://github.com/facebookincubator/velox/issues/17027)**
   
   **Impact:** Breaks the `cudf-tests` job on every merge since a recent PR landed.  
   **Technical scope:** GPU execution correctness for zero-column plans.  
   **Fix status:** A bug issue exists, but no linked fix PR is listed in the provided data yet.  
   **Assessment:** Highest-severity item today because it affects CI health and may indicate runtime correctness problems in GPU fallback/output materialization logic.

### Medium
2. **macOS individual test discovery broken by grouped tests**
   - **[Issue #17023](https://github.com/facebookincubator/velox/issues/17023)**
   - **[PR #17026](https://github.com/facebookincubator/velox/pull/17026)**
   
   **Impact:** Hurts local testing and debugging on macOS developer machines.  
   **Fix status:** A targeted PR was opened the same day, which is a good responsiveness signal.  
   **Assessment:** Not production-critical, but important for contributor efficiency and CI parity.

### Resolved / improving
3. **cuDF global `COUNT(*)` correctness**
   - **[Issue #16492](https://github.com/facebookincubator/velox/issues/16492)**

   **Impact:** Previously affected correctness of global aggregation in GPU mode.  
   **Fix status:** Closed.  
   **Assessment:** Positive sign that maintainers are systematically addressing GPU semantic gaps.

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals
1. **Higher-order SQL function expansion**
   - **[PR #16048](https://github.com/facebookincubator/velox/pull/16048)** — `array_top_n(..., lambda)`
   - **[PR #16162](https://github.com/facebookincubator/velox/pull/16162)** — `map_top_n_keys(..., lambda)`
   - **[PR #16487](https://github.com/facebookincubator/velox/pull/16487)** — `array_least_frequent`

These suggest Velox is continuing to close gaps with **Presto Java semantics**. This is the most likely area to surface in a near-term version, because the work is concrete, user-facing, and aligned with engine compatibility goals.

2. **GPU semantic compatibility**
   - **[PR #16769](https://github.com/facebookincubator/velox/pull/16769)** — timestamp unit config
   - **[Issue #16492](https://github.com/facebookincubator/velox/issues/16492)** — global `COUNT(*)`
   - **[Issue #17027](https://github.com/facebookincubator/velox/issues/17027)** — zero-column output bug

Taken together, these indicate an active roadmap around making cuDF execution more **semantically aligned with upstream SQL engines** and more robust on edge cases.

3. **Reader/storage-path configurability**
   - **[PR #15763](https://github.com/facebookincubator/velox/pull/15763)** — selective reader string optimization control
   - **[PR #15878](https://github.com/facebookincubator/velox/pull/15878)** — cluster index bounds filtering support

These point to continued investment in **scan-path optimization** and **storage-aware filtering**, both important for OLAP workloads.

### Likely next-version candidates
Most likely to land in an upcoming release based on current signals:
- Presto-parity array/map functions
- More cuDF compatibility and correctness fixes
- Developer tooling improvements around test infrastructure and build portability

## 7. User Feedback Summary

Today’s user and contributor feedback centers on three pain points:

1. **GPU edge-case correctness is fragile**  
   The zero-column cuDF regression shows that contributors are exercising nuanced plan shapes and expect CPU/GPU parity. This is common in analytical systems where operators must preserve row cardinality even when projected schemas are empty.

2. **Local developer workflows matter**  
   The macOS grouped-test issue shows users need to run **individual tests by name**, not just large grouped binaries. Fast iteration and debuggability remain a real concern for contributors.

3. **SQL compatibility continues to drive demand**  
   Open PRs for `array_top_n`, `map_top_n_keys`, and `array_least_frequent` show users want Velox to support more of the higher-level SQL function surface expected from Presto-family engines.

Overall sentiment from the available data is less about performance complaints today and more about **correctness, compatibility, and contributor ergonomics**.

## 8. Backlog Watch

These older or stale items appear important enough to warrant maintainer attention:

- **[PR #13907](https://github.com/facebookincubator/velox/pull/13907)** — `feat: Fix the full outer join result mismatch issue`  
  Long-running open correctness PR involving full outer join semantics. Since join correctness is foundational for analytical workloads, this deserves review priority.

- **[PR #15606](https://github.com/facebookincubator/velox/pull/15606)** — `build(ci): Bump pypa/cibuildwheel from 3.0.0 to 3.3.0`  
  Dependency update PRs can linger, but delayed CI/toolchain refreshes eventually increase maintenance cost.

- **[PR #15878](https://github.com/facebookincubator/velox/pull/15878)** — index-related improvements and cluster index bounds filtering  
  Potentially valuable for scan pruning and storage efficiency; worth attention if maintainers are prioritizing DWIO/read-path improvements.

- **[PR #16048](https://github.com/facebookincubator/velox/pull/16048)** and **[PR #16162](https://github.com/facebookincubator/velox/pull/16162)**  
  Both are user-facing SQL compatibility features that have remained open for months. These are the kinds of enhancements downstream query engines tend to value immediately.

- **[PR #16487](https://github.com/facebookincubator/velox/pull/16487)** — `array_least_frequent`  
  Another practical compatibility function that could be a quick win if review bandwidth allows.

## Overall Health Signal

Velox remains a **high-velocity analytical engine project** with clear momentum in **GPU execution**, **SQL compatibility**, and **test/build infrastructure**. The main caution today is the **cuDF CI regression**, which should be treated as the top short-term stability issue. Beyond that, the project appears healthy, responsive, and actively evolving in ways that matter to OLAP engine integrators.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-04-04

## 1. Today's Overview

Apache Gluten showed **moderate day-to-day engineering activity** over the last 24 hours: **3 issues updated** and **9 pull requests updated**, with most visible work concentrated in the **Velox backend**, **CI/build infrastructure**, and **Spark 4.0 test compatibility**. There were **no new releases**, so today’s signal is mainly about incremental hardening rather than version-level delivery. The project appears **operationally healthy**, with two recently closed issues and several corresponding PRs moving quickly, especially around **native validation correctness** and **Apache policy-compliant CI fixes**. At the same time, the open tracker for unmerged upstream Velox PRs remains an important strategic indicator that Gluten continues to depend on upstream Velox integration velocity.

---

## 3. Project Progress

### Merged/closed PRs today

#### 1) Native validation correctness improved for CrossRelNode expressions
- PR: [#11679](https://github.com/apache/gluten/pull/11679) — **[CLOSED] [VELOX] [GLUTEN-11678][VL] Native validation should check CrossRelNode's expression**
- Related issue: [#11678](https://github.com/apache/gluten/issues/11678) — **[CLOSED] [bug, triage] [VL] CrossRelNode's expression is not validated in native validation**

This is the most important engine-side correctness fix in today’s batch. The bug concerned a `BroadcastNestedLoopJoin` case where unsupported expressions such as `regexp_extract` inside `CrossRelNode` were **not being caught during native validation**, allowing a plan to proceed into native execution and fail later. The fix adds validation for the `CrossRelNode` expression path and falls back when unsupported expressions are detected.

**Why it matters**
- Improves **query correctness and failure predictability**
- Prevents **late native-execution failures**
- Strengthens Gluten’s **Spark-to-native fallback safety model**
- Particularly relevant for SQL compatibility edge cases involving **regex/function support gaps**

#### 2) CI/docker build repaired to comply with Apache action policy
- Issue: [#11872](https://github.com/apache/gluten/issues/11872) — **[CLOSED] [VL] Fix Gluten CI image build**
- PR: [#11873](https://github.com/apache/gluten/pull/11873) — **[CLOSED] [BUILD, INFRA] [GLUTEN-11872][VL] Fix docker build**
- Follow-up PR: [#11875](https://github.com/apache/gluten/pull/11875) — **[OPEN] [INFRA] [GLUTEN-11872][VL] Fix docker metadata action version**

The project hit a CI break because several GitHub Actions used in Docker image workflows were not allowed under Apache policy. A fix PR was closed quickly, and a follow-up remains open to correct metadata action versioning.

**Why it matters**
- Restores **build reproducibility**
- Reduces **contributor friction**
- Keeps infra aligned with **ASF governance/compliance**
- Important for a project like Gluten where **multi-backend CI** is critical

#### 3) Velox version tracking continues through automated daily sync
- PR: [#11860](https://github.com/apache/gluten/pull/11860) — **[CLOSED] Daily Update Velox Version (2026_04_01)**
- PR: [#11874](https://github.com/apache/gluten/pull/11874) — **[OPEN] Daily Update Velox Version (2026_04_03)**

Daily Velox update PRs indicate the project is maintaining a tight coupling with upstream Velox changes. This is not a user-facing feature by itself, but it is a strong signal that Gluten is actively integrating:
- build-system changes
- memory-management improvements
- fuzzer/test fixes
- backend runtime evolution

**Strategic implication**
Gluten’s feature velocity and stability are still significantly shaped by **upstream Velox churn**, making integration hygiene a core part of project progress.

#### 4) Stale work was cleaned up
- PR: [#8056](https://github.com/apache/gluten/pull/8056) — **[CLOSED][stale] Support read Iceberg equality delete file MOR table**
- PR: [#9491](https://github.com/apache/gluten/pull/9491) — **[CLOSED][stale] test arrow + new thrift**

This cleanup improves backlog clarity, though it also highlights that some potentially valuable compatibility work—especially around **Iceberg MOR equality deletes**—is still unresolved at product level.

---

## 4. Community Hot Topics

### 1) Velox upstream gap tracking remains the biggest strategic discussion
- Issue: [#11585](https://github.com/apache/gluten/issues/11585) — **[OPEN] [enhancement, tracker] [VL] useful Velox PRs not merged into upstream**
- Activity: **16 comments**, **4 👍**

This is the most active item in the current snapshot. It tracks useful Velox PRs—many originating from the Gluten community—that have not yet landed upstream.

**Underlying technical need**
- Gluten users want features/fixes without carrying a long-lived fork
- Maintainers want to avoid expensive rebasing in `gluten/velox`
- There is sustained demand for **faster upstreaming of backend-enabling changes**

**Interpretation**
This issue reflects a structural challenge in the Gluten ecosystem: the project’s performance and compatibility roadmap is partly gated by **upstream Velox acceptance speed**. This is a key signal for users evaluating backend maturity and upgrade risk.

### 2) Spark 4.0 enhanced test enablement
- PR: [#11868](https://github.com/apache/gluten/pull/11868) — **[OPEN] [VELOX, INFRA] [VL] Enable enhanced tests for spark 4.0 & fix failures**

This open PR aims to enable stronger test coverage for **Spark 4.0** and address Iceberg query failures caused by new metadata columns.

**Underlying technical need**
- Early validation against Spark 4.0 behavior changes
- Better SQL compatibility as Spark introduces schema/metadata evolutions
- Reduced regressions in **Iceberg-related query paths**

This is one of the strongest roadmap signals in today’s data: Gluten is actively preparing for the **Spark 4.0 adoption wave**.

### 3) TimestampNTZ fallback control for Velox validation
- PR: [#11720](https://github.com/apache/gluten/pull/11720) — **[OPEN] [CORE, VELOX, DOCS] [GLUTEN-1433] [VL] Add config to disable TimestampNTZ validation fallback**

This PR adds a config allowing developers/users to disable automatic fallback validation for `TimestampNTZType`, plus testing around `localtimestamp()`.

**Underlying technical need**
- Advanced users need to test and develop native support incrementally
- Current fallback behavior may be overly conservative
- Timestamp semantics remain a major compatibility frontier between Spark and native engines

This is a meaningful signal that Gluten is moving from purely defensive fallback logic toward **more tunable backend validation behavior**.

---

## 5. Bugs & Stability

### Severity 1 — Query correctness / execution failure
#### CrossRelNode native validation missed unsupported expressions
- Issue: [#11678](https://github.com/apache/gluten/issues/11678)
- Fix PR: [#11679](https://github.com/apache/gluten/pull/11679)
- Status: **Fixed/closed**

**Impact**
A query could pass validation even when it contained unsupported expressions in `CrossRelNode`, then fail during native execution. This is a serious correctness/stability issue because it breaks the expected fallback contract.

**Assessment**
High severity for affected workloads, but mitigated quickly by a targeted fix.

---

### Severity 2 — CI/build pipeline breakage
#### Docker CI image build failed due to disallowed GitHub Actions
- Issue: [#11872](https://github.com/apache/gluten/issues/11872)
- Fix PR: [#11873](https://github.com/apache/gluten/pull/11873)
- Follow-up: [#11875](https://github.com/apache/gluten/pull/11875)
- Status: **Issue closed; follow-up still open**

**Impact**
This does not directly affect runtime query correctness, but it can block:
- contributor workflows
- image publication
- CI confidence for backend changes

**Assessment**
Medium severity operational issue; response was fast, which is a good health signal.

---

### Severity 3 — Ongoing compatibility risk areas
#### Spark 4.0 + Iceberg metadata column failures
- PR: [#11868](https://github.com/apache/gluten/pull/11868)
- Status: **Open**

This appears to be a forward-compatibility and test-failure area rather than a newly reported production bug, but it is an important risk surface.

**Assessment**
Watch closely: Spark 4.0 support quality will influence the next phase of Gluten adoption.

---

## 6. Feature Requests & Roadmap Signals

### Likely near-term roadmap themes

#### 1) Better Spark 4.0 compatibility
- PR: [#11868](https://github.com/apache/gluten/pull/11868)

This is the clearest near-term roadmap signal. Expect continued work around:
- updated planner/test behavior
- Iceberg metadata handling
- broader enhanced-test coverage for Spark 4.0

**Prediction:** high probability of inclusion in the next actively developed release line.

#### 2) More controllable TimestampNTZ native validation
- PR: [#11720](https://github.com/apache/gluten/pull/11720)

This suggests a demand for:
- finer-grained validation controls
- easier experimentation with partially supported types/functions
- reducing fallback barriers for backend feature development

**Prediction:** likely to land soon because it is low-risk and useful for both developers and power users.

#### 3) Upstream Velox dependency reduction / faster incorporation of needed patches
- Issue: [#11585](https://github.com/apache/gluten/issues/11585)

Although not a traditional end-user feature request, this tracker strongly implies a roadmap focus on:
- shortening time-to-consume backend features
- reducing rebase cost
- clarifying which Velox patches are effectively required by Gluten users

**Prediction:** this will continue to shape backend feature availability more than any single PR.

#### 4) Iceberg delete-file/MOR support remains desired but unresolved
- Stale PR: [#8056](https://github.com/apache/gluten/pull/8056)

The closure as stale does **not** mean demand disappeared. Reading Iceberg equality delete file MOR tables is still an important lakehouse compatibility capability.

**Prediction:** likely to re-emerge when maintainers return to deeper Iceberg parity work.

---

## 7. User Feedback Summary

Based on the issues and PRs updated today, the main user and contributor pain points are:

### 1) Native fallback must be reliable and early
Users expect unsupported SQL expressions to be detected during validation, not after native execution begins. The CrossRelNode issue shows that **predictable fallback behavior** is still one of the most important trust factors for Gluten adoption.

### 2) Spark compatibility is a moving target
The Spark 4.0 enhanced test work and TimestampNTZ-related validation controls indicate that users are pushing Gluten into **new Spark semantics and data type behavior**, especially around:
- timestamp handling
- metadata columns
- lakehouse table compatibility

### 3) Iceberg remains a practical compatibility battleground
Both the Spark 4.0 PR and the stale MOR/equality-delete PR point to a recurring theme: users care about **real-world Iceberg workloads**, not just benchmark-style SQL support.

### 4) Contributors need stable CI and dependency flow
The CI image build issue and the Velox tracker show that contributors are affected by:
- ASF workflow restrictions
- upstream dependency lag
- integration overhead

Overall, current feedback is less about raw performance and more about **compatibility, validation correctness, and operational smoothness**.

---

## 8. Backlog Watch

### 1) Unmerged upstream Velox work tracker needs continued maintainer attention
- Issue: [#11585](https://github.com/apache/gluten/issues/11585)

This is the most important open backlog item in the current view. It is active, commented, and strategically significant. If left unmanaged, it can create:
- hidden feature dependencies
- user confusion about backend readiness
- long-term maintenance drag

### 2) TimestampNTZ fallback configuration is still open
- PR: [#11720](https://github.com/apache/gluten/pull/11720)

This looks actionable and useful. Given the importance of timestamp semantics in Spark compatibility, it likely deserves timely review.

### 3) Spark 4.0 enhanced tests and Iceberg fixes should be prioritized
- PR: [#11868](https://github.com/apache/gluten/pull/11868)

This PR is important for forward compatibility. Delay here could slow confidence in Spark 4.0 support.

### 4) Follow-up CI metadata action fix should be completed
- PR: [#11875](https://github.com/apache/gluten/pull/11875)

Even though the main issue is closed, leaving the follow-up open for long would risk recurring infra friction.

### 5) Iceberg MOR equality delete support remains an unsolved need despite stale closure
- PR: [#8056](https://github.com/apache/gluten/pull/8056)

This older PR’s stale closure suggests maintainers may need either:
- a refreshed implementation
- clearer roadmap communication
- or issue-level tracking for Iceberg delete semantics support

---

## Overall Project Health

Apache Gluten appears **active and technically responsive**, with quick turnaround on correctness and infrastructure issues. The strongest current themes are **Velox backend dependency management**, **Spark 4.0 readiness**, and **validation/fallback correctness**. No release was cut today, but the project is making meaningful progress in the areas that most affect production trust: **query compatibility, CI stability, and upstream synchronization**.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-04-04

## 1. Today's Overview

Apache Arrow showed **moderate-to-high maintenance activity** over the last 24 hours, with **14 issues updated** and **19 pull requests updated**, but **no new releases**. The day’s work was weighted toward **CI/build reliability, language binding polish, packaging, and compatibility fixes** rather than major new engine capabilities. A notable operational item was the **MATLAB CI breakage**, which was quickly fixed, suggesting healthy responsiveness to infrastructure regressions. There are also clear signals of ongoing investment in **Flight SQL/ODBC packaging on Windows**, **R ecosystem compliance**, and **Python type conversion completeness**.

## 2. Project Progress

### Merged/closed PRs today

Even without a release, several closed PRs indicate useful forward motion in stability and developer ergonomics:

- **MATLAB CI workflow fixed after action permission failure**  
  PR: [#49650](https://github.com/apache/arrow/pull/49650)  
  Related issue: [#49611](https://github.com/apache/arrow/issues/49611)  
  This resolves a CI outage caused by GitHub action permission policy changes. It does not change runtime functionality, but it restores test coverage for the MATLAB component, which is important for cross-language reliability.

- **PyArrow test suite adjusted for optional mimalloc builds**  
  PR: [#49645](https://github.com/apache/arrow/pull/49645)  
  This removes `"mimalloc"` from `mandatory_backends` in Python tests, addressing failures in downstream environments such as Debian where mimalloc is intentionally disabled. This is a **distribution compatibility** improvement and reduces false negatives in packaging/testing pipelines.

In addition, a number of **older Rust / DataFusion PRs** were closed or administratively updated today, including:
- [#9527](https://github.com/apache/arrow/pull/9527) — avoid expr copies in DataFusion builders
- [#9215](https://github.com/apache/arrow/pull/9215) — Rust array slice accessors
- [#9497](https://github.com/apache/arrow/pull/9497) — split `buffer.rs`
- [#9010](https://github.com/apache/arrow/pull/9010) — CSV writing performance
- [#9642](https://github.com/apache/arrow/pull/9642) — DataFusion clippy lint
- [#9534](https://github.com/apache/arrow/pull/9534) — CSV schema inference without file IO
- [#9772](https://github.com/apache/arrow/pull/9772) — Boolean Kleene kernels

These are not evidence of fresh implementation work in the current Arrow monorepo so much as **backlog cleanup / historical closure activity**, likely reflecting repository hygiene around legacy Rust/DataFusion work that has long since moved elsewhere.

### What areas advanced today

From the currently active PR set, the most meaningful near-term progress is in:

- **Flight SQL / ODBC distribution and signing on Windows**
  - [#49585](https://github.com/apache/arrow/pull/49585) — static build of ODBC Flight SQL driver
  - [#49603](https://github.com/apache/arrow/pull/49603) — Windows CI support for ODBC DLL & MSI signing  
  These improve **enterprise deployability** rather than query semantics, but they matter materially for adoption.

- **Python data type completeness**
  - [#49658](https://github.com/apache/arrow/pull/49658) — DictionaryArray conversion for `pa.large_string` / `pa.large_binary`  
  This closes a type-system gap in Python array construction.

- **Compression/interoperability correctness**
  - [#49642](https://github.com/apache/arrow/pull/49642) — split large LZ4 Hadoop blocks for Hadoop compatibility  
  This is a strong storage interoperability fix with direct impact on JVM/Hadoop users.

- **R package quality and metadata support**
  - [#49653](https://github.com/apache/arrow/pull/49653) — fix non-API calls reported by CRAN
  - [#49655](https://github.com/apache/arrow/pull/49655) — add CI check for non-API calls
  - [#49631](https://github.com/apache/arrow/pull/49631) — field-level metadata in R  
  These strengthen both **CRAN survivability** and feature parity with other Arrow bindings.

## 3. Community Hot Topics

### 1) MATLAB CI permissions regression
- Issue: [#49611](https://github.com/apache/arrow/issues/49611)
- Fix PR: [#49650](https://github.com/apache/arrow/pull/49650)

This was the clearest urgent incident. The underlying need is **resilient CI governance under GitHub/org security policies**. For projects with many language bindings, CI breakage can silently reduce confidence in less-trafficked components. The quick turnaround indicates maintainers are watching platform health closely.

### 2) Windows packaging and signing for Flight SQL ODBC
- PR: [#49603](https://github.com/apache/arrow/pull/49603)
- PR: [#49585](https://github.com/apache/arrow/pull/49585)

This is one of the strongest roadmap signals in the dataset. The technical need is not just “build succeeds,” but **production-grade Windows deliverables**: signed DLLs, signed MSI installers, and static builds. That suggests Arrow is continuing to mature Flight SQL as a serious connector surface for enterprise BI/ODBC consumers.

### 3) R ecosystem compliance and proactive CI
- PR: [#49653](https://github.com/apache/arrow/pull/49653)
- PR: [#49655](https://github.com/apache/arrow/pull/49655)
- Issue: [#31999](https://github.com/apache/arrow/issues/31999)
- Issue: [#31975](https://github.com/apache/arrow/issues/31975)

The R maintainers are responding to **CRAN policy pressure** and improving preventive checks. The technical need here is clear: Arrow’s R package must stay aligned with CRAN requirements while preserving advanced functionality. This is a maintenance-heavy but strategically important area.

### 4) Python deprecation and type support cleanup
- PR: [#49590](https://github.com/apache/arrow/pull/49590)
- PR: [#49658](https://github.com/apache/arrow/pull/49658)

Two parallel needs are visible:  
1. **API simplification/deprecation** around `pyarrow.feather` in favor of `pyarrow.ipc`;  
2. **Completeness** in Python conversion support for large-value dictionary types.  
This reflects a maturing Python API surface where maintainers are both trimming redundancy and filling edge-case gaps.

### 5) Interoperability with Hadoop/LZ4 framing
- PR: [#49642](https://github.com/apache/arrow/pull/49642)

This is a technically important item because it touches **cross-system decompression compatibility**, not just local performance. Users interacting with Hadoop ecosystems need Arrow-produced compressed data to obey expected block-size assumptions.

## 4. Bugs & Stability

Ranked roughly by severity and user impact:

### High severity

1. **MATLAB workflows silently failing due to action permission error**
   - Issue: [#49611](https://github.com/apache/arrow/issues/49611)
   - Fix PR: [#49650](https://github.com/apache/arrow/pull/49650)
   
   Severity is high for project operations because it disabled CI coverage for MATLAB beginning March 20. The good news: **a fix already exists and the issue is closed**.

2. **Potential Hadoop incompatibility in LZ4 compression framing**
   - PR: [#49642](https://github.com/apache/arrow/pull/49642)
   
   This appears to address a correctness/interoperability bug where Arrow emits a single large Hadoop-framed LZ4 block, but Hadoop’s decompressor expects blocks bounded by a fixed output buffer. This could cause runtime `LZ4Exception`s for JVM users. No separate issue was listed in the provided issue set, but the PR suggests maintainers consider this a substantive compatibility problem.

### Medium severity

3. **Windows Flight SQL ODBC packaging/signing gaps**
   - PR: [#49603](https://github.com/apache/arrow/pull/49603)
   - PR: [#49585](https://github.com/apache/arrow/pull/49585)
   
   Not a data correctness bug, but a significant blocker for Windows distribution pipelines and enterprise deployment.

4. **PyArrow tests failing when mimalloc is disabled**
   - PR: [#49645](https://github.com/apache/arrow/pull/49645)
   
   Severity is medium because this mainly affects downstream packagers and CI, but it can impede adoption in distro environments.

5. **`parquet_scan` argument validation gives confusing error path**
   - PR: [#49540](https://github.com/apache/arrow/pull/49540)
   
   This is a low-to-medium severity CLI correctness/usability issue. The fix is small but worthwhile for diagnostics quality.

### Lower severity / quality issues

6. **CRAN non-API call warnings in R**
   - PR: [#49653](https://github.com/apache/arrow/pull/49653)
   - PR: [#49655](https://github.com/apache/arrow/pull/49655)
   
   Important for package health and releaseability, though not a core engine failure.

## 5. Feature Requests & Roadmap Signals

### Strong current signals

- **Flight SQL / ODBC packaging for Windows**
  - [#49585](https://github.com/apache/arrow/pull/49585)
  - [#49603](https://github.com/apache/arrow/pull/49603)  
  Likely to land soon because the work is active, concrete, and operationally motivated.

- **R field-level metadata**
  - [#49631](https://github.com/apache/arrow/pull/49631)  
  This looks like a good candidate for the next release because it improves cross-language feature parity and has a clear implementation path.

- **Python DictionaryArray support for `large_string` / `large_binary`**
  - [#49658](https://github.com/apache/arrow/pull/49658)  
  Also a strong next-version candidate: narrow scope, obvious user value, and directly tied to an enhancement request.

- **Ruby writer benchmarks**
  - Issue: [#49656](https://github.com/apache/arrow/issues/49656)
  - PR: [#49657](https://github.com/apache/arrow/pull/49657)  
  Likely to merge soon given that the issue immediately has a matching PR from the same author.

### Longer-horizon roadmap signals from updated issues

- **Substrait sort support in the C++ consumer**
  - Issue: [#31998](https://github.com/apache/arrow/issues/31998)
  
- **Substrait join suffix support**
  - Issue: [#31976](https://github.com/apache/arrow/issues/31976)
  
- **Read ACID Hive tables**
  - Issue: [#31974](https://github.com/apache/arrow/issues/31974)
  
These are strategically interesting because they touch **query planning interoperability**, **join semantics**, and **lakehouse/table-format compatibility**. However, all are stale-warning issues from 2022, so they look more like **latent user demand** than imminent roadmap items.

- **Deprecate Feather Python API in favor of IPC**
  - PR: [#49590](https://github.com/apache/arrow/pull/49590)  
  This could plausibly appear in the next version because it aligns with an upstream C++ deprecation and has clear migration messaging.

## 6. User Feedback Summary

Today’s user-facing feedback points to a few recurring pain points:

- **Packaging/distribution realities matter as much as core performance**
  - Windows signing and static ODBC driver builds ([#49603](https://github.com/apache/arrow/pull/49603), [#49585](https://github.com/apache/arrow/pull/49585))
  - Debian/non-mimalloc compatibility in PyArrow ([#49645](https://github.com/apache/arrow/pull/49645))  
  Users want Arrow to fit smoothly into enterprise and distro ecosystems.

- **Cross-ecosystem compatibility remains a top concern**
  - Hadoop LZ4 framing compatibility ([#49642](https://github.com/apache/arrow/pull/49642))
  - ACID Hive table reading request ([#31974](https://github.com/apache/arrow/issues/31974))  
  This suggests users increasingly evaluate Arrow not in isolation, but by how well it interoperates with Hadoop, Hive, CRAN, Windows installers, and downstream packaging conventions.

- **Language binding parity is still important**
  - R field metadata parity ([#49631](https://github.com/apache/arrow/pull/49631))
  - Python large dictionary conversion support ([#49658](https://github.com/apache/arrow/pull/49658))
  - MATLAB CI stability ([#49611](https://github.com/apache/arrow/issues/49611))  
  Arrow’s broad multi-language footprint continues to create demand for “feature completeness everywhere,” not just in C++.

- **API simplification and documentation clarity are wanted**
  - Feather deprecation in Python ([#49590](https://github.com/apache/arrow/pull/49590))
  - Better CLI behavior in `parquet_scan` ([#49540](https://github.com/apache/arrow/pull/49540))
  - Several stale documentation/usability issues updated today, such as [#31405](https://github.com/apache/arrow/issues/31405)

## 7. Backlog Watch

These items appear important but are aging or stale and may need maintainer attention:

- **Substrait sort support in C++ consumer**  
  Issue: [#31998](https://github.com/apache/arrow/issues/31998)  
  Important for query plan interoperability, but still open from 2022.

- **Substrait join suffix support**  
  Issue: [#31976](https://github.com/apache/arrow/issues/31976)  
  Relevant for SQL join output semantics and compatibility with higher-level consumers.

- **Read ACID Hive tables**  
  Issue: [#31974](https://github.com/apache/arrow/issues/31974)  
  Potentially high user value for Hadoop/Hive users, but stale.

- **Unsuppress `-Wno-return-stack-address` in C++**  
  Issue: [#31994](https://github.com/apache/arrow/issues/31994)  
  More of a code health task, but compiler-warning debt can hide real problems.

- **R compression detection by magic number**  
  Issue: [#31975](https://github.com/apache/arrow/issues/31975)  
  Practical usability improvement; likely small enough to be addressed if someone picks it up.

- **`between()` binding organization in R**  
  Issue: [#31999](https://github.com/apache/arrow/issues/31999)  
  Lower priority, but another sign of small R API papercuts.

Also worth noting: a large number of stale 2021–2022 issues and PRs were touched today, suggesting maintainers may be conducting **backlog triage/cleanup**. That is healthy for governance, but it also highlights that some older interoperability and execution-engine enhancement requests remain unresolved.

## 8. Overall Health Assessment

Project health today looks **solid but maintenance-heavy**. The strongest signals are:
- fast response to CI failures,
- serious attention to packaging and platform compatibility,
- steady language-binding improvements.

The weakest area is not active breakage, but rather **long-tail backlog pressure**, especially around older C++/Substrait/Hive-related enhancements. In short: Arrow appears operationally healthy, responsive, and incrementally improving, with current effort focused more on **reliability and ecosystem fit** than on headline analytical engine features.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*