# Apache Doris Ecosystem Digest 2026-03-19

> Issues: 13 | PRs: 150 | Projects covered: 10 | Generated: 2026-03-19 01:25 UTC

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

# Apache Doris Project Digest — 2026-03-19

## 1. Today's Overview

Apache Doris remained highly active on 2026-03-19, with **150 pull requests updated** and **13 issues updated** in the last 24 hours, indicating strong ongoing engineering throughput. The day was characterized less by releases and more by **branch backports, engine improvements, external catalog work, and SQL/function compatibility progress**. Maintainer activity appears healthy in the PR pipeline, especially around the upcoming **4.1 branch**, but the issue stream also shows a visible tail of **stale bug reports being auto-closed**, which suggests some support backlog pressure. Overall, project momentum is strong, with notable signals around **AI/hybrid search, external table ecosystems, memory control, Iceberg/MaxCompute integration, and SQL dialect completeness**.

---

## 3. Project Progress

### Merged/closed PRs today: notable technical advances

Even without a release, several closed/merged PRs show meaningful progress in Doris’ analytical engine and lakehouse interoperability.

#### External catalog write capability expanded
- **MaxCompute INSERT INTO support merged**
  - PR: [#60769](https://github.com/apache/doris/pull/60769)
  - Backport: [#61443](https://github.com/apache/doris/pull/61443)
- This adds **end-to-end write support for MaxCompute external catalog tables**, allowing Doris to export data through standard `INSERT INTO` semantics. This is strategically important because it pushes Doris further from read-only federation toward **bidirectional lakehouse/data platform interoperability**.

#### Iceberg writer code quality improved
- PR: [#60978](https://github.com/apache/doris/pull/60978)
- Backport: [#61468](https://github.com/apache/doris/pull/61468)
- While framed as code quality work, this improves maintainability in the **Iceberg write path**, especially around sort writer structure and encapsulation. This is a useful signal that Doris is investing in making Iceberg support more production-ready, not just feature-complete.

#### Paimon build/dependency isolation fixed
- PR: [#60730](https://github.com/apache/doris/pull/60730)
- The change isolates **paimon-cpp Arrow static dependencies**, reducing packaging/build friction. This is a lower-level but important ecosystem improvement for users relying on lakehouse table formats and external engines.

#### Memory pressure reduced during writes
- PR: [#61494](https://github.com/apache/doris/pull/61494)
- Doris optimized memtable flush behavior by releasing column writers **column-by-column** instead of holding all of them until the end. This is a practical **storage-engine memory optimization**, especially relevant for wide tables and high-ingest workloads.

#### Variant column accounting corrected
- PR: [#61331](https://github.com/apache/doris/pull/61331)
- This fixes incorrect reporting where **variant column space usage appeared as 0**. Although not a query-path bug, it matters for storage observability and capacity management.

#### Warmup task download throttling added
- PR: [#60180](https://github.com/apache/doris/pull/60180)
- Introduces **rate limiting for file cache warmup downloads**, helping avoid bandwidth contention and making cache prewarming safer in shared environments.

### Strong open work likely nearing merge

Several open PRs updated today suggest where near-term development is headed:

- **Global Timestamp Oracle (TSO)**: [#61199](https://github.com/apache/doris/pull/61199)  
  Signals work on globally monotonic transaction timestamps, likely relevant to stronger transactional ordering and distributed coordination.
- **Global memory control on scan nodes**: [#61271](https://github.com/apache/doris/pull/61271)  
  Indicates active work on tighter memory governance for query execution.
- **Hive DATE timezone correctness fix**: [#61330](https://github.com/apache/doris/pull/61330)  
  Important correctness fix for external table reads.
- **Parquet metadata TVF**: [#61474](https://github.com/apache/doris/pull/61474)  
  Improves file introspection and operational tooling around Parquet.
- **Iceberg update/delete/merge support**: [#61485](https://github.com/apache/doris/pull/61485)  
  A major lakehouse capability if completed.
- **Parquet page cache**: [#61477](https://github.com/apache/doris/pull/61477)  
  Suggests continued investment in scan efficiency for external formats.

---

## 4. Community Hot Topics

### 1) 2026 roadmap discussion
- Issue: [#60036 — Doris Roadmap 2026](https://github.com/apache/doris/issues/60036)
- Activity: **13 comments**, **15 reactions**
- This is the clearest strategic thread in the dataset. The roadmap emphasizes **AI support, hybrid search, performance, and storage efficiency**, building on 2025 vector search work. The high reaction count suggests strong community alignment around Doris evolving beyond classic MPP analytics into an **AI-aware analytical and retrieval platform**.

**Underlying need:** users want Doris to remain competitive not only as an OLAP engine, but as a system that can serve **hybrid analytical + semantic/vector workloads** with efficient storage and fast retrieval.

### 2) Broad SQL function compatibility effort
- Issue: [#48203 — Support All SQL Functions in Other SQL System](https://github.com/apache/doris/issues/48203)
- Activity: **128 comments**
- Follow-up PR today: [#61500 — add `typeof` scalar function](https://github.com/apache/doris/pull/61500)
- This remains one of the most active long-running community threads. The issue is effectively a **SQL dialect compatibility umbrella**, and today’s `typeof(expr)` PR shows the effort is still producing concrete incremental improvements.

**Underlying need:** Doris users are migrating workloads from engines like **Trino/Presto, Spark SQL, ClickHouse, and other warehouses**, and want lower migration cost through function parity.

### 3) Snapshot backup for cloud clusters
- Issue: [#61464 — Doris Cluster Snapshot Backup](https://github.com/apache/doris/issues/61464)
- New feature request focused on **cluster metadata and object-storage snapshot backup** in Doris Cloud mode.
  
**Underlying need:** operational users increasingly need **disaster recovery, cross-region recoverability, and managed-cloud safety guarantees**, especially as Doris is adopted for business-critical analytical serving.

### 4) Storage and external data ecosystem work
Open PRs around Parquet, Iceberg, Hive, MaxCompute, and external catalog controls together form a major theme:
- [#61474 Parquet metadata TVF](https://github.com/apache/doris/pull/61474)
- [#61485 Iceberg update/delete/merge](https://github.com/apache/doris/pull/61485)
- [#61330 Hive DATE timezone fix](https://github.com/apache/doris/pull/61330)
- [#61498 external catalog include_table_list](https://github.com/apache/doris/pull/61498)

**Underlying need:** Doris is increasingly being used as a **query and compute layer over heterogeneous storage systems**, so correctness and manageability in external catalogs are high-value areas.

---

## 5. Bugs & Stability

### Highest severity

#### 1) `meta_tool` coredump when handling tablet metadata
- Issue: [#61447](https://github.com/apache/doris/issues/61447)
- Severity: **Critical**
- A coredump in `meta_tool` affects low-level metadata maintenance and recovery workflows. Since this tool is typically used in operational or repair scenarios, failures here can complicate incident handling.
- **Fix PR:** none visible in the provided data.

#### 2) Logical view with aggregation fails
- Issue: [#56242](https://github.com/apache/doris/issues/56242)
- Severity: **High**
- Query/view correctness issue in **logical views with `GROUP BY`**, affecting semantic query stability in version 2.1.
- **Fix PR:** none visible today.

#### 3) Hive external DATE timezone shift
- PR: [#61330](https://github.com/apache/doris/pull/61330)
- Severity: **High**, but **fix in progress**
- This bug causes DATE values from Hive ORC/Parquet tables to shift by one day in western time zones. This is a classic **query correctness and cross-system consistency** problem.
- Positive sign: the fix is already open and reviewed.

### Medium severity

#### 4) Iceberg predicate pushdown failure with CAST on STRING partitions
- Issue: [#55804](https://github.com/apache/doris/issues/55804)
- Status: closed stale
- Severity: **Medium**
- Impacts pushdown efficiency and possibly query planning effectiveness for external Iceberg tables. Even though stale-closed, the underlying class of issue remains important because Iceberg interoperability is a strategic area.

#### 5) Flink CDC / Debezium delete handling in Routine Load
- Issue: [#53004](https://github.com/apache/doris/issues/53004)
- Status: closed stale
- Severity: **Medium**
- This touches CDC correctness for delete events, which matters for near-real-time ingestion pipelines.

#### 6) Flink writing to AGG model results in duplicate accumulation
- Issue: [#55820](https://github.com/apache/doris/issues/55820)
- Status: closed stale
- Severity: **Medium**
- Potentially affects exactly-once or dedup expectations in streaming ingestion.

### Lower severity but notable

#### 7) Java UDF-related bug reports
- Issues: [#56233](https://github.com/apache/doris/issues/56233), [#56235](https://github.com/apache/doris/issues/56235)
- Both remain open and stale-tagged, suggesting unresolved friction in **Java UDF integration** on 3.0.7.

#### 8) Kettle StreamLoader build/pom issue
- Issue: [#55292](https://github.com/apache/doris/issues/55292)
- Closed stale
- Lower direct engine severity, but relevant for ETL plugin usability.

### Stability assessment

Today’s issue updates show a split picture:
- **Good:** active fixes exist for correctness-sensitive areas like Hive date decoding.
- **Concerning:** several ingestion and interoperability bugs are being closed as stale rather than clearly resolved, which may leave edge-case users underserved.

---

## 6. Feature Requests & Roadmap Signals

### Clear demand signals from users

#### SQL dialect/function parity
- Umbrella issue: [#48203](https://github.com/apache/doris/issues/48203)
- Concrete PR today: [#61500 `typeof`](https://github.com/apache/doris/pull/61500)
- Expectation: Doris will likely continue shipping **small but frequent SQL compatibility additions**, especially functions familiar to Trino/Presto users.

#### Snapshot backup for cloud deployments
- Issue: [#61464](https://github.com/apache/doris/issues/61464)
- This is a strong operational feature request and aligns with broader cloud adoption trends. It has the kind of architecture scope that may land first as a **design discussion or phased implementation** rather than immediately in the next patch release.

#### Apache DataSketches integration
- Issue: [#56246](https://github.com/apache/doris/issues/56246)
- This request points to demand for richer **probabilistic data structures and approximate analytics**, which fit OLAP use cases well.
- Given Doris’ analytics focus, this is technically plausible for future versions, especially if tied to compatibility with ClickHouse-style approximate functions.

#### Iceberg row-level operations
- PR: [#61485](https://github.com/apache/doris/pull/61485)
- Even though it is a PR rather than issue request, this is one of the strongest signals for next-version capability. Supporting **Iceberg update/delete/merge** would materially improve Doris’ lakehouse competitiveness.

#### File/cache/storage control enhancements
- Open PRs:
  - [#59065 file cache admission control](https://github.com/apache/doris/pull/59065)
  - [#58897 restore storage medium control](https://github.com/apache/doris/pull/58897)
  - [#61477 parquet page cache](https://github.com/apache/doris/pull/61477)
- These suggest the next versions may continue emphasizing **storage efficiency, cache management, and operational tuning**.

### Most likely to appear in an upcoming version
Based on maturity and current PR state, the most likely near-term candidates are:
1. **More SQL compatibility functions** such as `typeof` — [#61500](https://github.com/apache/doris/pull/61500)
2. **Hive external reader correctness fixes** — [#61330](https://github.com/apache/doris/pull/61330)
3. **Parquet metadata and caching enhancements** — [#61474](https://github.com/apache/doris/pull/61474), [#61477](https://github.com/apache/doris/pull/61477)
4. **External catalog management improvements** — [#61498](https://github.com/apache/doris/pull/61498)
5. **Memory control improvements** — [#61271](https://github.com/apache/doris/pull/61271)

---

## 7. User Feedback Summary

### Main user pain points surfaced today

#### 1) Cross-system compatibility remains a top concern
Users continue to ask Doris to behave more like surrounding SQL engines and data platforms:
- Function parity with other SQL systems: [#48203](https://github.com/apache/doris/issues/48203)
- Hive external DATE consistency: [#61330](https://github.com/apache/doris/pull/61330)
- Iceberg pushdown semantics: [#55804](https://github.com/apache/doris/issues/55804)

This suggests that users value Doris as part of a broader stack, not as a standalone silo. Migration friction and semantics mismatch remain significant adoption barriers.

#### 2) Streaming and CDC ingestion correctness matters
Issues around Flink CDC deletes and AGG-model duplicate accumulation indicate ongoing sensitivity in **real-time ingestion**:
- [#53004](https://github.com/apache/doris/issues/53004)
- [#55820](https://github.com/apache/doris/issues/55820)

Users are clearly pushing Doris not just for BI querying, but for **continuous ingest and serving** scenarios where correctness under updates/deletes is crucial.

#### 3) Operational reliability and disaster recovery are increasingly important
The new snapshot backup proposal reflects a maturing user base:
- [#61464](https://github.com/apache/doris/issues/61464)

This usually appears when a system is moving deeper into production-critical workloads.

#### 4) Advanced analytics users want richer approximate/statistical functions
- [#56246](https://github.com/apache/doris/issues/56246)

This points to demand from users doing cardinality estimation and sketch-based analytics, not just basic dashboarding.

### Satisfaction signals
There are indirect positive signals:
- High maintainer throughput on external ecosystem PRs suggests user-reported pain is being acted upon.
- Backports to branch 4.1 show maintainers are trying to operationalize improvements, not just land them on trunk.

---

## 8. Backlog Watch

These items appear important yet under-addressed or at risk of falling through the cracks.

### High-priority backlog items needing maintainer attention

#### 1) SQL function compatibility umbrella is huge and long-running
- Issue: [#48203](https://github.com/apache/doris/issues/48203)
- Why it matters: 128 comments make this one of the strongest demand signals in the project. Although the issue text suggests maintainers may rely more on generated/community PRs now, the scope still needs coordination, prioritization, and acceptance criteria.

#### 2) Java UDF bug reports remain open and stale
- [#56233](https://github.com/apache/doris/issues/56233)
- [#56235](https://github.com/apache/doris/issues/56235)
- Why it matters: UDF support is a key extensibility capability, and stale open bug reports can discourage advanced adopters.

#### 3) Logical view aggregation failure
- [#56242](https://github.com/apache/doris/issues/56242)
- Why it matters: this is a **core SQL correctness problem**, not an edge integration issue.

#### 4) File cache admission control PR still open for months
- PR: [#59065](https://github.com/apache/doris/pull/59065)
- Why it matters: cache governance is strategically relevant for cloud and object-store-heavy deployments.

#### 5) Restore storage medium control PR has been open since 2025
- PR: [#58897](https://github.com/apache/doris/pull/58897)
- Why it matters: users need more deterministic control over SSD/HDD placement and restore behavior, which affects cost and performance planning.

#### 6) Stale-closed ingestion/interoperability bugs may warrant triage review
- [#53004](https://github.com/apache/doris/issues/53004)
- [#55804](https://github.com/apache/doris/issues/55804)
- [#55820](https://github.com/apache/doris/issues/55820)

These may not be resolved, only inactive. Given Doris’ current roadmap emphasis on external systems and AI-era data pipelines, such issues deserve periodic revalidation rather than silent decay.

---

## Overall Health Signal

Apache Doris shows **strong development velocity and broad technical ambition**, especially in external catalogs, lakehouse compatibility, memory/storage efficiency, and SQL coverage. The roadmap and PR mix indicate a project evolving from high-performance OLAP into a more general **analytics + hybrid data access platform**. The main caution is support backlog quality: several bugs are aging into stale status, particularly around ingestion correctness and extensibility. If maintainers can pair current coding velocity with tighter issue triage on correctness and ops-critical bugs, overall project health remains strong.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-19

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, with most major projects simultaneously investing in **lakehouse interoperability, SQL compatibility, execution-engine correctness, and operational hardening**. Across engines, the center of gravity is shifting from standalone MPP warehousing toward **hybrid analytics over external storage**, including Iceberg, Parquet, Hive-style layouts, object stores, and streaming-adjacent workflows. Query speed is no longer enough: users increasingly demand **cross-engine semantic consistency, cloud-operability, disaster recovery, memory governance, and lower migration friction**. The ecosystem is also stratifying more clearly by architecture: some projects are full databases, some are embedded analytics engines, some are table-format layers, and some are execution backends or acceleration frameworks.

---

## 2. Activity Comparison

### Daily activity snapshot

| Project | Issues Updated | PRs Updated | Release Today | Health Score* | Notes |
|---|---:|---:|---|---:|---|
| **Apache Doris** | 13 | 150 | No | **8.6/10** | Strong velocity; broad work in external catalogs, SQL compatibility, memory/storage tuning |
| **ClickHouse** | 66 | 427 | No | **8.7/10** | Extremely high throughput; strong optimizer/storage work but notable CI/fuzzer pressure |
| **DuckDB** | 126 | 80 | No | **8.5/10** | Very active; correctness and cloud/file-query edge cases remain prominent |
| **StarRocks** | 7 | 149 | No | **8.4/10** | High delivery pace; strong optimizer and Iceberg momentum, but several serious correctness issues |
| **Apache Iceberg** | 13 | 42 | No | **8.3/10** | Healthy metadata/catalog progress; maturing via test coverage and REST semantics |
| **Delta Lake** | 0 | 21 | No | **8.0/10** | Focused infrastructure work; less visible community signal today due to no issue activity |
| **Databend** | 6 | 12 | **Yes** | **7.5/10** | Patch-release mode; active stabilization around parser/join/runtime panics |
| **Velox** | 5 | 50 | No | **8.1/10** | Strong backend momentum; low-level correctness and memory-safety fixes remain important |
| **Apache Gluten** | 6 | 18 | No | **7.9/10** | Good integration pace; performance regressions and upstream dependency gaps are key risks |
| **Apache Arrow** | 29 | 19 | No | **8.2/10** | Stable infrastructure project; build/packaging/interoperability dominate current activity |

\*Health score is a qualitative synthesis of velocity, fix responsiveness, backlog quality, and severity mix visible in today’s digest.

---

## 3. Apache Doris's Position

### Advantages vs peers
Apache Doris is currently well-positioned as a **general-purpose analytical database expanding into lakehouse and AI-aware retrieval scenarios**. Compared with peers, it shows a particularly balanced mix of:
- **core engine work**: memory control, memtable flush optimization, observability fixes
- **external ecosystem investment**: MaxCompute write support, Iceberg writer cleanup, Hive correctness, Parquet tooling
- **SQL migration support**: active long-running function compatibility effort
- **operational readiness**: backports to 4.1, cache warmup throttling, storage accounting fixes

This gives Doris a differentiated position between:
- **ClickHouse**, which is stronger in raw scale/throughput and optimizer activity but carries heavier CI/fuzzer noise,
- **DuckDB**, which is dominant in embedded/local analytics but not aimed at the same distributed serving role,
- **StarRocks**, which overlaps most directly but currently appears more concentrated on optimizer/Iceberg/MV execution hardening,
- **Iceberg/Delta**, which are table-format ecosystems rather than end-to-end analytical databases.

### Technical approach differences
Doris is increasingly acting as a **distributed compute and serving layer over both native storage and external catalogs**, rather than only a tightly self-contained MPP store. Relative to peers:
- vs **ClickHouse**: Doris appears more explicitly focused on **federation and external write paths** across lakehouse systems.
- vs **StarRocks**: both target modern cloud/lakehouse analytics, but Doris currently shows stronger visible momentum in **SQL compatibility breadth** and **catalog coverage**, while StarRocks shows deeper visible activity in **optimizer sophistication and MV rewrite behavior**.
- vs **DuckDB**: Doris is cluster-oriented and operationally production-serving; DuckDB is embedded and file-centric.
- vs **Delta/Iceberg**: Doris is a consumer/operator of lakehouse formats, not just the metadata/storage contract itself.

### Community size comparison
By raw daily activity, Doris sits in the **top tier** of the ecosystem, though not the largest:
- Below **ClickHouse** in sheer PR volume
- Comparable to **StarRocks** in PR update intensity
- Higher than **Iceberg**, **Delta**, **Databend**, **Velox**, **Gluten**, and **Arrow**
- Lower issue volume than ClickHouse and DuckDB, which may indicate either less incoming noise or a narrower user-reporting surface

Overall, Doris looks like a **large, fast-moving, and still-expanding community**, especially strong in implementation throughput.

---

## 4. Shared Technical Focus Areas

### 1) Lakehouse / external format interoperability
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Iceberg, Delta, Velox, Gluten, Arrow  
**Specific needs:**
- Iceberg row-level semantics, REST catalog behavior, partition correctness, update/delete support
- Parquet correctness and compatibility: UUIDs, timestamps, metadata introspection, page versions, reader bugs
- Hive partitioning/date semantics and cloud object-store file listing/pruning
- External scans with predictable memory and schema behavior

This is the clearest ecosystem-wide requirement: users want engines to work reliably over **open table formats and object storage**, not only native storage.

### 2) SQL compatibility and migration reduction
**Engines:** Doris, ClickHouse, DuckDB, Velox, Gluten, Delta  
**Specific needs:**
- function parity (`typeof`, `SOME`/`ANY`, concat/null behavior, decimal casts)
- date/time semantics alignment with Spark/Presto/Trino
- consistent operator/function behavior for arrays, lists, nulls, collations, CDC expressions

Doris is especially prominent here via its long-running SQL function umbrella, but this is clearly a broad market requirement.

### 3) Correctness under edge-case execution paths
**Engines:** ClickHouse, DuckDB, StarRocks, Databend, Velox, Delta, Doris  
**Specific needs:**
- wrong-result prevention in joins, aggregations, views, partition evolution, CDC
- crash prevention in storage writers, parsers, analyzers, recursive objects, external readers
- tighter nullability/type propagation and planner consistency

The ecosystem is maturing: users now surface more **semantic and stability edge cases** than basic feature requests.

### 4) Memory governance and runtime efficiency
**Engines:** Doris, DuckDB, ClickHouse, Velox, Databend, Arrow  
**Specific needs:**
- better scan-node/global memory control
- reduced write-time and scan-time memory spikes
- spill correctness and schema fidelity
- safe execution under arbitration or constrained environments
- bounded buffering for Parquet and dataset iteration

This is increasingly important for **cloud cost control and mixed-workload predictability**.

### 5) Streaming, CDC, and mutable table semantics
**Engines:** Doris, ClickHouse, Iceberg, Delta, Gluten  
**Specific needs:**
- CDC correctness for deletes/updates
- streaming query semantics or stronger streaming-source guarantees
- equality delete deduplication, merge-on-read mutation support, offset/commit consistency

This indicates sustained convergence between analytical systems and **incremental/continuous data processing**.

### 6) Cloud operations, safety, and disaster recovery
**Engines:** Doris, StarRocks, Iceberg, Delta, Arrow  
**Specific needs:**
- snapshot backup/disaster recovery
- shared-storage correctness and missing-file recovery
- REST catalog production semantics, idempotency, purge delegation
- package security / trusted publishing
- multi-tenant and secure deployment expectations

Operational maturity is becoming a primary buying criterion.

---

## 5. Differentiation Analysis

### Storage format orientation
- **Doris / ClickHouse / StarRocks / Databend**: full analytical databases with native storage plus increasing external-table/lakehouse integration
- **DuckDB**: embedded analytical engine optimized for direct file querying and local/embedded execution
- **Iceberg / Delta Lake**: table-format and metadata-transaction layers rather than standalone query engines
- **Arrow**: columnar in-memory/data interchange foundation
- **Velox / Gluten**: execution substrate and acceleration layer rather than end-user storage systems

### Query engine design
- **Doris / StarRocks / ClickHouse / Databend**: distributed analytical query engines
- **DuckDB**: single-process vectorized embedded engine
- **Velox**: reusable vectorized execution engine
- **Gluten**: Spark-native acceleration framework using backends like Velox/ClickHouse
- **Iceberg / Delta**: rely on external compute engines
- **Arrow**: compute/data APIs and ecosystem plumbing, not a warehouse engine

### Target workloads
- **Doris**: interactive analytics, real-time ingest/serving, federated analytics, growing hybrid/vector/AI retrieval ambitions
- **ClickHouse**: high-scale analytical serving, event/log analytics, performance-heavy workloads
- **DuckDB**: notebook/local analytics, embedded apps, file/lake querying
- **StarRocks**: cloud-native analytics, MVs, Iceberg/lakehouse acceleration
- **Iceberg / Delta**: open table storage contracts for multi-engine analytics and data engineering pipelines
- **Databend**: cloud data warehouse/lakehouse convergence with growing SQL coverage
- **Velox / Gluten**: acceleration and execution infrastructure for upstream engines
- **Arrow**: interoperability, in-memory analytics, connectors, Flight/ODBC

### SQL compatibility posture
- **Strong visible emphasis:** Doris, ClickHouse, DuckDB, Velox, Gluten
- **Operational/engine semantics emphasis more than breadth:** StarRocks, Databend
- **Table semantics/API compatibility emphasis:** Iceberg, Delta
- **Language/runtime interoperability more than SQL language breadth:** Arrow

Doris stands out for making **SQL compatibility a visible, organized community program**, rather than only opportunistic additions.

---

## 6. Community Momentum & Maturity

### Tier 1: Rapidly iterating, high-volume projects
- **ClickHouse**
- **Apache Doris**
- **StarRocks**
- **DuckDB**

These projects show the strongest day-to-day engineering throughput.  
- **ClickHouse** leads on scale of activity.
- **Doris** combines high throughput with broad feature surface and branch backport discipline.
- **StarRocks** is shipping rapidly, especially in optimizer and Iceberg areas.
- **DuckDB** has huge issue engagement, reflecting deep and diverse user adoption.

### Tier 2: Mature, focused, architecture-heavy iteration
- **Apache Iceberg**
- **Delta Lake**
- **Velox**
- **Apache Arrow**

These projects are highly important infrastructure layers with less headline churn than top engine repos, but strong strategic significance. Their work is often **deeper, contract-oriented, or enabling**, rather than visible end-user feature spam.

### Tier 3: Active but currently stabilization-weighted
- **Databend**
- **Apache Gluten**

Both are clearly moving, but current signals skew more toward **quality hardening, compatibility fixes, and narrower roadmap execution** than broad ecosystem dominance.

### Stabilizing vs expanding
- **Expanding aggressively:** Doris, ClickHouse, StarRocks, DuckDB
- **Stabilizing core abstractions while evolving:** Iceberg, Delta, Arrow, Velox
- **Quality-consolidation phase:** Databend, Gluten

---

## 7. Trend Signals

### 1) Open table formats are now baseline, not optional
Iceberg, Delta, Parquet, Hive-style layouts, and object storage appear across almost every project’s active work. For data engineers and architects, this means future platform choices should be evaluated on **interop quality and semantics**, not just benchmark speed.

### 2) Query engines are converging with lakehouse control planes
Doris, StarRocks, ClickHouse, and DuckDB all show increasing pressure to behave well over external metadata/catalog systems. The practical implication: the winning engines will be those that can serve as **fast compute layers on top of heterogeneous storage estates**.

### 3) SQL portability remains a major adoption lever
Migration friction from Spark SQL, Trino/Presto, ClickHouse, and warehouse systems remains a common theme. This increases the value of engines like Doris that invest systematically in **function parity and dialect completeness**.

### 4) Correctness is a bigger differentiator than raw feature count
Many of today’s high-signal items are wrong-result bugs, planner inconsistencies, memory-safety defects, or subtle metadata semantics. For architects, this suggests maturity evaluation should weight **semantic stability and ops behavior** at least as heavily as performance claims.

### 5) Cloud and ops requirements are rising fast
Backup, object-store correctness, secure publishing, idempotent REST behavior, token refresh, and shared-storage repair are no longer edge concerns. These are strong signals that analytical systems are being selected for **mission-critical production roles**, not only exploratory BI.

### 6) Streaming and mutable analytics are moving closer together
CDC, MERGE, update/delete semantics, streaming-source correctness, and event-time/streaming RFCs appear across Doris, ClickHouse, Iceberg, and Delta. The market is moving toward systems that can support **continuous ingestion plus low-latency analytics** without forcing separate architectures.

### 7) AI / hybrid retrieval is becoming part of the OLAP roadmap
Among the compared projects, Doris shows one of the clearest explicit signals here via its 2026 roadmap emphasis on **AI support and hybrid search**. For technical decision-makers, this suggests some analytical databases are beginning to position themselves not only as BI engines, but as **serving layers for mixed structured + semantic workloads**.

---

## Bottom Line

Apache Doris is in a strong competitive position: high engineering velocity, clear roadmap ambition, meaningful external ecosystem progress, and a differentiated focus on **SQL portability plus federated analytics**. Compared with peers, it is not the single largest community by volume, but it is firmly in the top activity tier and appears strategically aligned with where the ecosystem is heading: **open formats, external catalogs, cloud-native ops, memory efficiency, and broader analytical serving use cases**. For data engineers and architects, Doris currently looks most compelling when the requirement is a **distributed OLAP engine that can bridge native analytics, lakehouse federation, and migration-friendly SQL behavior**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-19

## 1) Today’s Overview

ClickHouse remained highly active over the last 24 hours: **66 issues** were updated and **427 pull requests** saw activity, which indicates a very busy engineering and review cycle. There were **no new releases**, so the day was dominated by ongoing stabilization, feature iteration, CI hygiene, and backport work rather than packaging. The signal from both issues and PRs suggests the project is currently balancing three priorities: **query-planning improvements**, **storage/merge-tree correctness**, and **SQL compatibility expansion**. Overall project health looks strong in terms of throughput, but there is still visible pressure from **CI crash reports**, **fuzzer findings**, and a stream of **edge-case correctness regressions**.

## 2) Project Progress

Although no release was published today, several merged/closed PRs and closed issues show concrete progress across engine correctness, compatibility, and maintenance.

### Query engine and optimizer progress
- **`tryOptimizeTopK` / WHERE-PREWHERE ordering fix** — [PR #99880](https://github.com/ClickHouse/ClickHouse/pull/99880) was closed after addressing an optimizer pass-ordering issue. This improves correctness and likely performance for dynamic filtering / TopK-related plans by ensuring optimization runs after `optimizePrewhere`.
- **Analyzer performance regression on `ARRAY JOIN` with implicitly nested columns** — [Issue #91855](https://github.com/ClickHouse/ClickHouse/issues/91855) was closed, signaling progress on an analyzer-related regression where analyzed queries were dramatically slower than legacy behavior.

### SQL compatibility progress
- **Support `SOME` as alias for `ANY`** — [Issue #99601](https://github.com/ClickHouse/ClickHouse/issues/99601) was closed. This is a small but meaningful SQL compatibility improvement that reduces friction with external SQL tools and user-written portable SQL.

### Storage / table-format correctness
- **Iceberg ALTER crash fix path** — [Issue #99523](https://github.com/ClickHouse/ClickHouse/issues/99523) was closed after a server crash caused by `ALTER TABLE ... MODIFY COLUMN COMMENT` on Iceberg-backed tables. Related backport activity is visible in [PR #99406](https://github.com/ClickHouse/ClickHouse/pull/99406), which cherry-picks a critical Iceberg crash fix for 25.3.
- **Patch parts column order mismatch** — [PR #99164](https://github.com/ClickHouse/ClickHouse/pull/99164) was closed. This addressed a `LOGICAL_ERROR` tied to patch parts and has already triggered backport automation via [PR #99991](https://github.com/ClickHouse/ClickHouse/pull/99991), showing maintainers treat it as operationally important.
- **Kafka + dependent materialized view deduplication issue** — [Issue #83995](https://github.com/ClickHouse/ClickHouse/issues/83995) was closed, indicating progress in the interaction between `StorageKafka` and deduplication settings for dependent MVs.

### Build / CI / maintainability progress
- **Coverage pipeline overhaul** — [PR #99513](https://github.com/ClickHouse/ClickHouse/pull/99513) modernizes per-test coverage collection by replacing sanitizer-coverage machinery with LLVM source-based coverage, reducing build complexity and artifact burden.
- **Sanitizer job consolidation** — [PR #99657](https://github.com/ClickHouse/ClickHouse/pull/99657) proposes combining ASan and UBSan builds, another sign of active CI cost/performance tuning.
- **Code-size reduction work** — [Issue #99792](https://github.com/ClickHouse/ClickHouse/issues/99792) was closed around reducing code bloat in type-dispatch templates, which should help compile-time and binary-size pressure.

## 3) Community Hot Topics

These were the most visible and discussion-heavy items today.

### 1. Hacker News public dataset documentation
- [Issue #29693](https://github.com/ClickHouse/ClickHouse/issues/29693) — **45 comments**
- Long-lived documentation/dataset request around publishing a Hacker News dataset workflow.
- **Underlying need:** users still value curated, reproducible public datasets for demos, benchmarking, onboarding, and showcasing ClickHouse’s ingestion/query strengths. This is less about engine internals and more about ecosystem adoption and education.

### 2. CI crash: transaction log finalize failure during commit
- [Issue #85468](https://github.com/ClickHouse/ClickHouse/issues/85468) — **24 comments**
- Recurrent CI-discovered crash in transaction commit finalization.
- **Underlying need:** stronger transactional and metadata-path robustness, especially as ClickHouse continues expanding mutable/transactional semantics in MergeTree-adjacent workflows.

### 3. Analyzer type-system correctness
- [Issue #61783](https://github.com/ClickHouse/ClickHouse/issues/61783) — **12 comments**
- `ignore()` returning unexpected non-nullable type led to a logical error.
- **Underlying need:** the analyzer still has tail-risk in expression typing and nullability propagation. Users need planner correctness to match ClickHouse’s growing SQL surface.

### 4. Fresh CI crash: double deletion of `MergeTreeDataPartCompact`
- [Issue #99830](https://github.com/ClickHouse/ClickHouse/issues/99830) — **8 comments**
- New high-signal crash report involving compact parts.
- **Underlying need:** memory ownership and lifecycle safety in MergeTree part management remains an active risk area.

### 5. StorageKafka + MV deduplication behavior
- [Issue #83995](https://github.com/ClickHouse/ClickHouse/issues/83995) — **6 comments**, **4 👍**
- Real user-facing issue rather than pure CI noise.
- **Underlying need:** production users want reliable composition of ingestion engines, deduplication, and dependent MVs without hidden state-machine or token-stage failures.

### 6. New RFC: Streaming Queries
- [Issue #99868](https://github.com/ClickHouse/ClickHouse/issues/99868) — **4 comments**
- Proposes a streaming-query model inspired by Flink/RisingWave.
- **Underlying need:** sustained interest in making ClickHouse more suitable for continuous/event-time processing, not just batch analytics and materialized-view-style incremental processing.

## 4) Bugs & Stability

Below are the most important active bug and stability signals, ranked roughly by severity.

### Critical / high severity

1. **Double deletion of `MergeTreeDataPartCompact`**
   - [Issue #99830](https://github.com/ClickHouse/ClickHouse/issues/99830)
   - New CI crash; likely memory-lifetime / ownership corruption in storage part handling.
   - Related signal: [Issue #99799](https://github.com/ClickHouse/ClickHouse/issues/99799) reports similar double deletion in `multi_index`.
   - **Fix PR:** none explicitly listed in today’s data.

2. **Transaction log finalize failed during commit**
   - [Issue #85468](https://github.com/ClickHouse/ClickHouse/issues/85468)
   - Commit-path crash implies potential corruption or termination in transactional flows.
   - **Fix PR:** not visible in provided data.

3. **Iceberg ALTER-related server crashes**
   - [Issue #99523](https://github.com/ClickHouse/ClickHouse/issues/99523) — closed
   - Related backport: [PR #99406](https://github.com/ClickHouse/ClickHouse/pull/99406)
   - Even though closed, this remains notable because Iceberg integration is strategically important and crash-class bugs here directly affect adoption.

4. **Patch parts column-order mismatch causing `LOGICAL_ERROR`**
   - [PR #99164](https://github.com/ClickHouse/ClickHouse/pull/99164) — closed
   - Backport queued in [PR #99991](https://github.com/ClickHouse/ClickHouse/pull/99991)
   - Indicates production-relevant storage mutation/path correctness issue.

### Medium severity

5. **`clickhouse-client` hangs on exit without `SELECT ON *.*`**
   - [Issue #99694](https://github.com/ClickHouse/ClickHouse/issues/99694)
   - Client usability regression tied to metadata lock / suggestion thread behavior.
   - High user pain because it affects interactive sessions and privilege-scoped deployments.
   - **Fix PR:** not shown.

6. **Npy parser infinite loop on negative shape dimension**
   - [Issue #99585](https://github.com/ClickHouse/ClickHouse/issues/99585)
   - Crafted input can lead to effectively unbounded looping due to signed-to-unsigned wraparound.
   - Important for robustness/security hardening of file-format parsers.
   - Related hardening work: [PR #99822](https://github.com/ClickHouse/ClickHouse/pull/99822) improves classification of malformed-input deserialization paths.

7. **Parquet reader issues**
   - [Issue #93093](https://github.com/ClickHouse/ClickHouse/issues/93093) — parquet reader v3 timestamp decoding issue
   - [Issue #99019](https://github.com/ClickHouse/ClickHouse/issues/99019) — Parquet file read error in v26.2.4.23
   - Persistent format interoperability remains a meaningful stability area for data lake use cases.
   - Related format advancement: [PR #99521](https://github.com/ClickHouse/ClickHouse/pull/99521) adds Arrow/Parquet UUID support.

8. **Query correctness inconsistency in direct WHERE vs subquery**
   - [Issue #99832](https://github.com/ClickHouse/ClickHouse/issues/99832)
   - Semantically equivalent queries produce different outcomes, one failing with `TOO_FEW_ARGUMENTS_FOR_FUNCTION`.
   - Strong sign of planner/analyzer rewriting inconsistency.

### Ongoing fuzzing/sanitizer pressure

9. **Assertion failure and analyzer registration errors**
   - [Issue #99858](https://github.com/ClickHouse/ClickHouse/issues/99858)
   - [Issue #99931](https://github.com/ClickHouse/ClickHouse/issues/99931)
   - [Issue #99725](https://github.com/ClickHouse/ClickHouse/issues/99725)
   - [Issue #99135](https://github.com/ClickHouse/ClickHouse/issues/99135)
   - These are expected in a heavily fuzzed project, but the density suggests ongoing fragility in parser/analyzer/expression internals.

## 5) Feature Requests & Roadmap Signals

Several open items reveal where user demand is clustering.

### Strong roadmap signals

1. **Streaming queries / event-time processing**
   - [Issue #99868](https://github.com/ClickHouse/ClickHouse/issues/99868)
   - This is the biggest architectural roadmap signal in today’s set.
   - If pursued, it would push ClickHouse closer to continuous SQL / streaming database territory.
   - **Prediction:** unlikely in the very next stable version as a finished feature, but likely to continue as RFC/experimental groundwork.

2. **Automatic query optimization on time-partitioned tables**
   - [Issue #99960](https://github.com/ClickHouse/ClickHouse/issues/99960)
   - Requests inference of partition-expression bounds from raw timestamp predicates.
   - This aligns tightly with ClickHouse’s performance story and is very plausible for future optimizer work.
   - **Prediction:** relatively likely to appear as an optimizer enhancement or analyzer rule in an upcoming release.

3. **Statistics-based part pruning**
   - [PR #94140](https://github.com/ClickHouse/ClickHouse/pull/94140)
   - Not user-requested today, but highly relevant roadmap work already underway.
   - **Prediction:** one of the more impactful near-term storage/query-planning improvements if merged.

4. **ReplacingMergeTree automatic cleanup scheduling**
   - [PR #99643](https://github.com/ClickHouse/ClickHouse/pull/99643)
   - Experimental but practical; reduces operational burden for users relying on `FINAL CLEANUP`.
   - **Prediction:** good candidate for experimental rollout soon, especially for self-managed operators.

### SQL compatibility expansion
Open feature requests from the same contributor indicate a sustained push toward broader standards support:
- [Issue #99610](https://github.com/ClickHouse/ClickHouse/issues/99610) — `MATCH` predicate
- [Issue #99609](https://github.com/ClickHouse/ClickHouse/issues/99609) — `UNIQUE(subquery)` predicate
- [Issue #99606](https://github.com/ClickHouse/ClickHouse/issues/99606) — NULL-propagating `concat()` / `||`
- [Issue #99612](https://github.com/ClickHouse/ClickHouse/issues/99612) — richer `SET TIME ZONE` and session characteristics

**Prediction:** among these, **NULL-propagating concat via opt-in setting** looks the most likely short-term candidate because it is bounded, backwards-compatible if gated by a setting, and useful for BI/client compatibility.

### Format and ecosystem features
- [PR #99521](https://github.com/ClickHouse/ClickHouse/pull/99521) — Arrow/Parquet UUID support
- This is a practical interoperability enhancement for modern lakehouse/dataframe pipelines.
- **Prediction:** likely to land relatively soon because the scope is concrete and user benefit is immediate.

## 6) User Feedback Summary

Today’s issue stream highlights several recurring user pain points:

- **Interoperability with external table/file formats remains crucial.**
  Users continue to report issues in **Parquet**, **Arrow**, **Npy**, **Iceberg**, **Kafka**, and **S3/GCS-compatible object storage** workflows. This confirms ClickHouse is being used deeply in heterogeneous data stacks, not just as an isolated OLAP store.

- **Analyzer and optimizer correctness still matter as much as raw speed.**
  Reports like [#61783](https://github.com/ClickHouse/ClickHouse/issues/61783), [#91855](https://github.com/ClickHouse/ClickHouse/issues/91855), and [#99832](https://github.com/ClickHouse/ClickHouse/issues/99832) show users are sensitive to planner regressions, type inference bugs, and semantic inconsistencies.

- **Operational ergonomics are under scrutiny.**
  [Issue #99694](https://github.com/ClickHouse/ClickHouse/issues/99694) shows that even a client exit hang can become a serious usability problem in restricted-access environments. Similarly, requests like [#99960](https://github.com/ClickHouse/ClickHouse/issues/99960) and [PR #99643](https://github.com/ClickHouse/ClickHouse/pull/99643) ask ClickHouse to reduce manual tuning and maintenance overhead.

- **Security and isolation expectations are rising.**
  [PR #99720](https://github.com/ClickHouse/ClickHouse/pull/99720) addresses a MySQL dictionary source path bypassing `RemoteHostFilter`, effectively an SSRF-style risk. This suggests users increasingly rely on ClickHouse in multi-tenant or security-sensitive environments.

Overall, user sentiment appears to be: **ClickHouse is powerful and broadly adopted, but users want more predictable correctness, safer defaults, and smoother compatibility with surrounding ecosystems.**

## 7) Backlog Watch

These older or strategically important items look worthy of maintainer attention.

1. **Hacker News Dataset**
   - [Issue #29693](https://github.com/ClickHouse/ClickHouse/issues/29693)
   - Very old, still active, high comment count.
   - While not a core engine blocker, it is a visible community/documentation artifact and could be closed decisively with docs or repository guidance.

2. **Analyzer logical error with `ignore()` nullability**
   - [Issue #61783](https://github.com/ClickHouse/ClickHouse/issues/61783)
   - Open since 2024 despite being marked `st-fixed`; deserves closure or confirmation if resolved.

3. **GCS/S3 + `Content-Encoding: gzip` regression**
   - [Issue #47980](https://github.com/ClickHouse/ClickHouse/issues/47980)
   - Long-lived object-storage compatibility issue affecting cloud-style ingestion patterns.
   - Important because object storage is foundational in lakehouse deployments.

4. **Parquet reader v3 timestamp decode failures**
   - [Issue #93093](https://github.com/ClickHouse/ClickHouse/issues/93093)
   - Older but strategically important for Parquet v3 adoption.

5. **Statistics-based part pruning**
   - [PR #94140](https://github.com/ClickHouse/ClickHouse/pull/94140)
   - Long-running feature PR with potentially high impact on query efficiency.
   - If technically sound, it could materially improve scan reduction and should merit sustained review.

6. **Distinct optimization improvement**
   - [PR #97113](https://github.com/ClickHouse/ClickHouse/pull/97113)
   - Performance-focused, older, and relevant to common workloads; another candidate for reviewer focus.

## 8) Overall Health Assessment

ClickHouse shows **excellent development velocity** and a healthy flow of fixes, backports, and new capabilities. The strongest positive signals today are continued work on **optimizer sophistication**, **format interoperability**, and **operational observability** such as skip-index usage logging. The main caution flags are the **volume of CI/fuzzer crash reports**, particularly in MergeTree internals and analyzer/type logic, which imply the codebase is evolving quickly enough that stabilization pressure remains high. In short: **project momentum is strong, but near-term quality work is still just as important as feature delivery.**

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-19

## 1. Today's Overview

DuckDB showed very high repository activity over the last 24 hours: **126 issues updated** and **80 PRs updated**, with **32 issues closed** and **31 PRs merged/closed**. That level of churn suggests an actively maintained project with strong maintainer and community engagement, even though **no new release** was published today. The current issue mix continues to reflect DuckDB’s core user base: heavy analytical workloads, file-based lakehouse querying, SQL semantics edge cases, and cross-platform embedding concerns. A notable theme today is **stability and correctness under edge conditions**—especially around partition pruning, type semantics, constraints/collations, Unicode handling, and memory behavior when reading Parquet.

## 2. Project Progress

While the dataset does not list the exact merged PRs, the set of recently updated and recently closed items shows where development effort is concentrated:

- **Cross-platform shell/runtime compatibility** is advancing via **“Shell: use Unicode entry point on Windows”** ([PR #21472](https://github.com/duckdb/duckdb/pull/21472)), which directly addresses Windows Unicode path/CLI invocation issues that also appear in active issue reports.
- **Optimizer and execution improvements** remain active:
  - **arg_min/arg_max struct pruning for unnest** ([PR #20245](https://github.com/duckdb/duckdb/pull/20245)) targets reduced materialization of wide structs.
  - **OR predicate pushdown over nested AND expressions** ([PR #20338](https://github.com/duckdb/duckdb/pull/20338)) would improve filter pushdown for more realistic range-union predicates.
  - **Support cardinality estimation for range** ([PR #18818](https://github.com/duckdb/duckdb/pull/18818)) signals continuing work on planner quality for analytical queries.
- **Extension and external scan APIs** are still an area of investment:
  - **C APIs for accessing filter pushdown and filter prune** ([PR #14591](https://github.com/duckdb/duckdb/pull/14591))
  - **Pushdown IsNull/IsNotNull as TableFilters** ([PR #19877](https://github.com/duckdb/duckdb/pull/19877))
  These are especially relevant for connector authors and external table-function implementations.
- **Storage and metadata internals** are being refined through:
  - **Unify StorageVersion and SerializationVersion** ([PR #20288](https://github.com/duckdb/duckdb/pull/20288))
  - **Proper WAL replay error handling instead of assertion crash** ([PR #20194](https://github.com/duckdb/duckdb/pull/20194))
- Recently closed issues indicate some bugfix throughput on:
  - enum handling internals ([Issue #14728](https://github.com/duckdb/duckdb/issues/14728))
  - encrypted attach/network hang behavior ([Issue #20797](https://github.com/duckdb/duckdb/issues/20797))
  - pyarrow dataset column over-fetching in COUNT queries ([Issue #14718](https://github.com/duckdb/duckdb/issues/14718))

Overall, project progress today appears strongest in **query planning/pushdown**, **platform correctness**, and **hardening of storage/runtime edge cases**.

## 3. Community Hot Topics

### 1) Hive partition pruning regression on S3
- **Issue:** [#21347 Hive partition filters discover all files before pruning in 1.5.0](https://github.com/duckdb/duckdb/issues/21347)
- **Status:** Open, under review
- **Why it matters:** This is probably the most strategically important active report today. Users querying hive-partitioned Parquet on object storage expect DuckDB to prune partitions **before** expensive file listing and scanning. The report suggests a regression from 1.4.4 to 1.5.0.
- **Underlying technical need:** Better partition-aware planning at file discovery time, especially for cloud object stores where listing itself is costly and latency-heavy.
- **Impact:** High for data lake/lakehouse workloads and cloud-native analytics.

### 2) Parquet memory pressure / OOM behavior
- **Issue:** [#16078 Out of memory error when reading from parquet files](https://github.com/duckdb/duckdb/issues/16078)
- **Status:** Open, under review, stale
- **Why it matters:** The report contrasts successful reads from native DuckDB storage with failures from Parquet under similar memory limits.
- **Underlying technical need:** More predictable buffering, decompression, and string-column memory accounting for external file scans.
- **Impact:** High for users running near memory ceilings or embedding DuckDB in constrained environments.

### 3) List/null semantics inconsistency
- **Issue:** [#14692 `list_concat([1], null)` doesn't match `[1] || null`](https://github.com/duckdb/duckdb/issues/14692)
- **Status:** Open, reproduced
- **Why it matters:** This is a SQL semantics and type-system consistency issue. Users expect function/operator equivalence or at least clearly documented divergence.
- **Underlying technical need:** Harmonization of operator/function semantics and null propagation rules for nested/list types.
- **Impact:** Medium, but important for SQL predictability.

### 4) Numeric correctness with UHUGEINT
- **Issue:** [#14580 Silent numerical errors using UHUGEINT](https://github.com/duckdb/duckdb/issues/14580)
- **Status:** Open, reproduced, stale
- **Why it matters:** Silent wrong answers are among the most serious classes of defects in analytical systems.
- **Underlying technical need:** Correct overflow/precision semantics and test coverage for high-precision integer arithmetic.
- **Impact:** Very high severity, even if niche in frequency.

### 5) Large S3 multipart upload correctness with gzip
- **Issue:** [#14877 S3 (COS) multipart upload neither (over)write the file or closes the file handle when using gzip compression](https://github.com/duckdb/duckdb/issues/14877)
- **Status:** Open, under review, stale
- **Why it matters:** This blends cloud object store support with output pipeline correctness.
- **Underlying technical need:** Reliable multipart finalization and temporary-file handling in compressed export paths.
- **Impact:** High for ETL/export users targeting S3-compatible systems.

### 6) Windows/Unicode command-line behavior
- **Issue:** [#21445 Invalid unicode with Chinese characters when use 'duckdb -c' command](https://github.com/duckdb/duckdb/issues/21445)
- **PR:** [#21472 Shell: use Unicode entry point on Windows](https://github.com/duckdb/duckdb/pull/21472)
- **Why it matters:** This is a clear example of issue-to-fix pipeline. It affects non-ASCII file paths, a major usability concern in international environments.
- **Underlying technical need:** Proper wide-character entrypoint and path handling on Windows shells.

## 4. Bugs & Stability

Ranked by likely severity and breadth of user impact:

### Critical / correctness

1. **Silent numerical errors using UHUGEINT**
   - [Issue #14580](https://github.com/duckdb/duckdb/issues/14580)
   - Severity: **Critical**
   - Reason: Silent wrong results in arithmetic are more dangerous than explicit failures.
   - Fix PR: None visible in provided data.

2. **UNIQUE constraint ignores collation semantics**
   - [Issue #19675](https://github.com/duckdb/duckdb/issues/19675)
   - Severity: **Critical**
   - Reason: Constraint enforcement that does not respect collation can corrupt application-level assumptions about key uniqueness.
   - Fix PR: None visible.

3. **Non-deterministic behavior in deterministic array_agg workload**
   - [Issue #14755](https://github.com/duckdb/duckdb/issues/14755)
   - Status: Closed
   - Severity: **High**
   - Reason: Non-deterministic aggregates undermine reproducibility in analytics; closure is a positive stability sign.

### High / crash / internal errors

4. **OOM when reading Parquet under expected memory limit**
   - [Issue #16078](https://github.com/duckdb/duckdb/issues/16078)
   - Severity: **High**
   - Reason: Blocks production data processing; likely tied to external scan memory management.

5. **free(): corrupted unsorted chunks during Python insert in transaction**
   - [Issue #15674](https://github.com/duckdb/duckdb/issues/15674)
   - Severity: **High**
   - Reason: Heap corruption symptoms imply a native crash-class defect, even though repro quality is still incomplete.

6. **INTERNAL Error: attempted to access index 0 within vector of size 0**
   - [Issue #14491](https://github.com/duckdb/duckdb/issues/14491)
   - Severity: **High**
   - Reason: Internal errors in common filtered SELECT paths indicate planner/executor edge-case instability.

7. **ENUM value access internal error**
   - [Issue #14728](https://github.com/duckdb/duckdb/issues/14728)
   - Status: Closed
   - Severity: **Medium-High**
   - Reason: Extension/table-function API stability issue; closure suggests progress in extensibility robustness.

8. **ATTACH hangs with ENCRYPTION_KEY when network unavailable**
   - [Issue #20797](https://github.com/duckdb/duckdb/issues/20797)
   - Status: Closed
   - Severity: **Medium-High**
   - Reason: Hanging behavior is operationally serious; closure is another positive signal.

### Medium / regression / interoperability

9. **Hive partition pruning regression in 1.5.0**
   - [Issue #21347](https://github.com/duckdb/duckdb/issues/21347)
   - Severity: **High**
   - Reason: Performance regression with cloud files can make workloads effectively unusable at scale.

10. **Unicode/CLI regression on Windows with Chinese paths**
    - [Issue #21445](https://github.com/duckdb/duckdb/issues/21445)
    - Related fix: [PR #21472](https://github.com/duckdb/duckdb/pull/21472)
    - Severity: **Medium**
    - Reason: Broad usability issue, likely platform-specific and fixable.

11. **Inconsistent duplicate-name handling in nested JSON**
    - [Issue #15837](https://github.com/duckdb/duckdb/issues/15837)
    - Severity: **Medium**
    - Reason: JSON ingestion consistency issue affecting semi-structured pipelines.

12. **STDDEV doesn’t support inf/-inf/NaN**
    - [Issue #15520](https://github.com/duckdb/duckdb/issues/15520)
    - Severity: **Medium**
    - Reason: Analytical edge-case compatibility gap with numeric special values.

## 5. Feature Requests & Roadmap Signals

Several open PRs and requests suggest where DuckDB may evolve next:

### Likely roadmap-adjacent themes

- **Richer pushdown APIs for extensions and connectors**
  - [PR #14591](https://github.com/duckdb/duckdb/pull/14591)
  - [PR #19877](https://github.com/duckdb/duckdb/pull/19877)
  - Prediction: Strong chance of incremental adoption in an upcoming release because these improve extensibility without radically changing SQL surface area.

- **Planner/selectivity improvements**
  - [PR #18818 Support cardinality estimation for range](https://github.com/duckdb/duckdb/pull/18818)
  - Prediction: Possible but not guaranteed for next release; optimizer work often takes longer due to regression risk.

- **More aggressive predicate pushdown**
  - [PR #20338 Extend OR predicate pushdown to support nested AND expressions](https://github.com/duckdb/duckdb/pull/20338)
  - Prediction: Good candidate if maintainers are satisfied with correctness/perf tradeoffs.

- **Physical table reordering / CLUSTER support**
  - [PR #19696 Add support for `CLUSTER <tbl> ORDER BY <expr>`](https://github.com/duckdb/duckdb/pull/19696)
  - Prediction: Less likely in the immediate next version because it touches storage semantics and likely needs substantial review.

- **SQL compatibility / parser enhancements**
  - [PR #18722 support LIKE/ILIKE ANY over array literals](https://github.com/duckdb/duckdb/pull/18722)
  - [PR #18495 Extensible keywords](https://github.com/duckdb/duckdb/pull/18495)
  - Prediction: Parser-level compatibility improvements are plausible, though both appear review-blocked.

- **CLI support for encrypted databases**
  - [PR #20271 Add encryption CLI arguments](https://github.com/duckdb/duckdb/pull/20271)
  - Prediction: Reasonably likely eventually, but probably gated by UX/security review.

- **New analytical function surface**
  - [PR #20309 Add Function max_intersections](https://github.com/duckdb/duckdb/pull/20309)
  - Prediction: Nice-to-have, but less likely than engine/platform fixes.

### User-requested behavior/documentation improvements

- Preserve dependent view creation order on export/import:
  - [Issue #15353](https://github.com/duckdb/duckdb/issues/15353)
- Clarify or preserve order for `ARRAY` operator:
  - [Issue #15011](https://github.com/duckdb/duckdb/issues/15011)
- Better documentation around sampling volatility:
  - [Issue #15269](https://github.com/duckdb/duckdb/issues/15269)

These are good candidates for **documentation or semantics clarifications** in the near term.

## 6. User Feedback Summary

Today’s issue set reflects several recurring real-world usage patterns:

- **Cloud/lakehouse analytics users** are sensitive to file discovery and partition pruning regressions:
  - [#21347](https://github.com/duckdb/duckdb/issues/21347)
  - [#7491](https://github.com/duckdb/duckdb/issues/7491) (closed historical/related behavior)
- **Parquet-heavy pipelines** remain a core workload, but users still hit memory unpredictability and performance variance:
  - [#16078](https://github.com/duckdb/duckdb/issues/16078)
  - [#15332](https://github.com/duckdb/duckdb/issues/15332)
- **Embedded/app developers** care about export/import reliability, transactions, WAL handling, and multi-connection semantics:
  - [#14562](https://github.com/duckdb/duckdb/issues/14562)
  - [#15662](https://github.com/duckdb/duckdb/issues/15662)
  - [PR #20194](https://github.com/duckdb/duckdb/pull/20194)
- **Windows and international users** continue to surface Unicode/path issues:
  - [#21445](https://github.com/duckdb/duckdb/issues/21445)
  - [#14617](https://github.com/duckdb/duckdb/issues/14617) (closed)
  - [PR #21472](https://github.com/duckdb/duckdb/pull/21472)
- **Advanced SQL users** are probing edge semantics around arrays, lists, aggregates, collations, and sampling:
  - [#14692](https://github.com/duckdb/duckdb/issues/14692)
  - [#15011](https://github.com/duckdb/duckdb/issues/15011)
  - [#19675](https://github.com/duckdb/duckdb/issues/19675)
  - [#15269](https://github.com/duckdb/duckdb/issues/15269)

Sentiment is mixed but healthy: users are pushing DuckDB into demanding production-like scenarios, and many reports are detailed and technically substantive. There is also explicit positive feedback in some issues—for example, users saying they “love using DuckDB” even while reporting bugs ([#14562](https://github.com/duckdb/duckdb/issues/14562)).

## 7. Backlog Watch

Important older items that still appear to need maintainer attention:

### Issues

- **[Issue #14580](https://github.com/duckdb/duckdb/issues/14580)** — silent numerical errors with UHUGEINT  
  High-priority correctness bug; should not linger.

- **[Issue #16078](https://github.com/duckdb/duckdb/issues/16078)** — Parquet OOM under 4 GB memory limit  
  Important for production trust in external file scanning.

- **[Issue #14877](https://github.com/duckdb/duckdb/issues/14877)** — S3 multipart upload/gzip finalization problems  
  Important for cloud export workflows.

- **[Issue #14562](https://github.com/duckdb/duckdb/issues/14562)** — import database schema collision with `information_schema`  
  Impacts backup/restore portability.

- **[Issue #15674](https://github.com/duckdb/duckdb/issues/15674)** — allocator corruption during Python inserts  
  Native crash-class bugs deserve renewed triage even if repro is incomplete.

- **[Issue #15353](https://github.com/duckdb/duckdb/issues/15353)** — export/import view dependency ordering  
  Practical migration/portability issue; likely solvable with ordering logic or docs.

### PRs

- **[PR #14591](https://github.com/duckdb/duckdb/pull/14591)** — C APIs for filter pushdown/prune  
  Valuable for ecosystem growth; appears stalled awaiting maintainer approval.

- **[PR #20245](https://github.com/duckdb/duckdb/pull/20245)** — optimize arg_min/max struct pruning for unnest  
  Good performance win candidate; marked ready for review.

- **[PR #20288](https://github.com/duckdb/duckdb/pull/20288)** — unify storage and serialization versions  
  Strategically important internal cleanup.

- **[PR #19696](https://github.com/duckdb/duckdb/pull/19696)** — CLUSTER statement support  
  Significant feature request, but may need clearer roadmap fit.

- **[PR #18495](https://github.com/duckdb/duckdb/pull/18495)** — extensible keywords  
  Important for extension ecosystem flexibility; currently blocked by requested changes.

## Bottom Line

DuckDB remains **very active and operationally healthy**, with strong evidence of maintainer responsiveness and continued community contribution. The most important current pressure points are **correctness edge cases**, **Parquet/cloud scan efficiency**, and **cross-platform Unicode/runtime behavior**. Near-term release signals point more toward **engine hardening, pushdown/planner improvements, and platform fixes** than toward large new end-user features. The project’s challenge is less inactivity than prioritization: a growing backlog of high-quality but aging issues now competes with new regressions surfacing as DuckDB is pushed deeper into cloud, embedded, and internationalized production use.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-19

## 1) Today’s Overview

StarRocks showed **very high development throughput** over the last 24 hours, with **149 PRs updated** and **97 PRs merged/closed**, while issue volume remained modest at **7 updated issues**. The day’s work was concentrated on **query optimizer improvements, Iceberg interoperability, cloud-native storage safety, and materialized view correctness**. Overall project health looks strong from a delivery perspective, but the issue stream highlights continued pressure around **correctness edge cases**, especially in **Iceberg integration, join execution, and external storage access**. No new release was published today, so changes are accumulating in-flight across the 3.5, 4.0, and 4.1 lines.

---

## 2) Project Progress

Today’s merged/closed work suggests progress in several core areas:

### Query planning and metadata correctness
- **Lock-free MV rewrite fallback to live metadata** was actively worked on and one PR iteration was closed/replaced, indicating maintainers are refining a fix rather than abandoning it. This is important for optimizer isolation from concurrent catalog changes.  
  - Closed PR: [#70472](https://github.com/StarRocks/starrocks/pull/70472)  
  - Active replacement: [#70475](https://github.com/StarRocks/starrocks/pull/70475)

### Iceberg compatibility and ecosystem support
- The issue requesting **Iceberg v3 default values support** was closed, pointing to implementation completion through an associated PR. This is a meaningful SQL/catalog compatibility milestone for users integrating newer Iceberg table semantics.  
  - Closed issue: [#69709](https://github.com/StarRocks/starrocks/issues/69709)
- Work continued on **Iceberg MV refresh robustness** for non-monotonic snapshot timestamps, a practical reliability improvement for federated lakehouse environments.  
  - PR: [#70382](https://github.com/StarRocks/starrocks/pull/70382)
- A bugfix is in progress for **OAuth2 token refresh in Iceberg REST Catalog**, addressing long-idle query failures against REST-backed catalogs such as Polaris.  
  - PR: [#70392](https://github.com/StarRocks/starrocks/pull/70392)

### Storage and cloud-native operability
- A cloud-native operability enhancement for **repairing shared-data tables with missing files** was closed, suggesting progress on recovery tooling for single-replica cloud-native storage layouts. This is a notable signal that StarRocks is investing in operational resilience for shared-data deployments.  
  - Closed issue: [#66015](https://github.com/StarRocks/starrocks/issues/66015)
- There is active work to prevent **shared file misdeletion after tablet split**, directly targeting a potentially severe data lifecycle/storage metadata bug.  
  - PR: [#70476](https://github.com/StarRocks/starrocks/pull/70476)

### Query engine and optimizer evolution
- Ongoing optimizer work includes:
  - **common sub-expression reuse during query optimization** for complex CASE/CTE-heavy plans  
    - PR: [#70362](https://github.com/StarRocks/starrocks/pull/70362)
  - **stats propagation for binary `array_map`**  
    - PR: [#70372](https://github.com/StarRocks/starrocks/pull/70372)
  - **multi-column functional dependency support** for better cardinality estimation  
    - PR: [#70453](https://github.com/StarRocks/starrocks/pull/70453)
  - **global lazy materialization enabled by default**  
    - PR: [#70412](https://github.com/StarRocks/starrocks/pull/70412)

These are strong signals that the optimizer team is targeting both **plan quality** and **runtime efficiency** for increasingly complex analytical SQL.

---

## 3) Community Hot Topics

Below are the most notable active items based on comments, visibility, and technical significance.

### 1. Iceberg partition null handling bug
- Issue: [#63029](https://github.com/StarRocks/starrocks/issues/63029)  
- Status: Open  
- Comments: 14

This is the most commented issue in the provided set. The report describes **partition value shifting when nulls are present in Iceberg partitions**, causing table/partition interpretation errors during materialized view ingestion. The underlying need is clear: users expect **lossless semantic mapping of Iceberg metadata into StarRocks**, especially for nullable partition columns. This affects not just correctness, but also confidence in **Iceberg-backed MVs and ingestion pipelines**.

### 2. Queryable replica/version mismatch
- Issue: [#63026](https://github.com/StarRocks/starrocks/issues/63026)  
- Status: Open  
- Comments: 2 | 👍 1

This issue points to a storage/replica state inconsistency where a replica appears NORMAL but is rejected due to **`minReadableVersion` vs `visibleVersion` mismatch**. This reflects a core operational requirement in OLAP systems: users need **replica health semantics that align with actual queryability**. Problems here damage trust in availability and can be difficult for operators to diagnose.

### 3. Adaptive partition hash join correctness/crash risk
- Issue: [#70349](https://github.com/StarRocks/starrocks/issues/70349)  
- Status: Open  
- Comments: 2

A new but highly important correctness issue: **`JoinHashTable::merge_ht()` misses merging expression-based key columns**, potentially leading to **crashes or wrong query results** under adaptive partition hash join. The technical need behind this report is robust support for **non-trivial join expressions**, not just direct column equality, in modern vectorized execution paths.

### 4. CTE materialization and expression explosion
- PR: [#70362](https://github.com/StarRocks/starrocks/pull/70362)  
- Status: Open, WIP
- Related follow-up: [#70481](https://github.com/StarRocks/starrocks/pull/70481)

This pair of PRs reveals a real optimizer pain point: complex CTEs and nested CASE expressions can cause **expression blow-up during optimization**. The response includes both a deeper optimizer improvement and a user-facing **session variable to force CTE materialization**, signaling that users are hitting complexity ceilings in production SQL and need immediate workarounds.

### 5. Parquet UUID / `FIXED_LEN_BYTE_ARRAY` compatibility
- Active PR: [#70479](https://github.com/StarRocks/starrocks/pull/70479)  
- Closed predecessor: [#70226](https://github.com/StarRocks/starrocks/pull/70226)

This is a practical lakehouse interoperability topic. Users with Iceberg/Parquet data containing UUIDs stored as `FIXED_LEN_BYTE_ARRAY` need StarRocks to read those columns cleanly. The need is straightforward: stronger **Parquet physical/logical type compatibility** for modern data lake schemas.

---

## 4) Bugs & Stability

Ranked by likely severity and user impact.

### Critical
#### 1. Join crash / wrong results with adaptive partition hash join
- Issue: [#70349](https://github.com/StarRocks/starrocks/issues/70349)

Potential for **wrong results** is the most severe class of database bug, and this report also mentions possible crashes. It affects joins with **expression-based keys**, which are common in real ETL and BI SQL. No corresponding fix PR is listed in the provided data yet.

#### 2. Segmentation fault querying Parquet on Azure Data Lake Storage
- Issue: [#70478](https://github.com/StarRocks/starrocks/issues/70478)

A direct **segmentation fault** when reading a Parquet file through the `FILES()` interface on ADLS is a severe stability issue, especially for external data exploration and lake access scenarios. No fix PR appears in the provided list yet.

### High
#### 3. Arrow Flight fails when Ranger security is enabled
- Issue: [#70477](https://github.com/StarRocks/starrocks/issues/70477)

This is a significant enterprise integration bug: enabling **Ranger authorization** breaks **Arrow Flight** access. The impact is high for secured deployments using Flight-based interoperability, and it suggests an authz path inconsistency between SQL and Flight services.

#### 4. Iceberg partition null value misalignment
- Issue: [#63029](https://github.com/StarRocks/starrocks/issues/63029)

This is a **data correctness / metadata interpretation** issue, with visible impact on Iceberg MV ingestion. Given the long-running discussion, it likely affects real workloads.

#### 5. No queryable replica found despite NORMAL replicas
- Issue: [#63026](https://github.com/StarRocks/starrocks/issues/63026)

This is an operational reliability problem with user-visible query failures. Even if not a crash, these storage-version edge cases are disruptive in production clusters.

### Notable active fixes in progress
- **Iceberg REST OAuth2 token refresh scheduler**  
  PR: [#70392](https://github.com/StarRocks/starrocks/pull/70392)
- **Lock-free MV rewrite metadata fallback correctness**  
  PR: [#70475](https://github.com/StarRocks/starrocks/pull/70475)
- **Delete tablets misdeleting shared files after split**  
  PR: [#70476](https://github.com/StarRocks/starrocks/pull/70476)
- **Auto partition creation failure during FINISHED_REWRITING schema change**  
  PR: [#70322](https://github.com/StarRocks/starrocks/pull/70322)

These fixes suggest maintainers are actively prioritizing **correctness under concurrency, metadata transitions, and cloud-storage semantics**.

---

## 5) Feature Requests & Roadmap Signals

### Confirmed/implemented signals
#### Iceberg v3 default values
- Issue closed: [#69709](https://github.com/StarRocks/starrocks/issues/69709)

This is a meaningful compatibility feature and a strong signal that StarRocks is continuing to expand **Iceberg v3 support**. Expect this to appear in an upcoming version line, likely 4.2 based on the issue label.

### Strong roadmap signals from active PRs
#### Better optimizer intelligence
- **Multi-column functional dependency**: [#70453](https://github.com/StarRocks/starrocks/pull/70453)  
- **`array_map` stats propagation**: [#70372](https://github.com/StarRocks/starrocks/pull/70372)  
- **CSE reuse in optimization**: [#70362](https://github.com/StarRocks/starrocks/pull/70362)

These indicate an optimizer roadmap focused on **better cardinality estimation, expression handling, and complex-function planning**.

#### More lakehouse file-format compatibility
- **Parquet `FIXED_LEN_BYTE_ARRAY` / UUID support**: [#70479](https://github.com/StarRocks/starrocks/pull/70479)

This looks likely to land soon because there is already a prior closed attempt, suggesting active iteration rather than early exploration.

#### Better Iceberg write/read distribution semantics
- **Iceberg global shuffle based on transform partition**: [#70009](https://github.com/StarRocks/starrocks/pull/70009)

This points to future work in **partition-aware write planning** for Iceberg-integrated workloads.

#### Storage engine compaction improvements
- **Range-split parallel compaction for non-overlapping output**: [#70162](https://github.com/StarRocks/starrocks/pull/70162)

This is a meaningful storage-engine roadmap item. If completed, it could improve compaction parallelism while preserving sorted/non-overlapping output properties—important for read efficiency in analytical storage.

### Likely next-version candidates
Based on recency, branch labels, and implementation maturity, the features/fixes most likely to appear in the next shipping version are:
- Iceberg v3 default values support: [#69709](https://github.com/StarRocks/starrocks/issues/69709)
- Parquet UUID / `FIXED_LEN_BYTE_ARRAY` support: [#70479](https://github.com/StarRocks/starrocks/pull/70479)
- Iceberg REST OAuth2 refresh fix: [#70392](https://github.com/StarRocks/starrocks/pull/70392)
- MV rewrite metadata isolation fix: [#70475](https://github.com/StarRocks/starrocks/pull/70475)

---

## 6) User Feedback Summary

Today’s user feedback highlights several recurring real-world pain points:

### 1. Iceberg interoperability remains a top adoption driver
Users are actively exercising StarRocks against **Iceberg MVs, REST catalogs, v3 table features, nullable partitions, and Parquet UUID encodings**. This is a positive sign: StarRocks is clearly being used as a serious **lakehouse query engine**, but it also means integration correctness is under constant scrutiny.

### 2. Enterprise deployments need consistent security across interfaces
The Arrow Flight + Ranger issue shows that users expect **feature parity under security controls**, not just in core SQL paths. Enterprise users increasingly rely on multiple access protocols, and inconsistencies become blockers quickly.

### 3. Complex SQL workloads are pushing optimizer limits
The CTE/materialization work and join-expression correctness issue both suggest users are running **non-trivial analytical SQL**, with nested expressions, CTE-heavy query shapes, and advanced joins. This is a sign of maturity in workload complexity, but also pressure on optimizer robustness.

### 4. Cloud-native reliability matters as much as raw performance
Issues and PRs around **missing files, shared-file deletion safety, replica version visibility, and schema-change interaction with auto partitioning** show users care deeply about **operational correctness under cloud/object-storage architectures**.

Overall, user feedback today is less about “please add basic features” and more about **hardening advanced production use cases**.

---

## 7) Backlog Watch

These items appear to deserve maintainer attention due to age, severity, or production impact.

### Long-lived open issues
#### Iceberg partition null handling bug
- [#63029](https://github.com/StarRocks/starrocks/issues/63029)  
- Created: 2025-09-11  
- Concern: Longstanding correctness issue affecting Iceberg partition semantics and MV ingestion.

#### Queryable replica/version mismatch
- [#63026](https://github.com/StarRocks/starrocks/issues/63026)  
- Created: 2025-09-11  
- Labels include `no-issue-activity`
- Concern: Production query failures plus apparent maintainer inactivity signal possible backlog risk.

### Important open PRs needing review/decision
#### Range-split parallel compaction
- [#70162](https://github.com/StarRocks/starrocks/pull/70162)  
- Concern: Potentially high-value storage optimization, but still in `PROTO-REVIEW`, indicating it may need design bandwidth.

#### Common sub-expression reuse in optimizer
- [#70362](https://github.com/StarRocks/starrocks/pull/70362)  
- Concern: WIP but strategically important for complex SQL planning stability and optimization scalability.

#### Iceberg global shuffle based on transform partition
- [#70009](https://github.com/StarRocks/starrocks/pull/70009)  
- Concern: Valuable for Iceberg write/distribution behavior, but appears to need clearer classification and likely more review.

---

## Overall Health Assessment

StarRocks looks **highly active and forward-moving**, with particularly strong momentum in **optimizer sophistication, Iceberg compatibility, and cloud-native storage correctness**. The main risk area is not lack of activity, but the presence of several **high-severity correctness and stability issues** in advanced execution and external-access paths. If maintainers continue converting these in-flight fixes into releases quickly, project health remains strong; if not, enterprise and lakehouse users may continue to encounter rough edges at the boundaries of StarRocks’ fastest-growing feature areas.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-19

## 1) Today’s Overview

Apache Iceberg saw **solid development activity** over the last 24 hours, with **42 PRs updated** and **13 issues touched**, indicating an actively maintained project with ongoing work across Spark, core metadata handling, REST catalog behavior, test coverage, and build tooling. There were **no new releases**, so today’s signal is mostly about **incremental engineering progress** rather than packaged delivery. The most visible themes are **query-engine correctness in Spark**, **REST catalog semantics**, **snapshot/manifest access modernization**, and **better conformance testing**. Overall project health looks **good but busy**: maintainers are closing stale items while still fielding fresh bugs around partition evolution, stats configuration, and cross-engine consistency.

## 2) Project Progress

### Merged/closed PRs today
There were **10 PRs merged/closed** in the last 24h, though the provided dataset only exposes a subset of them in detail. From the visible closed items:

- **AWS: Add support for configuring custom S3 MetricPublisher** — closed  
  Link: [PR #15122](https://github.com/apache/iceberg/pull/15122)  
  This request centered on exposing lower-level AWS SDK metrics publishing hooks for `S3FileIO`. Its closure suggests either deferral, supersession, or lack of traction, and leaves observability of S3 I/O as an open operational gap for some users.

- **REST: Align expression schema with ExpressionParser** — closed  
  Link: [PR #14677](https://github.com/apache/iceberg/pull/14677)  
  This work targeted better consistency between the REST OpenAPI spec and actual expression serialization. Even though it closed rather than merged, it highlights continued effort around **REST catalog protocol correctness** and **spec/tooling alignment**, which is important for multi-language and external catalog implementations.

### Open progress with high relevance
A number of active PRs signal meaningful forward motion:

- **Spark: add `rest.catalog-purge` property to delegate `DROP TABLE PURGE` to REST catalogs**  
  Link: [PR #15614](https://github.com/apache/iceberg/pull/15614)  
  This is one of the most important current SQL/catalog behavior changes. It improves semantics for Spark against REST catalogs by allowing **server-side purge authority**, reducing unsafe or incomplete client-side deletion behavior.

- **Core/Data/Flink/Kafka/Spark: migrate deprecated Snapshot file-access methods to Snapshot Changes**  
  Link: [PR #15656](https://github.com/apache/iceberg/pull/15656)  
  This is a broad internal modernization effort with likely correctness and maintainability benefits, especially around **manifest access**, **spec resolution**, and compatibility with newer snapshot APIs.

- **Core: Propagate Avro compression settings to manifest writers**  
  Link: [PR #15652](https://github.com/apache/iceberg/pull/15652)  
  This improves storage control for metadata/manifests and may lead to better **metadata footprint** and **compression tuning**, especially relevant at scale.

- **Data: Add TCK tests for metadata columns**  
  Link: [PR #15675](https://github.com/apache/iceberg/pull/15675)  
  Expands cross-format conformance coverage for metadata columns such as `FILE_PATH`, `SPEC_ID`, `ROW_POSITION`, and lineage-related fields.

- **Data: Add TCK tests for ReadBuilder**  
  Link: [PR #15633](https://github.com/apache/iceberg/pull/15633)  
  This strengthens contract-level testing across Avro/Parquet/ORC and should improve API consistency.

Taken together, today’s development points to progress on **SQL/catalog semantics**, **metadata correctness**, and **test-hardening**, more than end-user feature delivery.

## 3) Community Hot Topics

### Most discussed / most active items

- **Whitespace in string partition values causes Spark to return empty DataFrames and inconsistent results across engines**  
  Link: [Issue #15427](https://github.com/apache/iceberg/issues/15427)  
  Status: Closed | Comments: 10  
  This issue touches a core Iceberg promise: **cross-engine consistency**. The bug report suggests partition values with leading/trailing whitespace can behave differently in Spark versus other engines, exposing edge-case fragility in partition filtering and normalization.

- **Delegate `delete` to JUnit**  
  Link: [Issue #13506](https://github.com/apache/iceberg/issues/13506)  
  Status: Open | Comments: 8  
  Not user-facing, but an indicator of maintainers’ focus on **test hygiene** and reducing brittle cleanup logic in Java tests.

- **Add `Idempotency-Key` to iceberg REST mutation endpoints**  
  Link: [Issue #13867](https://github.com/apache/iceberg/issues/13867)  
  Status: Closed | Comments: 8  
  This reflects growing demand for **production-grade REST catalog semantics**, especially for retries, network timeouts, and preventing duplicate side effects.

- **Kafka connect S3tables support**  
  Link: [Issue #15425](https://github.com/apache/iceberg/issues/15425)  
  Status: Open | Comments: 6  
  A strong signal that users want **Kafka Connect + REST catalog + S3 Tables** to work smoothly, including credential vending and cloud-native deployment patterns.

- **Cannot migrate a bucketed table with Spark**  
  Link: [Issue #13869](https://github.com/apache/iceberg/issues/13869)  
  Status: Closed | Comments: 6  
  Migration compatibility remains a practical concern, especially when Spark’s V1 partition metadata includes bucket transforms in ways Iceberg migration paths may not accept.

### What these topics mean
The technical needs behind today’s most active threads are clear:

1. **Better edge-case correctness in partition handling**
2. **Stronger REST catalog transactional semantics**
3. **Smoother connector/cloud integrations**
4. **Safer migrations from legacy Spark/Hive table layouts**
5. **More robust automated test coverage**

These are all signs of a project maturing deeper into production adoption, where operational correctness matters as much as raw feature breadth.

## 4) Bugs & Stability

Ranked by likely severity/impact:

### High severity

1. **SPJ broken after partition evolution in Iceberg 1.10.0**  
   Link: [Issue #15610](https://github.com/apache/iceberg/issues/15610)  
   Status: Open  
   This appears to be a **query planning/correctness regression in Spark** affecting **storage-partitioned joins during `MERGE INTO`** after partition evolution. Since partition evolution is a flagship Iceberg feature, any breakage here is significant for production ETL/CDC pipelines.  
   Related fix PR: none explicitly linked in provided data.

2. **Whitespace in partition values causing empty Spark DataFrames / inconsistent cross-engine results**  
   Link: [Issue #15427](https://github.com/apache/iceberg/issues/15427)  
   Status: Closed  
   This was a serious correctness issue because it could produce **empty query results unexpectedly**. Closure is positive, though without the closing PR details it is unclear whether the resolution was code, documentation, or support guidance.

### Medium severity

3. **Disabling statistics across multiple columns does not work as expected**  
   Link: [Issue #15347](https://github.com/apache/iceberg/issues/15347)  
   Status: Open  
   This affects write-time Parquet stats configuration and could lead to **unexpected metadata generation**, potentially impacting file size, pruning behavior, or compliance-sensitive workloads. It’s labeled **good first issue**, which may help resolution velocity.

4. **`PropertyUtil.propertiesWithPrefix` treats prefix as regex pattern**  
   Link: [Issue #15631](https://github.com/apache/iceberg/issues/15631)  
   Status: Closed  
   A classic correctness bug in utility code. Depending on call sites, this could cause subtle configuration parsing errors when prefixes include regex-significant characters. Closure suggests fast maintainer responsiveness.

5. **Estimated table size is inaccurate**  
   Link: [Issue #15664](https://github.com/apache/iceberg/issues/15664)  
   Status: Open  
   This looks more like a modeling/heuristic limitation than a hard bug, but it matters for **planning**, **capacity estimation**, and potentially optimizer decisions.

### Lower severity / documentation-product gap

6. **Arrow to Iceberg type mapping documentation request**  
   Link: [Issue #15666](https://github.com/apache/iceberg/issues/15666)  
   Status: Open  
   More of a usability/documentation gap, but a recurring one for Python/Arrow ecosystem users.

### Stability-positive signals from PRs

- **RESTTableScan snapshot schema/projection fix**  
  Link: [PR #15609](https://github.com/apache/iceberg/pull/15609)  
  This looks like a direct correctness improvement in REST scanning logic.

- **Migration off deprecated Snapshot file-access methods**  
  Link: [PR #15656](https://github.com/apache/iceberg/pull/15656)  
  Likely reduces future breakage and hidden metadata/spec mismatches.

## 5) Feature Requests & Roadmap Signals

### Strong feature signals from issues

- **Add `write.parquet.page-version` table property**  
  Link: [Issue #15677](https://github.com/apache/iceberg/issues/15677)  
  Users want direct control over **Parquet DataPage V1 vs V2**, suggesting advanced performance/compatibility tuning needs. This is the kind of narrowly scoped feature that has a good chance of landing in a near-term release.

- **Arrow ↔ Iceberg type mapping docs**  
  Link: [Issue #15666](https://github.com/apache/iceberg/issues/15666)  
  Strong signal of expanding interest in **PyIceberg / Arrow interoperability** and more self-service docs for schema translation.

- **Kafka Connect S3 Tables support**  
  Link: [Issue #15425](https://github.com/apache/iceberg/issues/15425)  
  Suggests a roadmap pull toward **managed cloud table services**, **credential vending**, and better end-to-end connector examples.

- **Remove Spark 3.4 in Iceberg 1.12**  
  Link: [Issue #14121](https://github.com/apache/iceberg/issues/14121)  
  This is a clear roadmap marker: maintainers are signaling **platform deprecation and cleanup** around Spark version support.

### Strong feature signals from PRs

- **REST catalog purge delegation for Spark**  
  Link: [PR #15614](https://github.com/apache/iceberg/pull/15614)  
  Likely candidate for an upcoming release because it closes concrete correctness/ownership gaps in catalog deletion semantics.

- **REST spec: add function endpoints to OpenAPI spec**  
  Link: [PR #15180](https://github.com/apache/iceberg/pull/15180)  
  Suggests the REST catalog API is expanding beyond tables/namespaces toward **function discovery/load semantics**.

- **Encryption for REST catalog**  
  Link: [PR #13225](https://github.com/apache/iceberg/pull/13225)  
  A major strategic feature if merged, especially for enterprise deployments needing **catalog-level encryption support**.

- **Catalogs: unique table locations via catalog property**  
  Link: [PR #12892](https://github.com/apache/iceberg/pull/12892)  
  Important for **rename-safe storage layout** and avoiding path collisions; long-lived but still relevant.

- **Kafka Connect artifact publish to release process**  
  Link: [PR #15212](https://github.com/apache/iceberg/pull/15212)  
  Strong usability signal: users want official distributable connector artifacts, not just source builds.

### Likely next-version candidates
Most likely near-term deliverables based on scope and maturity:

1. [PR #15614](https://github.com/apache/iceberg/pull/15614) — Spark/REST purge semantics  
2. [PR #15652](https://github.com/apache/iceberg/pull/15652) — manifest compression settings  
3. [PR #15609](https://github.com/apache/iceberg/pull/15609) — RESTTableScan correctness  
4. [Issue #15677](https://github.com/apache/iceberg/issues/15677) — Parquet page-version property, if someone contributes implementation  
5. [PR #15675](https://github.com/apache/iceberg/pull/15675) and [PR #15633](https://github.com/apache/iceberg/pull/15633) — TCK/test improvements

## 6) User Feedback Summary

Today’s user feedback highlights several recurring pain points:

- **Cross-engine consistency still matters deeply.**  
  The whitespace partition bug ([#15427](https://github.com/apache/iceberg/issues/15427)) shows that users expect identical partition filter behavior across Spark and other engines, and notice quickly when that contract breaks.

- **Spark remains the highest-friction engine surface.**  
  Issues on **SPJ after partition evolution** ([#15610](https://github.com/apache/iceberg/issues/15610)), **migration of bucketed tables** ([#13869](https://github.com/apache/iceberg/issues/13869)), and **estimated table size accuracy** ([#15664](https://github.com/apache/iceberg/issues/15664)) all point to Spark integration being powerful but operationally nuanced.

- **Cloud-native connector scenarios need polish.**  
  The S3 Tables + Kafka Connect question ([#15425](https://github.com/apache/iceberg/issues/15425)) suggests users want more turnkey patterns for **managed object storage + REST catalogs + connector runtimes**.

- **Advanced users want finer-grained storage controls.**  
  Requests around **Parquet page versions** ([#15677](https://github.com/apache/iceberg/issues/15677)) and **column-level stats disabling** ([#15347](https://github.com/apache/iceberg/issues/15347)) show a sophisticated operator base optimizing around file format internals.

- **Documentation and API contracts are under pressure from ecosystem growth.**  
  Arrow type mapping ([#15666](https://github.com/apache/iceberg/issues/15666)) and OpenAPI/function endpoint work ([#15180](https://github.com/apache/iceberg/pull/15180)) both reflect broader adoption beyond the original Java/Spark center.

## 7) Backlog Watch

Longer-lived items that appear important and may need maintainer attention:

- **Kafka Connect: Add mechanisms for routing records by topic name**  
  Link: [PR #11623](https://github.com/apache/iceberg/pull/11623)  
  Open since 2024-11-22  
  This is a long-running connector enhancement and likely important for real-world multi-topic ingestion topologies.

- **Catalogs: Add support for unique table locations via catalog property**  
  Link: [PR #12892](https://github.com/apache/iceberg/pull/12892)  
  Open since 2025-04-24  
  Strategic for safe table location generation and rename workflows; notable that it remains open.

- **Encryption for REST catalog**  
  Link: [PR #13225](https://github.com/apache/iceberg/pull/13225)  
  Open since 2025-06-03  
  Potentially high-value enterprise capability, but long-lived PR status suggests complexity or review bottlenecks.

- **Remove Spark 3.4 in Iceberg 1.12 release**  
  Link: [Issue #14121](https://github.com/apache/iceberg/issues/14121)  
  Open since 2025-09-19  
  Important release-management cleanup item; stale but strategically relevant.

- **API: Use unsigned byte-wise comparison to fix UUID comparison bug**  
  Link: [PR #14500](https://github.com/apache/iceberg/pull/14500)  
  Open since 2025-11-04  
  This appears correctness-sensitive, especially for ordering and filtering semantics involving UUIDs.

- **Add Kafka Connect artifact publish to release process**  
  Link: [PR #15212](https://github.com/apache/iceberg/pull/15212)  
  Open since 2026-02-01  
  Could materially improve user adoption by lowering deployment friction.

- **Core: Add delete deduplication optimization for equality deletes in CDC scenarios**  
  Link: [PR #15337](https://github.com/apache/iceberg/pull/15337)  
  Open, marked stale  
  This has clear practical value for **high-frequency CDC workloads**, especially with Flink.

## Overall Assessment

Apache Iceberg remains **healthy and highly active**, with today’s work centered on **correctness, catalog semantics, metadata handling, and conformance testing** rather than releases. The community’s strongest signals come from **Spark behavior under advanced table evolution**, **REST catalog production hardening**, and **connector/cloud integration friction**. Near-term project momentum appears strongest around **Spark + REST improvements**, **snapshot/manifest API modernization**, and **test coverage expansion**, while several strategically important longer-lived PRs still need review bandwidth.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-19

## 1. Today's Overview

Delta Lake showed **moderate-to-high PR activity** over the last 24 hours, with **21 pull requests updated** and **4 PRs merged/closed**, while **no issues were updated** and **no new releases** were published. The current development pattern is strongly centered on **Spark/DSv2 integration, Kernel enablement, transaction semantics, and correctness/stability fixes**, rather than on outward-facing release packaging. A notable theme is continued investment in **Kernel-backed table operations**, **Delta-Spark DSv2 write paths**, and **cross-format/metadata preservation work** such as Iceberg snapshot summaries and UniForm behavior. Overall, the project appears **healthy and actively developed**, but the absence of issue activity means today's signals come almost entirely from PR flow rather than fresh user-reported problems.

## 3. Project Progress

### Merged/closed PRs today

#### 1) CDC/query correctness fix for correlated subqueries
- **[PR #6310](https://github.com/delta-io/delta/pull/6310)** — **[CLOSED] [Spark] Fix CDC non-constant argument detection for correlated subquery expressions**
- This change targeted a **query correctness edge case** in Spark CDC handling, specifically around how non-constant arguments are detected when correlated subquery expressions are involved.
- Even though marked closed rather than clearly merged in the provided data, it signals active work on **SQL semantic correctness** and avoiding false detection logic in CDC expression analysis.
- This kind of fix matters for advanced SQL workloads where expression classification can affect whether CDC queries execute correctly or are rejected improperly.

#### 2) Default enablement of null expansion fix for MERGE and INSERT
- **[PR #6311](https://github.com/delta-io/delta/pull/6311)** — **[CLOSED] [Spark] Enable MERGE and INSERT null expansion fix by default**
- This is an important **behavioral and compatibility hardening change** for Delta’s Spark write path.
- Enabling the fix by default suggests the project has gained confidence in a prior remediation for **MERGE/INSERT correctness involving null handling or schema expansion behavior**.
- This likely reduces surprising write-time semantics and lowers the need for feature flags in production deployments.

#### 3) UC managed table checkpoint property defaults
- **[PR #6229](https://github.com/delta-io/delta/pull/6229)** — **[CLOSED] [Spark] Set delta.checkpoint.writeStatsAs* properties for UC managed tables**
- This improves **checkpoint/statistics layout defaults** for Unity Catalog managed tables.
- The change indicates ongoing work to make Delta metadata more consistent and optimized for catalog-managed environments.
- This is best read as a **storage metadata and interoperability improvement**, likely helping downstream readers or management layers rely on structured stats representation.

#### 4) Prefer staged handoff for UC existing-table flows
- **[PR #6244](https://github.com/delta-io/delta/pull/6244)** — **[CLOSED] [Delta-Spark] Prefer staged UC existing-table handoff in Delta**
- This advances integration with **Unity Catalog staged handoff flows** by preferring explicit staged context over fallback delegated reload logic.
- The result should improve reliability in **existing-table registration/lookup paths**, especially for managed or staged catalog operations.
- This is a meaningful step in **catalog interoperability and transaction orchestration** rather than user-visible SQL syntax.

### What was advanced today overall

Across merged/closed work, Delta Lake advanced:
- **SQL/query correctness** in CDC and correlated subquery handling
- **Write-path correctness defaults** for MERGE and INSERT
- **Metadata/checkpoint consistency** for managed tables
- **Catalog/UC orchestration reliability** in staged handoff scenarios

These are strong signals of a project currently focused on **stability and system integration**, not just feature expansion.

## 4. Community Hot Topics

> Note: comment/reaction counts are unavailable in the provided data, so “hot topics” are inferred from recency, architectural scope, and strategic importance.

### 1) Kernel-backed DSv2 CREATE TABLE path
- **[PR #6313](https://github.com/delta-io/delta/pull/6313)** — **[Spark][DSv2] Support metadata-only create table via Kernel**
- **[PR #6083](https://github.com/delta-io/delta/pull/6083)** — **[delta-spark] [Kernel-Spark] Snapshot abstraction for CREATE TABLE**
- These PRs show Delta Lake pushing more table creation logic through **Kernel** and **DSv2** rather than older Spark-specific internals.
- The underlying technical need is clear: **unify table operation semantics across engines**, reduce duplicated logic, and make Delta’s core transaction/model layer more reusable.
- This is a strong roadmap signal toward **more modular engine architecture**.

### 2) DSv2 writer stack build-out
- **[PR #6230](https://github.com/delta-io/delta/pull/6230)** — **[DSv2] Add executor writer: DataWriter, DeltaWriterCommitMessage**
- **[PR #6231](https://github.com/delta-io/delta/pull/6231)** — **[DSv2] Add factory + transport: DataWriterFactory, BatchWrite**
- These are foundational DSv2 write-path pieces, likely prerequisites for broader Spark datasource V2 adoption.
- The underlying need is better **write pipeline modularity**, cleaner transaction transport, and eventual parity with modern Spark connector expectations.
- This work matters for **scalability, maintainability, and future connector capabilities**.

### 3) Streaming data-loss protection
- **[PR #6314](https://github.com/delta-io/delta/pull/6314)** — **[Spark] Add sanity check in getBatch to verify trailing commits from latestOffset are present**
- This is one of today’s most important stability PRs because it addresses a **silent data loss bug** in the Delta streaming source.
- The technical need behind it is stronger validation of the assumptions between **offset discovery** and **batch materialization**, especially when commit files disappear in that interval.
- This reflects production-hardening of Delta streaming semantics.

### 4) Metadata preservation during Iceberg conversion/replay
- **[PR #6316](https://github.com/delta-io/delta/pull/6316)** — **Preserve Kafka snapshot summary fields during REPLACE_TABLE replay**
- The need here is preservation of **snapshot-level metadata lineage**, such as Kafka offsets, during cross-format or replay operations.
- This matters to users operating **streaming ingestion pipelines** or mixed Delta/Iceberg ecosystems, where losing summary metadata can break auditability or downstream operational logic.

### 5) Geospatial support in Kernel
- **[PR #6235](https://github.com/delta-io/delta/pull/6235)** — **[KERNEL] Add GeoSpatial Table feature**
- **[PR #6301](https://github.com/delta-io/delta/pull/6301)** — **[Kernel] Geospatial stats parsing: handle geometry/geography as WKT strings**
- The technical need is support for **geospatial schemas and stats interoperability** in the Kernel layer.
- This suggests Delta is moving toward better support for **specialized analytical domains**, especially location-aware data workloads.

## 5. Bugs & Stability

Ranked by apparent severity from the provided summaries:

### Critical
#### Silent data loss risk in streaming source
- **[PR #6314](https://github.com/delta-io/delta/pull/6314)** — **[Spark] Add sanity check in getBatch to verify trailing commits from latestOffset are present**
- Summary explicitly states it fixes a **silent data loss bug** where a commit file can disappear between `latestOffset` and `getBatch`.
- This is the highest-severity item today because it affects **streaming correctness** and can cause missing data without obvious failure signals.
- A fix PR exists and is open.

### High
#### CDC expression analysis correctness with correlated subqueries
- **[PR #6310](https://github.com/delta-io/delta/pull/6310)** — **[Spark] Fix CDC non-constant argument detection for correlated subquery expressions**
- Incorrect expression classification can lead to **query rejection or incorrect query behavior** in advanced CDC workloads.
- The fact that a fix exists indicates the problem is understood and actively addressed.

#### MERGE/INSERT null expansion behavior
- **[PR #6311](https://github.com/delta-io/delta/pull/6311)** — **[Spark] Enable MERGE and INSERT null expansion fix by default**
- Default-enabling this fix implies the prior behavior was problematic enough to justify changing the standard path.
- Potential impact spans **schema evolution, insert semantics, and write correctness**.

### Medium
#### Exposure of filesystem-related options through table properties
- **[PR #6300](https://github.com/delta-io/delta/pull/6300)** — **Block options.fs.* from being rendered with show/describe table properties**
- This is not a crash-level bug, but it may involve **information leakage**, noisy metadata surfaces, or misleading user-visible configuration exposure.
- The proposed block suggests a tightening of metadata hygiene.

#### Replay metadata loss in conversion flows
- **[PR #6316](https://github.com/delta-io/delta/pull/6316)** — **Preserve Kafka snapshot summary fields during REPLACE_TABLE replay**
- This appears to fix **metadata loss/regression risk** rather than data corruption.
- Important for users depending on operational lineage and replay fidelity.

## 6. Feature Requests & Roadmap Signals

### Most visible roadmap signals

#### 1) Kernel as a first-class execution/metadata layer
- **[PR #6313](https://github.com/delta-io/delta/pull/6313)**
- **[PR #6083](https://github.com/delta-io/delta/pull/6083)**
- **[PR #6309](https://github.com/delta-io/delta/pull/6309)** — **[kernel-spark] Recognize CommitInfo action in DSv2**
- These strongly suggest Delta Lake is continuing to decouple functionality from Spark-specific code and route more semantics through **Kernel**.
- Likely next-version candidates: broader **CREATE TABLE/metadata-only operations**, richer **DSv2 transaction coverage**, and improved **CommitInfo/action handling** through Kernel-backed paths.

#### 2) Fuller DSv2 write support
- **[PR #6230](https://github.com/delta-io/delta/pull/6230)**
- **[PR #6231](https://github.com/delta-io/delta/pull/6231)**
- The DSv2 writer stack is still under active construction, indicating future releases may include **more complete DSv2 write/read parity**, cleaner integration with Spark planner APIs, and reduced reliance on legacy write plumbing.

#### 3) Geospatial data support
- **[PR #6235](https://github.com/delta-io/delta/pull/6235)**
- **[PR #6301](https://github.com/delta-io/delta/pull/6301)**
- Geospatial table features and WKT-based stats parsing point to emerging support for **geometry/geography-aware datasets**.
- This may appear in the next release as either an experimental or staged capability, especially in Kernel-related APIs.

#### 4) Better transaction and interoperability semantics
- **[PR #6315](https://github.com/delta-io/delta/pull/6315)** — **[UniForm] Support converting uncommitted txn for Delta UniForm**
- **[PR #6316](https://github.com/delta-io/delta/pull/6316)**
- These indicate growing attention to **cross-format interoperability**, replay behavior, and transactional edge cases.
- Expect continued work around **UniForm**, **Iceberg conversion**, and **snapshot metadata fidelity**.

#### 5) Decimal implicit cast compatibility
- **[PR #6257](https://github.com/delta-io/delta/pull/6257)** — **[Kernel] Support implicit cast between DECIMAL types with different precisions**
- This is a concrete SQL/type-system enhancement and likely to land relatively soon because it improves **compatibility and expression handling** without requiring major architectural shifts.
- Good candidate for inclusion in the next version due to its contained scope and practical value.

## 7. User Feedback Summary

Direct issue-based user feedback is absent today because **no issues were updated** in the last 24 hours. Still, PR summaries reveal several implied user pain points:

- **Streaming users need stronger correctness guarantees**, especially around offset/commit consistency and silent data loss scenarios.  
  - Relevant: [PR #6314](https://github.com/delta-io/delta/pull/6314)

- **Advanced SQL users need better semantic compatibility** for CDC, correlated subqueries, decimal coercion, and null expansion behavior.  
  - Relevant: [PR #6310](https://github.com/delta-io/delta/pull/6310), [PR #6311](https://github.com/delta-io/delta/pull/6311), [PR #6257](https://github.com/delta-io/delta/pull/6257)

- **Catalog-managed enterprise users want smoother UC integration**, especially for managed tables, staged handoff, and metadata defaults.  
  - Relevant: [PR #6244](https://github.com/delta-io/delta/pull/6244), [PR #6229](https://github.com/delta-io/delta/pull/6229)

- **Interoperability-focused users care about preserving metadata lineage** during replay and format conversion.  
  - Relevant: [PR #6316](https://github.com/delta-io/delta/pull/6316), [PR #6315](https://github.com/delta-io/delta/pull/6315)

- **Specialized analytical workloads are pushing for geospatial support** in the lower-level Kernel stack.  
  - Relevant: [PR #6235](https://github.com/delta-io/delta/pull/6235), [PR #6301](https://github.com/delta-io/delta/pull/6301)

Overall satisfaction cannot be inferred directly from today’s data, but the engineering focus suggests Delta maintainers are prioritizing **enterprise reliability and engine modernization** over superficial feature churn.

## 8. Backlog Watch

These older or strategically important open PRs appear to merit maintainer attention:

### Long-running architectural work
#### Kernel-Spark snapshot abstraction for CREATE TABLE
- **[PR #6083](https://github.com/delta-io/delta/pull/6083)** — Open since 2026-02-19
- Important because it underpins broader **Kernel-based CREATE TABLE** support and likely blocks or shapes multiple downstream PRs.
- High architectural leverage; deserves close review to avoid prolonged stack dependency chains.

#### UC Commit Metrics transport wiring
- **[PR #6155](https://github.com/delta-io/delta/pull/6155)** — Open since 2026-02-27
- Commit metrics are important for observability and enterprise operations.
- As “skeleton transport wiring,” it may need maintainer guidance to ensure it lands in a coherent telemetry model.

### Stacked DSv2 work needing coordination
#### DSv2 writer stack
- **[PR #6230](https://github.com/delta-io/delta/pull/6230)**
- **[PR #6231](https://github.com/delta-io/delta/pull/6231)**
- These are foundational and likely interdependent.
- Prolonged review cycles here could slow multiple downstream DSv2 features.

#### CI coverage for REPLACE workflows
- **[PR #6233](https://github.com/delta-io/delta/pull/6233)** — **[Delta][CI] REPLACE tests - RTAS/RT/COTR/DPO**
- Test coverage work is easy to deprioritize but often essential for safely landing bigger behavioral changes.
- Given the amount of table-replace and staged-handoff work in flight, this looks important.

### Feature work with likely user demand
#### GeoSpatial support
- **[PR #6235](https://github.com/delta-io/delta/pull/6235)**
- **[PR #6301](https://github.com/delta-io/delta/pull/6301)**
- This is an emerging area and may require careful spec/API discussion.
- Worth attention because geospatial support can unlock new adoption segments but tends to have nuanced schema/statistics implications.

#### Decimal implicit cast support
- **[PR #6257](https://github.com/delta-io/delta/pull/6257)**
- Small in scope compared with the DSv2 stack, but potentially high value for SQL compatibility and user experience.
- Could be a good candidate for near-term merge if review bandwidth allows.

---

## Bottom line

Delta Lake’s 2026-03-19 activity reflects a project in a **deep infrastructure and correctness phase**: no release churn, no issue surge, but substantial movement in **Spark DSv2**, **Kernel integration**, **catalog interoperability**, and **streaming/query correctness**. The most urgent technical item visible today is the **silent data loss safeguard for streaming** in [PR #6314](https://github.com/delta-io/delta/pull/6314). Strategically, the clearest roadmap direction is continued migration toward **Kernel-centered abstractions and DSv2-native execution paths**, with adjacent investments in **UniForm/Iceberg interoperability** and **geospatial support**.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-19

## 1. Today's Overview

Databend showed moderate-to-high engineering activity over the last 24 hours, with **6 active issues**, **12 updated PRs**, and **1 new patch release**. The workstream is currently skewed toward **query-engine correctness, SQL parser robustness, join stability, and spill/runtime reliability**, rather than major new end-user features. A notable theme today is **stability hardening**: several newly reported bugs are crash-class or panic-class issues triggered by edge-case SQL and join execution paths. Overall project health looks active and responsive, but there is clear short-term pressure on the team to address **query correctness regressions and execution-engine panics** before broader feature velocity increases.

## 2. Releases

### v1.2.888-patch-1
- Release: [`v1.2.888-patch-1`](https://github.com/databendlabs/databend/compare/v1.2.889-nightly...v1.2.888-patch-1)

This is a **patch release**, which strongly suggests a stabilization cut rather than a feature-heavy milestone. The provided release metadata does not include detailed notes beyond the changelog link, so no explicit breaking changes or migration actions are documented in the release entry itself.

**Observed release implications from nearby merged work:**
- Likely emphasis on **correctness and reliability**, especially around query execution and spill behavior.
- Recent merged fixes include explicit schema preservation for spill readers, which is directly relevant to correctness in queries involving variant columns.

**Breaking changes:** None explicitly indicated.  
**Migration notes:** None explicitly indicated.  
**Operator guidance:** Users experiencing correctness issues in nightly builds or recent 1.2.x versions should review the full changelog and validate spill-heavy workloads, variant columns, and complex joins after upgrading.

## 3. Project Progress

### Merged / Closed PRs advancing the engine today

#### Query correctness and spill reliability
- [#19564](https://github.com/databendlabs/databend/pull/19564) — **fix(query): pass explicit data schema to spill reader instead of inferring from parquet metadata**
  - This is the most substantively important merged fix in the period.
  - It addresses a correctness issue where **variant-column type information could be lost** when restoring spilled data if schema was inferred from Parquet metadata.
  - This improves reliability for **memory-pressure scenarios**, distributed execution, and complex analytical workloads that spill intermediate data.

#### Runtime observability
- [#19565](https://github.com/databendlabs/databend/pull/19565) — **chore(query): add missing runtime filter logs**
  - Improves introspection when spills happen and when runtime filter merge paths early-return.
  - While not a feature, better logging materially helps operators diagnose **performance anomalies and distributed query behavior**.

#### Dependency and maintenance work
- [#19560](https://github.com/databendlabs/databend/pull/19560) — **bump Spark dependency in Iceberg driver tests**
  - Maintains compatibility of test infrastructure around Iceberg-related validation.
- [#18637](https://github.com/databendlabs/databend/pull/18637) — **revert pr 18589**
  - The fact that an older revert PR was updated/closed today suggests continued cleanup or branch hygiene around prior refactors.
- [#19025](https://github.com/databendlabs/databend/pull/19025) — **[Don't Merge]: test performance**
  - Appears administrative/experimental rather than product-facing.

### Open PRs signaling near-term progress
- [#19559](https://github.com/databendlabs/databend/pull/19559) — eager aggregation rewrite refactor
- [#19567](https://github.com/databendlabs/databend/pull/19567) — aggregating index rewrite matching improvement
- [#19566](https://github.com/databendlabs/databend/pull/19566) — better case handling for staged file queries
- [#19549](https://github.com/databendlabs/databend/pull/19549) — experimental table tags for FUSE snapshots

Together, these indicate active investment in:
- **optimizer rewrites**
- **SQL/stage usability**
- **metadata/versioning semantics for FUSE tables**

## 4. Community Hot Topics

### 1) INSERT performance regression after upgrade
- [Issue #19481](https://github.com/databendlabs/databend/issues/19481) — **slower performance of INSERT with 1.2.881**
- Most active issue in the set, with **23 comments**.

**Why it matters:**  
This is the clearest real-user production signal in today’s data. A regression from `1.2.790` to `1.2.881-nightly` on `INSERT` performance points to possible changes in:
- write pipeline behavior
- commit/merge paths
- storage-layer batching
- optimizer/planner changes affecting insert-select workloads

**Underlying technical need:** performance stability across upgrades. Analytical database users tolerate many edge-case SQL bugs less than they tolerate **write-path regressions**, because ingestion speed directly affects SLAs and cost.

### 2) Parser/tokenizer robustness for interactive tooling
- [PR #19573](https://github.com/databendlabs/databend/pull/19573) — **expose unclosed state from tokenizer for REPL consumers**

**Why it matters:**  
This is a useful sign that Databend is improving not just batch SQL execution but also **interactive SQL ergonomics**. Detecting unclosed quotes, backticks, dollar-quoted strings, and block comments is important for:
- REPL clients
- IDE integrations
- notebook-style execution
- better parser diagnostics

**Underlying technical need:** developer tooling polish and frontend SQL resilience.

### 3) SQL optimizer rewrite quality
- [PR #19559](https://github.com/databendlabs/databend/pull/19559) — eager aggregation rewrites
- [PR #19567](https://github.com/databendlabs/databend/pull/19567) — aggregating index rewrite matching

**Why it matters:**  
Both PRs target optimizer internals and suggest Databend is refining the machinery that turns logical plans into more efficient physical execution. Structural expression matching is especially notable because it is generally more robust than string-based heuristics.

**Underlying technical need:** sustainable optimizer evolution with fewer brittle rewrites and better maintainability.

## 5. Bugs & Stability

Ranked by likely severity and user impact.

### Critical
#### 1) Recursive views can crash `databend-query`
- [Issue #19572](https://github.com/databendlabs/databend/issues/19572)
- Crash mode: **SIGSEGV**
- Reported on `v1.2.883-nightly`

A segmentation fault is one of the most severe classes of bug because it indicates a hard process crash rather than a controlled planner/runtime error. Recursive object definitions should ideally fail validation, not crash the server.

**Fix PR exists?** None visible in today’s data.

---

### High
#### 2) IEJoin range join index out of bounds on empty result
- [Issue #19569](https://github.com/databendlabs/databend/issues/19569)

This is a direct execution panic in the range join path. Empty-result edge cases are common in analytical filtering, so this affects correctness and stability of nontrivial join workloads.

**Fix PR exists?** None visible today.

#### 3) ASOF Join panics on UInt8 type
- [Issue #19570](https://github.com/databendlabs/databend/issues/19570)

The binder unwraps an error instead of gracefully rejecting or coercing unsupported join key types. Since ASOF joins are important for time-series and event alignment use cases, this is notable.

**Fix PR exists?** None visible today.

#### 4) Result projection schema mismatch in left join path
- [Issue #19568](https://github.com/databendlabs/databend/issues/19568)

The mismatch between `Nullable(Int64)` and `Int64` points to a query correctness invariant violation, likely around nullability propagation in join/project planning. This can lead to assertions or incorrect execution plans.

**Fix PR exists?** None visible today.

---

### Medium
#### 5) SQL parser panic on nested JOIN with multiple conditions
- [Issue #19571](https://github.com/databendlabs/databend/issues/19571)

A parser panic is serious, but usually easier to isolate than runtime engine corruption. The issue suggests fragility in SQL grammar handling for more complex join syntax, especially as Databend runs broader compatibility suites such as converted DuckDB tests.

**Fix PR exists?** Related parser hardening may be underway in [PR #19573](https://github.com/databendlabs/databend/pull/19573), though that PR is aimed at tokenizer unclosed-state handling rather than this exact nested-join panic.

---

### Ongoing regression watch
#### 6) INSERT slower in 1.2.881
- [Issue #19481](https://github.com/databendlabs/databend/issues/19481)

Not a crash, but highly important for production users. This remains the strongest user-facing regression signal in the current issue set.

**Fix PR exists?** None clearly linked in today’s data.

## 6. Feature Requests & Roadmap Signals

There were **few explicit user feature requests** in today’s issue list; the dominant signal is quality and compatibility hardening. Still, several open PRs provide roadmap clues.

### Strong roadmap signals

#### Experimental FUSE table tags
- [PR #19549](https://github.com/databendlabs/databend/pull/19549)

This adds **experimental table tags for FUSE table snapshots** using a new KV-backed model. That points toward:
- richer snapshot/version navigation
- lightweight data version labeling
- better data lifecycle and reproducibility workflows

This looks like a strong candidate for inclusion in an upcoming version if review proceeds smoothly.

#### Better staged file query usability
- [PR #19566](https://github.com/databendlabs/databend/pull/19566)

Improves case handling for queries like:
- `select ... from @my_stage/my_parquet/`
- staged-file subqueries in `copy/insert/replace`

This is a practical SQL usability improvement for users querying external/staged files. It likely benefits ingestion pipelines and ad hoc lakehouse-style workflows.

#### Optimizer rewrite improvements
- [PR #19559](https://github.com/databendlabs/databend/pull/19559)
- [PR #19567](https://github.com/databendlabs/databend/pull/19567)

These are not end-user “features” in the UI sense, but they often translate into:
- more consistent plan quality
- broader aggregation pushdown/rewrite opportunities
- improved performance on analytical queries

### Likely next-version candidates
Based on the current queue, the most plausible near-term inclusions are:
1. **Optimizer rewrite refactors** ([#19559](https://github.com/databendlabs/databend/pull/19559), [#19567](https://github.com/databendlabs/databend/pull/19567))
2. **Staged file query case-handling improvements** ([#19566](https://github.com/databendlabs/databend/pull/19566))
3. **Table tags for FUSE snapshots** if maintainers are comfortable shipping the experimental model ([#19549](https://github.com/databendlabs/databend/pull/19549))

## 7. User Feedback Summary

### Main pain points seen today

#### 1) Upgrade confidence is affected by performance regressions
- [Issue #19481](https://github.com/databendlabs/databend/issues/19481)

A direct complaint about slower `INSERT` after upgrading is the most concrete user feedback in the set. This suggests users are benchmarking versions closely and expect **write performance consistency across releases**.

#### 2) SQL compatibility expansion is surfacing edge cases
- [Issues #19568](https://github.com/databendlabs/databend/issues/19568), [#19569](https://github.com/databendlabs/databend/issues/19569), [#19570](https://github.com/databendlabs/databend/issues/19570), [#19571](https://github.com/databendlabs/databend/issues/19571), [#19572](https://github.com/databendlabs/databend/issues/19572)

Several fresh issues appear to come from systematic SQL test conversion/fuzzing, including DuckDB-derived cases. This indicates Databend is broadening SQL surface compatibility, but users may hit unstable corners in:
- advanced joins
- recursive views
- nullability propagation
- parser edge cases

#### 3) External/staged data workflows remain important
- [PR #19566](https://github.com/databendlabs/databend/pull/19566)
- [PR #19444](https://github.com/databendlabs/databend/pull/19444)
- [PR #19557](https://github.com/databendlabs/databend/pull/19557)

The repeated work around staged files and `bendpy` CSV/TSV registration shows meaningful user demand for smooth file-based ingestion and Python-facing workflows.

### Satisfaction signals
There are no strong positive reaction counts in this dataset, so satisfaction signals are indirect:
- maintainers are actively landing **correctness fixes**
- follow-up PRs are being opened for earlier fixes, indicating iterative responsiveness
- patch release cadence remains active

## 8. Backlog Watch

### Important issues needing maintainer attention

#### [Issue #19481](https://github.com/databendlabs/databend/issues/19481) — INSERT performance regression
- Created: 2026-02-24
- Comments: 23

This is the clearest backlog item requiring continued maintainer focus. It is older than the other issues, actively discussed, and likely production-relevant.

#### [Issue #19572](https://github.com/databendlabs/databend/issues/19572) — recursive views crash query process
Fresh, but because it is a **SIGSEGV**, it should be triaged quickly despite having no comments yet.

#### [Issue #19568](https://github.com/databendlabs/databend/issues/19568) — schema mismatch assertion
#### [Issue #19569](https://github.com/databendlabs/databend/issues/19569) — IEJoin panic
#### [Issue #19570](https://github.com/databendlabs/databend/issues/19570) — ASOF join panic
#### [Issue #19571](https://github.com/databendlabs/databend/issues/19571) — parser panic
These were all reported together and look like part of a broader SQL compatibility and engine-hardening wave. They likely deserve coordinated triage because they may share root causes in:
- join planning/execution invariants
- parser/binder assumptions
- assertion-vs-error handling

### PRs that may need consolidation or reviewer attention

#### [PR #19444](https://github.com/databendlabs/databend/pull/19444) and [PR #19557](https://github.com/databendlabs/databend/pull/19557)
These appear closely related, with #19557 explicitly described as a follow-up to #19444. Maintainers may want to consolidate direction and avoid duplicated review effort.

#### [PR #19549](https://github.com/databendlabs/databend/pull/19549)
Potentially important roadmap PR, but experimental metadata model changes often need deeper design review.

---

## Bottom Line

Databend is currently in a **stability-focused phase**: a patch release shipped, a meaningful spill-schema correctness fix landed, and multiple fresh issues revealed weaknesses in parser, join, and recursive-view handling. The biggest external user signal remains **INSERT performance regression after upgrade**, while the main engineering signal is **hardening SQL compatibility under broader test coverage**. If maintainers quickly address today’s crash-class issues and the ongoing write-performance regression, project health remains solid; if not, reliability could overshadow otherwise promising optimizer and snapshot/tagging work.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-19

## 1. Today's Overview

Velox showed **high PR velocity and moderate issue activity** over the last 24 hours: **50 PRs updated** and **5 issues updated**, with no new release cut today. The activity mix suggests the project is currently in a **stabilization-plus-expansion phase**: several changes target correctness and memory safety, while longer-running work continues on GPU support, Iceberg features, build tooling, and SQL compatibility. Query-engine reliability was a visible theme, with fresh fixes for **use-after-free crashes**, a **rollback of a regression-causing optimization**, and new bug reports around **time/date semantics** and **session timezone handling**. Overall, project health looks active and responsive, though the density of low-level correctness fixes indicates maintainers are still paying down risk in execution, serialization, and function behavior.

## 2. Project Progress

### Merged / closed PRs today

#### 1) DWRF writer memory-safety improvement landed
- **PR:** [#16800](https://github.com/facebookincubator/velox/pull/16800) — `fix(dwrf): Fix dangling StringView keys in FlatMapColumnWriter`
- **Status:** Merged/closed
- **What advanced:** This addresses a serious storage-layer correctness/stability problem in the DWRF writer path. The root issue was non-owning `StringView` keys stored in a hash map and later rehashed after backing memory had been freed.
- **Impact:** This is an important **storage-engine hardening fix**. It reduces the risk of crashes or corruption-like behavior during map column writing, especially under batch lifecycle churn.

#### 2) Serializer API cleanup merged
- **PR:** [#16710](https://github.com/facebookincubator/velox/pull/16710) — `refactor: Remove VectorSerde::kind() method, use static serializer names`
- **Status:** Merged/closed
- **What advanced:** Internal serialization interfaces were simplified by removing `VectorSerde::kind()` in favor of static serializer naming.
- **Impact:** Mostly **infrastructure/refactoring**, but it should improve maintainability and reduce ambiguity in serialization plumbing used across execution and exchange boundaries.

#### 3) GPU decimal support work re-scoped
- **PR:** [#15825](https://github.com/facebookincubator/velox/pull/15825) — `feat(cudf): Support decimal types in CUDF GPU operators (REPLACED)`
- **Status:** Closed/replaced
- **What advanced:** While not merged directly, this closure signals that the GPU decimal effort is now proceeding via smaller staged PRs, which is a positive sign for reviewability and integration.
- **Impact:** Indicates continued momentum on **GPU analytical execution**, especially for decimal-heavy workloads.

### Closed issues today

#### 4) Parquet `DELTA_BYTE_ARRAY` decoder request closed
- **Issue:** [#10938](https://github.com/facebookincubator/velox/issues/10938) — `Add decoder for DELTA_BYTE_ARRAY parquet encoding`
- **Status:** Closed
- **What advanced:** Closure strongly suggests progress on broader Parquet compatibility, especially for V2 files produced by other engines.
- **Impact:** Important for **data lake interoperability** and reading externally generated Parquet datasets.

#### 5) GPU CI tracking issue closed
- **Issue:** [#15673](https://github.com/facebookincubator/velox/issues/15673) — `Add GPU CI check to run unit tests`
- **Status:** Closed
- **What advanced:** Signals that GPU test automation has likely improved or the tracking work was otherwise resolved.
- **Impact:** This is meaningful for the reliability of **Wave/cuDF backends** and should help reduce regressions in accelerated code paths.

---

## 3. Community Hot Topics

Below are the most relevant active items based on recency and technical significance.

### Memory-safety in expression execution
- **PR:** [#16830](https://github.com/facebookincubator/velox/pull/16830) — `fix: Copy pattern string in LikeGeneric to prevent use-after-free crash`
- **Why it matters:** This is a direct fix for a **SIGSEGV-class crash** in `LIKE` evaluation when the pattern is non-constant and memory arbitration reclaims the backing string buffer.
- **Underlying need:** Velox users need expression evaluation to remain safe under **memory pressure and arbitration**, especially in long-running analytical queries. This highlights the complexity of using non-owning string references in a memory-managed execution engine.

### Regression rollback in output buffer handling
- **PR:** [#16829](https://github.com/facebookincubator/velox/pull/16829) — `fix: Back out Avoid redundant outputBuffer clearing`
- **Why it matters:** The team is explicitly backing out a previous optimization because it caused **query failures**.
- **Underlying need:** Users want performance improvements, but not at the expense of correctness. This is a classic signal that execution-path micro-optimizations need stronger regression coverage.

### Iceberg connector capability expansion
- **PR:** [#16761](https://github.com/facebookincubator/velox/pull/16761) — `feat:Add positional update support for Velox Iceberg connector`
- **Why it matters:** Adds support for **merge-on-read full-row positional updates**, an important Iceberg table maintenance and update capability.
- **Underlying need:** Better support for modern lakehouse table formats and their evolving mutation semantics.

### Build system modernization and developer productivity
- **PR:** [#16827](https://github.com/facebookincubator/velox/pull/16827) — `build: Add build impact analysis workflow for PRs`
- **PR:** [#16826](https://github.com/facebookincubator/velox/pull/16826) — `test: Split join tests out of monolithic exec test target`
- **PR:** [#16797](https://github.com/facebookincubator/velox/pull/16797) — `build: Optimize fuzzer compile with higher parallelism, shared build, and targeted targets`
- **Why it matters:** Build and CI efficiency is clearly a hot topic.
- **Underlying need:** Velox’s codebase is large enough that contributor throughput is becoming sensitive to compile/test latency. These changes point to active investment in developer ergonomics and faster feedback loops.

### GPU function surface growth
- **PR:** [#16504](https://github.com/facebookincubator/velox/pull/16504) — `feat(cuDF): Support function signature retrieval from registry`
- **PR:** [#16612](https://github.com/facebookincubator/velox/pull/16612) — `feat(cudf): GPU Decimal (Part 1 of 3)`
- **PR:** [#16824](https://github.com/facebookincubator/velox/pull/16824) — `fix(cudf): Fix intermittent failure with new CUDF string CONCAT(VARCHAR)`
- **PR:** [#16825](https://github.com/facebookincubator/velox/pull/16825) — `feat(cudf): Add unit tests for CUDF string functions`
- **Underlying need:** Users increasingly want **feature parity and observability** across CPU and GPU execution paths, including decimals and string functions.

---

## 4. Bugs & Stability

Ranked by likely severity and user impact.

### Critical / High

#### 1) Potential `LIKE` use-after-free crash
- **PR:** [#16830](https://github.com/facebookincubator/velox/pull/16830)
- **Severity:** High
- **Issue type:** Crash / memory safety
- **Details:** `LikeGeneric::apply` could dereference a reclaimed string buffer when the pattern is non-constant and memory arbitration frees the underlying memory.
- **Fix available:** Yes, open PR.
- **Assessment:** This is the most severe item today because it can produce **SIGSEGV** in normal query execution under pressure.

#### 2) Regression from output buffer optimization causing query failures
- **PR:** [#16829](https://github.com/facebookincubator/velox/pull/16829)
- **Severity:** High
- **Issue type:** Regression / query execution correctness
- **Details:** A previous optimization to avoid redundant `outputBuffer` clearing is being backed out due to query failures.
- **Fix available:** Yes, open rollback PR.
- **Assessment:** Correct rollback behavior is encouraging, but this suggests optimization changes in execution internals remain a notable regression risk.

#### 3) DWRF writer dangling `StringView` bug
- **PR:** [#16800](https://github.com/facebookincubator/velox/pull/16800)
- **Severity:** High
- **Issue type:** Crash / memory safety in storage writer
- **Details:** Rehashing map keys backed by freed memory could crash and potentially destabilize write workloads.
- **Fix available:** Yes, merged.
- **Assessment:** Strong sign that maintainers are actively fixing deep lifecycle bugs in storage code.

### Medium

#### 4) `current_time` fails with LocalRunnerService due to missing session timezone
- **Issue:** [#16828](https://github.com/facebookincubator/velox/issues/16828)
- **Severity:** Medium
- **Issue type:** Runtime failure / environment propagation
- **Details:** `current_time` cannot resolve session timezone when run through `LocalRunnerService`.
- **Fix available:** No linked fix PR in the provided data.
- **Assessment:** Important for test infrastructure and likely for embedded/service-based execution contexts.

#### 5) `from_unixtime` `YYYY` semantics differ from Spark
- **Issue:** [#16806](https://github.com/facebookincubator/velox/issues/16806)
- **Severity:** Medium
- **Issue type:** Query correctness / SQL compatibility
- **Details:** Velox returns `2025-12-30` while Spark returns `2026-12-30` for a `YYYY` pattern because Spark interprets `YYYY` as ISO week-year.
- **Fix available:** No linked fix PR in the provided data.
- **Assessment:** This is a classic **engine compatibility** issue likely to affect Spark-aligned semantics and migration confidence.

#### 6) `localtime`, `current_date` fail in fuzzer with Presto SOT
- **Issue:** [#14937](https://github.com/facebookincubator/velox/issues/14937)
- **Severity:** Medium
- **Issue type:** SQL generation / compatibility / verification bug
- **Details:** Functions fail when SQL generation adds parentheses while using Presto as source-of-truth.
- **Fix available:** No linked fix PR in the provided data.
- **Assessment:** Important for differential testing and confidence in SQL function canonicalization.

### Lower severity but notable
#### 7) cuDF `CONCAT(VARCHAR)` intermittent failure
- **PR:** [#16824](https://github.com/facebookincubator/velox/pull/16824)
- **Severity:** Medium-low
- **Issue type:** Intermittent backend-specific function failure
- **Details:** Failure was caused by an invalid empty separator scalar in cuDF string concatenation.
- **Fix available:** Yes, open PR.
- **Assessment:** Good example of backend parity and robustness work.

---

## 5. Feature Requests & Roadmap Signals

### Likely near-term roadmap signals

#### Iceberg mutation support
- **PR:** [#16761](https://github.com/facebookincubator/velox/pull/16761)
- **Signal:** Strong
- **Prediction:** Positional update support is likely to appear in an upcoming release if review completes cleanly. This is a meaningful step toward richer **Iceberg merge-on-read** behavior.

#### GPU decimal enablement
- **PR:** [#16612](https://github.com/facebookincubator/velox/pull/16612)
- **PR:** [#15825](https://github.com/facebookincubator/velox/pull/15825)
- **Signal:** Strong
- **Prediction:** Decimal support on cuDF-backed operators looks like an active strategic area and is likely to land in staged form soon.

#### GPU function introspection and testing maturity
- **PR:** [#16504](https://github.com/facebookincubator/velox/pull/16504)
- **PR:** [#16825](https://github.com/facebookincubator/velox/pull/16825)
- **Issue:** [#15673](https://github.com/facebookincubator/velox/issues/15673)
- **Signal:** Strong
- **Prediction:** Expect stronger **GPU feature discoverability, CI validation, and function coverage** in the next version cycle.

#### Spark SQL compatibility improvements
- **Issue:** [#16806](https://github.com/facebookincubator/velox/issues/16806)
- **PR:** [#16307](https://github.com/facebookincubator/velox/pull/16307)
- **Signal:** Moderate to strong
- **Prediction:** Ongoing work on Spark-specific arithmetic and date/time semantics suggests compatibility remains an active roadmap item, especially for ANSI and edge-case behavior.

#### Parquet interoperability
- **Issue:** [#10938](https://github.com/facebookincubator/velox/issues/10938)
- **PR:** [#16744](https://github.com/facebookincubator/velox/pull/16744)
- **Signal:** Moderate
- **Prediction:** Continued hardening for older/newer Parquet producer compatibility is likely, especially around encodings and statistics interpretation.

---

## 6. User Feedback Summary

Based on the updated issues and PRs, user pain points cluster around four recurring themes:

### 1) Cross-engine SQL compatibility still matters a lot
- **Issue:** [#16806](https://github.com/facebookincubator/velox/issues/16806)
- **Issue:** [#14937](https://github.com/facebookincubator/velox/issues/14937)
- **PR:** [#16307](https://github.com/facebookincubator/velox/pull/16307)
- **Takeaway:** Users compare Velox behavior directly against **Spark** and **Presto** and expect semantics to match in date/time formatting, current-time functions, and decimal overflow behavior.

### 2) Stability under real execution pressure is a top concern
- **PR:** [#16830](https://github.com/facebookincubator/velox/pull/16830)
- **PR:** [#16829](https://github.com/facebookincubator/velox/pull/16829)
- **PR:** [#16800](https://github.com/facebookincubator/velox/pull/16800)
- **Takeaway:** Memory arbitration, buffer reuse, and non-owning string/view lifetimes remain practical sources of failures. Users value robustness as much as speed.

### 3) GPU users want parity, not just acceleration
- **PR:** [#16612](https://github.com/facebookincubator/velox/pull/16612)
- **PR:** [#16824](https://github.com/facebookincubator/velox/pull/16824)
- **PR:** [#16825](https://github.com/facebookincubator/velox/pull/16825)
- **Takeaway:** The community is pushing beyond “GPU exists” toward **correctness, decimal support, string-function reliability, and test depth**.

### 4) Contributor productivity is under active pressure
- **PR:** [#16827](https://github.com/facebookincubator/velox/pull/16827)
- **PR:** [#16826](https://github.com/facebookincubator/velox/pull/16826)
- **PR:** [#16797](https://github.com/facebookincubator/velox/pull/16797)
- **Takeaway:** Build/test latency has become a real friction point for contributors and maintainers, prompting workflow and target-structure improvements.

---

## 7. Backlog Watch

These older or strategically important items appear to warrant maintainer attention.

### Long-running open PRs

#### 1) FBThrift migration
- **PR:** [#16019](https://github.com/facebookincubator/velox/pull/16019)
- **Created:** 2026-01-14
- **Why watch:** This is a substantial dependency migration affecting Parquet-related infrastructure and possibly broader compatibility. It likely needs close review because of API incompatibilities.

#### 2) Base encoding utility refactor
- **PR:** [#16176](https://github.com/facebookincubator/velox/pull/16176)
- **Created:** 2026-01-30
- **Why watch:** Not urgent from a user perspective, but prolonged utility refactors can create review drag and merge conflicts.

#### 3) Spark checked decimal multiply support
- **PR:** [#16307](https://github.com/facebookincubator/velox/pull/16307)
- **Created:** 2026-02-09
- **Why watch:** This is directly relevant to Spark ANSI compatibility and could matter to downstream adopters.

#### 4) cuDF registry/signature exposure
- **PR:** [#16504](https://github.com/facebookincubator/velox/pull/16504)
- **Created:** 2026-02-24
- **Why watch:** Important enabling work for GPU function discoverability and integration consistency.

### Older open issue still active

#### 5) Presto SOT failures for `localtime` / `current_date`
- **Issue:** [#14937](https://github.com/facebookincubator/velox/issues/14937)
- **Created:** 2025-09-23
- **Why watch:** This has remained open for months and affects differential testing reliability. It is not the most severe bug, but it undermines confidence in function semantics and automated verification.

---

## 8. Overall Health Assessment

Velox appears **healthy and highly active**, with strong momentum in code review and infrastructure work. The most encouraging signal is that maintainers are responding quickly to **deep correctness issues**—especially memory-safety bugs and regressions—rather than letting performance-oriented changes linger after failures surface. Strategic development remains visible in **Iceberg support, GPU execution maturity, Parquet interoperability, and Spark compatibility**. The main caution is that repeated fixes around lifetimes, arbitration, and execution buffers suggest the system’s low-level performance architecture still requires careful hardening as feature scope expands.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-19

## 1) Today's Overview

Apache Gluten remained highly active over the last 24 hours, with **18 PRs updated** and **6 issues updated**, indicating steady engineering throughput despite **no new release**. Current work is concentrated around the **Velox backend**, especially shuffle-path optimization, Spark compatibility, GPU execution behavior, and SQL/function correctness. The mix of open enhancement issues and several closed PRs suggests the project is in an active integration and hardening phase rather than a release-cutting phase. Overall project health looks **good but backend-complexity-driven**, with visible attention on performance regressions, Iceberg compatibility, and infrastructure polish.

## 3) Project Progress

### Merged/closed PRs today

#### 1. Iceberg `input_file_name()` and metadata propagation fix landed
- PR: [#11615](https://github.com/apache/incubator-gluten/pull/11615) — **CLOSED**
- Related issue: [#11513](https://github.com/apache/incubator-gluten/issues/11513)

This is the most meaningful correctness/stability advancement in the period. The PR addresses:
- `input_file_name()`
- `input_file_block_start()`
- `input_file_block_length()`

for **Iceberg on Velox**, and also mentions **JNI initialization stability** and metadata propagation improvements. This advances SQL compatibility for data-lake workloads and reduces a class of runtime/native integration failures. Notably, the issue itself remains open, so maintainers may still be validating edge cases or waiting for follow-up cleanup.

#### 2. GPU fallback fixes were actively iterated
- PR: [#11770](https://github.com/apache/incubator-gluten/pull/11770) — **CLOSED**
- PR: [#11785](https://github.com/apache/incubator-gluten/pull/11785) — **CLOSED**

Two fast-turnaround PRs targeted **GPU fallback** behavior in the Velox path. Even without detailed PR summaries, this pattern usually signals active stabilization of hybrid execution paths where unsupported operators or runtime conditions must safely revert to CPU/Spark execution. This is important for production reliability, because fallback correctness is often more critical than peak acceleration.

#### 3. Tooling regression fixed in test/integration infrastructure
- PR: [#11781](https://github.com/apache/incubator-gluten/pull/11781) — **CLOSED**

This fixes a broken `--decimal-as-double` flag in **gluten-it**, the project’s test/integration tooling. While not a user-facing engine feature, it improves validation fidelity for decimal semantics and helps prevent compatibility drift between Gluten and Spark behavior.

#### 4. Stale cleanup closed older architectural work
- PR: [#11491](https://github.com/apache/incubator-gluten/pull/11491) — **CLOSED**
- PR: [#11278](https://github.com/apache/incubator-gluten/pull/11278) — **CLOSED**
- PR: [#11456](https://github.com/apache/incubator-gluten/pull/11456) — **CLOSED**

These closures suggest maintainers are trimming aging work around:
- stage resource profile tuning for partial operators,
- explicit schema/type enforcement for ClickHouse plans,
- global off-heap memory allocation path rework.

This is healthy backlog maintenance, though some of these topics remain strategically important.

---

## 4) Community Hot Topics

### 1. Velox upstream gap tracking remains the most discussed topic
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)
- Comments: **16**
- Reactions: **4 👍**

This tracker aggregates **Velox PRs useful to Gluten but not yet merged upstream**. It highlights a structural dependency risk: Gluten’s roadmap is partly gated by upstream Velox review velocity. The underlying technical need is clear: contributors want production features without paying the long-term maintenance cost of carrying private forks or heavy cherry-picks. This issue is a strong signal that **upstream/downstream synchronization** remains a core project-management challenge.

### 2. Iceberg file metadata correctness is still visible to users
- Issue: [#11513](https://github.com/apache/incubator-gluten/issues/11513)
- Comments: **5**
- Related PR closed: [#11615](https://github.com/apache/incubator-gluten/pull/11615)

Users care about built-in metadata functions working consistently across table formats. The issue shows that **Hive and Delta behaved correctly while Iceberg did not**, exposing a backend inconsistency that directly affects lineage, debugging, and ETL logic. Since the fix PR closed but the issue remains open, this stays a hot item until user confirmation.

### 3. Severe LIMIT-query underperformance versus vanilla Spark
- Issue: [#11766](https://github.com/apache/incubator-gluten/issues/11766)
- Comments: **4**

A report claiming **over 10x slower performance** than Spark on simple `select * ... limit 10` is one of the strongest user-facing signals in the current cycle. The likely underlying need is better **short-query optimization**, especially avoiding excessive task parallelism or unnecessary native overhead for trivial scans. This kind of regression matters disproportionately because it undermines the baseline trust that acceleration frameworks should not lose on easy cases.

### 4. Shuffle-path innovation around dynamic filtering and GPU
- PR: [#11769](https://github.com/apache/incubator-gluten/pull/11769)
- PR: [#11780](https://github.com/apache/incubator-gluten/pull/11780)
- Issue: [#11779](https://github.com/apache/incubator-gluten/issues/11779)

These items point to a clear roadmap direction: **smarter shuffle readers/writers**, with block-level statistics and multi-threaded GPU decompression. The technical need is reducing waste in distributed execution:
- write richer metadata during shuffle,
- prune blocks using dynamic filters,
- parallelize decompression/deserialization where GPU locking is currently a bottleneck.

This is a high-value optimization track for join-heavy and large-cluster analytical workloads.

---

## 5) Bugs & Stability

Ranked by likely severity and user impact:

### High severity

#### 1. Performance regression: >10x slower than vanilla Spark on simple LIMIT query
- Issue: [#11766](https://github.com/apache/incubator-gluten/issues/11766)
- Status: **OPEN**
- Fix PR: **none linked**

Why severe:
- Impacts a simple and common query pattern.
- Suggests execution-planning inefficiency or backend overhead where Spark is expected to short-circuit cheaply.
- Can damage user confidence in enabling Gluten broadly.

#### 2. Iceberg `input_file_name()` returning empty string
- Issue: [#11513](https://github.com/apache/incubator-gluten/issues/11513)
- Status: **OPEN**
- Candidate fix PR: [#11615](https://github.com/apache/incubator-gluten/pull/11615) — **CLOSED**

Why severe:
- Query correctness/semantic compatibility issue.
- Affects metadata functions frequently used for auditing, lineage, and partition/file-aware processing.
- Also tied to JNI crash-path stability per the fix PR summary.

### Medium severity

#### 3. GPU fallback instability
- PRs: [#11770](https://github.com/apache/incubator-gluten/pull/11770), [#11785](https://github.com/apache/incubator-gluten/pull/11785)

Why important:
- Fallback bugs can cause wrong execution mode, failures, or silent behavior changes.
- Rapid successive fixes imply this area is still fragile.

#### 4. Broken `--decimal-as-double` in tooling
- PR: [#11781](https://github.com/apache/incubator-gluten/pull/11781)

Why important:
- Test tooling regressions can hide semantic mismatches in decimal handling.
- Lower runtime severity, but meaningful for validation and CI confidence.

### Low-to-medium severity / optimization-driven

#### 5. Parquet metadata validation overhead at large partition counts
- Issue: [#11782](https://github.com/apache/incubator-gluten/issues/11782)

This appears to be more of a performance/scalability pain point than a correctness bug. It signals that metadata validation paths may become disproportionately expensive on partition-heavy datasets.

---

## 6) Feature Requests & Roadmap Signals

### Strong signals likely to influence the next version

#### 1. Multi-threaded GPU shuffle decompression
- Issue: [#11779](https://github.com/apache/incubator-gluten/issues/11779)
- PR: [#11780](https://github.com/apache/incubator-gluten/pull/11780)

This has both a fresh issue and immediate implementation PR, making it one of the clearest near-term roadmap items. Likely candidate for the next release if stability is acceptable.

#### 2. Block-level pruning via shuffle statistics
- PR: [#11769](https://github.com/apache/incubator-gluten/pull/11769)

The addition of per-block min/max/null stats in the shuffle writer is foundational work for **dynamic-filter-driven pruning** at the shuffle reader. This is exactly the kind of deep engine optimization that can materially improve distributed query efficiency.

#### 3. `approx_percentile` aggregate support
- PR: [#11651](https://github.com/apache/incubator-gluten/pull/11651)

This is a major SQL compatibility enhancement across **Core / Velox / ClickHouse**. The PR description shows serious semantic work around Spark fallback because **Velox KLL sketches** and **Spark GK-based state** are incompatible. Because this touches aggregate state representation, it may take longer to merge, but it is strategically important.

#### 4. Partial Project UDF optimization
- Issue: [#11783](https://github.com/apache/incubator-gluten/issues/11783)

This points toward reducing row-conversion overhead when only a small number of columns are passed back to Spark. It addresses a practical hybrid-execution pain point and may become an important micro-optimization for mixed native/JVM workloads.

#### 5. Parquet metadata-check limit optimization
- Issue: [#11782](https://github.com/apache/incubator-gluten/issues/11782)

This suggests maintainers are looking for a more scalable policy around metadata validation, especially for large partitioned tables. Likely to surface as a config or heuristic refinement rather than a headline feature.

#### 6. Version and compatibility maintenance
- PR: [#11734](https://github.com/apache/incubator-gluten/pull/11734)
- PR: [#11753](https://github.com/apache/incubator-gluten/pull/11753)
- PR: [#11787](https://github.com/apache/incubator-gluten/pull/11787)
- PR: [#11784](https://github.com/apache/incubator-gluten/pull/11784)
- PR: [#11726](https://github.com/apache/incubator-gluten/pull/11726)

These indicate continued focus on:
- ClickHouse engine version upgrades,
- Spark 3.2/3.3-specific write rule scoping,
- Spark adaptive plan compatibility,
- Scala/JDK build portability,
- Spark 4.0/4.1 variant support.

Together they signal that the next version will likely emphasize **compatibility breadth and backend resilience** as much as raw speedups.

---

## 7) User Feedback Summary

Current user feedback clusters around four pain points:

### 1. “Acceleration should not lose on trivial queries”
- Evidence: [#11766](https://github.com/apache/incubator-gluten/issues/11766)

Users are sensitive to regressions on simple LIMIT queries. This reflects a real-world expectation that engine acceleration must preserve good behavior for low-latency exploratory SQL, not just large scans and heavy joins.

### 2. Table-format compatibility matters in day-to-day SQL
- Evidence: [#11513](https://github.com/apache/incubator-gluten/issues/11513)

Users expect built-in Spark SQL functions like `input_file_name()` to behave identically across Iceberg, Hive, and Delta. Any inconsistency is immediately visible and disruptive.

### 3. GPU path users want better concurrency and fewer lock bottlenecks
- Evidence: [#11779](https://github.com/apache/incubator-gluten/issues/11779), [#11780](https://github.com/apache/incubator-gluten/pull/11780)

This suggests production GPU users are now past initial enablement and focusing on deeper throughput issues such as decompression parallelism and lock contention.

### 4. Contributors value portability and ecosystem fit
- Evidence: [#11778](https://github.com/apache/incubator-gluten/pull/11778), [#11784](https://github.com/apache/incubator-gluten/pull/11784), [#11786](https://github.com/apache/incubator-gluten/pull/11786)

Even seemingly small infra/docs changes show that users and contributors run Gluten in diverse environments and care about build reproducibility, shell portability, and installation clarity.

Overall sentiment is not “feature-starved”; it is more about **correctness, compatibility, and eliminating edge-case regressions** while continuing backend-specific optimization.

---

## 8) Backlog Watch

### Important older items still needing maintainer attention

#### 1. Velox upstream dependency tracker
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)

This is strategically important and should stay visible. Unmerged upstream Velox work can delay or fragment Gluten functionality. Maintainers may need to prioritize which patches are critical enough to vendor, defer, or redesign around.

#### 2. `approx_percentile` support remains open and complex
- PR: [#11651](https://github.com/apache/incubator-gluten/pull/11651)

This is a valuable SQL-compatibility feature but involves nontrivial aggregate-state interoperability. It likely needs close maintainer review because fallback semantics are easy to get wrong.

#### 3. Snappy support in Gluten columnar shuffle compression
- PR: [#11454](https://github.com/apache/incubator-gluten/pull/11454)

This older WIP PR is still open and stale-tagged. Compression codec flexibility is operationally important, especially for interoperability and performance tuning, so it may deserve re-triage.

#### 4. Variant test enablement for Spark 4.0/4.1
- PR: [#11726](https://github.com/apache/incubator-gluten/pull/11726)

Not old, but strategically significant. Variant type support is becoming more relevant in modern Spark SQL workflows, and enabling these suites is important for future-proof compatibility.

#### 5. ClickHouse backend version update
- PR: [#11734](https://github.com/apache/incubator-gluten/pull/11734)

This is open and active, and likely impactful for CH users. Backend version bumps can unlock functions and performance improvements, but also require careful compatibility validation.

---

## Bottom Line

Apache Gluten is showing **strong development momentum**, especially around the **Velox execution path**, shuffle optimizations, and cross-version Spark compatibility. The biggest immediate risk signals are **simple-query performance regressions** and the continued burden of **upstream Velox dependency gaps**. The strongest forward-looking themes are **GPU shuffle improvements**, **block-level shuffle pruning**, **SQL aggregate/function expansion**, and **format/backend correctness hardening**.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-19

## 1. Today's Overview

Apache Arrow showed **moderate-to-high daily maintenance activity** over the last 24 hours: **29 issues updated** and **19 PRs updated**, with **13 issues closed** and **7 PRs merged/closed**. The work mix is heavily weighted toward **C++ core, Python packaging/runtime behavior, Parquet tooling, and Flight SQL/ODBC integration**, which suggests the project is currently balancing platform hardening with ecosystem-facing usability improvements. No new releases were published today, so the focus remains on **incremental engineering progress rather than release delivery**. Overall health looks solid, with multiple small bugfixes landing quickly, though there are also several older strategic items still lingering in backlog.

## 3. Project Progress

### Merged/closed PRs today

#### Build, packaging, and dependency correctness
- **PR #49543** — Improve Arrow vcpkg port integration  
  Link: https://github.com/apache/arrow/pull/49543  
  Closed alongside issue [#49499](https://github.com/apache/arrow/issues/49499), this addresses a packaging/build integration problem where Release builds could incorrectly link debug Snappy/Brotli libraries under vcpkg multi-config generators. This is a meaningful **consumer build stability fix** for downstream C++ users on Windows and improves packaging correctness rather than engine semantics.

- **PR #49542** — `ARROW_FLIGHT_SQL=ON` and `ARROW_BUILD_EXAMPLES=ON` need gflags  
  Link: https://github.com/apache/arrow/pull/49542  
  This fixes a build dependency hole in C++/Flight SQL examples. While not a query-engine feature by itself, it improves **developer experience and SQL example build reliability**, reducing friction for adopters evaluating Flight SQL.

#### Python type/runtime correctness
- **PR #48746** — Construct `UuidArray` from list of `UuidScalars`  
  Link: https://github.com/apache/arrow/pull/48746  
  Closed today, this fixes issue [#48470](https://github.com/apache/arrow/issues/48470) and broadens correctness for **extension scalar to array conversion**, not just UUID. This is a small but important API consistency improvement in PyArrow, especially for typed application code and extension-type workflows.

#### Documentation fixes with contributor productivity impact
- **PR #49547** — Fix documented editable build commands  
  Link: https://github.com/apache/arrow/pull/49547  
  Closed immediately after issue [#49546](https://github.com/apache/arrow/issues/49546). This removes a contributor-facing doc error in Python editable builds.

#### Other closed work
- **PR #48882** — Draft PR to test wheels  
  Link: https://github.com/apache/arrow/pull/48882  
  Explicitly closed as CI experimentation.
- **PR #48763** — Add missing `CTypeTraits` for decimal types  
  Link: https://github.com/apache/arrow/pull/48763  
  Closed today; relevant for C++ generic type support.
- **PR #48414** — Require C++20  
  Link: https://github.com/apache/arrow/pull/48414  
  Closed today. Even though not merged, its closure is notable because it intersects with the separate ongoing migration toward standard library facilities like `std::span`.

### What this means technically
Today’s merged/closed work mostly advanced:
- **Build and packaging reliability** for downstream users
- **Python extension-type correctness**
- **Flight SQL developer usability**
- **Documentation quality**, which matters in a multi-language project with high contributor surface area

There were **no major landed query execution or storage-engine algorithm changes today**, but several open PRs indicate such work is actively progressing.

## 4. Community Hot Topics

### 1) Trusted publishing for PyPI wheels
- **Issue #44733** — [CI][Python] Investigate trusted publishing for uploading wheels to PyPI  
  Link: https://github.com/apache/arrow/issues/44733  
  Most discussed among active issues today (**16 comments**). This reflects a strong underlying need for **software supply chain security**, especially for PyArrow wheels. For a foundational data library with broad distribution, trusted publishing and attestations are becoming table stakes.

### 2) `StructBuilder` unsafe append APIs for high-performance C++
- **Issue #45722** — [C++] StructBuilder should have UnsafeAppend methods  
  Link: https://github.com/apache/arrow/issues/45722  
  With **13 comments**, this is a clear performance-oriented request from C++ users. The technical need is to reduce overhead in **high-throughput array construction**, which is directly relevant to ingestion pipelines and vectorized compute workloads.

### 3) Span migration / C++20 modernization
- **Issue #36612** — [C++] Ensure compatibility between `std::span` and `arrow::util::span`  
  Link: https://github.com/apache/arrow/issues/36612  
- **PR #49492** — [C++] Migrate to stdlib span  
  Link: https://github.com/apache/arrow/pull/49492  
  This issue closed today, while the migration PR remains open. Together they indicate an architectural trend: Arrow C++ is continuing to **shed custom compatibility layers in favor of standard C++20 APIs**. That lowers maintenance cost and helps integrators.

### 4) Flight SQL ODBC layer
- **PR #46099** — [C++] Arrow Flight SQL ODBC layer  
  Link: https://github.com/apache/arrow/pull/46099  
  This remains one of the most strategically important open PRs. It points to Arrow’s push into **SQL connectivity and BI/ODBC interoperability**, especially on Windows first, with Linux/macOS later. That is a major adoption lever for analytical infrastructure.

### 5) Python doc/ecosystem interoperability around PyCapsule
- **Issue #47696** — [Docs][Python] PyCapsule protocol implementation status  
  Link: https://github.com/apache/arrow/issues/47696  
- **PR #49550** — [Docs] PyCapsule protocol implementation status  
  Link: https://github.com/apache/arrow/pull/49550  
  This topic highlights ongoing demand for **zero-copy interoperability across Python data libraries**. Users want visibility into which ecosystem projects support Arrow’s capsule protocol, a sign that interoperability remains a top-value theme.

## 5. Bugs & Stability

Ranked roughly by user impact/severity based on current data:

### High severity
#### 1) Potential memory leak during dataset batch iteration
- **Issue #49474** — [Python] Memory Leak while iterating batches of pyarrow dataset  
  Link: https://github.com/apache/arrow/issues/49474  
  This is the most operationally serious newly active bug. The reporter describes **OOM kills on an HPC cluster** while iterating/filtering batches from a large hive-partitioned Parquet dataset. This directly impacts Arrow’s analytical-read use cases. **No fix PR is listed yet.**

### Medium severity
#### 2) Zero-row table loses schema via `Table.to_batches()`
- **Issue #49309** — [Python] `Table.to_batches()` loses schema information when table has zero rows  
  Link: https://github.com/apache/arrow/issues/49309  
  This is a **correctness and API semantics** issue rather than a crash. It can break edge-case pipelines that depend on preserving schema through empty intermediate results. **No linked fix PR is shown.**

#### 3) `parquet-scan` CLI shows IO error instead of usage
- **Issue #49539** — [C++][Parquet] parquet-scan doesn't show the usage info  
  Link: https://github.com/apache/arrow/issues/49539  
- **PR #49540** — Fix argument count check in `parquet_scan`  
  Link: https://github.com/apache/arrow/pull/49540  
  Low technical complexity, but a good example of rapid maintainer response. This improves **tooling usability** for Parquet users.

#### 4) Flight SQL example/build dependency breakage
- **Issue #49541** — [C++] `ARROW_FLIGHT_SQL=ON` and `ARROW_BUILD_EXAMPLES=ON` miss gflags dependency  
  Link: https://github.com/apache/arrow/issues/49541  
- **PR #49542** — Fix  
  Link: https://github.com/apache/arrow/pull/49542  
  Already resolved quickly; impacts developers building Flight SQL examples.

#### 5) ODBC Linux certificate verification default
- **Issue #49551** — [C++][FlightRPC][ODBC] Enable `DISABLE_CERTIFICATE_VERIFICATION` default value on Linux  
  Link: https://github.com/apache/arrow/issues/49551  
  Closed same day. The title suggests a security-sensitive area, but based on the description it appears more about platform behavior alignment in the ODBC layer than a broad engine vulnerability.

### Recently resolved stability items
- **Issue #49499** — vcpkg Release/Debug library mismatch  
  Link: https://github.com/apache/arrow/issues/49499  
  Resolved quickly via PR #49543.
- **Issue #48470** — Cannot construct `UuidArray` from `UuidScalar`s  
  Link: https://github.com/apache/arrow/issues/48470  
  Resolved via PR #48746.

## 6. Feature Requests & Roadmap Signals

### Strong signals likely to influence upcoming releases

#### Flight SQL / ODBC expansion
- **Issue #49552** — Enable ODBC test build on Linux  
  Link: https://github.com/apache/arrow/issues/49552  
- **PR #46099** — Arrow Flight SQL ODBC layer  
  Link: https://github.com/apache/arrow/pull/46099  
This is the clearest roadmap signal today. Arrow is investing in **Flight SQL as a production connectivity layer**, with Windows support ahead and Linux enablement actively requested. Expect continued work here in the next version cycle.

#### Decoupling Flight serialization from gRPC
- **Issue #49548** — Decouple Flight Serialize/Deserialize from gRPC transport  
  Link: https://github.com/apache/arrow/issues/49548  
- **PR #49549** — Implementation  
  Link: https://github.com/apache/arrow/pull/49549  
This is a significant architectural request. If completed, it could improve **transport abstraction**, reduce coupling, and broaden Flight implementation flexibility. Because the PR notes **breaking public API changes**, this may target a larger milestone rather than a quick patch release.

#### Parquet writer observability / row group sizing control
- **PR #49527** — Add `total_buffered_bytes()` API for `RowGroupWriter`  
  Link: https://github.com/apache/arrow/pull/49527  
This is a practical storage-engine enhancement. Exposing buffered byte counts helps users decide when to roll row groups, which can directly affect **Parquet file layout, memory use, and downstream query efficiency**. This is a good candidate for near-term inclusion because it is focused and user-driven.

#### C++20 modernization
- **PR #49492** — Migrate to stdlib span  
  Link: https://github.com/apache/arrow/pull/49492  
This is part of a broader modernization wave. Likely to land gradually in upcoming releases as maintainers reduce custom utility surface.

#### Windows ARM64 PyArrow build support
- **PR #48539** — Add support for building PyArrow library on Windows ARM64  
  Link: https://github.com/apache/arrow/pull/48539  
A strong platform-expansion signal. Given growing ARM adoption, this feels likely to continue receiving attention, though CI and packaging complexity may delay final delivery.

#### Ruby performance benchmarking
- **Issue #49544** / **PR #49545** — Add benchmark for readers  
  Issue: https://github.com/apache/arrow/issues/49544  
  PR: https://github.com/apache/arrow/pull/49545  
Not core-engine roadmap, but it signals greater emphasis on **measurable reader performance** in non-Python bindings too.

## 7. User Feedback Summary

Today’s user-visible pain points are fairly clear:

- **Memory efficiency under real analytical workloads remains critical**. The HPC report in [#49474](https://github.com/apache/arrow/issues/49474) shows PyArrow dataset iteration can still hit practical limits in large Parquet scans.
- **Edge-case correctness matters for pipeline frameworks**, as seen in [#49309](https://github.com/apache/arrow/issues/49309), where empty results lose schema metadata.
- **Build/package friction is still a major theme**, especially for C++ consumers on Windows and vcpkg users: [#49499](https://github.com/apache/arrow/issues/49499), [#49541](https://github.com/apache/arrow/issues/49541), and the trusted publishing discussion in [#44733](https://github.com/apache/arrow/issues/44733).
- **Interoperability and connector usability are in demand**, particularly around Flight SQL, ODBC, and Python data exchange protocols: [#46099](https://github.com/apache/arrow/pull/46099), [#49548](https://github.com/apache/arrow/issues/49548), [#47696](https://github.com/apache/arrow/issues/47696).
- Users also continue asking for **high-performance low-level APIs** in C++, such as unsafe builder append paths in [#45722](https://github.com/apache/arrow/issues/45722).

Overall, feedback suggests Arrow is valued as infrastructure, but users are pushing hard on:
1. predictable memory behavior,
2. packaging/build reliability,
3. interoperability with SQL and Python ecosystems,
4. performance-oriented APIs.

## 8. Backlog Watch

These older items look important enough to merit maintainer attention:

### Long-running open PRs
- **PR #46099** — Flight SQL ODBC layer  
  https://github.com/apache/arrow/pull/46099  
  Strategically important for SQL connectivity; still open after a long cycle.
- **PR #40354** — Python wrapper for `VariableShapeTensor`  
  https://github.com/apache/arrow/pull/40354  
  Long-lived feature PR touching Python/C++ integration; likely needs renewed review to avoid drift.
- **PR #48539** — Windows ARM64 PyArrow builds  
  https://github.com/apache/arrow/pull/48539  
  Important platform support item, but still awaiting changes.
- **PR #48622** — Internal type system stubs for PyArrow  
  https://github.com/apache/arrow/pull/48622  
  Valuable for typing/tooling, but appears to be progressing slowly.
- **PR #47377** — Selective execution for kernels  
  https://github.com/apache/arrow/pull/47377  
  This has potentially meaningful compute-engine implications and may deserve prioritization if selective execution is a near-term compute roadmap goal.

### Long-open issues still active today
- **Issue #31298** — [C++] Provide a way to go from numeric to duration  
  https://github.com/apache/arrow/issues/31298  
  Labeled critical and still open; could affect language binding ergonomics and type conversion consistency.
- **Issue #31338** — [Python][FlightRPC] Log uncaught exceptions by default  
  https://github.com/apache/arrow/issues/31338  
  Longstanding usability/debuggability issue for Flight server users.
- **Issue #31296** — [C++] Add nightly test for static build with `arrow_flight_static` and bundled deps  
  https://github.com/apache/arrow/issues/31296  
  Important preventive CI coverage for a historically brittle build configuration.
- **Issue #20139** — [C++] Method accepting Substrait plan and returning `RecordBatchReader`  
  https://github.com/apache/arrow/issues/20139  
  Architecturally relevant to execution interoperability; worth revisiting as Substrait adoption matures.
- **Issue #20144** — [C++] Add a C++ query testing tool  
  https://github.com/apache/arrow/issues/20144  
  Could materially improve benchmarking and regression testing for compute/query work.

## Bottom Line

Apache Arrow’s current trajectory is healthy: **quick fixes are landing, build and packaging quality is improving, and Flight SQL/ODBC remains a major strategic investment area**. The biggest near-term risks are less about release instability and more about **unresolved operational bugs** such as PyArrow dataset memory behavior and a handful of **long-running roadmap PRs** that need sustained maintainer attention.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*