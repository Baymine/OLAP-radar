# Apache Doris Ecosystem Digest 2026-03-24

> Issues: 4 | PRs: 105 | Projects covered: 10 | Generated: 2026-03-24 01:17 UTC

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

# Apache Doris Project Digest — 2026-03-24

## 1. Today's Overview

Apache Doris remained highly active over the last 24 hours, with **105 pull requests updated** and **4 issues updated**, indicating strong ongoing engineering throughput despite no new release cut today. The activity pattern is clearly centered on **core engine evolution**, especially around **lakehouse connectors, optimizer behavior, file cache, external catalog architecture, and query/runtime stability**. Current signals suggest the project is in a **heavy integration and hardening phase** for the 4.0.x/4.1.x lines, while also continuing longer-horizon work for 5.0.x. Overall project health looks good from a contribution volume perspective, but several open issues point to **serious correctness, crash, and security-sensitive edge cases** that deserve prompt maintainer attention.

## 3. Project Progress

There were **31 PRs merged/closed** in the last 24 hours, though only one closed PR is explicitly visible in the provided top list, so the best interpretation is based on the broader update stream and branch-pick activity.

### Key areas of progress

- **External catalog and lakehouse integration architecture**
  - A major structural step is the new SPI-based catalog framework in [PR #61604](https://github.com/apache/doris/pull/61604), which introduces a plugin model for external data source catalogs and migrates Elasticsearch as the pilot. This is an important roadmap signal for **decoupled connector delivery, classloader isolation, and cleaner extensibility**.
  - Ongoing connector work also includes:
    - Iceberg validation fixes in [PR #61381](https://github.com/apache/doris/pull/61381)
    - Paimon JDBC scan compatibility in [PR #61513](https://github.com/apache/doris/pull/61513)
    - Paimon write support via `INSERT INTO` / `INSERT OVERWRITE` in [PR #61463](https://github.com/apache/doris/pull/61463)
    - Data lake reader refactoring in [PR #61485](https://github.com/apache/doris/pull/61485)

- **Query engine and optimizer refinement**
  - Nereids optimization work continues in [PR #61635](https://github.com/apache/doris/pull/61635), improving project pushdown rewriting for better nested-field pruning below joins.
  - Scanner-level runtime efficiency is being improved in [PR #61617](https://github.com/apache/doris/pull/61617), which changes limit accounting from per-scanner to shared quota, reducing waste under concurrent scans with `LIMIT`.
  - Materialization and top-N safety/performance are also under attention:
    - [PR #61633](https://github.com/apache/doris/pull/61633) adds type checking before merging lazy materialization columns
    - [PR #60970](https://github.com/apache/doris/pull/60970) adjusts GC logic in materialization operator internals
    - [PR #61439](https://github.com/apache/doris/pull/61439) reverts an earlier COUNT_NULL pushdown change due to performance concerns

- **Storage/cache/runtime efficiency**
  - [PR #57410](https://github.com/apache/doris/pull/57410) adds a **2Q-LRU style segmented file cache**, aimed at protecting hot data from scan/read-ahead eviction pressure. This is a meaningful storage-engine optimization for mixed workloads.
  - Cloud/storage robustness continues with:
    - [PR #61636](https://github.com/apache/doris/pull/61636) adding bounded retry for transient S3 flush response stream errors
    - branch picks enabling compaction on new tablets during schema change queuing:
      - [PR #61628](https://github.com/apache/doris/pull/61628)
      - [PR #61629](https://github.com/apache/doris/pull/61629)

- **SQL/function compatibility and developer productivity**
  - JSON function compatibility is still being improved in [PR #56409](https://github.com/apache/doris/pull/56409), fixing `get_json_string` array handling.
  - Window analytics capabilities are expanding in [PR #61566](https://github.com/apache/doris/pull/61566) with `window_funnel v2`.
  - Build productivity work appears in [PR #61606](https://github.com/apache/doris/pull/61606), reducing compile-time cost for a large aggregate-function translation unit.

## 4. Community Hot Topics

Below are the most notable active issues/PRs from the provided set, with analysis of the deeper technical demand behind them.

### 1) File cache protection for mixed workloads
- [PR #57410](https://github.com/apache/doris/pull/57410) — **[feature](filecache) A 2Q-LRU mechanism for protecting hotspot data in the normal queue**
- Why it matters:
  - This addresses a classic analytical engine problem: **large scans and read-ahead traffic evicting genuinely hot blocks**, which hurts dashboard-style and repeated-query workloads.
  - The technical need is stronger cache QoS under mixed access patterns, especially for cloud/object-storage-backed deployments.

### 2) External catalog pluginization
- [PR #61604](https://github.com/apache/doris/pull/61604) — **Add CatalogProvider SPI framework and migrate ES as pilot**
- Why it matters:
  - This suggests Doris is moving toward a more modular lakehouse ecosystem strategy.
  - Underlying need: **faster connector iteration, reduced dependency conflicts, safer isolation, and easier extension by contributors or downstream vendors**.

### 3) Iceberg correctness and write-path maturity
- [PR #60482](https://github.com/apache/doris/pull/60482) — **Implements Iceberg update/delete/merge into**
- [Issue #61225](https://github.com/apache/doris/issues/61225) — **BE Crash with SIGSEGV in ByteArrayDictDecoder and std::out_of_range during Iceberg scanning/loading**
- [PR #61381](https://github.com/apache/doris/pull/61381) — **Fix execute action validation gaps**
- Why it matters:
  - Iceberg remains a strategic integration area, but user demand is now beyond read-only interoperability and into **full transactional semantics, action validation, and production stability**.
  - The coexistence of major feature development and crash reports shows Doris is still maturing in more advanced Iceberg paths.

### 4) Dynamic tables / streaming foundations
- [PR #61382](https://github.com/apache/doris/pull/61382) — **[feat](dynamic table) support stream part 1**
- [PR #61199](https://github.com/apache/doris/pull/61199) — **Add global monotonically increasing Timestamp Oracle (TSO)**
- Why it matters:
  - These indicate long-term investment in **dynamic computing, transactional ordering, and stream-oriented semantics**.
  - This is likely foundational work rather than near-term polish.

### 5) Materialized view correctness and optimizer hit logic
- [Issue #61228](https://github.com/apache/doris/issues/61228) — **same SQL returns different results; MATERIALIZED issue**
- Why it matters:
  - Users are pushing on Doris’s automatic acceleration features, but they expect **strict semantic equivalence** when MVs are selected.
  - The technical need is stronger **rewrite validation and explainability** when MV substitution occurs.

## 5. Bugs & Stability

Ranked by apparent severity from the provided updates.

### Critical

#### 1) Ranger column-level privilege bypass with CTE + JOIN
- [Issue #61631](https://github.com/apache/doris/issues/61631)
- Severity: **Critical / security-sensitive**
- Report:
  - A user reports a **column-level privilege bypass** when Ranger policies are used and a `WITH ... AS` CTE is combined with `JOIN`.
- Why it matters:
  - This is potentially a **data governance and access control violation**, not just a correctness bug.
- Fix status:
  - No corresponding fix PR is visible in the provided list.

#### 2) BE crash during Iceberg table scanning/loading
- [Issue #61225](https://github.com/apache/doris/issues/61225)
- Severity: **Critical**
- Report:
  - Consistent BE crashes with `SIGSEGV`, involving `ByteArrayDictDecoder` and `std::out_of_range`, during Iceberg reads/load.
- Why it matters:
  - This can directly impact production reliability for Iceberg users.
- Potentially related PRs:
  - [PR #61381](https://github.com/apache/doris/pull/61381) addresses Iceberg action validation gaps, but does **not obviously fix this crash**.
  - [PR #60482](https://github.com/apache/doris/pull/60482) expands Iceberg DML support, which raises the urgency of hardening the execution path.

### High

#### 3) Query result inconsistency due to materialized view matching
- [Issue #61228](https://github.com/apache/doris/issues/61228)
- Severity: **High**
- Report:
  - The same logical SQL returns different results when queries are split versus combined; the reporter traced it to **materialized view hit behavior**, including surprising matches on fields not present in the MV.
- Why it matters:
  - This is a **query correctness** problem, which is one of the most damaging bug classes in OLAP systems.
- Potentially related PRs:
  - No direct fix PR is visible in the provided list.
  - Adjacent work on optimizer/materialization includes [PR #60970](https://github.com/apache/doris/pull/60970) and [PR #61635](https://github.com/apache/doris/pull/61635), but neither appears to specifically resolve MV semantic mismatch.

### Medium

#### 4) FQDN disablement / operational reversibility question
- [Issue #61627](https://github.com/apache/doris/issues/61627)
- Severity: **Medium**
- Report:
  - A user asks how to disable FQDN after enabling it on Doris 2.1.11.
- Why it matters:
  - This is more of an operational manageability concern than a defect, but it hints at **configuration lifecycle friction** and possibly incomplete documentation.
- Fix status:
  - No PR linked.

### Relevant stability-related open PRs

- [PR #61614](https://github.com/apache/doris/pull/61614) — Hive CSV physical line boundary handling
- [PR #61636](https://github.com/apache/doris/pull/61636) — S3 transient flush retry
- [PR #61633](https://github.com/apache/doris/pull/61633) — type-check before lazy materialization merge to avoid coredump
- [PR #61513](https://github.com/apache/doris/pull/61513) — Paimon JDBC driver registration fix
- [PR #61259](https://github.com/apache/doris/pull/61259) — unstable Hive test fix

## 6. Feature Requests & Roadmap Signals

Several PRs provide strong clues about where Doris is heading next.

### Likely near-term feature themes

- **Broader lakehouse write support**
  - [PR #61463](https://github.com/apache/doris/pull/61463) adds Paimon external table writes.
  - [PR #60482](https://github.com/apache/doris/pull/60482) adds Iceberg update/delete/merge.
  - Prediction:
    - The next version is likely to emphasize **stronger bidirectional interoperability with open table formats**, not just read federation.

- **Pluggable external catalog ecosystem**
  - [PR #61604](https://github.com/apache/doris/pull/61604)
  - Prediction:
    - Expect future releases to formalize **connector/plugin boundaries** and possibly reduce the coupling of built-in connectors.

- **Dynamic/stream-oriented compute**
  - [PR #61382](https://github.com/apache/doris/pull/61382)
  - [PR #61199](https://github.com/apache/doris/pull/61199)
  - Prediction:
    - These are more likely to land incrementally, but they signal a roadmap toward **streaming-aware metadata, ordering, and dynamic tables**.

- **Advanced analytics functions**
  - [PR #61566](https://github.com/apache/doris/pull/61566) — window funnel v2
  - [PR #56409](https://github.com/apache/doris/pull/56409) — JSON extraction compatibility
  - Prediction:
    - Continued investment in **behavioral analytics SQL** and **semi-structured data ergonomics** is likely in 4.1+/5.0.

- **Cache and scan efficiency**
  - [PR #57410](https://github.com/apache/doris/pull/57410)
  - [PR #61617](https://github.com/apache/doris/pull/61617)
  - Prediction:
    - Query-serving efficiency under mixed workloads is becoming a first-class optimization target.

## 7. User Feedback Summary

The current user feedback reveals several recurring pain points:

- **Correctness over raw performance**
  - Users are highly sensitive to any case where acceleration features alter semantics, as seen in the MV correctness report in [Issue #61228](https://github.com/apache/doris/issues/61228).
  - For an analytical database, this is a core trust issue.

- **Production stability for open table formats**
  - Iceberg users need both feature completeness and runtime stability, highlighted by [Issue #61225](https://github.com/apache/doris/issues/61225) and the parallel feature work in [PR #60482](https://github.com/apache/doris/pull/60482).
  - This suggests real adoption of Doris in mixed lakehouse environments.

- **Enterprise security/governance confidence**
  - The Ranger privilege bypass report in [Issue #61631](https://github.com/apache/doris/issues/61631) shows that users are applying Doris in environments where **fine-grained access control must be airtight**.

- **Operational simplicity**
  - Questions like [Issue #61627](https://github.com/apache/doris/issues/61627) suggest some users still struggle with **cluster configuration reversibility and documentation depth**, especially on older stable branches.

- **Compatibility matters**
  - Multiple open PRs target practical interoperability: Hive CSV behavior, JDBC driver loading, JSON functions, S3 retries, and HMS pooling. This points to a user base that values Doris as a **real-world integration hub**, not just a standalone OLAP engine.

## 8. Backlog Watch

These items appear to deserve extra maintainer attention due to impact, age, or strategic importance.

### Open issues needing prompt attention

- [Issue #61631](https://github.com/apache/doris/issues/61631) — Ranger column-level privilege bypass with CTE + JOIN  
  **Why watch:** security-sensitive and newly reported; should be triaged urgently.

- [Issue #61225](https://github.com/apache/doris/issues/61225) — BE crash during Iceberg scan/load  
  **Why watch:** production crash on a strategic connector path; still open nearly two weeks after filing.

- [Issue #61228](https://github.com/apache/doris/issues/61228) — MV-related result inconsistency  
  **Why watch:** correctness bug affecting user trust in optimizer rewrite behavior.

### Important older/open PRs that may need maintainer bandwidth

- [PR #57410](https://github.com/apache/doris/pull/57410) — 2Q-LRU file cache mechanism  
  **Why watch:** high-value performance feature with broad architectural impact; opened in 2025 and still active.

- [PR #56409](https://github.com/apache/doris/pull/56409) — `get_json_string` array support fix  
  **Why watch:** old and marked stale; useful SQL compatibility fix that may be low-risk but under-prioritized.

- [PR #56400](https://github.com/apache/doris/pull/56400) — audit event builder cleanup  
  **Why watch:** stale but could matter for memory/resource hygiene in auditing paths.

- [PR #60482](https://github.com/apache/doris/pull/60482) — Iceberg update/delete/merge  
  **Why watch:** strategically important feature, but likely complex and in need of deeper review/testing.

- [PR #61199](https://github.com/apache/doris/pull/61199) — global TSO  
  **Why watch:** major foundational capability for future transaction/stream semantics; deserves sustained architectural review.

---

## Bottom Line

Doris shows **strong development momentum** with a healthy mix of **performance engineering, connector expansion, optimizer work, and future-facing architecture**. The clearest strategic themes are **lakehouse integration**, **pluginized catalogs**, **runtime efficiency**, and **dynamic/stream-oriented infrastructure**. The main risk to near-term project health is not lack of activity, but the presence of a few **high-severity open issues**—notably **Ranger authorization bypass**, **Iceberg-related crashes**, and **materialized view correctness anomalies**—that should be prioritized to preserve enterprise trust and production readiness.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-24

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem is highly active, but the center of gravity has shifted from “pure query speed” to a broader platform race around **lakehouse interoperability, correctness, cloud-object-storage robustness, SQL compatibility, and operational safety**. Across engines, the strongest common signals are deeper support for **Iceberg/Delta/Paimon-style external formats**, more attention to **wrong-result and security-sensitive bugs**, and sustained investment in **optimizer/runtime efficiency under mixed workloads**. The market is also clearly segmenting: some projects are evolving into **full lakehouse query platforms** (Doris, StarRocks, ClickHouse), some remain **embedded or single-node analytic execution leaders** (DuckDB), and others serve as **format/runtime infrastructure layers** (Iceberg, Arrow, Velox, Gluten). Overall, ecosystem health is strong, but community feedback shows users increasingly expect enterprise-grade guarantees on **correctness, governance, and cloud-native behavior**, not just benchmark performance.

---

## 2. Activity Comparison

### Snapshot of current activity

| Project | Issues Updated | PRs Updated | Release Today | Current Phase | Health Score* |
|---|---:|---:|---|---|---:|
| **Apache Doris** | 4 | 105 | No | High-throughput integration + hardening | **8.5/10** |
| **ClickHouse** | 68 | 314 | No | Very high-velocity iteration + rapid bug turnaround | **9.0/10** |
| **DuckDB** | 17 | 43 | **Yes (v1.5.1)** | Post-release stabilization | **8.8/10** |
| **StarRocks** | 32 | 115 | No | Feature delivery + branch stabilization | **8.6/10** |
| **Apache Iceberg** | 11 | 50 | No | Connector/core evolution + infra hardening | **8.2/10** |
| **Delta Lake** | 2 | 31 | No | Kernel/DSv2 integration + correctness focus | **8.0/10** |
| **Databend** | 14 | 16 | No | SQL panic cleanup + stabilization | **7.7/10** |
| **Velox** | 5 | 37 | No | GPU expansion + correctness hardening | **8.1/10** |
| **Apache Gluten** | 11 | 14 | No | Backend compatibility + execution-path hardening | **7.9/10** |
| **Apache Arrow** | 23 | 28 | No | Platform/connectivity hardening | **8.3/10** |

\*Health score is a qualitative synthesis of visible throughput, release responsiveness, fix velocity, and severity of open risks.

### Quick takeaways
- **ClickHouse** is the highest-velocity large engine in this snapshot by raw community activity.
- **Doris** and **StarRocks** show strong engineering throughput with especially heavy work on lakehouse and optimizer/runtime paths.
- **DuckDB** is in a healthy stabilization loop with a fresh bugfix release.
- **Iceberg, Delta, Arrow, Velox, Gluten** are more infrastructure-layer projects, but each shows strong strategic importance in the broader stack.

---

## 3. Apache Doris's Position

### Where Doris is strong vs peers
Apache Doris currently looks strongest in the combination of:
- **high engineering throughput**
- **broad lakehouse connector expansion**
- **core engine/runtime optimization**
- **ongoing architectural modernization**

Key advantages visible today:
1. **Connector and catalog modularization**
   - The SPI-based external catalog work in Doris is strategically important. Compared with many peers, Doris is moving toward a cleaner **pluginized external catalog architecture**, which should help with dependency isolation and faster connector iteration.
2. **Balanced investment across engine layers**
   - Doris is not only adding connectors; it is also investing in **optimizer pruning**, **scan efficiency**, **file cache design**, **materialization safety**, and **stream/dynamic table foundations**.
3. **Lakehouse write ambition**
   - Doris is moving beyond federation into **write-path interoperability** for Iceberg and Paimon, which places it closer to the strategic direction of StarRocks and Delta-connected ecosystems than to engines that remain primarily read-oriented.

### Doris relative to peers
- **Vs ClickHouse**: Doris is less active in raw PR volume and likely still smaller in global contributor/community scale, but it appears more visibly focused on **external catalog modularity and lakehouse interoperability** as first-class architecture.
- **Vs StarRocks**: Doris and StarRocks are the closest peers in this group. Doris appears more active on **catalog/plugin architecture** and some core runtime pieces; StarRocks looks stronger on **replication/shared-data migration tooling** and branch backport cadence.
- **Vs DuckDB**: Doris targets distributed analytical serving and lakehouse integration, while DuckDB targets embedded/local analytics and single-node execution.
- **Vs Iceberg/Delta**: Doris is an engine consuming and writing open table formats; those projects are the format/transaction layers themselves.
- **Vs ClickHouse**: ClickHouse still appears broader in community scale and issue/PR velocity, especially around SQL compatibility and MergeTree internals, but Doris is more directly signaling a **modular lakehouse platform strategy**.

### Technical approach differences
Doris’s current technical posture is:
- **distributed MPP OLAP engine**
- increasingly **lakehouse-integrated**
- moving toward **pluggable catalogs/connectors**
- balancing **serving performance** with **external format interoperability**

That differs from:
- **ClickHouse**: more vertically integrated storage/query stack centered on MergeTree
- **DuckDB**: embedded execution engine, local-first but increasingly lake-aware
- **StarRocks**: similar distributed OLAP direction, with especially strong shared-data/cloud-native emphasis

### Community size comparison
By visible activity:
- **ClickHouse** is the largest activity center in this snapshot.
- **Doris** is in the next active tier, alongside **StarRocks**, and ahead of most infrastructure-layer projects in core engine PR flow.
- Doris’s activity level suggests a **healthy and meaningful open-source community**, even if not yet at ClickHouse’s current visible scale.

---

## 4. Shared Technical Focus Areas

Several requirements are clearly emerging across multiple engines.

### A. Lakehouse/open table format interoperability
**Engines:** Doris, StarRocks, ClickHouse, DuckDB, Iceberg, Delta Lake, Velox  
**Needs:**
- stronger **Iceberg/Delta/Paimon** compatibility
- write-path support, not just read federation
- schema evolution correctness
- cloud/object-store-friendly metadata and scan planning

Examples:
- Doris: Iceberg DML, Paimon writes, pluginized catalogs
- StarRocks: Iceberg manifest cache validation, Iceberg scalability issues
- ClickHouse: DeltaLake Azure correctness/parity
- DuckDB: Parquet/nested lake data hardening
- Velox: Iceberg DWRF sink support

### B. Correctness over optimization aggressiveness
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Iceberg, Delta Lake, Velox, Databend  
**Needs:**
- wrong-result prevention
- optimizer rewrite validation
- snapshot/time-travel correctness
- safer execution in edge-plan shapes

Examples:
- Doris: MV rewrite inconsistency, Ranger privilege bypass
- ClickHouse: wrong rows in join, ignored time-travel setting
- DuckDB: transactional `RETURNING`, join/binding correctness
- Iceberg: Spark snapshot read correctness
- Delta: silent streaming data loss risk

### C. Cloud object storage resilience
**Engines:** Doris, ClickHouse, DuckDB, Iceberg, Arrow, Gluten  
**Needs:**
- retries/backoff
- auth refresh
- S3/GCS/Azure correctness
- efficient remote scan planning

Examples:
- Doris: S3 flush retry
- DuckDB: S3 slowdown handling, S3 export memory issues
- Iceberg: GCS credential refresh bug
- ClickHouse: URL/S3/Azure path hardening
- Arrow: Azure Blob surface expansion in R

### D. SQL compatibility and migration ergonomics
**Engines:** ClickHouse, DuckDB, Doris, StarRocks, Databend, Gluten  
**Needs:**
- ANSI/PG-style semantics
- JSON/window/function parity
- dialect compatibility for BI/dbt/tooling migration

Examples:
- ClickHouse: `VALUES`, `OVERLAY`, NULL concat semantics, SQL compatibility mode
- DuckDB: parser/window binding/PostgreSQL compatibility work
- Doris: JSON and funnel/window function improvements
- StarRocks: `GROUP BY ALL`
- Databend: semantic correctness for `GROUPING()` and `LIKE ESCAPE`

### E. Metadata/cache scalability under large lakehouse deployments
**Engines:** Doris, StarRocks, Iceberg, ClickHouse  
**Needs:**
- scalable metadata fetch/cache architecture
- protection against partition explosion
- more selective scan planning and pruning

Examples:
- Doris: external catalog architecture evolution
- StarRocks: FE OOM with millions of Iceberg partitions
- Iceberg: manifest evolution and planning behavior
- ClickHouse: Delta/Azure and remote planning edge cases

### F. Runtime efficiency for mixed workloads
**Engines:** Doris, ClickHouse, StarRocks, Velox, Gluten  
**Needs:**
- better caching
- less wasted scan work
- better filter pushdown
- more robust join/shuffle/runtime behavior

Examples:
- Doris: 2Q-LRU file cache, shared scan limit accounting
- ClickHouse: parallel read-in-order, large-part pruning concerns
- StarRocks: CTE filter pushdown
- Velox/Gluten: join correctness, GPU operator coverage, dynamic-filter pushdown

---

## 5. Differentiation Analysis

## Storage format and data model strategy
- **Doris / StarRocks**: converging toward **hybrid OLAP + lakehouse query platforms** with native acceleration plus external table/catalog support.
- **ClickHouse**: still most differentiated by its **native storage-first architecture** and deeply integrated MergeTree ecosystem, though it is expanding lakehouse connectivity.
- **DuckDB**: optimized for **embedded, single-node analytics** with best-in-class local file and Parquet ergonomics.
- **Iceberg / Delta Lake**: not query engines first; they are **table/metadata/transaction layers** that shape how engines interoperate.
- **Arrow / Velox / Gluten**: infrastructure/runtime layers enabling execution, interoperability, and acceleration rather than end-user data platforms by themselves.

## Query engine design
- **Doris / StarRocks / ClickHouse**: distributed analytical execution, but with different storage/control-plane philosophies.
- **DuckDB**: in-process vectorized execution, optimized for developer productivity and local analytics.
- **Velox**: reusable execution engine substrate, increasingly GPU-aware.
- **Gluten**: Spark acceleration layer leveraging Velox/native execution.
- **Arrow**: data interchange and compute substrate, not a full serving engine.

## Target workloads
- **Doris**: interactive analytics, dashboard serving, mixed warehouse/lakehouse querying, increasingly external-format-aware.
- **ClickHouse**: ultra-fast analytical serving, logs/events/time-series, increasingly general SQL and lake access.
- **StarRocks**: real-time analytics plus cloud-native/lakehouse deployment.
- **DuckDB**: local analytics, notebooks, embedded apps, ETL/dev workflows.
- **Iceberg/Delta**: large-scale lakehouse table management and multi-engine interoperability.
- **Velox/Gluten**: execution acceleration inside larger systems.

## SQL compatibility posture
- **ClickHouse** is making the most visible push toward broader ANSI compatibility.
- **DuckDB** remains very compatibility-conscious, especially with PostgreSQL-style behavior.
- **Doris** and **StarRocks** are improving SQL/function coverage, but their visible emphasis today is more on engine + lakehouse evolution.
- **Databend** is actively maturing SQL semantics, but still shows more parser/planner edge-case instability than the top tier.
- **Gluten** focuses less on surface SQL dialect and more on semantic preservation under accelerated execution.

---

## 6. Community Momentum & Maturity

### Tier 1: Very high momentum, broad ecosystem gravity
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

These projects show high PR velocity and broad technical scope.  
- **ClickHouse**: fastest-moving by volume, strong maintainer throughput.
- **Doris**: strong momentum with major architectural work and broad core-engine investment.
- **StarRocks**: similarly active, with clear branch/backport discipline and lakehouse/replication focus.

### Tier 2: Mature and healthy, but in targeted stabilization/integration phases
- **DuckDB**
- **Apache Iceberg**
- **Apache Arrow**
- **Delta Lake**

These are highly relevant and active, but current work is more concentrated:
- **DuckDB**: active stabilization after release
- **Iceberg**: format/core evolution and engine-specific hardening
- **Arrow**: interoperability and platform tooling
- **Delta**: Kernel/DSv2 and correctness-sensitive integration work

### Tier 3: Focused engineering momentum, narrower scope or less visible community breadth
- **Velox**
- **Apache Gluten**
- **Databend**

These are important technically, but current visible momentum is narrower:
- **Velox**: strong in GPU/runtime innovation
- **Gluten**: Spark-native acceleration hardening
- **Databend**: active, but currently more stabilization-heavy and smaller in visible scale

### Rapidly iterating vs stabilizing
**Rapidly iterating:**
- ClickHouse
- Doris
- StarRocks
- Velox

**Stabilizing/hardening:**
- DuckDB
- Databend
- Gluten
- Arrow

**Balancing platform evolution with correctness hardening:**
- Iceberg
- Delta Lake

---

## 7. Trend Signals

### 1. Open table formats are now core platform strategy
This is no longer optional ecosystem support. Engines are racing to become first-class compute layers over **Iceberg, Delta, Paimon, Parquet-backed lakes**, including writes, metadata correctness, and governance.

**Value for architects:** prioritize engines with credible multi-format and external catalog strategies if you expect hybrid warehouse/lakehouse deployment.

### 2. Correctness bugs are now more strategically important than raw benchmark wins
Many of the highest-signal community items are not “slow query” complaints, but:
- wrong results
- silent data loss
- auth bypass
- crash bugs in strategic connectors

**Value for data engineers:** release selection should weigh correctness and hardening velocity more heavily than isolated performance headlines.

### 3. Cloud-native operational behavior is a competitive differentiator
S3/GCS/Azure retries, auth refresh, object-store scan planning, remote metadata scaling, and connection-pool behavior are recurring pain points.

**Value for architects:** object-store-heavy deployments should evaluate cloud failure semantics as carefully as SQL performance.

### 4. SQL portability is becoming a major adoption lever
ClickHouse, DuckDB, StarRocks, Doris, Databend, and Gluten-adjacent work all show pressure toward easier migration from PostgreSQL/Spark/ANSI-oriented tooling.

**Value for data engineers:** engines with stronger SQL compatibility reduce BI/tooling migration cost and lower training friction.

### 5. Metadata scalability is becoming as important as scan speed
Large Iceberg partition counts, catalog pluginization, manifest planning, and cache architecture are now visible architectural battlegrounds.

**Value for architects:** for very large lakehouse deployments, metadata path design may dominate platform viability before raw execution speed does.

### 6. Execution engines are diversifying below the SQL layer
Velox, Gluten, Arrow, and Kernel/DSv2 work in Delta/Iceberg show that the stack is becoming more modular. More systems will combine:
- external table formats
- shared execution runtimes
- transport layers
- engine-specific SQL planners

**Value for architects:** future platform choices may be less about one monolithic engine and more about a composable stack.

---

## Bottom Line

**Apache Doris is in a strong competitive position**: it has high development velocity, a credible lakehouse roadmap, meaningful core-engine optimization work, and a strategically important move toward pluginized external catalogs. Its closest comparators today are **StarRocks** and **ClickHouse**: StarRocks is similarly strong in cloud/lakehouse execution, while ClickHouse remains the largest activity center and strongest in raw ecosystem momentum. The broader ecosystem is converging on a common set of demands—**open-format interoperability, correctness guarantees, cloud-native robustness, and SQL portability**—which means technical decision-makers should increasingly evaluate engines by **trustworthiness and integration architecture**, not just query speed.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-24

## 1. Today's Overview

ClickHouse remains in a very high-velocity development cycle: **68 issues** and **314 PRs** were updated in the last 24 hours, with **91 PRs merged/closed** and **25 issues closed**, which indicates strong maintainer throughput. The project is currently focused on a mix of **query correctness fixes, storage/replication edge cases, CI hardening, and SQL compatibility improvements**. There is also visible momentum around **DeltaLake/Azure interoperability**, **parallel replicas**, and **new analyzer-related regressions**, suggesting the team is still actively smoothing rough edges from recent architectural changes. Overall health looks solid, but the issue stream shows continued pressure in **stability under advanced execution paths** and **compatibility semantics**.

## 2. Project Progress

With no releases published today, the best signal of progress comes from merged/closed work and active PR flow.

### Query engine and correctness
- A notable correctness regression appears to have been addressed in **[#100029](https://github.com/ClickHouse/ClickHouse/pull/100029)** / issue form **[#100029](https://github.com/ClickHouse/ClickHouse/issues/100029)**, where `ANY LEFT JOIN` could return wrong rows after SEMI/ANTI join misconversion involving a not-ready `IN` subquery. This is important because it affects result correctness, not just performance.
- Analyzer-related breakage also saw closure in **[#99308](https://github.com/ClickHouse/ClickHouse/issues/99308)**, where **creating a view using a CTE failed** under the new analyzer. This suggests active stabilization of the analyzer rollout.
- The still-open PR **[#100361](https://github.com/ClickHouse/ClickHouse/pull/100361)** fixes an exception path involving **row-level filters and PREWHERE metadata** for URL/S3/object-storage backed reads, showing ongoing hardening in policy-aware query planning.

### Storage engine and replication
- Replication and MergeTree internals remain a central theme:
  - **[#100526](https://github.com/ClickHouse/ClickHouse/pull/100526)** fixes skip-index misuse after `ALTER MODIFY COLUMN`, a subtle metadata/mutation interaction in MergeTree.
  - **[#99497](https://github.com/ClickHouse/ClickHouse/pull/99497)** addresses **block structure mismatch** when combining normal projections with **parallel replicas**.
  - **[#100518](https://github.com/ClickHouse/ClickHouse/pull/100518)** improves upgrade-check CI around **phantom/corrupted parts**, indicating practical investment in safer upgrade validation.
  - **[#100413](https://github.com/ClickHouse/ClickHouse/issues/100413)** reports an open receiver-side replication bug around **unknown projections**, which likely will drive more follow-up patches.

### Performance
- The most visible performance work is **[#100394](https://github.com/ClickHouse/ClickHouse/pull/100394)**, which introduces **parallel read-in-order across multiple parts**. If merged, this should benefit ordered scans on MergeTree tables, especially for workloads relying on sorted reads with multiple active parts.
- User demand also points toward pruning/scanning efficiency in **[#99914](https://github.com/ClickHouse/ClickHouse/issues/99914)**, where primary-key range pruning becomes costly on very large parts with many granules.

### SQL compatibility and UX
- ClickHouse continues to close compatibility gaps:
  - **[#100143](https://github.com/ClickHouse/ClickHouse/pull/100143)** adds SQL-standard **`VALUES` as a table expression**.
  - **[#99604](https://github.com/ClickHouse/ClickHouse/issues/99604)** requests `OVERLAY(...)`.
  - **[#99606](https://github.com/ClickHouse/ClickHouse/issues/99606)** requests ANSI-like `NULL` propagation for `concat()` / `||`.
  - **[#98600](https://github.com/ClickHouse/ClickHouse/issues/98600)** proposes a broader **SQL-standard compatibility mode**.

Together, these point to a clear trend: ClickHouse is steadily making itself easier to adopt for users coming from PostgreSQL, DuckDB, and traditional ANSI SQL systems.

## 3. Community Hot Topics

### 1) 2026 roadmap
- **[#93288](https://github.com/ClickHouse/ClickHouse/issues/93288) — ClickHouse roadmap 2026**
- Most commented issue in the snapshot.
- Signal: the community is watching strategic direction, likely around execution engine maturity, SQL compatibility, cloud/distributed workflows, and storage/format expansion.

### 2) CI and native execution infrastructure
- **[#100291](https://github.com/ClickHouse/ClickHouse/issues/100291) — RFC: Migrating from GitHub Actions to a Native CI Execution Engine**
- This is strategically important. ClickHouse’s scale has likely outgrown standard hosted CI ergonomics, and a native engine would help with deterministic orchestration, artifact reuse, scheduling, and cost/performance control.
- Related activity:
  - **[#100399](https://github.com/ClickHouse/ClickHouse/pull/100399)** enable clang-tidy checks for uninitialized variables
  - **[#100490](https://github.com/ClickHouse/ClickHouse/pull/100490)** revert temporary AST fuzzer disablement
  - **[#99740](https://github.com/ClickHouse/ClickHouse/pull/99740)** revert around libFuzzer PR runs
  - **[#98340](https://github.com/ClickHouse/ClickHouse/pull/98340)** fix pipeline-stuck exception in `ResizeProcessor`

This cluster shows that CI is not peripheral—it is currently a core engineering concern.

### 3) Crash and fuzz stability
- **[#99799](https://github.com/ClickHouse/ClickHouse/issues/99799) — [crash-ci] Double deletion of MergeTreeDataPartCompact in multi_index**
- **[#100158](https://github.com/ClickHouse/ClickHouse/issues/100158)** and **[#100450](https://github.com/ClickHouse/ClickHouse/issues/100450)** — “Bad cast from type A to B”
- **[#100469](https://github.com/ClickHouse/ClickHouse/issues/100469)** — MemorySanitizer uninitialized-value
- Technical need: tighter ownership, immutability, and planner/expression safety guarantees in low-level column and execution code.
- Relevant diagnostic PR:
  - **[#100185](https://github.com/ClickHouse/ClickHouse/pull/100185)** adds assertions in `IColumn::mutate` to catch deep ownership/COW violations.

### 4) SQL semantics and standards
- **[#99606](https://github.com/ClickHouse/ClickHouse/issues/99606)** — `concat` / `||` NULL semantics
- **[#99604](https://github.com/ClickHouse/ClickHouse/issues/99604)** — `OVERLAY`
- **[#98600](https://github.com/ClickHouse/ClickHouse/issues/98600)** — SQL-standard compatibility mode
- **[#100143](https://github.com/ClickHouse/ClickHouse/pull/100143)** — `VALUES` support
- Underlying need: reducing migration friction for BI tools, dbt workflows, and users porting SQL from other engines.

## 4. Bugs & Stability

Ranked by likely severity and user impact.

### Critical / correctness-risk
1. **[#100029](https://github.com/ClickHouse/ClickHouse/issues/100029)** — `ANY LEFT JOIN` returned wrong rows after recent optimization change  
   - Status: **closed**
   - Severity: **critical**, because it can silently corrupt query results.
   - Fix appears to have been handled quickly, which is a positive project-health sign.

2. **[#100502](https://github.com/ClickHouse/ClickHouse/issues/100502)** — DeltaLake Azure time-travel setting silently ignored  
   - Severity: **critical**
   - Why: returns **wrong data instead of error** when `delta_lake_snapshot_version` is ignored.
   - No fix PR shown in this snapshot.

3. **[#99979](https://github.com/ClickHouse/ClickHouse/issues/99979)** — MergeTree `WHERE ... AND -2147483648` incorrectly evaluates false  
   - Severity: **high**
   - Engine-specific incorrect filtering in MergeTree can lead to silent undercount/empty results.

### High severity / crashes / replication
4. **[#99799](https://github.com/ClickHouse/ClickHouse/issues/99799)** — CI crash: double deletion of `MergeTreeDataPartCompact`
   - Severity: **high**
   - Memory lifecycle bug in storage internals; may indicate a deeper ownership issue.

5. **[#100413](https://github.com/ClickHouse/ClickHouse/issues/100413)** — `ReplicatedMergeTree CHECK TABLE` re-fetch loop after unknown projection
   - Severity: **high**
   - Impacts replication health and could cause persistent operational churn on replicas.

6. **[#100471](https://github.com/ClickHouse/ClickHouse/issues/100471)** — `date_time_overflow_behavior='throw'` ignored for numeric to `DateTime64` / `Time64`
   - Severity: **high**
   - Violates configured overflow guarantees, risking silent clamping and bad data quality.

7. **[#100438](https://github.com/ClickHouse/ClickHouse/issues/100438)** — `deltaLakeAzure` throws `NOT_IMPLEMENTED` on schema-evolved tables
   - Severity: **high**
   - Blocks real-world Delta Lake usage on Azure where schema evolution is common.

### Medium severity / regressions / planner issues
8. **[#99547](https://github.com/ClickHouse/ClickHouse/issues/99547)** — `system.parts` hangs under metadata lock, regression in 25.8  
   - Status: **closed**
   - Important operational regression; now apparently addressed.

9. **[#100194](https://github.com/ClickHouse/ClickHouse/issues/100194)** — `NOT_FOUND_COLUMN_IN_BLOCK` with row policy and analyzer
   - Severity: **medium-high**
   - Relevant fix path may be related to **[#100361](https://github.com/ClickHouse/ClickHouse/pull/100361)**, though not necessarily the same bug.

10. **[#95319](https://github.com/ClickHouse/ClickHouse/issues/95319)** — `AMBIGUOUS_COLUMN_NAME` in `SELECT`/`WHERE` expression reuse
   - Severity: **medium**
   - Suggests analyzer/name-resolution inconsistencies still remain.

11. **[#89472](https://github.com/ClickHouse/ClickHouse/issues/89472)** — Block structure mismatch in patch parts stream
   - Severity: **medium**
   - Long-lived storage path issue; still open.

12. **[#95582](https://github.com/ClickHouse/ClickHouse/issues/95582)** — `ARRAY JOIN` strips `LowCardinality`
   - Severity: **medium**
   - Not wrong-result critical, but impacts memory efficiency and client-visible schema behavior.

## 5. Feature Requests & Roadmap Signals

### Strongest product direction signals
1. **SQL standardization**
   - **[#98600](https://github.com/ClickHouse/ClickHouse/issues/98600)** compatibility mode
   - **[#99606](https://github.com/ClickHouse/ClickHouse/issues/99606)** ANSI NULL-propagating concat
   - **[#99604](https://github.com/ClickHouse/ClickHouse/issues/99604)** `OVERLAY`
   - **[#100143](https://github.com/ClickHouse/ClickHouse/pull/100143)** `VALUES`
   
   **Prediction:** these are very plausible candidates for near-term releases because they are relatively bounded, user-visible, and align with a broader compatibility strategy.

2. **Operational SQL management**
   - **[#100203](https://github.com/ClickHouse/ClickHouse/pull/100203)** — `CREATE/DROP/ALTER HANDLER`
   
   **Prediction:** likely to land soon if testing is clean, because it turns config-file-driven HTTP handler management into SQL DDL, a strong usability win.

3. **Observability / distributed explainability**
   - **[#100513](https://github.com/ClickHouse/ClickHouse/pull/100513)** — distributed mode for `EXPLAIN PIPELINE`
   
   **Prediction:** good chance for an upcoming release, especially for users debugging distributed execution and parallel replicas.

4. **Performance engineering**
   - **[#100394](https://github.com/ClickHouse/ClickHouse/pull/100394)** — parallel read-in-order across parts
   - **[#99914](https://github.com/ClickHouse/ClickHouse/issues/99914)** — faster PK pruning on large parts
   
   **Prediction:** these fit ClickHouse’s core value proposition and are likely to remain a priority.

5. **Lakehouse connector maturity**
   - Delta/Azure issues:
     - **[#100438](https://github.com/ClickHouse/ClickHouse/issues/100438)**
     - **[#100502](https://github.com/ClickHouse/ClickHouse/issues/100502)**
     - **[#100124](https://github.com/ClickHouse/ClickHouse/pull/100124)**
   
   **Prediction:** expect more DeltaLake fixes in the next version, particularly around schema evolution, column mapping, and Azure parity.

## 6. User Feedback Summary

Several recurring user pain points are visible:

- **Query correctness is valued over optimization aggressiveness.** Bugs like **wrong rows in joins** and **silent ignored time-travel settings** are especially damaging because they undermine trust.
- **Analyzer adoption is still uneven.** Users upgrading from older versions are encountering new failures in views, row policies, and name resolution:
  - **[#99308](https://github.com/ClickHouse/ClickHouse/issues/99308)**
  - **[#100194](https://github.com/ClickHouse/ClickHouse/issues/100194)**
  - **[#95319](https://github.com/ClickHouse/ClickHouse/issues/95319)**
- **Cross-system SQL compatibility matters more than before.** Requests around `VALUES`, `OVERLAY`, NULL concat behavior, and a general standards mode indicate migration and tooling compatibility are top-of-mind.
- **Cloud/object-storage and lakehouse workloads are growing.** URL/S3/Azure row-policy handling, ORC/Parquet paths, and DeltaLake issues indicate a user base increasingly running ClickHouse against remote data lakes rather than only native local MergeTree storage.
- **Operational ergonomics still matter.**
  - **[#100405](https://github.com/ClickHouse/ClickHouse/issues/100405)** requests better hard-tab handling in `clickhouse-client`.
  - **[#91591](https://github.com/ClickHouse/ClickHouse/issues/91591)** highlights TCP connection scaling constraints.
  - **[#49665](https://github.com/ClickHouse/ClickHouse/issues/49665)** points to killed queries hanging in process lists when sockets are not drained.

## 7. Backlog Watch

These look important and worthy of maintainer attention due to age, architectural importance, or user impact.

1. **[#49665](https://github.com/ClickHouse/ClickHouse/issues/49665)** — killed query may hang if nobody reads from socket  
   - Old issue with operational impact; could affect resource cleanup and observability in production.

2. **[#89472](https://github.com/ClickHouse/ClickHouse/issues/89472)** — block structure mismatch in patch parts stream  
   - Long-lived storage bug, still open.

3. **[#88246](https://github.com/ClickHouse/ClickHouse/issues/88246)** — Arrow `utf8_view` unsupported  
   - Important for modern Python/Polars/Arrow pipelines; connector and ingestion compatibility issue.

4. **[#91591](https://github.com/ClickHouse/ClickHouse/issues/91591)** — TCP connection count limitations  
   - Strategic operational topic for large deployments; may need documentation plus architectural guidance.

5. **[#95319](https://github.com/ClickHouse/ClickHouse/issues/95319)** — ambiguous column behavior in analyzer path  
   - Older analyzer correctness issue; continued presence suggests remaining semantic debt.

6. **[#95582](https://github.com/ClickHouse/ClickHouse/issues/95582)** — `ARRAY JOIN` strips `LowCardinality`  
   - “Easy task” label suggests low implementation barrier and meaningful user benefit.

7. **[#98600](https://github.com/ClickHouse/ClickHouse/issues/98600)** — SQL standard compatibility mode  
   - Only lightly discussed so far, but strategically important and likely to influence many future small features/settings.

---

## Bottom Line

ClickHouse is showing **strong engineering throughput and rapid bug turnaround**, especially on severe correctness regressions. The dominant themes today are **stability in advanced execution paths**, **MergeTree/replication internals**, **CI modernization**, and **incremental SQL standardization**. The project looks healthy, but the backlog makes clear that **analyzer correctness**, **lakehouse connector parity**, and **silent semantic mismatches** remain the highest-risk areas to watch for the next release cycle.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-24

## 1) Today’s Overview

DuckDB had a very active 24 hours: **17 issues updated**, **43 PRs updated**, and **1 new release** landed. The project appears to be in a **post-1.5.0 stabilization cycle**, with a strong emphasis on bugfixing, regression cleanup, and backports, while still accepting a steady stream of engine and SQL-layer improvements. Activity is healthy across both core engine internals and user-facing surfaces such as the CLI, Parquet reader/writer, ADBC, JSON functions, and PostgreSQL compatibility. Overall, the signal is that the team is moving quickly to harden the 1.5 line while continuing internal refactors that support future feature work.

---

## 2) Releases

## v1.5.1 — Bugfix Release
- Release: **DuckDB v1.5.1 Bugfix Release**
- Announcement: https://duckdb.org/2026/03/23/announcing-duckdb-151

This is explicitly positioned as a **bugfix release for issues discovered after v1.5.0**, confirming that 1.5.0 introduced enough regressions or edge-case failures to justify a quick patch release. Based on the issue/PR stream, likely focus areas include crashes in database copy, Parquet edge cases, ADBC streaming behavior, CLI regressions, and assorted correctness fixes.

### Notable implications
- **No breaking changes are indicated** in the release note excerpt.
- **Migration guidance:** users who adopted **v1.5.0** should strongly consider moving to **v1.5.1**, especially if they use:
  - `COPY FROM DATABASE`
  - ADBC streaming / interleaved query patterns
  - advanced Parquet options
  - CLI startup flags / initialization scripting
  - transactional `RETURNING` patterns

Because this is a bugfix release, the practical recommendation is simple: **upgrade rather than work around**, unless you are blocked by downstream packaging constraints.

---

## 3) Project Progress

Merged/closed work today shows progress in three main areas: **query engine correctness**, **storage/Parquet robustness**, and **transaction/checkpoint behavior**.

### Query engine and SQL execution
- **ANTI IEJoin predicates implemented** in closed PR [#21413](https://github.com/duckdb/duckdb/pull/21413).  
  This advances the optimizer/execution engine for inequality join patterns, especially for anti joins, which matter for analytical exclusion queries.
- **ASOF join fix backported to v1.5 branch** in closed PR [#21553](https://github.com/duckdb/duckdb/pull/21553).  
  This is a concrete sign that time-series and event-alignment workloads remain a priority and that regressions in join semantics are being addressed quickly.
- **Fix stale update read during index removal** in closed PR [#21427](https://github.com/duckdb/duckdb/pull/21427).  
  This touches MVCC/index maintenance correctness and suggests continued hardening of update/delete transactional paths.
- **Checkpoint transactions** in closed PR [#21382](https://github.com/duckdb/duckdb/pull/21382).  
  Running checkpoints in their own transaction when possible is a meaningful storage-engine quality improvement, reducing interference and making checkpoint behavior more principled.

### Storage formats and file I/O
- **Parquet dictionary bit-width fix** in closed PR [#21532](https://github.com/duckdb/duckdb/pull/21532).  
  This is a low-level writer correctness fix that helps standards compliance and compatibility with downstream readers.
- **Parquet nested-structure hang issue closed**: issue [#13822](https://github.com/duckdb/duckdb/issues/13822).  
  The closure suggests progress on difficult nested-type handling, especially `list<struct<...>>` patterns common in semi-structured data lakes.
- **Parquet MIN/MAX aggregate internal error issue closed**: [#21477](https://github.com/duckdb/duckdb/issues/21477).  
  Good evidence that the team is addressing optimizer/read-path failures around Parquet files with incomplete statistics.
- **Parquet encrypted + union_by_name crash issue closed**: [#21508](https://github.com/duckdb/duckdb/issues/21508).  
  This is important for enterprise interoperability where schema evolution and encryption are both in play.

### SQL parsing / compatibility / ecosystem
- **PEG grammar fixes** in closed PR [#21331](https://github.com/duckdb/duckdb/pull/21331).  
  This improves parser fidelity and narrows discrepancies with PostgreSQL behavior.
- **ICU 77-1 update** in closed PR [#21476](https://github.com/duckdb/duckdb/pull/21476).  
  This helps text/collation/internationalization support and modern toolchain compatibility.
- **Merge v1.5 branch into main** in closed PR [#21555](https://github.com/duckdb/duckdb/pull/21555).  
  This indicates active release branch integration and healthy maintenance discipline.

Overall, today’s completed work points to a project investing heavily in **correctness under edge cases**, especially around **joins, checkpointing, nested data, and Parquet interoperability**.

---

## 4) Community Hot Topics

These were the most prominent issues/PRs by comment volume, recency, or technical importance.

### 1. S3 throttling / backoff for glob requests
- Issue [#6153](https://github.com/duckdb/duckdb/issues/6153) — **Handle 503 Slowdown responses from S3 glob requests**

This older but still-active issue reflects a real production need: DuckDB is increasingly used directly against object storage, and users expect it to behave like a resilient data-lake query engine. The underlying ask is not just “fix an error,” but **cloud-native retry semantics** for file discovery and scan planning. Its longevity suggests this is operationally important and still not fully solved.

### 2. Partitioned `COPY` to S3 causing high memory usage
- Issue [#11817](https://github.com/duckdb/duckdb/issues/11817) — **Out-of-memory error when performing partitioned copy to S3**

This has relatively high reaction volume and speaks to an important technical need: users want DuckDB to be efficient not only at local OLAP but also as a **data export/ETL writer to cloud object storage**. The concern here is memory proportionality and buffering strategy during hive-partitioned output.

### 3. UNIQUE/PK constraints ignoring collation
- Issue [#19675](https://github.com/duckdb/duckdb/issues/19675) — **UNIQUE constraint doesn't consider column collation**

This is a correctness and SQL semantics issue. It points to a deeper user expectation that **collation semantics must be consistent across comparison, indexing, and constraint enforcement**, not just query evaluation.

### 4. Window binding and internal SQL binder refactors
- PR [#21562](https://github.com/duckdb/duckdb/pull/21562) — **Internal #8500: Window Function Binding**

This is one of the more architecturally significant open PRs. It moves window binding logic into clearer binder pathways and normalizes LEAD/LAG argument handling. The technical need underneath is maintainability and correctness for increasingly complex SQL/window semantics.

### 5. Row-group skipping for Parquet MAP columns
- PR [#21375](https://github.com/duckdb/duckdb/pull/21375) — **Add row group skipping support for MAP columns in Parquet reader**

This is a strong performance topic. It indicates users are reading richer nested Parquet schemas and want **predicate pruning to remain effective even when MAP types are present**. It’s a sign DuckDB’s audience is dealing with modern semi-structured analytics, not just flat tables.

### 6. Interleaved streaming + DML on one connection
- PR [#21569](https://github.com/duckdb/duckdb/pull/21569) — **Add Suspended Query Contexts: Interleaved Streaming + DML**

This is a sophisticated workflow request: users want to stream results and perform writes on the same connection within a transaction. That need usually comes from embedded application developers building stateful data-processing loops, and it aligns with the recently closed ADBC interleaving issue.

---

## 5) Bugs & Stability

Ranked roughly by severity and user impact.

### Critical / high severity

#### 1. `COPY FROM DATABASE ... TO ...` crash in v1.5.0
- Issue: [#21392](https://github.com/duckdb/duckdb/issues/21392) — **fixed on nightly**

A database copy command crashing after minutes is high severity because it affects backup/migration workflows and can undermine trust in admin operations. Since it is marked **fixed on nightly**, this is likely part of the rationale for v1.5.1.

#### 2. Internal assertion from predicate pushdown / binding confusion
- Issue: [#21560](https://github.com/duckdb/duckdb/issues/21560)
- Fix PR: [#21564](https://github.com/duckdb/duckdb/pull/21564)

This looks serious because it causes an **INTERNAL Error** from an ordinary SQL pattern involving `ROW_NUMBER()` and mixed `VARCHAR`/`DATE` partition keys. The quick follow-up PR suggests maintainers identified the projection-order vs partition-order binding bug quickly.

#### 3. Memory leak on repeated persistent inserts via C API
- Issue: [#21539](https://github.com/duckdb/duckdb/issues/21539)

High severity for embedded and long-running application users. Not necessarily a correctness bug, but memory growth in repeated insert loops is a serious operational risk.

#### 4. `DELETE RETURNING` empty result within same transaction
- Issue: [#21540](https://github.com/duckdb/duckdb/issues/21540)

This is a **query correctness / transactional visibility** problem. The delete succeeds, but `RETURNING` does not reflect the rows, which can break application logic relying on SQL-standard DML result semantics.

### Medium severity

#### 5. CLI regression: `-init` runs before `-cmd`
- Issue: [#21535](https://github.com/duckdb/duckdb/issues/21535)

This appears to be a behavior regression in v1.5.0 affecting automation and shell-based initialization. It matters especially for reproducible startup scripting and injection of config/macros into init files.

#### 6. Off-by-one statistics propagation in `date_part`
- Issue: [#21478](https://github.com/duckdb/duckdb/issues/21478)

This likely does not corrupt results, but it can reduce optimizer pruning effectiveness. It is an **optimizer precision** bug rather than a user-visible wrong-answer bug, but still worth fixing because stats quality directly affects analytical performance.

#### 7. `aggregate(df).*` syntax inconsistency
- Issue: [#13055](https://github.com/duckdb/duckdb/issues/13055)

This is more of a SQL usability/consistency issue than a crash, but it matters for composability of struct-returning expressions and star expansion semantics.

### Recently closed stability regressions
- ADBC interleaved query stream failure: [#21384](https://github.com/duckdb/duckdb/issues/21384)
- `read_parquet()` NULL dereference with encryption + `union_by_name`: [#21508](https://github.com/duckdb/duckdb/issues/21508)
- Parquet MIN/MAX internal error without stats: [#21477](https://github.com/duckdb/duckdb/issues/21477)
- `read_csv('/dev/stdin')` stdin regression closed: [#21551](https://github.com/duckdb/duckdb/issues/21551)

The closure of several crashes/regressions in one day is a positive sign for short-term stability momentum.

---

## 6) Feature Requests & Roadmap Signals

Several open items hint at where DuckDB may evolve next.

### Likely near-term additions

#### JSON function expansion
- PR [#21531](https://github.com/duckdb/duckdb/pull/21531) — **`json_serialize_sorted()` and `json_deep_merge()`**

This feels likely to land soon because it is concrete, user-driven, and aligned with practical semi-structured workloads. DuckDB continues to make JSON more useful for transformation and canonicalization tasks.

#### Better PostgreSQL compatibility
- PR [#20979](https://github.com/duckdb/duckdb/pull/20979) — **Make Oids start at 20k to avoid unintended collisions**

This is a roadmap signal that DuckDB still cares about PostgreSQL wire/catalog compatibility for tools and extensions that expect familiar OID ranges.

#### More Parquet skipping/pruning support
- PR [#21375](https://github.com/duckdb/duckdb/pull/21375) — **MAP column row-group skipping**

This is highly aligned with DuckDB’s core value proposition in lakehouse-style analytics. Performance improvements in Parquet readers are very likely to continue into the next release.

### Medium-term / less certain but important

#### Per-query or per-connection memory governance
- Issue [#21547](https://github.com/duckdb/duckdb/issues/21547)

This is a strong roadmap signal from multi-tenant and embedded deployments. If implemented, it would materially improve operational control for services that share one DuckDB instance across workloads.

#### Interleaved streaming and writes on one connection
- PR [#21569](https://github.com/duckdb/duckdb/pull/21569)

This is more invasive architecturally, but there is clear pressure from users wanting richer transactional streaming workflows.

#### Skip checkpoint on detach
- PR [#21570](https://github.com/duckdb/duckdb/pull/21570)

This is niche but useful for attachment-heavy workflows and storage lifecycle control. It may land if maintainers agree the semantics are safe and intuitive.

### Prediction for next version
Most likely to appear in the next patch/minor line:
1. **More 1.5.x bugfixes around transaction semantics, CLI behavior, and copy/Parquet stability**
2. **At least some Parquet reader/writer optimization/correctness work**
3. **Selective SQL ergonomics additions**, especially if low-risk like JSON utility functions

---

## 7) User Feedback Summary

Current user feedback clusters around a few recurring pain points:

### 1. Cloud object storage needs to feel production-safe
Issues like S3 slowdown handling ([#6153](https://github.com/duckdb/duckdb/issues/6153)) and partitioned S3 export memory blowups ([#11817](https://github.com/duckdb/duckdb/issues/11817)) show that users increasingly treat DuckDB as a **serious lakehouse execution engine**, not only a local embedded database.

### 2. Transactional and embedded APIs need stronger guarantees
The C API memory leak ([#21539](https://github.com/duckdb/duckdb/issues/21539)), ADBC stream interleaving issue ([#21384](https://github.com/duckdb/duckdb/issues/21384)), and `DELETE RETURNING` transaction inconsistency ([#21540](https://github.com/duckdb/duckdb/issues/21540)) all come from application-embedded usage. These users care less about ad hoc SQL and more about **predictable engine behavior inside long-running software**.

### 3. SQL correctness and compatibility still matter
Collation-aware uniqueness ([#19675](https://github.com/duckdb/duckdb/issues/19675)), startup order behavior in the CLI ([#21535](https://github.com/duckdb/duckdb/issues/21535)), and parser/window binding work ([#21562](https://github.com/duckdb/duckdb/pull/21562), [#21331](https://github.com/duckdb/duckdb/pull/21331)) indicate users expect DuckDB to behave increasingly like a mature SQL system, especially in edge cases.

### 4. Semi-structured and nested data is now mainstream
Parquet nested structure hangs, MAP skipping support, encrypted Parquet options, and JSON function requests together show that users are working with **real-world data lake schemas**, not simplified benchmark data.

Net takeaway: users remain enthusiastic, but they are pushing DuckDB into more demanding production scenarios where **resilience, memory governance, and transactional correctness** become central.

---

## 8) Backlog Watch

These older or strategically important items still appear to need sustained maintainer attention.

### Long-running operational issue
- [#6153](https://github.com/duckdb/duckdb/issues/6153) — **Handle 503 Slowdown responses from S3 glob requests**  
  Open since 2023. Important for cloud-scale scanning reliability and still unresolved enough to remain active.

### Resource management on S3 export
- [#11817](https://github.com/duckdb/duckdb/issues/11817) — **OOM during partitioned copy to S3**  
  High user impact and good reaction count. Important for ETL/export workloads.

### SQL semantics correctness
- [#13055](https://github.com/duckdb/duckdb/issues/13055) — **`aggregate(df).*` syntax behavior**  
  Older issue that affects SQL composability and could benefit from clearer spec alignment or implementation decision.

### Performance regression / repeated execution slowdown
- [#19482](https://github.com/duckdb/duckdb/issues/19482) — **Second execution takes twice as long**  
  This deserves attention because unexplained repeat-execution slowdown is exactly the sort of behavior analytical users notice quickly in benchmarking and production.

### Collation-aware constraints
- [#19675](https://github.com/duckdb/duckdb/issues/19675) — **UNIQUE constraint ignores collation**  
  Not flashy, but a foundational correctness gap if DuckDB wants stronger text/collation compliance.

---

## Overall Health Assessment

DuckDB looks **healthy but in an intense stabilization phase**. The release of **v1.5.1** and the concentration of closed crash/regression issues suggest the team is responsive and shipping fixes quickly. The main risk area is that expanding support for nested data, cloud I/O, advanced transaction workflows, and SQL compatibility is exposing more edge cases in the engine. That said, the velocity of triage and fix PRs indicates strong project momentum rather than maintenance drag.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-24

## 1) Today’s Overview

StarRocks remained highly active over the last 24 hours, with **32 issues updated** and **115 pull requests updated**, including **73 PRs merged or closed**. The development pattern suggests a project in heavy stabilization and feature-delivery mode: optimizer fixes, Iceberg correctness work, replication enhancements, SQL syntax expansion, and multiple backports across **3.5 / 4.0 / 4.1** branches. No new release was published today, but branch activity indicates continued preparation for near-term patch/minor releases. Overall, project health looks strong on engineering throughput, though several open issues point to persistent pressure around **Iceberg scale**, **query correctness edge cases**, **operational cleanup**, and **ecosystem compatibility**.

## 2) Project Progress

With no release cut today, the clearest progress signal comes from merged/closed PR activity and high-signal open PRs nearing integration.

### Query engine and optimizer
- **Optimizer timeout fix** is under active review in [PR #70605](https://github.com/StarRocks/starrocks/pull/70605), targeting branches **3.5, 4.0, 4.1**. The root cause is an optimizer rule repeatedly reapplying on equivalent plans generated for multiple `array_agg(distinct ...)` expressions with constant input. This is an important planner stability fix because it prevents pathological optimization loops rather than merely improving cost quality.
- **CTE filter pushdown** was proposed in [PR #70673](https://github.com/StarRocks/starrocks/pull/70673). If merged, it would reduce unnecessary row exchange in multi-consumer CTE plans by pushing consumer-specific predicates and runtime filters deeper into the plan, a meaningful execution-engine optimization for analytical workloads.
- **`GROUP BY ALL` SQL syntax support** remains active in [PR #70274](https://github.com/StarRocks/starrocks/pull/70274), improving SQL compatibility with other engines and BI/query portability.

### Lakehouse and external table correctness
- **Iceberg manifest cache validation on read** is being added in [PR #70675](https://github.com/StarRocks/starrocks/pull/70675). This addresses partial cache entry correctness by validating cached manifest completeness against live file counts before using cache hits in scan planning. This is a significant lakehouse correctness hardening step.
- **Paimon schema introspection compatibility** improved via [PR #70535](https://github.com/StarRocks/starrocks/pull/70535), which shows primary keys for Paimon tables in `SHOW CREATE` and `DESC`. This is a small but practical metadata usability fix with behavior change implications.

### Replication, shared-data, and storage observability
- Shared-data/shared-nothing migration work remains prominent:
  - [PR #69339](https://github.com/StarRocks/starrocks/pull/69339): support synchronizing **DeltaColumnGroup (.cols)** files during replication, important for **partial update** and **generated column** features.
  - [PR #70220](https://github.com/StarRocks/starrocks/pull/70220): parallelize tablet file copy during shared-data cluster replication to reduce migration time for tablets with many segment files.
  - [PR #69860](https://github.com/StarRocks/starrocks/pull/69860): add primary-key index SST statistics to `be_tablet_write_log`, improving diagnosability in cloud-native PK index paths.
- A bug fix to remove duplicate closure references in `_tablet_multi_get_rpc` was merged and backported through [PR #70657](https://github.com/StarRocks/starrocks/pull/70657) and [PR #70670](https://github.com/StarRocks/starrocks/pull/70670), signaling continued attention to low-level RPC/runtime correctness.

### Security and governance
- **Credential masking** for user auth strings in audit/profile SQL output is being fixed in [PR #70360](https://github.com/StarRocks/starrocks/pull/70360). This is an important operational security improvement affecting audit logging and SQL redaction paths.

## 3) Community Hot Topics

### 1. Disk cleanup semantics for `DROP TABLE FORCE`
- Issue: [#41046](https://github.com/StarRocks/starrocks/issues/41046)
- Topic: `DROP TABLE FORCE` reportedly does not clean up disk data.
- Why it matters: This is a long-lived operational semantics issue with direct consequences for storage reclamation, cloud cost, and admin expectations. The user concern also points to documentation ambiguity: whether `FORCE` means metadata-only deletion, eventual background GC, or guaranteed physical cleanup.

### 2. Tableau connector missing “Sort by Field”
- Issue: [#68740](https://github.com/StarRocks/starrocks/issues/68740)
- Topic: Tableau live connection to StarRocks does not expose “Sort by → Field,” while extract mode does.
- Why it matters: This is not just a UI annoyance; it highlights a metadata/capability gap in BI connector integration. It reflects the growing importance of semantic interoperability with mainstream BI tools, especially for interactive analytics deployments.

### 3. FE OOM on Iceberg tables with millions of partitions
- Issue: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
- Topic: FE crashes due to eager partition cache loading for very large Iceberg tables.
- Why it matters: This is one of the strongest roadmap signals in today’s issue set. It exposes scaling limits in catalog metadata management and suggests that large Iceberg deployments are pushing FE memory architecture. Combined with [PR #70675](https://github.com/StarRocks/starrocks/pull/70675), this reinforces that Iceberg remains a top operational focus.

### 4. Docker deployment documentation gaps
- Issue: [#63262](https://github.com/StarRocks/starrocks/issues/63262)
- Topic: Users want non-Kubernetes Docker deployment examples with host-mounted config/log/data and multi-FE/BE examples.
- Why it matters: Adoption still depends on simple, self-managed deployment patterns. This is a documentation and onboarding issue, especially for test environments and users trying to simulate cloud-like setups without K8s.

### 5. Security and transport hardening between BEs
- Issue: [#60276](https://github.com/StarRocks/starrocks/issues/60276)
- Topic: request for HTTPS communication between Backend nodes.
- Why it matters: This reflects enterprise deployment requirements around encryption-in-transit, mutual auth, and compliance. It is a notable signal that internal service-to-service security remains an open demand.

## 4) Bugs & Stability

Ranked roughly by severity and operational impact.

### Critical / High severity

#### 1. FE out-of-memory with large Iceberg partition counts
- Issue: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
- Impact: FE OOM and cluster instability for Iceberg catalogs with millions of partitions.
- Technical pattern: eager `partitionCache` loading and broad metadata retrieval.
- Fix status: No direct fix PR in today’s list, though Iceberg-read correctness work in [PR #70675](https://github.com/StarRocks/starrocks/pull/70675) shows adjacent lakehouse attention.

#### 2. Time zone conversion returns `NULL` for specific Africa zones on column execution path
- Open issue: [#70671](https://github.com/StarRocks/starrocks/issues/70671)
- Related closed issue: [#70667](https://github.com/StarRocks/starrocks/issues/70667)
- Impact: query correctness bug affecting `CONVERT_TZ(column, 'UTC', 'Africa/Casablanca')` and `Africa/El_Aaiun`.
- Technical pattern: FE constant folding works for literals/`NOW()`, but BE execution path fails due to cctz parsing of year-round DST POSIX TZ strings.
- Severity: high correctness issue, especially for reporting pipelines with timezone normalization.
- Fix status: No linked PR shown today.

#### 3. Historical Azure ADLS parquet query segmentation fault
- Closed issue: [#70478](https://github.com/StarRocks/starrocks/issues/70478)
- Impact: segfault when querying parquet via ADLS `FILES()`.
- Severity: critical runtime stability issue, though now closed.
- Fix status: closed, but no direct PR surfaced in the supplied list.

### Medium severity

#### 4. No queryable replica found despite NORMAL state
- Issue: [#63026](https://github.com/StarRocks/starrocks/issues/63026)
- Impact: scan planning failure due to mismatch between `minReadableVersion` and `visibleVersion`.
- Severity: medium-high because it affects read availability and can be hard to diagnose.

#### 5. Infinite recursion / stack overflow in logical explain for Iceberg equality deletes
- Issue: [#63341](https://github.com/StarRocks/starrocks/issues/63341)
- Impact: `EXPLAIN LOGICAL` on Iceberg tables with equality deletes triggers `StackOverflowError`.
- Severity: medium-high; impacts optimizer/planner diagnostics and points to incomplete support for equality-delete plan traversal.

#### 6. CN crash with `Unknown type: 0`
- Issue: [#63518](https://github.com/StarRocks/starrocks/issues/63518)
- Impact: compute node crash during query execution.
- Severity: medium-high due to crash behavior, though older report and limited recent activity.

#### 7. CPU imbalance and restart risk from `pip_wg_scan_io` threads
- Issue: [#63358](https://github.com/StarRocks/starrocks/issues/63358)
- Impact: one CN overloaded, cluster restarts soon after.
- Severity: medium-high for operational stability.

#### 8. Empty CTE causing illegal `NULL_TYPE` in thrift stage
- Issue: [#63331](https://github.com/StarRocks/starrocks/issues/63331)
- Impact: planner/execution edge-case failure for prototyping queries using empty CTEs.
- Severity: medium; more correctness/usability than systemic stability.

### Lower severity but notable
- Export ordering confusion for parquet output: [#62831](https://github.com/StarRocks/starrocks/issues/62831)
- Partial column update problem on PK table: [#61938](https://github.com/StarRocks/starrocks/issues/61938)
- Chinese tokenizer performance issue: [#63477](https://github.com/StarRocks/starrocks/issues/63477)
- Vulnerable dependency report (`solr-solrj-8.11.2.jar`): [#63412](https://github.com/StarRocks/starrocks/issues/63412)

## 5) Feature Requests & Roadmap Signals

### Strong signals

#### Iceberg V3 support
- Issue: [#60956](https://github.com/StarRocks/starrocks/issues/60956)
- Signal strength: very strong, with **13 👍**, the highest visible reaction in today’s issue set.
- Why likely important: Iceberg interoperability is strategic for modern analytical engines. As Spark/Trino adoption of V3 grows, StarRocks will need compatibility to stay competitive in lakehouse deployments.
- Prediction: likely a medium-term roadmap item rather than immediate patch release content, due to spec breadth.

#### HTTPS between BEs
- Issue: [#60276](https://github.com/StarRocks/starrocks/issues/60276)
- Signal: enterprise security pressure.
- Prediction: plausible for future enterprise-focused release planning, though implementation complexity is moderate because it affects internal RPC/data paths.

#### Case-sensitive Iceberg access configuration
- Issue: [#63405](https://github.com/StarRocks/starrocks/issues/63405)
- Signal: real interoperability pain in mixed-case schemas and external table access.
- Prediction: good candidate for a near-term compatibility enhancement if scoped as a configurable behavior.

#### `GROUP BY ALL`
- PR: [#70274](https://github.com/StarRocks/starrocks/pull/70274)
- Signal: SQL dialect compatibility is still active roadmap territory.
- Prediction: likely to land in an upcoming minor version if review completes successfully.

#### Explicit skew hint for window functions
- PR: [#70676](https://github.com/StarRocks/starrocks/pull/70676)
- Related revert activity: [#70614](https://github.com/StarRocks/starrocks/pull/70614), [#70672](https://github.com/StarRocks/starrocks/pull/70672), [#70674](https://github.com/StarRocks/starrocks/pull/70674)
- Signal: the feature is still desired, but backport/release-branch stability concerns remain.
- Prediction: likely to appear first in a mainline/newer branch after stabilization, then be backported later.

#### SQLStorm benchmark support
- Closed issue: [#62632](https://github.com/StarRocks/starrocks/issues/62632)
- Signal: interest in modern LLM-generated SQL benchmarking existed, but closure suggests it was not prioritized in the current issue workflow.

## 6) User Feedback Summary

The user feedback today is practical and operational rather than visionary:

- **Large-scale Iceberg users are stressing FE metadata paths**, especially with millions of partitions. This suggests StarRocks is being used in serious lakehouse environments where metadata scalability matters as much as scan speed.
- **BI compatibility matters**: the Tableau sorting capability gap in [#68740](https://github.com/StarRocks/starrocks/issues/68740) shows users expect StarRocks to behave like a first-class live analytics backend, not only a fast SQL engine.
- **Operational expectations remain very concrete**:
  - storage should actually be reclaimed after force-drop: [#41046](https://github.com/StarRocks/starrocks/issues/41046)
  - Docker deployments should be better documented: [#63262](https://github.com/StarRocks/starrocks/issues/63262)
  - internal traffic should support stronger encryption: [#60276](https://github.com/StarRocks/starrocks/issues/60276)
- **Correctness issues often show up in edge-path differences** between FE constant folding vs BE execution, metadata cache hit vs live read, or planner-only statements like `EXPLAIN LOGICAL`. This is typical of a mature analytical engine broadening feature coverage across many execution paths.
- **Language and regional workloads are visible**: Chinese tokenizer performance complaints and timezone handling bugs show demand beyond narrow English/UTC-centric use cases.

## 7) Backlog Watch

These items appear important and likely need maintainer attention due to age, impact, or strategic importance.

### Operational semantics / storage cleanup
- [#41046](https://github.com/StarRocks/starrocks/issues/41046) — `DROP TABLE FORCE` not cleaning disk  
  Long-lived and directly tied to storage cost/control. Even if behavior is “as designed,” documentation should be clarified.

### Iceberg scalability
- [#67760](https://github.com/StarRocks/starrocks/issues/67760) — FE OOM with millions of partitions  
  This is one of the most consequential open issues in the set because it can block high-scale lakehouse adoption.

### Deployment usability
- [#63262](https://github.com/StarRocks/starrocks/issues/63262) — Docker deployment examples needed  
  High leverage documentation issue; likely easy to improve relative to engineering-heavy bugs.

### Security architecture
- [#60276](https://github.com/StarRocks/starrocks/issues/60276) — HTTPS communication between BEs  
  Important for enterprise readiness and compliance.

### Lakehouse roadmap
- [#60956](https://github.com/StarRocks/starrocks/issues/60956) — Apache Iceberg V3 support  
  Strong ecosystem signal and likely to grow in urgency over time.

### PK / update correctness
- [#61938](https://github.com/StarRocks/starrocks/issues/61938) — partial column updates in PK tables do not work  
  This touches a core StarRocks capability and deserves more attention than its low comment count suggests.

### Query and planner correctness edge cases
- [#63026](https://github.com/StarRocks/starrocks/issues/63026) — no queryable replica due to version mismatch  
- [#63331](https://github.com/StarRocks/starrocks/issues/63331) — empty CTE `NULL_TYPE` illegal  
- [#63341](https://github.com/StarRocks/starrocks/issues/63341) — infinite recursion with Iceberg equality deletes  
  These are not flashy issues, but they affect trust in query correctness and diagnosability.

## 8) Notable Links

### High-interest issues
- `DROP TABLE FORCE` disk cleanup: [#41046](https://github.com/StarRocks/starrocks/issues/41046)
- Tableau connector sort-by-field gap: [#68740](https://github.com/StarRocks/starrocks/issues/68740)
- FE OOM on Iceberg partition cache: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
- Iceberg V3 support request: [#60956](https://github.com/StarRocks/starrocks/issues/60956)
- HTTPS between BEs: [#60276](https://github.com/StarRocks/starrocks/issues/60276)
- `CONVERT_TZ` NULL bug for Casablanca/El_Aaiun: [#70671](https://github.com/StarRocks/starrocks/issues/70671)

### High-interest PRs
- Optimizer timeout fix: [#70605](https://github.com/StarRocks/starrocks/pull/70605)
- Iceberg manifest cache completeness validation: [#70675](https://github.com/StarRocks/starrocks/pull/70675)
- CTE consumer filter pushdown: [#70673](https://github.com/StarRocks/starrocks/pull/70673)
- `GROUP BY ALL` support: [#70274](https://github.com/StarRocks/starrocks/pull/70274)
- Mask user auth strings in audit/redaction: [#70360](https://github.com/StarRocks/starrocks/pull/70360)
- DCG sync in shared-nothing → shared-data replication: [#69339](https://github.com/StarRocks/starrocks/pull/69339)

**Bottom line:** StarRocks is showing strong engineering momentum, especially on optimizer robustness, lakehouse correctness, replication capabilities, and SQL compatibility. The main risks visible today are around **Iceberg scale**, **edge-case correctness**, and **enterprise operational expectations** such as security, cleanup semantics, and deployment ergonomics.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-24

## 1. Today's Overview

Apache Iceberg remained highly active over the last 24 hours, with **50 PRs updated** and **11 issues updated**, indicating strong ongoing development velocity across Spark, Flink, core metadata, infra, and connector-related areas. The project did **not publish a new release** today, but maintainers and contributors were actively closing regressions, backport requests, and CI/infrastructure problems. The overall activity pattern suggests a healthy project with simultaneous work on **stability fixes**, **engine compatibility**, and **longer-horizon architecture changes** such as **v4 manifest support**. The main risk signals today are around **query correctness**, **runtime stability under cloud auth or connection pressure**, and **supply-chain hardening of CI workflows**.

---

## 3. Project Progress

### Merged/closed PRs and closed issues moved forward today

Even without a release, several closed items indicate progress in stability and compatibility:

- **Spark position delete compatibility backports**
  - PR [#15743](https://github.com/apache/iceberg/pull/15743) closed: **Spark: Replicate position delete array/map fix to Spark 3.4, 3.5, and 4.0**
  - This extends an existing fix beyond Spark 4.1, improving cross-version support for tables with nested collection types during delete processing.
  - This is important for users running mixed Spark fleets and reduces version-specific behavior differences.

- **Infra workflow policy compliance**
  - PR [#15730](https://github.com/apache/iceberg/pull/15730) closed: **Pin versions in publish-iceberg-rest-fixture-docker.yml**
  - Issue [#15728](https://github.com/apache/iceberg/issues/15728) closed: **Build and Push 'iceberg-rest-fixture' Docker Image failure**
  - This reflects active cleanup of CI breakage caused by Apache/GitHub action allowlist and provenance constraints.

- **REST/OpenAPI behavior clarification**
  - PR [#14965](https://github.com/apache/iceberg/pull/14965) closed: **Add 404 handling for /v1/config endpoint**
  - This improves API contract clarity for REST Catalog consumers, especially around warehouse-not-found semantics.

- **Flink sink stability / backport handling**
  - Issue [#15735](https://github.com/apache/iceberg/issues/15735) closed: **[1.10.2] Flink: Fix non-deterministic operator UIDs in DynamicIcebergSink**
  - This signals maintainers are actively managing release-branch stabilization for Flink users.

- **Regression on array columns in delete rewrite addressed**
  - Issue [#15080](https://github.com/apache/iceberg/issues/15080) closed: **rewrite_position_delete_files fails with ValidationException for tables with array columns**
  - This closes an important regression introduced in 1.10.0 affecting maintenance procedures on complex schemas.

- **Flaky test cleanup**
  - Issue [#15724](https://github.com/apache/iceberg/issues/15724) closed: **Flaky Test: `TestRemoteScanPlanning > testTimestampAsOf()`**
  - This is a small but meaningful sign of test-suite hygiene around snapshot/time-travel behavior.

### Broader progress themes

Today’s closed work points to three concrete advancement areas:

1. **Spark SQL correctness with nested types**
2. **Flink sink determinism and branch stabilization**
3. **Operational robustness of CI, Docker publishing, and REST API contracts**

---

## 4. Community Hot Topics

### 1) GCS credential refresh failures causing long-running job crashes
- Issue [#15414](https://github.com/apache/iceberg/issues/15414) — **[bug] GCSAuthManager does not seem to support credentials refresh - jobs crash mid**
- Comments: 8

This is one of the clearest production-impact topics. The underlying need is better support for **long-lived cloud-authenticated jobs**, especially in Spark environments where OAuth access tokens expire mid-run. This is not just a minor bug: it affects Iceberg’s viability in managed/cloud-native deployments using GCS and service account flows that require token refresh semantics.

### 2) Variant benchmarking demand
- Issue [#15628](https://github.com/apache/iceberg/issues/15628) — **Core: Add JMH benchmarks for Variants**
- Comments: 7

This reflects a growing community focus on the **Variant type** and concern about its scalability/performance envelope. The request for JMH benchmarks indicates users and contributors now need **quantitative confidence** before broader production rollout of Variant-heavy workloads.

### 3) GitHub workflow / supply-chain security hardening
- Issue [#15742](https://github.com/apache/iceberg/issues/15742) — **Harden GitHub Workflow Against Supply Chain Attacks**
- Comments: 6  
- Related PR [#15749](https://github.com/apache/iceberg/pull/15749) — **[do not merge] test ci using astral-sh/setup-uv@v7**
- Related closed PR [#15730](https://github.com/apache/iceberg/pull/15730)

This is a project-governance and infrastructure priority, not a user-facing feature. The discussion shows maintainers are responding to the broader ecosystem trend of **CI/CD supply-chain attacks**, with direct implications for how Iceberg handles third-party GitHub Actions, Docker build steps, and policy enforcement.

### 4) Spark deadlock avoidance under constrained HTTP connection pools
- PR [#15712](https://github.com/apache/iceberg/pull/15712) — **Spark: preload delete files to avoid deadlocks**

This is a technically significant operational topic. It exposes pressure points in scan planning and file loading when delete files are lazy-loaded while data-file readers already occupy all available HTTP connections. The deeper need is improved **resource orchestration for remote object store access**, especially in high-concurrency Spark clusters.

### 5) Foundational work for v4 manifest support
- PR [#15049](https://github.com/apache/iceberg/pull/15049) — **Introduce foundational types for V4 manifest support**

This is a major roadmap signal. Even though it is still open, it points to long-term metadata evolution tied to the **v4 adaptive metadata tree / single-file commit direction**. This work is more strategic than immediately user-visible.

---

## 5. Bugs & Stability

### Severity-ranked issues reported or active today

#### Critical / High

1. **Potential query correctness bug in Spark snapshot reads**
   - Issue [#15741](https://github.com/apache/iceberg/issues/15741) — **Running 2 queries on the same table but different snapshot ID in Spark results in first snapshot's data returned for both queries**
   - Severity: **High**
   - Why it matters: This is a direct **time-travel correctness** problem. Returning data from the wrong snapshot can silently corrupt analytical conclusions.
   - Fix PR: **None linked yet** in provided data.

2. **Long-running Spark jobs crashing on GCS auth expiry**
   - Issue [#15414](https://github.com/apache/iceberg/issues/15414) — **GCSAuthManager does not seem to support credentials refresh**
   - Severity: **High**
   - Why it matters: Production job stability issue affecting cloud environments; can break pipelines after token expiration.
   - Fix PR: **None visible** in provided data.

3. **Flink DynamicIcebergSink cache key ignores configuration changes**
   - Issue [#15731](https://github.com/apache/iceberg/issues/15731) — **HashKeyGenerator SelectorKey cache ignores writeParallelism and distributionMode changes**
   - Severity: **High**
   - Why it matters: Runtime config changes being silently ignored can lead to wrong distribution behavior and operational surprises.
   - Fix PR: **None visible** yet.

#### Medium

4. **Spark deadlock risk due to delete-file loading behavior**
   - PR [#15712](https://github.com/apache/iceberg/pull/15712) — **preload delete files to avoid deadlocks**
   - Severity: **Medium-High**
   - Status: Open fix PR exists
   - Why it matters: Can stall workloads under limited connection pools, especially with remote catalogs/storage over HTTP.

5. **NPE on MAP/LIST columns in Spark DML**
   - PR [#15726](https://github.com/apache/iceberg/pull/15726) — **fix NPE thrown for MAP/LIST columns on DELETE, UPDATE, and MERGE operations**
   - Severity: **Medium**
   - Status: Open fix PR exists
   - Why it matters: Impacts SQL DML reliability on nested schemas, especially relevant as Spark 4.1 support advances.

6. **Parquet readers crash on 2-level Thrift list encoding**
   - PR [#15747](https://github.com/apache/iceberg/pull/15747) — **Fix readers crashing on 2-level (Thrift) list encoding**
   - Severity: **Medium**
   - Status: Open fix PR exists
   - Why it matters: Important compatibility fix for older/nonstandard Parquet encodings and cross-system interoperability.

#### Lower / Resolved today

7. **rewrite_position_delete_files regression on array columns**
   - Issue [#15080](https://github.com/apache/iceberg/issues/15080) — closed
   - Severity: **Medium**, now apparently resolved.

8. **Flaky time-travel test**
   - Issue [#15724](https://github.com/apache/iceberg/issues/15724) — closed
   - Severity: **Low** but relevant for confidence in snapshot planning.

9. **Docker publish workflow failure**
   - Issue [#15728](https://github.com/apache/iceberg/issues/15728) — closed
   - Severity: **Low-Medium**
   - Operational rather than engine-level.

---

## 6. Feature Requests & Roadmap Signals

### Notable requests and in-flight features

- **Variant performance benchmarking**
  - Issue [#15628](https://github.com/apache/iceberg/issues/15628)
  - Likely roadmap impact: high for engineering validation, moderate for end-user visibility.
  - Prediction: likely to land as **developer/perf tooling**, not a headline release feature.

- **Flink SQL Variant + Avro record generation**
  - PR [#15471](https://github.com/apache/iceberg/pull/15471)
  - This suggests ongoing investment in **Variant support across Flink SQL ingestion paths**.
  - Prediction: strong candidate for inclusion in a next minor release if review converges.

- **V4 manifest support foundations**
  - PR [#15049](https://github.com/apache/iceberg/pull/15049)
  - This is one of the clearest strategic roadmap signals in today’s data.
  - Prediction: unlikely to fully ship immediately, but foundational pieces may continue landing over the next few cycles.

- **Spark 4.1 DSv2 ordering reporting**
  - PR [#14948](https://github.com/apache/iceberg/pull/14948)
  - Indicates continued work to align with **new Spark 4.1 datasource APIs**.
  - Prediction: likely part of ongoing Spark 4.1 compatibility maturation.

- **Improved maintenance introspection**
  - PR [#15226](https://github.com/apache/iceberg/pull/15226) — include failed commit info in `RewriteDataFilesAction`
  - Suggests user demand for better observability during maintenance operations.
  - Prediction: plausible near-term merge because it improves operator experience without large architectural risk.

- **AWS/S3 compatibility options**
  - PR [#15391](https://github.com/apache/iceberg/pull/15391) — S3 checksum policy configuration
  - Strong signal that Iceberg users need smoother operation with **S3-compatible storage**, not just AWS S3 proper.
  - Prediction: likely merge candidate because it addresses real interoperability pain.

---

## 7. User Feedback Summary

### Main pain points emerging from current activity

- **Cloud auth lifecycle is a real production blocker**
  - Issue [#15414](https://github.com/apache/iceberg/issues/15414)
  - Users need credential refresh support for long-lived jobs, especially on GCS-backed workloads.

- **Time-travel correctness remains highly sensitive**
  - Issue [#15741](https://github.com/apache/iceberg/issues/15741)
  - Users expect snapshot isolation and historical reads to be fully trustworthy; even isolated reports here are high concern.

- **Nested/complex types continue to be a stress point**
  - PR [#15726](https://github.com/apache/iceberg/pull/15726), Issue [#15080](https://github.com/apache/iceberg/issues/15080), PR [#15747](https://github.com/apache/iceberg/pull/15747)
  - Arrays, maps, lists, and variant-like structures are repeatedly involved in correctness and compatibility issues.
  - This suggests feature richness is expanding faster than total edge-case hardening.

- **Operational behavior under scale/concurrency needs work**
  - PR [#15712](https://github.com/apache/iceberg/pull/15712)
  - Users are hitting deadlocks and resource limits in realistic object-store-backed environments, not just synthetic tests.

- **Kafka Connect users still need clearer guidance and semantics**
  - Issue [#13787](https://github.com/apache/iceberg/issues/13787)
  - Control topic partitioning remains unclear.
  - Closed stale issue [#13986](https://github.com/apache/iceberg/issues/13986) also shows ongoing interest in **upsert semantics** in Kafka connector workflows.

### Satisfaction signals

There is no explicit strong praise signal in today’s data, but the volume of focused PRs suggests contributors are invested and maintainers are still processing fixes across multiple engines. The closure of several regression and infra items is a positive sign for responsiveness.

---

## 8. Backlog Watch

### Important older items still needing maintainer attention

1. **V4 manifest support foundations**
   - PR [#15049](https://github.com/apache/iceberg/pull/15049)
   - Open since 2026-01-14
   - Why it matters: strategic metadata evolution; likely blocked on design review depth.

2. **Spark 4.1 DSv2 ordering support**
   - PR [#14948](https://github.com/apache/iceberg/pull/14948)
   - Open since 2025-12-31
   - Why it matters: Spark 4.1 compatibility and optimizer/planner integration are important for future engine support.

3. **GCS credential refresh bug**
   - Issue [#15414](https://github.com/apache/iceberg/issues/15414)
   - Open since 2026-02-23
   - Why it matters: production reliability issue with no visible fix PR in this dataset.

4. **S3 checksum policy config for non-AWS object stores**
   - PR [#15391](https://github.com/apache/iceberg/pull/15391)
   - Open since 2026-02-21
   - Why it matters: common enterprise interoperability need.

5. **Kafka Connect case-insensitive field lookup with name mapping**
   - PR [#15393](https://github.com/apache/iceberg/pull/15393)
   - Open since 2026-02-21
   - Why it matters: connector correctness in heterogeneous schema environments.

6. **CI workflow optimization on fork compute**
   - PR [#15397](https://github.com/apache/iceberg/pull/15397)
   - Open since 2026-02-21
   - Why it matters: contributor experience and CI cost/performance, though likely controversial from a security/governance standpoint.

7. **RewriteDataFilesAction failed-commit visibility**
   - PR [#15226](https://github.com/apache/iceberg/pull/15226)
   - Open since 2026-02-03
   - Why it matters: operational observability for large maintenance jobs.

8. **Control topic partition recommendation for connectors**
   - Issue [#13787](https://github.com/apache/iceberg/issues/13787)
   - Open since 2025-08-11
   - Why it matters: long-standing user question around production connector topology and scaling guidance.

---

## Overall Health Assessment

Project health appears **good but with visible pressure points**. Development throughput is high, contributors are active across engines and infrastructure, and maintainers are closing regressions and policy-related CI issues promptly. However, today’s issue stream highlights several areas that deserve close attention before the next release cycle: **Spark time-travel correctness**, **GCS auth refresh**, **Flink sink config correctness**, and **nested-type edge cases** across readers and DML paths. Strategically, the project is also clearly investing in **Variant support**, **Spark 4.1 readiness**, and **next-generation manifest/metadata architecture**.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-24

## 1. Today's Overview

Delta Lake showed **high PR activity but light issue traffic** over the last 24 hours: 31 PRs were updated, versus just 2 issues updated and no new releases. The dominant engineering theme is clear: **Kernel/Spark connector work**, especially around **CDC streaming offset management**, **DSv2 behavior parity**, and **Unity Catalog / REST commit integration**. At the same time, the most important quality signal today is a **potential silent data loss bug** in streaming with coordinated commits, which has both a reproducer and a fix PR already in flight. Overall project health looks **active and forward-moving**, but with maintainers currently balancing feature expansion against concurrency and correctness hardening.

## 2. Project Progress

### Merged/closed PRs today

#### 1) Misleading UniForm Iceberg compatibility error fixed
- PR: [#6352](https://github.com/delta-io/delta/pull/6352) — **[CLOSED] [Spark] Fix misleading error message when UniForm Iceberg is enabled without a supported IcebergCompat version**
- Impact: Improves **SQL/user-facing compatibility diagnostics** for UniForm + Iceberg setups.
- Why it matters: This is not a new feature, but it reduces operator confusion in mixed Delta/Iceberg environments and should lower support/debugging time for table configuration problems.

#### 2) Decimal `IN` predicate crash fix in kernel-spark
- PR: [#6354](https://github.com/delta-io/delta/pull/6354) — **[CLOSED] [kernel-spark] [Spark] Fix decimal IN predicate crash when BigDecimal precision < scale**
- Impact: Advances **query correctness and engine robustness** in Spark V2 / Kernel expression handling.
- Technical significance: Fixes a crash path in decimal literal conversion by normalizing precision before `Literal.ofDecimal`, covering an edge case where `precision < scale`.
- User effect: Prevents runtime failures for certain decimal predicates, especially in less common but valid decimal representations.

#### 3) Unity Catalog dependency upgrade iteration
- PRs: [#6357](https://github.com/delta-io/delta/pull/6357) closed, superseded by [#6358](https://github.com/delta-io/delta/pull/6358) open
- Impact: Signals ongoing work to align Delta Lake with **Unity Catalog 0.4.1-SNAPSHOT** and snapshot artifact resolution.
- Why it matters: This is ecosystem plumbing rather than end-user functionality, but it often precedes broader UC integration work.

## 3. Community Hot Topics

### A) CDC streaming offset management stack remains a major development thread
- PRs:
  - [#6075](https://github.com/delta-io/delta/pull/6075) — Part 1: initial snapshot
  - [#6076](https://github.com/delta-io/delta/pull/6076) — Part 2: commit processing logic
  - [#6336](https://github.com/delta-io/delta/pull/6336) — Part 3: finish wiring incremental change processing
  - [#6359](https://github.com/delta-io/delta/pull/6359) — DO NOT MERGE, likely stack plumbing
- Analysis: This stacked PR chain strongly suggests Delta Lake is investing in **more complete CDC streaming semantics inside kernel-spark**, especially around **offset tracking**, **initial snapshot handling**, and **incremental change processing**.
- Underlying need: Users increasingly want **streaming reads over CDF/CDC** with predictable offsets and state transitions, likely to support lakehouse ETL, replication, and downstream materialization pipelines.

### B) Coordinated commits + streaming data loss is the most critical live topic
- Issue: [#6339](https://github.com/delta-io/delta/issues/6339) — **[bug] commitFilesIterator causing silent data loss with coordinated commits**
- Reproducer PR: [#6338](https://github.com/delta-io/delta/pull/6338)
- Fix PR: [#6353](https://github.com/delta-io/delta/pull/6353)
- Analysis: Even without high visible comment volume yet, this is the highest-priority technical discussion because it concerns **silent correctness failure**, not just crashes or UX.
- Underlying need: Stronger guarantees for **streaming readers under coordinated commit protocols**, particularly during races between filesystem backfill and coordinator queries.

### C) DSv2 feature parity work continues
- PRs:
  - [#6249](https://github.com/delta-io/delta/pull/6249) — Support `ignoreChanges` in dsv2
  - [#6250](https://github.com/delta-io/delta/pull/6250) — Support `ignoreFileDeletion` in dsv2
  - [#6313](https://github.com/delta-io/delta/pull/6313) — Metadata-only create table via Kernel
  - [#6355](https://github.com/delta-io/delta/pull/6355) — `AlwaysTrue` / `AlwaysFalse` filter pushdown
- Analysis: This cluster indicates sustained effort to make **Spark DataSource V2 and Kernel-backed paths** feature-complete relative to older integration paths.
- Underlying need: Lower-latency planning, cleaner connector abstraction, and eventually more portable Delta behavior across engines.

## 4. Bugs & Stability

Ranked by severity:

### 1) Critical — Silent data loss with coordinated commits
- Issue: [#6339](https://github.com/delta-io/delta/issues/6339)
- Reproducer: [#6338](https://github.com/delta-io/delta/pull/6338)
- Proposed fix: [#6353](https://github.com/delta-io/delta/pull/6353)
- Severity: **Critical**
- Details: `commitFilesIterator` appears to have a race between two discovery phases: filesystem listing for backfilled files and coordinator lookup for unbackfilled commits. If commits transition state between those phases, some commits may be skipped.
- Risk: **Silent streaming data loss**, which is among the most severe classes of analytics-system bugs.
- Status: Very good sign that both a regression test and a targeted fix exist already.

### 2) High — Decimal predicate crash in kernel-spark
- PR: [#6354](https://github.com/delta-io/delta/pull/6354)
- Severity: **High**
- Details: Certain decimal `IN` predicates could crash when `BigDecimal` precision was less than scale.
- Status: Closed quickly, suggesting maintainers were able to isolate and patch it rapidly.

### 3) Medium — Misleading UniForm Iceberg error path
- PR: [#6352](https://github.com/delta-io/delta/pull/6352)
- Severity: **Medium**
- Details: Error messaging around unsupported `IcebergCompat` versions when UniForm Iceberg is enabled was misleading.
- Impact: More of an operability/diagnostics problem than data correctness, but important for adoption in mixed-format deployments.

### 4) Medium — Flaky retention test in CI
- PR: [#6348](https://github.com/delta-io/delta/pull/6348)
- Severity: **Medium**
- Details: Intermittent test failures in `DeltaRetentionWithCatalogOwnedBatch1Suite`.
- Impact: CI instability slows merges and can mask real regressions, especially around retention/deletion behavior.

## 5. Feature Requests & Roadmap Signals

### UniForm / Iceberg interoperability remains a roadmap signal
- Issue: [#6351](https://github.com/delta-io/delta/issues/6351) — **Create Delta iceberg uniform table**
- Related PRs:
  - [#6352](https://github.com/delta-io/delta/pull/6352)
  - [#6335](https://github.com/delta-io/delta/pull/6335) — Write atomic-supported property to Iceberg compact tables
  - [#6270](https://github.com/delta-io/delta/pull/6270) — Skip redundant IcebergCompatV3 validation
- Prediction: Expect continued incremental work on **UniForm table creation, validation, and Iceberg metadata compatibility**, likely to land in staged form rather than one large release.

### Kernel/Spark DSv2 is likely to see near-term expansion
- PRs:
  - [#6249](https://github.com/delta-io/delta/pull/6249)
  - [#6250](https://github.com/delta-io/delta/pull/6250)
  - [#6313](https://github.com/delta-io/delta/pull/6313)
  - [#6355](https://github.com/delta-io/delta/pull/6355)
- Prediction: The next release is likely to include more **DSv2 read-option parity**, **predicate pushdown improvements**, and **Kernel-routed create table flows**.

### Streaming/CDF improvements are a strong medium-term bet
- PR stack:
  - [#6075](https://github.com/delta-io/delta/pull/6075)
  - [#6076](https://github.com/delta-io/delta/pull/6076)
  - [#6336](https://github.com/delta-io/delta/pull/6336)
- Prediction: Delta Lake appears to be building toward more mature **streaming CDC consumption semantics**, which could become a notable headline feature once the stacked work is merged.

### Unity Catalog managed-commit and schema evolution integration
- PR: [#6347](https://github.com/delta-io/delta/pull/6347) — **Plumb UC-managed schema evolution through Delta REST commits**
- Prediction: This suggests future releases will better support **managed Delta operations through UC + REST commit paths**, especially for governed environments.

## 6. User Feedback Summary

### Main pain points observed
1. **Correctness under concurrency**
   - From [#6339](https://github.com/delta-io/delta/issues/6339), users care deeply about correctness when combining **streaming readers** with **coordinated commits** and backfill behavior.
   - This is the clearest real-world pain point today.

2. **Interoperability friction with Iceberg/UniForm**
   - From [#6351](https://github.com/delta-io/delta/issues/6351) and [#6352](https://github.com/delta-io/delta/pull/6352), users are testing **Delta + Iceberg-compatible table workflows** and hitting setup/compatibility rough edges.
   - This reflects demand for more seamless multi-format lakehouse operation.

3. **DSv2 / Kernel behavior parity**
   - PRs [#6249](https://github.com/delta-io/delta/pull/6249), [#6250](https://github.com/delta-io/delta/pull/6250), and [#6313](https://github.com/delta-io/delta/pull/6313) suggest users and contributors still encounter capability gaps between newer connector paths and legacy behavior.

4. **Spark 4.0 compatibility guardrails**
   - PR: [#6356](https://github.com/delta-io/delta/pull/6356) — block Spark 4.0 clients from writing to Variant tables
   - This indicates active concern around **cross-version compatibility safety**, especially where a write might succeed incorrectly or ambiguously.

### Satisfaction signals
- The project appears responsive on correctness bugs: both the decimal crash and the coordinated-commit race have concrete remediation efforts already underway.
- Fast turnaround on smaller fixes suggests healthy maintainer engagement, even if some larger roadmap items remain in stacked PR form.

## 7. Backlog Watch

These items appear important and likely deserve maintainer attention:

### 1) CDC streaming offset management stack
- [#6075](https://github.com/delta-io/delta/pull/6075)
- [#6076](https://github.com/delta-io/delta/pull/6076)
- [#6336](https://github.com/delta-io/delta/pull/6336)
- Why watch: Long-running stacked PRs can stall major functionality. This work looks strategically important for CDC streaming and likely needs sustained review bandwidth.

### 2) DSv2 read-option parity
- [#6249](https://github.com/delta-io/delta/pull/6249)
- [#6250](https://github.com/delta-io/delta/pull/6250)
- Why watch: These options are important for compatibility with existing streaming/read semantics. Delays here can slow migration to DSv2/Kernel-backed paths.

### 3) Metadata-only create table via Kernel
- [#6313](https://github.com/delta-io/delta/pull/6313)
- Why watch: Foundational connector work like this unlocks broader adoption of Kernel in table lifecycle operations.

### 4) UC-managed schema evolution through REST commits
- [#6347](https://github.com/delta-io/delta/pull/6347)
- Why watch: Important for enterprise/governed deployments using Unity Catalog-managed workflows.

### 5) Silent data loss fix should be expedited
- Issue: [#6339](https://github.com/delta-io/delta/issues/6339)
- Fix PR: [#6353](https://github.com/delta-io/delta/pull/6353)
- Why watch: This should be prioritized above most feature work due to its correctness implications.

## 8. Overall Health Assessment

Delta Lake is currently in a **feature-active but integration-heavy phase**, with substantial engineering effort going into **kernel-spark**, **DSv2 parity**, **streaming CDC**, and **Unity Catalog integration**. The absence of releases today is not concerning given the volume of ongoing PR work, but it does mean users must watch mainline development closely for stability-sensitive changes. The biggest near-term health risk is the coordinated-commit streaming bug; the biggest positive signal is that the project already has both a reproducer and a proposed patch. Net assessment: **healthy momentum, with one urgent correctness issue to resolve before confidence improves further**.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-24

## 1. Today's Overview

Databend showed **high repository activity** over the last 24 hours, with **14 issues updated** and **16 PRs updated**, but **no new release** published today. The dominant theme was **query-engine hardening**, especially around **planner/parser panic fixes**, **constant folding safety**, and **SQL compatibility regressions** uncovered by DuckDB sqllogictest migration. Maintainers also closed several targeted fixes, indicating good responsiveness on correctness and crash issues. Overall, project health looks **actively maintained but currently in a stabilization-heavy phase**, with many recent reports centered on panics rather than feature expansion.

## 3. Project Progress

Merged/closed work today advanced Databend in three main areas: SQL correctness, storage robustness, and parser stability.

### Query engine and SQL compatibility
- **BIGINT overflow handling fixed during constant folding** — PR [#19589](https://github.com/databendlabs/databend/pull/19589) closed a bug where overflowing `BIGINT * BIGINT` produced internal `PanicError 1104` instead of a normal SQL overflow error. This is an important correctness improvement for expression evaluation and planner-time folding. It corresponds to issue [#19575](https://github.com/databendlabs/databend/issues/19575).
- **Recursive view crash prevention** — PR [#19584](https://github.com/databendlabs/databend/pull/19584) closed the crash reported in issue [#19572](https://github.com/databendlabs/databend/issues/19572), preventing creation or alteration of recursive views that could previously crash `databend-query` with `SIGSEGV`.
- **UNION parentheses preservation in parser/AST** — PR [#19587](https://github.com/databendlabs/databend/pull/19587) fixed parse roundtrip/assertion behavior for grouped set operations by preserving parentheses in `UNION`/`INTERSECT`/`EXCEPT` expressions. This addressed issue [#19578](https://github.com/databendlabs/databend/issues/19578).

### Storage engine robustness
- **Recluster oversized block handling** — PR [#19577](https://github.com/databendlabs/databend/pull/19577) fixed storage-side recluster behavior to split oversized compacted blocks after sort/compaction. This is a practical optimization and safety improvement for Fuse table maintenance workflows.

### In-flight work signaling next steps
Several open PRs show near-term progress on crash-to-error conversion and planner safety:
- [#19590](https://github.com/databendlabs/databend/pull/19590) — repeated `%` handling in `LIKE` folding
- [#19591](https://github.com/databendlabs/databend/pull/19591) — overflow-safe full-range `UInt64` stats handling
- [#19592](https://github.com/databendlabs/databend/pull/19592) / [#19594](https://github.com/databendlabs/databend/pull/19594) — semantic errors for invalid `GROUPING()`
- [#19593](https://github.com/databendlabs/databend/pull/19593) and [#19596](https://github.com/databendlabs/databend/pull/19596) — escaping `LIKE ... ESCAPE` literals
- [#19595](https://github.com/databendlabs/databend/pull/19595) and [#19597](https://github.com/databendlabs/databend/pull/19597) — planner handling for invalid or empty `LIKE ESCAPE`

These indicate the team is systematically converting internal panics into proper SQL-layer validation errors.

## 4. Community Hot Topics

### 1) INSERT performance regression after upgrade
- Issue [#19481](https://github.com/databendlabs/databend/issues/19481) — **“slower performance of INSERT with 1.2.881”**
- This is the most discussed item today with **24 comments**, far above everything else.

**Why it matters:**  
This is the clearest signal of real production-user impact in the current batch. Unlike the parser/planner panics mostly found by test migration, this issue points to a **regression between nightly versions (1.2.790 → 1.2.881)** affecting a core write path. For an OLAP engine, INSERT throughput directly affects ingestion SLAs, streaming buffers, ETL windows, and operational cost.

**Underlying technical need:**  
Users likely need clearer guidance on:
- write-path regressions across nightly versions,
- profiling/benchmark evidence for INSERT changes,
- observability around commit, compaction, and segment/block write behavior.

### 2) GROUPING() semantic correctness
- Issue [#19554](https://github.com/databendlabs/databend/issues/19554)
- PRs [#19592](https://github.com/databendlabs/databend/pull/19592) and [#19594](https://github.com/databendlabs/databend/pull/19594)

**Why it matters:**  
This shows Databend’s SQL compatibility work is deepening into edge semantics of analytical SQL. Invalid `GROUPING()` usage should produce semantic errors, not planner panics.

**Underlying technical need:**  
The engine needs stricter boundaries between:
- parse/semantic validation,
- aggregate rewrite,
- constant folding.

### 3) LIKE / ESCAPE panic cluster
Relevant items:
- Issue [#19562](https://github.com/databendlabs/databend/issues/19562)
- Issue [#19563](https://github.com/databendlabs/databend/issues/19563)
- Issue [#19561](https://github.com/databendlabs/databend/issues/19561)
- PRs [#19590](https://github.com/databendlabs/databend/pull/19590), [#19593](https://github.com/databendlabs/databend/pull/19593), [#19595](https://github.com/databendlabs/databend/pull/19595), [#19596](https://github.com/databendlabs/databend/pull/19596), [#19597](https://github.com/databendlabs/databend/pull/19597)

**Why it matters:**  
This is the strongest technical cluster of the day. Multiple independent edge cases in `LIKE` optimization, planner validation, and SQL display/roundtrip formatting were found almost simultaneously.

**Underlying technical need:**  
Databend is being pushed on standards-compatibility and roundtrip-safe SQL formatting. The work suggests maintainers are using broad logic-test imports to uncover hidden assumptions in planner fast paths and AST reserialization.

## 5. Bugs & Stability

Ranked by severity and likely user impact:

### Critical / High severity

1. **INSERT performance regression in nightly builds**
   - Issue: [#19481](https://github.com/databendlabs/databend/issues/19481)
   - Status: Open
   - Severity rationale: affects production ingestion performance; highest comment volume; likely impacts real workloads.
   - Fix PR: None visible in today’s PR set.

2. **Recursive views can crash `databend-query`**
   - Issue: [#19572](https://github.com/databendlabs/databend/issues/19572)
   - Status: Closed
   - Fix PR: [#19584](https://github.com/databendlabs/databend/pull/19584)
   - Severity rationale: process crash / `SIGSEGV`, direct service stability risk.
   - Outcome: addressed by preventing recursive view creation/alteration.

3. **Decorrelate optimizer panic with correlated subquery over `UNION`**
   - Issue: [#19574](https://github.com/databendlabs/databend/issues/19574)
   - Status: Open
   - Severity rationale: optimizer panic on valid-looking advanced SQL shape; affects analytical query coverage.
   - Fix PR: None listed today.

4. **Planner panic on full-range `UInt64` column stats**
   - Issue: [#19555](https://github.com/databendlabs/databend/issues/19555)
   - Status: Open
   - Fix PR: [#19591](https://github.com/databendlabs/databend/pull/19591)
   - Severity rationale: panic in planning/statistics path; can affect table scans on extreme value distributions.

### Medium severity

5. **`GROUPING()` invalid queries panic instead of returning semantic errors**
   - Issue: [#19554](https://github.com/databendlabs/databend/issues/19554)
   - Status: Open
   - Fix PRs: [#19592](https://github.com/databendlabs/databend/pull/19592), [#19594](https://github.com/databendlabs/databend/pull/19594)
   - Severity rationale: semantic correctness and SQL compatibility issue, not just parser cosmetics.

6. **`LIKE ... ESCAPE ''` planner panic**
   - Issue: [#19562](https://github.com/databendlabs/databend/issues/19562)
   - Status: Open
   - Fix PRs: [#19595](https://github.com/databendlabs/databend/pull/19595), [#19597](https://github.com/databendlabs/databend/pull/19597)

7. **`LIKE ... ESCAPE ''''` parser/display roundtrip panic**
   - Issue: [#19563](https://github.com/databendlabs/databend/issues/19563)
   - Status: Open
   - Fix PRs: [#19593](https://github.com/databendlabs/databend/pull/19593), [#19596](https://github.com/databendlabs/databend/pull/19596)

8. **`LIKE` constant folding panic with repeated `%`**
   - Issue: [#19561](https://github.com/databendlabs/databend/issues/19561)
   - Status: Open
   - Fix PR: [#19590](https://github.com/databendlabs/databend/pull/19590)

9. **BIGINT multiplication overflow panic**
   - Issue: [#19575](https://github.com/databendlabs/databend/issues/19575)
   - Status: Closed
   - Fix PR: [#19589](https://github.com/databendlabs/databend/pull/19589)

### Additional correctness/stability concerns still open
- **Result projection schema mismatch (`Nullable(Int64)` vs `Int64`)** — [#19568](https://github.com/databendlabs/databend/issues/19568)
- **IEJoin index out of bounds on empty result** — [#19569](https://github.com/databendlabs/databend/issues/19569)
- **ASOF Join panic on `UInt8` unsupported type unwrap** — [#19570](https://github.com/databendlabs/databend/issues/19570)
- **Parser panic on nested JOIN with multiple conditions** — [#19571](https://github.com/databendlabs/databend/issues/19571)

**Stability assessment:**  
The main risk area today is not broad storage failure but **SQL edge-case reliability in parser/planner/optimizer code paths**. The good sign is that many of these reports already have targeted PRs.

## 6. Feature Requests & Roadmap Signals

The strongest roadmap signal today is **improved file format control for staging and ingestion**:

- PR [#19588](https://github.com/databendlabs/databend/pull/19588) — **feat(stage): add TEXT file format params**
  - Adds `empty_field_as`
  - Adds `error_on_column_count_mismatch`

This is a meaningful usability feature for bulk loading and external stage compatibility. It suggests Databend is continuing to improve ingestion ergonomics for TSV/TEXT-style datasets, which is important for warehouse onboarding and migration scenarios.

Other roadmap-adjacent signals:
- PR [#19553](https://github.com/databendlabs/databend/pull/19553) — **support partitioned hash join**
  - Indicates continued investment in scalable join execution and distributed query performance.
- PR [#19576](https://github.com/databendlabs/databend/pull/19576) — **extract fuse block format abstraction**
  - Signals storage-layer modularization, likely to simplify read paths and future block-format evolution.
- PR [#19579](https://github.com/databendlabs/databend/pull/19579) — **Aggr bind refactor**
  - Suggests internal cleanup that may unlock more aggregate semantics or planner improvements later.

**Most likely next-version candidates:**
1. `LIKE` / `ESCAPE` correctness fixes
2. `GROUPING()` semantic validation
3. full-range stats overflow fix
4. TEXT stage format parameters
5. possibly parser/AST compatibility improvements already merged

## 7. User Feedback Summary

The most concrete user feedback today is around **performance regression on INSERT**:
- [#19481](https://github.com/databendlabs/databend/issues/19481)

This indicates users are actively testing or running Databend across nightly upgrades and are sensitive to ingestion throughput changes. That is a healthy sign of real-world usage, but also a warning that nightly performance variance is being noticed.

Broader feedback implied by issue patterns:
- Users and contributors care about **SQL compatibility with DuckDB-style logic tests**.
- Internal panics are being treated as unacceptable even for malformed SQL; users expect **semantic errors, not crashes**.
- Advanced SQL features like **ASOF join**, **range join (IEJoin)**, **decorrelation**, and **set operations** are now important enough that edge-case failures are being systematically surfaced.

Overall, satisfaction signals are mixed:
- **Positive:** maintainers are turning around fixes quickly.
- **Negative:** the volume of panic-class issues suggests current nightly builds still have rough edges in uncommon SQL shapes.

## 8. Backlog Watch

Items that appear important and still need maintainer attention:

### High-priority open items
- [#19481](https://github.com/databendlabs/databend/issues/19481) — INSERT performance regression  
  This is the most visible real-user-impact issue and currently lacks an obvious linked fix PR in today’s data.

- [#19574](https://github.com/databendlabs/databend/issues/19574) — decorrelate optimizer panic with correlated subquery over `UNION`  
  Important for advanced analytical SQL correctness; no visible fix PR yet.

- [#19568](https://github.com/databendlabs/databend/issues/19568) — result projection schema mismatch  
  Suggests execution/pipeline schema consistency problems, which can produce brittle runtime failures.

- [#19569](https://github.com/databendlabs/databend/issues/19569) — IEJoin index out of bounds on empty result  
  Join-engine edge case that should be guarded defensively.

- [#19570](https://github.com/databendlabs/databend/issues/19570) — ASOF Join panic on `UInt8`  
  Indicates unsupported type handling still leaks unwrap-based failures instead of planner validation.

- [#19571](https://github.com/databendlabs/databend/issues/19571) — SQL parser panic on nested JOIN with multiple conditions  
  Parser stability remains an area to watch, especially for imported compatibility suites.

### PRs to watch
- [#19553](https://github.com/databendlabs/databend/pull/19553) — partitioned hash join  
  Strategically important for query scalability.
- [#19576](https://github.com/databendlabs/databend/pull/19576) — fuse block format abstraction  
  High architectural value, likely broad impact.
- [#19588](https://github.com/databendlabs/databend/pull/19588) — TEXT file format params  
  Likely valuable to end users quickly.

## Overall Health Signal

Databend appears **highly active and responsive**, with strong maintainer throughput on bugfixes. The current workstream is dominated by **panic elimination, semantic validation, and SQL compatibility hardening**, which is healthy before a future release but also signals that nightly quality is under pressure from expanded test coverage. The single biggest unresolved product concern today is **INSERT performance regression**, while the most encouraging sign is the rapid conversion of multiple crash-class bugs into candidate fixes within a day.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-24

## 1. Today's Overview

Velox showed **high PR velocity and moderate issue activity** over the last 24 hours: **37 PRs updated**, **5 issues updated**, and **no new releases**. The strongest theme is continued investment in the **cuDF/GPU execution path**, with multiple new issues and PRs around missing GPU operators, benchmarking, decimal support, and function/operator coverage. On the stability side, the project quickly resolved a **build regression** tied to `HiveCommitMessage`, suggesting maintainers are responding quickly to breakages. Overall, project health looks active and forward-moving, with momentum concentrated in **GPU enablement, build reliability, and query engine correctness**.

## 2. Project Progress

### Merged/closed PRs today

#### Build stability fix landed for CentOS 9 / gflags runtime linking
- [PR #16817](https://github.com/facebookincubator/velox/pull/16817) — **Merged** — `fix(build): Register /usr/local/lib64 with ldconfig after gflags install on CentOS 9`
- Impact: improves **build and runtime portability** for downstream environments using CentOS Stream 9, avoiding shared library resolution failures in dependent tooling like `fbthrift`.
- Why it matters: this reduces friction for contributors and downstream integrators building Velox in CI or enterprise Linux environments.

#### HiveCommitMessage namespace build break fixed
- [PR #16884](https://github.com/facebookincubator/velox/pull/16884) — **Merged** — `fix(build): Use correct namespace for HiveCommitMessage`
- Related issue: [Issue #16883](https://github.com/facebookincubator/velox/issues/16883) — **Closed**
- Impact: restores build correctness after a refactor of JSON constants introduced namespace mismatch errors.
- Why it matters: while not a query-engine feature, this is important repository hygiene—fast repair of build breaks helps preserve contributor productivity and keeps mainline usable.

### Notable open work advancing engine/storage capabilities

Although not merged today, several active PRs indicate near-term progress in core engine functionality:

- [PR #16892](https://github.com/facebookincubator/velox/pull/16892) — GPU-accelerated **Window** operator via cuDF.
- [PR #16750](https://github.com/facebookincubator/velox/pull/16750) and [PR #16751](https://github.com/facebookincubator/velox/pull/16751) — GPU **Decimal** support, including functions and aggregate support (`SUM`, `AVG`).
- [PR #16875](https://github.com/facebookincubator/velox/pull/16875) — **Iceberg DWRF** data sink support for read/write paths.
- [PR #16611](https://github.com/facebookincubator/velox/pull/16611) — **Parquet type widening** for INT and Decimal schema evolution compatibility.
- [PR #13762](https://github.com/facebookincubator/velox/pull/13762) — nested-loop join optimization for more join types when build side is small.

These suggest current development is balancing **GPU execution breadth**, **lakehouse/storage format maturity**, and **engine efficiency/correctness**.

## 3. Community Hot Topics

### 1) Unifying cuDF operator architecture
- [Issue #16885](https://github.com/facebookincubator/velox/issues/16885) — **5 comments**
- Topic: introduce a **common base class** for cuDF operators instead of each directly inheriting from `exec::Operator` and `NvtxHelper`.
- Technical need: the GPU backend is reaching enough breadth that code duplication and operator lifecycle inconsistency are becoming maintenance costs. A shared abstraction would likely improve **operator reuse, observability, and consistency** across implementations like `CudfTopN`, `CudfLimit`, and `CudfOrderBy`.
- Signal: Velox-cuDF is moving from experimental feature addition toward **framework consolidation**.

### 2) GPU operator coverage for Presto TPC-DS
- [Issue #15772](https://github.com/facebookincubator/velox/issues/15772) — **4 comments**
- Topic: expand cuDF operator support to reduce CPU fallback during Presto TPC-DS SF100 runs.
- Technical need: this is a broad tracking issue for **end-to-end GPU execution completeness**. Current fallback behavior implies users can run workloads successfully, but not yet fully on GPU.
- Signal: benchmark-driven operator parity is clearly a roadmap priority.

### 3) GPU support for EnforceSingleRow
- [Issue #16888](https://github.com/facebookincubator/velox/issues/16888)
- Topic: add cuDF implementation for `EnforceSingleRow`, which reportedly appears **26 times** in TPC-DS SF100.
- Technical need: even "small" operators can materially affect overall GPU coverage if they occur frequently in production-style plans.
- Signal: Velox contributors are now closing **operator-frequency bottlenecks**, not just adding headline operators.

### 4) GPU Window operator development
- [PR #16892](https://github.com/facebookincubator/velox/pull/16892)
- Topic: add a GPU-accelerated `Window` operator using cuDF’s `grouped_rolling_window` API.
- Technical need: window functions are often among the hardest operators to accelerate due to partitioning, ordering, and frame semantics.
- Signal: if this lands, it would mark a major expansion in **GPU SQL operator completeness**.

### 5) Long-running join optimization work
- [PR #13762](https://github.com/facebookincubator/velox/pull/13762)
- Topic: optimize nested loop joins for more join types with a small build side.
- Technical need: improve performance for non-hash-join-friendly cases across inner, outer, and semi joins.
- Signal: core CPU engine optimization work continues in parallel with GPU efforts.

## 4. Bugs & Stability

Ranked by likely severity and user impact.

### High severity

#### MergeJoin correctness gap for full outer join with filter
- [PR #16891](https://github.com/facebookincubator/velox/pull/16891)
- Problem: MergeJoin reportedly does **not correctly handle full outer joins with filters**, dropping right-side miss rows when filter evaluation fails for a matched right row.
- Current action: the PR avoids generating this plan shape in the join fuzzer until a true fix exists.
- Severity rationale: this is a **query correctness** problem, which is generally more serious than crashes or performance regressions because it can silently return wrong results.
- Status: mitigation exists; root fix still pending.

#### HashProbe debug crash in ANTI join filter path
- [PR #16868](https://github.com/facebookincubator/velox/pull/16868)
- Problem: debug-only sanity check failure in `DictionaryVector::validate` during `HashProbe::evalFilter`, for ANTI joins with filters referencing a probe-side join key.
- Severity rationale: while debug-only, this points to a delicate correctness/invariant issue in join execution internals.
- Status: fix proposed.

### Medium severity

#### Build break: `HiveCommitMessage` undeclared
- [Issue #16883](https://github.com/facebookincubator/velox/issues/16883)  
- [PR #16884](https://github.com/facebookincubator/velox/pull/16884)
- Problem: namespace mismatch after JSON constants refactor caused compile failures.
- Severity rationale: impacted buildability but was quickly fixed the same day.
- Status: resolved.

#### Lazy probe input loading / memory reclaim interaction
- [PR #16774](https://github.com/facebookincubator/velox/pull/16774)
- Problem: lazy loading during probe loops could interact poorly with memory arbitration/reclaim, causing failures in some execution paths.
- Severity rationale: likely affects **runtime stability under memory pressure**.
- Status: fix open.

#### cuDF buffered input data source path not using `enqueueForDevice`
- [PR #16732](https://github.com/facebookincubator/velox/pull/16732)
- Problem: hybrid scan reader path needed reintroduction of `enqueueForDevice`.
- Severity rationale: mostly a **GPU I/O correctness/performance** issue rather than broad engine instability, but important for cuDF users.
- Status: fix open.

## 5. Feature Requests & Roadmap Signals

### Strongest roadmap theme: broader and more maintainable GPU execution

#### Common cuDF operator base class
- [Issue #16885](https://github.com/facebookincubator/velox/issues/16885)
- Likely outcome: improves maintainability and may accelerate future GPU operator additions.

#### Fill GPU operator gaps for benchmark parity
- [Issue #15772](https://github.com/facebookincubator/velox/issues/15772)
- [Issue #16888](https://github.com/facebookincubator/velox/issues/16888)
- Prediction: targeted operators from TPC-DS workloads are likely to be prioritized in the next release cycle, especially those with high plan frequency.

#### Host-memory mode for `CudfTpchBenchmark`
- [Issue #16890](https://github.com/facebookincubator/velox/issues/16890)
- Motivation: benchmark isolation from local I/O bottlenecks.
- Prediction: likely to land soon because it supports better **performance measurement discipline** for cuDF work.

### SQL/function compatibility expansion

#### GPU expressions: `date_diff` and `to_unixtime`
- [PR #16889](https://github.com/facebookincubator/velox/pull/16889)
- These are practical SQL function additions for GPU execution, useful for Presto-style workloads.

#### Presto function: `array_least_frequent`
- [PR #16487](https://github.com/facebookincubator/velox/pull/16487)
- Signal: ongoing effort to close SQL surface-area gaps.

#### Type system extension: `VarcharN` / `VarbinaryN`
- [PR #10727](https://github.com/facebookincubator/velox/pull/10727)
- Signal: long-horizon compatibility work for richer type semantics.

### Storage and format roadmap

#### Iceberg + DWRF sink support
- [PR #16875](https://github.com/facebookincubator/velox/pull/16875)
- This is a strong signal of growing **lakehouse write-path maturity**.

#### Parquet type widening / schema evolution
- [PR #16611](https://github.com/facebookincubator/velox/pull/16611)
- Likely valuable for Spark interoperability and evolving datasets.
- Prediction: this is a good candidate for the next version if review proceeds, because schema evolution support has broad user value.

## 6. User Feedback Summary

Based on today’s issue/PR traffic, the clearest user pain points are:

- **GPU fallback remains too frequent** for realistic Presto TPC-DS runs.
  - Evidence: [Issue #15772](https://github.com/facebookincubator/velox/issues/15772), [Issue #16888](https://github.com/facebookincubator/velox/issues/16888)
  - Users appear satisfied that CPU fallback exists as a safety net, but want more queries to stay fully on GPU for performance consistency.

- **Benchmarking is increasingly limited by I/O rather than compute** in local/dev setups.
  - Evidence: [Issue #16890](https://github.com/facebookincubator/velox/issues/16890)
  - This suggests cuDF operator performance has improved enough that benchmark methodology now matters more.

- **Build reliability matters to contributors and downstream adopters.**
  - Evidence: [Issue #16883](https://github.com/facebookincubator/velox/issues/16883), [PR #16817](https://github.com/facebookincubator/velox/pull/16817)
  - Quick fixes indicate maintainers recognize build regressions as high-priority developer experience issues.

- **Correctness edge cases in join processing remain an area to watch.**
  - Evidence: [PR #16891](https://github.com/facebookincubator/velox/pull/16891), [PR #16868](https://github.com/facebookincubator/velox/pull/16868)
  - These reports imply advanced join/filter combinations still expose subtle engine issues.

## 7. Backlog Watch

### Long-running or important items needing maintainer attention

#### Nested loop join optimization PR
- [PR #13762](https://github.com/facebookincubator/velox/pull/13762)
- Open since **2025-06-13**
- Importance: broadens performance optimization across multiple join types.
- Watchpoint: this is strategically important engine work that appears to have remained open for a long time.

#### `VarcharN` / `VarbinaryN` support
- [PR #10727](https://github.com/facebookincubator/velox/pull/10727)
- Open since **2024-08-12**
- Importance: deeper type-system and compatibility feature, but still marked WIP with outstanding follow-up areas.
- Watchpoint: likely needs product direction and maintainer sponsorship, not just code review.

#### GPU TPC-DS benchmark infrastructure
- [PR #16357](https://github.com/facebookincubator/velox/pull/16357)
- Open since **2026-02-12**
- Importance: foundational for measuring progress in GPU query coverage and performance.
- Watchpoint: should receive attention because it supports many cuDF roadmap items.

#### GPU Decimal implementation series
- [PR #16750](https://github.com/facebookincubator/velox/pull/16750)
- [PR #16751](https://github.com/facebookincubator/velox/pull/16751)
- Importance: decimal support is often essential for BI, finance, and SQL compatibility.
- Watchpoint: landing the remaining pieces would materially improve real-world GPU applicability.

## 8. Overall Health Assessment

Velox is in a **healthy, high-activity development phase** with especially strong momentum around **GPU acceleration and analytical format support**. The project also demonstrated good responsiveness to **build regressions**, which is a positive operational signal. The main technical risk visible today is not inactivity but rather the accumulation of **subtle correctness edge cases** in joins and the ongoing need to finish long-lived feature work. If current PRs land, the next version is likely to show meaningful gains in **cuDF operator coverage, benchmark maturity, Parquet/Iceberg interoperability, and SQL function support**.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-24

## 1. Today's Overview

Apache Gluten remained fairly active over the last 24 hours, with **11 issues updated** and **14 pull requests updated**, indicating steady engineering throughput rather than a release-focused day. Most visible work centered on the **Velox backend**, especially **Spark 4.x test recovery**, **TIMESTAMP_NTZ type support**, **shuffle/dynamic-filter infrastructure**, and **small but important config and execution-path cleanup**. The day also showed good closure velocity: **7 issues were closed** and **4 PRs were merged/closed**, suggesting maintainers are actively trimming technical debt and converting investigations into concrete fixes. Overall, project health looks solid, with current effort split between **stability hardening**, **SQL compatibility**, and **performance-oriented execution improvements**.

---

## 3. Project Progress

### Merged / closed PRs today

#### 1) Hive table scan file-format detection optimization landed
- PR: [#11798](https://github.com/apache/incubator-gluten/pull/11798) — **[CORE] Improve the performance of `getDistinctPartitionReadFileFormats` for `HiveTableScanExecTransformer`**
- Related issue: [#11797](https://github.com/apache/incubator-gluten/issues/11797)

This is a concrete storage/query planning optimization. The change reduces repeated expensive partition-to-Hive conversion work, avoids redundant traversals, and improves format-detection efficiency for partitioned Hive scans. This should help workloads with large partition counts, where metadata handling overhead can become non-trivial before actual scan execution starts.

#### 2) Spark 4.0/4.1 test infrastructure corrected
- PR: [#11800](https://github.com/apache/incubator-gluten/pull/11800) — **Replace `GlutenTestsCommonTrait` with correct Gluten test traits for Spark 4.0/4.1**
- Tracker issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550)

This is an important correctness/stability milestone. The prior test trait setup did **not actually enable GlutenPlugin**, meaning some suites were running on vanilla Spark while appearing to validate Gluten behavior. Fixing this improves trust in Spark 4.x compatibility reporting and should prevent false confidence around offload coverage.

#### 3) Additional Spark 4.x suites re-enabled
- PR: [#11812](https://github.com/apache/incubator-gluten/pull/11812) — **Enable `GlutenMergeIntoDataFrameSuite` and `GlutenSparkSessionJobTaggingAndCancellationSuite`**
- Tracker issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550)

This continues the Spark 4.x stabilization push. Re-enabling disabled suites means practical progress on compatibility, especially around **MERGE INTO behavior** and **session/job management semantics**, both of which matter for enterprise Spark deployments.

#### 4) Dynamic filter pushdown to ValueStream closed
- PR: [#11657](https://github.com/apache/incubator-gluten/pull/11657) — **[VL] Push dynamic filters down to ValueStream**

Although closed rather than explicitly marked merged in the supplied data, this PR is notable because it targets a high-value performance path: reducing shuffle materialization by propagating probe-side filters upstream. Together with the still-open prerequisite/statistics work in [#11769](https://github.com/apache/incubator-gluten/pull/11769), it signals ongoing investment in **shuffle-aware pruning** and **late-stage data reduction** in the Velox backend.

### Closed issues indicating progress
Several older enhancement/cleanup items were closed today, suggesting maintainers are resolving previously identified gaps:
- [#9836](https://github.com/apache/incubator-gluten/issues/9836) — duplicate Arrow/shuffle memory pool discussion
- [#11503](https://github.com/apache/incubator-gluten/issues/11503) — Delta Lake partitioned write still having a C2R converter
- [#11471](https://github.com/apache/incubator-gluten/issues/11471) — fallbacked project in liquid-cluster Delta write
- [#4392](https://github.com/apache/incubator-gluten/issues/4392) — stage-level resource management for offheap/onheap conflict
- [#8226](https://github.com/apache/incubator-gluten/issues/8226) — 2025 roadmap thread closed

These closures suggest work is converging on cleanup of fallback paths, memory abstractions, and roadmap reshaping.

---

## 4. Community Hot Topics

### 1) 2025 roadmap discussion
- Issue: [#8226](https://github.com/apache/incubator-gluten/issues/8226)
- Activity: **22 comments, 34 👍**

This remains the strongest signal of community priorities even though it was closed today. The high engagement implies users and contributors still care most about broad roadmap themes such as **Spark 4.0 support**, backend maturity, and execution coverage. Closing it likely means those themes have now been absorbed into newer trackers and implementation PRs.

### 2) Unmerged Velox upstream PR tracker
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)
- Activity: **16 comments, 4 👍**
- Link: [#11585](https://github.com/apache/incubator-gluten/issues/11585)

This is strategically important. It highlights a recurring ecosystem need: Gluten depends on useful Velox changes that are not yet upstreamed, but the project wants to avoid excessive fork/rebase burden. The technical need underneath is clear: **faster synchronization between Gluten feature work and upstream Velox capabilities**, especially for performance and compatibility patches.

### 3) Stage-level memory/resource management
- Issue: [#4392](https://github.com/apache/incubator-gluten/issues/4392)
- Activity: **16 comments**
- Link: [#4392](https://github.com/apache/incubator-gluten/issues/4392)

Even though closed, this topic reflects a deep architectural concern: mixed native and fallback execution can create **off-heap vs on-heap memory contention**. This remains one of the key practical barriers in hybrid execution engines. The sustained discussion indicates users are running real workloads where fallback is unavoidable and resource isolation matters.

### 4) Spark 4.x disabled-test tracker
- Issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550)
- Activity: **6 comments**
- Link: [#11550](https://github.com/apache/incubator-gluten/issues/11550)

This tracker is an active coordination point for restoring Spark 4.x quality. With follow-up PRs [#11800](https://github.com/apache/incubator-gluten/pull/11800), [#11812](https://github.com/apache/incubator-gluten/pull/11812), and [#11805](https://github.com/apache/incubator-gluten/pull/11805), this is currently one of the clearest signs of short-term maintainer focus.

### 5) TIMESTAMP_NTZ support
- Issue: [#11622](https://github.com/apache/incubator-gluten/issues/11622)
- PR: [#11626](https://github.com/apache/incubator-gluten/pull/11626)

This is a technically important SQL compatibility topic. The issue description explicitly calls out semantic differences between Spark and Presto timestamp handling despite common Velox internals. The need here is not merely adding a type token; it is ensuring **correct semantics across engines**, which is crucial for analytics correctness and cross-engine interoperability.

---

## 5. Bugs & Stability

Ranked by likely severity based on the supplied data:

### High severity

#### 1) BHJ-caused stack overflow
- Issue: [#9671](https://github.com/apache/incubator-gluten/issues/9671) — **[VL] BHJ caused stackoverflow**
- Status: **Closed**

A stack overflow in **broadcast hash join** is potentially severe because it can crash query execution in a common join path. The logs mention fatal errors around broadcast exchange, which points to execution robustness issues in join materialization or recursion. Since the issue is closed, this likely means either a fix landed earlier or the root cause was resolved indirectly, but the supplied data does not list a dedicated fix PR updated today.

### Medium severity

#### 2) Disabled Spark 4.x suites reveal compatibility regressions
- Issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550)
- Fix-related PRs:
  - [#11800](https://github.com/apache/incubator-gluten/pull/11800)
  - [#11812](https://github.com/apache/incubator-gluten/pull/11812)
  - [#11805](https://github.com/apache/incubator-gluten/pull/11805)

This is less of a crash bug and more of a validation/stability risk. Incorrect test harness configuration meant some compatibility claims could be overstated. The good news is there is active, multi-PR remediation in progress.

#### 3) Dead/misleading S3 timeout config
- Issue: [#11809](https://github.com/apache/incubator-gluten/issues/11809)
- Fix PR: [#11810](https://github.com/apache/incubator-gluten/pull/11810)

This is operationally significant. Misleading configs can waste debugging time and cause deployment confusion, especially in object-store-heavy environments. The fix is already in flight, which lowers risk.

### Lower severity but notable correctness/performance concerns

#### 4) Delta Lake writes still using unwanted conversion / fallback paths
- Issues:
  - [#11503](https://github.com/apache/incubator-gluten/issues/11503)
  - [#11471](https://github.com/apache/incubator-gluten/issues/11471)
- Status: **Closed**

These point to incomplete native write coverage in Delta workflows, especially partitioned writes and liquid clustering expressions. While closed, they reinforce that **write-path parity** is still an active area.

#### 5) Duplicate memory pool abstractions
- Issue: [#9836](https://github.com/apache/incubator-gluten/issues/9836)
- Status: **Closed**

This is mostly internal technical debt, but memory subsystem duplication can lead to fragmentation of ownership and inconsistent accounting.

---

## 6. Feature Requests & Roadmap Signals

### Strongest signals from current activity

#### 1) Full TIMESTAMP_NTZ support is likely to land soon
- Issue: [#11622](https://github.com/apache/incubator-gluten/issues/11622)
- PR: [#11626](https://github.com/apache/incubator-gluten/pull/11626)

Because there is already an implementation PR open and active, this is one of the clearest candidates for the next version. It improves Spark SQL type compatibility, especially for users moving modern Spark workloads onto Velox-backed execution.

#### 2) `approx_percentile` support is a meaningful SQL-function expansion
- PR: [#11651](https://github.com/apache/incubator-gluten/pull/11651)

This is a strategically valuable feature because percentile aggregations are common in analytics. The nuance is that Spark and Velox use different sketch algorithms (GK vs KLL), so native support has implications for **fallback compatibility**, **intermediate-state representation**, and **cross-stage execution semantics**. If merged carefully, this could materially improve native aggregate coverage.

#### 3) Dynamic-filter/shuffle pruning pipeline is a major medium-term performance theme
- PRs:
  - [#11769](https://github.com/apache/incubator-gluten/pull/11769)
  - [#11657](https://github.com/apache/incubator-gluten/pull/11657)

These indicate work on **block-level pruning** and **statistics-aware shuffle reads**, which is exactly the kind of optimization that can produce large wins on selective joins. This feels like a likely near-term differentiator for Velox backend performance.

#### 4) Execute-collect path completion in columnar limit
- PR: [#11802](https://github.com/apache/incubator-gluten/pull/11802)

This targets execution completeness rather than headline features. Implementing `executeCollect()` in `ColumnarCollectLimitExec` should improve compatibility with Spark actions and narrow edge-case fallback behavior.

#### 5) DBI executor scheduling improvements
- PR: [#11811](https://github.com/apache/incubator-gluten/pull/11811)

Switching to `CPUThreadPoolExecutor` suggests maintainers are tuning low-level execution scheduling to avoid self-thread submission issues or event-loop inefficiencies. This is a strong sign of backend maturation.

### Prediction for next version
Most likely inclusions, based on implementation maturity:
1. **TIMESTAMP_NTZ basic support**
2. **More Spark 4.x test re-enablement and compatibility fixes**
3. **Config cleanup and operational polish**
4. **Incremental shuffle/dynamic-filter infrastructure**
5. Potentially **`approx_percentile`** if semantic/fallback concerns are resolved

---

## 7. User Feedback Summary

### Main user pain points visible today

#### Spark 4.x compatibility confidence
The most visible pain point is not one isolated crash but confidence in whether Gluten truly supports Spark 4.x behavior. The test tracker and follow-up PRs show users need **reliable validation**, not just nominal support claims.

#### Timestamp semantic correctness
The TIMESTAMP_NTZ thread shows users care about subtle SQL semantics, especially where Spark and Presto/Velox name similar types but define them differently. This is a classic analytics-engine adoption blocker: users will accept some missing features, but not silent time semantics drift.

#### Hybrid execution memory conflicts
The stage-level resource management discussion reflects real-world friction in mixed native/fallback execution. Users appear to be running workloads where some operators are native and others fall back, creating memory management tension between Spark JVM heap and native off-heap consumers.

#### Native coverage gaps in Delta Lake write paths
The closed Delta-related issues suggest users still notice where write paths retain **columnar-to-row conversions** or **fallbacked projections**. For lakehouse users, native read acceleration alone is not enough; they want end-to-end write-path efficiency too.

#### Operational clarity for object storage
The dead S3 config issue shows another recurring enterprise need: if a config exists, users assume it works. Misleading knobs can directly slow production troubleshooting.

### Positive signals
There is also implicit positive feedback: several issues are being closed not because of inactivity, but because maintainers are cleaning up long-standing limitations and restoring tests. That indicates a responsive project rather than one accumulating unattended defects.

---

## 8. Backlog Watch

These are the most important open items that appear to need sustained maintainer attention:

### 1) Velox upstream gap tracker
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)

This is strategically important for long-term maintainability. If useful Velox changes remain unmerged upstream for too long, Gluten risks feature drag, custom patch overhead, and harder rebases.

### 2) TIMESTAMP_NTZ support
- Issue: [#11622](https://github.com/apache/incubator-gluten/issues/11622)
- PR: [#11626](https://github.com/apache/incubator-gluten/pull/11626)

This should stay high priority because it affects SQL correctness and compatibility, not just performance.

### 3) Spark 4.x disabled test suite tracker
- Issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550)

This remains the clearest quality gate for broader Spark 4.x readiness. It deserves continued maintainer coordination until disabled suites are either fixed, justified, or permanently scoped out.

### 4) `approx_percentile` support PR
- PR: [#11651](https://github.com/apache/incubator-gluten/pull/11651)

This PR likely needs careful review due to cross-engine aggregation semantics and fallback compatibility. It is high-value but also subtle.

### 5) Shuffle statistics / dynamic filtering work
- PR: [#11769](https://github.com/apache/incubator-gluten/pull/11769)

This appears promising for performance, but features at this layer often require careful validation for correctness, memory overhead, and interoperability with existing shuffle readers/writers.

---

## Overall Assessment

Apache Gluten appears healthy and actively maintained on 2026-03-24. The strongest signals are:
- **continued Velox backend investment**
- **Spark 4.x compatibility hardening**
- **incremental SQL/type coverage expansion**
- **practical execution/storage optimizations**

No release was cut today, but the project is making meaningful progress on the kinds of changes that usually precede a stronger backend-focused release: better test fidelity, better SQL compatibility, lower metadata overhead, and more efficient shuffle/runtime behavior.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-24

## 1) Today's Overview

Apache Arrow remained highly active over the last 24 hours, with **23 issues updated** and **28 pull requests updated**, indicating steady maintainer and contributor throughput. Activity was concentrated in **C++ core, FlightRPC/ODBC, Python, R, CI, and Parquet**, with a notable cluster of work around **Flight SQL ODBC portability across Linux/macOS**. No new releases were published, so the day’s signal comes from implementation progress, bug triage, and infrastructure hardening rather than packaged delivery. Overall project health looks solid: several recent regressions were closed quickly, while a number of older enhancement issues were mechanically closed via stale handling, which keeps backlog hygiene improving but also leaves some long-term asks unresolved.

## 3) Project Progress

Merged/closed work today mostly advanced **build stability, driver compatibility, and defensive correctness** rather than end-user APIs.

- **xsimd/macOS build compatibility fixed**
  - Closed issue: [#49579](https://github.com/apache/arrow/issues/49579)
  - Closed PR: [#49580](https://github.com/apache/arrow/pull/49580)
  - Impact: restores C++ buildability on macOS with **xsimd 14.1.0**, reducing upgrade friction for SIMD-enabled builds and downstream packagers.

- **Apple/macOS CI compiler compatibility addressed**
  - Closed issue: [#49569](https://github.com/apache/arrow/issues/49569)
  - Closed PR: [#49570](https://github.com/apache/arrow/pull/49570)
  - Impact: resolves CI/compiler breakage around `std::log2p1` availability, improving portability of C++/Python builds on newer Apple toolchains.

- **Parquet geometry parsing hardened against stack overflow**
  - Closed issue: [#49559](https://github.com/apache/arrow/issues/49559)
  - Closed PR: [#49558](https://github.com/apache/arrow/pull/49558)
  - Impact: adds recursion-depth protection for deeply nested WKB `GeometryCollection` inputs in Parquet-related code paths. This is an important **robustness and potential security hardening** improvement for malformed/extreme inputs.

- **Flight SQL ODBC test-suite correctness cleanup**
  - Closed issue: [#49561](https://github.com/apache/arrow/issues/49561)
  - Closed PR: [#49562](https://github.com/apache/arrow/pull/49562)
  - Impact: improves wide-string handling in FlightRPC/ODBC tests using `SQLWCHAR` arrays, helping Windows/ODBC correctness and future cross-platform work.

- **R CI/devdocs reliability improvement**
  - Closed PR: [#49381](https://github.com/apache/arrow/pull/49381)
  - Impact: removes hidden CI behavior that pulled released `libarrow-dev`, reducing version skew during the gap between C++ and R releases.

- **Documentation/process update landed**
  - Closed PR: [#48952](https://github.com/apache/arrow/pull/48952)
  - Impact: adds AI tooling guidance, which is process-oriented but useful for contributor consistency.

Net/net: today’s merged work mainly improved **build resilience, parser safety, and connector/test infrastructure**, especially around **Flight SQL ODBC** and **macOS toolchains**.

## 4) Community Hot Topics

### A. Python decimal arithmetic correctness
- Issue: [#43252](https://github.com/apache/arrow/issues/43252) — **[Python] Error thrown when multiplying decimal numbers**
- Why it matters: decimal correctness is critical for analytical workloads involving **financial calculations, exact aggregations, and SQL-like compute semantics**. Failures in decimal multiplication undermine confidence in Arrow compute for precision-sensitive pipelines.
- Signal: among the updated issues, this is one of the more substantive open correctness bugs with relatively high discussion.

### B. R cloud connector expansion: Azure Blob filesystem
- PR: [#49553](https://github.com/apache/arrow/pull/49553) — **[R] Expose azure blob filesystem**
- Underlying need: users increasingly expect Arrow dataset/file APIs to support **multi-cloud object storage** consistently across Python, R, and C++. Bringing Azure support to R closes a notable ecosystem gap versus PyArrow and strengthens Arrow as a cross-language data access layer.

### C. Flight SQL ODBC on Linux/Debian/Ubuntu
- PR: [#49564](https://github.com/apache/arrow/pull/49564) — **[C++][FlightRPC] Add Ubuntu ODBC Support**
- PR: [#49583](https://github.com/apache/arrow/pull/49583) — **[C++][FlightRPC] Add ODBC Debian support**
- PR: [#49585](https://github.com/apache/arrow/pull/49585) — **Draft: static build of ODBC FlightSQL driver**
- Long-running PR: [#46099](https://github.com/apache/arrow/pull/46099) — **Arrow Flight SQL ODBC layer**
- Issue: [#49582](https://github.com/apache/arrow/issues/49582) — **Enable ODBC build on Debian**
- Underlying need: this is the strongest roadmap cluster today. It points to heavy demand for **standard SQL connectivity into Arrow Flight SQL**, especially for BI tools, legacy applications, and enterprise Linux environments where ODBC remains mandatory.

### D. Python API simplification and cleanup
- Issue: [#49232](https://github.com/apache/arrow/issues/49232) — **[Python] Deprecate Feather reader and writer**
- Issue: [#49255](https://github.com/apache/arrow/issues/49255) — **Fix DeprecationWarnings in PyArrow tests**
- Underlying need: maintainers are signaling a desire to **reduce legacy surface area** and align APIs with current usage patterns, while also preparing code/tests for newer pandas and Python ecosystems.

### E. Documentation navigation and interoperability visibility
- PR: [#49550](https://github.com/apache/arrow/pull/49550) — **[Docs] PyCapsule protocol implementation status**
- PR: [#49557](https://github.com/apache/arrow/pull/49557) — **[Docs][Python] Add nested grouping to Python docs TOC**
- Underlying need: users want Arrow’s interoperability story to be easier to discover, and the Python docs are now large enough that information architecture is becoming a usability concern.

## 5) Bugs & Stability

Ranked by likely severity/impact:

### 1. Decimal multiplication error in PyArrow compute
- Open issue: [#43252](https://github.com/apache/arrow/issues/43252)
- Severity: **High**
- Why: affects **query correctness / exact arithmetic**, especially for analytics and finance use cases.
- Fix status: no linked fix PR in today’s data.

### 2. CUDA Python nightly failures due to context API mismatch
- Open issue: [#49437](https://github.com/apache/arrow/issues/49437)
- Link: [#49437](https://github.com/apache/arrow/issues/49437)
- Severity: **High** for GPU users, **Medium** project-wide
- Why: nightly failures indicate integration breakage with CUDA Python bindings (`CUcontext` attribute mismatch), potentially blocking GPU CI and reducing confidence in CUDA support.
- Fix status: no fix PR shown today.

### 3. Stack overflow on deeply nested WKB GeometryCollection
- Closed issue: [#49559](https://github.com/apache/arrow/issues/49559)
- Fix PR: [#49558](https://github.com/apache/arrow/pull/49558)
- Severity: **Medium-High**
- Why: can crash parsing on pathological inputs; important defensive fix for Parquet/geospatial consumers.
- Status: fixed/closed.

### 4. xsimd 14.1.0 macOS build failure
- Closed issue: [#49579](https://github.com/apache/arrow/issues/49579)
- Fix PR: [#49580](https://github.com/apache/arrow/pull/49580)
- Severity: **Medium**
- Why: blocks builds for some C++ users and CI environments.
- Status: fixed quickly, good sign for responsiveness.

### 5. macOS 14 `std::log2p1` build failure
- Closed issue: [#49569](https://github.com/apache/arrow/issues/49569)
- Fix PR: [#49570](https://github.com/apache/arrow/pull/49570)
- Severity: **Medium**
- Why: compiler/platform regression affecting C++ and Python build jobs.
- Status: fixed.

### 6. Flight SQL JDBC missing per-batch metadata exposure
- Closed issue: [#49584](https://github.com/apache/arrow/issues/49584)
- Severity: **Medium**
- Why: this is more a capability gap than a crash, but it affects **SQL client semantics and metadata propagation** in Java Flight SQL integrations.
- Fix status: issue closed same day; no PR included in the provided data.

## 6) Feature Requests & Roadmap Signals

### Strongest roadmap signals

#### Flight SQL ODBC cross-platform expansion
- Issue: [#49582](https://github.com/apache/arrow/issues/49582)
- PRs: [#46099](https://github.com/apache/arrow/pull/46099), [#49564](https://github.com/apache/arrow/pull/49564), [#49583](https://github.com/apache/arrow/pull/49583), [#49585](https://github.com/apache/arrow/pull/49585)
- Prediction: **likely to land incrementally in the next release(s)**, at least in CI/build support form for Ubuntu/Debian, because there is a concentrated multi-PR push with active maintainer attention.

#### R Azure Blob filesystem support
- PR: [#49553](https://github.com/apache/arrow/pull/49553)
- Prediction: **good chance for near-term inclusion**, as the underlying C++ and Python support already exists and this is mostly language-surface enablement.

#### Parquet writer observability / buffering API
- PR: [#49527](https://github.com/apache/arrow/pull/49527) — `estimated_buffered_stats()` for `RowGroupWriter`
- Prediction: likely useful for **storage tuning and adaptive row-group sizing**, making it a meaningful enhancement for data lake writers and ingestion systems.

#### Compute correctness in ranking with NaNs/nulls
- PR: [#49304](https://github.com/apache/arrow/pull/49304)
- Prediction: plausible next-version material, since it addresses **query semantics** and aligns ranking behavior with Arrow sorting conventions.

### Other notable requests

- [#30950](https://github.com/apache/arrow/issues/30950) — `table.drop_duplicates()` in Python  
  Longstanding user-facing API ask; closed stale, but the demand reflects need for **DataFrame-like ergonomics** in PyArrow tables.

- [#31528](https://github.com/apache/arrow/issues/31528) — reduce memory usage when writing IPC  
  Important for **large-batch serialization efficiency** and memory-bounded systems; still open and relevant.

- [#31510](https://github.com/apache/arrow/issues/31510) — exact TPC-H data generation  
  Niche but important for **benchmark reproducibility and validation**.

- [#31516](https://github.com/apache/arrow/issues/31516) — filename-based partitioning in R  
  Useful for data lake ingestion workflows; still pending.

- [#31525](https://github.com/apache/arrow/issues/31525) — filtering on augmented fields in scanner  
  Relevant to **dataset query usability**.

- [#31522](https://github.com/apache/arrow/issues/31522) — struct field reordering via cast  
  Important for schema evolution and nested query handling.

## 7) User Feedback Summary

Current user pain points cluster around four themes:

1. **Platform compatibility and packaging**
   - macOS toolchain changes, xsimd version churn, Windows ARM64 work, and Debian/Ubuntu ODBC enablement all show users need Arrow to remain easy to build and consume across modern heterogeneous environments.
   - Relevant PRs/issues: [#49580](https://github.com/apache/arrow/pull/49580), [#49570](https://github.com/apache/arrow/pull/49570), [#48539](https://github.com/apache/arrow/pull/48539), [#49564](https://github.com/apache/arrow/pull/49564), [#49583](https://github.com/apache/arrow/pull/49583)

2. **SQL/connector interoperability**
   - Flight SQL ODBC work and the JDBC metadata issue indicate real demand for Arrow as a **transport/connectivity layer for SQL tools**, not just an in-memory format.
   - Relevant: [#46099](https://github.com/apache/arrow/pull/46099), [#49582](https://github.com/apache/arrow/issues/49582), [#49584](https://github.com/apache/arrow/issues/49584)

3. **Correctness in analytical compute**
   - Decimal multiplication bugs and rank semantics around NaNs/nulls are exactly the kinds of issues that matter in analytical engines.
   - Relevant: [#43252](https://github.com/apache/arrow/issues/43252), [#49304](https://github.com/apache/arrow/pull/49304)

4. **Cloud-native and data lake workflows**
   - Azure Blob support in R and requests around partitioning/filtering/schema handling show continued use of Arrow in **dataset scanning and object-store-backed analytics**.
   - Relevant: [#49553](https://github.com/apache/arrow/pull/49553), [#31516](https://github.com/apache/arrow/issues/31516), [#31525](https://github.com/apache/arrow/issues/31525)

A softer but clear signal is also visible around **documentation usability**: as Arrow grows, discoverability of interoperability features and Python docs structure is becoming a real concern.

## 8) Backlog Watch

These older items still look important and merit maintainer attention despite low recent momentum:

- [#31528](https://github.com/apache/arrow/issues/31528) — **[C++] Reduce memory usage when writing to IPC**
  - Why watch: meaningful storage/serialization optimization with potential impact on large record batch handling and memory-constrained execution.

- [#31525](https://github.com/apache/arrow/issues/31525) — **ScannerBuilder::Filter returns an error when given an augmented field**
  - Why watch: affects dataset query expressiveness, especially around virtual/derived file metadata columns.

- [#31522](https://github.com/apache/arrow/issues/31522) — **Allow reordering fields of a StructArray via casting**
  - Why watch: schema evolution and nested-field handling remain recurring challenges in analytics engines.

- [#31516](https://github.com/apache/arrow/issues/31516) — **[R] Support for filename-based partitioning**
  - Why watch: important for practical lakehouse ingestion patterns.

- [#31510](https://github.com/apache/arrow/issues/31510) — **Generate TPC-H data matching reference data exactly**
  - Why watch: benchmark fidelity matters for performance claims and regression testing.

- [#48710](https://github.com/apache/arrow/pull/48710) — **Move Arange utility function to Arrow C++**
  - Why watch: cross-language utility consolidation is useful but this PR has been open for some time.

- [#48539](https://github.com/apache/arrow/pull/48539) — **Build PyArrow on Windows ARM64**
  - Why watch: strategic platform support item with growing ecosystem relevance.

- [#46099](https://github.com/apache/arrow/pull/46099) — **Arrow Flight SQL ODBC layer**
  - Why watch: major interoperability feature with clear enterprise demand; deserves sustained review bandwidth.

## Links index

A selection of key items referenced above:

- Issue [#43252](https://github.com/apache/arrow/issues/43252)
- Issue [#49437](https://github.com/apache/arrow/issues/49437)
- Issue [#49579](https://github.com/apache/arrow/issues/49579)
- PR [#49580](https://github.com/apache/arrow/pull/49580)
- Issue [#49569](https://github.com/apache/arrow/issues/49569)
- PR [#49570](https://github.com/apache/arrow/pull/49570)
- Issue [#49559](https://github.com/apache/arrow/issues/49559)
- PR [#49558](https://github.com/apache/arrow/pull/49558)
- PR [#49553](https://github.com/apache/arrow/pull/49553)
- PR [#49564](https://github.com/apache/arrow/pull/49564)
- PR [#49583](https://github.com/apache/arrow/pull/49583)
- PR [#49585](https://github.com/apache/arrow/pull/49585)
- PR [#46099](https://github.com/apache/arrow/pull/46099)
- PR [#49304](https://github.com/apache/arrow/pull/49304)
- PR [#49527](https://github.com/apache/arrow/pull/49527)

If you want, I can also turn this into a **short executive summary**, a **Slack-style daily update**, or a **more OLAP-engine-focused digest** emphasizing compute, Parquet, Flight SQL, and dataset scanning only.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*