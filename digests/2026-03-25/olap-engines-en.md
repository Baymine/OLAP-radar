# Apache Doris Ecosystem Digest 2026-03-25

> Issues: 4 | PRs: 136 | Projects covered: 10 | Generated: 2026-03-25 01:21 UTC

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

# Apache Doris Project Digest — 2026-03-25

## 1. Today's Overview

Apache Doris had a very active day on GitHub: **136 pull requests were updated in the last 24 hours**, with **56 merged/closed** and **80 still open**, while **4 issues** saw activity and **no new release** was published. Overall activity is **high and engineering-heavy**, with most momentum concentrated in the query engine, FE architecture refactoring, cloud/MOW write path improvements, Iceberg integration, and execution stability fixes. The issue stream is relatively small compared with PR traffic, which suggests the current cycle is driven more by implementation and integration work than by a surge of newly reported defects. Project health appears solid, though several correctness and operational stability topics remain noteworthy.

---

## 2. Project Progress

Today’s merged/closed PR activity indicates progress in three main directions: **engine correctness**, **external ecosystem integration**, and **platform architecture cleanup**.

### Query engine and SQL execution
Recent PRs under active review or closure show ongoing work in planner/executor behavior and SQL semantics:

- **Support ORDER BY and LIMIT in UPDATE/DELETE** improves MySQL-compatible DML behavior and closes a practical SQL compatibility gap: [#61681](https://github.com/apache/doris/pull/61681)
- **Nereids optimization improvements** continue, including sharing `topnFilterDesc` objects across instances to reduce duplicated thrift object construction and planning overhead: [#61648](https://github.com/apache/doris/pull/61648)
- **Project pushdown rewrite improvements in Nereids** aim to expose slots earlier for better join/filter pushdown and nested-field pruning: [#61635](https://github.com/apache/doris/pull/61635)
- **Scanner global LIMIT enforcement** was improved to avoid overscanning under concurrency: [#61617](https://github.com/apache/doris/pull/61617)
- **Pipeline race-condition fixes** target early wakeup / missing terminate-path behavior, directly improving executor correctness under concurrent state transitions: [#61679](https://github.com/apache/doris/pull/61679)

### Storage and write-path optimizations
Several changes focus on BE reliability and cloud-write scalability:

- **Async publish for cloud MOW** is a significant scalability signal for cloud-native deployments facing high-frequency concurrent writes: [#61634](https://github.com/apache/doris/pull/61634)
- **FlushToken running-count symmetry fix** addresses a cancellation edge case that could drive counters negative and potentially break shutdown/cancel semantics: [#61684](https://github.com/apache/doris/pull/61684)
- **Delete push quorum stall avoidance** reduces the chance of delete operations getting stuck because of non-fatal replica push failures: [#61647](https://github.com/apache/doris/pull/61647)
- **File cache tablet_id propagation fix** improves correctness when packed-file mode is enabled, removing brittle path parsing logic: [#61683](https://github.com/apache/doris/pull/61683)
- **Multi-level spill repartition support** on branch 4.1 advances memory-pressure handling for partitioned operators: [#61677](https://github.com/apache/doris/pull/61677)

### External catalogs, Iceberg, and ecosystem integration
This is one of the clearest roadmap areas today:

- **CatalogProvider SPI framework** introduces plugin-style external catalog loading with classloader isolation; ES is the pilot migration: [#61604](https://github.com/apache/doris/pull/61604)
- **Deprecation of internal EsTable/JdbcTable/OdbcTable** in favor of external catalog architecture points to a strategic FE cleanup: [#61685](https://github.com/apache/doris/pull/61685)
- **Iceberg system-table refactor to native execution path** improves architectural consistency and likely future maintainability/performance: [#61646](https://github.com/apache/doris/pull/61646)
- **Iceberg update/delete/merge support** remains a substantial open feature effort: [#60482](https://github.com/apache/doris/pull/60482)
- **CDC stream TVF for MySQL and PostgreSQL** remains an important ingestion-facing feature under active development: [#60116](https://github.com/apache/doris/pull/60116)

### Authentication and platform features
One notable recently closed PR:

- **Authentication chain integration and fallback simplification** was closed/merged, indicating forward movement in FE authentication modernization: [#61362](https://github.com/apache/doris/pull/61362)

---

## 3. Community Hot Topics

Below are the most relevant active discussions based on the provided issue/PR set and technical significance.

### 1) REST Iceberg catalog needs custom HTTP headers
- Issue: **Support custom HTTP headers for REST Iceberg catalog via `header.*` properties**  
  Link: [#61388](https://github.com/apache/doris/issues/61388)

**Why it matters:**  
This is a strong signal that Doris users are integrating with enterprise or secured Iceberg REST catalogs that require custom auth headers, gateway routing headers, or vendor-specific metadata. This is less about convenience and more about **real-world interoperability** with modern lakehouse environments.

### 2) View query correctness regression with ORDER BY column pruning
- Issue: **View ORDER BY causes over-aggressive column pruning resulting in NULL/empty columns**  
  Link: [#61219](https://github.com/apache/doris/issues/61219)

**Why it matters:**  
This is a **query correctness** issue, not just a performance bug. Incorrect projection pruning in view expansion/planning can silently produce wrong results, which is one of the highest-severity classes of analytical database defects.

### 3) Docker single-node upgrade instability from 3.0.5 to 3.1.0
- Issue: **After upgrade, BE health check fails in single-node Docker deployment**  
  Link: [#56300](https://github.com/apache/doris/issues/56300)

**Why it matters:**  
This reflects operational friction in upgrade testing and local deployment workflows. Even if limited to a test/single-node Docker setup, upgrade regressions affect first impressions, CI validation, and user confidence.

### 4) FE transaction stuck in prepare during CDC stream load
- Issue: **Stream load aggregation of CDC data leaves FE transaction stuck in prepare**  
  Link: [#56438](https://github.com/apache/doris/issues/56438)

**Why it matters:**  
This speaks directly to a high-value use case: **CDC ingestion into Doris**. A transaction stuck in prepare can block pipelines, consume resources, and create uncertainty in exactly-once or near-real-time ETL scenarios.

### 5) Large architectural shift toward pluginized external catalogs
- PR: **Deprecate internal EsTable/JdbcTable/OdbcTable and migrate to External Catalog**  
  Link: [#61685](https://github.com/apache/doris/pull/61685)
- PR: **Add CatalogProvider SPI framework and migrate ES as pilot**  
  Link: [#61604](https://github.com/apache/doris/pull/61604)

**Why it matters:**  
This is a roadmap-level signal. Doris is clearly moving toward a more modular connector/catalog architecture, which should make external system integration easier to evolve independently.

---

## 4. Bugs & Stability

Ranked by likely severity based on impact to correctness, availability, and production operations.

### High severity

#### 1) Query correctness bug in views with ORDER BY
- Issue: [#61219](https://github.com/apache/doris/issues/61219)

**Impact:** Results may be wrong because non-ORDER-BY columns become empty after over-pruning.  
**Why severe:** Wrong answers are typically more dangerous than query failures in OLAP systems.  
**Fix status:** No direct fix PR is listed in today’s data.

#### 2) FE transaction stuck in prepare during stream load CDC aggregation
- Issue: [#56438](https://github.com/apache/doris/issues/56438)

**Impact:** Ingestion workflows may stall, especially CDC pipelines.  
**Why severe:** Blocks data freshness and may require operational intervention.  
**Fix status:** No explicit linked PR in today’s data.

### Medium severity

#### 3) Docker BE health-check failure after upgrade from 3.0.5 to 3.1.0
- Issue: [#56300](https://github.com/apache/doris/issues/56300)

**Impact:** Upgrade and test deployment instability.  
**Why medium:** May be environment-specific, but still important for adoption and regression confidence.  
**Fix status:** No matching fix PR visible in today’s list.

#### 4) Pipeline race condition causing termination path problems
- PR: [#61679](https://github.com/apache/doris/pull/61679)

**Impact:** Operators may fail to terminate reliably under concurrent state changes.  
**Why medium:** Concurrency bugs are difficult to reproduce and can surface as hangs or inconsistent execution behavior.  
**Fix status:** Fix PR open.

#### 5) FlushToken cancel edge case can corrupt running counter
- PR: [#61684](https://github.com/apache/doris/pull/61684)

**Impact:** Negative running counts could break cancellation and shutdown logic.  
**Why medium:** Internal executor/write-path stability issue.  
**Fix status:** Fix PR open.

#### 6) Min/max nullable aggregation bug on streaming aggregation path
- PR: [#61641](https://github.com/apache/doris/pull/61641)

**Impact:** Potential wrong aggregation behavior for nullable columns.  
**Why medium:** Another correctness bug, though branch-specific (`dev/4.1.x`) in the provided metadata.  
**Fix status:** Fix PR open.

### Lower but still notable

#### 7) File cache packed-file mode bug due to path-based tablet_id parsing
- PR: [#61683](https://github.com/apache/doris/pull/61683)

**Impact:** Incorrect behavior when packed file optimization is enabled.  
**Fix status:** Open.

#### 8) PyUDF concurrent import race
- PR: [#61280](https://github.com/apache/doris/pull/61280)

**Impact:** Runtime instability for concurrent Python UDF module loading.  
**Fix status:** Open.

---

## 5. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### Iceberg support continues to deepen
- Feature issue for REST catalog custom headers: [#61388](https://github.com/apache/doris/issues/61388)
- Iceberg merge/update/delete PR: [#60482](https://github.com/apache/doris/pull/60482)
- Iceberg system table native execution refactor: [#61646](https://github.com/apache/doris/pull/61646)

**Prediction:** Iceberg interoperability is likely to remain a top near-term priority and may land incrementally across the next minor releases.

#### External catalog/plugin architecture is becoming a core platform direction
- SPI framework: [#61604](https://github.com/apache/doris/pull/61604)
- Internal table deprecation/migration: [#61685](https://github.com/apache/doris/pull/61685)

**Prediction:** Future Doris versions will likely formalize connectors as plugins/providers rather than hardcoded internal catalog types.

#### SQL dialect compatibility is improving
- ORDER BY/LIMIT for UPDATE/DELETE: [#61681](https://github.com/apache/doris/pull/61681)

**Prediction:** Continued MySQL-compatibility work is likely, especially for DML edge cases and operational SQL expectations.

#### Streaming and CDC-native workflows are advancing
- CDC stream TVF for MySQL/PG: [#60116](https://github.com/apache/doris/pull/60116)
- Dynamic table / stream support part 1: [#61382](https://github.com/apache/doris/pull/61382)

**Prediction:** Doris appears to be investing in a more native streaming abstraction, likely aimed at real-time ingestion and dynamic computation scenarios.

---

## 6. User Feedback Summary

Today’s user-visible pain points cluster around four areas:

1. **Upgrade reliability**
   - Users still encounter friction when moving between versions in Dockerized single-node environments: [#56300](https://github.com/apache/doris/issues/56300)

2. **Query correctness trust**
   - The view `ORDER BY` pruning issue shows that users are sensitive not just to performance but to whether SQL returns complete, correct rows: [#61219](https://github.com/apache/doris/issues/61219)

3. **CDC/real-time ingestion stability**
   - FE transactions stuck in prepare highlight pressure from users running Doris in continuous ingestion or CDC consolidation pipelines: [#56438](https://github.com/apache/doris/issues/56438)

4. **Enterprise lakehouse interoperability**
   - The request for custom Iceberg REST headers reflects real integration demands in secured or gateway-mediated environments: [#61388](https://github.com/apache/doris/issues/61388)

Overall, user feedback suggests Doris is being used in increasingly **production-grade hybrid scenarios**: CDC ingestion, cloud-native writes, Iceberg catalogs, and externalized metadata integrations. The community expectation is shifting from core OLAP capability to **ecosystem-grade reliability and compatibility**.

---

## 7. Backlog Watch

These items appear to deserve maintainer attention due to age, impact, or strategic importance.

### Older or stale but important issues/PRs

#### FE transaction stuck in prepare for CDC stream load
- Issue: [#56438](https://github.com/apache/doris/issues/56438)  
Although marked stale, this concerns ingestion transaction lifecycle and should not be ignored if reproducible.

#### Expression/plan column consistency check PR
- PR: [#56383](https://github.com/apache/doris/pull/56383)  
Potentially valuable for preventing FE/expr mismatch issues, but it appears stale and lacks visible test completion.

#### Branch backport for MySQL error-handling optimization
- PR: [#56447](https://github.com/apache/doris/pull/56447)  
A stale cherry-pick PR may indicate branch maintenance debt.

#### Iceberg merge/update/delete functionality
- PR: [#60482](https://github.com/apache/doris/pull/60482)  
Strategically important and likely high-complexity; worth close maintainer follow-up given its significance for lakehouse parity.

#### CDC stream TVF
- PR: [#60116](https://github.com/apache/doris/pull/60116)  
Approved/reviewed status suggests maturity; if blocked, maintainers may want to accelerate it because it aligns well with current user demand.

---

## 8. Project Health Assessment

Apache Doris looks **healthy and highly active** on 2026-03-25. Development velocity is strong, especially in optimizer/executor internals, cloud storage/write paths, external catalog architecture, and Iceberg-related functionality. The main caution is that some of today’s most meaningful issue activity centers on **correctness and operational stability** rather than purely additive features. If the current wave of fixes lands cleanly, Doris appears well positioned for a strong next iteration focused on **cloud-native performance, connector modularity, and real-time/lakehouse interoperability**.

---

## Cross-Engine Comparison

# Cross-Engine Open-Source OLAP / Analytical Storage Comparison  
**Date:** 2026-03-25

## 1. Ecosystem Overview

The open-source analytical engine landscape remains highly active and increasingly convergent around a few core themes: **lakehouse interoperability, real-time ingestion, cloud-native execution, and SQL compatibility hardening**. Across engines, the strongest engineering signals are not just about raw performance anymore, but about **correctness, operational stability, metadata scalability, and connector maturity**. Apache Doris stands out as one of the most implementation-heavy projects today, while ClickHouse shows the largest overall throughput, DuckDB is in a stabilization-heavy cycle, and Iceberg/Delta remain central to the table-format/control-plane layer of the ecosystem. The broader market signal is clear: users now expect analytical systems to function as **production-grade hybrid data platforms**, not isolated OLAP databases.

---

## 2. Activity Comparison

### Activity snapshot

| Project | Issues Updated | PRs Updated | Release Status | Activity / Health Score* | Notes |
|---|---:|---:|---|---:|---|
| **Apache Doris** | 4 | 136 | No new release | **8.9/10** | Very high implementation velocity; strong work on query engine, cloud MOW, catalogs, Iceberg |
| **ClickHouse** | 58 | 433 | **New stable release** (`v25.12.9.61-stable`) | **8.8/10** | Highest throughput; strong velocity but notable 26.x upgrade regressions |
| **DuckDB** | 21 | 39 | No new release | **8.1/10** | Healthy activity, but strongly skewed toward post-1.5.x regression cleanup |
| **StarRocks** | 14 | 116 | No new release | **8.4/10** | High maintenance pace; connector and shared-data correctness dominate |
| **Apache Iceberg** | 9 | 50 | No new release | **8.2/10** | Healthy roadmap momentum in Spark, REST, metadata evolution |
| **Delta Lake** | 2 | 49 | No new release | **8.0/10** | Focused, stacked PR work on CDC, DSv2, auth, format evolution |
| **Databend** | 10 | 26 | No new release | **7.9/10** | Fast bug response; still in planner/parser hardening phase |
| **Velox** | 7 | 47 | No new release | **7.8/10** | Strong engine-core momentum, but correctness bugs remain material |
| **Apache Gluten** | 7 | 20 | No new release | **7.7/10** | Healthy backend-focused stabilization and Spark 4.x compatibility work |
| **Apache Arrow** | 28 | 24 | No new release | **8.0/10** | Mature infrastructure project; strong packaging, CI, compatibility work |

\*Health score is a qualitative synthesis of throughput, issue mix, release posture, and severity of active bugs.

### Quick interpretation
- **Most active overall:** ClickHouse
- **Most active among database engines with concentrated core-engine implementation work:** Apache Doris
- **Most stabilization-heavy:** DuckDB
- **Most connector/lakehouse-integration-heavy among MPP engines:** StarRocks and Doris
- **Most table-format/control-plane focused:** Iceberg and Delta Lake

---

## 3. Apache Doris's Position

### Where Doris is strong vs peers

**1. Balanced engine + lakehouse evolution**
- Doris is advancing both **core query execution** and **external ecosystem integration** at the same time.
- Compared with StarRocks, Doris shows a somewhat stronger signal in **FE architecture refactoring and pluginized catalog direction**.
- Compared with ClickHouse, Doris appears more visibly focused on **external catalog abstraction and Iceberg-native integration**, rather than primarily standalone engine evolution.

**2. Strong momentum in cloud-native write path**
- Doris’s work on **cloud MOW async publish**, delete push behavior, spill improvements, and file-cache correctness indicates serious investment in **cloud-native mutable analytics**.
- This differentiates it from DuckDB and Arrow, which are not competing in the same distributed cloud-serving category.

**3. Connector architecture modernization**
- The move toward **CatalogProvider SPI** and deprecation of internal `EsTable/JdbcTable/OdbcTable` is strategically important.
- This puts Doris closer to a modular federated architecture, which is important for enterprise integration and long-term maintainability.

### Technical approach differences vs peers

- **Vs ClickHouse:**  
  Doris is more visibly investing in **federation/catalog abstraction** and MySQL-style compatibility improvements, while ClickHouse remains stronger in sheer engine throughput, release cadence, and storage/query internals scale.

- **Vs StarRocks:**  
  Both are converging on lakehouse + shared-data scenarios, but Doris currently shows more explicit architectural movement in **catalog modularization**, while StarRocks is more visibly focused on **connector bug-fixing and warehouse/shared-data operational behavior**.

- **Vs DuckDB:**  
  Doris targets **distributed serving and real-time analytical infrastructure**; DuckDB targets **embedded/local analytics** with deep SQL and API ergonomics.

- **Vs Iceberg / Delta:**  
  Doris is an **execution engine/database** integrating with these ecosystems, not a table format itself. Its strategic value depends on how well it can become a **fast compute layer over open table metadata**.

### Community size comparison

- **Larger visible throughput:** ClickHouse clearly leads by a wide margin.
- **Comparable upper-mid activity tier:** Doris and StarRocks.
- **Smaller but highly focused ecosystems:** DuckDB, Databend, Delta, Iceberg.
- Doris’s **136 PR updates/day** is a strong signal that it belongs in the **top activity tier of operational OLAP engines**, even if its issue traffic is much smaller than ClickHouse’s.

---

## 4. Shared Technical Focus Areas

Across projects, several common requirements are emerging.

### A. Lakehouse / external catalog interoperability
**Engines:** Doris, StarRocks, Iceberg, Delta, ClickHouse, Arrow  
**Specific needs:**
- REST catalog auth and headers
- OAuth / credential refresh
- Iceberg/Paimon/Delta external metadata reliability
- cloud object storage error normalization
- better plugin/provider architectures

**Examples:**
- Doris: REST Iceberg custom headers, SPI catalog framework
- StarRocks: Paimon and Iceberg metadata correctness
- Iceberg: REST internals, cloud credential refresh
- Delta: server-side planning auth
- Arrow: Azure filesystem parity in R

### B. Query correctness over pure feature velocity
**Engines:** Doris, ClickHouse, DuckDB, Velox, Databend, StarRocks  
**Specific needs:**
- avoid wrong results from pruning, pushdown, optimizer rewrites
- timestamp/timezone correctness
- safer planner semantics on complex SQL
- robust nested-type handling

**Examples:**
- Doris: view `ORDER BY` pruning bug
- ClickHouse: `DateTime` semantics, `s3Cluster` inconsistent results
- DuckDB: wrong results in window optimizer
- Velox: Parquet pushdown wrong results
- Databend: panic/error handling in SQL edge cases
- StarRocks: timezone conversion inconsistency

### C. Upgrade safety and release stability
**Engines:** Doris, ClickHouse, DuckDB, Databend, Gluten  
**Specific needs:**
- predictable performance after upgrades
- fewer regressions in patch/minor releases
- stable Docker/single-node/dev workflows
- compatibility guardrails

**Examples:**
- Doris: Docker upgrade instability
- ClickHouse: 26.x insert slowdown and mutation/timestamp regressions
- DuckDB: v1.5.x regression cluster
- Databend: insert slowdown after nightly upgrade
- Gluten: Spark 4.x stabilization

### D. Real-time ingestion / CDC / mutable analytics
**Engines:** Doris, Delta, ClickHouse, Databend  
**Specific needs:**
- robust CDC semantics
- transaction lifecycle reliability
- high-frequency write scalability
- exactly-once / replay-safe behavior

**Examples:**
- Doris: CDC stream TVF, FE transaction stuck in prepare, cloud MOW work
- Delta: large kernel-spark CDC stack
- ClickHouse: insert regression sensitivity in write-heavy workloads
- Databend: insert regression as major community concern

### E. Metadata scalability
**Engines:** Doris, StarRocks, Iceberg, Delta  
**Specific needs:**
- large partition counts
- lighter catalog loading
- more scalable manifests/metadata structures
- less eager FE/control-plane state

**Examples:**
- StarRocks: FE OOM on millions of Iceberg partitions
- Doris: pluginized catalog architecture suggests preparation for scale
- Iceberg: V4 metadata and manifest evolution
- Delta: DSv2/kernel table plumbing and metadata evolution

### F. Nested / semi-structured data support
**Engines:** DuckDB, Iceberg, Delta, Velox, Doris, Arrow  
**Specific needs:**
- variant/JSON/MAP/LIST correctness
- nested pruning and stats
- complex-type write paths
- robust APIs across engines

---

## 5. Differentiation Analysis

## Storage format orientation

- **Apache Doris / ClickHouse / StarRocks / Databend:**  
  Full analytical databases with native storage engines, but increasingly acting as **compute/query layers over external lakehouse formats** too.

- **DuckDB:**  
  Embedded analytical engine with its own storage plus strong **Parquet-first** and external-file analytics posture.

- **Iceberg / Delta Lake:**  
  Open table formats and metadata/control planes, not end-user SQL engines by themselves.

- **Arrow:**  
  Columnar memory and interoperability layer rather than a serving database.

- **Velox / Gluten:**  
  Execution substrates/backends, not standalone data platforms.

## Query engine design

- **Doris / StarRocks:**  
  Distributed MPP SQL engines, increasingly hybrid between warehouse and lake query layers.

- **ClickHouse:**  
  Highly optimized analytical DBMS with very strong native execution and storage integration.

- **DuckDB:**  
  In-process vectorized engine optimized for local/embedded analytics and developer workflows.

- **Velox / Gluten:**  
  Modular execution engine and Spark acceleration path, respectively.

## Target workloads

- **Doris:** real-time analytics, cloud-native mutable OLAP, federated lakehouse access
- **ClickHouse:** high-throughput analytics, event/log/time-series-heavy workloads
- **StarRocks:** interactive analytics plus shared-data and lakehouse query acceleration
- **DuckDB:** local analytics, notebooks, embedded apps, data science workflows
- **Iceberg / Delta:** open table management for lakehouse storage ecosystems
- **Databend:** cloud analytics, versioned data workflows, SQL-first warehouse use cases

## SQL compatibility posture

- **Doris:** actively improving MySQL-compatible behavior and DML semantics
- **ClickHouse:** broadening SQL ergonomics but still retains its own dialect personality
- **DuckDB:** high SQL breadth, now dealing with advanced binder/optimizer edge cases
- **Databend:** actively closing standards/dialect gaps
- **Gluten/Velox:** compatibility mediated largely through Spark/Presto semantics
- **Iceberg/Delta:** compatibility mostly through host engines, especially Spark

---

## 6. Community Momentum & Maturity

### Tier 1: Highest momentum, broad contributor throughput
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

These projects show heavy PR traffic and broad engineering surface area. ClickHouse is the largest by raw volume; Doris is particularly strong in architecture and integration work; StarRocks is highly active but currently more maintenance-heavy in connectors/shared-data.

### Tier 2: Strong momentum, more focused or specialized
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **Apache Arrow**

These projects are healthy and important, but with narrower role definitions. DuckDB is in a more visible stabilization cycle. Iceberg and Delta are advancing strategically important roadmap items. Arrow remains mature and infrastructure-centric.

### Tier 3: Rapidly evolving, still sharpening fundamentals
- **Databend**
- **Velox**
- **Apache Gluten**

These show strong engineering energy but also clear signs of ongoing hardening:
- Databend: planner/parser stabilization
- Velox: correctness + GPU expansion
- Gluten: backend compatibility and Spark 4.x readiness

### Rapidly iterating vs stabilizing

**Rapidly iterating**
- Doris
- ClickHouse
- Delta Lake
- Velox
- Databend

**Stabilizing / regression-absorption phase**
- DuckDB
- Gluten
- Arrow patch/release engineering work
- StarRocks in connectors/shared-data areas

---

## 7. Trend Signals

### 1. The market is converging on “hybrid analytical platforms”
Users want one platform to support:
- warehouse-style SQL,
- real-time ingestion/CDC,
- open table formats,
- external catalogs,
- cloud object storage.

This strongly benefits engines like **Doris** and **StarRocks**, and raises the strategic value of **Iceberg/Delta interoperability**.

### 2. Correctness is now a top-tier differentiator
Many active issues across Doris, DuckDB, ClickHouse, Velox, and StarRocks are **wrong-result** or semantic-consistency bugs. For architects, this means benchmark performance alone is no longer enough; **planner reliability, timezone semantics, nested-type correctness, and pushdown safety** matter materially.

### 3. Metadata and control-plane scalability are becoming critical
Large partition counts, REST catalogs, credential refresh, and cloud-native metadata flows are frequent pain points. This indicates lakehouse adoption is moving from moderate-scale experimentation to **large-scale production metadata stress**.

### 4. Upgrade risk is increasingly visible
ClickHouse 26.x regressions, DuckDB 1.5.x regressions, Doris upgrade friction, and Databend nightly insert slowdowns all point to a common requirement: **benchmark and validate upgrades carefully**. Release maturity and regression discipline remain practical selection criteria.

### 5. SQL compatibility remains strategically valuable
MySQL compatibility in Doris, SQL-standard concerns in ClickHouse and Databend, Spark semantic parity in Gluten/Velox, and advanced SQL correctness in DuckDB all show that users increasingly expect these systems to integrate into mixed-data estates with minimal dialect friction.

### Value for data engineers and architects

For decision-makers, the main takeaway is:
- Choose **Doris or StarRocks** when you need distributed OLAP plus growing lakehouse federation.
- Choose **ClickHouse** when you prioritize scale and raw project velocity, but validate upgrades aggressively.
- Choose **DuckDB** for embedded/local analytics and developer productivity.
- Treat **Iceberg and Delta** as strategic table-format layers that increasingly shape engine selection.
- Watch **metadata scalability, correctness behavior, and upgrade discipline** as closely as performance benchmarks.

---

## Bottom Line

Apache Doris is currently well positioned in the ecosystem: it combines **high engineering velocity**, **serious lakehouse integration work**, **cloud-native mutable OLAP investment**, and **ongoing SQL/planner modernization**. Its main opportunity is to convert this momentum into a reputation for **correctness, operational smoothness, and modular connector reliability**, especially as users compare it against ClickHouse’s scale, StarRocks’ lakehouse focus, and the gravitational pull of Iceberg/Delta-centered architectures. If you want, I can next turn this into a **Doris-specific competitor SWOT**, a **procurement-style shortlisting matrix**, or a **one-page executive summary**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-25

## 1) Today’s Overview

ClickHouse remains very active: **58 issues** and **433 PRs** saw updates in the last 24 hours, with **153 PRs merged/closed** and **1 new stable release** published. The signal from today’s activity is mixed but healthy: there is strong forward motion on query engine features, SQL usability, DataLake/catalog work, and testing infrastructure, while users continue to report a few important regressions in the **26.2/26.3** line. The most notable user-facing concern is a **3x INSERT slowdown after upgrading from 25.12 to 26.2**, alongside several correctness and time/date behavior reports. Overall, project velocity is high, with maintainers clearly investing both in product capabilities and in CI/fuzzing coverage to catch edge cases earlier.

---

## 2) Releases

### New release: `v25.12.9.61-stable`
- Release: **[v25.12.9.61-stable](https://github.com/ClickHouse/ClickHouse/releases/tag/v25.12.9.61-stable)**

### What it means
This is a **stable patch release** in the 25.12 line, which likely serves as the conservative upgrade target for users hesitant about newer regressions being reported in 26.x. Based on today’s issue flow, that matters: multiple newly active problems are explicitly tagged against **26.2** or **26.3**, especially around insert performance, mutation consistency, and timestamp handling.

### Breaking changes / migration notes
No explicit breaking changes are listed in the provided release data. Still, from the issue stream, the practical migration guidance is:

- **Conservative users should prefer 25.12.9.61-stable** over 26.2/26.3 for production if they are sensitive to:
  - INSERT throughput regressions ([#99241](https://github.com/ClickHouse/ClickHouse/issues/99241))
  - mutation checksum problems on replicated tables ([#100493](https://github.com/ClickHouse/ClickHouse/issues/100493))
  - `session_timezone`-related `DateTime` behavior changes between patch versions ([#100614](https://github.com/ClickHouse/ClickHouse/issues/100614))

### Upgrade note
If you are already on 26.x, validate:
- ingest throughput,
- replicated mutation behavior,
- timezone/cast semantics,
before broad rollout.

---

## 3) Project Progress

Today’s merged/closed PRs show meaningful progress in **SQL features, SQL compatibility, storage reliability, and operational ergonomics**.

### SQL/query language improvements
- **Dynamic format strings in `printf`** were completed in:
  - [PR #98991](https://github.com/ClickHouse/ClickHouse/pull/98991)  
  This expands expression flexibility and improves row-wise formatting use cases.

- **`obfuscateQuery` SQL function** was added in:
  - [PR #98305](https://github.com/ClickHouse/ClickHouse/pull/98305)  
  This is a practical observability/privacy feature for sharing queries safely; it closes the related feature request:
  - [Issue #98010](https://github.com/ClickHouse/ClickHouse/issues/98010)

- **Arrow interval type support** appears to have moved forward with closure of:
  - [Issue #97849](https://github.com/ClickHouse/ClickHouse/issues/97849)  
  This is a useful interoperability win for Arrow-based analytical tooling.

### SQL compatibility and function behavior
- A longstanding quoting problem in the **`executable` table function** was fixed:
  - [PR #99794](https://github.com/ClickHouse/ClickHouse/pull/99794)
  - closes [Issue #66634](https://github.com/ClickHouse/ClickHouse/issues/66634)  
  This improves shell-style argument handling and should reduce friction for external script integrations.

- A client behavior issue around `EXECUTE AS` and `FORMAT` was closed:
  - [Issue #99572](https://github.com/ClickHouse/ClickHouse/issues/99572)  
  That points to steady work on SQL/session semantics and output consistency.

### Storage and reliability
- A meaningful storage correctness fix landed:
  - [PR #99386](https://github.com/ClickHouse/ClickHouse/pull/99386)  
  It prevents **filesystem cache disk I/O errors** from incorrectly marking **S3-backed MergeTree parts** as broken. This is important for mixed local-cache/object-storage deployments.

- Incorrect distributed/join results in `s3Cluster` were closed:
  - [Issue #88758](https://github.com/ClickHouse/ClickHouse/issues/88758)  
  This is significant because wrong-result bugs are among the most severe classes of analytics engine defects.

### CI and engineering productivity
- Test orchestration was fixed in:
  - [PR #100627](https://github.com/ClickHouse/ClickHouse/pull/100627)  
  This addresses flaky/targeted CI module-scope re-entry after `--dist=each` changes.

- Coverage infrastructure is being modernized:
  - [PR #99513](https://github.com/ClickHouse/ClickHouse/pull/99513)  
  moving toward LLVM source-based per-test coverage, which should improve defect localization and long-term test quality.

Taken together, today’s progress shows ClickHouse strengthening not only user-visible SQL features, but also the tooling and correctness scaffolding needed to sustain rapid development.

---

## 4) Community Hot Topics

These are the most active topics by comments and practical importance.

### 1. INSERTs 3x slower after upgrade to 26.2
- [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)  
- Labels: `performance`, `v26.2-affected`

This is today’s clearest user pain point. A **ReplacingMergeTree** ingest workload reportedly became **3x slower** moving from 25.12 to 26.2. The technical need behind this discussion is clear: users want predictable major/minor upgrade performance, especially for write-heavy analytical pipelines. This issue deserves high maintainer attention because ingest regressions are immediately visible in production SLAs.

### 2. Hard links support for `plain_rewritable` disk metadata
- [Issue #91611](https://github.com/ClickHouse/ClickHouse/issues/91611)

Although not new, it remains one of the most discussed active feature threads. The request reflects strong interest in **shared-storage MergeTree topologies** with one writer and many readers, minimizing synchronization complexity. This is a roadmap signal toward more flexible storage-layer deployment patterns.

### 3. TCP connection count limitations
- [Issue #91591](https://github.com/ClickHouse/ClickHouse/issues/91591)

This discussion points to scaling concerns at the network/session layer. Users operating large clusters or high-concurrency client fleets want clearer limits and potentially better connection management guidance or architecture.

### 4. CI crash: exception during pipeline execution
- [Issue #99295](https://github.com/ClickHouse/ClickHouse/issues/99295)

This is a typical but important “health of the development process” signal. High CI/fuzz/crash issue volume indicates aggressive automated testing, which is good for long-term quality, but recurring pipeline crashes can slow contributor throughput.

### 5. NPY parser infinite loop on negative shape dimension
- [Issue #99585](https://github.com/ClickHouse/ClickHouse/issues/99585)

This one is especially interesting because it blends **format parsing robustness** with denial-of-service risk. The underlying need is safer ingestion of semi-external binary formats with strict validation for malformed metadata.

### 6. CTE/view + analyzer compatibility
- [Issue #99308](https://github.com/ClickHouse/ClickHouse/issues/99308)

Closed now, but notable as a high-engagement issue. It shows real migration friction for users enabling the newer analyzer, especially in **DBT-like generated SQL workflows**. This reinforces that SQL compatibility remains a strategic area.

---

## 5) Bugs & Stability

Ranked by severity and operational impact.

### Critical / High

#### 1. INSERT performance regression in 26.2
- [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)
- Status: Open
- Severity: **High**

A reported **3x slowdown** on INSERTs after upgrading from 25.12 to 26.2. This is likely the highest-impact open issue from a production operations standpoint today.  
**Fix PR found in provided data:** none obvious.

#### 2. Replicated mutation checksum mismatch in 26.3
- [Issue #100493](https://github.com/ClickHouse/ClickHouse/issues/100493)
- Status: Open
- Severity: **High**

`CHECKSUM_DOESNT_MATCH` during mutation on `ReplicatedMergeTree` can leave replicas stuck in a fetch/retry loop. This is serious because it affects durability/confidence in replicated writes and background mutation convergence.  
**Fix PR found:** none obvious in provided data.

#### 3. Wrong `DateTime` behavior between 26.2.3 and 26.2.4 with `session_timezone`
- [Issue #100614](https://github.com/ClickHouse/ClickHouse/issues/100614)
- Status: Open
- Severity: **High**

Same `INSERT ... VALUES` text reportedly stores/displays different wall-clock values across patch versions. Timestamp semantics are extremely sensitive for analytics correctness.  
**Fix PR found:** none obvious.

### Medium

#### 4. `date_time_overflow_behavior='throw'` ignored for casts to `DateTime64` / `Time64`
- [Issue #100471](https://github.com/ClickHouse/ClickHouse/issues/100471)
- Status: Open
- Severity: **Medium-High**

This is a correctness and predictability issue in type conversion semantics. Silent clamping when users request strict failure can break data quality expectations.  
**Fix PR found:** none obvious.

#### 5. Lightweight updates: `_block_number` column not found
- [Issue #98227](https://github.com/ClickHouse/ClickHouse/issues/98227)
- Status: Open
- Severity: **Medium**

This looks like a query planner/execution mismatch affecting lightweight updates. It likely impacts newer mutation/update paths.

#### 6. NPY parser infinite loop on malformed input
- [Issue #99585](https://github.com/ClickHouse/ClickHouse/issues/99585)
- Status: Open
- Severity: **Medium**

Malformed `.npy` input can trigger an infinite loop. Operationally this is important for robustness and potentially abuse resistance.

### Lower but important quality signals

#### 7. CI crash during pipeline execution
- [Issue #99295](https://github.com/ClickHouse/ClickHouse/issues/99295)

#### 8. New fuzz/sanitizer findings
- [Issue #100442](https://github.com/ClickHouse/ClickHouse/issues/100442)
- [Issue #100628](https://github.com/ClickHouse/ClickHouse/issues/100628)
- [Issue #100129](https://github.com/ClickHouse/ClickHouse/issues/100129)

These are not immediately user-facing, but they are strong indicators that maintainers are still discovering planner/materialization and memory-safety edge cases.

### Stability fixes closed today
- **Executable quoting fix**
  - [PR #99794](https://github.com/ClickHouse/ClickHouse/pull/99794)
  - closes [Issue #66634](https://github.com/ClickHouse/ClickHouse/issues/66634)

- **Filesystem cache I/O should not mark S3-backed MergeTree parts as broken**
  - [PR #99386](https://github.com/ClickHouse/ClickHouse/pull/99386)

- **Analyzer/view CTE issue closed**
  - [Issue #99308](https://github.com/ClickHouse/ClickHouse/issues/99308)

- **`s3Cluster` inconsistent join results closed**
  - [Issue #88758](https://github.com/ClickHouse/ClickHouse/issues/88758)

---

## 6) Feature Requests & Roadmap Signals

Several open requests and PRs reveal where ClickHouse may be heading next.

### Data lake / catalog / external ecosystem
- **Azure Delta Kernel DataLake support**
  - [PR #86892](https://github.com/ClickHouse/ClickHouse/pull/86892)
- **`CHECK DATABASE` for Catalog**
  - [PR #94690](https://github.com/ClickHouse/ClickHouse/pull/94690)
- **Arrow Flight SQL support**
  - [PR #91170](https://github.com/ClickHouse/ClickHouse/pull/91170)

These are strong signals that ClickHouse is continuing to expand as a broader **query layer over lake/catalog ecosystems**, not just a standalone OLAP store.

### Query optimization and observability
- **Log skip index usage in query log**
  - [PR #99793](https://github.com/ClickHouse/ClickHouse/pull/99793)
- **Predicate statistics / selectivity collection**
  - [PR #98727](https://github.com/ClickHouse/ClickHouse/pull/98727)
- **Field-based minmax statistics**
  - [PR #100605](https://github.com/ClickHouse/ClickHouse/pull/100605)
- **Push ORDER BY through VIEWs for distributed optimization**
  - [PR #94102](https://github.com/ClickHouse/ClickHouse/pull/94102)
- **Position-based unused column removal**
  - [PR #100586](https://github.com/ClickHouse/ClickHouse/pull/100586)

These suggest near-term emphasis on a smarter optimizer and better execution introspection.

### SQL compatibility and protocol coverage
- **Support C# client via PostgreSQL protocol**
  - [PR #80785](https://github.com/ClickHouse/ClickHouse/pull/80785)
- **Add a setting for SQL-standard-compatible behavior**
  - [Issue #98600](https://github.com/ClickHouse/ClickHouse/issues/98600)

These requests show continued demand for compatibility layers that reduce migration cost from traditional SQL systems and tools.

### Storage engine and deployment model evolution
- **Support hard links for `plain_rewritable` disks**
  - [Issue #91611](https://github.com/ClickHouse/ClickHouse/issues/91611)
- **`Remote` database engine**
  - [Issue #59304](https://github.com/ClickHouse/ClickHouse/issues/59304)
- **`port_offset` config for multi-instance testing**
  - [Issue #96407](https://github.com/ClickHouse/ClickHouse/issues/96407)

### Likely candidates for the next version
Based on maturity and active PR status, the most plausible near-term arrivals are:
1. **Skip-index usage logging** — [PR #99793](https://github.com/ClickHouse/ClickHouse/pull/99793)
2. **Predicate/selectivity statistics** — [PR #98727](https://github.com/ClickHouse/ClickHouse/pull/98727)
3. **Field-based minmax statistics** — [PR #100605](https://github.com/ClickHouse/ClickHouse/pull/100605)
4. **NATURAL JOIN AST reconstruction fix** — [PR #100223](https://github.com/ClickHouse/ClickHouse/pull/100223)
5. **Exact-count optimization bugfix** — [PR #100408](https://github.com/ClickHouse/ClickHouse/pull/100408)

More ambitious items like **Arrow Flight SQL** and **Azure DataLake/Delta Kernel** look substantial enough that they may require a bit more time.

---

## 7) User Feedback Summary

### Main pain points reported
- **Upgrade regressions are the top concern**
  - INSERT slowdown from 25.12 to 26.2: [#99241](https://github.com/ClickHouse/ClickHouse/issues/99241)
  - timestamp behavior changes across 26.2 patch versions: [#100614](https://github.com/ClickHouse/ClickHouse/issues/100614)
  - replicated mutation checksum mismatch in 26.3: [#100493](https://github.com/ClickHouse/ClickHouse/issues/100493)

This suggests users appreciate rapid feature delivery, but production operators want stronger guarantees around performance and semantic stability between releases.

### SQL/tooling compatibility remains important
- Analyzer compatibility with generated SQL/DBT-like workflows mattered enough to get discussed and closed:
  - [#99308](https://github.com/ClickHouse/ClickHouse/issues/99308)

- Requests for SQL-standard mode and broader client/protocol support indicate that users increasingly expect ClickHouse to fit into mixed-database environments:
  - [#98600](https://github.com/ClickHouse/ClickHouse/issues/98600)
  - [PR #80785](https://github.com/ClickHouse/ClickHouse/pull/80785)

### Operational use cases are broadening
Users are pushing ClickHouse into:
- **shared storage / one-writer-many-readers** scenarios,
- **object storage + cache** deployments,
- **catalog/lakehouse integrations**,
- **high-concurrency networked clusters**.

That is visible in:
- [#91611](https://github.com/ClickHouse/ClickHouse/issues/91611)
- [PR #99386](https://github.com/ClickHouse/ClickHouse/pull/99386)
- [PR #86892](https://github.com/ClickHouse/ClickHouse/pull/86892)
- [#91591](https://github.com/ClickHouse/ClickHouse/issues/91591)

### Satisfaction signals
There are positive signs in the fact that several user-visible papercuts were closed quickly:
- `obfuscateQuery` delivered: [PR #98305](https://github.com/ClickHouse/ClickHouse/pull/98305)
- executable quoting fixed: [PR #99794](https://github.com/ClickHouse/ClickHouse/pull/99794)
- S3 cache/part-broken misclassification fixed: [PR #99386](https://github.com/ClickHouse/ClickHouse/pull/99386)

---

## 8) Backlog Watch

These older items still look important and worthy of maintainer attention.

### Long-running, strategically important issues

#### 1. Hard links with `plain_rewritable`
- [Issue #91611](https://github.com/ClickHouse/ClickHouse/issues/91611)
- Open since 2025-12-06

Important for advanced storage topologies and efficient shared-storage semantics.

#### 2. TCP connection count limitations
- [Issue #91591](https://github.com/ClickHouse/ClickHouse/issues/91591)
- Open since 2025-12-05

Potentially important for very large-scale deployments; could benefit from more concrete operational guidance or code-level mitigation.

#### 3. `Remote` database engine
- [Issue #59304](https://github.com/ClickHouse/ClickHouse/issues/59304)
- Open since 2024-01-28

A substantial roadmap item with architectural implications. Still relevant as ClickHouse expands federation and multi-system access patterns.

#### 4. SQL-standard compatibility mode
- [Issue #98600](https://github.com/ClickHouse/ClickHouse/issues/98600)
- Open since 2026-03-03

This could have outsized adoption impact despite being framed as an “easy task,” because it simplifies migration and interoperability stories.

#### 5. `ARRAY JOIN` strips `LowCardinality`
- [Issue #95582](https://github.com/ClickHouse/ClickHouse/issues/95582)
- Open since 2026-01-30

This is a small-looking issue with potentially real memory/performance consequences in practical workloads.

### Long-running PRs to watch

#### 6. Azure Delta Kernel DataLake support
- [PR #86892](https://github.com/ClickHouse/ClickHouse/pull/86892)

#### 7. Arrow Flight SQL support
- [PR #91170](https://github.com/ClickHouse/ClickHouse/pull/91170)

#### 8. PostgreSQL protocol support for C# client compatibility
- [PR #80785](https://github.com/ClickHouse/ClickHouse/pull/80785)

#### 9. Distributed optimization: push ORDER BY into simple VIEWs
- [PR #94102](https://github.com/ClickHouse/ClickHouse/pull/94102)

These look materially useful and may need sustained reviewer bandwidth to cross the finish line.

---

## Bottom line

ClickHouse is showing **strong development momentum** with a high merge rate, a fresh stable patch release, and visible progress across SQL features, storage correctness, and testing infrastructure. The main caution flag is **upgrade risk in 26.x**, especially around ingest performance and time/mutation semantics. For users, the safest reading of today’s data is: **innovation is strong, but production upgrades should still be benchmarked carefully against 25.12 stable**.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-25

## 1. Today's Overview

DuckDB showed high day-to-day engineering activity over the last 24 hours, with **21 issues updated** and **39 pull requests updated**, indicating an active stabilization and development cycle. The dominant theme is **post-1.5.x quality hardening**: several newly reported issues involve crashes, internal errors, optimizer correctness, Windows CLI behavior, and API memory-safety problems. At the same time, contributors are landing and proposing fixes in core optimizer logic, checkpointing, parsing/binding, ADBC, Arrow integration, and CLI behavior. Overall, project health looks strong in terms of throughput, but the issue mix suggests the team is currently absorbing regressions and edge cases introduced or exposed around the **v1.5.0/v1.5.1** line.

## 2. Project Progress

No new release was published today.

Merged/closed PR activity still points to meaningful progress across the analytical engine, storage layer, packaging, and CI:

- **Checkpoint/storage maintenance improved**
  - **[#21574](https://github.com/duckdb/duckdb/pull/21574)** — *Simplify the way we determine which row groups to checkpoint during checkpoints*  
    This is an important storage-engine maintenance change. It reflects ongoing work to make checkpointing more robust while concurrent appends are allowed, reducing complexity in selecting which row groups are safely persisted.

- **CSV reader edge-case fix landed**
  - **[#21577](https://github.com/duckdb/duckdb/pull/21577)** — *Fix for CSV reader buffer-boundary value read*  
    This addresses parser correctness in a classic ingestion boundary condition, relevant for reliability of large-file import workloads.

- **ASOF join fix backported to stable branch**
  - **[#21553](https://github.com/duckdb/duckdb/pull/21553)** — *[v1.5-variegata] Fix #21514: ASOF join empty right*  
    This is directly relevant to time-series and analytical join semantics. The branch-targeted backport suggests maintainers consider it production-relevant for the 1.5 series.

- **Build/configuration reliability improved**
  - **[#21376](https://github.com/duckdb/duckdb/pull/21376)** — *Fix GCC compile flags on reconfigure*  
    This strengthens reproducibility for source builds and extension/static build configurations.

- **Release pipeline and packaging maintenance**
  - **[#21575](https://github.com/duckdb/duckdb/pull/21575)** — *Pass runners to extension jobs and reuse linux build*  
    Improves build artifact generation speed and CI/release efficiency.
  - **[#21588](https://github.com/duckdb/duckdb/pull/21588)** — *Bump Julia to v1.5.0*
  - **[#21589](https://github.com/duckdb/duckdb/pull/21589)** — *Bump Julia to v1.4.4 on v1.4-andium*
  - **[#21572](https://github.com/duckdb/duckdb/pull/21572)** — *lance: bump lance-duckdb*
  - **[#21587](https://github.com/duckdb/duckdb/pull/21587)** — *Exclude slow tests from debug verification*  
    Together these indicate active maintenance of ecosystem integrations and release engineering, rather than large new end-user features.

Open PRs also show deeper architectural work underway:

- **[#21562](https://github.com/duckdb/duckdb/pull/21562)** — window function binding refactor
- **[#21596](https://github.com/duckdb/duckdb/pull/21596)** — `InsertStatement` refactor into `InsertQueryNode`
- **[#21597](https://github.com/duckdb/duckdb/pull/21597)** — move vector data ownership into `VectorBuffer`

These are notable because they usually precede improved correctness, maintainability, and future feature work in the query engine internals.

## 3. Community Hot Topics

The most active discussion and duplicate implementation effort today centered on **statistics propagation correctness for `date_part`**, a small-looking bug with optimizer consequences:

- **Issue [#21478](https://github.com/duckdb/duckdb/issues/21478)** — *Off-by-one error in PropagateStatistics for date_part...*  
  The issue has the highest visible discussion count in this set. The core problem is that upper bounds for week/minute/second/millisecond/microsecond/nanosecond statistics are too high by 1, so impossible predicates cannot always be pruned into `EMPTY_RESULT`.
- **PR [#21558](https://github.com/duckdb/duckdb/pull/21558)** — first proposed fix
- **PR [#21606](https://github.com/duckdb/duckdb/pull/21606)** — second proposed fix

This cluster reflects a broader technical need: users increasingly depend on DuckDB’s **optimizer precision**, not just execution correctness. Even minor statistics inaccuracies can harm filter pruning and query planning quality.

Other high-signal items:

- **Issue [#21539](https://github.com/duckdb/duckdb/issues/21539)** — *Memory leak on repeated persistent inserts using C API*  
  Closed quickly, suggesting responsiveness on embedded/API reliability concerns.
- **Issue [#21352](https://github.com/duckdb/duckdb/issues/21352)** — *Internal error when converting json to variant*  
  Indicates active experimentation with newer semi-structured data functionality, especially `JSON` → `VARIANT` workflows.
- **PR [#21562](https://github.com/duckdb/duckdb/pull/21562)** — window binding internals  
  While not the highest-comment item by visible metadata, it is strategically important. It points to ongoing investment in SQL semantics and implementation cleanup for window functions.
- **PR [#21375](https://github.com/duckdb/duckdb/pull/21375)** — *Add row group skipping support for MAP columns in Parquet reader*  
  This is a significant analytics-facing optimization request. It targets better Parquet selectivity handling in nested-type workloads, a common need in modern data lake usage.

## 4. Bugs & Stability

Below is a severity-ranked view of notable bugs reported or active today.

### Critical

1. **Wrong results from optimizer for window functions**
   - **Issue [#21592](https://github.com/duckdb/duckdb/issues/21592)** — *WindowSelfJoinOptimizer produces wrong results for ROWS frames*  
   This is the most severe issue in the set because it is labeled **incorrect results**. The optimizer reportedly rewrites window aggregates into `GROUP BY + INNER JOIN` even when an explicit `ROWS` frame makes that transformation invalid. Wrong-result bugs are higher risk than crashes for analytical systems.

2. **Checkpoint crash can invalidate database**
   - **Issue [#21601](https://github.com/duckdb/duckdb/issues/21601)** — *CHECKPOINT crashes with Invalid bitpacking mode on fixed-size ARRAY columns (FLOAT[256])*  
   A fatal checkpoint failure affecting persisted databases is highly serious for production users. The report explicitly says the database becomes invalidated and must be restored from backup.

3. **Windows extension load access violation**
   - **Issue [#21602](https://github.com/duckdb/duckdb/issues/21602)** — *LOAD motherduck causes access violation on Windows in PyInstaller bundle (DuckDB 1.5.x)*  
   This appears to be a **1.5.x regression** in a real deployment scenario: bundled Windows executables. It impacts ecosystem integration and extension loading.

### High

4. **Internal binder/planner regressions in complex CTEs**
   - **Issue [#21604](https://github.com/duckdb/duckdb/issues/21604)** — *Failed to bind column reference... complex CTE chain (Regression in v1.5.1)*
   - **Issue [#21582](https://github.com/duckdb/duckdb/issues/21582)** — *Could not find CTE definition for CTE reference*  
   These suggest fragility in advanced SQL compilation paths involving macros, materialized CTEs, unions, and joins.

5. **Memory safety bugs in APIs**
   - **Issue [#21584](https://github.com/duckdb/duckdb/issues/21584)** — *adbc: heap-use-after-free on error*  
     Fix PR exists: **[#21605](https://github.com/duckdb/duckdb/pull/21605)**
   - **Issue [#21593](https://github.com/duckdb/duckdb/issues/21593)** — *Segfault with ArrowBuffer v1.4 due to unchecked malloc*  
     Fix PR exists: **[#21594](https://github.com/duckdb/duckdb/pull/21594)**  
   Both are important because they affect connector/API safety under failure or memory pressure.

6. **JSON-to-VARIANT internal crash**
   - **Issue [#21352](https://github.com/duckdb/duckdb/issues/21352)** — *Internal error when converting json to variant*  
   Signals immaturity in newer semi-structured pathways.

### Medium

7. **Prepared `COPY TO` with parameterized filename fails**
   - **Issue [#21578](https://github.com/duckdb/duckdb/issues/21578)**  
   Important for application embedding and prepared-statement workflows.

8. **Recursive `UNNEST` incomplete on fixed nested arrays**
   - **Issue [#21506](https://github.com/duckdb/duckdb/issues/21506)**  
   Affects nested-type SQL behavior and consistency.

9. **`opfs://` path canonicalization breaks duckdb-wasm**
   - **Issue [#21603](https://github.com/duckdb/duckdb/issues/21603)**  
   Important for browser/WASM deployments.

10. **`date_part` statistics off-by-one**
   - **Issue [#21478](https://github.com/duckdb/duckdb/issues/21478)**  
   Fixes proposed in **[#21558](https://github.com/duckdb/duckdb/pull/21558)** and **[#21606](https://github.com/duckdb/duckdb/pull/21606)**.  
   Lower severity than wrong results, but directly affects optimizer quality.

### Lower but visible usability issues

- **Issue [#21585](https://github.com/duckdb/duckdb/issues/21585)** — Windows 11 CLI prompt incorrect in CMD/PowerShell
- **Issue [#21571](https://github.com/duckdb/duckdb/issues/21571)** — Windows 11 admin-mode CLI shows random characters
- **Issue [#21579](https://github.com/duckdb/duckdb/issues/21579)** — markdown output mode not available for `DESCRIBE`
- **Issue [#21583](https://github.com/duckdb/duckdb/issues/21583)** — HTTPFS request incompatibility with OpenAI API

## 5. Feature Requests & Roadmap Signals

There were not many large new end-user feature requests today, but several items reveal likely near-term priorities.

### Strong roadmap signals

- **Parquet nested-type pruning**
  - **PR [#21375](https://github.com/duckdb/duckdb/pull/21375)** — row group skipping for `MAP` columns  
  This aligns with DuckDB’s broader strategy of improving Parquet scan efficiency for complex schemas. It looks plausible for inclusion in an upcoming minor release once conflicts are resolved.

- **Finer-grained checkpoint behavior**
  - **PR [#21570](https://github.com/duckdb/duckdb/pull/21570)** — `checkpoint_on_detach` 3-valued setting  
  This suggests growing demand from embedded and multi-database users for more explicit durability/performance controls.

- **Window function semantic cleanup**
  - **PR [#21562](https://github.com/duckdb/duckdb/pull/21562)**  
  Not a direct feature request, but this kind of binder refactor often enables future SQL compatibility improvements.

- **Core AST/query-node refactors**
  - **PR [#21596](https://github.com/duckdb/duckdb/pull/21596)**  
  Another internal signal that DML syntax and planning infrastructure are being prepared for cleaner extension.

### User-requested platform support

- **Issue [#21494](https://github.com/duckdb/duckdb/issues/21494)** — *Add riscv64 to release binaries and Python wheel builds*  
  Closed, but still noteworthy as a roadmap signal. It shows interest in broader architecture support, especially for open hardware and low-cost systems. Even if not immediate, this type of request is likely to recur.

### SQL/CLI ergonomics

- **Issue [#21579](https://github.com/duckdb/duckdb/issues/21579)** — markdown output support for `DESCRIBE`
- **PR [#21552](https://github.com/duckdb/duckdb/pull/21552)** — shell completion enter handling  
  These are small but high-visibility UX improvements for CLI-heavy users.

## 6. User Feedback Summary

Several clear user pain points emerged from today’s issue traffic:

- **Windows CLI experience is rough in some terminal modes**
  - [#21585](https://github.com/duckdb/duckdb/issues/21585)
  - [#21571](https://github.com/duckdb/duckdb/issues/21571)  
  Users on Windows 11, especially in CMD/PowerShell/admin contexts, are seeing prompt corruption or random characters. This can damage first impressions even if engine correctness is unaffected.

- **Advanced SQL users are hitting planner/binder edge cases**
  - [#21592](https://github.com/duckdb/duckdb/issues/21592)
  - [#21582](https://github.com/duckdb/duckdb/issues/21582)
  - [#21604](https://github.com/duckdb/duckdb/issues/21604)  
  The affected patterns involve CTE chains, macros, window functions, unions, and joins—exactly the kind of complex analytical SQL DuckDB aims to support well.

- **Embedded/application developers care about memory and API safety**
  - [#21584](https://github.com/duckdb/duckdb/issues/21584)
  - [#21593](https://github.com/duckdb/duckdb/issues/21593)
  - [#21539](https://github.com/duckdb/duckdb/issues/21539)  
  This reinforces DuckDB’s role not just as a CLI database but as an embedded analytics engine where C, ADBC, Arrow, and Python integration robustness matters a lot.

- **Semi-structured and nested data are increasingly common**
  - [#21352](https://github.com/duckdb/duckdb/issues/21352)
  - [#21506](https://github.com/duckdb/duckdb/issues/21506)
  - [#21375](https://github.com/duckdb/duckdb/pull/21375)  
  Users are exercising JSON, VARIANT, nested arrays, and MAP/Parquet support heavily. This is an important demand signal for continued investment in modern data lake semantics.

- **Persistence and checkpoint reliability remain mission-critical**
  - [#21601](https://github.com/duckdb/duckdb/issues/21601)  
  Any report that a crash can invalidate a database is especially important for trust in production deployments.

## 7. Backlog Watch

These items look especially deserving of maintainer attention because of impact, age, or strategic value:

- **[#16679](https://github.com/duckdb/duckdb/issues/16679)** — *No Hex to UINT128 conversion*  
  Open for over a year and marked stale, but it points to an inconsistency in numeric casting behavior across integer widths. It is not severe, yet it is exactly the kind of SQL consistency gap users notice.

- **[#21352](https://github.com/duckdb/duckdb/issues/21352)** — *Internal error when converting json to variant*  
  Given DuckDB’s increasing push into semi-structured data support, this should likely receive prompt attention.

- **[#21375](https://github.com/duckdb/duckdb/pull/21375)** — *Row group skipping for MAP columns in Parquet reader*  
  Currently open with merge conflicts. This is strategically valuable for analytical scan performance and nested lakehouse workloads.

- **[#21478](https://github.com/duckdb/duckdb/issues/21478)** plus duplicate/open fix PRs  
  - [#21558](https://github.com/duckdb/duckdb/pull/21558)
  - [#21606](https://github.com/duckdb/duckdb/pull/21606)  
  Maintainer arbitration would help avoid duplicate effort and get a small optimizer correctness fix merged quickly.

- **New high-severity regressions likely needing rapid triage**
  - [#21592](https://github.com/duckdb/duckdb/issues/21592) — wrong results
  - [#21601](https://github.com/duckdb/duckdb/issues/21601) — checkpoint crash/database invalidation
  - [#21604](https://github.com/duckdb/duckdb/issues/21604) — v1.5.1 regression in complex SQL
  - [#21602](https://github.com/duckdb/duckdb/issues/21602) — Windows extension crash in bundled apps

## Overall Assessment

DuckDB is in a **high-velocity but stabilization-heavy** phase. The project continues to evolve its optimizer, SQL binder, storage internals, and ecosystem tooling, but recent issue traffic shows that **v1.5.x edge cases and regressions are now the main operational focus**. The encouraging sign is that contributors are opening fix PRs quickly—especially for memory-safety and optimizer issues—so the near-term outlook is good, provided maintainers prioritize the handful of **wrong-result, checkpoint, and regression-class bugs** now surfacing.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-25

## 1. Today's Overview

StarRocks remained highly active over the last 24 hours, with **116 PR updates** and **14 issue updates**, indicating strong maintainer throughput and ongoing multi-branch stabilization work. Most visible activity was concentrated around **documentation backports**, **bug fixes for external catalogs/connectors**, and **shared-data / warehouse behavior corrections**. The issue stream shows a notable pattern: users are reporting **stability and metadata-scaling problems** in external lakehouse integrations, especially **Iceberg, Paimon, Azure ADLS, and Python SQLAlchemy tooling**. Overall project health looks **operationally strong but integration-heavy**, with maintainers closing bugs quickly, while some deeper architecture and scalability issues remain open.

## 2. Project Progress

Today’s merged/closed work suggests progress in three main areas:

### External catalog and metadata correctness
- **Paimon metadata handling** saw several bug closures, indicating rapid hardening of the connector layer:
  - [#70185](https://github.com/StarRocks/starrocks/pull/70185) / issue context: DESCRIBE / SHOW CREATE TABLE failed to show primary keys for Paimon PK tables.
  - [#70223](https://github.com/StarRocks/starrocks/issues/70223): catalog refresh crash on ObjectTable due to `ClassCastException`.
  - [#70282](https://github.com/StarRocks/starrocks/issues/70282): Paimon column statistics mapped `nullCount` into `averageRowSize`, a planner-quality bug.
  - [#70255](https://github.com/StarRocks/starrocks/issues/70255): follower FE failed `CREATE VIEW` on Paimon catalog because of Ranger permission-check behavior.

These closures indicate continued investment in making **external catalog metadata refresh and introspection safer and more planner-friendly**, especially for Paimon users.

### Shared-data / warehouse execution behavior
- A bug in query-scoped warehouse hints was fixed and backported:
  - [PR #70706](https://github.com/StarRocks/starrocks/pull/70706) fixed leakage of `ComputeResource` in `ConnectContext`.
  - Backports/automation: [#70730](https://github.com/StarRocks/starrocks/pull/70730), [#70732](https://github.com/StarRocks/starrocks/pull/70732).

This is important for **multi-warehouse deployments**, where query-level routing must not pollute session state and cause follow-on execution errors or resource misrouting.

### Observability / admin UX and docs
- Documentation changes dominated visible PR traffic:
  - [#70702](https://github.com/StarRocks/starrocks/pull/70702) Separate BE Config Docs, with backports [#70712](https://github.com/StarRocks/starrocks/pull/70712), [#70713](https://github.com/StarRocks/starrocks/pull/70713), [#70714](https://github.com/StarRocks/starrocks/pull/70714), [#70715](https://github.com/StarRocks/starrocks/pull/70715).
  - New follow-up docs include [#70737](https://github.com/StarRocks/starrocks/pull/70737) Add BE Config Sidebar and [#70708](https://github.com/StarRocks/starrocks/pull/70708) Hadoop WildFly native SSL FAQ.
- A noteworthy open bugfix PR:
  - [#70735](https://github.com/StarRocks/starrocks/pull/70735) adjusts `be_tablets.DATA_SIZE` semantics to reflect rowset column data bytes rather than broader footprint.

That last item matters because it improves the reliability of **tablet-level storage accounting**, helping operators reason about true data size versus index/auxiliary overhead.

## 3. Community Hot Topics

### 1) FE memory blow-up with massive Iceberg partition counts
- Issue: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
- Topic: FE OOM caused by eager loading of all partitions into `partitionCache` for Iceberg tables with **millions of partitions**.
- Signals:
  - One of the more discussed open issues in the set.
  - Indicates a real production-scale metadata bottleneck rather than a corner-case bug.

**Technical need:** StarRocks users increasingly expect the FE to handle **hyperscale lakehouse metadata** lazily and incrementally. This points to pressure for **partition pruning before full materialization**, cache redesign, or paged metadata loading.

### 2) Long-running leader transfer safety request
- Issue: [#63357](https://github.com/StarRocks/starrocks/issues/63357)
- Topic: safer FE leader transfer without forcing old leader exit.
- Signals:
  - Enhancement request with positive reactions.
  - Reflects operator pain in HA/DBA workflows.

**Technical need:** Better HA ergonomics and leader handoff semantics. This is less about features and more about **control-plane resilience and maintenance experience**.

### 3) Python SQLAlchemy dialect breaks Superset dataset creation
- Issue: [#70733](https://github.com/StarRocks/starrocks/issues/70733)
- Fix PR: [#70734](https://github.com/StarRocks/starrocks/pull/70734)
- Topic: `ReflectedPartitionInfo` dataclass is unhashable, breaking Superset integration.

**Technical need:** BI ecosystem compatibility remains important. The quick appearance of a fix PR suggests maintainers recognize that **client-library friction directly impacts adoption**.

### 4) Parallel compaction evolution
- PR: [#70162](https://github.com/StarRocks/starrocks/pull/70162)
- Topic: range-split parallel compaction for non-overlapping output.

**Technical need:** This is a strong roadmap signal toward **more scalable lake compaction** and better write/read amplification control in shared-data storage layouts.

## 4. Bugs & Stability

Ranked by likely severity and operational impact:

### Critical
1. **FE OOM on Iceberg tables with millions of partitions**
   - Issue: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
   - Impact: FE crashes in production; can destabilize cluster control plane.
   - Status: Open.
   - Fix PR: None referenced in today’s data.

2. **Segmentation fault querying Parquet on Azure Data Lake Storage**
   - Issue: [#70478](https://github.com/StarRocks/starrocks/issues/70478)
   - Impact: BE crash path when accessing `FILES()` on ADLS parquet.
   - Status: Closed.
   - Interpretation: Good sign that crash-level cloud storage integration issues are being handled quickly, though no linked PR is shown in the provided data.

3. **SIGSEGV in `UnionConstSourceOperator` with large VARCHAR replication**
   - Issue: [#68656](https://github.com/StarRocks/starrocks/issues/68656)
   - Impact: process crash under large-string workloads.
   - Status: Closed.
   - Interpretation: Another stability fix in execution/operator layer, relevant for wide-row or replication-heavy workloads.

### High
4. **Paimon refresh crash via `ClassCastException`**
   - Issue: [#70719](https://github.com/StarRocks/starrocks/issues/70719)
   - Related closed precursor: [#70223](https://github.com/StarRocks/starrocks/issues/70223)
   - Impact: metadata refresh daemon instability for certain Paimon table types.
   - Status: Open for a newer variant.
   - Interpretation: Fixes are landing, but the connector likely still has table-type coverage gaps.

5. **Warehouse tablet distribution skew across CN nodes**
   - Issue: [#70717](https://github.com/StarRocks/starrocks/issues/70717)
   - Impact: load imbalance after CN migration between warehouses in shared-storage deployment.
   - Status: Open.
   - Interpretation: Potentially serious for resource efficiency and predictable performance in multi-warehouse operations.

6. **`CONVERT_TZ` returns NULL for Casablanca / El_Aaiun on BE path**
   - Issue: [#70671](https://github.com/StarRocks/starrocks/issues/70671)
   - Impact: query correctness bug; timezone conversion differs between FE constant folding and BE execution.
   - Status: Open.
   - Root cause identified by reporter as cctz parsing failure for year-round DST POSIX TZ string.
   - Interpretation: A correctness issue with narrow timezone scope but high trust implications.

### Medium
7. **Superset / SQLAlchemy reflection failure**
   - Issue: [#70733](https://github.com/StarRocks/starrocks/issues/70733)
   - Fix PR: [#70734](https://github.com/StarRocks/starrocks/pull/70734)
   - Impact: breaks dataset creation in BI tooling.
   - Status: Open issue, active fix available.

8. **Restart-related insert errors with generic aggregate states in MV**
   - Issue: [#63885](https://github.com/StarRocks/starrocks/issues/63885)
   - Impact: persistence/recovery correctness around materialized views.
   - Status: Open.
   - Interpretation: Important for advanced MV users, but appears not yet prioritized for immediate closure.

## 5. Feature Requests & Roadmap Signals

### Likely roadmap signals

1. **Safer FE leader transfer**
   - Issue: [#63357](https://github.com/StarRocks/starrocks/issues/63357)
   - This looks like a meaningful operational enhancement request and aligns with enterprise expectations around HA. It has the strongest “platform maturity” signal among the open enhancements.

2. **Repair cloud-native tables with missing files**
   - Issue: [#66015](https://github.com/StarRocks/starrocks/issues/66015)
   - Closed, implying StarRocks has advanced recovery tooling for shared-data/cloud-native tables.
   - This suggests the roadmap is actively addressing **single-replica cloud metadata/data repairability**.

3. **Range-split parallel compaction**
   - PR: [#70162](https://github.com/StarRocks/starrocks/pull/70162)
   - Strong candidate for a future release if accepted, because it directly targets **compaction scalability and non-overlapping output guarantees**.

4. **Hive external table creation support**
   - PR: [#42757](https://github.com/StarRocks/starrocks/pull/42757)
   - Long-lived feature request. If revived, it would improve StarRocks’ role as a **lakehouse federated SQL endpoint** with better metastore interoperability.

5. **Iceberg REST OAuth2 compatibility**
   - PR: [#61748](https://github.com/StarRocks/starrocks/pull/61748)
   - This is a practical integration feature likely to matter for Apache Polaris and secured Iceberg REST catalogs. Given market trends, this kind of connector auth polish is likely to appear in upcoming minor versions.

### Most likely near-term inclusion
Based on today’s signals, the next versions are most likely to continue shipping:
- **connector stability fixes** for Paimon/Iceberg,
- **multi-warehouse/shared-data correctness fixes**,
- **admin/observability improvements**,
- **client ecosystem fixes** such as Python dialect compatibility.

## 6. User Feedback Summary

Current user feedback centers on operational realism rather than benchmark-style performance claims:

- **Metadata scale pain is real.** The Iceberg OOM report [#67760](https://github.com/StarRocks/starrocks/issues/67760) shows users are pushing StarRocks against **very large partition counts**, and current FE behavior can be too eager for those environments.
- **External catalog reliability matters heavily.** Multiple Paimon-related issues closed in one day imply that users are relying on StarRocks as a **query layer over lakehouse metadata**, and correctness of schema, PK, permissions, and stats is essential.
- **Shared-data/multi-warehouse deployments are maturing but still rough at edges.** The warehouse-hint fix [#70706](https://github.com/StarRocks/starrocks/pull/70706) and CN skew issue [#70717](https://github.com/StarRocks/starrocks/issues/70717) both point to active real-world adoption of warehouse isolation and compute mobility.
- **BI/tooling integration is a practical adoption blocker.** The Superset/SQLAlchemy issue [#70733](https://github.com/StarRocks/starrocks/issues/70733) is a reminder that even small Python dialect bugs can disrupt user workflows immediately.

In short, users appear satisfied enough to deploy StarRocks in complex lakehouse and shared-data scenarios, but they are now exposing the project’s **scaling, metadata, and ecosystem-integration edges**.

## 7. Backlog Watch

These items appear important and deserving of maintainer attention due to age, impact, or strategic value:

1. **FE OOM for huge Iceberg partition catalogs**
   - [#67760](https://github.com/StarRocks/starrocks/issues/67760)
   - High severity, open since January, likely affects large production lakehouse deployments.

2. **Generic aggregate states in MV fail after restart**
   - [#63885](https://github.com/StarRocks/starrocks/issues/63885)
   - Open since 2025-10-10.
   - Suggests durability/recovery gaps for advanced MV features.

3. **Safe FE leader transfer**
   - [#63357](https://github.com/StarRocks/starrocks/issues/63357)
   - Open enhancement with clear operator value and positive user interest.

4. **Support create Hive external table**
   - [PR #42757](https://github.com/StarRocks/starrocks/pull/42757)
   - Very old open PR; strategically relevant if StarRocks wants stronger bidirectional Hive metastore integration.

5. **Iceberg REST OAuth2 scope duplication fix**
   - [PR #61748](https://github.com/StarRocks/starrocks/pull/61748)
   - Open since 2025-08-09; important for modern secured catalog interoperability.

6. **Expression and list partitions docs PR still open**
   - [PR #62922](https://github.com/StarRocks/starrocks/pull/62922)
   - Not critical, but a sign that some documentation work remains slow-moving despite heavy docs activity elsewhere.

---

## Bottom Line

StarRocks had a **very active maintenance day**, with strong evidence of fast bug closure in **Paimon**, **warehouse/session handling**, and **documentation rollout across release branches**. The biggest unresolved risks remain **FE metadata scalability for Iceberg**, **connector edge-case crashes/correctness**, and **shared-data operational balancing**. The project looks healthy and responsive, but today’s data shows that StarRocks is increasingly being tested in **large-scale, heterogeneous lakehouse production environments**, where metadata and control-plane efficiency are becoming just as important as raw query speed.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-25

## 1) Today's Overview

Apache Iceberg showed **strong development activity** over the last 24 hours, with **50 PRs updated** and **9 issues touched**, although there were **no new releases**. The day’s work was concentrated in three areas: **Spark integration**, **REST/catalog internals**, and **infrastructure/security hardening**. There is also clear momentum behind longer-horizon roadmap items such as **variant support**, **materialized views**, **Bloom-filter-based pruning**, and **V4 metadata/manifest work**. Overall, project health looks **active and forward-moving**, but some user-facing bugs around **Spark behavior, metrics visibility, and write/update correctness** still need maintainer attention.

## 3) Project Progress

### Merged/closed PRs today

Even without a release, a few changes were completed that improve project hygiene and patch readiness:

- [PR #15756](https://github.com/apache/iceberg/pull/15756) — **Core: Add `VisibleForTesting` annotation in `SchemaUpdate` constructor**  
  Closed quickly as a small core cleanup. This is minor, but it helps clarify API/test boundaries in schema evolution code.

- [PR #15753](https://github.com/apache/iceberg/pull/15753) — **CI: pin GitHub actions to commit hash**  
  Closed as part of the workflow hardening effort tied to [Issue #15742](https://github.com/apache/iceberg/issues/15742). This advances **supply-chain security** in project infrastructure rather than engine functionality.

- [Issue #15599](https://github.com/apache/iceberg/issues/15599) — **Backport DV merge fix to 1.10.x**  
  Closed in preparation for a **1.10.2 patch release**, which is an important maintenance signal. While not a new release yet, it suggests maintainers are actively stabilizing **deletion vector merge behavior** for the 1.10 line.

- [Issue #14037](https://github.com/apache/iceberg/issues/14037) — **SQL:2011-compliant DECIMAL scale evolution**  
  Closed after discussion, indicating progress in clarifying Iceberg’s position on **SQL compatibility for schema evolution**, especially around DECIMAL widening/scale-change semantics.

### What this advanced technically

- **Security/infrastructure maturity** improved via GitHub Actions hardening.
- **Patch-line stability** improved through the DV merge backport path for 1.10.x.
- **Schema evolution clarity** advanced through closure of the DECIMAL evolution discussion, even if broader implementation details may still evolve elsewhere.

## 4) Community Hot Topics

### 1. Variant support and performance readiness
- [Issue #15628](https://github.com/apache/iceberg/issues/15628) — **Add JMH benchmarks for Variants**
- [PR #14297](https://github.com/apache/iceberg/pull/14297) — **Spark: Support writing shredded variant in Iceberg-Spark**

This is one of the clearest roadmap signals in today’s data. Iceberg contributors are not only adding **variant write support** for Spark, but are also asking for **benchmarking infrastructure** to understand scaling behavior. The underlying need is straightforward: semi-structured and variant data are becoming first-class analytical workloads, and users need confidence that Iceberg can store and process them efficiently, not just correctly.

### 2. GitHub workflow security hardening
- [Issue #15742](https://github.com/apache/iceberg/issues/15742) — **Harden GitHub Workflow Against Supply Chain Attacks**
- [PR #15753](https://github.com/apache/iceberg/pull/15753) — **Pin GitHub actions to commit hash**
- [PR #15757](https://github.com/apache/iceberg/pull/15757) — **Add zizmor workflow audit for unpinned actions**

This topic moved quickly. The technical need is defensive: reduce exposure to **CI/CD supply-chain compromise**, especially through third-party GitHub Actions. The quick PR follow-up suggests maintainers view this as operationally important.

### 3. Spark planning and correctness issues
- [Issue #9268](https://github.com/apache/iceberg/issues/9268) — **DatasourceV2 does not prune columns after `V2ScanRelationPushDown`**
- [Issue #11191](https://github.com/apache/iceberg/issues/11191) — **Spark SQL UI can't show scan metrics**
- [PR #15726](https://github.com/apache/iceberg/pull/15726) — **Fix NPE for MAP/LIST columns on DELETE, UPDATE, MERGE**

This cluster points to a recurring theme: users want Iceberg’s Spark integration to behave predictably under newer optimizer and DML paths. The underlying technical needs are:
- better alignment with Spark optimizer rule ordering,
- richer observability in Spark UI,
- robust handling of complex types during row-level operations.

### 4. REST/catalog and cloud storage evolution
- [PR #15595](https://github.com/apache/iceberg/pull/15595) — **Simplify `RESTTableScan` by removing catalog internals**
- [PR #15280](https://github.com/apache/iceberg/pull/15280) — **Spec support for credential refresh on staged tables**
- [Issue #15695](https://github.com/apache/iceberg/issues/15695) — **Scheduled refresh for `GCSFileIO` held storage credentials**
- [PR #15029](https://github.com/apache/iceberg/pull/15029) — **Fix inconsistent 404 handling in GCS and ADLS FileIO**

These items show Iceberg continuing to mature as a **multi-cloud, REST-catalog-centered table format platform**. The main needs are cleaner internal layering, more reliable temporary/staged credentials, and better cloud-provider consistency.

### 5. Long-running strategic features
- [PR #9830](https://github.com/apache/iceberg/pull/9830) — **Materialized Views support with Spark SQL**
- [PR #15311](https://github.com/apache/iceberg/pull/15311) — **Bloom filter index POC**
- [PR #15049](https://github.com/apache/iceberg/pull/15049) — **Foundational types for V4 manifest support**
- [PR #15634](https://github.com/apache/iceberg/pull/15634) — **Write Parquet/Avro manifests in V4**

These are major roadmap-level efforts: **materialized views**, **secondary pruning indexes**, and **next-gen metadata structures**. They are not “done,” but they signal where Iceberg’s architecture is headed.

## 5) Bugs & Stability

Ranked by likely user impact and severity:

### High severity

1. [PR #15726](https://github.com/apache/iceberg/pull/15726) — **NPE on DELETE/UPDATE/MERGE with MAP/LIST columns in Spark 4.1 + Iceberg 1.11 snapshots**  
   This is a serious **row-level DML correctness/stability bug** because it affects mutating operations on partitioned tables with nested complex types. A fix PR exists, which is a good sign.

2. [Issue #9268](https://github.com/apache/iceberg/issues/9268) — **Column pruning not applied after `V2ScanRelationPushDown`**  
   This could lead to **unnecessary I/O and degraded query efficiency** in Spark 3.5. It looks more like a planning/integration issue than data corruption, but it affects scan efficiency and possibly expected optimizer behavior. No fix PR is listed in today’s data.

### Medium severity

3. [Issue #11191](https://github.com/apache/iceberg/issues/11191) — **Spark SQL UI cannot show scan metrics**  
   This is primarily an **observability regression** rather than a correctness bug, but it impacts operators trying to diagnose scan cost and performance. No direct fix PR appears in today’s list.

4. [PR #15748](https://github.com/apache/iceberg/pull/15748) — **Fix NPE in `FileGenerationUtil.generateRandomMetrics`**  
   This appears to affect test/support tooling rather than production query paths, but it still indicates fragility around metrics-bound generation logic.

5. [PR #15029](https://github.com/apache/iceberg/pull/15029) — **Inconsistent 404 handling in GCS/ADLS FileIO**  
   This is important for cloud deployments because wrong exception mapping can trigger **wasted retries** and confusing failure modes in metastore/table operations.

### Lower severity / maintenance

6. [Issue #15754](https://github.com/apache/iceberg/issues/15754) — **Question about whether `write.target-file-size-bytes` includes compression**  
   Not a bug report, but it exposes a **documentation/usability gap** around file sizing expectations for Parquet writers.

## 6) Feature Requests & Roadmap Signals

### Most notable requests and in-flight features

- [Issue #15628](https://github.com/apache/iceberg/issues/15628) / [PR #14297](https://github.com/apache/iceberg/pull/14297) — **Variant support and benchmarking**  
  Likely to continue landing incrementally. This has a strong chance of appearing in an upcoming minor release because implementation and performance validation are both active.

- [PR #9830](https://github.com/apache/iceberg/pull/9830) — **Materialized views for Spark SQL**  
  Still strategic and likely larger in scope. This feels more like a medium-term roadmap item than an imminent patch feature.

- [PR #15311](https://github.com/apache/iceberg/pull/15311) — **Bloom-filter file skipping index POC**  
  Strong signal that Iceberg is exploring **advisory indexing** to improve selective query planning. This is probably not near-term GA, but it’s an important direction for read performance.

- [PR #15049](https://github.com/apache/iceberg/pull/15049) and [PR #15634](https://github.com/apache/iceberg/pull/15634) — **V4 manifests and adaptive metadata foundations**  
  These are foundational and likely to land gradually over multiple releases. They point to future **metadata scalability** and **single-file/adaptive commit** improvements.

- [PR #15280](https://github.com/apache/iceberg/pull/15280) / [Issue #15695](https://github.com/apache/iceberg/issues/15695) — **Credential refresh for staged tables and GCS FileIO**  
  This looks practical and high-value for cloud users. Of the roadmap items visible today, this seems like one of the more plausible candidates for the **next minor version**, because it addresses concrete production pain.

- [PR #15150](https://github.com/apache/iceberg/pull/15150) — **Set `sort_order_id` in manifests for Spark writes**  
  This is a standards-alignment and optimization-readiness improvement that could reasonably make a near-term release.

### Prediction for next version signals

Most likely near-term inclusions:
- cloud credential refresh improvements,
- Spark write metadata correctness (`sort_order_id`),
- DML/NPE fixes for Spark 4.1,
- cloud FileIO error normalization,
- security/CI hardening work.

Less likely immediate inclusions but strong strategic direction:
- materialized views,
- Bloom-filter indexing,
- full variant ecosystem support,
- larger V4 metadata changes.

## 7) User Feedback Summary

Today’s user feedback points to a few concrete pain areas:

- **Spark integration still has sharp edges**, especially around optimizer behavior, UI metrics, and row-level operations.  
  Relevant items: [Issue #9268](https://github.com/apache/iceberg/issues/9268), [Issue #11191](https://github.com/apache/iceberg/issues/11191), [PR #15726](https://github.com/apache/iceberg/pull/15726)

- **Cloud credential lifecycle management matters in production**, especially for GCS and staged-table scenarios.  
  Relevant items: [Issue #15695](https://github.com/apache/iceberg/issues/15695), [PR #15280](https://github.com/apache/iceberg/pull/15280)

- **Users need clearer operational/documentation guidance**, such as how target file sizing interacts with compression.  
  Relevant item: [Issue #15754](https://github.com/apache/iceberg/issues/15754)

- **There is appetite for more advanced analytics capabilities**: variants, materialized views, file-skipping indexes, and richer metadata structures.  
  Relevant items: [Issue #15628](https://github.com/apache/iceberg/issues/15628), [PR #14297](https://github.com/apache/iceberg/pull/14297), [PR #9830](https://github.com/apache/iceberg/pull/9830), [PR #15311](https://github.com/apache/iceberg/pull/15311)

Overall sentiment from the activity is not dissatisfaction with Iceberg’s direction; rather, users are pushing it into **more complex production and engine-integration scenarios**, and that is where friction is surfacing.

## 8) Backlog Watch

These older or long-running items appear important and may need maintainer focus:

- [Issue #9268](https://github.com/apache/iceberg/issues/9268) — **Spark column pruning after V2 pushdown**  
  Open since 2023 and still active. Important because it affects planner efficiency and engine integration quality.

- [PR #9830](https://github.com/apache/iceberg/pull/9830) — **Materialized Views support**  
  Long-running strategic PR. High value, but likely complex and in need of sustained review bandwidth.

- [Issue #11191](https://github.com/apache/iceberg/issues/11191) — **Spark SQL UI scan metrics invisible**  
  Open since 2024. This is a quality-of-operations issue that matters for enterprise observability.

- [PR #14297](https://github.com/apache/iceberg/pull/14297) — **Shredded variant writes in Spark**  
  Significant feature work that likely needs design and performance review, not just correctness review.

- [PR #15408](https://github.com/apache/iceberg/pull/15408) — **REST namespace UUID support**  
  Important for catalog/API consistency; currently marked stale despite being tied to REST spec evolution.

- [PR #15345](https://github.com/apache/iceberg/pull/15345) — **Kafka Connect handling of `java.util.Date`**  
  A practical compatibility fix for connector users that may deserve faster resolution given its narrow, production-facing scope.

---

## Bottom line

Iceberg had a **busy, healthy day** with strong PR throughput and visible progress on security, Spark, cloud integration, and long-term metadata evolution. The project’s roadmap is clearly expanding toward **variant data, richer indexing, materialized views, and V4 metadata**, while maintainers also continue patch-line stabilization work. The main risks remain **Spark integration bugs**, **long-lived backlog items**, and the need to convert strategic PRs into releasable increments.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-25

## 1) Today’s Overview

Delta Lake showed **high pull request activity** over the last 24 hours, with **49 PRs updated** and **8 merged/closed**, while issue traffic stayed very light at just **2 active issues** and no closures. The activity pattern suggests the project is currently in a **feature-integration and internal platform plumbing phase**, especially around **kernel-spark CDC streaming**, **DSv2 CREATE TABLE support**, **server-side planning/auth**, and **table-feature evolution** such as **Variant** and **Geospatial** support. There were **no releases**, so today’s signal is more about **codebase momentum** than shipped user-facing artifacts. Overall project health looks strong: contributor throughput is high, but several stacked PR chains imply reviewers and maintainers are managing **complex, interdependent changes** rather than isolated fixes.

## 2) Project Progress

**Merged/closed PRs today: 8 total**, though the supplied dataset does not enumerate which 8 were merged versus simply closed. Based on the PRs actively updated, the main areas of progress appear to be:

- **CDC streaming in kernel-spark**: a large stacked series is moving forward across initial snapshot handling, incremental commit processing, offset management, schema coordination, null-coalescing/read function decoration, deletion vectors, and end-to-end tests:
  - [#6075](https://github.com/delta-io/delta/pull/6075) — initial snapshot
  - [#6076](https://github.com/delta-io/delta/pull/6076) — incremental change commit processing
  - [#6336](https://github.com/delta-io/delta/pull/6336) — offset management wiring
  - [#6359](https://github.com/delta-io/delta/pull/6359) — ReadFunc decorator and null-coalesce
  - [#6362](https://github.com/delta-io/delta/pull/6362) — schema coordination
  - [#6363](https://github.com/delta-io/delta/pull/6363) — E2E CDC streaming tests
  - [#6370](https://github.com/delta-io/delta/pull/6370) — DV+CDC same-path pairing and DeletionVector support

  This is a strong signal that Delta Lake is advancing **streaming change data feed semantics in kernel-based Spark paths**, which matters for users building low-latency ingest, CDC replication, and incremental ETL pipelines.

- **DSv2 and Kernel-backed DDL path** is also progressing via a stacked set:
  - [#6377](https://github.com/delta-io/delta/pull/6377) — DDLRequest POJO and infrastructure
  - [#6378](https://github.com/delta-io/delta/pull/6378) — CreateTableBuilder, V2 routing, integration tests
  - [#6379](https://github.com/delta-io/delta/pull/6379) — wire `DeltaCatalog.createTable()` to DSv2 + Kernel

  This points to a roadmap emphasis on **unifying Spark catalog/table creation with newer DSv2 abstractions and Kernel execution paths**, likely improving connector consistency and future engine portability.

- **Planning/auth infrastructure** moved with:
  - [#6360](https://github.com/delta-io/delta/pull/6360) — OAuth support for server-side planning

  This suggests growing focus on **enterprise deployment scenarios**, especially environments using **credential providers and per-request auth** rather than static tokens.

- **Format/package refactoring and optimization work**:
  - [#6376](https://github.com/delta-io/delta/pull/6376) — shared format package for DSv2 parquet/metadata adapters
  - [#6381](https://github.com/delta-io/delta/pull/6381) — track fully pushed partition filters in `SparkScan`

  These changes likely support **cleaner planner internals** and potentially better **filter pushdown visibility/correctness**.

## 3) Community Hot Topics

### A. Kernel-Spark CDC streaming stack dominates attention
Most visible current engineering energy is the multi-part CDC stack:
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)

**Underlying technical need:** users want **robust CDC streaming semantics outside the legacy Spark-only path**, including proper handling of:
- initial snapshots,
- incremental offsets,
- schema evolution/coordination,
- deletion vectors,
- and end-to-end correctness under mixed CDC/DV conditions.

This is a roadmap-level investment, not a minor enhancement.

### B. Governance transparency became a user-visible topic
- Issue: [#6219](https://github.com/delta-io/delta/issues/6219) — “Where is the current Delta Lake TSC membership listed?”
- Follow-up PR: [#6382](https://github.com/delta-io/delta/pull/6382) — “Add TSC members to CONTRIBUTING.md”

**Underlying need:** enterprise adopters increasingly care about **project governance clarity**, especially for strategic table formats and lakehouse infrastructure. This is not a runtime feature request, but it affects **trust, procurement, and long-term platform choice**.

### C. CREATE TABLE through DSv2/Kernel path
- [#6377](https://github.com/delta-io/delta/pull/6377)
- [#6378](https://github.com/delta-io/delta/pull/6378)
- [#6379](https://github.com/delta-io/delta/pull/6379)

**Underlying need:** users and downstream integrators need a more standard, modern table-creation flow through **Spark DSv2**, improving maintainability and enabling future cross-engine compatibility.

### D. Geospatial support remains active
- [#6235](https://github.com/delta-io/delta/pull/6235) — GeoSpatial table feature
- [#6301](https://github.com/delta-io/delta/pull/6301) — parse geometry/geography stats as WKT strings

**Underlying need:** users increasingly want Delta tables to store and optimize for **geospatial data types and statistics**, likely to support lakehouse-native spatial analytics.

## 4) Bugs & Stability

Ranked by likely severity based on impact described in titles/summaries:

### 1. Potential silent data loss in coordinated commits — highest severity
- PR: [#6353](https://github.com/delta-io/delta/pull/6353) — “Fix race condition in commitFilesIterator causing silent data loss with coordinated commits”

This is the most serious item in today’s data. The summary describes a race where commit discovery happens in two phases, and if concurrent backfilling occurs between them, commits may be skipped. Anything labeled **silent data loss** is critical because it threatens **correctness guarantees** rather than just performance or UX.  
**Status:** fix PR exists and is active.

### 2. Data-loss scenario coverage gaps during initial snapshot
- PR: [#6298](https://github.com/delta-io/delta/pull/6298) — E2E tests on all data loss scenarios during initial snapshot

While this is framed as test work, it signals maintainers are actively hardening behavior around **snapshot correctness under failure/data-loss scenarios**.  
**Status:** mitigation/testing PR exists, but not necessarily a complete fix set.

### 3. Unstructured exception for missing start version in kernel-spark
- Issue: [#6380](https://github.com/delta-io/delta/issues/6380) — request for structured `startVersionNotFound` exception exposing `earliestAvailableVersion`

This is not a crash report but a **stability/usability issue** affecting recovery logic. Embedding critical state only in an error string makes automation fragile and complicates robust client behavior.  
**Severity:** medium; affects operational resilience and API ergonomics.  
**Status:** no linked fix PR in supplied data.

### 4. Spark 4.0 / Variant write safety compatibility concern
- PR: [#6356](https://github.com/delta-io/delta/pull/6356) — block Spark 4.0 clients from writing to Variant tables

This indicates a potential compatibility or correctness hazard when newer Spark clients interact with Variant-enabled Delta tables.  
**Severity:** medium to high, depending on exposure.  
**Status:** protective fix/config PR exists.

### 5. Partition filter tracking correctness / optimization transparency
- PR: [#6381](https://github.com/delta-io/delta/pull/6381) — track fully pushed partition filters in `SparkScan`

Likely lower severity, but could affect **query planning correctness, explainability, or optimization accounting**.  
**Status:** active fix/enhancement PR.

## 5) Feature Requests & Roadmap Signals

### Structured exception metadata for kernel clients
- Issue: [#6380](https://github.com/delta-io/delta/issues/6380)

This is a small but meaningful request: expose `earliestAvailableVersion` programmatically instead of burying it in message text. This is a strong signal that Delta Kernel consumers need **machine-readable failure metadata** for retries, replay logic, and recovery orchestration.  
**Prediction:** likely to be accepted soon because it is narrowly scoped and improves API quality.

### Strong roadmap signals from active PRs

#### A. CDC streaming in Kernel/Spark is nearing a major milestone
The large stacked sequence around CDC streaming strongly suggests Delta Lake is building toward broader **kernel-based streaming change processing**:
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)

**Likely next-version candidate:** yes, at least partial pieces.

#### B. DSv2 CREATE TABLE support
- [#6377](https://github.com/delta-io/delta/pull/6377)
- [#6378](https://github.com/delta-io/delta/pull/6378)
- [#6379](https://github.com/delta-io/delta/pull/6379)

**Likely next-version candidate:** high. These are foundational and appear coordinated.

#### C. Geospatial table support
- [#6235](https://github.com/delta-io/delta/pull/6235)
- [#6301](https://github.com/delta-io/delta/pull/6301)

**Likely next-version candidate:** possible but less certain than CDC/DSv2, since geospatial often requires broader protocol, stats, and ecosystem considerations.

#### D. Variant feature hardening
- [#6349](https://github.com/delta-io/delta/pull/6349)
- [#6356](https://github.com/delta-io/delta/pull/6356)

**Likely next-version candidate:** yes for compatibility/hardening work, especially if Variant GA support is being backported/cherry-picked.

#### E. Enterprise auth for server-side planning
- [#6360](https://github.com/delta-io/delta/pull/6360)

**Likely next-version candidate:** plausible for cloud/enterprise users.

## 6) User Feedback Summary

Today’s user-visible pain points are less about broad dissatisfaction and more about **operational sharp edges** in advanced deployments:

- **Recoverability and API ergonomics:** the request in [#6380](https://github.com/delta-io/delta/issues/6380) shows users need **structured exceptions** to build resilient consumers around Delta Kernel.
- **Governance visibility:** [#6219](https://github.com/delta-io/delta/issues/6219) indicates some adopters are evaluating Delta not just as code, but as a **governed open project**, and missing TSC visibility creates friction.
- **Correctness under concurrency:** [#6353](https://github.com/delta-io/delta/pull/6353) and [#6298](https://github.com/delta-io/delta/pull/6298) reinforce that users care deeply about **no-data-loss guarantees**, especially in coordinated commits and snapshot/streaming edge cases.
- **Compatibility confidence:** [#6356](https://github.com/delta-io/delta/pull/6356) suggests users want safeguards when mixing new Spark versions with new Delta table features like Variant.
- **Modern analytics feature demand:** geospatial and CDC work indicate demand for Delta as more than a storage layer — users expect it to support **richer analytical semantics** and **cross-engine execution paths**.

Net takeaway: users appear broadly aligned with Delta’s direction, but they are asking for **stronger correctness guarantees, safer compatibility behavior, and more machine-readable APIs**.

## 7) Backlog Watch

These items appear to need maintainer attention either because they are strategically important, user-facing, or part of long-running stacked work:

### Long-running/important open PRs
- [#6075](https://github.com/delta-io/delta/pull/6075) — kernel-spark CDC streaming offset management (Part 1), open since 2026-02-19  
- [#6076](https://github.com/delta-io/delta/pull/6076) — CDC incremental commit processing (Part 2), open since 2026-02-19

These are foundational to a large active stack; timely review is important to avoid blocking dependent PRs.

### Strategic feature PRs still open
- [#6235](https://github.com/delta-io/delta/pull/6235) — GeoSpatial table feature, open since 2026-03-10
- [#6301](https://github.com/delta-io/delta/pull/6301) — geospatial stats parsing as WKT strings, open since 2026-03-17

These likely need protocol/schema/statistics design scrutiny.

### Important unresolved issue
- [#6380](https://github.com/delta-io/delta/issues/6380) — structured `startVersionNotFound` exception

This is a small issue but high leverage for Kernel consumers; it would benefit from quick triage.

### Governance/documentation follow-through
- [#6219](https://github.com/delta-io/delta/issues/6219) — TSC membership listing
- [#6382](https://github.com/delta-io/delta/pull/6382) — proposed documentation fix

This is low engineering effort and high trust value; it should be easy to close out promptly.

---

## Key Links

- Issue: [#6219](https://github.com/delta-io/delta/issues/6219) — TSC membership listing
- Issue: [#6380](https://github.com/delta-io/delta/issues/6380) — structured exception for `startVersionNotFound`

- PR: [#6353](https://github.com/delta-io/delta/pull/6353) — fix race causing silent data loss
- PR: [#6298](https://github.com/delta-io/delta/pull/6298) — E2E initial snapshot data-loss scenarios
- PR: [#6360](https://github.com/delta-io/delta/pull/6360) — OAuth for server-side planning
- PR: [#6356](https://github.com/delta-io/delta/pull/6356) — block Spark 4.0 clients from Variant writes
- PR: [#6381](https://github.com/delta-io/delta/pull/6381) — track fully pushed partition filters
- PR: [#6382](https://github.com/delta-io/delta/pull/6382) — add TSC members to `CONTRIBUTING.md`

- CDC stack:
  - [#6075](https://github.com/delta-io/delta/pull/6075)
  - [#6076](https://github.com/delta-io/delta/pull/6076)
  - [#6336](https://github.com/delta-io/delta/pull/6336)
  - [#6359](https://github.com/delta-io/delta/pull/6359)
  - [#6362](https://github.com/delta-io/delta/pull/6362)
  - [#6363](https://github.com/delta-io/delta/pull/6363)
  - [#6370](https://github.com/delta-io/delta/pull/6370)

- DSv2 CREATE TABLE stack:
  - [#6377](https://github.com/delta-io/delta/pull/6377)
  - [#6378](https://github.com/delta-io/delta/pull/6378)
  - [#6379](https://github.com/delta-io/delta/pull/6379)

- Geospatial:
  - [#6235](https://github.com/delta-io/delta/pull/6235)
  - [#6301](https://github.com/delta-io/delta/pull/6301)

If you want, I can also turn this into a **short executive briefing**, a **release-manager view**, or a **weekly trend comparison vs previous days**.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-25

## 1. Today's Overview

Databend showed strong day-to-day development activity on 2026-03-25, with **26 PRs updated** and **10 issues updated** in the last 24 hours, indicating an actively maintained codebase. The dominant theme was **query-engine hardening**, especially around SQL parser/planner correctness, panic elimination, and semantic-error handling. There is also continued forward motion on **experimental table versioning features** and **HTTP/API usability**. Overall, project health looks good from a throughput perspective, though the number of newly surfaced planner/parser panic bugs suggests the team is in an intensive correctness and edge-case stabilization phase.

## 3. Project Progress

### Merged/closed work today

Although there were **no releases**, several issues and PRs were closed, signaling incremental progress in core SQL behavior and platform capabilities.

- **Fixed `LIKE ... ESCAPE` formatter/parser round-trip panic**  
  Closed issue: [#19563](https://github.com/databendlabs/databend/issues/19563)  
  Closing PR: [#19596](https://github.com/databendlabs/databend/pull/19596)  
  This resolves a parser reparse assertion caused by single-quote escaping in `LIKE ... ESCAPE ''''`. This is an important **SQL compatibility and AST/display correctness** improvement.

- **Parquet prewhere behavior corrected / setting respected**  
  Closed PR: [#19609](https://github.com/databendlabs/databend/pull/19609)  
  Follow-up open PR: [#19610](https://github.com/databendlabs/databend/pull/19610)  
  The fix ensures Databend respects `enable_parquet_prewhere` when applying prewhere pushdown for parquet-backed tables, including Fuse parquet tables. This is a meaningful **query execution safety/control** improvement, likely reducing risk of unintended pushdown behavior.

- **Older feature requests were formally closed**
  - [#13023](https://github.com/databendlabs/databend/issues/13023) — `COPY INTO location` compression in `FILE_FORMAT`
  - [#14710](https://github.com/databendlabs/databend/issues/14710) — HTTP API support to list stage files  
  These closures suggest that either implementation landed elsewhere, the capability was superseded, or roadmap direction has changed. In either case, they indicate some backlog cleanup around **data export ergonomics** and **stage/file management APIs**.

### Ongoing notable progress in open PRs

- **Experimental table branch support**: [#19551](https://github.com/databendlabs/databend/pull/19551)
- **Experimental table tags for Fuse snapshots**: [#19549](https://github.com/databendlabs/databend/pull/19549)
- **Server-side parameter binding for `/v1/query`**: [#19601](https://github.com/databendlabs/databend/pull/19601)
- **Partitioned hash join refactor**: [#19553](https://github.com/databendlabs/databend/pull/19553)
- **Structural agg-index rewrite matching**: [#19567](https://github.com/databendlabs/databend/pull/19567)
- **Recursive CTE coverage via sudoku case**: [#19599](https://github.com/databendlabs/databend/pull/19599)

These point to sustained work across **query planning**, **execution engine internals**, **table versioning semantics**, and **client/API ergonomics**.

## 4. Community Hot Topics

### 1) INSERT performance regression after upgrade
- Issue: [#19481](https://github.com/databendlabs/databend/issues/19481)  
- Most active issue today by comments: **27 comments**

This is the clearest high-interest operational topic. A user reports **slower `INSERT` performance** after upgrading from `1.2.790` to `1.2.881-nightly`. The sustained discussion volume suggests this is not a trivial edge case but a likely **real workload regression** affecting ingestion performance. For an OLAP system, insert throughput is a major adoption and upgrade risk factor, especially for hybrid analytical/streaming ingestion pipelines.

**Underlying technical need:** better regression tracking for write path performance, likely in areas such as block compaction, snapshot/commit overhead, mutation bookkeeping, or pipeline scheduling changes introduced in recent nightlies.

### 2) SQL correctness around `LIKE` and `ESCAPE`
Relevant items:
- Issue: [#19562](https://github.com/databendlabs/databend/issues/19562)
- Issue: [#19561](https://github.com/databendlabs/databend/issues/19561)
- Issue: [#19563](https://github.com/databendlabs/databend/issues/19563)
- PR: [#19590](https://github.com/databendlabs/databend/pull/19590)
- PR: [#19595](https://github.com/databendlabs/databend/pull/19595)
- PR: [#19597](https://github.com/databendlabs/databend/pull/19597)

A concentrated cluster of bugs and fixes around `LIKE` constant folding and `ESCAPE` handling shows strong maintainer focus on **SQL edge-case correctness**. The pattern is notable: multiple cases that should yield semantic errors instead caused panics. This suggests users and contributors are actively using conformance-style test suites and fuzz-like edge cases.

**Underlying technical need:** safer planner fast paths, parser/display round-trip guarantees, and elimination of unchecked `unwrap()` or assumptions in expression simplification.

### 3) SQL-standard binary literal behavior
- Issue: [#19600](https://github.com/databendlabs/databend/issues/19600)
- PR: [#19608](https://github.com/databendlabs/databend/pull/19608)

This new issue was answered almost immediately with a targeted PR. The problem: Databend handled `X'...'` as a PostgreSQL-style hex integer literal rather than a SQL-standard binary literal. That is a textbook **cross-dialect compatibility** gap and the fast turnaround suggests maintainers consider SQL compatibility debt important.

### 4) CI/stage test matrix correctness
- Issue: [#19598](https://github.com/databendlabs/databend/issues/19598)
- PR: [#19606](https://github.com/databendlabs/databend/pull/19606)

This is a lower-level but important quality signal: the CI `stage` matrix `size` dimension was defined but not wired into runtime. Fixing this improves **test coverage fidelity**, which should help catch data/stage workflow regressions earlier.

## 5. Bugs & Stability

Ranked by likely impact/severity:

### High severity

1. **INSERT performance regression in newer nightly builds**  
   - Issue: [#19481](https://github.com/databendlabs/databend/issues/19481)  
   A direct regression affecting ingestion speed after upgrade. This is likely the most user-visible current risk because it impacts production throughput and upgrade confidence.  
   **Fix PR:** none visible in today’s set.

2. **Planner panic on full-range `UInt64` column stats overflow**  
   - Issue: [#19555](https://github.com/databendlabs/databend/issues/19555)  
   - Fix PR: [#19591](https://github.com/databendlabs/databend/pull/19591)  
   A planning-stage panic caused by overflow in NDV reduction when stats span `[0, 18446744073709551615]`. This is serious because it can break optimization/planning on valid schemas and data distributions.

3. **Invalid `GROUPING()` query causes panic instead of semantic error**  
   - Issue: [#19554](https://github.com/databendlabs/databend/issues/19554)  
   - Fix PR: [#19594](https://github.com/databendlabs/databend/pull/19594)  
   This is a correctness/stability issue in constant folding and aggregate rewrite ordering. While triggered by invalid SQL, panics in response to malformed input are still high-priority engine defects.

### Medium severity

4. **`LIKE ... ESCAPE ''` planner panic**  
   - Issue: [#19562](https://github.com/databendlabs/databend/issues/19562)  
   - Fix PRs: [#19595](https://github.com/databendlabs/databend/pull/19595), [#19597](https://github.com/databendlabs/databend/pull/19597)  
   A planner type-checking bug caused by empty escape literals. The existence of two related PRs suggests active refinement of the fix approach.

5. **`LIKE` constant folding panic with repeated `%`**  
   - Issue: [#19561](https://github.com/databendlabs/databend/issues/19561)  
   - Fix PR: [#19590](https://github.com/databendlabs/databend/pull/19590)  
   Important for expression simplification robustness and sqllogictest conformance.

6. **Incorrect `X'...'` literal semantics**  
   - Issue: [#19600](https://github.com/databendlabs/databend/issues/19600)  
   - Fix PR: [#19608](https://github.com/databendlabs/databend/pull/19608)  
   This is mainly a SQL compatibility issue rather than a crash, but it can lead to wrong query interpretation.

7. **Stage matrix `size` dimension not used in runtime**  
   - Issue: [#19598](https://github.com/databendlabs/databend/issues/19598)  
   - Fix PR: [#19606](https://github.com/databendlabs/databend/pull/19606)  
   CI/configuration bug, medium severity because it weakens test realism rather than breaking user queries directly.

### Lower severity but notable

8. **Nested join pretty-print round-trip parser panic**  
   - PR: [#19605](https://github.com/databendlabs/databend/pull/19605)  
   Debug-only parse/display validation problem. Important for developer confidence and AST tooling quality.

9. **Result projection mismatch panic replaced with structured error**  
   - PR: [#19602](https://github.com/databendlabs/databend/pull/19602)  
   Another sign of active effort to convert internal panics into typed, user-facing errors.

## 6. Feature Requests & Roadmap Signals

Several open PRs provide strong clues about near-term roadmap direction:

### Likely near-term / next-version candidates

- **Server-side parameter binding for HTTP queries**  
  PR: [#19601](https://github.com/databendlabs/databend/pull/19601)  
  This would improve application integration substantially, especially for custom BI tools, thin clients, and secure query execution over HTTP. This feels highly likely to land soon because it is practical, self-contained, and user-facing.

- **Experimental table branches**  
  PR: [#19551](https://github.com/databendlabs/databend/pull/19551)

- **Experimental table tags for Fuse snapshots**  
  PR: [#19549](https://github.com/databendlabs/databend/pull/19549)  
  Together these point to a clear strategic investment in **data versioning / Git-like table state management**, likely useful for reproducibility, rollback, experimentation, and branch-based data workflows.

- **Recursive CTE functionality maturation**  
  PR: [#19599](https://github.com/databendlabs/databend/pull/19599)  
  The sudoku example suggests maintainers are validating richer recursion behavior and SQL semantics, which is a common milestone for SQL completeness.

### Engine/internal roadmap signals

- **Partitioned hash join support**  
  PR: [#19553](https://github.com/databendlabs/databend/pull/19553)  
  This points toward scaling join execution for larger distributed or memory-sensitive workloads.

- **Agg-index rewrite matching refactor**  
  PR: [#19567](https://github.com/databendlabs/databend/pull/19567)  
  Moving from string-based to structural expression matching is a strong sign of maturing optimizer architecture.

### Recently closed requests implying roadmap follow-through or pruning

- **Compression support in `COPY INTO location` `FILE_FORMAT`**  
  Issue: [#13023](https://github.com/databendlabs/databend/issues/13023)

- **HTTP API to list stage files**  
  Issue: [#14710](https://github.com/databendlabs/databend/issues/14710)

These may already be addressed indirectly, superseded by newer APIs, or deprioritized. They still reflect continuing user demand around **external data movement** and **operational file discovery**.

## 7. User Feedback Summary

Current user feedback falls into three main buckets:

1. **Performance regression sensitivity is high**  
   The `INSERT` slowdown report in [#19481](https://github.com/databendlabs/databend/issues/19481) shows users are closely benchmarking versions and expect nightlies/upgrades not to materially hurt write throughput. This is especially important for Databend’s positioning in analytical ingestion workloads.

2. **Users are exercising SQL edge cases aggressively**  
   The concentration of parser/planner panic reports around `LIKE`, `ESCAPE`, `GROUPING()`, and literal syntax indicates users are running broad SQL compatibility suites or migration workloads from other engines. That is a positive adoption signal, but it also means Databend is being judged on **standards conformance and graceful error handling**, not just headline features.

3. **Compatibility and predictability matter as much as features**  
   Issues such as [#19600](https://github.com/databendlabs/databend/issues/19600) (`X'...'` semantics) and the parquet prewhere setting fix in [#19609](https://github.com/databendlabs/databend/pull/19609) reflect a user base that values exact behavior, dialect consistency, and controllable execution settings.

Net feedback signal: Databend users appear engaged and technically demanding, with current satisfaction likely strongest around responsiveness of maintainers, but tempered by concern over regressions and panic-class bugs.

## 8. Backlog Watch

These items deserve maintainer attention based on age, impact, or strategic importance:

- **INSERT performance regression remains open and active**  
  Issue: [#19481](https://github.com/databendlabs/databend/issues/19481)  
  This is the highest-risk unresolved item in the current digest because it impacts production write performance and has substantial discussion.

- **Experimental table branch support still open**  
  PR: [#19551](https://github.com/databendlabs/databend/pull/19551)  
  Important roadmap item with potentially broad architectural implications; worth tracking for review/merge progress.

- **Experimental table tags for Fuse snapshots still open**  
  PR: [#19549](https://github.com/databendlabs/databend/pull/19549)  
  Strategic feature area; likely needs careful design review due to metadata/model implications.

- **Partitioned hash join refactor still open**  
  PR: [#19553](https://github.com/databendlabs/databend/pull/19553)  
  Performance-sensitive engine work that could have major upside, but typically benefits from focused reviewer attention and benchmarking.

- **Older feature requests just closed should be verified in docs/product surface**  
  - [#13023](https://github.com/databendlabs/databend/issues/13023)
  - [#14710](https://github.com/databendlabs/databend/issues/14710)  
  Since these are long-lived requests, maintainers should ensure closure rationale is visible and documentation reflects the actual product state.

---

## Overall Health Assessment

Databend is in a **high-velocity maintenance and hardening cycle**. The project is shipping lots of targeted fixes quickly, especially for SQL planner/parser crashes and compatibility gaps, which is a strong sign of maintainer responsiveness. The main caution flags are the unresolved **INSERT performance regression** and the recurring pattern of **panic-on-invalid-input** bugs, though many already have active fix PRs. Strategic momentum remains positive, especially around **table versioning**, **optimizer internals**, and **HTTP query ergonomics**.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-25

## 1) Today's Overview

Velox remained highly active over the last 24 hours, with **47 PRs updated** and **7 issues updated**, indicating strong ongoing development velocity despite **no new release**. The dominant themes were **GPU/cuDF execution expansion**, **query correctness and stability fixes**, and **build/CI infrastructure improvements**. A notable pattern is that several changes target deeper engine internals—vector copying, buffer handling, lazy loading, join/filter execution—which suggests the project is working both on feature growth and production hardening. Overall, project health looks **active and forward-moving**, with healthy feature throughput but continued pressure from correctness bugs and flaky tests.

---

## 2) Project Progress

### Merged/closed items today

Only one issue was closed in the provided data:

- **Closed:** [#9523 Add TPCDS connector in Velox](https://github.com/facebookincubator/velox/issues/9523)  
  This closure is a roadmap signal around benchmark/data-generation infrastructure rather than core query execution itself. The original request aimed at a native TPC-DS connector to generate data and benchmark Velox more directly. Its closure may imply the ask was resolved by another path, deprioritized, or superseded.

### What advanced in the active PR stream

While the dataset shows limited merged/closed detail, the open PR flow indicates several areas of concrete progress:

#### GPU / cuDF execution breadth is expanding
- [#16892 Add GPU-accelerated Window operator](https://github.com/facebookincubator/velox/pull/16892)  
- [#16750 GPU Decimal (Part 2 of 3)](https://github.com/facebookincubator/velox/pull/16750)  
- [#16751 GPU Decimal (Part 3 of 3)](https://github.com/facebookincubator/velox/pull/16751)  
- [#16542 Add CudfLocalMerge and allow PartitionOutput without Fallback](https://github.com/facebookincubator/velox/pull/16542)  
- [#16620 Refactor CudfToVelox output batching](https://github.com/facebookincubator/velox/pull/16620)

These PRs collectively point to a major push toward reducing CPU fallback and broadening GPU operator coverage for analytical workloads, especially for **Presto TPC benchmarks** and decimal-heavy SQL.

#### SQL compatibility is improving
- [#16307 Support decimal type for Spark checked_multiply function](https://github.com/facebookincubator/velox/pull/16307)  
- [#16896 Fix owner metadata in SimpleFunctionRegistry::getFunctionSignaturesAndMetadata](https://github.com/facebookincubator/velox/pull/16896)

This suggests ongoing investment in **Spark compatibility** and in better metadata visibility for function inspection/introspection.

#### Engine/runtime robustness is being tightened
- [#16868 Skip filter evaluation in HashProbe when no rows are selected](https://github.com/facebookincubator/velox/pull/16868)  
- [#16774 Pre-load lazy probe input vectors before the non-reclaimable probe loop](https://github.com/facebookincubator/velox/pull/16774)  
- [#16911 Check if buffer is a view before attempting to reallocate](https://github.com/facebookincubator/velox/pull/16911)  
- [#16161 Allow EncodedVectorCopy to generate FlatMapVector in non-NULL vectors](https://github.com/facebookincubator/velox/pull/16161)  
- [#16909 Verify MergeJoin supports FlatMapVector](https://github.com/facebookincubator/velox/pull/16909)

These are important low-level improvements affecting joins, memory behavior, buffer safety, and nested/map-like vector handling.

#### Build and packaging infrastructure is maturing
- [#16827 Add build impact analysis workflow for PRs](https://github.com/facebookincubator/velox/pull/16827)  
- [#16897 Track header files in CMake targets via FILE_SET](https://github.com/facebookincubator/velox/pull/16897)  
- [#16784 Cleanup CI job and switch some deps to wget](https://github.com/facebookincubator/velox/pull/16784)  
- [#16019 Use FBThrift instead of Apache Thrift](https://github.com/facebookincubator/velox/pull/16019)

This is a meaningful signal that maintainers are trying to improve **developer productivity, dependency hygiene, and build graph observability**.

---

## 3) Community Hot Topics

### 1. cuDF operator architecture unification
- Issue: [#16885 Unify cuDF operators with a common base class architecture](https://github.com/facebookincubator/velox/issues/16885) — 8 comments  
- Related roadmap issue: [#15772 Expand GPU operator support for Presto TPC-DS](https://github.com/facebookincubator/velox/issues/15772) — 6 comments

**Why it matters:**  
The cuDF backend is clearly reaching a complexity threshold. Today, multiple GPU operators directly extend `exec::Operator`, leading to duplicated logic and harder maintenance. The request for a shared base class is really about **scaling the GPU subsystem**: easier onboarding of new operators, consistency in memory/error/stream handling, and lower implementation cost for filling benchmark gaps.

**Underlying technical need:**  
Velox’s GPU path is shifting from experimental/operator-by-operator enablement toward a more systematic execution layer. This is reinforced by open feature work like [#16892](https://github.com/facebookincubator/velox/pull/16892), [#16750](https://github.com/facebookincubator/velox/pull/16750), and [#16751](https://github.com/facebookincubator/velox/pull/16751).

---

### 2. Build graph intelligence and ownership metadata
- PR: [#16827 Add build impact analysis workflow for PRs](https://github.com/facebookincubator/velox/pull/16827)  
- PR: [#16897 Track header files in CMake targets via FILE_SET](https://github.com/facebookincubator/velox/pull/16897)

**Why it matters:**  
These changes target maintainability at scale. Velox’s codebase is large enough that understanding **which targets a change affects** is becoming a nontrivial CI and reviewer problem.

**Underlying technical need:**  
The maintainers appear to be building the foundation for **smarter CI, more precise testing, and better file ownership mapping**. This is especially useful in a project where connector code, vector internals, and execution operators are all evolving simultaneously.

---

### 3. FlatMapVector support across execution paths
- PR: [#16161 Allow EncodedVectorCopy to generate FlatMapVector in non-NULL vectors](https://github.com/facebookincubator/velox/pull/16161)  
- PR: [#16909 Verify MergeJoin supports FlatMapVector](https://github.com/facebookincubator/velox/pull/16909)  
- PR: [#16910 Split follow-up for EncodedVectorCopy/FlatMapVector work](https://github.com/facebookincubator/velox/pull/16910)

**Why it matters:**  
This cluster of changes points to ongoing work on **complex/nested data representation correctness**. For modern lakehouse and semi-structured analytics, map-like vectors are increasingly important.

**Underlying technical need:**  
Users likely need more reliable support for **nested and encoded vector forms across joins, copying, and transformations**, especially when avoiding flattening overhead.

---

## 4) Bugs & Stability

Ranked by likely severity based on user impact and failure mode:

### Critical
#### 1. Filter pushdown + Parquet type widening can crash or return wrong results
- Issue: [#16895 Filter pushdown crashes or returns wrong results with Parquet type widening](https://github.com/facebookincubator/velox/issues/16895)

**Impact:**  
This is the highest-severity item in today’s issue list because it combines:
- **hard crash risk**
- **silent wrong results**
- involvement of **Parquet scan/filter pushdown**, a core analytical read path

The issue notes failures when widened types interact with filters such as `DoubleRange` and `HugeintRange`. Wrong-result bugs in predicate pushdown are particularly dangerous because they can silently corrupt query semantics.

**Fix PR exists?**  
No direct fix PR is listed in the provided data.

---

### High
#### 2. `get_json_object` returns wrong results for wildcard paths with simdjson ≥ 4.0
- Issue: [#16855 get_json_object returns wrong results for [*] wildcard paths with simdjson ≥ 4.0](https://github.com/facebookincubator/velox/issues/16855)

**Impact:**  
Affects **Spark SQL Hive compatibility** and produces **query correctness errors** in JSON extraction. Since `get_json_object` is user-facing SQL functionality, this can surface in ETL and downstream BI logic.

**Fix PR exists?**  
No explicit fix PR is shown in the provided data.

---

### High
#### 3. Memory reclamation failure / memory checker problem
- Issue: [#16837 memory checker problem](https://github.com/facebookincubator/velox/issues/16837)

**Impact:**  
The report suggests Velox cannot reclaim memory when system memory limits are exceeded. If reproducible, this threatens query stability under pressure and could translate into **OOMs, poor arbitration behavior, or cache/memory deadlock symptoms**.

**Related fixes nearby:**  
- [#16774 Pre-load lazy probe input vectors before the non-reclaimable probe loop](https://github.com/facebookincubator/velox/pull/16774) looks directionally relevant to reclaimability and arbitration timing, but it does not appear to directly close this issue.

---

### Medium
#### 4. Flaky test in CountIfAggregationTest with invalid read size
- Issue: [#16901 Flaky test: CountIfAggregationTest](https://github.com/facebookincubator/velox/issues/16901)

**Impact:**  
This appears to be CI/test stability rather than a confirmed production bug, but the symptom—attempting to read vastly more bytes than remain in source—suggests possible corruption, deserialization, or stream-position handling issues.

**Fix PR exists?**  
No direct fix PR shown.

---

### Medium
#### 5. Debug-only crash in HashProbe filter evaluation for ANTI joins
- PR: [#16868 Skip filter evaluation in HashProbe when no rows are selected](https://github.com/facebookincubator/velox/pull/16868)

**Impact:**  
Although this came as a fix PR rather than an issue in the feed, it addresses a **sanity-check failure crash** during `HashProbe::evalFilter`, specifically for ANTI joins with filters referencing probe-side join keys. This is a correctness/stability edge case in join execution.

**Status:**  
Open PR; appears to be the active remediation.

---

### Medium
#### 6. Buffer reallocation safety issue with view buffers
- PR: [#16911 Checks if buffer is a view before attempting to reallocate](https://github.com/facebookincubator/velox/pull/16911)

**Impact:**  
This is a defensive fix in memory/buffer management. Reallocating a view-backed buffer is unsafe, so this change likely prevents memory corruption or undefined behavior.

---

## 5) Feature Requests & Roadmap Signals

### GPU acceleration remains the clearest roadmap theme
- [#15772 Expand GPU operator support for Presto TPC-DS](https://github.com/facebookincubator/velox/issues/15772)
- [#16885 Unify cuDF operators with a common base class architecture](https://github.com/facebookincubator/velox/issues/16885)
- [#16892 Add GPU-accelerated Window operator](https://github.com/facebookincubator/velox/pull/16892)
- [#16750 GPU Decimal (Part 2 of 3)](https://github.com/facebookincubator/velox/pull/16750)
- [#16751 GPU Decimal (Part 3 of 3)](https://github.com/facebookincubator/velox/pull/16751)
- [#16542 Add CudfLocalMerge](https://github.com/facebookincubator/velox/pull/16542)

**Prediction:**  
The next version is likely to include broader **GPU execution coverage**, especially around operators needed to reduce fallback in benchmark suites and production mixed-mode workloads. Decimal support and window execution are especially strong candidates.

### Storage format and table-format integration continue expanding
- [#16875 Add DWRF file format support for Iceberg data sink](https://github.com/facebookincubator/velox/pull/16875)

**Prediction:**  
Support for **Iceberg + DWRF** looks like a likely near-term addition, strengthening Velox’s role in lakehouse write/read paths.

### Spark compatibility remains a steady investment area
- [#16307 Support decimal type for Spark checked_multiply function](https://github.com/facebookincubator/velox/pull/16307)
- [#16855 get_json_object wrong results with simdjson ≥ 4.0](https://github.com/facebookincubator/velox/issues/16855)

**Prediction:**  
Expect more **Spark SQL function parity** and ANSI-mode behavior fixes in upcoming releases.

### Build system modernization is becoming strategic
- [#16827 Build impact analysis workflow](https://github.com/facebookincubator/velox/pull/16827)
- [#16897 Track headers in CMake targets](https://github.com/facebookincubator/velox/pull/16897)
- [#16019 Use FBThrift instead of Apache Thrift](https://github.com/facebookincubator/velox/pull/16019)

**Prediction:**  
Not user-visible in SQL behavior, but likely to land soon because these changes reduce maintenance cost and improve CI fidelity.

---

## 6) User Feedback Summary

Based on the issues and PRs updated today, user pain points cluster into a few clear categories:

### 1. GPU users want less fallback and more complete operator coverage
Users running benchmark-style and likely real-world Presto workloads with cuDF want more operators available on GPU, fewer detours into CPU, and a cleaner architecture for future expansion.
- [#15772](https://github.com/facebookincubator/velox/issues/15772)
- [#16885](https://github.com/facebookincubator/velox/issues/16885)

### 2. Query correctness remains a top concern
Users are reporting wrong-result bugs in:
- JSON extraction / Spark compatibility: [#16855](https://github.com/facebookincubator/velox/issues/16855)
- Parquet filter pushdown with type widening: [#16895](https://github.com/facebookincubator/velox/issues/16895)

These are especially important because they affect trust in analytical results, not just performance.

### 3. Memory behavior under pressure is a real production concern
The memory reclamation complaint suggests at least some operators or caches may not be cooperating well with arbitration/reclaim mechanisms.
- [#16837](https://github.com/facebookincubator/velox/issues/16837)

### 4. Developers care about introspection and maintainability
The build-target impact analysis, CMake header ownership work, and function metadata fix imply strong contributor demand for better tooling and metadata.
- [#16827](https://github.com/facebookincubator/velox/pull/16827)
- [#16897](https://github.com/facebookincubator/velox/pull/16897)
- [#16896](https://github.com/facebookincubator/velox/pull/16896)

Overall sentiment from the data is that users are pushing Velox in increasingly demanding production-like scenarios: **GPU execution, lakehouse formats, Spark semantics, and memory-constrained environments**.

---

## 7) Backlog Watch

These older or strategically important items appear to need maintainer attention:

### Long-running PRs
- [#15044 Null handling during velox to arrow conversion](https://github.com/facebookincubator/velox/pull/15044) — created 2025-10-04, marked stale  
  Important because it touches **data integrity** in Parquet/Arrow conversion. Null/empty-string corruption is not cosmetic and deserves closure or merge.

- [#16019 Use FBThrift instead of Apache Thrift](https://github.com/facebookincubator/velox/pull/16019) — created 2026-01-14  
  Strategically significant dependency migration, but likely complex. It may need concentrated maintainer review due to compatibility surface area.

- [#16161 Allow EncodedVectorCopy to generate FlatMapVector in non-NULL vectors](https://github.com/facebookincubator/velox/pull/16161) — created 2026-01-29  
  Important foundational vector work that now has follow-on PRs. The split activity suggests complexity and a need for coordinated landing.

- [#16307 Support decimal type for Spark checked_multiply function](https://github.com/facebookincubator/velox/pull/16307) — created 2026-02-09, ready-to-merge  
  This looks like low-hanging fruit for improving Spark ANSI compatibility and should likely be landed soon.

### Important older issue still active
- [#15772 Expand GPU operator support for Presto TPC-DS](https://github.com/facebookincubator/velox/issues/15772) — created 2025-12-15  
  This is one of the strongest roadmap issues in the queue. It ties directly to multiple current cuDF PRs and appears to be a central benchmark-driven tracking issue.

### Fresh but urgent issue requiring fast response
- [#16895 Filter pushdown crashes or returns wrong results with Parquet type widening](https://github.com/facebookincubator/velox/issues/16895)  
  Not old, but important enough to flag immediately because of correctness risk in a common scan path.

---

## Overall Health Signal

Velox is showing **strong engineering momentum**, especially in GPU execution, vector/runtime internals, and build tooling. The main caution is that **correctness and stability bugs remain nontrivial**, especially in filter pushdown, JSON semantics, and memory behavior. If maintainers can quickly close the loop on the highest-severity wrong-result and crash reports while continuing the cuDF roadmap, the near-term outlook remains strong.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-25

## 1. Today's Overview

Apache Gluten showed **healthy and fairly high development activity** over the last 24 hours, with **20 PRs updated** and **7 issues updated**, though **no new release** was published. The day’s work was concentrated on the **Velox backend**, especially around **limit query performance, test re-enablement for Spark 4.0/4.1, S3 configuration cleanup, executor behavior, and memory/resource correctness**. Several PRs were closed/merged, indicating steady integration progress rather than just discussion churn. Overall, the project appears to be in an **active stabilization and compatibility-improvement phase**, with strong signals around **Spark 4.x readiness, backend correctness, and operational tuning**.

---

## 3. Project Progress

### Merged/closed PRs today: notable advances

#### Query execution and performance
- **Implemented `executeCollect()` in `ColumnarCollectLimitExec`** to address poor performance on simple `LIMIT` queries in Velox-backed execution. This directly targets a user-reported regression where Gluten was over 10x slower than vanilla Spark for `select * ... limit ...`.
  - PR: [#11802](https://github.com/apache/incubator-gluten/pull/11802)
  - Related issue: [#11766](https://github.com/apache/incubator-gluten/issues/11766)

#### Memory/resource management
- **Closed skipped `ColumnarBatch` objects in `ColumnarCollectLimitExec`**, fixing a memory leak pattern when batches were consumed but discarded during offset/limit handling.
  - PR: [#11754](https://github.com/apache/incubator-gluten/pull/11754)
- A parallel fix is now open for ClickHouse backend collection-limit execution:
  - PR: [#11818](https://github.com/apache/incubator-gluten/pull/11818)

#### Spark 4.0 / 4.1 test stability
- Multiple test-focused PRs were merged to improve confidence for newer Spark versions:
  - **Enable additional disabled suites for Spark 4.0/4.1**: [#11812](https://github.com/apache/incubator-gluten/pull/11812)
  - **Add Gluten-specific golden file comparison for plan stability**: [#11805](https://github.com/apache/incubator-gluten/pull/11805)
- A broader follow-up remains open:
  - **Enable 30 disabled test suites for Spark 4.0/4.1**: [#11816](https://github.com/apache/incubator-gluten/pull/11816)

#### S3 and storage-layer operability
- **Removed dead/misleading S3 timeout config** `spark.gluten.velox.fs.s3a.connect.timeout`, clarifying actual behavior and reducing operator confusion.
  - PR: [#11810](https://github.com/apache/incubator-gluten/pull/11810)
  - Related issue: [#11809](https://github.com/apache/incubator-gluten/issues/11809)
- **Enhanced Velox S3 documentation** with configuration details:
  - PR: [#11806](https://github.com/apache/incubator-gluten/pull/11806)
- **Executor model improvements for DBI/S3-related paths** landed:
  - Use CPU thread pool executor as DBI executors: [#11811](https://github.com/apache/incubator-gluten/pull/11811)
  - Add executor pool config support: [#11807](https://github.com/apache/incubator-gluten/pull/11807)

#### Build/tooling and architecture cleanup
- **Removed RAS**, including a breaking config rename from `spark.gluten.ras.costModel` to `spark.gluten.costModel`.
  - PR: [#11756](https://github.com/apache/incubator-gluten/pull/11756)
- **Improved shell portability** by switching project-owned scripts from `#!/bin/bash` to `#!/usr/bin/env bash`.
  - PR: [#11778](https://github.com/apache/incubator-gluten/pull/11778)

### What this means technically
Today’s merged work advanced Gluten in three practical directions:
1. **Fast-path query behavior** for simple interactive SQL.
2. **Resource safety** in columnar execution operators.
3. **Operational maturity** for Spark 4.x and S3-heavy deployments.

---

## 4. Community Hot Topics

### 1) Velox upstream gap tracking
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585) — **[VL] useful Velox PRs not merged into upstream**
- Activity: 16 comments, 4 👍

This is the most discussion-heavy issue in the current set and reflects a core architectural reality for Gluten: it depends heavily on Velox, and project velocity is partly constrained by **what lands upstream versus what must be carried downstream**. The issue signals a strong need for:
- better visibility into pending upstream dependencies,
- reduced rebase burden,
- clearer policy on temporary forks/cherry-picks.

This is an important roadmap signal because backend feature completeness and stability often hinge on upstream Velox integration speed.

### 2) TIMESTAMP_NTZ support
- Issue: [#11622](https://github.com/apache/incubator-gluten/issues/11622)
- PR: [#11626](https://github.com/apache/incubator-gluten/pull/11626)
- Activity: issue has 6 comments, 2 👍

This is one of the clearest SQL compatibility topics under active development. The discussion highlights a non-trivial semantic mismatch between **Spark timestamp semantics** and **Velox/Presto timestamp implementations**. The underlying need is not just “add a type,” but ensure:
- correct type-level semantics,
- safe fallback behavior,
- consistent expression and storage handling.

This feature has strong odds of landing in an upcoming release because both the issue and implementation PR are active.

### 3) Limit query regression in Velox
- Issue: [#11766](https://github.com/apache/incubator-gluten/issues/11766)
- Fix PR: [#11802](https://github.com/apache/incubator-gluten/pull/11802)
- Activity: 6 comments

This topic reveals an important user expectation gap: **simple interactive queries must not regress relative to vanilla Spark**. The fix was closed quickly, suggesting maintainers treated it as a high-priority performance defect. It also indicates growing sensitivity to **single-task/short-query execution paths**, not just large batch analytics.

### 4) Spark 4.x test recovery
- PR: [#11816](https://github.com/apache/incubator-gluten/pull/11816)
- PR: [#11805](https://github.com/apache/incubator-gluten/pull/11805)
- PR: [#11812](https://github.com/apache/incubator-gluten/pull/11812)

This cluster of testing PRs shows a strategic priority: making Gluten more trustworthy on **new Spark major/minor lines**. The technical need here is broad compatibility hardening, especially around:
- persistent session/plugin lifecycle,
- test isolation,
- plan stability/regression detection.

---

## 5. Bugs & Stability

Ranked by likely severity and user impact:

### High severity

#### 1) UnsupportedOperationException during columnar batch serialization
- Issue: [#11819](https://github.com/apache/incubator-gluten/issues/11819)
- Status: Open
- Area: `ColumnarBatchSerializerInstanceImpl.serializeStream`

A new open bug reports `UnsupportedOperationException` in the columnar serializer path. Because this occurs during serialization and touches Spark storage/writer paths, it may affect **shuffle, caching, spill, or persistence-related execution flows**. No linked fix PR is visible yet, so this is currently the most urgent new stability item.

#### 2) OOM-triggered path causing `SQL_CONF_NOT_FOUND`
- Issue: [#11125](https://github.com/apache/incubator-gluten/issues/11125)
- Status: Closed

This older but important bug has now been closed. The issue described an error cascade where TableScan preload OOM led to an unexpected Spark config lookup failure. Closure suggests the team resolved at least one class of **error masking / secondary-failure behavior** in low-memory scenarios.

### Medium severity

#### 3) Severe slowdown for simple `LIMIT` queries
- Issue: [#11766](https://github.com/apache/incubator-gluten/issues/11766)
- Fix PR: [#11802](https://github.com/apache/incubator-gluten/pull/11802)
- Status: Closed

While not a crash, this was a **major practical regression** because it undermined one of the most common exploratory SQL patterns. The quick closure is a positive sign for responsiveness.

#### 4) Memory leak risk in skipped batches during collect-limit execution
- PR: [#11754](https://github.com/apache/incubator-gluten/pull/11754)
- ClickHouse follow-up: [#11818](https://github.com/apache/incubator-gluten/pull/11818)

This is a correctness/stability issue that could become severe under repeated queries or long-running sessions. Velox-side handling appears closed; ClickHouse-side parity work is still open.

### Low-to-medium severity

#### 5) Misleading S3 timeout config
- Issue: [#11809](https://github.com/apache/incubator-gluten/issues/11809)
- Fix PR: [#11810](https://github.com/apache/incubator-gluten/pull/11810)
- Status: Closed

This was not a runtime correctness bug in core query logic, but it mattered operationally because it could lead users to tune the wrong parameter and misdiagnose S3 connection behavior.

---

## 6. Feature Requests & Roadmap Signals

### Strong signals

#### TIMESTAMP_NTZ support
- Issue: [#11622](https://github.com/apache/incubator-gluten/issues/11622)
- PR: [#11626](https://github.com/apache/incubator-gluten/pull/11626)

Likely candidate for the next version or near-term release because implementation is already underway. This improves **Spark SQL type compatibility** and reduces edge-case fallback pressure.

#### `approx_percentile` aggregate support
- PR: [#11651](https://github.com/apache/incubator-gluten/pull/11651)

This is a meaningful analytical SQL feature request:
- PR: [#11651](https://github.com/apache/incubator-gluten/pull/11651)

The key challenge is intermediate-state incompatibility between **Velox KLL sketch** and **Spark GK algorithm**. If merged, this would expand aggregate pushdown/execution coverage but may come with nuanced fallback or compatibility constraints.

#### Native Parquet write for complex types
- PR: [#11788](https://github.com/apache/incubator-gluten/pull/11788)

This is one of the most strategically important open features in today’s set. It would improve **write-path capability and format completeness** for nested data types:
- Struct
- Array
- Map

Given modern lakehouse workloads, this feature would materially improve Gluten’s usefulness for ETL and data lake write workloads.

#### S3 CRT client evaluation
- Issue: [#11815](https://github.com/apache/incubator-gluten/issues/11815)

This points to a likely upcoming performance initiative around **high-throughput object storage I/O**, especially for large transfers and async execution. Even if it does not immediately appear in the next release, it is a strong signal that maintainers are optimizing Gluten for cloud-native storage environments.

### Secondary roadmap signals

#### Keep old 4.0 packages while building new packages
- PR: [#11820](https://github.com/apache/incubator-gluten/pull/11820)

This suggests maintainers are actively smoothing **packaging and migration paths** across Spark/platform versions.

#### Daily Velox update automation
- PR: [#11817](https://github.com/apache/incubator-gluten/pull/11817)

Regular Velox syncs remain a core operational pattern, reinforcing that backend capabilities and bug fixes are tightly tied to upstream Velox movement.

---

## 7. User Feedback Summary

### Main pain points surfaced
1. **Simple-query latency regressions matter a lot**  
   The `LIMIT` regression in [#11766](https://github.com/apache/incubator-gluten/issues/11766) shows users expect Gluten to preserve or improve Spark responsiveness not only for heavy scans/aggregations, but also for lightweight interactive SQL.

2. **SQL type compatibility remains a real adoption blocker**  
   The ongoing TIMESTAMP_NTZ work in [#11622](https://github.com/apache/incubator-gluten/issues/11622) reflects that semantic mismatches between Spark and backend engines are still a friction point for production use.

3. **Operational clarity around cloud storage config is important**  
   The removal of the dead S3 config in [#11810](https://github.com/apache/incubator-gluten/pull/11810) and documentation updates in [#11806](https://github.com/apache/incubator-gluten/pull/11806) suggest users are actively deploying Gluten in S3-backed environments and need trustworthy tuning guidance.

4. **Stability in edge execution paths still needs attention**  
   The new serializer exception in [#11819](https://github.com/apache/incubator-gluten/issues/11819) indicates some lower-level execution/storage integration paths can still fail unexpectedly.

### Satisfaction signals
- Maintainers responded quickly to a visible performance complaint with a fix PR that was already closed.
- Test-enablement work for Spark 4.x suggests the team is investing in reliability, not only new features.
- Documentation and config cleanup point to growing operational maturity.

---

## 8. Backlog Watch

### Items needing maintainer attention

#### 1) Iceberg equality delete MOR support remains open and stale
- PR: [#8056](https://github.com/apache/incubator-gluten/pull/8056)
- Created: 2024-11-26
- Status: Open, stale

This is a strategically important data lake feature. Support for reading Iceberg equality-delete MOR tables is valuable for real-world lakehouse compatibility, but the PR has been open for a long time. It likely needs a maintainer decision on scope, rebase viability, or decomposition.

#### 2) Old Velox/build experiment PR still open
- PR: [#9491](https://github.com/apache/incubator-gluten/pull/9491)
- Created: 2025-05-01
- Status: Open, stale

This appears to be a long-lived technical/testing branch with unclear closure path. It may need explicit triage: merge, supersede, or close.

#### 3) Velox upstream dependency tracker remains relevant
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)

Although active, this issue also serves as a backlog risk indicator. If too many useful Velox PRs remain unmerged upstream, Gluten may accumulate hidden maintenance burden and delayed feature availability.

#### 4) `approx_percentile` support still unresolved
- PR: [#11651](https://github.com/apache/incubator-gluten/pull/11651)

This is an important SQL coverage enhancement but also a technically delicate one because of incompatible aggregate state formats. It likely needs careful maintainer review on semantics and fallback behavior.

#### 5) TIMESTAMP_NTZ support should be prioritized to completion
- Issue: [#11622](https://github.com/apache/incubator-gluten/issues/11622)
- PR: [#11626](https://github.com/apache/incubator-gluten/pull/11626)

This is one of the highest-value compatibility features currently in-flight and worth close maintainer attention before the next release cycle.

---

## Overall Health Assessment

Apache Gluten looks **active, responsive, and technically focused**, with today’s work centered more on **hardening and compatibility** than on broad new feature drops. The strongest progress was in **fixing practical performance regressions, reducing memory/resource risk, improving Spark 4.x readiness, and cleaning up S3 operational behavior**. The main watch-outs are **serializer-path stability**, **ongoing SQL semantic compatibility gaps**, and a few **long-lived stale PRs** in important lakehouse/backend areas. Overall project health is **good**, with momentum strongest in the Velox ecosystem.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-25

## 1. Today's Overview

Apache Arrow remained highly active over the last 24 hours, with **28 issues updated** and **24 pull requests updated**, indicating steady maintainer and contributor throughput. Activity was especially concentrated in **R packaging/CI**, **Python packaging and Parquet APIs**, and **C++/FlightRPC ODBC packaging work**, with several fixes landing for release engineering and toolchain compatibility. There were **no new releases**, but the repository shows strong signs of **stabilization work around patch releases**, especially for the R ecosystem. Overall project health looks solid: maintainers are closing operational issues quickly, while medium-term roadmap work continues in cloud filesystems, Parquet capabilities, and ODBC distribution.

## 3. Project Progress

### Merged/closed PRs today

Several recently closed PRs advanced project quality, compatibility, and maintainability:

- [#49588](https://github.com/apache/arrow/pull/49588) — **[R] Update NEWS.md for 23.0.1.X-r releases**  
  A documentation/release hygiene update, signaling active patch-release management for the R package line.

- [#49581](https://github.com/apache/arrow/pull/49581) — **[CI][R] gcc sanitizer failure**  
  This closed out a sanitizer-related CI problem by skipping a problematic test under sanitization. While not a feature change, it improves test signal quality and unblocks release validation.

- [#49530](https://github.com/apache/arrow/pull/49530) — **[R] CI job shows NOTE due to "non-API call" `Rf_findVarInFrame`**  
  A CRAN-compliance and packaging compatibility fix. This reduces risk for downstream R users and keeps Arrow aligned with stricter package checks.

- [#49492](https://github.com/apache/arrow/pull/49492) — **[C++] Migrate to stdlib span**  
  A notable modernization step for the C++ core: replacing Arrow’s custom span backport with `std::span`. This reduces maintenance burden and aligns the codebase with contemporary C++20 toolchains, though it also exposed some portability risk now visible in downstream compiler reports.

- [#45443](https://github.com/apache/arrow/pull/45443) — **[C++] Handle Single-Line JSON Without Line Ending**  
  This addresses a data ingestion correctness issue where single-line JSON files without trailing newlines were not loaded correctly. It improves robustness of Arrow dataset ingestion paths, which matters for semi-structured analytics pipelines.

- [#44738](https://github.com/apache/arrow/pull/44738) — **[C++][Python][Acero] Add node that emits explicit ordering after asserting order**  
  Although closed rather than clearly merged in this snapshot, the work reflects ongoing attention to execution semantics in Acero. Explicit ordering propagation is highly relevant for analytical query planning and operator correctness.

### What this means technically

Today’s closed work was less about new end-user analytics features and more about **hardening the platform**:
- better **R/CRAN operational stability**
- improved **data ingestion correctness**
- continued **C++ modernization**
- reduced friction in **release engineering**

This is typical of a mature analytical infrastructure project preparing for reliable downstream adoption.

## 4. Community Hot Topics

### 1) Azure Blob filesystem support in R
- PR: [#49553](https://github.com/apache/arrow/pull/49553) — **[R] Expose azure blob filesystem**

This is one of the clearest strategic roadmap items in the current queue. Arrow R already supports AWS and GCS, while Arrow C++ and PyArrow support Azure; the gap is now being closed for R users. The underlying need is clear: teams building analytical workflows increasingly expect **multi-cloud object store parity** across language bindings. This feature is especially relevant for lakehouse-style workflows, ETL, and data science pipelines using R in Azure-heavy enterprises.

### 2) Windows/macOS/Linux ODBC packaging for FlightRPC
- Issue: [#49538](https://github.com/apache/arrow/issues/49538) — **Change Windows ODBC to Static Linkage**
- PR: [#49575](https://github.com/apache/arrow/pull/49575) — **Remove libunwind dynamic linked library in macOS Intel CI**
- Issue: [#49595](https://github.com/apache/arrow/issues/49595) — **[ODBC] DEB Linux Installer**
- Issue: [#47877](https://github.com/apache/arrow/issues/47877) — **[ODBC] RPM Linux Installer**

These items together show a strong push toward **enterprise-grade packaging and deployability** for Arrow Flight SQL / ODBC-related components. The core technical need is not raw query performance, but **operational simplicity**: fewer signed DLLs on Windows, cleaner CI on macOS, and native installer support on Debian/RPM Linux distributions. This is a strong signal that the project is investing in making Arrow-based connectivity easier to adopt in managed desktop and server environments.

### 3) R release engineering and CRAN readiness
- Issue: [#49587](https://github.com/apache/arrow/issues/49587) — **CRAN packaging checklist for version 23.0.1.2**
- Issue: [#49591](https://github.com/apache/arrow/issues/49591) — **r-binary-packages crossbow job fails for CRAN patch releases**
- PR: [#49592](https://github.com/apache/arrow/pull/49592) — fix for the above
- Issue: [#49593](https://github.com/apache/arrow/issues/49593) — **Add libuv-dev to CI jobs**
- PR: [#49594](https://github.com/apache/arrow/pull/49594) — fix for the above
- PR: [#49589](https://github.com/apache/arrow/pull/49589) — **Verify CRAN release 23.0.1.2**

This cluster is the day’s strongest operational theme. The need here is reliable **binary packaging, patch release validation, and CI reproducibility** as external dependencies shift. It reflects Arrow’s position as infrastructure embedded in larger language ecosystems, where packaging friction can be as important as engine capabilities.

### 4) Python Parquet writer capabilities
- PR: [#49377](https://github.com/apache/arrow/pull/49377) — **[Python][Parquet] Add ability to write Bloom filters from pyarrow**
- Issue: [#30971](https://github.com/apache/arrow/issues/30971) — warning on incompatible Parquet type writes
- Issue: [#30967](https://github.com/apache/arrow/issues/30967) — timestamp compatibility with older HiveQL

This set reflects persistent demand for **Parquet interoperability and write-path controls**. Bloom filter support is particularly important for analytical storage tuning because it can improve selective query performance in downstream engines that consume Parquet metadata. The older issues show that users still care deeply about compatibility with legacy readers such as older Hive deployments.

## 5. Bugs & Stability

Ranked by likely user impact and technical severity:

### High severity

1. **Possible memory leak while iterating filtered dataset batches in PyArrow**
   - Issue: [#49474](https://github.com/apache/arrow/issues/49474)
   - Summary: User reports OOM conditions when iterating batches over a large hive-partitioned Parquet dataset in constrained HPC environments.
   - Why it matters: This is a serious issue if confirmed, because it affects long-running analytical scans and can break production batch workloads.
   - Fix PR: None linked in current snapshot.

2. **C++ toolchain/build break: `'span' file not found`**
   - Issue: [#49388](https://github.com/apache/arrow/issues/49388)
   - Related closed work: [#49492](https://github.com/apache/arrow/pull/49492)
   - Summary: After migration to `std::span`, at least one environment reports missing header/toolchain support.
   - Why it matters: Build portability regressions in core C++ can affect package builders, embedded users, and downstream language bindings.
   - Fix PR: No direct fix shown yet.

### Medium severity

3. **libc++ regression causing C++ test failure**
   - Issue: [#49586](https://github.com/apache/arrow/issues/49586)
   - Summary: `StructToStructSubset` failure appears due to behavior changes in `std::multimap` under libc++ 22.1.1, affecting MinGW Clang CI.
   - Why it matters: Primarily CI-facing today, but it may indicate latent assumptions in Arrow’s container/test logic under newer standard libraries.
   - Fix PR: None linked yet.

4. **R binary packaging job fails for CRAN patch releases**
   - Issue: [#49591](https://github.com/apache/arrow/issues/49591)
   - Fix PR: [#49592](https://github.com/apache/arrow/pull/49592)
   - Why it matters: Operationally important for shipping patch releases, though not an end-user runtime bug.

5. **R CI breakage due to external dependency change in `fs` / `libuv`**
   - Issue: [#49593](https://github.com/apache/arrow/issues/49593)
   - Fix PR: [#49594](https://github.com/apache/arrow/pull/49594)
   - Why it matters: Shows external ecosystem fragility; likely fast to resolve.

### Low severity / resolved

6. **R sanitizer failure**
   - Issue: [#49578](https://github.com/apache/arrow/issues/49578)
   - Fix PR: [#49581](https://github.com/apache/arrow/pull/49581)
   - Status: Closed.

7. **CRAN NOTE due to non-API R call**
   - Issue: [#49529](https://github.com/apache/arrow/issues/49529)
   - Fix PR: [#49530](https://github.com/apache/arrow/pull/49530)
   - Status: Closed.

## 6. Feature Requests & Roadmap Signals

### Strong near-term candidates

- [#49553](https://github.com/apache/arrow/pull/49553) — **Azure Blob filesystem in R**  
  This looks like a strong candidate for the next release line because the C++ and Python support already exist, reducing implementation risk.

- [#49377](https://github.com/apache/arrow/pull/49377) — **PyArrow Parquet Bloom filter writing**  
  This is a meaningful storage-engine-facing enhancement. If merged, it would improve Parquet file tuning for selective scans and would likely be highlighted in release notes.

- [#49527](https://github.com/apache/arrow/pull/49527) — **BufferedStats API for Parquet RowGroupWriter**  
  This is a lower-level but practically useful API for controlling row group sizing and write behavior. It has clear value for writers targeting optimized analytical layout.

- [#49535](https://github.com/apache/arrow/pull/49535) and [#49536](https://github.com/apache/arrow/pull/49536) — **new dplyr helper support in R**  
  These continue Arrow’s strategy of deepening compatibility with idiomatic analytical APIs in R, making Arrow more seamless as a query backend.

### Longer-term signals

- FlightRPC/UCX backlog:
  - [#31543](https://github.com/apache/arrow/issues/31543) — TSAN with gRPC/UCX tests
  - [#31536](https://github.com/apache/arrow/issues/31536) — improve concurrent call implementation in UCX client
  - [#31535](https://github.com/apache/arrow/issues/31535) — pipeline memory allocation/registration
  - [#31534](https://github.com/apache/arrow/issues/31534) — shutdown with deadline for UCX
  - [#31533](https://github.com/apache/arrow/issues/31533) — UCX server should shed load

These older FlightRPC items were updated but remain open, suggesting maintainers still consider the UCX transport roadmap relevant. They point toward future work on **high-performance transport scalability, load shedding, concurrency, and shutdown semantics**—all important for distributed analytical services, but likely not immediate next-release material.

## 7. User Feedback Summary

A few recurring user needs stand out from today’s issue and PR traffic:

- **Legacy interoperability still matters.**
  - [#30967](https://github.com/apache/arrow/issues/30967) shows users still need Parquet timestamp compatibility for older HiveQL readers.
  - [#30971](https://github.com/apache/arrow/issues/30971) highlights confusion when Arrow silently coerces unsupported Parquet logical types for older format versions.

- **Memory behavior in real analytics workloads is scrutinized closely.**
  - [#49474](https://github.com/apache/arrow/issues/49474) comes from an HPC user scanning large hive-partitioned datasets under strict memory limits, a classic Arrow production use case.

- **Cloud storage parity across languages is expected.**
  - [#49553](https://github.com/apache/arrow/pull/49553) reflects demand from R users to access Azure Blob Storage as naturally as S3 and GCS.

- **Packaging and installation friction remains a major adoption factor.**
  - The ODBC packaging items ([#49538](https://github.com/apache/arrow/issues/49538), [#49595](https://github.com/apache/arrow/issues/49595), [#47877](https://github.com/apache/arrow/issues/47877)) and R release engineering items ([#49587](https://github.com/apache/arrow/issues/49587), [#49591](https://github.com/apache/arrow/issues/49591), [#49593](https://github.com/apache/arrow/issues/49593)) show that users and maintainers alike care deeply about deployability, not just features.

Overall, user feedback today is less about dissatisfaction with Arrow’s analytical model and more about **operational smoothness, compatibility, and correctness at ecosystem boundaries**.

## 8. Backlog Watch

These older items appear important and may need maintainer attention despite recent updates:

- [#31543](https://github.com/apache/arrow/issues/31543) — **[FlightRPC] Investigate TSAN with gRPC/UCX tests**  
  Important for validating concurrency correctness in high-performance transport code.

- [#31536](https://github.com/apache/arrow/issues/31536) — **Improve concurrent call implementation in UCX client**  
  A meaningful scalability issue for Flight over UCX.

- [#31535](https://github.com/apache/arrow/issues/31535) — **Pipeline memory allocation/registration**  
  Relevant to reducing latency/blocking in UCX transport internals.

- [#31534](https://github.com/apache/arrow/issues/31534) — **Implement shutdown with deadline for UCX**
  Important for production service behavior and graceful teardown.

- [#31533](https://github.com/apache/arrow/issues/31533) — **UCX server should be able to shed load**
  Operationally significant for preventing queue buildup under pressure.

- [#31538](https://github.com/apache/arrow/issues/31538) — **[Python][Docs] Document ParquetWriteOptions class**
  A comparatively small item, but documentation gaps around write options often translate into misuse of file-format tuning features.

- [#31541](https://github.com/apache/arrow/issues/31541) — **[R][Python] Convert python dataset to R dataset**
  Cross-language dataset handoff remains a useful interoperability problem, especially as mixed-language workflows become common.

- [#48539](https://github.com/apache/arrow/pull/48539) — **[Python][CI] Build PyArrow on Windows ARM64**
  This is a strategically important platform-expansion PR that may deserve renewed review attention as Windows ARM adoption grows.

### Backlog health note

A number of long-lived issues updated today are marked **stale-warning**, suggesting some of the activity may be automation-driven rather than substantive progress. The most notable area where this matters is the **FlightRPC UCX backlog**, where several technically important items remain open for years. Those issues likely need prioritization decisions: either commit to the transport roadmap or narrow scope to avoid lingering ambiguity.

## Overall Health Assessment

Apache Arrow looks healthy and actively maintained. Today’s work shows a project investing heavily in **ecosystem reliability**—R packaging, CI repair, modern C++ compatibility, and deployable ODBC packaging—while still progressing on **storage and analytics features** like Parquet Bloom filters, row group writer APIs, and cloud filesystem support. The main risks are a potentially serious **PyArrow dataset memory leak** and some **toolchain portability regressions** following C++ modernization. If those are addressed promptly, the near-term outlook remains strong.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*