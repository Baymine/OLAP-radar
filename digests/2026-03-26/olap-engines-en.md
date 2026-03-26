# Apache Doris Ecosystem Digest 2026-03-26

> Issues: 8 | PRs: 173 | Projects covered: 10 | Generated: 2026-03-26 01:27 UTC

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

# Apache Doris Project Digest — 2026-03-26

## 1. Today's Overview

Apache Doris remained highly active over the last 24 hours, with **173 pull requests updated** and **8 issues updated**, indicating strong ongoing engineering throughput despite **no new release cut today**. Most visible progress was concentrated in **stability fixes and branch backports**, especially around **external catalogs, Hive compatibility, outfile/export correctness, and cloud/external ecosystem integration**.  
The issue stream suggests current user attention is centered on **external table reliability (Iceberg/Hive)**, **cloud-native deployment behavior on Kubernetes**, and **security/authentication requirements**. Overall, project health looks solid from a delivery perspective, with many fixes landing across maintained branches, though there are still signals of **operational sharp edges in external connectors and cloud deployments**.

---

## 3. Project Progress

### Merged/closed PRs today: notable technical progress

#### External data ecosystem correctness and reliability
A meaningful share of merged work today improved Doris’s behavior with **external catalogs and lakehouse/table-format integrations**:

- **Avoid external catalog refresh deadlock** — merged and backported across branches  
  [PR #61202](https://github.com/apache/doris/pull/61202), [PR #61721](https://github.com/apache/doris/pull/61721)  
  This addresses a deadlock during external catalog refresh when cache invalidation races with cache-loader initialization. This is a high-value fix for users relying on HMS/external metadata synchronization.

- **Fix Hive DATE timezone shift in external readers** — merged and backported  
  [PR #61330](https://github.com/apache/doris/pull/61330), [PR #61722](https://github.com/apache/doris/pull/61722)  
  Doris corrected a query correctness issue where Hive external **DATE** columns from ORC/Parquet could shift by one day in western time zones. This improves SQL compatibility with Spark/Hive semantics and is important for BI/reporting consistency.

- **Paimon JDBC catalog type support** — merged and backported  
  [PR #61094](https://github.com/apache/doris/pull/61094), [PR #61694](https://github.com/apache/doris/pull/61694)  
  Adds support for **JDBC-backed Paimon catalogs**, extending Doris’s lakehouse connectivity options and indicating continued investment in multi-catalog interoperability.

#### Export / outfile correctness
- **Handle `delete_existing_files` before parallel export**  
  [PR #61223](https://github.com/apache/doris/pull/61223), [PR #61726](https://github.com/apache/doris/pull/61726)  
  This fix resolves a race condition in `SELECT ... INTO OUTFILE` where parallel writers could delete files produced by other writers. It is a practical correctness fix for distributed export workflows, especially remote/object-storage export.

#### Cloud / connector branch maintenance
- **MaxCompute missing writer auth support on branch-4.1**  
  [PR #61717](https://github.com/apache/doris/pull/61717)  
  Supplements missing authentication propagation for MaxCompute writer support. This is a branch consistency and cloud connector usability improvement.

### Important open engineering work

- **LDAP authentication resiliency and diagnostics**  
  [PR #61673](https://github.com/apache/doris/pull/61673)  
  Targets login hangs, blocking behavior, and poor observability under slow/unavailable LDAP servers. This looks like an important enterprise-readiness fix.

- **Delete quorum stall avoidance**  
  [PR #61647](https://github.com/apache/doris/pull/61647)  
  Aims to prevent delete push failures from poisoning quorum behavior. This is a stability-oriented storage/write-path improvement.

- **Fix `INSERT INTO local(...)` ignoring `backend_id`**  
  [PR #61732](https://github.com/apache/doris/pull/61732)  
  Improves execution/scheduling correctness for local TVF writes, important for node-targeted data placement workflows.

- **HMS client pool refactor and configurability**  
  [PR #61553](https://github.com/apache/doris/pull/61553), [PR #61512](https://github.com/apache/doris/pull/61512)  
  These indicate ongoing work to make Hive Metastore interactions more robust and tunable.

---

## 4. Community Hot Topics

### 1) Iceberg scan/load crash in BE
- **Issue:** BE Crash with SIGSEGV in `ByteArrayDictDecoder` and `std::out_of_range` during Iceberg table scanning/loading  
  [Issue #61225](https://github.com/apache/doris/issues/61225)

This is the most technically serious open issue in the current issue set. It points to a backend crash during Iceberg read/load paths in Doris 4.0.2, suggesting a problem in decoder logic or boundary handling when processing Iceberg-backed data. The underlying technical need is clear: users want **lakehouse interoperability without sacrificing BE process stability**.

### 2) Kubernetes/cloud observability regression
- **Issue:** Doris 4.0.4 metaservice on k8s no longer outputs logs to stdout  
  [Issue #61728](https://github.com/apache/doris/issues/61728)

This highlights a very practical cloud-native requirement: operators expect logs to flow to **standard output** for Kubernetes collection pipelines. The issue suggests that even when query/storage behavior is stable, **operational observability regressions** can be highly disruptive in production.

### 3) Stronger password policy support
- **Issue:** Support complex user-password validation  
  [Issue #61727](https://github.com/apache/doris/issues/61727)

This is a straightforward enterprise security request. The need behind it is alignment with corporate IAM/security baselines where passwords must include digits/symbols and satisfy complexity constraints. It signals demand for more mature account-policy controls.

### 4) ANN index limitations by table model
- **Issue:** Why ANN index is only supported on Duplicate Key table model?  
  [Issue #61712](https://github.com/apache/doris/issues/61712)

This is a roadmap-style product question rather than a bug report. It indicates real user interest in using Doris’s vector search/ANN capability with **Unique Key** and **Aggregate Key** models, suggesting users want vector retrieval integrated into more traditional analytical data models.

### 5) LDAP operational robustness
- **PR:** Improve LDAP authentication resiliency and diagnostics  
  [PR #61673](https://github.com/apache/doris/pull/61673)

Even though comment counts are unavailable in the provided data, this PR stands out because it addresses multiple production-facing pain points: hangs, latency spikes, and weak diagnostics. The need is stronger FE auth-path resilience under partial infrastructure failure.

---

## 5. Bugs & Stability

Ranked by likely severity and production impact:

### Critical
#### 1) BE crash on Iceberg scan/load
- [Issue #61225](https://github.com/apache/doris/issues/61225)  
A consistent **SIGSEGV** during Iceberg reading/loading is the highest-severity item today because it can terminate backend processes and affect query/load availability.  
**Fix PR found in provided data?** No direct fix PR is visible yet.

### High
#### 2) External catalog refresh deadlock
- [PR #61202](https://github.com/apache/doris/pull/61202)  
- [PR #61721](https://github.com/apache/doris/pull/61721)  
This has already been fixed and backported. Deadlocks in metadata refresh can freeze catalog-dependent workloads and are especially harmful in mixed internal/external deployments.

#### 3) Hive DATE correctness bug
- [PR #61330](https://github.com/apache/doris/pull/61330)  
- [PR #61722](https://github.com/apache/doris/pull/61722)  
A correctness issue rather than a crash, but dangerous because it silently returns wrong dates in some time zones. This is a strong sign Doris maintainers are prioritizing SQL semantic compatibility.

#### 4) Parallel outfile deletion race
- [PR #61223](https://github.com/apache/doris/pull/61223)  
- [PR #61726](https://github.com/apache/doris/pull/61726)  
Important for export workloads: concurrent writers could remove each other’s output. The merged fix reduces risk of corrupted/incomplete exports.

### Medium
#### 5) Metaservice logs missing from stdout on Kubernetes
- [Issue #61728](https://github.com/apache/doris/issues/61728)  
This may not affect query correctness directly, but it reduces production operability, observability, and incident response capability.

#### 6) Azure Vault HTTPS issue
- [Issue #60971](https://github.com/apache/doris/issues/60971)  
Closed today. While the closing reason is not detailed in the dataset, it indicates active attention to cloud storage vault connectivity/security configuration.

### Medium-to-low, but operationally relevant
#### 7) LDAP login hang / blocking behavior
- [PR #61673](https://github.com/apache/doris/pull/61673)  
Still open, but likely important for enterprise users integrating central authentication.

---

## 6. Feature Requests & Roadmap Signals

### Strong feature signals from users

#### Complex password validation
- [Issue #61727](https://github.com/apache/doris/issues/61727)  
This is a likely candidate for a near-term security enhancement because it is relatively scoped and aligns with enterprise compliance expectations.

#### ANN indexes beyond Duplicate Key tables
- [Issue #61712](https://github.com/apache/doris/issues/61712)  
This request signals demand for broader **vector search integration** inside Doris’s table model ecosystem. If adopted, this would be strategically important, but it likely requires deeper storage/update semantics work than a small feature patch.

#### SHOW META-SERVICES in cloud mode
- [PR #56247](https://github.com/apache/doris/pull/56247)  
Although stale, it reflects user need for better cloud-mode introspection and management commands.

### Roadmap signals from merged work

Merged PRs suggest the project is investing in:
- **External metadata system robustness**: [PR #61202](https://github.com/apache/doris/pull/61202)
- **Lakehouse connector breadth**: [PR #61094](https://github.com/apache/doris/pull/61094)
- **Cross-engine semantic correctness**: [PR #61330](https://github.com/apache/doris/pull/61330)
- **Operational safety in distributed export/write paths**: [PR #61223](https://github.com/apache/doris/pull/61223)

### Prediction: likely next-version inclusions
Based on current activity, the next Doris version is likely to include more work around:
1. **Hive/HMS stability and pooling improvements**
2. **External catalog/lakehouse correctness fixes**
3. **Enterprise auth/security hardening**
4. **Cloud-native observability and metadata service tooling**

---

## 7. User Feedback Summary

Current user feedback patterns are practical and production-oriented rather than feature-hype-driven:

- **Users want external table support to be crash-free and semantically correct.**  
  Iceberg crashes and Hive DATE shift issues show that interoperability is valuable, but users are sensitive to both **stability** and **silent correctness errors**.

- **Cloud-native operators care about observability as much as core functionality.**  
  The metaservice stdout logging issue on Kubernetes shows that container-era users expect Doris components to integrate cleanly into standard logging stacks.

- **Enterprise deployments want stronger auth controls and resilience.**  
  Requests for password complexity and LDAP robustness indicate Doris is increasingly used in environments with centralized identity, compliance requirements, and stricter operational guardrails.

- **Advanced AI/vector use cases are emerging.**  
  The ANN table-model limitation question suggests users are exploring Doris beyond classic OLAP and want vector search capabilities to work with richer table semantics.

Overall, user sentiment inferred from today’s activity points to a mature adoption phase: not just “add features,” but “make connectors, auth, and operations production-safe.”

---

## 8. Backlog Watch

These older or stale items appear to need maintainer attention:

### Open PRs with age/staleness but possible relevance
- **SHOW META-SERVICES in cloud mode**  
  [PR #56247](https://github.com/apache/doris/pull/56247)  
  Stale, but could improve cloud deployment introspection.

- **Iceberg insert test/logging PR**  
  [PR #56466](https://github.com/apache/doris/pull/56466)  
  Limited summary, but given the current Iceberg crash issue, any Iceberg-related diagnostics work may deserve renewed review.

- **Profile counter cleanup PRs**  
  [PR #56498](https://github.com/apache/doris/pull/56498), [PR #56500](https://github.com/apache/doris/pull/56500)  
  Approved/reviewed status exists on one, but both remain open and stale, suggesting possible duplication or branch drift that should be resolved.

- **Multiple stale dependency bumps**  
  [PR #52454](https://github.com/apache/doris/pull/52454), [PR #53029](https://github.com/apache/doris/pull/53029), [PR #53136](https://github.com/apache/doris/pull/53136), [PR #53138](https://github.com/apache/doris/pull/53138)  
  These are not urgent feature work, but accumulated dependency drift can increase future maintenance cost and security exposure.

### Closed as stale: possible lost enhancement demand
- **Nereids `StatsCommand` support**  
  [Issue #42631](https://github.com/apache/doris/issues/42631)  
  Even though closed as stale, this still reflects a planner parity gap between legacy planner and Nereids. If unresolved elsewhere, it may remain relevant.

- **BE HTTPS private key plaintext requirement**  
  [Issue #56103](https://github.com/apache/doris/issues/56103)  
  Closed as stale, but the topic hints at a potentially confusing TLS operational requirement that may merit better docs or validation behavior.

---

## Overall Health Assessment

Apache Doris shows **strong maintainer velocity** and especially good follow-through on **backports across release branches**, which is a positive sign for release discipline. Today’s merged work materially improves **external catalog safety, Hive compatibility, export correctness, and connector breadth**.  
The biggest watch item is **backend stability in Iceberg paths**, followed by **Kubernetes/cloud operational regressions** and **enterprise auth hardening**. In short: Doris is progressing well as a production analytical engine, with current pressure concentrated on making its expanding external ecosystem and cloud-native operation as reliable as its core OLAP engine.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-26

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, but current activity is skewed more toward **correctness, connector hardening, cloud operability, and SQL compatibility** than toward headline feature launches. Across engines, the strongest demand signals are around **lakehouse interoperability** (Iceberg/Hive/Paimon/Delta/Parquet), **streaming and external metadata correctness**, and **production-safe cloud deployment**. Query engines are also converging on broader SQL surface area, but users are increasingly prioritizing **wrong-result prevention, observability, and operational resilience** over raw benchmark claims. Overall, the landscape looks mature: projects are no longer just racing on performance, but on **ecosystem fit, enterprise readiness, and reliability under heterogeneous data architectures**.

---

## 2. Activity Comparison

### Snapshot table

| Project | Updated Issues | Updated PRs | Release Today / Recent | Health Score* | Short Read |
|---|---:|---:|---|---:|---|
| **ClickHouse** | 32 | 349 | No release today | **9.0/10** | Very high velocity; strong feature + infra throughput, but meaningful correctness pressure |
| **Apache Doris** | 8 | 173 | No release today | **8.7/10** | Strong branch discipline and backports; focus on external catalog and production fixes |
| **StarRocks** | 9 | 120 | **4.0.8 released (2026-03-25)** | **8.6/10** | Healthy maintenance cadence; strong patching and branch support |
| **DuckDB** | 30 | 52 | No release today | **8.4/10** | Fast post-release stabilization; correctness and embedded/runtime fixes active |
| **Apache Iceberg** | 21 | 50 | No release today | **8.3/10** | Strong roadmap momentum, especially metadata/REST evolution; some correctness risks remain |
| **Delta Lake** | 2 | 40 | No release today | **8.1/10** | Active, but concentrated in a few large CDC/DSv2 workstreams |
| **Apache Arrow** | 50 | 26 | No release today | **8.0/10** | Broad ecosystem maintenance and connector work; high maturity, lower engine-centric intensity |
| **Velox** | 6 | 50 | No release today | **7.9/10** | Strong engine development, but fuzz/CI and GPU coverage remain watch points |
| **Databend** | 3 | 22 | No release today | **7.8/10** | Productive stabilization phase; smaller but responsive community |
| **Apache Gluten** | 12 | 15 | No release today | **7.6/10** | Healthy execution-layer progress, but still dependent on upstream/backend convergence |

\*Health score is a qualitative synthesis of visible engineering throughput, release discipline, bug severity profile, and roadmap clarity from today’s digest.

### Quick interpretation
- **Highest raw activity:** ClickHouse, Doris, StarRocks.
- **Most obvious release stabilization motion:** StarRocks, Doris, DuckDB.
- **Most architecture/format-platform oriented:** Iceberg, Delta Lake, Arrow.
- **Most engine-subsystem focused:** Velox, Gluten.
- **Most compact but responsive:** Databend.

---

## 3. Apache Doris's Position

### Where Doris is strong vs peers
Apache Doris is in a strong middle position between **high-scale MPP OLAP systems** like ClickHouse/StarRocks and **embedded / single-node analytics** like DuckDB. Relative to peers, Doris showed especially good progress in:
- **release branch backport discipline**
- **external catalog robustness**
- **Hive semantic compatibility**
- **export/outfile correctness**
- **enterprise-oriented auth and cloud deployment hardening**

That combination makes Doris look increasingly attractive for teams that want an integrated analytical database with both **internal storage** and **external lakehouse connectivity**, rather than a pure table-format layer or a single-node engine.

### Technical approach differences
Compared with:
- **ClickHouse**: Doris is currently more visibly focused on **operational correctness in federated/lakehouse scenarios**, while ClickHouse is balancing that with a much larger stream of SQL, storage, and engine internals work.
- **StarRocks**: Doris and StarRocks are close peers structurally, but today Doris looked more focused on **Hive/HMS/external catalog correctness**, while StarRocks had stronger signals around **release engineering and FE metadata/connector scaling**.
- **DuckDB**: Doris targets distributed serving/warehouse-style deployments; DuckDB targets embedded analytics and developer workflows.
- **Iceberg/Delta**: Doris is a database engine consuming/opening external formats, while Iceberg and Delta are primarily **table-format and metadata ecosystems**.
- **Velox/Gluten/Arrow**: Doris is an end-user database system, not a reusable execution substrate or columnar library.

### Community size comparison
On visible daily activity, Doris sits in the **top tier**, but below ClickHouse:
- **Doris (173 PRs)** clearly outpaces DuckDB, Iceberg, Delta, Databend, Velox, Gluten, and Arrow in repo update volume.
- It is most comparable to **StarRocks** in immediate competitive set and remains behind **ClickHouse** in sheer engineering scale.
- This suggests Doris has a **large and disciplined maintainer base**, especially strong in branch maintenance and production patch flow.

### Current Doris watch items
Its main gaps versus best-in-class peers are still visible in:
- **Iceberg read-path stability**
- **Kubernetes/cloud-native operational polish**
- **enterprise security policy depth**
- **broader advanced feature breadth** relative to ClickHouse’s SQL and ecosystem surface

---

## 4. Shared Technical Focus Areas

## A. Lakehouse and external catalog reliability
**Engines:** Doris, ClickHouse, StarRocks, DuckDB, Iceberg, Delta, Gluten, Arrow  
**Need:** robust reads/writes over Iceberg/Hive/Paimon/Delta/Parquet/object stores with correct metadata refresh, pushdown, type handling, and failure semantics.

Examples:
- **Doris**: external catalog refresh deadlock, Hive DATE timezone correctness, Paimon JDBC support
- **StarRocks**: Iceberg FE OOM, Paimon refresh ClassCastException, Parquet/ADLS fixes
- **ClickHouse**: Iceberg pushdown and query log observability
- **DuckDB**: S3 ETag false-change detection, external cache work
- **Iceberg / Delta**: REST/catalog/streaming semantics and cross-engine behavior
- **Gluten / Arrow**: Iceberg write config mapping, Parquet compatibility, cloud filesystem parity

## B. Correctness over performance marketing
**Engines:** ClickHouse, DuckDB, Doris, StarRocks, Iceberg, Databend, Velox  
**Need:** prevent silent wrong results, semantic drift, and crashy edge cases.

Examples:
- **ClickHouse**: wrong results on Decimal MIN/MAX, cast correctness, timezone regressions
- **DuckDB**: optimizer wrong results, lateral join correctness, checkpoint crash
- **Doris**: Hive DATE wrong-result fix; Iceberg scan crash remains open
- **StarRocks**: stale Iceberg metadata cache causing wrong results
- **Databend**: anti-panic hardening and planner semantic fixes
- **Velox**: join correctness and window-fuzzer crash exposure

## C. Cloud-native operability and observability
**Engines:** Doris, StarRocks, Arrow, Velox, Delta, DuckDB  
**Need:** predictable logging, stable CI/builds, cloud storage auth/config propagation, and better diagnostics.

Examples:
- **Doris**: metaservice logs missing from stdout on Kubernetes, LDAP observability
- **Delta**: passing streaming datasource options into DeltaLog snapshot
- **Arrow**: packaging and CI hardening across ecosystems
- **Velox**: build impact analysis, ABFS connector efficiency
- **DuckDB**: Windows/CLI and WASM path behavior
- **StarRocks**: multi-FE metadata consistency, branch maintenance

## D. SQL compatibility and planner control
**Engines:** ClickHouse, DuckDB, StarRocks, Databend, Doris, Gluten  
**Need:** broader SQL support plus explicit optimizer control where semantics matter.

Examples:
- **ClickHouse**: UNIQUE predicate, VALUES in FROM, AST/Substrait exposure
- **DuckDB**: parser/binder correctness, advanced column syntax
- **StarRocks**: CTE MATERIALIZED / NOT MATERIALIZED hints
- **Databend**: IF NOT EXISTS schema DDL, binary literal syntax, subquery/join correctness
- **Doris**: enterprise auth and planner/connector tuning rather than broad SQL expansion today
- **Gluten**: Spark semantic parity, TimestampNTZ behavior

## E. Streaming / CDC correctness
**Engines:** Iceberg, Delta, DuckDB, Doris indirectly via external reads  
**Need:** exactness across snapshot changes, offset handling, recovery behavior, schema coordination.

Examples:
- **Delta**: large coordinated CDC streaming stack
- **Iceberg**: Flink duplication during recovery; Spark snapshot correctness concerns
- **DuckDB**: not a streaming platform first, but durability/checkpoint correctness remains central
- **Doris**: external format reliability matters where streaming-fed lakehouse tables are queried

## F. Enterprise auth, security, and governance
**Engines:** Doris, StarRocks, Iceberg, Arrow, Delta  
**Need:** stronger authentication resilience, password policy, dependency CVE handling, secure catalog behavior.

Examples:
- **Doris**: LDAP resilience, password complexity request
- **StarRocks**: dependency CVE issues
- **Iceberg**: REST encryption and access-control direction
- **Arrow**: supply-chain / packaging hardening tone visible in CI responsiveness
- **Delta**: structured error handling and UC-oriented integration

---

## 5. Differentiation Analysis

## A. Storage format orientation
- **Apache Doris / StarRocks / ClickHouse / Databend**: primary database engines with native storage layers, while also expanding external table/lakehouse access.
- **DuckDB**: embedded analytical DB with strong file-native analytics over Parquet/object storage.
- **Iceberg / Delta Lake**: table-format and metadata ecosystems rather than full standalone compute-first OLAP databases.
- **Arrow**: columnar data interoperability layer and libraries, not a warehouse.
- **Velox / Gluten**: execution acceleration substrate, not a standalone data platform.

## B. Query engine design
- **ClickHouse**: very broad, aggressively evolving query engine with deep storage/runtime specialization.
- **Doris / StarRocks**: distributed MPP SQL engines tuned for serving and warehouse-style analytics, increasingly connector-aware.
- **DuckDB**: single-process vectorized engine optimized for embedded/local analytics and developer ergonomics.
- **Databend**: cloud-oriented analytical engine still smaller in ecosystem reach but actively refining planner/executor behavior.
- **Velox / Gluten**: reusable execution engine and Spark acceleration layer respectively.
- **Iceberg / Delta**: rely on external engines for execution.

## C. Target workloads
- **Doris / StarRocks**: real-time analytics, mixed internal-external warehouse workloads, BI serving, increasingly lakehouse federation.
- **ClickHouse**: very broad range—observability, event analytics, warehouse-style SQL, semi-structured/search-adjacent analytics.
- **DuckDB**: local analytics, notebooks, embedded application analytics, developer data workflows.
- **Iceberg / Delta**: multi-engine data lake/lakehouse storage standardization.
- **Arrow**: interchange, in-memory analytics plumbing, connectors.
- **Velox / Gluten**: acceleration and execution backend infrastructure.
- **Databend**: cloud analytics with growing SQL surface and engine maturity.

## D. SQL compatibility posture
- **Most aggressive today:** ClickHouse, DuckDB, Databend
- **Optimizer control / warehouse semantics emphasis:** StarRocks
- **Connector correctness over syntax breadth today:** Doris
- **Spark semantic fidelity:** Gluten
- **API/data model semantics rather than SQL-first:** Iceberg, Delta, Arrow

## E. Operational model
- **Enterprise cluster-first:** Doris, StarRocks, ClickHouse
- **Embedded/local-first:** DuckDB
- **Lakehouse-control-plane-first:** Iceberg, Delta
- **Library/platform-component-first:** Arrow, Velox, Gluten
- **Cloud-native DB challenger:** Databend

---

## 6. Community Momentum & Maturity

## Activity tiers

### Tier 1: Very high momentum
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

These projects show the strongest combination of daily throughput, maintainer responsiveness, and broad subsystem coverage. They appear mature enough to sustain both new work and patch streams.

### Tier 2: High but more specialized or narrower-scope momentum
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **Velox**
- **Apache Arrow**

These communities are very active, but each is concentrated around a clearer product boundary: embedded DB, table format, CDC stack, execution library, or columnar ecosystem.

### Tier 3: Focused but smaller-scale iteration
- **Databend**
- **Apache Gluten**

Both show strong responsiveness, but with smaller visible repo activity and more concentrated work themes.

## Who is rapidly iterating?
- **ClickHouse**: broad-front rapid iteration
- **Doris**: high-throughput stabilization plus ecosystem hardening
- **DuckDB**: fast regression response in 1.5.x cycle
- **Delta Lake**: rapidly iterating in a stacked CDC/DSv2 architecture stream
- **Velox**: fast engine evolution, especially around GPU and remote execution

## Who is in stabilization mode?
- **StarRocks**: strong patch and branch maintenance around 4.0.x
- **Doris**: also partly in stabilization mode, but with enough connector breadth to still look expansionary
- **DuckDB**: clearly post-release stabilization
- **Arrow**: mature maintenance and ecosystem expansion
- **Gluten**: compatibility hardening and roadmap consolidation

## Maturity signals
- **Highest ecosystem maturity:** Arrow, ClickHouse, Iceberg
- **Highest warehouse-product maturity in this set:** ClickHouse, Doris, StarRocks
- **Highest embedded maturity:** DuckDB
- **Strong but still evolving enterprise/lakehouse maturity:** Delta, Databend, Gluten, Velox

---

## 7. Trend Signals

## 1) Lakehouse interoperability is now table stakes
Users increasingly expect engines to query and write across **Iceberg, Hive, Paimon, Delta, Parquet, and cloud object stores** without semantic drift or operational fragility. For architects, this means engine choice is increasingly about **quality of federation and metadata handling**, not just native storage performance.

## 2) Silent wrong results are a bigger reputational risk than crashes
Multiple communities are dealing with wrong-result bugs in aggregates, timestamps, stale metadata caches, and optimizer rewrites. For data engineers, this reinforces the need to evaluate engines not only on speed, but on **correctness discipline, regression testing culture, and backport responsiveness**.

## 3) Cloud-native operability is a first-class product requirement
Kubernetes logging, object-store auth propagation, CI/build resilience, cloud filesystem parity, and diagnosable failure modes are recurring requests. For platform teams, the winning engines will be those that fit standard **container, observability, and security** workflows with minimal bespoke ops effort.

## 4) SQL compatibility is broadening, but with different strategic intent
Some projects are expanding SQL to improve migration and BI compatibility (**ClickHouse, DuckDB, Databend, StarRocks**), while others are prioritizing semantic compatibility within an existing ecosystem (**Doris with Hive semantics, Gluten with Spark semantics**). Decision-makers should distinguish between **surface syntax support** and **deep semantic compatibility**.

## 5) Streaming/CDC and snapshot semantics are becoming central
Iceberg and Delta activity shows that table formats are no longer just passive storage layers; users want **reliable incremental consumption, CDC, recovery correctness, and schema coordination**. This matters for architectures that blend warehouse analytics with near-real-time pipelines.

## 6) Enterprise readiness is increasingly defined by auth, governance, and dependency hygiene
LDAP resilience, password policy, REST catalog encryption, CVE management, and supply-chain hardening all surfaced. For enterprise buyers, this means governance and security posture are becoming stronger differentiators among otherwise fast analytical systems.

## 7) The ecosystem is stratifying into platform layers
A clearer stack is emerging:
- **Databases**: Doris, ClickHouse, StarRocks, DuckDB, Databend
- **Table formats/control plane**: Iceberg, Delta
- **Execution substrates**: Velox, Gluten
- **Columnar/interchange foundation**: Arrow

That layered structure is valuable for architects because it enables more modular system design—but it also means teams must evaluate not only a single project, but the **quality of integration across layers**.

---

## Bottom Line for Apache Doris

Apache Doris is currently well-positioned as a **production-oriented distributed OLAP engine with serious lakehouse ambitions**. Its strongest differentiators today are **release discipline, backport execution, external catalog hardening, and practical correctness fixes**, putting it in a credible competitive position against StarRocks and below ClickHouse only in sheer ecosystem scale and breadth. For teams evaluating Doris, the key question is less “can it do OLAP?” and more “is its external ecosystem path mature enough for our hybrid warehouse/lakehouse environment?”—and today’s signals suggest that Doris is moving in the right direction, though **Iceberg stability, Kubernetes operability, and enterprise auth depth** remain the most important areas to monitor.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-26

## 1) Today’s Overview

ClickHouse remains highly active: **349 PRs** and **32 issues** were updated in the last 24 hours, with **194 PRs still open** and **155 PRs merged/closed**, indicating strong maintainer throughput. Activity is concentrated around three themes: **query engine / SQL semantics**, **storage and object-storage internals**, and **stability hardening via fuzzing/sanitizers/CI**. There were **no new releases**, so today’s signal comes from ongoing development and bug triage rather than packaged delivery. Overall project health looks strong on velocity, though there is visible pressure from correctness regressions, flaky tests, and edge-case crashes in newer engine paths.

## 2) Project Progress

With **155 PRs merged/closed** in the last day, the project appears to be advancing on both user-facing SQL capabilities and low-level engine reliability.

### Query engine and SQL work in motion
Several open PRs show where the engine is moving next:

- **`UNIQUE` subquery predicate** adds a SQL-standard construct for duplicate detection in subqueries, a clear SQL compatibility improvement.  
  Link: [PR #99877](https://github.com/ClickHouse/ClickHouse/pull/99877)

- **AST JSON serialization** would expose parser/analyzer structures in a machine-readable format, useful for tooling, gateways, linting, and query observability.  
  Link: [PR #100412](https://github.com/ClickHouse/ClickHouse/pull/100412)

- **Substrait export via `EXPLAIN SUBSTRAIT`** points to interoperability with external planning and federated data ecosystems.  
  Link: [PR #94540](https://github.com/ClickHouse/ClickHouse/pull/94540)

- **`JSONAllValues` plus text index support over it** suggests more native support for semi-structured search workloads.  
  Link: [PR #100730](https://github.com/ClickHouse/ClickHouse/pull/100730)

- **NATURAL JOIN AST reconstruction fix** improves SQL round-tripping and parser correctness.  
  Link: [PR #100223](https://github.com/ClickHouse/ClickHouse/pull/100223)

### Storage and execution-path optimization
There are also strong signals in storage internals and performance engineering:

- **Userspace page cache hot-path optimization** reduces per-block hashing/string-copy overhead, likely improving file-read efficiency on large scans.  
  Link: [PR #100300](https://github.com/ClickHouse/ClickHouse/pull/100300)

- **`borrow_from_cache` object storage and `memory` metadata types** suggests experimentation with ephemeral object placement and metadata handling, likely relevant to cloud/disaggregated storage patterns.  
  Link: [PR #100371](https://github.com/ClickHouse/ClickHouse/pull/100371)

- **Position-based unused column removal** may help optimize plans where column names mutate or aliases complicate pruning.  
  Link: [PR #100586](https://github.com/ClickHouse/ClickHouse/pull/100586)

- **Iceberg query log read_rows fix** and **query_log `used_table_functions` for DataLakeCatalog** show continued investment in data lake observability and connector correctness.  
  Links: [PR #99282](https://github.com/ClickHouse/ClickHouse/pull/99282), [PR #100706](https://github.com/ClickHouse/ClickHouse/pull/100706)

### Stability and test infrastructure
A lot of throughput is going into making failures reproducible and reducing CI noise:

- **Enable query profiler under sanitizers** should improve debugging quality in memory/race bug hunts.  
  Link: [PR #100242](https://github.com/ClickHouse/ClickHouse/pull/100242)

- **LLVM source-based per-test coverage** modernizes coverage collection and should improve maintainability of nightly quality pipelines.  
  Link: [PR #99513](https://github.com/ClickHouse/ClickHouse/pull/99513)

- **Spark-related flaky timeout fix** and another flaky-test close indicate active CI stabilization.  
  Links: [PR #100765](https://github.com/ClickHouse/ClickHouse/pull/100765), [PR #100641](https://github.com/ClickHouse/ClickHouse/pull/100641)

## 3) Community Hot Topics

Below are the most discussed and strategically interesting items.

### 1. Settings-object bloat in core development
- **Issue:** [#58797 Settings objects became too big](https://github.com/ClickHouse/ClickHouse/issues/58797)
- Why it matters: This is a core maintainability/performance concern in the engine itself—large structs, large generated loops, larger stack frames, and symbol bloat all affect compile time, binary size, and possibly runtime efficiency.
- Underlying need: ClickHouse’s configuration surface has grown enough that maintainers now need architectural refactoring, not just incremental additions.

### 2. GPU support
- **Issue:** [#63392 GPU support](https://github.com/ClickHouse/ClickHouse/issues/63392)
- Why it matters: The continued attention on this request shows sustained user interest in GPU-accelerated analytics, especially for AI-adjacent or vector-heavy workloads.
- Underlying need: Users want ClickHouse to remain competitive with RAPIDS/cuDF-style acceleration stacks, but GPU support would require deep decisions around execution model, memory layout, operators, and cost/benefit.

### 3. CI crash during pipeline execution
- **Issue:** [#99295 CI crash: Exception during pipeline execution](https://github.com/ClickHouse/ClickHouse/issues/99295)
- Why it matters: Recurrent CI crashes consume maintainer attention and slow integration velocity.
- Underlying need: Better determinism in pipeline execution and stronger crash deduplication for developer productivity.

### 4. Projection index support for `ARRAY JOIN`
- **Issue:** [#98953 ARRAY JOIN in Projection Index](https://github.com/ClickHouse/ClickHouse/issues/98953)
- Why it matters: This speaks to observability/event workloads where nested labels/maps need fast access paths.
- Underlying need: More expressive secondary acceleration structures over semi-structured data.

### 5. SQL-standard `VALUES` in `FROM`
- **Issue:** [#99605 Support `FROM (VALUES (...), ...) AS alias(col, ...)`](https://github.com/ClickHouse/ClickHouse/issues/99605) — now closed
- Why it matters: This is a direct SQL compatibility gap with PostgreSQL/MySQL/DuckDB-like systems.
- Underlying need: Easier porting of analytics SQL and BI-generated queries into ClickHouse.

## 4) Bugs & Stability

Today’s bug picture is mixed: fast closure on some items, but several correctness and crash risks remain open.

### Highest severity

#### 1. Potential wrong results on Decimal `MAX/MIN` with `GROUP BY`
- **Issue:** [#100740 MAX()/MIN() on Decimal columns with GROUP BY returns incorrect results](https://github.com/ClickHouse/ClickHouse/issues/100740)
- Severity: **Critical**  
- Why: Wrong aggregate results are more dangerous than crashes because they can silently corrupt analytics decisions.
- Status: Open, no linked fix PR in provided data.

#### 2. ReplicatedMergeTree mutation checksum mismatch loop
- **Issue:** [#100493 CHECKSUM_DOESNT_MATCH during Mutation on ReplicatedMergeTree (Version 26.3)](https://github.com/ClickHouse/ClickHouse/issues/100493)
- Severity: **Critical**  
- Why: A replica can get stuck repeatedly fetching a mutated part, impacting availability and cluster convergence.
- Status: Open, no clear fix PR shown.

#### 3. Silent wrong values in `accurateCastOrNull` to QBit
- **Issue:** [#100697 accurateCastOrNull to QBit silently produces wrong values when array elements lose precision](https://github.com/ClickHouse/ClickHouse/issues/100697)
- Severity: **Critical**  
- Why: Another silent-correctness bug, and especially notable because it appears to be introduced by a prior fix.
- Status: Open.

### High severity

#### 4. `extremes=1` fails with `AggregateFunctionStateData`
- **Issue:** [#100698 `extremes=1` causes exception with `AggregateFunctionStateData`](https://github.com/ClickHouse/ClickHouse/issues/100698)
- Severity: **High**
- Why: A settings-dependent failure in result post-processing can break advanced analytical workflows and debugging sessions.
- Status: Open.

#### 5. DateTime behavior regression between 26.2.3 and 26.2.4
- **Issue:** [#100614 Different stored/displayed `DateTime` for same `INSERT` between 26.2.3 and 26.2.4 with `session_timezone`](https://github.com/ClickHouse/ClickHouse/issues/100614)
- Severity: **High**
- Why: Timezone regressions are operationally painful and can create subtle cross-version data inconsistency.
- Status: Open.

#### 6. Crash in key condition handling for LowCardinality tuple key
- **PR:** [#100760 Fix crash in has() with LowCardinality tuple key in KeyCondition](https://github.com/ClickHouse/ClickHouse/pull/100760)
- Severity: **High**
- Why: Crash in predicate/index path; marked **must-backport** and **critical-bugfix**, indicating maintainer priority.
- Status: Fix PR open.

#### 7. Vertical merge nested default corruption
- **PR:** [#100330 Fix vertical merge nested default corruption](https://github.com/ClickHouse/ClickHouse/pull/100330)
- Severity: **High**
- Why: Storage merge corruption is among the most serious classes of issues; also marked **must-backport** and **critical-bugfix**.
- Status: Fix PR open.

### Medium severity

#### 8. Correlated subquery hidden in ALIAS expression can crash server
- **PR:** [#100753 Fix server crash on correlated subquery in ALIAS column expression](https://github.com/ClickHouse/ClickHouse/pull/100753)
- Status: Fix in progress.

#### 9. Parquet/Iceberg page-level pushdown not effective for `IN (subquery)`
- **Issue:** [#100743 page-level filter pushdown not effective on sorted Iceberg/Parquet data](https://github.com/ClickHouse/ClickHouse/issues/100743)
- Why: Likely performance bug rather than correctness bug, but important for lakehouse workloads.

#### 10. NPY parser edge cases
- **Closed:** [#99585 negative shape dimension causes infinite loop](https://github.com/ClickHouse/ClickHouse/issues/99585)
- **Open:** [#100738 `SELECT count()` disagrees with `SELECT *` for zero inner dimension](https://github.com/ClickHouse/ClickHouse/issues/100738)
- Why: Shows active hardening of format parsers against malformed and degenerate inputs.

### CI / fuzz / sanitizer pressure
Open issues such as:
- [#100761 MemorySanitizer: use-of-uninitialized-value](https://github.com/ClickHouse/ClickHouse/issues/100761)
- [#100556 USearch ASan heap-buffer-overflow](https://github.com/ClickHouse/ClickHouse/issues/100556)
- [#100510 Ubsan crash in `positiveModulo`](https://github.com/ClickHouse/ClickHouse/issues/100510)
- [#100175 invalid aggregation key type logical error](https://github.com/ClickHouse/ClickHouse/issues/100175)
- [#100695 logical error with EXECUTE AS](https://github.com/ClickHouse/ClickHouse/issues/100695)

These indicate good test coverage and bug discovery, but also a continuing stream of edge-case instability in newer code paths and external dependencies.

## 5) Feature Requests & Roadmap Signals

Several requests and PRs reveal likely near-term roadmap directions.

### Strong roadmap signals

#### SQL compatibility
- **`UNIQUE` predicate**: [PR #99877](https://github.com/ClickHouse/ClickHouse/pull/99877)
- **`VALUES` in `FROM`**: [Issue #99605](https://github.com/ClickHouse/ClickHouse/issues/99605) closed
- **`obfuscateQuery` function**: [Issue #98010](https://github.com/ClickHouse/ClickHouse/issues/98010)

Prediction: **SQL compatibility improvements are likely in the next version**, especially where parser/analyzer work is already underway.

#### Interoperability and tooling
- **Substrait plan serialization**: [PR #94540](https://github.com/ClickHouse/ClickHouse/pull/94540)
- **AST JSON serialization**: [PR #100412](https://github.com/ClickHouse/ClickHouse/pull/100412)

Prediction: Expect more machine-readable plan/AST interfaces soon, helpful for ecosystems, gateways, IDEs, and lineage tools.

#### Semi-structured and search-oriented analytics
- **`JSONAllValues` + text index support**: [PR #100730](https://github.com/ClickHouse/ClickHouse/pull/100730)
- **Projection index with `ARRAY JOIN`**: [Issue #98953](https://github.com/ClickHouse/ClickHouse/issues/98953)

Prediction: ClickHouse is likely to keep improving acceleration for JSON, arrays, maps, logs, and observability schemas.

#### Data lake / external table observability
- **Iceberg `read_rows` accounting fix**: [PR #99282](https://github.com/ClickHouse/ClickHouse/pull/99282)
- **DataLakeCatalog query_log enrichment**: [PR #100706](https://github.com/ClickHouse/ClickHouse/pull/100706)

Prediction: Datalake integration remains a high-probability near-term area, especially around observability and correctness rather than flashy new syntax.

### Longer-horizon / uncertain
- **GPU support**: [Issue #63392](https://github.com/ClickHouse/ClickHouse/issues/63392)

Prediction: Important strategically, but still feels **longer-term and exploratory** rather than imminent.

## 6) User Feedback Summary

The strongest user pain points today are practical and operational:

- **Correctness over crashes**: Users are reporting silent or incorrect results in aggregates and casts, which is more damaging than visible failures.
- **Version regressions matter**: The `session_timezone` DateTime report shows users comparing patch versions closely and expecting identical semantics for unchanged SQL.
- **Lakehouse workloads are growing**: Issues and PRs around Iceberg, Parquet pushdown, query_log visibility, and DataLakeCatalog show real adoption beyond native MergeTree-only setups.
- **Observability/log analytics remain core**: Requests like `ARRAY JOIN` in projection indexes and JSON/text-index work map directly to logs/events schemas.
- **CI and test noise affects trust**: Flaky test tracking and performance-noise reporting suggest maintainers are responding to contributor pain, not just end-user issues.

There is little explicit praise in today’s data, but the steady stream of sophisticated feature requests implies that users see ClickHouse as strategic enough to push into standards, interoperability, and advanced storage use cases.

## 7) Backlog Watch

These older or strategically important items appear to deserve renewed maintainer attention.

### Core architecture / technical debt
- **[#58797 Settings objects became too big](https://github.com/ClickHouse/ClickHouse/issues/58797)**  
  Open since 2024-01-14. This is core-engine technical debt with compounding impact on maintainability and build/runtime characteristics.

- **[#63392 GPU support](https://github.com/ClickHouse/ClickHouse/issues/63392)**  
  Open since 2024-05-06. High strategic interest, but likely blocked on architecture and scope definition.

### Analyzer / joins correctness
- **[#75005 Matchers resolved into incorrect type in case of multiple joins with `join_use_nulls`](https://github.com/ClickHouse/ClickHouse/issues/75005)**  
  Open since 2025-01-24. Low comment count, but analyzer + join typing bugs can have broad semantic impact.

### Long-lived major PRs
- **[#94540 Add Substrait plan serialization support](https://github.com/ClickHouse/ClickHouse/pull/94540)**  
  Open since 2026-01-18. Valuable ecosystem feature; may need focused maintainer review to avoid stalling.

- **[#99513 Replace SANITIZE_COVERAGE with LLVM source-based coverage](https://github.com/ClickHouse/ClickHouse/pull/99513)**  
  Open since 2026-03-14. Important infra modernization that could pay down future debugging cost.

## 8) Bottom Line

ClickHouse is showing **strong development momentum** with heavy PR throughput and clear investment in SQL compatibility, lakehouse integration, and engine/tooling introspection. The main risk area is **stability and correctness in edge cases**, particularly around aggregates, type conversions, replication/mutations, and analyzer-driven execution paths. Near-term, the most likely visible gains for users are improved SQL features, better observability for external data sources, and performance work in storage/cache paths. Project health is solid overall, with the caveat that maintainers are balancing aggressive feature development against a steady stream of fuzzing- and regression-driven bug reports.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-26

## 1) Today’s Overview

DuckDB remained highly active over the last 24 hours, with **30 issues updated** and **52 pull requests updated**, indicating a busy stabilization and refinement cycle around the **1.5.x** line. The dominant themes were **correctness regressions in optimizer behavior**, **CLI/Windows usability fixes**, and **crash reports in edge-case execution/storage paths**. No new release was published today, but several issue/PR pairs suggest maintainers are actively landing or preparing fixes quickly after reports. Overall project health looks strong from a throughput perspective, though the current signal is clearly **quality hardening rather than major feature rollout**.

## 3) Project Progress

### Merged/closed PRs today and what they advanced

- [PR #21615](https://github.com/duckdb/duckdb/pull/21615) — **Windows shell: enable VT100 processing on startup**  
  Closed after addressing a visible CLI rendering issue on Windows terminals. This improves **CLI compatibility and usability**, especially for Windows 11 environments where terminal capabilities were not being initialized correctly.

- [PR #21607](https://github.com/duckdb/duckdb/pull/21607) — **Fix FK reference resolution for external catalogs**  
  Closed after fixing binder behavior for `FOREIGN KEY` references in external catalogs. This advances **SQL/catalog correctness** and improves support for non-default catalog setups.

- [PR #21570](https://github.com/duckdb/duckdb/pull/21570) — **checkpoint_on_detach 3-valued setting**  
  Closed after adding more nuanced checkpoint control on detach. This is a **storage/lifecycle management improvement**, useful for embedded or multi-database workflows where checkpoint timing matters.

- [PR #21590](https://github.com/duckdb/duckdb/pull/21590) — **Make PEG Parser use strict mode in CI**  
  Closed after tightening parser validation in CI. This is less user-facing, but it strengthens **parser correctness and test rigor**, reducing the risk of SQL grammar drift.

- [PR #21621](https://github.com/duckdb/duckdb/pull/21621) — **[autocomplete] Use AutoCompleteCatalogProvider abstraction**  
  Closed after refactoring shell autocomplete internals. This suggests ongoing investment in **CLI architecture modularity**, likely enabling future shell/extensibility improvements.

### Related issue closures indicating delivered fixes

Several reproduced issues were closed today, suggesting active bug resolution:

- [Issue #21378](https://github.com/duckdb/duckdb/issues/21378) — CLI `.tables` / `-table` output issues
- [Issue #21578](https://github.com/duckdb/duckdb/issues/21578) — `COPY TO` with output file as parameter
- [Issue #21478](https://github.com/duckdb/duckdb/issues/21478) — off-by-one stats propagation for `date_part`
- [Issue #21431](https://github.com/duckdb/duckdb/issues/21431) — OOM with TopN Window Elimination
- [Issue #21490](https://github.com/duckdb/duckdb/issues/21490) — WAL replay failure after `ALTER TABLE ADD COLUMN DEFAULT <function>`
- [Issue #9597](https://github.com/duckdb/duckdb/issues/9597) — JDBC WSL path handling
- [Issue #21593](https://github.com/duckdb/duckdb/issues/21593) — ArrowBuffer unchecked malloc segfault path

This pattern points to concrete progress in **query optimizer safety**, **durability/WAL recovery**, **client compatibility**, and **memory safety**.

## 4) Community Hot Topics

### Most discussed issues/PRs

- [Issue #21401](https://github.com/duckdb/duckdb/issues/21401) — **Changed ETag Error but actually the ETag is the same when using `read_parquet()`**  
  10 comments.  
  This highlights a real need around **object storage interoperability**, especially with **S3-compatible systems** where metadata formatting differences can trip file-change detection. The technical need is more robust normalization of remote object metadata and fewer false-positive invalidation errors in analytic pipelines.

- [Issue #21478](https://github.com/duckdb/duckdb/issues/21478) — **Off-by-one error in PropagateStatistics for `date_part`**  
  9 comments, now closed.  
  This reflects continuing user attention on **optimizer statistics quality**. Even small stats errors matter because they can disable pruning and lead to worse plans.

- [Issue #21378](https://github.com/duckdb/duckdb/issues/21378) — **CLI `.tables` / `-table` output issues**  
  6 comments, now closed.  
  CLI polish remains an important community concern, especially because DuckDB is often used interactively for exploration, debugging, and scripting.

- [Issue #21578](https://github.com/duckdb/duckdb/issues/21578) — **File creation error when passing output file to `COPY TO` as a param**  
  4 comments, now closed.  
  This points to demand for better **prepared statement support in utility SQL**, important for application embedding and dynamic export workflows.

- [Issue #21601](https://github.com/duckdb/duckdb/issues/21601) — **CHECKPOINT crashes with Invalid bitpacking mode on fixed-size ARRAY columns**  
  3 comments.  
  This is a hot topic because it touches **storage integrity** and could invalidate databases after a crash during checkpoint.

- [PR #19270](https://github.com/duckdb/duckdb/pull/19270) — **Fix nested `COLUMNS` expressions with star-like patterns**  
  Long-lived and updated today.  
  This suggests sustained community interest in **advanced column-selection syntax** and SQL ergonomics.

- [PR #21395](https://github.com/duckdb/duckdb/pull/21395) — **Implement block-aligned read and cache for external file cache**  
  Ongoing and strategically important.  
  This is a strong signal that maintainers and contributors are still investing in **remote/external file I/O efficiency**, highly relevant to lakehouse-style analytics.

### Underlying technical needs

Across these discussions, the strongest needs are:
1. **Robustness for remote/object storage access**
2. **Safer and more selective optimizer transformations**
3. **Better Windows and CLI compatibility**
4. **Storage-path reliability under checkpoint/WAL edge cases**
5. **Improved expressiveness in SQL syntax and column-selection features**

## 5) Bugs & Stability

### Highest severity

1. [Issue #21601](https://github.com/duckdb/duckdb/issues/21601) — **CHECKPOINT crashes with Invalid bitpacking mode on fixed-size ARRAY columns**  
   Severity: **Critical**  
   A checkpoint crash that invalidates the database is among the most serious classes of bugs because it affects **durability and recoverability**. No linked fix PR is shown yet.

2. [Issue #21592](https://github.com/duckdb/duckdb/issues/21592) — **WindowSelfJoinOptimizer produces wrong results for `ROWS` frames**  
   Severity: **Critical**  
   This is a direct **incorrect-results** issue in a new optimizer introduced in v1.5.0.  
   Fix PR exists: [PR #21628](https://github.com/duckdb/duckdb/pull/21628) — disables the optimization for `ROWS` framing.

3. [Issue #21609](https://github.com/duckdb/duckdb/issues/21609) — **Incorrect preservation of rows from `LEFT JOIN LATERAL ... ON TRUE` despite `IS NOT NULL` filter**  
   Severity: **High**  
   Another likely **query correctness** bug, potentially affecting semantic trust in lateral joins. No fix PR listed in the provided data.

4. [Issue #21604](https://github.com/duckdb/duckdb/issues/21604) — **INTERNAL Error binding complex CTE chain, regression in v1.5.1**  
   Severity: **High**  
   Regression in binder/planner path for complex analytical SQL. No linked fix PR shown.

### Crash / memory safety / segfault reports

5. [Issue #21623](https://github.com/duckdb/duckdb/issues/21623) — **Segmentation fault in `GetSortKeyLengthRecursive` only in release build**  
   Severity: **High**  
   Release-only crashes are especially painful for users because they evade debug testing.  
   Fix PR exists: [PR #21629](https://github.com/duckdb/duckdb/pull/21629).

6. [Issue #21626](https://github.com/duckdb/duckdb/issues/21626) — **ADBC heap-use-after-free with prepared statements**  
   Severity: **High**  
   Impacts the Arrow/ADBC integration surface, important for programmatic clients.

7. [Issue #21584](https://github.com/duckdb/duckdb/issues/21584) — **ADBC heap-use-after-free on error**  
   Severity: **High**  
   Another memory safety issue in the same subsystem, suggesting concentrated risk in ADBC error-handling paths.

8. [Issue #21602](https://github.com/duckdb/duckdb/issues/21602) — **`LOAD motherduck` access violation on Windows in PyInstaller bundle**  
   Severity: **High**  
   Significant for packaged application embedding on Windows.

9. [Issue #21593](https://github.com/duckdb/duckdb/issues/21593) — **ArrowBuffer unchecked malloc leading to segfault path**  
   Severity: **High**, but now closed.  
   Good sign that memory-safety bugs are getting turned around quickly.

### Storage / remote I/O / platform regressions

10. [Issue #21401](https://github.com/duckdb/duckdb/issues/21401) — **False ETag change detection in `read_parquet()` on S3-compatible storage**  
    Severity: **Medium-High**  
    Important for cloud/lake users; impacts reliability of repeated reads.

11. [Issue #21603](https://github.com/duckdb/duckdb/issues/21603) — **`CanonicalizePath` breaks `opfs://` fake paths in duckdb-wasm**  
    Severity: **Medium-High**  
    Affects the **WASM/browser** deployment story.

12. [Issue #21617](https://github.com/duckdb/duckdb/issues/21617) — **Pipeline parallelism regression in `PhysicalTableInOutFunction` in v1.5.1**  
    Severity: **Medium-High**  
    A performance regression rather than correctness failure, but impactful for CPU-bound table functions.

13. [Issue #21618](https://github.com/duckdb/duckdb/issues/21618) — **Attach string reused incorrectly on second connection in a session**  
    Severity: **Medium**  
    Likely affects advanced session/catalog workflows.

14. [Issue #21583](https://github.com/duckdb/duckdb/issues/21583) — **HTTPFS OpenAI API request fails with HTTP 0 internal error**  
    Severity: **Medium**  
    Interesting signal that users are stretching DuckDB’s HTTP capabilities into API interaction workflows, not just file access.

### Windows CLI usability cluster

- [Issue #21585](https://github.com/duckdb/duckdb/issues/21585) — CLI prompt incorrect on Windows 11  
- [Issue #21571](https://github.com/duckdb/duckdb/issues/21571) — random characters in admin Command Prompt/PowerShell  
- [PR #21615](https://github.com/duckdb/duckdb/pull/21615) — VT100 startup enablement, now closed  

This looks like an active and likely improving area; one fix has already landed, but more shell-specific cleanup may still be needed.

## 6) Feature Requests & Roadmap Signals

### User-requested features and enhancements

- [Issue #16829](https://github.com/duckdb/duckdb/issues/16829) — **Support case-insensitive regex operators `~*` and `!~*`**  
  This is a straightforward **SQL compatibility** request, especially for PostgreSQL-style expectations. It has good odds of eventually landing because it is narrowly scoped and user-facing.

- [Issue #16679](https://github.com/duckdb/duckdb/issues/16679) — **Hex string to `UINT128` conversion**  
  This reflects demand for more complete **type-system consistency**, especially in numeric parsing.

- [Issue #16787](https://github.com/duckdb/duckdb/issues/16787) — **`struct.* glob / like / similar to` broken**  
  Not purely a feature request, but a roadmap signal around richer **star expansion / pattern-based projection semantics**.

- [Issue #21622](https://github.com/duckdb/duckdb/issues/21622) — **Release cycle of extensions for development builds**  
  This is less about SQL and more about **ecosystem packaging/release process**. It signals that extension availability is becoming strategically important as DuckDB’s extension story broadens.

### PRs that signal near-term roadmap direction

- [PR #21395](https://github.com/duckdb/duckdb/pull/21395) — **block-aligned read and cache for external file cache**  
  Strong signal for future **remote file performance optimization**.

- [PR #21375](https://github.com/duckdb/duckdb/pull/21375) — **row group skipping for MAP columns in Parquet reader**  
  Strong signal for continued **Parquet scan optimization** and deeper nested-type support.

- [PR #21438](https://github.com/duckdb/duckdb/pull/21438) — **catalog storage and introspection for `CREATE TRIGGER`**  
  This suggests gradual movement toward broader **DDL/catalog feature coverage**.

- [PR #21197](https://github.com/duckdb/duckdb/pull/21197) — **extensible dot commands in the CLI**  
  Indicates a likely roadmap toward a more modular, extension-aware shell experience.

### Likely next-version candidates

Most likely to appear soon, based on current momentum:
1. Fixes for **window optimizer correctness** ([#21592](https://github.com/duckdb/duckdb/issues/21592), [#21628](https://github.com/duckdb/duckdb/pull/21628))
2. Fixes for **release-build TopN crash** ([#21623](https://github.com/duckdb/duckdb/issues/21623), [#21629](https://github.com/duckdb/duckdb/pull/21629))
3. Additional **Windows CLI polish**
4. Potential **ADBC memory-safety fixes**
5. Possibly some **Parquet/external cache performance work**, though those may take longer than a point release

## 7) User Feedback Summary

User feedback today points to several concrete pain points:

- **Trust in optimizer rewrites is under scrutiny.** Multiple reports involve wrong results, OOMs, or regressions caused by new optimizer paths, especially around windows and join/lateral behavior. Users value speed, but not at the expense of semantic correctness.

- **Embedded and programmatic usage remains central.** Reports around prepared statements, ADBC, JDBC, PyInstaller, extension loading, and parameterized `COPY TO` show DuckDB is heavily used as an embedded analytics engine inside applications, not just as a standalone database.

- **Cloud/object storage workflows are mainstream.** The ETag bug and external caching work indicate users expect reliable operation on S3-compatible storage and remote files.

- **Windows users are vocal and currently experiencing friction.** CLI prompt/rendering issues suggest the Windows shell experience still needs smoothing, especially outside Windows Terminal defaults.

- **Complex SQL workloads continue to stress binder/planner edge cases.** CTE chains, nested structures, lateral joins, recursive unnesting, and struct-star syntax all show that real users are pushing advanced SQL features hard.

## 8) Backlog Watch

These older or long-running items appear important and still need maintainer attention:

- [PR #19270](https://github.com/duckdb/duckdb/pull/19270) — **Fix nested `COLUMNS` expressions with star-like patterns**  
  Open since 2025-10-05, still active, with changes requested and merge conflicts. Important for advanced SQL projection syntax.

- [PR #21005](https://github.com/duckdb/duckdb/pull/21005) — **Do not cleanup indexes if table is dropped**  
  Open since 2026-02-18 and marked stale. This touches **transactional/index correctness**, so it deserves attention despite low visible engagement.

- [PR #21395](https://github.com/duckdb/duckdb/pull/21395) — **block-aligned read/cache for external file cache**  
  Strategically important for performance, but currently blocked by merge conflicts.

- [PR #21375](https://github.com/duckdb/duckdb/pull/21375) — **row group skipping support for MAP columns in Parquet reader**  
  Also merge-conflicted; relevant for analytical scan efficiency and nested data support.

- [Issue #16679](https://github.com/duckdb/duckdb/issues/16679) — **No hex to `UINT128` conversion**  
  Old, reproduced, and still open. Small but important consistency gap.

- [Issue #16787](https://github.com/duckdb/duckdb/issues/16787) — **`struct.* glob / like / similar to` broken**  
  Old and stale, but relevant to SQL expressiveness and star expansion correctness.

- [Issue #16829](https://github.com/duckdb/duckdb/issues/16829) — **case-insensitive regex operators**  
  Low urgency, but a clear compatibility/documentation gap that keeps resurfacing in user expectations.

## Overall Health Assessment

DuckDB’s development velocity remains very strong, and maintainers appear responsive, especially on reproduced regressions and crash bugs. The current snapshot shows a project in **post-release stabilization mode**, with particular attention on optimizer correctness, storage safety, and Windows/embedded client compatibility. The main health risk is the number of fresh **correctness and crash** reports clustered around new 1.5.x behavior, but the presence of rapid closures and linked fix PRs suggests the team is addressing them aggressively.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-26

## 1) Today’s Overview

StarRocks remained highly active over the last 24 hours, with **120 PRs updated** and **9 issues touched**, indicating strong maintainer throughput and active branch management across multiple release lines. The day’s work was dominated by **bug fixes, backports, and release engineering**, especially around SQL execution correctness, external table/file ingestion, and operational stability. A new patch release, **4.0.8**, signals continued investment in stabilization of the 4.0 branch. Overall project health looks solid, though several open issues point to ongoing pressure in **external catalog scalability, connector robustness, and dependency security maintenance**.

---

## 2) Releases

## StarRocks 4.0.8
- Release: **[4.0.8](https://github.com/StarRocks/StarRocks)**
- Release date: **2026-03-25**

### Notable changes
The visible release note excerpt highlights a **behavior change in `sql_mode` handling**:
- When `DIVISION_BY_ZERO` or `FAIL_PARSE_DATE` is enabled, division-by-zero and `str_to_date` / `str2date` parse failures now **raise errors** instead of being silently ignored.
- Reference: release notes mention **[#70004](https://github.com/StarRocks/StarRocks)**.

### Behavior / breaking-change implications
This is not a schema-breaking change, but it is a **behavioral compatibility change**:
- Existing ETL, BI, or ad hoc SQL workloads that previously relied on permissive parsing may now fail under stricter `sql_mode` settings.
- Pipelines with loosely validated date strings or defensive division logic should be reviewed.

### Migration notes
Users upgrading to 4.0.8 should:
- Audit sessions or global configs using `DIVISION_BY_ZERO` and `FAIL_PARSE_DATE`.
- Re-test ingestion SQL and dashboards that invoke `str_to_date` / `str2date`.
- Add explicit guards such as `NULLIF`, `CASE`, or pre-validation of date strings where needed.

---

## 3) Project Progress

Today’s merged/closed PRs show progress mainly in **correctness, compatibility, and release branch hardening** rather than net-new engine features.

### SQL/file ingestion correctness
- **Fix schema push-down with partial columns for `INSERT INTO BY NAME` from `FILES()`**  
  - Main PR: [#70774](https://github.com/StarRocks/StarRocks/pull/70774)  
  - Backports closed: [#70799](https://github.com/StarRocks/StarRocks/pull/70799), [#70800](https://github.com/StarRocks/StarRocks/pull/70800), [#70801](https://github.com/StarRocks/StarRocks/pull/70801)  
  This is a meaningful SQL/file interface fix. It addresses analyzer logic that returned early when selected columns did not match total target columns, potentially skipping type analysis and schema pushdown. This improves reliability for semi-structured or external-file ingestion workflows.

### Optimizer / CTE correctness
- **Preserve CTE consumer references in `OptExpressionDuplicator` if CTE producer is not duplicated**  
  - [#70791](https://github.com/StarRocks/StarRocks/pull/70791)  
  This closed backport indicates ongoing cleanup in optimizer plan duplication logic, reducing risk of malformed plans in more complex CTE-heavy queries.

### FE metadata / multi-node correctness
- **Wait for journal replay in `changeCatalogDb` on follower FE**  
  - [#69917](https://github.com/StarRocks/StarRocks/pull/69917)  
  This addresses a real operational consistency problem in multi-FE deployments where `USE database` could fail immediately after `CREATE DATABASE` on another FE. It improves correctness in distributed FE topologies, especially Kubernetes-style deployments.

### RPC/network resiliency
- **Fix brpc connection retry to handle wrapped `NoSuchElementException`**  
  - Open/backport stream: [#70531](https://github.com/StarRocks/StarRocks/pull/70531), [#70530](https://github.com/StarRocks/StarRocks/pull/70530)  
  - Closed conflicted variant: [#70529](https://github.com/StarRocks/StarRocks/pull/70529)  
  While not fully merged across all shown branches here, the active backporting suggests maintainers are prioritizing better handling of transient network/channel-pool failures.

Taken together, today’s progress points to a team focused on **tightening correctness in planner, ingestion, metadata propagation, and branch stability across 3.5/4.0/4.1**.

---

## 4) Community Hot Topics

### 1. StarRocks Roadmap 2026
- Issue: [#67632](https://github.com/StarRocks/StarRocks/issues/67632)
- Signals: **28 comments, 28 👍**
- Why it matters: This is the clearest community aggregation point for strategic direction. High engagement suggests users are closely watching upcoming investments in performance, lakehouse integration, and SQL capability.
- Technical need underneath: users want roadmap clarity around **engine evolution, connector maturity, and branch priorities**.

### 2. FE OOM on Iceberg tables with millions of partitions
- Issue: [#67760](https://github.com/StarRocks/StarRocks/issues/67760)
- Signals: **7 comments**
- Theme: FE memory exhaustion due to eager partition-cache loading for huge Iceberg catalogs.
- Technical need underneath: StarRocks users are pushing into **large-scale lakehouse metadata scenarios**, and FE memory scalability is now a practical bottleneck. This is a strong signal that **lazy metadata loading, bounded caching, and partition pruning before materialization** are increasingly important.

### 3. Case-sensitive configuration request
- Issue: [#40292](https://github.com/StarRocks/StarRocks/issues/40292)
- Signals: **8 comments, 2 👍**, now closed
- Theme: object naming/case-sensitivity behavior.
- Technical need underneath: better compatibility with heterogeneous SQL ecosystems and migration from systems with different identifier semantics. Even though closed, it reflects recurring friction in **cross-engine SQL compatibility**.

### 4. CTE materialization hints
- PR: [#70802](https://github.com/StarRocks/StarRocks/pull/70802)
- Theme: support `MATERIALIZED` / `NOT MATERIALIZED` hints for CTEs.
- Technical need underneath: users need **explicit control over optimizer behavior** for complex analytical SQL, especially to avoid excessive inlining or repeated evaluation.

### 5. Parquet `FIXED_LEN_BYTE_ARRAY` support
- PR: [#70479](https://github.com/StarRocks/StarRocks/pull/70479)
- Theme: support for UUID-like values stored in Parquet/Iceberg as `FIXED_LEN_BYTE_ARRAY`.
- Technical need underneath: stronger **data lake interoperability**, especially for Iceberg and Parquet schemas generated by other engines.

---

## 5) Bugs & Stability

Below are the most important bugs touched today, ranked by likely severity.

### Critical — Silent wrong query results in Iceberg metadata cache
- Issue: [#70522](https://github.com/StarRocks/StarRocks/issues/70522) — **Closed**
- Problem: `dataFileCache` in Iceberg could serve **permanently stale partial data**, leading to **silent incorrect query results**.
- Severity rationale: Wrong answers are generally more severe than crashes because they can go undetected in production analytics.
- Fix status: issue is closed, implying remediation has landed or been accepted; no linked PR is shown in the provided subset.

### High — FE OOM with large Iceberg partition counts
- Issue: [#67760](https://github.com/StarRocks/StarRocks/issues/67760) — **Open**
- Problem: eager loading of partition metadata can crash FE in large Iceberg environments.
- Severity rationale: affects cluster availability and makes large catalogs operationally unsafe.
- Fix status: no fix PR shown in the provided data.

### High — Paimon catalog refresh ClassCastException
- Issue: [#70719](https://github.com/StarRocks/StarRocks/issues/70719) — **Open**
- Problem: `FormatTableImpl` cannot be cast to `FileStoreTable` during metadata refresh.
- Severity rationale: breaks external catalog refresh and undermines connector reliability.
- Fix status: no fix PR shown in provided data.

### High — Security dependency vulnerabilities
- Jackson Core CVE/GHSA: [#70775](https://github.com/StarRocks/StarRocks/issues/70775) — **Open**
- ZooKeeper CVE: [#70777](https://github.com/StarRocks/StarRocks/issues/70777) — **Open**
- Severity rationale: dependency CVEs may not always be directly exploitable in StarRocks deployment paths, but they require rapid triage.
- Fix status: no dependency bump PR shown in provided data.

### Medium-High — Segmentation fault on Parquet query from Azure Data Lake
- Issue: [#70478](https://github.com/StarRocks/StarRocks/issues/70478) — **Closed**
- Problem: querying Parquet from ADLS triggered a segmentation fault.
- Severity rationale: connector crash in a common cloud storage access path.
- Fix status: issue closed; no matching PR visible in this slice.

### Medium-High — SIGSEGV in `UnionConstSourceOperator` with large VARCHAR replication
- Issue: [#68656](https://github.com/StarRocks/StarRocks/issues/68656) — **Closed**
- Problem: crash path involving very large VARCHAR columns.
- Severity rationale: edge-case but severe when triggered, especially for replication and wide-string workloads.
- Fix status: issue closed.

### Medium — `INSERT INTO BY NAME` partial-column analysis bug
- Fix PR: [#70774](https://github.com/StarRocks/StarRocks/pull/70774) plus backports [#70799](https://github.com/StarRocks/StarRocks/pull/70799), [#70800](https://github.com/StarRocks/StarRocks/pull/70800), [#70801](https://github.com/StarRocks/StarRocks/pull/70801)
- Impact: schema pushdown/type analysis correctness for file-based inserts.
- Severity rationale: not a crash, but can cause failed or incorrect ingestion behavior.

---

## 6) Feature Requests & Roadmap Signals

### Strong signals from active work

#### CTE execution control
- PR: [#70802](https://github.com/StarRocks/StarRocks/pull/70802)
- Likelihood: **high** for near-term release inclusion
- Why: It is already implemented as an open PR and addresses a common optimizer control need for advanced SQL users.

#### Parquet/Iceberg UUID interoperability
- PR: [#70479](https://github.com/StarRocks/StarRocks/pull/70479)
- Likelihood: **high-medium**
- Why: This is a practical lakehouse compatibility enhancement, especially for Iceberg tables carrying UUID values encoded as `FIXED_LEN_BYTE_ARRAY`.

#### Cross-database SQL digest aggregation
- PR: [#70770](https://github.com/StarRocks/StarRocks/pull/70770)
- Likelihood: **medium-high**
- Why: This helps observability and workload analysis by allowing SQL digest computation independent of database name. This aligns with enterprise monitoring needs.

#### Fast schema evolution for widened VARCHAR in shared-data mode
- PR: [#70747](https://github.com/StarRocks/StarRocks/pull/70747)
- Likelihood: **medium-high**
- Why: Metadata-only schema evolution for common ALTER cases is exactly the kind of operational improvement likely to be prioritized in modern cloud/shared-data deployments.

### Broader roadmap indicators
- Roadmap issue: [#67632](https://github.com/StarRocks/StarRocks/issues/67632)

Based on today’s issues/PRs, the next versions are likely to continue emphasizing:
1. **Lakehouse connector maturity**: Iceberg, Paimon, Parquet, Azure ADLS.
2. **Optimizer controllability and correctness**: CTE hints, null-fraction estimation, join-skew handling.
3. **Operational scalability**: FE memory behavior, schema evolution, metadata consistency across FEs.
4. **Observability and workload management**: SQL digest improvements, rejected-record logging propagation.

---

## 7) User Feedback Summary

Today’s user feedback centers on a few consistent pain points:

### 1. External catalog scale is now a frontline requirement
- Evidence: [#67760](https://github.com/StarRocks/StarRocks/issues/67760), [#70522](https://github.com/StarRocks/StarRocks/issues/70522), [#70719](https://github.com/StarRocks/StarRocks/issues/70719)
- Users are operating StarRocks against **very large Iceberg/Paimon estates**, and are sensitive to both metadata correctness and FE resource usage.
- Interpretation: StarRocks is being used in more demanding lakehouse topologies, but connector-layer scalability still needs hardening.

### 2. Interoperability matters as much as raw performance
- Evidence: [#70479](https://github.com/StarRocks/StarRocks/pull/70479), [#70478](https://github.com/StarRocks/StarRocks/issues/70478)
- Users expect seamless reads from Parquet/Iceberg/ADLS without format edge cases or crashes.
- Interpretation: Compatibility with ecosystem conventions is a major adoption factor.

### 3. Users want finer SQL/optimizer control
- Evidence: [#70802](https://github.com/StarRocks/StarRocks/pull/70802), [#70221](https://github.com/StarRocks/StarRocks/pull/70221)
- Advanced analytical users want deterministic behavior for CTE execution and better statistics modeling for complex expressions.
- Interpretation: the workload mix includes sophisticated BI and transformation SQL, not just basic dashboards.

### 4. Operators care about multi-version stability
- Evidence: multiple backports such as [#70799](https://github.com/StarRocks/StarRocks/pull/70799), [#70800](https://github.com/StarRocks/StarRocks/pull/70800), [#70801](https://github.com/StarRocks/StarRocks/pull/70801)
- Interpretation: users are actively running 3.5, 4.0, and 4.1 lines, and maintainers are meeting that need with broad patch propagation.

Overall sentiment from the data is that users value StarRocks for **serious production analytics**, but they need continued improvements in **connector correctness, metadata scaling, and edge-case SQL compatibility**.

---

## 8) Backlog Watch

These items appear important and still merit maintainer attention:

### FE OOM with millions of Iceberg partitions
- Issue: [#67760](https://github.com/StarRocks/StarRocks/issues/67760)
- Why it needs attention: This is a scalability blocker for large lakehouse deployments and can cause repeated FE crashes.

### Paimon refresh ClassCastException
- Issue: [#70719](https://github.com/StarRocks/StarRocks/issues/70719)
- Why it needs attention: connector regressions directly affect adoption in mixed-table-format environments.

### Security dependency upgrades
- Jackson Core: [#70775](https://github.com/StarRocks/StarRocks/issues/70775)
- ZooKeeper: [#70777](https://github.com/StarRocks/StarRocks/issues/70777)
- Why they need attention: even if exposure is limited, unresolved CVE reports create enterprise adoption friction and should be triaged quickly.

### Roadmap expectation management
- Issue: [#67632](https://github.com/StarRocks/StarRocks/issues/67632)
- Why it needs attention: highly engaged roadmap threads are valuable, but they also raise expectations. Clear maintainer responses help guide community priorities.

### Older compatibility request with recurring ecosystem relevance
- Issue: [#40292](https://github.com/StarRocks/StarRocks/issues/40292)
- Why it still matters: although closed, case-sensitivity semantics remain a migration and compatibility concern worth tracking in documentation or future design discussions.

---

## Bottom Line

StarRocks had a **strongly productive maintenance day**: a new **4.0.8 release**, heavy **cross-branch backporting**, and visible progress on **SQL/file-ingestion correctness**. The most important risk area remains **lakehouse metadata and connector stability**, particularly around **Iceberg scale, Paimon refresh correctness, and external storage interoperability**. Project momentum is healthy, and the active PR stream suggests the next near-term releases will continue to improve **correctness, compatibility, and operational resilience** rather than introduce only headline features.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-26

## 1. Today's Overview

Apache Iceberg showed **high development activity** over the last 24 hours, with **21 issues updated** and **50 pull requests updated**, indicating sustained maintainer and contributor engagement. There were **no new releases**, so today’s signal is mainly from ongoing design work, bug triage, and incremental implementation across core, Spark, Flink, REST/OpenAPI, and Kafka Connect. A notable theme is the continued push toward **next-generation metadata and manifest evolution (V4)**, alongside **connector correctness fixes** and **REST catalog/spec maturity**. Overall project health looks strong in terms of throughput, though several open bugs still point to important reliability concerns in Flink recovery, Spark snapshot isolation behavior, and lifecycle/resource management.

---

## 3. Project Progress

### Merged/closed PRs and issue closures today
There were **6 PRs merged/closed** in the last 24h, but from the provided list, the visible closed PRs are mostly stale/cleanup outcomes rather than major feature landings.

#### Closed PRs / issues advancing the project
- **Delete deduplication optimization for equality deletes in CDC scenarios** — PR [#15337](https://github.com/apache/iceberg/pull/15337) was closed.  
  This suggests interest remains high around reducing write amplification for CDC-heavy Flink/equality-delete workloads, but the optimization is not yet landed.
- **Jetty compression API migration** — PR [#15043](https://github.com/apache/iceberg/pull/15043) was closed.  
  This points to ongoing build/runtime dependency maintenance, but no direct user-facing advancement today.
- **Parquet reader/writer typo cleanup** — PR [#15244](https://github.com/apache/iceberg/pull/15244) was closed.  
  Documentation/error-message polish, not a functional change.

#### Closed issues with limited product impact
- **Flink selector cache bug** — Issue [#15731](https://github.com/apache/iceberg/issues/15731) was closed.  
  The issue described `DynamicIcebergSink` cache keys ignoring `writeParallelism` and `distributionMode`, which could lead to stale behavior after runtime changes. Closure suggests either a fix landed elsewhere or triage concluded.
- Minor/test/maintenance issues such as [#15755](https://github.com/apache/iceberg/issues/15755), [#15695](https://github.com/apache/iceberg/issues/15695), and stale closures like [#13973](https://github.com/apache/iceberg/issues/13973), [#13928](https://github.com/apache/iceberg/issues/13928), [#13863](https://github.com/apache/iceberg/issues/13863), [#15342](https://github.com/apache/iceberg/issues/15342).

### Active implementation progress worth highlighting
Even without a release, several open PRs show strong forward movement:

- **V4 metadata/manifest foundation** — PR [#15049](https://github.com/apache/iceberg/pull/15049)  
  Introduces foundational types for **V4 manifest support**, a major architectural direction for adaptive metadata trees and future commit scalability.
- **V4 manifest writing in Parquet/Avro** — PR [#15634](https://github.com/apache/iceberg/pull/15634)  
  Advances **manifest format flexibility**, especially relevant for performance and SDK defaults in metadata version 4.
- **DV validation pruning optimization** — PR [#15653](https://github.com/apache/iceberg/pull/15653)  
  Adds **manifest partition pruning** to delete vector validation in `MergingSnapshotProducer`, targeting faster commits and reduced unnecessary manifest reads.
- **Spark 4.1 async microbatch fixes** — PR [#15670](https://github.com/apache/iceberg/pull/15670)  
  Important for **streaming correctness** in Spark 4.1, especially around stop conditions and planning behavior.
- **REST function endpoints in OpenAPI spec** — PR [#15180](https://github.com/apache/iceberg/pull/15180)  
  Expands the REST catalog spec toward **function discovery/loading**, signaling richer interoperability.
- **Overwrite-aware table registration** — PR [#15525](https://github.com/apache/iceberg/pull/15525)  
  Brings REST catalog behavior into better alignment with core API capabilities.
- **Streaming overwrite handling in Spark** — PR [#15152](https://github.com/apache/iceberg/pull/15152)  
  Addresses a long-standing Structured Streaming gap around **OVERWRITE snapshots**.
- **REST catalog encryption support** — PR [#13225](https://github.com/apache/iceberg/pull/13225)  
  Still open, but strategically important for enterprise adoption.

**Assessment:** today’s progress is strongest in **core metadata evolution, REST interoperability, and streaming correctness**, even if few high-impact changes formally closed.

---

## 4. Community Hot Topics

### 1) Variant data type support
- Issue: [#10392](https://github.com/apache/iceberg/issues/10392) — **[proposal] Variant Data Type Support**
- Signals: **30 comments, 70 👍**

This remains the most visible roadmap topic in the provided data. The technical need is clear: users want a native **semi-structured column type** for JSON-like, schema-flexible payloads while preserving analytical efficiency and engine interoperability. The related Kafka Connect PR [#15283](https://github.com/apache/iceberg/pull/15283) shows the ecosystem is already trying to operationalize VARIANT ingestion, suggesting demand is moving from abstract proposal into connector-level implementation pressure.

### 2) ClassLoader leak from static thread pools
- Issue: [#15031](https://github.com/apache/iceberg/issues/15031) — **Core: Static thread pools in ThreadPools.java cause ClassLoader leaks in hot-reload scenarios**
- Signals: **21 comments**

This is a classic operational JVM concern. The underlying need is better **container/reload-safe resource lifecycle management**, especially for embedded Iceberg deployments, application servers, notebook environments, and long-lived service platforms. It is not a flashy feature, but it strongly affects production hygiene.

### 3) Flink sink duplication during recovery with REST catalog
- Issue: [#14425](https://github.com/apache/iceberg/issues/14425) — **Iceberg Flink sinks duplicate data during recovery when used with the REST catalog**
- Signals: **16 comments**
- Fix reference: PR [#14517](https://github.com/apache/iceberg/pull/14517) mentioned in the issue

This is one of the most important operational topics because it touches **exactly-once expectations** in streaming ingestion. The combination of Flink recovery and REST catalog semantics is a key production pathway, so duplication risk is high-severity for users building CDC or event pipelines.

### 4) GitHub workflow supply-chain hardening
- Issue: [#15742](https://github.com/apache/iceberg/issues/15742) — **Harden GitHub Workflow Against Supply Chain Attacks**
- Signals: **9 comments**

The need here is project governance and release/build trust. While not product-facing, it reflects a growing open-source priority: secure CI/CD, dependency controls, and workflow hardening.

### 5) Materialized views support
- PR: [#9830](https://github.com/apache/iceberg/pull/9830) — **Views, Spark: Add support for Materialized Views; Integrate with Spark SQL**

Though comment counts are not provided, this remains strategically important. It reflects demand for **higher-level SQL object semantics** on top of Iceberg’s table abstraction, especially for warehouse-like user experiences.

---

## 5. Bugs & Stability

Ranked by likely severity and user impact:

### Critical / high severity

#### 1) Flink duplicate data during recovery with REST catalog
- Issue: [#14425](https://github.com/apache/iceberg/issues/14425)
- Engine: **Flink**
- Impact: **data duplication after failure recovery**
- Fix PR referenced: [#14517](https://github.com/apache/iceberg/pull/14517)

This is the top reported stability concern in the list because it affects **data correctness** in streaming ingestion. Any sink that duplicates on recovery undermines trust in checkpoint/restart semantics.

#### 2) Spark returns wrong snapshot data across successive snapshot-ID queries
- Issue: [#15741](https://github.com/apache/iceberg/issues/15741)
- Engine: **Spark**
- Impact: **query correctness / snapshot isolation failure**

If reproduced broadly, this is a serious correctness issue: two queries against different snapshot IDs returning the same snapshot’s data suggests caching or planning reuse problems. This directly affects time travel semantics.

#### 3) Static thread pools causing ClassLoader leaks
- Issue: [#15031](https://github.com/apache/iceberg/issues/15031)
- Area: **core**
- Impact: **resource leaks, hot-reload instability**

Not a data correctness bug, but severe in managed runtimes and service platforms. This can produce memory retention and operational degradation over time.

### Medium severity

#### 4) Flink Maintenance JDBC lock retry path broken by inner catch blocks
- Issue: [#15759](https://github.com/apache/iceberg/issues/15759)
- Engine: **Flink**
- Impact: **retry mechanism bypassed during DB failures**

This impacts resilience of maintenance/locking workflows. It could lead to avoidable failures under transient database/network issues.

#### 5) Azure missing input file should throw NotFoundException
- Issue: [#15760](https://github.com/apache/iceberg/issues/15760)
- Engine: **Trino usage context**
- Impact: **incorrect exception semantics / poor diagnosability**

Likely not severe for correctness, but important for clean failure handling and engine integration behavior.

#### 6) Kafka Connect timestamp logical type mapped to timestamptz, incompatible with Athena
- Issue: [#15761](https://github.com/apache/iceberg/issues/15761)
- Area: **Connect / Athena compatibility**
- Impact: **SQL engine interoperability failure**

This is a practical compatibility bug for AWS users; Athena rejecting `timestamp with time zone` in CTAS workflows creates friction in downstream analytics.

### Lower severity but notable
- Issue: [#15731](https://github.com/apache/iceberg/issues/15731) was closed regarding Flink sink selector cache key behavior.
- Historical stale closures like [#13863](https://github.com/apache/iceberg/issues/13863) show unresolved user pain may age out without clear product movement, especially around cloud IO lifecycle behavior.

---

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### Variant / semi-structured data support
- Issue: [#10392](https://github.com/apache/iceberg/issues/10392)
- PR: [#15283](https://github.com/apache/iceberg/pull/15283)

This is the clearest candidate for a future release theme. The combination of high community interest and connector work suggests **VARIANT support** is becoming a cross-cutting priority.

#### V4 metadata and manifest evolution
- PRs: [#15049](https://github.com/apache/iceberg/pull/15049), [#15634](https://github.com/apache/iceberg/pull/15634)

These are foundational roadmap items rather than isolated features. Expect future versions to emphasize **commit scalability, adaptive metadata layout, and manifest format modernization**.

#### REST catalog capability expansion
- PRs: [#15180](https://github.com/apache/iceberg/pull/15180), [#15691](https://github.com/apache/iceberg/pull/15691), [#15746](https://github.com/apache/iceberg/pull/15746), [#15525](https://github.com/apache/iceberg/pull/15525)
- Issue: [#14187](https://github.com/apache/iceberg/issues/14187)

The REST catalog continues to mature from basic table operations toward richer governance and object-model semantics: **functions, identifier constraints, clearer error contracts, overwrite-aware registration, and fine-grained access control**.

#### Flink Sink V2 extensibility
- Issues: [#15770](https://github.com/apache/iceberg/issues/15770), [#15768](https://github.com/apache/iceberg/issues/15768), [#15763](https://github.com/apache/iceberg/issues/15763)

These requests indicate user demand for **plugin hooks in sink pipelines**:
- deferred commits via `CommitGate`
- post-commit actions
- custom output file factory behavior

This points toward Iceberg being used in more customized operational workflows where commit timing, side effects, and file routing need external control.

#### Schema evolution flexibility
- Issue: [#15313](https://github.com/apache/iceberg/issues/15313)
- Follow-up issue/PR: [#15766](https://github.com/apache/iceberg/issues/15766), [#15767](https://github.com/apache/iceberg/pull/15767)

Users want more nuanced handling of **map field evolution**, especially dropping fields safely and predictably.

### Likely near-term candidates for next version
Most likely to land soon based on current momentum:
1. **REST/OpenAPI spec refinements**  
2. **Spark streaming correctness fixes**
3. **Core commit/manifest performance optimizations**
4. **Small schema-evolution/test hardening fixes**
5. Possibly early **VARIANT ecosystem support** in connectors before full core type standardization

---

## 7. User Feedback Summary

### Main pain points emerging from user reports

#### 1) Streaming correctness remains a top concern
Users continue to surface issues in:
- Flink recovery duplication — [#14425](https://github.com/apache/iceberg/issues/14425)
- Spark microbatch planning behavior — [#15670](https://github.com/apache/iceberg/pull/15670)
- Spark snapshot query correctness — [#15741](https://github.com/apache/iceberg/issues/15741)

This suggests users value Iceberg for streaming and incremental processing, but they are sensitive to any correctness regressions.

#### 2) Cross-engine and cloud compatibility is still uneven
Examples:
- Athena timestamp compatibility — [#15761](https://github.com/apache/iceberg/issues/15761)
- Azure exception handling behavior — [#15760](https://github.com/apache/iceberg/issues/15760)
- Historical S3 client lifecycle concerns — [#13863](https://github.com/apache/iceberg/issues/13863)

Users increasingly expect one table format to work cleanly across **Spark, Flink, Trino, Athena, and cloud object stores**, and friction in any integration layer gets reported quickly.

#### 3) Semi-structured data support is a major unmet need
- Proposal: [#10392](https://github.com/apache/iceberg/issues/10392)
- Kafka Connect implementation pressure: [#15283](https://github.com/apache/iceberg/pull/15283)

This reflects real-world ingestion patterns where structured warehouse tables must coexist with dynamic payloads.

#### 4) Operational control and extensibility matter more
The Flink Sink V2 plugin requests:
- [#15770](https://github.com/apache/iceberg/issues/15770)
- [#15768](https://github.com/apache/iceberg/issues/15768)
- [#15763](https://github.com/apache/iceberg/issues/15763)

These show advanced users want Iceberg not just as a storage format, but as a **programmable data platform component** embedded in larger orchestration flows.

---

## 8. Backlog Watch

These are important older items that still appear to need maintainer focus:

### Long-running, strategically important PRs
- **Materialized Views support** — PR [#9830](https://github.com/apache/iceberg/pull/9830)  
  High strategic value for SQL warehouse adoption; long-lived and likely complex.
- **Encryption for REST catalog** — PR [#13225](https://github.com/apache/iceberg/pull/13225)  
  Important for enterprise/security-sensitive deployments.
- **V4 manifest foundation** — PR [#15049](https://github.com/apache/iceberg/pull/15049)  
  Core roadmap-defining work; deserves sustained review bandwidth.
- **Streaming overwrite mode for Spark** — PR [#15152](https://github.com/apache/iceberg/pull/15152)  
  Addresses a long-standing streaming usability gap.

### Long-running issues needing resolution clarity
- **Variant data type support** — Issue [#10392](https://github.com/apache/iceberg/issues/10392)  
  Strong user demand; likely needs clearer design convergence.
- **Fine-grained access control for REST** — Issue [#14187](https://github.com/apache/iceberg/issues/14187)  
  Important for governance and enterprise catalog interoperability.
- **ClassLoader leak from static thread pools** — Issue [#15031](https://github.com/apache/iceberg/issues/15031)  
  Operationally important and active enough to merit prompt core attention.
- **Allow dropping map fields in schema evolution** — Issue [#15313](https://github.com/apache/iceberg/issues/15313)  
  Small on the surface, but reveals broader schema-evolution UX constraints.

---

## Overall Health Assessment

Iceberg remains **highly active and technically ambitious**, with clear momentum in **metadata evolution, REST catalog standardization, and connector/runtime correctness**. The strongest positive signal is that development spans both long-horizon architecture work and practical integration fixes. The main risk area is that several **correctness-critical bugs in Spark/Flink** remain open or only partially linked to fixes, which could affect confidence in production streaming and time-travel behavior. In short: **project velocity is strong, roadmap direction is clear, but stability work in execution engines remains a priority.**

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-26

## 1. Today's Overview

Delta Lake showed **high PR activity but low issue volume** over the last 24 hours: **40 PRs updated**, **2 issues updated**, and **no new releases**. The dominant engineering theme is clearly the **kernel-spark CDC streaming stack**, where a large multi-PR sequence is advancing incremental change processing, schema handling, offset management, and deletion-vector support. Outside CDC, the repo also saw movement in **DSv2 write-path infrastructure**, **Flink + Unity Catalog integration**, **filter pushdown**, **streaming option propagation**, and **protocol/docs work**. Overall project health looks **active and implementation-heavy**, with maintainers and contributors concentrating on medium-to-large architectural work rather than release packaging.

## 2. Project Progress

### Merged/closed PRs today

#### 1) Streaming DataSource options propagation into DeltaLog snapshot for UC external tables
- PR: [#6393](https://github.com/delta-io/delta/pull/6393) — **Closed**
- Title: *Pass streaming DataSource options into DeltaLog snapshot for UC external tables*

This change focused on **streaming read correctness/configuration propagation**, especially for **Unity Catalog external tables** and custom filesystem options. The described tests validate that `fs.*` and related DataSource options are correctly passed into the DeltaLog snapshot layer. This is important for cloud/object-store deployments where authentication or filesystem behavior depends on per-read options.  
**Impact:** improves **operational correctness** for streaming readers in managed/external table environments, reducing configuration mismatch risk.

#### 2) CI workflow simplification around Python environments
- PR: [#6390](https://github.com/delta-io/delta/pull/6390) — **Closed**
- Title: *[CI] Disable python venv centric github action workflows and remove pipenv in spark_test workflow*

This is not an end-user feature, but it advances **build/test reliability and contributor ergonomics** by simplifying Python-related CI setup.  
**Impact:** lowers maintenance burden and can improve CI stability/speed.

#### 3) No merged release-facing feature PRs visible today
Among today’s closed items, none appear to be a major merged engine feature or protocol change. The larger product-facing work remains mostly **open and in active review**, especially the CDC streaming stack.

## 3. Community Hot Topics

### 1) Kernel-Spark CDC streaming implementation stack
Most of today’s activity clusters around a large staged effort to bring robust **CDC streaming** support into **kernel-spark / DSv2-style execution**:

- [#6075](https://github.com/delta-io/delta/pull/6075) — *[kernel-spark][Part 1] CDC streaming offset management (initial snapshot)*
- [#6076](https://github.com/delta-io/delta/pull/6076) — *[kernel-spark][Part 2] CDC commit processing*
- [#6391](https://github.com/delta-io/delta/pull/6391) — *[Part 2.5] CDC admission limits for commit processing*
- [#6336](https://github.com/delta-io/delta/pull/6336) — *[Part 3] finish wiring up incremental change processing*
- [#6359](https://github.com/delta-io/delta/pull/6359) — *[Part 4] CDC data reading*
- [#6362](https://github.com/delta-io/delta/pull/6362) — *[Part 5] CDC schema coordination*
- [#6363](https://github.com/delta-io/delta/pull/6363) — *[Part 6] End-to-end CDC streaming integration tests*
- [#6388](https://github.com/delta-io/delta/pull/6388) — *Support allowOutOfRange for CDC startingVersion in DSv2 streaming*
- [#6370](https://github.com/delta-io/delta/pull/6370) — *[Part 7] DV+CDC same-path pairing and DeletionVector support*

**Technical need behind the activity:** users want Delta’s CDC to behave as a **first-class streaming source** with robust semantics for offsets, snapshots, schema evolution, out-of-range starts, and interactions with **deletion vectors**. This is a strong roadmap signal that Delta maintainers see CDC streaming as a strategic capability for near-real-time analytics and incremental pipelines.

### 2) DSv2 write-path and DDL foundations
- [#6230](https://github.com/delta-io/delta/pull/6230) — *[DSv2] Add executor writer: DataWriter, DeltaWriterCommitMessage*
- [#6377](https://github.com/delta-io/delta/pull/6377) — *Add DDLContext POJO and prerequisite infra for DSv2 CREATE TABLE*

These PRs point to a broader modernization effort around **Spark DataSource V2** support, including executor-side writers and table-creation infrastructure.  
**Underlying need:** tighter Spark integration, cleaner separation of planning/execution, and better compatibility with modern Spark APIs.

### 3) Cross-engine and ecosystem integration
- [#6188](https://github.com/delta-io/delta/pull/6188) — *[Flink] Support Catalog-Managed Table with UC*
- [#6392](https://github.com/delta-io/delta/pull/6392) — *DeltaFormatSharingSource only finish current version when startOffset is from Legacy*

These reflect continued demand for Delta beyond core Spark batch use cases: **Flink**, **Sharing**, and **Unity Catalog** interoperability remain active integration fronts.

### 4) Predicate pushdown and scan efficiency
- [#6355](https://github.com/delta-io/delta/pull/6355) — *Add AlwaysTrue/AlwaysFalse filter pushdown to V2 connector*

This is small but meaningful. Supporting `AlwaysFalse` lets the kernel skip all files in impossible predicates, improving scan efficiency and connector correctness in edge-case logical plans.

## 4. Bugs & Stability

Ranked by likely user impact:

### High severity
#### 1) PySpark 4.0 `clusterBy` causing partitioning/expression errors
- Issue: [#4823](https://github.com/delta-io/delta/issues/4823)
- Title: *[bug] [BUG] Pyspark 4.0 clusterBy raises strange errors Partitioning by expressions*

This is the clearest live end-user bug in today’s issue set. It suggests a **compatibility or semantic mismatch with PySpark 4.0**, specifically around `clusterBy` and partitioning-by-expression behavior. For users adopting new Spark versions, this could block table creation/writes or produce confusing planning-time exceptions.  
**Fix PR visible today?** No direct fix PR is evident in the provided data.

### Medium severity
#### 2) Unstructured exception for `startVersionNotFound`
- Issue: [#6380](https://github.com/delta-io/delta/issues/6380)
- Title: *[kernel-spark] startVersionNotFound should throw a structured exception exposing earliestAvailableVersion*

This is framed as an enhancement, but it has **stability and operability implications**. If the earliest available version is only embedded in a string message, downstream applications cannot reliably recover or implement fallback logic.  
**Severity rationale:** not a crash/corruption bug, but it degrades programmatic error handling for CDC/streaming consumers.  
**Related fix PR visible today?** None directly linked in the provided set, though [#6388](https://github.com/delta-io/delta/pull/6388) on `allowOutOfRange` for CDC `startingVersion` appears adjacent in scope.

### Stability signals from PR activity
Several open PRs suggest maintainers are proactively addressing tricky correctness areas:
- [#6362](https://github.com/delta-io/delta/pull/6362) — CDC schema coordination
- [#6363](https://github.com/delta-io/delta/pull/6363) — end-to-end CDC integration tests
- [#6370](https://github.com/delta-io/delta/pull/6370) — deletion vector + CDC pairing
- [#6392](https://github.com/delta-io/delta/pull/6392) — sharing source offset completion semantics

These indicate active work on **streaming correctness**, especially in corner cases around offsets, schema changes, and mixed storage metadata.

## 5. Feature Requests & Roadmap Signals

### Strongest roadmap signals

#### 1) CDC streaming in kernel-spark / DSv2 is nearing functional completeness
Relevant PRs:
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6391](https://github.com/delta-io/delta/pull/6391)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- [#6359](https://github.com/delta-io/delta/pull/6359)
- [#6362](https://github.com/delta-io/delta/pull/6362)
- [#6363](https://github.com/delta-io/delta/pull/6363)
- [#6388](https://github.com/delta-io/delta/pull/6388)
- [#6370](https://github.com/delta-io/delta/pull/6370)

**Prediction:** highly likely to influence the next substantial release once the stack lands. This looks like the repo’s most coordinated active feature track.

#### 2) Better DSv2 write and DDL support
- [#6230](https://github.com/delta-io/delta/pull/6230)
- [#6377](https://github.com/delta-io/delta/pull/6377)

**Prediction:** likely medium-term release material, especially if Delta is aligning more deeply with Spark’s modern connector APIs.

#### 3) Flink + Unity Catalog managed table support
- [#6188](https://github.com/delta-io/delta/pull/6188)

**Prediction:** strong ecosystem demand, especially for multi-engine lakehouse deployments. Could make the next release notes if merged soon.

#### 4) Protocol/storage configurability around compression
- [#6324](https://github.com/delta-io/delta/pull/6324) — *[RFC] for compression setting*

This is still an RFC, but it signals interest in making **Parquet compression settings** more explicit and standardized at the Delta protocol/config layer.  
**Prediction:** unlikely to appear immediately as a finalized user feature, but it is an important indicator of future storage-tuning work.

#### 5) Better structured error reporting in kernel APIs
- Issue: [#6380](https://github.com/delta-io/delta/issues/6380)

This kind of request often gets accepted because it improves embedding Delta in higher-level systems and services.  
**Prediction:** plausible for a near-term minor release if implementation is small.

## 6. User Feedback Summary

From today’s issue/PR set, the clearest user pain points are:

- **Spark/PySpark compatibility friction**, especially with new runtime versions:
  - [#4823](https://github.com/delta-io/delta/issues/4823)

- **Need for operationally usable streaming/CDC semantics**, including:
  - reliable offset handling
  - start-version boundary behavior
  - schema coordination
  - deletion vector interaction
  - end-to-end test coverage  
  Representative PRs:
  - [#6075](https://github.com/delta-io/delta/pull/6075)
  - [#6362](https://github.com/delta-io/delta/pull/6362)
  - [#6363](https://github.com/delta-io/delta/pull/6363)
  - [#6370](https://github.com/delta-io/delta/pull/6370)
  - [#6388](https://github.com/delta-io/delta/pull/6388)

- **Programmatic error handling is not always rich enough** for production-grade consumers:
  - [#6380](https://github.com/delta-io/delta/issues/6380)

- **Enterprise integration needs remain strong**, especially with Unity Catalog, Sharing, and Flink:
  - [#6188](https://github.com/delta-io/delta/pull/6188)
  - [#6392](https://github.com/delta-io/delta/pull/6392)
  - [#6393](https://github.com/delta-io/delta/pull/6393)

In short, user demand today is less about new SQL syntax and more about **reliable interoperability, streaming correctness, and connector maturity**.

## 7. Backlog Watch

These items look important and may need maintainer attention due to scope, age, or user impact:

### 1) Spark 4.0 compatibility bug
- [#4823](https://github.com/delta-io/delta/issues/4823)

Even with low comment volume, compatibility issues against a major upstream Spark version deserve visibility. If unresolved, they can slow adoption and produce support burden.

### 2) Long-running CDC streaming stack review burden
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- plus dependent stack PRs [#6336](https://github.com/delta-io/delta/pull/6336), [#6359](https://github.com/delta-io/delta/pull/6359), [#6362](https://github.com/delta-io/delta/pull/6362), [#6363](https://github.com/delta-io/delta/pull/6363), [#6370](https://github.com/delta-io/delta/pull/6370), [#6388](https://github.com/delta-io/delta/pull/6388), [#6391](https://github.com/delta-io/delta/pull/6391)

This stack is strategically important but inherently difficult to review because of sequencing and interdependencies. It may need explicit maintainer coordination to avoid merge bottlenecks.

### 3) DSv2 executor writer
- [#6230](https://github.com/delta-io/delta/pull/6230)

This appears foundational for modern write-path support. Given its scope and age relative to today’s digest, it is worth watching as a potentially high-impact infrastructure PR.

### 4) Flink managed tables with Unity Catalog
- [#6188](https://github.com/delta-io/delta/pull/6188)

Cross-engine UC support is strategically significant and likely relevant to enterprise users; prolonged delay here could limit Delta’s multi-engine story.

### 5) Documentation completeness for data types
- [#6115](https://github.com/delta-io/delta/pull/6115)

Docs work is easy to deprioritize, but this kind of material directly affects user onboarding and compatibility understanding, especially for advanced/edge data types.

## 8. Overall Health Assessment

Delta Lake appears **healthy and highly active**, with substantial implementation work underway and no signs of broad incident-level instability in the issue tracker today. The main story is a concentrated engineering push on **CDC streaming in kernel-spark**, which, if completed, would materially improve Delta’s streaming and incremental-processing capabilities. The biggest near-term risks are **review bandwidth** for stacked architectural PRs and **runtime compatibility** issues such as the reported **PySpark 4.0 `clusterBy` bug**. No release was cut today, so the repository currently looks more like a project in **feature-integration mode** than release-finalization mode.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-26

## 1. Today's Overview

Databend showed **high PR activity and light issue volume** over the last 24 hours: **22 PRs updated**, versus only **3 issues updated** and **no new releases**. The work pattern is strongly skewed toward **query engine correctness, SQL compatibility, and planner/executor hardening**, with many bugfix PRs clustered around edge cases that could otherwise cause panics or schema mismatches. Overall, the project appears **healthy and fast-moving**, with maintainers and contributors converting newly reported issues into fix PRs quickly. The current snapshot suggests a phase focused more on **stability and semantic correctness** than on broad end-user feature launches, though a few notable feature/refactor efforts remain active.

## 2. Project Progress

### Merged/closed PRs today

#### 1) Server-side parameter binding for HTTP query API
- PR: [#19601](https://github.com/databendlabs/databend/pull/19601) — `feat(http): add server-side parameter binding to /v1/query`  
- Status: Closed  
- What it advances:
  - Adds an optional `params` field to `/v1/query`
  - Supports both positional (`?`) and named (`:name`) placeholders
- Why it matters:
  - Improves **application integration ergonomics**
  - Reduces client-side SQL string interpolation pressure
  - Signals continued investment in **API usability and safe query submission**

#### 2) Planner panic prevention for invalid LIKE ESCAPE literals
- PR: [#19597](https://github.com/databendlabs/databend/pull/19597) — `fix(query): avoid planner panic for invalid LIKE ESCAPE literals`  
- Status: Closed  
- What it advances:
  - Converts invalid `LIKE ... ESCAPE` cases from planner panic behavior into **semantic error reporting**
  - Adds regression coverage
- Why it matters:
  - This is a direct **query stability and correctness** improvement
  - Prevents malformed SQL from escalating into internal failure behavior
  - Reinforces a broader trend visible across today’s PRs: replacing `panic`/`unwrap` paths with structured errors

### Other active progress signals

A large share of open PRs are focused on:
- **SQL compatibility**:
  - [#19615](https://github.com/databendlabs/databend/pull/19615) — support `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
  - [#19608](https://github.com/databendlabs/databend/pull/19608) — treat `X'...'` as binary literal
- **Query planner/executor correctness**:
  - [#19616](https://github.com/databendlabs/databend/pull/19616) — full outer `USING` nullability alignment
  - [#19607](https://github.com/databendlabs/databend/pull/19607) — correlated subqueries over `UNION`
  - [#19602](https://github.com/databendlabs/databend/pull/19602) — structured projection mismatch error
  - [#19604](https://github.com/databendlabs/databend/pull/19604) — IEJoin empty outer fill fix
  - [#19603](https://github.com/databendlabs/databend/pull/19603) — unsigned ASOF join keys
- **Execution/statistics robustness**:
  - [#19591](https://github.com/databendlabs/databend/pull/19591) — overflow-safe stats derivation for full-range `UInt64`
- **Infrastructure/networking**:
  - [#19619](https://github.com/databendlabs/databend/pull/19619) — enable `TCP_NODELAY` on gRPC listeners
- **Longer-horizon engine work**:
  - [#19553](https://github.com/databendlabs/databend/pull/19553) — partitioned hash join
  - [#19551](https://github.com/databendlabs/databend/pull/19551) — experimental table branch support

## 3. Community Hot Topics

There were no heavily discussed or highly reacted items in the provided data; comment and reaction counts are effectively near zero across issues and PRs. Still, several items stand out because they map to important technical needs.

### A. `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
- Issue: [#19611](https://github.com/databendlabs/databend/issues/19611)
- Duplicate/closed report: [#19613](https://github.com/databendlabs/databend/issues/19613)
- Fix PR: [#19615](https://github.com/databendlabs/databend/pull/19615)

**Technical need:** users want **idempotent schema evolution**, especially for migration tooling, repeated deployment scripts, and compatibility with common SQL expectations. The immediate appearance of a fix PR suggests this is considered straightforward and important for operational usability.

### B. Error classification around `PanicError`
- Issue: [#19612](https://github.com/databendlabs/databend/issues/19612)
- Fix PR: [#19614](https://github.com/databendlabs/databend/pull/19614)

**Technical need:** users and maintainers need **clearer internal-vs-user-facing error semantics**. Renaming `ErrorCode::PanicError` and fixing OOM/error mapping indicates concern that current error labeling can mislead operators during diagnosis, especially in executor memory-pressure scenarios.

### C. Broader anti-panic hardening trend
Representative PRs:
- [#19597](https://github.com/databendlabs/databend/pull/19597)
- [#19602](https://github.com/databendlabs/databend/pull/19602)
- [#19604](https://github.com/databendlabs/databend/pull/19604)
- [#19605](https://github.com/databendlabs/databend/pull/19605)
- [#19603](https://github.com/databendlabs/databend/pull/19603)

**Technical need:** the project is actively reducing **unexpected panics in planner, parser, and join execution paths**. This points to a maturing engine where edge-case semantics and internal invariant handling are now a major optimization target.

## 4. Bugs & Stability

Ranked by likely severity and operational impact.

### High severity

#### 1) Misleading panic/error classification and executor OOM mapping
- Issue: [#19612](https://github.com/databendlabs/databend/issues/19612)
- Fix PR: [#19614](https://github.com/databendlabs/databend/pull/19614)

**Why severe:** incorrect error mapping can mislead incident response and observability pipelines. If executor memory-limit failures are surfaced as panic-like conditions, users may misdiagnose engine reliability issues.

#### 2) Query planner panics from invalid LIKE ESCAPE literals
- Fix PR: [#19597](https://github.com/databendlabs/databend/pull/19597)
- Related open hardening PR: [#19595](https://github.com/databendlabs/databend/pull/19595)

**Why severe:** malformed SQL should not crash planning logic. This affects query safety and user trust in SQL validation paths.

#### 3) Result schema mismatch causing panic-like behavior
- PR: [#19602](https://github.com/databendlabs/databend/pull/19602)

**Why severe:** projection/schema mismatches can break query execution in ways that are hard to debug. Returning structured errors is critical for correctness and debuggability.

### Medium severity

#### 4) Full outer join nullability inconsistency
- PR: [#19616](https://github.com/databendlabs/databend/pull/19616)

**Impact:** can produce schema/planning inconsistencies for `FULL OUTER JOIN ... USING`, affecting downstream consumers and correctness assumptions.

#### 5) Correlated subqueries over `UNION` / `UNION ALL`
- PR: [#19607](https://github.com/databendlabs/databend/pull/19607)

**Impact:** this is a correctness issue in decorrelation logic, important for advanced analytical SQL workloads.

#### 6) IEJoin outer-fill panic on empty inner side
- PR: [#19604](https://github.com/databendlabs/databend/pull/19604)

**Impact:** join operator edge case that could crash execution under specific data distributions.

#### 7) Unsigned ASOF join keys unsupported / unsafe unwraps
- PR: [#19603](https://github.com/databendlabs/databend/pull/19603)

**Impact:** affects time-series and event alignment workloads using ASOF joins with unsigned key types.

#### 8) Overflow in stats derivation for full-range `UInt64`
- PR: [#19591](https://github.com/databendlabs/databend/pull/19591)

**Impact:** may distort optimizer statistics and query planning quality, especially on wide integer domains.

### Lower severity but high usability value

#### 9) `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` unsupported
- Issue: [#19611](https://github.com/databendlabs/databend/issues/19611)
- Duplicate closed issue: [#19613](https://github.com/databendlabs/databend/issues/19613)
- Fix PR: [#19615](https://github.com/databendlabs/databend/pull/19615)

**Impact:** not a crash, but a notable SQL compatibility and migration usability gap.

#### 10) Nested join round-trip parser panic in debug checks
- PR: [#19605](https://github.com/databendlabs/databend/pull/19605)

**Impact:** mainly affects development/debug paths, but still important for parser robustness.

## 5. Feature Requests & Roadmap Signals

### Likely near-term additions

#### Idempotent schema evolution support
- Issue: [#19611](https://github.com/databendlabs/databend/issues/19611)
- PR: [#19615](https://github.com/databendlabs/databend/pull/19615)

This looks highly likely to land soon. It is small in scope, already has a fix PR, and aligns with standard SQL migration practices.

#### Improved error taxonomy
- Issue: [#19612](https://github.com/databendlabs/databend/issues/19612)
- PR: [#19614](https://github.com/databendlabs/databend/pull/19614)

Not a “feature” in the user-facing sense, but a strong roadmap signal for **more precise diagnostics** and better operational semantics.

### Emerging engine roadmap signals

#### Partitioned hash join
- PR: [#19553](https://github.com/databendlabs/databend/pull/19553)

This is one of the clearest signs of ongoing work on **query engine scalability and join execution improvements**. If merged, it could materially affect large analytical workloads and memory behavior.

#### Experimental table branch support
- PR: [#19551](https://github.com/databendlabs/databend/pull/19551)

This points to possible investment in **branching/versioned table workflows**, potentially relevant for data experimentation, isolated changes, or Git-like data operations.

#### HTTP query parameter binding
- PR: [#19601](https://github.com/databendlabs/databend/pull/19601)

Even though the PR is closed rather than clearly marked merged in this dataset, it reflects sustained interest in **safer and more convenient application-facing APIs**.

## 6. User Feedback Summary

Today’s user-facing signals are dominated by **compatibility and reliability pain points**, not by requests for entirely new analytical features.

Key pain points inferred from reports and fixes:
- **Migration friendliness:** users expect common SQL patterns like `ADD COLUMN IF NOT EXISTS` to work cleanly.
- **No panics on bad SQL:** invalid syntax or semantically invalid constructs should produce structured errors, not internal failures.
- **Advanced SQL correctness:** users are exercising sophisticated features such as correlated subqueries, `FULL OUTER JOIN ... USING`, ASOF joins, nested joins, and binary literals.
- **Operational clarity:** users need error messages that distinguish internal unwind/panic paths from runtime resource constraints such as memory pressure.

Satisfaction signals:
- The turnaround from issue report to fix PR is fast for the `ALTER TABLE` compatibility gap and error-code cleanup.
- The breadth of regression tests mentioned in many PRs suggests maintainers are not only patching bugs, but also **trying to prevent recurrence**.

## 7. Backlog Watch

These are important open items that appear to deserve maintainer attention because they are strategically significant or long-running relative to the rest of today’s fast-turnaround bugfix stream.

### 1) Experimental table branch support
- PR: [#19551](https://github.com/databendlabs/databend/pull/19551)
- Created: 2026-03-15

This is one of the older active PRs in the snapshot and likely represents a non-trivial feature. It may need review bandwidth because it could have meaningful implications for metadata, storage semantics, or user workflows.

### 2) Partitioned hash join
- PR: [#19553](https://github.com/databendlabs/databend/pull/19553)
- Created: 2026-03-16

This looks strategically important for performance and scalability. Given its scope, it likely warrants focused review and benchmarking attention before merge.

### 3) Broad cluster of agent-approved bugfix PRs
Representative PRs:
- [#19616](https://github.com/databendlabs/databend/pull/19616)
- [#19615](https://github.com/databendlabs/databend/pull/19615)
- [#19614](https://github.com/databendlabs/databend/pull/19614)
- [#19608](https://github.com/databendlabs/databend/pull/19608)
- [#19607](https://github.com/databendlabs/databend/pull/19607)
- [#19604](https://github.com/databendlabs/databend/pull/19604)
- [#19603](https://github.com/databendlabs/databend/pull/19603)
- [#19602](https://github.com/databendlabs/databend/pull/19602)

These are recent rather than stale, but the **volume** itself is notable. Maintainers may want to batch-review and prioritize them because many are low-level correctness fixes with direct user impact.

---

## Overall Health Assessment

Databend is in a **productive stabilization phase**: lots of code movement, rapid issue-to-PR response, and heavy attention on planner, parser, join, and error-handling correctness. No release was cut today, but the current stream of changes should improve **SQL compatibility, execution resilience, and diagnosability** once merged. The biggest strategic items to watch remain **partitioned hash join** and **experimental table branch support**, while the most immediate user-visible gains are likely to come from the many open bugfix PRs now queued for review.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-26

## 1. Today's Overview

Velox showed **high PR activity** over the last 24 hours, with **50 pull requests updated** and **16 merged/closed**, indicating strong ongoing development velocity. Issue traffic was lighter at **6 updated issues**, but those issues point to meaningful themes: **GPU execution coverage**, **fuzzer instability**, and **build/developer tooling**. Overall, project health looks **active but mixed**: core engine work continues to land, while CI/fuzzer reliability and cuDF feature gaps remain visible operational risks. There were **no new releases** today.

## 2. Project Progress

Today’s merged and closed PRs advanced several areas of the engine, especially **query execution correctness**, **memory behavior**, and **observability**.

### Query execution and correctness
- **HashProbe filter correctness / crash avoidance**
  - PR [#16868](https://github.com/facebookincubator/velox/pull/16868) — **Merged**
  - Fixes a debug-only sanity check failure in `DictionaryVector::validate` during `HashProbe::evalFilter`, specifically for **ANTI joins** with filters referencing a **probe-side join key**.
  - This is a meaningful correctness/stability improvement in join execution, especially for complex filtered anti-join plans.

- **Probe-side lazy loading and memory arbitration behavior**
  - PR [#16774](https://github.com/facebookincubator/velox/pull/16774) — **Merged**
  - Pre-loads lazy probe input vectors before the non-reclaimable probe loop, reducing scattered lazy loads and improving interaction with the memory arbitrator.
  - This looks like an execution-engine robustness improvement for workloads sensitive to memory reclaim timing.

### Cache/runtime observability
- **AsyncDataCache lookup metrics**
  - PR [#15430](https://github.com/facebookincubator/velox/pull/15430) — **Closed**
  - Adds runtime stats for **number of lookups** to `AsyncDataCache`.
  - Even though the PR is now closed rather than newly merged, the underlying direction is notable: users need more accurate cache visibility than hit/new counters alone provide.

### File format / writer capability
- **Compression support for TextWriter**
  - PR [#14677](https://github.com/facebookincubator/velox/pull/14677) — **Closed**
  - Adds support for **ZSTD, GZIP, and raw DEFLATE** in `TextWriter`.
  - This is a useful storage/export capability signal, even if not landed today, because compressed text output remains a practical integration need.

### SQL and expression system evolution
- While not merged today, nearby active work suggests continued movement in SQL surface area:
  - PR [#15511](https://github.com/facebookincubator/velox/pull/15511): **S2 Presto UDFs**
  - PR [#16927](https://github.com/facebookincubator/velox/pull/16927): **`ConcatExpr`** for named `ROW(...)` construction
  - PR [#16821](https://github.com/facebookincubator/velox/pull/16821): **Cast/coercion cost propagation** for overload resolution

Taken together, today’s progress leans more toward **engine hardening and planner/expression infrastructure** than major end-user feature delivery.

## 3. Community Hot Topics

### 1) GPU coverage for Presto TPC-DS remains a visible roadmap theme
- Issue [#15772](https://github.com/facebookincubator/velox/issues/15772) — **Expand GPU operator support for Presto TPC-DS**
- Issue [#16888](https://github.com/facebookincubator/velox/issues/16888) — **Add GPU support for EnforceSingleRow operator**
- PR [#16620](https://github.com/facebookincubator/velox/pull/16620) — **Optimize CudfToVelox output batching**
- PR [#16864](https://github.com/facebookincubator/velox/pull/16864) — **Remove usage of `cudf::detail::gather`**

**Analysis:** The technical need here is clear: users are pushing Velox-cuDF toward more complete **operator coverage** and lower **CPU fallback rates** on benchmark-style analytic workloads. The `EnforceSingleRow` issue is especially concrete, noting it appears **26 times** in TPC-DS SF100 queries. This suggests the next phase of GPU work is no longer just backend enablement, but **closing operator gaps that block end-to-end acceleration**.

### 2) Window fuzzer reliability became the top short-term stability concern
- Issue [#16917](https://github.com/facebookincubator/velox/issues/16917) — **Flaky Window Fuzzer verification rate drops below 50%**
- Issue [#16918](https://github.com/facebookincubator/velox/issues/16918) — **Window Fuzzer crashes with SIGSEGV**

**Analysis:** Two fresh issues on the same day from the same area indicate a concentrated problem in **window-function testing and reference validation**. One is a **flaky reference-query threshold problem**; the other is a **null-pointer crash**. That combination suggests both infrastructure fragility and a possible real engine edge case in generated window plans. This should be treated as more than “just CI noise.”

### 3) Build impact analysis is maturing into a developer productivity investment
- Issue [#16922](https://github.com/facebookincubator/velox/issues/16922) — **Track header files in CMake targets**
- PR [#16827](https://github.com/facebookincubator/velox/pull/16827) — **Add build impact analysis workflow for PRs**

**Analysis:** This points to a growing codebase where contributor productivity is being constrained by **unclear rebuild scope** and expensive CI. The project is investing in better **change-to-target mapping**, which is a strong signal of engineering maturity and rising scale.

### 4) Remote function execution is quickly becoming a significant subsystem
- PR [#16928](https://github.com/facebookincubator/velox/pull/16928) — **Serialize only active rows; add null/determinism support**
- PR [#16903](https://github.com/facebookincubator/velox/pull/16903) — **Preserve Velox user error semantics**
- PR [#16904](https://github.com/facebookincubator/velox/pull/16904) — **Developer guide and design document**

**Analysis:** These PRs collectively show remote execution moving from prototype toward production-readiness: lower network overhead, better semantics, and improved documentation. The emphasis on **active-row serialization** implies the team is optimizing for realistic expression execution paths where only subsets of rows need evaluation.

## 4. Bugs & Stability

Ranked by likely severity:

### Critical
1. **Window Fuzzer crashes with SIGSEGV**
   - Issue [#16918](https://github.com/facebookincubator/velox/issues/16918)
   - A null pointer dereference causing a segmentation fault early in fuzzer execution.
   - Severity is high because memory safety crashes often expose genuine engine defects, even if currently seen in fuzzing.
   - **No direct fix PR in the provided data yet.**

### High
2. **Window Fuzzer verification rate intermittently drops below threshold**
   - Issue [#16917](https://github.com/facebookincubator/velox/issues/16917)
   - CI instability tied to **Presto reference query failures** can mask real regressions and slow merges.
   - This may be partly infrastructure-related, but it directly affects confidence in window-function correctness.
   - **No direct fix PR in the provided data yet.**

3. **GPU fallback due to missing operators in cuDF backend**
   - Issue [#15772](https://github.com/facebookincubator/velox/issues/15772)
   - Not a crash, but a substantial performance/capability limitation for GPU deployments.
   - Related concrete gap:
     - Issue [#16888](https://github.com/facebookincubator/velox/issues/16888) — missing GPU support for `EnforceSingleRow`.
   - Relevant in-flight work exists:
     - PR [#16620](https://github.com/facebookincubator/velox/pull/16620)
     - PR [#16864](https://github.com/facebookincubator/velox/pull/16864)

### Medium
4. **ABFS connector inefficiency from per-file client creation**
   - Issue [#16921](https://github.com/facebookincubator/velox/issues/16921)
   - Recreating `BlobClient` / `DataLakeFileClient` on every file open likely adds avoidable allocation and HTTP pipeline setup overhead.
   - This is a performance/stability-at-scale issue for Azure-backed data lake usage.
   - **No linked fix PR yet in the provided data.**

### Medium
5. **HashProbe debug crash fixed**
   - PR [#16868](https://github.com/facebookincubator/velox/pull/16868) — **Merged**
   - Good sign: at least one engine crash/correctness issue in join processing was resolved today.

## 5. Feature Requests & Roadmap Signals

### Strong signals
1. **More complete GPU SQL/operator support**
   - Issue [#15772](https://github.com/facebookincubator/velox/issues/15772)
   - Issue [#16888](https://github.com/facebookincubator/velox/issues/16888)
   - Likely roadmap direction: continued implementation of missing operators needed for **TPC-DS-style benchmark coverage** and fewer driver-adapter CPU fallbacks.

2. **Remote function execution hardening**
   - PR [#16928](https://github.com/facebookincubator/velox/pull/16928)
   - PR [#16903](https://github.com/facebookincubator/velox/pull/16903)
   - PR [#16904](https://github.com/facebookincubator/velox/pull/16904)
   - This looks likely to appear in a near-term version as a more complete and documented capability.

3. **Geospatial SQL expansion**
   - PR [#15511](https://github.com/facebookincubator/velox/pull/15511)
   - S2-based Presto UDFs are a signal that Velox continues broadening SQL compatibility for geospatial and analytical workloads.

4. **Richer expression/planner representation**
   - PR [#16927](https://github.com/facebookincubator/velox/pull/16927)
   - Support for named `ROW` construction in unresolved expression trees suggests work toward broader dialect support and more faithful SQL frontend integration.

5. **Build-system intelligence and faster developer workflows**
   - Issue [#16922](https://github.com/facebookincubator/velox/issues/16922)
   - PR [#16827](https://github.com/facebookincubator/velox/pull/16827)
   - This is unlikely to be a headline end-user feature, but very likely to land soon because it directly benefits maintainers and CI efficiency.

### Most likely near-next-version inclusions
Based on activity concentration and maturity of work:
- **Remote function execution improvements**
- **Incremental cuDF performance/compatibility gains**
- **Build impact analysis tooling**
- Possibly **selected SQL expression/planner compatibility changes** such as `ConcatExpr`

## 6. User Feedback Summary

The clearest user pain points reflected in today’s data are:

- **GPU users want fewer CPU fallbacks**, especially on benchmark and warehouse-style query sets.
  - Evidence: [#15772](https://github.com/facebookincubator/velox/issues/15772), [#16888](https://github.com/facebookincubator/velox/issues/16888)
  - This indicates users are testing Velox not just for functional GPU support, but for **meaningful end-to-end acceleration**.

- **Engine contributors need more trustworthy CI/fuzzing signals**
  - Evidence: [#16917](https://github.com/facebookincubator/velox/issues/16917), [#16918](https://github.com/facebookincubator/velox/issues/16918)
  - Pain point: flaky verification thresholds and hard crashes reduce confidence and slow iteration.

- **Cloud storage users care about connector efficiency**
  - Evidence: [#16921](https://github.com/facebookincubator/velox/issues/16921)
  - The ABFS complaint suggests real-world workloads are sensitive to per-file client initialization overhead.

- **Contributors want better build impact visibility**
  - Evidence: [#16922](https://github.com/facebookincubator/velox/issues/16922), [#16827](https://github.com/facebookincubator/velox/pull/16827)
  - This is typical of a project reaching a scale where local and CI rebuild costs are material.

Overall feedback is less about “missing basics” and more about **performance completeness, operational robustness, and contributor ergonomics**.

## 7. Backlog Watch

These older or strategically important items appear to need ongoing maintainer attention:

1. **S2 Presto UDFs**
   - PR [#15511](https://github.com/facebookincubator/velox/pull/15511)
   - Open since **2025-11-15**.
   - Important for SQL/geospatial feature growth; longevity suggests review bandwidth or integration complexity.

2. **FBThrift migration**
   - PR [#16019](https://github.com/facebookincubator/velox/pull/16019)
   - Open since **2026-01-14**.
   - Strategic dependency-management work, especially around Parquet and thrift compatibility. Long-running infra migrations can stall and deserve explicit ownership.

3. **EncodedVectorCopy / FlatMapVector support**
   - PR [#16161](https://github.com/facebookincubator/velox/pull/16161)
   - Open since **2026-01-29**.
   - Important lower-level vector capability work that may unblock other functionality.

4. **cuDF batching optimization**
   - PR [#16620](https://github.com/facebookincubator/velox/pull/16620)
   - Open since **2026-03-04**.
   - High practical relevance for GPU efficiency; likely worth prioritizing given active cuDF roadmap pressure.

5. **Tracking issue for GPU operator gaps**
   - Issue [#15772](https://github.com/facebookincubator/velox/issues/15772)
   - Open since **2025-12-15**.
   - This is a strategic backlog item, not just a bug. It likely needs milestone-level ownership because multiple smaller issues now roll up into it.

## Overall Health Assessment

Velox remains a **highly active analytical engine project** with visible progress in execution internals, SQL/planner infrastructure, and GPU/remote execution expansion. The strongest positive signal today is **sustained development throughput**. The main caution flags are **window-fuzzer instability** and **incomplete GPU operator coverage**, both of which affect confidence in production-grade acceleration and correctness validation. In short: **momentum is strong, but stabilization work should keep pace with feature expansion**.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-26

## 1. Today's Overview

Apache Gluten remained highly active over the last 24 hours, with **12 issues updated** and **15 pull requests updated**, indicating steady engineering throughput across core, Velox, ClickHouse, GPU, and build/test areas. The day’s work was weighted more toward **stability, cleanup, compatibility, and roadmap coordination** than toward major new feature landings. A notable governance milestone also surfaced: the umbrella graduation task issue was closed, signaling project maturation at the ASF level. Overall, project health looks **active and forward-moving**, though several new bugs in Velox/GPU paths show that Spark 4.x and heterogeneous deployment support are still active risk areas.

---

## 3. Project Progress

### Merged/closed PRs today

#### 1) Core codebase cleanup
- **PR #11822 — [CORE] Remove empty companion objects**  
  Link: https://github.com/apache/incubator-gluten/pull/11822  
  This is a small but healthy code hygiene change in `gluten-core`, removing unused empty companion objects. It does not directly change query semantics, but it reduces maintenance noise and improves code clarity.

#### 2) Daily Velox sync continued
- **PR #11817 — [VL] Daily Update Velox Version (2026_03_24)**  
  Link: https://github.com/apache/incubator-gluten/pull/11817  
  Gluten continues its regular upstream Velox sync process, which is strategically important because many Gluten query execution capabilities, correctness fixes, and file format behaviors depend on Velox advancement. This PR likely pulled in upstream fixes around data types, build stability, and engine internals, helping Gluten stay aligned with its primary execution backend.

#### 3) ClickHouse backend memory/resource correctness
- **PR #11818 — [CH] Close ColumnarBatch in CHColumnarCollectLimitExec for skipped batches**  
  Link: https://github.com/apache/incubator-gluten/pull/11818  
  This fix improves resource management in the ClickHouse backend by ensuring skipped `ColumnarBatch` objects are closed. That matters for long-running analytical workloads where leaked batches can translate into memory pressure and reduced executor stability.

#### 4) Configuration/model cleanup with user-facing impact
- **PR #11756 — [CORE] Remove RAS**  
  Link: https://github.com/apache/incubator-gluten/pull/11756  
  This is the most consequential closed PR in the digest because it includes a **breaking configuration rename**:
  - `spark.gluten.ras.costModel` → `spark.gluten.costModel`
  
  This indicates simplification of internal planning/cost-model configuration and may affect deployers upgrading custom configs or automation.

### What this advances overall
Today’s closed work advanced:
- **Code maintainability** in core
- **Backend stability and memory safety** in ClickHouse
- **Execution engine freshness** via Velox sync
- **Configuration simplification** in core planning/cost model settings

---

## 4. Community Hot Topics

### 1) 2025 roadmap wrap-up
- **Issue #8226 — Gluten 2025 Roadmap**  
  Link: https://github.com/apache/incubator-gluten/issues/8226  
  Stats: 23 comments, 34 👍  
  This was one of the most visible roadmap threads and was closed yesterday. High engagement suggests the community is strongly aligned around multi-quarter planning, especially on **Velox backend support, Spark version compatibility, and feature prioritization**.

**Technical signal:** users and contributors want predictability around:
- Spark 4.x support
- backend capability parity
- execution engine roadmap visibility

### 2) Velox upstream gap tracking
- **Issue #11585 — [VL] useful Velox PRs not merged into upstream**  
  Link: https://github.com/apache/incubator-gluten/issues/11585  
  Stats: 16 comments  
  This tracker reflects a major technical reality for Gluten: key features or fixes sometimes exist in community-submitted Velox PRs but are not yet merged upstream. Gluten intentionally avoids excessive divergence from upstream Velox because rebasing a fork is costly.

**Technical need behind it:**  
The community needs a better path for:
- consuming important Velox improvements faster
- minimizing downstream patch burden
- deciding when a local pick is worth the maintenance cost

This is a strategic dependency-management issue, not just a housekeeping tracker.

### 3) 2024 roadmap closure
- **Issue #4709 — Gluten Roadmap in 2024**  
  Link: https://github.com/apache/incubator-gluten/issues/4709  
  Stats: 6 comments, 19 👍  
  Closing the 2024 roadmap while opening the 2026 roadmap shows project planning continuity.

### 4) New 2026 roadmap thread
- **Issue #11827 — Gluten 2026 Roadmap**  
  Link: https://github.com/apache/incubator-gluten/issues/11827  
  Freshly opened and likely to become the key planning thread for upcoming feature priorities.

### 5) TimestampNTZ / Spark SQL compatibility work
- **PR #11720 — [VL] Add config to disable TimestampNTZ validation fallback**  
  Link: https://github.com/apache/incubator-gluten/pull/11720
- **PR #11656 — [VL] Add validation tests for CurrentTimestamp and now(foldable)**  
  Link: https://github.com/apache/incubator-gluten/pull/11656

These PRs indicate active work on **Spark SQL semantic compatibility**, especially around time-related expressions and validation fallback behavior.

**Technical need behind it:**  
Users want finer control over fallback and better confidence that Spark built-ins map correctly into Velox execution without unnecessary Spark fallback.

---

## 5. Bugs & Stability

Ranked by apparent severity from today’s issue flow:

### High severity

#### 1) GPU path incorrectly running on CPU-only nodes
- **Issue #11828 — [VL] GPU code shouldn't be running on CPU node when cudf is enabled**  
  Link: https://github.com/apache/incubator-gluten/issues/11828  
  This is a serious deployment bug for **hybrid clusters**. If `spark.gluten.sql.columnar.cudf=true` is enabled globally, CPU-only nodes may fail. This impacts operational safety in mixed CPU/GPU environments.

**Fix status:**  
- **PR #11830 — [VL] Use immutable gpu config and add cuda runtime detection**  
  Link: https://github.com/apache/incubator-gluten/pull/11830  
  A fix PR already exists, which is a strong positive sign.

#### 2) Serializer crash in columnar path
- **Issue #11819 — UnsupportedOperationException in ColumnarBatchSerializerInstanceImpl.serializeStream(...)**  
  Link: https://github.com/apache/incubator-gluten/issues/11819  
  Repro involves a simple ordered DataFrame followed by `tail(5)`, suggesting a correctness/stability gap in a fairly normal query pattern. Because it throws at runtime in a common execution path, this is potentially impactful.

**Fix status:**  
- No direct linked fix PR in the provided data.

### Medium severity

#### 3) Spark 4.1 flaky CSV test with ZSTD/corruption handling
- **Issue #11825 — [VL] Flaky test on CSV on Spark-4.1**  
  Link: https://github.com/apache/incubator-gluten/issues/11825  
  This appears to be a regression or nondeterministic behavior in CSV error handling under Spark 4.1. Since it is currently test-flakiness rather than a confirmed production issue, it ranks below the two above, but it matters because Spark 4.1 support is a strategic compatibility target.

### Lower severity but notable

#### 4) Split scheduling inefficiency in Velox
- **Issue #11821 — [VL] pick split with most data prefetched**  
  Link: https://github.com/apache/incubator-gluten/issues/11821  
  Not a correctness bug, but a likely performance optimization opportunity. Current split selection may block on less-ready input while more-prefetched splits are available, harming throughput and latency.

---

## 6. Feature Requests & Roadmap Signals

### Newly visible feature asks

#### 1) 2026 roadmap definition
- **Issue #11827 — Gluten 2026 Roadmap**  
  Link: https://github.com/apache/incubator-gluten/issues/11827  
  This is the clearest signal of future priorities. Given adjacent activity, likely themes will include:
- Spark 4.0/4.1 support hardening
- Velox upstream alignment
- SQL function parity
- data lake format/write-path support
- GPU deployment robustness

#### 2) Iceberg write configuration mapping
- **Issue #11703 — Map iceberg configuration with Velox configuration**  
  Link: https://github.com/apache/incubator-gluten/issues/11703  
- **PR #11776 — Added iceberg write configs**  
  Link: https://github.com/apache/incubator-gluten/pull/11776  

This is one of the strongest near-term feature signals. It shows active work on **Iceberg write-path compatibility**, specifically mapping Iceberg writer settings into Velox configuration space. This kind of connector/storage interoperability work is highly likely to appear in an upcoming release.

#### 3) SQL aggregate semantic parity
- **Issue #11826 — [VL] Enable `collect_set` ignoreNulls**  
  Link: https://github.com/apache/incubator-gluten/issues/11826  
  This is a focused SQL behavior parity request, tied to a Velox upstream change. It suggests continued expansion of Spark aggregate semantics coverage in the Velox backend.

#### 4) UDF execution optimization
- **Issue #11783 — Partial Project UDF optimization**  
  Link: https://github.com/apache/incubator-gluten/issues/11783  
  This points to performance work around partial projection and Arrow conversion overhead when feeding rows back into Spark. It reflects a practical need to reduce cross-engine handoff cost in mixed native/Spark execution.

#### 5) Parquet compatibility enhancement
- **PR #11719 — [VL] Add Parquet type widening support**  
  Link: https://github.com/apache/incubator-gluten/pull/11719  
  This is a strong candidate for the next version because it improves compatibility with Parquet schema evolution and thrift-related edge cases. Enabling 79/84 tests suggests it is already fairly mature.

### Most likely next-version candidates
Based on current activity, the most likely items to land soon are:
1. **GPU runtime detection / hybrid-cluster fix** — PR #11830  
2. **Iceberg write config support** — PR #11776  
3. **Parquet type widening support** — PR #11719  
4. **Spark 4.0/4.1 test re-enablement and compatibility hardening** — PR #11816  
5. **TimestampNTZ fallback controls / SQL validation improvements** — PR #11720

---

## 7. User Feedback Summary

From today’s issues and PRs, the most visible user pain points are:

### 1) Hybrid CPU/GPU deployment is still fragile
- Issue: **#11828**  
Users appear to run Gluten in mixed clusters and need configuration behavior that is **node-aware**, not just cluster-wide. This is a real production usability concern.

### 2) Spark 4.x compatibility remains a top operational concern
- Issue: **#11825**
- PR: **#11816**  
There is clear evidence that Spark 4.0/4.1 support is advancing, but users still face flaky tests, disabled suites, and edge-case behavior differences. This suggests cautious adoption is still warranted.

### 3) Better SQL semantic coverage is in demand
- Issue: **#11826**
- PRs: **#11720**, **#11656**  
Users care about subtle semantic parity: null handling, timestamps, foldable expressions, and fallback correctness. The project is being judged not just on speed but on **Spark behavior fidelity**.

### 4) Data lake write-path integration matters
- Issue: **#11703**
- PR: **#11776**  
Iceberg configuration mapping is a practical enterprise need. This indicates Gluten users increasingly expect not only scan/query acceleration, but also stronger support for **modern table formats and write settings**.

### 5) Operational safety and memory correctness remain important
- PR: **#11818**  
Resource cleanup fixes in backend operators are still valuable and likely appreciated by users running large analytic jobs where leaks or skipped-batch mishandling accumulate over time.

---

## 8. Backlog Watch

These items look important and may need maintainer attention:

### 1) Velox upstream dependency tracker
- **Issue #11585 — [VL] useful Velox PRs not merged into upstream**  
  Link: https://github.com/apache/incubator-gluten/issues/11585  
This is strategically important and still open with substantial discussion. It affects how quickly Gluten can deliver features without carrying costly downstream patches.

### 2) Global off-heap memory allocation redesign
- **PR #11456 — [VL] Update global off-heap memory to reuse the execution memory allocation code path**  
  Link: https://github.com/apache/incubator-gluten/pull/11456  
This is marked stale but sounds architecturally important. Memory accounting/allocation design impacts stability, fairness, and integration with Spark execution semantics. It likely deserves renewed review.

### 3) TimestampNTZ support path
- **PR #11720 — disable TimestampNTZ validation fallback**
  Link: https://github.com/apache/incubator-gluten/pull/11720  
- **PR #11656 — validation tests for CurrentTimestamp and now**
  Link: https://github.com/apache/incubator-gluten/pull/11656  
These are important for SQL compatibility and developer confidence, but remain open.

### 4) Spark 4.x test suite re-enablement
- **PR #11816 — Enable 30 disabled test suites for Spark 4.0/4.1**  
  Link: https://github.com/apache/incubator-gluten/pull/11816  
This is a key readiness signal for broader Spark 4 adoption. It likely deserves prompt maintainer review because it aggregates multiple root-cause fixes.

### 5) Parquet type widening support
- **PR #11719 — Add Parquet type widening support**  
  Link: https://github.com/apache/incubator-gluten/pull/11719  
A meaningful compatibility enhancement with likely user impact; worth prioritizing if the remaining failing tests are understood.

---

## Overall Health Signal

Apache Gluten looks **healthy and highly engaged**, with strong momentum in roadmap planning, backend upkeep, and SQL/storage compatibility work. The biggest technical themes today are:
- **Velox dependency management**
- **Spark 4.x readiness**
- **GPU/hybrid-cluster correctness**
- **Iceberg and Parquet interoperability**
- **semantic parity with Spark SQL**

The project is not in a feature-freeze mode; rather, it is actively balancing **engine modernization and operational hardening**, which is usually a good sign for a maturing analytical acceleration layer.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

## Apache Arrow Project Digest — 2026-03-26

### 1. Today's Overview
Apache Arrow showed **high maintenance and feature activity** over the last 24 hours, with **50 issues updated** and **26 pull requests updated**, though **no new releases** were published. The day’s work was dominated by **R package release engineering**, **Python packaging/CI stabilization**, and continued investment in **Flight SQL / ODBC support** and **Parquet capabilities**. Overall project health looks solid: maintainers are actively closing older R issues, addressing CI breakages quickly, and progressing multi-platform connector work. The main risk signals are around **ecosystem-induced CI breakage**, **CUDA nightly instability**, and several **long-lived feature requests** in C++, Python, and Flight remaining open.

### 2. Project Progress
Merged/closed PR activity today was mostly focused on **build stability, packaging correctness, and developer workflow hardening**, rather than major engine-level feature landings.

- **[PR #49594](https://github.com/apache/arrow/pull/49594)** — **[R][CI] Add `libuv-dev` to CI jobs**
  - Closed quickly to fix CI after an upstream `fs` package change stopped bundling libuv.
  - This is important for Arrow’s R packaging pipeline and reduces release friction.

- **[PR #49575](https://github.com/apache/arrow/pull/49575)** — **[C++][CMake] Remove clang/infer tools detection**
  - Closed after addressing a macOS environment-related build issue.
  - Helps keep C++ CI resilient against GitHub runner image changes.

- **[PR #49573](https://github.com/apache/arrow/pull/49573)** — **[Python][Docs] Remove redundant editable install section**
  - Documentation cleanup following migration to `scikit-build-core`.
  - Indicates Python packaging workflow is consolidating around the newer backend.

- **[PR #49571](https://github.com/apache/arrow/pull/49571)** — **[Python] Skip header files when installing compiled Cython files**
  - Closed as part of fixing editable install and nightly verification issues.
  - Improves release verification and local development reliability for PyArrow.

- **[PR #49597](https://github.com/apache/arrow/pull/49597)** — **[CI][Dev] Pin PyGithub to `< 2.9`**
  - Immediate mitigation for a broken `archery` workflow caused by an upstream dependency release.
  - Shows strong responsiveness to tooling regressions affecting project infrastructure.

- **[PR #49567](https://github.com/apache/arrow/pull/49567)** — **[Python] Fix `CKmsConnectionConfig` copy/move issue**
  - Closed to address a build failure in Python 3.13 free-threading CI.
  - Relevant to stability as Python runtime evolution continues.

- **[PR #49589](https://github.com/apache/arrow/pull/49589)** — **[R] Verify CRAN release 23.0.1.2**
  - Closed as a non-merge verification PR, part of active R release prep.

In short, today’s merged work primarily advanced:
- **CI/build resilience**
- **R release pipeline readiness**
- **Python packaging compatibility**
- **foundation work for ongoing connector and Flight SQL efforts**

### 3. Community Hot Topics
The most discussed items reveal where users and contributors currently feel Arrow’s biggest gaps.

- **[Issue #45438](https://github.com/apache/arrow/issues/45438)** — **[R] creating arrow supported expressions**
  - Most commented open issue in the list.
  - The underlying need is better support for **extending Arrow’s R expression system**, especially for external ecosystems like `geoarrow-rs`.
  - This points to demand for **custom compute-expression integration** in higher-level language bindings.

- **[Issue #44544](https://github.com/apache/arrow/issues/44544)** — **[Python] Support broadcasting in `pyarrow.compute`**
  - A clear ergonomics request: users expect NumPy-like broadcasting semantics in vectorized compute APIs.
  - This is a strong signal that users want PyArrow compute to behave more like mainstream analytical array frameworks.

- **[PR #49553](https://github.com/apache/arrow/pull/49553)** — **[R] Expose Azure Blob Filesystem**
  - Potentially one of the most user-visible active PRs.
  - Technical need: parity across cloud object stores in the R binding, matching existing AWS/GCS support and C++/Python Azure capability.
  - This is highly relevant for analytical storage access patterns in enterprise environments.

- **[PR #49377](https://github.com/apache/arrow/pull/49377)** — **[Python][Parquet] Write Bloom filters from PyArrow**
  - Strong roadmap signal for storage optimization.
  - Users increasingly want to control **Parquet write-time indexing/pruning features** from Python, not just C++.

- **[PR #46099](https://github.com/apache/arrow/pull/46099)** and **[PR #49564](https://github.com/apache/arrow/pull/49564)** — **Flight SQL ODBC work**
  - These continue to be strategically important.
  - The technical theme is broadening Arrow Flight SQL into a more accessible **cross-platform SQL connectivity layer**, especially for BI/ODBC clients.

- **[Issue #31546](https://github.com/apache/arrow/issues/31546)** — **[C++] Improve performance of `ExecuteScalarExpression`**
  - Though older, it resurfaced in updates and remains important to Arrow’s execution engine story.
  - The need is better small-batch execution efficiency, relevant to Acero and streaming query execution.

### 4. Bugs & Stability
Ranked by likely severity and impact:

#### High severity
1. **[Issue #49437](https://github.com/apache/arrow/issues/49437)** — **[Python][C++][GPU] CUDA Python jobs fail with `'CUcontext' object has no attribute 'value'`**
   - Affects nightly CUDA jobs across environments.
   - High severity because it hits a specialized but critical integration area: **GPU interoperability and CI confidence**.
   - No direct fix PR is listed in today’s set.

2. **[PR #49597](https://github.com/apache/arrow/pull/49597)** — **Broken `archery` due to PyGithub 2.9**
   - Already mitigated by pinning dependency.
   - High operational importance since it impacts project automation and contributor tooling.

#### Medium severity
3. **[PR #49571](https://github.com/apache/arrow/pull/49571)** — **Python editable install / nightly verification breakage**
   - Fixed today.
   - Affects developer experience and release verification more than end-user data correctness.

4. **[PR #49567](https://github.com/apache/arrow/pull/49567)** — **Python 3.13 free-threading build failure**
   - Fixed today.
   - Important for forward compatibility with upcoming Python runtime changes.

5. **[Issue #40326](https://github.com/apache/arrow/issues/40326)** — **[R] `arrow.so` undefined symbol involving dataset JSON format**
   - Closed today, suggesting the issue was resolved or retired.
   - Symbol/linker issues remain a recurring packaging risk in mixed build environments.

#### Lower severity but notable correctness/UX concerns
6. **[Issue #39203](https://github.com/apache/arrow/issues/39203)** — **[R] errors with dplyr queries on big data in another environment**
   - Closed, but representative of real-world query execution friction in R lazy dataset workflows.

7. **[Issue #43747](https://github.com/apache/arrow/issues/43747)** — **[R] `case_when` fails when `if_else` succeeds**
   - Closed, and notable because it touches SQL-like expression correctness in dplyr translation.

Overall, there were **more stability fixes than fresh severe regressions** today, which is a good sign.

### 5. Feature Requests & Roadmap Signals
Several active items provide clear hints about what may land in the next Arrow version or near-term releases.

- **[PR #49553](https://github.com/apache/arrow/pull/49553)** — **R Azure Blob Filesystem**
  - Likely near-term candidate.
  - High user value and ecosystem parity benefit.

- **[PR #49377](https://github.com/apache/arrow/pull/49377)** — **PyArrow support for Parquet Bloom filter writing**
  - Strong candidate for next release if review completes.
  - Important for data skipping and storage/query optimization.

- **[PR #49334](https://github.com/apache/arrow/pull/49334)** — **[C++][Parquet] Read encrypted bloom filters**
  - Significant for security-conscious Parquet deployments.
  - Extends completeness of encrypted Parquet support.

- **[PR #49527](https://github.com/apache/arrow/pull/49527)** — **BufferedStats API in `RowGroupWriter`**
  - Useful low-level storage API addition.
  - Helps applications make smarter row-group sizing decisions while writing Parquet.

- **[PR #49535](https://github.com/apache/arrow/pull/49535)** and **[PR #49536](https://github.com/apache/arrow/pull/49536)** — **New dplyr helper support in R**
  - Good chance of landing soon.
  - These improve SQL-style transformation compatibility in Arrow’s R query layer.

- **[Issue #44544](https://github.com/apache/arrow/issues/44544)** — **PyArrow compute broadcasting**
  - Strong user demand, but likely a bigger design/API task.
  - More medium-term than immediate.

- **[PR #49564](https://github.com/apache/arrow/pull/49564)** and **[PR #49585](https://github.com/apache/arrow/pull/49585)** — **Ubuntu/static ODBC support for Flight SQL**
  - Roadmap signal: Arrow is actively moving Flight SQL toward broader deployment and interoperability.

**Prediction for next version candidates:**
1. R cloud filesystem improvements, especially Azure
2. Additional R dplyr compatibility helpers
3. PyArrow Parquet Bloom filter writing
4. More Flight SQL ODBC packaging/build support
5. Continued packaging/CI compatibility updates rather than major format changes

### 6. User Feedback Summary
Current user feedback clusters around a few recurring real-world themes:

- **R users want better cloud and compute parity**
  - Azure support in R is an obvious gap versus Python/C++.
  - Expression extensibility and more complete dplyr helper coverage are active pain points.
  - Relevant items:
    - [PR #49553](https://github.com/apache/arrow/pull/49553)
    - [Issue #45438](https://github.com/apache/arrow/issues/45438)
    - [PR #49535](https://github.com/apache/arrow/pull/49535)
    - [PR #49536](https://github.com/apache/arrow/pull/49536)

- **Python users want a more ergonomic analytical compute layer**
  - Broadcasting support and pandas conversion edge cases show that users benchmark PyArrow against NumPy/pandas expectations.
  - Relevant items:
    - [Issue #44544](https://github.com/apache/arrow/issues/44544)
    - [PR #49247](https://github.com/apache/arrow/pull/49247)

- **Users need stronger storage-layer controls**
  - Bloom filters, encrypted Bloom filter reads, and row-group buffered stats all reflect sophisticated Parquet production use cases.
  - These are less about basic functionality and more about **performance tuning and enterprise-grade storage features**.
  - Relevant items:
    - [PR #49377](https://github.com/apache/arrow/pull/49377)
    - [PR #49334](https://github.com/apache/arrow/pull/49334)
    - [PR #49527](https://github.com/apache/arrow/pull/49527)

- **Packaging and installation remain a frequent source of friction**
  - R package install/build problems, Python editable install breakage, CI dependency drift, and toolchain image changes all surfaced.
  - This suggests Arrow’s breadth across languages/platforms remains both a strength and a maintenance burden.

### 7. Backlog Watch
These older or strategically important items appear to need maintainer attention:

- **[Issue #31546](https://github.com/apache/arrow/issues/31546)** — **[C++] `ExecuteScalarExpression` performance**
  - Important to execution-engine efficiency.
  - Long-lived and still open; relevant for analytical query workloads.

- **[Issue #30775](https://github.com/apache/arrow/issues/30775)** — **[C++] Name thread pool threads**
  - Small feature, but valuable for debugging complex async execution.
  - Still marked **needs champion**.

- **[Issue #34485](https://github.com/apache/arrow/issues/34485)** — **[Format][FlightRPC] Transfer `FlightData` in pieces**
  - Strategically important for large batch transport and gRPC message-size constraints.
  - Important for production Flight deployments.

- **[Issue #29828](https://github.com/apache/arrow/issues/29828)** — **[Python] Support other interval types**
  - Longstanding Python API completeness gap.

- **[Issue #20187](https://github.com/apache/arrow/issues/20187)** — **[C++] Pushdown filters on augmented columns like filename**
  - High value for lakehouse-style dataset pruning and file-level optimization.
  - Still open despite clear analytical workload relevance.

- **[Issue #31566](https://github.com/apache/arrow/issues/31566)** — **[C++] IPC stream reader extra fields validation**
  - Potential correctness/robustness issue in stream reading behavior.
  - Should get more visibility due to data integrity implications.

- **[PR #46099](https://github.com/apache/arrow/pull/46099)** — **Flight SQL ODBC layer**
  - Long-running and strategically meaningful.
  - Continued progress is visible, but age suggests this needs sustained reviewer bandwidth.

### Overall Health Assessment
Apache Arrow remains **active and healthy**, with strong evidence of maintainers responding quickly to breakages and steadily improving language bindings and connectivity. The project’s most visible momentum today is in **R release engineering**, **Python packaging reliability**, and **Flight SQL / ODBC expansion**. The biggest strategic opportunities are to convert long-running requests around **execution performance**, **dataset pushdown**, **compute ergonomics**, and **transport scalability** into deliverables.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*