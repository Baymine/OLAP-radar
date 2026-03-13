# Apache Doris Ecosystem Digest 2026-03-13

> Issues: 7 | PRs: 183 | Projects covered: 10 | Generated: 2026-03-13 01:55 UTC

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

# Apache Doris Project Digest — 2026-03-13

## 1. Today's Overview

Apache Doris showed **very high development activity** over the last 24 hours: **183 PRs updated** and **91 PRs merged/closed**, versus only **7 issues updated**. The signal is strongly execution-oriented: maintainers are landing performance work, branch backports, correctness fixes, and platform compatibility patches at a fast pace. Current engineering focus appears concentrated on **query engine optimization, memory footprint reduction, search/query_v2 correctness, file cache resilience, and cross-version stabilization for 4.0.x/4.1.x branches**. Issue traffic is comparatively light, but one newly reported **BE crash on Iceberg scanning/loading** stands out as the most important fresh stability concern.

## 3. Project Progress

### Query engine and execution improvements merged/closed today

Several merged or closed PRs indicate continued investment in **execution-layer performance and correctness**:

- [#59410](https://github.com/apache/doris/pull/59410) — **[Improvement](hash) opt for pack_fixeds**  
  Refactors null-map handling and key packing in hash join / hash table code. This suggests ongoing low-level CPU-path tuning in core execution operators, likely aimed at higher throughput and less overhead in joins and hash-based aggregation.

- [#60141](https://github.com/apache/doris/pull/60141) — **[Chore](execution) update PARALLEL_EXCHANGE_INSTANCE_NUM/BATCH_SIZE default value**  
  Default execution settings were adjusted, with the PR noting around **~5% overall performance improvement**. This is an important operational signal: Doris is still extracting material gains through runtime defaults, not only algorithmic changes.

- [#61287](https://github.com/apache/doris/pull/61287) — **pick #60141 #59410**  
  Shows that the above execution improvements are considered valuable enough for branch propagation.

### Query correctness and SQL semantics fixes

- [#61200](https://github.com/apache/doris/pull/61200) — **[fix](search) Replace ExcludeScorer with AndNotScorer for MUST_NOT to handle NULL rows**  
  Fixes incorrect behavior in `search('NOT ...')` predicates where NULL rows were improperly included. This improves semantic consistency between full-text search syntax and SQL boolean negation expectations.

- [#59074](https://github.com/apache/doris/pull/59074) — **[fix](topnFilter) Fix TopN filter probe expressions to wrap nullable slots when pushed through outer joins**  
  Important optimizer/executor correctness fix for **outer join + TopN filter pushdown** scenarios, where nullability handling can easily produce wrong results.

- [#61268](https://github.com/apache/doris/pull/61268) — branch-4.0 backport of #59074  
  Confirms the fix is relevant for stable release consumers, not just trunk users.

### Query/search feature advancement

- [#60701](https://github.com/apache/doris/pull/60701) — **[feat](query_v2) Add PrefixQuery, PhrasePrefixQuery and UnionPostings support**  
  Adds search capability depth in query_v2. This expands Doris’ search-like retrieval expressiveness and suggests continued convergence between analytical SQL and embedded search-style access patterns.

- [#61254](https://github.com/apache/doris/pull/61254) — branch-4.0 cherry-pick of #60701  
  Indicates these search enhancements are expected to benefit near-term stable users.

### Build and platform stabilization

- [#61285](https://github.com/apache/doris/pull/61285) — **[fix](build) Fix Boost sigtimedwait compile error on macOS**  
- [#61291](https://github.com/apache/doris/pull/61291) — **[fix](build) Fix --whole-archive linker error on macOS**  

These two PRs together show active effort to improve **macOS build portability**, likely helping local development and CI reliability.

## 4. Community Hot Topics

### Most discussed issues / PRs

- [Issue #37502](https://github.com/apache/doris/issues/37502) — **Release Note 3.0.0**  
  7 comments, 13 👍  
  Still receiving updates despite being a release-note issue. The enduring interest reflects that **3.0.0 remains a major reference point**, especially because of **compute-storage decoupled mode** and associated architectural changes. The strong reaction count suggests users still orient feature understanding around that release line.

- [Issue #27993](https://github.com/apache/doris/issues/27993) — **[Bug] User select list can't match result field when using nereids**  
  5 comments  
  This points to persistent user sensitivity around **Nereids planner compatibility and result-shape correctness**. Even older planner inconsistencies remain operationally relevant.

- [Issue #42358](https://github.com/apache/doris/issues/42358) — **[Bug] https://doris.apache.org cpu usage is very high**  
  4 comments  
  Although not a database engine defect, it reflects ecosystem quality concerns: users care about the **documentation/web experience**, and site performance issues can still affect adoption and trust.

- [PR #57410](https://github.com/apache/doris/pull/57410) — **[feature](filecache) A 2Q-LRU mechanism for protecting hotspot data in the normal queue**  
  Long-running open performance/storage PR. The technical need is clear: protect hot cache pages from scan pollution and read-ahead churn. This aligns with cloud/object-storage-heavy deployments where local cache efficiency matters directly to latency and cost.

- [PR #60567](https://github.com/apache/doris/pull/60567) — **[improvement](executor) expose query progress when select processlist or active_queries**  
  Strong practical observability value. Demand here reflects user need for **better runtime visibility and operational debugging**, especially in long-running analytical workloads.

### Technical needs behind the hot topics

Across these items, the community is signaling demand for:
1. **Planner correctness and compatibility** — especially around Nereids.
2. **Operational observability** — progress reporting, active query visibility.
3. **Cache efficiency for cloud-native deployments** — more advanced file cache admission/retention policies.
4. **Clear release communication** — architectural changes such as compute-storage decoupling still need active explanation.

## 5. Bugs & Stability

### Highest-severity items

#### 1) BE crash during Iceberg table scanning/loading
- [Issue #61225](https://github.com/apache/doris/issues/61225) — **[Bug] BE Crash with SIGSEGV in ByteArrayDictDecoder and std::out_of_range during Iceberg table scanning/loading**  
  Severity: **Critical**  
  A fresh report on **v4.0.2** involving backend crashes while reading/loading Iceberg tables. Because it is a reproducible SIGSEGV in BE and affects external table access, this is today's most serious stability signal.  
  **Fix PR found in provided data:** none directly linked yet.

#### 2) Nereids result-field mismatch
- [Issue #27993](https://github.com/apache/doris/issues/27993) — **[Bug] User select list can't match result field when using nereids**  
  Severity: **High**  
  This is a query correctness issue: mismatched result fields between Nereids and legacy planners can break application compatibility and trust in planner rollout.  
  **Fix PR found in provided data:** none obvious from today’s list.

#### 3) Function name conflict between user-defined alias and system function
- [Issue #37083](https://github.com/apache/doris/issues/37083) — **[Bug] user-defined union_udf.date_sub(now(3),2) conflict with system date_sub(now(3),2)**  
  Severity: **Medium**  
  This impacts UDF/alias namespace behavior and SQL compatibility, especially for users extending Doris with custom function libraries.  
  **Fix PR found in provided data:** none shown.

#### 4) Documentation website CPU usage issue
- [Issue #42358](https://github.com/apache/doris/issues/42358) — **[Bug] https://doris.apache.org cpu usage is very high**  
  Severity: **Low for engine / Medium for user experience**  
  Not a database runtime issue, but it affects docs accessibility and community UX.

### Relevant stability fixes merged/active today

- [#61200](https://github.com/apache/doris/pull/61200) — search `MUST_NOT` NULL-row correctness fix
- [#59074](https://github.com/apache/doris/pull/59074) / [#61268](https://github.com/apache/doris/pull/61268) — TopN filter nullability fix across outer joins
- [#61253](https://github.com/apache/doris/pull/61253) — **[fix](streaming) Fix NPE in StreamingInsertJob when MetricRepo is not initialized during replay**
- [#61236](https://github.com/apache/doris/pull/61236) — **[fix](es-catalog) Fix query error when ES keyword field contains array data**
- [#61205](https://github.com/apache/doris/pull/61205) — **[fix](filecache) self-heal stale DOWNLOADED entries on local NOT_FOUND**
- [#61272](https://github.com/apache/doris/pull/61272) — **[opt](cache) fix LRU-K visits list key collision and stale entry on erase**
- [#61280](https://github.com/apache/doris/pull/61280) — **[Fix](pyudf) Fix concurrent race condition when import module**

Overall, the fix stream suggests maintainers are actively addressing **null semantics, replay/recovery reliability, cache metadata correctness, external connector compatibility, and Python UDF concurrency safety**.

## 6. Feature Requests & Roadmap Signals

### Notable user-requested features

- [Issue #55788](https://github.com/apache/doris/issues/55788) — **[Enhancement] function SPLIT_BY_STRING(<str>, <separator>[, <limit>])**  
  Request for a third optional `limit` parameter. This is a small but practical SQL ergonomics enhancement, especially for ETL/text-processing workloads. It feels like the kind of feature that could plausibly land in a minor release because of its contained scope and clear compatibility with existing behavior.

### Strong roadmap signals from open PRs

- [#57410](https://github.com/apache/doris/pull/57410) — **2Q-LRU for file cache**  
  Signals ongoing roadmap priority in **cloud-native storage hierarchy optimization**.

- [#61271](https://github.com/apache/doris/pull/61271) — **[feature](memory) Global mem control on scan nodes**  
  Indicates future improvements in **predictable resource governance** for scan-heavy workloads.

- [#60567](https://github.com/apache/doris/pull/60567) — **Expose query progress in processlist / active_queries**  
  Strong sign of investment in **query observability and admin UX**.

- [#61267](https://github.com/apache/doris/pull/61267) — **support exclude_columns for Postgres streaming job**  
  Shows connector and CDC usability remain active roadmap areas.

- [#60275](https://github.com/apache/doris/pull/60275) — **LDAPS support via configuration property**  
  Indicates enterprise deployment/security integration demand.

- [#60897](https://github.com/apache/doris/pull/60897) — **Support condition cache for external table**  
  Suggests further optimization around external lake/query federation scenarios.

- [#61260](https://github.com/apache/doris/pull/61260) — **Optimize execution of GROUP BY count(*)**  
  Reinforces the theme that classic aggregate-path micro-optimizations are still considered worthwhile and likely to appear in upcoming versions.

### Likely near-term candidates for next version

Based on maturity and relevance, likely candidates for inclusion in a near upcoming version are:
1. **Query progress visibility** ([#60567](https://github.com/apache/doris/pull/60567))
2. **Global scan-node memory control** ([#61271](https://github.com/apache/doris/pull/61271))
3. **Postgres streaming-job column exclusion** ([#61267](https://github.com/apache/doris/pull/61267))
4. **LDAPS support** ([#60275](https://github.com/apache/doris/pull/60275))
5. **File cache policy improvements** ([#57410](https://github.com/apache/doris/pull/57410)), though this may require longer validation.

## 7. User Feedback Summary

Today’s user-visible pain points cluster around four areas:

- **External ecosystem interoperability**  
  Iceberg crash reports, ES keyword-array query issues, Hive catalog late materialization concerns, and Postgres CDC feature requests all show Doris users are deeply using it as a hub across open data systems rather than as an isolated warehouse.

- **Planner and SQL consistency**  
  The Nereids field mismatch issue and function namespace conflict report suggest users still expect exact compatibility and deterministic semantics as Doris evolves its planner and extensibility model.

- **Operational robustness and observability**  
  Query progress exposure, replay-related NPE fixes, and memory-control work indicate users want safer operation under long-running, concurrent, production workloads.

- **Performance under cloud/storage pressure**  
  File cache self-healing, LRU-K fixes, 2Q-LRU work, and memory-footprint reduction PRs all point to real-world scale pressure in disaggregated or object-storage-backed deployments.

Satisfaction signals are indirect but positive on the maintainer side: multiple fixes are being **backported quickly to 4.0.x/4.1.x**, which suggests responsiveness to production users.

## 8. Backlog Watch

These older or important items look like they may need renewed maintainer attention:

- [Issue #27993](https://github.com/apache/doris/issues/27993) — **Nereids result field mismatch**  
  Old but still being updated. Planner correctness issues have outsized trust impact and should not linger indefinitely.

- [Issue #37083](https://github.com/apache/doris/issues/37083) — **UDF/system function name conflict**  
  Important for SQL extensibility and namespace clarity; unresolved behavior here can confuse advanced users.

- [Issue #37502](https://github.com/apache/doris/issues/37502) — **Release Note 3.0.0**  
  Still open and stale-tagged despite high reaction count. If it is being used as a living release note, that should be clarified; otherwise it likely deserves cleanup.

- [PR #57410](https://github.com/apache/doris/pull/57410) — **2Q-LRU filecache mechanism**  
  Potentially high impact for performance, but apparently long-running. Worth attention because cache policy quality is increasingly strategic for modern Doris deployments.

- [PR #56022](https://github.com/apache/doris/pull/56022) — **[fix](json) Using CastToString::from_number to cast float to string**  
  Stale open PR in a sensitive type-conversion area. JSON/string conversion semantics can quietly affect ingestion and query correctness.

- [PR #60897](https://github.com/apache/doris/pull/60897) — **condition cache for external table**  
  Important for federated-query performance, but still open. This aligns with broader external-table adoption trends and may deserve prioritization.

---

## Overall Health Assessment

Apache Doris appears **healthy and highly active**, with especially strong momentum in **performance tuning, backport discipline, and correctness fixes**. The main risk signals are not volume-related but concentrated: **one severe Iceberg BE crash**, lingering **planner correctness debt**, and several **stale but meaningful feature/performance PRs**. The project is clearly investing in both **engine internals** and **cloud/external-data usability**, which is consistent with Doris’ positioning as a modern real-time analytical database with broad ecosystem integration.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-13

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains extremely active, with strong parallel investment in **query performance**, **correctness hardening**, **lakehouse interoperability**, and **operational observability**. Across engines, the center of gravity has clearly shifted from “fast SQL on native storage” to broader platform capability: **Iceberg/Parquet/Paimon integration, vector/text search features, cloud object-store efficiency, and streaming/CDC semantics** now appear repeatedly. Most projects are healthy, but many are simultaneously in a **high-velocity + stabilization** phase, where new capabilities are landing alongside fixes for wrong-result bugs, upgrade regressions, and external-format edge cases. For technical buyers, the market is no longer differentiating on raw speed alone; **correctness, ecosystem fit, and operability** are increasingly decisive.

---

## 2. Activity Comparison

### Daily activity snapshot

| Engine | Issues Updated | PRs Updated | Release Today | Overall Health Score* | Notes |
|---|---:|---:|---|---:|---|
| **Apache Doris** | 7 | 183 | No | **9.0/10** | Extremely high merge velocity, strong backport discipline, one critical Iceberg BE crash |
| **ClickHouse** | 30 | 186 | No | **8.5/10** | Very high activity, but notable 26.2 regression and several correctness/storage concerns |
| **DuckDB** | 29 | 48 | No | **8.3/10** | Strong post-1.5.0 stabilization; high responsiveness to regressions |
| **StarRocks** | 16 | 120 | No | **8.4/10** | High throughput, strong external-table work, but wrong-result issues remain important |
| **Apache Iceberg** | 22 | 50 | No | **8.2/10** | Active patch/backport prep, strong momentum, but cleanup/correctness risks matter |
| **Delta Lake** | 4 | 49 | No | **8.4/10** | Focused implementation phase, especially DSv2/kernel/CDC |
| **Databend** | 5 | 18 | **Yes** (nightly) | **8.1/10** | Healthy and responsive, smaller scale but high correctness focus |
| **Velox** | 9 | 50 | No | **8.0/10** | Strong infra and engine work; timezone/correctness edge cases still open |
| **Apache Gluten** | 7 | 15 | No | **7.9/10** | Good compatibility progress, but dependency/upstream coupling remains a constraint |
| **Apache Arrow** | N/A | N/A | N/A | N/A | Digest unavailable |

\*Health score is a qualitative synthesis of velocity, responsiveness, severity of open issues, and stability signals in the provided digests.

### Read of the table
- **Highest raw code velocity:** Doris and ClickHouse.
- **Most obvious stabilization mode:** DuckDB after 1.5.0, Iceberg around 1.10.x patching, Gluten around Spark 4.x compatibility.
- **Most focused execution-heavy cycle:** Doris.
- **Most ecosystem/interoperability-heavy cycle:** Iceberg, StarRocks, ClickHouse, Delta.

---

## 3. Apache Doris's Position

### Advantages vs peers
Apache Doris stands out for a rare combination of **very high implementation throughput**, **fast backporting to stable branches**, and **simultaneous work across execution engine, search/query_v2, file cache, observability, and external connectors**. Compared with ClickHouse and StarRocks, Doris currently shows especially strong evidence of **branch stabilization discipline**—multiple performance and correctness changes were immediately propagated into 4.0.x/4.1.x. Compared with DuckDB and Databend, Doris is more clearly optimized for **distributed production analytics** rather than embedded/local-first usage.

### Technical approach differences
Doris is increasingly positioned as a **real-time analytical database with broad ecosystem integration**, not just a classic MPP warehouse. Its work today reflects:
- **tight engine-level tuning**: hash packing, exchange defaults, aggregate-path optimization;
- **search/database convergence**: query_v2, prefix/phrase-prefix/union-postings support;
- **cloud-aware storage optimization**: file cache self-healing, LRU-K fixes, open 2Q-LRU work;
- **federated access pressure**: Iceberg, ES, Postgres streaming, external-table optimization.

Relative to peers:
- **vs ClickHouse**: Doris appears more actively balancing core MPP execution with external-table/cloud cache behavior; ClickHouse remains broader in storage/index innovation and SQL surface, but currently carries more visible upgrade/regression risk.
- **vs StarRocks**: both are converging on lakehouse-federated analytics; StarRocks shows more visible shared-data replication and Paimon focus, while Doris shows stronger search integration and active execution micro-optimization.
- **vs DuckDB**: Doris is cluster-oriented and operationally production-centered; DuckDB is stronger in embedded analytics and developer ergonomics.
- **vs Iceberg/Delta**: Doris is an engine consuming and querying open data ecosystems, whereas Iceberg/Delta are table-format/platform layers rather than direct OLAP competitors.

### Community size comparison
On this day’s evidence, Doris is in the **top tier of community throughput**, essentially matching ClickHouse in PR activity and exceeding most others by a wide margin. That suggests:
- a **large and highly engaged maintainer base**,
- good release-branch servicing capacity,
- strong momentum for enterprises that value active support and quick backports.

The main caveat is that high volume does not eliminate risk: the **Iceberg BE crash** is the clearest current stability concern and should be watched closely.

---

## 4. Shared Technical Focus Areas

Below are the strongest cross-project requirements emerging across multiple engines.

### A. External table / lakehouse interoperability
**Engines:** Doris, ClickHouse, StarRocks, Iceberg, Delta Lake, Gluten, DuckDB  
**Needs observed:**
- Iceberg read correctness and metadata behavior
- BigLake/S3 Tables/catalog support
- Paimon view/object-table compatibility
- external-table condition cache / pruning / stats fidelity
- metadata functions on Iceberg
- cloud-catalog packaging and auth correctness

**Interpretation:** Modern analytics engines are expected to operate as **compute layers over open table formats**, not only over native storage.

---

### B. Correctness over aggressive optimization
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Iceberg, Databend, Velox  
**Needs observed:**
- wrong-result fixes in joins, GROUP BY, EXISTS, TopN pushdown, SPJ, bucket-aware execution
- null semantics preservation
- planner/binder/decorrelation correctness
- delete/equality delete correctness
- Parquet predicate/statistics correctness

**Interpretation:** As optimizers become more sophisticated, users increasingly punish silent semantic drift. **Wrong-result bugs are the highest-trust failure class across the ecosystem.**

---

### C. Cloud object-store efficiency
**Engines:** Doris, DuckDB, Iceberg, StarRocks, ClickHouse  
**Needs observed:**
- file cache policy improvements and self-healing
- reduced S3 request counts and better pruning
- GCS/TCP connection control
- shared-data replication acceleration
- external scan memory governance

**Interpretation:** Cost and latency on S3/GCS/object stores are now first-order design constraints, not secondary optimizations.

---

### D. Observability and admin UX
**Engines:** Doris, ClickHouse, Databend, Delta Lake  
**Needs observed:**
- query progress exposure
- query log/statistics improvements
- richer EXPLAIN/perf output
- better estimateStatistics and planner-visible stats

**Interpretation:** Users want systems that are not just fast, but **explainable and debuggable in production**.

---

### E. Streaming / CDC / mutation-path reliability
**Engines:** Doris, Delta Lake, Iceberg, DuckDB, Databend  
**Needs observed:**
- streaming insert replay safety
- micro-batch CDC semantics
- connector commit reliability
- MERGE stability
- change-commit handling / ignore semantics

**Interpretation:** Analytical systems are increasingly part of **continuous ingestion and incremental update pipelines**, not just batch BI.

---

### F. Platform compatibility and build portability
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Velox, Gluten  
**Needs observed:**
- macOS build fixes
- Windows CLI fixes
- Spark 4.x compatibility
- modular build mode support
- dependency/version alignment

**Interpretation:** Adoption now depends heavily on **developer experience, CI reliability, and multi-platform support**.

---

## 5. Differentiation Analysis

## Storage format orientation
- **Doris / ClickHouse / StarRocks / Databend**: full analytical databases with native execution/storage strategies, but increasingly strong external-format integration.
- **DuckDB**: embedded analytical engine, often reading open formats directly rather than operating as a distributed warehouse.
- **Iceberg / Delta Lake**: table-format and transaction layers, not directly interchangeable with OLAP engines, but central to engine interoperability strategy.
- **Velox / Gluten**: execution substrate and Spark-native acceleration layer, respectively, rather than end-to-end warehouses.

## Query engine design
- **Doris / StarRocks / ClickHouse**: distributed OLAP engines with aggressive vectorized execution and cost/performance tuning.
- **DuckDB**: in-process vectorized execution optimized for local/embedded analytics.
- **Databend**: cloud-oriented SQL engine with growing distributed/planner maturity.
- **Velox**: reusable execution engine used downstream by systems like Gluten.
- **Gluten**: Spark acceleration framework mapping Spark plans to native backends, especially Velox.

## Target workloads
- **Doris**: real-time analytics, interactive dashboards, federated/lake queries, increasingly search-inflected SQL.
- **ClickHouse**: high-throughput analytics, observability, mutable analytics, vector/text indexing, mixed native/lakehouse workloads.
- **StarRocks**: lakehouse query acceleration, shared-data deployments, external catalogs, operational BI.
- **DuckDB**: notebooks, local analytics, embedded apps, file-native analysis.
- **Iceberg / Delta**: storage interoperability, table governance, multi-engine data platforms.
- **Databend**: cloud data warehouse use cases with growing SQL coverage.
- **Velox / Gluten**: execution acceleration for engine builders and Spark shops.

## SQL compatibility posture
- **DuckDB** and **ClickHouse** show heavy pressure on advanced SQL correctness and semantics.
- **Doris** and **StarRocks** are actively maturing planner correctness while supporting distributed/lake workloads.
- **Delta** and **Iceberg** focus more on protocol, connector, and semantic consistency across engines.
- **Databend** is visibly investing in SQL edge-case correctness to broaden production credibility.
- **Gluten** focuses on matching Spark semantics while avoiding unnecessary fallback.

---

## 6. Community Momentum & Maturity

### Tier 1: Hyperactive, broad-surface iteration
- **Apache Doris**
- **ClickHouse**
- **StarRocks**

These projects show the strongest evidence of large engineering bandwidth and parallel workstreams. Doris looks especially strong in **execution + stabilization**, ClickHouse in **breadth + branch quality work**, and StarRocks in **external ecosystem + shared-data operations**.

### Tier 2: Active stabilization with strong product direction
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**

These projects are highly healthy but currently more focused on **hardening and release-train preparation** than raw feature sprawl. DuckDB is clearly post-release hardening; Iceberg is patch-oriented and correctness-driven; Delta is laying foundations for its next feature cycle.

### Tier 3: Focused growth / subsystem evolution
- **Databend**
- **Velox**
- **Gluten**

These projects are active and important, but with narrower scope or dependency position in the stack. Velox and Gluten especially matter strategically because they influence other engines, but their community energy is more subsystem-oriented than full-platform broad.

### Maturity signal
- **Most mature operational communities:** Doris, ClickHouse, Iceberg.
- **Most rapid feature-system evolution:** ClickHouse, Doris, Delta.
- **Most obvious “stabilization after change” phase:** DuckDB, Iceberg, Gluten.

---

## 7. Trend Signals

### 1. Open table formats are now central, not optional
The strongest ecosystem-wide trend is that engines are judged by how well they interoperate with **Iceberg, Delta, Paimon, Parquet, BigLake, S3 Tables, and external catalogs**. For architects, this means engine choice should be evaluated as part of a **data platform topology**, not in isolation.

### 2. Wrong-result bugs are more damaging than crashes
Across Doris, ClickHouse, StarRocks, DuckDB, Databend, and Velox, correctness issues receive top priority. Data engineers should therefore treat **semantic regression testing** as a first-class part of engine upgrades, especially for joins, subqueries, pruning, and external-format reads.

### 3. Cloud efficiency is becoming a competitive feature
Request explosion, cache churn, stale metadata, and replication cost now show up as recurring community pain points. For teams querying data in object stores, this has direct implications for **cost control, latency, and cluster sizing**.

### 4. Observability is a buying criterion
Query progress, richer logs, stats reporting, and explain/perf tooling are increasingly requested. This matters for operators because highly optimized engines without **clear introspection** can become expensive to debug in production.

### 5. The stack is modularizing
The ecosystem is separating into:
- **storage layers**: Iceberg, Delta
- **engines**: Doris, ClickHouse, StarRocks, DuckDB, Databend
- **execution substrates/accelerators**: Velox, Gluten

For architects, this means more freedom—but also more integration responsibility. The best-fit architecture may combine layers rather than standardize on one project.

### 6. Apache Doris’s strategic signal
Doris is well-positioned where many trends intersect: **real-time OLAP, external lakehouse access, cache-aware cloud execution, search-style query support, and strong stable-branch maintenance**. For data teams choosing an actively evolving distributed SQL engine, Doris currently looks like one of the strongest options when balanced execution speed, ecosystem integration, and release responsiveness are all required.

--- 

If you want, I can also turn this into:
1. a **one-page executive summary**,  
2. a **Doris vs ClickHouse vs StarRocks deep comparison**, or  
3. a **decision matrix for engine selection by workload**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-13

## 1. Today's Overview

ClickHouse remained highly active over the last 24 hours, with **30 issues updated** and **186 pull requests updated**, indicating strong development throughput and active triage. There were **no new releases**, so the day was centered on stabilizing current branches, backports to 26.2, and continued work on performance and SQL/storage features. The signal from issues is mixed: there is healthy progress on feature delivery, but several **query correctness**, **storage-engine stability**, and **26.2 regression** reports deserve attention. Overall, project health looks strong from an engineering velocity perspective, but current branch quality work appears to be a major focus.

## 2. Project Progress

### Merged/closed PRs and issue closures that moved the project forward

Even without a release, several closures indicate progress in engine functionality, observability, and compatibility:

- **Support text index built on `mapValues` with `IN` operator** was closed and is already marked for backport to 26.2, improving text index usability in semi-structured/map-heavy workloads.  
  Link: [PR #99286](https://github.com/ClickHouse/ClickHouse/pull/99286)

- **LLVM coverage job improvements** landed on CI, which should improve confidence in ongoing changes and regression detection.  
  Link: [PR #99330](https://github.com/ClickHouse/ClickHouse/pull/99330)

- **`system.stack_trace` on macOS** was completed, extending operational introspection beyond Linux and improving developer tooling on non-Linux environments.  
  Link: [PR #98982](https://github.com/ClickHouse/ClickHouse/pull/98982)

- A few older issues were closed that improve product completeness and metadata visibility:
  - **`system.query_log` should record if skip indexes were used** — useful for query tuning and observability.  
    Link: [Issue #78676](https://github.com/ClickHouse/ClickHouse/issues/78676)
  - **Description of URL regexp in `system.grants.access_object`** — improves RBAC transparency for URL/S3-style grants.  
    Link: [Issue #86624](https://github.com/ClickHouse/ClickHouse/issues/86624)
  - **Natural/version sort** was closed, suggesting movement or resolution around a recurring SQL/user-function request.  
    Link: [Issue #14003](https://github.com/ClickHouse/ClickHouse/issues/14003)

### In-progress work with strong product impact

Several open PRs suggest meaningful near-term advancement:

- **`GROUP BY ... ORDER BY ... LIMIT` optimization** targets a classic analytical query shape and could deliver broad query-engine performance gains.  
  Link: [PR #96630](https://github.com/ClickHouse/ClickHouse/pull/96630)

- **ADD ENUM VALUES** is a notable SQL/schema-evolution improvement, reducing friction when evolving enum-based dimensions.  
  Link: [PR #93830](https://github.com/ClickHouse/ClickHouse/pull/93830)

- **Commit Order Projection Index** points to continued investment in storage/indexing mechanics for faster ordered access patterns.  
  Link: [PR #99004](https://github.com/ClickHouse/ClickHouse/pull/99004)

- **Dictionary invalidation optimization** continues work on reducing low-cardinality overhead in read-heavy scenarios.  
  Link: [PR #99285](https://github.com/ClickHouse/ClickHouse/pull/99285)

## 3. Community Hot Topics

### Most discussed issues/PRs

1. **INSERT queries are 3x slower after upgrading from 25.12 to 26.2**  
   This is the clearest user-facing regression in the current digest and the most-commented active issue. It affects `ReplacingMergeTree`, which is a core engine for mutable analytics patterns. The underlying need is straightforward: users want predictable upgrade behavior and stable ingestion throughput across major/minor versions.  
   Link: [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)

2. **Natural / version sort**  
   Although now closed, the renewed activity shows continued demand for more human-friendly string sorting semantics, especially for mixed alphanumeric identifiers. This reflects a recurring SQL ergonomics gap in analytics-facing string operations.  
   Link: [Issue #14003](https://github.com/ClickHouse/ClickHouse/issues/14003)

3. **ClickHouse keeper client unable to connect to ClickHouse Keeper**  
   Operational usability around Keeper remains important. Users running local or colocated deployments expect simple, reliable coordination tooling, and connection errors here translate directly into admin friction.  
   Link: [Issue #99238](https://github.com/ClickHouse/ClickHouse/issues/99238)

4. **Vector skip index not used when vector score alias is referenced in WHERE**  
   This is an important signal from vector-search adopters: users expect ANN indexing to survive common SQL refactorings like aliases. The issue points to planner/index matching limitations rather than missing functionality per se.  
   Link: [Issue #96647](https://github.com/ClickHouse/ClickHouse/issues/96647)

5. **Optimization of `GROUP BY` with `ORDER BY` and `LIMIT`**  
   This PR reflects sustained focus on high-value analytical query shapes. Community interest here likely comes from top-k and dashboard queries where latency matters disproportionately.  
   Link: [PR #96630](https://github.com/ClickHouse/ClickHouse/pull/96630)

## 4. Bugs & Stability

Ranked by likely severity and user impact:

### Critical / high severity

- **26.2 INSERT performance regression: 3x slower than 25.12**  
  This is the most serious end-user issue in today’s set because it affects core ingestion performance on a production engine (`ReplacingMergeTree`) after upgrade. No direct fix PR is listed in the provided data yet.  
  Link: [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)

- **Correlated `EXISTS` on same table silently returns wrong result**  
  Wrong-result bugs are generally more severe than crashes for analytical correctness because they can pass unnoticed into downstream decisions. This issue suggests correlated subquery handling may be incorrectly de-correlated. No linked fix PR is visible here.  
  Link: [Issue #99310](https://github.com/ClickHouse/ClickHouse/issues/99310)

- **Double free or corruption in `MergeTreeDataPartCompact` (CI crash)**  
  Memory corruption in MergeTree paths is a serious signal even if currently seen in CI, because it may point to latent storage-engine instability.  
  Link: [Issue #98949](https://github.com/ClickHouse/ClickHouse/issues/98949)

- **Failed to rename temporary part during merge (CI crash)**  
  Merge/part lifecycle failures are important because they touch the heart of MergeTree durability and background operations.  
  Link: [Issue #99307](https://github.com/ClickHouse/ClickHouse/issues/99307)

- **MergeTreeRangeReader finalize failed during data reading (CI crash)**  
  Another storage-read-path CI failure, reinforcing that MergeTree stability is under active pressure.  
  Link: [Issue #99358](https://github.com/ClickHouse/ClickHouse/issues/99358)

### Medium severity

- **Creating a view using a CTE fails under the analyzer**  
  This is a migration blocker for users enabling the new analyzer, especially DBT-style workflows. It is not just a corner case: it affects common SQL-generation tooling patterns.  
  Link: [Issue #99308](https://github.com/ClickHouse/ClickHouse/issues/99308)

- **`parseDateTimeBestEffort` accepts invalid month-like words**  
  This is a correctness and input-validation issue. It may create subtle data quality problems in ingestion pipelines by accepting malformed strings silently.  
  Link: [Issue #99345](https://github.com/ClickHouse/ClickHouse/issues/99345)

- **`expire_snapshots` over-counts manifest and data files shared across expired snapshots**  
  This matters for Iceberg/lakehouse metadata correctness and could affect cleanup accounting or retention reporting.  
  Link: [Issue #99340](https://github.com/ClickHouse/ClickHouse/issues/99340)

- **Vector skip index not used when alias is referenced in WHERE**  
  Primarily a performance/planner issue, but impactful for users evaluating vector retrieval inside SQL.  
  Link: [Issue #96647](https://github.com/ClickHouse/ClickHouse/issues/96647)

- **Workload preemptive CPU scheduling does not apply during index analysis**  
  Important for multi-tenant fairness and workload management, especially when index analysis is expensive.  
  Link: [Issue #88304](https://github.com/ClickHouse/ClickHouse/issues/88304)

### Fixes in flight

A few active PRs appear to address nearby quality areas:

- **Fix `system.query_log.read_rows` showing 0 rows read for Iceberg**  
  Helps observability for external-table/lakehouse workloads.  
  Link: [PR #99282](https://github.com/ClickHouse/ClickHouse/pull/99282)

- **Fix too strict validation of text index preprocessor**  
  Marked must-backport for 26.2, suggesting maintainers see it as release-relevant.  
  Link: [PR #99359](https://github.com/ClickHouse/ClickHouse/pull/99359)

- **Fix CHECK TABLE with sparse serialization inside Tuple with Dynamic**  
  Classified as a critical bug fix, indicating storage/type-system reliability work.  
  Link: [PR #99351](https://github.com/ClickHouse/ClickHouse/pull/99351)

- **Fix BigLake reads**  
  Important for Iceberg/BigLake interoperability, addressing auth propagation, URL encoding, and namespace traversal.  
  Link: [PR #98998](https://github.com/ClickHouse/ClickHouse/pull/98998)

- **Compare `Time[64]` with `DateTime[64]` properly**  
  A SQL/type correctness fix that should improve semantic consistency.  
  Link: [PR #99267](https://github.com/ClickHouse/ClickHouse/pull/99267)

## 5. Feature Requests & Roadmap Signals

Today’s issue/PR flow shows several clear roadmap directions:

- **Lakehouse and external catalog interoperability**
  - **Support S3 Tables via Iceberg catalog**  
    Link: [Issue #95340](https://github.com/ClickHouse/ClickHouse/issues/95340)
  - **Fix BigLake reads**  
    Link: [PR #98998](https://github.com/ClickHouse/ClickHouse/pull/98998)

  This continues the pattern that ClickHouse is investing heavily in Iceberg-compatible and cloud-catalog-connected analytics.

- **Schema evolution and SQL ergonomics**
  - **ADD ENUM VALUES**  
    Link: [PR #93830](https://github.com/ClickHouse/ClickHouse/pull/93830)
  - **Native `MIGRATE TABLE` SQL command for cross-cluster migration**  
    Link: [Issue #99328](https://github.com/ClickHouse/ClickHouse/issues/99328)
  - **Natural/version sort**  
    Link: [Issue #14003](https://github.com/ClickHouse/ClickHouse/issues/14003)

  These requests indicate users want ClickHouse to reduce dependence on external tooling for schema changes, migration, and application-facing SQL polish.

- **Text search and tokenizer improvements**
  - **Unicode-aware tokenizer**  
    Link: [PR #99357](https://github.com/ClickHouse/ClickHouse/pull/99357)
  - **Text index support on `mapValues(... )` with `IN`**  
    Link: [PR #99286](https://github.com/ClickHouse/ClickHouse/pull/99286)

  This is a strong signal that text indexing is expanding beyond basic tokenization into multilingual and semi-structured use cases.

- **Mutable-table maintenance**
  - **Automatic periodic cleanup of deleted rows in ReplacingMergeTree**  
    Link: [Issue #99348](https://github.com/ClickHouse/ClickHouse/issues/99348)

  This request aligns with real operational needs for mutable analytics tables and seems plausible for a future version, especially given ClickHouse’s focus on better ergonomics around MergeTree lifecycle management.

### Likely next-version candidates

Based on current momentum and maturity, the most plausible near-term inclusions are:

- `ADD ENUM VALUES`  
- Text index usability fixes/backports for 26.2  
- BigLake/Iceberg read fixes  
- Unicode tokenizer support  
- Query-engine performance optimization for `GROUP BY ... ORDER BY ... LIMIT`

## 6. User Feedback Summary

The strongest user feedback themes today are:

- **Upgrade regressions matter more than new features**: the 26.2 INSERT slowdown is the standout concern. Users upgrading production clusters expect consistent ingestion performance.  
  Link: [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)

- **SQL correctness remains a top trust factor**: wrong-result behavior in correlated `EXISTS`, analyzer incompatibilities, and permissive datetime parsing all point to users expecting ClickHouse to behave more predictably in standard SQL and parsing scenarios.  
  Links: [#99310](https://github.com/ClickHouse/ClickHouse/issues/99310), [#99308](https://github.com/ClickHouse/ClickHouse/issues/99308), [#99345](https://github.com/ClickHouse/ClickHouse/issues/99345)

- **Lakehouse users want first-class interoperability**: BigLake, Iceberg, and S3 Tables requests/fixes show ClickHouse is increasingly used as a query engine in broader open-table-format ecosystems rather than only on native storage.  
  Links: [#95340](https://github.com/ClickHouse/ClickHouse/issues/95340), [#98998](https://github.com/ClickHouse/ClickHouse/pull/98998), [#99282](https://github.com/ClickHouse/ClickHouse/pull/99282)

- **Operational ergonomics still matter**: Keeper connectivity, shell completion in keeper-client, and clearer profiler warnings show a desire for smoother day-2 operations.  
  Links: [#99238](https://github.com/ClickHouse/ClickHouse/issues/99238), [#99312](https://github.com/ClickHouse/ClickHouse/pull/99312), [#99197](https://github.com/ClickHouse/ClickHouse/pull/99197)

## 7. Backlog Watch

These older or strategically important items look worth continued maintainer attention:

- **Optimization of `GROUP BY` in the presence of `ORDER BY` and `LIMIT`**  
  High-value performance PR open since February and likely impactful for common dashboard/top-k workloads.  
  Link: [PR #96630](https://github.com/ClickHouse/ClickHouse/pull/96630)

- **ADD ENUM VALUES**  
  Significant SQL usability improvement, open since January, likely useful to many production schemas.  
  Link: [PR #93830](https://github.com/ClickHouse/ClickHouse/pull/93830)

- **Support for S3 Tables [Iceberg catalog]**  
  Important strategic feature for lakehouse adoption; currently low-comment but high ecosystem value.  
  Link: [Issue #95340](https://github.com/ClickHouse/ClickHouse/issues/95340)

- **Vector skip index not used with aliased score in WHERE**  
  Important for ClickHouse’s vector-search credibility because it affects whether SQL composition preserves ANN optimization.  
  Link: [Issue #96647](https://github.com/ClickHouse/ClickHouse/issues/96647)

- **Workload CPU scheduling not applied during index analysis**  
  A niche but significant issue for resource governance in shared clusters.  
  Link: [Issue #88304](https://github.com/ClickHouse/ClickHouse/issues/88304)

- **Bug: Logical error “Metadata is not initialized” in datalake/Iceberg path**  
  This has been open since February and touches complex external metadata initialization paths that can block lakehouse scenarios.  
  Link: [Issue #96806](https://github.com/ClickHouse/ClickHouse/issues/96806)

---

## Overall Assessment

ClickHouse is showing **excellent engineering velocity** and strong ongoing work across query performance, text indexing, interoperability, and operational tooling. The main caution flags are **stability and correctness in edge and upgrade paths**, particularly around **26.2 regressions**, **MergeTree CI crashes**, and **SQL semantic correctness**. The roadmap signals remain clear: ClickHouse continues evolving from a fast OLAP engine into a broader analytical platform with stronger lakehouse, search, and schema-evolution capabilities.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-13

## 1) Today's Overview

DuckDB showed **very high day-to-day activity** over the last 24 hours, with **29 issues updated** and **48 PRs updated**, indicating an intense stabilization and follow-up cycle around the recent **v1.5.0** release. The issue mix is notably dominated by **regressions, CLI/platform compatibility problems, and query planning/execution correctness bugs**, especially on Windows/macOS and in S3/hive-partitioned Parquet workloads. On the positive side, maintainers are responding quickly: **11 issues were closed** and **23 PRs were merged/closed**, including fixes for hangs, parser behavior, MERGE/internal errors, stdin/non-interactive CLI behavior, and shell lifecycle problems. Overall project health remains strong, but today’s signal is clearly that the team is in **post-release hardening mode**.

## 2) Project Progress

### Merged/closed PRs today

The merged/closed work points to a strong focus on **stability, execution correctness, and CLI robustness** rather than big new end-user features.

- **ASOF JOIN hang fix**
  - PR: [#21250](https://github.com/duckdb/duckdb/pull/21250) — *Issue #21244: AsOf Unordered LIMIT*
  - Related issue: [#21244](https://github.com/duckdb/duckdb/issues/21244)
  - Impact: fixes an **indefinite hang** in `ASOF JOIN ... LIMIT` once inputs reached 64+ rows. This is an execution-engine correctness and scheduler/task-unblocking fix.

- **Window parameter validation**
  - PR: [#21323](https://github.com/duckdb/duckdb/pull/21323) — *Issue #20481: Prepare Window Parameters*
  - Likely related issue closed today: [#21330](https://github.com/duckdb/duckdb/issues/21330)
  - Impact: improves **window function argument validation**, part of SQL semantic correctness and defensive execution behavior.

- **CLI shell cleanup/lifecycle fix**
  - PR: [#21315](https://github.com/duckdb/duckdb/pull/21315) — *CLI: Explicitly clean up shell state...*
  - Impact: reduces exit-time destruction problems in the shell, especially relevant when extensions are loaded. This is important for **CLI reliability and embedding hygiene**.

- **MERGE internal error fix**
  - Issue closed: [#20991](https://github.com/duckdb/duckdb/issues/20991) — *Internal ERROR with a MERGE query*
  - Impact: another sign of work on **binder/planner correctness** for complex SQL statements.

- **Parser robustness**
  - Issue closed: [#21072](https://github.com/duckdb/duckdb/issues/21072) — *`Parser::ParseExpressionList()` silently drops invalid parts of query*
  - Impact: important for SQL correctness, since silent acceptance of malformed syntax is worse than explicit failure in analytical workflows.

- **CSV ingestion crash fix**
  - Issue closed: [#21248](https://github.com/duckdb/duckdb/issues/21248) — *Weird CSV with footer/header triggers internal error*
  - Impact: improves resilience of the file readers, especially for messy real-world ingestion pipelines.

- **CLI input mode regressions addressed**
  - Issue closed: [#21243](https://github.com/duckdb/duckdb/issues/21243) — *[1.5] Non-interactive usage of CLI does not work anymore*
  - Issue closed: [#21278](https://github.com/duckdb/duckdb/issues/21278) — *Reading stdin fails on macOS*
  - Impact: restores **scriptability and shell piping**, critical for automation and Unix-style data workflows.

- **Windows CLI `.utf8` / rendering issue addressed**
  - Issue closed: [#21295](https://github.com/duckdb/duckdb/issues/21295)
  - Follow-up PR open: [#21343](https://github.com/duckdb/duckdb/pull/21343) — *Windows shell: remove .utf8 dot command*
  - Impact: maintainers appear to be simplifying/removing obsolete shell behavior rather than patching around it.

### CI and developer workflow progress

Several PRs also show effort to keep the project scalable internally:

- [#21307](https://github.com/duckdb/duckdb/pull/21307) — *Reduce number of linux builds*  
- [#21341](https://github.com/duckdb/duckdb/pull/21341) — *Split regression tests into 4 roughly even jobs*  
- [#21346](https://github.com/duckdb/duckdb/pull/21346) — *Analyse ccache hit rate in build CI jobs*  

These are not user-visible features, but they matter: they suggest DuckDB is optimizing for **faster CI turnaround**, which usually improves regression response time.

## 3) Community Hot Topics

### 1. Database copy/compaction reliability
- Issue: [#16785](https://github.com/duckdb/duckdb/issues/16785) — ``COPY FROM DATABASE x TO y` fails with `key ... does not exist in the referenced table``  
- Status: Open, reproduced  
- Comments: 11, 👍 4

This issue remains one of the most discussed operational topics. It matters because it hits a documented space-reclamation/compaction workflow. The underlying need is **safe physical maintenance of DuckDB files**, particularly for users treating DuckDB as a persistent embedded analytical store rather than a temporary compute cache.

### 2. Windows CLI UX and encoding quality
- Issue: [#10302](https://github.com/duckdb/duckdb/issues/10302) — *DuckDB CLI: highlight/autocomplete not working on Windows*  
- Status: Closed  
- Comments: 12, 👍 5

- Issue: [#21295](https://github.com/duckdb/duckdb/issues/21295) — *[1.5] .utf8 mode breaks the duckbox output in the CLI*  
- PR: [#21343](https://github.com/duckdb/duckdb/pull/21343) — *Windows shell: remove .utf8 dot command*

Together these show a persistent theme: users want DuckDB’s CLI to behave like a polished cross-platform SQL shell, especially on Windows. The technical need is not just SQL correctness but **terminal abstraction, Unicode rendering, line editing, and consistent console behavior**.

### 3. Infinity handling in analytical summary functions
- Issue: [#14373](https://github.com/duckdb/duckdb/issues/14373) — *Summarize gives Out of Range Error due to inf/-inf*  
- Status: Open, reproduced  
- Comments: 6, 👍 5

This issue has relatively high reaction count because it affects exploratory analytics. Users expect `SUMMARIZE` and stats functions to degrade gracefully with `inf/-inf`, returning `NULL` or sentinel values rather than throwing. The deeper technical need is **robust statistical semantics for messy numeric data**.

### 4. Remote Parquet/S3 planning regression in v1.5.0
- Issue: [#21348](https://github.com/duckdb/duckdb/issues/21348) — *`QUALIFY ROW_NUMBER() OVER (...) = 1` causes ~50x more S3 requests in 1.5.0*
- Issue: [#21347](https://github.com/duckdb/duckdb/issues/21347) — *Hive partition filters discover all files before pruning in 1.5.0*
- Issue: [#21312](https://github.com/duckdb/duckdb/issues/21312) — *Filter Pushdown with scalar macro not working*
- Older related issue closed: [#17352](https://github.com/duckdb/duckdb/issues/17352)

This is probably the most important workload-level theme today. Users are seeing regressions in **partition pruning, filter pushdown, and remote object-store efficiency**, especially with hive-partitioned Parquet on S3. That matters directly to cloud analytics economics and latency.

### 5. Parsing and binder correctness in edge SQL
- Issue: [#21340](https://github.com/duckdb/duckdb/issues/21340) — *INTERNAL Error: Failed to bind column reference (inequal types)*
- Issue: [#21322](https://github.com/duckdb/duckdb/issues/21322) — *Regression in unnest with joins*
- Issue closed: [#20991](https://github.com/duckdb/duckdb/issues/20991) — *Internal ERROR with a MERGE query*
- Issue closed: [#21072](https://github.com/duckdb/duckdb/issues/21072) — *Parser silently drops invalid parts of query*

The demand here is clear: advanced SQL users are pushing DuckDB into increasingly complex planner territory, and they need **no internal assertions, deterministic binding, and predictable semantics**.

## 4) Bugs & Stability

Ranked roughly by severity and user impact.

### Critical

1. **Potential memory corruption on CTAS**
   - Issue: [#21246](https://github.com/duckdb/duckdb/issues/21246) — *Crash on CREATE TABLE AS SELECT*
   - Status: Closed
   - Severity: Critical
   - Why it matters: `free(): corrupted unsorted chunks` suggests low-level memory safety issues during a common operation.
   - Fix status: issue is closed, implying a fix or confirmed resolution landed quickly.

2. **Execution hang in ASOF JOIN + LIMIT**
   - Issue: [#21244](https://github.com/duckdb/duckdb/issues/21244)
   - Fix PR: [#21250](https://github.com/duckdb/duckdb/pull/21250)
   - Severity: Critical
   - Why it matters: non-terminating queries are severe in production pipelines and notebooks.

3. **MERGE internal binder error**
   - Issue: [#20991](https://github.com/duckdb/duckdb/issues/20991)
   - Status: Closed
   - Severity: High/Critical
   - Why it matters: MERGE is core for incremental data maintenance and lakehouse-style workflows.

### High

4. **Remote Parquet/S3 request explosion regression**
   - Issue: [#21348](https://github.com/duckdb/duckdb/issues/21348)
   - Severity: High
   - Why it matters: not a crash, but a major **cost and latency regression** for cloud workloads.
   - Fix PR: none listed yet.

5. **Hive partition pruning regression**
   - Issue: [#21347](https://github.com/duckdb/duckdb/issues/21347)
   - Severity: High
   - Why it matters: indicates possible planning regression in file discovery/filter ordering.
   - Fix PR: none listed yet.

6. **`enable_external_access=false` blocks WAL checkpoint**
   - Issue: [#21335](https://github.com/duckdb/duckdb/issues/21335)
   - Severity: High
   - Why it matters: this affects a security-conscious configuration on persistent DBs and can interfere with durability/maintenance.

7. **`COPY FROM DATABASE ... TO ...` operational failure**
   - Issue: [#16785](https://github.com/duckdb/duckdb/issues/16785)
   - Severity: High
   - Why it matters: impacts official compaction/reclaim-space guidance.

### Medium

8. **`JSON -> VARIANT` unsigned integer behavior breaks Parquet export**
   - Issue: [#21311](https://github.com/duckdb/duckdb/issues/21311)
   - Severity: Medium/High
   - Why it matters: this is a type-system interoperability bug affecting new `VARIANT` workflows.

9. **Regression in `unnest` with joins**
   - Issue: [#21322](https://github.com/duckdb/duckdb/issues/21322)
   - Severity: Medium/High
   - Why it matters: likely planner/binder regression, especially painful for nested/semi-structured analytics.

10. **Geoparquet null CRS not accepted**
    - Issue: [#21332](https://github.com/duckdb/duckdb/issues/21332)
    - Severity: Medium
    - Why it matters: standards compliance issue for geospatial users.

11. **RTREE index not used with extra columns**
    - Issue: [#21320](https://github.com/duckdb/duckdb/issues/21320)
    - Severity: Medium
    - Why it matters: likely optimizer/index-selection issue in spatial extension workloads.

12. **Appender memory growth in C#**
    - Issue: [#21142](https://github.com/duckdb/duckdb/issues/21142)
    - Severity: Medium/High
    - Why it matters: ingestion-heavy embedded scenarios can hit OOM quickly.

### Lower-severity but notable usability regressions

- [#21243](https://github.com/duckdb/duckdb/issues/21243) — non-interactive CLI broken in 1.5.0, closed
- [#21278](https://github.com/duckdb/duckdb/issues/21278) — stdin broken on macOS, closed
- [#21308](https://github.com/duckdb/duckdb/issues/21308) — `.multiline` command errors
- [#10302](https://github.com/duckdb/duckdb/issues/10302) — Windows highlight/autocomplete
- [#21295](https://github.com/duckdb/duckdb/issues/21295) — Windows `.utf8` output corruption, closed

## 5) Feature Requests & Roadmap Signals

There were few classic “please add new feature X” requests today; the roadmap signals are more visible through PRs and bug reports.

### Likely near-term additions or improvements

- **More flexible filter pushdown**
  - PR: [#21350](https://github.com/duckdb/duckdb/pull/21350) — *introducing TryPushdownRelaxedFilter*
  - Signal: users want pushdown even when expressions involve type casts or “non-invertible” wrappers like timezone conversions.
  - Prediction: some form of **more permissive predicate pushdown** may land soon, especially for time-based filtering on large ordered tables.

- **Parquet timestamp metadata configurability**
  - PR: [#20976](https://github.com/duckdb/duckdb/pull/20976) — *make isAdjustedToUTC configurable for timestamps without timezone*
  - Signal: users are integrating DuckDB into stricter schema-governed data pipelines.
  - Prediction: likely candidate for the next release because it is concrete, self-contained, and marked **Ready To Merge**.

- **Shell/frontend modularization**
  - PR: [#21337](https://github.com/duckdb/duckdb/pull/21337) — *Introducing BoxRendererContext*
  - Signal: maintainers are trying to make shell rendering reusable, potentially for **Wasm or other frontends**.
  - Prediction: medium-term infrastructure work rather than immediate user-facing feature.

- **Better in-memory DB compression configurability**
  - Issue: [#21342](https://github.com/duckdb/duckdb/issues/21342)
  - Signal: users want parity between SQL-level `ATTACH ... (COMPRESS)` and API-level `connect()` configuration.
  - Prediction: decent chance of quick adoption because the ask is small and practical.

### Standards/interoperability signals

- **VARIANT maturity**
  - Issues: [#21311](https://github.com/duckdb/duckdb/issues/21311), [#21321](https://github.com/duckdb/duckdb/issues/21321)
  - Signal: the new `VARIANT` ecosystem is still settling, especially around storage compatibility and Parquet export/import.

- **Geospatial standards**
  - Issue: [#21332](https://github.com/duckdb/duckdb/issues/21332)
  - Signal: geospatial users want tighter **GeoParquet spec compliance**.

## 6) User Feedback Summary

Today’s user feedback clusters into a few practical themes:

- **“1.5.0 introduced regressions in automation and CLI workflows.”**
  - Evidence: [#21243](https://github.com/duckdb/duckdb/issues/21243), [#21278](https://github.com/duckdb/duckdb/issues/21278), [#21295](https://github.com/duckdb/duckdb/issues/21295), [#21308](https://github.com/duckdb/duckdb/issues/21308)
  - Users rely heavily on DuckDB as a scripting tool, not just an embedded library.

- **“Cloud/object-store efficiency matters as much as raw query speed.”**
  - Evidence: [#21348](https://github.com/duckdb/duckdb/issues/21348), [#21347](https://github.com/duckdb/duckdb/issues/21347), [#21312](https://github.com/duckdb/duckdb/issues/21312)
  - The community is increasingly using DuckDB against **S3-resident hive-partitioned Parquet**, where request counts and pruning behavior are first-order concerns.

- **“Advanced SQL correctness is under close scrutiny.”**
  - Evidence: [#21340](https://github.com/duckdb/duckdb/issues/21340), [#21322](https://github.com/duckdb/duckdb/issues/21322), [#20991](https://github.com/duckdb/duckdb/issues/20991)
  - Users are not just doing simple scans/aggregations; they are stressing binders, window functions, MERGE, nested data, and joins.

- **“Interoperability with modern data types/formats is valuable, but rough edges remain.”**
  - Evidence: [#21311](https://github.com/duckdb/duckdb/issues/21311), [#21321](https://github.com/duckdb/duckdb/issues/21321), [#21332](https://github.com/duckdb/duckdb/issues/21332)
  - `VARIANT`, GeoParquet, and Parquet metadata details are active areas.

- **“Embedded ingestion workloads still need memory discipline.”**
  - Evidence: [#21142](https://github.com/duckdb/duckdb/issues/21142), [#20715](https://github.com/duckdb/duckdb/issues/20715)
  - C#, Python/Arrow generator workflows show that API consumers care deeply about lifecycle management, memory retention, and runtime integration.

## 7) Backlog Watch

These older or strategically important open items look like they merit continued maintainer attention:

- **[#16785](https://github.com/duckdb/duckdb/issues/16785)** — `COPY FROM DATABASE x TO y` fails  
  Why watch: impacts documented operational maintenance; open since 2025-03-22 and still reproduced.

- **[#14373](https://github.com/duckdb/duckdb/issues/14373)** — `SUMMARIZE` fails on `inf/-inf`  
  Why watch: open since 2024-10-15, reproducible, and has notable user interest. Affects trust in exploratory stats.

- **[#18304](https://github.com/duckdb/duckdb/issues/18304)** — `[Julia][Parquet] DuckDB blocks parquet file after reading`  
  Why watch: open since 2025-07-18; file handle lifecycle bugs are painful in embedded and cross-language environments.

- **[#21142](https://github.com/duckdb/duckdb/issues/21142)** — Excessive memory consumption when using Appender API in C#  
  Why watch: high-ingest embedded use cases are commercially relevant and can be a blocker for app adoption.

- **[#20715](https://github.com/duckdb/duckdb/issues/20715)** — `PyGILState_Release` error after query from Arrow RecordBatchReader from generator  
  Why watch: Python/Arrow integration is strategically important; shutdown/runtime issues erode confidence.

- **[#21348](https://github.com/duckdb/duckdb/issues/21348)** and **[#21347](https://github.com/duckdb/duckdb/issues/21347)**  
  Why watch: newly opened, but likely urgent due to potential **v1.5.0 performance/cost regressions** for S3 analytics.

## Overall Assessment

DuckDB is clearly in an **active stabilization phase** after v1.5.0. The maintainer response rate looks healthy, with multiple regressions already closed within days, but the issue stream shows real pressure in three areas: **CLI/platform reliability**, **planner/binder correctness**, and **remote Parquet/S3 optimization regressions**. If the current pace continues, the next patch release will likely focus more on **regression fixes and interoperability polish** than on major new user-facing features.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-13

## 1) Today’s Overview

StarRocks remained highly active over the last 24 hours, with **120 pull requests updated** and **16 issues updated**, indicating strong engineering throughput and ongoing branch/backport maintenance. Activity was concentrated in three areas: **external table ecosystem compatibility** (especially **Paimon**, **Iceberg**, and **Parquet**), **shared-data/lake replication performance**, and **optimizer correctness/statistics quality**. No new release was published today, but the PR stream suggests active stabilization across **3.4/3.5/4.0/4.1** branches. Overall project health looks good from a velocity standpoint, though several newly reported bugs point to continued pressure around **query correctness** and **external catalog interoperability**.

---

## 2) Project Progress

### Merged / closed PRs today: what advanced

#### Query execution and runtime stability
- **Fix use-after-free of ExprContext when node init failed** — closed/merged, with backport attempts also processed.  
  PR: [#70164](https://github.com/StarRocks/starrocks/pull/70164)  
  Backports: [#70212](https://github.com/StarRocks/starrocks/pull/70212), [#70214](https://github.com/StarRocks/starrocks/pull/70214)  
  This is an important runtime safety fix in the execution engine. It addresses a failure path during plan node initialization that could lead to memory lifetime issues. Even though this is not user-visible as a feature, it improves crash resistance and robustness under exceptional execution conditions.

- **Fix AuditEventProcessor thread exit caused by OutOfMemoryException** — open but updated today and notable for operational stability.  
  PR: [#70206](https://github.com/StarRocks/starrocks/pull/70206)  
  The fix targets a thread unexpectedly dying under OOM-related pressure, which matters for observability and auditing continuity in production clusters.

#### SQL compatibility and function surface
- **Regexp_Position functionality landed via linked feature request closure**  
  Issue: [#67246](https://github.com/StarRocks/starrocks/issues/67246)  
  This indicates incremental SQL function compatibility progress, useful for migration from engines with broader regexp function support.

#### Storage / shared-data optimization
- **Reduce lake PK tablet stat collection overhead in shared-data mode cluster** — backport closed.  
  PR: [#70115](https://github.com/StarRocks/starrocks/pull/70115)  
  This improves metadata/statistics overhead in shared-data deployments, reinforcing StarRocks’s investment in lake/shared-data operational efficiency.

- Tooling and CI/build maintenance also progressed:
  - **Exclude Darwin from CI pipeline** — [#70227](https://github.com/StarRocks/starrocks/pull/70227)
  - **Support build thirdparty on MacOS** — [#70195](https://github.com/StarRocks/starrocks/pull/70195)
  - **Refactor generated cpp optimization path** — [#70218](https://github.com/StarRocks/starrocks/pull/70218)
  - **Refactor complex_column_reader on variant type** — [#70106](https://github.com/StarRocks/starrocks/pull/70106)

#### Iceberg catalog behavior
- **Bypass caching in CachingIcebergCatalog when vended credentials are enabled** — closed/merged.  
  PR: [#69434](https://github.com/StarRocks/starrocks/pull/69434)  
  This is a meaningful interoperability fix for Iceberg REST catalog setups using temporary/vended credentials. It suggests StarRocks is adapting for more cloud-native security patterns.

### What this means
The closed work today does not represent a single headline feature, but rather a broad stabilization wave:
- more reliable runtime error handling,
- better behavior in shared-data deployments,
- improved external catalog support,
- continued SQL compatibility expansion.

---

## 3) Community Hot Topics

Below are the most notable issues/PRs by practical importance and visible community signal.

### 1. Wrong query results / missing rows
- Issue: **Simple query result Wrong Missing rows** [#70145](https://github.com/StarRocks/starrocks/issues/70145)  
  This is one of the most critical classes of issue for any OLAP engine: correctness failures in basic query execution. Even though it is already closed, the report underscores that correctness remains the top priority for production trust.

### 2. Invalid or non-executable plans from optimizer behavior
- Issue: **"Invalid plan" error on AGGREGATE KEY table with ORDER BY + LIMIT** [#69364](https://github.com/StarRocks/starrocks/issues/69364)
- Issue: **query fails with "no executable plan for this sql" when Optimizer Rule duplicates CTE Consumer** [#69964](https://github.com/StarRocks/starrocks/issues/69964)  
  These indicate continued complexity in optimizer rule interactions, especially around **CTEs**, **AGGREGATE KEY tables**, and plan generation edge cases. This aligns with the project’s active work on statistics and optimizer modeling.

### 3. Paimon integration problems forming a cluster of demand
- Issue: **Paimon catalog refresh crashes with ClassCastException on ObjectTable** [#70223](https://github.com/StarRocks/starrocks/issues/70223)  
  Fix PR: [#70224](https://github.com/StarRocks/starrocks/pull/70224)
- Issue: **unknown database error when querying paimon view** [#70216](https://github.com/StarRocks/starrocks/issues/70216)  
  Fix PR: [#70217](https://github.com/StarRocks/starrocks/pull/70217)
- Issue: **DESCRIBE / SHOW CREATE TABLE fails to identify Primary Key for Paimon Primary Key tables** [#70185](https://github.com/StarRocks/starrocks/issues/70185)  
  This is today’s clearest theme from user reports: users increasingly treat StarRocks as a **federated query/analytics layer** over external lakehouse metadata systems, and they expect robust support for Paimon views, object tables, and PK metadata fidelity.

### 4. Shared-data cross-cluster replication and file copy performance
- Issue: **tablet file parallel copy optimization for shared-data replication** [#70219](https://github.com/StarRocks/starrocks/issues/70219)
- PR: **Parallelize tablet file copy in shared-data cluster-replication** [#70220](https://github.com/StarRocks/starrocks/pull/70220)
- PR: **Add fast cancel and parallel copy for lake replication file copy** [#70222](https://github.com/StarRocks/starrocks/pull/70222)
- PR: **Add file integrity verification for shared-data cross-cluster replication** [#70093](https://github.com/StarRocks/starrocks/pull/70093)  
  This shows an active push to make StarRocks replication more practical for very large tablets and migration scenarios. The underlying need is operational: reduce replication wall-clock time, avoid wasted copy work on canceled jobs, and improve file integrity guarantees.

### 5. Optimizer statistics quality
- PR: **Preserve null fractions for outer join columns** [#70144](https://github.com/StarRocks/starrocks/pull/70144)
- PR: **Calculate null fractions for CASE WHEN expressions** [#70221](https://github.com/StarRocks/starrocks/pull/70221)
- PR: **Introduce virtual statistics and implement `unnest` stats** [#69272](https://github.com/StarRocks/starrocks/pull/69272)  
  These changes point to a sustained effort to improve cost-based optimization quality in nontrivial SQL patterns, especially joins, nullable expressions, and semi-structured/array workloads.

---

## 4) Bugs & Stability

Ranked by likely severity and user impact.

### Critical / High severity

#### 1. Wrong results on external Parquet reads
- Issue: **`parquet_cache_aware_dict_decoder_enable` causes non-deterministic query results on Parquet files with PLAIN_DICTIONARY -> PLAIN fallback encoding** [#70215](https://github.com/StarRocks/starrocks/issues/70215)  
**Severity:** Critical  
**Why it matters:** non-deterministic results are among the most serious possible failures in analytics systems. The issue appears tied to a specific decoding optimization and Parquet encoding fallback behavior, likely affecting correctness on some Iceberg/lakehouse datasets.  
**Fix PR:** none listed yet.

#### 2. Wrong GROUP BY results on Iceberg with bucket-aware execution
- Issue: **Bucket-aware execution produces wrong GROUP BY results on composite-partitioned Iceberg tables** [#69598](https://github.com/StarRocks/starrocks/issues/69598)  
**Severity:** Critical  
**Why it matters:** this directly affects correctness for external Iceberg analytics and may indicate planner/execution assumptions breaking on partition+bucketing combinations.  
**Fix PR:** none listed today.

#### 3. Missing rows in simple query result
- Issue: **Simple query result Wrong Missing rows** [#70145](https://github.com/StarRocks/starrocks/issues/70145)  
**Severity:** Critical  
**Status:** closed  
Even closed, it remains important as a signal that correctness regressions continue to surface in real workloads.

### Medium / High severity

#### 4. Paimon catalog refresh daemon crash
- Issue: [#70223](https://github.com/StarRocks/starrocks/issues/70223)  
- Fix PR: [#70224](https://github.com/StarRocks/starrocks/pull/70224)  
**Severity:** High  
A metadata refresh daemon crash can effectively degrade or stall an entire external catalog’s usability.

#### 5. Paimon view resolution uses wrong catalog
- Issue: [#70216](https://github.com/StarRocks/starrocks/issues/70216)  
- Fix PR: [#70217](https://github.com/StarRocks/starrocks/pull/70217)  
**Severity:** High  
This blocks queryability of Paimon views and reflects a namespace resolution bug in federated query scenarios.

#### 6. brpc connection retry fails to handle wrapped NoSuchElementException
- Issue: [#70205](https://github.com/StarRocks/starrocks/issues/70205)  
**Severity:** High  
This is an availability/reliability issue: transient network failures should be retried but currently can cause user-visible query failure.

### Medium severity

#### 7. PIPE with `FILES()` fails on header-only CSVs
- Issue: [#70225](https://github.com/StarRocks/starrocks/issues/70225)  
**Severity:** Medium  
This affects ingestion ergonomics and robustness. Expected behavior should be zero rows rather than an analyzer failure.

#### 8. Paimon PK metadata not surfaced in DESCRIBE / SHOW CREATE TABLE
- Issue: [#70185](https://github.com/StarRocks/starrocks/issues/70185)  
**Severity:** Medium  
Primarily metadata correctness/usability, but important for schema introspection and tooling.

#### 9. Arrow Flight SQL JDBC driver test errors
- Issue: [#70176](https://github.com/StarRocks/starrocks/issues/70176)  
**Severity:** Medium  
This may affect client connectivity adoption, especially for newer interoperability paths.

### Recently closed correctness/stability items
- **Invalid plan on AGGREGATE KEY + ORDER BY + LIMIT** [#69364](https://github.com/StarRocks/starrocks/issues/69364)
- **No executable plan when optimizer duplicates CTE consumer** [#69964](https://github.com/StarRocks/starrocks/issues/69964)
- **Struct field names inside casts are not escaped** [#68965](https://github.com/StarRocks/starrocks/issues/68965)

These closures suggest maintainers are actively addressing planner/parser edge cases.

---

## 5) Feature Requests & Roadmap Signals

### Strong signals for upcoming versions

#### 1. Iceberg v3 default values support
- Issue: **Supports the default values feature in Iceberg v3** [#69709](https://github.com/StarRocks/starrocks/issues/69709)  
  Linked PR mentioned in issue: [#69525](https://github.com/StarRocks/starrocks/pull/69525)  
This is tagged **version:4.2**, making it one of the clearest roadmap indicators. It reflects ongoing work to stay current with Iceberg table spec evolution.

#### 2. Shared-data replication acceleration
- Issue: [#70219](https://github.com/StarRocks/starrocks/issues/70219)
- PRs: [#70220](https://github.com/StarRocks/starrocks/pull/70220), [#70222](https://github.com/StarRocks/starrocks/pull/70222), [#70093](https://github.com/StarRocks/starrocks/pull/70093)  
This cluster strongly suggests that **4.1+** will continue improving large-scale shared-data migration and replication operability.

#### 3. Expanded Parquet/Iceberg type compatibility
- PR: **add support for FIXED_LEN_BYTE_ARRAY types to be read as TYPE_VARBINARY** [#70226](https://github.com/StarRocks/starrocks/pull/70226)  
This is a practical compatibility enhancement, especially for **UUID** columns stored in Parquet and surfaced through Iceberg. It is a good candidate for near-term inclusion because the use case is concrete and common.

#### 4. Optimizer statistics sophistication
- PRs:
  - [#70144](https://github.com/StarRocks/starrocks/pull/70144)
  - [#70221](https://github.com/StarRocks/starrocks/pull/70221)
  - [#69272](https://github.com/StarRocks/starrocks/pull/69272)  
These are roadmap signals for better cost-based planning on complex SQL and semi-structured workloads.

### Already evidenced as delivered
- **Regexp_Position** support request closed: [#67246](https://github.com/StarRocks/starrocks/issues/67246)

### Historical roadmap note
- **Roadmap of subquery** stale enhancement issue closed: [#9922](https://github.com/StarRocks/starrocks/issues/9922)  
This is not a current roadmap item, but it shows long-lived user interest in deeper SQL subquery support/planning.

---

## 6) User Feedback Summary

### Main pain points users are reporting

#### External lakehouse interoperability remains a top real-world need
Many fresh issues are about **Paimon**, **Iceberg**, and **Parquet** rather than native storage alone:
- Paimon view resolution and metadata refresh crashes
- Paimon PK metadata introspection gaps
- Iceberg wrong-result issue under bucket-aware execution
- Parquet decoder correctness with dictionary/plain fallback
- FIXED_LEN_BYTE_ARRAY / UUID support request in Parquet

This suggests StarRocks is being evaluated and used heavily as a **high-performance SQL engine on open table formats**, and users expect production-grade compatibility rather than partial read support.

#### Correctness matters more than raw speed
Several reports are not simple crashes but **wrong rows**, **wrong GROUP BY results**, or **non-deterministic output**. That is especially sensitive for analytics users in billing, migration validation, and federated query contexts.

#### Shared-data deployments are hitting scale-related operational pain
The replication optimization requests indicate users are moving or replicating very large partitions/tablets and are suffering from:
- long copy times,
- poor cancellation responsiveness,
- integrity/retry concerns.

#### Client/protocol ecosystem still needs polish
The Arrow Flight SQL JDBC test issue shows interest in newer connectivity options, but also some rough edges in practical setup or compatibility.

---

## 7) Backlog Watch

These items look important for maintainers to watch, either because they are severe, strategic, or indicate persistent user demand.

### High-priority open issues needing attention

- **Non-deterministic Parquet query results** [#70215](https://github.com/StarRocks/starrocks/issues/70215)  
  No linked fix yet; should likely be treated urgently due to correctness risk.

- **Wrong GROUP BY results on Iceberg bucket-aware execution** [#69598](https://github.com/StarRocks/starrocks/issues/69598)  
  Older than today’s reports and still open; high impact for external table workloads.

- **brpc retry failure under wrapped exception** [#70205](https://github.com/StarRocks/starrocks/issues/70205)  
  Important for cluster resilience and transient failure handling.

- **PIPE on header-only CSV files should return 0 rows, not fail** [#70225](https://github.com/StarRocks/starrocks/issues/70225)  
  Lower severity, but a good candidate for quick quality-of-life fix.

### Important strategic PRs that deserve maintainer bandwidth

- **Virtual statistics and `unnest` stats** [#69272](https://github.com/StarRocks/starrocks/pull/69272)  
  Long-running and strategically significant for optimizer quality on nested data.

- **Preserve null fractions for outer join columns** [#70144](https://github.com/StarRocks/starrocks/pull/70144)
- **Calculate null fractions for CASE WHEN expressions** [#70221](https://github.com/StarRocks/starrocks/pull/70221)  
  Together these can materially improve plan quality and reduce misestimation.

- **Force Drop Sync MV recovery feature added** [#70029](https://github.com/StarRocks/starrocks/pull/70029)  
  Useful operational recovery feature; worth landing if stable.

### Older roadmap-demand signal
- **Roadmap of subquery** [#9922](https://github.com/StarRocks/starrocks/issues/9922)  
  Now closed as stale, but subquery support depth remains a recurring theme in analytical SQL engine maturity.

---

## Overall Assessment

StarRocks shows **strong engineering momentum** and good issue-to-fix responsiveness, especially where fresh bug reports already have corresponding PRs, as seen with **Paimon** integration problems. The clearest strategic direction today is continued investment in:
1. **open table format interoperability**,
2. **shared-data/lake operational performance**,
3. **optimizer statistics and correctness**.

The main risk area is still **query correctness on complex or external-format workloads**. If maintainers continue converting fresh reports into rapid fixes, project health remains strong; however, open wrong-result issues in **Iceberg** and **Parquet** should remain top priority for user confidence.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-13

## 1) Today’s Overview

Apache Iceberg had a very active day: **22 issues** and **50 PRs** saw updates in the last 24 hours, with **9 PRs/issues closed or merged** and **no new releases**. The day’s activity was concentrated around **Spark correctness**, **REST catalog internals**, **Kafka Connect runtime packaging**, and **1.10.x patch backports**, which suggests the project is in a stabilization phase for the current release line while continuing API/spec evolution. A notable theme is **query correctness and operational safety**: several new issues and backport requests point to maintainers prioritizing fixes for data cleanup behavior, equality deletes, delete-vector merge correctness, and SPJ behavior. Overall, project health looks strong from a contributor-activity perspective, but there are clear signals that **1.10.x patch readiness and Spark edge-case correctness** are the most urgent near-term concerns.

---

## 3) Project Progress

### Merged/closed work today: what advanced

Even without a new release, several closed PRs/issues indicate progress on correctness, cleanup, and maintenance:

- **Equality delete correctness backported to 1.10.x**
  - PR: [#15605](https://github.com/apache/iceberg/pull/15605) — *Core, Spark: Fix equality deletes non-deterministic schema ordering (Backport of #15514)*
  - Why it matters: this addresses a **query correctness issue** where equality delete schema field ordering depended on projection shape, potentially causing silent mismatches when cached delete records were reused. This is one of the most important closed items today because it directly affects correctness, not just performance or developer ergonomics.

- **REST table scan correctness fixed**
  - PR: [#15609](https://github.com/apache/iceberg/pull/15609) — *Core: Fix useSnapshotSchema logic and projection in RESTTableScan*
  - Why it matters: this improves **REST catalog scan semantics**, especially around branch/tag/direct snapshot handling and projection logic. It also sets up ongoing refactoring work in the newer follow-up PR [#15595](https://github.com/apache/iceberg/pull/15595).

- **Test infrastructure cleanup in Spark module**
  - PR: [#15557](https://github.com/apache/iceberg/pull/15557) — *Spark: Delegate temp file deletion to JUnit in TestParquetVectorizedReads*
  - Impact: minor, but it improves **test reliability and maintainability** in Spark vectorized read coverage.

- **Older cleanup / deprecation work closed out**
  - PR: [#14998](https://github.com/apache/iceberg/pull/14998) — *Remove deprecated partition stats read functionality*  
  - PR: [#15095](https://github.com/apache/iceberg/pull/15095) — *OpenAPI UUID typing cleanup*  
  - Issue: [#8450](https://github.com/apache/iceberg/issues/8450) — *Partition stats task tracker*  
  - These closures suggest maintainers are pruning older threads and deprecation-era work while moving partition stats efforts toward completion or follow-on implementation.

### What themes advanced today

- **Spark correctness**: equality delete handling and query behavior remain a central focus.
- **REST/catalog API maturation**: table scan APIs and OpenAPI spec details continue to evolve.
- **Patch release preparation**: multiple new backport issues strongly imply active assembly of a **1.10.2** patch train.
- **Connector/runtime packaging**: Kafka Connect dependency completeness got concrete fix attention.

---

## 4) Community Hot Topics

These were the most discussed or most telling active items today.

### 1. Metadata writes stopping after random time in Athena/MSK connector
- Issue: [#13593](https://github.com/apache/iceberg/issues/13593)
- Status: Open
- Comments: 30
- Reactions: 👍 3

**Why it matters:**  
This is the most active user-facing operational issue in the snapshot. The report describes **metadata eventually ceasing to be written** with repeated “commit failed, will try again next cycle” behavior in an AWS MSK Iceberg Connector setup using Athena-related components. That points to a real-world need for more robust **streaming/connector commit reliability**, likely involving commit retries, lock/conflict handling, Glue/schema-registry integration, or packaging/version skew.

**Underlying technical need:**  
Users need stronger guarantees and better observability for **streaming ingestion commits**, especially in cloud-managed connector environments where failures may be intermittent and hard to diagnose.

---

### 2. `add_files` and whether manifest stats are populated
- Issue: [#13218](https://github.com/apache/iceberg/issues/13218)
- Status: Closed
- Comments: 18

**Why it matters:**  
This question reflects a common adoption pattern: onboarding existing Parquet datasets into Iceberg without rewriting files. The user specifically cares about whether `add_files` preserves or creates **lower/upper bound statistics** in manifests.

**Underlying technical need:**  
This highlights demand for **non-rewrite migration paths** that still preserve enough metadata quality for pruning and performance. It also suggests documentation gaps around what metadata is or is not derivable during file registration.

---

### 3. Kafka Connect runtime missing Hadoop dependencies
- Issue: [#13691](https://github.com/apache/iceberg/issues/13691)
- Status: Open
- Comments: 11
- Fix PR: [#15608](https://github.com/apache/iceberg/pull/15608)

**Why it matters:**  
This is a good example of rapid loop closure: a runtime packaging bug in `iceberg-kafka-connect-runtime` triggered `NoClassDefFoundError` with Hadoop catalog usage, and a fix PR already exists.

**Underlying technical need:**  
The community needs **connector distributions that are production-complete**, especially for Hadoop-based deployments. This is less about algorithmics and more about packaging correctness and deployability.

---

### 4. Spark `DROP TABLE ... PURGE` not honoring purge semantics
- Issue: [#14743](https://github.com/apache/iceberg/issues/14743)
- Status: Open
- Comments: 9

**Why it matters:**  
This is a SQL compatibility/behavior consistency issue. If SparkCatalog always issues a plain `dropTable` and does not propagate purge intent, users may incorrectly assume data deletion occurred.

**Underlying technical need:**  
Users want **SQL semantics to match expectation**, especially for destructive DDL. This is important for governance, storage lifecycle, and operational automation.

---

### 5. New Spark SPJ breakages after partition evolution / during merge
- Issue: [#15610](https://github.com/apache/iceberg/issues/15610)
- Status: Open, newly opened today
- Issue: [#15602](https://github.com/apache/iceberg/issues/15602)
- Status: Open

**Why it matters:**  
These fresh reports reinforce that **Storage-Partitioned Join (SPJ)** is an active friction point in Spark, particularly around `MERGE INTO` and partition evolution.

**Underlying technical need:**  
Users want **predictable optimizer/runtime behavior across evolved partition specs**, especially in heavy merge/update pipelines. This is a high-value enterprise use case.

---

## 5) Bugs & Stability

Ranked by likely severity and user impact.

### Critical / High

#### 1. Possible TLS hostname verification regression in HTTPClient
- Issue: [#15598](https://github.com/apache/iceberg/issues/15598)
- Version: reported between 1.10 and upcoming 1.11
- Severity: **High**

This appears to be a security-sensitive regression in `HTTPClient` TLS behavior. If hostname verification is weakened or bypassed unintentionally, that affects **REST catalog security posture**. No fix PR is listed yet in the provided data, so this likely deserves immediate maintainer attention.

---

#### 2. Spark SPJ failures affecting MERGE queries
- Issue: [#15610](https://github.com/apache/iceberg/issues/15610) — SPJ broken after partition evolution  
- Issue: [#15602](https://github.com/apache/iceberg/issues/15602) — Spark query failure while using SPJ  
- Severity: **High**

These are correctness and execution-stability issues in Spark merge workflows. Partition evolution is a core Iceberg capability, so SPJ failing after evolution is particularly concerning. No fix PR is shown yet.

---

#### 3. Backport requests for accidental file cleanup / CREATE transaction safety
- Issue: [#15604](https://github.com/apache/iceberg/issues/15604) — backport to prevent accidental cleanup of files  
- Issue: [#15601](https://github.com/apache/iceberg/issues/15601) — backport to prevent incorrect cleanups during CREATE transactions on REST 5xx  
- Severity: **High**

These issues strongly imply already-known fixes exist upstream but are not yet on the 1.10.x branch. The phrase “prevent accidental cleanup” is a serious operational warning: it suggests potential unintended deletion behavior under failure conditions.

---

#### 4. Delete vector / merge correctness backport request
- Issue: [#15599](https://github.com/apache/iceberg/issues/15599)
- Severity: **High**

This is another sign that **1.10.x has correctness-sensitive gaps** that maintainers are trying to close through backports.

---

### Medium

#### 5. Kafka Connect runtime `NoClassDefFoundError` with Hadoop catalog
- Issue: [#13691](https://github.com/apache/iceberg/issues/13691)
- Fix PR: [#15608](https://github.com/apache/iceberg/pull/15608)
- Severity: **Medium**

This is a deployment blocker for affected users, though not a silent data correctness issue. Good sign: a concrete fix is already in flight.

---

#### 6. SparkCatalog not purging on `DROP TABLE ... PURGE`
- Issue: [#14743](https://github.com/apache/iceberg/issues/14743)
- Severity: **Medium**

Potential mismatch between SQL intent and actual cleanup behavior. Risk depends on user expectations and automation.

---

#### 7. Metadata writes randomly stop in AWS connector workflow
- Issue: [#13593](https://github.com/apache/iceberg/issues/13593)
- Severity: **Medium to High**, depending on root cause

This looks operationally serious for streaming users, though the exact failure domain is still less clearly isolated than the backport/correctness issues above.

---

### Lower-severity but notable

- [#15411](https://github.com/apache/iceberg/issues/15411) — **GCSFileIO TCP connection explosion**, likely a performance/resource management issue.
- [#14874](https://github.com/apache/iceberg/issues/14874) — docs missing V3 types, important for discoverability but not runtime stability.
- [#15191](https://github.com/apache/iceberg/issues/15191) — document nightly snapshots, useful for contributors and early adopters.

---

## 6) Feature Requests & Roadmap Signals

### Strong near-term signals

#### 1. 1.10.2 patch release appears likely
Several fresh backport issues point in the same direction:

- [#15600](https://github.com/apache/iceberg/issues/15600) — backport equality delete schema ordering fix
- [#15606](https://github.com/apache/iceberg/issues/15606) — backport Avro 1.12.1 upgrade
- [#15604](https://github.com/apache/iceberg/issues/15604) — backport accidental cleanup prevention
- [#15601](https://github.com/apache/iceberg/issues/15601) — backport CREATE transaction cleanup prevention
- [#15599](https://github.com/apache/iceberg/issues/15599) — backport DV merge fix

**Prediction:** a **1.10.2** patch release is the strongest roadmap signal in today’s data.

---

#### 2. Kafka Connect capability expansion, especially around Variant
- PR: [#15283](https://github.com/apache/iceberg/pull/15283) — support `VARIANT` in Kafka Connect record conversion
- Signal: Iceberg’s newer type system is expanding into ingestion tooling, not just storage/spec.

**Prediction:** if merged soon, this could show up in the next minor release as part of **V3 type ecosystem support**.

---

#### 3. Better changelog/SCD support in Spark procedures
- Issue: [#15593](https://github.com/apache/iceberg/issues/15593) — add `scd_type2` option to `create_changelog_view`

This is a strong usability request. It does not just ask for raw changelog exposure, but for **higher-level analytical semantics** that users repeatedly implement themselves.

**Prediction:** plausible for a future minor release if maintainers want to strengthen SQL/procedural ergonomics for CDC and warehouse-style modeling.

---

#### 4. REST catalog/OpenAPI continues to broaden
Relevant PRs:
- [#15280](https://github.com/apache/iceberg/pull/15280) — staged table credential refresh support
- [#15180](https://github.com/apache/iceberg/pull/15180) — function endpoints in REST spec
- [#14965](https://github.com/apache/iceberg/pull/14965) — 404 handling for `/v1/config`
- [#14856](https://github.com/apache/iceberg/pull/14856) — spatial expressions in OpenAPI
- [#13979](https://github.com/apache/iceberg/pull/13979) — `referenced-by` support to endpoints

**Prediction:** REST catalog interoperability remains a major roadmap pillar, with ongoing work to close gaps between Java APIs, Spark usage, and spec-level capabilities.

---

#### 5. Large-commit scalability improvements
- PR: [#15590](https://github.com/apache/iceberg/pull/15590) — auto-flush accumulated data files to manifests

This is a notable storage-engine optimization proposal for large append workloads.

**Prediction:** if merged, it could materially improve **memory/latency behavior for bulk ingest and commit-heavy workloads** in an upcoming release.

---

## 7) User Feedback Summary

### Main pain points observed

- **Spark merge/SPJ reliability is a top pain point**
  - [#15610](https://github.com/apache/iceberg/issues/15610)
  - [#15602](https://github.com/apache/iceberg/issues/15602)
  - Users are pushing Iceberg through complex `MERGE INTO` and partition-evolved workloads, and want optimizer-level features like SPJ to remain stable under schema/partition evolution.

- **Operational safety during failure handling matters a lot**
  - [#15604](https://github.com/apache/iceberg/issues/15604)
  - [#15601](https://github.com/apache/iceberg/issues/15601)
  - Users are sensitive to any behavior that could lead to **incorrect cleanup or file deletion** during retries, REST errors, or CREATE failures.

- **Connector packaging and cloud integration remain real-world friction points**
  - [#13691](https://github.com/apache/iceberg/issues/13691)
  - [#13593](https://github.com/apache/iceberg/issues/13593)
  - This suggests that production deployments still hit issues not visible in core unit tests: dependency exclusions, service integration, retries, and commit flows.

- **Documentation gaps still affect adoption of newer features**
  - [#14874](https://github.com/apache/iceberg/issues/14874) — missing V3 types in schema docs
  - [#15191](https://github.com/apache/iceberg/issues/15191) — nightly snapshot documentation
  - [#13514](https://github.com/apache/iceberg/issues/13514) — external-link navigation clarity

- **Performance/resource behavior on object stores needs attention**
  - [#15411](https://github.com/apache/iceberg/issues/15411) — GCSFileIO connection pooling concerns
  - Users care not just about correctness but about **network/socket footprint** during routine merge operations.

### Satisfaction signals

There are fewer explicit positive signals in today’s dataset, but some issue/PR patterns imply confidence in Iceberg’s core value:
- Users are adopting advanced features like **REST catalog**, **SPJ**, **equality deletes**, **Variant types**, and **changelog views**, which indicates strong platform relevance.
- The quick linkage from issue to fix in Kafka Connect packaging is a good sign of **responsive maintenance**.

---

## 8) Backlog Watch

These look important and would benefit from maintainer attention due to age, impact, or strategic value.

### A. Long-running operational issue in managed/cloud connector workflows
- [#13593](https://github.com/apache/iceberg/issues/13593) — metadata stops being written after random period
- Why watch: high comment count, real production implications, still open since July 2025.

### B. `DROP TABLE ... PURGE` semantics in Spark
- [#14743](https://github.com/apache/iceberg/issues/14743)
- Why watch: SQL behavior mismatch with destructive semantics can create governance confusion and operational surprises.

### C. GCSFileIO connection pooling / TCP explosion
- [#15411](https://github.com/apache/iceberg/issues/15411)
- Why watch: cloud object-store efficiency is increasingly important for production cost and stability.

### D. Rewrite path action failure due to location already exists
- PR: [#14859](https://github.com/apache/iceberg/pull/14859)
- Why watch: open since Dec 2025, relevant to Spark path-rewrite workflows and migration tooling.

### E. ExpireSnapshots optimization in Spark 4.1
- PR: [#15154](https://github.com/apache/iceberg/pull/15154)
- Why watch: strong practical value for maintenance jobs; currently stale but meaningful for large-table operations.

### F. REST/OpenAPI spec gaps with ecosystem impact
- [#15280](https://github.com/apache/iceberg/pull/15280)
- [#15180](https://github.com/apache/iceberg/pull/15180)
- [#14965](https://github.com/apache/iceberg/pull/14965)
- [#14856](https://github.com/apache/iceberg/pull/14856)
- Why watch: these may not be urgent bugs, but they shape interoperability and long-term catalog ecosystem consistency.

---

## Bottom Line

Today’s Iceberg activity shows a project with **healthy contributor momentum** and a strong bias toward **stabilizing 1.10.x**. The most important signals are: **likely preparation for a 1.10.2 patch release**, active work on **Spark correctness**, and ongoing maturation of the **REST catalog and connector ecosystem**. The biggest risks to watch are **SPJ/merge correctness**, **cleanup safety under failure**, and a potential **HTTPClient TLS regression**. If maintainers can close those quickly, the short-term health outlook remains good.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-13

## 1) Today’s Overview

Delta Lake showed **high pull request velocity** over the last 24 hours, with **49 PRs updated** versus only **4 issues updated**, which suggests the project is currently in a strong implementation/integration phase rather than a broad issue-triage phase. The activity is concentrated around **Spark DSv2**, **kernel-spark parity**, **streaming CDC**, **Unity Catalog CI**, and **UniForm/Iceberg interoperability**. There were **no new releases**, but multiple version-bump PRs indicate the codebase is likely transitioning toward the **4.2.0 development cycle**. Overall, project health looks good: maintainers are closing targeted bugs quickly while advancing several medium-to-large feature stacks in parallel.

## 3) Project Progress

### Merged/closed work today

#### 1. Kernel transaction-path correctness fix
- **PR #6271 — Fix missing return in TransactionBuilderImpl early-exit path**  
  Link: https://github.com/delta-io/delta/pull/6271  
- Related issue: **#4713**  
  Link: https://github.com/delta-io/delta/issues/4713  

This is the clearest correctness/stability improvement closed today. The bug was in Kernel transaction construction: when only data updates were present and no metadata/protocol update was needed, the implementation constructed an optimized transaction object but failed to return it, falling through into the full metadata/protocol path. The fix removes unnecessary work and avoids building a second transaction object. This improves **Kernel write-path efficiency** and likely reduces risk of subtle behavior divergence in “data-only” commits.

#### 2. Kernel Iceberg compatibility validation tightened
- **PR #6278 — Add previous-protocol DV check in Kernel IcebergCompat validation**  
  Link: https://github.com/delta-io/delta/pull/6278  

This closed PR strengthens the safety checks around **Deletion Vectors (DVs)** for Kernel Iceberg compatibility. The change aligns Kernel behavior more closely with Spark by validating not just the newest protocol state but also the previous snapshot/protocol state to guard against races where concurrent writers enable DVs. This is a meaningful **storage interoperability and correctness hardening** change, especially for mixed-engine or concurrent-write scenarios.

#### 3. DSv2 read-option support progressed, with part of the stack already closed
- **PR #6245 — [kernel-spark] Support read option ignoreDeletes in dsv2**  
  Link: https://github.com/delta-io/delta/pull/6245  
- **PR #6246 — [kernel-spark] Support skipChangeCommits and ignoreDeletes read option in dsv2**  
  Link: https://github.com/delta-io/delta/pull/6246  

These PRs were closed today and appear to be part of an evolving stacked effort rather than abandoned themes. Together with still-open follow-ons, they indicate steady progress toward **better DSv2 semantic compatibility for streaming/incremental reads**, particularly around how change commits and deletes are surfaced or skipped. This is strategically important for users moving to DSv2-based reads who need parity with existing Delta read semantics.

#### 4. Catalog-based stats request closed, implying some form of advancement/decision
- **Issue #5952 — [enhancement, kernel-spark] Leverage column stats from catalog in kernel connector**  
  Link: https://github.com/delta-io/delta/issues/5952  

The closure of this enhancement request suggests maintainers have either implemented, superseded, or decided the direction for **using catalog column statistics in the kernel connector**. This aligns with active work like:
- **PR #6101 — Report numRows in estimateStatistics() using per-file stats**  
  Link: https://github.com/delta-io/delta/pull/6101  

The broader signal is that Delta Lake continues improving **query planning statistics**, a prerequisite for cost-based optimization and better Spark planning outcomes.

## 4) Community Hot Topics

> Note: comment counts on the PR list are unavailable (`undefined`), so “hot topics” are inferred from recency, breadth, stack depth, and architectural importance.

### A. Spark DSv2 and kernel-spark parity
Relevant PRs:
- **#6224 — Implement SupportsReportPartitioning in DSv2 SparkScan**  
  https://github.com/delta-io/delta/pull/6224
- **#6276 — Override columnarSupportMode in DSv2 SparkScan**  
  https://github.com/delta-io/delta/pull/6276
- **#6230 — Add executor writer: DataWriter, DeltaWriterCommitMessage**  
  https://github.com/delta-io/delta/pull/6230
- **#6231 — Add factory + transport: DataWriterFactory, BatchWrite**  
  https://github.com/delta-io/delta/pull/6231
- **#6249 — Support ignoreChanges read option in dsv2**  
  https://github.com/delta-io/delta/pull/6249
- **#6250 — Support ignoreFileDeletion read option in dsv2**  
  https://github.com/delta-io/delta/pull/6250

**Technical need behind the activity:** users want Delta’s DSv2 implementation to behave like a first-class Spark source with better partition reporting, vectorization decisions, write-path support, and semantic parity for historical Delta read options. This is foundational work for both **performance** and **connector modernization**.

### B. Streaming CDC support in kernel-spark
Relevant PRs:
- **#6075 — Add initial snapshot CDC support to SparkMicroBatchStream**  
  https://github.com/delta-io/delta/pull/6075
- **#6076 — Add incremental CDC support to SparkMicroBatchStream**  
  https://github.com/delta-io/delta/pull/6076
- **#6279 — Add streaming tests for startingTimestamp, skipChangeCommits**  
  https://github.com/delta-io/delta/pull/6279

**Technical need:** stronger **change data feed + structured streaming integration**. The open stacked PRs suggest Delta maintainers are trying to make CDC practical not just for batch replay but for robust micro-batch consumption, including initial snapshot handling and incremental progression semantics.

### C. UniForm / Iceberg interoperability at large scale
Relevant PR:
- **#6272 — [UniForm] Streaming and distributed Iceberg manifest generation for large tables**  
  https://github.com/delta-io/delta/pull/6272

**Technical need:** large-table users need **memory-bounded manifest generation** and likely distributed conversion paths instead of driver-heavy workflows. This is one of the strongest roadmap signals for enterprise-scale Delta/Iceberg interoperability.

### D. Unity Catalog integration and CI hardening
Relevant PR:
- **#6263 — [CI Improvements] Add non-blocking CI job to test against UC main**  
  https://github.com/delta-io/delta/pull/6263

**Technical need:** prevent integration drift with **Unity Catalog mainline**. A non-blocking CI lane implies maintainers want early compatibility signals without making the main pipeline brittle.

### E. Protocol clarification request
Issue:
- **#6094 — Clarify valid range for add.modificationTime (can it be 0 or negative?)**  
  https://github.com/delta-io/delta/issues/6094

This is the most explicit protocol-level issue in the current issue set. It reflects a need for **stricter spec semantics**, especially for implementers building non-Spark writers/readers or validating external environments.

## 5) Bugs & Stability

Ranked by likely severity/impact based on the supplied data.

### 1. High severity: incorrect deletion vector unique ID generation in Java/Kernel
- **Issue #6261 — [BUG][Kernel] Deletion Vector unique id in Java/Kernel concatenates Optional instead of its value**  
  https://github.com/delta-io/delta/issues/6261  

This looks like the most serious newly reported bug. If `DeletionVectorDescriptor.getUniqueId()` produces malformed IDs when an offset exists, that can affect **DV identity, lookup correctness, caching, deduplication, or interoperability assumptions**. No fix PR is listed in the supplied data yet, so this deserves quick maintainer attention.

### 2. Medium severity: timestamp overflow in data skipping
- **PR #6260 — [Spark] Fix timestamp overflow in dataskipping**  
  https://github.com/delta-io/delta/pull/6260  

An open fix PR indicates an active correctness/performance issue in **data skipping**, likely affecting predicate pruning on timestamp ranges. Such bugs can manifest as either incorrect file pruning or degraded query performance. Because a fix is already under review, risk is mitigated.

### 3. Medium severity: transaction early-exit inefficiency/correctness in Kernel
- **Issue #4713**  
  https://github.com/delta-io/delta/issues/4713  
- **PR #6271**  
  https://github.com/delta-io/delta/pull/6271  

Now closed/fixed. This bug could have caused unnecessary metadata/protocol processing in data-only updates. Impact appears more on **efficiency and code-path correctness** than user-visible corruption, but it was still a meaningful internal bug.

### 4. Medium severity: protocol ambiguity around modificationTime validity
- **Issue #6094 — Clarify valid range for add.modificationTime**  
  https://github.com/delta-io/delta/issues/6094  

This is not necessarily a code bug, but a **spec ambiguity** can become a correctness problem across engines. If negative or zero modification times are observed in the wild, implementers need deterministic guidance for validation and compatibility.

### 5. Stability hardening: DV concurrent-writer guard in Kernel IcebergCompat
- **PR #6278**  
  https://github.com/delta-io/delta/pull/6278  

Already closed. This is a preventive fix that reduces concurrency-related compatibility risks rather than responding to a user-visible crash.

## 6) Feature Requests & Roadmap Signals

### Strong roadmap signals for the next version

#### A. Delta 4.2.0 development is starting
- **PR #6280 — [Build] Bump version to 4.2.0-SNAPSHOT**  
  https://github.com/delta-io/delta/pull/6280
- **PR #6256 — Change master version to 4.2.0-SNAPSHOT**  
  https://github.com/delta-io/delta/pull/6256

This is the clearest release-train signal. Expect the next version to absorb much of the currently active work below.

#### B. Better Spark DSv2 integration
Likely candidates:
- **Partition reporting** via `SupportsReportPartitioning`  
  https://github.com/delta-io/delta/pull/6224
- **More accurate columnar mode signaling**  
  https://github.com/delta-io/delta/pull/6276
- **Executor-side DSv2 writing stack**  
  https://github.com/delta-io/delta/pull/6230  
  https://github.com/delta-io/delta/pull/6231

These are foundational enough that they are strong candidates for inclusion in the next feature release.

#### C. CDC + streaming semantics expansion
Likely candidates:
- **Initial snapshot CDC support**  
  https://github.com/delta-io/delta/pull/6075
- **Incremental CDC support**  
  https://github.com/delta-io/delta/pull/6076
- **Streaming semantics validation tests**  
  https://github.com/delta-io/delta/pull/6279

This cluster suggests Delta is expanding beyond basic CDF availability toward a more complete **streaming CDC consumption story**.

#### D. Large-scale UniForm / Iceberg interoperability
- **PR #6272 — Streaming and distributed Iceberg manifest generation for large tables**  
  https://github.com/delta-io/delta/pull/6272

This appears highly strategic and enterprise-facing. If merged soon, it would significantly improve Delta’s story for users standardizing on mixed table formats or using Iceberg-compatible engines.

#### E. Planner/statistics improvements
- **Issue #5952**  
  https://github.com/delta-io/delta/issues/5952
- **PR #6101**  
  https://github.com/delta-io/delta/pull/6101

These indicate demand for **better optimizer-visible statistics**, which can unlock practical performance gains without changing storage format semantics.

## 7) User Feedback Summary

Based on the issue and PR themes, the main user pain points today are:

- **Protocol clarity for cross-engine implementations**  
  Users need stronger spec guarantees, as seen in the `add.modificationTime` question:  
  https://github.com/delta-io/delta/issues/6094  
  This usually comes from teams building validators, connectors, or nonstandard ingestion environments.

- **Kernel correctness and parity gaps**  
  The newly reported DV unique-ID bug and recent transaction-path fix show that **Kernel Java users are exercising deeper functionality** and hitting edge cases:  
  https://github.com/delta-io/delta/issues/6261  
  https://github.com/delta-io/delta/pull/6271

- **Need for mature DSv2 read/write semantics**  
  Multiple stacked PRs around DSv2 options and writer infrastructure suggest users care about **modern Spark connector behavior**, not just legacy paths:  
  https://github.com/delta-io/delta/pull/6230  
  https://github.com/delta-io/delta/pull/6231  
  https://github.com/delta-io/delta/pull/6249  
  https://github.com/delta-io/delta/pull/6250

- **Streaming/CDF usability**  
  The CDC micro-batch work implies demand for reliable operational semantics in streaming pipelines, including initial snapshot handling and commit-skipping behavior:  
  https://github.com/delta-io/delta/pull/6075  
  https://github.com/delta-io/delta/pull/6076  
  https://github.com/delta-io/delta/pull/6279

- **Scalability for very large tables and format interoperability**  
  The UniForm PR clearly reflects users pushing Delta into large-table, multi-format environments where driver-bound manifest generation is no longer acceptable:  
  https://github.com/delta-io/delta/pull/6272

There is little explicit reaction data in today’s snapshot, but the direction of work suggests users are generally pushing Delta toward **production-grade interoperability, stronger planner integration, and large-scale operational robustness**.

## 8) Backlog Watch

These items appear important and likely need sustained maintainer attention:

### 1. Protocol clarification on `add.modificationTime`
- **Issue #6094**  
  https://github.com/delta-io/delta/issues/6094  

Even though it is relatively recent, protocol ambiguities can propagate quickly across implementations. This deserves a spec-level answer, not just a code workaround.

### 2. New Kernel bug on DV unique IDs
- **Issue #6261**  
  https://github.com/delta-io/delta/issues/6261  

Freshly opened and potentially impactful. It should probably receive a fix PR quickly due to possible correctness implications.

### 3. Long-running CDC stack for SparkMicroBatchStream
- **PR #6075**  
  https://github.com/delta-io/delta/pull/6075
- **PR #6076**  
  https://github.com/delta-io/delta/pull/6076

These have been open since 2026-02-19 and are strategically important. Stacked streaming PRs often stall due to review complexity; maintainers may need to help land them incrementally.

### 4. Statistics/reporting improvements still open
- **PR #6101 — Report numRows in estimateStatistics() using per-file stats**  
  https://github.com/delta-io/delta/pull/6101  

Optimizer/statistics improvements often have outsized user impact. This is a good candidate for prioritization if review bandwidth is limited.

### 5. Nontrivial DSv2 write stack
- **PR #6230**  
  https://github.com/delta-io/delta/pull/6230
- **PR #6231**  
  https://github.com/delta-io/delta/pull/6231  

These are core infrastructure PRs. They are likely prerequisites for further DSv2 writer features, so delays here could block a larger cluster of work.

---

## Bottom line

Delta Lake is in a **very active pre-release development phase**, with momentum centered on **Spark DSv2 modernization, kernel correctness, CDC streaming support, and interoperability with Iceberg/Unity Catalog**. The absence of a release today is offset by strong signals that **4.2.0-SNAPSHOT** work has begun. The project looks healthy, but maintainers should keep a close eye on **Kernel DV correctness**, **protocol spec clarity**, and **landing long-running stacked PRs** that carry major user-facing value.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-13

## 1. Today's Overview

Databend showed solid day-level development activity, with **18 PRs updated**, **7 PRs merged/closed**, **5 issues updated**, and **1 new nightly release**. The work pattern is strongly centered on the **query engine**, with fixes landing for SQL name resolution, join correctness, Unicode identifier support, aggregate-state correctness, and `MERGE INTO` stability. In parallel, several open refactors indicate ongoing architectural work in **table branching**, **hash shuffle**, **recursive CTE execution**, and **test infrastructure**. Overall, project health looks good: maintainers are closing correctness bugs quickly, while still moving forward on deeper planner/execution refactors.

---

## 2. Releases

### New release: [v1.2.888-nightly](https://github.com/databendlabs/databend/releases/tag/v1.2.888-nightly)

#### Included change
- **Performance observability improvement**  
  Added **per-plan hardware performance counters to `EXPLAIN PERF`** via a new feature PR:
  - “feat(perf): add per-plan hardware performance counters to EXPLAIN PERF”

#### Why it matters
This is a meaningful observability enhancement for OLAP workloads. Per-plan hardware counters can help users and maintainers better understand CPU-level behavior for query plans, which is especially useful when diagnosing:
- operator-level inefficiencies,
- regressions after optimizer changes,
- plan choices that look correct logically but underperform physically.

#### Breaking changes
- No breaking changes were noted in the release data provided.

#### Migration notes
- No migration steps were indicated.
- Users relying on performance diagnostics should evaluate whether existing tooling or internal debugging scripts can now leverage `EXPLAIN PERF` output more effectively.

---

## 3. Project Progress

### Query engine and SQL compatibility fixes merged/closed today

#### 1) Built-in function names made case-insensitive regardless of identifier setting
- PR: [#19537](https://github.com/databendlabs/databend/pull/19537)
- Issue: [#19536](https://github.com/databendlabs/databend/issues/19536)

Databend fixed a SQL semantics bug where `unquoted_ident_case_sensitive=1` incorrectly affected **built-in function name resolution**. This is an important standards/compatibility fix: user-defined identifiers may be case-sensitive under configuration, but system functions should remain consistently resolvable. This reduces surprising parser/binder behavior and avoids breakage in system/internal queries.

#### 2) Memory leak fixed in `GROUP_CONCAT(DISTINCT ...)` grouped aggregation
- PR: [#19544](https://github.com/databendlabs/databend/pull/19544)
- Issue: [#19543](https://github.com/databendlabs/databend/issues/19543)

A memory leak in grouped final aggregation for `GROUP_CONCAT(DISTINCT ...)` was addressed by avoiding incorrect reinitialization of nullable aggregate states during merge. For analytical systems, aggregate-state lifecycle bugs are high-impact because they can worsen with cardinality and runtime, so this is a notable stability improvement.

#### 3) LEFT JOIN correctness fix for new hash join path
- PR: [#19539](https://github.com/databendlabs/databend/pull/19539)
- Issue: [#19533](https://github.com/databendlabs/databend/issues/19533)

A correctness issue in the **experimental new join engine** was fixed. When the build side was empty, `LEFT JOIN` could produce a schema/column-order mismatch, causing downstream Arrow/Flight deserialization failures in distributed execution. This is a critical fix for correctness and distributed interoperability.

#### 4) Unicode aliases and identifiers support improved
- PR: [#19526](https://github.com/databendlabs/databend/pull/19526)
- Related issue: [#19522](https://github.com/databendlabs/databend/issues/19522)
- Follow-up crate bump: [#19541](https://github.com/databendlabs/databend/pull/19541)

Databend improved SQL usability by allowing **unquoted Unicode identifiers**, including CJK aliases such as `AS 中文`. This is important for international users and downstream consumers such as client tools. The follow-up AST crate version bump suggests maintainers are propagating the parser/lexer compatibility fix through the dependency graph.

#### 5) `MERGE INTO` unmatched-clause panic fixed
- PR: [#19529](https://github.com/databendlabs/databend/pull/19529)

A panic in `MERGE INTO` unmatched-clause handling was fixed by rebinding expressions against the correct schema and ensuring referenced columns are included in required inputs. This improves DML robustness and helps enterprise-style ingestion/update workflows.

#### 6) CI maintenance
- PR: [#19540](https://github.com/databendlabs/databend/pull/19540)

Go version was upgraded to resolve CI errors. This is routine, but it helps keep merge velocity healthy and reduces friction for ongoing development.

---

## 4. Community Hot Topics

The provided dataset shows **no comments or reactions of substance**, so “hot topics” are best inferred from issue/PR clustering and the technical importance of the work.

### A) SQL correctness and semantics around planner/expression handling
- Open PR: [#19546](https://github.com/databendlabs/databend/pull/19546) — preserve `NULL` semantics in `IN`-list rewrite
- Open PR: [#19532](https://github.com/databendlabs/databend/pull/19532) — decorrelate correlated scalar subquery `LIMIT`
- Open PR: [#19538](https://github.com/databendlabs/databend/pull/19538) — simplify filter and lambda evaluation

**Technical need:** users are pushing on SQL edge cases where optimizer rewrites risk changing semantics. The maintainers are clearly prioritizing planner correctness over aggressive rewrites that might introduce regressions.

### B) Join and runtime filtering behavior
- Open PR: [#19547](https://github.com/databendlabs/databend/pull/19547) — scope runtime filter selectivity threshold to bloom filters only
- Closed PR: [#19539](https://github.com/databendlabs/databend/pull/19539) — left join projection correctness fix
- Open PR: [#19505](https://github.com/databendlabs/databend/pull/19505) — hash shuffle refactor

**Technical need:** Databend is actively tuning distributed join execution. The mix of correctness fixes and runtime-filter policy adjustments suggests a balancing act between **performance optimization** and **predictable execution semantics**.

### C) Table branch/tag redesign
- Open PR: [#19534](https://github.com/databendlabs/databend/pull/19534) — remove legacy table branch/tag implementation
- Open PR: [#19499](https://github.com/databendlabs/databend/pull/19499) — table branch refactor

**Technical need:** branch/tag functionality appears to be undergoing deeper redesign. This points to a roadmap theme around **versioned table workflows**, but the current focus is cleanup and architectural simplification rather than immediate end-user expansion.

### D) Recursive CTE execution
- Open PR: [#19545](https://github.com/databendlabs/databend/pull/19545) — recursive CTE streaming execution

**Technical need:** better support for recursive SQL, especially execution strategies that avoid materialization bottlenecks. The mention of Sudoku-style recursive workloads implies demand for more complete recursive query support.

---

## 5. Bugs & Stability

Ranked by likely severity based on correctness/stability impact.

### 1) High severity — `LEFT JOIN` misprojection in experimental new hash join
- Issue: [#19533](https://github.com/databendlabs/databend/issues/19533) — closed
- Fix PR: [#19539](https://github.com/databendlabs/databend/pull/19539)

**Impact:** query correctness failure and potential distributed execution crash via Arrow/Flight deserialization error.  
**Status:** fixed quickly.  
**Assessment:** strong response; this was likely the most serious issue in the batch.

### 2) High severity — memory leak in `GROUP_CONCAT(DISTINCT ...)`
- Issue: [#19543](https://github.com/databendlabs/databend/issues/19543) — still open in issue tracker
- Fix PR: [#19544](https://github.com/databendlabs/databend/pull/19544) — closed

**Impact:** memory growth in grouped final aggregation under a specific aggregate pattern.  
**Status:** code fix appears merged/closed rapidly; issue may simply not yet be closed administratively.  
**Assessment:** important for production workloads with large grouped aggregations.

### 3) Medium severity — built-in function name resolution broken by identifier case-sensitivity setting
- Issue: [#19536](https://github.com/databendlabs/databend/issues/19536) — closed
- Fix PR: [#19537](https://github.com/databendlabs/databend/pull/19537)

**Impact:** SQL compatibility and internal query behavior could break unexpectedly under a non-default session setting.  
**Status:** fixed.  
**Assessment:** not a crash, but a serious semantics regression because it affects built-ins and internals.

### 4) Medium severity — unquoted Unicode/CJK aliases unsupported
- Issue: [#19522](https://github.com/databendlabs/databend/issues/19522) — closed
- Fix PR: [#19526](https://github.com/databendlabs/databend/pull/19526)
- Follow-up: [#19541](https://github.com/databendlabs/databend/pull/19541)

**Impact:** international SQL authoring friction; parser inconsistency between quoted and unquoted aliases.  
**Status:** fixed.  
**Assessment:** usability/compatibility issue rather than a runtime bug.

### 5) Legacy bug closure — vacuum assertion failure
- Issue: [#13995](https://github.com/databendlabs/databend/issues/13995) — closed

**Impact:** historical storage-maintenance assertion failure during `VACUUM TABLE`.  
**Status:** closed after a long lifespan.  
**Assessment:** worth noting because closure of older storage/maintenance bugs is a positive signal for backlog cleanup.

---

## 6. Feature Requests & Roadmap Signals

No major new user-filed feature requests are visible in this 24-hour slice, but the open PR set gives strong roadmap signals.

### Likely near-term themes

#### 1) Better performance introspection
- Release feature: per-plan hardware counters in `EXPLAIN PERF`

This is likely to expand further, because observability is foundational for tuning analytical databases. Expect continued work around richer explain/profiling output.

#### 2) More complete SQL semantics and planner rewrites
- [#19532](https://github.com/databendlabs/databend/pull/19532) correlated scalar subquery decorrelation
- [#19546](https://github.com/databendlabs/databend/pull/19546) `IN`/`NOT IN` `NULL` semantics preservation
- [#19545](https://github.com/databendlabs/databend/pull/19545) recursive CTE streaming execution

These are roadmap signals that Databend is deepening SQL coverage, especially for advanced query patterns that matter in BI tools and migration scenarios.

#### 3) Table versioning / branch-tag architecture
- [#19499](https://github.com/databendlabs/databend/pull/19499)
- [#19534](https://github.com/databendlabs/databend/pull/19534)

This area may reappear in future releases in a cleaner form after legacy code is removed. The current work suggests maintainers are not abandoning the concept, but restructuring it before broader rollout.

#### 4) Test infrastructure modularization
- [#19528](https://github.com/databendlabs/databend/pull/19528)
- [#19542](https://github.com/databendlabs/databend/pull/19542)

This indicates investment in developer productivity and regression prevention, which often precedes faster delivery of user-facing features.

### What might land in the next version
Most plausible candidates from current momentum:
- further **planner correctness fixes**,
- more **recursive CTE support**,
- additional **join/runtime filter behavior tuning**,
- improved **diagnostic tooling** around query execution,
- more polished **Unicode/parser compatibility** propagation into clients and downstream crates.

---

## 7. User Feedback Summary

Based on today’s issues and PRs, user pain points are concentrated in the following areas:

### SQL correctness matters more than marginal optimization
Users are encountering edge cases where optimizer or execution-path changes alter semantics:
- case sensitivity affecting built-in functions,
- `LEFT JOIN` output misprojection,
- `IN`/`NOT IN` rewrite concerns,
- scalar subquery `LIMIT` decorrelation work.

This suggests Databend is increasingly used for workloads that depend on **standards-aligned SQL behavior**, not just raw scan/aggregation performance.

### Internationalization support is important
The Unicode alias/identifier fixes show clear demand for better non-ASCII SQL support:
- [#19522](https://github.com/databendlabs/databend/issues/19522)
- [#19526](https://github.com/databendlabs/databend/pull/19526)

This is especially relevant for teams operating in multilingual environments or integrating with notebooks, BI tools, and regionalized schemas.

### Aggregate and DML stability remain practical production concerns
The `GROUP_CONCAT(DISTINCT ...)` memory leak and `MERGE INTO` panic indicate users are exercising:
- advanced grouped aggregations,
- mutation/merge workflows,
- production-style ETL/ELT patterns.

That is a positive adoption signal: users are moving beyond simple analytical reads into more complex operational analytics patterns.

### Performance diagnosis is becoming a first-class need
The nightly feature adding hardware counters to `EXPLAIN PERF` indicates that users and maintainers need deeper introspection to tune plans and investigate regressions. This aligns with a maturing engine and a more performance-sensitive user base.

---

## 8. Backlog Watch

### 1) Table branch/tag refactor needs close maintainer attention
- [#19499](https://github.com/databendlabs/databend/pull/19499)
- [#19534](https://github.com/databendlabs/databend/pull/19534)

These PRs point to significant architectural churn in table branch/tag support. Because one PR removes legacy implementation while another continues broader refactoring, maintainers should ensure roadmap clarity and avoid leaving contributors/users uncertain about the intended long-term model.

### 2) Hash shuffle refactor is strategically important
- [#19505](https://github.com/databendlabs/databend/pull/19505)

This has been open since 2026-03-04 and concerns distributed query execution internals. Since shuffle behavior influences performance and correctness across many plans, it deserves careful but timely review.

### 3) Recursive CTE execution work is a notable roadmap item
- [#19545](https://github.com/databendlabs/databend/pull/19545)

This addresses a broader capability gap and may have nontrivial implications for execution strategy and memory behavior. It is worth watching because recursive SQL support often unlocks compatibility wins with advanced workloads.

### 4) Historical issue cleanup is improving, but old storage/maintenance bugs should continue to be audited
- [#13995](https://github.com/databendlabs/databend/issues/13995)

The closure is positive, but long-lived issues in maintenance/storage operations can erode user confidence. Continued attention to old operational bugs would strengthen the project’s stability profile.

---

## Overall Health Assessment

Databend looks **healthy and responsive** today. The team is shipping nightly improvements, closing correctness regressions quickly, and simultaneously progressing larger architectural work in planner, execution, and testing. The biggest signal from this snapshot is that Databend is entering a phase where **SQL correctness, distributed execution robustness, and observability** are being sharpened in parallel—a good sign for an analytical database maturing toward broader production use.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-13

## 1. Today's Overview

Velox remained highly active over the last 24 hours, with **50 PRs updated** and **9 issues updated**, indicating strong ongoing development velocity even without a new release. The day’s activity skewed toward **build/CI hardening, execution-engine semantics, fuzzing coverage, and cuDF/GPU enablement**, rather than user-facing versioned milestones. Project health looks generally good: several build-related fixes were merged quickly, but there are still notable open concerns around **timezone handling, Parquet predicate correctness, intermittent memory-arbitration hangs, and fuzzer-found correctness bugs**. Overall, this is a **busy and healthy engineering day**, with maintainers actively reducing infrastructure friction while continuing to expand SQL/operator coverage.

---

## 3. Project Progress

### Merged/closed PRs today

#### 1) CMake/build portability improved for RPC components
- [PR #16748](https://github.com/facebookincubator/velox/pull/16748) — **Merged** — `fix(rpc): Fix CMake header-only library targets for velox_rpc_types and velox_rpc_client`
- Impact: fixes a **macOS build failure** caused by header-only targets not being marked `INTERFACE`.
- Why it matters: this improves **developer portability** and lowers friction for downstream integrators building Velox outside the main Linux path.

#### 2) CI automation updated
- [PR #16755](https://github.com/facebookincubator/velox/pull/16755) — **Merged** — `fix(build): Update new claude-code-action to latest forked-pr-fix branch`
- Impact: maintenance of repo automation and PR workflows.
- Why it matters: not engine-facing, but helps keep contribution pipelines stable.

#### 3) Test utilities for nested/map vectors improved
- [PR #16749](https://github.com/facebookincubator/velox/pull/16749) — **Merged** — `test: Add makeMapVector overload with explicit offsets and sizes`
- Impact: strengthens test expressiveness for **map vector construction**, especially in edge cases where offsets do not imply sizes cleanly.
- Why it matters: better test scaffolding often precedes safer work on **complex/nested types** and vectorized execution correctness.

#### 4) Main-branch build robustness recently strengthened
- [PR #16424](https://github.com/facebookincubator/velox/pull/16424) — **Closed/Merged update surfaced today** — `fix(build): Harden the merge to main builds`
- Impact: reduces dependency on live internet fetches in merge-to-main jobs by preferring system dependencies.
- Why it matters: this directly addresses CI fragility and is consistent with the build-break issue closed today.

### What this says about project progress

The merged changes today mostly advanced **operational stability and portability**, not major end-user SQL functionality. However, the open PR queue shows strong forward motion in:
- **Execution planning semantics**: [PR #16753](https://github.com/facebookincubator/velox/pull/16753) adds `PlanNode::requiresSingleThread()`, which is important for operators that must enforce serial execution.
- **Aggregate/function expansion**: [PR #16498](https://github.com/facebookincubator/velox/pull/16498) adds `vector_sum`, and [PR #16740](https://github.com/facebookincubator/velox/pull/16740) re-introduces `dot_product`.
- **Fuzzing coverage**: [PR #16600](https://github.com/facebookincubator/velox/pull/16600) introduces a `MarkDistinct` fuzzer.
- **GPU execution maturity**: cuDF PRs continue to expand join, decimal, string, and dependency support.

Net: Velox is progressing on **engine correctness, testability, and heterogeneous execution support**.

---

## 4. Community Hot Topics

### 1) Timezone compatibility with system tzdb
- [Issue #16507](https://github.com/facebookincubator/velox/issues/16507) — `TimeZoneMap cannot distinguish GMT`
- [Issue #16216](https://github.com/facebookincubator/velox/issues/16216) — `Velox rejects valid IANA timezone America/Coyhaique present in system tzdb`

These are the clearest community pain points today. Both issues indicate that Velox’s timezone handling may lag or diverge from **current system tzdb / IANA timezone data**, causing runtime failures in Spark+Gluten integration scenarios. The underlying need is stronger **timezone canonicalization and compatibility with evolving tzdata releases**, especially for deployments on newer Linux distributions.

### 2) Build and CI reliability
- [Issue #16745](https://github.com/facebookincubator/velox/issues/16745) — `Failed to build with -DVELOX_MONO_LIBRARY=OFF`
- [Issue #16747](https://github.com/facebookincubator/velox/issues/16747) — `Memory Arbitration Fuzzer: intermittent task hang across multiple operators`
- [Issue #16725](https://github.com/facebookincubator/velox/issues/16725) — `Builds fail because osgeo.org is unavailable` — **Closed**
- [PR #16691](https://github.com/facebookincubator/velox/pull/16691) — `build: Optimize CI with test splitting and 32-core runner`

The technical need here is clear: Velox is broadening its build matrix and test scale, and infra stress is surfacing weak spots. CI optimization and dependency hardening are active, but users still hit build-mode-specific failures and intermittent hangs in fuzzing.

### 3) New SQL/analytics function demand
- [Issue #16756](https://github.com/facebookincubator/velox/issues/16756) — `Add vector_sum aggregate function for element-wise array summation`
- [PR #16498](https://github.com/facebookincubator/velox/pull/16498) — corresponding implementation
- [PR #16740](https://github.com/facebookincubator/velox/pull/16740) — `Re-add dot_product UDF with test fix`

This suggests interest in **vector/array-native analytics functions**, likely tied to ML, embeddings, recommender workloads, or richer analytical SQL over array columns.

### 4) GPU/cuDF acceleration remains a strategic theme
- [PR #16729](https://github.com/facebookincubator/velox/pull/16729) — `feat(cudf): Add CUDF concat(VARCHAR) for TPC-DS`
- [PR #16714](https://github.com/facebookincubator/velox/pull/16714) — `feat(cudf): Implement LEFT SEMI PROJECT join`
- [PR #16612](https://github.com/facebookincubator/velox/pull/16612) — `feat(cudf): GPU Decimal (Part 1 of 3)`
- [PR #16752](https://github.com/facebookincubator/velox/pull/16752) — dependency pin update

Underlying need: users want broader **GPU coverage for benchmark-important SQL features**, especially to reduce CPU fallback in realistic TPC-DS-style workloads.

---

## 5. Bugs & Stability

Ranked by likely severity to users:

### Critical / query correctness

#### 1) Parquet predicate pushdown may return wrong results
- [Issue #16743](https://github.com/facebookincubator/velox/issues/16743) — `Parquet-1.8.1 min/max not defined meta cause string equal filter error`
- Severity: **High**
- Why: reported behavior is a **wrong empty result** for a valid equality predicate, which is a correctness issue, not just a crash.
- Likely area: Parquet metadata/statistics interpretation in `buildColumnStatisticsFromThrift`.
- Fix PR: none referenced in provided data.

#### 2) Fuzzer-found expression correctness failure
- [Issue #16712](https://github.com/facebookincubator/velox/issues/16712) — `Presto Bias Fuzzer run failed with seed 3827`
- Severity: **High**
- Why: fuzzer failures often uncover subtle semantic mismatches or unsafe execution paths.
- Fix PR: none referenced in provided data.

### High / production compatibility

#### 3) Timezone handling rejects valid or ambiguous zones
- [Issue #16507](https://github.com/facebookincubator/velox/issues/16507)
- [Issue #16216](https://github.com/facebookincubator/velox/issues/16216)
- Severity: **High**
- Why: breaks runtime compatibility for Spark+Gluten users on newer tzdb environments; likely to affect real ETL/query workloads.
- Fix PR: none visible in provided data.

### Medium / execution stability

#### 4) Intermittent memory arbitration task hang
- [Issue #16747](https://github.com/facebookincubator/velox/issues/16747)
- Severity: **Medium-High**
- Why: hangs in arbitration can stall jobs and are difficult to diagnose; issue appears long-standing and frequency spiked recently.
- Notes: especially important because it crosses **multiple operators**, hinting at scheduler/memory coordination complexity.
- Fix PR: none visible in provided data.

### Medium / build stability

#### 5) Build fails with `-DVELOX_MONO_LIBRARY=OFF`
- [Issue #16745](https://github.com/facebookincubator/velox/issues/16745)
- Severity: **Medium**
- Why: affects non-default or modular build consumers, especially on macOS/arm64.

#### 6) Dot product debug test failure
- [Issue #16723](https://github.com/facebookincubator/velox/issues/16723) — **Closed**
- Related fix: [PR #16740](https://github.com/facebookincubator/velox/pull/16740)
- Severity: **Medium**
- Why: test/type mismatch (`REAL` vs `DOUBLE`) blocked confidence in UDF reintroduction.
- Status: appears actively addressed.

#### 7) External dependency outage broke builds
- [Issue #16725](https://github.com/facebookincubator/velox/issues/16725) — **Closed**
- Related fix: [PR #16424](https://github.com/facebookincubator/velox/pull/16424)
- Severity: **Medium-Low**
- Why: infra issue, but the quick closure is a good signal of maintainer responsiveness.

---

## 6. Feature Requests & Roadmap Signals

### Strongest roadmap signals from current activity

#### 1) Array/vector analytics are expanding
- [Issue #16756](https://github.com/facebookincubator/velox/issues/16756)
- [PR #16498](https://github.com/facebookincubator/velox/pull/16498)
- [PR #16740](https://github.com/facebookincubator/velox/pull/16740)

`vector_sum` and `dot_product` together indicate a likely push toward **vector-style SQL functions**. This is a meaningful signal for workloads involving feature arrays, embeddings, and advanced analytics.

**Prediction:** `vector_sum` is a strong candidate for near-term landing because an implementation already exists and the feature request was filed alongside it.

#### 2) More explicit execution constraints in the planner
- [PR #16753](https://github.com/facebookincubator/velox/pull/16753)

Adding `PlanNode::requiresSingleThread()` suggests the engine is formalizing operator execution requirements instead of encoding them indirectly. This can improve correctness for merge/order/write-style operators and make scheduling behavior more predictable.

**Prediction:** expect follow-on work in **planner/executor coordination**, especially around driver parallelism limits.

#### 3) Time type evolution
- [PR #16662](https://github.com/facebookincubator/velox/pull/16662)

This is a strong roadmap marker for richer **TIME precision and timezone behavior** support. Given current timezone issues, temporal semantics look like an area of active architectural attention.

**Prediction:** future releases may include expanded temporal type support and stricter compatibility handling.

#### 4) GPU support is moving from experimental breadth to benchmark completeness
- [PR #16729](https://github.com/facebookincubator/velox/pull/16729)
- [PR #16714](https://github.com/facebookincubator/velox/pull/16714)
- [PR #16612](https://github.com/facebookincubator/velox/pull/16612)
- [PR #16752](https://github.com/facebookincubator/velox/pull/16752)
- [PR #15700](https://github.com/facebookincubator/velox/pull/15700)

The cuDF stream is aimed at covering missing primitives needed for **TPC-DS and production-style SQL**, not just demos.

**Prediction:** the next meaningful milestone will likely emphasize **higher GPU SQL coverage** and fewer CPU fallbacks.

---

## 7. User Feedback Summary

### Main pain points observed

- **Timezone compatibility is a real user-facing blocker**, especially for Spark+Gluten users on up-to-date Linux systems.
  - [Issue #16507](https://github.com/facebookincubator/velox/issues/16507)
  - [Issue #16216](https://github.com/facebookincubator/velox/issues/16216)

- **Correctness with older/legacy Parquet metadata remains sensitive**, and users are noticing result mismatches rather than just performance regressions.
  - [Issue #16743](https://github.com/facebookincubator/velox/issues/16743)

- **Build portability still matters to adopters**, especially for alternative build modes and non-Linux environments.
  - [Issue #16745](https://github.com/facebookincubator/velox/issues/16745)
  - [PR #16748](https://github.com/facebookincubator/velox/pull/16748)

- **Reliability under fuzzing and memory pressure is under scrutiny**, suggesting the community values Velox not just for speed, but for robustness in edge execution cases.
  - [Issue #16747](https://github.com/facebookincubator/velox/issues/16747)
  - [Issue #16712](https://github.com/facebookincubator/velox/issues/16712)

### Positive signals

- Build-break and CI issues are being addressed quickly.
- There is sustained investment in **new SQL functions, planner semantics, and GPU support**, which suggests healthy forward momentum rather than pure firefighting.

---

## 8. Backlog Watch

These items appear especially worthy of maintainer attention:

### 1) Long-running timezone issues with real integration impact
- [Issue #16507](https://github.com/facebookincubator/velox/issues/16507)
- [Issue #16216](https://github.com/facebookincubator/velox/issues/16216)

Why watch: they affect interoperability with external engines and current system tzdb data. These are exactly the kinds of issues that can slow adoption in production stacks.

### 2) cuDF CI/test enablement PR aging in open state
- [PR #15700](https://github.com/facebookincubator/velox/pull/15700) — opened 2025-12-04

Why watch: this looks strategically important for GPU support maturity, but it has remained open for months. If merged, it could improve confidence across the growing cuDF feature surface.

### 3) Memory arbitration intermittent hang
- [Issue #16747](https://github.com/facebookincubator/velox/issues/16747)

Why watch: low-frequency hangs are expensive operationally and difficult to root-cause. The recent frequency spike makes this more urgent.

### 4) MarkDistinct fuzzer addition still open
- [PR #16600](https://github.com/facebookincubator/velox/pull/16600)

Why watch: better fuzzing here could catch correctness issues before they hit users, especially given active fuzzer-found bugs elsewhere.

### 5) TIME type extension groundwork
- [PR #16662](https://github.com/facebookincubator/velox/pull/16662)

Why watch: likely foundational work for broader temporal semantics changes. Worth quick review to avoid blocking dependent efforts.

---

## Bottom Line

Velox had a **strong engineering day** centered on **build stability, planner/execution semantics, function expansion, fuzzing, and GPU acceleration**. The biggest risks remain **timezone compatibility**, **Parquet correctness edge cases**, and **intermittent memory-arbitration hangs**. Maintainers appear responsive on infra issues, and the open PR queue suggests the project is steadily pushing toward **broader SQL/operator coverage and better heterogeneous execution support**.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-13

## 1) Today’s Overview

Apache Gluten showed **solid day-to-day development activity** over the last 24 hours, with **15 PRs updated** and **7 issues updated**, while no new release was published. The main development themes were **Spark 4.x compatibility cleanup**, **Velox backend enablement**, **TLP graduation repository/documentation updates**, and a few **query correctness / validation fixes**. Overall project health looks **active and improving**, with several previously tracked compatibility items closed, but there are still notable open risks around **dynamic partition pruning**, **memory/OOM behavior**, and **type support mismatches in Velox validation**. Activity is skewed toward **stabilization and compatibility hardening** rather than major new feature releases.

---

## 3) Project Progress

### Merged/closed PRs today: notable advances

#### Spark compatibility cleanup
- **Remove remaining Spark 3.2 compatibility code** — [PR #11731](https://github.com/apache/incubator-gluten/pull/11731)  
  This is a meaningful codebase simplification. Gluten removed dead shared-code branches such as `lteSpark32`, cleaned version utilities, and deleted Spark 3.2-specific shims/tests. This should reduce maintenance overhead and make behavior more predictable for supported Spark lines, especially Spark 4.x.

- **Tracking disabled Spark 4.x test suites closed** — [Issue #11550](https://github.com/apache/incubator-gluten/issues/11550)  
  The closure of this tracker suggests progress in re-enabling Spark 4.x coverage and narrowing compatibility gaps.

#### SQL compatibility and native execution enablement
- **Enable `GlutenDataFrameSubquerySuite` for Spark 4.1** — [PR #11727](https://github.com/apache/incubator-gluten/pull/11727)  
  This addresses struct join key validation for subquery-related execution. It is an important SQL compatibility improvement, particularly for Spark 4.1 behavior around `isin(Dataset)` and struct-based IN-subquery planning.

- **Enable `GlutenXmlFunctionsSuite` for Spark 4.0 and 4.1** — [PR #11725](https://github.com/apache/incubator-gluten/pull/11725)  
  This extends test-backed compatibility for XML-related functions after prior classpath conflicts were resolved. It indicates improved breadth of SQL/function coverage on newer Spark versions.

- **Enable `assert_not_null` expression for Velox backend** — [PR #11685](https://github.com/apache/incubator-gluten/pull/11685)  
  This is a concrete native execution improvement: Spark’s `AssertNotNull` is now mapped to Velox `assert_not_null`, helping table insert paths and NOT NULL constraint enforcement stay native instead of falling back.

#### Dependency / engine alignment
- **Bump folly to v2026.01.05** — [PR #11745](https://github.com/apache/incubator-gluten/pull/11745), linked issue [#11740](https://github.com/apache/incubator-gluten/issues/11740)  
  This keeps Gluten aligned with upstream Velox dependency evolution. The mention of CentOS 7/kernel header friction also signals continuing pressure from older build environments.

- **Daily Velox update** — [PR #11736](https://github.com/apache/incubator-gluten/pull/11736)  
  Routine Velox sync continues, which is strategically important for performance and function parity, though it also creates ongoing integration risk.

#### Project governance / packaging after graduation
A cluster of PRs updated repository and release metadata after Apache Gluten’s graduation to TLP:
- [PR #11739](https://github.com/apache/incubator-gluten/pull/11739) — release scripts/templates
- [PR #11738](https://github.com/apache/incubator-gluten/pull/11738) — remove DISCLAIMER
- [PR #11742](https://github.com/apache/incubator-gluten/pull/11742) — dev scripts and Dockerfiles
- [PR #11737](https://github.com/apache/incubator-gluten/pull/11737) — remove remaining “Incubating” references (still open)

These do not change query execution directly, but they improve release hygiene and reduce user confusion around project identity and artifact paths.

---

## 4) Community Hot Topics

### 1. Velox upstream divergence tracker
- **[Issue #11585](https://github.com/apache/incubator-gluten/issues/11585)** — “[VL] useful Velox PRs not merged into upstream”  
  **Comments:** 16 | **Reactions:** 4

This is the clearest strategic topic in the current backlog. The issue tracks useful Velox PRs, many from the Gluten community, that are not yet merged upstream. The technical need underneath is clear: Gluten depends heavily on Velox, but some required functionality or fixes live in a limbo state between local need and upstream acceptance. This creates pressure on:
- feature velocity,
- rebase/maintenance burden,
- risk of downstream patch drift,
- uncertainty in production parity between Gluten and upstream Velox.

This tracker is a strong roadmap signal that **Velox integration remains the project’s central dependency-management challenge**.

### 2. Dynamic partition pruning regression
- **[Issue #11692](https://github.com/apache/incubator-gluten/issues/11692)** — Spark UT failures in `DynamicPartitionPruningHiveScanSuite`  
  **Comments:** 7  
- **Fix candidate:** [PR #11748](https://github.com/apache/incubator-gluten/pull/11748)

This is the most concrete active correctness/stability topic. The issue points to failures from Gluten 1.5.1 onward and suggests a validation/subquery submission problem on the driver side. Because dynamic partition pruning is important for selective scans and warehouse-style workloads, failures here affect both correctness confidence and performance optimization trust.

### 3. Iceberg file metadata / JNI stability
- **[PR #11615](https://github.com/apache/incubator-gluten/pull/11615)** — fix `input_file_name()` / `input_file_block_start()` / `input_file_block_length()` on Iceberg, plus JNI init stability

This open PR touches both **data lake semantics** and **runtime stability**. The underlying user demand is reliable support for Spark metadata functions on Iceberg tables under Velox execution. The JNI crash mention raises the importance level, as it crosses from semantics into runtime robustness.

### 4. TimestampNTZ validation policy
- **[PR #11720](https://github.com/apache/incubator-gluten/pull/11720)**  
- **[PR #11656](https://github.com/apache/incubator-gluten/pull/11656)**

These PRs indicate active work around **TimestampNTZ**, `localtimestamp()`, `CurrentTimestamp`, and `now()` validation behavior. The technical need is not just function support, but **better control over fallback decisions** so developers can test native execution paths instead of being blocked by conservative validation.

---

## 5) Bugs & Stability

Ranked by likely severity and user impact:

### High severity

#### 1. OOM reported despite sufficient memory
- **[Issue #11747](https://github.com/apache/incubator-gluten/issues/11747)** — “OOM but memory is enough”

This appears to be the most severe newly reported issue. The error references a `VeloxRuntimeError` and invalid state during `TableScan::getOutput`, suggesting a mismatch between memory accounting, allocator behavior, or execution state management. Even with only one comment so far, issues of this kind are high risk because they can block production jobs and are often hard to reproduce.

**Status:** Open  
**Fix PR:** None linked yet

#### 2. Dynamic partition pruning Hive scan regression
- **[Issue #11692](https://github.com/apache/incubator-gluten/issues/11692)**  
- **Proposed fix:** [PR #11748](https://github.com/apache/incubator-gluten/pull/11748)

This is a likely regression introduced after 1.5.1 and affects Spark test suites tied to dynamic pruning. Since DPP influences scan reduction and subquery handling, the issue may impact both correctness and optimizer behavior in data warehouse workloads.

**Status:** Open  
**Fix PR exists:** Yes

### Medium severity

#### 3. Velox-supported complex types rejected by Gluten validation
- **[Issue #11746](https://github.com/apache/incubator-gluten/issues/11746)** — complex Hive write types seen as unsupported

This looks like a classic **capability mismatch** between backend support and Gluten’s validation layer. Such gaps cause unnecessary fallback or blocked native execution even when Velox can handle the type. This hurts user confidence and slows feature adoption.

**Status:** Open  
**Fix PR:** None linked yet

#### 4. Iceberg metadata function behavior and JNI crash path
- **[PR #11615](https://github.com/apache/incubator-gluten/pull/11615)**

Not a newly filed bug issue today, but the PR itself indicates active remediation of two important stability/compatibility problems: metadata propagation for Iceberg scans and a JNI initialization crash path.

### Lower severity / resolved today

#### 5. Folly version alignment/build compatibility
- **[Issue #11740](https://github.com/apache/incubator-gluten/issues/11740)**  
- **Resolved by:** [PR #11745](https://github.com/apache/incubator-gluten/pull/11745)

This was closed quickly. It matters mostly for buildability and dependency consistency, particularly in older environments like CentOS 7.

---

## 6) Feature Requests & Roadmap Signals

### Likely near-term roadmap directions

#### Better data lake metadata function support
- **[PR #11615](https://github.com/apache/incubator-gluten/pull/11615)**

Support for `input_file_name()` and related file metadata functions on **Iceberg** is a practical feature users expect in lakehouse deployments. Given the PR maturity and concrete scope, this looks like a strong candidate for the next release.

#### More precise validation controls for temporal types
- **[PR #11720](https://github.com/apache/incubator-gluten/pull/11720)**
- **[PR #11656](https://github.com/apache/incubator-gluten/pull/11656)**

The addition of configuration to disable `TimestampNTZ` validation fallback and the associated validation tests suggest Gluten is moving toward **finer-grained fallback policy controls**. This is a strong signal that the next version may improve native coverage for timestamp-related expressions.

#### Closing backend-validator capability gaps
- **[Issue #11746](https://github.com/apache/incubator-gluten/issues/11746)**

When users report that Velox already supports a type but Gluten rejects it, maintainers usually have a clear path: update capability declarations, expression/type validators, and tests. This makes complex-type validation support a plausible near-term fix.

#### Continued Spark 4.x coverage expansion
- **[Issue #11550](https://github.com/apache/incubator-gluten/issues/11550)** closed via related suite-enablement PRs:
  - [PR #11727](https://github.com/apache/incubator-gluten/pull/11727)
  - [PR #11725](https://github.com/apache/incubator-gluten/pull/11725)

This indicates a sustained roadmap focus on **Spark 4.0/4.1 readiness**, not just baseline compilation.

#### Longer-horizon signal: Bolt backend
- **[PR #11261](https://github.com/apache/incubator-gluten/pull/11261)** — WIP add bolt backend

This remains a broad, long-running work-in-progress. It is strategically significant, but based on age and status it does not look imminent for the next release without stronger maintainer movement.

---

## 7) User Feedback Summary

The updated issues and PRs reveal several concrete user pain points:

- **Users want native execution to match actual Velox capability**, especially for complex types and temporal expressions.  
  Evidence: [Issue #11746](https://github.com/apache/incubator-gluten/issues/11746), [PR #11720](https://github.com/apache/incubator-gluten/pull/11720), [PR #11656](https://github.com/apache/incubator-gluten/pull/11656)

- **Fallback/validation logic is still a friction point.**  
  Several changes are about validation rather than core operator implementation, implying users are often blocked not by backend inability, but by conservative front-end checks.

- **Spark 4.x users are actively exercising newer planner behavior and APIs.**  
  Evidence: [PR #11727](https://github.com/apache/incubator-gluten/pull/11727), [PR #11725](https://github.com/apache/incubator-gluten/pull/11725), [Issue #11550](https://github.com/apache/incubator-gluten/issues/11550)

- **Data lake users need stronger Iceberg semantics and metadata fidelity.**  
  Evidence: [PR #11615](https://github.com/apache/incubator-gluten/pull/11615)

- **Operational stability remains a concern in production-like environments**, especially memory behavior and JNI safety.  
  Evidence: [Issue #11747](https://github.com/apache/incubator-gluten/issues/11747), [PR #11615](https://github.com/apache/incubator-gluten/pull/11615)

Overall user sentiment inferred from the backlog is: **Gluten is useful and advancing, but users still need better trust in correctness, validation accuracy, and runtime stability for real-world Spark/Velox workloads.**

---

## 8) Backlog Watch

### Items needing maintainer attention

#### 1. Velox divergence tracker
- **[Issue #11585](https://github.com/apache/incubator-gluten/issues/11585)**  
  High strategic importance, active discussion, and directly tied to long-term maintenance cost. This deserves ongoing triage and perhaps a more formal policy on when to carry downstream patches versus waiting for upstream merge.

#### 2. WIP Bolt backend
- **[PR #11261](https://github.com/apache/incubator-gluten/pull/11261)**  
  This is the oldest visible open PR in the provided set and spans many areas (`CORE, BUILD, VELOX, INFRA, CLICKHOUSE, DOCS, BOLT`). Its breadth and age suggest it may need either:
  - scope reduction,
  - architectural decision-making,
  - or explicit maintainer guidance to unblock progress.

#### 3. Iceberg metadata + JNI stability PR
- **[PR #11615](https://github.com/apache/incubator-gluten/pull/11615)**  
  This is important enough that prolonged review delay would be costly. It affects both user-visible SQL metadata functions and crash resilience.

#### 4. Dynamic partition pruning regression
- **[Issue #11692](https://github.com/apache/incubator-gluten/issues/11692)**  
- **[PR #11748](https://github.com/apache/incubator-gluten/pull/11748)**  
  Since a fix is already proposed, timely review is important to prevent a known regression from lingering.

#### 5. Complex type validation mismatch
- **[Issue #11746](https://github.com/apache/incubator-gluten/issues/11746)**  
  New but important. If confirmed, it likely represents a low-to-medium effort, high-user-value fix.

---

## Overall Health Assessment

Apache Gluten appears **healthy and actively maintained**, with meaningful progress on **Spark 4.x compatibility**, **Velox native execution coverage**, and **post-graduation project cleanup**. The strongest positive signal is the closure of several compatibility and enablement items in a single day. The main risks remain **validation-vs-capability mismatches**, **runtime stability edge cases**, and **dependency/upstream coordination with Velox**. If the open fixes for dynamic partition pruning and Iceberg metadata land soon, the project’s short-term trajectory will look even stronger.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

⚠️ Summary generation failed.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*