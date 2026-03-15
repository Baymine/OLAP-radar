# Apache Doris Ecosystem Digest 2026-03-15

> Issues: 1 | PRs: 52 | Projects covered: 10 | Generated: 2026-03-15 01:28 UTC

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

# Apache Doris Project Digest — 2026-03-15

## 1) Today's Overview

Apache Doris showed **high pull-request activity** over the last 24 hours, with **52 PRs updated** and **19 merged/closed**, while issue traffic was very light with just **1 issue updated** and no active open issues in the daily slice. The day’s work was concentrated less on releases and more on **feature landing, branch backports, cloud/external catalog integrations, and operational hardening**. Current development signals point to strong investment in **lakehouse interoperability** (Iceberg, Paimon, MaxCompute, Hive), **cloud-native access/security**, and **query/runtime memory behavior**. Overall, project health looks **active and execution-focused**, though there are also signs of a growing review backlog in several substantial open feature PRs.

## 3) Project Progress

### Merged/closed PRs today

The merged/closed set suggests progress in three main areas: **resource efficiency**, **observability**, and **branch stabilization**.

#### Resource and load-path optimization
- [#61327](https://github.com/apache/doris/pull/61327) — **[fix](load) fix load memory usage is more than branch-3.1**
  - Closed with branch merge labels for 4.0.5 and 4.1.0.
  - This is a meaningful stability/performance fix: memory regressions in load paths can directly affect ingestion reliability, cluster sizing, and OOM risk.
  - Signal: maintainers are actively aligning newer branches with prior memory behavior expectations.

#### Runtime observability
- [#60343](https://github.com/apache/doris/pull/60343) — **[opt](jvm) enable BE jvm monitor by default**
- [#61337](https://github.com/apache/doris/pull/61337) — **branch-4.1 cherry-pick of JVM monitor default enablement**
  - Enabling BE JVM monitoring by default improves operational visibility, especially in mixed Java/native deployments.
  - This is a practical improvement for diagnosing memory pressure, GC behavior, and service health in production.

#### Stale closures and maintenance cleanup
- [#55074](https://github.com/apache/doris/pull/55074) — **[Enhancement](function) Support regexp_position function** — closed as stale
- [#55660](https://github.com/apache/doris/pull/55660) — **branch-3.0 Hudi partition-column query fix cherry-pick** — closed as stale
- [#61335](https://github.com/apache/doris/pull/61335) — **test gdwarf for compile** — closed
  - These closures reduce noise but also show some feature and compatibility ideas are not progressing unless refreshed by contributors.

### Notable in-flight development

A large portion of open PRs indicates where Doris is actively advancing:

#### Lakehouse and external table ecosystem
- [#60482](https://github.com/apache/doris/pull/60482) — Iceberg **update/delete/merge into**
- [#61338](https://github.com/apache/doris/pull/61338) — Paimon **create/drop database and table**
- [#61339](https://github.com/apache/doris/pull/61339) — MaxCompute **create/drop table**
- [#61341](https://github.com/apache/doris/pull/61341) — JindoFS upgrade and **Aliyun DLF Iceberg REST catalog**
- [#61330](https://github.com/apache/doris/pull/61330) — Hive DATE correctness fix
- [#60897](https://github.com/apache/doris/pull/60897) — condition cache for external tables

These PRs collectively reinforce Doris’s trajectory as a **query engine over heterogeneous data ecosystems**, not just an internal OLAP store.

#### Cloud-native ingestion and security
- [#61325](https://github.com/apache/doris/pull/61325) — Routine Load support for **Amazon Kinesis**
- [#61324](https://github.com/apache/doris/pull/61324) — Routine Load **AWS MSK IAM auth**
- [#61329](https://github.com/apache/doris/pull/61329) — Alibaba Cloud OSS native storage vault with **STS AssumeRole**
- [#60921](https://github.com/apache/doris/pull/60921) — FE-to-FE **HTTPS** communication

These are strong signals that Doris is prioritizing deployment in **public cloud and regulated environments**, where IAM-based auth and transport hardening are table stakes.

#### Query engine/runtime improvements
- [#61212](https://github.com/apache/doris/pull/61212) — **multi-level partition spilling**
- [#61332](https://github.com/apache/doris/pull/61332) — memory-efficient concurrent primitive maps
- [#59847](https://github.com/apache/doris/pull/59847) — **BM25 scoring** in inverted index query_v2
- [#61281](https://github.com/apache/doris/pull/61281) — variant **doc mode** for branch-4.1
- [#61331](https://github.com/apache/doris/pull/61331) — variant column space accounting fix

This set points to continued work on **memory-sensitive execution**, **semi-structured data**, and **search/IR-style query capability**.

## 4) Community Hot Topics

Because comment counts/reactions are mostly unavailable in the provided data, the “hot topics” are inferred from **scope, recency, and architectural significance**.

### 1. Iceberg write-path maturity
- [#60482](https://github.com/apache/doris/pull/60482) — **Implements Iceberg update/delete/merge into functionality**
- [#61341](https://github.com/apache/doris/pull/61341) — **Aliyun DLF Iceberg REST catalog support**

**Why it matters:** Users increasingly expect Doris to do more than read lakehouse tables; they want **write semantics and transactional interoperability**. Support for update/delete/merge into is a major step from analytical federation toward operational lakehouse integration.

### 2. External catalog DDL support
- [#61338](https://github.com/apache/doris/pull/61338) — Paimon create/drop db/table
- [#61339](https://github.com/apache/doris/pull/61339) — MaxCompute create/drop table

**Underlying need:** Enterprises want Doris to act as a **unified control plane and SQL front end** across external systems, not merely as a read-only query layer.

### 3. Cloud security and managed-stream ingestion
- [#61324](https://github.com/apache/doris/pull/61324) — MSK IAM auth
- [#61325](https://github.com/apache/doris/pull/61325) — Amazon Kinesis routine load
- [#61329](https://github.com/apache/doris/pull/61329) — OSS vault support with STS AssumeRole
- [#60921](https://github.com/apache/doris/pull/60921) — FE-to-FE HTTPS

**Underlying need:** Production users want **native cloud identity integration**, fewer static secrets, and support for managed ingestion pipelines.

### 4. Query/runtime memory resilience
- [#61212](https://github.com/apache/doris/pull/61212) — multi-level partition spilling
- [#61327](https://github.com/apache/doris/pull/61327) — load memory usage fix
- [#61332](https://github.com/apache/doris/pull/61332) — low-overhead concurrent maps

**Underlying need:** Doris is being pushed into larger, more memory-variable workloads. These PRs target both execution-time and FE metadata-path memory efficiency.

### 5. SQL/function compatibility expansion
- [#60892](https://github.com/apache/doris/pull/60892) — `SPLIT_BY_STRING` with `limit`
- [#60412](https://github.com/apache/doris/pull/60412) — `levenshtein`, `hamming_distance`
- [#60833](https://github.com/apache/doris/pull/60833) — `entropy`
- [#55074](https://github.com/apache/doris/pull/55074) — `regexp_position` proposal, now stale

**Underlying need:** Users continue asking for **cross-engine SQL/function portability**, especially from Hive, Trino/Presto, and general analytical SQL ecosystems.

## 5) Bugs & Stability

### Severity-ranked issues and fixes

#### High severity
1. **Hive external DATE decoding timezone correctness**
   - [#61330](https://github.com/apache/doris/pull/61330) — **Fix Hive DATE timezone shift in external readers**
   - Impact: query correctness bug. DATE values shifting by one day in western time zones can corrupt BI results, filters, and data reconciliation.
   - Fix status: **Open PR exists**.
   - Assessment: among today’s most important correctness fixes because it affects user-visible results rather than just performance.

2. **Load memory usage regression**
   - [#61327](https://github.com/apache/doris/pull/61327) — **fix load memory usage is more than branch-3.1**
   - Impact: ingestion stability and cluster memory efficiency.
   - Fix status: **Closed/merged**, including downstream branch labels.
   - Assessment: good sign that a regression was identified and backported quickly.

#### Medium severity
3. **Variant column space accounting shows zero**
   - [#61331](https://github.com/apache/doris/pull/61331) — **Fix variant column space usage showing as 0**
   - Impact: observability/metadata correctness; may mislead storage accounting and capacity planning.
   - Fix status: **Open**.

4. **FilteredRules optimizer bug**
   - [#55718](https://github.com/apache/doris/issues/55718) — **FilteredRules::filterValidRules will not filter any rule** — closed stale
   - Link: https://github.com/apache/doris/issues/55718
   - Impact: potentially optimizer-rule selection correctness/performance if still reproducible.
   - Fix status: no linked fix in today’s slice.
   - Assessment: although closed as stale, anything in rule filtering deserves attention because it may influence planning behavior.

#### Lower severity / test and infra stability
5. **CI and review-flow robustness**
   - [#61334](https://github.com/apache/doris/pull/61334) — OpenCode review failure handling
   - [#61336](https://github.com/apache/doris/pull/61336) — switch DWARF version to 4 for profiling compatibility
   - Impact: developer productivity and tooling reliability rather than end-user query behavior.

## 6) Feature Requests & Roadmap Signals

### Strong roadmap signals

#### Lakehouse write support is becoming a priority
- [#60482](https://github.com/apache/doris/pull/60482) — Iceberg update/delete/merge into
- Prediction: likely candidate for an upcoming minor release if review/testing completes, because it materially expands Doris’s role in lakehouse workflows.

#### Doris as a unified external catalog control plane
- [#61338](https://github.com/apache/doris/pull/61338) — Paimon DDL
- [#61339](https://github.com/apache/doris/pull/61339) — MaxCompute DDL
- Prediction: these DDL capabilities fit a broader roadmap toward **bidirectional external catalog management**.

#### More cloud-native connectors and auth
- [#61325](https://github.com/apache/doris/pull/61325) — Kinesis
- [#61324](https://github.com/apache/doris/pull/61324) — AWS IAM auth for Routine Load
- [#61329](https://github.com/apache/doris/pull/61329) — Alibaba OSS STS
- Prediction: expect more **managed streaming/storage integrations** and **role-based auth support** across cloud vendors.

#### Continued expansion of SQL and analytics functions
- [#60833](https://github.com/apache/doris/pull/60833) — `entropy`
- [#60892](https://github.com/apache/doris/pull/60892) — `SPLIT_BY_STRING(..., limit)`
- [#60412](https://github.com/apache/doris/pull/60412) — `levenshtein`, `hamming_distance`
- [#59847](https://github.com/apache/doris/pull/59847) — BM25 scoring
- Prediction: next versions are likely to keep adding **data science/statistical**, **string similarity**, and **search-related** functions to improve SQL competitiveness.

#### Export and data movement
- [#61340](https://github.com/apache/doris/pull/61340) — **INSERT INTO TVF** to export query results to local/HDFS/S3
- Prediction: this could become an important usability feature for pipeline output and ad hoc export workflows.

## 7) User Feedback Summary

Today’s PR mix reveals several practical user pain points:

- **Correctness over federation matters.**
  - The Hive DATE bug in [#61330](https://github.com/apache/doris/pull/61330) shows users are sensitive to semantic mismatches between Doris and external engines like Spark/Hive, especially for date/time types.

- **Memory efficiency remains a real production concern.**
  - [#61327](https://github.com/apache/doris/pull/61327), [#61212](https://github.com/apache/doris/pull/61212), and [#61332](https://github.com/apache/doris/pull/61332) suggest users are hitting resource pressure in both ingestion and query/metadata paths.

- **Cloud users want first-class managed service support.**
  - Requests around Kinesis, MSK IAM, OSS STS, and HTTPS imply Doris is increasingly used in environments where **secretless auth, cross-account access, and secure defaults** are mandatory.

- **SQL portability remains a buying criterion.**
  - Function additions such as `levenshtein`, `hamming_distance`, `entropy`, and split-limit semantics indicate users compare Doris against Hive/Trino/Presto/Spark and expect fewer migration gaps.

- **Semi-structured and search-like workloads are rising.**
  - Work on variant doc mode and BM25 indicates Doris users are pushing beyond classic star-schema OLAP into **document-style analytics and relevance scoring**.

## 8) Backlog Watch

These items appear important and would benefit from maintainer attention due to scope, age, or strategic value.

### High-value open PRs
- [#60482](https://github.com/apache/doris/pull/60482) — **Iceberg update/delete/merge into**
  - Large strategic feature, open since 2026-02-04.
  - Needs sustained review because it affects correctness, transaction semantics, and external table interoperability.

- [#59847](https://github.com/apache/doris/pull/59847) — **BM25 scoring in inverted index query_v2**
  - Open since 2026-01-13.
  - Important for search-style analytics and could broaden Doris’s query use cases.

- [#60412](https://github.com/apache/doris/pull/60412) — **levenshtein and hamming_distance**
  - Open since 2026-02-01.
  - Lower architectural risk than storage changes, but useful for compatibility and analytics workloads.

- [#60897](https://github.com/apache/doris/pull/60897) — **condition cache for external table**
  - Could materially improve external table performance, but may need careful validation around cache correctness and invalidation.

- [#61212](https://github.com/apache/doris/pull/61212) — **multi-level partition spilling**
  - High-impact engine work; deserves close review because spill logic often has complex correctness/performance trade-offs.

### Stale or closed-but-possibly-relevant items
- [#55718](https://github.com/apache/doris/issues/55718) — optimizer rule filtering issue, closed stale
  - If reproducible on current master, it may deserve reopening with a minimized testcase.
- [#55074](https://github.com/apache/doris/pull/55074) — `regexp_position`
  - A sign that some SQL-compatibility requests are not getting enough maintainer bandwidth.
- [#55660](https://github.com/apache/doris/pull/55660) — Hudi partition-only query fix cherry-pick, stale
  - Hudi query correctness remains an area worth watching despite this stale closure.

---

## Linked Items Index

### Issues
- [#55718](https://github.com/apache/doris/issues/55718) — FilteredRules::filterValidRules will not filter any rule

### PRs
- [#61340](https://github.com/apache/doris/pull/61340) — INSERT INTO TVF export to local/HDFS/S3
- [#60482](https://github.com/apache/doris/pull/60482) — Iceberg update/delete/merge into
- [#61327](https://github.com/apache/doris/pull/61327) — load memory usage fix
- [#61338](https://github.com/apache/doris/pull/61338) — Paimon create/drop db/table
- [#61341](https://github.com/apache/doris/pull/61341) — JindoFS update + Aliyun DLF Iceberg REST catalog
- [#61339](https://github.com/apache/doris/pull/61339) — MaxCompute create/drop table
- [#61325](https://github.com/apache/doris/pull/61325) — Routine Load support for Amazon Kinesis
- [#55074](https://github.com/apache/doris/pull/55074) — regexp_position
- [#55660](https://github.com/apache/doris/pull/55660) — Hudi partition-column query fix
- [#60833](https://github.com/apache/doris/pull/60833) — aggregate function entropy
- [#61239](https://github.com/apache/doris/pull/61239) — information_schema.partitions latency improvement
- [#60892](https://github.com/apache/doris/pull/60892) — SPLIT_BY_STRING limit support
- [#60412](https://github.com/apache/doris/pull/60412) — levenshtein and hamming_distance
- [#61324](https://github.com/apache/doris/pull/61324) — Routine Load IAM auth
- [#59847](https://github.com/apache/doris/pull/59847) — BM25 scoring
- [#61332](https://github.com/apache/doris/pull/61332) — concurrent primitive hash maps
- [#60897](https://github.com/apache/doris/pull/60897) — condition cache for external table
- [#61329](https://github.com/apache/doris/pull/61329) — Alibaba OSS native storage vault STS support
- [#60343](https://github.com/apache/doris/pull/60343) — enable BE JVM monitor by default
- [#61337](https://github.com/apache/doris/pull/61337) — branch-4.1 JVM monitor cherry-pick
- [#60921](https://github.com/apache/doris/pull/60921) — FE-to-FE HTTPS
- [#61334](https://github.com/apache/doris/pull/61334) — CI review failure handling
- [#61333](https://github.com/apache/doris/pull/61333) — deterministic array_union tests
- [#61336](https://github.com/apache/doris/pull/61336) — DWARF v4 profiling compatibility
- [#61335](https://github.com/apache/doris/pull/61335) — test gdwarf for compile
- [#61330](https://github.com/apache/doris/pull/61330) — Hive DATE timezone shift fix
- [#61212](https://github.com/apache/doris/pull/61212) — multi-level partition spilling
- [#61281](https://github.com/apache/doris/pull/61281) — variant doc mode
- [#61331](https://github.com/apache/doris/pull/61331) — variant space usage fix

If you want, I can also convert this into a **short executive summary**, **weekly trend format**, or **release-manager oriented digest**.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-15

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, but the center of gravity is shifting from “fast SQL on internal tables” toward **lakehouse interoperability, cloud-native security, and operational robustness**. Across engines, the most consistent themes are **external table/catalog integration**, **memory and runtime correctness**, **object-storage efficiency**, and **SQL/function compatibility**. Apache Doris, ClickHouse, and DuckDB show the strongest day-to-day execution velocity in this snapshot, while Iceberg and Arrow continue to function as key ecosystem infrastructure layers rather than end-user OLAP databases. Overall, the landscape looks healthy: innovation is broad, but so is pressure to harden edge cases as these systems move deeper into production-critical workloads.

---

## 2. Activity Comparison

### Daily activity snapshot

| Engine | Issues Updated | PRs Updated | Release Today | Health Score* | Notes |
|---|---:|---:|---|---:|---|
| **ClickHouse** | 18 | 126 | No | **9.2/10** | Highest raw activity; strong review/triage throughput; some security and crash concerns |
| **Apache Doris** | 1 | 52 | No | **8.9/10** | Very strong execution focus; active backports; strategic feature work in lakehouse/cloud/runtime |
| **Apache Iceberg** | 5 | 22 | No | **8.5/10** | Healthy connector/spec work; patch-focused; several long-running PRs |
| **DuckDB** | 11 | 15 | No | **8.4/10** | Responsive and efficient; currently dealing with 1.5.x regressions in S3/Parquet paths |
| **Apache Arrow** | 18 | 7 | No | **8.0/10** | Stable infrastructure project; backlog/stale churn reduces visible net progress |
| **Velox** | 0 | 27 | No | **8.3/10** | Strong PR-driven momentum; no issue signal today; important engine internals advancing |
| **StarRocks** | 2 | 12 | No | **8.2/10** | Solid branch maintenance and quick bug-response; lower overall activity than Doris/ClickHouse |
| **Databend** | 0 | 7 | No | **7.9/10** | Stable and focused; less visible community traffic, but good planner/runtime work |
| **Apache Gluten** | 3 | 8 | No | **7.7/10** | Active, but dependency-heavy on Spark/Velox; more integration/stability than feature velocity |
| **Delta Lake** | 2 | 3 | No | **7.5/10** | Quiet but steady; correctness-focused; low-volume snapshot |

\*Health score is a qualitative synthesis of activity, responsiveness, breadth of work, and visible risk signals from the digest, not a maintainer-provided metric.

### Activity tiers
- **Tier 1: High-velocity** — ClickHouse, Apache Doris
- **Tier 2: Active / broadly healthy** — Iceberg, DuckDB, Velox, StarRocks
- **Tier 3: Stable / focused / lower-volume** — Arrow, Databend, Gluten, Delta Lake

---

## 3. Apache Doris's Position

### Where Doris stands out
Apache Doris is currently positioned as one of the most **execution-focused** projects in the field, with a development profile that balances **engine internals, external ecosystem integration, and enterprise/cloud operability**. Relative to peers, Doris shows particularly strong momentum in:
- **Lakehouse interoperability**: Iceberg write-paths (`update/delete/merge into`), Paimon DDL, MaxCompute DDL, Hive correctness, external condition cache
- **Cloud-native ingestion/security**: Amazon Kinesis, AWS MSK IAM auth, Alibaba OSS STS AssumeRole, FE-to-FE HTTPS
- **Memory/runtime hardening**: load memory regression fixes, multi-level partition spilling, low-overhead concurrent maps
- **Semi-structured/search-style expansion**: variant doc mode, BM25 scoring

### Advantages vs peers
**Versus ClickHouse**
- Doris appears more visibly focused right now on becoming a **unified control/query plane across external catalogs and cloud services**
- ClickHouse remains stronger in raw breadth of activity and deep execution/storage specialization, but Doris looks more aligned with **federated enterprise lakehouse workflows**

**Versus DuckDB**
- Doris is far more oriented toward **distributed production deployment**, cloud auth, managed streaming ingestion, and operational observability
- DuckDB is stronger in embedded/local analytics and developer-centric workflows, but Doris is better positioned for **multi-node platform use**

**Versus StarRocks**
- Doris and StarRocks overlap heavily, but Doris shows **broader daily feature breadth** today, especially in external catalog management and cloud-native auth/integration
- StarRocks looks slightly more patch-oriented and branch-stabilization-focused in this slice

**Versus Iceberg / Delta / Arrow**
- Doris is an **end-user analytical engine**, not just a table format or data layer
- Its advantage is delivering SQL execution plus increasing write/catalog control over those external systems

### Technical approach differences
Doris increasingly looks like a **hybrid MPP OLAP + lakehouse query/control plane**:
- not only serving internal OLAP tables,
- but also adding DDL, write semantics, caching, correctness fixes, and cloud auth around external systems.

This is distinct from:
- **ClickHouse**: highly specialized analytical DB with strong internal engine depth and growing lake integration
- **DuckDB**: in-process analytics engine with expanding remote/lake support
- **Iceberg/Delta**: table format/metadata ecosystems
- **Velox/Arrow**: execution/runtime and interoperability infrastructure layers

### Community size comparison
On raw visible activity, Doris is currently below ClickHouse but above most of the rest of this comparison set. Its 52 updated PRs and 19 merged/closed items signal a **large and productive contributor base**, especially when combined with active backports across branches. It does not match ClickHouse’s sheer PR volume, but it is clearly in the top tier of active analytical engine communities.

---

## 4. Shared Technical Focus Areas

### 1) Lakehouse and external catalog interoperability
**Engines:** Apache Doris, ClickHouse, StarRocks, Iceberg, Delta Lake, Velox, Arrow  
**Specific needs emerging:**
- external table correctness and pruning
- write-path maturity for open table formats
- metadata/statistics fidelity
- schema evolution handling
- catalog API expansion

**Examples**
- Doris: Iceberg `update/delete/merge`, Paimon/MaxCompute DDL, Hive DATE correctness
- ClickHouse: Iceberg security hardening, S3/object metadata scalability
- StarRocks: Paimon stats correctness, Iceberg/HDFS variant pruning, Parquet UUID compatibility
- Iceberg: migration correctness, REST/OpenAPI expansion, maintenance procedure fixes
- Delta: catalog/session integration, Kernel semantic consistency
- Velox/Arrow: Iceberg stats collection, Parquet evolution/encryption support

### 2) Cloud-native security and secretless access
**Engines:** Apache Doris, ClickHouse, StarRocks, Iceberg, Delta Lake, Gluten indirectly  
**Specific needs emerging:**
- IAM/role-based auth instead of static credentials
- secure inter-node communication
- path validation and metadata trust boundaries
- enterprise governance integration

**Examples**
- Doris: AWS IAM for Routine Load, Kinesis, OSS STS, FE-to-FE HTTPS
- ClickHouse: interserver auth ordering concern, datalake security vulnerability fixes, Keeper TLS hot reload
- StarRocks: Ranger superuser behavior hardening
- Delta: cross-catalog compatibility work implies enterprise deployment complexity

### 3) Object storage and remote scan efficiency
**Engines:** ClickHouse, DuckDB, Doris, StarRocks, Arrow, Velox  
**Specific needs emerging:**
- reduce file listing overhead
- prune earlier before file discovery
- coalesce reads/prefetch smarter
- handle large object-store tables predictably

**Examples**
- ClickHouse: S3 listing parallelization remains strategic
- DuckDB: 1.5.0 regressions around S3 requests and partition pruning
- Doris: external condition caching and Hive correctness
- Velox: preload and reader efficiency
- Arrow: HTTPS/remote filesystem demand persists

### 4) Runtime memory resilience and operational observability
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Databend, Velox  
**Specific needs emerging:**
- memory regression prevention
- spill improvements
- correct metrics/accounting
- production-friendly monitoring defaults

**Examples**
- Doris: load memory regression fix, multi-level partition spilling, JVM monitor default-on
- ClickHouse: MergeTree and analyzer crash/memory concerns
- DuckDB: OOM on partitioned copy to S3, checkpoint/WAL fixes
- StarRocks: negative memory accounting fix
- Databend: large IN-list stack overflow risk
- Velox: remote execution correctness and error semantics

### 5) SQL compatibility and advanced analytic semantics
**Engines:** Doris, ClickHouse, DuckDB, Databend, Velox, Gluten, Arrow  
**Specific needs emerging:**
- function parity with Hive/Presto/Spark/Trino
- safer planner behavior under edge-case SQL
- compatibility for timestamps, decimals, variant/json, recursive SQL

**Examples**
- Doris: string similarity, entropy, split semantics, BM25
- ClickHouse: temporary DBs, richer SQL semantics, analyzer correctness
- DuckDB: pushdown across casts/time semantics, VARIANT stability
- Databend: correlated subquery correctness, recursive CTE execution
- Velox/Gluten: Presto/Spark type/function parity, TIMESTAMP_NTZ, decimal behavior
- Arrow: timestamp parsing usability, Gandiva SQL-style requests

---

## 5. Differentiation Analysis

## Storage format orientation
- **Apache Doris / ClickHouse / StarRocks / DuckDB / Databend**: analytical databases/query engines with their own execution/storage approaches, but increasingly interoperable with lake formats
- **Iceberg / Delta Lake**: table format and metadata transaction layers, not primary query engines
- **Arrow / Velox**: infrastructure layers enabling in-memory interchange, vectorized execution, file-format access, and downstream engine construction
- **Gluten**: acceleration layer bridging Spark with native backends like Velox/ClickHouse

## Query engine design differences
- **Doris / StarRocks**: MPP SQL engines optimized for high-concurrency analytics, now extending deeply into lakehouse federation and external control-plane roles
- **ClickHouse**: highly specialized columnar analytical database with strong internal engine innovation and growing external format support
- **DuckDB**: embedded/in-process OLAP engine optimized for local, notebook, application, and lightweight cloud analytics
- **Databend**: cloud-oriented analytical engine with strong focus on planner modernization and versioned data semantics
- **Velox**: vectorized execution engine used as a backend component, not a complete DBMS itself
- **Gluten**: execution acceleration for Spark, dependent on Spark semantics and backend maturity

## Target workloads
- **Doris / StarRocks**: enterprise BI, real-time analytics, lakehouse federation, hybrid ingestion + serving
- **ClickHouse**: very large-scale analytical serving, observability, event analytics, mutable-ish analytical workloads
- **DuckDB**: local analytics, data science, ETL, embedded analytics, lightweight lake queries
- **Iceberg / Delta**: storage governance, interoperability, transaction semantics over data lakes
- **Arrow / Velox**: engine builders, connectors, runtimes, high-performance data processing infrastructure
- **Databend**: cloud-native analytics and evolving versioned/lake-style workflows

## SQL compatibility posture
- **Doris**: actively expanding compatibility and analytical function breadth
- **ClickHouse**: broad SQL surface, but still heavily shaped by its own semantics and engine model
- **DuckDB**: very strong SQL ergonomics, especially for local analytics, but current focus is on preserving efficiency under remote/lake scenarios
- **Databend**: emphasizing planner correctness on advanced SQL constructs
- **Gluten/Velox**: compatibility is mediated by upstream engines like Spark/Presto
- **Iceberg/Delta/Arrow**: compatibility matters more at metadata/API/type semantics than full SQL engine level

---

## 6. Community Momentum & Maturity

### Rapidly iterating
- **ClickHouse**: highest development throughput; active across engine, security, metadata, Keeper, planner, and storage
- **Apache Doris**: strong feature landing plus backports; especially active in lakehouse/cloud/runtime areas
- **DuckDB**: fast response cycle; current iteration driven by regressions and optimizer/storage refinements
- **Velox**: fast-moving engine infrastructure work, especially around RPC, GPU, and interoperability

### Actively maturing / broad but patch-focused
- **Apache Iceberg**: healthy and central to the ecosystem, but current signal is more connector/spec hardening than headline feature shipping
- **StarRocks**: stable branch discipline, fast bug-response, lower visible breadth than Doris today
- **Databend**: technically focused maturation, especially planner/runtime internals

### Stabilizing / lower-volume but important
- **Delta Lake**: quieter snapshot, centered on semantic correctness and catalog compatibility
- **Apache Arrow**: mature foundational project; more maintenance and backlog management than rapid visible product-style iteration
- **Apache Gluten**: active, but momentum depends significantly on upstream Spark and Velox dynamics

### Maturity observation
The most mature projects in operational breadth are **ClickHouse, Doris, Iceberg, Arrow**, with Doris and ClickHouse looking strongest among direct OLAP engines in daily execution energy. DuckDB is mature in a different sense: highly credible technically, but centered on a different deployment model.

---

## 7. Trend Signals

### 1) The market is moving from “warehouse engine” to “lakehouse execution + control plane”
Data engineers increasingly want engines that can:
- query open table formats,
- manage external catalogs,
- perform DDL or mutations across systems,
- and preserve correctness across heterogeneous data stacks.

**Most visible in:** Doris, StarRocks, ClickHouse, Iceberg

**Why it matters:**  
Architects should now evaluate engines not only on internal table performance, but on how well they act as a **front door to mixed-format data estates**.

### 2) Cloud identity and secure-by-default integration are no longer optional
IAM auth, role assumption, TLS, secure inter-node communication, and metadata trust validation are becoming standard selection criteria.

**Most visible in:** Doris, ClickHouse, StarRocks

**Value to architects:**  
This reduces operational risk and secret sprawl in managed-cloud deployments.

### 3) Object-storage efficiency is now a first-class engine capability
The cost of poor pruning, excessive file discovery, or too many GET/LIST operations is increasingly visible to users.

**Most visible in:** DuckDB, ClickHouse, Doris, Arrow ecosystem

**Value to data engineers:**  
Engine efficiency on S3/GCS/OSS can materially affect both **query latency and cloud bill**.

### 4) Correctness under complex semantics is a major competitive axis
Users are pushing systems into:
- timestamp/timezone edge cases,
- correlated subqueries,
- recursive SQL,
- mutable lakehouse maintenance,
- variant/json/document workloads,
- and search-style analytics.

**Most visible in:** Doris, DuckDB, Databend, Iceberg, Velox/Gluten

**Value to decision-makers:**  
Performance remains important, but **wrong answers and semantic mismatches are becoming the harder blocker** in production adoption.

### 5) Semi-structured and search-adjacent analytics are expanding
Variant/document support, nested pruning, BM25, full-text behavior, and JSON/VARIANT correctness are appearing across multiple projects.

**Most visible in:** Doris, StarRocks, ClickHouse, DuckDB, Iceberg ecosystem indirectly

**Value:**  
This suggests converging demand for engines that can handle **structured BI plus document-style analytics** without separate serving stacks.

---

## Bottom Line

- **Apache Doris** is currently one of the strongest-positioned engines for teams that want a **distributed analytical database plus growing lakehouse control-plane capabilities**, especially in cloud-centric environments.
- **ClickHouse** remains the highest-velocity peer and strongest benchmark for deep engine innovation and production scale.
- **DuckDB** leads a different but highly relevant category: embedded analytics with rapidly improving lake/object-store support.
- **Iceberg, Delta, Arrow, Velox** remain critical infrastructure layers shaping what the engine ecosystem can do.
- The clearest industry direction is toward **secure, interoperable, cloud-native analytical systems that treat open data formats as first-class citizens**.

If you want, I can also turn this into:
1. a **Doris-focused competitive brief**,  
2. a **CTO/executive one-pager**, or  
3. a **scorecard matrix for engine selection**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-15

## 1. Today's Overview

ClickHouse remained highly active over the last 24 hours, with **18 issues updated** and **126 pull requests updated**, indicating strong ongoing development velocity and active triage. There were **no new releases**, so today’s signal comes primarily from issue traffic and PR review activity rather than shipped artifacts. The dominant themes were **stability and correctness in MergeTree/Keeper/analyzer paths**, alongside continued work on **performance optimizations**, **security hardening for data lake integrations**, and **feature work in SQL semantics and metadata management**. Overall project health looks **busy but stable**, with maintainers actively handling both user-facing bugs and forward-looking engine improvements.

## 2. Project Progress

With **23 PRs merged/closed** in the last 24h, the visible progress today appears concentrated on bug closure and incremental engine refinement rather than a major release milestone.

Notable closed/advanced items include:

- **Dashboard UX fix completed**: issue [#85225](https://github.com/ClickHouse/ClickHouse/issues/85225) was closed, addressing a usability gap where chart titles disappeared when a query returned an empty result. This is minor technically, but it improves BI/dashboard polish.
- **Iceberg snapshot expiration accounting bug closed**: issue [#99340](https://github.com/ClickHouse/ClickHouse/issues/99340) was closed after reporting that `expire_snapshots` over-counted shared manifest/data files. This matters for lakehouse correctness and operational trust in retention/cleanup tooling.
- **LowCardinality nullable cast issue closed**: issue [#95670](https://github.com/ClickHouse/ClickHouse/issues/95670) was closed, resolving a cast behavior inconsistency for `LowCardinality(Nullable(String))`, which strengthens SQL/type-system compatibility.
- A performance-oriented PR, **“Optimize simple regex alternations for primary key index”** [#99511](https://github.com/ClickHouse/ClickHouse/pull/99511), was closed. Even without merge confirmation in the provided data, the topic reflects ongoing work to make predicate analysis more index-aware.

Open PRs also show where current engineering effort is going:
- **Temporary databases** via [#92610](https://github.com/ClickHouse/ClickHouse/pull/92610) signal continued investment in session- or lifecycle-scoped metadata features.
- **Direct-index hash table for joins with small integer key ranges** via [#99275](https://github.com/ClickHouse/ClickHouse/pull/99275) points to query engine specialization for lower-latency joins.
- **Distributed `IN` filter propagation fix** via [#99436](https://github.com/ClickHouse/ClickHouse/pull/99436) improves planner correctness and shard pruning behavior.
- **Dictionary invalidation reduction** via [#99285](https://github.com/ClickHouse/ClickHouse/pull/99285) targets storage/scan efficiency for LowCardinality-heavy workloads.

## 3. Community Hot Topics

### 1) S3 metadata/listing performance remains a strategic concern
- Issue: [#65572 Parallelize listing of files on S3](https://github.com/ClickHouse/ClickHouse/issues/65572)

This older but active issue remains one of the clearest infrastructure pain points. The reported bottleneck—serial S3 listing taking roughly an hour for tens of millions of objects—highlights a hard limit for object-storage-backed table discovery, warmup, and metadata-heavy lakehouse use cases. The underlying need is clear: users want ClickHouse to behave better at cloud-object scale, especially for **large table catalogs, Iceberg/Parquet layouts, and S3-backed MergeTree patterns**.

### 2) Keeper migration and post-upgrade coordination instability
- Issue: [#71744 Connection Loss Issues After ClickHouse Update and Migration to ClickHouse Keeper](https://github.com/ClickHouse/ClickHouse/issues/71744)
- Related PR: [#99484 Keeper: fix race between read requests and session close](https://github.com/ClickHouse/ClickHouse/pull/99484)
- Related PR: [#93455 Enable TLS certificate hot-reload for Keeper Raft connections](https://github.com/ClickHouse/ClickHouse/pull/93455)
- Related issue: [#99501 Avoid locks in Keeper mntr 4LW command](https://github.com/ClickHouse/ClickHouse/issues/99501)

Keeper remains a hot operational area. Users upgrading from older versions and moving from ZooKeeper to ClickHouse Keeper are still reporting connection-loss noise and instability symptoms. The cluster of Keeper-related fixes and follow-ups suggests maintainers are actively smoothing **session lifecycle races, observability-path lock contention, and operational TLS management**.

### 3) Security tightening around data lake / Iceberg integrations
- Issue: [#99512 Interserver Mode Entered Before Secret Hash Verified](https://github.com/ClickHouse/ClickHouse/issues/99512)
- PR: [#99467 Fix one cornercase of Datalake security vulnerability](https://github.com/ClickHouse/ClickHouse/pull/99467)

This is one of the highest-signal topics today. The new report on interserver authentication ordering suggests a potentially serious protocol flaw if metadata can be exposed before secret validation completes. In parallel, the open PR for another Iceberg/datalake security corner case shows ClickHouse is still actively hardening boundaries around **file path validation and external table metadata trust**.

### 4) Analyzer and query planner correctness under complex distributed queries
- Issue: [#99362 Server crash ... analyzer with nested GLOBAL IN](https://github.com/ClickHouse/ClickHouse/issues/99362)
- PR: [#99436 Propagate `filter_actions_dag` to distributed inside IN subqueries](https://github.com/ClickHouse/ClickHouse/pull/99436)

The new analyzer continues to expose edge cases under nested/distributed conditions. The technical demand from users is straightforward: planner improvements must preserve stability under real-world distributed SQL patterns, not just single-node correctness. This area remains important for users adopting newer optimization frameworks.

## 4. Bugs & Stability

Ranked by apparent severity based on crash/security/correctness risk:

### Critical / High

1. **Possible authentication bypass / metadata exposure in interserver protocol**
   - Issue: [#99512](https://github.com/ClickHouse/ClickHouse/issues/99512)
   - Risk: Potential premature entry into Interserver Mode before secret verification, with possible metadata disclosure.
   - Fix status: No direct fix PR listed in provided data.
   - Assessment: Highest-severity newly reported issue today due to security implications.

2. **Data lake security corner case still being closed**
   - PR: [#99467](https://github.com/ClickHouse/ClickHouse/pull/99467)
   - Risk: Iceberg manifest could reference data outside `user_files`, allowing unintended reads.
   - Assessment: Strong sign maintainers are treating external table path validation as security-critical.

3. **Server crash with analyzer + nested `GLOBAL IN`**
   - Issue: [#99362](https://github.com/ClickHouse/ClickHouse/issues/99362)
   - Risk: Segmentation fault during distributed query execution.
   - Related work: [#99436](https://github.com/ClickHouse/ClickHouse/pull/99436) is not explicitly the same fix, but is in the same planner/subquery area.
   - Assessment: High operational impact for clusters using the new analyzer.

4. **CI crash: double free/corruption in `MergeTreeDataPartCompact`**
   - Issue: [#98949](https://github.com/ClickHouse/ClickHouse/issues/98949)
   - Risk: Memory corruption in storage engine code path.
   - Assessment: Although currently a CI crash, double-free patterns in MergeTree internals deserve close attention.

### Medium

5. **CI crash during merge sort queue construction**
   - Issue: [#99503](https://github.com/ClickHouse/ClickHouse/issues/99503)
   - Risk: Internal crash in sorting/merge execution path.
   - Assessment: New, low-discussion item but potentially relevant to execution engine reliability.

6. **Prometheus HTTP handler does not populate query metrics/logging correctly**
   - Issue: [#99475](https://github.com/ClickHouse/ClickHouse/issues/99475)
   - Risk: Observability gap rather than data loss; affects monitoring trust and billing/audit style use cases.
   - Assessment: Important for production operators using Prometheus remote write/read workflows.

7. **Page cache not initialized in `clickhouse-local`**
   - Issue: [#99499](https://github.com/ClickHouse/ClickHouse/issues/99499)
   - Risk: Performance inconsistency and configuration surprise rather than correctness failure.
   - Assessment: Likely straightforward fix; useful for local benchmarking and ETL users.

8. **Full-text index returns false positives with OR-ed token predicates**
   - Issue: [#99502](https://github.com/ClickHouse/ClickHouse/issues/99502)
   - Risk: Query correctness issue in experimental full-text indexing.
   - Assessment: Important, but somewhat contained by experimental feature status.

9. **`refresh_parts_interval` behavior undocumented/unexpected**
   - Issue: [#96402](https://github.com/ClickHouse/ClickHouse/issues/96402)
   - Risk: Operational confusion in one-writer/many-reader S3-backed MergeTree setups.
   - Assessment: More of a semantic/documentation mismatch, but relevant for shared-storage deployments.

10. **`optimize_inverse_dictionary_lookup` does not work with `IN`**
    - Issue: [#99500](https://github.com/ClickHouse/ClickHouse/issues/99500)
    - Risk: Missed optimization, performance-only.
    - Assessment: Low severity, but useful for query tuning completeness.

## 5. Feature Requests & Roadmap Signals

Several user requests and in-flight PRs point to likely near-term roadmap directions.

### Strong signals

- **Temporary databases**
  - PR: [#92610](https://github.com/ClickHouse/ClickHouse/pull/92610)
  - Interpretation: Likely useful for session-scoped analytics, isolated testing, and ephemeral workloads. This feels like a meaningful SQL/catalog feature that could plausibly land in an upcoming version if review stabilizes.

- **Automatic cleanup for deleted rows in ReplacingMergeTree**
  - Issue: [#99348](https://github.com/ClickHouse/ClickHouse/issues/99348)
  - Interpretation: This is a strong product signal. Users increasingly use `ReplacingMergeTree` for mutable/deletable entities and want predictable space reclamation without manual cleanup orchestration. This aligns tightly with operational simplicity, so it has good odds of influencing future storage-engine enhancements.

- **Visualization of secondary index contents**
  - Issue: [#99507](https://github.com/ClickHouse/ClickHouse/issues/99507)
  - Duplicate closed: [#99506](https://github.com/ClickHouse/ClickHouse/issues/99506)
  - Interpretation: This reflects a broader demand for **debuggability of data skipping indexes**, not just raw functionality. Even if no direct UI feature appears soon, expect pressure for better system tables, inspection commands, or explain tooling.

- **Support virtual columns in MergeTree sorting key**
  - PR: [#99509](https://github.com/ClickHouse/ClickHouse/pull/99509)
  - Interpretation: If accepted, this would expand modeling flexibility for ingestion and storage design. It’s a notable schema-design feature request with architectural implications.

- **Dynamic `printf` format strings by row**
  - PR: [#98991](https://github.com/ClickHouse/ClickHouse/pull/98991)
  - Interpretation: Smaller feature, but part of ClickHouse’s continuing push toward richer SQL expression compatibility and ergonomics.

### Performance roadmap signals

- **Direct-index hash join for small integer ranges**
  - PR: [#99275](https://github.com/ClickHouse/ClickHouse/pull/99275)
- **S3 listing parallelization**
  - Issue: [#65572](https://github.com/ClickHouse/ClickHouse/issues/65572)
- **Single-dictionary invalidation avoidance**
  - PR: [#99285](https://github.com/ClickHouse/ClickHouse/pull/99285)

These suggest continued investment in **specialized execution paths** and **cloud/object-storage efficiency**, both highly likely to surface in future release notes.

## 6. User Feedback Summary

The current user feedback paints a clear picture of where ClickHouse users are feeling friction:

- **Cloud/object storage at scale is still expensive operationally**
  - [#65572](https://github.com/ClickHouse/ClickHouse/issues/65572), [#96402](https://github.com/ClickHouse/ClickHouse/issues/96402)
  - Users want S3-backed and lake-style deployments to be faster, more predictable, and better documented.

- **Keeper migrations remain sensitive**
  - [#71744](https://github.com/ClickHouse/ClickHouse/issues/71744), [#99484](https://github.com/ClickHouse/ClickHouse/pull/99484), [#93455](https://github.com/ClickHouse/ClickHouse/pull/93455)
  - The pain point is not only correctness but also operator confidence during upgrades and coordination backend transitions.

- **Users need better introspection/debuggability**
  - [#99507](https://github.com/ClickHouse/ClickHouse/issues/99507), [#99475](https://github.com/ClickHouse/ClickHouse/issues/99475)
  - Requests focus on seeing what indexes contain, and ensuring query/row metrics show up properly in logs/monitoring systems.

- **Query engine improvements are welcome, but correctness is non-negotiable**
  - [#99362](https://github.com/ClickHouse/ClickHouse/issues/99362), [#99502](https://github.com/ClickHouse/ClickHouse/issues/99502), [#99436](https://github.com/ClickHouse/ClickHouse/pull/99436)
  - Users are clearly exercising newer analyzer and text-index capabilities, but they expect mature behavior under distributed and edge-case workloads.

- **Mutable-data workflows are becoming mainstream**
  - [#99348](https://github.com/ClickHouse/ClickHouse/issues/99348)
  - Demand for automated cleanup in `ReplacingMergeTree` suggests more users are treating ClickHouse as a system for semi-mutable operational analytics, not just append-only warehousing.

## 7. Backlog Watch

These older or strategically important items appear to merit continued maintainer attention:

1. **S3 listing scalability**
   - Issue: [#65572](https://github.com/ClickHouse/ClickHouse/issues/65572)
   - Why it matters: It is old, still active, and foundational for large-scale object-storage deployments.

2. **Keeper connection-loss reports after migration/upgrades**
   - Issue: [#71744](https://github.com/ClickHouse/ClickHouse/issues/71744)
   - Why it matters: This is a long-lived operational complaint affecting real production migrations.

3. **Temporary databases**
   - PR: [#92610](https://github.com/ClickHouse/ClickHouse/pull/92610)
   - Why it matters: Long-running feature PR with meaningful user-facing impact; likely needs reviewer bandwidth.

4. **Keeper TLS hot reload**
   - PR: [#93455](https://github.com/ClickHouse/ClickHouse/pull/93455)
   - Why it matters: Important for secure operations and certificate rotation hygiene in production clusters.

5. **Warning on non-range-capable URL sources for ORC/Parquet/Arrow**
   - PR: [#96988](https://github.com/ClickHouse/ClickHouse/pull/96988)
   - Why it matters: This addresses a common hidden performance trap in external file reads and would improve user transparency.

6. **Analyzer/distributed-subquery correctness**
   - Issue: [#99362](https://github.com/ClickHouse/ClickHouse/issues/99362)
   - Related PR: [#99436](https://github.com/ClickHouse/ClickHouse/pull/99436)
   - Why it matters: New planner adoption depends heavily on eliminating crash/correctness edge cases.

---

## Overall Health Assessment

ClickHouse shows **strong engineering throughput** and healthy responsiveness across storage, SQL engine, and operational infrastructure. The main caution flags today are **security hardening**, **MergeTree/analyzer crash reports**, and **Keeper reliability under production migration scenarios**. At the same time, the PR queue shows substantial forward motion in **join performance, dictionary efficiency, metadata features, and SQL ergonomics**. In short: the project is advancing quickly, but current user attention is focused on making newer capabilities as robust and operable as the core analytical engine.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-15

## 1. Today's Overview

DuckDB showed solid day-to-day engineering activity, with **11 issues** and **15 PRs** updated in the last 24 hours, and a relatively high closure rate on PRs (**9 merged/closed**). The main themes today were **S3/Parquet performance regressions in 1.5.0**, **checkpoint/WAL correctness under restricted access settings**, and **developer/CI/build system reliability**. There is also a noticeable cluster of **CLI and Windows-related usability regressions**, plus a few **internal errors** in newer functionality such as `VARIANT` handling and binding. Overall, project health looks active and responsive, but the issue stream suggests **recent 1.5.x changes are surfacing regressions in remote file access, query planning, and some client/runtime interfaces**.

## 3. Project Progress

Merged/closed PR activity today advanced several practical areas of DuckDB’s engine and tooling:

- **S3/Parquet remote scan efficiency improvements**
  - [PR #21373](https://github.com/duckdb/duckdb/pull/21373) improved Parquet prefetch behavior by allowing merged prefetch column ranges when columns do not have table filters. This is directly relevant to reducing excessive HTTP GETs and is noted as a **partial fix** for the S3 request explosion in [Issue #21348](https://github.com/duckdb/duckdb/issues/21348).
  - [PR #21374](https://github.com/duckdb/duckdb/pull/21374) improved **cardinality estimation for directory/globbed Parquet scans** by using file sizes returned from S3 listings instead of relying on the first file only. This should help planning quality on skewed datasets.
  - A follow-up remains open in [PR #21383](https://github.com/duckdb/duckdb/pull/21383), which proposes ignoring optional filters when deciding lazy fetch behavior in the Parquet reader.

- **Checkpoint/WAL correctness and sandboxed access**
  - [PR #21379](https://github.com/duckdb/duckdb/pull/21379) fixed [Issue #21335](https://github.com/duckdb/duckdb/issues/21335), ensuring checkpoint and recovery WAL paths are properly allowed when opening a persistent DB with `enable_external_access=false`. This is an important fix for secure or sandboxed deployments.
  - [PR #21382](https://github.com/duckdb/duckdb/pull/21382) remains open and proposes having checkpoints run in their own transaction where a client context exists, indicating further work on **checkpoint isolation and reliability**.

- **CI/build robustness and contributor ergonomics**
  - [PR #21368](https://github.com/duckdb/duckdb/pull/21368) added finer-grained retry behavior for CI commands, improving resilience against transient failures.
  - [PR #21366](https://github.com/duckdb/duckdb/pull/21366) skips costly CI jobs unless extensions change, reducing unnecessary pipeline cost and latency.
  - [PR #21371](https://github.com/duckdb/duckdb/pull/21371) established a better-defined environment for MinGW builds.
  - [PR #21376](https://github.com/duckdb/duckdb/pull/21376) is still open and addresses GCC compile flags on reconfigure, another sign of attention to build reproducibility.
  - Two variants of clangd/`compile_commands.json` automation ([PR #21361](https://github.com/duckdb/duckdb/pull/21361), [PR #21377](https://github.com/duckdb/duckdb/pull/21377)) were closed, suggesting the team is iterating on the right shape for developer tooling changes.

- **Reader correctness**
  - [PR #21298](https://github.com/duckdb/duckdb/pull/21298) is marked ready to merge and fixes Parquet define buffer corruption during skips, which is a lower-level correctness and stability improvement in the reader path.

## 4. Community Hot Topics

The most visible discussion today centers on **remote data lake access patterns**, especially S3 + hive-partitioned Parquet:

- [Issue #11817](https://github.com/duckdb/duckdb/issues/11817) — **Out-of-memory error when performing partitioned copy to S3**  
  10 comments, 8 👍  
  This older but still-active issue reflects demand for **predictable memory behavior during partitioned writes to object storage**. Users increasingly use DuckDB as an ETL/export engine into lakehouse layouts, and memory overhead during partitioned `COPY` appears to be a real production constraint.

- [Issue #21348](https://github.com/duckdb/duckdb/issues/21348) — **`QUALIFY ROW_NUMBER() OVER (...) = 1` causes ~50x more S3 requests in 1.5.0**  
  5 comments, 2 👍  
  This is the clearest current regression signal: a common dedup/top-1-per-group pattern now triggers dramatically more remote reads. The underlying need is for the optimizer and Parquet reader to preserve **filter pushdown, partition pruning, and efficient prefetch** even with window-function-based plans.

- [Issue #21347](https://github.com/duckdb/duckdb/issues/21347) — **Hive partition filters discover all files before pruning in 1.5.0**  
  1 comment, 2 👍  
  This strongly complements #21348 and suggests a broader 1.5.0 regression in **file discovery/planning order** for partitioned datasets on object storage. The technical need is straightforward: **partition pruning should happen before expensive file enumeration and remote metadata access whenever possible**.

- [Issue #10302](https://github.com/duckdb/duckdb/issues/10302) — **DuckDB CLI: highlight/autocomplete not working on Windows**  
  13 comments, 5 👍, now closed  
  This remained one of the most discussed usability issues and was closed today, indicating progress on CLI UX for Windows users. It highlights that the DuckDB CLI remains strategically important, especially for cross-platform local analytics workflows.

- [PR #21350](https://github.com/duckdb/duckdb/pull/21350) — **introducing TryPushdownRelaxedFilter**  
  Open, changes requested  
  This PR is notable because it attacks a class of missed pushdowns involving type/cast semantics, such as `TIMESTAMP` vs `TIMESTAMP WITH TIME ZONE`. That’s a strong roadmap signal toward **more aggressive but safe predicate pushdown**, especially important for large time-ordered tables.

## 5. Bugs & Stability

Ranked roughly by severity and likely user impact:

### Critical / High

1. **S3/hive-partitioned query regression causing huge request amplification**
   - [Issue #21348](https://github.com/duckdb/duckdb/issues/21348)
   - Symptoms: ~80 GETs in 1.4.4 vs >4,200 GETs in 1.5.0; wall time nearly triples.
   - Impact: high for cloud analytics users; can materially increase both latency and object-store cost.
   - Related fixes:
     - partial mitigation merged in [PR #21373](https://github.com/duckdb/duckdb/pull/21373)
     - planning improvement merged in [PR #21374](https://github.com/duckdb/duckdb/pull/21374)
     - further reader refinement open in [PR #21383](https://github.com/duckdb/duckdb/pull/21383)

2. **Hive partition filters appear to prune too late in 1.5.0**
   - [Issue #21347](https://github.com/duckdb/duckdb/issues/21347)
   - Symptoms: all files may be discovered before partition pruning.
   - Impact: severe for large partitioned datasets on S3; closely tied to #21348.

3. **Out-of-memory during partitioned `COPY` to S3**
   - [Issue #11817](https://github.com/duckdb/duckdb/issues/11817)
   - Impact: significant for ETL/export jobs; suggests write-path memory scaling problems under partition fan-out.

### Medium

4. **`enable_external_access=false` blocked WAL checkpointing on persistent DBs**
   - [Issue #21335](https://github.com/duckdb/duckdb/issues/21335)
   - Fix merged: [PR #21379](https://github.com/duckdb/duckdb/pull/21379)
   - Impact: medium-high for embedded secure deployments; now appears addressed quickly.

5. **ADBC stream interleaving regression since DuckDB 1.5**
   - [Issue #21384](https://github.com/duckdb/duckdb/issues/21384)
   - Symptoms: `stream.get_next()` fails after interleaved query execution.
   - Impact: important for application developers integrating via Arrow ADBC; brand-new and needs triage.

6. **CLI `.tables` and `-table` output issues in 1.5.x**
   - [Issue #21378](https://github.com/duckdb/duckdb/issues/21378)
   - Symptoms: internal error or malformed repeated fields/output.
   - Impact: medium; user-facing regression in CLI behavior.

7. **Hive partitioning behavior differs by nesting levels**
   - [Issue #21370](https://github.com/duckdb/duckdb/issues/21370)
   - Impact: medium; may reflect inconsistent partition interpretation or path handling.

### Correctness / Internal Errors

8. **Internal error converting JSON to `VARIANT`**
   - [Issue #21352](https://github.com/duckdb/duckdb/issues/21352)
   - Symptoms: crash with “Field is missing but untyped_value_index is not set”.
   - Impact: high for early adopters of newer semi-structured data features; likely a young feature area.

9. **Internal binding error with inequal types**
   - [Issue #21372](https://github.com/duckdb/duckdb/issues/21372)
   - Symptoms: “Failed to bind column reference (inequal types)”.
   - Impact: correctness concern; likely optimizer/binder edge case.

10. **SIGILL in SQLite sqllogictest on FreeBSD 15**
    - [Issue #21262](https://github.com/duckdb/duckdb/issues/21262)
    - Impact: platform-specific but serious for portability; suggests unsupported instruction or bad codegen path in tests/builds.

11. **Windows CLI highlight/autocomplete bug**
    - [Issue #10302](https://github.com/duckdb/duckdb/issues/10302)
    - Now closed; suggests at least one longstanding Windows CLI issue has moved toward resolution.

## 6. Feature Requests & Roadmap Signals

There are not many classic “please add feature X” requests in this snapshot; the stronger signals are from **performance and semantics improvements** that users clearly want:

- **Smarter predicate pushdown across casts and time zone semantics**
  - [PR #21350](https://github.com/duckdb/duckdb/pull/21350)
  - This is an important roadmap clue. Users expect expressions like `start_time > now() - INTERVAL 1 HOUR` to push down cleanly. If accepted, this could land in the next point release as a practical optimizer improvement.

- **Better object-store behavior for lakehouse-style reads and writes**
  - [Issue #11817](https://github.com/duckdb/duckdb/issues/11817)
  - [Issue #21347](https://github.com/duckdb/duckdb/issues/21347)
  - [Issue #21348](https://github.com/duckdb/duckdb/issues/21348)
  - The cluster of S3 issues signals a roadmap priority around **partition pruning, file discovery order, memory discipline, and request coalescing**. These are likely candidates for near-term 1.5.x fixes because they are regressions or production pain points.

- **Semi-structured type maturity (`JSON`/`VARIANT`)**
  - [Issue #21352](https://github.com/duckdb/duckdb/issues/21352)
  - The `VARIANT` path is attracting testing, which usually means growing user interest. Expect stability work before broader feature expansion.

- **Safer embedded/runtime APIs**
  - [Issue #21384](https://github.com/duckdb/duckdb/issues/21384)
  - ADBC behavior matters for connector ecosystems. Fixes here are likely because they affect interoperability and application reliability.

## 7. User Feedback Summary

Current user feedback clusters around a few concrete pain points:

- **Remote analytics workloads are highly sensitive to planner/storage-engine regressions.**  
  The S3 issues show users are measuring not just runtime but also **HTTP request counts**, which indicates real production cost sensitivity. Users expect DuckDB to remain efficient on hive-partitioned Parquet lakes, especially for selective queries and window-based dedup patterns.

- **Partitioned write workflows need better memory behavior.**  
  [Issue #11817](https://github.com/duckdb/duckdb/issues/11817) suggests DuckDB is being used for exporting partitioned datasets to S3 at relatively modest scale, and users are surprised by the memory footprint. This points to expectations that DuckDB should behave more like a streaming writer in cloud ETL scenarios.

- **CLI usability still matters, especially on Windows.**  
  The closure of [Issue #10302](https://github.com/duckdb/duckdb/issues/10302) is positive, but [Issue #21378](https://github.com/duckdb/duckdb/issues/21378) shows new CLI regressions in 1.5.x. Users still depend on the shell experience for quick inspection and local workflows.

- **Advanced/newer features are being actively exercised.**  
  `VARIANT`, ADBC, and secure embedded settings (`enable_external_access=false`) are all appearing in bug reports. That’s a healthy sign of adoption breadth, but also means edge-case stability is under pressure.

## 8. Backlog Watch

Items that appear important and deserving of maintainer attention:

- [Issue #11817](https://github.com/duckdb/duckdb/issues/11817) — **Out-of-memory on partitioned copy to S3**  
  Created in 2024, still active and under review. Given the comments/reactions and practical cloud ETL relevance, this looks like an important longstanding issue.

- [Issue #21262](https://github.com/duckdb/duckdb/issues/21262) — **SIGILL in sqllogictest on FreeBSD**  
  Still only marked “needs triage.” Platform-specific illegal instruction failures can mask portability/build assumptions and deserve more direct maintainer assessment.

- [PR #21298](https://github.com/duckdb/duckdb/pull/21298) — **Parquet define buffer corruption during skips**  
  Marked ready to merge. This appears to be a meaningful correctness fix in a critical reader path and should likely be prioritized.

- [PR #21350](https://github.com/duckdb/duckdb/pull/21350) — **TryPushdownRelaxedFilter**  
  Open with changes requested. Because it addresses a broad class of missed pushdowns, it could have outsized benefit if the semantic safety questions are resolved.

- [Issue #21384](https://github.com/duckdb/duckdb/issues/21384) — **ADBC interleaved query regression**  
  New and untriaged today. Given connector/API importance, this should not sit long without reproduction and owner assignment.

## Links Referenced

- [Issue #10302](https://github.com/duckdb/duckdb/issues/10302)
- [Issue #11817](https://github.com/duckdb/duckdb/issues/11817)
- [Issue #21262](https://github.com/duckdb/duckdb/issues/21262)
- [Issue #21335](https://github.com/duckdb/duckdb/issues/21335)
- [Issue #21347](https://github.com/duckdb/duckdb/issues/21347)
- [Issue #21348](https://github.com/duckdb/duckdb/issues/21348)
- [Issue #21352](https://github.com/duckdb/duckdb/issues/21352)
- [Issue #21370](https://github.com/duckdb/duckdb/issues/21370)
- [Issue #21372](https://github.com/duckdb/duckdb/issues/21372)
- [Issue #21378](https://github.com/duckdb/duckdb/issues/21378)
- [Issue #21384](https://github.com/duckdb/duckdb/issues/21384)
- [PR #21298](https://github.com/duckdb/duckdb/pull/21298)
- [PR #21350](https://github.com/duckdb/duckdb/pull/21350)
- [PR #21366](https://github.com/duckdb/duckdb/pull/21366)
- [PR #21368](https://github.com/duckdb/duckdb/pull/21368)
- [PR #21371](https://github.com/duckdb/duckdb/pull/21371)
- [PR #21373](https://github.com/duckdb/duckdb/pull/21373)
- [PR #21374](https://github.com/duckdb/duckdb/pull/21374)
- [PR #21376](https://github.com/duckdb/duckdb/pull/21376)
- [PR #21379](https://github.com/duckdb/duckdb/pull/21379)
- [PR #21382](https://github.com/duckdb/duckdb/pull/21382)
- [PR #21383](https://github.com/duckdb/duckdb/pull/21383)

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-15

## 1. Today's Overview

StarRocks showed moderate engineering activity over the last 24 hours, with **12 PRs updated** and **2 new/active issues**, but **no new releases**. The day’s work was weighted toward **bug fixing, backports, and infrastructure/tooling maintenance**, rather than large feature drops. The most notable product-facing items were fixes for a **CN crash on empty-tablet scans**, a **Paimon statistics correctness bug**, and merged authorization fixes ensuring the **root user bypasses Ranger checks** consistently across maintained branches. Overall, project health looks solid: active branch maintenance, quick bug-to-fix turnaround, and continued investment in external lakehouse compatibility.

---

## 3. Project Progress

### Merged/closed PRs today

#### 1) Ranger authorization behavior standardized for root user
- PR: [#70254](https://github.com/StarRocks/starrocks/pull/70254) — **Ensure root user bypasses all Ranger permission checks**
- Backports:
  - [#70279](https://github.com/StarRocks/starrocks/pull/70279) — version 3.5.15
  - [#70278](https://github.com/StarRocks/starrocks/pull/70278) — version 4.0.8
  - [#70277](https://github.com/StarRocks/starrocks/pull/70277) — version 4.1.0

**Why it matters:**  
This is an important **security/authorization semantics** fix. It clarifies that the built-in `root` user should bypass Ranger policy enforcement regardless of Ranger-side policy state. For operators integrating StarRocks with enterprise governance stacks, this reduces risk of accidental lockout or inconsistent superuser behavior across deployments.

**Analytical engine impact:**  
- Improves **admin operability** in secured environments
- Reduces authorization edge cases in **Ranger-integrated** clusters
- Strong signal that StarRocks continues to harden enterprise access-control behavior across all active release lines

---

#### 2) Multi-statement transaction file bundling support
- PR: [#70276](https://github.com/StarRocks/starrocks/pull/70276) — **Support file bundling in multi-statement transactions**

**Why it matters:**  
This closed enhancement advances StarRocks’ **write path/storage efficiency**. Previously, file bundling was disabled for multi-statement transactions due to txn-log/segment alignment concerns. The change suggests those constraints have now been addressed well enough to enable a more efficient storage layout in broader transactional scenarios.

**Analytical storage impact:**  
- Better write-side efficiency for **multi-statement transactional ingestion**
- Potentially fewer small files / improved bundling behavior
- Helpful for users with mixed OLAP + transactional data loading patterns

---

#### 3) Variant subfield pruning exposure for HDFS and Iceberg scans
- PR: [#70252](https://github.com/StarRocks/starrocks/pull/70252) — **Expose variant subfield access paths for HDFS and Iceberg scans**

**Why it matters:**  
This is a meaningful optimizer/planner enhancement for semi-structured analytics over external data lakes. By propagating variant subfield access paths into external scan planning, StarRocks can better align FE pruning decisions with Iceberg/HDFS scan execution.

**Query engine impact:**  
- Better **subfield pruning** for variant/semi-structured data
- Improved scan planning for **Iceberg** and **HDFS-backed** tables
- Likely benefits query efficiency when users access nested fields from external datasets

---

## 4. Community Hot Topics

There was **no strong community contention signal today**: all visible issues/PRs show **0 reactions**, and issue comment counts are **0** in the provided data. So “hot topics” are best inferred from technical importance and branch coverage rather than social engagement.

### A) Empty-tablet scan crash in CN
- Issue: [#70280](https://github.com/StarRocks/starrocks/issues/70280) — **CN crash when scanning empty tablet with physical split enabled**
- Fix PR: [#70281](https://github.com/StarRocks/starrocks/pull/70281)

**Underlying need:**  
Users running **shared-data clusters** need physical split execution to be robust even for degenerate storage states like tablets with no rowsets. This points to a broader need for better safety around **parallel scan scheduling** and edge-case tablet metadata handling.

---

### B) Paimon column statistics correctness
- Issue: [#70282](https://github.com/StarRocks/starrocks/issues/70282) — **Paimon column statistics uses nullCount as averageRowSize instead of avgLen**
- Fix PR: [#70283](https://github.com/StarRocks/starrocks/pull/70283)

**Underlying need:**  
Users increasingly depend on StarRocks to query **external lakehouse catalogs** with optimizer-quality statistics. This bug shows that correctness of metadata translation from systems like Paimon directly affects planning quality. The signal is clear: connector correctness is now a first-class performance concern.

---

### C) External format compatibility: UUID in Parquet/Iceberg
- PR: [#70226](https://github.com/StarRocks/starrocks/pull/70226) — **add support for FIXED_LEN_BYTE_ARRAY types to be read as VARCHAR(36) lazily**

**Underlying need:**  
Users want smoother interoperability with **Iceberg + Parquet logical UUID types** without custom conversion workarounds. This is a practical compatibility ask from lakehouse users dealing with modern schema types.

---

## 5. Bugs & Stability

### Severity-ranked issues reported today

#### 1) High severity: CN crash on empty tablet with physical split enabled
- Issue: [#70280](https://github.com/StarRocks/starrocks/issues/70280)
- Fix PR: [#70281](https://github.com/StarRocks/starrocks/pull/70281)

**Impact:**  
A **SIGSEGV / array out-of-bounds** during scan execution is the most severe item in today’s set. It affects CN stability under a specific but realistic storage state: an empty tablet combined with `PhysicalSplitMorselQueue` split behavior.

**Assessment:**  
- Category: runtime crash / stability
- Area: CN scan path, shared-data execution
- Risk: high for affected clusters
- Mitigation status: **fix PR already open**

---

#### 2) Medium severity: Wrong optimizer statistics for Paimon columns
- Issue: [#70282](https://github.com/StarRocks/starrocks/issues/70282)
- Fix PR: [#70283](https://github.com/StarRocks/starrocks/pull/70283)

**Impact:**  
This is a **query planning correctness** issue rather than a crash. Using `nullCount` as `averageRowSize` can distort cardinality/cost estimates and lead to suboptimal plans when `enable_paimon_column_statistics = true`.

**Assessment:**  
- Category: optimizer stats correctness
- Area: Paimon connector / FE metadata translation
- Risk: moderate, especially for cost-based optimization quality
- Mitigation status: **fix PR already open**

---

#### 3) Medium severity: Query pool negative memory accounting
- PR: [#70228](https://github.com/StarRocks/starrocks/pull/70228) — **Fix query_pool negative memory caused by bthread TLS pollution**

**Impact:**  
Not newly reported as an issue today, but the PR addresses potentially alarming memory tracker anomalies such as deeply negative `query_pool` values during load-only scenarios.

**Assessment:**  
- Category: observability / memory accounting correctness
- Area: BE runtime, bthread/TLS memory tracker handling
- Risk: moderate, mainly operator confusion and possible debugging difficulty
- Status: **open**

---

#### 4) Security/admin correctness: root user Ranger bypass
- PR: [#70254](https://github.com/StarRocks/starrocks/pull/70254) and backports [#70279](https://github.com/StarRocks/starrocks/pull/70279), [#70278](https://github.com/StarRocks/starrocks/pull/70278), [#70277](https://github.com/StarRocks/starrocks/pull/70277)

**Impact:**  
This is not a crash, but an important **authorization correctness** fix for enterprise environments.

---

## 6. Feature Requests & Roadmap Signals

### Strong signals from current PRs

#### A) Better external table type compatibility
- PR: [#70226](https://github.com/StarRocks/starrocks/pull/70226)

This is a clear user-driven compatibility request: reading Parquet `FIXED_LEN_BYTE_ARRAY` UUIDs as `VARCHAR(36)` lazily. That suggests near-term roadmap emphasis on:
- richer **Iceberg/Parquet type mapping**
- smoother support for **logical types**
- lower-friction migration from lakehouse-native schemas into StarRocks query paths

**Prediction:** likely candidate for an upcoming **4.0/4.1 patch or minor release**, especially because it is already tagged for multiple branches.

---

#### B) More robust external metadata/statistics integration
- Issue: [#70282](https://github.com/StarRocks/starrocks/issues/70282)
- PR: [#70283](https://github.com/StarRocks/starrocks/pull/70283)

The quick turnaround here signals ongoing investment in **CBO-relevant metadata fidelity** for external systems such as Paimon.

**Prediction:** expect continued work around:
- connector stats quality
- pruning pushdown accuracy
- external table optimizer integration

---

#### C) Continued semi-structured and nested-data optimization
- PR: [#70252](https://github.com/StarRocks/starrocks/pull/70252)

The variant subfield access work points to a roadmap where StarRocks improves:
- nested field pruning
- external semi-structured scan efficiency
- Iceberg/HDFS lake query performance

This is especially relevant for users treating StarRocks as a **high-performance query layer on open table formats**.

---

#### D) Developer experience and CI portability
- PR: [#70275](https://github.com/StarRocks/starrocks/pull/70275) — **Make base_test work on macOS**
- PR: [#70284](https://github.com/StarRocks/starrocks/pull/70284) — **Fix BE UT is skipped**

These are not end-user features, but they are roadmap signals for healthier contributor workflows and stronger CI reliability.

---

## 7. User Feedback Summary

### Main pain points visible today

#### 1) Connector correctness matters as much as raw performance
From the Paimon statistics issue ([#70282](https://github.com/StarRocks/starrocks/issues/70282)), users are clearly sensitive to optimizer quality when querying external systems. This reflects a maturing user base that expects StarRocks not just to “read” external data, but to do so with **accurate cost-based planning**.

#### 2) Lakehouse interoperability remains a major use case
The Parquet/Iceberg UUID compatibility request in [#70226](https://github.com/StarRocks/starrocks/pull/70226) shows real demand from users operating across **Iceberg + Parquet + StarRocks** stacks. The need is practical: users want StarRocks to handle common open-table-format schema conventions without manual adaptation.

#### 3) Shared-data execution edge cases still matter operationally
The CN crash issue ([#70280](https://github.com/StarRocks/starrocks/issues/70280)) highlights that users are exercising advanced execution/storage combinations, including **shared-data architecture** and **physical split** scanning. Stability in these paths is crucial for production trust.

#### 4) Enterprise governance integrations are production-critical
The Ranger root-user fix ([#70254](https://github.com/StarRocks/starrocks/pull/70254)) suggests that StarRocks is actively used in environments where **centralized access control** and predictable superuser semantics are non-negotiable.

---

## 8. Backlog Watch

There are **no clearly long-stalled issues or PRs** in the provided 24-hour snapshot. Most visible product bugs already have companion fix PRs, which is a positive maintainer responsiveness signal.

Still, a few open items deserve attention:

### A) Memory accounting anomaly in BE
- PR: [#70228](https://github.com/StarRocks/starrocks/pull/70228)

This touches runtime correctness and operator trust in memory metrics. Even if not a crash bug, it should receive timely review because misleading memory accounting complicates production diagnosis.

### B) Multi-branch external format compatibility
- PR: [#70226](https://github.com/StarRocks/starrocks/pull/70226)

Given the broad relevance of UUID handling in Parquet/Iceberg workloads, this looks like a high-value compatibility improvement that would benefit from prompt maintainer decision-making.

### C) Tooling and test reliability
- PRs:
  - [#70275](https://github.com/StarRocks/starrocks/pull/70275)
  - [#70284](https://github.com/StarRocks/starrocks/pull/70284)

These are easy to deprioritize, but they have outsized impact on contributor velocity and regression prevention.

---

## Overall Health Assessment

StarRocks appears healthy today: **fast bug response**, **active backporting**, and **steady progress on external ecosystem integration**. The strongest technical themes are:
- stability hardening in scan execution,
- metadata/statistics correctness for lakehouse connectors,
- enterprise authorization consistency,
- and deeper support for modern external data representations.

No release was cut today, but branch maintenance activity suggests the project is actively preparing stable lines for continued patch delivery.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-15

## 1. Today's Overview

Apache Iceberg showed **moderate-to-high development activity** over the last 24 hours, with **22 pull requests updated** and **5 issues touched**, but **no new release published**. The day’s work was concentrated on **bug fixes, connector behavior, spec/API evolution, and engine-specific improvements** across Spark, Flink, Kafka Connect, REST/OpenAPI, and core utilities. Several updates indicate continued investment in **correctness and interoperability**, especially around schema/metadata handling, timestamp precision, and maintenance procedures. Overall, project health looks **active but patch-focused**, with multiple long-running PRs still awaiting maintainer convergence.

## 2. Project Progress

### Merged/closed PRs today

Even without a release, several closed PRs show forward movement in documentation, test reliability, dependency hygiene, REST metadata behavior, and cloud catalog functionality:

- [#15607](https://github.com/apache/iceberg/pull/15607) — **Build/OpenAPI/Kafka Connect: bump Avro 1.12.0 → 1.12.1**
  - Closed after addressing **CVE-2025-33042**.
  - This is an important **supply-chain/security maintenance** step for downstream users embedding Iceberg components.

- [#15300](https://github.com/apache/iceberg/pull/15300) — **BigQuery: implement rename table**
  - Closed PR around **GCP catalog compatibility**.
  - Signals continued effort to improve cloud catalog parity, though closure without merge means users may still be waiting for the feature.

- [#14166](https://github.com/apache/iceberg/pull/14166) — **REST: allow `refresh()` to load refs-only metadata**
  - Closed work focused on reducing unnecessary snapshot loading when catalogs are configured for refs-only metadata.
  - This is relevant for **catalog scalability and lower metadata I/O**, especially in large-table environments.

- [#15227](https://github.com/apache/iceberg/pull/15227) — **Spark tests: fix flaky `TestCopyOnWriteDelete` tests**
  - Closed PR targeting **CI stability** and reliability of Spark delete-path testing.
  - While not end-user-facing, this improves confidence in delete semantics and development velocity.

- [#15230](https://github.com/apache/iceberg/pull/15230) — **Parquet: improve Javadoc for delete writers**
  - Closed documentation PR clarifying equality and position delete writer APIs.
  - Helpful for contributors and integrators implementing delete-file workflows.

- [#12667](https://github.com/apache/iceberg/pull/12667) — **API/Core: geospatial bounding box types and intersects checking**
  - Closed after long-running development.
  - This is a meaningful roadmap signal around **geospatial support** in Iceberg expressions and type handling.

- [#15047](https://github.com/apache/iceberg/pull/15047) — **Flink rewrite DataFile support for Parquet merge**
  - Closed stale; suggests this optimization path is not landing yet.
  - Indicates that **Flink maintenance/compaction ergonomics** remain a work-in-progress.

### What this advances

Today’s closed work suggests progress in:
- **Security and dependency upkeep**
- **REST/catalog metadata efficiency**
- **Spark test and delete-path reliability**
- **Documentation maturity for Parquet delete writing**
- **Early geospatial API foundations**

Less progress is visible on immediately shippable user-facing SQL features; today was more about **platform hardening and architectural groundwork**.

## 3. Community Hot Topics

### Most notable active discussions and updates

- [#15332](https://github.com/apache/iceberg/issues/15332) — **Null partition handling of Hive migration**
  - Bug in Spark/Hive migration path involving Hive-style null partition values like `__HIVE_DEFAULT_PARTITION__`.
  - Underlying need: **smooth migration from legacy Hive tables to Iceberg without data/partition correctness surprises**.

- [#15347](https://github.com/apache/iceberg/issues/15347) — **Disabling statistics across multiple columns**
  - Affects table property behavior for `write.parquet.stats-enabled.column.<COLUMN_NAME>`.
  - Underlying need: **fine-grained Parquet stats control** for privacy, writer performance, and query planning behavior across many columns.

- [#15558](https://github.com/apache/iceberg/pull/15558) and [#15631](https://github.com/apache/iceberg/issues/15631) — **`PropertyUtil.propertiesWithPrefix` treats prefix as regex**
  - Very clear bug/fix pair.
  - Underlying need: **predictable configuration parsing** in core utilities; this matters broadly because property parsing touches many engine integrations and table options.

- [#15475](https://github.com/apache/iceberg/pull/15475) — **Flink nanosecond precision support**
  - Addresses truncation of `TIMESTAMP(9)` / `TIMESTAMP_LTZ(9)` into milliseconds for V3 tables.
  - Underlying need: **true high-precision timestamp support** in streaming/data engineering use cases, especially financial, observability, and CDC pipelines.

- [#14797](https://github.com/apache/iceberg/pull/14797) — **Kafka Connect delta writer support in DV mode**
  - Expands CDC/upsert workflows with delete vectors for in-batch deduplication.
  - Underlying need: **streaming ingestion correctness and lower-cost mutation patterns**.

- [#14101](https://github.com/apache/iceberg/pull/14101) — **Geospatial predicates and bounding box literals**
  - Long-lived work building on earlier geospatial API additions.
  - Underlying need: **analytical pushdown/filtering for spatial workloads**.

## 4. Bugs & Stability

Ranked by likely severity/impact based on reported behavior and breadth of affected users:

### 1) High severity — configuration parsing correctness in core utility
- [#15631](https://github.com/apache/iceberg/issues/15631) — **`PropertyUtil.propertiesWithPrefix` treats prefix as regex**
- Fix PR exists: [#15558](https://github.com/apache/iceberg/pull/15558)
- Why it matters:
  - This is a **core utility bug** that can silently mis-handle configuration keys containing regex-special characters.
  - Potential impact spans **multiple modules**, since property-prefix helpers are commonly reused.
  - Risk is not just failure but **incorrect option matching**.

### 2) High severity — migration correctness for Hive-partitioned tables
- [#15332](https://github.com/apache/iceberg/issues/15332) — **Null partition handling of Hive migration**
- Why it matters:
  - Migration is a high-stakes workflow; mishandling null partitions can lead to **incorrect partition interpretation or migration failures**.
  - Affects real-world warehouse modernization paths from Hive to Iceberg.

### 3) Medium-high severity — procedure failure on complex schemas
- [#15632](https://github.com/apache/iceberg/pull/15632) — **Fix `rewrite_position_delete_files` failure with array/map columns**
- Alternate/open predecessor: [#15079](https://github.com/apache/iceberg/pull/15079)
- Related issue referenced in PR: `#15080`
- Why it matters:
  - Impacts maintenance procedures on tables with **array/map columns**, which are common in semi-structured data.
  - Affects **operational maintenance reliability**, not just edge-case syntax.

### 4) Medium severity — Flink job can stall during restart cycles
- [#14079](https://github.com/apache/iceberg/issues/14079) — **Flink job stuck at “INITIALIZING” with RANGE distribution**
- Why it matters:
  - Long-running streaming jobs that stop/savepoint/restart are production-critical.
  - “Initializing” hangs can be **operationally severe** for Flink users at scale.

### 5) Medium severity — multi-column stats disabling appears broken
- [#15347](https://github.com/apache/iceberg/issues/15347) — **Disabling statistics across multiple columns**
- Why it matters:
  - Impacts write configuration correctness.
  - Could affect **Parquet metadata size, writer cost, and optimizer behavior**.

### 6) Lower severity but important for ops guidance
- [#13972](https://github.com/apache/iceberg/issues/13972) — **ValidationException during `rewrite_data_files` with concurrent streaming writes**
- Closed as stale/question rather than fixed.
- Why it matters:
  - Reflects a recurring operational concern: **maintenance procedures under concurrent ingestion** still need better guidance and safer patterns.

## 5. Feature Requests & Roadmap Signals

The strongest roadmap signals today are:

### Flink precision and maintenance extensibility
- [#15475](https://github.com/apache/iceberg/pull/15475) — nanosecond precision support
- [#15566](https://github.com/apache/iceberg/pull/15566) — arbitrary post-commit maintenance tasks via `IcebergSink` builder
- Likelihood for next version: **high to medium-high**
- Why:
  - Both are practical, user-facing improvements to Flink integration.
  - They address real production pain around **time precision** and **maintenance workflow flexibility**.

### Kafka Connect CDC/upsert maturity
- [#14797](https://github.com/apache/iceberg/pull/14797) — delta writer support in DV mode
- [#15615](https://github.com/apache/iceberg/pull/15615) — auto-create not setting `identifier-field-ids`
- [#15027](https://github.com/apache/iceberg/pull/15027) — `ZonedDateTime` conversion support
- Likelihood for next version: **medium-high**
- Why:
  - There is a cluster of connector-focused work pointing to active investment in **CDC ingestion, schema inference, and temporal type handling**.

### REST catalog and OpenAPI expansion
- [#15180](https://github.com/apache/iceberg/pull/15180) — list/load function endpoints in OpenAPI spec
- [#13979](https://github.com/apache/iceberg/pull/13979) — send `referenced-by` to all endpoints
- Likelihood for next version: **medium**
- Why:
  - These changes strengthen the REST catalog contract and ecosystem tooling support.
  - Good signal for **catalog interoperability and view/function-aware metadata APIs**.

### Geospatial support
- [#14101](https://github.com/apache/iceberg/pull/14101) — geospatial predicates and bounding box literals
- Closed precursor: [#12667](https://github.com/apache/iceberg/pull/12667)
- Likelihood for next version: **medium**
- Why:
  - There is clear iterative progress, but this area appears long-running and spec-sensitive.
  - More likely to land incrementally than all at once.

## 6. User Feedback Summary

Today’s user-visible pain points are concentrated in a few recurring categories:

- **Migration friction**
  - Hive-to-Iceberg migration remains sensitive to **partition edge cases**, especially null partitions.
  - Users want migration commands to be safe for real legacy warehouse layouts.

- **Operational maintenance under concurrency**
  - The stale-but-relevant [#13972](https://github.com/apache/iceberg/issues/13972) shows users still struggle with **compaction/rewrite procedures alongside streaming writes**.
  - This suggests demand for stronger guardrails, clearer docs, or more concurrency-tolerant maintenance procedures.

- **Streaming engine correctness**
  - Flink users care about both **job restart stability** ([#14079](https://github.com/apache/iceberg/issues/14079)) and **timestamp precision fidelity** ([#15475](https://github.com/apache/iceberg/pull/15475)).
  - Kafka Connect users are pushing for better **CDC semantics, type conversion, and table auto-creation correctness**.

- **Configuration predictability**
  - The prefix/regex bug shows users hit issues when APIs behave unexpectedly at the utility layer.
  - These are frustrating because they often manifest as **silent misconfiguration**, not obvious exceptions.

- **Advanced analytical use cases are expanding**
  - Geospatial PRs indicate some users are trying to use Iceberg beyond standard tabular ETL, pushing toward **spatially aware analytics and predicate support**.

Overall sentiment from the data suggests users are satisfied with Iceberg’s breadth, but they are increasingly demanding **production-grade edge-case handling** across connectors, maintenance procedures, and metadata APIs.

## 7. Backlog Watch

These older or unresolved items look important and may need maintainer attention:

- [#14101](https://github.com/apache/iceberg/pull/14101) — **Geospatial predicates and bounding box literals**
  - Long-lived, strategic feature area.
  - Important for roadmap clarity: either push forward or scope follow-up work explicitly.

- [#13979](https://github.com/apache/iceberg/pull/13979) — **REST/SPARK: send `referenced-by` to all endpoints**
  - Cross-cutting spec/API work with implications for views and lineage-like context.
  - Needs clear maintainer direction due to breadth.

- [#14797](https://github.com/apache/iceberg/pull/14797) — **Kafka Connect delta writer support in DV mode**
  - Significant connector feature with operational relevance.
  - Its age suggests complexity or review bandwidth constraints.

- [#15079](https://github.com/apache/iceberg/pull/15079) and [#15632](https://github.com/apache/iceberg/pull/15632) — **Competing fixes for `rewrite_position_delete_files`**
  - Maintainers may need to converge quickly to avoid duplicate effort and user confusion.

- [#14079](https://github.com/apache/iceberg/issues/14079) — **Flink initializing hang**
  - Old but still active today; likely deserves investigation due to production impact.

- [#15332](https://github.com/apache/iceberg/issues/15332) — **Hive migration null partition bug**
  - High-value bug affecting migration adoption.
  - A good candidate for prioritization because migration success directly influences Iceberg expansion.

## 8. Linked Items Referenced

### Issues
- [#15631](https://github.com/apache/iceberg/issues/15631) — `propertiesWithPrefix` regex bug
- [#15332](https://github.com/apache/iceberg/issues/15332) — Hive migration null partitions
- [#15347](https://github.com/apache/iceberg/issues/15347) — multi-column stats disabling
- [#14079](https://github.com/apache/iceberg/issues/14079) — Flink stuck initializing
- [#13972](https://github.com/apache/iceberg/issues/13972) — rewrite_data_files with concurrent streaming writes

### Pull Requests
- [#15558](https://github.com/apache/iceberg/pull/15558) — fix `propertiesWithPrefix`
- [#15632](https://github.com/apache/iceberg/pull/15632) — fix rewrite_position_delete_files with array/map columns
- [#15079](https://github.com/apache/iceberg/pull/15079) — earlier fix for same rewrite_position_delete_files issue
- [#15475](https://github.com/apache/iceberg/pull/15475) — Flink nanosecond precision
- [#15566](https://github.com/apache/iceberg/pull/15566) — configurable post-commit maintenance tasks
- [#15615](https://github.com/apache/iceberg/pull/15615) — Kafka Connect auto-create identifier fields
- [#14797](https://github.com/apache/iceberg/pull/14797) — Kafka Connect delta writer / DV mode
- [#15027](https://github.com/apache/iceberg/pull/15027) — ZonedDateTime conversion
- [#15180](https://github.com/apache/iceberg/pull/15180) — OpenAPI function endpoints
- [#13979](https://github.com/apache/iceberg/pull/13979) — send `referenced-by`
- [#14101](https://github.com/apache/iceberg/pull/14101) — geospatial predicates
- [#12667](https://github.com/apache/iceberg/pull/12667) — geospatial bounding box types
- [#15607](https://github.com/apache/iceberg/pull/15607) — Avro security update
- [#14166](https://github.com/apache/iceberg/pull/14166) — refs-only metadata refresh
- [#15227](https://github.com/apache/iceberg/pull/15227) — Spark flaky test fix
- [#15230](https://github.com/apache/iceberg/pull/15230) — Parquet delete writer docs
- [#15300](https://github.com/apache/iceberg/pull/15300) — BigQuery rename table
- [#15047](https://github.com/apache/iceberg/pull/15047) — Flink Parquet merge rewrite support

### Bottom line
Iceberg remains **active and healthy**, with today’s signal dominated by **correctness fixes, connector maturation, and metadata/API evolution** rather than release packaging. The most urgent themes are **core config correctness, migration edge cases, Flink runtime behavior, and connector production readiness**.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-15

## 1. Today's Overview

Delta Lake showed light but meaningful activity over the last 24 hours: **2 issues updated** and **3 pull requests updated**, with **no releases** published. The main technical theme is a **query-correctness and metadata pruning fix** in Delta Kernel/Java around **case-insensitive column resolution for data skipping**, which aligns with Delta protocol semantics. In parallel, ongoing PR activity suggests maintainers and contributors are still investing in **catalog/session integration work** and **temporary CI scaffolding** for broader platform support. Overall, project health looks **steady but relatively quiet**, with more emphasis on incremental correctness and infrastructure work than on major feature delivery today.

## 3. Project Progress

There were **no merged or closed PRs in the last 24 hours**, so no completed changes landed today.

Still, the active PR set gives useful progress signals:

- **Case-insensitive data skipping fix in Java Kernel**  
  PR: [#6284](https://github.com/delta-io/delta/pull/6284)  
  This appears to address a correctness gap where Java Kernel data skipping used **case-sensitive column matching**, conflicting with Delta’s protocol expectation that column names are effectively case-insensitive for uniqueness and resolution. If merged, this would improve **storage pruning correctness** and reduce missed optimizations or incorrect predicate matching in non-Spark/Kernel paths.

- **Temporary UC-main CI test setup**  
  PR: [#6233](https://github.com/delta-io/delta/pull/6233)  
  This is primarily **test/infra work**, but it may be a prerequisite for stabilizing integration coverage tied to Unity Catalog-related or catalog-layer changes. Such PRs usually indicate maintainers are preparing the ground for larger functional changes.

- **Extend stagingCatalog for non-Spark session catalog**  
  PR: [#6166](https://github.com/delta-io/delta/pull/6166)  
  This is the strongest roadmap signal in the current PR queue. It points to ongoing work on **catalog abstraction and compatibility**, potentially improving Delta’s behavior in environments that do not rely on the default Spark session catalog. That matters for **SQL compatibility**, **engine integration**, and **multi-catalog deployments**.

## 4. Community Hot Topics

### 1) Java Kernel data skipping uses case-sensitive column matching
- Issue: [#6247](https://github.com/delta-io/delta/issues/6247)
- PR: [#6284](https://github.com/delta-io/delta/pull/6284)

This is the clearest hot topic today because it has both an active bug report and a same-week fix PR. The issue describes a mismatch between **Delta protocol behavior** and **Java Kernel implementation**: Delta column names should be resolved without case sensitivity, but the data skipping path apparently does not do that today. The underlying technical need is straightforward but important: **consistent schema resolution semantics across engines and APIs**. For an analytical storage layer, inconsistent case handling can lead to incorrect filter pushdown/data skipping behavior, especially in mixed-language or mixed-engine deployments.

### 2) Delta Lake TSC membership visibility
- Issue: [#6219](https://github.com/delta-io/delta/issues/6219)

This is not a product feature issue, but it is a meaningful **governance and transparency** topic. A user is asking where the current Delta Lake Technical Steering Committee membership is listed. The lack of comments suggests it has not yet drawn broad discussion, but the question points to a real community need: **clear project governance documentation**. For enterprise adopters of open data infrastructure, visible governance can influence trust, roadmap predictability, and contribution willingness.

### 3) Catalog integration and CI support
- PR: [#6166](https://github.com/delta-io/delta/pull/6166)
- PR: [#6233](https://github.com/delta-io/delta/pull/6233)

These are less publicly discussed in comments, but strategically important. Together they suggest contributors are working through **catalog-layer semantics** and **test environment setup**, likely to support more robust interoperability. The technical need here is **compatibility across deployment contexts**, especially where Spark session catalog assumptions are insufficient.

## 5. Bugs & Stability

Ranked by apparent severity from the available data:

### High: Case-sensitivity bug in Java Kernel data skipping
- Issue: [#6247](https://github.com/delta-io/delta/issues/6247)
- Fix PR: [#6284](https://github.com/delta-io/delta/pull/6284)

**Why it matters:**  
This appears to be a **query-planning/storage-pruning correctness issue**, not just a cosmetic inconsistency. If predicate columns are matched case-sensitively in the data skipping path, Delta may fail to skip files correctly or behave inconsistently with protocol expectations and Spark behavior. In analytical engines, that can mean:
- incorrect or degraded pruning,
- avoidable performance regressions,
- divergent behavior across Spark vs Kernel consumers.

**Current status:**  
A fix PR already exists, which is a strong positive signal for responsiveness.

### Low: No new crashes or severe regressions surfaced in today’s issue set
Only two issues were updated, and the other one was governance-related rather than operational. Based on this snapshot, there were **no newly surfaced reports today of data corruption, transaction protocol breakage, severe runtime crashes, or major SQL regressions**.

## 6. Feature Requests & Roadmap Signals

There are **no explicit new end-user feature requests** in this 24-hour slice such as new SQL functions, connectors, or format support. However, the active PRs provide roadmap signals:

### Likely near-term themes

- **Cross-catalog compatibility / non-default catalog support**  
  PR: [#6166](https://github.com/delta-io/delta/pull/6166)  
  This suggests Delta maintainers are still improving behavior in environments beyond the default Spark session catalog. That could eventually surface as improved support for **heterogeneous catalog deployments**, which is highly relevant for enterprise lakehouse architectures.

- **More robust integration/CI coverage for catalog-related changes**  
  PR: [#6233](https://github.com/delta-io/delta/pull/6233)  
  Temporary CI setup PRs often precede broader functional rollout. This is not user-visible by itself, but it raises confidence that adjacent catalog features may land later with better validation.

- **Protocol/engine semantic consistency in Delta Kernel**  
  Issue: [#6247](https://github.com/delta-io/delta/issues/6247)  
  PR: [#6284](https://github.com/delta-io/delta/pull/6284)  
  Expect continued attention to making **Delta Kernel behavior match Spark and protocol semantics**, especially around schema resolution and pruning logic.

### Prediction
If these PRs progress, the next release is more likely to include:
1. **correctness fixes in Kernel/Java paths**, and  
2. **catalog/session compatibility improvements**,  
than major new SQL-facing features.

## 7. User Feedback Summary

Today’s user-visible pain points are narrow but informative:

- **Consistency across engines matters.**  
  The case-sensitivity bug report shows users expect Delta semantics to remain consistent whether they access tables through Spark or Java Kernel. This is especially important for teams building **embedded readers, connectors, or custom query engines** on top of Delta.

- **Governance discoverability matters for adopters.**  
  The TSC membership question in [#6219](https://github.com/delta-io/delta/issues/6219) reflects a real adoption concern: organizations evaluating critical data infrastructure want to understand **who governs the project** and how decisions are made.

- **Integration complexity remains a theme.**  
  The open catalog-related PRs suggest users or contributors are operating in environments where the default Spark catalog model is not enough. That aligns with broader industry demand for **multi-engine, multi-catalog interoperability**.

No strong positive/negative sentiment trends are visible from reactions or comment volume in this dataset; activity is too light for that.

## 8. Backlog Watch

### PR needing maintainer attention: non-Spark session catalog support
- PR: [#6166](https://github.com/delta-io/delta/pull/6166)
- Created: 2026-03-02
- Updated: 2026-03-14

This is the oldest active PR in the provided set and appears strategically important. Because it touches **stagingCatalog behavior for non-Spark session catalog**, it may affect compatibility and internal semantics. It likely deserves close maintainer review due to its potential architectural impact.

### Follow-on infra PR tied to larger stack
- PR: [#6233](https://github.com/delta-io/delta/pull/6233)
- Created: 2026-03-10
- Updated: 2026-03-14

The PR is marked as a **stacked PR**, which means progress may depend on upstream review sequence. These can stall if maintainers do not actively shepherd them. Since it appears CI-related and likely unblocks adjacent work, it is worth watching.

### Governance question unanswered
- Issue: [#6219](https://github.com/delta-io/delta/issues/6219)
- Created: 2026-03-09
- Updated: 2026-03-14

This is not technically urgent, but it is a **community trust/documentation gap** and currently has **0 comments**. It would benefit from a maintainer response, even if the answer is simply to point to the charter or add a documentation page.

### Bug likely to move quickly, but worth tracking until merged
- Issue: [#6247](https://github.com/delta-io/delta/issues/6247)
- PR: [#6284](https://github.com/delta-io/delta/pull/6284)

Because a fix PR already exists, this looks healthy. Still, until merged, it remains an open correctness concern in Delta Kernel.

## Overall Health Signal

**Status: Stable, low-volume, technically focused.**  
Today’s snapshot shows no release activity and no merged changes, but the work in flight is aligned with core Delta priorities: **correctness, interoperability, and infrastructure readiness**. The most important actionable item is the **case-insensitive data skipping fix**, while the strongest roadmap signal is continued investment in **catalog compatibility beyond default Spark assumptions**.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-15

## 1. Today's Overview

Databend showed light but meaningful development activity over the last 24 hours, with **7 pull requests updated**, **2 closed**, and **no issue traffic or releases**. The current signal is therefore driven almost entirely by ongoing engineering work rather than user-reported incidents or release delivery. The active PR set centers on **query execution/planner refactoring, SQL correctness, test infrastructure, and experimental table metadata features**, which suggests continued investment in internal engine quality and feature maturation. Overall project health appears **stable and forward-moving**, though the absence of issue activity limits visibility into external user pain points today.

## 2. Project Progress

### Merged/closed PRs today

#### 1) Planner correctness for correlated scalar subqueries with `LIMIT`
- **PR:** [#19532](https://github.com/databendlabs/databend/pull/19532) — `fix(planner): decorrelate correlated scalar subquery limit (#13716)`
- **Status:** Closed
- **Technical impact:** Advances SQL compatibility and query correctness in a historically tricky area: **correlated scalar subqueries combined with `LIMIT` or `ORDER BY ... LIMIT`**.
- **What changed:** The fix decorrelates such subqueries into **partitioned `row_number()` filtering**, while also rejecting unsupported scalar subqueries when aggregation semantics cannot be safely preserved.
- **Why it matters:** This improves standards-aligned behavior and reduces risk of incorrect results in complex analytical SQL, especially BI-style queries and ORM-generated SQL patterns.

#### 2) Planner consistency improvements for column reference handling
- **PR:** [#19523](https://github.com/databendlabs/databend/pull/19523) — `refactor(planner): improve consistency of column references and rewrites`
- **Status:** Closed
- **Technical impact:** Strengthens planner internals by making **column references more stable and consistent across binding, semantic analysis, optimization, and rewrite stages**.
- **What changed:** Rewrites are being shifted to rely on more stable column identity handling rather than potentially fragile intermediate forms.
- **Why it matters:** Although framed as a refactor, this is foundational work for **query correctness, maintainability, and future optimizer evolution**. It likely reduces subtle rewrite bugs and makes subsequent planner features easier to implement safely.

### Other notable in-flight work

#### Experimental FUSE snapshot table tags
- **PR:** [#19549](https://github.com/databendlabs/databend/pull/19549) — `feat(query): support experimental table tags for FUSE table snapshots`
- Introduces a **new KV-backed table tag model** rather than reusing legacy table-ref branch/tag machinery.
- This is a notable roadmap signal toward richer **snapshot/version navigation semantics** for FUSE tables, potentially useful for reproducibility, rollback workflows, and data lifecycle management.

#### Recursive CTE execution becoming more streaming-oriented
- **PR:** [#19545](https://github.com/databendlabs/databend/pull/19545) — `refactor: make Recursive CTE execution more streaming-oriented`
- Indicates active work on **recursive SQL execution scalability**, likely reducing memory pressure and improving execution behavior for iterative graph/tree-style workloads.

#### SQL optimizer replay and lighter-weight harness support
- **PR:** [#19542](https://github.com/databendlabs/databend/pull/19542) — `refactor(sql): share optimizer replay support and add lite harness`
- Improves **testability and regression reproduction** in the SQL/optimizer layer, a good sign for engineering rigor.

#### Metadata dependency consolidation
- **PR:** [#19513](https://github.com/databendlabs/databend/pull/19513) — `chore: upgrade databend-meta to v260304.0.0 and consolidate dependencies`
- Suggests ongoing internal cleanup around the **meta service/client dependency surface**, which can help reduce maintenance complexity.

#### Fix for large `IN`-list predicate expansion
- **PR:** [#19546](https://github.com/databendlabs/databend/pull/19546) — `fix: flatten IN-list OR predicates`
- Targets **stack overflow risk** when large `IN` lists are expanded under high `max_inlist_to_or` settings, while preserving `NULL` semantics.
- This is an important pending stability fix for query normalization/planning.

## 3. Community Hot Topics

There were **no issues updated** and the provided PR metadata shows **no visible comment/reaction concentration** today, so “hot topics” are inferred from technical significance rather than social engagement.

### Most technically significant active PRs

#### Experimental snapshot tags for FUSE
- **Link:** [#19549](https://github.com/databendlabs/databend/pull/19549)
- **Underlying need:** Users increasingly want **named references over table snapshots**, similar to lightweight data versioning or reproducible checkpointing. The move to a dedicated KV-backed model suggests the old branch/tag abstraction was not ideal for this use case.

#### Streaming-oriented Recursive CTE execution
- **Link:** [#19545](https://github.com/databendlabs/databend/pull/19545)
- **Underlying need:** Recursive SQL can be memory-intensive and execution-order sensitive. A more streaming-oriented design points to demand for **better support for recursive analytical queries**, including path traversal, hierarchy expansion, and benchmark/problem queries such as Sudoku-style recursion.

#### `IN`-list expansion stability and semantics
- **Link:** [#19546](https://github.com/databendlabs/databend/pull/19546)
- **Underlying need:** Users likely hit edge cases where large predicate lists create **planner blow-up, stack overflow, or semantic drift**. This PR addresses both engine robustness and SQL correctness.

#### Optimizer replay/test harness sharing
- **Link:** [#19542](https://github.com/databendlabs/databend/pull/19542)
- **Underlying need:** Faster and more reproducible diagnosis of optimizer regressions. This usually reflects a maturing codebase where **test infrastructure becomes critical to sustaining development velocity**.

## 4. Bugs & Stability

With **no new issues reported today**, the main stability signals come from bug-fix PRs.

### Ranked by severity

#### High severity: potential stack overflow in large `IN`-list rewrites
- **PR:** [#19546](https://github.com/databendlabs/databend/pull/19546)
- **Risk:** Can cause **planner/execution crashes or failures** when large `IN` lists are rewritten into deep `OR` trees under high configuration thresholds.
- **Status:** Open
- **Assessment:** Highest immediate stability concern in the current PR set because it can produce hard failures rather than just incorrect optimization.

#### High severity: incorrect handling of correlated scalar subqueries with `LIMIT`
- **PR:** [#19532](https://github.com/databendlabs/databend/pull/19532)
- **Risk:** **Query correctness issue** for scalar correlated subqueries involving `LIMIT` and `ORDER BY ... LIMIT`.
- **Status:** Closed
- **Assessment:** Important SQL semantics fix; likely reduces risk of wrong answers in advanced analytical queries.

#### Medium severity: fragile planner rewrite behavior due to inconsistent column references
- **PR:** [#19523](https://github.com/databendlabs/databend/pull/19523)
- **Risk:** Refactor-oriented, but addresses a class of **latent optimizer/planner bugs** caused by inconsistent internal column identity propagation.
- **Status:** Closed
- **Assessment:** More preventative than user-visible, but strategically important for engine stability.

### Stability trend
Today’s PR activity suggests Databend is actively hardening:
- planner rewrite correctness,
- SQL edge-case compatibility,
- test reproducibility,
- and metadata/model cleanliness.

That is a positive maintenance profile even without issue traffic.

## 5. Feature Requests & Roadmap Signals

No new issues means no explicit fresh user feature requests today, but several PRs provide strong roadmap hints.

### Likely near-term feature directions

#### 1) Snapshot/table tag semantics for FUSE tables
- **Signal:** [#19549](https://github.com/databendlabs/databend/pull/19549)
- **Prediction:** Experimental **table tags** are a strong candidate to appear in an upcoming version behind an experimental flag. This would expand Databend’s time-travel/versioned-table ergonomics.

#### 2) Better Recursive CTE support
- **Signal:** [#19545](https://github.com/databendlabs/databend/pull/19545)
- **Prediction:** Recursive SQL execution is receiving architectural attention, suggesting Databend wants to improve support for **complex recursive analytical workloads** and reduce limitations in current execution behavior.

#### 3) More reliable optimizer diagnostics
- **Signal:** [#19542](https://github.com/databendlabs/databend/pull/19542)
- **Prediction:** Not a user-facing feature directly, but likely to accelerate future delivery of planner-related features by making optimizer regressions easier to reproduce and fix.

#### 4) Continued metadata/service consolidation
- **Signal:** [#19513](https://github.com/databendlabs/databend/pull/19513)
- **Prediction:** This may precede broader simplification in the meta stack and dependency boundaries, which can indirectly improve operability and release cadence.

## 6. User Feedback Summary

There is **no direct user feedback visible** in today’s dataset: no updated issues, and no PRs with notable reactions/comments captured. As a result, current user sentiment must be inferred from the engineering work underway.

### Inferred user pain points from active work
- **SQL correctness in edge cases** remains important, especially around correlated subqueries and large predicate rewrites.
- **Performance and memory behavior** for recursive queries appears to be a practical concern.
- **Versioned/snapshot table workflows** may be increasingly relevant for users working with FUSE-based lakehouse-style data management.
- **Reliability of planner behavior** continues to be a priority, indicating demand for stronger compatibility with sophisticated analytical SQL.

### Satisfaction signals
- No new issue activity can be read as a neutral-to-positive short-term signal, though not strong evidence by itself.
- The engineering focus looks disciplined and infrastructure-aware rather than reactive, which typically reflects a project in a relatively stable state.

## 7. Backlog Watch

Because there are **no active issues** in the supplied data, backlog risk is concentrated in open PRs that appear strategically important.

### PRs needing maintainer attention

#### `fix: flatten IN-list OR predicates`
- **Link:** [#19546](https://github.com/databendlabs/databend/pull/19546)
- **Why watch it:** Addresses a potentially severe stack overflow path and should likely be prioritized if validation is complete.

#### `feat(query): support experimental table tags for FUSE table snapshots`
- **Link:** [#19549](https://github.com/databendlabs/databend/pull/19549)
- **Why watch it:** Significant feature work with architectural implications; experimental status suggests a need for careful review around metadata semantics and compatibility.

#### `refactor: make Recursive CTE execution more streaming-oriented`
- **Link:** [#19545](https://github.com/databendlabs/databend/pull/19545)
- **Why watch it:** Performance-sensitive execution changes can be high impact and high risk; merits close maintainer review and targeted benchmarking.

#### `refactor(sql): share optimizer replay support and add lite harness`
- **Link:** [#19542](https://github.com/databendlabs/databend/pull/19542)
- **Why watch it:** Valuable enabler for regression control; landing this could improve quality across future planner work.

#### `chore: upgrade databend-meta to v260304.0.0 and consolidate dependencies`
- **Link:** [#19513](https://github.com/databendlabs/databend/pull/19513)
- **Why watch it:** Dependency consolidations often have broad ripple effects despite “chore” labeling.

## Overall Health Assessment

Databend appears **healthy and actively maintained**, with today’s work emphasizing **planner correctness, SQL semantics, recursive execution, metadata evolution, and testing infrastructure**. There is no sign of issue-driven firefighting or release pressure in the provided window. The strongest positive signal is that the project is spending effort on both **deep engine internals** and **user-relevant SQL behavior**, which is typically how analytical database projects mature sustainably.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-15

## 1. Today's Overview

Velox showed **healthy PR-driven activity** over the last 24 hours, with **27 pull requests updated**, **4 merged/closed**, and **no issue activity** or releases. The work mix is notable: it spans **query engine features**, **GPU/cuDF enablement**, **remote/RPC execution plumbing**, **storage I/O optimizations**, **Parquet/Iceberg interoperability**, and **CI/build efficiency**. The absence of new issues suggests no obvious surge of newly reported regressions today, though that can also mean discussion is happening primarily in PRs rather than issue threads. Overall, project health looks **active and forward-moving**, with several changes targeting performance, SQL coverage, and infrastructure maturity.

---

## 3. Project Progress

### Merged/closed PRs today

#### 1) Re-added `dot_product` UDF with test correction
- [PR #16740](https://github.com/facebookincubator/velox/pull/16740) — **CLOSED/MERGED** — *feat: Re-add dot_product UDF with test fix*
- Impact:
  - Advances **SQL/UDF coverage** by restoring a previously removed analytical function.
  - Current scope is primarily **integer array support**; float/double registration is handled separately.
  - This is relevant for vector analytics and ML-adjacent SQL workloads where dot product is a common primitive.

#### 2) Website/docs refresh for VeloxCon 2026
- [PR #16754](https://github.com/facebookincubator/velox/pull/16754) — **CLOSED/MERGED** — *docs: Update veloxcon banner on velox-lib.io*
- Impact:
  - Not engine-facing, but indicates active community/events momentum.
  - Also triggered a follow-up lint cleanup PR, showing docs/site CI is enforced.

#### 3) CI optimization with test splitting and larger runners
- [PR #16691](https://github.com/facebookincubator/velox/pull/16691) — **CLOSED/MERGED** — *build: Optimize CI with test splitting and 32-core runner*
- Impact:
  - Important infrastructure improvement for a large C++ analytical engine.
  - Speeds validation cycles by:
    - splitting monolithic test targets,
    - increasing runner capacity,
    - tuning parallelism.
  - This should reduce PR turnaround time and improve signal quality for contributors.

#### 4) Iceberg statistics collection landed
- [PR #16062](https://github.com/facebookincubator/velox/pull/16062) — **CLOSED/MERGED** — *feat: Collect Iceberg stats*
- Impact:
  - A meaningful **table-format and metadata capability** improvement.
  - Adds collection of:
    - record counts,
    - column sizes,
    - value/null/NaN counts.
  - This strengthens Velox’s positioning in modern lakehouse ecosystems where **Iceberg metadata** matters for optimization and observability.

### What this says about project direction
Today's merged work points to three clear priorities:
1. **Broader SQL/analytical function coverage** (`dot_product`)
2. **Faster engineering velocity** through CI improvements
3. **Deeper open table format support** via Iceberg statistics

---

## 4. Community Hot Topics

No issues were updated today, so the strongest signals come from open PRs. Comment counts/reactions were not populated in the dataset, so “hot topics” are inferred from recency, scope, and technical significance.

### Remote execution / RPC architecture
- [PR #16770](https://github.com/facebookincubator/velox/pull/16770) — *Serialize only active rows, add null/determinism support, improve errors*
- [PR #16727](https://github.com/facebookincubator/velox/pull/16727) — *feat(rpc): Add RPCNode plan node to core/PlanNode.h [2/8]*
- Why it matters:
  - These changes suggest active investment in **remote function execution** and **async RPC plan integration**.
  - The technical need is clear: reduce network overhead by serializing only selected rows, preserve correctness for nullability/determinism, and model RPC natively in the plan tree.
  - This points toward Velox being used in more **distributed, service-backed, or hybrid execution** environments.

### GPU/cuDF compatibility expansion
- [PR #16769](https://github.com/facebookincubator/velox/pull/16769) — *feat(cudf): Add config to set timestamp unit*
- [PR #16612](https://github.com/facebookincubator/velox/pull/16612) — *feat(cudf): GPU Decimal (Part 1 of 3)*
- [PR #16253](https://github.com/facebookincubator/velox/pull/16253) — *feat(prestosql): Add ceil(DECIMAL) PrestoSQL function*
- Why it matters:
  - The underlying need is stronger **CPU/GPU semantic parity**, especially around **timestamp units**, **time zone behavior**, and **DECIMAL handling**.
  - This is a classic pain point when aligning Spark, Presto, Arrow, and cuDF data models.

### Storage and reader efficiency
- [PR #16768](https://github.com/facebookincubator/velox/pull/16768) — *Add native preload support to DirectBufferedInput and CachedBufferedInput*
- [PR #16611](https://github.com/facebookincubator/velox/pull/16611) — *feat(parquet): Add type widening support for INT→Decimal and Decimal→Decimal*
- Why it matters:
  - These address practical reader-side needs:
    - lower I/O overhead for small DWRF files,
    - tolerate schema evolution in Parquet, especially for Spark 4.0 compatibility.
  - This reflects user demand for **real-world lakehouse interoperability and performance** rather than purely synthetic benchmarks.

### CI/build throughput and repository hygiene
- [PR #16767](https://github.com/facebookincubator/velox/pull/16767) — *build: Optimize fuzzer artifact upload/download in scheduled.yml*
- [PR #16773](https://github.com/facebookincubator/velox/pull/16773) — *fix: Build pre-commit lint issues in website files*
- [PR #16771](https://github.com/facebookincubator/velox/pull/16771) — *Break LimitTest to test CI test discovery*
- Why it matters:
  - Maintainers are actively tuning **CI observability and efficiency**, which is especially important for a large native codebase with many tests and fuzzers.
  - The intentional test-break PR is a strong signal that maintainers are validating failure reporting quality, not just test pass/fail.

---

## 5. Bugs & Stability

No new issues were reported today, so there is **no fresh bug intake** to rank from issue data. Still, several PRs indicate ongoing stability and correctness work.

### Higher-severity / correctness-relevant work

#### 1) Remote execution correctness gaps
- [PR #16770](https://github.com/facebookincubator/velox/pull/16770)
- Severity: **High**
- Signals:
  - Adds support for serializing only active rows.
  - Addresses **null handling**, **determinism semantics**, and **error quality**.
- Why important:
  - Any bug here can directly affect **query correctness** in remote UDF/RPC execution paths.

#### 2) Schema evolution correctness in Parquet
- [PR #16611](https://github.com/facebookincubator/velox/pull/16611)
- Severity: **High**
- Signals:
  - Adds type widening for `INT→Decimal` and `Decimal→Decimal`.
- Why important:
  - Schema evolution mismatches can cause read failures or silent type incompatibilities in production data lakes.

#### 3) Timestamp semantic mismatch across engines
- [PR #16769](https://github.com/facebookincubator/velox/pull/16769)
- Severity: **Medium-High**
- Signals:
  - Spark uses microseconds and timezone-aware semantics; Presto uses nanoseconds and different conventions.
- Why important:
  - Timestamp mismatches are a common source of subtle cross-engine correctness bugs.

### Lower-severity / reliability polish

#### 4) Minor memory/allocation code cleanup
- [PR #16717](https://github.com/facebookincubator/velox/pull/16717)
- Severity: **Low**
- Signals:
  - Removes a redundant prefix increment in `StreamArena`.
- Why important:
  - Small but good hygiene in core systems code.

#### 5) CI reliability validation
- [PR #16771](https://github.com/facebookincubator/velox/pull/16771)
- Severity: **Operational only**
- Signals:
  - Intentional test break to verify GitHub CI test discovery.
- Why important:
  - Not a product bug, but relevant for confidence in failure detection.

---

## 6. Feature Requests & Roadmap Signals

Even without new issues, the active PR queue gives strong roadmap clues.

### Likely near-term features

#### RPC-native execution support
- [PR #16727](https://github.com/facebookincubator/velox/pull/16727)
- [PR #16770](https://github.com/facebookincubator/velox/pull/16770)
- Prediction:
  - Expect more work around **remote function execution**, **RPC plan nodes**, and **distributed async integration** in upcoming versions.

#### Expanded GPU/cuDF support
- [PR #16612](https://github.com/facebookincubator/velox/pull/16612)
- [PR #16769](https://github.com/facebookincubator/velox/pull/16769)
- [PR #16253](https://github.com/facebookincubator/velox/pull/16253)
- Prediction:
  - **GPU Decimal support** looks like a meaningful roadmap item.
  - Expect continued convergence between **Velox CPU semantics**, **cuDF**, and **Arrow/NanoArrow** bridges.

#### Better lakehouse interoperability
- [PR #16611](https://github.com/facebookincubator/velox/pull/16611)
- [PR #16062](https://github.com/facebookincubator/velox/pull/16062)
- Prediction:
  - More work is likely on **Parquet schema evolution**, **Iceberg metadata/stats**, and possibly downstream optimizer integration that consumes those stats.

#### More SQL compatibility coverage
- [PR #16253](https://github.com/facebookincubator/velox/pull/16253)
- [PR #16740](https://github.com/facebookincubator/velox/pull/16740)
- Prediction:
  - Velox will likely keep filling in **PrestoSQL-compatible function gaps**, especially around DECIMAL and analytical/math UDFs.

---

## 7. User Feedback Summary

There were no updated issues today, so there is **no direct user-reported feedback sample** in the provided dataset. Indirectly, the PR stream suggests several concrete user pain points:

### Inferred user pain points

1. **Cross-engine type/timestamp mismatches**
   - [PR #16769](https://github.com/facebookincubator/velox/pull/16769)
   - [PR #16611](https://github.com/facebookincubator/velox/pull/16611)
   - Users need Velox to behave consistently with Spark/Presto/lakehouse schemas.

2. **Incomplete SQL/function parity**
   - [PR #16253](https://github.com/facebookincubator/velox/pull/16253)
   - [PR #16740](https://github.com/facebookincubator/velox/pull/16740)
   - Missing functions and DECIMAL semantics remain important adoption blockers.

3. **Efficiency for production-scale remote execution**
   - [PR #16770](https://github.com/facebookincubator/velox/pull/16770)
   - Users likely want lower network overhead and better diagnostics in remote UDF or RPC-backed execution.

4. **I/O efficiency on small files**
   - [PR #16768](https://github.com/facebookincubator/velox/pull/16768)
   - Indicates practical concern with metadata + stripe read overhead for small DWRF workloads.

### Satisfaction signals
- The volume of work in interoperability and performance areas is a positive sign.
- CI optimization work suggests maintainers are investing in contributor and release quality experience, not just feature delivery.

---

## 8. Backlog Watch

These older open PRs appear strategically important and may need maintainer attention due to scope, age, or ecosystem impact.

### High-value open PRs to watch

#### 1) PrestoSQL `ceil(DECIMAL)` support
- [PR #16253](https://github.com/facebookincubator/velox/pull/16253)
- Status: Open, marked `ready-to-merge`
- Why it matters:
  - Straightforward SQL compatibility improvement with clear user value.
  - Being ready-to-merge but still open suggests it may just need final maintainer action.

#### 2) GPU Decimal support, part 1
- [PR #16612](https://github.com/facebookincubator/velox/pull/16612)
- Why it matters:
  - Foundational for broader GPU arithmetic/type parity.
  - Multi-part chained work can stall if early pieces are not reviewed promptly.

#### 3) Parquet type widening for schema evolution
- [PR #16611](https://github.com/facebookincubator/velox/pull/16611)
- Why it matters:
  - Strong compatibility value for Spark/lakehouse users.
  - High production relevance.

#### 4) Website dependency updates
- [PR #16342](https://github.com/facebookincubator/velox/pull/16342)
- [PR #16262](https://github.com/facebookincubator/velox/pull/16262)
- [PR #15880](https://github.com/facebookincubator/velox/pull/15880)
- Why it matters:
  - These are not engine-critical, but aging dependency bumps can accumulate security and maintenance risk.

#### 5) RPC plan node series
- [PR #16727](https://github.com/facebookincubator/velox/pull/16727)
- Why it matters:
  - Labeled `[2/8]`, implying a larger stacked series.
  - Important architectural work benefits from timely review to avoid long-lived divergence.

---

## Linked Items Referenced

- [PR #16773](https://github.com/facebookincubator/velox/pull/16773)
- [PR #16772](https://github.com/facebookincubator/velox/pull/16772)
- [PR #16770](https://github.com/facebookincubator/velox/pull/16770)
- [PR #16767](https://github.com/facebookincubator/velox/pull/16767)
- [PR #16740](https://github.com/facebookincubator/velox/pull/16740)
- [PR #16771](https://github.com/facebookincubator/velox/pull/16771)
- [PR #16769](https://github.com/facebookincubator/velox/pull/16769)
- [PR #16754](https://github.com/facebookincubator/velox/pull/16754)
- [PR #16342](https://github.com/facebookincubator/velox/pull/16342)
- [PR #16262](https://github.com/facebookincubator/velox/pull/16262)
- [PR #15880](https://github.com/facebookincubator/velox/pull/15880)
- [PR #16253](https://github.com/facebookincubator/velox/pull/16253)
- [PR #16717](https://github.com/facebookincubator/velox/pull/16717)
- [PR #16727](https://github.com/facebookincubator/velox/pull/16727)
- [PR #16768](https://github.com/facebookincubator/velox/pull/16768)
- [PR #16611](https://github.com/facebookincubator/velox/pull/16611)
- [PR #16764](https://github.com/facebookincubator/velox/pull/16764)
- [PR #16691](https://github.com/facebookincubator/velox/pull/16691)
- [PR #16612](https://github.com/facebookincubator/velox/pull/16612)
- [PR #16062](https://github.com/facebookincubator/velox/pull/16062)

If you want, I can also turn this into a **short executive summary**, a **maintainer-focused triage report**, or a **release-manager style changelog draft**.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

## Apache Gluten Project Digest — 2026-03-15

### 1. Today's Overview
Apache Gluten showed moderate day-to-day activity over the last 24 hours, with **3 active issues** and **8 pull requests updated**, including **3 PRs closed** and **5 still open**. The work pattern is mainly concentrated in the **Velox backend**, build/toolchain maintenance, and Spark compatibility fixes rather than end-user feature launches. No new release was published today, so the signal is more about **ongoing stabilization and integration work** than packaged delivery. Overall, the project appears technically active, with emphasis on upstream Velox tracking, macOS build reliability, and compatibility with evolving Spark internals.

### 2. Project Progress
Merged/closed PR activity today points mostly to backend robustness and maintenance progress:

- [#11697](https://github.com/apache/incubator-gluten/pull/11697) — **[VELOX] Cancel load earlier in `GlutenDirectBufferedInput` destructor**  
  This closed PR targets the Velox path and suggests progress on **resource lifecycle handling / I/O cancellation behavior**. Even without merge details, the change area is important for reducing wasted work and improving shutdown or cancellation responsiveness in scan/input paths.

- [#9530](https://github.com/apache/incubator-gluten/pull/9530) — **[BUILD] Add AWS EC2 benchmark docker file**  
  Closed as stale, but it indicates prior effort around **benchmark reproducibility on cloud x86 infrastructure**. Its closure means no immediate progress here, but the need remains relevant for performance validation.

- [#11428](https://github.com/apache/incubator-gluten/pull/11428) — **[CLICKHOUSE] Clang 19 or higher is required when build clickhouse**  
  Closed as stale. This reflects unresolved or superseded work in the **ClickHouse backend build toolchain**, especially compiler-version requirements.

Open PRs also show meaningful forward motion:
- [#11753](https://github.com/apache/incubator-gluten/pull/11753) fixes **AdaptiveSparkPlanExec accessibility** for columnar write optimization after a Spark-side change, signaling continued work on **Spark API compatibility**.
- [#11709](https://github.com/apache/incubator-gluten/pull/11709) adjusts **metrics accounting** in Velox-backed split loading, improving **observability correctness** on Spark UI.
- [#11762](https://github.com/apache/incubator-gluten/pull/11762) is the daily Velox version bump, showing the project remains tightly aligned with **upstream Velox evolution**.

### 3. Community Hot Topics
The most discussion-heavy and roadmap-relevant items are:

- [#11585](https://github.com/apache/incubator-gluten/issues/11585) — **[VL] useful Velox PRs not merged into upstream**  
  **16 comments, 4 reactions**  
  This is the most active issue in the snapshot. It acts as a coordination tracker for Velox changes useful to Gluten but not yet merged upstream. The underlying technical need is clear: Gluten depends heavily on upstream Velox, and unmerged PRs create friction in feature delivery, maintenance burden, and rebase cost. This issue is a strong signal that **upstream dependency management is a core operational concern** for the project.

- [#11622](https://github.com/apache/incubator-gluten/issues/11622) — **[VL] Support TIMESTAMP_NTZ Type**  
  **1 comment, 2 reactions**  
  This is a direct SQL type compatibility request. Support for `TIMESTAMP_NTZ` matters for Spark interoperability and reducing fallback to vanilla Spark execution. The issue includes staged tasks—config gating, basic type support, Substrait mapping—which suggests this is a **real implementation track**, not just a wishlist item.

- [#11753](https://github.com/apache/incubator-gluten/pull/11753) — **Fix AdaptiveSparkPlanExec accessibility in columnar write optimization**  
  Even without high comment volume, this is strategically important. It reflects a recurring challenge for Gluten: **Spark internal API changes can break execution rewrites and optimization hooks**, especially in adaptive execution paths.

- [#11563](https://github.com/apache/incubator-gluten/pull/11563) — **Enable VCPKG for macOS build**  
  This remains active and ties directly to current macOS build pain. It highlights continued demand for **more reliable, reproducible developer builds on macOS**.

### 4. Bugs & Stability
Ranked by likely severity and immediate user impact:

1. **macOS build break on branch-1.5 due to glog change**  
   - Issue: [#11763](https://github.com/apache/incubator-gluten/issues/11763)  
   - Severity: **High for developers / release branch users on macOS**  
   This is the clearest fresh regression reported today. The failure hits `branch-1.5` during Velox bundle build on macOS and is attributed to a breaking change in `glog`. This impacts build reproducibility and could block contributors or users trying to validate older Spark/branch combinations.  
   **Potential related fix path:** [#11563](https://github.com/apache/incubator-gluten/pull/11563) may help broader macOS dependency management, but no direct fix PR is cited yet.

2. **Spark compatibility regression in columnar write optimization**  
   - PR: [#11753](https://github.com/apache/incubator-gluten/pull/11753)  
   - Severity: **Medium to High**  
   The PR indicates Gluten’s optimization broke shuffle ID retrieval after upstream Spark changes. This is important because it affects integration correctness with adaptive planning and columnar write execution. A fix is already in progress.

3. **Metrics under-reporting / observability inconsistency in split loading**  
   - PR: [#11709](https://github.com/apache/incubator-gluten/pull/11709)  
   - Severity: **Medium**  
   This is not a query correctness bug, but it affects operational visibility. The PR explicitly notes a **breaking UI metric change**, with longer displayed “data source add split time total” due to inclusion of previously missing time. This is a reliability improvement in measurement, but users may perceive apparent regressions unless release notes explain it.

4. **I/O cancellation timing in buffered input destructor**  
   - PR: [#11697](https://github.com/apache/incubator-gluten/pull/11697)  
   - Severity: **Medium**  
   Earlier cancellation in destructors generally points to a cleanup/stability issue in resource management. This can matter under query cancellation, task teardown, or failure handling.

### 5. Feature Requests & Roadmap Signals
The strongest roadmap indicators from current issues and PRs are:

- [#11622](https://github.com/apache/incubator-gluten/issues/11622) — **Support `TIMESTAMP_NTZ` in Velox backend**  
  This is the clearest user-facing feature request. Because it already has a task breakdown and references related implementation work, it is a strong candidate for inclusion in an upcoming version. It would improve **Spark SQL type compatibility** and reduce fallback behavior.

- [#11585](https://github.com/apache/incubator-gluten/issues/11585) — **Tracking useful Velox PRs not yet upstreamed**  
  While not a feature itself, it strongly signals that upcoming Gluten capability may depend on **selective adoption of pending Velox changes**. Expect next-version behavior to be shaped by whichever upstream Velox patches become available or are locally carried.

- [#11762](https://github.com/apache/incubator-gluten/pull/11762) — **Daily Velox version update**  
  Frequent Velox syncs suggest continued investment in **query engine backend freshness**, likely bringing incremental operator fixes, metrics improvements, and execution behavior changes into Gluten.

- [#11563](https://github.com/apache/incubator-gluten/pull/11563) — **Enable VCPKG for macOS build**  
  This is more infra than feature, but it is a practical roadmap item for better **developer onboarding and cross-platform build consistency**.

**Prediction for next version:** the most likely visible additions are **improved Spark compatibility fixes**, **backend sync with newer Velox**, and possibly **initial `TIMESTAMP_NTZ` support** if the implementation progresses quickly.

### 6. User Feedback Summary
Current user/developer feedback clusters around a few concrete pain points:

- **Build friction on macOS remains significant**, especially around dependency/toolchain changes like `glog`.  
  Evidence: [#11763](https://github.com/apache/incubator-gluten/issues/11763), [#11563](https://github.com/apache/incubator-gluten/pull/11563)

- **Users care about SQL compatibility gaps**, particularly around modern Spark types such as `TIMESTAMP_NTZ`.  
  Evidence: [#11622](https://github.com/apache/incubator-gluten/issues/11622)

- **Performance/metrics users want more accurate accounting**, even if it changes UI-visible values.  
  Evidence: [#11709](https://github.com/apache/incubator-gluten/pull/11709)

- **Maintainers and advanced contributors are actively dealing with upstream Velox lag**, implying that some desired performance or engine features are blocked not by Gluten alone, but by dependency coordination.  
  Evidence: [#11585](https://github.com/apache/incubator-gluten/issues/11585)

There is little explicit positive end-user satisfaction feedback in today’s snapshot; the data is more maintenance- and engineering-centric than testimonial-driven.

### 7. Backlog Watch
Important older items that still appear to need maintainer attention:

- [#11585](https://github.com/apache/incubator-gluten/issues/11585) — **Tracker for useful Velox PRs not merged upstream**  
  This is strategically important and actively used. It should stay visible because unresolved upstream deltas can silently affect feature velocity and maintenance cost.

- [#11563](https://github.com/apache/incubator-gluten/pull/11563) — **Enable VCPKG for macOS build**  
  Open since **2026-02-04**. Given today’s macOS build failure report, this PR now looks more urgent than before.

- [#10573](https://github.com/apache/incubator-gluten/pull/10573) — **Avoid repeated calls to `identifiyBatchType`**  
  Open since **2025-08-28** and marked stale, but it claims performance improvement based on TPC-DS SF1000 benchmarking. This is exactly the type of **small but potentially meaningful execution-path optimization** that can get lost in backlog churn.

- [#11622](https://github.com/apache/incubator-gluten/issues/11622) — **Support TIMESTAMP_NTZ Type**  
  Not old enough to be neglected, but important enough to monitor closely because it addresses a clear compatibility gap.

### 8. Overall Health Assessment
Project health looks **steady but dependency-heavy**. Gluten is actively maintained, especially in its Velox integration layer, but current momentum is shaped more by **compatibility fixes, upstream synchronization, and build reliability** than by headline feature releases. The strongest risks visible today are **toolchain instability on macOS** and **breakage from external API/dependency changes** in Spark and Velox. The strongest positive signal is that the project continues to react quickly to these changes with targeted PRs and active tracking mechanisms.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-15

## 1. Today's Overview

Apache Arrow showed light-to-moderate maintenance activity over the last 24 hours: 18 issues were updated and 7 pull requests saw movement, but there were no merges and no new releases. The issue stream was dominated by stale-warning churn on older tickets, which makes the raw activity level look higher than the amount of net-new engineering progress. On the PR side, current work is concentrated in C++ and Parquet reliability, with fixes targeting CI flakiness, overflow/error handling, encryption support, and edge-case crash prevention. Overall project health looks stable, but today’s signal is more about backlog maintenance and robustness work than about major feature delivery.

## 2. Project Progress

No pull requests were merged or closed in the last 24 hours, so there is no completed feature advancement to report today.

That said, the active PR queue indicates where implementation effort is currently focused:

- **Windows/MinGW CI stability**: intermittent segfault mitigation in JSON tests  
  [PR #49462](https://github.com/apache/arrow/pull/49462)
- **Parquet write-path correctness**: overflow checking for dictionary encoder index counts  
  [PR #49513](https://github.com/apache/arrow/pull/49513)
- **C++ compute/runtime robustness**: better error handling during hash table merges  
  [PR #49512](https://github.com/apache/arrow/pull/49512)
- **Python API surface expansion**: wrapper for `VariableShapeTensor`  
  [PR #40354](https://github.com/apache/arrow/pull/40354)
- **Parquet encrypted metadata support**: reading encrypted bloom filters  
  [PR #49334](https://github.com/apache/arrow/pull/49334)
- **Dependency/toolchain modernization**: bundled Abseil / Protobuf / gRPC / google-cloud-cpp upgrades  
  [PR #48964](https://github.com/apache/arrow/pull/48964)
- **Gandiva crash fixes on extreme integer values**  
  [PR #49471](https://github.com/apache/arrow/pull/49471)

From an OLAP / analytical engine perspective, the strongest progress signals are in **Parquet correctness**, **cross-platform stability**, and **low-level C++ runtime safety**, all of which matter directly for production analytical workloads.

## 3. Community Hot Topics

### Most discussed updated issues

1. **Deep copy utility for Array / ArrayData** — 9 comments  
   [Issue #30503](https://github.com/apache/arrow/issues/30503)  
   This long-running C++/Python enhancement request asks for first-class deep-copy semantics for arrays. The technical need is clear: Arrow’s zero-copy design is powerful, but users building transformation pipelines, UDF frameworks, or interop layers still need safe ownership-isolating copies for sliced or nested structures. Even though the issue was closed via stale handling, the use case remains relevant for systems that mix Arrow memory with mutating downstream consumers.

2. **PREfast static analyzer fixes for C++** — 6 comments  
   [Issue #30531](https://github.com/apache/arrow/issues/30531)  
   This reflects ongoing demand for better MSVC/static-analysis cleanliness. For enterprise adopters on Windows, especially those embedding Arrow C++ in larger analytics stacks, analyzer hygiene is not cosmetic—it reduces friction in security/compliance-driven builds.

3. **Format inference in `StrptimeOptions`** — 5 comments  
   [Issue #31120](https://github.com/apache/arrow/issues/31120)  
   This C++/Python/R request is one of the clearest cross-language roadmap signals. Users want timestamp parsing that behaves more like pandas and lubridate, reducing ETL friction for messy source data. For analytical ingestion systems, this is a usability multiplier because timestamp parsing remains one of the highest-friction interoperability points.  
   Link: [Issue #31120](https://github.com/apache/arrow/issues/31120)

4. **R HTTPS filesystem access** — 5 comments  
   [Issue #18980](https://github.com/apache/arrow/issues/18980)  
   Although stale-closed, this request highlights continuing interest in range-request-capable HTTP(S) access for remote analytical datasets. This matters for lightweight data lake access patterns where full cloud object-store APIs are unnecessary or unavailable.

### Most strategically important active PRs

- **Encrypted bloom filter reads in Parquet**  
  [PR #49334](https://github.com/apache/arrow/pull/49334)  
  This is especially important for security-sensitive analytical environments adopting Parquet encryption while still relying on bloom-filter-assisted read optimization.

- **Bundled dependency upgrades with possible public API breaks**  
  [PR #48964](https://github.com/apache/arrow/pull/48964)  
  This may have broad downstream impact across Flight, cloud connectors, and C++ embedding scenarios.

- **Python wrapper for `VariableShapeTensor`**  
  [PR #40354](https://github.com/apache/arrow/pull/40354)  
  A notable bridge between core C++ tensor capabilities and Python ML/data workflows.

## 4. Bugs & Stability

Ranked by likely severity for production users:

### 1. Parquet dictionary encoder overflow handling
- **Bug/Fix PR:** [PR #49513](https://github.com/apache/arrow/pull/49513)
- **Related issue:** [Issue #49502](https://github.com/apache/arrow/issues/49502)  
- **Severity:** High  
- **Why it matters:** Missing overflow checks in dictionary encoder index counting can lead to incorrect page behavior under very large-memory writes. For large-scale Parquet generation in analytical pipelines, this is a correctness and reliability issue, not just a test failure.

### 2. Encrypted bloom filters unreadable in Parquet
- **Fix PR:** [PR #49334](https://github.com/apache/arrow/pull/49334)
- **Severity:** High  
- **Why it matters:** Failure to read encrypted bloom filters blocks compatibility with a subset of secure Parquet files. This impacts regulated deployments that need both encryption and predicate-pruning-related metadata.

### 3. Gandiva crashes on extreme integer values
- **Fix PR:** [PR #49471](https://github.com/apache/arrow/pull/49471)
- **Severity:** High  
- **Why it matters:** Reported crashes include SIGBUS and SIGSEGV in `substring_index` and `truncate` when given extreme integer parameters. This is a classic query-engine robustness issue: malformed or edge-case expressions should error cleanly, not crash the process.

### 4. Intermittent Windows MinGW segfault in JSON tests
- **Fix PR:** [PR #49462](https://github.com/apache/arrow/pull/49462)
- **Related issue:** [Issue #49272](https://github.com/apache/arrow/issues/49272)  
- **Severity:** Medium  
- **Why it matters:** This appears CI-facing rather than a confirmed end-user runtime bug, but flaky platform-specific crashes slow releases and reduce trust in cross-platform support.

### 5. Hash table merge error handling gaps
- **Fix PR:** [PR #49512](https://github.com/apache/arrow/pull/49512)
- **Related issue:** [Issue #32381](https://github.com/apache/arrow/issues/32381)  
- **Severity:** Medium  
- **Why it matters:** Hash table merges are foundational in aggregation/join-style internals. Better error propagation improves resilience for compute-heavy workloads.

### 6. NumPy conversion copy semantics bug in Python
- **Open issue:** [Issue #49384](https://github.com/apache/arrow/issues/49384)
- **Severity:** Medium  
- **Why it matters:** A single-chunk `ChunkedArray` reportedly ignores `copy=True` expectations in `__array__`, returning a non-writable NumPy array where a writable copy is expected. This is a subtle but real correctness/interop issue for Python users who mutate converted arrays.

## 5. Feature Requests & Roadmap Signals

### Strong signals

- **Timestamp format inference across C++, Python, and R**  
  [Issue #31120](https://github.com/apache/arrow/issues/31120)  
  This is one of the strongest user-facing enhancement signals today. Because it spans multiple language bindings and addresses common ingestion pain, it has a reasonable chance of landing in a future release if someone drives implementation.

- **Python support for `VariableShapeTensor`**  
  [PR #40354](https://github.com/apache/arrow/pull/40354)  
  This is a concrete in-flight feature and therefore one of the likeliest to appear in an upcoming version, assuming review bandwidth is available.

- **Parquet encrypted bloom filter support**  
  [PR #49334](https://github.com/apache/arrow/pull/49334)  
  This is both a compatibility feature and a storage-engine capability enhancement. Given its practical value and existing implementation, it also looks plausible for the next release train.

### Medium-strength signals

- **Sorted dataset writes in C++**  
  [Issue #31135](https://github.com/apache/arrow/issues/31135)  
  This matters for analytical storage layouts and could improve downstream scan locality and query efficiency. It is conceptually important for OLAP users, but there is no active implementation here today.

- **Arrow format clarification for compressed buffer padding**  
  [Issue #31141](https://github.com/apache/arrow/issues/31141)  
  While not flashy, spec clarity here is important for interoperability and correctness across implementations.

- **Additional Gandiva SQL-style functions**  
  - `TRUNC`: [Issue #31118](https://github.com/apache/arrow/issues/31118)  
  - `Find_In_Set`: [Issue #31102](https://github.com/apache/arrow/issues/31102)  
  These suggest continuing demand for SQL compatibility in Gandiva, but both appear backlog-bound rather than imminent.

- **R Flight without `reticulate`**  
  [Issue #31115](https://github.com/apache/arrow/issues/31115)  
  This would materially improve deployability for R users, especially in constrained production environments.

### Prediction for next version
Most likely candidates from today’s visible queue:
1. **Parquet encrypted bloom filter reading**  
2. **Parquet dictionary encoder overflow fix**  
3. **Gandiva extreme-value crash fix**  
4. **Potentially VariableShapeTensor Python wrapper**, if review completes

## 6. User Feedback Summary

Today’s user feedback points to a few recurring pain areas:

- **Interop semantics matter as much as raw performance.**  
  The Python NumPy conversion issue shows that users expect Arrow-to-NumPy behavior to honor standard copy/writability contracts.  
  [Issue #49384](https://github.com/apache/arrow/issues/49384)

- **Users want ingestion APIs that are forgiving of messy real-world timestamps.**  
  The `StrptimeOptions` inference request highlights practical ETL needs over strict parsing formality.  
  [Issue #31120](https://github.com/apache/arrow/issues/31120)

- **Deployment simplicity remains important, especially in R and Flight.**  
  The request for Flight in R without `reticulate` reflects operational concerns, not just feature gaps.  
  [Issue #31115](https://github.com/apache/arrow/issues/31115)

- **Remote filesystem access remains a recurring ask.**  
  HTTPS filesystem support in R reflects a desire for simpler, broadly compatible access paths to analytical data.  
  [Issue #18980](https://github.com/apache/arrow/issues/18980)

- **Crash-free edge-case handling is expected in expression engines.**  
  Gandiva crash reports reinforce that analytical expression execution must degrade safely under adversarial or extreme inputs.  
  [PR #49471](https://github.com/apache/arrow/pull/49471)

There was little direct “satisfaction” feedback in today’s data; most visible commentary was about missing functionality, compatibility, or maintenance needs.

## 7. Backlog Watch

These older items look important enough to merit maintainer attention despite stale-warning activity:

- **`StrptimeOptions` format inference**  
  [Issue #31120](https://github.com/apache/arrow/issues/31120)  
  Cross-language, high-usability impact, directly relevant to ingestion pipelines.

- **Sorted writes for datasets**  
  [Issue #31135](https://github.com/apache/arrow/issues/31135)  
  Valuable for analytical storage optimization and scan efficiency.

- **R Flight without Python/reticulate dependency**  
  [Issue #31115](https://github.com/apache/arrow/issues/31115)  
  Important for cleaner production deployment in R-heavy environments.

- **Arrow format clarification around compressed buffers and padding**  
  [Issue #31141](https://github.com/apache/arrow/issues/31141)  
  Spec ambiguities can create cross-implementation bugs later; these are worth resolving even if low-comment.

- **Python wrapper for `VariableShapeTensor`**  
  [PR #40354](https://github.com/apache/arrow/pull/40354)  
  Open since 2024 and still not merged. It appears strategically useful and may need reviewer bandwidth more than design changes.

- **Bundled dependency upgrade PR with breaking API note**  
  [PR #48964](https://github.com/apache/arrow/pull/48964)  
  This likely needs focused maintainer review because it could unblock modernization but also carries ecosystem risk.

## 8. Overall Health Assessment

Apache Arrow remains healthy, with active maintenance across core C++, Python, Gandiva, and Parquet. Today’s update cadence suggests a project prioritizing **correctness, platform stability, and storage-format completeness** rather than shipping new top-level features. The biggest concern is not lack of activity, but **review throughput and stale-backlog pressure**: several meaningful enhancements remain open for years, while many older issues are being touched only through stale automation. For OLAP and analytical engine users, the near-term trajectory looks positive in the areas of **Parquet robustness**, **secure file compatibility**, and **runtime crash reduction**.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*