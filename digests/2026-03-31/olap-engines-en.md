# Apache Doris Ecosystem Digest 2026-03-31

> Issues: 11 | PRs: 164 | Projects covered: 10 | Generated: 2026-03-31 01:28 UTC

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

# Apache Doris Project Digest — 2026-03-31

## 1. Today's Overview

Apache Doris remained highly active on 2026-03-31, with **164 pull requests updated** and **11 issues updated** in the last 24 hours, indicating strong ongoing engineering throughput. The day’s work was dominated by **infrastructure refactoring**, especially around the **filesystem abstraction/SPI split**, alongside continued **query engine internals cleanup**, **external catalog improvements**, and a steady stream of **bug reports in 4.0/cloud-mode paths**. There were **no new releases**, so the current signal is more about **preparing future versions** than packaging user-facing milestones. Overall project health looks strong from a development cadence perspective, but the issue stream shows active pressure on **stability, cloud storage behavior, type handling, and upgrade compatibility**.

## 2. Project Progress

### Merged/closed PRs today

Several merged or closed PRs point to meaningful progress in core architecture, storage integration, security, and external lakehouse compatibility.

#### Filesystem and storage abstraction refactoring
A notable theme is the **multi-phase FE filesystem SPI refactor**, which appears to be laying groundwork for cleaner modularization and cloud/object storage support:
- [#61859](https://github.com/apache/doris/pull/61859) — **Phase 0: prerequisite decoupling for filesystem SPI**
- [#61862](https://github.com/apache/doris/pull/61862) — duplicate/continued **Phase 0 decoupling**
- [#61908](https://github.com/apache/doris/pull/61908) — **Phase 1 FS interface refactoring**, introducing a new `FileSystem` API and value objects
- [#61909](https://github.com/apache/doris/pull/61909) — unit tests for `MemoryFileSystem`
- [#61907](https://github.com/apache/doris/pull/61907) — draft phase wrapper, now closed

This line of work is strategically important: it reduces Hadoop coupling, improves testability, and should make it easier to evolve cloud and object-storage connectors independently.

#### External catalog and metadata cache improvements
Doris continued maturing as a lakehouse query engine:
- [#60937](https://github.com/apache/doris/pull/60937) — **Unify external meta cache framework**
- [#60478](https://github.com/apache/doris/pull/60478) — **Per-catalog Paimon metadata cache** with two-level table+snapshot structure
- [#60995](https://github.com/apache/doris/pull/60995) — support **PFS in Paimon catalog**
- [#60796](https://github.com/apache/doris/pull/60796) — support **Aliyun DLF Iceberg REST catalog**
- [#60169](https://github.com/apache/doris/pull/60169) — support **schema change for complex types in Iceberg external tables**
- [#61398](https://github.com/apache/doris/pull/61398) — support **Iceberg v3 row lineage**
- [#60482](https://github.com/apache/doris/pull/60482) — implement **Iceberg update/delete/merge into**

These changes together significantly strengthen Doris’s position for federated analytics over modern table formats.

#### Security and enterprise integration
Security/operability also advanced:
- [#60275](https://github.com/apache/doris/pull/60275) — add **LDAPS support**
- [#61102](https://github.com/apache/doris/pull/61102) — improve **Azure object storage CA certificate troubleshooting**
- [#61075](https://github.com/apache/doris/pull/61075) — make **insert error message max length configurable**

These are quality-of-life features for operators running Doris in regulated or hybrid-cloud environments.

#### Storage/backend and cache capabilities
- [#59065](https://github.com/apache/doris/pull/59065) — **file cache admission control**
- [#60809](https://github.com/apache/doris/pull/60809) — add **Apache Ozone** storage properties
- [#61031](https://github.com/apache/doris/pull/61031) — treat **JuiceFS (`jfs://`) as HDFS-compatible**

This suggests sustained investment in broadening the storage substrate Doris can sit on.

## 3. Community Hot Topics

### 1) Global memory governance in scan nodes
- [PR #61271](https://github.com/apache/doris/pull/61271) — **Global mem control on scan nodes**

Even without visible comment counts in the supplied data, this is one of the most strategically important open efforts. Memory governance at scan nodes usually reflects production pain around **resource isolation**, **multi-tenant query stability**, and **OOM prevention** in large scans. This likely addresses user demand for tighter runtime controls as Doris serves bigger mixed workloads.

### 2) Filesystem SPI unification and cloud-storage modularization
- [Issue #61860](https://github.com/apache/doris/issues/61860) — **Unify remote filesystem abstraction and split into independent Maven SPI modules**
- [PR #61911](https://github.com/apache/doris/pull/61911) — **Migrate cloud.storage Remote* hierarchy to fs.obj module**
- [PR #61910](https://github.com/apache/doris/pull/61910) — **Phase2 cloud storage migration master**

This is a clear architecture hotspot. The underlying technical need is to eliminate duplicated FE/cloud filesystem stacks and move toward a **single, pluggable, storage-neutral abstraction**. For an OLAP engine increasingly deployed across S3-compatible stores, HDFS-like systems, and cloud-native object storage, this is foundational.

### 3) Execution engine modernization
- [PR #61690](https://github.com/apache/doris/pull/61690) — **Refactor aggregation code**
- [PR #61912](https://github.com/apache/doris/pull/61912) — **Migrate old VExpr execute interface to new execute_column (Part 1)**

These indicate internal cleanup of performance-critical paths. The technical need here is typical for mature analytical engines: reduce “god object” shared state, modernize vectorized execution interfaces, and improve maintainability/performance in operators like aggregation and join expression evaluation.

### 4) Standard SQL `MERGE INTO` demand
- [Issue #56259](https://github.com/apache/doris/issues/56259) — **[Feature] Support MERGE INTO**

Although Doris now has `MERGE INTO` work for **Iceberg tables** via [PR #60482](https://github.com/apache/doris/pull/60482), this issue shows users want **standard SQL MERGE semantics more generally**, likely for native Doris tables as well. That is a strong roadmap signal toward broader DML compatibility.

### 5) Long-tail connector/user support issue finally closed
- [Issue #10495](https://github.com/apache/doris/issues/10495) — **Flink connect to Doris BE failed**
  
This old issue, created in 2022 and updated/closed now, reflects a recurring operational need: Doris users still struggle with **internal/external IP topology**, **connector network routing**, and **BE endpoint exposure**, especially in mixed NAT/private network deployments.

## 4. Bugs & Stability

Below are the main bugs updated today, ranked by likely severity based on the descriptions provided.

### High severity

#### 1) BE crash with double key in aggregate table
- [Issue #61797](https://github.com/apache/doris/issues/61797) — **BE crash when double type be key in agg table**

A backend crash is among the most severe issue classes because it affects node availability and can indicate correctness or memory safety problems in storage/aggregation code paths. The fact that it is reported across **2.x/3.x/4.x** raises concern about a longstanding code-path issue rather than a narrow regression. No linked fix PR is visible in the provided data.

#### 2) CloudMode stream load occasionally fails
- [Issue #61905](https://github.com/apache/doris/issues/61905) — **CloudMode Stream load occasionally fails**

The summary points to a likely race involving **asynchronous file close after flush**, where segments may be consumed before object/file visibility is stable. This is high severity for cloud deployments because it affects **data ingestion reliability**. It also aligns with the day’s heavy cloud-storage refactoring, suggesting maintainers are actively dealing with these underlying abstractions.

#### 3) TVF import task repeatedly throws NPE after long-running operation
- [Issue #61897](https://github.com/apache/doris/issues/61897) — **TVF ongoing error: `ConnectContext.getExecutor()` is null**

A null dereference in long-running TVF ingestion suggests a lifecycle or cleanup bug in FE execution context management. Because the report mentions large/many files and sustained import, this may affect bulk-loading jobs and could be workload-sensitive. No fix PR is listed yet.

### Medium severity

#### 4) Variant type unreadable via cross-cluster catalog with Arrow Flight
- [Issue #61883](https://github.com/apache/doris/issues/61883) — **Cross-cluster Catalog with Arrow Flight fails to read Variant type**

This impacts newer semistructured/variant workflows and cross-cluster access patterns. Severity is moderate: likely not universal, but important for cloud-native and schema-flexible users.

#### 5) `allow_zero_date` does not work
- [Issue #61789](https://github.com/apache/doris/issues/61789) — **allow_zero_date do not work**

This is a compatibility/correctness issue, likely affecting MySQL-like ingestion or migration scenarios. It matters for users porting legacy schemas or ETL jobs that rely on permissive date handling.

#### 6) Audit log Chinese text garbling
- [Issue #61901](https://github.com/apache/doris/issues/61901) — **AuditLoaderPlugin occasional garbled Chinese characters**

Operationally important for observability and compliance, especially in Chinese-language deployments. Lower severity than crashes, but high practical impact for audit trail readability.

#### 7) Upgrade compatibility issue from 1.2.8 to 2.0.0
- [Issue #61866](https://github.com/apache/doris/issues/61866) — **`SHOW FRONTENDS` error during metadata compatibility testing**

Upgrade-path defects are serious for adoption because they can block production migration. Even if this affects an older upgrade path, it weakens confidence in long-jump version transitions.

### Resolved today

- [Issue #61780](https://github.com/apache/doris/issues/61780) — **ErrorURL inaccessible in secure cluster case** — closed
- [Issue #10495](https://github.com/apache/doris/issues/10495) — old Flink/BE connectivity issue — closed

## 5. Feature Requests & Roadmap Signals

### Standard SQL `MERGE INTO`
- [Issue #56259](https://github.com/apache/doris/issues/56259)

This is the clearest user-facing SQL feature request in today’s issue set. Since Doris already merged `MERGE INTO` support for **Iceberg external tables** in [PR #60482](https://github.com/apache/doris/pull/60482), expanding syntax and semantics to broader Doris-native contexts looks plausible for a future release.

### Filesystem modularization as a roadmap pillar
- [Issue #61860](https://github.com/apache/doris/issues/61860)
- [PR #61911](https://github.com/apache/doris/pull/61911)
- [PR #61910](https://github.com/apache/doris/pull/61910)

This is less a user-requested feature than a major roadmap signal. Expect future releases to expose cleaner connector behavior, lower dependency coupling, and possibly faster iteration on S3/OSS/COS/OBS/Azure integrations.

### Broader cloud and lakehouse interoperability
Recent merged work strongly suggests continued near-term focus on:
- Iceberg DML and row lineage: [#60482](https://github.com/apache/doris/pull/60482), [#61398](https://github.com/apache/doris/pull/61398)
- Catalog/cache correctness: [#60937](https://github.com/apache/doris/pull/60937), [#60478](https://github.com/apache/doris/pull/60478)
- More storage backends: [#60809](https://github.com/apache/doris/pull/60809), [#61031](https://github.com/apache/doris/pull/61031)

### Likely next-version candidates
Based on today’s open work and recent merges, likely candidates for the next version line include:
1. **More polished cloud/object storage abstraction**
2. **Execution engine refactors with performance/stability benefits**
3. **Expanded SQL/DML compatibility, especially around MERGE-like semantics**
4. **More complete external catalog and format interoperability**

## 6. User Feedback Summary

Today’s issues reflect several concrete user pain points:

### Cloud deployments still face edge-case instability
Users are reporting:
- intermittent stream load failures in cloud mode: [#61905](https://github.com/apache/doris/issues/61905)
- Arrow Flight + variant interoperability failures: [#61883](https://github.com/apache/doris/issues/61883)
- long-running TVF import instability: [#61897](https://github.com/apache/doris/issues/61897)

This suggests Doris is being used in increasingly cloud-native, distributed setups, but some async lifecycle and type-system edges remain rough.

### Compatibility remains a key adoption driver
Reports around:
- `allow_zero_date`: [#61789](https://github.com/apache/doris/issues/61789)
- metadata upgrade path issues: [#61866](https://github.com/apache/doris/issues/61866)
- old Flink connector topology troubles: [#10495](https://github.com/apache/doris/issues/10495)

show that many users evaluate Doris not just on raw query speed, but on how smoothly it fits into **legacy MySQL-compatible semantics**, **existing ETL stacks**, and **upgrade workflows**.

### Strong demand for standard SQL and lakehouse parity
The `MERGE INTO` request [#56259](https://github.com/apache/doris/issues/56259), combined with recent Iceberg DML work, shows users increasingly expect Doris to provide a more complete **analytical SQL surface** comparable to modern lakehouse engines.

## 7. Backlog Watch

These items appear to need maintainer attention due to age, strategic importance, or incomplete progression.

### Long-standing feature request with roadmap importance
- [Issue #56259](https://github.com/apache/doris/issues/56259) — **Support MERGE INTO**

This is still open and stale despite broad market demand for standard merge semantics. Given recent Iceberg-specific progress, maintainers may want to clarify whether native-table `MERGE INTO` is planned, scoped, or intentionally deferred.

### Stale but significant open PR
- [PR #56694](https://github.com/apache/doris/pull/56694) — **merge rf v1 v2**

The title is terse and the PR is marked stale. If this refers to runtime filter or related execution-path consolidation, it may deserve explicit triage because such work can have substantial planner/runtime impact.

### Large, high-impact memory management effort still open
- [PR #61271](https://github.com/apache/doris/pull/61271) — **Global mem control on scan nodes**

This looks important for cluster stability and workload governance. Because memory issues are among the most operationally painful in OLAP engines, this PR deserves close maintainer review.

### Ongoing deep refactors needing sustained review bandwidth
- [PR #61690](https://github.com/apache/doris/pull/61690) — **Refactor aggregation code**
- [PR #61783](https://github.com/apache/doris/pull/61783) — **data_lake_reader_refactoring**
- [PR #61910](https://github.com/apache/doris/pull/61910) — **Phase2 cloud storage migration**
- [PR #61911](https://github.com/apache/doris/pull/61911) — **Migrate cloud.storage Remote* hierarchy**

These are architecturally significant and likely to affect many subsystems. They need careful review to avoid regressions, especially given the concurrent bug reports in cloud storage and data lake integration paths.

## 8. Overall Health Assessment

Apache Doris shows **excellent development velocity** and strong momentum in the areas most relevant to modern analytical databases: **cloud storage abstraction, lakehouse interoperability, query engine internals, and enterprise integration**. The biggest positive signal is that substantial architectural work is moving in parallel with user-facing compatibility improvements. The main risk area is that the issue stream still contains **backend crashes, cloud-mode ingestion races, and upgrade/compatibility defects**, which can offset the benefits of fast feature growth if not addressed quickly. Net assessment: **healthy and fast-moving, with strong roadmap execution, but under active pressure to harden newer cloud and advanced-type scenarios**.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-31

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, with strong parallel investment in **cloud/object storage support, lakehouse interoperability, SQL compatibility, and execution-engine modernization**. Across engines, the center of gravity is shifting from “fast local analytics” toward **hybrid analytical platforms** that must operate across native storage, Iceberg/Delta/Paimon-style external tables, object stores, and increasingly service-oriented APIs. At the same time, community issue streams show that growth is putting pressure on **correctness, upgrade safety, memory governance, and cloud operational reliability**. Overall, the market is healthy and innovative, but the most competitive projects are now distinguished less by raw speed alone and more by **interoperability breadth, production hardening, and operational ergonomics**.

---

## 2. Activity Comparison

### Daily activity snapshot

| Project | Issues Updated | PRs Updated | Release Today | Indicative Health Score* | Short Read |
|---|---:|---:|---|---:|---|
| **ClickHouse** | 74 | 461 | No | **8.7/10** | Highest throughput; strong momentum, but 26.x regression/correctness pressure |
| **Apache Doris** | 11 | 164 | No | **8.5/10** | Very strong core velocity; major architecture work; cloud stability issues need attention |
| **StarRocks** | 37 | 115 | **Yes (3.5.15)** | **7.8/10** | Release-oriented and active, but notable security/correctness risk surfaced |
| **DuckDB** | 17 | 51 | No | **8.1/10** | High-quality iteration, but wrong-result regressions are the main concern |
| **Apache Iceberg** | 9 | 44 | No | **8.0/10** | Healthy implementation pace; connector and packaging friction visible |
| **Velox** | 3 | 50 | No | **8.2/10** | Strong implementation cadence; stable signal, fewer user issues, some backlog latency |
| **Apache Arrow** | 21 | 17 | No | **8.0/10** | Steady hardening and cross-language maintenance; correctness fixes landed quickly |
| **Apache Gluten** | 5 | 23 | No | **7.9/10** | Good momentum around Spark/Velox parity; dependency and runtime issues remain |
| **Databend** | 4 | 14 | **Yes (2 patch releases)** | **8.0/10** | Moderate but healthy pace; fixes landing quickly; SQL completeness improving |
| **Apache Iceberg** | 9 | 44 | No | **8.0/10** | Strong integrator project health; PR-heavy, issue-light |
| **Delta Lake** | N/A | N/A | N/A | **N/A** | Summary unavailable |

\*Indicative health score is inferred from cadence, merge/fix responsiveness, severity of active bugs, and release/maintenance posture from the provided digests.

### Practical ranking by visible daily engineering throughput
1. **ClickHouse**
2. **Apache Doris**
3. **StarRocks**
4. **DuckDB / Velox / Iceberg** (different profiles, similar activity significance)
5. **Arrow / Gluten / Databend**

---

## 3. Apache Doris's Position

### Where Doris looks strong versus peers

**1. Broad platform ambition across native OLAP + lakehouse query federation**  
Doris is increasingly positioned not just as an MPP OLAP engine, but as a **hybrid analytical platform** spanning native storage, external catalogs, and modern table formats. Compared with DuckDB and Velox, Doris is much more clearly targeting **full-cluster deployment and federated production analytics**. Compared with ClickHouse, Doris appears more visibly focused right now on **catalog interoperability and filesystem modularization** as strategic pillars.

**2. Heavy investment in storage abstraction and external metadata layers**  
The FE filesystem SPI split, unified remote filesystem abstraction, external metadata cache unification, and Paimon/Iceberg enhancements are strong signals that Doris is building for a **connector-rich, cloud-object-storage-first future**. This is similar in strategic direction to StarRocks and ClickHouse, but Doris’s current work is especially explicit about **decoupling Hadoop-era assumptions** and modularizing the storage interface.

**3. Strong development volume for a full-stack database project**  
With **164 PRs updated in a day**, Doris sits in the upper tier of activity among analytical engines, second only to ClickHouse in this dataset. That indicates a sizable and engaged contributor base, especially for a project balancing FE, BE, execution engine, and connector surfaces.

### Where peers currently look stronger

- **ClickHouse**: higher absolute community throughput, broader visible optimizer/runtime experimentation, and stronger momentum in distributed execution tuning.
- **DuckDB**: stronger embedded analytics identity and very fast correctness turnaround for a compact engine footprint.
- **StarRocks**: strong release discipline and highly focused optimizer/storage work, though today’s security issues are a serious caveat.
- **Iceberg / Arrow**: stronger ecosystem-neutral interoperability positions rather than full end-to-end database competition.

### Technical approach differences

- **Doris vs ClickHouse**: Doris currently signals more emphasis on **filesystem abstraction, external catalog mediation, and SQL/lakehouse interoperability**, while ClickHouse shows more visible pressure on **core execution, MergeTree behavior, and distributed query path performance**.
- **Doris vs StarRocks**: both aim at cloud/lakehouse analytics, but Doris’s current signal is stronger around **modular storage abstraction and catalog cache architecture**, while StarRocks shows stronger day-to-day focus on **optimizer stats, compaction correctness, and branch backports**.
- **Doris vs DuckDB**: Doris is cluster-native and operationally heavier; DuckDB is embedded-first and highly developer-centric.
- **Doris vs Iceberg/Arrow/Velox**: Doris is an integrated query engine/database, while those projects are infrastructure layers or execution/storage components.

### Community size comparison

By raw daily updated PR volume in this snapshot:
- **ClickHouse** is clearly the largest/most active.
- **Doris** is in the next tier and looks materially larger in day-to-day engineering flow than DuckDB, Iceberg, Databend, Gluten, Arrow, or Velox issue activity alone suggests.
- **StarRocks** is also substantial, though below Doris in this slice.
- **DuckDB**, **Iceberg**, and **Velox** are highly influential with smaller but very high-quality engineering footprints.

**Conclusion:** Doris is firmly in the **top-tier open-source analytical database communities**, especially among distributed OLAP engines.

---

## 4. Shared Technical Focus Areas

### A. Cloud/object storage abstraction and behavior
**Engines:** Doris, ClickHouse, StarRocks, Arrow, Databend, Gluten, Iceberg  
**Need:** Better cloud-native reliability, lower coupling to legacy FS layers, lower object-store cost, and stronger semantics under async I/O.

- **Doris**: filesystem SPI split, cloud storage migration, object-store modularization
- **ClickHouse**: S3 PUT burst behavior, DeltaLake Azure issues
- **StarRocks**: shared-data compaction and Iceberg file pruning
- **Arrow**: remote I/O efficiency, BufferedInputStream seek, cloud parity
- **Databend**: HTTP/query-service integration and recluster predictability
- **Iceberg**: REST catalog and connector operational quality
- **Gluten**: S3 teardown lifecycle issue

### B. Lakehouse and external table interoperability
**Engines:** Doris, ClickHouse, StarRocks, Iceberg, DuckDB  
**Need:** Reliable reads/writes over Iceberg/Delta/Paimon/Parquet ecosystems, schema evolution support, and better pruning/stats use.

- **Doris**: Iceberg DML, row lineage, Paimon cache and catalog work
- **ClickHouse**: DeltaLake Azure schema evolution/time-travel correctness
- **StarRocks**: Iceberg onboarding, runtime-filter pruning before file open
- **Iceberg**: REST relation loading, Spark/Flink improvements
- **DuckDB**: Parquet/Variant/Arrow interoperability fixes

### C. Correctness and wrong-result prevention
**Engines:** DuckDB, ClickHouse, StarRocks, Arrow, Doris  
**Need:** Stronger trust in planner/executor correctness under edge cases.

- **DuckDB** has the heaviest visible wrong-result pressure today
- **ClickHouse** has Decimal aggregation correctness issues
- **StarRocks** has plan correctness and isolation concerns
- **Arrow** fixed nested filtering corruption
- **Doris** shows crash/type/upgrade issues rather than many wrong-result reports, but correctness risk exists in cloud/type paths

### D. Memory governance, spilling, and bounded execution
**Engines:** Doris, ClickHouse, Velox, Gluten, DuckDB  
**Need:** Better OOM avoidance and graceful degradation on large workloads.

- **Doris**: global memory control on scan nodes
- **Velox / Gluten**: spill depth failures
- **DuckDB**: S3 partitioned COPY OOM
- **ClickHouse**: less explicit today, but background contention and analyzer efficiency tie into bounded execution

### E. SQL compatibility and ergonomics
**Engines:** Doris, ClickHouse, DuckDB, Databend, Velox, StarRocks  
**Need:** Closer parity with PostgreSQL/MySQL/Spark/standard SQL semantics.

- **Doris**: MERGE INTO demand, `allow_zero_date`, MySQL-ish compatibility paths
- **ClickHouse**: `generate_series`, parser improvements, JSON utilities
- **DuckDB**: trigger metadata, JSON functions, correctness around advanced SQL
- **Databend**: recursive CTEs, binary literal compatibility
- **Velox**: function parity with Presto/Trino ecosystems
- **StarRocks**: metadata fidelity, type support, strict sql_mode behavior

### F. API, connector, and service-layer interoperability
**Engines:** Arrow, DuckDB, ClickHouse, Gluten, Doris  
**Need:** Better Arrow Flight, ADBC, ODBC, HTTP APIs, and cross-tool usability.

- **Arrow**: Flight SQL ODBC
- **DuckDB**: Arrow Flight SQL demand, ADBC fixes
- **ClickHouse**: Arrow Flight SQL work
- **Doris**: Arrow Flight cross-cluster Variant issue
- **Databend**: HTTP JSON result mode
- **Gluten**: Kafka and Spark compatibility surfaces

---

## 5. Differentiation Analysis

### By storage model

| Engine | Primary Storage Orientation | Differentiator |
|---|---|---|
| **Apache Doris** | Native MPP store + growing external lakehouse federation | Balanced native OLAP and external catalog ambition |
| **ClickHouse** | Native columnar MergeTree family | Deep engine specialization for high-speed analytic serving/ingest |
| **DuckDB** | Embedded local analytical DB | Single-node, in-process analytics and developer productivity |
| **StarRocks** | Native OLAP + shared-data/cloud lake analytics | Strong cloud/shared-data operating model |
| **Iceberg** | Table format / metadata layer | Ecosystem-neutral storage abstraction, not a query engine |
| **Delta Lake** | Table format / transaction layer | Lakehouse transaction/log model |
| **Databend** | Cloud data warehouse style separated compute/storage | SQL warehouse orientation with modern cloud posture |
| **Velox** | Execution engine library | Component, not end-user DB |
| **Arrow** | Columnar memory/data interchange + libraries | Interoperability substrate |
| **Gluten** | Spark acceleration layer | Native backend acceleration for Spark |

### By query engine design

- **Doris / ClickHouse / StarRocks / Databend**: distributed SQL engines with native execution stacks.
- **DuckDB**: embedded vectorized analytical engine.
- **Velox**: reusable execution engine for upstream consumers.
- **Gluten**: Spark-native acceleration layer using native backends.
- **Iceberg / Arrow**: foundational layers rather than standalone OLAP databases.

### By target workload

- **Doris**: interactive analytics, real-time OLAP, federated lakehouse querying.
- **ClickHouse**: high-throughput analytics, observability, event/log workloads, distributed serving.
- **DuckDB**: notebooks, local ETL, embedded analytics, developer workflows.
- **StarRocks**: cloud analytics, shared-data/lakehouse acceleration, BI.
- **Iceberg / Delta**: storage standardization across engines.
- **Databend**: cloud-native warehouse-style analytics.
- **Velox / Gluten**: execution infrastructure for other systems.
- **Arrow**: analytics plumbing and cross-language data movement.

### By SQL compatibility posture

- **DuckDB** and **Databend** are visibly investing in broader SQL completeness.
- **ClickHouse** is expanding compatibility but still carries engine-specific semantics.
- **Doris** is improving compatibility from both native SQL and external table directions; `MERGE INTO` is a strong roadmap signal.
- **StarRocks** is tightening semantics, sometimes through stricter behavior changes.
- **Velox** tracks more function/operator parity for upstream ecosystems than end-user ANSI completeness directly.

---

## 6. Community Momentum & Maturity

### Activity tiers

#### Tier 1: Hyperactive and strategically broad
- **ClickHouse**
- **Apache Doris**

These projects combine high PR volume with broad subsystem activity. They are clearly still expanding capabilities while maintaining production usage pressure.

#### Tier 2: Active, focused, and maturing quickly
- **StarRocks**
- **DuckDB**
- **Apache Iceberg**
- **Velox**

These communities show strong forward motion, but with more concentrated scope:
- StarRocks around optimizer/storage/release maintenance
- DuckDB around correctness and usability
- Iceberg around integrator ecosystem evolution
- Velox around engine internals and integration maturity

#### Tier 3: Targeted but healthy
- **Databend**
- **Apache Gluten**
- **Apache Arrow**

These are active and relevant, but with narrower surface areas or lower daily volume in this snapshot.

### Who is rapidly iterating?
- **ClickHouse**: very rapid iteration, especially in execution/storage/CI.
- **Doris**: rapid iteration in architecture, storage abstraction, and external catalogs.
- **DuckDB**: rapid, tight-loop fixes and refactors.
- **StarRocks**: rapid but more release/backport disciplined.

### Who is stabilizing?
- **Arrow**: more hardening and maintenance than disruptive expansion.
- **Iceberg**: still evolving, but increasingly in platform/integration maturation mode.
- **Velox**: strong implementation pace, but mature infrastructure patterns emerging.
- **Databend**: patch-release cadence suggests controlled stabilization plus selective feature growth.

---

## 7. Trend Signals

### 1. Cloud-native storage is now table stakes, not differentiation
Users increasingly expect engines to work cleanly over **S3/Azure/OSS/HDFS-like layers** without operational surprises. The differentiation is shifting from “supports object storage” to **how well it handles object-store semantics, cost behavior, retries, cache policy, and consistency edges**.

### 2. Lakehouse interoperability is becoming mandatory for OLAP engines
Doris, StarRocks, ClickHouse, DuckDB, and others are all being pushed toward better **Iceberg/Delta/Paimon/Parquet interoperability**. For architects, this means engine selection should increasingly consider **external table correctness, metadata caching, schema evolution behavior, and pruning quality**, not just native table performance.

### 3. Correctness is the new competitive axis
Many communities now face visible user pressure on **wrong results, type semantics, planner correctness, and upgrade regressions**. For data engineers, this is a reminder that benchmark speed alone is insufficient; **operational trust and semantic fidelity** are becoming decisive.

### 4. SQL convergence continues, but through different routes
There is broad demand for:
- `MERGE INTO`
- recursive CTEs
- parser/usability improvements
- JSON/semi-structured functions
- compatibility with PostgreSQL/MySQL/Spark semantics

This benefits engineers by reducing migration friction, but it also reveals that projects differ sharply in whether they treat SQL compatibility as **core strategy** or **selective pragmatism**.

### 5. Execution governance matters more as workloads diversify
Memory control, spill behavior, bounded background maintenance, and stable long-running imports appear across multiple engines. For architects, this means governance features are becoming as important as raw execution speed for **multi-tenant and mixed ETL + BI environments**.

### 6. Component ecosystems are increasingly strategic
Arrow, Velox, Iceberg, and Gluten show that the ecosystem is no longer just a set of standalone databases; it is a layered stack. This gives teams more architectural flexibility, but also means evaluating systems now requires understanding **how execution engines, table formats, connectors, and APIs compose together**.

---

## Bottom Line

**Apache Doris is in a strong competitive position**: it has top-tier development momentum, a clear architecture modernization path, and credible movement toward cloud-native and lakehouse-centric analytics. Relative to peers, its standout strategic bet is the combination of **native OLAP capability with increasingly modular storage/catalog interoperability**. The main near-term risk is not innovation pace but **hardening**—especially around cloud-mode ingestion, type handling, and compatibility paths. For technical decision-makers, Doris remains one of the most relevant distributed analytical databases to watch, particularly if your roadmap depends on **hybrid native + lakehouse query architectures**.

If you want, I can also turn this into:
1. a **one-page executive briefing**,  
2. a **Doris-vs-ClickHouse-vs-StarRocks decision matrix**, or  
3. a **radar chart style scoring summary** for architects.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-31

## 1) Today's Overview

ClickHouse remains extremely active: **74 issues** and **461 pull requests** were updated in the last 24 hours, with **347 PRs still open** and **114 PRs merged/closed**. That level of throughput signals a fast-moving core team, especially around query execution, storage behavior, CI hardening, and SQL compatibility work. The project health looks strong from a development-velocity perspective, but the issue stream shows continued pressure in three areas: **performance regressions after 26.x upgrades**, **correctness edge cases in the analyzer/expression engine**, and **object-storage / lakehouse interoperability**. No new release was published today, so activity is concentrated on stabilization and feature landing rather than packaging.

## 3) Project Progress

With **114 PRs merged/closed** in the last 24 hours, the project appears to be advancing on several meaningful fronts, even though the provided PR sample is mostly open work. Based on the active PR set, the strongest visible progress signals are:

### Query engine and execution
- Work continues on **parallel and distributed query execution**, especially parallel replicas:
  - [#101208](https://github.com/ClickHouse/ClickHouse/pull/101208) fixes a `LOGICAL_ERROR` around shard numbering in parallel replicas.
  - [#100139](https://github.com/ClickHouse/ClickHouse/pull/100139) adds `parallel_replicas_prefer_local_replica`, improving replica selection flexibility.
- Read pipeline performance is being pushed further:
  - [#100391](https://github.com/ClickHouse/ClickHouse/pull/100391) parallelizes **read-in-order from a single part** using `PrefetchingConcatProcessor`, a notable storage-engine execution optimization.
- Experimental aggregation acceleration remains active:
  - [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757) introduces **PartialAggregateCache** for part-level reuse of aggregate states.

### SQL compatibility and usability
- Several SQL ergonomics improvements are in flight:
  - [#101056](https://github.com/ClickHouse/ClickHouse/pull/101056) adds **negative step support** to `generate_series`, improving PostgreSQL compatibility.
  - [#101102](https://github.com/ClickHouse/ClickHouse/pull/101102) extends `JSON_VALUE` to support tuple/array outputs for multi-path extraction.
  - [#100784](https://github.com/ClickHouse/ClickHouse/pull/100784) adds **filter pushdown over window functions**, addressing a long-standing optimization gap.
- Format/type compatibility is improving:
  - [#101272](https://github.com/ClickHouse/ClickHouse/pull/101272) adds support for `Nullable(Tuple)` in Arrow/ORC/legacy Parquet-related paths.

### Statistics, storage internals, and CI hardening
- Automatic statistics work is becoming more concrete:
  - [#101275](https://github.com/ClickHouse/ClickHouse/pull/101275) automatically creates **minmax + uniq statistics** for new columns.
  - [#101243](https://github.com/ClickHouse/ClickHouse/pull/101243) fixes random failures in **autostatistics** testing.
- Storage/runtime robustness is also getting attention:
  - [#101199](https://github.com/ClickHouse/ClickHouse/pull/101199) improves `DiskLocal` startup behavior.
  - [#98573](https://github.com/ClickHouse/ClickHouse/pull/98573) reduces lock contention in `MergeTreeBackgroundExecutor`.
  - [#101158](https://github.com/ClickHouse/ClickHouse/pull/101158) fixes **DROP TABLE hang on Kafka tables** during rebalance/network trouble.
- CI quality controls are tightening:
  - [#100836](https://github.com/ClickHouse/ClickHouse/pull/100836) detects lost baseline coverage.
  - [#100792](https://github.com/ClickHouse/ClickHouse/pull/100792) adds integration test auth infrastructure.

Overall, the merged/closed volume plus the active PRs suggest progress is concentrated on **execution efficiency, SQL compatibility, optimizer/statistics infrastructure, and reliability under distributed/storage-heavy deployments**.

## 4) Community Hot Topics

### 1. INSERT regression after upgrade to 26.2
- [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241) — **INSERT queries are 3x slower after upgrading from 25.12 to 26.2**
- Why it matters: This is the clearest production-facing regression in the current issue set. It affects a `ReplacingMergeTree` ingestion workload and directly threatens upgrade confidence.
- Technical need behind it: users need **predictable write-path performance across major monthly versions**, especially for MergeTree-family engines with dedup/replacement semantics.

### 2. 2026 roadmap discussion
- [Issue #93288](https://github.com/ClickHouse/ClickHouse/issues/93288) — **ClickHouse roadmap 2026**
- Why it matters: High-comment roadmap threads are usually the best indicator of where maintainers are focusing investment.
- Technical signal: the ecosystem is watching for direction on **query optimization, storage formats, interoperability, and engine maturity**, not just incremental features.

### 3. URL manipulation and SQL utility functions
- [Issue #54485](https://github.com/ClickHouse/ClickHouse/issues/54485) — **A function `resolveRelativeURL`**
- Why it matters: Even a relatively small utility function has remained active for a long time, which shows demand for richer built-in string/URL processing in analytics pipelines.
- Technical need: reducing ETL pre-processing by moving more web/log transformation logic into SQL.

### 4. CI crash in MergeTree reader path
- [Issue #100769](https://github.com/ClickHouse/ClickHouse/issues/100769) — **Potential issue in MergeTreeRangeReader adjusting last granule**
- Why it matters: MergeTree reader crashes strike at the core storage read path.
- Technical need: maintain confidence in low-level granule navigation and edge-case read boundaries, especially as the execution engine becomes more parallelized.

### 5. SQL parser ergonomics
- [Issue #90780](https://github.com/ClickHouse/ClickHouse/issues/90780) — **Support for trailing comma in WITH before SELECT**
- Why it matters: Small syntax affordances often receive strong support because they improve generated SQL and editing workflows.
- Technical need: better ergonomics for hand-written and machine-generated analytical SQL.

### 6. Analyzer efficiency concerns
- [Issue #78166](https://github.com/ClickHouse/ClickHouse/issues/78166) — **More reading rows in the analyzer**
- Why it matters: This reflects a recurring concern that the newer analyzer may sometimes trade correctness/features for less efficient plans.
- Technical need: optimizer/analyzer maturity, with strong parity or superiority versus legacy planning behavior.

## 5) Bugs & Stability

Ranked by likely severity and user impact:

### Critical / High

1. **Write performance regression in 26.2**
   - [#99241](https://github.com/ClickHouse/ClickHouse/issues/99241)
   - Impact: severe for production ingest workloads; directly upgrade-blocking.
   - Fix PR visible today: **none directly linked** in the provided data.

2. **Incorrect results for `MAX()`/`MIN()` on Decimal with `GROUP BY`**
   - [#100740](https://github.com/ClickHouse/ClickHouse/issues/100740)
   - Impact: high, because query correctness bugs are more dangerous than crashes in analytics systems.
   - Affects: versions since **26.1** per report.
   - Fix PR visible today: **none directly linked**.

3. **DeltaLake Azure schema evolution failing with `NOT_IMPLEMENTED`**
   - [#100438](https://github.com/ClickHouse/ClickHouse/issues/100438)
   - Impact: high for lakehouse users; breaks reads on evolved tables.
   - Fix PR visible today: none shown.

4. **DeltaLake Azure time-travel silently ignored**
   - [#100502](https://github.com/ClickHouse/ClickHouse/issues/100502)
   - Impact: high because it can return **wrong data without error**.
   - This is a correctness/interoperability issue, likely more severe than a hard failure.

### Medium

5. **Skip indexes bypassed when projections are present**
   - [#100783](https://github.com/ClickHouse/ClickHouse/issues/100783)
   - Impact: significant performance degradation, especially since `use_skip_indexes_on_data_read=1` is default from 26.1.
   - Technical concern: mismatch between `EXPLAIN` and actual execution behavior.

6. **Large burst of S3 PUT requests on TTL migration**
   - [#100960](https://github.com/ClickHouse/ClickHouse/issues/100960)
   - Impact: cost/performance issue for cloud storage users; potentially operationally painful even on small datasets.

7. **Analyzer/RBAC logical error with `EXECUTE AS`**
   - [#100695](https://github.com/ClickHouse/ClickHouse/issues/100695)
   - Impact: medium; affects advanced security and impersonation scenarios.

8. **SQL boolean/comparison inconsistency found by SQLancer**
   - [#101269](https://github.com/ClickHouse/ClickHouse/issues/101269)
   - Impact: medium; correctness bug in expression semantics.

### CI / Internal stability

9. **MergeTreeRangeReader CI crash**
   - [#100769](https://github.com/ClickHouse/ClickHouse/issues/100769)

10. **USearch ASan heap-buffer-overflow**
   - [#100556](https://github.com/ClickHouse/ClickHouse/issues/100556)

11. **MemorySanitizer use-of-uninitialized-value**
   - [#101232](https://github.com/ClickHouse/ClickHouse/issues/101232)

### Related fix work visible in PRs
- [#101208](https://github.com/ClickHouse/ClickHouse/pull/101208) fixes a parallel replicas logical error.
- [#101253](https://github.com/ClickHouse/ClickHouse/pull/101253) fixes UB in `mergeTreeAnalyzeIndexes()`.
- [#101158](https://github.com/ClickHouse/ClickHouse/pull/101158) addresses Kafka `DROP TABLE` hangs.
- [#98573](https://github.com/ClickHouse/ClickHouse/pull/98573) reduces background executor lock contention, likely helping flakiness/stability indirectly.

## 6) Feature Requests & Roadmap Signals

### Strong current feature signals

1. **Automatic column statistics**
   - Issue: [#55065](https://github.com/ClickHouse/ClickHouse/issues/55065)
   - PR: [#101275](https://github.com/ClickHouse/ClickHouse/pull/101275)
   - Signal: very strong. This is likely to land incrementally in an upcoming version because implementation work is active now.
   - Why it matters: unlocks future optimizer improvements like join reordering and better PREWHERE/filter ordering.

2. **Arrow Flight SQL support**
   - PR: [#91170](https://github.com/ClickHouse/ClickHouse/pull/91170)
   - Signal: strong. This is a major ecosystem/connectivity feature and aligns with BI/data-tool interoperability trends.

3. **FSST serialization**
   - PR: [#91416](https://github.com/ClickHouse/ClickHouse/pull/91416)
   - Signal: moderate-to-strong experimental feature, especially relevant for compression/encoding efficiency.

4. **Partial aggregate cache**
   - PR: [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757)
   - Signal: moderate. Experimental, but important for repeated GROUP BY acceleration.

5. **Predicate pushdown over window functions**
   - Closed issue: [#51203](https://github.com/ClickHouse/ClickHouse/issues/51203)
   - PR: [#100784](https://github.com/ClickHouse/ClickHouse/pull/100784)
   - Signal: strong candidate for a near-term version because it closes a real optimizer gap.

### Smaller but likely-near-term SQL features
- [#90780](https://github.com/ClickHouse/ClickHouse/issues/90780) — trailing comma in `WITH`
- [#54485](https://github.com/ClickHouse/ClickHouse/issues/54485) — `resolveRelativeURL`
- [#98981](https://github.com/ClickHouse/ClickHouse/issues/98981) — `h3PolygonToCellsExperimental`
- [#81183](https://github.com/ClickHouse/ClickHouse/issues/81183) — rolling hash functions
- [#96407](https://github.com/ClickHouse/ClickHouse/issues/96407) — `port_offset` config parameter

### Prediction for the next version
Most likely near-term user-visible additions:
- **incremental statistics automation**
- **SQL compatibility/usability improvements** (`generate_series`, parser conveniences, JSON enhancements)
- **window/filter optimization**
- **distributed execution controls for parallel replicas**

Less certain but plausible:
- **Arrow Flight SQL**
- **experimental caching/serialization features**

## 7) User Feedback Summary

The most consistent user pain points in this snapshot are:

- **Upgrade risk from 25.12 to 26.x**, especially for ingestion-heavy systems:
  - [#99241](https://github.com/ClickHouse/ClickHouse/issues/99241)
- **Correctness over performance tradeoffs in newer planner/analyzer paths**:
  - [#78166](https://github.com/ClickHouse/ClickHouse/issues/78166)
  - [#100695](https://github.com/ClickHouse/ClickHouse/issues/100695)
  - [#101269](https://github.com/ClickHouse/ClickHouse/issues/101269)
- **Cloud object storage cost behavior**, not just raw functionality:
  - [#100960](https://github.com/ClickHouse/ClickHouse/issues/100960)
- **Lakehouse compatibility gaps**, especially on Azure-backed DeltaLake:
  - [#100438](https://github.com/ClickHouse/ClickHouse/issues/100438)
  - [#100502](https://github.com/ClickHouse/ClickHouse/issues/100502)
- **Desire for richer built-in SQL/data-preparation functions**:
  - [#54485](https://github.com/ClickHouse/ClickHouse/issues/54485)
  - [#98981](https://github.com/ClickHouse/ClickHouse/issues/98981)
  - [#81183](https://github.com/ClickHouse/ClickHouse/issues/81183)

The tone of feedback is not broadly negative about the project itself; rather, users are pushing ClickHouse deeper into **production ingestion, hybrid lakehouse access, distributed execution, and SQL-compatibility-sensitive workloads**. That is usually a sign of increasing adoption breadth.

## 8) Backlog Watch

These older items look important and still merit maintainer attention:

1. **Column statistics**
   - [Issue #55065](https://github.com/ClickHouse/ClickHouse/issues/55065)
   - Strategic importance is high; encouragingly, active implementation work now exists via [#101275](https://github.com/ClickHouse/ClickHouse/pull/101275).

2. **WSL/open-files rename issue**
   - [Issue #56288](https://github.com/ClickHouse/ClickHouse/issues/56288)
   - Long-lived operational bug with real user impact; still open since 2023.

3. **`resolveRelativeURL` function**
   - [Issue #54485](https://github.com/ClickHouse/ClickHouse/issues/54485)
   - Not critical, but its age and continued updates show durable user demand.

4. **Analyzer reads more rows than old planner**
   - [Issue #78166](https://github.com/ClickHouse/ClickHouse/issues/78166)
   - Important because it goes to trust in the newer analyzer for production workloads.

5. **Rolling hash functions**
   - [Issue #81183](https://github.com/ClickHouse/ClickHouse/issues/81183)
   - Niche but strategically interesting for data dedup/chunking and advanced text/data processing workloads.

6. **Arrow Flight SQL support**
   - [PR #91170](https://github.com/ClickHouse/ClickHouse/pull/91170)
   - High-value integration PR that may need sustained reviewer bandwidth due to protocol complexity.

7. **FSST serialization**
   - [PR #91416](https://github.com/ClickHouse/ClickHouse/pull/91416)
   - Experimental but potentially impactful; submodule changes and manual approval requirements may slow it down.

8. **Partial aggregate cache**
   - [PR #93757](https://github.com/ClickHouse/ClickHouse/pull/93757)
   - A substantial performance feature that likely needs deeper validation before merge.

## Bottom line

ClickHouse shows **excellent development velocity** and visible momentum in optimizer, distributed execution, statistics, and interoperability work. The main health risks today are **26.x regressions and correctness bugs**, especially where they affect ingestion performance, Decimal aggregations, or Azure DeltaLake semantics. If the team closes a few of these high-impact regressions quickly, project confidence should remain high heading into the next release cycle.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-31

## 1) Today’s Overview

DuckDB showed **high engineering activity** over the last 24 hours, with **51 PRs updated** and **17 issues updated**, even though **no new release** was published. The day was characterized by a mix of **query-correctness fixes, CLI usability work, extension/API hardening, and ongoing SQL engine refactors**, which is typical of a project stabilizing after a recent release series. A notable pattern is the number of reports involving **wrong results or regressions in 1.5.x**, suggesting the team is still actively burning down post-release edge cases. Overall, project health looks strong from an activity standpoint, but **correctness and regression management** remain the most important short-term quality focus.

---

## 3) Project Progress

### Merged/closed PRs today: what advanced

Several closed PRs indicate concrete progress on **stability, engine internals, and extension-facing APIs**:

- **ADBC memory-safety fix merged/closed**: [PR #21605](https://github.com/duckdb/duckdb/pull/21605) fixed a **use-after-free pattern** in multiple places in the ADBC path. This is important for client library reliability and suggests active hardening of non-SQL embedding interfaces.
- **Variant branch integration completed**: [PR #21720](https://github.com/duckdb/duckdb/pull/21720) merged `v1.5-variegata` into `main`, a strong signal that **variant-type related work** is being consolidated upstream.
- **Extension introspection API enhancements closed**:
  - [PR #21695](https://github.com/duckdb/duckdb/pull/21695) added read-only accessors for **BloomFilter/BFTableFilter**
  - [PR #21696](https://github.com/duckdb/duckdb/pull/21696) did the same for **PerfectHashJoinExecutor/PerfectHashJoinFilter**
  - [PR #21697](https://github.com/duckdb/duckdb/pull/21697) added accessors for **PrefixRangeFilter/PrefixRangeTableFilter**
  
  Together, these suggest progress toward making optimizer/runtime filter structures more visible to **extensions or external tooling**, which could enable better diagnostics, serialization, or distributed use cases.

- **Test infrastructure/backport work landed**: [PR #21708](https://github.com/duckdb/duckdb/pull/21708) improved the test runner’s loop iterator replacement syntax, indicating continued investment in test ergonomics and branch consistency.
- **Wrong-result fix attempt was discussed but closed**: [PR #21687](https://github.com/duckdb/duckdb/pull/21687) addressed the `LEFT JOIN LATERAL` pushdown bug from [Issue #21609](https://github.com/duckdb/duckdb/issues/21609), though the PR itself closed rather than merged, so the final fix may have landed another way or still be under internal iteration.

### In-progress work worth watching

- **Window function binding refactor**: [PR #21562](https://github.com/duckdb/duckdb/pull/21562) moves window binding logic into the binder and regularizes `LEAD`/`LAG`. This is foundational compiler/binder work that often unlocks correctness and feature consistency.
- **Semi HashJoin / IEJoin correctness work**:
  - [PR #21724](https://github.com/duckdb/duckdb/pull/21724)
  - [PR #21721](https://github.com/duckdb/duckdb/pull/21721)
  
  These point to ongoing optimizer/join algorithm refinement.
- **CLI SQL formatting support**: [PR #21725](https://github.com/duckdb/duckdb/pull/21725) would add a formatter to the bundled CLI, improving developer ergonomics.
- **Trigger catalog/introspection groundwork**: [PR #21438](https://github.com/duckdb/duckdb/pull/21438) adds catalog storage and introspection for `CREATE TRIGGER`, which is an important SQL compatibility signal even if execution semantics may still evolve.

---

## 4) Community Hot Topics

### 1. Arrow Flight SQL request remains a long-term integration signal
- **Issue**: [#3099 FR: implement Arrow Flight SQL](https://github.com/duckdb/duckdb/issues/3099)
- **Engagement**: 16 comments, 18 👍

This is the most reacted-to item in the updated set and reflects persistent demand for **high-performance client/server interoperability using Arrow-native transport**. The underlying technical need is clear: users want DuckDB to participate more naturally in **remote analytics, federated query serving, and Arrow ecosystem workflows**. Even though DuckDB is primarily embedded, sustained interest here suggests users increasingly want **service-oriented access patterns** without giving up Arrow columnar efficiency.

### 2. S3 partitioned COPY memory use
- **Issue**: [#11817 Out-of-memory error when performing partitioned copy to S3](https://github.com/duckdb/duckdb/issues/11817)
- **Engagement**: 14 comments, 9 👍

This issue highlights a key production need: **predictable memory behavior during cloud export pipelines**, especially with Hive partitioning. The technical demand is for a more streaming-oriented or bounded-memory implementation of partitioned `COPY` to object storage. This is especially relevant for DuckDB’s growing usage in ELT and lakehouse workflows.

### 3. Database file growth concerns
- **Issue**: [#17778 .duckdb file size growing](https://github.com/duckdb/duckdb/issues/17778)
- **Engagement**: 15 comments

This reflects user concern around **storage growth and space reclamation behavior**, especially in cache-like workloads with large JSON payloads. The deeper need here is better operator guidance or tooling around **vacuum/checkpoint/compaction expectations**, particularly for application-embedded deployments.

### 4. CLI regressions on Windows
- **Issues**:
  - [#21378 duckdb cli 1.5.x ".tables" / "-table" output issues](https://github.com/duckdb/duckdb/issues/21378)
  - [#21585 Duckdb 1.5.0 CLI does not prompt correctly on Windows 11](https://github.com/duckdb/duckdb/issues/21585)
  - [#21571 Windows 11 admin shells show random characters](https://github.com/duckdb/duckdb/issues/21571)

These cluster into a broader theme: **CLI portability and terminal compatibility**, especially on Windows shells. The technical need is not query-engine functionality, but **robust REPL behavior across console implementations**, which matters for first impressions and local developer workflows.

### 5. SQL ergonomics and JSON functionality
- **PR**: [#21668 Add `json_merge_patch_diff()`](https://github.com/duckdb/duckdb/pull/21668)

While still open with changes requested, this indicates continued user demand for richer **document-style SQL functions**, especially around JSON patching and diff workflows.

---

## 5) Bugs & Stability

Below is a severity-ranked view of the most important bugs updated today.

### Critical: wrong results / potential silent data corruption

1. **`row_number() OVER (PARTITION BY ...)` silently swaps column values**
   - [Issue #21722](https://github.com/duckdb/duckdb/issues/21722)
   - Severity: **Critical**
   
   This is the most serious report in today’s set because it describes **silent value swapping** when `PARTITION BY` order differs from table column order. If confirmed, this is a classic **data corruption/wrong-result** class bug, especially dangerous because it may not throw an error.

2. **`SELECT DISTINCT` in CTE with `LEFT JOIN` on empty table intermittently returns wrong results**
   - [Issue #21719](https://github.com/duckdb/duckdb/issues/21719)
   - Severity: **Critical**
   
   Intermittent wrong results in a `DISTINCT` + CTE + join pipeline point to a planner/optimizer bug. These are high priority because they undermine trust in analytical correctness.

3. **`LEFT JOIN LATERAL ... ON TRUE` preserved rows incorrectly despite `IS NOT NULL` filter**
   - [Issue #21609](https://github.com/duckdb/duckdb/issues/21609)
   - Severity: **High**
   - Fix activity: [PR #21687](https://github.com/duckdb/duckdb/pull/21687) attempted a fix
   
   This was closed today and appears to have received engineering attention quickly, which is a good sign for responsiveness on correctness bugs.

4. **CTE / `ROW_NUMBER()` predicate pushdown internal bind failure on mixed `VARCHAR` and `DATE`**
   - [Issue #21560](https://github.com/duckdb/duckdb/issues/21560)
   - Severity: **High**
   
   Although framed as an internal error, the summary suggests binder confusion caused by pushdown. This is another sign that **window-function and pushdown paths** are active regression surfaces.

### High: crashes / memory safety

5. **ADBC heap-use-after-free with prepared statements**
   - [Issue #21626](https://github.com/duckdb/duckdb/issues/21626)
   - Severity: **High**
   - Related fix: [PR #21605](https://github.com/duckdb/duckdb/pull/21605)
   
   Memory safety bugs in API bindings are serious, but this one has an apparent fix already closed, which reduces immediate risk.

6. **Arrow format string parsing crash on parameterized types**
   - [Issue #21691](https://github.com/duckdb/duckdb/issues/21691)
   - Severity: **High**
   
   This impacts Arrow interoperability and type parsing robustness. It is not as broadly dangerous as a wrong-result core SQL bug, but it matters for ecosystem integrations.

### Medium: regressions / resource behavior / performance

7. **Partitioned `COPY` to S3 causes OOM**
   - [Issue #11817](https://github.com/duckdb/duckdb/issues/11817)
   - Severity: **Medium-High**
   
   This is a practical blocker for cloud exports under constrained memory settings.

8. **Too many open files with `read_parquet ... LIMIT`**
   - [Issue #18831](https://github.com/duckdb/duckdb/issues/18831)
   - Severity: **Medium**
   
   The `LIMIT` sensitivity suggests planner/executor behavior that prevents expected file-handle pruning.

9. **Regression with `TIMESTAMPTZ` in macros**
   - [Issue #21682](https://github.com/duckdb/duckdb/issues/21682)
   - Severity: **Medium**
   
   Timezone correctness and macro expansion remain subtle areas; this is likely important for analytical SQL portability.

10. **Column update-to-NULL performance collapse**
    - [Issue #21675](https://github.com/duckdb/duckdb/issues/21675)
    - Severity: **Medium**
    
    Going from seconds to minutes, especially around indexed tables, points to a possible write-path or index-maintenance inefficiency.

### Lower severity but visible usability bugs

11. **CLI Windows prompt/rendering issues**
    - [#21585](https://github.com/duckdb/duckdb/issues/21585), [#21571](https://github.com/duckdb/duckdb/issues/21571), [#21378](https://github.com/duckdb/duckdb/issues/21378)

These are not engine blockers, but they affect daily usability and may disproportionately impact new users.

---

## 6) Feature Requests & Roadmap Signals

### Active user-requested features

- **Arrow Flight SQL support**
  - [Issue #3099](https://github.com/duckdb/duckdb/issues/3099)
  
  Longstanding demand suggests continued interest, but this still feels more like a **strategic ecosystem feature** than something imminent for the next patch release.

- **`json_merge_patch_diff()`**
  - [PR #21668](https://github.com/duckdb/duckdb/pull/21668)
  
  This is one of the clearest near-term feature candidates because it already has code and a concrete SQL surface area. If accepted after review, it could land in a forthcoming minor release.

- **CLI SQL formatting**
  - [PR #21725](https://github.com/duckdb/duckdb/pull/21725)
  
  This looks relatively self-contained and user-visible. It has a good chance of appearing soon, especially since it builds on the bundled CLI extension setup.

- **`CREATE TRIGGER` catalog storage and introspection**
  - [PR #21438](https://github.com/duckdb/duckdb/pull/21438)
  
  This is a strong roadmap signal around **SQL DDL completeness and metadata introspection**, though full trigger support may require more than this PR alone.

- **Variant compatibility controls**
  - [PR #21710](https://github.com/duckdb/duckdb/pull/21710)
  
  Reintroducing a legacy encoding setting implies the team is actively dealing with **Parquet/Variant interoperability** and the realities of ecosystem adoption lag.

### Likely next-version candidates

Most likely to appear in the next version or patch:
1. **Correctness fixes** for window functions, lateral joins, and distinct/join regressions
2. **CLI improvements**, especially formatting and Windows behavior
3. **ADBC/Arrow safety and compatibility fixes**
4. Potentially **JSON utility additions** if review converges quickly

Less likely near-term:
- Full **Arrow Flight SQL** implementation
- Fully mature **trigger support** beyond metadata/catalog groundwork

---

## 7) User Feedback Summary

### Main user pain points visible today

- **Trust in query correctness**: Several reports describe wrong results or silent misbehavior rather than explicit failures. This is the most important quality signal in the current dataset.
- **Cloud/lakehouse operational limits**: Users exporting partitioned data to **S3** want lower and more predictable memory overhead.
- **Embedded-app storage management**: The `.duckdb` growth issue shows DuckDB is being used as a **local cache/application database**, not just for ad hoc analytics, and users need better expectations around file compaction behavior.
- **Windows CLI compatibility**: Terminal rendering and prompt bugs remain a recurring friction point.
- **Interoperability with Arrow/ADBC/Parquet**: Crashes and compatibility flags indicate a heavy user base building around the broader analytical data ecosystem.

### Positive signals

- Maintainers appear **responsive** on reported regressions, with several issues closed quickly and related PRs appearing within days.
- There is visible investment in **engine internals, binder cleanup, and test infrastructure**, all of which usually improve medium-term stability.
- The project continues to expand beyond core SQL execution into **developer ergonomics, extension APIs, and interoperability features**.

---

## 8) Backlog Watch

These items look important and deserving of maintainer attention due to age, impact, or strategic significance:

1. **[Issue #11817](https://github.com/duckdb/duckdb/issues/11817) — OOM during partitioned `COPY` to S3**
   - Open since 2024-04-24
   - Under review
   - Important for production cloud export workloads

2. **[Issue #3099](https://github.com/duckdb/duckdb/issues/3099) — Arrow Flight SQL**
   - Opened 2022-02-16, now closed, but strategically significant enough to keep watching as a roadmap signal
   - High community interest suggests demand remains even if the exact issue is closed administratively

3. **[Issue #18831](https://github.com/duckdb/duckdb/issues/18831) — Too many open files with `read_parquet ... LIMIT`**
   - Open since 2025-09-02
   - Under review / needs documentation
   - Important for large directory scans and file-handle management

4. **[PR #21438](https://github.com/duckdb/duckdb/pull/21438) — `CREATE TRIGGER` catalog storage and introspection**
   - Open since 2026-03-17
   - Significant SQL feature surface area; worth maintainer guidance to avoid drift

5. **[PR #21562](https://github.com/duckdb/duckdb/pull/21562) — Window Function Binding**
   - Open since 2026-03-23
   - Foundational binder refactor likely tied to several recent window-function correctness issues

6. **[PR #21668](https://github.com/duckdb/duckdb/pull/21668) — `json_merge_patch_diff()`**
   - Open with changes requested
   - Valuable feature, but needs maintainer decision to avoid lingering in review

---

## Linked items referenced

### Issues
- [#3099 FR: implement Arrow Flight SQL](https://github.com/duckdb/duckdb/issues/3099)
- [#17778 .duckdb file size growing](https://github.com/duckdb/duckdb/issues/17778)
- [#11817 Out-of-memory error when performing partitioned copy to S3](https://github.com/duckdb/duckdb/issues/11817)
- [#21378 CLI `.tables` / `-table` issues](https://github.com/duckdb/duckdb/issues/21378)
- [#21618 Attach string reused on second connection](https://github.com/duckdb/duckdb/issues/21618)
- [#18831 Too many open files read_parquet with LIMIT](https://github.com/duckdb/duckdb/issues/18831)
- [#21717 Cannot create an empty variant object](https://github.com/duckdb/duckdb/issues/21717)
- [#21585 CLI prompt issue on Windows 11](https://github.com/duckdb/duckdb/issues/21585)
- [#21626 ADBC heap-use-after-free](https://github.com/duckdb/duckdb/issues/21626)
- [#21675 Column set to NULL performance issue](https://github.com/duckdb/duckdb/issues/21675)
- [#21609 LEFT JOIN LATERAL wrong-result bug](https://github.com/duckdb/duckdb/issues/21609)
- [#21571 Windows admin shell random characters](https://github.com/duckdb/duckdb/issues/21571)
- [#21560 Internal bind error with mixed VARCHAR/DATE](https://github.com/duckdb/duckdb/issues/21560)
- [#21691 Arrow format parsing crash](https://github.com/duckdb/duckdb/issues/21691)
- [#21722 row_number/PARTITION BY silent column swap regression](https://github.com/duckdb/duckdb/issues/21722)
- [#21719 DISTINCT-in-CTE wrong results](https://github.com/duckdb/duckdb/issues/21719)
- [#21682 Regression with timestamptz in macros](https://github.com/duckdb/duckdb/issues/21682)

### PRs
- [#21605 fix(adbc): err use after free](https://github.com/duckdb/duckdb/pull/21605)
- [#21724 Semi HashJoin Fix](https://github.com/duckdb/duckdb/pull/21724)
- [#21716 Fix `is_histogram_other_bin` null handling](https://github.com/duckdb/duckdb/pull/21716)
- [#21710 Re-add removed `variant_legacy_encoding` setting](https://github.com/duckdb/duckdb/pull/21710)
- [#21725 Add support for formatting SQL statements to the CLI](https://github.com/duckdb/duckdb/pull/21725)
- [#21668 Add `json_merge_patch_diff()`](https://github.com/duckdb/duckdb/pull/21668)
- [#21673 Return inf/nan instead of throwing for stddev/variance overflow](https://github.com/duckdb/duckdb/pull/21673)
- [#21438 Add catalog storage and introspection for CREATE TRIGGER](https://github.com/duckdb/duckdb/pull/21438)
- [#21562 Window Function Binding](https://github.com/duckdb/duckdb/pull/21562)
- [#21687 Preserve LEFT LATERAL filters during pushdown](https://github.com/duckdb/duckdb/pull/21687)
- [#21720 Merge `v1.5-variegata` into main](https://github.com/duckdb/duckdb/pull/21720)
- [#21723 Merge code quality CI jobs into main workflow](https://github.com/duckdb/duckdb/pull/21723)
- [#21721 IEJoin Filter Sides](https://github.com/duckdb/duckdb/pull/21721)
- [#21708 Test runner loop replacement syntax](https://github.com/duckdb/duckdb/pull/21708)
- [#21718 Fix update plans when deserializing](https://github.com/duckdb/duckdb/pull/21718)
- [#21699 Suggest matching DROP statements on catalog type mismatch](https://github.com/duckdb/duckdb/pull/21699)

If you want, I can also turn this into a **short executive summary**, a **maintainer-focused risk report**, or a **weekly trend-style digest**.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-31

## 1) Today’s Overview

StarRocks remained highly active over the last 24 hours, with **37 issues updated** and **115 PRs updated**, plus **one new release**. The engineering signal is strong: most PR activity is concentrated around **query optimizer statistics**, **storage/compaction correctness**, **aggregate-function refactoring**, and **branch backports**, which suggests disciplined maintenance across supported versions. At the same time, today’s issue stream surfaced several **high-severity security and correctness concerns**, especially around **authentication gaps in BE services** and **transaction replay behavior**. Overall project health looks **operationally active and release-oriented**, but maintainers may need to prioritize security triage and a few lingering correctness bugs.

---

## 2) Releases

## Release: [3.5.15](https://github.com/StarRocks/starrocks)

### Notable change
- **Behavior change in `sql_mode` handling** via [#70004](https://github.com/StarRocks/starrocks/pull/70004)
  - When `DIVISION_BY_ZERO` or `FAIL_PARSE_DATE` is enabled, StarRocks now returns **errors** for:
    - division by zero
    - date parse failures in `str_to_date` / `str2date`
  - Previously these cases could be **silently ignored**.

### Breaking-change / compatibility impact
This is a **behavioral compatibility change** rather than a schema or API break, but it can affect production SQL workloads that relied on permissive behavior. Queries, ETL jobs, or BI tools that previously completed with null-ish or ignored failures may now fail fast under strict SQL modes.

### Migration notes
- Review pipelines that enable:
  - `DIVISION_BY_ZERO`
  - `FAIL_PARSE_DATE`
- Re-test:
  - ingestion SQL
  - transformation jobs
  - materialized view definitions
  - application SQL depending on `str_to_date` / `str2date`
- If upgrading patch versions in 3.5, treat this as a **semantic change** and validate strict-mode jobs before rollout.

---

## 3) Project Progress

Today’s merged/closed PR flow shows progress in three main areas: **query planning/statistics**, **aggregate engine refactoring**, and **storage/runtime correctness**.

### Query optimizer and statistics
- [#70991](https://github.com/StarRocks/starrocks/pull/70991) — **Implement IS NULL predicate stats with MCVs**
  - Improves cardinality estimation for `IS NULL` predicates by incorporating **most-common values (MCVs)**.
  - This is a meaningful optimizer enhancement because null selectivity often strongly affects join order and filter placement.
- [#70966](https://github.com/StarRocks/starrocks/pull/70966) — **Use explicit cast in skew rules for MCVs**
  - Fixes type handling in skew optimization logic, reducing risk of wrong planning behavior when skewed values are not strings.
- [#71000](https://github.com/StarRocks/starrocks/pull/71000) — **Implement MCV propagation for If and constants** (open, but directionally important)
  - Signals continued investment in better selectivity modeling.

### Aggregate/function engine refactoring
A cluster of merged and backported PRs continues the refactor chain around large binary handling and aggregate containers:
- [#70805](https://github.com/StarRocks/starrocks/pull/70805) — append column values for large binary
- [#70826](https://github.com/StarRocks/starrocks/pull/70826) — split `ArrayAggAggregateState` by fixed-length vs string
- [#70789](https://github.com/StarRocks/starrocks/pull/70789) — add template `murmur_hash64A`
- [#70782](https://github.com/StarRocks/starrocks/pull/70782) — `GetContainer` for large binary checks in agg functions
- [#70765](https://github.com/StarRocks/starrocks/pull/70765) — `AggDataTypeTraits` support `append_values`
- [#70993](https://github.com/StarRocks/starrocks/pull/70993), [#71002](https://github.com/StarRocks/starrocks/pull/71002), [#71003](https://github.com/StarRocks/starrocks/pull/71003), [#71004](https://github.com/StarRocks/starrocks/pull/71004), [#71006](https://github.com/StarRocks/starrocks/pull/71006), [#71007](https://github.com/StarRocks/starrocks/pull/71007) — backports/refactors across release lines

This pattern suggests maintainers are cleaning up internal abstractions to better support **large binary columns**, likely improving long-term maintainability and reducing edge-case bugs in aggregation code paths.

### Storage correctness and observability
- [#71001](https://github.com/StarRocks/starrocks/pull/71001) — **Fix delvec orphan entries caused by write-before-compaction in same publish batch** (open)
  - Important storage-layer correctness fix in progress for shared/lake-style mutation metadata.
- [#70735](https://github.com/StarRocks/starrocks/pull/70735) — **Report `be_tablets` DATA_SIZE as rowset column data bytes** (open)
  - Improves metric semantics by aligning reported tablet size with rowset column data rather than broader footprint.
- [#70976](https://github.com/StarRocks/starrocks/pull/70976) — backport for **NullableColumns sharing the same NullColumn**
  - Indicates ongoing hardening around column memory/layout correctness.

---

## 4) Community Hot Topics

Below are the most discussed or most meaningful active items from today’s feed.

### 1. SQL-backed metadata for Kubernetes HA
- [Issue #62005](https://github.com/StarRocks/starrocks/issues/62005) — **Use SQL database to store StarRocks meta**  
  Comments: 5, 👍 3, now closed/stale
- Underlying need:
  - Users running StarRocks in **Kubernetes/shared infrastructure** want easier metadata HA than local-FS-based FE metadata management.
  - This reflects demand for a more cloud-native control plane, similar to systems that externalize metadata to SQL or consensus-friendly stores.
- Interpretation:
  - Even though stale/closed, this is a strategically important signal for operators who want simpler FE durability and failover.

### 2. Iceberg onboarding and external table performance
- [Issue #63220](https://github.com/StarRocks/starrocks/issues/63220) — **IceBerg quickstart is slow**
  Comments: 3, 👍 1
- [Issue #71005](https://github.com/StarRocks/starrocks/issues/71005) — **Iceberg: skip files before open() using runtime filter min/max vs manifest column stats**
- Underlying need:
  - Users expect StarRocks to deliver not just compatibility with Iceberg, but also **excellent startup latency and file-pruning efficiency**.
- Interpretation:
  - Iceberg remains a major roadmap direction. The new runtime-filter/manifest-stats idea is exactly the kind of optimization that can materially improve star-schema federated analytics.

### 3. Query plan correctness bug
- [Issue #67665](https://github.com/StarRocks/starrocks/issues/67665) — **Invalid query plan caused by `prunedPartitionPredicates` containing required column**
  Comments: 3, closed
- Underlying need:
  - Optimizer rewrites and partition pruning must preserve semantic correctness, especially in complex scan plans.
- Interpretation:
  - Closure suggests maintainers are still responsive to plan correctness regressions, which is critical for trust in the CBO.

### 4. Shared-data compaction instability
- [Issue #63632](https://github.com/StarRocks/starrocks/issues/63632) — **Fail to compact tablet - invalid pos**
  Comments: 3
- Underlying need:
  - Users in shared-data mode need compaction to be resilient, especially when using features like `enable_json_flat = true`.
- Interpretation:
  - This is a significant operational issue because it can cause endless retries and block storage maintenance.

### 5. Export/unload ergonomics
- [Issue #63328](https://github.com/StarRocks/starrocks/issues/63328) — **insert into files support csv compression**
  Comments: 2, 👍 4
- Underlying need:
  - Lower egress/storage cost and better interoperability for unload workflows.
- Interpretation:
  - Small feature, but clear practical value; reaction count suggests user interest exceeds comment volume.

---

## 5) Bugs & Stability

### Highest severity: security/authentication exposures reported today
These deserve immediate maintainer attention.

#### Critical
1. [Issue #70948](https://github.com/StarRocks/starrocks/issues/70948) — **Arrow Flight result fetch is effectively unauthenticated on BE port**
   - Risk: unauthorized query-result retrieval path on BE Flight service.
   - Fix PR: not shown in provided data.

2. [Issue #70947](https://github.com/StarRocks/starrocks/issues/70947) — **Transaction stream-load follow-up requests are not re-authenticated**
   - Risk: commit/rollback requests may bypass auth after authenticated begin.
   - Fix PR: not shown.

3. [Issue #70946](https://github.com/StarRocks/starrocks/issues/70946) — **Unauthenticated `POST /api/update_config` can mutate live BE configuration**
   - Risk: remote mutation of live backend config.
   - Fix PR: not shown.

4. [Issue #70945](https://github.com/StarRocks/starrocks/issues/70945) — **Unauthenticated `GET /api/_stop_be` can remotely shut down a BE node**
   - Risk: remote denial-of-service via backend shutdown.
   - Fix PR: not shown.

These four items all point to a common underlying concern: **BE HTTP / service endpoints may not consistently enforce authentication and authorization**. Even though they are labeled `[source:ai-detected]`, each claim maps to concrete file paths and security-sensitive behavior, so they should be triaged urgently.

### Critical correctness / durability
5. [Issue #70942](https://github.com/StarRocks/starrocks/issues/70942) — **Replay compatibility broken for INSERT loads: txn replay callbacks are empty**
   - Risk: FE crash/restart may leave insert-load replay behavior incomplete or inconsistent.
   - No corresponding fix PR listed.

6. [Issue #70944](https://github.com/StarRocks/starrocks/issues/70944) — **PK-index fast path ignores snapshot version, violating REPEATABLE READ isolation**
   - Risk: transactional snapshot semantics may be violated for primary-key reads.
   - No fix PR listed.
   - This is one of the most important correctness issues in the current set.

7. [PR #71001](https://github.com/StarRocks/starrocks/pull/71001) — **Fix delvec orphan entries caused by write-before-compaction in same publish batch**
   - In-progress fix for storage metadata inconsistency.
   - Suggests maintainers are actively addressing subtle mutation/compaction races.

### Other active bugs
8. [Issue #63632](https://github.com/StarRocks/starrocks/issues/63632) — **Compaction failure with invalid pos**
   - Operationally serious in shared-data clusters.

9. [Issue #63524](https://github.com/StarRocks/starrocks/issues/63524) — **`parse_url` returns wrong result**
   - SQL function correctness issue.

10. [Issue #63550](https://github.com/StarRocks/starrocks/issues/63550) — **analysis query on iceberg catalog returns wrong result**
   - External catalog query correctness.

11. [Issue #63682](https://github.com/StarRocks/starrocks/issues/63682) — **support Decimal256 in view**
   - Type-system/view support gap causing functional breakage.

12. [Issue #63730](https://github.com/StarRocks/starrocks/issues/63730) — **`auto_increment` not reported in `information_schema.columns.EXTRA`**
   - Metadata compatibility issue affecting tooling introspection.

13. [Issue #63522](https://github.com/StarRocks/starrocks/issues/63522) — **Mockito exception under JDK 21/23**
   - Primarily contributor/test-environment stability rather than end-user runtime bug.

---

## 6) Feature Requests & Roadmap Signals

Several user requests reveal where users want StarRocks to improve next.

### Strong roadmap signals

#### Iceberg scan pruning and external lakehouse acceleration
- [Issue #71005](https://github.com/StarRocks/starrocks/issues/71005)
- Likelihood: **high**
- Why:
  - StarRocks is clearly investing in Iceberg.
  - Runtime filter + manifest stats pruning is a high-impact optimization aligned with its OLAP positioning.

#### Kafka connector type mapping and schema evolution
- [Issue #63735](https://github.com/StarRocks/starrocks/issues/63735)
- Likelihood: **medium-high**
- Why:
  - Better Debezium/Kafka logical type support is a common enterprise need.
  - Connector completeness is often a competitive differentiator for real-time analytics.

#### CSV compression for `INSERT INTO FILES`
- [Issue #63328](https://github.com/StarRocks/starrocks/issues/63328)
- Likelihood: **medium**
- Why:
  - Straightforward usability enhancement with visible user demand.
  - Especially useful for data export/unload pipelines to object storage.

#### Explain return type / introspection improvements
- [Issue #63716](https://github.com/StarRocks/starrocks/issues/63716)
- Likelihood: **medium**
- Why:
  - Better planner/type introspection helps BI, SQL IDEs, and migration tooling.

#### Faster table duplication / clone-like semantics
- [Issue #63609](https://github.com/StarRocks/starrocks/issues/63609)
- Likelihood: **medium-low**
- Why:
  - Valuable for large-table workflows, but may require deeper storage semantics than a small feature add.

### Longer-horizon architectural asks
#### SQL database as metadata store
- [Issue #62005](https://github.com/StarRocks/starrocks/issues/62005)
- Likelihood: **low near-term, high strategic importance**
- Why:
  - Significant architectural change with HA implications.
  - More likely as a long-range cloud-native initiative than a near release item.

---

## 7) User Feedback Summary

Today’s issue set shows several recurring user pain points:

### 1. External lakehouse usability still matters as much as raw performance
- [#63220](https://github.com/StarRocks/starrocks/issues/63220), [#63550](https://github.com/StarRocks/starrocks/issues/63550), [#71005](https://github.com/StarRocks/starrocks/issues/71005)
- Users want:
  - faster Iceberg onboarding
  - correct query answers on external catalogs
  - better file pruning and lower scan startup cost

### 2. Shared-data mode introduces operational sharp edges
- [#63632](https://github.com/StarRocks/starrocks/issues/63632), [#70941](https://github.com/StarRocks/starrocks/issues/70941), [#71001](https://github.com/StarRocks/starrocks/pull/71001)
- Users are hitting:
  - compaction failures
  - lock/lifecycle issues
  - metadata consistency races
- This suggests shared-data deployments remain a fast-moving but delicate area.

### 3. SQL compatibility and metadata fidelity remain important for adoption
- [#63730](https://github.com/StarRocks/starrocks/issues/63730), [#63524](https://github.com/StarRocks/starrocks/issues/63524), [#63682](https://github.com/StarRocks/starrocks/issues/63682)
- Users care about:
  - MySQL-compatible metadata reporting
  - built-in function correctness
  - expanded type support in views and connectors

### 4. Operators want cloud-native manageability
- [#62005](https://github.com/StarRocks/starrocks/issues/62005)
- The request for SQL-backed metadata reflects a broader desire for simpler HA management in Kubernetes.

### 5. Contributor experience also matters
- [#63522](https://github.com/StarRocks/starrocks/issues/63522)
- JDK 21/23 test issues show the project may need some modernization around newer Java dev environments.

---

## 8) Backlog Watch

These items appear important but insufficiently advanced, stale, or still open despite real user impact.

### Needs maintainer attention

1. [Issue #63632](https://github.com/StarRocks/starrocks/issues/63632) — **Compaction failure in shared-data cluster**
   - Long-lived open bug with operational impact.
   - Infinite retry behavior makes this more than a cosmetic defect.

2. [Issue #63550](https://github.com/StarRocks/starrocks/issues/63550) — **Wrong result on iceberg catalog**
   - Wrong-result bugs should generally rank high because they erode trust faster than performance bugs.

3. [Issue #63730](https://github.com/StarRocks/starrocks/issues/63730) — **`auto_increment` missing from `information_schema`**
   - Important for ecosystem/tooling compatibility.

4. [Issue #63735](https://github.com/StarRocks/starrocks/issues/63735) — **Kafka connector type mapping and schema evolution**
   - Connector maturity is often decisive in production adoption.

5. [Issue #63328](https://github.com/StarRocks/starrocks/issues/63328) — **CSV compression support for unload**
   - Clear user value and above-average reactions.

6. [Issue #63220](https://github.com/StarRocks/starrocks/issues/63220) — **Iceberg quickstart is slow**
   - Useful documentation/perf feedback that can improve first-run experience.

7. [Issue #62005](https://github.com/StarRocks/starrocks/issues/62005) — **SQL metadata store for HA**
   - Closed as stale, but strategically important enough to revisit in a design discussion or roadmap issue.

### Immediate triage queue
The newly opened security/correctness issues should likely supersede normal backlog priority:
- [#70948](https://github.com/StarRocks/starrocks/issues/70948)
- [#70947](https://github.com/StarRocks/starrocks/issues/70947)
- [#70946](https://github.com/StarRocks/starrocks/issues/70946)
- [#70945](https://github.com/StarRocks/starrocks/issues/70945)
- [#70944](https://github.com/StarRocks/starrocks/issues/70944)
- [#70942](https://github.com/StarRocks/starrocks/issues/70942)
- [#70941](https://github.com/StarRocks/starrocks/issues/70941)

---

## Bottom line

StarRocks had a **strong maintenance-and-release day**, with active refactoring, optimizer work, and cross-branch backports supporting platform maturity. The **3.5.15** release introduces a meaningful SQL-mode behavior tightening that users should validate carefully. The biggest risk to short-term project health is not velocity but **triage quality**: several **critical security and isolation/correctness issues** appeared today and warrant prompt validation and response. Strategically, Iceberg performance, connector completeness, and cloud-native operability remain the clearest roadmap signals.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-31

## 1. Today's Overview

Apache Iceberg showed **strong pull request activity** over the last 24 hours, with **44 PRs updated** versus **9 issues updated**, indicating the project remains highly implementation-focused even without a new release. The day’s work concentrated on **Spark, Flink, REST catalog APIs, security backports, and specification cleanup**, while a handful of user-reported bugs exposed ongoing friction in **Kafka Connect, Spark packaging, and identifier-field handling**. Two issues and several PRs were closed, but most active work remains in-flight, suggesting **healthy throughput with a still-substantial review backlog**. Overall, project health looks solid, with continued investment in engine integration and catalog interoperability, though connector and packaging quality remain visible pain points.

---

## 3. Project Progress

_No new release was published today._

### Merged/closed PRs today and what they advanced

Even though no major feature PR merged today in the provided data, several closed PRs show where maintainers are spending cleanup and stabilization effort:

- **Spark option validation fix**
  - PR [#15828](https://github.com/apache/iceberg/pull/15828) — *Spark: Fix option validation in RewritePositionDeleteFilesSparkAction*
  - This corrected option validation logic in a Spark maintenance action. The immediate impact is limited because current position-delete runners do not expose exclusive runner options, but it improves **future correctness and extensibility** of Spark maintenance tooling.

- **Security backport path is active**
  - Issue [#15378](https://github.com/apache/iceberg/issues/15378) was closed, and related backport work is open in PR [#15829](https://github.com/apache/iceberg/pull/15829).
  - This indicates Iceberg is actively addressing **CVE-2025-67721** in `io.airlift:aircompressor` for Kafka Connect/OpenAPI/Kafka Connect-related distribution artifacts, especially on **1.10.x**.

- **Stale PR cleanup**
  - Closed PRs [#15397](https://github.com/apache/iceberg/pull/15397), [#15391](https://github.com/apache/iceberg/pull/15391), [#15379](https://github.com/apache/iceberg/pull/15379), and [#15210](https://github.com/apache/iceberg/pull/15210) show maintainers are pruning or parking work around **CI infrastructure**, **AWS/S3 compatibility**, and **resource cleanup in S3 IO**.
  - This is a mixed signal: backlog hygiene is good, but some operational/storage improvements are not yet landing.

### In-progress advances worth noting

These open PRs are stronger signals for medium-term progress:

- **Spark SQL / DSv2 optimization**
  - PR [#14948](https://github.com/apache/iceberg/pull/14948) — Spark 4.1 `SupportsReportOrdering`
  - Important for **sort elimination** and better optimizer cooperation in Spark 4.1.

- **Spark statistics quality**
  - PR [#15693](https://github.com/apache/iceberg/pull/15693) — use actual file sizes for table statistics
  - A potentially meaningful **query planning improvement**, reducing bad join choices caused by schema-based row-size estimates.

- **Flink dynamic sink configurability**
  - PR [#15780](https://github.com/apache/iceberg/pull/15780)
  - Expands **SQL-level configurability** for dynamic sink behavior, a notable usability improvement for streaming deployments.

- **REST catalog relation loading**
  - PRs [#15830](https://github.com/apache/iceberg/pull/15830) and [#15831](https://github.com/apache/iceberg/pull/15831)
  - These advance **table/view unified loading APIs**, important groundwork for broader relational-object support, including future materialized views.

- **Manifest/spec evolution**
  - PR [#15049](https://github.com/apache/iceberg/pull/15049)
  - Foundational work for **V4 manifest support** and adaptive metadata structures remains active.

---

## 4. Community Hot Topics

### 1) Kafka Connect sink behavior under dynamic routing
- Issue [#13457](https://github.com/apache/iceberg/issues/13457) — *Kafka Connect sink fails to write snapshot when using dynamic routing with SMTs*
- 9 comments, 3 👍
- This is the most visibly engaged issue in the current set. It points to real-world use of Iceberg in **streaming ingestion pipelines** where Kafka Connect plus SMTs drives dynamic table routing. The underlying technical need is **robust commit/snapshot handling when table identity is transformed at runtime**, which is critical for multi-tenant or event-router architectures.

### 2) Security remediation for Kafka Connect distribution
- Issue [#15378](https://github.com/apache/iceberg/issues/15378) — closed
- PR [#15829](https://github.com/apache/iceberg/pull/15829) — *[1.10.x] Fix CVE-2025-67721 in io.airlift:aircompressor*
- This shows users are scrutinizing Iceberg’s packaged dependencies, especially in connector distributions. The demand here is for **faster security patch propagation into supported release branches**.

### 3) Spark 2 assumptions cleanup after de-support
- Issue [#15821](https://github.com/apache/iceberg/issues/15821)
- PR [#15823](https://github.com/apache/iceberg/pull/15823)
- This is a low-friction but important maintenance topic. It signals the project is still removing historical compatibility scaffolding and simplifying the Spark codebase around **Spark 3+/4+ reality**.

### 4) REST catalog API broadening to relations
- PR [#15830](https://github.com/apache/iceberg/pull/15830)
- PR [#15831](https://github.com/apache/iceberg/pull/15831)
- These are roadmap-significant. They reflect a push toward a **more unified catalog abstraction** for tables, views, and eventually materialized views, reducing engine-specific API gaps.

### 5) Long-running specification work on materialized views
- PR [#11041](https://github.com/apache/iceberg/pull/11041)
- This remains one of the clearest strategic signals in the backlog. The technical need is obvious: users want **first-class materialized view semantics** in Iceberg-native metadata and catalogs.

---

## 5. Bugs & Stability

### Highest severity

1. **Kafka Connect snapshot write failure with dynamic routing and SMTs**
   - Issue [#13457](https://github.com/apache/iceberg/issues/13457)
   - Severity: **High**
   - Why: This can break production ingestion patterns in Kafka Connect and may prevent snapshot commits entirely under dynamic routing.
   - Fix status: **No linked PR in provided data**

2. **Unable to read data when nested field is used as identifier**
   - Issue [#15826](https://github.com/apache/iceberg/issues/15826)
   - Severity: **High**
   - Why: This appears to be a **query correctness/read-path failure** affecting valid table definitions with nested identifier fields. `select *` works, but column projection fails, suggesting a planner or schema-resolution bug.
   - Fix status: **No linked PR in provided data**

3. **Flink DynamicIcebergSink does not inherit upstream parallelism**
   - Issue [#15827](https://github.com/apache/iceberg/issues/15827)
   - Severity: **Medium-High**
   - Why: This is a streaming execution correctness/performance bug. It may not corrupt data, but unexpected parallelism fallback can severely affect throughput, resource usage, and job behavior.
   - Fix status: No direct fix PR linked, though related sink configurability work exists in PR [#15780](https://github.com/apache/iceberg/pull/15780)

### Medium severity

4. **Empty sources and Javadoc JARs for `iceberg-spark-runtime-4.0_2.13`**
   - Issue [#15824](https://github.com/apache/iceberg/issues/15824)
   - Severity: **Medium**
   - Why: This is a packaging/distribution quality issue. It does not break runtime execution, but it hurts **developer usability, IDE support, debugging, and API adoption**.

5. **Spark views created as tables in hive-type catalogs**
   - Issue [#15779](https://github.com/apache/iceberg/issues/15779) — closed
   - Severity: **Medium**
   - Why: This affects SQL/catalog correctness and object visibility semantics.
   - Status: Closed, but no corresponding fix PR was listed in the provided dataset.

### Lower severity / maintenance

6. **CVE in Kafka Connect runtime dependency**
   - Issue [#15378](https://github.com/apache/iceberg/issues/15378)
   - Severity: **Operationally High, functionally Low**
   - Fix path: PR [#15829](https://github.com/apache/iceberg/pull/15829)

---

## 6. Feature Requests & Roadmap Signals

### User-requested features and enhancements

- **Parquet page version control**
  - Issue [#15677](https://github.com/apache/iceberg/issues/15677)
  - Request to add `write.parquet.page-version` table property.
  - This is a practical storage-format tuning request for users needing **writer compatibility or low-level Parquet behavior control**.

- **Kafka connector upsert support clarity**
  - Issue [#15046](https://github.com/apache/iceberg/issues/15046)
  - Suggests confusion or a gap between **Apache Iceberg connector behavior** and vendor/distribution variants around upsert semantics.
  - This is less a pure feature request than a signal that **CDC/upsert workflows remain under-specified or under-documented**.

- **Flink SQL configurability for dynamic sink**
  - PR [#15780](https://github.com/apache/iceberg/pull/15780)
  - Strong indicator that **SQL-first streaming configuration** is a near-term usability priority.

- **Spark optimizer integration**
  - PR [#14948](https://github.com/apache/iceberg/pull/14948)
  - Better DSv2 ordering reporting suggests ongoing work to make Iceberg tables behave more naturally under **Spark 4.1 optimizer rules**.

- **Variant predicate pushdown**
  - PR [#15385](https://github.com/apache/iceberg/pull/15385)
  - Important signal for semi-structured data workloads: users want **manifest-level file skipping for variant columns**.

- **Unified relation loading APIs**
  - PRs [#15830](https://github.com/apache/iceberg/pull/15830), [#15831](https://github.com/apache/iceberg/pull/15831)
  - Likely to appear in a future release because they align with broader **REST catalog evolution** and support tables/views/future MVs.

### Most likely near-next-version candidates

Based on current recency and implementation maturity signals, the most plausible items for the next version are:

1. **Security backport for aircompressor CVE** — PR [#15829](https://github.com/apache/iceberg/pull/15829)
2. **Spark 2 test assumption cleanup** — PR [#15823](https://github.com/apache/iceberg/pull/15823)
3. **REST relation load endpoints** — PRs [#15830](https://github.com/apache/iceberg/pull/15830), [#15831](https://github.com/apache/iceberg/pull/15831)
4. **Flink dynamic sink SQL configurability** — PR [#15780](https://github.com/apache/iceberg/pull/15780)
5. **Spark statistics improvements** — PR [#15693](https://github.com/apache/iceberg/pull/15693)

---

## 7. User Feedback Summary

The strongest user feedback today points to **operational reliability and integration friction**, not core table-format skepticism.

- **Streaming users need Kafka Connect to be more predictable**
  - Issue [#13457](https://github.com/apache/iceberg/issues/13457)
  - Dynamic routing plus SMTs is a realistic production pattern. Failures here imply users are pushing Iceberg beyond static demo pipelines into **multi-destination streaming ingestion**.

- **Users care about security posture of packaged runtimes**
  - Issue [#15378](https://github.com/apache/iceberg/issues/15378)
  - This reflects enterprise expectations: Iceberg distributions must keep up with **dependency CVEs**, especially for connectors.

- **Advanced schema semantics are hitting edge cases**
  - Issue [#15826](https://github.com/apache/iceberg/issues/15826)
  - Nested identifier fields are sophisticated usage, and the bug suggests expert users are adopting Iceberg’s richer schema capabilities faster than all readers/planners are maturing.

- **Flink users want less hidden behavior**
  - Issue [#15827](https://github.com/apache/iceberg/issues/15827), PR [#15780](https://github.com/apache/iceberg/pull/15780)
  - The theme is **execution control and predictability**, especially around sink parallelism and SQL-configurable write behavior.

- **Developer experience matters**
  - Issue [#15824](https://github.com/apache/iceberg/issues/15824)
  - Empty source/javadoc artifacts do not affect data correctness but do degrade **tooling ergonomics and trust in published artifacts**.

Overall, users appear satisfied enough to keep stretching Iceberg into more advanced Spark/Flink/Kafka patterns, but they are exposing rough edges in **connectors, packaging, and advanced schema/read-path behavior**.

---

## 8. Backlog Watch

These items look important and in need of maintainer attention due to age, strategic value, or unresolved user impact:

- **Materialized View Spec**
  - PR [#11041](https://github.com/apache/iceberg/pull/11041)
  - Open since 2024-08-29
  - Strategic, high-impact spec work that likely needs continued design convergence. Its longevity suggests complexity or unresolved consensus.

- **V4 manifest foundational types**
  - PR [#15049](https://github.com/apache/iceberg/pull/15049)
  - Open since 2026-01-14
  - Important for metadata evolution and future adaptive metadata tree work. Worth attention because it underpins later changes.

- **Spark 4.1 ordering reporting**
  - PR [#14948](https://github.com/apache/iceberg/pull/14948)
  - Open since 2025-12-31
  - Valuable optimizer integration for Spark users; prolonged review delays could slow adoption of Spark 4.1-specific improvements.

- **Spark flaky test stabilization**
  - PR [#15227](https://github.com/apache/iceberg/pull/15227)
  - Open since 2026-02-03
  - CI reliability work is often unglamorous but high leverage. If left unresolved, it can slow broader contributor velocity.

- **Kafka Connect dynamic routing failure**
  - Issue [#13457](https://github.com/apache/iceberg/issues/13457)
  - Older, active, and user-visible
  - This stands out as the most urgent unresolved issue from a production-ingestion standpoint.

- **Variant predicate pushdown**
  - PR [#15385](https://github.com/apache/iceberg/pull/15385)
  - Open since 2026-02-20
  - Relevant for semi-structured analytics and Spark query performance; useful candidate for prioritization if variant adoption is rising.

---

## Bottom Line

Iceberg’s day was marked by **high engineering activity without a release**, with notable momentum in **Spark optimizer integration, Flink sink usability, REST catalog generalization, and security backporting**. The main risks remain in **connector reliability, advanced schema edge cases, and packaging quality**. Strategically, the clearest roadmap signals are toward **richer REST catalog object models, materialized views, better Spark/Flink ergonomics, and continued metadata-format evolution**.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

⚠️ Summary generation failed.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-31

## 1. Today's Overview

Databend showed **moderate-to-high engineering activity** over the last 24 hours, with **14 PRs updated**, **6 PRs merged/closed**, **4 issues updated**, and **2 patch releases published**. The work mix is balanced across **query engine development, SQL compatibility, storage maintenance, and developer tooling**, which is a healthy sign for an OLAP engine maturing both features and operability. The most notable signals today are a **fix for planner overflow on full-range UInt64 statistics**, continued progress on **recursive CTE support**, and several open PRs around **HTTP query output, tracing, parser correctness, and recluster behavior**. Overall, project health looks solid: fixes are landing quickly for correctness bugs, while roadmap work continues in parallel.

---

## 2. Releases

Databend published two new patch releases:

- **[v1.2.881-patch-1](https://github.com/databendlabs/databend/releases/tag/v1.2.881-patch-1)**
- **[v1.2.833-patch-1](https://github.com/databendlabs/databend/releases/tag/v1.2.833-patch-1)**

Both release notes are minimal and point to generated changelogs rather than curated summaries:

- Full changelog for v1.2.881-patch-1:  
  https://github.com/databendlabs/databend/compare/v1.2.891-nightly...v1.2.881-patch-1
- Full changelog for v1.2.833-patch-1:  
  https://github.com/databendlabs/databend/compare/v1.2.891-nightly...v1.2.833-patch-1

### What likely changed
Given the PRs merged around the same time, these patch lines likely aim to backport **stability and correctness fixes**, especially:
- planner overflow avoidance for `UInt64` full-range statistics
- recursive CTE correctness improvements
- SQL type/cast fixes
- insert/stream handling robustness

### Breaking changes
No explicit breaking changes are disclosed in the provided release notes.

### Migration notes
No formal migration steps are documented. As these are **patch** releases, operators should primarily review:
- query planner behavior if relying on cardinality/statistics-sensitive workloads
- recursive CTE workloads
- variant/numeric casting behavior
- multi-table insert stream semantics

For production users, these look more like **recommended maintenance updates** than feature migrations.

---

## 3. Project Progress

### Merged/closed PRs today

#### Query engine and SQL features

- **[PR #19599](https://github.com/databendlabs/databend/pull/19599) — feat: recursive cte support sudoku**  
  This is the clearest SQL-engine progress item today. It closes **[Issue #18237](https://github.com/databendlabs/databend/issues/18237)** and demonstrates improved support for **recursive CTE execution**, specifically on a nontrivial workload (Sudoku solving). For analytical databases, recursive CTE support is an important SQL completeness milestone, especially for graph-like traversals, hierarchy expansion, and iterative logic.

- **[PR #19623](https://github.com/databendlabs/databend/pull/19623) — fix(query): fix variant cast to number**  
  This improves **semi-structured data interoperability** by allowing floating-point values inside `VARIANT` to be cast to integers with rounding behavior. This matters for JSON-heavy analytics pipelines where schema-on-read and typed projections are common.

- **[PR #19628](https://github.com/databendlabs/databend/pull/19628) — feat: add fast paths for substr and string column concat**  
  This advances **string-processing performance** in the execution engine. Fast paths for `substr` and string-column concatenation can materially help BI and ETL-style workloads, where string slicing and formatting often show up in projections.

#### Stability and correctness

- **[PR #19632](https://github.com/databendlabs/databend/pull/19632) — fix(sql): avoid uint ndv overflow in scan stats**  
  This fixes **[Issue #19555](https://github.com/databendlabs/databend/issues/19555)**, a planner panic caused by overflow when deriving NDV on a `UInt64` column spanning the full unsigned range. This is a high-value correctness fix because it prevents planning-time crashes on edge-case statistics.

- **[PR #19637](https://github.com/databendlabs/databend/pull/19637) — fix: skip on_finish in CommitMultiTableInsert on error to preserve stream**  
  This targets **insert pipeline robustness**, preventing stream corruption or unexpected teardown behavior after errors in multi-table insert flows.

#### Dependency / maintenance work

- **[PR #19640](https://github.com/databendlabs/databend/pull/19640) — chore: bump dtparse to 7a9e40f**  
  Routine dependency maintenance. While not user-visible by itself, such updates help keep parsing-related functionality and transitive dependencies current.

### Progress assessment
Today’s merged work suggests Databend is advancing on three fronts simultaneously:
1. **SQL completeness**: recursive CTEs, variant casting
2. **Execution performance**: string function fast paths
3. **Operational correctness**: planner overflow and stream-preservation fixes

That is a strong profile for an analytical engine focused on both feature parity and production reliability.

---

## 4. Community Hot Topics

There is limited public discussion volume in the provided data—most listed items have **0 comments and 0 reactions**—so “hot topics” are better inferred from what maintainers are actively shipping and tracking.

### 1) Recursive CTE maturity
- Tracking issue: **[Issue #18144](https://github.com/databendlabs/databend/issues/18144) — Tracking: improve CTE**
- Fixed issue: **[Issue #18237](https://github.com/databendlabs/databend/issues/18237)**
- Related merged PR: **[PR #19599](https://github.com/databendlabs/databend/pull/19599)**

**Technical need:** users want more complete and reliable support for **recursive and distributed CTE execution**. This is a roadmap-level SQL capability, particularly important for portability from PostgreSQL/SQLite-style workloads and for more advanced query semantics.

### 2) SQL literal compatibility
- Open PR: **[PR #19636](https://github.com/databendlabs/databend/pull/19636) — fix(ast): parse X'...' as binary literal**
- Open PR: **[PR #19635](https://github.com/databendlabs/databend/pull/19635) — fix: treat X'...' as binary literal**

**Technical need:** users are hitting compatibility gaps around **SQL-standard binary literals**. Supporting `X'...'` correctly improves interoperability with standard SQL tooling and migration scenarios from other databases.

### 3) HTTP query interface and observability
- Open PR: **[PR #19639](https://github.com/databendlabs/databend/pull/19639) — add http_json_result_mode and refactor HTTP result string encoding**
- Open PR: **[PR #19642](https://github.com/databendlabs/databend/pull/19642) — add trace_debug OTLP dump utilities**

**Technical need:** Databend users increasingly need **API-friendly result encoding** and **better distributed tracing/debugging**. This points to more integration with applications, gateways, and observability stacks rather than SQL-console-only usage.

### 4) Recluster behavior at scale
- Open PR: **[PR #19641](https://github.com/databendlabs/databend/pull/19641) — limit unclustered block selection in recluster compact phase**

**Technical need:** storage maintenance operations need to stay bounded and predictable on large tables. This is a classic OLAP operational concern: background optimization must not become its own bottleneck.

---

## 5. Bugs & Stability

Ranked by likely severity and user impact.

### High severity

#### 1) Planner panic on full-range `UInt64` stats
- Issue: **[Issue #19555](https://github.com/databendlabs/databend/issues/19555)**
- Fix PR: **[PR #19632](https://github.com/databendlabs/databend/pull/19632)**

**Why severe:** this is a **planning-time panic**, meaning queries can fail before execution under valid but extreme column statistics. Crashes in the optimizer/planner are among the most critical classes of engine bugs.  
**Status:** fixed via closed PR.

### Medium severity

#### 2) Recursive CTE failure on Sudoku workload
- Issue: **[Issue #18237](https://github.com/databendlabs/databend/issues/18237)**
- Fix PR: **[PR #19599](https://github.com/databendlabs/databend/pull/19599)**

**Why it matters:** recursive CTE bugs affect query correctness and SQL compatibility. While the Sudoku example is a benchmark-style repro, the underlying issue impacts any recursive logic pattern.  
**Status:** fixed/closed.

#### 3) Multi-table insert stream preservation on error
- Fix PR: **[PR #19637](https://github.com/databendlabs/databend/pull/19637)**

**Why it matters:** error-path handling in insert pipelines can cause cascading failures or inconsistent streaming behavior.  
**Status:** fix closed.

### Lower-to-medium severity / pending

#### 4) SQL-standard binary literal parsing
- Open PRs: **[PR #19636](https://github.com/databendlabs/databend/pull/19636)** and **[PR #19635](https://github.com/databendlabs/databend/pull/19635)**

**Why it matters:** not a crash, but a **compatibility and correctness issue** for users expecting `X'...'` to be binary, not numeric.  
**Status:** still open.

#### 5) Link checker failure in docs
- Issue: **[Issue #19643](https://github.com/databendlabs/databend/issues/19643)**

**Why it matters:** low runtime severity, but it affects documentation quality and developer experience.  
**Status:** open; one link error reported.

### Stability outlook
The good news is that the most serious bug in today’s data—the `UInt64` overflow panic—already has a fix merged. The remaining open correctness items are more about **SQL behavior fidelity and operational tuning** than crash-level instability.

---

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### Recursive CTE improvements remain active
- Tracking issue: **[Issue #18144](https://github.com/databendlabs/databend/issues/18144)**

This is the clearest roadmap indicator in today’s issue list. Several subtasks are completed, but at least two remain open:
- **#18421**
- **Support distributed execution of recursive CTEs**

This suggests Databend is moving from **basic recursive correctness** toward **distributed recursive execution**, which is a meaningful step for an MPP analytical system.

#### Better HTTP/API query outputs
- Open PR: **[PR #19639](https://github.com/databendlabs/databend/pull/19639)**

The introduction of `http_json_result_mode` suggests demand for more controlled and possibly more standards-friendly or client-friendly JSON responses. This is likely to matter for SDKs, embedded query services, dashboards, and API consumers.

#### Better tracing and supportability
- Open PR: **[PR #19642](https://github.com/databendlabs/databend/pull/19642)**

Trace dump tooling for both direct SQL and `/v1/query` indicates that observability is becoming a product-level concern, especially for diagnosing query execution paths and HTTP query behavior.

#### Leaner developer builds / modularization
- Open PR: **[PR #19644](https://github.com/databendlabs/databend/pull/19644)**
- Open PR: **[PR #19638](https://github.com/databendlabs/databend/pull/19638)**

These suggest a maintainability roadmap:
- reduce global/singleton coupling in the query layer
- retain optional feature gates for lighter contributor builds

For open-source infrastructure projects, this usually improves contributor velocity and testability over time.

### Likely next-version candidates
Based on current open PRs, items most likely to appear in an upcoming release include:
1. **`X'...'` binary literal compatibility**
2. **HTTP JSON result mode improvements**
3. **Trace-debug OTLP dump support**
4. **Recluster compaction safeguards**
5. **More recursive CTE follow-up work**

---

## 7. User Feedback Summary

Even without many comments/reactions, the updated issues and PRs reveal several concrete user pain points:

### 1) SQL compatibility still matters a lot
Users are clearly exercising:
- recursive CTEs
- SQL-standard binary literals
- variant-to-number casts

This indicates Databend is being evaluated or used in contexts where **cross-database SQL portability** matters. Compatibility gaps are likely to surface quickly in migrations and federated tooling.

### 2) Edge-case correctness is under scrutiny
The `UInt64` statistics overflow issue shows users are encountering or testing **extreme cardinality/statistics boundaries**, which is common in large-scale analytical systems. This is a sign of serious usage rather than toy workloads.

### 3) HTTP and tracing workflows are becoming first-class
The active work around HTTP result modes and OTLP trace dumps implies users are not only querying through SQL clients, but also integrating Databend through **services, APIs, and observability tooling**.

### 4) Storage maintenance costs are visible to operators
The recluster compaction PR suggests operators care about **bounded maintenance behavior**, especially when tables accumulate many unclustered segments. That is typical of production deployments with sustained ingestion.

### Satisfaction signals
Positive signals today come less from reactions and more from cadence:
- reported bugs are being fixed quickly
- tracking issues are actively updated
- patch releases are shipping regularly

That points to a responsive maintainer workflow, even if explicit user sentiment is sparse in the data slice.

---

## 8. Backlog Watch

### Items needing maintainer attention

#### 1) Recursive CTE tracking still incomplete
- **[Issue #18144](https://github.com/databendlabs/databend/issues/18144)**

This is an important long-running tracking issue opened in 2025 and still active. Since recursive CTE support affects SQL completeness and competitive positioning, the remaining work—especially **distributed recursive execution**—deserves continued visibility.

#### 2) Duplicate/overlapping PRs for `X'...'` binary literal handling
- **[PR #19636](https://github.com/databendlabs/databend/pull/19636)**
- **[PR #19635](https://github.com/databendlabs/databend/pull/19635)**

These appear to address the same underlying issue. Maintainers should likely consolidate direction quickly to avoid review duplication and conflicting implementations.

#### 3) Recluster scaling safeguards
- **[PR #19641](https://github.com/databendlabs/databend/pull/19641)**

This looks important for production performance and maintenance predictability. It may merit prioritization if large-table users are affected by recluster compaction bottlenecks.

#### 4) Architectural cleanup in query layer
- **[PR #19638](https://github.com/databendlabs/databend/pull/19638)**

Removing global service lookups is less urgent for end users than bug fixes, but it is important technical debt work. These refactors often stall unless maintainers give them deliberate attention.

#### 5) Documentation quality check
- **[Issue #19643](https://github.com/databendlabs/databend/issues/19643)**

Low severity, but automated docs breakage should be kept from accumulating, especially in a fast-moving database project where documentation is part of adoption.

---

## Key Links

### Releases
- [v1.2.881-patch-1](https://github.com/databendlabs/databend/releases/tag/v1.2.881-patch-1)
- [v1.2.833-patch-1](https://github.com/databendlabs/databend/releases/tag/v1.2.833-patch-1)

### Issues
- [#19643 Link Checker Report](https://github.com/databendlabs/databend/issues/19643)
- [#18144 Tracking: improve CTE](https://github.com/databendlabs/databend/issues/18144)
- [#18237 Bug: using recursive CTE to solve sudoku returns error](https://github.com/databendlabs/databend/issues/18237)
- [#19555 planner panic on UInt64 full-range column stats](https://github.com/databendlabs/databend/issues/19555)

### PRs
- [#19639 http_json_result_mode](https://github.com/databendlabs/databend/pull/19639)
- [#19642 trace_debug OTLP dump utilities](https://github.com/databendlabs/databend/pull/19642)
- [#19644 lean dev builds](https://github.com/databendlabs/databend/pull/19644)
- [#19641 recluster compact phase cap](https://github.com/databendlabs/databend/pull/19641)
- [#19638 remove global service lookups phase 1](https://github.com/databendlabs/databend/pull/19638)
- [#19628 substr/string concat fast paths](https://github.com/databendlabs/databend/pull/19628)
- [#19599 recursive cte support sudoku](https://github.com/databendlabs/databend/pull/19599)
- [#19640 bump dtparse](https://github.com/databendlabs/databend/pull/19640)
- [#19636 parse X'...' as binary literal](https://github.com/databendlabs/databend/pull/19636)
- [#19637 preserve stream on multi-table insert error](https://github.com/databendlabs/databend/pull/19637)
- [#19632 avoid uint ndv overflow in scan stats](https://github.com/databendlabs/databend/pull/19632)
- [#19635 treat X'...' as binary literal](https://github.com/databendlabs/databend/pull/19635)
- [#19627 split oversized blocks in BlockPartitionStream](https://github.com/databendlabs/databend/pull/19627)
- [#19623 fix variant cast to number](https://github.com/databendlabs/databend/pull/19623)

If you want, I can also turn this into a **short executive summary**, a **release-manager style changelog**, or a **table-form daily report**.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-31

## 1. Today's Overview

Velox showed **high pull-request activity** over the last 24 hours, with **50 PRs updated** and **21 merged/closed**, while issue activity remained light at **3 updated issues**. The signal is that the project is currently in a **strong implementation and integration phase**, with more engineering throughput on code, CI, and feature refinement than on newly reported problems. There were **no new releases**, so today’s progress is best understood as incremental advancement toward future cuts rather than a versioned milestone. Overall project health looks **active and stable**, with attention split across SQL function parity, type coercion extensibility, GPU/cuDF integration, Hive scan pushdown, and CI hygiene.

## 2. Project Progress

### Merged/closed PRs today

#### 1) Folly/xplat dependency cleanup
- [PR #16969](https://github.com/facebookincubator/velox/pull/16969) — **Remove function_scheduler shim from xplat/folly/experimental**
- Status: Merged

This is primarily an internal dependency and build-compatibility cleanup rather than a user-visible feature, but it helps reduce technical debt around cross-project integration. For a project like Velox that sits deep in query engine stacks, this kind of infrastructure simplification improves maintainability and lowers integration friction.

#### 2) Runtime stats code organization refinement
- [PR #16965](https://github.com/facebookincubator/velox/pull/16965) — **Move addRuntimeStats after all stats definitions in HashTable**
- Status: Merged

This appears to be a refactor of statistics definition order in the hash table implementation. While not a headline performance change by itself, it supports cleaner observability plumbing in one of the engine’s most performance-sensitive components.

#### 3) Documentation/community visibility update
- [PR #16970](https://github.com/facebookincubator/velox/pull/16970) — **Show 24 recent blog posts in sidebar instead of default 5**
- Status: Merged

This is a documentation/site UX improvement, not engine functionality. Still, it reflects active investment in project communication and discoverability.

### What was advanced today overall

Even where not merged, the day’s active PR set shows clear forward motion in several engine areas:

- **SQL compatibility expansion**
  - [PR #16487](https://github.com/facebookincubator/velox/pull/16487) — `array_least_frequent`
  - [PR #16048](https://github.com/facebookincubator/velox/pull/16048) — `array_top_n` with transform lambda
  - [PR #16162](https://github.com/facebookincubator/velox/pull/16162) — `map_top_n_keys` with transform lambda
  - [PR #16235](https://github.com/facebookincubator/velox/pull/16235) — Base32 encoding
  - [PR #15511](https://github.com/facebookincubator/velox/pull/15511) — S2 Presto UDFs

- **Type system extensibility and overload resolution**
  - [PR #16461](https://github.com/facebookincubator/velox/pull/16461) — CastRulesRegistry for custom type casts
  - [PR #16821](https://github.com/facebookincubator/velox/pull/16821) — propagate CastRule cost through `canCoerce`

- **Storage and scan-path optimization**
  - [PR #16968](https://github.com/facebookincubator/velox/pull/16968) — extraction `ScanSpec` pushdown with Hive integration
  - [PR #16926](https://github.com/facebookincubator/velox/pull/16926) — runtime stats for `HiveIndexSource` and `FileIndexReader`
  - [PR #16456](https://github.com/facebookincubator/velox/pull/16456) — support PARQUET files with zero offset

- **Performance and profiling**
  - [PR #16646](https://github.com/facebookincubator/velox/pull/16646) — adaptive per-function CPU sampling
  - [PR #16967](https://github.com/facebookincubator/velox/pull/16967) — optimize basic numeric upcast

- **GPU/cuDF execution path maturation**
  - [Issue #16885](https://github.com/facebookincubator/velox/issues/16885) — unify cuDF operators with a common base class
  - [PR #16444](https://github.com/facebookincubator/velox/pull/16444) — `CudfPlanNodeChecker`

## 3. Community Hot Topics

### 1) cuDF operator architecture unification
- [Issue #16885](https://github.com/facebookincubator/velox/issues/16885) — **Unify cuDF operators with a common base class architecture**
- Comments: 12

This is the most actively discussed issue in the provided set. The underlying need is clear: Velox’s GPU execution support is growing organically, and contributors now want a **shared operator abstraction** to reduce duplication across `CudfTopN`, `CudfLimit`, `CudfOrderBy`, and related operators. This suggests the cuDF path is moving from experimentation toward a more durable subsystem, where maintainability, shared metrics/lifecycle hooks, and planner/executor consistency matter more.

Related work:
- [PR #16444](https://github.com/facebookincubator/velox/pull/16444) — `CudfPlanNodeChecker`

### 2) Spill scalability limits affecting downstream users
- [Issue #15400](https://github.com/facebookincubator/velox/issues/15400) — **Change `SpillPartitionId::kMaxSpillLevel` to 7**
- Comments: 6 | 👍 1

This is an important operational issue because it originates from a real downstream integration, forwarded from Gluten. The technical need is for **deeper spill hierarchy support** under memory pressure and larger workloads. If spill levels are capped too conservatively, Velox can fail in workloads that are otherwise expected to degrade gracefully via spilling. This is not just a tuning request; it points to pressure on the engine’s memory-management and spill encoding assumptions.

### 3) CI and contributor workflow improvements
- [PR #16938](https://github.com/facebookincubator/velox/pull/16938) — **Split ubuntu-debug into separate build and test jobs**
- [PR #16955](https://github.com/facebookincubator/velox/pull/16955) — **Add pre-commit hook to keep README blog list up to date**
- [Issue #16952](https://github.com/facebookincubator/velox/issues/16952) — **Pre-commit ruff-format failure for Python files added in #16827**

The cluster of CI/pre-commit items indicates a strong maintainer focus on **reducing contributor friction** and making failures easier to diagnose. This is especially valuable in a fast-moving systems repo where build matrix complexity can slow external contributions.

## 4. Bugs & Stability

Ranked by likely severity based on the provided data.

### High severity

#### 1) Spill level limit can cause query failure under heavy spilling
- [Issue #15400](https://github.com/facebookincubator/velox/issues/15400) — **Change `SpillPartitionId::kMaxSpillLevel` to 7**
- Status: Open

Reported symptom: `Spill level 4 exceeds max spill level 3`.  
Why it matters: This can lead to **hard execution failure** in spill-heavy workloads, especially in downstream systems like Gluten. Since spilling is a key safeguard for memory-constrained analytic execution, such a cap can become a real production blocker.

Fix PR seen today: **None directly linked** in the provided data.

### Medium severity

#### 2) Query correctness bug in timestamp construction validation
- [PR #16944](https://github.com/facebookincubator/velox/pull/16944) — **Off-by-one boundary bug in make_timestamp validation**
- Status: Open

Problem: `make_timestamp` validation used `>` instead of `>=`, allowing invalid values like `hour=24` and `minute=60`.  
Why it matters: This is a **SQL correctness issue**. Bad inputs being accepted can silently produce wrong timestamps rather than failing fast.

Fix PR exists: yes, this PR itself.

#### 3) PARQUET zero-offset read edge case
- [PR #16456](https://github.com/facebookincubator/velox/pull/16456) — **Support reading PARQUET files with zero offset**
- Status: Open, ready-to-merge

Why it matters: This is a **storage compatibility bug/edge case** that can block reading certain PARQUET layouts. Since it is marked ready-to-merge, resolution may be near.

### Low severity

#### 4) Pre-commit formatting regression for Python scripts
- [Issue #16952](https://github.com/facebookincubator/velox/issues/16952) — **Pre-commit ruff-format failure for Python files added in #16827**
- Status: Closed

Why it matters: This is a **developer workflow regression**, not an engine runtime bug. It can still slow contribution velocity by causing avoidable CI failures.

Related mitigation:
- [PR #16955](https://github.com/facebookincubator/velox/pull/16955) — README blog list pre-commit hook
- The issue itself is already closed, indicating a quick response.

## 5. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### 1) Broader SQL function parity with Presto ecosystems
Likely direction: continued expansion of built-in scalar/collection/geospatial functions.

Key PRs:
- [PR #16487](https://github.com/facebookincubator/velox/pull/16487) — `array_least_frequent`
- [PR #16048](https://github.com/facebookincubator/velox/pull/16048) — `array_top_n(array, n, lambda)`
- [PR #16162](https://github.com/facebookincubator/velox/pull/16162) — `map_top_n_keys` with transform lambda
- [PR #16235](https://github.com/facebookincubator/velox/pull/16235) — Base32 encoding
- [PR #15511](https://github.com/facebookincubator/velox/pull/15511) — S2 Presto UDFs

Prediction: **SQL compatibility enhancements are very likely to appear in the next release**, especially collection and encoding functions that align Velox more closely with Presto/Trino-style semantics.

#### 2) Custom type coercion and richer type-system hooks
Key PRs:
- [PR #16461](https://github.com/facebookincubator/velox/pull/16461) — `CastRulesRegistry`
- [PR #16821](https://github.com/facebookincubator/velox/pull/16821) — cast-rule cost propagation

These changes point to a roadmap where Velox supports **custom types as first-class citizens in coercion and overload resolution**, important for timestamp-with-time-zone and other engine-specific types. This is a foundational capability likely to influence future connector and function work.

#### 3) Smarter scan pushdown and Hive read-path improvements
Key PRs:
- [PR #16968](https://github.com/facebookincubator/velox/pull/16968) — extraction `ScanSpec` pushdown + Hive integration
- [PR #16926](https://github.com/facebookincubator/velox/pull/16926) — Hive index runtime stats

Prediction: scan-path optimization for Hive-backed workloads is a strong near-term theme. If merged, these changes would improve **column/path extraction efficiency and diagnostics** in data lake reads.

#### 4) GPU/cuDF execution architecture
Key items:
- [Issue #16885](https://github.com/facebookincubator/velox/issues/16885)
- [PR #16444](https://github.com/facebookincubator/velox/pull/16444)

Prediction: not necessarily next-release user-facing in a big way, but clearly a strategic area. Expect more groundwork around **eligibility checking, operator reuse, and maintainable GPU execution plumbing**.

## 6. User Feedback Summary

Based on the issue and PR set, current user and contributor pain points cluster into four themes:

1. **Memory-pressure robustness**
   - [Issue #15400](https://github.com/facebookincubator/velox/issues/15400) shows that users running through downstream engines can hit spill-depth limits that feel arbitrary in production scenarios.
   - This implies users need Velox to fail less often and spill more gracefully on large or skewed workloads.

2. **SQL compatibility expectations**
   - The backlog of function PRs such as [#16487](https://github.com/facebookincubator/velox/pull/16487), [#16048](https://github.com/facebookincubator/velox/pull/16048), [#16162](https://github.com/facebookincubator/velox/pull/16162), [#16235](https://github.com/facebookincubator/velox/pull/16235), and [#15511](https://github.com/facebookincubator/velox/pull/15511) suggests users continue to push for broader parity with established SQL engines and function libraries.

3. **Correctness at edge conditions**
   - [PR #16944](https://github.com/facebookincubator/velox/pull/16944) and [PR #16456](https://github.com/facebookincubator/velox/pull/16456) reflect practical demand for strict correctness in boundary handling and file-format edge cases.

4. **Contributor ergonomics and CI clarity**
   - [Issue #16952](https://github.com/facebookincubator/velox/issues/16952) and [PR #16938](https://github.com/facebookincubator/velox/pull/16938) show maintainers are hearing pain around unclear CI failures and pre-commit churn.
   - The project appears responsive here, which is a positive health signal.

## 7. Backlog Watch

These are older or strategically important items that appear to need sustained maintainer attention.

### 1) Base32 support chain
- [PR #16235](https://github.com/facebookincubator/velox/pull/16235) — **Add Base32 encoding**
- [PR #16176](https://github.com/facebookincubator/velox/pull/16176) — **Add BaseEncoderUtils.h**

These are relatively old and linked. Because one refactor underpins the feature PR, they may be blocked as a pair. Worth attention because they deliver visible SQL functionality and close long-standing parity gaps.

### 2) Collection-function parity work
- [PR #16048](https://github.com/facebookincubator/velox/pull/16048) — `array_top_n` with lambda
- [PR #16162](https://github.com/facebookincubator/velox/pull/16162) — `map_top_n_keys` with lambda
- [PR #16487](https://github.com/facebookincubator/velox/pull/16487) — `array_least_frequent`

These suggest a substantial body of user-facing SQL work has been open for weeks to months. If maintainers want visible adoption wins, clearing this queue would be impactful.

### 3) S2 geospatial Presto UDFs
- [PR #15511](https://github.com/facebookincubator/velox/pull/15511) — **s2 presto UDFs**

This is one of the oldest notable PRs in the set. Geospatial function support can materially broaden workload coverage, but long-lived PRs risk bitrot and review fatigue.

### 4) Spill-level issue with downstream production implications
- [Issue #15400](https://github.com/facebookincubator/velox/issues/15400) — **Change `SpillPartitionId::kMaxSpillLevel` to 7**

This is not the oldest item overall, but it deserves elevated attention because it maps directly to real execution failures reported by a downstream project.

### 5) PARQUET zero-offset compatibility
- [PR #16456](https://github.com/facebookincubator/velox/pull/16456) — **Support reading PARQUET files with zero offset**
- Status: ready-to-merge

This looks like low-hanging fruit for maintainers: user-visible compatibility value with apparent review maturity.

## Overall Health Assessment

Velox is showing **strong engineering momentum** with heavy PR throughput, healthy subsystem breadth, and quick handling of contributor-workflow regressions. The most important technical signals today are: **continued SQL surface expansion, deeper type-system customization, better Hive scan optimization, and growing maturity of the cuDF/GPU path**. Main risk areas remain **spill robustness**, **edge-case correctness**, and **review latency on older user-facing PRs**. No release was cut today, but the repository activity suggests meaningful feature content is accumulating for a substantial upcoming version.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-31

## 1. Today's Overview

Apache Gluten remained highly active over the last 24 hours, with **23 pull requests updated** and **5 issues updated**, indicating strong ongoing development momentum despite **no new release** being published today. The activity is concentrated around **Velox backend capability expansion**, **Spark 4.x test re-enablement**, **query correctness fixes**, and **developer/CI quality-of-life improvements**. Closed PRs today suggest incremental progress in **native Parquet write support**, **exception handling cleanup**, **TPC-DS tooling correctness**, and **documentation refresh**, while open PRs show heavier work-in-progress on **TIMESTAMP_NTZ**, **Kafka read support**, **ANSI casting semantics**, and **parallel execution**. Overall, project health looks **active and improving**, with the main pressure points still around **Spark 4.x compatibility**, **backend semantic parity**, and **runtime stability in Velox and ClickHouse paths**.

## 3. Project Progress

### Merged/closed PRs today

#### 1. Native Parquet write for complex types in Velox
- **PR:** [#11788](https://github.com/apache/incubator-gluten/pull/11788) — **CLOSED**
- **Topic:** `[CORE, VELOX] [VL] Enable native Parquet write for complex types (Struct/Array/Map)`
- **Impact:** This is a meaningful storage-path improvement for the Velox backend. It removes previous Scala-side restrictions and relies on the Arrow-backed Parquet writer path to support nested data types natively.
- **Why it matters:** Complex/nested type write support is critical for lakehouse interoperability and for workloads using semi-structured schemas. This advances Gluten’s suitability for modern analytic datasets.

#### 2. Exception handling cleanup in core iterator path
- **PR:** [#11841](https://github.com/apache/incubator-gluten/pull/11841) — **CLOSED**
- **Topic:** `Preserve exception type in ClosableIterator.translateException()`
- **Impact:** Prevents unnecessary double-wrapping of runtime exceptions into `GlutenException`.
- **Why it matters:** This improves debuggability and downstream error handling, especially for operators or integrations that need to catch specific exception classes instead of generic wrappers.

#### 3. TPC-DS tooling/schema correctness fix
- **PR:** [#11792](https://github.com/apache/incubator-gluten/pull/11792) — **CLOSED**
- **Topic:** `[TOOLS] [VL] Gluten-it: Rename column c_last_review_date to c_last_review_date_sk`
- **Impact:** Aligns internal tooling/test schema with the TPC-DS v2.7 specification.
- **Why it matters:** Benchmark and regression environments depend on schema fidelity. This helps avoid false failures and improves trust in benchmark comparisons.

#### 4. Documentation updates for Spark support and project status
- **PR:** [#11851](https://github.com/apache/incubator-gluten/pull/11851) — **CLOSED**
- **Topic:** `[DOC] Update documentation for Spark version support and TLP graduation`
- **Impact:** Removes stale references, adds Spark 4.0/4.1 support documentation, and updates project maturity messaging.
- **Why it matters:** Clear support matrices reduce user confusion and indicate that Spark 4.x is becoming a first-class target.

#### 5. Dependency maintenance in tooling
- **PRs:** [#11846](https://github.com/apache/incubator-gluten/pull/11846), [#11842](https://github.com/apache/incubator-gluten/pull/11842) — **CLOSED**
- **Impact:** Routine Python dependency updates in benchmarking analysis tools.
- **Why it matters:** Low strategic impact, but useful for keeping benchmarking and analysis environments secure and current.

## 4. Community Hot Topics

### 1. Velox downstream patch tracking remains a strategic concern
- **Issue:** [#11585](https://github.com/apache/incubator-gluten/issues/11585) — **16 comments, 4 👍**
- **Title:** `[VL] useful Velox PRs not merged into upstream`
- **Analysis:** This is the clearest signal that Gluten still depends on a set of **community-submitted Velox changes not yet accepted upstream**. The stated avoidance of maintaining picks in `gluten/velox` due to rebasing costs highlights a key technical need: **reduce divergence between Gluten and upstream Velox**.
- **Underlying need:** Better upstreaming velocity, less private patch maintenance, and more predictable backend evolution.

### 2. Spark 4.x compatibility and disabled test re-enablement
- **Issue:** [#11550](https://github.com/apache/incubator-gluten/issues/11550) — **7 comments**
- **Title:** `Spark 4.x: Tracking disabled test suites`
- **Related PRs:** [#11833](https://github.com/apache/incubator-gluten/pull/11833), [#11848](https://github.com/apache/incubator-gluten/pull/11848), [#11847](https://github.com/apache/incubator-gluten/pull/11847)
- **Analysis:** Multiple active PRs are clustered around restoring disabled suites and fixing Spark 4.0/4.1 behavior. This is one of the strongest short-term roadmap threads.
- **Underlying need:** Full semantic and test parity with Spark 4.x, especially around planner tag propagation, CSV expressions, and test harness assumptions.

### 3. TIMESTAMP_NTZ support is maturing into a broader feature track
- **PRs:** [#11626](https://github.com/apache/incubator-gluten/pull/11626), [#11720](https://github.com/apache/incubator-gluten/pull/11720), [#11656](https://github.com/apache/incubator-gluten/pull/11656)
- **Analysis:** These PRs indicate a coordinated push: basic type support, fallback-validation controls, and validation coverage for time functions.
- **Underlying need:** Better Spark semantic compatibility for timestamp behavior, especially as modern Spark workloads increasingly use `TIMESTAMP_NTZ`.

### 4. Velox execution model expansion
- **PR:** [#11852](https://github.com/apache/incubator-gluten/pull/11852)
- **Title:** `Proof of concept enable Velox parallel execution`
- **Analysis:** Even though still draft-level, this is strategically important. Parallel execution could become a major performance differentiator if stabilized.
- **Underlying need:** Better native execution scalability on multicore workloads.

## 5. Bugs & Stability

Ranked by likely severity and user impact:

### High severity

#### 1. Velox spill management/runtime failure
- **Issue:** [#11018](https://github.com/apache/incubator-gluten/issues/11018)
- **Title:** `[VL] "Spill level 4 exceeds max spill level 3" error`
- **Status:** Open, updated today
- **Severity rationale:** This appears to be a runtime memory-pressure / spilling failure in hash probe execution. These issues can break large joins or memory-constrained workloads and are often hard for users to mitigate.
- **Fix PR:** None linked in today’s data.

#### 2. S3 teardown lifecycle bug in Velox
- **Issue:** [#11796](https://github.com/apache/incubator-gluten/issues/11796)
- **Title:** `[VL] finalizeS3FileSystem is never called`
- **Status:** Open, updated today
- **Severity rationale:** Incorrect AWS SDK teardown can lead to shutdown-time instability, resource leaks, or undefined behavior in long-running services and tests.
- **Fix PR:** None shown today.

### Medium severity

#### 3. ClickHouse aggregate correctness bug: `var_samp`/`covar_samp`
- **Issue:** [#11849](https://github.com/apache/incubator-gluten/issues/11849)
- **Title:** `[CH] var_samp returns NaN instead of NULL when effective row count < 2`
- **Status:** Newly opened today
- **Severity rationale:** This is a clear SQL correctness issue. It may not crash systems, but it can silently produce non-Spark-compatible results in analytical queries.
- **Fix PR:** [#11850](https://github.com/apache/incubator-gluten/pull/11850) already opened the same day.

### Lower severity but notable

#### 4. Spark 4.x disabled suites tracker
- **Issue:** [#11550](https://github.com/apache/incubator-gluten/issues/11550)
- **Severity rationale:** Not a single runtime bug, but a broad compatibility/stability indicator. Disabled suites usually hide semantic mismatches or regressions.
- **Fix PRs in flight:** [#11833](https://github.com/apache/incubator-gluten/pull/11833), [#11848](https://github.com/apache/incubator-gluten/pull/11848), [#11847](https://github.com/apache/incubator-gluten/pull/11847)

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### 1. TIMESTAMP_NTZ support in Velox
- **PR:** [#11626](https://github.com/apache/incubator-gluten/pull/11626)
- **Prediction:** Likely to land in an upcoming release because it is already accompanied by related validation/configuration work.
- **Why important:** Timestamp semantics are a major compatibility blocker for Spark-native workloads.

#### 2. Kafka read support for Velox backend
- **PR:** [#11801](https://github.com/apache/incubator-gluten/pull/11801)
- **Prediction:** A high-value connector feature, though likely medium-term rather than immediate unless test and integration complexity is low.
- **Why important:** Signals expansion beyond file-based analytics into streaming/ingestion-adjacent use cases.

#### 3. ANSI casting semantics
- **PR:** [#11854](https://github.com/apache/incubator-gluten/pull/11854)
- **Prediction:** Good candidate for a near-term release because ANSI mode mismatches are user-visible and relatively well-scoped.
- **Why important:** Essential for correctness-sensitive Spark deployments.

#### 4. Velox parallel execution
- **PR:** [#11852](https://github.com/apache/incubator-gluten/pull/11852)
- **Prediction:** Probably not next release unless the scope is reduced significantly; currently marked as proof-of-concept.
- **Why important:** Could materially improve native execution throughput if productionized.

#### 5. Parquet type widening support
- **PR:** [#11719](https://github.com/apache/incubator-gluten/pull/11719)
- **Prediction:** Strong candidate for the next version given the number of tests already enabled.
- **Why important:** Helps schema evolution and Parquet interoperability.

## 7. User Feedback Summary

Current user pain points are consistent and practical:

- **Semantic parity with Spark remains the dominant concern.**
  - Evidence: Spark 4.x disabled-suite tracking [#11550](https://github.com/apache/incubator-gluten/issues/11550), ANSI cast work [#11854](https://github.com/apache/incubator-gluten/pull/11854), ClickHouse aggregate NULL-vs-NaN fix [#11849](https://github.com/apache/incubator-gluten/issues/11849), [#11850](https://github.com/apache/incubator-gluten/pull/11850).
- **Velox backend users want broader type/function coverage without forced fallback.**
  - Evidence: TIMESTAMP_NTZ support and fallback-control work [#11626](https://github.com/apache/incubator-gluten/pull/11626), [#11720](https://github.com/apache/incubator-gluten/pull/11720), [#11656](https://github.com/apache/incubator-gluten/pull/11656).
- **Operational robustness is still a concern under real workloads.**
  - Evidence: spill failure issue [#11018](https://github.com/apache/incubator-gluten/issues/11018), S3 finalization lifecycle issue [#11796](https://github.com/apache/incubator-gluten/issues/11796).
- **Users are also pushing Gluten into more complete production scenarios.**
  - Evidence: Kafka source support [#11801](https://github.com/apache/incubator-gluten/pull/11801), complex Parquet writes [#11788](https://github.com/apache/incubator-gluten/pull/11788), UI fallback visibility for V2 writes [#11853](https://github.com/apache/incubator-gluten/pull/11853).

Overall, the feedback pattern suggests users are no longer only benchmarking Gluten—they are trying to run **broader Spark-compatible production workloads** and need both **correctness** and **observability**.

## 8. Backlog Watch

These items appear to need sustained maintainer attention:

### 1. Upstream Velox dependency divergence
- **Issue:** [#11585](https://github.com/apache/incubator-gluten/issues/11585)
- **Why it matters:** Long-lived downstream patch tracking increases maintenance burden and release risk. This is strategically important, not just operationally noisy.

### 2. Long-running spill failure issue
- **Issue:** [#11018](https://github.com/apache/incubator-gluten/issues/11018)
- **Created:** 2025-11-04
- **Why it matters:** Memory/spill failures can block real production adoption. The issue is old enough to deserve renewed prioritization.

### 3. Spark 4.x disabled suites tracker
- **Issue:** [#11550](https://github.com/apache/incubator-gluten/issues/11550)
- **Why it matters:** Good progress is visible, but this remains a key release-readiness gate for Spark 4.x support claims.

### 4. TIMESTAMP_NTZ support PR remains open despite broad relevance
- **PR:** [#11626](https://github.com/apache/incubator-gluten/pull/11626)
- **Why it matters:** This touches core semantic compatibility and is linked to several adjacent efforts. Delays here could slow multiple user-facing features.

### 5. CI/build efficiency improvements still open
- **PR:** [#11655](https://github.com/apache/incubator-gluten/pull/11655)
- **Why it matters:** Build/test turnaround directly affects contributor throughput, especially given the large Spark/Velox matrix.

---

## Bottom Line

Apache Gluten is showing **strong engineering velocity**, especially around the **Velox backend** and **Spark 4.x readiness**. The near-term direction is clear: **close semantic gaps with Spark, reduce fallback, improve correctness for timestamps/casts/aggregates, and stabilize runtime behavior under real workloads**. The biggest structural risk remains **dependency on unmerged Velox changes**, while the biggest user-facing risks are **spill/runtime stability** and **backend correctness mismatches**. If the current PR stream lands cleanly, the next release is likely to deliver meaningful improvements in **type support, Parquet interoperability, Spark 4.x compatibility, and SQL correctness**.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-31

## 1. Today's Overview

Apache Arrow showed **steady day-to-day maintenance activity** rather than a release-driven spike: **21 issues** and **17 PRs** were updated in the last 24 hours, with **11 issues closed** and **7 PRs merged/closed**. The project remains highly active across its core surfaces—**C++**, **Parquet**, **Python**, **R**, **Flight SQL/ODBC**, and **CI/fuzzing/security documentation**. The strongest short-term signal is a focus on **correctness and reliability**, especially around **filtering correctness, timestamp overflow protection, CI breakages, and fuzzing hardening**. There are also ongoing roadmap signals in **query engine API cleanup**, **large-scale join execution**, and **driver/connectivity work**.

## 2. Project Progress

### Merged/closed PRs today and what they advanced

#### 1) Fixed a user-visible query correctness bug in list filtering
- PR: [#49602](https://github.com/apache/arrow/pull/49602) — **[C++][Compute] Fix fixed-width gather byte offset overflow in list filtering**
- Related issue: [#49392](https://github.com/apache/arrow/issues/49392)

This is the most important technical fix in the period. It addressed **data corruption when filtering a table containing `list<double>` columns**, a serious correctness problem affecting compute/filter semantics and potentially downstream reads into Pandas via PyArrow. From an analytical engine perspective, this improves trust in **predicate pushdown / filtered materialization paths** over nested data.

#### 2) Security and API-safety documentation for Arrow C++ landed
- PR: [#49489](https://github.com/apache/arrow/pull/49489) — **[Doc][C++] Document security model for Arrow C++**
- Related issue: [#49274](https://github.com/apache/arrow/issues/49274)

While not a runtime feature, this is meaningful infrastructure for users embedding Arrow in analytical engines and services. It clarifies **data validation expectations, misuse boundaries, and safety assumptions**, which matters for storage engines, query services, and untrusted-data ingestion.

#### 3) R Windows CI/storage test environment repaired
- PR: [#49610](https://github.com/apache/arrow/pull/49610) — **[CI][R] AMD64 Windows R release fails with IOError: Bucket 'ursa-labs-r-test' not found**
- Related issue: [#49609](https://github.com/apache/arrow/issues/49609)

This unblocked a broken CI path caused by external bucket drift. Not user-facing, but it improves release confidence for the **R bindings** and cloud-storage-related integration testing.

#### 4) Documentation cleanup continued in Python/docs
- PR: [#49557](https://github.com/apache/arrow/pull/49557) — **[Docs][Python] Add nested grouping to Python docs TOC**
- PR: [#49550](https://github.com/apache/arrow/pull/49550) — **[Docs] PyCapsule protocol implementation status**

These closed docs PRs suggest continued effort to improve usability and ecosystem interoperability visibility, especially around Python integration.

### Broader progress themes
- **Compute correctness** improved via nested-list filtering fix.
- **Storage format safety** is advancing via active Parquet overflow checks.
- **Interoperability/connectors** continue moving with Flight SQL ODBC work.
- **Reliability engineering** remains prominent via CI repairs and fuzzing validation.

## 3. Community Hot Topics

### 1) Python type extraction from Python objects/type hints
- Issue: [#31209](https://github.com/apache/arrow/issues/31209) — **[Python] Extracting Type information from Python Objects**
- Comments: **33**

This is the most commented updated issue. The underlying need is clear: users want Arrow to play more naturally with **Python typing**, especially for **UDF authoring, function signatures, and schema/type derivation**. For analytical systems, this points to demand for a smoother developer experience around **declarative schemas and typed compute APIs**.

### 2) Flight SQL ODBC driver work remains a major integration theme
- PR: [#46099](https://github.com/apache/arrow/pull/46099) — **[C++] Arrow Flight SQL ODBC layer**
- PR: [#49585](https://github.com/apache/arrow/pull/49585) — **DRAFT: set up static build of ODBC FlightSQL driver**

These are strategically important even if not the most commented items in the snapshot. They indicate sustained investment in **SQL connectivity and BI tool integration**. For OLAP ecosystems, this is one of the clearest adoption levers: a stable ODBC layer makes Arrow Flight SQL more viable as a transport/query interface for external tools.

### 3) Bundled dependency upgrade with API implications
- PR: [#48964](https://github.com/apache/arrow/pull/48964) — **[C++] Upgrade Abseil/Protobuf/GRPC/Google-Cloud-CPP bundled versions**

This long-running PR is notable because it explicitly mentions **breaking changes to public APIs**. The technical need is dependency freshness, but the ecosystem concern is build compatibility for downstream consumers embedding Arrow C++.

### 4) High-impact correctness bug around filtered nested data
- Issue: [#49392](https://github.com/apache/arrow/issues/49392) — **Filtering corrupts data in column containing a list array**
- PR: [#49602](https://github.com/apache/arrow/pull/49602)

This issue had only **8 comments** but disproportionate importance. It reflects a persistent challenge in analytical engines: **correct execution over nested columnar types**. Users increasingly depend on Arrow for semi-structured and nested datasets, so correctness in filtering/gather logic is essential.

### 5) R feature growth around dplyr compatibility
- PR: [#49536](https://github.com/apache/arrow/pull/49536) — **[R] Implement dplyr recode_values(), replace_values(), and replace_when()**

This continues Arrow R’s strategy of meeting users where they already work: **dplyr semantics**. The underlying need is not just convenience, but reducing semantic gaps between Arrow-backed execution and in-memory R workflows.

## 4. Bugs & Stability

Ranked by likely severity for users and engine integrity:

### Critical: Data corruption in filtered nested arrays
- Issue: [#49392](https://github.com/apache/arrow/issues/49392)
- Fix PR: [#49602](https://github.com/apache/arrow/pull/49602) — **closed**

**Severity:** Critical  
**Why it matters:** This was a **query correctness/data corruption** bug affecting filtering on list-valued columns. Such bugs are particularly serious in analytical storage/query engines because they can silently produce wrong answers.  
**Status:** Fix landed quickly, which is a strong health signal.

### High: Potential Parquet timestamp corruption due to integer overflow
- PR: [#49615](https://github.com/apache/arrow/pull/49615) — **[C++][Parquet] Check for integer overflow when coercing timestamps**
- Related issue: [#47657](https://github.com/apache/arrow/issues/47657) if referenced by PR title only

**Severity:** High  
**Why it matters:** Silent overflow during timestamp unit coercion can corrupt stored values when writing Parquet. This is a classic analytical storage risk because it affects long-term persisted correctness, not just transient query execution.  
**Status:** Active PR, not yet merged.

### High: IPC differential fuzzing path may act on unvalidated batches
- Issue: [#49617](https://github.com/apache/arrow/issues/49617)
- PR: [#49618](https://github.com/apache/arrow/pull/49618)

**Severity:** High  
**Why it matters:** This is more security/reliability-facing than user-facing, but invalid batch handling in fuzzing often points to deeper parser/reader hardening gaps.  
**Status:** Fix PR opened immediately the same day.

### Medium: Potential null-pointer dereference in C++ bridge code
- Issue: [#49445](https://github.com/apache/arrow/issues/49445)

**Severity:** Medium  
**Why it matters:** Potential crash risk in `arrow/c/bridge.cc`, relevant for embedding/interoperability scenarios.  
**Status:** Open; no linked fix PR in the provided snapshot.

### Medium: MATLAB CI blocked by GitHub Action permission policy
- Issue: [#49611](https://github.com/apache/arrow/issues/49611)

**Severity:** Medium  
**Why it matters:** Not core engine correctness, but it weakens cross-language assurance and contributor workflow for MATLAB support.  
**Status:** Open.

### Medium: Intermittent MinGW JSON test segfault
- PR: [#49462](https://github.com/apache/arrow/pull/49462) — **[C++][CI] Fix intermittent segfault in arrow-json-test with MinGW**

**Severity:** Medium  
**Why it matters:** Affects Windows CI stability and confidence in JSON reader behavior under MinGW.  
**Status:** Open.

### Low-to-Medium: R zero-length POSIXct crash edge case
- PR: [#49619](https://github.com/apache/arrow/pull/49619)
- Earlier closed PR: [#48854](https://github.com/apache/arrow/pull/48854)

**Severity:** Low-to-Medium  
**Why it matters:** Edge-case crash in R type inference/Parquet writing around `POSIXct` and empty timezone attributes, but still important for robustness.  
**Status:** Active replacement PR suggests prior attempt did not complete.

## 5. Feature Requests & Roadmap Signals

### Query engine/API cleanup: scanner deprecation and ScanNode direction
- Issue: [#31786](https://github.com/apache/arrow/issues/31786) — **Deprecate "scanner" from public API**
- Issue: [#31787](https://github.com/apache/arrow/issues/31787) — **Scanner -> ScanNode**

These old but still-open issues are strong roadmap signals. They suggest Arrow’s dataset/query API is still converging toward a cleaner separation between **public query options** and **execution-plan internals**. This matters for analytical engine users who build on dataset scanning and execution plans directly.

### Larger-than-memory hash joins
- Issue: [#31769](https://github.com/apache/arrow/issues/31769) — **Support hash-join on larger than memory datasets**

This is one of the clearest analytical-engine roadmap items in the backlog. Supporting out-of-core or partitioned hash joins would materially improve Arrow’s usefulness in heavier ETL and local OLAP execution.

### R SQL/dplyr compatibility expansion
- PR: [#49536](https://github.com/apache/arrow/pull/49536) — **Implement dplyr recode_values(), replace_values(), and replace_when()**

Likely candidate for a near-term release because it is already in PR form and aligned with Arrow R’s ongoing direction: broadening **query translation/function coverage**.

### Azure Blob filesystem exposure in R
- PR: [#49553](https://github.com/apache/arrow/pull/49553) — **[R] Expose azure blob filesystem**

This looks like a practical near-term candidate as well. The C++ core and PyArrow already support Azure, so exposing it in R would close a cross-language capability gap and improve cloud storage parity.

### Flight SQL ODBC packaging/build maturity
- PR: [#46099](https://github.com/apache/arrow/pull/46099)
- PR: [#49585](https://github.com/apache/arrow/pull/49585)

This is a major roadmap signal for SQL interoperability. If these land, the next version could noticeably improve **desktop BI / ODBC consumer access** to Arrow Flight SQL endpoints.

### Likely next-version inclusions
Most plausible based on maturity and active movement:
1. **Parquet timestamp overflow safety** — [#49615](https://github.com/apache/arrow/pull/49615)
2. **R zero-length POSIXct robustness fix** — [#49619](https://github.com/apache/arrow/pull/49619)
3. **R dplyr function additions** — [#49536](https://github.com/apache/arrow/pull/49536)
4. **IPC fuzzing validation hardening** — [#49618](https://github.com/apache/arrow/pull/49618)
5. Possibly **Azure Blob filesystem for R** — [#49553](https://github.com/apache/arrow/pull/49553)

## 6. User Feedback Summary

### Main pain points surfacing from users

#### 1) Correctness over nested data is non-negotiable
- Issue: [#49392](https://github.com/apache/arrow/issues/49392)

A real user hit corruption when filtering Parquet-backed list-valued data into Pandas. This is a strong reminder that Arrow is being used in **production analytics paths**, not just as an interchange layer, and users expect exact correctness for nested types.

#### 2) Better schema/type inference ergonomics in Python are still wanted
- Issue: [#31209](https://github.com/apache/arrow/issues/31209)

Users want to derive Arrow types more naturally from Python hints and objects, especially for UDFs. This reflects demand for Arrow as a **developer-facing compute substrate**, not only a storage format.

#### 3) Cross-environment/timezone edge cases remain painful in R
- PR: [#49619](https://github.com/apache/arrow/pull/49619)
- PR: [#49608](https://github.com/apache/arrow/pull/49608)
- Issue: [#31777](https://github.com/apache/arrow/issues/31777)

R users are still encountering friction around datetime handling, metadata warnings, and Windows-specific locale behavior. These are classic adoption blockers in analytics because they show up in real pipelines rather than toy examples.

#### 4) Cloud and connector parity matters
- PR: [#49553](https://github.com/apache/arrow/pull/49553)
- PRs: [#46099](https://github.com/apache/arrow/pull/46099), [#49585](https://github.com/apache/arrow/pull/49585)

Users want Arrow features available consistently across languages and access methods: **Azure in R**, **ODBC for Flight SQL**, and generally fewer connector gaps.

#### 5) Performance/storage access tuning remains relevant
- Issue: [#31174](https://github.com/apache/arrow/issues/31174) — reduce directory/file I/O when reading partitioned Parquet with partition filters
- Issue: [#31733](https://github.com/apache/arrow/issues/31733) — seek support for `BufferedInputStream`
- Issue: [#31760](https://github.com/apache/arrow/issues/31760) — memory mapping off by default

These indicate that users are operating Arrow against **remote/object storage and partitioned datasets**, where I/O behavior strongly affects query performance.

## 7. Backlog Watch

These older items look important and still need maintainer attention:

### 1) Out-of-core join support
- Issue: [#31769](https://github.com/apache/arrow/issues/31769)

This remains strategically important for Arrow’s analytical execution ambitions. Without a memory-scalable join strategy, some workloads will remain out of reach.

### 2) Scanner public API transition
- Issue: [#31786](https://github.com/apache/arrow/issues/31786)
- Issue: [#31787](https://github.com/apache/arrow/issues/31787)

These are long-lived design issues. Leaving them unresolved risks continued API ambiguity for users building query workflows atop datasets.

### 3) Partition pruning / unnecessary I/O in Parquet datasets
- Issue: [#31174](https://github.com/apache/arrow/issues/31174)

For OLAP-style data lakes, avoiding needless directory and file touches is a major performance concern. This issue still matters for Arrow’s competitiveness as a local or embedded scan engine over partitioned data.

### 4) Parquet metadata mapping inconsistency
- Issue: [#31723](https://github.com/apache/arrow/issues/31723)

Marked **Priority: Critical**, this issue concerns inconsistent mapping of Parquet `key_value_metadata` to Arrow schema metadata. That affects schema fidelity and interoperability with external producers like GDAL.

### 5) BufferedInputStream seek support
- Issue: [#31733](https://github.com/apache/arrow/issues/31733)

Important for remote storage efficiency and random-access patterns over large objects. This is a practical feature with clear user value.

### 6) Dependency upgrade PR with breaking changes
- PR: [#48964](https://github.com/apache/arrow/pull/48964)

This needs careful maintainer attention because dependency refreshes are valuable, but public API breakage can ripple through many downstream systems.

---

## Overall Health Assessment

Project health looks **good**, with a notable emphasis on **correctness, hardening, and platform maintenance**. The quick closure of the nested filtering corruption bug is a particularly positive sign for operational responsiveness. The main caution is that several **important architectural and performance issues** in query execution and dataset scanning remain old and unresolved, suggesting Arrow continues to prioritize reliability and incremental compatibility improvements over major execution-engine leaps in the immediate term.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*