# Apache Doris Ecosystem Digest 2026-03-23

> Issues: 6 | PRs: 26 | Projects covered: 10 | Generated: 2026-03-23 01:23 UTC

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

# Apache Doris Project Digest — 2026-03-23

## 1. Today's Overview

Apache Doris remained highly active over the last 24 hours, with **26 pull requests updated** and **6 issues updated**, indicating strong ongoing engineering throughput despite **no new release published today**.  
Current work is concentrated in three areas: **lakehouse/external catalog expansion**, **query/profile correctness and observability**, and **storage/query execution performance tuning**.  
Merged and closed work today mostly focused on **connector stability** and **test/cloud fixes**, while the open PR queue shows meaningful forward motion on larger roadmap items such as **Delta Lake support**, **ANN vector indexing**, and **global TSO**.  
Issue activity was relatively light, but several updated items point to persistent user needs around **UDF behavior, plugin compatibility, and external catalog interoperability**.

---

## 3. Project Progress

### Merged/Closed PRs today

#### 1) MaxCompute connector stability and large-write optimization
- [#61245](https://github.com/apache/doris/pull/61245) — **[fix](mc) fix memory leak and optimize large data write for MaxCompute connector**
- Status: **Closed**
- Impact:
  - Fixes potential **memory leaks** in both MaxCompute JNI scanner and writer lifecycle handling.
  - Improves robustness for **large data writes**, which matters for production connector workloads and long-running ETL/export jobs.
- Technical significance:
  - This is a meaningful connector-hardening change for Doris’ external data ecosystem.
  - It suggests active investment in making non-native compute/storage integrations more production-safe.

#### 2) Cloud test/auth fix landed and was backported
- [#61594](https://github.com/apache/doris/pull/61594) — **[fix](cloud) Fix case `test_database_management_auth`**
- Status: **Closed**
- Follow-up backports:
  - [#61597](https://github.com/apache/doris/pull/61597) — branch-4.0
  - [#61598](https://github.com/apache/doris/pull/61598) — branch-4.1
- Impact:
  - Addresses a cloud authorization/database-management test case.
  - Immediate cherry-picks into maintained branches indicate the fix is considered relevant for supported release lines.
- Technical significance:
  - Good signal for release branch hygiene and cloud feature stabilization.

#### 3) Older or lower-priority PRs closed without clear feature delivery
- [#60957](https://github.com/apache/doris/pull/60957) — **[only test now] opt-inline-agg-func**
- [#56022](https://github.com/apache/doris/pull/56022) — **[fix](json) Using CastToString::from_number to cast float to string**
- Status: **Closed**
- Assessment:
  - These closures appear more like queue cleanup / stale lifecycle management than major delivered functionality today.

### What progress is being advanced in open PRs

Although not merged yet, several active PRs signal where Doris engineering is moving:

- **Lakehouse/catalog reach**
  - [#61602](https://github.com/apache/doris/pull/61602) — Delta Lake catalog support
  - [#61485](https://github.com/apache/doris/pull/61485) — data lake reader refactor
- **Query engine correctness and profiling**
  - [#61601](https://github.com/apache/doris/pull/61601) — SummaryProfile and StmtExecutor metric fixes
  - [#61603](https://github.com/apache/doris/pull/61603) — refactor SummaryProfile to dynamic tracing
- **Execution/storage performance**
  - [#61535](https://github.com/apache/doris/pull/61535) — adaptive batch sizing for SegmentIterator
  - [#57410](https://github.com/apache/doris/pull/57410) — 2Q-LRU filecache hotspot protection
  - [#61276](https://github.com/apache/doris/pull/61276) — cast compilation-time optimization
- **Advanced search/vector capabilities**
  - [#61160](https://github.com/apache/doris/pull/61160) — ANN IVF on-disk index
  - [#61596](https://github.com/apache/doris/pull/61596) — deterministic inverted-index reader selection
  - [#61599](https://github.com/apache/doris/pull/61599) — slash parsing fix in search query_string
- **Distributed transaction/time semantics**
  - [#61199](https://github.com/apache/doris/pull/61199) — global monotonically increasing TSO

Overall, today’s merged work was modest, but the **open pipeline is strategically important**.

---

## 4. Community Hot Topics

### 1) Community onboarding / contribution funnel remains highly active
- [Issue #17176](https://github.com/apache/doris/issues/17176) — **[Good First Issue] Doris' Future**
- Comments: **187**, Reactions: **37**
- Why it matters:
  - This remains one of the most active community threads, functioning as a contributor onboarding hub.
  - It indicates Doris still benefits from a broad contributor base and active mentorship pathways.
- Technical need behind it:
  - Sustained platform growth requires maintainers to keep a healthy stream of approachable FE/BE/documentation/test tasks.

### 2) Delta Lake support is becoming a major roadmap topic
- [PR #61602](https://github.com/apache/doris/pull/61602) — **Support Delta Lake catalog for reading Delta Lake tables**
- Why it matters:
  - This is one of the strongest roadmap signals in today’s PR set.
  - It expands Doris’ role as a **lakehouse query engine**, especially for organizations standardizing on Delta Lake metadata/layouts.
- Technical need behind it:
  - Users increasingly expect one engine to query across Hive/Iceberg/Delta ecosystems with predicate pushdown and deletion-vector awareness.

### 3) Query observability/profiling is under active improvement
- [PR #61601](https://github.com/apache/doris/pull/61601) — metric reporting bug fixes  
- [PR #61603](https://github.com/apache/doris/pull/61603) — dynamic tracing refactor
- Why it matters:
  - Better profile accuracy directly affects tuning, root-cause analysis, and planner/operator diagnostics.
- Technical need behind it:
  - As Doris adds more optimizer and execution complexity, static/hard-coded profiling structures become harder to maintain and easier to get wrong.

### 4) Vector search scalability remains a visible investment area
- [PR #61160](https://github.com/apache/doris/pull/61160) — **IVF on-disk index type for ANN**
- Why it matters:
  - This targets memory scalability for vector search, a key blocker for large embedding workloads.
- Technical need behind it:
  - Users want approximate nearest neighbor search without forcing the whole IVF structure into RAM.

### 5) Iceberg REST interoperability gaps are still surfacing
- [Issue #61388](https://github.com/apache/doris/issues/61388) — **Support custom HTTP headers for REST Iceberg catalog**
- Why it matters:
  - This is a practical interoperability issue, especially for secured enterprise catalog services.
- Technical need behind it:
  - Real deployments often require custom auth headers, proxy headers, or vendor-specific routing metadata.

---

## 5. Bugs & Stability

Ranked by likely production severity based on the provided context.

### High severity

#### A) MaxCompute connector memory leak / large write path risks
- Fix PR: [#61245](https://github.com/apache/doris/pull/61245)
- Status: **Closed**
- Risk:
  - Memory leaks in JNI scanner/writer code can destabilize long-running jobs and connector-heavy deployments.
  - Large data write optimization hints prior pain in throughput or failure scenarios.
- Current outlook:
  - Positive: a fix exists and has been merged/closed.

#### B) Parallel outfile deletion race may cause data loss or inconsistent export results
- [PR #61223](https://github.com/apache/doris/pull/61223) — **handle delete_existing_files before parallel export**
- Status: **Open**
- Risk:
  - If parallel writers race while cleaning target directories, one worker may delete files produced by another.
  - This is a correctness/stability issue for `SELECT ... INTO OUTFILE`.
- Current outlook:
  - No merged fix yet; deserves attention.

### Medium severity

#### C) Query/profile metrics may be incorrect or misleading
- [PR #61601](https://github.com/apache/doris/pull/61601) — **Fix bugs in SummaryProfile and StmtExecutor metric reporting**
- Status: **Open**
- Risk:
  - Wrong metric accumulation and reporting can mislead diagnosis, performance analysis, and regression triage.
- Related refactor:
  - [#61603](https://github.com/apache/doris/pull/61603)

#### D) Inverted index selection nondeterminism on multi-index columns
- [PR #61596](https://github.com/apache/doris/pull/61596) — **Make select_best_reader deterministic for multi-index columns**
- Status: **Open**
- Risk:
  - Nondeterministic reader choice can lead to unstable performance and potentially inconsistent analyzer matching behavior.

#### E) Search parser mishandles slash-containing terms
- [PR #61599](https://github.com/apache/doris/pull/61599) — **Fix slash character in search query_string terms**
- Status: **Open**
- Risk:
  - Search expressions like `AC/DC` can be tokenized incorrectly, affecting query correctness in text search use cases.

### Lower-to-medium severity / user-reported bugs

#### F) UDF name conflict with system function `date_sub`
- [Issue #37083](https://github.com/apache/doris/issues/37083) — **Closed as stale**
- Risk:
  - Function namespace collision between user-defined alias function and system builtin may create SQL ambiguity or broken expected behavior.
- Current outlook:
  - Closed stale, but the technical concern itself may still matter to users operating custom UDF namespaces.

#### G) IPv4/IPv6 Java UDF development issue
- [Issue #56229](https://github.com/apache/doris/issues/56229) — **Open**
- Risk:
  - Indicates usability/compatibility issues in UDF development for IP address handling.
- Current outlook:
  - Still open; no corresponding fix PR identified in today’s data.

#### H) Kettle stream load plugin field-order serialization bug
- [Issue #56355](https://github.com/apache/doris/issues/56355) — **Open**
- Risk:
  - Potential data mapping corruption when source and target field orders differ.
  - This is important for ETL users relying on Kettle/PDI integration.
- Current outlook:
  - No fix PR visible in today’s set.

---

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals from open work

#### 1) Delta Lake catalog support
- [PR #61602](https://github.com/apache/doris/pull/61602)
- Likelihood:
  - **High** as a next-version or near-term feature if review progresses smoothly.
- Why:
  - This is a substantial strategic addition aligned with Doris’ multi-catalog/lakehouse direction.

#### 2) Iceberg REST custom headers
- [Issue #61388](https://github.com/apache/doris/issues/61388)
- Likelihood:
  - **Moderate to high** for a future connector interoperability improvement.
- Why:
  - It is standards-aligned and enterprise-driven; relatively contained compared with a new catalog type.

#### 3) ANN IVF on-disk index
- [PR #61160](https://github.com/apache/doris/pull/61160)
- Likelihood:
  - **Moderate to high** for a forthcoming major/minor release.
- Why:
  - Vector search is an active investment area, and on-disk IVF addresses a real scale bottleneck.

#### 4) Global Timestamp Oracle (TSO)
- [PR #61199](https://github.com/apache/doris/pull/61199)
- Likelihood:
  - **Moderate**
- Why:
  - Tagged for `dev/5.0.x`, which suggests broader architectural relevance rather than an immediate patchline inclusion.

#### 5) Recycle bin three-phase retention
- [PR #61504](https://github.com/apache/doris/pull/61504)
- Likelihood:
  - **Moderate**
- Why:
  - Operational lifecycle and data retention control are useful for enterprise governance.

#### 6) `SPLIT_BY_STRING(..., ..., limit)` enhancement
- [Issue #55788](https://github.com/apache/doris/issues/55788) — closed stale
- Likelihood:
  - **Low to moderate** unless re-proposed with broader demand.
- Why:
  - SQL ergonomics enhancement, but not currently active.

### Prediction for next version themes

Based on today’s activity, the next Doris version is most likely to emphasize:

- **External lakehouse/catalog interoperability**
- **Query profile accuracy and tracing**
- **Storage/cache performance tuning**
- **Search/vector indexing maturity**
- **Connector reliability**

---

## 7. User Feedback Summary

Today’s issue and PR stream reveals several concrete user pain points:

### 1) Interoperability with external ecosystems is a top practical need
Users want Doris to behave well with:
- **Iceberg REST catalogs** requiring custom headers  
  - [#61388](https://github.com/apache/doris/issues/61388)
- **Delta Lake tables** via new catalog support  
  - [#61602](https://github.com/apache/doris/pull/61602)
- **MaxCompute connector** reliability  
  - [#61245](https://github.com/apache/doris/pull/61245)

This reflects Doris’ growing use as a federated analytical engine rather than a standalone warehouse only.

### 2) Users care about correctness in edge-case SQL/function behavior
Examples:
- UDF conflict with built-in `date_sub`  
  - [#37083](https://github.com/apache/doris/issues/37083)
- Search parser handling of `/` in terms  
  - [#61599](https://github.com/apache/doris/pull/61599)
- Multi-index inverted reader determinism  
  - [#61596](https://github.com/apache/doris/pull/61596)

These are not flashy features, but they strongly affect trust in production behavior.

### 3) ETL and plugin integration still generate friction
- Kettle stream load plugin field order bug  
  - [#56355](https://github.com/apache/doris/issues/56355)
- IPv4/IPv6 UDF development difficulties  
  - [#56229](https://github.com/apache/doris/issues/56229)

This suggests some of the user pain is not core SQL execution, but the surrounding ingestion and extension ecosystem.

### 4) Performance work is aligned with real operational bottlenecks
Open PRs target:
- file cache hotspot retention  
  - [#57410](https://github.com/apache/doris/pull/57410)
- adaptive scan batch sizing  
  - [#61535](https://github.com/apache/doris/pull/61535)
- compile-time optimization  
  - [#61276](https://github.com/apache/doris/pull/61276)

This indicates maintainers are still investing in the “last mile” of throughput, latency, and efficiency.

---

## 8. Backlog Watch

These items appear to need maintainer attention due to age, practical relevance, or risk of user frustration.

### 1) Long-running community umbrella thread
- [Issue #17176](https://github.com/apache/doris/issues/17176) — **[Good First Issue] Doris' Future**
- Concern:
  - High engagement is positive, but such a long-lived thread can become noisy or hard to curate.
- Suggested maintainer action:
  - Periodically refresh issue lists, archive outdated subtopics, and point contributors to active starter tasks.

### 2) IPv4/IPv6 UDF issue remains open
- [Issue #56229](https://github.com/apache/doris/issues/56229)
- Concern:
  - UDF developer ergonomics are strategically important for extensibility.
- Suggested maintainer action:
  - Clarify whether this is a docs gap, type-system limitation, or runtime bug.

### 3) Kettle stream load plugin bug may affect correctness of ingested data
- [Issue #56355](https://github.com/apache/doris/issues/56355)
- Concern:
  - Field-order mismatch in serialization is a real ETL correctness risk.
- Suggested maintainer action:
  - Prioritize triage, reproduce, and determine whether plugin behavior should map by name rather than ordinal.

### 4) Parallel outfile deletion race still open
- [PR #61223](https://github.com/apache/doris/pull/61223)
- Concern:
  - Potential export correctness/data-loss bug.
- Suggested maintainer action:
  - Review quickly due to production impact.

### 5) Stale closures may be hiding unresolved functional gaps
- [Issue #37083](https://github.com/apache/doris/issues/37083)
- [Issue #55788](https://github.com/apache/doris/issues/55788)
- [PR #56022](https://github.com/apache/doris/pull/56022)
- Concern:
  - Stale handling keeps the queue manageable, but some closed items may represent real unresolved SQL compatibility or usability gaps.
- Suggested maintainer action:
  - Re-check whether common user scenarios are being lost through automated stale closure.

---

## Overall Health Assessment

Project health looks **strong**, with **high PR activity** and a technically meaningful open pipeline. The most important signals today are Doris’ continued expansion as a **multi-format analytical engine** and ongoing work to improve **execution correctness, profiling accuracy, and production stability**.  
The main risk area is not lack of development velocity, but ensuring that **user-reported integration bugs and stale-tagged compatibility issues** receive enough maintainer follow-up before they become recurring adoption friction.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-23

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, but the projects are converging around a few common priorities: **lakehouse interoperability, query correctness, observability, and production hardening**.  
Engine-centric systems like **ClickHouse, Apache Doris, StarRocks, Databend, and DuckDB** are increasingly competing not just on raw performance, but on their ability to integrate with **Iceberg, Delta Lake, object storage, external catalogs, and vector/search workloads**.  
At the same time, table-format and execution-substrate projects such as **Apache Iceberg, Delta Lake, Apache Arrow, Velox, and Gluten** are shaping the broader stack by improving interoperability, execution backends, and connector correctness.  
Overall, the landscape looks healthy: **ClickHouse and Doris show the strongest visible engineering throughput**, while several others are in focused stabilization or infrastructure-heavy phases.

---

## 2. Activity Comparison

### Daily activity snapshot

| Project | Issues Updated | PRs Updated | Release Today | Health Score* | Key Signal |
|---|---:|---:|---|---:|---|
| **ClickHouse** | 35 | 212 | No | **9.5/10** | Highest throughput; strong engine hardening, CI, Iceberg fixes |
| **Apache Doris** | 6 | 26 | No | **8.8/10** | Strong roadmap flow in lakehouse, profiling, performance, vectors |
| **Apache Iceberg** | 2 | 21 | No | **8.4/10** | Healthy implementation pace; Spark/Kafka Connect correctness focus |
| **Apache Gluten** | 5 | 9 | No | **8.0/10** | Active Spark 4 and Velox integration stabilization |
| **DuckDB** | 10 | 8 | No | **8.0/10** | Moderate activity; strong post-release correctness/stability focus |
| **Databend** | 0 | 6 | **Yes (nightly)** | **7.9/10** | Steady engine refinement; join/storage work continues |
| **Velox** | 0 | 8 | No | **7.7/10** | Healthy infra/compatibility work; no visible issue pressure |
| **Apache Arrow** | 20 | 6 | No | **7.6/10** | Maintenance-heavy; ORC pushdown and build/sanitizer issues visible |
| **StarRocks** | 2 | 4 | No | **7.1/10** | Low activity day; open Iceberg correctness issue is significant |
| **Delta Lake** | 1 | 1 | No | **6.8/10** | Quiet day; little visible product motion |

\*Health score is a qualitative synthesis of throughput, severity of open risks, release hygiene, and strategic progress signals from today’s digests.

---

## 3. Apache Doris's Position

### Where Doris is strong versus peers
Apache Doris currently sits in a strong middle-ground between **very high-velocity systems like ClickHouse** and **more focused/stabilizing projects like DuckDB or StarRocks**. Its biggest advantages today are:

- **Broad strategic pipeline** across:
  - lakehouse/catalog expansion (**Delta Lake catalog, Iceberg REST gaps**)
  - execution and storage tuning (**adaptive batch sizing, file cache hotspot protection**)
  - search/vector features (**ANN IVF on-disk index, inverted index fixes**)
  - distributed transaction semantics (**global TSO**)
- **Healthy contributor funnel**, evidenced by the unusually active long-running onboarding issue.
- **Balanced product scope**: Doris is simultaneously investing in core OLAP execution, federated catalogs, connectors, observability, and vector/search capabilities.

### Technical approach differences vs peers
Compared with other engines:

- **Vs ClickHouse**: Doris is less visibly dominated by core-engine micro-optimization and CI scale, but more clearly emphasizing **multi-catalog/lakehouse interoperability** as a first-class product direction.
- **Vs StarRocks**: Doris shows broader public activity and more diversified roadmap motion; StarRocks today appears more exposed to external-table correctness risk.
- **Vs DuckDB**: Doris is much more focused on **distributed analytical serving and external ecosystem integration**, whereas DuckDB is centered on embedded analytics and local/runtime correctness.
- **Vs Iceberg/Delta Lake**: Doris is a consuming/serving engine, not a table-format standard, so its differentiation depends on **query federation and execution quality** rather than metadata protocol governance.
- **Vs Velox/Gluten/Arrow**: Doris is an end-user database product rather than an execution substrate or library layer.

### Community size comparison
On visible GitHub throughput today:

- **ClickHouse** remains the clear volume leader.
- **Doris** appears in the **upper tier** of end-user analytical engines.
- Doris’ community appears **larger and more active than StarRocks, Databend, and DuckDB on this day**, though smaller than ClickHouse in raw issue/PR scale.
- The active onboarding thread suggests Doris also has a stronger visible **contributor incubation mechanism** than many peers.

---

## 4. Shared Technical Focus Areas

Several needs are emerging across multiple engines at once.

### A. Lakehouse interoperability and external catalog support
**Engines:** Doris, ClickHouse, StarRocks, Iceberg, Velox, Arrow, Delta Lake  
**Specific needs:**
- Doris: **Delta Lake catalog**, Iceberg REST custom headers, MaxCompute reliability
- ClickHouse: **Iceberg insert correctness**, metadata refresh after external updates
- StarRocks: **Iceberg cache correctness**
- Iceberg: migration from **Delta Lake/Hive layouts**, cloud FileIO consistency
- Velox: **Paimon append-table** support
- Arrow: ORC selective scan foundations
- Delta Lake: Spark/Unity Catalog compatibility maintenance

**Pattern:** The ecosystem is shifting from standalone engines to **federated analytical platforms** that must coexist with multiple metadata/control planes.

### B. Query correctness and semantic edge cases
**Engines:** Doris, ClickHouse, DuckDB, Databend, Iceberg, Gluten, Arrow  
**Specific needs:**
- Doris: profile metric correctness, parser fixes, deterministic inverted-index behavior
- ClickHouse: correlated subqueries, exact-count optimization, null semantics
- DuckDB: `DELETE ... RETURNING`, function chaining consistency
- Databend: `UNION` parentheses preservation
- Iceberg: Spark timestamp-as-of determinism, nested schema correctness
- Gluten: Spark 4 validation correctness
- Arrow: Gandiva crash on extreme inputs

**Pattern:** As SQL surfaces broaden, the frontier is increasingly **semantic reliability in corner cases**, not just headline features.

### C. Observability, profiling, and diagnosability
**Engines:** Doris, ClickHouse, StarRocks, Gluten, Arrow  
**Specific needs:**
- Doris: **SummaryProfile** fixes and dynamic tracing refactor
- ClickHouse: `system.error_log` improvements, randomized test diagnosis
- StarRocks: per-catalog metrics documentation signal
- Gluten: S3 split-add metrics and plan stability golden files
- Arrow: developer-facing docs and execution architecture clarity

**Pattern:** Operators increasingly need better introspection because engine behavior is more complex across optimizer, external-table, and cloud paths.

### D. Storage/read-path performance tuning
**Engines:** Doris, ClickHouse, Databend, Arrow, StarRocks  
**Specific needs:**
- Doris: adaptive scan batch sizing, file cache hotspot protection
- ClickHouse: parallel read-in-order, statistics-based part pruning
- Databend: bloom index small-read optimization, recluster block sizing
- Arrow: ORC predicate pushdown
- StarRocks: new column buffer abstraction

**Pattern:** Read-path efficiency remains a top battleground, especially for selective scans and mixed local/object-store deployments.

### E. Cloud/object storage operational behavior
**Engines:** ClickHouse, Iceberg, Gluten, Velox, Doris  
**Specific needs:**
- ClickHouse: object storage metadata/cache abstractions
- Iceberg: consistent cloud 404 handling
- Gluten/Velox: S3 executor pool sizing and performance tuning
- Doris: cloud auth/test stabilization
  
**Pattern:** Cloud-native operation is now assumed; projects are tuning concurrency, error normalization, and metadata behavior for object stores.

### F. Vector/search and nontraditional analytical retrieval
**Engines:** Doris, StarRocks, Velox indirectly  
**Specific needs:**
- Doris: **ANN IVF on-disk indexing**, text-search parser correctness
- StarRocks: OpenSearch connector
- Velox: early GPU/fused execution experimentation

**Pattern:** Analytical engines are expanding into **vector retrieval, search integration, and heterogeneous execution**.

---

## 5. Differentiation Analysis

### Storage format orientation
- **Doris / ClickHouse / StarRocks / Databend / DuckDB**: full SQL engines with native storage plus varying levels of external table support.
- **Iceberg / Delta Lake**: table-format and transaction-layer standards, not query engines.
- **Arrow / Velox / Gluten**: execution/data infrastructure layers that other engines embed or integrate.

### Query engine design
- **ClickHouse**: highly optimized, performance-first analytical database with heavy investment in planner/execution internals and CI.
- **Doris**: distributed MPP OLAP engine with increasing focus on **federated lakehouse access + serving**.
- **StarRocks**: similar broad category to Doris, but today’s snapshot shows less visible breadth and more concentrated external-table risk.
- **DuckDB**: in-process/embedded vectorized analytics engine focused on developer ergonomics and local correctness.
- **Databend**: cloud-oriented analytical engine with active work on joins and storage abstraction.
- **Velox/Gluten**: native execution layers, especially relevant to Spark acceleration and backend portability.
- **Arrow**: foundational columnar memory + compute ecosystem rather than a complete SQL engine.

### Target workloads
- **Doris / StarRocks**: interactive analytics, real-time OLAP, lakehouse federation, increasingly search/vector-adjacent workloads.
- **ClickHouse**: very large-scale analytical queries, observability/log analytics, high-ingest OLAP.
- **DuckDB**: local analytics, notebook/data science, embedded app analytics.
- **Databend**: cloud data warehouse and storage-compute style workloads.
- **Iceberg / Delta**: shared table layer for multi-engine data lakes.
- **Gluten / Velox**: accelerating Spark/native execution.
- **Arrow**: interoperability, embedded analytics infrastructure, file/scan layer.

### SQL compatibility posture
- **ClickHouse**: expanding compatibility, but still strongly shaped by its own engine semantics.
- **Doris**: pragmatic SQL/database experience plus growing ecosystem compatibility.
- **DuckDB**: high usability expectations and strong focus on SQL consistency.
- **Gluten/Velox**: compatibility driven by Spark/Presto ecosystems.
- **Iceberg/Delta**: compatibility expressed through engine integrations rather than SQL dialect ownership.

---

## 6. Community Momentum & Maturity

### Tier 1: Rapidly iterating
- **ClickHouse**
- **Apache Doris**

These projects show the strongest public engineering momentum. ClickHouse leads in absolute throughput; Doris stands out for breadth across connectors, lakehouse, profiling, vector/search, and execution tuning.

### Tier 2: Active but more focused
- **Apache Iceberg**
- **Apache Gluten**
- **DuckDB**
- **Databend**

These are moving meaningfully, but with more concentrated themes:
- Iceberg: correctness, migration, connectors
- Gluten: Spark 4 and Velox stabilization
- DuckDB: post-release correctness and embedded runtime quality
- Databend: incremental engine internals and nightly delivery

### Tier 3: Steady / selective motion
- **Velox**
- **Apache Arrow**
- **StarRocks**

These projects remain important, but today’s visible activity is more selective:
- Velox: integration and roadmap experiments
- Arrow: maintenance and substrate improvements
- StarRocks: lower visible throughput, with one notable correctness concern dominating

### Tier 4: Quiet / stabilizing
- **Delta Lake**

Delta Lake appears stable but relatively quiet in this snapshot, with visible activity focused more on governance transparency and test compatibility than feature delivery.

---

## 7. Trend Signals

### 1. Lakehouse interoperability is now table stakes
Users increasingly expect engines to query **Iceberg, Delta, Hive, search systems, and object stores** without friction.  
**Value to architects:** prioritize engines with strong external catalog semantics and cache correctness, not just native performance.

### 2. Correctness in edge semantics is becoming a competitive factor
Across many projects, issues now center on **silent wrong answers, planner edge cases, stale caches, or transactional visibility**, rather than basic feature absence.  
**Value to data engineers:** engine selection should include review of correctness posture for external tables, `RETURNING`, time travel, pruning, and advanced SQL paths.

### 3. Observability is moving from “nice to have” to essential
Profiling, error logs, dynamic tracing, and plan stability tooling are recurring priorities.  
**Value to operators:** mature observability increasingly determines time-to-resolution in production more than benchmark numbers alone.

### 4. Read-path efficiency is shifting toward metadata-aware pruning
Whether via ORC stripe stats, Iceberg metadata handling, part pruning, bloom indexes, or cache policies, many projects are trying to avoid unnecessary IO before execution starts.  
**Value to architects:** metadata quality and pruning intelligence are now central to cloud cost efficiency.

### 5. Cloud and object storage tuning remain operational pain points
S3 concurrency, metadata refresh, 404 normalization, and executor pool sizing appear across multiple stacks.  
**Value to platform teams:** production readiness in cloud object stores should be evaluated explicitly; defaults are often still evolving.

### 6. Analytical engines are broadening into search, vectors, and hybrid retrieval
Doris’ ANN work, StarRocks’ OpenSearch connector, and Velox’s GPU experimentation point to a broader expansion of what “analytical engine” means.  
**Value to architects:** some engines are evolving toward **unified analytical + retrieval platforms**, which may reduce system sprawl for mixed BI/search/AI workloads.

---

## Bottom Line

**Apache Doris is in a strong position**: not the highest-volume project in the ecosystem, but one of the most balanced in terms of roadmap breadth, community energy, and relevance to modern federated analytics.  
For decision-makers, the most important ecosystem-wide pattern is clear: the winners are increasingly those that combine **fast SQL execution** with **lakehouse interoperability, correctness, observability, and cloud-native operational maturity**.  
If you want, I can next turn this into a **1-page executive brief**, **radar chart comparison**, or a **Doris-vs-ClickHouse-vs-StarRocks decision matrix**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-23

## 1. Today's Overview

ClickHouse remained very active over the last 24 hours: **35 issues updated** and **212 pull requests updated**, with **61 PRs merged/closed** and **16 issues closed**. The project looks healthy from a delivery perspective, with a strong stream of bugfix, performance, CI, and feature work moving in parallel. The dominant themes today were **query engine correctness**, **read-path performance**, **Iceberg integration fixes**, and **test/CI hardening**. Stability remains a visible focus, though the issue stream still shows a steady inflow of **CI crash reports** and **fuzzer-found edge cases**.

## 2. Project Progress

No new release was published today, but the PR stream shows meaningful forward progress in several core areas.

### Query engine and execution correctness
Open bugfix PRs indicate active work on subtle planner/expression correctness issues:

- [#100293](https://github.com/ClickHouse/ClickHouse/pull/100293) — **Fix defaultImplementationForNulls returning wrong constness at 0 rows**  
  Important for header-only execution paths and DAG correctness; this is a low-level engine fix that can prevent misbehavior in constant folding and query planning.
- [#100398](https://github.com/ClickHouse/ClickHouse/pull/100398) — **Fix exception when building set from correlated subquery with PLACEHOLDER actions**  
  Signals continued hardening of advanced SQL planning, especially around correlated subqueries and `IN` set construction.
- [#100408](https://github.com/ClickHouse/ClickHouse/pull/100408) — **Fix TOO_MANY_ROWS exception during exact count optimization with multiple parts**  
  Affects `SELECT count()` optimization paths and aggregate projection logic.

### Storage, table operations, and object formats
Storage-layer improvements and external table format work are especially visible:

- [#98597](https://github.com/ClickHouse/ClickHouse/pull/98597) — **Optimize `TRUNCATE DATABASE TABLES LIKE` by pre-cancelling merges in parallel**  
  Practical operational improvement for large deployments with many MergeTree tables.
- [#100404](https://github.com/ClickHouse/ClickHouse/pull/100404) — **Fix bad cast when inserting into Iceberg table partitioned by year/month/day on Date column**  
  Important for ClickHouse–Iceberg interoperability.
- [#100407](https://github.com/ClickHouse/ClickHouse/pull/100407) — **Fix exception when Iceberg format version is upgraded by external tool**  
  Addresses metadata cache staleness after Spark or other engines modify Iceberg table metadata.
- [#100371](https://github.com/ClickHouse/ClickHouse/pull/100371) — **Add `borrow_from_cache` object storage and `memory` metadata types**  
  Early signal of ongoing experimentation in storage abstraction and ephemeral/object-backed metadata handling.

### Performance work
Read-path optimization is a major theme today:

- [#100394](https://github.com/ClickHouse/ClickHouse/pull/100394) — **Parallel read in order with multiple parts**
- [#100391](https://github.com/ClickHouse/ClickHouse/pull/100391) — **Parallelize read-in-order from a single part with `PrefetchingConcatProcessor`**
- [#100155](https://github.com/ClickHouse/ClickHouse/pull/100155) — **Skip expensive `readLockParts()` in `tryGetSerializationHints()`**  
  This specifically targets a regression in `system.columns` metadata access.
- [#94140](https://github.com/ClickHouse/ClickHouse/pull/94140) — **Add statistics-based part pruning**  
  Still open, but notable as a roadmap-level optimization that could materially improve scan efficiency.

### CI and quality engineering
ClickHouse continues investing heavily in making CI more failure-finding and more explainable:

- [#100385](https://github.com/ClickHouse/ClickHouse/pull/100385) — **Repeat recently modified tests with different randomized settings**
- [#98677](https://github.com/ClickHouse/ClickHouse/pull/98677) — **Add all aarch64 build variants and complete stress test matrix**
- [#99513](https://github.com/ClickHouse/ClickHouse/pull/99513) — **Replace sanitize coverage with LLVM source-based coverage**
- [#100410](https://github.com/ClickHouse/ClickHouse/pull/100410) — **Round Float64 test results for CI stability under TSan**

Overall, progress is strongest in **engine hardening**, **MergeTree read performance**, **format interoperability**, and **test infrastructure sophistication**.

## 3. Community Hot Topics

These were the most discussed issues and PRs in the visible data, and they reflect where users and maintainers are feeling the most pressure.

### 1) CI crash in compact parts / multi-index path
- [Issue #99799](https://github.com/ClickHouse/ClickHouse/issues/99799) — **Double deletion of `MergeTreeDataPartCompact` in `multi_index`**  
  This is the most commented issue in the list. The underlying need is obvious: users and maintainers want stronger memory/lifecycle safety in complex MergeTree code paths, especially under CI stress and newer indexing combinations.

### 2) Keeper thread prioritization
- [Issue #39733](https://github.com/ClickHouse/ClickHouse/issues/39733) — **Set `nice` for ClickHouse Keeper threads to make them prioritized**  
  Even though this issue was closed, the discussion highlights an operational concern: when a node is overloaded, Keeper responsiveness is critical. This reflects production users’ need for stronger separation between coordination-path latency and heavy data-plane workloads.

### 3) Pipeline execution crash during data source preparation
- [Issue #100296](https://github.com/ClickHouse/ClickHouse/issues/100296) — **Failed preparation of data source in pipeline execution**  
  This points to continued complexity in the modern execution pipeline. These errors matter because they can affect broad classes of queries, not just niche features.

### 4) Removing legacy Parquet reader/writer code paths
- [Issue #100126](https://github.com/ClickHouse/ClickHouse/issues/100126) — **Remove old Parquet writer/reader toggles**  
  This is a roadmap-cleanup discussion. The technical need is to simplify maintenance by retiring fallback code paths once the new native implementations have matured enough.

### 5) Better diagnosis of randomized-setting test failures
- [Issue #100178](https://github.com/ClickHouse/ClickHouse/issues/100178) — **Diagnose tests failed due to randomized settings**
- [PR #100385](https://github.com/ClickHouse/ClickHouse/pull/100385) — **Repeat recently modified tests with different randomized settings**  
  Together, these show a sophisticated quality strategy: not just finding flaky tests, but automatically narrowing down which random settings trigger them.

### 6) SQL console / web terminal direction
- [PR #100277](https://github.com/ClickHouse/ClickHouse/pull/100277) — **Add web terminal interface to clickhouse-server**
- [PR #100406](https://github.com/ClickHouse/ClickHouse/pull/100406) — **Adds SQL Console UI**  
  These are strong product signals. The technical need is better in-product accessibility, likely for cloud, demos, support workflows, and lower-friction administration.

## 4. Bugs & Stability

Ranked roughly by severity and likely impact:

### Critical / high severity

1. **Interserver authentication bypass / information leak risk**
   - [PR #99854](https://github.com/ClickHouse/ClickHouse/pull/99854) — **Fix unauthenticated `TablesStatusRequest` in interserver mode**  
   This is the most serious item today. It is labeled **must-backport** and **critical-bugfix**. The description indicates a client could spoof interserver mode before cluster-secret authentication and obtain table status information.

2. **Iceberg insert partitioning bad cast**
   - [PR #100404](https://github.com/ClickHouse/ClickHouse/pull/100404) — **Fix bad cast exception when inserting into Iceberg table partitioned by year/month/day on Date column**  
   High severity for users integrating ClickHouse with Iceberg-backed data lakes.

3. **Kafka table DROP TABLE hang**
   - [PR #100388](https://github.com/ClickHouse/ClickHouse/pull/100388) — **Fix DROP TABLE hang on Kafka tables after consumer heartbeat error**  
   Operationally severe because it can wedge DDL and cleanup flows in streaming environments.

### Medium severity

4. **Exact count optimization throws `TOO_MANY_ROWS` incorrectly**
   - [PR #100408](https://github.com/ClickHouse/ClickHouse/pull/100408)  
   Query can fail during an optimization path that should be transparent to users.

5. **Exception in correlated subquery set-building**
   - [PR #100398](https://github.com/ClickHouse/ClickHouse/pull/100398)  
   Impacts advanced SQL planning and fuzz-tested edge cases.

6. **Pipeline execution crashes**
   - [Issue #100296](https://github.com/ClickHouse/ClickHouse/issues/100296)
   - [Issue #99295](https://github.com/ClickHouse/ClickHouse/issues/99295)
   - [Issue #100393](https://github.com/ClickHouse/ClickHouse/issues/100393)  
   These suggest the execution engine still has unstable edges under CI/stress.

### Ongoing fuzz/debug-build instability

Several fuzzer issues were closed quickly as obsolete-version reports, while others remain open:

- Open:
  - [#100328](https://github.com/ClickHouse/ClickHouse/issues/100328) — `ColumnsDescription::rename_aborted`
  - [#100325](https://github.com/ClickHouse/ClickHouse/issues/100325) — `IAST::setAlias_aborted`
  - [#100324](https://github.com/ClickHouse/ClickHouse/issues/100324) — `InterpreterCreateQuery_aborted`
  - [#100320](https://github.com/ClickHouse/ClickHouse/issues/100320) — `executeQueryImpl_aborted`
  - [#100318](https://github.com/ClickHouse/ClickHouse/issues/100318) — `FunctionIn_Aborted`
  - [#100158](https://github.com/ClickHouse/ClickHouse/issues/100158) — **Bad cast from type A to B**
- Closed as obsolete:
  - [#100329](https://github.com/ClickHouse/ClickHouse/issues/100329)
  - [#100327](https://github.com/ClickHouse/ClickHouse/issues/100327)
  - [#100326](https://github.com/ClickHouse/ClickHouse/issues/100326)
  - [#100323](https://github.com/ClickHouse/ClickHouse/issues/100323)
  - [#100322](https://github.com/ClickHouse/ClickHouse/issues/100322)
  - [#100321](https://github.com/ClickHouse/ClickHouse/issues/100321)
  - [#100319](https://github.com/ClickHouse/ClickHouse/issues/100319)

This pattern suggests maintainers are triaging fuzz noise efficiently, but there is still substantial parser/planner/debug-assert fragility surfacing in newer or debug configurations.

### Correctness issues closed today

- [Issue #90240](https://github.com/ClickHouse/ClickHouse/issues/90240) — **Incorrect results for `toYYYYMM(date)` partitioning combined with `toWeek(date, 3)` filtering**  
  A noteworthy correctness issue now closed; important because it touches partition pruning and date semantics.
- [Issue #47713](https://github.com/ClickHouse/ClickHouse/issues/47713) — **Non-cancellable query exceeding limits**  
  Closure here is positive for query governance and resource control.
- [Issue #89453](https://github.com/ClickHouse/ClickHouse/issues/89453) — **Projections not using `optimize_read_in_order`**  
  Closed, and related to the performance/read-order theme visible in current PRs.

## 5. Feature Requests & Roadmap Signals

### Strong signals

1. **SQL compatibility expansion**
   - [#99612](https://github.com/ClickHouse/ClickHouse/issues/99612) — Support `SET TIME ZONE INTERVAL '±hh:mm' HOUR TO MINUTE` and `SET SESSION CHARACTERISTICS`
   - [#99611](https://github.com/ClickHouse/ClickHouse/issues/99611) — Support compound interval literals like `INTERVAL 'h:mm' HOUR TO MINUTE`  
   These look like realistic candidates for a near-future version because they unblock compatibility with PostgreSQL-oriented clients and SQL tools.

2. **Observability/debuggability improvements**
   - [#74561](https://github.com/ClickHouse/ClickHouse/issues/74561) — Add more information to `system.error_log`  
   This is a practical, user-facing diagnostics enhancement with relatively clear scope. It has good odds of landing in a coming release.

3. **CLI and built-in UI ergonomics**
   - [#100405](https://github.com/ClickHouse/ClickHouse/issues/100405) — Better hard-tab support when pasting SQL into `clickhouse-client`
   - [#100277](https://github.com/ClickHouse/ClickHouse/pull/100277) — Web terminal
   - [#100406](https://github.com/ClickHouse/ClickHouse/pull/100406) — SQL Console UI  
   These point to a broader roadmap trend: making ClickHouse more accessible directly through the server/client experience, not only through external IDEs.

4. **Storage/optimizer intelligence**
   - [#94140](https://github.com/ClickHouse/ClickHouse/pull/94140) — Statistics-based part pruning  
   If merged, this would be a meaningful optimizer/storage improvement with visible performance impact on selective analytical workloads.

5. **Parquet simplification**
   - [#100126](https://github.com/ClickHouse/ClickHouse/issues/100126) — Remove old Parquet writer/reader paths  
   This is less of a user feature and more a maintainability signal. It suggests confidence in newer Parquet paths and likely further investment in lakehouse/file-format reliability.

### Likely next-version candidates
Most plausible based on maturity and current momentum:

- Iceberg fixes: [#100404](https://github.com/ClickHouse/ClickHouse/pull/100404), [#100407](https://github.com/ClickHouse/ClickHouse/pull/100407)
- Query engine bugfixes: [#100293](https://github.com/ClickHouse/ClickHouse/pull/100293), [#100398](https://github.com/ClickHouse/ClickHouse/pull/100398), [#100408](https://github.com/ClickHouse/ClickHouse/pull/100408)
- Performance improvements for read-in-order: [#100394](https://github.com/ClickHouse/ClickHouse/pull/100394), [#100391](https://github.com/ClickHouse/ClickHouse/pull/100391)
- SQL compatibility requests: [#99611](https://github.com/ClickHouse/ClickHouse/issues/99611), [#99612](https://github.com/ClickHouse/ClickHouse/issues/99612)

## 6. User Feedback Summary

The visible user and maintainer feedback today clusters around a few recurring pain points:

### 1) Reliability under advanced/edge execution paths
CI crash reports and fuzzer issues show that users and maintainers are still hitting edge conditions in:
- pipeline execution,
- AST/planner transformations,
- MergeTree part lifecycle management,
- debug-build assertions.

This does not imply widespread production instability, but it does show the engine’s complexity is creating a constant tail of corner cases.

### 2) Better interoperability with lakehouse ecosystems
Iceberg-related fixes and Parquet cleanup discussions indicate growing usage in mixed-engine environments. Users want ClickHouse to behave robustly when external tools such as Spark also modify metadata or partitions.

### 3) Better test explainability and less flakiness
The randomized-settings diagnostics effort suggests maintainers are feeling pain from nondeterministic failures. This usually correlates with a mature codebase where many regressions now hide in feature interactions rather than isolated components.

### 4) Operational responsiveness and metadata/query overhead
Issues about Keeper prioritization, expensive metadata path calls, and DDL/streaming shutdown hangs reflect production-scale concerns rather than beginner questions. This is a sign of real enterprise usage pressure.

### 5) SQL compatibility and client ergonomics
Requests for interval literal syntax, timezone-setting syntax, and even tab pasting in the CLI show users are integrating ClickHouse into broader SQL workflows and expect more seamless behavior with existing tools and habits.

## 7. Backlog Watch

These items appear important and worth maintainer attention because of age, impact, or roadmap significance.

### Long-running or strategically important open items

- [Issue #74561](https://github.com/ClickHouse/ClickHouse/issues/74561) — **Add more information to `system.error_log`**  
  Open since 2025-01-14. Clear value for supportability and debugging.

- [PR #94140](https://github.com/ClickHouse/ClickHouse/pull/94140) — **Add statistics-based part pruning**  
  Open since 2026-01-14. This looks substantial and potentially high impact for query performance.

- [Issue #99612](https://github.com/ClickHouse/ClickHouse/issues/99612) and [#99611](https://github.com/ClickHouse/ClickHouse/issues/99611) — **SQL compatibility interval/time zone support**  
  These could unlock tooling compatibility and are worth prioritization if SQL ecosystem adoption is a goal.

- [Issue #99937](https://github.com/ClickHouse/ClickHouse/issues/99937) — **Parallel replicas picks the wrong table to parallelise in JOIN queries**  
  Important optimizer behavior issue with potentially high performance cost in distributed joins.

- [Issue #99799](https://github.com/ClickHouse/ClickHouse/issues/99799) — **Double deletion in `MergeTreeDataPartCompact`**  
  High-severity stability item that deserves close attention until root-caused and fixed.

### Attention-worthy PRs likely needing timely review
- [PR #99854](https://github.com/ClickHouse/ClickHouse/pull/99854) — security-sensitive, must-backport
- [PR #100394](https://github.com/ClickHouse/ClickHouse/pull/100394) and [PR #100391](https://github.com/ClickHouse/ClickHouse/pull/100391) — performance-sensitive core read-path changes
- [PR #100277](https://github.com/ClickHouse/ClickHouse/pull/100277) and [PR #100406](https://github.com/ClickHouse/ClickHouse/pull/100406) — potentially broad product-surface additions requiring design alignment

## Overall Health Assessment

**Project health today: strong but busy.** ClickHouse shows high engineering throughput and a healthy balance between performance work, compatibility work, and bugfixing. The main caution is that the open issue flow still contains many **CI crashes, fuzz failures, and execution edge cases**, which is typical for a fast-moving analytical database but worth watching closely. The strongest positive signals are the pace of **engine hardening**, the seriousness of **CI infrastructure investment**, and growing attention to **Iceberg/lakehouse interoperability** and **end-user experience**.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-23

## 1) Today’s Overview

DuckDB showed **moderate but meaningful maintenance activity** over the last 24 hours: **10 issues updated** and **8 PRs updated**, with **no new release** published. The day’s signal is strongly weighted toward **correctness, CLI/runtime stability, and extensibility via the C API and external catalogs**, rather than major end-user feature launches. Several reports target **v1.5.0 behavior**, including a crash, a query-result correctness bug around `DELETE ... RETURNING`, and CLI argument ordering concerns, suggesting the project is in an active **post-release stabilization** phase. In parallel, open refactoring work on DML query nodes and platform compatibility PRs indicates ongoing investment in internal architecture and cross-platform robustness.

## 2) Project Progress

### Merged/closed PRs today

#### 1. Struct/vector internal representation cleanup
- **PR:** [#21534](https://github.com/duckdb/duckdb/pull/21534) — *Make StructVector have the same layout as DataChunk (vector<Vector>)* — **Closed**
- **What it advances:** This is an internal execution-engine/data-representation improvement. Unifying `StructVector` and `DataChunk` layouts reduces inconsistency in vector handling and should make it easier to write generic execution/storage code over structured values.
- **Why it matters:** Even if not directly user-visible, this kind of cleanup generally lowers maintenance cost and reduces risk in vectorized execution code paths.

#### 2. INSERT representation refactor
- **PR:** [#21518](https://github.com/duckdb/duckdb/pull/21518) — *Represent INSERT as InsertQueryNode (QueryNode)* — **Closed**
- **What it advances:** This refactors INSERT statements into the same broader query-node architecture used elsewhere.
- **Why it matters:** It is a roadmap signal toward cleaner handling of DML, likely making future optimizer/planner work easier for `INSERT`, and aligning statement representation across SQL command types.

### Additional notable open progress

#### 3. UPDATE statement refactor continues
- **PR:** [#21524](https://github.com/duckdb/duckdb/pull/21524) — *Refactor UpdateStatement as thin wrapper over UpdateQueryNode* — **Open**
- This extends the same architectural direction as INSERT refactoring, suggesting DuckDB is **normalizing DML into query-node form**. That could unlock cleaner support for optimizer rules, `RETURNING`, and external catalog writes.

#### 4. Query correctness fix already proposed
- **PR:** [#21541](https://github.com/duckdb/duckdb/pull/21541) — *Fix DELETE RETURNING for rows inserted in the same transaction* — **Open**
- This is the most concrete user-facing fix in flight today, addressing a correctness gap in transaction-local storage visibility for `RETURNING`.

## 3) Community Hot Topics

### 1. Function chaining inconsistency: `ifnull` vs `nullif`
- **Issue:** [#11907](https://github.com/duckdb/duckdb/issues/11907) — *ifnull returns an error when chained (nullif works)*
- **Activity:** 8 comments
- **Technical need:** Users expect consistency in DuckDB’s function-chaining syntax, especially among null-handling functions. The report implies a parser/binder or function-dispatch inconsistency where semantically similar functions behave differently under method-style invocation.
- **Why it matters:** This is not just syntax polish; it affects discoverability and predictability of DuckDB’s SQL ergonomics.

### 2. Struct-star expansion on aggregate output
- **Issue:** [#13055](https://github.com/duckdb/duckdb/issues/13055) — *aggregate(df).* is a syntax error but should be unnest(aggregate(df))*
- **Activity:** 6 comments
- **Technical need:** Users want `struct.*` expansion to work uniformly on aggregate results, not only on base expressions. This reflects demand for **more composable nested-data SQL**, an area where DuckDB has been strong and where users clearly want fewer context-specific exceptions.
- **Why it matters:** Better support here would improve usability for analytical SQL over structs and nested results.

### 3. `DELETE ... RETURNING` semantics for same-transaction rows
- **Issue:** [#21540](https://github.com/duckdb/duckdb/issues/21540) — *`DELETE RETURNING` returns empty result for rows inserted in the same transaction*
- **Related PR:** [#21541](https://github.com/duckdb/duckdb/pull/21541)
- **Technical need:** Correct `RETURNING` semantics in transactional workflows, especially for application embeddings and OLTP-like usage patterns inside analytical sessions.
- **Why it matters:** This is a correctness issue affecting application logic, not merely display behavior.

### 4. Extension/runtime interface sharp edges
- **Issue:** [#21537](https://github.com/duckdb/duckdb/issues/21537) — *An aggregate function implemented in a C API extension could segfault if the state is a constant vector*
- **Issue:** [#21538](https://github.com/duckdb/duckdb/issues/21538) — *`RETURNING` Projection Pushdown for External Catalog Write Operators*
- **Issue:** [#21533](https://github.com/duckdb/duckdb/issues/21533) — *Add OPTIONS to HTTPUtil RequestType enum*
- **Technical need:** Extension developers want safer APIs, fewer hidden execution assumptions, and more complete protocol support for external systems.
- **Why it matters:** DuckDB’s ecosystem is increasingly about embeddings, extensions, and external catalogs; these requests indicate where platform maturity is still being sharpened.

## 4) Bugs & Stability

Ranked roughly by severity and user impact.

### Critical / high severity

#### 1. Segfault when opening a database
- **Issue:** [#21536](https://github.com/duckdb/duckdb/issues/21536) — *.open musicbrainz-cmudb2026.db results in a segmentation fault* — **Closed**
- **Status:** Marked **fixed on nightly**
- **Severity:** High, because it is a process crash in a common CLI/database-open flow.
- **Impact area:** Storage/open path, likely database compatibility or corruption-handling edge case.
- **Assessment:** Good signal that maintainers responded quickly.

#### 2. C API extension aggregate can segfault on constant-vector state
- **Issue:** [#21537](https://github.com/duckdb/duckdb/issues/21537)
- **Status:** Under review
- **Severity:** High for extension authors; likely limited direct impact for pure SQL users.
- **Impact area:** Vectorized execution / extension ABI assumptions.
- **Assessment:** This is exactly the sort of bug that can undermine trust in extension safety if not addressed promptly.

### Medium severity

#### 3. `DELETE RETURNING` returns wrong result set inside explicit transaction
- **Issue:** [#21540](https://github.com/duckdb/duckdb/issues/21540)
- **Fix PR:** [#21541](https://github.com/duckdb/duckdb/pull/21541)
- **Severity:** Medium-high due to query correctness implications.
- **Impact area:** Transaction-local storage visibility and DML `RETURNING`.
- **Assessment:** Important because the delete succeeds, but the returned rows are silently incomplete—this can lead to subtle application bugs.

#### 4. Memory leak on repeated persistent inserts via C API
- **Issue:** [#21539](https://github.com/duckdb/duckdb/issues/21539)
- **Severity:** Medium-high, especially for long-running embedded deployments.
- **Impact area:** Embedding/runtime memory management on persistent storage workloads.
- **Assessment:** Worth close attention because DuckDB’s embedded use case depends on stable memory behavior.

#### 5. CLI startup order regression / ambiguity
- **Issue:** [#21535](https://github.com/duckdb/duckdb/issues/21535) — *v1.5.0: -init runs before -cmd, preventing configuration injection*
- **Severity:** Medium
- **Impact area:** CLI automation, reproducible startup configuration, scripting.
- **Assessment:** Important for power users and tooling integrations; likely a behavior mismatch between docs and implementation.

### Lower severity but notable

#### 6. Markdown rendering crash on em dash
- **Issue:** [#21545](https://github.com/duckdb/duckdb/issues/21545) — *INTERNAL Error in Utf8Proc::UTF8ToCodepoint when rendering markdown table with em dashes* — **Closed**
- **Severity:** Medium
- **Impact area:** CLI output rendering / Unicode handling.
- **Assessment:** Although closed quickly, Unicode correctness in rendering is important for internationalized workflows and polished CLI UX.

#### 7. Debug-build abort on unknown config option names
- **PR:** [#21544](https://github.com/duckdb/duckdb/pull/21544)
- **Severity:** Low-medium
- **Impact area:** C API ergonomics and defensive behavior in debug builds.
- **Assessment:** Small but valuable hardening for library users.

## 5) Feature Requests & Roadmap Signals

### 1. Better support for external catalogs and write operators
- **Issue:** [#21538](https://github.com/duckdb/duckdb/issues/21538)
- **Signal:** DuckDB is attracting more external-catalog and extension-backed write paths, and users now want optimizer behavior—specifically projection pushdown for `RETURNING`—to be aware of those integrations.
- **Prediction:** This type of work has a good chance of landing in an upcoming minor release because it aligns with current DML/refactor work.

### 2. HTTP OPTIONS support
- **Issue:** [#21533](https://github.com/duckdb/duckdb/issues/21533)
- **Signal:** Users are pushing DuckDB’s HTTP utilities into broader service-integration scenarios.
- **Prediction:** This is a relatively self-contained enhancement and feels plausible for the next version if maintainers consider the enum/API surface sufficiently stable.

### 3. Richer nested-data SQL ergonomics
- **Issue:** [#13055](https://github.com/duckdb/duckdb/issues/13055)
- **Signal:** Demand remains strong for cleaner struct/aggregate/star semantics.
- **Prediction:** This may take longer than a small utility feature because it touches parser/binder semantics, but it remains strategically aligned with DuckDB’s nested-data strengths.

### 4. More SQL function chaining consistency
- **Issue:** [#11907](https://github.com/duckdb/duckdb/issues/11907)
- **Signal:** Users care about method-style SQL consistency.
- **Prediction:** Could land as a targeted parser/binder fix rather than a major feature, especially if maintainers classify it as inconsistency rather than a design decision.

### 5. Windows long-path support
- **PR:** [#20983](https://github.com/duckdb/duckdb/pull/20983)
- **Signal:** Cross-platform filesystem compatibility remains on the roadmap.
- **Prediction:** This feels like a practical platform improvement likely to be merged once maintainers are satisfied with path-handling edge cases.

### 6. PostgreSQL OID collision avoidance
- **PR:** [#20979](https://github.com/duckdb/duckdb/pull/20979)
- **Signal:** Ongoing focus on PostgreSQL compatibility and avoiding subtle integration mismatches.
- **Prediction:** Likely useful for interoperability-minded users, though not urgent unless it blocks specific clients or tooling.

## 6) User Feedback Summary

Today’s user feedback clusters around a few concrete pain points:

- **Correctness over performance:** Users are reporting cases where SQL executes but returns the wrong result shape or missing rows, especially around `RETURNING` and transaction-local state. That indicates users are exercising DuckDB in increasingly application-like transactional patterns, not just static analytics.
- **Embedded/extension reliability matters:** Multiple reports concern the **C API**, extension aggregates, and persistent inserts. This suggests DuckDB’s embedded developer audience is active and sensitive to leaks, crashes, and ABI/API sharp edges.
- **CLI behavior is part of product quality:** Issues around `.open`, markdown rendering, and `-init`/`-cmd` ordering show that users depend heavily on the DuckDB CLI for automation, demos, and operational workflows.
- **Advanced SQL ergonomics remain important:** Long-lived issues on chaining and struct expansion suggest users expect DuckDB’s SQL niceties to work uniformly across contexts, especially for nested and composable analytical queries.

Overall, user sentiment from today’s data reads as: **DuckDB is powerful and broadly useful, but users expect rapid polish on correctness and edge-case stability after the v1.5.0 cycle.**

## 7) Backlog Watch

These are older or stalled items that still look important and may need maintainer attention.

### 1. Function chaining inconsistency for `ifnull`
- **Issue:** [#11907](https://github.com/duckdb/duckdb/issues/11907)
- **Why watch it:** Open since 2024-05-02 and still active. It points to inconsistent SQL behavior in a visible user-facing area.
- **Risk if delayed:** Continued confusion around which functions support chaining semantics.

### 2. Struct expansion on aggregate results
- **Issue:** [#13055](https://github.com/duckdb/duckdb/issues/13055)
- **Labels:** reproduced, stale
- **Why watch it:** Open since 2024-07-18. This looks like a genuine language/usability gap rather than a one-off bug.
- **Risk if delayed:** Friction in nested-data analytics and disappointment for users relying on documented `struct.*` expectations.

### 3. PostgreSQL OID compatibility PR
- **PR:** [#20979](https://github.com/duckdb/duckdb/pull/20979)
- **Labels:** stale, Ready For Review
- **Why watch it:** Aged PR in a compatibility-sensitive area. If the change is sound, it may deserve a push to resolution.
- **Risk if delayed:** Ongoing subtle interoperability edge cases with PostgreSQL-oriented tooling.

### 4. Windows long-path support PR
- **PR:** [#20983](https://github.com/duckdb/duckdb/pull/20983)
- **Labels:** Ready For Review
- **Why watch it:** Practical platform support issue affecting Windows users with deep directory hierarchies.
- **Risk if delayed:** Continued filesystem friction on Windows-based deployments and developer machines.

## Links Index

- [Issue #11907](https://github.com/duckdb/duckdb/issues/11907)
- [Issue #13055](https://github.com/duckdb/duckdb/issues/13055)
- [Issue #21545](https://github.com/duckdb/duckdb/issues/21545)
- [Issue #21536](https://github.com/duckdb/duckdb/issues/21536)
- [Issue #21540](https://github.com/duckdb/duckdb/issues/21540)
- [Issue #21539](https://github.com/duckdb/duckdb/issues/21539)
- [Issue #21537](https://github.com/duckdb/duckdb/issues/21537)
- [Issue #21538](https://github.com/duckdb/duckdb/issues/21538)
- [Issue #21533](https://github.com/duckdb/duckdb/issues/21533)
- [Issue #21535](https://github.com/duckdb/duckdb/issues/21535)
- [PR #20979](https://github.com/duckdb/duckdb/pull/20979)
- [PR #20983](https://github.com/duckdb/duckdb/pull/20983)
- [PR #21544](https://github.com/duckdb/duckdb/pull/21544)
- [PR #21543](https://github.com/duckdb/duckdb/pull/21543)
- [PR #21541](https://github.com/duckdb/duckdb/pull/21541)
- [PR #21534](https://github.com/duckdb/duckdb/pull/21534)
- [PR #21524](https://github.com/duckdb/duckdb/pull/21524)
- [PR #21518](https://github.com/duckdb/duckdb/pull/21518)

If you want, I can also turn this into a **short executive summary**, **release-manager view**, or **issue triage table with severity/owner recommendations**.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-23

## 1. Today's Overview
StarRocks showed light but meaningful activity over the last 24 hours: 2 issues were updated and 4 PRs saw movement, with 2 PRs closed/merged and 2 still open. The day’s completed work was mostly stability-oriented rather than feature delivery, centered on fixing unstable unit tests in lake replication transaction paths. On the user side, the most important signal is a newly active correctness bug in the Iceberg metadata cache that may produce silently wrong query results, which is higher impact than the day’s code churn suggests. Overall, project activity is moderate-to-low today, but the quality signal is mixed: routine maintenance is progressing while a potentially severe external-table correctness issue remains open.

## 2. Project Progress
### Merged/closed PRs today
1. [#70606](https://github.com/StarRocks/starrocks/pull/70606) — **[UT] Fix unstable unit test failures introduced by fast-cancle lake replication txn**  
   - Status: Closed / merged  
   - This change appears to harden test stability around lake replication transaction logic.  
   - While not a direct user-facing engine feature, it improves confidence in replication-related execution paths and helps reduce CI noise that can mask real regressions.

2. [#70619](https://github.com/StarRocks/starrocks/pull/70619) — **[UT] Fix unstable unit test failures introduced by fast-cancle lake replication txn (backport #70606)**  
   - Status: Closed  
   - This is the backport of the same unit-test stabilization work into the `4.1.0` line.  
   - The backport suggests maintainers consider the test instability important enough to keep release branches healthy, which is a positive signal for branch discipline and release engineering.

### What was advanced
Today’s merged work did **not** introduce visible SQL features, query planner enhancements, or storage-format functionality. Instead, progress was in **test reliability for lake replication transactions**, which indirectly supports storage engine robustness and branch stability. For an OLAP engine, this kind of maintenance matters because unstable replication-path tests can slow down delivery of more substantial storage and execution changes.

## 3. Community Hot Topics
### 1) Iceberg query correctness risk
- [#70522](https://github.com/StarRocks/starrocks/issues/70522) — **[Bug] Iceberg dataFileCache can serve permanently stale partial data, causing silent wrong query results**
- Author: `@mixermt`

This is the most important technical topic in the current snapshot even though it has no comments yet. The issue reports that under `enable_iceberg_metadata_cache`, StarRocks may return **incorrect results** because the Iceberg `dataFileCache` can preserve stale partial data. Silent wrong answers are among the highest-severity failure modes in analytical systems, especially for federated/external-table workloads where users depend on cache correctness for performance without sacrificing consistency.

**Underlying technical need:** stronger invalidation semantics and correctness guarantees for external metadata/data-file caching, especially in Iceberg catalogs where table state evolves outside StarRocks. This points to a broader need for better observability and consistency controls in external lakehouse integrations.

### 2) OpenSearch connector development
- [#70542](https://github.com/StarRocks/starrocks/pull/70542) — **[Feature] Add OpenSearch connector (Phase 1 - HTTP)**
- Author: `@xiaoshao`

This is the clearest roadmap-facing feature under active review. The PR introduces an OpenSearch 2.9.x external catalog connector with schema discovery and basic `SELECT` push-in via HTTP. Even in Phase 1 form, it signals StarRocks’ continued push to broaden federated analytics coverage beyond classic lakehouse formats.

**Underlying technical need:** users increasingly want one engine to query operational search/index systems alongside warehouse/lake data. This connector effort reflects demand for StarRocks as a unifying SQL layer over heterogeneous data sources.

### 3) Column buffer refactor / storage-path optimization
- [#69949](https://github.com/StarRocks/starrocks/pull/69949) — **[Enhancement] introduce a new column buffer**
- Author: `@silverbullet233`

This open enhancement is significant from an engine internals perspective. It proposes replacing or supplementing current `std::vector`-based column storage patterns with a new buffer abstraction better suited to columnar execution. That could affect allocation behavior, resize strategy, memory locality, and vectorized execution efficiency.

**Underlying technical need:** purpose-built in-memory column containers are often needed once a general-purpose STL container becomes a bottleneck for high-throughput analytical workloads.

### 4) Documentation feedback pipeline
- [#70620](https://github.com/StarRocks/starrocks/issues/70620) — **[doc-feedback] Weekly documentation feedback from readers**

Although not a technical bug itself, this issue points to a recurring documentation-maintenance workflow. The referenced docs PRs include topics like per-catalog-type query metrics and Iceberg ALTER TABLE support, both of which suggest users need clearer guidance on observability and external table semantics.

## 4. Bugs & Stability
Ranked by severity:

### High severity
1. [#70522](https://github.com/StarRocks/starrocks/issues/70522) — **Iceberg dataFileCache can serve permanently stale partial data, causing silent wrong query results**
   - Severity: **Critical / correctness**
   - Why it matters: wrong query results are worse than query failure in analytical systems because they can go undetected and contaminate downstream decisions.
   - Scope: likely affects users querying Iceberg catalogs with metadata cache enabled.
   - Fix PR: **none linked yet** in the provided data.

### Medium severity
2. [#70606](https://github.com/StarRocks/starrocks/pull/70606) and [#70619](https://github.com/StarRocks/starrocks/pull/70619)
   - Severity: **Medium / stability**
   - Issue type: unstable unit tests in fast-cancel lake replication transaction logic.
   - Why it matters: not necessarily a production bug, but test instability around replication or transaction behavior can hide real regressions and slow release confidence.
   - Fix status: addressed in mainline and backported to `4.1.0`.

### Stability assessment
Today’s visible stability work is mostly internal QA hardening, but the open Iceberg bug dominates the risk picture. For users of external lakehouse catalogs, especially Iceberg, correctness assurance should be watched closely until a fix lands.

## 5. Feature Requests & Roadmap Signals
### Strong signals
1. [#70542](https://github.com/StarRocks/starrocks/pull/70542) — **OpenSearch connector**
   - Likely roadmap relevance: **high**
   - Why: it is already in PR form and scoped as “Phase 1,” which usually indicates planned iterative delivery.
   - Likely next-version chance: **good**, if review proceeds smoothly, though HTTP-only and no-auth limitations suggest initial availability may be experimental or limited.

2. [#69949](https://github.com/StarRocks/starrocks/pull/69949) — **new column buffer**
   - Likely roadmap relevance: **high for internals**
   - Why: tied to broader work (`part work of #69128`) and addresses foundational memory/storage execution structures.
   - Likely next-version chance: **moderate**, depending on review complexity, benchmarking results, and compatibility risk.

### Secondary signals from docs workflow
3. [#70620](https://github.com/StarRocks/starrocks/issues/70620)
   - The linked docs-attention items imply active work around:
     - per-catalog-type query metrics for external table observability
     - Iceberg ALTER TABLE support
   - These are useful roadmap signals because docs updates often trail or accompany near-term feature delivery.

### Prediction
Near-term StarRocks direction continues to emphasize:
- stronger **external catalog/connectivity** coverage,
- better **observability** for federated query paths,
- and lower-level **columnar engine memory improvements**.

## 6. User Feedback Summary
### Main pain points surfaced
1. **Correctness over performance in external tables**
   - The Iceberg cache bug in [#70522](https://github.com/StarRocks/starrocks/issues/70522) shows that users are willing to use aggressive metadata caching, but not at the expense of correctness. The complaint is especially notable because it reports **silent** wrong answers, implying users need safer cache invalidation and clearer operational guarantees.

2. **Demand for broader federated analytics**
   - The OpenSearch connector PR [#70542](https://github.com/StarRocks/starrocks/pull/70542) indicates real user interest in querying search-engine-backed data from StarRocks. This fits a broader use case where StarRocks serves as a SQL analytics layer across lakes, warehouses, and operational stores.

3. **Need for better engine-level efficiency**
   - The column buffer proposal [#69949](https://github.com/StarRocks/starrocks/pull/69949) reflects internal pressure to optimize memory and vectorized column handling. Even if not framed directly as user feedback, such work usually comes from observed performance ceilings in production-like workloads.

### Satisfaction signals
There are no strong positive end-user satisfaction signals in today’s dataset such as performance praise, compatibility confirmations, or adoption success stories. The current snapshot is more about maintenance and risk surfacing than celebratory momentum.

## 7. Backlog Watch
Items that appear to need maintainer attention:

1. [#70522](https://github.com/StarRocks/starrocks/issues/70522) — **Critical Iceberg correctness bug**
   - Why it needs attention: silent wrong query results should be triaged urgently.
   - Current concern: no comments or linked fix PR in the provided snapshot.

2. [#69949](https://github.com/StarRocks/starrocks/pull/69949) — **New column buffer**
   - Why it needs attention: foundational engine refactors can stall without strong maintainer guidance because they touch core abstractions and may require extensive benchmark validation.
   - Age signal: open since 2026-03-06, still active.

3. [#70542](https://github.com/StarRocks/starrocks/pull/70542) — **OpenSearch connector**
   - Why it needs attention: marked `[META-REVIEW]`, which usually means cross-cutting review is required.
   - Importance: connector work can unlock new adoption scenarios, but security/auth/TLS gaps in Phase 1 will likely need careful review before merge.

4. [#70620](https://github.com/StarRocks/starrocks/issues/70620) — **Weekly docs feedback**
   - Why it needs attention: docs-maintainer follow-up is needed to keep user-facing documentation current on observability and Iceberg features.

## 8. Overall Health Signal
StarRocks appears operationally healthy in terms of branch maintenance and CI hygiene, as shown by rapid stabilization PRs and backports. However, today’s most consequential development is not a merged change but the open Iceberg cache correctness report in [#70522](https://github.com/StarRocks/starrocks/issues/70522). If maintainers respond quickly with a fix or mitigation, the project remains on a steady path; if not, this could become a notable trust issue for external-table workloads. The roadmap signals remain strong around connectors, observability, and core columnar engine optimization.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-23

## 1. Today's Overview

Apache Iceberg showed **moderate-to-high development activity** over the last 24 hours, driven mainly by pull requests rather than issues. There were **21 PR updates** versus just **2 issue updates**, suggesting the project is currently in an implementation and maintenance-heavy phase rather than experiencing a spike in new bug intake. The work spans **Spark correctness, core transaction semantics, cloud FileIO behavior, Kafka Connect correctness, and data migration tooling**, with several dependency update PRs also closed. Overall, project health looks **active and stable**, though there are notable signals around **test flakiness, stale long-running PRs, and correctness-sensitive edge cases** in Spark and commit handling.

## 3. Project Progress

### Merged/closed PRs today

Although there were no releases, several closed PRs indicate progress in documentation, dependency hygiene, and Spark-related stabilization.

- **Spark SQL transform functions documentation completed**
  - PR: [#15697](https://github.com/apache/iceberg/pull/15697)
  - This documents Iceberg’s Spark SQL system functions such as `iceberg_version`, `bucket`, `years`, `months`, `days`, `hours`, and `truncate`.
  - Impact: improves **SQL discoverability and usability** for Spark users, especially around partition transforms and Iceberg-specific query semantics.

- **Spark UUID writer optimization PR closed**
  - PR: [#15302](https://github.com/apache/iceberg/pull/15302)
  - Proposed a fast-path byte-level UUID parsing optimization for Spark 4.1 writers.
  - Even though it was closed rather than merged, it signals continued attention to **writer-path efficiency** and **Spark 4.1 readiness**.

- **Build and dependency maintenance advanced**
  - Closed PRs:
    - [#15721](https://github.com/apache/iceberg/pull/15721) sqlite-jdbc bump
    - [#15723](https://github.com/apache/iceberg/pull/15723) grpc-netty-shaded bump
    - [#15722](https://github.com/apache/iceberg/pull/15722) jackson-bom bump
    - [#15720](https://github.com/apache/iceberg/pull/15720) AWS SDK BOM bump
    - [#15719](https://github.com/apache/iceberg/pull/15719) jettison bump
    - [#15718](https://github.com/apache/iceberg/pull/15718) RoaringBitmap bump
    - [#15717](https://github.com/apache/iceberg/pull/15717) spotless plugin bump
    - [#15716](https://github.com/apache/iceberg/pull/15716) testcontainers bump
  - Impact: routine but important for **security posture, ecosystem compatibility, and CI/build reliability**.

### Notable open progress areas

- **Dangling delete cleanup via scan-based logic**
  - PR: [#15727](https://github.com/apache/iceberg/pull/15727)
  - This targets a subtle storage maintenance problem where equality deletes may be logically unreachable yet retained.
  - Potential impact: **storage cleanup efficiency** and reduced metadata/data file bloat.

- **Spark correctness fixes**
  - PR: [#15726](https://github.com/apache/iceberg/pull/15726)
  - Fixes `_partition` child ID collision behavior with MAP/LIST fields in Spark scans.
  - Impact: important for **schema correctness** and preventing projection/planning errors in complex nested schemas.

- **Backport for flaky Spark test behavior**
  - PR: [#15725](https://github.com/apache/iceberg/pull/15725)
  - Backports an ordering fix into Spark 3.4/3.5 and explicitly references the new flaky-test issue.
  - Impact: improves **query/test determinism** and likely addresses a correctness edge case.

- **Kafka Connect correctness**
  - PRs:
    - [#15710](https://github.com/apache/iceberg/pull/15710)
    - [#15639](https://github.com/apache/iceberg/pull/15639)
  - These address stale `DataWritten` event handling and incorrect multi-topic routing.
  - Impact: materially improves **connector correctness** and prevents **cross-table contamination or duplicate/incorrect commits**.

## 4. Community Hot Topics

### 1) Spark SQL transform function documentation
- Issue: [#13156](https://github.com/apache/iceberg/issues/13156)
- PR: [#15697](https://github.com/apache/iceberg/pull/15697)

This was the most commented issue in the provided issue set and has now effectively been resolved via documentation work. The underlying need is clear: users want **first-class documentation for Iceberg-registered Spark SQL functions**, especially those tied to partition transforms. This points to a broader demand for **better SQL ergonomics and discoverability**, not just low-level API docs.

### 2) Flaky Spark timestamp-as-of test
- Issue: [#15724](https://github.com/apache/iceberg/issues/15724)
- Fix PR: [#15725](https://github.com/apache/iceberg/pull/15725)

This is today’s most important live issue because it touches **snapshot time-travel correctness or determinism**. Even if currently surfaced as test flakiness, failures in `timestamp as of` logic are high-sensitivity for users relying on **auditing, rollback, and temporal analytics**. The linked backport PR suggests maintainers already have a candidate fix path.

### 3) Long-running migration/tooling work
- PR: [#15407](https://github.com/apache/iceberg/pull/15407)
- PR: [#15388](https://github.com/apache/iceberg/pull/15388)

These PRs show ongoing demand around **migration into Iceberg**:
- Delta Lake to Iceberg conversion updates
- Hive partition/subdirectory file discovery during migration

Together they reflect a strong ecosystem need for **adoption tooling**, especially for users moving large legacy lakehouse estates into Iceberg without losing data visibility.

## 5. Bugs & Stability

Ranked by likely severity and user impact:

### High severity
1. **Possible Spark time-travel correctness instability**
   - Issue: [#15724](https://github.com/apache/iceberg/issues/15724)
   - Fix PR: [#15725](https://github.com/apache/iceberg/pull/15725)
   - Why it matters: `testTimestampAsOf()` failures can indicate nondeterminism in **snapshot selection by timestamp**, a core semantic for historical reads.
   - Status: active issue, apparent fix/backport in progress.

2. **Kafka Connect may mix stale and current commit events**
   - PR: [#15710](https://github.com/apache/iceberg/pull/15710)
   - Why it matters: partial-commit timeout scenarios can cause stale `DataWritten` events to bleed into later commit cycles, which risks **incorrect table state** or malformed row delta application.
   - Status: open.

3. **Kafka Connect multi-topic routing bug could write records to wrong tables**
   - PR: [#15639](https://github.com/apache/iceberg/pull/15639)
   - Why it matters: this is a serious correctness issue for connector users because records from different topics may be written into multiple tables incorrectly.
   - Status: open.

### Medium severity
4. **Spark nested schema field-ID collision in `_partition` planning**
   - PR: [#15726](https://github.com/apache/iceberg/pull/15726)
   - Risk: query planning/projection correctness for schemas containing MAP/LIST columns.
   - Status: open.

5. **Cloud FileIO inconsistent 404 handling**
   - PR: [#15029](https://github.com/apache/iceberg/pull/15029)
   - Risk: unnecessary retries and inconsistent table operation behavior across GCS/ADLS vs S3.
   - Status: open, stale.
   - Importance: especially relevant for cloud-native deployments where metadata operations are latency-sensitive.

### Lower severity but important operationally
6. **Dangling delete files retained unnecessarily**
   - PR: [#15727](https://github.com/apache/iceberg/pull/15727)
   - Risk: storage and metadata inefficiency rather than immediate correctness breakage.
   - Status: open.

## 6. Feature Requests & Roadmap Signals

### Signals from users and contributors

- **Better Spark SQL function usability**
  - Issue: [#13156](https://github.com/apache/iceberg/issues/13156)
  - This request was documentation-focused, but it signals broader interest in making Iceberg’s SQL extensions more visible and likely more widely used.

- **Migration support for legacy table layouts**
  - PR: [#15388](https://github.com/apache/iceberg/pull/15388)
  - Supporting Hive partitions with subdirectories is a strong signal that users need **less brittle migration/import paths**.

- **Updated Delta Lake conversion**
  - PR: [#15407](https://github.com/apache/iceberg/pull/15407)
  - This suggests roadmap pressure around **interoperability with newer Delta Lake versions**, an important adoption enabler.

- **Broader metadata column test coverage**
  - PR: [#15675](https://github.com/apache/iceberg/pull/15675)
  - Indicates continued investment in **cross-engine semantics** for metadata columns across Spark, Flink, and data-layer test contracts.

### Likely candidates for the next version
Based on current activity, the most plausible near-term inclusions are:
- Spark correctness fixes around **timestamp ordering/backports** and **field-ID collision handling**
- Kafka Connect fixes for **routing and stale commit handling**
- Potential storage/maintenance improvements like **remove dangling delete** scanning logic
- More migration/interoperability improvements if long-running PRs receive maintainer attention

## 7. User Feedback Summary

The clearest user pain points visible today are:

- **Spark users need more predictable SQL behavior and better docs**
  - Seen in [#13156](https://github.com/apache/iceberg/issues/13156), [#15724](https://github.com/apache/iceberg/issues/15724), and [#15725](https://github.com/apache/iceberg/pull/15725).
  - Users care about both **discoverability** and **semantic correctness**, especially for time-travel and transform functions.

- **Migration remains a practical adoption bottleneck**
  - Seen in [#15388](https://github.com/apache/iceberg/pull/15388) and [#15407](https://github.com/apache/iceberg/pull/15407).
  - Real-world tables often have non-ideal layouts, subdirectories, or version skew with external systems like Delta Lake.

- **Connector users are sensitive to correctness over throughput**
  - Seen in [#15710](https://github.com/apache/iceberg/pull/15710) and [#15639](https://github.com/apache/iceberg/pull/15639).
  - Feedback here suggests production users need strong guarantees around **table routing, commit isolation, and late event handling**.

- **Cloud parity matters**
  - Seen in [#15029](https://github.com/apache/iceberg/pull/15029).
  - Users expect GCS/ADLS/S3 behavior to be harmonized so operational behavior is consistent across clouds.

## 8. Backlog Watch

These items appear especially deserving of maintainer attention due to age, scope, or risk:

- **Replace transaction rebase onto refreshed metadata**
  - PR: [#15092](https://github.com/apache/iceberg/pull/15092)
  - Why watch it: touches **core transaction correctness** under concurrent change. This is foundational and potentially high impact if unresolved.

- **Cloud FileIO 404 normalization for GCS and ADLS**
  - PR: [#15029](https://github.com/apache/iceberg/pull/15029)
  - Why watch it: operational consistency issue with direct impact on cloud production behavior.

- **Hive partition subdirectory migration support**
  - PR: [#15388](https://github.com/apache/iceberg/pull/15388)
  - Why watch it: migration gaps can block adoption and may lead to silent file omission during import.

- **Delta Lake conversion modernization**
  - PR: [#15407](https://github.com/apache/iceberg/pull/15407)
  - Why watch it: strategic interoperability item, likely important for users evaluating Iceberg migration paths.

- **Metadata column TCK coverage**
  - PR: [#15675](https://github.com/apache/iceberg/pull/15675)
  - Why watch it: cross-engine semantic consistency is critical for trust in Iceberg behavior across Spark/Flink/data layers.

## Overall Health Assessment

Iceberg remains **healthy and actively maintained**, with evidence of steady contributor throughput and quick reaction to at least one newly reported Spark stability issue. The dominant themes today are **Spark correctness, connector safety, migration tooling, and storage/metadata hygiene**. The main caution is that several technically significant PRs are now **stale or long-running**, especially in core transaction handling, cloud FileIO, and migration workflows, and would benefit from stronger maintainer prioritization.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-23

## 1. Today's Overview
Delta Lake showed very light GitHub activity over the last 24 hours, with **1 active issue update** and **1 active pull request update**, and **no new releases**. Current signals point to a relatively quiet maintenance window rather than a burst of feature delivery or urgent incident response. The only issue updated is a **project-governance/documentation question** about Technical Steering Committee membership, while the only PR updated is a **Spark test-infrastructure change** related to version-gating Unity Catalog expectations. Overall, project health appears stable, but today’s public activity does not indicate major engine, protocol, or storage-layer changes landing yet.

## 2. Project Progress
There were **no merged or closed pull requests** in the provided period, so there is **no completed project progress to report today** in terms of query engine features, storage optimizations, transaction-log evolution, or SQL compatibility fixes.

Still, one open PR is worth watching:

- [#6342](https://github.com/delta-io/delta/pull/6342) — **[ai-assisted] [Spark] Gate UC Spark test expectations by version**  
  This suggests ongoing work to make the Spark test suite more version-aware, likely to accommodate behavioral differences across Spark and/or Unity Catalog environments. While not a shipped feature yet, this kind of change usually supports **cross-version compatibility hardening** and reduces false negatives in CI, which is important for a storage engine project with broad deployment permutations.

## 3. Community Hot Topics
### 1) Governance transparency: current TSC membership
- [Issue #6219](https://github.com/delta-io/delta/issues/6219) — **Where is the current Delta Lake TSC membership listed?**  
  - Comments: 2  
  - Reactions: 0  

This is the most visible issue in today’s data despite being non-code-related. The underlying need is **governance clarity for adopters and contributors**: enterprises evaluating open-source data infrastructure often want to understand who holds technical decision authority, especially for roadmap influence, standardization, and protocol evolution. For a project like Delta Lake—used in lakehouse architectures and often embedded in long-term platform decisions—visible TSC composition can matter for trust, neutrality, and ecosystem alignment.

### 2) Spark/UC compatibility test gating
- [PR #6342](https://github.com/delta-io/delta/pull/6342) — **[ai-assisted] [Spark] Gate UC Spark test expectations by version**  

Although comments/reactions were not provided, this is the main active engineering thread. The technical need here is likely **test determinism across version matrices**. In analytical storage engines, small differences in Spark planner behavior, catalog semantics, or expected error messages across versions can break CI even when runtime behavior is acceptable. Gating expectations by version is a practical signal that maintainers are managing compatibility complexity rather than changing user-facing semantics.

## 4. Bugs & Stability
No new bug reports, crash reports, correctness issues, or regressions were surfaced in the provided 24-hour activity.

### Severity ranking
1. **No critical bugs reported today**
2. **No major regressions reported today**
3. **No known correctness or crash issues updated today**

### Stability interpretation
The absence of bug-focused issue traffic is a positive short-term signal, but today’s sample is too small to conclude a trend. The one active PR on version-gated test expectations may indirectly indicate **compatibility/stability maintenance work**, though there is no evidence in the provided data of a user-facing defect being fixed yet.

## 5. Feature Requests & Roadmap Signals
There are **no explicit user-facing feature requests** in today’s issue/PR set around SQL functions, connectors, table features, storage formats, deletion vectors, row tracking, or protocol enhancements.

The closest roadmap signal is:

- [PR #6342](https://github.com/delta-io/delta/pull/6342) — version-gated UC Spark test expectations

This points less to a net-new feature and more to a likely ongoing theme for upcoming releases:
- better **Spark-version compatibility management**
- improved **Unity Catalog integration reliability**
- more robust **test coverage across supported environments**

### Near-term prediction
Based on this limited activity, the next version is more likely to include **incremental compatibility and maintenance improvements** than a headline storage-engine feature, unless larger work is happening outside the provided update window.

## 6. User Feedback Summary
Today’s user feedback is sparse but still informative.

### Main pain point observed
- **Difficulty locating governance information**
  - [Issue #6219](https://github.com/delta-io/delta/issues/6219)

This reflects a non-runtime but important adopter concern: organizations using Delta Lake in production want clear signals about **who governs the project**, how technical decisions are made, and where authority resides. For platform teams, this can affect internal approval, legal review, and confidence in long-term roadmap stability.

### Satisfaction/performance feedback
No direct user reports today on:
- query performance
- write/read throughput
- metadata scaling
- transaction conflicts
- Spark SQL compatibility
- connector quality

So there is **no new direct evidence**, positive or negative, on operational user satisfaction from this snapshot.

## 7. Backlog Watch
### Needs maintainer attention
- [Issue #6219](https://github.com/delta-io/delta/issues/6219) — **Where is the current Delta Lake TSC membership listed?**  
  This is not a code bug, but it is important for project transparency. If there is no canonical public list today, maintainers may want to address it in documentation, the project website, or governance materials. Governance ambiguity can become a friction point for enterprise adopters and prospective contributors.

### Open engineering item to monitor
- [PR #6342](https://github.com/delta-io/delta/pull/6342) — **[ai-assisted] [Spark] Gate UC Spark test expectations by version**  
  This PR likely deserves review because it touches test behavior across version boundaries, which can affect confidence in CI results and release validation. If left open too long, version-conditional testing can become a maintenance hotspot.

## 8. Overall Health Assessment
Delta Lake appears **stable but quiet** today. There were **no releases**, **no merged changes**, and **no active bug escalations** in the provided dataset. The most concrete engineering signal is compatibility-focused test maintenance for Spark/Unity Catalog, while the main community discussion centers on governance visibility rather than product behavior. In short: **healthy, low-activity day, with modest attention needed on transparency and compatibility maintenance**.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-23

## 1. Today's Overview
Databend showed light-to-moderate visible GitHub activity over the last 24 hours, with **6 pull requests updated**, **0 issues updated**, and **1 new nightly release**. The signal is mostly from ongoing engineering work rather than user-reported incidents: current PRs focus on **storage-layer robustness**, **query engine evolution**, and **SQL correctness**. With no issue churn today, the project appears operationally stable from a public tracker perspective, though several open PRs suggest active work on deeper architectural improvements. Overall, project health looks steady, with emphasis on incremental engine refinement rather than urgent firefighting.

## 2. Releases
### New release: [v1.2.890-nightly](https://github.com/databendlabs/databend/releases/tag/v1.2.890-nightly)
This nightly includes at least two notable changes from the generated notes:

- **Bloom index read optimization**
  - Feature PR: [#19552](https://github.com/databendlabs/databend/pull/19552)
  - Impact: improves efficiency for **small bloom index reads**, which likely helps point-filter and selective-scan workloads by reducing storage access overhead.

- **Query runtime-related enhancement**
  - Release notes mention: `feat(query): Runtime`
  - The note is truncated in the supplied data, so the exact scope is unclear, but it indicates continued investment in **query execution/runtime internals**.

### Breaking changes / migration notes
No explicit breaking changes or migration instructions were present in the supplied release data. Since this is a **nightly** release, users should still treat it as potentially unstable and validate:
- query plan behavior,
- storage compatibility in test environments,
- performance effects for bloom-index-heavy tables and join-heavy workloads.

## 3. Project Progress
### Merged/closed PRs today
Only one PR is shown as merged/closed in the latest set:

- **[#19556](https://github.com/databendlabs/databend/pull/19556) — feat(query): reclaim memory on hash join finish**
  - Status: Closed
  - Area: Query engine / execution memory management
  - What it advances: this work targets **memory reclamation after hash join completion**, a meaningful improvement for analytical workloads with large joins. In OLAP systems, delayed memory release can hurt concurrency and increase peak memory pressure; this change points to continued tuning of Databend’s execution engine for better resource efficiency.
  - Confidence note: the data marks it as **closed**, but does not explicitly say merged. It should therefore be treated as progress signal rather than confirmed landed functionality.

### Other notable in-flight progress
- **[#19553](https://github.com/databendlabs/databend/pull/19553) — refactor(query): support partitioned hash join**
  - Indicates deeper work on scalable join execution, likely for improving parallelism and handling larger build/probe datasets.

- **[#19577](https://github.com/databendlabs/databend/pull/19577) — fix(storage): split oversized compact blocks during recluster**
  - A storage correctness/performance hardening change aimed at preventing oversized blocks after reclustering.

- **[#19576](https://github.com/databendlabs/databend/pull/19576) — refactor(storage): extract fuse block format abstraction**
  - Suggests architectural cleanup in the Fuse storage layer, likely reducing duplication between native/parquet read paths and making future storage-format work easier.

- **[#19587](https://github.com/databendlabs/databend/pull/19587) — fix(query): preserve parentheses in UNION queries**
  - A SQL compatibility and correctness fix for set-operation parsing/AST handling.

- **[#19551](https://github.com/databendlabs/databend/pull/19551) — feat(query): support experimental table branch**
  - Potentially significant roadmap item, hinting at branch-like semantics for tables, which could matter for data versioning, experimentation, or isolated development workflows.

## 4. Community Hot Topics
There were **no active issues updated today**, and the supplied PR list shows **no meaningful comment or reaction concentration**. So today’s “hot topics” are best inferred from the technical direction of the most recently active PRs:

- **Storage compaction/reclustering safety**
  - [#19577](https://github.com/databendlabs/databend/pull/19577)
  - Technical need: prevent recluster from producing oversized compact blocks, which can degrade read efficiency, compaction quality, or downstream storage assumptions.

- **Storage read-path unification**
  - [#19576](https://github.com/databendlabs/databend/pull/19576)
  - Technical need: simplify Fuse block handling and unify native/parquet read transforms, likely reducing maintenance complexity and enabling more consistent optimizations.

- **Join execution scalability**
  - [#19553](https://github.com/databendlabs/databend/pull/19553)
  - Technical need: better support for partitioned hash join indicates pressure from larger or more parallel analytical joins.

- **SQL semantics preservation**
  - [#19587](https://github.com/databendlabs/databend/pull/19587)
  - Technical need: exact preservation of parentheses in `UNION`/`INTERSECT`/`EXCEPT` groupings is essential for standards compliance and predictable query behavior.

Because there are no heavily discussed issues today, community attention appears concentrated in **core engine development** rather than outward-facing support traffic.

## 5. Bugs & Stability
No new issues were reported or updated in the last 24 hours, so there is **no evidence of fresh production incidents** from the public tracker snapshot. Still, several active PRs point to important stability/correctness areas:

### High severity
1. **Recluster may produce oversized compact blocks**
   - Fix PR: [#19577](https://github.com/databendlabs/databend/pull/19577)
   - Severity rationale: affects storage layout integrity and could impact performance or downstream operations on reclustered data.

### Medium severity
2. **Incorrect semantics risk in grouped set operations**
   - Fix PR: [#19587](https://github.com/databendlabs/databend/pull/19587)
   - Issue reference: fixes [#19578](https://github.com/databendlabs/databend/issues/19578) as stated in the PR summary
   - Severity rationale: query correctness issues in `UNION`/`INTERSECT`/`EXCEPT` can produce wrong results or planner/parser inconsistencies.

3. **Memory retention after hash join completion**
   - Related PR: [#19556](https://github.com/databendlabs/databend/pull/19556)
   - Severity rationale: likely not a crash-class bug, but important for memory efficiency and workload concurrency.

### Low-to-medium severity
4. **Bloom index small-read inefficiency**
   - Release-linked improvement: [#19552](https://github.com/databendlabs/databend/pull/19552)
   - Severity rationale: performance issue rather than correctness issue, but valuable for selective analytical scans.

## 6. Feature Requests & Roadmap Signals
No new feature-request issues were visible today, but the open PRs provide strong roadmap hints:

- **Experimental table branch support**
  - [#19551](https://github.com/databendlabs/databend/pull/19551)
  - Likely roadmap signal toward **branching/versioned table workflows**, useful for testing, isolated transformations, or data-dev scenarios.

- **Partitioned hash join support**
  - [#19553](https://github.com/databendlabs/databend/pull/19553)
  - Strong signal that Databend is improving **large-scale join execution** and distributed/parallel query performance.

- **Fuse block format abstraction**
  - [#19576](https://github.com/databendlabs/databend/pull/19576)
  - Suggests future work around **storage format flexibility**, maintainability, and unified read pipelines.

### Likely candidates for near-term versions
Based on current PR momentum, the next nightly or short-term release is most likely to include:
1. storage read-path refactors and recluster safety improvements,
2. query-engine improvements around hash join execution and memory behavior,
3. SQL compatibility fixes for compound set-operation queries.

## 7. User Feedback Summary
Direct user feedback is limited today because **no issues were updated** and the provided PRs do not show notable reactions or comment volume. Even so, the active changes reveal likely user pain points:

- **Large analytical joins consume too much memory or scale poorly**
  - Implied by [#19553](https://github.com/databendlabs/databend/pull/19553) and [#19556](https://github.com/databendlabs/databend/pull/19556)

- **Recluster/compaction workflows need safer output sizing**
  - Implied by [#19577](https://github.com/databendlabs/databend/pull/19577)

- **SQL compatibility matters for complex set expressions**
  - Implied by [#19587](https://github.com/databendlabs/databend/pull/19587)

- **Selective read performance remains important**
  - Implied by bloom index optimization in [#19552](https://github.com/databendlabs/databend/pull/19552)

So while explicit end-user sentiment is sparse, engineering priorities continue to align with common OLAP concerns: **performance, correctness, memory efficiency, and storage robustness**.

## 8. Backlog Watch
Because there are **no active issues in the supplied snapshot**, there is no visible issue backlog requiring urgent maintainer attention from today’s data. The main backlog watch items are therefore open PRs with architectural or correctness significance:

- **[#19551](https://github.com/databendlabs/databend/pull/19551) — experimental table branch**
  - Important roadmap-level feature; likely needs careful review due to semantics and long-term surface area.

- **[#19553](https://github.com/databendlabs/databend/pull/19553) — partitioned hash join**
  - High-impact execution-engine work; deserves review because join strategy changes can affect performance and correctness broadly.

- **[#19576](https://github.com/databendlabs/databend/pull/19576) — Fuse block format abstraction**
  - Architectural refactor with future leverage; worth attention to avoid regressions in storage read paths.

- **[#19577](https://github.com/databendlabs/databend/pull/19577) — split oversized compact blocks during recluster**
  - Operationally important bugfix; should be prioritized if oversized blocks are affecting production workloads.

- **[#19587](https://github.com/databendlabs/databend/pull/19587) — preserve parentheses in UNION queries**
  - Smaller in scope but important for SQL correctness; good candidate for quick integration.

### Overall backlog signal
Databend’s visible backlog is currently **PR-heavy rather than issue-heavy**, which is usually a healthy sign for a systems project: maintainers appear to be spending more time landing engine improvements than reacting to new public breakages.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-23

## 1. Today's Overview
Velox saw light-to-moderate pull request activity over the last 24 hours, with **8 PRs updated**, **2 closed/merged**, and **no issue activity**. The absence of new issues suggests a relatively quiet day on the bug-reporting front, while ongoing PR work indicates continued forward motion in integrations, SQL compatibility, and infrastructure cleanup. Activity is somewhat skewed toward feature development and refactoring rather than urgent stability response. Overall, project health looks **steady**, with maintainers landing incremental improvements while several open PRs hint at medium-term roadmap expansion.

## 2. Project Progress

### Merged/Closed PRs today

#### 1) Presto SQL type formatting moved into production code
- **PR:** [#16876](https://github.com/facebookincubator/velox/pull/16876) — **Merged**
- **Title:** `feat: Add toPrestoTypeSql() for Presto SQL type formatting`
- **What changed:** A SQL type formatting utility was promoted from a test/fuzzer area into production code and renamed to `toPrestoTypeSql()` for dialect clarity.
- **Why it matters:** This is a meaningful **SQL compatibility and developer ergonomics** improvement. By making Presto type rendering available in production paths, Velox improves its ability to interoperate with Presto-oriented components and produce dialect-correct type strings.
- **Technical impact:** The summary notes fixes in the original implementation, including better handling of custom types, which should reduce type-formatting inconsistencies and improve correctness in systems relying on Presto SQL serialization.

#### 2) Cleanup of backward-compatibility code
- **PR:** [#15721](https://github.com/facebookincubator/velox/pull/15721) — **Closed**
- **Title:** `refactor: Remove backward compatible code`
- **What changed:** Old compatibility paths were removed following an upstream Presto update.
- **Why it matters:** This is mainly a **maintenance and codebase simplification** change rather than a user-facing feature. Removing legacy logic usually lowers long-term maintenance cost and reduces ambiguity in behavior.
- **Technical impact:** It may help future engine evolution by narrowing supported pathways, though users depending on older integration behavior may need to verify compatibility.

## 3. Community Hot Topics

There were no issues updated today, and the supplied PR metadata does not include meaningful comment or reaction counts, so “hot topics” are best inferred from the technical significance of the most visible active PRs.

### A) GPU execution and kernel fusion experimentation
- **PR:** [#16878](https://github.com/facebookincubator/velox/pull/16878)
- **Title:** `TorchWave fused PyTorch nativert executor`
- **Analysis:** This is the most strategically notable PR in the set. It introduces a framework that compiles FX graphs into fused CUDA kernels, pointing to interest in **GPU acceleration**, **operator fusion**, and tighter integration with ML-style execution graphs. For Velox, this signals exploration beyond classical CPU-centric vectorized execution toward heterogeneous execution models.

### B) Spark SQL aggregation compatibility
- **PR:** [#16595](https://github.com/facebookincubator/velox/pull/16595)
- **Title:** `feat(spark): Add approx_count_distinct_for_intervals SparkSql aggregate function`
- **Analysis:** This reflects continued demand for **Spark semantic parity**, particularly in cost-based optimization and histogram/NDV workflows. The use of HLL internally suggests Velox is extending functionality while trying to preserve Spark planner expectations.

### C) Lakehouse/table format support
- **PR:** [#16816](https://github.com/facebookincubator/velox/pull/16816)
- **Title:** `feat: add init support for paimon append table read`
- **Analysis:** This points to ongoing expansion in **table format and connector compatibility**. Support for append-table reads in Paimon indicates demand from users running modern lakehouse stacks and wanting Velox to participate more directly in those data access patterns.

### D) Object store operational tuning
- **PR:** [#16879](https://github.com/facebookincubator/velox/pull/16879)
- **Title:** `Add executor pool size to S3 configs`
- **Analysis:** This addresses a practical infrastructure need: controlling async execution behavior in AWS SDK usage. It suggests users may be running into **thread management, scalability, or resource efficiency** concerns in S3-heavy workloads.

## 4. Bugs & Stability

No new issues were reported or updated today, so there is **no fresh evidence of new crashes, correctness regressions, or production incidents** from GitHub issue traffic. However, a few PRs imply ongoing preventative or corrective work:

### Medium severity
#### Build dependency correctness
- **PR:** [#16867](https://github.com/facebookincubator/velox/pull/16867)
- **Title:** `fix(build): IcebergParquetStatsCollector requires ParquetWriter`
- **Assessment:** This is a build/integration correctness fix. While not a runtime engine bug, missing dependency wiring can block downstream builds or certain Iceberg/Parquet-related functionality. The header cleanup also suggests maintainability and compile hygiene improvements.

### Low-to-medium severity
#### Type formatting correctness and dialect fidelity
- **PR:** [#16876](https://github.com/facebookincubator/velox/pull/16876)
- **Assessment:** The merged fix addresses SQL type string generation issues. This is more likely to affect **metadata exchange, SQL serialization, or compatibility layers** than query execution itself, but it still matters for correctness in integrations.

### Low severity
#### Legacy code removal risks
- **PR:** [#15721](https://github.com/facebookincubator/velox/pull/15721)
- **Assessment:** Refactors removing backward compatibility can introduce migration risk if downstreams still rely on old paths, but no issue evidence today indicates active breakage.

## 5. Feature Requests & Roadmap Signals

Even without issue traffic, the current PR set offers strong roadmap hints.

### Likely near-term feature directions

#### 1) Broader Spark SQL coverage
- **PR:** [#16595](https://github.com/facebookincubator/velox/pull/16595)
- **Signal:** Continued investment in Spark-specific aggregate semantics suggests more Spark SQL functions and planner-aligned behavior are likely in upcoming releases.
- **Prediction:** Additional aggregates, interval semantics fixes, and compatibility improvements for Spark optimizer support are plausible next steps.

#### 2) Expanded lakehouse connector/table format support
- **PR:** [#16816](https://github.com/facebookincubator/velox/pull/16816)
- **Signal:** Paimon read-path work indicates continued broadening of format/connectivity support beyond core file readers.
- **Prediction:** Expect more initialization, scan-path, and metadata handling improvements around lakehouse ecosystems.

#### 3) Cloud storage tuning and production-readiness
- **PR:** [#16879](https://github.com/facebookincubator/velox/pull/16879)
- **Signal:** S3 config surface expansion usually follows real deployment pressure.
- **Prediction:** More knobs for object-store retries, concurrency, executors, or IO behavior may appear soon.

#### 4) GPU and fused execution experiments
- **PR:** [#16878](https://github.com/facebookincubator/velox/pull/16878)
- **Signal:** This is the strongest long-range roadmap signal in today’s data.
- **Prediction:** If this line continues, Velox may gradually expose more interfaces for accelerated execution, codegen, or ML-adjacent operator graphs, though this likely remains experimental in the near term.

#### 5) API simplification for extensibility
- **PR:** [#15844](https://github.com/facebookincubator/velox/pull/15844)
- **Title:** `refactor: Fold registerSerialization into registerType for OpaqueType`
- **Signal:** Simplifying OpaqueType registration points to ongoing work on **extension APIs** and custom type ergonomics.
- **Prediction:** This could land as part of broader cleanup to make custom type integration easier and less error-prone.

## 6. User Feedback Summary

There is no direct issue-based user feedback in the last 24 hours, so user sentiment must be inferred from active work:

- **Compatibility remains a top concern**, especially around Spark SQL semantics and Presto SQL type handling.
- **Operational usability matters**, as seen in S3 executor configuration work, which suggests users care about thread behavior and cloud deployment efficiency.
- **Lakehouse interoperability is a recurring use case**, indicated by Paimon support work and Iceberg-related build fixes.
- **Advanced execution performance is an emerging theme**, with the TorchWave PR implying interest in GPU-backed fused execution for certain workloads.

Overall, current signals suggest users are pushing Velox in three directions: **broader SQL compatibility**, **better integration with modern data/lakehouse stacks**, and **more scalable execution infrastructure**.

## 7. Backlog Watch

These open or recently touched PRs appear to deserve maintainer attention due to age, scope, or strategic importance:

### High attention
#### OpaqueType registration API refactor
- **PR:** [#15844](https://github.com/facebookincubator/velox/pull/15844)
- **Age:** Open since 2025-12-22
- **Why it matters:** API simplification work that remains open for months can slow extension authors and create uncertainty around the preferred integration path.

#### Spark interval NDV aggregate
- **PR:** [#16595](https://github.com/facebookincubator/velox/pull/16595)
- **Age:** Open since 2026-03-02
- **Why it matters:** This is a user-facing SQL feature with likely downstream demand from Spark-compatible deployments.

### Strategic watch
#### TorchWave fused executor
- **PR:** [#16878](https://github.com/facebookincubator/velox/pull/16878)
- **Why it matters:** New and ambitious; likely to need substantial review bandwidth due to architectural implications.

#### Paimon append-table read initialization
- **PR:** [#16816](https://github.com/facebookincubator/velox/pull/16816)
- **Why it matters:** Connector and table-format work often benefits users quickly, but can stall without focused reviewer support.

#### S3 executor pool sizing
- **PR:** [#16879](https://github.com/facebookincubator/velox/pull/16879)
- **Why it matters:** Small configuration PRs can have outsized operational impact and are good candidates for quick turnaround.

## 8. Overall Health Assessment
Velox appears **healthy and steadily evolving**, with no sign of acute bug pressure in today’s GitHub data. The strongest themes are **SQL compatibility**, **ecosystem integration**, **cloud/storage operability**, and early **accelerated execution experimentation**. The main watchpoint is backlog discipline: several meaningful open PRs span compatibility, connector support, and extensibility, and timely review would help convert that work into user-visible progress.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-23

## 1. Today's Overview

Apache Gluten showed **moderate-to-high engineering activity** over the last 24 hours, with **5 issues updated** and **9 pull requests updated**, though **no new release** was published. The main themes were **Spark 4.x test coverage and correctness**, **Velox backend performance/configuration work**, and **incremental SQL/functionality alignment**. A notable portion of activity is still concentrated in **tracking issues and infrastructure/test stabilization**, which suggests the project is in an active hardening phase rather than a release-cutting phase. Overall, project health looks solid, with steady contributor engagement and clear follow-up work across Velox integration, Spark 4 compatibility, and S3 performance tuning.

## 3. Project Progress

### Merged/closed PRs today

#### 1) Spark 4.0 / 4.1 test coverage expansion completed
- [PR #11512](https://github.com/apache/incubator-gluten/pull/11512) — **[CLOSED] [CORE] [UT] Add missing Gluten test suites for Spark 4.0 and 4.1**

This is the only PR closed in the current update window and it is strategically important. It expands Gluten’s wrapper test suite coverage against Spark 4.0 and 4.1, addressing a long-standing gap where Gluten-specific behavior was not comprehensively exercised. This improves confidence in **query engine compatibility**, especially as Spark 4 introduces semantic and planner changes that can silently break native execution paths.

However, the closure did not fully resolve the area: follow-up work remains active to repair disabled suites and correct test harness configuration. That means the project has advanced meaningfully in **validation infrastructure**, but the full compatibility story is still being stabilized.

### Other notable in-flight progress

Although not merged yet, several open PRs indicate where implementation effort is currently moving:

- [PR #11800](https://github.com/apache/incubator-gluten/pull/11800) — replacing incorrect test traits for Spark 4.0/4.1 so tests actually run with the Gluten plugin enabled.
- [PR #11805](https://github.com/apache/incubator-gluten/pull/11805) — adding **golden file comparison** for PlanStability suites to catch planner regressions early.
- [PR #11729](https://github.com/apache/incubator-gluten/pull/11729) — adding support for `approx_count_distinct_for_intervals`, improving **SQL function compatibility**.
- [PR #11807](https://github.com/apache/incubator-gluten/pull/11807) — introducing an executor pool config for Velox/S3 interaction, targeting **storage access performance tuning**.
- [PR #11798](https://github.com/apache/incubator-gluten/pull/11798) — optimizing `HiveTableScanExecTransformer` partition file format discovery, a practical **scan-path performance improvement**.

## 4. Community Hot Topics

### 1) Velox upstream gap tracking remains the most discussed coordination item
- [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585) — **[VL] useful Velox PRs not merged into upstream**
- Comments: 16, 👍 4

This is currently the most active issue by comments/reactions. It tracks useful Velox patches, many originating from the Gluten community, that have not yet landed upstream. The underlying technical need is clear: **Gluten’s delivery pace depends heavily on upstream Velox acceptance**, and contributors need visibility into which downstream-required patches are still pending. This also signals an integration risk: too many important unmerged Velox dependencies can slow feature adoption, complicate rebasing, and increase maintenance burden.

### 2) Spark 4.x disabled test suites are a major stabilization focus
- [Issue #11550](https://github.com/apache/incubator-gluten/issues/11550) — **Spark 4.x: Tracking disabled test suites**
- Comments: 6
- Related PRs:
  - [PR #11800](https://github.com/apache/incubator-gluten/pull/11800)
  - [PR #11805](https://github.com/apache/incubator-gluten/pull/11805)
  - [PR #11512](https://github.com/apache/incubator-gluten/pull/11512)

This tracker shows the project is still actively paying down **compatibility and correctness debt** introduced by Spark 4.x support. The technical need is not just “passing tests,” but ensuring that native execution is validated under the correct plugin/session setup and that plan regressions are visible over time. This is a strong signal that maintainers are prioritizing **test fidelity**, not only code coverage counts.

### 3) S3 read-path performance on large-core executors is getting attention
- [Issue #11765](https://github.com/apache/incubator-gluten/issues/11765) — **[CLOSED] [VL] AWS S3 read performance is very bad when executor.cores are big**
- Related PRs:
  - [PR #11807](https://github.com/apache/incubator-gluten/pull/11807)
  - [PR #11806](https://github.com/apache/incubator-gluten/pull/11806)
  - [PR #11709](https://github.com/apache/incubator-gluten/pull/11709)

Even though the issue was closed, it is a hot topic because it produced immediate code and documentation follow-up. The underlying need is better **I/O concurrency control and operator observability** for cloud object storage workloads, especially on larger executors. This reflects real production pressure: users are tuning S3-heavy workloads and need Gluten/Velox behavior to scale predictably as executor parallelism increases.

### 4) Emerging optimizer intelligence proposal
- [Issue #11808](https://github.com/apache/incubator-gluten/issues/11808) — **Proposal: Add execution-aware dynamic join strategy selection after filter execution**

This new issue introduces a higher-level engine capability request: choosing join strategy based on **post-filter actual cardinality**, not only static estimates or AQE stage boundaries. The technical need here is better adaptation to highly selective build-side filters. If pursued, this would be a meaningful step toward smarter native planning/execution integration, especially for star-schema and selective-lookup workloads.

## 5. Bugs & Stability

Ranked by likely operational severity based on the available data.

### High severity

#### 1) Spark 4.x test harness misconfiguration caused false confidence
- [PR #11800](https://github.com/apache/incubator-gluten/pull/11800)
- Tracker: [Issue #11550](https://github.com/apache/incubator-gluten/issues/11550)

This is the most important stability signal today. The PR states that `GlutenTestsCommonTrait` did **not** configure `GlutenPlugin` or create a Gluten-enabled `SparkSession`, meaning some suites were effectively running on vanilla Spark while reporting “offload to gluten.” That is a serious **validation correctness problem**, because it can mask broken offload paths and planner regressions. Fix work exists and is active, but until merged and propagated, Spark 4.x validation results should be interpreted with caution.

#### 2) Disabled Spark 4.x suites indicate unresolved compatibility regressions
- [Issue #11550](https://github.com/apache/incubator-gluten/issues/11550)
- Supporting PRs:
  - [PR #11805](https://github.com/apache/incubator-gluten/pull/11805)
  - [PR #11512](https://github.com/apache/incubator-gluten/pull/11512)

Disabled suites are not necessarily production bugs, but they are often correlated with **known compatibility gaps** or unstable semantics. The fact that this remains an active tracker suggests there are still unresolved areas in Spark 4.x support that need targeted fixes and re-enablement.

### Medium severity

#### 3) AWS S3 read performance degradation with large executor core counts
- [Issue #11765](https://github.com/apache/incubator-gluten/issues/11765) — closed
- Follow-up:
  - [PR #11807](https://github.com/apache/incubator-gluten/pull/11807)
  - [PR #11806](https://github.com/apache/incubator-gluten/pull/11806)
  - [PR #11709](https://github.com/apache/incubator-gluten/pull/11709)

This appears to be a practical performance bug rather than a correctness issue. The reported symptom is significant slowdown under certain S3 and executor-core configurations. The presence of a config PR and docs PR suggests the likely remedy is at least partly **tuning/configuration-driven**, with metrics improvements helping diagnose split-add overhead more accurately.

#### 4) Potential hidden plan regressions in Spark 4 PlanStability suites
- [PR #11805](https://github.com/apache/incubator-gluten/pull/11805)

The need for Gluten-specific golden file comparison indicates maintainers see real risk of **unintended native plan changes** going unnoticed. This is not a single bug report, but a proactive response to regression exposure in the planner/test layer.

### Lower severity / latent compatibility risk

#### 5) ClickHouse backend regex validation PR remains stale
- [PR #11548](https://github.com/apache/incubator-gluten/pull/11548)

This is marked stale, and while not updated as a bug report today, it represents unresolved behavior around **regex compatibility and fallback correctness** for the ClickHouse backend.

## 6. Feature Requests & Roadmap Signals

### 1) VariantType parquet support is a strong Spark 4 roadmap signal
- [Issue #11371](https://github.com/apache/incubator-gluten/issues/11371) — **[VL][Spark-4.0] Add Variant shredding support for Parquet reader and writer**

This aligns directly with Spark 4.0’s new `VariantType` support. Because it affects both **reader and writer behavior** and touches Parquet interoperability, it is a high-value compatibility feature. Given current Spark 4-focused activity, this looks like a plausible candidate for the next significant compatibility-oriented release.

### 2) Support for `approx_count_distinct_for_intervals`
- [PR #11729](https://github.com/apache/incubator-gluten/pull/11729)

This is a concrete SQL surface-area improvement with clear user value. Because it is described as a mapping-only change and depends on an upstream Velox PR, it has a good chance of landing soon once dependency alignment is resolved. It is the kind of incremental SQL compatibility item likely to appear in the next version if upstream coordination progresses.

### 3) Execution-aware dynamic join selection
- [Issue #11808](https://github.com/apache/incubator-gluten/issues/11808)

This is more ambitious than a simple compatibility request. If accepted, it would improve **runtime adaptivity** for selective joins beyond standard AQE behavior. It feels more like a medium-term optimizer enhancement than an immediate release item, but it is an important roadmap signal that users want Gluten to exploit native execution with more **execution-informed planning**.

### 4) Better Velox/S3 configurability and observability
- [PR #11807](https://github.com/apache/incubator-gluten/pull/11807)
- [PR #11806](https://github.com/apache/incubator-gluten/pull/11806)
- [PR #11709](https://github.com/apache/incubator-gluten/pull/11709)

These changes together suggest a roadmap toward more production-ready **cloud object storage tuning**, especially for AWS S3 workloads. This is likely to show up in near-term releases because it addresses real performance complaints and operational visibility gaps.

## 7. User Feedback Summary

Current user and contributor feedback clusters around four pain points:

1. **Spark 4 compatibility confidence**
   - Trackers and test-fix PRs indicate users need assurance that Gluten is genuinely being exercised under Spark 4.0/4.1, not merely passing inherited Spark tests.
   - Relevant items:
     - [Issue #11550](https://github.com/apache/incubator-gluten/issues/11550)
     - [PR #11800](https://github.com/apache/incubator-gluten/pull/11800)
     - [PR #11805](https://github.com/apache/incubator-gluten/pull/11805)

2. **S3 performance on larger clusters/executors**
   - The closed performance issue and immediate follow-ups show users are running **real cloud storage workloads** and observing poor scaling when executor core counts rise.
   - Relevant items:
     - [Issue #11765](https://github.com/apache/incubator-gluten/issues/11765)
     - [PR #11807](https://github.com/apache/incubator-gluten/pull/11807)
     - [PR #11806](https://github.com/apache/incubator-gluten/pull/11806)

3. **Need for upstream Velox alignment**
   - Contributors want a transparent path for important backend changes that Gluten depends on.
   - Relevant item:
     - [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585)

4. **Demand for broader SQL and data type support**
   - Requests around `VariantType` and interval distinct counting show users care about closing the gap with newer Spark semantics and functions.
   - Relevant items:
     - [Issue #11371](https://github.com/apache/incubator-gluten/issues/11371)
     - [PR #11729](https://github.com/apache/incubator-gluten/pull/11729)

Overall satisfaction signals are mixed but constructive: there is no sign of acute community distress, but there is clear pressure for **production robustness, Spark 4 completeness, and backend integration maturity**.

## 8. Backlog Watch

These are important items that appear to need sustained maintainer attention.

### 1) Velox upstream dependency tracker
- [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585)

This remains the clearest backlog coordination hotspot. If the number of useful but unmerged Velox PRs grows, Gluten risks carrying too much implicit dependency debt. Maintainers should keep this list curated and clearly indicate which items are blockers for release readiness.

### 2) Spark 4.x disabled suites tracker
- [Issue #11550](https://github.com/apache/incubator-gluten/issues/11550)

This is still one of the most important quality backlog items. Until the disabled suites are fixed and re-enabled, Spark 4 support will remain partially provisional. It deserves continued prioritization before any broad “Spark 4 ready” messaging.

### 3) Variant shredding support for Parquet
- [Issue #11371](https://github.com/apache/incubator-gluten/issues/11371)

Created in early January and still open, this is a strategically important compatibility feature tied to Spark 4.0’s evolving type system. It is not noisy in comments, but it is likely high impact for users adopting newer Spark capabilities.

### 4) ClickHouse regex validation via native RE2
- [PR #11548](https://github.com/apache/incubator-gluten/pull/11548)

This PR is explicitly marked stale. Since regex semantics often affect correctness and fallback behavior, it is a good candidate for triage: merge, request refresh, or close with a clear rationale.

---

## Bottom line

Apache Gluten is currently strongest in **active engineering throughput and stabilization work**, especially around **Spark 4.x test correctness** and **Velox-backed performance tuning**. The biggest near-term risks are not release volume but **validation fidelity**, **upstream Velox dependency drag**, and **remaining Spark 4 compatibility gaps**. The most likely next-version themes are improved test reliability, S3 tuning/docs, incremental SQL function coverage, and deeper Spark 4 feature alignment.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-23

## 1) Today’s Overview

Apache Arrow showed moderate day-to-day maintenance activity over the last 24 hours: 20 issues were updated and 6 PRs saw movement, with 2 PRs/issues closed and no new releases published. The activity mix leaned more toward backlog grooming, CI/build stability, and incremental API work than toward major end-user feature landings. A notable signal is continued momentum around ORC predicate pushdown foundations in C++, alongside smaller ecosystem improvements in Ruby/GLib and Gandiva correctness fixes. Overall project health looks steady, but a meaningful share of issue churn came from stale-warning updates on older tickets rather than fresh resolution of long-standing roadmap items.

---

## 2) Project Progress

### Merged/closed PRs today

#### 1. Ruby/GLib file metadata support landed
- PR: [#49577](https://github.com/apache/arrow/pull/49577)  
- Related issue: [#49576](https://github.com/apache/arrow/issues/49576)

This change added support for custom metadata in Arrow file Footers across Ruby and GLib bindings. Concretely, it exposes metadata reading and writing APIs, improving file-format interoperability and allowing applications to preserve auxiliary metadata in Arrow IPC/file workflows. While not a query-engine feature directly, this is important for analytical pipelines that depend on schema/file annotations for lineage, app-specific semantics, or integration with higher-level storage systems.

#### 2. Gandiva crash fixes for extreme integer inputs
- PR: [#49471](https://github.com/apache/arrow/pull/49471)  
- Related issue: [#49470](https://github.com/apache/arrow/issues/49470) *(referenced in PR title; issue details not included in provided issue list)*

This closed PR fixes crashes in Gandiva functions `substring_index` and `truncate` when passed extreme integer values such as `INT_MIN` and `INT_MAX`. This is a correctness and stability improvement for expression execution, especially relevant to SQL/vectorized compute workloads that may hit edge-case literals or generated plans. Among today’s changes, this is the clearest engine-level robustness improvement.

### Net technical direction from merged work
Today’s completed work mainly advanced:
- **Execution correctness** in Gandiva under pathological inputs
- **Storage/file-format metadata fidelity** in Ruby/GLib bindings

There were **no major merged changes** today in scan planning, dataset execution, or Parquet/ORC runtime performance, though several open PRs point in that direction.

---

## 3) Community Hot Topics

### A. ORC predicate pushdown foundation
- Issue: [#48986 ORC Predicate Pushdown](https://github.com/apache/arrow/issues/48986)
- Issue: [#49360 [C++][ORC] Add stripe statistics API to ORCFileReader](https://github.com/apache/arrow/issues/49360)
- PR: [#49379 GH-49360: [C++][ORC] Add stripe statistics API to ORCFileReader](https://github.com/apache/arrow/pull/49379)

This is the strongest roadmap signal in the current digest. The request is to move ORC filtering from post-read row filtering to true pushdown using stripe/file statistics. Technically, that implies exposing stripe-level stats, enabling selective stripe reads, and later wiring those capabilities into the dataset scanning layer. The underlying user need is clear: **reduce IO and CPU for selective analytical scans over ORC**, bringing Arrow closer to the expected behavior of mature lakehouse/query engines.

### B. C++ dataset/scanner architecture debt remains unresolved
- Issue: [#31486 [C++] Migrate scanner logic to ExecPlan, remove merged generator](https://github.com/apache/arrow/issues/31486)
- Issue: [#30891 [C++] The C++ API for writing datasets could be improved](https://github.com/apache/arrow/issues/30891)
- Issue: [#30893 [C++][Datasets] Improve memory usage of datasets](https://github.com/apache/arrow/issues/30893)

These older but still-updated tickets point to persistent architectural friction in the C++ dataset layer: scanner execution model complexity, unintuitive write APIs, and memory efficiency concerns. For OLAP users, these are not cosmetic issues—they affect how easily Arrow can be embedded as an analytical storage and scan engine component.

### C. Python developer-experience/documentation refinement
- Issue: [#31479 [Python] Refactor documentation for generic Scanner parameters](https://github.com/apache/arrow/issues/31479)
- Issue: [#49572 [Python][Docs] Consolidate the information on the editable install in Python dev section](https://github.com/apache/arrow/issues/49572)
- PR: [#48622 [Python] Add internal type system stubs](https://github.com/apache/arrow/pull/48622)

There is continuing effort to improve PyArrow’s developer ergonomics via better docs and type annotations. This is less about engine capability and more about making Arrow easier to consume in modern Python tooling stacks.

### D. R CI/doc build reliability
- Issue: [#49578 [CI][R] gcc sanitizer failure](https://github.com/apache/arrow/issues/49578)
- PR: [#49381 [R] Remove hidden CI test chunks from setup.Rmd to fix r-devdocs](https://github.com/apache/arrow/pull/49381)

These updates suggest some maintenance attention is going to release/CI reliability in the R ecosystem, especially around sanitizer findings and devdocs build correctness.

---

## 4) Bugs & Stability

Ranked by likely severity based on the provided data:

### 1. C++ build failure with xsimd 14.1.0 on macOS
- Issue: [#49579](https://github.com/apache/arrow/issues/49579)

**Severity: High**  
This is a fresh C++ build regression on macOS involving SIMD code (`bpacking_simd_default.cc`) with xsimd 14.1.0. Build failures on a current dependency version can block contributors, downstream packagers, and CI reliability. No fix PR is listed yet in the provided data.

### 2. R gcc sanitizer failure in nightly crossbow
- Issue: [#49578](https://github.com/apache/arrow/issues/49578)

**Severity: High**  
Nightly ASAN/UBSAN-type failures are serious because they often indicate latent memory safety or undefined behavior issues. Even if initially surfacing in test infrastructure, sanitizer failures can reveal real defects. No linked fix PR appears in today’s set.

### 3. Gandiva crashes on extreme integer values — fixed
- PR: [#49471](https://github.com/apache/arrow/pull/49471)

**Severity: Medium-High, now mitigated**  
This fix addressed outright crashes in compute functions under edge-case integer inputs. Since expression engines sit close to SQL and analytic execution paths, crash bugs here are important. Good signal: a fix has already landed.

### 4. Longstanding scanner error/cancellation behavior concerns
- Issue: [#31486](https://github.com/apache/arrow/issues/31486)

**Severity: Medium**  
This is not a newly reported bug, but the issue describes flawed error propagation/cancellation semantics in merged generator behavior. In analytical execution, improper cancellation can waste IO/CPU and complicate correctness under failure. Still open.

### 5. `tzinfo_to_string(None)` behavior in PyArrow
- Issue: [#20172](https://github.com/apache/arrow/issues/20172)

**Severity: Low**  
A smaller API ergonomics bug, but one that affects Python usability and edge-case compatibility.

---

## 5) Feature Requests & Roadmap Signals

### Most meaningful roadmap signal: ORC pushdown
- Issue: [#48986](https://github.com/apache/arrow/issues/48986)
- PR: [#49379](https://github.com/apache/arrow/pull/49379)

This looks like the feature most likely to continue into the next Arrow release cycle. The work is already decomposed sensibly:
1. expose ORC stripe/file statistics in C++;
2. allow selective stripe reads;
3. hook this into dataset filtering logic.

For analytical engines, this is a high-value storage optimization because it can materially reduce scan costs on ORC datasets.

### Parquet write-path observability/control
- PR: [#49527 [C++][Parquet] Add total_buffered_bytes() API for RowGroupWriter](https://github.com/apache/arrow/pull/49527)

This is a useful low-level API for controlling row group sizing dynamically. It signals continued work on **Parquet writer ergonomics and memory-aware writing**, which matters to high-throughput ingestion systems and ETL pipelines.

### C++ dataset usability and execution refactoring
- Issue: [#30891](https://github.com/apache/arrow/issues/30891)
- Issue: [#31486](https://github.com/apache/arrow/issues/31486)
- Issue: [#30893](https://github.com/apache/arrow/issues/30893)

These long-lived issues continue to indicate demand for:
- simpler C++ dataset writing APIs,
- unification of scanner logic with `ExecPlan`,
- lower memory overhead during scans.

This cluster suggests Arrow users still want the C++ dataset layer to behave more like a polished analytical execution subsystem rather than a set of lower-level primitives.

### Documentation and typing improvements
- PR: [#48622](https://github.com/apache/arrow/pull/48622)
- Issue: [#31479](https://github.com/apache/arrow/issues/31479)
- Issue: [#49572](https://github.com/apache/arrow/issues/49572)

These are likely to land incrementally and improve adoption, especially in PyArrow-heavy data engineering environments.

---

## 6) User Feedback Summary

### Main pain points visible today

#### 1. Users want Arrow to do less work at scan time
- ORC predicate pushdown request: [#48986](https://github.com/apache/arrow/issues/48986)

The clearest user feedback is performance-driven: users do not want to read entire ORC stripes and filter afterward. They expect statistics-aware pruning similar to what analytical databases and modern table engines provide.

#### 2. C++ APIs remain harder to use directly than Python/R wrappers
- C++ dataset write API issue: [#30891](https://github.com/apache/arrow/issues/30891)

This confirms a recurring Arrow pattern: Python and R smooth over complexity that remains visible in C++. For engine integrators building directly on Arrow C++, API sharp edges are still a real adoption tax.

#### 3. Build and dependency compatibility matter a lot to downstream users
- xsimd/macOS build failure: [#49579](https://github.com/apache/arrow/issues/49579)

Users and contributors are sensitive to third-party dependency churn. SIMD/dependency-related regressions are especially painful because they can block installs and package builds even before runtime use begins.

#### 4. Docs still lag implementation details in some areas
- Scanner docs: [#31479](https://github.com/apache/arrow/issues/31479)
- Python editable install docs: [#49572](https://github.com/apache/arrow/issues/49572)
- R filename partitioning docs: [#31493](https://github.com/apache/arrow/issues/31493)
- S3 retention docs/support question: [#31489](https://github.com/apache/arrow/issues/31489)

There is visible demand not just for features, but for clearer explanation of existing behavior, especially around datasets, partitioning, and dev workflows.

---

## 7) Backlog Watch

These older items look important enough to merit renewed maintainer attention:

### A. Dataset execution architecture
- [#31486 [C++] Migrate scanner logic to ExecPlan, remove merged generator](https://github.com/apache/arrow/issues/31486)

This is strategically important for Arrow as an analytical scan/compute substrate. Open since 2022, still active only via stale-warning churn, and likely foundational for improving execution semantics.

### B. C++ dataset writer usability
- [#30891 [C++] The C++ API for writing datasets could be improved](https://github.com/apache/arrow/issues/30891)

Closed today, but worth watching historically because it captured genuine ergonomics issues for direct C++ consumers. If it was closed administratively rather than by implementation, the underlying usability concerns may remain.

### C. Dataset memory efficiency
- [#30893 [C++][Datasets] Improve memory usage of datasets](https://github.com/apache/arrow/issues/30893)

Also closed, but the topic remains critical for large-scale scans and embedded analytical engines. If sub-issues remain unresolved, this area still deserves roadmap visibility.

### D. Python typing work is long-running and awaiting change review
- [#48622 [Python] Add internal type system stubs](https://github.com/apache/arrow/pull/48622)

Opened in 2025 and still not merged. This is not urgent for runtime stability, but it is significant for long-term maintainability and Python ecosystem polish.

### E. R devdocs/CI repair PR awaiting review
- [#49381 [R] Remove hidden CI test chunks from setup.Rmd to fix r-devdocs](https://github.com/apache/arrow/pull/49381)

This seems actionable and useful, especially if it reduces release-gap CI brittleness.

---

## 8) Overall Health Assessment

Apache Arrow appears operationally healthy but in a **maintenance-heavy** rather than **release-heavy** moment. The most interesting forward signal is ORC predicate pushdown groundwork, which could materially improve Arrow’s usefulness in OLAP-style selective scans. At the same time, fresh build/sanitizer issues show that cross-platform stability and dependency management remain active concerns. The backlog still contains important C++ dataset-engine items that look strategically relevant and under-resolved relative to their age.

## Key Links
- ORC pushdown request: [#48986](https://github.com/apache/arrow/issues/48986)
- ORC stats API issue: [#49360](https://github.com/apache/arrow/issues/49360)
- ORC stats API PR: [#49379](https://github.com/apache/arrow/pull/49379)
- macOS/xsimd build failure: [#49579](https://github.com/apache/arrow/issues/49579)
- R sanitizer failure: [#49578](https://github.com/apache/arrow/issues/49578)
- Gandiva crash fix PR: [#49471](https://github.com/apache/arrow/pull/49471)
- Ruby metadata support PR: [#49577](https://github.com/apache/arrow/pull/49577)

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*