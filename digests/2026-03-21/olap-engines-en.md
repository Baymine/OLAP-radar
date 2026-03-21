# Apache Doris Ecosystem Digest 2026-03-21

> Issues: 2 | PRs: 139 | Projects covered: 10 | Generated: 2026-03-21 01:14 UTC

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

# Apache Doris Project Digest — 2026-03-21

## 1. Today's Overview

Apache Doris had a **very active development day**: **139 PRs were updated** in the last 24 hours, with **63 merged/closed** and **76 still open**, while issue traffic was light with only **2 active open issues** and no closures.  
The signal from today’s PR stream is strong ongoing work in **cloud mode**, **storage/file cache**, **query execution memory control**, **connector reliability**, and **SQL/function compatibility**.  
There were **no new releases**, so current momentum is concentrated on trunk and branch backports rather than version shipping.  
Overall project health looks **highly active and engineering-driven**, with broad maintenance across **4.0/4.1/5.0 branches**, suggesting a mature stabilization and forward-feature pipeline.

---

## 2. Project Progress

### Merged/closed PRs today: notable advances

#### SQL compatibility and query correctness
- **NDV support for DECIMALV2 added** in aggregate functions:  
  - Main PR: [#61546](https://github.com/apache/doris/pull/61546)  
  - Backport: [#61578](https://github.com/apache/doris/pull/61578)  
  This improves aggregate-function type coverage and reduces SQL incompatibility for workloads still using `DECIMALV2`. It is a small but practical correctness/completeness fix for BI and legacy schemas.

#### Cloud control-plane safety and correctness
- **Reject `ADMIN SET REPLICA VERSION` in cloud mode**:  
  - Main PR: [#60875](https://github.com/apache/doris/pull/60875)  
  - Backports: [#61586](https://github.com/apache/doris/pull/61586), [#61587](https://github.com/apache/doris/pull/61587)  
  This is an important governance hardening step: operations valid in classic deployments may be unsafe or inconsistent in cloud architecture, so explicit rejection prevents operator error.

- **Checkpoint/image persistence for cloud tablet stats**:  
  - [#60705](https://github.com/apache/doris/pull/60705)  
  This indicates continued effort to make cloud metadata persistence and restart behavior more reliable.

#### Metadata and external catalog architecture
- **Unified external metadata cache framework**:  
  - [#60937](https://github.com/apache/doris/pull/60937)  
  Although closed rather than clearly labeled merged in the summary data, this is strategically important. It continues refactoring around **multi-catalog/external table metadata caching**, which should improve maintainability and consistency across external engines.

#### Build/system maintainability
A cluster of cleanup PRs reduced header coupling and compile overhead:
- [#61565](https://github.com/apache/doris/pull/61565)
- [#61559](https://github.com/apache/doris/pull/61559)
- [#61558](https://github.com/apache/doris/pull/61558)

These do not change user-facing behavior, but they improve build hygiene and developer velocity.

---

## 3. Community Hot Topics

### 1) Global memory control on scan nodes
- [PR #61271](https://github.com/apache/doris/pull/61271) — **Global mem control on scan nodes**

This is one of the strongest roadmap signals in today’s queue. Memory governance during scans is a key operational concern in MPP/OLAP systems, especially under mixed workloads, large joins, and concurrent ad hoc analytics. The technical need behind this PR is clear: users want Doris to avoid per-query or per-node memory blowups and behave more predictably under pressure.

### 2) Adaptive batch sizing in storage scan path
- [PR #61535](https://github.com/apache/doris/pull/61535) — **Adaptive batch size for SegmentIterator**

This is a meaningful execution/storage optimization. The EWMA-based adaptive block-size logic aims to keep output blocks near a target byte size, which can improve scan efficiency, memory locality, and downstream operator balance. This reflects a broader trend in Doris toward **smarter runtime adaptivity** rather than fixed heuristics.

### 3) Timestamp Oracle (TSO)
- [PR #61199](https://github.com/apache/doris/pull/61199) — **Global monotonically increasing Timestamp Oracle**

This is a major architectural topic. A global TSO usually supports stronger transaction ordering, distributed consistency primitives, and future transactional or stream-processing capabilities. Its presence suggests Doris is investing in a stronger coordination substrate, especially relevant for cloud/distributed and dynamic-compute scenarios.

### 4) Dynamic table / stream metadata and DDL
- [PR #61382](https://github.com/apache/doris/pull/61382) — **dynamic table support: stream metadata & basic DDL**

This stands out as a forward-looking feature area. “Stream as basic building blocks for dynamic computing” suggests Doris is exploring more native support for streaming semantics and incremental data processing, beyond classic batch OLAP.

### 5) File cache metadata persistence for external tables
- [PR #61518](https://github.com/apache/doris/pull/61518)  
- [PR #61581](https://github.com/apache/doris/pull/61581)

These show substantial attention on **file cache observability and persistence**, especially for external-table scans where lineage back to source table/partition is harder. The underlying need is clear: operators want cache behavior that is persistent, explainable, and actionable in lakehouse-style deployments.

---

## 4. Bugs & Stability

Ranked by likely operational severity based on the available summaries:

### High severity
#### 1) FE Observer node cannot join cluster in cloud mode with Docker host networking
- [Issue #61536](https://github.com/apache/doris/issues/61536)

This appears to be the most severe newly reported issue today because it impacts **cluster formation / node join**, which blocks deployment and elasticity. It specifically affects **cloud mode + Docker host network**, a realistic production/containerized setup. No direct fix PR is listed in today’s data.

#### 2) `CREATE TABLE` / `DROP TABLE` commands hang
- [Issue #51612](https://github.com/apache/doris/issues/51612)

This is also operationally serious. DDL hangs can block automation pipelines, schema evolution, materialized-view management, and job orchestration. The report mentions high-frequency create/drop MV/table activity, implying a concurrency or metadata-locking pressure point. No explicit linked fix PR appears in today’s slice.

### Medium severity
#### 3) Parallel outfile deletion race
- [PR #61223](https://github.com/apache/doris/pull/61223)

This open fix addresses a correctness/stability bug where `delete_existing_files=true` can cause parallel writers to delete each other’s uploaded files. This directly affects export reliability and is highly relevant for users doing concurrent file output.

#### 4) MaxCompute connector memory leak / large-write handling
- [PR #61245](https://github.com/apache/doris/pull/61245)

A practical connector stability fix. Memory leaks in JNI scanner/writer paths are serious for long-running import/export tasks and connector-heavy deployments.

#### 5) Iceberg action validation gaps
- [PR #61381](https://github.com/apache/doris/pull/61381)

This is a correctness and safety fix for catalog operations like rollback and rewrite actions. It matters for external lakehouse interoperability and administrative trustworthiness.

### Lower severity but important
#### 6) Cloud tablet metadata sync after alter
- [PR #61585](https://github.com/apache/doris/pull/61585)

Proactive backend sync after alter indicates there may have been lag or inconsistency windows after metadata changes. This is a reliability improvement in cloud deployments.

---

## 5. Feature Requests & Roadmap Signals

### Strong roadmap signals from open work

#### Distributed transaction/time ordering
- [PR #61199](https://github.com/apache/doris/pull/61199) — **Global TSO**
Likely candidate for a next major/minor release if it lands cleanly. This is foundational infrastructure and often precedes broader transactional or streaming capabilities.

#### Dynamic/streaming computation model
- [PR #61382](https://github.com/apache/doris/pull/61382) — **dynamic table / stream support**
This is one of the clearest future-direction signals in today’s data. Expect Doris to continue moving toward **stream-aware metadata and DDL**, likely expanding into dynamic pipelines or incremental computing features.

#### Smarter runtime adaptation
- [PR #61535](https://github.com/apache/doris/pull/61535) — **adaptive SegmentIterator batch size**
- [PR #61271](https://github.com/apache/doris/pull/61271) — **global scan-node memory control**
These fit a clear pattern: Doris is investing in **autotuning and resource-aware execution**, important for mixed workloads and cloud efficiency.

#### Function surface expansion
- [PR #61566](https://github.com/apache/doris/pull/61566) — **window funnel v2**
- [PR #60192](https://github.com/apache/doris/pull/60192) — **`array_combinations` function**
These suggest continued expansion of analytical SQL expressiveness, especially for event/funnel analytics and array processing.

#### Observability
- [PR #60777](https://github.com/apache/doris/pull/60777) — **CPU usage metrics**
This could reasonably ship soon because it is self-contained and operationally useful.

### Likely near-term inclusions
Based on branch labels and backport activity, the items most likely to appear in upcoming maintained releases are:
- cloud operation safety fixes: [#60875](https://github.com/apache/doris/pull/60875)
- function compatibility fix: [#61546](https://github.com/apache/doris/pull/61546)
- cloud maintenance/backports such as [#61567](https://github.com/apache/doris/pull/61567), [#61568](https://github.com/apache/doris/pull/61568)
- connector and export stability fixes like [#61245](https://github.com/apache/doris/pull/61245) and [#61223](https://github.com/apache/doris/pull/61223)

---

## 6. User Feedback Summary

### Main user pain points visible today

#### 1) Operational hangs during heavy DDL workflows
- [Issue #51612](https://github.com/apache/doris/issues/51612)

This reflects a real use case: users are automating many create/drop operations for tables and materialized views. Doris appears to be under pressure in metadata/DDL concurrency scenarios. For data platform teams, this is more important than a niche bug because it affects orchestration reliability.

#### 2) Cloud deployment ergonomics
- [Issue #61536](https://github.com/apache/doris/issues/61536)

Users are running Doris in containerized cloud-style setups and expect FE topology management to work cleanly with Docker host networking. This is a practical deployment experience issue, not just an edge case.

#### 3) Need for safer concurrent export behavior
- [PR #61223](https://github.com/apache/doris/pull/61223)

The outfile race fix indicates users are using Doris for parallel data export at scale and need file management semantics that are robust under concurrency.

#### 4) Better connector reliability for heterogeneous data stacks
- [PR #61245](https://github.com/apache/doris/pull/61245)
- [PR #61381](https://github.com/apache/doris/pull/61381)
- [PR #60779](https://github.com/apache/doris/pull/60779)

Today’s activity continues to show that Doris users increasingly rely on:
- external catalogs,
- lakehouse interoperability,
- dbt integration,
- cloud-native connectors.

The broad message is that Doris is no longer judged only on core OLAP speed; users also expect **ecosystem reliability and compatibility**.

---

## 7. Backlog Watch

These items appear important and deserving of maintainer attention due to age, user impact, or strategic significance.

### Important open issues
#### DDL hang under heavy create/drop workflows
- [Issue #51612](https://github.com/apache/doris/issues/51612)  
Created 2025-06-10, still open. This is the clearest backlog risk among issues because it affects automation and metadata operations.

### Important older open PRs
#### dbt adapter docs failure
- [PR #60779](https://github.com/apache/doris/pull/60779)  
Created 2026-02-17. Important for developer ecosystem usability and dbt adoption.

#### CPU metrics exposure
- [PR #60777](https://github.com/apache/doris/pull/60777)  
Created 2026-02-16. Operational observability improvements are generally low-risk and high-value; worth pushing through.

#### `array_combinations` SQL function
- [PR #60192](https://github.com/apache/doris/pull/60192)  
Created 2026-01-23. Not urgent for stability, but notable as a long-lived feature PR in SQL surface expansion.

#### Global TSO
- [PR #61199](https://github.com/apache/doris/pull/61199)  
Although newer, it is strategically significant and likely requires careful review due to architectural scope.

#### Dynamic table / stream support
- [PR #61382](https://github.com/apache/doris/pull/61382)  
Another strategic feature that may need cross-component review and design clarity before merge.

---

## Overall Assessment

Apache Doris is showing **strong engineering throughput** with active branch maintenance, rapid backports, and ongoing investment in **cloud architecture, query/runtime control, external metadata systems, and SQL capability**.  
Today’s main caution flags are around **cloud deployment stability** and **DDL hang behavior**, both of which map directly to production operability.  
If current trends continue, the next visible product gains are likely to be in **resource governance, cloud safety, metadata/cache robustness, and advanced analytical/stream-oriented capabilities**.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-21

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, with strong parallel investment in **query correctness, cloud/lakehouse interoperability, runtime resource governance, and SQL/tooling compatibility**. Across engines, the center of gravity is shifting from pure scan speed toward **operational predictability**, including memory control, shutdown behavior, metadata safety, observability, and connector reliability. A second clear pattern is convergence around **external table formats and hybrid architectures**: Iceberg, Delta, Parquet, object storage, and metadata APIs are now core competitive surfaces rather than adjunct integrations. Overall, the landscape is mature but still fast-moving: established engines are hardening multi-branch release lines while newer or embedded systems continue aggressive architectural refactoring.

---

## 2. Activity Comparison

| Project | Issues Updated | PRs Updated | Release Status | Health Score* | Current Read |
|---|---:|---:|---|---:|---|
| **Apache Doris** | 2 | 139 | No new release | **9.2/10** | Very high engineering throughput; cloud/runtime/governance work strong |
| **ClickHouse** | 58 | 283 | **Stable + LTS released** | **9.3/10** | Highest raw activity; strong release discipline, but regression density elevated |
| **DuckDB** | 20 | 35 | No new release | **8.6/10** | Healthy and responsive; post-1.5 stabilization prominent |
| **StarRocks** | 4 | 137 | No new release | **9.0/10** | Very active; branch backports and external-MV correctness dominate |
| **Apache Iceberg** | 15 | 50 | No new release | **8.7/10** | Strong connector/catalog momentum; correctness in streaming write paths key |
| **Delta Lake** | 2 | 38 | No new release | **8.2/10** | Active roadmap work; correctness-sensitive around streaming/CDC |
| **Databend** | 2 | 10 | No new release | **7.7/10** | Lower volume, but responsive on critical bugs |
| **Velox** | 4 | 50 | No new release | **8.4/10** | Strong infra/GPU/backend momentum; integration-heavy phase |
| **Apache Gluten** | 7 | 20 | No new release | **8.1/10** | Active compatibility/performance work; still integration-sensitive |
| **Apache Arrow** | 25 | 18 | No new release | **8.0/10** | Healthy maintenance cadence; packaging/CI/docs heavy |

\*Health score is a comparative qualitative estimate based on development velocity, issue responsiveness, release discipline, and severity mix in the daily digest.

### Takeaways
- **ClickHouse** leads in total volume and release cadence.
- **Apache Doris** and **StarRocks** show the strongest day-level OLAP-engine throughput outside ClickHouse.
- **DuckDB** remains highly healthy, but in a more focused stabilization cycle.
- **Iceberg/Delta** are active as table-format/control-plane projects rather than monolithic engines, so raw counts understate strategic importance.

---

## 3. Apache Doris’s Position

### Where Doris is strong versus peers
Apache Doris currently looks especially strong in four areas:

1. **Cloud-mode engineering depth**
   - Doris is investing heavily in cloud-specific operational safety, metadata persistence, file cache management, and cloud control-plane correctness.
   - Relative to peers, this is more explicit and systematic than DuckDB/Databend, and more engine-integrated than Iceberg/Delta’s catalog-centric approach.

2. **Balanced core-engine + ecosystem work**
   - Doris is not only tuning execution (`global mem control on scan nodes`, adaptive scan batch sizing), but also improving connectors, metadata cache architecture, and SQL compatibility.
   - This is a broad-based profile similar to ClickHouse and StarRocks, but with a somewhat stronger emphasis on **cloud-native engine internals**.

3. **Branch maintenance maturity**
   - The visible backports across **4.0/4.1/5.0** indicate a mature maintenance pipeline.
   - That puts Doris closer to ClickHouse and StarRocks in release-branch discipline than to younger or more centralized projects.

4. **Forward-looking architectural signals**
   - **Global TSO** and **dynamic table/stream metadata** are notable roadmap indicators.
   - These suggest Doris is exploring stronger distributed coordination and possibly more native incremental/stream-aware semantics than traditional MPP OLAP engines.

### Relative disadvantages / pressure points
- **Community scale**: Doris is highly active, but still behind ClickHouse in raw volume and broad ecosystem gravity.
- **Operational sharp edges**: today’s cloud FE join issue and long-lived DDL hang issue are meaningful because they strike at deployment and automation reliability.
- **External interoperability mindshare**: Iceberg, Delta, Arrow, and ClickHouse still hold stronger cross-project gravitational pull in some interoperability discussions.

### Technical approach differences
- **Vs ClickHouse**: Doris appears more explicitly focused on cloud-governed control plane and safer operational semantics, while ClickHouse shows more extreme query-engine breadth and higher release throughput.
- **Vs StarRocks**: Doris is leaning into cloud architecture and engine-level resource governance; StarRocks is currently more visibly centered on external MV correctness and Iceberg integration.
- **Vs DuckDB**: Doris is a distributed MPP service engine; DuckDB is embedded/local-first and architecturally optimized for in-process analytics.
- **Vs Iceberg/Delta**: Doris is an execution/storage engine; Iceberg and Delta are table-format and transaction-layer ecosystems.
- **Vs Velox/Arrow/Gluten**: Doris is a full database system, while those projects are execution substrates, interoperability layers, or acceleration frameworks.

### Community size comparison
Approximate activity tier by current GitHub signal:
- **Very large**: ClickHouse
- **Large and highly active**: Apache Doris, StarRocks
- **Large but more specialized/distributed across integrations**: Iceberg, DuckDB
- **Medium**: Delta Lake, Velox, Arrow
- **Smaller but technically active**: Databend, Gluten

Doris is clearly in the **top tier of active full-stack OLAP engines**, though not the single largest community by raw throughput.

---

## 4. Shared Technical Focus Areas

### A. Query correctness and regression control
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Velox, Gluten  
**Need:** Prevent silent wrong answers, crashes, or planner edge-case failures.

- Doris: DDL hangs, export race, connector memory leak, Iceberg action validation
- ClickHouse: JOIN correctness, NATURAL JOIN bug, integer predicate errors
- DuckDB: ASOF JOIN correctness, HUGEINT Parquet precision loss, UNNEST regressions
- StarRocks: join crash/wrong results, MV rewrite invalid plan
- Velox: JSON wildcard wrong results
- Gluten: Parquet nullability/schema correctness, multi-key DPP fix

**Signal:** correctness is now a first-order product requirement, not just a bug backlog category.

---

### B. Runtime resource governance and predictability
**Engines:** Doris, ClickHouse, StarRocks, Velox, Gluten  
**Need:** Better memory control, skew handling, concurrency behavior, and operational stability.

- Doris: global scan-node memory control, adaptive scan batching
- ClickHouse: lower UNION ALL memory, shutdown deadlock fixes, thread-pool scheduling
- StarRocks: skew-aware window execution, RPC imbalance metrics
- Velox: async GPU synchronization and accurate runtime accounting
- Gluten: LIMIT-path inefficiency, shuffle serialization optimization

**Signal:** operators want engines that are self-regulating under mixed workloads, not merely fast in benchmarks.

---

### C. Lakehouse/external catalog interoperability
**Engines:** Doris, StarRocks, ClickHouse, Iceberg, Delta, Arrow  
**Need:** reliable behavior over external metadata, file formats, object storage, and catalog APIs.

- Doris: unified external metadata cache, file cache persistence, Iceberg action validation
- StarRocks: Iceberg MV refresh correctness, Paimon metadata visibility
- ClickHouse: Iceberg query log metrics, Parquet compatibility work
- Iceberg: REST, Flink, Kafka Connect, TLS, batch APIs
- Delta: DSv2, CDC streaming, snapshot/path semantics
- Arrow: Flight SQL ODBC, cloud/filesystem and Parquet feature work

**Signal:** analytical stacks are increasingly federated and object-store-centric.

---

### D. SQL compatibility and developer ergonomics
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Databend, Gluten  
**Need:** more standard SQL, fewer edge-case incompatibilities, better tooling behavior.

- Doris: NDV on DECIMALV2, new analytical functions
- ClickHouse: SQL `VALUES`, timezone/session syntax requests
- DuckDB: parser/query-node refactors, duplicate-column safety, Python UX asks
- StarRocks: better external-table introspection
- Databend: TEXT/TSV naming cleanup, broader SQL logic test import
- Gluten: Spark 4.x semantic compatibility, TIMESTAMP_NTZ

**Signal:** buyers increasingly evaluate engines by how smoothly they fit BI tools, dbt, Spark, ORMs, and existing SQL code.

---

### E. Streaming / incremental / transactional semantics
**Engines:** Doris, Iceberg, Delta, StarRocks, Gluten  
**Need:** more reliable CDC, recovery, ordering, and stream-aware metadata.

- Doris: global TSO, dynamic table/stream metadata
- Iceberg: Flink recovery duplicates, Kafka Connect commit isolation
- Delta: CDC in SparkMicroBatchStream, coordinated-commit correctness
- StarRocks: MV refresh correctness over changing external metadata
- Gluten: Kafka read support, variant/timestamp compatibility aligned with newer Spark workloads

**Signal:** the boundary between OLAP database and incremental data platform continues to blur.

---

## 5. Differentiation Analysis

### Storage format orientation
- **Apache Doris / StarRocks / ClickHouse / Databend**: full database engines with native storage plus varying levels of external-table support.
- **DuckDB**: embedded analytical engine, strongly oriented toward local files and interchange formats like Parquet.
- **Iceberg / Delta Lake**: open table formats and transaction layers over object storage/data lakes.
- **Arrow**: columnar memory/data interchange substrate, not a database.
- **Velox / Gluten**: execution backend and Spark acceleration layer, respectively.

### Query engine design
- **Doris / StarRocks / ClickHouse**: distributed OLAP engines for cluster-scale SQL analytics.
- **DuckDB**: single-node/in-process vectorized analytics.
- **Databend**: cloud-oriented analytical database with evolving storage/query architecture.
- **Velox**: reusable execution engine component.
- **Gluten**: Spark-native acceleration bridge, especially via Velox.
- **Iceberg / Delta / Arrow**: not primary SQL engines, but critical infrastructure for engines above them.

### Target workloads
- **Doris**: interactive analytics, lakehouse querying, cloud deployment, mixed enterprise BI + large-scale MPP workloads.
- **ClickHouse**: high-concurrency analytics, observability, event data, large-scale low-latency OLAP.
- **StarRocks**: federated analytics, external MVs, real-time/lakehouse acceleration.
- **DuckDB**: notebook, embedded analytics, local ETL, developer-centric data work.
- **Iceberg / Delta**: multi-engine lakehouse storage with transactional table semantics.
- **Databend**: cloud-native analytics with snapshot/versioning ambitions.
- **Velox / Gluten**: execution acceleration and backend reuse.

### SQL compatibility posture
- **Highest active compatibility pressure**: ClickHouse, DuckDB, Doris, Gluten.
- **External catalog SQL fidelity emphasis**: StarRocks, Doris.
- **Spark semantics alignment**: Delta, Gluten, Iceberg.
- **Interop substrate more than SQL surface**: Arrow, Velox.

---

## 6. Community Momentum & Maturity

### Tier 1: Very high momentum, mature maintenance
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

These projects show strong throughput, active backports, and broad surface-area maintenance. ClickHouse has the largest visible machine, while Doris and StarRocks are both operating at mature multi-branch scale.

### Tier 2: High momentum, targeted stabilization or strategic platform work
- **DuckDB**
- **Apache Iceberg**
- **Velox**

DuckDB is stabilizing after a recent release; Iceberg is balancing feature growth with connector correctness; Velox is iterating rapidly but in an integration-heavy backend role.

### Tier 3: Focused roadmap advancement with narrower visible volume
- **Delta Lake**
- **Apache Arrow**
- **Apache Gluten**
- **Databend**

These projects are active and strategically important, but current visible cadence is either narrower in scope or concentrated in specific layers such as connectors, packaging, acceleration, or bug response.

### Rapidly iterating vs stabilizing
**Rapidly iterating**
- Doris
- ClickHouse
- StarRocks
- Velox
- Iceberg

**Stabilizing / hardening**
- DuckDB
- Arrow
- Delta Lake
- Gluten
- Databend

Doris in particular is notable for doing both at once: active feature work plus extensive backports.

---

## 7. Trend Signals

### 1. Cloud-native operability is now a competitive requirement
Users increasingly care about:
- safe control-plane behavior
- object storage lifecycle semantics
- container/network deployment
- metadata persistence
- secure REST/catalog connectivity

**Relevant engines:** Doris, ClickHouse, Iceberg, Delta, Databend, Arrow

**Value to architects:** engine choice should now factor in cloud operational semantics, not just benchmark speed.

---

### 2. Correctness under edge conditions is a buying criterion
Silent wrong answers, duplicate writes, and metadata races are drawing fast maintainer attention across the ecosystem.

**Relevant engines:** ClickHouse, DuckDB, StarRocks, Doris, Iceberg, Delta, Velox, Gluten

**Value to data engineers:** production trust increasingly depends on issue-response quality and regression discipline, not only feature lists.

---

### 3. Resource-aware execution is becoming table stakes
Adaptive batching, memory limits, skew handling, and better runtime metrics are widespread themes.

**Relevant engines:** Doris, ClickHouse, StarRocks, Velox, Gluten

**Value to architects:** prefer systems with strong built-in workload governance if running mixed BI/ad hoc/concurrent analytics.

---

### 4. Lakehouse interoperability is no longer optional
External metadata, Iceberg/Delta catalogs, Parquet fidelity, ODBC/Flight SQL, and connector reliability are all active fronts.

**Relevant engines:** Doris, StarRocks, ClickHouse, Iceberg, Delta, Arrow, DuckDB

**Value to data engineers:** integration quality across storage formats and catalogs may matter more than isolated engine performance.

---

### 5. Streaming and incremental semantics are moving into mainstream analytical platforms
The line between warehouse, OLAP engine, and streaming-aware platform is thinning.

**Relevant engines:** Doris, Delta, Iceberg, StarRocks, Gluten

**Value to architects:** roadmap alignment around CDC, stream metadata, and recovery correctness should influence platform strategy for real-time analytics.

---

## Bottom Line

**Apache Doris is in a strong position**: it is one of the most active full-stack OLAP engines in the current ecosystem, with particularly strong momentum in **cloud architecture, execution governance, metadata/cache systems, and SQL/function completeness**. Relative to peers, Doris stands out for combining **engine internals work, cloud control-plane hardening, and active release-branch maintenance**. For technical decision-makers, the main watchpoints are **deployment ergonomics in cloud mode** and **DDL/metadata concurrency robustness**, but overall Doris currently compares favorably with the leading open-source analytical engine cohort.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-21

## 1) Today’s Overview

ClickHouse had another very high-velocity day: **58 issues** were updated in the last 24 hours and **283 pull requests** saw activity, with **98 PRs merged/closed** and **22 issues closed**. The project appears operationally healthy and highly active, with a strong mix of core engine work, CI/fuzzing stabilization, SQL compatibility improvements, and backport automation. A notable theme today is **stability under edge cases and regressions in newer branches**, especially around locks, shutdown behavior, JOIN semantics, Parquet handling, and storage/object-disk lifecycle behavior. Release cadence also remains strong, with both a **stable** and an **LTS** build published.

---

## 2) Releases

### New releases published
- **v26.1.6.6-stable** — Release v26.1.6.6-stable  
- **v25.8.20.4-lts** — Release v25.8.20.4-lts  

These releases indicate continued parallel maintenance of both the current stable line and the long-term support branch. From the issue/PR stream, likely motivations for these release trains include ongoing bugfixes, regressions in query behavior, and backports for user-visible correctness issues.

### Migration / upgrade notes inferred from current activity
While no formal release notes were included in the provided data, current issue traffic suggests users upgrading should pay attention to:

- **25.8 regressions around metadata locks and system tables**
  - [`system.parts` hanging under metadata lock, regression in 25.8](https://github.com/ClickHouse/ClickHouse/issues/99547)
  - [`clickhouse-client` exit hang without `SELECT ON *.*`, regression in 25.x](https://github.com/ClickHouse/ClickHouse/issues/99694)

- **Asynchronous object storage deletion behavior introduced in 26.2**
  - User concern about `DROP TABLE ... SYNC` not synchronously reclaiming blob storage data: [#99996](https://github.com/ClickHouse/ClickHouse/issues/99996)

- **Backported text index bugfixes are actively moving across branches**
  - Automated backports for text index behavior with `startsWith` / `endsWith` are open for multiple supported versions:
    - [26.3 backport #100250](https://github.com/ClickHouse/ClickHouse/pull/100250)
    - [26.2 cherrypick #100248](https://github.com/ClickHouse/ClickHouse/pull/100248)
    - [26.1 cherrypick #100247](https://github.com/ClickHouse/ClickHouse/pull/100247)
    - [25.12 cherrypick #100246](https://github.com/ClickHouse/ClickHouse/pull/100246)
    - [25.8 cherrypick #100245](https://github.com/ClickHouse/ClickHouse/pull/100245)

### Breaking-change / deprecation signals
A strong roadmap signal appears in:
- **Remove old Parquet writer and reader toggles**: [#100126](https://github.com/ClickHouse/ClickHouse/issues/100126)

This is not yet a release note, but it clearly points toward future cleanup of legacy code paths:
- `output_format_parquet_use_custom_encoder = 0`
- `input_format_parquet_use_native_reader_v3 = 0`

Users depending on older Parquet fallback implementations should prepare to validate workloads against the newer default readers/writers.

---

## 3) Project Progress

Based on the PR activity, today’s progress clusters around four areas: **query execution efficiency**, **threading/runtime behavior**, **SQL compatibility**, and **correctness fixes/backports**.

### Query engine and execution improvements
- **Reduce peak memory for wide `UNION ALL` queries**  
  PR: [#100176](https://github.com/ClickHouse/ClickHouse/pull/100176)  
  This introduces controls to limit simultaneously active streams in `UNION ALL`, directly targeting memory blowups in multi-branch plans. This is a meaningful engine-level improvement for BI-generated SQL and query federation patterns.

- **Prune parts for `ORDER BY LIMIT` on partitioned tables**  
  PR: [#99533](https://github.com/ClickHouse/ClickHouse/pull/99533)  
  Improves `optimize_read_in_order=1` behavior by reducing unnecessary reads on partitioned MergeTree tables. This is a classic OLAP win: lower scan cost for top-N patterns.

- **Avoid unnecessary String `.size` subcolumn computation**  
  PR: [#99941](https://github.com/ClickHouse/ClickHouse/pull/99941)  
  A storage/read-path optimization that should reduce wasted work during subcolumn enumeration.

- **Auto-enable uncompressed cache for MergeTree reads**  
  PR: [#99639](https://github.com/ClickHouse/ClickHouse/pull/99639)  
  Suggests a push toward making beneficial read-path caching more automatic, improving performance without requiring explicit tuning.

### Runtime and concurrency robustness
- **Fix server shutdown deadlock**  
  PR: [#100204](https://github.com/ClickHouse/ClickHouse/pull/100204)  
  This looks important operationally: shutdown deadlocks are severe in production because they affect rolling upgrades, failovers, and maintenance windows.

- **Use LIFO scheduling in ThreadPool to reduce memory fragmentation**  
  PR: [#100177](https://github.com/ClickHouse/ClickHouse/pull/100177)  
  This is an interesting systems-level optimization aimed at reducing jemalloc tcache fragmentation and concentrating work on fewer worker threads.

- **Enable query profiler under sanitizers**  
  PR: [#100242](https://github.com/ClickHouse/ClickHouse/pull/100242)  
  This is mainly infrastructure, but it improves observability in debug/sanitizer environments and should accelerate root-cause analysis.

### SQL compatibility and language surface
- **Support SQL standard `VALUES` as table expression**  
  PR: [#100143](https://github.com/ClickHouse/ClickHouse/pull/100143)  
  This is a practical compatibility improvement for SQL tools, ORMs, and ported workloads.

- **Fix NATURAL JOIN reconstruction bug**  
  PR: [#100223](https://github.com/ClickHouse/ClickHouse/pull/100223)  
  This directly addresses a same-day parser/analyzer correctness issue where `NATURAL JOIN` with no common columns produced an invalid reconstructed AST.

### Storage/indexing evolution
- **Introduce Commit Order Projection Index**  
  PR: [#99004](https://github.com/ClickHouse/ClickHouse/pull/99004)  
  Potentially a significant indexing/projected storage feature if merged, with implications for commit-order-aware access patterns.

### Logging / connector observability
- **Fix `system.query_log.read_rows` for Iceberg**  
  PR: [#99282](https://github.com/ClickHouse/ClickHouse/pull/99282)  
  Important for users relying on system telemetry to understand external table scans and optimize lakehouse access.

---

## 4) Community Hot Topics

These were the most discussed or strategically important items today.

### 1. Longstanding inability to cancel some queries with scalar subqueries
- Issue: [#1576](https://github.com/ClickHouse/ClickHouse/issues/1576)
- Status: Open since 2017, updated today
- Why it matters: This is a classic operational pain point. In analytical systems, non-cancellable queries can tie up CPU, memory, and cluster slots, making workload isolation and emergency intervention difficult.
- Underlying need: Better **query interruption checkpoints** inside scalar subquery execution and planner/runtime phases.

### 2. Memory growth after moving system clock backward
- Issue: [#93095](https://github.com/ClickHouse/ClickHouse/issues/93095)
- Why it matters: Time shifts still occur in virtualized or misconfigured environments. A clock-sensitive memory leak implies hidden assumptions in cleanup scheduling, TTL processing, caches, or background task coordination.
- Underlying need: Stronger resilience to **non-monotonic system time**.

### 3. CI crash: double deletion of `MergeTreeDataPartCompact`
- Issue: [#99799](https://github.com/ClickHouse/ClickHouse/issues/99799)
- Why it matters: A double deletion in storage-part lifecycle management is a serious memory-safety signal, even if currently seen in CI.
- Underlying need: Safer ownership semantics around MergeTree part management, especially under multi-index code paths.

### 4. `DROP TABLE ... SYNC` and asynchronous blob deletion controversy
- Issue: [#99996](https://github.com/ClickHouse/ClickHouse/issues/99996)
- Why it matters: This is one of the strongest user-feedback signals today. The user explicitly objects to asynchronous object storage deletion after drop and requests synchronous reclamation semantics.
- Underlying need: More explicit operator control over **storage lifecycle guarantees**, especially for regulated, cost-sensitive, or automation-heavy deployments.

### 5. Client and metadata-lock regressions in 25.x/25.8
- [`clickhouse-client` exit hang](https://github.com/ClickHouse/ClickHouse/issues/99694)
- [`system.parts` hangs under metadata lock](https://github.com/ClickHouse/ClickHouse/issues/99547)
- Why it matters: These issues affect day-to-day usability and introspection. System table access should remain dependable under contention.

### 6. Test randomization and attach/detach fault injection
- PR: [#96130](https://github.com/ClickHouse/ClickHouse/pull/96130)
- Issue: [#100178](https://github.com/ClickHouse/ClickHouse/issues/100178)
- Why it matters: ClickHouse is clearly investing in making concurrency/state-transition bugs reproducible. Randomized DETACH/ATTACH before execution is a very ClickHouse-specific stress technique likely to uncover catalog and metadata hazards.

---

## 5) Bugs & Stability

Ranked roughly by severity and potential production impact.

### Critical / High severity

#### 1. Server shutdown deadlock
- PR: [#100204](https://github.com/ClickHouse/ClickHouse/pull/100204)
- Risk: High operational severity
- Impact: Can block restarts, rolling upgrades, orchestration, and incident response.
- Fix status: **Fix PR exists**

#### 2. Shared variant pointer bug causing `LOGICAL_ERROR`
- PR: [#100234](https://github.com/ClickHouse/ClickHouse/pull/100234)
- Risk: High
- Impact: Variant column filtering correctness and stability; labeled critical bugfix and must-backport.
- Fix status: **Fix PR exists**

#### 3. CI crash: double deletion of MergeTree compact part
- Issue: [#99799](https://github.com/ClickHouse/ClickHouse/issues/99799)
- Risk: High
- Impact: Memory-safety / object-lifetime defect in storage engine internals.
- Fix status: No linked fix in provided data

#### 4. Memory leak after moving system time backward
- Issue: [#93095](https://github.com/ClickHouse/ClickHouse/issues/93095)
- Risk: High in affected environments
- Impact: Unbounded memory growth during inserts until restart.
- Fix status: No fix PR shown

### Medium severity

#### 5. `system.parts` hangs indefinitely under metadata lock
- Issue: [#99547](https://github.com/ClickHouse/ClickHouse/issues/99547)
- Risk: Medium-high
- Impact: Operational visibility regression in 25.8; system introspection stalls under lock contention.
- Fix status: No fix PR shown

#### 6. `clickhouse-client` hangs on exit for limited-privilege users
- Issue: [#99694](https://github.com/ClickHouse/ClickHouse/issues/99694)
- Risk: Medium
- Impact: RBAC-related regression and poor CLI ergonomics in 25.x.
- Fix status: No fix PR shown

#### 7. Incorrect duplicate rows with `LEFT ANY JOIN`
- Issue: [#99431](https://github.com/ClickHouse/ClickHouse/issues/99431)
- Risk: Medium-high
- Impact: Query correctness bug, especially dangerous because it silently returns wrong results.
- Fix status: No fix PR shown

#### 8. `WHERE ... AND -2147483648` evaluates incorrectly on MergeTree
- Issue: [#99979](https://github.com/ClickHouse/ClickHouse/issues/99979)
- Risk: Medium-high
- Impact: Silent wrong-answer query bug due to integer literal casting/optimization behavior.
- Fix status: No fix PR shown

#### 9. `CHECK TABLE` fails for complex JSON column structures
- Issue: [#100153](https://github.com/ClickHouse/ClickHouse/issues/100153)
- Risk: Medium
- Impact: Integrity verification tooling may fail on modern semi-structured ingestion pipelines.
- Fix status: No fix PR shown

#### 10. `cutURLParameter` behaves incorrectly with similar parameter names
- Issue: [#100219](https://github.com/ClickHouse/ClickHouse/issues/100219)
- Risk: Medium
- Impact: Function-level correctness issue; impacts URL parsing and downstream transformations.
- Fix status: No fix PR shown

#### 11. NATURAL JOIN AST reconstruction bug
- Issue: [#100220](https://github.com/ClickHouse/ClickHouse/issues/100220)
- PR: [#100223](https://github.com/ClickHouse/ClickHouse/pull/100223)
- Risk: Medium
- Impact: Analyzer/AST correctness issue.
- Fix status: **Fix PR opened same day**

### Lower severity / ecosystem correctness

#### 12. Arrow-based Parquet writer misses UUID logical type
- Issue: [#100119](https://github.com/ClickHouse/ClickHouse/issues/100119)
- Risk: Lower core severity, higher interoperability severity
- Impact: Schema fidelity issue for downstream tools.
- Status: **Closed**
- Strategic note: This lands in the same area as the proposal to remove old Parquet paths, so Parquet interoperability remains a live focus.

#### 13. `CREATE TABLE ... AS SELECT * FROM ...` can fail with refreshable MV target tables
- Issue: [#100088](https://github.com/ClickHouse/ClickHouse/issues/100088)
- Status: **Closed**
- Impact: DDL choreography around refreshable materialized views.

#### 14. Fuzz/sanitizer failures and flaky tests
- Examples:
  - [#100158](https://github.com/ClickHouse/ClickHouse/issues/100158)
  - [#100221](https://github.com/ClickHouse/ClickHouse/issues/100221)
  - [#99725](https://github.com/ClickHouse/ClickHouse/issues/99725)
  - [#99578](https://github.com/ClickHouse/ClickHouse/issues/99578)
- Impact: Not always user-facing immediately, but these are leading indicators for latent engine bugs.

---

## 6) Feature Requests & Roadmap Signals

### Strong near-term candidates

#### SQL standard `VALUES` support
- PR: [#100143](https://github.com/ClickHouse/ClickHouse/pull/100143)
- Prediction: Likely to land soon; it is concrete, scoped, and directly improves compatibility.

#### SQL-standard timezone/session syntax
- Issue: [#99612](https://github.com/ClickHouse/ClickHouse/issues/99612)
- Requests:
  - `SET TIME ZONE INTERVAL '+05:30' HOUR TO MINUTE`
  - `SET SESSION CHARACTERISTICS`
- Prediction: Good candidate for future compatibility-focused releases, especially if ClickHouse continues courting PostgreSQL/ANSI-friendly clients and BI tools.

#### Keeper recursive listing API
- Issue: [#99916](https://github.com/ClickHouse/ClickHouse/issues/99916)
- Prediction: Reasonably likely medium-term, because it aligns with ClickHouse Keeper’s gradual expansion beyond ZooKeeper’s older API limitations.

### Performance / storage roadmap signals

#### Faster primary-key range pruning for large parts
- Issue: [#99914](https://github.com/ClickHouse/ClickHouse/issues/99914)
- Prediction: High likelihood of attention, because it is aligned with MergeTree core performance economics and likely yields material wins on big parts.

#### Commit Order Projection Index
- PR: [#99004](https://github.com/ClickHouse/ClickHouse/pull/99004)
- Prediction: Important but likely requires careful review; more strategic than incremental.

#### Support `*` and matchers in default expressions
- Issue: [#92266](https://github.com/ClickHouse/ClickHouse/issues/92266)
- Prediction: Plausible, especially for schema automation and JSON serialization use cases, but probably not immediate.

### Ecosystem / connector requests

#### PostgreSQL engine support for views
- Issue: [#49249](https://github.com/ClickHouse/ClickHouse/issues/49249)
- Prediction: Could be implemented given it is labeled easy task / unfinished code, but may depend on contributor bandwidth rather than strategic priority.

### Operational control requests

#### Synchronous blob deletion on `DROP TABLE ... SYNC`
- Issue: [#99996](https://github.com/ClickHouse/ClickHouse/issues/99996)
- Prediction: This has a realistic chance of some compromise solution—perhaps a setting or mode—because it reflects real operator expectations rather than a niche feature request.

---

## 7) User Feedback Summary

Today’s user feedback reveals several consistent pain points:

### 1. Operators want stronger predictability under concurrency and maintenance
Users are hitting:
- hangs during shutdown,
- hangs on `system.parts`,
- inability to kill some queries,
- client exit deadlocks.

This suggests operational smoothness is still a top concern for production users, especially under lock contention and lifecycle transitions.

### 2. Compatibility with broader SQL/tooling ecosystems remains important
Requests and fixes around:
- SQL `VALUES`,
- `SET TIME ZONE INTERVAL`,
- `SET SESSION CHARACTERISTICS`,
- Parquet UUID logical types,
- PostgreSQL view support

all point to growing use of ClickHouse through standard SQL clients, federated data stacks, and interoperable data formats.

### 3. Users are sensitive to correctness regressions more than missing features
Issues like:
- duplicate rows from `LEFT ANY JOIN`,
- incorrect boolean evaluation with `INT_MIN`,
- malformed NATURAL JOIN AST,
- function-level parsing bugs

are especially serious because OLAP users depend on trust in result correctness. Silent wrong answers are more damaging than explicit failures.

### 4. Storage lifecycle semantics matter in object-storage-heavy deployments
The `DROP TABLE ... SYNC` discussion shows users increasingly expect precise, auditable control over when data is actually deleted from blob storage, likely driven by cost management, retention policies, or automation assumptions.

### 5. Performance work is appreciated, but users want it “on by default”
Several active PRs lean toward automatic or internal optimization:
- auto-enable uncompressed cache,
- limit UNION ALL parallel stream fan-out,
- better pruning for ordered limit queries.

This reflects a healthy product direction: reducing the need for expert tuning.

---

## 8) Backlog Watch

These are notable long-lived or strategically important items that likely need maintainer attention.

### Longstanding operational issue
#### Query cancellation with scalar subqueries
- Issue: [#1576](https://github.com/ClickHouse/ClickHouse/issues/1576)
- Why watch: Open since 2017, still relevant, and directly impacts operability and resource control.

### Older but still open feature/compatibility requests
#### PostgreSQL engine doesn’t work with views
- Issue: [#49249](https://github.com/ClickHouse/ClickHouse/issues/49249)
- Why watch: Practical ETL/federation use case; labeled as approachable work but still unresolved.

#### File/object-storage offset logical error
- Issue: [#82555](https://github.com/ClickHouse/ClickHouse/issues/82555)
- Why watch: Older fuzz bug involving object storage paths; storage-edge correctness bugs can resurface in production.

#### Support `*` and matchers inside default expressions
- Issue: [#92266](https://github.com/ClickHouse/ClickHouse/issues/92266)
- Why watch: Useful schema-composition feature, especially for generated JSON / alias columns.

### Newly important regressions needing fast triage
#### `system.parts` lock hang
- Issue: [#99547](https://github.com/ClickHouse/ClickHouse/issues/99547)

#### `clickhouse-client` exit hang under limited privileges
- Issue: [#99694](https://github.com/ClickHouse/ClickHouse/issues/99694)

#### Incorrect duplicate rows with `LEFT ANY JOIN`
- Issue: [#99431](https://github.com/ClickHouse/ClickHouse/issues/99431)

#### Time-shift memory leak
- Issue: [#93095](https://github.com/ClickHouse/ClickHouse/issues/93095)

These are the kinds of issues that can shape user confidence in current stable/LTS branches if not addressed promptly.

---

## Overall Health Assessment

ClickHouse remains **highly active and forward-moving**, with strong engineering throughput and visible investment in both performance and correctness. The biggest current risk signal is not lack of development velocity, but rather the **density of edge-case regressions and concurrency/correctness bugs** being surfaced by users and fuzzing infrastructure. The positive sign is that fixes are often appearing quickly—sometimes the same day—and backport automation looks healthy. Overall, project health is good, but maintainers should continue prioritizing **query correctness, lock/shutdown behavior, and storage lifecycle semantics** to sustain trust in production deployments.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-21

## 1. Today's Overview

DuckDB showed strong day-to-day engineering activity today, with **20 issues updated** and **35 PRs updated**, including **20 PRs merged/closed**. The dominant theme was **stabilization after v1.5.0**, with multiple reports of regressions, internal errors, and correctness bugs quickly receiving fixes or follow-up PRs. At the same time, maintainers continued deeper architectural work in the parser, AST/query node model, checkpointing, and file/path handling. Overall project health looks **active and responsive**, though the current signal is more about **hardening recent changes** than shipping new user-facing features.

## 2. Project Progress

Today’s merged/closed PRs advanced several areas of the query engine, storage layer, CLI behavior, and developer tooling:

### Query engine and SQL execution
- **DML represented in QueryNode AST**
  - [PR #21505](https://github.com/duckdb/duckdb/pull/21505) introduced `InsertQueryNode`, `UpdateQueryNode`, and `DeleteQueryNode` variants, moving DML closer to the same AST/query-node machinery used by SELECTs.
  - Follow-up refactors remain open:
    - [PR #21518](https://github.com/duckdb/duckdb/pull/21518) for `INSERT`
    - [PR #21524](https://github.com/duckdb/duckdb/pull/21524) for `UPDATE`
  - This is a meaningful architectural step for serialization, binding consistency, and future planner/parser extensibility.

- **WAL replay correctness**
  - [PR #21516](https://github.com/duckdb/duckdb/pull/21516) fixed **WAL replay with function-based DEFAULT expressions**, a correctness/recovery issue with storage durability implications.

- **UNNEST/internal execution bug addressed**
  - [PR #21503](https://github.com/duckdb/duckdb/issues/21503) was closed alongside a fix for an **internal error on `UNNEST` over `STRUCT[]`**, indicating quick turnaround on a v1.5.0 regression.

### CLI, parser, and developer experience
- **JSON CLI output correctness**
  - [PR #21517](https://github.com/duckdb/duckdb/pull/21517) fixed invalid JSON output for empty result sets in `.mode json`, resolving [Issue #21512](https://github.com/duckdb/duckdb/issues/21512).

- **Tokenizer/parser annotation quality**
  - [PR #21523](https://github.com/duckdb/duckdb/pull/21523) improved token annotations by using the parser rather than tokenizer-only heuristics, which should help syntax highlighting and editor integration around unreserved keywords.

- **DROP TRIGGER parsing support**
  - [PR #21434](https://github.com/duckdb/duckdb/pull/21434) added parser support for `DROP TRIGGER`, though execution still throws `NotImplementedException`. This is a SQL grammar compatibility increment, not yet full feature support.

### Storage and file writing/testing
- **Copy/file-write pipeline modernization**
  - [PR #21480](https://github.com/duckdb/duckdb/pull/21480) moved `PhysicalCopyToFile` logic toward the **Prepare/Flush Batch API**, improving transparency around how much data goes into each file and likely helping future file-splitting/control features.

- **Memory safety fix**
  - [PR #21515](https://github.com/duckdb/duckdb/pull/21515) fixed an **integer overflow in `list_resize`** that could lead to undersized allocation and out-of-bounds write. This is an important robustness/security hardening change.

- **Test infrastructure hardening**
  - [PR #21520](https://github.com/duckdb/duckdb/pull/21520) added a **`max_test_threads`** setting to limit concurrent test execution.
  - [PR #21511](https://github.com/duckdb/duckdb/pull/21511) reduced concurrent thread count in a test to avoid ASAN failures.
  - [PR #21495](https://github.com/duckdb/duckdb/pull/21495) fixed test path parsing for extension test suites.

## 3. Community Hot Topics

The most-discussed items point to recurring user concerns around **file format efficiency, API ergonomics, SQL safety, and OS/platform integration**.

### Large Parquet output from `COPY TO`
- [Issue #3316](https://github.com/duckdb/duckdb/issues/3316) — “Too large parquet files via `COPY TO`”
- **35 comments**
- Longstanding concern: DuckDB-generated Parquet files can be materially larger than `pyarrow.parquet.write_table()` output for similar data.
- Technical need: users want **Parquet writer tuning parity** and stronger default compression/encoding choices for data exchange workflows.

### Duplicate column naming safety
- [Issue #11520](https://github.com/duckdb/duckdb/issues/11520) — setting to error on duplicated column names
- **10 comments**
- This reflects a real SQL ergonomics/correctness problem: `SELECT *` combined with aliases can silently rename columns (`b` → `b1`), causing downstream confusion.
- Technical need: stricter binder or configurable safety modes for analytical SQL development.

### XDG/Base directory compliance
- [Issue #11779](https://github.com/duckdb/duckdb/issues/11779) — DuckDB does not follow XDG Base Directory Spec
- **10 👍 / 8 comments**
- This is one of the clearest user-experience asks today.
- Technical need: cleaner desktop/Linux integration, especially for CLI and extension metadata/history placement.

### Python context manager support
- [Issue #3152](https://github.com/duckdb/duckdb/issues/3152) — context managers in Python API
- **26 👍 / 7 comments**
- Strong signal that users want more idiomatic Python resource management around connection/register lifecycle.
- Technical need: less error-prone integration in notebook, ETL, and application code.

### Chained `ifnull` inconsistency
- [Issue #11907](https://github.com/duckdb/duckdb/issues/11907) — `ifnull` errors when chained
- **7 comments**
- This highlights demand for consistency in function chaining behavior and SQL expression ergonomics.

### Notable open PRs drawing technical interest
- [PR #21375](https://github.com/duckdb/duckdb/pull/21375) — row-group skipping for **MAP columns** in Parquet reader  
  A strong storage-engine optimization signal: users want richer statistics-based pruning even with nested types.
- [PR #21382](https://github.com/duckdb/duckdb/pull/21382) — **checkpoint transactions**  
  Important for durability correctness and operational safety.
- [PR #21446](https://github.com/duckdb/duckdb/pull/21446) — **window catalog entries**  
  Suggests ongoing cleanup/normalization of function catalog internals.

## 4. Bugs & Stability

Below are the most notable bugs and regressions updated today, ranked roughly by severity.

### High severity

1. **Crash in `read_parquet()` with `encryption_config` + `union_by_name=true`**
   - [Issue #21508](https://github.com/duckdb/duckdb/issues/21508)
   - Causes **NULL dereference/internal error** in v1.5 when combining two valid options.
   - Severity is high because it is a **hard crash/internal error** in a common ingestion path.

2. **Precision loss writing `HUGEINT` to Parquet**
   - [Issue #21180](https://github.com/duckdb/duckdb/issues/21180)
   - `HUGEINT` apparently being written as floating-point `DOUBLE`, losing precision.
   - High severity due to **silent data corruption risk** in analytical export pipelines.

3. **ASOF LEFT JOIN with empty right table returns empty result**
   - [Issue #21514](https://github.com/duckdb/duckdb/issues/21514)
   - Fix exists: [PR #21519](https://github.com/duckdb/duckdb/pull/21519)
   - Query semantics bug affecting correctness of time-series joins.

4. **Internal binder error after upgrade to 1.5.0**
   - [Issue #21419](https://github.com/duckdb/duckdb/issues/21419) — closed
   - Involved `spatial` extension and a query working on 1.4.x.
   - Indicates at least one v1.5 regression was triaged and closed quickly.

### Medium severity

5. **Recursive `UNNEST` does not fully unnest `integer[3][3]`**
   - [Issue #21506](https://github.com/duckdb/duckdb/issues/21506)
   - Correctness issue for nested types; likely relevant to users working with arrays and semi-structured data.

6. **Off-by-one statistics propagation in `date_part`**
   - [Issue #21478](https://github.com/duckdb/duckdb/issues/21478)
   - Optimizer statistics upper bounds are too wide for several date parts.
   - Not a wrong-answer bug directly, but can reduce **predicate pruning quality** and plan efficiency.

7. **JSON import misparses ISO 8601 strings with `T` separator**
   - [Issue #14004](https://github.com/duckdb/duckdb/issues/14004)
   - Impacts ingestion reliability for common JSON timestamp formats.

8. **Named in-memory connections do not survive function scope**
   - [Issue #16717](https://github.com/duckdb/duckdb/issues/16717)
   - Lifecycle semantics mismatch in embedded use.

### Lower severity but noteworthy

9. **CLI `-json` emitted invalid JSON on empty result sets**
   - [Issue #21512](https://github.com/duckdb/duckdb/issues/21512)
   - Fixed by [PR #21517](https://github.com/duckdb/duckdb/pull/21517)
   - Small surface issue, but harmful for automation.

10. **`str_split('', '')` returns `['']` instead of `[]`**
    - [Issue #14414](https://github.com/duckdb/duckdb/issues/14414)
    - Edge-case behavior inconsistency.

11. **`ifnull` chaining error**
    - [Issue #11907](https://github.com/duckdb/duckdb/issues/11907)
    - SQL expression consistency issue.

12. **S3 ETag quote mismatch leading to false “file changed”**
    - [Issue #21401](https://github.com/duckdb/duckdb/issues/21401) — closed
    - Important for object-storage reliability; appears to have been addressed.

13. **PreparedStatement memory leak due to state accumulation**
    - [Issue #21089](https://github.com/duckdb/duckdb/issues/21089) — closed
    - Important for long-running embedded applications.

## 5. Feature Requests & Roadmap Signals

Several requests today offer clues about near-term roadmap priorities.

### Likely near-term / plausible next version candidates

- **riscv64 release binaries and Python wheels**
  - [Issue #21494](https://github.com/duckdb/duckdb/issues/21494)
  - This is relatively self-contained and aligns with DuckDB’s broad packaging strategy. Feels plausible for a future release if CI/build support is manageable.

- **Strict handling of duplicate column names**
  - [Issue #11520](https://github.com/duckdb/duckdb/issues/11520)
  - A configuration flag or binder option seems implementable and addresses recurring user mistakes.

- **XDG Base Directory compliance**
  - [Issue #11779](https://github.com/duckdb/duckdb/issues/11779)
  - User demand is clear, and [PR #21527](https://github.com/duckdb/duckdb/pull/21527) on path suffix handling shows active work in path infrastructure generally, though not directly on XDG.

- **Python context manager support**
  - [Issue #3152](https://github.com/duckdb/duckdb/issues/3152)
  - High reaction count makes this a strong usability candidate, especially for Python-first adoption.

### Architectural roadmap signals from open PRs

- **Nested-type-aware storage optimizations**
  - [PR #21375](https://github.com/duckdb/duckdb/pull/21375) points to more sophisticated **Parquet row-group skipping**, even when MAP columns exist.

- **Transactional checkpointing**
  - [PR #21382](https://github.com/duckdb/duckdb/pull/21382) suggests continued investment in durability and checkpoint correctness.

- **Catalog/function system cleanup**
  - [PR #21446](https://github.com/duckdb/duckdb/pull/21446) indicates maturation of catalog representation for window functions.

- **DML/parser/query model unification**
  - [PR #21518](https://github.com/duckdb/duckdb/pull/21518) and [PR #21524](https://github.com/duckdb/duckdb/pull/21524) are strong signals that internals are being refactored for consistency and future extensibility.

## 6. User Feedback Summary

Today’s issue traffic reveals a few clear user pain points:

- **Users care deeply about export fidelity and interoperability**
  - Large Parquet output sizes ([#3316](https://github.com/duckdb/duckdb/issues/3316)) and `HUGEINT` precision loss ([#21180](https://github.com/duckdb/duckdb/issues/21180)) show that DuckDB is being used as a serious interchange/export engine, not just an interactive SQL tool.

- **v1.5.0 introduced some visible regressions**
  - Reports involving `UNNEST`, `read_parquet`, `ASOF JOIN`, binder failures, and CLI JSON output suggest active upgrade friction, though maintainer response appears fast.

- **Semi-structured and nested data remain a major workload**
  - Issues around JSON timestamps, recursive `UNNEST`, `STRUCT[]`, MAP column pruning, and encrypted Parquet indicate continued heavy use with modern analytics data formats.

- **Embedded/app developer ergonomics matter**
  - Python context managers, duplicate-column safeguards, named in-memory connection semantics, and XDG compliance all point to demand for smoother integration in real applications.

- **Object storage and remote file reliability are critical**
  - The S3 ETag issue ([#21401](https://github.com/duckdb/duckdb/issues/21401)) reinforces how important cloud/object-storage workflows are to the user base.

## 7. Backlog Watch

These older or strategically important items still appear to deserve maintainer attention:

- **Parquet writer efficiency**
  - [Issue #3316](https://github.com/duckdb/duckdb/issues/3316)  
  Open since 2022 and still active. Important because it affects DuckDB’s competitiveness as a Parquet production tool.

- **Python context manager support**
  - [Issue #3152](https://github.com/duckdb/duckdb/issues/3152)  
  Also open since 2022 with strong community interest.

- **XDG directory compliance**
  - [Issue #11779](https://github.com/duckdb/duckdb/issues/11779)  
  Not correctness-critical, but high visibility for CLI/Linux users.

- **Duplicate column name strictness**
  - [Issue #11520](https://github.com/duckdb/duckdb/issues/11520)  
  Important for query safety and developer trust, especially in notebook-heavy workflows.

- **JSON ISO 8601 import parsing**
  - [Issue #14004](https://github.com/duckdb/duckdb/issues/14004)  
  Common data ingestion path; likely worth prioritizing due to ecosystem ubiquity.

- **Named in-memory connection lifetime semantics**
  - [Issue #16717](https://github.com/duckdb/duckdb/issues/16717)  
  A subtle but important embedded-database semantics issue that can surprise application developers.

## 8. Overall Health Assessment

DuckDB appears **healthy, fast-moving, and highly responsive**, with maintainers landing fixes quickly on newly reported regressions and continuing substantial internal refactors. The main short-term risk is **stability pressure following v1.5.0**, particularly around nested types, Parquet ingestion/export, and certain planner/execution edge cases. The positive counter-signal is that several of today’s regressions already have fixes merged or PRs open within a day. In practical terms, the project looks like it is in an **active stabilization-and-internals-improvement phase**, rather than a lull.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-21

## 1. Today's Overview

StarRocks had a very high-velocity day on GitHub: **137 PRs were updated in the last 24 hours**, with **101 merged/closed** and **36 still open**, while issue traffic remained light at **4 updated issues**. The activity pattern suggests a **release-maintenance and stabilization cycle**, especially around **materialized views, Iceberg external-table refresh correctness, test stability, and backports across 3.5/4.0/4.1 branches**. There were **no new releases**, but the volume of branch backports and follow-up fixes indicates active hardening of existing release lines. Overall project health looks **strong on throughput**, with current risk concentrated in **query correctness**, **MV refresh semantics**, and **edge-case crash prevention** rather than broad platform instability.

## 2. Project Progress

Today’s merged/closed PRs show progress concentrated in three areas: **external table / MV correctness**, **planner robustness**, and **engineering/tooling quality**.

### A. Materialized View and external catalog correctness
A notable stream of fixes targeted **Iceberg-backed MV refresh logic**, which remains one of the most active technical fronts:

- [#70523](https://github.com/StarRocks/starrocks/pull/70523) — **Fix mv refresh bugs with expired snapshot iceberg partitions to avoid repeat refresh**  
  This follow-up addresses a correctness gap when Iceberg snapshots expire and `last_updated_snapshot_id` becomes null, which could cause repeated or unnecessary refresh decisions.
- [#70615](https://github.com/StarRocks/starrocks/pull/70615), [#70616](https://github.com/StarRocks/starrocks/pull/70616), [#70617](https://github.com/StarRocks/starrocks/pull/70617) — branch backports of the above fix to **4.0.9**, **3.5.16**, and **4.1.0**.
- [#70382](https://github.com/StarRocks/starrocks/pull/70382) — **Make Iceberg MV refresh tolerate non-monotonic snapshot timestamps**  
  Fixes timestamp-based refresh assumptions that break when Iceberg snapshot timing is not strictly monotonic.
- [#70485](https://github.com/StarRocks/starrocks/pull/70485) — backport of the above to 3.5.16.
- [#70601](https://github.com/StarRocks/starrocks/pull/70601) — **Fix Invalid Plan error when MV transparent rewrite creates Union with GROUP BY function expression**  
  Important optimizer-side fix for mixed MV/base-table plans involving functional expressions in aggregation.

**Assessment:** StarRocks is actively closing correctness gaps in its **federated analytics and external-lakehouse integration path**, especially where optimizer rewrite meets evolving Iceberg metadata.

### B. Query engine behavior and SQL observability
Several open or recently updated PRs indicate active enhancement of SQL execution transparency and execution behavior:

- [#70609](https://github.com/StarRocks/starrocks/pull/70609) — **Add per-target-BE MIN/MAX for RPC metrics in load profile**  
  Improves diagnosis of load imbalance and distributed RPC skew in multi-BE deployments.
- [#70535](https://github.com/StarRocks/starrocks/pull/70535) — **Show primary key for Paimon tables in SHOW CREATE and DESC statement**  
  Advances metadata fidelity and SQL introspection for external catalogs.
- [#70613](https://github.com/StarRocks/starrocks/pull/70613) — **Optimize window functions with skewed partition keys by splitting into UNION**
- [#70614](https://github.com/StarRocks/starrocks/pull/70614) — **Support explicit skew hint for window function**  

**Assessment:** These changes show a strong focus on **distributed execution transparency**, **external table usability**, and **planner support for skew-heavy analytical workloads**.

### C. Stability, test quality, and developer productivity
The merged/closed queue also contained infrastructure-quality improvements:

- [#70611](https://github.com/StarRocks/starrocks/pull/70611) — **Optimize Build**
- [#70604](https://github.com/StarRocks/starrocks/pull/70604) — **Make BE compile successfully on MacOS**
- [#70606](https://github.com/StarRocks/starrocks/pull/70606) — open UT fix for unstable failures introduced by fast-cancel lake replication transactions
- [#70597](https://github.com/StarRocks/starrocks/pull/70597) — UT adjustment for Iceberg alter-table v2 SQL tests

**Assessment:** The project is investing not only in runtime correctness but also in **branch reliability, CI stability, and contributor ergonomics**.

## 3. Community Hot Topics

Based on the provided issue/PR set, the hottest topics are less about discussion volume and more about **recurring technical clusters**.

### 1) Iceberg MV refresh correctness
- [PR #70523](https://github.com/StarRocks/starrocks/pull/70523)
- [PR #70382](https://github.com/StarRocks/starrocks/pull/70382)
- [PR #70589](https://github.com/StarRocks/starrocks/pull/70589)
- [PR #70444](https://github.com/StarRocks/starrocks/pull/70444)

This cluster points to a shared need: **robust, partition-aware refresh semantics across external lakehouse connectors**, especially when metadata is incomplete, timestamps are non-monotonic, snapshots expire, or partitions are dropped. The underlying technical demand is clear: enterprise users expect StarRocks MVs over Iceberg-like catalogs to behave deterministically even under metadata churn.

### 2) Query correctness in optimizer/execution edge cases
- [Issue #70349](https://github.com/StarRocks/starrocks/issues/70349) — **JoinHashTable::merge_ht() missing expression-based key column merge causes crash/wrong results**
- [PR #70601](https://github.com/StarRocks/starrocks/pull/70601) — MV transparent rewrite + function-expression `GROUP BY`
- [PR #70281](https://github.com/StarRocks/starrocks/pull/70281) — **Fix CN crash when scanning empty tablet with physical split enabled**

The technical need here is protection against **complex SQL plans that combine expression-based joins, adaptive partitioning, physical split logic, and optimizer rewrites**. StarRocks is clearly being exercised in sophisticated analytical scenarios, and these cases expose deep engine edge conditions.

### 3) Better support for skew and distributed performance diagnosis
- [PR #70613](https://github.com/StarRocks/starrocks/pull/70613)
- [PR #70614](https://github.com/StarRocks/starrocks/pull/70614)
- [PR #70609](https://github.com/StarRocks/starrocks/pull/70609)

These updates reflect user demand for **more predictable performance under skewed partitions and large distributed loads**, a common OLAP production pain point.

## 4. Bugs & Stability

Ranked by likely operational severity:

### Critical
#### 1) Join crash / wrong results with expression-based join keys
- [Issue #70349](https://github.com/StarRocks/starrocks/issues/70349) — **[Bug] JoinHashTable::merge_ht() missing expression-based key column merge causes crash/wrong results with adaptive partition hash join**
- Status: **Closed**
- Severity: **Critical**
- Why it matters: This combines the two worst classes of database failures — **process crash** and **silent wrong results**. Because it affects **adaptive partition hash join** and **expression-based join keys**, it may hit advanced analytical queries rather than only pathological toy cases.
- Fix PR: Not explicitly listed in the provided PR subset, but closure indicates a fix landed.

#### 2) CN crash on empty tablet with physical split enabled
- [PR #70281](https://github.com/StarRocks/starrocks/pull/70281) — **Fix CN crash when scanning empty tablet with physical split enabled**
- Status: **Open**
- Severity: **High**
- Why it matters: Out-of-bounds access and `SIGSEGV` in scan path can affect cluster stability, especially in disaggregated compute/storage or cloud-native node configurations.

### High
#### 3) Misleading EXPLAIN partition count for Hive tables
- [Issue #70557](https://github.com/StarRocks/starrocks/issues/70557) — **EXPLAIN reports misleading partition count for Hive tables when metastore pre-filters by string partition columns**
- Status: **Open**
- Severity: **High for operations/debugging, Medium for execution correctness**
- Why it matters: This appears to be an **observability/planner-reporting bug**, not a direct execution bug, but misleading partition counts impair optimization trust and troubleshooting.

#### 4) MV refresh bugs around expired Iceberg snapshots
- [PR #70523](https://github.com/StarRocks/starrocks/pull/70523)
- [PR #70382](https://github.com/StarRocks/starrocks/pull/70382)
- Status: **Closed/merged with backports**
- Severity: **High**
- Why it matters: Repeated refresh, missed refresh, or inconsistent refresh decisions on external partitions can create stale or expensive refresh behavior in production data pipelines.

### Medium
#### 5) Incorrect partition expression error message
- [Issue #68567](https://github.com/StarRocks/starrocks/issues/68567) — **The error message for partition expr is not correct**
- Status: **Open**
- Severity: **Medium**
- Why it matters: Not a runtime correctness bug, but poor diagnostics slow adoption and increase support burden, especially for DDL-heavy workloads.

## 5. Feature Requests & Roadmap Signals

### 1) Spark Load via Apache Livy Batch REST API
- [Issue #70574](https://github.com/StarRocks/starrocks/issues/70574) — **Support Spark Load via Apache Livy Batch REST API**

This is the clearest user-driven feature request in today’s issue stream. The request addresses a real deployment blocker: current Spark Load relies on **`spark-submit` on YARN**, requiring FE-side access to Spark/YARN client binaries and Hadoop configs. A Livy-based mode would better fit **managed, containerized, or security-constrained enterprise environments**.

**Roadmap signal:** Strong candidate for future connector/load modernization, especially if StarRocks is prioritizing cloud-native ingestion paths.

### 2) Window skew handling
- [PR #70613](https://github.com/StarRocks/starrocks/pull/70613)
- [PR #70614](https://github.com/StarRocks/starrocks/pull/70614)

Although these are PRs rather than issues, they signal active roadmap investment in **optimizer support for skew-heavy window queries**. This is particularly relevant for user behavior analytics, event streams, and ranking workloads with hot keys.

### 3) Better external-catalog SQL compatibility and metadata fidelity
- [PR #70535](https://github.com/StarRocks/starrocks/pull/70535) — Paimon primary key visibility
- [PR #70589](https://github.com/StarRocks/starrocks/pull/70589) — precise MV refresh fallback for Iceberg-like connectors

**Prediction:** Near-term versions are likely to continue improving **Iceberg/Paimon interoperability**, **MV correctness over external tables**, and **operational observability** rather than introducing large new SQL surface areas.

## 6. User Feedback Summary

The strongest user signals today point to the following pain points:

- **External lakehouse consistency is mission-critical.** Multiple MV/Iceberg fixes indicate users are running StarRocks against mutable external tables and need refresh behavior they can trust.
- **Users care deeply about correctness under advanced SQL plans.** The join-hash crash/wrong-result issue and MV rewrite invalid-plan bug show that sophisticated SQL constructs are being used in production.
- **Operational transparency matters.** The Hive `EXPLAIN` issue and the load-profile RPC metric enhancement suggest users need StarRocks to explain *what it is doing* as much as execute quickly.
- **Cloud-native deployment constraints are shaping feature demand.** The Livy request shows that traditional FE-local client dependencies are increasingly seen as friction.

Overall, user feedback today reflects a mature user base running **complex, federated, production OLAP workloads**, where **correctness and debuggability** matter as much as raw speed.

## 7. Backlog Watch

These items appear to merit maintainer attention due to age, impact, or strategic relevance:

### Open issues needing follow-through
- [#68567](https://github.com/StarRocks/starrocks/issues/68567) — **The error message for partition expr is not correct**  
  Labeled **good first issue**, but open since **2026-01-28**. Low implementation risk, good candidate for community contribution, and useful for reducing DDL confusion.

- [#70574](https://github.com/StarRocks/starrocks/issues/70574) — **Support Spark Load via Apache Livy Batch REST API**  
  New but strategically important. This request aligns with enterprise deployment realities and could influence ingestion roadmap prioritization.

- [#70557](https://github.com/StarRocks/starrocks/issues/70557) — **EXPLAIN reports misleading partition count for Hive tables**  
  Should be watched because planner/explain trust is important for external query tuning and supportability.

### Open PRs worth watching
- [#70589](https://github.com/StarRocks/starrocks/pull/70589) — **Fix precise external MV refresh fallback for Iceberg-like connectors**  
  Important for closing the broader external MV correctness loop.
- [#70444](https://github.com/StarRocks/starrocks/pull/70444) — **Fix MV rewrite ignoring dropped partitions in base table**
  Potentially high impact because stale-rewrite bugs can compromise query correctness.
- [#70281](https://github.com/StarRocks/starrocks/pull/70281) — **Fix CN crash when scanning empty tablet with physical split enabled**
  Needs prompt attention due to crash severity.
- [#70535](https://github.com/StarRocks/starrocks/pull/70535) — **Show primary key for Paimon tables in SHOW CREATE and DESC statement**
  Valuable SQL-compatibility and metadata usability improvement for external catalogs.

## 8. Overall Health Assessment

StarRocks appears **healthy and highly active**, with exceptional PR throughput and visible multi-branch maintenance discipline. The main engineering focus is not broad new feature expansion today, but **hardening the engine for real-world federated analytics**, especially around **Iceberg-backed materialized views, optimizer rewrites, and execution edge cases**. The most important risk area remains **query correctness under complex plans and external metadata irregularities**, but the high volume of targeted fixes and backports is a positive signal that the project is actively reducing that risk.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-21

## 1) Today's Overview

Apache Iceberg remained highly active over the last 24 hours, with **50 PRs updated** and **15 issues updated**, indicating strong ongoing development across Spark, Flink, Kafka Connect, REST/catalog APIs, and build infrastructure. There were **no new releases**, but the issue and PR stream suggests the project is in a **stabilization-plus-feature-delivery phase**, with particular attention on correctness bugs, backports for the 1.10.x line, and connector behavior under failure or recovery scenarios. Operational correctness in distributed write paths—especially **Flink sink recovery**, **Kafka Connect commit handling**, and **REST/TLS behavior**—stands out as a central theme. Overall project health looks good in terms of contributor activity, though several correctness and compatibility issues suggest maintainers are balancing innovation with production hardening.

## 2) Project Progress

### Merged/closed PRs today

Even without a release, a few closed PRs point to progress in hardening existing integrations and housekeeping:

- **[PR #15702](https://github.com/apache/iceberg/pull/15702)** — *Flink: Backport: Fix non-deterministic operator UIDs in DynamicIcebergSink*  
  Closed as a backport for Flink 1.20 and 2.0. This is important for **stateful recovery and job upgrade stability** in Flink, where deterministic operator IDs are essential for restoring state correctly.

- **[PR #15705](https://github.com/apache/iceberg/pull/15705)** — *Build: Stop ignoring gradle directory*  
  Closed after addressing repository hygiene around `gradle/` and version management files. This improves **build reproducibility and dependency governance**, especially important in a large multi-engine project.

- **[PR #14853](https://github.com/apache/iceberg/pull/14853)** — *Spark, Arrow, Parquet: Add vectorized read support for parquet RLE encoded data pages*  
  Closed rather than merged. Although not landed, it signals continued interest in **Parquet scan performance** and deeper vectorization support for Spark/Arrow paths.

- **[PR #14782](https://github.com/apache/iceberg/pull/14782)** — *Spark: Support View Schema Mode and CREATE TABLE LIKE sort order*  
  Also closed, but notable because it touches **Spark SQL compatibility** and view semantics—areas likely to return in future iterations.

### What advanced today

Across open and recently closed PRs, the following workstreams advanced:

- **Spark SQL/data maintenance correctness**
  - **[PR #15706](https://github.com/apache/iceberg/pull/15706)** adds upfront validation for Z-order rewrites when a table has a user column named `ICEZVALUE`, improving error clarity and preventing misleading failures.
  - **[PR #15632](https://github.com/apache/iceberg/pull/15632)** addresses `rewrite_position_delete_files` failures with array/map columns, a meaningful fix for **delete file maintenance on complex schemas**.

- **Kafka Connect write-path reliability**
  - **[PR #15710](https://github.com/apache/iceberg/pull/15710)** and **[PR #15651](https://github.com/apache/iceberg/pull/15651)** both focus on separating or clearing stale commit state to prevent **duplicate rows or data loss after partial/failed commits**.
  - **[PR #15234](https://github.com/apache/iceberg/pull/15234)** would simplify configuration by deriving Iceberg coordinator group identity from Kafka consumer group state.

- **REST/catalog and API evolution**
  - **[PR #15669](https://github.com/apache/iceberg/pull/15669)** adds Java support for **batch load endpoints** for tables and views.
  - **[PR #14142](https://github.com/apache/iceberg/pull/14142)** continues implementation of request/response objects for a future **events endpoint**.
  - **[PR #15049](https://github.com/apache/iceberg/pull/15049)** continues foundational work for **V4 manifest support**, an important metadata evolution signal.

- **Infra/compliance**
  - **[PR #15707](https://github.com/apache/iceberg/pull/15707)** pins CI actions to Apache-approved SHAs.
  - **[PR #15430](https://github.com/apache/iceberg/pull/15430)** adds Trivy CVE scanning for Kafka Connect artifacts.
  - **[PR #15676](https://github.com/apache/iceberg/pull/15676)** introduces Scalafix for automatic cleanup of unused Scala imports.

## 3) Community Hot Topics

Below are the most active discussions by comments and practical impact.

### 1. Flink sink duplicates during recovery with REST catalog
- **Issue:** [#14425](https://github.com/apache/iceberg/issues/14425)  
- **Comments:** 15  
- **Linked fix:** [PR #14517](https://github.com/apache/iceberg/pull/14517) mentioned in the issue

This is the most significant user-facing topic in the issue list. The report describes **duplicate data after recovery** when using `DynamicIcebergSink` with the REST catalog. The underlying need is clear: users expect **exactly-once or at least non-duplicating recovery semantics** under distributed failure scenarios. For OLAP storage engines, write recovery correctness is often more important than raw throughput, so this issue likely has high production priority.

### 2. Core benchmarking for Variants
- **Issue:** [#15628](https://github.com/apache/iceberg/issues/15628)  
- **Comments:** 6

The request for **JMH benchmarks for Variants** reflects a growing concern about the performance profile of semi-structured or flexible typed data in Iceberg. This is a roadmap signal that users are not just asking for feature support—they now want **measurable scalability and regression detection** for these newer abstractions.

### 3. Arrow ↔ Iceberg type mapping documentation
- **Issue:** [#15666](https://github.com/apache/iceberg/issues/15666)  
- **Comments:** 5

This is a documentation request, but it points to a real interoperability need. As Iceberg adoption expands into Python, Arrow-native systems, and cross-language processing stacks, users need an authoritative mapping for **schema compatibility, type fidelity, and conversion edge cases**.

### 4. Spark SQL support for version/timestamp range queries
- **Issue:** [#15699](https://github.com/apache/iceberg/issues/15699)  
- **Comments:** 3

This request highlights demand for **incremental consumption patterns** directly in SQL syntax, not just via APIs. It suggests users increasingly want Iceberg’s snapshot lineage capabilities to be first-class in **Spark SQL ergonomics**, especially for CDC-like and historical delta workloads.

### 5. Week partition transform
- **Issue:** [#14220](https://github.com/apache/iceberg/issues/14220)  
- **Comments:** 3

Although not highly active, this is a recurring data-layout need. It indicates real-world partitioning use cases where `day` is too granular and `month` is too coarse, especially in BI/reporting workloads.

## 4) Bugs & Stability

Ranked by likely production severity.

### Critical / High

#### 1. Flink sink duplicate writes on recovery with REST catalog
- **Issue:** [#14425](https://github.com/apache/iceberg/issues/14425)
- **Fix in progress:** [PR #14517](https://github.com/apache/iceberg/pull/14517) referenced in the issue

This is the most severe item because it affects **data correctness** and can silently duplicate records after failure recovery. Since it involves Flink + REST catalog, it may affect modern deployment architectures using decoupled metadata services.

#### 2. Kafka Connect stale `DataWritten` events causing duplicate or mixed commits
- **PRs:** [#15710](https://github.com/apache/iceberg/pull/15710), [#15651](https://github.com/apache/iceberg/pull/15651)

While represented as PRs rather than issues here, these changes target a serious reliability problem: stale write events from a prior timed-out commit can leak into the next commit cycle. That creates risk of **duplicate rows, incorrect commit grouping, or data loss** in streaming ingestion pipelines.

#### 3. HTTPClient TLS hostname verification regression
- **Issue:** [#15598](https://github.com/apache/iceberg/issues/15598)

A regression between 1.10 and the upcoming 1.11 release in hostname verification is high severity because it affects **secure connectivity** to REST services. Problems here can cause either broken secure connections or weakened verification behavior, both serious for enterprise deployments.

### Medium

#### 4. Spark Z-order rewrite fails when schema contains `ICEZVALUE`
- **Issue:** [#15708](https://github.com/apache/iceberg/issues/15708)
- **Fix PR:** [#15706](https://github.com/apache/iceberg/pull/15706)

This is a good example of a correctness/usability bug: the rewrite fails with a **misleading error** because internal implementation details leak into user schema namespace. Impact is narrower than write duplication, but the fix is already underway.

#### 5. `rewrite_position_delete_files` failure with array/map columns
- **Fix PR:** [#15632](https://github.com/apache/iceberg/pull/15632)
- **Related issue:** referenced as #15080 in the PR

This affects storage maintenance workflows on complex schemas. Since many modern analytics tables include nested fields, this is operationally important for users relying on **delete file compaction and maintenance actions**.

#### 6. `RewriteTablePathUtil.relativize()` fails when path equals prefix
- **Issue:** [#15172](https://github.com/apache/iceberg/issues/15172)

This appears to be a concrete edge-case bug impacting `rewrite_table_path`, likely relevant in migration or file-layout refactoring workflows.

#### 7. Inaccurate estimated table size
- **Issue:** [#15684](https://github.com/apache/iceberg/issues/15684)

This is not a correctness failure in stored data, but it can affect **planning, optimization, and user expectations** in Spark if size estimates are materially wrong.

### Lower / Resolved

#### 8. Flink SQL silent empty reads due to table name mismatch with `USE namespace`
- **Issue:** [#15668](https://github.com/apache/iceberg/issues/15668) — Closed

Closed quickly, which is a positive sign for Flink connector responsiveness.

#### 9. Backport to avoid incorrect cleanups during CREATE transactions
- **Issue:** [#15601](https://github.com/apache/iceberg/issues/15601) — Closed

This suggests active hardening of the **1.10.x patch line**, especially for REST-server 5xx scenarios during transactional table creation.

## 5) Feature Requests & Roadmap Signals

### Strongest roadmap signals

#### SQL/time-travel ergonomics
- **[Issue #15699](https://github.com/apache/iceberg/issues/15699)** — support version/timestamp range queries in Spark SQL syntax

This has a strong chance of surfacing in a future release because the issue notes that **underlying scan infrastructure already supports the capability**. That reduces implementation risk and makes this a likely candidate for near-term SQL usability improvement.

#### Partitioning improvements
- **[Issue #14220](https://github.com/apache/iceberg/issues/14220)** — add `week` partition transform

This is a straightforward but broadly useful partitioning enhancement. It may not be immediate if spec implications are non-trivial, but it’s the kind of feature that often gets traction once someone contributes an implementation.

#### Variant performance tooling
- **[Issue #15628](https://github.com/apache/iceberg/issues/15628)** — JMH benchmarks for Variants

This is less likely to be highlighted in release notes than SQL syntax, but highly likely to be accepted as part of **performance engineering and regression prevention**.

#### Cross-ecosystem schema/type documentation
- **[Issue #15666](https://github.com/apache/iceberg/issues/15666)** — Arrow to Iceberg type mapping

This could land quickly because it is relatively low-risk and serves increasing multi-language adoption.

#### GCS credential refresh
- **[Issue #15695](https://github.com/apache/iceberg/issues/15695)** — scheduled refresh for `GCSFileIO` held storage credentials

This is a practical cloud-operability feature and a plausible candidate for the next minor or patch train if similar logic already exists elsewhere.

### Broader roadmap indicators from active PRs

- **REST/catalog batching** via [PR #15669](https://github.com/apache/iceberg/pull/15669)
- **Events endpoint / richer REST semantics** via [PR #14142](https://github.com/apache/iceberg/pull/14142)
- **V4 manifest support groundwork** via [PR #15049](https://github.com/apache/iceberg/pull/15049)
- **Kafka Connect routing and DV mode** via [PR #11623](https://github.com/apache/iceberg/pull/11623) and [PR #14797](https://github.com/apache/iceberg/pull/14797)

These point to continued investment in **metadata evolution**, **streaming/connectors**, and **catalog API maturity**.

## 6) User Feedback Summary

A few consistent user pain points emerge from today’s activity:

- **Failure recovery must not compromise correctness.**  
  Reports from Flink and Kafka Connect users show that duplicate writes, stale commit buffers, and partial-commit handling remain top concerns in production streaming pipelines. Users are clearly prioritizing **transactional robustness over feature breadth**.

- **Connector behavior should match SQL/user expectations.**  
  The closed Flink namespace/table-name bug and the Spark SQL request for range-based time travel both show users want Iceberg integrations to feel **natural inside the engine they use**, without hidden naming constraints or API-only capabilities.

- **Operational cloud behavior matters.**  
  TLS verification regressions and GCS credential refresh requests indicate that users are running Iceberg in managed/cloud environments where **security and long-lived credential handling** are essential.

- **Complex and modern schemas are now standard.**  
  Issues around array/map columns, Arrow type mapping, and Variant benchmarking suggest users increasingly rely on **nested, semi-structured, and cross-language data models**.

- **Error messaging still matters.**  
  The `ICEZVALUE` conflict is not catastrophic, but it shows users are sensitive to failures that are technically explainable but **difficult to diagnose from the surfaced error**.

## 7) Backlog Watch

These items appear important and may need maintainer attention due to age, scope, or strategic relevance.

### Important open issues

- **[Issue #14589](https://github.com/apache/iceberg/issues/14589)** — `CopyTable` fails with `FileAlreadyExistsException` when position delete files are present  
  Old enough and relevant to Spark table migration/copy workflows. This touches correctness and migration reliability.

- **[Issue #15172](https://github.com/apache/iceberg/issues/15172)** — `RewriteTablePathUtil.relativize()` edge case  
  Small bug, but in an admin/migration utility where edge-case failures can derail operations.

- **[Issue #13886](https://github.com/apache/iceberg/issues/13886)** — inconsistent checking of redundant transforms in `PartitionSpec` construction vs update  
  Labeled stale, but it points to **API consistency and partition-spec validation semantics**, which matter for correctness and developer trust.

- **[Issue #14220](https://github.com/apache/iceberg/issues/14220)** — week partition transform  
  Not urgent, but a persistent and practical user request.

### Long-running or strategic PRs

- **[PR #11623](https://github.com/apache/iceberg/pull/11623)** — Kafka Connect routing by topic name  
  Long-lived and strategically valuable for connector adoption.

- **[PR #14797](https://github.com/apache/iceberg/pull/14797)** — Kafka Connect delta writer support in DV mode  
  Significant streaming functionality, likely complex and worth close review.

- **[PR #14142](https://github.com/apache/iceberg/pull/14142)** — events endpoint request/response objects  
  Important for REST/catalog ecosystem maturity and future integrations.

- **[PR #15049](https://github.com/apache/iceberg/pull/15049)** — foundational V4 manifest support  
  Potentially high-impact long-term work that deserves steady maintainer guidance.

- **[PR #14876](https://github.com/apache/iceberg/pull/14876)** — encrypting IO as `DelegateFileIO`  
  This intersects storage abstraction, encryption, and bulk operations support; strategically important for enterprise deployments.

---

## Bottom line

Iceberg is showing **strong engineering momentum**, but today’s activity emphasizes that the project’s biggest near-term value is in **hardening correctness and operability** across streaming writers, REST/catalog clients, and maintenance actions. The most urgent items are around **duplicate-write prevention, commit isolation, and TLS/connectivity regressions**. At the same time, the roadmap continues to expand toward **better SQL ergonomics, richer REST APIs, metadata evolution, and cloud-native operational support**.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-21

## 1. Today's Overview

Delta Lake showed **high pull-request activity** over the last 24 hours, with **38 PRs updated** and **2 issues updated**, indicating active maintainer and contributor engagement despite a light issue volume. The day’s work was concentrated around **Spark integration, Kernel/Spark CDC streaming support, UC commit metrics plumbing, protocol/docs clarifications, and branch/version prep for 4.2.0-SNAPSHOT**. No new releases were published, so activity is currently centered on **development throughput rather than shipment**. Overall project health looks **active and forward-moving**, with a notable emphasis on **streaming correctness, DSv2 evolution, and internal observability/metrics infrastructure**.

## 2. Project Progress

### Merged/closed PRs today

#### 1) Kernel variant GA table feature PR was closed
- [PR #6322 — [KERNEL][VARIANT] Add variant GA table feature to delta kernel java](https://github.com/delta-io/delta/pull/6322)

This closed PR signals active work around **Variant type support in Delta Kernel Java**, which is strategically important for semi-structured data interoperability and SQL engine compatibility. Even though it was closed rather than merged, it indicates the project is still iterating on how GA-grade Variant/table-feature support should land in Kernel.

#### 2) Incremental commit observability improvement was closed
- [PR #6327 — Add logging when incremental commit is silently disabled](https://github.com/delta-io/delta/pull/6327)

This PR targeted an operational blind spot: when **incremental checksum validation fails**, incremental commit could be silently disabled. The proposed warning logs would improve **runtime diagnosability and operator visibility**, especially for production write paths. Although closed, it highlights active attention to **write-path reliability and supportability**.

### What was advanced in the open PR stream

While not merged today, the active PR set shows clear progress in several technical areas:

- **Streaming CDC in Kernel/Spark**
  - [PR #6075 — initial snapshot CDC support to SparkMicroBatchStream](https://github.com/delta-io/delta/pull/6075)
  - [PR #6076 — incremental CDC support to SparkMicroBatchStream](https://github.com/delta-io/delta/pull/6076)
  - [PR #6336 — CDC routing, integration tests to SparkMicroBatchStream](https://github.com/delta-io/delta/pull/6336)

  These stacked PRs suggest meaningful advancement toward **CDC-capable structured streaming via kernel-spark**, which would improve Delta’s streaming engine modularity and broaden support for change-data applications.

- **UC commit metrics / telemetry pipeline**
  - [PR #6155 — skeleton transport wiring and smoke tests](https://github.com/delta-io/delta/pull/6155)
  - [PR #6156 — full payload construction and schema tests](https://github.com/delta-io/delta/pull/6156)
  - [PR #6333 — feature flag and async dispatch](https://github.com/delta-io/delta/pull/6333)

  Together these indicate work on **commit observability and asynchronous metrics reporting**, likely aimed at better governance and performance insight in managed environments.

- **Branch/version progression**
  - [PR #6256 — Change master version to 4.2.0-SNAPSHOT](https://github.com/delta-io/delta/pull/6256)
  - [PR #6340 — Change branch version to 4.2.0-SNAPSHOT](https://github.com/delta-io/delta/pull/6340)

  These are strong signals that the project is **aligning development toward the 4.2.0 line**.

## 3. Community Hot Topics

> Note: the provided data does not include actual comment counts for PRs (“undefined”), and reactions are all 0, so “hot topics” are inferred from technical clustering and recency rather than measured discussion volume.

### A) Streaming CDC support in kernel-spark
- [PR #6075](https://github.com/delta-io/delta/pull/6075)
- [PR #6076](https://github.com/delta-io/delta/pull/6076)
- [PR #6336](https://github.com/delta-io/delta/pull/6336)

This is the clearest multi-PR theme in the current queue. The underlying technical need is support for **robust CDC semantics in SparkMicroBatchStream**, including both **initial snapshot and incremental change routing**. This matters for users building **incremental pipelines, replication, audit streams, and event-driven lakehouse architectures**.

### B) UC commit metrics instrumentation
- [PR #6155](https://github.com/delta-io/delta/pull/6155)
- [PR #6156](https://github.com/delta-io/delta/pull/6156)
- [PR #6333](https://github.com/delta-io/delta/pull/6333)

This cluster points to a demand for **better commit-level observability**, likely for Unity Catalog or managed governance environments. The technical need here is not end-user SQL syntax but **transport, payload schema, feature flags, and async dispatch for metrics**, implying a push toward more enterprise-grade operations insight.

### C) Streaming correctness under coordinated commits
- [PR #6338 — Add regression test for streaming data loss with coordinated commits](https://github.com/delta-io/delta/pull/6338)
- [Issue #6339 — [bug] [BUG]](https://github.com/delta-io/delta/issues/6339)

This is the most important stability topic of the day. It suggests users are hitting or at least validating against a **potential streaming data loss condition** when Delta streaming interacts with **Coordinated Commits** and certain backfill batch sizes. The technical need is strong correctness guarantees in advanced write/read coordination modes.

### D) Spark connector pushdown completeness
- [Issue #6326 — [Feature Request][Spark] Support LIMIT push-down in V2 connector](https://github.com/delta-io/delta/issues/6326)

This request reflects a classic analytical engine need: pushing more query operators down into the source layer to reduce scan cost and improve responsiveness. It signals continued demand for **DSv2/Spark connector optimization parity**.

## 4. Bugs & Stability

Ranked by likely severity from available information.

### 1) Potential streaming data loss with coordinated commits
- [Issue #6339 — [bug] [BUG]](https://github.com/delta-io/delta/issues/6339)
- Related fix/test PR: [PR #6338](https://github.com/delta-io/delta/pull/6338)

**Severity: Critical**

The linked regression test explicitly describes a **data loss bug** in Delta streaming when using **Coordinated Commits** with **non-trivial backfill batch sizes**. In analytical storage engines, any confirmed or suspected silent data loss is top-severity because it threatens correctness guarantees. The good sign is that a targeted regression test already exists, which usually precedes or accompanies a fix.

### 2) Variant stats preservation during DML with Deletion Vectors
- [PR #6329 — [SPARK] Fix preservation of variant stats during DML commands with Deletion Vectors enabled](https://github.com/delta-io/delta/pull/6329)

**Severity: High**

This open PR suggests that **statistics for Variant data may not be preserved correctly during DML when Deletion Vectors are enabled**. That can affect **query planning, pruning quality, and correctness of metadata-derived optimization behavior**. This is especially relevant as Variant support matures.

### 3) Path transformation issue in Snapshot
- [PR #6162 — [delta-metadata] [Spark] Remove path transformation from Snapshot](https://github.com/delta-io/delta/pull/6162)

**Severity: Medium**

The PR references a fix and argues that Snapshot should not transform paths. Path handling bugs often lead to **incorrect metadata resolution, storage interoperability issues, or cross-environment failures**, especially in cloud/object-store-heavy deployments.

### 4) Incremental commit disablement lacks visibility
- [PR #6327 — Add logging when incremental commit is silently disabled](https://github.com/delta-io/delta/pull/6327)

**Severity: Medium**

This is more of an **operability bug** than a correctness bug, but it matters in production. Silent fallback behavior makes performance anomalies and write-path changes difficult to diagnose.

## 5. Feature Requests & Roadmap Signals

### LIMIT push-down in Spark V2 connector
- [Issue #6326 — Support LIMIT push-down in V2 connector](https://github.com/delta-io/delta/issues/6326)

This is the clearest user-filed roadmap signal today. If implemented through Spark’s `SupportsPushDownLimit`, this would improve **latency for top-N / preview / BI-style exploratory queries** and better align Delta’s Spark connector with modern DSv2 optimization expectations.

### Likely near-term roadmap signals from PR activity

#### A) 4.2.0 development line
- [PR #6256](https://github.com/delta-io/delta/pull/6256)
- [PR #6340](https://github.com/delta-io/delta/pull/6340)

The version-bump PRs strongly suggest the project is now organizing active work toward **4.2.0**.

#### B) CDC streaming support in kernel-spark
- [PR #6075](https://github.com/delta-io/delta/pull/6075)
- [PR #6076](https://github.com/delta-io/delta/pull/6076)
- [PR #6336](https://github.com/delta-io/delta/pull/6336)

Given the breadth and test coverage being added, **CDC support in SparkMicroBatchStream** looks like one of the most plausible candidates for an upcoming version.

#### C) DSv2 writer stack maturation
- [PR #6231 — [DSv2] Add factory + transport: DataWriterFactory, BatchWrite](https://github.com/delta-io/delta/pull/6231)

This points toward continued investment in **DataSource V2 write-path architecture**, which could unlock cleaner Spark integration, better pushdowns, and future connector features.

#### D) Variant / semi-structured data support
- [PR #5718 — [KERNEL] Add collations table feature](https://github.com/delta-io/delta/pull/5718)
- [PR #6322](https://github.com/delta-io/delta/pull/6322)
- [PR #6329](https://github.com/delta-io/delta/pull/6329)

These suggest Delta continues to strengthen **semi-structured typing, collation, and metadata/statistics handling**.

### Prediction for next version
Most likely themes for the next visible release train:
1. **4.2.0 snapshot-based development**
2. **Kernel/Spark CDC streaming enhancements**
3. **DSv2 and Spark connector improvements**
4. **Operational observability improvements around commits/metrics**
5. **Continued Variant and protocol-spec refinement**

## 6. User Feedback Summary

Based on today’s issues and PRs, the most concrete user pain points are:

- **Streaming correctness under advanced coordination modes**
  - [PR #6338](https://github.com/delta-io/delta/pull/6338)
  - [Issue #6339](https://github.com/delta-io/delta/issues/6339)

  Users care deeply about correctness when enabling sophisticated features like Coordinated Commits. The fact that a regression test was contributed suggests this pain is real and reproducible.

- **Need for better Spark query optimization**
  - [Issue #6326](https://github.com/delta-io/delta/issues/6326)

  LIMIT pushdown requests usually come from users seeing unnecessary scan/read overhead in interactive or selective queries.

- **Metadata/path compatibility concerns**
  - [PR #6162](https://github.com/delta-io/delta/pull/6162)

  This indicates users or contributors are still encountering edge cases in path normalization or metadata interpretation.

- **Need for clearer operational signals**
  - [PR #6327](https://github.com/delta-io/delta/pull/6327)

  Operators want explicit logging when performance-related behaviors silently change.

There was **little direct positive/negative reaction data** in the supplied GitHub snapshot, so satisfaction signals are weak. However, the contributor focus suggests users are less concerned with surface-level UX and more concerned with **engine correctness, pushdown efficiency, and production observability**.

## 7. Backlog Watch

These older or strategically important items appear to merit maintainer attention:

### 1) Collations table feature in Kernel
- [PR #5718 — [KERNEL] Add collations table feature](https://github.com/delta-io/delta/pull/5718)
- Created: 2025-12-17

This is the oldest prominent PR in the list and likely touches **table feature semantics and cross-engine string/collation behavior**. Given the rise of SQL compatibility demands, this deserves attention.

### 2) Kernel-spark CDC stack
- [PR #6075](https://github.com/delta-io/delta/pull/6075)
- [PR #6076](https://github.com/delta-io/delta/pull/6076)
- [PR #6336](https://github.com/delta-io/delta/pull/6336)

This stack is important and appears active, but because it spans multiple layered PRs, it may benefit from focused maintainer review to avoid drift. CDC streaming is strategically high-value.

### 3) UC Commit Metrics stacked PR chain
- [PR #6155](https://github.com/delta-io/delta/pull/6155)
- [PR #6156](https://github.com/delta-io/delta/pull/6156)
- [PR #6333](https://github.com/delta-io/delta/pull/6333)

This is another stacked sequence that likely needs coordinated review. Since it introduces **feature flags, transport wiring, schema tests, and async dispatch**, unresolved review here could bottleneck observability work.

### 4) Snapshot path handling fix
- [PR #6162 — Remove path transformation from Snapshot](https://github.com/delta-io/delta/pull/6162)

Metadata/path correctness fixes tend to have outsized downstream impact, especially across storage backends. This looks important enough not to linger.

### 5) DSv2 writer transport/factory work
- [PR #6231 — [DSv2] Add factory + transport: DataWriterFactory, BatchWrite](https://github.com/delta-io/delta/pull/6231)

This appears foundational for future connector and Spark V2 behavior. If delayed, related optimizer and connector enhancements may also stall.

---

## Bottom Line

Delta Lake had an **active engineering day with no release event**, dominated by **streaming CDC work, observability plumbing, Spark/DSv2 evolution, and correctness testing**. The most urgent concern is a **potential streaming data loss bug tied to Coordinated Commits** ([Issue #6339](https://github.com/delta-io/delta/issues/6339), [PR #6338](https://github.com/delta-io/delta/pull/6338)). The strongest roadmap signals point toward **4.2.0**, with likely emphasis on **kernel-spark CDC, DSv2 capabilities, and operational metrics**. Overall health remains **good but correctness-sensitive**, with several important stacked PRs needing sustained maintainer attention.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-21

## 1. Today's Overview
Databend showed moderate engineering activity over the last 24 hours, with **10 pull requests updated** and **2 active issues**, but **no new release published**. The day’s work was concentrated on **query correctness and crash prevention**, alongside ongoing **storage-layer refactors** and **SQL planner improvements**. The strongest immediate signal is a fast response to a newly reported **recursive view crash**, with a fix PR opened the next day. Overall, project health looks **actively maintained and responsive**, with current work split between **stability fixes**, **optimizer/planner cleanup**, and **storage architecture evolution**.

## 2. Project Progress

### Closed or completed PR activity
Although no release landed today, several PRs were closed, indicating progress in query compatibility, testing, and optimizer cleanup:

- [#19580](https://github.com/databendlabs/databend/pull/19580) **feat: rename TSV to TEXT**
  - Advances SQL/file-format compatibility by standardizing on **TEXT** terminology while keeping **TSV as a compatibility alias**.
  - Also changes unload defaults toward `.txt` suffixes, which suggests a user-facing cleanup for data export semantics.

- [#19582](https://github.com/databendlabs/databend/pull/19582) **chore: migrate duckdb sql logic test**
  - Strengthens SQL correctness validation by importing or aligning with **DuckDB SQL logic tests**.
  - This is a useful signal that Databend continues investing in broader SQL behavioral compatibility and regression detection.

- [#19559](https://github.com/databendlabs/databend/pull/19559) **refactor(sql): improve eager aggregation rewrites**
  - Improves internal optimizer structure by separating parsing, candidate assignment, and rewrite generation for eager aggregation rules.
  - While refactor-heavy, this likely lowers risk for future optimizer enhancements and improves maintainability of aggregation rewrites.

### Notable open progress that may land soon
- [#19584](https://github.com/databendlabs/databend/pull/19584) **fix(query): avoid create or alter recursive views**
  - Immediate mitigation for a crash-class bug in recursive views.
- [#19577](https://github.com/databendlabs/databend/pull/19577) **fix(storage): split oversized compact blocks during recluster**
  - Important storage safeguard to prevent oversized blocks after sorting/compaction in recluster workflows.
- [#19567](https://github.com/databendlabs/databend/pull/19567) **refactor(sql): improve agg index rewrite matching**
  - Replaces string-based rewrite matching with **structural expression matching**, a strong correctness and maintainability improvement.
- [#19576](https://github.com/databendlabs/databend/pull/19576) **refactor(storage): extract fuse block format abstraction**
  - A meaningful storage-engine refactor that unifies native/parquet read paths and may unlock cleaner future format handling.
- [#19549](https://github.com/databendlabs/databend/pull/19549) **feat(query): support experimental table tags for FUSE table snapshots**
  - Signals ongoing productization of snapshot/versioning semantics for FUSE tables via a new KV-backed table tag model.

## 3. Community Hot Topics

There was little visible discussion volume today—both issues had **0 comments** and PR metadata shows no notable reactions. Still, a few items stand out based on technical importance rather than community engagement.

### Top issue: recursive view crash
- [#19572](https://github.com/databendlabs/databend/issues/19572) **bug: recursive views can crash `databend-query`**
  - A recursively defined view can trigger a **SIGSEGV**, which is one of the most serious classes of runtime failures.
  - The immediate appearance of [#19584](https://github.com/databendlabs/databend/pull/19584) strongly suggests maintainers treat this as a high-priority correctness/stability issue.
  - Underlying technical need: stronger **semantic validation and cycle detection** during view definition or planning, before execution reaches unsafe recursion paths.

### Top issue: parser assertion failure
- [#19578](https://github.com/databendlabs/databend/issues/19578) **[issue-claw] parse assertion failed**
  - The report points to a parser assertion involving `UNION` nesting/normalization behavior.
  - This indicates a likely **AST/parser equivalence or formatting mismatch**, potentially exposed by fuzzing or automated issue mining.
  - Underlying technical need: improved parser robustness, especially for **set-operation associativity and normalization invariants**.

### Strategic PR topic: storage and snapshot semantics
- [#19549](https://github.com/databendlabs/databend/pull/19549) **experimental table tags for FUSE snapshots**
- [#19576](https://github.com/databendlabs/databend/pull/19576) **Fuse block format abstraction**
- [#19577](https://github.com/databendlabs/databend/pull/19577) **oversized block split during recluster**
  - Together these show sustained attention to **FUSE storage internals**, including metadata/versioning, read-path abstraction, and block-size correctness in maintenance operations.

## 4. Bugs & Stability

Ranked by severity:

### 1) Critical — recursive view can crash query service
- Issue: [#19572](https://github.com/databendlabs/databend/issues/19572)
- Fix PR: [#19584](https://github.com/databendlabs/databend/pull/19584)
- Severity rationale:
  - Causes **`SIGSEGV` crash** in `databend-query`
  - Affects service stability, not just query correctness
  - Could be triggered by malformed or recursive object definitions
- Current trajectory:
  - Mitigation appears to be **blocking create/alter of recursive views**, which is a practical short-term safety fix.

### 2) High — parser assertion failure on nested UNION
- Issue: [#19578](https://github.com/databendlabs/databend/issues/19578)
- Fix PR: none visible yet
- Severity rationale:
  - Assertion failures indicate internal invariants are being violated.
  - Depending on exposure path, this can mean either a query rejection bug or a crash/panic in parser processing.
- Technical implication:
  - Likely affects **query parsing correctness**, especially around nested set expressions and AST canonicalization.

### 3) Medium — unload option compatibility conflict
- PR: [#19583](https://github.com/databendlabs/databend/pull/19583)
- Problem:
  - `include_query_id=true` and `use_raw_path=true` are logically conflicting, but prior behavior apparently lacked validation.
- Severity rationale:
  - Less severe than a crash, but important for **export behavior consistency** and backward compatibility.
- Notable nuance:
  - The PR title suggests Databend may allow this combination for compatibility rather than strictly reject it, implying maintainers are balancing correctness with non-breaking behavior.

### 4) Medium — recluster may produce oversized compact blocks
- PR: [#19577](https://github.com/databendlabs/databend/pull/19577)
- Problem:
  - Recluster sort/compaction path can produce blocks exceeding desired size constraints.
- Severity rationale:
  - Primarily a **storage correctness/performance hygiene** issue rather than immediate user-visible failure, but important for long-term read/write efficiency and maintenance stability.

## 5. Feature Requests & Roadmap Signals

No explicit user feature-request issue was updated today, but current PRs provide strong roadmap signals:

### Likely near-term features
- [#19549](https://github.com/databendlabs/databend/pull/19549) **experimental table tags for FUSE table snapshots**
  - Strong signal toward richer **time-travel / snapshot labeling / branch-like data management** capabilities.
  - Because it is marked experimental and introduces a **new KV-backed model**, this looks like a significant upcoming feature area.

### SQL compatibility and semantics
- [#19580](https://github.com/databendlabs/databend/pull/19580) **rename TSV to TEXT**
  - Suggests Databend is refining SQL and unload surface area to better match user expectations and broader data ecosystem language.
- [#19582](https://github.com/databendlabs/databend/pull/19582) **duckdb sql logic test migration**
  - Indicates future versions may continue to improve **cross-engine SQL behavior parity**.

### Optimizer/planner roadmap
- [#19567](https://github.com/databendlabs/databend/pull/19567) **agg index rewrite matching**
- [#19579](https://github.com/databendlabs/databend/pull/19579) **Aggr bind**
- [#19559](https://github.com/databendlabs/databend/pull/19559) **eager aggregation rewrites**
  - These together point to continuing investment in **aggregation planning**, **rewrite robustness**, and **index-assisted optimization**.
  - Expect next versions to improve **query planning reliability** more than expose flashy new SQL syntax.

### Prediction for next version
Most likely to appear or mature soon:
1. Safer handling of **recursive view definitions**
2. More reliable **aggregation rewrites/index matching**
3. Incremental rollout of **FUSE snapshot tags**
4. Continued SQL compatibility polish around **TEXT/TSV unload semantics**

## 6. User Feedback Summary

Based on the latest issues and PRs, current user pain points are concentrated in four areas:

- **Crash safety in edge-case SQL objects**
  - [#19572](https://github.com/databendlabs/databend/issues/19572) shows users can still hit severe failures from recursive metadata definitions.
- **Parser robustness**
  - [#19578](https://github.com/databendlabs/databend/issues/19578) suggests fuzz- or edge-generated SQL can still break parser assumptions.
- **Export/unload compatibility**
  - [#19583](https://github.com/databendlabs/databend/pull/19583) and [#19580](https://github.com/databendlabs/databend/pull/19580) indicate users care about predictable unload options and familiar format naming.
- **Storage maintenance correctness**
  - [#19577](https://github.com/databendlabs/databend/pull/19577) reflects operational concerns around recluster behavior and block-size management.

Positive signal:
- Maintainers appear responsive when high-severity bugs are reported, especially for crash-class issues.

Less visible today:
- No strong evidence of user-reported benchmark wins, satisfaction notes, or performance praise in the provided data.
- No connector or external integration demand surfaced in this 24-hour slice.

## 7. Backlog Watch

These items deserve maintainer attention due to risk, scope, or strategic importance:

### High-priority open issues
- [#19572](https://github.com/databendlabs/databend/issues/19572) **recursive views can crash `databend-query`**
  - Already addressed by [#19584](https://github.com/databendlabs/databend/pull/19584), but should be tracked through merge and regression testing.
- [#19578](https://github.com/databendlabs/databend/issues/19578) **parse assertion failed**
  - No visible fix PR yet; parser assertion bugs often hide broader normalization problems.

### Important open PRs needing review/merge
- [#19549](https://github.com/databendlabs/databend/pull/19549) **experimental table tags for FUSE snapshots**
  - Larger feature work with architectural implications; likely needs careful review.
- [#19576](https://github.com/databendlabs/databend/pull/19576) **Fuse block format abstraction**
  - Foundational refactor; delays here can slow storage-path simplification work.
- [#19577](https://github.com/databendlabs/databend/pull/19577) **split oversized compact blocks during recluster**
  - Important for storage correctness and operational predictability.
- [#19567](https://github.com/databendlabs/databend/pull/19567) and [#19579](https://github.com/databendlabs/databend/pull/19579)
  - Both touch SQL planner/aggregation internals; review throughput here affects optimizer progress.

## 8. Overall Health Assessment
Databend’s current development cadence looks healthy: maintainers are addressing **critical stability defects quickly** while continuing to invest in **query optimizer internals** and **FUSE storage evolution**. The biggest short-term risk remains **query-service stability around pathological SQL/view definitions** and **parser edge cases**. The strongest medium-term product signal is around **snapshot/tag management for FUSE tables** and more robust **aggregation optimization infrastructure**.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-21

## 1) Today’s Overview

Velox showed **high pull-request activity** over the last 24 hours, with **50 PRs updated** and **15 PRs merged/closed**, while issue volume stayed low at **4 active issues** and **no closures**. The work stream is concentrated around **GPU/cuDF execution**, **build and CI reliability**, **Hive/Nimble/Parquet integration**, and a few **query correctness/stability fixes**. Overall, project health looks strong from a throughput perspective: maintainers are landing incremental improvements quickly, but there are also signs of ongoing churn in dependency and API surfaces, especially around **VectorSerde**, **CUDA synchronization**, and **build toolchains**. No release was cut today, suggesting the repository is in an active integration phase rather than a packaging phase.

---

## 3) Project Progress

### Merged/closed PRs today

#### 1. File-format observability improved
- **PR #16862 — feat: Add fileformat runtime stats**  
  Link: https://github.com/facebookincubator/velox/pull/16862  
  This merged change adds runtime statistics that count splits by file format, such as DWRF, Parquet, and Nimble. This is a meaningful observability improvement for production query analysis because mixed-format reads are otherwise hard to diagnose. It should help operators understand storage-layer behavior and investigate scan-path inefficiencies faster.

#### 2. Hive writer code quality improved
- **PR #16863 — refactor(hive): Extract JSON field name constants in HiveDataSink**  
  Link: https://github.com/facebookincubator/velox/pull/16863  
  This is a refactoring-only change, but still useful for maintainability and SQL engine consistency. Pulling hardcoded JSON field names into scoped constants reduces the chance of drift from Presto Java behavior and makes Hive sink code easier to audit.

#### 3. VectorSerde API change was reverted after downstream breakage
- **PR #16860 — fix: Back out removal of `VectorSerde::kind()`**  
  Link: https://github.com/facebookincubator/velox/pull/16860  
  This merged revert is the most notable stability event today. A prior refactor removing `VectorSerde::kind()` caused **downstream Axiom CI failures**, and maintainers chose to back it out rather than force ecosystem migration immediately. This indicates Velox remains sensitive to serializer API compatibility and that maintainers are prioritizing ecosystem stability over aggressive cleanup.

#### 4. Additional stale closure
- **PR #15777 — feat: Update FB_OS_VERSION**  
  Link: https://github.com/facebookincubator/velox/pull/15777  
  This older PR was closed as stale rather than representing active feature progress.

### What this advances overall
Today’s merged work primarily advanced:
- **Execution/runtime observability** via file-format stats
- **Hive sink maintainability**
- **Platform stability and downstream compatibility** through serializer API rollback

The net effect is less about new user-facing SQL functionality and more about making Velox easier to operate, integrate, and keep green in dependent projects.

---

## 4) Community Hot Topics

### 1. FBThrift support in Parquet, removing thrift dependency
- **Issue #13175 — Add support for FBThrift in Parquet and remove thrift dependency**  
  Link: https://github.com/facebookincubator/velox/issues/13175  
  This is the most visibly discussed open issue in the provided set, with **7 comments** and a long tail from earlier discussion. The underlying need is architectural: Velox’s native Parquet reader still depends on thrift, and users want tighter integration with Meta’s broader stack and potentially a cleaner path for **remote function execution** or other services using FBThrift. This is a dependency-reduction and ecosystem-alignment request, not just a cosmetic refactor.

### 2. cuDF runtime statistics are inaccurate for async GPU work
- **Issue #16722 — Add accurate runtime statistics for cudf operators**  
  Link: https://github.com/facebookincubator/velox/issues/16722  
  This reflects a major instrumentation gap in GPU execution. Velox’s timing model assumes CPU-bound synchronous work, but cuDF operators often enqueue work asynchronously on CUDA streams. The technical need here is clear: without proper synchronization-aware accounting, performance stats mislead users and make GPU regressions difficult to diagnose.

### 3. GPU decimal support remains a major development theme
- **PR #16750 — feat(cudf): GPU Decimal (Part 2 of 3)**  
  Link: https://github.com/facebookincubator/velox/pull/16750  
- **PR #16751 — feat(cudf): GPU Decimal (Part 3 of 3)**  
  Link: https://github.com/facebookincubator/velox/pull/16751  
These linked PRs show that GPU decimal support is a strategic investment area. Decimal correctness and aggregate support such as **SUM/AVG** are essential for BI and finance-like workloads, so this work is a strong signal that Velox’s GPU engine is moving beyond experimental toy coverage toward broader SQL completeness.

### 4. Build performance and portability remain active concerns
- **PR #16836 — Use mold linker for ubuntu-debug GitHub builds**  
  Link: https://github.com/facebookincubator/velox/pull/16836  
- **PR #16817 — Register /usr/local/lib64 with ldconfig after gflags install on CentOS 9**  
  Link: https://github.com/facebookincubator/velox/pull/16817  
- **PR #16650 — Upgrade Velox DuckDB from 0.8.1 to 1.4.4**  
  Link: https://github.com/facebookincubator/velox/pull/16650  
These changes point to a strong maintainer focus on **toolchain modernization**, **CI speed**, and **packaging reliability**. This matters because Velox sits in a large dependency graph where friction in builds directly slows adoption.

---

## 5) Bugs & Stability

### Ranked by severity

#### High severity: query correctness regression in JSON path wildcard handling
- **Issue #16855 — `get_json_object` returns wrong results for `[*]` wildcard paths with simdjson ≥ 4.0**  
  Link: https://github.com/facebookincubator/velox/issues/16855  
This is the most severe new bug in today’s issue list because it is a **query correctness** problem affecting SQL behavior and compatibility tests. It impacts Hive/Spark SQL compatibility paths and appears version-sensitive to **simdjson 4.0+**, which raises the possibility of dependency-induced semantic regressions. No fix PR is listed in the provided data yet.

#### High severity: debug crash in HashProbe filter evaluation for ANTI joins
- **PR #16868 — fix: Skip filter evaluation in HashProbe when no rows are selected**  
  Link: https://github.com/facebookincubator/velox/pull/16868  
This open PR addresses a **debug-only sanity check failure/crash** involving `DictionaryVector::validate` during `HashProbe::evalFilter`, specifically for **ANTI joins** with probe-side join-key filter references. While debug-only reduces production severity, join-path crashes are serious because they often reveal subtle row-selection or vector-wrapping invariants that can mask deeper correctness issues.

#### Medium-high severity: CUDA stream race/synchronization bugs
- **PR #16866 — fix(cudf): Improve stream synchronization in barrier operators**  
  Link: https://github.com/facebookincubator/velox/pull/16866  
This addresses stream ordering and ownership issues in GPU execution. These problems can lead to flaky behavior, bad timing, or potentially incorrect results depending on how buffers and split operations race across streams. Given ongoing GPU expansion, this is an important stabilization PR.

#### Medium severity: intermittent CUDF string CONCAT failure
- **PR #16824 — fix(cudf): Fix intermittent failure with new CUDF string CONCAT(VARCHAR)**  
  Link: https://github.com/facebookincubator/velox/pull/16824  
The issue is intermittent and tied to construction of an empty separator string scalar. It looks localized, but intermittent failures are especially painful in CI and can erode confidence in new GPU string function coverage.

#### Medium severity: buffered input path bug in hybrid GPU scan
- **PR #16732 — fix(cudf): Use `enqueueForDevice` for cudf buffered input data source**  
  Link: https://github.com/facebookincubator/velox/pull/16732  
This suggests a prior regression or incomplete wiring in the experimental hybrid scan reader. It affects data movement semantics on device and is important for anyone validating GPU scan pipelines.

#### Medium severity: dependency/API compatibility regression
- **PR #16860 — merged revert of `VectorSerde::kind()` removal**  
  Link: https://github.com/facebookincubator/velox/pull/16860  
- **PR #16865 — open follow-up revert/backout**  
  Link: https://github.com/facebookincubator/velox/pull/16865  
This is not an end-user query bug, but it is a meaningful ecosystem stability event. Downstream breakage from serializer API changes can stall upgrades and fragment integration efforts.

---

## 6) Feature Requests & Roadmap Signals

### 1. HashAggregation task barrier support
- **Issue #16856 — Add task barrier support for HashAggregation**  
  Link: https://github.com/facebookincubator/velox/issues/16856  
This is a clear performance-oriented feature request coming from a practical use case in **Gluten** for writing file statistics. The goal is to remove task initialization overhead for local-aggregation-only tasks. Because it has a concrete downstream use case and links to prior PR discussion, it looks like a plausible candidate for near-term implementation.

### 2. Better GPU observability
- **Issue #16722 — accurate runtime statistics for cudf operators**  
  Link: https://github.com/facebookincubator/velox/issues/16722  
This is both an enhancement request and a roadmap signal. As GPU execution broadens, accurate stream-aware metrics will become essential. Expect follow-on work in runtime stats, synchronization accounting, and possibly operator-level GPU telemetry in a future release.

### 3. Expanded GPU SQL coverage
- **PR #16750 — GPU Decimal Part 2**  
  Link: https://github.com/facebookincubator/velox/pull/16750  
- **PR #16751 — GPU Decimal Part 3**  
  Link: https://github.com/facebookincubator/velox/pull/16751  
- **PR #16825 — Add unit tests for CUDF string functions**  
  Link: https://github.com/facebookincubator/velox/pull/16825  
This cluster strongly suggests that the next significant Velox milestone may include materially better **GPU SQL compatibility**, especially for **decimal arithmetic/aggregates** and **string functions**.

### 4. Storage-format and reader flexibility
- **PR #16820 — Add flatmap-as-struct support into HiveIndexReader**  
  Link: https://github.com/facebookincubator/velox/pull/16820  
- **Issue #13175 — FBThrift in Parquet**  
  Link: https://github.com/facebookincubator/velox/issues/13175  
These indicate continued investment in **complex types**, **physical/logical schema reconciliation**, and **Parquet dependency modernization**.

### Likely next-version candidates
Based on current momentum, the most likely near-term inclusions are:
- cuDF stability fixes and broader function coverage
- runtime/observability improvements
- build/CI modernization
- Hive/Nimble reader edge-case support

---

## 7) User Feedback Summary

The practical pain points visible today are fairly consistent:

- **Users care about correctness over raw feature count.**  
  The new `get_json_object` wildcard regression shows that SQL compatibility remains a top expectation, especially for users comparing behavior against Hive/Spark semantics.
  - Issue: https://github.com/facebookincubator/velox/issues/16855

- **GPU users need trustworthy metrics and stable async execution.**  
  Multiple cuDF items reveal that users are actively trying to run real workloads, not just synthetic demos. Their main complaints are around **incorrect runtime stats**, **stream synchronization**, and **intermittent function failures**.
  - Issue #16722: https://github.com/facebookincubator/velox/issues/16722
  - PR #16866: https://github.com/facebookincubator/velox/pull/16866
  - PR #16824: https://github.com/facebookincubator/velox/pull/16824

- **Downstream integrators are sensitive to API churn.**  
  The serializer API revert shows that ecosystem consumers need compatibility and migration stability, especially when Velox is embedded in larger systems.
  - PR #16860: https://github.com/facebookincubator/velox/pull/16860

- **Operational visibility is increasingly important.**  
  The merged file-format runtime stats feature suggests users want better production debugging and workload introspection.
  - PR #16862: https://github.com/facebookincubator/velox/pull/16862

Overall sentiment from the data is that users are pushing Velox in more demanding environments: mixed file formats, GPU execution, downstream embeddings, and compatibility-sensitive SQL workloads.

---

## 8) Backlog Watch

### Important older items needing attention

#### 1. Parquet thrift dependency removal / FBThrift support
- **Issue #13175**  
  Link: https://github.com/facebookincubator/velox/issues/13175  
Created in 2025-04 and still active, this is the clearest long-lived architectural backlog item in the provided data. It touches dependency hygiene, Parquet internals, and broader integration strategy. Because it has discussion history and cross-cutting implications, it likely needs explicit maintainer direction rather than organic drive-by contributions.

#### 2. DuckDB upgrade remains open
- **PR #16650 — Upgrade Velox DuckDB from 0.8.1 to 1.4.4**  
  Link: https://github.com/facebookincubator/velox/pull/16650  
This is a substantial dependency upgrade that has been open since 2026-03-05. Given the scale of the version jump, it likely needs careful review for API compatibility and test fallout. It is strategically important because stale embedded dependencies can become a source of incompatibility and security or maintenance drag.

#### 3. cuDF config refactor still open
- **PR #16535 — Separate cuDF query and system configs**  
  Link: https://github.com/facebookincubator/velox/pull/16535  
This has been open since 2026-02-25 and appears foundational for making GPU execution configurable per session/query. That makes it more than a refactor: it is enabling infrastructure for multi-tenant or differentiated workload control. It likely deserves maintainers’ attention because many future GPU features may build on it.

#### 4. GPU decimal series still in flight
- **PR #16750 / #16751**  
  Links:  
  - https://github.com/facebookincubator/velox/pull/16750  
  - https://github.com/facebookincubator/velox/pull/16751  
These are active, high-value feature PRs and should remain on watch because they affect SQL completeness and GPU adoption. The fact that they are split across multiple parts suggests review complexity.

---

## Bottom line

Velox had a **busy and healthy integration day**, with substantial movement in **GPU enablement**, **build reliability**, and **engine observability**. The most important immediate risk is a new **JSON wildcard correctness regression** and the ongoing need to stabilize **async GPU execution semantics**. The strongest roadmap signals point toward **better cuDF support, richer runtime stats, and continued storage/reader compatibility work**, while long-lived dependency and API issues still need deliberate maintainer attention.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-21

## 1. Today's Overview

Apache Gluten remained highly active over the last 24 hours, with **20 pull requests updated** and **7 issues updated**, indicating strong ongoing engineering throughput despite **no new releases**. The day’s work centered on **Velox backend compatibility**, **Spark 4.x test correctness**, **Parquet/variant support**, and **performance optimization** in both scan and shuffle paths. Maintainers and contributors also appear to be spending meaningful effort on **stability hardening**, especially around test validity, native writer correctness, and edge-case Spark semantics. Overall, project health looks **active but still integration-heavy**, with a notable share of work focused on closing correctness and compatibility gaps before broader feature expansion.

## 2. Project Progress

### Merged/closed PRs today

#### 1) Enable Variant test suites for Velox backend
- PR: [#11726](https://github.com/apache/incubator-gluten/pull/11726)
- Status: Closed
- Area: Velox / SQL compatibility / Spark 4.0 & 4.1 testing

This change advanced Gluten’s support for Spark’s **variant-related test coverage** by enabling variant end-to-end and shredding suites for both Spark 4.0 and 4.1. That is an important step toward better compatibility with newer Spark data semantics, especially for semi-structured and variant-oriented processing. It also signals that the Velox backend is being pushed closer to parity on modern Spark type behaviors.

#### 2) Fix PlanStability test suites for Velox backend
- PR: [#11799](https://github.com/apache/incubator-gluten/pull/11799)
- Status: Closed
- Area: Test correctness / Spark 4.x infrastructure

This PR corrected a significant testing flaw: some suites were passing without actually loading the Gluten plugin, meaning they were effectively validating **vanilla Spark**, not Gluten. This is not a feature addition, but it is a major quality improvement because it restores confidence in regression coverage and reported compatibility status.

#### 3) Fix multi-key DPP support in ColumnarSubqueryBroadcastExec
- PR: [#11795](https://github.com/apache/incubator-gluten/pull/11795)
- Status: Closed
- Area: Query planning / Dynamic Partition Pruning

This addressed a correctness gap in **multi-key dynamic partition pruning** by fixing handling that previously only used the first filtering key. That improves planner correctness for more complex joins and pruning scenarios, and should benefit workloads with composite partition keys.

#### 4) Reuse byte[] buffers in shuffle read and broadcast serialization paths
- PR: [#11777](https://github.com/apache/incubator-gluten/pull/11777)
- Status: Closed
- Area: Shuffle / memory efficiency / serialization

This optimization reduces repeated temporary `byte[]` allocation in read and broadcast paths. It is a classic but meaningful JVM-side optimization that can lower allocation pressure, reduce GC overhead, and improve throughput under shuffle-heavy or broadcast-heavy analytical workloads.

#### 5) Delta write fallback offload PR closed as stale
- PR: [#11479](https://github.com/apache/incubator-gluten/pull/11479)
- Status: Closed as stale
- Area: Delta write path

This is not progress in functionality, but it is a signal that **Delta write offload** remains unfinished or deprioritized in current activity.

## 3. Community Hot Topics

### 1) Velox upstream gap tracker
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)
- Comments: 16, Reactions: 4

This is the most active issue in the set and tracks useful Velox PRs submitted largely by the Gluten community but not yet merged upstream. The technical need behind it is clear: Gluten depends heavily on Velox, and **upstream lag is directly affecting Gluten’s feature velocity and maintenance cost**. This issue reflects a recurring structural challenge for projects built atop fast-moving execution backends—whether to carry patches downstream, rebase continuously, or wait for upstream convergence.

### 2) Severe slowdown on simple `SELECT ... LIMIT`
- Issue: [#11766](https://github.com/apache/incubator-gluten/issues/11766)
- Comments: 6
- Related PR: [#11802](https://github.com/apache/incubator-gluten/pull/11802)

A report that Gluten is **10x slower than vanilla Spark** on a trivial `select * ... limit 10` query is one of the most important user-facing topics. This points to a classic analytical-engine issue: acceleration layers can underperform badly on **small-result, low-latency, short-circuit workloads** if execution paths are optimized mainly for large scans and batch processing. The linked PR to implement `executeCollect()` in `ColumnarCollectLimitExec` suggests maintainers are already moving toward a targeted fix.

### 3) Spark 4.x disabled test suite tracker
- Issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550)
- Comments: 6
- Related PRs: [#11800](https://github.com/apache/incubator-gluten/pull/11800), [#11799](https://github.com/apache/incubator-gluten/pull/11799)

This tracker remains a strong roadmap signal that **Spark 4.x enablement is still in-progress**, especially on the Velox backend. The recent PR activity shows maintainers are cleaning up false-positive test coverage and re-enabling suites carefully rather than claiming premature compatibility.

### 4) TIMESTAMP_NTZ support
- Issue: [#11622](https://github.com/apache/incubator-gluten/issues/11622)
- Comments: 5, Reactions: 2
- Related PR: [#11626](https://github.com/apache/incubator-gluten/pull/11626)

This is an important SQL type compatibility topic. `TIMESTAMP_NTZ` support matters for users adopting newer Spark semantics and modern warehouse interoperability. The issue and PR indicate this work is progressing from type support toward planner/runtime completion.

## 4. Bugs & Stability

Ranked by likely severity and user impact:

### Critical: Query performance regression on simple LIMIT queries
- Issue: [#11766](https://github.com/apache/incubator-gluten/issues/11766)
- Fix PR in progress: [#11802](https://github.com/apache/incubator-gluten/pull/11802)

A **10x slowdown versus vanilla Spark** on a basic `select * limit 10` is highly visible and potentially adoption-blocking. Even if Gluten performs well on large scans, poor behavior on interactive or exploratory queries hurts real-world usability. The existence of an immediate follow-up PR is a positive sign.

### High: Parquet writer marks all struct fields OPTIONAL, breaking Spark variant type
- Issue: [#11803](https://github.com/apache/incubator-gluten/issues/11803)
- Related work: [#11788](https://github.com/apache/incubator-gluten/pull/11788)

This is a **query correctness / data format correctness** issue in the native Parquet writer. If Spark-required field nullability is lost and all struct fields become nullable, variant binary validation breaks. This is serious because it affects **written data correctness and interoperability**, not just runtime performance. The nearby PR expanding native complex-type Parquet writing may accelerate capability, but it may also raise urgency for schema fidelity fixes.

### Medium-High: `finalizeS3FileSystem` never called
- Issue: [#11796](https://github.com/apache/incubator-gluten/issues/11796)

This appears to be a **resource lifecycle / teardown bug** involving AWS SDK C++ and Velox static filesystem objects. Risks likely include process shutdown issues, resource leakage, or undefined cleanup behavior in long-lived services and test environments. No fix PR is listed yet, so this likely needs maintainer attention.

### Medium: Spark 4.x tests previously running without Gluten plugin
- Issue tracker: [#11550](https://github.com/apache/incubator-gluten/issues/11550)
- Fix PRs: [#11799](https://github.com/apache/incubator-gluten/pull/11799), [#11800](https://github.com/apache/incubator-gluten/pull/11800)

This is a **test infrastructure correctness** issue rather than a direct runtime bug, but it is important because it can conceal regressions and overstate compatibility readiness.

## 5. Feature Requests & Roadmap Signals

### TIMESTAMP_NTZ support is likely to land soon
- Issue: [#11622](https://github.com/apache/incubator-gluten/issues/11622)
- PR: [#11626](https://github.com/apache/incubator-gluten/pull/11626)

This looks like one of the clearest near-term feature candidates. Basic support is already under active implementation, and the issue is framed as a structured checklist. This makes it a strong candidate for inclusion in the next release cycle.

### Kafka read support for Velox backend
- PR: [#11801](https://github.com/apache/incubator-gluten/pull/11801)

This is an important connector-level roadmap signal. If completed, it would broaden Gluten’s applicability for streaming-adjacent or ingestion-centric workloads and improve parity for users who expect more than file-based scans.

### Native Parquet write for complex types
- PR: [#11788](https://github.com/apache/incubator-gluten/pull/11788)
- Related issue: [#11803](https://github.com/apache/incubator-gluten/issues/11803)

Support for Struct/Array/Map writes is strategically important for data lake compatibility. However, the simultaneous correctness issue on nullability shows this feature area is still maturing. Expect ongoing follow-up work before this becomes fully production-comfortable.

### GPU shuffle reader decompression improvements
- PR: [#11780](https://github.com/apache/incubator-gluten/pull/11780)

Multi-threaded decompression in the GPU shuffle reader points to continued investment in high-performance execution paths. This is a signal that Gluten’s roadmap still includes **deep runtime optimization**, not only compatibility cleanup.

### Shuffle-level dynamic filtering/pruning infrastructure
- PR: [#11769](https://github.com/apache/incubator-gluten/pull/11769)

Writing per-block column statistics in the shuffle writer is a strong architectural signal. It suggests future work around **block-level pruning**, **dynamic filter pushdown**, and reducing shuffle read amplification.

## 6. User Feedback Summary

The clearest user pain point today is that **Gluten can still underperform vanilla Spark on simple, latency-sensitive queries**, as shown in [#11766](https://github.com/apache/incubator-gluten/issues/11766). This suggests that while Gluten is optimized for analytical acceleration, some short-query execution paths remain insufficiently specialized.

Users are also clearly pushing on **Spark 4.x compatibility**, including variant types and `TIMESTAMP_NTZ`, which indicates adoption pressure from newer Spark deployments rather than only legacy compatibility concerns. In addition, native writer correctness and schema fidelity—especially for complex and variant-related Parquet output—are emerging as real usability constraints.

Overall sentiment from the issue mix suggests users value Gluten’s acceleration potential, but they still need:
- more predictable performance on small queries,
- stronger type compatibility with modern Spark,
- confidence that native writes preserve Spark semantics,
- and fewer backend-specific edge cases around S3 and test coverage.

## 7. Backlog Watch

These older or strategically important items deserve maintainer attention:

### Long-running architectural/performance PRs
- [#10543](https://github.com/apache/incubator-gluten/pull/10543) — Improve `InputIteratorTransformer`
- [#10573](https://github.com/apache/incubator-gluten/pull/10573) — Avoid repeated calls to `identifiyBatchType`
- [#10553](https://github.com/apache/incubator-gluten/pull/10553) — Simplify `StrictRule` and remove unnecessary `DummyLeafExec`

These have been open since August 2025 and are still active. They appear performance-oriented and may offer meaningful planner/runtime wins, but their age suggests review bandwidth or prioritization constraints.

### Bolt backend work remains WIP
- [#11261](https://github.com/apache/incubator-gluten/pull/11261) — WIP add bolt backend in gluten

This is a major scope item spanning core, build, infra, docs, and backend surfaces. Its breadth alone makes it high-risk for stagnation without dedicated maintainer sponsorship.

### Stale but still relevant correctness patch
- [#11538](https://github.com/apache/incubator-gluten/pull/11538) — Copy tags when local sort node is added

Tagged stale, but the described behavior could affect planning metadata integrity. It may be worth a maintainer decision: merge, request refresh, or close with explicit rationale.

### Velox upstream dependency tracker
- [#11585](https://github.com/apache/incubator-gluten/issues/11585)

This remains strategically important because unresolved upstream Velox PRs can continue to slow Gluten feature completion and increase downstream maintenance burden.

---

## Bottom Line

Apache Gluten is showing **strong development velocity**, but the current cycle is dominated by **integration quality**: Spark 4.x enablement, Velox parity, native writer correctness, and performance fixes for edge-case workloads. The project appears healthy and responsive, especially where user-reported regressions already have linked PRs. The main caution is that several visible issues still affect **trust and production-readiness**: simple-query regressions, Parquet schema correctness, and backend resource lifecycle handling.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-21

## 1) Today’s Overview

Apache Arrow saw **moderate-to-high day-to-day maintenance activity**: **25 issues** updated and **18 pull requests** updated in the last 24 hours, with **5 PRs/issues closed or merged on the PR side** and **7 issues closed**.  
There were **no new releases**, so current work is centered on **stability fixes, CI/build reliability, documentation cleanup, and incremental feature delivery** rather than a packaged milestone.  
The most visible engineering themes today were **Python packaging/editable install fixes**, **macOS CI regressions**, and continued investment in **Flight SQL ODBC support** across Windows and Ubuntu.  
Overall project health looks **active but maintenance-heavy**: contributors are moving several targeted fixes quickly, while a sizable number of older enhancement requests continue to be touched mainly through stale handling rather than feature completion.

---

## 3) Project Progress

### Merged/closed PRs today

#### 1. Python developer docs improved around Cython doctest workflow
- PR: [#49515](https://github.com/apache/arrow/pull/49515)  
- Related issue: [#49503](https://github.com/apache/arrow/issues/49503)

This documentation change clarifies that `.pxi` doctests are validated through `lib.pyx` rather than directly. While not a runtime feature, it improves contributor productivity and reduces friction in the Python extension development workflow.

**Why it matters:** Arrow’s Python bindings are a major ecosystem entry point. Better docs here lower maintenance cost and help contributors ship fixes faster.

---

#### 2. Documentation/spec clarification for struct validity masking
- PR: [#49554](https://github.com/apache/arrow/pull/49554)

This closed PR addressed a correctness/clarity issue in documentation around validity bitmaps and “hidden data” semantics in nested structures.

**Why it matters:** For analytical engines and storage implementers, the Arrow memory format is foundational. Even doc-only clarifications can prevent subtle interoperability bugs in downstream OLAP systems, vectorized execution engines, and serialization layers.

---

#### 3. Format clarification for fp16 Substrait literal encoding
- PR: [#47847](https://github.com/apache/arrow/pull/47847)  
- Related issue: [#47846](https://github.com/apache/arrow/issues/47846)

This format-focused PR was closed after clarifying encoding of fp16 Substrait literals.

**Why it matters:** This is a **SQL/planner interoperability signal**. Substrait alignment helps query engines exchange plans and typed literals correctly, especially as Arrow remains a common substrate between compute engines.

---

#### 4. Preliminary C++20 concepts modernization effort closed
- PR: [#49348](https://github.com/apache/arrow/pull/49348)

A preliminary attempt to modernize Arrow C++ type traits with C++20 concepts was closed.

**Interpretation:** This suggests maintainers are still evaluating scope, compatibility, and payoff for larger C++ modernization work. It does not advance user-facing query features directly, but it is relevant to long-term maintainability and compile-time correctness.

---

#### 5. Older Python scalar validation PR closed
- PR: [#44434](https://github.com/apache/arrow/pull/44434)

This long-running Python PR to validate `__arrow_c_array__` length for scalar construction was closed.

**Interpretation:** This likely reflects backlog cleanup rather than completion. The topic itself remains important for safe interoperability via Arrow’s C data interface.

---

## 4) Community Hot Topics

### A. Python packaging and editable installs
- Issue: [#49566](https://github.com/apache/arrow/issues/49566) — **[Python] Cython API header files seem to break editable installs**
- PR: [#49571](https://github.com/apache/arrow/pull/49571) — **Skip header files when installing compiled Cython files**
- Issue: [#49572](https://github.com/apache/arrow/issues/49572) — **[Python][Docs] Consolidate the information on the editable install in Python dev section**
- PR: [#49573](https://github.com/apache/arrow/pull/49573) — **Remove editable section and consolidate the information**

**Why it is hot:** This is the clearest issue-to-fix pipeline in today’s data. The recent switch to `scikit-build-core` appears to have exposed edge cases in editable installs and local imports.  
**Underlying technical need:** Python contributors and downstream package developers need **predictable dev installs**, especially for mixed C++/Cython projects. This is less about end-user analytics and more about keeping Arrow Python maintainable and contributor-friendly.

---

### B. macOS CI/compiler regressions
- Issue: [#49569](https://github.com/apache/arrow/issues/49569) — **macos 14 fails with missing `std::log2p1`**
- PR: [#49570](https://github.com/apache/arrow/pull/49570) — **Add check targeting Apple clang when deciding whether to use `std::bit_width` or `std::log2p1`**
- Issue: [#49563](https://github.com/apache/arrow/issues/49563) — **Unexpected dependency `libunwind` in macOS Intel CI**
- PR: [#49575](https://github.com/apache/arrow/pull/49575) — **Remove libunwind dynamic linked library in macOS Intel CI**

**Why it is hot:** Two same-day issue/PR pairs indicate fast response to CI breakage.  
**Underlying technical need:** Arrow’s cross-platform C++ and Python builds sit on a broad compiler/platform matrix. Compiler feature detection and toolchain drift remain ongoing maintenance burdens. For analytical storage engines, this matters because portability and reproducible builds are essential for distributors and embedded users.

---

### C. Flight SQL ODBC expansion
- PR: [#46099](https://github.com/apache/arrow/pull/46099) — **[C++] Arrow Flight SQL ODBC layer**
- Issue: [#49537](https://github.com/apache/arrow/issues/49537) — **Add CI steps to support Windows DLL and MSI signing**
- PR: [#49564](https://github.com/apache/arrow/pull/49564) — **Add Ubuntu ODBC Support**

**Why it is hot:** This is the strongest roadmap signal toward broader **database connectivity** and enterprise readiness.  
**Underlying technical need:** Users want Arrow Flight SQL exposed through standard ODBC channels for BI tools, desktop SQL clients, and enterprise deployment paths. Windows signing and Ubuntu support indicate this is shifting from prototype toward distributable productization.

---

### D. Most-commented updated issues
- Issue: [#30805](https://github.com/apache/arrow/issues/30805) — **[R] Expose API to create Dataset from Fragments** — 8 comments
- Issue: [#31315](https://github.com/apache/arrow/issues/31315) — **[C++][Docs] Document that the strptime kernel ignores `%Z`** — 8 comments
- Issue: [#49309](https://github.com/apache/arrow/issues/49309) — **[Python] `Table.to_batches()` loses schema information when table has zero rows** — 6 comments

**Interpretation:**  
- Dataset construction from metadata-defined fragments points to demand for **Iceberg/Delta-style integrations**.  
- `strptime` behavior remains a practical **SQL/time-parsing compatibility concern**.  
- Empty-table schema loss is a **real correctness and interoperability bug** for programmatic pipelines.

---

## 5) Bugs & Stability

Ranked roughly by severity and practical impact:

### 1. Zero-row table loses schema on `to_batches()`
- Issue: [#49309](https://github.com/apache/arrow/issues/49309)

**Severity:** High for correctness / pipeline interoperability.  
When `Table.to_batches()` returns an empty list for a zero-row table, schema information is effectively dropped. In analytics pipelines, empty-but-typed results are common, especially after filtering, planning, or partition pruning. Losing schema can break downstream consumers or produce inconsistent behavior between empty and non-empty query results.

**Fix PR:** None visible in today’s data.

---

### 2. macOS 14 build failure due to missing `std::log2p1`
- Issue: [#49569](https://github.com/apache/arrow/issues/49569)  
- PR: [#49570](https://github.com/apache/arrow/pull/49570)

**Severity:** High for CI / release engineering, medium for users.  
This is a platform/compiler regression affecting macOS ARM64 Python 3 builds. It likely blocks CI lanes and risks delaying merges.

**Status:** Active fix proposed same day.

---

### 3. Python freethreading build failure from invalid move on const reference
- Issue: [#49565](https://github.com/apache/arrow/issues/49565)  
- PR: [#49567](https://github.com/apache/arrow/pull/49567)

**Severity:** Medium-high.  
This affects the Python 3.13 freethreading test job and signals compatibility friction with newer Python/runtime configurations. It is important strategically because Python freethreading support will matter for future concurrency and performance.

**Status:** Active fix proposed same day.

---

### 4. Editable installs broken by Cython API header handling
- Issue: [#49566](https://github.com/apache/arrow/issues/49566)  
- PR: [#49571](https://github.com/apache/arrow/pull/49571)

**Severity:** Medium.  
Not a runtime data corruption issue, but a meaningful developer workflow regression. It also affects nightly verification jobs, so it has CI implications beyond local development inconvenience.

**Status:** Fix PR opened same day.

---

### 5. Unexpected `libunwind` dependency in macOS Intel ODBC CI
- Issue: [#49563](https://github.com/apache/arrow/issues/49563)  
- PR: [#49575](https://github.com/apache/arrow/pull/49575)

**Severity:** Medium.  
This appears isolated to CI/dependency hygiene, but it matters for packaging discipline and release artifact cleanliness.

**Status:** Fix PR opened same day.

---

### 6. Deep recursion risk in Parquet geometry processing
- PR: [#49558](https://github.com/apache/arrow/pull/49558)

**Severity:** Medium-high.  
This open PR adds a depth limit to prevent stack overflow in `WKBGeometryBounder::MergeGeometryInternal` on deeply nested geometry collections. For geospatial Parquet consumers, this is a real crash/stability hardening change.

**Status:** Awaiting merge.

---

## 6) Feature Requests & Roadmap Signals

### Strong signals

#### A. Broader Flight SQL ODBC support
- PR: [#46099](https://github.com/apache/arrow/pull/46099)
- PR: [#49564](https://github.com/apache/arrow/pull/49564)
- Issue: [#49537](https://github.com/apache/arrow/issues/49537)

This is the clearest near-term feature trajectory. Support is expanding from Windows toward Ubuntu, with CI/signing work indicating movement toward real distribution.  
**Prediction:** Likely to land incrementally in the next release cycle, though full polish may take longer.

---

#### B. R Azure Blob filesystem support
- PR: [#49553](https://github.com/apache/arrow/pull/49553)

Arrow R already supports AWS and GCS; adding Azure closes an obvious cloud connector gap.  
**Prediction:** Good chance of inclusion in an upcoming version if review proceeds smoothly.

---

#### C. Parquet encrypted bloom filter reads
- PR: [#49334](https://github.com/apache/arrow/pull/49334)

This extends Parquet compatibility for encrypted files by supporting encrypted bloom filter deserialization.  
**Why it matters:** Strong for storage-engine completeness and enterprise/security use cases.  
**Prediction:** Plausible next-version candidate if test coverage and review complete.

---

#### D. Parquet row-group write telemetry
- PR: [#49527](https://github.com/apache/arrow/pull/49527)

Adds `total_buffered_bytes()` for `RowGroupWriter`, useful for deciding when to start a new row group.  
**Why it matters:** This is a direct storage optimization hook for memory-aware writers and ingestion engines.  
**Prediction:** Good candidate for near-term inclusion.

---

#### E. Python batch concatenation schema promotion parity
- Issue: [#49574](https://github.com/apache/arrow/issues/49574)

Request to add `promote_options` to `pa.concat_batches()` like `pa.concat_tables()`.  
**Why it matters:** This is a practical API consistency request and would help batch-oriented ETL flows.  
**Prediction:** Reasonably likely, since the feature request is concrete and aligned with existing API semantics.

---

#### F. Dataset construction from fragments in R
- Issue: [#30805](https://github.com/apache/arrow/issues/30805)

This would better support metadata-driven table formats such as Delta Lake and Iceberg.  
**Why it matters:** Strong analytical lakehouse relevance.  
**Prediction:** Important strategically, but given age and closure via stale handling, it does **not** currently look imminent.

---

## 7) User Feedback Summary

Today’s user-facing pain points cluster around a few recurring themes:

### 1. Empty-result correctness matters
- Issue: [#49309](https://github.com/apache/arrow/issues/49309)

Users expect Arrow objects to preserve schema even when row count is zero. This is especially important in analytical systems where empty partitions, filtered datasets, and schema-only planning outputs are normal.

---

### 2. Developer environment reliability is a real usability issue
- Issue: [#49566](https://github.com/apache/arrow/issues/49566)
- Issue: [#49572](https://github.com/apache/arrow/issues/49572)

Python contributors are encountering friction around editable installs and documentation drift after build backend changes. This suggests Arrow’s packaging modernization is valuable but still settling.

---

### 3. Time parsing behavior remains confusing
- Issue: [#31315](https://github.com/apache/arrow/issues/31315)
- Issue: [#31324](https://github.com/apache/arrow/issues/31324)

Users continue to need clearer semantics and/or better support in `strptime`, especially around timezone names and platform differences. In SQL-facing and ETL contexts, datetime parsing remains a sensitive compatibility area.

---

### 4. Demand for lakehouse/cloud integrations persists
- Issue: [#30805](https://github.com/apache/arrow/issues/30805)
- PR: [#49553](https://github.com/apache/arrow/pull/49553)

Users want Arrow APIs that align with modern cloud object stores and metadata-driven table formats. Azure support in R and fragment-based dataset creation requests reflect this.

---

### 5. Packaging and connector distribution quality matters for adoption
- Issue: [#49537](https://github.com/apache/arrow/issues/49537)
- PR: [#49564](https://github.com/apache/arrow/pull/49564)
- Issue: [#49563](https://github.com/apache/arrow/issues/49563)

ODBC users care about signed binaries, clean dependency surfaces, and Linux support. This is a strong enterprise adoption signal rather than hobbyist feedback.

---

## 8) Backlog Watch

These older items look important but under-advanced, and may need maintainer attention:

### 1. Strptime compatibility/documentation backlog
- Issue: [#31324](https://github.com/apache/arrow/issues/31324) — **[C++] Strptime issues umbrella**
- Issue: [#31315](https://github.com/apache/arrow/issues/31315) — **Document that `strptime` ignores `%Z`**

These issues are old, still open, and relevant to parsing correctness. For SQL engines and ETL pipelines, datetime parsing inconsistencies can have outsized impact.

---

### 2. Dataset usability around partitioning/schema interactions
- Issue: [#30800](https://github.com/apache/arrow/issues/30800) — **[Python][Docs] Opening a partitioned dataset with schema and filter**
- Issue: [#30799](https://github.com/apache/arrow/issues/30799) — closed, but indicates persistent usability problems
- Issue: [#30797](https://github.com/apache/arrow/issues/30797) — closed, similarly points to dataset diagnostics gaps

Dataset partition discovery and schema/filter interactions remain an area where users can make subtle mistakes. Better diagnostics/docs would directly improve analytical workflow ergonomics.

---

### 3. JSON reader flexibility for mixed singleton/array fields
- Issue: [#31403](https://github.com/apache/arrow/issues/31403)

This is a practical ingestion problem for semi-structured real-world data. The request reflects common analytics ingestion pain and seems more impactful than its low comment count suggests.

---

### 4. C++ execution engine ergonomics
- Issue: [#31392](https://github.com/apache/arrow/issues/31392) — **Return a nice error if the user types the wrong node name in an exec plan**
- Issue: [#31431](https://github.com/apache/arrow/issues/31431) — **Default `Result<T>` construction cost**
- Issue: [#31439](https://github.com/apache/arrow/issues/31439) — **Benchmark `key_hash` and document tradeoffs**

These are not flashy features, but they matter for execution engine usability and performance transparency. They seem worthy of maintainer triage if compute-engine polish is a priority.

---

### 5. Buffer access for Python scalars
- Issue: [#20165](https://github.com/apache/arrow/issues/20165)

This remains a niche but meaningful request for zero-copy and custom serialization workflows. It aligns well with Arrow’s core value proposition and may deserve renewed attention.

---

## Overall Health Assessment

Apache Arrow appears **healthy and actively maintained**, with **fast response to fresh regressions** and visible momentum in **Flight SQL ODBC**, **Python packaging**, and **cross-platform CI**. The main caution is that many older enhancement issues continue to age in the backlog, especially around **datetime parsing**, **dataset ergonomics**, and **API consistency**. In short: **short-term maintenance responsiveness is strong; long-tail feature backlog resolution remains mixed.**

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*