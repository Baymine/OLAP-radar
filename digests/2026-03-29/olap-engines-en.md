# Apache Doris Ecosystem Digest 2026-03-29

> Issues: 8 | PRs: 50 | Projects covered: 10 | Generated: 2026-03-29 01:43 UTC

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

# Apache Doris Project Digest — 2026-03-29

## 1. Today's Overview

Apache Doris remained highly active over the last 24 hours, with **50 pull requests updated** and **8 issues updated**, indicating strong ongoing engineering throughput despite no new release being cut today. Development focus was concentrated on **query correctness, storage/cache robustness, external table compatibility, and memory control in data loading paths**. The issue stream was relatively light and somewhat skewed by stale-issue closures, while the PR stream showed meaningful work landing in **Parquet, Iceberg, file cache, FE planner/parser, Azure/S3 object storage, and function extensibility**. Overall, project health looks **solid and execution-oriented**, with maintainers continuing to backport fixes across active branches such as **3.0, 4.0, and 4.1**.

## 3. Project Progress

### Merged/closed PRs today: notable engineering progress

#### Build and toolchain stability
- **[PR #61836](https://github.com/apache/doris/pull/61836)** — **[fix](build)** Fix compilation errors with implicit conversions and unnecessary virtual keywords  
  This improves build portability and sanitizer compatibility, especially around **Clang/GCC differences** and stricter type conversion handling. This is low-level work, but important for keeping CI and contributor environments healthy.

#### File cache and storage memory behavior
- **[PR #61812](https://github.com/apache/doris/pull/61812)** — branch-4.1 **[fix](filecache)** add async LRU update mechanism and fix partial hit in cache reader  
  This addresses both **cache correctness** and **performance overhead** in remote file reads. The async LRU update design suggests Doris is continuing to optimize hybrid local/remote storage scenarios.
- **[PR #61834](https://github.com/apache/doris/pull/61834)** — branch-4.1 **[fix](filecache)** reclaim expired tablet hotspot counters and compact sparse shards  
  A notable storage-side memory optimization: hotspot metadata was reportedly growing by **~1.8–2.7 GB/day**. This is a substantial fix for long-running clusters with file cache enabled.
- **[PR #61683](https://github.com/apache/doris/pull/61683)** — **[fix](filecache)** pass tablet_id through `FileReaderOptions` instead of parsing from path  
  This improves compatibility with **packed file / small-file merge modes**, removing a brittle dependency on path structure.

#### Query parser / planner correctness
- **[PR #61813](https://github.com/apache/doris/pull/61813)** — **[fix](fe)** Fix duplicate `RelationId` bug caused by subquery in simple CASE  
- **[PR #61830](https://github.com/apache/doris/pull/61830)** — branch-4.0 backport of #61813  
  This is a direct **SQL correctness fix** in the FE for a specific subquery + CASE parsing path. The backport indicates maintainers considered it important enough for stable branches.

#### Catalog refactoring
- **[PR #61816](https://github.com/apache/doris/pull/61816)** — **[refactor](catalog)** decouple `Column` from non-essential classes  
  While not user-facing on its own, this kind of refactor usually signals effort to **reduce FE coupling**, improve maintainability, and ease future metadata-layer enhancements.

#### Recursive CTE integration work
- **[PR #61806](https://github.com/apache/doris/pull/61806)** — **[Chore](pick)** recursive CTE BE part  
  This closed PR is not the full feature itself, but it indicates **recursive CTE support continues to be assembled from prior work**, with BE-side components being picked in.

#### Branch propagation and maintenance
- **[PR #61839](https://github.com/apache/doris/pull/61839)** — branch-4.1 backport for Parquet INT96 timestamp writing fix  
- **[PR #56215](https://github.com/apache/doris/pull/56215)** and **[PR #56216](https://github.com/apache/doris/pull/56216)** — stale-closed older branch PRs for JDBC catalog quoting behavior  
  Backport flow remains active, which is a healthy sign for downstream adopters operating on multiple maintained release lines.

## 4. Community Hot Topics

> Comment counts and reactions are sparse in the provided data, so “hot topics” are inferred from recency, branch coverage, review status, and technical impact.

### 1) Recursive CTE support is emerging as a major SQL roadmap item
- **[PR #61283](https://github.com/apache/doris/pull/61283)** — **[Feature](cte)** support recursive cte FE part
- **[PR #61806](https://github.com/apache/doris/pull/61806)** — recursive CTE BE pick

**Analysis:** Recursive CTE is a meaningful SQL feature gap for many analytical engines. Continued FE/BE split work implies demand from users needing **hierarchical queries, graph-like traversals, org trees, bill-of-materials expansion, and iterative SQL workflows**. This looks like a serious roadmap item rather than an exploratory patch.

### 2) External lakehouse/table interoperability remains a strategic focus
- **[PR #61398](https://github.com/apache/doris/pull/61398)** — **[feat](iceberg)** Support Iceberg v3 row lineage
- **[PR #61848](https://github.com/apache/doris/pull/61848)** — branch-4.1 backport of Iceberg v3 row lineage
- **[PR #61513](https://github.com/apache/doris/pull/61513)** — **[fix](fe)** Fix Paimon JDBC driver registration for JNI scans
- **[PR #61802](https://github.com/apache/doris/pull/61802)** — **[fix](scan)** missing predicate filter when Native and JNI readers are mixed
- **[PR #61840](https://github.com/apache/doris/pull/61840)** — branch-4.1 CDC stream TVF for MySQL and PostgreSQL

**Analysis:** Doris users are clearly pushing the system not just as an internal OLAP engine, but as a **multi-source query and lakehouse serving engine**. The technical needs behind these changes are interoperability, correctness across mixed reader stacks, and better support for **Iceberg/Paimon/CDC ingestion patterns**.

### 3) Object storage and remote IO correctness are getting sustained attention
- **[PR #61790](https://github.com/apache/doris/pull/61790)** — **[fix](azure)** incorrect modification timestamps in Azure object storage
- **[PR #61843](https://github.com/apache/doris/pull/61843)** — **[fix](s3)** limit-aware brace expansion and glob metrics fix
- **[Issue #56605](https://github.com/apache/doris/issues/56605)** — **[Bug]** failed to delete remote rowset / failed to check path existence

**Analysis:** This cluster of work points to real-world usage of Doris with **cloud object stores and cold/hybrid storage tiers**. Users need durable, observable, and predictable remote storage semantics, especially for backup, historical partitions, and external data access.

### 4) Memory control is a persistent operational concern
- **[PR #61821](https://github.com/apache/doris/pull/61821)** — **[opt](memory)** limit max block bytes per batch
- **[Issue #58781](https://github.com/apache/doris/issues/58781)** — **[Enhancement]** optimize memory in load(insert/delete/update) path

**Analysis:** The repeated focus here suggests users continue to hit memory pressure in **load/import pipelines**, especially with wide rows or nested types. This is highly relevant for production operators.

## 5. Bugs & Stability

### Highest severity / broadest impact

#### 1) Compaction may fail when tablet state changes during execution
- **[Issue #61823](https://github.com/apache/doris/issues/61823)** — **[Bug]** compaction can fail if balance or other operations trigger state change  
  **Severity:** High  
  **Why it matters:** Compaction is central to storage health, read amplification control, and long-term performance. A state-change race in compaction could lead to stalled maintenance and degraded cluster behavior.  
  **Fix PR status:** No linked fix in the provided data.

#### 2) Missing predicate filtering when Native and JNI readers are mixed
- **[PR #61802](https://github.com/apache/doris/pull/61802)** — **[fix](scan)** FileScanner loses predicate filter in mixed Native/JNI scenarios  
  **Severity:** High  
  **Why it matters:** This is a **query correctness bug** affecting external table reads, especially Paimon-like scenarios. Users may receive rows that should have been filtered out.  
  **Fix PR status:** Open.

#### 3) RPC callback reuse data race
- **[PR #61782](https://github.com/apache/doris/pull/61782)** — **[fix](rpc)** Fix AutoReleaseClosure data race with callback reuse  
  **Severity:** High  
  **Why it matters:** Concurrency bugs in the RPC layer can manifest as hard-to-reproduce failures or incorrect error handling under load.  
  **Fix PR status:** Open, tagged for **dev/4.0.x** and **dev/4.1.x**.

### Medium severity

#### 4) Parquet INT96 timestamp write bug
- **[PR #61832](https://github.com/apache/doris/pull/61832)** — **[fix](parquet)** write timestamp INT96 type
- **[PR #61847](https://github.com/apache/doris/pull/61847)** — branch-4.1 backport
- **[PR #61839](https://github.com/apache/doris/pull/61839)** — closed branch cherry-pick

**Severity:** Medium-High  
**Why it matters:** Timestamp encoding issues affect **data interoperability and correctness**, especially when exchanging Parquet data with external ecosystems.

#### 5) Azure object storage modification timestamp bug
- **[PR #61790](https://github.com/apache/doris/pull/61790)**  
  **Severity:** Medium  
  **Why it matters:** Incorrect timestamps can break listing logic, freshness checks, cache invalidation assumptions, or incremental workflows.

#### 6) Segment not found handling in query/load path
- **[PR #61844](https://github.com/apache/doris/pull/61844)** — **[opt](segment)** Ignore not-found segments in query and load paths  
  **Severity:** Medium  
  **Why it matters:** This appears aimed at making Doris more resilient when segment files disappear due to GC or external causes. It improves availability, though operators should monitor whether this masks deeper storage issues.

### Lower-severity / older issue resurfacing via stale handling

- **[Issue #56242](https://github.com/apache/doris/issues/56242)** — logical view with aggregation query failed  
- **[Issue #56233](https://github.com/apache/doris/issues/56233)** and **[#56235](https://github.com/apache/doris/issues/56235)** — Java UDF-related bug reports  
These were closed as stale rather than actively resolved today, so they do not indicate fresh triage progress.

## 6. Feature Requests & Roadmap Signals

### Strong signals

#### Recursive CTE support
- **[PR #61283](https://github.com/apache/doris/pull/61283)**  
This is one of the clearest signs of near-term SQL feature expansion. Given FE and BE work are both visible, recursive CTE support has a reasonable chance of landing in an upcoming major/minor line.

#### Iceberg v3 row lineage
- **[PR #61398](https://github.com/apache/doris/pull/61398)**  
- **[PR #61848](https://github.com/apache/doris/pull/61848)**  
This is a strong roadmap signal for Doris as a more capable **Iceberg query engine**, especially for metadata-aware workloads and future write-path governance.

#### New scalar function enhancements
- **[PR #60892](https://github.com/apache/doris/pull/60892)** — add `limit` parameter to `SPLIT_BY_STRING`
- **[PR #61846](https://github.com/apache/doris/pull/61846)** — support `murmur_hash3_u64_v2(str)`

These incremental function improvements suggest ongoing investment in **SQL ergonomics and compatibility with application-side hashing/text-processing use cases**.

### User-requested features from issues

#### Metadata lineage / auditability for tables and databases
- **[Issue #56486](https://github.com/apache/doris/issues/56486)** — add `create_user` and `created_at` for database and table in Doris  
This points to enterprise governance needs: users want richer built-in metadata for **ownership, creation audit, and catalog observability**.

#### Apache DataSketches integration
- **[Issue #56246](https://github.com/apache/doris/issues/56246)** — integrate with Apache DataSketches  
Although closed stale, the request is strategically relevant. Approximate analytics remains a natural fit for Doris, and such functionality could resurface later in a more concrete form.

### Likely next-version candidates
Based on active PR status and branch targeting, the most plausible near-term inclusions are:
1. **Parquet timestamp interoperability fixes**  
2. **RPC race and scan predicate correctness fixes**  
3. **Memory controls in load/import path**  
4. **Iceberg v3 row lineage support**  
5. **Function-level enhancements like SPLIT_BY_STRING limit support**

## 7. User Feedback Summary

### Main pain points surfacing from users

#### 1) Operational reliability in remote/cold storage setups
- **[Issue #56605](https://github.com/apache/doris/issues/56605)**  
A user running **remote HDFS with Kerberos** for cold storage reported failure deleting remote rowsets and path existence checks. This reflects a practical production use case: tiered storage and backup workflows remain sensitive integration points.

#### 2) Storage maintenance races and compaction robustness
- **[Issue #61823](https://github.com/apache/doris/issues/61823)**  
The report suggests users are encountering compaction edge cases in the presence of **balance/state-change operations**, which is exactly the kind of issue large clusters experience.

#### 3) Memory pressure during ingestion
- **[Issue #58781](https://github.com/apache/doris/issues/58781)** and **[PR #61821](https://github.com/apache/doris/pull/61821)**  
The project is clearly responding to user/operator demand for better **memory predictability in load paths**.

#### 4) Better metadata/audit visibility
- **[Issue #56486](https://github.com/apache/doris/issues/56486)**  
Users want Doris metadata to be more enterprise-ready, especially around **creator identity and creation timestamps**.

### Satisfaction signals
Although explicit positive reactions are absent in the provided data, the strong number of **approved/reviewed PRs** and active branch backports suggests maintainers are responsive in areas that directly affect production reliability.

## 8. Backlog Watch

### Open items needing maintainer attention

#### 1) Compaction state-change bug
- **[Issue #61823](https://github.com/apache/doris/issues/61823)**  
This is the most important open issue in the current snapshot due to possible impact on storage health across all versions.

#### 2) Remote rowset deletion / HDFS-Kerberos path existence failures
- **[Issue #56605](https://github.com/apache/doris/issues/56605)**  
Marked stale but still open. Given real-world cold-storage relevance, this likely deserves explicit triage instead of eventual stale closure.

#### 3) Metadata audit fields request
- **[Issue #56486](https://github.com/apache/doris/issues/56486)**  
Low complexity, potentially high enterprise value. This could be a good candidate for community contribution if maintainers clarify design scope.

### Open PRs with high value that should keep moving

#### 4) Recursive CTE FE work
- **[PR #61283](https://github.com/apache/doris/pull/61283)**  
A strategically important SQL capability; worth sustained review attention.

#### 5) Global monotonically increasing TSO
- **[PR #61199](https://github.com/apache/doris/pull/61199)**  
This is a significant architecture-level feature with implications for transactions and future distributed semantics. It should not stall without clear design review outcomes.

#### 6) Predicate correctness for mixed Native/JNI file scanning
- **[PR #61802](https://github.com/apache/doris/pull/61802)**  
High practical value because it addresses a correctness issue in external-table scans.

#### 7) Memory guardrails in load path
- **[PR #61821](https://github.com/apache/doris/pull/61821)**  
Operationally important for users ingesting large rows or nested data.

---

## Overall Health Assessment

Apache Doris shows **healthy and sustained momentum**: active code review, multi-branch maintenance, and continued work on both core OLAP internals and lakehouse interoperability. The strongest technical themes today were **correctness under concurrency and mixed execution paths, memory discipline, object/file cache stability, and external ecosystem support**. The main risk area is that some important user issues remain open or are drifting into stale status, especially around **compaction races and remote storage reliability**. Even so, the development stream suggests a project that is actively maturing for demanding production workloads.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-29

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, but the center of gravity differs by project: some engines are shipping rapidly with broad issue/PR volume, while others are focused on targeted correctness, interoperability, or architecture work. Across the landscape, the strongest common themes are **lakehouse interoperability, cloud/object-storage behavior, memory control, SQL correctness, and streaming/CDC support**. Query planners and analyzers are still a major source of innovation and regressions, especially in engines pushing new execution frameworks. Overall, the ecosystem looks healthy and increasingly production-oriented, with most projects balancing feature growth against reliability hardening.

---

## 2. Activity Comparison

### Daily activity snapshot

| Engine | Issues Updated | PRs Updated | Releases Today | Release Status | Health Score* | Notes |
|---|---:|---:|---|---|---:|---|
| **ClickHouse** | 27 | 295 | 3 | Very active multi-line release maintenance | **9.5/10** | Highest visible throughput; strong release discipline; analyzer stabilization remains key risk |
| **Apache Doris** | 8 | 50 | 0 | No release today; active multi-branch backports | **8.7/10** | Strong execution on correctness, cache/storage, external table support |
| **Apache Iceberg** | 6 | 24 | 0 | No release today | **8.4/10** | Healthy multi-engine format work; some high-impact stale correctness issues |
| **DuckDB** | 11 | 24 | 0 | No release today | **8.3/10** | Strong core-engine progress; cloud/memory edge cases still visible |
| **Delta Lake** | 2 | 12 | 0 | No release today | **8.0/10** | Roadmap-heavy day; important CDC work active but not yet merged |
| **Apache Arrow** | 17 | 6 | 0 | No release today | **8.0/10** | Stable ecosystem hardening; less engine-centric, more infra/connectivity focus |
| **StarRocks** | 1 | 9 | 0 | No release today | **7.9/10** | Lower visible volume, but meaningful cloud/lakehouse roadmap activity |
| **Velox** | 0 | 9 | 0 | No release today | **7.8/10** | Healthy infra/core-engine activity; limited external sentiment visible today |
| **Apache Gluten** | 1 | 3 | 0 | No release today | **7.4/10** | Active but dependency-constrained by Velox upstream |
| **Databend** | 1 | 1 | 0 | No release today | **7.0/10** | Quiet day; focused correctness work only |

\*Health score is a comparative qualitative estimate derived from visible activity, merge/release cadence, breadth of engineering work, and risk signals in the digest.

### Quick ranking by visible momentum
1. **ClickHouse**
2. **Apache Doris**
3. **DuckDB / Iceberg**  
4. **Delta Lake / Arrow / StarRocks**
5. **Velox**
6. **Gluten**
7. **Databend**

---

## 3. Apache Doris's Position

### Where Doris stands out

**Apache Doris is in a strong middle-top position**: not as high-volume as ClickHouse, but clearly more active than most peers in day-to-day merged engineering with visible multi-branch maintenance. Its current work shows a practical balance between **core OLAP engine reliability** and **lakehouse/external data interoperability**.

### Advantages vs peers

- **Balanced engine + lakehouse posture**  
  Doris is not only optimizing native storage/query paths; it is also actively improving **Iceberg, Paimon, CDC TVF, JDBC/JNI/native mixed scans**, and object-storage behavior. That gives it broader deployment flexibility than engines focused mainly on either native OLAP or file-format layers.

- **Strong branch maintenance discipline**  
  Visible backports across **3.0, 4.0, and 4.1** show a mature operational model for production users. This is closer to ClickHouse’s disciplined branch maintenance than to projects where most innovation remains on open PRs without release propagation.

- **Operationally grounded fixes**  
  Doris work today directly addressed **file cache metadata growth, partial-hit cache correctness, parser/planner correctness, memory limits in load paths, Azure/S3 bugs, and Parquet timestamp interoperability**. These are practical fixes with immediate production value.

- **Integrated OLAP system orientation**  
  Compared with Iceberg/Delta/Arrow, Doris offers a more complete integrated engine experience: storage engine, query engine, metadata/catalog, ingestion, and external connectors in one system.

### Technical approach differences

Compared with peers:

- **vs ClickHouse**: Doris appears slightly more focused on **federation/external-table correctness and hybrid storage behavior**, while ClickHouse shows larger-scale effort around **analyzer/planner migration and release engineering**.
- **vs DuckDB**: Doris is more clearly a **distributed analytical database** for service-style deployments, while DuckDB is centered on **embedded/local analytics** and increasingly cloud-connected execution.
- **vs StarRocks**: Doris and StarRocks are close in product category, but Doris currently shows **broader active maintenance volume** and more visible work on file cache, planner correctness, and external scan correctness.
- **vs Iceberg/Delta**: Doris is a compute engine first; Iceberg and Delta are table format / transaction layer ecosystems first.
- **vs Velox/Gluten/Arrow**: Doris is end-user database infrastructure, whereas those projects are execution frameworks or data-layer components.

### Community size comparison

By visible GitHub motion today:
- **Much smaller than ClickHouse**
- **Larger and more execution-active than StarRocks, Delta Lake, Databend, Gluten, Velox**
- **Comparable to or stronger than DuckDB and Iceberg in practical engine-facing maintenance**
- **Broader user-facing database activity than Arrow, which has a larger ecosystem role but different scope**

**Bottom line:** Doris looks like a **healthy, maturing top-tier open-source OLAP database project**, especially for teams wanting integrated analytics plus growing lakehouse interoperability.

---

## 4. Shared Technical Focus Areas

### Cross-project requirements emerging now

| Focus Area | Engines | Specific Needs Emerging |
|---|---|---|
| **Lakehouse / external table interoperability** | Doris, StarRocks, Iceberg, Delta Lake, DuckDB | Iceberg support, Paimon/JNI/native scan correctness, VARIANT reads, Flink/Spark compatibility, file format fidelity |
| **Object storage correctness and efficiency** | Doris, ClickHouse, DuckDB, Arrow, StarRocks, Iceberg | S3/Azure/HDFS behavior, request amplification, timestamp/listing correctness, external file cache efficiency, cloud auth ergonomics |
| **Memory governance** | Doris, DuckDB, ClickHouse, Arrow | Load-path memory caps, per-connection memory limits, low-memory operation, backpressure/memory-aware execution |
| **Query planner / analyzer correctness** | Doris, ClickHouse, DuckDB, Velox, Gluten | CASE/subquery handling, analyzer regressions, distributed query semantics, aggregate null behavior, set-operator correctness |
| **Streaming / CDC** | Doris, Delta Lake, StarRocks, ClickHouse | CDC TVFs, kernel-spark CDC, Kafka engine reliability, Avro streaming ingestion correctness |
| **Semi-structured data support** | Doris, DuckDB, StarRocks, Databend, Velox | VARIANT casting, nested/list/struct correctness, shredded VARIANT reads, JSON-like type fidelity |
| **Multi-engine ecosystem integration** | Doris, Iceberg, Delta Lake, Arrow, Gluten | Spark/Flink compatibility, JDBC/ODBC metadata, C API/type support, upstream dependency sync |

### Most notable shared needs

1. **Cloud/object storage is now a first-class production requirement**  
   - Doris: Azure/S3/file cache/remote rowset concerns  
   - ClickHouse: S3 observability, PUT amplification  
   - DuckDB: S3 export/query performance  
   - Arrow: Azure Blob, packaging/cloud deps  
   - Iceberg: ADLS explicit credentials, Glue/Hive commit safety

2. **Correctness is increasingly about edge-path semantics, not just crashes**  
   - Doris: mixed Native/JNI predicate loss, parser RelationId bug  
   - ClickHouse: analyzer regressions, distributed alias/GROUPING semantics  
   - DuckDB: nested types and timestamptz macro regressions  
   - Velox/Gluten: Spark-compatible aggregate semantics  
   - Databend: VARIANT numeric coercion

3. **Streaming and CDC are moving into the mainstream analytical stack**  
   - Delta Lake is pushing hard on CDC streaming maturity  
   - Doris is strengthening CDC table-valued functions  
   - StarRocks has ingestion compatibility pressure  
   - ClickHouse still has Kafka reliability concerns

---

## 5. Differentiation Analysis

### By storage format and data model

- **Apache Doris / ClickHouse / StarRocks**  
  Primarily **database engines with native execution and storage**, while increasingly supporting external/lakehouse sources.
  
- **DuckDB**  
  Embedded analytical engine with strong local execution, increasingly extended toward remote/object-store use and modern nested types.

- **Iceberg / Delta Lake**  
  **Table format + transaction/metadata ecosystems**, not full standalone query engines. Their differentiation is around metadata correctness, engine interoperability, and table semantics.

- **Arrow**  
  Cross-language in-memory/data interchange and compute substrate, not a direct OLAP database.

- **Velox / Gluten**  
  Execution framework and acceleration layer rather than a complete user-facing database.

### By query engine design

- **ClickHouse**: Highly optimized native engine; major current emphasis on new analyzer/planner migration.
- **Doris**: Integrated MPP OLAP engine with strong FE/BE split, practical focus on planner correctness, load path control, and external scans.
- **StarRocks**: Similar category to Doris, with current focus on cloud shared-data architecture and external semi-structured reads.
- **DuckDB**: In-process vectorized engine optimized for embedded and single-node analytics.
- **Velox/Gluten**: Modular execution backend / Spark acceleration stack.
- **Iceberg/Delta**: Rely on external engines for execution.

### By target workload

| Engine | Best-aligned workload profile |
|---|---|
| **Doris** | Real-time and interactive OLAP with integrated ingestion and growing external-data federation |
| **ClickHouse** | High-throughput analytics at large scale, especially where release velocity and aggressive performance optimization are acceptable |
| **StarRocks** | Cloud-native OLAP and lakehouse serving, especially shared-data deployments |
| **DuckDB** | Embedded analytics, notebook/data science workflows, local and application-integrated OLAP |
| **Iceberg** | Open table management across many engines and storage systems |
| **Delta Lake** | Spark-centric lakehouse transactions and CDC-heavy data pipelines expanding toward multi-engine support |
| **Arrow** | Data interchange, libraries, connectivity, and execution substrate |
| **Velox/Gluten** | Acceleration infrastructure for higher-level engines |
| **Databend** | Cloud analytics with semi-structured support, though quieter in current visible momentum |

### By SQL compatibility direction

- **ClickHouse**: Actively expanding PostgreSQL-like usability, but analyzer migration still causes compatibility churn.
- **Doris**: Improving SQL completeness with recursive CTE and function additions; pragmatic compatibility work visible.
- **DuckDB**: Broad SQL usability, especially around nested and semi-structured semantics.
- **StarRocks**: Focused on operational features and external-data semantics more than visible SQL-surface expansion today.
- **Gluten/Velox**: Spark semantic parity is a key theme.
- **Arrow/Gandiva**: Function coverage requests continue, but SQL is not the primary product layer.

---

## 6. Community Momentum & Maturity

### Activity tiers

#### Tier 1: Rapidly iterating at scale
- **ClickHouse**
- **Apache Doris**

These projects combine high engineering throughput with clear production hardening. ClickHouse leads in raw volume and releases; Doris shows strong execution with active stable-branch care.

#### Tier 2: Strong momentum, focused evolution
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **StarRocks**

These projects are healthy, but their current activity is more concentrated:
- DuckDB: core engine and cloud ergonomics
- Iceberg: multi-engine correctness and format parity
- Delta: CDC and Flink roadmap work
- StarRocks: cloud/shared-data and lakehouse features

#### Tier 3: Infrastructure/platform projects with targeted motion
- **Arrow**
- **Velox**
- **Gluten**

These are mature and important, but their momentum is expressed through ecosystem or backend work rather than end-user database feature flow.

#### Tier 4: Low visible activity today
- **Databend**

This reflects the day’s snapshot, not necessarily long-term weakness, but current visible momentum is limited.

### Rapidly iterating vs stabilizing

**Rapidly iterating**
- ClickHouse: analyzer, planner, releases
- Doris: correctness, file cache, interoperability, branch backports
- DuckDB: memory, remote I/O, nested-type semantics
- Delta Lake: CDC stack

**Stabilizing / hardening**
- Iceberg: metadata correctness, engine parity, docs/spec cleanup
- Arrow: CI, packaging, platform support
- Velox: correctness/perf and GPU extension
- Gluten: semantic parity and backend sync

**Strategically maturing**
- StarRocks: focused roadmap work with lower visible incident volume

---

## 7. Trend Signals

### Industry trends visible across communities

#### 1) The OLAP database and lakehouse worlds are converging
Users increasingly expect engines to query and ingest across **Iceberg, Paimon, Parquet, CDC streams, and object stores** without losing correctness. This benefits:
- **Data engineers**: fewer pipeline boundaries between storage and serving
- **Architects**: more optionality in compute/storage separation

#### 2) Object storage behavior is now a buying criterion
S3/Azure/HDFS issues are no longer peripheral; they affect **cost, latency, cache correctness, deletion safety, and observability**.  
Value:
- Better planning for cloud TCO
- Stronger validation requirements for hybrid/cold-storage deployments

#### 3) Memory control is becoming a differentiator
Multiple engines are adding **per-session limits, low-memory optimizations, load-path caps, and backpressure work**.  
Value:
- Better multi-tenant safety
- More predictable resource envelopes in production and embedded deployments

#### 4) SQL compatibility now means semantic fidelity under edge cases
The next wave of maturity is not basic SQL support, but handling:
- recursive CTEs
- analyzer equivalence
- aggregate null semantics
- distributed alias behavior
- nested/semi-structured correctness

This matters for migration risk and for replacing proprietary systems.

#### 5) CDC and streaming are moving closer to core analytics
Delta Lake’s CDC stack, Doris CDC TVFs, StarRocks ingestion issues, and ClickHouse Kafka pain points all indicate that users want **fresh data paths directly in the analytical layer**.  
Value:
- Lower-latency architectures
- Simpler medallion/lakehouse serving designs

#### 6) Semi-structured data is now standard, not niche
VARIANT, JSON, LIST, STRUCT, and shredded nested reads appear across Doris, DuckDB, StarRocks, Databend, and Velox-related stacks.  
Value:
- Engines are being judged on real-world mixed-schema analytics, not just flat fact tables

---

## Final Takeaway

For technical decision-makers, the landscape currently breaks into three broad groups:

- **Full OLAP engines with strongest visible production momentum**: **ClickHouse, Apache Doris**
- **Fast-evolving specialized platforms**: **DuckDB, Iceberg, Delta Lake, StarRocks**
- **Foundational ecosystem layers**: **Arrow, Velox, Gluten**

**Apache Doris is well-positioned**: it shows strong practical engineering output, active stable-branch maintenance, and a compelling blend of **integrated OLAP execution plus expanding lakehouse interoperability**. For teams evaluating open-source analytical platforms, Doris currently compares favorably when the requirement is **an operationally grounded, integrated MPP database** rather than just a file format layer or embedded engine.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-29

## 1) Today’s Overview

ClickHouse remained highly active over the last 24 hours: **27 issues** were updated, **295 PRs** saw activity, and **3 new releases** were published. The project looks operationally healthy from a delivery perspective, with steady release cadence and a large volume of engineering work focused on the **query analyzer**, **planner stability**, **pipeline correctness**, and **performance tuning**. The biggest signal from today’s issue stream is that **correctness and regression-hardening around the new analyzer** continues to be a major theme, while storage-side work is increasingly centered on **object storage observability** and **low-memory efficiency**. Overall, project momentum is strong, but a meaningful portion of attention is still going into CI crashes and edge-case query semantics.

---

## 2) Releases

Three versions were published:

- [v26.2.6.27-stable](https://github.com/ClickHouse/ClickHouse/releases/tag/v26.2.6.27-stable)
- [v26.1.7.13-stable](https://github.com/ClickHouse/ClickHouse/releases/tag/v26.1.7.13-stable)
- [v25.8.21.7-lts](https://github.com/ClickHouse/ClickHouse/releases/tag/v25.8.21.7-lts)

### What this means
The simultaneous publication of **two stable lines plus one LTS line** indicates active maintenance across current and long-lived branches. This is a positive health indicator for production users who need a choice between newer features and longer support windows.

### Likely change profile
The supplied data does not include full changelog contents, but based on surrounding issue/PR activity, these releases likely concentrate on:
- **Bug fixes and regression mitigation**
- **Analyzer/planner correctness improvements**
- **Operational stability**, especially around pipeline execution and edge-case SQL behavior

### Breaking changes / migration notes
No explicit breaking changes are visible in the provided release metadata. Still, users upgrading across recent versions should pay particular attention to:
- behavior changes under the **new analyzer**
- query semantics involving **GROUPING**, **aliases**, **views**, **joins**, and **distributed execution**
- observability changes such as new or corrected logging fields in `system.query_log`

For conservative production rollouts, the new [v25.8.21.7-lts](https://github.com/ClickHouse/ClickHouse/releases/tag/v25.8.21.7-lts) is the safest landing target if analyzer-related regressions are a concern.

---

## 3) Project Progress

Although the dataset does not enumerate merged PRs in detail, the closed issues and active PR set show clear forward motion in several core areas.

### Query engine and analyzer modernization
A large amount of work continues to move the codebase from legacy analysis paths toward the newer analyzer framework:

- [Use Analyzer in MutationsInterpreter (variant 2)](https://github.com/ClickHouse/ClickHouse/pull/96491)
- [Replace ExpressionAnalyzer with Analyzer for standalone expression compilation](https://github.com/ClickHouse/ClickHouse/pull/96886)

This suggests ClickHouse is still in an active migration period where the analyzer is becoming the default planning foundation across more execution paths. That usually pays off in long-term consistency, but in the short term it often exposes subtle correctness mismatches—which today’s issue list confirms.

### Query correctness and SQL semantics
Several issues closed today point to incremental hardening of query semantics:

- [Different behaviour for SELECT * REPLACE with LIMIT BY with enabled and disabled analyzer](https://github.com/ClickHouse/ClickHouse/issues/82943) — closed
- [Issues with parametrized views and new analyzer/recent versions](https://github.com/ClickHouse/ClickHouse/issues/66307) — closed
- [While executing SimpleSquashingTransform. (PARAMETER_OUT_OF_BOUND)](https://github.com/ClickHouse/ClickHouse/issues/69410) — closed
- [Analyzer regression on query validation](https://github.com/ClickHouse/ClickHouse/issues/74442) — closed
- [Matchers resolved into incorrect type in case of multiple joins with `join_use_nulls`](https://github.com/ClickHouse/ClickHouse/issues/75005) — closed
- [The analyzer can remove CAST from constants to make distributed queries invalid](https://github.com/ClickHouse/ClickHouse/issues/71830) — closed

This is meaningful progress: it shows maintainers are not just adding analyzer coverage, but actively fixing semantic drift and distributed-query regressions.

### Performance and storage optimization
Notable active performance work includes:

- [Enable hash table prefetching for string key aggregation](https://github.com/ClickHouse/ClickHouse/pull/101007)  
  A potentially important GROUP BY optimization for real-world analytics workloads where string dimensions dominate.

- [Optimize `tupleElement(dictGet(..., tuple_of_attrs), N)` into single-attribute dictGet](https://github.com/ClickHouse/ClickHouse/pull/100186)  
  This targets dictionary-heavy deployments and should reduce unnecessary attribute fetch cost.

- [Push join key filters into MergeTree index during recursive CTE evaluation](https://github.com/ClickHouse/ClickHouse/pull/97254)  
  A notable optimizer improvement, especially for graph-like traversals and recursive queries.

- [Optimizations on low-memory systems (e.g. 2 GiB)](https://github.com/ClickHouse/ClickHouse/pull/100389)  
  This is a strong signal that ClickHouse is improving its footprint outside large-server deployments.

### Stability and pipeline hardening
A broad class of active fixes targets planner and pipeline robustness:

- [Fix LOGICAL_ERROR "Column identifier is already registered" in UNION ALL](https://github.com/ClickHouse/ClickHouse/pull/100770)
- [Fix exception "Column identifier is already registered" in planner](https://github.com/ClickHouse/ClickHouse/pull/101048)
- [Fix Pipeline stuck exception in ResizeProcessor](https://github.com/ClickHouse/ClickHouse/pull/98340)
- [Fix Not-ready Set exception when IN subquery is moved to PREWHERE](https://github.com/ClickHouse/ClickHouse/pull/100375)
- [Fix DiskAccessStorage crash on restart when .sql file is missing](https://github.com/ClickHouse/ClickHouse/pull/99487)

These are core engine quality improvements rather than peripheral polish.

---

## 4) Community Hot Topics

### 1. CI crash backlog remains visible
Most-commented updated issues are still CI crash reports:

- [#99799 Double deletion of MergeTreeDataPartCompact in multi_index](https://github.com/ClickHouse/ClickHouse/issues/99799) — 18 comments
- [#99295 Exception during pipeline execution](https://github.com/ClickHouse/ClickHouse/issues/99295) — 12 comments
- [#100769 Potential issue in MergeTreeRangeReader adjusting last granule](https://github.com/ClickHouse/ClickHouse/issues/100769) — 12 comments
- [#100296 Failed preparation of data source in pipeline execution](https://github.com/ClickHouse/ClickHouse/issues/100296) — 8 comments

**Technical need:** maintainers are still spending significant effort on nondeterministic or fuzz/CI-discovered failures in **MergeTree**, **pipeline execution**, and **planner internals**. This points to ongoing complexity in the engine’s concurrency, ownership, and planning layers.

### 2. Kafka engine reliability remains a real user pain point
- [#66415 Kafka table Engine frequently timeout: consumers had been closed](https://github.com/ClickHouse/ClickHouse/issues/66415) — 11 comments

**Technical need:** users need better resilience and predictability in the Kafka ingestion path, especially post-24.3 behavior. The issue suggests production sensitivity around consumer lifecycle, timeouts, and streaming stability.

### 3. SQL usability and PostgreSQL compatibility continue to attract attention
- [#90780 Support for trailing comma in WITH before SELECT](https://github.com/ClickHouse/ClickHouse/issues/90780)
- [#90075 `generate_series` is not fully-compatible with PostgreSQL](https://github.com/ClickHouse/ClickHouse/issues/90075)
- [#99608 Support `SIMILAR TO` pattern matching predicate](https://github.com/ClickHouse/ClickHouse/issues/99608)

**Technical need:** users want ClickHouse to be easier to use as a PostgreSQL-adjacent analytics system, with fewer syntax incompatibilities and less friction for porting SQL.

### 4. Object storage observability is rising in importance
- [#100960 Big amount of PUTs on S3 bucket](https://github.com/ClickHouse/ClickHouse/issues/100960)
- [Extend blob_storage_log with Read event type](https://github.com/ClickHouse/ClickHouse/pull/96867)

**Technical need:** cloud users increasingly need fine-grained tracking of storage API usage, especially because object-store billing and performance can be dominated by request count rather than data size.

---

## 5) Bugs & Stability

Ranked by severity and production impact.

### Critical / High

#### 1. MergeTree memory ownership / deletion crash in CI
- [#99799 Double deletion of MergeTreeDataPartCompact in multi_index](https://github.com/ClickHouse/ClickHouse/issues/99799)

A double-deletion report in MergeTree internals is potentially severe because it suggests **lifetime/ownership corruption**, which can lead to crashes or undefined behavior. No direct fix PR is listed in the supplied data.

#### 2. Pipeline execution instability
- [#99295 Exception during pipeline execution](https://github.com/ClickHouse/ClickHouse/issues/99295)
- [#100296 Failed preparation of data source in pipeline execution](https://github.com/ClickHouse/ClickHouse/issues/100296)
- Related fix work: [#98340 Fix Pipeline stuck exception in ResizeProcessor](https://github.com/ClickHouse/ClickHouse/pull/98340)

These indicate the execution pipeline remains an active stabilization area. The presence of an active PR is a good sign, but multiple issue variants suggest the class is not yet fully retired.

#### 3. MergeTree read path issue
- [#100769 Potential issue in MergeTreeRangeReader adjusting last granule](https://github.com/ClickHouse/ClickHouse/issues/100769)

Because this touches granule boundary logic, it could affect either correctness or crashes in data reads. It is notable that the issue trace is from master/release branch, increasing relevance.

### Medium

#### 4. S3 request amplification during TTL migration
- [#100960 Big amount of PUTs on S3 bucket](https://github.com/ClickHouse/ClickHouse/issues/100960)

Likely not a crash, but potentially expensive and operationally significant. For cloud-native deployments, excessive PUTs can become both a cost and throughput issue.

#### 5. Distributed query alias handling bug
- [#66245 MULTIPLE_EXPRESSIONS_FOR_ALIAS for ALIAS column with an expression with distributed queries](https://github.com/ClickHouse/ClickHouse/issues/66245)

An older but still-open correctness issue affecting distributed semantics. This is important because distributed edge cases often block adoption in larger clusters.

#### 6. Analyzer timezone handling with `DateTime64` aliases
- [#76787 Unexpected timezone handling with DateTime64 aliases in the analyzer](https://github.com/ClickHouse/ClickHouse/issues/76787)

Timezone bugs are high-risk for analytics correctness, especially when silent. Even with low discussion volume, this deserves attention.

#### 7. GROUPING semantics under analyzer
- [#79326 GROUPING function argument is not in GROUP BY keys for tuples with enable_analyzer=1](https://github.com/ClickHouse/ClickHouse/issues/79326)
- Potentially related PR: [#101030 Fix `grouping` function on Distributed table with single shard](https://github.com/ClickHouse/ClickHouse/pull/101030)

This looks like part of a broader cluster of `GROUPING`/analyzer issues rather than a one-off bug.

### Recently fixed today

- [#100793 Dynamic NULL cast to Variant throws CANNOT_INSERT_NULL_IN_ORDINARY_COLUMN](https://github.com/ClickHouse/ClickHouse/issues/100793) — closed
- [#100985 skip_indices not logged in query_log when use_skip_indexes_on_data_read=1](https://github.com/ClickHouse/ClickHouse/issues/100985) — closed
- [#100986 skip_indices not logged in query_log on repeated queries when use_query_condition_cache=1](https://github.com/ClickHouse/ClickHouse/issues/100986) — closed

These are good examples of fast-turnaround fixes, especially around **query observability** and newer type system features.

---

## 6) Feature Requests & Roadmap Signals

### Strong signals

#### PostgreSQL-style SQL compatibility
- [#90075 `generate_series` is not fully-compatible with PostgreSQL](https://github.com/ClickHouse/ClickHouse/issues/90075)
- [#99608 Support `SIMILAR TO` pattern matching predicate](https://github.com/ClickHouse/ClickHouse/issues/99608)
- [#90780 Support for trailing comma in WITH before SELECT](https://github.com/ClickHouse/ClickHouse/issues/90780)

These are relatively approachable compatibility/usability improvements. Of these, **trailing comma support** and **`SIMILAR TO`** look especially plausible for a near-term release because they are self-contained and align with ClickHouse’s recent SQL ergonomics push.

#### Aggregation semantics for sparse array workloads
- [#100994 `anyLastArray` - anyLast with empty arrays?](https://github.com/ClickHouse/ClickHouse/issues/100994)

This request is grounded in a concrete high-volume analytics use case and points to a gap in aggregate usability with arrays and `AggregatingMergeTree`. If adopted, it would improve developer experience for sparse semi-structured data.

#### Parameterized query ergonomics
- [#92733 Default query parameters](https://github.com/ClickHouse/ClickHouse/issues/92733) — closed

This closure suggests forward movement on making parameterized SQL more flexible. It fits the broader theme of ClickHouse becoming easier to integrate into application-facing SQL workflows.

### Likely next-version candidates
Most likely among the visible requests to appear soon:
1. [Trailing comma in `WITH`](https://github.com/ClickHouse/ClickHouse/issues/90780)
2. [`SIMILAR TO`](https://github.com/ClickHouse/ClickHouse/issues/99608)
3. further `generate_series` compatibility improvements via [#90075](https://github.com/ClickHouse/ClickHouse/issues/90075)

These are relatively bounded features with clear user benefit.

---

## 7) User Feedback Summary

### Main pain points from users

#### 1. Streaming ingestion stability
The Kafka engine issue remains one of the clearest production-facing complaints:
- [#66415 Kafka table Engine frequently timeout](https://github.com/ClickHouse/ClickHouse/issues/66415)

Users appear sensitive to regressions introduced since 24.3, especially around long-running ingestion reliability.

#### 2. Analyzer inconsistency versus legacy behavior
Many open and recently closed issues show users still encountering cases where the analyzer differs from prior execution behavior:
- [#76787 DateTime64 alias timezone handling](https://github.com/ClickHouse/ClickHouse/issues/76787)
- [#79326 GROUPING with tuples under analyzer](https://github.com/ClickHouse/ClickHouse/issues/79326)
- [#62914 Incorrect error when an alias is duplicated in a subquery](https://github.com/ClickHouse/ClickHouse/issues/62914)
- [#82943 SELECT * REPLACE with LIMIT BY analyzer mismatch](https://github.com/ClickHouse/ClickHouse/issues/82943) — closed

The pattern suggests users appreciate the analyzer’s direction, but still need stronger guarantees of semantic compatibility.

#### 3. Distributed query edge cases
Several bugs touch distributed execution:
- [#66245 ALIAS column issue with distributed queries](https://github.com/ClickHouse/ClickHouse/issues/66245)
- [#51645 View on top of Distributed table can significantly impact performance](https://github.com/ClickHouse/ClickHouse/issues/51645)
- [#71830 Analyzer can remove CAST and make distributed queries invalid](https://github.com/ClickHouse/ClickHouse/issues/71830) — closed

This reinforces that distributed planning remains one of the hardest areas to fully normalize.

#### 4. Cloud storage cost/performance transparency
- [#100960 Big amount of PUTs on S3 bucket](https://github.com/ClickHouse/ClickHouse/issues/100960)
- [PR #96867 Add Read event type to blob_storage_log](https://github.com/ClickHouse/ClickHouse/pull/96867)

Users want better insight into object storage behavior, not just raw support for S3/Azure/GCS.

### Satisfaction signals
Positive signals include:
- rapid closure of several correctness and observability bugs
- continued release publication across stable and LTS lines
- meaningful performance work rather than only bug triage

---

## 8) Backlog Watch

These older or strategically important items appear to merit maintainer attention.

### Older open issues

#### [#51645 View on top of Distributed table can significantly impact performance](https://github.com/ClickHouse/ClickHouse/issues/51645)
Opened in 2023 and still open. This matters because it points to planner/optimizer blind spots in a common abstraction pattern: querying through views over distributed tables.

#### [#62914 Incorrect error when an alias is duplicated in a subquery](https://github.com/ClickHouse/ClickHouse/issues/62914)
A usability/analyzer issue from 2024 that still lacks closure. Not critical, but it affects developer trust in diagnostics.

#### [#66245 MULTIPLE_EXPRESSIONS_FOR_ALIAS ... with distributed queries](https://github.com/ClickHouse/ClickHouse/issues/66245)
An old distributed correctness bug that should remain on the radar because it combines aliases, expression rewriting, and remote execution.

#### [#66415 Kafka table Engine frequently timeout](https://github.com/ClickHouse/ClickHouse/issues/66415)
This deserves elevated attention despite modest reactions because it reflects a recurring production ingestion scenario.

#### [#76787 Unexpected timezone handling with DateTime64 aliases in the analyzer](https://github.com/ClickHouse/ClickHouse/issues/76787)
Low-comment but potentially high-impact due to analytics correctness implications.

#### [#79326 GROUPING function argument is not in GROUP BY keys for tuples with enable_analyzer=1](https://github.com/ClickHouse/ClickHouse/issues/79326)
Freshly updated and directly relevant to ongoing analyzer rollout.

### Older strategic PRs still in motion

#### [#96491 Use Analyzer in MutationsInterpreter](https://github.com/ClickHouse/ClickHouse/pull/96491)
Important architectural work. It likely needs careful review because mutations are central to DDL/DML correctness.

#### [#96844 Columns Cache](https://github.com/ClickHouse/ClickHouse/pull/96844)
Potentially impactful for repeated reads and deserialization cost. This looks strategically important for read-heavy analytics workloads.

#### [#96886 Replace ExpressionAnalyzer with Analyzer for standalone expression compilation](https://github.com/ClickHouse/ClickHouse/pull/96886)
Another foundational migration PR; worth close attention because it could remove an entire class of dual-path inconsistencies once stabilized.

---

## Bottom Line

ClickHouse is showing **strong release and development velocity**, with clear advances in optimizer work, low-memory behavior, and cloud-storage observability. The main risk area remains the **new analyzer/planner transition**, where many edge-case correctness issues are still surfacing, though maintainers are actively closing them. For users, the practical message is: the project is healthy and shipping quickly, but teams running complex distributed SQL, analyzer-heavy workloads, Kafka ingestion, or S3-backed storage should continue to validate upgrades carefully.

## Key Links
- Releases: [v26.2.6.27-stable](https://github.com/ClickHouse/ClickHouse/releases/tag/v26.2.6.27-stable), [v26.1.7.13-stable](https://github.com/ClickHouse/ClickHouse/releases/tag/v26.1.7.13-stable), [v25.8.21.7-lts](https://github.com/ClickHouse/ClickHouse/releases/tag/v25.8.21.7-lts)
- Hot PRs: [#101007](https://github.com/ClickHouse/ClickHouse/pull/101007), [#97254](https://github.com/ClickHouse/ClickHouse/pull/97254), [#96867](https://github.com/ClickHouse/ClickHouse/pull/96867), [#96491](https://github.com/ClickHouse/ClickHouse/pull/96491)
- Hot issues: [#99799](https://github.com/ClickHouse/ClickHouse/issues/99799), [#66415](https://github.com/ClickHouse/ClickHouse/issues/66415), [#100769](https://github.com/ClickHouse/ClickHouse/issues/100769), [#90780](https://github.com/ClickHouse/ClickHouse/issues/90780)

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-29

## 1. Today's Overview

DuckDB showed **healthy day-to-day development activity** on 2026-03-29, with **11 issues updated** and **24 pull requests updated**, including **10 PRs merged/closed**. There was **no new release**, so current momentum is concentrated in core engine fixes, storage/runtime improvements, and API/compatibility work rather than packaging a public version. The merged work suggests continued investment in **execution-engine cleanup, external file caching, memory controls, and nested/complex type behavior**. At the same time, issue traffic highlights recurring user pain around **memory behavior on S3/export workloads, remote query performance, crash bugs, and platform compatibility**.

## 2. Project Progress

### Merged/closed PRs today

DuckDB advanced several important areas in the query engine and storage stack through recently closed PRs:

- [#20219](https://github.com/duckdb/duckdb/pull/20219) — **Add `operator_memory_limit` setting for per-connection memory budgets**  
  This is a meaningful operational improvement. DuckDB already has global memory controls, but this adds a **session-scoped/per-connection memory budget**, which is important for embedded and multi-tenant environments. It directly addresses a common analytical-engine need: preventing one connection from monopolizing memory.

- [#21395](https://github.com/duckdb/duckdb/pull/21395) — **Implement block-aligned read and cache for external file cache**  
  This is one of the most strategically important merged items. It reworks external I/O caching toward **block-based reads and cache management**, which should improve efficiency and predictability for remote/object-store workloads. This aligns with current community pressure around S3 and remote file performance.

- [#21674](https://github.com/duckdb/duckdb/pull/21674) — **Handle constant vector optimization at the expression executor level**  
  This is a core execution-engine cleanup that removes duplicated optimization logic from individual functions and centralizes it in the executor. That should reduce correctness risk and simplify implementation of scalar/vectorized functions.

- [#21679](https://github.com/duckdb/duckdb/pull/21679) — **Rename `ValidityMask::AllValid` to `ValidityMask::CannotHaveNull`**  
  Mostly an internal API clarity improvement, but an important one: it reduces semantic confusion in nullability handling, which is often a source of subtle engine bugs.

- [#21676](https://github.com/duckdb/duckdb/pull/21676) — **Fix issue with struct filter on missing structs**  
  This looks like a correctness fix for nested/struct data handling, relevant for semi-structured data users and increasingly important as DuckDB expands complex type support.

- [#18996](https://github.com/duckdb/duckdb/pull/18996) — **Emit `VARIANT` from Parquet VARIANT columns instead of JSON**  
  This is a notable compatibility and type-system step. It moves Parquet ingestion closer to preserving **native semantic richness** for variant-like columns instead of degrading them to JSON. This is a strong roadmap signal around semi-structured analytics.

- [#21671](https://github.com/duckdb/duckdb/pull/21671) — **Window TopN Except**  
  Internal optimizer/test-oriented work, indicating continued refinement of window-function planning and CTE behavior.

Overall, the merged set points to **incremental but substantial engine hardening**, especially around **memory governance, remote I/O, nested types, and execution correctness**.

## 3. Community Hot Topics

### Most active issues and PRs

- [Issue #6759](https://github.com/duckdb/duckdb/issues/6759) — **Java JDBC API `getTypeInfo` unsupported**  
  19 comments  
  Although now closed, its longevity and comment volume show persistent demand for **better JDBC metadata completeness**. This matters for BI tools, ORM integrations, and Java ecosystem compatibility.

- [Issue #11817](https://github.com/duckdb/duckdb/issues/11817) — **Out-of-memory error when performing partitioned copy to S3**  
  13 comments, 9 👍  
  This is the strongest user-signaled issue in the current set. The underlying need is clear: users expect DuckDB to support **large partitioned exports to object storage under constrained memory budgets**. This intersects directly with cloud ETL and data lake write workflows.

- [Issue #14095](https://github.com/duckdb/duckdb/issues/14095) — **Slow `fetch_df()` on S3 remote query**  
  8 comments  
  This issue reflects a practical gap between raw query execution and **end-to-end client retrieval performance**. It suggests that object-store reads plus Python dataframe materialization still present friction in real deployments.

- [Issue #19482](https://github.com/duckdb/duckdb/issues/19482) — **Second execution of same request takes twice as long, even after `DROP TABLE`**  
  6 comments  
  This points to possible issues in **caching, memory reclamation, temp storage reuse, or optimizer/runtime state**. It matters because users expect repeated analytical queries to become faster or at least stable, not slower.

- [Issue #21618](https://github.com/duckdb/duckdb/issues/21618) — **Attach string reused when creating a second connection in a session**  
  4 comments  
  This is a fresh issue with reproducibility signal. It may indicate session state leakage or connector-layer behavior that could affect multi-database and catalog attachment workflows.

### Technical themes behind the discussions

The hottest topics cluster around three real-world needs:

1. **Cloud/object storage reliability and efficiency**  
   S3/MinIO reads and partitioned writes remain highly visible workloads.
2. **Driver and client interoperability**  
   JDBC metadata completeness and Python dataframe fetch paths continue to matter for adoption.
3. **State/memory correctness under repeated or concurrent usage**  
   Users increasingly stress DuckDB in embedded-service and production-like settings, not just one-shot local analysis.

## 4. Bugs & Stability

### Ranked by severity

#### 1) High severity: crash / core dump reports
- [Issue #21429](https://github.com/duckdb/duckdb/issues/21429) — **Floating point exception (core dumped)**  
  Closed. A SQL expression involving `CASE` triggered a core dump. Any engine crash from SQL input is high severity because it threatens robustness guarantees.

- [Issue #21470](https://github.com/duckdb/duckdb/issues/21470) — **Floating point exception when reading table with list of struct**  
  Closed. This affects nested/semi-structured reads and is especially concerning because reproduction varied across sessions, hinting at environmental or nondeterministic factors.

- [Issue #21545](https://github.com/duckdb/duckdb/issues/21545) — **Internal UTF-8 error rendering markdown table with em dashes**  
  Closed. A CLI rendering path caused an internal error despite valid UTF-8 input. Lower impact than execution crashes, but still a user-facing stability issue.

#### 2) High severity: memory/resource behavior
- [Issue #11817](https://github.com/duckdb/duckdb/issues/11817) — **OOM during partitioned COPY to S3**  
  Open, under review. This remains one of the most consequential operational bugs because it blocks data lake export scenarios.  
  Related progress: [PR #20219](https://github.com/duckdb/duckdb/pull/20219) improves memory controls, and [PR #21395](https://github.com/duckdb/duckdb/pull/21395) improves external file cache behavior, but neither is explicitly marked as the direct fix.

#### 3) Medium severity: query performance regressions / runtime anomalies
- [Issue #14095](https://github.com/duckdb/duckdb/issues/14095) — **Slow `fetch_df()` on S3 remote query**  
  Open. Important for Python analytics users working with remote parquet.

- [Issue #19482](https://github.com/duckdb/duckdb/issues/19482) — **Second execution slower than first even after `DROP TABLE`**  
  Open. Potential engine-state or resource lifecycle regression.

- [Issue #21675](https://github.com/duckdb/duckdb/issues/21675) — **Column set to NULL performance issue**  
  Open, needs triage. Reported slowdown from seconds to minutes on indexed tables, even after dropping indexes before update. Could indicate storage-versioning or update-path inefficiency.

#### 4) Medium severity: correctness/regression concerns
- [Issue #21682](https://github.com/duckdb/duckdb/issues/21682) — **Regression with `timestamptz` when used in macros**  
  Open, needs triage. Time zone semantics regressions are especially sensitive because they can silently affect analytical correctness.

- [Issue #21618](https://github.com/duckdb/duckdb/issues/21618) — **Attach string not picked up correctly on second connection**  
  Open, reproduced. Session-state correctness bug.

#### 5) Lower severity but notable compatibility/platform issues
- [Issue #16647](https://github.com/duckdb/duckdb/issues/16647) — **Windows ARM Extensions**  
  Open. Important for platform expansion, especially as ARM laptops become more common.

### Stability readout

The good news is that several crash-class issues were **closed quickly**, indicating responsive maintenance. The main remaining concern is less about outright crashes and more about **resource behavior and cloud/remote workload predictability**.

## 5. Feature Requests & Roadmap Signals

Several open PRs and discussions offer useful clues about where DuckDB may be heading next.

### Strong roadmap signals

- [PR #20210](https://github.com/duckdb/duckdb/pull/20210) — **Add `VARIANT` type to C API**  
  Combined with the merged [#18996](https://github.com/duckdb/duckdb/pull/18996), this strongly suggests ongoing work to make **VARIANT a first-class cross-language and storage-visible type**. This is likely to appear in an upcoming release wave.

- [PR #21672](https://github.com/duckdb/duckdb/pull/21672) — **UNNEST ARRAY type functionality**  
  This improves SQL ergonomics and nested-type compatibility. Given DuckDB’s expansion into semi-structured analytics, this feels likely to land relatively soon if review proceeds.

- [PR #20752](https://github.com/duckdb/duckdb/pull/20752) — **Add `extension_name` to `duckdb_functions` and `duckdb_types`**  
  This is a practical introspection enhancement that would help users reason about extension provenance and governance.

- [PR #20859](https://github.com/duckdb/duckdb/pull/20859) — **Support `USING SAMPLE N ROWS (system)`**  
  A SQL usability improvement that expands the current system-sampling syntax toward more intuitive row-count semantics.

- [PR #20960](https://github.com/duckdb/duckdb/pull/20960) — **Prepared statement column origin table in C API**  
  Valuable for client libraries, tooling, and lineage-aware integrations.

- [PR #20638](https://github.com/duckdb/duckdb/pull/20638) — **Refactor Index API**  
  This is one of the more strategic proposals. Materialization/parallelism hooks for custom indexes indicate DuckDB is exploring a broader indexing ecosystem and potentially richer extension points.

### Prediction for next version candidates

Most likely near-term inclusions based on current signals:
- More **VARIANT** support across APIs and file formats
- Better **nested type SQL behavior** (`ARRAY`, `STRUCT`, `UNNEST`)
- Improved **remote I/O and caching**
- More **memory and execution controls**
- Additional **system catalog / metadata introspection**

## 6. User Feedback Summary

Current user feedback paints a clear picture of how DuckDB is being used in practice:

- **Cloud-native analytics is no longer niche**  
  Users are querying parquet over **S3/MinIO**, exporting partitioned datasets back to object storage, and expecting predictable memory/performance behavior. See [#11817](https://github.com/duckdb/duckdb/issues/11817) and [#14095](https://github.com/duckdb/duckdb/issues/14095).

- **Embedded and multi-connection scenarios are growing**  
  Reports like [#21618](https://github.com/duckdb/duckdb/issues/21618) suggest users are integrating DuckDB into longer-lived application sessions rather than just ad hoc notebooks.

- **Complex/nested data adoption is increasing**  
  Crashes and fixes around lists, structs, and variant handling show users are actively pushing semi-structured capabilities. The platform is improving, but these paths remain a source of edge cases.

- **Performance expectations are rising**  
  The update-path issue in [#21675](https://github.com/duckdb/duckdb/issues/21675) and repeated-query slowdown in [#19482](https://github.com/duckdb/duckdb/issues/19482) indicate users expect DuckDB to behave like a dependable analytical runtime under iterative workloads.

- **Platform/tooling compatibility still matters**  
  JDBC metadata completeness and Windows ARM extension usability remain adoption friction points.

Overall satisfaction appears strongest around DuckDB’s breadth and velocity, while dissatisfaction clusters around **production-like operational edge cases**.

## 7. Backlog Watch

These items look important and deserving of maintainer attention due to age, user impact, or roadmap relevance:

- [Issue #11817](https://github.com/duckdb/duckdb/issues/11817) — **OOM on partitioned COPY to S3**  
  Open since 2024-04-24, under review, with strong reaction count. This remains a high-priority operational issue.

- [Issue #14095](https://github.com/duckdb/duckdb/issues/14095) — **Slow `fetch_df()` on S3 remote query**  
  Open since 2024-09-24, under review/stale. Important for Python and remote analytics adoption.

- [Issue #16647](https://github.com/duckdb/duckdb/issues/16647) — **Windows ARM Extensions**  
  Open since 2025-03-12. Platform support issues can remain invisible for core maintainers but painful for affected users.

- [PR #20210](https://github.com/duckdb/duckdb/pull/20210) — **Add VARIANT type to C API**  
  Stale with merge conflicts, but strategically important if DuckDB wants end-to-end VARIANT support across language bindings.

- [PR #20638](https://github.com/duckdb/duckdb/pull/20638) — **Refactor Index API**  
  Stale with merge conflicts. Potentially high leverage for extensibility and advanced indexing.

- [PR #20373](https://github.com/duckdb/duckdb/pull/20373) — **ResultSet row access performance**  
  Ready for review. Useful for client-side performance, especially in Swift and embedded app scenarios.

- [PR #20828](https://github.com/duckdb/duckdb/pull/20828) — **Make compression availability checks complete**  
  Ready for review. Not flashy, but important for storage correctness and user trust in declared compression settings.

## Overall Health Assessment

DuckDB remains **technically vibrant and fast-moving**, with substantial core-engine improvements landing even without a formal release today. The project appears strongest in **internal engine iteration, type-system evolution, and performance infrastructure work**. The biggest risks visible right now are **remote/cloud workload ergonomics, memory behavior under export/query pressure, and semi-structured edge-case stability**. In short: **project health is strong, but production-oriented polishing for object storage and advanced data types remains the main frontier**.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-29

## 1. Today's Overview

StarRocks showed **light-to-moderate development activity** over the last 24 hours, with **9 pull requests updated** and **1 issue updated**, but **no new releases**. The work pattern is skewed toward **ongoing feature development and infrastructure/tooling changes**, especially around schema evolution, shared-data storage, external table/query path enhancements, and build/runtime dependencies. User-reported issue volume was low, though the single active issue points to a **real ingestion compatibility gap** in `ROUTINE LOAD` for Avro nullable unions. Overall, project health looks **stable and actively progressing**, with more signals from engineering roadmap work than from release or incident response activity.

---

## 2. Project Progress

### Merged/Closed PRs today

#### Closed: [#70925](https://github.com/StarRocks/starrocks/pull/70925) — **[Tool] Add check for generated files**
- **Status:** Closed
- **Type:** Tooling / CI hygiene
- **Why it matters:** This is not a user-facing query-engine or SQL feature, but it improves repository correctness and developer workflow by ensuring generated artifacts are validated consistently.
- **Assessment:** A small but useful maintenance step that reduces drift between source and generated outputs, which helps stabilize contribution quality and CI reliability.

### Other notable in-flight progress

Although not merged, several active PRs indicate where engineering effort is currently concentrated:

- [#70747](https://github.com/StarRocks/starrocks/pull/70747) — **Support schema evaluation for widening varchar length with key/non-key column**  
  Strong signal that StarRocks is improving **schema evolution**, especially in complex table layouts involving keys, sort keys, distribution keys, and partition keys.

- [#70926](https://github.com/StarRocks/starrocks/pull/70926) — **Support Composite Storage Volume for cross-bucket partition distribution**  
  Important roadmap item for **shared-data deployments on cloud object storage**, especially multi-bucket operational setups.

- [#70924](https://github.com/StarRocks/starrocks/pull/70924) — **Support shredded VARIANT virtual-column reads for Iceberg Parquet**  
  Advances StarRocks’s external table and semi-structured analytics stack, especially for **Iceberg + Parquet + VARIANT** interoperability.

- [#70735](https://github.com/StarRocks/starrocks/pull/70735) — **Report be_tablets DATA_SIZE as rowset column data bytes**  
  A correctness-oriented observability fix that should improve **storage accounting accuracy**.

- [#70910](https://github.com/StarRocks/starrocks/pull/70910) — **Move partition update arbitration logic into HiveMetadata**  
  Suggests continued internal cleanup in the **Hive connector/metastore path**, likely to simplify maintenance and improve metadata consistency.

---

## 3. Community Hot Topics

Given the small discussion volume today, “hot topics” are best inferred from the **most strategically important or technically consequential active items** rather than raw comment counts.

### 1) Avro nullable union handling in ROUTINE LOAD
- Issue: [#70928](https://github.com/StarRocks/starrocks/issues/70928) — **[type/bug] ROUTINE LOAD Avro union type ["null", "type"] not handled correctly**
- Activity: 1 comment
- Technical need:
  - Users ingesting Kafka data with **Confluent Schema Registry** expect standard Avro nullable unions like `["null","string"]` or `["null","int"]` to work seamlessly.
  - This is a core compatibility requirement for production streaming pipelines.
- Why it matters:
  - This issue touches **data ingestion correctness**, not just convenience.
  - If nullable unions are parsed incorrectly, users may see load failures, null handling errors, or schema mismatch behavior in streaming ETL.

### 2) Shared-data storage flexibility for cloud deployments
- PR: [#70926](https://github.com/StarRocks/starrocks/pull/70926) — **Support Composite Storage Volume for cross-bucket partition distribution**
- Technical need:
  - Operators want StarRocks to distribute partitions across **multiple cloud buckets/storage volumes** in shared-data mode.
  - This reflects enterprise demand for **capacity management, isolation, cost control, and multi-bucket operational design**.
- Roadmap implication:
  - StarRocks is investing further in **cloud-native shared-data architecture**, not just single-bucket object storage usage.

### 3) Deeper Iceberg + VARIANT query pushdown/read-path support
- PR: [#70924](https://github.com/StarRocks/starrocks/pull/70924) — **Support shredded VARIANT virtual-column reads for Iceberg Parquet**
- Technical need:
  - Users increasingly expect efficient analytics over **semi-structured data in open table formats**.
  - This work closes the gap between FE rewrite capability and BE execution capability for shredded VARIANT leaf-path access.
- Why it matters:
  - It points to continued competition in the **lakehouse analytics** space, where predicate evaluation and projection over nested/semi-structured data are important differentiators.

---

## 4. Bugs & Stability

### Severity 1 — Ingestion compatibility / correctness
#### [#70928](https://github.com/StarRocks/starrocks/issues/70928) — ROUTINE LOAD Avro union type `["null", "type"]` not handled correctly
- **Type:** Bug
- **Area:** Streaming ingestion / Kafka / Avro / Schema Registry
- **Severity rationale:** High
  - Affects a common Avro schema pattern for optional fields.
  - Impacts production ingestion reliability and data correctness.
- **Potential symptoms:**
  - Routine load failures
  - Incorrect deserialization
  - Improper null/value handling for optional columns
- **Fix status:** No linked fix PR in the provided data.

### Severity 2 — Storage/accounting observability correctness
#### [#70735](https://github.com/StarRocks/starrocks/pull/70735) — Report `be_tablets.DATA_SIZE` as rowset column data bytes
- **Type:** BugFix PR (open)
- **Area:** BE metrics / storage accounting
- **Severity rationale:** Medium
  - Not a crash or query wrong-result issue, but can mislead capacity planning and operational monitoring.
- **Impact:**
  - Aims to make `DATA_SIZE` reflect rowset column bytes rather than broader footprint values.
  - Particularly useful for accurate storage introspection.

### Stability-related engineering signals
- [#70822](https://github.com/StarRocks/starrocks/pull/70822) — **Bump thrift on BE from v0.20 to v0.22**  
  Dependency upgrades can improve compatibility and maintainability, but also carry integration risk; worth watching for follow-up regressions.

- [#70910](https://github.com/StarRocks/starrocks/pull/70910) — **Move partition update arbitration logic into HiveMetadata**  
  Refactors in metadata update arbitration can improve maintainability, but this is a sensitive area that can affect connector consistency if not thoroughly validated.

---

## 5. Feature Requests & Roadmap Signals

### Strong roadmap signals from active PRs

#### Schema evolution is an active investment area
- [#70747](https://github.com/StarRocks/starrocks/pull/70747) — **Support schema evaluation for widening varchar length with key/non-key column**
- Signal:
  - StarRocks is expanding support for **online schema evolution**, including harder cases involving key columns and multiple storage architectures.
- Likely impact:
  - Better DDL flexibility with fewer migration workarounds.
- Prediction:
  - This kind of feature is a strong candidate for an upcoming **4.1 line** improvement if review/testing proceeds smoothly.

#### Cloud-native shared-data storage management is becoming more sophisticated
- [#70926](https://github.com/StarRocks/starrocks/pull/70926) — **Composite Storage Volume**
- Signal:
  - Users need higher-level storage abstractions above a single storage bucket.
- Prediction:
  - Likely to appear in a next minor release aimed at **enterprise shared-data deployment scenarios**.

#### Open table format + semi-structured analytics remains strategic
- [#70924](https://github.com/StarRocks/starrocks/pull/70924) — **Iceberg Parquet shredded VARIANT virtual-column reads**
- Signal:
  - Continued push to improve StarRocks as a **lakehouse query engine** over external data.
- Prediction:
  - This is the kind of feature likely to land in a near-term release because it builds on existing FE rewrite capability and unlocks end-to-end execution.

#### Vector search experimentation is expanding
- [#70641](https://github.com/StarRocks/starrocks/pull/70641) — **[WIP] Support paimon vector search framework**
- Signal:
  - StarRocks may be exploring broader **vector/AI-adjacent retrieval scenarios** tied to external formats or ecosystems.
- Prediction:
  - Because this PR is still WIP/proto-review, it looks more exploratory than imminent.

---

## 6. User Feedback Summary

### Main pain points seen today

#### 1) Streaming ingestion interoperability
- Source: [#70928](https://github.com/StarRocks/starrocks/issues/70928)
- User need:
  - Seamless ingestion from Kafka using **Confluent Schema Registry** and standard Avro conventions.
- Pain point:
  - Optional fields encoded with nullable unions appear not to be handled correctly.
- Interpretation:
  - Users expect StarRocks to be robust against **industry-standard serialization patterns**, especially in real-time pipelines.

#### 2) Easier schema changes without disruptive rewrites
- Source: [#70747](https://github.com/StarRocks/starrocks/pull/70747)
- User need:
  - Widen varchar columns even when those columns participate in keys or partition/distribution logic.
- Interpretation:
  - Operational teams want to evolve schemas in place as business data grows, without expensive reloads or table redesign.

#### 3) Better cloud storage layout control
- Source: [#70926](https://github.com/StarRocks/starrocks/pull/70926)
- User need:
  - Distribute partitions across multiple buckets/volumes.
- Interpretation:
  - Real deployments are hitting **scale, organizational, or cost-management constraints** that a single storage target does not solve well.

#### 4) More efficient querying of semi-structured data in lakehouse environments
- Source: [#70924](https://github.com/StarRocks/starrocks/pull/70924)
- User need:
  - Execute FE-generated VARIANT virtual-column rewrites efficiently in the BE when reading Iceberg Parquet.
- Interpretation:
  - Users want StarRocks to handle modern **semi-structured analytic workloads** with less friction and better performance.

---

## 7. Backlog Watch

These items appear important and deserve maintainer attention based on impact, even if they are not yet heavily discussed.

### Needs prompt maintainer attention

#### [#70928](https://github.com/StarRocks/starrocks/issues/70928) — Avro nullable union bug in ROUTINE LOAD
- Reason:
  - Direct user-facing ingestion bug.
  - Affects common Kafka + Avro + Schema Registry setups.
- Recommended urgency:
  - High, because ingestion blockers quickly become production blockers.

#### [#70641](https://github.com/StarRocks/starrocks/pull/70641) — WIP support for paimon vector search framework
- Reason:
  - Proto-review + WIP status suggests early-stage work that may need clearer scope, design feedback, or roadmap alignment before progressing.
- Recommended attention:
  - Product/architecture review to determine strategic fit and near-term priority.

#### [#70822](https://github.com/StarRocks/starrocks/pull/70822) — Thrift upgrade on BE
- Reason:
  - Infra/dependency changes can have broad blast radius despite low apparent visibility.
- Recommended attention:
  - Careful compatibility and CI coverage review, especially around RPC serialization and downstream build/runtime behavior.

#### [#70747](https://github.com/StarRocks/starrocks/pull/70747) — Widening varchar length across key/non-key scenarios
- Reason:
  - High-value schema evolution feature with potentially tricky correctness implications across table models and shared-nothing/shared-data modes.
- Recommended attention:
  - Thorough review on metadata transitions, compatibility checks, and rollback behavior.

---

## 8. Releases

No new releases were published in the last 24 hours.

---

## Linked Items Reference

- Issue [#70928](https://github.com/StarRocks/starrocks/issues/70928) — ROUTINE LOAD Avro union type handling bug
- PR [#70747](https://github.com/StarRocks/starrocks/pull/70747) — Widen varchar length schema evolution
- PR [#70641](https://github.com/StarRocks/starrocks/pull/70641) — Paimon vector search framework
- PR [#70822](https://github.com/StarRocks/starrocks/pull/70822) — Thrift BE upgrade
- PR [#70926](https://github.com/StarRocks/starrocks/pull/70926) — Composite Storage Volume
- PR [#70925](https://github.com/StarRocks/starrocks/pull/70925) — Generated files check
- PR [#70927](https://github.com/StarRocks/starrocks/pull/70927) — Picomatch/CVE-related doc update
- PR [#70924](https://github.com/StarRocks/starrocks/pull/70924) — Iceberg Parquet shredded VARIANT reads
- PR [#70910](https://github.com/StarRocks/starrocks/pull/70910) — HiveMetadata partition update arbitration refactor
- PR [#70735](https://github.com/StarRocks/starrocks/pull/70735) — `be_tablets.DATA_SIZE` accounting fix

If you want, I can also turn this into a **short executive summary** or a **release-manager style risk report**.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-29

## 1. Today's Overview
Apache Iceberg showed **moderate-to-high development activity** today, with **24 PRs updated** and **6 issues updated** in the last 24 hours. The work mix is broad: core APIs, Flink and Spark integration, ORC lineage support, AWS/Glue commit safety, REST/OpenAPI spec cleanup, and a noticeable burst of documentation fixes. There were **no new releases**, so current momentum is concentrated on incremental fixes, compatibility improvements, and cleanup rather than packaging a new version. Overall project health looks **active and engineering-driven**, but several stale bug reports around metadata safety, encryption, and engine interoperability still need maintainer attention.

## 2. Project Progress
Merged/closed PR activity today was limited but still meaningful:

- **Core metrics API usability improved** via **PR #15817** (closed): a helper for obtaining a **full `MetricsConfig`** was added to support downstream engines like Trino that want to collect all metrics by default. This is a small but useful API ergonomics improvement for observability and table-write/read statistics behavior.  
  Link: [PR #15817](https://github.com/apache/iceberg/pull/15817)

- **CI/infra hygiene** saw a small closed change in **PR #15805**, which added inline comments around action tags. While not a product feature, this helps supply-chain and workflow maintainability.  
  Link: [PR #15805](https://github.com/apache/iceberg/pull/15805)

- On the issue side, **Issue #14079** was closed, covering a **Flink job initialization stall with RANGE distribution mode**. Even without a linked merged PR in this dataset, closure suggests progress on a tricky operational/runtime behavior in Flink sink execution.  
  Link: [Issue #14079](https://github.com/apache/iceberg/issues/14079)

**What this means technically:** today’s completed work advanced **metrics configuration**, **CI reliability**, and likely some **Flink runtime stability**, but the more substantial engine and format enhancements remain in-flight rather than merged.

## 3. Community Hot Topics
The most discussed and strategically important items today were:

- **Remove JUnit4 dependency from Flink** — **Issue #12937** with **18 comments**  
  Link: [Issue #12937](https://github.com/apache/iceberg/issues/12937)  
  Related implementation: [PR #15815](https://github.com/apache/iceberg/pull/15815)  
  This reflects ongoing modernization of the Flink test/build stack. The technical need is clear: eliminate legacy JUnit4 leakage from test classpaths, simplify dependency management, and align with newer Java/Flink ecosystems.

- **Hive lock / persistTable metadata overwrite risk** — **Issue #14096** with **13 comments**  
  Link: [Issue #14096](https://github.com/apache/iceberg/issues/14096)  
  This is one of the highest-risk operational topics in today’s issue set. It points to a failure mode where a lost connection during Hive-backed metadata persistence may result in **metadata location overwrite or inconsistency**, directly touching Iceberg’s table commit correctness guarantees.

- **Explicit Azure ADLS credentials in ADLSFileIO** — **Issue #13819** with **5 comments**  
  Link: [Issue #13819](https://github.com/apache/iceberg/issues/13819)  
  Users want explicit `tenantId`, `clientId`, and `clientSecret` settings instead of only relying on ambient/default Azure credential discovery. This signals enterprise deployment demand for **deterministic authentication configuration**, especially in locked-down production environments.

- **Secondary index metadata POC** — **PR #15101**  
  Link: [PR #15101](https://github.com/apache/iceberg/pull/15101)  
  Even without comment counts shown, this is strategically significant. It suggests exploratory work toward **secondary indexing metadata** in Iceberg, which could materially affect query acceleration, metadata planning, and ecosystem expectations.

- **Avro local-timestamp logical type support** for Spark and Flink — **PR #15455** and **PR #15454**  
  Links: [PR #15455](https://github.com/apache/iceberg/pull/15455), [PR #15454](https://github.com/apache/iceberg/pull/15454)  
  These point to growing demand for better **type fidelity** across engines when reading Avro data, especially around timestamps without timezone semantics.

## 4. Bugs & Stability
Ranked by likely severity based on correctness and data safety impact:

### High severity
1. **Connection loss during Hive-backed `persistTable` may overwrite metadata location**  
   - [Issue #14096](https://github.com/apache/iceberg/issues/14096)  
   This is the most serious active bug in today’s set because it may affect **metadata commit correctness** and potentially table recoverability. No fix PR is visible in the provided data.

2. **Glue commit handling on non-deterministic AWS errors can delete valid new metadata**  
   - [PR #15530](https://github.com/apache/iceberg/pull/15530)  
   This open PR addresses a major correctness hazard: if Glue commits succeed but timeout responses are treated as failures, Iceberg may delete metadata that the catalog now references. This is a classic distributed commit ambiguity problem and an important stability improvement if merged.

3. **SparkActions cannot decrypt Avro when table encryption is enabled because `ManifestFileBean` lacks `keyMetadata`**  
   - [Issue #14164](https://github.com/apache/iceberg/issues/14164)  
   This affects **encrypted table usability** and Spark maintenance actions. It is a serious feature-blocking bug for security-sensitive users. No corresponding fix PR is listed here.

### Medium severity
4. **Flink job stuck in `INITIALIZING` with RANGE distribution mode**  
   - [Issue #14079](https://github.com/apache/iceberg/issues/14079)  
   Closed today, indicating progress or resolution. Operationally important for high-parallelism Flink deployments.

5. **`NullabilityHolder.reset()` does not clear stale null markers**  
   - [Issue #15808](https://github.com/apache/iceberg/issues/15808)  
   Fix available: [PR #15809](https://github.com/apache/iceberg/pull/15809)  
   Current impact appears limited because callers overwrite positions today, but this is a **latent correctness trap** in vectorized/Arrow-style processing and worth fixing proactively.

### Lower severity / quality
6. **Spec/documentation inconsistencies and formatting issues**  
   - [PR #15813](https://github.com/apache/iceberg/pull/15813)  
   - [PR #15810](https://github.com/apache/iceberg/pull/15810)  
   - [PR #15811](https://github.com/apache/iceberg/pull/15811)  
   - [PR #15812](https://github.com/apache/iceberg/pull/15812)  
   These do not affect runtime stability directly but improve contributor and user experience.

## 5. Feature Requests & Roadmap Signals
Several open items give useful signals about likely near-term roadmap direction:

- **Flink modernization / test infrastructure cleanup**  
  - [Issue #12937](https://github.com/apache/iceberg/issues/12937)  
  - [PR #15815](https://github.com/apache/iceberg/pull/15815)  
  This looks likely to land soon given the paired issue/PR and straightforward scope.

- **Explicit Azure ADLS credential configuration**  
  - [Issue #13819](https://github.com/apache/iceberg/issues/13819)  
  Strong enterprise signal. This is the kind of connector/FileIO improvement that often gets accepted if implementation is low-risk and consistent with existing cloud auth patterns.

- **Avro `local-timestamp-*` logical type support in Spark and Flink**  
  - [PR #15455](https://github.com/apache/iceberg/pull/15455)  
  - [PR #15454](https://github.com/apache/iceberg/pull/15454)  
  These are strong candidates for a next release because they improve **cross-engine compatibility** with existing Avro data.

- **ORC lineage fields for V3 tables**  
  - [PR #15776](https://github.com/apache/iceberg/pull/15776)  
  Adding `_row_id` and `_last_updated_sequence_number` readers in ORC closes a format capability gap versus Parquet and Avro. This aligns with Iceberg’s **row lineage / v3 metadata evolution** direction.

- **Flink sink extensibility with `WriteObserver`**  
  - [PR #15784](https://github.com/apache/iceberg/pull/15784)  
  This is a notable roadmap signal toward richer **per-record metadata capture** and snapshot summary extensibility in Flink pipelines.

- **Secondary index metadata handling POC**  
  - [PR #15101](https://github.com/apache/iceberg/pull/15101)  
  This is more exploratory and less likely for immediate release, but strategically important. If it gains traction, it could shape medium-term roadmap conversations around query acceleration and metadata planning.

**Most likely near-next-version candidates:** Flink JUnit4 removal, Arrow nullability fix, Avro local-timestamp support, Glue commit safety fix, and selected docs/spec updates.

## 6. User Feedback Summary
Today’s user feedback highlights a few recurring real-world pain points:

- **Commit correctness under failure is a top concern.** Both Hive lock persistence behavior and Glue timeout ambiguity show that users are encountering edge cases where catalog state and metadata files can diverge. This reflects production-scale adoption where transient infra faults matter as much as query features.
- **Security-sensitive deployments need better encryption and auth ergonomics.** The SparkActions Avro decryption issue and explicit ADLS credential request both point to users operating in controlled enterprise environments where defaults are not enough.
- **Cross-engine compatibility remains a practical adoption blocker.** Avro logical timestamp support for Spark/Flink and ORC lineage parity show that users expect consistent semantics across file formats and compute engines.
- **Contributor onboarding and build hygiene still matter.** The cluster of docs/build PRs suggests active external contribution, but also indicates that stale examples and dependency leftovers create friction.

Net feedback is not about raw performance today; it is more about **correctness, operability, compatibility, and maintainability**.

## 7. Backlog Watch
These older or stale items appear important enough to warrant maintainer review:

- **[Issue #14096](https://github.com/apache/iceberg/issues/14096)** — Hive `persistTable` connection-loss metadata overwrite risk  
  High-impact data safety concern; should not remain stale for long.

- **[Issue #14164](https://github.com/apache/iceberg/issues/14164)** — encrypted Avro/SparkActions blocked by missing `keyMetadata` serialization  
  Important for encrypted table workflows and security-conscious production users.

- **[Issue #13819](https://github.com/apache/iceberg/issues/13819)** — explicit ADLS credentials support  
  Valuable for Azure enterprise adoption; stale status suggests connector ergonomics may be under-prioritized.

- **[PR #15530](https://github.com/apache/iceberg/pull/15530)** — Glue commit status handling on ambiguous AWS failures  
  This is a high-value robustness patch and deserves focused review.

- **[PR #15454](https://github.com/apache/iceberg/pull/15454)** and **[PR #15455](https://github.com/apache/iceberg/pull/15455)** — Avro local timestamp support for Flink/Spark  
  Useful compatibility work that could unblock users working with Avro logical types.

- **[PR #15101](https://github.com/apache/iceberg/pull/15101)** — secondary index metadata POC  
  Even if not ready to merge, it likely needs architectural feedback to avoid languishing.

## 8. Overall Health Assessment
Apache Iceberg remains **healthy and actively developed**, with strong multi-engine momentum across Spark, Flink, ORC, Arrow, REST/OpenAPI, and cloud catalog integrations. The project’s current workstream suggests a mature phase focused on **hardening correctness under failure**, **closing engine/format parity gaps**, and **improving contributor/user ergonomics**. The main risk signal is the number of **stale but important correctness issues** around metadata commits, encryption, and cloud catalog behavior. If those receive attention soon, the near-term outlook remains strong.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-29

## 1) Today's Overview

Delta Lake showed **moderate development activity** over the last 24 hours: **12 pull requests were updated**, **2 issues were updated**, and **no releases were published**. The dominant theme is continued investment in **Delta Kernel + Spark CDC/streaming integration**, with a large stacked PR series advancing offset management, commit processing, schema coordination, data reading, and end-to-end tests. A second clear theme is **ecosystem expansion**, especially around **Flink support**, where both an epic issue and documentation/bootstrap PR remain active. Overall project health looks **engineering-heavy and forward-moving**, but the absence of merged PRs today means visible progress is concentrated in review pipelines rather than shipped changes.

## 2) Project Progress

No PRs were merged or closed in the last 24 hours, so there is **no finalized code movement** to report for today.

That said, active work indicates several important areas are progressing in review:

- **Kernel-Spark CDC streaming stack**
  - [#6075](https://github.com/delta-io/delta/pull/6075) — **[kernel-spark][Part 1] CDC streaming offset management (initial snapshot)**
  - [#6076](https://github.com/delta-io/delta/pull/6076) — **[kernel-spark][Part 2] CDC commit processing**
  - [#6336](https://github.com/delta-io/delta/pull/6336) — **[kernel-spark][Part 3] CDC streaming offset management**
  - [#6359](https://github.com/delta-io/delta/pull/6359) — **[kernel-spark][Part 4] CDC data reading**
  - [#6362](https://github.com/delta-io/delta/pull/6362) — **[kernel-spark][Part 5] CDC schema coordination**
  - [#6363](https://github.com/delta-io/delta/pull/6363) — **[kernel-spark][Part 6] End-to-end CDC streaming integration tests**
  - [#6370](https://github.com/delta-io/delta/pull/6370) — **[kernel-spark][Part 7] DV+CDC same-path pairing and DeletionVector support**
  - [#6388](https://github.com/delta-io/delta/pull/6388) — **Support allowOutOfRange for CDC startingVersion in DSv2 streaming**
  - [#6391](https://github.com/delta-io/delta/pull/6391) — **CDC admission limits for commit processing**

  This stack suggests Delta Lake is pushing toward a **much more complete CDC streaming implementation through kernel-spark**, including correctness around offsets, schema handling, deletion vectors, and integration test coverage.

- **Commit correctness / coordinated commits**
  - [#6353](https://github.com/delta-io/delta/pull/6353) — **Fix race condition in commitFilesIterator causing silent data loss with coordinated commits**

  This is potentially one of the most important in-flight fixes because it targets **silent data loss risk** under concurrent commit/backfill timing.

- **Flink enablement**
  - [#5901](https://github.com/delta-io/delta/issues/5901) — **[Flink] Create Delta Kernel based Flink Sink**
  - [#6431](https://github.com/delta-io/delta/pull/6431) — **[Flink] Readme & Docker Compose**

  These indicate practical ecosystem work: not only building a sink, but also the surrounding docs and local dev/test environment needed for adoption.

- **Sharing offset behavior**
  - [#6392](https://github.com/delta-io/delta/pull/6392) — **DeltaFormatSharingSource only finish current version when startOffset is from Legacy**

  This points to refinement in **Delta Sharing source semantics**, likely improving compatibility between legacy and newer offset interpretations.

## 3) Community Hot Topics

### A. Kernel-Spark CDC streaming is the clear focal area
Most active engineering effort is clustered in the stacked CDC PR chain:
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)
- [#6388](https://github.com/delta-io/delta/pull/6388)
- [#6391](https://github.com/delta-io/delta/pull/6391)

**Underlying technical need:** users want **robust, production-grade CDC streaming** with consistent offset semantics, schema evolution handling, support for deletion vectors, and DSv2 compatibility. The breadth of this stack suggests Delta maintainers see CDC streaming as a **strategic capability**, not a narrow patch series.

### B. Flink support remains a roadmap signal
- [#5901](https://github.com/delta-io/delta/issues/5901) — epic for a **Delta Kernel based Flink Sink**
- [#6431](https://github.com/delta-io/delta/pull/6431) — **Readme & Docker Compose**

**Underlying technical need:** organizations increasingly want Delta Lake to work beyond Spark-native write paths. A kernel-based sink for Flink would improve Delta’s position in **stream processing and mixed-engine lakehouse deployments**.

### C. Engine creation centralization in kernel-spark
- [#5675](https://github.com/delta-io/delta/issues/5675) — **Centralize DefaultEngine.create(...) and pass engine as a parameter after creation**

This issue has the highest visible comment count in the current issue list:
- [#5675](https://github.com/delta-io/delta/issues/5675)

**Underlying technical need:** internal **engine lifecycle consistency**, easier swapping of implementation, and better architecture hygiene. This kind of refactor often precedes broader portability or testability improvements.

## 4) Bugs & Stability

Ranked by apparent severity from today’s active items:

### 1. High severity — potential silent data loss in coordinated commits
- [#6353](https://github.com/delta-io/delta/pull/6353) — **Fix race condition in commitFilesIterator causing silent data loss with coordinated commits**

**Why it matters:** the PR summary explicitly describes a concurrency race where commit file discovery can miss commits if backfilling happens between two discovery phases. Because the symptom is **silent data loss**, this is the most critical item currently in motion.

**Status:** fix PR is open; no merge yet.

### 2. Medium severity — Sharing source offset completion behavior
- [#6392](https://github.com/delta-io/delta/pull/6392) — **DeltaFormatSharingSource only finish current version when startOffset is from Legacy**

**Why it matters:** offset interpretation bugs in a sharing/streaming source can cause incorrect progress tracking, duplicate processing, or skipped data depending on the consumer model.

**Status:** fix PR is open.

### 3. Medium severity — CDC correctness and completeness gaps
Relevant PRs:
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)
- [#6388](https://github.com/delta-io/delta/pull/6388)
- [#6391](https://github.com/delta-io/delta/pull/6391)

**Why it matters:** while these are framed as feature work, they also indicate that **CDC streaming correctness boundaries are still being actively defined**—especially around schema coordination, admission limits, deletion vectors, and start-version edge cases.

**Status:** active PR stack; no merges today.

## 5) Feature Requests & Roadmap Signals

### A. Delta Kernel-based Flink Sink
- [#5901](https://github.com/delta-io/delta/issues/5901) — **[Flink] Create Delta Kernel based Flink Sink**

This is the clearest roadmap item in the current issue set. Because it is tracked as an **epic** with milestone framing and linked PRs, it appears to be a **serious medium-term deliverable**, not a speculative request.

**Prediction:** highly likely to appear in an upcoming preview or incremental release once enough build/test/documentation scaffolding lands.

### B. Centralized kernel-spark engine factory
- [#5675](https://github.com/delta-io/delta/issues/5675) — **Centralize DefaultEngine.create(...)**

This is more of an architectural enhancement than an end-user feature, but it signals work toward:
- cleaner engine abstraction boundaries,
- easier implementation swapping,
- reduced duplication in kernel-spark components.

**Prediction:** likely to land as internal cleanup rather than headline release material, but it could enable future connector/runtime flexibility.

### C. Stronger CDC streaming feature surface
Open PRs suggest near-term roadmap emphasis on:
- starting version semantics and out-of-range handling: [#6388](https://github.com/delta-io/delta/pull/6388)
- deletion vector aware CDC behavior: [#6370](https://github.com/delta-io/delta/pull/6370)
- schema coordination in streaming: [#6362](https://github.com/delta-io/delta/pull/6362)
- operational limits during commit processing: [#6391](https://github.com/delta-io/delta/pull/6391)

**Prediction:** the next notable Delta release is likely to highlight **CDC streaming maturity in kernel-spark**, especially if this stacked series merges intact.

## 6) User Feedback Summary

Based on today’s issues and PRs, the main user pain points appear to be:

- **Correctness under concurrency**
  - The coordinated commit race in [#6353](https://github.com/delta-io/delta/pull/6353) indicates users need stronger guarantees in high-concurrency write environments.

- **Operationally reliable CDC streaming**
  - The large CDC stack implies demand for a streaming interface that behaves predictably across:
    - initial snapshot handling,
    - incremental offsets,
    - schema evolution,
    - deletion vectors,
    - commit-volume limits.

- **Broader engine interoperability**
  - The Flink sink epic [#5901](https://github.com/delta-io/delta/issues/5901) and related docs PR [#6431](https://github.com/delta-io/delta/pull/6431) reflect user interest in using Delta outside pure Spark workflows.

- **Cleaner internal engine lifecycle**
  - The refactor request in [#5675](https://github.com/delta-io/delta/issues/5675) suggests contributors are feeling friction from duplicated engine initialization paths.

There is **little direct sentiment data** today—reactions are zero and comment counts are low—so feedback should be interpreted as **implicit demand inferred from active engineering work**, not broad community voting.

## 7) Backlog Watch

These items deserve maintainer attention because they are strategically important and still unresolved:

### A. Flink Sink epic remains open
- [#5901](https://github.com/delta-io/delta/issues/5901)

This is a high-value ecosystem expansion item. Since it is an umbrella issue, maintainers should keep milestone status, linked PRs, and delivery expectations current to help adopters understand readiness.

### B. Long-running CDC stack needs review throughput
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)

These PRs date back to **2026-02-19** and are foundational to the larger CDC stack. Extended review latency on the base layers can bottleneck all downstream parts.

### C. Architecture cleanup issue in kernel-spark
- [#5675](https://github.com/delta-io/delta/issues/5675)

Even though it is not urgent from an end-user perspective, centralizing engine creation could reduce future maintenance cost and simplify subsequent feature work in kernel-spark.

### D. High-risk data correctness fix still unmerged
- [#6353](https://github.com/delta-io/delta/pull/6353)

Given the explicit **silent data loss** framing, this should be treated as a priority review candidate.

---

## Overall Health Assessment

Delta Lake appears **technically active and strategically focused**, with strong momentum in **CDC streaming** and **multi-engine expansion via Flink**. The main caution signal is that several important items—including a possible silent data loss fix—are still **open and unmerged**, so risk reduction has not yet translated into released artifacts. In short: **healthy development velocity, meaningful roadmap progress, but limited “shipped today” impact**.

If you want, I can also turn this into a **short executive summary**, a **maintainer-oriented review queue**, or a **table format** for daily reporting.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-29

## 1. Today's Overview
Databend showed light but focused GitHub activity over the last 24 hours, with 1 updated issue and 1 updated pull request, and no new releases. The main development signal is a query-layer bugfix PR addressing `VARIANT` to numeric casting behavior, which points to ongoing work on SQL correctness and semi-structured data compatibility. On the maintenance side, an automated link-check report surfaced a single documentation/readme link error, suggesting documentation hygiene is being continuously monitored. Overall, project activity appears low-volume today, but the items updated are relevant to correctness and developer experience rather than broad feature delivery.

## 3. Project Progress
No PRs were merged or closed in the last 24 hours, so there is no completed progress to report for today in query engine features, storage optimizations, or SQL compatibility landing on `main`.

However, one open bugfix PR is noteworthy:

- [PR #19623](https://github.com/databendlabs/databend/pull/19623) — **`fix(query): fix variant cast to number`** by @b41sh  
  This PR proposes a query-engine correctness fix for casting `VARIANT` values containing floating-point numbers into integer types. Based on the PR summary, floating-point values inside `VARIANT` will be cast to integers via rounding. This is a meaningful SQL compatibility and semi-structured data usability improvement, especially for workloads that ingest JSON-like values and later project them into typed analytical queries.

## 4. Community Hot Topics
With only one updated PR and one updated issue, there is limited discussion volume today. The most relevant items are:

- [PR #19623](https://github.com/databendlabs/databend/pull/19623) — **Variant cast to number fix**  
  Although it has no visible reactions and comment count is unavailable in the provided data, this is the most technically significant update. It reflects an underlying need for more predictable type coercion semantics when querying semi-structured data. In OLAP systems, `VARIANT`/JSON interoperability is a common source of subtle correctness problems, so this PR likely addresses practical user friction in analytics pipelines.

- [Issue #19630](https://github.com/databendlabs/databend/issues/19630) — **Link Checker Report**  
  This automated issue reports 1 link error out of 117 checked targets. While not a product feature discussion, it highlights ongoing repository maintenance and documentation quality controls. The technical need here is straightforward: preventing stale internal docs references that can slow onboarding or obscure SQL/storage engine behavior.

## 5. Bugs & Stability
Ranked by likely impact based on today’s data:

1. **Query correctness / type conversion bug**
   - [PR #19623](https://github.com/databendlabs/databend/pull/19623) — **`fix(query): fix variant cast to number`**
   - **Severity:** Medium  
   - **Why it matters:** Incorrect or inconsistent casting from `VARIANT` to numeric types can affect result correctness in analytical SQL, especially when users ingest floating-point values from JSON or semi-structured sources and expect downstream integer projections to behave predictably.
   - **Fix status:** An open fix PR exists.
   - **Risk area:** SQL semantics, type system consistency, compatibility with user expectations from other analytical databases.

2. **Documentation link breakage**
   - [Issue #19630](https://github.com/databendlabs/databend/issues/19630) — **Link Checker Report**
   - **Severity:** Low  
   - **Why it matters:** The report shows 1 documentation/readme link error. This is not a runtime stability problem, but unresolved docs issues can reduce usability for developers and operators.
   - **Fix status:** No linked fix PR in the provided data.

No crashes, storage regressions, or performance incidents were reported in the provided GitHub activity snapshot.

## 6. Feature Requests & Roadmap Signals
There were no explicit user-submitted feature requests updated today, so roadmap signals are weak.

The clearest near-term signal is continued refinement of:
- **SQL compatibility around semi-structured data types**
- **`VARIANT` casting behavior**
- **Developer/documentation quality automation**

If current work continues, a near-future release may include additional polish in:
- numeric coercion rules for `VARIANT`
- edge-case handling for JSON/semi-structured query paths
- smaller SQL correctness fixes rather than major new storage or engine features

## 7. User Feedback Summary
Direct end-user feedback is minimal in today’s dataset. Still, the open PR suggests a clear pain point:

- Users working with **semi-structured data** likely need more intuitive and reliable casting from `VARIANT` values into standard numeric SQL types.
- The proposed rounding behavior for float-to-integer conversion indicates demand for smoother interoperability between loosely typed ingested data and strongly typed analytical expressions.
- Documentation maintenance remains an operational concern, though today’s issue suggests this is being managed proactively rather than driven by heavy user complaints.

There is no strong evidence today of performance dissatisfaction, storage-engine instability, or connector-related friction.

## 8. Backlog Watch
No long-unanswered high-priority issues or PRs are visible in the provided 24-hour snapshot. Still, two items merit maintainer attention:

- [PR #19623](https://github.com/databendlabs/databend/pull/19623)  
  This should receive timely semantic review because type conversion behavior can affect backward compatibility and query correctness. Maintainers may want to confirm whether **rounding** is the intended cross-engine-compatible behavior versus truncation or explicit-cast-only rules.

- [Issue #19630](https://github.com/databendlabs/databend/issues/19630)  
  Low urgency, but worth resolving to keep docs and code examples reliable.

## Overall Health Assessment
Databend appears stable today, with low activity but signals of active maintenance in SQL correctness and documentation quality. No release activity or major ecosystem shifts were recorded. The most important technical thread is the open fix for `VARIANT` numeric casting, which aligns with Databend’s role as an analytical engine handling modern semi-structured workloads.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-29

## 1. Today's Overview

Velox showed moderate pull-request activity over the last 24 hours, with **9 PRs updated**, **1 merged/closed**, and **no issue activity or new releases**. The day’s work was concentrated in three technical areas: **GPU execution expansion via cuDF**, **execution/debuggability improvements for join replay/tracing**, and **performance/correctness fixes in core engine paths**. The absence of new issues suggests a relatively quiet external bug-reporting day, though it also means roadmap signals are coming mainly from active PRs rather than user-filed discussions. Overall, project health looks **active and engineering-driven**, with visible investment in both advanced acceleration features and operational tooling.

## 3. Project Progress

### Merged/closed PRs today

- **Build impact analysis workflow for PRs** — [PR #16827](https://github.com/facebookincubator/velox/pull/16827)  
  **Status:** Closed/Merged  
  This change adds a workflow to determine which **CMake targets** are affected by a PR by combining the **CMake File API** with dependency scanning from `compile_commands.json`. While not a query feature directly, it meaningfully advances developer productivity and CI efficiency: faster impact analysis should reduce unnecessary builds/tests and improve turnaround for engine changes. For an analytical engine project with a large C++ surface area, this is a valuable scalability improvement for contributor velocity.

### Notable in-flight progress

Although not yet merged, several open PRs indicate where the engine is advancing next:

- **GPU Window operator** — [PR #16892](https://github.com/facebookincubator/velox/pull/16892)  
  Adds a GPU-accelerated `Window` implementation via cuDF, signaling expansion of GPU coverage beyond scans/joins into more stateful analytic SQL operators.

- **GPU NestedLoopJoin / cross join** — [PR #16942](https://github.com/facebookincubator/velox/pull/16942)  
  Introduces GPU execution for cross joins, important for broadening join-shape support in accelerated execution paths.

- **IndexLookupJoin split tracing and replay** — [PR #16950](https://github.com/facebookincubator/velox/pull/16950)  
  Improves traceability and replay for one of the more complex execution operators, useful for debugging correctness and production replay scenarios.

- **Nimble metadata cache optimization** — [PR #16948](https://github.com/facebookincubator/velox/pull/16948)  
  Targets metadata I/O overhead in Nimble-backed workloads, a relevant storage-side optimization for analytic scans.

- **Counting join merge correctness fix** — [PR #16949](https://github.com/facebookincubator/velox/pull/16949)  
  Addresses a correctness issue in counting joins used by `EXCEPT ALL` / `INTERSECT ALL`, directly relevant to SQL result correctness.

- **Spark SQL `collect_set` compatibility fix** — [PR #16947](https://github.com/facebookincubator/velox/pull/16947)  
  Restores backward-compatible null handling behavior, indicating active maintenance of Spark SQL semantics.

## 4. Community Hot Topics

There were **no updated issues** today, so the strongest “hot topics” come from active PRs rather than issue discussion volume. Also, the provided data shows **no reactions** and no comment counts, so ranking is based on technical significance and recency of updates.

### 1) GPU acceleration of analytic operators
- **GPU Window operator** — [PR #16892](https://github.com/facebookincubator/velox/pull/16892)
- **GPU NestedLoopJoin (cross join)** — [PR #16942](https://github.com/facebookincubator/velox/pull/16942)

**Why it matters:**  
These PRs indicate a push to make Velox’s GPU path capable of handling more of the full SQL pipeline, not just isolated operators. Window functions and cross joins are important because they are often blockers for end-to-end accelerated execution. The underlying technical need appears to be **reducing CPU fallback frequency** and increasing the share of real-world analytical plans that can remain on GPU.

### 2) Replayability and execution introspection
- **Trace index splits in IndexLookupJoin for replay** — [PR #16950](https://github.com/facebookincubator/velox/pull/16950)

**Why it matters:**  
This points to a need for **deterministic debugging and production trace replay** for complex connector-driven operators. In distributed analytical systems, reproducing lookup-side split behavior is often difficult; this PR suggests users or internal teams need better observability around nontrivial join execution.

### 3) Storage metadata efficiency
- **Optimize Nimble metadata IO with MetadataCache and pinned caching** — [PR #16948](https://github.com/facebookincubator/velox/pull/16948)

**Why it matters:**  
Repeated metadata fetches can materially hurt scan-heavy workloads with many stripe groups or indexes. This PR reflects demand for **lower-latency metadata access** and better cache residency in storage-layer integrations.

### 4) SQL correctness and compatibility
- **Fix counting join count merge in HashTable::buildFullProbe** — [PR #16949](https://github.com/facebookincubator/velox/pull/16949)
- **Default ignoreNulls to true for collect_set backward compatibility** — [PR #16947](https://github.com/facebookincubator/velox/pull/16947)

**Why it matters:**  
These changes address two recurring needs in engine adoption: **strict result correctness** and **compatibility with upstream SQL dialect behavior**. Both are foundational for trust in a production analytical engine.

## 5. Bugs & Stability

No new issues were reported today, but a few PRs expose active bug-fix and stability work.

### High severity
1. **Counting join merge correctness bug affecting `EXCEPT ALL` / `INTERSECT ALL`**  
   - [PR #16949](https://github.com/facebookincubator/velox/pull/16949)  
   This appears to be the most severe item in today’s set because it can produce **incorrect query results** when multiple build drivers process overlapping keys. Query correctness issues in set semantics are high priority for OLAP systems.

### Medium severity
2. **Spark SQL `collect_set` null-handling regression / compatibility break**  
   - [PR #16947](https://github.com/facebookincubator/velox/pull/16947)  
   The PR explicitly references a backward compatibility bug introduced earlier. This is a semantic correctness issue, especially important for Spark interoperability and migration safety.

3. **Potential debugging/reproducibility gap in `IndexLookupJoin`**  
   - [PR #16950](https://github.com/facebookincubator/velox/pull/16950)  
   Not a bug report per se, but the addition of split tracing suggests existing pain in diagnosing or replaying lookup-join behavior under real workloads.

### Low severity / performance-stability
4. **Spill path string extraction inefficiency**  
   - [PR #16721](https://github.com/facebookincubator/velox/pull/16721)  
   This is framed as an optimization, but spill-path inefficiency can become a stability concern under memory pressure because it amplifies serialization overhead and memory churn.

## 6. Feature Requests & Roadmap Signals

No explicit user-filed feature requests appeared today, but current PRs provide strong roadmap signals.

### Strong signals likely to influence the next version

- **Broader GPU SQL coverage**
  - [PR #16892](https://github.com/facebookincubator/velox/pull/16892)
  - [PR #16942](https://github.com/facebookincubator/velox/pull/16942)  
  The clearest signal is continued investment in **GPU-native operator coverage**, especially for higher-level analytical semantics like window functions and cross joins. These are likely candidates for inclusion in a future release if validation succeeds.

- **Better execution tracing/replay tooling**
  - [PR #16950](https://github.com/facebookincubator/velox/pull/16950)  
  Replayability and trace fidelity appear strategically important, likely because Velox is being used in environments that need **postmortem reproducibility** and operator-level introspection.

- **Storage-engine metadata caching**
  - [PR #16948](https://github.com/facebookincubator/velox/pull/16948)  
  Continued optimization around Nimble suggests storage-layer efficiency remains a roadmap priority, particularly for metadata-heavy scan patterns.

- **Engine compatibility hardening**
  - [PR #16947](https://github.com/facebookincubator/velox/pull/16947)  
  Spark SQL compatibility remains an active maintenance theme and will likely continue to shape near-term releases.

## 7. User Feedback Summary

There is **no direct user issue or reaction data** in today’s snapshot, so feedback must be inferred from engineering activity.

Likely user pain points reflected by current work:
- **Need for more complete GPU acceleration** without CPU fallback for common analytical plans  
  - [PR #16892](https://github.com/facebookincubator/velox/pull/16892)
  - [PR #16942](https://github.com/facebookincubator/velox/pull/16942)

- **Need for reliable SQL semantics**, especially around set operators and Spark-compatible aggregation behavior  
  - [PR #16949](https://github.com/facebookincubator/velox/pull/16949)
  - [PR #16947](https://github.com/facebookincubator/velox/pull/16947)

- **Need for better performance under metadata-heavy or spill-heavy workloads**
  - [PR #16948](https://github.com/facebookincubator/velox/pull/16948)
  - [PR #16721](https://github.com/facebookincubator/velox/pull/16721)

- **Need for stronger debugging and replay tools in complex execution paths**
  - [PR #16950](https://github.com/facebookincubator/velox/pull/16950)

Overall, user-facing signals today skew toward **performance scaling, correctness, and production operability** rather than new connectors or SQL surface-area expansion.

## 8. Backlog Watch

With no issue backlog data provided, backlog risk is visible mainly through **older open PRs** that may warrant maintainer attention.

- **Spill RowContainer string extraction optimization** — [PR #16721](https://github.com/facebookincubator/velox/pull/16721)  
  Open since **2026-03-11**. This is the oldest open PR in the current set and targets spill performance, which can have outsized impact in memory-constrained analytical workloads. Worth watching for review/merge progress.

- **GPU Window operator** — [PR #16892](https://github.com/facebookincubator/velox/pull/16892)  
  Open since **2026-03-23**. Given its size and architectural significance, it may need substantial review bandwidth. If merged, it would represent a notable milestone in GPU execution maturity.

- **GPU NestedLoopJoin** — [PR #16942](https://github.com/facebookincubator/velox/pull/16942)  
  Newer, but strategically important. Cross joins are niche but can block accelerated execution for some workloads; maintainers may want to clarify scope, safeguards, and performance trade-offs.

## Overall Health Assessment

Velox appears **healthy and actively evolving**, with today’s work centered on high-value engine internals rather than outward release packaging. The most important themes are **GPU execution expansion**, **correctness fixes in join/aggregation semantics**, and **observability/performance improvements** in production paths. The lack of issue traffic keeps external sentiment opaque for the day, but engineering momentum remains strong.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-29

## 1. Today's Overview
Apache Gluten showed light but focused activity over the last 24 hours: 1 active issue and 3 updated open PRs, with no merged PRs and no new releases. The visible work is concentrated around the Velox backend, especially upstream synchronization and SQL semantic compatibility for aggregate functions. Overall project health appears stable, but today’s snapshot suggests a maintenance-and-alignment day rather than a feature landing day. The strongest signals are continued dependence on Velox upstream progress and ongoing work to improve Spark compatibility in edge SQL semantics.

## 2. Project Progress
No pull requests were merged or closed in the last 24 hours, so there were no completed advances today in query execution features, storage optimizations, or SQL correctness fixes.

That said, the open PR queue indicates active in-flight work:

- [#11845](https://github.com/apache/incubator-gluten/pull/11845) — **Daily Update Velox Version (2026_03_28)**  
  This is part of the routine upstream Velox sync process, which is important for keeping Gluten aligned with backend engine improvements, fixes, and documentation changes.

- [#11837](https://github.com/apache/incubator-gluten/pull/11837) — **Support `RESPECT NULLS` for `collect_list` / `collect_set`**  
  This is a meaningful SQL compatibility enhancement for Spark semantics, specifically addressing null-handling behavior in aggregation.

- [#11526](https://github.com/apache/incubator-gluten/pull/11526) — **Add comprehensive `collect_list` tests for type coverage and fallback**  
  This strengthens correctness validation across data types and fallback behavior, which is important for production reliability.

## 3. Community Hot Topics
### 3.1 Velox upstream dependency tracking
- [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585) — **[VL] useful Velox PRs not merged into upstream**  
  - 16 comments, 4 👍  
  - Most active item in the current dataset.

This tracker reflects a key technical reality for Gluten: important functionality often depends on Velox PRs contributed by the Gluten community but not yet accepted upstream. The issue suggests maintainers are trying to avoid carrying a large private patch stack in `gluten/velox` because rebasing is costly. The underlying need is clear: better upstream merge velocity, or clearer policy on temporary downstream picks for high-value features and fixes.

### 3.2 Spark SQL semantic parity for aggregate functions
- [PR #11837](https://github.com/apache/incubator-gluten/pull/11837) — **Support `RESPECT NULLS` for `collect_list` / `collect_set`**
- [PR #11526](https://github.com/apache/incubator-gluten/pull/11526) — **Comprehensive `collect_list` tests**

These two PRs together indicate a concentrated effort on aggregate-function correctness. The technical need is not just adding functions, but matching Spark behavior exactly, including null semantics, type coverage, and fallback paths. This is especially important for users adopting Gluten as an acceleration layer without wanting query-result differences.

### 3.3 Continuous backend sync
- [PR #11845](https://github.com/apache/incubator-gluten/pull/11845) — **Daily Update Velox Version**
  
Daily Velox updates remain a visible operational theme. This suggests backend freshness is a priority, likely because performance, bug fixes, and feature readiness are closely tied to Velox head.

## 4. Bugs & Stability
No new bug reports, crash reports, or explicit regressions were updated in the last 24 hours.

Current stability-relevant items, ranked by likely production impact:

1. **Query correctness / SQL semantic mismatch risk**
   - [PR #11837](https://github.com/apache/incubator-gluten/pull/11837)  
   If `collect_list` / `collect_set` do not honor Spark’s `RESPECT NULLS` semantics, users may see result mismatches rather than outright failures. This is high severity for correctness-sensitive workloads.  
   **Fix status:** Open PR exists.

2. **Insufficient aggregate test coverage**
   - [PR #11526](https://github.com/apache/incubator-gluten/pull/11526)  
   Lack of broad type and fallback testing can allow silent correctness or fallback regressions.  
   **Fix status:** Open PR exists.

3. **Unmerged upstream Velox dependencies**
   - [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585)  
   This is more of a structural stability risk: needed backend patches may remain unavailable or delayed, affecting feature delivery and maintainability.  
   **Fix status:** No direct fix PR; tracked as ongoing dependency management.

## 5. Feature Requests & Roadmap Signals
The clearest roadmap signals today come from active development rather than newly filed feature requests.

### Likely near-term feature directions
- **Improved Spark SQL compatibility**
  - [PR #11837](https://github.com/apache/incubator-gluten/pull/11837)  
  Support for `RESPECT NULLS` in `collect_list` / `collect_set` points to continued investment in semantic parity with Spark SQL.

- **Broader aggregate-function robustness**
  - [PR #11526](https://github.com/apache/incubator-gluten/pull/11526)  
  Expanded test coverage usually precedes broader rollout confidence for aggregate features.

- **Ongoing Velox capability adoption**
  - [PR #11845](https://github.com/apache/incubator-gluten/pull/11845)  
  Frequent Velox version bumps indicate Gluten will likely continue inheriting backend features and fixes rapidly, assuming compatibility holds.

### Prediction for next version
The next release is likely to include:
- more Spark-compatible aggregate behavior,
- additional correctness hardening through tests,
- Velox-sourced backend updates and fixes.

There is less evidence today for major new connectors, storage format work, or large execution-engine redesigns.

## 6. User Feedback Summary
From today’s visible discussions, the main user and contributor pain points appear to be:

- **Need for exact Spark behavior**  
  The work on null semantics in `collect_list` / `collect_set` suggests users care about result equivalence, not just speed.

- **Need for stronger correctness guarantees across types and fallback paths**  
  The comprehensive test PR indicates concern that acceleration should not introduce edge-case inconsistencies.

- **Friction caused by upstream dependency lag**  
  The Velox tracker issue shows contributors want useful backend changes available sooner, but without creating high maintenance burden downstream.

There is no direct positive/negative end-user performance feedback in the provided data snapshot.

## 7. Backlog Watch
### Items needing maintainer attention
- [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585) — **[VL] useful Velox PRs not merged into upstream**  
  Created 2026-02-07, still active, 16 comments.  
  This is the most important backlog item in the current set because it affects delivery velocity, backend feature availability, and maintenance cost.

- [PR #11526](https://github.com/apache/incubator-gluten/pull/11526) — **Add comprehensive `collect_list` tests for type coverage and fallback**  
  Created 2026-01-30, still open.  
  Older correctness-focused PRs like this deserve attention because long delays in test infrastructure can slow safe feature rollout.

- [PR #11837](https://github.com/apache/incubator-gluten/pull/11837) — **Support `RESPECT NULLS` for `collect_list` / `collect_set`**  
  Although newer, it is strategically important because it directly addresses SQL compatibility and likely user-visible correctness.

## 8. Overall Health Assessment
Project health appears **stable but backend-dependent**. There is active work on SQL compatibility and continuous Velox synchronization, which is positive for long-term maturity. However, the absence of merges today and the prominence of the upstream Velox tracker underline a recurring execution risk: Gluten’s roadmap remains closely tied to external backend integration and upstream merge throughput.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-29

## 1. Today's Overview

Apache Arrow showed moderate day-to-day maintenance activity over the last 24 hours: 17 issues were updated and 6 PRs saw movement, with no new releases published. The dominant theme was platform and CI stabilization, especially around Linux packaging, MATLAB workflow permissions, and Windows/R infrastructure. On the feature side, the most concrete forward motion was around Flight SQL ODBC support on Linux and broader language/runtime parity such as Azure Blob filesystem exposure in R. Overall project health looks stable, but the signal from today is more about ecosystem hardening and cross-platform completeness than major engine feature landings.

## 3. Project Progress

### Closed or merged work advancing the project

#### 1) Linux ODBC support for Flight SQL moved forward
- Issue closed: [#49463](https://github.com/apache/arrow/issues/49463) — **[C++][FlightRPC][ODBC] Enable ODBC build on Linux**
- Related PR closed: [#49564](https://github.com/apache/arrow/pull/49564) — **[C++][FlightRPC] Add Ubuntu ODBC Support**

This is the most meaningful feature advancement in today’s set. It extends Flight SQL/ODBC support beyond Windows and macOS into Ubuntu/Linux, including CI coverage, Unicode support, ODBC registration after build, and docker-compose support for testing. For Arrow’s analytical stack, this strengthens SQL connectivity and client interoperability on Linux, which matters for BI tools, ODBC-based integrations, and enterprise deployment environments.

#### 2) CI/package build breakage from aws-lc/C23 was addressed quickly
- Issue closed: [#49601](https://github.com/apache/arrow/issues/49601) — **[CI][Packaging] ubuntu-resolute Linux fail building aws-lc**
- Related PR closed: [#49604](https://github.com/apache/arrow/pull/49604) — **[C++] Update bundled AWS SDK C++ for C23**

This was an important packaging and build-chain fix rather than a user-facing feature. Updating the bundled AWS SDK C++ stack to pick up an upstream aws-lc fix reduces build fragility on newer Linux toolchains and helps preserve Arrow’s cloud/storage integration reliability.

#### 3) Older enhancement backlog continued to be pruned/closed
- Closed: [#31118](https://github.com/apache/arrow/issues/31118) — **[Gandiva][C++] Add TRUNC function**
- Closed: [#31135](https://github.com/apache/arrow/issues/31135) — **[C++] Allow the write node to respect sorting**
- Closed: [#31102](https://github.com/apache/arrow/issues/31102) — **[C++][Gandiva] Implement Find_In_Set Function**

These closures suggest maintainers are actively reconciling old JIRA-migrated enhancement issues, though from the supplied data it is not always clear whether each was implemented, superseded, or administratively resolved. Still, they point to ongoing housekeeping around SQL/function coverage and execution-plan behavior.

## 4. Community Hot Topics

### Most discussed items

#### [#49463](https://github.com/apache/arrow/issues/49463) — Linux ODBC build enablement
- Comments: 6

This was the most actively discussed issue in the set and reflects a clear technical need: Arrow Flight SQL’s client ecosystem needs first-class Linux support. ODBC remains important for analytics platforms, JDBC/ODBC bridges, and BI tooling, so enabling Linux builds materially expands deployability.

#### [#49601](https://github.com/apache/arrow/issues/49601) — aws-lc build failures on ubuntu-resolute
- Comments: 4

This issue highlights Arrow’s dependence on a complex bundled dependency chain. The rapid close indicates maintainers are responsive to toolchain breakages, especially those affecting package generation and CI. It also signals the cost of staying compatible with evolving compiler standards like C23.

#### [#31653](https://github.com/apache/arrow/issues/31653) — dataset writer deadlock under backpressure and I/O error
- Comments: 3
- Open

Although old, this remains technically important. It touches execution/backpressure correctness in the C++ dataset writer, a core area for large analytical writes. The underlying need is stronger failure propagation in streaming/write pipelines, especially when backpressure prevents the “next batch” from surfacing an error.

#### [#49553](https://github.com/apache/arrow/pull/49553) — R support for Azure Blob filesystem
- PR status: open, awaiting review

This is one of the clearest roadmap signals from current PRs. Arrow users increasingly expect feature parity across Python, R, and C++, especially for cloud object stores. Exposing Azure Blob in R closes a notable gap for analytics workloads in Microsoft-centric environments.

#### [#48964](https://github.com/apache/arrow/pull/48964) — upgrade bundled Abseil/Protobuf/gRPC/google-cloud-cpp
- PR status: open, awaiting change review

This is strategically important even if not highly discussed in the provided data. Dependency upgrades across RPC and cloud stacks can unlock compatibility, security, and performance improvements, but the note about breaking public APIs means this needs careful review and migration planning.

## 5. Bugs & Stability

Ranked by likely severity based on user impact and subsystem breadth:

### 1) Build/packaging breakage on Linux toolchains — fixed
- Issue: [#49601](https://github.com/apache/arrow/issues/49601)
- Fix PR: [#49604](https://github.com/apache/arrow/pull/49604)

**Severity: High for maintainers/package consumers.**  
This blocked packaging/build jobs on ubuntu-resolute for both arm64 and amd64. Since Arrow is frequently consumed through binary packages and CI artifacts, toolchain breakage has ecosystem-wide impact. Good sign: a fix landed quickly.

### 2) MATLAB CI workflow blocked by GitHub action permissions
- Issue: [#49611](https://github.com/apache/arrow/issues/49611)
- Fix PR: none listed in provided data

**Severity: High for affected contributor workflow, medium overall.**  
The MATLAB workflow reportedly started failing due to organization action allowlist restrictions. This is not a runtime correctness bug, but it can silently block validation for the MATLAB binding and allow regressions to slip through.

### 3) `base64_decode` silently truncates invalid input instead of erroring
- Issue: [#49614](https://github.com/apache/arrow/issues/49614)
- Fix PR: none listed

**Severity: Medium-high.**  
Silent truncation is more dangerous than a hard error because it can propagate corrupted or incomplete data unnoticed. Even if this utility is internal/vendored, silent decode acceptance can affect correctness, parsing security assumptions, or diagnostics in downstream consumers.

### 4) PyArrow-backed pandas string storage shows severe row-wise assignment slowdown
- Issue: [#49612](https://github.com/apache/arrow/issues/49612)
- Fix PR: none listed

**Severity: Medium.**  
This appears to be a performance regression or pathological workload issue when `string_storage="pyarrow"` is used with repeated DataFrame `.loc` growth. It likely affects ETL-style incremental row construction workloads more than bulk analytical paths, but it is a visible user-experience problem.

### 5) Dataset writer deadlock under backpressure + I/O errors
- Issue: [#31653](https://github.com/apache/arrow/issues/31653)

**Severity: Medium-high but niche.**  
Potential deadlocks in write pipelines are serious for long-running jobs, especially in constrained-memory or failure-heavy environments. The age of the issue suggests this remains unresolved or insufficiently prioritized.

## 6. Feature Requests & Roadmap Signals

### Strong signals

#### Azure Blob filesystem support in R is likely approaching
- PR: [#49553](https://github.com/apache/arrow/pull/49553)

This is a concrete, reviewable feature addition and probably the best candidate in today’s data to reach an upcoming release. It improves cloud storage connector parity across languages and should matter to R-based ETL and analytics users on Azure.

#### Linux ODBC/Flight SQL support is becoming more complete
- Issue: [#49463](https://github.com/apache/arrow/issues/49463)
- PR: [#49564](https://github.com/apache/arrow/pull/49564)

Since the issue was closed with an implementation PR, this looks likely to appear in the next release cycle if not already queued. It’s a meaningful SQL connectivity and client driver enhancement.

### Medium-term signals from backlog

#### Better backpressure semantics and documentation in C++ execution/dataset paths
- [#31653](https://github.com/apache/arrow/issues/31653) — deadlock edge case
- [#31657](https://github.com/apache/arrow/issues/31657) — document backpressure for C++ streaming exec plan
- [#31654](https://github.com/apache/arrow/issues/31654) — add backpressure to aggregate node
- [#31652](https://github.com/apache/arrow/issues/31652) — OneShotFragment ignoring batch readahead & batch size

These form a coherent theme: Arrow’s execution and dataset pipelines still have unresolved ergonomic and correctness work around backpressure, memory control, and operator behavior. This is highly relevant to analytical engine users operating at scale.

#### Filesystem/path consistency and extension-type roundtripping remain parity gaps
- [#31664](https://github.com/apache/arrow/issues/31664) — uniform directory path handling
- [#31663](https://github.com/apache/arrow/issues/31663) — R/Python `ChunkedArray` + `ExtensionType` roundtrip drops type

These are less headline-grabbing but matter for cross-language data fidelity and filesystem abstraction consistency.

#### SQL/function coverage remains a recurring ask
- Closed backlog items included:
  - [#31118](https://github.com/apache/arrow/issues/31118) — `TRUNC`
  - [#31102](https://github.com/apache/arrow/issues/31102) — `FIND_IN_SET`

Even with closures, the recurring pattern is clear: users still look to Arrow components such as Gandiva for broader SQL-style scalar function compatibility.

## 7. User Feedback Summary

### Main user pain points visible today

- **Cross-platform connector parity matters.**  
  Linux ODBC support and Azure Blob support in R both show users want Arrow capabilities to be consistent across operating systems and language bindings.
  - [#49463](https://github.com/apache/arrow/issues/49463)
  - [#49553](https://github.com/apache/arrow/pull/49553)

- **CI and packaging problems are disruptive.**  
  Users and contributors depend heavily on working packaging jobs and binding-specific CI. Build failures in aws-lc and blocked MATLAB actions show infrastructure issues can quickly become project bottlenecks.
  - [#49601](https://github.com/apache/arrow/issues/49601)
  - [#49611](https://github.com/apache/arrow/issues/49611)

- **Performance expectations for PyArrow-backed pandas remain high.**  
  The `string_storage="pyarrow"` complaint suggests users expect Arrow-backed types to be competitive even in less-than-ideal pandas mutation patterns, not only in bulk vectorized paths.
  - [#49612](https://github.com/apache/arrow/issues/49612)

- **Users want safer failure behavior, not silent degradation.**  
  The base64 decoding report is notable because it is about silent truncation rather than explicit failure, which undermines trust in correctness.
  - [#49614](https://github.com/apache/arrow/issues/49614)

- **Documentation gaps still hurt advanced C++ users.**  
  Multiple stale-but-active issues around backpressure and zstd build behavior indicate that sophisticated users are still discovering non-obvious operational behavior the hard way.
  - [#31657](https://github.com/apache/arrow/issues/31657)
  - [#31659](https://github.com/apache/arrow/issues/31659)

## 8. Backlog Watch

These older open items look important enough to warrant maintainer attention:

### High-priority technical backlog

#### [#31653](https://github.com/apache/arrow/issues/31653) — potential deadlock in dataset writer under backpressure/I/O error
A correctness and liveness problem in write execution is more urgent than its age suggests.

#### [#31654](https://github.com/apache/arrow/issues/31654) — add backpressure to aggregate node
Important for future spill-support and memory-aware execution planning.

#### [#31657](https://github.com/apache/arrow/issues/31657) — document backpressure for C++ streaming exec plan
Low implementation cost, potentially high user benefit.

#### [#31652](https://github.com/apache/arrow/issues/31652) — OneShotFragment ignores batch readahead and batch size
Tagged as `good-first-issue` / `good-second-issue`, making it a good candidate for contributor onboarding while addressing scanner behavior consistency.

### Cross-language/data-model backlog

#### [#31663](https://github.com/apache/arrow/issues/31663) — R/Python ExtensionType roundtrip drops type
This affects schema fidelity and could surprise users relying on extension types across language boundaries.

#### [#31664](https://github.com/apache/arrow/issues/31664) — inconsistent directory path formatting
A smaller issue, but one that can cause subtle downstream logic bugs in filesystem consumers.

### PRs needing sustained review

#### [#48964](https://github.com/apache/arrow/pull/48964) — bundled dependency stack upgrade with public API breakage
This likely needs careful maintainer bandwidth because it touches core RPC/cloud dependencies and explicitly mentions breaking APIs.

#### [#49553](https://github.com/apache/arrow/pull/49553) — R Azure Blob filesystem exposure
Good feature value and ecosystem impact; review attention here would help close a visible language-parity gap.

#### [#45754](https://github.com/apache/arrow/pull/45754) — Python pre-commit/ruff for developer tooling
Long-lived and marked stale-warning; worth deciding explicitly whether the project wants this tooling direction rather than letting it linger.

---

## Bottom line

Arrow’s current pulse is healthy but operationally focused: packaging fixes landed fast, Linux SQL connectivity improved, and cloud/language parity work is active. The biggest immediate risks are not releases or major regressions, but CI fragility and a few correctness-sensitive open bugs such as silent base64 truncation and backpressure-related deadlock potential. The clearest near-term roadmap candidates are **R Azure Blob support** and **broader Linux Flight SQL ODBC readiness**, both of which improve Arrow’s usefulness in real analytical deployment environments.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*