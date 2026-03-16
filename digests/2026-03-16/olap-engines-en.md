# Apache Doris Ecosystem Digest 2026-03-16

> Issues: 4 | PRs: 49 | Projects covered: 10 | Generated: 2026-03-16 01:28 UTC

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

# Apache Doris Project Digest — 2026-03-16

## 1. Today’s Overview

Apache Doris remained highly active over the last 24 hours, with **49 pull requests updated** and **4 issues updated**, indicating strong ongoing engineering throughput even though no new release was published today. The PR stream is concentrated around **query engine correctness, external catalog/connectivity, cloud/object storage support, and SQL/function compatibility**, which suggests the project is in an intensive refinement and feature-expansion phase. Several PRs are already marked **approved/reviewed**, so near-term integration velocity looks healthy. On the issue side, the visible traffic is small but includes a **real user performance complaint**, a **view query correctness bug**, and a few **stale enhancement/configuration items** that still need attention.

## 2. Project Progress

No new release was cut today, but the updated PR set shows clear forward motion in several product areas. Since the input only reports **4 PRs merged/closed in the last 24h** without listing them explicitly, the summary below focuses on the most advanced and review-ready work that appears closest to landing.

### Query engine and SQL layer progress
- **Group commit configurability at table level** via `group_commit_mode` property would improve ingest tuning and operational control.  
  PR: [#61242](https://github.com/apache/doris/pull/61242)
- **Nereids / planner-related work** continues indirectly through fixes and stale enhancement requests, especially around planner parity and correctness.
- **Aggregate/query execution optimization** is moving forward:
  - `GROUP BY count(*)` execution optimization  
    PR: [#61260](https://github.com/apache/doris/pull/61260)
  - Reduced hash join build template instantiations to improve compile time and developer efficiency  
    PR: [#61349](https://github.com/apache/doris/pull/61349)
- **Recursive CTE runtime/resource handling refactor** may improve stability and cleanup behavior in recursion rounds.  
  PR: [#61130](https://github.com/apache/doris/pull/61130)

### SQL compatibility and function coverage
Doris is actively closing feature gaps with other SQL engines:
- `json_each`, `json_each_text` table functions  
  PR: [#60910](https://github.com/apache/doris/pull/60910)
- `REGEXP_EXTRACT_ALL_ARRAY`  
  PR: [#61156](https://github.com/apache/doris/pull/61156)
- `SPLIT_BY_STRING` limit parameter  
  PR: [#60892](https://github.com/apache/doris/pull/60892)
- `levenshtein` and `hamming_distance` functions  
  PR: [#60412](https://github.com/apache/doris/pull/60412)
- Additional statistical regression aggregates (`REGR_*`)  
  PR: [#61352](https://github.com/apache/doris/pull/61352)

This is a strong signal that Doris continues to invest in **warehouse SQL completeness** and **migration friendliness**.

### External lakehouse / catalog / connector expansion
A major theme today is ecosystem reach:
- **Amazon Kinesis support for Routine Load**  
  PR: [#61325](https://github.com/apache/doris/pull/61325)
- **AWS MSK IAM auth for Routine Load**  
  PR: [#61324](https://github.com/apache/doris/pull/61324)
- **Iceberg update/delete/merge support**  
  PR: [#60482](https://github.com/apache/doris/pull/60482)
- **Iceberg v3 deletion vector read support** for branch 4.1  
  PR: [#61347](https://github.com/apache/doris/pull/61347)
- **Aliyun DLF Iceberg REST catalog** and JindoFS updates on branch 4.1  
  PR: [#61341](https://github.com/apache/doris/pull/61341)
- **Paimon create/drop database and table support** on branch 4.1  
  PR: [#61338](https://github.com/apache/doris/pull/61338)
- **JuiceFS treated as HDFS-compatible** in FE/BE  
  PR: [#61031](https://github.com/apache/doris/pull/61031)

These changes point to a roadmap centered on Doris as a broader **unified analytics engine over cloud-native and open table formats**.

### Stability and operational hardening
Several updated PRs target correctness and runtime robustness:
- Hive external reader **DATE timezone shift** fix  
  PR: [#61330](https://github.com/apache/doris/pull/61330)
- External catalog refresh **deadlock avoidance**  
  PR: [#61202](https://github.com/apache/doris/pull/61202)
- `SELECT ... INTO OUTFILE` parallel export race fix for `delete_existing_files=true`  
  PR: [#61223](https://github.com/apache/doris/pull/61223)
- MaxCompute connector **memory leak fixes** and large-write optimization  
  PR: [#61245](https://github.com/apache/doris/pull/61245)
- MTMV functional dependency error handling improvements  
  PR: [#59933](https://github.com/apache/doris/pull/59933)
- Variant column space accounting fix  
  PR: [#61331](https://github.com/apache/doris/pull/61331)

## 3. Community Hot Topics

Below are the most notable updated items based on recency, review status, and technical importance.

### 1) Single-node Doris query is “extremely slow”
- Issue: [#26097](https://github.com/apache/doris/issues/26097)
- Topic: A user reports that querying only **~40k rows took more than 70 seconds** on a fresh single-node deployment.
- Why it matters: Even though the issue is old, it was updated today and represents a **core user adoption risk**. New users often judge Doris on first-run latency; severe single-node slowness may indicate deployment misconfiguration, insufficient resource sizing, planner/runtime overhead, or storage/cache initialization problems.
- Technical need behind it: Better **out-of-box diagnostics**, **single-node tuning guidance**, and possibly automated checks for common anti-patterns.

### 2) View + `ORDER BY` correctness bug due to over-aggressive column pruning
- Issue: [#61219](https://github.com/apache/doris/issues/61219)
- Topic: In Doris 4.0.1, a view query with `ORDER BY a, b LIMIT 100` reportedly causes all non-sort columns to become null/empty due to excessive pruning.
- Why it matters: This is a **query correctness** issue, not just performance. Such bugs have higher severity because they can silently return wrong results.
- Technical need behind it: Safer optimizer transformations and stronger regression coverage around **view expansion + order/limit + column pruning**.

### 3) Routine Load expansion into AWS ecosystem
- PR: [#61325](https://github.com/apache/doris/pull/61325)
- PR: [#61324](https://github.com/apache/doris/pull/61324)
- Topic: Support for **Amazon Kinesis** and **AWS MSK IAM authentication**.
- Why it matters: This reflects strong market demand for **managed cloud streaming ingestion** rather than self-hosted Kafka only.
- Technical need behind it: Enterprise users want Doris to fit directly into **AWS-native security and streaming patterns**.

### 4) Lakehouse interoperability keeps expanding
- PR: [#60482](https://github.com/apache/doris/pull/60482)
- PR: [#61347](https://github.com/apache/doris/pull/61347)
- PR: [#61338](https://github.com/apache/doris/pull/61338)
- PR: [#61341](https://github.com/apache/doris/pull/61341)
- Topic: Iceberg, Paimon, Aliyun DLF, deletion vectors, and branch backports.
- Why it matters: Doris is clearly prioritizing **multi-format analytical federation** and **open table format compatibility**.
- Technical need behind it: Users increasingly expect one engine to query and ingest across lakehouse stacks without format lock-in.

### 5) Operational correctness under concurrency
- PR: [#61202](https://github.com/apache/doris/pull/61202)
- PR: [#61223](https://github.com/apache/doris/pull/61223)
- PR: [#61245](https://github.com/apache/doris/pull/61245)
- Topic: deadlocks, export races, connector memory leaks.
- Why it matters: These are typical issues that emerge as deployments scale beyond simple test environments.
- Technical need behind it: Stronger guarantees for **multi-threaded metadata refresh**, **parallel I/O workflows**, and **connector lifecycle cleanup**.

## 4. Bugs & Stability

Ranked by likely severity based on user impact and data correctness risk.

### High severity
1. **View query may return empty/null non-order-by columns due to over-pruning**
   - Issue: [#61219](https://github.com/apache/doris/issues/61219)
   - Impact: Potentially wrong query results in Doris 4.0.1.
   - Fix PR: None explicitly linked in the provided data.
   - Assessment: Highest priority because it affects **result correctness**.

2. **External catalog refresh deadlock**
   - PR: [#61202](https://github.com/apache/doris/pull/61202)
   - Impact: Can stall metadata operations and affect external catalog availability.
   - Status: Reviewed/approved.
   - Assessment: Important infrastructure stability fix, especially for federated deployments.

### Medium severity
3. **Hive DATE timezone shift in ORC/Parquet external readers**
   - PR: [#61330](https://github.com/apache/doris/pull/61330)
   - Impact: DATE values may shift by one day in western time zones.
   - Assessment: Serious compatibility/correctness issue for external Hive reads.

4. **Parallel outfile export race with `delete_existing_files=true`**
   - PR: [#61223](https://github.com/apache/doris/pull/61223)
   - Impact: Writers may delete files uploaded by other writers.
   - Assessment: Operational data export correctness issue under concurrency.

5. **MaxCompute connector memory leaks**
   - PR: [#61245](https://github.com/apache/doris/pull/61245)
   - Impact: Long-running connector tasks may leak resources; large writes also need optimization.
   - Assessment: Important for production connector reliability.

6. **MTMV functional dependency calculation may throw and break query**
   - PR: [#59933](https://github.com/apache/doris/pull/59933)
   - Impact: Query errors during MV-related dependency analysis.
   - Assessment: Stability hardening for materialized view logic.

### Lower severity but notable
7. **Variant column space usage reported as 0**
   - PR: [#61331](https://github.com/apache/doris/pull/61331)
   - Impact: Misleading storage accounting rather than data corruption.
   - Assessment: Affects observability and capacity planning.

8. **BE HTTPS private key must be plaintext or startup fails**
   - Issue: [#56103](https://github.com/apache/doris/issues/56103)
   - Impact: Startup failure in HTTPS-enabled BE deployments.
   - Fix PR: None listed.
   - Assessment: Configuration/documentation gap with real deployment impact.

9. **Single-node query performance complaint**
   - Issue: [#26097](https://github.com/apache/doris/issues/26097)
   - Impact: Severe poor UX, though root cause may be configuration-specific.
   - Assessment: Important from a user perception standpoint, but severity depends on reproducibility.

## 5. Feature Requests & Roadmap Signals

Today’s PRs give strong clues about what users and maintainers want next.

### Likely near-term product directions

#### 1) Broader cloud ingestion and auth support
- Amazon Kinesis Routine Load: [#61325](https://github.com/apache/doris/pull/61325)
- AWS MSK IAM auth: [#61324](https://github.com/apache/doris/pull/61324)
- Alibaba OSS native storage vault with STS AssumeRole: [#61329](https://github.com/apache/doris/pull/61329)

**Signal:** Doris is moving toward **first-class cloud-native ingestion and credential integration**, especially across AWS and Alibaba Cloud.

#### 2) Stronger lakehouse interoperability
- Iceberg DML features: [#60482](https://github.com/apache/doris/pull/60482)
- Iceberg v3 deletion vectors: [#61347](https://github.com/apache/doris/pull/61347)
- Paimon DDL support: [#61338](https://github.com/apache/doris/pull/61338)
- Aliyun DLF Iceberg REST catalog: [#61341](https://github.com/apache/doris/pull/61341)
- JuiceFS/HDFS compatibility: [#61031](https://github.com/apache/doris/pull/61031)

**Signal:** Expect upcoming Doris versions to deepen support for **Iceberg/Paimon/catalog interoperability**, likely a major adoption driver.

#### 3) Continued SQL/function completeness
- `json_each` / `json_each_text`: [#60910](https://github.com/apache/doris/pull/60910)
- `REGEXP_EXTRACT_ALL_ARRAY`: [#61156](https://github.com/apache/doris/pull/61156)
- `SPLIT_BY_STRING(limit)`: [#60892](https://github.com/apache/doris/pull/60892)
- `levenshtein`, `hamming_distance`: [#60412](https://github.com/apache/doris/pull/60412)
- More `REGR_*`: [#61352](https://github.com/apache/doris/pull/61352)

**Signal:** Doris is tracking compatibility expectations from systems like PostgreSQL, Hive, Spark, Trino, and broader analytical SQL ecosystems.

#### 4) Planner parity and Nereids completion
- Nereids stats command enhancement issue: [#42631](https://github.com/apache/doris/issues/42631)

**Signal:** Planner modernization remains unfinished in edge/admin commands. This may continue to appear in future minor releases as parity gaps are closed.

### Prediction for next version
Most likely to appear soon:
- reviewed operational fixes: [#61202](https://github.com/apache/doris/pull/61202), [#61330](https://github.com/apache/doris/pull/61330), [#61223](https://github.com/apache/doris/pull/61223), [#61245](https://github.com/apache/doris/pull/61245)
- cloud ingestion/auth: [#61324](https://github.com/apache/doris/pull/61324), [#61325](https://github.com/apache/doris/pull/61325)
- SQL compatibility additions: [#60910](https://github.com/apache/doris/pull/60910), [#61156](https://github.com/apache/doris/pull/61156), [#60892](https://github.com/apache/doris/pull/60892)

## 6. User Feedback Summary

The small issue set still reveals several meaningful user pain points:

- **First-run performance perception remains fragile.**  
  The single-node slow query complaint in [#26097](https://github.com/apache/doris/issues/26097) suggests some users may struggle to achieve acceptable performance without deeper tuning knowledge.

- **Query correctness matters more than raw speed for production trust.**  
  The view/`ORDER BY` pruning bug in [#61219](https://github.com/apache/doris/issues/61219) is exactly the kind of issue that can undermine confidence in an analytical engine.

- **Users need smoother secure deployment defaults.**  
  The HTTPS private key issue in [#56103](https://github.com/apache/doris/issues/56103) points to friction in production-grade secure BE setup.

- **Cloud-native users want managed-service integration, not just generic protocols.**  
  The active work on Kinesis, MSK IAM, OSS STS, and Iceberg/Paimon catalogs shows strong demand from users running Doris alongside modern cloud data stacks.

Overall feedback signals that Doris users are not only asking for speed; they are increasingly focused on **operational correctness, ecosystem compatibility, and enterprise/cloud integration**.

## 7. Backlog Watch

These items look like they deserve explicit maintainer attention due to age, practical impact, or repeated resurfacing.

### Important stale or long-lived items
1. **Single-node severe performance complaint**
   - Issue: [#26097](https://github.com/apache/doris/issues/26097)
   - Why watch: Old but still updated; likely reflects unresolved onboarding/performance troubleshooting gaps.

2. **Nereids `StatsCommand` parity gap**
   - Issue: [#42631](https://github.com/apache/doris/issues/42631)
   - Why watch: Planner feature parity issues can accumulate and block full migration to the newer FE planner.

3. **BE HTTPS startup failure when private key format is not plaintext**
   - Issue: [#56103](https://github.com/apache/doris/issues/56103)
   - Why watch: This is a deployment blocker with likely documentation and validation implications.

4. **Broker storage path config deletion / startup behavior**
   - PR: [#55706](https://github.com/apache/doris/pull/55706)
   - Why watch: Startup failure and stale config handling can directly affect node recoverability.

5. **S3 client configuration initialization performance**
   - PR: [#56081](https://github.com/apache/doris/pull/56081)
   - Why watch: Cloud object storage latency at startup can degrade service readiness and user experience.

6. **Nereids broker file group data description optimization**
   - PR: [#56089](https://github.com/apache/doris/pull/56089)
   - Why watch: Another stale Nereids-related item, suggesting planner-side backlog remains nontrivial.

7. **File cache 2Q-LRU hotspot protection**
   - PR: [#57410](https://github.com/apache/doris/pull/57410)
   - Why watch: Potentially important for mixed scan/hotspot workloads; long-lived performance work often needs renewed review focus.

## 8. Overall Health Assessment

Project health appears **strong**, with high PR activity and a broad spread of work across engine, connector, lakehouse, and SQL layers. The main positive signal is that many updates are not just net-new features but **hard production fixes** for deadlocks, memory leaks, timezone correctness, export races, and metadata behavior. The main caution is that some **stale issues/PRs in Nereids, configuration handling, and startup behavior** remain visible, while at least one current issue points to a potentially serious **query correctness regression**. Net-net, Apache Doris looks like a project with **healthy momentum and ambitious ecosystem expansion**, but one that still needs continued focus on **correctness regressions, operability, and backlog cleanup** to sustain user trust.

---

## Cross-Engine Comparison

# Cross-Engine Open-Source OLAP / Analytical Storage Ecosystem Report  
**Date:** 2026-03-16  
**Primary focus:** Apache Doris

---

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, with most major projects simultaneously investing in **query correctness, lakehouse interoperability, cloud object storage integration, and SQL compatibility expansion**. A clear pattern across engines is that competition is no longer just about raw scan speed: communities are now heavily focused on **operability, connector reliability, planner correctness, and multi-engine interoperability**. The landscape is also splitting into distinct architectural camps: **integrated MPP databases** (Doris, ClickHouse, StarRocks), **embedded/local analytical engines** (DuckDB), **table-format and storage-layer projects** (Iceberg, Delta Lake), and **execution frameworks/libraries** (Velox, Gluten). Apache Doris sits in the middle of this convergence, increasingly positioning itself as both a **high-performance MPP warehouse** and a **federated analytics engine over external lakehouse formats**.

---

## 2. Activity Comparison

### Daily activity snapshot

| Project | Updated Issues | Updated PRs | Release Today | Health Score* | Short Read |
|---|---:|---:|---|---:|---|
| **ClickHouse** | 12 | 91 | No | **8.5/10** | Very high throughput; strong momentum, but visible crash/regression pressure |
| **Apache Doris** | 4 | 49 | No | **8.4/10** | High activity with balanced feature + stability work; strong cloud/lakehouse expansion |
| **StarRocks** | 5 | 22 | No | **8.1/10** | Healthy, focused on Iceberg correctness and shared-data reliability |
| **DuckDB** | 14 | 14 | No | **7.9/10** | Fast triage and fixes, but in visible 1.5.0 stabilization mode |
| **Velox** | 1 | 20 | No | **7.8/10** | Strong internal velocity, healthy maintainer flow, mostly infra/runtime-focused |
| **Apache Gluten** | 4 | 11 | No | **7.4/10** | Active, but performance complaints and upstream dependency drag are notable |
| **Apache Iceberg** | 4 | 14 | No | **7.3/10** | Stable and important, but lighter day; connector/streaming work continues |
| **Delta Lake** | 0 | 10 | No | **7.2/10** | Quiet externally, steady internally; mostly connector/catalog refinement |
| **Databend** | 0 | 9 | **Yes** (nightly) | **7.5/10** | Moderate activity, targeted engine improvements, low issue churn |

\*Health score is a comparative qualitative estimate based on visible activity, bug severity, review flow, and balance of feature vs. stabilization work in the supplied digests.

### Interpretation
- **Highest visible throughput:** ClickHouse, Doris
- **Most balanced execution + ecosystem expansion:** Doris, StarRocks
- **Most obviously in stabilization cycle:** DuckDB
- **Most infrastructure/library-oriented activity:** Velox, Gluten
- **Most standards/storage-layer focused:** Iceberg, Delta Lake

---

## 3. Apache Doris's Position

### Where Doris is strong versus peers

**1. Balanced product breadth**
- Doris is one of the few projects showing simultaneous momentum in:
  - core query engine optimization,
  - SQL/function coverage,
  - streaming ingestion,
  - external catalogs/connectors,
  - and cloud object storage integration.
- Compared with ClickHouse, Doris looks somewhat more explicitly focused on **federation and lakehouse interoperability breadth**, while ClickHouse remains more centered on core engine and storage-engine internals.

**2. Strong lakehouse + cloud-native trajectory**
- Doris had notable active work in:
  - Iceberg DML/deletion vectors,
  - Paimon DDL,
  - Aliyun DLF Iceberg REST,
  - AWS Kinesis,
  - AWS MSK IAM,
  - OSS AssumeRole support,
  - JuiceFS/HDFS compatibility.
- This positions Doris closer to a **unified analytics control plane over heterogeneous storage/services**, more comparable to StarRocks in direction than to ClickHouse or DuckDB.

**3. SQL completeness as an adoption strategy**
- Doris is actively adding compatibility-oriented functions (`json_each`, `regexp_extract_all_array`, `split_by_string(limit)`, `levenshtein`, `REGR_*`).
- That is a strong migration signal for enterprises moving from PostgreSQL/Hive/Spark/Trino-style environments.

### Where Doris still trails or faces pressure

**1. Community scale vs ClickHouse**
- On raw daily visible activity, ClickHouse remains larger and faster-moving: **91 PRs vs Doris’s 49**.
- ClickHouse also appears to have broader community breadth across storage internals, CI, SQL, and format layers.

**2. Query correctness trust must stay a priority**
- The Doris `VIEW + ORDER BY + LIMIT` pruning bug is more strategically damaging than many performance issues because it affects **silent correctness**.
- In this area, Doris faces the same trust challenge seen across fast-moving engines: growth in optimizer/planner sophistication increases risk.

**3. Planner modernization backlog**
- Doris still shows lingering Nereids parity/staleness signals, indicating some modernization work remains incomplete.

### Technical approach differences vs peers

- **Doris vs ClickHouse:**  
  Doris appears more focused on becoming a **warehouse + federated lakehouse engine**, while ClickHouse remains more optimized around its own mature storage/query stack, though it is expanding Iceberg support.
- **Doris vs StarRocks:**  
  Very close competitive positioning. Both are moving hard into **Iceberg/lakehouse**, but StarRocks currently shows somewhat sharper emphasis on **shared-data architecture** and Iceberg pushdown details.
- **Doris vs DuckDB:**  
  Doris targets **distributed, service-based MPP analytics**, while DuckDB targets **embedded/local/cloud-object analytics** with very different operational assumptions.
- **Doris vs Iceberg/Delta:**  
  Doris is a query/warehouse engine; Iceberg and Delta are storage/table-format ecosystems rather than direct end-user MPP database competitors.

### Community size comparison

Approximate daily visible momentum tier from this snapshot:
- **Larger:** ClickHouse
- **Same upper tier / highly active:** Doris
- **Mid-tier but strong:** StarRocks, DuckDB
- **Specialized but important:** Iceberg, Delta, Velox, Gluten, Databend

Doris is clearly in the **top tier of active analytical engine projects** by visible engineering throughput.

---

## 4. Shared Technical Focus Areas

Several requirements are now appearing across multiple engines, indicating ecosystem-wide demand.

### A. Lakehouse interoperability
**Engines:** Doris, ClickHouse, StarRocks, Iceberg, Delta Lake, Velox, Gluten  
**Specific needs:**
- Iceberg DML, deletion vectors, DDL coverage, pushdown correctness
- Paimon / external catalog support
- REST catalog behavior and TLS correctness
- File metadata function correctness (`input_file_name`, etc.)
- Equality delete semantics and snapshot handling

**Takeaway:** Open table formats are no longer optional edge integrations; they are becoming central product surfaces.

---

### B. Cloud object storage and managed-service integration
**Engines:** Doris, DuckDB, StarRocks, Delta Lake, Iceberg, Gluten, Databend  
**Specific needs:**
- S3 request amplification reduction
- startup/config performance for object clients
- native cloud auth (AWS IAM, STS AssumeRole)
- remote catalog retry logic
- reduced tiny-read overhead
- object-storage behavior in shared-data architectures

**Takeaway:** Cloud-native analytics now requires good behavior under **high-latency, API-metered, auth-heavy storage systems**, not just local disk assumptions.

---

### C. Query correctness over optimizer aggressiveness
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Velox, Databend  
**Specific needs:**
- column pruning safety
- correlated subquery semantics
- window-rewrite correctness
- outer join stats propagation
- large `IN` predicate rewrite safety
- decimal/time/timestamp precision correctness

**Takeaway:** Engines are under pressure to add optimizer sophistication without introducing wrong-result bugs.

---

### D. SQL compatibility and migration-friendliness
**Engines:** Doris, ClickHouse, DuckDB, Delta Lake, Velox, Gluten  
**Specific needs:**
- more scalar/table functions
- dialect translation / transpilation
- better temporal semantics
- decimal/filter/pushdown fidelity
- parameterized view/schema stability

**Takeaway:** Winning new workloads increasingly depends on reducing SQL rewrite cost.

---

### E. Streaming and ingestion reliability
**Engines:** Doris, Iceberg, Delta Lake, StarRocks  
**Specific needs:**
- Kinesis / Kafka / MSK integration
- CDC/upsert/delta writer support
- multi-topic routing correctness
- transaction correctness during leadership/failover events

**Takeaway:** Real-time analytics and CDC are now first-class requirements, not add-ons.

---

### F. Stability under concurrency and production operations
**Engines:** Doris, ClickHouse, StarRocks, DuckDB, Delta Lake  
**Specific needs:**
- deadlock avoidance
- export/write race fixes
- memory leak cleanup
- crash fixes in DDL / index / copy paths
- better error observability

**Takeaway:** Production maturity is increasingly judged by behavior in operational edge cases, not benchmark medians.

---

## 5. Differentiation Analysis

### By storage model

| Engine | Storage / Data Model Orientation |
|---|---|
| **Apache Doris** | Native MPP warehouse with growing external lakehouse federation |
| **ClickHouse** | Native high-performance columnar engine with expanding external format/table support |
| **DuckDB** | Embedded/local analytical engine; strong Parquet/S3 querying |
| **StarRocks** | MPP analytical DB, increasingly strong in shared-data + lakehouse patterns |
| **Iceberg** | Open table format / metadata layer, not a full SQL warehouse itself |
| **Delta Lake** | Transactional table format/storage layer around Spark/kernel ecosystem |
| **Databend** | Cloud-native analytical engine with snapshot/versioning ambitions |
| **Velox** | Execution engine library, not a user-facing storage engine |
| **Gluten** | Spark acceleration layer over Velox/backends, not primary storage engine |

### By query engine design

| Engine | Query Design Character |
|---|---|
| **Doris** | Distributed MPP SQL engine with native + federated access paths |
| **ClickHouse** | Highly optimized analytical execution tightly coupled to native storage internals |
| **DuckDB** | In-process vectorized engine optimized for local/embedded execution |
| **StarRocks** | Distributed MPP with growing shared-data and external table optimization |
| **Velox** | Reusable vectorized execution substrate for other systems |
| **Gluten** | Delegates Spark execution to alternative native backend paths |

### By target workload

| Engine | Best-Fit Workloads |
|---|---|
| **Doris** | Interactive analytics, real-time ingestion, federated warehouse/lakehouse queries |
| **ClickHouse** | High-throughput analytics, observability, event/log analytics, large-scale serving |
| **DuckDB** | Local analytics, notebooks, embedded apps, ad hoc Parquet/S3 exploration |
| **StarRocks** | Enterprise BI, lakehouse federation, shared-data deployments |
| **Iceberg / Delta** | Table management, transaction layer, interoperability foundation |
| **Databend** | Cloud-native analytics with newer versioning-oriented workflows |
| **Velox / Gluten** | Execution acceleration and engine infrastructure |

### By SQL compatibility posture

- **Most visibly expanding SQL compatibility:** Doris, ClickHouse, DuckDB
- **Lakehouse/query integration compatibility focus:** StarRocks, Delta Lake, Gluten
- **Storage semantics over broad SQL surface:** Iceberg
- **Execution semantics/internal correctness:** Velox

**Doris’s differentiator here:** it is combining **warehouse-style SQL completeness** with **connector/lakehouse breadth**, rather than specializing in only one.

---

## 6. Community Momentum & Maturity

### Activity tiers

**Tier 1: Very high momentum**
- **ClickHouse**
- **Apache Doris**

These projects show the largest visible daily engineering throughput and the broadest spread of work. Both are moving fast enough that correctness/stability debt must be managed carefully.

**Tier 2: Strong and focused**
- **StarRocks**
- **DuckDB**

StarRocks is iterating strongly in lakehouse/shared-data areas. DuckDB is very responsive, but currently more clearly in regression-fix mode after a major release.

**Tier 3: Strategic infrastructure / moderate pace**
- **Iceberg**
- **Delta Lake**
- **Velox**
- **Databend**
- **Gluten**

These projects remain important, but their activity is either narrower in scope, more infrastructure-focused, or less issue-heavy on this particular day.

### Rapidly iterating vs stabilizing

**Rapidly iterating**
- Doris
- ClickHouse
- StarRocks
- Databend
- Velox

**Stabilizing / regression-fix-heavy**
- DuckDB
- Gluten
- Delta Lake

**Steady platform evolution**
- Iceberg

### Maturity signals

- **Most operationally mature but still fast-moving:** ClickHouse, Doris
- **Fast-maturing challenger:** StarRocks
- **Mature in embedded niche, currently stabilizing:** DuckDB
- **Mature standards layer:** Iceberg, Delta
- **Maturing infrastructure layer:** Velox, Gluten

---

## 7. Trend Signals

### 1. The market is converging on “one engine, many storage backends”
Users increasingly expect analytical engines to query across:
- native warehouse tables,
- Iceberg/Delta/Paimon,
- object stores,
- external catalogs,
- and cloud-managed streaming systems.

**Why it matters:** Data architects should assume future platforms will be judged on **federation quality and metadata correctness**, not only native-table speed.

---

### 2. Cloud-native authentication and service integration are now core product requirements
Examples include:
- Doris: Kinesis, MSK IAM, OSS STS
- Delta/Iceberg: REST/catalog resiliency
- DuckDB/Gluten: S3 efficiency pressure

**Value:** Teams building on AWS/Azure/GCP/Alibaba stacks should prioritize engines that support **managed service integration and secure auth flows natively**, reducing custom glue code.

---

### 3. Wrong-result bugs are becoming the key trust boundary
Across Doris, DuckDB, ClickHouse, StarRocks, Velox, and Databend, a major share of important work is about:
- pruning correctness,
- rewrite safety,
- decimal/timestamp fidelity,
- delete semantics,
- and metadata correctness.

**Value:** For production analytics, planner maturity and regression coverage may matter more than another marginal benchmark win.

---

### 4. SQL migration friction remains a major adoption bottleneck
Evidence:
- Doris function expansion
- ClickHouse SQL transpiler
- DuckDB broader semantics hardening
- Delta connector pushdown fidelity

**Value:** Data engineers should factor **SQL rewrite cost** into platform selection. Engines with strong compatibility investments can materially lower migration timelines.

---

### 5. Lakehouse support is shifting from “read support” to “full operational correctness”
The current frontier is no longer just “can it read Iceberg?” but:
- delete vectors,
- DML semantics,
- snapshot correctness,
- partial pushdown,
- null partition handling,
- manifest/version behavior.

**Value:** Architects choosing lakehouse-facing engines should evaluate **mutation semantics, predicate pushdown quality, and metadata edge-case handling**, not just basic scan support.

---

### 6. Operational polish is increasingly decisive
Users are surfacing issues around:
- startup failures,
- deadlocks,
- leader-switch transaction behavior,
- export races,
- connector memory leaks,
- and transient network retry behavior.

**Value:** For platform teams, these are often the real determinants of operational cost and user confidence.

---

## Bottom Line

Apache Doris is in a strong position within the 2026 analytical engine landscape: it combines **top-tier community activity**, a **broadening SQL surface**, and an increasingly compelling **cloud/lakehouse interoperability story**. Relative to peers, Doris looks especially well-positioned for organizations that want a **single distributed analytics engine spanning native warehouse workloads, streaming ingest, and open table formats**. The main competitive pressure comes from **ClickHouse’s larger engineering scale** and **StarRocks’ close overlap in lakehouse direction**, while the main internal risk remains maintaining **query correctness and planner reliability** as product scope expands. For technical decision-makers, Doris currently stands out as one of the most strategically balanced open-source choices in the OLAP ecosystem.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-16

## 1. Today's Overview

ClickHouse remained highly active over the last 24 hours, with **91 pull requests updated** and **12 issues updated**, indicating a strong development cadence and heavy maintainer throughput. The project shows a mixed but healthy profile: there is clear forward motion on SQL compatibility, Iceberg support, CI hardening, and MergeTree reliability, while several newly reported crashes and regressions signal continued pressure around edge-case correctness and newer execution paths such as the analyzer. No new release was published today, so activity is concentrated in development and stabilization rather than delivery. Overall, project health looks **active and productive**, but with a noticeable short-term focus on **stability, test infrastructure, and storage-engine safety**.

---

## 2. Project Progress

No merged PR list was provided explicitly, so progress is inferred from the most actively updated pull requests and recently closed issues.

### Query engine and SQL layer progress
- **Polyglot SQL transpiler integration** would be a major SQL adoption step if merged, enabling translation from 30+ dialects into ClickHouse SQL via Rust FFI. This points to a strategic push to reduce migration friction from systems like PostgreSQL, MySQL, SQLite, Snowflake, and DuckDB.  
  [PR #99496](https://github.com/ClickHouse/ClickHouse/pull/99496)

- **Correlated subquery support continues to evolve**, with a newly opened issue requesting support for `LIMIT 0` and `LIMIT n OFFSET m` in correlated subqueries after a regression introduced by prior work. This suggests the correlated-subquery implementation is still being generalized and hardened.  
  [Issue #99524](https://github.com/ClickHouse/ClickHouse/issues/99524)

- **Detached execution for non-readonly queries** is still progressing and could materially improve asynchronous write workflows for operational pipelines and client UX.  
  [PR #96823](https://github.com/ClickHouse/ClickHouse/pull/96823)

- **Parameterized/view explicit schema work** continues, which is relevant for schema determinism and better compatibility in composable SQL abstractions.  
  [PR #98708](https://github.com/ClickHouse/ClickHouse/pull/98708)

### Storage engine and table format progress
- **Iceberg support is clearly expanding**:
  - `ALTER TABLE ... EXECUTE remove_orphan_files` for Iceberg tables adds practical lifecycle management.  
    [PR #99127](https://github.com/ClickHouse/ClickHouse/pull/99127)
  - A backport is in flight for a crash fix during `ALTER TABLE REMOVE SETTING` in Iceberg.  
    [PR #99411](https://github.com/ClickHouse/ClickHouse/pull/99411)
  - However, a new server crash on `ALTER TABLE MODIFY COLUMN COMMENT` for Iceberg was reported today, showing the integration remains an active risk area.  
    [Issue #99523](https://github.com/ClickHouse/ClickHouse/issues/99523)

- **MergeTree operational robustness** is improving:
  - New settings for **replicated fetches min part level** aim to better control replica behavior under part-fetch scenarios.  
    [PR #98625](https://github.com/ClickHouse/ClickHouse/pull/98625)
  - A fix for **rare incorrect part detachment after `DETACH/ATTACH TABLE`** addresses user-visible storage integrity concerns.  
    [PR #99529](https://github.com/ClickHouse/ClickHouse/pull/99529)
  - Assertion handling around **vertical merges** is also being corrected.  
    [PR #99532](https://github.com/ClickHouse/ClickHouse/pull/99532)

### Format and interoperability work
- **Avro output correctness** is being improved for unknown enum values, replacing a raw `std::out_of_range` failure with a proper ClickHouse exception.  
  [PR #99332](https://github.com/ClickHouse/ClickHouse/pull/99332)

- Work continues around external file formats:
  - Arrow UUID support remains requested.  
    [Issue #72639](https://github.com/ClickHouse/ClickHouse/issues/72639)
  - ArrowStream interval type support remains unfinished.  
    [Issue #97849](https://github.com/ClickHouse/ClickHouse/issues/97849)
  - ORC/Parquet/Arrow URL access may soon warn when range reads are unsupported and whole-file downloads are required.  
    [PR #96988](https://github.com/ClickHouse/ClickHouse/pull/96988)

### CI and quality engineering
- CI hardening is a major theme today:
  - **libFuzzers in PRs** would shift bug detection earlier in the review cycle.  
    [PR #99530](https://github.com/ClickHouse/ClickHouse/pull/99530)
  - Pinning `sqllogictest` to a fixed commit reduces non-deterministic failures.  
    [PR #99514](https://github.com/ClickHouse/ClickHouse/pull/99514)
  - Catching exceptions in `MergeTreeTransaction::afterCommit` prevents `std::terminate` under injected disk faults.  
    [PR #99494](https://github.com/ClickHouse/ClickHouse/pull/99494)

---

## 3. Community Hot Topics

### 1) Polyglot SQL transpilation as a migration funnel
- **[PR #99496](https://github.com/ClickHouse/ClickHouse/pull/99496)** — Integrate polyglot SQL transpiler for 30+ SQL dialects

This is the clearest roadmap-scale item in today’s activity. The underlying need is obvious: many prospective users evaluate ClickHouse through the lens of existing SQL estates, BI tools, and query snippets written for other engines. A dialect transpiler could sharply reduce onboarding cost, lower rewrite effort, and improve ClickHouse’s position as a drop-in analytical target.

### 2) Arrow format compatibility gaps remain visible
- **[Issue #72639](https://github.com/ClickHouse/ClickHouse/issues/72639)** — Support UUID for format Arrow
- **[Issue #97849](https://github.com/ClickHouse/ClickHouse/issues/97849)** — Support Interval types in format ArrowStream

These requests reflect a practical interoperability demand rather than niche polish. Users integrating ClickHouse with Python, Arrow-native pipelines, lakehouse tools, and analytical clients increasingly expect full fidelity for standard logical types like UUID and Interval.

### 3) Analyzer-related crash reports
- **[Issue #99362](https://github.com/ClickHouse/ClickHouse/issues/99362)** — Crash with nested `GLOBAL IN` through Distributed table when analyzer is enabled

This is a strong signal that the newer analyzer path is still encountering production-grade edge cases, especially where distributed execution, nested subqueries, and optimization shortcuts intersect. The technical need here is predictable: greater semantic coverage and regression protection before broader reliance on analyzer-based planning.

### 4) Iceberg remains strategically important but unstable at edges
- **[Issue #99523](https://github.com/ClickHouse/ClickHouse/issues/99523)** — Crash on `MODIFY COLUMN COMMENT`
- **[PR #99127](https://github.com/ClickHouse/ClickHouse/pull/99127)** — `remove_orphan_files`
- **[PR #99411](https://github.com/ClickHouse/ClickHouse/pull/99411)** — Backport crash fix

The pattern suggests strong investment in Iceberg as a strategic table format, but also indicates API/DDL coverage is still incomplete and vulnerable in non-core mutation paths.

---

## 4. Bugs & Stability

Ranked by apparent severity and user impact.

### Critical
1. **Analyzer-triggered server crash with nested `GLOBAL IN` on Distributed tables**  
   A segmentation fault in a query-planning/optimization path is severe because it can be triggered by valid SQL and affects distributed workloads. Disabling the analyzer is a workaround, but this is a production risk for users testing or adopting the newer planner.  
   [Issue #99362](https://github.com/ClickHouse/ClickHouse/issues/99362)  
   **Fix PR identified?** None directly listed in the provided data.

2. **Iceberg DDL crash on `ALTER TABLE ... MODIFY COLUMN COMMENT`**  
   Null-pointer dereference causing server crash on a metadata operation. Severe for lakehouse users because it affects basic schema maintenance and can undermine trust in ClickHouse’s Iceberg DDL support.  
   [Issue #99523](https://github.com/ClickHouse/ClickHouse/issues/99523)  
   **Related fixes nearby:** other Iceberg crash fixes exist, but no direct fix PR for this exact issue was shown.  
   [PR #99411](https://github.com/ClickHouse/ClickHouse/pull/99411)

3. **Audit log spoofing risk**  
   This is potentially a security-sensitive issue rather than a correctness bug. The report claims insufficient validation of client metadata, allowing spoofed `os_user`, `client_hostname`, and quota-related identity fields.  
   [Issue #99526](https://github.com/ClickHouse/ClickHouse/issues/99526)  
   **Fix PR identified?** None shown.

### High
4. **HTTP Pretty formatting against `system.asynchronous_inserts` throws `std::length_error`**  
   Important because it affects observability and admin workflows via HTTP, even when the table is empty. The scope appears narrow but user-visible and easy to reproduce.  
   [Issue #99528](https://github.com/ClickHouse/ClickHouse/issues/99528)  
   **Fix PR identified?** None shown.

5. **Regression in correlated subqueries with `LIMIT/OFFSET` semantics**  
   The issue description notes prior wrong results now changed into exceptions after PR #99005. Throwing is safer than silently incorrect results, but it still exposes incomplete semantics in correlated subqueries.  
   [Issue #99524](https://github.com/ClickHouse/ClickHouse/issues/99524)  
   **Fix PR identified?** None shown.

6. **Unexpected `system.errors` records after successful insert**  
   Longstanding issue, likely lower in immediate severity than crashes, but damaging to operator confidence because it produces misleading internal error signals after successful writes.  
   [Issue #51175](https://github.com/ClickHouse/ClickHouse/issues/51175)

### Medium
7. **CI crash: SortingQueueImpl construction failure during merge sort**  
   CI-only for now, but relevant because merge-sort failures can point to deeper instability in sorting or pipeline execution code.  
   [Issue #99503](https://github.com/ClickHouse/ClickHouse/issues/99503)

8. **Prior CI crash in `MergeTreeDataPartCompact` double free / corruption**  
   Closed, which is a positive signal that the issue was triaged/resolved or deduplicated quickly.  
   [Issue #98949](https://github.com/ClickHouse/ClickHouse/issues/98949)

9. **Fuzz-discovered logical errors closed quickly**  
   Two fuzz/testing issues were closed, suggesting the CI/fuzzing process is catching and dispatching correctness bugs effectively.  
   [Issue #96657](https://github.com/ClickHouse/ClickHouse/issues/96657)  
   [Issue #99375](https://github.com/ClickHouse/ClickHouse/issues/99375)

### Stability improvement PRs worth noting
- Prevent `std::terminate` in `MergeTreeTransaction::afterCommit`  
  [PR #99494](https://github.com/ClickHouse/ClickHouse/pull/99494)
- Fix vertical merge assertion with cancelled merges  
  [PR #99532](https://github.com/ClickHouse/ClickHouse/pull/99532)
- Fix rare incorrect marking of data parts as broken after `DETACH/ATTACH TABLE`  
  [PR #99529](https://github.com/ClickHouse/ClickHouse/pull/99529)
- Validate column structure before applying patches  
  [PR #99531](https://github.com/ClickHouse/ClickHouse/pull/99531)

---

## 5. Feature Requests & Roadmap Signals

### Strong signals
1. **Cross-dialect SQL compatibility is becoming strategic**
   - [PR #99496](https://github.com/ClickHouse/ClickHouse/pull/99496)

   This is more than a convenience feature; it points to a product strategy around easier migration and broader SQL ecosystem capture.

2. **Arrow/ArrowStream type completeness is still demanded**
   - [Issue #72639](https://github.com/ClickHouse/ClickHouse/issues/72639) — UUID in Arrow
   - [Issue #97849](https://github.com/ClickHouse/ClickHouse/issues/97849) — Interval types in ArrowStream

   These are likely candidates for future releases because they are narrow, actionable compatibility gaps with clear user value.

3. **Correlated subqueries are under active expansion**
   - [Issue #99524](https://github.com/ClickHouse/ClickHouse/issues/99524)

   The direction is clear: ClickHouse is moving toward more complete subquery semantics, but there is still edge-case debt.

4. **Asynchronous operational workflows**
   - [PR #96823](https://github.com/ClickHouse/ClickHouse/pull/96823)

   Detached execution for non-readonly queries could become an important workflow primitive for ingestion systems and API clients.

5. **Iceberg lifecycle and DDL completeness**
   - [PR #99127](https://github.com/ClickHouse/ClickHouse/pull/99127)

   Lakehouse interoperability remains a visible roadmap area.

### Likely next-version candidates
Most likely to land soon based on maturity and scope:
- Avro enum output fix  
  [PR #99332](https://github.com/ClickHouse/ClickHouse/pull/99332)
- MergeTree afterCommit exception hardening  
  [PR #99494](https://github.com/ClickHouse/ClickHouse/pull/99494)
- Rare part-detach false positive fix  
  [PR #99529](https://github.com/ClickHouse/ClickHouse/pull/99529)
- Vertical merge assertion fix  
  [PR #99532](https://github.com/ClickHouse/ClickHouse/pull/99532)
- Iceberg orphan file cleanup support  
  [PR #99127](https://github.com/ClickHouse/ClickHouse/pull/99127)

Medium-term, but important:
- SQL transpiler integration  
  [PR #99496](https://github.com/ClickHouse/ClickHouse/pull/99496)
- Detached execution of non-readonly queries  
  [PR #96823](https://github.com/ClickHouse/ClickHouse/pull/96823)

---

## 6. User Feedback Summary

Today’s user feedback points to a few recurring pain points:

- **Server crashes remain the top trust breaker**, especially in newer or less mature paths:
  - analyzer-enabled distributed queries  
    [Issue #99362](https://github.com/ClickHouse/ClickHouse/issues/99362)
  - Iceberg DDL operations  
    [Issue #99523](https://github.com/ClickHouse/ClickHouse/issues/99523)

- **Format interoperability still has sharp edges**, especially for Arrow-family outputs where users expect parity with modern data stack conventions:
  - UUID support gap  
    [Issue #72639](https://github.com/ClickHouse/ClickHouse/issues/72639)
  - Interval type support gap  
    [Issue #97849](https://github.com/ClickHouse/ClickHouse/issues/97849)

- **Operational observability needs polish**:
  - misleading system errors after successful inserts  
    [Issue #51175](https://github.com/ClickHouse/ClickHouse/issues/51175)
  - HTTP output formatting failure for `system.asynchronous_inserts`  
    [Issue #99528](https://github.com/ClickHouse/ClickHouse/issues/99528)

- **Users want better compatibility without rewrites**, which is exactly why the SQL transpiler PR stands out as potentially high-impact.  
  [PR #99496](https://github.com/ClickHouse/ClickHouse/pull/99496)

Overall, user sentiment implied by the issue set is not about lack of features in the abstract; it is about **completeness, compatibility, and predictable behavior in real integration scenarios**.

---

## 7. Backlog Watch

These older or strategically important items look like they deserve continued maintainer attention:

1. **Arrow UUID support** — open since 2024 and still active  
   This is a long-running interoperability gap that affects standard analytical exchange formats.  
   [Issue #72639](https://github.com/ClickHouse/ClickHouse/issues/72639)

2. **Unexpected `system.errors` after successful insert** — open since 2023  
   Even if not catastrophic, this undermines operational signal quality and can confuse monitoring/alerting.  
   [Issue #51175](https://github.com/ClickHouse/ClickHouse/issues/51175)

3. **Detached execution for non-readonly queries** — open since February, strategically useful  
   The feature has strong practical value for async ingestion and API-driven workflows and likely needs focused review to avoid stalling.  
   [PR #96823](https://github.com/ClickHouse/ClickHouse/pull/96823)

4. **Warning on full-file reads for non-range-capable URLs in ORC/Parquet/Arrow**  
   Useful for cloud/object-storage efficiency and user transparency; important but easy to overlook.  
   [PR #96988](https://github.com/ClickHouse/ClickHouse/pull/96988)

5. **Parameterized view explicit schema v2**  
   Important for SQL object stability and likely to matter for more advanced schema-controlled deployments.  
   [PR #98708](https://github.com/ClickHouse/ClickHouse/pull/98708)

---

## Bottom Line

ClickHouse is showing **strong forward momentum**, especially around **SQL compatibility, Iceberg integration, MergeTree hardening, and CI quality infrastructure**. The biggest near-term risk remains **stability in edge-case execution paths**—notably the analyzer, distributed query processing, and Iceberg DDL handling. The most consequential strategic signal today is the push toward **cross-dialect SQL transpilation**, which could significantly broaden adoption if it matures. In short: the project is healthy and fast-moving, but still carrying meaningful reliability debt in newer subsystems.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-16

## 1. Today's Overview

DuckDB showed strong day-to-day development activity, with **14 issues** and **14 PRs** updated in the last 24 hours, indicating an actively triaged and fast-moving codebase. The dominant theme is **post-1.5.0 stabilization**, especially around **query planner/optimizer correctness**, **Parquet/S3 performance regressions**, and several **crash-level bugs**. Maintainers and contributors are responding quickly: multiple fresh bug reports already have linked fix PRs or were closed within a day. Overall project health remains good, but the current signal is that **v1.5.0 introduced a cluster of regressions affecting cloud data access, window-query rewrites, and some operational paths**.

## 2. Project Progress

### Merged/closed PRs today

#### 1. CLI rendering fix for `.tables`
- **PR #21389** — [CLI: Fix .tables rendering for large database names](https://github.com/duckdb/duckdb/pull/21389)
- Status: **Closed**
- Impact: fixes a CLI usability and correctness problem where large database names could be truncated incorrectly and even trigger an internal error. This improves **SQLite-style CLI compatibility** and shell stability for multi-database workflows.

#### 2. Parquet reader correctness fix for skip handling
- **PR #21298** — [parquet: avoid corrupting define buffers during skips](https://github.com/duckdb/duckdb/pull/21298)
- Status: **Closed**
- Impact: addresses a low-level Parquet read-path correctness issue involving reuse of definition/repetition buffers during skip operations. This is important for **storage engine robustness** and helps reduce the risk of subtle corruption or malformed decode behavior in nested/repeated Parquet data.

#### 3. Lazy-fetch decision improvement in Parquet scans
- **PR #21383** — [Parquet: Ignore optional filters when deciding whether or not to do a lazy fetch](https://github.com/duckdb/duckdb/pull/21383)
- Status: **Closed**
- Impact: improves scan planning by preventing optional filters from interfering with lazy-fetch decisions once a row group is already known to be needed. This is a **query execution/storage optimization refinement** and likely helps avoid unnecessary work in some Parquet query plans.

### What this says about progress
Today’s completed work was concentrated on:
- **CLI stability**
- **Parquet reader correctness**
- **Parquet scan planning efficiency**

That mix suggests DuckDB is prioritizing both user-facing polish and deep storage engine reliability.

## 3. Community Hot Topics

### 1. Time zone and DST semantics
- **Issue #20845** — [DuckDB doesn't preserve UTC offset when adding a day to timestamptz column](https://github.com/duckdb/duckdb/issues/20845)  
  Labels: Needs Documentation, expected behavior  
  Comments: **7**

This is the most discussed issue in the set and points to a recurring analytical-database pain point: **calendar arithmetic on `TIMESTAMPTZ` across DST boundaries**. The user expectation is around preserving apparent wall-clock/calendar semantics, while DuckDB appears to normalize to a valid instant in the named time zone. The “expected behavior” label suggests this may be more of a **semantic/documentation gap** than a bug, but it clearly indicates users want sharper guarantees and guidance for timezone-sensitive analytics.

### 2. Crash in indexed table creation
- **Issue #21390** — [CREATE INDEX fails with free(): corrupted unsorted chunks](https://github.com/duckdb/duckdb/issues/21390)  
  Comments: **5**

A memory-corruption-style crash in `CREATE INDEX` is one of the most severe items today. This reflects demand for **more production-grade DDL/index reliability**, especially where users rely on primary keys or indexed structures during ingestion.

### 3. S3/hive-partition regression after 1.5.0
- **Issue #21348** — [`QUALIFY ROW_NUMBER() OVER (...) = 1` causes ~50x more S3 requests in 1.5.0](https://github.com/duckdb/duckdb/issues/21348)  
  Comments: **5**, 👍 **2**
- **Issue #21347** — [Hive partition filters discover all files before pruning in 1.5.0](https://github.com/duckdb/duckdb/issues/21347)  
  Comments: **2**, 👍 **2**
- **Issue #21385** — [CREATE VIEW with S3-Bucket, Hive-Partitioned Parquet Data takes very long | v1.5.0 Regression](https://github.com/duckdb/duckdb/issues/21385)

These issues together form the clearest community hot spot: **remote object storage efficiency regressed in 1.5.0**, especially for hive-partitioned Parquet over S3. The underlying technical need is better **partition pruning before file discovery**, more efficient **Top-N/window planning**, and reduced HTTP request amplification in cloud-native analytical workflows.

### 4. Optimizer-related internal errors
- **Issue #21372** — [INTERNAL Error: Failed to bind column reference (inequal types)](https://github.com/duckdb/duckdb/issues/21372)
- **Issue #21387** — [INTERNAL Error: row_number() with multi-column PARTITION BY causes incorrect column type binding](https://github.com/duckdb/duckdb/issues/21387)
- **PR #21386** — [Fix invalid common subplan CTE reuse for issue #21372](https://github.com/duckdb/duckdb/pull/21386)
- **PR #21388** — [Fix incorrect column binding in TopN window elimination with multi-column PARTITION BY](https://github.com/duckdb/duckdb/pull/21388)

This cluster shows active pressure on the optimizer from increasingly complex SQL workloads. Users are hitting edge cases in **window rewrites**, **CTE/subplan reuse**, and **binding remaps**. The positive signal is that these reports received near-immediate fix proposals.

## 4. Bugs & Stability

Ranked roughly by severity:

### Critical

#### 1. `CREATE INDEX` memory corruption / abort
- **Issue #21390** — [CREATE INDEX fails with free(): corrupted unsorted chunks](https://github.com/duckdb/duckdb/issues/21390)
- Severity: **Critical**
- Why: crash with allocator corruption messages (`free(): corrupted unsorted chunks`, `corrupted double-linked list`) suggests a serious memory safety issue in index creation or related DDL paths.
- Fix PR: **None listed yet**

#### 2. Database copy crash in 1.5.0
- **Issue #21392** — [`COPY FROM DATABASE one TO two` crashes on DuckDB v1.5.0](https://github.com/duckdb/duckdb/issues/21392)
- Severity: **Critical**
- Why: crash during full-database copy affects backup/migration workflows and can block operational use.
- Fix PR: none yet, but relevant work may relate to checkpointing:
  - **PR #21382** — [Checkpoint transactions](https://github.com/duckdb/duckdb/pull/21382)

### High

#### 3. S3 request explosion / major remote query regression
- **Issue #21348** — [`QUALIFY ROW_NUMBER() OVER (...) = 1` causes ~50x more S3 requests in 1.5.0](https://github.com/duckdb/duckdb/issues/21348)
- Severity: **High**
- Why: not a correctness bug, but a major **cloud cost and latency regression**.
- Related issue: **#21347**
- Possible related fixes:
  - **PR #21383** — [Parquet: Ignore optional filters when deciding whether or not to do a lazy fetch](https://github.com/duckdb/duckdb/pull/21383)
  - **PR #21375** — [Add row group skipping support for MAP columns in Parquet reader](https://github.com/duckdb/duckdb/pull/21375)

#### 4. Hive partition discovery before pruning in 1.5.0
- **Issue #21347** — [Hive partition filters discover all files before pruning in 1.5.0](https://github.com/duckdb/duckdb/issues/21347)
- Severity: **High**
- Why: directly affects object-store scalability and interactive performance for partitioned lakehouse datasets.
- Fix PR: none explicitly linked yet

#### 5. ADBC interleaved query stream failure
- **Issue #21384** — [ADBC interface: stream.get_next() fails with interleaved queries since DuckDB 1.5](https://github.com/duckdb/duckdb/issues/21384)
- Severity: **High**
- Why: connector/API regression affecting Arrow ADBC workflows and client-side concurrent/interleaved query handling.
- Fix PR: none yet

### Medium

#### 6. Internal planner/binder errors on window queries
- **Issue #21387** — [row_number() with multi-column PARTITION BY causes incorrect column type binding](https://github.com/duckdb/duckdb/issues/21387)
- Fix PR: **PR #21388** — [Fix incorrect column binding in TopN window elimination with multi-column PARTITION BY](https://github.com/duckdb/duckdb/pull/21388)

#### 7. Internal error from common subplan/CTE reuse
- **Issue #21372** — [INTERNAL Error: Failed to bind column reference (inequal types)](https://github.com/duckdb/duckdb/issues/21372)
- Fix PR: **PR #21386** — [Fix invalid common subplan CTE reuse for issue #21372](https://github.com/duckdb/duckdb/pull/21386)

#### 8. `WHERE` clause timestamp conversion inconsistency
- **Issue #20708** — [timestamp conversion failed when using sql where clause but it is correct under select clause](https://github.com/duckdb/duckdb/issues/20708)
- Severity: **Medium**
- Why: query semantics appear inconsistent between projection and filtering, potentially a coercion or binder issue.
- Fix PR: none shown

#### 9. In-memory `COMPRESS` option unavailable via `duckdb.connect()`
- **Issue #21342** — [COMPRESS option not supported via duckdb.connect() for in-memory databases](https://github.com/duckdb/duckdb/issues/21342)
- Severity: **Medium**
- Why: feature inconsistency rather than a crash; matters for API parity and memory-sensitive users.

### Lower severity / resolved today

#### 10. CLI `.tables` crash/rendering issue
- **Issue #21378** — [duckdb cli 1.5.x ".tables" probably with sqlite and "-table" output issues](https://github.com/duckdb/duckdb/issues/21378)
- Status: **Closed**
- Related PR: **#21389**

#### 11. JSON→VARIANT unsigned integer incompatibility with Parquet export
- **Issue #21311** — [`JSON -> VARIANT` stores non-negative JSON integers as `UINT64`, which breaks Parquet `VARIANT` export](https://github.com/duckdb/duckdb/issues/21311)
- Status: **Closed**
- Importance: relevant for semi-structured data pipelines and Parquet interoperability.

#### 12. WAL checkpoint blocked by `enable_external_access=false`
- **Issue #21335** — [`enable_external_access=false` blocks WAL checkpoint on persistent databases](https://github.com/duckdb/duckdb/issues/21335)
- Status: **Closed**
- Importance: security configuration should not break internal durability operations.
- Related future hardening: **PR #21382**

## 5. Feature Requests & Roadmap Signals

### 1. Early trigger support is emerging
- **PR #21265** — [Add parsing support for `CREATE TRIGGER` statements](https://github.com/duckdb/duckdb/pull/21265)

This is a clear roadmap signal. The PR only adds parsing, with execution still unsupported, but it suggests growing interest in **broader SQL DDL compatibility**. This is likely part of a multi-step effort and may not land fully in the next release, but syntax-level groundwork is underway.

### 2. Better filter pushdown for realistic timestamp predicates
- **PR #21350** — [introducing TryPushdownRelaxedFilter](https://github.com/duckdb/duckdb/pull/21350)

This reflects user demand for **practical optimizer improvements** on time-series workloads, especially when expressions involve `now()` and timezone-aware casts. If accepted, this could materially improve scan pruning in operational analytics tables.

### 3. More complete Geospatial/GeoParquet compatibility
- **PR #21333** — [Read geoparquet file with null CRS. Fix #21332](https://github.com/duckdb/duckdb/pull/21333)

DuckDB continues to receive feature pressure from geospatial users. Supporting GeoParquet files with null CRS aligns with interoperability expectations and could plausibly make the next release if review completes soon.

### 4. More aggressive Parquet scan optimization
- **PR #21375** — [Add row group skipping support for MAP columns in Parquet reader](https://github.com/duckdb/duckdb/pull/21375)

This points to ongoing investment in **Parquet storage efficiency**. It is the kind of incremental but meaningful optimization likely to appear in a near-term release.

### 5. Runtime performance via function multi-versioning
- **PR #20439** — [Enable Function Multi-Versioning (FMV) for Vector Operations (GCC-only)](https://github.com/duckdb/duckdb/pull/20439)

This is a deeper engine-level performance enhancement. It is more ambitious and likely needs careful review, but it signals a roadmap toward **CPU-specific vectorized execution tuning**.

### 6. Toolchain modernization
- **PR #21310** — [Bumping C++ Standard to 17](https://github.com/duckdb/duckdb/pull/21310)

This is a notable platform signal. Moving to C++17 would affect embedders, extension authors, and build environments. It may not be user-visible as a feature, but it strongly suggests infrastructure modernization in an upcoming development cycle.

### Likely next-version candidates
Based on freshness and issue pressure, the most likely short-term candidates are:
- optimizer fixes for **window/TopN/binder regressions** via [#21388](https://github.com/duckdb/duckdb/pull/21388) and [#21386](https://github.com/duckdb/duckdb/pull/21386)
- **checkpoint/copy stability** hardening via [#21382](https://github.com/duckdb/duckdb/pull/21382)
- **GeoParquet null-CRS compatibility** via [#21333](https://github.com/duckdb/duckdb/pull/21333)
- **Parquet scan optimizations** via [#21375](https://github.com/duckdb/duckdb/pull/21375)

## 6. User Feedback Summary

User feedback today highlights a few very practical pain points:

- **Cloud/lakehouse users are sensitive to request amplification.** The S3 regression reports show that users closely monitor HTTP call counts and wall-clock performance, not just query results. For DuckDB’s remote analytics use cases, efficient **file discovery and partition pruning** are mission-critical.
- **Users expect optimizer rewrites to be invisible and safe.** Several internal errors arise from advanced rewrites around window functions and subplans. This indicates users are running increasingly sophisticated SQL and expect planner transformations to preserve correctness.
- **Connector/API stability matters.** The ADBC interleaving issue shows DuckDB is being embedded in richer Arrow-native workflows where stream lifecycle behavior must be reliable.
- **Operational commands must be production-safe.** Crashes in `CREATE INDEX` and `COPY FROM DATABASE` hit trust in maintenance and migration workflows.
- **Semantics/documentation around temporal behavior remain important.** The DST/timestamptz issue shows users care not only about raw performance but also about precise temporal semantics in analytics.

Overall, users appear highly engaged and are using DuckDB in:
- local analytical SQL
- remote Parquet/S3 querying
- Arrow/ADBC integrations
- migration/copy/backup workflows
- geospatial and semi-structured data processing

## 7. Backlog Watch

These items look important for maintainer attention:

### Older issue resurfacing with active discussion
- **Issue #20845** — [DuckDB doesn't preserve UTC offset when adding a day to timestamptz column](https://github.com/duckdb/duckdb/issues/20845)
- Why watch: created in early February, still active, and touches a subtle but important semantic area. Even if behavior is intentional, stronger docs/examples may be needed.

### Older correctness issue still open
- **Issue #20708** — [timestamp conversion failed when using sql where clause but it is correct under select clause](https://github.com/duckdb/duckdb/issues/20708)
- Why watch: created in January and still open; appears to describe inconsistent type conversion behavior in filtering.

### Significant open PR needing maintainer review
- **PR #20439** — [Enable Function Multi-Versioning (FMV) for Vector Operations (GCC-only)](https://github.com/duckdb/duckdb/pull/20439)
- Why watch: open since January; potentially high-performance impact, but substantial engine complexity and portability implications.

### Open infra/toolchain change with ecosystem implications
- **PR #21310** — [Bumping C++ Standard to 17](https://github.com/duckdb/duckdb/pull/21310)
- Why watch: affects contributors, extension authors, and downstream embedders; deserves clear migration notes and timing communication.

### High-severity new reports without visible fixes yet
- **Issue #21390** — [CREATE INDEX fails with free(): corrupted unsorted chunks](https://github.com/duckdb/duckdb/issues/21390)
- **Issue #21392** — [`COPY FROM DATABASE one TO two` crashes on DuckDB v1.5.0](https://github.com/duckdb/duckdb/issues/21392)
- **Issue #21384** — [ADBC interface: stream.get_next() fails with interleaved queries since DuckDB 1.5](https://github.com/duckdb/duckdb/issues/21384)

These likely deserve immediate maintainer prioritization because they affect **safety, reliability, and ecosystem integrations**.

---

## Overall Health Assessment

DuckDB remains highly active and responsive, with evidence of rapid bug-to-fix turnaround. The main concern today is a concentration of **1.5.0 regressions**, especially in **S3/hive-partition workflows**, **window-function optimizer rewrites**, and **crash-level operational paths**. The encouraging sign is that contributors are already landing or proposing targeted fixes, so this looks more like an intense stabilization phase than a slowdown in project momentum.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-16

## 1. Today's Overview

StarRocks showed **healthy engineering activity** over the last 24 hours, with **22 PRs updated** and **5 issues updated**, although there were **no new releases**. The day’s work was concentrated in three clear areas: **Iceberg connector correctness and pushdown improvements**, **shared-data/storage reliability**, and **query/runtime bug fixes**. Open PR volume remains high, with several changes labeled for **4.1** and some backports targeting **3.5/4.0**, suggesting active stabilization across maintained branches. Overall, the project looks **busy and forward-moving**, with a mix of new feature work, correctness fixes, and operational hardening.

## 2. Project Progress

### Merged/closed PRs today

Several PRs were merged or closed, reflecting progress in SQL correctness, replication reliability, and developer tooling.

- **LIKE escape sequence correctness fix completed**
  - [PR #69775](https://github.com/StarRocks/starrocks/pull/69775) — **[BugFix] Fix incorrect LIKE pattern matching with backslash escape sequences**
  - [PR #69839](https://github.com/StarRocks/starrocks/pull/69839) — backport to **3.5.15**
  - Impact: This is a meaningful **SQL compatibility and query correctness** improvement. Queries using escaped `\`, `\%`, or similar patterns could previously return wrong results; the fix reduces risk for text-heavy workloads and improves ANSI-like expectations.

- **Shared-data replication documentation/update closed**
  - [PR #70260](https://github.com/StarRocks/starrocks/pull/70260) — **Add file integrity verification for shared-data cross-cluster replication with non-segment file copy (backport #70093)**
  - Impact: Even though this specific item is a closed doc/backport PR, it signals that StarRocks is actively hardening **cross-cluster replication** around **file integrity verification**, retries, and corruption/truncation handling for non-segment files.

- **MacOS developer/test compatibility cleanup**
  - [PR #70288](https://github.com/StarRocks/starrocks/pull/70288) — **Make types_core_test work on MacOS**
  - [PR #70287](https://github.com/StarRocks/starrocks/pull/70287) — **Make common_test work on MacOS**
  - Impact: These are not end-user features, but they improve **portability and contributor productivity**, which often translates into healthier CI and easier community contribution.

- **Variant parquet access-path optimization PR iteration**
  - [PR #70289](https://github.com/StarRocks/starrocks/pull/70289) — closed due to title/metadata issue
  - Follow-up open replacement: [PR #70291](https://github.com/StarRocks/starrocks/pull/70291)
  - Impact: The quick replacement suggests active work on **variant/parquet reader efficiency**, especially avoiding unnecessary materialization of shredded typed columns.

### Overall progress themes
Today’s closed work points to:
- better **SQL semantics correctness**
- stronger **shared-data replication robustness**
- continued **developer environment maintenance**
- active iteration on **semi-structured data scan efficiency**

## 3. Community Hot Topics

### 1) Iceberg predicate pushdown is the hottest technical cluster today
- [Issue #70294](https://github.com/StarRocks/starrocks/issues/70294) — **Support numeric widening cast in Iceberg predicate pushdown**
- [PR #70295](https://github.com/StarRocks/starrocks/pull/70295) — implementation
- [Issue #70292](https://github.com/StarRocks/starrocks/issues/70292) — **Iceberg AND compound predicate partial pushdown**
- [PR #70293](https://github.com/StarRocks/starrocks/pull/70293) — implementation
- [PR #69825](https://github.com/StarRocks/starrocks/pull/69825) — **Skip Iceberg REPLACE snapshots in IVM incremental refresh**

**Analysis:**  
This cluster of issues/PRs shows a sustained push to make the **Iceberg connector more production-grade**, especially for optimizer pushdown and incremental maintenance. The underlying user need is clear: **federated/open-table-format queries must behave predictably and efficiently**, without silent pushdown failures due to typing mismatches or overly conservative predicate conversion logic.

### 2) Shared-data architecture continues to receive significant attention
- [PR #70286](https://github.com/StarRocks/starrocks/pull/70286) — **Enable file bundling for multi-statement transactions**
- [PR #70187](https://github.com/StarRocks/starrocks/pull/70187) — **support dummy select _CACHE_STATS_ in shared-data cluster**
- [PR #70260](https://github.com/StarRocks/starrocks/pull/70260) — replication file integrity verification backport/doc work

**Analysis:**  
StarRocks is still investing heavily in **shared-data mode**, especially around transaction log application, file bundling, replication safety, and observability. This suggests growing adoption in environments where **object storage, cluster replication, and small-file management** are operational bottlenecks.

### 3) External connectivity and ecosystem expansion
- [PR #70297](https://github.com/StarRocks/starrocks/pull/70297) — **Add ADBC (Arrow Flight SQL) external catalog connector**

**Analysis:**  
This is one of the clearest roadmap signals today. ADBC/Arrow Flight SQL support points toward lower-latency, modern analytics connectivity and broader interoperability with external systems. The note about missing CI integration tests also highlights a recurring challenge: **connector feature velocity is outpacing test infrastructure support**.

### 4) Long-running bug with real user impact: Iceberg null partition handling
- [Issue #63029](https://github.com/StarRocks/starrocks/issues/63029) — **IcebergTable Partition tableName error with null partition values**  
  Comments: 13

**Analysis:**  
This is the most obviously discussed issue in the supplied set. It points to a subtle but important **partition metadata correctness problem** in Iceberg integration, especially affecting **materialized view ingestion**. The technical need here is reliability in mixed/null partition scenarios, which are common in lakehouse deployments.

## 4. Bugs & Stability

Ranked by likely severity and user impact:

### High severity

1. **CN crash when scanning empty tablet with physical split enabled**
   - [PR #70281](https://github.com/StarRocks/starrocks/pull/70281)
   - Risk: **SIGSEGV / crash**
   - Scope: compute node scan path on empty tablets with physical split enabled
   - Status: fix is open
   - Why it matters: This is a direct **stability** issue, likely affecting some edge-case distributed scan plans.

2. **Standalone sstable fileset mismatch after persistent index reload**
   - [PR #70210](https://github.com/StarRocks/starrocks/pull/70210)
   - Risk: compaction failure with `"no matching sstable fileset found for compaction"`
   - Scope: storage engine / persistent index / compaction path
   - Status: fix is open
   - Why it matters: This touches storage consistency and could degrade write/compaction health over time.

3. **Explicit transaction state loss on FE leader switch**
   - [PR #70285](https://github.com/StarRocks/starrocks/pull/70285)
   - Risk: silent COMMIT/ROLLBACK failure, stale transaction state, potential NPE
   - Scope: FE leadership changes, transactional correctness
   - Status: fix is open
   - Why it matters: Leader switch scenarios are operationally sensitive; correctness bugs here can be painful in production.

### Medium severity

4. **Iceberg null partition value offset bug**
   - [Issue #63029](https://github.com/StarRocks/starrocks/issues/63029)
   - Risk: incorrect partition interpretation and downstream ingestion errors
   - Scope: Iceberg partition handling, materialized view ingestion
   - Status: open, no linked fix in provided data
   - Why it matters: Impacts correctness in lakehouse integration, especially for null-heavy partition schemas.

5. **IVM incremental refresh fails on Iceberg REPLACE snapshots**
   - [PR #69825](https://github.com/StarRocks/starrocks/pull/69825)
   - Risk: incremental refresh failure under compaction-enabled Iceberg tables
   - Scope: materialized views / IVM over Iceberg
   - Status: open
   - Why it matters: Important for users relying on efficient incremental maintenance in mixed StarRocks-lakehouse pipelines.

6. **Outer join stats bug affecting null fractions**
   - [PR #70144](https://github.com/StarRocks/starrocks/pull/70144)
   - Risk: bad cardinality estimates and potentially poor query plans
   - Scope: optimizer statistics propagation
   - Status: open
   - Why it matters: Not a crash, but can materially hurt performance and plan quality.

### Recently resolved

7. **Incorrect LIKE matching with backslash escapes**
   - [PR #69775](https://github.com/StarRocks/starrocks/pull/69775)
   - [PR #69839](https://github.com/StarRocks/starrocks/pull/69839)
   - Status: fixed and backported
   - Significance: Important **query correctness** issue now addressed.

8. **Java UDF StackOverflow issue**
   - [Issue #70262](https://github.com/StarRocks/starrocks/issues/70262)
   - Status: closed
   - Notes: The supplied data does not include the closing rationale, but closure suggests either a fix, invalidation, or redirection.

## 5. Feature Requests & Roadmap Signals

### Strong signals likely relevant for the next version

1. **More capable Iceberg predicate pushdown**
   - [Issue #70294](https://github.com/StarRocks/starrocks/issues/70294)
   - [PR #70295](https://github.com/StarRocks/starrocks/pull/70295)
   - [Issue #70292](https://github.com/StarRocks/starrocks/issues/70292)
   - [PR #70293](https://github.com/StarRocks/starrocks/pull/70293)

These changes are narrowly scoped, high-value, and already have implementation PRs. They are good candidates for the **next 4.1 patch/minor train** because they improve both performance and practical usability without being massive architectural changes.

2. **ADBC / Arrow Flight SQL external catalog connector**
   - [PR #70297](https://github.com/StarRocks/starrocks/pull/70297)

This looks like a more visible feature addition. If review proceeds and CI/test gaps are resolved, it could become an important **ecosystem/connectivity feature** in an upcoming release, especially for users standardizing on Arrow-native data access.

3. **Variant/parquet access-path pushdown**
   - [PR #70291](https://github.com/StarRocks/starrocks/pull/70291)

This is a strong roadmap signal for **semi-structured analytics optimization**. Expect continued work here as StarRocks improves selective reading for variant columns stored in parquet with shredded layouts.

4. **Shared-data transaction bundling**
   - [PR #70286](https://github.com/StarRocks/starrocks/pull/70286)

Likely to matter for users with heavy ingest workloads in shared-data mode. This has the flavor of a practical, deployable enhancement that could land soon if test coverage and correctness checks are adequate.

## 6. User Feedback Summary

The updated issues and PRs reveal several concrete user pain points:

- **Iceberg interoperability remains a top user concern**
  - Null partition handling, numeric literal casting, partial predicate pushdown, and REPLACE snapshot semantics all point to a common story: users expect StarRocks to operate smoothly over **external lakehouse tables** without hidden optimizer or metadata edge cases.
  - Relevant items:
    - [Issue #63029](https://github.com/StarRocks/starrocks/issues/63029)
    - [Issue #70294](https://github.com/StarRocks/starrocks/issues/70294)
    - [Issue #70292](https://github.com/StarRocks/starrocks/issues/70292)
    - [PR #69825](https://github.com/StarRocks/starrocks/pull/69825)

- **Operational resilience in shared-data deployments matters**
  - File integrity verification, file bundling, cache stats, and transaction correctness on leader switch all suggest users are running StarRocks in more distributed, cloud-style deployments where **object storage behavior, replication, and failover correctness** are daily concerns.
  - Relevant items:
    - [PR #70286](https://github.com/StarRocks/starrocks/pull/70286)
    - [PR #70187](https://github.com/StarRocks/starrocks/pull/70187)
    - [PR #70260](https://github.com/StarRocks/starrocks/pull/70260)
    - [PR #70285](https://github.com/StarRocks/starrocks/pull/70285)

- **Users still hit correctness bugs before performance bugs**
  - LIKE escaping, join null-fraction stats, transaction state loss, and crash-on-empty-tablet all indicate that reliability and correctness remain core expectations from the community.
  - Relevant items:
    - [PR #69775](https://github.com/StarRocks/starrocks/pull/69775)
    - [PR #70144](https://github.com/StarRocks/starrocks/pull/70144)
    - [PR #70281](https://github.com/StarRocks/starrocks/pull/70281)
    - [PR #70285](https://github.com/StarRocks/starrocks/pull/70285)

- **Documentation and polish are still actively maintained**
  - [Issue #70296](https://github.com/StarRocks/starrocks/issues/70296)
  - [PR #70248](https://github.com/StarRocks/starrocks/pull/70248)

This indicates the project is not only shipping engine changes but also maintaining reader feedback loops.

## 7. Backlog Watch

These items appear to merit maintainer attention due to age, production relevance, or lack of a visible fix in the supplied data:

1. **Iceberg null partition value bug**
   - [Issue #63029](https://github.com/StarRocks/starrocks/issues/63029)
   - Why watch: Open since **2025-09-11**, with user discussion and real ingestion impact. This seems like a meaningful connector correctness issue that has not yet been visibly resolved.

2. **IVM refresh failure on Iceberg REPLACE snapshots**
   - [PR #69825](https://github.com/StarRocks/starrocks/pull/69825)
   - Why watch: Open since **2026-03-05**; important for users combining Iceberg compaction with incremental view maintenance.

3. **Outer join null-fraction preservation**
   - [PR #70144](https://github.com/StarRocks/starrocks/pull/70144)
   - Why watch: Optimizer stats bugs can silently hurt many workloads and are often under-prioritized compared with crashes.

4. **Persistent index reload/fileset mismatch**
   - [PR #70210](https://github.com/StarRocks/starrocks/pull/70210)
   - Why watch: Storage/compaction bugs deserve quick resolution because they can accumulate operational damage.

5. **ADBC connector CI gap**
   - [PR #70297](https://github.com/StarRocks/starrocks/pull/70297)
   - Why watch: Promising feature, but likely blocked on infrastructure/testing rather than code alone.

## 8. Overall Health Assessment

StarRocks appears **technically active and healthy**, with strong momentum in connector work, storage reliability, and correctness fixes. The most important near-term theme is **maturing Iceberg integration**, while the longer strategic signal is expansion into **modern external connectivity** through Arrow Flight SQL / ADBC. The main risk area remains the accumulation of **edge-case correctness and operational bugs** in shared-data and lakehouse scenarios, but the open PR stream suggests maintainers are actively addressing them.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-16

## 1) Today's Overview

Apache Iceberg showed moderate development activity over the last 24 hours: 14 PRs were updated, 5 PRs were merged or closed, and 4 issues were updated, with only 1 remaining open. The day’s activity was weighted more toward ongoing feature work and maintenance than toward release execution, as no new versions were published. Current engineering focus appears split across Kafka Connect improvements, Flink sink extensibility, core/parquet internals, and dependency/build upkeep. Overall project health looks stable, but one potentially important open regression around TLS hostname verification in `HTTPClient` stands out as the key active risk.

## 3) Project Progress

### Merged/closed PRs today

Most of the PRs closed today were build/dependency maintenance rather than end-user feature delivery, which suggests housekeeping and ecosystem alignment work is continuing in the background.

- [#15638](https://github.com/apache/iceberg/pull/15638) — **Build: Bump software.amazon.awssdk:bom from 2.42.8 to 2.42.13**  
  Closed dependency update for AWS SDK BOM. This helps keep Iceberg aligned with current AWS client libraries, which matters for object-store integrations and REST/catalog deployments using AWS services.

- [#15637](https://github.com/apache/iceberg/pull/15637) — **Build: Bump com.google.cloud:libraries-bom from 26.77.0 to 26.78.0**  
  Closed dependency refresh for Google Cloud libraries, supporting cloud storage/catalog compatibility over time.

- [#15636](https://github.com/apache/iceberg/pull/15636) — **Build: Bump nessie from 0.107.3 to 0.107.4**  
  Closed Nessie client dependency bump, relevant to users relying on Nessie-backed catalogs and branch/tag-based table workflows.

- [#14791](https://github.com/apache/iceberg/pull/14791) — **Build: Bump datamodel-code-generator from 0.36.0 to 0.41.0**  
- [#14962](https://github.com/apache/iceberg/pull/14962) — **Build: Bump datamodel-code-generator from 0.49.0 to 0.52.1**  
  These older OpenAPI/build-related PRs were closed, indicating cleanup/supersession in the code generation toolchain rather than net-new functionality.

### What this means technically

There were no merged query-engine-facing fixes or storage optimizations in the closed set today. However, active open PRs suggest near-term progress in:
- **Kafka Connect CDC/upsert behavior and routing correctness**
- **Flink sink composability/extensibility**
- **Core utility correctness**
- **V4 manifest writing enhancements for Parquet/Avro**

So while today’s closed work was mostly maintenance, the active queue contains substantial engine and storage roadmap movement.

## 4) Community Hot Topics

### 1. REST fixture catalog exception behavior
- [Issue #13915](https://github.com/apache/iceberg/issues/13915) — **REST Fixture Catalog throws misleading exceptions during successful operations**  
  Comments: 11

This was the most commented issue in the set. The underlying need is better correctness and developer ergonomics in test/fixture catalog behavior, especially where successful operations appear to throw `NoSuchNamespaceException` or `NoSuchViewException`. Even though the issue is now closed as stale, it points to a recurring concern: fixture/test catalogs should mirror production semantics closely enough that client authors can trust integration results.

### 2. Kafka Connect delta writer / deletion vector mode
- [PR #14797](https://github.com/apache/iceberg/pull/14797) — **Implement Iceberg Kafka Connect with Delta Writer Support in DV Mode for in-batch deduplication**

This is one of the strongest roadmap signals in today’s queue. It targets CDC and upsert workflows, especially for Kafka Connect users needing deduplication and deletion-vector-assisted write patterns. The technical demand behind it is clear: streaming ingestion users want lower-latency mutation handling without requiring heavy rewrite cycles.

### 3. Flink sink extensibility for downstream composition
- [PR #15316](https://github.com/apache/iceberg/pull/15316) — **Flink: Add extensibility support to IcebergSink for downstream composition**

This PR reflects demand from connector builders and platform teams that need to enrich sink pipelines with custom metadata. The proposed `CommittableMetadata` extension point indicates a push toward a more composable sink architecture rather than one-size-fits-all connector behavior.

### 4. Kafka Connect multi-topic routing correctness
- [PR #15639](https://github.com/apache/iceberg/pull/15639) — **Fix multi-topic routing to prevent writing all records to all tables**

This is a high-value correctness fix for operators using multi-topic ingestion. The core user need is safe topic-to-table isolation in shared connector deployments, especially where schemas and key columns overlap.

### 5. Snapshot isolation understanding
- [Issue #13974](https://github.com/apache/iceberg/issues/13974) — **Understanding Snapshot Isolation Level**

Although closed as stale, this question highlights a continuing community need for clearer documentation around Iceberg’s concurrency model, especially for `MERGE INTO`, concurrent writers, and serializable vs snapshot isolation semantics in Spark-heavy deployments.

## 5) Bugs & Stability

Ranked by likely severity and operational impact:

### High severity
- [Issue #15598](https://github.com/apache/iceberg/issues/15598) — **HTTPClient: regression in TLS hostname verification** — **OPEN**  
  This is the most important active issue today. The report suggests a regression between Iceberg 1.10 and the upcoming 1.11 release in TLS handling, specifically around `HTTPClient` and `TLSConfigurer.hostnameVerifier()`. If confirmed, this could affect secure REST/catalog connectivity and break production integrations or weaken expected TLS behavior.  
  **Fix PR identified?** None in the provided data.

### Medium severity
- [PR #15639](https://github.com/apache/iceberg/pull/15639) — **Fix multi-topic routing to prevent writing all records to all tables** — **OPEN**  
  Not an issue report, but it addresses a serious correctness problem in Kafka Connect: records from different topics could be broadcast to multiple tables when route-field was unset and schemas/id-columns aligned. This has direct data corruption or misrouting implications in ingestion pipelines.  
  **Fix PR exists?** Yes, this PR itself is the proposed fix.

- [Issue #15602](https://github.com/apache/iceberg/issues/15602) — **Spark query failure while using SPJ** — **CLOSED**  
  A Spark merge failure with SPJ enabled was reported against 1.10.1. The issue was closed quickly, but with the provided data it is unclear whether it was resolved, redirected, or deemed invalid/duplicate.  
  **Fix PR identified?** None in the provided data.

### Lower severity / developer-experience stability
- [Issue #13915](https://github.com/apache/iceberg/issues/13915) — **REST fixture catalog throws misleading exceptions** — **CLOSED**  
  More of a fixture/testing correctness issue than a production outage, but still important for client compatibility testing and reducing false negatives in integrations.

- [PR #15558](https://github.com/apache/iceberg/pull/15558) — **Core: fix propertiesWithPrefix to strip prefix literally, not as regex** — **OPEN**  
  This appears to fix a subtle but real correctness bug in property parsing. Prefixes containing regex-special characters can currently produce silent mismatches or malformed keys. This impacts configuration reliability and could lead to difficult-to-debug behavior.  
  **Fix PR exists?** Yes.

## 6) Feature Requests & Roadmap Signals

Several open PRs provide stronger roadmap signals than the issue queue today.

### Likely near-term features/enhancements

- [PR #14797](https://github.com/apache/iceberg/pull/14797) — **Kafka Connect delta writer support in DV mode**  
  Strong candidate for future release inclusion because it addresses CDC, upserts, and in-batch deduplication—key adoption scenarios for streaming data platforms.

- [PR #15316](https://github.com/apache/iceberg/pull/15316) — **Flink sink extensibility support**  
  Likely to matter for integrators and downstream connector authors. This kind of API/extensibility work often lands when maintainers want to reduce pressure for one-off sink customizations.

- [PR #15634](https://github.com/apache/iceberg/pull/15634) — **Allow writing Parquet/Avro manifests in V4**  
  This is a notable storage-engine signal. Extending V4 manifest writing to support Parquet or Avro based on file extension suggests ongoing evolution of manifest format flexibility and potential optimization/default behavior changes in newer table versions or SDK paths.

- [PR #14928](https://github.com/apache/iceberg/pull/14928) — **docs: replace minio with rustfs in quick start**  
  While only documentation, it reflects ecosystem repositioning: local/object-store examples are adapting as MinIO moves into maintenance mode.

### What may appear in the next version

Most plausible candidates for the next release, based on current momentum:
1. Kafka Connect routing/correctness improvements
2. Core utility correctness fixes like literal prefix stripping
3. Potential V4 manifest-writing enhancements
4. Possibly early pieces of richer Kafka Connect CDC/DV support if review completes in time

## 7) User Feedback Summary

Today’s user-facing signals point to a few recurring pain points:

- **Secure connectivity regressions are highly sensitive**  
  The TLS hostname verification report shows that catalog/client transport behavior remains critical for enterprise users. Even small regressions here can block upgrades.

- **Streaming and CDC workflows are a major priority**  
  Kafka Connect PRs around delta writing, deduplication, and topic routing indicate that users are pushing Iceberg deeper into operational ingestion pipelines, not just batch analytics.

- **Concurrency semantics remain hard to reason about**  
  The snapshot isolation question suggests users still want clearer guidance on how concurrent writes and `MERGE INTO` behave in real Spark deployments.

- **Spark merge/query compatibility remains a live concern**  
  The SPJ-related failure report reinforces that advanced Spark execution modes still generate edge cases that matter to production users.

- **Configuration correctness matters more than it appears**  
  The `propertiesWithPrefix` regex-related bug is the kind of low-level issue that creates confusing downstream behavior, especially in systems with many prefixed options.

Overall, user demand seems strongest around **operational correctness**, **streaming ingestion reliability**, and **clearer semantics for advanced write paths**.

## 8) Backlog Watch

These items appear to need maintainer attention due to age, scope, or potential impact:

- [PR #14797](https://github.com/apache/iceberg/pull/14797) — **Kafka Connect delta writer support in DV mode**  
  Open since 2025-12-08. This is strategically important for CDC/upsert users and has been in flight a long time.

- [PR #14928](https://github.com/apache/iceberg/pull/14928) — **Replace MinIO with RustFS in quick start docs**  
  Open since 2025-12-25. Documentation drift in quickstarts can materially affect first-time user experience.

- [PR #15316](https://github.com/apache/iceberg/pull/15316) — **Flink sink extensibility support**  
  Open and marked stale despite being a meaningful architectural enhancement for downstream composition.

- [PR #15389](https://github.com/apache/iceberg/pull/15389) — **Rename cleanUpOnCommitFailure to cleanUp**  
  Smaller in scope, but still worth resolution to reduce lingering API/internal naming debt.

- [Issue #15598](https://github.com/apache/iceberg/issues/15598) — **TLS hostname verification regression**  
  Not the oldest item, but the most urgent active issue from an operational-risk perspective. It likely deserves prompt triage ahead of broader feature work.

---

## Bottom Line

Iceberg’s current activity suggests a healthy but maintenance-heavy day, with the most meaningful forward signals coming from open work in Kafka Connect, Flink sink extensibility, and V4 manifest support. The project continues to invest in streaming ingestion and connector correctness, which aligns with real-world adoption trends. The primary short-term concern is the open TLS regression, while the primary medium-term opportunity is landing long-running connector and sink enhancements that support CDC, deduplication, and richer downstream integration.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-16

## 1. Today's Overview

Delta Lake showed **light-to-moderate pull request activity** over the last 24 hours, with **10 PRs updated**, **8 still open**, and **2 closed**, while **no issues were updated** and **no releases were published**. The day’s work was concentrated on **Spark integration**, **Kernel/V2 connector correctness**, **catalog behavior**, and **test/CI setup**, which suggests the project is currently in a **stabilization and forward-integration phase** rather than a release announcement cycle. Several open PRs point to ongoing investment in **query planning accuracy**, **filter pushdown**, and **Unity Catalog-related managed table behavior**. Overall, project health looks steady: maintainers and contributors are actively refining internals, but there is **limited visible user-reported issue traffic today**.

## 3. Project Progress

### Merged/closed PRs today

#### 1) Fix reference equality on String in `DeletionVectorDescriptor.isInline()`
- PR: [#6265](https://github.com/delta-io/delta/pull/6265)
- Status: Closed
- Technical area: **storage correctness / deletion vectors**
- What changed:
  - Fixes a classic Java correctness bug where `==` was used instead of `.equals()` for string comparison on `storageType`.
  - This affects `DeletionVectorDescriptor.isInline()`, a low-level path relevant to Delta’s deletion vector handling.
- Why it matters:
  - This is a **query/storage correctness safeguard**. Incorrect detection of inline deletion vectors could lead to wrong behavior when reading row-level deletion metadata.
  - Even if impact is situational, the bug sits in a sensitive metadata path and is therefore important from a reliability perspective.

#### 2) Add HTTP retry logic for transient failures in SSP client
- PR: [#6274](https://github.com/delta-io/delta/pull/6274)
- Status: Closed
- Technical area: **catalog/client resilience**
- What changed:
  - Adds retry logic in `IcebergRESTCatalogPlanningClient` for transient HTTP failures.
  - Handles cases like temporary network interruptions or server-side 5xx responses.
- Why it matters:
  - This is a **stability and availability improvement**, especially for deployments depending on remote catalog services.
  - It reduces avoidable query failures caused by infrastructure noise rather than actual data or engine problems.

### Other active progress signals

#### UC managed table checkpoint property enforcement
- PR: [#6229](https://github.com/delta-io/delta/pull/6229)
- Signals:
  - Sets `delta.checkpoint.writeStatsAsJson=false`
  - Sets `delta.checkpoint.writeStatsAsStruct=true`
- Interpretation:
  - This is a **storage metadata format optimization/standardization** for Unity Catalog managed tables.
  - It likely improves consistency and potentially downstream efficiency for checkpoint stats consumption.

#### Decimal type mismatch fix in V2 connector filter pushdown
- PR: [#6285](https://github.com/delta-io/delta/pull/6285)
- Signals:
  - Fixes mismatch between literal decimal precision/scale and declared column type during filter pushdown into Kernel.
- Interpretation:
  - This is a **query correctness and SQL type compatibility** improvement.
  - Important for analytical workloads where decimal predicates are common in finance and reporting.

#### Statistics estimation and filter pushdown enhancements
- PR: [#6101](https://github.com/delta-io/delta/pull/6101)
- PR: [#6103](https://github.com/delta-io/delta/pull/6103)
- Interpretation:
  - `estimateStatistics()` row-count reporting from per-file stats improves **query planning quality**.
  - Adding `IN` filter pushdown support improves **predicate pushdown coverage** and likely scan efficiency.

## 4. Community Hot Topics

There were **no issues updated today**, and the supplied data does not include comment/reaction counts beyond placeholders, so “hot topics” must be inferred from **recently active PR themes** rather than visible discussion volume.

### 1) Unity Catalog managed table behavior and staging catalog support
- [#6229](https://github.com/delta-io/delta/pull/6229) — Set checkpoint stat serialization properties for UC managed tables
- [#6166](https://github.com/delta-io/delta/pull/6166) — Extend `stagingCatalog` for non-Spark session catalog
- [#6233](https://github.com/delta-io/delta/pull/6233) — Temporary UC-main test setup
- Underlying technical need:
  - Delta contributors are clearly working through **catalog interoperability**, **managed table defaults**, and **test coverage for UC-oriented flows**.
  - This suggests ongoing demand for more robust behavior across **Spark catalogs**, **Unity Catalog integration**, and potentially **atomic table creation/replacement scenarios**.

### 2) Kernel/V2 connector pushdown correctness
- [#6285](https://github.com/delta-io/delta/pull/6285) — Decimal type mismatch fix
- [#6103](https://github.com/delta-io/delta/pull/6103) — `IN` filter pushdown
- Underlying technical need:
  - Users want Delta’s **connector stack** to preserve SQL semantics while still pushing predicates deeply enough for performance.
  - The work indicates attention to the hard edge between **Spark logical expressions**, **Kernel evaluation**, and **type system fidelity**.

### 3) Better query planning statistics
- [#6101](https://github.com/delta-io/delta/pull/6101) — Report `numRows` in `estimateStatistics()` using per-file stats
- Underlying technical need:
  - Better cardinality/statistics estimates are central to **join planning**, **cost-based optimization**, and reducing scan inefficiency.
  - This is a meaningful signal that Delta is still improving not just storage but **optimizer-facing metadata quality**.

## 5. Bugs & Stability

Ranked by likely impact based on the supplied summaries:

### High severity

#### Decimal type mismatch in V2 connector filter pushdown
- PR: [#6285](https://github.com/delta-io/delta/pull/6285)
- Severity: **High**
- Risk:
  - Kernel expression evaluation can fail when decimal literal types do not exactly match schema column types.
  - This can cause **query failures** on valid SQL predicates.
- Status:
  - **Fix is open**, not yet merged.
- Why important:
  - Type mismatch bugs in predicate evaluation are both **correctness** and **usability** issues, especially in BI and financial workloads.

### Medium severity

#### Missing retry behavior for transient HTTP failures in catalog planning client
- PR: [#6274](https://github.com/delta-io/delta/pull/6274)
- Severity: **Medium**
- Risk:
  - Infrastructure blips can fail queries immediately.
- Status:
  - **Closed**, indicating progress toward better resilience.
- Why important:
  - Important for cloud-native deployments and remote metadata services.

#### Incorrect string equality in deletion vector inline detection
- PR: [#6265](https://github.com/delta-io/delta/pull/6265)
- Severity: **Medium**
- Risk:
  - Potential misclassification of deletion vector storage type due to Java reference equality misuse.
- Status:
  - **Closed**
- Why important:
  - Bugs in deletion-vector metadata handling can have outsized reliability implications.

### Low severity / observability

#### Silent exception swallowing in `fetchCatalogPrefix`
- PR: [#6273](https://github.com/delta-io/delta/pull/6273)
- Severity: **Low to Medium**
- Risk:
  - Makes debugging catalog-related failures harder by suppressing useful signal.
- Status:
  - **Open**
- Why important:
  - Not a correctness fix by itself, but materially improves diagnosability and operational support.

## 6. Feature Requests & Roadmap Signals

No new user issues were logged today, so roadmap signals come from active PRs.

### Likely near-term areas for the next version

#### 1) Stronger Spark + Kernel pushdown support
- [#6103](https://github.com/delta-io/delta/pull/6103)
- [#6285](https://github.com/delta-io/delta/pull/6285)
- Prediction:
  - Expect continued work on **predicate pushdown coverage** and **type-safe expression translation** in the next release line.

#### 2) Better optimizer statistics exposure
- [#6101](https://github.com/delta-io/delta/pull/6101)
- Prediction:
  - Delta may ship improved **statistics estimation behavior** to help Spark make better planning decisions.

#### 3) Catalog and Unity Catalog integration hardening
- [#6166](https://github.com/delta-io/delta/pull/6166)
- [#6233](https://github.com/delta-io/delta/pull/6233)
- [#6229](https://github.com/delta-io/delta/pull/6229)
- Prediction:
  - Catalog-aware table operations and UC-specific defaults look like a strong roadmap thread.
  - These changes are especially plausible candidates for inclusion in the upcoming **4.2.0** development cycle, reinforced by:
    - [#6256](https://github.com/delta-io/delta/pull/6256) — Change master version to `4.2.0-SNAPSHOT`

## 7. User Feedback Summary

There is **no direct user issue feedback in today’s data**, so user pain points must be inferred from the engineering work underway.

### Inferred pain points

- **Catalog interoperability remains a practical concern**
  - Seen in [#6166](https://github.com/delta-io/delta/pull/6166), [#6233](https://github.com/delta-io/delta/pull/6233), and [#6229](https://github.com/delta-io/delta/pull/6229).
  - Likely reflects real deployment complexity across Spark session catalogs and Unity Catalog-managed environments.

- **Users need predicate pushdown to be both fast and correct**
  - Seen in [#6285](https://github.com/delta-io/delta/pull/6285) and [#6103](https://github.com/delta-io/delta/pull/6103).
  - Typical pain point: performance features become liabilities if SQL type semantics are not preserved.

- **Operational reliability matters in distributed metadata environments**
  - Seen in [#6274](https://github.com/delta-io/delta/pull/6274) and [#6273](https://github.com/delta-io/delta/pull/6273).
  - Implies user sensitivity to transient network failure handling and poor observability during catalog interactions.

- **Planning quality still matters for large analytical tables**
  - Seen in [#6101](https://github.com/delta-io/delta/pull/6101).
  - Suggests demand for more accurate row-count/statistics propagation into Spark planning.

## 8. Backlog Watch

These items appear important and still need maintainer attention due to age, stack complexity, or broad impact.

### 1) Extend staging catalog for non-Spark session catalog
- PR: [#6166](https://github.com/delta-io/delta/pull/6166)
- Age: Open since 2026-03-02
- Why watch:
  - Appears foundational and tied to a stacked series of work.
  - Could unlock or block broader catalog compatibility and atomic operation workflows.

### 2) Report `numRows` in `estimateStatistics()` using per-file stats
- PR: [#6101](https://github.com/delta-io/delta/pull/6101)
- Age: Open since 2026-02-22
- Why watch:
  - Long-running optimizer/statistics improvements often have meaningful downstream impact on query performance.
  - Worth maintainer review because planning improvements can benefit many workloads.

### 3) Add `IN` filter pushdown to ExpressionUtils
- PR: [#6103](https://github.com/delta-io/delta/pull/6103)
- Age: Open since 2026-02-22
- Why watch:
  - Broadly useful feature with clear performance upside.
  - Pushdown changes need careful semantic review, so prolonged open status is understandable but notable.

### 4) Temporary UC-main test setup
- PR: [#6233](https://github.com/delta-io/delta/pull/6233)
- Why watch:
  - CI/test scaffolding PRs can be easy to deprioritize, but they often gate higher-level functionality.
  - Important if UC-related changes are a current strategic focus.

### 5) Warning logging in `fetchCatalogPrefix` exception handler
- PR: [#6273](https://github.com/delta-io/delta/pull/6273)
- Why watch:
  - Small observability fixes often deliver outsized support value.
  - Good candidate for quick maintainer attention.

## Linked Items Referenced

- [PR #6229](https://github.com/delta-io/delta/pull/6229)
- [PR #6285](https://github.com/delta-io/delta/pull/6285)
- [PR #6256](https://github.com/delta-io/delta/pull/6256)
- [PR #6265](https://github.com/delta-io/delta/pull/6265)
- [PR #6273](https://github.com/delta-io/delta/pull/6273)
- [PR #6274](https://github.com/delta-io/delta/pull/6274)
- [PR #6233](https://github.com/delta-io/delta/pull/6233)
- [PR #6166](https://github.com/delta-io/delta/pull/6166)
- [PR #6101](https://github.com/delta-io/delta/pull/6101)
- [PR #6103](https://github.com/delta-io/delta/pull/6103)

**Bottom line:** Delta Lake had a quiet day externally but a meaningful day internally: no issue churn, no releases, and a clear focus on **catalog integration**, **query pushdown correctness**, **metadata/statistics quality**, and **operational resilience**.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-16

## 1. Today's Overview

Databend showed moderate code activity over the last 24 hours, with **9 pull requests updated**, **4 merged/closed**, **5 still open**, and **no issue activity**. The day’s work was concentrated on the **query engine**, especially execution behavior, SQL predicate handling, runtime filtering, and internal shuffle mechanics, with additional movement on **experimental table versioning features** and **index read optimization**. A new nightly release was published, but its release notes contain only a single targeted bug fix, suggesting this was a relatively incremental snapshot rather than a major milestone. Overall project health looks stable: maintainers are actively landing correctness and performance-oriented fixes, while also advancing larger in-flight features.

## 2. Releases

### New release: [v1.2.889-nightly](https://github.com/databendlabs/databend/releases/tag/v1.2.889-nightly)

This nightly includes one explicit bug fix:

- **Query correctness / aggregate state handling**
  - “fix(query): avoid reinitializing nullable aggregate states during merge”
  - Source PR reference in release notes: [PR #1](https://github.com/databendlabs/databend/pull/1) as generated in the provided release metadata.

#### Impact
This change appears aimed at preventing incorrect behavior during **aggregate merge phases** when **nullable aggregate states** are involved. In analytical engines, merge-stage aggregate state corruption can lead to subtle wrong results rather than obvious failures, so even a small fix here is important.

#### Breaking changes
- No breaking changes were indicated in the provided release data.

#### Migration notes
- No migration steps were indicated.
- Since this is a nightly build, users running production workloads should still validate aggregate-heavy queries, especially those involving nullable columns and distributed aggregation paths.

## 3. Project Progress

### Merged/closed PRs advancing the engine

#### 1) Runtime filter behavior refined for query pruning
- [PR #19547 — fix(query): scope runtime filter selectivity to bloom](https://github.com/databendlabs/databend/pull/19547) — Closed
- What changed:
  - `join_runtime_filter_selectivity_threshold` now applies only to **bloom runtime filters**
  - **IN-list** and **min-max runtime filters** remain usable even when bloom filters are disabled by selectivity
- Why it matters:
  - This improves planner/executor behavior by preventing an overly broad selectivity rule from disabling useful runtime filters.
  - Likely outcome: better join-time pruning consistency and less accidental regression in query performance.

#### 2) SQL predicate expansion made safer and more correct
- [PR #19546 — fix: flatten IN-list OR predicates](https://github.com/databendlabs/databend/pull/19546) — Closed
- What changed:
  - Prevents **stack overflow** when very large `IN` lists are expanded under high `max_inlist_to_or`
  - Preserves `IN` / `NOT IN` **NULL semantics** while avoiding a deeply nested OR tree
- Why it matters:
  - This is both a **stability fix** and a **SQL correctness fix**.
  - It directly addresses a classic optimizer/expression-rewriter failure mode in analytical SQL engines handling large predicate lists.

#### 3) Query execution internals refactored around shuffle
- [PR #19505 — refactor(query): refactor hash shuffle](https://github.com/databendlabs/databend/pull/19505) — Closed
- Why it matters:
  - Hash shuffle is central to distributed execution for joins and aggregations.
  - Even without a user-visible feature, this likely improves maintainability and may unblock future performance work or correctness fixes in parallel/distributed query plans.

#### 4) SQL compilation fix landed quickly
- [PR #19550 — fix(sql): add missing SExpr import in type_check.rs](https://github.com/databendlabs/databend/pull/19550) — Closed
- Why it matters:
  - This appears minor, but quick closure suggests maintainers are keeping parser/planner/type-checking code paths healthy.
  - It likely prevented build or compile-time issues in SQL analysis components.

### Open PRs showing active forward progress

#### 5) Recursive CTE execution becoming more streaming-oriented
- [PR #19545 — refactor: make Recursive CTE execution more streaming-oriented](https://github.com/databendlabs/databend/pull/19545) — Open
- Signal:
  - Important roadmap work for recursive query support and memory behavior.
  - The mention of a Sudoku query suggests the current implementation struggles with certain recursive workloads.

#### 6) Storage/index I/O optimization
- [PR #19552 — feat: optimize small bloom index reads](https://github.com/databendlabs/databend/pull/19552) — Open
- Signal:
  - Reduces repeated reads by loading eligible files once and decoding metadata and filters from one in-memory buffer.
  - This is a practical storage-engine optimization likely aimed at reducing small-read overhead in object storage environments.

#### 7) Experimental table branching and tagging
- [PR #19551 — feat(query): support experimental table branch](https://github.com/databendlabs/databend/pull/19551) — Open
- [PR #19549 — feat(query): support experimental table tags for FUSE table snapshots](https://github.com/databendlabs/databend/pull/19549) — Open
- Signal:
  - Databend is actively moving toward richer **table snapshot lineage/version control semantics**.
  - This is an important differentiator for data workflows needing reproducibility, branching, and checkpoint-like access.

#### 8) Meta/dependency consolidation
- [PR #19513 — chore: upgrade databend-meta to v260304.0.0 and consolidate dependencies](https://github.com/databendlabs/databend/pull/19513) — Open
- Signal:
  - Internal dependency cleanup continues, especially around meta-service APIs and crate boundaries.
  - Good sign for maintainability, though it can also increase review complexity.

## 4. Community Hot Topics

There were **no issues updated**, and the provided PR metadata shows **no reactions** and no comment counts. So “hot topics” today are inferred from technical significance and recency rather than discussion volume.

### Most technically significant active PRs

#### [PR #19545 — Recursive CTE streaming refactor](https://github.com/databendlabs/databend/pull/19545)
**Underlying need:** recursive SQL needs to scale beyond toy examples and avoid materialization-heavy execution.  
**Why it matters:** users increasingly expect recursive CTEs to work for graph-like traversals, hierarchy expansion, and puzzle/pathfinding style workloads without exhausting memory.

#### [PR #19552 — Optimize small bloom index reads](https://github.com/databendlabs/databend/pull/19552)
**Underlying need:** object-store-backed analytical engines often suffer from many tiny metadata/index reads.  
**Why it matters:** this indicates ongoing work to reduce I/O amplification and improve pruning efficiency for storage-backed scans.

#### [PR #19549 — Experimental table tags for FUSE snapshots](https://github.com/databendlabs/databend/pull/19549)
#### [PR #19551 — Experimental table branch](https://github.com/databendlabs/databend/pull/19551)
**Underlying need:** users want Git-like data lifecycle operations over table snapshots.  
**Why it matters:** this points to growing demand for reproducible analytics, isolated experimentation, and version-aware table management.

## 5. Bugs & Stability

Ranked by likely severity based on impact to correctness, crashes, or execution reliability.

### High severity

#### 1) Large `IN`-list expansion could cause stack overflow
- [PR #19546](https://github.com/databendlabs/databend/pull/19546) — Closed
- Risk:
  - Potential **crash/failure** during query planning or expression rewriting when `IN` lists become very large.
  - Also touches SQL `NULL` semantics, so correctness was at stake.
- Status:
  - Fix exists and was closed today.

#### 2) Nullable aggregate state merge bug in nightly release
- Release: [v1.2.889-nightly](https://github.com/databendlabs/databend/releases/tag/v1.2.889-nightly)
- Risk:
  - Potential **wrong results** during aggregate merges involving nullable states.
- Status:
  - Fix included in latest nightly.

### Medium severity

#### 3) Runtime filter selectivity applied too broadly
- [PR #19547](https://github.com/databendlabs/databend/pull/19547) — Closed
- Risk:
  - Performance degradation or suboptimal join pruning if useful runtime filters were disabled unintentionally.
- Status:
  - Fix exists and was closed.

#### 4) Missing `SExpr` import in SQL type checker
- [PR #19550](https://github.com/databendlabs/databend/pull/19550) — Closed
- Risk:
  - Build or type-check path issue, probably low end-user impact unless it blocked development/testing.
- Status:
  - Fixed.

### No new issue-reported regressions today
- There were **no updated issues** in the last 24 hours, so no externally reported new regressions are visible from the provided data.

## 6. Feature Requests & Roadmap Signals

No explicit user-filed feature requests were updated today, but the open PR stream gives strong roadmap hints.

### Likely near-term feature directions

#### Experimental branch/tag semantics for tables
- [PR #19551](https://github.com/databendlabs/databend/pull/19551)
- [PR #19549](https://github.com/databendlabs/databend/pull/19549)
- Prediction:
  - These are strong candidates for upcoming nightly exposure and possibly later guarded release rollout.
  - Expect syntax and metadata model iteration before broad recommendation.

#### Better recursive query execution
- [PR #19545](https://github.com/databendlabs/databend/pull/19545)
- Prediction:
  - Recursive CTE support is likely an active roadmap theme.
  - Near-term gains may focus on execution model and memory usage before broader SQL feature expansion.

#### More efficient index/filter I/O
- [PR #19552](https://github.com/databendlabs/databend/pull/19552)
- Prediction:
  - Storage pruning and object-store efficiency remain a high-priority area.
  - This kind of change often shows up in release notes as performance improvements rather than headline features.

## 7. User Feedback Summary

There is **no direct issue-based user feedback** in the provided 24-hour window. However, engineering activity reveals likely user pain points:

- **Large predicate handling**
  - The fix in [PR #19546](https://github.com/databendlabs/databend/pull/19546) suggests users or maintainers encountered real workloads with large `IN` lists that stressed planner/expression rewriting.

- **Recursive SQL execution limits**
  - The motivation in [PR #19545](https://github.com/databendlabs/databend/pull/19545) implies demand for more robust recursive query support, especially for workloads that are currently too materialization-heavy.

- **Data versioning / reproducibility**
  - The branch/tag work in [PR #19549](https://github.com/databendlabs/databend/pull/19549) and [PR #19551](https://github.com/databendlabs/databend/pull/19551) signals user interest in snapshot-oriented workflows, likely for experimentation, rollback, and reproducible analytics.

- **Scan pruning efficiency**
  - The optimization in [PR #19552](https://github.com/databendlabs/databend/pull/19552) suggests continued sensitivity to metadata/index read overhead, especially in cloud/object-storage deployments.

Overall, today’s signals point less to broad dissatisfaction and more to **maturing engine behavior under advanced analytical workloads**.

## 8. Backlog Watch

With no issue activity, backlog attention is best focused on open PRs that appear strategically important or potentially long-running.

### Needs maintainer attention

#### [PR #19513 — upgrade databend-meta and consolidate dependencies](https://github.com/databendlabs/databend/pull/19513)
- Open since: 2026-03-06
- Why watch:
  - Cross-cutting dependency and meta-layer changes can block other work and tend to become harder to review over time.
  - This is the oldest open PR in the current set.

#### [PR #19545 — make Recursive CTE execution more streaming-oriented](https://github.com/databendlabs/databend/pull/19545)
- Open since: 2026-03-12
- Why watch:
  - High strategic value for SQL completeness and execution scalability.
  - Refactors in execution engines benefit from timely review to avoid drift.

#### [PR #19549 — support experimental table tags for FUSE table snapshots](https://github.com/databendlabs/databend/pull/19549)
- Open since: 2026-03-13
- Why watch:
  - This appears foundational for table version/tag semantics and likely interacts with metadata model choices.

#### [PR #19551 — support experimental table branch](https://github.com/databendlabs/databend/pull/19551)
- Open since: 2026-03-15
- Why watch:
  - Closely related to tagging and may need coordinated review with snapshot/tag architecture.

---

## Bottom line

Databend’s 2026-03-16 activity was **healthy and engineering-focused**, with no new issue churn, one small nightly release, and several meaningful query-engine fixes landing. The strongest current themes are **query correctness**, **execution robustness**, **runtime pruning behavior**, and **experimental table versioning features**. If these open PRs continue progressing, the next near-term releases are likely to improve both **advanced SQL execution** and **reproducible data workflow capabilities**.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-16

## 1. Today’s Overview

Velox showed **moderate-to-high development activity** over the last 24 hours, with **20 pull requests updated** and **3 merged/closed**, while issue volume remained low with **1 newly updated open issue**. The day’s work leaned toward **engine maintainability, serialization cleanup, CI/testing improvements, and targeted correctness/performance fixes**, rather than large end-user feature drops. A notable theme is continued investment in **Spark/Gluten interoperability, Iceberg delete semantics, memory behavior under lazy loading, and IO preloading for small DWRF files**. Overall, project health looks solid: merge flow is active, many PRs are in a **ready-to-merge** state, and there are early signals of upcoming **time/timestamp type evolution**.

## 3. Project Progress

### Merged / closed PRs today

#### 1) Vector serde API cleanup
- **PR #16772** — [refactor: Add name getter to VectorSerde classes](https://github.com/facebookincubator/velox/pull/16772) — **Merged**
- Impact: improves the serialization/deserialization API by exposing serde kind names through typed accessors instead of hardcoded strings.
- Why it matters: this is a small but useful maintainability improvement for components that select or report serde implementations such as **PrestoVectorSerde, CompactRowVectorSerde, and UnsafeRowVectorSerde**.

#### 2) Website / lint hygiene
- **PR #16773** — [fix: Build pre-commit lint issues in website files](https://github.com/facebookincubator/velox/pull/16773) — **Merged**
- Impact: no engine feature change, but it restores clean pre-commit behavior for website assets.
- Why it matters: keeps contributor workflow healthy and avoids friction in CI.

#### 3) StreamArena correctness cleanup
- **PR #16717** — [fix: Fix redundant prefix increment before assignment in StreamArena](https://github.com/facebookincubator/velox/pull/16717) — **Merged**
- Impact: removes a no-op increment in `StreamArena::newRange()`.
- Why it matters: low-risk correctness/clarity cleanup in memory-related code; unlikely to change behavior materially, but reduces confusion in a sensitive subsystem.

### Other notable in-flight progress

#### Query correctness and SQL compatibility
- **PR #16588** — [fix: Fix cast sum(decimal(18,4)) to float precision miss](https://github.com/facebookincubator/velox/pull/16588)
- Addresses a **Spark/Gluten result mismatch** around `CAST(SUM(decimal) AS float)`, a high-value SQL compatibility area for production users.

#### Iceberg semantics
- **PR #16775** — [Add sequence number conflict resolution for equality deletes](https://github.com/facebookincubator/velox/pull/16775)
- Implements **Iceberg V2+ equality delete application rules** based on sequence numbers, which is important for correctness under concurrent writes.

#### Memory / execution stability
- **PR #16774** — [fix: Pre-load lazy probe input vectors before the non-reclaimable probe loop](https://github.com/facebookincubator/velox/pull/16774)
- Targets memory arbitration and lazy loading timing, aiming to reduce failures during probe-side processing.

#### Storage / IO optimization
- **PR #16768** — [feat: Add native preload support to DirectBufferedInput and CachedBufferedInput](https://github.com/facebookincubator/velox/pull/16768)
- Optimizes reads for **small DWRF files** by enabling whole-file preload in more buffered input implementations.

#### Unicode/string performance
- **PR #16428** — [perf: Optimize cappedLengthUnicode and cappedByteLengthUnicode with SIMD](https://github.com/facebookincubator/velox/pull/16428)
- Accelerates hot paths used by **Iceberg truncate** logic, especially for non-ASCII data.

## 4. Community Hot Topics

Because the provided data contains **no comment-heavy or reaction-heavy threads**, “hot topics” are inferred from the **technical importance and recency** of active items rather than social engagement.

### 1) Spark timestamp representation mismatch
- **Issue #16776** — [[enhancement] [Spark] Add new Timestamp represents microseconds](https://github.com/facebookincubator/velox/issues/16776)
- Technical need: Spark uses an **`int64_t` microsecond timestamp representation**, while Velox currently relies on the Presto-style **`int128_t` Timestamp** in this context.
- Underlying pain point: the current workaround in Gluten shuffle increases data size and adds serialization/deserialization overhead.
- Likely significance: this is a strong signal that **cross-engine binary compatibility and memory footprint** remain key adoption blockers for Spark-native integrations.

### 2) Iceberg delete correctness under concurrency
- **PR #16775** — [Add sequence number conflict resolution for equality deletes](https://github.com/facebookincubator/velox/pull/16775)
- Technical need: proper interpretation of **Iceberg equality deletes** according to sequence-number ordering rules.
- Why it matters: this is foundational for correctness in lakehouse workloads with concurrent appends/deletes.

### 3) Native preload for small DWRF files
- **PR #16768** — [Add native preload support to DirectBufferedInput and CachedBufferedInput](https://github.com/facebookincubator/velox/pull/16768)
- Technical need: reduce fragmented IO and improve read efficiency for small files.
- Why it matters: small-file behavior is a common pain point in analytical storage systems, especially in data lake workloads.

### 4) Time type extension groundwork
- **PR #16662** — [misc: Prepare for time type extension](https://github.com/facebookincubator/velox/pull/16662)
- Technical need: support additional **time precisions and timezone-related behaviors** safely.
- Why it matters: this indicates roadmap movement toward broader SQL temporal type compatibility.

## 5. Bugs & Stability

Ranked by likely severity based on the summaries provided.

### High severity

#### A) Decimal aggregate cast precision mismatch
- **PR #16588** — [fix: Fix cast sum(decimal(18,4)) to float precision miss](https://github.com/facebookincubator/velox/pull/16588)
- Severity: **High**
- Reason: query result correctness issues are among the most serious classes of bugs in an analytical engine.
- Context: explicitly described as a **Gluten + Velox vs Spark result difference**, suggesting production-facing compatibility risk.
- Fix status: **Open, ready-to-merge**.

#### B) Lazy-loading / memory arbitration failure in probe loop
- **PR #16774** — [fix: Pre-load lazy probe input vectors before the non-reclaimable probe loop](https://github.com/facebookincubator/velox/pull/16774)
- Severity: **High**
- Reason: appears tied to execution-time failures involving lazy vectors and memory reclaim timing.
- Fix status: **Open**.

### Medium severity

#### C) Iceberg equality delete conflict resolution gap
- **PR #16775** — [Add sequence number conflict resolution for equality deletes](https://github.com/facebookincubator/velox/pull/16775)
- Severity: **Medium-High**
- Reason: can lead to incorrect application of delete files in concurrent-write scenarios.
- Fix status: **Open**.

#### D) StreamArena code defect / confusing no-op increment
- **PR #16717** — [fix: Fix redundant prefix increment before assignment in StreamArena](https://github.com/facebookincubator/velox/pull/16717)
- Severity: **Medium-Low**
- Reason: code smell in memory code, but summary suggests more cleanup than user-visible malfunction.
- Fix status: **Merged**.

### Low severity / process stability

#### E) Website lint / pre-commit failures
- **PR #16773** — [fix: Build pre-commit lint issues in website files](https://github.com/facebookincubator/velox/pull/16773)
- Severity: **Low**
- Reason: contributor workflow issue, not runtime engine behavior.
- Fix status: **Merged**.

#### F) Intentional CI breakage experiment
- **PR #16771** — [Break LimitTest to test CI test discovery](https://github.com/facebookincubator/velox/pull/16771)
- Severity: **Low operational risk, high signal for CI quality**
- Note: explicitly marked **DO NOT LAND**; not a product bug, but worth watching to ensure experimental CI work does not linger.

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### Spark-native microsecond timestamp type
- **Issue #16776** — [[enhancement] [Spark] Add new Timestamp represents microseconds](https://github.com/facebookincubator/velox/issues/16776)
- Signal: strong demand from **Spark/Gluten integration** users.
- Prediction: likely to influence a near-term compatibility-focused release, especially if shuffle and binary interchange efficiency are priorities.

#### Expanded time type support
- **PR #16662** — [misc: Prepare for time type extension](https://github.com/facebookincubator/velox/pull/16662)
- Signal: clear preparatory work for **additional precisions and timezone behaviors**.
- Prediction: likely precursor to future SQL type-system enhancements.

#### MarkDistinct robustness and fuzzing
- **PR #16600** — [feat: Add MarkDistinct Fuzzer](https://github.com/facebookincubator/velox/pull/16600)
- Signal: emphasis on validating planner/operator correctness against DuckDB and internal consistency checks.
- Prediction: while not user-facing, this can improve confidence in future releases for DISTINCT-related query paths.

#### cuDF CI maturation
- **PR #15700** — [feat(cudf): Run tests in CI](https://github.com/facebookincubator/velox/pull/15700)
- **PR #16752** — [feat(cudf): Update cudf and related dependency pins to 2026-03-12](https://github.com/facebookincubator/velox/pull/16752)
- Signal: GPU-related integration remains active and is moving toward stronger CI validation.
- Prediction: expect incremental reliability gains for the cuDF integration rather than a major standalone feature announcement.

#### CI and dependency image modernization
- **PR #16667** — [feat(ci): Move gh action installs to the dependency image](https://github.com/facebookincubator/velox/pull/16667)
- Signal: maintainers are reducing CI setup overhead and standardizing environments.
- Prediction: faster and more reliable contributor/merge workflows.

## 7. User Feedback Summary

Today’s visible user pain points are mostly inferred from issue/PR problem statements:

- **Spark/Gluten compatibility remains a major theme**, especially around timestamp representation and numeric result parity.
  - Timestamp overhead concern: [Issue #16776](https://github.com/facebookincubator/velox/issues/16776)
  - Decimal aggregate cast mismatch: [PR #16588](https://github.com/facebookincubator/velox/pull/16588)

- **Lakehouse correctness matters**, especially for Iceberg delete semantics in concurrent environments.
  - Relevant: [PR #16775](https://github.com/facebookincubator/velox/pull/16775)

- **Performance sensitivity is still centered on storage and string processing hot paths**.
  - DWRF preload optimization: [PR #16768](https://github.com/facebookincubator/velox/pull/16768)
  - SIMD Unicode truncate optimization: [PR #16428](https://github.com/facebookincubator/velox/pull/16428)

- **Operational stability under memory pressure** remains important.
  - Lazy probe preload fix: [PR #16774](https://github.com/facebookincubator/velox/pull/16774)

There is **little explicit sentiment data** today: no issue or PR in the dataset shows significant comments or reactions, so user satisfaction must be inferred from the kinds of fixes being prioritized rather than direct feedback volume.

## 8. Backlog Watch

These items appear to merit maintainer attention due to age, readiness, or strategic importance.

### Older or strategically important open PRs

#### 1) cuDF CI test enablement
- **PR #15700** — [feat(cudf): Run tests in CI](https://github.com/facebookincubator/velox/pull/15700)
- Status: open since **2025-12-04**
- Why watch: old but strategically important for GPU integration reliability.

#### 2) Semi-join test randomization cleanup
- **PR #15748** — [fix: Use VectorFuzzer for random RowVector generation in semiJoinDeduplicateResetCapacity](https://github.com/facebookincubator/velox/pull/15748)
- Status: open since **2025-12-11**
- Why watch: aging test-quality fix; not flashy, but stale test infrastructure PRs often need explicit reviewer attention.

#### 3) MarkDistinct fuzzer
- **PR #16600** — [feat: Add MarkDistinct Fuzzer](https://github.com/facebookincubator/velox/pull/16600)
- Why watch: helps prevent correctness regressions in a subtle operator area.

#### 4) SIMD Unicode optimization
- **PR #16428** — [perf: Optimize cappedLengthUnicode and cappedByteLengthUnicode with SIMD](https://github.com/facebookincubator/velox/pull/16428)
- Why watch: performance-sensitive and already marked **ready-to-merge**.

#### 5) Row counting without result materialization
- **PR #16462** — [perf(test): Count result rows without accumulating the data](https://github.com/facebookincubator/velox/pull/16462)
- Why watch: useful test/memory efficiency improvement, also **ready-to-merge**.

### Emerging issue needing product direction

#### 6) Spark microsecond timestamp representation
- **Issue #16776** — [[enhancement] [Spark] Add new Timestamp represents microseconds](https://github.com/facebookincubator/velox/issues/16776)
- Why watch: could require **type-system, serde, and interoperability design decisions**, not just a local patch.

---

## Bottom line

Velox is in a **healthy, actively maintained state** with a strong stream of incremental improvements. The most meaningful current signals are around **Spark compatibility, Iceberg correctness, memory-stability fixes, and storage-path optimization**. There were no releases today, but the active queue suggests the next version could materially improve **temporal type support, interoperability, and correctness in lakehouse/query edge cases**.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-16

## 1. Today's Overview

Apache Gluten showed **moderate-to-high development activity** over the last 24 hours, with **11 pull requests updated** and **4 active issues updated**, but **no new releases**. The day’s work was concentrated in three areas: **Velox backend compatibility**, **post-TLP repository/infrastructure cleanup**, and **ongoing upstream Velox synchronization**. On the user-facing side, two newly updated issues point to **serious performance concerns** in real workloads: one around **`LIMIT` query execution overhead** and another around **S3 read scalability when executor core counts are high**. Overall, the project appears healthy and actively maintained, though performance tuning and backlog management around Velox integration remain important near-term priorities.

---

## 2. Project Progress

### Merged/closed PRs today

#### 1) GitHub CI and repository cleanup after TLP graduation
- **PR #11741** — [Update GitHub CI workflows for TLP graduation](https://github.com/apache/incubator-gluten/pull/11741) — **Closed**
- **PR #11737** — [Remove Incubating references from source code](https://github.com/apache/incubator-gluten/pull/11737) — **Closed**

These changes do not add query engine functionality directly, but they are important operationally. They complete part of the transition from **Apache Incubator** to **top-level project (TLP)** naming, updating repository URLs, workflow references, templates, and documentation. This reduces contributor friction, avoids broken links in CI and docs, and improves project hygiene for future contributors and users.

#### 2) Velox sync continues through daily update automation
- **PR #11755** — [[GLUTEN-6887][VL] Daily Update Velox Version (2026_03_13)](https://github.com/apache/incubator-gluten/pull/11755) — **Closed**

The closed daily Velox update indicates the project continues to track upstream Velox changes closely. While this specific PR is automated and not a standalone feature delivery, it is strategically important: Velox updates often bring **execution engine fixes, operator behavior changes, serialization support improvements, and optimizer/runtime enhancements** that directly affect Gluten’s Velox backend quality.

### Active feature/fix work still in flight

Several open PRs suggest near-term progress in SQL compatibility and runtime behavior:

- **PR #11720** — [Add config to disable TimestampNTZ validation fallback](https://github.com/apache/incubator-gluten/pull/11720)  
  Signals work toward **better TimestampNTZ support and reduced unnecessary Spark fallback** in Velox.

- **PR #11656** — [Add validation tests for CurrentTimestamp and now(foldable)](https://github.com/apache/incubator-gluten/pull/11656)  
  Advances **time function correctness and validation coverage**.

- **PR #11615** — [Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation](https://github.com/apache/incubator-gluten/pull/11615)  
  This is one of the most substantive open fixes, addressing **Iceberg metadata function correctness** and a **JNI stability path**, both highly relevant to production users.

- **PR #11753** — [Fix AdaptiveSparkPlanExec accessibility in columnar write optimization](https://github.com/apache/incubator-gluten/pull/11753)  
  A compatibility fix against newer Spark behavior, protecting **columnar write optimization** from planner/API changes.

---

## 3. Community Hot Topics

### 1) Tracking useful Velox PRs not yet merged upstream
- **Issue #11585** — [[VL] useful Velox PRs not merged into upstream](https://github.com/apache/incubator-gluten/issues/11585)  
  - Comments: **16**
  - Reactions: **4**

This is the most active issue in the set and is strategically important. It acts as a **community coordination tracker** for Velox patches considered valuable by Gluten contributors but not yet merged upstream. The underlying technical need is clear: Gluten depends heavily on Velox, and when upstream merges lag, the project faces a tradeoff between:
- waiting for upstream,
- carrying downstream patches,
- or manually cherry-picking with rebase cost.

This issue indicates that **upstream dependency management remains a key architectural and project-management concern** for Gluten.

### 2) Timestamp and time-function fallback behavior
- **PR #11720** — [Add config to disable TimestampNTZ validation fallback](https://github.com/apache/incubator-gluten/pull/11720)
- **PR #11656** — [Add validation tests for CurrentTimestamp and now(foldable)](https://github.com/apache/incubator-gluten/pull/11656)

These two PRs together point to an active topic: **reducing overly conservative Spark fallback in the Velox backend** while preserving correctness. The technical need here is to improve **SQL compatibility for temporal types and functions** without blocking feature development due to incomplete validator support.

### 3) TLP graduation cleanup across repo and infra
- **PR #11735** — [Update repository references from incubator-gluten to gluten after TLP graduation](https://github.com/apache/incubator-gluten/pull/11735)
- **PR #11741** — [Update GitHub CI workflows for TLP graduation](https://github.com/apache/incubator-gluten/pull/11741)
- **PR #11737** — [Remove Incubating references from source code](https://github.com/apache/incubator-gluten/pull/11737)

This cluster shows the project is still finishing its **organizational migration**. While not a runtime feature, it matters for contributor onboarding, documentation accuracy, and ecosystem integration.

---

## 4. Bugs & Stability

Ranked by apparent severity based on user impact and production risk.

### High severity

#### 1) Severe regression: Gluten over 10x slower than vanilla Spark on simple `LIMIT` query
- **Issue #11766** — [[VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries](https://github.com/apache/incubator-gluten/issues/11766)

This is the most alarming newly updated issue because it reports a **large regression on a trivial query shape**: `select * from store_sales limit 10`. If confirmed, this would imply that Gluten may introduce heavy execution/setup overhead even when Spark can optimize the query into minimal work. Such regressions are especially damaging because they affect:
- benchmark perception,
- interactive SQL workloads,
- short-query latency,
- and confidence in automatic acceleration.

**No linked fix PR is visible** in today’s data.

#### 2) S3 read performance degrades when executor core count is high
- **Issue #11765** — [[VL] AWS S3 read performance is very bad when executor.cores are big](https://github.com/apache/incubator-gluten/issues/11765)

This points to a likely **I/O scheduling, thread contention, or scan parallelism tuning issue** under object-store workloads. The issue includes tuning dimensions such as `IOThreads`, `loadQuantum`, coalescing thresholds, row-group prefetch, and preload settings, which suggests users are testing production-relevant performance knobs. This has broad importance because S3-backed lakehouse deployments are a common Gluten use case.

**No fix PR is visible** in today’s data.

### Medium severity

#### 3) Iceberg metadata functions and JNI initialization stability
- **PR #11615** — [[Iceberg] Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation](https://github.com/apache/incubator-gluten/pull/11615)

Although this is an open PR rather than a freshly reported issue, it addresses a meaningful correctness/stability area:
- `input_file_name()`
- `input_file_block_start()`
- `input_file_block_length()`
- JNI crash path
- metadata propagation

This is important for **data lake introspection, debugging, auditing, and metadata-aware queries** on Iceberg. The mention of a JNI crash path elevates its operational importance.

#### 4) Spark compatibility break in columnar write optimization
- **PR #11753** — [Fix AdaptiveSparkPlanExec accessibility in columnar write optimization](https://github.com/apache/incubator-gluten/pull/11753)

This is a compatibility/stability fix triggered by a Spark upstream change in shuffle ID retrieval. It likely impacts specific write paths rather than all query execution, so it is less severe than the performance regressions above, but still notable for users on newer Spark snapshots or versions incorporating the referenced Spark PR.

### Lower severity / quality-of-life

#### 5) TimestampNTZ validation causes unnecessary fallback
- **PR #11720** — [Add config to disable TimestampNTZ validation fallback](https://github.com/apache/incubator-gluten/pull/11720)

This is more of a **capability and developer productivity issue** than a crash/regression. Still, fallback behavior can materially affect end-user performance and feature testing.

---

## 5. Feature Requests & Roadmap Signals

### GPU shuffle reader support
- **Issue #10933** — [[VL] Support GPU shuffle reader](https://github.com/apache/incubator-gluten/issues/10933)

This is the clearest long-range feature signal in the current issue set. The request describes:
- moving lock behavior from `WholeStageResultIterator` into the shuffle reader,
- preparing the first batch in advance,
- handling decompression and resize on CPU,
- converting large batches to GPU.

This suggests interest in **deeper GPU-aware execution paths**, especially around shuffle ingestion and large-batch handling. If pursued, this could significantly improve Gluten’s relevance in **accelerated analytics deployments**.

### Better SQL temporal compatibility and fewer fallbacks
- **PR #11720** — [TimestampNTZ fallback control](https://github.com/apache/incubator-gluten/pull/11720)
- **PR #11656** — [Validation tests for CurrentTimestamp and now](https://github.com/apache/incubator-gluten/pull/11656)

These indicate a roadmap trend toward:
- expanding **Velox SQL expression support**,
- increasing confidence in validation behavior,
- minimizing unnecessary fallback to Spark.

This kind of work is often incremental and likely to appear in the **next minor release**, especially because it is testable, bounded, and user-visible.

### Data lake metadata correctness on Iceberg
- **PR #11615** — [Iceberg metadata and JNI fixes](https://github.com/apache/incubator-gluten/pull/11615)

This suggests continued investment in **Iceberg integration quality**, especially around file-level metadata functions. Because data lake interoperability is central to many Gluten deployments, this work has a strong chance of landing in an upcoming release.

### Predicted near-term candidates for next version
Most likely to land soon based on current PR maturity and practical value:
1. **Timestamp/time-function validation and fallback improvements**
2. **Iceberg metadata function correctness fixes**
3. **Spark compatibility fix for AdaptiveSparkPlanExec in columnar write optimization**
4. **Repository/TLP cleanup completion**
5. Continued **Velox version refreshes**

---

## 6. User Feedback Summary

The latest user feedback highlights several recurring production concerns:

### 1) Short-query latency still matters
- **Issue #11766** shows that users expect Gluten to outperform or at least match vanilla Spark even on **simple, low-result queries**.
- This is an important reminder that acceleration projects are judged not only on heavy scans and joins, but also on **planner overhead and fast-path execution**.

### 2) Object-store performance is highly sensitive to concurrency settings
- **Issue #11765** indicates users are exercising Gluten in **S3-based analytical clusters**, where scaling executor cores upward may worsen performance rather than improve it.
- This suggests users need either:
  - better defaults,
  - clearer tuning guidance,
  - or architectural fixes in I/O concurrency handling.

### 3) Users want fewer unnecessary fallbacks
- The open TimestampNTZ and time-function PRs suggest that users and contributors are dissatisfied when validator conservatism prevents Velox execution for otherwise workable queries.
- This is both a **performance** and **developer-experience** pain point.

### 4) Data lake users care about metadata functions and stability
- The Iceberg fix PR shows demand for compatibility with metadata-oriented SQL functions like `input_file_name()`.
- These functions are often used in operational analytics, debugging, and lineage-oriented workloads, not just edge cases.

Overall sentiment from today’s activity is that users value Gluten’s acceleration promise, but they need stronger assurances around **basic-query efficiency, cloud storage behavior, and compatibility completeness**.

---

## 7. Backlog Watch

These older or strategically important items appear to need sustained maintainer attention.

### 1) Upstream Velox dependency backlog
- **Issue #11585** — [[VL] useful Velox PRs not merged into upstream](https://github.com/apache/incubator-gluten/issues/11585)

This is a high-priority watch item because it can slow downstream feature delivery and force hard choices around patch carrying. Maintainers may need a more formal policy for:
- temporary downstream patch adoption,
- merge tracking,
- compatibility windows,
- and rebase cost management.

### 2) GPU shuffle reader support remains open since 2025
- **Issue #10933** — [[VL] Support GPU shuffle reader](https://github.com/apache/incubator-gluten/issues/10933)

This is an important strategic feature for heterogeneous compute support, but it has seen little visible discussion recently. If GPU execution is a roadmap priority, this may need clearer scoping or milestone assignment.

### 3) MacOS build enablement via VCPKG
- **PR #11563** — [[VL] Enable VCPKG for MacOS build](https://github.com/apache/incubator-gluten/pull/11563)

Open since early February, this PR touches build infrastructure and developer accessibility. It may not be urgent for production clusters, but it matters for contributor experience and local development on macOS.

### 4) Join pullout pre-project support remains WIP
- **PR #10851** — [Join support pullout pre-project](https://github.com/apache/incubator-gluten/pull/10851)

This long-running WIP PR suggests nontrivial optimizer/planner work that may still need design review or decomposition. Since join planning is central to analytical performance, long-lived WIP in this area is worth watching.

### 5) Iceberg metadata/JNI fix should not stall
- **PR #11615** — [[Iceberg] Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation](https://github.com/apache/incubator-gluten/pull/11615)

Given the correctness and stability implications, this open PR likely deserves prompt review attention.

---

## 8. Overall Health Assessment

Apache Gluten appears **active and technically forward-moving**, with steady Velox integration, compatibility work, and post-graduation repository cleanup. However, today’s issue stream reveals a meaningful gap between engine development and user-perceived performance in some scenarios, especially **simple query latency** and **S3 read scaling under high core counts**. The strongest short-term quality signals are around **temporal function compatibility**, **Iceberg metadata correctness**, and **Spark API compatibility**, while the strongest strategic signal remains the project’s reliance on and synchronization with **upstream Velox**. In summary: **healthy development pace, but performance regressions and backend integration debt should remain top maintainer focus**.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

⚠️ Summary generation failed.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*