# Apache Doris Ecosystem Digest 2026-03-20

> Issues: 11 | PRs: 145 | Projects covered: 10 | Generated: 2026-03-20 01:18 UTC

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

# Apache Doris Project Digest — 2026-03-20

## 1. Today's Overview

Apache Doris remained highly active today, with **145 pull requests updated** and **11 issues updated** in the last 24 hours, indicating strong ongoing engineering throughput. Development activity is concentrated around **multi-catalog/data lake integration, authentication, cloud/runtime behavior, SQL correctness, and branch stabilization for 4.0.x/4.1**. While there were **no new releases**, the volume of open and recently merged PRs suggests the project is in an intense integration and hardening phase rather than a release announcement cycle. Overall project health looks **active but operationally busy**, with meaningful forward progress accompanied by a visible backlog of stale feature requests and a few fresh compatibility/regression reports.

## 2. Project Progress

Today’s merged/closed PRs show progress in several important areas of the Doris analytical engine:

### SQL/query correctness and compatibility
- **Preserve `CurrentConnected` in `frontends()` TVF** — merged and being cherry-picked to maintenance branches, fixing an FE metadata/query correctness issue where `CURRENTCONNECTED='Yes'` could incorrectly match the master FE rather than the actual connected FE.  
  - Merged: [#61087](https://github.com/apache/doris/pull/61087)  
  - Branch picks: [#61532](https://github.com/apache/doris/pull/61532), [#61533](https://github.com/apache/doris/pull/61533)

- **Hudi query compatibility fix** — resolved a planner/type propagation issue that caused Doris to mis-handle HUDI table scans with the error `do not support DLA type HUDI`. This is relevant for lakehouse interoperability and correctness in external table optimization paths.  
  - [#58413](https://github.com/apache/doris/pull/58413)

- **Paimon/Iceberg version adaptation for FE** — branch work continues to align Doris FE with **Paimon 1.3.1** and **Iceberg 1.10.1**, reducing version-friction in external catalog support.  
  - Closed branch PR: [#61391](https://github.com/apache/doris/pull/61391)  
  - Follow-up branch work: [#61534](https://github.com/apache/doris/pull/61534)

### Authentication and metadata management
A notable stream of merged work is building out **Authentication Integration** as a first-class FE capability:
- **DDL support for authentication integration objects**  
  - [#60902](https://github.com/apache/doris/pull/60902)
- **Unified audit metadata for auth integrations**  
  - [#61172](https://github.com/apache/doris/pull/61172)
- **System table visibility for auth integrations**  
  - [#61246](https://github.com/apache/doris/pull/61246)

This cluster of changes suggests Doris is maturing enterprise identity/integration management and making it more queryable and governable through SQL.

### CI / branch management / maintenance
- **Required CI for branch-4.1** was added, improving release branch governance and quality gates.  
  - [#61364](https://github.com/apache/doris/pull/61364)

- **OpenCode review workflow timeout/error handling improvements** strengthen contributor workflow reliability.  
  - [#61530](https://github.com/apache/doris/pull/61530)

These are not end-user features, but they are strong indicators of release engineering discipline as Doris expands branch parallelism.

## 3. Community Hot Topics

Below are the most technically meaningful active items from today’s issue/PR stream.

### A. Iceberg DML support: update/delete/merge into
- PR: [#60482](https://github.com/apache/doris/pull/60482) — **Implements iceberg update delete merge into functionality**

This is one of the strongest roadmap signals in today’s data. Native or near-native support for Iceberg row-level operations is strategically important because users increasingly expect Doris to work not just as a query engine over lakehouse tables, but as a more complete **analytical execution layer** over Iceberg-managed datasets. The underlying technical need is clear: users want **warehouse-style mutation semantics** without abandoning open table formats.

### B. Routine Load with AWS MSK IAM auth
- PR: [#61324](https://github.com/apache/doris/pull/61324) — **Support RoutineLoad IAM auth**

This addresses a practical cloud-native ingestion need: secure Kafka/MSK access using IAM credentials, AssumeRole, and cross-account setups. The technical demand here is enterprise-grade ingestion into Doris from managed Kafka without embedding static secrets. This is especially relevant for production cloud deployments.

### C. Global memory control on scan nodes
- PR: [#61271](https://github.com/apache/doris/pull/61271) — **Global mem control on scan nodes**

This reflects continued pressure around workload isolation and resource governance in high-concurrency analytical clusters. The need is less about headline features and more about making Doris predictable under heavy scan workloads.

### D. Query execution optimization for `GROUP BY count(*)`
- PR: [#61260](https://github.com/apache/doris/pull/61260) — **Optimize the execution of GROUP BY count(*)**

This is a classic analytical-engine optimization: reducing per-group aggregation overhead for one of the most common OLAP patterns. It suggests the team is still investing in low-level engine efficiency, not only connectors and external catalogs.

### E. SQL DML feature demand from users
- Issue: [#56258](https://github.com/apache/doris/issues/56258) — **Support MERGE INTO**
- Issue: [#55547](https://github.com/apache/doris/issues/55547) — **Support MySQL-style `ON DUPLICATE KEY UPDATE`**

These requests indicate sustained user demand for more complete write/upsert semantics. Together with the Iceberg DML PR, they show Doris users want stronger convergence between OLAP performance and modern warehouse mutation ergonomics.

## 4. Bugs & Stability

Ranked by likely user impact and severity based on today’s updated items:

### 1. View query correctness: over-pruning with `ORDER BY`
- Open issue: [#61219](https://github.com/apache/doris/issues/61219)  
- Problem: In Doris 4.0.1, querying a view with `ORDER BY a, b LIMIT ...` may overly prune columns so that non-order-by columns become null/empty.
- Severity: **High**
- Why it matters: This is a **query correctness** issue, which is more serious than a cosmetic or performance bug because users may receive incomplete or misleading results.
- Fix PR: **No linked fix PR visible in today’s data**

### 2. Docker image packaging regression for 4.0.4
- Open issue: [#61525](https://github.com/apache/doris/issues/61525)  
- Problem: Docker images for 4.0.4 reportedly support **ARM64 only**, with AMD support missing.
- Severity: **High** for deployment usability
- Why it matters: This can block upgrades or fresh installs for x86_64 users, especially in enterprise environments where AMD64 remains dominant.
- Fix PR: **No visible fix PR in today’s data**

### 3. `frontends()` TVF connection-context bug
- Fixed PR: [#61087](https://github.com/apache/doris/pull/61087)  
- Severity: **Medium**
- Why it matters: This impacts FE metadata visibility and could mislead operators using system TVFs for cluster diagnostics.
- Status: Fixed and cherry-picked to branches via [#61532](https://github.com/apache/doris/pull/61532) and [#61533](https://github.com/apache/doris/pull/61533)

### 4. Hudi external query failure
- Fixed PR: [#58413](https://github.com/apache/doris/pull/58413)  
- Severity: **Medium**
- Why it matters: Affects external lakehouse query compatibility and planner correctness.
- Status: Closed/fixed

### 5. MaxCompute connector memory leak and large-write optimization
- Open PR: [#61245](https://github.com/apache/doris/pull/61245)  
- Severity: **Medium**
- Why it matters: Potential memory leaks in JNI scanner/writer code and inefficient large-data writes directly affect stability for connector-heavy workloads.
- Status: Reviewed and targeted at `dev/4.0.x`

### Lower-priority / stale closed bugs
These were closed as stale rather than clearly resolved:
- Missing `count_substrings` function in 3.0.6.1: [#55821](https://github.com/apache/doris/issues/55821)
- `JOIN USING` SQL standard compliance: [#55644](https://github.com/apache/doris/issues/55644)
- docs site CPU usage issue: [#42358](https://github.com/apache/doris/issues/42358)

Their closure suggests backlog cleanup, but not necessarily functional resolution.

## 5. Feature Requests & Roadmap Signals

Today’s issue activity exposes several recurring roadmap themes.

### Strongest signals
- **Standard SQL `MERGE INTO`**  
  - Issue: [#56258](https://github.com/apache/doris/issues/56258)  
  This is a major warehouse-compatibility feature and aligns directly with ongoing Iceberg DML work in [#60482](https://github.com/apache/doris/pull/60482). This makes it one of the most plausible candidates for future delivery, at least in external table/lakehouse scenarios first.

- **MySQL-style `ON DUPLICATE KEY UPDATE` semantics**  
  - Issue: [#55547](https://github.com/apache/doris/issues/55547)  
  This request reflects ETL users wanting partial-field upsert behavior. Doris’s primary key model covers some adjacent use cases, but users clearly want more familiar MySQL-compatible DML syntax and semantics.

### Secondary signals
- **UUID v7 function support**  
  - Issue: [#56260](https://github.com/apache/doris/issues/56260)  
  A smaller feature, but useful for time-ordered IDs in distributed ingestion pipelines.

- **Read/write support for Vortex columnar format**  
  - Issue: [#56261](https://github.com/apache/doris/issues/56261)  
  Interesting as an ecosystem/innovation request, but likely lower probability for near-term mainstream adoption unless broader industry momentum develops.

- **Upgrade Doris to C++23**  
  - Issue: [#61522](https://github.com/apache/doris/issues/61522)  
  More of a contributor/platform modernization proposal than a user-facing feature. Likelihood depends on toolchain compatibility, dependency matrix, and branch timing.

- **Hive catalog support for Azure Blob (`abfss://`)**
  - Stale/closed issue: [#55654](https://github.com/apache/doris/issues/55654)  
  Even though stale, it highlights continued demand for broader cloud object store interoperability in external catalog usage.

### Likely next-version candidates
Based on current PR momentum, the most likely near-term inclusions are:
1. **Authentication integration improvements** and FE-side auth chain completion
2. **More branch-stabilized fixes for 4.0.x / 4.1**
3. **External lake format compatibility improvements** for Iceberg/Paimon/Hudi
4. Potentially **cloud ingestion/auth enhancements**, such as MSK IAM for Routine Load

`MERGE INTO` appears strategically important, but whether it lands in the next release likely depends on scope: native table support is harder than targeted Iceberg integration.

## 6. User Feedback Summary

Today’s user-facing signals point to a few clear pain points:

- **SQL compatibility expectations are rising.** Users want Doris to behave more like mainstream databases/warehouses in DML and SQL semantics, especially around `MERGE INTO`, `ON DUPLICATE KEY UPDATE`, `JOIN USING`, and built-in function availability like `count_substrings`.
- **Correctness matters more than raw speed in reported issues.** The open view/`ORDER BY` pruning bug [#61219](https://github.com/apache/doris/issues/61219) is notable because it affects result integrity, not just performance.
- **Cloud and connector usability remain critical.** IAM auth for MSK, Azure Blob-backed Hive catalogs, MaxCompute memory handling, Hudi/Paimon/Iceberg compatibility, and Docker architecture availability all point to Doris being used in diverse production ecosystems where interoperability matters as much as core engine speed.
- **Deployment friction is still visible.** The ARM64-only Docker image report for 4.0.4 [#61525](https://github.com/apache/doris/issues/61525) suggests some release artifacts may need stronger multi-arch validation.

Overall, user demand is shifting beyond core OLAP querying toward **full-platform operability**: secure ingestion, open table formats, SQL ergonomics, and cloud-ready packaging.

## 7. Backlog Watch

These items appear important and likely need maintainer attention:

### Open issues needing active triage
- **View `ORDER BY` over-pruning / empty columns** — [#61219](https://github.com/apache/doris/issues/61219)  
  High priority due to query correctness implications.

- **Docker 4.0.4 AMD64 support missing** — [#61525](https://github.com/apache/doris/issues/61525)  
  Needs rapid packaging/release engineering response if confirmed.

- **C++23 upgrade proposal** — [#61522](https://github.com/apache/doris/issues/61522)  
  Worth clarifying feasibility and toolchain impact to avoid speculative backlog growth.

### Older feature requests with repeated user value but stale status
- **MySQL `ON DUPLICATE KEY UPDATE`** — [#55547](https://github.com/apache/doris/issues/55547)
- **Standard `MERGE INTO`** — [#56258](https://github.com/apache/doris/issues/56258)
- **UUID v7 support** — [#56260](https://github.com/apache/doris/issues/56260)
- **Vortex columnar read/write** — [#56261](https://github.com/apache/doris/issues/56261)

These are useful roadmap indicators, but their stale labeling suggests limited maintainer bandwidth or uncertain prioritization.

### Important open PRs that look strategically significant
- **Iceberg update/delete/merge support** — [#60482](https://github.com/apache/doris/pull/60482)  
  High strategic value; likely complex and deserving sustained review attention.

- **Routine Load IAM auth for AWS MSK** — [#61324](https://github.com/apache/doris/pull/61324)  
  Strong practical demand in cloud deployments.

- **Global scan-node memory control** — [#61271](https://github.com/apache/doris/pull/61271)  
  Important for multi-tenant stability and resource governance.

- **MaxCompute connector leak/write optimization** — [#61245](https://github.com/apache/doris/pull/61245)  
  Stability-sensitive and already reviewed; good candidate for accelerated merge if tests are solid.

---

## Bottom Line

Apache Doris is showing **strong engineering velocity and broad subsystem investment**, especially in **lakehouse interoperability, authentication, cloud integration, and branch stabilization**. The project’s immediate risks are not inactivity but rather **maintaining quality amid high change volume**, especially around query correctness and deployment packaging. The strongest roadmap signals continue to point toward **better external table semantics, richer SQL mutation support, and more enterprise/cloud-ready operability**.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-20

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem is highly active and increasingly convergent around a few themes: **lakehouse interoperability, SQL semantics expansion, cloud-native operability, and execution-engine efficiency**. Across query engines and table/storage projects, maintainers are spending as much effort on **correctness, packaging, metadata behavior, and connector reliability** as on raw query speed. The ecosystem is also stratifying: some projects are broad analytical databases competing as full platforms, while others are becoming critical infrastructure layers for **open table formats, vectorized execution, embedded analytics, or interoperability**. Overall, the market is healthy, but the engineering burden is shifting from “build features” to “make complex distributed and multi-engine behavior predictable.”

---

## 2. Activity Comparison

### Daily activity snapshot

| Project | Issues Updated | PRs Updated | Release Status | Health Score* | Notes |
|---|---:|---:|---|---:|---|
| **Apache Doris** | 11 | 145 | No new release | **8.6/10** | Very high engineering throughput; heavy branch stabilization and lakehouse/auth work |
| **ClickHouse** | 63 | 389 | **3 releases** | **9.2/10** | Highest visible throughput; simultaneous stable/LTS patch releases |
| **DuckDB** | 78 | 42 | No new release | **8.7/10** | Strong maintainer responsiveness; focus on correctness and cloud/object-store behavior |
| **StarRocks** | 9 | 137 | No new release | **8.3/10** | High PR throughput, but current correctness-sensitive bug profile |
| **Apache Iceberg** | 11 | 46 | No new release | **8.5/10** | Active review/maintenance cycle; patch prep signals for 1.10.2 |
| **Delta Lake** | 2 | 29 | No new release | **8.0/10** | Healthy but lower visible issue volume; DSv2/kernel evolution continues |
| **Databend** | 4 | 12 | No new release | **7.7/10** | Productively evolving, but fresh panic-class bugs weigh on stability signal |
| **Velox** | 9 | 50 | No new release | **8.4/10** | Strong engine innovation; some compatibility/build sharp edges |
| **Apache Gluten** | 8 | 12 | No new release | **7.5/10** | Active but still maturing, especially around Flink/GPU/runtime robustness |
| **Apache Arrow** | 22 | 17 | No new release | **8.1/10** | Healthy infra/ecosystem momentum; fewer landed items today |

\*Health score is a qualitative synthesis of throughput, release discipline, bug severity mix, and visible maintainer responsiveness from today’s digest.

### Readout
- **Most active overall:** ClickHouse, Doris, StarRocks  
- **Most release-active today:** ClickHouse  
- **Most infrastructure/ecosystem-oriented today:** Arrow, Iceberg, Delta  
- **Most correctness-sensitive today:** Doris, StarRocks, Databend, Velox

---

## 3. Apache Doris's Position

### Where Doris looks strong versus peers
Apache Doris currently stands out as a **high-throughput analytical database project** that is investing simultaneously in:
- **core SQL/query correctness**
- **multi-catalog and lakehouse interoperability**
- **authentication/governance surfaces**
- **cloud ingestion and deployment operability**
- **multi-branch release discipline**

Compared with peers, Doris appears especially strong in its effort to become a **full analytical platform**, not just a fast query engine. Today’s work on **authentication integration objects**, **Hudi/Paimon/Iceberg compatibility**, **Routine Load IAM auth**, and branch hardening shows it is addressing enterprise deployment realities directly.

### Technical approach differences
Relative to:
- **ClickHouse**: Doris looks more focused on **warehouse/lakehouse convergence and SQL platform ergonomics**, while ClickHouse remains stronger in low-level scan pruning, distributed execution tuning, and release throughput.
- **DuckDB**: Doris targets **distributed service deployment**, while DuckDB is optimized for **embedded/local analytics** with growing cloud-read capability.
- **StarRocks**: Doris and StarRocks are closest peers; Doris currently shows more visible investment in **auth integration and external catalog version alignment**, while StarRocks shows strong shared-data/cloud-native work but more acute current correctness issues in joins and Iceberg cache semantics.
- **Iceberg/Delta**: Doris consumes and integrates with open table formats; Iceberg and Delta define the table abstraction layers themselves.
- **Velox/Arrow/Gluten**: these are enabling layers, not direct “Doris-like” database competitors.

### Community size comparison
On today’s numbers:
- Doris is in the **top tier of database-engine activity**, behind ClickHouse in absolute PR volume but ahead of many others.
- It is clearly larger in visible daily engine activity than Databend, Delta, Gluten, Arrow, and Iceberg.
- Its nearest activity peers today are **ClickHouse and StarRocks** among OLAP databases.

### Current caution areas
Doris’s main risk is not lack of momentum; it is **quality management under high change volume**. The open **view `ORDER BY` correctness bug** and **Docker AMD64 packaging regression** are reminders that fast-moving platform projects need strong release validation.

---

## 4. Shared Technical Focus Areas

Several requirements are showing up across multiple engines at once.

### A. Lakehouse/open table format interoperability
**Engines:** Doris, StarRocks, Iceberg, Delta, Velox, Gluten, DuckDB  
**Specific needs:**
- Iceberg DML / delete / merge semantics (**Doris, Velox, Iceberg**)
- snapshot expiration and refresh correctness (**StarRocks, Iceberg**)
- schema evolution / type widening (**Gluten, Iceberg, Delta**)
- external table scan correctness for Hudi/Paimon/Iceberg (**Doris**)
- metadata caching and invalidation safety (**StarRocks, Iceberg**)

**Interpretation:** open table format support is no longer optional; users expect engines to behave correctly across snapshots, mutations, and evolving schemas.

### B. Cloud-native auth, object storage, and credential lifecycle
**Engines:** Doris, Iceberg, DuckDB, Arrow, Delta, Gluten  
**Specific needs:**
- IAM/MSK ingestion auth (**Doris**)
- S3/GCS credential refresh for long-running jobs (**Iceberg**)
- S3 request amplification / throttling / ETag issues (**DuckDB**)
- ODBC packaging and cloud filesystem parity (**Arrow**)
- metadata path efficiency in object storage (**Delta**)
- S3 lifecycle/finalization correctness (**Gluten**)

**Interpretation:** cloud runtime behavior is now a first-class product requirement, not a connector afterthought.

### C. SQL compatibility and richer mutation semantics
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Velox, Gluten  
**Specific needs:**
- `MERGE INTO`, `ON DUPLICATE KEY UPDATE` expectations (**Doris**)
- parser compatibility regressions (**ClickHouse**)
- collation / CASE / UNNEST semantics (**DuckDB**)
- stored procedures demand (**StarRocks**)
- Spark-compatible null/date/aggregate semantics (**Velox, Gluten**)

**Interpretation:** users increasingly benchmark engines against both **warehouse SQL** and **Spark SQL** behavior, not just ANSI fragments.

### D. Correctness over performance-only optimization
**Engines:** Doris, StarRocks, Iceberg, Velox, Databend, ClickHouse  
**Specific needs:**
- wrong-result bugs in views/joins/cache paths (**Doris, StarRocks**)
- recovery correctness and duplicate writes (**Iceberg**)
- semantic mismatches in aggregate/date behavior (**Velox**)
- parser/planner panics (**Databend**)
- parser/format correctness regressions (**ClickHouse**)

**Interpretation:** the ecosystem is mature enough that **silent wrong results** now matter more than benchmark wins.

### E. Smarter pruning, adaptive execution, and resource governance
**Engines:** ClickHouse, Doris, DuckDB, Databend, Gluten  
**Specific needs:**
- statistics-based part pruning and `ORDER BY LIMIT` pruning (**ClickHouse**)
- global scan-node memory control (**Doris**)
- row-group and nested pushdown (**DuckDB**)
- aggregate rewrite and type shrinking (**Databend**)
- DPP and block stats for pruning (**Gluten**)

**Interpretation:** engines are shifting from brute-force speed to **more intelligent and predictable execution**.

---

## 5. Differentiation Analysis

### Storage format orientation
- **Apache Doris / StarRocks / ClickHouse / Databend**: integrated analytical databases with their own native storage paths, but increasingly connected to external lake formats.
- **DuckDB**: embedded analytical engine with strong Parquet/object-store emphasis; less about cluster-native serving.
- **Apache Iceberg / Delta Lake**: storage/table abstraction layers rather than full SQL-serving OLAP databases.
- **Velox / Arrow / Gluten**: execution/runtime and interoperability infrastructure, not primary storage systems.

### Query engine design
- **Doris / StarRocks / ClickHouse / Databend**: server-side MPP/vectorized analytics engines.
- **DuckDB**: embedded vectorized engine optimized for local execution and in-process analytics.
- **Velox**: reusable vectorized execution engine for other systems.
- **Gluten**: Spark acceleration layer, often via Velox.
- **Arrow**: columnar memory and transport substrate; some compute, but not positioned as a full warehouse engine.

### Target workloads
- **Doris / StarRocks**: real-time analytics + data warehouse + lakehouse federation.
- **ClickHouse**: high-throughput analytical serving, observability, time-series, distributed OLAP.
- **DuckDB**: local analytics, notebooks, ETL, embedded BI, cloud file analytics.
- **Iceberg / Delta**: table management and interoperability across compute engines.
- **Velox / Gluten**: acceleration and engine reuse for Spark/Presto-like environments.
- **Arrow**: data interchange, in-memory analytics, client/runtime interoperability.

### SQL compatibility posture
- **Doris**: trending toward broader warehouse-style DML and enterprise SQL operability.
- **ClickHouse**: historically distinctive SQL dialect, but steadily improving optimizer and parser ergonomics.
- **DuckDB**: broad SQL ambition with growing edge-case scrutiny.
- **StarRocks**: warehouse migration pressure visible, including stored procedures interest.
- **Velox/Gluten**: compatibility judged largely by **Spark parity**.
- **Iceberg/Delta**: semantics expressed through integrating engines more than their own SQL endpoints.

---

## 6. Community Momentum & Maturity

### Tier 1: Rapidly iterating platform leaders
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

These projects show very high PR velocity and broad subsystem work. ClickHouse is the most visibly mature in release operations today; Doris is in a strong expansion-and-hardening phase; StarRocks is highly active but currently more correctness-sensitive.

### Tier 2: Mature but specialized or layered ecosystems
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **Velox**
- **Apache Arrow**

These projects are mature in different ways:
- DuckDB: product maturity with intense correctness/perf iteration
- Iceberg/Delta: infrastructure maturity for open table ecosystems
- Velox: strong engine-core innovation
- Arrow: ecosystem and packaging maturity

### Tier 3: Emerging / maturing fast
- **Databend**
- **Apache Gluten**

These projects are moving quickly, but today’s signals show they still have sharper edges in parser/planner/runtime maturity or integration stability.

### Stabilizing versus expanding
- **Stabilizing now:** ClickHouse, Iceberg, Delta, Arrow
- **Expanding feature surface aggressively:** Doris, StarRocks, Velox, DuckDB
- **Still tightening fundamentals:** Databend, Gluten

---

## 7. Trend Signals

### 1. Open table format support is becoming table stakes
Data engineers increasingly expect databases to read, optimize, and sometimes mutate **Iceberg/Hudi/Paimon/Delta-style datasets** without losing correctness. This matters for architects designing mixed-engine lakehouse stacks.

### 2. Correctness bugs now carry more weight than raw performance claims
Wrong results, duplicate writes, stale metadata, parser regressions, and silent empties are appearing prominently across projects. For technical decision-makers, this means evaluation should emphasize **semantic reliability and failure modes**, not just benchmarks.

### 3. Cloud operability is a core product dimension
Credential refresh, IAM auth, object-store request behavior, packaging for cloud-adjacent clients, and cross-arch artifact quality all surfaced today. For platform teams, “cloud-native” now means **auth lifecycle + packaging + metadata efficiency + object-store behavior**, not merely S3 support.

### 4. SQL expectations are rising toward warehouse completeness
Users want `MERGE`, upsert semantics, procedural logic, better parser compatibility, and Spark/ANSI semantic predictability. Architects choosing engines for broader organizational use should expect increasing demand for **developer-friendly SQL semantics**, not just fast scans.

### 5. Execution engines are getting smarter, not just faster
Statistics-aware pruning, adaptive parallelism, resource governance, nested pushdown, and memory isolation all show a shift toward **predictable performance under real workloads**. This is valuable for multi-tenant platforms and cost-controlled cloud analytics.

### 6. The ecosystem is modularizing
A clear architecture pattern is emerging:
- **table layer:** Iceberg / Delta
- **engine layer:** Doris / ClickHouse / StarRocks / DuckDB / Databend
- **execution substrate:** Velox / Gluten
- **interop layer:** Arrow

For architects, this increases flexibility but also integration complexity; the differentiator is increasingly how well a project behaves at the boundaries.

---

## Bottom Line

**Apache Doris** remains one of the strongest full-platform OLAP projects in today’s snapshot: highly active, enterprise-oriented, and clearly investing in lakehouse compatibility, auth/governance, and branch discipline. **ClickHouse** still leads on sheer release and execution-engine momentum, while **StarRocks** is the closest direct competitive reference with similar platform ambitions but more acute correctness pressure today. For decision-makers, the strongest cross-ecosystem message is clear: the next competitive frontier is **correct, cloud-ready, lakehouse-aware analytics infrastructure**, not just faster SQL.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-20

## 1. Today's Overview

ClickHouse remained very active over the last 24 hours, with **63 issues updated**, **389 PRs updated**, and **3 new stable/LTS releases** published. The activity profile suggests a project in heavy stabilization-and-optimization mode: there is visible work on query pruning, parallel replicas, GROUP BY execution efficiency, CI hardening, and format/serialization correctness. At the same time, several fresh user reports point to regressions or behavior changes in the 26.x line, especially around parser compatibility, object storage deletion semantics, and data format fidelity. Overall, project health looks strong from a throughput perspective, but maintainers are clearly balancing rapid feature evolution with nontrivial correctness and operational stability pressure.

---

## 2. Releases

ClickHouse published three new releases today:

- [v26.2.5.45-stable](https://github.com/ClickHouse/ClickHouse/releases/tag/v26.2.5.45-stable)
- [v26.1.5.41-stable](https://github.com/ClickHouse/ClickHouse/releases/tag/v26.1.5.41-stable)
- [v25.8.19.20-lts](https://github.com/ClickHouse/ClickHouse/releases/tag/v25.8.19.20-lts)

### Release interpretation
The simultaneous publication of **two stable patch releases** plus **one LTS patch release** indicates coordinated maintenance across supported lines. This usually means the team is addressing production-facing bugfixes, backports, and compatibility fixes rather than introducing major new functionality in these tags.

### Breaking changes / migration notes signaled by current issue traffic
No formal breaking changes are listed in the supplied release metadata, but issue traffic suggests operators should watch for:

- **Behavior changes in 26.x parser compatibility**
  - [#100031 DESCRIBE TABLE (...) AS <alias> syntax broken since version 26](https://github.com/ClickHouse/ClickHouse/issues/100031)
- **Changed object storage deletion semantics**
  - [#99996 Add option to return synchronous deletion blob storage data during DROP TABLE ... SYNC execution](https://github.com/ClickHouse/ClickHouse/issues/99996)
  - This issue strongly suggests that from **26.2**, object-disk deletion during `DROP TABLE` became asynchronous, which may affect operational expectations, cleanup workflows, and automation.
- **Format/schema compatibility concerns**
  - [#100119 Arrow-based Parquet writer does not set UUID logical type in schema](https://github.com/ClickHouse/ClickHouse/issues/100119)

### Practical migration guidance
For users upgrading into the 26.x series, today's signals suggest validating:

1. SQL parser compatibility for introspection/query tooling.
2. DROP/cleanup behavior on object storage disks.
3. Interoperability of Arrow/Parquet UUID data with downstream consumers.
4. Distributed query behavior if using `skip_unavailable_shards` or parallel replicas.

---

## 3. Project Progress

Based on the PR stream, today’s progress is concentrated in three areas: **query execution efficiency**, **distributed execution correctness**, and **format/type-system robustness**.

### Query engine and optimizer progress
- [#94140 Add statistics-based part pruning](https://github.com/ClickHouse/ClickHouse/pull/94140)  
  A significant optimizer direction: using part statistics and MinMax-derived hyperrectangles to prune data earlier. This is a strong signal that ClickHouse is moving toward more cost-aware and metadata-driven scan reduction.
- [#99533 Prune parts for `ORDER BY LIMIT` queries on partitioned tables when `optimize_read_in_order=1`](https://github.com/ClickHouse/ClickHouse/pull/99533)  
  Advances read-in-order optimization for top-N style workloads, important for time-series and dashboard queries.
- [#99537 Enable `use_top_k_dynamic_filtering` and `use_skip_indexes_for_top_k` by default](https://github.com/ClickHouse/ClickHouse/pull/99537)  
  A strong sign that these optimizations are maturing and may become standard behavior in the next minor release.
- [#99495 Add `GradualResizeProcessor` to limit effective parallelism for GROUP BY on small data volumes](https://github.com/ClickHouse/ClickHouse/pull/99495)  
  Addresses overparallelization overhead; useful for interactive analytics where excessive thread fan-out hurts latency more than it helps throughput.

### Distributed execution and cluster behavior
- [#100141 Allow skipping local shard with missing table when `skip_unavailable_shards` is enabled](https://github.com/ClickHouse/ClickHouse/pull/100141)  
  Improves failure tolerance consistency between local and remote shards.
- [#100146 Fix distributed task iterator not initialized exception with parallel replicas](https://github.com/ClickHouse/ClickHouse/pull/100146)  
  Important correctness fix in parallel replica execution paths, especially with non-cluster table functions like `s3`, `url`, and `azure`.
- [#100139 Add `parallel_replicas_prefer_local_replica` setting](https://github.com/ClickHouse/ClickHouse/pull/100139)  
  Adds flexibility to replica selection, likely useful for balancing throughput and locality.

### SQL compatibility and usability
- [#100136 Allow parenthesized queries in EXPLAIN](https://github.com/ClickHouse/ClickHouse/pull/100136)  
  Small but meaningful parser/usability improvement.
- [#100132 Fix `accurateCastOrDefault` losing Const column type](https://github.com/ClickHouse/ClickHouse/pull/100132)  
  Improves semantic consistency in expression evaluation.
- [#99137 Improve `stem` function](https://github.com/ClickHouse/ClickHouse/pull/99137)  
  Continues investment in text-processing functions.
- [#99837 Rename unicode_word tokenizer to unicodeWord and improve docs](https://github.com/ClickHouse/ClickHouse/pull/99837)  
  A normalization/documentation improvement, useful for full-text and tokenization workloads.

### Storage/serialization internals
- [#96563 Added a serialization object pool](https://github.com/ClickHouse/ClickHouse/pull/96563)  
  Suggests ongoing work to reduce memory churn and internal object duplication.
- [#98416 Add `share_nested_offsets` MergeTree setting to disable legacy Nested offset sharing](https://github.com/ClickHouse/ClickHouse/pull/98416)  
  This is notable: it tackles long-standing awkwardness in Nested semantics and could improve schema flexibility and interoperability.

---

## 4. Community Hot Topics

### Most discussed issues and PRs

- [#85468 CI crash: Transaction log finalize failed during commit](https://github.com/ClickHouse/ClickHouse/issues/85468) — 25 comments  
  The most active issue in the list. This points to ongoing instability in transaction/commit paths, at least under CI stress. The underlying technical need is stronger transactional path validation in MergeTree-related code and better detection of rare commit-finalization races.
  
- [#49683 Allow interactive queries finish in the background](https://github.com/ClickHouse/ClickHouse/issues/49683) — 15 comments, 43 👍  
  This is the clearest product-demand signal in today’s issue set. Users want long-running interactive queries, especially `INSERT ... SELECT`, to survive client disconnects. The need is operational UX: job durability for analyst-driven sessions without forcing users to redesign workflows around batch orchestration.
  
- [#99960 Automatically Optimize Queries on Time-Partitioned Tables](https://github.com/ClickHouse/ClickHouse/issues/99960) — 10 comments  
  This reflects demand for smarter predicate rewriting when users filter base timestamps but tables are sorted/partitioned on monotonic derived expressions. It aligns strongly with current optimizer PRs and suggests users want less manual query shaping.
  
- [#94140 Add statistics-based part pruning](https://github.com/ClickHouse/ClickHouse/pull/94140)  
  Even without comment count provided, this is strategically important and likely to attract review because it extends pruning beyond classic partition/key logic into statistics-aware execution.
  
- [#99495 Add `GradualResizeProcessor` to limit effective parallelism for GROUP BY on small data volumes](https://github.com/ClickHouse/ClickHouse/pull/99495)  
  This addresses a real-world complaint class: “too many threads for too little data.” The technical need is adaptive execution, not just maximum-throughput execution.

### What these hot topics mean
The community focus is converging on three priorities:

1. **Smarter automatic optimization**  
   Users want the engine to infer more from schema and predicates rather than requiring hand-tuned SQL.

2. **Operational resilience**  
   Background continuation of interactive work and better shard-failure handling matter as much as raw speed.

3. **Stability in advanced execution paths**  
   CI crash reports and sanitizer findings show that low-level engine complexity remains a live challenge.

---

## 5. Bugs & Stability

Ranked by likely production severity:

### Critical
1. [#85468 CI crash: Transaction log finalize failed during commit](https://github.com/ClickHouse/ClickHouse/issues/85468)  
   A commit/finalization crash in transaction log handling is potentially severe because it touches durability-sensitive code paths. No direct fix PR is listed in the provided PR set.

2. [#99799 CI crash: Double deletion of MergeTreeDataPartCompact in multi_index](https://github.com/ClickHouse/ClickHouse/issues/99799)  
   Double deletion suggests memory lifetime or ownership bugs in storage-engine internals. High severity even if currently CI-discovered.

3. [#99810 Server crashes (std::terminate) on role change when disallow_config_defined_profiles_for_sql_defined_users is enabled](https://github.com/ClickHouse/ClickHouse/issues/99810) — closed  
   This is a production-relevant access-control crash. It appears already closed, implying a fix likely landed, though the exact PR is not listed here.

### High
4. [#100119 Arrow-based Parquet writer does not set UUID logical type in schema](https://github.com/ClickHouse/ClickHouse/issues/100119)  
   Not a crash, but a serious interoperability bug. It can silently degrade compatibility with downstream readers expecting proper Parquet UUID annotations. No matching fix PR is visible in the current snapshot.

5. [#100031 DESCRIBE TABLE (...) AS <alias> syntax broken since version 26](https://github.com/ClickHouse/ClickHouse/issues/100031)  
   A backward-compatibility regression in parser behavior. Important for tooling and metadata workflows.

6. [#95913 Query parameter parsing ignores format settings](https://github.com/ClickHouse/ClickHouse/issues/95913)  
   This affects correctness and API/driver predictability, particularly for Arrow timestamp handling.

### Medium
7. [#99697 Fix undefined behavior in Avro reader](https://github.com/ClickHouse/ClickHouse/pull/99697)  
   Positive signal: a concrete bugfix PR exists for a data-format UB issue.

8. [#99823 Fix abort in DataTypeTuple::createColumn when serialization is SerializationDetached](https://github.com/ClickHouse/ClickHouse/pull/99823)  
   Important fix in type/serialization handling, likely preventing aborts in less common but valid execution paths.

9. [#99539 Fix segfault in UBSan build when calling JIT-compiled sort description](https://github.com/ClickHouse/ClickHouse/pull/99539)  
   Mainly CI/sanitizer-facing, but useful for reducing hidden UB in JIT-related code.

10. [#100052 UndefinedBehaviorSanitizer: undefined behavior](https://github.com/ClickHouse/ClickHouse/issues/100052)  
    Another fresh sanitizer-discovered issue, indicating fuzzing and sanitizer infrastructure continue to surface engine edge cases.

### Stability trend
A notable share of today’s bug flow comes from **CI, fuzzers, flaky tests, and sanitizers**, which is actually a healthy signal for engineering rigor. However, the number of low-level crash and UB reports means engine internals remain under active stress, especially around serialization, transaction handling, parser/analyzer edge cases, and distributed execution.

---

## 6. Feature Requests & Roadmap Signals

### Strong signals
- [#49683 Allow interactive queries finish in the background](https://github.com/ClickHouse/ClickHouse/issues/49683)  
  Strong user interest and maintainer involvement make this a credible medium-term roadmap item.
  
- [#99960 Automatically Optimize Queries on Time-Partitioned Tables](https://github.com/ClickHouse/ClickHouse/issues/99960)  
  Very consistent with current optimization work such as [#94140](https://github.com/ClickHouse/ClickHouse/pull/94140) and [#99533](https://github.com/ClickHouse/ClickHouse/pull/99533). This kind of feature has a good chance of partial implementation soon.

- [#100000 Implement CREATE HANDLER query](https://github.com/ClickHouse/ClickHouse/issues/100000)  
  A notable roadmap concept: SQL-managed HTTP handlers. If pursued, this would expand ClickHouse’s programmability and application integration surface.

- [#99916 Introduce `getChildrenRecursive` request for clickhouse-keeper and keeper client](https://github.com/ClickHouse/ClickHouse/issues/99916)  
  A practical feature for Keeper ergonomics and recursive metadata operations.

### Usability and ecosystem
- [#59304 `Remote` database engine](https://github.com/ClickHouse/ClickHouse/issues/59304)  
  Long-term but strategically interesting for federated access and operational simplification.
- [#52343 Add settings for PostgreSQL engine](https://github.com/ClickHouse/ClickHouse/issues/52343)  
  Small but ecosystem-important improvement for external engine parity.
- [#89020 Support `ls` command in clickhouse local](https://github.com/ClickHouse/ClickHouse/issues/89020) — closed  
  Indicates maintainers are still willing to ship pragmatic CLI usability fixes.

### Likely next-version candidates
Most likely to influence the next near-term release line:
- Top-K and pruning defaults: [#99537](https://github.com/ClickHouse/ClickHouse/pull/99537)
- Better `ORDER BY LIMIT` pruning: [#99533](https://github.com/ClickHouse/ClickHouse/pull/99533)
- Parallel replicas controls/fixes: [#100139](https://github.com/ClickHouse/ClickHouse/pull/100139), [#100146](https://github.com/ClickHouse/ClickHouse/pull/100146)
- Statistics-based pruning, if review completes: [#94140](https://github.com/ClickHouse/ClickHouse/pull/94140)

---

## 7. User Feedback Summary

Today’s user feedback highlights several recurring pain points:

### 1. Users want the optimizer to do more automatically
- [#99960 Automatically Optimize Queries on Time-Partitioned Tables](https://github.com/ClickHouse/ClickHouse/issues/99960)
- [#99914 Speed up primary key ranges pruning for parts with many granules](https://github.com/ClickHouse/ClickHouse/issues/99914)

Users are asking for stronger automatic predicate-to-key/partition inference and faster pruning on large parts. This fits typical ClickHouse workloads where schema design is optimized for time-series or append-heavy analytics, but query authors still want ergonomic SQL.

### 2. Interactive workflow durability is lacking
- [#49683 Allow interactive queries finish in the background](https://github.com/ClickHouse/ClickHouse/issues/49683)

This is a high-value usability request from analysts and engineers running long jobs through unstable client sessions. It signals that ClickHouse is increasingly used in semi-interactive and notebook-like environments, not just server-to-server pipelines.

### 3. Operational behavior changes can surprise users
- [#99996 synchronous deletion for blob storage during `DROP TABLE ... SYNC`](https://github.com/ClickHouse/ClickHouse/issues/99996)

The tone of this issue suggests strong operator frustration. It highlights that infrastructure semantics matter just as much as SQL performance, especially in cloud/object-storage deployments.

### 4. Format interoperability remains a practical concern
- [#100119 Parquet UUID logical type missing](https://github.com/ClickHouse/ClickHouse/issues/100119)
- [#93093 parquet reader v3 timestamp decoding issue](https://github.com/ClickHouse/ClickHouse/issues/93093) — closed
- [#72639 Support UUID for format Arrow](https://github.com/ClickHouse/ClickHouse/issues/72639) — closed

Users continue to push on Arrow/Parquet fidelity. The feedback pattern is clear: ClickHouse is deeply embedded in heterogeneous data ecosystems, and small schema mismatches matter.

### 5. Compatibility regressions are noticed quickly
- [#100031 DESCRIBE TABLE (...) AS <alias> syntax broken since version 26](https://github.com/ClickHouse/ClickHouse/issues/100031)

Users are sensitive to parser and introspection changes, especially where third-party tooling may depend on previously valid syntax.

---

## 8. Backlog Watch

These older or strategically important items look like they still need maintainer attention:

- [#49683 Allow interactive queries finish in the background](https://github.com/ClickHouse/ClickHouse/issues/49683)  
  Open since 2023, high engagement, clear user value. This remains one of the strongest backlog signals.

- [#52343 Add settings for PostgreSQL engine](https://github.com/ClickHouse/ClickHouse/issues/52343)  
  Open since 2023. Small on the surface, but important for integration consistency.

- [#59304 `Remote` database engine](https://github.com/ClickHouse/ClickHouse/issues/59304)  
  Open since early 2024. Potentially high leverage for federation and remote administration.

- [#94140 Add statistics-based part pruning](https://github.com/ClickHouse/ClickHouse/pull/94140)  
  Strategically important open PR. Worth close attention because it aligns with multiple community requests and current optimization themes.

- [#96563 Added a serialization object pool](https://github.com/ClickHouse/ClickHouse/pull/96563)  
  Long-running internal optimization PR; likely needs careful review because serialization changes can have wide impact.

- [#98416 Add `share_nested_offsets` MergeTree setting](https://github.com/ClickHouse/ClickHouse/pull/98416)  
  Potentially important for schema semantics and backward compatibility; deserves careful migration review before merge.

---

## Bottom Line

ClickHouse had a **high-velocity day** with coordinated patch releases and heavy PR traffic focused on **optimizer sophistication, distributed-query correctness, and execution efficiency**. The strongest roadmap signals are around **smarter pruning**, **more adaptive execution**, and **better resilience in distributed/interactive workflows**. The main risks remain **26.x behavioral regressions**, **object storage operational semantics**, and **low-level engine stability issues** found by CI/fuzzing. Project health is solid, but the current pace of engine evolution is clearly generating a meaningful stabilization burden.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

## DuckDB Project Digest — 2026-03-20

### 1. Today's Overview
DuckDB had a high-activity day: **78 issues** and **42 PRs** were updated in the last 24 hours, with **23 PRs merged/closed** and **17 issues closed**, indicating active maintainer throughput despite a sizable active queue. The day’s work skewed toward **engine internals, storage correctness, Parquet/S3 behavior, and catalog/AST evolution**, rather than a release event. A notable pattern is continued focus on **cloud/object storage performance regressions**, **copy/write-path correctness**, and **SQL semantics edge cases**. Overall project health looks strong on engineering velocity, though there is still a visible tail of older high-value bugs marked *stale*.

### 2. Project Progress
Merged/closed PRs today advanced several core engine and storage areas:

- **Storage correctness during rollback / conflict handling**  
  PR [#21489](https://github.com/duckdb/duckdb/pull/21489) fixed dictionary size reversion when string appends are rolled back after primary key conflicts. This improves internal storage consistency and avoids orphaned string dictionary entries.

- **Integer decoding overflow detection**  
  PR [#21482](https://github.com/duckdb/duckdb/pull/21482) fixed overflow detection when decoding integers from storage. This is a low-level correctness and safety improvement in the storage read path.

- **Metrics/profiling correctness**  
  PR [#21504](https://github.com/duckdb/duckdb/pull/21504) fixed a `TOTAL_BYTES_WRITTEN` metrics bug. In parallel, open PRs [#21501](https://github.com/duckdb/duckdb/pull/21501) and [#21502](https://github.com/duckdb/duckdb/pull/21502) suggest active refinement of profiling/progress accounting for read/write bytes.

- **Parquet writer compatibility improvements**  
  PR [#20976](https://github.com/duckdb/duckdb/pull/20976) was closed after adding configurability for Parquet `isAdjustedToUTC` on timestamps without timezone. This is a practical interoperability improvement for users writing into predefined Parquet schemas.

- **Issue closures tied to S3/hive-partition regressions**  
  Two recent high-impact issues were closed: [#21347](https://github.com/duckdb/duckdb/issues/21347) on hive partition filter pruning in 1.5.0, and [#21348](https://github.com/duckdb/duckdb/issues/21348) on `QUALIFY ROW_NUMBER() ... = 1` causing ~50x more S3 requests. Their closure is a positive sign that maintainers are reacting quickly to cloud-read regressions.

### 3. Community Hot Topics
Most-discussed items point to recurring technical needs around storage efficiency, optimizer choices, SQL semantics, and platform integration.

- **Parquet output size inflation**
  - Issue [#3316](https://github.com/duckdb/duckdb/issues/3316) — “Too large parquet files via `COPY TO`”
  - Longstanding concern with **write-path efficiency and encoding choices** versus PyArrow. This signals users expect DuckDB’s export path to be competitive not just functionally, but in file size and downstream lakehouse cost.

- **Bad join strategy on small-table join**
  - Issue [#10037](https://github.com/duckdb/duckdb/issues/10037) — “Very slow join on small table”
  - Suggests demand for better **optimizer cost modeling** and more predictable join algorithm selection, especially when queries scale from toy reproductions to multi-billion-row workloads.

- **ODBC path handling**
  - Issue [#11380](https://github.com/duckdb/duckdb/issues/11380) — “ODBC Driver doesn't handle path to database correctly”
  - This reflects ecosystem maturity needs: users are deploying DuckDB in **BI/dbt/ODBC-driven workflows**, where driver correctness matters as much as SQL performance.

- **Collation support gaps**
  - Issue [#604](https://github.com/duckdb/duckdb/issues/604) — “Extended Collation Support”
  - A very old issue still active, showing ongoing demand for **fuller SQL/text semantics**, especially for `DISTINCT`, regex/LIKE behavior, indexes, and comparison functions.

- **CASE/UNNEST evaluation semantics**
  - Issue [#13466](https://github.com/duckdb/duckdb/issues/13466) — “UNNEST should not be allowed within CASE statements”
  - Along with [#14012](https://github.com/duckdb/duckdb/issues/14012), this points to user confusion and likely engine/documentation gaps around **set-returning functions, expression strictness, and static type checking**.

- **S3 throttling handling**
  - Issue [#6153](https://github.com/duckdb/duckdb/issues/6153) — “Handle 503 Slowdown responses from S3 glob requests”
  - This remains relevant as DuckDB is increasingly used directly against object stores; users want **resilient remote scan behavior** and retry/backoff semantics.

### 4. Bugs & Stability
Ranked by likely severity/user impact:

#### High severity
- **Recent S3/hive partition performance regressions in 1.5.0**
  - [#21347](https://github.com/duckdb/duckdb/issues/21347) — partition filters discovering all files before pruning
  - [#21348](https://github.com/duckdb/duckdb/issues/21348) — `QUALIFY ROW_NUMBER() ... = 1` causing huge S3 request amplification  
  Both are now closed, which is important because they impact real cloud cost/performance and can make workloads dramatically slower.

- **Potential fatal crash in C++ UDF string handling**
  - [#13500](https://github.com/duckdb/duckdb/issues/13500) — crash with carriage return/control characters
  - This is a serious stability issue for embedders using native UDFs.

- **Parquet processing appears to hang on nested list/struct data**
  - [#13822](https://github.com/duckdb/duckdb/issues/13822)
  - A stuck execution on nested Parquet is high impact for geospatial/open-data users.

- **Changed ETag error likely false positive on S3-compatible storage**
  - [#21401](https://github.com/duckdb/duckdb/issues/21401)
  - Suggests fragile cache/consistency validation in object-store reads; important for non-AWS S3 deployments.

#### Medium severity
- **OOM during partitioned `COPY` to S3**
  - [#11817](https://github.com/duckdb/duckdb/issues/11817)
  - Memory amplification in partitioned writes is a real blocker for lake export pipelines.

- **Slow or unexpected full scans**
  - [#14729](https://github.com/duckdb/duckdb/issues/14729) — full table scan when extracting few records
  - [#10037](https://github.com/duckdb/duckdb/issues/10037) — slow join on small table  
  These indicate remaining optimization/planner blind spots.

- **Transaction/constraint behavior not matching user expectations**
  - [#13819](https://github.com/duckdb/duckdb/issues/13819)
  - Important for OLTP-like embedded use and mixed DML workloads.

- **Large JSON parsing failure**
  - [#14204](https://github.com/duckdb/duckdb/issues/14204)
  - Material for semi-structured ingestion stability.

#### Lower severity but correctness/documentation relevant
- [#13097](https://github.com/duckdb/duckdb/issues/13097) — `TRY_CAST` throwing despite docs promise
- [#13620](https://github.com/duckdb/duckdb/issues/13620) — `DROP TABLE IF EXISTS` fails if object is a view
- [#13639](https://github.com/duckdb/duckdb/issues/13639) — `random()` replicated in uncorrelated subquery
- [#15520](https://github.com/duckdb/duckdb/issues/15520) — `STDDEV` handling of `inf`, `-inf`, `NaN`
- [#13501](https://github.com/duckdb/duckdb/issues/13501) — Arrow materialization loses non-nullability metadata

Related fix activity today exists on storage metrics and low-level storage correctness, but no directly listed PR clearly fixes the open UDF, nested Parquet, or ETag issues yet.

### 5. Feature Requests & Roadmap Signals
Several open PRs and issues give strong clues about near-term roadmap direction:

- **Richer catalog support for new SQL objects**
  - PR [#21446](https://github.com/duckdb/duckdb/pull/21446) — window function catalog entries
  - PR [#21438](https://github.com/duckdb/duckdb/pull/21438) — catalog storage/introspection for `CREATE TRIGGER`
  - PR [#21505](https://github.com/duckdb/duckdb/pull/21505) — `INSERT/UPDATE/DELETE` as `QueryNode` variants  
  Together these suggest ongoing internal work to make SQL objects and DML more **first-class in the parser/catalog/serialization pipeline**, which usually precedes broader feature maturity.

- **Temporary catalog/schema ergonomics**
  - PR [#19969](https://github.com/duckdb/duckdb/pull/19969) — allow creating schemas in temporary catalog
  - Useful for session-scoped namespacing and more advanced notebook/application workflows.

- **Parquet scan optimization**
  - PR [#21375](https://github.com/duckdb/duckdb/pull/21375) — row group skipping for `MAP` columns
  - PR [#21498](https://github.com/duckdb/duckdb/pull/21498) — filter pushdown on struct/variant extracts  
  These are strong signals that **nested data performance** is an active investment area and may land in the next version.

- **Write-path modernization**
  - PR [#21480](https://github.com/duckdb/duckdb/pull/21480) — move `PhysicalCopyToFile` to Prepare/Flush Batch API
  - This points toward improved **file-write observability and control**, likely relevant to partitioned export, progress reporting, and storage tuning.

- **Platform expansion**
  - PR [#21496](https://github.com/duckdb/duckdb/pull/21496) — add `riscv64` to Linux CLI releases
  - Signals growing portability and adoption on emerging architectures.

**Prediction:** the next release is likely to include more **nested-type filter pushdown**, **Parquet/object-store performance fixes**, **profiling/progress improvements**, and **catalog groundwork for advanced SQL objects**.

### 6. User Feedback Summary
Real user feedback today shows DuckDB succeeding in serious analytical deployments, but with pain concentrated in a few areas:

- **Cloud/object store workloads are mainstream now.** Users are reading hive-partitioned Parquet from S3, exporting partitioned data back to S3, and measuring request counts and memory usage closely. Regressions here are very visible.
- **DuckDB is being used at very large scale.** Reports mention **multi-billion-row tables** and large remote datasets, meaning planner behavior and file pruning matter as much as raw execution speed.
- **Interoperability matters.** ODBC behavior ([#11380](https://github.com/duckdb/duckdb/issues/11380)), Arrow nullability ([#13501](https://github.com/duckdb/duckdb/issues/13501)), Parquet timestamp metadata ([#20976](https://github.com/duckdb/duckdb/pull/20976)), and XDG compliance ([#11779](https://github.com/duckdb/duckdb/issues/11779)) all reflect production integration concerns.
- **Users still praise DuckDB while reporting planner oddities.** Issue [#14729](https://github.com/duckdb/duckdb/issues/14729) explicitly opens with positive sentiment, but highlights frustrating scan behavior when retrieving a few rows. This is a common pattern: users like the product, but want more predictability.

### 7. Backlog Watch
Older items that still look important and deserve maintainer attention:

- **Extended collation support**
  - [#604](https://github.com/duckdb/duckdb/issues/604)  
  Very old, still relevant for SQL compatibility and international text semantics.

- **Parquet `COPY TO` producing larger files**
  - [#3316](https://github.com/duckdb/duckdb/issues/3316)  
  Longstanding export efficiency concern with practical storage-cost implications.

- **S3 slowdown retry handling**
  - [#6153](https://github.com/duckdb/duckdb/issues/6153)  
  Important for robustness in large-scale object-store scans.

- **Slow join algorithm choice**
  - [#10037](https://github.com/duckdb/duckdb/issues/10037)  
  Performance planner issue with broad impact potential.

- **XDG base directory support**
  - [#11779](https://github.com/duckdb/duckdb/issues/11779)  
  Not engine-critical, but high user-experience value and notable community support.

- **Partitioned S3 copy memory overhead**
  - [#11817](https://github.com/duckdb/duckdb/issues/11817)  
  High practical importance for data lake export workflows.

- **Nested Parquet hangs**
  - [#13822](https://github.com/duckdb/duckdb/issues/13822)  
  A stability/performance problem in increasingly common nested-data pipelines.

### 8. Overall Health Assessment
DuckDB remains in a **healthy, fast-moving state**, with strong maintainer responsiveness and substantial work happening on both internals and user-facing performance. The biggest near-term risk area is **remote Parquet/S3 behavior**, where regressions can quickly become cost and latency issues for production users. The strongest positive signal is that maintainers are not just fixing bugs, but also evolving the engine architecture: **catalog entries, DML AST representation, nested-type pushdown, and write-path refactors** all indicate continued maturation beyond tactical bugfixing.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-20

## 1. Today's Overview

StarRocks showed **very high pull request throughput** over the last 24 hours, with **137 PR updates** and **75 merged/closed**, indicating an active maintainer and backport pipeline. Issue volume was modest at **9 updated issues**, but several of them are high-impact: query correctness, backend crashes, and external table/cache consistency problems. There were **no new releases** today, so activity is concentrated on stabilization, documentation propagation, and multi-branch maintenance rather than packaging. Overall, project health looks **operationally strong but correctness-sensitive**, with notable attention needed on join execution, JSON execution-path consistency, and Iceberg cache correctness.

## 2. Project Progress

Today’s merged/closed work skews toward **documentation maintenance**, **branch backports**, and a few **important engine correctness/stability fixes**.

### Query engine and optimizer correctness
- **Partition pruning / min-max rewrite correctness**
  - PR: [#69751](https://github.com/StarRocks/starrocks/pull/69751) — **[BugFix] Fix possible `PartitionColumnMinMaxRewriteRule` bugs caused by `Partition.hasStorageData`**
  - Backport closed: [#70259](https://github.com/StarRocks/starrocks/pull/70259)
  - Significance: this addresses optimizer logic that incorrectly inferred partition data presence from version state. In OLAP systems, these assumptions can silently affect partition pruning, min/max rewrite behavior, and MV refresh planning. This is a meaningful correctness hardening for scan planning and metadata-driven optimization.

### SQL/admin operability and docs
- **BE dynamic config management documentation**
  - PR: [#70532](https://github.com/StarRocks/starrocks/pull/70532) — **[Doc] New Method to Update BE Dynamic Config**
  - Backports opened: [#70544](https://github.com/StarRocks/starrocks/pull/70544), [#70545](https://github.com/StarRocks/starrocks/pull/70545), [#70546](https://github.com/StarRocks/starrocks/pull/70546), [#70547](https://github.com/StarRocks/starrocks/pull/70547)
  - Significance: while doc-only, this reflects ongoing work to improve backend operational control, likely useful for production tuning and incident response.

- **Resource group documentation refinement**
  - PR: [#70528](https://github.com/StarRocks/starrocks/pull/70528) — **[Doc] Fix Resource Group Description**
  - Backports opened: [#70548](https://github.com/StarRocks/starrocks/pull/70548), [#70549](https://github.com/StarRocks/starrocks/pull/70549), [#70550](https://github.com/StarRocks/starrocks/pull/70550), [#70551](https://github.com/StarRocks/starrocks/pull/70551)
  - Significance: resource groups remain an active usability surface, suggesting StarRocks continues to refine workload governance messaging for operators.

- **FE configuration docs scalability**
  - PR: [#70474](https://github.com/StarRocks/starrocks/pull/70474) — **[Doc] FE config doc too large**
  - Related backports closed with conflicts: [#70552](https://github.com/StarRocks/starrocks/pull/70552), [#70553](https://github.com/StarRocks/starrocks/pull/70553), [#70554](https://github.com/StarRocks/starrocks/pull/70554), [#70555](https://github.com/StarRocks/starrocks/pull/70555)
  - Significance: this is not engine work, but it signals that FE configuration surface area is large enough to create discoverability/searchability problems—often a sign of platform maturity and operational complexity.

### Cloud-native / lakehouse execution path
- **Dedicated metadata-fetch thread pool for cloud-native tablets**
  - Backports open: [#70524](https://github.com/StarRocks/starrocks/pull/70524), [#70525](https://github.com/StarRocks/starrocks/pull/70525)
  - Based on: [#70492](https://github.com/StarRocks/starrocks/pull/70492) (referenced in summary)
  - Significance: this is a practical storage-engine performance/isolation improvement. Separating lake metadata fetch from shared pools should reduce contention and improve repair efficiency, especially in shared-data/cloud-native deployments.

### Materialized view + Iceberg reliability
- **MV refresh behavior with expired Iceberg snapshots**
  - PR: [#70523](https://github.com/StarRocks/starrocks/pull/70523) — **[BugFix] Fix mv refresh bugs with expired snapshot iceberg partitions to avoid repeat refresh**
  - Significance: this is highly relevant for lakehouse users. Expired Iceberg snapshots are common in retention-managed environments, and refresh loops or failures can become expensive operationally. The fix suggests continued investment in Iceberg MV semantics.

## 3. Community Hot Topics

The most meaningful discussions today center less on high-comment social activity and more on **high-risk analytical correctness and operability gaps**.

### 1) Expression-based hash join correctness/crash risk
- Issue: [#70349](https://github.com/StarRocks/starrocks/issues/70349) — **JoinHashTable::merge_ht() missing expression-based key column merge causes crash/wrong results with adaptive partition hash join**
- Why it matters: This is one of the most serious issues in the current set because it combines **possible crashes** with **wrong query results**. The underlying need is stronger robustness in adaptive hash join execution when join keys are expressions rather than plain column references. This points to a classic vectorized engine challenge: execution structures and merge logic often implicitly assume slot-ref lineage.

### 2) Stored procedures request
- Issue: [#67805](https://github.com/StarRocks/starrocks/issues/67805) — **Support for Stored Procedures (SQL Procedural Language)**, 👍 4
- Why it matters: This is the clearest roadmap signal from user demand. It reflects migration pressure from Oracle/legacy data warehouse systems where procedural SQL is embedded in ETL/ELT logic. The technical need is not just syntax support, but orchestration semantics, variables, control flow, transactional boundaries, and scheduler integration.

### 3) Externalized logging configuration
- Issue: [#69220](https://github.com/StarRocks/starrocks/issues/69220) — **Externalise the log4j configuration**
- Why it matters: This highlights a production operations concern. Users want to change logging levels, appenders, and destinations without code changes or redeploys. For distributed analytical databases, observability reconfiguration is a real operational requirement during incidents and performance investigations.

### 4) Iceberg metadata cache correctness
- Issue: [#70522](https://github.com/StarRocks/starrocks/issues/70522) — **Iceberg dataFileCache can serve permanently stale partial data, causing silent wrong query results**
- Why it matters: This is an urgent lakehouse consistency concern. The underlying technical need is cache invalidation that is snapshot-aware and safe under partial refresh/update states. Silent wrong results are especially severe in analytics because they can propagate into dashboards and downstream decisions undetected.

## 4. Bugs & Stability

Ranked by apparent severity from the provided data.

### Critical
1. **Silent wrong results / crash in adaptive partition hash join**
   - Issue: [#70349](https://github.com/StarRocks/starrocks/issues/70349)
   - Risk: **Crash + wrong results**
   - Area: query engine / join execution
   - Notes: expression-derived join keys are implicated; this could affect nontrivial SQL patterns using `COALESCE` or other computed join predicates.
   - Fix PR status: **No linked fix PR in provided data**

2. **Iceberg metadata cache serving stale partial data**
   - Issue: [#70522](https://github.com/StarRocks/starrocks/issues/70522)
   - Risk: **Silent wrong query results**
   - Area: Iceberg connector / metadata cache
   - Notes: likely severe for lakehouse deployments with metadata caching enabled.
   - Fix PR status: **No direct fix PR shown**, though related MV/Iceberg refresh work exists in [#70523](https://github.com/StarRocks/starrocks/pull/70523), which is adjacent but not obviously a direct cache fix.

### High
3. **`parse_json` path inconsistency: SELECT works, INSERT OVERWRITE crashes BE**
   - Issue: [#70521](https://github.com/StarRocks/starrocks/issues/70521)
   - Risk: **Backend crash**, execution-path inconsistency
   - Area: JSON function execution / insert pipeline
   - Notes: The report suggests divergence between SELECT and INSERT OVERWRITE code paths, likely involving flattening or expression evaluation internals. This is a serious engine consistency issue.

4. **Segmentation fault querying Parquet on Azure Data Lake Storage**
   - Issue: [#70478](https://github.com/StarRocks/starrocks/issues/70478)
   - Status: **Closed**
   - Link: [#70478](https://github.com/StarRocks/starrocks/issues/70478)
   - Risk: connector/external scan crash
   - Notes: closure with no comments suggests either fast triage/fix or duplicate resolution; still noteworthy because ADLS + Parquet is a core enterprise integration path.

5. **brpc retry logic fails on wrapped `NoSuchElementException`**
   - Issue: [#70205](https://github.com/StarRocks/starrocks/issues/70205)
   - Status: **Closed**
   - Link: [#70205](https://github.com/StarRocks/starrocks/issues/70205)
   - Risk: transient network issues unnecessarily fail queries
   - Notes: This improves resilience in FE-BE communication under connection pool edge cases.

### Medium
6. **Integration test `test_limit` failed**
   - Issue: [#70536](https://github.com/StarRocks/starrocks/issues/70536)
   - Link: [#70536](https://github.com/StarRocks/starrocks/issues/70536)
   - Risk: regression in `LIMIT offset,count` semantics or test stability
   - Notes: Since the expected result is straightforward, this may indicate parser/planner/executor regression or a flaky integration path.

### Stability improvements merged/active today
- [#69751](https://github.com/StarRocks/starrocks/pull/69751): optimizer correctness around partition data assumptions
- [#70523](https://github.com/StarRocks/starrocks/pull/70523): Iceberg MV refresh robustness when snapshots expire

## 5. Feature Requests & Roadmap Signals

### Strongest roadmap signals
1. **Stored Procedures / SQL procedural language**
   - Issue: [#67805](https://github.com/StarRocks/starrocks/issues/67805)
   - Signal strength: **High user value, moderate implementation complexity**
   - Likelihood next version: **Low to medium** for full stored procedures; **higher** for incremental workflow/SQL scripting enhancements if StarRocks chooses a narrower scope.
   - Why: This is a large feature for an OLAP engine, with implications for parser, runtime, security, and transaction semantics.

2. **Externalized Log4j configuration**
   - Issue: [#69220](https://github.com/StarRocks/starrocks/issues/69220)
   - Signal strength: **Strong operational need**
   - Likelihood next version: **Medium to high**
   - Why: Compared with stored procedures, this is operationally important and much more tractable. It aligns with production-readiness work.

### Implicit roadmap signals from PR activity
3. **Cloud-native metadata path isolation**
   - PR family: [#70524](https://github.com/StarRocks/starrocks/pull/70524), [#70525](https://github.com/StarRocks/starrocks/pull/70525)
   - Prediction: more work on **thread-pool isolation**, **repair efficiency**, and **shared-data mode operability** is likely in upcoming versions.

4. **Iceberg maintenance correctness**
   - PR: [#70523](https://github.com/StarRocks/starrocks/pull/70523)
   - Prediction: expect more fixes around **snapshot expiration**, **metadata cache invalidation**, and **MV refresh correctness** for external table ecosystems.

5. **Cloud-native table repair/recovery**
   - Closed enhancement: [#66015](https://github.com/StarRocks/starrocks/issues/66015) — **Support repairing cloud-native tables with missing files**
   - Signal: StarRocks is actively addressing shared-data durability/recovery tooling, which is important for cloud deployments.

## 6. User Feedback Summary

Current user feedback clusters around four practical pain points:

- **Correctness over raw performance**
  - Users are surfacing bugs that can produce **wrong results**, not just slow execution: [#70349](https://github.com/StarRocks/starrocks/issues/70349), [#70522](https://github.com/StarRocks/starrocks/issues/70522).
  - This indicates that as StarRocks expands into more advanced optimizer and lakehouse scenarios, users are testing edge cases where correctness guarantees become paramount.

- **Execution-path inconsistency**
  - The `parse_json` report [#70521](https://github.com/StarRocks/starrocks/issues/70521) shows frustration when **SELECT succeeds but INSERT OVERWRITE crashes**. Users expect semantic consistency across read and write execution paths.

- **Cloud/lakehouse integration reliability**
  - Azure ADLS Parquet crash [#70478](https://github.com/StarRocks/starrocks/issues/70478), Iceberg cache issue [#70522](https://github.com/StarRocks/starrocks/issues/70522), and Iceberg MV refresh fix [#70523](https://github.com/StarRocks/starrocks/pull/70523) all point to real production use of StarRocks against external object storage and open table formats.
  - Users appear satisfied enough to push deeper into lakehouse integration, but reliability of these paths remains a key concern.

- **Migration and enterprise operability**
  - Stored procedures [#67805](https://github.com/StarRocks/starrocks/issues/67805) and external log4j config [#69220](https://github.com/StarRocks/starrocks/issues/69220) show demand from teams treating StarRocks as a serious warehouse platform, not just a query accelerator.

## 7. Backlog Watch

These items appear important and likely deserve maintainer attention due to user impact, architecture implications, or lingering status.

1. **Stored procedures request remains open**
   - Issue: [#67805](https://github.com/StarRocks/starrocks/issues/67805)
   - Why watch: high migration value and the only issue here with notable positive reactions. Even if full implementation is far off, maintainers may want to clarify roadmap stance.

2. **External log4j configuration still open**
   - Issue: [#69220](https://github.com/StarRocks/starrocks/issues/69220)
   - Why watch: low-comment but high practical ops value. A design response or scoped implementation proposal would help users.

3. **Hash join correctness/crash issue**
   - Issue: [#70349](https://github.com/StarRocks/starrocks/issues/70349)
   - Why watch: deserves urgent engineering review because it involves both crashes and wrong results in a core execution operator.

4. **`parse_json` backend crash in write path**
   - Issue: [#70521](https://github.com/StarRocks/starrocks/issues/70521)
   - Why watch: likely reproducible, severe, and affects semi-structured data workloads.

5. **Iceberg stale cache wrong-result issue**
   - Issue: [#70522](https://github.com/StarRocks/starrocks/issues/70522)
   - Why watch: silent correctness bugs in external table reads are among the highest-risk classes for analytics users.

## 8. Overall Health Assessment

StarRocks is maintaining **strong development velocity**, particularly in branch management and documentation rollout, and there is evidence of continued investment in **optimizer correctness**, **cloud-native storage operations**, and **Iceberg/MV behavior**. The main project risk today is not inactivity but **quality concentration in advanced execution and lakehouse integration paths**. If the team quickly resolves the currently open correctness and crash issues—especially [#70349](https://github.com/StarRocks/starrocks/issues/70349), [#70521](https://github.com/StarRocks/starrocks/issues/70521), and [#70522](https://github.com/StarRocks/starrocks/issues/70522)—the near-term outlook remains positive.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-20

## 1. Today’s Overview

Apache Iceberg showed **high pull request activity** over the last 24 hours, with **46 PRs updated** and **13 merged/closed**, while issue activity was more moderate at **11 active updated issues** and no issue closures. The signal is that the project is currently in a **heavy implementation/review cycle**, especially around REST catalog semantics, Spark/Flink behavior, and patch-release backports. No new release was published today, but multiple backport tickets explicitly reference **preparation for a 1.10.2 patch release**, suggesting maintenance work is actively underway. Overall project health appears solid, though several fresh correctness and credential-refresh bugs indicate continued pressure at the engine/catalog integration layer.

## 3. Project Progress

### Merged/closed PRs today and what they advanced

#### REST catalog and API correctness
- **PR #14965 — API, Core: Add 404 handling for `/v1/config` endpoint**  
  Link: https://github.com/apache/iceberg/pull/14965  
  This closed change improves **REST catalog protocol correctness** by documenting and handling warehouse-not-found scenarios explicitly. This is important for interoperability across catalog implementations and for clients relying on predictable HTTP semantics.

- **PR #14856 — REST: Add spatial expressions to REST Catalog OpenAPI Spec**  
  Link: https://github.com/apache/iceberg/pull/14856  
  Though closed rather than merged status is not fully specified here, the update indicates continued work on **expanding REST expression compatibility**, especially for advanced predicate forms like spatial filters. This points to ongoing maturation of Iceberg’s API surface for richer query pushdown.

- **PR #15609 — Core: Fix useSnapshotSchema logic and projection in RESTTableScan**  
  Link: https://github.com/apache/iceberg/pull/15609  
  A significant **query correctness fix** for REST table scans: it corrects branch/tag/snapshot handling and projection behavior. This reduces risk of incorrect schema usage during scan planning, which is a high-value fix for users relying on REST catalogs.

#### Flink maintenance and branch support
- **PR #15690 — Flink: Backport: Add branch support to RewriteDataFiles maintenance task**  
  Link: https://github.com/apache/iceberg/pull/15690  
  This closed backport extends **maintenance task compatibility with branches** for Flink 1.20 and 2.0. It improves operational support for branching workflows, which are increasingly important in multi-stage data pipelines.

#### AWS/storage credential lifecycle
- **PR #15678 — AWS: Add scheduled refresh for the S3FileIO held storage credentials**  
  Link: https://github.com/apache/iceberg/pull/15678  
  This addresses an important **long-running job stability issue** where serialized `S3FileIO` instances could hold stale credentials. Credential refresh is a recurring theme in today’s issue set, and this work suggests maintainers are actively hardening cloud-runtime behavior.

#### Spark/Parquet integration
- **PR #13786 — Spark: Encapsulate parquet objects for Comet**  
  Link: https://github.com/apache/iceberg/pull/13786  
  This helps with **Spark + Parquet shading/integration compatibility**, especially with Comet. It is a practical ecosystem improvement that reduces dependency conflicts and improves deployability.

#### Spark action optimization
- **PR #15154 — Spark 4.1: Optimize ExpireSnapshotsSparkAction with manifest-level filtering**  
  Link: https://github.com/apache/iceberg/pull/15154  
  This work targets **storage maintenance efficiency**, reducing unnecessary content-file reads by filtering earlier at the manifest level. Even if closed rather than merged, it reflects focus on lowering metadata cleanup costs in large tables.

## 4. Community Hot Topics

### Most active issues and PRs

#### 1) Flink duplicate writes during recovery with REST catalog
- **Issue #14425 — Iceberg Flink sinks duplicate data during recovery when used with the REST catalog**  
  Link: https://github.com/apache/iceberg/issues/14425  
  With **14 comments**, this is the hottest issue in the set. It describes a serious **exactly-once/recovery correctness problem** for Flink sink behavior under REST catalog usage. The issue summary explicitly points to a fix PR: **PR #14517**.  
  **Underlying need:** users need stronger guarantees that catalog abstraction layers do not break transactional sink semantics during failover/recovery.

#### 2) Materialized views support remains a long-running strategic thread
- **PR #9830 — Views, Spark: Add support for Materialized Views; Integrate with Spark SQL**  
  Link: https://github.com/apache/iceberg/pull/9830  
  This longstanding PR remains active and is one of the clearest roadmap-scale items.  
  **Underlying need:** stronger SQL warehouse semantics and native support for derived managed objects, especially for Spark-centered analytical deployments.

#### 3) Kafka Connect routing and control-plane evolution
- **PR #11623 — Kafka Connect: Add mechanisms for routing records by topic name**  
  Link: https://github.com/apache/iceberg/pull/11623  
- **PR #14816 — Decouple control topic processing from record poll loop**  
  Link: https://github.com/apache/iceberg/pull/14816  
  These two Kafka Connect PRs suggest sustained interest in **high-throughput ingestion reliability and routing flexibility**.  
  **Underlying need:** production users want better tenant/topic-based routing and more robust commit coordination under load.

#### 4) Structured streaming semantics in Spark
- **Issue #15692 — Support Filter Pushdown for Spark Structured Streaming Reads**  
  Link: https://github.com/apache/iceberg/issues/15692  
- **PR #15152 — Spark: Add streaming-overwrite-mode option for handling OVERWRITE snapshots**  
  Link: https://github.com/apache/iceberg/pull/15152  
  Together these show a strong user push for **better structured streaming efficiency and clearer semantics around overwrite snapshots**.  
  **Underlying need:** make streaming reads closer to batch capability in pruning, cost, and correctness.

#### 5) REST catalog API consistency
- **PR #15691 — REST Spec: Clarify identifier uniqueness across catalog object types**  
  Link: https://github.com/apache/iceberg/pull/15691  
- **PR #15669 — Core: Add batch load endpoints for tables and views**  
  Link: https://github.com/apache/iceberg/pull/15669  
  REST catalog work is clearly active.  
  **Underlying need:** stronger interoperability, lower metadata round trips, and better-defined object model behavior for tables and views.

## 5. Bugs & Stability

### Ranked by severity

#### Critical
1. **Flink sink duplicate data during recovery with REST catalog**  
   - Issue: [#14425](https://github.com/apache/iceberg/issues/14425)  
   - Impact: **data duplication / write correctness failure** during recovery  
   - Engine: Flink  
   - Status: Open; issue states fix is in **PR #14517**  
   This is the most severe item because it directly affects correctness and can silently corrupt downstream analytics.

#### High
2. **GCSAuthManager appears not to support credential refresh; jobs crash mid-run**  
   - Issue: [#15414](https://github.com/apache/iceberg/issues/15414)  
   - Impact: **runtime job crashes** due to non-refreshable OAuth2 credentials  
   - Engine: Spark  
   This is a major stability concern for long-running cloud jobs. It also mirrors the AWS-side credential refresh work in [PR #15678](https://github.com/apache/iceberg/pull/15678), suggesting a broader cloud credential lifecycle hardening need.

3. **Flink connector silently returns empty reads when table name differs under `USE namespace` flow**  
   - Issue: [#15668](https://github.com/apache/iceberg/issues/15668)  
   - Impact: **query correctness / silent empty result**  
   - Engine: Flink  
   Silent empties are especially dangerous because they can be mistaken for valid results.

#### Medium
4. **Estimated table size is inaccurate**  
   - Bug: [#15684](https://github.com/apache/iceberg/issues/15684)  
   - Related question: [#15664](https://github.com/apache/iceberg/issues/15664)  
   - Impact: planning/estimation inaccuracies in Spark, likely affecting cost/performance expectations rather than direct correctness  
   This may matter for optimizer decisions, user-facing diagnostics, and capacity planning.

5. **Avro row lineage backport requests for 1.10.x**  
   - [#15686](https://github.com/apache/iceberg/issues/15686)  
   - [#15685](https://github.com/apache/iceberg/issues/15685)  
   These indicate identified defects in **ROW_ID / row lineage handling** and projection behavior, serious enough to request patch backports ahead of 1.10.2.

### Stability pattern observed today
The dominant stability pattern is **engine integration correctness**:
- Flink recovery and namespace resolution
- Spark long-running auth behavior
- REST scan schema/projection logic
- Avro row-lineage edge cases

This suggests Iceberg core remains active and capable, but cross-layer behavior among storage, catalog, and compute engines still requires steady hardening.

## 6. Feature Requests & Roadmap Signals

### Notable feature requests
- **Issue #15692 — Filter pushdown for Spark Structured Streaming reads**  
  Link: https://github.com/apache/iceberg/issues/15692  
  Strong roadmap signal for improving **streaming scan efficiency** to match batch behavior.

- **Issue #15628 — Add JMH benchmarks for Variants**  
  Link: https://github.com/apache/iceberg/issues/15628  
  Indicates performance engineering interest around **Variant type behavior and scalability**.

- **Issue #13035 — Add default parquet column statistic enable config flag**  
  Link: https://github.com/apache/iceberg/issues/13035  
  Suggests demand for finer-grained **Parquet statistics configuration**, useful for pruning efficiency and operational control.

### PRs with roadmap significance
- **PR #9830 — Materialized views**  
  Link: https://github.com/apache/iceberg/pull/9830  
  Long-term strategic feature; still a major signal for SQL warehouse evolution.

- **PR #15152 — Streaming overwrite mode for Spark Structured Streaming**  
  Link: https://github.com/apache/iceberg/pull/15152  
  Strong candidate for eventual inclusion because it addresses a long-standing structured streaming gap.

- **PR #15669 — Batch load endpoints for tables and views**  
  Link: https://github.com/apache/iceberg/pull/15669  
  Likely to land sooner than larger SQL-facing features because it is incremental, concrete, and aligned with REST catalog scalability.

- **PR #15691 — Clarify identifier uniqueness across table/view object types**  
  Link: https://github.com/apache/iceberg/pull/15691  
  Likely near-term, as it tightens spec consistency without major behavioral expansion.

### Likely next-version candidates
Based on today’s signals, the most plausible near-term inclusions in an upcoming patch/minor line are:
- **1.10.2 patch backports** for Avro row-lineage issues: [#15685](https://github.com/apache/iceberg/issues/15685), [#15686](https://github.com/apache/iceberg/issues/15686)
- Credential lifecycle hardening, especially in cloud FileIO paths
- Additional REST catalog compliance/consistency fixes
- Smaller Spark/Flink correctness fixes rather than major new features

## 7. User Feedback Summary

### Main user pain points
1. **Long-running cloud job reliability**
   - GCS auth refresh failures: [#15414](https://github.com/apache/iceberg/issues/15414)
   - Related AWS credential refresh work: [#15678](https://github.com/apache/iceberg/pull/15678)  
   Users expect Iceberg-managed IO/catalog layers to handle expiring credentials transparently.

2. **Flink operational correctness**
   - Duplicate writes on recovery: [#14425](https://github.com/apache/iceberg/issues/14425)
   - Silent empty reads via namespace/table name mismatch: [#15668](https://github.com/apache/iceberg/issues/15668)  
   Flink users appear sensitive to exactly-once semantics and SQL/catalog name resolution consistency.

3. **Spark streaming parity with batch**
   - Filter pushdown request: [#15692](https://github.com/apache/iceberg/issues/15692)
   - Overwrite snapshot handling option: [#15152](https://github.com/apache/iceberg/pull/15152)  
   Users want structured streaming to benefit from the same pruning and semantics richness as batch reads.

4. **Metadata and estimator realism**
   - Table size estimation concerns: [#15684](https://github.com/apache/iceberg/issues/15684), [#15664](https://github.com/apache/iceberg/issues/15664)  
   This reflects practical user demand for more trustworthy cost/size heuristics.

### Satisfaction signals
There is no strong explicit positive reaction count in this dataset, but the volume of active work on REST, Spark, Flink, and connectors indicates that Iceberg remains highly relevant in production analytical environments. The dominant feedback is not “missing basics” but rather **advanced operational edge cases**, which usually indicates ecosystem maturity.

## 8. Backlog Watch

### Important older items needing maintainer attention

- **PR #9830 — Materialized Views support**  
  https://github.com/apache/iceberg/pull/9830  
  A major strategic feature that has been open since 2024. It likely needs sustained maintainer bandwidth to converge on spec and implementation boundaries.

- **PR #11623 — Kafka Connect routing by topic name**  
  https://github.com/apache/iceberg/pull/11623  
  Long-lived ingestion feature work; valuable for connector users, but aging enough to risk drift.

- **PR #14816 — Decouple control topic processing from poll loop**  
  https://github.com/apache/iceberg/pull/14816  
  Important for Kafka Connect throughput/reliability, and appears operationally meaningful.

- **PR #13976 — Arrow: Close child allocators**  
  https://github.com/apache/iceberg/pull/13976  
  Resource-management fixes in Arrow-backed paths can have real memory impact and should not linger indefinitely.

- **Issue #14094 — Upgrade to Gradle 9.4.1**  
  https://github.com/apache/iceberg/issues/14094  
  Build modernization can become urgent as CI/toolchain ecosystems move.

- **Issue #13035 — Default parquet column statistic enable config flag**  
  https://github.com/apache/iceberg/issues/13035  
  Old improvement request tied to Parquet dependency evolution; still relevant to performance tuning and metadata quality.

- **PR #15341 — Async Spark readers for many small files**  
  https://github.com/apache/iceberg/pull/15341  
  https://github.com/apache/iceberg/issues/15287  
  If validated, this could be a meaningful performance improvement for one of Iceberg’s common workload pain points: many-small-file scans.

---

## Bottom line

Today’s Iceberg activity points to a project that is **healthy, highly active, and in active maintenance/refinement mode**. The strongest current themes are:
- **REST catalog spec and implementation hardening**
- **Spark/Flink correctness and streaming behavior**
- **Cloud credential refresh reliability**
- **Patch-release prep for 1.10.2**

The top operational risk remains **correctness issues in engine integrations**, especially Flink recovery behavior and credential expiry in long-running jobs. The clearest roadmap signals are **streaming-read improvements, REST scalability/API consistency, and continued work toward richer SQL objects like materialized views**.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-20

## 1. Today’s Overview

Delta Lake showed **high pull request activity but low issue volume** over the last 24 hours: **29 PRs were updated** while only **2 issues** saw activity. This usually indicates a project phase focused on **implementation, review, and integration work** rather than broad incoming bug intake. The active work spans **Spark execution semantics, DSv2/kernel integration, protocol documentation, CI hardening, and storage-layer cleanup**, suggesting steady forward progress in both the core engine and surrounding ecosystem. Overall project health looks **good**, with no release churn today and a strong bias toward incremental correctness and maintainability improvements.

## 3. Project Progress

There were **5 merged/closed PRs updated today**, and although the provided data does not distinguish merged vs. closed for each item, they still indicate where maintainers are concentrating effort.

### DSv2 / kernel-spark read-path modernization
- [#6245](https://github.com/delta-io/delta/pull/6245) — **[kernel-spark] Support read option ignoreDeletes in dsv2**  
- [#6246](https://github.com/delta-io/delta/pull/6246) — **[kernel-spark] Support skipChangeCommits and ignoreDeletes read option in dsv2**

These closures are important signals that Delta is actively refining **DSv2 semantics for change-aware reading**. The follow-on open PRs [#6249](https://github.com/delta-io/delta/pull/6249) and [#6250](https://github.com/delta-io/delta/pull/6250) show this is part of a broader stack to bring **legacy read compatibility options** into the newer kernel-backed DSv2 path.

### Test migration and validation work
- [#6294](https://github.com/delta-io/delta/pull/6294) — **[kernel-spark] Migrate DeltaSourceDeletionVectorsSuite to v2**

Even as a closed item, this points to continued effort to shift **test coverage toward V2/kernel-backed execution paths**, especially around **deletion vectors**, which are central to modern Delta read correctness and efficient mutation handling.

### Experimental DSv2 work being reshaped
- [#6318](https://github.com/delta-io/delta/pull/6318) — **Dsv2 experimental**

This closure likely reflects pruning or consolidation rather than abandonment; nearby PRs such as [#6313](https://github.com/delta-io/delta/pull/6313) indicate DSv2 work is very much alive and being re-scoped into more production-oriented changes.

### Protocol/documentation formalization
While not closed today, two fresh protocol artifacts are strong progress signals:
- [#6323](https://github.com/delta-io/delta/issues/6323) — **[PROTOCOL RFC] Document delta.parquet.compression.codec**
- [#6324](https://github.com/delta-io/delta/pull/6324) — **[RFC] for compression setting**

These suggest Delta is moving a de facto implementation convention into a **documented protocol-level behavior**, which matters for **multi-engine interoperability**.

## 4. Community Hot Topics

### 1) Spark transaction/thread-safety correctness
- [#6097](https://github.com/delta-io/delta/pull/6097) — **[Spark] Make txn readFiles and readTheWholeTable thread safe**

This is one of the most consequential active items because thread-safety issues in transaction read tracking can lead to **subtle correctness bugs under concurrent execution**. The underlying need is clear: Delta’s Spark transaction machinery is increasingly exposed to **parallel planning and execution patterns**, and internal mutable state must be hardened.

### 2) Storage/log-store modernization
- [#5874](https://github.com/delta-io/delta/pull/5874) — **[Spark] Remove the old scala LogStores**

This reflects a technical debt payoff in the storage abstraction layer. The likely user need underneath is **more uniform behavior across cloud/object stores**, reduced maintenance burden, and a cleaner path for future log-store correctness fixes.

### 3) Spark planning compatibility with V1/V2 fallback
- [#5804](https://github.com/delta-io/delta/pull/5804) — **[SPARK] Improve check for V2WriteCommand with fallback to V1 in PrepareDeltaScan**

This is a compatibility-sensitive PR tied to real-world Spark behavior where writes may not always target Delta in the expected way. The underlying need is **robust mixed-mode interoperability** as Spark deployments continue to straddle **V1 and V2 APIs**.

### 4) Kernel-backed DSv2 feature parity
- [#6313](https://github.com/delta-io/delta/pull/6313) — **[Spark][DSv2] Support metadata-only create table via Kernel**
- [#6249](https://github.com/delta-io/delta/pull/6249) — **[kernel-spark] Support ignoreChanges read option in dsv2**
- [#6250](https://github.com/delta-io/delta/pull/6250) — **[kernel-spark] Support ignoreFileDeletion read option in dsv2**

Together these show a hot topic: making **kernel-backed Spark DSv2** usable for more production scenarios without losing compatibility knobs available in older paths.

### 5) Protocol-level compression standardization
- [#6323](https://github.com/delta-io/delta/issues/6323) — **[PROTOCOL RFC] Document delta.parquet.compression.codec**
- [#6324](https://github.com/delta-io/delta/pull/6324) — **[RFC] for compression setting**

This is a strong interoperability topic. Users and engine implementers need a **formal contract** for compression behavior instead of relying on implicit conventions.

## 5. Bugs & Stability

Ranked by likely severity based on impact:

### High severity
1. [#6097](https://github.com/delta-io/delta/pull/6097) — **Thread safety for `txn.readFiles` and `readTheWholeTable`**  
   - Risk: **query correctness / transaction consistency** under concurrent access.  
   - Why it matters: race conditions in transaction internals can produce hard-to-reproduce correctness issues rather than obvious crashes.  
   - Fix status: **active PR exists**.

2. [#6314](https://github.com/delta-io/delta/pull/6314) — **Add sanity check in `getBatch` to detect missing trailing commits**  
   - Risk: **streaming or incremental read inconsistency**, potentially silent data loss or confusing state transitions when commit files disappear between offset resolution and batch fetch.  
   - Fix status: **active PR exists**.

### Medium severity
3. [#5804](https://github.com/delta-io/delta/pull/5804) — **Improve V2WriteCommand fallback handling**  
   - Risk: **wrong planning path / compatibility regressions** in Spark write flows.  
   - Fix status: **active PR exists**.

4. [#6162](https://github.com/delta-io/delta/pull/6162) — **Remove path transformation from Snapshot**  
   - Risk: path normalization/rewriting bugs can break **table resolution, cloud URI correctness, or edge-case filesystem interoperability**.  
   - Fix status: **active PR exists**.

5. [#6325](https://github.com/delta-io/delta/pull/6325) — **Preserve exception cause chain when rethrowing wrapped exceptions**  
   - Risk: lower direct runtime impact, but significantly harms **debuggability**, especially for S3/Hadoop filesystem errors.  
   - Fix status: **active PR exists**.

### Lower severity but meaningful optimization/stability
6. [#4914](https://github.com/delta-io/delta/issues/4914) — **[Kernel] Remove unnecessary `N.json` loading for InCommitTimestamp value**  
   - Risk: extra cloud calls and avoidable latency rather than correctness failure.  
   - Importance: relevant for **metadata path efficiency** and cloud cost/perf hygiene.  
   - Fix status: **issue open; no linked fix PR in provided data**.

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals

1. **Protocol-standard compression configuration**
   - [#6323](https://github.com/delta-io/delta/issues/6323)
   - [#6324](https://github.com/delta-io/delta/pull/6324)

   This is the clearest feature/protocol signal today. Because `delta.parquet.compression.codec` is already used as a convention, formalizing it is a natural step and **likely to land in an upcoming protocol/documentation-oriented release**.

2. **Kernel + DSv2 expansion**
   - [#6313](https://github.com/delta-io/delta/pull/6313)
   - [#6249](https://github.com/delta-io/delta/pull/6249)
   - [#6250](https://github.com/delta-io/delta/pull/6250)
   - [#6322](https://github.com/delta-io/delta/pull/6322) — **[KERNEL][VARIANT] Add variant GA table feature to delta kernel java**

   This cluster strongly suggests the near-term roadmap includes **broader kernel parity**, especially for DSv2 create/read paths and support for newer table capabilities such as **variant GA features**.

3. **Unity Catalog integration maturity**
   - [#6263](https://github.com/delta-io/delta/pull/6263) — non-blocking CI against UC main
   - [#6155](https://github.com/delta-io/delta/pull/6155)
   - [#6156](https://github.com/delta-io/delta/pull/6156)

   These indicate Delta is investing in **UC compatibility and telemetry/commit metrics**, which may show up first as internal hardening but later become user-visible reliability/integration improvements.

### Most likely next-version candidates
Based on current activity, the most plausible items for the next release train are:
- **DSv2/kernel read-option parity improvements**
- **Spark planning and correctness fixes**
- **Protocol documentation updates for parquet compression**
- **Storage/log-store cleanup and error-handling improvements**

## 7. User Feedback Summary

From today’s issue/PR mix, user pain points appear concentrated in a few areas:

- **Cross-engine and protocol predictability**: The compression RFC issue [#6323](https://github.com/delta-io/delta/issues/6323) implies users or implementers are already relying on behavior that is not formally documented, creating interoperability ambiguity.
- **Spark API transition friction**: PRs like [#5804](https://github.com/delta-io/delta/pull/5804), [#6313](https://github.com/delta-io/delta/pull/6313), [#6249](https://github.com/delta-io/delta/pull/6249), and [#6250](https://github.com/delta-io/delta/pull/6250) show ongoing demand for smoother behavior across **V1/V2 and kernel-backed execution paths**.
- **Cloud metadata efficiency**: Issue [#4914](https://github.com/delta-io/delta/issues/4914) highlights sensitivity to **extra object store reads**, reinforcing that metadata-path latency and cloud call count still matter to users operating at scale.
- **Operational debuggability**: PR [#6325](https://github.com/delta-io/delta/pull/6325) shows that users care not only about correctness but also about **actionable exception chains** when failures happen in S3/Hadoop-backed environments.

There is no strong direct satisfaction signal in today’s data like praise or high reaction counts, but the work pattern suggests maintainers are responding to **practical production pain**, not speculative enhancements.

## 8. Backlog Watch

These items look like they deserve maintainer attention due to age, impact, or strategic importance:

1. [#4914](https://github.com/delta-io/delta/issues/4914) — **[Kernel] Remove unnecessary `N.json` loading for InCommitTimestamp value**  
   - Created in 2025 and still open.  
   - Important because it affects **kernel metadata read efficiency** and likely impacts cloud-heavy deployments.

2. [#5804](https://github.com/delta-io/delta/pull/5804) — **V2WriteCommand fallback correctness**  
   - Open since 2026-01-08.  
   - Worth attention because mixed V1/V2 planning bugs can create broad compatibility issues.

3. [#5874](https://github.com/delta-io/delta/pull/5874) — **Remove the old scala LogStores**  
   - Open since 2026-01-18.  
   - Strategic cleanup item; likely blocked by migration/testing complexity, but important for maintainability.

4. [#6097](https://github.com/delta-io/delta/pull/6097) — **Thread safety in transaction read tracking**  
   - Open since 2026-02-20.  
   - High-value correctness work that should not linger too long.

5. [#6162](https://github.com/delta-io/delta/pull/6162) — **Remove path transformation from Snapshot**  
   - Open since 2026-02-27.  
   - Deserves review because path handling bugs often surface only in specific production storage setups.

---

## Overall Health Signal

Delta Lake appears **actively maintained and technically healthy**, with strong momentum in **Spark/kernel integration, correctness hardening, and protocol clarity**. The main near-term risk is not inactivity but **review bandwidth**: several meaningful PRs have been open for weeks or months. If maintainers can convert the current PR pipeline into merges, the next release should likely deliver **better DSv2 behavior, stronger stability, and clearer interoperability guarantees**.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-20

## 1. Today's Overview

Databend showed **moderate-to-high development activity** over the last 24 hours, with **12 PRs updated** and **4 issues updated**, but **no new release** published. The day’s work concentrated on the **query engine and SQL layer**, especially parser/tokenizer behavior, optimizer rewrites, aggregate binding, and memory management in joins, while storage work focused on **Fuse block format abstraction** and **recluster compaction safety**. On the stability side, several newly reported issues are notable because they involve **panics/assertions in parser, optimizer, and constant-folding paths**, which are higher-severity signals for correctness and robustness. Overall, the project appears **healthy and actively evolving**, but today’s bug reports suggest the SQL engine still has a few sharp edges around complex set operations, overflow handling, and correlated subqueries.

## 3. Project Progress

### Merged/closed PRs today

#### 1) bendpy CSV registration compatibility fix completed
- PR: [#19557](https://github.com/databendlabs/databend/pull/19557) — **[pr-bugfix] fix: bendpy register csv column positions followup**
- Related issue: [#19443](https://github.com/databendlabs/databend/issues/19443) — **closed**
- Impact:
  - Fixes a Python binding usability bug where `register_csv()`/`register_tsv()` generated a `CREATE VIEW` using `SELECT *`, which is invalid for CSV/TSV sources lacking column positions.
  - This is an important **SQL compatibility and client API correctness** improvement for bendpy users.
- Why it matters:
  - It removes friction for Python-based ingestion and dataframe workflows, a key adoption path for analytical databases.

#### 2) Better case handling for staged query paths closed
- PR: [#19566](https://github.com/databendlabs/databend/pull/19566) — **[pr-feature] feat: better case handling for query stage**
- Impact:
  - Improves behavior for queries over staged Parquet files, including `SELECT ... FROM @stage/...` and stage-backed `COPY/INSERT/REPLACE` flows.
- Why it matters:
  - This points to continued investment in **external/staged data access semantics**, an important area for lakehouse-style analytics and ingestion UX.

#### 3) Tokenizer state exposure for REPL consumers closed
- PR: [#19573](https://github.com/databendlabs/databend/pull/19573) — **[pr-refactor] refactor: expose unclosed state from tokenizer for REPL consumers**
- Impact:
  - Tokenizer now surfaces unclosed quote/backtick/dollar-quote/block-comment state to REPL-style consumers.
  - The implementation also moved string handling away from regex-only parsing toward custom handlers.
- Why it matters:
  - This improves **interactive SQL tooling**, especially shell/REPL experiences where multiline input detection is essential.
  - It also lays groundwork for more precise parser diagnostics.

### Open PRs indicating active progress

#### Query engine / optimizer
- [#19556](https://github.com/databendlabs/databend/pull/19556) — reclaim memory on hash join finish  
  Strong signal that memory efficiency in join-heavy analytical workloads is an active optimization target.
- [#19581](https://github.com/databendlabs/databend/pull/19581) — introduce type shrinking rules for aggregates and joins  
  Suggests ongoing work on **execution efficiency and better physical planning** through narrower data types.
- [#19567](https://github.com/databendlabs/databend/pull/19567) — improve agg index rewrite matching  
  Moves from string-based matching to structural expression matching, which should improve rewrite correctness.
- [#19559](https://github.com/databendlabs/databend/pull/19559) — improve eager aggregation rewrites  
  Indicates sustained optimizer refactoring for aggregate-heavy queries.
- [#19579](https://github.com/databendlabs/databend/pull/19579) — Aggr bind refactor  
  More evidence that the aggregation pipeline is under active redesign/cleanup.

#### Storage engine
- [#19577](https://github.com/databendlabs/databend/pull/19577) — split oversized compact blocks during recluster  
  A practical storage safeguard to prevent oversized blocks after sort/compaction.
- [#19576](https://github.com/databendlabs/databend/pull/19576) — extract fuse block format abstraction  
  Important internal work that could reduce duplication across Native/Parquet read paths and simplify future storage evolution.

#### Compatibility / UX
- [#19580](https://github.com/databendlabs/databend/pull/19580) — rename TSV to TEXT, keep TSV as alias  
  A naming/UX change that may surface in upcoming documentation and SQL/file-format behavior.
- [#19582](https://github.com/databendlabs/databend/pull/19582) — migrate DuckDB SQL logic tests  
  This likely strengthens SQL compatibility validation and broadens test coverage against established analytical SQL behavior.

## 4. Community Hot Topics

There were **no highly discussed threads** in the supplied data: all listed issues show **0 comments** and **0 reactions**, and PR comment counts are not available. So “hot topics” are best inferred from **where engineering effort is clustering**.

### 1) Aggregation and optimizer rewrite correctness
- PRs:
  - [#19581](https://github.com/databendlabs/databend/pull/19581)
  - [#19567](https://github.com/databendlabs/databend/pull/19567)
  - [#19559](https://github.com/databendlabs/databend/pull/19559)
  - [#19579](https://github.com/databendlabs/databend/pull/19579)
- Analysis:
  - Multiple concurrent PRs target aggregation binding and optimizer rewrite internals.
  - This usually signals a technical need to improve **plan transformation correctness, maintainability, and runtime performance** for analytical workloads dominated by `GROUP BY`, aggregate pushdown, and index-assisted rewrites.

### 2) SQL parser/tokenizer correctness and interactive tooling
- Closed PR:
  - [#19573](https://github.com/databendlabs/databend/pull/19573)
- New issue:
  - [#19578](https://github.com/databendlabs/databend/issues/19578) — parse assertion failed
- Analysis:
  - Parser and tokenizer behavior remains a live area. The combination of REPL-oriented tokenizer improvement and a fresh parser assertion bug suggests Databend is still tightening edge-case SQL parsing, especially around nested set operations and input completeness tracking.

### 3) Storage layout safety and read-path abstraction
- PRs:
  - [#19577](https://github.com/databendlabs/databend/pull/19577)
  - [#19576](https://github.com/databendlabs/databend/pull/19576)
- Analysis:
  - These point to a technical need for more robust block management during reclustering and cleaner abstractions in the Fuse storage layer.
  - This is usually a precursor to better maintainability, fewer format-specific bugs, and possibly more consistent performance across read paths.

### 4) File-format naming and user-facing semantics
- PR:
  - [#19580](https://github.com/databendlabs/databend/pull/19580)
- Analysis:
  - Renaming TSV to TEXT while keeping TSV as an alias is a UX/documentation-driven change.
  - It reflects a likely effort to make external data handling more intuitive and less format-name constrained.

## 5. Bugs & Stability

Ranked by likely severity based on crash potential and impact.

### Critical / High Severity

#### 1) Decorrelate optimizer panic with correlated subquery over UNION
- Issue: [#19574](https://github.com/databendlabs/databend/issues/19574) — **[C-bug] Panic in decorrelate optimizer with correlated subquery over `UNION`**
- Severity: **High**
- Why:
  - This is an **optimizer panic** caused by `Option::unwrap()` on `None`, meaning certain valid or near-valid SQL patterns can crash the planner.
  - Correlated subqueries plus set operations are advanced but real analytical SQL patterns.
- Fix PR:
  - **No direct fix PR listed** in today’s data.

#### 2) BIGINT multiply overflow panics during constant folding
- Issue: [#19575](https://github.com/databendlabs/databend/issues/19575) — **[C-bug] BIGINT multiply overflow returns `PanicError 1104` during constant folding**
- Severity: **High**
- Why:
  - Arithmetic overflow should return a controlled SQL error, not a panic.
  - Since it happens during constant folding, it may affect query compilation before execution even begins.
- Fix PR:
  - **No direct fix PR listed**.

#### 3) Parser assertion failure on nested UNION syntax
- Issue: [#19578](https://github.com/databendlabs/databend/issues/19578) — **parse assertion failed**
- Severity: **High**
- Why:
  - Assertions in parser code indicate an internal consistency failure.
  - The example involves nested `UNION`, which may impact SQL correctness and parser robustness.
- Fix PR:
  - **No direct fix PR listed**.

### Medium Severity

#### 4) bendpy CSV registration bug resolved
- Issue: [#19443](https://github.com/databendlabs/databend/issues/19443) — **closed**
- Fix PR: [#19557](https://github.com/databendlabs/databend/pull/19557)
- Severity: **Medium**
- Why:
  - Not a core engine crash, but it broke an important user-facing API path for Python users working with CSV files.
- Status:
  - Resolved today.

### Stability readout

Today’s stability picture is mixed:
- **Positive:** one real user-facing integration bug was closed quickly.
- **Negative:** three fresh issues expose **panic/assertion-class failures** in parser, optimizer, and constant-folding logic. That suggests active feature/refactor work is surfacing edge cases in SQL compilation paths.

## 6. Feature Requests & Roadmap Signals

There are **no explicit user-authored feature requests** in today’s issue list, but several PRs strongly signal near-term roadmap direction.

### Likely near-term user-visible changes

#### 1) TEXT becomes the preferred TSV-facing format name
- PR: [#19580](https://github.com/databendlabs/databend/pull/19580)
- Signal:
  - Databend may soon present **TEXT** as the primary term for tabular text unload/load workflows, with TSV retained as an alias for backward compatibility.
- Likelihood:
  - **High** for the next release cycle if merged.

#### 2) Improved join memory behavior
- PR: [#19556](https://github.com/databendlabs/databend/pull/19556)
- Signal:
  - Memory reclamation after hash join completion is a direct performance/stability improvement likely relevant to large analytical joins.
- Likelihood:
  - **High**, as this is a concrete engine optimization with tests attached.

#### 3) Smarter type shrinking in aggregates and joins
- PR: [#19581](https://github.com/databendlabs/databend/pull/19581)
- Signal:
  - This could reduce memory footprint and improve execution efficiency for aggregation/join plans.
- Likelihood:
  - **Moderate to high**, depending on benchmark and planner-risk review.

#### 4) Better SQL compatibility coverage through DuckDB logic tests
- PR: [#19582](https://github.com/databendlabs/databend/pull/19582)
- Signal:
  - Indicates a roadmap priority around **compatibility hardening** and regression prevention.
- Likelihood:
  - **High** as an internal quality investment, though not directly a user-facing feature.

### Broader roadmap reading

The cluster of optimizer/aggregation refactors suggests the next version may emphasize:
- more reliable aggregate rewrites,
- improved planner maintainability,
- fewer false/fragile expression matches,
- better performance for complex analytical queries.

## 7. User Feedback Summary

Based on the issues and merged fixes visible today, user pain points are fairly clear:

### 1) Users want SQL failures to be graceful, not panic-based
- Issues:
  - [#19574](https://github.com/databendlabs/databend/issues/19574)
  - [#19575](https://github.com/databendlabs/databend/issues/19575)
  - [#19578](https://github.com/databendlabs/databend/issues/19578)
- Feedback signal:
  - Users are encountering edge cases where Databend crashes internally instead of returning normal SQL errors.
- Interpretation:
  - Reliability expectations are rising, especially for advanced SQL constructs and arithmetic edge cases.

### 2) Python/dataframe ingestion ergonomics matter
- Issue: [#19443](https://github.com/databendlabs/databend/issues/19443)
- Fix: [#19557](https://github.com/databendlabs/databend/pull/19557)
- Feedback signal:
  - Users expect helper APIs like `register_csv()` to “just work” without deep knowledge of file-source SQL restrictions.
- Interpretation:
  - Client library smoothness remains a practical adoption factor.

### 3) Users likely care about memory efficiency on analytical joins
- PR: [#19556](https://github.com/databendlabs/databend/pull/19556)
- Feedback signal:
  - Even without a linked issue in today’s dataset, this type of PR usually responds to observed pressure in large-query workloads.
- Interpretation:
  - Databend is likely seeing real-world demand for lower peak memory usage and faster release of resources after join-heavy steps.

### 4) Compatibility with common SQL/testing ecosystems is a priority
- PR: [#19582](https://github.com/databendlabs/databend/pull/19582)
- Feedback signal:
  - Migrating DuckDB SQL logic tests suggests concern for broad SQL semantics alignment and regression detection.
- Interpretation:
  - Users likely value predictable behavior across familiar analytical SQL patterns.

## 8. Backlog Watch

No obviously long-stalled open issue appears in this 24-hour slice, but a few items deserve maintainer attention because of impact rather than age.

### Needs prompt maintainer attention

#### 1) Correlated subquery + UNION optimizer panic
- Issue: [#19574](https://github.com/databendlabs/databend/issues/19574)
- Reason:
  - High-severity planner panic with no linked fix yet.
  - Could affect correctness perception among advanced SQL users.

#### 2) BIGINT overflow panic in constant folding
- Issue: [#19575](https://github.com/databendlabs/databend/issues/19575)
- Reason:
  - Error handling bug in arithmetic folding is both correctness- and robustness-related.
  - Worth fast-tracking because overflow should be deterministic and safely reported.

#### 3) Parser assertion on nested UNION
- Issue: [#19578](https://github.com/databendlabs/databend/issues/19578)
- Reason:
  - Parser assertions are particularly damaging because they can make basic query text trigger internal failures.
  - Also relevant given ongoing tokenizer/parser work.

### Important open PRs that may need careful review

#### 4) Fuse block abstraction refactor
- PR: [#19576](https://github.com/databendlabs/databend/pull/19576)
- Reason:
  - Cross-cutting storage refactors can unlock future simplification but also carry integration risk.

#### 5) Type shrinking rules for aggregates and joins
- PR: [#19581](https://github.com/databendlabs/databend/pull/19581)
- Reason:
  - Potentially high payoff for performance, but planner/type changes merit strong correctness review.

#### 6) Hash join memory reclamation
- PR: [#19556](https://github.com/databendlabs/databend/pull/19556)
- Reason:
  - User-visible operational benefit is high; likely worth prioritizing if tests and benchmark results are solid.

---

## Bottom Line

Databend had an **active engineering day focused on SQL engine internals, optimizer cleanup, and storage-path improvements**. The most important positive signal is steady progress on **aggregation/optimizer quality, storage abstraction, and Python usability**, while the main risk signal is the appearance of **three new panic/assertion-class SQL bugs** in one day. In short: **project velocity is good, but short-term stability work in parser/planner/error-handling should probably take priority before the next release.**

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-20

## 1) Today’s Overview

Velox remained highly active over the last 24 hours, with **50 PRs updated** and **9 issues updated**, indicating strong ongoing development momentum across execution engine internals, SQL compatibility, storage formats, and GPU acceleration. The day’s merged work shows meaningful forward progress in both **core query semantics** and **low-level performance primitives**, while open PRs suggest substantial near-term investment in **Iceberg**, **cuDF/GPU**, **Hive I/O**, and **Spark SQL compatibility**. There were **no new releases**, so the project’s movement is currently best understood through merged PRs and active review queues rather than versioned milestones. Overall, project health looks solid, but several correctness and build-stability reports—especially around **Spark aggregate fuzzing**, **RPC build breakage**, and **date formatting semantics**—deserve attention.

## 2) Project Progress

### Merged / closed PRs advancing the engine

#### Multiset SQL semantics via new join variants
- **PR #16841 — feat(joins): Add counting semi-join and anti-join**  
  Link: https://github.com/facebookincubator/velox/pull/16841  
  Velox added **counting semi-join** and **counting anti-join** support to implement multiset semantics needed for **`INTERSECT ALL`** and **`EXCEPT ALL`**. This is a notable query engine capability upgrade: instead of simple existence-based matching, the build side now deduplicates keys while tracking per-key counts, and probe-side matches decrement counts. This improves standards-aligned set-operation execution and signals continued maturation of advanced relational semantics.

#### New aggregate function for array analytics
- **PR #16498 — feat: Add vector_sum aggregate function using Simple API**  
  Link: https://github.com/facebookincubator/velox/pull/16498  
  The new `vector_sum` aggregate computes **element-wise sums across array columns**, reducing the need for expensive unnest-and-reaggregate patterns. This is a meaningful usability and performance improvement for analytical workloads involving feature vectors, embeddings, or array-valued metrics.

#### GPU decimal enablement begins
- **PR #16612 — feat(cudf): GPU Decimal (Part 1 of 3)**  
  Link: https://github.com/facebookincubator/velox/pull/16612  
  The first stage of GPU decimal support landed, improving type preservation between Velox, Arrow, and cuDF. This is important groundwork for expanding GPU execution coverage into more finance- and ETL-heavy workloads where decimal precision is mandatory.

#### Hive index lookup improvements
- **PR #16812 — feat(hive): Add UnionResultIterator for multi-split index lookup**  
  Link: https://github.com/facebookincubator/velox/pull/16812  
  This change improves **multi-split index lookup** in Hive by merging results across split-level iterators while preserving hit order. It points to ongoing work on storage-side pruning and more efficient file access, especially relevant for mixed-format or fragmented datasets.

#### Reusable SIMD utility extracted
- **PR #16845 — feat: Add simdFill utility to SimdUtil**  
  Link: https://github.com/facebookincubator/velox/pull/16845  
  A SIMD-optimized fill primitive was generalized into Velox utilities. While lower-level than SQL features, this kind of improvement often compounds across encoding, scan, and vector-processing paths.

### What this means
Today’s merged work collectively advanced:
- **SQL standards compliance** (`INTERSECT ALL`, `EXCEPT ALL`)
- **Analytical function coverage** (`vector_sum`)
- **GPU execution foundation** (decimal support)
- **Storage/index efficiency**
- **Core vectorized runtime performance**

## 3) Community Hot Topics

### 1. Spark aggregate fuzzer instability remains the most visible correctness theme
- **Issue #16327 — Scheduled Spark Aggregate Fuzzer failing**  
  Link: https://github.com/facebookincubator/velox/issues/16327  
  Updated with **11 comments**, making it the most actively discussed issue in this snapshot. The failures point to inconsistencies between **Spark and Velox aggregate behavior**, specifically on `ARRAY<TIMESTAMP>`. This highlights a core technical need: **behavioral parity with Spark semantics under edge-case nested types**, especially in fuzz-tested paths.

- **Issue #16509 — Spark Aggregate fuzzer fails on TableScan**  
  Link: https://github.com/facebookincubator/velox/issues/16509  
  A related fuzzer-found bug suggests the Spark compatibility surface still has unresolved scan/aggregation interactions.

- **PR #16843 — fix(fuzzer): Reduce Spark aggregate fuzzer test pressure**  
  Link: https://github.com/facebookincubator/velox/pull/16843  
  This appears to be a mitigation rather than a root-cause fix. It suggests maintainers are trying to stabilize CI signal while deeper semantic discrepancies are still being investigated.

**Technical need:** stronger Spark parity for aggregates, clearer repro logging, and likely more targeted differential-testing around timestamps, arrays, and scan-fed aggregation pipelines.

### 2. GPU/cuDF coverage expansion remains a strategic theme
- **Issue #15772 — [cuDF] Expand GPU operator support for Presto TPC-DS**  
  Link: https://github.com/facebookincubator/velox/issues/15772  
  This long-running enhancement request reflects practical adoption pressure: users want more TPC-DS queries to remain on the GPU without CPU fallback.

- **PR #16522 — fix(cudf): Support zero-column count(*)**  
  Link: https://github.com/facebookincubator/velox/pull/16522  
- **PR #16824 — fix(cudf): Fix intermittent failure with new CUDF string CONCAT(VARCHAR)**  
  Link: https://github.com/facebookincubator/velox/pull/16824  
- **PR #16714 — feat(cudf): Implement LEFT SEMI PROJECT join**  
  Link: https://github.com/facebookincubator/velox/pull/16714  
- **PR #16612 — feat(cudf): GPU Decimal (Part 1 of 3)**  
  Link: https://github.com/facebookincubator/velox/pull/16612  

**Technical need:** reduce fallback frequency, broaden operator completeness, and improve reliability of string, join, and decimal execution on GPU.

### 3. Iceberg support is rapidly expanding
- **PR #16831 — Add Iceberg V3 deletion vector write path**  
  Link: https://github.com/facebookincubator/velox/pull/16831  
- **PR #16844 — Add DWRF file format support for Iceberg read and write paths**  
  Link: https://github.com/facebookincubator/velox/pull/16844  
- **PR #16834 — Add sequence number conflict resolution for positional deletes and deletion vectors**  
  Link: https://github.com/facebookincubator/velox/pull/16834  

This cluster of PRs signals a major push on **Iceberg write-path completeness**, especially around **deletion vectors**, **conflict resolution**, and **additional file formats**. The underlying technical need is clear: production-grade table format interoperability with richer mutation semantics.

### 4. Build and dependency modernization
- **PR #16650 — build: Upgrade Velox DuckDB from 0.8.1 to 1.4.4**  
  Link: https://github.com/facebookincubator/velox/pull/16650  
- **Issue #16847 — Build failure in new RPC code**  
  Link: https://github.com/facebookincubator/velox/issues/16847  
- **PR #16848 — fix(rpc): Remove gmock dependency from RPCNodeTest to fix OSS GCC-14 build**  
  Link: https://github.com/facebookincubator/velox/pull/16848  

**Technical need:** keep OSS CI green while modernizing dependencies and introducing new RPC infrastructure.

## 4) Bugs & Stability

Ranked by likely severity and ecosystem impact.

### High severity

#### 1. Spark/Velox correctness mismatch in aggregate fuzzing
- **Issue #16327 — Scheduled Spark Aggregate Fuzzer failing**  
  Link: https://github.com/facebookincubator/velox/issues/16327  
  Repeated fuzzer failures involving `ARRAY<TIMESTAMP>` imply a possible **query correctness** mismatch rather than a pure crash. Since this affects Spark semantic compatibility, severity is high for engines depending on Spark SQL parity.
- **Related PR:** **#16843** mitigation  
  Link: https://github.com/facebookincubator/velox/pull/16843

#### 2. from_unixtime year-format divergence from Spark
- **Issue #16806 — Velox from_unixtime YYYY date format get diff result with spark**  
  Link: https://github.com/facebookincubator/velox/issues/16806  
  This is a direct **user-visible correctness bug**: `YYYY` is interpreted differently, yielding `2025` instead of Spark’s `2026` for a week-year case. This is high severity for Spark SQL compatibility because date formatting discrepancies can silently corrupt reports and partitions.  
- **Fix PR:** none shown in current data.

#### 3. Build failure introduced by new RPC code
- **Issue #16847 — Build failure in new RPC code**  
  Link: https://github.com/facebookincubator/velox/issues/16847  
  Build failures block downstream integrations and external CI. The issue appears linked to mainline changes from PR #16792.
- **Related fix PR:** **#16848 — Remove gmock dependency from RPCNodeTest to fix OSS GCC-14 build**  
  Link: https://github.com/facebookincubator/velox/pull/16848

### Medium severity

#### 4. Spark aggregate fuzzer failure on TableScan
- **Issue #16509 — Spark Aggregate fuzzer fails on TableScan**  
  Link: https://github.com/facebookincubator/velox/issues/16509  
  Another correctness/stability signal in Spark aggregate execution, likely related to planner or scan-path interactions.

#### 5. Intermittent GPU string CONCAT failure
- **PR #16824 — fix(cudf): Fix intermittent failure with new CUDF string CONCAT(VARCHAR)**  
  Link: https://github.com/facebookincubator/velox/pull/16824  
  This appears to address a non-deterministic GPU runtime failure involving empty string separators. Since a fix is already ready-to-merge, this risk may be short-lived.

### Lower severity but worth tracking

#### 6. Memory checker discrepancy
- **Issue #16837 — memory checker problem**  
  Link: https://github.com/facebookincubator/velox/issues/16837  
  The report suggests a mismatch between Velox memory-checker assumptions and Linux memory accounting (`inactive_anon + active_anon` style interpretation). This could lead to false alarms or poor observability rather than immediate query wrongness.

## 5) Feature Requests & Roadmap Signals

### Strong signals likely to shape the next release

#### Iceberg write-path and delete semantics
- **PR #16831** — Iceberg V3 deletion vectors  
  https://github.com/facebookincubator/velox/pull/16831
- **PR #16834** — sequence number conflict resolution  
  https://github.com/facebookincubator/velox/pull/16834
- **PR #16844** — DWRF support for Iceberg  
  https://github.com/facebookincubator/velox/pull/16844

These are among the clearest roadmap indicators. Velox appears to be moving toward **deeper Iceberg production readiness**, especially around **mutation-aware writes** and **format breadth**.

#### Continued Spark SQL null-semantics alignment
- **Issue #16839 — Apply same RESPECT NULLS pattern to collect_list**  
  Link: https://github.com/facebookincubator/velox/issues/16839  
- **PR #16416 — Support RESPECT NULLS for Spark collect_set**  
  Link: https://github.com/facebookincubator/velox/pull/16416  

This suggests ongoing refinement of **Spark-compatible aggregate semantics**, especially around null handling. Expect more small-but-important semantic alignment changes.

#### GPU operator coverage
- **Issue #15772 — Expand GPU operator support for Presto TPC-DS**  
  Link: https://github.com/facebookincubator/velox/issues/15772  
- **PRs #16522, #16714, #16612, #16824**  
  https://github.com/facebookincubator/velox/pull/16522  
  https://github.com/facebookincubator/velox/pull/16714  
  https://github.com/facebookincubator/velox/pull/16612  
  https://github.com/facebookincubator/velox/pull/16824  

Likely next-version candidates include broader GPU support for joins, decimals, string functions, and count aggregations, especially where CPU fallback is currently too frequent.

#### Dependency and interface modernization
- **Issue #13175 — Add support for FBThrift in Parquet and remove thrift dependency**  
  Link: https://github.com/facebookincubator/velox/issues/13175  
- **PR #16650 — DuckDB upgrade to 1.4.4**  
  Link: https://github.com/facebookincubator/velox/pull/16650  

These indicate longer-term modernization work around embedded dependencies and interoperability layers.

## 6) User Feedback Summary

From the issues and PRs updated today, the clearest user/operator pain points are:

- **Semantic parity with Spark matters a lot.**  
  Users are actively reporting differences in aggregate behavior and date formatting:
  - #16327: https://github.com/facebookincubator/velox/issues/16327
  - #16509: https://github.com/facebookincubator/velox/issues/16509
  - #16806: https://github.com/facebookincubator/velox/issues/16806  
  This suggests Velox is being used in environments where Spark compatibility is not optional but operationally critical.

- **GPU users want fewer fallbacks and broader SQL/operator support.**  
  The cuDF requests and fixes show real demand for keeping TPC-DS-style queries on GPU:
  - #15772: https://github.com/facebookincubator/velox/issues/15772
  - #16522: https://github.com/facebookincubator/velox/pull/16522
  - #16714: https://github.com/facebookincubator/velox/pull/16714

- **Storage/table-format users are pushing for richer Iceberg support.**  
  The open PRs imply demand for more complete delete semantics, write support, and alternative file formats:
  - #16831: https://github.com/facebookincubator/velox/pull/16831
  - #16844: https://github.com/facebookincubator/velox/pull/16844
  - #16834: https://github.com/facebookincubator/velox/pull/16834

- **Downstream integrators are sensitive to build regressions.**  
  RPC-related build failures and GCC-14 issues show OSS consumers need predictable build hygiene:
  - #16847: https://github.com/facebookincubator/velox/issues/16847
  - #16848: https://github.com/facebookincubator/velox/pull/16848

Overall feedback signals that users value Velox for performance and breadth, but expect **compatibility correctness**, **stable builds**, and **fewer execution fallbacks**.

## 7) Backlog Watch

These older or strategically important items appear to merit continued maintainer attention:

### Long-running enhancement requests

#### GPU coverage gap for Presto TPC-DS
- **Issue #15772 — Expand GPU operator support for Presto TPC-DS**  
  Link: https://github.com/facebookincubator/velox/issues/15772  
  Open since **2025-12-15**. This appears strategically important for GPU adoption and benchmark credibility.

#### Parquet dependency modernization / FBThrift support
- **Issue #13175 — Add support for FBThrift in Parquet and remove thrift dependency**  
  Link: https://github.com/facebookincubator/velox/issues/13175  
  Open since **2025-04-28**. This is the oldest notable item in today’s list and likely affects build/dependency cleanliness and future RPC/remoting architecture.

### Open PRs that look important and likely need review bandwidth

#### DuckDB dependency upgrade
- **PR #16650 — Upgrade Velox DuckDB from 0.8.1 to 1.4.4**  
  Link: https://github.com/facebookincubator/velox/pull/16650  
  Large version jumps usually carry compatibility risk; this deserves careful review due to parser/API surface changes.

#### Spark null semantics work
- **PR #16416 — Support RESPECT NULLS for Spark collect_set**  
  Link: https://github.com/facebookincubator/velox/pull/16416  
  Marked ready-to-merge but still open, suggesting either review backlog or caution due to semantic impact.

#### Hive write-path metadata support
- **PR #16637 — Add storageParameters to HiveInsertTableHandle**  
  Link: https://github.com/facebookincubator/velox/pull/16637  
  Important for connector/write-path completeness.

## 8) Overall Health Assessment

Velox is showing **strong development velocity** and a healthy mix of **core engine work**, **storage evolution**, **GPU acceleration**, and **SQL semantics refinement**. The merged changes today were substantive, especially around **multiset join semantics**, **new aggregation capabilities**, and **GPU decimal groundwork**. The main risk area is not lack of progress, but rather **correctness and integration sharp edges**: Spark semantic mismatches, intermittent GPU issues, and OSS build regressions. If maintainers can close the loop on these stability concerns while landing the active Iceberg and cuDF work, the next release should materially improve both feature depth and production readiness.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-20

## 1. Today’s Overview

Apache Gluten remained highly active over the last 24 hours, with **8 issues updated** and **12 pull requests updated**, indicating steady engineering throughput across Spark/Velox core work and Flink integration. The day’s changes skewed toward **query engine correctness, Parquet capabilities, build/doc maintenance, and early Flink stabilization**, while bug reports revealed several fresh runtime and infrastructure concerns. Overall project health looks **active but mixed**: core feature development is moving forward, yet multiple new bugs—especially around Flink, GPU execution, and S3 lifecycle handling—show that operational maturity is still being strengthened. No new release was published today.

---

## 3. Project Progress

### Merged/closed PRs today

#### 1. README/package distribution correction
- **PR #11786** — [Fix Link to Package Repository in README](https://github.com/apache/gluten/pull/11786)
- Status: Closed
- Impact: Documentation hygiene only, but useful for reducing confusion after the repository path transition from `incubator/gluten` to `gluten`.

#### 2. Spark-version gating for native Parquet writer rules
- **PR #11787** — [Only apply VeloxParquetWriterInjects and NativeWritePostRule for Spark 3.3](https://github.com/apache/gluten/pull/11787)
- Status: Closed
- Impact: This is a **SQL compatibility and planner safety** improvement. Restricting native write rule injection to Spark 3.3 suggests maintainers are preventing misapplication across unsupported Spark versions, reducing planner regressions and write-path incompatibilities.

#### 3. Scala 2.13 + JDK 8 build fix
- **PR #11784** — [Fix Scala 2.13 build on JDK 8 by using release 8 instead of 1.8](https://github.com/apache/gluten/pull/11784)
- Status: Closed
- Impact: A build and infra fix that improves **cross-version JVM toolchain stability**, important for downstream adopters maintaining older Java environments.

#### 4. Native Avro scan PR closed stale
- **PR #11179** — [Support native Avro scan](https://github.com/apache/gluten/pull/11179)
- Status: Closed as stale
- Impact: This is notable strategically: **native Avro scan** would reduce serialization overhead and broaden file format acceleration, but closure implies either limited maintainer bandwidth or unresolved design/test debt. It weakens short-term momentum for Avro-native support.

### In-progress work worth watching
- **PR #11788** — [Enable native Parquet write for complex types](https://github.com/apache/gluten/pull/11788): major write-path capability expansion for nested types.
- **PR #11719** — [Add Parquet type widening support](https://github.com/apache/gluten/pull/11719): important for schema evolution and Spark compatibility.
- **PR #11769** — [Write per-block column statistics in shuffle writer](https://github.com/apache/gluten/pull/11769): meaningful storage/runtime optimization groundwork for block-level pruning with dynamic filters.
- **PR #11651** — [Support approx_percentile aggregate function](https://github.com/apache/gluten/pull/11651): significant SQL function coverage improvement, though semantics/fallback compatibility remain nontrivial.

---

## 4. Community Hot Topics

### 1. Velox upstream gap tracking
- **Issue #11585** — [[VL] useful Velox PRs not merged into upstream](https://github.com/apache/gluten/issues/11585)
- Activity: **16 comments**, **4 👍**
- Why it matters: This is the clearest signal that Gluten’s Velox backend still depends on **unmerged upstream Velox work**, creating friction around maintenance, rebasing, and downstream patch carrying.
- Technical need: Better alignment between Gluten and upstream Velox release/merge cycles. This affects feature velocity, reproducibility, and downstream packaging.

### 2. Severe LIMIT query underperformance versus vanilla Spark
- **Issue #11766** — [[VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries](https://github.com/apache/gluten/issues/11766)
- Activity: **5 comments**
- Why it matters: Performance regressions on trivial `LIMIT` queries directly challenge Gluten’s value proposition as an acceleration layer.
- Technical need: Likely optimization around **early-stop execution, task pruning, file scan short-circuiting, or planner strategy selection** for top-N / limit-only queries.

### 3. Native Parquet write expansion
- **PR #11788** — [Enable native Parquet write for complex types](https://github.com/apache/gluten/pull/11788)
- Why it matters: This is one of the most practically important active PRs. Supporting **Struct/Array/Map** for native writes reduces fallback and broadens production usability for semi-structured analytics workloads.
- Technical need: Closing write-path feature gaps so Velox-native execution can handle realistic Spark schemas end-to-end.

### 4. Schema evolution / compatibility work
- **PR #11719** — [Add Parquet type widening support](https://github.com/apache/gluten/pull/11719)
- Why it matters: Parquet type widening is a core compatibility requirement in evolving data lakes.
- Technical need: Better handling of **schema evolution, partition interactions, and Spark parity**.

---

## 5. Bugs & Stability

Ranked roughly by severity and production risk.

### Critical / High

#### 1. Possible runtime crash / resource lifecycle bug with S3
- **Issue #11796** — [[VL] finalizeS3FileSystem is never called](https://github.com/apache/gluten/issues/11796)
- Severity: **High**
- Risk: The report points to AWS SDK teardown never being invoked. Since Velox S3 uses static/global state, this can cause **shutdown-time instability, resource leaks, undefined process termination behavior, or test contamination**.
- Fix PR: None linked yet.

#### 2. GPU failure on broadcast hash join
- **Issue #11794** — [[VL] GPU failed on BHJ](https://github.com/apache/gluten/issues/11794)
- Severity: **High**
- Risk: Join execution failures are serious because BHJ is a common path in star-schema analytics. If reproducible, this blocks GPU-backed acceleration for important workloads.
- Fix PR: None linked yet.

#### 3. Flink memory leak / taskmanager crash with RocksDB state backend
- **Issue #11791** — [[FLINK] Memory leak when trying to run nexmark with rocksdb state backend](https://github.com/apache/gluten/issues/11791)
- Severity: **High**
- Risk: Memory leaks and taskmanager crashes indicate possible **native memory accounting or JNI lifecycle issues**, especially concerning for stateful streaming.
- Fix PR: None linked yet.

### Medium

#### 4. Flink Nexmark Q3 submission failure
- **Issue #11790** — [[FLINK] Nexmark Q3 submission error](https://github.com/apache/gluten/issues/11790)
- Severity: **Medium**
- Risk: Prevents benchmark/query execution, suggesting incomplete compatibility in Flink + Velox4j integration.
- Fix PR: None linked yet.

#### 5. Flink CI build instability
- **Issue #11793** — [[FLINK] CI build failure for flink-test](https://github.com/apache/gluten/issues/11793)
- Severity: **Medium**
- Risk: CI failures slow integration velocity and may hide unrelated regressions.
- Related PR: **PR #11789** — [Replace LinkedList with ArrayDeque and pre-size HashSet in Flink module](https://github.com/apache/gluten/pull/11789) is performance-oriented, not a direct CI fix.

#### 6. Query performance regression on simple LIMIT
- **Issue #11766** — [[VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries](https://github.com/apache/gluten/issues/11766)
- Severity: **Medium**
- Risk: Not a correctness bug, but a meaningful regression in perceived acceleration benefit.
- Fix PR: None linked yet.

### Closed / resolved signal

#### 7. `input_file_name()` on Iceberg returned empty string
- **Issue #11513** — [[VL] Input_file_name() returns "" on iceberg tables](https://github.com/apache/gluten/issues/11513)
- Status: Closed
- Significance: A **SQL function correctness / metadata propagation** issue appears to have been resolved or otherwise closed, which is a positive compatibility signal for Iceberg users.

---

## 6. Feature Requests & Roadmap Signals

### Strong signals from active PRs

#### Native Parquet write for nested/complex types
- **PR #11788** — [Enable native Parquet write for complex types](https://github.com/apache/gluten/pull/11788)
- Roadmap read: Likely to land soon if review goes well. This is a high-value feature because complex types are common in modern lakehouse schemas.

#### Parquet schema evolution support
- **PR #11719** — [Add Parquet type widening support](https://github.com/apache/gluten/pull/11719)
- Roadmap read: Strong candidate for the next release because it addresses compatibility gaps with Spark and real-world Parquet datasets.

#### Shuffle-time block statistics for pruning
- **PR #11769** — [Write per-block column statistics in shuffle writer](https://github.com/apache/gluten/pull/11769)
- Roadmap read: This looks like foundational work for **runtime data skipping / dynamic-filter-based pruning**, a meaningful performance optimization for distributed analytics.

#### Approximate analytics function support
- **PR #11651** — [Support approx_percentile aggregate function](https://github.com/apache/gluten/pull/11651)
- Roadmap read: A likely medium-term feature. It is attractive for SQL coverage, but the Spark-vs-Velox sketch incompatibility means semantics and fallback behavior must be very carefully defined before release.

### Other signals

#### Multi-key DPP correctness
- **PR #11795** — [Fix multi-key DPP support in ColumnarSubqueryBroadcastExec](https://github.com/apache/gluten/pull/11795)
- Roadmap read: Not a user-facing feature, but important for **dynamic partition pruning correctness and planner parity**.

#### Flink performance refinements
- **PR #11789** — [Replace LinkedList with ArrayDeque and pre-size HashSet in Flink module](https://github.com/apache/gluten/pull/11789)
- Roadmap read: Suggests the Flink path is still in optimization and stabilization mode rather than broad feature completion.

#### Bolt backend
- **PR #11261** — [WIP: add bolt backend in gluten](https://github.com/apache/gluten/pull/11261)
- Roadmap read: Long-running backend diversification effort, but still too early/uncertain to predict near-term inclusion.

---

## 7. User Feedback Summary

### Main pain points reported by users

1. **Performance disappointments on simple queries**
   - [Issue #11766](https://github.com/apache/gluten/issues/11766)
   - Users expect Gluten to outperform or at least match vanilla Spark on trivial scans with `LIMIT`; a 10x regression is highly visible and damaging for confidence.

2. **Flink usability is still rough**
   - [Issue #11790](https://github.com/apache/gluten/issues/11790)
   - [Issue #11791](https://github.com/apache/gluten/issues/11791)
   - [Issue #11793](https://github.com/apache/gluten/issues/11793)
   - Feedback today suggests **Flink integration remains pre-maturity**: submission errors, CI failures, and crashes with RocksDB state backend all point to incomplete readiness for stateful streaming workloads.

3. **Operational stability concerns in native subsystems**
   - [Issue #11796](https://github.com/apache/gluten/issues/11796)
   - Native SDK/resource lifecycle bugs are exactly the kinds of issues that enterprise adopters worry about in long-running services.

4. **GPU path reliability**
   - [Issue #11794](https://github.com/apache/gluten/issues/11794)
   - Users trying advanced acceleration paths still face execution risk on key operators like joins.

### Positive signals

- Continued investment in **Parquet write support**, **schema evolution**, and **SQL aggregate coverage** indicates maintainers are addressing practical adoption blockers.
- Closure of the Iceberg `input_file_name()` issue suggests incremental improvement in **lakehouse metadata function compatibility**.

---

## 8. Backlog Watch

### Important items needing maintainer attention

#### 1. Upstream dependency tracking for Velox
- **Issue #11585** — [[VL] useful Velox PRs not merged into upstream](https://github.com/apache/gluten/issues/11585)
- Why watch: This is a structural backlog issue, not just a bug. Prolonged dependence on unmerged upstream patches can increase release friction and technical debt.

#### 2. Native Avro scan effort stalled
- **PR #11179** — [Support native Avro scan](https://github.com/apache/gluten/pull/11179)
- Why watch: Closed as stale despite clear user value. If Avro matters for target users, maintainers may need to revisit scope, ownership, or test requirements.

#### 3. Bolt backend still WIP
- **PR #11261** — [WIP: add bolt backend in gluten](https://github.com/apache/gluten/pull/11261)
- Why watch: Long-lived backend work can become hard to merge if architectural assumptions drift.

#### 4. Approximate percentile support still unresolved
- **PR #11651** — [Support approx_percentile aggregate function](https://github.com/apache/gluten/pull/11651)
- Why watch: High SQL value, but cross-engine state format incompatibility makes this a subtle correctness area.

#### 5. Parquet widening support nearing readiness but likely needs focused review
- **PR #11719** — [Add Parquet type widening support](https://github.com/apache/gluten/pull/11719)
- Why watch: This touches compatibility-sensitive paths and could unlock significant usability if merged promptly.

---

## Overall Health Assessment

Apache Gluten is showing **strong development momentum**, especially around **Velox-native write/read capability, Parquet compatibility, and SQL engine parity**. However, today’s issue stream highlights that **runtime robustness and Flink maturity remain the main risks**, with several newly reported failures in native lifecycle management, GPU joins, and streaming execution. Near-term release candidates will likely be strongest if maintainers prioritize **stability triage and compatibility fixes** alongside the currently active Parquet and SQL feature work.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-20

## 1) Today’s Overview

Apache Arrow showed **steady but development-heavy activity** over the last 24 hours: **22 issues updated**, **17 PRs updated**, and **no releases**. The day’s work was concentrated less on end-user feature delivery and more on **infrastructure, packaging, Flight SQL ODBC enablement, documentation, and hardening fixes**, especially around C++/FlightRPC. A notable pattern is the burst of work on **Flight SQL ODBC packaging and platform support** across Windows, macOS, and Linux, which signals a near-term push to make Arrow’s SQL connectivity story more production-ready. Overall project health appears good, with active contributor throughput, but there were **no merged/closed items today**, so progress is currently more visible in review queues than in landed changes.

## 2) Project Progress

There were **no merged or closed PRs/issues today**, so there is no landed feature set to report for query execution, analytical storage, or SQL compatibility.

That said, the **open PR queue strongly indicates active forward movement** in several important areas:

- **Flight SQL ODBC on Linux** via Ubuntu support is under review in [PR #49564](https://github.com/apache/arrow/pull/49564), tied to [Issue #49463](https://github.com/apache/arrow/issues/49463).
- **Flight serialization decoupling from gRPC internals** is advancing in [PR #49549](https://github.com/apache/arrow/pull/49549), an architectural improvement that could simplify transport flexibility and downstream integration.
- A **Parquet crash-prevention fix** for deeply nested WKB geometries is close in [PR #49558](https://github.com/apache/arrow/pull/49558), addressing [Issue #49559](https://github.com/apache/arrow/issues/49559).
- The R ecosystem is seeing movement on cloud storage interoperability with [PR #49553](https://github.com/apache/arrow/pull/49553) for Azure Blob filesystem support, linked to [Issue #32123](https://github.com/apache/arrow/issues/32123).
- Packaging and release automation for **PyArrow riscv64 wheels** is being pushed in [PR #49556](https://github.com/apache/arrow/pull/49556), linked to [Issue #49555](https://github.com/apache/arrow/issues/49555).

## 3) Community Hot Topics

### A. Flight SQL ODBC packaging, signing, and platform rollout
This is the clearest hotspot in the project right now, with multiple related issues and PRs moving in parallel:

- [Issue #49404](https://github.com/apache/arrow/issues/49404) — **Manual ODBC Windows MSI installer signing**  
  13 comments. Focuses on Windows Defender acceptance and production-ready installer trust.
- [Issue #49463](https://github.com/apache/arrow/issues/49463) — **Enable ODBC build on Linux**  
  5 comments. Expands ODBC support beyond Windows/macOS.
- [Issue #49538](https://github.com/apache/arrow/issues/49538) — **Change Windows ODBC to static linkage**  
  A packaging simplification intended to reduce DLL signing burden.
- [Issue #49537](https://github.com/apache/arrow/issues/49537) — **Upload MSI installer materials for cpack WIX generator**
- [Issue #49560](https://github.com/apache/arrow/issues/49560) — **Release script and GitHub Actions workflow for Windows signing**
- [Issue #49563](https://github.com/apache/arrow/issues/49563) — **Unexpected `libunwind` dependency in macOS Intel CI**
- [PR #49564](https://github.com/apache/arrow/pull/49564) — **Add Ubuntu ODBC Support**
- [PR #46099](https://github.com/apache/arrow/pull/46099) — **Arrow Flight SQL ODBC layer**
- [PR #49562](https://github.com/apache/arrow/pull/49562) — **Use SQLWCHAR array in test suite**

**Analysis:** this cluster reflects a technical need to turn Flight SQL ODBC from a promising implementation into a **shippable, signed, cross-platform client driver**. For OLAP and analytical engine users, this is strategically important: ODBC remains a major compatibility layer for BI tools, enterprise desktop analytics, and federated SQL access.

### B. Documentation modernization and contributor ergonomics
Several docs PRs are active at once:

- [Issue #47696](https://github.com/apache/arrow/issues/47696) / [PR #49550](https://github.com/apache/arrow/pull/49550) — **PyCapsule protocol implementation status**
- [PR #49557](https://github.com/apache/arrow/pull/49557) — **Nested grouping in Python docs TOC**
- [Issue #31315](https://github.com/apache/arrow/issues/31315) — **Document that `strptime` ignores `%Z`**
- [PR #49554](https://github.com/apache/arrow/pull/49554) — **Clarify struct validity masking**
- [PR #49515](https://github.com/apache/arrow/pull/49515) — **Explain doctest behavior for `.pxi` files**

**Analysis:** these aren’t cosmetic only. They point to a recurring Arrow need: making advanced semantics—validity masking, extension/type interop, temporal parsing quirks, Cython test mechanics—more discoverable so users can avoid subtle correctness and interoperability mistakes.

### C. Long-tail feature work with direct analytical relevance
- [Issue #32123](https://github.com/apache/arrow/issues/32123) / [PR #49553](https://github.com/apache/arrow/pull/49553) — **R Azure Blob Storage filesystem**
- [Issue #49514](https://github.com/apache/arrow/issues/49514) — **Compute function to generate date from year/month/day**
- [Issue #49555](https://github.com/apache/arrow/issues/49555) / [PR #49556](https://github.com/apache/arrow/pull/49556) — **riscv64 Python wheel builds**
- [Issue #45722](https://github.com/apache/arrow/issues/45722) — **UnsafeAppend methods for `StructBuilder`**

**Analysis:** these requests line up with Arrow’s practical role as a substrate for data systems: cloud object store access, low-level array construction efficiency, wider architecture support, and completion of compute kernels that users expect in dataframe/SQL-style workflows.

## 4) Bugs & Stability

Ranked by likely severity and production impact:

### 1. Potential stack overflow in Parquet geometry handling
- [Issue #49559](https://github.com/apache/arrow/issues/49559) — **`MergeGeometryInternal` may stack overflow from deeply nested WKB GeometryCollection inputs**
- Fix in progress: [PR #49558](https://github.com/apache/arrow/pull/49558)

**Severity:** High  
**Why it matters:** Stack overflow on malformed or adversarially deep geometry inputs is a stability and possibly security-relevant concern, especially in geospatial ingestion pipelines reading Parquet metadata or payloads derived from external systems. The proposed fix adds a recursion depth limit, which is a reasonable containment strategy.

### 2. Memory leak / excessive memory retention during PyArrow dataset batch iteration
- [Issue #49474](https://github.com/apache/arrow/issues/49474) — **Memory Leak while iterating batches of pyarrow dataset**

**Severity:** High  
**Why it matters:** This directly affects large analytical scans on constrained infrastructure, including HPC environments. The user reports OOM kills while filtering hive-partitioned Parquet datasets batch-by-batch—exactly the kind of workload where Arrow is expected to be memory-efficient. No linked fix PR is visible in today’s data.

### 3. macOS Intel CI packaging regression from unexpected `libunwind`
- [Issue #49563](https://github.com/apache/arrow/issues/49563) — **Unexpected dependency `libunwind` in macOS Intel CI**

**Severity:** Medium  
**Why it matters:** This looks like a CI/packaging regression rather than a runtime engine bug, but it directly impacts release reliability for ODBC artifacts.

### 4. S3 URI parsing correctness in Python
- [PR #49372](https://github.com/apache/arrow/pull/49372) — **Fix S3 URI with whitespace silently falling back to LocalFileSystem**
- Related issue: [Issue #41365](https://github.com/apache/arrow/issues/41365)

**Severity:** Medium  
**Why it matters:** Silent fallback from S3 to local filesystem is a correctness and safety issue. In analytics pipelines, this can produce confusing “file not found” or wrong-environment behavior rather than an immediate explicit error.

### 5. Temporal parsing documentation gap around `%Z`
- [Issue #31315](https://github.com/apache/arrow/issues/31315) — **Document that the `strptime` kernel ignores `%Z`**
- Umbrella: [Issue #31324](https://github.com/apache/arrow/issues/31324)

**Severity:** Medium-Low  
**Why it matters:** This is framed as a docs issue, but it points to a query correctness hazard in timestamp parsing semantics, especially for ETL pipelines relying on timezone names.

## 5) Feature Requests & Roadmap Signals

### Strongest near-term signals

#### Flight SQL ODBC becoming a first-class distribution artifact
Relevant items:
- [Issue #49404](https://github.com/apache/arrow/issues/49404)
- [Issue #49463](https://github.com/apache/arrow/issues/49463)
- [Issue #49538](https://github.com/apache/arrow/issues/49538)
- [Issue #49560](https://github.com/apache/arrow/issues/49560)
- [PR #49564](https://github.com/apache/arrow/pull/49564)
- [PR #46099](https://github.com/apache/arrow/pull/46099)

**Prediction:** Very likely to appear in an upcoming release cycle in expanded or more installable form. The amount of coordinated work across CI, packaging, signing, linkage, and tests suggests this is not speculative experimentation anymore.

#### R cloud storage parity via Azure Blob support
- [Issue #32123](https://github.com/apache/arrow/issues/32123)
- [PR #49553](https://github.com/apache/arrow/pull/49553)

**Prediction:** Good candidate for the next release if review proceeds. This closes an ecosystem gap between R and Python users and strengthens Arrow’s role in cloud-native analytics.

#### Broader platform packaging support for PyArrow
- [Issue #49555](https://github.com/apache/arrow/issues/49555)
- [PR #49556](https://github.com/apache/arrow/pull/49556)

**Prediction:** Plausible near-term addition, especially because riscv64 support already exists at the C++ layer; this is mostly about making distribution practical.

### Mid-tier roadmap signals

#### Missing date-construction compute primitive
- [Issue #49514](https://github.com/apache/arrow/issues/49514)

This is a straightforward but useful function for analytics users who manipulate decomposed date parts in compute pipelines. It fills a gap in function symmetry: extractors exist, but the inverse constructor is missing. This feels like a likely future enhancement because it is small, user-facing, and broadly useful.

#### Low-level builder performance APIs
- [Issue #45722](https://github.com/apache/arrow/issues/45722)

Adding `UnsafeAppend` variants to `StructBuilder` is a clear signal from performance-sensitive users. This is most relevant for engine authors and ingestion-heavy systems that build Arrow arrays in tight loops.

#### Flight transport abstraction improvements
- [PR #49549](https://github.com/apache/arrow/pull/49549)

Decoupling serialization/deserialization from gRPC internals is an architectural roadmap signal. It may enable cleaner alternate transports, lighter dependencies, and easier embedding into custom RPC stacks.

## 6) User Feedback Summary

Today’s user-visible pain points were practical and deployment-oriented:

- **“Arrow works, but packaging/distribution is getting in the way.”**  
  The Flight SQL ODBC issues show that getting signed installers, reducing DLL sprawl, and making builds reproducible across OSes is now a key adoption blocker for enterprise users.  
  Relevant: [#49404](https://github.com/apache/arrow/issues/49404), [#49538](https://github.com/apache/arrow/issues/49538), [#49560](https://github.com/apache/arrow/issues/49560), [#49463](https://github.com/apache/arrow/issues/49463)

- **“Memory behavior in large dataset scans matters more than API elegance.”**  
  The PyArrow dataset memory leak report comes from an HPC-style batch processing use case, where users are already iterating in chunks and still hit OOM conditions. This is exactly the kind of workload Arrow is chosen for, so reliability here is critical.  
  Relevant: [#49474](https://github.com/apache/arrow/issues/49474)

- **“Cloud filesystem support should be consistent across languages.”**  
  R users want the same Azure Blob access patterns available in Python and C++.  
  Relevant: [#32123](https://github.com/apache/arrow/issues/32123), [PR #49553](https://github.com/apache/arrow/pull/49553)

- **“Function completeness matters for analytical workflows.”**  
  Users expect constructor functions that match decomposition functions, as seen in the date-from-year/month/day request.  
  Relevant: [#49514](https://github.com/apache/arrow/issues/49514)

- **“Documentation gaps can become correctness bugs.”**  
  Issues around `%Z` parsing, PyCapsule support visibility, and struct validity masking all show that advanced users are hitting semantic edges where docs need to be more explicit.  
  Relevant: [#31315](https://github.com/apache/arrow/issues/31315), [#47696](https://github.com/apache/arrow/issues/47696), [PR #49554](https://github.com/apache/arrow/pull/49554)

## 7) Backlog Watch

These older items look important and may need maintainer attention despite recent updates:

### Long-lived, still-relevant issues
- [Issue #32123](https://github.com/apache/arrow/issues/32123) — **[R] Expose Azure Blob Storage filesystem**  
  Open since 2022, critical priority, now finally matched with [PR #49553](https://github.com/apache/arrow/pull/49553). This should be reviewed promptly because it closes a longstanding ecosystem gap.

- [Issue #31324](https://github.com/apache/arrow/issues/31324) — **[C++] Strptime issues umbrella**  
  Open since 2022. Temporal parsing remains a recurring source of user confusion and correctness risk.

- [Issue #31315](https://github.com/apache/arrow/issues/31315) — **Document `%Z` ignored by `strptime` kernel**  
  Old, stale-warning tagged, but still important because it affects timestamp parsing expectations.

- [Issue #31383](https://github.com/apache/arrow/issues/31383) — **Hash join option to consolidate key columns**  
  This is analytically relevant for join output ergonomics and could matter to engine builders embedding Arrow compute.

- [Issue #31370](https://github.com/apache/arrow/issues/31370) — **Dataset file filtering by string**  
  A practical data lake usability feature; still open since 2022.

- [Issue #31361](https://github.com/apache/arrow/issues/31361) — **Custom file format support in Substrait consumer**  
  Strategically important for extensibility and query plan interoperability.

### Long-running PRs that may need decisive review
- [PR #46099](https://github.com/apache/arrow/pull/46099) — **Arrow Flight SQL ODBC layer**  
  A major long-running effort. Given the surrounding burst of ODBC issues, this likely deserves focused maintainer attention to unblock downstream packaging work.

- [PR #40354](https://github.com/apache/arrow/pull/40354) — **Python wrapper for VariableShapeTensor**  
  Open since 2024. This is a meaningful feature for tensor/ML-adjacent workflows but appears to be moving slowly.

- [PR #47397](https://github.com/apache/arrow/pull/47397) — **CSV and JSON options repr/str improvements**  
  Lower severity, but contributor-facing polish PRs can stall unnecessarily without quick review.

## Overall Health Signal

Arrow remains **active and strategically healthy**, with visible momentum in **cross-platform SQL connectivity, packaging, docs quality, and ecosystem completeness**. The main caution is that today’s work did **not yet convert into merged deliverables**, and there are still a few user-facing stability items—notably **PyArrow dataset memory behavior** and **Parquet geometry recursion safety**—that deserve close attention. For analytics and OLAP practitioners, the strongest signal is that Arrow is investing in the operational layer around the core format: **drivers, installers, cloud connectors, and safer platform distribution**.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*