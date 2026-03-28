# Apache Doris Ecosystem Digest 2026-03-28

> Issues: 7 | PRs: 156 | Projects covered: 10 | Generated: 2026-03-28 01:21 UTC

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

# Apache Doris Project Digest — 2026-03-28

## 1. Today's Overview

Apache Doris remained highly active over the last 24 hours, with **156 pull requests updated** and **7 issues updated**, indicating strong ongoing development velocity, especially around branch maintenance and bug fixing. There were **no new releases**, but the issue/PR stream shows concentrated work on **stability fixes, storage/file cache improvements, Parquet compatibility, authentication/security, and external table ecosystem support**. The day’s activity leans more toward **engineering hardening and backporting** than toward large headline features, although several roadmap-level items—OIDC auth, Iceberg evolution, and TSO—continue moving. Overall project health looks **active and responsive**, with multiple newly reported bugs already paired with corresponding fix PRs on the same day.

---

## 3. Project Progress

### Merged/closed PRs today: key advances

Even without a release cut, several **closed or progressed PRs** indicate meaningful forward movement in core Doris capabilities:

- **Parquet export compatibility fix**
  - PR [#61760](https://github.com/apache/doris/pull/61760) fixed a regression causing Doris exports to fail when writing **Parquet INT96 timestamps**.
  - This is important for interoperability with downstream engines and legacy Parquet consumers that still expect INT96 semantics.
  - Follow-up/backport work is already in progress via [#61832](https://github.com/apache/doris/pull/61832), [#61837](https://github.com/apache/doris/pull/61837), and [#61839](https://github.com/apache/doris/pull/61839).

- **JuiceFS treated as HDFS-compatible**
  - PR [#61031](https://github.com/apache/doris/pull/61031) was closed after integrating support to treat **`jfs://` (JuiceFS)** as HDFS-compatible in FE/BE paths.
  - This strengthens Doris’ external storage compatibility story, especially for hybrid lakehouse deployments.

- **Insert usability improvement**
  - PR [#61075](https://github.com/apache/doris/pull/61075) added configurability for **insert error message max length**.
  - This is a practical SQL usability improvement for debugging data loading failures in production.

- **JNI connector architecture refactor**
  - PR [#61084](https://github.com/apache/doris/pull/61084) refactored JNI read/write architecture to unify JDBC into the **JniReader/JniWriter framework**.
  - This reduces connector fragmentation and should improve maintainability across JDBC/Paimon/Hudi/Iceberg/MaxCompute integrations.

- **Timezone/DST correctness**
  - PR [#51454](https://github.com/apache/doris/pull/51454) was updated/closed around fixing **incorrect DST handling**.
  - Timezone correctness is critical for SQL semantics, ETL reliability, and reporting consistency.

### Open work with strong momentum

- **File cache improvements**
  - PR [#61083](https://github.com/apache/doris/pull/61083) and PR [#61833](https://github.com/apache/doris/pull/61833) improve **file cache LRU updates, partial-hit behavior, and hotspot counter memory reclamation**.
  - These are meaningful storage-engine optimizations targeting query latency and BE memory growth.

- **Authentication modernization**
  - PR [#61819](https://github.com/apache/doris/pull/61819) adds **OIDC authentication, MySQL login bridge, and role mapping**, signaling enterprise auth integration is becoming a larger focus.

- **Iceberg functionality expansion**
  - PR [#61818](https://github.com/apache/doris/pull/61818) backports **Iceberg update/delete/merge into** support.
  - PR [#61398](https://github.com/apache/doris/pull/61398) adds **Iceberg v3 row lineage** support.
  - Together these suggest stronger lakehouse interoperability is a near-term strategic direction.

---

## 4. Community Hot Topics

> Note: comment counts in the provided PR dataset are mostly unavailable (`undefined`), so “hot topics” are inferred from approval labels, branch propagation, bug-to-fix coupling, and strategic scope.

### 1) Parquet INT96 timestamp regression and rapid branch propagation
- PR [#61760](https://github.com/apache/doris/pull/61760)
- PR [#61832](https://github.com/apache/doris/pull/61832)
- PR [#61837](https://github.com/apache/doris/pull/61837)
- PR [#61839](https://github.com/apache/doris/pull/61839)

**Why it matters:**  
Parquet timestamp encoding remains a practical compatibility trap across engines. The immediate fix plus cherry-picks/backports indicate this regression affected supported branches and likely hit real export pipelines. The underlying need is **stable cross-engine data exchange**, especially in mixed Spark/Hive/Parquet ecosystems.

### 2) File cache memory and read-path correctness
- PR [#61083](https://github.com/apache/doris/pull/61083)
- PR [#61833](https://github.com/apache/doris/pull/61833)
- PR [#61812](https://github.com/apache/doris/pull/61812)
- PR [#61834](https://github.com/apache/doris/pull/61834)

**Why it matters:**  
These PRs address **partial cache hit correctness, LRU update overhead, and hotspot metadata memory growth**. This points to operator demand for **long-running cluster stability and predictable BE memory behavior**, especially in remote-storage or cache-heavy workloads.

### 3) Authentication and enterprise security
- PR [#61819](https://github.com/apache/doris/pull/61819)
- PR [#61778](https://github.com/apache/doris/pull/61778)
- PR [#61440](https://github.com/apache/doris/pull/61440)

**Why it matters:**  
OIDC, MySQL protocol login bridging, role mapping, stronger password rules, and LDAP empty-password controls all suggest enterprise users are pushing Doris toward **more mature identity integration and policy enforcement**. This is a strong roadmap signal for production governance.

### 4) Backup/restore correctness with materialized views
- Issue [#61827](https://github.com/apache/doris/issues/61827)
- PR [#61829](https://github.com/apache/doris/pull/61829)

**Why it matters:**  
Backup/restore of tables with MVs is a high-stakes operational path. A same-day bug report and fix PR imply active production use and an urgent need for **metadata consistency across restore workflows**.

---

## 5. Bugs & Stability

### Highest severity / likely production-impacting

1. **BE crash when `DOUBLE` is used as key in aggregate table**
   - Issue [#61797](https://github.com/apache/doris/issues/61797)
   - Status: Open
   - Severity: **Critical**
   - Impact: A backend crash is among the highest severity classes because it threatens availability and data-serving continuity.
   - Signal: Reported against **2.x/3.x**, suggesting broad branch exposure.
   - Fix PR: **No linked fix PR yet in provided data**.

2. **Compaction blocked when state changes occur during compaction**
   - Issue [#61823](https://github.com/apache/doris/issues/61823)
   - Status: Open
   - Severity: **High**
   - Impact: Compaction failures can degrade storage health, amplify read amplification, and eventually affect cluster performance/stability.
   - Scope: Reporter says **all versions**.
   - Fix PR: **Not visible yet**.

3. **Backup/restore with materialized views causes insert/load failure**
   - Issue [#61827](https://github.com/apache/doris/issues/61827)
   - Fix PR [#61829](https://github.com/apache/doris/pull/61829)
   - Severity: **High**
   - Impact: Breaks a critical recovery/migration workflow after full synchronization and restore.
   - Positive sign: **Fix proposed same day**.

4. **TVF failure due to oversized Thrift message**
   - Issue [#61787](https://github.com/apache/doris/issues/61787)
   - Fix PR [#61788](https://github.com/apache/doris/pull/61788)
   - Severity: **High**
   - Impact: Table-valued function execution can fail on large responses, affecting federated or external data access patterns.
   - Positive sign: Fix is already **approved/reviewed**.

### Query correctness / SQL behavior bugs

5. **`allow_zero_date` config not taking effect**
   - Issue [#61789](https://github.com/apache/doris/issues/61789)
   - Fix PR [#61791](https://github.com/apache/doris/pull/61791)
   - Severity: **Medium**
   - Impact: MySQL-compatibility behavior around zero dates is incorrect across **master, 4.0, 3.0**.
   - Positive sign: same-day fix PR exists and is reviewed.

6. **HTTPS mode returns incorrect HTTP URL in `to_load_error_http_path`**
   - PR [#61785](https://github.com/apache/doris/pull/61785)
   - Related issue [#61780](https://github.com/apache/doris/issues/61780) referenced in PR text
   - Severity: **Medium**
   - Impact: Operational diagnostics and error retrieval are wrong in HTTPS deployments.

7. **Parquet INT96 timestamp write regression**
   - PR [#61760](https://github.com/apache/doris/pull/61760)
   - Severity: **Medium to High**
   - Impact: Export/interchange failure with Parquet timestamp encoding.
   - Status: Fixed and being propagated to maintained branches.

### Stability trend assessment

The stability signal today is mixed but ultimately positive:
- Several bugs are **serious and production-relevant**.
- However, Doris maintainers and contributors are showing **fast fix turnaround**, with multiple issue-to-PR pairings landing within hours.

---

## 6. Feature Requests & Roadmap Signals

### Notable user-requested or contributor-driven features

1. **Primitive collection migration in Java FE**
   - Issue [#61835](https://github.com/apache/doris/issues/61835)
   - Proposal: replace boxed/type-erased Java collections with **fastUtil primitive collections**.
   - Roadmap meaning: a clear push toward **FE memory and CPU efficiency**, likely useful in metadata-heavy planner/catalog paths.

2. **OIDC authentication + MySQL protocol bridge + role mapping**
   - PR [#61819](https://github.com/apache/doris/pull/61819)
   - Likely trajectory: strong candidate for upcoming major/minor versions because it adds significant enterprise value.

3. **Complex password validation**
   - PR [#61778](https://github.com/apache/doris/pull/61778)
   - Roadmap meaning: more built-in security controls, likely to appear soon because the feature is concrete and broadly applicable.

4. **Global monotonically increasing TSO**
   - PR [#61199](https://github.com/apache/doris/pull/61199)
   - Roadmap meaning: this is strategically important for **transaction ordering, distributed consistency primitives, and future concurrency features**.
   - Likely not immediate unless maintainer focus intensifies, but clearly a significant architectural signal.

5. **Iceberg DML and metadata evolution**
   - PR [#61818](https://github.com/apache/doris/pull/61818)
   - PR [#61398](https://github.com/apache/doris/pull/61398)
   - Prediction: **Iceberg support expansion is highly likely to show up in the next versions**, especially around merge/update/delete semantics and table metadata compatibility.

### Most likely near-term inclusions in next version
Based on branch labels, review status, and backport activity, the most likely near-term deliverables are:
- Parquet timestamp compatibility fix
- File cache memory/read-path improvements
- `allow_zero_date` fix
- TVF oversized Thrift message fix
- MV backup/restore repair
- Possibly security enhancements such as password complexity rules

---

## 7. User Feedback Summary

Today’s user-reported pain points are practical and production-oriented:

- **Crash and correctness over feature novelty**
  - Reports focus on BE crash behavior, compaction interruption, restore correctness, and SQL compatibility.
  - This suggests many users are already using Doris deeply in production and now care most about **operational predictability**.

- **Interoperability remains a top concern**
  - Parquet INT96 issues, TVF limits, Iceberg support, JuiceFS compatibility, and HMS pooling work all point to Doris being used in **heterogeneous data stacks**, not standalone.

- **Security expectations are rising**
  - OIDC, LDAP behavior controls, and password complexity requests indicate users increasingly expect Doris to fit enterprise IAM standards rather than rely on simpler native auth setups.

- **Cache and memory behavior matter at scale**
  - File cache hotspot metadata growth and async LRU updates reflect real operator pain in **large remote-storage or object-store-backed deployments**.

In short, users appear satisfied enough with Doris’ breadth of functionality to now push harder on **reliability, ecosystem fit, and enterprise-hardening**.

---

## 8. Backlog Watch

These items look like they may need extra maintainer attention due to age, scope, or strategic importance:

1. **Runtime profile performance optimization**
   - PR [#56571](https://github.com/apache/doris/pull/56571)
   - Status: Open, marked stale
   - Concern: performance profiling overhead affects diagnostics quality and observability usability; stale status suggests it may be under-prioritized.

2. **Global TSO**
   - PR [#61199](https://github.com/apache/doris/pull/61199)
   - Status: Open, reviewed, meta-change, dev/5.0.x
   - Concern: architecturally important but likely large and cross-cutting; merits explicit maintainer guidance.

3. **Iceberg v3 row lineage**
   - PR [#61398](https://github.com/apache/doris/pull/61398)
   - Status: Open
   - Concern: strategically important for lakehouse interoperability; should not linger too long if Doris wants to stay current with Iceberg evolution.

4. **LDAP empty-password configuration**
   - PR [#61440](https://github.com/apache/doris/pull/61440)
   - Status: Open
   - Concern: security-sensitive behavior should ideally be resolved promptly to avoid ambiguity in enterprise deployments.

5. **BE crash on aggregate table with `DOUBLE` key**
   - Issue [#61797](https://github.com/apache/doris/issues/61797)
   - Status: New, open
   - Concern: no visible fix PR yet; likely deserves rapid triage due to crash severity.

6. **Compaction state-change bug**
   - Issue [#61823](https://github.com/apache/doris/issues/61823)
   - Status: New, open
   - Concern: affects storage maintenance path across all versions per reporter; should receive prompt BE/storage-engine attention.

---

## Key Links Recap

### Issues
- [#61797](https://github.com/apache/doris/issues/61797) — BE crash when double type be key in agg table
- [#61835](https://github.com/apache/doris/issues/61835) — Replace Java generic collections with fastUtil primitive collections
- [#61827](https://github.com/apache/doris/issues/61827) — Backup/restore with materialized views causes insert failure
- [#61823](https://github.com/apache/doris/issues/61823) — Compaction blocked by state changes
- [#61789](https://github.com/apache/doris/issues/61789) — `allow_zero_date` does not work
- [#61787](https://github.com/apache/doris/issues/61787) — TVF error due to oversized Thrift message
- [#61817](https://github.com/apache/doris/issues/61817) — 4.0.5 Release Notes

### PRs
- [#61760](https://github.com/apache/doris/pull/61760) — Parquet INT96 timestamp write fix
- [#61832](https://github.com/apache/doris/pull/61832) — Parquet fix follow-up on dev/4.1.x
- [#61837](https://github.com/apache/doris/pull/61837) — branch-4.1 Parquet fix backport
- [#61839](https://github.com/apache/doris/pull/61839) — bot cherry-pick for Parquet fix
- [#61819](https://github.com/apache/doris/pull/61819) — OIDC auth + MySQL login bridge + role mapping
- [#61083](https://github.com/apache/doris/pull/61083) — File cache async LRU + partial-hit fix
- [#61833](https://github.com/apache/doris/pull/61833) — File cache hotspot counter reclamation
- [#61812](https://github.com/apache/doris/pull/61812) — branch-4.1 file cache fix backport
- [#61829](https://github.com/apache/doris/pull/61829) — Restore/MV insert failure fix
- [#61788](https://github.com/apache/doris/pull/61788) — TVF oversized Thrift message fix
- [#61791](https://github.com/apache/doris/pull/61791) — `allow_zero_date` fix
- [#61778](https://github.com/apache/doris/pull/61778) — Complex password validation
- [#61199](https://github.com/apache/doris/pull/61199) — Global TSO
- [#61398](https://github.com/apache/doris/pull/61398) — Iceberg v3 row lineage
- [#61031](https://github.com/apache/doris/pull/61031) — JuiceFS as HDFS-compatible
- [#61075](https://github.com/apache/doris/pull/61075) — Configurable insert error message length
- [#61084](https://github.com/apache/doris/pull/61084) — JNI architecture refactor

If you want, I can also turn this into a **short executive summary**, a **Markdown newsletter format**, or a **Chinese version**.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-28

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains exceptionally active, but the center of gravity differs by project: some engines are optimizing mature core execution paths, while others are expanding lakehouse interoperability, cloud-native storage, and governance features. Across the board, community attention is shifting from “basic feature completeness” toward **correctness, operational predictability, external format compatibility, and enterprise integration**. A consistent pattern is the growing importance of **Parquet/Iceberg/Arrow interoperability, remote object storage performance, and security/auth maturity**. Overall, the ecosystem is healthy, with strong maintainer throughput in most projects and increasingly production-oriented user feedback.

---

## 2. Activity Comparison

### Daily activity snapshot

| Engine | Issues Updated | PRs Updated | Release Status | Health Score* | Notes |
|---|---:|---:|---|---:|---|
| **ClickHouse** | 435 | 500 | **2 new 26.3 LTS releases** | **9.5/10** | Highest throughput; balances trunk velocity with LTS stabilization |
| **Apache Doris** | 7 | 156 | No new release | **8.8/10** | Very active; strong bug-fix/backport discipline |
| **StarRocks** | 5 | 104 | No new release | **8.7/10** | High merge throughput; strong branch maintenance |
| **Delta Lake** | 3 | 50 | No new release | **8.4/10** | Heavy architectural work, especially DSv2/Kernel/CDC |
| **Apache Iceberg** | 7 | 48 | No new release | **8.3/10** | Strong core/spec/CI activity; compatibility pressure around Spark |
| **DuckDB** | 12 | 43 | No new release | **8.2/10** | Active hardening cycle; remote I/O and correctness remain hot |
| **Apache Arrow** | 36 | 18 | No new release | **8.1/10** | Healthy multi-language infra and Parquet/Flight progress |
| **Velox** | 3 | 34 | No new release | **8.0/10** | Good foundational progress; GPU and Parquet interoperability expanding |
| **Apache Gluten** | 4 | 22 | No new release | **7.8/10** | Active, but still stabilizing Spark 4.x and GPU deployment paths |
| **Databend** | 3 | 15 | No new release | **7.9/10** | Solid velocity; good query-engine fixes, but smaller activity footprint |

\*Health score is a comparative qualitative assessment derived from throughput, responsiveness, release discipline, and visible stability signals in the provided digests.

### Interpretation
- **ClickHouse** is the clear throughput leader by a large margin.
- **Apache Doris** sits in the **top tier of active OLAP engines**, behind ClickHouse in raw volume but ahead of most peers in visible day-to-day engineering cadence.
- **StarRocks** is Doris’s closest direct peer in this sample in terms of OLAP-focused delivery pace and backport discipline.

---

## 3. Apache Doris’s Position

### Advantages vs peers
Apache Doris currently looks strong in three areas:

1. **Operational responsiveness**
   - Several user-reported bugs had same-day fix PRs or active backports.
   - This compares well with peers where serious issues remain open without immediate linked fixes.

2. **Balanced product direction**
   - Doris is not only fixing bugs; it is simultaneously advancing:
     - enterprise auth (**OIDC**, LDAP controls, password complexity),
     - lakehouse interoperability (**Iceberg DML, row lineage, JuiceFS/HDFS compatibility**),
     - core storage efficiency (**file cache correctness and memory reclamation**).

3. **Branch maintenance maturity**
   - The Parquet INT96 regression fix was rapidly propagated across branches, a strong signal of release engineering discipline.

### Technical approach differences
Compared with peers:
- **vs ClickHouse**: Doris appears more focused on balanced warehouse/lakehouse interoperability and enterprise integration, whereas ClickHouse is still more visibly optimized around raw engine throughput, planner evolution, and broad systems internals.
- **vs StarRocks**: Doris and StarRocks are close strategically, but Doris today shows stronger emphasis on auth/security modernization and cache/storage-path hardening, while StarRocks is leaning more into cloud storage abstractions and optimizer statistics.
- **vs DuckDB**: Doris is clearly oriented toward distributed production deployment rather than embedded/local analytics.
- **vs Iceberg/Delta**: Doris is an engine consuming/opening lakehouse formats, while Iceberg and Delta are primarily table-format ecosystems plus connectors/runtime integrations.
- **vs Velox/Gluten/Arrow**: Doris is a full DBMS, not a lower-layer execution or data interoperability component.

### Community size comparison
- **Larger visible community/throughput than**: DuckDB, Iceberg, Delta Lake, Databend, Velox, Gluten, Arrow in this daily sample.
- **Smaller than**: ClickHouse by a wide margin.
- **Comparable direct OLAP tier**: StarRocks is the nearest peer in shape and operational tempo.

Net: **Doris is in the upper tier of the open-source OLAP engine ecosystem**, with particularly good signals for production hardening and enterprise-readiness.

---

## 4. Shared Technical Focus Areas

### A. Parquet compatibility and semantics
**Engines:** Apache Doris, ClickHouse, Velox, Apache Arrow, Apache Gluten  
**Specific needs:**
- Doris: INT96 timestamp write regression fix/backports
- ClickHouse: removing old Parquet reader/writer paths
- Velox: decimal write compatibility and dependency cleanup
- Arrow: encrypted bloom-filter reads, Python bloom-filter writes
- Gluten: legacy-format compatibility knobs through Velox Parquet writer

**Signal:** Parquet remains the shared interoperability battleground, especially around timestamps, decimals, bloom filters, and legacy behavior.

---

### B. Object storage / remote I/O reliability
**Engines:** Doris, DuckDB, ClickHouse, Iceberg, Delta Lake  
**Specific needs:**
- Doris: file cache LRU/partial-hit correctness and memory reclamation
- DuckDB: S3 OOM on partitioned COPY, large S3 Parquet internal errors
- ClickHouse: HDFS/object-storage pain persists
- Iceberg: metadata path correctness in object storage
- Delta: snapshot/path handling and DSv2/kernel modernization

**Signal:** Remote storage is now a first-class workload path, and users expect bounded-memory, cache-aware, cloud-native behavior.

---

### C. Query correctness over pure feature velocity
**Engines:** Doris, StarRocks, DuckDB, ClickHouse, Delta Lake, Gluten  
**Specific needs:**
- Doris: zero-date config correctness, TVF behavior, DST correctness
- StarRocks: wrong-result `COUNT()` with `ORDER BY`
- DuckDB: internal planner errors, vector bounds failures
- ClickHouse: monotonicity/planner correctness, materialization sort-order risks
- Delta: MERGE + deletion vector correctness
- Gluten: native union result correctness, Spark 4.x semantic parity

**Signal:** Mature users are stressing edge cases and expecting fewer wrong-result or internal-error conditions.

---

### D. Security, auth, and governance
**Engines:** Doris, StarRocks, ClickHouse, Gluten/Velox indirectly  
**Specific needs:**
- Doris: OIDC, MySQL login bridge, LDAP controls, password complexity
- StarRocks: Ranger tag-based access control request
- ClickHouse: less prominent today, but operational/admin UX is increasing
- Gluten/Velox: more deployment/config correctness than auth itself

**Signal:** Enterprise identity and policy integration is becoming a competitive requirement, especially for distributed SQL engines.

---

### E. Lakehouse/table-format interoperability
**Engines:** Doris, StarRocks, ClickHouse, Iceberg, Delta, Arrow  
**Specific needs:**
- Doris: Iceberg DML and row lineage, JNI connector unification
- StarRocks: Iceberg metadata observability, Hive metadata behavior
- ClickHouse: Arrow Flight SQL, CHECK DATABASE, Parquet modernization
- Iceberg: CDC, materialized views, Avro timestamp support
- Delta: Kernel/Spark DSv2, CDC streaming, UniForm/Iceberg tests
- Arrow: Flight SQL ODBC and Parquet feature expansion

**Signal:** The market is converging around mixed-engine architectures rather than single-engine isolation.

---

## 5. Differentiation Analysis

### Storage format orientation
- **Apache Doris / StarRocks / ClickHouse / DuckDB / Databend**: full query engines with native storage plus varying degrees of external table/lakehouse federation.
- **Iceberg / Delta Lake**: table-format ecosystems rather than standalone analytical databases.
- **Arrow**: data interchange and columnar substrate.
- **Velox / Gluten**: execution-layer and acceleration stack rather than complete warehouse products.

### Query engine design
- **ClickHouse**: highly optimized monolithic OLAP engine, aggressive planner/execution innovation.
- **Doris**: MPP analytical DB with strong integrated warehouse semantics and growing lakehouse reach.
- **StarRocks**: similar distributed OLAP profile, often emphasizing cloud/shared-data and external catalog workflows.
- **DuckDB**: embedded single-node analytical engine.
- **Databend**: cloud-oriented analytical engine with versioned-table semantics emerging.
- **Velox/Gluten**: composable execution backend/acceleration path for other systems.

### Target workloads
- **Doris / StarRocks / ClickHouse**: production BI, real-time analytics, distributed SQL, mixed internal/external data access.
- **DuckDB**: local analytics, embedded processing, developer-centric ETL/data science.
- **Iceberg / Delta**: lakehouse metadata, multi-engine table management, batch/stream interoperability.
- **Arrow**: connector/interchange layer across languages and systems.
- **Velox / Gluten**: acceleration for Spark/Presto-style engines.

### SQL compatibility posture
- **Doris**: visibly improving MySQL compatibility and enterprise SQL operational behavior.
- **ClickHouse**: rich SQL surface, but often prioritizes engine-specific planner behavior and performance semantics.
- **StarRocks**: strong SQL warehouse orientation, but current risk area is wrong-result/query edge cases.
- **DuckDB**: increasingly polished and standards-friendly, but still exposed to advanced internal-error edge cases.
- **Delta/Iceberg**: SQL behavior depends heavily on hosting engines like Spark/Flink.
- **Gluten**: explicitly focused on Spark semantic parity through Velox.

---

## 6. Community Momentum & Maturity

### Tier 1: Hyper-active, large-scale ecosystems
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

These projects show the strongest signs of broad production adoption, active branch management, and continuous issue/PR flow.

### Tier 2: High-value, strategically active ecosystems
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **Apache Arrow**

These are highly relevant and healthy, but daily traffic is more focused or domain-specific than the top distributed OLAP engines.

### Tier 3: Foundational but narrower-scope / integration-layer projects
- **Velox**
- **Apache Gluten**
- **Databend**

These are active and technically important, but either narrower in scope, smaller in visible community size, or still maturing specific strategic areas.

### Rapidly iterating vs stabilizing
**Rapidly iterating**
- ClickHouse
- Delta Lake
- Iceberg
- Velox
- Gluten

**Stabilizing while still active**
- Doris
- StarRocks
- DuckDB
- Arrow

**Mixed**
- Databend: still iterating, but on a smaller contributor surface.

Doris specifically looks like a **mature engine still expanding**, rather than an early-stage project or a stagnant one.

---

## 7. Trend Signals

### 1. Interoperability is now table stakes
Users increasingly expect engines to work cleanly with **Parquet, Arrow, Iceberg, Delta, Hive, JDBC, object stores, and external catalogs**. For data engineers, this means engine selection is less about isolated performance and more about ecosystem fit.

### 2. Correctness and operability are the new competitive frontier
Across Doris, StarRocks, DuckDB, ClickHouse, and Delta, the most urgent issues are often **wrong results, planner edge cases, restore/compaction bugs, and operational failure modes**. Architects should treat maturity in diagnostics, branch maintenance, and regression response as key selection criteria.

### 3. Cloud/object-store behavior is becoming central
File cache tuning, S3 export memory control, metadata path correctness, and HDFS/object-storage stability show that remote storage performance is a cross-ecosystem design priority. This matters directly for lakehouse and decoupled-storage architectures.

### 4. Security and governance expectations are rising
OIDC, LDAP controls, password policy, Ranger policy requests, and better admin observability all point to stronger enterprise requirements. For platform teams, auth and governance integration can now be as important as benchmark speed.

### 5. Execution engines and table formats are separating
Projects like Velox, Gluten, Arrow, Iceberg, and Delta show continued decomposition of the analytics stack into specialized layers. This gives architects more modularity, but also increases integration complexity and the need to validate compatibility boundaries carefully.

---

## Bottom Line

**Apache Doris is in a strong competitive position**: not the largest community by raw volume, but clearly among the most active and mature open-source OLAP engines, with especially good momentum in production hardening, enterprise auth, and lakehouse interoperability. **ClickHouse** remains the throughput and scale leader in visible community activity, while **StarRocks** is Doris’s closest OLAP peer in current execution pace. The broader ecosystem is converging on a common set of priorities: **correctness, cloud-native storage behavior, open-format interoperability, and enterprise readiness**. For decision-makers, the best engine choice increasingly depends less on headline speed alone and more on **operational maturity, ecosystem alignment, and fit for target architecture**. 

If you want, I can also turn this into:
1. a **one-page executive brief**,
2. a **Doris-vs-ClickHouse-vs-StarRocks deep comparison**, or
3. a **radar-chart style scoring matrix**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-28

## 1) Today’s Overview

ClickHouse had another very high-velocity day: **435 issues** and **500 PRs** were updated in the last 24 hours, with **367 issues closed** and **349 PRs merged/closed**, indicating strong maintainer throughput and active triage. Activity is skewed toward core database internals rather than peripheral tooling: the visible PR set focuses on **query planner behavior, storage observability, join performance, Parquet/Arrow I/O, and operational safeguards**. Two new **26.3 LTS** releases were published, reinforcing that the project is currently balancing **rapid development on trunk** with **stabilization on long-term support branches**. Overall project health looks strong, though the issue stream still shows recurring pain around **ARM builds, HDFS/object-storage integrations, and correctness/stability edge cases**.

---

## 2) Releases

### New releases
- **v26.3.2.3-lts** — Release v26.3.2.3-lts  
- **v26.3.1.896-lts** — Release v26.3.1.896-lts  

Because the provided dataset does not include release notes beyond the tags/titles, specific patch contents cannot be enumerated from source evidence here. However, the presence of **two LTS point releases on the same day** usually signals one or more of:
- backported bug fixes,
- packaging/install corrections,
- stability or correctness fixes suitable for conservative production users.

### Migration / operator notes
Given the surrounding PR activity, operators upgrading within the 26.3 LTS line should pay particular attention to:
- **Parquet read/write behavior**, because trunk contains a proposal to remove legacy implementations: [PR #100949](https://github.com/ClickHouse/ClickHouse/pull/100949).
- **Temporary table introspection semantics**, because a backward-incompatible consistency fix is in flight: [PR #100966](https://github.com/ClickHouse/ClickHouse/pull/100966).
- **Virtual columns behavior**, because consolidation work is underway: [PR #100766](https://github.com/ClickHouse/ClickHouse/pull/100766).

These are not confirmed as part of the LTS releases from the supplied data, but they are the most relevant near-term compatibility signals maintainers and users should watch.

---

## 3) Project Progress

Although merged PR details are not listed individually, the currently active PR set gives a strong indication of where engineering effort is advancing.

### Query engine and planner
- **Filter pushdown across window functions** is being added behind a setting: [PR #100784](https://github.com/ClickHouse/ClickHouse/pull/100784).  
  This is a meaningful optimizer improvement, but the PR explicitly warns it **can change query results** for some workloads, so it is both a capability upgrade and a semantic-risk area.
- **Monotonicity analysis fixes for `divide`/`intDiv`**: [PR #100928](https://github.com/ClickHouse/ClickHouse/pull/100928).  
  This addresses planner/index-analysis correctness where division-by-zero exceptions could be triggered during optimization.
- **Simple views with `UNION` support/performance work**: [PR #100958](https://github.com/ClickHouse/ClickHouse/pull/100958).  
  This points to continued work in query normalization and execution optimization for view expansion.
- **Consistency of `SHOW CREATE TABLE` / `DESCRIBE TABLE` with temporary tables**: [PR #100966](https://github.com/ClickHouse/ClickHouse/pull/100966).  
  This improves SQL behavior predictability, though at the cost of a backward-incompatible change.

### Storage and execution performance
- **Partial merge join optimization for nullable keys**: [PR #100945](https://github.com/ClickHouse/ClickHouse/pull/100945).  
  This is a targeted execution-engine speedup in a known expensive join path.
- **Regex primary key index optimization** for grouped/alternation patterns such as `^(a|b)$`: [PR #98988](https://github.com/ClickHouse/ClickHouse/pull/98988).  
  This is a notable practical improvement because many users express filters in regex form that are logically reducible to range filters.
- **Thread count auto-limiting based on free memory**: [PR #100383](https://github.com/ClickHouse/ClickHouse/pull/100383).  
  This is an important operational performance/stability measure, aiming to reduce memory pressure by scaling parallelism to available headroom.
- **Avoid invalidating a single large dictionary repeatedly**: [PR #99285](https://github.com/ClickHouse/ClickHouse/pull/99285).  
  This improves read efficiency for large low-cardinality dictionary workloads.

### Data formats and ecosystem compatibility
- **Arrow Flight SQL support**: [PR #91170](https://github.com/ClickHouse/ClickHouse/pull/91170).  
  This is a strategically important interoperability feature for modern analytics tooling.
- **Arrow `StringView` and `BinaryView` ingestion**: [PR #100762](https://github.com/ClickHouse/ClickHouse/pull/100762).  
  This sharpens Arrow ecosystem compatibility, especially for zero-copy or compact representations.
- **Catalog health checking via `CHECK DATABASE`**: [PR #94690](https://github.com/ClickHouse/ClickHouse/pull/94690).  
  This suggests more enterprise/data-lake-oriented validation workflows.

### Operability and observability
- **Profile events collected in `system.part_log`**: [PR #97302](https://github.com/ClickHouse/ClickHouse/pull/97302).  
  This improves post-hoc performance and storage event analysis.
- **Warning on mdraid resynchronization during startup**: [PR #100941](https://github.com/ClickHouse/ClickHouse/pull/100941).  
  This is a practical SRE-focused enhancement for diagnosing degraded merge/query I/O.
- **Keeper benchmark throughput improvements**: [PR #100670](https://github.com/ClickHouse/ClickHouse/pull/100670).  
  While not user-visible directly, it strengthens internal benchmarking and Keeper performance evaluation.

---

## 4) Community Hot Topics

Below are the most active discussion items from today’s visible set, with analysis of what they signal technically.

### 1. ClickHouse roadmap 2026
- [Issue #93288](https://github.com/ClickHouse/ClickHouse/issues/93288) — **OPEN**
- Signal: strategic planning, broad community attention.
- Technical need: users want clearer direction on **core engine evolution**, especially around planner, storage, compatibility, and cloud/data-lake integrations.
- Why it matters: roadmap threads typically shape expectations for what lands in major releases and where maintainers want contributors to focus.

### 2. CI crash in query analyzer
- [Issue #85460](https://github.com/ClickHouse/ClickHouse/issues/85460) — **CLOSED**
- Theme: `[LOGICAL_ERROR] Trying to execute PLACEHOLDER action`
- Technical need: query analyzer stability and invariant enforcement in CI.
- Interpretation: the new analyzer/planner stack is still under active hardening; CI-discovered assertion failures are often early indicators of planner edge-case complexity.

### 3. ARM / Docker / packaging support remains a recurring topic
High-comment historical issues updated today:
- [Issue #22222](https://github.com/ClickHouse/ClickHouse/issues/22222) — Official ARM image for Docker
- [Issue #15174](https://github.com/ClickHouse/ClickHouse/issues/15174) — Add tests for AArch64 in CI
- [Issue #2266](https://github.com/ClickHouse/ClickHouse/issues/2266) — ARM64 support for ClickHouse
- [Issue #50852](https://github.com/ClickHouse/ClickHouse/issues/50852) — ClickHouse server on RPi4 (ARM64)
- [Issue #59205](https://github.com/ClickHouse/ClickHouse/issues/59205) — ARM libunwind spam/crashes
- Technical need: better **first-class ARM support**, more predictable packaging, and stronger architecture-specific CI coverage.
- Interpretation: even when individual tickets are closed, the pattern shows ARM remains a meaningful production target and a source of friction.

### 4. HDFS / Kerberos / object-storage integration pain
Updated high-comment issues:
- [Issue #8159](https://github.com/ClickHouse/ClickHouse/issues/8159) — HDFS engine in HA mode
- [Issue #34445](https://github.com/ClickHouse/ClickHouse/issues/34445) — HDFS with Kerberos read/write inconsistency
- [Issue #13406](https://github.com/ClickHouse/ClickHouse/issues/13406) — HDFS access causing abnormal exit
- [Issue #22460](https://github.com/ClickHouse/ClickHouse/issues/22460) — HDFS table engine crash
- [Issue #5747](https://github.com/ClickHouse/ClickHouse/issues/5747) — Kerberos support for ZK and HDFS
- Technical need: production-grade Hadoop ecosystem interoperability, particularly **HA name nodes, Kerberos auth, and crash-free reads**.
- Interpretation: object-storage has eclipsed HDFS in many modern deployments, but there is still visible demand from enterprises with legacy or hybrid Hadoop estates.

### 5. Large feature PRs attracting strategic attention
- [PR #91170](https://github.com/ClickHouse/ClickHouse/pull/91170) — Arrow Flight SQL support
- [PR #100277](https://github.com/ClickHouse/ClickHouse/pull/100277) — Web terminal interface to clickhouse-server
- [PR #100949](https://github.com/ClickHouse/ClickHouse/pull/100949) — Remove old Parquet reader/writer implementations
- Technical need: stronger external interoperability, easier administration, and reduced maintenance burden from legacy code paths.

---

## 5) Bugs & Stability

Ranked by likely severity and breadth of impact from the visible issues/PRs.

### Critical / high severity

#### 1. Query analyzer CI crash
- [Issue #85460](https://github.com/ClickHouse/ClickHouse/issues/85460) — **CLOSED**
- Problem: internal logical error in analyzer action execution.
- Risk: planner/analyzer crashes can indicate latent correctness bugs, even if caught in CI.
- Fix status: issue closed; no corresponding PR was listed in supplied data.

#### 2. Encrypted file read errors affecting replication/mutations
- [Issue #83120](https://github.com/ClickHouse/ClickHouse/issues/83120) — **OPEN**
- Problem: `ReadBufferFromEncryptedFile` exceptions, replication queue and mutations getting stuck.
- Risk: high, because this can block replication and operational progress on encrypted-storage deployments.
- Fix PR: none visible in supplied data.

#### 3. Client crash in replxx/readline path
- [Issue #95278](https://github.com/ClickHouse/ClickHouse/issues/95278) — **OPEN** (labeled invalid)
- Problem: `clickhouse-client` crash in interactive shell path.
- Risk: medium-high for CLI-heavy users, though likely limited in blast radius versus server issues.
- Fix PR: none visible.

### Correctness and optimizer safety

#### 4. Division monotonicity bug during index analysis
- [PR #100928](https://github.com/ClickHouse/ClickHouse/pull/100928) — **OPEN**
- Problem: `divide` and `intDiv` claimed monotonicity for `[0,0]` denominator range, leading to exceptions.
- Risk: correctness and planning stability issue.
- Status: concrete fix exists and is under review.

#### 5. `ALTER TABLE MATERIALIZE COLUMN` can break sort order
- [PR #99647](https://github.com/ClickHouse/ClickHouse/pull/99647) — **OPEN**
- Problem: materializing columns used in sort-key expressions can corrupt ordering assumptions.
- Risk: high for MergeTree integrity and query correctness on affected schemas.
- Status: fix PR exists.

#### 6. Undefined behavior in datetime parsing
- [PR #100948](https://github.com/ClickHouse/ClickHouse/pull/100948) — **OPEN**
- Problem: overflow in `parseDateTimeBestEffort` fractional-second accumulation.
- Risk: parsing correctness bug with possible undefined behavior.
- Status: fix PR exists.

### Stability / flaky CI / operational resilience

#### 7. Flaky distributed query test
- [PR #100951](https://github.com/ClickHouse/ClickHouse/pull/100951) — **OPEN**
- Problem: nondeterministic output due to randomized `max_block_size` and `LIMIT`.
- Risk: mostly CI/test reliability, but it points to distributed execution edge cases.

#### 8. Startup diagnostic for degraded RAID
- [PR #100941](https://github.com/ClickHouse/ClickHouse/pull/100941) — **OPEN**
- Not a bug fix per se, but improves operator visibility into hidden I/O degradation.

---

## 6) Feature Requests & Roadmap Signals

### Strongest roadmap signals from active PRs

#### Arrow / ecosystem interoperability
- [PR #91170](https://github.com/ClickHouse/ClickHouse/pull/91170) — Arrow Flight SQL support
- [PR #100762](https://github.com/ClickHouse/ClickHouse/pull/100762) — Arrow `StringView` / `BinaryView`
- Prediction: **high likelihood** that more Arrow-native interoperability lands in the next major/minor cycle. This aligns with BI/dataframe ecosystem demand.

#### Query optimizer evolution
- [PR #100784](https://github.com/ClickHouse/ClickHouse/pull/100784) — filter pushdown over window
- [PR #98988](https://github.com/ClickHouse/ClickHouse/pull/98988) — regex-to-primary-key optimization
- [PR #100958](https://github.com/ClickHouse/ClickHouse/pull/100958) — simple views with union
- Prediction: next versions will likely emphasize **planner-driven performance gains**, but users should expect some semantics-sensitive changes gated by settings.

#### Admin / operational UX
- [PR #100277](https://github.com/ClickHouse/ClickHouse/pull/100277) — web terminal
- [PR #94690](https://github.com/ClickHouse/ClickHouse/pull/94690) — `CHECK DATABASE` for catalog
- [PR #100941](https://github.com/ClickHouse/ClickHouse/pull/100941) — mdraid startup warning
- Prediction: ClickHouse is investing more in **embedded admin experience and system health diagnostics**, not just raw execution speed.

### User-requested features still visible from issues
- Better **HDFS HA/Kerberos** support:
  - [Issue #8159](https://github.com/ClickHouse/ClickHouse/issues/8159)
  - [Issue #34445](https://github.com/ClickHouse/ClickHouse/issues/34445)
  - [Issue #5747](https://github.com/ClickHouse/ClickHouse/issues/5747)
- Better **ARM packaging and support**:
  - [Issue #22222](https://github.com/ClickHouse/ClickHouse/issues/22222)
  - [Issue #15174](https://github.com/ClickHouse/ClickHouse/issues/15174)
  - [Issue #2266](https://github.com/ClickHouse/ClickHouse/issues/2266)

### Most likely to appear soon
Based on maturity and active review:
1. **Query-engine/performance improvements** around joins, regex index use, and memory-aware threading.  
2. **Arrow compatibility enhancements**.  
3. **SQL consistency fixes** for introspection and temporary table behavior.  
4. **Parquet code-path simplification**, likely after one more release cycle of warning/validation.

---

## 7) User Feedback Summary

The issue stream suggests users continue to value ClickHouse’s performance, but practical deployment friction clusters in a few recurring areas:

### Main pain points
- **Installation and packaging reliability**
  - [Issue #65229](https://github.com/ClickHouse/ClickHouse/issues/65229) — deb repo install error
  - [Issue #68747](https://github.com/ClickHouse/ClickHouse/issues/68747) — Docker permission error
  - [Issue #45219](https://github.com/ClickHouse/ClickHouse/issues/45219) — `clickhouse-local` under Ubuntu WSL
- **ARM runtime/build quality**
  - [Issue #50852](https://github.com/ClickHouse/ClickHouse/issues/50852)
  - [Issue #59205](https://github.com/ClickHouse/ClickHouse/issues/59205)
  - [Issue #8027](https://github.com/ClickHouse/ClickHouse/issues/8027)
- **HDFS/enterprise integration complexity**
  - [Issue #8159](https://github.com/ClickHouse/ClickHouse/issues/8159)
  - [Issue #34445](https://github.com/ClickHouse/ClickHouse/issues/34445)
  - [Issue #13406](https://github.com/ClickHouse/ClickHouse/issues/13406)

### Workload/use-case signals
- Users are running ClickHouse in:
  - **ARM/edge/home lab and cloud Graviton environments**
  - **Hybrid Hadoop/HDFS/Kerberos enterprise stacks**
  - **Containerized Linux and WSL developer workflows**
  - **Replication/encrypted storage production clusters**

### Satisfaction signals
There is no explicit positive reaction burst in today’s sample PRs, but the development focus suggests maintainers are responding to real workload demands:
- lower overhead joins,
- better dictionary behavior,
- more exact part logging,
- modern Arrow support,
- protection against memory overcommit.

That combination usually correlates with mature operator feedback loops rather than purely speculative feature work.

---

## 8) Backlog Watch

These items appear strategically important and still merit maintainer attention due to age, open status, or broad impact.

### Open issues needing attention

#### 1. Roadmap thread
- [Issue #93288](https://github.com/ClickHouse/ClickHouse/issues/93288)
- Why it matters: central planning artifact; useful for aligning contributors and users.
- Need: continued maintainer curation and prioritization clarity.

#### 2. Encrypted-file read / replication blockage
- [Issue #83120](https://github.com/ClickHouse/ClickHouse/issues/83120)
- Why it matters: impacts replication queue and mutations; operationally serious.
- Need: root-cause analysis and linkage to a fix PR.

#### 3. Materialized view with enum mismatch
- [Issue #20500](https://github.com/ClickHouse/ClickHouse/issues/20500)
- Why it matters: very old **open** correctness issue touching DDL, mutations, and type evolution.
- Need: either a definitive fix, a documented limitation, or closure with migration guidance.

#### 4. Client replxx crash report
- [Issue #95278](https://github.com/ClickHouse/ClickHouse/issues/95278)
- Why it matters: even if labeled invalid, interactive client crashes erode developer trust.
- Need: clearer reproduction closure or a supporting fix if still reproducible.

### Open PRs with notable review importance

#### 5. Arrow Flight SQL support
- [PR #91170](https://github.com/ClickHouse/ClickHouse/pull/91170)
- Why it matters: broad ecosystem leverage; likely high user value.
- Need: careful review of protocol compliance, authentication, and performance.

#### 6. Web terminal interface
- [PR #100277](https://github.com/ClickHouse/ClickHouse/pull/100277)
- Why it matters: large surface-area feature with security implications.
- Need: design review around authn/authz, sandboxing, and production defaults.

#### 7. Remove old Parquet reader/writer implementations
- [PR #100949](https://github.com/ClickHouse/ClickHouse/pull/100949)
- Why it matters: cleanup is good, but compatibility regressions here could be high-impact.
- Need: migration note quality and broad format regression testing.

---

## Bottom line

Today’s ClickHouse signal is **healthy but intense**: high closure rates, active LTS release cadence, and substantial progress on the optimizer, data format interoperability, and operational diagnostics. The biggest positive trend is the project’s shift toward **smarter execution and better observability**, while the biggest recurring risk areas remain **architecture-specific packaging/runtime issues** and **legacy enterprise integrations like HDFS/Kerberos**. For teams evaluating near-term upgrades, the most important watchpoints are **planner semantics changes, Parquet path consolidation, and correctness fixes around MergeTree and datetime parsing**.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-28

## 1) Today’s Overview

DuckDB showed **high development activity** over the last 24 hours, with **43 PR updates** and **12 issue updates**, indicating an active stabilization and feature-development cycle. The mix of work is notably balanced between **engine correctness fixes, storage/IO improvements, SQL behavior polish, and developer tooling/CI maintenance**. No new release was published today, so the project appears to be in an **iteration and hardening phase** rather than a release announcement window. The issue stream also suggests continued pressure around **S3/httpfs, query planner/internal errors, and edge-case numeric behavior**, all of which are important for analytical workloads at scale.

## 2) Project Progress

Today’s merged/closed PRs point to steady progress in three main areas: **engine reliability**, **data format/type inference**, and **internal developer productivity**.

### Query engine and SQL behavior
- **Infer timestamps with timezone in `read_json_auto`** was merged, improving schema inference for semi-structured ingestion and making DuckDB more robust for real-world JSON sources with timezone-aware timestamp strings.  
  Link: [PR #21660](https://github.com/duckdb/duckdb/pull/21660)

- **Avoid throwing an error when failing to bind views in `duckdb_columns`** was merged. This improves catalog introspection resilience, especially after lazy view binding changes, and reduces metadata-query fragility in BI/integration workflows.  
  Link: [PR #21658](https://github.com/duckdb/duckdb/pull/21658)

### Storage, filesystem, and platform behavior
- **Windows canonical path prefix removal** was closed quickly, addressing leakage of `\\?\` long-path prefixes into SQL-facing settings and client-visible behavior. This is a practical compatibility cleanup for Windows users.  
  Link: [PR #21652](https://github.com/duckdb/duckdb/pull/21652)

- **Unified `LocalFileSystem::GetVersionTag` using `FileMetadata`** was merged, along with Windows file-listing changes to compute version tags without extra syscalls. This is an infrastructure improvement that should help file-change detection and reduce overhead.  
  Link: [PR #21664](https://github.com/duckdb/duckdb/pull/21664)

- **Block-aligned read and cache for external file cache** was closed, representing meaningful work on external IO efficiency. Even if implementation details may still evolve, this indicates continued investment in remote/external data performance.  
  Link: [PR #21395](https://github.com/duckdb/duckdb/pull/21395)

### Stability and correctness
- **Fix a few class construction UB** was merged/closed, addressing undefined behavior in filesystem-related classes. This kind of low-level C++ correctness work often prevents subtle crashes and portability issues.  
  Link: [PR #21670](https://github.com/duckdb/duckdb/pull/21670)

- **Use test runner in all Windows CI jobs** and **Fix all tidy errors** were closed, showing ongoing cleanup of CI quality and static-analysis debt.  
  Links: [PR #21648](https://github.com/duckdb/duckdb/pull/21648), [PR #21647](https://github.com/duckdb/duckdb/pull/21647)

### Developer tooling
- A **git pre-commit hook for `make format-fix`** was added, a small but healthy sign that the project is investing in smoother contributor workflows and codebase consistency.  
  Link: [PR #21665](https://github.com/duckdb/duckdb/pull/21665)

- **CLI `.help` shortcuts** were added, improving discoverability in interactive usage.  
  Link: [PR #21662](https://github.com/duckdb/duckdb/pull/21662)

Overall, today’s completed work looks less like headline feature delivery and more like **platform hardening, ingestion polish, and engineering efficiency improvements**.

## 3) Community Hot Topics

These are the most notable active discussions by comment count, reactions, or technical significance.

### 1. Out-of-memory during partitioned `COPY` to S3
- Issue: [#11817](https://github.com/duckdb/duckdb/issues/11817)
- Status: Open, under review
- Signals: **13 comments, 9 👍**

This remains one of the clearest user pain points: **memory usage during partitioned S3 export appears much higher than expected**, even for modest datasets. The underlying need is for **streaming-friendly, bounded-memory write paths** for cloud/object-store exports, particularly with Hive partitioning. This matters because DuckDB is increasingly used in ELT pipelines where local-memory amplification during object-store writes is unacceptable.

### 2. `SUMMARIZE` / stddev out-of-range failures on `inf/-inf`
- Issue: [#14373](https://github.com/duckdb/duckdb/issues/14373)
- Status: Open, reproduced
- Signals: **8 comments, 6 👍**
- Related fix PR: [#21673](https://github.com/duckdb/duckdb/pull/21673)

This is a strong example of a **numerical edge-case correctness/usability gap**. Users do not want descriptive statistics to throw when encountering infinite values; they prefer IEEE-style `inf`/`nan` or null-like behavior. The linked PR suggests maintainers are moving toward **more permissive, standards-aligned floating-point semantics** in analytical functions.

### 3. CLI/environment variable support in `ATTACH`
- PR: [#21529](https://github.com/duckdb/duckdb/pull/21529)
- Status: Open, changes requested, CI failure

Although not the most commented in the supplied snapshot, this is strategically interesting because it reflects demand for **more ergonomic deployment and session configuration**, especially where database paths are injected through environment variables. The discussion suggests a tension between convenience and parser/grammar complexity.

### 4. Memory leak in `INSERT OR REPLACE` for in-memory databases
- PR: [#21039](https://github.com/duckdb/duckdb/pull/21039)
- Status: Open, stale, changes requested

This points to a high-value engine concern: **write-heavy mutation workloads against in-memory DBs** can still expose memory-management weaknesses. Even if stale, it reflects the community’s expectation that DuckDB support not only analytical reads but also repeated upsert-like workflows reliably.

## 4) Bugs & Stability

Ranked roughly by severity and potential user impact.

### Critical
#### 1. Python crash: “pointer being freed was not allocated”
- Issue: [#21651](https://github.com/duckdb/duckdb/issues/21651)
- Status: Open, under review

A hard crash in the Python client is among the most severe issue types because it indicates potential **native memory corruption** rather than a contained query error. This deserves urgent maintainer triage, especially given Python is one of DuckDB’s most important interfaces.

#### 2. Internal error in multi-file Parquet reads from S3 via `httpfs`
- Issue: [#21669](https://github.com/duckdb/duckdb/issues/21669)
- Status: Open

An **integer-cast/internal error** while reading large remote Parquet datasets from S3 is severe because it affects a core DuckDB use case: **large-scale analytical access over object storage**. The mention of Overture Maps suggests this is not a toy dataset edge case but a realistic production-scale workload.

#### 3. Internal CTE-definition failure
- Issue: [#21582](https://github.com/duckdb/duckdb/issues/21582)
- Status: Open, reproduced

“Could not find CTE definition” is a clear **planner/binder correctness problem** and, because it is reported as an internal error, likely indicates a bug in query rewriting or macro/CTE interaction rather than unsupported SQL.

### High
#### 4. Internal vector index error
- Issue: [#21650](https://github.com/duckdb/duckdb/issues/21650)
- Status: Open, reproduced

“Attempted to access index x within vector of size x” suggests an **off-by-one or planner/execution mismatch**. Internal errors are always high-priority because they indicate engine invariants are breaking.

#### 5. Attach string reused incorrectly across second connection in a session
- Issue: [#21618](https://github.com/duckdb/duckdb/issues/21618)
- Status: Open, reproduced

This is a **session/connection-state correctness bug**. It may be especially disruptive in applications using multiple connections or embedded workflows, and could lead to confusing cross-database behavior.

#### 6. `COPY table FROM 'file.csv'` header detection mismatch with docs
- Issue: [#21653](https://github.com/duckdb/duckdb/issues/21653)
- Status: Open, reproduced

This is likely a **behavior-vs-documentation discrepancy** rather than a crash, but it can cause ingestion mistakes and subtle schema/data shifts. For ETL users, this kind of ambiguity is very costly.

### Medium
#### 7. `IS NULL` on geometry does not work
- Issue: [#21630](https://github.com/duckdb/duckdb/issues/21630)
- Status: Open, under review

This points to a **type-system or extension-specific null semantics bug** in spatial workflows. Not universally impactful, but important for geospatial users.

#### 8. Extension release cycle mismatch for development builds
- Issue: [#21622](https://github.com/duckdb/duckdb/issues/21622)
- Status: Open, under review

Not a correctness bug in the core engine, but a real usability problem: **development Python builds without matching extension availability** reduce pre-release testing value and create friction for downstream adopters.

### Recently resolved stability items
- **ADBC heap-use-after-free on error** was closed, which is a meaningful fix in client API stability.  
  Link: [Issue #21584](https://github.com/duckdb/duckdb/issues/21584)

- **S3 upload to buckets with default retention** was closed, suggesting progress on object-store compatibility.  
  Link: [Issue #9512](https://github.com/duckdb/duckdb/issues/9512)

## 5) Feature Requests & Roadmap Signals

Several active PRs and issues provide useful clues about where DuckDB may be heading next.

### Likely near-term improvements
#### Better numerical behavior for analytics
- PR: [#21673](https://github.com/duckdb/duckdb/pull/21673)

Returning `inf`/`nan` rather than throwing on overflow in statistical functions is a strong signal that DuckDB is refining **scientific/numerical SQL semantics** for analytical users. This feels likely to land soon because it directly addresses an open reproduced bug and aligns with user expectations.

#### Expanded nested-type SQL ergonomics
- PR: [#21672](https://github.com/duckdb/duckdb/pull/21672)

Adding `UNNEST` support for `ARRAY` types strengthens DuckDB’s handling of **nested and semi-structured data**, an area of increasing importance for modern analytics. This is a plausible candidate for the next release if review proceeds smoothly.

#### Trigger support groundwork
- PR: [#21438](https://github.com/duckdb/duckdb/pull/21438)

This is one of the clearest roadmap signals in the current PR queue. Adding **catalog storage and introspection for `CREATE TRIGGER`** suggests a broader push toward **more complete SQL DDL/object support**, even if full trigger execution semantics may arrive incrementally.

### Operational and performance roadmap signals
#### External/remote IO optimization
- PR: [#21395](https://github.com/duckdb/duckdb/pull/21395)
- Issue: [#11817](https://github.com/duckdb/duckdb/issues/11817)
- Issue: [#21669](https://github.com/duckdb/duckdb/issues/21669)

Taken together, these indicate continued focus on **cloud/object-store performance and correctness**, especially for S3-backed analytical access. Expect future releases to keep improving **cache behavior, remote reads, and export memory efficiency**.

#### WAL replay and recovery robustness
- PR: [#21608](https://github.com/duckdb/duckdb/pull/21608)

Fixing WAL replay around DDL/default expressions is a sign DuckDB is still tightening durability/restart correctness around more complex schema operations.

## 6) User Feedback Summary

The strongest user feedback today clusters around a few recurring themes:

- **Cloud storage workflows need to be more predictable and memory-efficient.** Users are pushing DuckDB hard on S3 import/export and large remote Parquet reads, and failures here are highly visible.  
  Relevant: [#11817](https://github.com/duckdb/duckdb/issues/11817), [#21669](https://github.com/duckdb/duckdb/issues/21669), [#9512](https://github.com/duckdb/duckdb/issues/9512)

- **Internal errors are still appearing in advanced SQL paths.** Macro/CTE combinations, nested execution paths, and vector bounds issues show that power users are exercising sophisticated query patterns.  
  Relevant: [#21582](https://github.com/duckdb/duckdb/issues/21582), [#21650](https://github.com/duckdb/duckdb/issues/21650)

- **Users care a lot about “principle of least surprise” behavior.** This comes through in requests around numeric overflow handling, CSV header semantics, and connection/attach state.  
  Relevant: [#14373](https://github.com/duckdb/duckdb/issues/14373), [#21653](https://github.com/duckdb/duckdb/issues/21653), [#21618](https://github.com/duckdb/duckdb/issues/21618)

- **Python and extension ecosystem stability matters.** Python remains a central surface area, and users expect development builds plus extensions to work smoothly enough for pre-release validation.  
  Relevant: [#21651](https://github.com/duckdb/duckdb/issues/21651), [#21622](https://github.com/duckdb/duckdb/issues/21622)

Overall user sentiment in this snapshot is not about missing headline features; it is more about **production polish, correctness under edge cases, and remote-data reliability**.

## 7) Backlog Watch

These items look important and may need focused maintainer attention due to age, impact, or stalled progress.

### Long-running important issues
#### Partitioned S3 `COPY` OOM
- Issue: [#11817](https://github.com/duckdb/duckdb/issues/11817)
- Created: 2024-04-24
- Why it matters: long-lived, user-visible, high reactions, core cloud-export path.

#### `SUMMARIZE` failure on `inf/-inf`
- Issue: [#14373](https://github.com/duckdb/duckdb/issues/14373)
- Created: 2024-10-15
- Why it matters: analytical correctness and robustness; now has a likely fix in [PR #21673](https://github.com/duckdb/duckdb/pull/21673).

### Stale or slow-moving PRs
#### `INSERT OR REPLACE` memory leak for in-memory databases
- PR: [#21039](https://github.com/duckdb/duckdb/pull/21039)
- Status: stale, changes requested
- Why it matters: memory leaks in mutation-heavy workloads can significantly affect embedded and service-style deployments.

#### Compatibility storage tests in parallel
- PR: [#21328](https://github.com/duckdb/duckdb/pull/21328)
- Status: open
- Why it matters: CI throughput improvements directly help project velocity and release confidence.  
  Link: [PR #21328](https://github.com/duckdb/duckdb/pull/21328)

#### `CREATE TRIGGER` catalog and introspection support
- PR: [#21438](https://github.com/duckdb/duckdb/pull/21438)
- Status: open
- Why it matters: larger-scope SQL feature work often benefits from early maintainer guidance to prevent long review cycles.

#### CLI env-var support in `ATTACH`
- PR: [#21529](https://github.com/duckdb/duckdb/pull/21529)
- Status: changes requested, CI failure
- Why it matters: likely useful to users, but may need design clarification to avoid parser complexity or SQL-surface inconsistency.

## Project Health Takeaway

DuckDB looks **active and healthy**, with strong maintainer throughput and many small-to-medium improvements landing quickly. The main caution signal is the concentration of **internal errors and native crashes in advanced or remote-data scenarios**, which suggests the current cycle still has a meaningful stabilization burden. If the team continues converting reproduced bugs into quick PRs—as seen with the statistical overflow issue and recent ADBC/S3 fixes—the near-term outlook remains strong.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-28

## 1. Today's Overview

StarRocks remained highly active over the last 24 hours, with **104 PRs updated** and **69 PRs merged/closed**, indicating strong maintainer throughput and active branch/backport management. By contrast, issue volume was light at **5 updated issues**, but several of those are high-signal because they touch **query correctness**, **external catalog planning**, and **stream ingestion compatibility**.  
The day’s engineering focus appears concentrated on three themes: **stability fixes across maintained release lines**, **external lakehouse/catalog observability and metadata behavior**, and **planner/statistics improvements for better query quality**. Overall, project health looks strong from a delivery perspective, though a few newly reported bugs point to continued risk around correctness edge cases and semi-structured/external data paths.

## 3. Project Progress

With **69 PRs merged/closed**, today’s visible progress is strongest in **stability hardening and operational observability**.

### Stability and crash fixes delivered
- **Fix CN crash when scanning empty tablet with physical split enabled** — merged and backported across maintained branches:  
  - Main fix: [#70281](https://github.com/StarRocks/starrocks/pull/70281)  
  - Backports: [#70832](https://github.com/StarRocks/starrocks/pull/70832), [#70833](https://github.com/StarRocks/starrocks/pull/70833), [#70831](https://github.com/StarRocks/starrocks/pull/70831)  
  This is an important storage/query execution stability fix, preventing SIGSEGV from an out-of-bounds access when scanning **empty tablets** under **physical split** execution.

### External table and lakehouse observability
- **Iceberg metadata table query metric added**:  
  - Main PR: [#70825](https://github.com/StarRocks/starrocks/pull/70825)  
  - Backport: [#70882](https://github.com/StarRocks/starrocks/pull/70882)  
  This improves operational insight into how often SQL workloads hit **Iceberg metadata tables**, a useful addition for mixed OLAP/lakehouse deployments.

### Ongoing but not yet merged signals
Several active PRs show where development is heading next:
- **External metadata/refactor work for Hive**: [#70910](https://github.com/StarRocks/starrocks/pull/70910)
- **Composite Storage Volume for cross-bucket partition distribution**: [#70926](https://github.com/StarRocks/starrocks/pull/70926)
- **Shared-nothing to shared-data replication enhancement for DCG files**: [#69339](https://github.com/StarRocks/starrocks/pull/69339)
- **Statistics/planner improvements around MCVs and sync stats loading**: [#70853](https://github.com/StarRocks/starrocks/pull/70853), [#70865](https://github.com/StarRocks/starrocks/pull/70865), [#70858](https://github.com/StarRocks/starrocks/pull/70858)

Taken together, today’s completed work improved **execution robustness** and **observability**, while active work suggests continued investment in **optimizer intelligence**, **lakehouse federation**, and **cloud-native storage management**.

## 4. Community Hot Topics

Below are the most consequential active items from today’s dataset, selected by technical importance and likely user impact.

### 1) Severe query correctness concern with `COUNT()` and `ORDER BY`
- Issue: [#70904](https://github.com/StarRocks/starrocks/issues/70904) — **Incorrect `count()` result when using `ORDER BY`**  
This is the most serious newly reported issue because it suggests a **wrong-result bug**, which is generally higher severity than crashes for analytical systems where trust in query output is paramount. The report appears to involve aggregation inside a subquery and result changes triggered by plan shape or ordering behavior.  
**Underlying need:** stronger regression coverage for optimizer rewrites and execution correctness under nested aggregates/order-sensitive transformations.

### 2) Routine Load + Avro nullable union compatibility
- Issue: [#70928](https://github.com/StarRocks/starrocks/issues/70928) — **ROUTINE LOAD Avro union type `["null","type"]` not handled correctly**  
This targets a common Confluent/Avro pattern for optional fields. If StarRocks mishandles standard nullable unions, that creates friction for Kafka ingestion pipelines and schema-registry-based streaming use cases.  
**Underlying need:** better compatibility with mainstream event schemas and more robust deserialization semantics in ingestion paths.

### 3) Misleading `EXPLAIN` partition counts for Hive tables
- Issue: [#70557](https://github.com/StarRocks/starrocks/issues/70557) — **EXPLAIN reports misleading partition count for Hive tables when metastore pre-filters by string partition columns**  
This is not necessarily an execution bug, but it affects **plan transparency and operator trust**, especially for users validating partition pruning.  
**Underlying need:** accurate introspection for federated query planning over external catalogs.

### 4) Cross-bucket storage placement in shared-data mode
- PR: [#70926](https://github.com/StarRocks/starrocks/pull/70926) — **Composite Storage Volume for cross-bucket partition distribution**  
This is a strong cloud-native roadmap signal. It addresses operational realities where enterprises use multiple buckets/volumes for cost, isolation, or lifecycle reasons.  
**Underlying need:** richer storage abstraction for multi-bucket deployments and more automatic partition placement.

### 5) Statistics quality for skew/null-aware optimization
- PRs:  
  - [#70865](https://github.com/StarRocks/starrocks/pull/70865) — **Implement `IS NULL` predicate stats with MCVs**  
  - [#70858](https://github.com/StarRocks/starrocks/pull/70858) — **Use explicit cast in skew rules for MCVs**  
  - [#70853](https://github.com/StarRocks/starrocks/pull/70853) — **Respect `enable_sync_statistics_load` for all statistics querying**  
These show active work on optimizer realism for skewed and null-heavy workloads, a common pain point in analytical systems.  
**Underlying need:** more dependable cost models to avoid poor plans on real-world, non-uniform datasets.

## 5. Bugs & Stability

Ranked by severity based on user impact:

### High severity
1. **Wrong-result query bug involving `COUNT()` and `ORDER BY`**
   - Issue: [#70904](https://github.com/StarRocks/starrocks/issues/70904)  
   - Risk: **query correctness**
   - Status: open
   - Fix PR: none visible in today’s data  
   This is the top stability concern today because incorrect analytical results undermine engine reliability.

2. **`sql.SQLSyntaxErrorException: invalid size_of_elem:0`**
   - Issue: [#70884](https://github.com/StarRocks/starrocks/issues/70884)  
   - Risk: likely execution/planner/type-handling failure in aggregation or expression evaluation
   - Status: open
   - Fix PR: none visible in today’s data  
   The error signature suggests a lower-level internal size/type handling issue rather than a simple parser error, so this may indicate a BE execution bug.

### Medium severity
3. **ROUTINE LOAD Avro nullable union mishandling**
   - Issue: [#70928](https://github.com/StarRocks/starrocks/issues/70928)  
   - Risk: ingestion incompatibility, failed or incorrect stream loading for common Avro schemas
   - Status: open
   - Fix PR: none visible in today’s data

4. **Misleading Hive `EXPLAIN` partition count**
   - Issue: [#70557](https://github.com/StarRocks/starrocks/issues/70557)  
   - Risk: observability/debugging confusion rather than direct runtime failure
   - Status: open
   - Fix PR context: related Hive metadata refactor may help long term — [#70910](https://github.com/StarRocks/starrocks/pull/70910), but no direct fix is indicated.

### Recently addressed stability work
5. **CN crash when scanning empty tablet with physical split enabled**
   - Fix merged: [#70281](https://github.com/StarRocks/starrocks/pull/70281)  
   - Backports: [#70832](https://github.com/StarRocks/starrocks/pull/70832), [#70833](https://github.com/StarRocks/starrocks/pull/70833), [#70831](https://github.com/StarRocks/starrocks/pull/70831)  
   This is a good example of healthy release management: crash fix landed and was rapidly propagated across supported versions.

6. **`CONVERT_TZ` returning NULL for specific timezones**
   - Open fix PR: [#70867](https://github.com/StarRocks/starrocks/pull/70867)  
   This indicates attention to SQL/timezone compatibility, especially for geographically specific production workloads.

## 6. Feature Requests & Roadmap Signals

### Access control and governance
- Issue: [#67458](https://github.com/StarRocks/starrocks/issues/67458) — **Tag-Based Access Control Policies for StarRocks Ranger Plugin**  
This is a meaningful enterprise feature request. Users managing many datasets want governance based on tags rather than manually maintaining resource-by-resource policies.  
**Prediction:** likely medium-term roadmap material rather than immediate next patch release, because it implies policy model expansion and deeper Ranger integration design.

### Cloud-native storage and replication
- PR: [#70926](https://github.com/StarRocks/starrocks/pull/70926) — **Composite Storage Volume**
- PR: [#69339](https://github.com/StarRocks/starrocks/pull/69339) — **Synchronize DCG files during shared-nothing to shared-data replication**  
These strongly signal continued investment in **shared-data mode**, **cross-bucket storage management**, and **feature-complete replication** for advanced table capabilities like partial updates/generated columns.  
**Prediction:** these are strong candidates for upcoming 4.x feature delivery, especially where cloud deployment flexibility is a selling point.

### UDF extensibility
- PR: [#64541](https://github.com/StarRocks/starrocks/pull/64541) — **Support loading UDF on S3**  
This aligns with cloud-native deployment needs and easier UDF lifecycle management.  
**Prediction:** plausible for a future minor release if security and package-fetch semantics are finalized.

### External catalog observability and metadata quality
- PR: [#70533](https://github.com/StarRocks/starrocks/pull/70533) — **Per-catalog-type query metrics for external table observability**
- PR: [#70910](https://github.com/StarRocks/starrocks/pull/70910) — **Move partition update arbitration logic into HiveMetadata**  
These indicate the team is actively improving **federated query introspection** and reducing complexity in **Hive metadata refresh/update logic**.  
**Prediction:** observability improvements are likely to land sooner than larger governance features.

## 7. User Feedback Summary

Today’s user feedback points to several practical pain points:

- **Trust in query correctness remains critical.** The `COUNT()` + `ORDER BY` report in [#70904](https://github.com/StarRocks/starrocks/issues/70904) is the clearest example: users are sensitive not just to speed, but to whether optimizer/execution rewrites preserve semantics.
- **Streaming ingestion compatibility matters.** The Avro union issue in [#70928](https://github.com/StarRocks/starrocks/issues/70928) reflects real Kafka + Schema Registry production usage, where users expect standard nullable schemas to work without custom transformations.
- **Federated/lakehouse users want transparent planning.** The Hive `EXPLAIN` complaint in [#70557](https://github.com/StarRocks/starrocks/issues/70557) shows that users actively inspect partition pruning and expect plan output to match actual metastore-driven filtering behavior.
- **Enterprise operators want scalable governance models.** The Ranger tag-policy request in [#67458](https://github.com/StarRocks/starrocks/issues/67458) suggests growing adoption in environments with many tables and compliance requirements.
- **Observability is improving and clearly valued.** The merged Iceberg metric work in [#70825](https://github.com/StarRocks/starrocks/pull/70825) reflects user demand for more precise visibility into external/lakehouse workloads.

Overall, the feedback is less about raw performance today and more about **correctness, compatibility, governance, and observability**.

## 8. Backlog Watch

These older or strategically important items appear to merit maintainer attention:

### Long-running open PRs
- [#64541](https://github.com/StarRocks/starrocks/pull/64541) — **Support loading UDF on S3**  
  Open since 2025-10-24. Important for extensibility and cloud-native deployment, but likely blocked on design/security review.

- [#69339](https://github.com/StarRocks/starrocks/pull/69339) — **Support DCG files synchronization during shared-nothing to shared-data replication**  
  Important for correctness of replicated tables using partial update/generated columns. This is a high-value infrastructure feature and should stay visible.

- [#70533](https://github.com/StarRocks/starrocks/pull/70533) — **Per-catalog-type query metrics for external table observability**  
  Worth prioritizing because external-table observability is becoming a recurring theme.

### Open issues needing product/maintainer follow-up
- [#67458](https://github.com/StarRocks/starrocks/issues/67458) — **Tag-based access control for Ranger plugin**  
  This is a strong enterprise governance request and could benefit from explicit roadmap feedback.

- [#70557](https://github.com/StarRocks/starrocks/issues/70557) — **Hive EXPLAIN partition count mismatch**  
  Even if not runtime-critical, it affects trust in StarRocks’ planner diagnostics for external catalogs.

### Newly opened but important to triage quickly
- [#70904](https://github.com/StarRocks/starrocks/issues/70904) — **Incorrect `count()` result with `ORDER BY`**
- [#70928](https://github.com/StarRocks/starrocks/issues/70928) — **ROUTINE LOAD Avro union issue**
- [#70884](https://github.com/StarRocks/starrocks/issues/70884) — **`invalid size_of_elem:0` error**  
These should receive rapid maintainer triage because they impact correctness, ingestion interoperability, and engine stability.

## Overall Health Assessment

StarRocks shows **strong development velocity and good backport discipline**, especially for crash fixes across release branches. The project’s center of gravity is clearly expanding beyond core OLAP execution into **lakehouse integration, cloud-native storage abstractions, and observability**.  
The main caution flag today is not delivery pace but **correctness and compatibility edge cases**: a wrong-result report, ingestion schema handling gaps, and external-plan transparency issues all deserve close attention. If these are triaged quickly, overall project health remains solid.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-28

## 1. Today's Overview

Apache Iceberg showed **high development activity** over the last 24 hours, with **48 PRs updated** and **7 issues updated**, although there were **no new releases**. The activity skewed heavily toward **infrastructure, CI hardening, and core table-format evolution**, with a smaller but notable stream of work on **Spark, Flink, Kafka Connect, and specification work**. On the user-facing side, the most visible pain points were around **Spark 4.1 compatibility**, **view semantics in Spark catalogs**, and a lingering **metadata path inconsistency bug** affecting table reads. Overall, project health looks strong in terms of maintainer throughput, but compatibility and semantics around newer Spark versions and advanced table/view behavior remain active pressure points.

## 2. Project Progress

### Merged/closed PRs today

Several merged/closed changes advanced project quality and operational stability:

- **CI caching modernization merged**: [PR #15799](https://github.com/apache/iceberg/pull/15799) replaced `actions/cache` with `gradle/actions/setup-gradle`, improving build reproducibility and Gradle cache correctness. This is an infra change, but it directly supports faster and more reliable contributor velocity.
- **JMH benchmark workflow fixes landed**: [PR #15729](https://github.com/apache/iceberg/pull/15729) and [PR #15802](https://github.com/apache/iceberg/pull/15802) fixed broken recurring benchmark workflows caused by Spark version drift and artifact conflicts. This matters for performance tracking and regression detection.
- **Dependabot for GitHub Actions restored**: [PR #15801](https://github.com/apache/iceberg/pull/15801) re-enabled automated dependency updates for GitHub Actions, improving maintenance hygiene.
- **Delete-vector validation optimization merged**: [PR #15653](https://github.com/apache/iceberg/pull/15653) added **manifest partition pruning** to DV validation in `MergingSnapshotProducer`, reducing unnecessary manifest reads during commit conflict checks. This is a meaningful **core storage/commit-path optimization** and should improve commit efficiency for large tables with delete manifests.
- **Spark Z-order rewrite bug closed**: the issue [#15708](https://github.com/apache/iceberg/issues/15708) was closed, indicating progress on a Spark rewrite-planning edge case involving a reserved/internal column naming collision (`ICEZVALUE`).

### What this means technically

The clearest substantive engine/storage improvement today is the **commit-time optimization for delete-vector validation**. That suggests maintainers are continuing to refine Iceberg’s metadata-heavy write paths as adoption of **deletion vectors** and more advanced maintenance operations grows. The infra work also signals a focus on keeping CI aligned with a rapidly moving dependency stack, especially around **Spark 4.x**.

## 3. Community Hot Topics

### 1) Column update metadata PoC
- [PR #15445](https://github.com/apache/iceberg/pull/15445) — **PoC: Introduce column update metadata**

This appears to be one of the most strategically important open items. The proposal introduces metadata for tracking column updates, including writing metadata into manifest entries. The underlying need is better schema/history introspection and potentially richer semantics for evolution-aware readers and maintenance tools. If pursued, this could become foundational for future lineage, auditability, and correctness features around schema changes.

### 2) Avro local timestamp compatibility
- [PR #15437](https://github.com/apache/iceberg/pull/15437) — **Core: Support reading Avro local-timestamp-* logical types**

This reflects growing interoperability needs with Avro data written outside Iceberg. Users increasingly expect Iceberg to ingest and interpret upstream datasets without bespoke conversion steps. The demand here is straightforward: better compatibility with modern Avro logical types, especially from heterogeneous ingestion pipelines.

### 3) Flink CDC streaming read support
- [PR #15282](https://github.com/apache/iceberg/pull/15282) — **Flink: Add CDC streaming read support**

This is a major roadmap signal. The addition of changelog-aware streaming read support with proper `RowKind` semantics addresses a critical need for users building **incremental pipelines, streaming ETL, and lakehouse CDC consumers**. This is one of the most consequential open feature tracks in the current set.

### 4) Materialized view specification
- [PR #11041](https://github.com/apache/iceberg/pull/11041) — **Materialized View Spec**

Even though it is older, it remains one of the most important open specification efforts. The continued updates indicate materialized views are still a live design topic. This points to demand for richer semantic layers on top of Iceberg tables, not just low-level storage abstractions.

### 5) Spark view correctness and compatibility
- [Issue #15238](https://github.com/apache/iceberg/issues/15238) — **Spark 4.1 incompatible: Create View**
- [Issue #15779](https://github.com/apache/iceberg/issues/15779) — **Spark: Iceberg views are not created as views and are appearing as tables**

These issues together show a cluster of user need around **view DDL correctness**, **catalog semantics**, and **Spark version compatibility**. As Spark 4.1 adoption starts, users expect Iceberg SQL behavior to remain stable across catalog types and view operations.

## 4. Bugs & Stability

Ranked by likely severity/impact based on the provided data:

### High severity

#### 1) Spark 4.1 view creation incompatibility
- [Issue #15238](https://github.com/apache/iceberg/issues/15238) — **[bug] Spark 4.1 incompatible: Create View**

This is likely the most urgent user-facing regression because it affects a basic SQL operation against the latest Spark line. If reproducible broadly, it creates an adoption blocker for teams testing or migrating to Spark 4.1 with Iceberg 1.10.1. No fix PR is directly referenced in the provided data.

#### 2) Metadata path inconsistency causing `NotFoundException`
- [Issue #14195](https://github.com/apache/iceberg/issues/14195) — **metadata.json points to wrong manifestlist path**

This appears severe because it can break table reads or snapshot access by referencing a non-existent manifest list path. The bug suggests a correctness problem in metadata file path generation or persistence, especially in object storage environments. No fix PR is shown here, and the issue is older, which raises concern.

### Medium severity

#### 3) Spark views showing up as tables
- [Issue #15779](https://github.com/apache/iceberg/issues/15779) — **Iceberg views are not created as views and are appearing as tables**

This is a serious semantics issue for Spark + Hive-style catalogs. It may not corrupt data, but it breaks expected catalog behavior and can confuse downstream tooling, governance, and SQL users. Given its recency, it likely needs triage quickly.

#### 4) Z-order rewrite failure with `ICEZVALUE` column naming collision
- [Issue #15708](https://github.com/apache/iceberg/issues/15708) — **closed**

This bug is already closed, which is good. It points to an internal-name collision in Spark rewrite logic and shows maintainers are responsive to optimizer/maintenance edge cases.

### Low severity / correctness enhancement

#### 5) StrictMetricsEvaluator `notStartsWith()` impossible-match handling
- [Issue #13765](https://github.com/apache/iceberg/issues/13765) — **closed improvement**

This was a pruning/correctness enhancement request for evaluator logic. Closing it reduces ambiguity around metrics-based filtering semantics, though impact is less visible to end users than the Spark issues above.

## 5. Feature Requests & Roadmap Signals

### Key requests and signals

#### Schema evolution: dropping map fields
- [Issue #15313](https://github.com/apache/iceberg/issues/15313) — **Alter schema: allow to drop map fields**

This is a strong signal that users want more flexible schema evolution for complex types. The current restriction on deleting map-related fields is causing friction in real-world lifecycle management. This feels like a plausible candidate for future work, though it may require careful spec and compatibility analysis.

#### Flink CDC reads
- [PR #15282](https://github.com/apache/iceberg/pull/15282)

Likely one of the strongest candidates for a future release if implementation matures. CDC is a recurring lakehouse adoption requirement, and Flink users in particular need first-class changelog semantics.

#### Kafka Connect schema/default handling
- [PR #15209](https://github.com/apache/iceberg/pull/15209) — **Add Default Value Support for Kafka Connect**
- [PR #15234](https://github.com/apache/iceberg/pull/15234) — **Remove `iceberg.connect.group.id` config...** (closed)
- [PR #15162](https://github.com/apache/iceberg/pull/15162) — **Cdc support with dv**

These items indicate the Kafka Connect integration is still evolving toward easier configuration and better schema/default-value behavior. Default value support is especially likely to be user-visible in a future version because it reduces ingestion friction.

#### Manifest format evolution in V4
- [PR #15634](https://github.com/apache/iceberg/pull/15634) — **Allow for Writing Parquet/Avro Manifests in V4**

This is a meaningful roadmap indicator for storage format evolution. If merged, it could improve performance and open up more flexibility in metadata encoding, especially as Iceberg advances table format version 4 capabilities.

#### Materialized views
- [PR #11041](https://github.com/apache/iceberg/pull/11041)

Still a long-range roadmap item, but strategically important. It may not arrive quickly, yet its continued movement suggests the project is thinking beyond core table storage into semantic data products.

### Most likely near-term candidates for the next version
Based on current momentum:
1. **Avro local timestamp support** — [PR #15437](https://github.com/apache/iceberg/pull/15437)
2. **Kafka Connect default value support** — [PR #15209](https://github.com/apache/iceberg/pull/15209)
3. **Manifest/storage improvements for V4** — [PR #15634](https://github.com/apache/iceberg/pull/15634)
4. **Additional Spark compatibility fixes**, especially around views — [Issue #15238](https://github.com/apache/iceberg/issues/15238), [Issue #15779](https://github.com/apache/iceberg/issues/15779)

## 6. User Feedback Summary

Current user feedback clusters around a few concrete pain points:

- **Spark compatibility is fragile at version boundaries**, especially with **Spark 4.1** and SQL view operations:
  - [#15238](https://github.com/apache/iceberg/issues/15238)
  - [#15779](https://github.com/apache/iceberg/issues/15779)

- **Schema evolution for nested/complex types remains too restrictive** for some production users:
  - [#15313](https://github.com/apache/iceberg/issues/15313)

- **Metadata path correctness and object-storage reliability** remain a trust-sensitive area:
  - [#14195](https://github.com/apache/iceberg/issues/14195)

- Users continue pushing for **better interoperability**:
  - Avro logical type support: [#15437](https://github.com/apache/iceberg/pull/15437)
  - Kafka Connect defaults and CDC: [#15209](https://github.com/apache/iceberg/pull/15209), [#15162](https://github.com/apache/iceberg/pull/15162)
  - Flink CDC reads: [#15282](https://github.com/apache/iceberg/pull/15282)

Overall sentiment from the issue mix suggests users are not primarily asking for brand-new SQL syntax; instead, they want **reliable engine compatibility, smoother connector behavior, and more complete evolution semantics**.

## 7. Backlog Watch

These items appear to need maintainer attention because of age, importance, or user impact:

### Important older issue still open
- [Issue #14195](https://github.com/apache/iceberg/issues/14195) — **NotFoundException due to wrong manifest list path**
  - Older, user-impacting, and potentially correctness-related.
  - Worth prioritizing if reproducible.

### Open feature with practical demand
- [Issue #15313](https://github.com/apache/iceberg/issues/15313) — **Allow dropping map fields**
  - Important for schema lifecycle management.
  - Could benefit from a design decision even if implementation is non-trivial.

### Strategic but aging PRs
- [PR #11041](https://github.com/apache/iceberg/pull/11041) — **Materialized View Spec**
  - High strategic value, long-running.
- [PR #15282](https://github.com/apache/iceberg/pull/15282) — **Flink CDC streaming read support**
  - High user value for streaming ecosystems.
- [PR #15445](https://github.com/apache/iceberg/pull/15445) — **Column update metadata PoC**
  - Potentially foundational, but likely needs clearer scoping and design convergence.
- [PR #15437](https://github.com/apache/iceberg/pull/15437) — **Avro local timestamp support**
  - Practical interoperability enhancement with broad applicability.

## 8. Project Health Assessment

Iceberg remains **highly active and technically ambitious**, with healthy signs in both core-engine improvement and ecosystem breadth. Today’s merged changes improved **commit efficiency** and **CI reliability**, while open work points toward **CDC support, richer metadata semantics, storage-format evolution, and specification growth**. The main risk area is **user-facing SQL/catalog correctness in Spark**, particularly around **views and Spark 4.1 behavior**, plus a lingering metadata-path bug that deserves attention. Net assessment: **strong project momentum, good maintainer responsiveness, but compatibility stabilization should remain a near-term priority**.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-28

## 1. Today's Overview

Delta Lake showed **high pull-request activity** over the last 24 hours, with **50 PRs updated** and **20 PRs merged/closed**, while issue traffic remained light at just **3 active issues** and **no closures**. The development pattern suggests the project is in a **heavy implementation and review phase**, especially around **Kernel + Spark DSv2 integration**, **CDC streaming**, **DDL plumbing**, and **schema/type handling**. No new release was cut today, so momentum is currently concentrated in landing infrastructure and correctness work rather than packaging user-facing versions. Overall, project health looks **active and forward-moving**, with strong engineering throughput but a few important correctness bugs still open.

## 2. Project Progress

Today’s merged/closed PR count (**20**) indicates meaningful forward motion, even though the provided dataset only details the most-commented/open PRs rather than the exact merged set. Based on what is actively being updated, the main areas of progress appear to be:

- **Kernel-Spark DSv2 maturation**, especially around pushdown, DDL, and streaming:
  - [#6332](https://github.com/delta-io/delta/pull/6332) — **Implement `SupportsPushDownLimit` in Delta V2 connector**. This is a practical query-engine improvement: pushing `LIMIT` into scans can reduce file reads and improve latency for exploratory queries and BI workloads.
  - [#6377](https://github.com/delta-io/delta/pull/6377), [#6378](https://github.com/delta-io/delta/pull/6378), [#6379](https://github.com/delta-io/delta/pull/6379) — a stacked effort to route **`CREATE TABLE` through DSv2 + Kernel paths**. This is a strategic architectural step toward reducing Spark-only special casing and consolidating behavior behind newer APIs.

- **CDC streaming support in kernel-spark** is the most visible multi-PR investment:
  - [#6075](https://github.com/delta-io/delta/pull/6075), [#6076](https://github.com/delta-io/delta/pull/6076), [#6336](https://github.com/delta-io/delta/pull/6336), [#6359](https://github.com/delta-io/delta/pull/6359), [#6362](https://github.com/delta-io/delta/pull/6362), [#6363](https://github.com/delta-io/delta/pull/6363), [#6370](https://github.com/delta-io/delta/pull/6370), [#6388](https://github.com/delta-io/delta/pull/6388), [#6391](https://github.com/delta-io/delta/pull/6391)
  - This stack covers **offset management, commit processing, schema coordination, DV support, admission controls, and end-to-end tests**. That breadth signals Delta Lake is pushing toward more complete and production-ready CDC behavior in the V2/kernel path.

- **Type system and schema correctness** continue to improve in Kernel:
  - [#6257](https://github.com/delta-io/delta/pull/6257) — implicit casts between `DECIMAL` types with different precisions.
  - [#6259](https://github.com/delta-io/delta/pull/6259) — fixes `Literal.ofDecimal` handling for Java `BigDecimal` edge cases.
  - These are important for SQL compatibility and reducing surprising runtime failures in mixed-engine or Java-heavy integrations.

- **Spark write-path and maintenance refactoring** is still active:
  - [#6374](https://github.com/delta-io/delta/pull/6374) — refactors `REPLACE WHERE`.
  - [#6375](https://github.com/delta-io/delta/pull/6375) — introduces an option to change null handling in DPO-related equality behavior, aiming to avoid overwriting partitions containing `NULL`.
  - This suggests continued hardening of nuanced write semantics that matter in partitioned production tables.

- **Interoperability work** remains visible:
  - [#6430](https://github.com/delta-io/delta/pull/6430) — adds UniForm/Iceberg reading tests, signaling continued investment in cross-table-format compatibility.

## 3. Community Hot Topics

The most technically important active threads today are less about comment volume in the provided data and more about **scope and roadmap significance**.

### A. Kernel-Spark CDC streaming stack
Key PRs:
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)
- [#6388](https://github.com/delta-io/delta/pull/6388)
- [#6391](https://github.com/delta-io/delta/pull/6391)

**Why it matters:**  
This is the clearest roadmap signal in the repo right now. Delta Lake is investing heavily in making **Change Data Feed + streaming** work cleanly through the **Kernel-backed DSv2 path**, including difficult cases like **Deletion Vectors**, **schema coordination**, and **start offset semantics**. The underlying user need is straightforward: teams want a consistent, modern connector path for incremental ingestion and downstream streaming consumption without depending on legacy code paths.

### B. DSv2 DDL and catalog modernization
Key PRs:
- [#6377](https://github.com/delta-io/delta/pull/6377)
- [#6378](https://github.com/delta-io/delta/pull/6378)
- [#6379](https://github.com/delta-io/delta/pull/6379)

**Why it matters:**  
Moving `CREATE TABLE` into DSv2/Kernel pathways suggests Delta is modernizing how table creation and catalog interactions are implemented. This likely improves consistency with Spark’s newer connector model, helps long-term maintainability, and may eventually unlock more portable engine integrations.

### C. Query pushdown and connector performance
Key PR:
- [#6332](https://github.com/delta-io/delta/pull/6332)

**Why it matters:**  
`LIMIT` pushdown is a concrete engine optimization that users will feel in interactive workloads. It also indicates the Delta V2 connector is expanding from baseline correctness toward **planner-aware performance features**.

### D. Long-lived bug around MERGE + Deletion Vectors
Issue:
- [#2943](https://github.com/delta-io/delta/issues/2943) — **[BUG][Spark] Deletion Vectors can cause `AMBIGUOUS_REFERENCE` errors on MERGE**

**Why it matters:**  
This is the only issue in the set with visible discussion history and an older creation date. It points to a persistent correctness edge case where newer storage features interact badly with SQL analysis/planning in MERGE operations.

## 4. Bugs & Stability

Ranked by likely severity and breadth of impact:

### 1. MERGE correctness issue with Deletion Vectors
- [#2943](https://github.com/delta-io/delta/issues/2943) — **Deletion Vectors can cause `AMBIGUOUS_REFERENCE` errors on MERGE**
- Severity: **High**
- Why: `MERGE` is a core Delta operation, and Deletion Vectors are a major storage optimization feature. Any correctness or analyzer failure at this intersection is serious for production ETL and CDC pipelines.
- Fix PR visible today: **No direct fix PR is linked in the provided data**, though CDC/DV-related work such as [#6370](https://github.com/delta-io/delta/pull/6370) may be adjacent technically.

### 2. Schema evolution rejects valid nullable struct additions
- [#6428](https://github.com/delta-io/delta/issues/6428) — **Schema evolution incorrectly rejects adding nullable struct with non-nullable inner fields**
- Severity: **Medium-High**
- Why: This is a schema validation correctness bug. If confirmed broadly, it affects evolving nested schemas—common in semi-structured and ingestion-heavy workloads.
- Impact: Could block users from safely adding nested columns during schema evolution, especially in pipelines that ingest JSON-like structures.
- Fix PR visible today: **None explicitly linked**.

### 3. Protocol change request with unclear details
- [#6426](https://github.com/delta-io/delta/issues/6426) — **[PROTOCOL RFC]**
- Severity: **Unknown**
- Why: Not a bug by itself, but protocol change requests are important because they can affect compatibility across readers/writers and external engines.
- Fix PR visible today: Not applicable.

Additional stability signals from active PRs:
- [#6257](https://github.com/delta-io/delta/pull/6257) and [#6259](https://github.com/delta-io/delta/pull/6259) suggest maintainers are actively addressing **numeric type edge cases** in Kernel.
- [#6375](https://github.com/delta-io/delta/pull/6375) suggests users have encountered **NULL-related partition overwrite behavior** surprising enough to warrant a new option rather than just a refactor.

## 5. Feature Requests & Roadmap Signals

### Strong signals likely to shape the next release

1. **Kernel-backed Spark DSv2 becomes more complete**
   - Evidence: [#6332](https://github.com/delta-io/delta/pull/6332), [#6377](https://github.com/delta-io/delta/pull/6378), [#6379](https://github.com/delta-io/delta/pull/6379)
   - Prediction: Expect the next version to highlight **better DSv2 coverage**, especially around table creation and planner pushdowns.

2. **CDC streaming through Kernel-Spark is a major near-term milestone**
   - Evidence: the large stacked PR set from [#6075](https://github.com/delta-io/delta/pull/6075) through [#6391](https://github.com/delta-io/delta/pull/6391)
   - Prediction: Very likely to appear in upcoming release notes as either a major new capability or an “experimental/preview improved path” depending on how much of the stack lands.

3. **Better type coercion and decimal interoperability in Kernel**
   - Evidence: [#6257](https://github.com/delta-io/delta/pull/6257), [#6259](https://github.com/delta-io/delta/pull/6259)
   - Prediction: Expect continued work on SQL type compatibility, especially where Spark semantics and Kernel semantics need alignment.

4. **Multi-format interoperability remains on the roadmap**
   - Evidence: [#6430](https://github.com/delta-io/delta/pull/6430)
   - Prediction: UniForm/Iceberg compatibility testing will likely continue expanding, especially for read validation and converter correctness.

5. **Protocol evolution is still open**
   - Evidence: [#6426](https://github.com/delta-io/delta/issues/6426)
   - Prediction: Too early to forecast the exact feature, but protocol RFCs often precede larger storage-level capabilities, cross-engine behavior changes, or metadata evolution.

## 6. User Feedback Summary

From today’s issues and active PR themes, user feedback clusters around a few recurring pain points:

- **Correctness over raw feature count** remains the dominant need.
  - Users are reporting schema evolution validation mismatches ([#6428](https://github.com/delta-io/delta/issues/6428)).
  - MERGE behavior with advanced storage features is still problematic in edge cases ([#2943](https://github.com/delta-io/delta/issues/2943)).

- **Users want modern connector paths without regressions.**
  - The volume of DSv2 + Kernel work implies adoption pressure: people want the newer path to support streaming, DDL, pushdowns, and CDC on par with or better than legacy implementations.

- **Nested schemas, decimals, NULL handling, and CDC are practical production concerns.**
  - These are not cosmetic improvements; they map directly to ingestion pipelines, finance-like decimal workloads, partitioned data maintenance, and event-driven architectures.

- **Interoperability matters.**
  - Work like [#6430](https://github.com/delta-io/delta/pull/6430) suggests users care about reading/writing data across Delta/Iceberg ecosystems, or at least validating those boundaries.

Overall user sentiment inferred from activity: **the project is trusted for serious workloads, but users are pushing hard on edge-case correctness and parity in newer execution paths**.

## 7. Backlog Watch

These items look like they deserve maintainer attention because they are either older, strategically important, or likely to affect adoption:

### A. Long-lived MERGE + DV bug
- [#2943](https://github.com/delta-io/delta/issues/2943)
- Reason to watch: Open since **2024-04-22** and still active in 2026. It touches a high-value intersection of `MERGE` and Deletion Vectors. Long-lived correctness bugs in core DML paths can slow enterprise adoption of newer storage features.

### B. Path handling in Snapshot metadata logic
- [#6162](https://github.com/delta-io/delta/pull/6162)
- Reason to watch: “Remove path transformation from Snapshot” suggests subtle metadata/path normalization behavior. These changes can be risky and important for cloud/object-store correctness, table portability, and user expectations.

### C. Decimal coercion edge cases in Kernel
- [#6257](https://github.com/delta-io/delta/pull/6257)
- [#6259](https://github.com/delta-io/delta/pull/6259)
- Reason to watch: Type-system bugs often create hard-to-debug runtime failures and cross-language inconsistencies, especially in Java/Scala mixed stacks.

### D. The large CDC stacked series
- [#6075](https://github.com/delta-io/delta/pull/6075) and follow-ons through [#6391](https://github.com/delta-io/delta/pull/6391)
- Reason to watch: High strategic value, but stacked PRs can be review-heavy and slow to merge. This series likely needs sustained maintainer attention to avoid drift and rebase churn.

### E. New schema evolution bug
- [#6428](https://github.com/delta-io/delta/issues/6428)
- Reason to watch: Newly reported, but likely impactful for nested-schema users. If reproducible, it should be triaged quickly because schema evolution failures can block production data ingestion.

## 8. Project Health Assessment

Delta Lake appears **healthy and highly active**, with especially strong momentum in **Kernel/Spark modernization** and **CDC streaming support**. The absence of a new release suggests the project is still consolidating substantial architectural work before shipping it broadly. The main risk area is not inactivity but **complexity**: multiple stacked PR series, evolving DSv2 pathways, and nuanced correctness bugs around schema evolution, decimals, NULL semantics, and Deletion Vectors. If maintainers can convert the current implementation wave into a stable release, the next version could deliver meaningful advances in performance, streaming, and engine architecture.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-28

## 1. Today's Overview

Databend showed **moderate-to-high engineering activity** over the last 24 hours, with **15 pull requests updated** and **7 merged/closed**, while issue traffic remained light at **3 updated issues**. The day’s changes were concentrated in the **query engine**, especially around **aggregation memory/spilling behavior, MERGE/UPDATE correctness, SQL compatibility, and execution error semantics**. There are also clear signs of **ongoing performance work**, including string-function fast paths and partitioned hash join support still under review. Overall, project health looks solid: maintainers are closing correctness and reliability fixes quickly, but one notable **INSERT performance regression** remains open and deserves attention.

## 2. Project Progress

### Merged/closed PRs advancing the engine today

- [#19622](https://github.com/databendlabs/databend/pull/19622) — **fix(query): resolve spilling problems and refine memory usage in aggregation**  
  This is the most important runtime stability change of the day. It improves aggregation behavior under memory pressure, addressing spill-path issues and refining memory accounting. For analytical workloads with large GROUP BYs or skewed partitions, this should reduce failure risk and improve predictability.

- [#19624](https://github.com/databendlabs/databend/pull/19624) — **fix: restore enable_merge_into_row_fetch**  
  Restores planner respect for the `enable_merge_into_row_fetch` setting during MERGE planning. This is important for users relying on planner controls for performance tuning or reproducibility of execution plans.

- [#19625](https://github.com/databendlabs/databend/pull/19625) — **fix(query): enforce row access policy for Direct UPDATE and split predicate fields**  
  A meaningful **security/correctness** fix. It ensures row access policy is applied correctly in Direct UPDATE paths, especially when no explicit user WHERE clause exists. This closes a potentially serious policy enforcement gap.

- [#19614](https://github.com/databendlabs/databend/pull/19614) — **fix: rename PanicError and fix executor OOM mapping**  
  This improves **error model clarity** and operational diagnostics. `ErrorCode::PanicError` was renamed to `UnwindError`, while executor memory-limit flush failures are no longer misreported under the panic-like code path. This should help operators distinguish internal unwinds from memory-pressure events.

- [#19579](https://github.com/databendlabs/databend/pull/19579) — **refactor(sql): separate aggregate registration and reuse in binder**  
  A deeper SQL-layer refactor that unifies aggregate binding logic across builtins, UDAFs, and grouping metadata. This does not immediately expose a new feature but strengthens the planner/binder foundation for future SQL compatibility work.

- [#19549](https://github.com/databendlabs/databend/pull/19549) — **feat(query): support experimental table tags for FUSE table snapshots**  
  This extends Databend’s table-versioning story using a new KV-backed table tag model. It is an important roadmap signal toward richer snapshot referencing and data lifecycle workflows.

- [#14703](https://github.com/databendlabs/databend/pull/14703) — **feat: implement partial full outer join for merge into I/O improvement**  
  Although old, it was closed today and represents a long-running optimization thread around `MERGE INTO` I/O efficiency. Even as a closed item, it indicates sustained work on reducing merge costs in storage/query execution.

## 3. Community Hot Topics

### 1) INSERT performance regression
- [Issue #19481](https://github.com/databendlabs/databend/issues/19481) — **[C-bug] bug: slower performance of INSERT with 1.2.881**  
  **29 comments**, making it the most active discussion in the current issue set.  
  **Technical need:** users care deeply about **write-path regression detection** across nightlies. The issue compares behavior between `1.2.790` and `1.2.881-nightly`, suggesting that ingestion throughput is a major production concern. For OLAP systems, insert speed affects both batch loading and streaming micro-batch use cases, so unresolved write regressions can block upgrades.

### 2) Ongoing large query-engine refactors
- [PR #19553](https://github.com/databendlabs/databend/pull/19553) — **refactor(query): support partitioned hash join**  
  This is one of the most strategically important open PRs.  
  **Technical need:** better join scalability under large-memory or spilling scenarios. Partitioned hash join is typically introduced to improve robustness on big joins and reduce peak memory pressure.

- [PR #19551](https://github.com/databendlabs/databend/pull/19551) — **feat(query): support experimental table branch**  
  **Technical need:** branch-like semantics for FUSE tables indicate demand for **data versioning, isolated experimentation, and branch-aware lifecycle management**. This aligns with lakehouse-style workflows.

### 3) SQL/runtime micro-optimization and compatibility
- [PR #19628](https://github.com/databendlabs/databend/pull/19628) — **feat: add fast paths for substr and string column concat**  
  This targets common string-processing workloads and suggests the team is actively chasing CPU efficiency in hot scalar paths.

- [PR #19615](https://github.com/databendlabs/databend/pull/19615) — **fix(query): support IF NOT EXISTS for ALTER TABLE ADD COLUMN**  
  This reflects practical SQL compatibility needs, especially for tools and migration frameworks that expect idempotent DDL.

## 4. Bugs & Stability

Ranked by likely severity and production impact:

### High severity
1. [Issue #19481](https://github.com/databendlabs/databend/issues/19481) — **INSERT slower in 1.2.881-nightly**  
   A likely **performance regression** affecting write throughput. Since inserts are core to warehouse ingestion, this is the most important open user-facing bug today.  
   **Fix PR exists?** No direct linked fix in the provided data.

2. [PR #19625](https://github.com/databendlabs/databend/pull/19625) — **row access policy enforcement for Direct UPDATE**  
   This was already closed/merged and addressed a **query correctness and policy enforcement** problem.  
   **Risk:** incorrect mutation visibility or policy bypass in a specific UPDATE execution path.

### Medium severity
3. [PR #19622](https://github.com/databendlabs/databend/pull/19622) — **aggregation spilling and memory usage fixes**  
   Important for stability on larger analytical queries.  
   **Risk:** spill failures, excessive memory use, degraded reliability under pressure.

4. [PR #19614](https://github.com/databendlabs/databend/pull/19614) — **error renaming and executor OOM mapping**  
   More operational than correctness-focused, but highly relevant for troubleshooting.  
   **Risk:** misleading panic-style errors could slow diagnosis of memory-related failures.

5. [PR #19624](https://github.com/databendlabs/databend/pull/19624) — **restore MERGE planner setting behavior**  
   A planner control bug that could affect expected plan shape and tuning behavior for MERGE workloads.

### Lower severity
6. [PR #19623](https://github.com/databendlabs/databend/pull/19623) — **fix variant cast to number**  
   Open, but useful for type compatibility and predictable semi-structured data behavior. It addresses numeric casting semantics when VARIANT contains floating-point values.

7. [Issue #19629](https://github.com/databendlabs/databend/issues/19629) — **Link Checker Report**  
   Low runtime severity; documentation/tooling quality issue rather than engine stability.

## 5. Feature Requests & Roadmap Signals

The strongest roadmap signals today come from open PRs rather than formal feature issues:

- [PR #19551](https://github.com/databendlabs/databend/pull/19551) — **experimental table branch support**  
  Likely part of an emerging **data version control / branchable table state** feature family for FUSE tables.

- [PR #19549](https://github.com/databendlabs/databend/pull/19549) — **experimental table tags for FUSE snapshots**  
  Already closed, and together with table branch work suggests Databend is investing in **snapshot references, branch/tag metadata, and branch-aware GC**.

- [PR #19553](https://github.com/databendlabs/databend/pull/19553) — **partitioned hash join**  
  Strong signal that the next version may improve **join scalability and memory behavior** for larger datasets.

- [PR #19628](https://github.com/databendlabs/databend/pull/19628) — **fast paths for substr and string concat**  
  Suggests near-term gains in **expression execution performance** for text-heavy analytics.

- [PR #19615](https://github.com/databendlabs/databend/pull/19615) — **ALTER TABLE ADD COLUMN IF NOT EXISTS**  
  A likely candidate for the next release because it is narrowly scoped, user-visible, and improves compatibility with common DDL automation patterns.

### Likely next-version inclusions
Most likely to land soon based on maturity and user value:
1. `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` support  
2. VARIANT-to-number cast improvements  
3. String function fast paths  
4. Partitioned hash join, if review/testing completes  
5. Experimental FUSE table branch/tag capabilities, likely gated or documented as experimental

## 6. User Feedback Summary

User feedback today is limited but clear:

- **Performance regressions are highly visible and painful.**  
  [Issue #19481](https://github.com/databendlabs/databend/issues/19481) shows that users are benchmarking nightly upgrades and are sensitive to INSERT slowdown. This suggests active real-world ingestion workloads and a user base willing to validate releases comparatively.

- **SQL compatibility and predictable DDL matter.**  
  [PR #19615](https://github.com/databendlabs/databend/pull/19615) indicates demand for idempotent schema evolution semantics expected by migration tools and automation systems.

- **Semi-structured type conversion remains important.**  
  [PR #19623](https://github.com/databendlabs/databend/pull/19623) points to real usage of VARIANT data with downstream numeric casting expectations.

- **Large-query stability is a central concern.**  
  The aggregation spill fixes in [#19622](https://github.com/databendlabs/databend/pull/19622) and ongoing partitioned join work in [#19553](https://github.com/databendlabs/databend/pull/19553) suggest users are pushing Databend on memory-intensive analytical workloads.

## 7. Backlog Watch

These items appear to need continued maintainer attention:

- [Issue #19481](https://github.com/databendlabs/databend/issues/19481) — **INSERT performance regression**  
  Not old, but important and active. This should stay high priority until root-caused and benchmarked.

- [PR #19553](https://github.com/databendlabs/databend/pull/19553) — **partitioned hash join**  
  Open since 2026-03-16. Significant architectural value, but likely needs careful review because of execution and memory-management complexity.

- [PR #19551](https://github.com/databendlabs/databend/pull/19551) — **experimental table branch**  
  Open since 2026-03-15. Large-scope feature touching metadata, reads/writes, and GC; worth watching for design and operability implications.

- [PR #19567](https://github.com/databendlabs/databend/pull/19567) — **agg index rewrite matching refactor**  
  Important optimizer-quality work. Open refactors in this area can affect rewrite correctness and planner maintainability.

- [PR #19623](https://github.com/databendlabs/databend/pull/19623) — **variant cast to number**  
  Smaller than the others, but it directly affects SQL correctness and user expectations; should be straightforward to finish if tests are solid.

## 8. Overall Health Signal

Databend appears to be in a **healthy but fast-moving phase**: maintainers are landing meaningful correctness and memory-stability fixes quickly, while also pushing larger roadmap items in query execution and table versioning. The main risk signal today is **write-path performance regression** on nightly builds. If that issue is resolved promptly, the current development pattern points to improving maturity in both **engine robustness** and **advanced lakehouse-style table semantics**.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-28

## 1. Today's Overview

Velox showed **high PR activity and light issue activity** over the last 24 hours: **34 PRs updated**, **6 merged/closed**, and **3 issues updated**, with **no new releases**. The development mix is notably balanced between **engine internals**, **build/CI tooling**, **Parquet and type-system compatibility**, and continued **GPU/cuDF execution expansion**. Overall project health looks strong: maintainers are landing refactors and infrastructure improvements while several feature PRs remain active, suggesting steady forward motion rather than firefighting. The open issues and PRs also indicate ongoing emphasis on **SQL compatibility**, **storage interoperability**, and **GPU operator coverage for Presto workloads**.

## 2. Project Progress

### Merged / closed PRs today

#### 1) Index lookup runtime stats cleanup
- [PR #16939](https://github.com/facebookincubator/velox/pull/16939) — **Merged**
- **What advanced:** cleanup of `IndexLookupJoin` stats splitting, including moving stat constants into `IndexSource`.
- **Why it matters:** this improves observability and maintainability in connector/index lookup paths, which is important for diagnosing performance in lookup-heavy analytical queries.

#### 2) CMake header ownership tracking
- [PR #16897](https://github.com/facebookincubator/velox/pull/16897) — **Merged**
- **What advanced:** associates header files with CMake targets using `FILE_SET`.
- **Why it matters:** while not a runtime engine feature, this is a meaningful build-system improvement that enables better target ownership analysis, dependency mapping, and CI/build impact tooling. It supports faster and safer iteration in a large analytical engine codebase.

#### 3) Session/connector config fallback helper
- [PR #16687](https://github.com/facebookincubator/velox/pull/16687) — **Merged**
- **What advanced:** adds a helper for fallback between session config and connector config with auto-inferred keys.
- **Why it matters:** this improves configuration ergonomics and consistency, especially relevant for connectors and execution settings where precedence rules can affect correctness and user expectations.

#### 4) CI cleanup and dependency fetch optimization
- [PR #16784](https://github.com/facebookincubator/velox/pull/16784) — **Merged**
- **What advanced:** CI cleanup and switching some dependency fetching from Git checkout to `wget`.
- **Why it matters:** improves CI efficiency and reliability, helping maintain overall engineering velocity.

### Net progress signal
Today’s merged work did not introduce large end-user features directly, but it **strengthened the foundation** in three ways:
- better **performance instrumentation** around index-based access paths,
- better **configuration behavior** across connectors/sessions,
- better **build graph introspection and CI maintainability**.

These are the kinds of changes that usually precede faster feature delivery and easier debugging.

## 3. Community Hot Topics

### A) cuDF operator architecture unification
- [Issue #16885](https://github.com/facebookincubator/velox/issues/16885) — **11 comments**
- **Topic:** unify cuDF operators under a common base class architecture.
- **Underlying need:** Velox’s GPU operator stack appears to have accumulated multiple operators (`CudfTopN`, `CudfLimit`, `CudfOrderBy`, etc.) with duplicated inheritance patterns and boilerplate. The request points to a maintainability problem: without a common abstraction, adding new GPU operators becomes slower, riskier, and harder to standardize.
- **Why hot:** this is a roadmap-enabling refactor, not just code cleanup. It directly affects how quickly the project can close GPU execution gaps.

### B) Parquet thrift dependency replacement / FBThrift support
- [Issue #13175](https://github.com/facebookincubator/velox/issues/13175) — **10 comments**, **1 reaction**
- **Topic:** add support for FBThrift in Parquet and remove thrift dependency.
- **Underlying need:** this is about **dependency strategy and integration compatibility**. As Velox expands into remote function execution and broader deployment environments, minimizing or replacing problematic dependencies in Parquet handling becomes increasingly important.
- **Why hot:** Parquet is central to analytical workloads, so any dependency simplification in this area has wide downstream impact.

### C) GPU coverage for Presto TPC-DS
- [Issue #15772](https://github.com/facebookincubator/velox/issues/15772) — **8 comments**
- **Topic:** missing cuDF operators cause fallback to CPU on Presto TPC-DS SF100.
- **Underlying need:** users want **end-to-end GPU pipeline continuity** to avoid driver-adapter fallback overhead and performance loss.
- **Related active fix/work:** [PR #16920](https://github.com/facebookincubator/velox/pull/16920) adds a GPU `CudfEnforceSingleRow` operator specifically to reduce such gaps.
- **Why hot:** this issue is a direct expression of production benchmarking needs rather than a theoretical feature request.

### D) Build impact analysis workflow
- [PR #16827](https://github.com/facebookincubator/velox/pull/16827)
- **Topic:** workflow to analyze which CMake targets are affected by PR changes.
- **Underlying need:** in a large C++ analytical engine, contributors need faster, more targeted validation. This reduces CI waste and shortens review cycles.
- **Connection:** it pairs naturally with merged [PR #16897](https://github.com/facebookincubator/velox/pull/16897), which made header ownership visible to the CMake File API.

## 4. Bugs & Stability

Ranked by likely severity and user impact from today’s visible activity:

### High: query correctness / invalid timestamp acceptance
- [PR #16944](https://github.com/facebookincubator/velox/pull/16944) — **Open**
- **Issue:** fixes an off-by-one validation bug in `make_timestamp` where invalid values like `hour=24` and `minute=60` were accepted due to `>` instead of `>=`.
- **Severity:** **High** for SQL correctness. Incorrect acceptance of invalid temporal inputs can produce silently wrong results.
- **Fix status:** fix PR is already open.

### Medium: cuDF fallback gaps causing performance regression
- [Issue #15772](https://github.com/facebookincubator/velox/issues/15772) — **Open**
- [PR #16920](https://github.com/facebookincubator/velox/pull/16920) — **Open**
- **Issue:** missing GPU operators trigger CPU fallback in TPC-DS queries.
- **Severity:** **Medium** from a correctness standpoint, but **High** for performance-sensitive GPU users.
- **Fix status:** partial mitigation underway via `CudfEnforceSingleRow`.

### Medium: complex type naming / format conversion in cuDF
- [PR #16818](https://github.com/facebookincubator/velox/pull/16818) — **Open**
- **Issue:** fixes complex data type naming in format conversion and adds tests.
- **Severity:** **Medium**, especially for nested/complex type interoperability in GPU paths.
- **Fix status:** open PR.

### Medium: dependency / interoperability risk in native Parquet reader
- [Issue #13175](https://github.com/facebookincubator/velox/issues/13175) — **Open**
- **Issue:** current thrift dependency in native Parquet reader may limit integration and future remote execution architecture.
- **Severity:** **Medium** strategic stability risk rather than an immediate crash/correctness bug.
- **Fix status:** no linked implementation PR in the provided data.

### Low to Medium: CI diagnosis friction
- [PR #16938](https://github.com/facebookincubator/velox/pull/16938) — **Open**
- **Issue:** debug builds combine build and test in one job, making failures harder to classify.
- **Severity:** low for end users, medium for contributor productivity.
- **Fix status:** open PR.

## 5. Feature Requests & Roadmap Signals

### Strong roadmap signal: broader GPU execution coverage
- [Issue #15772](https://github.com/facebookincubator/velox/issues/15772)
- [Issue #16885](https://github.com/facebookincubator/velox/issues/16885)
- [PR #16920](https://github.com/facebookincubator/velox/pull/16920)
- [PR #16535](https://github.com/facebookincubator/velox/pull/16535)
- **Signal:** GPU support is not just being patched; it is being systematized.
- **Likely next-version impact:** more cuDF operators, fewer CPU fallbacks, cleaner config scoping for GPU execution, and possibly better internal extensibility for GPU operators.

### Strong roadmap signal: Parquet compatibility and writer behavior
- [PR #16941](https://github.com/facebookincubator/velox/pull/16941)
- [Issue #13175](https://github.com/facebookincubator/velox/issues/13175)
- **Signal:** Velox is addressing both **Parquet dependency architecture** and **writer compatibility semantics**.
- **Likely next-version impact:** better interoperability with Spark/Flink/Hive ecosystems, especially around decimal encoding and legacy format compatibility.

### SQL/type system expansion
- [PR #16823](https://github.com/facebookincubator/velox/pull/16823)
- [PR #16235](https://github.com/facebookincubator/velox/pull/16235)
- [PR #16940](https://github.com/facebookincubator/velox/pull/16940)
- **Signal:** active investment in SQL compatibility and expression/type infrastructure:
  - coercion rules for `TIMESTAMP WITH TIME ZONE`,
  - Base32 encoding functions,
  - new `FilterKind` for external bloom filter pushdown.
- **Likely next-version impact:** stronger Presto/engine compatibility, richer built-in function surface, and better pushdown interoperability with projects like Gluten.

### Storage and table-format benchmarking
- [PR #16506](https://github.com/facebookincubator/velox/pull/16506)
- **Signal:** Iceberg writer benchmarking suggests growing attention to write-path performance, not just reads/execution.
- **Likely next-version impact:** either direct write-path optimizations or benchmark-driven tuning for Iceberg output.

## 6. User Feedback Summary

From the issue and PR stream, current user pain points are fairly clear:

### 1) GPU users want fewer fallback boundaries
Users running **Presto TPC-DS with cuDF enabled** are frustrated by execution dropping back to CPU when an operator is missing. The request is less about novelty and more about **preserving GPU pipeline continuity** for real benchmark and production-like workloads.
- Relevant items:
  - [Issue #15772](https://github.com/facebookincubator/velox/issues/15772)
  - [PR #16920](https://github.com/facebookincubator/velox/pull/16920)

### 2) Integrators want cleaner cuDF internals and configuration
There is pain around duplicated GPU operator structure and config handling. This suggests contributor friction as much as end-user friction: maintainers and adopters need cuDF behavior to be easier to extend and parameterize across sessions.
- Relevant items:
  - [Issue #16885](https://github.com/facebookincubator/velox/issues/16885)
  - [PR #16535](https://github.com/facebookincubator/velox/pull/16535)

### 3) Data platform users need Parquet compatibility with surrounding ecosystems
The decimal write-format PR shows practical interoperability pressure from **Spark, Flink, and Hive Parquet semantics**. This is a classic lakehouse compatibility need: Velox users expect files written by one engine to be readable and semantically consistent in another.
- Relevant item:
  - [PR #16941](https://github.com/facebookincubator/velox/pull/16941)

### 4) Contributors want faster and more intelligible CI/build feedback
Several active PRs point to workflow pain in a large C++ repository: target ownership, dependency tracking, and separating build failures from test failures.
- Relevant items:
  - [PR #16827](https://github.com/facebookincubator/velox/pull/16827)
  - [PR #16897](https://github.com/facebookincubator/velox/pull/16897)
  - [PR #16938](https://github.com/facebookincubator/velox/pull/16938)

Overall, user feedback today reflects **maturing adoption**: fewer “please add basic capability” requests, more requests around **compatibility, maintainability, and operational performance**.

## 7. Backlog Watch

These items appear important and deserving of maintainer attention due to age, ecosystem impact, or architectural significance:

### A) FBThrift support in Parquet / thrift dependency removal
- [Issue #13175](https://github.com/facebookincubator/velox/issues/13175)
- **Why watch:** opened in 2025 and still active. This affects a core storage format and may influence future deployment architecture.

### B) Iceberg write benchmark
- [PR #16506](https://github.com/facebookincubator/velox/pull/16506)
- **Why watch:** open since 2026-02-24. Benchmarks often inform optimization priorities; delayed review could slow write-path tuning.

### C) Base32 support and shared encoder utilities
- [PR #16235](https://github.com/facebookincubator/velox/pull/16235)
- [PR #16176](https://github.com/facebookincubator/velox/pull/16176)
- **Why watch:** both have been open since January/February. They appear useful and self-contained, but prolonged open status may indicate review bandwidth issues or unresolved API/design concerns.

### D) Output buffer changes
- [PR #16530](https://github.com/facebookincubator/velox/pull/16530)
- **Why watch:** output buffering is execution-critical. Any lingering PR in this area deserves timely review due to possible engine-wide effects.

### E) cuDF config separation
- [PR #16535](https://github.com/facebookincubator/velox/pull/16535)
- **Why watch:** this aligns with the broader GPU roadmap and session-scoped configurability. It looks strategically important for cleaner multi-session GPU execution behavior.

## 8. Overall Health Assessment

Velox appears **healthy and actively maintained**. There is no evidence in today’s data of widespread regressions or emergency stabilization work; instead, the activity profile suggests a project refining its internals while continuing to expand **GPU support**, **Parquet and SQL compatibility**, and **developer tooling**. The biggest near-term product signals are:
1. more complete **cuDF/Presto execution coverage**,
2. stronger **Parquet interoperability**,
3. incremental improvements in **type coercion and SQL surface area**,
4. better **build/CI intelligence** for contributors.

If this trend continues, the next visible milestone is likely to emphasize **compatibility and execution completeness** more than flashy new subsystems.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-28

## 1. Today's Overview

Apache Gluten remained actively developed over the last 24 hours, with **22 pull requests updated** and **4 issues updated**, indicating steady engineering throughput even though no release was cut today. Activity is concentrated around the **Velox backend**, especially Spark 4.x compatibility, timestamp semantics, GPU runtime/loading behavior, and incremental SQL-function parity. The project looks healthy from a contribution-flow perspective: several new PRs were opened, and **4 PRs were closed/merged**, suggesting maintainers are still moving work forward despite a growing open queue. Overall, today’s signal is that Gluten is in a **stabilization-and-capability-expansion phase**, with a strong emphasis on compatibility and operational robustness.

## 3. Project Progress

### Merged/closed PRs today

#### 1) cuDF build environment modernization
- **PR #11836** — **[CLOSED] [MINOR][VL] Add cudf build docker file with JDK 17 and cuda 12.9**  
  Link: https://github.com/apache/incubator-gluten/pull/11836

This change improves build and packaging infrastructure for GPU-related Velox/cuDF workflows by adding a Docker image targeting **CentOS 9 + JDK 17 + CUDA 12.9**. While this is infra rather than user-visible SQL functionality, it is important groundwork for reproducible GPU-enabled builds and future acceleration work.

#### 2) Spark map function compatibility work closed out
- **PR #8731** — **[CLOSED] [VL] Support Spark map_from_entries function**  
  Link: https://github.com/apache/incubator-gluten/pull/8731

This closed item points to continued progress on **Spark SQL function coverage** in the Velox backend. `map_from_entries` support is an important compatibility feature for semi-structured and ETL-heavy workloads that construct maps from key-value arrays/rows.

#### 3) Spark 4.0/4.1 unit-test fixes closed
- **PR #11521** — **[CLOSED] [GLUTEN-11088][VL] Fix some UT for Spark40 and Spark41**  
  Link: https://github.com/apache/incubator-gluten/pull/11521

This closure reflects ongoing hardening for **Spark 4.x support**, which remains one of the project’s key strategic threads. Even if the PR itself is stale-tagged, its closure signals maintenance focus on keeping Gluten viable across newer Spark lines.

### Notable open progress likely to matter soon

#### Spark 4.x test re-enablement
- **PR #11833** — **Enable GlutenLogicalPlanTagInSparkPlanSuite (150/150 tests)**  
  Link: https://github.com/apache/incubator-gluten/pull/11833

This is a significant correctness/stability signal. The PR identifies a root cause in **plan tag propagation** when Gluten replaces Spark physical plan nodes with Transformer nodes. If merged, it would reduce regression risk for Spark 4.0/4.1 and improve confidence in plan metadata correctness.

#### TIMESTAMP_NTZ support
- **PR #11626** — **Add basic TIMESTAMP_NTZ type support**  
  Link: https://github.com/apache/incubator-gluten/pull/11626

This is one of the clearest roadmap items today. It advances type-system compatibility between Spark semantics and Velox execution, especially for workloads sensitive to timezone interpretation.

#### SQL semantic parity for array aggregation
- **PR #11837** — **Support RESPECT NULLS for collect_list/collect_set**  
  Link: https://github.com/apache/incubator-gluten/pull/11837

This improves behavioral compatibility with Spark SQL, specifically around **null-handling semantics** for aggregate functions.

#### Runtime and GPU deployment behavior
- **PR #11830** — **Use immutable gpu config and add cuda runtime detection**  
  Link: https://github.com/apache/incubator-gluten/pull/11830

This directly aligns with today’s new GPU-library loading issue and suggests active work toward safer mixed CPU/GPU deployments.

---

## 4. Community Hot Topics

### 1) Tracking unmerged Velox work
- **Issue #11585** — **[VL] useful Velox PRs not merged into upstream**  
  Link: https://github.com/apache/incubator-gluten/issues/11585  
  Activity: **16 comments, 4 👍**

This is the most socially active issue in the current snapshot. It reflects a structural challenge in Gluten’s architecture: Gluten depends heavily on **Velox upstream velocity**, and community members are tracking useful Velox PRs that are not yet merged. The underlying need is clear: contributors want a predictable process for consuming backend improvements without paying excessive rebasing or vendoring costs. This is a classic integration-friction signal for projects built atop fast-moving execution engines.

### 2) TIMESTAMP_NTZ semantics and implementation
- **Issue #11622** — **[VL] Support TIMESTAMP_NTZ Type**  
  Link: https://github.com/apache/incubator-gluten/issues/11622  
  Activity: **6 comments, 2 👍**
- Related PR: **#11626**  
  Link: https://github.com/apache/incubator-gluten/pull/11626

This is one of the most important compatibility discussions underway. The issue explicitly recognizes that **Spark and Presto expose similarly named timestamp types with different semantics**, which is a deep engine-integration concern rather than a superficial type-addition task. The technical need is robust type-level semantic separation to avoid silent query correctness problems.

### 3) Spark 4.x disabled-suite tracker
- **Issue #11550** — **Spark 4.x: Tracking disabled test suites**  
  Link: https://github.com/apache/incubator-gluten/issues/11550  
  Activity: **6 comments**
- Related PR: **#11833**  
  Link: https://github.com/apache/incubator-gluten/pull/11833

This issue is a strong signal that Spark 4.x support is still under active stabilization. The need here is not just “passing tests,” but restoring confidence that Gluten’s rule rewrites and backend substitutions preserve Spark planner behavior under new Spark internals.

### 4) Build hygiene and C++ maintainability
- **PR #11287** — **Use IWYU tool to check code format**  
  Link: https://github.com/apache/incubator-gluten/pull/11287

Although comment count is unavailable, this long-running PR highlights maintainability concerns in the native/C++ portion of the stack. “Include What You Use” adoption usually appears when a codebase reaches a scale where compile hygiene and dependency clarity materially affect contributor productivity.

---

## 5. Bugs & Stability

Ranked by likely user impact/severity based on the available descriptions.

### High severity

#### 1) GPU libraries loaded on CPU nodes
- **Issue #11844** — **[VL] Not load GPU libraries on CPU node**  
  Link: https://github.com/apache/incubator-gluten/issues/11844

**Problem:** CPU-only environments may throw runtime exceptions because `libvelox.so` links against cuDF/CUDA-related libraries, causing unconditional GPU library loading.  
**Impact:** This can break deployment in mixed clusters or CPU-only nodes, making the system fail before query execution.  
**Likely related fix work:**  
- **PR #11830** — immutable GPU config + CUDA runtime detection  
  https://github.com/apache/incubator-gluten/pull/11830  
- **PR #11836** — cuDF Docker/build setup  
  https://github.com/apache/incubator-gluten/pull/11836

This is the clearest operational regression/pain point reported today.

### Medium severity

#### 2) Spark 4.x disabled test suites / hidden compatibility regressions
- **Issue #11550** — **Spark 4.x: Tracking disabled test suites**  
  Link: https://github.com/apache/incubator-gluten/issues/11550  
- **PR #11833** — re-enable one disabled suite  
  https://github.com/apache/incubator-gluten/pull/11833

**Problem:** Disabled suites imply unresolved failures or aborted runs on Spark 4.0/4.1.  
**Impact:** Potential planner correctness, integration incompatibility, or incomplete feature support in production paths.  
**Status:** Active remediation is underway.

#### 3) Native union result correctness bug
- **PR #11832** — **Fix native union use column type name as column name lead to result error**  
  Link: https://github.com/apache/incubator-gluten/pull/11832

**Problem:** Result errors caused by confusing column type names with column names in native union logic.  
**Impact:** Query correctness issue, likely affecting result schemas and possibly downstream consumers.  
**Status:** Fix is open, which is good, but until merged this remains a correctness risk.

### Medium-to-low severity

#### 4) Exception wrapping obscures original error types
- **PR #11841** — **Preserve exception type in ClosableIterator.translateException()**  
  Link: https://github.com/apache/incubator-gluten/pull/11841

**Problem:** Double-wrapping exceptions in `GlutenException` prevents callers from catching specific runtime exceptions.  
**Impact:** Makes troubleshooting and programmatic error handling harder; not necessarily data-corrupting, but harmful to operability.

#### 5) Potential contention/performance issue in broadcast-side cache
- **PR #11834** — **Remove the synchronized lock in VeloxBroadcastBuildSideCache**  
  Link: https://github.com/apache/incubator-gluten/pull/11834

**Problem:** Synchronized locking may be causing avoidable contention.  
**Impact:** More performance/scalability than correctness, but relevant for concurrent query execution.

#### 6) Partition parsing overhead
- **PR #11843** — **Move DateFormatter and TimestampFormatter creation out of partition value loops**  
  Link: https://github.com/apache/incubator-gluten/pull/11843

**Problem:** Repeated formatter instantiation in inner loops.  
**Impact:** Likely a micro-optimization, but meaningful on file-heavy scans.

---

## 6. Feature Requests & Roadmap Signals

### Strong roadmap candidates

#### TIMESTAMP_NTZ support
- **Issue #11622**  
  https://github.com/apache/incubator-gluten/issues/11622  
- **PR #11626**  
  https://github.com/apache/incubator-gluten/pull/11626

This is the strongest feature signal in today’s set. Because it touches Spark SQL type compatibility and has both issue discussion and implementation PR, it is a strong candidate for inclusion in the next meaningful version.

#### Better null semantics for aggregations
- **PR #11837** — **RESPECT NULLS for collect_list/collect_set**  
  https://github.com/apache/incubator-gluten/pull/11837
- Related older test PR: **#11526**  
  https://github.com/apache/incubator-gluten/pull/11526

This suggests Gluten is continuing to close gaps in **Spark SQL semantic fidelity**, especially for edge-case aggregate behavior.

#### Parquet writer compatibility option
- **PR #11839** — **Support config velox parquet writer option `storeDecimalAsInteger`**  
  Link: https://github.com/apache/incubator-gluten/pull/11839

This is a useful compatibility knob for users who need behavior aligned with Spark’s `spark.sql.parquet.writeLegacyFormat`. It is a practical feature for interoperability with existing parquet readers/writers and legacy datasets.

#### Build/runtime observability
- **PR #11838** — **Expose Gluten build information in Spark configuration**  
  Link: https://github.com/apache/incubator-gluten/pull/11838

This is not a query feature, but it is a strong platform-operability enhancement. It will likely be appreciated by operators debugging production jobs.

### Secondary roadmap signals

#### map_from_entries and broader function parity
- **PR #8731**  
  https://github.com/apache/incubator-gluten/pull/8731

Even though closed, it reinforces the pattern that **Spark built-in function coverage** remains an ongoing roadmap theme.

#### GPU runtime modularization
- **Issue #11844**  
  https://github.com/apache/incubator-gluten/issues/11844  
- **PR #11830**  
  https://github.com/apache/incubator-gluten/pull/11830

The project may move toward cleaner separation of CPU and GPU-linked components, which would improve deployment flexibility.

---

## 7. User Feedback Summary

Today’s user-facing feedback clusters around a few practical pain points:

1. **Mixed CPU/GPU deployment is fragile**  
   The new GPU-library loading issue shows that users want Gluten to behave safely in environments where not every node has CUDA installed. This is an operational readiness concern, not just a build concern.  
   - Issue: https://github.com/apache/incubator-gluten/issues/11844

2. **Spark 4.x compatibility is still incomplete enough to require tracking disabled suites**  
   Users and contributors are clearly concerned with moving to newer Spark versions without losing correctness or test coverage.  
   - Issue: https://github.com/apache/incubator-gluten/issues/11550  
   - PR: https://github.com/apache/incubator-gluten/pull/11833

3. **Timestamp semantics matter to real workloads**  
   The TIMESTAMP_NTZ discussion suggests users are running workloads where timezone semantics can affect correctness, data exchange, or engine portability.  
   - Issue: https://github.com/apache/incubator-gluten/issues/11622  
   - PR: https://github.com/apache/incubator-gluten/pull/11626

4. **Users want better diagnostic transparency**  
   The build-info-in-Spark-config PR and the exception-type preservation PR both point to a desire for easier debugging in production.  
   - PR #11838: https://github.com/apache/incubator-gluten/pull/11838  
   - PR #11841: https://github.com/apache/incubator-gluten/pull/11841

Overall, today’s feedback is less about raw benchmark performance and more about **compatibility, deployability, and debuggability**.

---

## 8. Backlog Watch

These items look important and likely need sustained maintainer attention.

### 1) Upstream Velox dependency drag
- **Issue #11585** — useful Velox PRs not merged into upstream  
  https://github.com/apache/incubator-gluten/issues/11585

This is strategically important. If too much functionality depends on unmerged Velox work, Gluten risks carrying integration debt and delayed feature delivery.

### 2) Long-running TIMESTAMP_NTZ implementation
- **Issue #11622**  
  https://github.com/apache/incubator-gluten/issues/11622  
- **PR #11626**  
  https://github.com/apache/incubator-gluten/pull/11626

This should likely remain high priority because timestamp semantics affect correctness and interoperability.

### 3) Spark 4.x stabilization tracker
- **Issue #11550**  
  https://github.com/apache/incubator-gluten/issues/11550

Given the ecosystem’s likely migration toward Spark 4.x, unresolved disabled suites are a medium-term adoption blocker.

### 4) Stale but relevant test/functionality work
- **PR #11526** — comprehensive `collect_list` tests  
  https://github.com/apache/incubator-gluten/pull/11526
- **PR #11395** — unsupported operator count inflation report  
  https://github.com/apache/incubator-gluten/pull/11395

These are tagged stale, but both matter: one for SQL-function confidence, the other for tooling accuracy and migration assessment.

### 5) Long-lived infra/build hygiene work
- **PR #11287** — IWYU tool integration  
  https://github.com/apache/incubator-gluten/pull/11287

This may not be urgent for end users, but long-running native-build hygiene work can quietly affect contributor experience, CI stability, and compile times.

---

## Overall Health Assessment

Apache Gluten appears **active and technically focused**, with strongest momentum in **Velox integration, Spark 4.x stabilization, and semantic compatibility with Spark SQL**. The main near-term risks are **deployment fragility in GPU-linked builds**, **remaining Spark 4.x test gaps**, and **query correctness edge cases** such as timestamp semantics and native union handling. The most likely near-future user-visible improvements are **TIMESTAMP_NTZ support**, **aggregation null-semantics fixes**, **better Parquet compatibility**, and **improved runtime diagnostics**.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-28

## 1. Today's Overview

Apache Arrow had another active day with **36 issues updated** and **18 pull requests updated**, indicating healthy cross-component development rather than a release-focused cycle. The dominant themes were **PyArrow ergonomics**, **Parquet feature maturation**, **Flight SQL/ODBC platform enablement**, and **CI/package stability**. Activity was especially strong in Python and C++ areas, with several long-running feature threads moving forward and a handful of infrastructure regressions getting rapid attention. Overall project health looks solid: no new release was cut, but maintainers and contributors are clearly pushing on usability, interoperability, and packaging readiness.

## 3. Project Progress

### Merged/closed PRs today

#### Python compute ergonomics advanced
- [PR #48085](https://github.com/apache/arrow/pull/48085) — **[Python] Support arithmetic on arrays and scalars**
  - Closed after delivering Python-native arithmetic operators for Arrow arrays/scalars.
  - This is a meaningful usability improvement for analytical code, reducing reliance on `pyarrow.compute` wrappers for simple expressions.
  - Follow-up discussion is already happening around equality semantics and boolean operator behavior, suggesting this will become a broader Python expression-system refinement.

#### Parquet encrypted metadata support improved
- [PR #49334](https://github.com/apache/arrow/pull/49334) — **[C++][Parquet] Support reading encrypted bloom filters**
  - Closed work that enables reading bloom filters from encrypted Parquet files.
  - This strengthens Parquet compatibility for privacy-sensitive analytical storage deployments using encryption plus bloom-filter-assisted pruning.
- [PR #49527](https://github.com/apache/arrow/pull/49527) — **[C++][Parquet] Add BufferedStats API to RowGroupWriter**
  - Closed with a new API exposing buffered bytes for values/levels in `RowGroupWriter`.
  - While not a full row-group-size limit feature, it is a practical storage optimization primitive that helps writers decide when to cut a new row group based on buffered volume.

#### R usability and SQL/dplyr compatibility improved
- [PR #49535](https://github.com/apache/arrow/pull/49535) — **[R] Implement dplyr's when_any() and when_all() helpers**
  - Closed support for more dplyr helper semantics, improving SQL-like expression compatibility in Arrow-backed R workflows.
- [PR #49338](https://github.com/apache/arrow/pull/49338) — **[R] Improve error message for null type inference with sparse CSV data**
  - Closed a user-facing diagnostics fix that should reduce confusion when schema inference fails on sparsely populated CSV columns.

### Net effect
Today’s completed work mostly strengthened:
- **Python analytical API ergonomics**
- **Parquet encrypted-feature coverage and writer observability**
- **R translation compatibility and error clarity**

These are incremental but meaningful improvements for Arrow as an analytical storage and execution substrate.

## 4. Community Hot Topics

### 1) Python equality semantics after arithmetic support
- [Issue #48409](https://github.com/apache/arrow/issues/48409) — **[Python] Change the behaviour of `__eq__`**
- Related: [PR #48085](https://github.com/apache/arrow/pull/48085)

This appears to be the most important Python design discussion right now. With arithmetic operators now supported, contributors are reassessing whether `__eq__` should remain Pythonic object comparison or dispatch into Arrow compute kernels like `pyarrow.compute.equal`. The underlying need is clear: users want Arrow values to behave more like array libraries, but maintainers must avoid surprising semantics around scalar truthiness, broadcasting, and interaction with Python containers.

### 2) DLPack and tensor/array interoperability
- [Issue #38868](https://github.com/apache/arrow/issues/38868) — **[C++][Python] DLPack on FixedShapeTensorArray/FixedShapeTensorScalar**
- [Issue #39295](https://github.com/apache/arrow/issues/39295) — **[C++][Python] DLPack implementation for Arrow Arrays (consuming)**

These discussions signal growing demand for Arrow to participate more directly in the zero-copy tensor ecosystem. The technical need is interoperability with ML/dataframe/tensor runtimes, especially for fixed-shape tensors and inbound DLPack consumption. This is a strategic roadmap area because it extends Arrow beyond tabular analytics into shared-memory data exchange across compute frameworks.

### 3) Table/schema casting flexibility in PyArrow
- [Issue #27425](https://github.com/apache/arrow/issues/27425) — **[Python] Make `Table.cast(schema)` more flexible**
  
This long-lived request remains active because it reflects a common ETL/data engineering pain point: real datasets often have schema field order drift or missing columns. Users want Arrow casting to better support practical schema evolution rather than only exact-name/exact-order transformations.

### 4) Flight SQL ODBC expansion
- [PR #46099](https://github.com/apache/arrow/pull/46099) — **[C++] Arrow Flight SQL ODBC layer**
- [PR #49564](https://github.com/apache/arrow/pull/49564) — **[C++][FlightRPC] Add Ubuntu ODBC Support**
- [PR #49603](https://github.com/apache/arrow/pull/49603) — **[C++][FlightRPC] Windows CI to Support ODBC DLL & MSI Signing**
- [PR #49585](https://github.com/apache/arrow/pull/49585) — **Draft static build of ODBC FlightSQL driver**

This is one of the clearest roadmap signals in the repo. Arrow is steadily turning Flight SQL into a more deployable connector stack with Windows packaging, Linux support, signing flows, and static builds. The underlying technical need is enterprise BI/ODBC connectivity for Arrow-native services.

### 5) Parquet Bloom filter support from both read and write paths
- [PR #49377](https://github.com/apache/arrow/pull/49377) — **[Python][Parquet] Add ability to write Bloom filters from pyarrow**
- [PR #49334](https://github.com/apache/arrow/pull/49334) — **[C++][Parquet] Support reading encrypted bloom filters**
- [Issue #48334](https://github.com/apache/arrow/issues/48334) — closed by the above work

Arrow is filling in Bloom filter support across Parquet read/write paths. This matters for analytical storage engines because Bloom filters can improve predicate pruning efficiency, especially for selective queries.

## 5. Bugs & Stability

### Highest severity

#### 1) Packaging/CI breakage on Ubuntu due to aws-lc/C23 incompatibility
- [Issue #49601](https://github.com/apache/arrow/issues/49601) — **[CI][Packaging] ubuntu-resolute Linux fail building aws-lc**
- Fix in flight: [PR #49604](https://github.com/apache/arrow/pull/49604) — **[C++] Update bundled AWS SDK C++ for C23**

Severity: **High**  
Why it matters: this affects Linux packaging/buildability and can block dependency refreshes or downstream package production. The good sign is that a remediation PR appeared quickly, suggesting strong maintainer responsiveness.

#### 2) Windows R release CI failing due to missing S3 bucket
- [Issue #49609](https://github.com/apache/arrow/issues/49609) — **[CI][R] AMD64 Windows R release fails with IOError: Bucket 'ursa-labs-r-test' not found**
- Fix in flight: [PR #49610](https://github.com/apache/arrow/pull/49610)

Severity: **Medium-High**  
This is a release/CI blocker for R workflows on Windows, though not a core engine correctness issue. Rapid follow-up suggests low risk of prolonged disruption.

#### 3) MinGW intermittent segfault in JSON test
- [PR #49462](https://github.com/apache/arrow/pull/49462) — **[C++][CI] Fix intermittent segfault in arrow-json-test with MinGW**
- Related issue: [#49272](https://github.com/apache/arrow/issues/49272)

Severity: **Medium-High**  
Intermittent segfaults in CI are serious because they can hide real regressions and erode confidence in the test signal. This appears to be under active review rather than newly reported today.

### Medium severity

#### 4) R metadata warning regression
- [Issue #48712](https://github.com/apache/arrow/issues/48712) — **[R] "Invalid metadata$r" warning**
- Fix in flight: [PR #49608](https://github.com/apache/arrow/pull/49608)

Severity: **Medium**  
This is a user-visible warning regression affecting schema-to-table-to-data.frame conversion paths. Not catastrophic, but it degrades trust in metadata handling.

#### 5) Build/documentation mismatch with CMake 4.x
- [Issue #49605](https://github.com/apache/arrow/issues/49605) — **Inspecting cmake presets options not available in cmake 4.x**

Severity: **Medium**  
Likely a developer-experience/documentation issue rather than a code defect, but important because Arrow has a large native build surface and small build tooling mismatches can become contributor friction.

### Lower severity / correctness-adjacent

#### 6) Sparse CSV type inference messaging in R
- [Issue #35806](https://github.com/apache/arrow/issues/35806)
- Fixed by: [PR #49338](https://github.com/apache/arrow/pull/49338)

Severity: **Low-Medium**  
This was more about misleading diagnostics than incorrect results, but still useful for reducing support burden.

## 6. Feature Requests & Roadmap Signals

### Strong signals likely to land soon

#### PyArrow expression ergonomics follow-ups
- [Issue #49606](https://github.com/apache/arrow/issues/49606) — **Possible follow-up on arithmetic support**
- [Issue #48409](https://github.com/apache/arrow/issues/48409) — **Change `__eq__` behavior**

Given that arithmetic support just landed, follow-up work on boolean operators, comparison semantics, and edge cases is highly likely in an upcoming release.

#### Parquet Bloom filter write support in PyArrow
- [PR #49377](https://github.com/apache/arrow/pull/49377)

This PR is already in **awaiting merge**, making it one of the strongest candidates for the next release. It would improve Parquet writer feature parity and benefit query pruning use cases.

#### Flight SQL ODBC packaging and Linux support
- [PR #49564](https://github.com/apache/arrow/pull/49564)
- [PR #49603](https://github.com/apache/arrow/pull/49603)
- [PR #46099](https://github.com/apache/arrow/pull/46099)

These are substantial investments, so some subset is likely to appear soon—possibly first as packaging/CI scaffolding rather than a fully polished cross-platform driver experience.

#### R Azure Blob filesystem exposure
- [PR #49553](https://github.com/apache/arrow/pull/49553)

This is a strong ecosystem feature with practical user value. Since C++ already supports Azure and Python already exposes it, R exposure looks like a natural near-term parity improvement.

### Longer-horizon signals

#### DLPack support expansion
- [Issue #38868](https://github.com/apache/arrow/issues/38868)
- [Issue #39295](https://github.com/apache/arrow/issues/39295)

Important strategically, but still more roadmap than imminent release item.

#### More flexible schema evolution in Python
- [Issue #27425](https://github.com/apache/arrow/issues/27425)

High user value, but long-lived and still unresolved, so likely not immediate unless championed.

#### ExtensionType serialization cleanup
- [Issue #39094](https://github.com/apache/arrow/issues/39094)

Useful for maintainability and pickling behavior, though it appears less urgent than the arithmetic/interchange work.

## 7. User Feedback Summary

Several clear user pain points emerged from today’s activity:

- **Users want PyArrow objects to behave more like native analytical arrays**
  - Arithmetic support was important enough to complete after a long request cycle: [Issue #32007](https://github.com/apache/arrow/issues/32007), [PR #48085](https://github.com/apache/arrow/pull/48085).
  - Follow-up questions around equality and boolean operators show that expectations are converging toward NumPy/pandas-like ergonomics.

- **Schema evolution and ETL flexibility remain weak spots**
  - Requests like [Issue #27425](https://github.com/apache/arrow/issues/27425) show frustration with strict schema ordering and missing-field behavior in `Table.cast`.

- **Interoperability with external ecosystems is increasingly important**
  - DLPack requests ([#38868](https://github.com/apache/arrow/issues/38868), [#39295](https://github.com/apache/arrow/issues/39295)) and Azure filesystem support in R ([PR #49553](https://github.com/apache/arrow/pull/49553)) suggest users expect Arrow to be a neutral interchange layer across ML, cloud storage, and dataframe systems.

- **Packaging and CI issues are visible to users**
  - The R bucket failure ([Issue #49609](https://github.com/apache/arrow/issues/49609)) and Ubuntu aws-lc build issue ([Issue #49601](https://github.com/apache/arrow/issues/49601)) show how external infrastructure drift can quickly impact developer and release workflows.

- **Parquet feature completeness matters**
  - Bloom filter support on both encrypted read paths and Python write paths indicates demand from performance-conscious analytical users who care about file-level indexing/pruning behavior.

Overall sentiment from the issue set is not “Arrow is broken,” but rather “Arrow is broadly useful and users now want smoother ergonomics, richer connectors, and better parity across languages.”

## 8. Backlog Watch

These older items look important and still need maintainer attention:

### High-value long-running issues

- [Issue #27425](https://github.com/apache/arrow/issues/27425) — **[Python] Make `Table.cast(schema)` more flexible**
  - Open since 2021.
  - Important for practical schema evolution and ETL robustness.

- [Issue #20196](https://github.com/apache/arrow/issues/20196) — **[C++][Python] IPC failure for dictionary with extension type with struct storage type**
  - Open since 2022.
  - Potentially important for correctness and interoperability of extension types through IPC/Feather.

- [Issue #31641](https://github.com/apache/arrow/issues/31641) — **[C++] Add backpressure to hash-join node**
  - Open since 2022.
  - Architecturally important for execution-engine robustness under uneven producer/consumer rates.

- [Issue #31622](https://github.com/apache/arrow/issues/31622) — **[C++] Add hash-join support for large-offset and dictionary types**
  - Open since 2022.
  - Significant for broader type coverage in compute/join execution.

- [Issue #39094](https://github.com/apache/arrow/issues/39094) — **[Python] Clean up `ExtensionType.__reduce__`**
  - Open since 2023, marked needs champion.
  - Important maintainability item for Python extension type serialization.

- [Issue #34212](https://github.com/apache/arrow/issues/34212) — **[Python] Extract partition list from `ParquetFileFragment`**
  - Open since 2023.
  - Useful dataset API enhancement with clear downstream user value.

### Long-running PRs needing attention

- [PR #46099](https://github.com/apache/arrow/pull/46099) — **Flight SQL ODBC layer**
  - Large, strategic, open since 2025.
  - Likely needs sustained review bandwidth due to scope.

- [PR #48431](https://github.com/apache/arrow/pull/48431) — **Parquet flatbuffers metadata integration**
  - Open since 2025.
  - Potentially impactful for metadata representation, but appears to require deeper design review.

- [PR #48964](https://github.com/apache/arrow/pull/48964) — **Upgrade bundled Abseil/Protobuf/gRPC/Google-Cloud-CPP**
  - Open since January 2026.
  - High dependency-management value, but flagged as including public API breakage, which may slow merge.

---

## Bottom line

Arrow’s current trajectory is healthy and practical: **better Python ergonomics, broader Parquet capabilities, stronger Flight SQL connector packaging, and responsive fixes for CI/package drift**. The next version is most likely to pick up **PyArrow arithmetic follow-ups, Parquet Bloom filter writing, R cloud/storage parity improvements, and more Flight SQL ODBC groundwork**. The main risk area is not core engine instability, but rather **maintainer bandwidth for large cross-cutting PRs and older execution/interoperability backlog items**.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*