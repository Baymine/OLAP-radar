# Apache Doris Ecosystem Digest 2026-04-01

> Issues: 6 | PRs: 192 | Projects covered: 10 | Generated: 2026-04-01 01:49 UTC

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

# Apache Doris Project Digest — 2026-04-01

## 1. Today's Overview

Apache Doris remained **highly active** on 2026-04-01, with **192 pull requests updated in the last 24 hours** and **101 PRs merged or closed**, alongside **6 issues updated** and **1 new release**. The day’s activity shows a project in **intensive stabilization and branch propagation mode**, with many fixes and cherry-picks moving across 4.0 and 4.1 lines while core engine refactors continue in parallel. Development focus appears split between **query/storage correctness**, **external catalog and lakehouse interoperability**, and **test/build pipeline efficiency**. Overall, project health looks strong from a throughput perspective, though several newly reported bugs point to ongoing complexity in **distributed load correctness**, **Arrow Flight / Variant interoperability**, and **long-running ingestion reliability**.

---

## 2. Releases

## Apache Doris 4.0.5 released
- **Release:** [4.0.5: Apache Doris 4.0.5 Release](https://github.com/apache/doris/issues/61817)
- **Downloads:** https://doris.apache.org/download

### What this release signals
Although the full changelog is referenced externally, the surrounding PR activity suggests that **4.0.5 is a maintenance/stability release** focused on production-readiness of the 4.0 branch. Recent merged/cherry-picked fixes around **Parquet reading**, **Hive Metastore client pooling**, and **test suite consolidation** are consistent with a point release aimed at hardening data lake interoperability and operational reliability.

### Likely notable changes around this release
Based on merged and branch-targeted PRs updated today:
- **Parquet reader correctness fix**
  - [#60374](https://github.com/apache/doris/pull/60374) — fix empty dictionary page decompression in Parquet
  - [#61857](https://github.com/apache/doris/pull/61857) — cherry-pick of that fix
- **Hive Metastore client pool modernization**
  - [#61553](https://github.com/apache/doris/pull/61553) — migrate HMS client pool to Commons Pool
  - branch PRs: [#61975](https://github.com/apache/doris/pull/61975), [#61976](https://github.com/apache/doris/pull/61976)
- **Regression test cleanup**
  - [#61842](https://github.com/apache/doris/pull/61842) — merge legacy `nereids_p0` tests into `query_p0`

### Breaking changes / migration notes
No explicit breaking changes were visible in the provided daily data. For operators, the practical migration notes are:
- **Upgrade strongly recommended for Parquet-heavy lakehouse workloads**, especially where null-heavy string columns may produce empty dictionary pages.
- **HMS-integrated deployments** should monitor connection-pool behavior after upgrading to versions containing the Commons Pool migration, especially under concurrency.
- As usual for Doris point upgrades, users running external catalogs, Iceberg, JDBC query TVFs, and Arrow Flight should validate representative workloads before wide rollout.

---

## 3. Project Progress

Today’s merged/closed work primarily advanced **storage correctness**, **metadata/access layer robustness**, and **test hygiene**, while several open PRs indicate where the engine is actively evolving next.

### Merged/closed PRs with meaningful technical impact

#### 1) Parquet reader correctness improvement
- [#60374](https://github.com/apache/doris/pull/60374) — **[fix](parquet) Don't decompress dict page when dict page is empty**
- [#61857](https://github.com/apache/doris/pull/61857) — branch cherry-pick

This is an important low-level read-path correctness fix. It addresses failures when all values in a string column are null and the Parquet dictionary page is empty, which previously could trigger ZSTD decompression errors. This directly improves **data lake query stability** and **format compatibility**.

#### 2) FE metadata integration robustness
- [#61553](https://github.com/apache/doris/pull/61553) — **[improvement](fe) Migrate HMS client pool to Commons Pool**

Though the parent PR is closed, today’s branch activity shows this work being propagated:
- [#61975](https://github.com/apache/doris/pull/61975) — branch-4.0
- [#61976](https://github.com/apache/doris/pull/61976) — branch-4.1

This improves maintainability and likely runtime resilience of Hive Metastore connectivity by replacing a custom queue-based pool with `commons-pool2`. It is especially relevant for **external catalog users** and **lakehouse federation** scenarios.

#### 3) Regression suite simplification
- [#61842](https://github.com/apache/doris/pull/61842) — **Merge nereids_p0 test cases into query_p0**

This reduces duplicated planner test content and should improve **test maintainability** and **signal quality** for planner regressions, particularly around the Nereids optimizer.

### Important open work in progress

#### Query engine / execution internals
- [#61690](https://github.com/apache/doris/pull/61690) — **Refactor aggregation code**
- [#61232](https://github.com/apache/doris/pull/61232) — **Reduce window function template instantiations**

These suggest a sustained push toward **execution engine cleanup**, **compile-time reduction**, and better internal separation of aggregation semantics. This is foundational work that may improve build velocity, code maintainability, and eventually runtime performance.

#### Lakehouse / catalog interoperability
- [#61825](https://github.com/apache/doris/pull/61825) — **Extract Iceberg batch planning split producer abstraction**
- [#61759](https://github.com/apache/doris/pull/61759) — **Avoid dict reads on mixed-encoding position delete files**
- [#61939](https://github.com/apache/doris/pull/61939) — **Preserve query TVF column aliases across JDBC catalogs**

These PRs indicate active investment in **Iceberg planning correctness**, **Parquet/position delete compatibility**, and **SQL behavior consistency across federated JDBC sources**.

#### Ingestion / cloud connectors
- [#61324](https://github.com/apache/doris/pull/61324) — **RoutineLoad IAM auth for Amazon MSK**
- [#61325](https://github.com/apache/doris/pull/61325) — **Support Amazon Kinesis**

These are strong signals that Doris continues expanding as a cloud-native analytical platform for managed streaming ingestion.

---

## 4. Community Hot Topics

The provided data does not include reliable comment counts for PRs, so “hotness” is inferred from branch propagation, review status, and technical importance.

### 1) Aggregation engine refactor
- [PR #61690](https://github.com/apache/doris/pull/61690)

This is one of the clearest core-engine efforts in flight. The refactor breaks apart an oversized shared aggregation state object serving multiple semantics. The underlying technical need is clear: **execution engine complexity has grown enough that maintainability and semantic isolation now matter for future optimization and bug reduction**.

### 2) Window-function compile-time reduction
- [PR #61232](https://github.com/apache/doris/pull/61232)

This work targets template instantiation overhead in window functions. The need here is not user-facing SQL syntax, but **engineering scalability**: faster builds, smaller binaries, and simpler code paths in one of the more complex analytical execution areas.

### 3) Remote filesystem abstraction unification
- [Issue #61860](https://github.com/apache/doris/issues/61860)

This is a notable roadmap-level refactor proposal. Doris currently has parallel remote filesystem abstractions in FE, and the issue proposes unifying them and splitting functionality into Maven SPI modules. The technical need is strong: **plugin modularity, reduced duplication, and cleaner support for object storage / DFS backends**.

### 4) Streaming load reliability under long-running TVF ingestion
- [Issue #61897](https://github.com/apache/doris/issues/61897)

This bug reflects a real operational pain point: long-running TVF continuous ingestion unexpectedly failing with `NullPointerException`. The need behind it is **better lifecycle management and observability for long-lived ingest jobs**, especially when handling many large files.

### 5) Multi-branch propagation of metadata-layer improvements
- [PR #61553](https://github.com/apache/doris/pull/61553)
- [PR #61975](https://github.com/apache/doris/pull/61975)
- [PR #61976](https://github.com/apache/doris/pull/61976)

The repeated branch cherry-picks show that **external metastore reliability remains a high-priority operational concern** across maintained release lines.

---

## 5. Bugs & Stability

Below are the most significant bugs updated today, ranked by likely severity.

### High severity

#### 1) INSERT SELECT may commit invisible/incomplete data after quorum success
- [Issue #61916](https://github.com/apache/doris/issues/61916) — **[Bug](load) INSERT SELECT data invisible after quorum success with cancelled node channel**

**Why it matters:** This is a potential **data correctness / durability semantics** issue. The report says a slow node channel can be cancelled during `close_wait` without being marked failed, allowing FE to commit as if the write succeeded.  
**Impact:** Could lead to **committed-but-invisible data** or replica inconsistency.  
**Fix PR status:** No linked fix PR in the provided data.  
**Priority:** Very high.

#### 2) Cross-cluster Arrow Flight cannot read Variant type
- [Issue #61883](https://github.com/apache/doris/issues/61883) — **Cross-cluster Catalog with Arrow Flight fails to read Variant type**

**Why it matters:** This affects **cross-cluster interoperability** in cloud/disaggregated deployments and touches the newer **Variant/semi-structured data** path.  
**Impact:** Breaks federated reads for specific type combinations.  
**Fix PR status:** No direct fix PR visible today.  
**Priority:** High, especially for users adopting Variant and Arrow Flight.

### Medium-high severity

#### 3) TVF continuous import crashes with NPE
- [Issue #61897](https://github.com/apache/doris/issues/61897) — **TVF continuous import NPE because `ConnectContext.getExecutor()` is null**

**Why it matters:** Long-running ingestion jobs failing after running for a long time is a serious production issue.  
**Likely area:** Statement execution lifecycle / profile collection in continuous ingest path.  
**Fix PR status:** No direct fix PR visible today.  
**Priority:** Medium-high.

#### 4) Compaction/read-path predicate normalization bug
- [PR #61961](https://github.com/apache/doris/pull/61961) — **normalize DeleteSubPredicatePB operator on read path**

This open fix PR references a stack trace in compaction core and indicates a **crash/correctness issue in delete predicate parsing**.  
**Why it matters:** Anything touching compaction and delete predicate application can affect **read correctness** and **storage maintenance stability**.  
**Priority:** Medium-high.  
**Status:** Fix proposed, not yet merged.

### Medium severity

#### 5) Parquet empty dictionary page decompression bug
- [PR #60374](https://github.com/apache/doris/pull/60374)
- [PR #61857](https://github.com/apache/doris/pull/61857)

This appears effectively addressed for relevant branches.  
**Why it matters:** It caused read failures on valid Parquet data patterns.  
**Status:** Fixed/cherry-picked.  
**Priority:** Medium, but operationally important.

#### 6) Broken internal column statistics table
- [Issue #53633](https://github.com/apache/doris/issues/53633)

This issue was closed as stale rather than clearly fixed. It described `__internal_schema.column_statistics` being broken in an environment with backend registration using loopback.  
**Why it matters:** It hints at operational misconfiguration and internal statistics fragility, though no new action occurred beyond closure.  
**Priority:** Low for today, but worth noting as unresolved-by-staleness.

---

## 6. Feature Requests & Roadmap Signals

### 1) Row type support for Doris binlog
- [Issue #61956](https://github.com/apache/doris/issues/61956) — **add row type for doris binlog**

This is a direct feature request and a likely sign of increasing demand for **richer CDC/binlog semantics**. If pursued, it could improve downstream integration and event-level introspection.  
**Prediction:** Plausible for a near-future 4.x or 5.0 line if binlog/CDC remains a strategic area.

### 2) Unified remote filesystem abstraction and SPI modules
- [Issue #61860](https://github.com/apache/doris/issues/61860)

This is a strong roadmap-level architectural signal. It would make remote storage support more modular and extensible, likely benefiting **S3/HDFS/object storage plugins**, cloud packaging, and connector development.  
**Prediction:** More likely medium-term than immediate release, but highly aligned with Doris’s multi-catalog/lakehouse trajectory.

### 3) AWS-native streaming ingestion
- [PR #61324](https://github.com/apache/doris/pull/61324) — **RoutineLoad IAM auth**
- [PR #61325](https://github.com/apache/doris/pull/61325) — **Amazon Kinesis support**

These are among the clearest user-facing roadmap signals in current development. They address real cloud deployment needs:
- secure access to Amazon MSK using IAM/OAUTHBEARER
- direct Kinesis-based routine load

**Prediction:** At least one of these has a strong chance of landing in the next minor release line, especially 4.1.x.

### 4) Global Timestamp Oracle (TSO)
- [PR #61199](https://github.com/apache/doris/pull/61199)

A global monotonically increasing TSO is a substantial infrastructure feature.  
**Implication:** Doris may be laying groundwork for stronger transaction ordering, cross-component coordination, or future consistency semantics.  
**Prediction:** More likely a **5.0-oriented capability** than a quick patchline feature.

### 5) Window funnel v2
- [PR #61935](https://github.com/apache/doris/pull/61935)

This branch PR suggests continued analytical SQL function expansion.  
**Prediction:** User-visible analytical function enhancements remain active and are likely to keep appearing in 4.1+.

---

## 7. User Feedback Summary

Today’s issue flow reflects several concrete user pain points:

### 1) Reliability of long-running ingestion jobs
- [#61897](https://github.com/apache/doris/issues/61897)

Users running TVF-based continuous imports are encountering failures after long runtimes, especially with many large files. This suggests demand for:
- stronger executor/context lifecycle handling
- better progress and profile capture
- more robust large-scale file ingestion

### 2) Correctness expectations for distributed writes
- [#61916](https://github.com/apache/doris/issues/61916)

The `INSERT ... SELECT ...` report shows users expect **strict commit correctness**, not merely quorum-level apparent success. This is a critical trust issue: analytical databases can tolerate some eventual operational rough edges, but **write visibility anomalies are unacceptable** in production ETL pipelines.

### 3) Better support for modern semi-structured and federated analytics
- [#61883](https://github.com/apache/doris/issues/61883)

The Variant + Arrow Flight issue indicates real-world adoption of:
- disaggregated/cloud deployments
- cross-cluster catalogs
- semi-structured data types

Users are pushing Doris into more heterogeneous lakehouse environments, where interoperability details matter as much as raw query speed.

### 4) Need for cloud-native connector maturity
- [#61324](https://github.com/apache/doris/pull/61324)
- [#61325](https://github.com/apache/doris/pull/61325)

The ongoing work around Amazon MSK IAM and Kinesis shows demand from users running Doris in AWS-native architectures. The feedback signal is that users increasingly want Doris to fit directly into managed cloud streaming ecosystems rather than only traditional Kafka/HDFS stacks.

### 5) Operational efficiency in CI and test pipelines
- [#61852](https://github.com/apache/doris/pull/61852)
- [#61869](https://github.com/apache/doris/pull/61869)

Even though these are contributor-facing rather than end-user-facing, they show maintainers are responding to the pain of **slow or opaque external regression setup**, especially around Hive bootstrap data and timing visibility.

---

## 8. Backlog Watch

These issues/PRs appear important and worthy of maintainer attention, either because of severity, architecture impact, or strategic relevance.

### Needs prompt maintainer attention

#### 1) Data invisibility after INSERT SELECT quorum success
- [Issue #61916](https://github.com/apache/doris/issues/61916)

This is the most concerning open issue in today’s set because it may affect **write correctness**. It should likely receive rapid triage, reproduction, and branch-specific assessment.

#### 2) TVF continuous import NullPointerException
- [Issue #61897](https://github.com/apache/doris/issues/61897)

A production-ingest reliability issue with a concrete stack symptom and plausible reproducibility. Worth fast follow-up.

#### 3) Arrow Flight cross-cluster Variant incompatibility
- [Issue #61883](https://github.com/apache/doris/issues/61883)

Important for cloud/disaggregated adopters and for the credibility of Doris’s semi-structured data support.

### Strategic architecture items to watch

#### 4) Remote filesystem abstraction unification
- [Issue #61860](https://github.com/apache/doris/issues/61860)

Potentially high leverage, but likely large in scope. It would benefit from design review and maintainership sponsorship to avoid stalling.

#### 5) Aggregation engine refactor
- [PR #61690](https://github.com/apache/doris/pull/61690)

This kind of deep internal refactor can unlock future simplification and performance work, but it also risks long review cycles. It deserves sustained reviewer bandwidth.

#### 6) Global TSO implementation
- [PR #61199](https://github.com/apache/doris/pull/61199)

A significant feature with broad architectural implications. Given its scope, it may require explicit roadmap positioning and design scrutiny.

### Stale/aged items worth reconsidering
Several stale PRs were auto-closed today, including:
- [#56303](https://github.com/apache/doris/pull/56303) — prepare statement placeholder literal
- [#56307](https://github.com/apache/doris/pull/56307) — exchange param checking
- [#56322](https://github.com/apache/doris/pull/56322) — UI dependency cleanup

Most do not look immediately critical, but the pattern suggests some older work may be aging out without clear disposition. If any are still relevant, maintainers may want to explicitly re-open or supersede them rather than leaving ambiguity.

---

## Overall Health Assessment

Apache Doris looks **operationally strong and developmentally busy**: release cadence continues, branch maintenance is active, and core execution/storage work is progressing. The main caution flags are around **distributed write correctness**, **ingestion stability**, and **federated/semi-structured interoperability**, which are exactly the kinds of issues that emerge as a system matures into broader production use cases. In short: **healthy momentum, solid maintenance velocity, but with several high-value correctness bugs deserving near-term focus**.

---

## Cross-Engine Comparison

# Cross-Engine OLAP / Analytical Storage Ecosystem Report  
**Based on community digests dated 2026-04-01**

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, with strong parallel investment in **query correctness, lakehouse interoperability, cloud-native operation, and SQL compatibility**. The landscape is increasingly split between **full analytical databases** (Apache Doris, ClickHouse, StarRocks, Databend), **embedded/local analytical engines** (DuckDB), **table format and metadata layers** (Iceberg, Delta Lake), and **execution/runtime substrates** (Velox, Arrow, Gluten). Across projects, current activity suggests the market is moving from “raw performance” competition toward **production trustworthiness**: correctness, connector breadth, cloud object storage behavior, and operational observability are now central. Apache Doris sits in the middle of this convergence: it is behaving like a full-stack MPP OLAP database while rapidly expanding lakehouse federation, streaming ingestion, and cloud integration.

---

## 2. Activity Comparison

### Snapshot table

| Project | Issues updated | PRs updated | Release today | Inferred health score* | Notes |
|---|---:|---:|---|---:|---|
| **Apache Doris** | 6 | 192 | **Yes** (4.0.5) | **8.8/10** | Very high throughput; strong branch maintenance; some serious correctness bugs open |
| **ClickHouse** | 85 | 500 | No | **8.7/10** | Largest visible volume; strong responsiveness; some notable regressions/correctness concerns |
| **DuckDB** | 20 | 43 | No | **8.4/10** | Healthy pace; rapid bug fixing; several high-value edge-case regressions |
| **StarRocks** | 14 | 126 | No | **8.3/10** | Strong engineering velocity; Iceberg and correctness are key focus areas |
| **Apache Iceberg** | 15 | 50 | No | **8.2/10** | Broad multi-engine momentum; spec and integration work remain strong |
| **Delta Lake** | 4 | 50 | No | **8.0/10** | PR-heavy, issue-light; active implementation phase around Flink/Kernel/UC |
| **Databend** | 11 | 17 | **Yes** (v1.2.888-patch-3) | **7.9/10** | Moderate activity but good hygiene; smaller visible community footprint |
| **Velox** | 4 | 50 | No | **8.1/10** | Strong substrate-level work; build and engine improvements active |
| **Apache Gluten** | 3 | 15 | No | **7.8/10** | Active integration-focused project; dependent on upstream Velox cadence |
| **Apache Arrow** | 24 | 18 | No | **8.1/10** | Healthy maintenance loop; strong correctness/CI response |

\*Health score is a qualitative synthesis of activity, release/maintenance behavior, responsiveness, and severity of visible open bugs—not a formal project metric.

### High-level activity ranking by visible development volume
1. **ClickHouse**
2. **Apache Doris**
3. **StarRocks**
4. **Apache Iceberg / Delta Lake / Velox** (different roles, similar visible PR tempo)
5. **DuckDB**
6. **Apache Arrow**
7. **Databend**
8. **Apache Gluten**

---

## 3. Apache Doris’s Position

### Where Doris looks strong versus peers
Apache Doris currently stands out for its combination of:
- **Very high code movement**
- **Active release maintenance across branches**
- **Integrated OLAP database scope** spanning storage, query engine, ingestion, external catalogs, and streaming connectors

Relative to peers:
- Versus **ClickHouse**, Doris appears more visibly focused on **branch stabilization and lakehouse/catalog interoperability**, while ClickHouse shows broader mainline scale and heavier SQL/runtime churn.
- Versus **StarRocks**, Doris shows a similar full-stack MPP trajectory, but Doris currently appears especially active in **external catalog plumbing, Parquet/HMS fixes, and AWS-native ingestion extensions**.
- Versus **DuckDB**, Doris is much more oriented to **distributed serving and production ingestion**, while DuckDB leads in embedded/local analytics ergonomics.
- Versus **Iceberg/Delta**, Doris is a consumer/integrator of open table ecosystem capabilities rather than a table-format control plane.
- Versus **Velox/Arrow**, Doris owns the full user-facing database experience rather than just runtime or data plane infrastructure.

### Technical approach differences
Doris’s current direction suggests a **hybrid analytical database + lakehouse federation platform**:
- Native MPP storage/query engine
- Growing investment in external metadata systems (HMS, JDBC catalogs, Iceberg)
- Streaming ingestion expansion (MSK IAM, Kinesis, TVF continuous import)
- Operational branch maintenance for production users

That differs from:
- **ClickHouse**: strongly storage-engine-centric, high-performance columnar DB with broad SQL/runtime depth and increasingly strong lake support
- **StarRocks**: similarly MPP and lakehouse-facing, currently especially aggressive on Iceberg optimization
- **DuckDB**: in-process analytics and local/embedded compute
- **Iceberg/Delta**: table abstraction standards, not serving databases
- **Velox/Arrow**: reusable execution/data components, not end-user OLAP platforms

### Community size comparison
On visible daily volume, Doris appears:
- **Below ClickHouse** in sheer issue/PR scale
- **Above most other full engines except ClickHouse and roughly comparable/high versus StarRocks**
- Clearly larger in daily maintenance tempo than Databend and Gluten
- More operationally branch-focused than DuckDB
- More end-user engine-oriented than Iceberg/Delta/Arrow/Velox

Overall, Doris looks like a **large, mature, fast-moving top-tier OLAP database project**, though not the single largest by repository activity.

---

## 4. Shared Technical Focus Areas

## A. Lakehouse interoperability and external metadata
**Engines/projects:** Doris, ClickHouse, StarRocks, Iceberg, Delta Lake, Arrow, Gluten  
**Emerging needs:**
- Better **Iceberg/Delta/Parquet compatibility**
- External catalog reliability and scale
- Metadata pruning and planning efficiency
- Schema evolution correctness

**Examples**
- Doris: HMS client pool modernization, Iceberg split planning, JDBC catalog alias preservation
- StarRocks: Iceberg manifest-based `COUNT(*)`, runtime-filter file skipping, FE OOM on huge partition metadata
- ClickHouse: DeltaLake/Iceberg Azure and partition-update issues
- Iceberg: snapshot identity correctness, nested identifier bugs, REST catalog expansion
- Delta Lake: DSv2 + Kernel + Unity Catalog table creation
- Arrow: Parquet robustness and cloud filesystem tuning
- Gluten: Iceberg write config support

## B. Correctness over raw speed
**Engines/projects:** Doris, ClickHouse, DuckDB, StarRocks, Iceberg, Delta, Arrow, Velox  
**Emerging needs:**
- Wrong-result fixes
- durability/commit correctness
- crash prevention in edge execution paths
- safer parser/type semantics

**Examples**
- Doris: `INSERT SELECT` possible invisible/incomplete data after quorum success
- ClickHouse: ReplicatedMergeTree silent row drop risk, Decimal `MIN/MAX`, expression correctness bugs
- DuckDB: window-function wrong-result regression fixed on nightly
- StarRocks: MV rewrite wrong-result issue, JSON inconsistencies
- Iceberg: wrong snapshot results in Spark time travel
- Delta: unintended partition rewrites
- Arrow: list filtering correctness fix
- Velox: spill corruption/flaky serialized page concern

## C. Cloud-native connectors and object storage behavior
**Engines/projects:** Doris, ClickHouse, DuckDB, StarRocks, Iceberg, Delta, Arrow, Gluten  
**Emerging needs:**
- Better S3/GCS/Azure behavior
- identity/auth support
- streaming integration with cloud services
- object-store efficiency and reduced metadata overhead

**Examples**
- Doris: Amazon MSK IAM, Kinesis, remote filesystem abstraction proposal
- ClickHouse: S3 PUT explosion, Azure DeltaLake issues
- DuckDB: large S3 multi-file Parquet crash
- Iceberg: S3 signing endpoint in REST spec
- Delta: UC/cloud integration
- Arrow: GCS connection pool, AWS web identity credentials
- Gluten: S3 teardown correctness

## D. SQL compatibility and portability
**Engines/projects:** ClickHouse, DuckDB, Databend, Gluten, Doris, StarRocks  
**Emerging needs:**
- Dialect compatibility
- standard semantics
- fewer migration surprises

**Examples**
- ClickHouse: case-insensitive identifiers, SQL-compatible null concatenation, standard interval literals
- DuckDB: deferred FK semantics, trigger catalog work, DDL compatibility improvements
- Databend: standard `X'...'` binary literal fix
- Gluten: ANSI cast behavior, TIMESTAMP_NTZ support
- Doris: JDBC TVF alias preservation, planner regression cleanup
- StarRocks: correctness around time arithmetic, count/order semantics

## E. CI stability, build productivity, and engineering scalability
**Engines/projects:** Doris, ClickHouse, DuckDB, Delta, Velox, Arrow, Databend  
**Emerging needs:**
- faster, less flaky CI
- reduced template/build complexity
- better branch propagation and packaging confidence

**Examples**
- Doris: test suite consolidation, external regression setup improvements
- ClickHouse: multiple PRs specifically targeting flaky CI and failpoint noise
- DuckDB: CI and benchmarking support
- Delta: UC compatibility CI gating
- Velox: build fixes and impact tooling
- Arrow: Windows/R CI verification hardening
- Databend: link-checker cleanup

---

## 5. Differentiation Analysis

## Storage format posture
- **Apache Doris / ClickHouse / StarRocks / Databend**: native analytical databases with their own storage engines, increasingly federating open lake formats.
- **DuckDB**: embedded analytics engine, often operating directly on files and external datasets.
- **Iceberg / Delta Lake**: storage table formats and metadata/control layers rather than serving databases.
- **Arrow**: in-memory columnar format and interoperability substrate.
- **Velox / Gluten**: execution-layer components rather than storage systems.

## Query engine design
- **Doris / StarRocks**: distributed MPP analytical databases balancing native storage with lakehouse federation.
- **ClickHouse**: high-throughput columnar execution tightly coupled to MergeTree family storage concepts.
- **DuckDB**: in-process vectorized execution optimized for local/embedded analytics.
- **Velox**: shared vectorized execution engine for higher-level systems.
- **Gluten**: Spark acceleration layer using native backends like Velox.
- **Arrow**: data plane library; not a SQL engine itself.
- **Iceberg / Delta**: rely on external engines for query execution.

## Target workloads
- **Doris**: real-time analytics, serving, federated lakehouse querying, streaming ingestion
- **ClickHouse**: log analytics, event analytics, large-scale serving, high-ingest OLAP
- **StarRocks**: interactive analytics plus aggressive Iceberg/lakehouse acceleration
- **DuckDB**: notebook, local analytics, embedded app analytics, data science
- **Iceberg / Delta**: shared table layers for Spark/Flink/Trino-like ecosystems
- **Databend**: cloud data warehouse style workloads, still growing execution breadth
- **Velox / Gluten / Arrow**: platform components used by other engines

## SQL compatibility profile
- **DuckDB** and **ClickHouse** show particularly visible community demand around SQL compatibility and semantics.
- **Databend** is actively fixing standards mismatches.
- **Gluten** is focused on matching Spark semantics exactly.
- **Doris** and **StarRocks** are less centered on parser-surface compatibility in this snapshot, and more on **planner correctness, external catalog SQL behavior, and operational reliability**.

---

## 6. Community Momentum & Maturity

### Tier 1: Very high momentum, mature ecosystems
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

These projects show strong daily throughput and broad subsystem work.  
- ClickHouse: largest visible activity, high feature and regression handling load
- Doris: strongest branch-stabilization + release maintenance signal
- StarRocks: fast-moving, especially on Iceberg and optimizer/correctness

### Tier 2: High momentum, strong but more specialized or narrower scope
- **DuckDB**
- **Apache Iceberg**
- **Delta Lake**
- **Velox**

These have clear strategic momentum, but each in a different domain:
- DuckDB: embedded analytics and SQL/runtime correctness
- Iceberg: metadata/spec and engine integration ecosystem
- Delta: implementation-heavy, connector/catalog-oriented current phase
- Velox: execution substrate evolution

### Tier 3: Healthy but smaller visible community footprint
- **Databend**
- **Apache Gluten**
- **Apache Arrow** (activity is healthy, but differently shaped)

Notes:
- Arrow is mature and foundational, but its daily signal is more maintenance/infrastructure-oriented than product-surface velocity.
- Databend is active and shipping, but visibly smaller in contributor volume.
- Gluten is energetic but partially constrained by dependency on Velox.

### Rapidly iterating vs stabilizing
**Rapidly iterating**
- ClickHouse
- StarRocks
- DuckDB
- Iceberg
- Velox

**Stabilizing while still evolving**
- Apache Doris
- Delta Lake
- Arrow
- Databend

Doris is notable because it is doing both at once: **deep engine work and heavy multi-branch stabilization**.

---

## 7. Trend Signals

## 1. Lakehouse is now baseline, not optional
Across Doris, StarRocks, ClickHouse, Iceberg, Delta, Arrow, and Gluten, users increasingly expect:
- Iceberg/Delta interoperability
- external catalogs
- schema evolution handling
- object-store-native operation

**Value for architects:** choose engines not just on native performance, but on **metadata scaling, table-format behavior, and federated query correctness**.

## 2. Correctness bugs are now strategically more important than benchmark wins
Multiple projects surfaced wrong-result, silent-drop, or commit-visibility issues.

**Value for data engineers:** during engine selection and upgrade planning, prioritize:
- write semantics
- replication/recovery guarantees
- time-travel correctness
- null/type edge-case handling

## 3. Cloud-native ingestion and identity integration are rising fast
Doris’s AWS-native streaming work, Arrow’s auth gaps, Iceberg REST signing, and Delta/UC integration all point in the same direction.

**Value for architects:** connector maturity and IAM/OAuth support are becoming first-class selection criteria.

## 4. SQL portability pressure is increasing
ClickHouse, DuckDB, Databend, and Gluten all show active pressure toward more standard or cross-engine-compatible behavior.

**Value for platform teams:** for mixed-engine estates, SQL compatibility can materially reduce migration and BI integration costs.

## 5. Metadata scale and planning efficiency are becoming competitive battlegrounds
Especially visible in Doris, StarRocks, Iceberg, and ClickHouse.

**Value for architects:** for large Iceberg/Delta estates, watch:
- partition metadata loading behavior
- manifest/statistics pruning
- catalog client scalability
- planning latency under very large tables

## 6. Developer productivity and CI quality matter more as projects mature
Many leading projects are now investing in flaky-test reduction, compile-time cuts, and packaging validation.

**Value for adopters:** this is a positive maturity signal; projects with strong CI hygiene usually deliver more reliable releases and faster bug turnaround.

---

## Bottom Line for Apache Doris

Apache Doris currently appears to be in a **strong competitive position** among open-source OLAP engines: highly active, release-maintained, and increasingly credible as a **distributed analytical database with lakehouse connectivity and cloud ingestion ambitions**. Its nearest practical peers in this snapshot are **ClickHouse** and **StarRocks**, with ClickHouse leading in sheer ecosystem scale and StarRocks pushing hard on Iceberg-centric optimization. Doris’s biggest opportunity is that it is already behaving like a mature production platform; its biggest risk is that, like its peers, **correctness in distributed writes, ingestion lifecycle stability, and advanced interoperability paths** must keep improving as adoption broadens.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-04-01

## 1. Today’s Overview

ClickHouse remains extremely active: **85 issues** and **500 PRs** were updated in the last 24 hours, which indicates a very high development and maintenance tempo. The signal from today’s activity is mixed but healthy: there is strong forward motion on query execution, SQL compatibility, storage/indexing, Keeper, and data lake integrations, while maintainers are also spending meaningful effort on CI stability, correctness fixes, and regression handling. No new release was published today, so most attention is on **mainline development and stabilization of recent 26.x behavior**. Overall, project health looks strong, but there are clear pressure points around **performance regressions, query correctness edge cases, MergeTree behavior, and CI noise**.

## 2. Project Progress

Today’s closed/merged PR activity shows progress in several important areas:

- **Critical correctness / crash prevention**
  - **Fix out-of-bounds access in lazy materialization with projection PREWHERE** — a significant safety fix for the optimizer/execution pipeline involving projections. This was marked critical and backportable, suggesting maintainers view it as release-relevant.  
    Link: [PR #101115](https://github.com/ClickHouse/ClickHouse/pull/101115)

- **Text index stabilization in release branches**
  - **Backport of several minor text index bug fixes to 26.1** indicates continuing hardening of newer indexing functionality for supported release lines.  
    Link: [PR #100311](https://github.com/ClickHouse/ClickHouse/pull/100311)

- **Query correctness bugs found by fuzzing**
  - Two SQLancer/fuzz-found logical correctness issues were closed today:
    - incorrect `AND -2147483648` handling in MergeTree filters  
      Link: [Issue #99979](https://github.com/ClickHouse/ClickHouse/issues/99979)
    - inconsistent boolean semantics with `2147483648` expressions  
      Link: [Issue #101269](https://github.com/ClickHouse/ClickHouse/issues/101269)
  - This is a positive sign: the project is continuing to catch subtle planner/expression-evaluation bugs before they become widespread production issues.

- **Aggregate correctness**
  - A bug where `MAX()` / `MIN()` on `Decimal` with `GROUP BY` returned wrong results since 26.1 was closed, suggesting a fix has landed or was otherwise resolved quickly.  
    Link: [Issue #100740](https://github.com/ClickHouse/ClickHouse/issues/100740)

- **CI/test maintenance**
  - Several PRs were opened to reduce false signals and flaky behavior, including:
    - revert failpoint injection in stress tests due to too many reports  
      Link: [PR #101430](https://github.com/ClickHouse/ClickHouse/pull/101430)
    - timeout for flaky file log test  
      Link: [PR #101367](https://github.com/ClickHouse/ClickHouse/pull/101367)
    - smarter stateless flaky-check skipping logic  
      Link: [PR #101432](https://github.com/ClickHouse/ClickHouse/pull/101432)

Net assessment: today’s progress is less about new release packaging and more about **hardening core execution paths, backporting important fixes, and improving engineering velocity by taming CI**.

## 3. Community Hot Topics

### 1) Case-insensitive identifiers
- **Issue:** “A setting to allow case insensitive column, table and database names”  
- **Comments:** 32  
- **Link:** [Issue #33935](https://github.com/ClickHouse/ClickHouse/issues/33935)

This remains one of the most persistent compatibility asks. The technical need is straightforward: users integrating legacy BI tools, heterogeneous SQL stacks, or migrated workloads want ClickHouse to behave more like engines that normalize or relax identifier case rules. The fact that the proposed design includes separate settings for columns, tables, and databases suggests users need **granular compatibility controls**, not a blanket parser change.

### 2) 26.2 INSERT regression
- **Issue:** “INSERT queries are 3x slower after upgrading from 25.12 to 26.2”  
- **Comments:** 28  
- **Link:** [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)

This is the most important performance signal in the current issue stream. A 3x regression on `INSERT` into `ReplacingMergeTree` after a version upgrade is exactly the kind of workload-level regression operators care about most. It suggests that recent architectural changes may have shifted ingestion costs, and maintainers will likely need benchmark-backed root-cause isolation before 26.2 adoption broadens further.

### 3) Roadmap coordination
- **Issue:** “ClickHouse roadmap 2026”  
- **Comments:** 21, 👍 5  
- **Link:** [Issue #93288](https://github.com/ClickHouse/ClickHouse/issues/93288)

The roadmap thread remains active, which is a strong signal that users and maintainers are aligning on medium-term priorities. Based on today’s surrounding activity, likely emphasis areas include **data lake interoperability, vector search, SQL standards compatibility, and query/runtime efficiency**.

### 4) CI crash in MergeTree/multi-index paths
- **Issue:** “Double deletion of MergeTreeDataPartCompact in multi_index”  
- **Comments:** 20  
- **Link:** [Issue #99799](https://github.com/ClickHouse/ClickHouse/issues/99799)

This is a noteworthy hotspot because it points to complexity in newer or evolving indexing/data-part lifecycle logic. Even though it is currently CI-labeled, the underlying theme is that ClickHouse is pushing sophisticated storage/index execution paths that can expose object lifetime and ownership bugs.

### 5) Longstanding memory efficiency concern
- **Issue:** “Memory usage is larger than needed”  
- **Comments:** 16  
- **Link:** [Issue #10818](https://github.com/ClickHouse/ClickHouse/issues/10818)

This old issue resurfacing again shows the community still cares about **peak memory discipline**, especially for grouped analytical queries. This is a strategic concern for ClickHouse because memory predictability is often a deciding factor in production adoption and cost efficiency.

## 4. Bugs & Stability

Ranked by likely severity and production impact:

### Critical / high severity

1. **Potential data loss after DELETE + re-INSERT on ReplicatedMergeTree due to deduplication state not cleared**
   - Silent row drop after reinsert is among the most serious classes of bugs.
   - No fix PR is referenced in the provided data.
   - Link: [Issue #101337](https://github.com/ClickHouse/ClickHouse/issues/101337)

2. **INSERT 3x slower in 26.2 vs 25.12**
   - High operational severity because it affects upgrade confidence and ingestion SLAs.
   - No linked fix PR in today’s top items.
   - Link: [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)

3. **Projection PREWHERE lazy materialization out-of-bounds access**
   - This was serious enough to get a critical bugfix and mandatory backport labels.
   - Fixed via:
   - Link: [PR #101115](https://github.com/ClickHouse/ClickHouse/pull/101115)

4. **Big burst of S3 PUTs when JSON type creates Wide parts on S3 disk**
   - High cloud cost / object-storage efficiency concern, especially for users relying on TTL to S3.
   - Link: [Issue #100960](https://github.com/ClickHouse/ClickHouse/issues/100960)

### Medium severity

5. **Skip indexes bypassed on tables with projections when `use_skip_indexes_on_data_read=1`**
   - Impacts expected pruning and can quietly degrade query performance.
   - No fix PR visible in today’s list.
   - Link: [Issue #100783](https://github.com/ClickHouse/ClickHouse/issues/100783)

6. **Date/time overflow setting ignored for casts to `DateTime64` and `Time64`**
   - Correctness and contract violation: configured “throw” behavior is silently ignored.
   - Link: [Issue #100471](https://github.com/ClickHouse/ClickHouse/issues/100471)

7. **DeltaLake Azure schema evolution produces `NOT_IMPLEMENTED`**
   - Material for data lake users; hurts interoperability.
   - Link: [Issue #100438](https://github.com/ClickHouse/ClickHouse/issues/100438)

8. **DeltaLake Azure time-travel setting silently ignored**
   - More severe than a simple exception because it can return wrong data without error.
   - Link: [Issue #100502](https://github.com/ClickHouse/ClickHouse/issues/100502)

9. **Iceberg UPDATE on partitioned tables**
   - Important interoperability fix in progress.
   - Fix PR exists:
   - Link: [PR #101278](https://github.com/ClickHouse/ClickHouse/pull/101278)

### CI / test stability

10. **Double deletion in multi_index CI crash**
    - Link: [Issue #99799](https://github.com/ClickHouse/ClickHouse/issues/99799)

11. **Potential MergeTreeRangeReader CI crash**
    - Link: [Issue #100769](https://github.com/ClickHouse/ClickHouse/issues/100769)

12. **Flaky test `02889_file_log_save_errors`**
    - Issue: [#101334](https://github.com/ClickHouse/ClickHouse/issues/101334)  
    - Fix PR: [#101367](https://github.com/ClickHouse/ClickHouse/pull/101367)

The broad stability picture: production-facing correctness issues exist, but the project is also visibly responsive, with several fuzz-found bugs closed quickly and critical execution-path bugs already under backport.

## 5. Feature Requests & Roadmap Signals

Several user requests today point to where ClickHouse is likely evolving next:

- **SQL compatibility improvements**
  - Case-insensitive identifiers  
    [Issue #33935](https://github.com/ClickHouse/ClickHouse/issues/33935)
  - `concat()` / `||` NULL-propagating behavior as opt-in SQL-compatible mode  
    [Issue #99606](https://github.com/ClickHouse/ClickHouse/issues/99606)
  - SQL-standard compound `INTERVAL ... TO ...` literals already in flight  
    [PR #100453](https://github.com/ClickHouse/ClickHouse/pull/100453)

  These items together strongly suggest continued investment in **cross-dialect SQL ergonomics**.

- **Indexing and query acceleration**
  - Prewarm cache for data skipping indexes  
    [Issue #78215](https://github.com/ClickHouse/ClickHouse/issues/78215)
  - Avoid thundering herd in query result cache  
    [Issue #99226](https://github.com/ClickHouse/ClickHouse/issues/99226)
  - LOOKUP INDEX support for MergeTree  
    [PR #101401](https://github.com/ClickHouse/ClickHouse/pull/101401)
  - Vector similarity index: support dot product  
    [Issue #101431](https://github.com/ClickHouse/ClickHouse/issues/101431)

  This points to a roadmap emphasizing **more specialized indexing and cache-aware performance features**.

- **Data lake and object storage expansion**
  - S3/GCS dictionary sources from Parquet  
    [Issue #101072](https://github.com/ClickHouse/ClickHouse/issues/101072)
  - DataLakeCatalog introspection in query logs  
    [PR #100706](https://github.com/ClickHouse/ClickHouse/pull/100706)
  - DeltaLake/Iceberg fixes and Azure support gaps  
    [Issue #86024](https://github.com/ClickHouse/ClickHouse/issues/86024), [Issue #100438](https://github.com/ClickHouse/ClickHouse/issues/100438), [PR #101278](https://github.com/ClickHouse/ClickHouse/pull/101278)

  This is a strong signal that **lakehouse interoperability remains strategic**.

- **Keeper / coordination layer**
  - Keeper nodes with TTL  
    [PR #100397](https://github.com/ClickHouse/ClickHouse/pull/100397)
  - nuraft streaming mode setting  
    [PR #101427](https://github.com/ClickHouse/ClickHouse/pull/101427)

  This suggests ongoing work to make ClickHouse Keeper more feature-complete and tunable.

### Likely to land in the next version
Most likely near-term candidates based on maturity and active PR status:
1. SQL-standard compound interval literals — [PR #100453](https://github.com/ClickHouse/ClickHouse/pull/100453)
2. Keeper streaming mode controls — [PR #101427](https://github.com/ClickHouse/ClickHouse/pull/101427)
3. DataLakeCatalog query log improvements — [PR #100706](https://github.com/ClickHouse/ClickHouse/pull/100706)
4. MergeTree lookup index groundwork — [PR #101401](https://github.com/ClickHouse/ClickHouse/pull/101401), though this may need more bake time
5. Vector index dot-product support — [Issue #101431](https://github.com/ClickHouse/ClickHouse/issues/101431), likely soon if implementation is simple

## 6. User Feedback Summary

Current user feedback clusters into a few clear themes:

- **Upgrade anxiety**
  - The 26.2 INSERT slowdown is the strongest signal that users are sensitive to performance regressions after upgrades.  
    [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)

- **Correctness over convenience**
  - Users are reporting issues where the system silently returns wrong behavior or wrong data rather than failing loudly:
    - DeltaLake snapshot version ignored on Azure  
      [Issue #100502](https://github.com/ClickHouse/ClickHouse/issues/100502)
    - date/time overflow “throw” ignored  
      [Issue #100471](https://github.com/ClickHouse/ClickHouse/issues/100471)
    - ReplicatedMergeTree reinsert silently dropped  
      [Issue #101337](https://github.com/ClickHouse/ClickHouse/issues/101337)

- **Cloud/object-storage cost and behavior matter**
  - S3 PUT explosion from JSON/Wide parts shows users are deeply attentive to storage layout side effects in cloud deployments.  
    [Issue #100960](https://github.com/ClickHouse/ClickHouse/issues/100960)

- **Compatibility requests remain strong**
  - Case-insensitive identifiers and NULL-propagating concatenation show demand from users porting SQL workloads or integrating third-party tools.  
    [Issue #33935](https://github.com/ClickHouse/ClickHouse/issues/33935), [Issue #99606](https://github.com/ClickHouse/ClickHouse/issues/99606)

- **Data lake workflows are becoming mainstream**
  - Multiple active items around Iceberg, DeltaLake, Azure, and DataLakeCatalog suggest this is no longer niche usage. ClickHouse users increasingly expect first-class lakehouse interoperability.

Overall sentiment from the issue mix is not negative toward ClickHouse’s core value proposition; rather, users appear to be pushing it into broader, more heterogeneous production environments and expect stronger compatibility, correctness guarantees, and cloud efficiency.

## 7. Backlog Watch

These items look important and worthy of maintainer attention due to age, impact, or repeated resurfacing:

- **Case-insensitive identifiers** — longstanding compatibility request since 2022, still active.  
  [Issue #33935](https://github.com/ClickHouse/ClickHouse/issues/33935)

- **Memory usage larger than needed** — open since 2020, still relevant to production efficiency.  
  [Issue #10818](https://github.com/ClickHouse/ClickHouse/issues/10818)

- **URL engine schema/relative URL support** — old usability request with practical connector implications.  
  [Issue #59617](https://github.com/ClickHouse/ClickHouse/issues/59617)

- **DataLakeCatalog ALTER TABLE logical error** — open since 2025 and relevant to enterprise lakehouse workflows.  
  [Issue #86024](https://github.com/ClickHouse/ClickHouse/issues/86024)

- **INSERT INTO SELECT always hits memory limit** — significant usability/performance complaint still open.  
  [Issue #88556](https://github.com/ClickHouse/ClickHouse/issues/88556)

- **Optimization of OR-LIKE chains into regex/multi-match** — likely high leverage for text-heavy analytical workloads.  
  [Issue #87779](https://github.com/ClickHouse/ClickHouse/issues/87779)

## Final Assessment

ClickHouse is showing **very strong development throughput** with visible work across execution engine internals, indexing, Keeper, SQL surface area, and lakehouse connectivity. The main risks right now are **regressions in recent 26.x releases**, subtle **query correctness issues**, and some **storage/CI complexity** around MergeTree-related paths. Still, the project’s responsiveness—especially on fuzzing-discovered bugs and critical backports—suggests a healthy engineering loop. If maintainers can quickly address the **26.2 ingestion regression** and the **ReplicatedMergeTree silent-drop bug**, confidence in the current release line should improve materially.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-04-01

## 1. Today's Overview

DuckDB showed strong day-to-day development activity on 2026-04-01, with **43 PRs updated** and **20 issues updated** in the last 24 hours, indicating an actively maintained engine with both rapid code movement and continued user-reported edge-case discovery. There were **no new releases**, so current momentum is centered on bug fixing, SQL/runtime correctness, CI/build improvements, and incremental feature work rather than a packaged launch. The issue mix suggests the team is balancing **serious correctness and crash reports**—including regressions in 1.5.x—with **longer-horizon SQL semantics and operability requests** such as deferred foreign key checks and space reclamation. Overall project health looks good from a throughput perspective, but there are clear signals that **stability around newer features and certain platform/build paths still needs attention**.

---

## 3. Project Progress

Today’s merged/closed PRs show meaningful forward motion across **query correctness, catalog semantics, SQL compatibility, developer tooling, and safety fixes**.

### Query engine and correctness
- **Prepared-statement invalidation for temp tables fixed**: [PR #21712](https://github.com/duckdb/duckdb/pull/21712) closed a **use-after-free** involving prepared `INSERT` statements targeting temporary tables after `DROP TABLE`. This is an important execution-layer safety fix and reduces the chance of stale catalog references surviving schema changes.
- **Semi HashJoin / IEJoin correctness work** landed via internal fixes:
  - [PR #21724](https://github.com/duckdb/duckdb/pull/21724) — Semi HashJoin fix
  - [PR #21721](https://github.com/duckdb/duckdb/pull/21721) — IEJoin filter-side adjustments  
  These indicate continued refinement of join execution and test validation in the optimizer/executor stack.
- **Window functions became more first-class catalog objects** in [PR #21446](https://github.com/duckdb/duckdb/pull/21446), which added a real `WindowFunctionCatalogEntry`. This is mostly internal infrastructure, but it should improve consistency of function registration and future extensibility in the SQL engine.

### SQL compatibility and DDL behavior
- **Dependency rules for ALTER TABLE were relaxed in a safe case**: [PR #21729](https://github.com/duckdb/duckdb/pull/21729) allows `SET DEFAULT` / `DROP DEFAULT` even when tables have dependencies. This is a practical SQL compatibility improvement and reduces unnecessary DDL friction.
- **COPY header behavior confusion was resolved** through closure of [Issue #21653](https://github.com/duckdb/duckdb/issues/21653), suggesting either documentation or behavior was aligned around CSV header detection.

### Introspection and metadata
- [PR #20752](https://github.com/duckdb/duckdb/pull/20752) added **`extension_name` metadata** to `duckdb_functions()` and `duckdb_types()`. This improves introspection of extension-provided objects and is especially useful as DuckDB’s extension ecosystem grows.

### Benchmarking / engineering productivity
- [PR #21730](https://github.com/duckdb/duckdb/pull/21730) added **ClickBench** support, signaling continued investment in benchmark coverage and regression tracking.
- [PR #21737](https://github.com/duckdb/duckdb/pull/21737) improved estimated cardinality reporting in physical operators, which helps explain plans and debugging.
- Multiple CI-focused PRs were active or closed, including:
  - [PR #21736](https://github.com/duckdb/duckdb/pull/21736) — improve CI jobs
  - [PR #21711](https://github.com/duckdb/duckdb/pull/21711) — fix path test warnings  
  This suggests maintainers are trying to keep a fast-moving codebase reliable across configurations.

---

## 4. Community Hot Topics

Below are the most notable discussion points by issue age, comment count, and technical significance.

### Deferred foreign key validation in self-referential inserts
- [Issue #7168](https://github.com/duckdb/duckdb/issues/7168) — **13 comments, 3 👍**
- Topic: defer FK validation until statement end for self-referential multi-row inserts.

This is one of the clearest long-running SQL semantics requests. The underlying need is **better support for graph/tree-shaped data loads** and behavior closer to mature transactional SQL systems. Users want a single `INSERT` statement to be able to create internally consistent parent/child sets without splitting operations manually. This is not just syntax polish—it touches constraint enforcement timing and transaction semantics.

### Self-referential table truncation/delete behavior
- [Issue #7169](https://github.com/duckdb/duckdb/issues/7169) — **7 comments**
- Topic: inability to truncate or clear a self-referential table.

This pairs naturally with #7168 and points to a broader theme: **foreign-key handling in self-referencing schemas remains incomplete from a usability standpoint**. For users modeling hierarchies, these are fundamental DDL/DML workflow gaps.

### Large S3 multi-file Parquet crash
- [Issue #21669](https://github.com/duckdb/duckdb/issues/21669) — **6 comments**
- Topic: internal error in `CachingFileHandle` when reading large multi-file Parquet datasets from S3.

This is a high-value real-world issue because it intersects several important DuckDB strengths: **remote object storage, Parquet federation, and large-scale analytics**. The reported integer-cast/information-loss error hints at low-level range/accounting problems in file offset or caching logic. This is exactly the kind of issue that matters for production lakehouse-style workloads.

### CSV path parsing bug with `=`
- [Issue #16852](https://github.com/duckdb/duckdb/issues/16852) — **4 comments**
- Topic: file path containing `=` causes incorrect CSV column behavior.

This reveals a subtle but important product expectation: users rely on DuckDB to robustly handle arbitrary filesystem/object-store paths, including generated partition-style paths. Because `=` is common in Hive-style layouts, this may affect data lake ingestion workflows disproportionately.

### Debug build/linker issue
- [Issue #21108](https://github.com/duckdb/duckdb/issues/21108) — **4 comments**
- Topic: multiple definitions for filesystem flags in debug builds.

While not user-facing in the same way as a query bug, this matters for contributors and downstream embedders. It suggests some friction in **non-default build configurations**, especially with alternative linkers/toolchains.

---

## 5. Bugs & Stability

Ranked roughly by severity and risk to users:

### Critical / high severity

1. **Potential data corruption regression in window functions**
   - [Issue #21722](https://github.com/duckdb/duckdb/issues/21722) — closed, marked **fixed on nightly**
   - `row_number() OVER (PARTITION BY ...)` reportedly swapped output column values when partition key order differed from schema order.

   This is the most severe issue in the set because it is a **silent correctness bug**, not just a crash. The good news is it appears already fixed in nightly, which is a strong signal the team prioritized it appropriately.

2. **Crash reading large S3 multi-file Parquet datasets**
   - [Issue #21669](https://github.com/duckdb/duckdb/issues/21669)
   - Internal error in `CachingFileHandle` with range/cast failure.

   High severity due to impact on **cloud-native analytics workloads** and the possibility of hard failures on large datasets.

3. **glibc heap corruption during composite index creation**
   - [Issue #21749](https://github.com/duckdb/duckdb/issues/21749)
   - `free(): corrupted unsorted chunks` on Ubuntu 24.04 / glibc 2.39 during `CREATE INDEX`.

   This is a serious stability signal because it implies potential **memory corruption** in index build paths, especially on large tables and multi-column indexes.

4. **Windows access violation when loading `motherduck` in PyInstaller bundles**
   - [Issue #21602](https://github.com/duckdb/duckdb/issues/21602)
   - Regression in 1.5.x compared with 1.4.x.

   High severity for packaging and Windows deployment use cases, especially for Python applications embedding DuckDB in single-binary distributions.

### Medium severity

5. **Internal binder/assertion failures in complex CTE chains**
   - [Issue #21604](https://github.com/duckdb/duckdb/issues/21604) — closed
   - [Issue #21650](https://github.com/duckdb/duckdb/issues/21650) — closed

   These appear related to complex query planning/binding regressions. Closure suggests mitigation or root-cause consolidation is already underway.

6. **Interrupt/unflushed-block assertion**
   - [Issue #16921](https://github.com/duckdb/duckdb/issues/16921)
   - Assertion when interrupting a query with unflushed blocks.

   Important for reliability in long-running or interactive analytical sessions where cancellation is expected.

7. **Profiling pragma failure**
   - [Issue #21735](https://github.com/duckdb/duckdb/issues/21735)
   - `all_profiling_output` appears broken due to missing `pragma_last_profiling_output`.

   A developer-facing regression affecting observability and performance analysis workflows.

8. **`ieee_floating_point_ops` behavior mismatch**
   - [Issue #21744](https://github.com/duckdb/duckdb/issues/21744)
   - Docs say IEEE NaN/Inf semantics should apply; engine still errors.

   This is partly a correctness, partly a documentation contract issue. Not catastrophic, but important for numerical analysts expecting predictable behavior.

### Lower severity / usability bugs

9. **Dot-command tab-completion Enter behavior**
   - [Issue #21475](https://github.com/duckdb/duckdb/issues/21475) — closed

10. **`SET GLOBAL secret_directory` not taking effect**
    - [Issue #21740](https://github.com/duckdb/duckdb/issues/21740)

11. **Cannot create empty `VARIANT` object**
    - [Issue #21717](https://github.com/duckdb/duckdb/issues/21717)

12. **CSV path with `=` creates wrong column behavior**
    - [Issue #16852](https://github.com/duckdb/duckdb/issues/16852)

### Related fixes in flight
A notable candidate PR tied to numeric semantics is:
- [PR #21673](https://github.com/duckdb/duckdb/pull/21673) — return `inf`/`nan` instead of throwing for overflow in variance/stddev family.  
This may be directly relevant to the concerns raised in [Issue #21744](https://github.com/duckdb/duckdb/issues/21744), though it is not explicitly linked in the provided data.

---

## 6. Feature Requests & Roadmap Signals

Several active items hint at where DuckDB may evolve next.

### JSON and semi-structured data
- [PR #21748](https://github.com/duckdb/duckdb/pull/21748) — add `json_strip_nulls()`
- [PR #21710](https://github.com/duckdb/duckdb/pull/21710) — variant encoding compatibility work
- [Issue #21717](https://github.com/duckdb/duckdb/issues/21717) — empty `VARIANT` object support

These are strong signals that **JSON/VARIANT ergonomics and compatibility remain an active roadmap area**, especially around interoperability with Parquet/Delta-style ecosystems.

### Trigger/catalog support
- [PR #21438](https://github.com/duckdb/duckdb/pull/21438) — add catalog storage and introspection for `CREATE TRIGGER`

This does not necessarily mean full trigger execution support is imminent, but it strongly suggests progress in **catalog-level SQL object completeness** and PostgreSQL-style compatibility.

### Optimizer and execution parallelism
- [PR #21739](https://github.com/duckdb/duckdb/pull/21739) — fan-out wrapper for single-threaded data sources
- [PR #21743](https://github.com/duckdb/duckdb/pull/21743) — join filter pushdown through integral casts
- [PR #21742](https://github.com/duckdb/duckdb/pull/21742) — join filter pushdown for NOP collations

These show continued investment in **optimizer sophistication and parallel execution**, especially in reducing bottlenecks from table functions or broadened pushdown eligibility.

### Ecosystem/platform completeness
- [Issue #21726](https://github.com/duckdb/duckdb/issues/21726) — Windows ARM64 static libs
- [PR #21741](https://github.com/duckdb/duckdb/pull/21741) — merge external extension CI batches
- [PR #21745](https://github.com/duckdb/duckdb/pull/21745) — clangd-tidy in CI

This points to roadmap attention on **platform coverage, packaging, and contributor tooling**.

### Likely near-term candidates for next version
Based on current activity, the features/fixes most likely to appear in the next release are:
- metadata/introspection improvements like [PR #20752](https://github.com/duckdb/duckdb/pull/20752)
- SQL compatibility/DDL behavior adjustments like [PR #21729](https://github.com/duckdb/duckdb/pull/21729)
- safety/correctness fixes such as [PR #21712](https://github.com/duckdb/duckdb/pull/21712)
- optimizer pushdown improvements from [PR #21742](https://github.com/duckdb/duckdb/pull/21742) and [PR #21743](https://github.com/duckdb/duckdb/pull/21743)
- possibly `json_strip_nulls()` from [PR #21748](https://github.com/duckdb/duckdb/pull/21748), since it is relatively self-contained and aligned with existing SQL ecosystem expectations

Less certain for immediate release are broader semantics changes like deferred FK validation in [Issue #7168](https://github.com/duckdb/duckdb/issues/7168), which likely require deeper architectural work.

---

## 7. User Feedback Summary

Today’s issues paint a clear picture of how DuckDB is being used in practice:

- **Cloud/lakehouse analytics**: Users are reading large multi-file Parquet datasets from S3 ([Issue #21669](https://github.com/duckdb/duckdb/issues/21669)), reinforcing DuckDB’s role as a lightweight analytical engine over object storage.
- **Embedded application packaging**: The PyInstaller + Windows regression ([Issue #21602](https://github.com/duckdb/duckdb/issues/21602)) shows DuckDB is being embedded into distributable desktop/server apps, not just notebooks.
- **Large local analytical databases**: The index-creation crash on a ~25GB database ([Issue #21749](https://github.com/duckdb/duckdb/issues/21749)) highlights serious use on multi-million-row datasets.
- **SQL compatibility expectations are rising**: Requests around self-referential foreign keys ([Issue #7168](https://github.com/duckdb/duckdb/issues/7168), [Issue #7169](https://github.com/duckdb/duckdb/issues/7169)), trigger catalog support ([PR #21438](https://github.com/duckdb/duckdb/pull/21438)), and PostgreSQL-like JSON behavior ([PR #21748](https://github.com/duckdb/duckdb/pull/21748)) show users increasingly compare DuckDB against mature OLTP/OLAP SQL systems.
- **Operational rough edges remain**: Space reclamation concerns in [Issue #21154](https://github.com/duckdb/duckdb/issues/21154) indicate a real pain point for long-lived databases and batch mutation workloads.

Broadly, users appear satisfied enough to push DuckDB into more demanding scenarios, but they are now encountering the kinds of **advanced correctness, operability, and compatibility requirements** that come with wider adoption.

---

## 8. Backlog Watch

These older or strategically important items deserve continued maintainer attention:

### Long-standing SQL semantics gaps
- [Issue #7168](https://github.com/duckdb/duckdb/issues/7168) — defer foreign key validation until end of statement
- [Issue #7169](https://github.com/duckdb/duckdb/issues/7169) — truncate/delete on self-referential tables

These are old, reproduced, and still active. They affect users modeling hierarchical data and represent notable compatibility gaps.

### Documentation/product behavior mismatch
- [Issue #16852](https://github.com/duckdb/duckdb/issues/16852) — CSV path with `=`
- [Issue #21744](https://github.com/duckdb/duckdb/issues/21744) — `ieee_floating_point_ops` not behaving as documented
- [Issue #21653](https://github.com/duckdb/duckdb/issues/21653) — COPY header detection confusion, now closed but worth ensuring docs stay aligned

DuckDB’s simplicity is a major strength, so mismatches between docs and runtime behavior can erode user trust disproportionately.

### Operational/storage concerns
- [Issue #21154](https://github.com/duckdb/duckdb/issues/21154) — no native `VACUUM FULL` / space reclamation path

This is a strategically important issue. For append-heavy or churn-heavy workloads, reclaiming disk space is not an edge feature—it is core operability.

### Contributor and platform friction
- [Issue #21108](https://github.com/duckdb/duckdb/issues/21108) — debug build linker issues
- [Issue #21726](https://github.com/duckdb/duckdb/issues/21726) — Windows ARM64 static libs

These matter for ecosystem growth, downstream packaging, and expanding contributor surfaces.

### New but important items needing fast triage
- [Issue #21749](https://github.com/duckdb/duckdb/issues/21749) — index-build heap corruption
- [Issue #21747](https://github.com/duckdb/duckdb/issues/21747) — macro-related performance issue
- [Issue #21735](https://github.com/duckdb/duckdb/issues/21735) — broken profiling pragma
- [Issue #21740](https://github.com/duckdb/duckdb/issues/21740) — `secret_directory` setting ineffective

These have little discussion yet but touch critical areas: memory safety, query analysis performance, observability, and secrets/configuration management.

---

## Overall Assessment

DuckDB remains highly active and technically ambitious, with today’s activity showing a healthy stream of **engine fixes, optimizer work, metadata improvements, and ecosystem polish**. The main caution flags are around **recent regressions and edge-case correctness/stability**, especially in advanced SQL planning paths, remote file access, indexing, and embedded packaging scenarios. If maintainers continue to close severe regressions as quickly as seen with [Issue #21722](https://github.com/duckdb/duckdb/issues/21722), the project remains in strong shape; however, **older operability and SQL semantics gaps are becoming more visible as adoption broadens**.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-04-01

## 1. Today's Overview

StarRocks remained highly active over the last 24 hours, with **126 PR updates** and **14 issue updates**, indicating strong ongoing development velocity even without a new release. The work stream is concentrated around **Iceberg integration**, **query correctness**, **materialized view stability**, **optimizer/statistics improvements**, and **security hardening**. A notable pattern is that several newly opened issues and PRs focus on **analytical correctness and planner behavior**, which is important for OLAP trustworthiness. Overall project health looks solid from an activity perspective, but there are still meaningful risks around **Iceberg scale**, **MV rewrite correctness**, and **frontend memory/runtime robustness**.

## 2. Project Progress

Merged/closed work today suggests continued progress in three main areas: SQL semantics, replication/storage correctness, and branch maintenance.

### SQL engine and optimizer progress
- **CTE materialization hints support** was closed via PR [#70802](https://github.com/StarRocks/starrocks/pull/70802), advancing user control over optimizer behavior for complex queries. This is a meaningful usability and performance feature for analytical workloads where CTE inlining can inflate planning or execution cost.
- The issue **incorrect `count()` result when using `ORDER BY`** was closed: [#70904](https://github.com/StarRocks/starrocks/issues/70904). Even without the linked fix PR in this dataset, closure suggests a correctness path was identified or already integrated.
- The issue around **`now() - max(timestamp)` showing incorrect differences in the first seconds of each minute** was also closed: [#70669](https://github.com/StarRocks/starrocks/issues/70669), indicating attention to time-function consistency and Kafka/streaming latency monitoring use cases.

### Storage and replication progress
- Enhancement issue **DeltaColumnGroup (.cols file) synchronization during shared-nothing to shared-data replication** was closed: [#69334](https://github.com/StarRocks/starrocks/issues/69334). This is important for clusters using **partial update** and **generated columns**, and signals continued convergence between StarRocks deployment modes.
- Backport and maintenance activity remains strong, including:
  - [#71089](https://github.com/StarRocks/starrocks/pull/71089) — closed backport for **array insert into Hive CSV tables**
  - [#52042](https://github.com/StarRocks/starrocks/pull/52042) — closed backport for **MV refresh with multi-partition-column base tables**
  - [#71090](https://github.com/StarRocks/starrocks/pull/71090) — closed/conflicted backport related to **low-cardinality rewrite crash on `LEAD/LAG`**

### In-flight work with strong near-term impact
Several open PRs likely to materially improve performance or stability soon:
- [#71097](https://github.com/StarRocks/starrocks/pull/71097) — **use Iceberg manifest metadata to answer `COUNT(*)` / `COUNT(1)`**
- [#71098](https://github.com/StarRocks/starrocks/pull/71098) — **runtime-filter-based file skipping for Iceberg scans**
- [#71083](https://github.com/StarRocks/starrocks/pull/71083) — **fix use-after-free in parallel rowset loading**
- [#71095](https://github.com/StarRocks/starrocks/pull/71095) — **credential redaction in SQL execution/logging paths**

These are strong signs that StarRocks is prioritizing both **federated lakehouse efficiency** and **operational safety**.

## 3. Community Hot Topics

### 1) FE OOM on Iceberg tables with millions of partitions
- Issue: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
- Comments: 8

This is the most discussed issue in the current issue set and highlights a major scalability concern: the FE appears to **eagerly load partition metadata**, causing OOM for very large Iceberg tables. The underlying technical need is clear: StarRocks users are pushing it into **massive external metadata environments**, and they need **lazy metadata loading**, **partition pagination**, or **manifest/statistics-driven pruning without full partition hydration**. This is one of the most strategically important issues because it affects StarRocks’ competitiveness as a lakehouse query engine.

### 2) UDF support via S3 or HDFS
- Issue: [#28937](https://github.com/StarRocks/starrocks/issues/28937)
- Reactions: 👍 2

This long-lived feature request remains relevant. The need is operational simplicity: users want to deploy UDF artifacts from **remote object storage or distributed filesystems** rather than manually staging them on cluster nodes. This points to demand for more cloud-native extensibility.

### 3) Inline aggregation state support
- PR: [#70958](https://github.com/StarRocks/starrocks/pull/70958)

Although comment counts are unavailable, this is one of the more architecturally notable open PRs. Inline aggregate state support can matter for advanced aggregation execution, UDAF internals, and possibly MV or pipeline execution efficiency.

### 4) Iceberg scan pruning based on runtime filter vs manifest stats
- Issue: [#71005](https://github.com/StarRocks/starrocks/issues/71005)
- PR: [#71098](https://github.com/StarRocks/starrocks/pull/71098)

This issue-to-PR pair is a strong roadmap signal. It reflects a user need to reduce unnecessary file opens and planning overhead in **star-schema joins over Iceberg fact tables**, using runtime filter ranges against manifest metadata. This is exactly the kind of optimization high-scale lakehouse users care about.

### 5) New JDBC driver documentation
- PR: [#71099](https://github.com/StarRocks/starrocks/pull/71099)

This indicates product maturation beyond core engine internals. The mention of **DataGrip compatibility pain with older drivers** shows growing attention to developer tooling and BI integration.

## 4. Bugs & Stability

Below are the most important bug/stability items from the latest updates, ranked by likely severity.

### Critical
1. **FE OOM with Iceberg tables having millions of partitions**
   - Issue: [#67760](https://github.com/StarRocks/starrocks/issues/67760)
   - Impact: frontend crashes, cluster instability, inability to query large Iceberg catalogs
   - Status: open
   - Fix PR in dataset: none directly linked

2. **Use-after-free in parallel segment/rowset loading**
   - PR: [#71083](https://github.com/StarRocks/starrocks/pull/71083)
   - Impact: backend crash / memory safety issue on error path
   - Status: open
   - Severity is high because it touches storage loading and crash safety.

3. **CN SIGSEGV in `FlatJsonColumnWriter::finish()` during async MV refresh on Iceberg**
   - Issue: [#69260](https://github.com/StarRocks/starrocks/issues/69260)
   - Impact: compute node crash during shared-data/lake mode async MV refresh
   - Status: open
   - This combines three sensitive areas: **Flat JSON**, **MV refresh**, and **Iceberg lake mode**.

4. **NPE in SQL analyzer when source table is dropped**
   - Issue: [#71070](https://github.com/StarRocks/starrocks/issues/71070)
   - Impact: analyzer crash on null table reference
   - Status: open
   - This appears straightforward to fix, but it is in a critical FE path.

### High
5. **Incorrect query result caused by multi-stage MV rewrite**
   - Issue: [#71058](https://github.com/StarRocks/starrocks/issues/71058)
   - Impact: wrong answers
   - Status: open
   - Wrong-result bugs are especially serious for OLAP systems because they undermine trust.

6. **Optimizer bug found via SQLancer-style repro**
   - Issue: [#71057](https://github.com/StarRocks/starrocks/issues/71057)
   - Impact: likely planner/correctness regression
   - Status: open
   - The generated repro suggests fuzz-testing continues to expose edge cases.

7. **JSON function returns inconsistent result**
   - Issue: [#68789](https://github.com/StarRocks/starrocks/issues/68789)
   - Impact: semantic inconsistency on JSON type with `flat_json.enable=true`
   - Status: open

8. **Integration test `test_limit` failed**
   - Issue: [#70536](https://github.com/StarRocks/starrocks/issues/70536)
   - Impact: possible SQL `LIMIT offset,count` semantic regression
   - Status: open

### Medium
9. **Storage volume manager DB read lock leak**
   - Issue: [#70941](https://github.com/StarRocks/starrocks/issues/70941)
   - Status: closed
   - Important operationally for shared-data deployments; closure is a positive signal.

10. **`now() - max(timestamp)` incorrect diff in first few seconds of minute**
   - Issue: [#70669](https://github.com/StarRocks/starrocks/issues/70669)
   - Status: closed

11. **Incorrect `count()` result when using `ORDER BY`**
   - Issue: [#70904](https://github.com/StarRocks/starrocks/issues/70904)
   - Status: closed
   - Another correctness issue now apparently resolved.

### Security-related
12. **Netty CVEs**
   - Issue: [#71015](https://github.com/StarRocks/starrocks/issues/71015)
   - Impact: dependency vulnerability in `io.netty`
   - Status: open

13. **pprof CVE fix**
   - PR: [#71080](https://github.com/StarRocks/starrocks/pull/71080)
   - Status: open

14. **Credential redaction in SQL executor/logging paths**
   - PR: [#71095](https://github.com/StarRocks/starrocks/pull/71095)
   - Status: open
   - This is not a CVE, but it materially improves secrets hygiene.

## 5. Feature Requests & Roadmap Signals

### Iceberg performance is the clearest roadmap theme
- Feature request: [#71005](https://github.com/StarRocks/starrocks/issues/71005)
- Matching PR: [#71098](https://github.com/StarRocks/starrocks/pull/71098)
- Related PR: [#71097](https://github.com/StarRocks/starrocks/pull/71097)

The strongest product signal today is that StarRocks is investing aggressively in **Iceberg query planning and scan avoidance**:
- manifest-based `COUNT(*)`
- runtime-filter-aware file skipping
- reducing planning cost and unnecessary file opens

These improvements are likely candidates for the **next minor release line**, especially for 4.0/4.1 if review proceeds quickly.

### UDF deployment from remote storage
- Issue: [#28937](https://github.com/StarRocks/starrocks/issues/28937)

This remains a notable user ask, especially for cloud-native and managed environments. Because it has existed for a long time and references prior related work, it may land incrementally rather than as a fully new subsystem.

### More low-cardinality and dictionary optimizations
- PR: [#71093](https://github.com/StarRocks/starrocks/pull/71093) — dictification for physical filter
- PR: [#71094](https://github.com/StarRocks/starrocks/pull/71094) — more functions in `LOW_CARD_STRING_FUNCTIONS`

These suggest sustained optimizer investment in low-cardinality execution paths, which are highly relevant for log analytics and dimensional workloads.

### Inline aggregate state and function/statistics improvements
- PR: [#70958](https://github.com/StarRocks/starrocks/pull/70958)
- PR: [#71087](https://github.com/StarRocks/starrocks/pull/71087)

These point toward engine-level refinement for aggregate execution and better planner estimates, both of which can feed into future performance gains.

### SQL/documentation/productization signals
- PR: [#71071](https://github.com/StarRocks/starrocks/pull/71071) — refactor SELECT references docs
- PR: [#71099](https://github.com/StarRocks/starrocks/pull/71099) — JDBC driver docs
- PR: [#66206](https://github.com/StarRocks/starrocks/pull/66206) — URL function implementation/docs, still proto-review

Prediction: near-term visible user-facing improvements are most likely in:
1. **Iceberg optimization**
2. **JDBC/tooling/documentation**
3. **optimizer robustness and low-cardinality execution**
4. **security dependency updates**

## 6. User Feedback Summary

Current user feedback clusters around a few practical pain points:

- **Iceberg at extreme scale is stressing FE architecture**
  - [#67760](https://github.com/StarRocks/starrocks/issues/67760)
  - Users are running very large external catalogs and need StarRocks to behave more lazily and efficiently with metadata.

- **Correctness remains a top expectation**
  - [#71058](https://github.com/StarRocks/starrocks/issues/71058)
  - [#70904](https://github.com/StarRocks/starrocks/issues/70904)
  - [#70669](https://github.com/StarRocks/starrocks/issues/70669)
  - [#68789](https://github.com/StarRocks/starrocks/issues/68789)
  - Reports show users are validating not just performance but exact SQL semantics across aggregation, ordering, time arithmetic, JSON, and MV rewrite behavior.

- **Cloud-native operability and extensibility matter**
  - [#28937](https://github.com/StarRocks/starrocks/issues/28937)
  - Users want easier artifact distribution for UDFs and fewer node-local deployment requirements.

- **Tooling compatibility is increasingly important**
  - [#71099](https://github.com/StarRocks/starrocks/pull/71099)
  - JDBC driver docs and DataGrip-specific notes indicate a growing audience using StarRocks through standard SQL clients and BI tooling.

- **Security and compliance are active concerns**
  - [#71015](https://github.com/StarRocks/starrocks/issues/71015)
  - [#71095](https://github.com/StarRocks/starrocks/pull/71095)
  - Dependency CVEs and credential redaction are receiving prompt attention, which is positive for enterprise adoption.

## 7. Backlog Watch

These older or strategically important items appear to deserve maintainer attention.

### High-priority backlog items
1. **FE OOM with massive Iceberg partition metadata**
   - [#67760](https://github.com/StarRocks/starrocks/issues/67760)
   - Created 2026-01-12
   - Important because it blocks large-scale Iceberg deployments and has the highest discussion count in the current issue list.

2. **Flat JSON crash during async MV refresh on Iceberg in lake mode**
   - [#69260](https://github.com/StarRocks/starrocks/issues/69260)
   - Created 2026-02-13
   - Serious crash in a modern deployment mode; needs clear triage and likely regression coverage.

3. **JSON function inconsistency**
   - [#68789](https://github.com/StarRocks/starrocks/issues/68789)
   - Created 2026-02-02
   - Silent semantic inconsistency is dangerous because users may not notice incorrect behavior quickly.

4. **UDF support from S3/HDFS**
   - [#28937](https://github.com/StarRocks/starrocks/issues/28937)
   - Created 2023-08-09
   - Longstanding feature request with user interest; still relevant for cloud-native adoption.

### Long-running/open PR needing attention
5. **URL Function Implementation**
   - [#66206](https://github.com/StarRocks/starrocks/pull/66206)
   - Created 2025-12-02
   - Still in proto-review and mentions SSRF concerns. This likely needs explicit product/security direction before it can progress.

6. **Thrift upgrade on BE**
   - [#70822](https://github.com/StarRocks/starrocks/pull/70822)
   - Large dependency/tooling change; worth close review because it could affect interoperability and stability.

## Overall Assessment

StarRocks shows **strong engineering momentum** with substantial work across engine internals, Iceberg performance, SQL correctness, and security. The project’s most important near-term challenge is balancing feature velocity with reliability in **complex lakehouse scenarios**, especially around Iceberg metadata scale and MV/query rewrite correctness. If the current Iceberg optimization PRs land cleanly and the open correctness bugs are addressed quickly, project health will remain strong. The absence of a release today is not concerning given the volume of active maintenance and backport activity.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-04-01

## 1) Today's Overview

Apache Iceberg showed **high development activity** over the last 24 hours, with **50 PRs updated** and **15 issues updated**, indicating an actively maintained project across core, Spark, Flink, Kafka Connect, REST catalog, and specification workstreams. There were **no new releases**, so the focus remains on integrating fixes, advancing v4/spec work, and tightening correctness in engine integrations rather than packaging a new version. The strongest themes today were **Spark query correctness**, **Kafka Connect type/timestamp handling**, **REST/OpenAPI evolution**, and ongoing **specification expansion** around relative paths, geo types, and function endpoints. Overall project health appears solid, but several open bugs still point to important edge cases in **snapshot isolation, nested identifiers, sink recovery, and connector parsing**.

---

## 2) Project Progress

Merged/closed PRs and closed issues updated today suggest progress in several areas:

### Spark and SQL execution
- **Spark 4.1 async microbatch planning bugs fixed** in [PR #15670](https://github.com/apache/iceberg/pull/15670).  
  This is an important correctness/stability improvement for streaming behavior, particularly around snapshot handling and stopping conditions in async microbatch execution.
- A cleanup item removing outdated assumptions about Spark 2 was closed via [Issue #15821](https://github.com/apache/iceberg/issues/15821), reinforcing continued focus on modern Spark baselines and reducing legacy test burden.

### Core / metadata foundations
- **Foundational v4 manifest support types** were closed/merged in [PR #15049](https://github.com/apache/iceberg/pull/15049).  
  This is a meaningful roadmap signal: Iceberg is continuing to lay internal building blocks for **v4 adaptive metadata tree / single-file commit related work**, which could materially improve metadata scalability in future releases.
- **REST Namespace UUID support implementation** was closed in [PR #15408](https://github.com/apache/iceberg/pull/15408), reflecting continued REST catalog maturation tied to spec evolution.
- **S3 signing endpoint promoted into the main REST/OpenAPI spec** in [PR #15450](https://github.com/apache/iceberg/pull/15450).  
  This expands remote signing from an AWS-specific idea into a broader API primitive, potentially benefiting multi-cloud object storage integrations.

### Kafka Connect and connector robustness
- A Kafka Connect PR to handle `java.util.Date` in record conversion, [PR #15345](https://github.com/apache/iceberg/pull/15345), was closed. Even if not necessarily merged as-is, the topic underscores active work around converter compatibility with real-world serializer behavior.
- A throughput question for a connector deployment, [Issue #13399](https://github.com/apache/iceberg/issues/13399), was closed, suggesting at least some user support resolution around operational tuning.

### Hive/Spark compatibility and maintenance
- The long-running request to support Hive 3 more smoothly with Spark integrations, [Issue #14082](https://github.com/apache/iceberg/issues/14082), was closed. This may indicate either resolution, de-prioritization, or closure due to inactivity, but in any case removes one older compatibility thread from the active queue.
- A Spark procedure bug involving a column named `partition`, [Issue #14056](https://github.com/apache/iceberg/issues/14056), was also closed, which is positive for SQL/procedure edge-case handling.

---

## 3) Community Hot Topics

Below are the most notable active discussions by comment volume and technical significance.

### 1. REST Catalog OAuth refresh token support
- **Issue #12196** — [OAuth 2 grant type "refresh_token" not implemented](https://github.com/apache/iceberg/issues/12196)  
- 13 comments

This is the most discussed updated issue in the set and points to a significant enterprise adoption need: **long-lived authentication flows for the REST catalog**. As Iceberg pushes more functionality through standardized REST catalog APIs, missing support for the OAuth refresh token grant becomes a blocker for production identity integration, especially where short-lived access tokens are mandated.

### 2. Hive 3 support with Spark/Iceberg classloading
- **Issue #14082** — [Support Hive3 when using Iceberg with Spark](https://github.com/apache/iceberg/issues/14082)  
- 8 comments, closed

This discussion highlights the persistent difficulty of **classloader isolation** in Spark when external metastore/Hive dependencies are involved. Even though the issue is now closed, the underlying need remains relevant: users want smoother interoperability between Spark, Hive 3 jars, and Iceberg catalogs without fragile classpath workarounds.

### 3. Variant datatype support in Parquet / MERGE INTO path
- **Issue #14707** — [Implement VariantVisitor (parquet) to support MERGE INTO operations](https://github.com/apache/iceberg/issues/14707)  
- 5 comments  
- Related active work: [PR #15385](https://github.com/apache/iceberg/pull/15385), [PR #15283](https://github.com/apache/iceberg/pull/15283)

This is a strong roadmap cluster. Iceberg contributors are clearly investing in **VARIANT/semi-structured data support** across engines and connectors. The technical need is broader than one bug: users want variant-aware scan planning, pushdown, merge semantics, and ingestion support across Spark, Parquet, and Kafka Connect.

### 4. Spark time-travel correctness / cache identity
- **Issue #15741** — [Running 2 queries on the same table but different snapshot ID in Spark results in first snapshot's data returned for both queries](https://github.com/apache/iceberg/issues/15741)  
- 4 comments  
- Likely fix: [PR #15840](https://github.com/apache/iceberg/pull/15840)

This is one of the most important correctness threads today. The problem appears rooted in `SparkTable.equals/hashCode` not distinguishing snapshot/branch identity, causing cache reuse across logically different reads. This reflects growing user reliance on **time travel and branch-based analytics**, where subtle caching bugs become severe.

### 5. Flink sink recovery and commit durability
- **Issue #14090** — [Flink 2.0: DynamicIcebergSink drops commits during recovery](https://github.com/apache/iceberg/issues/14090)  
- 4 comments

This is an operationally serious need for streaming users: exactly-once/recovery semantics in Flink sinks remain a critical trust boundary. Any dropped commit risk directly affects data durability and correctness in production pipelines.

### 6. Manifest compression expectations in PyIceberg
- **Issue #14231** — [write.avro.compression-codec has no effect on manifest file compression](https://github.com/apache/iceberg/issues/14231)  
- 4 comments

This discussion reflects a common user need for **predictable storage tuning and documentation clarity**. It suggests some confusion around which table properties govern data files versus metadata/manifests, especially in PyIceberg-driven workflows.

---

## 4) Bugs & Stability

Ranked by likely severity based on reported impact.

### Critical / high severity

1. **Spark returns stale/wrong results across different snapshot IDs**
   - Issue: [#15741](https://github.com/apache/iceberg/issues/15741)
   - Fix PR: [#15840](https://github.com/apache/iceberg/pull/15840)

   This is a **query correctness bug**, not just a performance issue. If Spark reuses cached plans/results for different snapshots or branches of the same table, users can receive incorrect analytical results while believing time travel semantics are honored.

2. **Flink 2.0 DynamicIcebergSink may drop commits during recovery**
   - Issue: [#14090](https://github.com/apache/iceberg/issues/14090)

   This is potentially a **durability and exactly-once semantics** issue in streaming ingestion. Bugs in recovery paths are among the most severe for production data infrastructure because they can silently lose committed work.

3. **Nested identifier fields make column reads fail**
   - Issue: [#15826](https://github.com/apache/iceberg/issues/15826)

   The report says `select *` succeeds but projecting individual columns fails when nested fields are used as identifiers. This suggests a planner/schema resolution bug affecting advanced schema modeling. For users relying on identifier fields for CDC/upserts, this is a high-value fix.

### Medium severity

4. **Kafka Connect sink crashes on timestamps with fractional seconds and colon-separated offsets**
   - Issue: [#15838](https://github.com/apache/iceberg/issues/15838)
   - Fix PR: [#15839](https://github.com/apache/iceberg/pull/15839)

   This is a reproducible connector crash on valid timestamp strings. Severity is moderate-to-high for Kafka Connect users because it causes ingestion failure, but it also appears to have a same-day fix PR.

5. **Empty source/javadoc jars for `iceberg-spark-runtime-4.0_2.13`**
   - Issue: [#15824](https://github.com/apache/iceberg/issues/15824)

   This does not affect runtime execution directly, but it harms developer usability, IDE integration, and artifact quality expectations for Spark 4 users.

6. **Hive table creation does not respect `HIVE_LOCK_ENABLED` property**
   - Issue: [#14237](https://github.com/apache/iceberg/issues/14237)

   This is a configuration correctness issue in Hive integrations and may contribute to inconsistent lock behavior in production.

### Lower severity / maintenance quality

7. **Deleting all fields from nested struct now explicitly rejected**
   - PR: [#15841](https://github.com/apache/iceberg/pull/15841)

   This is a good defensive hardening change in core. It prevents undefined schema states rather than fixing a user-reported outage, but it improves metadata integrity.

8. **Metastore lock timeout and overwrite metadata loss concern**
   - PR: [#15447](https://github.com/apache/iceberg/pull/15447)

   This remains open and stale, but the topic is important. Any metadata overwrite risk tied to lock confirmation deserves maintainer attention, especially in Hive-backed deployments.

---

## 5) Feature Requests & Roadmap Signals

Several active items provide strong hints about near-term product direction.

### REST catalog and OpenAPI expansion
- [Issue #12196](https://github.com/apache/iceberg/issues/12196) — OAuth refresh token flow
- [PR #15180](https://github.com/apache/iceberg/pull/15180) — list/load function endpoints in OpenAPI
- [PR #15450](https://github.com/apache/iceberg/pull/15450) — S3 signing endpoint promoted to main spec
- [PR #15408](https://github.com/apache/iceberg/pull/15408) — namespace UUID support

**Prediction:** REST catalog capabilities will continue to expand in the next version, especially around **authentication, richer object models, and cloud/storage interoperability**.

### Variant / semi-structured data support
- [Issue #14707](https://github.com/apache/iceberg/issues/14707) — VariantVisitor for Parquet / MERGE
- [PR #15385](https://github.com/apache/iceberg/pull/15385) — Spark `variant_get` predicate pushdown for file skipping
- [PR #15283](https://github.com/apache/iceberg/pull/15283) — Kafka Connect VARIANT support

**Prediction:** VARIANT support is increasingly likely to land in broader form soon. The work spans **storage reader/writer plumbing, query pushdown, and ingestion conversion**, which is usually a sign of coordinated feature maturation.

### Snapshot properties and write metadata propagation
- [PR #15842](https://github.com/apache/iceberg/pull/15842) — session-level snapshot properties for actions
- [PR #15836](https://github.com/apache/iceberg/pull/15836) — metadata-only DELETE respects custom snapshot properties
- [Issue #14077](https://github.com/apache/iceberg/issues/14077) — expose metadata build/write duration in `CommitReport`

**Prediction:** The next release may improve **write observability, commit metadata control, and operational auditability**, especially in Spark actions and maintenance procedures.

### Specification evolution toward v4 and broader semantics
- [PR #15630](https://github.com/apache/iceberg/pull/15630) — relative paths in v4 spec
- [PR #15049](https://github.com/apache/iceberg/pull/15049) — v4 manifest foundations
- [PR #15834](https://github.com/apache/iceberg/pull/15834) — geo spec updates
- [PR #15781](https://github.com/apache/iceberg/pull/15781) — geo CRS wording clarification

**Prediction:** Iceberg is steadily building toward a richer **v4-era metadata and type system**, with geo and path semantics joining prior work on adaptive metadata structures.

---

## 6) User Feedback Summary

The last day’s issues show several consistent user pain points:

- **Correctness matters more than raw feature count.**  
  Reports like [#15741](https://github.com/apache/iceberg/issues/15741) and [#14090](https://github.com/apache/iceberg/issues/14090) show users are exercising time travel, branching, and streaming recovery in production-like scenarios. These are advanced features, and users expect strict correctness.

- **Engine integration edge cases remain costly.**  
  Spark/Hive classloading ([#14082](https://github.com/apache/iceberg/issues/14082)), nested identifiers ([#15826](https://github.com/apache/iceberg/issues/15826)), and action/property propagation ([#15842](https://github.com/apache/iceberg/pull/15842), [#15836](https://github.com/apache/iceberg/pull/15836)) all point to friction at the boundaries between Iceberg’s abstractions and query engine behavior.

- **Kafka Connect adoption is active but conversion robustness is still a pain point.**  
  Timestamp parsing failures ([#15838](https://github.com/apache/iceberg/issues/15838)), Java object conversion support ([#15283](https://github.com/apache/iceberg/pull/15283)), and prior `java.util.Date` handling work ([#15345](https://github.com/apache/iceberg/pull/15345)) show connector users are feeding diverse, imperfect real-world schemas into Iceberg.

- **Users want clearer metadata/operational semantics.**  
  Examples include manifest compression expectations ([#14231](https://github.com/apache/iceberg/issues/14231)), commit timing metrics ([#14077](https://github.com/apache/iceberg/issues/14077)), and Hive lock property behavior ([#14237](https://github.com/apache/iceberg/issues/14237)).

- **Security and production hardening are becoming more visible concerns.**
  - [Issue #14233](https://github.com/apache/iceberg/issues/14233) raises concerns about vulnerable Docker Compose example images.
  - [PR #15500](https://github.com/apache/iceberg/pull/15500) addresses hostname verification policy exposure in TLS configuration.

This suggests user expectations are shifting from “feature availability” toward **enterprise readiness, operational observability, and secure deployment defaults**.

---

## 7) Backlog Watch

These items look important and may need explicit maintainer attention because they are either stale, impactful, or strategically important.

### High-priority stale or aging items

- [Issue #12196](https://github.com/apache/iceberg/issues/12196) — REST Catalog OAuth refresh token support  
  Important for enterprise auth integration; still open despite strong relevance to REST catalog adoption.

- [Issue #14090](https://github.com/apache/iceberg/issues/14090) — Flink 2.0 sink recovery dropping commits  
  A potentially severe streaming durability issue that should not linger.

- [PR #15447](https://github.com/apache/iceberg/pull/15447) — Hive metastore lock timeout causing metadata overwrite data loss  
  Open and stale, but the risk profile is high enough to warrant review.

- [PR #15167](https://github.com/apache/iceberg/pull/15167) — AWS AssumeRole client factory region forwarding  
  Important for Kubernetes/non-EC2 deployments where region auto-detection is unreliable.

- [Issue #14077](https://github.com/apache/iceberg/issues/14077) — commit report metadata build/write duration  
  Valuable observability enhancement with direct operator benefit.

### Strategic feature backlog

- [Issue #14707](https://github.com/apache/iceberg/issues/14707) — VariantVisitor for Parquet  
  Key dependency for broader VARIANT support in MERGE and read/write paths.

- [PR #15180](https://github.com/apache/iceberg/pull/15180) — function endpoints in REST OpenAPI  
  Important if Iceberg wants fuller catalog/function interoperability through REST.

- [PR #15630](https://github.com/apache/iceberg/pull/15630) — relative paths in v4 spec  
  Spec work with potentially broad storage/layout consequences.

### Maintenance and ecosystem hygiene

- [Issue #14233](https://github.com/apache/iceberg/issues/14233) — vulnerable Docker Compose example images  
  Not core-engine work, but a visible trust and onboarding issue for new users.

---

## 8) Overall Health Assessment

Apache Iceberg remains in a **healthy and highly active** state, with broad concurrent work across **core metadata internals, engine integrations, REST APIs, and specification evolution**. The absence of a release today is offset by meaningful forward motion on **v4 foundations, Spark correctness, and REST standardization**. The main risk area is not inactivity but rather the number of **edge-case correctness bugs** still open in major integrations like Spark, Flink, and Kafka Connect. If the current open fixes for snapshot identity and connector timestamp parsing land quickly, short-term stability confidence will improve further.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-04-01

## 1. Today's Overview

Delta Lake showed **high PR activity and low issue volume** over the last 24 hours: **50 PRs updated** versus just **4 issues updated**, with **10 PRs merged/closed** and **no new releases**. The activity pattern suggests the project is currently in a **heavy implementation and integration phase**, especially around **Flink support, Delta Kernel, Unity Catalog integration, CI hardening, and dependency security work**. There is also visible effort going into **DSv2 / Kernel-based table creation paths** and **query/runtime efficiency improvements**. Overall, project health looks **active and engineering-driven**, though a few older correctness and compatibility issues remain open.

---

## 2. Project Progress

### Merged/closed PRs today

Even without a release cut, the merged/closed PRs indicate concrete progress in several strategic areas.

#### Flink integration and documentation
- [#6431 [Flink] Readme & Docker Compose](https://github.com/delta-io/delta/pull/6431) — **Closed**
- [#6192 [Flink] Sink SQL API support](https://github.com/delta-io/delta/pull/6192) — **Closed**

These updates reinforce that **Flink is becoming a first-class connector track**. Even where PRs were closed rather than merged, they signal active iteration on **developer onboarding, local testing environments, and SQL-facing sink support**. Together with the open Flink epic and new Flink PRs, this is one of the clearest roadmap directions in the repository right now.

#### Security / supply-chain hardening iteration
- [#6440 Harden 3p dependencies throughout project](https://github.com/delta-io/delta/pull/6440) — **Closed**

This appears to have been superseded by a fresh set of branch-specific PRs ([#6457](https://github.com/delta-io/delta/pull/6457), [#6458](https://github.com/delta-io/delta/pull/6458), [#6459](https://github.com/delta-io/delta/pull/6459), [#6460](https://github.com/delta-io/delta/pull/6460)). The closure is still meaningful: the project is actively **rolling out dependency hardening across branches**, which improves **build reproducibility, CI safety, and supply-chain resilience**.

### What capabilities were advanced today

From the active and recently closed PR set, Delta Lake development today is advancing:

- **Flink sink architecture via Delta Kernel**
  - [#5901 [Flink] Create Delta Kernel based Flink Sink](https://github.com/delta-io/delta/issues/5901)
  - [#6456 [Flink] Enable Release setting in build.sbt and add int test](https://github.com/delta-io/delta/pull/6456)

- **Kernel + DSv2 table creation path**
  - [#6448 [Kernel] Finalize UC table creation inside Kernel commit path](https://github.com/delta-io/delta/pull/6448)
  - [#6449 Add CreateTableBuilder + V2Mode routing + integration tests](https://github.com/delta-io/delta/pull/6449)
  - [#6450 Wire DeltaCatalog.createTable() to DSv2 + Kernel path](https://github.com/delta-io/delta/pull/6450)

- **Unity Catalog integration and test coverage**
  - [#6263 [CI Improvements] Add non-blocking CI job to test against UC main](https://github.com/delta-io/delta/pull/6263)
  - [#6446 Gate UC tests behind UC Spark version checks](https://github.com/delta-io/delta/pull/6446)
  - [#6156 [UC Commit Metrics] Add full payload construction and schema tests](https://github.com/delta-io/delta/pull/6156)
  - [#6333 [UC Commit Metrics] Add feature flag and async dispatch](https://github.com/delta-io/delta/pull/6333)

- **Query/runtime efficiency and compatibility**
  - [#6270 Skip redundant IcebergCompatV3 validation when WriterCompatV3 already ran it](https://github.com/delta-io/delta/pull/6270)
  - [#6332 [kernel-spark] Implement SupportsPushDownLimit in Delta V2 connector](https://github.com/delta-io/delta/pull/6332)
  - [#6406 feat: Support getting `tableSizeBytes`, `numFiles` by incremental crc construction](https://github.com/delta-io/delta/pull/6406)
  - [#6356 [SPARK] Add config to block Spark 4.0 clients from writing to Variant tables](https://github.com/delta-io/delta/pull/6356)

Net takeaway: Delta Lake is currently improving **connector breadth**, **catalog integration**, **metadata efficiency**, and **engine compatibility guardrails**.

---

## 3. Community Hot Topics

### 1) Flink sink development via Delta Kernel
- [#5901 [Flink] Create Delta Kernel based Flink Sink](https://github.com/delta-io/delta/issues/5901)

This is the strongest roadmap signal in the issue tracker today. The issue is framed as an **epic**, tracking milestone-based implementation of a **Delta Kernel-based Flink Sink**. The technical need underneath is clear: users want a **modern, maintainable Flink write path** that aligns with Delta Kernel rather than connector-specific logic. This likely reduces duplicated semantics across engines and improves long-term compatibility.

Related PRs:
- [#6456 [Flink] Enable Release setting in build.sbt and add int test](https://github.com/delta-io/delta/pull/6456)
- [#6431 [Flink] Readme & Docker Compose](https://github.com/delta-io/delta/pull/6431)
- [#6192 [Flink] Sink SQL API support](https://github.com/delta-io/delta/pull/6192)

### 2) Delta Kernel + DSv2 + Unity Catalog table creation
- [#6448 [Kernel] Finalize UC table creation inside Kernel commit path](https://github.com/delta-io/delta/pull/6448)
- [#6449 Add CreateTableBuilder + V2Mode routing + integration tests](https://github.com/delta-io/delta/pull/6449)
- [#6450 Wire DeltaCatalog.createTable() to DSv2 + Kernel path](https://github.com/delta-io/delta/pull/6450)
- [#6378 [DO-NOT-MERGE] Add UCClient finalizeCreate API for staging table promotion](https://github.com/delta-io/delta/pull/6378)

This stack indicates a broader architectural move: **table DDL operations are being routed through newer DSv2 and Kernel-based plumbing**, especially for **Unity Catalog-managed workflows**. The underlying need is likely to unify behavior across Spark, Kernel, and UC-backed environments while improving correctness of managed table creation/promotion semantics.

### 3) CI and compatibility management around Unity Catalog
- [#6263 [CI Improvements] Add non-blocking CI job to test against UC main](https://github.com/delta-io/delta/pull/6263)
- [#6446 Gate UC tests behind UC Spark version checks](https://github.com/delta-io/delta/pull/6446)

These PRs suggest maintainers are feeling pressure from **fast-moving external dependencies**, especially Unity Catalog and Spark version skew. The technical need is better **forward-compatibility detection** and less brittle CI.

### 4) Security hardening across branches
- [#6457 Harden 3p dependencies throughout project](https://github.com/delta-io/delta/pull/6457)
- [#6458 Harden 3p dependencies throughout project](https://github.com/delta-io/delta/pull/6458)
- [#6459 Harden 3p dependencies throughout project](https://github.com/delta-io/delta/pull/6459)
- [#6460 Harden 3p dependencies throughout project](https://github.com/delta-io/delta/pull/6460)

Although these are low-discussion PRs, the volume itself makes this a hot topic operationally. It reflects industry-wide concern with **dependency provenance, lockfiles, Docker hardening, and workflow safety**.

### 5) Long-lived correctness issue in partition updates
- [#3054 [BUG] [SPARK] Unintended Rewrite of Other Partitions During Partition-Level Delta Table Update](https://github.com/delta-io/delta/issues/3054)

This is the most consequential user-facing issue among those updated. Even with only modest reactions/comments, it points to a **query correctness / write isolation concern** that matters a lot for production users.

---

## 4. Bugs & Stability

Ranked by likely severity and user impact.

### High severity
#### 1) Partition-level update may rewrite unintended partitions
- [#3054 [BUG] [SPARK] Unintended Rewrite of Other Partitions During Partition-Level Delta Table Update](https://github.com/delta-io/delta/issues/3054)

**Why it matters:** This can affect **write correctness, cost, and operational safety**. If an update intended for a single partition rewrites other partitions, users face risk of:
- unnecessary file churn,
- larger commits,
- performance regressions,
- unexpected downstream behavior in pipelines.

**Fix status:** No directly linked fix PR appeared in today’s data.

### Medium severity
#### 2) Flaky test
- [#6451 [BUG] Flaky test](https://github.com/delta-io/delta/issues/6451)

**Why it matters:** While likely not a product correctness bug, flaky tests reduce **CI signal quality** and slow merge velocity. In a repo with many stacked PRs and broad integration work, CI reliability is critical.

**Fix status:** No direct fix PR is visible today, though general CI hardening work is active:
- [#6263](https://github.com/delta-io/delta/pull/6263)
- [#6446](https://github.com/delta-io/delta/pull/6446)

### Preventive stability work in PRs
Several open PRs are not bug reports per se but are clearly aimed at reducing instability or inefficiency:
- [#6270 Skip redundant IcebergCompatV3 validation when WriterCompatV3 already ran it](https://github.com/delta-io/delta/pull/6270) — avoids duplicate validation overhead.
- [#6446 Gate UC tests behind UC Spark version checks](https://github.com/delta-io/delta/pull/6446) — reduces false CI failures from version mismatch.
- [#6356 [SPARK] Add config to block Spark 4.0 clients from writing to Variant tables](https://github.com/delta-io/delta/pull/6356) — adds compatibility protection before unsafe writes occur.

---

## 5. Feature Requests & Roadmap Signals

### Strongest roadmap signals

#### Flink as a major expansion area
- [#5901 [Flink] Create Delta Kernel based Flink Sink](https://github.com/delta-io/delta/issues/5901)
- [#6456 [Flink] Enable Release setting in build.sbt and add int test](https://github.com/delta-io/delta/pull/6456)

This is the clearest likely candidate for the **next meaningful user-visible milestone**. Expect upcoming releases to mention:
- Flink sink preview/GA progress,
- packaging/release readiness,
- integration tests,
- SQL API maturation.

#### Kernel API correctness and schema validation
- [#2149 [Kernel] Validate readSchema is a subset of the table schema in ScanBuilder](https://github.com/delta-io/delta/issues/2149)

This enhancement is subtle but important. It points to demand for **stricter read-path validation in Delta Kernel**, likely helping connector developers catch schema misuse early and avoid runtime inconsistencies. Because it is tagged **good first issue**, it may not land immediately, but it reflects a real need for stronger API contracts.

#### Better pushdown and metadata efficiency
- [#6332 [kernel-spark] Implement SupportsPushDownLimit in Delta V2 connector](https://github.com/delta-io/delta/pull/6332)
- [#6406 feat: Support getting `tableSizeBytes`, `numFiles` by incremental crc construction](https://github.com/delta-io/delta/pull/6406)

These indicate likely future emphasis on:
- **query pushdowns** in Kernel-based Spark paths,
- **faster metadata/statistics derivation**,
- better support for operational metrics without expensive full scans.

#### Compatibility guardrails for newer Spark behavior
- [#6356 [SPARK] Add config to block Spark 4.0 clients from writing to Variant tables](https://github.com/delta-io/delta/pull/6356)

This suggests Delta maintainers are proactively managing the **Spark 4.x transition**, especially where newer client behavior could create unsafe writes or semantic mismatches.

### Likely next-version inclusions
Based on current momentum, the most plausible near-term inclusions are:
1. **More Flink sink infrastructure**
2. **Kernel/DSv2 table creation improvements**
3. **Unity Catalog integration and CI compatibility enhancements**
4. **Security/dependency hardening**
5. **Selective query optimization features** like limit pushdown and duplicate-validation removal

---

## 6. User Feedback Summary

From the issues and PRs updated today, user/operator feedback clusters around a few recurring pain points:

### 1) Correctness and predictability of writes
- [#3054](https://github.com/delta-io/delta/issues/3054)

Users care deeply about whether a targeted update touches only intended data. This reflects a production use case with **partitioned tables and cost-sensitive writes**, where accidental broad rewrites are unacceptable.

### 2) Stable multi-engine support
- [#5901](https://github.com/delta-io/delta/issues/5901)
- [#6192](https://github.com/delta-io/delta/pull/6192)
- [#6431](https://github.com/delta-io/delta/pull/6431)

There is strong evidence that users want Delta to work cleanly beyond Spark—especially with **Flink pipelines** and SQL interfaces. The presence of docs, Docker Compose, release settings, and sink SQL API work implies active demand from users trying to **develop, test, and deploy connector workflows end-to-end**.

### 3) Better interoperability with catalogs and fast-evolving dependencies
- [#6263](https://github.com/delta-io/delta/pull/6263)
- [#6446](https://github.com/delta-io/delta/pull/6446)
- [#6448](https://github.com/delta-io/delta/pull/6448)
- [#6450](https://github.com/delta-io/delta/pull/6450)

Enterprise users appear to need more reliable operation with **Unity Catalog**, newer Spark APIs, and DSv2 routing. This is less about feature novelty and more about **integration trustworthiness**.

### 4) CI reliability and contributor velocity
- [#6451](https://github.com/delta-io/delta/issues/6451)

Even a simple flaky-test report matters in a project with stacked PR chains. Contributors likely feel pain when CI becomes noisy, especially while major architecture changes are underway.

Overall, user sentiment inferred from the data is not about “missing basic functionality”; it is about **production correctness, cross-engine maturity, and integration stability**.

---

## 7. Backlog Watch

These items appear to deserve maintainer attention due to age, architectural relevance, or production impact.

### Long-open correctness issue
#### [#3054 [BUG] [SPARK] Unintended Rewrite of Other Partitions During Partition-Level Delta Table Update](https://github.com/delta-io/delta/issues/3054)
- Open since **2024-05-06**
- Still active as of **2026-03-31**

This is the most important backlog risk in today’s issue list. It concerns **data rewrite scope and correctness**, not just ergonomics. If reproducible, it deserves prioritization or at least a clearer triage/update.

### Long-open Kernel validation enhancement
#### [#2149 [Kernel] Validate readSchema is a subset of the table schema in ScanBuilder](https://github.com/delta-io/delta/issues/2149)
- Open since **2023-10-06**
- Updated **2026-03-31**

While lower severity than #3054, it affects **API safety and connector correctness** in Delta Kernel. Because Kernel is becoming more central to the roadmap, leaving schema validation gaps unresolved could create downstream bugs across integrations.

### Open stacked PR chain that may need consolidation
#### [#6378 [DO-NOT-MERGE] Add UCClient finalizeCreate API for staging table promotion](https://github.com/delta-io/delta/pull/6378)
This PR is explicitly marked **DO-NOT-MERGE** but is part of a broader DDL/UC stack. Maintainers may want to ensure the stack is progressing cleanly and that temporary scaffolding PRs do not linger indefinitely.

### Compatibility and optimization PRs worth watching
- [#6332 [kernel-spark] Implement SupportsPushDownLimit in Delta V2 connector](https://github.com/delta-io/delta/pull/6332)
- [#6270 Skip redundant IcebergCompatV3 validation when WriterCompatV3 already ran it](https://github.com/delta-io/delta/pull/6270)
- [#6356 [SPARK] Add config to block Spark 4.0 clients from writing to Variant tables](https://github.com/delta-io/delta/pull/6356)

These are strategically important because they touch **query pushdown**, **storage/validation efficiency**, and **forward compatibility**. Delays here could slow adoption of newer execution paths.

---

## Final Assessment

Delta Lake had a **strong engineering day** with substantial implementation churn and no release activity. The dominant themes are **Flink expansion, Kernel/DSv2 maturation, Unity Catalog integration, and dependency hardening**. The project appears healthy and actively maintained, but there is still a notable need to close the loop on **long-lived correctness issues**—especially the partition rewrite bug—and to keep CI stability high while multiple architectural tracks move in parallel.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-04-01

## 1. Today's Overview

Databend showed moderate-to-high development activity over the last 24 hours: 11 issues were updated and all were closed, while 17 pull requests saw movement, with 5 merged/closed and 12 still open. The issue stream was dominated by automated link-checker noise, but there was also one real SQL compatibility bug report around hex literal parsing that was quickly addressed. Overall project health looks solid: maintainers are closing CI/docs hygiene issues quickly, and query-layer work remains active across tracing, join execution, table branching, bloom indexes, HTTP result formatting, and geospatial functions. A new patch release was also published, suggesting active stabilization and release management.

## 2. Releases

### v1.2.888-patch-3
- Release: [v1.2.888-patch-3](https://github.com/databendlabs/databend/compare/v1.2.891-nightly...v1.2.888-patch-3)

The published release is a patch build rather than a feature headline release. The supplied notes do not enumerate individual changes, so the safest interpretation is that this version is focused on stabilization and backporting selected fixes from the nightly line.

**Likely release character**
- Patch/stability-oriented
- Intended for users tracking the stable patch series rather than nightly builds
- No explicit breaking changes were documented in the provided release metadata

**Breaking changes**
- None explicitly announced in the release notes provided

**Migration notes**
- No migration steps were documented
- Users affected by SQL literal correctness, docs CI noise, or datetime timezone handling should review whether corresponding fixes were included in this patch line before upgrading production deployments

## 3. Project Progress

### Merged/closed PRs today

#### 1) SQL compatibility fix for hex literals
- [PR #19636](https://github.com/databendlabs/databend/pull/19636) — `fix(ast): parse X'...' as binary literal`
- Related earlier closed PR: [PR #19635](https://github.com/databendlabs/databend/pull/19635) — `fix: treat X'...' as binary literal`

This is the most meaningful engine-level correctness change in today’s closed work. Databend aligned `X'...'` parsing with SQL-standard binary literal semantics instead of routing it through a PostgreSQL-style integer interpretation path. This materially improves SQL compatibility and reduces surprising behavior for users porting standard SQL workloads.

#### 2) CI/docs hygiene for broken link reporting
- [PR #19649](https://github.com/databendlabs/databend/pull/19649) — `fix(ci): fix broken links checker`
- [PR #19645](https://github.com/databendlabs/databend/pull/19645) — `fix(docs): correct broken tests/ut link in SQL README`

These changes directly addressed the flood of automated “Link Checker Report” issues. While not core engine work, this is important operationally: reducing false-positive CI failures and documentation drift improves contributor productivity and keeps issue trackers cleaner.

#### 3) Timezone correctness for naive datetime parsing
- [PR #19647](https://github.com/databendlabs/databend/pull/19647) — `fix(query): use jiff to_zoned for naive datetime timezone resolution`

This closed fix improves temporal correctness by replacing a “fake UTC” offset resolution path. For analytical systems, timezone normalization bugs can silently corrupt query results, so this is a meaningful stability improvement for timestamp-heavy workloads.

### Overall progress signal
Today’s closed work leaned toward **correctness and maintenance**, especially:
- SQL parser standards compliance
- datetime correctness
- CI/doc reliability

Meanwhile, open PRs indicate continued forward motion on:
- query execution internals ([partitioned hash join](https://github.com/databendlabs/databend/pull/19553))
- storage/indexing ([binary fuse32 bloom index](https://github.com/databendlabs/databend/pull/19621))
- table versioning semantics ([experimental table branch](https://github.com/databendlabs/databend/pull/19551))
- observability ([trace_debug OTLP dump utilities](https://github.com/databendlabs/databend/pull/19642))

## 4. Community Hot Topics

There was not much visible end-user discussion volume today; most items had 0–1 comments and 0 reactions. Still, a few technically important threads stand out.

### 1) SQL-standard hex literal correctness
- Issue: [#19600](https://github.com/databendlabs/databend/issues/19600) — `bug: Incorrect implementation of Hex Literal X'...'`
- Fix PR: [#19636](https://github.com/databendlabs/databend/pull/19636)
- Regression coverage PR: [#19651](https://github.com/databendlabs/databend/pull/19651)

**Why it matters:**  
This reflects a classic compatibility need for OLAP engines: users expect standard SQL literal syntax to behave consistently across systems. Misinterpreting `X'...'` as an integer rather than binary can affect parsing, expression typing, function dispatch, and portability of ETL or BI queries.

### 2) Query tracing and OTLP debugging
- PR: [#19642](https://github.com/databendlabs/databend/pull/19642) — `feat(query): add trace_debug OTLP dump utilities`

**Underlying need:**  
As Databend’s execution stack grows more complex, operators need richer trace-level introspection. OTLP dump utilities suggest rising demand for production-grade observability, particularly for debugging direct SQL and HTTP query paths.

### 3) Table branching for FUSE tables
- PR: [#19551](https://github.com/databendlabs/databend/pull/19551) — `feat(query): support experimental table branch`

**Underlying need:**  
This points to growing interest in data-versioning, isolated experimentation, and branch-based table workflows—valuable for reproducible analytics, testing, and controlled backfills.

### 4) Execution engine evolution: partitioned hash join
- PR: [#19553](https://github.com/databendlabs/databend/pull/19553) — `refactor(query): support partitioned hash join`

**Underlying need:**  
Users likely need better scalability and memory behavior on large joins. Partitioned hash join support is a strong signal of continued investment in heavier analytical workloads.

## 5. Bugs & Stability

### Severity-ranked issues and fixes

#### High: SQL correctness / standards mismatch
- Issue: [#19600](https://github.com/databendlabs/databend/issues/19600) — incorrect `X'...'` implementation
- Fixed by: [#19636](https://github.com/databendlabs/databend/pull/19636)
- Follow-up tests: [#19651](https://github.com/databendlabs/databend/pull/19651)

**Impact:**  
Could yield wrong typing/interpretation of literals and break SQL portability. For users migrating standard SQL or binary-expression logic, this is a correctness issue rather than mere syntax polish.

#### Medium: Datetime timezone resolution correctness
- Fix: [#19647](https://github.com/databendlabs/databend/pull/19647)

**Impact:**  
Naive datetime values resolved with incorrect timezone-offset logic can produce wrong timestamps in query results. This is particularly important in event analytics, ingestion normalization, and time-based partition logic.

#### Medium: Potential planner/statistics panic on UInt64 range
- Open fix PR: [#19631](https://github.com/databendlabs/databend/pull/19631) — `avoid panic on UInt64 full-range scan stats`
- Related issue reference in PR: `#19555`

**Impact:**  
This looks like a real stability issue in statistics derivation that could panic on full-range unsigned column stats. Until merged, this remains a notable open risk for workloads with `UInt64` min/max boundaries.

#### Low: CI/docs breakage due to broken links
- Issues: [#19648](https://github.com/databendlabs/databend/issues/19648), [#19643](https://github.com/databendlabs/databend/issues/19643), [#19634](https://github.com/databendlabs/databend/issues/19634), [#19630](https://github.com/databendlabs/databend/issues/19630), [#19629](https://github.com/databendlabs/databend/issues/19629), [#19535](https://github.com/databendlabs/databend/issues/19535), [#19524](https://github.com/databendlabs/databend/issues/19524), [#18598](https://github.com/databendlabs/databend/issues/18598), [#19449](https://github.com/databendlabs/databend/issues/19449), [#19650](https://github.com/databendlabs/databend/issues/19650)
- Fixes: [#19649](https://github.com/databendlabs/databend/pull/19649), [#19645](https://github.com/databendlabs/databend/pull/19645)

**Impact:**  
Not an engine stability problem, but it created tracker churn. The quick fix response indicates good maintenance discipline.

## 6. Feature Requests & Roadmap Signals

Several open PRs provide strong forward-looking signals about where Databend may be heading next.

### Likely near-term features

#### Table branches for FUSE tables
- [PR #19551](https://github.com/databendlabs/databend/pull/19551)

This is one of the clearest roadmap signals. Branch-qualified reads/writes, lifecycle metadata, and branch-aware GC suggest Databend is exploring Git-like data workflows or isolated table state management. If merged, this could become a differentiating feature for analytics engineering and data experimentation.

#### Binary fuse32 bloom index option
- [PR #19621](https://github.com/databendlabs/databend/pull/19621)

A new `bloom_index_type` option with `xor8` and `binary_fuse32` indicates active storage/index optimization work. This is a strong candidate for an upcoming version because it extends physical design choices in a user-visible but contained way.

#### Geospatial scalar and aggregate functions
- [PR #19620](https://github.com/databendlabs/databend/pull/19620)

Support for `geometry`/`geography` functions and overlay operations signals expansion into richer analytical domains. This may appeal to location intelligence, logistics, and map-centric use cases.

#### Query tracing/debug tooling
- [PR #19642](https://github.com/databendlabs/databend/pull/19642)

The observability story is becoming more mature. This may land soon because it is operationally valuable and relatively self-contained.

#### HTTP JSON result mode improvements
- [PR #19639](https://github.com/databendlabs/databend/pull/19639)

This suggests API consumers want more precise or configurable JSON output behavior, likely for integration reliability and type-safe downstream parsing.

### Prediction for next version
Most likely candidates to appear in the next shipped version or near-future nightly builds:
1. hex-literal regression coverage ([#19651](https://github.com/databendlabs/databend/pull/19651))
2. UInt64 scan-stats panic fix ([#19631](https://github.com/databendlabs/databend/pull/19631))
3. tracing/debug OTLP utilities ([#19642](https://github.com/databendlabs/databend/pull/19642))
4. HTTP JSON result mode ([#19639](https://github.com/databendlabs/databend/pull/19639))

Larger features such as partitioned hash join and table branching may require longer review/stabilization time.

## 7. User Feedback Summary

Based on today’s visible activity, user pain points cluster around **correctness, compatibility, and operability** rather than raw performance complaints.

### Main pain points
- **SQL compatibility gaps:**  
  The `X'...'` report ([#19600](https://github.com/databendlabs/databend/issues/19600)) shows users care about standards-conformant syntax behavior, especially when moving queries between engines.
- **Temporal correctness:**  
  The naive-datetime timezone fix ([#19647](https://github.com/databendlabs/databend/pull/19647)) suggests practical concern from workloads where timestamp semantics matter.
- **Observability/debugging needs:**  
  The OTLP trace dump PR ([#19642](https://github.com/databendlabs/databend/pull/19642)) implies users or maintainers need deeper introspection into query execution paths.
- **API/result-format expectations:**  
  The HTTP JSON mode work ([#19639](https://github.com/databendlabs/databend/pull/19639)) reflects downstream consumer needs for cleaner, more predictable serialization.

### Satisfaction signals
- Fast closure of the hex-literal bug through a fix plus regression tests is a good sign of maintainers responding promptly to correctness reports.
- Rapid cleanup of link-checker noise shows the team is attentive to contributor experience and CI hygiene.

## 8. Backlog Watch

These open or recurring items deserve maintainer attention because they hint at meaningful technical debt, larger features, or latent stability risks.

### 1) Partitioned hash join
- [PR #19553](https://github.com/databendlabs/databend/pull/19553)

A significant execution-engine change with clear performance implications. It is strategically important for large joins, but still open and missing benchmark confirmation in the checklist. This likely needs careful review and performance validation.

### 2) Experimental table branch
- [PR #19551](https://github.com/databendlabs/databend/pull/19551)

This is a substantial roadmap item touching metadata, reads/writes, and garbage collection. Its breadth suggests it may need architectural scrutiny before merge.

### 3) UInt64 full-range scan stats panic fix
- [PR #19631](https://github.com/databendlabs/databend/pull/19631)

This should be prioritized if reproducible, because planner panics are high-value stability fixes for production systems.

### 4) Repeated automated link-checker issues
- Representative issues: [#19650](https://github.com/databendlabs/databend/issues/19650), [#19648](https://github.com/databendlabs/databend/issues/19648), [#19629](https://github.com/databendlabs/databend/issues/19629), [#18598](https://github.com/databendlabs/databend/issues/18598)

Although individually low severity, the recurrence suggests the automation pipeline may still need stronger deduplication or suppression rules to prevent issue tracker pollution.

---

## Bottom Line

Databend’s 2026-04-01 activity was healthy and skewed toward **correctness and platform polish**. The standout delivered improvement was SQL-standard handling of `X'...'` binary literals, supported by rapid fix iteration and follow-up testing. At the same time, the open PR queue signals substantial ongoing investment in **query execution, observability, storage indexing, API behavior, geospatial analytics, and branch-style table workflows**—all positive signs for the engine’s evolution.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-04-01

## 1. Today's Overview

Velox showed **high development activity** over the last 24 hours, with **50 PRs updated** and **4 issues updated**, indicating an active maintainer and contributor loop despite no new release cut today. The day’s work was concentrated on **build reliability, Parquet/schema evolution support, GPU/cuDF execution, memory debugging, and execution-engine data-path improvements**. Several merged fixes suggest the project is actively reducing CI/build friction while continuing to expand analytical engine capabilities such as **dynamic filter propagation, extraction pushdown, Arrow IPC serialization, and GPU operators**. Overall, project health looks **strong and execution-focused**, with a mix of infrastructure hardening and medium-term feature development.

## 2. Project Progress

### Merged/closed PRs today

#### 1) Parquet schema evolution/type widening advanced
- **PR #16611 — feat(parquet): Add type widening support for INT and Decimal types with configurable narrowing**  
  Link: https://github.com/facebookincubator/velox/pull/16611  
  This is the most meaningful merged engine-facing change in the daily set. It extends the Parquet reader to better handle **schema evolution**, including widening from integer to double/decimal and decimal-to-decimal transitions. For OLAP users, this improves compatibility with evolving lakehouse tables and aligns Velox more closely with **Spark 4.0 Parquet widening behavior**, reducing read failures or manual schema intervention in analytical pipelines.

#### 2) Build correctness fix for test/off configurations
- **PR #16992 — fix(build): Guard fuzzer examples subdirectory with VELOX_BUILD_TESTING**  
  Link: https://github.com/facebookincubator/velox/pull/16992  
  This merged fix resolves build failures when testing is disabled, specifically impacting environments like GPU-related CI. While not a query-engine feature, it materially improves portability and downstream integration reliability.

#### 3) cuDF usability/observability improved
- **PR #16900 — feat(cudf): Add the log to show detailed fallback message**  
  Link: https://github.com/facebookincubator/velox/pull/16900  
  This improves diagnosability when expressions cannot be offloaded to GPU. For teams experimenting with Velox’s cuDF path, better fallback logging reduces ambiguity about why a plan stayed on CPU, which is important for performance tuning and production rollout confidence.

#### 4) Documentation/communication around adaptive CPU tracking
- **PR #16945 — docs: Add blog post for Adaptive per-function CPU tracking**  
  Link: https://github.com/facebookincubator/velox/pull/16945  
  Though documentation-only, it signals maturity in **operator/function-level performance introspection**, which is highly relevant for query optimization and workload observability.

#### 5) CI/build tooling quality improved
- **PR #16971 — build: Improve build impact comment layout**  
  Link: https://github.com/facebookincubator/velox/pull/16971  
  This helps contributors understand changed and affected targets more clearly, improving development velocity and review ergonomics.

## 3. Community Hot Topics

### Most notable active items

#### A) Long-running Parquet/thrift dependency removal discussion
- **Issue #13175 — Add support for FBThrift in Parquet and remove thrift dependency**  
  Link: https://github.com/facebookincubator/velox/issues/13175  
  This remains one of the clearest architectural topics in the issue list. The underlying need is to **untangle native Parquet reading from legacy thrift dependencies**, likely to simplify builds, reduce dependency surface, and better align with remote-function and broader internal infrastructure needs. For analytical engines, dependency minimization is especially valuable in embedded and cloud-native deployments.

#### B) New flaky spill/corruption report in aggregation path
- **Issue #16983 — [flaky-test] Flaky ModeAggregateTest.groupByString: corrupted serialized page during spill**  
  Link: https://github.com/facebookincubator/velox/issues/16983  
  This is a technically important topic because it points to possible fragility in the **spill + serialization/deserialization path**, with checksum mismatch during page restore. Even if currently observed as test flakiness, the underlying risk touches **correctness and resilience under memory pressure**, which is critical for OLAP execution engines.

#### C) Immediate build break surfaced and rapidly fixed
- **Issue #16995 — fix(build): velox_hive_connector_test missing GTest::gmock link dependency**  
  Link: https://github.com/facebookincubator/velox/issues/16995  
- **PR #16996 — fix(build): Add missing GTest::gmock link to velox_hive_connector_test**  
  Link: https://github.com/facebookincubator/velox/pull/16996  
  This issue-to-fix turnaround shows good responsiveness. The technical need is straightforward: keep connector test targets correctly linked so that incremental changes don’t produce avoidable build failures.

#### D) Memory/OOM diagnostics becoming a focus
- **PR #16997 — refactor: Improve the OOM debuging logs**  
  Link: https://github.com/facebookincubator/velox/pull/16997  
  This suggests maintainers are investing in **production debuggability** for memory reclaim paths. That is a strong signal of real-world deployment pressure where understanding memory pool state and reclamation behavior matters.

#### E) Pushdown and data-movement optimization continue
- **PR #16991 — feat: Support dynamic filter pushdown through LocalPartition / LocalExchange**  
  Link: https://github.com/facebookincubator/velox/pull/16991  
- **PR #16968 — feat: Add extraction ScanSpec pushdown and HiveDataSource integration**  
  Link: https://github.com/facebookincubator/velox/pull/16968  
  These are strong roadmap indicators around **reducing scanned data and preserving filtering information deeper into execution**, both highly relevant to OLAP efficiency.

## 4. Bugs & Stability

Ranked by likely severity and user impact:

### 1) Potential spill-path correctness risk
- **Issue #16983 — corrupted serialized page during spill**  
  Link: https://github.com/facebookincubator/velox/issues/16983  
  **Severity: High**  
  A checksum mismatch in spill deserialization is the most serious item today because it may indicate either data corruption, serialization instability, or non-deterministic spill behavior. Even if currently categorized as a flaky test, any bug in the spill path can affect correctness for memory-intensive queries such as large aggregations and joins.  
  **Fix PR exists?** None referenced yet.

### 2) Build failure in Hive connector tests
- **Issue #16995 — missing GTest::gmock link dependency**  
  Link: https://github.com/facebookincubator/velox/issues/16995  
- **PR #16996 — fix(build): Add missing GTest::gmock link to velox_hive_connector_test**  
  Link: https://github.com/facebookincubator/velox/pull/16996  
  **Severity: Medium**  
  This is a straightforward build regression affecting developer workflows and CI signal quality, but not runtime query execution.  
  **Fix PR exists?** Yes, and it appears ready to merge.

### 3) Incomplete division-by-zero handling in cuDF expression evaluation
- **Issue #16988 — enh(cudf): Add more explicit division-by-zero checks in BinaryFunction**  
  Link: https://github.com/facebookincubator/velox/issues/16988  
  **Severity: Medium**  
  This is framed as an enhancement, but it has correctness implications. Inconsistent division-by-zero checks across types can lead to divergent behavior between CPU and GPU execution paths, which is especially sensitive in mixed execution engines.  
  **Fix PR exists?** None listed today.

### 4) Ongoing timestamp partition crash/workaround area
- **PR #16805 — fix identity timestamp gap**  
  Link: https://github.com/facebookincubator/velox/pull/16805  
  **Severity: Medium to High**  
  This open PR addresses a crash involving TIMESTAMP-partitioned tables in Prestissimo/Hive-style access paths. It remains open, so users dealing with timestamp partition encoding should monitor it closely.

## 5. Feature Requests & Roadmap Signals

### Strong signals from active PRs/issues

#### Remote execution and serialization evolution
- **PR #16981 — feat(serializer): Add Arrow IPC format for RemoteFunctionPage**  
  Link: https://github.com/facebookincubator/velox/pull/16981  
  This is a significant roadmap signal. Adding **Arrow IPC** as a page format points toward broader **interoperability and remote function execution** support, making Velox easier to integrate with heterogeneous compute/services.

#### More aggressive pushdown in scan/exchange paths
- **PR #16991 — dynamic filter pushdown through LocalPartition / LocalExchange**  
  Link: https://github.com/facebookincubator/velox/pull/16991  
- **PR #16968 — extraction ScanSpec pushdown and HiveDataSource integration**  
  Link: https://github.com/facebookincubator/velox/pull/16968  
  These indicate sustained investment in **data skipping and reduced CPU/IO overhead**. These are good candidates for inclusion in a next release because they are central to query efficiency.

#### GPU acceleration surface area expanding
- **PR #16974 — feat(cudf): Add CudfMarkDistinct GPU operator**  
  Link: https://github.com/facebookincubator/velox/pull/16974  
- **PR #16423 — feat(cudf): Add cuDF join fuzzer with CI integration**  
  Link: https://github.com/facebookincubator/velox/pull/16423  
- **PR #16620 — fix(cudf): Refactor CudfToVelox output batching to avoid O(n) D->H syncs**  
  Link: https://github.com/facebookincubator/velox/pull/16620  
  Velox’s GPU track remains active, with work spanning **operator coverage, correctness fuzzing, and transfer overhead optimization**. Expect future versions to improve both GPU execution breadth and production readiness.

#### SQL/function compatibility additions
- **PR #15511 — feat: Add s2 Presto functions**  
  Link: https://github.com/facebookincubator/velox/pull/15511  
  This is a clear user-facing SQL surface expansion. Although older and still open, it signals demand for **geospatial-style utility functions** in Presto-compatible environments.

#### Performance-focused vectorized execution
- **PR #16994 — perf: Use SIMD for TIME based comparison operators**  
  Link: https://github.com/facebookincubator/velox/pull/16994  
  Expect continued micro-optimizations in vectorized expression execution, especially for primitive/time-like types.

### Likely candidates for next version
Most likely to land soon based on recency and practical value:
1. **GTest link/build fixes** — PR #16996  
2. **OOM log improvements** — PR #16997  
3. **Dynamic filter pushdown through LocalExchange/LocalPartition** — PR #16991  
4. **Extraction pushdown + Hive integration** — PR #16968  
5. **Arrow IPC remote function page serialization** — PR #16981

## 6. User Feedback Summary

From the issues and PRs updated today, user pain points are concentrated in four areas:

- **Build friction and integration stability**  
  The quick report/fix cycle around missing `GTest::gmock` shows users and contributors still encounter configuration-sensitive build problems. This matters for downstream adopters embedding Velox or running custom CI matrices.

- **Correctness under memory pressure / spill**  
  The flaky spill corruption report implies users care deeply about reliability in large-state operators where spilling is unavoidable.

- **GPU path transparency and consistency**  
  Merged fallback logging and open division-by-zero handling work suggest users want the cuDF backend to be both **predictable** and **easy to debug**, not just fast.

- **Schema evolution and compatibility with surrounding ecosystems**  
  The merged Parquet widening support addresses a concrete need from modern lakehouse workflows where schema evolution is common and compatibility with Spark behavior is expected.

Overall, the feedback trend is less about headline features and more about **making advanced engine capabilities operationally trustworthy**.

## 7. Backlog Watch

### Older/high-value items needing maintainer attention

#### 1) Thrift dependency removal in Parquet
- **Issue #13175 — Add support for FBThrift in Parquet and remove thrift dependency**  
  Link: https://github.com/facebookincubator/velox/issues/13175  
  Open since 2025-04-28 and still active. This looks strategically important because it affects dependency hygiene and likely future remote execution architecture.

#### 2) S2 Presto functions
- **PR #15511 — feat: Add s2 Presto functions**  
  Link: https://github.com/facebookincubator/velox/pull/15511  
  Open since 2025-11-15. This is a long-running user-facing SQL enhancement and may need review bandwidth to avoid stagnation.

#### 3) cuDF transfer-path optimization
- **PR #16620 — fix(cudf): Refactor CudfToVelox output batching to avoid O(n) D->H syncs**  
  Link: https://github.com/facebookincubator/velox/pull/16620  
  This has meaningful performance implications for GPU workloads and deserves attention if Velox wants stronger GPU production posture.

#### 4) cuDF buffered input device enqueue correctness
- **PR #16732 — fix(cudf): Use `enqueueForDevice` for cudf buffered input data source**  
  Link: https://github.com/facebookincubator/velox/pull/16732  
  Important for GPU IO path correctness/performance, especially with hybrid scan readers.

#### 5) Timestamp partition crash fix still open
- **PR #16805 — fix identity timestamp gap**  
  Link: https://github.com/facebookincubator/velox/pull/16805  
  Because it addresses a worker crash on TIMESTAMP-partitioned tables, this open item should remain visible to maintainers.

---

## Bottom Line

Velox had a **healthy, engineering-heavy day**: meaningful progress landed in **Parquet schema evolution**, while active work continued on **pushdown, remote serialization, memory diagnostics, and GPU execution**. The most important immediate risk is the new **spill corruption/flaky test report**. The strongest roadmap signals point to **better interoperability (Arrow IPC), more effective pushdown, and steadily maturing GPU support**.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-04-01

## 1. Today's Overview

Apache Gluten showed moderate-to-high development activity over the last 24 hours, with **15 PRs updated**, **6 PRs closed/merged**, and **3 issues updated**. The work is concentrated around the **Velox backend**, especially **SQL compatibility**, **memory/accounting correctness**, **Spark 4.x test enablement**, and **infrastructure synchronization with upstream Velox**. No new release was published today, so the signal is primarily from ongoing integration and stabilization work rather than packaged delivery. Overall, project health looks active and engineering-driven, with current momentum focused on closing correctness gaps and enabling broader execution coverage rather than large user-facing release events.

---

## 3. Project Progress

### Merged/closed PRs today

#### 1. Memory/accounting correctness in Velox allocator
- [#11855](https://github.com/apache/incubator-gluten/pull/11855) — **[CLOSED] [VELOX] Fix `StdMemoryAllocator::allocateZeroFilled` byte accounting**
- This change fixes incorrect accounting in zero-filled allocations where `calloc(nmemb, size)` allocated `nmemb * size` bytes but bookkeeping only counted `size`.
- Why it matters:
  - Prevents under-reporting of native memory usage.
  - Improves observability and potentially protects against mis-triggered memory controls.
  - This is a low-level but important storage/engine correctness fix for native execution.

#### 2. AWS SDK teardown / S3 lifecycle handling
- [#11857](https://github.com/apache/incubator-gluten/pull/11857) — **[CLOSED] [GLUTEN-11796][VL] Teardown the AWS SDK**
- Linked issue: [#11796](https://github.com/apache/incubator-gluten/issues/11796)
- This addresses a shutdown/lifecycle bug in Velox S3 filesystem integration where `finalizeS3FileSystem` was not being called.
- Why it matters:
  - Reduces process-exit instability and static-object teardown hazards.
  - Important for production jobs using S3-backed tables or data lake storage.

#### 3. Buffered input / storage path improvement
- [#11452](https://github.com/apache/incubator-gluten/pull/11452) — **[CLOSED] [GLUTEN-9456][VL] Add custom direct buffered input**
- Although the summary is abbreviated, this appears to improve the input path used by the Velox backend.
- Likely impact:
  - Better I/O behavior or lower overhead in read paths.
  - Potentially relevant to large scans and storage efficiency.

#### 4. Timestamp/current time validation coverage
- [#11656](https://github.com/apache/incubator-gluten/pull/11656) — **[CLOSED] [GLUTEN-1433] Add validation tests for `CurrentTimestamp` and `now(foldable)`**
- This expands SQL compatibility validation around time expressions that Spark may precompute during planning.
- Why it matters:
  - Improves confidence in query correctness.
  - Helps reduce accidental Spark fallback caused by validator gaps.

#### 5. GPU code cleanup
- [#11824](https://github.com/apache/incubator-gluten/pull/11824) — **[CLOSED] [VL] Clean up GPU code: remove dead/redundant code**
- Minor cleanup, but healthy signal that maintainers are reducing technical debt in non-core paths too.

#### 6. Spark 4.0/4.1 plan tagging and test re-enablement
- [#11833](https://github.com/apache/incubator-gluten/pull/11833) — **[CLOSED] [GLUTEN-11550][VL] Enable `GlutenLogicalPlanTagInSparkPlanSuite` (150/150 tests)**
- This is one of the strongest progress signals today.
- Why it matters:
  - Restores previously disabled test coverage on Spark 4.0/4.1.
  - All **150/150 TPC-DS queries pass** in the referenced suite.
  - Indicates better integration between Gluten’s transformer/offload rules and Spark plan metadata propagation.

### Overall progress themes
Today’s closed work advanced Gluten in three concrete areas:
1. **Native engine correctness** — allocator accounting and lifecycle teardown.
2. **SQL/Spark compatibility** — especially timestamps and Spark 4.x plan semantics.
3. **Execution/storage plumbing** — direct buffered input and cleanup around supporting subsystems.

---

## 4. Community Hot Topics

### 1. Velox upstream divergence tracking
- [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585) — **[OPEN] [enhancement, tracker] [VL] useful Velox PRs not merged into upstream**
- Comments: **16**
- Reactions: **4 👍**
- This is the most active discussion item in the provided data.
- Technical significance:
  - Gluten depends heavily on Velox, and this tracker exists to monitor useful community-submitted Velox PRs that have not yet landed upstream.
  - The issue explicitly notes avoidance of carrying these changes in `gluten/velox` due to rebase burden.
- Underlying need:
  - Better dependency governance between Gluten and upstream Velox.
  - Reduced lag for features/fixes that Gluten needs but cannot sustainably fork forever.
- Interpretation:
  - This is a roadmap signal that a meaningful part of Gluten feature velocity is gated by upstream Velox merge cadence.

### 2. TIMESTAMP_NTZ support
- [PR #11626](https://github.com/apache/incubator-gluten/pull/11626) — **[OPEN] Add basic `TIMESTAMP_NTZ` type support**
- [PR #11720](https://github.com/apache/incubator-gluten/pull/11720) — **[OPEN] Add config to disable `TimestampNTZ` validation fallback**
- [PR #11656](https://github.com/apache/incubator-gluten/pull/11656) — **[CLOSED] validation tests for `CurrentTimestamp` and `now`**
- This is clearly an active compatibility cluster.
- Underlying need:
  - Modern Spark workloads increasingly rely on timestamp semantics matching Spark behavior exactly.
  - Current fallback behavior blocks development/testing and limits native offload coverage.
- Interpretation:
  - Timestamp semantics are a strategic compatibility frontier for Gluten’s Velox backend.

### 3. Kafka and data lake integration
- [PR #11801](https://github.com/apache/incubator-gluten/pull/11801) — **[OPEN] Adding kafka read support for Velox backend**
- [PR #11776](https://github.com/apache/incubator-gluten/pull/11776) — **[OPEN] Added iceberg write configs**
- [PR #11853](https://github.com/apache/incubator-gluten/pull/11853) — **[OPEN] Fix fallback info for V2 writes and align plan with Spark SQL tab**
- Underlying need:
  - Users want Gluten to cover more real production paths: streaming ingest, Iceberg writes, and better observability of hybrid native/Spark execution.
- Interpretation:
  - Data lake write paths and connector breadth are becoming a more visible adoption driver.

### 4. Parallel execution exploration
- [PR #11852](https://github.com/apache/incubator-gluten/pull/11852) — **[OPEN] Proof of concept enable Velox parallel execution**
- This is still explicitly draft/uncertain, but it is strategically important.
- Underlying need:
  - More efficient CPU utilization and potentially better throughput for native execution.
- Interpretation:
  - A future performance-focused milestone may emerge here, but it is not yet production-ready.

---

## 5. Bugs & Stability

Ranked by likely severity/impact based on the provided updates:

### High severity
#### A. S3/AWS SDK teardown bug
- [Issue #11796](https://github.com/apache/incubator-gluten/issues/11796) — **[CLOSED] finalizeS3FileSystem is never called**
- Fix PR: [#11857](https://github.com/apache/incubator-gluten/pull/11857)
- Impact:
  - Can affect job/process shutdown reliability.
  - Relevant to users with S3-backed workloads and native Velox file system usage.
- Status: **Addressed quickly**, a positive signal for responsiveness.

### Medium severity
#### B. Incorrect memory byte accounting
- [PR #11855](https://github.com/apache/incubator-gluten/pull/11855) — **[CLOSED] Fix `allocateZeroFilled` byte accounting**
- Impact:
  - Misreported memory usage can distort diagnostics and memory enforcement behavior.
  - Could mask real pressure in native execution.
- Status: **Fixed**.

#### C. Spark 4.x plan-tag propagation / disabled test suite
- [PR #11833](https://github.com/apache/incubator-gluten/pull/11833) — **[CLOSED] Enable `GlutenLogicalPlanTagInSparkPlanSuite`**
- Impact:
  - More of a correctness/integration regression risk than a crash.
  - Important because it affected a disabled suite and logical/physical plan tagging consistency.
- Status: **Resolved with full suite passing**.

### Lower severity / hygiene
#### D. GPU dead/redundant code
- [PR #11824](https://github.com/apache/incubator-gluten/pull/11824) — **[CLOSED] GPU code cleanup**
- Impact:
  - Low immediate user impact, but reduces maintenance risk.

### Stability assessment
Today’s bug flow is healthy: the most concrete reported runtime issue was **closed with a linked fix**, and additional closed PRs improved correctness and test coverage. No new widespread crash or data corruption issue appears in the supplied data.

---

## 6. Feature Requests & Roadmap Signals

### Strongest roadmap signals

#### 1. Fuller `TIMESTAMP_NTZ` support
- [PR #11626](https://github.com/apache/incubator-gluten/pull/11626)
- [PR #11720](https://github.com/apache/incubator-gluten/pull/11720)
- This looks highly likely to continue into the next release cycle because:
  - There are multiple coordinated PRs.
  - Validator behavior, tests, and type support are all being worked in parallel.
- Prediction: **Likely near-term inclusion**, at least in partial or guarded form.

#### 2. Kafka source support in Velox
- [PR #11801](https://github.com/apache/incubator-gluten/pull/11801)
- This is a notable connector expansion.
- Prediction: **Possible next-version feature if implementation and compatibility testing mature quickly**, but probably less certain than timestamp work.

#### 3. Iceberg write configuration support
- [PR #11776](https://github.com/apache/incubator-gluten/pull/11776)
- Adds support for `write.target-file-size-bytes` and `write.parquet.page-size-bytes`.
- Prediction: **Good candidate for upcoming release inclusion**, because it is scoped, practical, and directly useful for data lake operators.

#### 4. ANSI cast behavior in Velox
- [PR #11854](https://github.com/apache/incubator-gluten/pull/11854)
- Adds overflow-throwing semantics for numeric-to-integral casts under `spark.sql.ansi.enabled=true`.
- Prediction: **Strong candidate for near-term merge**, since ANSI compatibility is critical for correctness-sensitive users.

#### 5. Parallel execution in Velox backend
- [PR #11852](https://github.com/apache/incubator-gluten/pull/11852)
- Explicitly proof-of-concept with “code TBD, bugs to fix, perf is unsure.”
- Prediction: **Longer-horizon item**, unlikely to land in polished form in the immediate next version.

#### 6. Better UI and fallback observability
- [PR #11853](https://github.com/apache/incubator-gluten/pull/11853)
- This targets V2 writes and plan alignment with the Spark SQL tab.
- Prediction: **Likely useful and mergeable soon**, especially because visibility into fallback reasons is a common operational need.

---

## 7. User Feedback Summary

From the current issue/PR set, the main user pain points appear to be:

### 1. Native/Spark compatibility gaps remain adoption blockers
- Timestamp-related fallback behavior and ANSI cast semantics show that users need Gluten to behave like Spark in edge cases, not just in common happy paths.
- Relevant items:
  - [#11626](https://github.com/apache/incubator-gluten/pull/11626)
  - [#11720](https://github.com/apache/incubator-gluten/pull/11720)
  - [#11854](https://github.com/apache/incubator-gluten/pull/11854)

### 2. Better visibility into fallback and mixed execution is important
- Users need to understand why parts of a plan did not stay native, especially for modern table formats and V2 write flows.
- Relevant item:
  - [#11853](https://github.com/apache/incubator-gluten/pull/11853)

### 3. Real-world production connectors and storage paths matter
- Kafka read support, Iceberg write tuning, and S3 lifecycle correctness all reflect practical deployment needs rather than benchmark-only concerns.
- Relevant items:
  - [#11801](https://github.com/apache/incubator-gluten/pull/11801)
  - [#11776](https://github.com/apache/incubator-gluten/pull/11776)
  - [#11796](https://github.com/apache/incubator-gluten/issues/11796)

### 4. Upstream dependency lag is a real friction point
- The Velox tracker issue suggests users/contributors are feeling the cost of useful fixes not yet being accepted upstream.
- Relevant item:
  - [#11585](https://github.com/apache/incubator-gluten/issues/11585)

### Satisfaction signals
- The best positive signal in today’s data is:
  - [#11833](https://github.com/apache/incubator-gluten/pull/11833), restoring a Spark 4.x suite with **150/150 tests passing**.
- This suggests maintainers are making measurable progress on correctness and compatibility for newer Spark versions.

---

## 8. Backlog Watch

### 1. Upstream Velox PR tracker needs ongoing maintainer attention
- [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585)
- Why it matters:
  - It is active, strategic, and tied to long-term maintenance cost.
  - If unresolved, Gluten may continue to depend on features/fixes that are difficult to carry or rebase.
- Priority: **High strategic priority**

### 2. Basic `TIMESTAMP_NTZ` support remains open
- [PR #11626](https://github.com/apache/incubator-gluten/pull/11626)
- Why it matters:
  - Central to Spark compatibility.
  - Closely related follow-up work is already happening.
- Priority: **High product priority**

### 3. Kafka read support is promising but still open
- [PR #11801](https://github.com/apache/incubator-gluten/pull/11801)
- Why it matters:
  - Expands Gluten into more end-to-end data pipeline scenarios.
- Priority: **Medium-high**

### 4. Parallel execution PoC needs evaluation
- [PR #11852](https://github.com/apache/incubator-gluten/pull/11852)
- Why it matters:
  - Potentially high upside, but risky and not yet mature.
- Priority: **Needs architectural review more than quick merge**

### 5. Temporary/DNR test PR should be cleaned up
- [PR #11743](https://github.com/apache/incubator-gluten/pull/11743) — **[OPEN] [DNR] Temp test**
- Why it matters:
  - Open temporary PRs add noise and can distract review bandwidth.
- Priority: **Low, but worth pruning**

---

## Overall Health Signal

Apache Gluten appears **healthy and actively maintained**, with a strong focus on **Velox integration, Spark compatibility, and production-readiness fixes**. The absence of releases today does not indicate stagnation; instead, the project is moving through a stabilization and capability-expansion phase. The most important near-term themes to watch are **timestamp semantics**, **ANSI correctness**, **connector/data lake support**, and **dependency alignment with upstream Velox**.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-04-01

## 1) Today’s Overview

Apache Arrow showed **steady but issue-heavy maintenance activity** over the last 24 hours: **24 issues updated** and **18 PRs updated**, with **8 PRs/issues closed or merged** and **no new release** published. The day’s work was concentrated in **C++ core, Parquet, FlightRPC/Flight SQL, CI, and language bindings (R, Python, Ruby)** rather than broad new end-user features. A notable pattern is **fast turnaround on CI and fuzzing findings**, which is a strong signal for project health and release readiness. At the same time, many resurfaced updates were on **older stale-tagged issues**, indicating a backlog that still contains unresolved platform, filesystem, and binding gaps.

## 2) Project Progress

### Merged/closed work today

#### CI and release verification hardening
- **[PR #49625](https://github.com/apache/arrow/pull/49625)** — **[R][CI] Some R CI jobs seem unable to access some S3 files on arrow-datasets bucket**  
  Closed quickly to address broken R CI jobs by repointing to a bucket with write access. This improves reliability of Arrow’s dataset-related R test coverage and reduces false negatives in storage integration testing.  
  Related issue: **[Issue #49622](https://github.com/apache/arrow/issues/49622)**

- **[PR #49624](https://github.com/apache/arrow/pull/49624)** — **[CI][Python] Install built wheel on Windows verification and test in isolation**  
  Closed after addressing a **Windows verification import failure** in PyArrow RC testing. This is relevant for packaging correctness and release process quality, especially around Windows wheel build/validation workflows.  
  Related issue: **[Issue #49623](https://github.com/apache/arrow/issues/49623)**

- **[PR #49618](https://github.com/apache/arrow/pull/49618)** — **[C++][CI] Validate all batches in IPC file fuzzer**  
  Closed as a fuzzing hardening change. It improves defensive validation in differential fuzzing between IPC file and stream readers, reducing risk of invalid-memory-access-style failures during malformed input handling.  
  Related issue: **[Issue #49617](https://github.com/apache/arrow/issues/49617)**

#### FlightRPC transport decoupling
- **[PR #49549](https://github.com/apache/arrow/pull/49549)** — **[C++][FlightRPC] Decouple Flight Serialize/Deserialize from gRPC transport**  
  Closed as an important architectural step. This advances Arrow Flight toward a more **transport-agnostic design**, which matters for future protocol flexibility, non-gRPC transports, and cleaner Flight SQL/ODBC layering.  
  Related issue: **[Issue #49548](https://github.com/apache/arrow/issues/49548)**

#### Compute correctness
- **[PR #49602](https://github.com/apache/arrow/pull/49602)** — **[C++][Compute] Fix fixed-width gather byte offset overflow in list filtering**  
  Closed as a **user-visible data correctness fix**. The bug affected filtering on `list<double>` columns and could return values from an incorrect child span, making this one of the most practically important fixes in the current update window.

### What this means for analytics / OLAP users
Today’s closed work did not introduce major new SQL/query features, but it did improve:
- **data correctness in compute kernels**
- **stability under malformed/fuzzed inputs**
- **release and packaging reliability on Windows**
- **storage/CI reliability for dataset and S3-backed test paths**
- **future extensibility of Flight SQL and ODBC transport layers**

For analytical systems built on Arrow, this is a **quality-and-infrastructure day**, not a feature-launch day.

## 3) Community Hot Topics

### 1. Windows file locking / dataset lifecycle in R
- **[Issue #31796](https://github.com/apache/arrow/issues/31796)** — **[R] Permission error on Windows when deleting file previously accessed with open_dataset**  
  Comments: 26  
  This remains the most discussed updated issue. The underlying technical need is better control of **resource finalization and file handle release** on Windows, especially in workflows involving dataset scans, readers, and downstream consumers. For analytics users, this affects iterative ETL/testing workflows and temporary dataset cleanup.

### 2. Arbitrary Python object serialization to Parquet
- **[Issue #31267](https://github.com/apache/arrow/issues/31267)** — **[Python] Allow serializing arbitrary Python objects to parquet**  
  Comments: 10  
  Although closed, its activity reflects recurring user demand to bridge Python’s dynamic object model with Parquet’s typed columnar storage. The technical tension here is clear: users want convenience, but Arrow/Parquet prioritize **schema clarity, interoperability, and deterministic encoding**.

### 3. GCS filesystem throughput and concurrency
- **[Issue #20314](https://github.com/apache/arrow/issues/20314)** — **[C++] Add GCS connection pool size option**  
  Comments: 4  
  This points to a real analytical storage requirement: cloud object stores need **high concurrency and tunable parallelism** for scan performance. In OLAP contexts, insufficient connection pooling can cap throughput well below what multi-threaded readers expect.

### 4. Flight SQL / ODBC packaging and platform support
- **[PR #49603](https://github.com/apache/arrow/pull/49603)** — **[C++][FlightRPC] Windows CI to Support ODBC DLL & MSI Signing**  
- **[PR #46099](https://github.com/apache/arrow/pull/46099)** — **[C++] Arrow Flight SQL ODBC layer**  
- **[PR #49585](https://github.com/apache/arrow/pull/49585)** — **DRAFT: set up static build of ODBC FlightSQL driver**  
  These PRs collectively show strong momentum around **Flight SQL as a deployable connectivity layer**, especially for Windows packaging/signing and driver distribution. This is strategically important for BI, enterprise desktop tooling, and broader SQL client compatibility.

### 5. Fuzzing-driven Parquet robustness
- **[Issue #49626](https://github.com/apache/arrow/issues/49626)** — **[Parquet][C++][CI] Encoding-fuzz failure**  
- **[PR #49627](https://github.com/apache/arrow/pull/49627)** — **[C++][Parquet] Fix encoding fuzzing failure**  
  The quick issue-to-fix loop highlights a strong commitment to **storage engine robustness**. The underlying technical need is strict decoder behavior guarantees under all inputs, including malformed edge cases.

## 4) Bugs & Stability

Ranked by likely severity and practical impact:

### Critical / high

1. **[Issue #49623](https://github.com/apache/arrow/issues/49623)** — **[CI][Python] Windows verification job fails importing PyArrow on Windows**  
   - Severity: **High** for release engineering  
   - Impact: RC verification and Windows package confidence  
   - Fix PR: **[PR #49624](https://github.com/apache/arrow/pull/49624)**  
   This was a release-blocker-class CI issue and appears to have been handled immediately.

2. **[Issue #49626](https://github.com/apache/arrow/issues/49626)** — **[Parquet][C++][CI] Encoding-fuzz failure**  
   - Severity: **High** for parser/decoder safety  
   - Impact: malformed-data handling; potential correctness/stability under edge cases  
   - Fix PR: **[PR #49627](https://github.com/apache/arrow/pull/49627)**  
   Because it originates from OSS-Fuzz and touches Parquet decoding guarantees, this is one of the most important open bugs today.

3. **[PR #49602](https://github.com/apache/arrow/pull/49602)** — **[C++][Compute] Fix fixed-width gather byte offset overflow in list filtering**  
   - Severity: **High** for query correctness  
   - Impact: wrong results when filtering list-valued columns  
   - Status: closed/fixed  
   This was a direct correctness problem in a compute path relevant to analytical filtering.

### Medium

4. **[Issue #49445](https://github.com/apache/arrow/issues/49445)** — **[C++] Potential dereference of nullptr**  
   - Severity: **Medium**  
   - Impact: possible crash/undefined behavior in C bridge code  
   - Fix PR: **[PR #49483](https://github.com/apache/arrow/pull/49483)**  
   The existence of a fix PR is positive, but until merged this remains a notable stability concern.

5. **[Issue #49622](https://github.com/apache/arrow/issues/49622)** — **[R][CI] Some R CI jobs seem unable to access some S3 files on `arrow-datasets` bucket**  
   - Severity: **Medium**  
   - Impact: test coverage and CI reliability, not user data corruption  
   - Fix PR: **[PR #49625](https://github.com/apache/arrow/pull/49625)**  
   Resolved quickly; more infrastructure than runtime severity.

6. **[Issue #49617](https://github.com/apache/arrow/issues/49617)** — **[C++][CI] Validate all batches in IPC file fuzzer**  
   - Severity: **Medium**  
   - Impact: fuzzing blind spot; potential hidden invalid-memory behaviors  
   - Fix PR: **[PR #49618](https://github.com/apache/arrow/pull/49618)**  
   This improves confidence in IPC reader safety.

### Ongoing platform/runtime pain

7. **[Issue #31796](https://github.com/apache/arrow/issues/31796)** — **[R] Permission error on Windows when deleting file previously accessed with open_dataset**  
   - Severity: **Medium** for Windows users  
   - Impact: file cleanup failures, broken temp workflows, dev friction  
   - Fix PR: none visible in this update set

8. **[Issue #31825](https://github.com/apache/arrow/issues/31825)** — **[R] After dataset scan, some RAM is left consumed until a garbage collection pass**  
   - Severity: **Medium** in memory-sensitive workloads  
   - Impact: apparent memory retention after scans  
   - Fix PR: none visible

## 5) Feature Requests & Roadmap Signals

### Strong signals

1. **Flight SQL / ODBC distribution is a major near-term roadmap thread**
   - **[PR #49603](https://github.com/apache/arrow/pull/49603)** — Windows CI for ODBC DLL/MSI signing
   - **[PR #46099](https://github.com/apache/arrow/pull/46099)** — Arrow Flight SQL ODBC layer
   - **[PR #49585](https://github.com/apache/arrow/pull/49585)** — static build of ODBC FlightSQL driver
   - **[Issue #49595](https://github.com/apache/arrow/issues/49595)** — **[C++][FlightRPC][ODBC] DEB Linux Installer**  
   Prediction: **very likely** upcoming releases continue to improve **Flight SQL ODBC packaging, installer support, and platform readiness**.

2. **Transport-agnostic Flight architecture is advancing**
   - **[Issue #49548](https://github.com/apache/arrow/issues/49548)** / **[PR #49549](https://github.com/apache/arrow/pull/49549)**
   - Older related closed issues: **[Issue #31275](https://github.com/apache/arrow/issues/31275)**, **[Issue #31276](https://github.com/apache/arrow/issues/31276)**  
   Prediction: expect more work that separates Flight protocol semantics from gRPC internals, enabling cleaner extensibility.

3. **Cloud/object storage performance and auth remain user priorities**
   - **[Issue #20314](https://github.com/apache/arrow/issues/20314)** — GCS connection pool sizing
   - **[Issue #20228](https://github.com/apache/arrow/issues/20228)** — Python support for AWS S3 web identity credentials
   - **[Issue #31834](https://github.com/apache/arrow/issues/31834)** — Substrait consumer support for non-local filesystem URIs  
   Prediction: these are good candidates for future versions because they align with production analytics deployment patterns on cloud storage.

4. **Parquet correctness and safety improvements are active**
   - **[PR #49615](https://github.com/apache/arrow/pull/49615)** — integer overflow checks when coercing timestamps
   - **[PR #49627](https://github.com/apache/arrow/pull/49627)** — Parquet fuzz failure fix  
   Prediction: likely near-term merge candidates because they address correctness and robustness, which tend to get prioritized close to release cycles.

5. **Language binding completeness**
   - **[Issue #49620](https://github.com/apache/arrow/issues/49620)** / **[PR #49621](https://github.com/apache/arrow/pull/49621)** — Ruby custom metadata in `Message`
   - **[Issue #33390](https://github.com/apache/arrow/issues/33390)** — R field metadata support  
   Prediction: smaller binding-completeness features like these may land incrementally without requiring major design changes.

## 6) User Feedback Summary

The most visible user pain points today are:

- **Windows-specific operational friction in R**
  - **[Issue #31796](https://github.com/apache/arrow/issues/31796)**: users struggle with dataset/file deletion after access, pointing to handle lifecycle complexity on Windows.
  - This suggests Arrow works functionally, but cleanup semantics are still painful in local iterative workflows.

- **Memory retention concerns after scans in R**
  - **[Issue #31825](https://github.com/apache/arrow/issues/31825)**: users notice memory remaining allocated until GC runs.
  - For data analysts, this looks like a leak even if technically it may be allocator/GC interaction.

- **Need for better cloud-native behavior**
  - **[Issue #20314](https://github.com/apache/arrow/issues/20314)**: users want higher GCS throughput via configurable connection pools.
  - **[Issue #20228](https://github.com/apache/arrow/issues/20228)**: Python users need modern AWS auth modes such as web identity credentials.
  - These reflect Arrow’s heavy use in cloud analytics pipelines, where auth and object-store concurrency are essential.

- **Demand for broader ecosystem interoperability**
  - **[PR #46099](https://github.com/apache/arrow/pull/46099)** and related ODBC work show users want Arrow/Flight to integrate smoothly with traditional SQL and BI toolchains.
  - **[Issue #31267](https://github.com/apache/arrow/issues/31267)** reflects the opposite pressure: users sometimes want Arrow to preserve Python-specific object semantics even when that conflicts with portable columnar design.

Overall, feedback indicates users value Arrow’s performance model and format ecosystem, but continue pushing for **better platform ergonomics, stronger cloud integration, and wider connector support**.

## 7) Backlog Watch

These older items look important enough to merit maintainer attention:

- **[Issue #31796](https://github.com/apache/arrow/issues/31796)** — **[R] Permission error on Windows when deleting file previously accessed with open_dataset**  
  Created in 2022, still open, highest comment volume among updated items. This is a long-running platform usability problem.

- **[Issue #20314](https://github.com/apache/arrow/issues/20314)** — **[C++] Add GCS connection pool size option**  
  Important for cloud scan performance; tagged good-first-issue but still open since 2022. The impact exceeds the apparent simplicity.

- **[Issue #20228](https://github.com/apache/arrow/issues/20228)** — **[Python] Support AWS S3 Web identity credentials**  
  A meaningful cloud-auth gap for Kubernetes and federated identity deployments.

- **[Issue #31834](https://github.com/apache/arrow/issues/31834)** — **[C++] Add support for non-local filesystem URIs in the Substrait consumer**  
  Relevant for remote execution and portable query plans; still open since 2022.

- **[Issue #31824](https://github.com/apache/arrow/issues/31824)** — **[C++] ParquetFileFragment caches parquet file metadata and there is no way to disable this**  
  This could matter in memory-sensitive analytics workloads and large-scale scans.

- **[PR #46099](https://github.com/apache/arrow/pull/46099)** — **[C++] Arrow Flight SQL ODBC layer**  
  Long-running, strategically important PR. It likely needs concentrated review bandwidth given its size and cross-platform implications.

- **[PR #48964](https://github.com/apache/arrow/pull/48964)** — **[C++] Upgrade Abseil/Protobuf/GRPC/Google-Cloud-CPP bundled versions**  
  Dependency modernization has broad downstream impact on security, compatibility, and maintenance; this is an important but potentially risky upgrade.

- **[PR #48539](https://github.com/apache/arrow/pull/48539)** — **[Python][CI] Add support for building PyArrow library on Windows ARM64**  
  Windows ARM64 support is increasingly relevant and would improve PyArrow platform coverage.

## Overall Health Assessment

Apache Arrow looks **operationally healthy and responsive**, especially on **CI breakages, fuzzing findings, and correctness bugs**. The strongest current engineering themes are **Flight SQL/ODBC maturation**, **transport decoupling**, and **Parquet/C++ robustness**. The main caution is that several **2022-era issues around cloud filesystems, R ergonomics, and Substrait/remote storage support** remain open, suggesting backlog pressure in areas important to analytical production users.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*