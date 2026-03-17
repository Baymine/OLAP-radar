# Apache Doris Ecosystem Digest 2026-03-17

> Issues: 7 | PRs: 202 | Projects covered: 10 | Generated: 2026-03-17 01:25 UTC

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

# Apache Doris Project Digest — 2026-03-17

## 1. Today's Overview

Apache Doris showed **very high development activity** over the last 24 hours, with **202 PRs updated** and **114 PRs merged/closed**, versus just **7 issues updated**. This indicates the project is currently in a **delivery-heavy phase**, with maintainers focusing on fixes, backports, dependency updates, and branch stabilization across **3.1.x, 4.0.x/4.0.5, and 4.1.x**.  
No new release was published today, but the PR stream strongly suggests **active patch train preparation**, especially for **4.0.5** and **4.1.x**. The themes of the day were **catalog/connectivity robustness, test stability, cloud/storage behavior, and correctness fixes** in query execution and external table reading.

## 2. Project Progress

Today’s merged and closed PRs point to steady progress in three main areas: **external lakehouse interoperability**, **query/load correctness**, and **operational hardening**.

### External table and lakehouse integration
- **Paimon native C++ support infrastructure advanced**
  - [PR #60296](https://github.com/apache/doris/pull/60296) — Integrate `paimon-cpp` into thirdparty build system
  - [PR #61369](https://github.com/apache/doris/pull/61369) — branch-4.1 backport  
  This is strategically important: Doris is reducing reliance on JNI-based access paths for Paimon, which should improve performance and simplify runtime behavior for external table access.

- **Iceberg reader correctness improved**
  - [PR #59984](https://github.com/apache/doris/pull/59984) — fix crash when reading Iceberg tables with schema change and equality deletes
  - [PR #61348](https://github.com/apache/doris/pull/61348) — branch-4.0 backport  
  This is a meaningful lakehouse compatibility fix. Equality deletes plus schema evolution are common in production Iceberg deployments, so this patch reduces one of the higher-risk failure modes in federated analytics.

- **Elasticsearch catalog compatibility improved**
  - [PR #61236](https://github.com/apache/doris/pull/61236) — fix query error when ES keyword field contains array data
  - [PR #61361](https://github.com/apache/doris/pull/61361) — branch-4.0 backport  
  This addresses schema-flexibility mismatches between ES and Doris typing, improving query resilience for semi-structured external sources.

### Load path, storage behavior, and cloud operations
- **Quorum write semantics made more consistent**
  - [PR #60953](https://github.com/apache/doris/pull/60953) — exclude version-gap replicas from success counting in quorum success
  - [PR #61359](https://github.com/apache/doris/pull/61359) — branch-4.0 backport  
  This aligns BE success counting with FE commit validation, reducing the chance of inconsistent success reporting during load operations.

- **File cache robustness improved**
  - [PR #61203](https://github.com/apache/doris/pull/61203) — handle empty block file download cases  
  This is an operationally relevant fix for environments where remote block downloads can fail or produce zero-byte artifacts.

- **Cloud locality-aware balancing improved**
  - [PR #61312](https://github.com/apache/doris/pull/61312) — support FDB locality aware load balancing
  - [PR #61375](https://github.com/apache/doris/pull/61375) — branch-4.0 backport  
  This suggests ongoing refinement of Doris cloud architecture, likely improving data locality efficiency and reducing cross-zone or cross-locality overhead.

### Query engine, MV, and SQL/test quality
- **Materialized view stability improved**
  - [PR #61145](https://github.com/apache/doris/pull/61145) — fix `ConcurrentModificationException` in `PartitionCompensator`
  - [PR #61402](https://github.com/apache/doris/pull/61402) — branch-4.0 backport  
  This is a concrete concurrency fix in MV-related logic and likely important for users operating automated refresh or partition compensation flows.

- **Documentation-backed SQL coverage increased**
  - [PR #61351](https://github.com/apache/doris/pull/61351) — add regression test for `ASOF JOIN` documentation examples
  - [PR #61353](https://github.com/apache/doris/pull/61353) — branch-4.0 backport  
  This helps prevent drift between documented SQL behavior and executable engine behavior.

- **Test suite cleanup and dependency hygiene**
  - [PR #59035](https://github.com/apache/doris/pull/59035) / [#61394](https://github.com/apache/doris/pull/61394) — stabilize `salt_join` test
  - [PR #61311](https://github.com/apache/doris/pull/61311) / [#61392](https://github.com/apache/doris/pull/61392) — remove duplicate TVF test cases
  - [PR #61263](https://github.com/apache/doris/pull/61263) / [#61370](https://github.com/apache/doris/pull/61370) — upgrade OkHttp to 5.3.2  
  Together these indicate sustained branch hardening and release engineering work.

## 3. Community Hot Topics

### 1) BM25 scoring for inverted index query path
- [PR #59847](https://github.com/apache/doris/pull/59847) — support BM25 scoring in `inverted index query_v2`  
This is one of the most strategically interesting open PRs. BM25 support would strengthen Doris for **search-analytics convergence**, allowing relevance-aware retrieval directly inside analytical workloads. The underlying demand is clear: users increasingly want hybrid OLAP + text search capabilities without adding another serving engine.

### 2) Storage vault auth with AWS web identity on EKS
- [Issue #55972](https://github.com/apache/doris/issues/55972) — storage vault unable to use AWS web identity auth  
This issue reflects a strong operational need for **cloud-native identity integration**, especially in Kubernetes and EKS environments. Users want Doris components to work with **service-account-based IAM federation** rather than static credentials, which is now standard for secure cloud deployments.

### 3) Iceberg REST catalog compatibility gaps
- [Issue #61191](https://github.com/apache/doris/issues/61191) — Nessie REST catalog can list DBs/tables but cannot query data
- [Issue #61388](https://github.com/apache/doris/issues/61388) — support custom HTTP headers for REST Iceberg catalog via `header.*` properties  
These two issues together signal that Doris’s Iceberg REST catalog support is still maturing. The technical need is not only protocol compliance, but also **enterprise-grade integration with authenticated API gateways, Nessie deployments, and custom REST metadata services**.

### 4) Better observability of compaction internals
- [Issue #48893](https://github.com/apache/doris/issues/48893) — add `information_schema.be_compaction_tasks`  
This reflects user demand for **first-class introspection into BE maintenance work**. Compaction visibility is critical for diagnosing ingestion lag, write amplification, tablet health, and storage pressure.

### 5) Legacy replica availability / scan range failures
- [Issue #5869](https://github.com/apache/doris/issues/5869) — after BE restart, query reports `Failed to get scan range, no queryable replica found in tablet`  
Despite its age, this issue resurfacing suggests persistent operator concern around **replica recovery, tablet availability, and post-failure query continuity**.

## 4. Bugs & Stability

Ranked by likely production severity:

### High severity
1. **Iceberg REST catalog usable for metadata but not for data queries**
   - [Issue #61191](https://github.com/apache/doris/issues/61191)  
   Users can inspect databases and tables but cannot query data when using Nessie REST catalog. This is severe for lakehouse users because it blocks actual analytics while giving the appearance of successful integration.  
   **Related fix activity:** no direct fix PR shown today, but Iceberg compatibility work is active via [PR #59984](https://github.com/apache/doris/pull/59984).

2. **AWS web identity authentication not working for storage vault**
   - [Issue #55972](https://github.com/apache/doris/issues/55972)  
   This is high severity for managed Kubernetes deployments on AWS because it can block secure object storage access entirely. It also suggests a gap in modern cloud auth support.

3. **Replica/query availability after BE restart**
   - [Issue #5869](https://github.com/apache/doris/issues/5869)  
   `no queryable replica found in tablet` is a serious availability symptom. Even though the issue is old, its continued activity makes it relevant to production reliability.

### Medium severity
4. **Routine Load partial column update not working**
   - [Issue #57652](https://github.com/apache/doris/issues/57652)  
   This affects ingestion semantics for Unique Key / partial update scenarios. For users relying on streaming upserts, this can become a correctness problem rather than just a feature gap.

5. **Materialized view concurrent modification bug fixed**
   - [PR #61145](https://github.com/apache/doris/pull/61145), [PR #61402](https://github.com/apache/doris/pull/61402)  
   Good news: a real concurrency issue was fixed and backported.

6. **ES array-in-keyword query type mismatch fixed**
   - [PR #61236](https://github.com/apache/doris/pull/61236), [PR #61361](https://github.com/apache/doris/pull/61361)  
   Important for heterogeneous schemas and federated use cases.

### Lower severity but noteworthy
7. **Empty block file handling in file cache**
   - [PR #61203](https://github.com/apache/doris/pull/61203)  
   More defensive than user-visible feature work, but a useful stability improvement.

8. **Potential wrong result for `abs(decimalv2)`**
   - [PR #61397](https://github.com/apache/doris/pull/61397)  
   This is an open correctness fix. Wrong-result bugs are always important, even if function scope is narrow.

9. **BDB JE unit test resource leak causing FE UT timeout**
   - [PR #61404](https://github.com/apache/doris/pull/61404)  
   Mostly affects CI and developer productivity, but flaky infrastructure can slow releases if left unresolved.

## 5. Feature Requests & Roadmap Signals

Several requests and PRs give useful signals about likely near-term roadmap direction.

### Strong roadmap signals
- **Richer Iceberg REST catalog support**
  - [Issue #61388](https://github.com/apache/doris/issues/61388) — custom HTTP headers
  - [Issue #61191](https://github.com/apache/doris/issues/61191) — Nessie REST query failures  
  Expect Doris to continue improving **REST catalog compliance, authentication support, and interoperability** in upcoming 4.0.x/4.1.x updates.

- **Secure LDAP / LDAPS support**
  - [Issue #60236](https://github.com/apache/doris/issues/60236) — closed enhancement
  - [PR #61406](https://github.com/apache/doris/pull/61406) — branch-4.0 LDAPS support backport  
  This is a clear enterprise feature and likely to appear soon in a stable patch release if not already queued.

- **Compaction observability**
  - [Issue #48893](https://github.com/apache/doris/issues/48893)  
  A system table for BE compaction tasks fits Doris’s operational maturity work. This feels plausible for a future minor release because it is additive and useful.

- **Search relevance / hybrid retrieval**
  - [PR #59847](https://github.com/apache/doris/pull/59847) — BM25 support  
  If merged, this would be a notable feature for users blending document retrieval with analytics.

- **OSS filesystem simplification**
  - [PR #61269](https://github.com/apache/doris/pull/61269) — unify FE OSS filesystem with Jindo  
  This suggests the project wants to reduce duplicated connector paths and improve maintainability for object storage integrations.

### Likely next-version candidates
Most likely to land in the next patch/minor line based on current evidence:
1. **LDAPS support**
2. **More Iceberg REST catalog compatibility improvements**
3. **Additional external table / lakehouse reliability fixes**
4. **Operational introspection improvements for compaction and storage**
5. **Potential BM25 if review momentum continues**

## 6. User Feedback Summary

Today’s user-visible feedback clusters around a few recurring pain points:

- **Cloud-native deployment friction remains real.**  
  The AWS web identity issue shows users expect Doris to fit modern Kubernetes/IAM patterns out of the box, not require static secrets or custom workarounds.
  - [Issue #55972](https://github.com/apache/doris/issues/55972)

- **Lakehouse interoperability is useful but still uneven in edge cases.**  
  Users are clearly adopting Doris against Iceberg/Nessie and Elasticsearch, but production readiness depends on resolving schema evolution, delete semantics, REST auth/header support, and non-canonical source data representations.
  - [Issue #61191](https://github.com/apache/doris/issues/61191)
  - [Issue #61388](https://github.com/apache/doris/issues/61388)
  - [PR #59984](https://github.com/apache/doris/pull/59984)
  - [PR #61236](https://github.com/apache/doris/pull/61236)

- **Operators want deeper internal visibility.**  
  The compaction system-table request indicates that users are managing real production clusters where BE background work needs SQL-visible diagnostics.
  - [Issue #48893](https://github.com/apache/doris/issues/48893)

- **Streaming and update semantics still matter.**  
  The routine load partial-update issue suggests Doris is being used not only for batch OLAP but also for **incremental and near-real-time ingestion workflows**.
  - [Issue #57652](https://github.com/apache/doris/issues/57652)

Overall, feedback suggests **strong adoption in complex production topologies**, but also that users increasingly expect Doris to behave like a polished cloud/lakehouse platform, not just a fast MPP OLAP engine.

## 7. Backlog Watch

These items look important and deserving of maintainer attention due to age, production impact, or architectural significance.

### Older issues still relevant
- [Issue #5869](https://github.com/apache/doris/issues/5869) — BE restart leads to `no queryable replica found in tablet`  
  Very old and operationally serious. If still reproducible, it deserves explicit triage status or closure rationale.

- [Issue #48893](https://github.com/apache/doris/issues/48893) — `information_schema.be_compaction_tasks`  
  Not urgent in the crash/correctness sense, but high operator value and a good observability enhancement candidate.

- [Issue #55972](https://github.com/apache/doris/issues/55972) — AWS web identity auth  
  Marked stale, but the use case is modern and important enough that it should likely be re-evaluated rather than left to age out.

- [Issue #57652](https://github.com/apache/doris/issues/57652) — routine load partial column update broken  
  This appears under-discussed relative to its potential ingestion correctness impact.

### Open PRs needing follow-through
- [PR #59847](https://github.com/apache/doris/pull/59847) — BM25 scoring  
  High strategic value, but likely non-trivial in planner/execution semantics and ranking behavior.

- [PR #61269](https://github.com/apache/doris/pull/61269) — unify FE OSS filesystem with Jindo  
  Potentially impactful refactor touching storage connector behavior; worth careful review due to compatibility risk.

- [PR #61397](https://github.com/apache/doris/pull/61397) — fix wrong result of `abs(decimalv2)`  
  Wrong-result bugs should generally get quick maintainer attention.

- [PR #61404](https://github.com/apache/doris/pull/61404) — BDB JE FE UT timeout fix  
  Important for CI health and release velocity.

---

## Bottom Line

Apache Doris appears **healthy and highly active**, with today’s work centered on **stabilization, backports, and interoperability improvements** rather than headline releases. The strongest technical momentum is around **lakehouse connectors, enterprise/security features, cloud storage behavior, and query/load correctness**. The main caution areas remain **cloud-native auth**, **Iceberg REST completeness**, and a few **long-lived operational issues** that still merit sharper maintainer focus.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-17

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains extremely active, but the center of gravity has shifted from headline features to **stability, interoperability, cloud-native operability, and lakehouse correctness**. Across engines, the strongest common signals are demand for **Iceberg/REST catalog maturity, object storage efficiency, streaming correctness, and better observability of background maintenance work**. MPP databases such as **Apache Doris, ClickHouse, and StarRocks** are converging toward broader federated/lakehouse roles, while **DuckDB** is optimizing embedded and local/lake analytics, and table-format projects like **Iceberg** and **Delta Lake** are deepening metadata, connector, and protocol reliability. Overall, the ecosystem is healthy, but users are increasingly evaluating projects on **upgrade predictability, operational transparency, and semantic edge-case correctness**, not just raw query speed.

---

## 2. Activity Comparison

### Daily activity snapshot

| Project | Issues Updated | PRs Updated | Release Today | Health Score* | Current Read |
|---|---:|---:|---|---:|---|
| **Apache Doris** | 7 | 202 | No | **9.2/10** | Very high throughput; patch/backport-heavy; strong stabilization momentum |
| **ClickHouse** | 76 | 396 | No | **9.0/10** | Largest visible activity; fast bug response; some regression risk in 26.2 |
| **DuckDB** | 14 | 36 | No | **8.6/10** | Healthy and responsive; concentrated post-1.5 regression handling |
| **StarRocks** | 36 | 104 | No | **8.5/10** | Strong maintenance cadence; many docs/backports plus important connector/storage work |
| **Apache Iceberg** | 14 | 50 | No | **8.8/10** | Solid maintainer engagement; connector and metadata API evolution |
| **Delta Lake** | 3 | 32 | No | **8.4/10** | Implementation-heavy phase; DSv2, CDC, catalog integration hardening |
| **Velox** | 5 | 50 | No | **8.3/10** | Strong engine-core innovation; correctness/build issues still matter |
| **Apache Gluten** | 6 | 22 | No | **8.0/10** | Active backend integration work; compatibility/perf issues remain |
| **Apache Arrow** | 27 | 15 | No | **8.1/10** | Stable foundational project; current focus on packaging/platform/tooling |
| **Databend** | N/A | N/A | No data | N/A | Digest unavailable |

\*Health score is a qualitative synthesis of activity, responsiveness, visible fix velocity, and current risk signals from the digests.

### Interpretation
- **ClickHouse** has the broadest absolute activity footprint.
- **Apache Doris** shows unusually strong **delivery efficiency** relative to issue volume, suggesting effective maintainer throughput and branch management.
- **DuckDB, Delta Lake, and Iceberg** are in focused stabilization/architecture-evolution cycles rather than broad issue churn.
- **Velox/Gluten/Arrow** reflect a lower-level infrastructure layer where platform correctness and integration quality are major themes.

---

## 3. Apache Doris's Position

### Where Doris stands out

**Apache Doris is currently one of the strongest “balanced MPP analytical platform” projects in the ecosystem.** Compared with peers, it is showing a particularly strong mix of:
- **high maintainer throughput**,
- **multi-branch patch discipline**,
- **external catalog/lakehouse connector investment**,
- **operational hardening**, and
- **continued SQL/query-engine correctness work**.

### Advantages vs peers

**Versus ClickHouse**
- Doris appears more visibly focused on **branch stabilization and enterprise patch-train execution**, while ClickHouse is managing a larger volume of planner/storage regressions and fuzz-found crash cases.
- Doris’s recent work is especially strong in **external interoperability hardening**: Iceberg schema evolution + equality deletes, Elasticsearch type mismatch handling, Paimon native C++ integration.
- ClickHouse still has broader ecosystem scale and more raw development volume, but Doris currently looks more **release-train disciplined**.

**Versus StarRocks**
- Doris and StarRocks are closest in positioning: cloud-era MPP OLAP systems extending into lakehouse federation.
- Doris today shows stronger visible momentum in **backports, connector correctness, quorum/load semantics, and cloud storage behavior**.
- StarRocks has strong lakehouse and Arrow Flight signals, but user pain still clusters around **metadata HA, MV operations, and compaction pathologies**.

**Versus DuckDB**
- Doris is clearly optimized for **distributed serving-scale analytics and operational clusters**, not embedded/local analysis.
- DuckDB is stronger for **single-node, developer-centric, local/S3/Parquet workflows**, but is currently dealing with 1.5 regression fallout in optimizer and S3 request behavior.
- Doris is the better fit for **multi-tenant, always-on OLAP service** scenarios.

**Versus Iceberg / Delta**
- Doris is not a table-format control plane; instead it is increasingly positioning itself as a **compute/query layer over lakehouse assets**.
- Its current investment in Iceberg/Paimon/ES/Paimon-native/C++ paths suggests a strategy of **high-performance federated analytics without giving up native MPP strengths**.

### Technical approach differences

Doris’s approach is increasingly defined by:
- **native MPP execution plus external lakehouse access**,
- reducing JVM/JNI overhead where possible, e.g. **Paimon native C++ support**,
- strong FE/BE coordination fixes, e.g. **quorum success alignment**,
- practical operator-facing reliability work rather than only planner innovation.

That differs from:
- **ClickHouse**: more monolithic engine intensity, stronger internal engine experimentation/fuzzing pace.
- **DuckDB**: embedded/vectorized/local-first architecture.
- **StarRocks**: similar cloud/lakehouse trajectory, but with somewhat more visible discussion around control-plane/cloud-native ergonomics.
- **Delta/Iceberg**: metadata/protocol/control-plane focus rather than serving-engine focus.

### Community size comparison

By visible issue/PR volume:
- **ClickHouse** remains the largest and busiest community in this snapshot.
- **Apache Doris** is in the top tier of active analytical engines, with activity clearly above most peers except ClickHouse.
- **StarRocks** also has a large active engineering footprint, but Doris appears to have stronger current backport/patch cadence.
- **DuckDB** has a smaller but very efficient and high-signal community.
- **Iceberg** and **Delta Lake** are highly influential despite lower volume because they sit at critical interoperability layers.

**Bottom line:** Doris is not the largest community, but it is currently one of the most operationally effective and strategically well-positioned MPP OLAP projects.

---

## 4. Shared Technical Focus Areas

Several requirements are emerging across multiple engines.

### A. Lakehouse interoperability maturity
**Engines:** Doris, ClickHouse, StarRocks, DuckDB, Iceberg, Delta Lake, Gluten, Velox  
**Specific needs:**
- **Iceberg REST catalog compatibility** and auth/header support: Doris, StarRocks
- **Iceberg crash/correctness fixes**: ClickHouse, Doris, StarRocks, Velox/Gluten
- **Hive-partition pruning / remote scan efficiency**: DuckDB
- **Delta DSv2/catalog-managed table behavior**: Delta Lake
- **Metadata API evolution for file/snapshot changes**: Iceberg

**Signal:** Users increasingly expect engines to work cleanly over external table formats, not only native storage.

### B. Cloud-native identity, object storage, and remote IO efficiency
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Delta Lake, Arrow  
**Specific needs:**
- **AWS web identity / IAM federation**: Doris
- **REST catalog SigV4 / IAM role propagation**: StarRocks
- **S3Queue listing efficiency (`StartAfter`)**: ClickHouse
- **S3 request explosion and partition-pruning regressions**: DuckDB
- **OAuth / token refresh for server-side planning**: Delta Lake
- **packaging/platform integration for cloud/client environments**: Arrow

**Signal:** Storage access is now judged as much on **auth model and API efficiency** as on raw bandwidth.

### C. Correctness over optimizer aggressiveness
**Engines:** ClickHouse, DuckDB, Doris, Iceberg, Velox, Gluten  
**Specific needs:**
- query wrong-result and rewrite bugs: ClickHouse, DuckDB
- external table semantic correctness: Doris
- Spark pushdown correctness with NaN: Iceberg
- predicate/statistics misfiltering risk: Velox
- Spark compatibility and pruning correctness: Gluten

**Signal:** Community tolerance for optimizer regressions is low; correctness still outranks clever rewrites.

### D. Streaming / ingestion reliability
**Engines:** Doris, ClickHouse, Iceberg, Delta Lake, StarRocks  
**Specific needs:**
- routine load / partial update correctness: Doris
- Kafka / MV ingestion edge cases: ClickHouse
- Kafka Connect durability under Glue failures: Iceberg
- SparkMicroBatchStream leaks / CDC behavior: Delta Lake
- PK compaction and stream load failures: StarRocks

**Signal:** Analytical systems are increasingly used in **continuous ingestion and CDC pipelines**, not just batch BI.

### E. Operator observability and maintenance introspection
**Engines:** Doris, StarRocks, Iceberg, Delta Lake, ClickHouse  
**Specific needs:**
- compaction system tables / task visibility: Doris
- compaction pathologies and tablet stats: StarRocks
- connector election logging / state observability: Iceberg
- commit metrics transport: Delta Lake
- CI/fuzz/build signal quality as operational proxy: ClickHouse

**Signal:** Production users want **first-class introspection**, not black-box maintenance behavior.

---

## 5. Differentiation Analysis

### Storage format orientation

| Engine | Native Storage Orientation | External/Lakehouse Orientation |
|---|---|---|
| **Apache Doris** | Native MPP OLAP storage | Strong and growing: Iceberg, Paimon, ES |
| **ClickHouse** | Strong native MergeTree ecosystem | Growing support for Iceberg, Parquet, object storage |
| **DuckDB** | Minimal “database server” emphasis; local DB + files | Very strong Parquet/S3/lake usage |
| **StarRocks** | Native OLAP + lake tables | Strong Iceberg/Hive/Paimon/federation push |
| **Iceberg** | Table format / metadata layer | N/A — this is the interoperability substrate |
| **Delta Lake** | Table format / transaction log | N/A — metadata + Spark/Kernel ecosystem |
| **Velox** | Execution engine, not storage system | Connector/storage abstraction level |
| **Gluten** | Acceleration layer over Spark | Lakehouse via Spark ecosystem |
| **Arrow** | In-memory columnar/data interchange | Foundational library for engines/connectors |

### Query engine design

- **Doris / StarRocks / ClickHouse**: distributed OLAP serving engines.
- **DuckDB**: embedded/vectorized analytics engine for local and remote files.
- **Velox**: execution substrate for other engines.
- **Gluten**: Spark acceleration layer, especially via Velox backend.
- **Iceberg / Delta Lake**: storage metadata/protocol layers rather than query engines.
- **Arrow**: execution-adjacent but primarily a data/compute foundation.

### Target workloads

- **Apache Doris**: real-time OLAP, federated analytics, mixed ingestion + serving, enterprise operational clusters.
- **ClickHouse**: high-scale analytics, logging/observability, event analytics, text/index-enhanced analytics.
- **DuckDB**: developer analytics, notebook workflows, embedded BI, local/lake exploration.
- **StarRocks**: cloud-native MPP analytics, lakehouse federation, MV-heavy acceleration.
- **Iceberg / Delta**: multi-engine data lake management and transactional table semantics.
- **Velox / Gluten**: acceleration and execution infrastructure for higher-level systems.

### SQL compatibility and semantics

- **DuckDB** often trends toward developer-friendly SQL breadth and fast iteration, but current regressions show the cost of aggressive optimizer evolution.
- **ClickHouse** has broad analytical SQL but still visible gaps/edge cases around correlated subqueries and text/index semantics.
- **StarRocks** community feedback shows demand for more PostgreSQL-style completeness.
- **Doris** is improving SQL coverage and regression protection pragmatically, e.g. doc-backed tests like `ASOF JOIN`.
- **Delta/Iceberg** focus on schema/protocol/connector semantic consistency more than SQL surface itself.

---

## 6. Community Momentum & Maturity

### Activity tiers

**Tier 1: Hyperactive**
- **ClickHouse**
- **Apache Doris**

These projects show the heaviest visible engineering throughput. ClickHouse is larger in raw volume; Doris appears especially strong in branch hardening and disciplined backports.

**Tier 2: High momentum**
- **StarRocks**
- **Apache Iceberg**
- **DuckDB**

All three are healthy, but with different profiles:
- StarRocks: active and broad, though many issues still point to operational rough edges.
- Iceberg: strategically important and steadily advancing metadata/connector robustness.
- DuckDB: highly responsive, currently in a regression-fix concentration phase.

**Tier 3: Focused architectural iteration**
- **Delta Lake**
- **Velox**
- **Apache Arrow**
- **Apache Gluten**

These projects are active but more specialized:
- Delta is deep in DSv2/catalog/streaming evolution.
- Velox is innovating rapidly at the execution layer.
- Arrow is stable and foundational, with more packaging/platform work than feature churn.
- Gluten is progressing but still constrained by upstream and compatibility work.

### Who is rapidly iterating?
- **ClickHouse**: rapid issue-to-fix loop, especially crash/CI/fuzzing.
- **Doris**: rapid patch/backport cycle across multiple release branches.
- **DuckDB**: very fast turnaround on regressions.
- **Velox**: rapid low-level engine evolution.

### Who is stabilizing?
- **Doris** strongly, especially across 3.1.x/4.0.x/4.1.x.
- **Iceberg** around 1.10.x.
- **Delta Lake** around correctness and integration plumbing rather than broad release packaging.
- **Arrow** as a mature infrastructure layer.

---

## 7. Trend Signals

### 1. “Lakehouse compatibility” is now table stakes
Users expect OLAP engines to query **Iceberg, Paimon, Delta-style ecosystems, REST catalogs, and object stores** with native-quality reliability.  
**Value for architects:** choose engines based not only on native storage performance, but on the quality of their external table semantics and auth models.

### 2. Cloud-native auth and remote storage ergonomics are becoming buying criteria
AWS web identity, IAM role propagation, OAuth token refresh, REST catalog headers, and S3 list efficiency are recurring asks.  
**Value for data engineers:** operational fit with Kubernetes and cloud IAM can now be as important as SQL features.

### 3. Correctness regressions are more visible than performance wins
Across ClickHouse, DuckDB, Velox, Iceberg, and Doris-related connector paths, communities quickly surface wrong-result, crash, or semantic mismatch bugs.  
**Value for decision-makers:** prioritize projects with strong regression discipline and backport hygiene if production predictability matters.

### 4. Streaming/CDC and batch OLAP are converging
Doris routine load semantics, ClickHouse Kafka paths, Iceberg Kafka Connect, Delta CDC/streaming, and StarRocks stream load issues all point the same way.  
**Value for architects:** modern analytics engines are no longer separable into “batch warehouse” vs “streaming system”; ingestion reliability is a core evaluation axis.

### 5. Operator observability is rising in importance
Compaction introspection, commit metrics, election logs, tablet stats, and maintenance visibility are recurring requests.  
**Value for platform teams:** projects that expose internal maintenance state through SQL/system tables/logging will be easier to run at scale.

### 6. Native execution remains important, but integration quality is the differentiator
Many engines are fast; fewer are easy to integrate cleanly with external catalogs, cloud auth, and production governance.  
**Value for technical leaders:** ecosystem fit, metadata compatibility, and operability increasingly outweigh isolated benchmark numbers.

---

## Closing Assessment

**Apache Doris is currently in a strong position**: it combines top-tier activity, visible patch discipline, growing lakehouse interoperability, and practical operational hardening. **ClickHouse** remains the largest and most intense engine community, but with more visible regression pressure. **StarRocks** is a close strategic peer to Doris, especially in federated/cloud-native analytics, while **DuckDB** dominates a different category centered on embedded and local/lake workflows. For data engineers and architects, the main market-wide takeaway is clear: the next wave of differentiation is no longer just query speed, but **cloud-native operability, lakehouse correctness, and production-grade maintenance transparency**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-17

## 1) Today’s Overview

ClickHouse remained highly active over the last 24 hours, with **76 issues updated** and **396 pull requests updated**, indicating a very busy development and triage cycle. Activity is especially concentrated around **bug fixing, CI hardening, fuzzing coverage, crash remediation, and SQL/query-planner correctness**, rather than releases, as **no new versions were published today**. The project appears healthy in terms of maintainer throughput: many previously reported bugs were closed, while new regressions and fuzz-found failures are quickly being converted into fix PRs. The main risk signals today are **26.2 performance regressions**, **analyzer/correlated-subquery correctness**, and a continued stream of **storage-format and MergeTree crash edge cases**.

## 2) Project Progress

Although no releases landed, the merged/closed work visible today shows clear forward motion in several technical areas:

### Query correctness and SQL semantics
- A fix was closed for **`replaceRegexpOne` returning different results depending on `optimize_rewrite_regexp_functions`**, a notable query correctness issue tied to the analyzer/optimizer stack.  
  [Issue #93434](https://github.com/ClickHouse/ClickHouse/issues/93434)
- **`windowFunnel` with `strict_deduplication`** was closed after a long-standing unexpected-result report, suggesting progress on analytical function correctness.  
  [Issue #37177](https://github.com/ClickHouse/ClickHouse/issues/37177)
- A bug around **query condition cache + PREWHERE handling** was closed, which is relevant for MergeTree predicate pruning correctness and performance predictability.  
  [Issue #85222](https://github.com/ClickHouse/ClickHouse/issues/85222)
- A bugfix PR closed for **incorrect results in `hasAllTokens` with OR across multiple text indexes**, indicating continuing improvements in text index query semantics.  
  [PR #99505](https://github.com/ClickHouse/ClickHouse/pull/99505)

### Storage engines and table formats
- A backward-compatibility issue involving **`TTL TO DISK` validation for base disks wrapped in cache layers** was closed, improving mixed local/object-storage disk configurations.  
  [Issue #98665](https://github.com/ClickHouse/ClickHouse/issues/98665)
- A Kafka-related bug involving **`deduplicate_blocks_in_dependent_materialized_views`** was closed, improving streaming ingestion stability.  
  [Issue #83995](https://github.com/ClickHouse/ClickHouse/issues/83995)
- Active PRs today target **Parquet reader stability**, **unknown projections recovery**, and **Iceberg ALTER crash backports**, all signals that lakehouse/table-format interoperability remains a major investment area.  
  [PR #99677](https://github.com/ClickHouse/ClickHouse/pull/99677)  
  [PR #99623](https://github.com/ClickHouse/ClickHouse/pull/99623)  
  [PR #99411](https://github.com/ClickHouse/ClickHouse/pull/99411)

### Reliability, CI, and fuzzing
- ClickHouse continues to aggressively expand fuzz coverage. A new build PR adds fuzz targets for **compression codecs, NativeReader, DataTypes, Variant/Dynamic serialization, LowCardinality, and WASM**. This is strategically important because several crash fixes today were found by those new fuzzers.  
  [PR #99653](https://github.com/ClickHouse/ClickHouse/pull/99653)
- Correspondingly, a fix PR already addresses **heap-buffer-overflow in T64** and an **abort in Multiple decompression codecs**.  
  [PR #99680](https://github.com/ClickHouse/ClickHouse/pull/99680)
- Multiple CI-focused PRs are tackling flaky tests and infra races, showing strong maintainer attention to test signal quality.  
  [PR #99684](https://github.com/ClickHouse/ClickHouse/pull/99684)  
  [PR #99594](https://github.com/ClickHouse/ClickHouse/pull/99594)  
  [PR #99580](https://github.com/ClickHouse/ClickHouse/pull/99580)

## 3) Community Hot Topics

### 1. INSERT regression after upgrading to 26.2
The hottest open user issue is a report that **INSERT queries are 3x slower in 26.2 vs 25.12** on a `ReplacingMergeTree` workload. This is the strongest real-world production signal today because it affects upgrade confidence and write-path economics.  
[Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)

**Underlying need:** users want **predictable upgrade performance**, especially for mutable MergeTree workloads. This likely needs profiling against insert pipeline, deduplication/cleanup behavior, merges, or analyzer-related planning changes.

### 2. S3Queue listing efficiency
A long-running feature request asks for **S3Queue ordered mode to use `StartAfter` in S3 `ListObjects`** to dramatically reduce repeated listing calls.  
[Issue #91522](https://github.com/ClickHouse/ClickHouse/issues/91522)

**Underlying need:** lower cloud API cost and better throughput for object-storage-driven ingestion. This is a practical ask from users operating large S3-backed pipelines.

### 3. Merge table function / filesystem table-function work
A long-lived open PR for a **`filesystem` table function** remains one of the most visible feature threads.  
[PR #53610](https://github.com/ClickHouse/ClickHouse/pull/53610)

**Underlying need:** users increasingly want SQL-native access to filesystems and file metadata, blurring boundaries between database, ETL tool, and data lake explorer.

### 4. Security/governance around source filter grants
There is active interest in extending **source filter grants** to more source types, especially **REMOTE**.  
[Issue #95555](https://github.com/ClickHouse/ClickHouse/issues/95555)

**Underlying need:** finer-grained governance for federated query access, especially as ClickHouse is used in more multi-tenant and regulated environments.

## 4) Bugs & Stability

Ranked by likely user impact and severity:

### Critical / high severity

1. **26.2 INSERT slowdown (~3x)**  
   Production performance regression affecting upgrade safety. No matching fix PR is visible in the provided data.  
   [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)

2. **Iceberg crash on `ALTER TABLE MODIFY COLUMN COMMENT`**  
   A server crash from a metadata-only DDL path on Iceberg-backed tables is a serious lakehouse interoperability issue. No fix PR is explicitly linked in the provided snapshot.  
   [Issue #99523](https://github.com/ClickHouse/ClickHouse/issues/99523)

3. **Parquet reader nullptr dereference in filter-in-decoder path**  
   This has an active critical bugfix PR and backport tag, which is a positive sign.  
   [PR #99677](https://github.com/ClickHouse/ClickHouse/pull/99677)

4. **Merge crash due to dangling reference in `injectRequiredColumns`**  
   Active fix PR suggests prompt maintainer response.  
   [PR #99679](https://github.com/ClickHouse/ClickHouse/pull/99679)

### Medium severity

5. **Correlated subquery regression: `LIMIT 0` / `LIMIT n OFFSET m` support**  
   This is framed as a feature request but functionally signals a regression introduced by recent correlated-subquery work.  
   [Issue #99524](https://github.com/ClickHouse/ClickHouse/issues/99524)

6. **Npy parser infinite loop with negative shape dimension**  
   Crafted input can cause a non-terminating parser path; relevant for robustness and potentially security hardening.  
   [Issue #99585](https://github.com/ClickHouse/ClickHouse/issues/99585)

7. **Logical error with projection index causing sort-order violation**  
   Fuzz-found correctness/stability issue involving projections. No fix PR listed yet.  
   [Issue #99388](https://github.com/ClickHouse/ClickHouse/issues/99388)

8. **CI crash: `MergeTreeRangeReader finalize failed during data reading`**  
   Currently a crash-CI signal rather than a confirmed user-facing regression, but potentially tied to MergeTree read-path fragility.  
   [Issue #99358](https://github.com/ClickHouse/ClickHouse/issues/99358)

### Positive stability signals

- Analyzer crash with nested `GLOBAL IN` was closed quickly.  
  [Issue #99362](https://github.com/ClickHouse/ClickHouse/issues/99362)
- Object-storage metadata race in version checks has an active CI fix.  
  [PR #99580](https://github.com/ClickHouse/ClickHouse/pull/99580)
- Compression codec crashes are being caught early via newly added fuzzing.  
  [PR #99653](https://github.com/ClickHouse/ClickHouse/pull/99653)  
  [PR #99680](https://github.com/ClickHouse/ClickHouse/pull/99680)

## 5) Feature Requests & Roadmap Signals

Several user requests provide a good view of where ClickHouse demand is moving:

### Object storage and ingestion
- **S3Queue ordered mode with `StartAfter`** for fewer listing calls  
  [Issue #91522](https://github.com/ClickHouse/ClickHouse/issues/91522)
- **Preserve original prefixes in S3Queue after `after_processing='move'`**  
  [Issue #96062](https://github.com/ClickHouse/ClickHouse/issues/96062)

These are strong candidates for future versions because they directly improve cloud-native ingestion efficiency and operator ergonomics.

### Storage lifecycle / mutable data management
- **Automatic periodic cleanup of deleted rows for ReplacingMergeTree**  
  [Issue #99348](https://github.com/ClickHouse/ClickHouse/issues/99348)

This aligns with a broader trend: users want easier management of mutable entities without manual cleanup orchestration. This feels likely to attract interest for an upcoming release because it addresses a common operational pattern.

### SQL compatibility and planner completeness
- **Support `LIMIT 0` or `LIMIT n OFFSET m` in correlated subqueries**  
  [Issue #99524](https://github.com/ClickHouse/ClickHouse/issues/99524)

Given the current push around correlated subqueries, this has a good chance of being addressed soon, especially if it is tied to a regression from recent work.

### Compression and analytical storage efficiency
- **Add ALP_RD compression support**  
  [Issue #99139](https://github.com/ClickHouse/ClickHouse/issues/99139)

This is a strong roadmap signal for users with floating-point heavy analytical data. If adopted, it would fit ClickHouse’s continued investment in compression-aware columnar performance.

### Keeper functionality
- **TTL support for ClickHouse Keeper nodes**  
  [Issue #55595](https://github.com/ClickHouse/ClickHouse/issues/55595)

Useful but slower-moving; likely lower near-term priority than query engine and object storage issues.

### File/data-lake usability
- **`filesystem` table function**  
  [PR #53610](https://github.com/ClickHouse/ClickHouse/pull/53610)
- **`clickhouse-local ls` meta-command**  
  [PR #99652](https://github.com/ClickHouse/ClickHouse/pull/99652)

These suggest an emerging roadmap theme: making ClickHouse friendlier as a standalone analytical shell for local and lake-style datasets.

## 6) User Feedback Summary

Today’s user feedback points to a few recurring pain points:

- **Upgrade regressions matter more than raw feature count.** The 26.2 INSERT slowdown report is the clearest signal that performance stability across versions remains a top user expectation.  
  [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)

- **Cloud object storage workflows still need cost/performance refinement.** S3Queue users are asking for lower API call volumes and better path-preservation behavior, indicating that ingestion from object stores is mainstream but not frictionless yet.  
  [Issue #91522](https://github.com/ClickHouse/ClickHouse/issues/91522)  
  [Issue #96062](https://github.com/ClickHouse/ClickHouse/issues/96062)

- **Lakehouse interoperability is valuable but fragile.** Iceberg and Parquet crash fixes/backports show that users are actively relying on these integrations, and that quality here is increasingly strategic.  
  [Issue #99523](https://github.com/ClickHouse/ClickHouse/issues/99523)  
  [PR #99677](https://github.com/ClickHouse/ClickHouse/pull/99677)  
  [PR #99411](https://github.com/ClickHouse/ClickHouse/pull/99411)

- **Users want mature governance/security controls.** Requests around source filter grants and previous attention to row-policy behavior suggest more enterprise-style adoption.  
  [Issue #95555](https://github.com/ClickHouse/ClickHouse/issues/95555)  
  [Issue #93968](https://github.com/ClickHouse/ClickHouse/issues/93968)

Overall, user sentiment today implies that ClickHouse is delivering broad capability, but users increasingly judge it on **predictability, cloud efficiency, and correctness at edge cases**.

## 7) Backlog Watch

These older or strategically important items appear to deserve maintainer attention:

1. **`filesystem` table function PR** — open since 2023 and still active; potentially valuable, but long-lived enough to suggest design/review drag.  
   [PR #53610](https://github.com/ClickHouse/ClickHouse/pull/53610)

2. **Keeper TTL support** — open since 2023; useful parity feature with ZooKeeper.  
   [Issue #55595](https://github.com/ClickHouse/ClickHouse/issues/55595)

3. **Improve `system.clusters` performance** — large-cluster metadata performance remains a practical operator issue.  
   [Issue #79300](https://github.com/ClickHouse/ClickHouse/issues/79300)

4. **S3Queue `StartAfter` optimization** — open since late 2025 and tied to direct cloud cost reduction.  
   [Issue #91522](https://github.com/ClickHouse/ClickHouse/issues/91522)

5. **Source filter grants for REMOTE and more source types** — increasingly important for governance and secure federation use cases.  
   [Issue #95555](https://github.com/ClickHouse/ClickHouse/issues/95555)

## Overall Health Assessment

ClickHouse’s project health today looks **strong but intense**: maintainers are moving quickly on bug closures, crash remediation, and CI/fuzzing improvements, which is exactly what a performance-critical analytical database should prioritize. The biggest caution flags are **production regressions in 26.2**, **lakehouse-format crash paths**, and **new query-engine edge cases introduced by ongoing planner/analyzer evolution**. Still, the responsiveness shown by active fix PRs, backports, and expanded fuzz coverage suggests a project that is actively containing risk while continuing to broaden its analytical engine capabilities.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-17

## 1. Today's Overview

DuckDB showed high development velocity over the last 24 hours, with **14 issues updated** and **36 pull requests updated**, indicating an active stabilization and optimization cycle around the 1.5 series. The dominant theme is **post-1.5 regression handling**, especially around **optimizer rewrites, S3/hive-partitioned Parquet access, streaming query behavior, and execution correctness**. Maintainers and contributors are responding quickly: several bug reports already have linked or clearly corresponding fix PRs, and a few issues are marked **under review**, **fixed on nightly**, or closed. Overall project health looks strong in terms of responsiveness, but there is a notable concentration of **performance regressions and correctness bugs introduced or exposed in 1.5.0**.

## 3. Project Progress

No new release was published today.

Merged/closed PR activity suggests progress in **engine correctness, WAL/storage reliability, and pipeline execution stability**:

- [PR #21397](https://github.com/duckdb/duckdb/pull/21397) **closed**: fixes row group ID handling in `ValidityColumnData::UpdateWithBase`, preventing `row_id out of range` during **WAL replay of updates** on later row groups. This is a storage durability/correctness improvement.
- [PR #21403](https://github.com/duckdb/duckdb/pull/21403) **closed** and superseded by [PR #21405](https://github.com/duckdb/duckdb/pull/21405): addresses a pipeline flushing bug where operators returning `FINISHED` could leave buffered output unflushed. This points to work on **execution engine completion semantics**.
- [PR #21398](https://github.com/duckdb/duckdb/pull/21398) **closed**: adds regression coverage for an earlier fix, showing continued investment in **test hardening** across maintained branches.
- [PR #21355](https://github.com/duckdb/duckdb/pull/21355) **closed**: branch merge / CI maintenance, indicating ongoing effort to keep nightly and mainline healthy.

Open PRs also show meaningful forward movement in engine internals:

- [PR #21413](https://github.com/duckdb/duckdb/pull/21413): adds **ANTI IEJoin predicates**, extending non-equi join execution capabilities.
- [PR #21375](https://github.com/duckdb/duckdb/pull/21375): adds **row group skipping for MAP columns in the Parquet reader**, a useful storage/read-path optimization.
- [PR #21171](https://github.com/duckdb/duckdb/pull/21171): makes some **multi-statements and PRAGMAs transactional**, relevant for reliability of operations like `COPY FROM DATABASE`.

## 4. Community Hot Topics

### 1) S3 + Hive partition regressions in 1.5
- [Issue #21348](https://github.com/duckdb/duckdb/issues/21348) — `QUALIFY ROW_NUMBER() OVER (...) = 1` causes ~50x more S3 requests in 1.5.0
- [Issue #21347](https://github.com/duckdb/duckdb/issues/21347) — Hive partition filters discover all files before pruning in 1.5.0
- [PR #21408](https://github.com/duckdb/duckdb/pull/21408) — skip top_n_window_elimination when struct-pack has no late materialization
- [PR #18518](https://github.com/duckdb/duckdb/pull/18518) — Push Hive filtering into `Glob()`

These are the clearest hot topic today. Users are reporting that optimizer changes in 1.5 can turn efficient remote scans into **massively amplified S3 request patterns**, which directly affects both latency and cloud cost. The technical need is clear: DuckDB users want optimizer transformations to remain **storage-aware**, especially when scanning remote Parquet over S3 and when hive partition pruning should happen before broad file discovery.

### 2) ADBC streaming/concurrency regression
- [Issue #21384](https://github.com/duckdb/duckdb/issues/21384) — ADBC `stream.get_next()` fails with interleaved queries since DuckDB 1.5
- [PR #21415](https://github.com/duckdb/duckdb/pull/21415) — support concurrent statements on the same connection

This reflects ecosystem pressure from Arrow/ADBC users who rely on **multiple active statements per connection**. In 1.5, result streaming improved execution behavior, but exposed a connection-level constraint that breaks prior expectations. The underlying need is compatibility with client libraries that assume materialized or independently consumable result streams.

### 3) Window/top-N optimizer correctness
- [PR #21388](https://github.com/duckdb/duckdb/pull/21388) — fix incorrect column binding in TopN window elimination with multi-column `PARTITION BY`
- [Issue #21367](https://github.com/duckdb/duckdb/issues/21367) — `min/max ... PARTITION BY` causing serialization-related error
- [PR #21391](https://github.com/duckdb/duckdb/pull/21391) — fix window self-join optimizer when plan copy fails

A lot of current churn is centered on **window-function rewrites**. DuckDB is pursuing aggressive optimizations such as transforming `ROW_NUMBER() = 1` patterns into more efficient plans, but the reports show edge cases around **binding, serialization, late materialization, and external scans like Pandas**. Community demand here is not for new syntax, but for optimizer sophistication without regressions.

### 4) Reliability of database copy / transactional bulk operations
- [Issue #21392](https://github.com/duckdb/duckdb/issues/21392) — `COPY FROM DATABASE one TO two` crashes on DuckDB v1.5.0
- [PR #21171](https://github.com/duckdb/duckdb/pull/21171) — Make some MultiStatements and PRAGMAs Transactional

This signals production users depending on DuckDB for **database cloning, migration, and administrative workflows**. Stability of bulk copy commands matters as databases become larger and more operationally important.

## 5. Bugs & Stability

Ranked by likely severity and user impact:

### Critical / High

1. **Potential index corruption / internal errors after UPDATE + CREATE INDEX + DELETE**
   - [Issue #21394](https://github.com/duckdb/duckdb/issues/21394)
   - Reports include `"Failed to delete all rows from index"`, `"UNIQUE constraint violation"`, and `"Corrupted ART index"`.
   - Severity is high because this suggests **state inconsistency in indexed tables**, not just planner failure.
   - No linked fix PR visible yet.

2. **`COPY FROM DATABASE ... TO ...` crash in 1.5.0**
   - [Issue #21392](https://github.com/duckdb/duckdb/issues/21392)
   - Marked **fixed on nightly**.
   - Likely related to transactional/PRAGMA execution paths; [PR #21171](https://github.com/duckdb/duckdb/pull/21171) is relevant context.
   - High severity for operational users doing backup/migration workflows.

3. **S3 request explosion and remote-scan performance regression**
   - [Issue #21348](https://github.com/duckdb/duckdb/issues/21348)
   - Potential fix direction in [PR #21408](https://github.com/duckdb/duckdb/pull/21408)
   - High severity for cloud analytics workloads because it increases **runtime and object-store request cost** dramatically.

4. **Hive partition pruning regression in 1.5.0**
   - [Issue #21347](https://github.com/duckdb/duckdb/issues/21347)
   - Related older/open work: [PR #18518](https://github.com/duckdb/duckdb/pull/18518)
   - High severity for data lake users querying partitioned Parquet on object stores.

### Medium

5. **ADBC interleaved query streaming failure**
   - [Issue #21384](https://github.com/duckdb/duckdb/issues/21384)
   - Direct fix proposed in [PR #21415](https://github.com/duckdb/duckdb/pull/21415)
   - Medium-to-high severity for connector/library integrators.

6. **LEFT JOIN to subquery NULL-filter regression since v1.5**
   - [Issue #21407](https://github.com/duckdb/duckdb/issues/21407)
   - Appears to be a **query correctness regression**, which is always important; impact depends on reproducibility breadth.
   - No fix PR visible yet.

7. **Timestamp conversion behaves differently in `WHERE` than `SELECT`**
   - [Issue #20708](https://github.com/duckdb/duckdb/issues/20708)
   - Long-lived correctness issue involving expression/binding/cast behavior.
   - Still open and under active update.

8. **Window aggregate + PandasScan serialization failure**
   - [Issue #21367](https://github.com/duckdb/duckdb/issues/21367)
   - Fix proposed in [PR #21391](https://github.com/duckdb/duckdb/pull/21391)
   - Medium severity; affects Python/Pandas-heavy users.

9. **ETag mismatch false positive in `read_parquet()`**
   - [Issue #21401](https://github.com/duckdb/duckdb/issues/21401)
   - Important for S3-compatible storage interoperability.
   - Appears to be a normalization/quoting bug rather than true object mutation detection.

### Lower / Platform-specific

10. **SIGILL in SQLite testcase on FreeBSD**
    - [Issue #21262](https://github.com/duckdb/duckdb/issues/21262)
    - Serious for affected platform maintainers, but likely narrower in impact.

11. **Grammar generator keyword sorting bug**
    - [Issue #21400](https://github.com/duckdb/duckdb/issues/21400)
    - Developer tooling/codegen issue rather than end-user runtime defect.

12. **Build with certain `BUILD_EXTENSIONS` produced unusable binary**
    - [Issue #21402](https://github.com/duckdb/duckdb/issues/21402)
    - Closed quickly, suggesting either resolution or invalidation.
    - Relevant for downstream packagers and custom builders.

13. **Regression in unnest with joins**
    - [Issue #21322](https://github.com/duckdb/duckdb/issues/21322)
    - Closed, implying a rapid response to a SQL execution regression.

## 6. Feature Requests & Roadmap Signals

There are fewer pure feature requests than bugfixes today, but several PRs hint at near-term roadmap priorities:

- [PR #21406](https://github.com/duckdb/duckdb/pull/21406) / [PR #21410](https://github.com/duckdb/duckdb/pull/21410) — **Lance extension**
  - Strong signal that DuckDB continues expanding support for modern analytical/storage formats and vector/data-lake interoperability.
  - This is a likely candidate for near-future inclusion if review stabilizes.

- [PR #21375](https://github.com/duckdb/duckdb/pull/21375) — **Parquet row group skipping for MAP columns**
  - Not a user-facing SQL feature, but an important read-path optimization likely to land soon because it improves common Parquet workloads without syntax changes.

- [PR #21413](https://github.com/duckdb/duckdb/pull/21413) — **ANTI IEJoin predicates**
  - Signals continued investment in advanced join execution for analytical queries with inequality predicates.

- [PR #20938](https://github.com/duckdb/duckdb/pull/20938) — `allowed_configs` for `lock_configurations`
  - A roadmap signal toward stronger **embedded deployment controls and security hardening**.

Most likely to appear in the next patch/minor update:
1. fixes for **ADBC concurrent streaming**,
2. fixes or mitigations for **TopN/window optimizer regressions**,
3. additional **S3/hive pruning optimizations or guardrails**,
4. the **`COPY FROM DATABASE` crash fix** already marked nightly-fixed.

## 7. User Feedback Summary

Current user feedback clusters around a few concrete operational pain points:

- **Cloud/data lake users** are sensitive to hidden performance regressions that multiply S3 requests and file listings. The feedback is not just “query slower,” but specifically that optimizer behavior is changing **remote IO patterns and cost**.
- **Connector/integration users** expect backward-compatible behavior from ADBC and Arrow-based consumers. The shift from materialized to streamed results in 1.5 surfaced assumptions that matter in real client applications.
- **Python/Pandas users** continue to hit planner/optimizer edge cases when logical plans involve non-serializable scans such as `PandasScan`.
- **Operational users** rely on commands like `COPY FROM DATABASE` and expect transactional safety and crash-free execution for migration and replication-style workflows.
- **SQL correctness regressions** remain especially visible: users quickly report cases where 1.4.4 worked and 1.5.0 changed semantics or error behavior, suggesting the community is actively regression-testing upgrades.

The positive signal is that many reports are high-quality, reduced repros, and maintainers/contributors are turning around candidate fixes quickly.

## 8. Backlog Watch

Items that appear important and may need maintainer attention due to age, breadth, or strategic relevance:

- [PR #18518](https://github.com/duckdb/duckdb/pull/18518) — **Push Hive filtering into `Glob()`**
  - Open since 2025-08-06.
  - Especially relevant now because current S3/hive regression reports make this work strategically important.

- [Issue #20708](https://github.com/duckdb/duckdb/issues/20708) — timestamp conversion inconsistency in `WHERE`
  - Open since 2026-01-28.
  - Query correctness issue that has lingered longer than many recent regressions.

- [PR #20938](https://github.com/duckdb/duckdb/pull/20938) — `allowed_configs` with `lock_configurations`
  - Marked ready to merge but still open.
  - Looks useful for production embedding/security use cases.

- [PR #21171](https://github.com/duckdb/duckdb/pull/21171) — transactional multi-statements and PRAGMAs
  - Important reliability improvement, especially in light of current `COPY FROM DATABASE` issues.

- [Issue #21262](https://github.com/duckdb/duckdb/issues/21262) — FreeBSD SIGILL
  - Platform-specific, but build/test stability on downstream OSes often needs explicit maintainer follow-up.

---

## Overall Assessment

DuckDB is in a **high-activity stabilization phase** after 1.5.0. The project remains healthy and highly responsive, with rapid PR creation for newly reported regressions, but the current issue mix shows meaningful pressure on **optimizer correctness, remote Parquet/S3 efficiency, and connector compatibility**. For users evaluating upgrade readiness, the strongest caution areas today are **S3/hive-partitioned workloads, advanced window-query rewrites, and certain operational/database-copy paths**. For contributors and maintainers, the clearest near-term priority is to land patch-level fixes that preserve 1.5 performance gains without sacrificing correctness or cloud efficiency.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-17

## 1. Today's Overview

StarRocks remained highly active over the last 24 hours, with **36 issues updated** and **104 pull requests updated**, indicating a strong ongoing engineering and maintenance cadence. The PR stream is especially busy, but a notable share of visible activity today is around **documentation cleanup, backports, and branch maintenance**, rather than headline feature landings. On the engineering side, there are still meaningful signals in **compaction strategy, Iceberg connector pushdown, tablet statistics correctness, optimizer hint handling, and Lake table auto-partition robustness**. Overall project health looks solid, though the issue queue continues to surface persistent user pain around **metadata HA, materialized views, compaction behavior, external lakehouse compatibility, and SQL feature completeness**.

## 2. Project Progress

### Merged/closed PRs today: notable advances

Although there were **no new releases**, several merged/closed PRs advanced quality, portability, and documentation accuracy.

#### Documentation correctness around Arrow Flight
- [#70344](https://github.com/StarRocks/starrocks/pull/70344) — **[Doc] Remove Session Level Arrow Flight Proxy**
- Backports opened:
  - [#70345](https://github.com/StarRocks/starrocks/pull/70345)
  - [#70346](https://github.com/StarRocks/starrocks/pull/70346)
  - [#70347](https://github.com/StarRocks/starrocks/pull/70347)

This is important because it corrects misleading operational guidance: docs had implied users could enable Arrow Flight proxy behavior with a session variable, but that statement was unsupported. For users integrating BI tools or Arrow Flight SQL clients, this reduces configuration ambiguity and suggests the team is tightening the contract between documented and actual behavior.

#### Cross-platform portability improvements
- [#70336](https://github.com/StarRocks/starrocks/pull/70336) — **Fix JSON portability on macOS**
- [#70335](https://github.com/StarRocks/starrocks/pull/70335) — **Fix macOS portability in ORC module**

These are not major user-facing features, but they improve developer ergonomics and CI reliability, especially for contributors building StarRocks on macOS. That matters for open-source sustainability and for users validating connector/file-format code locally.

#### Documentation cleanup and dependency-related maintenance
- [#69823](https://github.com/StarRocks/starrocks/pull/69823) — **[Doc] Remove comments**
- Backport:
  - [#69925](https://github.com/StarRocks/starrocks/pull/69925)
- [#69887](https://github.com/StarRocks/starrocks/pull/69887) — **[Doc] fix Dependabot issues**
- Backports:
  - [#69927](https://github.com/StarRocks/starrocks/pull/69927)
  - [#69928](https://github.com/StarRocks/starrocks/pull/69928)
  - [#69929](https://github.com/StarRocks/starrocks/pull/69929)
  - [#69930](https://github.com/StarRocks/starrocks/pull/69930)

This cluster of doc work shows active version-line stewardship across **3.4 / 3.5 / 4.0 / 4.1**, a positive signal for users operating mixed-version fleets.

### Open PRs worth watching
A few open PRs are more strategically significant than the merged ones today:

- [#70162](https://github.com/StarRocks/starrocks/pull/70162) — **Add range-split parallel compaction for non-overlapping output**  
  Strong storage-engine significance: this could improve compaction parallelism and produce cleaner non-overlapping rowsets for lake/shared-data scenarios.

- [#70322](https://github.com/StarRocks/starrocks/pull/70322) — **Fix auto partition creation failure when schema change is in FINISHED_REWRITING**  
  Important correctness/availability fix for Lake tables under concurrent schema evolution.

- [#70340](https://github.com/StarRocks/starrocks/pull/70340) — **Adjust tablet stat data_size by live rows**  
  Improves observability and stats accuracy for PK tablets before compaction by accounting for delete vectors.

- [#70341](https://github.com/StarRocks/starrocks/pull/70341) — **Handle WindowSkewHint in OptExpressionDuplicator**  
  Optimizer correctness fix; likely relevant for complex analytical workloads with skew hints.

- [#70293](https://github.com/StarRocks/starrocks/pull/70293) — **Support partial pushdown for AND compound predicates in Iceberg connector**  
  A meaningful connector/query performance enhancement that should improve predicate pruning in Iceberg-backed scans.

- [#70343](https://github.com/StarRocks/starrocks/pull/70343) — **Propagate aws.s3.iam_role_arn to REST catalog SigV4 signer**  
  Important for enterprise Iceberg REST catalog deployments on AWS.

## 3. Community Hot Topics

Below are the most active issues and PR-adjacent topics by comments/reactions, with the likely technical need behind each.

### 1) Arrow Flight external client support
- [Issue #65359](https://github.com/StarRocks/starrocks/issues/65359) — **Add arrow_flight_advertise_host to support external Arrow Flight SQL clients**  
  Comments: 6, 👍 7

This is the clearest high-signal topic today. Users running StarRocks in Kubernetes or behind internal networking need Arrow Flight to advertise an externally reachable hostname, not an internal pod/service address. The related doc cleanup around Arrow Flight makes this even more relevant: the community wants **production-ready Flight SQL connectivity semantics**, especially for external BI/SQL clients and cloud-native deployments.

### 2) Sorting and execution-engine optimization
- [Issue #62605](https://github.com/StarRocks/starrocks/issues/62605) — **Sorting improvements**  
  Comments: 6

Even though this stale issue was closed, the underlying topic remains important: sort execution cost, incremental sort opportunities, and internal sort implementation quality are recurring concerns in OLAP systems. Combined with historical requests like incremental sort support, this signals ongoing demand for **more adaptive and less expensive ORDER BY execution**.

### 3) Metadata high availability for Kubernetes/cloud-native use
- [Issue #62005](https://github.com/StarRocks/starrocks/issues/62005) — **Use SQL database to store StarRocks meta**  
  Comments: 5, 👍 3

This is a strategic roadmap signal rather than a tactical feature request. Users want FE metadata to move beyond local filesystem dependence, especially in Kubernetes, where persistent metadata management and HA are operationally complex. The deeper technical need is **control-plane resilience and easier cloud-native operations**.

### 4) Compaction and system-table growth pathologies
- [Issue #62202](https://github.com/StarRocks/starrocks/issues/62202) — **loads_history rowset not merged / compaction issue**  
  Comments: 5
- [Issue #62245](https://github.com/StarRocks/starrocks/issues/62245) — **PRIMARY KEY stream load _apply_compaction_commit error: set cached delvec failed**  
  Comments: 4

These indicate continued operator concern around compaction correctness, especially for PK tables and internal/system tables. Given the active PR on range-split parallel compaction, there is a clear theme: users need **more predictable compaction under sustained ingest**, especially where delete vectors and version buildup interact.

### 5) Query engine federation / external table compatibility
- [Issue #53950](https://github.com/StarRocks/starrocks/issues/53950) — **Support Query ClickHouse AggregatingMergeTree Engine Table**  
  Comments: 4

This reflects a common modern analytics architecture: StarRocks as a unified query engine over heterogeneous systems. The user need is not just connector breadth, but **semantic compatibility with upstream engine-specific table models**.

### 6) SQL parser reuse and dialect exposure
- [Issue #63021](https://github.com/StarRocks/starrocks/issues/63021) — **can i find sql parser as ast about golang language????**  
  Comments: 3

This suggests interest in StarRocks SQL grammar/parsing beyond the server itself, likely for gateways, validation layers, or governance tooling. It’s a sign the ecosystem may want **parser libraries, AST tooling, or better SQL dialect documentation**.

## 4. Bugs & Stability

Ranked by likely operational severity based on the descriptions.

### High severity

#### 1) PK table compaction / delete-vector failure during stream load
- [Issue #62245](https://github.com/StarRocks/starrocks/issues/62245) — **Stream Load to PRIMARY KEY table: _apply_compaction_commit error: set cached delvec failed**

This looks serious for write-heavy production workloads using PK tables. It suggests failures during compaction commit with cached delete vectors, which can affect ingestion continuity and storage health.  
**Related fix activity:** not directly linked in the provided data, but nearby PRs indicate relevant areas:
- [#70340](https://github.com/StarRocks/starrocks/pull/70340) — tablet stats reflect delete vectors
- [#70162](https://github.com/StarRocks/starrocks/pull/70162) — parallel compaction redesign

#### 2) No queryable replica found despite NORMAL state
- [Issue #63026](https://github.com/StarRocks/starrocks/issues/63026) — **No queryable replica found due to version mismatch between minReadableVersion and visibleVersion**

This is a potentially severe query-availability issue because it can produce scan failures even when replicas appear healthy. It points to metadata/version-state inconsistency that can be difficult for operators to diagnose.  
**Fix PR visible today:** none directly linked.

#### 3) Auto partition creation failure during schema change state transitions
- [PR #70322](https://github.com/StarRocks/starrocks/pull/70322) — **Fix auto partition creation failure when schema change is in FINISHED_REWRITING**

Even though surfaced as a PR instead of an issue in this dataset, this is a meaningful stability item. It addresses a concurrency edge case in Lake tables where partition automation collides with schema change lifecycle state.

### Medium severity

#### 4) Materialized view refresh failures or pathological refresh behavior
- [Issue #62534](https://github.com/StarRocks/starrocks/issues/62534) — **Materialized View refresh taking too much time to finish**
- [Issue #62467](https://github.com/StarRocks/starrocks/issues/62467) — **MV refresh fails when BE count drops from 3 to 2**
- [Issue #62659](https://github.com/StarRocks/starrocks/issues/62659) — **Async MV replace/alter syntax problems**

These point to both correctness and operability concerns in MVs: refresh loops, tablet proliferation, replica-count sensitivity, and syntax inconsistencies. MVs remain one of the most operationally sensitive areas for analytical engines, and StarRocks users are clearly stressing them in production.

#### 5) Internal/system tables causing compaction pressure
- [Issue #62202](https://github.com/StarRocks/starrocks/issues/62202) — **loads_history rowsets not merging**

This is notable because system tables themselves may contribute to storage pressure and version accumulation, eventually affecting writes. That’s a reliability concern beyond ordinary user-table bugs.

#### 6) External catalog compatibility bugs
- [Issue #62999](https://github.com/StarRocks/starrocks/issues/62999) — **StarRocks 3.3 can't read Paimon 0.6 append table without bucket-key**
- [Issue #62646](https://github.com/StarRocks/starrocks/issues/62646) — **HMS on Azure ADLS Gen2 ClassNotFoundException**

These are important for lakehouse interoperability but likely narrower in blast radius than storage/replica bugs.

### Low severity / developer-facing

#### 7) macOS portability issues
- [PR #70335](https://github.com/StarRocks/starrocks/pull/70335)
- [PR #70336](https://github.com/StarRocks/starrocks/pull/70336)

Fixed promptly; mainly impacts local development and test environments.

## 5. Feature Requests & Roadmap Signals

Several user requests stand out as likely roadmap indicators.

### Strong signals

#### Arrow Flight production-readiness
- [Issue #65359](https://github.com/StarRocks/starrocks/issues/65359) — **Add arrow_flight_advertise_host**
- Docs correction:
  - [#70344](https://github.com/StarRocks/starrocks/pull/70344)

Given both issue traction and adjacent doc work, Arrow Flight connectivity looks like an actively evolving area. This has a good chance of landing in the **next 4.1.x line** if implementation is already underway.

#### Iceberg MV partitioning support for bucket transforms
- [Issue #69350](https://github.com/StarRocks/starrocks/issues/69350) — **Support Iceberg Bucket expression in MV Partition**

This is a high-value lakehouse integration feature. As Iceberg deployments grow larger and more transform-heavy, StarRocks needs partition semantics that align with upstream table design.

#### MERGE INTO semantics for Iceberg
- [Issue #62881](https://github.com/StarRocks/starrocks/issues/62881) — **MERGE INTO**

This is strategically important but likely larger in scope. Full Spark-like semantics (`WHEN MATCHED`, `WHEN NOT MATCHED BY SOURCE/TARGET`) would materially improve write-back and CDC-style use cases. More likely a **medium-term roadmap item** than an immediate patch release feature.

#### SQL-backed metadata store
- [Issue #62005](https://github.com/StarRocks/starrocks/issues/62005) — **Use SQL database to store StarRocks meta**

This is architecturally significant and would affect FE metadata durability and HA. It feels more like a long-horizon design discussion than a near-term release candidate.

### Ongoing SQL language completeness signals

- [Issue #62662](https://github.com/StarRocks/starrocks/issues/62662) — **generate_series for timestamp**
- [Issue #62633](https://github.com/StarRocks/starrocks/issues/62633) — **Support ROWS / RANGE frame clauses in window functions**
- [Issue #62536](https://github.com/StarRocks/starrocks/issues/62536) — **Window over array values**
- [Issue #62482](https://github.com/StarRocks/starrocks/issues/62482) — **DISTRIBUTED BY expressions**
- [Issue #62511](https://github.com/StarRocks/starrocks/issues/62511) — **ORDER BY expression in CREATE TABLE**
- [Issue #62559](https://github.com/StarRocks/starrocks/issues/62559) — **Incremental Sort**
- [Issue #63030](https://github.com/StarRocks/starrocks/issues/63030) — **TopN runtime filter pushdown**

These requests collectively show demand for better **PostgreSQL-style SQL completeness**, richer physical design syntax, and optimizer/runtime sophistication.

### Federation and connector expansion

- [Issue #53950](https://github.com/StarRocks/starrocks/issues/53950) — **ClickHouse AggregatingMergeTree support**
- [PR #70293](https://github.com/StarRocks/starrocks/pull/70293) — **Partial predicate pushdown for Iceberg**
- [PR #70343](https://github.com/StarRocks/starrocks/pull/70343) — **IAM role propagation for REST catalog SigV4 signer**

This area appears especially active. Of these, **Iceberg connector improvements** are the most likely near-term deliverables.

## 6. User Feedback Summary

User feedback today clusters around a few recurring production themes:

### 1) Cloud-native deployment friction
Users deploying in Kubernetes want easier external connectivity and better control-plane durability:
- [#65359](https://github.com/StarRocks/starrocks/issues/65359) — Arrow Flight advertised host
- [#62005](https://github.com/StarRocks/starrocks/issues/62005) — SQL metadata store

This suggests StarRocks is increasingly used in cloud-native settings where internal-vs-external addressing and metadata HA are no longer edge cases.

### 2) Heavy-ingest storage behavior remains a top concern
Compaction, rowset growth, delete vectors, and version pressure continue to show up in real user reports:
- [#62202](https://github.com/StarRocks/starrocks/issues/62202)
- [#62245](https://github.com/StarRocks/starrocks/issues/62245)
- [#70162](https://github.com/StarRocks/starrocks/pull/70162)
- [#70340](https://github.com/StarRocks/starrocks/pull/70340)

This indicates users value StarRocks’ ingest performance, but still need more predictability under sustained update/delete-heavy workloads.

### 3) Materialized views are valuable, but operationally delicate
Multiple issues point to MVs being heavily used, yet still a source of refresh complexity and syntax confusion:
- [#62534](https://github.com/StarRocks/starrocks/issues/62534)
- [#62467](https://github.com/StarRocks/starrocks/issues/62467)
- [#62659](https://github.com/StarRocks/starrocks/issues/62659)

The feedback is not “users don’t want MVs”; rather, they want **more reliable and explainable MV lifecycle behavior**.

### 4) StarRocks is increasingly used as a federated query layer
Users want StarRocks to sit over Iceberg, ClickHouse, Hive, Paimon, and REST catalogs with minimal semantic mismatch:
- [#53950](https://github.com/StarRocks/starrocks/issues/53950)
- [#62999](https://github.com/StarRocks/starrocks/issues/62999)
- [#62646](https://github.com/StarRocks/starrocks/issues/62646)
- [#69350](https://github.com/StarRocks/starrocks/issues/69350)
- [#70343](https://github.com/StarRocks/starrocks/pull/70343)
- [#70293](https://github.com/StarRocks/starrocks/pull/70293)

That is a positive adoption signal, but also raises the bar for connector quality and SQL compatibility.

## 7. Backlog Watch

These look important and deserving of maintainer attention due to impact, age, or strategic significance.

### High-priority backlog candidates

#### [#62005](https://github.com/StarRocks/starrocks/issues/62005) — Use SQL database to store StarRocks meta
A major architectural topic with real operator pain behind it. Even if not actionable soon, a design-position response from maintainers would help users plan.

#### [#65359](https://github.com/StarRocks/starrocks/issues/65359) — Add arrow_flight_advertise_host
High reaction count and directly tied to real deployment usability. Given related doc corrections, this deserves visible product direction.

#### [#62245](https://github.com/StarRocks/starrocks/issues/62245) — PK table compaction commit / delvec failure
Operationally important and likely production-blocking for some users.

#### [#63026](https://github.com/StarRocks/starrocks/issues/63026) — No queryable replica found despite NORMAL replicas
Potentially severe query availability issue; should be triaged with clear reproduction or diagnostics guidance.

#### [#69350](https://github.com/StarRocks/starrocks/issues/69350) — Iceberg bucket expression in MV partition
Strategic for larger Iceberg users; worth prioritizing if StarRocks wants to deepen lakehouse-native MV workflows.

### Older but still relevant ecosystem/functionality gaps

#### [#53950](https://github.com/StarRocks/starrocks/issues/53950) — Query ClickHouse AggregatingMergeTree tables
Important if StarRocks continues positioning as a universal analytics layer.

#### [#62881](https://github.com/StarRocks/starrocks/issues/62881) — MERGE INTO
A strong enterprise SQL compatibility ask, especially for data lake mutation workflows.

#### [#63030](https://github.com/StarRocks/starrocks/issues/63030) — TopN runtime filter pushdown
Could materially improve query efficiency and fits broader optimizer/runtime pushdown work.

---

## Overall Health Assessment

StarRocks looks **healthy and actively maintained**, with strong branch hygiene and meaningful ongoing work in storage internals, optimizer correctness, and lakehouse interoperability. The main caution is that the **issue stream still reflects recurring production pain in compaction, MV operations, metadata HA, and external-system compatibility**. In short: engineering velocity is good, but users are signaling that the next layer of value will come less from surface-level features and more from **operational robustness, cloud-native ergonomics, and deeper semantic compatibility across the modern data stack**.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-17

## 1. Today’s Overview

Apache Iceberg had another highly active day, with **14 issues** and **50 pull requests** updated in the last 24 hours, indicating strong ongoing maintainer and contributor engagement. Activity was concentrated around **Spark correctness fixes, Kafka Connect behavior, metadata/file-change APIs, and storage-path migration safety**. No new release was cut today, but several merged fixes suggest continued stabilization work on the **1.10 line** as well as ongoing development on `main`. Overall, project health looks solid: there is steady throughput on bug fixes and backports, while new roadmap signals point to deeper metadata APIs and connector extensibility.

---

## 2. Project Progress

### Merged/closed PRs today

#### Spark query correctness
- **Spark: Fix aggregate pushdown with NaN values** — merged via [PR #15070](https://github.com/apache/iceberg/pull/15070), closing [Issue #15069](https://github.com/apache/iceberg/issues/15069)  
  This is a meaningful correctness fix. Aggregate pushdown produced incorrect results when columns contained `NaN`, and the merged change aligns behavior with Iceberg spec ordering semantics. This improves trust in Spark query optimization for statistical/analytical workloads involving floating-point edge cases.

#### Storage migration / path rewrite safety
- **Core: Fix rewriting delete manifests in `RewriteTablePathUtil`** — merged via [PR #15155](https://github.com/apache/iceberg/pull/15155), closing [Issue #12772](https://github.com/apache/iceberg/issues/12772)  
  This advances migration safety for **MoR tables** by correctly handling delete manifests during `rewrite_table_path`. It is particularly relevant for users relocating table storage or performing cross-environment migrations.

#### JDBC catalog stability
- **Fix JDBC resource leaks in `JdbcCatalog` and `JdbcUtil`** — merged via [PR #15463](https://github.com/apache/iceberg/pull/15463), closing [Issue #15462](https://github.com/apache/iceberg/issues/15462)  
  This addresses leaked `ResultSet` and `PreparedStatement` objects through proper try-with-resources handling. It improves long-running catalog reliability, especially for deployments with heavy metadata traffic or connection pool constraints.

#### Spark API cleanup
- **Spark: Deprecate constructor with branch in `SparkReadConf` / `SparkWriteConf`** — closed via [PR #15591](https://github.com/apache/iceberg/pull/15591)  
  This is API hygiene rather than a user-facing feature, but it reduces confusion in Spark integration by removing an unused parameter path.

#### Site/compliance maintenance
- **Site: add back privacy plugin** — closed via [PR #15657](https://github.com/apache/iceberg/pull/15657)  
  This is project infrastructure work, restoring a privacy-related plugin for documentation compliance.

#### Spark streaming planner work completed
- **Spark 4.1: New Async Spark Micro Batch Planner** — closed via [PR #15299](https://github.com/apache/iceberg/pull/15299)  
  This suggests progress toward more scalable structured streaming planning for Spark 4.1 users, although the digest data does not indicate whether this was merged today versus simply closed/updated.

### What advanced today
Across today’s merged/closed work, the strongest progress areas were:
- **Spark correctness and planner behavior**
- **Metadata/catalog resource safety**
- **Migration and delete-file handling**
- **Backport and branch-line stabilization signals for 1.10.x**

---

## 3. Community Hot Topics

### 1) Kafka Connect reliability under Glue failures
- [Issue #13752](https://github.com/apache/iceberg/issues/13752) — **26 comments**  
  **Topic:** Kafka Connect sink drops messages when Glue exceptions occur.  
  **Why it matters:** This is the most operationally important active issue in the current set. It points to a durability/reliability concern in a production ingestion path: metadata/catalog failures may be causing message loss rather than safe retry/backpressure behavior.  
  **Underlying technical need:** More robust failure handling in the Kafka Connect sink, especially around cloud-catalog transient errors and restart/recovery semantics.

### 2) Coordinator election visibility in Kafka Connect
- [Issue #12610](https://github.com/apache/iceberg/issues/12610) — **6 comments**
- Related open work: [PR #15208](https://github.com/apache/iceberg/pull/15208), [PR #15207](https://github.com/apache/iceberg/pull/15207)  
  **Topic:** Better logging and commit behavior in Kafka Connect during coordinator election and partition assignment churn.  
  **Why it matters:** Users are struggling to diagnose connector liveness and rebalance behavior.  
  **Underlying technical need:** Better observability, configurable committers, and more rebalance-tolerant connector operation.

### 3) Snapshot change APIs becoming a focal point
- [Issue #15659](https://github.com/apache/iceberg/issues/15659) — new
- [Issue #15660](https://github.com/apache/iceberg/issues/15660) — new
- [PR #15656](https://github.com/apache/iceberg/pull/15656) — open  
  **Topic:** `SnapshotChanges` should support both a **streaming interface** and **multiple snapshots**.  
  **Why it matters:** This is a strong roadmap signal that file-level change enumeration is becoming a first-class API surface for downstream tooling, CDC-style processing, and metadata-intensive workloads.  
  **Underlying technical need:** Lower-memory metadata traversal, improved parallelization, and a central replacement for deprecated snapshot file-access patterns.

### 4) Secondary index metadata exploration
- [PR #15658](https://github.com/apache/iceberg/pull/15658) — open
- [PR #15644](https://github.com/apache/iceberg/pull/15644) — closed  
  **Topic:** POC for secondary index metadata handling.  
  **Why it matters:** This is one of the clearest strategic signals in today’s PR set. It suggests Iceberg contributors are exploring richer metadata objects beyond table snapshots/manifests.  
  **Underlying technical need:** Faster selective access patterns, standardized index metadata management, and future interoperability around auxiliary indexing layers.

### 5) Kafka Connect + VARIANT support
- [PR #15283](https://github.com/apache/iceberg/pull/15283) — open  
  **Topic:** Convert arbitrary Java objects into Iceberg `VARIANT` in Kafka Connect.  
  **Why it matters:** Semi-structured ingestion remains a major adoption driver.  
  **Underlying technical need:** Better schema-flexible ingestion for event streams carrying nested maps/lists and mixed-type payloads.

---

## 4. Bugs & Stability

Ranked by likely severity/operational impact.

### High severity

#### 1) Potential message loss in Kafka Connect on Glue exceptions
- [Issue #13752](https://github.com/apache/iceberg/issues/13752) — open  
  **Risk:** Possible dropped messages during catalog failures/restarts.  
  **Impact area:** Streaming ingestion reliability, data loss risk.  
  **Fix status:** No linked fix PR in today’s data.  
  **Assessment:** Highest-severity active issue in this digest.

#### 2) Spark aggregate pushdown incorrect with NaN
- [Issue #15069](https://github.com/apache/iceberg/issues/15069) — closed
- Fixed by [PR #15070](https://github.com/apache/iceberg/pull/15070)  
  **Risk:** Wrong query results.  
  **Impact area:** Analytical correctness in Spark.  
  **Assessment:** Serious correctness bug, now resolved.

### Medium severity

#### 3) JDBC resource leaks in catalog code
- [Issue #15462](https://github.com/apache/iceberg/issues/15462) — closed
- Fixed by [PR #15463](https://github.com/apache/iceberg/pull/15463)  
  **Risk:** Connection/cursor leaks, degraded service over time.  
  **Impact area:** Catalog stability for JDBC-backed deployments.  
  **Assessment:** Important operational fix, especially for persistent services.

#### 4) `rewrite_table_path` failed to create needed deleted files for MoR tables
- [Issue #12772](https://github.com/apache/iceberg/issues/12772) — closed
- Fixed by [PR #15155](https://github.com/apache/iceberg/pull/15155)  
  **Risk:** Incomplete or incorrect migration outcomes.  
  **Impact area:** Storage migration / maintenance workflows.  
  **Assessment:** Important but narrower in scope than Spark correctness or ingestion reliability.

#### 5) Avro read failure when row-lineage columns are not projected
- [Issue #15507](https://github.com/apache/iceberg/issues/15507) — closed  
  **Risk:** Reader failure for Avro files with row lineage metadata.  
  **Impact area:** Schema projection compatibility in Avro readers.  
  **Fix status:** Closed; no PR link shown in provided data.  
  **Assessment:** Relevant for V3/row lineage adopters.

### Lower severity / maintenance

#### 6) Docs missing V3 types
- [Issue #14874](https://github.com/apache/iceberg/issues/14874) — closed  
  Documentation gap rather than runtime instability, but notable because it reflects adoption pressure around newer V3 types such as geo, nanosecond timestamps, and variant.

#### 7) Historic stale issues closed
- [Issue #8863](https://github.com/apache/iceberg/issues/8863)
- [Issue #9689](https://github.com/apache/iceberg/issues/9689)
- [Issue #13937](https://github.com/apache/iceberg/issues/13937)  
  These were closed as stale. They do not indicate new regressions today, but they do hint at older unresolved edge cases in Spark/Parquet/Arrow memory behavior.

---

## 5. Feature Requests & Roadmap Signals

### Strong signals

#### SnapshotChanges API expansion
- [Issue #15659](https://github.com/apache/iceberg/issues/15659)
- [Issue #15660](https://github.com/apache/iceberg/issues/15660)
- [PR #15656](https://github.com/apache/iceberg/pull/15656)  
This looks likely to influence a near-term release. The work aligns with internal API cleanup and enables more scalable file-change processing. It has both practical value and architectural momentum.

#### Secondary index metadata
- [PR #15658](https://github.com/apache/iceberg/pull/15658)  
Still a POC, so less likely for immediate release, but strategically significant. Expect iterative design discussion before production inclusion.

#### Kafka Connect extensibility and resilience
- [PR #15207](https://github.com/apache/iceberg/pull/15207) — configurable committers
- [PR #15208](https://github.com/apache/iceberg/pull/15208) — tolerate no partition assignment
- [Issue #12610](https://github.com/apache/iceberg/issues/12610) — coordinator election logging  
These suggest continued investment in Kafka Connect as a serious ingestion surface, with emphasis on operator control and operational transparency.

#### VARIANT support in Kafka Connect
- [PR #15283](https://github.com/apache/iceberg/pull/15283)  
Given Iceberg’s direction around modern semi-structured types, this has a realistic chance of landing in an upcoming release if review proceeds.

#### Flink sink extensibility
- [PR #15316](https://github.com/apache/iceberg/pull/15316)  
This is a useful connector-platform enhancement and a good fit for future releases focused on ecosystem integration rather than just core table features.

### Likely next-version candidates
Based on maturity and alignment with current fixes, the most plausible near-term inclusions are:
1. **SnapshotChanges improvements**  
2. **Kafka Connect resilience/observability updates**  
3. **VARIANT ingestion support in Kafka Connect**  
4. **Selective backports on 1.10.x**, especially around delete vectors and commit-path behavior, e.g. [PR #15654](https://github.com/apache/iceberg/pull/15654)

---

## 6. User Feedback Summary

Today’s user feedback clusters around a few recurring pain points:

### 1) Streaming ingestion must fail safely, not silently
- [Issue #13752](https://github.com/apache/iceberg/issues/13752)  
Users running Kafka Connect in Kubernetes with Glue-backed catalogs are highlighting the need for **at-least-once durability under catalog instability**. This is a strong signal that production users care less about nominal throughput than about correctness under failure.

### 2) Observability is still insufficient in connectors
- [Issue #12610](https://github.com/apache/iceberg/issues/12610)  
Operators want clearer logging around elections, assignments, and connector state transitions. The feedback suggests troubleshooting distributed ingestion remains too opaque.

### 3) Memory-efficient metadata access is increasingly important
- [Issue #15659](https://github.com/apache/iceberg/issues/15659)
- [Issue #15660](https://github.com/apache/iceberg/issues/15660)  
Users and contributors are pushing for APIs that avoid eager in-memory materialization and support broader snapshot traversal. This reflects larger table sizes and more metadata-driven applications.

### 4) Query correctness still matters more than optimization
- [Issue #15069](https://github.com/apache/iceberg/issues/15069)  
The Spark NaN case is a reminder that users will quickly surface optimizer bugs when they affect result correctness, especially in statistical workloads.

### 5) Migration and maintenance operations remain a real-world concern
- [Issue #12772](https://github.com/apache/iceberg/issues/12772)
- [Issue #15612](https://github.com/apache/iceberg/issues/15612)  
Users are asking for safer migration workflows and Java SDK parity with Spark maintenance actions like orphan file cleanup. This reflects enterprise adoption patterns where not all operations run inside Spark.

---

## 7. Backlog Watch

These items appear to deserve maintainer attention due to impact, age, or strategic importance.

### High-priority open issues / PRs

#### Kafka Connect data-loss risk
- [Issue #13752](https://github.com/apache/iceberg/issues/13752)  
Open, heavily discussed, operationally serious. This should remain on the active watchlist until there is a clear mitigation or fix.

#### Coordinator election/logging for Kafka Connect
- [Issue #12610](https://github.com/apache/iceberg/issues/12610)  
Not as severe as #13752, but important for operability and likely linked to broader connector reliability concerns.

#### Long-running Kafka Connect enhancement work
- [PR #14797](https://github.com/apache/iceberg/pull/14797)  
Large-scope work around delta writer support, CDC/upsert modes, and DV usage. This looks strategically important but potentially review-heavy.

#### Flink sink extensibility
- [PR #15316](https://github.com/apache/iceberg/pull/15316)  
Valuable ecosystem work that may require architectural review to avoid downstream compatibility issues.

#### Kafka Connect configurability PRs marked stale
- [PR #15207](https://github.com/apache/iceberg/pull/15207)
- [PR #15208](https://github.com/apache/iceberg/pull/15208)  
These are still open but carry stale labels despite aligning with active user pain points. They may need maintainer triage to decide whether to merge, reshape, or close.

### Strategic but early-stage
- [PR #15658](https://github.com/apache/iceberg/pull/15658) — secondary index metadata POC  
Important conceptually, but likely needs design discussion before implementation solidifies.

### Maintenance parity gap
- [Issue #15612](https://github.com/apache/iceberg/issues/15612)  
Although closed as a question, it highlights a product gap: users want **Java SDK maintenance APIs** comparable to Spark actions.

---

## 8. Overall Health Assessment

Iceberg appears **healthy and actively maintained**, with a strong blend of bug fixing, backporting, connector work, and forward-looking metadata API evolution. The most notable quality signal today is that **multiple concrete bugs were closed with linked fixes**, including a Spark correctness issue and a JDBC stability issue. The biggest concern remains **Kafka Connect reliability under failure scenarios**, especially where cloud catalogs like Glue are involved. If maintainers continue addressing connector resilience and push through the current metadata API cleanup, the next release should further improve both operational robustness and developer ergonomics.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-17

## 1) Today’s Overview

Delta Lake showed **high PR activity but light issue volume** over the last 24 hours: **32 PRs updated**, **3 issues updated**, and **no new releases**. The activity pattern suggests the project is currently in a **heavy implementation and integration phase**, especially around **Kernel + Spark DSv2**, **streaming/CDC**, **catalog-managed table support**, and **server-side planning / Unity Catalog-related plumbing**. Closed work today was mostly focused on **correctness and defensive fixes** rather than headline features, which is a healthy sign for platform hardening. Overall, project health looks **active and forward-moving**, with notable concentration in architectural work rather than end-user release packaging.

## 3) Project Progress

### Merged/closed PRs today

#### 1. Reject collated StringType keys in MapType constructor
- PR: [#6291](https://github.com/delta-io/delta/pull/6291)
- Status: Closed
- Linked issue: [#5881](https://github.com/delta-io/delta/issues/5881)

This is a **protocol/spec compliance and schema-correctness fix** in Kernel. It prevents creation of `MapType` values with collated string keys, aligning Delta Kernel behavior with the Delta protocol and Spark semantics. This improves **cross-engine consistency** and avoids subtle interoperability problems where one writer permits schemas another engine rejects.

#### 2. Fix NullPointerException in `FieldMetadata.equals()` / `hashCode()`
- PR: [#6289](https://github.com/delta-io/delta/pull/6289)
- Status: Closed
- Related prior PR: [#5887](https://github.com/delta-io/delta/pull/5887)

This is a **stability and metadata correctness** improvement. NPEs in equality/hash code paths can surface in schema comparison, caching, planning, or test infrastructure, so closing this gap reduces fragility in Kernel metadata handling.

#### 3. Add warning logging in `fetchCatalogPrefix` exception handler
- PR: [#6273](https://github.com/delta-io/delta/pull/6273)
- Status: Closed

This is an **observability/debuggability enhancement**. Silent exception swallowing in catalog path resolution makes deployment troubleshooting difficult; adding warning logs should reduce diagnosis time in catalog integration scenarios.

#### 4. Fix potential NPE
- PR: [#6253](https://github.com/delta-io/delta/pull/6253)
- Status: Closed

Although the summary is brief, this appears to be another **defensive correctness fix** in Iceberg-related code paths. Together with #6289 and #6273, today’s closed PRs indicate a sustained push on **robustness around catalog/metadata interoperability**.

#### 5. Implement `SupportsReportPartitioning` in DSv2 SparkScan
- PR: [#6224](https://github.com/delta-io/delta/pull/6224)
- Status: Closed

This is the most important query-engine-facing closed item today. It adds **output partitioning reporting** to DSv2 `SparkScan`, enabling Spark to better exploit partition information for optimizations such as **shuffle reduction or elimination**, especially in joins and partition-aware planning. This is a meaningful step in Delta’s **DSv2 query engine integration maturity**.

#### 6. Add `In` filter pushdown to `ExpressionUtils`
- PR: [#6103](https://github.com/delta-io/delta/pull/6103)
- Status: Closed

This advances **predicate pushdown** support. Better handling of `IN` filters can improve read efficiency and planning quality, especially for selective lookups and analytical workloads with semi-discrete predicates.

### What this means technically

Today’s completed work advanced three themes:

- **SQL/query engine optimization**: DSv2 partition reporting and `IN` filter pushdown
- **Protocol/schema correctness**: MapType key collation enforcement
- **Operational stability**: multiple NPE fixes and better logging in catalog fallback paths

That combination points to a project improving both **performance plumbing** and **multi-engine correctness guarantees**.

## 4) Community Hot Topics

### 1. Protocol clarification for `add.modificationTime`
- Issue: [#6094](https://github.com/delta-io/delta/issues/6094)
- Status: Open
- Comments: 4

This is the most visibly discussed issue in the provided set. The request asks Delta maintainers to clarify the valid range and semantics of `add.modificationTime`, specifically whether **0 or negative values** are legal.  
**Underlying need:** users integrating with diverse environments need **precise protocol guarantees**, especially when nonstandard timestamps appear in manifests/logs. This is a classic interoperability concern: if protocol fields lack strict semantics, downstream readers, validators, and connectors may diverge.

### 2. Catalog-managed table metadata updates in Delta-Spark
- Issue: [#6296](https://github.com/delta-io/delta/issues/6296)
- Status: Open

This issue proposes removing the current blocker on metadata-modifying operations for **catalog-managed tables** once atomic metadata sync is available with the commit API.  
**Underlying need:** users want Delta-Spark V1 catalog-managed tables to support metadata evolution operations more naturally, including schema/property/partitioning changes. This is a strong **roadmap signal toward safer catalog-native table management**.

### 3. UC Commit Metrics transport wiring
- PR: [#6155](https://github.com/delta-io/delta/pull/6155)
- Status: Open

Even without comment counts, this appears strategically important. Adding transport wiring and smoke tests for **UC commit metrics** suggests a push toward **telemetry/observability around commits**, likely useful for managed deployments and operational monitoring.

### 4. Kernel-Spark streaming and CDC work
- PR: [#6076](https://github.com/delta-io/delta/pull/6076)
- Status: Open
- PR: [#6297](https://github.com/delta-io/delta/pull/6297)
- Status: Open
- PR: [#6249](https://github.com/delta-io/delta/pull/6249)
- Status: Open

These PRs collectively show intense work in **SparkMicroBatchStream**, including:
- incremental CDC support,
- resource leak prevention,
- `ignoreChanges` read-option support in DSv2.

**Underlying need:** users are pushing Delta’s **structured streaming and CDC semantics** in DSv2 paths, and need parity, efficiency, and reliability.

### 5. Server-side planning with OAuth / credential refresh
- PR: [#6292](https://github.com/delta-io/delta/pull/6292)
- PR: [#6295](https://github.com/delta-io/delta/pull/6295)

These indicate rising importance of **secure remote planning/catalog integration**, including token refresh and OAuth E2E validation.  
**Underlying need:** enterprise users want Delta to work cleanly in **managed catalog / remote planning** environments with production-grade auth flows.

## 5) Bugs & Stability

Ranked by likely severity and platform impact.

### High severity

#### A. Potential resource leak in `SparkMicroBatchStream`
- PR: [#6297](https://github.com/delta-io/delta/pull/6297)
- Status: Open

This is potentially the most serious currently active bug fix. The PR says `CommitActions` and underlying iterators/file handles were not closed on the happy path. In long-running streaming jobs, that can lead to **file handle leaks, degraded stability, and eventual job failures**.  
**Fix status:** active PR exists.

#### B. `FieldMetadata.equals()` / `hashCode()` NPE
- PR: [#6289](https://github.com/delta-io/delta/pull/6289)
- Status: Closed
- Related earlier PR: [#5887](https://github.com/delta-io/delta/pull/5887)

A metadata-path NPE is serious because it can affect **schema comparison and planning correctness** in unexpected places.  
**Fix status:** closed today, likely resolved.

### Medium severity

#### C. Invalid collated map keys allowed in Kernel
- Issue: [#5881](https://github.com/delta-io/delta/issues/5881)
- Status: Closed
- Fix PR: [#6291](https://github.com/delta-io/delta/pull/6291)

This is a **schema validity / protocol conformance** bug. It may not crash systems immediately, but it can create **invalid tables or cross-engine incompatibilities**, which is dangerous for interoperability.  
**Fix status:** closed via #6291.

#### D. Silent exception swallowing in catalog prefix fetch
- PR: [#6273](https://github.com/delta-io/delta/pull/6273)
- Status: Closed

This is not a direct correctness bug, but it hurts **operational reliability** by hiding root causes during integration failures.  
**Fix status:** closed.

### Lower severity but important

#### E. Ambiguity in `add.modificationTime` semantics
- Issue: [#6094](https://github.com/delta-io/delta/issues/6094)
- Status: Open

This is more a **spec ambiguity** than a code bug, but unresolved ambiguity can cause **validator disagreements and inconsistent connector behavior**.  
**Fix status:** no PR listed yet.

## 6) Feature Requests & Roadmap Signals

### Strong roadmap signals

#### 1. Catalog-managed table metadata operations
- Issue: [#6296](https://github.com/delta-io/delta/issues/6296)
- Related PRs:
  - [#6166](https://github.com/delta-io/delta/pull/6166)
  - [#6233](https://github.com/delta-io/delta/pull/6233)

This looks like one of the clearest next-wave features. Once atomic metadata sync via commit API is ready, Delta-Spark may remove blockers around metadata updates for catalog-managed tables.  
**Prediction:** likely to appear in an upcoming release once the supporting infrastructure lands.

#### 2. DSv2 read/write path maturation
- PRs:
  - [#6224](https://github.com/delta-io/delta/pull/6224)
  - [#6276](https://github.com/delta-io/delta/pull/6276)
  - [#6249](https://github.com/delta-io/delta/pull/6249)
  - [#6275](https://github.com/delta-io/delta/pull/6275)

These PRs suggest sustained investment in **DSv2 compatibility and performance**, including partition reporting, vectorized/columnar behavior, `ignoreChanges`, and exploratory write-path designs using Spark Parquet writer + Kernel commit.  
**Prediction:** DSv2 parity and performance improvements are very likely in the next version.

#### 3. Streaming CDC enhancements
- PR: [#6076](https://github.com/delta-io/delta/pull/6076)

Incremental CDC support in `SparkMicroBatchStream` is a strong product signal.  
**Prediction:** if stabilized, this could become a notable feature area in the next release cycle.

#### 4. Server-side planning and enterprise auth
- PRs:
  - [#6292](https://github.com/delta-io/delta/pull/6292)
  - [#6295](https://github.com/delta-io/delta/pull/6295)

OAuth client credentials and token refresh support indicate movement toward **production-ready remote planning/catalog services**.  
**Prediction:** likely to land behind integration-focused feature flags or internal-facing APIs before broader promotion.

#### 5. Schema validation parity with Spark
- PR: [#6293](https://github.com/delta-io/delta/pull/6293)

Nested `NOT NULL` constraint validation in Kernel SchemaUtils is not flashy, but it is exactly the kind of **compatibility hardening** needed for reliable multi-engine operation.  
**Prediction:** good candidate for near-term inclusion because it reduces semantic mismatch risk.

## 7) User Feedback Summary

From the issues and PRs updated today, user pain points cluster around a few concrete areas:

### Protocol clarity and interoperability
- Issue: [#6094](https://github.com/delta-io/delta/issues/6094)

Users need **clear spec language**, not just implementation behavior. This especially matters for teams building validators, alternate readers/writers, or integrating Delta into heterogeneous pipelines.

### Catalog/table management friction
- Issue: [#6296](https://github.com/delta-io/delta/issues/6296)

There is clear demand for smoother support of **catalog-managed table metadata evolution**, suggesting current restrictions are a usability bottleneck.

### Streaming reliability
- PRs:
  - [#6297](https://github.com/delta-io/delta/pull/6297)
  - [#6076](https://github.com/delta-io/delta/pull/6076)
  - [#6249](https://github.com/delta-io/delta/pull/6249)

Users are pushing streaming and CDC functionality hard enough to expose lifecycle/resource-handling issues and feature gaps in DSv2. This indicates Delta is being used in **serious streaming production contexts**, where parity and robustness matter more than experimental breadth.

### Spark compatibility parity in Kernel
- PR: [#6293](https://github.com/delta-io/delta/pull/6293)
- Issue/PR: [#5881](https://github.com/delta-io/delta/issues/5881), [#6291](https://github.com/delta-io/delta/pull/6291)

There is recurring pressure to ensure **Kernel behavior matches Spark expectations**, especially around schema validation and type semantics. That reflects a user base relying on mixed engine stacks and expecting deterministic behavior.

## 8) Backlog Watch

### 1. `add.modificationTime` protocol clarification needs maintainer decision
- Issue: [#6094](https://github.com/delta-io/delta/issues/6094)
- Open since: 2026-02-20

Not old by absolute standards, but important because it is a **protocol contract question**. Leaving it unresolved risks inconsistent external implementations.

### 2. Incremental CDC support in `SparkMicroBatchStream`
- PR: [#6076](https://github.com/delta-io/delta/pull/6076)
- Open since: 2026-02-19

This appears strategically significant and touches streaming semantics. It likely deserves careful maintainer attention because it can materially affect **CDC adoption and streaming parity**.

### 3. UC Commit Metrics transport wiring
- PR: [#6155](https://github.com/delta-io/delta/pull/6155)
- Open since: 2026-02-27

Operational telemetry is important for managed deployments. If this stays open too long, related observability work may bottleneck.

### 4. Catalog-managed table support stack
- PRs:
  - [#6166](https://github.com/delta-io/delta/pull/6166)
  - [#6233](https://github.com/delta-io/delta/pull/6233)
- Issue:
  - [#6296](https://github.com/delta-io/delta/issues/6296)

This looks like a multi-PR dependency chain. It likely needs coordinated review because it affects **catalog integration architecture**, CI, and user-facing metadata operations.

### 5. DSv2 write-path experimental work
- PR: [#6275](https://github.com/delta-io/delta/pull/6275)

Marked as a quick POC / experimental branch, but still worth watching because it may influence future write-path design decisions and performance tradeoffs between Spark-native file writing and Kernel-mediated commit logic.

---

## Overall Health Assessment

Delta Lake appears **technically healthy and highly active**, with current momentum concentrated in:
- **Kernel + Spark DSv2 integration**
- **streaming and CDC**
- **catalog/Unity Catalog-style integration**
- **schema/protocol correctness**
- **operational hardening**

The absence of a new release suggests these changes are still consolidating, but the volume and direction of work point to a project steadily improving its **engine interoperability, enterprise integration, and runtime reliability**.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

⚠️ Summary generation failed.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

## Velox Project Digest — 2026-03-17

### 1. Today's Overview
Velox was highly active over the last 24 hours, with **50 PRs updated** and **5 issues updated**, indicating strong ongoing development velocity despite no new release cut today. The balance of work suggests the project is currently focused on **execution engine evolution, build/CI efficiency, storage-layer correctness, and connector expansion** rather than packaging a release. Recent activity also shows sustained investment in **RPC-based remote execution**, **cuDF integration**, **Iceberg support**, and **spill/runtime tunability**. Project health appears solid, but a few correctness and build regressions—especially around Parquet filtering, Spark compatibility, and linker failures—deserve close attention.

### 2. Project Progress
Merged/closed PR activity today advanced several useful areas:

- **Unnest execution configurability improved** via merged PR [#16762](https://github.com/facebookincubator/velox/pull/16762), which adds an option on `UnnestNode` to enable or disable output splitting. This is meaningful for query engine behavior because unnest batch formation affects downstream operator pressure, memory behavior, and execution predictability.
- **Developer workflow automation improved** with merged PR [#16798](https://github.com/facebookincubator/velox/pull/16798), adding `additional_context` and `dry_run` inputs to the Claude workflow dispatch. While not engine-facing, this strengthens review tooling and can accelerate maintenance throughput.
- A correctness issue was also closed in issue [#16586](https://github.com/facebookincubator/velox/issues/16586), concerning **`sum(decimal(18,4))` cast to float precision differences vs Spark/Gluten**. Even without a linked PR in the provided data, closure is a positive signal for Spark SQL compatibility work.

Overall, today’s completed work leaned more toward **execution semantics and engineering productivity** than broad user-visible SQL surface expansion.

### 3. Community Hot Topics
The most notable active discussions and high-signal PRs point to a few major technical themes:

- **New aggregate capability: `vector_sum`** — PR [#16498](https://github.com/facebookincubator/velox/pull/16498) proposes an element-wise array aggregation primitive. This addresses a practical analytical need: avoiding manual unnest/re-aggregate patterns for vector-style data, which is increasingly relevant for feature engineering and ML-adjacent analytics.
- **cuDF execution planning and externalization** — PRs [#16444](https://github.com/facebookincubator/velox/pull/16444), [#16535](https://github.com/facebookincubator/velox/pull/16535), and [#15700](https://github.com/facebookincubator/velox/pull/15700) show continued investment in GPU-path validation, config modularization, and CI coverage. The underlying need is clear: make GPU acceleration more predictable, externally consumable, and production-testable.
- **Remote function / RPC execution stack** — PRs [#16787](https://github.com/facebookincubator/velox/pull/16787), [#16793](https://github.com/facebookincubator/velox/pull/16793), and [#16598](https://github.com/facebookincubator/velox/pull/16598) point to a larger roadmap around async remote function execution and sidecar discovery. This suggests Velox is expanding beyond purely local function execution toward service-backed extensibility.
- **Build and CI performance** — PRs [#16797](https://github.com/facebookincubator/velox/pull/16797) and [#16767](https://github.com/facebookincubator/velox/pull/16767) focus on reducing scheduled fuzzer build time and artifact overhead. This reflects a scaling need: faster fuzzing feedback loops and lower CI cost for a rapidly changing engine codebase.
- **Hive and storage abstraction work** — PR [#16803](https://github.com/facebookincubator/velox/pull/16803) introduces pluggable index reader support in Hive, signaling a push toward more modular storage-format-specific optimizations inside a common orchestration layer.

### 4. Bugs & Stability
Ranked by likely severity and user impact:

1. **Parquet predicate correctness issue** — Issue [#16743](https://github.com/facebookincubator/velox/issues/16743)  
   - **Severity:** Critical  
   - **Impact:** Query returns empty result when it should return a row due to **Parquet 1.8.1 string min/max ordering differences**.  
   - **Why it matters:** This is a classic analytical engine risk: bad file-stat pruning can silently produce wrong answers.  
   - **Fix PR visible?:** None in provided data.

2. **Build break: undefined reference to `registerArraySplitIntoChunksFunctions`** — Issue [#16785](https://github.com/facebookincubator/velox/issues/16785)  
   - **Severity:** High  
   - **Impact:** CI/build failure blocks integration and downstream users building from source.  
   - **Why it matters:** Linker regressions can stall contributor throughput and destabilize mainline adoption.  
   - **Fix PR visible?:** None directly linked in the provided data.

3. **cuDF empty/nested struct conversion failure** — Issue [#16786](https://github.com/facebookincubator/velox/issues/16786)  
   - **Severity:** High for GPU users; Medium overall  
   - **Impact:** Conversion from cuDF table to Velox fails for nested struct cases due to metadata handling that only considers top-level columns.  
   - **Why it matters:** This limits GPU interoperability for realistic nested analytical schemas.  
   - **Fix PR visible?:** Not directly visible, but related cuDF planning/config work is active in [#16444](https://github.com/facebookincubator/velox/pull/16444) and [#16535](https://github.com/facebookincubator/velox/pull/16535).

4. **Spark aggregate fuzzer failures on `ARRAY<TIMESTAMP>`** — Issue [#16327](https://github.com/facebookincubator/velox/issues/16327)  
   - **Severity:** Medium to High  
   - **Impact:** Ongoing inconsistency between Spark and Velox uncovered by fuzzing.  
   - **Why it matters:** Fuzzer-found divergences often indicate latent SQL semantics mismatches that can become user-visible correctness bugs.  
   - **Fix PR visible?:** No direct fix shown; CI/fuzzer optimization work in [#16797](https://github.com/facebookincubator/velox/pull/16797) and [#16767](https://github.com/facebookincubator/velox/pull/16767) may improve diagnosis velocity, but not semantics by itself.

5. **Previously reported decimal-to-float precision mismatch vs Spark closed** — Issue [#16586](https://github.com/facebookincubator/velox/issues/16586)  
   - **Severity:** Medium  
   - **Impact:** Result divergence in Spark/Gluten + Velox workflows.  
   - **Status:** Closed, which is encouraging for SQL compatibility stability.

A notable proactive stability improvement is PR [#16800](https://github.com/facebookincubator/velox/pull/16800), which fixes **dangling `StringView` keys in DWRF `FlatMapColumnWriter`**. This looks like a real memory-safety/correctness bug with potential crash or corruption implications during rehashing.

### 5. Feature Requests & Roadmap Signals
Several active PRs provide strong hints about near-term roadmap direction:

- **Array/vector-native SQL analytics** via [#16498](https://github.com/facebookincubator/velox/pull/16498) (`vector_sum`). This is a credible candidate for the next release because it is user-visible, narrowly scoped, and solves a concrete analytical need.
- **Async remote execution / RPC-backed functions** via [#16598](https://github.com/facebookincubator/velox/pull/16598), [#16787](https://github.com/facebookincubator/velox/pull/16787), and [#16793](https://github.com/facebookincubator/velox/pull/16793). This appears strategic rather than experimental; expect continued landing of foundational pieces before broad exposure.
- **Iceberg merge-on-read positional updates** via [#16761](https://github.com/facebookincubator/velox/pull/16761). This is a strong connector roadmap signal, especially for lakehouse mutation support.
- **Hive pluggable index readers** via [#16803](https://github.com/facebookincubator/velox/pull/16803), suggesting future support for broader index-format specialization without overcoupling storage logic.
- **Operator-specific spill tuning** via [#16802](https://github.com/facebookincubator/velox/pull/16802), which indicates a roadmap toward finer-grained runtime controls for memory-intensive operators.
- **Dependency modernization** via [#16019](https://github.com/facebookincubator/velox/pull/16019), replacing Apache Thrift with FBThrift. This may not land immediately, but if merged it could have meaningful build and integration consequences.

Most likely near-next-version inclusions from current activity: `vector_sum`, spill configurability improvements, selected cuDF planning pieces, and possibly some storage-layer modularization.

### 6. User Feedback Summary
Recent user-reported pain points are concentrated in four areas:

- **Query correctness over storage metadata**: The Parquet min/max ordering issue in [#16743](https://github.com/facebookincubator/velox/issues/16743) shows users are sensitive to silent misfiltering and wrong-result behavior on older file encodings.
- **Cross-engine compatibility with Spark/Gluten**: Both [#16327](https://github.com/facebookincubator/velox/issues/16327) and closed issue [#16586](https://github.com/facebookincubator/velox/issues/16586) indicate users are validating Velox by comparing semantics to Spark, especially around aggregates and decimal precision.
- **Build reliability for contributors/integrators**: [#16785](https://github.com/facebookincubator/velox/issues/16785) highlights that source builds remain a real usability concern.
- **Nested schema handling in GPU paths**: [#16786](https://github.com/facebookincubator/velox/issues/16786) shows that advanced users expect full support for nested/struct-heavy analytical data, not just flat schemas.

The feedback pattern suggests users value Velox for performance and extensibility, but still judge it heavily on **semantic compatibility, correctness under edge cases, and integration robustness**.

### 7. Backlog Watch
Important older or strategically significant items that appear to need continued maintainer attention:

- **FBThrift migration** — PR [#16019](https://github.com/facebookincubator/velox/pull/16019)  
  A long-running build/dependency modernization effort with potentially broad downstream impact. This likely needs careful coordination due to API incompatibilities.

- **cuDF test coverage in CI** — PR [#15700](https://github.com/facebookincubator/velox/pull/15700)  
  Open since 2025-12-04. Given the growing cuDF feature set, lack of landed CI coverage increases the risk of regressions.

- **Async remote function execution** — PR [#16598](https://github.com/facebookincubator/velox/pull/16598)  
  Strategic work with likely architecture implications. Important, but large enough that it may need explicit roadmap communication.

- **Spark aggregate fuzzer failure** — Issue [#16327](https://github.com/facebookincubator/velox/issues/16327)  
  Open since 2026-02-10 and still active. Because it is fuzzer-found and Spark-related, it deserves sustained attention even if repro details remain incomplete.

### 8. Overall Health Signal
Velox remains a **fast-moving and technically ambitious** analytical engine project. Current momentum is strongest in **execution extensibility, connector/storage sophistication, and CI hardening**, while the main risks remain **correctness mismatches, build breakage, and edge-case schema handling**. No release today means maintainers still have room to stabilize active work before packaging it. From the current queue, the project looks healthy—but increasingly dependent on disciplined triage to keep rapid feature expansion from outpacing validation.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-17

## 1. Today's Overview

Apache Gluten remained highly active over the last 24 hours, with **22 PRs updated** and **6 issues updated**, indicating strong ongoing development momentum despite **no new release**. The workstream is clearly centered on the **Velox backend**, with active changes spanning shuffle optimization, SQL/type compatibility, memory/resource correctness, CI/build hygiene, and Iceberg integration. Compared with issue volume, PR activity is much higher, which suggests the project is currently in an **implementation-heavy phase** rather than a discussion-heavy phase. Overall health looks good, but several signals point to ongoing pressure around **performance regressions**, **Spark compatibility edge cases**, and **upstream dependency management with Velox**.

---

## 3. Project Progress

### Merged/closed PRs today and what they advanced

#### 1) Memory/resource correctness for limit execution
- **PR #11754** — [Close ColumnarBatch in ColumnarCollectLimitExec for skipped batches](https://github.com/apache/incubator-gluten/pull/11754)  
  This closed a resource-leak issue in `ColumnarCollectLimitExec`, where skipped batches were consumed without being closed. This is an important **execution-engine stability** fix because leaked `ColumnarBatch` objects can accumulate off-heap/native memory pressure in columnar pipelines, especially in limit/offset-heavy workloads.

#### 2) Build/dependency hygiene across modules
- **PR #11681** — [Add missing direct dependency for each module](https://github.com/apache/incubator-gluten/pull/11681)  
  This strengthens module dependency correctness across core, Velox, and data lake components. While not user-visible, this kind of cleanup improves **build reproducibility**, reduces hidden transitive dependency risks, and makes future modularization safer.

#### 3) CI reliability improvement
- **PR #11760** — [Fix the concurrency of code format check](https://github.com/apache/incubator-gluten/pull/11760)  
  This addresses workflow cancellation behavior in formatting checks. It improves contributor experience and reduces false CI noise, helping maintain development velocity.

#### 4) Tooling fixes for benchmark/integration workflows
- **PR #11768** — [Gluten-it: Various fixes](https://github.com/apache/incubator-gluten/pull/11768)  
  Includes removal of inaccurate planning-time reporting, standardized schema handling for catalog tables, and a fix for excessive plan object retention that could cause heap OOM in partitioned TPC-DS runs. This is meaningful for **testing realism**, **catalog correctness**, and **large benchmark stability**.

#### 5) Internal Velox-side simplification
- **PR #11770** — [Simplify the flatten vector logic](https://github.com/apache/incubator-gluten/pull/11770)  
  Although labeled minor, this type of vector-path simplification often reduces maintenance burden and may lower risk in vectorized execution internals.

#### 6) Ongoing Velox upstream sync
- **PR #11762** — [Daily Update Velox Version (2026_03_14)](https://github.com/apache/incubator-gluten/pull/11762)  
- **PR #11764** — [Daily Update Velox Version (2026_03_15)](https://github.com/apache/incubator-gluten/pull/11764)  
  Continuous Velox rebases remain a major part of project progress. The imported upstream changes include execution metrics, operator APIs, serializer work, and race-condition fixes—showing Gluten’s dependency on a rapidly moving Velox substrate.

### Net progress signal
Today’s closed work mainly improved **engine robustness, memory correctness, tooling stability, and build health**, rather than landing major end-user SQL features. This is a positive maintenance pattern for a fast-moving analytical engine project.

---

## 4. Community Hot Topics

### 1) Unmerged Velox upstream work tracking
- **Issue #11585** — [[VL] useful Velox PRs not merged into upstream](https://github.com/apache/incubator-gluten/issues/11585)  
  **16 comments, 4 reactions**

This is the most active issue in the set and reflects a structural challenge: Gluten depends heavily on Velox, but some needed functionality lives in PRs not yet merged upstream. The underlying technical need is clear: contributors want **faster access to execution-engine capabilities** without carrying expensive long-lived forks. This is a roadmap and maintenance risk area, because unresolved upstream lag can slow feature delivery or increase divergence cost.

### 2) Dynamic filter pushdown into shuffle reader
- **Issue #11605** — [[VL] Push Velox dynamic filters to shuffle reader](https://github.com/apache/incubator-gluten/issues/11605)  
  **7 comments**
- Related implementation:
  - **PR #11769** — [Write per-block column statistics in shuffle writer](https://github.com/apache/incubator-gluten/pull/11769)

This is one of the clearest optimization threads right now. The technical goal is to extend Velox dynamic filtering beyond scan-time pruning and into **shuffle read reduction**, potentially avoiding unnecessary materialization of shuffled data. The linked PR indicates implementation is moving toward **per-block statistics** in shuffle files, which is a prerequisite for finer-grained pruning. This looks strategically important for large distributed queries.

### 3) TIMESTAMP_NTZ support on Velox
- **Issue #11622** — [[VL] Support TIMESTAMP_NTZ Type](https://github.com/apache/incubator-gluten/issues/11622)  
  **3 comments, 2 reactions**
- Related PR:
  - **PR #11720** — [Add config to disable TimestampNTZ validation fallback](https://github.com/apache/incubator-gluten/pull/11720)

This is a strong SQL compatibility signal. Users need full support for Spark semantics around `TIMESTAMP_NTZ`, but the current validator forces fallback. The interim config being added suggests maintainers are enabling **incremental development/testing** before full backend support lands. This is the sort of compatibility work that often blocks broader Spark 4.x adoption.

### 4) Iceberg metadata and file function correctness
- **PR #11615** — [[Iceberg] Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation](https://github.com/apache/incubator-gluten/pull/11615)

This is among the most strategically relevant open PRs because it touches **Iceberg interoperability**, **metadata propagation**, and a **JNI crash path**. The underlying need is correctness and operational trust in modern lakehouse table formats.

### 5) New severe performance complaint
- **Issue #11766** — [[VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries](https://github.com/apache/incubator-gluten/issues/11766)

Even though it has few comments so far, this is a high-signal issue. A large regression on a simple `LIMIT` query suggests potential inefficiency in task planning, batch fetching, or limit pushdown behavior. Given the same-day memory/limit-related fix in PR #11754, the broader limit execution path is an area to watch closely.

---

## 5. Bugs & Stability

Ranked by likely severity based on impact to correctness, crashes, or user-visible regressions:

### Critical / High

#### 1) Severe performance regression on simple LIMIT query
- **Issue #11766** — [[VL] Gluten performs over 10x slower than Vanilla Spark on simple "select ... limit ..." queries](https://github.com/apache/incubator-gluten/issues/11766)

A >10x slowdown on `select * ... limit 10` is serious because it affects a very common interactive query pattern. The description suggests Vanilla Spark runs with only one task while Gluten does not achieve similar efficiency. Possible root causes include missing early-stop behavior, limit pushdown gaps, task over-scheduling, or extra materialization in the columnar path.  
**Fix status:** no direct fix PR linked yet, but **PR #11754** may partially improve the same area by fixing skipped-batch handling in `ColumnarCollectLimitExec`.

#### 2) Spark dynamic partition pruning test failures
- **Issue #11692** — [[VL][BUG] Spark UTs from suite DynamicPartitionPruningHiveScanSuite are failing](https://github.com/apache/incubator-gluten/issues/11692) — **Closed**  
  Link: https://github.com/apache/incubator-gluten/issues/11692

This was a **query correctness / Spark compatibility** issue involving dynamic pruning expressions. Because it is closed, it appears the immediate regression has been addressed, which is a positive signal for regression response time.

#### 3) JNI initialization crash path and Iceberg metadata behavior
- **PR #11615** — [[Iceberg] Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation](https://github.com/apache/incubator-gluten/pull/11615)

Open, but important: it addresses both correctness of file metadata functions and a JNI crash path. JNI failures are high severity because they can destabilize executors/processes, not just individual queries.

### Medium

#### 4) Heap OOM risk in integration tooling / plan retention
- **PR #11768** — [Gluten-it: Various fixes](https://github.com/apache/incubator-gluten/pull/11768)

This was closed and includes a fix for excessive plan object retention causing heap OOM on partitioned TPC-DS with small heaps. Although this is in test tooling, it reflects pressure points in large-query planning and benchmarking environments.

#### 5) Memory leak in skipped batches for limit execution
- **PR #11754** — [Close ColumnarBatch in ColumnarCollectLimitExec for skipped batches](https://github.com/apache/incubator-gluten/pull/11754)

Now closed, but relevant because it suggests that native/resource lifecycle issues still surface in execution code paths.

---

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals

#### 1) Shuffle-aware dynamic filtering
- **Issue #11605** — [[VL] Push Velox dynamic filters to shuffle reader](https://github.com/apache/incubator-gluten/issues/11605)
- **PR #11769** — [Write per-block column statistics in shuffle writer](https://github.com/apache/incubator-gluten/pull/11769)

This looks like one of the most likely near-term performance features to land. If completed, it could reduce shuffle IO and downstream deserialization, especially for selective joins.

#### 2) TIMESTAMP_NTZ support
- **Issue #11622** — [[VL] Support TIMESTAMP_NTZ Type](https://github.com/apache/incubator-gluten/issues/11622)
- **PR #11720** — [Add config to disable TimestampNTZ validation fallback](https://github.com/apache/incubator-gluten/pull/11720)

Very likely to appear in an upcoming release at least in partial form. The existence of a development config usually means the project is moving from “unsupported” toward “experimental/under validation.”

#### 3) Bloom filter pushdown via `might_contain`
- **PR #11711** — [Translate might_contain as a subfield filter for scan-level bloom filter pushdown](https://github.com/apache/incubator-gluten/pull/11711)

This is a practical query acceleration feature, especially for selective scans. It shows ongoing investment in **predicate pushdown sophistication**.

#### 4) Variant type / Spark 4.0+ compatibility
- **PR #11726** — [Enable Variant test suites](https://github.com/apache/incubator-gluten/pull/11726)

This is a notable SQL/language compatibility signal. Variant support matters for semi-structured data and evolving Spark 4.x workloads.

#### 5) Iceberg + Spark 4.0 ecosystem readiness
- **Issue #11145** — [[VL] Iceberg Support Spark4.0](https://github.com/apache/incubator-gluten/issues/11145) — **Closed**  
  Link: https://github.com/apache/incubator-gluten/issues/11145

Although sparse in discussion, closure indicates progress on one of the most important ecosystem combinations: **Gluten + Velox + Iceberg + Spark 4.0**.

### Prediction for next version
Most likely next-version-visible improvements:
1. **Better Spark 4.x compatibility**, especially around Iceberg and Variant-related paths  
2. **Incremental TimestampNTZ support**  
3. **More aggressive filter/predicate pushdown**, including bloom and shuffle-side pruning  
4. **Execution stability fixes** around memory/resource lifecycle and metadata propagation

---

## 7. User Feedback Summary

### Main pain points surfacing now

#### Performance expectations are not consistently met
- **Issue #11766** — [10x slower than Vanilla Spark on simple LIMIT query](https://github.com/apache/incubator-gluten/issues/11766)

This is the clearest end-user pain point in the current window. Gluten is expected to accelerate straightforward analytical queries, so regressions on simple `LIMIT` statements directly challenge perceived value.

#### SQL/type compatibility remains a friction point
- **Issue #11622** — [Support TIMESTAMP_NTZ Type](https://github.com/apache/incubator-gluten/issues/11622)

Users and contributors still encounter fallback-triggering type gaps. This indicates that broad Spark workload portability remains incomplete in edge and newer type systems.

#### Modern lakehouse semantics matter to users
- **PR #11615** — [Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation](https://github.com/apache/incubator-gluten/pull/11615)

The attention on `input_file_name()` and related metadata functions shows users care about not just raw speed but also **behavioral parity** for observability, ETL logic, and file-aware SQL.

#### Upstream dependency lag is a real delivery constraint
- **Issue #11585** — [useful Velox PRs not merged into upstream](https://github.com/apache/incubator-gluten/issues/11585)

Community members are signaling that some desired capabilities are blocked more by upstream process than by local implementation effort.

### Satisfaction signal
There is no explicit positive user testimonial in today’s data, but the volume of optimization and compatibility PRs suggests maintainers are actively addressing practical usage blockers rather than only doing internal refactors.

---

## 8. Backlog Watch

These items appear important and deserving of maintainer attention due to age, strategic relevance, or dependency risk.

### 1) Long-running Velox upstream tracking
- **Issue #11585** — [useful Velox PRs not merged into upstream](https://github.com/apache/incubator-gluten/issues/11585)

This is both active and strategically risky. It can become a persistent drag on feature velocity if not actively curated and minimized.

### 2) Older open PR around sort elimination correctness
- **PR #9473** — [Update sort elimination rules for Hash Aggregate](https://github.com/apache/incubator-gluten/pull/9473)

This PR has been open since **2025-04-30**, making it the clearest long-lived backlog item in the current set. Because it touches optimizer/execution correctness assumptions around aggregate ordering, it likely needs explicit maintainer disposition: merge, revise, or close.

### 3) Repository migration after TLP graduation
- **PR #11735** — [Update repository references from incubator-gluten to gluten after TLP graduation](https://github.com/apache/incubator-gluten/pull/11735)

This is broad, cross-cutting, and operationally important. Delays here can create confusion in docs, build scripts, and contributor workflows.

### 4) Iceberg metadata correctness and JNI stability still pending
- **PR #11615** — [Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation](https://github.com/apache/incubator-gluten/pull/11615)

This should get prompt review because it affects both **data lake correctness** and **runtime safety**.

### 5) TimestampNTZ support remains incomplete
- **Issue #11622** — [Support TIMESTAMP_NTZ Type](https://github.com/apache/incubator-gluten/issues/11622)
- **PR #11720** — [Add config to disable TimestampNTZ validation fallback](https://github.com/apache/incubator-gluten/pull/11720)

This is an important compatibility milestone and likely worth prioritizing if Spark 4.x readiness is a near-term goal.

---

## Overall Health Assessment

Apache Gluten shows **strong contributor throughput and healthy implementation velocity**, especially around the Velox backend and Spark 4.x/data-lake compatibility. The project is currently investing in the right areas: **execution correctness, memory safety, pushdown optimization, and ecosystem interoperability**. The main caution flags are **simple-query performance regressions**, **incomplete SQL/type support**, and **reliance on unmerged upstream Velox work**. In short: the project looks active and technically advancing, but still in a phase where operational polish and compatibility breadth are catching up with engine ambition.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-17

## 1) Today's Overview

Apache Arrow saw moderate day-to-day maintenance activity over the last 24 hours: 27 issues were updated and 15 PRs moved, with no new releases cut. The project’s current energy is concentrated less on new end-user features and more on build reliability, packaging, documentation hygiene, and platform support across CI, Python, and C++. There are also clear roadmap signals around broader architecture coverage (POWER, Windows ARM64), packaging correctness, and incremental Python typing improvements. Overall project health looks steady, with maintainers actively closing CI breakages quickly, but several older feature requests and infrastructure efforts still need sustained maintainer attention.

## 3) Project Progress

### PRs merged/closed today

#### CI / build system progress
- [PR #49488](https://github.com/apache/arrow/pull/49488) — **[CI] Update Maven version from 3.8.7 to 3.9.9**  
  Closed after addressing [Issue #49526](https://github.com/apache/arrow/issues/49526). This advances Java build compatibility with newer Maven plugin APIs and reduces future friction in Arrow’s Java ecosystem integration.

- [PR #49525](https://github.com/apache/arrow/pull/49525) — **[CI][Packaging] Try removing KEY that seems bad from downloaded KEYS file**  
  Closed as the response to [Issue #49521](https://github.com/apache/arrow/issues/49521). This is an operational packaging fix, important for release engineering and distro/package validation continuity.

- [PR #49519](https://github.com/apache/arrow/pull/49519) — **[CI] Do not override HOME to empty on build_conda.sh for minimal_build**  
  Closed to fix the failure in [Issue #49518](https://github.com/apache/arrow/issues/49518). This improves Python minimal-build CI stability and avoids ccache path initialization problems.

#### Documentation progress
- [PR #49520](https://github.com/apache/arrow/pull/49520) — **[Docs][Python] Document that .pxi doctests are tested via lib.pyx**  
- [PR #49516](https://github.com/apache/arrow/pull/49516) — similar earlier iteration  
- [PR #49517](https://github.com/apache/arrow/pull/49517) — similar earlier iteration  

  These documentation PRs clarify how PyArrow Cython doctests actually execute. While not a query engine feature, this directly improves contributor productivity in Python internals and reduces friction in test maintenance.

#### Runtime correctness / crash fixes
- [PR #49471](https://github.com/apache/arrow/pull/49471) — **[C++][Gandiva] Fix crashes in substring_index and truncate with extreme integer values**  
  Closed today. This is the most directly user-facing correctness/stability improvement among closed PRs: it fixes crashes in SQL-expression-style Gandiva functions for extreme integer arguments, which matters for robust analytical execution under edge-case inputs.

### What this means technically
Today’s closed work advanced:
- **build/release reliability** rather than new execution features,
- **packaging correctness** for Linux and Java toolchains,
- **developer documentation** for Python internals,
- and **execution stability** in Gandiva scalar function handling.

That mix suggests Arrow is in an active hardening phase across platforms and packaging workflows.

## 4) Community Hot Topics

### Most discussed issues

#### 1. [Issue #31209](https://github.com/apache/arrow/issues/31209) — **[Python] Extracting Type information from Python Objects**
- 33 comments
- Open
- Components: C++, Python

This is the most actively discussed item in the snapshot. The underlying need is clear: users want stronger Python type-hint interoperability so Arrow can infer schemas/types from annotated Python code, especially for UDF-like workflows. This points toward a broader push to make PyArrow feel more native in typed Python ecosystems and likely aligns with current stub/type-annotation work in open PRs.

#### 2. [Issue #43817](https://github.com/apache/arrow/issues/43817) — **[CI][Python][C++] Support on Power Architecture**
- 32 comments
- Open
- Components: C++, Python, Continuous Integration

This is a major platform expansion discussion. The technical need is not just “make it compile” but to establish repeatable wheel builds, CI coverage, and likely sustained support expectations for PPC64LE/POWER users. For analytical storage engines and data infrastructure deployments, POWER support matters in enterprise and HPC environments.

#### 3. [Issue #49404](https://github.com/apache/arrow/issues/49404) — **Manual ODBC Windows MSI installer signing**
- 10 comments
- Open
- Components: FlightRPC, Packaging

This reflects a very practical adoption blocker: unsigned Windows installers are increasingly unacceptable because of Defender/SmartScreen friction. The technical requirement is release-process maturity around signed MSI and DLL artifacts for Flight SQL ODBC distribution.

#### 4. [Issue #47467](https://github.com/apache/arrow/issues/47467) — **[Python] Adopt new features and bugfixes from Cython 3.1**
- 6 comments
- Open

This indicates ongoing Python build/tooling modernization. The need here is part performance, part maintainability, part compatibility with newer Cython syntax/behavior.

### Most strategically relevant open PRs

#### [PR #48622](https://github.com/apache/arrow/pull/48622) — **[Python] Add internal type system stubs**
This is one of the strongest roadmap-aligned PRs. It supports typed Python development, better IDE/static analysis behavior, and likely future schema/type interoperability improvements.

#### [PR #48539](https://github.com/apache/arrow/pull/48539) — **[Python][CI] Add support for building PyArrow library on Windows ARM64**
Windows ARM64 is emerging as a meaningful client/dev platform. This PR is strategically important for binary distribution reach.

#### [PR #49476](https://github.com/apache/arrow/pull/49476) — **[Python] Fix get_include and get_library_dirs to work with both editable and non-editable builds**
This addresses a concrete integration pain point for downstream native/Cython extension builds using PyArrow in both developer and packaged environments.

## 5) Bugs & Stability

Ranked by severity and user impact:

### High severity

#### 1. [Issue #49499](https://github.com/apache/arrow/issues/49499) — **Snappy and Brotli debug libraries linked in Release builds when using vcpkg with multi-config generators**
- Open
- Packaging
- Affects Windows / Visual Studio / static triplets

This is a significant consumer-side integration bug because it causes linker/runtime mismatch errors in release builds. It directly impacts downstream application builds embedding Arrow via vcpkg. No linked fix PR appears in the provided snapshot.

#### 2. [Issue #49522](https://github.com/apache/arrow/issues/49522) — **[CI] test-conda-python-emscripten fails installing chrome driver**
- Open
- CI
- Fix available: [PR #49523](https://github.com/apache/arrow/pull/49523)

This is high severity for CI reliability, especially for Emscripten/browser-related validation coverage. The fix path is already active via chrome version bump.

#### 3. [PR #49471](https://github.com/apache/arrow/pull/49471) — **Gandiva crashes with extreme integer values**
- Closed/fixed

Though already fixed, this deserves attention because it was a genuine runtime crash affecting expression evaluation correctness and stability.

### Medium severity

#### 4. [Issue #49521](https://github.com/apache/arrow/issues/49521) — **Linux packaging jobs failing due to GPG check FAILED**
- Closed
- Fix: [PR #49525](https://github.com/apache/arrow/pull/49525)

A release engineering blocker rather than product correctness bug. Resolved quickly, which is a positive signal for maintainer responsiveness.

#### 5. [Issue #49518](https://github.com/apache/arrow/issues/49518) — **example-python-minimal-build-fedora-conda fails due to ccache error**
- Closed
- Fix: [PR #49519](https://github.com/apache/arrow/pull/49519)

Another CI regression resolved quickly.

#### 6. [PR #49462](https://github.com/apache/arrow/pull/49462) — **Fix intermittent segfault in arrow-json-test with MinGW**
- Open

This remains an important unresolved stability item. Intermittent test segfaults on Windows MinGW point to possible concurrency, memory, or ABI-sensitive behavior in JSON parsing/testing.

## 6) Feature Requests & Roadmap Signals

### Strong roadmap signals

#### [Issue #49514](https://github.com/apache/arrow/issues/49514) — **Compute function to generate date from year / month / day**
This is a clear user-facing API gap in PyArrow compute. It is a small, concrete function request with obvious utility in ETL and analytics pipelines. Because it is narrowly scoped and has immediate value, it looks like a plausible candidate for a near-term release.

#### [Issue #43817](https://github.com/apache/arrow/issues/43817) — **Support on Power Architecture**
Large effort, unlikely to fully land in a single near-term release unless CI and packaging ownership is already lined up. Still, this is one of the strongest medium-term platform signals.

#### [Issue #49404](https://github.com/apache/arrow/issues/49404) — **Manual ODBC Windows MSI installer signing**
Likely to be prioritized because it affects installability and enterprise trust for Flight SQL ODBC on Windows. This is more release-process work than code feature work, but highly relevant to adoption.

#### [Issue #47467](https://github.com/apache/arrow/issues/47467) — **Adopt Cython 3.1 improvements**
A realistic near-term modernization target, especially as related minimum-version work is already happening.

#### [Issue #49528](https://github.com/apache/arrow/issues/49528) — **Explore options for replacing conda with pixi**
This is an early-stage developer-experience proposal. It signals interest in more reproducible and faster dev environments, but likely remains exploratory unless maintainers see broad workflow benefits.

### Older strategic feature requests still alive

#### [Issue #31204](https://github.com/apache/arrow/issues/31204) — **Investigate scanning parquet files at sub-row-group resolution**
This is one of the most analytically meaningful long-term items. If advanced, it could improve parallelism, memory efficiency, and scan granularity for parquet datasets—directly relevant to analytical engine performance.

#### [Issue #31208](https://github.com/apache/arrow/issues/31208) — **Optionally cache serialized ListFlights serverside**
This would target Flight metadata-serving efficiency and could matter at larger deployment scales.

#### [Issue #31229](https://github.com/apache/arrow/issues/31229) — **Temporal floor/ceil/round kernels could be optimised with templating**
A lower-visibility but worthwhile compute-engine optimization item.

### Likely next-version candidates
Most plausible for near-term inclusion:
- [Issue #49514](https://github.com/apache/arrow/issues/49514) date constructor compute function
- [PR #49476](https://github.com/apache/arrow/pull/49476) Python include/library path fix
- [Issue #47467](https://github.com/apache/arrow/issues/47467) Cython 3.1 adoption follow-up
- [Issue #49404](https://github.com/apache/arrow/issues/49404) Windows MSI signing workflow improvements

## 7) User Feedback Summary

The strongest user pain points visible today are operational rather than conceptual:

- **Packaging and build integration pain**
  - [Issue #49499](https://github.com/apache/arrow/issues/49499): downstream consumers using vcpkg + Visual Studio are hitting release/debug library mismatch failures.
  - [PR #49476](https://github.com/apache/arrow/pull/49476): Python developers using `scikit-build-core` and editable installs struggle to locate headers and libraries correctly.

- **Platform compatibility demand**
  - [Issue #43817](https://github.com/apache/arrow/issues/43817): interest in POWER/PPC64LE support.
  - [PR #48539](https://github.com/apache/arrow/pull/48539): demand for Windows ARM64 PyArrow builds.

- **Python ergonomics and typing**
  - [Issue #31209](https://github.com/apache/arrow/issues/31209) and [PR #48622](https://github.com/apache/arrow/pull/48622) both show demand for better Python-native developer experience through type hints and stubs.

- **Small but meaningful compute API gaps**
  - [Issue #49514](https://github.com/apache/arrow/issues/49514): users want a direct inverse of year/month/day extraction for date construction.

- **Enterprise installability concerns**
  - [Issue #49404](https://github.com/apache/arrow/issues/49404): unsigned Flight SQL ODBC MSI artifacts create friction for Windows deployment.

The sentiment implied by this data is that Arrow is broadly useful and heavily integrated, but users are now pushing on polish: packaging correctness, typed APIs, and support on more architectures.

## 8) Backlog Watch

These older or strategically important items appear to need maintainer attention:

### High-value older issues

#### [Issue #31209](https://github.com/apache/arrow/issues/31209) — **[Python] Extracting Type information from Python Objects**
Long-running, high-discussion, and clearly aligned with active typing work. Worth maintainer triage into a more explicit roadmap or milestone.

#### [Issue #31204](https://github.com/apache/arrow/issues/31204) — **[C++] Investigate scanning parquet files at sub-row-group resolution**
Potentially impactful for analytical scan performance and memory behavior. Despite low comment count, this is strategically important for storage-engine efficiency.

#### [Issue #31208](https://github.com/apache/arrow/issues/31208) — **[C++][FlightRPC] Optionally cache serialized ListFlights serverside**
Important for Flight deployments at scale; old and still open.

#### [Issue #31229](https://github.com/apache/arrow/issues/31229) — **[C++] Temporal floor/ceil/round kernels could be optimised with templating**
Still open for years; modest scope but likely needs someone to own the refactor.

#### [Issue #43817](https://github.com/apache/arrow/issues/43817) — **Support on Power Architecture**
Not stale in interest, but large in scope. Needs sustained maintainer sponsorship to move from community experimentation to official support.

### Open PRs needing review/decision

#### [PR #48622](https://github.com/apache/arrow/pull/48622) — **Python internal type system stubs**
Potentially high leverage for PyArrow usability; awaiting committer review.

#### [PR #48539](https://github.com/apache/arrow/pull/48539) — **Windows ARM64 PyArrow support**
Strategic platform work; long-lived and should not linger indefinitely without a clear acceptance path.

#### [PR #49462](https://github.com/apache/arrow/pull/49462) — **Fix intermittent MinGW segfault**
Windows CI stability issue with clear value; deserves timely review.

#### [PR #49527](https://github.com/apache/arrow/pull/49527) — **Parquet RowGroupWriter total_buffered_bytes() API**
Useful storage-writer introspection feature that could help downstream row-group sizing logic.

---

## Bottom line

Arrow’s current status is healthy but maintenance-heavy: today’s visible progress centered on CI fixes, packaging reliability, and documentation, while feature momentum is strongest in Python typing, platform expansion, and incremental compute/storage ergonomics. The project continues to show strong responsiveness to breakages, but several long-running, high-value items—especially Python type inference, parquet scan granularity, and broader architecture support—would benefit from clearer maintainer prioritization.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*