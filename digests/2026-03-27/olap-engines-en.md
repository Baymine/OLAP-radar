# Apache Doris Ecosystem Digest 2026-03-27

> Issues: 12 | PRs: 125 | Projects covered: 10 | Generated: 2026-03-27 01:27 UTC

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

# Apache Doris Project Digest — 2026-03-27

## 1. Today's Overview

Apache Doris remained highly active over the last 24 hours, with **125 pull requests updated** and **12 issues updated**, indicating a strong ongoing development cadence. Activity is concentrated in several core areas: **query engine correctness**, **storage/cache behavior**, **cloud/Kubernetes operability**, **security hardening**, and **lakehouse interoperability**. No new release was published today, so the project signal is primarily about **iteration and stabilization rather than packaging**. Overall, project health looks good from a development-throughput perspective, though the issue stream shows some **real-world deployment regressions and correctness-sensitive bugs** that deserve attention.

## 2. Project Progress

Although the dataset does not list all merged PRs explicitly in detail, the PR stream updated today shows clear forward motion in several strategic areas.

### Query engine and SQL execution
- **Arithmetic comparison rewrite correctness**
  - Issue: [#61761](https://github.com/apache/doris/issues/61761)
  - A new correctness report flags that arithmetic predicate rewriting may produce wrong results when overflow occurs. This is a high-sensitivity optimizer topic because it affects query semantics, not just performance.
- **Limit pushdown improvements**
  - PR: [#61713](https://github.com/apache/doris/pull/61713)
  - Work continues on pushing `LIMIT` down into tablet readers, a classic scan-reduction optimization that can improve latency and reduce unnecessary IO.
- **Outer join reordering in DPHypER**
  - PR: [#61146](https://github.com/apache/doris/pull/61146)
  - This suggests Doris is still expanding cost-based optimizer sophistication, especially for more complex join graphs.
- **Aggregation refactor**
  - PR: [#61690](https://github.com/apache/doris/pull/61690)
  - While details are sparse, it likely relates to internal aggregation framework cleanup or performance groundwork.

### Storage engine and scan-path optimization
- **Adaptive batch sizing for `SegmentIterator`**
  - PR: [#61535](https://github.com/apache/doris/pull/61535)
  - Introduces an EWMA-based predictor to tune chunk row counts to target block size, a meaningful storage/read-path optimization for balancing throughput and memory efficiency.
- **File cache correctness and compatibility**
  - Issue: [#61784](https://github.com/apache/doris/issues/61784)
  - PR: [#61683](https://github.com/apache/doris/pull/61683)
  - There is active work on BlockFileCache startup compatibility and on passing `tablet_id` explicitly instead of parsing it from path names, especially important when packed-file layouts are enabled.
- **TopN / multiget defensive correctness**
  - PR: [#61781](https://github.com/apache/doris/pull/61781)
  - Adds validation that returned rows match requested row IDs and includes backend unit tests, improving resilience in distributed read paths.
- **ANN vector search**
  - PR: [#61160](https://github.com/apache/doris/pull/61160)
  - Support for **IVF on-disk index** points to continued investment in vector search scalability for datasets larger than memory.

### Lakehouse / external ecosystem
- **Iceberg v3 row lineage**
  - PR: [#61398](https://github.com/apache/doris/pull/61398)
- **Hive 3 execution engine switched to Tez in regression env**
  - PR: [#61639](https://github.com/apache/doris/pull/61639)
- **Spark/Iceberg docker environment upgrade**
  - PR: [#61149](https://github.com/apache/doris/pull/61149)

These indicate Doris is still deepening integration with the modern data lake stack, especially around **Iceberg**, **Hive**, and **test environment modernization**.

### Security and authentication
- **Complex password validation**
  - PR: [#61778](https://github.com/apache/doris/pull/61778)
- **LDAP empty-password control**
  - PR: [#61440](https://github.com/apache/doris/pull/61440)
- **LDAP filter escaping / injection hardening**
  - PR: [#61777](https://github.com/apache/doris/pull/61777)
  - Branch PR: [#61774](https://github.com/apache/doris/pull/61774)

This is a strong signal that authentication and enterprise security posture are active priorities.

### FE architecture cleanup
- **Decoupling FE function metadata from Thrift**
  - PR: [#61786](https://github.com/apache/doris/pull/61786)
  - Replacing `TFunctionBinaryType` with a Java enum is a notable internal cleanup that reduces FE coupling to generated RPC types and improves maintainability.

## 3. Community Hot Topics

### 1) Broad SQL compatibility coverage
- Issue: [#48203](https://github.com/apache/doris/issues/48203) — **129 comments**
- Topic: “Support All SQL Functions in Other SQL System”
- Analysis:
  - This is by far the most discussed issue in the current set.
  - It reflects a recurring user demand: **cross-dialect SQL portability**. In OLAP migrations, teams want Doris to accept function syntax and behavior from MySQL, Hive, Spark, Trino, ClickHouse, or PostgreSQL-like systems with minimal rewrite effort.
  - The updated note that LLM-based contribution workflows can generate acceptable PRs quickly is also interesting: it suggests the maintainers see this work as **large-scale but mechanically parallelizable**, especially for parser/function compatibility tasks.

### 2) Cloud/Kubernetes logging regression
- Issue: [#61728](https://github.com/apache/doris/issues/61728)
- Fix PR: [#61766](https://github.com/apache/doris/pull/61766)
- Analysis:
  - Missing MetaService logs on Kubernetes is a serious observability issue for cloud-native operators.
  - The quick appearance of a fix PR implies this is reproducible and operationally important.
  - Underlying need: **Doris cloud components must behave predictably in container logging ecosystems**, especially stdout/stderr-based collection.

### 3) HTTPS / secure-cluster ErrorURL bug
- Issue: [#61780](https://github.com/apache/doris/issues/61780)
- Fix PR: [#61785](https://github.com/apache/doris/pull/61785)
- Analysis:
  - This is another operational usability problem: generated BE ErrorURL links become unusable under secure deployment modes.
  - It reflects a larger need for **security-mode-aware endpoint generation** across the product.

### 4) FlightSQL authentication failures
- Issues: [#61757](https://github.com/apache/doris/issues/61757), [#61744](https://github.com/apache/doris/issues/61744), [#61743](https://github.com/apache/doris/issues/61743)
- Analysis:
  - Three near-duplicate reports from the same user indicate a real onboarding/interop problem rather than a one-off typo.
  - Technical need: better **FlightSQL authentication documentation, examples, and possibly server-side diagnostics**.

### 5) Docker image architecture regression
- Issue: [#61525](https://github.com/apache/doris/issues/61525)
- Analysis:
  - Users report Doris 4.0.4 images only supporting ARM64 and dropping AMD64.
  - This is highly relevant for production adoption because x86_64 remains dominant in many server estates.

## 4. Bugs & Stability

Ranked by likely severity and breadth of impact:

### High severity

1. **Query correctness risk from arithmetic rewrite overflow**
   - Issue: [#61761](https://github.com/apache/doris/issues/61761)
   - Why severe:
     - This may return **incorrect query results**, which is more serious than a crash in analytical systems.
     - Affects versions **3.0, 3.1, and master**, implying broad scope.
   - Fix status:
     - No linked fix PR yet in the provided data.

2. **FlightSQL authentication unusable**
   - Issues: [#61757](https://github.com/apache/doris/issues/61757), [#61744](https://github.com/apache/doris/issues/61744), [#61743](https://github.com/apache/doris/issues/61743)
   - Why severe:
     - Blocks access through an emerging interoperability interface.
     - Impacts client connectivity and developer adoption.
   - Fix status:
     - No fix PR shown in today’s data.

3. **4.0.4 Docker image architecture support regression**
   - Issue: [#61525](https://github.com/apache/doris/issues/61525)
   - Why severe:
     - Prevents deployment for AMD64 users if confirmed.
     - Affects packaging/distribution rather than query execution, but can fully block usage.
   - Fix status:
     - No linked PR shown here.

### Medium severity

4. **MetaService logs disappear on Kubernetes in 4.0.4**
   - Issue: [#61728](https://github.com/apache/doris/issues/61728)
   - Fix PR: [#61766](https://github.com/apache/doris/pull/61766)
   - Why important:
     - Impacts observability, diagnostics, and production support.

5. **ErrorURL inaccessible in secure clusters**
   - Issue: [#61780](https://github.com/apache/doris/issues/61780)
   - Fix PR: [#61785](https://github.com/apache/doris/pull/61785)
   - Why important:
     - Breaks troubleshooting workflows in hardened environments.

6. **RPC closure callback data race**
   - PR: [#61782](https://github.com/apache/doris/pull/61782)
   - Why important:
     - Data races in callback reuse paths can create difficult-to-debug correctness/stability issues in distributed execution.
   - Good sign:
     - A fix is already in motion.

7. **macOS BE startup crash from `fd_number` overflow**
   - PR: [#61770](https://github.com/apache/doris/pull/61770)
   - Why important:
     - Startup crash on development/testing environments.
     - Likely lower production impact than Linux-facing bugs, but still meaningful for contributors and local users.

### Lower severity / testability

8. **BlockFileCache compatibility test gap**
   - Issue: [#61784](https://github.com/apache/doris/issues/61784)
   - Why important:
     - Not a user-facing bug by itself, but closing such test gaps reduces regression risk in cache startup/migration scenarios.

## 5. Feature Requests & Roadmap Signals

Several requests and active PRs suggest where Doris may be heading next.

### Strong roadmap signals

- **SQL compatibility expansion**
  - Issue: [#48203](https://github.com/apache/doris/issues/48203)
  - Likely direction:
    - Continued addition of function aliases/semantics from other SQL engines.
    - Especially relevant for migration from mixed warehouse ecosystems.
  - Prediction:
    - Very likely to continue landing incrementally in upcoming 4.x and master builds, even if not as a single headline feature.

- **System introspection for backend compaction**
  - Closed issue: [#48893](https://github.com/apache/doris/issues/48893)
  - Request was for `information_schema.be_compaction_tasks`.
  - Although closed, the request itself is telling: operators want **better built-in introspection into storage maintenance behavior**.

- **Recycle bin lifecycle management**
  - PR: [#61504](https://github.com/apache/doris/pull/61504)
  - Three-phase retention suggests a more nuanced data lifecycle and recovery model, likely useful in cloud or governance-heavy deployments.

- **Username-based workload policy**
  - PR: [#60559](https://github.com/apache/doris/pull/60559)
  - Strong enterprise scheduling/governance signal.
  - Likely candidate for near-term inclusion because it is concrete, policy-oriented, and already has tests checked.

- **ANN vector search scalability**
  - PR: [#61160](https://github.com/apache/doris/pull/61160)
  - On-disk IVF support is a major capability for larger vector workloads.
  - Likely a visible future feature if merged.

- **Iceberg ecosystem depth**
  - PRs: [#61398](https://github.com/apache/doris/pull/61398), [#61149](https://github.com/apache/doris/pull/61149), [#61639](https://github.com/apache/doris/pull/61639)
  - Prediction:
    - Continued emphasis on Doris as both warehouse and lakehouse query engine.

### Security roadmap signals
- Password complexity: [#61778](https://github.com/apache/doris/pull/61778)
- LDAP hardening: [#61440](https://github.com/apache/doris/pull/61440), [#61777](https://github.com/apache/doris/pull/61777)

These strongly suggest upcoming releases may highlight **security posture improvements**, especially for enterprise authentication deployments.

## 6. User Feedback Summary

Today’s user-visible feedback points to a few recurring pain points:

### 1) Cloud-native operations still need polish
- MetaService logging regression on Kubernetes: [#61728](https://github.com/apache/doris/issues/61728)
- AWS web identity auth problem in storage vault: [#55972](https://github.com/apache/doris/issues/55972)

Users are running Doris in **Kubernetes/EKS-style environments**, and they expect first-class support for:
- stdout logging
- cloud identity-based authentication
- secure endpoint generation

This is a strong sign that real deployments are increasingly **containerized and cloud-managed**.

### 2) Interoperability is a major adoption driver
- FlightSQL auth failures: [#61757](https://github.com/apache/doris/issues/61757), [#61744](https://github.com/apache/doris/issues/61744), [#61743](https://github.com/apache/doris/issues/61743)
- SQL function compatibility demand: [#48203](https://github.com/apache/doris/issues/48203)

Users want Doris to fit into heterogeneous ecosystems with minimal friction:
- Python clients
- Arrow/ADBC/FlightSQL
- SQL dialect migration from other systems

### 3) Packaging and deployment consistency matter
- Docker AMD64 support concern: [#61525](https://github.com/apache/doris/issues/61525)

This is the kind of issue that can quickly affect trial and production rollout sentiment, even if the core engine is healthy.

### 4) Security-conscious deployments are increasing
- Secure cluster ErrorURL problem: [#61780](https://github.com/apache/doris/issues/61780)
- LDAP and password-policy PRs: [#61440](https://github.com/apache/doris/pull/61440), [#61777](https://github.com/apache/doris/pull/61777), [#61778](https://github.com/apache/doris/pull/61778)

This suggests more users are deploying Doris in environments with stronger compliance or internal security baselines.

## 7. Backlog Watch

These items look like they deserve maintainer attention either because of impact, age, or strategic relevance.

### Important open issues / PRs

- **SQL compatibility umbrella**
  - Issue: [#48203](https://github.com/apache/doris/issues/48203)
  - Why watch:
    - Very high discussion volume.
    - Strategic for migration and ecosystem adoption.
    - Needs clear scoping and maintainership model.

- **Docker architecture support regression**
  - Issue: [#61525](https://github.com/apache/doris/issues/61525)
  - Why watch:
    - Potentially blocks broad deployment.
    - Should be clarified quickly if image publishing is incorrect.

- **Arithmetic overflow rewrite bug**
  - Issue: [#61761](https://github.com/apache/doris/issues/61761)
  - Why watch:
    - Query correctness bugs should be triaged urgently.
    - Ideally needs reproducible test coverage and backport assessment.

- **FlightSQL authentication reports**
  - Issues: [#61757](https://github.com/apache/doris/issues/61757), [#61744](https://github.com/apache/doris/issues/61744), [#61743](https://github.com/apache/doris/issues/61743)
  - Why watch:
    - Duplicate reports indicate either missing docs or a genuine product gap.
    - Consolidation into one canonical issue would help.

### Older/stale signals worth noting

- **Compaction task metadata visibility**
  - Closed issue: [#48893](https://github.com/apache/doris/issues/48893)
  - Even though closed, operator demand for internal observability remains relevant.

- **Longstanding replica/queryability issue after BE restart**
  - Closed stale issue: [#5869](https://github.com/apache/doris/issues/5869)
  - This is old, but the symptom (“no queryable replica found”) touches storage resilience and recovery confidence.
  - If similar reports still occur, it may warrant a modern re-validation.

- **Storage vault with AWS web identity auth**
  - Closed stale issue: [#55972](https://github.com/apache/doris/issues/55972)
  - Because cloud identity auth is increasingly standard, stale closure does not necessarily mean the problem is unimportant.

## 8. Overall Assessment

Apache Doris shows **strong engineering momentum** today, with a particularly rich stream of work in **optimizer evolution, storage-path tuning, cloud/lakehouse integration, and enterprise security**. The project also appears responsive on several fresh operational bugs, as seen by same-day or near-immediate fix PRs for Kubernetes logging and secure-cluster ErrorURL handling. The main caution areas are **query correctness**, **client interoperability**, and **distribution/deployment regressions**, all of which directly affect user trust. Net-net: the project looks healthy and fast-moving, but several user-facing issues from 4.0.x deployments should be triaged and resolved promptly to maintain confidence.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-27

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, with strong parallel investment in **query correctness, cloud/lakehouse interoperability, SQL compatibility, and operational hardening**. A clear pattern across projects is that feature velocity is now balanced by pressure to improve **upgrade safety, memory behavior, and cross-engine interoperability**. The landscape is also bifurcating: some systems are full-stack analytical databases (Doris, ClickHouse, StarRocks, Databend), while others are foundational table/storage/runtime layers (Iceberg, Delta Lake, Arrow, Velox, Gluten) or embedded analytics engines (DuckDB). For technical buyers, the main differentiators are no longer just raw speed, but also **ecosystem fit, correctness discipline, and cloud-native operability**.

---

## 2. Activity Comparison

### Daily activity snapshot

| Project | Issues Updated | PRs Updated | Release Today | Health Score* | Key Current Signal |
|---|---:|---:|---|---:|---|
| **Apache Doris** | 12 | 125 | No | **8.6/10** | Strong core-engine iteration; needs attention on correctness/interoperability regressions |
| **ClickHouse** | 42 | 287 | No | **8.7/10** | Extremely high velocity; 26.x stabilization is the main concern |
| **DuckDB** | 16 | 37 | No | **8.2/10** | Healthy and active; concentrated correctness/stability work |
| **StarRocks** | 11 | 160 | No | **8.5/10** | Very strong delivery pace; external catalog and Iceberg regressions matter |
| **Apache Iceberg** | 9 | 47 | No | **8.3/10** | Healthy metadata/lakehouse evolution with targeted correctness issues |
| **Delta Lake** | 3 | 50 | No | **8.1/10** | Implementation-heavy phase, especially catalog/kernel/integration work |
| **Databend** | 0 | 14 | No | **7.8/10** | Focused engineering progress, lighter visible community pressure today |
| **Velox** | 5 | 36 | No | **8.0/10** | Good momentum in GPU and SQL/runtime infrastructure |
| **Apache Gluten** | 2 | 21 | No | **7.9/10** | Active backend compatibility work; upstream dependency drag remains |
| **Apache Arrow** | 46 | 22 | No | **8.4/10** | Broad maintenance and platform progress; correctness bugfixes remain important |

\*Health score is a qualitative synthesis of throughput, responsiveness, and visible stability risk from today’s digest, not a benchmark result.

### Relative ranking by visible engineering throughput
1. **ClickHouse**
2. **StarRocks**
3. **Apache Doris**
4. **Delta Lake / Apache Iceberg / DuckDB** (different scopes, similar healthy signal)
5. **Arrow**
6. **Velox**
7. **Apache Gluten**
8. **Databend**

---

## 3. Apache Doris's Position

### Advantages vs peers
Apache Doris is in a strong position as a **full-stack MPP analytical database** that is simultaneously investing in:
- **query optimizer depth** (`LIMIT` pushdown, outer join reordering, aggregation refactors),
- **storage-path efficiency** (adaptive batch sizing, file cache correctness, vector index work),
- **lakehouse interoperability** (Iceberg/Hive/Spark env updates),
- **enterprise security** (LDAP hardening, password complexity, injection-safe escaping).

Compared with **ClickHouse**, Doris currently appears more visibly focused on **enterprise operability and security posture**, while ClickHouse shows broader planner/runtime experimentation and higher community throughput. Compared with **StarRocks**, Doris looks somewhat stronger today in **security and FE/BE architecture cleanup**, while StarRocks is pushing harder on **federated external catalog execution**. Compared with **DuckDB**, Doris is much more oriented toward **distributed production serving and cloud deployment**, whereas DuckDB is stronger in embedded/local analytics.

### Technical approach differences
- **Doris vs ClickHouse**: Doris is trending toward balanced warehouse + lakehouse + enterprise governance; ClickHouse remains more aggressively optimized around its native execution/storage stack, though increasingly cloud/lakehouse aware.
- **Doris vs StarRocks**: both target modern MPP analytics with lakehouse access; StarRocks currently signals more emphasis on **federated query pushdown**, while Doris signals more emphasis on **internal engine correctness and auth/security hardening**.
- **Doris vs Iceberg/Delta**: Doris is a serving/query engine; Iceberg and Delta are table-format ecosystems. Doris competes by being a compute engine that can consume those ecosystems while still offering native OLAP behavior.
- **Doris vs DuckDB**: Doris is cluster-first; DuckDB is embedded-first.

### Community size comparison
By raw daily GitHub activity in this snapshot:
- Doris is **below ClickHouse and StarRocks** in visible PR volume,
- **well above Databend, Velox, and Gluten**,
- and roughly in the same broad “healthy active” band as Iceberg/Delta/DuckDB, though with a more database-engine-centric workload.

That places Doris in the **top tier of active open-source OLAP engines**, though not the single busiest project in the set.

---

## 4. Shared Technical Focus Areas

Several requirements are emerging across multiple engines.

### A. Query correctness and wrong-result prevention
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Arrow, Velox, Gluten  
**Specific needs:**
- Doris: arithmetic rewrite overflow may return wrong results
- ClickHouse: wrong `MAX/MIN` on Decimal, grace hash join wrong results, nullable/window regressions
- DuckDB: binder/internal errors and native crash paths on complex SQL
- StarRocks: `CONVERT_TZ` returning NULL on certain zones
- Arrow: filtering corruption on list arrays
- Velox: Spark JSON wildcard correctness regression
- Gluten: native UNION result correctness, aggregate semantic parity

**Interpretation:** correctness is now a first-class competitive axis, not just performance.

### B. Lakehouse and external table interoperability
**Engines:** Doris, ClickHouse, StarRocks, Iceberg, Delta Lake, Arrow  
**Specific needs:**
- Doris: Iceberg v3 lineage, Hive/Tez, Spark/Iceberg env refresh
- ClickHouse: Iceberg validation/read fixes, Parquet pushdown concerns
- StarRocks: Iceberg V3 regression, external metrics, JDBC pushdown
- Iceberg: Spark/Flink/ORC lineage and schema behavior
- Delta Lake: Kernel/Flink/server-side planning/catalog integration
- Arrow: Flight SQL ODBC and Parquet depth

**Interpretation:** external format quality is now table stakes for adoption.

### C. Cloud-native operability and object storage behavior
**Engines:** Doris, ClickHouse, StarRocks, Iceberg, Delta, Arrow  
**Specific needs:**
- Doris: Kubernetes logs, secure ErrorURL generation, AWS web identity
- ClickHouse: S3 cache sharing, MRAP requests, object-storage lifecycle concerns
- StarRocks: storage volume validation, shared-data observability
- Iceberg: AWS metrics publisher, S3 chunked encoding
- Delta: OAuth/server-side planning/governed access
- Arrow: packaging/platform issues that affect deployment workflows

### D. Memory governance and resource predictability
**Engines:** ClickHouse, DuckDB, StarRocks, Databend, Arrow  
**Specific needs:**
- ClickHouse: memory-aware thread throttling, RSS spikes, insert/group-by memory overhead
- DuckDB: memory limits vs UDF behavior
- StarRocks: precise memory statistics proposal
- Databend: aggregation spill and memory-accounting fixes
- Arrow: large-memory CI validation

### E. SQL compatibility and migration ease
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Velox, Gluten  
**Specific needs:**
- Doris: broad SQL function compatibility umbrella
- ClickHouse: `UNIQUE`, `ESCAPE`, typed NULL, analyzer migration
- DuckDB: PostgreSQL-like semantics, struct expansion, regex operators
- StarRocks: DDL generation correctness, identifier edge cases
- Velox/Gluten: Spark and Presto semantic parity at function/operator level

### F. Security and enterprise governance
**Engines:** Doris, Delta Lake, StarRocks, ClickHouse  
**Specific needs:**
- Doris: password complexity, LDAP hardening, injection prevention
- Delta: OAuth-backed planning/auth flows
- StarRocks: Ranger/tag-based access control docs and governance integration
- ClickHouse: less explicit today, but cloud/object-storage lifecycle and ops controls remain active

---

## 5. Differentiation Analysis

## Storage format orientation
- **Doris / ClickHouse / StarRocks / Databend**: integrated analytical databases with native storage engines plus growing external-table support.
- **Iceberg / Delta Lake**: storage/table format ecosystems; they rely on compute engines and connectors.
- **DuckDB**: embedded execution engine with strong file-format access, not a distributed storage platform.
- **Arrow / Velox / Gluten**: infrastructure/runtime layers rather than end-user OLAP databases.

## Query engine design
- **Doris / StarRocks**: MPP SQL engines emphasizing warehouse + lakehouse convergence.
- **ClickHouse**: highly optimized columnar engine with strong native storage execution path and fast evolution in planner/runtime internals.
- **DuckDB**: single-node embedded vectorized engine optimized for local analytics and developer workflows.
- **Velox / Gluten**: execution substrate and acceleration layer for other systems, especially Spark/Presto ecosystems.
- **Arrow**: compute/connectivity substrate, not a full SQL warehouse by itself.

## Target workloads
- **Doris**: interactive analytics, lakehouse querying, enterprise data platform deployments.
- **ClickHouse**: very high-performance analytics, logs/events/time-series, large-scale OLAP.
- **StarRocks**: real-time analytics plus federated external querying.
- **DuckDB**: notebook, local analytics, embedded BI/data science.
- **Iceberg / Delta**: open table management for lakehouse architectures.
- **Databend**: cloud analytics with emerging versioned-table semantics.
- **Velox / Gluten / Arrow**: platform components for engines and connector ecosystems.

## SQL compatibility posture
- **Most aggressive visible compatibility pressure:** Doris, ClickHouse, DuckDB, Gluten/Velox
- **Federation-driven compatibility:** StarRocks
- **Table-format semantics compatibility:** Iceberg, Delta
- **API/binding compatibility:** Arrow

---

## 6. Community Momentum & Maturity

### Tier 1: Very high momentum
- **ClickHouse**
- **StarRocks**
- **Apache Doris**

These projects show large PR volumes and broad subsystem work. They are rapidly iterating, but each also has visible stabilization obligations from recent regressions.

### Tier 2: High momentum, more focused scope
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **Apache Arrow**

These are mature and healthy, with strong contributor activity, but their scope differs: DuckDB is engine-focused, Iceberg/Delta are lakehouse metadata ecosystems, Arrow is foundational infrastructure.

### Tier 3: Active but narrower or more component-centric
- **Velox**
- **Apache Gluten**
- **Databend**

All are active, but with either a smaller visible community footprint or more specialized scope. Velox and Gluten in particular are strategically important because they influence multiple downstream engines.

### Rapidly iterating vs stabilizing
- **Rapid iteration:** ClickHouse, StarRocks, Doris, Velox
- **Stabilizing while expanding:** DuckDB, Delta Lake, Iceberg, Arrow
- **Focused core-engine buildout:** Databend
- **Compatibility/enabler phase:** Gluten

---

## 7. Trend Signals

### 1. Wrong-result bugs are treated as top-priority events
Across Doris, ClickHouse, StarRocks, Arrow, and Velox, correctness issues are receiving immediate visibility. For architects, this is a reminder to evaluate not just benchmark speed but also **regression discipline and test coverage depth**.

### 2. Lakehouse interoperability is now a mandatory capability
Iceberg, Delta, Hive, Parquet, Spark, Flink, Flight SQL, and ODBC show up repeatedly. Data engineers should assume future platform value comes from **multi-engine interoperability**, not single-engine lock-in.

### 3. Cloud-native operational polish is becoming a buying criterion
Kubernetes logs, object storage semantics, secure URL generation, OAuth, cloud identity auth, and S3 behavior are recurring themes. This matters for teams running analytics in **EKS/Kubernetes/object-store-first architectures**.

### 4. SQL compatibility is increasingly a migration strategy
Doris, ClickHouse, DuckDB, and Gluten all show active work on matching external dialects or semantics. This signals that vendors/projects want to reduce migration friction and win workloads through **low rewrite cost**.

### 5. Memory predictability is as important as raw performance
ClickHouse, DuckDB, StarRocks, Databend, and Arrow all show pressure around memory governance. For platform teams, this is valuable because operational cost and reliability depend on **peak memory control**, not only fast execution.

### 6. Enterprise governance and security are moving into core engine roadmaps
Doris, Delta, and StarRocks especially show this. That is useful for decision-makers in regulated environments: open-source OLAP engines are increasingly addressing **authentication, policy integration, and secure deployment requirements** natively.

---

## Bottom Line

Apache Doris is in a **strong competitive position**: active, technically broad, and increasingly credible across **warehouse, lakehouse, and enterprise security** needs. Its main comparative strengths today are balanced investment across **optimizer/storage improvements, security hardening, and ecosystem interoperability**, though it should urgently resolve **correctness-sensitive and interoperability-facing issues** to maintain trust. Relative to peers, Doris is not the busiest project by raw GitHub volume, but it clearly sits in the **top operational tier of open-source analytical engines** and remains highly relevant for teams evaluating modern OLAP platforms.

If you want, I can next convert this into:
1. a **one-page executive briefing**,
2. a **Doris-vs-ClickHouse-vs-StarRocks decision matrix**, or
3. a **JSON/Markdown scorecard** for internal architecture reviews.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-27

## 1) Today’s Overview

ClickHouse remains extremely active: **42 issues** and **287 PRs** were updated in the last 24 hours, with **223 PRs still open** and **64 PRs merged/closed**, which signals a very high development throughput. The day’s activity was concentrated around **query planner/runtime optimization, storage/read-path fixes, SQL compatibility work, and CI hardening**. At the same time, several newly active issues point to **26.2 regressions** in insert performance, numeric correctness, nullable/window-function behavior, and memory usage, suggesting the team is still stabilizing recent releases. Overall project health looks strong from a velocity standpoint, but **version 26.x quality and regression management** are clearly a central operational theme.

## 2) Project Progress

Even without a new release, the PR stream shows meaningful forward motion across core engine areas:

- **Planner and execution optimizations**
  - [#100364](https://github.com/ClickHouse/ClickHouse/pull/100364) proposes **LIMIT pushdown into `UNION ALL`**, reducing wasted branch processing.
  - [#99933](https://github.com/ClickHouse/ClickHouse/pull/99933) adds **automatic partition pruning for mutations**, a practical storage-engine/runtime improvement.
  - [#100383](https://github.com/ClickHouse/ClickHouse/pull/100383) introduces **memory-aware throttling of `max_threads` and `max_insert_threads`**, showing ongoing work to reduce OOM-style failure modes.
  - [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757) advances **part-level partial aggregate caching**, an important long-term OLAP acceleration direction.
  - [#96844](https://github.com/ClickHouse/ClickHouse/pull/96844) continues work on a **deserialized columns cache**, another major read-path optimization signal.

- **Storage / object store / table format improvements**
  - [#96802](https://github.com/ClickHouse/ClickHouse/pull/96802) improves **S3 client cache sharing per bucket**.
  - [#99935](https://github.com/ClickHouse/ClickHouse/pull/99935) broadens **Iceberg data path validation**, likely improving Spark-style table interoperability.
  - [#100122](https://github.com/ClickHouse/ClickHouse/pull/100122) fixes an Iceberg nested-type read exception.

- **SQL and compatibility work**
  - [#99877](https://github.com/ClickHouse/ClickHouse/pull/99877) adds the SQL-standard **`UNIQUE` subquery predicate**.
  - [#96886](https://github.com/ClickHouse/ClickHouse/pull/96886) continues migration away from the legacy `ExpressionAnalyzer` toward the newer Analyzer framework, a strategic internal modernization that should improve correctness and maintainability.
  - [#100665](https://github.com/ClickHouse/ClickHouse/pull/100665) improves **`cluster()` / `clusterAllReplicas()` usability** with table function arguments.

- **Quality, CI, and defensive fixes**
  - [#100399](https://github.com/ClickHouse/ClickHouse/pull/100399) enables **clang-tidy checks for uninitialized variables**.
  - [#100140](https://github.com/ClickHouse/ClickHouse/pull/100140) adds a **SQLStorm CI job**.
  - [#100298](https://github.com/ClickHouse/ClickHouse/pull/100298) validates `estimateCompressionRatio` input sizes to avoid logical errors from extreme allocation requests.
  - [#100855](https://github.com/ClickHouse/ClickHouse/pull/100855) and [#100853](https://github.com/ClickHouse/ClickHouse/pull/100853) backport a **critical heap-use-after-free fix** to 26.2 and 26.1.

In short, current progress is strongest in **performance engineering, planner modernization, cloud/object-storage robustness, and SQL-standard alignment**.

## 3) Community Hot Topics

Most discussed items reveal where users and maintainers are feeling pressure:

- **26.2 insert regression**
  - [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241) — *INSERT queries are 3x slower after upgrading from 25.12 to 26.2*
  - This is the clearest user-facing performance concern today. Because it affects `ReplacingMergeTree` inserts after upgrade, the likely technical need is better regression isolation around **write path changes, dedup/replacing behavior, part formation, or background activity interactions**.

- **CI crash in MergeTree compact parts**
  - [Issue #99799](https://github.com/ClickHouse/ClickHouse/issues/99799) — *Double deletion of `MergeTreeDataPartCompact` in `multi_index`*
  - A memory-lifetime/storage-part ownership problem in core MergeTree code is always high priority because it may indicate real production crash potential if not CI-only.

- **Fresh CI crash in read path**
  - [Issue #100769](https://github.com/ClickHouse/ClickHouse/issues/100769) — *Potential issue in `MergeTreeRangeReader` adjusting last granule*
  - This points to continued complexity in low-level read planning and granule navigation.

- **Operational observability request**
  - [Issue #60670](https://github.com/ClickHouse/ClickHouse/issues/60670) — *New system table `system.connections`*
  - With 5 👍 and long lifespan, this reflects a recurring operator need: better built-in visibility into **who is connected, via which protocol, and what they are doing**.

- **Distributed DDL reliability**
  - [Issue #95316](https://github.com/ClickHouse/ClickHouse/issues/95316) — *DDLWorker fails task execution with `ON CLUSTER` (since 25.8)*
  - This is a critical real-world ops issue because cluster DDL reliability is central to managed deployments.

- **SQL semantics / analyzer correctness**
  - [Issue #95319](https://github.com/ClickHouse/ClickHouse/issues/95319) — *`AMBIGUOUS_COLUMN_NAME` strange behavior in `SELECT` reused in `WHERE`*
  - This aligns with the ongoing analyzer refactor and shows community demand for more stable SQL name-resolution semantics.

- **Asynchronous object storage deletion controversy**
  - [Issue #99996](https://github.com/ClickHouse/ClickHouse/issues/99996) — *Request for synchronous blob deletion during `DROP TABLE ... SYNC`* — now closed
  - The intensity of wording in the issue suggests strong user sensitivity to storage lifecycle semantics in cloud/object-disk setups. Even though closed, it highlights a mismatch between implementation and operator expectations.

## 4) Bugs & Stability

Ranked by likely severity and user impact:

### Critical / High

1. **Heap-use-after-free in MergeTree readers**
   - Fix PRs: [#100855](https://github.com/ClickHouse/ClickHouse/pull/100855), [#100853](https://github.com/ClickHouse/ClickHouse/pull/100853)
   - This is the strongest explicit stability signal in the PR set because it is marked **critical bugfix** and already being backported.

2. **CI crash: double deletion of compact parts**
   - [Issue #99799](https://github.com/ClickHouse/ClickHouse/issues/99799)
   - Suggests possible ownership/lifecycle bugs in MergeTree part management.

3. **CI crash in `MergeTreeRangeReader`**
   - [Issue #100769](https://github.com/ClickHouse/ClickHouse/issues/100769)
   - Read-path crashes in master/release branches deserve close watching.

4. **Distributed DDL failure since 25.8**
   - [Issue #95316](https://github.com/ClickHouse/ClickHouse/issues/95316)
   - Potentially severe for multi-node production environments because schema rollout reliability is foundational.

### High correctness risk

5. **Wrong `MAX()` / `MIN()` on `Decimal` with `GROUP BY`**
   - [Issue #100740](https://github.com/ClickHouse/ClickHouse/issues/100740)
   - A correctness bug affecting aggregates on signed decimal mixes is serious because it can silently corrupt analytical results.

6. **`sign()` wrong result with nullable window-function expression in 26.2**
   - [Issue #100782](https://github.com/ClickHouse/ClickHouse/issues/100782)
   - Another likely regression in expression evaluation/type handling.

7. **Grace hash join wrong result depending on bucket count**
   - [Issue #100781](https://github.com/ClickHouse/ClickHouse/issues/100781)
   - Wrong-result join bugs are especially dangerous because they may be non-obvious and data-dependent.

8. **`accurateCastOrNull` with `Tuple` target gives `LOGICAL ERROR` or wrong result**
   - [Issue #100820](https://github.com/ClickHouse/ClickHouse/issues/100820)
   - Important because it straddles both debug-time assertions and release-mode misbehavior.

### Performance / resource regressions

9. **INSERT 3x slower after 26.2 upgrade**
   - [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)
   - The top user-visible regression in today’s issue list.

10. **Aggregate materialization causes 1.5x peak RSS spike**
   - [Issue #100775](https://github.com/ClickHouse/ClickHouse/issues/100775)
   - Indicates allocator/growth-policy inefficiency in large string result materialization.

11. **First-run `GROUP BY` memory overhead due to repeated hash-table resizing**
   - [Issue #100838](https://github.com/ClickHouse/ClickHouse/issues/100838)
   - Good example of community performance engineering feedback feeding optimizer roadmap.

12. **`INSERT INTO ... SELECT *` leads to `MEMORY_LIMIT_EXCEEDED`**
   - [Issue #88556](https://github.com/ClickHouse/ClickHouse/issues/88556)
   - Longstanding practical pain point, likely related to pipeline buffering and thread/memory policy.
   - Related mitigation direction may be visible in [#100383](https://github.com/ClickHouse/ClickHouse/pull/100383).

### Lower severity but noteworthy

13. **JSON sometimes autodetected as TSKV**
   - [Issue #100797](https://github.com/ClickHouse/ClickHouse/issues/100797)
   - Affects usability of schema inference / format detection.

14. **Predicate pushdown optimizations ignoring short-circuit expectations**
   - [Issue #100827](https://github.com/ClickHouse/ClickHouse/issues/100827)
   - Important for users relying on evaluation order to avoid expensive or unsafe expressions.

15. **Parquet v3 page-level filter pushdown ineffective for `IN (subquery)`**
   - [Issue #100743](https://github.com/ClickHouse/ClickHouse/issues/100743)
   - Performance bug, especially relevant for Iceberg/Parquet lakehouse workloads.

## 5) Feature Requests & Roadmap Signals

Several issues and PRs offer strong signals about what may land in near-term versions:

- **Operational introspection**
  - [Issue #60670](https://github.com/ClickHouse/ClickHouse/issues/60670) — `system.connections`
  - Strong practical value; likely to gain traction because it helps DBAs and cloud operators immediately.

- **Query rewrite framework**
  - [Issue #80084](https://github.com/ClickHouse/ClickHouse/issues/80084)
  - This is strategically significant. If implemented, it could support **policy enforcement, optimization rewrites, and workload governance**.

- **`PREWHERE` with `FINAL`**
  - [Issue #89880](https://github.com/ClickHouse/ClickHouse/issues/89880)
  - A strong OLAP optimization request with clear potential performance upside on MergeTree-family queries.

- **SQL compatibility enhancements**
  - [Issue #99599](https://github.com/ClickHouse/ClickHouse/issues/99599) — support `ESCAPE` in `LIKE`
  - [Issue #99607](https://github.com/ClickHouse/ClickHouse/issues/99607) — typed `NULL` behavior for `CAST(NULL AS type)`
  - [PR #99877](https://github.com/ClickHouse/ClickHouse/pull/99877) — SQL-standard `UNIQUE` predicate
  - These together suggest continued steady investment in **SQL conformance**.

- **Cloud / object storage / S3**
  - [Issue #51411](https://github.com/ClickHouse/ClickHouse/issues/51411) — support S3 Multi-Region Access Points
  - [PR #96802](https://github.com/ClickHouse/ClickHouse/pull/96802) — share S3 client cache per bucket
  - Cloud-native storage remains an active roadmap area.

- **Caching and repeated-query acceleration**
  - [PR #93757](https://github.com/ClickHouse/ClickHouse/pull/93757) — PartialAggregateCache
  - [PR #96844](https://github.com/ClickHouse/ClickHouse/pull/96844) — Columns Cache
  - These are some of the most important medium-term performance bets in the open PR set.

### Likely next-version candidates
Most likely to appear soon are items already in advanced PR form:
- [#100364](https://github.com/ClickHouse/ClickHouse/pull/100364) `LIMIT` pushdown into `UNION ALL`
- [#100383](https://github.com/ClickHouse/ClickHouse/pull/100383) memory-aware thread limiting
- [#99877](https://github.com/ClickHouse/ClickHouse/pull/99877) `UNIQUE` predicate
- [#99933](https://github.com/ClickHouse/ClickHouse/pull/99933) mutation partition pruning
- [#96802](https://github.com/ClickHouse/ClickHouse/pull/96802) S3 client cache sharing

## 6) User Feedback Summary

Today’s user feedback clusters into a few recurring themes:

- **Upgrade safety matters more than raw feature velocity**
  - The strongest complaint is the **3x insert slowdown in 26.2**: [#99241](https://github.com/ClickHouse/ClickHouse/issues/99241).
  - Users are signaling that **predictable performance across upgrades** is critical.

- **Correctness regressions are highly visible**
  - Decimal aggregate errors: [#100740](https://github.com/ClickHouse/ClickHouse/issues/100740)
  - Nullable/window function `sign()` regression: [#100782](https://github.com/ClickHouse/ClickHouse/issues/100782)
  - Grace hash wrong result: [#100781](https://github.com/ClickHouse/ClickHouse/issues/100781)
  - For analytical databases, users are clearly very sensitive to silent wrong answers.

- **Memory behavior remains a practical production pain point**
  - [#88556](https://github.com/ClickHouse/ClickHouse/issues/88556), [#100775](https://github.com/ClickHouse/ClickHouse/issues/100775), [#100838](https://github.com/ClickHouse/ClickHouse/issues/100838)
  - Users want better **peak RSS control, less resizing overhead, and more predictable insert/aggregation memory use**.

- **Cloud/lakehouse interoperability is now mainstream**
  - Iceberg and Parquet issues/PRs such as [#100122](https://github.com/ClickHouse/ClickHouse/pull/100122), [#99935](https://github.com/ClickHouse/ClickHouse/pull/99935), and [#100743](https://github.com/ClickHouse/ClickHouse/issues/100743) show that object-store and external table format quality is now a first-class expectation.

- **Operators want better observability and lifecycle control**
  - `system.connections`: [#60670](https://github.com/ClickHouse/ClickHouse/issues/60670)
  - Synchronous deletion semantics concern: [#99996](https://github.com/ClickHouse/ClickHouse/issues/99996)

Overall satisfaction appears high with the pace of development, but users are pushing hard for **stability, SQL correctness, and cloud-operational maturity**.

## 7) Backlog Watch

These older or strategically important items deserve maintainer attention:

- [Issue #60670](https://github.com/ClickHouse/ClickHouse/issues/60670) — **`system.connections`**
  - Open since 2024, clear operator value, visible community support.

- [Issue #51411](https://github.com/ClickHouse/ClickHouse/issues/51411) — **S3 Multi-Region Access Points**
  - Open since 2023; important for enterprise cloud deployments.

- [Issue #54966](https://github.com/ClickHouse/ClickHouse/issues/54966) — **backup config loading confusion**
  - Old issue touching restore usability; important for operator trust.

- [Issue #80084](https://github.com/ClickHouse/ClickHouse/issues/80084) — **query rewrite rules RFC**
  - High strategic value; could unlock a lot of future workload governance features.

- [Issue #89880](https://github.com/ClickHouse/ClickHouse/issues/89880) — **`PREWHERE` for `FINAL`**
  - Valuable optimization request for MergeTree-heavy production workloads.

- [Issue #88556](https://github.com/ClickHouse/ClickHouse/issues/88556) — **`INSERT INTO SELECT *` memory blowups**
  - Persistent real-world pain point that likely impacts adoption in ETL-heavy environments.

- [PR #96844](https://github.com/ClickHouse/ClickHouse/pull/96844) — **Columns Cache**
  - High-impact feature, but still WIP; worth continued focus.

- [PR #96886](https://github.com/ClickHouse/ClickHouse/pull/96886) — **Analyzer migration**
  - This is foundational technical debt reduction and directly relevant to many of today’s SQL correctness issues.

## Bottom Line

ClickHouse is showing **excellent development velocity and ambitious engine work**, especially around planner optimization, caching, object-store support, and SQL feature growth. However, the day’s issue mix also shows that **26.x stabilization remains urgent**, particularly for **insert performance, memory efficiency, and wrong-result regressions**. If the maintainers continue landing the current bugfix/backport and analyzer/CI improvements, near-term project health should improve materially.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-27

## 1. Today's Overview

DuckDB showed **high development activity** over the last 24 hours, with **37 PRs updated** and **16 issues updated**, indicating an active stabilization and feature-development cycle. The current signal is mostly around **bug fixing, SQL correctness, platform compatibility, and internal engine robustness**, rather than releases—there were **no new versions published today**. A notable pattern is the concentration of reports around **internal errors, crashes, and planner/binder regressions**, especially in complex SQL and newer type-system areas like `VARIANT` and nested data handling. At the same time, maintainers are landing infrastructure and ergonomics work across **Windows CLI behavior, CI quality, CSV parsing, ASOF joins, and branch maintenance**, which suggests strong focus on short-term reliability.

## 2. Project Progress

Merged/closed PRs and issues today point to meaningful progress across engine correctness, platform polish, and release branch maintenance.

### Query engine and SQL correctness
- **ASOF LEFT JOIN correctness fixed** via closure of issue [#21514](https://github.com/duckdb/duckdb/issues/21514), which reported that joining against an empty right-side table incorrectly returned an empty result rather than preserving left rows. This is a correctness fix in temporal join semantics.
- **Window framing optimization adjustment** landed in closed PR [#21628](https://github.com/duckdb/duckdb/pull/21628), preventing an optimization from being applied for `ROWS` framing. This indicates active refinement of window execution correctness.
- **CSV reader boundary handling fix** was merged in [#21632](https://github.com/duckdb/duckdb/pull/21632), addressing buffer-boundary value reads in the CSV parser on the `v1.5-variegata` branch. This is directly relevant to ingestion reliability.

### Platform and shell improvements
- **Windows shell VT100 support** was merged in [#21615](https://github.com/duckdb/duckdb/pull/21615), improving terminal rendering behavior in modern Windows environments.
- **Shell completion UX** advanced via open but near-merge PR [#21552](https://github.com/duckdb/duckdb/pull/21552), which preserves Enter after accepting tab completion for dot-commands. While still open, its status suggests imminent improvement in CLI usability.

### CI, tooling, and maintenance
- **Workflow linting and CI hygiene** were improved in merged PR [#21643](https://github.com/duckdb/duckdb/pull/21643), adding action/workflow linting and fixing existing workflow issues.
- **Julia package bump to v1.5.1** was merged in [#21637](https://github.com/duckdb/duckdb/pull/21637).
- **Branch synchronization** happened in [#21639](https://github.com/duckdb/duckdb/pull/21639), merging `v1.4-andium` into `v1.5-variegata`, a sign of ongoing release-line consolidation.

### Internal API safety
- **Vector API const-correctness** was improved in merged PR [#21631](https://github.com/duckdb/duckdb/pull/21631), making `ToUnifiedFormat` const and preventing unsafe mutation through unified vector access. This kind of change usually reduces subtle execution bugs in vectorized processing internals.

## 3. Community Hot Topics

The most interesting active discussions today center on memory governance, nested/semi-structured data correctness, SQL expansion semantics, and release regressions.

### 1) Memory limits vs UDF execution
- Issue: [#16359](https://github.com/duckdb/duckdb/issues/16359) — “Having set a memory limit, an UDF cannot complete”
- Status: Open, under review, stale
- Why it matters: This reflects a recurring user need for **predictable memory behavior under constrained execution**, especially when consuming results incrementally (`fetchone()` style). It suggests that users expect DuckDB’s memory model to better align with streaming or row-wise consumption semantics for Python/UDF-heavy workflows.

### 2) JSON → VARIANT crash
- Issue: [#21352](https://github.com/duckdb/duckdb/issues/21352) — “Internal error when converting json to variant”
- Status: Open, reproduced
- Why it matters: This is one of the clearest signals that DuckDB’s newer **semi-structured type stack** is still maturing. Users are trying realistic pipelines—Parquet with JSON text, then JSON parsing, then `VARIANT` conversion—and hitting internal assertions. That points to strong demand for robust lakehouse-style ingestion into nested/native types.

### 3) Struct star expansion semantics
- Issue: [#16787](https://github.com/duckdb/duckdb/issues/16787) — “`struct.* glob / like / similar to` broken”
- Status: Open, reproduced
- Why it matters: This touches SQL ergonomics and Postgres-like projection semantics for structured data. The issue shows users expect all forms of `s.*` expansion modifiers (`EXCLUDE`, `REPLACE`, `RENAME`, `SIMILAR TO`, `LIKE`) to behave consistently across nested structures.

### 4) Trigger catalog support
- PR: [#21438](https://github.com/duckdb/duckdb/pull/21438) — “Add catalog storage and introspection for CREATE TRIGGER”
- Status: Open
- Why it matters: This is a strong roadmap signal. Trigger support would deepen transactional/catalog features and move DuckDB a bit further toward broader SQL DDL completeness, especially for embedded-app scenarios.

### 5) Window function binder refactor
- PR: [#21562](https://github.com/duckdb/duckdb/pull/21562) — “Window Function Binding”
- Status: Open, ready for review
- Why it matters: The PR restructures binding for window functions and normalizes handling for `LEAD`, `LAG`, and `IGNORE/RESPECT NULLS`. This is core SQL engine work that can unlock both correctness and future feature work.

## 4. Bugs & Stability

Below are the most notable bug and stability signals from today, ranked roughly by severity.

### Critical
1. **Process crash / memory corruption in Python client**
   - Issue: [#21651](https://github.com/duckdb/duckdb/issues/21651)
   - Symptom: `"pointer being freed was not allocated"` followed by process crash
   - Severity: **Critical**
   - Notes: This is the strongest stability concern in the current batch because it suggests a native memory management bug that can terminate the client process outright.

2. **Segfault in release builds**
   - Issue: [#21623](https://github.com/duckdb/duckdb/issues/21623)
   - Status: Closed
   - Symptom: Segmentation fault in `GetSortKeyLengthRecursive`, reproducible in release/reldebug builds but not debug
   - Severity: **Critical**
   - Notes: Closure suggests the problem has likely been addressed or subsumed quickly, which is a positive sign for maintainer responsiveness.

### High
3. **Internal error converting JSON to VARIANT**
   - Issue: [#21352](https://github.com/duckdb/duckdb/issues/21352)
   - Severity: **High**
   - Notes: Hits a new type-system path and produces an internal error rather than a user-facing validation failure.

4. **Regression in v1.5.1: failed binder on complex CTE chain**
   - Issue: [#21604](https://github.com/duckdb/duckdb/issues/21604)
   - Severity: **High**
   - Notes: The report explicitly states this is a regression in `v1.5.1`, involving CTEs, window functions, `UNION ALL`, and joins. This is important because it affects realistic analytical SQL rather than edge-case syntax.

5. **Internal error: missing CTE definition**
   - Issue: [#21582](https://github.com/duckdb/duckdb/issues/21582)
   - Severity: **High**
   - Notes: Another planner/binder path failure involving macros and CTEs, reinforcing concern around complex query graph handling.

6. **Index/vector bounds internal error**
   - Issue: [#21650](https://github.com/duckdb/duckdb/issues/21650)
   - Severity: **High**
   - Notes: Likely related to the same family of complex-query planner/executor issues as [#21604](https://github.com/duckdb/duckdb/issues/21604), per reporter comment.

### Medium
7. **ASOF LEFT JOIN with empty right table returned wrong result**
   - Issue: [#21514](https://github.com/duckdb/duckdb/issues/21514)
   - Status: Closed
   - Severity: **Medium**
   - Notes: Incorrect result bug; now closed, indicating fast turnaround.

8. **Too many open files with `read_parquet` + `LIMIT`**
   - Issue: [#18831](https://github.com/duckdb/duckdb/issues/18831)
   - Severity: **Medium**
   - Notes: Suggests resource lifecycle or scan short-circuiting issues when limiting over many Parquet files.

9. **Attach string reused incorrectly across second connection**
   - Issue: [#21618](https://github.com/duckdb/duckdb/issues/21618)
   - Severity: **Medium**
   - Notes: Important for multi-connection/session correctness, especially if DuckLake or external storage attachment is involved.

10. **CSV header detection/documentation mismatch**
   - Issue: [#21653](https://github.com/duckdb/duckdb/issues/21653)
   - Severity: **Medium-Low**
   - Notes: May be either behavior bug or docs bug, but it impacts import predictability.

### Relevant fix PRs nearby
- [#21644](https://github.com/duckdb/duckdb/pull/21644) fixes a crash in `Vector::Resize` for `STRUCT` types.
- [#21646](https://github.com/duckdb/duckdb/pull/21646) downgrades a Parquet encrypted-file internal exception into a user-facing invalid input exception.
- [#21645](https://github.com/duckdb/duckdb/pull/21645) improves WAL recovery handling for empty checkpoint WAL files.
- [#21642](https://github.com/duckdb/duckdb/pull/21642) corrects cancellation ordering between pipelines and tasks, reducing potential scheduler/task-management fragility.

## 5. Feature Requests & Roadmap Signals

Several items hint at where DuckDB may evolve next.

### Strong roadmap signals
1. **Trigger support**
   - PR: [#21438](https://github.com/duckdb/duckdb/pull/21438)
   - Signal: High
   - Prediction: If this lands, future versions may expose fuller `CREATE TRIGGER` support with catalog introspection and persistence. This would be a notable SQL DDL expansion.

2. **Improved regular expression operator compatibility**
   - Issue: [#16830](https://github.com/duckdb/duckdb/issues/16830)
   - Issue: [#16829](https://github.com/duckdb/duckdb/issues/16829) (closed)
   - Signal: Medium
   - Prediction: DuckDB appears to be gradually moving toward broader PostgreSQL regex operator compatibility, especially around case-insensitive and operator-transform semantics.

3. **Per-query / per-connection memory governance**
   - Issue: [#21547](https://github.com/duckdb/duckdb/issues/21547) (closed)
   - Signal: Medium
   - Prediction: Even though closed, the request highlights a real need in multi-tenant embedded deployments, notebooks, and application servers. Some future work in resource governance seems plausible, though not necessarily imminent.

4. **Semi-structured data robustness (`JSON`, `VARIANT`, `STRUCT`)**
   - Issue: [#21352](https://github.com/duckdb/duckdb/issues/21352)
   - Issue: [#16787](https://github.com/duckdb/duckdb/issues/16787)
   - PR: [#21644](https://github.com/duckdb/duckdb/pull/21644)
   - Signal: High
   - Prediction: Expect continued investment in nested type support and SQL ergonomics around structured/semi-structured analytics in upcoming releases.

### Likely next-version candidates
Based on readiness and current pace, the most plausible near-term inclusions are:
- shell/CLI improvements from [#21552](https://github.com/duckdb/duckdb/pull/21552) and [#21615](https://github.com/duckdb/duckdb/pull/21615)
- stability improvements in vector internals and task cancellation from [#21644](https://github.com/duckdb/duckdb/pull/21644) and [#21642](https://github.com/duckdb/duckdb/pull/21642)
- ingestion and recovery fixes from [#21646](https://github.com/duckdb/duckdb/pull/21646) and [#21645](https://github.com/duckdb/duckdb/pull/21645)

## 6. User Feedback Summary

The latest user feedback reveals a few consistent pain points:

- **Reliability under complex analytical SQL** remains a top concern. Multiple reports involve complex CTEs, macros, window functions, and joins causing internal errors or regressions, especially in `v1.5.1`—see [#21604](https://github.com/duckdb/duckdb/issues/21604), [#21582](https://github.com/duckdb/duckdb/issues/21582), and [#21650](https://github.com/duckdb/duckdb/issues/21650).
- **Embedded Python usage still exposes low-level engine failures** in some cases, with outright crashes reported in [#21651](https://github.com/duckdb/duckdb/issues/21651). That is especially painful because many DuckDB users rely on Python as the primary interface.
- **Semi-structured and nested data workflows are in demand**, but users expect them to be production-stable. The JSON→VARIANT path in [#21352](https://github.com/duckdb/duckdb/issues/21352) shows adoption is moving beyond flat SQL tables.
- **Documentation/behavior mismatches matter** for practical adoption, as seen in CSV header handling [#21653](https://github.com/duckdb/duckdb/issues/21653) and regex/documentation-related tickets [#16830](https://github.com/duckdb/duckdb/issues/16830), [#18831](https://github.com/duckdb/duckdb/issues/18831).
- **Users continue to value SQL compatibility with PostgreSQL-like semantics**, especially around regex operators and struct projection behavior.

Overall sentiment from these reports is not about performance dissatisfaction; it is more about **correctness, predictability, and edge-case robustness** as users push DuckDB into richer SQL and embedded production scenarios.

## 7. Backlog Watch

These older or persistent items look important enough to merit maintainer attention:

1. **Memory limit prevents UDF completion**
   - Issue: [#16359](https://github.com/duckdb/duckdb/issues/16359)
   - Why watch: Long-running and under review; touches core execution/memory-governance semantics important for Python/UDF users.

2. **Too many open files with `read_parquet` and `LIMIT`**
   - Issue: [#18831](https://github.com/duckdb/duckdb/issues/18831)
   - Why watch: A practical production issue for data lake workloads over many files; has user reactions and documentation tag.

3. **`struct.* glob/like/similar to` broken**
   - Issue: [#16787](https://github.com/duckdb/duckdb/issues/16787)
   - Why watch: Longstanding SQL ergonomics/correctness issue affecting nested schema usability.

4. **Build error with unity disabled**
   - Issue: [#16819](https://github.com/duckdb/duckdb/issues/16819)
   - Why watch: Important for contributors and tooling users who need compile commands or non-unity builds.

5. **Regex operator transformation semantics**
   - Issue: [#16830](https://github.com/duckdb/duckdb/issues/16830)
   - Why watch: Low-comment but high compatibility value, especially for users porting PostgreSQL SQL.

6. **Trigger catalog PR waiting in review**
   - PR: [#21438](https://github.com/duckdb/duckdb/pull/21438)
   - Why watch: Potentially significant feature expansion; deserves maintainer review bandwidth if trigger support is on the roadmap.

---

## Overall Health Assessment

DuckDB appears **healthy and highly active**, with rapid PR throughput and visible attention to correctness, platform polish, and CI quality. The main risk area right now is **stability around complex query planning/binding and newer nested/semi-structured data paths**, plus a few concerning native crash reports. The absence of a release today, combined with many branch and fix-oriented PRs, suggests the project is in a **tightening/stabilization phase** where maintainers are actively reducing regressions while still pushing forward on larger SQL features like triggers and window-binding refactors.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-27

## 1) Today’s Overview

StarRocks showed **very high delivery activity** over the last 24 hours, with **160 PR updates** and **109 PRs merged/closed**, versus a lighter but still meaningful **11 issue updates**. The development pattern suggests a project in an active stabilization-and-iteration phase: many changes are landing across observability, external catalog support, optimizer/runtime behavior, and documentation/backports. There were **no new releases**, so today’s signal is mostly from mainline engineering throughput rather than packaged distribution milestones. Overall project health looks **strong on velocity**, but several newly reported regressions around **Iceberg V3**, **timezone conversion correctness**, and **metadata/query compatibility edge cases** deserve attention.

## 3) Project Progress

### Query engine and optimizer progress
Several merged/closed PRs indicate continued work on query execution efficiency and SQL plan quality.

- **Deferred projection after TopN** was merged in mainline, an optimizer/runtime improvement that can reduce expression evaluation overhead for `project -> topn` query shapes: [PR #58345](https://github.com/StarRocks/starrocks/pull/58345).  
  - This was also backported via [PR #70879](https://github.com/StarRocks/starrocks/pull/70879).  
  - Practical impact: lower CPU cost for limited ordered queries where expensive expressions can be postponed until after row reduction.

### Storage and internal observability
A number of changes improved introspection into storage behavior, especially for cloud-native/shared-data PK paths.

- **PK index SST statistics added to `be_tablet_write_log`**: [PR #69860](https://github.com/StarRocks/starrocks/pull/69860), with backport tracked in [PR #70863](https://github.com/StarRocks/starrocks/pull/70863).  
  - This improves visibility into SST file generation during load, compaction, and publish phases.
  - Strong signal that StarRocks is continuing to invest in **operability of primary key tables in shared-data mode**.

- **Iceberg metadata table query metric added**: [PR #70825](https://github.com/StarRocks/starrocks/pull/70825), plus backports [#70880](https://github.com/StarRocks/starrocks/pull/70880), [#70881](https://github.com/StarRocks/starrocks/pull/70881), and [#70882](https://github.com/StarRocks/starrocks/pull/70882).  
  - This expands observability for external-table workloads and reflects user demand to distinguish metadata-heavy lakehouse activity from normal SQL workload.

### SQL compatibility and DDL correctness
- **LIST partition SQL generation fix** remains open but active: [PR #70841](https://github.com/StarRocks/starrocks/pull/70841).  
  - The work addresses incorrect generated syntax and adds coverage for multi-level expression partitions in `CREATE TABLE LIKE`.
  - This is a classic “DDL round-trip correctness” area that matters for schema management tools and migration flows.

### Toolchain and dependency movement
StarRocks also had several infra/tooling PRs updated or closed, suggesting platform modernization work:

- **Bump Hadoop to v3.4.3**: [PR #70873](https://github.com/StarRocks/starrocks/pull/70873)  
- **Bump BE thrift from v0.20 to v0.22**: [PR #70822](https://github.com/StarRocks/starrocks/pull/70822)

These upgrades are not user-facing features by themselves, but they are important signals for long-term connector compatibility, security posture, and ecosystem alignment.

## 4) Community Hot Topics

### 1. ClickHouse compatibility as a federated query engine
- **Issue: Support Query ClickHouse AggregatingMergeTree Engine Table**: [#53950](https://github.com/StarRocks/starrocks/issues/53950)

This is the most discussed issue in the visible issue list today. The underlying technical need is clear: users want StarRocks to serve as a **unified query layer** across heterogeneous engines, not just a standalone OLAP store. In this case, the gap is around querying ClickHouse materialized-view-style storage semantics, especially `AggregatingMergeTree`. This points to a broader roadmap demand: **deeper semantic compatibility for external engines**, not just table access.

### 2. External catalog pushdown, especially JDBC
- **Feature roadmap for JDBC Catalog**: [Issue #70852](https://github.com/StarRocks/starrocks/issues/70852)  
- **JDBC Catalog can push down join**: [Issue #70813](https://github.com/StarRocks/starrocks/issues/70813)

These two issues together are one of today’s strongest roadmap signals. Users are asking StarRocks to behave more like a **federated optimizer**, pushing down joins, aggregations, TopN, and ordering to remote systems. The need is both performance and cost driven: reduce data movement, preserve remote index advantages, and avoid overusing StarRocks CPU/memory for work the source DB can do natively.

### 3. Enterprise governance and security docs
- **Ranger tag-based access control docs/tests**: [PR #70883](https://github.com/StarRocks/starrocks/pull/70883)

This open doc PR is notable because it highlights that the Ranger plugin already supports **tag-based policies** through the Apache Ranger SDK, but the capability is under-documented. The underlying need is enterprise readiness: centralized policy administration, data-domain tagging, and clearer governance integration guidance.

### 4. Memory observability
- **Proposal: Controllable and Precise Memory Statistics System**: [Issue #69128](https://github.com/StarRocks/starrocks/issues/69128)

This is an important architectural discussion. The request reflects a persistent operator pain point in analytical engines: diagnosing OOM, leaks, and “mystery memory” is still difficult with coarse trackers. This proposal suggests demand for a **more structured memory telemetry model**, likely spanning query, operator, subsystem, and allocator layers.

## 5) Bugs & Stability

Ranked by likely severity and user impact:

### Critical
1. **Regression in 4.0.8: Iceberg V3 tables stopped working**
   - [Issue #70860](https://github.com/StarRocks/starrocks/issues/70860)
   - Severity: **Critical**
   - Impact: complete inability to read Iceberg V3 tables after upgrade to 4.0.8; rollback to 4.0.6 restores behavior.
   - Why it matters: this is a **backward-incompatible upgrade regression** on a major lakehouse integration path.
   - Fix PR visible today: **none directly linked** in the supplied data.

### High
2. **`CONVERT_TZ` returns NULL for `Africa/Casablanca` and `Africa/El_Aaiun` on column execution path**
   - [Issue #70671](https://github.com/StarRocks/starrocks/issues/70671)
   - Severity: **High**
   - Impact: query correctness bug affecting BE path execution for table columns, while FE constant-folded literals still work.
   - Root cause hypothesis in report: `cctz v2.3` parsing limitation for year-round DST POSIX TZ strings.
   - Why it matters: silent `NULL` generation in timezone conversion is a serious correctness problem for analytics and ETL.

3. **CN crash when scanning empty tablet with physical split enabled**
   - [Issue #70280](https://github.com/StarRocks/starrocks/issues/70280) — **closed**
   - Severity: **High**
   - Impact: crash in shared-data mode when an empty tablet is scanned under a specific physical split path.
   - Status: appears fixed/closed today, which is a positive stability signal.

### Medium
4. **SemanticException for columns containing dots in `getQueryStatisticsColumnType`**
   - [Issue #70810](https://github.com/StarRocks/starrocks/issues/70810)
   - Severity: **Medium**
   - Impact: breaks metadata/statistics handling for unusual but valid quoted identifiers such as ``customer.is_verified_email``.
   - Why it matters: SQL compatibility edge case, especially relevant in migration or BI-generated schemas.

5. **Storage volume creation should validate connectivity and AK/SK**
   - [Issue #70848](https://github.com/StarRocks/starrocks/issues/70848)
   - Severity: **Medium**
   - Impact: today this is framed as enhancement, but operationally it prevents avoidable misconfiguration and opaque failures.
   - Why it matters: this is a classic cloud-storage UX and diagnosability gap.

### Security / dependency risk
6. **CVE report for ZooKeeper dependency**
   - [Issue #70859](https://github.com/StarRocks/starrocks/issues/70859)
   - Severity: **Medium to High**, depending on deployment exposure
   - Impact: dependency remediation required; report references vulnerable `org.apache.zookeeper:zookeeper` version and fixed versions.
   - Visible fix PR today: none directly linked.

### Recently resolved stability issue
7. **TVR misclassifying Iceberg REPLACE operations as retractable**
   - [Issue #67032](https://github.com/StarRocks/starrocks/issues/67032) — **closed**
   - Impact: blocked incremental MV refresh for Iceberg tables under compaction/REPLACE operations.
   - Significance: important for users relying on **incremental materialized view maintenance over Iceberg**.

## 6) Feature Requests & Roadmap Signals

### Strongest roadmap signals

#### Federated query pushdown for JDBC catalogs
- [Issue #70852](https://github.com/StarRocks/starrocks/issues/70852)
- [Issue #70813](https://github.com/StarRocks/starrocks/issues/70813)

This is the clearest near-term feature direction from user feedback. Pushdown for **join, aggregation, TopN, ORDER BY**, and even **native passthrough query functions** would materially improve StarRocks’ role as a semantic/federated acceleration layer. Given the specificity of the request and alignment with current product direction, some form of **expanded JDBC pushdown seems plausible in an upcoming 4.x release**.

#### More precise memory diagnostics
- [Issue #69128](https://github.com/StarRocks/starrocks/issues/69128)

This feels more like a medium-term engineering initiative than a quick feature. If adopted, it could show up first as **new metrics, tracker refactors, or memory breakdown views** rather than a single headline feature.

#### ClickHouse semantic support
- [Issue #53950](https://github.com/StarRocks/starrocks/issues/53950)

Support for querying **ClickHouse `AggregatingMergeTree`** tables is strategically significant if StarRocks wants deeper traction as a cross-engine query layer. This is probably harder than generic connector work because it involves engine-specific merge semantics. It is important, but likely **less immediate than JDBC pushdown**.

#### Better external query observability
- [PR #70533](https://github.com/StarRocks/starrocks/pull/70533)

Open work on **per-catalog-type query metrics** pairs well with today’s merged Iceberg metadata metric PR. This suggests StarRocks may soon expose richer observability for mixed internal/external workloads.

### Features likely to land soon
Most likely in next version family:
1. **Expanded JDBC pushdown**
2. **More external catalog/query metrics**
3. **Operational observability for shared-data PK paths**
4. **Additional schema evolution improvements**, as seen in [PR #70747](https://github.com/StarRocks/starrocks/pull/70747) for fast `VARCHAR` widening in shared-data mode

## 7) User Feedback Summary

Today’s feedback shows a few recurring user themes:

- **StarRocks as a unified query plane**: users are increasingly using it to query external systems rather than only storing data natively. This is evident in requests around ClickHouse compatibility [#53950](https://github.com/StarRocks/starrocks/issues/53950), JDBC pushdown [#70852](https://github.com/StarRocks/starrocks/issues/70852), and Iceberg auth/catalog behavior [PR #61748](https://github.com/StarRocks/starrocks/pull/61748).
- **Upgrade safety matters**: the Iceberg V3 regression in 4.0.8 [#70860](https://github.com/StarRocks/starrocks/issues/70860) is exactly the kind of issue that can erode confidence in minor upgrades for production lakehouse users.
- **Operators want better diagnostics**: memory introspection [#69128](https://github.com/StarRocks/starrocks/issues/69128), storage volume parameter validation [#70848](https://github.com/StarRocks/starrocks/issues/70848), and richer metrics [#70533](https://github.com/StarRocks/starrocks/pull/70533) all point to a need for easier troubleshooting.
- **SQL and metadata edge cases still surface**: timezone conversion correctness [#70671](https://github.com/StarRocks/starrocks/issues/70671), quoted identifiers with dots [#70810](https://github.com/StarRocks/starrocks/issues/70810), and list partition SQL generation [PR #70841](https://github.com/StarRocks/starrocks/pull/70841) indicate continued pressure from real-world compatibility scenarios.

In short, users appear satisfied with StarRocks’ breadth and pace, but they are pushing it deeper into **federation, lakehouse interoperability, and enterprise operations**, where correctness and observability become just as important as raw performance.

## 8) Backlog Watch

These items look important and likely need maintainer attention due to age, scope, or strategic relevance:

### Long-running open PRs
- **OAuth2 scope duplication fix for Iceberg REST catalog auth**: [PR #61748](https://github.com/StarRocks/starrocks/pull/61748)  
  - Open since 2025-08-09.
  - Important for interoperability with OAuth2-enabled Iceberg REST catalogs such as Polaris.
  - This appears strategically relevant given StarRocks’ lakehouse direction.

- **Unified cloud-native table drop process with partition**: [PR #68434](https://github.com/StarRocks/starrocks/pull/68434)  
  - Open since 2026-01-26.
  - Important for deletion/recycle-bin behavior in lake/shared-data deployments.

- **Per-catalog-type query metrics for external observability**: [PR #70533](https://github.com/StarRocks/starrocks/pull/70533)  
  - Good alignment with active user pain around external workload visibility.

### Older or strategically important issues
- **ClickHouse `AggregatingMergeTree` query support**: [Issue #53950](https://github.com/StarRocks/starrocks/issues/53950)  
  - Open since 2024-12-15.
  - Strong strategic relevance for StarRocks as a federated query engine.

- **Memory statistics system proposal**: [Issue #69128](https://github.com/StarRocks/starrocks/issues/69128)  
  - No comments yet despite high operational relevance.
  - Worth maintainer response to shape scope and expected milestones.

## Bottom Line

StarRocks had a **high-throughput engineering day** with meaningful progress in optimizer behavior, observability, and shared-data internals. The strongest strategic momentum remains around **external catalogs, federated execution, and operational telemetry**. The main risk area today is **compatibility and regression management**, especially for **Iceberg V3 on 4.0.8** and correctness issues like timezone conversion. Project health remains positive, but these regressions should be prioritized to preserve confidence among production lakehouse users.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-27

## 1) Today's Overview
Apache Iceberg remained highly active over the last 24 hours, with **47 PR updates** and **9 issue updates**, indicating strong ongoing development and review throughput. Most activity clustered around **Spark**, **Flink**, **core schema behavior**, **AWS integrations**, and **docs/build hygiene**. There were **no new releases**, so today’s signal is more about incremental engineering progress than packaged delivery. Overall project health looks solid: maintainers and contributors are actively iterating on correctness fixes, engine compatibility, and infrastructure hardening, though several user-reported bugs around Spark views, Z-order rewrites, and schema path resolution deserve close attention.

## 2) Project Progress
Merged/closed PR activity today was modest but still showed movement in test hygiene and stale backlog pruning.

### Closed / merged PRs of note
- [#15765 Spark: test cleanup - eliminate unnecessary table refreshes](https://github.com/apache/iceberg/pull/15765)  
  This cleanup improves Spark test correctness and reduces redundant refresh behavior in test flows where writes happen through DataFrame APIs. While not a user-facing feature, it helps stabilize Spark maintenance and lowers noise around table state handling.

- [#15266 Fix(site): improve homepage responsiveness on smaller screens](https://github.com/apache/iceberg/pull/15266) — closed  
  Documentation/site UX work was closed out, reflecting continued attention to public-facing polish, though this does not materially change engine behavior.

- [#15252 API: Improve StrictMetricsEvaluator handling of missing columns using maxFieldId](https://github.com/apache/iceberg/pull/15252) — closed  
  This was aimed at schema-evolution-aware metrics evaluation, a potentially important correctness/performance topic for file pruning after schema changes. Since it closed rather than landing today, the underlying need remains relevant.

- [#14816 Decouple control topic processing from record poll loop – improve throughput & reliability](https://github.com/apache/iceberg/pull/14816) — closed  
  The Kafka Connect backlog continues to see churn. The closure suggests this reliability/performance idea did not advance to merge in its current form.

### Net progress assessment
Today’s closed work advanced:
- **Spark test reliability**
- **project website/docs polish**
- continued triage of older **API** and **Kafka Connect** proposals

The more meaningful product progress is still in-flight in open PRs, especially around **Flink sink metadata propagation**, **ORC lineage support**, **schema fixes**, and **Spark reader performance**.

## 3) Community Hot Topics
The most meaningful discussion topics today reveal user demand for better correctness, observability, and engine interoperability.

### Most active issues / questions
- [#11440 Unsupported Spark Creating Views Operation for s3_catalog](https://github.com/apache/iceberg/issues/11440)  
  A long-running Spark catalog/view compatibility question with 8 comments. This reflects persistent confusion around what kinds of **view DDL operations** Iceberg-backed catalogs should support, especially in Spark.

- [#14198 Using SPJ when merge contains both match and not matched](https://github.com/apache/iceberg/issues/14198)  
  This highlights **Spark UPSERT/MERGE performance** under skewed data, specifically when **Partially Clustered Joins (SPJ)** interact with `WHEN MATCHED` and `WHEN NOT MATCHED`. The technical need is clear: users want better optimization guidance and possibly engine-aware planning behavior for mixed-branch MERGE workloads.

- [#15754 Is `write.target-file-size-bytes` including compression or not?](https://github.com/apache/iceberg/issues/15754)  
  A small question but an important one operationally. It points to a practical gap in documentation around **file sizing semantics**, compaction expectations, and how compression affects write planning.

### Most strategically important PRs in motion
- [#15784 Flink Sink: Add WriteObserver plugin interface for per-record metadata](https://github.com/apache/iceberg/pull/15784)  
  This is one of the clearest roadmap signals today. It adds a plugin path for collecting **per-record metadata** and surfacing it into **snapshot summaries**, indicating growing user demand for richer write-time observability and lineage.

- [#15776 ORC: Add `_row_id` and `_last_updated_sequence_number` reader in ORC to support lineage](https://github.com/apache/iceberg/pull/15776)  
  Important for **V3 table lineage parity** across file formats. This points to Iceberg maturing metadata/lineage support beyond Parquet and Avro.

- [#15341 Spark: Make Spark readers function asynchronously for many small files](https://github.com/apache/iceberg/pull/15341)  
  A notable performance-oriented effort targeting one of Iceberg’s classic workload pain points: **small-file-heavy scans**.

- [#15049 API, Core: Introduce foundational types for V4 manifest support](https://github.com/apache/iceberg/pull/15049)  
  This is a long-horizon architectural signal. Work on **V4 manifests** and adaptive metadata structures suggests ongoing investment in Iceberg’s metadata scalability.

## 4) Bugs & Stability
Ranked by likely severity and user impact based on today’s issue stream:

### High severity
1. [#15779 Spark: Iceberg views are not created as views and are appearing as tables](https://github.com/apache/iceberg/issues/15779)  
   **Impact:** SQL object correctness / catalog semantics.  
   Users creating views through Spark on hive-type catalogs may end up with objects materialized or surfaced incorrectly as tables. This is a significant interoperability and governance issue because it affects object type semantics.  
   **Fix PR:** none linked yet.

2. [#15777 Spark: Z-order rewrite fails for TimestampNTZ columns in `rewrite_data_files`](https://github.com/apache/iceberg/issues/15777)  
   **Impact:** maintenance/optimization failure for Spark tables using `TimestampNTZ`.  
   This breaks a data layout optimization workflow and suggests a type-support gap in Spark Z-ordering logic.  
   **Fix PR:** none linked yet.

3. [#15785 Core: Map struct key fields not accessible via short names](https://github.com/apache/iceberg/issues/15785)  
   **Impact:** schema resolution correctness.  
   This is a core API/schema bug that can affect engines or tooling relying on `Schema.findField(String)` for nested access paths.  
   **Fix PR exists:** [#15786](https://github.com/apache/iceberg/pull/15786).

### Medium severity
4. [#15774 Flink quickstart MinIO image defaults break on arm64](https://github.com/apache/iceberg/issues/15774)  
   **Impact:** onboarding / local developer experience.  
   Not a core runtime failure, but it blocks quickstart users on Apple Silicon/arm64.  
   **Related docs fix PR:** [#15772](https://github.com/apache/iceberg/pull/15772), though this appears broader than a direct MinIO image fix.

5. [#15172 RewriteTablePathUtil.relativize() fails when path equals prefix](https://github.com/apache/iceberg/issues/15172) — closed  
   **Impact:** table path rewrite utility edge case.  
   This was a concrete bug in path rewriting behavior and is now closed, which is a positive stability signal.

### Lower severity / operational clarity
6. [#15754 `write.target-file-size-bytes` and compression semantics](https://github.com/apache/iceberg/issues/15754)  
   **Impact:** tuning ambiguity rather than software failure.  
   Still important because misunderstanding file-size targets can lead to poor compaction outcomes and suboptimal query performance.

## 5) Feature Requests & Roadmap Signals
Today’s feature requests and active PRs suggest where Iceberg may evolve next.

### Strong signals
- [#15783 Flink Sink: Add WriteObserver plugin interface for per-record metadata](https://github.com/apache/iceberg/issues/15783)  
  Paired with active implementation [#15784](https://github.com/apache/iceberg/pull/15784), this looks like a plausible candidate for a near-term release if review proceeds smoothly. It addresses observability, metadata enrichment, and downstream lineage use cases.

- [#15776 ORC lineage reader support](https://github.com/apache/iceberg/pull/15776)  
  Extending V3 lineage support to ORC is a strong roadmap indicator toward **feature parity across file formats**.

- [#15304 Enable to configure metrics-publisher in AWS client factory](https://github.com/apache/iceberg/pull/15304)  
  This indicates demand for **AWS client observability/configurability**, likely from production operators with strict telemetry requirements.

- [#15242 AWS: Add chunked encoding configuration for S3 requests](https://github.com/apache/iceberg/pull/15242)  
  Suggests real-world deployment friction with S3-compatible stores, proxies, or network layers. This kind of configurability often makes it into releases because it unlocks more environments.

- [#15049 V4 manifest foundations](https://github.com/apache/iceberg/pull/15049)  
  Longer-term, but strategically important. Not likely to surface fully in the very next release, yet it signals metadata-layer evolution is actively being prepared.

### Likely next-version candidates
Most likely to appear soon, based on maturity and direct user need:
1. **Core schema bug fix** for map struct key short-name resolution — [#15786](https://github.com/apache/iceberg/pull/15786)  
2. **Flink sink metadata/observer extension** — [#15784](https://github.com/apache/iceberg/pull/15784)  
3. **ORC lineage support for V3 tables** — [#15776](https://github.com/apache/iceberg/pull/15776)  
4. **Flink docs/quickstart corrections** — [#15772](https://github.com/apache/iceberg/pull/15772)

## 6) User Feedback Summary
Several clear user pain points emerged today:

- **Spark SQL compatibility remains a friction point**, especially around **views** and advanced **MERGE/UPSERT optimization**. Users expect Iceberg catalogs to behave consistently with Spark SQL semantics and want better performance under skewed merge workloads.
- **Operational tuning guidance is still too implicit**. Questions like [#15754](https://github.com/apache/iceberg/issues/15754) show users need more precise documentation around file sizing, compression, and write planning.
- **Onboarding on non-x86 environments needs work**, as seen in the arm64 MinIO quickstart issue [#15774](https://github.com/apache/iceberg/issues/15774).
- **Schema and nested-field resolution correctness matters to advanced users and integrators**, evidenced by [#15785](https://github.com/apache/iceberg/issues/15785), where subtle API behavior differences can break downstream tooling.
- There is also strong interest in **write-time metadata, lineage, and observability**, particularly in Flink and ORC-related work.

Overall, user sentiment implied by the issue set is not broadly negative; rather, it shows a maturing project where users are pushing into more advanced production and interoperability scenarios.

## 7) Backlog Watch
These older or strategically important items appear to need continued maintainer attention:

- [#14198 Using SPJ when merge contains both match and not matched](https://github.com/apache/iceberg/issues/14198)  
  Open and marked stale, but highly relevant for large-scale Spark upsert workloads. Performance guidance or planner limitations here could affect important production users.

- [#15341 Spark: Make Spark readers function asynchronously for many small files](https://github.com/apache/iceberg/pull/15341)  
  A meaningful performance enhancement that could materially improve scan efficiency in small-file-heavy datasets. Worth watching closely.

- [#15049 API, Core: Introduce foundational types for V4 manifest support](https://github.com/apache/iceberg/pull/15049)  
  Long-lived and foundational. This kind of architectural work can stall without steady maintainer bandwidth but has outsized long-term value.

- [#15304 Enable to configure metrics-publisher in AWS client factory](https://github.com/apache/iceberg/pull/15304)  
  Production operators often need this sort of extensibility; prolonged delay could keep observability gaps open for AWS users.

- [#15043 Build: Switch Jetty to use new Compression API for GZIP](https://github.com/apache/iceberg/pull/15043)  
  Dependency modernization work is easy to defer but important for keeping the build and embedded services current.

## 8) Project Health Assessment
Apache Iceberg appears **healthy and actively maintained**, with strong contributor velocity and broad subsystem coverage. Today’s activity shows the project balancing **short-term correctness fixes** with **medium-term engine and metadata evolution**. The most immediate risks are around **Spark object semantics**, **type-support edge cases**, and **docs/onboarding gaps**, but there are also encouraging signs of forward motion in **lineage**, **Flink extensibility**, and **metadata architecture**.

If you want, I can also turn this into a **short executive summary**, **newsletter format**, or **JSON-ready daily digest schema**.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-27

## 1. Today's Overview

Delta Lake showed **high pull request throughput** over the last 24 hours, with **50 PRs updated** and an even split between **25 open** and **25 merged/closed**, while issue traffic remained light at **3 active issues** and **no closures**. The activity pattern suggests a project in an **implementation-heavy phase**, especially around Spark SQL DDL infrastructure, Delta Kernel, Unity Catalog integration, CI hardening, and ecosystem connectors such as Flink and Sharing. There were **no new releases**, so today’s signal is more about **ongoing engineering progress** than packaged user-facing delivery. Overall, project health looks **active and operationally busy**, with maintainers landing a large batch of infrastructure and integration work, though several user-facing documentation and API ergonomics gaps remain open.

## 2. Project Progress

Today’s merged/closed PRs indicate progress in four main areas: **Unity Catalog integration**, **streaming/kernel correctness**, **test/CI robustness**, and **release/version maintenance**.

### A. Unity Catalog / DSv2 / staged operations
Several closed PRs point to ongoing work to improve Delta’s integration with Unity Catalog and Data Source V2 style table operations:

- [#6251 Add UC staged replace handoff support](https://github.com/delta-io/delta/pull/6251)  
- [#6252 Pin Unity Catalog commit for CI](https://github.com/delta-io/delta/pull/6252)  
- [#6312 Revert "Test UC OSS main in UC workflow"](https://github.com/delta-io/delta/pull/6312)

These changes suggest active stabilization of **catalog-managed atomic table replacement flows** and the CI matrix around UC dependencies. For users, this is a roadmap signal that Delta is continuing to invest in **catalog-native table lifecycle operations**, an important area for enterprise governance and interoperable SQL engines.

### B. Kernel and streaming correctness / race-condition hardening
A cluster of closed PRs suggests maintainers are addressing correctness hazards in log iteration, retries, and staged commit visibility:

- [#5871 Kernel Race Condition Fix for Backfilled Commits](https://github.com/delta-io/delta/pull/5871)  
- [#5882 UC Streaming Reads Test with Kernel Retry Fix](https://github.com/delta-io/delta/pull/5882)  
- [#5892 Race Condition Test for Iterator vs Staged Commits Deletion](https://github.com/delta-io/delta/pull/5892)  
- [#5833 Add E2E Test for Streaming Reads using UC Test Framework](https://github.com/delta-io/delta/pull/5833)

This is meaningful for analytical engine users because **transaction log concurrency correctness** is one of the hardest parts of lakehouse operation. Even when some of these PRs are test-oriented, they usually imply prior or anticipated bugs in **streaming reads, retry semantics, and commit visibility** under concurrent workloads.

### C. Auth and long-running session stability
Closed Spark-oriented tests around token refresh also show attention to production-readiness for governed environments:

- [#5857 [Spark] Long running CCv2 + DSv2 token refresh test](https://github.com/delta-io/delta/pull/5857)  
- [#5850 [Spark] E2E CCv2 + DSv2 Token Refresh Streaming test](https://github.com/delta-io/delta/pull/5850)

This work advances **operational SQL compatibility in secure environments**, particularly for long-lived streaming and DSv2 catalog sessions where credential refresh failures often become a hidden source of instability.

### D. CI scaling and release train upkeep
A few closed PRs were clearly about operational velocity rather than features:

- [#6125 [INFRA] Increase shards from 4 to 8](https://github.com/delta-io/delta/pull/6125)  
- [#5806 Setting version to 4.0.1](https://github.com/delta-io/delta/pull/5806)  
- [#5816 Delta 4.0.1 settings](https://github.com/delta-io/delta/pull/5816)  
- [#5807 Setting version to 4.0.2-SNAPSHOT](https://github.com/delta-io/delta/pull/5807)

These indicate maintainers are still improving build throughput and managing the **4.0.x line**, but no new packaged release was published today.

### E. Key open work in flight
Important open PRs point to near-term feature direction:

- [#6377 Add DDLContext POJO and prerequisite infra for DSv2 CREATE TABLE](https://github.com/delta-io/delta/pull/6377)  
- [#6360 [ServerSidePlanning] Add OAuth support](https://github.com/delta-io/delta/pull/6360)  
- [#6324 [RFC] for compression setting](https://github.com/delta-io/delta/pull/6324)  
- [#6301 [Kernel] Geospatial stats parsing: handle geometry/geography as WKT strings](https://github.com/delta-io/delta/pull/6301)  
- [#6392 DeltaFormatSharingSource only finish current version when startOffset is from Legacy](https://github.com/delta-io/delta/pull/6392)  
- [#6162 [delta-metadata] [Spark] Remove path transformation from Snapshot](https://github.com/delta-io/delta/pull/6162)  
- [#6404 Fix: typo in delta-spark-connect documentation](https://github.com/delta-io/delta/pull/6404)

Collectively these suggest active work on **DDL modernization**, **server-side planning/authentication**, **protocol/storage tuning**, **geospatial metadata support**, and **streaming/sharing semantics**.

## 3. Community Hot Topics

Because comment counts were mostly unavailable in the supplied PR data, the strongest “hot topic” signals come from issue themes and strategically important open PRs rather than raw discussion volume.

### 1) Delta Kernel API ergonomics for missing start versions
- [#6380 startVersionNotFound should throw a structured exception exposing earliestAvailableVersion](https://github.com/delta-io/delta/issues/6380)

This feature request highlights a real integration pain point: **machine-readable error handling**. If earliest available version is only embedded in a string message, downstream engines and connectors cannot reliably build retry/recovery logic. The underlying technical need is better **structured exception contracts** for replay/resume semantics, especially relevant for connectors, CDC-style readers, and stream recovery tooling.

### 2) Flink sink built on Delta Kernel
- [#5901 [Flink] Create Delta Kernel based Flink Sink](https://github.com/delta-io/delta/issues/5901)

This epic remains an important roadmap signal. It reflects demand for a **connector architecture centered on Delta Kernel**, likely to reduce duplication and align semantics across engines. For OLAP and streaming analysts, this is strategically important: it points toward a future where Delta write paths become more portable across Spark and Flink, improving **multi-engine consistency**.

### 3) DSv2 CREATE TABLE foundations
- [#6377 Add DDLContext POJO and prerequisite infra for DSv2 CREATE TABLE](https://github.com/delta-io/delta/pull/6377)

This is a core SQL engine compatibility topic. The technical need here is stronger **table DDL abstraction** and cleaner wiring for modern Spark DSv2 flows. If merged, it likely enables broader CREATE TABLE parity and more maintainable support for catalog-aware SQL semantics.

### 4) Protocol-level compression RFC
- [#6324 [RFC] for compression setting](https://github.com/delta-io/delta/pull/6324)

A protocol RFC signals a potentially user-visible discussion about **Parquet compression controls**. This usually reflects demand for more explicit tradeoff management between **storage footprint, CPU cost, and scan efficiency**.

### 5) OAuth for server-side planning
- [#6360 [ServerSidePlanning] Add OAuth support](https://github.com/delta-io/delta/pull/6360)

The need here is clear: moving from static bearer tokens to **per-request OAuth token supply** for production governance and service-to-service authentication. This is a strong enterprise-readiness signal, especially for managed catalog and planning services.

## 4. Bugs & Stability

Ranked by likely user impact based on the supplied data.

### High severity
#### A. Structured error deficiency in Kernel start-version lookup
- [#6380](https://github.com/delta-io/delta/issues/6380)

While filed as an enhancement, this can function like a **stability and operability bug** for downstream systems. If a reader cannot programmatically recover when a requested start version has been vacuumed or is unavailable, production jobs may fail in ways that are hard to remediate automatically.  
**Fix PR found today?** None in provided data.

### Medium severity
#### B. Documentation bug around `withEventTimeOrder`
- [#2748 [BUG][Documentation] withEventTimeOrder not available, confusing user experience](https://github.com/delta-io/delta/issues/2748)

This is a documentation correctness issue, but the impact is practical: users may attempt to rely on an option advertised in docs but unavailable in a given context. That creates wasted debugging time and could lead to incorrect assumptions about streaming/event-time semantics.  
**Fix PR found today?** Possibly related documentation churn exists, but no direct fix PR is identified in the provided data. A minor docs PR exists:
- [#6404 Fix: typo in delta-spark-connect documentation](https://github.com/delta-io/delta/pull/6404)

#### C. Sharing source offset/version completion behavior
- [#6392 DeltaFormatSharingSource only finish current version when startOffset is from Legacy](https://github.com/delta-io/delta/pull/6392)

This open PR appears to address potentially subtle streaming or ingestion correctness around **offset handling and version completion** in Delta Sharing. Such bugs can affect duplicate processing, incomplete version consumption, or unexpected stream boundaries.  
**Fix PR status:** Open.

### Lower but important severity
#### D. Snapshot path transformation behavior in Spark metadata layer
- [#6162 [Spark] Remove path transformation from Snapshot](https://github.com/delta-io/delta/pull/6162)

This looks like a correctness/compatibility cleanup. Path rewriting bugs can surface as **mismatched file references**, confusing metadata behavior, or incompatibility with external storage conventions.  
**Fix PR status:** Open.

#### E. Historical kernel/streaming race-condition work landed today
Closed PRs strongly imply active attention to prior instability areas:
- [#5871](https://github.com/delta-io/delta/pull/5871)
- [#5882](https://github.com/delta-io/delta/pull/5882)
- [#5892](https://github.com/delta-io/delta/pull/5892)

These are positive signs for stability, especially in concurrent log-reading scenarios.

## 5. Feature Requests & Roadmap Signals

### Strongest roadmap signals
#### 1) Flink write support via Delta Kernel
- [#5901](https://github.com/delta-io/delta/issues/5901)

This is the clearest strategic feature request. Expect continued investment here, likely not as a tiny patch but as a multi-PR effort spanning build structure, sink semantics, commit protocol, and test coverage.

#### 2) Better structured exceptions in Kernel APIs
- [#6380](https://github.com/delta-io/delta/issues/6380)

This is likely to be adopted relatively quickly because it improves connector developer experience without requiring a large protocol redesign.

#### 3) DSv2 CREATE TABLE infrastructure
- [#6377](https://github.com/delta-io/delta/pull/6377)

This looks like foundational work that could show up in the next release train as part of broader **Spark SQL DDL compatibility**.

#### 4) Compression configuration / protocol guidance
- [#6324](https://github.com/delta-io/delta/pull/6324)

If this RFC matures, it may influence future defaults or explicit configuration surface around file compression.

#### 5) Geospatial stats parsing
- [#6301](https://github.com/delta-io/delta/pull/6301)

This is a notable signal that Delta Kernel may expand metadata/statistics handling for **geometry/geography** types, important for location analytics and advanced filtering/planning.

#### 6) OAuth-backed server-side planning
- [#6360](https://github.com/delta-io/delta/pull/6360)

This has a good chance of landing in an upcoming release because it addresses a concrete production deployment requirement.

### Likely candidates for the next version
Most likely to appear soon, based on maturity and practical scope:
1. **OAuth support for server-side planning** ([#6360](https://github.com/delta-io/delta/pull/6360))
2. **DSv2 CREATE TABLE infrastructure pieces** ([#6377](https://github.com/delta-io/delta/pull/6377))
3. **Kernel error-API improvements** from issue [#6380](https://github.com/delta-io/delta/issues/6380), if a PR follows quickly
4. **Sharing source correctness fixes** ([#6392](https://github.com/delta-io/delta/pull/6392))

Longer-horizon items:
- Full **Flink sink via Kernel** ([#5901](https://github.com/delta-io/delta/issues/5901))
- Broader **protocol compression** changes ([#6324](https://github.com/delta-io/delta/pull/6324))

## 6. User Feedback Summary

Today’s user-visible feedback clusters around three pain points.

### A. Documentation accuracy still matters
- [#2748](https://github.com/delta-io/delta/issues/2748)

Users are sensitive to docs that imply support for options not actually available in their environment. For a system like Delta, where behavior varies across Spark, Kernel, connectors, and docs versions, **capability discoverability** is critical.

### B. Connector and integration developers want machine-readable APIs
- [#6380](https://github.com/delta-io/delta/issues/6380)

The request shows that advanced users are building automation around Delta and need **structured failure metadata**, not message parsing. This is a sign of healthy ecosystem adoption but also a reminder that API polish matters for platform users.

### C. Multi-engine adoption is a real demand vector
- [#5901](https://github.com/delta-io/delta/issues/5901)

Interest in a Kernel-based Flink sink suggests users want Delta to be more than a Spark-centric format. The use case is clear: **consistent lakehouse writes across batch and streaming engines**.

### D. Enterprise auth/governance is increasingly important
- [#6360](https://github.com/delta-io/delta/pull/6360)

The shift from static tokens to OAuth-backed token supply reflects real production expectations in governed data platforms.

Overall user sentiment from the provided data is less about raw performance complaints and more about **correctness, compatibility, operability, and ecosystem breadth**.

## 7. Backlog Watch

These items appear to merit maintainer attention based on age, user impact, or strategic value.

### 1) Old documentation bug still open for over two years
- [#2748 withEventTimeOrder not available, confusing user experience](https://github.com/delta-io/delta/issues/2748)

This is not the most severe issue technically, but long-lived docs mismatches degrade trust and repeatedly cost users time. It should be easy to close with either documentation correction or clearer version scoping.

### 2) Flink sink epic is strategically important
- [#5901 Create Delta Kernel based Flink Sink](https://github.com/delta-io/delta/issues/5901)

This is a major roadmap item. It likely needs continued public progress updates, milestone tracking, and explicit scope management because it has outsized ecosystem importance.

### 3) Spark snapshot path transformation cleanup remains open
- [#6162 Remove path transformation from Snapshot](https://github.com/delta-io/delta/pull/6162)

Given the potential for metadata/path correctness issues, this open PR looks worth prioritizing.

### 4) Compression RFC needs decision momentum
- [#6324 RFC for compression setting](https://github.com/delta-io/delta/pull/6324)

Protocol-level proposals can stall if not resolved quickly. If maintainers want predictable user expectations around compression behavior, this should move toward acceptance, revision, or rejection.

### 5) Kernel exception ergonomics likely needs a fast follow-up PR
- [#6380](https://github.com/delta-io/delta/issues/6380)

This issue is new, but the ask is concrete and high leverage. A prompt fix would improve the developer experience for downstream readers and connectors.

---

## Overall Health Assessment

Delta Lake appears **healthy and highly active**, with strong engineering throughput concentrated on **integration quality, correctness testing, enterprise auth, and SQL/catalog infrastructure**. The absence of a new release means users are seeing progress mainly through PR flow rather than packaged delivery, but the underlying work suggests the project is actively strengthening its foundations for **multi-engine interoperability and governed production use**. The biggest watch items are **connector ergonomics, documentation precision, and prioritization of strategic ecosystem work such as Flink and protocol evolution**.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-27

## 1. Today's Overview
Databend showed **moderate-to-high development activity** over the last 24 hours, with **14 pull requests updated** and **no issue activity** or releases. The workstream is heavily concentrated in the **query engine**, especially around planner/binder refactors, join execution, aggregation memory behavior, and SQL semantics. There are also signs of ongoing investment in **table versioning semantics** and **index/storage efficiency**, which are important for analytical workloads. Overall, project health looks **active and engineering-led**, but with relatively little visible user-reported issue traffic today.

## 2. Project Progress

### Merged/Closed PRs today
Although no release was cut, several PRs were closed and they indicate where Databend is moving:

- **Experimental table tags for FUSE snapshots**
  - PR: [#19549](https://github.com/databendlabs/databend/pull/19549)
  - Type: Closed feature PR
  - This introduced a **new KV-backed table tag model** for FUSE table snapshots, replacing older legacy branch/tag handling. Even though this specific PR is closed, it clearly signals active work on **Git-like table versioning / data lineage primitives** for FUSE tables.
  - Related follow-up:
    - [#19551](https://github.com/databendlabs/databend/pull/19551) — open, experimental table branch support

- **Documentation/process clarification for agent workflows**
  - PR: [#19617](https://github.com/databendlabs/databend/pull/19617)
  - Type: Closed bugfix/docs-style PR
  - Not product-facing, but useful for contributor workflow consistency. It suggests the team is tightening contributor guidance and automation boundaries.

- **gRPC listener latency/network behavior improvement**
  - PR: [#19619](https://github.com/databendlabs/databend/pull/19619)
  - Type: Closed feature PR
  - Enables **`TCP_NODELAY` on gRPC listener sockets** via a `databend-meta` upgrade. This is a meaningful systems-level optimization: disabling Nagle’s algorithm can reduce latency for small control-plane RPCs and improve responsiveness in metadata-heavy operations.

### Open work advancing core engine capabilities
The most important active engineering themes are:

- **Partitioned hash join support**
  - PR: [#19553](https://github.com/databendlabs/databend/pull/19553)
  - A major query engine refactor that likely targets better scalability and memory behavior for large joins.

- **Aggregation spilling and memory accounting fixes**
  - PR: [#19622](https://github.com/databendlabs/databend/pull/19622)
  - Focused on resolving spill-related issues and refining memory usage in aggregation, highly relevant for large OLAP group-by workloads.

- **Binder/planner refactors**
  - PRs:
    - [#19579](https://github.com/databendlabs/databend/pull/19579)
    - [#19618](https://github.com/databendlabs/databend/pull/19618)
  - These improve internal SQL binding architecture, especially aggregate registration and projection binding, which often precede faster feature delivery and fewer semantic bugs.

- **Bloom index enhancement**
  - PR: [#19621](https://github.com/databendlabs/databend/pull/19621)
  - Adds a `binary_fuse32` option alongside `xor8` for bloom indexes, suggesting ongoing storage/index tuning for scan pruning.

## 3. Community Hot Topics
There are **no issue discussions** and the supplied PR metadata shows **no meaningful comment/reaction signal** today, so “hot topics” must be inferred from code activity volume and technical concentration.

### Most consequential active PRs
- **Experimental table branch support**
  - [#19551](https://github.com/databendlabs/databend/pull/19551)
  - Suggests demand for **branch-like table workflows**, likely for reproducibility, isolated experimentation, and version-aware data engineering.

- **Partitioned hash join**
  - [#19553](https://github.com/databendlabs/databend/pull/19553)
  - Reflects a need for **more robust join execution** under large datasets and skewed memory conditions.

- **Aggregation spill and memory fixes**
  - [#19622](https://github.com/databendlabs/databend/pull/19622)
  - Indicates pressure to improve **resource stability** for heavy analytical queries.

- **Aggregate function/binder unification**
  - [#19579](https://github.com/databendlabs/databend/pull/19579)
  - Points to the technical need for a cleaner internal framework spanning **builtins, UDAFs, grouping metadata, and binder behavior**.

### Technical needs behind these topics
The pattern is clear: Databend contributors are prioritizing:
1. **Planner/binder correctness**
2. **Memory-safe execution for joins and aggregations**
3. **Versioned table semantics on FUSE**
4. **Index and metadata-plane performance**

These are all high-value areas for an OLAP engine serving large, iterative analytical workloads.

## 4. Bugs & Stability

Ranked by likely severity based on impact to correctness, stability, or operability:

### High severity
- **Aggregation spilling problems / memory usage refinement**
  - PR: [#19622](https://github.com/databendlabs/databend/pull/19622)
  - Risk: query failures, unstable memory behavior, or degraded performance during large aggregations.
  - Assessment: High importance for production OLAP workloads; spill correctness is critical when working sets exceed memory.

- **Executor OOM mapping / panic error naming confusion**
  - PR: [#19614](https://github.com/databendlabs/databend/pull/19614)
  - Related issue reference in PR: fixes `#19612`
  - Risk: operational ambiguity during failures, especially if memory-limit flush failures are surfaced as the wrong error class.
  - Assessment: High operational significance because misclassified failures slow diagnosis and recovery.

### Medium severity
- **FULL OUTER JOIN `USING` nullability alignment**
  - PR: [#19616](https://github.com/databendlabs/databend/pull/19616)
  - Risk: schema mismatch between planned and actual hash-join output, potentially causing correctness issues or downstream planner/executor inconsistencies.
  - Assessment: Important SQL correctness fix, especially for BI tools and users relying on schema stability.

- **Variant-to-number cast correctness**
  - PR: [#19623](https://github.com/databendlabs/databend/pull/19623)
  - Risk: unexpected cast failures or inconsistent conversion semantics for semi-structured data.
  - Assessment: Medium severity, especially for JSON/Variant-heavy pipelines.

- **`ALTER TABLE ADD COLUMN IF NOT EXISTS` support**
  - PR: [#19615](https://github.com/databendlabs/databend/pull/19615)
  - Risk: migration/idempotency friction rather than engine instability.
  - Assessment: Important for orchestration safety and schema migration compatibility.

### Lower severity but notable
- **gRPC small-packet latency due to Nagle’s algorithm**
  - PR: [#19619](https://github.com/databendlabs/databend/pull/19619)
  - Risk: elevated control-plane latency, especially in metadata-heavy paths.
  - Assessment: Not a correctness bug, but useful infrastructure hardening.

## 5. Feature Requests & Roadmap Signals
No explicit user-filed feature requests were updated today, but roadmap signals from PRs are strong.

### Likely roadmap directions
- **Table branches/tags for FUSE**
  - PRs:
    - [#19551](https://github.com/databendlabs/databend/pull/19551)
    - [#19549](https://github.com/databendlabs/databend/pull/19549)
  - This looks like one of the clearest near-term product directions. Expect continued investment in **branching/tagging/version references for table snapshots**, useful for reproducible analytics and isolated experimentation.

- **Advanced join execution**
  - PR: [#19553](https://github.com/databendlabs/databend/pull/19553)
  - Partitioned hash join support suggests Databend is preparing for **larger-scale and more memory-efficient joins**, a key feature for competitive OLAP execution.

- **Bloom index configurability**
  - PR: [#19621](https://github.com/databendlabs/databend/pull/19621)
  - The new `bloom_index_type` option with `xor8` and `binary_fuse32` implies more configurable **data skipping/index structures** may reach users soon.

- **Geospatial analytics**
  - PR: [#19620](https://github.com/databendlabs/databend/pull/19620)
  - Adds Geometry and Geography aggregate functions, a strong signal that **spatial SQL support** is expanding.

### Most likely to appear in the next version
Based on implementation maturity and scope, the most likely near-term user-visible additions are:
1. [`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`](https://github.com/databendlabs/databend/pull/19615)
2. [Geospatial aggregate functions](https://github.com/databendlabs/databend/pull/19620)
3. [Bloom index type selection](https://github.com/databendlabs/databend/pull/19621)
4. [Improved table branch/tag semantics](https://github.com/databendlabs/databend/pull/19551)

## 6. User Feedback Summary
There is **no direct issue-based user feedback** in today’s dataset, so user needs must be inferred from active fixes and features.

### Implied user pain points
- **Memory pressure on large aggregations**
  - Seen in [#19622](https://github.com/databendlabs/databend/pull/19622)
  - Suggests users are running sufficiently large analytical queries to expose spill-path weaknesses.

- **SQL compatibility and migration ergonomics**
  - Seen in [#19615](https://github.com/databendlabs/databend/pull/19615)
  - Users likely want more idempotent DDL semantics compatible with migration tooling.

- **Join correctness and schema consistency**
  - Seen in [#19616](https://github.com/databendlabs/databend/pull/19616)
  - Indicates users care about predictable output schemas, especially in standards-sensitive SQL workflows.

- **Semi-structured data casting**
  - Seen in [#19623](https://github.com/databendlabs/databend/pull/19623)
  - Points to practical usage of Variant/JSON data in analytical transformations.

### Satisfaction signals
The absence of new issue churn could mean:
- low external reporting today, or
- active engineering is happening upstream before users encounter issues.

Given the breadth of correctness and performance work, the team appears responsive to production-grade OLAP concerns even without heavy visible public discussion.

## 7. Backlog Watch
There are no open issues in the provided dataset, so backlog risk is concentrated in **open PRs that appear strategically important**.

### PRs needing maintainer attention
- **Partitioned hash join**
  - [#19553](https://github.com/databendlabs/databend/pull/19553)
  - Open since 2026-03-16
  - Importance: high; large execution-engine refactors benefit from timely review to avoid drift.

- **Experimental table branch support**
  - [#19551](https://github.com/databendlabs/databend/pull/19551)
  - Open since 2026-03-15
  - Importance: high; likely part of a larger table versioning feature set.

- **Aggregate binder unification**
  - [#19579](https://github.com/databendlabs/databend/pull/19579)
  - Open since 2026-03-19
  - Importance: medium-high; foundational SQL binder work can block other feature work.

- **Projection binding refactor**
  - [#19618](https://github.com/databendlabs/databend/pull/19618)
  - Importance: medium; planner infrastructure refactors are often easy to deprioritize but matter for long-term maintainability.

### Watchlist summary
The backlog does not show neglected public issues today, but maintainers should watch for **long-lived engine refactors** accumulating review latency. In OLAP systems, delayed merges in planner/executor internals can increase integration risk across concurrent SQL correctness and performance work.

## Overall Health Assessment
Databend’s current trajectory looks **strong and technically focused**. The strongest signals are around **query execution robustness, SQL semantics, storage/index tuning, and table-versioning capabilities**. The main short-term risk is not lack of activity, but rather coordinating several concurrent deep engine changes—especially around joins, aggregates, binder logic, and snapshot/versioning semantics—without introducing regressions.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-27

## 1. Today's Overview

Velox showed **high pull request activity** over the last 24 hours, with **36 PRs updated** and **7 PRs merged/closed**, while issue volume remained modest at **5 updated issues**. The dominant engineering themes were **GPU/cuDF execution coverage**, **CI/build hygiene**, **SQL compatibility work for Spark and Presto**, and **storage/write-path improvements**. Overall project health looks solid: maintainers are landing incremental infrastructure and expression-system improvements, while contributors are actively pushing feature work across connectors, functions, and GPU acceleration. The main risk area remains **correctness and execution consistency**, especially around Spark compatibility and GPU fallback behavior.

## 3. Project Progress

### Merged/closed PRs advancing the engine

#### 1) Expression system expansion: named ROW / concat expression support
- **PR #16927** — [feat: Add ConcatExpr to IExpr hierarchy](https://github.com/facebookincubator/velox/pull/16927) — **Merged**
- This adds `ConcatExpr` and `kConcat` to the unresolved expression tree, enabling SQL dialects to represent `ROW(expr AS name, ...)` before type resolution.
- Why it matters: this is a meaningful planner/front-end capability improvement that helps Velox model richer SQL syntax more faithfully, especially for dialect compatibility and downstream analysis/planning layers.

#### 2) Build system cleanup around folly event_count target
- **PR #16902** — [Rewrite references of event_count shim target](https://github.com/facebookincubator/velox/pull/16902) — **Merged**
- The repo now points directly to `//folly/synchronization:event_count`.
- Why it matters: while not user-visible, this reduces dependency indirection and build fragility, which is valuable for a project that integrates with multiple ecosystems.

#### 3) Documentation ecosystem maintenance
- **PR #16936** — [docs: Update official link for Gluten project](https://github.com/facebookincubator/velox/pull/16936) — **Closed/Merged**
- Minor docs maintenance, but useful for the surrounding interoperability ecosystem.

#### 4) cuDF build-path experimentation
- **PR #16932** — [build(cudf): Build the cudf in set up adapters environment](https://github.com/facebookincubator/velox/pull/16932) — **Closed**
- No summary details were provided, but its presence reinforces that GPU integration remains an active operational area.

### What this says about momentum
Today’s landed work skewed toward **infrastructure and expression representation** rather than large end-user features. That often signals a healthy core project state: maintainers are investing in internal abstractions needed to unlock future SQL and planner capabilities.

## 4. Community Hot Topics

### A) cuDF operator architecture consolidation
- **Issue #16885** — [[enhancement] Unify cuDF operators with a common base class architecture](https://github.com/facebookincubator/velox/issues/16885)
- Most discussed issue in the list with **10 comments**.
- Technical need: current cuDF operators each derive directly from `exec::Operator` and `NvtxHelper`, creating repeated code and fragmented GPU operator behavior.
- Analysis: contributors are signaling that GPU support is no longer experimental glue code; it now needs a **shared operator abstraction** for maintainability, instrumentation, and consistent execution semantics.

### B) Filling GPU coverage gaps for scalar-subquery pipelines
- **Issue #16888** — [[enhancement, cudf] Add GPU support for EnforceSingleRow operator](https://github.com/facebookincubator/velox/issues/16888)
- Followed by fix implementation:
- **PR #16920** — [feat(cudf): Add CudfEnforceSingleRow GPU operator](https://github.com/facebookincubator/velox/pull/16920)
- Technical need: `EnforceSingleRow` was forcing CPU fallback in TPC-DS runs and appears **26 times** at SF100.
- Analysis: the community is pushing beyond “GPU can run some operators” toward **end-to-end GPU pipeline continuity**, minimizing host/device transfers and fallback penalties.

### C) Consolidating GPU eligibility logic
- **Issue #16930** — [[enhancement, cudf] Consolidate split GPU support checks across cudf operator adapters](https://github.com/facebookincubator/velox/issues/16930)
- Technical need: support checks are duplicated between operator-local helper logic and adapter-level `canRunOnGPU` overrides.
- Analysis: this is a classic scale problem—once operator coverage expands, duplicated capability logic becomes a source of inconsistent planning and hard-to-debug execution mismatches.

### D) Spark JSON correctness regression
- **Issue #16855** — [[bug] get_json_object returns wrong results for [*] wildcard paths with simdjson ≥ 4.0](https://github.com/facebookincubator/velox/issues/16855)
- Technical need: maintaining Spark SQL compatibility despite upstream parser behavior changes.
- Analysis: this is one of the most important active issues because it affects **query correctness**, not just performance or implementation cleanliness.

### E) Backward-compatible serde API reland
- **PR #16912** — [refactor: Reland VectorSerde API changes with backward compatibility](https://github.com/facebookincubator/velox/pull/16912)
- Technical need: evolve serialization APIs while preserving downstream builds via `VELOX_ENABLE_BACKWARD_COMPATIBILITY`.
- Analysis: maintainers appear to be balancing API cleanup with ecosystem stability—a good sign for embedders like Presto-derived systems.

## 5. Bugs & Stability

Ranked by likely severity:

### 1) Query correctness bug: Spark `get_json_object` wildcard handling
- **Issue #16855** — [get_json_object returns wrong results for [*] wildcard paths with simdjson ≥ 4.0](https://github.com/facebookincubator/velox/issues/16855)
- Severity: **High**
- Impact: wrong results in Spark SQL Hive compatibility tests are more serious than crashes in many analytical contexts because they can silently corrupt outputs.
- Status: **Open**, no linked fix PR in the provided data.
- Risk: external dependency version changes (`simdjson >= 4.0`) can create subtle semantic drift.

### 2) GPU fallback and execution inconsistency for `EnforceSingleRow`
- **Issue #16888** — [Add GPU support for EnforceSingleRow operator](https://github.com/facebookincubator/velox/issues/16888)
- Severity: **Medium**
- Impact: not a correctness failure per se, but CPU fallback breaks full GPU execution flow and can hurt performance predictability.
- Fix in progress:
  - **PR #16920** — [Add CudfEnforceSingleRow GPU operator](https://github.com/facebookincubator/velox/pull/16920)

### 3) Inconsistent GPU capability checks across adapters/operators
- **Issue #16930** — [Consolidate split GPU support checks across cudf operator adapters](https://github.com/facebookincubator/velox/issues/16930)
- Severity: **Medium**
- Impact: duplicated eligibility logic can produce planner/executor mismatches, hidden fallbacks, or unsupported-path surprises.
- Status: **Open**, no linked implementation yet in the provided data.

### 4) CI observability weakness rather than product bug
- **PR #16938** — [build: Split ubuntu-debug into separate build and test jobs](https://github.com/facebookincubator/velox/pull/16938)
- Severity: **Low**, but operationally important.
- Impact: failure modes are currently harder to diagnose, slowing contributor turnaround.

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signal: deeper cuDF/GPU maturation
Likely near-term candidates for inclusion in the next version:
- **Issue #16885** — [Unify cuDF operators with a common base class architecture](https://github.com/facebookincubator/velox/issues/16885)
- **Issue #16930** — [Consolidate split GPU support checks across cudf operator adapters](https://github.com/facebookincubator/velox/issues/16930)
- **PR #16920** — [Add CudfEnforceSingleRow GPU operator](https://github.com/facebookincubator/velox/pull/16920)
- **PR #16535** — [Separate cuDF query and system configs](https://github.com/facebookincubator/velox/pull/16535)

These together suggest Velox is moving from ad hoc GPU support toward a **more production-ready GPU execution architecture** with cleaner config propagation and less fallback ambiguity.

### SQL compatibility and function surface expansion
Open feature work points to continued acceleration in dialect coverage:

- **PR #16789** — [Add custom Parquet read support for Spark TimestampNTZ Type](https://github.com/facebookincubator/velox/pull/16789)
- **PR #16933** — [RESPECT NULLS for Spark collect_list function](https://github.com/facebookincubator/velox/pull/16933)
- **PR #16782** — [Add aes_encrypt and aes_decrypt functions](https://github.com/facebookincubator/velox/pull/16782)
- **PR #16487** — [Add array_least_frequent Presto function](https://github.com/facebookincubator/velox/pull/16487)
- **PR #16516** — [Implement Google Polyline encoding and decoding functions](https://github.com/facebookincubator/velox/pull/16516)
- **PR #15511** — [s2 presto UDFs](https://github.com/facebookincubator/velox/pull/15511)

Prediction: the next release is likely to contain a mix of **Spark SQL parity fixes**, **new Presto/Spark scalar functions**, and **incremental GPU operator coverage**.

### Storage/connectors roadmap
- **PR #16637** — [Add storageParameters to HiveInsertTableHandle](https://github.com/facebookincubator/velox/pull/16637)
- **PR #16935** — [Port hive.s3.min-part-size and enforce minimum part size](https://github.com/facebookincubator/velox/pull/16935)
- **PR #16556** — [[WIP] Add Lance connector](https://github.com/facebookincubator/velox/pull/16556)

These indicate continued focus on **write-path metadata fidelity**, **S3 multipart upload behavior**, and **broadening storage format support**.

## 7. User Feedback Summary

Based on the current issues and PRs, the clearest user pain points are:

- **GPU users want fewer fallbacks and more predictable acceleration**
  - The `EnforceSingleRow` work shows real workloads are hitting CPU detours that undermine GPU value.
  - Related links:
    - [Issue #16888](https://github.com/facebookincubator/velox/issues/16888)
    - [PR #16920](https://github.com/facebookincubator/velox/pull/16920)

- **Users care deeply about Spark compatibility correctness**
  - The JSON wildcard regression is a direct signal that compatibility is judged on semantic exactness, not just feature presence.
  - Link:
    - [Issue #16855](https://github.com/facebookincubator/velox/issues/16855)

- **Operators and maintainers need cleaner internal abstractions**
  - Multiple cuDF-related requests focus on architectural consolidation rather than adding one-off features, indicating maintenance burden is growing.
  - Links:
    - [Issue #16885](https://github.com/facebookincubator/velox/issues/16885)
    - [Issue #16930](https://github.com/facebookincubator/velox/issues/16930)

- **Users integrating Velox in larger systems need compatibility-preserving API evolution**
  - The backward-compatible `VectorSerde` reland shows concern for downstream breakage.
  - Link:
    - [PR #16912](https://github.com/facebookincubator/velox/pull/16912)

- **Storage users want behavior parity with established Presto configs**
  - S3 multipart threshold support and Hive insert metadata propagation both reflect practical deployment needs rather than speculative features.
  - Links:
    - [PR #16935](https://github.com/facebookincubator/velox/pull/16935)
    - [PR #16637](https://github.com/facebookincubator/velox/pull/16637)

## 8. Backlog Watch

These items appear important and likely need maintainer attention due to age, breadth, or strategic relevance:

### Long-running/open PRs
- **PR #15511** — [s2 presto UDFs](https://github.com/facebookincubator/velox/pull/15511)
  - Open since **2025-11-15**
  - Important for geospatial function coverage and Presto ecosystem parity.

- **PR #16176** — [BaseEncoderUtils refactor](https://github.com/facebookincubator/velox/pull/16176)
  - Open since **2026-01-30**
  - Small utility refactors can linger, but shared encoding infrastructure affects maintainability and future function additions.

- **PR #16487** — [Add array_least_frequent Presto function](https://github.com/facebookincubator/velox/pull/16487)
  - Open since **2026-02-23**
  - Straightforward SQL surface-area expansion that may just need review bandwidth.

- **PR #16516** — [Implement Google Polyline encoding and decoding functions](https://github.com/facebookincubator/velox/pull/16516)
  - Open since **2026-02-25**
  - Useful user-facing function work that may be blocked on API or review details.

- **PR #16535** — [Separate cuDF query and system configs](https://github.com/facebookincubator/velox/pull/16535)
  - Open since **2026-02-25**
  - Strategically important for making GPU support production-grade; deserves priority.

- **PR #16556** — [[WIP] Add Lance connector](https://github.com/facebookincubator/velox/pull/16556)
  - Open since **2026-02-26**
  - Potentially significant connector expansion, but WIP status suggests it needs clearer scope or maintainer guidance.

- **PR #16637** — [Add storageParameters to HiveInsertTableHandle](https://github.com/facebookincubator/velox/pull/16637)
  - Open since **2026-03-04**
  - Important for metadata propagation in write paths; likely high practical value.

### Active issue needing prompt attention
- **Issue #16855** — [get_json_object wrong results with simdjson ≥ 4.0](https://github.com/facebookincubator/velox/issues/16855)
  - Not the oldest item, but probably the **highest urgency** because it is a correctness regression with compatibility implications.

---

## Bottom line

Velox is currently in a **healthy, high-throughput development phase**, with especially strong momentum around **GPU/cuDF execution maturity**, **SQL dialect compatibility**, and **storage/connectivity improvements**. The most important near-term watch items are the **Spark JSON correctness bug** and whether the project can convert its many cuDF cleanups into a more coherent GPU execution framework. If current PRs land, the next version is likely to look stronger in **GPU completeness, Spark parity, and operational polish**.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-27

## 1. Today's Overview

Apache Gluten remained highly active over the last 24 hours, with **21 pull requests updated** and **2 active issues**, indicating strong ongoing development despite no new release activity. The current work is concentrated in the **Velox backend**, especially around **Spark 4.0/4.1 compatibility, GPU/runtime infrastructure, SQL semantics, and execution correctness**. Several PRs closed today show steady progress on build/package maintenance and GPU serialization correctness, while open work suggests the project is still in an intensive stabilization and feature-enablement phase rather than release hardening. Overall, project health looks **active and forward-moving**, with most momentum around backend maturity and compatibility expansion.

## 2. Project Progress

### Merged/closed PRs today

#### 1) GPU batch serialization correctness fix
- **PR #11831** — [Pass row count to CudfVector in GPU batch serializer](https://github.com/apache/incubator-gluten/pull/11831)  
  This addressed a likely **data correctness / runtime bug** in GPU deserialization, where the byte-array length was incorrectly forwarded as row count. For an analytical engine, this is important because serializer/deserializer mismatches can lead to corrupted batches, invalid vector sizing, or crashes in GPU execution paths.

#### 2) Spark package/build compatibility maintenance
- **PR #11820** — [Keep old 4.x packages when building for new package](https://github.com/apache/incubator-gluten/pull/11820)  
  This improves packaging continuity across Spark 4.x lines and reduces friction for users building against evolving package layouts. It signals continued investment in **Spark 4.x migration support**.

#### 3) Dependency refreshes
- **PR #11813** — [Bump org.apache.spark:spark-core_2.12 from 3.5.5 to 3.5.7](https://github.com/apache/incubator-gluten/pull/11813)  
- **PR #11814** — [Bump black from 24.4.2 to 26.3.1](https://github.com/apache/incubator-gluten/pull/11814)  
  These are lower-level maintenance updates, but the Spark dependency bump is relevant for compatibility and test surface alignment.

#### 4) Test/build experimentation and cleanup
- **PR #11829** — [[DNM][VL] TEST enable dynamic libcurl in vcpkg](https://github.com/apache/incubator-gluten/pull/11829)  
  Although closed, it indicates active experimentation around native dependency linkage in the Velox build toolchain.

#### 5) Spark 4.x type widening validation work concluded
- **PR #11670** — [WIP: Enable GlutenParquetTypeWideningSuite for Spark 4.0 and 4.1](https://github.com/apache/incubator-gluten/pull/11670)  
  Closed after serving as an intermediate step toward broader Parquet type widening support and test enablement.

#### 6) Native Avro scan effort closed stale
- **PR #11179** — [Support native Avro scan](https://github.com/apache/incubator-gluten/pull/11179)  
  This long-running effort was closed as stale. That is notable because **native Avro scan** would have been a meaningful storage-format capability improvement, but it does not appear to be moving forward right now.

### What these changes mean

Today’s closed work advanced:
- **GPU execution stability** via serializer correctness
- **Spark 4.x packaging compatibility**
- **Dependency alignment** with newer Spark patch versions
- Continued churn around **native build reproducibility and dependency management**

The overall trend is less about brand-new end-user SQL features today and more about **hardening the engine and preserving compatibility across rapidly changing Spark / native backend environments**.

## 3. Community Hot Topics

### Most discussed / highest-signal items

#### 1) Velox upstreaming gap tracker
- **Issue #11585** — [[VL] useful Velox PRs not merged into upstream](https://github.com/apache/incubator-gluten/issues/11585)  
  - Comments: 16
  - Reactions: 👍 4

This is the strongest community signal in the current issue set. The issue tracks **Gluten-relevant Velox changes that are still pending upstream merge**, reflecting a structural challenge for Gluten: it depends heavily on Velox but cannot always wait for upstream integration. The technical need underneath is clear:
- reduce downstream patch carrying cost,
- avoid rebasing burden,
- and keep backend features moving without fragmenting the Velox dependency story.

This is important strategically because unresolved upstream dependencies can slow delivery of SQL features, correctness fixes, and performance work in Gluten.

#### 2) Spark SQL semantic parity: `collect_set` null handling
- **Issue #11826** — [[VL] Enable `collect_set` ignoreNulls](https://github.com/apache/incubator-gluten/issues/11826)  
  - Updated quickly after creation

This points to a **SQL semantics compatibility gap** between Gluten/Velox behavior and expected Spark behavior. Aggregate semantics, especially around null handling, are high-impact because they directly affect query correctness and user trust.

#### 3) Long-running SQL function support: `map_from_entries`
- **PR #8731** — [[VL] Support Spark map_from_entries function](https://github.com/apache/incubator-gluten/pull/8731)  
  This remains open more than a year after creation and depends on a Velox PR. It reflects a recurring theme: **Spark SQL function coverage is gated by backend implementation and upstream coordination**.

#### 4) Spark 4.0/4.1 test re-enablement push
- **PR #11816** — [Enable 30 disabled test suites for Spark 4.0/4.1](https://github.com/apache/incubator-gluten/pull/11816)  
- **PR #11833** — [Enable GlutenLogicalPlanTagInSparkPlanSuite (150/150 tests)](https://github.com/apache/incubator-gluten/pull/11833)  
These are strong indicators that a major near-term priority is **bringing Gluten to production-grade compatibility on Spark 4.x**.

## 4. Bugs & Stability

Ranked by likely severity based on current data:

### High severity

#### 1) GPU deserialization row-count bug
- **PR #11831** — [Pass row count to CudfVector in GPU batch serializer](https://github.com/apache/incubator-gluten/pull/11831)  
This appears to fix a potentially serious correctness/stability issue in GPU execution. Passing serialized byte length where row count is expected could cause:
- invalid vector construction,
- memory misuse,
- wrong results,
- or crashes in GPU paths.

A fix PR exists and was closed today, which is a positive sign.

#### 2) Native UNION result correctness issue
- **PR #11832** — [fix native union use column type as name lead to result error](https://github.com/apache/incubator-gluten/pull/11832)  
Open. This is directly a **query correctness bug**: using column type as name in native union can produce wrong results. Since UNION is a common SQL operator, this deserves attention.

### Medium severity

#### 3) Broadcast cache synchronization/performance risk
- **PR #11834** — [Remove the synchronized lock in VeloxBroadcastBuildSideCache](https://github.com/apache/incubator-gluten/pull/11834)  
Open. This may target contention or deadlock/performance bottlenecks in broadcast join infrastructure. It looks more like a concurrency/performance stabilization item than a correctness issue, but if locking is excessive it can hurt throughput and latency.

#### 4) Spark 4.x logical-plan tag propagation gap
- **PR #11833** — [Enable GlutenLogicalPlanTagInSparkPlanSuite (150/150 tests)](https://github.com/apache/incubator-gluten/pull/11833)  
Root cause described in the PR indicates Gluten transformer replacements were not propagating `LOGICAL_PLAN_TAG`. This is mainly a **framework integration correctness/testing** issue and can affect planner/test expectations and observability.

### Lower severity but notable

#### 5) `collect_set` null semantics mismatch
- **Issue #11826** — [Enable `collect_set` ignoreNulls](https://github.com/apache/incubator-gluten/issues/11826)  
This is a semantics compatibility gap rather than a crash, but for BI and ETL correctness, aggregate behavior mismatches matter.

## 5. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### 1) TIMESTAMP_NTZ support
- **PR #11626** — [[VL] Add basic TIMESTAMP_NTZ type support](https://github.com/apache/incubator-gluten/pull/11626)  
This is a strong compatibility feature for modern Spark SQL workloads. Support for `TIMESTAMP_NTZ` is increasingly important for lakehouse-style pipelines and cross-engine interoperability.

#### 2) Parquet type widening support
- **PR #11719** — [[VL] Add Parquet type widening support](https://github.com/apache/incubator-gluten/pull/11719)  
This is a high-value storage compatibility feature. It addresses schema evolution and Parquet interoperability, both critical in analytical data lakes. This looks like a good candidate for inclusion in an upcoming version because it already references extensive test enablement.

#### 3) Bloom-filter-based scan pushdown
- **PR #11711** — [Translate might_contain as a subfield filter for scan-level bloom filter pushdown](https://github.com/apache/incubator-gluten/pull/11711)  
This is a notable optimization signal: moving `might_contain` into scan-level pruning improves selective reads and fits well with Gluten’s execution acceleration goals.

#### 4) Shuffle-level pruning prerequisites
- **PR #11769** — [Write per-block column statistics in shuffle writer](https://github.com/apache/incubator-gluten/pull/11769)  
This suggests work toward **dynamic-filter-driven block pruning** during shuffle reads, which could materially improve distributed query efficiency.

#### 5) Spark SQL function coverage expansion
- **PR #8731** — [Support Spark map_from_entries function](https://github.com/apache/incubator-gluten/pull/8731)  
- **Issue #11826** — [Enable `collect_set` ignoreNulls](https://github.com/apache/incubator-gluten/issues/11826)  
These reinforce that SQL compatibility remains a live roadmap theme.

#### 6) GPU runtime and image modernization
- **PR #11830** — [Use immutable gpu config and add cuda runtime detection](https://github.com/apache/incubator-gluten/pull/11830)  
- **PR #11835** — [refine GPU image build](https://github.com/apache/incubator-gluten/pull/11835)  
- **PR #11836** — [Add cudf build docker file with JDK 17 and cuda 12.9](https://github.com/apache/incubator-gluten/pull/11836)  
These are strong signals that **GPU deployment ergonomics and environment detection** are a current investment area.

### Likely next-version candidates
Based on current activity, the features most likely to land soon are:
- **Spark 4.0/4.1 compatibility and test re-enablement**
- **Parquet type widening**
- **basic TIMESTAMP_NTZ support**
- **GPU runtime/build improvements**
- **query pushdown/pruning enhancements in the Velox path**

## 6. User Feedback Summary

There is limited explicit end-user qualitative feedback in today’s data, but the issue/PR stream reveals several recurring user pain points:

- **SQL compatibility gaps with Spark semantics**  
  Seen in `collect_set(ignoreNulls)` and `map_from_entries`. Users expect Gluten to behave like Spark at the function level, especially in aggregate and complex-type operations.

- **Operational complexity around backend/upstream dependencies**  
  The Velox tracking issue shows maintainers and contributors are feeling friction from unmerged upstream work. This affects users indirectly through delayed feature delivery and patch maintenance complexity.

- **Spark 4.x migration friction**  
  Multiple PRs are focused on package compatibility, disabled tests, and logical-plan behavior. This suggests users are actively trying to adopt Gluten on newer Spark versions and are surfacing edge cases.

- **GPU deployment usability and correctness**  
  Runtime detection, Docker image refinements, and serializer fixes indicate users care not just about raw acceleration, but also about **reliable setup and correct execution** on GPU paths.

Overall, user demand appears concentrated on **“make acceleration transparent and Spark-compatible”** rather than on entirely new APIs.

## 7. Backlog Watch

### Important older items needing attention

#### 1) `map_from_entries` support remains open for a long time
- **PR #8731** — [Support Spark map_from_entries function](https://github.com/apache/incubator-gluten/pull/8731)  
Created in 2025-02 and still open. It depends on upstream Velox work, making it a good example of a useful feature stalled by dependency coordination.

#### 2) Maven dependency caching / CI efficiency
- **PR #11655** — [[VL][CI] cache maven deps m2 repo](https://github.com/apache/incubator-gluten/pull/11655)  
Created in 2026-02 and still open. CI/build acceleration is not user-facing, but it directly affects contributor throughput and release velocity.

#### 3) TIMESTAMP_NTZ support still in progress
- **PR #11626** — [[VL] Add basic TIMESTAMP_NTZ type support](https://github.com/apache/incubator-gluten/pull/11626)  
A meaningful compatibility feature that likely deserves prioritization due to broad SQL relevance.

#### 4) Velox upstream dependency tracker remains active
- **Issue #11585** — [[VL] useful Velox PRs not merged into upstream](https://github.com/apache/incubator-gluten/issues/11585)  
This is less a single bug than an ongoing project-management risk. Maintainers likely need a clearer policy on what gets temporarily carried downstream versus what waits for upstream merge.

#### 5) Native Avro scan appears deprioritized
- **PR #11179** — [Support native Avro scan](https://github.com/apache/incubator-gluten/pull/11179)  
Closed stale after months of inactivity. If Avro remains important for users, this area may need renewed ownership.

---

## Overall Health Assessment

Apache Gluten looks **technically active and healthy**, with substantial development energy around **Velox integration, Spark 4.x readiness, GPU execution, and storage/query optimization**. The main risks are not lack of activity, but rather:
- dependency on **unmerged Velox upstream work**,
- a growing queue of **compatibility and semantics edge cases**,
- and some long-lived PRs that may need stronger maintainer triage.

For users, the near-term outlook is positive if they care about **Spark 4.x support, Parquet/schema evolution, and GPU/Velox execution maturity**.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-27

## 1. Today's Overview

Apache Arrow showed **moderately high day-to-day activity** over the last 24 hours, with **46 issues updated** and **22 PRs updated**, but **no new release published**. The balance of activity suggests a project in **active maintenance and feature development mode**, especially around **C++/Parquet/Flight SQL/ODBC**, **R bindings**, and **CI hardening**. A notable pattern today is that several long-running or stale issues were closed, while active engineering energy concentrated on **query correctness**, **platform support**, and **enterprise integration workflows** such as ODBC packaging and signing. Overall project health looks solid, though there are still some important correctness and CI reliability items that need attention.

## 2. Project Progress

### Merged/closed PRs today

#### Large-memory CI coverage landed
- [PR #49490](https://github.com/apache/arrow/pull/49490) — **[C++][CI] Add job with ARROW_LARGE_MEMORY_TESTS enabled**
- Related issue: [Issue #46600](https://github.com/apache/arrow/issues/46600)

This is the clearest substantive improvement merged/closed in the period. It strengthens Arrow’s validation for **large-memory execution paths**, which matters for analytical workloads involving very large arrays, large Parquet pages, and memory-intensive compute behavior. This is not a user-facing feature, but it is a meaningful infrastructure improvement for **storage engine robustness** and for catching bugs that only appear at larger data sizes.

### Other closed items mostly reflect backlog cleanup, docs/dev tooling, and stale issue resolution
A number of closed issues updated today were older enhancements, usage questions, or developer tooling items rather than newly delivered engine capabilities. Examples include:
- [Issue #36474](https://github.com/apache/arrow/issues/36474) — CODEOWNERS curation
- [Issue #33715](https://github.com/apache/arrow/issues/33715) — pytest warning cleanup
- [Issue #46582](https://github.com/apache/arrow/issues/46582) — docs synchronization
- [Issue #38841](https://github.com/apache/arrow/issues/38841) — breaking-change labeling prompt

### What this means for engine progress
Today’s closed work advanced Arrow mostly through **test coverage and maintenance** rather than through large newly merged query-engine features. Still, the active PR queue shows near-term progress in:
- **Query correctness fixes** for list filtering
- **Parquet improvements** including encrypted bloom filter reads and row-group buffering introspection
- **Flight SQL ODBC connectivity**
- **R cloud filesystem support**
- **Python ergonomics and sanitizer coverage**

## 3. Community Hot Topics

### 1) Large-memory CI coverage
- [Issue #46600](https://github.com/apache/arrow/issues/46600) — 35 comments
- [PR #49490](https://github.com/apache/arrow/pull/49490)

This was the most discussed issue in the visible set and is now closed. The underlying need is straightforward: Arrow’s C++ core powers analytical systems where **memory scale changes behavior**, and untested large-memory paths are a risk for correctness and stability. The closure suggests maintainers are prioritizing **production realism in CI**, especially as Arrow is increasingly used as a substrate in high-volume OLAP pipelines.

### 2) R expression extensibility for geoarrow-related work
- [Issue #45438](https://github.com/apache/arrow/issues/45438) — 18 comments

This open R usage/design topic points to a broader technical need: users want to define **Arrow-supported expressions** in R for custom extensions and geospatial workflows. That signals demand for Arrow not just as a file format or transport layer, but as a **pushdown-capable analytical execution substrate** in higher-level languages. If resolved well, this could improve Arrow’s fit in domain-specific analytics ecosystems.

### 3) Binary min/max kernels in C++
- [Issue #31035](https://github.com/apache/arrow/issues/31035) — 21 comments

Though now closed, this long-lived enhancement reflects continued user expectation that Arrow’s compute layer should cover more **standard scalar kernel semantics**. Requests like this indicate pressure for Arrow compute to become more complete and SQL-like in everyday function coverage.

### 4) Flight SQL ODBC support and packaging pipeline
Key related PRs:
- [PR #46099](https://github.com/apache/arrow/pull/46099) — Arrow Flight SQL ODBC layer
- [PR #49564](https://github.com/apache/arrow/pull/49564) — Ubuntu ODBC support
- [PR #49585](https://github.com/apache/arrow/pull/49585) — static build of ODBC FlightSQL driver
- [PR #49603](https://github.com/apache/arrow/pull/49603) — Windows CI for DLL/MSI signing
- [Issue #49537](https://github.com/apache/arrow/issues/49537)

This cluster is one of the strongest roadmap signals in today’s data. The community need is clear: Arrow wants to meet users where they are, including **BI tooling, ODBC consumers, enterprise Windows packaging**, and now **Linux/Ubuntu support**. This is strategically important because it connects Arrow Flight SQL to conventional analytics tooling rather than only Arrow-native clients.

### 5) Query correctness bug in filtering list arrays
- [Issue #49392](https://github.com/apache/arrow/issues/49392) — 7 comments, 👍 3
- [PR #49602](https://github.com/apache/arrow/pull/49602)

This is the most important correctness discussion in the current active set. It involves **data corruption during filtering** on list columns, a serious issue for analytical correctness. The quick appearance of a targeted fix PR is a positive sign of responsiveness.

## 4. Bugs & Stability

Ranked by likely severity:

### Critical: filtering can corrupt list-array data
- [Issue #49392](https://github.com/apache/arrow/issues/49392) — **[C++][Python] Filtering corrupts data in column containing a list array**
- Fix PR: [PR #49602](https://github.com/apache/arrow/pull/49602)

This is the top stability concern in the current snapshot because it is a **user-visible correctness bug** affecting filtering on `list<double>` data. In an OLAP context, incorrect filtered results are more dangerous than crashes because they can silently taint downstream analysis. The linked fix identifies a likely **byte offset overflow in fixed-width gather logic**, which sounds like a low-level compute bug with high user impact. Good news: a fix PR already exists and was opened promptly.

### High: CI/build failures on Ubuntu Resolute due to aws-lc build
- [Issue #49601](https://github.com/apache/arrow/issues/49601) — **[CI][Packaging] ubuntu-resolute Linux fail building aws-lc**

This is not a query correctness issue, but it is significant for **release engineering and packaging continuity**. If a base Linux target cannot reliably build dependencies, it can slow validation and threaten downstream package freshness.

### Medium: intermittent MinGW segfault in JSON tests
- [PR #49462](https://github.com/apache/arrow/pull/49462) — fix for [Issue #49272](https://github.com/apache/arrow/issues/49272)

Intermittent segfaults in CI are a meaningful quality problem because they produce **false negatives** and obscure real regressions. The fact that this is being actively addressed indicates maintainers are trying to reduce nondeterminism in platform coverage, especially Windows/MinGW.

### Medium: libhdfs loading problems in Python on Apple Silicon
- [Issue #45369](https://github.com/apache/arrow/issues/45369)

This one is closed, but it reflects a continuing class of user pain: **filesystem connector usability** and dependency discovery on modern developer machines. It matters less for engine correctness, more for onboarding and integration quality.

### Medium: sparse CSV inference leads to confusing R errors
- [PR #49338](https://github.com/apache/arrow/pull/49338)

Not a crash, but a real usability and data ingestion issue. Misleading errors around null inference can slow data loading workflows and create distrust in schema inference behavior.

## 5. Feature Requests & Roadmap Signals

### Strong signals

#### Flight SQL ODBC is becoming a major deliverable
- [PR #46099](https://github.com/apache/arrow/pull/46099)
- [PR #49564](https://github.com/apache/arrow/pull/49564)
- [PR #49585](https://github.com/apache/arrow/pull/49585)
- [PR #49603](https://github.com/apache/arrow/pull/49603)
- [Issue #49537](https://github.com/apache/arrow/issues/49537)

This is the clearest likely-next-version feature area. Work spans **driver implementation**, **Ubuntu support**, **static builds**, and **Windows signing/distribution**. That breadth usually indicates a feature moving toward production-readiness.

#### R cloud storage support is expanding
- [PR #49553](https://github.com/apache/arrow/pull/49553) — **[R] Expose azure blob filesystem**

This looks like a likely candidate for an upcoming release because Arrow C++ and PyArrow already support Azure. Bringing R to parity is a natural and user-visible enhancement, especially for cloud-native analytics.

#### Parquet feature depth continues to improve
- [PR #49334](https://github.com/apache/arrow/pull/49334) — encrypted bloom filters
- [PR #49527](https://github.com/apache/arrow/pull/49527) — BufferedStats API for RowGroupWriter

These are important for advanced storage users. Encrypted bloom filter reading improves **compatibility with secure Parquet deployments**, while buffered stats exposure helps writers make better **row-group sizing decisions**, relevant for optimizing read performance in analytical systems.

#### Python ergonomics remain on the roadmap
- [PR #48085](https://github.com/apache/arrow/pull/48085) — arithmetic on arrays and scalars
- [Issue #49321](https://github.com/apache/arrow/issues/49321) — PyArrow sanitizers build
- [PR #47663](https://github.com/apache/arrow/pull/47663) — default column type parameter

This cluster suggests PyArrow is still investing in both **developer ergonomics** and **reliability tooling**. The arithmetic operator work is especially notable because it would make PyArrow arrays feel more natural in interactive analytical code.

#### Compute engine evolution
- [PR #47377](https://github.com/apache/arrow/pull/47377) — selective kernel execution
- [Issue #31576](https://github.com/apache/arrow/issues/31576) — join key casting when reasonable
- [Issue #31035](https://github.com/apache/arrow/issues/31035) — binary min/max kernels

These point to ongoing interest in making Arrow compute more expressive and more forgiving, especially for SQL-like and dataframe-like workloads.

### Likely next-version candidates
Based on maturity and review state, the most plausible near-term inclusions are:
1. **R Azure Blob filesystem support** — [PR #49553](https://github.com/apache/arrow/pull/49553)
2. **R dplyr helper coverage** — [PR #49535](https://github.com/apache/arrow/pull/49535), [PR #49536](https://github.com/apache/arrow/pull/49536)
3. **List filtering corruption fix** — [PR #49602](https://github.com/apache/arrow/pull/49602)
4. **Parquet encrypted bloom filter support** — [PR #49334](https://github.com/apache/arrow/pull/49334)
5. **Additional Flight SQL ODBC packaging/build groundwork** — [PR #49564](https://github.com/apache/arrow/pull/49564), [PR #49603](https://github.com/apache/arrow/pull/49603)

## 6. User Feedback Summary

### Main pain points users are expressing

#### 1) Correctness under filtering and nested data
- [Issue #49392](https://github.com/apache/arrow/issues/49392)

Users are exercising Arrow in realistic nested-data workflows and expect filtering semantics to be trustworthy. This is a high-priority trust issue for analytical adoption.

#### 2) Better language binding parity and custom expression support
- [Issue #45438](https://github.com/apache/arrow/issues/45438)
- [PR #49553](https://github.com/apache/arrow/pull/49553)

R users in particular want Arrow to behave like a first-class analytical backend, including **cloud filesystems**, **expression support**, and **ecosystem integration**.

#### 3) Enterprise connectivity and packaging
- [PR #46099](https://github.com/apache/arrow/pull/46099)
- [PR #49564](https://github.com/apache/arrow/pull/49564)
- [PR #49603](https://github.com/apache/arrow/pull/49603)

There is clear demand for Arrow Flight SQL to be consumable through standard enterprise interfaces like ODBC, across Windows and Linux, with proper signing and packaging workflows.

#### 4) Better error messages and less surprising behavior
- [PR #49338](https://github.com/apache/arrow/pull/49338)
- [Issue #31576](https://github.com/apache/arrow/issues/31576)
- [PR #49540](https://github.com/apache/arrow/pull/49540)

Users continue to run into problems where Arrow is technically functioning but gives **confusing errors**, **strict type behavior**, or **poor CLI UX**. This is common in maturing infrastructure projects and often signals good candidates for polish work.

#### 5) Connector/dependency setup remains painful
- [Issue #45369](https://github.com/apache/arrow/issues/45369)
- [Issue #37057](https://github.com/apache/arrow/issues/37057)

HDFS/libhdfs and distributed environment integration still generate friction, especially on nontraditional or newer platforms.

## 7. Backlog Watch

These items look important but appear under-served or long-running:

### Long-open compute/API items
- [Issue #31576](https://github.com/apache/arrow/issues/31576) — **cast when reasonable for join keys**
  
This is a usability issue with direct implications for SQL/dataframe interoperability. Automatic or guided coercion for join keys would reduce friction in mixed-schema analytical pipelines.

- [Issue #31619](https://github.com/apache/arrow/issues/31619) — **IPC listener interface should allow receiving custom_metadata**
  
Important for advanced IPC/event-driven integrations; still open since 2022.

- [PR #47377](https://github.com/apache/arrow/pull/47377) — **selective execution for kernels**
  
Potentially foundational for richer compute semantics, but it appears long-running and still awaiting changes.

### Long-open documentation/usability items
- [Issue #31620](https://github.com/apache/arrow/issues/31620) — more complete linking/CMake example
- [Issue #31596](https://github.com/apache/arrow/issues/31596) — document parallelism of file readers

These are not glamorous, but both matter a lot for adoption by systems developers integrating Arrow into analytical engines.

### Large dependency/platform work still in flight
- [PR #48964](https://github.com/apache/arrow/pull/48964) — bundled dependency upgrades with breaking changes
- [PR #46099](https://github.com/apache/arrow/pull/46099) — Flight SQL ODBC layer

Both appear strategically important and nontrivial. They likely need sustained maintainer bandwidth because they affect **platform compatibility**, **public APIs**, and **distribution complexity**.

### R functionality parity items
- [Issue #31601](https://github.com/apache/arrow/issues/31601) — expose FileSystemDatasetWriteOptions
- [Issue #45438](https://github.com/apache/arrow/issues/45438) — create Arrow-supported expressions

These reflect a continued desire for R to expose more of Arrow’s backend capabilities in a composable way.

## Overall Health Assessment

Apache Arrow appears **healthy and actively maintained**, with strong momentum in **C++ core work, Parquet, Flight SQL ODBC, and R integration**. The most important near-term concern is the **nested-data filtering correctness bug** ([#49392](https://github.com/apache/arrow/issues/49392)), though the existence of a same-day fix PR is encouraging. The project is also showing good discipline in **CI strengthening**, especially for large-memory and platform-specific cases. Strategically, the strongest signal is that Arrow is continuing to evolve from a foundational memory/data format into a more complete **cross-language analytical connectivity and execution platform**.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*