# Apache Doris Ecosystem Digest 2026-04-05

> Issues: 2 | PRs: 29 | Projects covered: 10 | Generated: 2026-04-05 01:44 UTC

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

# Apache Doris Project Digest — 2026-04-05

## 1. Today's Overview

Apache Doris showed **high pull request activity** over the last 24 hours, with **29 PRs updated** and **12 merged/closed**, while issue activity was light at **2 active issues** and no closures. The day’s engineering focus was clearly on **query correctness, JDBC/TVF compatibility, profile observability, FE concurrency safety, and cloud/storage memory optimization**. No new releases were published, so current signals come mainly from code movement rather than packaged milestones. Overall, project health looks **active and implementation-driven**, though several user-facing bugs around **memory behavior, ingest performance, and query correctness** deserve close attention.

## 2. Project Progress

### Merged/closed PRs today

#### Query engine and scan correctness
- **Preserve IN_LIST runtime filter predicates when key range is a scope range**  
  Merged via:
  - [#62027](https://github.com/apache/doris/pull/62027)
  - follow-up/branch PRs [#62115](https://github.com/apache/doris/pull/62115), [#62114](https://github.com/apache/doris/pull/62114)  
  This is an important **scan-layer correctness fix**. It addresses a case where `IN_LIST` runtime filters could be dropped incorrectly when combined with `MINMAX` filters on the same key column and pushdown limits were exceeded. This improves predicate preservation in OLAP scans and reduces risk of incorrect filtering behavior or degraded execution plans.

#### SQL compatibility / connector behavior
- **Preserve query TVF column aliases across JDBC catalogs**  
  Closed main PR:
  - [#61939](https://github.com/apache/doris/pull/61939)  
  Backports opened:
  - [#62123](https://github.com/apache/doris/pull/62123) for branch-4.0
  - [#62124](https://github.com/apache/doris/pull/62124) for branch-4.1  
  This improves **SQL compatibility and federated query usability**: Doris now preserves aliases returned through JDBC `query()` table-valued functions instead of losing user-defined names. This matters for BI tools, ETL jobs, and cross-catalog SQL portability.

#### Dependency maintenance / stale cleanup
A batch of older stale PRs was closed, mostly dependency updates and abandoned changes:
- [#52454](https://github.com/apache/doris/pull/52454) jackson-core bump
- [#53029](https://github.com/apache/doris/pull/53029) commons-fileupload bump
- [#53136](https://github.com/apache/doris/pull/53136) nimbus-jose-jwt bump
- [#53138](https://github.com/apache/doris/pull/53138) commons-lang3 bump
- [#56247](https://github.com/apache/doris/pull/56247) SHOW META-SERVICES in cloud mode
- [#56466](https://github.com/apache/doris/pull/56466) iceberg insert test log
- [#56498](https://github.com/apache/doris/pull/56498), [#56500](https://github.com/apache/doris/pull/56500) profile counter cleanup variants

**Interpretation:** today’s merged/closed set indicates progress on **execution correctness and SQL behavior**, while maintainers also cleaned backlog noise by closing stale or superseded work.

## 3. Community Hot Topics

### 1) Multi-catalog and data lake reader refactoring
- PR: [#61783](https://github.com/apache/doris/pull/61783) — `[refactoring](multi-catalog)data_lake_reader_refactoring`
  
This is one of the more strategically important open efforts. Even without visible discussion volume, the topic points to ongoing investment in **multi-catalog federation and lakehouse read paths**. The technical need behind it is clear: Doris users increasingly expect one engine to query **internal OLAP tables plus external lake formats and catalogs** with consistent execution behavior.

### 2) HTTP API authentication framework for admin operations
- PR: [#60761](https://github.com/apache/doris/pull/60761) — `[fix](auth) Fix HTTP API authentication framework for admin operations`
  
This is a broad cross-component change touching FE and BE auth semantics. It suggests strong demand for **safer operational APIs**, especially where public/user/admin paths need cleaner privilege boundaries. This is a meaningful signal for enterprise adoption, managed deployments, and hardened production environments.

### 3) CBO / optimizer strategy refinement
- PR: [#60601](https://github.com/apache/doris/pull/60601) — `Support multi-mode CBO CTE inline strategy`
  
This points to demand for **more nuanced optimizer controls** rather than simple on/off switches. Users likely need better tradeoffs between planning overhead and runtime quality for complex analytical SQL with CTEs.

### 4) TVF result-size handling
- PR: [#61788](https://github.com/apache/doris/pull/61788) — `fix tvf return error since thrift message too large to reach limit`
  
This highlights a practical scaling need: **large-result TVF execution** is hitting transport/message-size constraints. The underlying need is stronger support for data federation and function-driven access patterns at larger cardinalities.

### 5) Active user bug reports around ingestion and memory
- Issue: [#56700](https://github.com/apache/doris/issues/56700) — poor performance in insert on large JSON variant
- Issue: [#62118](https://github.com/apache/doris/issues/62118) — HTTP StreamLoad with GroupCommit in 4.0.3 may cause memory leak
  
These two issues reveal current user pain concentrated in **high-volume ingestion**, particularly with **semi-structured JSON/Variant data** and **stream loading under group commit**.

## 4. Bugs & Stability

Ranked by likely severity and production impact:

### High severity
#### 1) Possible memory leak in HTTP StreamLoad with GroupCommit on 4.0.3
- Issue: [#62118](https://github.com/apache/doris/issues/62118)

Reported against **Doris 4.0.3-rc03**, affecting both **Cloud Mode and non-Cloud Mode**. A memory leak in StreamLoad + GroupCommit is potentially serious because it impacts **continuous ingestion stability**, can accumulate over time, and may lead to BE memory pressure or service degradation.  
**Fix PR exists?** No directly linked fix in the provided data yet.

### Medium-high severity
#### 2) Poor insert performance on large JSON Variant in 3.1.1 versus 3.0.8
- Issue: [#56700](https://github.com/apache/doris/issues/56700)

This looks like a **performance regression or workload-specific slowdown** in semi-structured ingestion. Since the comparison is version-to-version under similar JDBC batch-insert conditions, the report may indicate regression in the **Variant/JSON write path**, parsing, encoding, or storage-layer overhead.  
**Fix PR exists?** None linked in the provided data.

### Medium severity
#### 3) Wrong results in window funnel v2 with deduplication/fixed mode
- PR: [#62043](https://github.com/apache/doris/pull/62043)

Although still open, this is a notable correctness bug because it affects **analytic function semantics**, not just performance. Wrong results in funnel analysis directly affect product analytics and behavior-tracking use cases.  
**Fix PR exists?** Yes, the PR itself is the proposed fix.

#### 4) Deadlock risks in FE concurrent hash maps
- PR: [#62117](https://github.com/apache/doris/pull/62117)

This addresses FE-side concurrency hazards in `ConcurrentLong2*HashMap`. Deadlocks are severe if triggered, but likely narrower in scope than the ingestion memory leak.  
**Fix PR exists?** Yes: [#62117](https://github.com/apache/doris/pull/62117).

#### 5) Missing inverted index metrics in SEARCH() query path
- PR: [#62121](https://github.com/apache/doris/pull/62121)

This is more of an **observability bug** than a functional one, but it blocks diagnosis of SEARCH() performance problems by reporting zero profile metrics.  
**Fix PR exists?** Yes: [#62121](https://github.com/apache/doris/pull/62121).

## 5. Feature Requests & Roadmap Signals

While today’s inputs are more bugfix-heavy than feature-heavy, several PRs give strong roadmap clues:

### Local developer container workflow
- PR: [#62120](https://github.com/apache/doris/pull/62120) — `Add local-dev single-container FE+BE Dockerfile`

This suggests ongoing effort to improve **developer experience**, CI integration, and lightweight reproducible local environments. Likely to land soon because it is self-contained and broadly useful.

### Fine-grained file cache control for compaction
- PR: [#62119](https://github.com/apache/doris/pull/62119)

This is a clear **cloud storage optimization signal**. Selective index-only caching during compaction shows Doris is tuning for **object-store-backed deployments**, where write amplification and cache efficiency matter. This kind of feature is likely to appear in upcoming 4.1-oriented builds.

### Multi-mode CBO CTE inline strategy
- PR: [#60601](https://github.com/apache/doris/pull/60601)

Strong signal that future versions will expose **more granular optimizer knobs**. This fits a broader roadmap of balancing **optimizer sophistication with predictable operational behavior**.

### Multi-catalog / filesystem SPI / lake integration
- PRs:
  - [#61783](https://github.com/apache/doris/pull/61783)
  - [#62023](https://github.com/apache/doris/pull/62023)

These indicate continued expansion of Doris as a **federated analytics engine**, not only a native OLAP store. Expect future versions to further strengthen **catalog interoperability, file system abstraction, and data lake connectors**.

### Memory-footprint optimization for cloud replicas
- PRs:
  - [#62122](https://github.com/apache/doris/pull/62122)
  - [#62084](https://github.com/apache/doris/pull/62084)

These are not headline features, but they are roadmap signals for **higher-density cloud metadata management** and more scalable deployments.

## 6. User Feedback Summary

Today’s direct user feedback points to three practical concerns:

1. **Semi-structured ingest performance matters.**  
   - [#56700](https://github.com/apache/doris/issues/56700) shows users are benchmarking Doris versions closely and expect **JSON/Variant ingestion performance** not to regress. This is a sign that Doris is being used for workloads beyond classic structured fact tables.

2. **Operational stability of streaming ingest is critical.**  
   - [#62118](https://github.com/apache/doris/issues/62118) suggests production users rely on **HTTP StreamLoad + GroupCommit** and are sensitive to memory growth under sustained load.

3. **Cross-system SQL behavior must be precise.**  
   - [#61939](https://github.com/apache/doris/pull/61939) reflects user expectations that **JDBC-catalog query results preserve aliases exactly**, which is important for BI/reporting workflows and downstream schema handling.

In short, users appear satisfied enough to push Doris into **federated, semi-structured, and production streaming** scenarios, but they are also surfacing the pain points that come with those more advanced deployments.

## 7. Backlog Watch

These items appear to need maintainer attention due to age, breadth, or likely impact:

### Older but still-open important PRs
- [#60761](https://github.com/apache/doris/pull/60761) — HTTP API auth framework for admin operations  
  Important security/operability change spanning FE and BE; long-lived and deserves resolution.

- [#60601](https://github.com/apache/doris/pull/60601) — multi-mode CBO CTE inline strategy  
  Valuable optimizer enhancement; reviewed but still open.

- [#59019](https://github.com/apache/doris/pull/59019) — cloud iterator robustness  
  Older cloud robustness PR that may be easy to overlook despite production relevance.

- [#61788](https://github.com/apache/doris/pull/61788) — TVF thrift-message-too-large fix  
  Approved/reviewed and likely useful for real workloads; good candidate for prompt merge if tests are satisfactory.

- [#61918](https://github.com/apache/doris/pull/61918) — FE SlotRef decoupling refactor  
  Architectural cleanup can unblock later FE evolution, but tends to linger without focused review.

### Important open issues
- [#62118](https://github.com/apache/doris/issues/62118) — possible memory leak in StreamLoad GroupCommit  
  Should be prioritized due to production stability risk.

- [#56700](https://github.com/apache/doris/issues/56700) — insert slowdown on large JSON Variant  
  Though marked stale, this may conceal a significant regression in a growing workload category and should not be ignored.

## 8. Project Health Assessment

Apache Doris looks **engineering-active and forward-moving**, with meaningful work across **query correctness, optimizer evolution, cloud efficiency, and federated SQL compatibility**. The absence of a release today is offset by strong PR momentum and multiple fixes relevant to advanced analytical use cases. The main caution area is **ingestion stability/performance**, especially for **stream loading and semi-structured data**, where user reports indicate potentially high operational impact. Overall, the project appears healthy, but maintainers should continue tightening **production-grade reliability** as Doris expands into more complex cloud and lakehouse scenarios.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-04-05

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, but the center of gravity has shifted from raw query speed alone to **correctness, cloud/lakehouse interoperability, memory discipline, and operational observability**. Across engines, the most visible engineering work is happening in **federated access, semi-structured data support, optimizer refinement, and production hardening** rather than headline feature launches. Query engines and table-format projects are also converging: execution engines increasingly need deep support for **Iceberg/Delta/Parquet/Arrow**, while storage-layer projects are evolving richer semantics for **VARIANT, row-level changes, and metadata correctness**. Overall, the landscape looks healthy, with strong contributor throughput, but several projects are balancing rapid innovation against a rising burden of stability and compatibility issues.

---

## 2. Activity Comparison

### Daily activity snapshot

| Project | Issues Updated | PRs Updated | Release Today | Health Score* | Current Read |
|---|---:|---:|---|---:|---|
| **ClickHouse** | 21 | 102 | No | 8.3/10 | Very high velocity, but carrying notable correctness/data-loss risk |
| **Apache Doris** | 2 | 29 | No | 8.5/10 | Active and focused; strong execution/query work, some ingestion stability concerns |
| **DuckDB** | 11 | 20 | No | 8.1/10 | Responsive stabilization cycle, especially around 1.5.1 regressions |
| **StarRocks** | 7 | 18 | No | 8.2/10 | Healthy, fast bug-response loop, some security/correctness backlog |
| **Apache Iceberg** | 8 | 19 | No | 8.0/10 | Broad, integration-heavy progress; maintenance and interoperability focused |
| **Delta Lake** | 0 | 10 | No | 8.0/10 | Stable and quieter; architectural modernization in progress |
| **Databend** | 0 | 7 | No | 7.8/10 | Lower noise, focused correctness and feature maturation |
| **Velox** | 1 | 15 | No | 8.1/10 | Good engineering motion, especially compatibility and CI hardening |
| **Apache Gluten** | 6 | 3 | No | 7.6/10 | Narrow but important focus on memory behavior and Velox backend stability |
| **Apache Arrow** | 17 | 10 | No | 7.9/10 | Steady maintenance, ecosystem plumbing, correctness/CI emphasis |

\*Health score is an analytical estimate based on today’s activity quality, responsiveness, backlog risk, and severity of surfaced issues.

### Relative ranking by visible engineering throughput
1. ClickHouse  
2. Apache Doris  
3. DuckDB / Apache Iceberg / StarRocks  
4. Velox / Delta Lake / Arrow  
5. Databend / Gluten  

---

## 3. Apache Doris’s Position

### Where Doris looks strong vs peers
Apache Doris stands out today for its balance of **high engineering throughput** and **practical user-facing fixes** in query correctness, SQL compatibility, federated access, profile observability, and cloud memory optimization. Compared with ClickHouse, Doris currently appears somewhat **less operationally chaotic**, with fewer severe active correctness/data-loss signals in the day’s feed. Compared with DuckDB and StarRocks, Doris shows a broader mix of **OLAP-native execution work plus multi-catalog/lakehouse integration**, suggesting a strong push toward a unified analytical platform rather than a narrower engine profile.

### Technical approach differences
Doris is increasingly positioned as a **hybrid analytical database + federated query layer**:
- stronger emphasis on **internal OLAP storage plus external catalogs/TVFs/JDBC federation**
- active work on **runtime filters, scan correctness, FE concurrency, profile metrics**
- growing attention to **cloud/object-store efficiency**

This differs from:
- **ClickHouse**: more storage-engine and MergeTree-centric, with stronger low-level indexing/DDL/storage concerns
- **DuckDB**: embedded/local analytics first, with intense focus on file/Arrow/Parquet/JSON interoperability
- **StarRocks**: similar MPP OLAP/lakehouse direction, but today more centered on compatibility, governance, and internal refactors
- **Iceberg/Delta**: storage/table-format layers rather than full query engines

### Community size comparison
By visible daily contribution volume, Doris is clearly in the **upper tier**, behind ClickHouse but ahead of many peers in this snapshot. It has materially more code movement than Databend, Delta Lake, Velox, Gluten, and Arrow today, and shows comparable or stronger practical momentum than DuckDB, StarRocks, and Iceberg. That places Doris in a credible “large and active” community band, though not yet at ClickHouse’s sheer throughput level.

---

## 4. Shared Technical Focus Areas

### 1) Memory behavior, OOM resilience, and resource governance
**Engines:** Doris, ClickHouse, DuckDB, Gluten, Arrow  
**Needs emerging:**
- Doris: possible StreamLoad + GroupCommit memory leak; cloud replica memory optimization
- ClickHouse: OOM canary, memory limit issues in system log flushing
- DuckDB: memory blow-up/regression with fixed-size arrays + `ON CONFLICT`
- Gluten: table scan memory over-allocation and prefetch-induced OOM
- Arrow: mmap lifecycle / memory release expectations

**Signal:** users increasingly judge engines on **predictable memory behavior**, not just peak speed.

### 2) Semi-structured data and VARIANT/JSON support
**Engines:** Doris, DuckDB, Iceberg, Delta Lake, ClickHouse  
**Needs emerging:**
- Doris: large JSON Variant ingest performance
- DuckDB: JSON/VARIANT → Parquet stability, timestamp auto-detection
- Iceberg: Spark/Kafka Connect VARIANT support
- Delta: VARIANT feature support in Delta Sharing
- ClickHouse: continued text/vector/index evolution alongside broader data-lake use

**Signal:** semi-structured analytics is now mainstream, not an edge workload.

### 3) Lakehouse / multi-catalog / object storage interoperability
**Engines:** Doris, StarRocks, ClickHouse, Iceberg, Delta, Arrow, Velox  
**Needs emerging:**
- Doris: multi-catalog reader refactoring, filesystem SPI work, JDBC/TVF correctness
- StarRocks: Iceberg catalog privilege semantics, Hive external table support
- ClickHouse: Parquet/S3/cached disk/hive partitioning work
- Iceberg/Delta: cloud commit correctness, REST/spec evolution, Spark/Flink integration
- Arrow: cloud filesystem parity across languages
- Velox: deep Iceberg V3 support

**Signal:** interoperability is now a core product requirement, not an optional connector layer.

### 4) SQL compatibility and semantic correctness
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Databend, Velox, Delta  
**Needs emerging:**
- Doris: TVF alias preservation, funnel/window correctness, optimizer controls
- ClickHouse: DDL semantics, view/distributed behavior, function correctness
- DuckDB: binding regressions, Unicode sort crash, parser/metadata correctness
- StarRocks: dotted identifiers, SQLAlchemy/Superset compatibility
- Databend: `LIKE ESCAPE`, `GROUPING()`, idempotent DDL
- Velox: Spark/Presto semantic alignment
- Delta: decimal coercion correctness

**Signal:** mature users now expect warehouse-grade SQL behavior across edge cases.

### 5) Observability and production operability
**Engines:** Doris, StarRocks, ClickHouse, Arrow, Velox  
**Needs emerging:**
- Doris: missing SEARCH() metrics, richer profiling
- StarRocks: Prometheus-native data cache metrics
- ClickHouse: CI logs export, warning/system metric trustworthiness
- Arrow: logging correctness under multithreading
- Velox: CI failure visibility and workflow/debuggability

**Signal:** teams want systems that are easier to operate, not just benchmark.

---

## 5. Differentiation Analysis

### Storage format and persistence model
- **Doris / ClickHouse / StarRocks / Databend**: integrated analytical databases with their own storage/runtime stack
- **DuckDB**: embedded analytical engine with strong file-native workflows
- **Iceberg / Delta Lake**: table/storage format and transaction layers, not full standalone query engines
- **Arrow**: in-memory format and data access substrate
- **Velox / Gluten**: execution acceleration/runtime layers, often embedded under higher-level systems

### Query engine design
- **Doris / StarRocks / ClickHouse**: distributed MPP OLAP engines
- **DuckDB**: in-process vectorized engine optimized for local analytics and data science workflows
- **Velox**: reusable execution engine for larger systems
- **Gluten**: Spark acceleration layer using Velox backend
- **Iceberg / Delta / Arrow**: depend on partner compute engines for full SQL execution

### Target workloads
- **Doris**: interactive OLAP, real-time analytics, federated SQL, mixed internal + external data
- **ClickHouse**: very high-throughput analytics, event/log workloads, large-scale serving
- **StarRocks**: BI/lakehouse analytics with strong external-catalog emphasis
- **DuckDB**: notebook analytics, ETL, local OLAP, embedded apps
- **Iceberg / Delta**: lakehouse tables, multi-engine data sharing, transactional data lakes
- **Databend**: cloud analytics with versioned table/storage ambitions
- **Arrow**: interchange, compute kernels, ecosystem plumbing
- **Velox / Gluten**: backend acceleration for distributed SQL systems

### SQL compatibility posture
- **Doris / StarRocks / DuckDB** currently show strong visible focus on compatibility improvements
- **ClickHouse** remains powerful but more likely to expose specialized semantics or storage-linked edge cases
- **Velox** is compatibility-driven mainly through Spark/Presto alignment
- **Iceberg/Delta/Arrow** influence SQL indirectly via connector/spec behavior rather than as primary SQL surfaces

---

## 6. Community Momentum & Maturity

### Tier 1: Very high iteration
- **ClickHouse**
- **Apache Doris**

These projects show the strongest visible throughput. ClickHouse has the largest volume, but Doris currently looks somewhat more controlled in issue severity.

### Tier 2: High, balanced iteration
- **DuckDB**
- **StarRocks**
- **Apache Iceberg**

These projects are active and responsive, but much of today’s work is stabilization, interoperability, and correctness refinement rather than large feature bursts.

### Tier 3: Focused modernization / subsystem evolution
- **Delta Lake**
- **Velox**
- **Apache Arrow**

These communities appear mature and purposeful, with emphasis on architecture, compatibility, packaging, and component hardening.

### Tier 4: Smaller but meaningful focused activity
- **Databend**
- **Apache Gluten**

Lower visible throughput does not imply low relevance; both are working on distinct technical angles. But compared with top-tier communities, they appear to have narrower reviewer/contributor bandwidth.

### Stabilizing vs rapidly iterating
- **Rapidly iterating:** ClickHouse, Doris, DuckDB, StarRocks
- **Integration/maturity phase:** Iceberg, Delta, Arrow, Velox
- **Focused niche advancement:** Databend, Gluten

---

## 7. Trend Signals

### 1) The market is converging on “lakehouse-native OLAP”
Data engineers increasingly expect one platform to query **native tables, external catalogs, Parquet/ORC files, and shared/open table formats**. This benefits architects choosing systems that must avoid data silos and support gradual platform consolidation.

### 2) Semi-structured data is becoming a first-class benchmark
JSON, VARIANT, Arrow unions, and nested types are recurring pain points across many projects. For practitioners, this means engine selection should now consider **semi-structured correctness and export/import robustness**, not only structured star-schema performance.

### 3) Correctness and safety are becoming competitive differentiators
Silent data loss, wrong-result bugs, DDL safety, privilege enforcement, and memory leaks are prominent in community conversations. Buyers and platform owners should treat **operational correctness** as a top evaluation category alongside speed.

### 4) SQL ecosystem compatibility matters more than ever
Tooling compatibility with JDBC, SQLAlchemy, Superset, PromQL, and cloud/object-store APIs is a repeated theme. For architects, this reduces the importance of standalone benchmarks and increases the importance of **fit within real pipelines and BI stacks**.

### 5) Runtime observability is now part of product quality
Metrics, profiles, cache visibility, and diagnosable CI/runtime behavior are recurring asks. For data engineering teams, this is especially valuable because it lowers time-to-resolution in production and improves capacity planning.

### 6) Engine boundaries are blurring
Execution engines, storage formats, acceleration layers, and interchange layers are increasingly co-evolving. The practical implication is that technology choices should be made as **ecosystem stack decisions** rather than single-project decisions.

---

## Bottom Line

**Apache Doris** currently sits in a strong competitive position: high activity, broad technical scope, and meaningful movement in correctness, federation, and cloud efficiency. Relative to peers, Doris looks especially compelling for teams seeking a **distributed OLAP engine that is evolving into a broader federated analytics platform**. The main caution area is the same one seen across the ecosystem: **memory behavior and ingest reliability under production workloads**. For technical decision-makers, today’s broader market signal is clear: the winners will be the engines that combine performance with **safe semantics, lakehouse interoperability, and operational maturity**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-04-05

## 1) Today’s Overview

ClickHouse remained highly active over the last 24 hours, with **102 pull requests updated** and **21 issues updated**, indicating strong ongoing development momentum across engine internals, CI, storage integrations, and SQL/runtime correctness. There were **no new releases**, so current activity is centered on iterative fixes, feature development, and test/infra hardening rather than distribution milestones. The issue stream shows a mix of **serious correctness/data-loss concerns**, **crash reports from CI/fuzzing**, and **forward-looking feature work** in indexing, PromQL, text search, and caching. Overall project health looks **energetic but operationally intense**: velocity is high, while maintainers are simultaneously absorbing a meaningful volume of stability and correctness findings.

## 2) Project Progress

Today’s closed/merged work appears modest in count but meaningful in focus.

- **Issue closed:** [#93574](https://github.com/ClickHouse/ClickHouse/issues/93574) — *Add logs export for the Fast test job*  
  This is a CI observability improvement that should make failures in the fast test lane easier to diagnose. It signals continued investment in test infrastructure, which is important given the number of flaky-test and crash reports currently surfacing.

- **Closed PR:** [#100830](https://github.com/ClickHouse/ClickHouse/pull/100830) — *Inline VIEW subquery during query analysis*  
  This improves the query analyzer’s ability to inline VIEW subqueries, opening the door to better optimization opportunities. In practical terms, it advances query-planning quality and could help resolve cases where views act as optimization barriers.

- **Closed PR:** [#101537](https://github.com/ClickHouse/ClickHouse/pull/101537) — *Native Common Virtuals for Buffer*  
  This continues internal consistency work around virtual columns and storage engines. While marked not-for-changelog, it contributes to engine usability and internal feature parity.

- **Closed PR:** [#101797](https://github.com/ClickHouse/ClickHouse/pull/101797) — *Prevent server termination when unregistering S3 client fails*  
  This PR was closed, apparently replaced by the active follow-up [#101798](https://github.com/ClickHouse/ClickHouse/pull/101798). The topic itself is significant: preventing `std::terminate` in a `noexcept` destructor is a direct server-stability concern around S3 client lifecycle handling.

**Takeaway:** today’s completed progress leans less toward marquee user features and more toward **query analysis improvements**, **storage-engine consistency**, and **better CI/debuggability**.

## 3) Community Hot Topics

The hottest threads reflect three recurring themes: performance surprises, table-creation semantics, and low-level storage reliability.

- [#99799](https://github.com/ClickHouse/ClickHouse/issues/99799) — **[CI crash] Double deletion of MergeTreeDataPartCompact in multi_index**  
  **24 comments**  
  This is the most actively discussed issue in the list and points to a potentially serious lifetime/ownership bug in MergeTree part handling. The level of discussion suggests this is not a superficial CI flake but a deeper storage-engine memory-safety concern.

- [#51645](https://github.com/ClickHouse/ClickHouse/issues/51645) — **trivial view on top of distributed table can significantly impact performance**  
  **7 comments**  
  This older but newly active issue highlights a persistent user expectation gap: a seemingly harmless `VIEW` over a `Distributed` table can materially degrade execution. The underlying technical need is better optimizer transparency and fewer abstraction penalties in distributed query plans.

- [#91631](https://github.com/ClickHouse/ClickHouse/issues/91631) — **Extension of CREATE TABLE IF NOT EXISTS ... AS SELECT**  
  **5 comments**  
  This is a roadmap-level SQL semantics discussion. Users want more intuitive and perhaps more expressive behavior when combining idempotent DDL with data-producing statements. It reflects demand for smoother migration/bootstrapping workflows.

- [#99914](https://github.com/ClickHouse/ClickHouse/issues/99914) — **Speed up primary key ranges pruning for parts with many granules**  
  **4 comments**  
  This is a direct performance-engineering topic. The report shows expensive “generic exclusion search” behavior over very large parts, suggesting a need for smarter pruning algorithms or data structures for large-granule indexes.

- [#23727](https://github.com/ClickHouse/ClickHouse/issues/23727) — **Replacing partition with a non-existent one leads to data loss**  
  **4 comments**  
  Despite being old, this remains highly relevant because it touches destructive DDL semantics. The fact that it is still active is a strong signal that users want stronger safety rails around partition replacement operations.

**Technical reading:** the community is currently most engaged where **performance abstractions break expectations** and where **storage/DDL operations risk correctness or data loss**.

## 4) Bugs & Stability

Below are the key newly surfaced or newly active stability problems, ranked roughly by severity.

### Critical / Data Loss Risk

1. [#101763](https://github.com/ClickHouse/ClickHouse/issues/101763) — **`ALTER TABLE MODIFY TTL` with `DateTime` silently causes data loss on 32-bit overflow**  
   This is the most severe user-facing bug in today’s set. A large TTL interval can overflow 32-bit `DateTime`, wrap into the past, and delete all data without warning.  
   **Fix exists:** [#101793](https://github.com/ClickHouse/ClickHouse/pull/101793) — WIP fix.  
   **Assessment:** high priority for stable branches due to silent destructive behavior.

2. [#23727](https://github.com/ClickHouse/ClickHouse/issues/23727) — **Replacing partition with a non-existent one leads to data loss**  
   An old but still dangerous issue: destructive partition replacement should not succeed in a way that wipes destination data when the source partition is absent.  
   **Assessment:** long-standing safety gap in administrative DDL behavior.

3. [#80648](https://github.com/ClickHouse/ClickHouse/issues/80648) — **Race between merge and `ALTER RENAME COLUMN` may lead to data loss of renamed column**  
   This suggests a metadata/data-part race in MergeTree alter/merge interaction.  
   **Assessment:** critical whenever schema changes overlap with background merges.

### High / Crash or Server-Termination Risk

4. [#99799](https://github.com/ClickHouse/ClickHouse/issues/99799) — **Double deletion crash in MergeTree compact parts**  
   Potential double free / use-after-free class defect. Even though reported via CI, these issues often indicate real production risk under edge interleavings.

5. [#101798](https://github.com/ClickHouse/ClickHouse/pull/101798) — **Prevent server termination when unregistering S3 client fails**  
   Not an issue report but an active fix for a serious runtime hazard. Exceptions escaping a `noexcept` destructor can abort the process.  
   **Assessment:** important for cloud/object-storage deployments.

6. [#101308](https://github.com/ClickHouse/ClickHouse/issues/101308) — **Allocator “Too large size” in `MergingSortedAlgorithm`**  
   Fuzz/CI found an invalid allocation-size path in merge logic.  
   **Assessment:** likely correctness or bounds-check failure in merge processing; worth watching for a follow-up fix PR.

7. [#101356](https://github.com/ClickHouse/ClickHouse/issues/101356) — **Memory limit exceeded when flushing `system.*_log` tables**  
   This is user-reported and operationally important because observability/logging paths themselves may amplify memory pressure during already constrained periods.  
   **Assessment:** directly tied to production OOM concerns.

8. [#101749](https://github.com/ClickHouse/ClickHouse/issues/101749) — **OOM Canary**  
   Not a bug report, but a direct response to memory-kill scenarios. The proposal signals maintainers are treating OOM resilience as an active operational concern.

### High / Query Correctness

9. [#101725](https://github.com/ClickHouse/ClickHouse/issues/101725) — **`levenshteinDistanceWeighted` / `arraySimilarity` wrong results**  
   Consecutive matches reportedly produce incorrect distance due to DP state update logic.  
   **Assessment:** wrong-answer bug in analytical/string-similarity functions.

10. [#101782](https://github.com/ClickHouse/ClickHouse/issues/101782) — **`ReservoirSamplerDeterministic::merge()` missing self-merge guard**  
    Produces incorrect aggregation results for deterministic median state composition.  
    **Assessment:** correctness issue in aggregate-state handling.

11. [#101759](https://github.com/ClickHouse/ClickHouse/issues/101759) — **`processWarning` methods use stale metrics after swap**  
    `system.warnings` may lag by one cycle.  
    **Assessment:** lower severity, but it weakens operational telemetry trustworthiness.

### Medium / Compatibility & File Format Regressions

12. [#99019](https://github.com/ClickHouse/ClickHouse/issues/99019) — **Error reading Parquet file in v26.2.4.23**  
    Reading Parquet with a binary string column and a `WHERE` clause fails.  
    **Assessment:** notable for users with data lake / S3 pipelines.

13. [#101748](https://github.com/ClickHouse/ClickHouse/issues/101748) — **Missing `implicit_value(1)` on `--reconnect` breaks old flag syntax**  
    CLI compatibility regression.  
    **Assessment:** small but user-visible tooling break.

14. [#101747](https://github.com/ClickHouse/ClickHouse/issues/101747) — **Table-name length check bypassable in `renameDatabase` when dependency checks disabled**  
    Validation logic appears incorrectly gated.  
    **Assessment:** policy/validation bug with possible edge-case metadata risks.

### Test Stability

15. [#101317](https://github.com/ClickHouse/ClickHouse/issues/101317) — **Flaky test: `03237_avro_union_in_complex_types`**  
    Another sign that format/type-system coverage in CI still has unstable edges.

## 5) Feature Requests & Roadmap Signals

Several active items provide clear signals about where ClickHouse may evolve next.

- [#91631](https://github.com/ClickHouse/ClickHouse/issues/91631) — **Extend `CREATE TABLE IF NOT EXISTS ... AS SELECT`**  
  This could improve SQL ergonomics around idempotent setup scripts and initialization logic. It feels plausible for a near-term release because it aligns with developer usability.

- [#101473](https://github.com/ClickHouse/ClickHouse/issues/101473) — **RFC: positional phrase query support for text index**  
  This is a substantial roadmap signal for native text search. Adding token-position awareness would enable exact phrase matching at the index layer. This is larger in scope and likely medium-term rather than immediate.

- [#101795](https://github.com/ClickHouse/ClickHouse/issues/101795) + [#101796](https://github.com/ClickHouse/ClickHouse/pull/101796) — **Add `cuckoo_filter` skip index for MergeTree**  
  This is one of the clearest “feature likely to land” candidates because it already has an implementation PR. It extends MergeTree indexing options and suggests continued experimentation with probabilistic indexing structures.

- [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757) — **PartialAggregateCache for part-level aggregate caching**  
  This is an important performance feature for repeated `GROUP BY` workloads on MergeTree. Because it is still open and marked experimental/manual approval, it looks like a strong medium-term optimization candidate.

- [#100555](https://github.com/ClickHouse/ClickHouse/issues/100555) — **Vector similarity index migration from SimSIMD to NumKong**  
  This points to ongoing investment in vector search/ANN-adjacent functionality. It likely depends on correctness/perf validation before landing.

- [#101749](https://github.com/ClickHouse/ClickHouse/issues/101749) — **OOM Canary**  
  This is more operational feature than SQL feature, but it’s a strong signal that server self-protection and pre-OOM diagnosis may become a more explicit product capability.

- [#101794](https://github.com/ClickHouse/ClickHouse/pull/101794) — **PromQL POST body parsing for urlencoded form**  
  This is a practical compatibility enhancement for Prometheus ecosystem clients. Given the limited scope and clear bug/compatibility framing, it looks likely to merge soon.

**Most likely near-term additions/fixes:** `cuckoo_filter` skip index, PromQL POST compatibility, TTL overflow protection, and possibly more SQL ergonomics around `CREATE TABLE IF NOT EXISTS ... AS SELECT`.

## 6) User Feedback Summary

The user feedback in today’s data points to several recurring pain points:

- **Performance surprises in distributed SQL abstractions**  
  [#51645](https://github.com/ClickHouse/ClickHouse/issues/51645) shows that users expect a trivial `VIEW` over a `Distributed` table not to alter performance dramatically. This speaks to a desire for more predictable optimizer behavior.

- **Operational pain under memory pressure**  
  [#101356](https://github.com/ClickHouse/ClickHouse/issues/101356) and [#101749](https://github.com/ClickHouse/ClickHouse/issues/101749) together show that OOM incidents remain a practical concern, especially when internal logging/metrics paths contribute to pressure.

- **Need for safer destructive DDL / data lifecycle operations**  
  [#101763](https://github.com/ClickHouse/ClickHouse/issues/101763), [#23727](https://github.com/ClickHouse/ClickHouse/issues/23727), and [#80648](https://github.com/ClickHouse/ClickHouse/issues/80648) all reflect user demand for stronger invariants against accidental or race-induced data loss.

- **Lakehouse/object-storage interoperability matters**  
  [#99019](https://github.com/ClickHouse/ClickHouse/issues/99019), [#101787](https://github.com/ClickHouse/ClickHouse/pull/101787), [#101712](https://github.com/ClickHouse/ClickHouse/pull/101712), and [#101798](https://github.com/ClickHouse/ClickHouse/pull/101798) show active use around Parquet, S3, cached disks, hive partitioning, and object-store clients.

- **Users value compatibility with surrounding ecosystems**  
  PromQL API support in [#101794](https://github.com/ClickHouse/ClickHouse/pull/101794) and CLI compatibility in [#101748](https://github.com/ClickHouse/ClickHouse/issues/101748) indicate that integration polish matters as much as core engine speed.

Overall, users still see ClickHouse as powerful, but they increasingly expect **predictable semantics, safer administration, and smoother interoperability**.

## 7) Backlog Watch

These older or strategically important items appear to deserve maintainer attention:

- [#23727](https://github.com/ClickHouse/ClickHouse/issues/23727) — **Partition replacement can destroy data when source partition does not exist**  
  Open since 2021; still a serious safety problem.

- [#51645](https://github.com/ClickHouse/ClickHouse/issues/51645) — **VIEW over Distributed table causes major performance impact**  
  Open since 2023; important for planner/optimizer credibility and user trust.

- [#80648](https://github.com/ClickHouse/ClickHouse/issues/80648) — **Race between merge and column rename may lose data**  
  Open since 2025; serious because it combines schema evolution with background storage operations.

- [#93757](https://github.com/ClickHouse/ClickHouse/pull/93757) — **PartialAggregateCache**  
  Open since January 2026; strategically interesting optimization work that may need review bandwidth to move forward.

- [#99283](https://github.com/ClickHouse/ClickHouse/pull/99283) — **macOS test shell compatibility improvements**  
  Cross-platform CI and test-runner reliability work can languish despite broad value; this one looks worth closing out.

- [#99914](https://github.com/ClickHouse/ClickHouse/issues/99914) — **Primary key pruning for parts with many granules**  
  Performance issue with clear production impact on large datasets; merits attention because it affects core MergeTree efficiency.

## Bottom Line

ClickHouse is showing **strong contributor throughput and broad technical ambition**, especially in storage engines, indexing, query analysis, and ecosystem compatibility. The main caution signal is that several of today’s most important issue updates involve **silent data loss risks, merge/DDL races, and low-level storage crashes**, which deserve prioritization over feature expansion. The project looks healthy in momentum and engineering depth, but near-term health will be judged by how quickly it converts these correctness and operational findings into stable fixes.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-04-05

## 1. Today's Overview

DuckDB showed **high day-to-day development activity** over the last 24 hours, with **11 active issues** and **20 updated PRs**, though **no new releases** landed. The current signal is strongly skewed toward **bug fixing and hardening**, especially around **Arrow/Parquet interoperability, query correctness regressions, CSV/JSON ingestion, memory behavior, and edge-case execution crashes**. Several reports point to **1.5.1 regressions or newly surfaced correctness/stability problems**, while maintainers and contributors are responding with fast follow-up PRs. Overall project health looks **active and responsive**, but short-term attention appears focused on **stability recovery rather than feature shipping**.

## 3. Project Progress

Merged/closed PR activity today mostly advanced **correctness fixes in execution internals**, rather than large end-user features.

- **String handling ergonomics in vector writers** — PR [#21816](https://github.com/duckdb/duckdb/pull/21816) was closed after proposing safer handling for `FlatVector::Writer<string_t>`, automatically copying strings into the result vector. This is an internal developer-experience and safety improvement relevant to extension and engine contributors.
- **Lateral table in-out function correctness** — PR [#21826](https://github.com/duckdb/duckdb/pull/21826) was closed and superseded by follow-up PR [#21827](https://github.com/duckdb/duckdb/pull/21827), addressing corruption of **constant struct fields across outer rows** in lateral table in-out functions. This is a query engine correctness fix around parameter/value preservation.
- **Aggregate pushdown strategy evolved** — PR [#21797](https://github.com/duckdb/duckdb/pull/21797) was closed with changes requested, but its intent survives in open PR [#21831](https://github.com/duckdb/duckdb/pull/21831), which now proposes **partial aggregate precomputation from row group statistics**. That suggests progress toward **statistics-driven scan avoidance** for `min`, `max`, and `count(*)`, but with a revised implementation path.

Net progress today: DuckDB is moving forward on **planner/executor correctness** and **storage-statistics-based optimization**, while pruning or reworking approaches that were too invasive.

## 4. Community Hot Topics

### 1) JSON/CSV ISO 8601 timestamp auto-detection remains a visible ingestion pain point
- Issue [#14919](https://github.com/duckdb/duckdb/issues/14919) — **8 comments, 11 👍**
- Topic: `read_json_auto` / auto-detection of ISO 8601 timestamps with timezone offsets.

This is the most validated user-facing issue in the set. The underlying need is clear: users expect DuckDB’s schema/type inference during semi-structured ingestion to recognize **real-world timestamp strings including timezone offsets**, especially because the docs suggest broad support. This reflects a broader analytics need: reliable **zero-configuration import from logs, APIs, and event data**.

### 2) Arrow union import correctness got immediate issue→PR turnaround
- Issue [#21842](https://github.com/duckdb/duckdb/issues/21842)
- PR [#21843](https://github.com/duckdb/duckdb/pull/21843)

This is a strong example of fast responsiveness. The report identifies a subtle but important **Arrow C Data Interface semantic bug**: type IDs in sparse unions are not guaranteed to equal child indices. DuckDB reportedly parses the mapping but ignores it, leading to crashes or incorrect behavior. The immediate PR indicates this is a recognized interoperability gap and likely high priority for users integrating with Arrow-native pipelines.

### 3) VARIANT + Parquet stability is emerging as a modern-type pain point
- Issue [#21779](https://github.com/duckdb/duckdb/issues/21779) — **7 comments**

The issue reports an **internal assertion failure near completion** when writing large `VARIANT` columns to Parquet after casting from JSON. This points to pressure on DuckDB’s newer semi-structured type stack: users want **JSON → VARIANT → Parquet** workflows to be production-safe at scale. Technical need: robust handling of nested/heterogeneous values during late-stage columnar serialization.

### 4) CLI extensibility remains an active contributor theme
- PR [#21201](https://github.com/duckdb/duckdb/pull/21201)
- PR [#21041](https://github.com/duckdb/duckdb/pull/21041)

Although one of these is explicitly against project policy, both point to sustained interest in a more capable CLI and extension-defined dot commands. The serious roadmap signal here is not the LLM-specific PR, but the demand for **extensible shell workflows**.

## 5. Bugs & Stability

Ranked by likely severity and user impact:

### Critical
1. **Parquet export crash with `VARIANT` columns**
   - Issue [#21779](https://github.com/duckdb/duckdb/issues/21779)
   - Symptom: internal error during Parquet write at ~96%.
   - Why severe: affects long-running export jobs and modern semi-structured workloads; fails late, wasting compute/time.
   - Fix PR: none listed yet.

2. **Arrow sparse union type ID mapping bug**
   - Issue [#21842](https://github.com/duckdb/duckdb/issues/21842)
   - Fix PR: [#21843](https://github.com/duckdb/duckdb/pull/21843)
   - Why severe: standards-compliance/interoperability bug that can cause crashes or misinterpret Arrow data.

3. **Release-build-only internal vector index error**
   - Issue [#21820](https://github.com/duckdb/duckdb/issues/21820)
   - Symptom: `Attempted to access index 5 within vector of size 5` only in release/reldebug.
   - Why severe: build-mode-sensitive internal errors are hard to diagnose and may indicate optimizer/executor undefined behavior.

### High
4. **Out-of-memory/leak behavior with fixed-size arrays + `ON CONFLICT`**
   - Issue [#21836](https://github.com/duckdb/duckdb/issues/21836)
   - Why severe: memory blow-up under upsert-like workloads can make 1.5.x unsuitable for ingestion/update pipelines.
   - Regression signal: reporter says it worked in older versions such as 1.4.4.

5. **Query binding regression in 1.5.1**
   - Issue [#21788](https://github.com/duckdb/duckdb/issues/21788)
   - Symptom: `Failed to bind column reference ... inequal types (VARCHAR != BIGINT)`.
   - Why severe: regression from 1.5.0 to 1.5.1 on an existing database workload.

6. **`ORDER BY ... LIMIT` on certain Unicode `VARCHAR` values crashes**
   - Issue [#21832](https://github.com/duckdb/duckdb/issues/21832)
   - Symptom: `Invalid unicode (byte sequence mismatch)`.
   - Why severe: sorting/limiting text is a core operation; the affected example (`Til Ærø`) suggests locale/UTF handling edge cases in string processing.

### Medium
7. **`LOAD motherduck` problems after upgrade to 1.5.1**
   - Issue [#21771](https://github.com/duckdb/duckdb/issues/21771)
   - Why it matters: connector/extension compatibility issue; impacts embedded/cloud workflows.

8. **`CREATE SEQUENCE MINVALUE` ignored**
   - Issue [#21813](https://github.com/duckdb/duckdb/issues/21813)
   - Fix signal: issue marked **PR submitted**
   - Why it matters: SQL compatibility and metadata correctness problem.

9. **Parser misses `NOT(IS NULL)` simplification**
   - Issue [#21809](https://github.com/duckdb/duckdb/issues/21809)
   - Why it matters: parser normalization/SQL rewrite completeness rather than severe end-user breakage.

10. **`COMMENT ON COLUMN` fails with `STRUCT` types**
   - Issue [#17517](https://github.com/duckdb/duckdb/issues/17517)
   - Why it matters: metadata usability gap for nested schemas.

### Relevant open hardening PRs
- CSV out-of-bound access fix: [#21840](https://github.com/duckdb/duckdb/pull/21840)
- `is_histogram_other_bin` null handling fix: [#21841](https://github.com/duckdb/duckdb/pull/21841)
- DISTINCT CTE + LEFT JOIN wrong-result fix: [#21804](https://github.com/duckdb/duckdb/pull/21804)
- Macro expansion blow-up fix: [#21801](https://github.com/duckdb/duckdb/pull/21801)
- Lateral constant struct args fix: [#21827](https://github.com/duckdb/duckdb/pull/21827)
- Lost logs after truncation fix: [#21830](https://github.com/duckdb/duckdb/pull/21830)

## 6. Feature Requests & Roadmap Signals

Today's data is dominated by fixes, but a few roadmap signals stand out:

### Likely near-term
- **Statistics-powered aggregate optimization**
  - PR [#21831](https://github.com/duckdb/duckdb/pull/21831)
  - This looks like a realistic candidate for a near-future release: using row group statistics to partially answer `min`, `max`, and `count(*)` without full scans is aligned with DuckDB’s analytical engine strengths.

- **Improved metadata introspection**
  - PR [#21794](https://github.com/duckdb/duckdb/pull/21794)
  - Exposing column tags via `duckdb_columns()` fits DuckDB’s growing metadata/catalog tooling story and is low-risk enough to plausibly land soon once CI issues clear.

- **Parquet fidelity for 128-bit integers**
  - PR [#21252](https://github.com/duckdb/duckdb/pull/21252)
  - Fixing `HUGEINT/UHUGEINT` precision loss is a significant storage correctness upgrade with strong user value.

### More uncertain
- **Extensible CLI dot commands**
  - PR [#21201](https://github.com/duckdb/duckdb/pull/21201)
  - This has clearer product fit than the LLM-specific CLI proposal and could influence future shell architecture, especially for extension ecosystems.

### Lower-probability / policy-misaligned
- **Built-in LLM CLI session command**
  - PR [#21041](https://github.com/duckdb/duckdb/pull/21041)
  - The author explicitly notes conflict with project policy, so it should not be viewed as a likely roadmap item.

## 7. User Feedback Summary

A few recurring user pain points are clear from today’s issues:

- **Regression sensitivity after upgrading to 1.5.1**  
  Users are hitting new failures in extension loading, query binding, memory behavior, and text sorting:
  - [#21771](https://github.com/duckdb/duckdb/issues/21771)
  - [#21788](https://github.com/duckdb/duckdb/issues/21788)
  - [#21836](https://github.com/duckdb/duckdb/issues/21836)
  - [#21832](https://github.com/duckdb/duckdb/issues/21832)

- **Semi-structured and interoperability workflows are now mainstream usage**  
  The issue mix shows DuckDB users increasingly rely on:
  - JSON/VARIANT workflows: [#21779](https://github.com/duckdb/duckdb/issues/21779)
  - Arrow interchange: [#21842](https://github.com/duckdb/duckdb/issues/21842)
  - JSON/CSV auto-typing: [#14919](https://github.com/duckdb/duckdb/issues/14919)

- **SQL compatibility and metadata completeness still matter**  
  Even as DuckDB expands engine internals, users continue to care about standards-like behavior and discoverability:
  - Sequence metadata correctness: [#21813](https://github.com/duckdb/duckdb/issues/21813)
  - Column comments on nested types: [#17517](https://github.com/duckdb/duckdb/issues/17517)

- **Users remain positive about DuckDB’s ETL strengths**  
  One report explicitly praises DuckDB’s practical SQL looseness for ETL workloads in the `COMMENT ON COLUMN` issue [#17517](https://github.com/duckdb/duckdb/issues/17517), reinforcing that flexibility remains appreciated despite edge-case gaps.

## 8. Backlog Watch

Items that appear important and may need maintainer attention:

1. **Old but still active ingestion-type inference issue**
   - Issue [#14919](https://github.com/duckdb/duckdb/issues/14919)
   - Created 2024-11-20, still active, high user validation.
   - Why watch: user-facing documentation/behavior mismatch in timestamp auto-detection.

2. **Nested type metadata support gap**
   - Issue [#17517](https://github.com/duckdb/duckdb/issues/17517)
   - Created 2025-05-16.
   - Why watch: `COMMENT ON COLUMN` with `STRUCT` types affects schema documentation in complex analytics models.

3. **Stale but strategically relevant CLI extensibility**
   - PR [#21201](https://github.com/duckdb/duckdb/pull/21201)
   - Why watch: could matter for extension ecosystem and shell usability if maintainers want a plugin-style CLI.

4. **Parquet 128-bit integer precision fix waiting in review**
   - PR [#21252](https://github.com/duckdb/duckdb/pull/21252)
   - Why watch: silent precision loss is a serious data correctness concern.

5. **Column tags exposure blocked by CI**
   - PR [#21794](https://github.com/duckdb/duckdb/pull/21794)
   - Why watch: practical metadata enhancement, likely easy user win if stabilized.

## Bottom Line

DuckDB is having a **busy stabilization day**: strong contributor throughput, quick turnaround on some interoperability bugs, and visible work on planner/storage optimizations. The main short-term concern is **1.5.1-era regressions and internal errors** affecting production-style workloads, especially around **semi-structured data, Unicode handling, and write/export paths**. The most encouraging sign is that several serious reports already have associated PRs or adjacent fixes in motion, indicating a healthy and responsive maintenance cycle.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-04-05

## 1. Today's Overview

StarRocks showed **healthy day-to-day development activity** with **18 PRs updated** and **7 issues updated** in the last 24 hours, although there were **no new releases**. The strongest signal today is a concentration of work on **bug fixes and internal refactors**, especially around **SQL compatibility**, **metadata/statistics correctness**, and **execution/storage internals**. Several newly opened bugs already have matching PRs, which suggests **fast maintainer or contributor response time** on user-reported regressions. At the same time, a few open items indicate ongoing demand for **better observability**, **external catalog compatibility**, and **security/privilege hardening**.

---

## 3. Project Progress

### Merged/closed PRs today

Even without a release, several closed PRs indicate active forward motion in core engine internals and correctness work:

- **Fix off-by-one in ORC column statistics extraction** — [PR #71300](https://github.com/StarRocks/starrocks/pull/71300)  
  This addresses incorrect metric extraction in `AddFilesProcedure` for ORC files, where ORC file-level stats occupy index 0 and column stats begin at index 1. This is a **query planning / metadata correctness** improvement for lakehouse ingestion and file-based statistics handling.

- **Add MutableRawDataVisitor** — [PR #71293](https://github.com/StarRocks/starrocks/pull/71293)  
  Part of an ongoing column API cleanup effort. This refactor improves safety around raw column buffer access and prepares for removal of unsafe interfaces.

- **Remove Column::mutable_raw_data** — [PR #71298](https://github.com/StarRocks/starrocks/pull/71298)  
  Continues storage engine/internal column abstraction cleanup. This likely reduces crash-prone behavior and tightens memory access semantics in the vectorized execution/storage layer.

- **Move RuntimeFilterProbeCollector::wait to ExecCore** — [PR #71289](https://github.com/StarRocks/starrocks/pull/71289)  
  An execution framework refactor affecting runtime filter plumbing in the query engine.

- **Remove from add_rf_event ExecEnv** — [PR #71288](https://github.com/StarRocks/starrocks/pull/71288)  
  Another execution environment cleanup, consistent with modularization of runtime filter and execution context code.

- **Add ExecEnv guardrails and context scaffolding** — [PR #71299](https://github.com/StarRocks/starrocks/pull/71299)  
  Suggests ongoing architectural hardening in execution environment management, likely to support cleaner thread/context ownership and future reliability work.

### What these changes mean

Today’s closed work is less about user-visible features and more about **raising internal quality**:
- **Storage/metadata correctness**: ORC stats handling fix.
- **Execution engine maintainability**: runtime filter / ExecEnv refactors.
- **Column/storage API safety**: visitor-based raw data access replacing brittle interfaces.

This is generally a positive sign for long-term engine stability and maintainability.

---

## 4. Community Hot Topics

### 1) Data cache metrics in Prometheus
- Issue: **Add exporting Data Cache metrics to prometheus /metrics endpoint on CN** — [Issue #55491](https://github.com/StarRocks/starrocks/issues/55491)
- Related PR: **Cache hit rate prometheus** — [PR #58204](https://github.com/StarRocks/starrocks/pull/58204)

Although the issue was closed as stale, the corresponding long-lived PR is still open and active. This points to a persistent user need: **native observability for CN data cache behavior without custom sidecars**. The technical need is straightforward—operators want **Prometheus-first telemetry** from the standard `/metrics` endpoint rather than scraping a separate API and transforming output. This is a classic operational maturity ask and remains relevant for production users.

### 2) SQLAlchemy / Superset compatibility
- Issue: **TypeError: unhashable type: 'ReflectedPartitionInfo' in Python SQLAlchemy dialect** — [Issue #70733](https://github.com/StarRocks/starrocks/issues/70733)
- Fix PR: **Make SQLAlchemy reflection dataclasses hashable** — [PR #71302](https://github.com/StarRocks/starrocks/pull/71302)

This is one of today’s clearest compatibility topics. The issue breaks **Apache Superset dataset creation**, meaning it directly affects BI adoption. The underlying need is **ecosystem compatibility with SQLAlchemy-based tools**. Fast turnaround here is strategically important because BI integration quality strongly influences database adoption.

### 3) Columns with dots in names
- Issue: **`getQueryStatisticsColumnType` throws SemanticException for columns with dots in their names** — [Issue #70810](https://github.com/StarRocks/starrocks/issues/70810)
- Fix PR: **Fix statistics collection for columns with dots in names** — [PR #71301](https://github.com/StarRocks/starrocks/pull/71301)

This reflects pressure for **SQL edge-case compatibility**. Users increasingly expect engines to correctly support quoted identifiers even when they contain characters that overlap with parser/path semantics. The deeper technical requirement is separating **identifier parsing** from **nested field/path resolution** in metadata/statistics code.

### 4) External catalog privilege semantics
- Issue: **GRANT fails for ALL VIEWS in Iceberg catalog (4.1rc1)** — [Issue #71211](https://github.com/StarRocks/starrocks/issues/71211)
- Fix PR: **Fix GRANT on ALL VIEWS/MVs failing for external catalogs** — [PR #71295](https://github.com/StarRocks/starrocks/pull/71295)

This is a notable topic because it touches **governance across lakehouse/external catalogs**, a major area for StarRocks users. The need is clear: permission models should behave consistently across internal and external catalogs, especially for Iceberg deployments.

### 5) Docs for LLM/discoverability
- PR: **Generate llms.txt** — [PR #71297](https://github.com/StarRocks/starrocks/pull/71297)
- PR: **split metrics doc into multiple pages to improve indexing** — [PR #71117](https://github.com/StarRocks/starrocks/pull/71117)

This suggests a docs strategy shift toward **machine-readable discoverability** and better indexing. It indicates maintainers are thinking about both human and AI-assisted documentation consumption.

---

## 5. Bugs & Stability

Ranked by likely severity and production impact:

### High severity

1. **DROP TASK has no privilege check — any user can delete any task including Pipe-internal tasks**  
   - Issue: [#71294](https://github.com/StarRocks/starrocks/issues/71294)  
   This is the most serious newly reported issue because it is a **security and multi-tenant isolation problem**, not just correctness. If confirmed, arbitrary users may be able to delete tasks they do not own, including internal pipeline tasks. No fix PR is listed yet. This likely needs urgent maintainer attention.

2. **Primary Key tablet corruption in column-mode partial update**  
   - PR: [#69652](https://github.com/StarRocks/starrocks/pull/69652)  
   This older but still-open PR addresses severe storage corruption and BE crashes caused by unsigned underflow in `PersistentIndex::erase()`. The described blast radius is high because it can affect **all replicas simultaneously**. Not a new issue today, but it remains one of the highest-risk backlog items.

### Medium severity

3. **GRANT fails for ALL VIEWS in Iceberg catalog (4.1rc1)**  
   - Issue: [#71211](https://github.com/StarRocks/starrocks/issues/71211)  
   - Fix PR: [#71295](https://github.com/StarRocks/starrocks/pull/71295)  
   A **governance/authorization correctness** bug affecting external catalogs. Important for enterprise deployments and release candidate quality. A fix exists, reducing immediate risk.

4. **ORC column statistics extraction off-by-one**  
   - Issue: [#71222](https://github.com/StarRocks/starrocks/issues/71222)  
   - Closed PR: [#71300](https://github.com/StarRocks/starrocks/pull/71300)  
   This is a metadata/statistics correctness issue that can impact planning, introspection, or ingestion metrics. Fast closure is a good sign.

5. **Column names containing dots break statistics collection**  
   - Issue: [#70810](https://github.com/StarRocks/starrocks/issues/70810)  
   - Fix PR: [#71301](https://github.com/StarRocks/starrocks/pull/71301)  
   Impacts SQL compatibility for valid quoted identifiers. The presence of a prompt fix suggests this is manageable.

6. **SQLAlchemy dialect breaks Superset dataset creation due to unhashable reflection dataclasses**  
   - Issue: [#70733](https://github.com/StarRocks/starrocks/issues/70733)  
   - Fix PR: [#71302](https://github.com/StarRocks/starrocks/pull/71302)  
   This is an ecosystem integration bug rather than core engine instability, but it is important for user onboarding and BI interoperability.

### Low severity / operational noise

7. **Predicate column vacuuming runs unnecessarily when TTL is negative or usage is empty**  
   - Issue: [#71291](https://github.com/StarRocks/starrocks/issues/71291)  
   - PR: [#71290](https://github.com/StarRocks/starrocks/pull/71290)  
   Not a correctness failure, but it creates **useless audit log noise** and unnecessary maintenance activity. Relevant for operational cleanliness.

---

## 6. Feature Requests & Roadmap Signals

### Strong signals

- **Prometheus-native data cache metrics**  
  - Issue: [#55491](https://github.com/StarRocks/starrocks/issues/55491)  
  - PR: [#58204](https://github.com/StarRocks/starrocks/pull/58204)  
  This remains one of the clearest user-facing observability asks. Because a PR already exists, this is a plausible candidate for inclusion in a future minor release if revived and reviewed.

- **Create Hive external table support**  
  - PR: [#42757](https://github.com/StarRocks/starrocks/pull/42757)  
  This is a long-running feature request aligned with StarRocks’ lakehouse positioning. If merged, it would strengthen **metastore interoperability** and external catalog workflows.

- **Unified IVM framework enhancements for Iceberg**  
  - PR: [#71292](https://github.com/StarRocks/starrocks/pull/71292)  
  This is an important roadmap signal. It shows active investment in **incremental view maintenance** and **Iceberg-aware rewrite planning**, especially replacing TVR for simpler patterns. This suggests future releases may improve **incremental MV refresh efficiency** for lakehouse workloads.

- **LLM-friendly docs / docs indexing improvements**  
  - PRs: [#71297](https://github.com/StarRocks/starrocks/pull/71297), [#71117](https://github.com/StarRocks/starrocks/pull/71117)  
  Not a database feature per se, but a signal that project maintainers care about **discoverability and documentation UX**.

### Likely near-term inclusions in the next version
Most likely, based on freshness and active PRs:
1. SQLAlchemy/Superset compatibility fix — [#71302](https://github.com/StarRocks/starrocks/pull/71302)
2. Dot-containing column name statistics fix — [#71301](https://github.com/StarRocks/starrocks/pull/71301)
3. External catalog GRANT fix for ALL VIEWS/MVs — [#71295](https://github.com/StarRocks/starrocks/pull/71295)
4. Predicate column vacuum suppression enhancement — [#71290](https://github.com/StarRocks/starrocks/pull/71290)

---

## 7. User Feedback Summary

Today’s user feedback clusters around a few practical pain points:

- **BI tool interoperability matters a lot.**  
  The SQLAlchemy dialect issue affecting Superset — [Issue #70733](https://github.com/StarRocks/starrocks/issues/70733) — shows that users expect StarRocks to work smoothly in standard Python analytics stacks.

- **Quoted identifier edge cases still matter in production.**  
  The dotted-column-name bug — [Issue #70810](https://github.com/StarRocks/starrocks/issues/70810) — reflects real schemas coming from event tracking, semi-structured ingestion, or external systems.

- **External catalog support is now mainstream, not niche.**  
  The Iceberg privilege problem — [Issue #71211](https://github.com/StarRocks/starrocks/issues/71211) — indicates users are actively operating StarRocks in federated lakehouse environments and expect first-class governance there.

- **Operators want lower-friction observability.**  
  The data cache Prometheus request — [Issue #55491](https://github.com/StarRocks/starrocks/issues/55491), [PR #58204](https://github.com/StarRocks/starrocks/pull/58204) — highlights the desire for native metrics export rather than custom sidecars and endpoint adapters.

- **Users care about reducing operational noise, not just correctness bugs.**  
  The predicate vacuum issue — [Issue #71291](https://github.com/StarRocks/starrocks/issues/71291) — shows demand for cleaner audit logs and fewer unnecessary background tasks.

Overall, feedback suggests users are deploying StarRocks in **production-grade BI, external catalog, and observability-sensitive environments**.

---

## 8. Backlog Watch

These items appear important and likely need maintainer attention due to age, severity, or strategic value:

1. **PK tablet corruption in column-mode partial update**  
   - [PR #69652](https://github.com/StarRocks/starrocks/pull/69652)  
   High severity and potentially data-corrupting. This should remain on the radar until merged/backported.

2. **Cache hit rate / data cache metrics on Prometheus endpoint**  
   - [PR #58204](https://github.com/StarRocks/starrocks/pull/58204)  
   A long-open observability PR tied to a recurring operator need. Important for production ergonomics.

3. **Support create hive external table**  
   - [PR #42757](https://github.com/StarRocks/starrocks/pull/42757)  
   Old but strategically relevant to lakehouse interoperability. Worth clarifying whether this is still desired and what blockers remain.

4. **Fix batch publish blocked by incorrect transaction graph**  
   - [PR #71168](https://github.com/StarRocks/starrocks/pull/71168)  
   This affects transaction publish ordering and may have broad correctness/availability implications across 3.5/4.0/4.1 branches.

5. **DROP TASK privilege gap**  
   - [Issue #71294](https://github.com/StarRocks/starrocks/issues/71294)  
   Newly reported, but likely urgent given the security angle. Even though it is fresh, it deserves backlog escalation rather than normal triage delay.

---

## Project Health Assessment

The project looks **active and responsive**, with a strong pattern of **same-day or near-term fixes** for user-reported bugs. Current momentum is concentrated in **correctness, compatibility, and internal engine refactoring**, which is healthy for a mature analytical database. The main watch-outs are **security/privilege enforcement**, **high-severity storage correctness backlog**, and a few **long-running strategic PRs** that would benefit from clearer maintainer decisions.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-04-05

## 1. Today's Overview

Apache Iceberg showed **healthy day-to-day engineering activity** with **19 PRs updated** and **8 issues updated** in the last 24 hours, though there were **no new releases**. The work mix is broad: Spark, Flink, AWS/Glue, REST/OpenAPI, Kafka Connect, docs, and core metadata/lifecycle logic all saw movement. Most issue churn today came from **stale bug/feature cleanup**, while active development is concentrated in **correctness, cloud reliability, type-system evolution, and connector capabilities**. Overall, the project appears **active and technically diverse**, with current momentum strongest around **engine integration hardening and API/spec evolution**.

## 2. Project Progress

### Merged/closed PRs today

Although there were no releases, several PRs were closed today, giving some signal about what did or did not advance:

- [#15455](https://github.com/apache/iceberg/pull/15455) — **Spark: Support reading Avro local-timestamp-* logical types** — **closed**
  - Would have improved Spark compatibility with Avro logical timestamp types.
  - Its closure suggests this compatibility gap remains unresolved or is being reworked elsewhere.

- [#15454](https://github.com/apache/iceberg/pull/15454) — **Flink: Support reading Avro local-timestamp-* logical types** — **closed**
  - Similar compatibility work for Flink Avro readers.
  - Important for cross-engine timestamp semantics, but not landed today.

- [#15435](https://github.com/apache/iceberg/pull/15435) — **Add primitive tests on the TCK** — **closed**
  - Focused on strengthening interoperability validation with broader primitive-type coverage.
  - Even though closed, it highlights continued attention to **conformance and test completeness**.

- [#15101](https://github.com/apache/iceberg/pull/15101) — **Secondary Index metadata handling POC implementation** — **closed**
  - A proof-of-concept around secondary index metadata.
  - Closure indicates secondary indexing is still **exploratory rather than near-term productized**.

### Active progress signals from open PRs

More meaningful forward progress today is visible in open PRs that were actively updated:

- [#15862](https://github.com/apache/iceberg/pull/15862) — **Core: Fix shared LockManagers scheduler shutdown**
  - A clear **stability/correctness** fix in concurrent lock-manager lifecycle handling.

- [#15530](https://github.com/apache/iceberg/pull/15530) — **Glue: Check commit status on non-deterministic AWS errors**
  - High-value **cloud commit reliability** improvement to avoid metadata corruption on timeout-like AWS failures.

- [#15884](https://github.com/apache/iceberg/pull/15884) — **Flink: Fix watermark value which should be min timestamp minus one**
  - A likely **streaming correctness** fix affecting event-time behavior.

- [#15211](https://github.com/apache/iceberg/pull/15211) — **support page skipping when using vectorized Parquet reader**
  - Significant **scan-performance optimization** work for Parquet predicate pushdown/page-level skipping.

- [#15283](https://github.com/apache/iceberg/pull/15283) — **Kafka Connect: Support VARIANT when record convert**
  - Expands semi-structured data ingestion support.

- [#14297](https://github.com/apache/iceberg/pull/14297) — **Spark: Support writing shredded variant in Iceberg-Spark**
  - Important for **VARIANT ecosystem support** and richer nested/semi-structured write paths.

## 3. Community Hot Topics

### Most active issues / PRs by comments or strategic importance

- [Issue #13297](https://github.com/apache/iceberg/issues/13297) — **Spark memory leak with coalesce + foreachPartition** — **31 comments**, closed as stale  
  - This was the most discussed updated issue.
  - The underlying need is clear: users want Iceberg scans in Spark to behave safely in low-level iterator-heavy processing patterns without hidden retention or memory pressure.
  - Even though stale-closed, memory behavior in Spark remains a high-sensitivity topic for production users.

- [Issue #13850](https://github.com/apache/iceberg/issues/13850) — **Schema update fails when dropping column with highest field ID** — **12 comments**, closed as stale  
  - Indicates user concern around **schema evolution correctness**, especially after upgrading to 1.9.2.
  - The technical need here is robust handling of field-ID-based schema transforms across edge cases.

- [Issue #14227](https://github.com/apache/iceberg/issues/14227) — **INFO logs flooded in iceberg-rest-fixture image** — **7 comments**, open  
  - This points to a practical operability problem: test/dev containers are too noisy, especially with REST fixture + Postgres setups.
  - Suggests growing use of Iceberg’s REST components in CI, local testing, and integration environments.

- [PR #11041](https://github.com/apache/iceberg/pull/11041) — **Materialized View Spec** — long-running spec PR  
  - Even without visible comment count here, this remains one of the most strategically important open threads.
  - It reflects continued demand for **higher-level derived-table semantics** in the Iceberg ecosystem.

- [PR #15280](https://github.com/apache/iceberg/pull/15280) — **REST Spec: support credential refresh on staged tables**
  - Signals strong interest in **REST catalog operational maturity**, especially for staged writes and cloud credentials.

### Technical themes behind the discussion

1. **Schema evolution safety**
2. **Cloud commit correctness and recovery**
3. **Spark/Flink semantic parity**
4. **Semi-structured / VARIANT support**
5. **REST catalog production-readiness**

## 4. Bugs & Stability

Ranked by likely severity and production impact:

### High severity

1. [PR #15530](https://github.com/apache/iceberg/pull/15530) — **Glue commit status on non-deterministic AWS errors**
   - Potential impact: **table corruption / broken metadata references** if a commit succeeds remotely but local cleanup deletes the metadata file after a timeout-like exception.
   - This is one of the most serious active stability items because it affects commit atomicity assumptions in AWS Glue-backed environments.
   - **Fix PR exists:** yes, this PR itself.

2. [PR #15862](https://github.com/apache/iceberg/pull/15862) — **shared LockManagers scheduler shutdown**
   - Potential impact: concurrency/lifecycle failures in applications using multiple in-memory lock managers.
   - Severity is elevated because it can trigger hard-to-debug failures in services embedding Iceberg.
   - **Fix PR exists:** yes.

3. [Issue #13850](https://github.com/apache/iceberg/issues/13850) — **Dropping column with highest field ID fails**
   - Potential impact: broken schema evolution workflows after upgrade.
   - Even though the issue was stale-closed, this is a **query metadata correctness** issue and should remain on the radar.
   - **Fix PR exists in provided data:** none visible.

### Medium severity

4. [PR #15884](https://github.com/apache/iceberg/pull/15884) — **Flink watermark should be min timestamp minus one**
   - Potential impact: incorrect streaming watermark progression, which can affect late data handling and event-time computations.
   - **Fix PR exists:** yes.

5. [Issue #15369](https://github.com/apache/iceberg/issues/15369) — **RemoveDanglingDeleteFiles lacks branch support and skips unpartitioned tables**
   - Potential impact: incomplete maintenance behavior and silent no-op outcomes.
   - Important because maintenance actions should be predictable, especially for branch-aware table management.
   - **Fix PR exists in provided data:** none visible.

6. [Issue #14227](https://github.com/apache/iceberg/issues/14227) — **REST fixture log flooding**
   - Operational annoyance rather than correctness failure, but can impair debugging and increase CI/container noise.
   - **Fix PR exists in provided data:** none visible.

### Lower severity / unresolved but notable

7. [Issue #13297](https://github.com/apache/iceberg/issues/13297) — **Spark memory leak in coalesce + foreachPartition pattern**
   - Potentially severe in practice, but stale closure means no active resolution path is visible today.
   - If reproducible on current versions, it deserves renewed attention.

8. [Issue #14146](https://github.com/apache/iceberg/issues/14146) — **Incorrect UGI retrieval in Spark master context**
   - Security/context propagation issues can matter in Kerberos/Hadoop-integrated deployments.
   - Closed stale, no visible fix.

## 5. Feature Requests & Roadmap Signals

Today’s open issues and PRs suggest several roadmap directions:

### Strong signals

- [Issue #14249](https://github.com/apache/iceberg/issues/14249) — **Optimize `net_changes` changelog view using identifier columns**
  - Strong signal that users want **cheaper changelog processing**.
  - Likely relevant for CDC-style workloads and snapshot-diff analytics.
  - This feels like a plausible candidate for future optimization work in an upcoming release.

- [Issue #14160](https://github.com/apache/iceberg/issues/14160) — **Customized snapshot metadata for Flink**
  - Users want Flink to reach parity with Spark on snapshot-property metadata customization.
  - Good chance of eventual adoption because it is incremental, practical, and aligns with cross-engine consistency goals.

- [Issue #14265](https://github.com/apache/iceberg/issues/14265) — **Allow v3 date -> time promotion**
  - Signals continued evolution of the **type promotion matrix** in spec v3.
  - Likely to move if maintainers prioritize broader type-system completion.

- [PR #14297](https://github.com/apache/iceberg/pull/14297) — **Spark shredded VARIANT writing**
  - Strong roadmap signal toward richer **semi-structured data support**.
  - If merged, this would materially improve Iceberg’s positioning for JSON-like/variant-heavy analytics.

- [PR #15283](https://github.com/apache/iceberg/pull/15283) — **Kafka Connect VARIANT conversion**
  - Together with #14297, this suggests VARIANT is becoming a real cross-module investment area.

### Medium-confidence signals

- [PR #15211](https://github.com/apache/iceberg/pull/15211) — **Parquet page skipping with vectorized reader**
  - Very plausible next-version candidate because it is a direct performance enhancement with broad user value.

- [PR #15280](https://github.com/apache/iceberg/pull/15280) — **REST staged-table credential refresh**
  - Likely to matter for cloud-native catalog deployments and staging workflows.

- [PR #11041](https://github.com/apache/iceberg/pull/11041) — **Materialized View Spec**
  - Strategic but likely longer horizon due to spec complexity and ecosystem coordination needs.

## 6. User Feedback Summary

Based on the updated issues and PRs, current user pain points are:

- **Operational reliability in cloud environments**
  - Especially around AWS Glue commit ambiguity and credential/session lifecycle handling.
  - Relevant items: [#15530](https://github.com/apache/iceberg/pull/15530), [#15818](https://github.com/apache/iceberg/pull/15818), [#15242](https://github.com/apache/iceberg/pull/15242)

- **Schema evolution edge cases**
  - Users continue to hit failures when changing schemas in non-trivial ways, especially after upgrades.
  - Relevant items: [#13850](https://github.com/apache/iceberg/issues/13850), [#15814](https://github.com/apache/iceberg/pull/15814)

- **Performance efficiency at scan/changelog time**
  - There is demand for lower-cost changelog materialization and more aggressive Parquet skipping.
  - Relevant items: [#14249](https://github.com/apache/iceberg/issues/14249), [#15211](https://github.com/apache/iceberg/pull/15211)

- **Better support for semi-structured data**
  - VARIANT support is emerging as a meaningful use case across Spark and Kafka Connect.
  - Relevant items: [#14297](https://github.com/apache/iceberg/pull/14297), [#15283](https://github.com/apache/iceberg/pull/15283)

- **Engine parity**
  - Users want Spark and Flink to expose comparable metadata, timestamp handling, and streaming semantics.
  - Relevant items: [#14160](https://github.com/apache/iceberg/issues/14160), [#15454](https://github.com/apache/iceberg/pull/15454), [#15455](https://github.com/apache/iceberg/pull/15455), [#15884](https://github.com/apache/iceberg/pull/15884)

Overall sentiment from today’s data is that users are pushing Iceberg deeper into **production-grade, multi-engine, cloud-native, semi-structured analytics** scenarios—and friction now mostly appears in **edge-case correctness and operational polish**, not basic table-format viability.

## 7. Backlog Watch

These items look important and may need maintainer attention due to age, strategic scope, or unresolved user value:

- [PR #11041](https://github.com/apache/iceberg/pull/11041) — **Materialized View Spec**
  - Open since 2024-08-29.
  - High strategic importance; prolonged open status suggests unresolved design questions.

- [PR #14355](https://github.com/apache/iceberg/pull/14355) — **Spark 4.0 RewriteTablePath support for multiple source/destination prefixes**
  - Useful for migration and path-rewrite workflows.
  - Open for months; worth reviewing if Spark 4 migration support remains a priority.

- [PR #14354](https://github.com/apache/iceberg/pull/14354) — **Optional logging of expired data files during ExpireSnapshots**
  - Addresses production observability for destructive maintenance operations.
  - Important from an operator trust standpoint.

- [PR #15211](https://github.com/apache/iceberg/pull/15211) — **Parquet page skipping in vectorized reader**
  - High-value performance work that could benefit many users if brought to completion.

- [Issue #15369](https://github.com/apache/iceberg/issues/15369) — **RemoveDanglingDeleteFiles branch support and unpartitioned-table behavior**
  - Branch awareness and predictable maintenance semantics are increasingly important as Iceberg branching features mature.

- [Issue #14227](https://github.com/apache/iceberg/issues/14227) — **REST fixture INFO log flooding**
  - A good low-friction cleanup candidate with outsized developer-experience benefits.

- [Issue #14249](https://github.com/apache/iceberg/issues/14249) — **Optimize `net_changes` changelog view**
  - Worth attention because changelog efficiency is increasingly central for incremental processing use cases.

## 8. Overall Health Assessment

Project health today looks **good but somewhat skewed toward maintenance and incremental hardening rather than headline releases**. The strongest engineering themes are **AWS/REST robustness, Spark/Flink correctness, and VARIANT/semi-structured support**. The main risk visible in today’s snapshot is that some meaningful user-reported bugs—especially around schema evolution and Spark memory behavior—were **closed as stale rather than visibly resolved**, which may leave latent pain points in production deployments. Still, the active PR set suggests the maintainers and contributors are steadily improving Iceberg’s reliability and engine interoperability.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-04-05

## 1. Today's Overview
Delta Lake showed moderate development activity over the last 24 hours, with **10 pull requests updated** and **no issue activity** or releases. The day’s work was concentrated in **Spark/DSv2 integration, Delta Kernel spec compliance, sharing support for VARIANT-related features, and a few targeted correctness/maintenance fixes**. Overall, this suggests the project is in an **implementation and refinement phase** rather than a community support or release cycle. Health looks stable: there are no fresh issue reports in the provided data, but several open PRs indicate active work on platform evolution and compatibility.

## 3. Project Progress
Merged/closed PR activity today points to progress in internal correctness, compatibility, and maintainability:

- **Legacy checkpoint / streaming batch priming fix**
  - PR: [#6479](https://github.com/delta-io/delta/pull/6479) — *Use MD5 fileIdHash for priming getBatch when both offsets are from legacy checkpoint*
  - Status: Closed
  - Analysis: This appears related to **streaming or incremental read correctness** when reconciling offsets derived from older checkpoint formats. Even though the PR is closed rather than explicitly marked merged, it signals active work around **backward compatibility with legacy checkpoints**, an important stability area for long-running production pipelines.

- **Kernel geospatial type fixes for 3.3.1**
  - PR: [#6463](https://github.com/delta-io/delta/pull/6463) — *[KERNEL] Fixes for geometry and geography type in 3.3.1*
  - Status: Closed
  - Analysis: This is a notable sign that Delta Kernel is evolving to better support **geometry/geography types**, which matters for SQL compatibility and interoperability with engines adopting richer type systems. Even as a closed PR, it highlights a concrete technical area under active repair.

- **Binary compatibility housekeeping**
  - PR: [#6487](https://github.com/delta-io/delta/pull/6487) — *Add io.delta.internal.* MiMa exclusion*
  - Status: Closed
  - Analysis: This is a maintenance-oriented change aimed at **API/binary compatibility management**. It does not directly add user-facing capability, but it helps keep evolution of internal packages from creating unnecessary compatibility noise during builds and release validation.

Open PRs also show substantial forward motion in engine-facing functionality:

- **Spark DSv2 / Kernel table creation path**
  - PR: [#6449](https://github.com/delta-io/delta/pull/6449) — *Add CreateTableBuilder + V2Mode routing + integration tests*
  - PR: [#6450](https://github.com/delta-io/delta/pull/6450) — *Wire DeltaCatalog.createTable() to DSv2 + Kernel path*
  - Analysis: These are strong roadmap signals toward **deeper Spark DataSource V2 integration** and potentially a cleaner architecture that routes table creation through **Kernel-backed paths**. This can improve engine modularity, testability, and consistency across Delta implementations.

- **Kernel stats spec compliance**
  - PR: [#6461](https://github.com/delta-io/delta/pull/6461) — *[Kernel] added writeStatsAsStruct, writeStatsAsJson to comply with spec*
  - Analysis: This improves **spec compliance** for metadata/statistics handling, with likely downstream benefits for **query planning, data skipping, and interoperability**.

- **Data skipping code organization**
  - PR: [#6490](https://github.com/delta-io/delta/pull/6490) — *Extract DataFiltersBuilder from DataSkippingReader to standalone file*
  - Analysis: Primarily refactoring, but in a performance-sensitive area. Better modularity around **data skipping filter construction** can make future optimizer or predicate-pushdown work easier.

## 4. Community Hot Topics
There is **no issue activity** and no comments/reactions data available, so “hot topics” must be inferred from PR concentration rather than discussion volume.

### Most significant active PR themes

- **Spark DSv2 + Kernel integration**
  - [#6449](https://github.com/delta-io/delta/pull/6449)
  - [#6450](https://github.com/delta-io/delta/pull/6450)
  - Technical need: Delta appears to be aligning more of its table lifecycle with **modern Spark catalog and DSv2 abstractions**, while also leveraging **Delta Kernel** as a reusable lower layer. This is important for long-term engine portability and reducing duplicated logic.

- **VARIANT + Delta Sharing compatibility**
  - [#6492](https://github.com/delta-io/delta/pull/6492) — *[VARIANT][SHARING] allow reading `variantShredding` table feature in sharing*
  - Technical need: Users increasingly want **semi-structured data support** to work consistently across **sharing/distribution scenarios**, not just direct table access. This suggests demand for **feature-complete sharing semantics** as Delta expands into more interoperable data exchange workflows.

- **Type correctness in Spark**
  - [#6491](https://github.com/delta-io/delta/pull/6491) — *[SPARK] Fix byte and short decimal coercion*
  - Technical need: This points to ongoing demand for **SQL/type coercion correctness**, especially around narrow integer and decimal interactions that can cause subtle query failures or silent misbehavior.

- **Kernel metadata/stat compliance**
  - [#6461](https://github.com/delta-io/delta/pull/6461)
  - Technical need: As Delta Kernel becomes more important, **strict adherence to the Delta spec** matters for external readers/writers and consistent engine behavior.

## 5. Bugs & Stability
No new issues were reported today, so there is **no direct bug intake signal** from users in the last 24 hours. Still, the PR stream reveals several probable stability/correctness areas, ranked by likely severity:

1. **Type coercion correctness in Spark**
   - PR: [#6491](https://github.com/delta-io/delta/pull/6491)
   - Risk: **High**
   - Why it matters: Decimal coercion bugs can lead to **incorrect query results, cast failures, or inconsistent SQL behavior**. This is the most clearly user-visible correctness item in today’s PRs.
   - Fix status: Open PR exists.

2. **Legacy checkpoint offset handling / batch priming**
   - PR: [#6479](https://github.com/delta-io/delta/pull/6479)
   - Risk: **Medium-High**
   - Why it matters: Problems around legacy checkpoints can affect **streaming recovery, replay correctness, or incremental read continuity** for existing deployments.
   - Fix status: PR closed; exact disposition not visible from the provided data.

3. **Geometry/geography support in Kernel**
   - PR: [#6463](https://github.com/delta-io/delta/pull/6463)
   - Risk: **Medium**
   - Why it matters: Geospatial type issues can break **schema interpretation and cross-engine compatibility** for specialized workloads.
   - Fix status: PR closed; likely part of branch-specific stabilization for 3.3.1, but not confirmed here.

4. **Stats representation compliance**
   - PR: [#6461](https://github.com/delta-io/delta/pull/6461)
   - Risk: **Medium**
   - Why it matters: Incorrect or incomplete stats encoding can reduce **query optimization quality** and may impair interoperability.
   - Fix status: Open PR exists.

No crashes or severe regressions were explicitly reported in the available data.

## 6. Feature Requests & Roadmap Signals
Although there were no new issues requesting features, the current PR set provides strong roadmap clues:

- **Broader support for VARIANT in shared datasets**
  - PR: [#6492](https://github.com/delta-io/delta/pull/6492)
  - Signal: Delta Lake is likely continuing to invest in **semi-structured data support** and ensuring those capabilities work in **Delta Sharing** flows, not only local readers.
  - Likelihood next version: **High**, assuming this lands soon.

- **Deeper DSv2 and catalog-path modernization**
  - PRs: [#6449](https://github.com/delta-io/delta/pull/6449), [#6450](https://github.com/delta-io/delta/pull/6450)
  - Signal: This looks like a strategic architectural direction rather than a one-off patch. Expect continued work on **Spark catalog integration, create-table routing, and Kernel-backed execution paths**.
  - Likelihood next version: **High** for partial rollout, especially behind existing APIs.

- **Kernel conformance and engine-neutral foundations**
  - PR: [#6461](https://github.com/delta-io/delta/pull/6461)
  - Signal: Delta Kernel appears to remain a priority, especially in areas that improve **spec fidelity and cross-implementation reliability**.
  - Likelihood next version: **High**.

- **Data skipping maintainability / future optimization groundwork**
  - PR: [#6490](https://github.com/delta-io/delta/pull/6490)
  - Signal: Not a feature by itself, but it may precede more substantial **predicate/data-skipping improvements**.

## 7. User Feedback Summary
There is **no direct user feedback** in today’s dataset because no issues were updated and PR comment/reaction counts are unavailable. Indirectly, the active work suggests the following user pain points are being addressed:

- Need for **correct Spark SQL type behavior**, especially around decimals and coercion
  - [#6491](https://github.com/delta-io/delta/pull/6491)

- Need for **smooth interoperability across shared datasets**, particularly with newer table features like VARIANT shredding
  - [#6492](https://github.com/delta-io/delta/pull/6492)

- Need for **stable migration/continuity from legacy checkpoint formats**
  - [#6479](https://github.com/delta-io/delta/pull/6479)

- Need for **strong engine-neutral semantics and metadata compliance** as Kernel adoption grows
  - [#6461](https://github.com/delta-io/delta/pull/6461)

Overall satisfaction cannot be inferred from this snapshot, but the engineering focus is clearly aligned with **correctness, compatibility, and architecture modernization** rather than net-new end-user syntax.

## 8. Backlog Watch
Because there are **no active issues in the provided data**, backlog risk is visible mainly through open PRs that look strategically important and may need careful maintainer attention:

- **DSv2 create-table stack**
  - [#6449](https://github.com/delta-io/delta/pull/6449)
  - [#6450](https://github.com/delta-io/delta/pull/6450)
  - Why it matters: These are substantial architectural PRs and likely part of a stacked series. Such changes often require coordinated review across Spark integration, catalog semantics, and Kernel behavior.

- **Kernel stats spec compliance**
  - [#6461](https://github.com/delta-io/delta/pull/6461)
  - Why it matters: Spec compliance changes can have broad impact on interoperability and optimizer behavior; review quality is important.

- **VARIANT Sharing support**
  - [#6492](https://github.com/delta-io/delta/pull/6492)
  - Why it matters: This is a meaningful product capability extension for users depending on Delta Sharing and semi-structured data.

- **Spark decimal coercion fix**
  - [#6491](https://github.com/delta-io/delta/pull/6491)
  - Why it matters: Query correctness fixes generally deserve fast maintainer attention due to potential user-visible impact.

- **Low-signal PR needing triage**
  - [#6489](https://github.com/delta-io/delta/pull/6489) — *tests*
  - Why it matters: Minimal-description PRs can consume reviewer time unless quickly clarified, scoped, or closed.

## Overall Health Assessment
Delta Lake appears **healthy and actively maintained**, with current momentum centered on **Spark DSv2 modernization, Kernel maturation, sharing compatibility, and correctness fixes**. The absence of issue churn suggests a quiet support day, though it also limits visibility into real-time user pain. If the open architectural PRs land cleanly, the next release is likely to strengthen **engine abstraction, interoperability, and standards compliance** more than headline user-facing features.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-04-05

## 1. Today's Overview

Databend showed light but focused development activity over the last 24 hours: no issue movement, no releases, and 7 pull requests updated, with 6 still open and 1 closed. The workstream is concentrated on query correctness, SQL compatibility, and analytical storage capabilities rather than large-scale release packaging. Several open PRs indicate active refinement of planner/semantic behavior and continued expansion of FUSE-table metadata features. Overall, project health looks steady, with engineering effort skewed toward incremental correctness fixes and feature maturation rather than emergency stabilization.

## 3. Project Progress

### Merged/closed PRs today

#### 1. AUTO datetime format detection
- **PR:** [#19659](https://github.com/databendlabs/databend/pull/19659) — `feat(sql): add AUTO datetime format detection`
- **Status:** Closed
- **Author:** @TCeason

This PR introduced a session setting, `enable_auto_detect_datetime_format`, intended to enable deterministic inference for a predefined set of non-ISO datetime formats. Even though it is closed rather than clearly merged from the provided data, it signals active work on SQL usability and ingestion compatibility, especially for messy real-world timestamp inputs. This is relevant for analytical workloads where imported CSV/text data often contains mixed datetime representations.

**Technical significance:**
- Improves SQL/data loading ergonomics.
- Suggests Databend is investing in better type inference and ingestion flexibility.
- May reappear in revised form if concerns were found during review.

## 4. Community Hot Topics

There were no issues updated today, and the provided PR metadata does not include comment counts, so “hot topics” are best inferred from the technical concentration of the most recently updated pull requests.

### Query correctness and SQL semantics
1. [#19595](https://github.com/databendlabs/databend/pull/19595) — `fix(query): handle empty LIKE ESCAPE in planner`  
   This fix addresses planner behavior around `LIKE ... ESCAPE`, specifically preventing an invalid fast-path optimization when the escape string is empty. The underlying need is standards-compliant SQL semantics and avoiding incorrect planner rewrites.

2. [#19594](https://github.com/databendlabs/databend/pull/19594) — `fix(query): return semantic error for invalid grouping()`  
   This targets aggregate rewrite and constant folding interactions, ensuring invalid `GROUPING()` usage raises a semantic error rather than failing later. The technical theme is robust semantic validation before optimization.

3. [#19615](https://github.com/databendlabs/databend/pull/19615) — `fix(query): support IF NOT EXISTS for ALTER TABLE ADD COLUMN`  
   This is a practical SQL compatibility enhancement that reduces migration friction and improves idempotent schema evolution workflows.

### Storage and metadata introspection
4. [#19664](https://github.com/databendlabs/databend/pull/19664) — `feat(storage): add fuse_tag table function to list snapshot tags`  
   This points to growing user demand for better observability and management of FUSE-table snapshot metadata.

5. [#19551](https://github.com/databendlabs/databend/pull/19551) — `feat(query): support experimental table branch`  
   Table branches remain one of the strongest roadmap signals. The work covers branch lifecycle metadata, branch-aware reads/writes, and garbage collection, indicating Databend is pushing toward Git-like data workflows for analytical tables.

### Ingestion compatibility
6. [#19660](https://github.com/databendlabs/databend/pull/19660) — `feat: CSV/TEXT support encoding.`  
   This reflects demand for broader charset handling during staged file ingestion, a common enterprise requirement when dealing with legacy exports and multilingual datasets.

## 5. Bugs & Stability

Ranked by likely severity based on impact to correctness and user-facing behavior:

### High severity
#### 1. Incorrect planner handling of empty `LIKE ESCAPE`
- **PR:** [#19595](https://github.com/databendlabs/databend/pull/19595)
- **Type:** Query correctness / planner bug
- **Impact:** Potentially incorrect execution path for pattern matching semantics.
- **Status:** Open

This is the highest-severity item because planner fast-path misbehavior can silently return wrong results, which is especially serious in analytical systems.

#### 2. Invalid `GROUPING()` semantics not rejected early
- **PR:** [#19594](https://github.com/databendlabs/databend/pull/19594)
- **Type:** Semantic analysis / aggregate rewrite bug
- **Impact:** Invalid SQL may fail in a confusing way or be processed incorrectly during constant folding.
- **Status:** Open

This is a correctness and developer-experience issue. Early semantic rejection is important for predictable SQL behavior.

### Medium severity
#### 3. `ALTER TABLE ADD COLUMN IF NOT EXISTS` unsupported/idempotency gap
- **PR:** [#19615](https://github.com/databendlabs/databend/pull/19615)
- **Type:** SQL compatibility / schema management
- **Impact:** Breaks migration scripts expecting standard idempotent DDL behavior.
- **Status:** Open

This is less about correctness of query execution and more about operational safety and migration compatibility.

### Medium-to-low severity
#### 4. CSV/TEXT charset decoding limitations
- **PR:** [#19660](https://github.com/databendlabs/databend/pull/19660)
- **Type:** Ingestion robustness
- **Impact:** Stage reads may fail or mis-handle non-default encodings.
- **Status:** Open

This matters for real-world ETL pipelines, especially outside UTF-8-only environments.

### No newly reported crashes or issue-based regressions
No issues were updated in the last 24 hours, so there is no direct evidence today of new crash reports, production incidents, or user-reported regressions beyond what can be inferred from active fix PRs.

## 6. Feature Requests & Roadmap Signals

Based on open PRs, the strongest roadmap signals are:

### 1. Branch-aware analytical tables
- **PR:** [#19551](https://github.com/databendlabs/databend/pull/19551)
- **Signal strength:** Very high

Experimental table branch support for FUSE tables suggests Databend is investing in isolated data development, reproducible experimentation, and versioned analytical workflows. This could become a signature capability if stabilized.

### 2. FUSE snapshot/tag introspection
- **PR:** [#19664](https://github.com/databendlabs/databend/pull/19664)
- **Signal strength:** High

The new `fuse_tag('database', 'table')` function indicates an increasing focus on metadata discoverability and snapshot lifecycle tooling. This pairs naturally with branch/tag/versioned data operations.

### 3. Better file ingestion compatibility
- **PR:** [#19660](https://github.com/databendlabs/databend/pull/19660)
- **Signal strength:** High

Encoding support for CSV/TEXT stage reads is a practical feature likely to land soon because it addresses broad ingestion pain with relatively clear user value.

### 4. SQL dialect and migration friendliness
- **PR:** [#19615](https://github.com/databendlabs/databend/pull/19615)
- **Signal strength:** Medium-high

Support for `IF NOT EXISTS` in `ALTER TABLE ... ADD COLUMN` is the kind of compatibility improvement often prioritized for adoption, especially by users porting workloads from MySQL/Postgres-like ecosystems.

### 5. Smarter datetime parsing
- **PR:** [#19659](https://github.com/databendlabs/databend/pull/19659)
- **Signal strength:** Medium

Although closed, automatic datetime format detection still signals user demand for more forgiving and deterministic parsing during ingestion or SQL conversion. A revised implementation may return in a future version.

**Most likely near-term additions in the next version:**
- `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
- CSV/TEXT encoding support
- `fuse_tag()` metadata function

## 7. User Feedback Summary

Because no issues were updated today and the PR metadata lacks reactions/comments, explicit user feedback is limited. Still, the active PR set reveals recurring user needs:

- **Reliable SQL correctness over edge cases.** The `LIKE ESCAPE` and `GROUPING()` fixes imply users are exercising deeper SQL semantics and expect standards-aligned behavior.
- **Safer schema evolution.** The `IF NOT EXISTS` DDL enhancement reflects demand for idempotent migrations in automated deployment pipelines.
- **Better ingestion of real-world text data.** Encoding support for CSV/TEXT indicates users are encountering non-UTF-8 source files and need smoother import workflows.
- **Versioned/observable storage primitives.** Work on branches and tags suggests analytical users want stronger data lifecycle management, not just raw query performance.

Overall, the implied user base appears increasingly sophisticated: less focused on basic feature gaps, more on operational polish, SQL edge-case fidelity, and advanced table/version management.

## 8. Backlog Watch

### Important open PRs needing maintainer attention

#### 1. Experimental table branch support
- **PR:** [#19551](https://github.com/databendlabs/databend/pull/19551)
- **Created:** 2026-03-15
- **Why it matters:** This is the largest strategic feature in the current set, spanning branch creation, branch-aware reads/writes, lifecycle metadata, and GC. Given its breadth, prolonged review could delay a meaningful roadmap capability.

#### 2. Query semantic fixes pending merge
- [#19595](https://github.com/databendlabs/databend/pull/19595) — empty `LIKE ESCAPE`
- [#19594](https://github.com/databendlabs/databend/pull/19594) — invalid `GROUPING()`

Both are bugfixes opened on 2026-03-23 and still open. They look important for SQL correctness and should be prioritized if review bandwidth is limited.

#### 3. Schema compatibility improvement
- [#19615](https://github.com/databendlabs/databend/pull/19615) — `ALTER TABLE ADD COLUMN IF NOT EXISTS`

This is a relatively focused compatibility enhancement that could likely be merged quickly and deliver immediate user value.

### Issue backlog
There were **no active or updated issues** in the provided data, so no long-unanswered issue backlog can be identified from today’s snapshot.

---

## Summary Assessment

Databend’s current activity reflects a healthy maintenance-and-expansion phase: low issue noise, multiple active PRs, and a balance between correctness fixes and forward-looking storage/query features. The most important near-term health indicators are the pending query bugfixes and whether table branching progresses from experimental work toward review completion. The project appears stable, with momentum centered on SQL compatibility, ingestion robustness, and richer FUSE-table versioning mechanics.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-04-05

## 1. Today’s Overview

Velox saw moderate-to-high PR activity over the last 24 hours, with 15 pull requests updated, but only one issue update and no new releases. The day’s signal is mostly around stabilizing CI, fixing correctness regressions, and continuing larger feature work already in flight rather than landing major new functionality. Two PRs were merged, both focused on correctness and test stability, while several open PRs point to ongoing investments in Iceberg V3 support, SQL compatibility, and developer workflow improvements. Overall project health looks active and constructive, with strong forward motion on both engine capabilities and engineering hygiene.

## 3. Project Progress

### Merged / closed PRs today

#### 1. Spark SQL compatibility fix for `collect_set`
- **PR:** [#16947](https://github.com/facebookincubator/velox/pull/16947)
- **Status:** Merged
- **What changed:** Fixed a backward-compatibility bug in Spark SQL behavior where `collect_set(T)` incorrectly defaulted to respecting nulls instead of ignoring them.
- **Why it matters:** This is a query correctness and SQL compatibility fix. It reduces behavior drift for Spark-compatible execution paths and protects existing workloads from semantic regressions introduced by earlier changes.

#### 2. Expr-eval test flakiness reduction
- **PR:** [#17002](https://github.com/facebookincubator/velox/pull/17002)
- **Status:** Merged
- **What changed:** Reworked a flaky adaptive CPU sampling test so it asserts relative behavior instead of brittle absolute internal states.
- **Why it matters:** This improves CI reliability around expression evaluation instrumentation. While not a user-facing feature, it strengthens confidence in performance-observability code paths and lowers merge friction.

### Notable open progress signals

#### 3. Large Iceberg V3 feature train remains active
- **PR:** [#16959](https://github.com/facebookincubator/velox/pull/16959)
- **Status:** Open
- **Scope:** Deletion vectors, equality deletes, sequence-number conflict resolution, DV writer, DWRF data sink, Manifold filesystem, and PUFFIN protocol support.
- **Roadmap significance:** This is the strongest signal of substantial storage/query-engine expansion currently in review. If merged, it would materially improve Velox’s Iceberg interoperability and modern table-format support.

#### 4. Presto compatibility fix in `array_sort`
- **PR:** [#17030](https://github.com/facebookincubator/velox/pull/17030)
- **Status:** Open
- **Scope:** Changes comparator lambda return type from bigint to integer to match Presto expectations.
- **Roadmap significance:** Another example of Velox tightening SQL-engine compatibility at function-signature level, which is critical for embedders like Prestissimo.

#### 5. CI observability and workflow documentation improvements
- **PRs:** [#17015](https://github.com/facebookincubator/velox/pull/17015), [#17024](https://github.com/facebookincubator/velox/pull/17024), [#17026](https://github.com/facebookincubator/velox/pull/17026)
- **Status:** Open
- **Scope:** Test failure reporting, workflow documentation, and macOS test discovery improvements.
- **Why it matters:** These changes improve contributor productivity and reduce diagnosis time for regressions.

## 4. Community Hot Topics

Given the provided data, comment and reaction counts are low, so “hot topics” are better inferred from technical breadth and recency.

### Iceberg V3 full C++ support
- **PR:** [#16959](https://github.com/facebookincubator/velox/pull/16959)
- **Why it stands out:** This is by far the broadest in-flight effort. It touches deletion vectors, equality deletes, writers, conflict resolution, filesystem integration, and metadata protocols.
- **Underlying need:** Users increasingly expect first-class support for modern open table formats. This PR suggests demand for deeper Iceberg compatibility in native C++ execution stacks, likely for lakehouse workloads with row-level deletes and mixed-engine interoperability.

### cuDF zero-column plan regression
- **Issue:** [#17027](https://github.com/facebookincubator/velox/issues/17027)
- **Fix PR:** [#17031](https://github.com/facebookincubator/velox/pull/17031)
- **Why it stands out:** It broke CI consistently after a recent merge and affected GPU-related test coverage.
- **Underlying need:** Robust handling of edge-case schemas, especially zero-column plans, matters for correctness in vectorized and GPU interop paths. This also highlights the importance of fallback semantics between Velox and cuDF.

### CI failure visibility and developer ergonomics
- **PRs:** [#17015](https://github.com/facebookincubator/velox/pull/17015), [#17024](https://github.com/facebookincubator/velox/pull/17024), [#17026](https://github.com/facebookincubator/velox/pull/17026)
- **Why it stands out:** Three separate PRs are focused on CI usability and reliability.
- **Underlying need:** As project scale grows, maintainers and contributors need faster root-cause analysis, clearer workflow documentation, and more deterministic local reproduction—especially across Linux/macOS differences.

### Long-running concurrency and execution-model cleanup
- **PRs:** [#15140](https://github.com/facebookincubator/velox/pull/15140), [#15179](https://github.com/facebookincubator/velox/pull/15179), [#15491](https://github.com/facebookincubator/velox/pull/15491), [#15361](https://github.com/facebookincubator/velox/pull/15361)
- **Why it stands out:** These are older but still active, implying nontrivial review complexity.
- **Underlying need:** Better TSAN behavior, clearer CPU-vs-IO executor semantics, and filter optimization all point to sustained demand for correctness under concurrency and improved engine performance.

## 5. Bugs & Stability

Ranked by likely severity based on impact described.

### 1. High severity: cuDF regression breaking CI on every merge
- **Issue:** [#17027](https://github.com/facebookincubator/velox/issues/17027)
- **Status:** Closed
- **Problem:** `CudfToVelox::getOutput()` returned an empty vector for zero-column plans, causing `ToCudfSelectionTest.zeroColumnCountConstantFallsBack` failures in CI.
- **Impact:** Continuous CI failures after a recent merge indicate a high-priority regression, even if runtime user impact may be limited to specific edge cases.
- **Fix available:** [#17031](https://github.com/facebookincubator/velox/pull/17031) proposes returning `nullptr` instead of an empty row vector and cleaning up related zero-size handling.

### 2. Medium severity: Spark SQL `collect_set` backward compatibility bug
- **PR:** [#16947](https://github.com/facebookincubator/velox/pull/16947)
- **Status:** Merged
- **Problem:** One-argument `collect_set(T)` used the wrong null-handling default.
- **Impact:** Query semantic mismatch for Spark-compatible users; correctness bug for aggregation results.
- **Resolution:** Landed today.

### 3. Medium severity: flaky adaptive sampling test in expr-eval
- **PR:** [#17002](https://github.com/facebookincubator/velox/pull/17002)
- **Status:** Merged
- **Problem:** Test assumptions were too rigid around internal sampling states.
- **Impact:** CI instability and reduced confidence in test signal, though not necessarily a production bug.
- **Resolution:** Landed today.

### 4. Medium severity: macOS inability to discover individual grouped tests
- **PR:** [#17026](https://github.com/facebookincubator/velox/pull/17026)
- **Status:** Open
- **Problem:** Grouped tests prevented `ctest -R <TestName>` from working well on macOS.
- **Impact:** Developer productivity issue, especially for local debugging and targeted validation.
- **Fix status:** Proposed, not yet merged.

### 5. Medium/low severity: `array_sort` comparator type mismatch with Presto
- **PR:** [#17030](https://github.com/facebookincubator/velox/pull/17030)
- **Status:** Open
- **Problem:** Velox used `bigint` where Presto expects `integer`.
- **Impact:** Function resolution failures in some SQL expressions; compatibility issue rather than core engine instability.
- **Fix status:** Open.

## 6. Feature Requests & Roadmap Signals

### Strongest roadmap signal: Iceberg V3 support
- **PR:** [#16959](https://github.com/facebookincubator/velox/pull/16959)
- **Prediction:** This is the most likely major capability to shape an upcoming release once review completes. Support for deletion vectors, equality deletes, conflict resolution, and related file/protocol work suggests Velox is moving toward fuller lakehouse-native semantics.

### Continued SQL compatibility tightening
- **PRs:** [#17030](https://github.com/facebookincubator/velox/pull/17030), [#16947](https://github.com/facebookincubator/velox/pull/16947)
- **Prediction:** Expect more small but important fixes aligning function signatures and semantics with Presto and Spark SQL behavior. These tend to be high-value for downstream query engines.

### Better CI tooling is becoming part of the roadmap
- **PRs:** [#17015](https://github.com/facebookincubator/velox/pull/17015), [#17024](https://github.com/facebookincubator/velox/pull/17024), [#17026](https://github.com/facebookincubator/velox/pull/17026)
- **Prediction:** Not a user feature, but likely to land soon because these are practical workflow upgrades with immediate maintainer benefit.

### Engine internals and optimization work still active
- **PRs:** [#15361](https://github.com/facebookincubator/velox/pull/15361), [#15491](https://github.com/facebookincubator/velox/pull/15491)
- **Prediction:** These indicate ongoing effort on optimizer/filter quality and executor model clarity, though their age suggests they may need deeper review before landing.

## 7. User Feedback Summary

From today’s data, the most visible user and contributor pain points are:

- **Correctness under edge cases:** The zero-column cuDF regression in [#17027](https://github.com/facebookincubator/velox/issues/17027) shows that unusual plan shapes can still expose integration gaps.
- **SQL compatibility fidelity:** Fixes like [#16947](https://github.com/facebookincubator/velox/pull/16947) and [#17030](https://github.com/facebookincubator/velox/pull/17030) suggest users care deeply about matching upstream engine semantics, especially for Spark and Presto.
- **CI/debugging friction:** The cluster of CI-focused PRs—[#17015](https://github.com/facebookincubator/velox/pull/17015), [#17024](https://github.com/facebookincubator/velox/pull/17024), [#17026](https://github.com/facebookincubator/velox/pull/17026)—indicates contributor pain around diagnosing failures and running targeted tests locally.
- **Need for modern table-format support:** The scale of [#16959](https://github.com/facebookincubator/velox/pull/16959) implies real demand for production-grade Iceberg V3 support, including row-level delete semantics.

There is little explicit positive/negative reaction data in the provided snapshot, so sentiment must be inferred from engineering effort rather than community voting.

## 8. Backlog Watch

These older open PRs look important enough to warrant maintainer attention because they have remained active for months:

### 1. TSAN atomic rewrite
- **PR:** [#15140](https://github.com/facebookincubator/velox/pull/15140)
- **Created:** 2025-10-13
- **Why watch:** Concurrency correctness and sanitizer consistency are foundational. Long lifetime suggests review complexity or unresolved design concerns.

### 2. Remove `tsan_lock_guard`
- **PR:** [#15179](https://github.com/facebookincubator/velox/pull/15179)
- **Created:** 2025-10-15
- **Why watch:** This appears closely related to synchronization semantics across TSAN and non-TSAN builds. It likely deserves coordinated review with other threading changes.

### 3. Improve expr-to-subfield filters
- **PR:** [#15361](https://github.com/facebookincubator/velox/pull/15361)
- **Created:** 2025-11-01
- **Why watch:** Performance-oriented optimizer work can have broad query impact. The age suggests it may be valuable but hard to validate.

### 4. Clarify executor semantics for IO vs CPU
- **PR:** [#15491](https://github.com/facebookincubator/velox/pull/15491)
- **Created:** 2025-11-13
- **Why watch:** Executor naming and separation affect API clarity and scheduling behavior across the engine. This looks architecturally important.

### 5. Large Iceberg V3 support stack
- **PR:** [#16959](https://github.com/facebookincubator/velox/pull/16959)
- **Created:** 2026-03-30
- **Why watch:** Newer than the others, but large enough that it may need focused maintainer bandwidth to avoid stagnation. It is likely the most strategically important open item.

---

## Overall Health Signal

Velox remains healthy and actively maintained. Today’s merged changes improved correctness and CI reliability, while open work shows meaningful momentum on Iceberg lakehouse support, Presto/Spark compatibility, and contributor tooling. The main caution is backlog depth: several technically important PRs have been open for months, suggesting review bandwidth may be the key bottleneck rather than implementation velocity.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-04-05

## 1. Today's Overview

Apache Gluten showed moderate issue activity over the last 24 hours, with **6 issues updated** and **3 pull requests updated**, but **no releases** and **no PRs merged**. The day’s activity was heavily concentrated on the **Velox backend**, especially around **table scan memory behavior, prefetch scheduling, and macOS build reliability**. Overall, the project appears active in performance engineering and operational hardening, but today’s signal is more about **diagnosing bottlenecks and stability risks** than landing completed feature work. Project health looks steady, though several memory-management topics suggest maintainers are currently dealing with **important execution-engine pressure points**.

## 2. Project Progress

There were **no merged or closed PRs** in the last 24 hours, so no completed code changes can be counted as landed today.

Still, the open PR queue indicates near-term work in three areas:

- **Velox thread-pool / row-group scheduling optimization** via [PR #11877](https://github.com/apache/gluten/pull/11877), aimed at reducing table-scan stalls caused by LIFO scheduling behavior in row-group fetches.
- **macOS build compatibility fixes** via [PR #11879](https://github.com/apache/gluten/pull/11879), addressing linker issues for compression dependencies in Arrow-based builds.
- A non-productivity placeholder / infra item remains open in [PR #11743](https://github.com/apache/gluten/pull/11743), marked DNR.

Given today’s issue flow, the most meaningful progress is not merged code but **clear convergence around table scan performance and memory control as a top engineering focus**.

## 3. Community Hot Topics

### 3.1 Velox upstream gap tracking remains the most active discussion
- [Issue #11585 — useful Velox PRs not merged into upstream](https://github.com/apache/gluten/issues/11585)  
  **16 comments, 4 👍**

This is the most socially active item in the current set. It tracks useful Velox PRs contributed largely by the Gluten community that have not yet landed upstream. The technical need behind this is clear: Gluten depends on Velox evolution, and missing upstream merges create friction in performance delivery, maintenance overhead, and rebase burden. This issue is a strong roadmap signal that **backend innovation is outpacing upstream integration capacity**, which can slow productization.

### 3.2 Table scan scheduling and memory behavior are the central runtime topic
- [Issue #11821 — pick split with most data prefetched](https://github.com/apache/gluten/issues/11821)
- [Issue #11880 — Spill support of table scan](https://github.com/apache/gluten/issues/11880)
- [Issue #11876 — table scan allocated more memory than used and caused OOM](https://github.com/apache/gluten/issues/11876)
- [PR #11877 — Use UnboundedBlockingQueue when create threads pool](https://github.com/apache/gluten/pull/11877)

These items collectively point to a shared technical theme: **the current table-scan execution strategy can over-prefetch, schedule work suboptimally, and translate available memory into apparent OOM conditions**. The underlying need is better coordination between:
- split selection,
- row-group prefetching,
- executor queue policy,
- and memory accounting / backpressure.

This is likely one of the highest-impact areas for near-term performance and stability improvement.

### 3.3 macOS developer experience got immediate response
- [Issue #11878 — Mac OS build error](https://github.com/apache/gluten/issues/11878)
- [PR #11879 — Fix gluten velox build issue](https://github.com/apache/gluten/pull/11879)

This is a good sign operationally: a newly reported build issue received a directly linked fix PR the same day. It suggests maintainers are responsive on **platform compatibility and contributor setup pain points**, especially for non-Linux environments.

## 4. Bugs & Stability

Ranked by apparent severity based on impact and available context:

### High severity
#### 1) Table scan memory over-allocation causing OOM despite available system memory
- [Issue #11876](https://github.com/apache/gluten/issues/11876) — **OPEN**
- [Issue #11880](https://github.com/apache/gluten/issues/11880) — related enhancement proposal
- [PR #11877](https://github.com/apache/gluten/pull/11877) — possibly partial mitigation via scheduling

This appears to be today’s most serious runtime problem. The report says table scan triggered OOM while system memory utilization was only about 64%, implying a mismatch between **operator-level memory accounting/reservation** and **actual memory availability/use**. This is especially important because it affects a **simple aggregation query**, meaning the issue is not limited to corner-case SQL.

Likely risk areas:
- aggressive split / row-group prefetch,
- reserved vs. used memory divergence,
- lack of scan-level backpressure or spill,
- executor scheduling amplifying waiting and retained buffers.

#### 2) OOM reported even when memory is “enough”
- [Issue #11747](https://github.com/apache/gluten/issues/11747) — **CLOSED**

Although closed, this is closely related in symptom pattern to #11876. Together they reinforce that OOM behavior in the Velox path is not a one-off but part of a broader memory-management concern. The closure may indicate either user resolution, triage consolidation, or a diagnosis path already underway, but it does not eliminate the broader risk.

### Medium severity
#### 3) macOS Velox build/link failure
- [Issue #11878](https://github.com/apache/gluten/issues/11878) — **OPEN**
- [PR #11879](https://github.com/apache/gluten/pull/11879) — **OPEN**

Impact is limited to build/install workflows rather than query correctness, but it directly affects adoption and developer productivity on macOS. The existence of a fix PR lowers immediate risk.

### Lower severity but strategically important
#### 4) Prefetch selection inefficiency
- [Issue #11821](https://github.com/apache/gluten/issues/11821) — **OPEN**
- [PR #11877](https://github.com/apache/gluten/pull/11877) — related

This is framed as performance optimization, but it likely has stability implications too. If the engine picks the first prepared split instead of the most data-ready split, it can create idle waits while other data is already available, increasing latency and potentially prolonging memory retention in pending work queues.

## 5. Feature Requests & Roadmap Signals

### Spill or backpressure for table scan
- [Issue #11880](https://github.com/apache/gluten/issues/11880)

This is the strongest roadmap signal today. The request is not just a feature wish; it is a direct response to production-relevant memory pressure caused by prefetch-heavy scan acceleration. A likely next-version direction is some combination of:
- pausing prefetch when memory thresholds are hit,
- scan-level backpressure,
- or full/partial **spill support in table scan**.

Of these, **prefetch throttling/backpressure** is probably more likely in the short term than a complete spill implementation, because it is narrower in scope.

### Smarter split scheduling based on prefetched readiness
- [Issue #11821](https://github.com/apache/gluten/issues/11821)
- [PR #11877](https://github.com/apache/gluten/pull/11877)

This is another likely near-term improvement candidate. The problem is concrete, measurable, and tied to existing scan architecture. Expect further work here because it offers a path to improve both **scan throughput** and **memory efficiency** without changing SQL semantics.

### Continued Velox upstream alignment
- [Issue #11585](https://github.com/apache/gluten/issues/11585)

This is less of an end-user feature request and more of a strategic roadmap dependency. Items tracked here may shape upcoming Gluten versions indirectly, especially where backend fixes or optimizations are blocked on upstream Velox merge status.

### Platform build robustness
- [Issue #11878](https://github.com/apache/gluten/issues/11878)
- [PR #11879](https://github.com/apache/gluten/pull/11879)

Not a flagship feature, but likely to be included in the next release if merged soon, since build reliability improvements are low-risk and high-value for contributors.

## 6. User Feedback Summary

Today’s user feedback centers on three practical pain points:

1. **OOMs that do not match actual machine memory pressure**  
   Users are signaling frustration with runtime failures that appear to come from internal memory management rather than genuine resource exhaustion. This undermines trust in the execution engine for even straightforward analytical queries.
   - [Issue #11876](https://github.com/apache/gluten/issues/11876)
   - [Issue #11747](https://github.com/apache/gluten/issues/11747)

2. **Performance gains from prefetching come with unstable memory costs**  
   The community recognizes that split and row-group prefetch are key contributors to Gluten performance, but users are now pushing for better control mechanisms so speedups do not come at the expense of reliability.
   - [Issue #11880](https://github.com/apache/gluten/issues/11880)

3. **macOS build friction remains real for developers**  
   Contributor and user setup on macOS still has rough edges, particularly around native linking and dependency detection. The fast follow-up PR is encouraging, but the issue confirms that cross-platform setup remains a usability concern.
   - [Issue #11878](https://github.com/apache/gluten/issues/11878)
   - [PR #11879](https://github.com/apache/gluten/pull/11879)

Net takeaway: users continue to value Gluten’s performance path, especially via Velox, but are increasingly focused on **predictability, memory discipline, and environment reliability**.

## 7. Backlog Watch

### Important longer-running items needing maintainer attention

#### 1) Velox upstream PR tracking remains strategically important
- [Issue #11585](https://github.com/apache/gluten/issues/11585)

Created in February and still active, this is a significant maintenance and roadmap item. It deserves continued maintainer visibility because unresolved upstream divergence can compound technical debt and delay delivery of backend improvements.

#### 2) Temp / DNR PR still open
- [PR #11743](https://github.com/apache/gluten/pull/11743)

Marked as temp test / DNR, this PR likely does not represent product work, but stale open PRs add noise to backlog management. It may be worth closing or cleaning up unless still needed for infrastructure validation.

#### 3) Table-scan memory work should likely be consolidated
- [Issue #11876](https://github.com/apache/gluten/issues/11876)
- [Issue #11880](https://github.com/apache/gluten/issues/11880)
- [Issue #11821](https://github.com/apache/gluten/issues/11821)
- [PR #11877](https://github.com/apache/gluten/pull/11877)

These look closely related and may benefit from explicit maintainer coordination under a shared epic or tracker. Without consolidation, there is some risk of fragmented fixes across scheduling, memory accounting, and prefetch policy.

## 8. Overall Health Assessment

Apache Gluten looks **actively maintained and technically focused**, with rapid attention to reported problems, especially in the Velox backend. However, today’s activity highlights a meaningful engineering challenge: **the current scan/prefetch model may be pushing memory behavior to an unstable point under some workloads**. The project’s short-term health depends less on adding new SQL surface area and more on improving **execution predictability, memory governance, and backend integration maturity**. If the open scan-related issues convert into coordinated fixes soon, this would meaningfully improve both reliability and user confidence.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-04-05

## 1. Today's Overview

Apache Arrow showed moderate day-to-day maintenance activity over the last 24 hours: 17 issues were updated and 10 PRs saw movement, with no new releases published. The activity mix skewed toward backlog grooming and CI / stability work rather than major new engine features landing. A notable signal is that several recently active items are focused on correctness, developer tooling, and packaging quality across C++, Python, and R. Overall project health looks steady, but a meaningful share of updates came from old issues receiving stale-warning churn rather than substantive resolution.

---

## 2. Project Progress

### Merged/closed PRs today
Only a small number of PRs were closed or merged, and most visible movement was not in headline analytical execution features.

- [#48899](https://github.com/apache/arrow/pull/48899) — **[Python] Move NumPy specific tests to separate test file**  
  This is primarily test and maintainability work. It improves test isolation in PyArrow and should make Python array behavior easier to validate independently from NumPy-specific integration paths.

- [#8796](https://github.com/apache/arrow/pull/8796) — **[Rust][Parquet] Experiment: Vec<u8> vs current allocations**  
  Although old, this closure is relevant to storage engine and memory-layout discussions. The underlying theme is allocation strategy efficiency in Rust Arrow / Parquet code paths, which matters for throughput-sensitive analytical workloads.

- [#9860](https://github.com/apache/arrow/pull/9860) — **[Rust] inline append functions of builders**  
  Another Rust-side performance-oriented cleanup. Inlining builder append functions targets hot paths and suggests continued interest in reducing overhead in Arrow data construction.

### What advanced today
From an OLAP / analytical engine perspective, the most meaningful progress was around:
- **C++ correctness and CI reliability**, via active work on MinGW intermittent segfaults and base64 input validation.
- **R ecosystem readiness**, especially CRAN compliance and connector coverage.
- **Python API rationalization**, especially deprecating redundant Feather-specific APIs in favor of Arrow IPC.

There was **no clear evidence today of merged SQL engine, Acero planner, or Substrait execution functionality** landing directly in the last 24h.

---

## 3. Community Hot Topics

### 1) Cross-language extension type registration
- [Issue #20265](https://github.com/apache/arrow/issues/20265) — **[R][Python] Extension types cannot be registered in both R and Python**  
  Comments: 7

This remains one of the more discussed active issues. The technical need underneath is strong: users increasingly expect Arrow extension types to work seamlessly across mixed-language analytics stacks, especially R + Python environments sharing a process through reticulate or embedded interpreters. This is a real interoperability gap for teams building custom semantic types over Arrow schemas.

### 2) Website / messaging around Acero
- [Issue #31983](https://github.com/apache/arrow/issues/31983) — **[Website] Announce Acero Engine**  
  Comments: 7

While not a code issue, it reflects a strategic communication gap. Acero is Arrow’s C++ streaming execution engine and central to Arrow’s analytical compute story; the fact that an announcement issue is still open suggests that the project’s engine positioning may lag behind its technical maturity. For OLAP observers, this is a roadmap signal that Arrow still has room to sharpen the discoverability of its execution-layer narrative.

### 3) Python memory-mapped file memory behavior
- [Issue #34423](https://github.com/apache/arrow/issues/34423) — **[Python] pyarrow MemoryMappedFile.close() does not release memory**  
  Comments: 6

This is a practical user pain point with direct implications for analytical batch processing. Users running loops over many files expect deterministic resource release; memory retention in mmap-heavy workflows can be interpreted as a leak even when OS-level semantics are involved. This is especially important in scan-heavy data lake or IPC ingestion pipelines.

### 4) CSV parsing robustness
- [Issue #32028](https://github.com/apache/arrow/issues/32028) — **[Python] CSV reader: allow parsing without encoding errors**  
  Comments: 5

The issue highlights a common production need: Arrow’s strictness is valuable for correctness, but ingestion users also need “best effort” handling for messy external CSVs. For analytics platforms, this affects Arrow’s suitability as a front-door ingestion engine when compared with pandas or warehouse loaders that tolerate imperfect encodings.

### 5) New correctness bug with a candidate fix already open
- [Issue #49614](https://github.com/apache/arrow/issues/49614) — **[C++] base64_decode silently truncates on invalid characters**  
  Comments: 4  
- [PR #49660](https://github.com/apache/arrow/pull/49660) — **Fix silent truncation in base64_decode on invalid input**

This is the clearest “hot” code path issue today because a bug report and fix PR are already linked. It reflects responsiveness and also shows attention to correctness over silent partial decoding.

---

## 4. Bugs & Stability

Ranked by likely severity to users and downstream systems:

### High severity
1. [Issue #49614](https://github.com/apache/arrow/issues/49614) — **[C++] `base64_decode` silently truncates on invalid input**  
   **Why it matters:** silent truncation is a correctness and data integrity risk. In analytical systems, silent partial decode is usually worse than a hard failure because it can propagate corrupted payloads.  
   **Fix status:** [PR #49660](https://github.com/apache/arrow/pull/49660) is open and directly addresses this.

2. [PR #49462](https://github.com/apache/arrow/pull/49462) — **[C++][CI] Fix intermittent segfault in `arrow-json-test` with MinGW**  
   Related issue: [#49272](https://github.com/apache/arrow/issues/49272)  
   **Why it matters:** intermittent segfaults in CI often indicate latent concurrency or platform-specific memory safety issues. Even if isolated to test infrastructure, they reduce confidence in Windows portability and can mask real regressions.

### Medium severity
3. [Issue #34423](https://github.com/apache/arrow/issues/34423) — **[Python] `MemoryMappedFile.close()` does not release memory**  
   **Why it matters:** likely impacts long-running data scans and repeated file processing jobs. The practical effect is elevated memory pressure and user confusion over lifecycle semantics.

4. [Issue #49433](https://github.com/apache/arrow/issues/49433) — **[C++] Multi-threaded logging can mix up messages**  
   **Why it matters:** not a query correctness issue, but it degrades observability for parallel execution. For Acero, Flight, and scan pipelines, clear logs are important for diagnosing performance and correctness problems.  
   This is tagged as a good-first/good-second issue, so it may get contributor attention quickly.

### Lower severity but broad usability impact
5. [Issue #32028](https://github.com/apache/arrow/issues/32028) — **[Python] CSV reader strict encoding failures**  
   **Why it matters:** blocks ingestion of real-world dirty datasets; less a crash than a robustness gap.

6. [Issue #31981](https://github.com/apache/arrow/issues/31981) — **Flight transport speed improvement for list structures**  
   **Why it matters:** performance-sensitive but older and low-engagement; relevant for nested data transport in service-oriented analytics.

---

## 5. Feature Requests & Roadmap Signals

### Strongest roadmap signals from active items

- [PR #49553](https://github.com/apache/arrow/pull/49553) — **[R] Expose Azure Blob filesystem**  
  This is one of the clearest near-term feature additions. Since Azure support already exists in C++ and Python, exposing it in R is a natural parity move and likely to land in an upcoming release if review proceeds. For analytical users, this improves Arrow’s role as a cross-cloud dataset access layer.

- [PR #49590](https://github.com/apache/arrow/pull/49590) — **[Python] deprecate feather python**  
  This is more of an API simplification than a new feature, but it is strategically important. It nudges users toward Arrow IPC as the canonical file interface, reducing duplication and clarifying format positioning. Likely next-version material because deprecations need runway.

- [Issue #32042](https://github.com/apache/arrow/issues/32042) — **Read first N rows of Feather file through Python**  
  This reflects demand for lightweight preview / sampling workflows. It is useful for notebook exploration and metadata-first pipelines, though perhaps less urgent if Feather APIs are being deprecated in favor of IPC.

- [Issue #31986](https://github.com/apache/arrow/issues/31986) — **Incorporate cuDF utilities for reading IPC messages composed of CUDA buffers**  
  This is a strong signal for GPU interoperability demand. While not obviously imminent, it aligns with Arrow’s long-term position as a universal in-memory interchange format across CPU/GPU analytics systems.

- [Issue #31184](https://github.com/apache/arrow/issues/31184) — **[C++] Aggregate functions for min and max index**  
  Although closed now, the topic is notable for analytical engine completeness: argmin / argmax-style kernels are common in dataframe and SQL-adjacent workloads.

### What may show up in the next version
Most likely candidates:
1. **R Azure Blob filesystem support** if [#49553](https://github.com/apache/arrow/pull/49553) clears review.
2. **C++ base64 correctness fix** via [#49660](https://github.com/apache/arrow/pull/49660).
3. **Python Feather deprecation notices** via [#49590](https://github.com/apache/arrow/pull/49590).
4. **Improved R CI / CRAN readiness** from [#49653](https://github.com/apache/arrow/pull/49653) and [#49655](https://github.com/apache/arrow/pull/49655).

---

## 6. User Feedback Summary

Today’s updates reveal several recurring real-world user concerns:

- **Cross-language interoperability is still hard**  
  [#20265](https://github.com/apache/arrow/issues/20265) shows users expect custom Arrow types to survive mixed R/Python workflows. This is especially relevant for notebook-based analytics and embedded language runtimes.

- **Users want Arrow to tolerate messy ingestion inputs**  
  [#32028](https://github.com/apache/arrow/issues/32028) indicates that strict decoding behavior can make Arrow feel less practical than pandas for raw CSV intake. This is common in enterprise ETL where source data cleanliness is inconsistent.

- **Memory lifecycle transparency matters**  
  [#34423](https://github.com/apache/arrow/issues/34423) reflects user expectations that file closures should visibly return memory. Whether the issue is a true leak or mmap semantics mismatch, users need clearer behavior or documentation.

- **Cloud connector parity matters by language**  
  [#49553](https://github.com/apache/arrow/pull/49553) suggests R users want the same object-store reach already available in Python and C++. For Arrow’s ecosystem credibility, connector parity is a practical adoption driver.

- **Stability and debuggability remain key for contributors and deployers**  
  Intermittent segfaults, mixed log lines, and CRAN non-API warnings point to a community focused on reliability and release hygiene rather than just net-new features.

Overall, feedback is less about dissatisfaction with core Arrow formats and more about **operational fit**: compatibility, cloud access, ingestion tolerance, and predictable runtime behavior.

---

## 7. Backlog Watch

These older items appear important but still need maintainer attention:

- [Issue #20265](https://github.com/apache/arrow/issues/20265) — **[R][Python] Extension types cannot be registered in both R and Python**  
  Longstanding and strategically important for multi-language interoperability.

- [Issue #34423](https://github.com/apache/arrow/issues/34423) — **[Python] `MemoryMappedFile.close()` does not release memory**  
  Affects user trust in large-scale file processing behavior.

- [Issue #32028](https://github.com/apache/arrow/issues/32028) — **[Python] CSV reader: allow parsing without encoding errors**  
  Important for ingestion ergonomics and broader adoption.

- [Issue #31981](https://github.com/apache/arrow/issues/31981) — **Flight transport speed improvement for list structures**  
  Relevant to nested-data transport performance, especially for service and RPC-heavy analytical architectures.

- [Issue #31986](https://github.com/apache/arrow/issues/31986) — **CUDA-buffer IPC message utilities**  
  Important for future GPU analytics interoperability, though currently low-velocity.

- [Issue #31983](https://github.com/apache/arrow/issues/31983) — **Announce Acero Engine**  
  Not a blocker, but still notable: Arrow’s execution engine story may be under-communicated relative to its technical importance.

- [PR #49585](https://github.com/apache/arrow/pull/49585) — **DRAFT: static build of ODBC FlightSQL driver**  
  This is worth watching from an ecosystem perspective. Better Flight SQL driver packaging can materially improve BI / SQL tool integration.

---

## 8. Overall Health Assessment

Apache Arrow remains healthy and active, but today’s signal is more about **maintenance depth than feature acceleration**. The strongest evidence of momentum is in correctness fixes, CI stabilization, API cleanup, and cloud connector parity. For OLAP and analytical engine watchers, Acero- and Flight-related strategic themes are present, but there were no major execution-engine breakthroughs visible in today’s updates. The near-term outlook favors incremental reliability improvements and ecosystem usability enhancements over major new analytical capabilities.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*