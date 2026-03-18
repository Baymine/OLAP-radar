# Apache Doris Ecosystem Digest 2026-03-18

> Issues: 10 | PRs: 154 | Projects covered: 10 | Generated: 2026-03-18 02:04 UTC

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

# Apache Doris Project Digest — 2026-03-18

## 1. Today's Overview

Apache Doris remained highly active over the last 24 hours, with **154 PR updates** and **10 issue updates**, indicating strong ongoing development momentum. Most activity concentrated on **stability fixes, branch backports, external catalog/connectivity work, and storage/file-cache improvements**, rather than on a new release. The project appears healthy from a throughput perspective: **73 PRs were merged/closed** versus **81 still open**, showing steady review and integration flow. At the same time, several newly active bug reports point to continued pressure around **BE crash resilience, external table scanning, materialized view correctness, and memory usage during ingestion**.

## 2. Project Progress

### Merged/closed PRs today: notable advances

#### Storage, cache, and cloud-read reliability
- **Fix segment footer corruption retry path for file cache/cloud reads**  
  PR: [#61386](https://github.com/apache/doris/pull/61386)  
  Backport: [#61425](https://github.com/apache/doris/pull/61425)  
  Doris fixed a retry-path bug where `CORRUPTION` during segment footer parsing failed to trigger file-cache retry logic. This is an important storage-read robustness fix, especially for cloud/object-storage-backed workloads.

- **Fine-grained file-cache control for compaction output**  
  PR: [#60609](https://github.com/apache/doris/pull/60609)  
  Cherry-pick: [#61354](https://github.com/apache/doris/pull/61354)  
  Adds selective caching controls for compaction-generated files, especially “index-only” caching modes in cloud deployments. This signals continued investment in **cache efficiency and write-path cost control**.

#### Metadata consistency and operational tooling
- **Checker enhancement for table/partition version-key consistency**  
  PR: [#54527](https://github.com/apache/doris/pull/54527)  
  This improves FE metadata validation by checking partition/table existence and version relationships. It strengthens diagnosis and recovery for metadata inconsistency scenarios.

- **FE OSS filesystem unified with Jindo**  
  PR: [#61269](https://github.com/apache/doris/pull/61269)  
  Backport: [#61416](https://github.com/apache/doris/pull/61416)  
  Reduces duplicate OSS filesystem implementations on the FE side and standardizes on Jindo FS, likely improving maintainability and lowering classpath/configuration complexity for Alibaba OSS users.

#### Query correctness and SQL/function behavior
- **Fix wrong result of `abs(decimalv2)`**  
  PR: [#61397](https://github.com/apache/doris/pull/61397)  
  Backport: [#61411](https://github.com/apache/doris/pull/61411)  
  A direct SQL correctness fix in built-in function behavior. This is small in scope but important for trust in numeric semantics.

#### Paimon and external ecosystem support
- **Integrate `paimon-cpp` into third-party build system**  
  PR: [#60296](https://github.com/apache/doris/pull/60296)  
- **Install `paimon-cpp` Arrow static deps into isolated dir**  
  PR: [#60730](https://github.com/apache/doris/pull/60730)  
- **Support Paimon JDBC catalog type**  
  PR: [#61094](https://github.com/apache/doris/pull/61094)  

These changes collectively indicate a clear roadmap push toward **native, lower-overhead lakehouse interoperability**, especially reducing JNI dependence and expanding catalog support.

#### Test/build engineering
- **Fix BDB JE resource leak causing FE unit-test timeout**  
  PR: [#61404](https://github.com/apache/doris/pull/61404)  
  Backport: [#61412](https://github.com/apache/doris/pull/61412)  
  This improves CI/test stability and shortens feedback loops.

- **Fix no-space issue while building third parties**  
  PR: [#61415](https://github.com/apache/doris/pull/61415)  
  A build-system quality-of-life fix supporting contributor productivity.

## 3. Community Hot Topics

### 1) Broad SQL function compatibility initiative
- Issue: [#48203](https://github.com/apache/doris/issues/48203) — “Support All SQL Functions in Other SQL System”  
  **127 comments**, by far the hottest issue.

This issue reflects strong long-term demand for **cross-database SQL compatibility**. The updated summary suggests maintainers are reconsidering manual investment because LLM-assisted contribution workflows can now generate acceptable PRs quickly for many of these function gaps. Technically, this indicates:
- users want easier migration from other SQL engines,
- Doris still has function-compatibility deltas that matter in real adoption,
- maintainers may shift from hand-curated implementation to more automation-assisted contribution models.

### 2) Developer productivity and compile-time reduction
- PR: [#61349](https://github.com/apache/doris/pull/61349) — “Reduce hash join build template instantiations”

This open PR reports a compile-time drop for a BE file from **69.6s to 48.9s**, highlighting an internal pain point: C++ template-heavy code is slowing development iteration. The underlying need is not user-facing performance, but **engine developer efficiency** and more manageable BE compile complexity.

### 3) External catalog and connector expansion
- Open PR: [#61325](https://github.com/apache/doris/pull/61325) — Amazon Kinesis support for Routine Load  
- Open issue: [#61388](https://github.com/apache/doris/issues/61388) — custom HTTP headers for REST Iceberg catalog  
- Recent merged PRs around Paimon and MaxCompute: [#61094](https://github.com/apache/doris/pull/61094), [#60895](https://github.com/apache/doris/pull/60895)

The common technical theme is clear: users increasingly treat Doris as part of a **broader lakehouse / streaming / federated analytics stack**, and need first-class interoperability with cloud-native data platforms.

## 4. Bugs & Stability

Ranked by apparent severity and operational impact:

### Critical
1. **BE crash when scanning/loading Iceberg tables**
   - Issue: [#61225](https://github.com/apache/doris/issues/61225)  
   - Symptoms: `SIGSEGV` in `ByteArrayDictDecoder`, `std::out_of_range`, reproducible BE crash on Iceberg read/load in **v4.0.2**.  
   - Severity: High, because it affects external table reliability and can terminate backend processes.  
   - Related fix PR: none obvious in today’s dataset.

2. **BE crash triggered by query**
   - Issue: [#61095](https://github.com/apache/doris/issues/61095)  
   - Symptoms: backend crash in **v4.0.2**.  
   - Severity: High, but issue summary is less specific than #61225.  
   - Related fix PR: none obvious today.

3. **`meta_tool` coredump when handling tablet meta**
   - Issue: [#61447](https://github.com/apache/doris/issues/61447)  
   - Newly opened today.  
   - Severity: High for operators performing low-level metadata repair/inspection; impacts supportability and disaster recovery workflows.  
   - Related fix PR: none visible today.

### High
4. **View `ORDER BY` causes excessive column pruning, producing null/empty columns**
   - Issue: [#61219](https://github.com/apache/doris/issues/61219)  
   - Version: **4.0.1**  
   - Severity: High, because this is a **query correctness bug**, not just a crash. Incorrect results can silently affect downstream analysis.  
   - Related fix PR: none obvious today.

5. **Materialized view rewrite returns different results for logically equivalent SQL**
   - Issue: [#61228](https://github.com/apache/doris/issues/61228)  
   - Version: **4.0.1**  
   - Severity: High, another correctness/trust issue. The user reports a query hitting an MV even when referenced fields are absent from the MV definition, which suggests a rewrite validation bug.  
   - Related fix PR: none obvious today.

### Medium
6. **Flink SQL stream load hits `MEM_LIMIT_EXCEEDED` on Doris 4.0.3**
   - Issue: [#61053](https://github.com/apache/doris/issues/61053)  
   - Severity: Medium to High depending on workload; blocks ingestion pipelines and checkpoint completion.  
   - Related fix PR: none evident today.

### Positive stability signals from merged fixes
- File-cache retry logic fixed: [#61386](https://github.com/apache/doris/pull/61386)
- `abs(decimalv2)` correctness fixed: [#61397](https://github.com/apache/doris/pull/61397)
- FE unit-test resource leak fixed: [#61404](https://github.com/apache/doris/pull/61404)
- Metadata checker strengthened: [#54527](https://github.com/apache/doris/pull/54527)

## 5. Feature Requests & Roadmap Signals

### Strong signals from user requests and open PRs

#### SQL compatibility and function completeness
- Issue: [#48203](https://github.com/apache/doris/issues/48203)  
- PR: [#61352](https://github.com/apache/doris/pull/61352) — support `REGR_ARGX`, `REGR_ARGY`, `REGR_COUNT`, `REGR_R2`

Doris continues moving toward **broader analytical SQL completeness**, especially around statistical functions and migration compatibility with other systems. This is likely to continue into the next minor release.

#### Streaming and ingestion connector expansion
- Open PR: [#61325](https://github.com/apache/doris/pull/61325) — Amazon Kinesis support for Routine Load
- Closed issue: [#9302](https://github.com/apache/doris/issues/9302) — protobuf format for routine load

These suggest a roadmap focused on **more enterprise ingestion sources and wire formats**. Kinesis support feels like a strong candidate for an upcoming release if review progresses.

#### Iceberg interoperability
- Issue: [#61388](https://github.com/apache/doris/issues/61388) — support `header.*` properties for REST Iceberg catalog

This is a practical enterprise request tied to auth/proxy/custom-header environments. Because it maps closely to Iceberg REST catalog expectations and addresses compatibility rather than novel architecture, it has a good chance of near-term adoption.

#### Spill and memory management
- Open PR: [#61212](https://github.com/apache/doris/pull/61212) — multi-level partition spilling

This is one of the more important engine-level feature PRs currently open. It targets reduced peak memory usage in partitioned operators and could materially improve query survivability under pressure. This looks like a **high-impact candidate for the next release line**.

#### External table/catalog write support
- Open PR: [#61443](https://github.com/apache/doris/pull/61443) — `INSERT INTO` for MaxCompute external catalog tables
- Open PR: [#61446](https://github.com/apache/doris/pull/61446) — Parquet metadata TVF backport

These indicate Doris is strengthening both **federated read/write semantics** and **metadata introspection tooling**.

## 6. User Feedback Summary

Based on today’s issues and PRs, user pain points cluster around four themes:

1. **Reliability of external table/lakehouse integration**  
   Iceberg-related crashes ([#61225](https://github.com/apache/doris/issues/61225)) and REST catalog header support requests ([#61388](https://github.com/apache/doris/issues/61388)) show that external catalog support is valuable but still uneven in production edge cases.

2. **Query correctness matters as much as performance**  
   Reports involving view column pruning ([#61219](https://github.com/apache/doris/issues/61219)) and MV rewrite mismatches ([#61228](https://github.com/apache/doris/issues/61228)) reveal that users are sensitive to silent wrong-result scenarios.

3. **Memory pressure is still a practical blocker**  
   Stream load with Flink causing `MEM_LIMIT_EXCEEDED` ([#61053](https://github.com/apache/doris/issues/61053)) aligns with open engine work on spilling ([#61212](https://github.com/apache/doris/pull/61212)). This suggests users need Doris to remain stable under ingestion and mixed analytical load.

4. **Cross-system compatibility keeps driving adoption**  
   The popularity of the SQL-function compatibility issue ([#48203](https://github.com/apache/doris/issues/48203)) plus merged/ongoing work for Paimon, MaxCompute, Iceberg, OSS, and Kinesis indicates that users increasingly evaluate Doris by **how easily it plugs into existing ecosystems**.

## 7. Backlog Watch

Items that appear important and may need maintainer attention:

- **[#48203](https://github.com/apache/doris/issues/48203)** — very high community engagement, but the updated maintainer stance suggests reduced direct investment. It may need clearer scoping, automation guidelines, or a contributor playbook to convert demand into manageable PR flow.
- **[#49020](https://github.com/apache/doris/pull/49020)** — stale open optimization PR on scan filtering. Since it targets skipping unnecessary zone-map/BF calculation, it could still have meaningful scan efficiency value if revived.
- **[#59065](https://github.com/apache/doris/pull/59065)** — file cache admission control has been open since 2025-12-16. Given recent file-cache activity, this long-lived PR may deserve renewed review because it aligns with active subsystem priorities.
- **[#61225](https://github.com/apache/doris/issues/61225)** — reproducible Iceberg BE crash should likely be prioritized due to direct production risk.
- **[#61219](https://github.com/apache/doris/issues/61219)** and **[#61228](https://github.com/apache/doris/issues/61228)** — correctness bugs affecting views and materialized views deserve fast triage because they can undermine confidence in optimizer rewrites.
- **[#61053](https://github.com/apache/doris/issues/61053)** — ingestion memory issues remain strategically important for streaming users and may need documentation, tuning guidance, or engine-level mitigation.

## 8. Project Health Assessment

Overall project health is **active and positive**, with strong engineering throughput and visible work across storage, connectors, correctness, and developer tooling. The most encouraging signal is the number of merged fixes and branch backports, which suggests maintainers are actively stabilizing supported release lines. The main risk area is that several recently updated issues involve **backend crashes or wrong results**, especially in newer 4.0.x usage scenarios and external catalog workflows. In short: Doris is advancing quickly, but current user-facing risk is concentrated in **stability under integration-heavy and optimizer-complex workloads**.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-18

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains extremely active, with clear momentum around **lakehouse interoperability, SQL compatibility, correctness hardening, and operational resilience**. Across engines, the center of gravity is shifting from pure scan/query speed toward **ecosystem fit**: Iceberg/Paimon/Delta integration, cloud object storage behavior, streaming ingestion, and standards-compatible SQL are now major competitive dimensions. Another shared pattern is that mature projects are investing heavily in **stability and backports**, while fast-growing engines are still balancing feature expansion with regression control. Overall, the market is converging on a hybrid model where engines must be both **high-performance analytical runtimes** and **well-behaved components in broader data platforms**.

---

## 2. Activity Comparison

### Daily activity snapshot

| Project | Issues Updated | PRs Updated | New Release Today | Indicative Health Score* | Main Current Signal |
|---|---:|---:|:---:|:---:|---|
| **ClickHouse** | 63 | 414 | No | 8.5/10 | Very high throughput, active SQL compatibility and storage hardening, but noisy CI/storage regressions |
| **Apache Doris** | 10 | 154 | No | 8.2/10 | Strong merge/backport flow, connector and cache work, but notable crash/correctness pressure in 4.0.x |
| **StarRocks** | 3 | 117 | No | 8.1/10 | Healthy maintenance across branches, focused on HA, connectors, and correctness fixes |
| **DuckDB** | 23 | 51 | No | 8.0/10 | Post-1.5 stabilization, fast response to regressions, especially S3/Parquet and binder issues |
| **Apache Iceberg** | 20 | 43 | No | 8.0/10 | Spec and integration momentum, likely patch-release prep, some unresolved migration/interoperability issues |
| **Apache Arrow** | 31 | 19 | No | 7.9/10 | Healthy packaging/tooling maintenance, especially Python and Windows |
| **Velox** | 4 | 46 | No | 7.8/10 | Strong subsystem development, especially storage/connectors/RPC, but integration complexity remains high |
| **Delta Lake** | 2 | 21 | No | 7.8/10 | Focused Kernel and Spark correctness work, lower visible community volume but solid technical progress |
| **Databend** | 5 | 12 | No | 7.4/10 | Good engine iteration speed, but multiple panic-level SQL bugs lower short-term confidence |
| **Apache Gluten** | 8 | 15 | No | 7.4/10 | Active optimization/backend work, but OOM and simple-query regression concerns remain |

\*Health score is a qualitative synthesis of throughput, responsiveness, stability signals, and backlog risk from the digest data.

### Interpretation
- **Highest raw activity:** ClickHouse, Doris, StarRocks
- **Most visible stabilization phase:** DuckDB, Doris, StarRocks
- **Spec/platform layer activity:** Iceberg, Arrow, Delta, Velox
- **Higher short-term risk despite progress:** Databend, Gluten

---

## 3. Apache Doris's Position

### Where Doris stands out
Apache Doris currently sits in the **top tier of repository activity**, behind only ClickHouse in this comparison and ahead of most direct analytical DB peers in daily PR flow. Its strongest advantages versus peers are:

- **Balanced engine + platform posture**: Doris is not only optimizing core storage/query behavior, but also expanding external connectivity across **Iceberg, Paimon, MaxCompute, OSS/Jindo, Kinesis**, and cloud cache paths.
- **Strong maintenance discipline**: visible backports and cherry-picks suggest active support for release branches, a positive sign for production users.
- **Broadening lakehouse compatibility**: current work around `paimon-cpp`, JDBC catalog support, REST Iceberg requests, and external table writes indicates Doris is moving toward a more native federated analytics role.

### Where peers currently look stronger
- **ClickHouse** still leads in raw community scale and engineering throughput.
- **DuckDB** has stronger mindshare in embedded/local analytics and developer workflows.
- **StarRocks** appears comparably strong in cloud/lakehouse and enterprise operational integration.
- **Iceberg/Delta** remain stronger as ecosystem standards/spec layers rather than query engines.

### Technical approach differences
Compared with peers:
- **Doris** is positioning itself as a **full analytical database with native storage plus federated/lakehouse access**, rather than as only a file-format layer or embedded engine.
- Relative to **ClickHouse**, Doris appears more visibly focused on **external catalog interoperability and cloud-cache behavior**, while ClickHouse still emphasizes deep engine internals and SQL/runtime breadth.
- Relative to **DuckDB**, Doris is far more cluster/platform oriented.
- Relative to **StarRocks**, Doris is similarly aimed at distributed analytics, but current Doris activity shows somewhat more visible attention on **file cache, external catalogs, and metadata recovery tooling**.

### Community size comparison
By today’s signals:
- **Larger/stronger activity than** DuckDB, Databend, Delta Lake, Velox, Gluten, Arrow, Iceberg
- **Roughly comparable class with** StarRocks, though Doris showed higher PR activity today
- **Below ClickHouse** in contributor/review throughput and visible community scale

### Doris caution areas
Its main near-term weakness versus top peers is not lack of momentum, but **risk concentration in crashes and wrong-result bugs**, especially:
- Iceberg scan/load BE crash
- query-triggered BE crashes
- MV rewrite correctness
- view pruning correctness
- stream load memory pressure

These are important because the ecosystem increasingly values **trust and integration reliability** as much as speed.

---

## 4. Shared Technical Focus Areas

Several technical requirements are now appearing across multiple engines.

### A. Lakehouse / external catalog interoperability
**Engines:** Doris, ClickHouse, StarRocks, DuckDB, Iceberg, Delta, Velox, Gluten  
**Specific needs:**
- Iceberg correctness and DDL safety: Doris, ClickHouse, StarRocks, Velox, Gluten
- Paimon integration: Doris, StarRocks
- MaxCompute/external catalog write support: Doris
- REST catalog/API maturity: Doris, Iceberg
- Spark/Delta/Iceberg semantics alignment: Delta, Iceberg, Gluten, Velox

**Signal:** Analytical engines are increasingly expected to operate inside mixed-format lakehouse environments, not just against native tables.

### B. SQL compatibility and migration friendliness
**Engines:** Doris, ClickHouse, StarRocks, DuckDB, Gluten, Velox  
**Specific needs:**
- broader SQL function coverage: Doris
- parser/standards aliases (`SOME`, `OVERLAPS`, timezone syntax): ClickHouse
- `GROUP BY ALL`: StarRocks
- trigger groundwork and nicer SQL ergonomics: DuckDB
- ANSI mode parity with Spark: Gluten
- Spark-compatible date formatting: Velox

**Signal:** SQL compatibility is becoming a product requirement for adoption, especially behind BI tools, ORMs, generated SQL, and migration projects.

### C. Correctness over pure performance
**Engines:** Doris, ClickHouse, DuckDB, StarRocks, Velox, Delta, Iceberg  
**Specific needs:**
- wrong-result optimizer/MV/view issues: Doris, StarRocks
- storage/DDL correctness regressions: ClickHouse
- binder/index correctness regressions: DuckDB
- protocol/schema correctness: Delta
- migration and namespace correctness: Iceberg
- temporal semantic correctness: Velox

**Signal:** Silent correctness issues are treated as top-tier severity across the ecosystem.

### D. Memory management and spill behavior
**Engines:** Doris, StarRocks, DuckDB, Databend, Gluten, ClickHouse  
**Specific needs:**
- multi-level spill / reduced peak memory: Doris
- exchange buffer and memory accounting control: StarRocks
- optimizer-induced OOM regressions: DuckDB
- hash join cleanup: Databend
- OOM in joins/distinct aggregation: Gluten
- query cache and execution pressure concerns: ClickHouse

**Signal:** Users want engines to degrade gracefully under pressure, not simply fail faster.

### E. Operational observability and maintainability
**Engines:** ClickHouse, Doris, StarRocks, Arrow, Iceberg  
**Specific needs:**
- session/connection observability: ClickHouse
- metadata checker and repair tooling: Doris
- richer system metadata: StarRocks
- packaging/build reliability: Arrow
- lock config/docs and operational controls: Iceberg

**Signal:** Production readiness now includes introspection, supportability, and predictable tooling.

### F. Developer productivity / build complexity
**Engines:** Doris, ClickHouse, Arrow, Velox  
**Specific needs:**
- compile-time reduction in template-heavy code: Doris, ClickHouse
- packaging/build backend modernization: Arrow
- dependency and build system simplification: Velox

**Signal:** Mature C++-heavy systems are increasingly investing in contributor efficiency.

---

## 5. Differentiation Analysis

## A. Storage format posture

| Engine | Primary Storage Model | Role in Stack |
|---|---|---|
| **Apache Doris** | Native analytical storage + federated external catalogs | Full OLAP DB with growing lakehouse reach |
| **ClickHouse** | Native columnar storage, strong internal engine identity | High-performance OLAP DB |
| **DuckDB** | Embedded DB, file-centric analytics over Parquet/object storage | In-process analytics engine |
| **StarRocks** | Distributed analytical DB with strong external table/lakehouse links | Cloud/data-platform OLAP engine |
| **Iceberg** | Open table format/metadata layer | Storage/table spec, not query engine |
| **Delta Lake** | Transaction log and table protocol | Lakehouse table layer, Spark-centric but broadening |
| **Databend** | Cloud-native analytical DB | Warehouse-style engine |
| **Velox** | Execution engine/runtime layer | Embedded query execution substrate |
| **Gluten** | Spark acceleration layer | Execution backend bridge, not standalone DB |
| **Arrow** | Columnar in-memory format + libraries | Data interchange/runtime foundation |

### Doris implication
Doris competes most directly with **ClickHouse** and **StarRocks**, while also overlapping partially with **DuckDB** for lake query scenarios and depending on standards like **Iceberg/Arrow** for interoperability.

## B. Query engine design differences
- **Doris / ClickHouse / StarRocks / Databend**: standalone analytical databases
- **DuckDB**: embedded/in-process analytical engine
- **Velox / Gluten**: execution substrate/acceleration, typically beneath another system
- **Iceberg / Delta / Arrow**: ecosystem infrastructure, not direct OLAP database competitors

### Doris implication
Doris benefits from owning both **query engine and storage/database semantics**, which gives it more product surface than format/runtime projects, but also more correctness burden.

## C. Target workload differences
- **Doris / StarRocks**: distributed BI, mixed ingestion + analytics, external catalog federation
- **ClickHouse**: high-throughput OLAP, large-scale event/log analytics, aggressive engine tuning
- **DuckDB**: notebook/local analytics, data lake exploration, embedded analytics
- **Iceberg / Delta**: lakehouse metadata, governance, multi-engine table access
- **Gluten / Velox**: acceleration under Spark or other systems

### Doris implication
Doris is well positioned where users want:
- a serving database,
- distributed SQL,
- real-time or recurring ingestion,
- and increasingly, access to external lakehouse data.

## D. SQL compatibility posture
- **Strong active push:** Doris, ClickHouse, Gluten, StarRocks
- **Developer-ergonomics SQL evolution:** DuckDB
- **Protocol/schema consistency focus:** Delta, Iceberg
- **Spark semantic alignment:** Velox, Gluten, Delta

### Doris implication
Doris’s large SQL function compatibility thread is strategically important: it signals real migration demand and remains a competitive necessity against ClickHouse and increasingly SQL-friendly cloud/lakehouse systems.

---

## 6. Community Momentum & Maturity

### Activity tiers

#### Tier 1: Very high momentum
- **ClickHouse**
- **Apache Doris**
- **StarRocks**

These projects show the strongest combination of PR velocity, subsystem breadth, and ongoing maintenance. They appear suitable for organizations that value active evolution and broad capability growth, but they also carry the churn risks of fast-moving codebases.

#### Tier 2: High but more focused momentum
- **DuckDB**
- **Apache Iceberg**
- **Apache Arrow**
- **Velox**
- **Delta Lake**

These are active and strategically important, but each has a narrower center of gravity:
- DuckDB: engine stabilization + embedded analytics evolution
- Iceberg: spec/catalog/integration maturity
- Arrow: language/runtime/package foundation
- Velox: execution engine internals
- Delta: protocol/Kernel/Spark modernization

#### Tier 3: Emerging or more risk-weighted momentum
- **Databend**
- **Apache Gluten**

These projects are moving quickly, but current issue patterns show more visible instability or architectural dependency risk.

### Rapid iteration vs stabilization
**Rapidly iterating:**
- ClickHouse
- Doris
- StarRocks
- Velox
- Databend

**Currently stabilizing / hardening:**
- DuckDB
- Doris
- StarRocks
- Arrow
- Delta
- Iceberg

### Maturity signal
The most mature projects are those balancing **throughput with backports and operational fixes**:
- ClickHouse
- Doris
- StarRocks
- Iceberg
- Arrow

Doris scores well here because it is not only active, but also visibly maintaining release lines.

---

## 7. Trend Signals

### 1) The industry is converging on “open engine + open table format + cloud object storage”
This is the strongest cross-project signal. For data engineers and architects, this means engine selection should now be evaluated less in isolation and more by:
- Iceberg/Delta/Paimon interoperability,
- object storage behavior,
- external catalog support,
- metadata correctness under federation.

### 2) SQL compatibility is now a go-to-market feature
Projects are responding to migration friction from PostgreSQL, Spark SQL, legacy warehouses, and BI-generated SQL. For buyers, this reduces adoption cost and rewrites; for maintainers, it shifts investment toward parser/function completeness and semantic parity.

### 3) Wrong results and crash resilience matter more than microbenchmarks
Many of today’s highest-severity items are about:
- optimizer rewrite correctness,
- DDL crashes,
- scan/load failures,
- silent empty reads,
- protocol mismatches.

For architects, this is a reminder that production evaluation should emphasize:
- edge-case correctness testing,
- upgrade regression coverage,
- integration-specific QA,
not just benchmark throughput.

### 4) Memory governance and spill strategy are strategic differentiators
As workloads mix ingestion, joins, federation, and lake scans, engines are being judged on survivability under pressure. This is especially relevant for:
- multi-tenant deployments,
- streaming + BI coexistence,
- cloud cost-sensitive clusters.

### 5) Observability and supportability are becoming first-class requirements
Community demand increasingly includes:
- system tables,
- connection visibility,
- metadata checkers,
- toolchain reliability,
- better error surfacing.

This benefits operators directly and lowers total cost of ownership.

### 6) Ecosystem layering is becoming clearer
A practical architecture pattern is emerging:
- **Arrow** for interchange/runtime
- **Iceberg/Delta** for table semantics
- **Velox/Gluten** for execution acceleration
- **Doris/ClickHouse/StarRocks/Databend/DuckDB** for end-user analytical serving

For decision-makers, this means product choices are less binary than before; many deployments will combine multiple layers.

---

## Bottom Line for Apache Doris

Apache Doris is currently in a **strong competitive position**: high development velocity, visible branch maintenance, active interoperability expansion, and increasing relevance as a distributed analytical engine in mixed lakehouse environments. Its best differentiators today are **balanced engine/database functionality plus growing external ecosystem support**. The main execution risk is that its current bug pressure is concentrated in exactly the areas the industry now values most—**external table reliability, correctness, and memory stability**. If Doris continues converting its high throughput into rapid fixes for those areas, it remains one of the strongest open-source analytical engine platforms to watch.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-18

## 1. Today's Overview

ClickHouse remained highly active over the last 24 hours: **63 issues** were updated and **414 pull requests** saw activity, with **148 PRs merged or closed**. That volume suggests a project in intense development mode, with simultaneous work on **stability hardening, SQL compatibility, storage internals, and test coverage**. No new release was published today, so the visible momentum is concentrated in trunk development, backports, and bug triage rather than packaging. Overall health looks **strong but noisy**: contributor throughput is high, yet CI crash reports and a few correctness/regression issues indicate ongoing pressure in MergeTree, Iceberg, and query/runtime edge cases.

## 2. Project Progress

With **148 PRs merged/closed**, today’s progress appears to be concentrated in four areas:

- **SQL compatibility improvements** are advancing quickly. A notable signal is the immediate implementation PR for `SOME` as an alias for `ANY` in quantified comparisons: [PR #99831](https://github.com/ClickHouse/ClickHouse/pull/99831), following [Issue #99601](https://github.com/ClickHouse/ClickHouse/issues/99601). This shows the team is responsive to low-risk standards-alignment requests.
- **Storage engine and DDL robustness**, especially around **Iceberg**, continues to receive attention. Automated backports are open for a critical crash fix during `ALTER TABLE REMOVE SETTING` on Iceberg: [PR #99762](https://github.com/ClickHouse/ClickHouse/pull/99762) and [PR #99411](https://github.com/ClickHouse/ClickHouse/pull/99411).
- **Execution engine and optimizer work** is moving forward. Examples include AND-chain simplification and contradiction pruning in [PR #99736](https://github.com/ClickHouse/ClickHouse/pull/99736), plus distributed scan/task tuning via [PR #99801](https://github.com/ClickHouse/ClickHouse/pull/99801).
- **Test infrastructure and regression coverage** remain a major investment theme. PRs such as [#96130](https://github.com/ClickHouse/ClickHouse/pull/96130), [#99640](https://github.com/ClickHouse/ClickHouse/pull/99640), [#99701](https://github.com/ClickHouse/ClickHouse/pull/99701), and [#99705](https://github.com/ClickHouse/ClickHouse/pull/99705) show a deliberate strategy of converting edge-case failures into durable tests.

A small but important closed item is [Issue #29703](https://github.com/ClickHouse/ClickHouse/issues/29703), about allowing ALTER of columns with skipping indices by rebuilding indices. Its closure suggests some long-standing DDL usability debt may finally be getting resolved or superseded.

## 3. Community Hot Topics

### 1) New runtime observability request: `system.connections`
- [Issue #60670](https://github.com/ClickHouse/ClickHouse/issues/60670) — **6 comments, 5 👍**
- Technical need: operators want a system table showing **current client connections, source addresses, protocol, and active query context**.
- Why it matters: this is a classic operational gap for multi-tenant and production clusters. It would improve **debugging, abuse detection, session tracing, and support workflows**.
- Signal: strong practical value despite being labeled “minor”; likely to remain relevant until native session/connection introspection is improved.

### 2) Query cache behavior under concurrency
- [Issue #99226](https://github.com/ClickHouse/ClickHouse/issues/99226) — **5 comments**
- Technical need: avoid **thundering herd/cache stampede** in the query result cache.
- Why it matters: users increasingly expect cache behavior suitable for dashboard bursts and repeated analytical reads. This is less about raw speed than about **tail latency and backend load collapse prevention**.
- Signal: this has clear product value and implementation tractability; likely candidate for future cache subsystem work.

### 3) DDL reliability regression in clusters
- [Issue #95316](https://github.com/ClickHouse/ClickHouse/issues/95316) — **5 comments**
- Technical need: `DDLWorker` reliability for `ON CLUSTER` tasks since 25.8.
- Why it matters: distributed DDL is foundational for operational trust. Regressions here directly affect schema rollout automation.
- Signal: this is a high-importance issue for enterprise users, even with limited reactions.

### 4) SQL compatibility push
Several new standards-compatibility requests appeared together:
- [Issue #99601](https://github.com/ClickHouse/ClickHouse/issues/99601) — support `SOME`
- [Issue #99612](https://github.com/ClickHouse/ClickHouse/issues/99612) — `SET TIME ZONE INTERVAL ...` and `SET SESSION CHARACTERISTICS`
- [Issue #99602](https://github.com/ClickHouse/ClickHouse/issues/99602) — `OVERLAPS`
- [Issue #99603](https://github.com/ClickHouse/ClickHouse/issues/99603) — `SET TIME ZONE 'tz'`
- [Issue #99604](https://github.com/ClickHouse/ClickHouse/issues/99604) — `OVERLAY(...)`
- Technical need: smoother interoperability with **PostgreSQL-oriented clients, ORMs, migration tools, and SQL generators**.
- Signal: this looks less like isolated asks and more like a coordinated compatibility track.

### 5) Large feature in progress: Arrow Flight SQL
- [PR #91170](https://github.com/ClickHouse/ClickHouse/pull/91170)
- Technical need: modern high-performance connectivity for BI and data tooling.
- Why it matters: Arrow Flight SQL would strengthen ClickHouse’s role in low-latency analytical ecosystems and client interoperability.
- Signal: long-running, substantial feature work with strategic importance.

## 4. Bugs & Stability

Ranked by likely severity and user impact:

### Critical
1. **Server crash on Iceberg ALTER COMMENT**
   - [Issue #99523](https://github.com/ClickHouse/ClickHouse/issues/99523)
   - `ALTER TABLE ... MODIFY COLUMN ... COMMENT` on Iceberg causes **null pointer dereference / server crash**.
   - Severity is high because it is **user-triggerable**, affects a strategic table format, and involves DDL.
   - Related context: multiple Iceberg crash fixes/backports are active, including [PR #99762](https://github.com/ClickHouse/ClickHouse/pull/99762) and [PR #99411](https://github.com/ClickHouse/ClickHouse/pull/99411), though these target a different ALTER path.

2. **Distributed DDL regression**
   - [Issue #95316](https://github.com/ClickHouse/ClickHouse/issues/95316)
   - `DDLWorker` fails `ON CLUSTER` task execution since 25.8.
   - Severity is high due to cluster-wide operational impact and upgrade/regression implications.

3. **Potential query correctness problem: missing results**
   - [Issue #87091](https://github.com/ClickHouse/ClickHouse/issues/87091)
   - Closed, but notable because it involved **missing results possibly tied to query condition cache**.
   - Correctness bugs are among the most serious classes in OLAP systems. Closure may indicate triage, fix, non-repro, or duplicate handling, but the topic deserves watching.

### High
4. **Client hangs on exit under restricted privileges**
   - [Issue #99694](https://github.com/ClickHouse/ClickHouse/issues/99694)
   - `clickhouse-client` may hang on exit when user lacks `SELECT ON *.*`, apparently due to metadata lock interaction on `system.columns`.
   - This is a sharp usability/security-edge regression: not data-loss critical, but very visible and harmful in restricted-user environments.

5. **`merge` function fails with schema mismatch across merged tables**
   - [Issue #86393](https://github.com/ClickHouse/ClickHouse/issues/86393)
   - Affects merged access when columns are not present in all underlying tables, especially outside MergeTree.
   - Important for federated or heterogeneous query patterns.

### Medium
6. **WASM UDF unsupported in Materialized Views**
   - [Issue #99789](https://github.com/ClickHouse/ClickHouse/issues/99789)
   - More of a feature gap than a bug, but important for advanced extensibility users.

7. **Code size/performance concern in type-dispatch templates**
   - [Issue #99792](https://github.com/ClickHouse/ClickHouse/issues/99792)
   - Indicates compile/runtime efficiency debt in heavily instantiated template dispatch logic.

### CI / internal stability noise
Multiple crash-CI reports point to continued instability in MergeTree/background execution paths:
- [Issue #99830](https://github.com/ClickHouse/ClickHouse/issues/99830) — double deletion of `MergeTreeDataPartCompact`
- [Issue #99358](https://github.com/ClickHouse/ClickHouse/issues/99358) — `MergeTreeRangeReader` finalize failed
- [Issue #98630](https://github.com/ClickHouse/ClickHouse/issues/98630) — `ExpressionActions` execution failed
- [Issue #99649](https://github.com/ClickHouse/ClickHouse/issues/99649) — double/invalid free in `MergeTreeData` destruction
- [Issue #99650](https://github.com/ClickHouse/ClickHouse/issues/99650) — vertical merge preparation failed
- [Issue #99800](https://github.com/ClickHouse/ClickHouse/issues/99800) — mutation command processing failure
- [Issue #99826](https://github.com/ClickHouse/ClickHouse/issues/99826) — compact part destruction/index issue

These are not always user-facing defects, but collectively they suggest **ongoing stress in storage lifecycle, mutation, merge, and destruction paths**.

## 5. Feature Requests & Roadmap Signals

### Strong near-term candidates
1. **`SOME` as alias for `ANY`**
   - Issue: [#99601](https://github.com/ClickHouse/ClickHouse/issues/99601)
   - Implementation already open: [PR #99831](https://github.com/ClickHouse/ClickHouse/pull/99831)
   - Prediction: **very likely** in the next version.

2. **SQL timezone syntax compatibility**
   - [Issue #99603](https://github.com/ClickHouse/ClickHouse/issues/99603)
   - [Issue #99612](https://github.com/ClickHouse/ClickHouse/issues/99612)
   - Prediction: **likely**, because these are parser-level compatibility wins with strong ecosystem value.

3. **`OVERLAPS` and `OVERLAY`**
   - [Issue #99602](https://github.com/ClickHouse/ClickHouse/issues/99602)
   - [Issue #99604](https://github.com/ClickHouse/ClickHouse/issues/99604)
   - Prediction: **possible**, especially if compatibility work continues as a bundle.

### Mid-term roadmap signals
4. **Connection/session observability**
   - [Issue #60670](https://github.com/ClickHouse/ClickHouse/issues/60670)
   - Prediction: good candidate for a future ops-focused release, though not clearly imminent.

5. **Query cache anti-stampede controls**
   - [Issue #99226](https://github.com/ClickHouse/ClickHouse/issues/99226)
   - Prediction: likely medium-term; useful but requires careful concurrency semantics.

6. **JSON native-type function expansion**
   - [Issue #82981](https://github.com/ClickHouse/ClickHouse/issues/82981) — `jsonMergePatch` with `JSON` type
   - [PR #99802](https://github.com/ClickHouse/ClickHouse/pull/99802) — JSON path optimization
   - Prediction: JSON ergonomics are steadily improving and should remain active.

7. **WASM UDF integration depth**
   - [Issue #99789](https://github.com/ClickHouse/ClickHouse/issues/99789)
   - Prediction: strategically interesting, but likely behind core correctness/stability work.

8. **Arrow Flight SQL**
   - [PR #91170](https://github.com/ClickHouse/ClickHouse/pull/91170)
   - Prediction: significant but probably not “next patch” material; more likely a notable feature in a future minor release.

## 6. User Feedback Summary

The strongest user feedback today clusters around a few practical themes:

- **Operational visibility is still lacking**. Users want to know **who is connected, from where, and what they are running**: [Issue #60670](https://github.com/ClickHouse/ClickHouse/issues/60670).
- **Compatibility friction with external SQL tools remains real**. The burst of requests around `SOME`, timezone syntax, `OVERLAPS`, and `OVERLAY` indicates that ClickHouse is being placed behind more generic SQL clients and migration tooling: [#99601](https://github.com/ClickHouse/ClickHouse/issues/99601), [#99612](https://github.com/ClickHouse/ClickHouse/issues/99612), [#99602](https://github.com/ClickHouse/ClickHouse/issues/99602), [#99603](https://github.com/ClickHouse/ClickHouse/issues/99603), [#99604](https://github.com/ClickHouse/ClickHouse/issues/99604).
- **Cluster and DDL reliability matter deeply to production users**. Regressions in `ON CLUSTER` execution and Iceberg ALTER behavior are exactly the kind of issues that can block upgrades or enterprise adoption: [#95316](https://github.com/ClickHouse/ClickHouse/issues/95316), [#99523](https://github.com/ClickHouse/ClickHouse/issues/99523).
- **Performance expectations are evolving beyond throughput**. Users now care about **cache stampede prevention**, template/code-size efficiency, and distributed read tuning: [#99226](https://github.com/ClickHouse/ClickHouse/issues/99226), [#99792](https://github.com/ClickHouse/ClickHouse/issues/99792), [PR #99801](https://github.com/ClickHouse/ClickHouse/pull/99801).

Overall, user sentiment implied by the issues is not “ClickHouse is too slow”; it is more “ClickHouse needs to be easier to operate, more standards-compatible, and safer in edge-case DDL/storage scenarios.”

## 7. Backlog Watch

These older items look important enough to deserve maintainer attention:

1. **`system.connections` observability**
   - [Issue #60670](https://github.com/ClickHouse/ClickHouse/issues/60670)
   - Open since **2024-03-01**.
   - High operator value; modest scope compared with impact.

2. **Parallel replicas tail-latency optimization**
   - [PR #69782](https://github.com/ClickHouse/ClickHouse/pull/69782)
   - Open since **2024-09-19**.
   - Important performance work, but likely hard to review due to correctness risk in replica coordination.

3. **Arrow Flight SQL support**
   - [PR #91170](https://github.com/ClickHouse/ClickHouse/pull/91170)
   - Open since **2025-12-01**.
   - Strategically significant connector/protocol work; long-running PR suggests integration complexity.

4. **Multiple authentication methods in users.xml**
   - [PR #91998](https://github.com/ClickHouse/ClickHouse/pull/91998)
   - Open since **2025-12-11**.
   - Relevant for enterprise auth flexibility; marked manual approval / testable, so likely waiting on explicit maintainer review.

5. **`merge` function schema inconsistency**
   - [Issue #86393](https://github.com/ClickHouse/ClickHouse/issues/86393)
   - Open since **2025-08-28**.
   - Impacts correctness/ergonomics for heterogeneous table unions.

6. **JSON native-type support for `jsonMergePatch`**
   - [Issue #82981](https://github.com/ClickHouse/ClickHouse/issues/82981)
   - Open since **2025-07-01**.
   - Fits broader JSON roadmap and would improve native JSON usability.

## Closing Assessment

Today’s repository activity points to a **healthy but aggressively moving codebase**. The strongest positives are rapid PR throughput, active backporting for critical fixes, and visible momentum on SQL compatibility. The main caution is continued churn in **MergeTree internals, CI crash signatures, and DDL/storage regressions**, especially around Iceberg and distributed DDL. If current trends continue, the next version is likely to deliver **incremental SQL compatibility wins and robustness fixes** rather than a major release headline.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-18

## 1. Today’s Overview

DuckDB had another very active day: **23 issues** and **51 PRs** were updated in the last 24 hours, with **20 PRs closed/merged** and **10 issues closed**. The dominant theme is **post-1.5.0 stabilization**, especially around **S3/httpfs behavior, Hive-partitioned Parquet performance/regressions, binder/query-correctness errors, and index consistency problems**. At the same time, the project is still advancing substantive feature work, including **geometry/CRS support, parser/trigger groundwork, join optimization, and row-group pruning improvements**. Overall project health looks **busy but responsive**: multiple serious regressions are being reproduced quickly, and at least one concrete fix path is already visible for the S3/Hive-partition regression cluster.

---

## 3. Project Progress

### Query engine and optimizer improvements
Several closed/merged PRs indicate continued progress on execution and optimization work:

- **Prefix Range Filter for join pushdown** was merged in [#21279](https://github.com/duckdb/duckdb/pull/21279). This extends join-side filtering beyond bloom filters, signaling ongoing work on **more selective, lower-overhead join pruning** for analytical workloads.
- **Row group pruning for `NULLS_FIRST` / `NULLS_LAST`** landed in [#21399](https://github.com/duckdb/duckdb/pull/21399), improving pruning behavior in ordered scans and likely helping **sorting/window-heavy analytical queries**.
- The long-running **GEOMETRY rework with CRS support** was closed in [#20143](https://github.com/duckdb/duckdb/pull/20143). This is a notable roadmap milestone for **spatial type maturity and standards compatibility**.

### Storage and file access improvements
The strongest storage-related signal today is around Parquet/httpfs:

- [#21435](https://github.com/duckdb/duckdb/pull/21435) fixes **Parquet metadata cache invalidation in the local filesystem**, addressing wasted cache misses due to version-tag mismatch behavior.
- [#21439](https://github.com/duckdb/duckdb/pull/21439) improves **Parquet multi-file reader parallelism** by moving scan preparation outside a global lock, which should benefit **multi-file and remote lakehouse-style scans**.

### Spatial and extension compatibility
- [#21333](https://github.com/duckdb/duckdb/pull/21333) fixes reading **GeoParquet with null CRS**, an important compatibility correction for real-world geospatial datasets.
- [#21440](https://github.com/duckdb/duckdb/pull/21440) bumps **spatial for v1.5.2**, suggesting active patch-version preparation.

### SQL surface area / parser groundwork
- Trigger-related parser/catalog work is progressing in open PRs:
  - [#21438](https://github.com/duckdb/duckdb/pull/21438) adds catalog storage and introspection for `CREATE TRIGGER`
  - [#21434](https://github.com/duckdb/duckdb/pull/21434) adds PEG parser support for `DROP TRIGGER`

Even though not merged yet, these are strong signals of **future SQL DDL expansion**.

---

## 4. Community Hot Topics

### 1) S3 + Hive-partitioned Parquet regression in v1.5.0
- Issue: [#21347](https://github.com/duckdb/duckdb/issues/21347) — “Hive partition filters discover all files before pruning in 1.5.0”
- Related issue: [#21385](https://github.com/duckdb/duckdb/issues/21385) — “CREATE VIEW with S3-Bucket, Hive-Partitioned Parquet Data takes very long | v1.5.0 Regression”
- Likely fix PR: [#21437](https://github.com/duckdb/duckdb/pull/21437) — httpfs bump explicitly claiming fixes for both issues

This is the clearest community hotspot today. Users running DuckDB against **remote object stores with partitioned Parquet lakes** need file pruning to happen **before expensive discovery/download work**. The underlying technical need is improved **metadata-aware planning and remote scan initialization efficiency**, especially for data-lake usage patterns where listing all objects is prohibitively expensive.

### 2) Binder/internal query correctness regressions after 1.5.0
- [#21304](https://github.com/duckdb/duckdb/issues/21304) — closed, reproduced
- [#21372](https://github.com/duckdb/duckdb/issues/21372) — closed, reproduced
- [#21419](https://github.com/duckdb/duckdb/issues/21419) — open, needs triage
- [#21407](https://github.com/duckdb/duckdb/issues/21407) — closed, reproduced

These point to a recurring theme: **planner/binder regressions on previously working SQL**, including joins, subqueries, and extension-involved workloads. The technical need here is **query rewrite safety and broader regression coverage**, particularly across complex nested plans.

### 3) Index integrity / mutation correctness
- [#21394](https://github.com/duckdb/duckdb/issues/21394) — open, reproduced
- [#21390](https://github.com/duckdb/duckdb/issues/21390) — closed, reproduced
- [#20952](https://github.com/duckdb/duckdb/issues/20952) — closed, reproduced

Users are surfacing failures around sequences of **UPDATE / CREATE INDEX / DELETE / INSERT OR REPLACE**, with symptoms ranging from **corruption errors to stale indexed values**. This reflects an underlying need for stronger **index maintenance invariants under mixed OLAP/OLTP-like mutations**.

### 4) Collation correctness
- [#19675](https://github.com/duckdb/duckdb/issues/19675) — UNIQUE constraint ignores collation
- [#21364](https://github.com/duckdb/duckdb/issues/21364) — Repeat `PushCollation`

These reports suggest users increasingly expect DuckDB to behave like a fully polished SQL engine in **text/collation semantics**, especially for constraints and ordering.

---

## 5. Bugs & Stability

Ranked by likely severity and user impact:

### Critical
1. **Potential memory corruption / crash on index creation**
   - Issue: [#21390](https://github.com/duckdb/duckdb/issues/21390)  
   - Symptom: `free(): corrupted unsorted chunks`, corrupted double-linked list  
   - Status: closed, reproduced  
   This is severe because it implies **native memory corruption**, not just SQL-level failure.

2. **Index inconsistency after UPDATE + CREATE INDEX leading to DELETE failures**
   - Issue: [#21394](https://github.com/duckdb/duckdb/issues/21394)  
   - Symptom: internal errors, false unique violations, corrupted ART index  
   - Status: open, reproduced  
   Serious correctness/stability risk for users doing mutable workloads.

3. **Floating point exception / core dump**
   - Issue: [#21429](https://github.com/duckdb/duckdb/issues/21429)  
   - Status: open, needs triage  
   Any reproducible core dump is high severity even if triggered by edge-case SQL.

### High
4. **S3/Hive-partitioned Parquet regression in 1.5.0**
   - [#21347](https://github.com/duckdb/duckdb/issues/21347)
   - [#21385](https://github.com/duckdb/duckdb/issues/21385)
   - Candidate fix: [#21437](https://github.com/duckdb/duckdb/pull/21437)

   High impact because this affects a major DuckDB use case: **querying data lakes on object storage**.

5. **Binder/internal errors on valid queries after upgrading to 1.5.0**
   - [#21419](https://github.com/duckdb/duckdb/issues/21419)
   - [#21304](https://github.com/duckdb/duckdb/issues/21304)
   - [#21372](https://github.com/duckdb/duckdb/issues/21372)
   - [#21407](https://github.com/duckdb/duckdb/issues/21407)

   These are significant because they break **query compatibility across versions**.

6. **Changed ETag false-positive on object storage**
   - Issue: [#21401](https://github.com/duckdb/duckdb/issues/21401)  
   This appears to be a correctness/robustness problem in **remote file freshness validation**, likely affecting S3-compatible deployments.

### Medium
7. **OOM caused by TopN Window Elimination**
   - Issue: [#21431](https://github.com/duckdb/duckdb/issues/21431)  
   - Status: open, reproduced  
   Important optimizer regression: performance optimization becomes a **memory amplification problem**.

8. **ConversionException when filtering Parquet with decoded JSON BLOB**
   - Issue: [#21425](https://github.com/duckdb/duckdb/issues/21425)  
   Indicates expression ordering or pushdown/type-resolution problems on mixed **Parquet + JSON extraction** workloads.

9. **`read_avro` mishandling union types**
   - Issue: [#21444](https://github.com/duckdb/duckdb/issues/21444)  
   Potentially impactful for users expecting broader Avro interoperability.

10. **Password leak in Python client exception text**
   - Issue: [#21420](https://github.com/duckdb/duckdb/issues/21420)  
   - Status: closed  
   Security-sensitive, though likely quickly addressed.

### Lower severity but notable correctness/usability
- [#19675](https://github.com/duckdb/duckdb/issues/19675) — UNIQUE constraint ignores collation
- [#21436](https://github.com/duckdb/duckdb/issues/21436) — CLI strips spaces from `STRUCT` string values
- [#21289](https://github.com/duckdb/duckdb/issues/21289) — internal error with HuggingFace-derived Parquet + `LIMIT`

---

## 6. Feature Requests & Roadmap Signals

### Clear roadmap signals from active PRs
1. **Trigger support is advancing**
   - [#21438](https://github.com/duckdb/duckdb/pull/21438)
   - [#21434](https://github.com/duckdb/duckdb/pull/21434)

   This is one of the strongest feature signals in the current queue. It looks like DuckDB is laying down **catalog + parser foundations first**, suggesting trigger support is moving from idea toward implementation, though probably not fully user-ready immediately.

2. **Nicer SQL variable syntax**
   - [#21194](https://github.com/duckdb/duckdb/pull/21194)

   This would improve interactive SQL ergonomics and make DuckDB feel more natural in notebook/CLI contexts.

3. **Config allow-listing under locked configurations**
   - [#20938](https://github.com/duckdb/duckdb/pull/20938)

   This is a practical enterprise/security feature, especially relevant for embedded deployments and controlled execution environments.

4. **Static build portability improvements**
   - Issue: [#21424](https://github.com/duckdb/duckdb/issues/21424)

   This is a roadmap signal around **distribution/toolchain resilience**, especially for Linux consumers who need older glibc compatibility.

### Most likely to appear in the next patch/minor cycle
- **httpfs/S3/Hive-partition fixes** via [#21437](https://github.com/duckdb/duckdb/pull/21437)
- **Parquet scan/cache fixes** via [#21435](https://github.com/duckdb/duckdb/pull/21435) and [#21439](https://github.com/duckdb/duckdb/pull/21439)
- **Spatial patch updates** via [#21440](https://github.com/duckdb/duckdb/pull/21440)

These look more likely for **v1.5.x** than trigger support, which feels more like a **future minor-version feature track**.

---

## 7. User Feedback Summary

### Main pain points
- **Upgrade regressions from 1.4.4 to 1.5.0** are the biggest user complaint today, especially for:
  - S3/httpfs + Hive-partitioned Parquet workloads ([#21347](https://github.com/duckdb/duckdb/issues/21347), [#21385](https://github.com/duckdb/duckdb/issues/21385))
  - query binding/planning correctness ([#21419](https://github.com/duckdb/duckdb/issues/21419), [#21407](https://github.com/duckdb/duckdb/issues/21407))
- Users continue pushing DuckDB in **production-style object storage and lakehouse scenarios**, not just local analytics.
- There is also visible usage in **geospatial analytics**, **Python client embedding**, **Avro/Parquet ingestion**, and **JSON-in-column** patterns.

### Positive signals
- Maintainers appear to be **reproducing and closing issues quickly**, which is healthy for a stabilization period.
- Concrete fix PRs are already in flight for the most visible remote-storage regressions.
- Spatial support continues to mature, indicating DuckDB is still shipping meaningful capability growth while handling regressions.

---

## 8. Backlog Watch

These items appear important and likely deserving maintainer attention:

1. **Collation-aware uniqueness still open**
   - [#19675](https://github.com/duckdb/duckdb/issues/19675)  
   Open since 2025-11-06, reproduced. This is a real SQL correctness gap affecting constraints.

2. **Configuration allow-listing PR awaiting maintainer approval**
   - [#20938](https://github.com/duckdb/duckdb/pull/20938)  
   Marked ready to merge but still open. Useful for security-conscious embedded deployments.

3. **Nicer variable syntax PR needs documentation**
   - [#21194](https://github.com/duckdb/duckdb/pull/21194)  
   A quality-of-life SQL feature that could be easy to lose in the churn despite clear user value.

4. **TopN Window Elimination OOM**
   - [#21431](https://github.com/duckdb/duckdb/issues/21431)  
   Newly reported, but should be watched closely because optimizer-induced OOMs can affect production workloads unpredictably.

5. **`read_avro` union type support/correctness**
   - [#21444](https://github.com/duckdb/duckdb/issues/21444)  
   Fresh issue, but important if DuckDB wants stronger positioning as a broad analytical ingestion engine.

---

## Link Index

### Issues
- [#21347](https://github.com/duckdb/duckdb/issues/21347)
- [#19675](https://github.com/duckdb/duckdb/issues/19675)
- [#21390](https://github.com/duckdb/duckdb/issues/21390)
- [#21385](https://github.com/duckdb/duckdb/issues/21385)
- [#21372](https://github.com/duckdb/duckdb/issues/21372)
- [#21400](https://github.com/duckdb/duckdb/issues/21400)
- [#21304](https://github.com/duckdb/duckdb/issues/21304)
- [#21394](https://github.com/duckdb/duckdb/issues/21394)
- [#21420](https://github.com/duckdb/duckdb/issues/21420)
- [#21370](https://github.com/duckdb/duckdb/issues/21370)
- [#21364](https://github.com/duckdb/duckdb/issues/21364)
- [#21289](https://github.com/duckdb/duckdb/issues/21289)
- [#20977](https://github.com/duckdb/duckdb/issues/20977)
- [#21407](https://github.com/duckdb/duckdb/issues/21407)
- [#21401](https://github.com/duckdb/duckdb/issues/21401)
- [#21429](https://github.com/duckdb/duckdb/issues/21429)
- [#20952](https://github.com/duckdb/duckdb/issues/20952)
- [#21444](https://github.com/duckdb/duckdb/issues/21444)
- [#21436](https://github.com/duckdb/duckdb/issues/21436)
- [#21431](https://github.com/duckdb/duckdb/issues/21431)
- [#21425](https://github.com/duckdb/duckdb/issues/21425)
- [#21424](https://github.com/duckdb/duckdb/issues/21424)
- [#21419](https://github.com/duckdb/duckdb/issues/21419)

### PRs
- [#20143](https://github.com/duckdb/duckdb/pull/20143)
- [#21437](https://github.com/duckdb/duckdb/pull/21437)
- [#21439](https://github.com/duckdb/duckdb/pull/21439)
- [#21438](https://github.com/duckdb/duckdb/pull/21438)
- [#21434](https://github.com/duckdb/duckdb/pull/21434)
- [#21333](https://github.com/duckdb/duckdb/pull/21333)
- [#21435](https://github.com/duckdb/duckdb/pull/21435)
- [#21279](https://github.com/duckdb/duckdb/pull/21279)
- [#21399](https://github.com/duckdb/duckdb/pull/21399)
- [#20938](https://github.com/duckdb/duckdb/pull/20938)
- [#21410](https://github.com/duckdb/duckdb/pull/21410)
- [#21432](https://github.com/duckdb/duckdb/pull/21432)
- [#21413](https://github.com/duckdb/duckdb/pull/21413)
- [#21433](https://github.com/duckdb/duckdb/pull/21433)
- [#21414](https://github.com/duckdb/duckdb/pull/21414)
- [#21268](https://github.com/duckdb/duckdb/pull/21268)
- [#21194](https://github.com/duckdb/duckdb/pull/21194)

If you want, I can also turn this into a **short executive summary**, a **release-manager oriented risk report**, or a **table of issues grouped by subsystem**.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-18

## 1. Today's Overview

StarRocks remained highly active over the last 24 hours, with **117 pull requests updated** and **3 issues updated**, indicating strong ongoing engineering throughput even though no new release was cut today. Activity was concentrated on **bug fixing, backports, connector compatibility, memory accounting, transaction correctness, and test stability** rather than headline feature launches. The merged/closed PR mix suggests the team is in a **hardening and maintenance-heavy phase**, especially across maintained branches **3.5, 4.0, and 4.1**. Overall project health looks solid from a delivery perspective, but several items point to continued attention needed around **query correctness, external catalog robustness, and operational resilience**.

## 2. Project Progress

Today’s merged/closed work mainly advanced **operability, system visibility, Arrow Flight stability, and multi-version maintenance**.

### System metadata and observability
- **Expose warehouse name in `task_runs` system table** was merged and backported:
  - [PR #70312](https://github.com/StarRocks/starrocks/pull/70312)
  - [PR #70391](https://github.com/StarRocks/starrocks/pull/70391)
- This improves operational observability in multi-warehouse environments by making task execution metadata easier to attribute and audit.

### Arrow Flight ecosystem maturity
A cluster of closed PRs shows continued investment in **Arrow Flight reliability and deployability**:
- **Query ID collision fix** for concurrent multi-threaded Arrow Flight SQL usage:
  - [PR #65488](https://github.com/StarRocks/starrocks/pull/65488)
  - [PR #65558](https://github.com/StarRocks/starrocks/pull/65558)
- **Context reset fix** for sequential Arrow Flight queries:
  - [PR #65644](https://github.com/StarRocks/starrocks/pull/65644)
- **Support Arrow Flight data retrieval from inaccessible nodes**:
  - [PR #66348](https://github.com/StarRocks/starrocks/pull/66348)
  - backport/doc-related: [PR #67211](https://github.com/StarRocks/starrocks/pull/67211), [PR #67210](https://github.com/StarRocks/starrocks/pull/67210)
- **FE query proxy handling fix**:
  - [PR #67794](https://github.com/StarRocks/starrocks/pull/67794)

This is a meaningful signal that StarRocks is improving support for **enterprise network topologies, proxy-based access, and concurrent client workloads**.

### Documentation and ecosystem enablement
- **Airflow documentation** was also closed in the visible set:
  - [PR #64895](https://github.com/StarRocks/starrocks/pull/64895)
- While not an engine change, this helps strengthen orchestration and platform integration positioning.

## 3. Community Hot Topics

Below are the most visible active items from today’s data, selected by practical importance, reactions, and likely user impact.

### 1) `GROUP BY ALL` SQL syntax support
- [Issue #69953](https://github.com/StarRocks/starrocks/issues/69953) — **OPEN**
- Labels: `type/enhancement`, `good first issue`
- Signals:
  - 4 👍 reactions
  - Request to infer grouping columns from non-aggregate SELECT expressions

**Why it matters:**  
This is a classic **SQL ergonomics / compatibility** request. Analysts and BI users frequently evolve SELECT lists, and manually synchronizing `GROUP BY` clauses is error-prone. Demand here suggests users want StarRocks to reduce boilerplate and align better with familiar SQL dialect behavior.

### 2) Adaptive partition hash join crash / wrong results
- [Issue #70349](https://github.com/StarRocks/starrocks/issues/70349) — **OPEN**
- Bug in `JoinHashTable::merge_ht()` when expression-based join keys are involved

**Why it matters:**  
This is the most serious newly reported issue because it combines two high-risk traits: **possible crash** and **wrong query results**. The underlying technical need is stronger correctness coverage for **expression-derived join keys under adaptive execution paths**.

### 3) Iceberg compaction lineage support
- [PR #70128](https://github.com/StarRocks/starrocks/pull/70128) — **OPEN**
- Adds support for writing Iceberg row lineage fields (`_row_id`, `_last_updated_sequence_number`) into data files during compaction

**Why it matters:**  
This is a roadmap signal toward deeper **Iceberg v3+ compatibility** and better metadata fidelity during maintenance operations. It speaks directly to lakehouse interoperability and update-tracking use cases.

### 4) FE leader-switch transaction correctness
- [PR #70285](https://github.com/StarRocks/starrocks/pull/70285) — **OPEN**
- Fixes explicit transaction state loss after FE leader switch

**Why it matters:**  
This reflects operational concerns in HA deployments. Users need predictable transaction semantics even during failover events, so this PR addresses a core production-readiness requirement.

## 4. Bugs & Stability

Ranked by severity based on impact described in the issue/PR summaries.

### Critical
#### 1) Adaptive partition hash join may crash or return wrong results
- [Issue #70349](https://github.com/StarRocks/starrocks/issues/70349) — **OPEN**
- Problem: `JoinHashTable::merge_ht()` reportedly fails to merge expression-based key columns correctly
- Impact: **engine crash** or **incorrect query results**
- Scope: joins with expression-based keys under adaptive partition hash join

**Assessment:** Highest-severity item in today’s issue set because correctness bugs in joins directly affect trust in analytical outputs. No direct fix PR is listed in the provided data yet.

### High
#### 2) Explicit transaction state loss on FE leader switch
- [PR #70285](https://github.com/StarRocks/starrocks/pull/70285) — **OPEN**
- Impact:
  - stale transaction IDs on connections
  - silent COMMIT/ROLLBACK failures
  - possible NPE on BEGIN

**Assessment:** This is a significant HA/transaction correctness bug. A fix is in progress, which is a positive sign.

#### 3) `query_pool` memory tracker going negative during ingestion
- [PR #70228](https://github.com/StarRocks/starrocks/pull/70228) — **OPEN**
- Affects versions `3.5`, `4.0`, `4.1`
- Impact: inaccurate memory accounting and potentially misleading memory management decisions

**Assessment:** Not necessarily user-visible corruption, but dangerous operationally because memory tracking drives capacity and stability decisions.

### Medium
#### 4) FileSystemExpirationChecker can block on slow HDFS close
- [PR #70311](https://github.com/StarRocks/starrocks/pull/70311) — **OPEN**
- Impact:
  - lock contention
  - requests for same filesystem can stall
  - single-threaded expiration checker can become stuck

**Assessment:** Important for external storage and HDFS-heavy environments; this is a resilience/scalability fix.

#### 5) Paimon catalog refresh crashes on `ObjectTable`
- [PR #70224](https://github.com/StarRocks/starrocks/pull/70224) — **OPEN**
- Problem: `ClassCastException` in metadata refresh daemon
- Impact: refresh of all tables in that external catalog may stop

**Assessment:** Strong signal that external catalog support still has edge-case fragility.

### Low / Test Stability
#### 6) Unit test instability around metrics and lake replication
- [PR #70368](https://github.com/StarRocks/starrocks/pull/70368) — **OPEN**
- [PR #70390](https://github.com/StarRocks/starrocks/pull/70390) — **OPEN**

**Assessment:** These don’t affect users directly, but they indicate regressions or flaky testing introduced by recent changes, which can slow release hardening.

## 5. Feature Requests & Roadmap Signals

### SQL compatibility and usability
- [Issue #69953](https://github.com/StarRocks/starrocks/issues/69953) — `GROUP BY ALL`
  
This is the clearest user-facing SQL request in today’s issue set. Because it is tagged **good first issue** and has positive reactions, it looks like a feature with a **reasonable chance of landing in an upcoming minor release**, especially if maintainers view it as syntax-layer work with limited planner risk.

### Lakehouse and table format interoperability
- [PR #70128](https://github.com/StarRocks/starrocks/pull/70128) — Iceberg row lineage fields during compaction

This is a strong roadmap signal for **deeper Iceberg semantics support**, especially for environments using lineage-aware updates and compaction pipelines. This kind of work is likely to matter in the next version if StarRocks continues pushing into managed lakehouse workloads.

### Connector/type mapping improvements
- [PR #70315](https://github.com/StarRocks/starrocks/pull/70315) — Oracle JDBC type mapping enhancement

This suggests ongoing demand for better **federation and connector compatibility**, especially around temporal type mapping. Such changes often accumulate quietly but materially improve adoption in mixed enterprise environments.

### Execution memory governance
- [PR #70393](https://github.com/StarRocks/starrocks/pull/70393) — config to limit local exchange buffer growth

This points to a roadmap interest in **predictable resource control** for parallel execution operators. It is the kind of enhancement likely to be valuable in production-scale workloads and may be prioritized if users are hitting memory spikes in union-heavy plans.

## 6. User Feedback Summary

The last 24 hours show several recurring user pain points:

- **SQL ergonomics:** Users want simpler query authoring and fewer maintenance burdens when evolving BI-style aggregations, as seen in the `GROUP BY ALL` request.
- **Correctness first:** Reports involving **wrong results**, silent transaction failures, and stale state after failover indicate that users are sensitive not just to performance but to reliability under complex execution and HA scenarios.
- **External ecosystem compatibility:** Iceberg, Paimon, Oracle JDBC, HDFS, Arrow Flight, and Airflow all appear in current activity, showing that StarRocks is used as part of a larger data platform rather than as a standalone engine.
- **Operational transparency:** The merged `task_runs` warehouse metadata enhancement suggests users need richer system tables for debugging, governance, and multi-tenant administration.
- **Enterprise deployment realism:** Arrow Flight proxy work and inaccessible-node support reflect real-world deployment constraints such as Kubernetes, private networking, and restricted direct node access.

Overall, user feedback signals that StarRocks is valued for broad analytical platform integration, but users still need stronger guarantees around **edge-case correctness and operational resilience**.

## 7. Backlog Watch

These items deserve maintainer attention either because of severity, age, or roadmap significance.

### High-priority open issue
- [Issue #70349](https://github.com/StarRocks/starrocks/issues/70349) — adaptive hash join crash/wrong results  
  This should receive fast triage because wrong-result bugs in join processing can undermine confidence in the engine.

### Promising but still open enhancement
- [Issue #69953](https://github.com/StarRocks/starrocks/issues/69953) — `GROUP BY ALL` support  
  Not urgent, but it has visible user interest and clear usability payoff.

### Important open operational fixes
- [PR #70285](https://github.com/StarRocks/starrocks/pull/70285) — FE leader switch transaction state handling
- [PR #70228](https://github.com/StarRocks/starrocks/pull/70228) — negative `query_pool` memory accounting
- [PR #70311](https://github.com/StarRocks/starrocks/pull/70311) — HDFS close blocking expiration checker
- [PR #70224](https://github.com/StarRocks/starrocks/pull/70224) — Paimon refresh daemon crash
- [PR #70128](https://github.com/StarRocks/starrocks/pull/70128) — Iceberg lineage compaction support

These open PRs are strategically important because they touch **HA correctness, memory governance, external storage/catalog stability, and lakehouse interoperability**.

## 8. Overall Health Assessment

StarRocks appears **engineering-healthy and highly active**, with substantial branch maintenance and a strong stream of bug fixes and backports. The current pattern suggests the project is focused less on broad new releases and more on **production hardening across connectors, metadata systems, distributed transactions, and execution engine edge cases**. The main risk area visible today is **query correctness under complex join execution**, followed by **operational robustness under failover and external-system latency/failure conditions**. If the open correctness and stability fixes land quickly, the near-term outlook remains strong.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-18

## 1. Today's Overview

Apache Iceberg had another high-activity day, with **20 issues** and **43 pull requests** updated in the last 24 hours, indicating sustained development momentum across core metadata, Spark/Flink/Kafka integrations, REST catalog work, and Parquet performance. Activity appears **healthy and engineering-heavy**, with notable attention on **V4 manifest evolution**, **REST/OpenAPI expansion**, **Spark 4.1 fixes**, and **patch-release backports for 1.10.x correctness/security**. There were **no new releases today**, but multiple backport and release-prep items suggest the project is moving toward a **1.10.2 patch release**. Overall, the signal is of a project balancing **forward-looking spec work** with **operational hardening** for production users.

## 3. Project Progress

### Merged/closed PRs and related issue closures today

Several closed items indicate progress on documentation, release maintenance, and configuration behavior:

- **Table-level override for scan planning merged** via PR [#15572](https://github.com/apache/iceberg/pull/15572)  
  This advances **core scan-planning configurability**, likely helping operators tune read planning behavior per table instead of relying only on global settings. That is meaningful for mixed workloads where latency-sensitive and throughput-heavy tables need different planning strategies.

- **HadoopTables lock manager configuration docs completed** via PR [#15522](https://github.com/apache/iceberg/pull/15522), closing issue [#15493](https://github.com/apache/iceberg/issues/15493)  
  This improves **operability/documentation quality** for HadoopTables users by documenting the `iceberg.tables.hadoop.` prefix used to pass lock-related settings.

- **Docs package fix for GCSFileIO completed** via PR [#14711](https://github.com/apache/iceberg/pull/14711)  
  Small, but useful for users integrating **Google Cloud Storage FileIO**, reducing setup confusion.

- **Patch-release maintenance moved forward** through closed backport tracking issues:
  - [#15600](https://github.com/apache/iceberg/issues/15600) — backport equality delete schema ordering fix to 1.10
  - [#15606](https://github.com/apache/iceberg/issues/15606) — backport Avro 1.12.1 upgrade to 1.10 for CVE remediation

### What areas are advancing

From the open PR stream, today's engineering center of gravity is clear:

- **Storage engine and metadata evolution**
  - V4 manifest support continues in [#14533](https://github.com/apache/iceberg/pull/14533), [#15049](https://github.com/apache/iceberg/pull/15049), and [#15634](https://github.com/apache/iceberg/pull/15634)
  - These are foundational for future metadata scalability and likely important to the “single-file commit” direction.

- **Parquet performance optimization**
  - [#15410](https://github.com/apache/iceberg/pull/15410) adds vectorized read support for **RLE-encoded Parquet v2 data pages**, a material performance improvement area for analytics scans.

- **REST catalog and OpenAPI expansion**
  - [#15528](https://github.com/apache/iceberg/pull/15528) and [#15669](https://github.com/apache/iceberg/pull/15669) add **batch load endpoints for tables and views**
  - [#15280](https://github.com/apache/iceberg/pull/15280) adds staged-table credential refresh support

- **Engine compatibility and correctness**
  - Spark 4.1 async microbatch fixes in [#15670](https://github.com/apache/iceberg/pull/15670)
  - REST scan schema/projection correctness in [#15609](https://github.com/apache/iceberg/pull/15609)
  - DV validation pruning optimization in [#15653](https://github.com/apache/iceberg/pull/15653)

## 4. Community Hot Topics

### Most active and notable discussions

- **Delete operations not using dedicated delete thread pool** — issue [#12590](https://github.com/apache/iceberg/issues/12590)  
  Even though this was closed as stale, it had the **highest comment count among issues (11)**. The underlying need is clear: users care about **correct thread-pool isolation and predictable delete execution performance**, especially in maintenance-heavy or high-concurrency environments.

- **Support Hive3 when using Iceberg with Spark** — issue [#14082](https://github.com/apache/iceberg/issues/14082)  
  This remains open and points to a real compatibility gap between **Spark’s isolated Hive classloader model** and Iceberg integration. The technical need is stronger **metastore/classloading interoperability** for enterprise Spark deployments.

- **Null partition handling during Hive migration** — issue [#15332](https://github.com/apache/iceberg/issues/15332)  
  This is one of the more important active correctness reports because it affects **table migration workflows**, especially from legacy Hive datasets with special null-partition markers like `__HIVE_DEFAULT_PARTITION__`.

- **Vectorized Parquet RLE reads** — PR [#15410](https://github.com/apache/iceberg/pull/15410)  
  This is a major performance-oriented contribution. It reflects a user need for **faster analytical scans**, especially where Parquet v2 encodings are common and current vectorization paths leave performance on the table.

- **Materialized View specification work** — PR [#11041](https://github.com/apache/iceberg/pull/11041) and closed WIP PR [#15000](https://github.com/apache/iceberg/pull/15000)  
  This remains a long-running roadmap topic. The demand behind it is clear: users want **native semantics for derived analytical objects** beyond tables and basic views.

- **REST batch load endpoints for tables/views** — PRs [#15528](https://github.com/apache/iceberg/pull/15528) and [#15669](https://github.com/apache/iceberg/pull/15669)  
  This suggests growing demand for **lower-latency, more efficient REST catalog operations**, likely from environments with high object counts or catalog-heavy metadata operations.

### Technical needs behind the discussion

The hot topics cluster around four themes:

1. **Operational performance** — thread pools, vectorized reads, DV validation pruning  
2. **Enterprise interoperability** — Spark/Hive3, Flink naming behavior, GCS/S3 edge cases  
3. **Catalog/API maturity** — REST batch operations, staged-table credential refresh  
4. **Spec evolution** — V4 manifests and materialized views

## 5. Bugs & Stability

### Highest-severity active bugs and correctness risks

#### 1. Hive migration null partition correctness
- **Issue:** [#15332](https://github.com/apache/iceberg/issues/15332) — Null partition handling of hive migration  
- **Severity:** High  
- **Why it matters:** Migration bugs can produce **incorrect partition interpretation** and potentially broken table state during onboarding from Hive. This directly affects adoption and data correctness.
- **Fix PR:** None visible in today’s data.

#### 2. Flink connector silent empty reads with namespace usage
- **Issue:** [#15668](https://github.com/apache/iceberg/issues/15668) — Table name mismatch causes silent empty reads when using `USE namespace`  
- **Severity:** High  
- **Why it matters:** “Silent empty reads” are dangerous because they can look like valid zero-row results rather than an explicit failure. This is a classic **query correctness / observability** issue for Flink SQL users.
- **Fix PR:** None visible in today’s data.

#### 3. Spark SQL ambiguity with dotted column names
- **Issue:** [#13807](https://github.com/apache/iceberg/issues/13807) — “Ambiguous” column name with dot  
- **Severity:** Medium-High  
- **Why it matters:** This affects **SQL compatibility and schema edge cases**, especially for migrated or generated schemas that include special characters.

#### 4. `rewrite_position_delete_files` fails when table has a column named `partition`
- **Issue:** [#14056](https://github.com/apache/iceberg/issues/14056)  
- **Severity:** Medium-High  
- **Why it matters:** This blocks a **maintenance procedure** on valid schemas due to naming collision with reserved/internal semantics.

#### 5. Security exposure in Kafka Connect shaded dependency
- **Issue:** [#15621](https://github.com/apache/iceberg/issues/15621) — GHSA on shaded `jackson-core` in `parquet-jackson`  
- **Severity:** Medium-High  
- **Why it matters:** This is not a functional correctness bug, but a **supply-chain/security risk** for Kafka Connect runtime distributions. Users in regulated environments will care.
- **Fix context:** Security backport work is visible generally via [#15606](https://github.com/apache/iceberg/issues/15606), though not this exact Jackson issue.

#### 6. Estimated table size inaccurate
- **Issue:** [#15664](https://github.com/apache/iceberg/issues/15664)  
- **Severity:** Medium  
- **Why it matters:** Impacts **planning/cost estimation** rather than correctness. But poor estimates can degrade optimization decisions in Spark-based workflows.

### Recently closed but notable stability items

- [#12590](https://github.com/apache/iceberg/issues/12590) — delete thread pool usage, closed stale rather than visibly fixed
- [#13982](https://github.com/apache/iceberg/issues/13982) — S3 URI curly brace path issue, closed stale
- [#13995](https://github.com/apache/iceberg/issues/13995) — Kafka Connect coordinator offset reset, closed stale

A notable health signal: several bugs were closed as **stale**, not clearly resolved, which may leave real user pain points unaddressed.

## 6. Feature Requests & Roadmap Signals

### Active feature requests and likely roadmap direction

- **Arrow-to-Iceberg type mapping documentation** — issue [#15666](https://github.com/apache/iceberg/issues/15666)  
  Small in scope, likely to land quickly as docs, especially given related momentum in Python/Arrow ecosystems.

- **GCS connection/read timeout configurability** — issue [#15587](https://github.com/apache/iceberg/issues/15587)  
  Strong operational value. This seems like a practical candidate for an upcoming minor release because it is **self-contained and cloud-operator friendly**.

- **Parquet VariantVisitor for MERGE INTO support** — issue [#14707](https://github.com/apache/iceberg/issues/14707)  
  This aligns with broader work around **VARIANT support** and engine write-path completeness.

- **Spark + Hive3 support** — issue [#14082](https://github.com/apache/iceberg/issues/14082)  
  Larger and trickier due to classloader interactions. Important, but less likely to land quickly unless a dedicated compatibility approach emerges.

- **Kafka Connect VARIANT conversion support** — PR [#15283](https://github.com/apache/iceberg/pull/15283)  
  This suggests growing demand for **semi-structured ingestion** into Iceberg through Kafka pipelines.

- **Flink passthroughRecords option for DynamicIcebergSink** — PR [#15433](https://github.com/apache/iceberg/pull/15433)  
  Strong signal that the project is investing in **throughput optimization for streaming ingestion**.

- **REST batch load endpoints** — PRs [#15528](https://github.com/apache/iceberg/pull/15528), [#15669](https://github.com/apache/iceberg/pull/15669)  
  Likely to appear in a future release because both spec and Java implementation are actively progressing in parallel.

- **Materialized Views** — PR [#11041](https://github.com/apache/iceberg/pull/11041)  
  Still strategic and important, but likely medium-term rather than immediate.

### Prediction: what may appear in the next version

Most likely candidates for the next near-term release or patch/minor update:

1. **1.10.2 patch release** with backports around correctness/security  
   - signaled by [#15600](https://github.com/apache/iceberg/issues/15600) and [#15599](https://github.com/apache/iceberg/issues/15599)

2. **Operational and API improvements**
   - table-level scan planning override from [#15572](https://github.com/apache/iceberg/pull/15572)
   - REST batch loading from [#15528](https://github.com/apache/iceberg/pull/15528) / [#15669](https://github.com/apache/iceberg/pull/15669)

3. **Performance work**
   - Parquet vectorized RLE reads from [#15410](https://github.com/apache/iceberg/pull/15410)
   - DV validation pruning from [#15653](https://github.com/apache/iceberg/pull/15653)

## 7. User Feedback Summary

Today’s user feedback highlights several recurring production concerns:

- **Migration friction remains real**, especially from Hive to Iceberg, as shown by [#15332](https://github.com/apache/iceberg/issues/15332). Users need migration behavior to be fully compatible with legacy partition conventions.

- **Enterprise integration pain is still significant**, especially around **Spark + Hive3 classloading** in [#14082](https://github.com/apache/iceberg/issues/14082), and **Flink SQL namespace/table resolution** in [#15668](https://github.com/apache/iceberg/issues/15668).

- **Streaming users want both correctness and throughput**, visible in:
  - Kafka Connect throughput discussion [#13399](https://github.com/apache/iceberg/issues/13399)
  - Kafka Connect security/dependency concerns [#15621](https://github.com/apache/iceberg/issues/15621)
  - Flink sink throughput optimization PR [#15433](https://github.com/apache/iceberg/pull/15433)

- **Users care about practical operability**, not just features:
  - timeouts for GCS reads [#15587](https://github.com/apache/iceberg/issues/15587)
  - lock manager documentation [#15493](https://github.com/apache/iceberg/issues/15493)
  - more accurate size estimation [#15664](https://github.com/apache/iceberg/issues/15664)

- **Advanced data type support is gaining importance**, especially around **VARIANT** and Arrow interoperability:
  - [#14707](https://github.com/apache/iceberg/issues/14707)
  - [#15283](https://github.com/apache/iceberg/pull/15283)
  - [#15666](https://github.com/apache/iceberg/issues/15666)

Overall sentiment from the issue mix suggests users see Iceberg as powerful and production-worthy, but still encounter **rough edges in connector behavior, compatibility, and operational tuning**.

## 8. Backlog Watch

### Important older items needing maintainer attention

- **Materialized View Spec** — PR [#11041](https://github.com/apache/iceberg/pull/11041)  
  Long-running and strategically important. It likely needs continued spec shepherding to avoid stagnation.

- **V4 Manifest Read Support** — PR [#14533](https://github.com/apache/iceberg/pull/14533)  
  Foundational for future metadata architecture. Important enough that slow progress here could delay broader V4 adoption.

- **Foundational V4 manifest types** — PR [#15049](https://github.com/apache/iceberg/pull/15049)  
  This appears tightly linked to the long-term metadata roadmap and deserves sustained review bandwidth.

- **Support Hive3 when using Iceberg with Spark** — issue [#14082](https://github.com/apache/iceberg/issues/14082)  
  Old enough and important enough to merit more direct maintainer guidance, even if not immediately fixable.

- **Connector throughput decreased after higher `tasks.max`** — issue [#13399](https://github.com/apache/iceberg/issues/13399)  
  This points to a practical production tuning problem in Kafka Connect that likely affects more users than reported.

- **`rewrite_position_delete_files` fails with column named `partition`** — issue [#14056](https://github.com/apache/iceberg/issues/14056)  
  Low-comment but important because it blocks a maintenance path on a legal schema.

- **Parquet VariantVisitor for MERGE INTO** — issue [#14707](https://github.com/apache/iceberg/issues/14707)  
  Worth attention due to its linkage to broader VARIANT and MERGE feature completeness.

### Maintainer attention risk

A recurring concern is the number of issues closed as **stale** rather than visibly resolved, including [#12590](https://github.com/apache/iceberg/issues/12590), [#13982](https://github.com/apache/iceberg/issues/13982), [#13995](https://github.com/apache/iceberg/issues/13995), and [#13959](https://github.com/apache/iceberg/issues/13959). While normal for a busy project, this can obscure whether user-reported production issues were invalid, superseded, or simply under-triaged.

## Bottom line

Iceberg is showing strong momentum in **core metadata evolution, REST catalog maturity, Parquet performance, and streaming integrations**. The near-term release signal points to **1.10.2 patch work**, while the medium-term roadmap is clearly shaped by **V4 manifests, materialized views, and richer connector semantics**. The biggest health watchpoints are **migration correctness**, **engine interoperability**, and the proportion of user bugs that age out via stale closure rather than explicit resolution.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-18

## 1. Today's Overview

Delta Lake showed **high pull request activity but low issue volume** over the last 24 hours: 21 PRs were updated, versus only 2 issues, and no new release was published. The center of gravity is clearly on **Kernel and Spark integration work**, especially around DSv2, table feature correctness, conflict resolution, row tracking, and metadata validation. Several PRs were closed today, indicating steady forward movement on **stability and SQL/connector correctness**, even if no release cut has happened yet. Overall, project health looks **active and engineering-driven**, with the main signals pointing to protocol compliance, connector maturation, and stronger correctness guarantees rather than headline end-user features.

## 2. Project Progress

### Merged/closed PRs today
The following PRs were closed in the last 24 hours and collectively advanced Delta Lake’s execution, schema correctness, and engine compatibility work:

- [#6297](https://github.com/delta-io/delta/pull/6297) — **[kernel-spark] Fix a potential resource leak in SparkMicroBatchStream**  
  This is a meaningful streaming stability fix. Resource leaks in micro-batch stream readers can degrade long-running jobs and are especially important for production structured streaming deployments.

- [#6299](https://github.com/delta-io/delta/pull/6299) — **[Spark] Check NullType inside UDTs**  
  This improves schema validation correctness for streaming and Spark-side type handling. It suggests continued hardening of edge-case schema validation where user-defined types can hide unsupported `NullType` values.

- [#6166](https://github.com/delta-io/delta/pull/6166) — **[Delta-Spark] Extend stagingCatalog for non-Spark session catalog**  
  This is a SQL/catalog interoperability improvement. It points to broader support for atomic table replacement / staging workflows outside the default Spark session catalog path.

- [#5884](https://github.com/delta-io/delta/pull/5884) — **[KERNEL] Disable creating `MapType` with non-SPARK.UTF8_BINARY collated key**  
  This strengthens schema/protocol safety in the Kernel layer. Restricting map key collations avoids unsupported or inconsistent semantics that could otherwise cause correctness issues across engines.

- [#6302](https://github.com/delta-io/delta/pull/6302) — **[Experimental] [Kernel] Add type widening metadata removal and query methods**  
  Even though marked experimental, this contributes to schema evolution hygiene by letting the system detect and strip type widening metadata recursively. It is a building block for more robust metadata management.

- [#6303](https://github.com/delta-io/delta/pull/6303) — **[Experimental] [Kernel] Add case-insensitive column name normalization on write path**  
  This is highly relevant to cross-engine compatibility because Delta protocol semantics are case-insensitive for column identity. The closure may indicate the work was superseded, revised, or split, but the topic remains active and important.

### What this means technically
Today’s closed work advanced three themes:

1. **Streaming/runtime robustness**  
   Through the micro-batch resource leak fix in [#6297](https://github.com/delta-io/delta/pull/6297).

2. **Schema and metadata correctness**  
   Through stricter validation around `NullType`, collation restrictions, and type widening metadata in [#6299](https://github.com/delta-io/delta/pull/6299), [#5884](https://github.com/delta-io/delta/pull/5884), and [#6302](https://github.com/delta-io/delta/pull/6302).

3. **Catalog/SQL compatibility expansion**  
   Through non-default catalog support in [#6166](https://github.com/delta-io/delta/pull/6166), which is important for modern lakehouse deployments with layered catalog infrastructure.

## 3. Community Hot Topics

Because comment counts are sparse in the provided PR data, the most meaningful “hot topics” are the items with visible comments plus the highest strategic importance.

### 1) Case-insensitive schema handling in Kernel
- Issue: [#6247](https://github.com/delta-io/delta/issues/6247) — **fix: Java Kernel data skipping uses case-sensitive column matching**
- Related PR: [#6303](https://github.com/delta-io/delta/pull/6303) — **case-insensitive column name normalization on write path**

**Why it matters:**  
This is the clearest current correctness issue. Delta protocol semantics treat column names as case-insensitive, but the Java Kernel data skipping path appears to resolve columns using case-sensitive matching. That can lead to **missed data skipping opportunities**, incorrect predicate resolution behavior, or inconsistent semantics between Spark and Kernel-based readers/writers.

**Underlying technical need:**  
The project needs **uniform case-insensitive field resolution across all execution paths**: read-time predicate pushdown/data skipping, write-time schema alignment, nested field traversal, and metadata validation. This is especially critical as Delta Kernel is used by more engines besides Spark.

### 2) DSv2 and connector modernization
- PR: [#6230](https://github.com/delta-io/delta/pull/6230) — **[DSv2] Add executor writer: DataWriter, DeltaWriterCommitMessage**
- PR: [#6308](https://github.com/delta-io/delta/pull/6308) — **[DO_NOT_MERGE][kernel-spark] Refactor delta source metadata tracking log for DSv2**
- PR: [#6294](https://github.com/delta-io/delta/pull/6294) — **[kernel-spark] Migrate DeltaSourceDeletionVectorsSuite to v2**

**Why it matters:**  
These are strong roadmap signals that Delta’s Spark integration is being pushed further into **DataSource V2 architecture**. That typically improves commit semantics, execution planning modularity, testability, and interoperability with evolving Spark APIs.

**Underlying technical need:**  
Users want Delta to behave as a **first-class modern table source/sink** in Spark. DSv2 migration is foundational for future support in write paths, source tracking, conflict handling, and SQL behavior parity.

### 3) Kernel table feature expansion
- PR: [#5718](https://github.com/delta-io/delta/pull/5718) — **[KERNEL] Add collations table feature**
- PR: [#6235](https://github.com/delta-io/delta/pull/6235) — **[KERNEL] Add GeoSpatial Table feature**
- PR: [#6301](https://github.com/delta-io/delta/pull/6301) — **[Kernel] Geospatial stats parsing: handle geometry/geography as WKT strings**
- PR: [#6305](https://github.com/delta-io/delta/pull/6305) — **[Kernel] Add row tracking suspension support**
- PR: [#6306](https://github.com/delta-io/delta/pull/6306) — **[Kernel] Add column ID and physical name uniqueness validation**

**Why it matters:**  
Kernel is evolving from a minimal protocol implementation toward a richer feature-aware substrate. Geospatial support, collations, row tracking controls, and stronger column-mapping validations all indicate Delta is investing in **portable semantics beyond Spark-only behavior**.

**Underlying technical need:**  
Cross-engine consumers need the protocol to encode more semantics explicitly and validate them earlier, rather than relying on Spark-specific behavior.

### 4) Governance transparency
- Issue: [#6219](https://github.com/delta-io/delta/issues/6219) — **Where is the current Delta Lake TSC membership listed?**

**Why it matters:**  
Though not a product feature issue, this reflects community demand for **open governance clarity**. For a major lakehouse format project, transparent technical decision-making is part of ecosystem trust.

## 4. Bugs & Stability

Ranked by likely severity based on user impact and protocol correctness:

### High severity
1. [#6247](https://github.com/delta-io/delta/issues/6247) — **Java Kernel data skipping uses case-sensitive column matching**  
   - **Risk:** Query correctness/performance inconsistency across engines; protocol non-compliance.  
   - **Why severe:** Case sensitivity mismatches can create subtle correctness problems and inconsistent skip behavior, especially in mixed-case schemas and nested fields.  
   - **Related fix work:** Likely adjacent to [#6303](https://github.com/delta-io/delta/pull/6303), though that PR focuses on write-path normalization, not necessarily the exact data-skipping read-path defect.

### Medium severity
2. [#6297](https://github.com/delta-io/delta/pull/6297) — **Potential resource leak in SparkMicroBatchStream**  
   - **Risk:** Long-running streaming jobs accumulating leaked resources.  
   - **Status:** Closed, which is a positive sign for operational stability.

3. [#6299](https://github.com/delta-io/delta/pull/6299) — **Check NullType inside UDTs**  
   - **Risk:** Invalid schemas slipping through validation and causing downstream runtime failures or undefined behavior.  
   - **Status:** Closed.

4. [#5884](https://github.com/delta-io/delta/pull/5884) — **Disallow unsupported MapType key collation combinations**  
   - **Risk:** Cross-engine schema incompatibility and undefined semantics.  
   - **Status:** Closed.

### Lower-severity but important correctness hardening
5. [#6306](https://github.com/delta-io/delta/pull/6306) — **Add column ID and physical name uniqueness validation**  
   - **Risk:** Corrupt or ambiguous column mapping metadata if invalid assignments are committed.  
   - **Status:** Open; this is an important preventive correctness measure.

6. [#6304](https://github.com/delta-io/delta/pull/6304) — **Require `vacuumProtocolCheck` for catalogManaged**  
   - **Risk:** Feature mismatch between Spark and Kernel, leading to tables that may be incompletely protected or semantically inconsistent.  
   - **Status:** Open.

## 5. Feature Requests & Roadmap Signals

### Strong roadmap signals from active PRs

#### A) DSv2 writer and source modernization
- [#6230](https://github.com/delta-io/delta/pull/6230)
- [#6308](https://github.com/delta-io/delta/pull/6308)
- [#6294](https://github.com/delta-io/delta/pull/6294)

**Prediction:**  
Expect the next release cycle to include more visible progress in **Spark DSv2 write/read plumbing**, test migrations, and source metadata handling.

#### B) Richer Kernel-managed table features
- [#5718](https://github.com/delta-io/delta/pull/5718) — collations
- [#6235](https://github.com/delta-io/delta/pull/6235) — geospatial table feature
- [#6301](https://github.com/delta-io/delta/pull/6301) — geospatial stats parsing
- [#6305](https://github.com/delta-io/delta/pull/6305) — row tracking suspension
- [#6306](https://github.com/delta-io/delta/pull/6306) — column ID / physical-name validation

**Prediction:**  
These have a good chance of surfacing in an upcoming version if they stabilize, especially the **metadata validation** and **row tracking** pieces. Geospatial and collations may take longer if they require broader protocol and ecosystem consensus.

#### C) Advanced conflict resolution and SQL support
- [#6307](https://github.com/delta-io/delta/pull/6307) — **Add OPTIMIZE conflict resolution and E2E SQL support for V2 connector**

**Prediction:**  
This is a notable roadmap signal for **more complete maintenance-command support** through the V2 connector path. If merged, it would improve Delta’s ability to expose operational SQL features beyond basic reads/writes.

#### D) CI and ecosystem compatibility
- [#6263](https://github.com/delta-io/delta/pull/6263) — **non-blocking CI job to test against UC main**

**Prediction:**  
This suggests deeper alignment with Unity Catalog evolution and earlier detection of integration breakage. Not a user feature directly, but likely to reduce compatibility surprises in future releases.

## 6. User Feedback Summary

Based on the issues and PR themes, current user and contributor pain points are:

- **Cross-engine consistency matters more than new syntax right now.**  
  The most concrete open bug is about protocol-level case-insensitive behavior in Kernel: [#6247](https://github.com/delta-io/delta/issues/6247). Users are sensitive to Spark-vs-Kernel divergence.

- **Operational correctness in streaming remains a priority.**  
  The resource leak fix in [#6297](https://github.com/delta-io/delta/pull/6297) indicates that long-running jobs and production durability are active concerns.

- **Users want safer metadata and schema handling.**  
  Column mapping uniqueness, row tracking state validation, type-widening cleanup, and UDT/NullType validation all point to real-world complexity in evolving tables and schemas.

- **There is demand for better governance visibility.**  
  [#6219](https://github.com/delta-io/delta/issues/6219) shows ecosystem participants want clearer public documentation about who makes technical decisions.

There was **no strong direct positive/negative reaction signal** in the provided data, as reactions are zero and issue counts are low, so feedback today is better interpreted through engineering workstreams than through explicit community sentiment.

## 7. Backlog Watch

These items appear to deserve maintainer attention due to age, strategic importance, or lack of clear closure:

- [#5718](https://github.com/delta-io/delta/pull/5718) — **[KERNEL] Add collations table feature**  
  Open since 2025-12-17. This is a long-running protocol/semantic feature and likely needs careful review because collation support affects interoperability deeply.

- [#6235](https://github.com/delta-io/delta/pull/6235) — **[KERNEL] Add GeoSpatial Table feature**  
  Geospatial support is strategically important but typically requires agreement on stats, encoding, and query semantics. Worth watching closely.

- [#6230](https://github.com/delta-io/delta/pull/6230) — **[DSv2] Add executor writer**  
  This looks foundational for broader DSv2 adoption and may be blocked by stack dependencies. High leverage if maintainers want visible connector modernization.

- [#6263](https://github.com/delta-io/delta/pull/6263) — **CI against UC main**  
  Important for ecosystem resilience. CI investments often get deferred despite offering high long-term payoff.

- [#6219](https://github.com/delta-io/delta/issues/6219) — **TSC membership listing**  
  Low engineering complexity, high governance value. An easy documentation/process improvement that could strengthen community trust.

- [#6247](https://github.com/delta-io/delta/issues/6247) — **Kernel case-sensitive column matching bug**  
  This is the most important open issue in the current digest and should likely be prioritized because it touches protocol correctness.

## 8. Overall Health Signal

Delta Lake appears **healthy and actively maintained**, with unusually strong emphasis on **Kernel maturity, Spark DSv2 migration, and correctness hardening**. The lack of a release today is not concerning given the amount of active PR work. The biggest near-term quality signal is whether the project quickly resolves the **case-insensitive column handling gap** in Kernel and continues landing the **DSv2 and validation-focused PR stack**.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-18

## 1. Today's Overview

Databend showed **moderate-to-high engineering activity** over the last 24 hours, with **12 PRs updated** and **5 active issues**, but **no new release** published. The day’s signal is dominated by **query engine and SQL-layer work**: several merged PRs improved recursive CTE execution, optimizer test infrastructure, expression evaluation, and runtime filter support for spatial joins. At the same time, newly opened issues reveal a **cluster of SQL correctness and panic bugs**, especially around `LIKE ... ESCAPE` handling and constant folding, indicating active pressure on parser/planner/expression robustness. Overall, the project appears **healthy in development velocity**, but **stability attention is warranted** in planner and expression edge cases.

## 2. Project Progress

### Merged/closed PRs advancing the engine

- [#19530](https://github.com/databendlabs/databend/pull/19530) — **feat(query): Runtime Filter support spatial index join**  
  This is one of the most meaningful query-engine advancements in the current batch. It extends runtime filtering to **spatial join predicates** such as `st_within` and `st_intersects`, enabling better **probe-side block pruning**. This points to continued investment in **join-time pruning** and specialized analytical acceleration for spatial workloads.

- [#19545](https://github.com/databendlabs/databend/pull/19545) — **refactor: make Recursive CTE execution more streaming-oriented**  
  This closed PR suggests the team is improving the execution model for **recursive CTEs**, moving it toward a more streaming-friendly architecture. That is an important roadmap signal for better support of complex recursive SQL workloads and memory efficiency.

- [#19558](https://github.com/databendlabs/databend/pull/19558) — **fix(sql): implement recursive cte hooks in lite planner ctx**  
  This patch fixed a `main` branch check failure by adding missing recursive CTE-related hooks in `LiteTableContext`. It shows recursive CTE support is still being actively integrated across planner/testing infrastructure, and maintainers are addressing internal API consistency.

- [#19542](https://github.com/databendlabs/databend/pull/19542) — **refactor(sql): share optimizer replay support and add lite harness**  
  This improves SQL test support by sharing optimizer replay utilities and extracting reusable parser helpers. It should strengthen **debuggability, optimizer regression testing, and developer iteration speed**.

- [#19538](https://github.com/databendlabs/databend/pull/19538) — **refactor(expression): simplify filter and lambda evaluation**  
  This expression-engine cleanup reduces duplicated paths and unifies lambda handling for array/map functions. It likely improves **maintainability and semantic consistency** in vectorized expression evaluation.

- [#19560](https://github.com/databendlabs/databend/pull/19560) — **chore(deps): bump Spark core in iceberg-driver tests**  
  While routine, upgrading Spark from `3.3.3` to `3.5.7` in the Iceberg test driver helps keep Databend’s **lakehouse interoperability validation** aligned with newer Spark ecosystems.

### Open PRs worth watching

- [#19559](https://github.com/databendlabs/databend/pull/19559) — **refactor(sql): eager aggr**  
  Potential optimizer/execution improvement around aggregation planning or execution strategy.

- [#19551](https://github.com/databendlabs/databend/pull/19551) — **feat(query): support experimental table branch**  
  A notable roadmap item that may hint at branch-like semantics for tables, likely relevant to data versioning or isolated experimentation.

- [#19556](https://github.com/databendlabs/databend/pull/19556) — **feat(query): reclaim memory on hash join finish**  
  Important for memory footprint control in analytical joins; likely valuable for large multi-join workloads.

- [#19528](https://github.com/databendlabs/databend/pull/19528) — **feat(test): display query_id on sqllogictest failure**  
  Small but practical improvement that should reduce debugging time for flaky or failing logic tests.

## 3. Community Hot Topics

### Most active issue

- [#19481](https://github.com/databendlabs/databend/issues/19481) — **bug: slower performance of INSERT with 1.2.881**  
  **21 comments**, making it the clearest community hotspot. A user reported a regression after upgrading from `1.2.790` to `1.2.881-nightly`, with slower `INSERT` performance.  
  **Technical need:** users care deeply about **write-path regressions**, especially in ingestion-heavy OLAP deployments. This issue suggests maintainers may need better **performance bisecting, release-level benchmark visibility, and insert-path profiling**.

### Current technical cluster: `LIKE` panic bugs

Three new issues were opened together by the same contributor, all targeting `LIKE` edge cases:

- [#19563](https://github.com/databendlabs/databend/issues/19563) — `LIKE ... ESCAPE ''''` parser reparse assertion panic  
- [#19562](https://github.com/databendlabs/databend/issues/19562) — `LIKE ... ESCAPE ''` planner type-check panic  
- [#19561](https://github.com/databendlabs/databend/issues/19561) — `LIKE` constant folding panic on repeated `%`

These reports collectively point to a need for stronger **defensive handling of SQL pattern semantics**, especially in:
- parser/display round-tripping,
- planner semantic validation,
- constant-folding normalization.

### Bendpy usability / file-format ergonomics

- [#19557](https://github.com/databendlabs/databend/pull/19557) and [#19444](https://github.com/databendlabs/databend/pull/19444) — fixes for `register_csv()` / `register_tsv()` column position handling  
  This area reflects active user demand around **Python integration and external-file querying ergonomics**. The issue is practical: CSV/TSV-backed views require explicit positional references like `$1`, `$2`, etc.

## 4. Bugs & Stability

Ranked by severity based on available evidence:

### High severity

1. [#19481](https://github.com/databendlabs/databend/issues/19481) — **INSERT performance regression in 1.2.881-nightly**  
   This is the most operationally significant issue because it affects production write throughput rather than a narrow syntax edge case. No linked fix PR is visible in today’s data.

2. [#19555](https://github.com/databendlabs/databend/issues/19555) — **planner panic on full-range `UInt64` stats overflow in `Scan::derive_stats`**  
   A planner panic on legitimate column statistics is serious, especially because it can affect query planning on wide unsigned domains. No fix PR is listed yet. This points to insufficient overflow-safe arithmetic in stats derivation.

### Medium severity

3. [#19562](https://github.com/databendlabs/databend/issues/19562) — **`LIKE ... ESCAPE ''` panics in planner type checking**  
   Planner should reject invalid SQL cleanly; panicking is a stability defect. No fix PR is visible.

4. [#19563](https://github.com/databendlabs/databend/issues/19563) — **`LIKE ... ESCAPE ''''` parser reparse assertion panic**  
   This suggests an internal parser/display mismatch, likely affecting AST round-trip assumptions. No fix PR is visible.

5. [#19561](https://github.com/databendlabs/databend/issues/19561) — **constant folding panic for repeated `%` in `LIKE`**  
   Narrower in user impact than a planner-wide overflow bug, but still a correctness/stability problem in compile-time expression simplification.

### Stability trend assessment

Today’s issue stream is notable because several reports are not just “wrong result” bugs but **internal panics**. That is usually a sign that Databend’s SQL engine would benefit from more **fuzzing, parser/planner/property tests, and invalid-input normalization** around edge-case SQL syntax.

## 5. Feature Requests & Roadmap Signals

No major new end-user feature request issue was opened today, but the PR stream gives clear roadmap hints:

- [#19551](https://github.com/databendlabs/databend/pull/19551) — **experimental table branch support**  
  This could become a significant user-facing feature if merged, potentially enabling isolated table-level experimentation, branching, or version-aware workflows.

- [#19556](https://github.com/databendlabs/databend/pull/19556) — **memory reclamation on hash join finish**  
  Likely to land sooner than larger architectural features because it is concrete and operationally valuable. This would directly benefit memory-constrained analytical deployments.

- [#19559](https://github.com/databendlabs/databend/pull/19559) — **eager aggregation**  
  If merged, this may influence aggregation planning/performance, especially for workloads where early aggregation can reduce intermediate data volume.

- [#19530](https://github.com/databendlabs/databend/pull/19530) — already closed, but it signals continuing investment in **advanced join optimization** and possibly broader support for domain-specific runtime filters.

### Likely next-version candidates
Based on current momentum, the most plausible near-term additions or visible improvements in the next version are:
1. **hash join memory cleanup**,
2. **recursive CTE execution improvements**,
3. **further SQL planner/expression robustness fixes**,
4. possibly **experimental table branch support** if review progresses smoothly.

## 6. User Feedback Summary

The strongest direct user feedback today centers on two pain points:

- **Performance regressions after upgrade**  
  From [#19481](https://github.com/databendlabs/databend/issues/19481), users upgrading nightlies expect performance not to regress, especially on core ingestion operations like `INSERT`. This is a trust and upgrade-adoption issue.

- **SQL edge cases causing panics instead of errors**  
  The three new `LIKE`-related issues and the `UInt64` stats overflow issue indicate users and contributors are hitting cases where Databend fails with **internal panics** instead of user-facing validation messages. That creates friction for SQL compatibility confidence.

There is also evidence of practical user demand around:
- **Python/Bendpy file registration workflows** ([#19444](https://github.com/databendlabs/databend/pull/19444), [#19557](https://github.com/databendlabs/databend/pull/19557)),
- **better test diagnostics** for maintainers and contributors ([#19528](https://github.com/databendlabs/databend/pull/19528)).

In short, users appear satisfied enough to push into advanced SQL and integration scenarios, but they are currently surfacing **robustness and usability gaps** rather than asking for entirely new core capabilities.

## 7. Backlog Watch

Items needing maintainer attention:

- [#19481](https://github.com/databendlabs/databend/issues/19481) — **INSERT slowdown in 1.2.881-nightly**  
  This is the highest-priority backlog item based on comment volume and operational importance. It affects upgrade confidence and should ideally get a benchmark-backed root-cause update.

- [#19444](https://github.com/databendlabs/databend/pull/19444) — **Bendpy CSV/TSV registration fix still open**  
  A follow-up exists in [#19557](https://github.com/databendlabs/databend/pull/19557), which suggests the original patch may need closure or supersession handling to avoid contributor confusion.

- [#19551](https://github.com/databendlabs/databend/pull/19551) — **experimental table branch support**  
  Important enough to watch because it may become a visible roadmap feature. It likely needs careful design review due to semantics and lifecycle implications.

- [#19528](https://github.com/databendlabs/databend/pull/19528) — **sqllogictest query_id diagnostics**  
  Not urgent for users, but valuable for engineering productivity; worth merging if stable.

## 8. Overall Health Assessment

Databend’s **development throughput remains strong**, especially in query execution, SQL infrastructure, and testing support. The merged work shows continued sophistication in areas like **recursive CTEs, spatial join optimization, and expression engine simplification**. However, the current day’s issues expose a **stability hotspot in SQL edge-case handling**, with multiple panic-level bugs reported in parser/planner/expression code paths. The near-term project health picture is therefore **positive on momentum, mixed on robustness**, with the top priorities being **regression control, panic elimination, and operational performance assurance**.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-18

## 1. Today's Overview

Velox showed **high development activity** over the last 24 hours, with **46 PRs updated** and **4 issues touched**, indicating an active maintainer/contributor loop despite **no new release**. The change stream is concentrated around **RPC framework build-out, Parquet/DWRF correctness, Spark compatibility, Hive/Iceberg connector evolution, and operator/UDF performance work**. The issue mix suggests the project is currently balancing **feature expansion** with **query correctness and build/runtime stability**, especially in date/time semantics, GPU/debug behavior, and storage metadata handling. Overall, project health looks strong from a throughput perspective, though several open items point to integration complexity across file formats, connectors, and execution backends.

## 2. Project Progress

### Merged/closed PRs today

Only one PR in the provided set was newly closed:

- [#14641](https://github.com/facebookincubator/velox/pull/14641) — **feat(cudf): Add ROUND ROBIN ROW to cudfLocalPartition** — **closed**
  - This would have expanded GPU-side partitioning capabilities for `cudfLocalPartition` by adding round-robin row partitioning.
  - Its closure without merge suggests either a superseded direction, stalled demand, or unresolved implementation/review concerns around cuDF execution parity.

### What advanced in practice

Although merges were limited in the supplied snapshot, the active PR queue shows meaningful forward progress in several technical areas:

- **RPC execution infrastructure**
  - [#16792](https://github.com/facebookincubator/velox/pull/16792) — unit tests and reference implementation for the RPC framework.
  - [#16793](https://github.com/facebookincubator/velox/pull/16793) — function stubs and sidecar discovery support.
  - These indicate a serious push toward **remote/async function execution**, likely useful for extensible compute, service-backed UDFs, or sidecar architectures.

- **Storage engine correctness and format interoperability**
  - [#16744](https://github.com/facebookincubator/velox/pull/16744) — Parquet 1.8.1 min/max ordering compatibility fix.
  - [#16800](https://github.com/facebookincubator/velox/pull/16800) — DWRF FlatMap writer fix for dangling `StringView` keys.
  - [#16789](https://github.com/facebookincubator/velox/pull/16789) — Spark `TimestampNTZ` Parquet read support.
  - [#16217](https://github.com/facebookincubator/velox/pull/16217) — support reading `TIME_MILLIS` from Parquet.
  - These collectively strengthen Velox as an analytical storage/scan engine in mixed lakehouse ecosystems.

- **Connector and table format capabilities**
  - [#16761](https://github.com/facebookincubator/velox/pull/16761) — Iceberg positional update support.
  - [#16803](https://github.com/facebookincubator/velox/pull/16803) — pluggable Hive index reader support.
  - These are strong signals of deeper **table-format maturity** and more modular scan-path architecture.

- **Execution and function performance**
  - [#16811](https://github.com/facebookincubator/velox/pull/16811) — `map_except` UDF optimization.
  - [#16653](https://github.com/facebookincubator/velox/pull/16653) — `MarkSorted` operator optimizations.
  - [#16498](https://github.com/facebookincubator/velox/pull/16498) — `vector_sum` aggregate function.
  - This reflects continued attention to both **operator-level CPU efficiency** and **higher-level SQL/vector function ergonomics**.

## 3. Community Hot Topics

### Most notable active PRs/issues

- [#16792](https://github.com/facebookincubator/velox/pull/16792) — **RPC framework tests and reference implementation**
  - Technical need: a robust contract for asynchronous/remote function execution, including dispatch behavior, error handling, and output construction.
  - Why it matters: this is infrastructure-level work that can unlock **service-backed UDFs**, potentially important for hybrid analytical systems.

- [#16019](https://github.com/facebookincubator/velox/pull/16019) — **Use FBThrift instead of Apache Thrift**
  - Technical need: reduce or replace external dependency friction, especially around Parquet-related thrift usage.
  - Why it matters: dependency shifts at this layer can materially affect **build reproducibility, ABI compatibility, and integration cost**.

- [#16807](https://github.com/facebookincubator/velox/pull/16807) linked to [#16806](https://github.com/facebookincubator/velox/issues/16806) — **ISO week-year support in date formatting**
  - Technical need: **Spark SQL compatibility** for `YYYY` semantics in `from_unixtime`.
  - Why it matters: date/time formatting mismatches are high-impact because they silently affect query correctness and downstream reporting.

- [#16800](https://github.com/facebookincubator/velox/pull/16800) — **DWRF dangling `StringView` key fix**
  - Technical need: memory lifetime correctness in map writers under batched write/release patterns.
  - Why it matters: this is a classic storage-engine bug class that can lead to hard-to-diagnose corruption or crashes.

- [#16761](https://github.com/facebookincubator/velox/pull/16761) — **Iceberg positional updates**
  - Technical need: broader support for Iceberg merge-on-read semantics.
  - Why it matters: directly relevant for lakehouse users adopting mutable table semantics.

### Underlying technical themes

The strongest cross-cutting themes today are:

1. **Interoperability with surrounding data ecosystems**: Spark, Parquet variants, Iceberg, Hive.
2. **Execution extensibility**: RPC-backed functions suggest Velox is being positioned for more distributed/service-oriented execution patterns.
3. **Correctness under real-world edge cases**: date formatting semantics, legacy Parquet ordering, writer memory ownership, debug-build CUDA/JIT shutdown behavior.

## 4. Bugs & Stability

Ranked roughly by severity/impact:

### 1) Query correctness: `from_unixtime` year formatting mismatch with Spark
- Issue: [#16806](https://github.com/facebookincubator/velox/issues/16806) — **Velox `from_unixtime` YYYY date format gives different result than Spark**
- Severity: **High**
- Impact: silent correctness issue in SQL results; affects users expecting Spark-compatible semantics.
- Details: Velox appears to treat `YYYY` differently from Spark, which interprets it as ISO week-year.
- Fix in flight: [#16807](https://github.com/facebookincubator/velox/pull/16807) — **support ISO week year format**
- Assessment: good responsiveness; likely to be resolved soon if review proceeds.

### 2) Runtime crash: JITIFY crash on debug test/benchmark app exit
- Issue: [#16707](https://github.com/facebookincubator/velox/issues/16707) — **CUDF/JITIFY crash on app exit in Debug**
- Severity: **High for developers / Medium for production**
- Impact: affects debug-built command-line executables using CUDF when `jitExpressionEnabled = true`.
- Details: appears tied to shutdown/cleanup sequencing in JITIFY.
- Fix status: no linked fix PR in provided data.
- Assessment: not necessarily a production blocker, but painful for contributors and GPU-path debugging.

### 3) Storage writer memory safety: dangling `StringView` in DWRF FlatMap writer
- PR: [#16800](https://github.com/facebookincubator/velox/pull/16800)
- Severity: **High**
- Impact: potential use-after-free during rehashing, possibly causing crashes or incorrect writes.
- Assessment: this is a serious storage-layer correctness/stability bug; good to see a fix already proposed.

### 4) Build regression: undefined reference in function registration
- Issue: [#16785](https://github.com/facebookincubator/velox/issues/16785) — **build failing with undefined reference**
- Severity: **Medium**
- Status: **closed**
- Impact: CI/build breakage around `registerArraySplitIntoChunksFunctions(...)`.
- Assessment: closed quickly, which is a positive signal for maintainer responsiveness to build health.

### 5) Legacy Parquet metadata ordering compatibility
- PR: [#16744](https://github.com/facebookincubator/velox/pull/16744)
- Severity: **Medium**
- Impact: min/max ordering interpretation differences with Parquet 1.8.1 can affect predicate pushdown or stats-based decisions.
- Assessment: important for users with older Parquet files; not a crash, but can influence correctness/performance.

## 5. Feature Requests & Roadmap Signals

### User-requested or ecosystem-driven needs

- [#16804](https://github.com/facebookincubator/velox/issues/16804) — **Update Apache Gluten URL after TLP graduation**
  - Minor on its own, but a signal that the Velox ecosystem is watched closely by downstream acceleration projects and users.

- [#16789](https://github.com/facebookincubator/velox/pull/16789) — **Spark TimestampNTZ Parquet read support**
  - Strong compatibility request from Spark/lakehouse users.

- [#16217](https://github.com/facebookincubator/velox/pull/16217) — **Read Parquet `TIME_MILLIS`**
  - Indicates ongoing demand for broader Parquet logical-type completeness.

- [#16498](https://github.com/facebookincubator/velox/pull/16498) — **`vector_sum` aggregate**
  - Suggests appetite for richer built-in array/vector analytics without costly unnests.

- [#16761](https://github.com/facebookincubator/velox/pull/16761) — **Iceberg positional update support**
  - A major roadmap signal for deeper table-format mutation support.

- [#16803](https://github.com/facebookincubator/velox/pull/16803) — **Pluggable Hive index reader**
  - Suggests a move toward cleaner modularity in scan/index subsystems, likely enabling more formats and optimizations.

### What is likely in the next version

Based on current activity, the most likely near-term user-visible additions/fixes are:

1. **Spark compatibility improvements**
   - ISO week-year formatting ([#16807](https://github.com/facebookincubator/velox/pull/16807))
   - Spark `TimestampNTZ` Parquet support ([#16789](https://github.com/facebookincubator/velox/pull/16789))

2. **Parquet/DWRF robustness improvements**
   - Legacy Parquet stats handling ([#16744](https://github.com/facebookincubator/velox/pull/16744))
   - DWRF FlatMap writer memory fix ([#16800](https://github.com/facebookincubator/velox/pull/16800))
   - `TIME_MILLIS` read support ([#16217](https://github.com/facebookincubator/velox/pull/16217))

3. **Connector/table format enhancements**
   - Iceberg positional updates ([#16761](https://github.com/facebookincubator/velox/pull/16761))
   - Hive pluggable index readers ([#16803](https://github.com/facebookincubator/velox/pull/16803))

4. **Execution extensibility**
   - RPC function infrastructure ([#16792](https://github.com/facebookincubator/velox/pull/16792), [#16793](https://github.com/facebookincubator/velox/pull/16793))

## 6. User Feedback Summary

The clearest user pain points in today’s data are:

- **SQL compatibility gaps versus Spark**
  - Especially around temporal semantics like `YYYY` week-year handling: [#16806](https://github.com/facebookincubator/velox/issues/16806)
  - This suggests users are validating Velox behavior in Spark-adjacent or Spark-replacement contexts.

- **Real-world Parquet interoperability**
  - Legacy metadata ordering ([#16744](https://github.com/facebookincubator/velox/pull/16744))
  - Spark-specific `TimestampNTZ` encoding ([#16789](https://github.com/facebookincubator/velox/pull/16789))
  - Missing logical type coverage like `TIME_MILLIS` ([#16217](https://github.com/facebookincubator/velox/pull/16217))
  - Users clearly need Velox to read heterogeneous data lakes correctly, not just idealized files.

- **Developer ergonomics and stability**
  - Debug-mode CUDF/JIT crash on process exit: [#16707](https://github.com/facebookincubator/velox/issues/16707)
  - Build breakages such as [#16785](https://github.com/facebookincubator/velox/issues/16785)
  - This points to friction for contributors or advanced deployers working with optional acceleration paths.

- **Performance sensitivity in UDFs/operators**
  - `map_except` optimization: [#16811](https://github.com/facebookincubator/velox/pull/16811)
  - `MarkSorted` optimization: [#16653](https://github.com/facebookincubator/velox/pull/16653)
  - Users and contributors continue to care about micro-efficiency in core analytical execution paths.

There is little direct positive sentiment data in the provided snapshot (no significant reactions/likes), so the feedback is mostly inferred from bug reports and active contribution themes rather than explicit user praise.

## 7. Backlog Watch

These older or strategically important items likely need sustained maintainer attention:

- [#16019](https://github.com/facebookincubator/velox/pull/16019) — **Use FBThrift instead of Apache Thrift**
  - Open since 2026-01-14.
  - High-impact architectural/dependency change with potential downstream consequences.
  - Worth close review because it affects build/dependency posture.

- [#15700](https://github.com/facebookincubator/velox/pull/15700) — **feat(cudf): Run tests in CI**
  - Open since 2025-12-04, marked ready-to-merge.
  - Important for GPU-path confidence; prolonged delay here can leave cuDF support under-validated.

- [#16217](https://github.com/facebookincubator/velox/pull/16217) — **Parquet `TIME_MILLIS` support**
  - Open since 2026-02-03, ready-to-merge.
  - User-visible compatibility improvement that appears mature enough to land.

- [#12846](https://github.com/facebookincubator/velox/pull/12846) — **Fix decimal precision/scale writing in Parquet**
  - Open since 2025-03-29.
  - Long-lived Parquet correctness work; deserves attention because decimal encoding issues can have downstream schema/data integrity impact.

- [#16707](https://github.com/facebookincubator/velox/issues/16707) — **JITIFY debug exit crash**
  - Not old, but significant for GPU/developer workflows and currently lacks a visible fix PR.

- [#16761](https://github.com/facebookincubator/velox/pull/16761) — **Iceberg positional updates**
  - Recent but strategically important; high roadmap value for lakehouse adoption.

## 8. Overall Health Assessment

Velox remains **very active and technically ambitious**, with notable investment in **lakehouse interoperability, storage correctness, execution extensibility, and operator performance**. The absence of a release today is not concerning given the breadth of active PRs. The biggest short-term risks are around **correctness edge cases** and **backend integration complexity**—especially date/time semantics, legacy file compatibility, and GPU/debug stability. If the currently active compatibility and storage fixes land promptly, near-term project health should remain strong.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-18

## 1. Today's Overview

Apache Gluten showed healthy day-to-day activity, with **8 issues** and **15 pull requests** updated in the last 24 hours, indicating an actively maintained project across both **Velox** and **ClickHouse** backends. The current development focus is clearly on **runtime stability, join/memory behavior, shuffle/data skipping optimization, docs cleanup, and post-graduation repository transition work**. There were **no new releases**, so today’s signal comes mainly from issue/PR flow rather than packaged deliverables. Overall activity looks **moderately high**, with a strong bias toward **Velox operational correctness and performance tuning**.

---

## 3. Project Progress

### Merged/closed PRs today

Several PRs were closed or merged in the last 24 hours, advancing maintainability, configuration surface, docs quality, and backend stability.

- [#11606](https://github.com/apache/incubator-gluten/pull/11606) — **[VL] Adding configurations on max write file size**  
  This improves the configurability of Velox write behavior. Even though the summary is brief, exposing max write file size is important for **storage layout control**, output file sizing, and downstream table maintenance efficiency.

- [#11772](https://github.com/apache/incubator-gluten/pull/11772) — **Fix broken mkdocs navigation and add getting-started guide**  
  This is a documentation quality improvement with practical value for onboarding and discoverability. Better docs reduce friction for new adopters evaluating Gluten’s backends and deployment model.

- [#11757](https://github.com/apache/incubator-gluten/pull/11757) — **Refactor ExpressionConverter to use explicit Option return**  
  This is a code-quality and correctness-oriented cleanup in the core expression transformation path. While not a user-facing feature, it reduces ambiguity in Scala null/Option handling and lowers maintenance risk in the SQL expression conversion layer.

- [#11773](https://github.com/apache/incubator-gluten/pull/11773) — **[CH] Remove RAS**  
  This appears to be a targeted ClickHouse backend fix to restore CI health after an accidental reintroduction. It signals active attention to **backend build correctness and integration hygiene**.

- [#11735](https://github.com/apache/incubator-gluten/pull/11735) — **Update repository references after TLP graduation**  
  This reflects project governance progress following graduation to a top-level project. Although this PR was closed, it shows active repository/path migration work that usually accompanies infrastructure, docs, and automation updates.

- [#11444](https://github.com/apache/incubator-gluten/pull/11444) — **Enable dynamic openssl lib in vcpkg packaging**  
  Infrastructure/build packaging remains an area of maintenance attention, especially for native dependency management in Velox-based deployments.

### Net progress themes

Today’s closed work suggests progress in:
- **Write-path configurability**
- **Documentation and onboarding**
- **Core planner/expression code hygiene**
- **ClickHouse CI/build stability**
- **Project infrastructure updates after Apache TLP graduation**

---

## 4. Community Hot Topics

### 1) ANSI mode support remains a major SQL compatibility theme
- [Issue #10134](https://github.com/apache/incubator-gluten/issues/10134) — **[VL] Add ANSI mode support**  
  **19 comments, 7 👍**
  
  This is one of the strongest roadmap signals. With Spark 4.0 making ANSI behavior more central, Gluten users increasingly need **behavioral parity with Spark SQL**, especially around error handling, assignment policy, and semantic correctness. The issue’s popularity suggests that **enterprise users care at least as much about compatibility as raw acceleration**.

### 2) Distinct aggregation OOM is still an important unresolved memory issue
- [Issue #8025](https://github.com/apache/incubator-gluten/issues/8025) — **[VL] Distinct aggregation OOM when getOutput**  
  **21 comments, 3 👍**
  
  This is the most commented active issue in the digest. The root problem—merging too many spill files and preloading batches during ordered reader creation—points to a deeper need for **better spill orchestration, memory-aware merge scheduling, and bounded-output behavior** in Velox-backed aggregations.

### 3) Tracking unmerged upstream Velox PRs
- [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585) — **useful Velox PRs not merged into upstream**  
  **16 comments, 4 👍**
  
  This tracker highlights a structural challenge for Gluten: product velocity depends partly on **upstream Velox landing cadence**. The issue signals an ongoing need to balance **local patching vs. upstream alignment**, especially when high-value performance or correctness fixes are waiting in review.

### 4) Iceberg metadata propagation and file metadata semantics
- [PR #11615](https://github.com/apache/incubator-gluten/pull/11615) — **Fix input_file_name() on Iceberg, JNI init stability, and metadata propagation**  
  This is a notable open PR because it combines **data lake compatibility**, **query metadata correctness**, and **JNI stability**. It reflects increased user reliance on Gluten in modern lakehouse environments where Spark metadata functions must behave identically across table formats.

### 5) Shuffle-level statistics for dynamic filtering
- [PR #11769](https://github.com/apache/incubator-gluten/pull/11769) — **Write per-block column statistics in shuffle writer**  
  This is strategically important. It lays groundwork for **block-level pruning at shuffle read time**, which can materially improve distributed query efficiency. This is one of the clearest performance-engineering items in flight today.

---

## 5. Bugs & Stability

Ranked by likely severity and immediate user impact:

### 1) HashBuild OOM caused by incorrect build side
- [Issue #11774](https://github.com/apache/incubator-gluten/issues/11774) — **OPEN**
- Fix PR: [#11775](https://github.com/apache/incubator-gluten/pull/11775) — **Use runtime stats to choose hash build side**

This is the highest-severity new issue in the digest because it causes **runtime OOM/failure in join execution**, likely on real production workloads. The proposed fix uses **AQE QueryStageExec runtime statistics** to select the smaller build side, which is a sound and practical response. Good sign: **a fix PR exists immediately**.

### 2) Distinct aggregation OOM during spill merge/output
- [Issue #8025](https://github.com/apache/incubator-gluten/issues/8025) — **OPEN**

This remains a serious stability and scalability concern. It affects workloads with large distinct aggregations and spill files, and the failure mode is **memory blow-up during output generation**, not merely degraded performance.

### 3) Severe regression: Gluten over 10x slower than vanilla Spark on `SELECT ... LIMIT`
- [Issue #11766](https://github.com/apache/incubator-gluten/issues/11766) — **OPEN**

This is an important performance regression report because `LIMIT` queries are common in **exploratory analytics, BI previews, and notebook workflows**. The report suggests Gluten may be doing more work than Spark’s optimized single-task behavior in a simple top-N/limit case. Not a crash, but highly visible to users.

### 4) JNI initialization crash path and metadata correctness on Iceberg
- [PR #11615](https://github.com/apache/incubator-gluten/pull/11615) — **OPEN**

Although represented as a PR rather than a new issue in this digest, it addresses a meaningful stability problem. JNI init instability is especially serious because it can manifest as **hard execution failures** and tends to be difficult for users to diagnose.

### 5) CH CI/build breakage from mistaken RAS reintroduction
- [PR #11773](https://github.com/apache/incubator-gluten/pull/11773) — **CLOSED**

This appears to have been promptly handled. Impact was likely mostly on **CI/build health** rather than end-user query correctness.

---

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals

- [Issue #10134](https://github.com/apache/incubator-gluten/issues/10134) — **ANSI mode support**  
  Very likely to continue into the next version. This is central for **Spark 4.x compatibility** and broader production adoption.

- [Issue #11771](https://github.com/apache/incubator-gluten/issues/11771) — **Bloom filter optimization**  
  This points to demand for better **join/filter pushdown efficiency** and alignment between Spark and Velox bloom filter behavior. Expect this area to evolve soon, especially given related configuration work.

- [Issue #11383](https://github.com/apache/incubator-gluten/issues/11383) — **Configurations for Velox hash join bloom filter feature**  
  Closed, which indicates progress on exposing or discussing this capability. Together with [#11771](https://github.com/apache/incubator-gluten/issues/11771), this suggests **dynamic filtering and bloom-filter-based join optimization** are active roadmap items.

- [PR #11769](https://github.com/apache/incubator-gluten/pull/11769) — **Per-block column statistics in shuffle writer**  
  This is a strong signal that the next version may include more advanced **shuffle pruning / dynamic filter-based skipping**.

- [PR #11776](https://github.com/apache/incubator-gluten/pull/11776) — **Added iceberg write configs**  
  Indicates continued investment in **Iceberg write-path support and configurability**, important for data lake production users.

- [PR #11734](https://github.com/apache/incubator-gluten/pull/11734) — **Update ClickHouse version; support aggregate function and align sparkArrayFold lambda types**  
  This suggests active ClickHouse backend evolution, especially around **function support and Spark semantic alignment**.

### Likely next-version inclusions
Most plausible candidates for upcoming release notes:
1. **ANSI mode incremental support**
2. **Join-side selection fixes under AQE**
3. **Bloom-filter/dynamic-filter enhancements**
4. **Iceberg metadata and write config improvements**
5. **Shuffle statistics-based pruning groundwork**
6. **ClickHouse function compatibility updates**

---

## 7. User Feedback Summary

### Main pain points surfaced by users

- **Memory pressure on large joins and aggregations**
  - [#11774](https://github.com/apache/incubator-gluten/issues/11774)
  - [#8025](https://github.com/apache/incubator-gluten/issues/8025)  
  Users are still encountering cases where Gluten’s native execution path can hit **OOMs under realistic scale**, especially in joins and distinct aggregation with spill.

- **Unexpected regressions on simple interactive queries**
  - [#11766](https://github.com/apache/incubator-gluten/issues/11766)  
  This is important feedback because users expect acceleration layers not to degrade trivial workloads. It suggests room for **smarter fallback, short-circuit execution, or improved limit pushdown/task planning**.

- **Need for stronger Spark semantic compatibility**
  - [#10134](https://github.com/apache/incubator-gluten/issues/10134)  
  Demand for ANSI mode shows that users increasingly evaluate Gluten not just as an accelerator, but as a **drop-in execution backend for modern Spark behavior**.

- **Lakehouse metadata correctness matters**
  - [#11615](https://github.com/apache/incubator-gluten/pull/11615)  
  Users rely on metadata functions like `input_file_name()` in ETL, auditing, and debugging. Correctness in Iceberg and related table formats is therefore a practical adoption requirement.

### Satisfaction signals

There is continued investment in advanced optimization areas such as **dynamic filtering, bloom filters, shuffle statistics, and backend upgrades**, which suggests maintainers are responding to performance-focused user needs. However, the newest issue mix indicates users still face a gap between **headline acceleration potential** and **predictable behavior under all Spark workloads**.

---

## 8. Backlog Watch

These items look important and likely need sustained maintainer attention:

- [Issue #8025](https://github.com/apache/incubator-gluten/issues/8025) — **Distinct aggregation OOM when getOutput**  
  Long-running, highly discussed, and directly tied to memory scalability. This should remain high priority.

- [Issue #10134](https://github.com/apache/incubator-gluten/issues/10134) — **Add ANSI mode support**  
  A major compatibility tracker with broad downstream impact. Important for Spark 4.x readiness and ecosystem trust.

- [Issue #11585](https://github.com/apache/incubator-gluten/issues/11585) — **Useful Velox PRs not merged into upstream**  
  This is strategically important because unresolved upstream dependencies can slow Gluten’s feature delivery and bug-fix adoption.

- [PR #10553](https://github.com/apache/incubator-gluten/pull/10553) — **Simplify StrictRule and remove unnecessary DummyLeafExec**  
  Older open PR with claimed driver-side performance benefit. Since it touches planner internals and perf, it likely deserves maintainer review rather than lingering stale status.

- [PR #11521](https://github.com/apache/incubator-gluten/pull/11521) — **Fix some UT for Spark40 and Spark41**  
  Spark 4.0/4.1 test compatibility is too important to leave stale for long. This may block confidence in newer Spark support.

- [PR #11523](https://github.com/apache/incubator-gluten/pull/11523) — **Fix window to aggregate conversion with ordering expression validation**  
  This has possible query correctness implications on the ClickHouse path and should not sit unattended if it affects SQL semantic validation.

- [Issue #11713](https://github.com/apache/incubator-gluten/issues/11713) — **[Umbrella] Apache Gluten Graduation Tasks**  
  Even after board approval, completion of TLP transition tasks remains important for repository, docs, release process, and ASF project operations.

---

## Overall Health Assessment

Project health appears **good but operationally challenged in key native execution paths**. The maintainers are actively addressing **memory safety, backend alignment, documentation, and data lake correctness**, while also pushing forward on **higher-value optimizations** like dynamic filtering and shuffle pruning. The clearest risks today are **OOM-related execution failures** and **performance regressions on simple queries**, while the clearest strategic opportunities are **ANSI compatibility**, **lakehouse support**, and **better runtime adaptivity**.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-18

## 1) Today's Overview

Apache Arrow had a moderately active day with **31 issues** and **19 pull requests** updated in the last 24 hours, indicating steady cross-language maintenance rather than a major release push. Activity was concentrated in **Python packaging/build tooling**, **C++/Parquet CLI fixes**, **R API coverage**, and **Flight SQL/ODBC Windows packaging**. The overall health signal is positive: several small but high-value fixes were merged quickly, especially around Python build reliability and documentation quality, while new issues point to ongoing friction in Windows packaging and dependency handling. No new release was published, so today’s progress is best understood as **stabilization and developer-experience improvement** across the ecosystem.

## 2) Project Progress

### Merged/closed PRs today

These closures advanced build stability, packaging reliability, and docs/tooling quality more than core execution features:

- **[GH-49510: [Docs][Python][C++] Minimize warnings and docutils errors for Sphinx build html](https://github.com/apache/arrow/pull/49510)**  
  Closed 2026-03-18. This reduces documentation build noise, which improves CI signal quality and lowers maintenance cost for Python/C++ docs.

- **[GH-49532: [CI][Packaging][Python] Ignore cleanup errors trying to remove loaded DLLs from temp dir](https://github.com/apache/arrow/pull/49532)**  
  Closed 2026-03-17, tied to issue [#49531](https://github.com/apache/arrow/issues/49531). This fixes a Windows wheel build failure caused by DLL cleanup during docstring update steps. It is a practical packaging stability improvement for PyArrow distribution.

- **[GH-49476: [Python] Fix get_include and get_library_dirs to work with both editable and non-editable builds](https://github.com/apache/arrow/pull/49476)**  
  Closed 2026-03-17, tied to issue [#49473](https://github.com/apache/arrow/issues/49473). This is important for downstream extension/Cython developers using editable installs after the build backend transition.

- **[GH-49259: [Python] Use scikit-build-core as build backend for PyArrow and get rid of setup.py](https://github.com/apache/arrow/pull/49259)**  
  Closed 2026-03-17. This is one of the larger strategic packaging changes in recent activity: modernizing the Python build backend should improve maintainability, but it also explains several follow-on fixes now being needed in editable builds and Windows wheel flows.

- **[GH-49488: [CI] Update Maven version from 3.8.7 to 3.9.9](https://github.com/apache/arrow/pull/49488)**  
  Closed 2026-03-17. This supports Java-side build compatibility with newer Apache POM/plugin expectations.

### What this means technically

Today’s merged work did **not** materially change Arrow’s core columnar storage format or query semantics, but it did strengthen:
- **Packaging reproducibility**
- **Cross-platform build reliability**
- **Developer ergonomics for contributors and extension authors**
- **Documentation CI hygiene**

For an analytical storage engine ecosystem, these are important foundations: they reduce friction for shipping native binaries, integrating Arrow into downstream engines, and maintaining language bindings.

## 3) Community Hot Topics

### 1. Trusted publishing for PyPI wheels
- **Issue:** [#44733 [CI][Python] Investigate trusted publishing for uploading wheels to PyPI](https://github.com/apache/arrow/issues/44733)  
- **Comments:** 15  
- **Analysis:** This is a strong signal that Arrow maintainers are thinking beyond “build succeeds” toward **supply-chain security**, provenance, and artifact attestation. For a widely embedded data infrastructure library, trusted publishing matters because many analytics stacks consume PyArrow wheels directly in production.

### 2. Flight SQL ODBC Windows MSI signing
- **Issue:** [#49404 [C++][CI][Packaging][FlightPRC] Manual ODBC Windows MSI installer signing](https://github.com/apache/arrow/issues/49404)  
- **Comments:** 11  
- **Related issues/PRs:**  
  - [#49538 [C++][FlightRPC][ODBC] Change Windows ODBC to Static Linkage](https://github.com/apache/arrow/issues/49538)  
  - [#49537 [C++][FlightRPC][ODBC] Upload MSI installer materials for `cpack` WIX generator](https://github.com/apache/arrow/issues/49537)  
- **Analysis:** This is one of the clearest roadmap signals today. Arrow’s **Flight SQL ODBC packaging on Windows** is hitting the last-mile problem common to database connectivity stacks: signing, installer generation, DLL sprawl, and defender acceptance. The proposed move toward **static linkage** suggests maintainers want to reduce operational complexity and supportability risk for enterprise installs.

### 3. R/C++ temporal casting and parsing gaps
- **Issues:**  
  - [#31254 [R] [C++] Should strptime support a partial format?](https://github.com/apache/arrow/issues/31254) — 16 comments  
  - [#31240 [R][C++] Plans for date casting from int to support an origin option?](https://github.com/apache/arrow/issues/31240) — 11 comments  
- **Analysis:** These long-running issues show persistent user demand for **more flexible temporal semantics** matching base R expectations. This reflects a common analytical-engine need: users expect Arrow-backed expressions to preserve familiar date/time parsing and casting behavior when replacing in-memory dataframe workflows.

### 4. Python object serialization to Parquet
- **Issue:** [#31267 [Python] Allow serializing arbitrary Python objects to parquet](https://github.com/apache/arrow/issues/31267)  
- **Comments:** 10  
- **Analysis:** This request reflects recurring user confusion between **Arrow/Parquet’s strongly typed columnar model** and Python’s arbitrary object model. The demand is real, but the feature is structurally difficult because arbitrary object serialization tends to undermine interoperability, schema clarity, and performance.

### 5. Python extension-type ergonomics
- **Issue:** [#44853 [Python] Error using extension types in struct in PyArrow](https://github.com/apache/arrow/issues/44853)  
- **Reactions:** 👍 4  
- **Related PR:** [#48746 [Python] Construct UuidArray from list of UuidScalars](https://github.com/apache/arrow/pull/48746)  
- **Analysis:** There is ongoing pressure to make **extension types** behave naturally in nested schemas and array construction. This is important for advanced users modeling domain-specific types on top of Arrow primitives.

## 4) Bugs & Stability

Ranked by likely impact/severity based on build breakage, user-facing incorrect behavior, and scope.

### High severity

1. **Windows wheel builds failing during docstring update**
   - **Issue:** [#49531 [CI][Python][Packaging] Windows wheels fail on the updating docstrings step](https://github.com/apache/arrow/issues/49531)
   - **Fix PR:** [#49532](https://github.com/apache/arrow/pull/49532) — closed
   - **Why it matters:** Directly affects production artifact generation for PyArrow on Windows. Quickly fixed, which is a strong maintenance signal.

2. **Release builds linking debug Snappy/Brotli with vcpkg multi-config**
   - **Issue:** [#49499 Snappy and Brotli debug libraries linked in Release builds when using vcpkg with multi-config generators](https://github.com/apache/arrow/issues/49499)
   - **Why it matters:** Causes **LNK2038 ABI/runtime mismatch** failures in consumer builds. This is a serious integration problem for C++ users embedding Arrow on Windows.

3. **Missing gflags dependency under Flight SQL + examples**
   - **Issue:** [#49541 [C++] `ARROW_FLIGHT_SQL=ON` and `ARROW_BUILD_EXAMPLES=ON` miss gflags dependency](https://github.com/apache/arrow/issues/49541)
   - **Fix PR:** [#49542](https://github.com/apache/arrow/pull/49542) — open
   - **Why it matters:** Build configuration bug affecting C++ users enabling Flight SQL examples; likely straightforward and likely to merge soon.

### Medium severity

4. **`parquet-scan` CLI fails to show usage info**
   - **Issue:** [#49539 parquet-scan doesn't show the usage info](https://github.com/apache/arrow/issues/49539)
   - **Fix PR:** [#49540](https://github.com/apache/arrow/pull/49540) — open
   - **Why it matters:** Not a data corruption bug, but a visible UX defect in a Parquet tool. Easy fix already proposed.

5. **PyArrow extension types fail inside struct**
   - **Issue:** [#44853 [Python] Error using extension types in struct in PyArrow](https://github.com/apache/arrow/issues/44853)
   - **Why it matters:** Impacts advanced schema modeling and nested type composition. Important for correctness and API consistency.

6. **R CI NOTE due to non-API R call**
   - **Issue:** [#49529 [R] CI job shows NOTE due to "non-API call" Rf_findVarInFrame](https://github.com/apache/arrow/issues/49529)
   - **Fix PR:** [#49530](https://github.com/apache/arrow/pull/49530) — open
   - **Why it matters:** Primarily packaging/compliance risk for R/CRAN rather than runtime correctness, but important for release hygiene.

### Lower severity / watchlist

7. **Security concern from downstream user about bundled grpc version**
   - **Issue:** [#45812 Corona scan shows KEV high risk for pyarrow 19.0.1 for grpc version](https://github.com/apache/arrow/issues/45812)
   - **Why it matters:** This is a downstream security/compliance concern rather than a confirmed Arrow defect, but given enterprise adoption, maintainers may need better visibility/documentation around dependency provenance and version exposure.

## 5) Feature Requests & Roadmap Signals

### Strong signals likely to influence near-term work

1. **Windows Flight SQL ODBC packaging hardening**
   - [#49404](https://github.com/apache/arrow/issues/49404)
   - [#49538](https://github.com/apache/arrow/issues/49538)
   - [#49537](https://github.com/apache/arrow/issues/49537)  
   These clustered issues suggest near-term work on **MSI generation, signing, and static linkage**. This looks likely to land relatively soon because the work is concrete, operationally urgent, and already split into implementation steps.

2. **R dplyr compatibility expansion**
   - [#49534 [R] Implement dplyr recode_values(), replace_values(), and replace_when()](https://github.com/apache/arrow/issues/49534)  
   - PR: [#49536](https://github.com/apache/arrow/pull/49536)
   - PR: [#49535 [R] Implement dplyr's when_any() and when_all() helpers](https://github.com/apache/arrow/pull/49535)  
   Arrow R continues to close feature gaps with dplyr semantics. These are good candidates for the next release because implementations are already in PR review.

3. **PyArrow type stubs / typing improvements**
   - PR: [#48622 [Python] Add internal type system stubs](https://github.com/apache/arrow/pull/48622)  
   This suggests continued investment in **typing and IDE/static-analysis support**. Not an execution-engine feature, but valuable for developer adoption.

4. **Extension-type usability in Python**
   - PR: [#48746 [Python] Construct UuidArray from list of UuidScalars](https://github.com/apache/arrow/pull/48746)  
   More ergonomic extension-type handling is likely to continue, especially where nested schemas or scalar/array construction are involved.

### Longer-horizon signals

5. **Transport-agnostic Flight RPC refactoring**
   - [#31275](https://github.com/apache/arrow/issues/31275)
   - [#31276](https://github.com/apache/arrow/issues/31276)  
   These indicate architectural interest in decoupling Flight from grpc-specific transport layers, but they remain old and relatively inactive. Important strategically, not evidently imminent.

6. **Temporal semantics in R/C++**
   - [#31254](https://github.com/apache/arrow/issues/31254)
   - [#31240](https://github.com/apache/arrow/issues/31240)  
   Persistent demand exists, but these look less likely for the immediate next release unless a champion appears.

## 6) User Feedback Summary

Today’s issue flow reveals several practical user pain points:

- **Packaging and installation remain a major source of friction**, especially on Windows:
  - MSI signing for ODBC
  - DLL cleanup during wheel builds
  - vcpkg linkage mismatches
  - missing third-party dependencies in certain CMake option combinations

- **Users want Arrow-backed APIs to behave like familiar dataframe ecosystems**, especially:
  - R date/time parsing and casting behavior
  - dplyr helper coverage
  - Python nested/extension type ergonomics

- **Advanced Python users continue pushing Arrow beyond primitive/tabular use cases**:
  - arbitrary Python object serialization to Parquet
  - struct fields containing extension types
  - richer typing and stubs

- **Security and supply-chain expectations are rising**:
  - trusted publishing to PyPI
  - concerns about transitive dependency vulnerabilities

Overall, user sentiment from the issue set is less about raw performance complaints and more about **compatibility, polish, packaging robustness, and semantic completeness**.

## 7) Backlog Watch

These older or slow-moving items appear important and may need maintainer attention:

- **[#31254 [R] [C++] Should strptime support a partial format?](https://github.com/apache/arrow/issues/31254)**  
  Longstanding, highly discussed, and tied to user expectations around temporal parsing.

- **[#31240 [R][C++] Plans for date casting from int to support an origin option?](https://github.com/apache/arrow/issues/31240)**  
  Marked critical and still unresolved; relevant for correctness and interoperability in R workflows.

- **[#31267 [Python] Allow serializing arbitrary Python objects to parquet](https://github.com/apache/arrow/issues/31267)**  
  Popular conceptually, but likely blocked by design constraints; may benefit from a clear maintainer position or documentation-based resolution.

- **[#48622 [Python] Add internal type system stubs](https://github.com/apache/arrow/pull/48622)**  
  Open since 2025-12-22. Valuable infrastructure work that can languish because it is not urgent but improves the Python developer experience.

- **[#40354 [Python] Add Python wrapper for VariableShapeTensor](https://github.com/apache/arrow/pull/40354)**  
  Long-running feature PR tied to broader tensor support. Important for advanced ML/data interchange use cases.

- **[#45160 [Docs][Python] Add all tensor classes documentation](https://github.com/apache/arrow/pull/45160)**  
  Documentation debt around tensor APIs suggests the feature surface may be under-explained for users.

- **[#48539 [Python][CI] Add support for building PyArrow library on Windows ARM64](https://github.com/apache/arrow/pull/48539)**  
  Strategic for platform expansion. With Windows on ARM growing, this deserves sustained attention.

## 8) Linked Items Referenced

### Issues
- [#44733](https://github.com/apache/arrow/issues/44733)
- [#49404](https://github.com/apache/arrow/issues/49404)
- [#49499](https://github.com/apache/arrow/issues/49499)
- [#31254](https://github.com/apache/arrow/issues/31254)
- [#31240](https://github.com/apache/arrow/issues/31240)
- [#31267](https://github.com/apache/arrow/issues/31267)
- [#44853](https://github.com/apache/arrow/issues/44853)
- [#49538](https://github.com/apache/arrow/issues/49538)
- [#49537](https://github.com/apache/arrow/issues/49537)
- [#49541](https://github.com/apache/arrow/issues/49541)
- [#49539](https://github.com/apache/arrow/issues/49539)
- [#49531](https://github.com/apache/arrow/issues/49531)
- [#49529](https://github.com/apache/arrow/issues/49529)
- [#45812](https://github.com/apache/arrow/issues/45812)
- [#49534](https://github.com/apache/arrow/issues/49534)
- [#31275](https://github.com/apache/arrow/issues/31275)
- [#31276](https://github.com/apache/arrow/issues/31276)

### Pull Requests
- [#49542](https://github.com/apache/arrow/pull/49542)
- [#49540](https://github.com/apache/arrow/pull/49540)
- [#49510](https://github.com/apache/arrow/pull/49510)
- [#49532](https://github.com/apache/arrow/pull/49532)
- [#49530](https://github.com/apache/arrow/pull/49530)
- [#48746](https://github.com/apache/arrow/pull/48746)
- [#49259](https://github.com/apache/arrow/pull/49259)
- [#49536](https://github.com/apache/arrow/pull/49536)
- [#49535](https://github.com/apache/arrow/pull/49535)
- [#48622](https://github.com/apache/arrow/pull/48622)
- [#40354](https://github.com/apache/arrow/pull/40354)
- [#45160](https://github.com/apache/arrow/pull/45160)
- [#48539](https://github.com/apache/arrow/pull/48539)
- [#49476](https://github.com/apache/arrow/pull/49476)
- [#49488](https://github.com/apache/arrow/pull/49488)

If you want, I can also turn this into a **short executive summary**, a **maintainer-focused action list**, or a **table format sorted by subsystem**.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*