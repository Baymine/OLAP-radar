# Apache Doris Ecosystem Digest 2026-04-03

> Issues: 6 | PRs: 142 | Projects covered: 10 | Generated: 2026-04-03 01:27 UTC

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

# Apache Doris Project Digest — 2026-04-03

## 1) Today's Overview

Apache Doris remained highly active over the last 24 hours, with **142 pull requests updated** and **6 issues updated**, indicating strong ongoing development velocity. There were **no new releases**, but engineering activity was concentrated around **query execution correctness, load-path stability, optimizer enhancements, compaction observability, authentication, and external catalog/connectivity work**. Compared with issue traffic, PR traffic is much heavier, which suggests the project is currently in an implementation and integration-heavy phase rather than a user-support-heavy one. Overall project health looks solid, with multiple reviewed fixes flowing into maintenance branches and active discussion around the **2026 roadmap**, especially AI/hybrid search and performance.

---

## 2) Releases

No new releases were published in the last 24 hours.

---

## 3) Project Progress

### Merged/closed PRs today

Although today did not include a release cut, several merged/closed PRs indicate meaningful progress in reliability, authentication, and regression infrastructure.

- **Fix stream load deadlock / hang in VNodeChannel close_wait**
  - Main PR: [#58024](https://github.com/apache/doris/pull/58024)
  - Backport: [#62030](https://github.com/apache/doris/pull/62030)
  - This is a notable stability fix in the **data ingestion path**. It addresses a close-wait hang during stream load when single-replica write execution hits a `slave node=nullptr` path and no callback/cancel arrives. This improves robustness for high-ingest deployments and is important for operators seeing stuck load tasks.

- **OIDC authentication and MySQL login bridge integrated**
  - [#61819](https://github.com/apache/doris/pull/61819)
  - This is a strategically important feature for **enterprise SQL access and security integration**. It adds OIDC-based authentication into FE and bridges this through the MySQL protocol path, plus role mapping support. This advances Doris’ compatibility with enterprise identity stacks and should reduce friction in managed deployments.

- **Regression pipeline improvements**
  - Hive bootstrap optimization: [#61852](https://github.com/apache/doris/pull/61852)
  - External regression stage timing summary: [#61869](https://github.com/apache/doris/pull/61869)
  - These changes improve CI efficiency and test observability, especially for external ecosystem validation. They are not user-facing features, but they support faster, more reliable release engineering.

- **Older stale PRs closed**
  - [#56249](https://github.com/apache/doris/pull/56249), [#56400](https://github.com/apache/doris/pull/56400), [#56409](https://github.com/apache/doris/pull/56409)
  - These closures look more like backlog cleanup than fresh product progress, but they help reduce maintenance noise.

### Important open progress signals

A number of active PRs suggest near-term advances in core engine behavior:

- **Outer join reorder support in dphyper optimizer**
  - [#61146](https://github.com/apache/doris/pull/61146)
  - Important for **query planning quality** on complex SQL workloads.

- **Multi-mode CBO CTE inline strategy**
  - [#60601](https://github.com/apache/doris/pull/60601)
  - Indicates continued optimizer sophistication and finer-grained planning controls.

- **Compaction observability with system table + HTTP API**
  - [#61696](https://github.com/apache/doris/pull/61696)
  - Strong operational value for storage debugging and maintenance.

- **Offset-only read optimization for complex types**
  - [#61888](https://github.com/apache/doris/pull/61888)
  - Suggests storage-engine level work to reduce IO and improve scan efficiency for string/array/map-heavy schemas.

---

## 4) Community Hot Topics

### 1. Doris Roadmap 2026
- Issue: [#60036](https://github.com/apache/doris/issues/60036)
- Most engagement in the current issue set: **14 comments, 16 👍**
- Topic summary: the roadmap centers on **AI & Hybrid Search**, improved query performance, and storage efficiency.
- Analysis: this is the clearest high-level signal of where Doris is heading. The emphasis on hybrid search implies Doris wants to strengthen its position beyond classic OLAP into **AI-adjacent retrieval workloads**, likely combining structured analytics, vector retrieval, and index acceleration.

### 2. Outer join reorder support in optimizer
- PR: [#61146](https://github.com/apache/doris/pull/61146)
- Even without visible comment counts here, it stands out as a significant optimizer capability.
- Analysis: users increasingly need Doris to handle **more complex BI and ETL SQL plans** with better join-ordering intelligence. This aligns with broader demand for lower manual tuning overhead.

### 3. Enterprise authentication and driver modernization
- PRs:
  - OIDC integration: [#61819](https://github.com/apache/doris/pull/61819)
  - Connector/J upgrade in regression framework: [#62045](https://github.com/apache/doris/pull/62045)
- Analysis: there is rising need for **modern authentication** and **client/driver compatibility**, especially as enterprise environments standardize on OIDC and newer JDBC stacks.

### 4. Storage/runtime observability
- PR: [#61696](https://github.com/apache/doris/pull/61696)
- Analysis: exposing compaction lifecycle data via SQL system tables and HTTP APIs reflects a practical operational need. As clusters grow, users need built-in introspection rather than log scraping.

### 5. Extensibility and policy control in FE
- PRs:
  - ClusterGuard SPI: [#62031](https://github.com/apache/doris/pull/62031)
  - FS SPI branch work: [#62023](https://github.com/apache/doris/pull/62023)
- Analysis: maintainers appear to be opening more extension points in FE and storage integration layers. This points to a push toward **pluggability** for enterprise and cloud scenarios.

---

## 5) Bugs & Stability

### Highest severity

#### 1. BE may falsely report publish success before local close completes
- Issue: [#62057](https://github.com/apache/doris/issues/62057)
- Severity: **High**
- Why it matters: if `PUBLISH_VERSION` arrives before local close finishes and BE returns an empty success, this can impact **transaction visibility correctness** and state consistency in the write path.
- Fix PR known today: none explicitly linked in the provided data.
- Assessment: this is the most serious newly reported issue because it touches correctness in version publishing.

#### 2. Unexpected exception during split processing can crash BE
- Fix PR: [#62044](https://github.com/apache/doris/pull/62044)
- Severity: **High**
- Why it matters: uncaught exceptions in `split->process()` could terminate worker threads and crash BE.
- Status: active fix PR, already reviewed/approved for maintenance branches.
- Assessment: good signal that maintainers are reacting quickly to crash-class issues.

#### 3. Pipeline shared hash table signaling race
- PR: [#62056](https://github.com/apache/doris/pull/62056)
- Severity: **High**
- Why it matters: a race between task termination and wake-up can lead to downstream tasks observing missing hash table state and failing incorrectly.
- Assessment: this is a **concurrency correctness** issue in execution engine internals; important for stability under pipelined/broadcast join workloads.

### Medium severity

#### 4. SQL Server JDBC Catalog cannot list `dbo` schema with mssql-jdbc 13.x
- Issue: [#62046](https://github.com/apache/doris/issues/62046)
- Severity: **Medium**
- Impact: breaks metadata discovery in a common external catalog scenario, reducing interoperability with SQL Server.
- Related signal: regression framework JDBC dependency upgrade in [#62045](https://github.com/apache/doris/pull/62045), though not explicitly a fix for this issue.
- Assessment: meaningful for federated query users and catalog onboarding.

#### 5. Broker Load import failure with BE warnings
- Issue: [#58926](https://github.com/apache/doris/issues/58926)
- Severity: **Medium**
- Impact: user-facing import instability; root cause not yet evident from the summary.
- Fix PR known today: none in provided data.

#### 6. Edit log roll check missing in bulk write path
- PR: [#62060](https://github.com/apache/doris/pull/62060)
- Severity: **Medium**
- Impact: journal growth without rolling in bulk operations could create operational risk and recovery inefficiency.
- Assessment: not immediately user-visible, but important for FE durability and long-running clusters.

#### 7. Bucket shuffle exchange incorrectly marked serial in pooling mode
- PR: [#62054](https://github.com/apache/doris/pull/62054)
- Severity: **Medium**
- Impact: execution parallelism can be constrained incorrectly, potentially harming performance and plan behavior.

#### 8. Runtime filter `IN_LIST` predicate lost in scope-range key filtering
- PR: [#62027](https://github.com/apache/doris/pull/62027)
- Severity: **Medium**
- Impact: query filtering effectiveness and possibly correctness/performance degradation in scan pushdown logic.

### Lower severity / maintenance

- Variant subcolumns preserved after row-store partial update: [#62067](https://github.com/apache/doris/pull/62067)
- Delete predicate normalization on read path: [#62052](https://github.com/apache/doris/pull/62052)
- Compile-time reduction for heavy aggregate reader unit: [#62047](https://github.com/apache/doris/pull/62047)

---

## 6) Feature Requests & Roadmap Signals

### Clear roadmap signal: AI + hybrid search
- Roadmap issue: [#60036](https://github.com/apache/doris/issues/60036)
- This remains the strongest indicator for next major-version direction. Expect continued investment in:
  - vector/hybrid retrieval
  - indexing improvements
  - query acceleration for mixed analytical/search workloads

### Likely near-term features

#### 1. Amazon Kinesis support for Routine Load
- PR: [#61325](https://github.com/apache/doris/pull/61325)
- Prediction: strong candidate for an upcoming minor release if review completes, because it expands Doris’ streaming ingestion connector portfolio and fits cloud-native demand.

#### 2. Cluster-level policy enforcement SPI
- PR: [#62031](https://github.com/apache/doris/pull/62031)
- Prediction: likely to land in a future 4.1.x-oriented release for enterprise extensibility, especially where deployments need custom policy hooks.

#### 3. Binlog metadata module for row type
- PR: [#62058](https://github.com/apache/doris/pull/62058)
- Prediction: if completed, this could support richer CDC/binlog scenarios and better downstream integration.

#### 4. Compaction tracking via system table/API
- PR: [#61696](https://github.com/apache/doris/pull/61696)
- Prediction: likely to be included soon because it is operationally valuable and complements existing storage management tooling.

#### 5. Optimizer improvements
- PRs:
  - Outer join reorder: [#61146](https://github.com/apache/doris/pull/61146)
  - Multi-mode CTE inline strategy: [#60601](https://github.com/apache/doris/pull/60601)
- Prediction: these are likely to appear incrementally in upcoming 4.1.x development snapshots or subsequent maintenance trains if deemed low-risk enough.

---

## 7) User Feedback Summary

Today’s issue and PR activity reflects several concrete user pain points:

- **Reliability of data loading remains a sensitive area**
  - Broker Load failure report: [#58926](https://github.com/apache/doris/issues/58926)
  - Stream load close-wait deadlock fix: [#58024](https://github.com/apache/doris/pull/58024)
  - Users continue to care deeply about ingestion robustness, especially under edge cases and distributed failure conditions.

- **External ecosystem compatibility matters**
  - SQL Server JDBC Catalog issue: [#62046](https://github.com/apache/doris/issues/62046)
  - JDBC driver modernization: [#62045](https://github.com/apache/doris/pull/62045)
  - OIDC integration: [#61819](https://github.com/apache/doris/pull/61819)
  - Feedback suggests Doris is increasingly used in heterogeneous environments where **identity integration and external catalog compatibility** are essential, not optional.

- **Users want fewer correctness surprises in concurrent execution paths**
  - Publish-version timing issue: [#62057](https://github.com/apache/doris/issues/62057)
  - Pipeline shared hash table race: [#62056](https://github.com/apache/doris/pull/62056)
  - Split processing crash protection: [#62044](https://github.com/apache/doris/pull/62044)
  - This points to pressure from production-scale workloads stressing BE concurrency and transaction sequencing.

- **Operators need better observability**
  - Compaction tracker: [#61696](https://github.com/apache/doris/pull/61696)
  - Cloud tablet meta sync after alter: [#61585](https://github.com/apache/doris/pull/61585)
  - The project is responding with more introspection and active synchronization mechanisms.

Overall, user sentiment inferred from the data is less about raw SQL syntax requests today and more about **production hardening, connector support, and operational transparency**.

---

## 8) Backlog Watch

These items appear important and deserving of maintainer attention due to age, impact, or strategic value:

### Important open issues

- **Data import via Broker Load failed**
  - [#58926](https://github.com/apache/doris/issues/58926)
  - Open since 2025-12-11 with limited engagement. Load failures are operationally important and usually deserve triage, reproduction guidance, or log collection requests.

- **Doris Roadmap 2026**
  - [#60036](https://github.com/apache/doris/issues/60036)
  - Not a backlog risk in the normal sense, but it is strategically central and should continue receiving maintainer updates to guide contributors.

### Important open PRs needing continued review

- **Outer join reorder in dphyper**
  - [#61146](https://github.com/apache/doris/pull/61146)
  - High-value optimizer work; likely non-trivial to validate.

- **Amazon Kinesis Routine Load**
  - [#61325](https://github.com/apache/doris/pull/61325)
  - Valuable connector addition with clear user impact.

- **CompactionTaskTracker**
  - [#61696](https://github.com/apache/doris/pull/61696)
  - Strong operational feature; worth prioritizing given maintainability benefits.

- **Multi-mode CBO CTE inline strategy**
  - [#60601](https://github.com/apache/doris/pull/60601)
  - Significant planner enhancement; may need benchmark evidence and rollout caution.

- **Data lake reader refactoring**
  - [#61783](https://github.com/apache/doris/pull/61783)
  - Broad refactors in multi-catalog readers can carry integration risk and benefit from careful review.

### Closed as stale but potentially still relevant

- UDF ipv4/ipv6 bug report: [#56229](https://github.com/apache/doris/issues/56229)
- Kettle stream load plugin bug: [#56355](https://github.com/apache/doris/issues/56355)

These were closed as stale rather than clearly resolved. If affected users are still active, similar issues may reappear; both involve ecosystem integration where regressions are easy to miss.

---

## Overall Health Assessment

Apache Doris shows **strong engineering momentum** and healthy branch maintenance activity. The project is actively improving **execution stability, authentication, optimizer intelligence, and observability**, while roadmap discussion indicates continued ambition in **AI and hybrid search**. The main caution area is that several newly active items touch **BE concurrency, transaction publish correctness, and ingestion reliability**, which are high-impact domains and should stay under close maintainer attention.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-04-03

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains extremely active, with most projects simultaneously pushing on three fronts: **correctness hardening**, **lakehouse/connectivity expansion**, and **performance/optimizer sophistication**. Across engines, community attention is shifting from pure benchmark speed toward **production reliability, interoperability, identity/security integration, and operational observability**. Apache Doris, ClickHouse, DuckDB, and StarRocks show the highest visible day-to-day implementation velocity, while Iceberg and Delta Lake continue to shape the broader storage/control-plane layer for multi-engine data platforms. Overall, the ecosystem is healthy, but the common risk theme is that rapid feature velocity is occurring alongside a meaningful stream of **silent correctness, concurrency, and edge-case integration bugs**.

---

## 2. Activity Comparison

### Daily activity snapshot

| Project | Issues Updated | PRs Updated | Release Today | Health Score* | Short Read |
|---|---:|---:|---|---:|---|
| **Apache Doris** | 6 | 142 | No | **8.8/10** | Strong implementation velocity; focus on execution correctness, ingestion stability, auth, observability |
| **ClickHouse** | 54 | 320 | No | **8.6/10** | Highest raw activity; very strong roadmap momentum but noisier correctness surface |
| **DuckDB** | 17 | 56 | No | **8.4/10** | Healthy and responsive; absorbing 1.5.x regressions and connector/runtime edge cases |
| **StarRocks** | 9 | 115 | No | **8.5/10** | High PR throughput; strong 4.1 hardening and lakehouse integration work |
| **Apache Iceberg** | 6 | 39 | No | **8.2/10** | Good strategic progress; more spec/platform expansion than release stabilization |
| **Delta Lake** | 2 | 32 | No | **8.1/10** | Engineering-heavy sprint around Kernel, CDC streaming, DSv2 modernization |
| **Databend** | 5 | 14 | No | **7.9/10** | Moderate activity, good responsiveness, still maturing distributed execution edges |
| **Velox** | 6 | 50 | No | **8.0/10** | Active core engine work; CI/reliability and correctness fuzzing remain central |
| **Apache Gluten** | 11 | 21 | No | **7.8/10** | Productive but backend-compatibility-heavy; timestamp/timezone and Velox dependency remain key |
| **Apache Arrow** | 33 | 20 | No | **8.0/10** | Stable maintenance-heavy cycle; packaging, Parquet correctness, interoperability dominate |

\*Health score is a comparative qualitative estimate based on visible activity, responsiveness, stability profile, and strategic clarity in the provided digests.

### Interpretation
- **Highest activity:** ClickHouse, Doris, StarRocks.
- **Most implementation-heavy vs support-heavy:** Doris and StarRocks.
- **Most platform/spec-centric:** Iceberg, Delta Lake, Arrow.
- **Most correctness-sensitive embedded engine:** DuckDB.
- **Most infrastructure-layer engines:** Velox, Gluten, Arrow.

---

## 3. Apache Doris's Position

### Where Doris is strong versus peers
Apache Doris is in a strong position as a **full-stack analytical database** combining a mature MPP SQL engine, integrated storage, and increasing enterprise features. Compared with peers, Doris stands out today in:
- **Enterprise authentication progress**, especially OIDC integrated through the MySQL protocol path
- **Operational observability**, e.g. compaction tracking via system table and HTTP API
- **Ingestion-path hardening**, with notable attention to stream load deadlocks and load reliability
- **Optimizer evolution**, including outer join reorder and CTE strategy work
- **Clear roadmap expansion** toward **AI/hybrid search**, which broadens its positioning beyond classic warehouse analytics

### Technical approach differences vs peers
- **Vs ClickHouse:** Doris is more conventionally positioned as an MPP SQL warehouse with strong transactional/load-path semantics and enterprise FE/BE architecture, while ClickHouse remains more aggressive on storage/index innovation and high-throughput scan analytics.
- **Vs DuckDB:** Doris is cluster-native and service-oriented; DuckDB is embedded and single-node-first.
- **Vs StarRocks:** Doris and StarRocks are the closest peers. Doris appears slightly more active around **auth, extensibility SPI, and observability**, while StarRocks shows stronger current emphasis on **4.1 hardening and lakehouse metadata correctness**.
- **Vs Iceberg/Delta:** Doris is an execution engine/database, whereas Iceberg and Delta are primarily table-format and metadata ecosystem layers.
- **Vs Velox/Gluten/Arrow:** Doris is a complete database product, not an execution/runtime library.

### Community size comparison
By daily visible throughput, Doris is among the top-tier projects:
- **Below ClickHouse** in raw issue/PR volume
- **Above or roughly comparable to StarRocks** in active implementation intensity
- **Clearly above DuckDB, Iceberg, Delta, Databend, Velox, Gluten, Arrow** in this snapshot for PR update count

That suggests Doris has a **large and actively executing contributor base**, especially on core product implementation rather than only ecosystem discussion.

---

## 4. Shared Technical Focus Areas

Several requirements are emerging across multiple engines.

### 1) Correctness under optimizer and execution edge cases
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Databend, Velox  
**Needs observed:**
- wrong-result risks in joins, correlated subqueries, runtime filters, constant folding
- race conditions in pipelined/shared-state execution
- hash-table signaling, cancellation, spill, or task lifecycle correctness
- statistics edge cases distorting plan quality

**Why it matters:** users increasingly tolerate crashes less than silent wrong answers, and many current reports are in exactly that category.

### 2) Lakehouse and external catalog interoperability
**Engines:** Doris, ClickHouse, StarRocks, Iceberg, Delta Lake, Arrow  
**Needs observed:**
- better JDBC/catalog compatibility
- SQL Server / Hive / Iceberg / Delta / ORC / Parquet / object storage edge-case support
- metadata fidelity across engines and APIs
- larger metastore/catalog scalability

**Why it matters:** heterogeneous environments are now standard, not exceptional.

### 3) Streaming ingestion and CDC semantics
**Engines:** Doris, Iceberg, Delta Lake, StarRocks, Databend  
**Needs observed:**
- robust load paths and failure recovery
- Kafka Connect upsert/delete support
- CDC streaming offset correctness
- Routine Load/Kinesis-style connector expansion
- transaction publish and visibility correctness

**Why it matters:** batch-only analytics is no longer enough; mutable and streaming pipelines are core adoption drivers.

### 4) Security, auth, and compliance
**Engines:** Doris, StarRocks, Arrow, Delta Lake  
**Needs observed:**
- OIDC integration
- credential redaction
- FIPS/compliance requests
- secure packaging/signing and enterprise connectivity

**Why it matters:** enterprise adoption increasingly depends on integration with identity, audit, and regulated environments.

### 5) Observability and operability
**Engines:** Doris, StarRocks, Delta Lake, Velox, Gluten, Arrow  
**Needs observed:**
- compaction introspection
- commit metrics
- better logs and warning surfacing
- CI/test reporting
- build provenance and runtime diagnostics

**Why it matters:** operators need built-in introspection rather than log archaeology.

### 6) SQL compatibility and migration ergonomics
**Engines:** ClickHouse, DuckDB, Doris, StarRocks, Velox/Gluten, Delta Lake  
**Needs observed:**
- standard syntax additions
- DML-in-CTE, transaction syntax compatibility
- modern driver/protocol support
- COMMENT/DDL metadata fidelity
- MySQL/Postgres/Presto/Spark compatibility improvements

**Why it matters:** tool and workload portability is becoming a core competitive dimension.

---

## 5. Differentiation Analysis

### Storage format model
- **Integrated database storage engines:** Doris, ClickHouse, DuckDB, StarRocks, Databend
- **Open table/storage format layers:** Iceberg, Delta Lake
- **Execution/runtime libraries:** Velox, Gluten
- **Columnar data interoperability layer:** Arrow

This is the most important segmentation in the ecosystem. Not all “analytical engines” compete directly.

### Query engine design
- **Distributed MPP databases:** Doris, StarRocks, ClickHouse, Databend
- **Embedded analytical engine:** DuckDB
- **Execution substrate for other systems:** Velox, Gluten
- **Metadata/control-plane centric:** Iceberg, Delta Lake

### Target workloads
- **Warehouse + BI + operational analytics:** Doris, StarRocks
- **Ultra-fast scan analytics / observability / semi-structured high-ingest:** ClickHouse
- **Embedded analytics, local ETL, notebook/data science:** DuckDB
- **Lakehouse interoperability and multi-engine governance:** Iceberg, Delta Lake
- **Accelerated execution for upstream engines:** Velox, Gluten
- **Data interchange and columnar integration:** Arrow

### SQL compatibility style
- **Enterprise SQL warehouse style:** Doris, StarRocks
- **High-performance analytical SQL with growing standards support:** ClickHouse
- **Portable SQL ergonomics and app-facing compatibility:** DuckDB
- **Format/API semantics more than full SQL engine semantics:** Iceberg, Delta Lake
- **Downstream-engine compatibility focus:** Velox, Gluten

### Current product emphasis
- **Doris:** reliability, auth, observability, optimizer, hybrid search roadmap
- **ClickHouse:** indexing, analyzer/planner improvements, text/search, protocol breadth
- **DuckDB:** correctness, connectors, storage maintenance, SQL compatibility
- **StarRocks:** 4.1 hardening, lakehouse correctness, secure operations
- **Iceberg:** REST/catalog evolution, Spark/Flink compatibility, CDC semantics
- **Delta Lake:** Kernel modularization, CDC streaming, DSv2 modernization
- **Databend:** joins, flashback correctness, ingestion compatibility

---

## 6. Community Momentum & Maturity

### Activity tiers

**Tier 1: Very high momentum**
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

These projects show the strongest raw engineering throughput and broad surface-area work. They are in active expansion while also absorbing production bug flow.

**Tier 2: High but more focused**
- **DuckDB**
- **Iceberg**
- **Delta Lake**
- **Velox**
- **Arrow**

These are mature projects with sustained activity, but more concentrated by layer: embedded engine, table format, execution runtime, or interoperability stack.

**Tier 3: Focused growth / narrower contributor surface**
- **Databend**
- **Gluten**

These are active and relevant, but with smaller visible contributor velocity or a more specialized problem scope.

### Rapidly iterating vs stabilizing
**Rapidly iterating**
- Doris
- ClickHouse
- StarRocks
- DuckDB
- Delta Lake

**More platform-maturing / specification-expanding**
- Iceberg
- Arrow
- Velox

**Hardening around integration complexity**
- Gluten
- Databend

### Maturity read
- **Most mature broad database communities:** ClickHouse, Doris, DuckDB
- **Most enterprise-warehouse competitive pair:** Doris, StarRocks
- **Most mature lakehouse control-plane projects:** Iceberg, Delta Lake
- **Most infrastructure-mature substrate:** Arrow, Velox

---

## 7. Trend Signals

### 1) Silent correctness is now the highest-value engineering problem
Across Doris, ClickHouse, DuckDB, Databend, and Velox, the sharpest user concern is not syntax gaps but **wrong answers, race conditions, and state inconsistencies**. For architects, this means benchmark speed should be weighed against evidence of correctness hardening and regression discipline.

### 2) Enterprise adoption now depends on integration quality
OIDC in Doris, FIPS requests in StarRocks, Arrow Flight SQL in ClickHouse, DSv2/Kernel work in Delta, and REST catalog evolution in Iceberg all point to a common trend: engines win when they fit modern platform standards, not just when they query fast.

### 3) Lakehouse interoperability is no longer optional
Even integrated databases are being judged on how well they interact with Hive, Iceberg, Delta, Parquet, ORC, JDBC catalogs, and object storage. Data engineers should expect successful platforms to be **multi-engine participants**, not isolated systems.

### 4) Observability is becoming a first-class product feature
Doris compaction tracking, Delta commit metrics, StarRocks logging/redaction work, and Velox CI/reporting improvements all show a shift toward better introspection. This matters because operational cost and debuggability are now part of engine selection.

### 5) Streaming + CDC is a common roadmap direction
Doris ingestion hardening, Iceberg Kafka Connect upserts, Delta CDC streaming, and related connector work indicate strong demand for **hybrid batch/stream analytical architectures**. Architects planning modern data platforms should prioritize engines with credible CDC and incremental-processing roadmaps.

### 6) SQL compatibility is increasingly pragmatic, not ideological
Projects are selectively adopting standard syntax, compatibility shims, and DDL fidelity to reduce migration friction. For practitioners, this means migration cost is falling—but semantic edge cases still require careful validation.

---

## Bottom Line

Apache Doris is currently in the **top tier of open-source analytical engine momentum**, with a notably balanced profile across **core reliability, enterprise readiness, observability, optimizer work, and future-facing hybrid search direction**. Its closest direct competitive comparison remains **StarRocks**, while **ClickHouse** remains the largest high-velocity alternative with a different design center and a noisier correctness surface. For technical decision-makers, the strongest ecosystem-wide lesson today is that engine selection should be based not only on performance and features, but also on **correctness track record, interoperability depth, and production operability**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-04-03

## 1. Today's Overview

ClickHouse remained highly active over the last 24 hours, with **54 issues updated** and **320 pull requests updated**, indicating a very busy development and triage cycle. Maintainers and contributors are simultaneously pushing forward on major feature work—especially around indexing, SQL compatibility, caching, and connectivity—while also closing a steady stream of correctness, regression, and CI-related problems. There were **no new releases** today, so activity is concentrated in mainline development and stabilization rather than packaged delivery. Overall, project health looks **strong but noisy**: feature velocity is high, yet multiple reports point to ongoing pressure in query correctness, analyzer behavior, storage edge cases, and CI reliability.

## 3. Project Progress

With **125 PRs merged/closed** in the last 24h, the project appears to be making tangible progress across engine internals, SQL surface area, and infrastructure.

### Query engine and SQL behavior
Several closed items suggest meaningful movement on query planning and semantics:

- **Analyzer constant-folding regression fixed/closed**: issue [#101659](https://github.com/ClickHouse/ClickHouse/pull/101659) described the new analyzer reading unnecessary columns after constant folding, causing a reported **5x slowdown versus the old analyzer**. Its closure is a positive sign that analyzer optimization regressions are being addressed quickly.
- **Window/predicate pushdown behavior**: long-standing issue [#51203](https://github.com/ClickHouse/ClickHouse/issues/51203), about views with window functions not respecting predicate pushdown, was closed. That suggests progress on planner optimization for analytical SQL patterns.
- **Window function correctness regression**: issue [#100782](https://github.com/ClickHouse/ClickHouse/issues/100782), where `sign()` returned incorrect results when wrapping nullable window expressions in 26.2, was also closed—important for SQL correctness.

### Storage and execution optimizations in flight
Open PRs show the team investing in engine-level performance features:

- **LOOKUP INDEX for MergeTree**: PR [#101401](https://github.com/ClickHouse/ClickHouse/pull/101401) adds table-wide lookup index support for MergeTree, including `Set` and `Join`-like index behavior. This is a strong signal toward faster repeated key-value style access patterns on analytical storage.
- **Partial aggregate cache**: PR [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757) introduces a **part-level aggregate cache** for MergeTree `GROUP BY`, which could materially improve repeated aggregation workloads.
- **Sharded aggregation for high cardinality data**: PR [#99581](https://github.com/ClickHouse/ClickHouse/pull/99581) targets one of ClickHouse’s classic hard problems—efficient high-cardinality aggregation.
- **Lazy read/top-K with ALIAS columns**: PR [#96487](https://github.com/ClickHouse/ClickHouse/pull/96487) improves MergeTree read optimization for `ORDER BY ... LIMIT` queries involving `ALIAS` columns.
- **Unused column removal by position**: PR [#100586](https://github.com/ClickHouse/ClickHouse/pull/100586) suggests optimizer work on projection/column pruning robustness.

### SQL compatibility and ecosystem support
A notable cluster of PRs expands compatibility with broader SQL and data ecosystems:

- **Arrow Flight SQL support**: PR [#91170](https://github.com/ClickHouse/ClickHouse/pull/91170) continues moving toward a more interoperable client/protocol story.
- **SQL-standard compound INTERVAL literals**: PR [#100453](https://github.com/ClickHouse/ClickHouse/pull/100453) advances standard SQL interval syntax.
- **SQL standard `OVERLAY` syntax**: PR [#101681](https://github.com/ClickHouse/ClickHouse/pull/101681) adds parser-level support for standard keyword syntax around an existing function.
- **Experimental phrase search in text index**: PR [#101677](https://github.com/ClickHouse/ClickHouse/pull/101677) expands text indexing toward richer search semantics.

### CI and operational hardening
A large share of visible work is improving developer velocity and operational safety:

- **CI diff/test selection fix**: PR [#101553](https://github.com/ClickHouse/ClickHouse/pull/101553) fixes a silent issue where unauthenticated `gh pr diff` caused empty diff detection and missed coverage-driven test selection.
- **Fix orphaned shell test processes**: PR [#101636](https://github.com/ClickHouse/ClickHouse/pull/101636) addresses test process cleanup.
- **ResizeProcessor pipeline-stuck fix**: PR [#98340](https://github.com/ClickHouse/ClickHouse/pull/98340) targets a `LOGICAL_ERROR` in processor scheduling.
- **Shutdown deadlock prevention**: PR [#101680](https://github.com/ClickHouse/ClickHouse/pull/101680) adds timeout protection in object-storage blob removal.
- **Security/runtime base refresh**: closed PR [#101678](https://github.com/ClickHouse/ClickHouse/pull/101678) upgrades distroless images from Debian 12 to 13, reducing reachable CVEs.

## 4. Community Hot Topics

### 1) CI crash: double deletion in MergeTree compact part handling
- Issue: [#99799](https://github.com/ClickHouse/ClickHouse/issues/99799)
- Topic: `Double deletion of MergeTreeDataPartCompact in multi_index`
- Why it matters: This is the most-commented active item and points to a potentially serious lifecycle/memory ownership bug in MergeTree storage internals. Even though it is currently tagged as a CI crash, bugs in part ownership and deletion paths are often important because they can indicate latent production safety risks under specific feature combinations.

### 2) Memory leak after moving system time backward
- Issue: [#93095](https://github.com/ClickHouse/ClickHouse/issues/93095)
- Why it matters: This long-running issue reflects user concern about daemon robustness under non-ideal infrastructure conditions. It suggests technical demand for stronger monotonic-time assumptions or safer timer/cache cleanup paths when wall-clock time shifts.

### 3) Data loss after DELETE + re-INSERT on ReplicatedMergeTree
- Issue: [#101337](https://github.com/ClickHouse/ClickHouse/issues/101337)
- Status: closed
- Why it matters: Even though closed, it was one of the hottest discussions because it touches a core user expectation: after deleting rows, reinserting identical data should not be silently deduplicated away. The underlying need is clearer semantics between mutation history and replicated block deduplication metadata.

### 4) Projection index support for ARRAY JOIN
- Issue: [#98953](https://github.com/ClickHouse/ClickHouse/issues/98953)
- Why it matters: This feature request comes from observability-style schemas using maps/labels and many-to-one mappings. It signals demand for projection/indexing features that better support semi-structured analytics workloads, not just flat warehouse schemas.

### 5) URL engine usability and schema expansion
- Issue: [#59617](https://github.com/ClickHouse/ClickHouse/issues/59617)
- Why it matters: Despite low comment volume, it was updated today and is strategically important. Support for relative URLs and broader schema handling (`file`, `s3`, etc.) points to persistent user demand for more uniform ingestion ergonomics across local and remote file-like engines.

### 6) Major feature PRs drawing attention
- PR: [#101401](https://github.com/ClickHouse/ClickHouse/pull/101401) — LOOKUP INDEX for MergeTree  
- PR: [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757) — Partial aggregate cache  
- PR: [#91170](https://github.com/ClickHouse/ClickHouse/pull/91170) — Arrow Flight SQL  
These indicate the community’s strongest technical priorities right now: **faster point-style access, repeated aggregation acceleration, and broader connectivity/protocol support**.

## 5. Bugs & Stability

Below are the most important newly active or newly visible stability issues, roughly ranked by severity.

### Critical / correctness-risk

1. **Silent wrong data from Delta Lake time travel on Azure**
   - Issue: [#100502](https://github.com/ClickHouse/ClickHouse/issues/100502)
   - Problem: `delta_lake_snapshot_version` is reportedly ignored for Azure-backed DeltaLake reads, returning latest-state data instead of the requested snapshot.
   - Severity: **Critical correctness bug** because it can silently return the wrong versioned dataset.
   - Fix PR visible today: none in this dataset.

2. **Correlated EXISTS on same table returns wrong result**
   - Issue: [#99310](https://github.com/ClickHouse/ClickHouse/issues/99310)
   - Problem: query analyzer may treat a correlated subquery as uncorrelated.
   - Severity: **Critical SQL correctness bug**, especially dangerous because it is silent.

3. **Data loss / skipped inserts after DELETE + re-INSERT on ReplicatedMergeTree**
   - Issue: [#101337](https://github.com/ClickHouse/ClickHouse/issues/101337)
   - Status: closed
   - Severity: **Critical user-facing correctness issue** due to silent dropped rows.
   - Takeaway: closure is good, but the issue highlights the complexity of deduplication semantics in replicated storage.

### High severity

4. **Crash with ANY LEFT JOIN + ARRAY JOIN**
   - Issue: [#101229](https://github.com/ClickHouse/ClickHouse/issues/101229)
   - Problem: `PARAMETER_OUT_OF_BOUND` crash in `JoiningTransform`.
   - Severity: **High**, reproducible query crash involving common join constructs.
   - Fix PR visible today: none.

5. **MergeTree subcolumn/dynamic branch bug causing wrong results and crash**
   - Issue: [#101271](https://github.com/ClickHouse/ClickHouse/issues/101271)
   - Severity: **High**, because both correctness and crash risk are mentioned.
   - Notable: identified by automated code review tooling, suggesting static/differential analysis is catching subtle engine issues.

6. **Bad `arrayJoin` result under specific optimization flags**
   - Issue: [#101608](https://github.com/ClickHouse/ClickHouse/issues/101608)
   - Severity: **High** because it implies wrong query results, not just failure.
   - Context: tied to optimizer settings (`optimize_read_in_order`, `query_plan_execute_functions_after_sorting`).

7. **CSV parser consumes next Bool field after short-precision DateTime64 epoch**
   - Issue: [#101487](https://github.com/ClickHouse/ClickHouse/issues/101487)
   - Severity: **High** for ingestion correctness in production pipelines.
   - Real-world relevance: reported by GitLab for a high-throughput analytics ingestion use case.

8. **26.3 regression in `s3()` tar + parquet schema union**
   - Issue: [#101544](https://github.com/ClickHouse/ClickHouse/issues/101544)
   - Severity: **High**, because data is silently returned as null for some columns in heterogeneous parquet archives.

### Medium severity / operational

9. **Memory leak after system clock rollback**
   - Issue: [#93095](https://github.com/ClickHouse/ClickHouse/issues/93095)
   - Severity: **Medium to high** operationally, depending on environment.

10. **`date_time_overflow_behavior='throw'` ignored for some casts**
   - Issue: [#100471](https://github.com/ClickHouse/ClickHouse/issues/100471)
   - Severity: **Medium**, but important for correctness and predictable type-conversion behavior.

11. **PARSING_EXCEPTION test hint handling issue**
   - Issue: [#101664](https://github.com/ClickHouse/ClickHouse/issues/101664)
   - Severity: **Low-medium**, mostly testing framework correctness.

12. **CI fuzz/sanitizer instability**
   - Issues: [#101648](https://github.com/ClickHouse/ClickHouse/issues/101648), [#101613](https://github.com/ClickHouse/ClickHouse/issues/101613), [#101318](https://github.com/ClickHouse/ClickHouse/issues/101318)
   - Severity: mostly internal stability signals, but they often precede real production bugs.

## 6. Feature Requests & Roadmap Signals

Several user requests and open PRs give a strong picture of where ClickHouse is heading.

### Strong roadmap signals

1. **MergeTree lookup indexes**
   - PR: [#101401](https://github.com/ClickHouse/ClickHouse/pull/101401)
   - Prediction: good candidate for near-term adoption if testing goes well.
   - Why: it addresses a clear gap between analytical scans and repeated lookup-style access.

2. **Part-level aggregate caching**
   - PR: [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757)
   - Prediction: likely to land as an experimental feature before broader default use.
   - Why: directly targets repetitive dashboard and BI aggregation workloads.

3. **Arrow Flight SQL**
   - PR: [#91170](https://github.com/ClickHouse/ClickHouse/pull/91170)
   - Prediction: highly likely to become an important interoperability feature in an upcoming release cycle.
   - Why: aligns with ecosystem pressure around standardized, high-performance transport for analytics tools.

4. **Experimental phrase search in text indexes**
   - PR: [#101677](https://github.com/ClickHouse/ClickHouse/pull/101677)
   - Prediction: may appear behind experimental flags soon, especially as text search becomes more relevant in observability/security workloads.

### User-requested features from issues

5. **Projection index support for `ARRAY JOIN`**
   - Issue: [#98953](https://github.com/ClickHouse/ClickHouse/issues/98953)
   - Signal: observability users want better indexing paths for maps, labels, and exploded dimensions.

6. **Skip unused joins**
   - Issue: [#101451](https://github.com/ClickHouse/ClickHouse/issues/101451)
   - Signal: BI-generated SQL remains a major usability/performance pain point. Optimizer sophistication for “dumb SQL” remains a practical roadmap opportunity.

7. **Support `*` and column matchers inside default expressions**
   - Issue: [#92266](https://github.com/ClickHouse/ClickHouse/issues/92266)
   - Signal: schema automation and self-describing column transformations matter to users building dynamic ingestion layers.

8. **URL engine/schema ergonomics**
   - Issue: [#59617](https://github.com/ClickHouse/ClickHouse/issues/59617)
   - Signal: users want a more unified object/file access abstraction across table functions and engines.

9. **SQL standards compatibility**
   - PRs: [#100453](https://github.com/ClickHouse/ClickHouse/pull/100453), [#101681](https://github.com/ClickHouse/ClickHouse/pull/101681)
   - Prediction: these parser/function syntax improvements are likely to appear relatively soon because they are targeted, incremental, and improve compatibility with PostgreSQL/Oracle/DuckDB-style SQL.

## 7. User Feedback Summary

Today’s user feedback highlights a few recurring themes:

- **Silent wrong results remain the sharpest concern.** Users are not just reporting crashes; they are finding cases where ClickHouse returns plausible but incorrect output, including Delta Lake time travel, correlated subqueries, optimizer interactions, and schema union behavior. For analytics infrastructure, these are higher-risk than explicit failures.
- **Semi-structured and lakehouse workloads are increasingly important.** Issues around Delta Lake, Iceberg/LakeHouse assumptions, tar/parquet schema union, map/dynamic columns, and object storage all indicate that ClickHouse is being used well beyond classic local MergeTree fact tables.
- **BI and observability use cases continue to shape priorities.** Requests such as skipping unused joins, supporting `ARRAY JOIN` in projection/indexing scenarios, and accelerating repeated aggregations reflect dashboard-heavy workloads with generated SQL and wide schemas.
- **Operational resilience matters.** Memory leaks after clock changes, shutdown deadlocks, and file checker errors in production show that users expect the engine to behave predictably in messy real-world environments, not just ideal benchmarks.
- **Compatibility work is appreciated and necessary.** Standard interval syntax, `OVERLAY`, Arrow Flight SQL, and better URL/file schema support show ClickHouse continuing to reduce friction for migration and integration.

## 8. Backlog Watch

These older or strategically important items look worth maintainer attention:

1. **Memory leak after moving system time backward**
   - Issue: [#93095](https://github.com/ClickHouse/ClickHouse/issues/93095)
   - Why watch: operationally serious, open since 2025-12-27, still active.

2. **Projection index support for `ARRAY JOIN`**
   - Issue: [#98953](https://github.com/ClickHouse/ClickHouse/issues/98953)
   - Why watch: relevant to modern observability schemas; likely to matter more over time.

3. **URL engine schema/relative URL improvements**
   - Issue: [#59617](https://github.com/ClickHouse/ClickHouse/issues/59617)
   - Why watch: long-lived usability enhancement that would improve ingestion ergonomics across local and cloud contexts.

4. **Support `*` and column matchers in default expressions**
   - Issue: [#92266](https://github.com/ClickHouse/ClickHouse/issues/92266)
   - Why watch: small-sounding feature with outsized value for schema automation.

5. **Arrow Flight SQL support**
   - PR: [#91170](https://github.com/ClickHouse/ClickHouse/pull/91170)
   - Why watch: strategically important integration feature; long-running and likely complex.

6. **PartialAggregateCache**
   - PR: [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757)
   - Why watch: strong potential performance win, but cache correctness and invalidation semantics need careful review.

7. **ResizeProcessor “Pipeline stuck” fix**
   - PR: [#98340](https://github.com/ClickHouse/ClickHouse/pull/98340)
   - Why watch: pipeline scheduler correctness is foundational, and such bugs can be difficult to fully validate.

8. **Date32 null coercion inconsistency**
   - Issue: [#88312](https://github.com/ClickHouse/ClickHouse/issues/88312)
   - Why watch: older but still open correctness inconsistency between `INSERT VALUES` and `INSERT SELECT`.

---

### Bottom line

ClickHouse is showing **excellent development momentum** with substantial work in indexing, caching, SQL compatibility, CI hardening, and external connectivity. At the same time, the issue stream shows a nontrivial concentration of **silent correctness bugs and optimizer edge cases**, especially around the analyzer, joins, lakehouse readers, and semi-structured data paths. If the team can keep converting these bug reports into quick closures while landing the current feature set, near-term releases should be strong—but correctness validation should remain the top priority.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-04-03

## 1. Today’s Overview

DuckDB showed **high development activity** over the last 24 hours, with **56 PRs updated** and **17 issues updated**, indicating an active maintainer and contributor loop despite **no new release** being cut today. The current signal is a mix of **rapid bug triage**, **query engine work**, and **storage/concurrency hardening**, with several issues already linked to follow-up fixes. A notable theme today is **stability around edge cases**: correctness regressions, memory corruption, concurrency races, and connector/runtime interoperability problems are receiving attention. Overall project health looks strong from an activity standpoint, but the issue stream suggests DuckDB 1.5.x is still absorbing post-release regressions and integration bugs.

---

## 3. Project Progress

### Merged/closed PRs today

#### SQL / query semantics
- **Fix DELETE RETURNING for rows inserted in the same transaction** — [#21541](https://github.com/duckdb/duckdb/pull/21541)  
  This addresses a transactional correctness issue where `DELETE RETURNING` missed rows inserted earlier in the same explicit transaction. This is an important fix for SQL consistency and transactional semantics, especially for applications using multi-step mutation workflows.

- **Fix COPY FROM CSV header detection** — [#21734](https://github.com/duckdb/duckdb/pull/21734)  
  Restores expected default behavior for `COPY FROM` while preserving CSV dialect sniffing. This improves import reliability and reduces surprising behavior during ingestion.

- **Add helper method for ConstantVector::SetNull** — [#21798](https://github.com/duckdb/duckdb/pull/21798)  
  Small internal cleanup, but useful for reducing repeated vector null-handling boilerplate across the execution engine.

#### Testing / hardening
- **Oss-Fuzz: add harness for csv/json targets** — [#21790](https://github.com/duckdb/duckdb/pull/21790)  
  This is a meaningful quality investment. Fuzz coverage for CSV/JSON parsing should help uncover parser and ingestion edge cases earlier, which is highly relevant given DuckDB’s heavy use in ad hoc ETL and embedded analytics.

### Broader progress visible in open PRs
Beyond merged work, several open PRs suggest active advancement in:
- **Sampling semantics**: `USING SAMPLE N ROWS (system)` support — [#20859](https://github.com/duckdb/duckdb/pull/20859)
- **Window function binder refactoring** — [#21562](https://github.com/duckdb/duckdb/pull/21562)
- **DML-in-CTE support** for SQL compatibility — [#21634](https://github.com/duckdb/duckdb/pull/21634)
- **Aggregate pushdown to table scan** for min/max/count — [#21797](https://github.com/duckdb/duckdb/pull/21797)
- **Vacuum/index coexistence roadmap work** — [#21769](https://github.com/duckdb/duckdb/pull/21769)

These are strong signals that both **SQL compatibility** and **storage/query performance** remain near-term priorities.

---

## 4. Community Hot Topics

### Most discussed issues

- **Potential race condition between ADBC and Go garbage collector** — [Issue #21772](https://github.com/duckdb/duckdb/issues/21772)  
  The most actively discussed issue today. A Go + ADBC integration occasionally segfaults in CI, pointing to a likely use-after-free or lifecycle mismatch between native resources and Go GC behavior. This reflects a broader technical need: **robust cross-language ownership and lifetime management** for embedded/native clients.  
  Related fix PR already exists: **[PR #21800](https://github.com/duckdb/duckdb/pull/21800)**.

- **DuckDB debug build fails with multiple definitions for filesystem flags** — [Issue #21108](https://github.com/duckdb/duckdb/issues/21108)  
  An older but still active build-system issue affecting debug builds and some linker/toolchain combinations. This highlights continuing demand for **toolchain portability**, especially in non-default Linux and linker environments.

- **`all_profiling_output` pragma broken** — [Issue #21735](https://github.com/duckdb/duckdb/issues/21735)  
  Closed quickly, which is a good signal for responsiveness. Profiling output is important to power users and engine developers, so breakage here was likely high-priority despite modest comment volume.

### Most notable PR discussions / attention
- **Increase httplib header max length from 8KB to 16KB** — [PR #20460](https://github.com/duckdb/duckdb/pull/20460)  
  This reflects real-world HTTP interoperability pressure. Users are increasingly relying on DuckDB to fetch remote data directly, and modern CDNs can emit oversized headers.

- **Fix storage free block trimming race / WAL corruption** — [PR #21131](https://github.com/duckdb/duckdb/pull/21131)  
  A high-importance storage correctness PR. Even though marked stale / changes requested, the underlying problem space—**concurrent writes and WAL integrity**—is critical.

- **Fix macro expansion blow-up in CASE-heavy nested macros** — [PR #21801](https://github.com/duckdb/duckdb/pull/21801)  
  Directly tied to a fresh user-reported performance issue. This is a good example of rapid turnaround on optimizer/binder pain reported by advanced SQL generation users.

---

## 5. Bugs & Stability

Ranked by likely severity and user impact:

### Critical / high severity

1. **Composite index creation crashes with heap corruption on Ubuntu 24.04** — [Issue #21749](https://github.com/duckdb/duckdb/issues/21749)  
   Reported as reproducible with `free(): corrupted unsorted chunks` on large tables during `CREATE INDEX`. Since this involves memory corruption and storage/index build paths, it is among the most severe reports today. No linked fix PR is shown in the provided data.

2. **VARIANT-to-Parquet write crashes with internal assertion** — [Issue #21779](https://github.com/duckdb/duckdb/issues/21779)  
   Writing large `VARIANT` columns to Parquet triggers an internal error near completion. This affects semi-structured data export and could block production pipelines handling JSON/VARIANT workloads. No fix PR listed yet.

3. **ADBC / Go GC race causing segfaults** — [Issue #21772](https://github.com/duckdb/duckdb/issues/21772)  
   Cross-language crash issue with a likely lifetime race. Severity is high because it produces segmentation faults in CI and potentially production workloads.  
   Fix in progress: [PR #21800](https://github.com/duckdb/duckdb/pull/21800).

4. **HTTPFS `COPY TO S3` silently succeeds with invalid credentials** — [Issue #21787](https://github.com/duckdb/duckdb/issues/21787)  
   Extremely important operationally because it implies **silent failure / silent data loss semantics**. Even without a crash, this may be one of the most dangerous issues reported today for production ETL users. No fix PR listed.

### Correctness / regression issues

5. **Query fails in 1.5.1 but not 1.5.0 with bind error** — [Issue #21788](https://github.com/duckdb/duckdb/issues/21788)  
   A likely regression in binder/type resolution. Version-to-version query regressions are important because they impact upgrade confidence.

6. **`SELECT DISTINCT` inside CTE with LEFT JOIN on empty table intermittently returns wrong results** — [Issue #21757](https://github.com/duckdb/duckdb/issues/21757)  
   Intermittent wrong-answer bugs are particularly concerning in analytics systems because they can escape detection. This deserves high maintainer attention.

7. **`ieee_floating_point_ops` not behaving as documented** — [Issue #21744](https://github.com/duckdb/duckdb/issues/21744)  
   Could be either implementation mismatch or documentation bug, but it affects numerical semantics and user trust in configuration settings.

### Compatibility / environment issues

8. **`LOAD motherduck` problems after upgrading to 1.5.1** — [Issue #21771](https://github.com/duckdb/duckdb/issues/21771)  
   Likely extension-loading or integration compatibility problem; relevant for ecosystem users.

9. **`SET GLOBAL secret_directory` not working in clients** — [Issue #21740](https://github.com/duckdb/duckdb/issues/21740)  
   Marked reproduced and documentation-related, suggesting a mismatch between expected config persistence/scope and actual client behavior.

10. **MSVC + Clang GNU CLI builtin issue causing `D_ASSERT`** — [Issue #20295](https://github.com/duckdb/duckdb/issues/20295)  
    Niche toolchain issue, but still important for portability.

11. **Java macro type parameter/storage version mismatch** — [Issue #21753](https://github.com/duckdb/duckdb/issues/21753)  
    Suggests metadata or storage-version reporting inconsistency in Java/physical storage mode.

---

## 6. Feature Requests & Roadmap Signals

### User-requested capabilities

- **Discoverability of `rowid` pseudo-column in catalog metadata** — [Issue #21777](https://github.com/duckdb/duckdb/issues/21777)  
  This is a practical API/catalog ergonomics request. It would help clients, ORMs, and tooling understand which tables expose `rowid`. This seems relatively feasible and could land in a near-term release.

- **Transaction isolation level commands compatibility** — [PR #21143](https://github.com/duckdb/duckdb/pull/21143)  
  Even if DuckDB only supports one actual isolation level, accepting Postgres-style `SHOW/SET TRANSACTION ISOLATION LEVEL` would improve compatibility with existing tools and SQL clients.

- **DML statements as CTE bodies** — [PR #21634](https://github.com/duckdb/duckdb/pull/21634)  
  This is a strong SQL compatibility feature, especially for users porting workflows from PostgreSQL and similar systems.

- **System sampling with row counts** — [PR #20859](https://github.com/duckdb/duckdb/pull/20859)  
  A useful extension of existing sampling syntax, likely valuable for exploratory analytics and testing workloads.

### Storage/performance roadmap signals

- **Aggregate pushdown to table scan** — [PR #21797](https://github.com/duckdb/duckdb/pull/21797)  
  Strong signal of continued investment in exploiting storage statistics for faster analytical queries.

- **Vacuuming with indexes roadmap** — [PR #21769](https://github.com/duckdb/duckdb/pull/21769)  
  This is an important storage engine direction. The description explicitly frames it as “part 1 of the roadmap,” suggesting more index-aware maintenance work is coming.

### Most likely near-term candidates for next version
Based on status and scope, likely candidates include:
- ADBC race fix — [#21800](https://github.com/duckdb/duckdb/pull/21800)
- Macro performance fix — [#21801](https://github.com/duckdb/duckdb/pull/21801)
- System sampling with row counts — [#20859](https://github.com/duckdb/duckdb/pull/20859)
- TopN/window-related optimizer work — [#21775](https://github.com/duckdb/duckdb/pull/21775)
- Possibly some SQL compatibility polish such as transaction isolation syntax — [#21143](https://github.com/duckdb/duckdb/pull/21143)

---

## 7. User Feedback Summary

Today’s user feedback clusters around a few recurring pain points:

- **Reliability in production pipelines**  
  The S3 silent-success report — [#21787](https://github.com/duckdb/duckdb/issues/21787) — is especially telling. Users need explicit failure semantics when DuckDB is used as an ETL engine, not just as an interactive SQL tool.

- **Upgrade regressions in 1.5.1**  
  Several reports indicate that newer builds introduced breakage or behavior changes, including query binding regressions — [#21788](https://github.com/duckdb/duckdb/issues/21788) — and extension-loading problems — [#21771](https://github.com/duckdb/duckdb/issues/21771). Upgrade safety remains a key concern.

- **Performance under generated SQL / macros**  
  The macros issue — [#21747](https://github.com/duckdb/duckdb/issues/21747) — suggests DuckDB is increasingly used behind generated SQL systems, where binder and macro expansion efficiency matters as much as raw execution speed.

- **Embedded/client interoperability**  
  Problems in Go/ADBC — [#21772](https://github.com/duckdb/duckdb/issues/21772) — Java storage mode/macros — [#21753](https://github.com/duckdb/duckdb/issues/21753) — and R/Python config handling — [#21740](https://github.com/duckdb/duckdb/issues/21740) — show that ecosystem polish across language bindings remains an important adoption factor.

- **Correctness over convenience**  
  Intermittent wrong results — [#21757](https://github.com/duckdb/duckdb/issues/21757) — and transactional `RETURNING` fixes — [#21541](https://github.com/duckdb/duckdb/pull/21541) — reinforce that analytical users are sensitive to silent correctness problems, not just crashes.

---

## 8. Backlog Watch

These older or strategically important items appear to need maintainer attention:

- **Build/linker portability issue in debug builds** — [Issue #21108](https://github.com/duckdb/duckdb/issues/21108)  
  Still under review more than a month after filing. Important for contributors and downstream builders.

- **MSVC + Clang GNU CLI zero-count builtin issue** — [Issue #20295](https://github.com/duckdb/duckdb/issues/20295)  
  Open since 2025-12-23. Not mainstream for all users, but valuable for cross-platform credibility.

- **Storage race / WAL corruption fix PR marked stale** — [PR #21131](https://github.com/duckdb/duckdb/pull/21131)  
  Because the subject is storage correctness under concurrency, this should not languish.

- **Transaction isolation compatibility syntax** — [PR #21143](https://github.com/duckdb/duckdb/pull/21143)  
  Stale but useful for client/tool compatibility.

- **musl / ARM64 / MySQL scanner build enablement** — [PR #21161](https://github.com/duckdb/duckdb/pull/21161), [PR #21162](https://github.com/duckdb/duckdb/pull/21162)  
  These matter for packaging and broad platform support, especially in containerized deployments.

- **DML in CTE bodies** — [PR #21634](https://github.com/duckdb/duckdb/pull/21634)  
  Marked changes requested. This is a substantial SQL compatibility enhancement and worth watching closely.

---

## Overall Assessment

DuckDB remains a **fast-moving, healthy analytical database project** with strong contributor throughput and visible maintainer responsiveness. The main caution today is **stability risk around 1.5.x edge cases**, especially in connectors, storage/indexing, and query correctness. Encouragingly, several reports already have corresponding fixes or active PRs, which suggests the team is keeping pace with incoming regressions. The near-term trajectory points toward continued work on **SQL compatibility, storage maintenance, and embedded/runtime robustness**.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-04-03

## 1. Today's Overview

StarRocks showed **very high pull request throughput** over the last 24 hours, with **115 PRs updated** and **72 merged/closed**, indicating an active stabilization and refinement phase ahead of the 4.1 line. Issue volume was comparatively light at **9 updated issues**, with a mix of metadata correctness, external catalog compatibility, and lake/storage integration bugs. There were **no new releases**, so today’s signals come mainly from engineering execution rather than packaging milestones. Overall, project health looks **strong on delivery cadence**, with most visible work concentrated on **bug fixes, backports, refactors, and operational hardening** rather than large new feature landings.

---

## 3. Project Progress

### Query engine and optimizer progress
Several changes point to ongoing work in planner quality, execution correctness, and statistics robustness:

- **NaN row count estimation fix for MCV-only histograms** — open but important forward progress on optimizer correctness. This addresses a stats edge case where `IS NULL`-driven MCV-only histograms could cause divide-by-zero and propagate `NaN` estimates into join reorder decisions. This is exactly the kind of issue that can create hard-to-diagnose bad plans in analytical workloads.  
  Link: [PR #71241](https://github.com/StarRocks/StarRocks/pull/71241)

- **Dictification for physical filter** — an enhancement to make dictionary-based execution less conservative in physical filters, which could improve CPU efficiency and vectorized execution behavior on dictionary-encoded inputs.  
  Link: [PR #71093](https://github.com/StarRocks/StarRocks/pull/71093)

- **Optimizer bug issue closed** — a recently reported optimizer defect was closed quickly, suggesting responsive handling of query-planning regressions.  
  Link: [Issue #71057](https://github.com/StarRocks/StarRocks/issues/71057)

### Storage engine and lakehouse progress
A notable share of work is focused on storage/lake correctness and metadata safety:

- **Compaction input protection during lake full replication** — prevents physical segment files from being vacuumed incorrectly when UUID reuse causes old and new rowsets to share files. This is a high-value fix for lake/full-replication durability.  
  Link: [PR #71203](https://github.com/StarRocks/StarRocks/pull/71203)

- **UpdateTabletSchemaTask signature collision fix** — addresses task signature collisions across ALTER jobs, which could affect concurrent schema evolution reliability on the same table/partition.  
  Link: [PR #71242](https://github.com/StarRocks/StarRocks/pull/71242)

- **AWS SDK missing `s3-transfer-manager` fix merged and backported** — this was merged and quickly backported, indicating cloud object storage integration remains a priority operational path.  
  Main fix: [PR #71230](https://github.com/StarRocks/StarRocks/pull/71230)  
  Backports: [PR #71234](https://github.com/StarRocks/StarRocks/pull/71234), [PR #71235](https://github.com/StarRocks/StarRocks/pull/71235)

- **Parquet/variant reader refactoring** — ongoing internal cleanup around Parquet group readers for variant columns suggests continued investment in semi-structured data support.  
  Link: [PR #71227](https://github.com/StarRocks/StarRocks/pull/71227)

- **Storage type trait refactor** — internal cleanup of storage typing abstractions, likely helping maintainability and future feature work in storage columns.  
  Open follow-up: [PR #71204](https://github.com/StarRocks/StarRocks/pull/71204)  
  Earlier closed step: [PR #71239](https://github.com/StarRocks/StarRocks/pull/71239)

### Security, observability, and docs
- **Credential redaction fixes** continue to land in SQL and file insertion paths, which is meaningful for production deployments with audit and log exposure concerns.  
  Open follow-up: [PR #71245](https://github.com/StarRocks/StarRocks/pull/71245)  
  Closed related work: [PR #71095](https://github.com/StarRocks/StarRocks/pull/71095)

- **WarehouseManager warning logs** — adding missing warning logs for swallowed exceptions improves operability and diagnosis in multi-warehouse deployments.  
  Link: [PR #71215](https://github.com/StarRocks/StarRocks/pull/71215)

- **Documentation updates** include a downgrade warning for 4.1 and renaming “Disaster Recovery” to “Data Protection,” reflecting attention to upgrade safety and product framing.  
  Downgrade warning: [PR #71170](https://github.com/StarRocks/StarRocks/pull/71170)  
  Data Protection rename: [PR #71247](https://github.com/StarRocks/StarRocks/pull/71247)

---

## 4. Community Hot Topics

### 1) MERGE INTO support demand
- **Issue:** [#65949 Support MERGE INTO Statement for Efficient Upsert Operations](https://github.com/StarRocks/StarRocks/issues/65949)  
- **Signals:** 12 👍, still open

This is the clearest roadmap signal in today’s issue set. Users want **standards-aligned upsert semantics** combining dynamic partition overwrite with row-level merge logic. The technical need underneath is broader than syntax: users are asking for a more ergonomic and efficient way to express **incremental ingestion, CDC reconciliation, and warehouse-style merge pipelines** without composing multiple DML steps. Given current lakehouse competition and enterprise ETL expectations, this request is strategically important.

### 2) SQL security/log redaction
- **PRs:** [#71245](https://github.com/StarRocks/StarRocks/pull/71245), [#71095](https://github.com/StarRocks/StarRocks/pull/71095)

Credential redaction is a recurring topic, especially in SQL execution and file ingestion paths. The underlying need is enterprise-safe observability: users need detailed logs and query diagnostics without leaking secrets embedded in statements or connector properties.

### 3) 4.1 upgrade/downgrade safety
- **PR:** [#71170 Warning about downgrading 4.1](https://github.com/StarRocks/StarRocks/pull/71170)

The documentation warning that **4.1 RC deployments cannot be downgraded below 4.0.5** is a notable operational topic. This suggests users are actively trialing 4.1 and maintainers want to reduce upgrade-path mistakes before broader adoption.

### 4) Metadata and external catalog correctness
- **Issues:**  
  [#71211 GRANT fails for ALL VIEWS in Iceberg catalog](https://github.com/StarRocks/StarRocks/issues/71211)  
  [#71222 AddFilesProcedure incorrectly retrieves metrics for ORC files](https://github.com/StarRocks/StarRocks/issues/71222)  
  [#71200 HMS Thrift client hits MaxMessageSize default limit](https://github.com/StarRocks/StarRocks/issues/71200)

These issues reflect a common theme: StarRocks users increasingly rely on **external metadata systems and open table formats**, and correctness at these boundaries is now a core expectation rather than an edge case.

---

## 5. Bugs & Stability

Ranked by likely operational severity based on the provided summaries:

### High severity
1. **HMS Thrift client hits 100MB MaxMessageSize limit**
   - Issue: [#71200](https://github.com/StarRocks/StarRocks/issues/71200)
   - Impact: Can break refresh or metadata operations against very large Hive tables.
   - Why it matters: This affects lakehouse interoperability and large-catalog production deployments.
   - Fix PR: none shown in today’s data.

2. **Potential wrong-file deletion during lake full replication**
   - PR: [#71203](https://github.com/StarRocks/StarRocks/pull/71203)
   - Impact: Segment files still referenced by new tablet metadata could be vacuumed.
   - Why it matters: This is a data durability/correctness class issue.
   - Status: open PR, important to watch closely.

3. **UpdateTabletSchemaTask signature collision across ALTER jobs**
   - PR: [#71242](https://github.com/StarRocks/StarRocks/pull/71242)
   - Impact: Concurrent ALTER operations may collide in task queue signatures.
   - Why it matters: Can undermine schema-change reliability in busy clusters.
   - Status: open PR.

### Medium severity
4. **ORC metrics misalignment in AddFilesProcedure**
   - Issue: [#71222](https://github.com/StarRocks/StarRocks/issues/71222)
   - Impact: Column metrics shifted by one position due to ORC stats indexing.
   - Why it matters: Can lead to wrong metadata/statistics ingestion for external file operations.
   - Fix PR: none shown.

5. **GRANT fails for ALL VIEWS in Iceberg catalog**
   - Issue: [#71211](https://github.com/StarRocks/StarRocks/issues/71211)
   - Impact: Privilege management does not work as expected on Iceberg REST catalog views.
   - Why it matters: Security/administration friction for lakehouse deployments.
   - Fix PR: none shown.

6. **NaN row count estimation in optimizer**
   - PR: [#71241](https://github.com/StarRocks/StarRocks/pull/71241)
   - Impact: Bad statistics can distort join reordering and plan quality.
   - Why it matters: Query performance and plan stability issue, especially for skewed/null-heavy data.
   - Status: open fix.

### Lower severity but user-visible correctness
7. **`information_schema.columns.EXTRA` missing `auto_increment`**
   - Issue: [#63730](https://github.com/StarRocks/StarRocks/issues/63730)
   - Impact: Metadata introspection mismatch.
   - Why it matters: Tooling compatibility and MySQL-like behavior expectations.
   - Status: open, older issue.

### Recently closed analyzer crashes
8. **NPE in `visitDictionaryGetExpr`**
   - Issues: [#71070](https://github.com/StarRocks/StarRocks/issues/71070), [#70997](https://github.com/StarRocks/StarRocks/issues/70997)
   - Impact: Analyzer crash path when source table is dropped / null reference handling is wrong.
   - Why it matters: FE analyzer robustness.
   - Status: both closed quickly, which is a positive stability signal.

---

## 6. Feature Requests & Roadmap Signals

### Strongest roadmap signal
- **`MERGE INTO` support**  
  Issue: [#65949](https://github.com/StarRocks/StarRocks/issues/65949)

This is the most substantial product ask in today’s dataset. It aligns with enterprise ETL/ELT workflows, CDC upserts, and lakehouse interoperability patterns. If StarRocks is continuing to push deeper into mixed warehouse/lakehouse workloads, this feature is a natural candidate for a future minor release or major feature milestone.

### New compliance-oriented request
- **FIPS compliance**
  - Issue: [#71243](https://github.com/StarRocks/StarRocks/issues/71243)

This is an enterprise adoption signal rather than a pure database feature request. It suggests users in regulated sectors want validated crypto modules for in-transit and at-rest security. This kind of feature typically lands only when customer demand is strong and may require work across dependencies, packaging, TLS stack choices, and documentation. It is less likely to arrive quickly than SQL syntax work, but it is strategically important for commercial adoption.

### Likely next-version themes based on PR flow
Given current activity, the next releases are more likely to emphasize:
- **4.1 hardening and upgrade safety**
- **lakehouse connector/storage correctness**
- **security/logging improvements**
- **optimizer edge-case fixes**
- **schema evolution reliability**

Large end-user-facing SQL features appear less immediate than **stability and operational readiness**.

---

## 7. User Feedback Summary

Today’s user feedback points to a few consistent pain areas:

- **Enterprise SQL compatibility expectations remain high.** Users want metadata behavior to match familiar MySQL semantics, as seen in the `auto_increment` visibility issue in `information_schema`.  
  Link: [Issue #63730](https://github.com/StarRocks/StarRocks/issues/63730)

- **Lakehouse interoperability is now a mainstream usage pattern.** Problems involving Iceberg REST catalogs, Hive Metastore limits, ORC file statistics, and S3 SDK packaging show that many real deployments depend on StarRocks working cleanly with external table formats and object stores.  
  Links: [#71211](https://github.com/StarRocks/StarRocks/issues/71211), [#71200](https://github.com/StarRocks/StarRocks/issues/71200), [#71222](https://github.com/StarRocks/StarRocks/issues/71222), [#71230](https://github.com/StarRocks/StarRocks/pull/71230)

- **Operational safety matters as much as raw performance.** Credential redaction, swallowed-exception logging, and downgrade warnings all indicate users are running StarRocks in environments where auditability, secure logs, and upgrade predictability are crucial.  
  Links: [#71245](https://github.com/StarRocks/StarRocks/pull/71245), [#71095](https://github.com/StarRocks/StarRocks/pull/71095), [#71215](https://github.com/StarRocks/StarRocks/pull/71215), [#71170](https://github.com/StarRocks/StarRocks/pull/71170)

- **Users want higher-level DML ergonomics.** The `MERGE INTO` request suggests a desire to reduce ETL complexity and express upsert logic natively.  
  Link: [Issue #65949](https://github.com/StarRocks/StarRocks/issues/65949)

---

## 8. Backlog Watch

These items appear important and deserving of maintainer attention:

1. **Old metadata compatibility issue still open**
   - [Issue #63730](https://github.com/StarRocks/StarRocks/issues/63730) — `auto_increment` not exposed in `information_schema.columns.EXTRA`
   - Why watch: low-severity but long-lived compatibility gap; can affect BI tools, schema diff tools, and user trust in metadata accuracy.

2. **High-interest `MERGE INTO` feature request**
   - [Issue #65949](https://github.com/StarRocks/StarRocks/issues/65949)
   - Why watch: strongest user-demand signal in today’s data, with notable reactions; likely worth roadmap clarification even if not implemented soon.

3. **Fresh but important external-system bugs with no linked fixes yet**
   - [Issue #71200](https://github.com/StarRocks/StarRocks/issues/71200) — HMS Thrift message size limit
   - [Issue #71211](https://github.com/StarRocks/StarRocks/issues/71211) — Iceberg catalog GRANT failure
   - [Issue #71222](https://github.com/StarRocks/StarRocks/issues/71222) — ORC metrics misread
   - Why watch: these are integration-heavy issues that can disproportionately affect production adoption.

4. **Open correctness/stability PRs worth prioritizing**
   - [PR #71203](https://github.com/StarRocks/StarRocks/pull/71203) — replication/vacuum correctness
   - [PR #71242](https://github.com/StarRocks/StarRocks/pull/71242) — alter-job task collision
   - [PR #71241](https://github.com/StarRocks/StarRocks/pull/71241) — optimizer NaN stats
   - Why watch: all three are relatively narrow changes with outsized reliability impact.

---

## Bottom Line

StarRocks is currently in a **high-velocity hardening cycle**, with especially strong focus on **4.1 readiness, lakehouse integration correctness, storage safety, and secure operations**. The most important user-facing requests today are **`MERGE INTO` support** and **enterprise compliance/security capabilities**, while the most urgent engineering concerns center on **metadata interoperability and external catalog/storage edge cases**. The project looks healthy, responsive, and execution-heavy, though a few integration bugs still need quick maintainer attention before they become adoption friction points.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-04-03

## 1. Today's Overview

Apache Iceberg remained highly active over the last 24 hours, with **39 pull requests updated** and **6 issues updated**, indicating strong ongoing development momentum despite **no new release cut today**. Current work is concentrated around **Spark 4.x evolution, REST catalog/OpenAPI expansion, Flink support, and Kafka Connect write semantics**, alongside some licensing and dependency hygiene. The PR mix suggests the project is in a phase of **platform expansion and API/spec refinement** rather than major release stabilization. Overall project health appears good, with active maintainer and contributor engagement, though several older strategic PRs remain open and likely need deeper design review.

## 2. Project Progress

Merged/closed PR activity today was limited but still meaningful in terms of maintenance and compatibility:

- **[PR #15847](https://github.com/apache/iceberg/pull/15847)** — **[KAFKACONNECT] [1.10.x] Bump jackson from 2.19.2 to 2.21.2 to fix GHSA-72hv-8253-57qq**  
  Closed today. This points to active **security/dependency management** in Kafka Connect distributions, important for production connector deployments.

- **[PR #15832](https://github.com/apache/iceberg/pull/15832)** — **Spark (4.0, 3.5): Set data file sort_order_id in manifest for writes from Spark**  
  Closed today. This work targets **Spark write-path correctness and metadata fidelity**, improving manifest metadata for files written by Spark, with implications for scan planning and downstream optimizations.

In addition, the open PR queue signals near-term forward progress in several important areas:

- **Spark 4.x compatibility and performance**
  - [PR #15876](https://github.com/apache/iceberg/pull/15876) — Spark 4.0 backport of async micro-batch planner
  - [PR #15877](https://github.com/apache/iceberg/pull/15877) — Spark 4.1 async planner stream test coverage
  - [PR #15875](https://github.com/apache/iceberg/pull/15875) — migrate Spark table properties out of core
- **Flink ecosystem support**
  - [PR #15476](https://github.com/apache/iceberg/pull/15476) — Flink 2.2 support
  - [PR #15784](https://github.com/apache/iceberg/pull/15784) — Sink `WriteObserver` plugin interface
- **REST catalog/spec maturity**
  - [PR #15830](https://github.com/apache/iceberg/pull/15830) — relation load endpoints in REST spec
  - [PR #15831](https://github.com/apache/iceberg/pull/15831) — Java reference implementation for relation load endpoints
  - [PR #15180](https://github.com/apache/iceberg/pull/15180) — function list/load endpoints
  - [PR #15746](https://github.com/apache/iceberg/pull/15746) — document `404` response for `/v1/config`

## 3. Community Hot Topics

### 1) Kafka Connect upsert/delete support
- **[PR #15499](https://github.com/apache/iceberg/pull/15499)** — *Enable Upsert and Delete Support in Apache Iceberg Kafka Connect*

This remains one of the clearest roadmap signals. The technical demand is straightforward: users want Kafka Connect to move beyond append-only ingestion into **CDC-style upsert/delete semantics**, making Iceberg more viable for operational replication and mutable analytics pipelines. The fact that this is being pulled from Databricks sink code also suggests real-world demand is already validated elsewhere.

### 2) Incremental changelog scans with delete-file support
- **[PR #14264](https://github.com/apache/iceberg/pull/14264)** — *Add Delete File Support and Partition Pruning for Incremental Changelog Scans*

This is strategically important. Supporting positional/equality deletes in incremental changelog scans would improve **merge-on-read CDC completeness**, which is increasingly critical for streaming analytics and lakehouse change propagation. The long lifespan of the PR suggests the feature is valuable but technically complex.

### 3) Materialized view specification work
- **[PR #11041](https://github.com/apache/iceberg/pull/11041)** — *Materialized View Spec*

This is a major long-running design topic. The technical need is broader SQL/lakehouse interoperability: users increasingly expect **native materialized view semantics** in catalog and table formats, especially as compute engines standardize around managed refresh and query rewrite capabilities.

### 4) REST catalog generalization toward relational objects
- **[PR #15830](https://github.com/apache/iceberg/pull/15830)** — *REST Spec: Add single and batch endpoints for loading relational objects*
- **[PR #15831](https://github.com/apache/iceberg/pull/15831)** — *Core: Add Java reference implementation for relation load endpoints*
- **[PR #15180](https://github.com/apache/iceberg/pull/15180)** — *REST spec: add list/load function endpoints*

These PRs indicate Iceberg is broadening from table-centric APIs toward a more general **catalog object model** including tables, views, and future objects. This is a strong sign of platform maturation, especially for multi-engine deployments and service-based catalogs.

### 5) Week partition transform request
- **[Issue #14220](https://github.com/apache/iceberg/issues/14220)** — *[improvement] Adding week partition transform*

Among issues, this is the strongest explicit feature request by reactions/comments. The underlying need is better alignment with **business calendar-based partitioning**, where week granularity is common in reporting and planning workloads.

## 4. Bugs & Stability

Ranked by likely severity based on the issue summaries available:

### High severity
1. **[Issue #15856](https://github.com/apache/iceberg/issues/15856)** — *Fix up 1.11 License Issues*  
   This is not a runtime correctness bug, but it is high severity for release engineering because licensing problems can **block release approval**. The report references runtime dependency changes and likely affects multiple packaged artifacts.

### Medium severity
2. **[Issue #15867](https://github.com/apache/iceberg/issues/15867)** — *Flink Source: watermark should be min timestamp minus one*  
   A watermark computation bug can affect **streaming correctness**, late data handling, and event-time behavior. This matters for Flink users relying on precise incremental semantics. No fix PR is listed in today’s data.

3. **[Issue #15870](https://github.com/apache/iceberg/issues/15870)** — *Use Iceberg in Spark, Procedures return error*  
   This appears to be a user-facing Spark procedure failure. Severity is medium until root cause is known, but procedural SQL failures can block administration tasks and adoption.

### Lower severity / informational
4. **[Issue #15859](https://github.com/apache/iceberg/issues/15859)** — *IcebergSink memory consumption seems to be related to number of rows written*  
   Closed quickly, suggesting either expected behavior, user misunderstanding, or redirection to known sink buffering mechanics. Still notable as a signal that **Flink sink memory characteristics remain a user concern**.

5. **[Issue #13035](https://github.com/apache/iceberg/issues/13035)** — *default parquet column statistic enable config flag*  
   Closed/stale. This suggests the original requested improvement is either no longer needed, superseded, or waiting on upstream parquet-java changes.

## 5. Feature Requests & Roadmap Signals

### Clear user-requested features
- **[Issue #14220](https://github.com/apache/iceberg/issues/14220)** — week partition transform  
  Likely useful for BI/reporting-heavy environments. This is a plausible candidate for future inclusion because it is conceptually small and operationally meaningful.

### Strong roadmap signals from active PRs
- **Kafka Connect CDC support**
  - [PR #15499](https://github.com/apache/iceberg/pull/15499)  
  This looks like one of the most commercially relevant in-flight enhancements and a good candidate for a next minor release if review converges.

- **Flink 2.2 support**
  - [PR #15476](https://github.com/apache/iceberg/pull/15476)  
  Highly likely to land in an upcoming version because engine-version support is time-sensitive.

- **REST catalog object/function expansion**
  - [PR #15830](https://github.com/apache/iceberg/pull/15830)
  - [PR #15831](https://github.com/apache/iceberg/pull/15831)
  - [PR #15180](https://github.com/apache/iceberg/pull/15180)  
  These look like active building blocks for the next wave of Iceberg catalog interoperability.

- **Spark 4.0/4.1 feature parity and performance**
  - [PR #15876](https://github.com/apache/iceberg/pull/15876)
  - [PR #15877](https://github.com/apache/iceberg/pull/15877)
  - [PR #15860](https://github.com/apache/iceberg/pull/15860)  
  Expect continued Spark 4.x polish in the next release cycle.

### Prediction: most likely near-term additions
Most likely to appear in the next version or two:
1. **Flink 2.2 support**
2. **Spark 4.x async planner improvements**
3. **REST catalog relation/function endpoints**
4. **More dependency/license validation infrastructure**

Less certain but strategically important:
5. **Kafka Connect upsert/delete support**
6. **Incremental changelog delete-file support**
7. **Materialized view spec progress**

## 6. User Feedback Summary

Today’s user-facing feedback shows a few recurring operational themes:

- **Streaming correctness and memory behavior matter a lot**
  - [Issue #15867](https://github.com/apache/iceberg/issues/15867) highlights Flink source watermark correctness.
  - [Issue #15859](https://github.com/apache/iceberg/issues/15859) points to sensitivity around sink memory usage and row-volume scaling.

- **Spark usability still has rough edges in administrative/procedural paths**
  - [Issue #15870](https://github.com/apache/iceberg/issues/15870) indicates some users are hitting errors when invoking procedures, suggesting compatibility or configuration clarity gaps.

- **Partitioning ergonomics remain important**
  - [Issue #14220](https://github.com/apache/iceberg/issues/14220) reflects practical user demand for business-oriented partition transforms rather than only canonical time units.

- **Connector users want mutable-table semantics**
  - [PR #15499](https://github.com/apache/iceberg/pull/15499) is a strong signal that append-only ingestion is insufficient for many production CDC workloads.

Overall, feedback suggests users are broadly pushing Iceberg deeper into **streaming, CDC, and multi-engine production environments**, where correctness, semantics, and connector behavior matter more than basic table-format functionality.

## 7. Backlog Watch

These older or strategically significant items appear to need sustained maintainer attention:

- **[PR #11041](https://github.com/apache/iceberg/pull/11041)** — *Materialized View Spec*  
  Long-running and foundational. Important for spec completeness and ecosystem competitiveness.

- **[PR #14264](https://github.com/apache/iceberg/pull/14264)** — *Delete File Support and Partition Pruning for Incremental Changelog Scans*  
  High value for CDC and MoR use cases; likely blocked by complexity and review bandwidth.

- **[PR #15499](https://github.com/apache/iceberg/pull/15499)** — *Kafka Connect upsert/delete support*  
  Strong end-user value and likely to attract adoption if merged.

- **[PR #15476](https://github.com/apache/iceberg/pull/15476)** — *Flink 2.2 support*  
  Important for keeping engine compatibility current.

- **[Issue #14220](https://github.com/apache/iceberg/issues/14220)** — *week partition transform*  
  Smaller than the spec/connector work, but a good candidate for maintainers seeking high-user-value improvements with lower implementation risk.

## 8. Overall Health Signal

Iceberg’s development stream today shows a healthy balance of:
- **engine compatibility work** (Spark/Flink),
- **catalog/spec expansion** (REST/OpenAPI),
- **connector evolution** (Kafka Connect),
- **release hygiene** (license and dependency management).

The main risk is not inactivity but **review backlog on strategic features**: several impactful PRs have been open for weeks or months. If maintainer bandwidth can convert these into merged deliverables, the next release cycle could significantly improve Iceberg’s position in streaming CDC, service-based catalogs, and next-generation Spark/Flink support.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-04-03

## 1. Today's Overview

Delta Lake showed **high pull-request activity but low issue inflow** over the last 24 hours: **32 PRs updated**, **2 issues updated**, and **no new releases**. The activity pattern suggests the project is in a **heavy implementation and review phase**, especially around **Delta Kernel, DSv2 table creation, kernel-spark CDC streaming, UniForm atomic commit support, and test hardening**. There were **6 PRs merged/closed**, indicating steady forward movement even without a release cut. Overall project health looks **active and engineering-driven**, with roadmap energy concentrated more on platform internals and connector/query-engine integration than on end-user feature announcements.

## 2. Project Progress

### Merged/closed PRs today

#### 1) [#6333](https://github.com/delta-io/delta/pull/6333) — **[UC Commit Metrics] Add feature flag and async dispatch** — Closed
This change advances **observability and commit-path instrumentation**. It introduces a feature flag for commit metrics and async dispatch with configurable thread-pool sizing, which points to work on **lower-overhead telemetry around catalog/commit coordination**, likely important for production deployments with Unity Catalog-related workflows.  
**Why it matters:** commit metrics are critical for diagnosing write latency, commit coordinator bottlenecks, and metadata-path behavior in large-scale lakehouse environments.

#### 2) [#6472](https://github.com/delta-io/delta/pull/6472) — **[Docs] Recommend skipChangeCommits over legacy ignoreDeletes/ignoreChanges** — Closed
This is a documentation-level improvement, but it signals a **compatibility and API-guidance shift** in streaming/query semantics. The recommendation to prefer `skipChangeCommits` over older options suggests Delta is continuing to **normalize modern streaming behavior** and reduce reliance on legacy configuration patterns.  
**Why it matters:** cleaner guidance reduces user confusion and helps standardize CDC/change-processing semantics across Spark users.

### Broader areas advanced today via active PRs
Although not yet merged, the active PR set shows momentum in several important technical areas:

- **DSv2 + Kernel table creation path**
  - [#6449](https://github.com/delta-io/delta/pull/6449) — Add CreateTableBuilder + V2Mode routing + integration tests  
  - [#6450](https://github.com/delta-io/delta/pull/6450) — Wire `DeltaCatalog.createTable()` to DSv2 + Kernel path  
  These indicate meaningful progress on **SQL/catalog compatibility and modular engine integration**.

- **kernel-spark CDC streaming stack**
  - [#6075](https://github.com/delta-io/delta/pull/6075)
  - [#6076](https://github.com/delta-io/delta/pull/6076)
  - [#6336](https://github.com/delta-io/delta/pull/6336)
  - [#6359](https://github.com/delta-io/delta/pull/6359)
  - [#6362](https://github.com/delta-io/delta/pull/6362)
  - [#6363](https://github.com/delta-io/delta/pull/6363)
  - [#6370](https://github.com/delta-io/delta/pull/6370)
  - [#6388](https://github.com/delta-io/delta/pull/6388)
  - [#6391](https://github.com/delta-io/delta/pull/6391)  
  This stacked series is one of the clearest roadmap signals today: Delta is investing in **end-to-end CDC streaming through kernel-spark**, including offset management, commit processing, schema coordination, DV support, and integration tests.

- **UniForm atomic metadata commits**
  - [#6474](https://github.com/delta-io/delta/pull/6474)
  - [#6475](https://github.com/delta-io/delta/pull/6475)  
  These suggest ongoing work to improve **cross-format/interoperability metadata publication**, especially where commit coordination is involved.

## 3. Community Hot Topics

### 1) Kernel-based Flink Sink roadmap
- [Issue #5901](https://github.com/delta-io/delta/issues/5901) — **[Flink] Create Delta Kernel based Flink Sink**

This remains one of the strongest roadmap themes visible in the issue tracker. It is framed as an **epic**, not a narrow bug, and tracks planned changes for a **Delta Kernel–based Flink sink**.  
**Underlying technical need:** users want Delta’s write path to become more **engine-neutral**, with Flink relying on Kernel abstractions rather than Spark-specific internals. This is important for streaming ingestion portability, lower integration cost, and broadening Delta’s role outside Spark-centric deployments.

### 2) DSv2 table creation parity with SQL comments/metadata
- [Issue #6473](https://github.com/delta-io/delta/issues/6473) — **[Feature Request] Kernel to support Description/Comments**
- Related PRs:
  - [#6449](https://github.com/delta-io/delta/pull/6449)
  - [#6450](https://github.com/delta-io/delta/pull/6450)

This issue highlights a metadata gap: users can specify `COMMENT 'x'` in `CREATE TABLE`, and DSv2 preserves it in request context, but **Kernel cannot yet persist the description into the Delta log**.  
**Underlying technical need:** users need **full DDL fidelity** through the DSv2 + Kernel path, not just functional table creation. This matters for governance, discoverability, BI tooling, and migration from legacy catalog flows.

### 3) kernel-spark CDC streaming implementation wave
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)
- [#6388](https://github.com/delta-io/delta/pull/6388)
- [#6391](https://github.com/delta-io/delta/pull/6391)

Even without comment-count data, this is the densest single technical cluster in the PR list.  
**Underlying technical need:** users are asking, implicitly through engineering investment, for **robust CDC streaming semantics in DSv2/kernel-spark**, including:
- offset correctness,
- initial snapshot handling,
- incremental change processing,
- schema coordination,
- out-of-range handling,
- DV interoperability,
- end-to-end test coverage.

That combination usually reflects demand from production streaming users where **correctness and resumability** matter more than raw feature count.

## 4. Bugs & Stability

No new severe crash or corruption issue was reported in the provided issue set today. Still, several PRs indicate active work on correctness and stability.

### Severity: Medium — Streaming offset correctness / checkpoint compatibility
- [PR #6479](https://github.com/delta-io/delta/pull/6479) — **Use MD5 fileIdHash for priming getBatch when both offsets are from legacy checkpoint**

This looks like a **streaming compatibility/correctness fix** around legacy checkpoints.  
**Risk area:** if offset priming is incorrect, users may face duplicate reads, missed records, or batch alignment issues during streaming recovery.  
**Fix status:** PR open.

### Severity: Medium — Snapshot equality semantics
- [PR #6477](https://github.com/delta-io/delta/pull/6477) — **[Kernel][Spark] Add value-based equals/hashCode to Snapshot**

This is likely aimed at improving **object identity vs. logical equality behavior**.  
**Risk area:** bugs around caching, deduplication, state comparison, or test flakiness can emerge when snapshots compare by reference instead of value.  
**Fix status:** PR open.

### Severity: Low-to-Medium — Config cleanup around implicit casts
- [PR #6478](https://github.com/delta-io/delta/pull/6478) — **Remove ALLOW_IMPLICIT_CASTS conf as it's no longer needed**

This appears to be a cleanup/simplification change rather than a direct bug fix.  
**Risk area:** migration and compatibility, especially if downstream users still rely on the config’s presence or old casting assumptions.  
**Fix status:** PR open.

### Severity: Low — Test and validation hardening
- [PR #6476](https://github.com/delta-io/delta/pull/6476) — **[Test] Write file size histogram in VersionChecksum**

This strengthens validation and debugging support.  
**Risk area addressed:** improved detection of write-path anomalies or unexpected file-size distributions.  
**Fix status:** PR open.

### Stability note
A notable proportion of today’s active work is on **test gating and integration coverage**, e.g.:
- [#6446](https://github.com/delta-io/delta/pull/6446) — Gate UC tests behind UC Spark version checks
- [#6363](https://github.com/delta-io/delta/pull/6363) — CDC streaming integration tests

That usually indicates maintainers are actively managing **matrix compatibility and regression risk**.

## 5. Feature Requests & Roadmap Signals

### 1) Kernel support for table descriptions/comments
- [Issue #6473](https://github.com/delta-io/delta/issues/6473)

This is a concrete user request for **DDL metadata completeness**. It is narrowly scoped and aligns directly with in-flight DSv2/Kernel create-table work, so it has a **high likelihood of near-term inclusion** in an upcoming release.

### 2) Flink sink built on Delta Kernel
- [Issue #5901](https://github.com/delta-io/delta/issues/5901)

This is a major strategic signal. A Kernel-based Flink sink would strengthen Delta’s position as a **multi-engine analytical storage layer**.  
**Likelihood next version:** partial progress is likely; full delivery may take multiple releases given epic scope.

### 3) DSv2 table creation and catalog routing modernization
- [PR #6449](https://github.com/delta-io/delta/pull/6449)
- [PR #6450](https://github.com/delta-io/delta/pull/6450)

These are not issue-driven requests in the supplied data, but they strongly indicate a roadmap push toward **modern Spark data source APIs and cleaner catalog integration**.  
**Prediction:** this is one of the most likely feature areas to land soon because it is already in implementation and test phases.

### 4) CDC streaming support in kernel-spark
- [#6075](https://github.com/delta-io/delta/pull/6075) and related stack

This is a strong roadmap cluster with production-facing impact.  
**Prediction:** pieces of CDC streaming support may start landing incrementally before the entire stack is complete, especially offset and schema-handling components.

### 5) UniForm atomic commit enhancements
- [#6474](https://github.com/delta-io/delta/pull/6474)
- [#6475](https://github.com/delta-io/delta/pull/6475)

These suggest Delta is continuing to invest in **interoperability and commit atomicity**, likely important for environments mixing Delta metadata with other catalog/format expectations.  
**Prediction:** medium likelihood for staged landing if commit-coordinator dependencies are resolved.

## 6. User Feedback Summary

Based on today’s issues and PRs, the strongest user/operator pain points appear to be:

- **Metadata fidelity gaps in modern create-table paths**
  - Users expect SQL features like `COMMENT` to survive through DSv2 and Kernel layers.
  - Evidence: [Issue #6473](https://github.com/delta-io/delta/issues/6473)

- **Need for multi-engine write support, especially Flink**
  - The Flink sink epic suggests users want Delta adoption in non-Spark streaming stacks.
  - Evidence: [Issue #5901](https://github.com/delta-io/delta/issues/5901)

- **Streaming correctness and compatibility**
  - The large CDC/kernel-spark stack plus the legacy-checkpoint PR indicate demand for reliable behavior under resume/recovery, schema evolution, and change-data workloads.
  - Evidence: [#6075](https://github.com/delta-io/delta/pull/6075), [#6479](https://github.com/delta-io/delta/pull/6479)

- **Operational observability**
  - Commit metrics work suggests users need better visibility into commit behavior and system overhead.
  - Evidence: [#6333](https://github.com/delta-io/delta/pull/6333)

There is **little direct sentiment data** in today’s sample—no high reaction counts, no high-comment issue threads, and no explicit user praise/complaint narratives. So the feedback picture is best inferred from engineering priorities rather than from discussion volume.

## 7. Backlog Watch

### 1) [Issue #5901](https://github.com/delta-io/delta/issues/5901) — Flink Sink via Delta Kernel
**Why it needs attention:** this is a long-running epic created on 2026-01-21 and still open. It likely requires cross-cutting coordination across build, connector APIs, writer semantics, and test coverage. Given its ecosystem significance, maintainers should keep progress visible and milestone status current.

### 2) [PR #6075](https://github.com/delta-io/delta/pull/6075) and the CDC stack
**Why it needs attention:** this stack began in February and has expanded into many interdependent PRs. Long-lived stacked series can become difficult to review, rebase, and merge safely. Maintainer attention is especially important to prevent **review bottlenecks** and reduce integration risk.

Related backlog candidates:
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6370](https://github.com/delta-io/delta/pull/6370)
- [#6388](https://github.com/delta-io/delta/pull/6388)
- [#6391](https://github.com/delta-io/delta/pull/6391)

### 3) [PR #6449](https://github.com/delta-io/delta/pull/6449) and [PR #6450](https://github.com/delta-io/delta/pull/6450) — DSv2 + Kernel create-table routing
**Why it needs attention:** these PRs appear foundational to near-term SQL/catalog modernization. They are also directly related to the metadata-description gap in [Issue #6473](https://github.com/delta-io/delta/issues/6473), so timely review would unblock both platform work and user-facing DDL completeness.

## Overall Health Signal

Delta Lake appears **healthy and actively developed**, with most momentum in **engine modularization, streaming CDC correctness, catalog/DSv2 modernization, and interoperability work**. The main risk is not lack of activity, but rather **complexity concentration**: several important features are unfolding through stacked or interdependent PRs, which can delay landing if review bandwidth is limited. No release was cut today, so the current snapshot reads as a **deep engineering sprint** rather than a delivery milestone.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-04-03

## 1. Today's Overview

Databend showed **moderate-to-high development activity** over the last 24 hours, with **14 PRs updated** and **5 issues updated**, while no new release was published. The day’s work was concentrated around **query engine correctness, join execution behavior, storage size accounting, and metadata consistency for flashback/time travel workflows**. Several fixes were closed quickly, which is a good signal for engineering responsiveness, especially around **IEJoin stability** and **block size estimation for string-heavy workloads**. Overall, the project appears **healthy and actively iterating**, though there are still notable open risks around **historical metadata correctness, optimizer session-context handling, and skewed/distributed join performance**.

## 3. Project Progress

### Merged/closed PRs today

#### 1) Storage estimation correctness improved
- **PR #19657** — [fix(storage): inflated block size estimation caused by shared string buffers](https://github.com/databendlabs/databend/pull/19657) — **Closed**
- This addresses a storage/statistics correctness bug where variable-length string columns could lead to **inflated block size estimates**, especially when shared string buffers were involved.
- Impact:
  - Better **block statistics accuracy**
  - Lower risk of bad planning or misleading storage metrics on large string datasets
  - Important for analytical workloads with wide text payloads

Related issue:
- **Issue #19658** — [[C-bug] bug: inflated block size estimation by string](https://github.com/databendlabs/databend/issues/19658) — **Closed**

#### 2) IEJoin crash handling was fixed
- **PR #19604** — [fix: handle empty IEJoin outer fill](https://github.com/databendlabs/databend/pull/19604) — **Closed**
- This fixes an **index out-of-bounds panic** in range join / IEJoin processing when the unmatched inner side produced no data blocks.
- Impact:
  - Better **query engine stability**
  - Reduced risk of runtime panics in **range join / non-equi join** scenarios
  - Strengthens SQL execution reliability for edge cases

Related issue:
- **Issue #19569** — [[agent-issue] IEJoin (range join) index out of bounds on empty result](https://github.com/databendlabs/databend/issues/19569) — **Closed**

#### 3) ASOF join performance work landed/closed
- **PR #19654** — [feat: speed up equi ASOF joins](https://github.com/databendlabs/databend/pull/19654) — **Closed**
- The change reuses the hash-join path for `ASOF JOIN` when equality keys are present and preserves SQL outer-side semantics after binder rewrites.
- Impact:
  - Faster **ASOF JOIN** execution for common time-series style workloads
  - Better join planning reuse
  - Signals continued investment in **advanced SQL join semantics**

#### 4) Branching/table refactor work progressed
- **PR #19499** — [refactor: table branch refactor](https://github.com/databendlabs/databend/pull/19499) — **Closed**
- While the summary is broad, the closure suggests continued internal evolution around table branch infrastructure, likely relevant to **time travel/branching/versioned metadata workflows**.

### Open progress worth watching
- **PR #19653** — [fix(query): guard metadata consistency for flashback, time travel, and DDL column operations](https://github.com/databendlabs/databend/pull/19653)
- **PR #19652** — [fix(query): support broadcast join with merge-limit build](https://github.com/databendlabs/databend/pull/19652)
- **PR #19655** — [feat(query): add spill backoff with sleep for low-memory queries under global pressure](https://github.com/databendlabs/databend/pull/19655)
- **PR #19553** — [refactor(query): support partitioned hash join](https://github.com/databendlabs/databend/pull/19553)

These indicate active work on **distributed joins, memory pressure control, and historical metadata correctness**.

## 4. Community Hot Topics

### 1) Skew join support
- **Issue #18546** — [feature: support skew join](https://github.com/databendlabs/databend/issues/18546)
- Activity signals:
  - **2 comments**
  - **1 reaction**, the highest among listed items
- Technical need:
  - Users are hitting **severe memory skew across nodes** when join keys are highly non-uniform.
  - This is a classic distributed OLAP pain point: one or a few hot keys can overload build/probe memory on particular nodes.
- Why it matters:
  - Strong roadmap signal for **distributed execution robustness**
  - Important for real-world datasets with hot partitions, tenant IDs, or popular dimensions
- Related ongoing work:
  - **PR #19553** — [support partitioned hash join](https://github.com/databendlabs/databend/pull/19553)
  - **PR #19652** — [support broadcast join with merge-limit build](https://github.com/databendlabs/databend/pull/19652)

### 2) Flashback/time travel metadata correctness
- **Issue #19661** — [[C-bug] bug: Flashback Metadata Inconsistency](https://github.com/databendlabs/databend/issues/19661)
- Related fix PR:
  - **PR #19653** — [guard metadata consistency for flashback, time travel, and DDL column operations](https://github.com/databendlabs/databend/pull/19653)
- Technical need:
  - Historical snapshot navigation can leave **schema-dependent metadata** out of sync with the reverted schema.
  - Affects bloom indexes, policies, indexes, cluster keys, and constraints.
- Why it matters:
  - This is not just a UX issue; it may cause **write failures, query errors, or silent corruption paths**.
  - It highlights the complexity of making **time travel + branching + schema evolution** safe in analytical databases.

### 3) Optimizer/session semantic correctness
- **Issue #19656** — [Optimizer constant folding uses FunctionContext::default() instead of session context](https://github.com/databendlabs/databend/issues/19656)
- Technical need:
  - Optimizer/planner constant folding is currently ignoring **session-level settings** that affect expression semantics.
- Why it matters:
  - This can lead to subtle **query correctness mismatches** between optimized and executed behavior.
  - Important for SQL compatibility and deterministic behavior across sessions.

## 5. Bugs & Stability

Ranked by likely severity and user impact:

### Critical / High

#### 1) Flashback metadata inconsistency
- **Issue #19661** — [[C-bug] bug: Flashback Metadata Inconsistency](https://github.com/databendlabs/databend/issues/19661) — **Open**
- Risk:
  - Can cause **write failures, query failures, or silent data corruption**
  - Impacts flashback/time travel/branch workflows
- Fix in progress:
  - **PR #19653** — [guard metadata consistency for flashback, time travel, and DDL column operations](https://github.com/databendlabs/databend/pull/19653)

#### 2) Optimizer constant folding ignores session context
- **Issue #19656** — [Optimizer constant folding uses FunctionContext::default() instead of session context](https://github.com/databendlabs/databend/issues/19656) — **Open**
- Risk:
  - Potential **query correctness bug**
  - Session-sensitive functions or settings may behave differently during planning vs execution
- Fix PR:
  - None listed yet

### Medium

#### 3) Join execution under skewed keys
- **Issue #18546** — [feature: support skew join](https://github.com/databendlabs/databend/issues/18546) — **Open**
- Risk:
  - Severe **memory imbalance** across nodes
  - Performance collapse or instability in distributed joins under hot-key distributions
- Fix status:
  - No direct fix yet, but adjacent work exists in join infrastructure

### Resolved today

#### 4) Inflated block size estimation by string
- **Issue #19658** — [[C-bug] bug: inflated block size estimation by string](https://github.com/databendlabs/databend/issues/19658) — **Closed**
- Fixed by:
  - **PR #19657** — [fix(storage): inflated block size estimation caused by shared string buffers](https://github.com/databendlabs/databend/pull/19657)

#### 5) IEJoin panic on empty result
- **Issue #19569** — [[agent-issue] IEJoin (range join) index out of bounds on empty result](https://github.com/databendlabs/databend/issues/19569) — **Closed**
- Fixed by:
  - **PR #19604** — [fix: handle empty IEJoin outer fill](https://github.com/databendlabs/databend/pull/19604)

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### 1) Skew join support
- **Issue #18546** — [feature: support skew join](https://github.com/databendlabs/databend/issues/18546)
- Likelihood for upcoming versions: **Medium**
- Rationale:
  - It addresses a real distributed OLAP pain point.
  - Databend is already investing in join execution internals, suggesting this is strategically aligned.

#### 2) Partitioned hash join
- **PR #19553** — [refactor(query): support partitioned hash join](https://github.com/databendlabs/databend/pull/19553)
- Likelihood: **High**
- Why:
  - Significant infrastructure work for scalable joins
  - Likely foundational for both performance and future skew mitigation

#### 3) CSV/TEXT encoding support
- **PR #19660** — [feat: CSV/TEXT support encoding](https://github.com/databendlabs/databend/pull/19660)
- Likelihood: **High**
- Why:
  - Direct user-facing ingestion capability
  - Helps with interoperability for non-UTF8 datasets and practical ETL scenarios

#### 4) AUTO datetime format detection
- **PR #19659** — [feat(sql): add AUTO datetime format detection](https://github.com/databendlabs/databend/pull/19659)
- Likelihood: **High**
- Why:
  - SQL/data-loading compatibility enhancement
  - Useful for semi-structured or messy source data imports

#### 5) Spill backoff under global memory pressure
- **PR #19655** — [feat(query): add spill backoff with sleep for low-memory queries under global pressure](https://github.com/databendlabs/databend/pull/19655)
- Likelihood: **Medium-High**
- Why:
  - A practical scheduler/resource-management improvement
  - Especially relevant for mixed workloads and cluster stability

#### 6) Geometry aggregate functions
- **PR #19620** — [feat(query): Support Geometry aggregate functions](https://github.com/databendlabs/databend/pull/19620)
- Likelihood: **Medium**
- Why:
  - Expands analytical SQL surface area
  - Niche compared with join and ingestion work, but valuable for geospatial analytics users

## 7. User Feedback Summary

Based on today’s issue/PR mix, the main user pain points are:

### 1) Reliability of advanced data versioning workflows
Users working with **flashback, time travel, and branching-like table history operations** need stronger guarantees that metadata remains synchronized with schema state. This is a high-trust area: failures here affect not just performance but **correctness and safety**.

Relevant items:
- [Issue #19661](https://github.com/databendlabs/databend/issues/19661)
- [PR #19653](https://github.com/databendlabs/databend/pull/19653)

### 2) Distributed join behavior on real-world skewed data
Users are signaling that sophisticated analytical joins still face **hot-key and memory skew problems** in distributed settings. This reflects practical warehouse workloads where dimension or tenant skew is common.

Relevant items:
- [Issue #18546](https://github.com/databendlabs/databend/issues/18546)
- [PR #19553](https://github.com/databendlabs/databend/pull/19553)

### 3) Correctness over edge cases in optimizer and join execution
Recent reports show users are encountering edge cases where planning/runtime behavior diverges or crashes occur. The quick closure of IEJoin and block-estimation bugs is positive, but it also indicates the product is being exercised in more demanding scenarios.

Relevant items:
- [Issue #19656](https://github.com/databendlabs/databend/issues/19656)
- [Issue #19569](https://github.com/databendlabs/databend/issues/19569)
- [Issue #19658](https://github.com/databendlabs/databend/issues/19658)

### 4) Better ingestion compatibility
Open PRs around **CSV/TEXT encoding** and **AUTO datetime format detection** suggest demand for smoother import of heterogeneous external data, especially from systems that do not emit strict UTF-8 or ISO datetime formats.

Relevant items:
- [PR #19660](https://github.com/databendlabs/databend/pull/19660)
- [PR #19659](https://github.com/databendlabs/databend/pull/19659)

## 8. Backlog Watch

### Items needing maintainer attention

#### 1) Skew join support remains strategically important
- **Issue #18546** — [feature: support skew join](https://github.com/databendlabs/databend/issues/18546)
- Created in 2025 and still open, this stands out as a **high-value execution-engine gap** for distributed OLAP.
- Why attention is needed:
  - It impacts performance predictability at scale
  - It is likely to affect larger production users disproportionately

#### 2) Partitioned hash join is a key infrastructure PR
- **PR #19553** — [refactor(query): support partitioned hash join](https://github.com/databendlabs/databend/pull/19553)
- This appears foundational for future join scalability work.
- Why attention is needed:
  - Large surface-area query-engine changes benefit from prompt review
  - It may unblock follow-on features like skew mitigation

#### 3) SQL planning refactor with semantic implications
- **PR #19618** — [refactor(sql): unify select output planning and preserve aggregate reuse in window analysis](https://github.com/databendlabs/databend/pull/19618)
- Why attention is needed:
  - This affects planner structure and aggregate/window analysis behavior
  - Refactors in this area can have broad correctness implications if left in limbo

#### 4) Optional query path extraction / support crates
- **PR #19644** — [refactor(query): extract optional query paths into support crates](https://github.com/databendlabs/databend/pull/19644)
- Why attention is needed:
  - Build modularity and feature gating can materially affect maintainability and packaging
  - Worth reviewing carefully to reduce long-term complexity

---

## Overall Health Assessment

Databend’s status today is **active and constructive**, with a strong signal of maintainers closing real bugs quickly and continuing to invest in **join execution, metadata correctness, and SQL/ingestion usability**. The biggest technical risk area remains **correctness in advanced historical-schema workflows** and **robust distributed execution under skew or memory pressure**. If the currently open join, flashback, and ingestion PRs merge soon, the next release should materially improve both **operator confidence** and **real-world analytical workload compatibility**.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-04-03

## 1. Today's Overview

Velox showed **high development activity** over the last 24 hours, with **50 PR updates** and **6 issue updates**, but **no new release** was published today. The signal from today’s activity is that the project is currently focused on **CI reliability, flaky test reduction, cuDF/GPU execution expansion, and internal type/cast infrastructure cleanup**. Merged work touched both **build/CI operability** and **core runtime robustness**, while open issues continue to highlight **query correctness fuzzing gaps** and **intermittent test instability**. Overall, project health appears **active but temporarily constrained by reliability work**, especially around CI noise and spill/test flakiness.

## 2. Project Progress

### Merged / closed PRs today

#### CI and developer workflow
- [#17021](https://github.com/facebookincubator/velox/pull/17021) — **Merged** — `build(ci): Grant pull-requests write permission to Linux build workflow`  
  This improves CI workflow capabilities, specifically enabling reusable workflows to post back richer status/reporting. It supports a broader push toward automated test feedback in PRs.

- [#17003](https://github.com/facebookincubator/velox/pull/17003) — **Merged/Closed** — `feat(ci): Add flaky test retry and JUnit XML reporting`  
  A meaningful operational improvement: retry-on-failure for flaky tests plus structured test reporting should reduce false-negative CI failures and improve contributor productivity.

#### Build/runtime dependencies
- [#17004](https://github.com/facebookincubator/velox/pull/17004) — **Merged** — `build: Update perfetto SDK to v54`  
  This advances observability/tracing infrastructure, with explicit warning suppressions needed for GCC 13. It suggests continued investment in profiling and performance diagnostics.

#### Storage/runtime correctness and concurrency
- [#16978](https://github.com/facebookincubator/velox/pull/16978) — **Merged** — `refactor: Add thread safety to connector registry`  
  This is an important internal robustness improvement. Making connector registry operations thread-safe reduces risk in multi-threaded query execution and connector lifecycle management.

#### GPU / cuDF performance
- [#16620](https://github.com/facebookincubator/velox/pull/16620) — **Merged/Closed** — `fix(cudf): Refactor CudfToVelox output batching to avoid O(n) D->H syncs`  
  This is one of the strongest performance signals today. Reducing repeated device-to-host synchronizations should materially improve GPU pipeline efficiency and lower overhead when converting cuDF output back into Velox vectors.

### Closed issue
- [#16995](https://github.com/facebookincubator/velox/issues/16995) — **Closed** — `fix(build): velox_hive_connector_test missing GTest::gmock link dependency`  
  A straightforward but useful build-system fix for test target correctness.

## 3. Community Hot Topics

### 1) Spark aggregate fuzzer correctness failures
- Issue: [#16327](https://github.com/facebookincubator/velox/issues/16327) — `Scheduled Spark Aggregate Fuzzer failing`
- Comments: 12

This is the clearest **query correctness** hotspot. The issue points to inconsistencies between Spark and Velox for `ARRAY<TIMESTAMP>` aggregation paths. The underlying technical need is stronger semantic alignment with Spark, better failure logging, and more targeted aggregate debugging in the fuzzing harness. Since fuzzers often uncover edge-case engine mismatches before users do, this is strategically important.

### 2) GPU operator coverage for Presto TPC-DS
- Issue: [#15772](https://github.com/facebookincubator/velox/issues/15772) — `[cuDF] Expand GPU operator support for Presto TPC-DS`
- Comments: 11
- Related PRs:
  - [#16942](https://github.com/facebookincubator/velox/pull/16942) — GPU NestedLoopJoin
  - [#16920](https://github.com/facebookincubator/velox/pull/16920) — GPU EnforceSingleRow
  - [#16522](https://github.com/facebookincubator/velox/pull/16522) — GPU count variants
  - [#16769](https://github.com/facebookincubator/velox/pull/16769) — timestamp unit config
  - [#16620](https://github.com/facebookincubator/velox/pull/16620) — merged batching optimization

This remains a major roadmap thread. The technical need is clear: reducing CPU fallback in the Velox-cuDF backend so more Presto TPC-DS plans remain fully GPU-resident. Today’s PR mix suggests this is not a speculative area; it is an active implementation stream.

### 3) CI observability and flaky test reporting
- PR: [#17015](https://github.com/facebookincubator/velox/pull/17015) — `Add test failure reporting with PR comments and error annotations`
- Related merged PRs:
  - [#17021](https://github.com/facebookincubator/velox/pull/17021)
  - [#17003](https://github.com/facebookincubator/velox/pull/17003)

Velox maintainers are clearly working to make CI failures more actionable. The need here is less about feature delivery and more about reducing maintainer and contributor time spent triaging intermittent failures.

### 4) Long-running SQL/functionality parity work
- PR: [#15511](https://github.com/facebookincubator/velox/pull/15511) — `feat: s2 presto functions`
- PR: [#16048](https://github.com/facebookincubator/velox/pull/16048) — `Implement array_top_n with transform lambda argument`

These point to continued demand for **Presto SQL compatibility and richer function coverage**. They are likely important to downstream engines seeking drop-in semantic parity.

## 4. Bugs & Stability

Ranked by likely severity and user impact:

### High severity

#### 1) Spark/Velox aggregate correctness mismatch
- Issue: [#16327](https://github.com/facebookincubator/velox/issues/16327)

This is the most serious open item in today’s issue list because it concerns **semantic inconsistency** between Velox and Spark. Incorrect aggregate behavior on nested timestamp arrays could surface as wrong query answers, not just crashes. No direct fix PR is linked in the provided data.

#### 2) Spill deserialization corruption / flaky failure root cause
- Open PR: [#17020](https://github.com/facebookincubator/velox/pull/17020) — `TempFilePath fd_ member initialization order bug causing flaky test failures`
- Prior closed PR: [#17019](https://github.com/facebookincubator/velox/pull/17019)

This looks important because the reported symptom is `"Received corrupted serialized page"` during spill deserialization. Even if currently observed as a flaky test, the root cause touches file descriptor initialization and temporary spill file handling, which can affect runtime stability. A fix PR exists and is active.

#### 3) AggregationFuzzer SIGSEGV on empty reference result
- PR: [#17018](https://github.com/facebookincubator/velox/pull/17018)

This is a crash-class bug, though in test/fuzzer infrastructure rather than production query serving. It still matters because it can mask correctness issues by crashing before reporting mismatches properly.

### Medium severity

#### 4) Flaky test in task cancellation / race condition
- Issue: [#17014](https://github.com/facebookincubator/velox/issues/17014) — `LocalPartitionTest.earlyCancelation`
  
A persistent race in task cancellation suggests possible concurrency fragility in execution lifecycle management. Even though currently framed as test flakiness, cancellation races are often symptoms worth deeper review.

#### 5) CountIfAggregationTest flaky read-overrun / source corruption symptom
- Issue: [#16901](https://github.com/facebookincubator/velox/issues/16901)

The reported attempted read size versus tiny remaining source bytes hints at serialization/deserialization or buffer accounting problems. This is lower confidence than the spill issue, but still a meaningful reliability concern.

### Low severity

#### 6) Hive connector test build failure from missing gmock link
- Issue: [#16995](https://github.com/facebookincubator/velox/issues/16995) — Closed

This was a build/test integration problem, now resolved.

## 5. Feature Requests & Roadmap Signals

### GPU acceleration breadth is a top roadmap signal
- Issue: [#15772](https://github.com/facebookincubator/velox/issues/15772)
- PRs: [#16942](https://github.com/facebookincubator/velox/pull/16942), [#16920](https://github.com/facebookincubator/velox/pull/16920), [#16522](https://github.com/facebookincubator/velox/pull/16522), [#16769](https://github.com/facebookincubator/velox/pull/16769)

This is the strongest near-term feature theme. Expect the next version to include **broader cuDF operator coverage**, better GPU continuity for complex plans, and fewer CPU fallbacks in analytical benchmarks.

### Type system expansion
- Issue: [#16660](https://github.com/facebookincubator/velox/issues/16660) — `Support TimeType with microsecond precision that is timezone-unaware`

This is a concrete type-system enhancement with a checklist already underway. Given its implementation detail and progress markers, it looks plausible for a near-future release, especially if interoperability with Arrow and DuckDB remains a priority.

### SQL compatibility / function parity
- PR: [#15511](https://github.com/facebookincubator/velox/pull/15511) — S2 Presto functions
- PR: [#16048](https://github.com/facebookincubator/velox/pull/16048) — `array_top_n` with transform lambda

These indicate persistent user demand for **Presto-compatible built-ins** and specialized geospatial functionality. The `array_top_n` addition seems especially likely to land sooner because it is a targeted compatibility feature.

### Casting/coercion infrastructure modernization
- PRs: [#17017](https://github.com/facebookincubator/velox/pull/17017), [#17016](https://github.com/facebookincubator/velox/pull/17016)

These are not user-facing features by themselves, but they are roadmap signals for **cleaner type coercion semantics**, easier extensibility, and fewer duplicated code paths in cast validation.

## 6. User Feedback Summary

Based on today’s issues and PRs, the main user and contributor pain points are:

- **Flaky CI wastes engineering time**  
  This is reflected in the push for retries, JUnit output, PR comments, and workflow permission changes: [#17003](https://github.com/facebookincubator/velox/pull/17003), [#17015](https://github.com/facebookincubator/velox/pull/17015), [#17021](https://github.com/facebookincubator/velox/pull/17021).

- **Users want stronger Spark and Presto compatibility**  
  Spark aggregate fuzz failures and Presto function parity work both show that downstream consumers care about exact behavioral compatibility: [#16327](https://github.com/facebookincubator/velox/issues/16327), [#16048](https://github.com/facebookincubator/velox/pull/16048), [#15511](https://github.com/facebookincubator/velox/pull/15511).

- **GPU users want fewer fallbacks and better end-to-end acceleration**  
  The cuDF effort is tied to real benchmark use cases, especially Presto TPC-DS at scale: [#15772](https://github.com/facebookincubator/velox/issues/15772).

- **Reliability issues around spill, serialization, and concurrency remain visible**  
  The active bugs suggest some user-facing or operator-facing concern around robustness in complex execution paths: [#17020](https://github.com/facebookincubator/velox/pull/17020), [#17014](https://github.com/facebookincubator/velox/issues/17014), [#16901](https://github.com/facebookincubator/velox/issues/16901).

Overall satisfaction appears strongest around **ongoing performance and feature velocity**, while dissatisfaction centers on **flaky tests, correctness edge cases, and reliability noise**.

## 7. Backlog Watch

These items look important and likely need maintainer attention due to age, scope, or strategic value:

- [#15511](https://github.com/facebookincubator/velox/pull/15511) — `feat: s2 presto functions`  
  Open since 2025-11-15. Strategically relevant for SQL/geospatial parity, but evidently long-running.

- [#15772](https://github.com/facebookincubator/velox/issues/15772) — `[cuDF] Expand GPU operator support for Presto TPC-DS`  
  Open since 2025-12-15. High-value roadmap issue with multiple dependent PRs; worth continued coordination and milestone tracking.

- [#16048](https://github.com/facebookincubator/velox/pull/16048) — `Implement array_top_n with transform lambda argument`  
  Open since 2026-01-16. Useful compatibility feature that may be blocked on review bandwidth rather than scope.

- [#16660](https://github.com/facebookincubator/velox/issues/16660) — `Support TimeType with microsecond precision that is timezone-unaware`  
  Open since 2026-03-06. The checklist suggests implementable, bounded work that could benefit from clearer prioritization.

- [#16327](https://github.com/facebookincubator/velox/issues/16327) — `Scheduled Spark Aggregate Fuzzer failing`  
  Not old enough to be stale, but important enough to watch closely because it affects correctness confidence.

## 8. Overall Health Assessment

Velox remains **highly active and technically ambitious**, with notable momentum in **GPU acceleration, CI tooling, and internal engine cleanup**. The main short-term drag on health is **stability noise**: flaky tests, race conditions, and fuzzer-discovered correctness gaps are consuming visible attention. Still, the presence of targeted fix PRs and infrastructure improvements suggests maintainers are addressing these systematically rather than reactively. Near-term outlook: expect progress on **GPU operator coverage, SQL compatibility, and reliability tooling** before the next release.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-04-03

## 1. Today's Overview

Apache Gluten remained highly active over the last 24 hours, with **11 issues** and **21 pull requests** updated, indicating steady momentum across both core execution and infrastructure work. The day’s activity was dominated by **Velox backend compatibility**, **CI/build maintenance**, and **Spark 4.0 / timestamp-related correctness work**. No new release was published, so current progress is best understood through merged fixes and active PRs rather than versioned deliverables. Overall project health looks **good but operationally busy**, with maintainers balancing backend correctness, upstream Velox sync, and CI modernization.

---

## 3. Project Progress

### Merged/closed work advancing the project today

#### 1) AQE-driven hash build-side selection to prevent OOM
- **PR:** [#11775](https://github.com/apache/incubator-gluten/pull/11775) — `[GLUTEN-11774][VL] Use runtime stats to choose hash build side`
- **Issue:** [#11774](https://github.com/apache/incubator-gluten/issues/11774) — `HashBuild OOM caused by incorrect build side`

This is the most meaningful engine-side improvement merged/closed today. Gluten now uses **runtime statistics from AQE QueryStageExec** to choose the smaller hash build side, directly addressing a class of **HashBuild out-of-memory failures**. This is a concrete query execution improvement with clear production value: better memory behavior for joins where static planning picks the wrong build side.

#### 2) CI optimization via Maven dependency cache image
- **PR:** [#11655](https://github.com/apache/incubator-gluten/pull/11655) — `[VL][CI] Adding docker image for maven cache`
- **Issue:** [#11501](https://github.com/apache/incubator-gluten/issues/11501) — `[VL] Caching java dependencies in testing docker`

This work improves build/test throughput by caching Java dependencies in Docker images. While not a query engine feature, it materially improves developer velocity and CI efficiency, especially important for a project with multi-backend and multi-Spark-version test matrices.

#### 3) Log noise reduction in driver endpoint paths
- **PR:** [#11870](https://github.com/apache/incubator-gluten/pull/11870) — `[VL] Refine logs`
- **Issue:** [#11863](https://github.com/apache/incubator-gluten/issues/11863) — `[VL] reduce log level for endpoint logs`

This change reduces unnecessary WARN-level logging. It improves operability by making real failures easier to spot in noisy distributed logs.

#### 4) SQL/result correctness fix for native Union output naming
- **PR:** [#11832](https://github.com/apache/incubator-gluten/pull/11832) — `[VL] Fix native Union result name`

This is a query correctness and compatibility refinement. Result column naming mismatches in native execution can cause downstream failures, confusing plan inspection, or schema-sensitive test issues.

#### 5) Spark 4.x test compatibility progress
- **PR:** [#11833](https://github.com/apache/incubator-gluten/pull/11833) — `[VL] Enable GlutenLogicalPlanTagInSparkPlanSuite (150/150 tests)`

Although framed as test enablement, this is an important compatibility milestone. Passing disabled Spark 4.0/4.1 suites suggests Gluten is improving alignment with newer Spark planner behavior, especially around physical-plan node replacement and tag propagation.

#### 6) Continuous upstream Velox syncs closed
- **PRs:** [#11866](https://github.com/apache/incubator-gluten/pull/11866), [#11856](https://github.com/apache/incubator-gluten/pull/11856), [#11845](https://github.com/apache/incubator-gluten/pull/11845)

These daily Velox version update PRs show Gluten continues to track upstream execution engine changes aggressively. The merged/closed updates include upstream work around **type coercion**, **TIMESTAMP WITH TIME ZONE**, and other execution internals—important signals for future SQL type compatibility.

---

## 4. Community Hot Topics

### 1) Long-running tracker for unmerged upstream Velox work
- **Issue:** [#11585](https://github.com/apache/incubator-gluten/issues/11585) — `[VL] useful Velox PRs not merged into upstream`
- **Activity:** 16 comments, 4 👍

This is the most socially active issue in the current set. It reflects a structural challenge in Gluten’s architecture: the project depends heavily on Velox, but some needed features/fixes live in a gap between Gluten needs and upstream Velox merge timing. The technical need here is clear: **reduce downstream patch carry**, avoid local forks, and accelerate upstreamability of execution-engine changes.

### 2) Timestamp support on Velox backend remains a strategic compatibility gap
- **Issue:** [#1433](https://github.com/apache/incubator-gluten/issues/1433) — `[VL] Support timestamp on Velox backend`
- **PRs:** [#11626](https://github.com/apache/incubator-gluten/pull/11626), [#11720](https://github.com/apache/incubator-gluten/pull/11720)
- **Activity:** 10 comments

Timestamp support is still one of the clearest long-term roadmap threads. The issue shows partial progress—conversions and scans exist—but function coverage and validation behavior remain incomplete. This is not a niche feature: timestamp semantics affect broad Spark SQL compatibility, correctness, and fallback behavior.

### 3) Timezone correctness regression with GMT
- **Issue:** [#11862](https://github.com/apache/incubator-gluten/issues/11862) — `Native validation fails when Spark session timezone is GMT`
- **Fix PR:** [#11869](https://github.com/apache/incubator-gluten/pull/11869)

This newly reported bug got rapid follow-up. It highlights a subtle but important technical need: **Spark-to-Velox timezone normalization**, especially across OS-specific native libraries. The fast turnaround suggests maintainers see this as a correctness blocker rather than a low-priority edge case.

### 4) CI and build policy breakage
- **Issue:** [#11872](https://github.com/apache/incubator-gluten/issues/11872) — `[VL] Fix Gluten CI image build`
- **Fix PR:** [#11873](https://github.com/apache/incubator-gluten/pull/11873)

This reflects immediate infrastructure pressure from Apache GitHub Actions policy changes. The need is less about engine capability and more about **project operability and contributor productivity**.

### 5) Proposal for execution-aware dynamic join strategy
- **Issue:** [#11808](https://github.com/apache/incubator-gluten/issues/11808) — `Proposal: Add execution-aware dynamic join strategy selection after filter execution`

This proposal suggests pushing join strategy adaptation deeper into execution-aware behavior after build-side filters are materialized. It aligns with today’s merged AQE-based hash-build-side fix and may signal a broader direction toward **more adaptive native planning**.

---

## 5. Bugs & Stability

Ranked by apparent severity and user impact.

### High severity

#### 1) HashBuild OOM due to wrong build side
- **Issue:** [#11774](https://github.com/apache/incubator-gluten/issues/11774)
- **Fix:** [#11775](https://github.com/apache/incubator-gluten/pull/11775) — closed

A production-relevant memory stability issue in join execution. This is the most serious resolved item in the current update window because it can crash queries under realistic workloads.

#### 2) Native validation failure when Spark session timezone is GMT
- **Issue:** [#11862](https://github.com/apache/incubator-gluten/issues/11862)
- **Fix PR:** [#11869](https://github.com/apache/incubator-gluten/pull/11869) — open

This is a correctness/compatibility blocker for environments using `GMT`, especially on macOS. Severity is high because timezone mismatches can trigger fallback or invalid native behavior in otherwise normal SQL usage.

### Medium severity

#### 3) Parquet file generated by parquet-thrift fails to read
- **Issue:** [#11865](https://github.com/apache/incubator-gluten/issues/11865)

This appears to be a **file-format compatibility bug** involving Parquet converted type handling (`VARCHAR`). Severity is medium-high because storage interoperability is critical in analytics stacks; if confirmed broadly, this could affect ingestion of externally generated datasets. No fix PR is listed yet.

#### 4) Missing/incorrect Generate metrics wiring
- **PR:** [#11861](https://github.com/apache/incubator-gluten/pull/11861) — `Fix Generate metrics and refactor to use VeloxMetricsApi`

The PR description indicates a silent `NoSuchElementException` was being swallowed while updating metrics. This is less likely to corrupt query results, but it weakens observability and can hide runtime issues.

### Low severity

#### 5) Excessive WARN logs in driver endpoint path
- **Issue:** [#11863](https://github.com/apache/incubator-gluten/issues/11863)
- **Fix:** [#11870](https://github.com/apache/incubator-gluten/pull/11870)

Operational annoyance rather than engine instability; already addressed.

#### 6) CI image build broken by disallowed GitHub Actions
- **Issue:** [#11872](https://github.com/apache/incubator-gluten/issues/11872)
- **Fix PR:** [#11873](https://github.com/apache/incubator-gluten/pull/11873)

Project infrastructure issue rather than user runtime bug, but urgent for contributor workflow.

---

## 6. Feature Requests & Roadmap Signals

### 1) Fuller timestamp and TIMESTAMP_NTZ support on Velox
- **Issue:** [#1433](https://github.com/apache/incubator-gluten/issues/1433)
- **PRs:** [#11626](https://github.com/apache/incubator-gluten/pull/11626), [#11720](https://github.com/apache/incubator-gluten/pull/11720)

This remains one of the strongest roadmap signals. Given active PRs and upstream Velox type-system movement, expanded timestamp support is likely to land incrementally in upcoming releases.

### 2) Dynamic join strategy selection after filter execution
- **Issue:** [#11808](https://github.com/apache/incubator-gluten/issues/11808)

This proposal is notable because it moves beyond static optimization toward **execution-aware adaptive planning**. Since Gluten just closed a related AQE runtime-stats fix, this idea has a plausible path into future work.

### 3) Spark 4.0 enhanced test enablement
- **PR:** [#11868](https://github.com/apache/incubator-gluten/pull/11868)

Not a user-facing feature by itself, but it signals active preparation for newer Spark compatibility. This matters for adopters planning upgrades.

### 4) ClickHouse CI update for new TPC-DS schema
- **Issue:** [#11871](https://github.com/apache/incubator-gluten/issues/11871)

This suggests ongoing benchmark/validation maintenance for the ClickHouse backend. It indicates sustained multi-backend support rather than Velox-only focus.

### 5) JDK 25 support
- **Issue:** [#11867](https://github.com/apache/incubator-gluten/issues/11867)

This is an ecosystem-alignment request. Because it references Spark alignment and the next LTS trajectory, it has a good chance of getting traction soon, especially if downstream build/test blockers are manageable.

### 6) Better build provenance visibility
- **PR:** [#11838](https://github.com/apache/incubator-gluten/pull/11838) — `Expose Gluten build information in Spark configuration`

This is a practical operability feature that can help users identify exact Git revisions in production jobs. It is the kind of low-risk improvement likely to be accepted relatively quickly.

### Likely next-version candidates
Most likely near-term inclusions based on current activity:
- GMT timezone compatibility fix: [#11869](https://github.com/apache/incubator-gluten/pull/11869)
- Docker/CI policy fix: [#11873](https://github.com/apache/incubator-gluten/pull/11873)
- Generate metrics fix: [#11861](https://github.com/apache/incubator-gluten/pull/11861)
- Continued TIMESTAMP_NTZ support work: [#11626](https://github.com/apache/incubator-gluten/pull/11626), [#11720](https://github.com/apache/incubator-gluten/pull/11720)

---

## 7. User Feedback Summary

The strongest user pain points visible today are:

- **Correctness under real-world SQL semantics**, especially timestamps and timezones:
  - [#1433](https://github.com/apache/incubator-gluten/issues/1433)
  - [#11862](https://github.com/apache/incubator-gluten/issues/11862)

- **Memory stability for joins under AQE/native execution**:
  - [#11774](https://github.com/apache/incubator-gluten/issues/11774)

- **Storage interoperability**, specifically reading Parquet produced by other toolchains:
  - [#11865](https://github.com/apache/incubator-gluten/issues/11865)

- **Developer/operator friction from CI and logging noise**:
  - [#11501](https://github.com/apache/incubator-gluten/issues/11501)
  - [#11872](https://github.com/apache/incubator-gluten/issues/11872)
  - [#11863](https://github.com/apache/incubator-gluten/issues/11863)

Feedback is less about raw performance bragging today and more about **compatibility hardening**—a normal sign for a project maturing from acceleration-focused adoption into production reliability expectations. The project appears responsive: several reported issues already have fixes merged or PRs opened within a day.

---

## 8. Backlog Watch

### 1) Upstream Velox dependency gap tracker needs continued maintainer attention
- **Issue:** [#11585](https://github.com/apache/incubator-gluten/issues/11585)

This issue is strategically important and likely to stay open for a long time. It deserves regular pruning and prioritization because carried downstream Velox deltas increase maintenance cost and can slow release confidence.

### 2) Timestamp support issue remains open since 2023
- **Issue:** [#1433](https://github.com/apache/incubator-gluten/issues/1433)

This is the clearest long-running functional gap in the dataset. It has movement, but the age of the issue suggests it still needs coordinated ownership across validation, expression support, and storage/path handling.

### 3) TIMESTAMP_NTZ support PR still open
- **PR:** [#11626](https://github.com/apache/incubator-gluten/pull/11626)

Given the importance of timestamp compatibility, this PR likely warrants focused review attention.

### 4) Timestamp validation fallback configurability PR still open
- **PR:** [#11720](https://github.com/apache/incubator-gluten/pull/11720)

This is a useful bridge for developers and testers while full support matures. It may be low-risk enough to merge sooner if broader timestamp support remains incomplete.

### 5) Iceberg write configuration support still open
- **PR:** [#11776](https://github.com/apache/incubator-gluten/pull/11776)

Iceberg remains a high-value ecosystem integration point. This PR could matter for users deploying Gluten in modern lakehouse environments.

### 6) Build provenance visibility PR still open
- **PR:** [#11838](https://github.com/apache/incubator-gluten/pull/11838)

A relatively small but operationally useful enhancement that may be worth fast-tracking.

---

## Overall Health Signal

Apache Gluten looks **active and healthy**, with strong maintainer responsiveness and clear progress on both engine correctness and project infrastructure. The main risks are not inactivity but rather **technical breadth**: timestamp semantics, timezone handling, Parquet interoperability, Spark 4.x compatibility, and upstream Velox dependency management all compete for attention. If current turnaround on bugs continues, near-term stability should improve, especially for Velox users.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-04-03

## 1) Today's Overview

Apache Arrow had a moderately busy day with **33 issues updated** and **20 pull requests updated**, indicating steady cross-component maintenance rather than a release-driven spike. Activity was concentrated in **Python packaging/runtime compatibility**, **R/CRAN readiness**, **CI reliability**, and **C++/Parquet/codec correctness**. No new releases were published, but several changes merged or closed today reduced platform friction and cleaned up deprecated or failing paths. Overall project health looks **stable but maintenance-heavy**, with notable attention on ecosystem compatibility ahead of future releases.

## 2) Project Progress

### Merged / closed PRs and what they advanced

- **[Python] Remove `"mimalloc"` from mandatory test backends** — closed via [PR #49645](https://github.com/apache/arrow/pull/49645), resolving [Issue #49295](https://github.com/apache/arrow/issues/49295)  
  This improves **packaging portability** for downstream distributions that disable mimalloc, preventing false test failures. It is a practical reliability fix for Python consumers and distro maintainers.

- **[Python] Deprecate `pyarrow.gandiva`** — closed via [PR #49637](https://github.com/apache/arrow/pull/49637), resolving [Issue #49227](https://github.com/apache/arrow/issues/49227)  
  This is an important **API surface simplification** signal. Arrow is trimming underused Python bindings around Gandiva, likely reducing maintenance burden and clarifying the preferred compute stack.

- **[R] Fix crash / invalid conversion with zero-length `POSIXct` under R 4.5.2+** — closed via [PR #49619](https://github.com/apache/arrow/pull/49619), resolving [Issue #48832](https://github.com/apache/arrow/issues/48832)  
  This is a concrete **correctness and compatibility fix** in Arrow’s R conversion layer, especially relevant for edge-case timestamp serialization to Parquet.

- **[CI][Packaging] Pin setuptools `< 80` for musllinux Python 3.10 wheel builds** — closed via [PR #49639](https://github.com/apache/arrow/pull/49639), resolving [Issue #49638](https://github.com/apache/arrow/issues/49638)  
  This addresses **wheel build stability** where old pandas had to be built from source on musllinux. It reduces packaging breakage for binary distribution pipelines.

- **Delete failing conan-related packaging jobs and CI** — closed via [PR #49647](https://github.com/apache/arrow/pull/49647), resolving [Issue #48766](https://github.com/apache/arrow/issues/48766)  
  This is more of a **CI hygiene / technical debt reduction** change, removing packaging infrastructure that had been broken for months.

- **Remove deprecated old MinGW AWS CMake fixes** — closed via [PR #49633](https://github.com/apache/arrow/pull/49633)  
  This simplifies older compatibility logic in build tooling and suggests maintainers are comfortable dropping legacy compiler workarounds.

### Open PRs with strong product impact

- **[C++] Fix Hadoop LZ4 compatibility for large blocks** — [PR #49642](https://github.com/apache/arrow/pull/49642)  
  High-value storage interoperability work. It addresses Arrow-written LZ4 Hadoop frames that exceed Hadoop decompressor expectations, directly affecting **cross-engine read compatibility**.

- **[C++][Parquet] Check integer overflow when coercing timestamps** — [PR #49615](https://github.com/apache/arrow/pull/49615)  
  Potentially important **data correctness** protection for Parquet writers.

- **[C++][FlightRPC] Windows CI to support ODBC DLL & MSI signing** — [PR #49603](https://github.com/apache/arrow/pull/49603)  
  Signals continued investment in **Flight SQL ODBC packaging and enterprise distribution**.

- **[Python] Deprecate Feather Python APIs** — [PR #49590](https://github.com/apache/arrow/pull/49590)  
  Another roadmap-level simplification: pushing users toward **Arrow IPC** as the canonical format path.

## 3) Community Hot Topics

### Most discussed / highest-signal items

- **[C++] Add a `strptime` option for `%y` century cutoff** — [Issue #31951](https://github.com/apache/arrow/issues/31951)  
  Longstanding request with the highest comment count in this snapshot. The technical need is clear: users want **predictable parsing of 2-digit years**, especially in R/C++ data ingestion pipelines where legacy date formats remain common.

- **[Python] test_memory.py fails with `-DARROW_MIMALLOC=OFF`** — [Issue #49295](https://github.com/apache/arrow/issues/49295), fixed by [PR #49645](https://github.com/apache/arrow/pull/49645)  
  This reflects a recurring Arrow theme: **tests assuming optional components are always enabled**. Downstream packagers need dynamic capability detection.

- **[Python] Deprecate `pyarrow.gandiva`** — [Issue #49227](https://github.com/apache/arrow/issues/49227), addressed by [PR #49637](https://github.com/apache/arrow/pull/49637)  
  The underlying need is product clarity. The community appears to prefer maintaining stronger core Python/C++ compute paths rather than preserving niche modules.

- **[Python] Require NumPy 2.x** — [Issue #48473](https://github.com/apache/arrow/issues/48473)  
  A major ecosystem compatibility discussion. This points to pressure to modernize dependencies now that NumPy 1.26 is EOL, but also implies downstream compatibility risk for users pinned to older stacks.

- **[Python] Convert multidimensional arrays automatically to `FixedShapeTensorArray`** — [Issue #35647](https://github.com/apache/arrow/issues/35647)  
  This is a notable signal from ML/scientific users. It suggests demand for more natural handling of **tensor-like array data** in PyArrow.

- **[R] Document how sorting affects Parquet file size** — [Issue #31953](https://github.com/apache/arrow/issues/31953)  
  A strong analytical-storage concern: users want practical guidance on **physical layout optimization**, compression behavior, and file size sensitivity to sort order.

## 4) Bugs & Stability

### Ranked by likely severity / impact

1. **Potential Parquet timestamp corruption from integer overflow**  
   - Open fix: [PR #49615](https://github.com/apache/arrow/pull/49615)  
   This is the most serious active item from a storage-engine perspective. Silent overflow during timestamp unit coercion can create **incorrect persisted data**, which is worse than a simple crash.

2. **`pyarrow._compute` import path appears to contain AVX instructions despite SSE4.2 defaults**  
   - Issue: [#49640](https://github.com/apache/arrow/issues/49640)  
   This may affect **CPU compatibility and import-time stability** on systems lacking AVX support. If confirmed, it is a high-priority runtime portability bug.

3. **MATLAB CI failing due to GitHub Action permission restrictions**  
   - Issue: [#49611](https://github.com/apache/arrow/issues/49611)  
   - Fix PR: [#49650](https://github.com/apache/arrow/pull/49650)  
   Not a user-facing engine bug, but it weakens validation coverage for MATLAB bindings.

4. **Musllinux wheels for Python 3.10 failing due to pandas source build problems**  
   - Issue: [#49638](https://github.com/apache/arrow/issues/49638)  
   - Fixed by [PR #49639](https://github.com/apache/arrow/pull/49639)  
   Packaging regression now mitigated.

5. **R zero-length datetime write failure in Parquet on R 4.5.2**  
   - Issue: [#48832](https://github.com/apache/arrow/issues/48832)  
   - Fixed by [PR #49619](https://github.com/apache/arrow/pull/49619)  
   A narrow but real correctness bug impacting R serialization workflows.

6. **Conan packaging jobs failing for months**  
   - Issue: [#48766](https://github.com/apache/arrow/issues/48766)  
   - Closed by [PR #49647](https://github.com/apache/arrow/pull/49647)  
   Resolved by removal, which improves CI signal quality.

## 5) Feature Requests & Roadmap Signals

### Strong current signals

- **Tensor / multidimensional array ergonomics in Python**
  - [Issue #35647](https://github.com/apache/arrow/issues/35647)
  - [Issue #49644](https://github.com/apache/arrow/issues/49644)  
  Multiple requests point toward better first-class support for **FixedShapeTensor** construction and inference. This looks like a plausible near-term Python usability improvement.

- **Arrow IPC dictionary deduplication control**
  - [Issue #49646](https://github.com/apache/arrow/issues/49646)  
  This is a storage-efficiency and IPC authoring request. It could matter for users building highly repeated categorical payloads and may evolve into a useful low-level writer capability.

- **Flight SQL ODBC maturation**
  - [Issue #49651](https://github.com/apache/arrow/issues/49651)
  - [Issue #49652](https://github.com/apache/arrow/issues/49652)
  - [PR #46099](https://github.com/apache/arrow/pull/46099)
  - [PR #49603](https://github.com/apache/arrow/pull/49603)  
  This is one of the clearest roadmap themes: **ODBC distribution, static linkage, and Windows signing workflows** are actively being built out, suggesting stronger enterprise SQL connectivity support in upcoming versions.

- **Dependency modernization**
  - [Issue #48473](https://github.com/apache/arrow/issues/48473)  
  Requiring **NumPy 2.x** is a substantial future-facing change and likely to land in a major or coordinated compatibility release rather than a quiet patch.

- **Deprecation of older Python APIs**
  - [PR #49590](https://github.com/apache/arrow/pull/49590)
  - [Issue #49227](https://github.com/apache/arrow/issues/49227) / [PR #49637](https://github.com/apache/arrow/pull/49637)  
  Expect continued simplification around **Feather-specific** and **Gandiva-specific** Python interfaces in favor of IPC and mainstream compute APIs.

### Most likely to appear soon
Likely near-term inclusions are:
- R/CI hardening for CRAN compliance: [Issue #49654](https://github.com/apache/arrow/issues/49654), [PR #49655](https://github.com/apache/arrow/pull/49655)
- ODBC test-linkage improvements: [#49651](https://github.com/apache/arrow/issues/49651), [#49652](https://github.com/apache/arrow/issues/49652)
- LZ4 Hadoop compatibility fix: [PR #49642](https://github.com/apache/arrow/pull/49642)
- Parquet timestamp overflow protection: [PR #49615](https://github.com/apache/arrow/pull/49615)

## 6) User Feedback Summary

Several recurring user pain points stand out:

- **Packaging assumptions break real-world distro builds**  
  Seen in mimalloc and musllinux/pandas issues:
  - [Issue #49295](https://github.com/apache/arrow/issues/49295)
  - [Issue #49638](https://github.com/apache/arrow/issues/49638)  
  Users and maintainers want Arrow to better tolerate optional allocators and older dependency combinations.

- **Interoperability matters as much as raw functionality**  
  The Hadoop-framed LZ4 PR shows users care whether Arrow output works in adjacent ecosystems:
  - [PR #49642](https://github.com/apache/arrow/pull/49642)

- **Storage behavior needs better transparency**
  - Parquet file size sensitivity to sorting: [Issue #31953](https://github.com/apache/arrow/issues/31953)
  - Request for stripe-size-like control / row-group sizing discussion: [Issue #46010](https://github.com/apache/arrow/issues/46010)  
  This reflects practical warehouse-style optimization needs: users want better control over physical layout and compression efficiency.

- **Schema evolution and ingestion flexibility remain important**
  - Infer Parquet schema from the last file: [Issue #31923](https://github.com/apache/arrow/issues/31923)
  - JSON mixed singleton/array handling: [Issue #31403](https://github.com/apache/arrow/issues/31403)  
  These requests show demand for more resilient handling of messy, evolving production data.

- **Python users want more natural tensor semantics**
  - [Issue #35647](https://github.com/apache/arrow/issues/35647)
  - [Issue #49644](https://github.com/apache/arrow/issues/49644)  
  The feedback points to Arrow increasingly serving ML/scientific workloads, not just tabular analytics.

## 7) Backlog Watch

These older items remain open and appear important enough to merit maintainer attention:

- **`strptime` two-digit year cutoff control** — [Issue #31951](https://github.com/apache/arrow/issues/31951)  
  Longstanding parsing correctness/usability gap affecting legacy date ingestion.

- **Allow setting field metadata in R** — [Issue #33390](https://github.com/apache/arrow/issues/33390)  
  Important for schema fidelity and tests, especially where metadata drives downstream semantics.

- **Document Parquet file-size impact of sorting** — [Issue #31953](https://github.com/apache/arrow/issues/31953)  
  This is relatively small in implementation scope but high in user education value.

- **Enable Bloom filter compute on big-endian architectures** — [Issue #31946](https://github.com/apache/arrow/issues/31946)  
  Niche platform support, but still a correctness/completeness gap in compute portability.

- **Dataset schema inference from the last Parquet file** — [Issue #31923](https://github.com/apache/arrow/issues/31923)  
  Relevant to partitioned data with schema evolution.

- **Expose tracing capability in Arrow compute engine** — [Issue #31903](https://github.com/apache/arrow/issues/31903)  
  Potentially valuable for advanced execution-engine users and observability tooling.

- **Failure-path testing in execution engine / Substrait consumer** — [Issue #20248](https://github.com/apache/arrow/issues/20248)  
  Low comment count, but strategically important for robustness and avoiding crash-on-error behavior.

## 8) Overall Health Assessment

Arrow appears healthy and actively maintained, but today’s activity shows a project in a **compatibility and cleanup phase** rather than a feature-surge phase. The strongest engineering signals are around **removing fragile legacy paths**, **hardening packaging/CI**, and **improving interoperability** across Hadoop, ODBC, CRAN, and Linux wheel environments. For analytical storage engine users, the most meaningful near-term items are the **Parquet timestamp overflow safeguard**, **Hadoop LZ4 compatibility**, and **ongoing Flight SQL ODBC enablement**. For Python users, the roadmap is pointing toward a leaner API surface and better tensor/data interchange ergonomics.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*