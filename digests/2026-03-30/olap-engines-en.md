# Apache Doris Ecosystem Digest 2026-03-30

> Issues: 6 | PRs: 28 | Projects covered: 10 | Generated: 2026-03-30 01:45 UTC

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

# Apache Doris Project Digest — 2026-03-30

## 1. Today’s Overview

Apache Doris remained actively developed today, with **28 pull requests updated** and **6 issues updated** in the last 24 hours. The activity profile is clearly **PR-heavy**, suggesting the project is in an implementation and stabilization phase rather than a release announcement cycle, with **no new releases published**. Current work concentrates on **query/storage correctness, Iceberg/data lake integration, backup/restore capability, observability, and engine robustness**. Overall health looks solid: several fixes were merged or backported quickly, though a few open items indicate ongoing needs around **cluster backup**, **data lake samples**, and **SQL feature completeness**.

---

## 2. Project Progress

### Merged/Closed PRs today

#### Storage/query engine stability

- **[PR #61510](https://github.com/apache/doris/pull/61510)** — **[fix](olap) Avoid polluting the schema cache in OlapScanner**  
  This is the most significant stability fix in today’s set. The PR addresses a **SIGSEGV / invalid memory access** scenario related to schema cache pollution in `OlapScanner`. It has already triggered **branch backports**:
  - [PR #61853](https://github.com/apache/doris/pull/61853) for 4.0
  - [PR #61854](https://github.com/apache/doris/pull/61854) for 4.1  
  This indicates maintainers view it as important for supported release branches.

- **[PR #61790](https://github.com/apache/doris/pull/61790)** — **[fix](azure) Fix incorrect modification timestamps in AzureObjStorage**  
  This resolves timestamp correctness bugs in multiple Azure object storage code paths. For external table scans, metadata refresh, and file selection logic, timestamp correctness is operationally important; fixing this improves **cloud storage consistency and correctness**.

- **[PR #61847](https://github.com/apache/doris/pull/61847)** — branch backport of parquet timestamp INT96 write fix  
  Backports **[PR #61832](https://github.com/apache/doris/pull/61832)** to 4.1. This improves **Parquet writer compatibility** for timestamp `INT96`, a recurring interoperability concern in lakehouse ecosystems.

- **[PR #61703](https://github.com/apache/doris/pull/61703)** — **[tool](meta_tool) Add gen_empty_segment operation**  
  While tooling-focused, this helps engineering and operators generate empty segment files for **testing/debugging**, improving maintainability and incident investigation.

#### Testing and correctness coverage

- **[PR #61762](https://github.com/apache/doris/pull/61762)** — **Add TPC-H SF10 MOR unique key regression tests**  
  This strengthens test coverage for **Merge-On-Read (MOR) unique key tables**, especially where previous coverage leaned toward Merge-On-Write. This is a useful signal that Doris is hardening correctness and performance behavior across key table models.

#### Refactoring and codebase evolution

- **[PR #61485](https://github.com/apache/doris/pull/61485)** — **Refactor data lake reader**  
  Closed today, and apparently followed by the still-open continuation **[PR #61783](https://github.com/apache/doris/pull/61783)**. This suggests data lake reader work is being restructured rather than abandoned.

### What these changes advance

Today’s merged/closed work notably advanced:

- **Crash prevention in OLAP scan paths**
- **Cloud object storage metadata correctness**
- **Parquet interoperability**
- **Regression test depth for MOR unique-key tables**
- **Internal tooling for storage/debugging**
- **Ongoing modernization of data lake reader internals**

---

## 3. Community Hot Topics

### 1) Cluster backup and restore capability
- **[Issue #61464](https://github.com/apache/doris/issues/61464)** — *Doris Cluster Snapshot Backup*  
  Comments: 2  
  This is one of the most roadmap-relevant issues today. The request is specifically about **periodic snapshot backups in Doris Cloud mode**, reflecting enterprise demand for **disaster recovery, rollback, and operational safety** at cluster scope rather than table scope.

- **[PR #61710](https://github.com/apache/doris/pull/61710)** — *support concurrent backup/restore*  
  This PR is highly aligned with the above need. It targets a current bottleneck where Doris allows only **one backup/restore job per database**, which is insufficient for CCR and large-scale synchronization scenarios.  
  **Technical need behind both items:** Doris users are increasingly operating in **cloud-native, multi-table, high-throughput replication environments**, where backup throughput and concurrency matter as much as correctness.

### 2) Iceberg and data lake integration
- **[PR #61398](https://github.com/apache/doris/pull/61398)** — *Support iceberg v3 row lineage*  
- **[PR #61848](https://github.com/apache/doris/pull/61848)** — branch-4.1 backport  
- **[PR #61646](https://github.com/apache/doris/pull/61646)** — *Refactor iceberg system tables to use native table execution path*  
- **[PR #61783](https://github.com/apache/doris/pull/61783)** — *data_lake_reader_refactoring*  
- **[Issue #56687](https://github.com/apache/doris/issues/56687)** — *sample that datalake `iceberg_and_paimon` is it really correct?*  
  Comments: 3  

  Iceberg remains one of the strongest activity clusters. The mix of feature work, refactoring, backports, and sample correctness questioning shows Doris is investing heavily in **lakehouse interoperability**, but users still need **clearer guarantees and examples**.  
  **Underlying need:** production-grade integration requires not only feature support, but also **correct samples, stable readers, and native execution-path optimizations**.

### 3) SQL compatibility and function surface expansion
- **[PR #61850](https://github.com/apache/doris/pull/61850)** — *support simple sql function from Trino&Presto*  
- **[PR #61846](https://github.com/apache/doris/pull/61846)** — *Support mmhash3_u64_v2*  
- Closed stale feature issues:
  - **[Issue #55547](https://github.com/apache/doris/issues/55547)** — MySQL-style `ON DUPLICATE KEY UPDATE`
  - **[Issue #56258](https://github.com/apache/doris/issues/56258)** — `MERGE INTO`
  - **[Issue #56260](https://github.com/apache/doris/issues/56260)** — `uuid v7`
  - **[Issue #56261](https://github.com/apache/doris/issues/56261)** — read/write Vortex columnar files

  **Underlying need:** users want Doris to fit more naturally into mixed-SQL environments with semantics familiar from **MySQL, PostgreSQL, Trino, and Presto**, while also keeping pace with new data formats and utility functions.

---

## 4. Bugs & Stability

Ranked by apparent severity based on impact and available evidence:

### Critical
1. **OlapScanner schema cache pollution causing crash**
   - Fix: **[PR #61510](https://github.com/apache/doris/pull/61510)**
   - Backports: **[PR #61853](https://github.com/apache/doris/pull/61853)**, **[PR #61854](https://github.com/apache/doris/pull/61854)**
   - Impact: **SIGSEGV / process crash** in scan path. This is the most severe item in today’s digest because it threatens process stability.

### High
2. **AutoReleaseClosure data race with callback reuse**
   - **[PR #61782](https://github.com/apache/doris/pull/61782)**
   - Impact: RPC callback reuse can read mutated state from a new RPC, implying potential **incorrect failure/success handling, race conditions, and hard-to-reproduce distributed execution bugs**.

3. **Missing segment files causing user-visible failures**
   - **[PR #61844](https://github.com/apache/doris/pull/61844)**
   - Impact: queries and loads can fail when a segment file is missing. The proposed behavior is to **skip not-found segments** under config control. This is a practical resiliency improvement, though operators should assess whether “ignore and continue” fits their data integrity expectations.

### Medium
4. **Incorrect Azure object modification timestamps**
   - Fix merged: **[PR #61790](https://github.com/apache/doris/pull/61790)**
   - Impact: incorrect file timestamps can affect metadata interpretation, file listing behavior, and potentially freshness decisions for external storage.

5. **Parquet timestamp INT96 write correctness**
   - **[PR #61832](https://github.com/apache/doris/pull/61832)** and backport **[PR #61847](https://github.com/apache/doris/pull/61847)**
   - Impact: interoperability issue with Parquet consumers/writers; important for data exchange pipelines.

6. **Near-limit partition metrics modeled as counters instead of gauges**
   - **[PR #61845](https://github.com/apache/doris/pull/61845)**
   - Impact: observability bug rather than data correctness bug, but it can mislead operators by reporting stale near-limit conditions.

### Low to Medium
7. **Potential sample/documentation correctness problem for Iceberg + Paimon**
   - **[Issue #56687](https://github.com/apache/doris/issues/56687)**
   - Impact: not an engine bug per se, but problematic examples can block adoption and produce false support assumptions.

---

## 5. Feature Requests & Roadmap Signals

### Strong signals

#### Backup/restore is becoming a bigger strategic area
- **[Issue #61464](https://github.com/apache/doris/issues/61464)** — cluster snapshot backup
- **[PR #61710](https://github.com/apache/doris/pull/61710)** — concurrent backup/restore

These two items together strongly suggest Doris may prioritize **more robust disaster recovery and operational automation** in upcoming versions, especially for **cloud deployments and CCR workflows**.

#### Iceberg/lakehouse support is still expanding
- **[PR #61398](https://github.com/apache/doris/pull/61398)** — Iceberg v3 row lineage
- **[PR #61646](https://github.com/apache/doris/pull/61646)** — native path for Iceberg system tables
- **[PR #61783](https://github.com/apache/doris/pull/61783)** — data lake reader refactoring

This indicates a likely next-version emphasis on:
- better **Iceberg v3 compatibility**
- better **system table query behavior**
- more maintainable and performant **multi-catalog/lake readers**

### Medium signals

#### SQL ecosystem compatibility
- **[PR #61850](https://github.com/apache/doris/pull/61850)** — Trino/Presto-style function support
- **[Issue #55547](https://github.com/apache/doris/issues/55547)** — `ON DUPLICATE KEY UPDATE` semantics
- **[Issue #56258](https://github.com/apache/doris/issues/56258)** — `MERGE INTO`
- **[Issue #56260](https://github.com/apache/doris/issues/56260)** — `uuid v7`

Even though several feature issues were closed as stale, the demand pattern is clear: users want **broader SQL DML semantics and function compatibility**. Of these, **small SQL functions** are the most likely near-term additions; full **`MERGE INTO`** or MySQL-compatible upsert semantics would be larger engineering efforts.

#### Cloud/storage connector expansion
- **[PR #61329](https://github.com/apache/doris/pull/61329)** — Alibaba Cloud OSS native storage vault support with STS AssumeRole

This is a meaningful cloud adoption signal, especially for users running Doris in **Alibaba Cloud environments** and needing **instance profile / AssumeRole-style auth**.

### Lower-probability or exploratory signals
- **[Issue #56261](https://github.com/apache/doris/issues/56261)** — Vortex columnar format support  
  Interesting ecosystem-facing request, but there is not enough surrounding activity to suggest near-term inclusion.

---

## 6. User Feedback Summary

Today’s user and contributor feedback points to several concrete pain points:

- **Operational resilience is a top concern.** Users want **cluster-level backups**, **concurrent restore/backup**, and graceful handling of storage anomalies. This is typical of teams running Doris in production at scale rather than evaluating it casually.
- **Data lake integrations must be trustworthy, not just available.** The open sample-related issue **[Issue #56687](https://github.com/apache/doris/issues/56687)** shows users scrutinize whether published Iceberg/Paimon examples actually work as advertised.
- **Cross-engine SQL compatibility remains important.** Requests around `MERGE INTO`, `ON DUPLICATE KEY UPDATE`, `uuid v7`, and Trino/Presto functions indicate users are porting workloads or trying to minimize SQL rewrites.
- **Cloud object storage correctness matters operationally.** Fixes around Azure timestamps and Alibaba OSS support show Doris users increasingly depend on cloud-native external storage and expect production-grade behavior there.
- **Testing depth is appreciated implicitly.** The new MOR TPC-H regression coverage suggests the project is responding to correctness/performance expectations for more advanced table models.

Overall, user sentiment inferred from activity is less about raw query speed today and more about **correctness, compatibility, and production operations**.

---

## 7. Backlog Watch

These items appear to deserve maintainer attention because they are either strategically important, still open, or indicative of unresolved demand.

### High-priority backlog candidates

- **[Issue #61464](https://github.com/apache/doris/issues/61464)** — *Doris Cluster Snapshot Backup*  
  Important strategic feature for cloud and enterprise operations. The issue is recent but highly aligned with real deployment needs.

- **[PR #61710](https://github.com/apache/doris/pull/61710)** — *support concurrent backup/restore*  
  Worth close review because it addresses a direct throughput bottleneck in backup/restore workflows.

- **[PR #60761](https://github.com/apache/doris/pull/60761)** — *Fix HTTP API authentication framework for admin operations*  
  This has been open since 2026-02-14 and touches **security-sensitive admin APIs**. Long-open security/auth changes deserve prompt maintainer attention due to their blast radius.

- **[PR #61329](https://github.com/apache/doris/pull/61329)** — *Alibaba Cloud OSS native storage vault support with STS AssumeRole*  
  Important for cloud adoption and regional user growth.

### Watchlist: technical debt / architectural work

- **[PR #61783](https://github.com/apache/doris/pull/61783)** — *data_lake_reader_refactoring*  
- **[PR #61646](https://github.com/apache/doris/pull/61646)** — *Refactor iceberg system tables to use native table execution path*  
- **[PR #61690](https://github.com/apache/doris/pull/61690)** — *refactor-agg*  

These are likely foundational changes that can unlock future performance and maintainability improvements, but they may require more reviewer bandwidth because they are architectural rather than narrowly bug-fix oriented.

### Stale demand signals to keep in mind

Although closed as stale, the following requests reflect persistent ecosystem expectations:
- **[Issue #55547](https://github.com/apache/doris/issues/55547)** — MySQL-style `ON DUPLICATE KEY UPDATE`
- **[Issue #56258](https://github.com/apache/doris/issues/56258)** — `MERGE INTO`
- **[Issue #56260](https://github.com/apache/doris/issues/56260)** — `uuid v7`
- **[Issue #56261](https://github.com/apache/doris/issues/56261)** — Vortex file format support

These may not be active roadmap items now, but they remain useful indicators of where users want Doris to evolve.

---

## Overall Health Assessment

Apache Doris looks **healthy and actively maintained** on 2026-03-30. The day’s work shows a good balance of **bug fixing, branch backporting, test hardening, data lake feature development, and cloud/storage integration**. The strongest short-term themes are **stability in scan/storage paths**, **Iceberg and external table maturity**, and **backup/restore capability expansion**. The main caution area is that some strategically important topics—especially **cluster snapshot backup, admin API auth, and broad SQL compatibility asks**—still need sustained maintainer focus.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — OLAP / Analytical Storage Open-Source Ecosystem  
**Date based on digests:** 2026-03-30

## 1. Ecosystem Overview

The open-source analytical engine landscape remains highly active, but the center of gravity has shifted from “pure speed” competition toward **correctness, cloud storage behavior, lakehouse interoperability, and operational resilience**. Across engines, the strongest recurring themes are **Iceberg/Paimon/Parquet integration, object storage correctness and cost control, SQL compatibility expansion, and hardening of planner/runtime edge cases**. ClickHouse and Doris show the heaviest core-engine delivery signals in the OLAP-serving category, while DuckDB continues to strengthen embedded/interactive analytics, and Iceberg/Delta remain critical as storage-layer interoperability and transaction substrates rather than standalone query engines. Overall, the ecosystem looks healthy, with broad innovation continuing, but many projects are clearly in a **stabilize-and-integrate** phase rather than a feature-only expansion phase.

---

## 2. Activity Comparison

### Daily activity snapshot

| Project | Issues Updated | PRs Updated | Releases Today | Interpreted Status | Health Score* |
|---|---:|---:|---|---|---:|
| **Apache Doris** | 6 | 28 | No | Active, PR-heavy, stability + lakehouse + ops focus | **8.5/10** |
| **ClickHouse** | 25 | 265 | No | Extremely active, broad bug-fix and feature throughput | **8.5/10** |
| **DuckDB** | 7 | 23 | No | High responsiveness, correctness-heavy, embedded focus | **8.3/10** |
| **StarRocks** | 1 | 10 | No | Stable but lower throughput, review-constrained | **7.6/10** |
| **Apache Iceberg** | 3 | 19 | No | Ecosystem-important, active but review-constrained | **7.8/10** |
| **Delta Lake** | 2 | 5 | No | Light activity, correctness-sensitive queue, review-heavy | **7.4/10** |
| **Databend** | 1 | 8 | **Nightly** | Healthy incremental delivery, SQL/planner fixes | **8.0/10** |
| **Velox** | 1 | 12 | No | Healthy infra/runtime work, correctness-focused | **8.0/10** |
| **Apache Gluten** | 1 | 5 | No | Stable, modest activity, upstream-dependent | **7.2/10** |
| **Apache Arrow** | 19 | 12 | No | Stable maintenance mode, broad ecosystem substrate | **8.0/10** |

\*Health score is a qualitative synthesis of activity level, fix responsiveness, release/backport behavior, backlog risk, and severity of open issues.

### Quick interpretation
- **Highest raw momentum:** ClickHouse by a wide margin.
- **Strongest among MPP OLAP peers for balanced execution + backports:** Doris.
- **Best embedded analytics momentum:** DuckDB.
- **Most ecosystem-critical table format/control planes:** Iceberg and Delta.
- **Lower visible throughput but still strategically relevant:** StarRocks, Databend, Velox.

---

## 3. Apache Doris's Position

### Where Doris is strong versus peers
Apache Doris currently looks well-positioned in the middle ground between **high-performance MPP OLAP serving** and **modern lakehouse interoperability**. Relative to StarRocks, Doris shows **higher visible daily merge/backport momentum** and stronger current activity around **Iceberg integration, backup/restore, cloud object storage correctness, and regression coverage**. Relative to ClickHouse, Doris appears less hyperactive in raw volume, but more focused on a narrower set of enterprise priorities: **scan-path stability, cloud-native backup/restore, external table correctness, and SQL compatibility expansion**.

### Doris’s technical posture vs peers
- **Vs ClickHouse:**  
  Doris is more visibly investing in **database-style operational capabilities** such as backup/restore concurrency and cluster snapshot discussions, whereas ClickHouse’s day was more dominated by **planner/type/storage-edge bug fixing** and broader ecosystem breadth.
- **Vs DuckDB:**  
  Doris is clearly oriented toward **distributed production serving and warehouse-style deployments**, while DuckDB is optimized for **embedded/local analytics, notebook workflows, and application integration**.
- **Vs Iceberg/Delta:**  
  Doris is a **query/storage engine consuming open formats**, not a table-format control plane. Its competitiveness depends on how well it federates with and accelerates over those formats.
- **Vs StarRocks:**  
  Both target modern MPP analytics, but Doris today shows stronger signals in **backup/restore, Iceberg/data-lake reader evolution, and branch maintenance discipline**.
- **Vs Databend:**  
  Databend is still comparatively lighter in community scale and more focused on SQL/planner cleanup and nightly delivery.

### Community size comparison
By visible GitHub activity:
- **Much larger:** ClickHouse
- **Comparable broad OSS relevance but different category:** DuckDB, Arrow, Iceberg
- **Roughly same strategic tier in OLAP warehouse competition:** StarRocks
- **Smaller visible day-to-day footprint:** Databend, Gluten, some Velox-adjacent projects

### Net position
Doris appears to be in a favorable position as a **serious production MPP engine with improving lakehouse support**, especially for teams that value **operational resilience, external catalog integration, and strong release-branch maintenance** over maximal ecosystem sprawl.

---

## 4. Shared Technical Focus Areas

Several requirements are emerging repeatedly across engines:

### A. Lakehouse and open table format interoperability
**Engines:** Doris, ClickHouse, Iceberg, Delta, Databend, StarRocks  
**Needs observed:**
- Better **Iceberg/Paimon support** and native execution paths
- Safer **catalog/view/schema evolution behavior**
- Better examples and connector correctness
- Improved **Parquet compatibility**, including timestamps and pruning

**Evidence:**
- Doris: Iceberg v3 row lineage, native path refactors, data lake reader refactoring
- ClickHouse: Iceberg orphan cleanup, Paimon min-max pushdown
- Iceberg: Spark/Hive/Kafka Connect/AWS behavior fixes
- Delta: Kernel protocol fidelity, Spark V2 pushdown, Flink sink expansion

### B. Object storage correctness, economics, and cloud auth
**Engines:** Doris, ClickHouse, Iceberg, Delta, Arrow, StarRocks  
**Needs observed:**
- Correct file timestamps and metadata handling
- S3/Azure/GCS/OSS auth/session correctness
- Lower request amplification and better cloud cost behavior
- Better object storage runtime resiliency

**Evidence:**
- Doris: Azure timestamp fix, Alibaba OSS STS support
- ClickHouse: S3 PUT burst issue, object-storage-linked Iceberg/Paimon work
- Iceberg: S3 connection close handling, STS region handling, chunked encoding config
- Arrow: CI/object-storage dependency failures surface portability risks

### C. Query correctness over edge cases
**Engines:** Doris, ClickHouse, DuckDB, Velox, Databend, Arrow  
**Needs observed:**
- Wrong-result bug fixes in joins, temporal functions, casts, projections, statistics
- Stronger nullability/type semantics
- Overflow-safe planner/runtime behavior
- Safer cache and callback/race handling

**Evidence:**
- Doris: OlapScanner crash, RPC callback race, Parquet timestamp correctness
- ClickHouse: text index correctness, DateTime64/Time64 semantics, projection/view failures
- DuckDB: LEFT JOIN LATERAL wrong-result bug, geometry NULL semantics
- Velox: counting join correctness under parallelism
- Databend: binary literal correctness, full outer join nullability, stats overflow
- Arrow: timestamp coercion overflow checks

### D. SQL compatibility and migration friendliness
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Databend, Gluten/Velox  
**Needs observed:**
- Trino/Presto/MySQL/Postgres/Spark function or syntax compatibility
- Better DML semantics and type coercion behavior
- Fewer rewrites when migrating workloads

**Evidence:**
- Doris: Trino/Presto functions, `MERGE INTO`, `ON DUPLICATE KEY UPDATE` demand
- DuckDB: union type casting, ATTACH flexibility, metadata APIs
- StarRocks: timezone function correctness, schema evolution
- Databend: `X'...'` literals, `ALTER TABLE ADD COLUMN IF NOT EXISTS`
- Velox/Gluten: Spark SQL function parity

### E. Operational resilience and recovery
**Engines:** Doris, ClickHouse, Iceberg, Delta  
**Needs observed:**
- Backup/restore improvements
- Better replication/recovery semantics
- Safer commit coordination
- Reduced silent corruption/data invisibility risk

**Evidence:**
- Doris: cluster snapshot backup request, concurrent backup/restore
- ClickHouse: replication assertion, storage lifecycle crashes
- Iceberg: Kafka Connect metadata commit failures after cluster recreation
- Delta: coordinated commit race with silent data loss risk

---

## 5. Differentiation Analysis

## A. Storage format orientation
- **Doris / ClickHouse / StarRocks / Databend:** primarily full analytical engines with their own execution/storage strategies, while increasingly reading open formats.
- **Iceberg / Delta:** table format + transaction/control layer, not primarily execution engines.
- **DuckDB:** embedded database engine with wide file-format interoperability.
- **Arrow:** in-memory columnar substrate and interoperability layer.
- **Velox / Gluten:** execution substrate and acceleration layer rather than end-user warehouse products.

## B. Query engine design
- **Doris / StarRocks:** distributed MPP analytical databases emphasizing warehouse/serving workloads.
- **ClickHouse:** highly optimized columnar OLAP engine with very broad execution/storage feature surface and rapid iteration.
- **DuckDB:** in-process vectorized engine optimized for local, embedded, and interactive analytics.
- **Velox:** reusable execution engine for upstream consumers.
- **Gluten:** Spark acceleration layer using Velox/ClickHouse backends.

## C. Target workloads
- **Doris:** real-time analytics, lakehouse querying, warehouse serving, enterprise OLAP operations.
- **ClickHouse:** high-concurrency analytics, log/observability/event analytics, large-scale OLAP, growing lake query usage.
- **DuckDB:** developer analytics, notebooks, local ETL, embedded applications, lightweight data science.
- **StarRocks:** warehouse + serving analytics with strong enterprise operability focus.
- **Iceberg / Delta:** shared table layers for multi-engine data lake architectures.
- **Databend:** cloud data warehouse/lakehouse convergence, still maturing relative to leaders.

## D. SQL compatibility stance
- **Doris:** actively broadening compatibility, especially around Trino/Presto-style functions and enterprise DML asks.
- **ClickHouse:** broad SQL surface, but still exposing many edge-case semantic bugs due to complexity.
- **DuckDB:** increasingly strong standards-aligned behavior, especially for advanced SQL semantics.
- **StarRocks / Databend:** targeted compatibility improvements, less breadth than ClickHouse but often high practical value.
- **Velox / Gluten:** compatibility is downstream-oriented, especially toward Spark/Presto ecosystems.

---

## 6. Community Momentum & Maturity

### Activity tiers

#### Tier 1: Hyperactive / fastest iteration
- **ClickHouse**
- **Doris**
- **DuckDB**

These projects show strong daily engineering motion and fast response loops on correctness/stability issues.

#### Tier 2: Active but more review-constrained or subsystem-specific
- **Iceberg**
- **StarRocks**
- **Velox**
- **Databend**
- **Arrow**

These are healthy, but either narrower in scope, more infrastructure-like, or slower in merge throughput.

#### Tier 3: Strategically important but lighter visible daily throughput
- **Delta Lake**
- **Gluten**

These remain important in architecture decisions, but current GitHub signals suggest more limited daily landing velocity.

### Rapidly iterating vs stabilizing
**Rapidly iterating:**
- ClickHouse: very high throughput, broad bug-fix churn
- Doris: strong implementation/backport motion
- DuckDB: quick bug-to-fix loops

**Stabilizing / integration-heavy:**
- Iceberg: connector/cloud correctness, backlog aging
- Delta: correctness-heavy, review-heavy
- Arrow: maintenance mode, API cleanup, portability
- StarRocks: stable but slower review cadence

### Maturity signals
- **Most mature by ecosystem breadth:** ClickHouse, Arrow, Iceberg
- **Most mature in embedded analytics:** DuckDB
- **Strong mature-candidate in MPP OLAP with modern lake integration:** Doris
- **Maturing but still proving breadth/community scale:** Databend, Gluten

---

## 7. Trend Signals

### 1. “Lakehouse support” now means correctness, not just connectivity
Users no longer reward basic Iceberg/Delta/Paimon support alone. They expect:
- native execution paths
- schema/view correctness
- sample reliability
- commit/recovery safety
- timestamp and metadata correctness

**Value to architects:** evaluate engines on **operational correctness over open formats**, not just connector checklists.

### 2. Cloud object storage behavior is now a first-class buying criterion
Across engines, teams care about:
- S3/Azure/GCS correctness
- auth/session lifecycle
- timestamp fidelity
- request amplification and cost
- resiliency under long-running reads

**Value to data engineers:** object-store semantics can materially affect query freshness, cost, and failure modes.

### 3. Correctness bugs are increasingly in optimizer/type-system edge cases
Many active issues are not obvious crashes but:
- wrong results
- silent overflow
- temporal semantic mismatches
- nullability/type inconsistencies
- projection/view planner regressions

**Value to technical decision-makers:** benchmark speed is insufficient; prioritize projects with **strong regression coverage and fast fix/backport discipline**.

### 4. Operational features are rising in importance for warehouse engines
Backup/restore, commit recovery, replication correctness, and cluster-level resilience appear more frequently.

**Value to architects:** Doris stands out positively here among MPP peers in today’s snapshot.

### 5. SQL migration friction remains a major adoption barrier
Demand for compatibility with MySQL, Trino, Presto, Spark, and PostgreSQL semantics remains strong.

**Value to platform teams:** if minimizing SQL rewrites is a goal, monitor the pace of compatibility work—not just raw ANSI claims.

### 6. The ecosystem is stratifying into layers
A clearer stack is emerging:
- **Storage/control plane:** Iceberg, Delta
- **Execution substrate:** Arrow, Velox
- **Acceleration/integration:** Gluten
- **End-user analytical engines:** Doris, ClickHouse, DuckDB, StarRocks, Databend

**Value to architects:** engine selection increasingly depends on whether you want an integrated warehouse or a composable stack.

---

## Closing Assessment

For technical decision-makers, **Apache Doris currently compares well as a production-oriented MPP OLAP engine that is strengthening in exactly the areas enterprises increasingly care about: correctness, cloud storage behavior, backup/restore, and Iceberg/lakehouse interoperability**. ClickHouse still leads in sheer community velocity and breadth, while DuckDB dominates embedded/local analytics. If the selection criteria emphasize **distributed analytics plus operational resilience plus open table ecosystem integration**, Doris has a strong and improving position in this cohort.

If you want, I can next turn this into:
1. a **Doris-vs-ClickHouse-vs-StarRocks decision matrix**,  
2. a **radar chart style scoring summary**, or  
3. a **short CTO/executive briefing version**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-30

## 1. Today's Overview

ClickHouse remains extremely active: **25 issues** and **265 pull requests** saw updates in the last 24 hours, with **74 PRs merged/closed** and **9 issues closed**. The day’s signal is dominated by **bug fixing, CI stabilization, and edge-case correctness work**, especially around text indexes, temporal types, replication, and planner/analyzer behavior. At the same time, there are clear forward-looking product investments in **lakehouse interoperability** (Iceberg, Paimon), **object storage integrations**, and **SQL/runtime ergonomics**. Overall project health looks strong, but the volume of newly reported correctness bugs suggests ClickHouse is still absorbing complexity from recent optimizer, type-system, and storage-engine changes.

## 2. Project Progress

Today’s merged/closed work points to continued progress in three core areas: query planning correctness, storage pruning/performance, and compatibility hardening.

### Query engine and SQL correctness
- **Statistics-based part pruning** was closed/advanced via [PR #94140](https://github.com/ClickHouse/ClickHouse/pull/94140), adding a `StatisticsPartPruner` that uses MinMax statistics to skip parts more intelligently. This is a meaningful execution-engine improvement for selective queries.
- Several issue closures indicate fixes around **text index correctness**:
  - [Issue #100879](https://github.com/ClickHouse/ClickHouse/issues/100879) — wrong results in `02346_text_index_bug89605` with `query_plan_merge_expressions = 0`
  - [Issue #99502](https://github.com/ClickHouse/ClickHouse/issues/99502) — full text index with `hasAllTokens OR hasAllTokens` returned false positives  
  These are important because they affect result correctness, not just performance.
- Analyzer behavior appears to be improving through issue closure:
  - [Issue #76787](https://github.com/ClickHouse/ClickHouse/issues/76787) — timezone handling with `DateTime64` aliases
  - [Issue #62914](https://github.com/ClickHouse/ClickHouse/issues/62914) — incorrect duplicated-alias error in subqueries

### Storage and metadata robustness
- ClickHouse continues to invest in external table/lakehouse support:
  - [PR #99127](https://github.com/ClickHouse/ClickHouse/pull/99127) — `remove_orphan_files` support for Iceberg tables
  - [PR #100160](https://github.com/ClickHouse/ClickHouse/pull/100160) — Paimon min-max index pushdown
- A replication/stability bug remains open:
  - [Issue #101070](https://github.com/ClickHouse/ClickHouse/issues/101070) — assertion in `ReplicatedMergeTreeQueue::createLogEntriesToFetchBrokenParts`

### CI and reliability engineering
A notable share of work is CI hardening and flaky-test repair:
- [PR #101142](https://github.com/ClickHouse/ClickHouse/pull/101142) — flaky config reload test fix
- [PR #101060](https://github.com/ClickHouse/ClickHouse/pull/101060) — TSan crash fix by reducing mutex churn
- [PR #101097](https://github.com/ClickHouse/ClickHouse/pull/101097) — UBSan fix in `parseReadableSize`
- [Issue #100584](https://github.com/ClickHouse/ClickHouse/issues/100584), [Issue #100842](https://github.com/ClickHouse/ClickHouse/issues/100842) — sanitizer/assertion issues closed

Net: the project is progressing, but today’s engineering energy leaned more toward **stabilization and correctness** than headline end-user features.

## 3. Community Hot Topics

The most discussed and strategically important items today reflect a mix of **storage correctness**, **novel functions**, and **ecosystem integration**.

### Most active issues
- [Issue #99799](https://github.com/ClickHouse/ClickHouse/issues/99799) — **CI crash: double deletion of `MergeTreeDataPartCompact` in multi_index**  
  **19 comments**. This is the most active issue listed and likely represents a deep storage-engine lifecycle bug involving compact parts and multi-index logic. High discussion suggests maintainers are actively triaging a nontrivial memory-safety problem.
  
- [Issue #81183](https://github.com/ClickHouse/ClickHouse/issues/81183) — **Functions for rolling hashes**  
  **4 comments**. This request signals demand for low-level data-processing primitives useful for **content-defined chunking**, binary diffing, and deduplication workflows. It reflects ClickHouse’s growing use in nontraditional analytical pipelines beyond SQL reporting.

- [Issue #100960](https://github.com/ClickHouse/ClickHouse/issues/100960) — **Large burst of S3 PUTs on TTL to S3 disk**  
  **3 comments**. This points to a real operational pain point: users care not only about correctness but also **cloud object storage request economics and write amplification**.

- [Issue #101116](https://github.com/ClickHouse/ClickHouse/issues/101116) — **`SHOW MASKING POLICIES` returns wrong error code**  
  Though low-comment so far, this is relevant for enterprise SQL compatibility and governance features.

### Most notable PRs under discussion / active review
- [PR #100160](https://github.com/ClickHouse/ClickHouse/pull/100160) — **Paimon minmax index pushdown**  
  Strong roadmap signal toward tighter lakehouse query federation/performance.
- [PR #95181](https://github.com/ClickHouse/ClickHouse/pull/95181) — **Wildcard support for `url` table function**  
  This addresses practical data ingestion ergonomics.
- [PR #99721](https://github.com/ClickHouse/ClickHouse/pull/99721) — **`output_format_float_precision`**  
  Suggests continued attention to output compatibility and user-facing formatting control.
- [PR #99127](https://github.com/ClickHouse/ClickHouse/pull/99127) — **Iceberg orphan file cleanup**
- [PR #101114](https://github.com/ClickHouse/ClickHouse/pull/101114) — **`compress_per_column_in_compact_parts`**  
  Indicates ongoing storage-format tuning for MergeTree compact parts.

### Underlying technical needs
Across these items, the community is signaling four priorities:
1. **Lower operational cost on object storage**
2. **Better correctness guarantees for newer features** like text indexes and analyzer/planner logic
3. **Lakehouse interoperability** with Iceberg/Paimon/object storage
4. **More expressive SQL/data-processing primitives**

## 4. Bugs & Stability

Below are the most important bug reports updated today, roughly ranked by severity.

### Critical / high severity
1. [Issue #99799](https://github.com/ClickHouse/ClickHouse/issues/99799) — **Double deletion crash in `MergeTreeDataPartCompact`**
   - Category: crash / memory safety / storage engine
   - Severity: **Critical**
   - Impact: potential server crash in CI, likely exploitable in specific execution/storage paths
   - Fix PR: none listed in provided data

2. [Issue #101070](https://github.com/ClickHouse/ClickHouse/issues/101070) — **Replication assertion failure**
   - Category: replication / `ReplicatedMergeTree`
   - Severity: **High**
   - Impact: startup/loading stress-path instability in replicated environments
   - Fix PR: none listed

3. [Issue #101148](https://github.com/ClickHouse/ClickHouse/issues/101148) — **`NOT_FOUND_COLUMN_IN_BLOCK` from VIEW over table with PROJECTION**
   - Category: query planner / projections / views
   - Severity: **High**
   - Impact: user-visible query failure in stable LTS (`26.3.2.3-lts`)
   - Fix PR: none listed yet

4. [PR #101147](https://github.com/ClickHouse/ClickHouse/pull/101147) — **Fix SIGABRT with `aggregate_functions_null_for_empty` and Null combinator**
   - Category: aggregate execution crash
   - Severity: **High**
   - Impact: runtime crash under specific aggregate settings
   - Fix exists: **yes**, open PR

### Correctness regressions
5. [Issue #101096](https://github.com/ClickHouse/ClickHouse/issues/101096) — **`toStartOfInterval` wrong result near `INT64_MIN`**
   - Severity: **High**
   - Type: wrong result / incomplete prior fix
   - Notes: especially concerning because it indicates a previous overflow fix may still be incomplete

6. [Issue #101082](https://github.com/ClickHouse/ClickHouse/issues/101082) — **`allow_statistics=0` no longer blocks `ALTER TABLE ADD/DROP STATISTICS`**
   - Severity: **Medium-high**
   - Type: settings enforcement regression
   - Notes: governance/operational controls bypassed after refactor

7. [Issue #101131](https://github.com/ClickHouse/ClickHouse/issues/101131) — **`date_time_overflow_behavior` silently ignored for `DateTime64`/`Time64` casts**
   - Severity: **Medium-high**
   - Type: semantic correctness / setting ignored
   - Notes: dangerous because behavior looks configurable but is not

8. [Issue #101132](https://github.com/ClickHouse/ClickHouse/issues/101132) — **`Time64` values compare differently while displaying identically**
   - Severity: **Medium-high**
   - Type: type-system/canonicalization bug
   - Notes: especially confusing for users, breaks intuition and can poison downstream comparisons

### Compatibility / usability / enterprise correctness
9. [Issue #101116](https://github.com/ClickHouse/ClickHouse/issues/101116) — **Wrong error code for `SHOW MASKING POLICIES`**
   - Severity: **Medium**
   - Type: SQL compatibility / governance feature UX

10. [Issue #101107](https://github.com/ClickHouse/ClickHouse/issues/101107) — **`wrapWithSelectOrderBy` crash on multi-column SELECT**
   - Severity: **Medium**
   - Type: planner/rewrite crash

11. [Issue #101133](https://github.com/ClickHouse/ClickHouse/issues/101133) — **Valid NumPy `|S0` / `<U0` types rejected**
   - Severity: **Medium**
   - Type: file-format compatibility regression

12. [Issue #101136](https://github.com/ClickHouse/ClickHouse/issues/101136) — **Database-dependent ZK path hardcoded in test reference**
   - Severity: **Low**
   - Type: CI/test hygiene

13. [Issue #101103](https://github.com/ClickHouse/ClickHouse/issues/101103) — **Flaky replicated table attach test**
   - Severity: **Low-medium**
   - Type: test reliability

### Recently closed stability items
- [Issue #100842](https://github.com/ClickHouse/ClickHouse/issues/100842) — ASan buffer overflow in ULID decode, **closed**
- [Issue #100584](https://github.com/ClickHouse/ClickHouse/issues/100584) — AST fuzzer assertion failure, **closed**
- [Issue #100882](https://github.com/ClickHouse/ClickHouse/issues/100882) — backward-incompatible aggregate state serialization change, **closed**

Overall stability picture: many bugs are being found and fixed quickly, but current risk is concentrated in **edge-case correctness and internal invariants**, especially where recent refactors touched planner, aggregate serialization, temporal casts, and replication.

## 5. Feature Requests & Roadmap Signals

Several requests and open PRs provide good clues about likely near-term product direction.

### Strong roadmap signals
- [Issue #101072](https://github.com/ClickHouse/ClickHouse/issues/101072) — **Dictionary support for S3/GCS Parquet**
  - Strong fit with ClickHouse’s object-storage and external-data strategy
  - Likely candidate for a future release because it extends an existing subsystem rather than inventing a new one

- [Issue #81183](https://github.com/ClickHouse/ClickHouse/issues/81183) — **Rolling hash functions**
  - More speculative, but aligned with advanced ETL/dedup/content-defined chunking use cases

- [PR #95181](https://github.com/ClickHouse/ClickHouse/pull/95181) — **Wildcard support for `url` table function**
  - High practical value for ingestion workflows
  - Feels likely to land soon if testing is satisfactory

- [PR #99721](https://github.com/ClickHouse/ClickHouse/pull/99721) — **`output_format_float_precision`**
  - User-facing and low-risk; likely near-term merge candidate

- [PR #99127](https://github.com/ClickHouse/ClickHouse/pull/99127) — **Iceberg orphan file cleanup**
  - Strong enterprise/lakehouse value; likely to matter for the next release cycle

- [PR #100160](https://github.com/ClickHouse/ClickHouse/pull/100160) — **Paimon minmax index pushdown**
  - Another strong sign ClickHouse is deepening its role as a query engine over open table formats

- [PR #101114](https://github.com/ClickHouse/ClickHouse/pull/101114) — **`compress_per_column_in_compact_parts`**
  - Indicates continued incremental storage-engine tuning for MergeTree

### Most likely to appear in a next version
Based on maturity and scope, the most plausible near-term inclusions are:
1. [PR #99721](https://github.com/ClickHouse/ClickHouse/pull/99721) — float output precision control
2. [PR #95181](https://github.com/ClickHouse/ClickHouse/pull/95181) — URL wildcard ingestion
3. [PR #99127](https://github.com/ClickHouse/ClickHouse/pull/99127) — Iceberg orphan file removal
4. [PR #100160](https://github.com/ClickHouse/ClickHouse/pull/100160) — Paimon pushdown
5. [PR #101114](https://github.com/ClickHouse/ClickHouse/pull/101114) — compact-part compression tuning

## 6. User Feedback Summary

User feedback today highlights several recurring operational and product concerns:

- **Object storage cost/behavior matters a lot**  
  [Issue #100960](https://github.com/ClickHouse/ClickHouse/issues/100960) shows users are closely monitoring S3 request amplification, not just storage volume. This is a sign that ClickHouse’s cloud-native deployments are mature enough that request-count economics now matter.

- **Correctness in advanced indexing features is under scrutiny**  
  The closure of text-index bugs ([#100879](https://github.com/ClickHouse/ClickHouse/issues/100879), [#99502](https://github.com/ClickHouse/ClickHouse/issues/99502)) suggests users are actively testing full-text features and expect search predicates to be trustworthy.

- **Temporal types remain a friction point**  
  Multiple new issues around `DateTime64`/`Time64` overflow and comparison semantics ([#101131](https://github.com/ClickHouse/ClickHouse/issues/101131), [#101132](https://github.com/ClickHouse/ClickHouse/issues/101132), [#101096](https://github.com/ClickHouse/ClickHouse/issues/101096)) indicate temporal edge cases still create confusion and risk.

- **External data/lakehouse access is a strategic usage pattern**  
  Requests for Parquet-backed dictionaries on S3/GCS ([#101072](https://github.com/ClickHouse/ClickHouse/issues/101072)), URL wildcards ([#95181](https://github.com/ClickHouse/ClickHouse/pull/95181)), and Iceberg/Paimon work reinforce that many users increasingly treat ClickHouse as a high-performance analytical layer over diverse storage systems.

- **Enterprise/governance correctness is increasingly visible**  
  [Issue #101116](https://github.com/ClickHouse/ClickHouse/issues/101116) on masking policy error semantics suggests deeper adoption of security/governance features.

## 7. Backlog Watch

These older or strategically important items look like they deserve maintainer attention.

- [Issue #81183](https://github.com/ClickHouse/ClickHouse/issues/81183) — **Rolling hashes**
  - Open since 2025-06-02
  - Strategic feature request with clear analytical/data-engineering use cases

- [PR #95181](https://github.com/ClickHouse/ClickHouse/pull/95181) — **Wildcard for `url` table function**
  - Open since 2026-01-26
  - Practical ingestion feature that likely has broad user appeal

- [PR #99127](https://github.com/ClickHouse/ClickHouse/pull/99127) — **Iceberg `remove_orphan_files`**
  - Open since 2026-03-10
  - Important for long-term storage hygiene and enterprise lakehouse ops

- [PR #98861](https://github.com/ClickHouse/ClickHouse/pull/98861) — **UUID collision assertion fix**
  - Open since 2026-03-05
  - Should receive prompt attention because it fixes a server abort condition

- [Issue #99799](https://github.com/ClickHouse/ClickHouse/issues/99799) — **Double deletion crash**
  - Recently created but urgent due to severity and discussion volume

- [PR #100062](https://github.com/ClickHouse/ClickHouse/pull/100062) — **Release pull request for branch 26.3**
  - Worth watching as a release-process artifact indicating stabilization activity on the LTS line

## 8. Overall Health Assessment

ClickHouse looks **healthy but busy**: maintainers are closing bugs, pushing CI fixes quickly, and continuing to expand ecosystem support. The strongest technical momentum is around **lakehouse interoperability, storage pruning, and operational polish**, while the largest quality risk remains **subtle correctness regressions** introduced by sophisticated planner, type, and storage-engine changes. If the current bug-fix pace continues, the near-term outlook is positive—especially for users investing in object storage, Iceberg/Paimon, and advanced indexing—but users on fresh releases should still watch changelogs closely for fixes in temporal semantics, projections/views, and replication edge cases.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-30

## 1) Today's Overview

DuckDB showed **high development activity** over the last 24 hours, with **23 PRs updated** and **7 issues updated**, but **no new release** published. The day’s work was concentrated on **stability fixes, SQL correctness, extension/internal API exposure, and storage/index infrastructure**, rather than headline end-user features. A notable pattern is the rapid loop from bug report to proposed fix on several items, especially around **Arrow parsing** and **LEFT JOIN LATERAL correctness**, which is a good sign for project responsiveness. Overall, project health looks strong, though there are still several **wrong-result and crash-class issues** that merit close attention before the next release.

---

## 3) Project Progress

### Merged/closed PRs today

Only one PR in the provided update set is marked closed:

- [#16626 Add `-ui` to CLI help text](https://github.com/duckdb/duckdb/pull/16626)  
  A small but practical CLI polish change: it improves discoverability of the `-ui` flag in help text. This is not a core engine advance, but it does improve usability and lowers friction for users interacting with DuckDB via the command line.

### Broader progress visible in active PRs

Although not merged today, several active PRs indicate meaningful ongoing progress:

- **Query correctness / planner behavior**
  - [#21687 Preserve LEFT LATERAL filters during pushdown](https://github.com/duckdb/duckdb/pull/21687) — targets a likely wrong-result bug in lateral join/filter pushdown.
  - [#20706 Fix union type casting rules](https://github.com/duckdb/duckdb/pull/20706) — improves SQL type coercion semantics and compatibility.

- **Storage / I/O / caching**
  - [#21700 Make external file cache size tunable](https://github.com/duckdb/duckdb/pull/21700) — signals ongoing work on external/remote file access performance and operational tunability.

- **Indexing / extensibility**
  - [#21458 Buffer managed indexes (part 1?)](https://github.com/duckdb/duckdb/pull/21458)
  - [#20638 Refactor Index API](https://github.com/duckdb/duckdb/pull/20638)  
  These suggest substantial medium-term investment in index internals, custom indexes, materialization, and parallelism.

- **Extension-facing introspection APIs**
  - [#21695 Add read-only accessors to BloomFilter and BFTableFilter](https://github.com/duckdb/duckdb/pull/21695)
  - [#21696 Add read-only accessors to PerfectHashJoinExecutor and PerfectHashJoinFilter](https://github.com/duckdb/duckdb/pull/21696)
  - [#21697 Add read-only accessors to PrefixRangeFilter and PrefixRangeTableFilter](https://github.com/duckdb/duckdb/pull/21697)  
  These are strong signals that extension authors want deeper visibility into optimizer/runtime filter structures.

---

## 4) Community Hot Topics

### Most discussed updated issues

- [#21378 duckdb cli 1.5.x ".tables" probably with sqlite and "-table" output issues](https://github.com/duckdb/duckdb/issues/21378) — 8 comments  
  This is the most discussed issue in the current set. The underlying need appears to be **CLI reliability and SQLite-compatibility expectations**, especially for users treating DuckDB as a drop-in interactive shell.

- [#21352 Internal error when converting json to variant](https://github.com/duckdb/duckdb/issues/21352) — 6 comments  
  This points to demand around **new semi-structured data workflows**, especially JSON → Variant conversion. The internal error indicates the feature is being actively exercised by users beyond simple demos.

- [#21618 Attach string is not picked up when creating a second connection in a session](https://github.com/duckdb/duckdb/issues/21618) — 5 comments  
  This highlights a practical need for **predictable connection/session semantics**, likely important for embedded, Python, and multi-connection application scenarios.

- [#14152 Quoting struct members when shown in CLI to make copy/paste easier into where clause](https://github.com/duckdb/duckdb/issues/14152) — 3 comments  
  This is a long-lived UX/ergonomics request around **nested type usability in the CLI**.

### Most strategically interesting PRs

- [#21700 Make external file cache size tunable](https://github.com/duckdb/duckdb/pull/21700)  
  Reflects operational demand for controlling performance tradeoffs when reading remote/external data.

- [#20706 Fix union type casting rules](https://github.com/duckdb/duckdb/pull/20706)  
  Important for type-system maturity and user trust in advanced SQL types.

- [#21692 Fix stoi crash in Arrow format string parsing for w: and +w: types](https://github.com/duckdb/duckdb/pull/21692)  
  Important for interoperability with Arrow/GeoParquet ecosystems.

- [#20638 Refactor Index API](https://github.com/duckdb/duckdb/pull/20638) and [#21458 Buffer managed indexes (part 1?)](https://github.com/duckdb/duckdb/pull/21458)  
  These show continued investment in **index infrastructure**, extensibility, and potentially performance-oriented access paths.

---

## 5) Bugs & Stability

Ranked roughly by severity based on potential for crashes or wrong results:

### 1. Wrong-result query bug
- [#21609 DuckDB incorrectly preserves rows from LEFT JOIN LATERAL ... ON TRUE even when an outer WHERE l.col IS NOT NULL filter should remove them](https://github.com/duckdb/duckdb/issues/21609)  
  **Severity: Critical**  
  This appears to be a **query correctness** issue, which is usually more severe than a crash for analytical systems because it can silently produce invalid results.  
  **Fix PR exists:** [#21687 Preserve LEFT LATERAL filters during pushdown](https://github.com/duckdb/duckdb/pull/21687)

### 2. Crash in Arrow format parsing
- [#21691 Arrow format string parsing crashes with stoi on parameterized types](https://github.com/duckdb/duckdb/issues/21691)  
  **Severity: High**  
  A parser crash in Arrow C Data Interface handling affects interoperability, especially for parameterized extension metadata such as geometry/CRS encodings.  
  **Fix PR exists:** [#21692 Fix stoi crash in Arrow format string parsing for w: and +w: types](https://github.com/duckdb/duckdb/pull/21692)

### 3. Internal error in JSON → Variant conversion
- [#21352 Internal error when converting json to variant](https://github.com/duckdb/duckdb/issues/21352)  
  **Severity: High**  
  This is a direct engine internal error on a modern semi-structured data workflow, suggesting the Variant path still has edge cases.

### 4. Geometry NULL semantics incorrect
- [#21630 IS NULL on geometry does not work](https://github.com/duckdb/duckdb/issues/21630)  
  **Severity: High**  
  Incorrect `IS NULL` behavior can lead to wrong filtering results in geospatial workloads. No linked fix PR was provided in the dataset.

### 5. Session/connection attach-state bug
- [#21618 Attach string is not picked up when creating a second connection in a session](https://github.com/duckdb/duckdb/issues/21618)  
  **Severity: Medium-High**  
  This can cause confusing or unsafe behavior in embedded/multi-connection usage, especially when users expect isolation or explicit attach behavior.

### 6. CLI crash / formatting regressions
- [#21378 duckdb cli 1.5.x ".tables" probably with sqlite and "-table" output issues](https://github.com/duckdb/duckdb/issues/21378)  
  **Severity: Medium**  
  User-facing but mostly limited to CLI stability and rendering.

### 7. Division-by-zero edge case
- [#21698 Fix div by 0 when row_count is 0](https://github.com/duckdb/duckdb/pull/21698)  
  **Severity: Medium**  
  A targeted defensive fix for an optimizer/execution edge case when filter pushdown removes all input rows.

---

## 6) Feature Requests & Roadmap Signals

Several updated PRs and issues provide strong signals about where DuckDB may be heading next:

### Likely near-term improvements

- **External file / remote scan tunability**
  - [#21700 Make external file cache size tunable](https://github.com/duckdb/duckdb/pull/21700)  
  Likely candidate for a near-term release because it is incremental and operationally useful.

- **Prepared statement metadata / lineage**
  - [#20960 Add duckdb_prepared_column_origin_table C API function](https://github.com/duckdb/duckdb/pull/20960)  
  Suggests demand for richer metadata in embeddings, BI integrations, and drivers.

- **Catalog introspection quality**
  - [#20752 add extension_name to `duckdb_functions` and `duckdb_types`](https://github.com/duckdb/duckdb/pull/20752)  
  This is a practical observability feature and seems likely to land soon given its “Ready To Merge” state.

- **ATTACH/path flexibility**
  - [#21693 Add expression as DatabasePath argument to ATTACH](https://github.com/duckdb/duckdb/pull/21693)
  - [#21529 Fix CLI getenv on attach statement](https://github.com/duckdb/duckdb/pull/21529)  
  Together these indicate user demand for more flexible database path resolution and scripting ergonomics.

### Medium-term roadmap signals

- **Index subsystem modernization**
  - [#20638 Refactor Index API](https://github.com/duckdb/duckdb/pull/20638)
  - [#21458 Buffer managed indexes (part 1?)](https://github.com/duckdb/duckdb/pull/21458)  
  These look like foundational work rather than quick patches, and could feed into better custom indexes, ANN/vector search support, or more efficient index builds/execution.

- **Extension/runtime introspection**
  - [#21695](https://github.com/duckdb/duckdb/pull/21695), [#21696](https://github.com/duckdb/duckdb/pull/21696), [#21697](https://github.com/duckdb/duckdb/pull/21697)  
  These indicate a growing ecosystem need for extension-level access to internal filters and execution structures.

- **Type system maturity**
  - [#20706 Fix union type casting rules](https://github.com/duckdb/duckdb/pull/20706)  
  A likely building block for broader support of richer composite/variant/union workflows.

---

## 7) User Feedback Summary

Current user feedback clusters around a few clear pain points:

- **Reliability over edge cases matters**
  Users are actively reporting crashes and internal errors in areas like CLI behavior, Arrow schema parsing, and Variant conversion. This suggests DuckDB is being used in increasingly diverse workflows where edge-case robustness is essential.

- **Correctness remains top priority**
  The `LEFT JOIN LATERAL` wrong-result report and geometry `IS NULL` issue show that users are testing nontrivial SQL semantics and expect PostgreSQL-like correctness in advanced queries.

- **Semi-structured and geospatial workflows are growing**
  JSON → Variant conversion failures and geometry-related issues indicate more users are adopting DuckDB for modern analytical data types beyond plain tabular SQL.

- **Operational embedding use cases are important**
  The attach-string/session issue and metadata-oriented C API work point to DuckDB’s continued heavy use as an embedded engine inside applications, notebooks, and services.

- **CLI usability still matters**
  Even with DuckDB’s strong library usage, shell ergonomics remain visible in feedback: help text, `.tables`, nested-type display, and copy/paste-friendly formatting all continue to matter.

---

## 8) Backlog Watch

These older or long-running items appear deserving of maintainer attention:

- [#14152 Quoting struct members when shown in CLI to make copy/paste easier into where clause](https://github.com/duckdb/duckdb/issues/14152)  
  Open since 2024-09-27. Not a blocker, but a long-standing UX papercut for nested types in the CLI.

- [#20638 Refactor Index API](https://github.com/duckdb/duckdb/pull/20638)  
  Open since 2026-01-22 and currently marked with merge conflicts. Important infrastructure work can stall if not rebased and reviewed regularly.

- [#20706 Fix union type casting rules](https://github.com/duckdb/duckdb/pull/20706)  
  Open since 2026-01-27 and ready for review. Worth attention because type semantics affect broad SQL compatibility.

- [#20960 Add duckdb_prepared_column_origin_table C API function](https://github.com/duckdb/duckdb/pull/20960)  
  Open since 2026-02-14 and ready for review. Likely valuable for downstream integrations.

- [#21118 Detect throw noexcept using clang-tidy](https://github.com/duckdb/duckdb/pull/21118)  
  Marked stale. Tooling/quality improvements are easy to defer, but they can help reduce future reliability regressions.

- [#21458 Buffer managed indexes (part 1?)](https://github.com/duckdb/duckdb/pull/21458)  
  A substantial WIP with potentially high architectural impact. This likely needs active maintainer guidance to avoid long-lived drift.

---

## Overall Health Assessment

DuckDB appears **active and healthy**, with fast iteration on newly reported problems and continued investment in engine internals, extensibility, and interoperability. The main caution flag is that several updated issues are not merely cosmetic—they touch **crashes, NULL semantics, lateral join correctness, and new type-system paths**. If the currently linked fix PRs land cleanly, the next release could significantly improve robustness in advanced analytical and embedded use cases.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

## StarRocks Project Digest — 2026-03-30

### 1. Today's Overview
StarRocks showed moderate code activity over the last 24 hours, with **10 pull requests updated** and **1 issue updated**, but **no new releases**. The day’s visible work skewed toward **maintenance, bug fixing, planner correctness, build/toolchain compatibility, and documentation updates**, rather than headline feature delivery. Only **one PR was closed today**, indicating progress is steady but review/merge throughput appears somewhat constrained relative to the number of open changes. Overall, project health looks stable, with active engineering attention on **SQL/planner correctness, schema evolution, dependency upgrades, and developer/build reliability**.

### 2. Project Progress
#### Merged/closed PRs today
- **#70932 — [BugFix] fix clang build failure in template parameter**  
  Link: https://github.com/StarRocks/starrocks/pull/70932  
  This closed PR addresses a **C++ build/toolchain compatibility issue** caused by template parameter mismatches after an earlier aggregate-state refactor. While not a user-facing SQL feature, it is important infrastructure work: it reduces friction for contributors and CI environments using clang, and helps keep the BE codebase healthy after internal refactoring.

#### Notable open work advancing the project
- **#70929 — [BugFix] Fix stale project output columns after GLM split projection**  
  Link: https://github.com/StarRocks/starrocks/pull/70929  
  This appears to be the most technically significant query-engine fix in flight today. It targets a **planner correctness bug** where output columns could become stale after optimizer projection splitting, potentially causing planning failures in cost-based optimization paths.

- **#70747 — [4.1] [Enhancement] Support schema evaluation for widening varchar length with key/non-key column**  
  Link: https://github.com/StarRocks/starrocks/pull/70747  
  This is an important **schema evolution enhancement**. If merged, it would broaden support for widening `VARCHAR` lengths across key, sort key, distribution key, and partition key columns in both share-nothing and share-data modes, reducing operational friction for evolving schemas.

- **#70867 — [4.1] [BugFix] Upgrade cctz v2.3 -> v2.4 to fix CONVERT_TZ returning NULL**  
  Link: https://github.com/StarRocks/starrocks/pull/70867  
  This targets **SQL function correctness** for timezone conversion, a practical issue for analytics workloads handling regional time zones.

- **#70822 — [PROTO-REVIEW] [Tool] Bump thrift on BE from v0.20 to v0.22**  
  Link: https://github.com/StarRocks/starrocks/pull/70822  
  This suggests active modernization of core backend dependencies and may pave the way for cleaner serialization, compatibility, or internal RPC/runtime improvements.

### 3. Community Hot Topics
There was little evidence today of high-comment or high-reaction community debate; all listed items show **0 👍**, and comment counts were unavailable or minimal. The most meaningful topics are therefore inferred from technical significance and review labels rather than engagement volume.

- **Weekly documentation feedback issue — #70933**  
  Link: https://github.com/StarRocks/starrocks/issues/70933  
  This recurring issue aggregates reader feedback and flags docs PRs needing attention, including documentation around **tag-based access control and Ranger plugin integration**. The underlying need is clear: StarRocks users are actively working through **security, governance, and RBAC/TBAC setup**, and documentation quality remains essential for enterprise adoption.

- **Schema evolution enhancement — #70747**  
  Link: https://github.com/StarRocks/starrocks/pull/70747  
  The technical need behind this PR is strong: users want **less disruptive schema changes**, especially for string columns embedded in keys or distribution logic. This is a classic pain point in analytical databases where online schema changes can be constrained by storage engine design.

- **UDF loading from S3 — #64541**  
  Link: https://github.com/StarRocks/starrocks/pull/64541  
  This older but still-active PR points to demand for **cloud-native extensibility**. Users increasingly expect UDF artifacts to be loaded from object storage rather than only local or HTTP paths, aligning with modern lakehouse and cloud deployment patterns.

### 4. Bugs & Stability
Ranked by likely user impact based on available data:

#### High severity
1. **Planner correctness failure after GLM split projection — #70929**  
   Link: https://github.com/StarRocks/starrocks/pull/70929  
   This could lead to **query planning failures** in optimizer paths. Query correctness and planner stability issues are high priority because they directly affect workload reliability.  
   **Fix PR exists:** Yes.

2. **`CONVERT_TZ` returns NULL for specific Africa time zones — #70867**  
   Link: https://github.com/StarRocks/starrocks/pull/70867  
   This is a **SQL correctness bug** affecting timezone-sensitive analytics, particularly for `Africa/Casablanca` and `Africa/El_Aaiun`. It may not crash the system, but incorrect/null results can materially impact BI reporting and ETL logic.  
   **Fix PR exists:** Yes.

#### Medium severity
3. **UT compile failure when JIT is disabled — #70930**  
   Link: https://github.com/StarRocks/starrocks/pull/70930  
   This affects **test/build stability** rather than production query execution, but it can block CI variants and reduce confidence in non-default build configurations.  
   **Fix PR exists:** Yes.

4. **clang build failure due to template parameter mismatch — #70932**  
   Link: https://github.com/StarRocks/starrocks/pull/70932  
   This is a **developer ecosystem / portability** issue that has now been closed. It matters for contributor velocity and toolchain consistency.  
   **Fix PR exists:** Closed.

#### Lower severity / maintenance
5. **picomatch CVE-related doc dependency update — #70927**  
   Link: https://github.com/StarRocks/starrocks/pull/70927  
   This appears to be a **documentation stack dependency maintenance update**. Important from a supply-chain hygiene perspective, though not directly related to query execution.

### 5. Feature Requests & Roadmap Signals
Several open PRs provide useful signals about where StarRocks may evolve next:

- **Online-friendly schema evolution for `VARCHAR` widening — #70747**  
  Link: https://github.com/StarRocks/starrocks/pull/70747  
  Strong signal that **schema evolution flexibility** is a priority for the 4.1 line. This is likely to land because it addresses a practical operational need and is framed as an enhancement rather than an experimental feature.

- **UDF loading from S3 — #64541**  
  Link: https://github.com/StarRocks/starrocks/pull/64541  
  This suggests a roadmap push toward **cloud-native UDF management**. If accepted, it would improve parity with object-storage-centric deployments and reduce dependence on bespoke distribution mechanisms.

- **Thrift raw deserializer refactor — #70931**  
  Link: https://github.com/StarRocks/starrocks/pull/70931  
  Link: https://github.com/StarRocks/starrocks/pull/70822  
  Together with the thrift version bump, this indicates backend work around **serialization/deserialization infrastructure**. While not user-visible immediately, it could enable future performance, maintainability, or compatibility improvements.

- **Security/governance documentation around Ranger and tag-based access control — referenced from #70933 and PR #70883**  
  Issue link: https://github.com/StarRocks/starrocks/issues/70933  
  This is a soft roadmap signal that **enterprise governance integrations** remain important in the StarRocks ecosystem.

**Most likely near-term candidate for the next version:**  
The `VARCHAR` widening enhancement in **#70747** looks like the clearest user-facing candidate for a near-term release branch inclusion, especially given the explicit **[4.1]** tag.

### 6. User Feedback Summary
Direct user feedback was limited today, but the available signals point to several concrete pain points:

- **Documentation clarity remains a recurring need**, especially around access control, governance, and admin console permissions.  
  - Issue: **#70933** — https://github.com/StarRocks/starrocks/issues/70933  
  - Doc PR: **#70903** — https://github.com/StarRocks/starrocks/pull/70903

- **Users want smoother enterprise operations**, including:
  - more permissive **schema evolution** without disruptive rebuilds: **#70747**
  - better **cloud-native UDF deployment**: **#64541**
  - correct handling of **timezone edge cases** in SQL functions: **#70867**

- **Security and governance usability** is a visible theme:
  - Web console role documentation: **#70903**
  - Ranger/tag-based access control docs referenced via **#70933**

In short, today’s feedback and open work suggest users are less focused on raw benchmark gains and more focused on **operability, compatibility, and correctness in real production environments**.

### 7. Backlog Watch
These items appear to need maintainer attention due to age, review state, or strategic importance:

- **#64541 — [Feature] Support loading UDF on S3**  
  Link: https://github.com/StarRocks/starrocks/pull/64541  
  Created in **2025-10-24**, this is the standout backlog item. It has been open for months and carries **META-REVIEW / PROTO-REVIEW** labels, implying nontrivial design or review complexity. Given the importance of cloud-native extensibility, this deserves renewed maintainer focus.

- **#70822 — [PROTO-REVIEW] [Tool] Bump thrift on BE from v0.20 to v0.22**  
  Link: https://github.com/StarRocks/starrocks/pull/70822  
  Dependency upgrades in core backend infrastructure can stall due to risk, but prolonged delay here may block follow-on cleanup and refactoring like **#70931**.

- **#70747 — [4.1] schema evaluation for widening varchar length**  
  Link: https://github.com/StarRocks/starrocks/pull/70747  
  This is a high-value enhancement with obvious user benefit. If 4.1 planning is active, timely review is important so the feature does not miss the branch window.

- **Docs queue highlighted by #70933**  
  Link: https://github.com/StarRocks/starrocks/issues/70933  
  The automated docs feedback issue indicates a steady stream of documentation work needing maintainer review. While not glamorous, lag here can directly affect user onboarding and feature adoption.

### Project Health Assessment
StarRocks appears **healthy but review-heavy** today: engineering activity is present, but actual closure volume is light. The strongest signals are around **planner correctness, SQL function correctness, schema evolution, build reliability, and cloud/enterprise operability**. No new release was cut, and there is no sign of urgent incident-level instability, but several in-flight bug fixes address issues that matter directly to production query behavior.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-30

## 1. Today's Overview

Apache Iceberg showed **moderate repository activity** over the last 24 hours: **3 issues updated**, **19 pull requests updated**, and **no new releases**. Most movement was in the PR queue rather than issue intake, which suggests the project is currently more focused on **incremental fixes, connector behavior, AWS integration hardening, documentation, and build/CI cleanup** than on shipping a release. Query-engine and connector work is spread across **Spark, Kafka Connect, Flink, and AWS-backed deployments**, which continues to reflect Iceberg’s role as a cross-engine table format with a broad operational surface area. Overall project health looks **active but review-constrained**, with several stale PRs still circulating and only a small number of closures today.

## 2. Project Progress

### Merged/closed PRs today

Although no release was cut, a few PRs were closed today, giving some signal on where maintainers are spending attention.

- [#15525](https://github.com/apache/iceberg/pull/15525) — **API, Core: Add overwrite-aware table registration** — **Closed**  
  This work aimed to expose overwrite-aware table registration through the catalog API and REST catalog implementation. Strategically, this is relevant for **catalog correctness and SQL/catalog interoperability**, especially where external table registration workflows need explicit overwrite semantics. Even though it was closed rather than merged, the topic signals continued demand for richer catalog lifecycle operations.

- [#15388](https://github.com/apache/iceberg/pull/15388) — **Data: Support listing files from hive partitions with subdirectories** — **Closed**  
  This PR addressed a real migration/correctness edge case for Hive-origin tables where partition locations contain subdirectories. The underlying need is important: without support, migration utilities can silently miss data files. Closure without merge means the **data onboarding / migration correctness gap** likely still needs follow-up.

- [#15092](https://github.com/apache/iceberg/pull/15092) — **[WIP] Replace transactions rebase onto refreshed metadata** — **Closed**  
  This proposal targeted a significant **transaction correctness** issue around stale metadata during concurrent replace transactions. Even as a closed WIP, it highlights that **concurrent metadata update semantics** remain an area of architectural scrutiny.

### What advanced today

From the broader PR set, the most visible active areas are:

- **AWS runtime robustness**
  - [#15792](https://github.com/apache/iceberg/pull/15792) — handling premature connection close during vectorized Parquet reads from S3
  - [#15818](https://github.com/apache/iceberg/pull/15818) — closing custom `AwsCredentialsProvider` in REST SigV4 sessions
  - [#15242](https://github.com/apache/iceberg/pull/15242) — S3 chunked encoding configurability
  - [#15460](https://github.com/apache/iceberg/pull/15460) — applying `client.region` to STS clients

  These PRs point to ongoing investment in **cloud storage resiliency, auth/session lifecycle correctness, and deploy-time configurability**.

- **Connector correctness**
  - [#15639](https://github.com/apache/iceberg/pull/15639) — Kafka Connect multi-topic routing fix to prevent records being written to all tables
  - [#15651](https://github.com/apache/iceberg/pull/15651) — Kafka Connect stale `DataWritten` recovery separation per commit ID

  This is a meaningful theme: Iceberg’s Kafka Connect sink remains an active source of correctness fixes around **routing and commit recovery semantics**.

- **Spark usability / streaming**
  - [#15472](https://github.com/apache/iceberg/pull/15472) — Spark streaming starting offset read option
  - [#15310](https://github.com/apache/iceberg/pull/15310) — Spark manifest rewrite improvements for range partitions

  These indicate interest in making **streaming ingest and maintenance operations more controllable** in Spark deployments.

- **Core/storage performance**
  - [#15791](https://github.com/apache/iceberg/pull/15791) — optimizing `RoaringPositionBitmap.setRange` with native range APIs

  This is a classic Iceberg-style low-level improvement: likely modest in surface area but potentially useful for **deletion vector / positional bitmap efficiency**.

## 3. Community Hot Topics

### 1) Kafka Connect metadata commit failure after Kafka cluster recreation
- Issue: [#15293](https://github.com/apache/iceberg/issues/15293)
- Status: Open
- Signals: 2 comments, 1 👍

This is the most operationally serious user-reported issue in today’s issue list. The report says that after a **full Kafka cluster reinitialization**, data files are still written successfully, but **Iceberg metadata is no longer committed**. That combination is especially dangerous because it suggests potential **orphaned data files and broken sink recovery semantics** rather than an obvious hard failure. The technical need underneath is stronger resilience in **Kafka Connect state recovery, transactional fencing, and commit coordination** when cluster identity or internal offsets change.

Related active PRs in the same domain:
- [#15639](https://github.com/apache/iceberg/pull/15639)
- [#15651](https://github.com/apache/iceberg/pull/15651)

These are not direct fixes for #15293, but they show maintainers and contributors are actively working on **Kafka Connect correctness problems**.

### 2) Spark view creation appears as tables in Hive catalogs
- Issue: [#15779](https://github.com/apache/iceberg/issues/15779)
- Status: Open
- Signals: 2 comments

This bug affects **SQL object semantics and discoverability**: Iceberg views created through Spark with Hive-type catalogs show up as tables instead of views. The underlying need is better consistency between **Spark SQL DDL behavior, Iceberg’s view abstraction, and Hive catalog metadata representation**. For users running mixed SQL tooling, this kind of mismatch can cause confusion, broken governance assumptions, or compatibility problems in downstream discovery tools.

### 3) Hive catalog schema evolution docs gap
- PR: [#15814](https://github.com/apache/iceberg/pull/15814)
- Status: Open

This doc PR adds warnings around schema evolution operations that change column positions under a Hive catalog. The need here is not just documentation polish; it reflects a recurring ecosystem reality that **Hive Metastore compatibility constraints still shape what “safe schema evolution” means in practice**. Users want clearer operational guardrails when mixing Iceberg semantics with legacy metastore behavior.

### 4) Spark streaming start-position control
- PR: [#15472](https://github.com/apache/iceberg/pull/15472)
- Status: Open, stale

This remains a strong roadmap signal. Users want explicit control over **where a Spark streaming read begins when no checkpoint exists**, a common operational ask for replay, bootstrap, and disaster recovery scenarios.

## 4. Bugs & Stability

Ranked by likely operational severity based on the provided data.

### High severity

1. **Kafka Connect writes data files but fails to commit metadata after Kafka cluster recreation**
   - Issue: [#15293](https://github.com/apache/iceberg/issues/15293)
   - Why severe: Can create a mismatch between physical files and committed table state, risking **data invisibility, duplicate recovery attempts, or orphaned files**
   - Fix status: No direct fix PR linked in the issue data
   - Potentially related work:
     - [#15651](https://github.com/apache/iceberg/pull/15651)
     - [#15639](https://github.com/apache/iceberg/pull/15639)

2. **Premature S3 connection close during vectorized Parquet reads**
   - PR: [#15792](https://github.com/apache/iceberg/pull/15792)
   - Why severe: Affects **large-batch Spark reads over S3**, potentially causing read instability under long processing pauses between network reads
   - Impact area: Cloud object storage reliability, query execution robustness
   - Fix status: Open

### Medium severity

3. **Spark Iceberg views created as tables in Hive catalogs**
   - Issue: [#15779](https://github.com/apache/iceberg/issues/15779)
   - Why important: Causes **metadata correctness / SQL semantic mismatch**
   - Impact area: Spark + Hive catalog interoperability
   - Fix status: No corresponding fix PR listed in today’s data

4. **Kafka Connect multi-topic routing may write all records to all tables**
   - PR: [#15639](https://github.com/apache/iceberg/pull/15639)
   - Why important: This is a **serious correctness issue** for connector deployments with multiple topics and overlapping schemas
   - Fix status: Open

5. **Stale `DataWritten` events may contaminate later commits**
   - PR: [#15651](https://github.com/apache/iceberg/pull/15651)
   - Why important: Risks **cross-commit contamination** after failed or timed-out commits in Kafka Connect
   - Fix status: Open

### Low to medium severity

6. **Hive catalog schema evolution incompatibility around column reordering / dropping**
   - PR: [#15814](https://github.com/apache/iceberg/pull/15814)
   - Why important: More of an **operational footgun / documentation gap** than a new engine bug, but significant for production schema management

7. **REST SigV4 session may leak credential providers**
   - PR: [#15818](https://github.com/apache/iceberg/pull/15818)
   - Why important: Resource lifecycle issue; can matter in long-running services

## 5. Feature Requests & Roadmap Signals

Several active PRs hint at likely near-term product direction.

### Strong signals

- **Better Spark streaming controls**
  - [#15472](https://github.com/apache/iceberg/pull/15472) — explicit streaming starting offset
  - Why it matters: Users need deterministic replay/bootstrap behavior for incremental processing
  - Prediction: This kind of operational control is a good candidate for a **future minor release**, especially if paired with adjacent stream-end controls

- **More production-grade AWS configurability**
  - [#15242](https://github.com/apache/iceberg/pull/15242) — chunked encoding config
  - [#15304](https://github.com/apache/iceberg/pull/15304) — metrics publisher configuration
  - [#15460](https://github.com/apache/iceberg/pull/15460) — STS client region handling
  - Prediction: Expect continued **AWS client factory expansion** in upcoming versions, especially around auth, observability, and request behavior tuning

- **Cleaner connector semantics for Kafka Connect**
  - [#15639](https://github.com/apache/iceberg/pull/15639)
  - [#15651](https://github.com/apache/iceberg/pull/15651)
  - Prediction: Kafka Connect is likely to receive more **correctness-focused improvements** before major new features

- **Flink test/build modernization**
  - [#15815](https://github.com/apache/iceberg/pull/15815)
  - Prediction: Not a user-facing feature, but a sign of ongoing **dependency modernization** and cleaner CI/test baselines for engine modules

### Weaker but relevant signals

- **Catalog API evolution**
  - [#15525](https://github.com/apache/iceberg/pull/15525) — overwrite-aware table registration
  - Even though closed, it points to user demand for richer table registration workflows in REST/catalog APIs.

## 6. User Feedback Summary

The most visible user pain points today are practical and operational rather than theoretical:

- **Kafka Connect recovery and correctness are a real concern.**  
  Users are hitting scenarios where connector state, commit recovery, or routing behavior can produce incorrect outcomes:
  - [#15293](https://github.com/apache/iceberg/issues/15293)
  - [#15639](https://github.com/apache/iceberg/pull/15639)
  - [#15651](https://github.com/apache/iceberg/pull/15651)

  This suggests that organizations using Iceberg as a sink target for streaming data care deeply about **exactly-once-ish semantics, replay safety, and predictable table routing**.

- **Cross-system compatibility remains a top adoption friction point.**  
  Spark/Hive view behavior and Hive schema evolution restrictions show that users continue to struggle at the boundaries between Iceberg’s logical model and older metastores/catalogs:
  - [#15779](https://github.com/apache/iceberg/issues/15779)
  - [#15814](https://github.com/apache/iceberg/pull/15814)

- **Cloud object storage reliability matters at query runtime.**  
  The S3 premature-close fix proposal indicates real workloads are sensitive to how Iceberg readers behave under long vectorized processing intervals:
  - [#15792](https://github.com/apache/iceberg/pull/15792)

- **There is still demand for operational knobs, not just raw performance.**  
  Streaming start offsets and AWS client configuration PRs show users want **control, observability, and safer defaults** as much as new features.

## 7. Backlog Watch

These items look like they deserve extra maintainer attention due to age, importance, or being marked stale.

- [#15472](https://github.com/apache/iceberg/pull/15472) — **Spark: Add streaming-starting-offset read option**  
  Open since 2026-02-27 and marked stale. This looks useful and broadly applicable for Spark streaming users.

- [#15460](https://github.com/apache/iceberg/pull/15460) — **AWS: apply client.region to StsClient in AssumeRoleAwsClientFactory**  
  Open since 2026-02-27 and stale. Important for region-aware auth behavior in multi-region or role-assumption deployments.

- [#15422](https://github.com/apache/iceberg/pull/15422) — **Checkstyle/Spotless formatting enforcement**  
  Large cross-cutting build/style PRs can become difficult to review and may block unrelated cleanup. Worth deciding whether to split, merge, or close decisively.

- [#15310](https://github.com/apache/iceberg/pull/15310) — **Spark manifest rewrite improvement for range partition paths**  
  Potentially useful maintenance/query-planning support, but stale PR status suggests limited review bandwidth.

- [#14222](https://github.com/apache/iceberg/issues/14222) — **docs: move pages away from the versioned docs**  
  Open since 2025-09-30 and marked stale. Not urgent for engine correctness, but documentation architecture issues can quietly degrade onboarding and discoverability.

- [#15293](https://github.com/apache/iceberg/issues/15293) — **Kafka cluster recreation breaks metadata commits**  
  Newer than others, but deserves priority because of the risk profile. Even without many comments yet, this is the kind of issue that can hurt production confidence.

## 8. Project Health Assessment

Iceberg appears **technically active and ecosystem-focused**, with meaningful work underway across connectors, cloud integrations, and engine interoperability. The main concern from today’s snapshot is not lack of development, but **review throughput and backlog aging**, especially for stale PRs carrying valid operational value. The absence of a release is not itself worrying, but several open items suggest the next version could benefit from emphasizing **stability in Kafka Connect, AWS/S3 runtime behavior, and Spark/Hive compatibility**.

If you'd like, I can also convert this into a **short executive summary**, **release-manager style changelog**, or **engine-specific digest** split by Spark / Flink / Kafka Connect / AWS.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-30

## 1. Today's Overview
Delta Lake showed light but meaningful activity over the last 24 hours: 2 issues and 5 pull requests were updated, with no merges, closures, or releases. The current signal is less about completed delivery and more about active work-in-progress in three areas: commit-path correctness, Spark V2 connector behavior, and ongoing Flink connector expansion. Overall project health appears stable, but some updates point to correctness-sensitive edge cases in transaction handling and schema evolution that deserve close maintainer attention. The absence of merged PRs today suggests progress is accumulating in review rather than landing in mainline.

## 3. Project Progress
No pull requests were merged or closed in the last 24 hours, so there is no completed delivery to report today.

Still, the active PR set gives a good view of where engineering effort is concentrated:

- **Commit protocol correctness / storage reliability**
  - [PR #6353](https://github.com/delta-io/delta/pull/6353) — *Fix race condition in commitFilesIterator causing silent data loss with coordinated commits*  
    This is the most consequential in-flight change. It targets a race between filesystem listing and coordinator-based commit discovery, with the reported failure mode being **silent data loss** under coordinated commit scenarios.

- **Spark V2 / kernel-based query pushdown**
  - [PR #6332](https://github.com/delta-io/delta/pull/6332) — *[kernel-spark] Implement SupportsPushDownLimit in Delta V2 connector*  
    This advances SQL/query-engine integration by letting Spark push `LIMIT` into Delta scans, potentially reducing file reads and improving query efficiency for selective top-N style reads.

- **Flink connector roadmap**
  - [PR #6192](https://github.com/delta-io/delta/pull/6192) — *[Flink] Sink SQL API support*  
  - [PR #6191](https://github.com/delta-io/delta/pull/6191) — *[Flink] Sink DataStream API implementation*  
  - [PR #6431](https://github.com/delta-io/delta/pull/6431) — *[Flink] Readme & Docker Compose*  
    Together these indicate sustained investment in Flink usability and write-path support, spanning both SQL and DataStream APIs plus onboarding/documentation.

## 4. Community Hot Topics
The most active items by visible discussion are the two updated issues, each with 1 comment, and the highest-impact open PRs.

- [Issue #6027](https://github.com/delta-io/delta/issues/6027) — **[BUG] Kernel doesn't follow spec: writeStatsAsStruct**  
  This is a protocol-compliance topic rather than a cosmetic bug. The issue argues Delta Kernel does not satisfy writer-version 3+ requirements around `writeStatsAsStruct`, which points to a deeper need: **strict interoperability across engines implementing Delta protocol semantics**. As Delta expands beyond Spark, protocol fidelity becomes more important than engine-local behavior.

- [Issue #6232](https://github.com/delta-io/delta/issues/6232) — **[BUG] V2 connector cannot adopt schema change without refreshing the dataframe**  
  This reflects a practical Spark integration pain point: users expect schema evolution to be visible without manual dataframe refreshes. The underlying technical need is better handling of **metadata invalidation, schema refresh, and connector state coherence** in the Spark V2 path.

- [PR #6353](https://github.com/delta-io/delta/pull/6353) — **Race condition in coordinated commits**
  Even without comment volume, this is likely the most operationally significant thread because it concerns a commit discovery race with a potential correctness impact. It highlights demand for stronger guarantees in distributed commit coordination.

- [PR #6332](https://github.com/delta-io/delta/pull/6332) — **Limit pushdown for Delta V2**
  This signals continued work on making the kernel-based V2 connector more competitive as a query engine interface, especially for read efficiency and Spark planner compatibility.

- [PR #6192](https://github.com/delta-io/delta/pull/6192) and [PR #6191](https://github.com/delta-io/delta/pull/6191) — **Flink sink support**
  These indicate community and maintainer interest in making Delta a more complete sink target for Flink workloads, spanning declarative SQL and streaming APIs.

## 5. Bugs & Stability
Ranked by likely severity based on the supplied summaries:

1. **Potential silent data loss in coordinated commits**
   - [PR #6353](https://github.com/delta-io/delta/pull/6353) — *Fix race condition in commitFilesIterator causing silent data loss with coordinated commits*  
   - Severity: **Critical**  
   - Why it matters: The described race can cause commit files to be missed if unbackfilled commits become backfilled between two discovery phases. Silent data loss is among the highest-severity failure classes for analytical storage engines because it undermines table correctness without obvious operator visibility.  
   - Fix status: **Open PR exists**, but not merged.

2. **Kernel protocol non-compliance with `writeStatsAsStruct`**
   - [Issue #6027](https://github.com/delta-io/delta/issues/6027)  
   - Severity: **High**  
   - Why it matters: Protocol deviations can break interoperability, validation, or downstream readers/writers that assume writer-version guarantees. In a multi-engine ecosystem, spec compliance is foundational.  
   - Fix status: **No linked fix PR in provided data**.

3. **Spark V2 connector schema evolution not visible without dataframe refresh**
   - [Issue #6232](https://github.com/delta-io/delta/issues/6232)  
   - Severity: **Medium–High**  
   - Why it matters: This is a correctness/usability issue affecting schema change adoption. It may not corrupt data, but it can cause stale reads, confusing behavior, or pipeline failures after schema evolution.  
   - Fix status: **No linked fix PR in provided data**.

No crashes or release regressions were reported in the provided 24-hour dataset, but the current updates skew toward **correctness and metadata consistency** rather than pure performance.

## 6. Feature Requests & Roadmap Signals
Several roadmap signals are visible from the open PR queue:

- **More complete Spark V2 connector support**
  - [PR #6332](https://github.com/delta-io/delta/pull/6332)  
  `SupportsPushDownLimit` is a small but important piece of SQL/planner compatibility. This suggests Delta is continuing to harden the kernel-backed V2 connector so it behaves more like a first-class Spark data source.  
  **Prediction:** Additional pushdowns, planner integrations, and metadata/schema handling improvements are plausible candidates for the next version.

- **Broader Flink write support**
  - [PR #6192](https://github.com/delta-io/delta/pull/6192)  
  - [PR #6191](https://github.com/delta-io/delta/pull/6191)  
  - [PR #6431](https://github.com/delta-io/delta/pull/6431)  
  The combination of SQL API support, DataStream sink implementation, and setup/docs strongly suggests Flink is an active expansion area.  
  **Prediction:** Near-term releases are likely to emphasize Flink sink usability, integration completeness, and developer onboarding.

- **Protocol fidelity in Kernel**
  - [Issue #6027](https://github.com/delta-io/delta/issues/6027)  
  As Delta Kernel adoption grows, users increasingly expect exact protocol adherence.  
  **Prediction:** Protocol/spec-alignment work in Kernel is likely to remain a priority, especially where writer-version requirements affect interoperability.

## 7. User Feedback Summary
The latest user-visible pain points are consistent and practical:

- **Users care about correctness first.**  
  The coordinated commit race in [PR #6353](https://github.com/delta-io/delta/pull/6353) shows sensitivity to transaction-path edge cases, especially in distributed or coordinated commit environments.

- **Schema evolution UX is still a friction point.**  
  [Issue #6232](https://github.com/delta-io/delta/issues/6232) reflects the expectation that Delta tables should adapt smoothly to schema changes in Spark without requiring manual refresh steps.

- **Cross-engine interoperability matters more as Delta broadens beyond Spark.**  
  [Issue #6027](https://github.com/delta-io/delta/issues/6027) indicates users are validating Kernel against protocol guarantees, not just testing whether it “works” in isolation.

- **There is demand for richer non-Spark integrations.**  
  The Flink PR cluster—[PR #6191](https://github.com/delta-io/delta/pull/6191), [PR #6192](https://github.com/delta-io/delta/pull/6192), and [PR #6431](https://github.com/delta-io/delta/pull/6431)—suggests users want Delta to be easier to use in streaming and mixed-engine environments.

## 8. Backlog Watch
These items look like they need maintainer attention due to age, impact, or strategic importance:

- [Issue #6027](https://github.com/delta-io/delta/issues/6027) — opened **2026-02-09**  
  A kernel protocol-compliance bug lingering since early February is notable because spec mismatches can become ecosystem-wide compatibility problems if left unresolved.

- [PR #6191](https://github.com/delta-io/delta/pull/6191) — opened **2026-03-04**  
  Long-running Flink sink work may need review bandwidth to avoid stalling a visible connector roadmap item.

- [PR #6192](https://github.com/delta-io/delta/pull/6192) — opened **2026-03-04**  
  Similar to #6191, this appears strategically important for Flink SQL adoption and would benefit from timely maintainer guidance.

- [Issue #6232](https://github.com/delta-io/delta/issues/6232) — opened **2026-03-10**  
  The Spark V2 schema refresh issue touches user-facing compatibility and should not sit too long if V2 adoption is a goal.

- [PR #6353](https://github.com/delta-io/delta/pull/6353) — opened **2026-03-23**  
  Not the oldest item, but likely the most urgent due to the silent-data-loss framing. This should be prioritized ahead of lower-risk enhancements.

## Overall Health Signal
Delta Lake appears **active but review-heavy today**, with no releases or merged changes, yet clear momentum in connector evolution and transactional correctness work. The strongest risks are in **commit-path reliability** and **cross-engine consistency**, while the strongest growth signal is **expanded Flink and Spark V2 support**. Short-term maintainer focus should likely go to correctness-critical items first, especially [PR #6353](https://github.com/delta-io/delta/pull/6353), followed by protocol compliance and schema-evolution behavior.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-30

## 1. Today's Overview

Databend showed light-to-moderate GitHub activity over the last 24 hours, with 8 pull requests updated, 1 issue updated, and 1 new nightly release published. The dominant theme was SQL correctness and planner stability, especially around literal parsing and overflow-safe statistics derivation in the query planner. Most visible work was concentrated in bugfix PRs from a single contributor, suggesting focused cleanup rather than broad multi-area development today. Overall project health looks stable: release cadence continues, fixes are landing, and no high-volume user-facing incident emerged in the issue tracker.

## 2. Releases

### New release: [v1.2.891-nightly](https://github.com/databendlabs/databend/releases)
A new nightly build was published: **v1.2.891-nightly**.

#### Notable changes called out in release notes
- **Stage/file-format feature:** `feat(stage): add TEXT file format params` via [#19588](https://github.com/databendlabs/databend/pull/19588)
- **HTTP-related feature:** release notes show a partial entry beginning with `feat(http): add se...`, but the provided data is truncated, so the exact scope cannot be confirmed from today’s snapshot.

#### Likely impact
- The **TEXT file format parameter support** is a practical ingestion/export enhancement for analytical workloads using staging areas. This points to continued investment in external data loading ergonomics, especially for semi-structured or raw text pipelines.

#### Breaking changes / migration notes
- No breaking changes or migration requirements are visible in the provided release data.
- Because this is a **nightly** release, users should expect forward-moving feature work and bugfix validation rather than stability guarantees typical of a stable channel.

## 3. Project Progress

### Merged/closed PRs today

#### 1) SQL literal compatibility fix advanced
- [#19608](https://github.com/databendlabs/databend/pull/19608) — **CLOSED** — `fix(sql): treat X'...' as binary literal`

This work improves SQL compatibility by parsing standard SQL `X'...'` literals as **binary literals** rather than sending them through an unsigned integer hex path. That is an important correctness fix for engines aiming to behave consistently with SQL-standard semantics while preserving MySQL-style `0x...` numeric handling separately. Even though this PR is closed, two follow-up/open variants appeared immediately after, suggesting the team is refining implementation details before final merge:
- [#19635](https://github.com/databendlabs/databend/pull/19635)
- [#19636](https://github.com/databendlabs/databend/pull/19636)

#### 2) Query planner overflow fix progressed
- [#19591](https://github.com/databendlabs/databend/pull/19591) — **CLOSED** — `fix: avoid overflow in Scan::derive_stats for full-range UInt64 stats`

This addresses a planner/statistics correctness bug in `Scan::derive_stats`, specifically when computing NDV-related reductions over the full `UInt64` range `[0, u64::MAX]`. This is a meaningful engine-quality improvement because statistics derivation feeds optimization decisions; overflow here can cause panic, wrong estimates, or unstable planning behavior. The work also appears to have evolved into active follow-up PRs:
- [#19631](https://github.com/databendlabs/databend/pull/19631)
- [#19632](https://github.com/databendlabs/databend/pull/19632)

### Other in-flight progress
- [#19615](https://github.com/databendlabs/databend/pull/19615) — `support IF NOT EXISTS for ALTER TABLE ADD COLUMN`  
  Advances DDL ergonomics and idempotent schema evolution.
- [#19616](https://github.com/databendlabs/databend/pull/19616) — `align full outer USING nullability`  
  Improves schema correctness for `FULL OUTER JOIN`, especially where visible join keys must reflect nullable semantics.

## 4. Community Hot Topics

Activity volume was low, and the provided data shows **no comments and no reactions** on the listed issue/PRs, so “hot topics” are inferred from concentration of engineering effort rather than community discussion.

### Repeated work around SQL binary literal parsing
- [#19636](https://github.com/databendlabs/databend/pull/19636)
- [#19635](https://github.com/databendlabs/databend/pull/19635)
- [#19608](https://github.com/databendlabs/databend/pull/19608)

**Technical need:** Databend is tightening SQL dialect correctness, especially where syntax overlaps with MySQL-style and SQL-standard literal forms. This matters for migration compatibility, parser predictability, and avoiding incorrect execution semantics in binary/string processing workloads.

### Repeated work around planner statistics overflow
- [#19632](https://github.com/databendlabs/databend/pull/19632)
- [#19631](https://github.com/databendlabs/databend/pull/19631)
- [#19591](https://github.com/databendlabs/databend/pull/19591)

**Technical need:** The query planner must handle full-range integer statistics safely. Overflow-safe NDV/span calculations are foundational for robust optimization in OLAP engines, especially on large fact tables with unsigned IDs or high-cardinality dimensions.

### Documentation/link quality signal
- [Issue #19634](https://github.com/databendlabs/databend/issues/19634) — `Link Checker Report`

**Technical need:** While not a runtime bug, broken links in SQL/docs/readme content degrade onboarding and developer efficiency. In analytical database projects, docs quality often strongly affects adoption, especially for features like staging, file formats, and SQL semantics.

## 5. Bugs & Stability

Ranked by likely severity based on engine impact:

### High severity
#### 1) Planner overflow / potential panic on full-range UInt64 stats
- [#19632](https://github.com/databendlabs/databend/pull/19632) — open
- [#19631](https://github.com/databendlabs/databend/pull/19631) — open
- [#19591](https://github.com/databendlabs/databend/pull/19591) — closed
- Related issue reference in PRs: `#19555`

**Why it matters:** A planner overflow in statistics derivation can affect query optimization or even cause planning failures. In OLAP systems, incorrect stats handling can cascade into poor plans, instability, or crashes on large datasets.  
**Status:** Fixes exist and are actively being refined.

### Medium severity
#### 2) Incorrect parsing of SQL-standard `X'...'` binary literals
- [#19636](https://github.com/databendlabs/databend/pull/19636) — open
- [#19635](https://github.com/databendlabs/databend/pull/19635) — open
- [#19608](https://github.com/databendlabs/databend/pull/19608) — closed
- Fixes issue: `#19600` per PR summary

**Why it matters:** This is a query correctness and SQL compatibility issue. Users expecting standards-compliant binary literal handling may get incorrect typing or execution behavior if literals are treated as numeric hex values.  
**Status:** Multiple fix iterations suggest maintainers consider it important and are polishing the final implementation.

### Medium severity
#### 3) Full outer join schema nullability mismatch
- [#19616](https://github.com/databendlabs/databend/pull/19616) — open

**Why it matters:** Schema nullability mismatches in `FULL OUTER JOIN ... USING` can produce planner/output schema inconsistencies, which may surface as correctness bugs, type mismatches, or assertion/debug failures.  
**Status:** Fix proposed, not yet merged in the provided snapshot.

### Low severity
#### 4) Missing support for idempotent `ALTER TABLE ADD COLUMN IF NOT EXISTS`
- [#19615](https://github.com/databendlabs/databend/pull/19615) — open

**Why it matters:** More of a compatibility/usability gap than a crash bug, but important for migration tooling and repeatable schema deployment workflows.  
**Status:** Patch exists.

### Low severity
#### 5) Documentation broken link(s)
- [Issue #19634](https://github.com/databendlabs/databend/issues/19634)

**Why it matters:** Limited direct engine risk, but impacts docs trust and user experience.  
**Status:** Newly reported by automation.

## 6. Feature Requests & Roadmap Signals

Even without explicit feature-request issues today, PR/release activity suggests near-term roadmap direction:

### Strong roadmap signals
#### 1) Better staged file/text ingestion
- [#19588](https://github.com/databendlabs/databend/pull/19588) — `add TEXT file format params`

This points to continued work in **data loading and external stage usability**, likely benefiting ETL users and lakehouse-style ingestion flows. Similar enhancements may appear in upcoming nightlies or the next stable version, especially around parser options, delimiters, escaping, and raw text interoperability.

#### 2) Incremental SQL dialect compatibility
- [#19615](https://github.com/databendlabs/databend/pull/19615)
- [#19635](https://github.com/databendlabs/databend/pull/19635)
- [#19636](https://github.com/databendlabs/databend/pull/19636)
- [#19616](https://github.com/databendlabs/databend/pull/19616)

These indicate Databend is actively closing compatibility gaps in:
- DDL syntax support
- literal parsing semantics
- join output typing/nullability

This pattern suggests the next versions will likely continue to improve migration friendliness for workloads coming from MySQL-like systems and standard SQL environments.

#### 3) More defensive optimizer/statistics logic
- [#19631](https://github.com/databendlabs/databend/pull/19631)
- [#19632](https://github.com/databendlabs/databend/pull/19632)

This is a signal that optimizer robustness remains a priority. Expect more fixes around edge-case stats handling, cardinality estimation, and preventing planner panics on extreme column ranges.

## 7. User Feedback Summary

Based on today’s activity, the clearest user and developer pain points are:

- **SQL compatibility friction**, especially in edge syntax and literal handling.
  - Evidence: repeated PRs for `X'...'` parsing and `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.
- **Planner stability under edge-case statistics**, particularly on wide unsigned integer domains common in analytical IDs.
  - Evidence: multiple PR iterations around `Scan::derive_stats` overflow.
- **Schema correctness in complex joins**, where users depend on predictable nullability and output typing.
  - Evidence: [#19616](https://github.com/databendlabs/databend/pull/19616).
- **Docs integrity**, though only one automated report surfaced.
  - Evidence: [#19634](https://github.com/databendlabs/databend/issues/19634).

There was no explicit positive/negative end-user sentiment recorded in comments or reactions in the provided dataset, so today’s feedback picture is inferred mainly from engineering response patterns rather than direct community discussion.

## 8. Backlog Watch

There are no clearly long-unanswered issues in today’s limited dataset, but a few open PRs merit maintainer attention because they affect correctness and compatibility:

### Needs prompt review/merge
- [#19632](https://github.com/databendlabs/databend/pull/19632) — overflow-safe scan stats  
  Important due to planner stability implications.
- [#19636](https://github.com/databendlabs/databend/pull/19636) — binary literal parsing  
  Important for SQL correctness and standards alignment.
- [#19616](https://github.com/databendlabs/databend/pull/19616) — full outer join nullability  
  Important for result schema correctness.
- [#19615](https://github.com/databendlabs/databend/pull/19615) — `ADD COLUMN IF NOT EXISTS`  
  Important for schema migration/idempotent deployment use cases.

### Minor maintenance backlog
- [Issue #19634](https://github.com/databendlabs/databend/issues/19634) — link checker report  
  Low urgency, but worth clearing to keep documentation quality high.

## Overall Health Assessment

Databend appears healthy today: releases are continuing, bugfix throughput is active, and current work is focused on meaningful engine quality areas rather than firefighting a major outage. The strongest signals are around **SQL correctness**, **planner robustness**, and **ingestion ergonomics**. The main short-term risk is that several important fixes are still in review/open status, so users affected by these edge cases may need to track upcoming nightly builds before seeing resolution in a stable release.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-30

## 1. Today's Overview

Velox showed **moderate-to-high engineering activity** over the last 24 hours, with **12 pull requests updated** and **1 issue updated**, but **no new releases**. The day’s changes were concentrated around **stability fixes, test flakiness, documentation improvements, and storage/runtime internals**, rather than headline feature drops. A notable pattern is the team continuing to invest in **correctness under concurrency and edge cases**, especially around joins, spilling, and deserialization. Overall, project health looks solid: merged work is incremental but meaningful, and open PRs indicate active movement on **SQL function coverage, tracing/replay tooling, and storage-path performance**.

## 2. Project Progress

### Merged / closed PRs today

#### 1) Fix uninitialized spill config causing flaky test failures
- PR: [#16956](https://github.com/facebookincubator/velox/pull/16956)
- Status: Merged
- Area: **Spilling / execution stability / test reliability**

This fix addresses an **uninitialized `SpillConfig::numMaxMergeFiles`** that could randomly take the value `1`, triggering a `VELOX_CHECK_NE(numMaxMergeFiles, 1)` and causing **flaky `SpillerTest` failures**. While framed as a test fix, this points to a broader concern around **configuration safety in spill/merge paths**, an important area for analytical engines handling large intermediate state.

#### 2) Document hash table operating modes
- PR: [#16953](https://github.com/facebookincubator/velox/pull/16953)
- Status: Merged
- Area: **Execution engine internals / developer documentation**

This adds documentation for the three hash table modes:
- `kArray`
- `kNormalizedKey`
- `kHash`

This is valuable for engine developers and downstream integrators because hash table strategy directly affects **join and aggregation behavior, memory layout, and performance predictability**. Better documentation here improves maintainability and lowers the barrier for contributors diagnosing execution plans and performance issues.

#### 3) Optimize Nimble metadata I/O with cache changes
- PR: [#16948](https://github.com/facebookincubator/velox/pull/16948)
- Status: Merged
- Area: **Storage optimization / metadata caching / Nimble**

This change improves Nimble metadata I/O by introducing **`MetadataCache` and pinned caching** semantics for metadata structures such as stripe groups and indexes. The technical signal is strong: Velox contributors are pushing on **metadata locality and cache retention**, likely to reduce repeated metadata fetch/decode overhead in workloads that revisit multiple stripe groups. This is a meaningful storage-engine optimization and suggests continuing investment in **scan efficiency and file-format integration**.

## 3. Community Hot Topics

There was limited issue traffic today, so the “hot topics” are best inferred from the most strategically important active PRs rather than comment volume.

### A) Counting join correctness under multi-driver merge
- PR: [#16949](https://github.com/facebookincubator/velox/pull/16949)
- Area: **Query correctness / joins / parallel execution**

This PR fixes counting join count merging in `HashTable::buildFullProbe`, specifically when **multiple build drivers process overlapping keys** for `EXCEPT ALL` / `INTERSECT ALL`. The underlying need is clear: users need **correct multiset semantics under parallel execution**, not just good performance. This is a high-value correctness topic because these errors can silently produce wrong answers.

### B) Column deserialization bug after all-null column
- PR: [#16951](https://github.com/facebookincubator/velox/pull/16951)
- Area: **Reader correctness / encoded page decoding**

This fix targets a **premature return in `readColumns`** that could skip remaining columns after an all-null column was handled. The technical need here is robust handling of **mixed encodings and schema/type mismatches** in deserialization. For analytical systems, these bugs are dangerous because they can result in **truncated or partially decoded row batches**.

### C) Tracing and replay for index-side splits
- PR: [#16950](https://github.com/facebookincubator/velox/pull/16950)
- Area: **Observability / debugging / replayability**

This adds tracing of index splits in `IndexLookupJoin` plus replay support. The need behind this work is stronger tooling for reproducing complex operator behavior, especially in **connector-driven and distributed-like execution scenarios**. It signals continued emphasis on **diagnosability**, which is often critical for production adoption.

### D) Pre-commit formatting failure on Python scripts
- Issue: [#16952](https://github.com/facebookincubator/velox/issues/16952)
- Area: **Contributor workflow / CI hygiene**

This open issue reports that Python files added in an earlier PR do not pass `ruff-format`, causing **pre-commit failures for downstream PRs** that touch those files. The underlying need is consistency between **main-branch enforcement and PR-time checks**. This is not a runtime engine problem, but it is a real friction point for contributors.

## 4. Bugs & Stability

Ranked by likely severity and user impact.

### High severity

#### 1) Counting join merge may produce incorrect results
- PR: [#16949](https://github.com/facebookincubator/velox/pull/16949)
- Status: Open

This appears to be the most serious active bug today because it concerns **query correctness**, not just crashes or tests. It affects counting joins used by **`EXCEPT ALL` / `INTERSECT ALL`** when parallel build drivers encounter overlapping keys. If confirmed, this would mean users can get **incorrect result counts** in set operations.

#### 2) Premature return during column reads can skip later columns
- PR: [#16951](https://github.com/facebookincubator/velox/pull/16951)
- Status: Open

A deserialization path may **stop reading remaining columns** after handling an all-null column. This is a correctness and data integrity concern, especially in heterogeneous or unexpected encoding scenarios. The impact depends on trigger frequency, but the failure mode is potentially serious because it can corrupt interpretation of batch contents.

### Medium severity

#### 3) Flaky `PrintPlanWithStatsTest`
- PR: [#16957](https://github.com/facebookincubator/velox/pull/16957)
- Status: Open

This addresses flaky stats expectations by marking `blockedWaitForSplit` stats as optional. This is mainly a **test and observability stability** issue, but recurring flakes reduce confidence in CI and slow development.

#### 4) Uninitialized spill config causing flaky `SpillerTest`
- PR: [#16956](https://github.com/facebookincubator/velox/pull/16956)
- Status: Merged

Already fixed. The immediate user-facing impact seems limited to tests, but it exposed fragility in spill-related configuration handling.

### Low severity

#### 5) Pre-commit `ruff-format` failure on main branch files
- Issue: [#16952](https://github.com/facebookincubator/velox/issues/16952)
- Status: Open

This is a **developer experience regression** rather than an engine bug. Still, it can block or annoy contributors and should be cleaned up quickly.

## 5. Feature Requests & Roadmap Signals

Several open PRs provide strong clues about near-term roadmap direction.

### SQL compatibility expansion

#### AES encryption/decryption for Spark SQL
- PR: [#16782](https://github.com/facebookincubator/velox/pull/16782)

Adds `aes_encrypt` and `aes_decrypt` with support for:
- ECB
- CBC
- GCM
- key sizes 128/192/256
- IV generation and handling

This is a strong signal that Velox is continuing to deepen **Spark SQL function compatibility**, especially for enterprise/security-sensitive workloads.

#### Base32 encoding support
- PR: [#16235](https://github.com/facebookincubator/velox/pull/16235)

Adds `to_base32` and `from_base32`-related documentation/functionality aligned with RFC 4648. This suggests ongoing work to round out **binary/string utility function coverage**, likely important for Presto/Trino-style ecosystems and data engineering pipelines.

### Runtime tooling and debuggability

#### IndexLookupJoin split tracing and replay
- PR: [#16950](https://github.com/facebookincubator/velox/pull/16950)

This is a notable roadmap signal toward **operator-level replay and forensic debugging**. Expect more investment in tracing infrastructure if this lands, especially for complex connector/operator interactions.

### Storage and scan-path efficiency

#### Perfetto SDK update
- PR: [#16835](https://github.com/facebookincubator/velox/pull/16835)

While nominally a dependency update, this points to continued maintenance of **profiling and trace instrumentation**. The inclusion of GCC 13 warning suppression also shows attention to **toolchain compatibility**.

#### Nimble metadata cache optimization
- PR: [#16948](https://github.com/facebookincubator/velox/pull/16948)
- Merged

This likely previews further work around **metadata caching, scan warmness, and file-format access efficiency**.

### Likely candidates for next version
Most likely to land soon based on current activity and strategic fit:
1. [#16949](https://github.com/facebookincubator/velox/pull/16949) — correctness fix for counting joins
2. [#16951](https://github.com/facebookincubator/velox/pull/16951) — reader/deserialization correctness fix
3. [#16950](https://github.com/facebookincubator/velox/pull/16950) — tracing/replay enhancement
4. [#16782](https://github.com/facebookincubator/velox/pull/16782) — Spark SQL AES functions
5. [#16235](https://github.com/facebookincubator/velox/pull/16235) — Base32 encoding

## 6. User Feedback Summary

Based on today’s activity, the clearest user and contributor pain points are:

- **Correctness under parallel execution**: The counting join fix in [#16949](https://github.com/facebookincubator/velox/pull/16949) suggests users or downstream CI are exercising complex multiset operations where exact counts matter.
- **Robustness in edge-case decoding paths**: The deserialization issue in [#16951](https://github.com/facebookincubator/velox/pull/16951) indicates demand for resilient behavior across null-heavy and type-mismatched data.
- **Low-noise CI and contributor workflows**: Flaky tests in [#16957](https://github.com/facebookincubator/velox/pull/16957) and [#16956](https://github.com/facebookincubator/velox/pull/16956), plus formatting friction in [#16952](https://github.com/facebookincubator/velox/issues/16952), show that developer productivity remains an active concern.
- **Broader SQL function parity**: Feature work in [#16782](https://github.com/facebookincubator/velox/pull/16782) and [#16235](https://github.com/facebookincubator/velox/pull/16235) implies ongoing user demand for more complete SQL/function compatibility.

There was no explicit end-user satisfaction feedback in the provided data, but the pattern of work suggests the project is responding to practical adoption needs: **correct results, production debugging tools, and compatibility breadth**.

## 7. Backlog Watch

These open PRs appear important and merit maintainer attention either because they are older, broadly useful, or tied to user-facing compatibility.

### 1) Base32 encoding support has been open since early February
- PR: [#16235](https://github.com/facebookincubator/velox/pull/16235)
- Created: 2026-02-04

This is now relatively old compared with current review flow. It looks broadly useful and low-risk from a surface-area perspective, so prolonged delay may simply reflect review bandwidth.

### 2) Spark SQL AES functions remain open
- PR: [#16782](https://github.com/facebookincubator/velox/pull/16782)
- Created: 2026-03-16

This is a meaningful compatibility feature with likely user demand. Given the breadth of supported modes and crypto semantics, it probably needs careful review, but it stands out as a likely high-value merge candidate.

### 3) Perfetto SDK update still open
- PR: [#16835](https://github.com/facebookincubator/velox/pull/16835)
- Created: 2026-03-19

Dependency and instrumentation updates can become harder to merge over time as branches drift. Since it includes compiler warning handling, it may need prompt review to avoid future toolchain friction.

### 4) Contributor workflow issue should be resolved quickly
- Issue: [#16952](https://github.com/facebookincubator/velox/issues/16952)

Although not old, this is the sort of issue that can create repeated friction for anyone touching the affected files. It deserves fast turnaround despite lower technical severity.

## 8. Project Health Takeaway

Velox remains active and healthy, with current work emphasizing **engine correctness, CI reliability, storage-path efficiency, and SQL compatibility growth**. No release was cut today, but merged changes were substantive in areas that matter to analytical engine users: **spill robustness, metadata performance, and internal execution documentation**. The most important near-term items to watch are the **counting join correctness fix** and the **column read bug fix**, both of which affect result integrity. Overall, the project appears to be in a **stabilize-and-expand** phase rather than a major release phase.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-30

## 1. Today's Overview
Apache Gluten showed light but steady maintenance activity over the last 24 hours, with **1 active issue** and **5 pull requests updated**, of which **2 were closed** and **3 remain open**. There were **no new releases**, so the day’s signal comes mainly from incremental engineering work rather than packaged delivery. The visible work focused on **build hygiene, dependency upkeep, execution-path micro-optimization, and Spark SQL compatibility**. Overall, project health appears **stable but moderately backlog-driven**, with several older or stale PRs still circulating alongside ongoing Velox-upstream coordination.

## 2. Project Progress

### Closed PRs
#### 1. Remove banned class from Spark 3.2 build
- PR: [#11840](https://github.com/apache/incubator-gluten/pull/11840)
- Title: **[CORE] [GLUTEN-11379][VL] remove banned class from spark-32 build**
- Status: Closed

This change indicates continued effort to keep Gluten’s **Spark-version-specific build matrix** clean and compliant. While not a user-facing feature, build correctness is essential for downstream packagers and users running mixed Spark environments, especially Spark 3.2 deployments. The closure suggests maintenance progress on **core integration reliability** rather than execution semantics.

#### 2. Snappy codec for columnar shuffle compression closed without merge
- PR: [#11454](https://github.com/apache/incubator-gluten/pull/11454)
- Title: **[WIP][VL] Add snappy to gluten columnar shuffle compression codec**
- Status: Closed
- Labels: `CORE`, `stale`, `VELOX`

This PR is notable because it touched a potentially important runtime area: **columnar shuffle compression**. Support for Snappy could have improved interoperability and operational flexibility in environments where Snappy is the default or preferred compression codec. Its closure, especially under a stale/WIP path, suggests this optimization is **not currently advancing** and may need redesign, rebasing, or renewed maintainer sponsorship before it lands.

### Open PRs with forward-looking impact
#### 3. Reuse date/timestamp formatters in partition loops
- PR: [#11843](https://github.com/apache/incubator-gluten/pull/11843)
- Title: **[CH][VL] Move DateFormatter and TimestampFormatter creation out of partition value loops**
- Status: Open
- Link: https://github.com/apache/incubator-gluten/pull/11843

This is a classic **hot-path allocation reduction** optimization across both **ClickHouse** and **Velox** backends. By moving formatter construction out of inner loops, the patch targets lower per-file overhead during partition-value handling. This points to ongoing refinement in scan/execution-path efficiency, especially for workloads with many files or partitions.

#### 4. Spark 4.0+ `dayname` function support
- PR: [#11549](https://github.com/apache/incubator-gluten/pull/11549)
- Title: **[VL][SPARK-46725] Support dayname function for Spark 4.0+**
- Status: Open
- Link: https://github.com/apache/incubator-gluten/pull/11549

This PR advances **Spark SQL compatibility**, specifically alignment with newer Spark 4.0/4.1 function coverage. Function parity remains a major adoption requirement for Gluten, so even small built-in function additions can materially reduce fallback-to-Spark behavior.

#### 5. Python dependency upgrade in benchmarking tooling
- PR: [#11846](https://github.com/apache/incubator-gluten/pull/11846)
- Title: **Bump pyasn1 from 0.4.8 to 0.6.3 in /tools/workload/benchmark_velox/analysis**
- Status: Open
- Link: https://github.com/apache/incubator-gluten/pull/11846

This is routine tooling maintenance, but still useful: benchmark analysis pipelines are part of how performance regressions are measured and communicated. Dependency freshness in this area supports healthier **benchmark reproducibility and security posture**.

## 3. Community Hot Topics

### 1. Tracking useful Velox PRs not yet merged upstream
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)
- Title: **[VL] useful Velox PRs not merged into upstream**
- Status: Open
- Comments: 16
- Reactions: 4

This is the most active discussion point in the current snapshot. The issue acts as a tracker for **Velox contributions originating from the Gluten community that are still waiting on upstream merge**. The technical need underneath is significant: Gluten’s velocity depends heavily on the health of its relationship with **Velox upstream**, and unmerged patches can create friction around rebasing, feature availability, and whether to temporarily carry downstream deltas. This is a roadmap signal that **backend evolution is gated as much by upstream coordination as by Gluten-local implementation effort**.

### 2. Spark 4 SQL coverage: `dayname`
- PR: [#11549](https://github.com/apache/incubator-gluten/pull/11549)

Although not heavily discussed in comments from the provided data, this PR reflects a continuing need from users to get **new Spark SQL built-ins** supported natively in Gluten. The technical pressure here is straightforward: every missing function can trigger fallback, reducing performance gains and complicating production adoption.

### 3. Execution micro-optimization in CH/Velox iterators
- PR: [#11843](https://github.com/apache/incubator-gluten/pull/11843)

This PR surfaces an enduring engineering priority for analytical engines: reducing object creation and repeated formatting work in inner loops. The underlying need is not just speed in isolation, but better behavior on **high-partition-count and file-heavy data lake workloads**.

## 4. Bugs & Stability

No new high-severity bug reports, crash reports, or query-correctness regressions were visible in the provided 24-hour data.

### Stability-relevant items, ranked
#### Low severity: build hygiene / compatibility
- PR: [#11840](https://github.com/apache/incubator-gluten/pull/11840)
- Removing a banned class from the Spark 3.2 build indicates attention to **build stability and compliance**, but this does not appear to represent a production runtime regression from today’s data.

#### Low-to-medium severity: stale performance feature not progressing
- PR: [#11454](https://github.com/apache/incubator-gluten/pull/11454)
- The closure of the Snappy shuffle codec PR does not signal a bug directly, but it does leave a **gap in compression-path flexibility** that may matter to operators expecting broader codec support.

#### Watch item: unmerged Velox dependencies
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)
- This is not a bug report, but it is a **stability and delivery risk factor**. If important backend fixes or features remain outside Velox upstream for too long, Gluten may face integration drift or delayed access to needed capabilities.

## 5. Feature Requests & Roadmap Signals

### Likely roadmap themes
#### 1. Better Spark 4.x SQL function compatibility
- PR: [#11549](https://github.com/apache/incubator-gluten/pull/11549)

Support for `dayname` suggests Gluten continues closing function-coverage gaps for newer Spark releases. This kind of work is highly likely to appear in upcoming versions because it directly affects **drop-in compatibility**.

#### 2. More backend-level performance polishing
- PR: [#11843](https://github.com/apache/incubator-gluten/pull/11843)

The formatter reuse patch suggests maintainers are still extracting gains from **low-level iterator and scan-path tuning** in both ClickHouse and Velox integrations. Similar micro-optimizations are likely candidates for near-term inclusion.

#### 3. Compression and shuffle-path capabilities remain desirable but uncertain
- PR: [#11454](https://github.com/apache/incubator-gluten/pull/11454)

Even though the Snappy codec PR was closed, the fact that it existed points to user/operator demand for broader **columnar shuffle compression options**. This may return in a revised implementation if maintainers prioritize operational compatibility.

#### 4. Upstream Velox synchronization remains strategic
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)

This tracker is one of the clearest roadmap signals in the dataset. Features or fixes blocked in Velox upstream are likely to influence what can realistically ship next in Gluten, especially for the Velox backend.

## 6. User Feedback Summary
The strongest user/community signal today is not explicit end-user benchmarking feedback, but rather a set of practical adoption concerns:

- **Users want smoother Spark compatibility**, especially for newer Spark 4.x functions, as shown by [#11549](https://github.com/apache/incubator-gluten/pull/11549).
- **Operators care about performance in real-world file-heavy scans**, reflected by iterator-loop optimization work in [#11843](https://github.com/apache/incubator-gluten/pull/11843).
- **Backend contributors are feeling friction from upstream dependency management**, as tracked in [#11585](https://github.com/apache/incubator-gluten/issues/11585).
- **Build and tooling maintenance still matter**, evidenced by [#11840](https://github.com/apache/incubator-gluten/pull/11840) and [#11846](https://github.com/apache/incubator-gluten/pull/11846).

In short, the pain points are less about acute breakage today and more about **compatibility completeness, backend coordination, and incremental runtime efficiency**.

## 7. Backlog Watch

### Needs maintainer attention
#### 1. Velox PR tracker remains active and strategically important
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)
- Created: 2026-02-07
- Updated: 2026-03-29

This is the clearest backlog item requiring sustained maintainer attention. It represents technical debt at the boundary between Gluten and Velox, and unresolved upstream PRs can slow feature rollout and complicate maintenance.

#### 2. `dayname` support PR is open and marked stale
- PR: [#11549](https://github.com/apache/incubator-gluten/pull/11549)
- Created: 2026-02-03
- Updated: 2026-03-29

This is a good candidate for prioritization because it improves **Spark 4.x SQL parity** with relatively clear user value. The stale label suggests it may be at risk of lingering despite practical usefulness.

#### 3. Snappy shuffle compression effort was closed stale
- PR: [#11454](https://github.com/apache/incubator-gluten/pull/11454)
- Created: 2026-01-20
- Updated: 2026-03-29

Although closed, this item is worth watching as an unmet need. If user demand for shuffle codec support remains strong, a successor proposal may be warranted.

---

## Bottom Line
Apache Gluten had a **quiet but meaningful maintenance day**: no release activity, no visible high-severity bugs, and modest PR churn centered on **build correctness, SQL compatibility, and execution-path efficiency**. The biggest strategic signal remains **dependency on Velox upstream progress**, while the most immediately useful open work is around **Spark 4 function coverage** and **small runtime optimizations**. Project health looks stable, but several stale or tracking items suggest maintainers may need to spend more attention on **backlog triage and upstream coordination**.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-30

## 1. Today's Overview

Apache Arrow showed **moderate day-to-day maintenance activity** over the last 24 hours: **19 issues updated** and **12 PRs updated**, with a near-even split between active/open and closed items. There were **no new releases**, so the signal today is primarily from backlog grooming, documentation updates, build/CI fixes, and a few correctness-oriented code changes rather than major feature delivery. The most notable current themes are **Python API cleanup/deprecation**, **C++/Parquet correctness hardening**, and **Windows/R CI reliability**. Overall project health looks stable, but a sizable portion of today’s movement came from **stale-warning closures and older backlog churn**, which suggests some long-lived design and ergonomics issues remain unresolved.

---

## 3. Project Progress

_No releases landed today, so progress is best read through merged/closed PRs and issue resolution._

### What was advanced today

#### 1) Python type-conversion semantics were refined
- **PR #46003** — [GH-45875: [Python] Make pa.array(..., safe=False) behave like .cast(..., safe=False)](https://github.com/apache/arrow/pull/46003) — **Closed**
- This addresses an inconsistency in Python array construction versus cast semantics when `safe=False` is used with lossy or out-of-range conversions.
- Why it matters: this is a **query/data correctness and API consistency** improvement for analytical pipelines that rely on explicit unsafe coercion behavior. It reduces surprising divergence between ingestion and cast code paths.

#### 2) Build stability improved for Thrift/Boost-enabled C++ builds
- **PR #48852** — [Fix error with Boost::headers when building with Thrift](https://github.com/apache/arrow/pull/48852) — **Closed**
- This is a **build-system reliability** fix affecting Parquet/C++ users who compile Arrow with bundled Thrift and system Boost.
- Why it matters: for analytical infrastructure teams packaging Arrow from source, this reduces integration friction and downstream build failures.

#### 3) R and documentation maintenance progressed
- **PR #48840** — [Update dplyr-funcs-doc.R to fix a typo](https://github.com/apache/arrow/pull/48840) — **Closed**
- **PR #45160** — [GH-43352: [Docs][Python] Add all tensor classes documentation](https://github.com/apache/arrow/pull/45160) — **Closed**
- While not core engine work, these changes improve **developer usability** and ecosystem documentation breadth.

#### 4) Some proposed integrations/features were closed without landing
- **PR #46257** — [[C++][Python] Add Baidu advanced file system (AFS) support](https://github.com/apache/arrow/pull/46257) — **Closed**
- **PR #44517** — [[JS] Move most dependencies to the devDependencies](https://github.com/apache/arrow/pull/44517) — **Closed**
- These closures indicate that not all ecosystem expansion proposals are currently being prioritized.

### Net assessment
Today’s progress is more about **hardening and maintenance** than new analytical execution capabilities. The clearest technically meaningful movement was on **Python conversion semantics** and **C++ build correctness**, while several older issues/PRs were simply retired.

---

## 4. Community Hot Topics

### 1) Python dataset path parsing for fragment lists
- **Issue #31167** — [[Dataset][Python] Parse a list of fragment paths to gather filters](https://github.com/apache/arrow/issues/31167) — **17 comments**, **Closed**
- Technical need: users want dataset partition parsing to work across **multiple fragment paths**, especially in incremental or overwrite-heavy ingestion workflows.
- Why this matters: this is tied to **partition discovery**, **filter derivation**, and safe downstream processing when files are rewritten with modes like `delete_matching`.
- Signal: users are pushing Arrow toward better support for **incremental lakehouse-style workflows**, where file lists rather than single paths are the unit of orchestration.

### 2) Python C stream interface for single arrays
- **Issue #31194** — [[Python] Support C stream interface of single arrays](https://github.com/apache/arrow/issues/31194) — **12 comments**, **Closed**
- Technical need: users want the Arrow C stream interface to accept non-`StructArray` single arrays in Python.
- Why this matters: this impacts **FFI/interoperability**, especially for embedding Arrow into other runtimes or zero-copy exchange scenarios.
- Signal: there is ongoing demand for Arrow to reduce accidental constraints in its **cross-language ABI surface**.

### 3) R schema ergonomics
- **Issue #35071** — [[R] Improve interface for working with schemas](https://github.com/apache/arrow/issues/35071) — **5 comments**, **Open**
- Technical need: easier schema manipulation and logical operations in R.
- Why this matters: Arrow’s adoption in analytics depends not only on core performance but on **schema ergonomics** in user-facing bindings.
- Signal: R users still see friction in advanced schema workflows, especially when reproducing Python-centric tutorials or handling typed datasets.

### 4) Batch-by-batch Parquet writing causing OOM
- **Issue #45638** — [[C++] Writing batches to parquet batch-by-batch triggering OOM](https://github.com/apache/arrow/issues/45638) — **5 comments**, **Closed**
- Technical need: understanding memory behavior of incremental Parquet writing.
- Why this matters: this hits the core of Arrow’s storage-engine usage in constrained environments.
- Signal: users continue to need clearer guidance and possibly tooling around **writer buffering, row group sizing, and memory retention**.

### 5) Feather deprecation in Python
- **Issue #49232** — [[Python] Deprecate Feather reader and writer](https://github.com/apache/arrow/issues/49232) — **4 comments**, **Open**
- **PR #49590** — [GH-49232: [Python] deprecate feather python](https://github.com/apache/arrow/pull/49590) — **Open**
- Technical need: consolidate redundant APIs now that Feather V2 is effectively Arrow IPC.
- Why this matters: this is a **product surface simplification** move, reducing maintenance burden and ambiguity for users.
- Signal: Arrow maintainers are willing to remove historical compatibility layers when the underlying format distinction no longer justifies separate APIs.

### 6) Fresh correctness work in Parquet timestamp coercion
- **PR #49615** — [GH-47657: [C++][Parquet] Check for integer overflow when coercing timestamps](https://github.com/apache/arrow/pull/49615) — **Open**
- Technical need: prevent silent corruption when converting timestamp units during Parquet writes.
- Why this matters: this is a high-value **data correctness** fix affecting storage output fidelity.

---

## 5. Bugs & Stability

Ranked by likely severity based on impact to correctness, crashes, and operational reliability.

### High severity

#### 1) Possible silent data corruption in Parquet timestamp writes
- **PR #49615** — [Check for integer overflow when coercing timestamps](https://github.com/apache/arrow/pull/49615) — **Open**
- Risk: timestamp values multiplied during unit coercion can overflow without checks, potentially writing incorrect Parquet data.
- Severity rationale: **silent corruption > explicit failure** in analytical systems.
- Fix status: **active PR exists**.

#### 2) Batch-by-batch Parquet writer OOM behavior
- **Issue #45638** — [[C++] Writing batches to parquet batch-by-batch triggering OOM](https://github.com/apache/arrow/issues/45638) — **Closed**
- Risk: out-of-memory during incremental file production.
- Severity rationale: affects production ingestion jobs and embedded systems.
- Fix status: no linked fix PR in today’s data; likely resolved as usage/support rather than engine patch.

### Medium severity

#### 3) Windows AMD64 R CI failing due to missing object storage bucket
- **PR #49610** — [GH-49609: [CI][R] AMD64 Windows R release fails with IOError: Bucket 'ursa-labs-r-test' not found](https://github.com/apache/arrow/pull/49610) — **Open**
- Risk: broken release/validation workflows for Windows R.
- Severity rationale: not a user data bug, but directly impacts **release confidence and contributor velocity**.
- Fix status: **open PR available**.

#### 4) Build failure with Boost headers + Thrift
- **PR #48852** — [Fix error with Boost::headers when building with Thrift](https://github.com/apache/arrow/pull/48852) — **Closed**
- Risk: source build failures in specific C++ packaging configurations.
- Severity rationale: affects downstream distributors and custom deployments.
- Fix status: **closed today**.

#### 5) Python build/integration issue around `CsvFileWriteOptions`
- **Issue #45634** — [[C++][Python] error: invalid use of incomplete type ‘class arrow::dataset::CsvFileWriteOptions’](https://github.com/apache/arrow/issues/45634) — **Closed**
- Risk: wheel/build failures on constrained ARM environments like Raspberry Pi.
- Severity rationale: narrower impact, but painful for embedded and edge users.
- Fix status: no separate fix PR shown here.

### Lower severity but correctness-adjacent

#### 6) `to_numpy()` drops timezone metadata
- **PR #47681** — [GH-45644: [Python][Documentation] Timestamp with tz loses its time zone after to_numpy](https://github.com/apache/arrow/pull/47681) — **Open**
- Risk: user confusion and downstream semantic loss.
- Severity rationale: behavior may be expected from NumPy limitations, but documentation needs to make it explicit to avoid analytics errors.

---

## 6. Feature Requests & Roadmap Signals

### Strongest roadmap signals

#### 1) Feather API deprecation and consolidation into IPC
- **Issue #49232** — [[Python] Deprecate Feather reader and writer](https://github.com/apache/arrow/issues/49232)
- **PR #49590** — [[Python] deprecate feather python](https://github.com/apache/arrow/pull/49590)
- Prediction: **likely to land in an upcoming release**, because there is already an implementation PR and the rationale is aligned with C++ deprecation work.
- Expected impact: API cleanup, migration guidance from `pyarrow.feather` to `pyarrow.ipc`.

#### 2) Better `concat_batches()` schema promotion in Python
- **Issue #49574** — [[Python] `pa.concat_batches()` to include `promote_options` like `pa.concat_tables()`](https://github.com/apache/arrow/issues/49574)
- Prediction: good candidate for a **near-term Python usability enhancement**.
- Why: this is a focused API symmetry request with clear precedent in `concat_tables()`.

#### 3) Schema ergonomics improvements in R
- **Issue #35071** — [[R] Improve interface for working with schemas](https://github.com/apache/arrow/issues/35071)
- Prediction: plausible but less immediate than Feather deprecation; likely depends on R maintainer bandwidth.
- Why: clear user need, but broader API design work.

#### 4) Doc exposure of advanced Parquet writer options
- **Issue #47499** — [[Python] Show `use_content_defined_chunking` in the list of parameters of `parquet.write_table` (doc)](https://github.com/apache/arrow/issues/47499)
- Prediction: likely to land soon as a **documentation fix**.
- Why: low implementation cost, high discoverability value for storage tuning.

#### 5) Static build for ODBC Flight SQL driver
- **PR #49585** — [DRAFT: set up static build of ODBC FlightSQL driver](https://github.com/apache/arrow/pull/49585)
- Prediction: medium-term infrastructure work rather than next-release headline feature.
- Why: relevant for packaging and connector deployment, especially enterprise BI/ODBC use cases.

### Longer-range engine and execution signals
The open older C++ issues point to continued interest in:
- **nested predicate pushdown** — [Issue #20203](https://github.com/apache/arrow/issues/20203)
- **non-deterministic expression handling in simplification** — [Issue #31677](https://github.com/apache/arrow/issues/31677)
- **Substrait feature-awareness** — [Issue #31668](https://github.com/apache/arrow/issues/31668)
- **full chunked-array support in kernels** — [Issue #31665](https://github.com/apache/arrow/issues/31665)
- **ExecBatch representation improvements / RLE ideas** — [Issue #31680](https://github.com/apache/arrow/issues/31680)

These are important for Arrow as an **analytical execution substrate**, but they do not yet show strong short-term delivery momentum.

---

## 7. User Feedback Summary

### Main pain points surfaced by users

#### 1) Memory behavior during file writing is still confusing
- [Issue #45638](https://github.com/apache/arrow/issues/45638)
- Users writing Parquet incrementally can still hit **OOM** and struggle to understand buffering and row-group memory behavior.
- Takeaway: Arrow remains powerful, but **storage writer ergonomics and observability** could improve.

#### 2) API consistency matters a lot in Python
- [PR #46003](https://github.com/apache/arrow/pull/46003)
- The fact that `pa.array(..., safe=False)` and `.cast(..., safe=False)` behaved differently was meaningful enough to warrant a fix.
- Takeaway: Python users expect Arrow APIs to behave consistently across ingestion and transformation steps.

#### 3) R users want parity with Python-centric workflows
- [Issue #35071](https://github.com/apache/arrow/issues/35071)
- Reproducing schema-heavy examples from blog posts or Python workflows remains harder in R than users expect.
- Takeaway: cross-language consistency is still an adoption challenge.

#### 4) Documentation gaps still block advanced users
- [Issue #47499](https://github.com/apache/arrow/issues/47499)
- [PR #47681](https://github.com/apache/arrow/pull/47681)
- Users are asking for documentation on hidden/undocumented writer parameters and for clearer warnings about lossy conversions like timezone dropping in NumPy interop.
- Takeaway: some friction is not from engine limitations but from **discoverability and expectation-setting**.

#### 5) Build and platform portability remain active concerns
- [Issue #45634](https://github.com/apache/arrow/issues/45634)
- [PR #48852](https://github.com/apache/arrow/pull/48852)
- ARM devices, custom source builds, and mixed dependency environments still expose rough edges.
- Takeaway: Arrow’s broad systems footprint means portability remains a core maintenance burden.

---

## 8. Backlog Watch

These are older or strategically important items that appear to need maintainer attention.

### High-value older open issues

#### 1) Nested filter pushdown for datasets
- **Issue #20203** — [[C++] Add support for pushdown filtering of nested references](https://github.com/apache/arrow/issues/20203)
- Why it matters: directly relevant to **query pruning efficiency** on semi-structured/nested data, an important analytics workload.

#### 2) Non-deterministic expression simplification correctness
- **Issue #31677** — [[C++] SimplifyWithGuarantee does not work with non-deterministic expressions](https://github.com/apache/arrow/issues/31677)
- Why it matters: expression optimizer mistakes can lead to **query correctness bugs**, which are more serious than performance issues.

#### 3) Substrait consumer feature-awareness
- **Issue #31668** — [[C++] Substrait consumer should be feature-aware](https://github.com/apache/arrow/issues/31668)
- Why it matters: important for **portable query plan interchange** and graceful degradation when optional components are not compiled in.

#### 4) Full chunked-array support for `replace_with_mask`
- **Issue #31665** — [[C++] Implement full chunked array support for replace_with_mask](https://github.com/apache/arrow/issues/31665)
- Why it matters: kernel completeness for chunked data is central to Arrow’s analytical data model.

#### 5) R schema UX improvements
- **Issue #35071** — [[R] Improve interface for working with schemas](https://github.com/apache/arrow/issues/35071)
- Why it matters: this is a user-facing productivity issue with cross-language ecosystem implications.

#### 6) Release verification portability on Windows
- **Issue #31706** — [[Release][C++] Windows source verification hardcodes Visual Studio version](https://github.com/apache/arrow/issues/31706)
- Why it matters: affects release engineering and contributor onboarding for Windows environments.

### Open PRs needing attention

#### 7) Feather deprecation implementation
- **PR #49590** — [[Python] deprecate feather python](https://github.com/apache/arrow/pull/49590)
- Likely important for upcoming API cleanup; worth timely review.

#### 8) Parquet timestamp overflow correctness fix
- **PR #49615** — [[C++][Parquet] Check for integer overflow when coercing timestamps](https://github.com/apache/arrow/pull/49615)
- Highest-priority active correctness patch in today’s queue.

#### 9) Windows/R CI repair
- **PR #49610** — [[CI][R] AMD64 Windows R release fails with IOError: Bucket 'ursa-labs-r-test' not found](https://github.com/apache/arrow/pull/49610)
- Quick turnaround desirable because it impacts CI signal quality.

#### 10) Type singleton refactor in C++
- **PR #46616** — [[C++]: Refactor - move type singleton logic into type.cc/h and tests](https://github.com/apache/arrow/pull/46616)
- Lower urgency than correctness items, but long-running refactors tend to stall without explicit maintainer direction.

---

## Bottom Line

Today’s Arrow activity points to a project in **steady maintenance mode**, with emphasis on **API cleanup, build reliability, and correctness hardening** rather than large new engine features. The most important active technical item is the **Parquet timestamp overflow fix** in [PR #49615](https://github.com/apache/arrow/pull/49615). The clearest short-term roadmap signal is **Python Feather deprecation** via [Issue #49232](https://github.com/apache/arrow/issues/49232) and [PR #49590](https://github.com/apache/arrow/pull/49590). The biggest lingering gaps remain in **older execution-engine and dataset optimization issues**, especially nested pushdown, expression correctness, and chunked-array kernel completeness.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*