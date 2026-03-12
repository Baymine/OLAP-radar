# Apache Doris Ecosystem Digest 2026-03-12

> Issues: 25 | PRs: 113 | Projects covered: 10 | Generated: 2026-03-12 03:16 UTC

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

# Apache Doris Project Digest — 2026-03-12

## 1) Today’s Overview

Apache Doris remained **highly active** over the last 24 hours, with **113 PRs updated** and **25 issues updated**, indicating strong ongoing development velocity across query execution, lakehouse connectivity, cloud mode, and storage/runtime stability. Although there were **no new releases**, the repository shows healthy forward motion: **40 PRs were merged or closed**, while new bug reports and roadmap discussions suggest the project is actively balancing innovation with operational hardening.  

A clear theme today is **external table/lakehouse interoperability**—especially around **Iceberg, Paimon, Hive, Elasticsearch, and Nessie**—paired with continued work on **query engine correctness**, **memory/spill behavior**, and **cloud observability**. At the same time, several newly updated bugs point to ongoing pressure in **materialized view correctness**, **Iceberg scan stability**, and **catalog/query compatibility**, which are important areas to watch for upcoming 4.0.x/4.1.x maintenance releases.

---

## 3) Project Progress

### Merged/Closed PRs today: notable technical progress

#### Query engine and SQL/planner improvements
- **MATCH projection support for inverted index evaluation** was merged in [PR #61092](https://github.com/apache/doris/pull/61092). This improves search-query execution by allowing `MATCH` expressions in the `SELECT` list to benefit from inverted index evaluation in cases where filter pushdown is semantically unsafe, especially around outer joins.  
  **Why it matters:** this is a meaningful step in Doris’s AI/search-oriented query path, improving index utility without violating join correctness.

- **Constraint management centralization** landed in [PR #61118](https://github.com/apache/doris/pull/61118). Constraint storage, CRUD, persistence, rename/drop behavior, and migration are now consolidated under a `ConstraintManager`.  
  **Why it matters:** this is infrastructure work, but strategically useful for schema governance, metadata consistency, and future optimizer behavior.

- **Key encoding/refactor in BE storage path** closed via [PR #61226](https://github.com/apache/doris/pull/61226), moving row-type-specific encoding logic into rowcursor-related code.  
  **Why it matters:** not user-visible by itself, but likely reduces technical debt and improves maintainability in the backend storage/key path.

#### Lakehouse / external catalog compatibility
- **Paimon support on OBS/PFS** was merged in [PR #60995](https://github.com/apache/doris/pull/60995) and backported in [PR #61217](https://github.com/apache/doris/pull/61217).  
  **Why it matters:** expands object-store compatibility for Paimon catalogs, relevant for cloud-native users.

- **Paimon date partition compatibility for `partition.legacy-name`** merged in [PR #61076](https://github.com/apache/doris/pull/61076), with branch follow-up in [PR #61164](https://github.com/apache/doris/pull/61164).  
  **Why it matters:** directly addresses interoperability friction with external metadata conventions.

#### Test and stability hygiene
- **Unstable test fixes** were closed in [PR #61218](https://github.com/apache/doris/pull/61218), specifically around file cache metric refresh timing.
- A geometry-related addition, **GEOS-based planar geometry functions**, was closed in [PR #61230](https://github.com/apache/doris/pull/61230). Since it was closed rather than merged, this suggests feature interest exists but may need redesign/rework.

### In-flight work worth noting
Several important PRs remain open and look significant for near-term releases:

- **ASOF join support**: [PR #59591](https://github.com/apache/doris/pull/59591)  
- **Global monotonically increasing TSO**: [PR #61199](https://github.com/apache/doris/pull/61199)  
- **Multi-level partition spilling**: [PR #61212](https://github.com/apache/doris/pull/61212)  
- **Separate file cache control for OLAP vs external catalogs**: [PR #60583](https://github.com/apache/doris/pull/60583)  
- **File cache admission control**: [PR #59065](https://github.com/apache/doris/pull/59065)  
- **2Q-LRU file cache hot/cold protection**: [PR #57410](https://github.com/apache/doris/pull/57410)

These suggest active investment in **time-series/analytical SQL semantics**, **transaction ordering infrastructure**, and **cache efficiency for mixed OLAP + lakehouse workloads**.

---

## 4) Community Hot Topics

### 1. Doris Roadmap 2026
- [Issue #60036](https://github.com/apache/doris/issues/60036) — **15 👍 / 12 comments**
- Topic: “Scale Intelligence, Accelerate Insights”

This is the clearest strategic signal in the repository. The roadmap emphasizes **AI & hybrid search**, **query performance**, and **storage efficiency**, building on prior vector search/indexing work. The engagement level shows the community is aligned around Doris expanding beyond traditional MPP OLAP into a broader **search + analytics + lakehouse** platform.

**Underlying technical need:** users want one engine that can unify:
- structured OLAP,
- semi-structured analysis,
- hybrid/vector/search use cases,
- and federated access to open table formats.

### 2. Legacy roadmap closure / continuity
- [Issue #47948](https://github.com/apache/doris/issues/47948) — **27 👍 / 8 comments**

The 2025 roadmap was closed, likely reflecting transition to the 2026 plan. The strong reaction count suggests roadmap issues are meaningful governance artifacts for the community.

**Underlying technical need:** users and contributors want clearer expectations on when large themes—lakehouse support, semi-structured data, AI/search, cloud mode—become production-ready.

### 3. Major feature PRs under active development
- [PR #59591](https://github.com/apache/doris/pull/59591) — ASOF join
- [PR #61199](https://github.com/apache/doris/pull/61199) — global TSO
- [PR #59065](https://github.com/apache/doris/pull/59065) — file cache admission control
- [PR #57410](https://github.com/apache/doris/pull/57410) — 2Q-LRU file cache
- [PR #61212](https://github.com/apache/doris/pull/61212) — multi-level partition spilling

These are not the most commented numerically in the provided snapshot, but they are technically the most important. They indicate strong demand for:
- **time-aware joins**
- **better transaction ordering / concurrency semantics**
- **predictable memory usage under pressure**
- **smarter cache behavior for external data scans**

---

## 5) Bugs & Stability

### Severity-ranked issues reported/updated today

#### Critical
1. **BE crash when scanning/loading Iceberg tables**
   - [Issue #61225](https://github.com/apache/doris/issues/61225)  
   - Version: **v4.0.2**
   - Symptom: **SIGSEGV** in `ByteArrayDictDecoder` plus `std::out_of_range` during Iceberg scan/load.

   **Assessment:** highest-severity issue in today’s list because it is a reproducible backend crash involving a key lakehouse integration path. There is no directly linked fix PR in the provided data yet. This should be treated as a likely candidate for urgent 4.0.x maintenance attention.

2. **BE repeatedly crashes after invalid field-name internal error**
   - [Issue #59546](https://github.com/apache/doris/issues/59546)  
   - Version: **4.0.2**
   - Symptom: backend crashes and continues crashing after restart, with log `field name is invalid`.

   **Assessment:** severe because it appears persistent across restarts, suggesting metadata corruption, malformed schema handling, or fatal replay/recovery behavior.

#### High
3. **Materialized view causes query result inconsistency**
   - [Issue #61228](https://github.com/apache/doris/issues/61228)  
   - Version: **4.0.1**
   - Symptom: same SQL returns different results depending on plan shape; reporter traced it to **MV hit/match behavior** using fields not present in the MV.

   **Assessment:** correctness issues are high severity in analytical databases. This may indicate a planner rewrite or MV substitution bug.  
   **Related fix nearby:** [PR #61145](https://github.com/apache/doris/pull/61145) fixes a `ConcurrentModificationException` in MV `PartitionCompensator`, but that is not the same issue; still, it shows active MV stabilization work.

4. **View + ORDER BY causes over-aggressive column pruning**
   - [Issue #61219](https://github.com/apache/doris/issues/61219)  
   - Version: **4.0.1**
   - Symptom: non-`ORDER BY` columns become null/empty when selecting from a view ordered by specific columns.

   **Assessment:** likely optimizer/projection pruning bug, directly affecting query correctness.

5. **Nessie REST catalog can list DBs/tables but cannot query data**
   - [Issue #61191](https://github.com/apache/doris/issues/61191)  
   - Version: **4.0.3**
   - Symptom: metadata access succeeds, but table query execution fails.

   **Assessment:** high-impact lakehouse compatibility problem. It suggests the catalog integration path is more mature at metadata enumeration than at actual data read planning/execution.

#### Medium
6. **Stream load fails after drop column on table with materialized view**
   - [Issue #55272](https://github.com/apache/doris/issues/55272)  
   - Versions: **2.1.x / 3.0.x**
   - Symptom: cast/type-analysis error after schema evolution with MV present.

   **Assessment:** important for production ETL pipelines; schema evolution remains a pain point when MVs are involved.

7. **Storage policy not preserved when adding partition**
   - [Issue #55967](https://github.com/apache/doris/issues/55967)  
   - Symptom: policy loss after partition alter.

8. **Delete job hangs when a BE is permanently dead**
   - [Issue #55971](https://github.com/apache/doris/issues/55971)

9. **Cloud mode missing `alter disable_auto_compaction` support**
   - [Issue #55968](https://github.com/apache/doris/issues/55968)

### Fixes in progress likely to improve stability
- Null pointer / agent task crash prevention: [PR #61240](https://github.com/apache/doris/pull/61240)
- Load memory regression fix: [PR #61173](https://github.com/apache/doris/pull/61173)
- Timezone correctness fixes: [PR #61151](https://github.com/apache/doris/pull/61151)
- Outfile race condition fix under parallel export: [PR #61223](https://github.com/apache/doris/pull/61223)
- ES array-in-keyword field query fix: [PR #61236](https://github.com/apache/doris/pull/61236)

Overall, the bug pattern today points to a familiar Doris tension: **rapid feature expansion in lakehouse/search/cloud areas is creating edge-case correctness and stability work, especially in 4.0.x**.

---

## 6) Feature Requests & Roadmap Signals

### Strong roadmap/feature signals from issues
A cluster of open roadmap-like issues updated today points to where Doris is heading:

- **Metadata performance for Hive/Iceberg/Paimon**  
  [Issue #55999](https://github.com/apache/doris/issues/55999)  
- **Iceberg small-file compaction and snapshot management**  
  [Issue #56002](https://github.com/apache/doris/issues/56002)  
- **Snowflake Iceberg table engine support**  
  [Issue #56004](https://github.com/apache/doris/issues/56004)  
- **Hive 4 transactional table support**  
  [Issue #56010](https://github.com/apache/doris/issues/56010)  
- **Doris Catalog for federated query across Doris clusters**  
  [Issue #56011](https://github.com/apache/doris/issues/56011)  
- **Unified data source property names**  
  [Issue #56015](https://github.com/apache/doris/issues/56015)  
- **File system pluginization**  
  [Issue #56016](https://github.com/apache/doris/issues/56016)  
- **JDBC Catalog pluginization**  
  [Issue #56017](https://github.com/apache/doris/issues/56017)  
- **Connection property refactor**  
  [Issue #50238](https://github.com/apache/doris/issues/50238)

### What these requests imply
The technical direction is consistent:
1. **Doris wants deeper open-table-format/lakehouse support**, especially around **Iceberg**.
2. **Catalog and connector architecture is being generalized**, likely to reduce per-connector complexity and improve pluggability.
3. **Cross-engine federation** is becoming more central, including even **Doris-to-Doris federation**.
4. **Operational consistency** in config/property naming is now a recognized usability need.

### Likely next-version candidates
Based on current PR momentum and issue clustering, the most likely candidates for a near-term release are:
- **File cache behavior improvements**: [PR #60583](https://github.com/apache/doris/pull/60583), [PR #59065](https://github.com/apache/doris/pull/59065), [PR #57410](https://github.com/apache/doris/pull/57410)
- **Spill/memory pressure handling**: [PR #61212](https://github.com/apache/doris/pull/61212)
- **ASOF join**: [PR #59591](https://github.com/apache/doris/pull/59591)
- **Cloud/instance lifecycle capabilities**: [PR #61221](https://github.com/apache/doris/pull/61221)
- **TSO infrastructure**: [PR #61199](https://github.com/apache/doris/pull/61199)

More speculative but strategically aligned:
- improved **Iceberg operational tooling**,
- **metadata access optimization** for external catalogs,
- and more **catalog/plugin refactoring**.

---

## 7) User Feedback Summary

### Main pain points observed
1. **Lakehouse interoperability is valuable but still uneven**
   - Iceberg crashes: [#61225](https://github.com/apache/doris/issues/61225)
   - Nessie REST catalog query failures: [#61191](https://github.com/apache/doris/issues/61191)
   - Metadata/performance optimization asks: [#55999](https://github.com/apache/doris/issues/55999)

   **Interpretation:** users are trying to use Doris as a serious federated/lakehouse query engine, not just as an internal OLAP store. Basic connectivity is no longer enough; they need reliable reads, robust schema handling, and performant planning.

2. **Query correctness remains a top expectation**
   - MV substitution/result mismatch: [#61228](https://github.com/apache/doris/issues/61228)
   - View column pruning bug: [#61219](https://github.com/apache/doris/issues/61219)

   **Interpretation:** users increasingly trust Doris with complex SQL abstractions—views, MVs, optimizer rewrites—but correctness bugs in these areas are costly because they may produce silently wrong answers.

3. **Schema evolution and maintenance workflows are fragile**
   - Stream load after drop column with MV: [#55272](https://github.com/apache/doris/issues/55272)
   - Storage policy not preserved on partition alter: [#55967](https://github.com/apache/doris/issues/55967)

4. **Cloud-mode operational parity is still incomplete**
   - Missing `show meta-services` in cloud mode was closed stale: [#53489](https://github.com/apache/doris/issues/53489)
   - `disable_auto_compaction` not supported in cloud mode: [#55968](https://github.com/apache/doris/issues/55968)

### Satisfaction signals
The roadmap issues’ engagement suggests the community is still optimistic about Doris’s direction. The large PR volume and multiple backports/branch picks indicate an active maintainer base and ongoing release engineering discipline, even without a new release today.

---

## 8) Backlog Watch

These items look important and likely deserve maintainer attention because they are strategically relevant, user-facing, or aging without visible closure.

### Important open issues
- **Metadata performance for Hive/Iceberg/Paimon**  
  [Issue #55999](https://github.com/apache/doris/issues/55999)  
  Strategic for lakehouse competitiveness; currently underspecified.

- **Iceberg small file compaction and snapshot management**  
  [Issue #56002](https://github.com/apache/doris/issues/56002)  
  High-value operational feature if Doris wants deeper Iceberg lifecycle management.

- **Snowflake Iceberg table engine support**  
  [Issue #56004](https://github.com/apache/doris/issues/56004)  
  Relevant for enterprise interoperability.

- **Hive 4 transaction table support**  
  [Issue #56010](https://github.com/apache/doris/issues/56010)  
  Important for modern Hive ecosystem users.

- **Federated queries across multiple Doris clusters**  
  [Issue #56011](https://github.com/apache/doris/issues/56011)  
  Potentially strategic for large organizations operating regional or domain-specific Doris clusters.

- **Unify data source property names**  
  [Issue #56015](https://github.com/apache/doris/issues/56015)  
  Less flashy, but highly impactful for usability and support burden.

- **Pluginization efforts**
  - [Issue #56016](https://github.com/apache/doris/issues/56016) — file systems
  - [Issue #56017](https://github.com/apache/doris/issues/56017) — JDBC catalog

### Important open PRs needing attention
- **ASOF join** — [PR #59591](https://github.com/apache/doris/pull/59591)  
  High-value analytical SQL feature.

- **File cache admission control** — [PR #59065](https://github.com/apache/doris/pull/59065)  
  Important for mixed scan workloads.

- **2Q-LRU cache protection** — [PR #57410](https://github.com/apache/doris/pull/57410)  
  Potentially meaningful performance uplift; long-lived PRs need review momentum.

- **Separate file cache control for OLAP vs external catalogs** — [PR #60583](https://github.com/apache/doris/pull/60583)  
  Particularly important as Doris serves both native and external-storage workloads.

- **Global TSO** — [PR #61199](https://github.com/apache/doris/pull/61199)  
  Architecturally significant; warrants close design review.

---

## Overall Health Assessment

Apache Doris appears **healthy and fast-moving**, with especially strong momentum in **query engine evolution, cloud/lakehouse support, and storage/runtime tuning**. The most important risk area is **correctness and stability at the integration boundaries**—notably **Iceberg/Nessie**, **materialized views**, and **optimizer pruning/substitution paths**. If maintainers can close the gap between feature ambition and edge-case reliability, the current roadmap trajectory looks strong for the next 4.0.x/4.1.x cycle.

---

## Cross-Engine Comparison

# Cross-Engine Comparison Report — 2026-03-12

## 1. Ecosystem Overview

The open-source OLAP and analytical storage ecosystem remains highly active, with strong parallel investment in **lakehouse interoperability, query correctness, cloud/object storage efficiency, and SQL/runtime hardening**. Across engines, the center of gravity has shifted beyond classic warehouse execution toward a broader platform model: **MPP OLAP + open table formats + semi-structured data + search/vector/hybrid workloads**. The busiest projects are balancing rapid feature expansion with growing pressure on **upgrade safety, optimizer correctness, and operational predictability**. Overall, the landscape is healthy, but most major engines are in a phase where **integration quality and semantics consistency** matter as much as raw performance.

---

## 2. Activity Comparison

### Daily activity snapshot

| Engine | Issues Updated | PRs Updated | Release Status | Health Score* | Current Read |
|---|---:|---:|---|---:|---|
| **ClickHouse** | 39 | 210 | No release today | **9.3/10** | Extremely high throughput; strong maintainer responsiveness; watch 26.2 insert regression |
| **StarRocks** | 14 | 129 | No release today | **8.9/10** | Strong backport discipline; active correctness and Iceberg hardening |
| **Apache Doris** | 25 | 113 | No release today | **8.8/10** | Very active; strong roadmap momentum; risks concentrated in lakehouse correctness/stability |
| **DuckDB** | 16 | 64 | No release today | **8.6/10** | High velocity, but currently regression-fixing-heavy around 1.5.x |
| **Velox** | 25 | 50 | No release today | **8.5/10** | Strong infra and engine work; still maintenance-heavy in spill/memory/GPU areas |
| **Apache Iceberg** | 10 | 43 | No release today | **8.4/10** | Strategically important and active; storage I/O and connector reliability remain pressure points |
| **Delta Lake** | 1 | 33 | No release today; 4.2.0-SNAPSHOT opened | **8.3/10** | Focused, coordinated development; more implementation-heavy than issue-driven today |
| **Apache Arrow** | 25 | 25 | No release today | **8.2/10** | Healthy infra project; strong Parquet hardening and packaging work |
| **Apache Gluten** | 5 | 27 | No release today | **8.1/10** | Good momentum; Spark 4.x parity and upstream dependency lag remain key constraints |
| **Databend** | 9 | 15 | No release today | **8.0/10** | Solid responsiveness; smaller scale but good SQL/runtime hardening focus |

\*Health score is a qualitative synthesis of activity level, maintainer responsiveness, bug severity profile, and roadmap coherence based on today’s digest.

### Simple activity tiering

- **Tier 1 throughput:** ClickHouse, StarRocks, Apache Doris  
- **Tier 2 high activity:** DuckDB, Velox, Apache Iceberg  
- **Tier 3 focused iteration:** Delta Lake, Apache Arrow, Apache Gluten  
- **Tier 4 smaller but healthy:** Databend  

---

## 3. Apache Doris's Position

### Where Doris is strong versus peers

**Apache Doris is one of the most active engines in the ecosystem today**, trailing only ClickHouse in raw PR throughput among the classic analytical database projects in this comparison set. Its strongest visible advantages are:

- **Broad platform ambition**: Doris is pushing simultaneously on **MPP OLAP, external lakehouse querying, hybrid search, vector/search-adjacent capabilities, and cloud mode**.
- **Connector breadth and federation direction**: active work spans **Iceberg, Paimon, Hive, Elasticsearch, Nessie**, with roadmap signals toward **pluginized catalogs/filesystems** and even **Doris-to-Doris federation**.
- **High roadmap coherence**: the 2026 roadmap has clear community engagement and aligns with code activity around **AI/search + analytics + open table formats**.
- **Release-engineering discipline**: backports and branch-picks indicate operational maturity, not just feature churn.

### Where Doris is weaker or riskier versus peers

Compared with peers, Doris currently shows more visible risk in **integration-boundary correctness**:

- **vs ClickHouse:** Doris has broader explicit lakehouse/catalog roadmap motion, but ClickHouse currently shows larger community throughput and often deeper execution/storage maturity in core OLAP internals.
- **vs StarRocks:** Doris and StarRocks are strategically close, but StarRocks today appears slightly tighter in **multi-branch backport discipline** and somewhat more concentrated on **query correctness + Iceberg stabilization**.
- **vs DuckDB:** Doris is far more distributed/cloud/lakehouse oriented; DuckDB is stronger in embedded/local analytics simplicity, but not a direct replacement.
- **vs Iceberg/Delta:** Doris is a query engine first, not a table format/transaction layer first; it depends on interoperability quality rather than owning the table abstraction.
- **vs Velox/Gluten/Arrow:** Doris is a complete database platform, whereas those projects are infrastructure/runtime layers.

### Technical approach differences

Apache Doris differs from most peers in combining:

- **native MPP OLAP storage + query engine**
- **federated access to external lakehouse formats**
- **emerging search/hybrid-search capabilities**
- **cloud-mode operational model**

That makes Doris more directly comparable to **StarRocks and ClickHouse** than to DuckDB, Delta, or Iceberg. Relative to ClickHouse, Doris appears more visibly focused on **unified lakehouse/catalog interoperability**; relative to StarRocks, Doris appears slightly more explicit about **AI/search + analytics convergence**.

### Community size comparison

By current daily repo activity:

- **Larger visible community/throughput:** ClickHouse
- **Comparable high-activity peer group:** StarRocks, Apache Doris
- **Smaller but still very active:** DuckDB, Iceberg
- **More focused or specialized communities:** Delta Lake, Velox, Arrow, Gluten, Databend

So Doris sits in the **top tier of project activity** and appears to have a **large and engaged maintainer/contributor base**, though not the largest in this set.

---

## 4. Shared Technical Focus Areas

Several requirements are emerging across multiple engines at the same time.

### A. Lakehouse / open table format interoperability
**Engines:** Apache Doris, ClickHouse, StarRocks, Apache Iceberg, Delta Lake, Velox, Gluten, DuckDB  
**Observed needs:**
- reliable **Iceberg query/read behavior**
- better **metadata performance**
- support for **schema evolution**, **default values**, **variant/semi-structured types**
- stronger **catalog semantics** and **external path handling**

**Examples**
- Doris: Iceberg crashes, Nessie query failures, metadata-performance requests
- ClickHouse: Iceberg external paths, Iceberg observability fixes
- StarRocks: Iceberg v3 metadata/defaults/lineage, MV rewrite correctness over Iceberg
- Iceberg: V4 manifests, FileIO/cloud reliability, VARIANT support across Spark/Flink/Kafka Connect
- Velox/Gluten: Iceberg compatibility in Spark/Velox stacks

### B. Query correctness over optimizer complexity
**Engines:** Apache Doris, StarRocks, DuckDB, Databend, ClickHouse, Gluten  
**Observed needs:**
- safer **MV rewrite**
- correct **column pruning**
- stable **partition pruning**
- robust **subquery decorrelation**
- correct **join edge-case handling**

This is one of the clearest ecosystem-wide themes: users increasingly trust engines with advanced SQL abstractions, and maintainers are paying the cost of more complex rewrite/planning stacks.

### C. Object storage and remote I/O efficiency
**Engines:** Apache Doris, ClickHouse, StarRocks, Apache Iceberg, Arrow  
**Observed needs:**
- better **S3/GCS/object-store client behavior**
- smarter **cache admission/retention**
- fewer misleading storage errors
- lower metadata/list overhead
- better timeout/connection control

This is a strong indicator that cloud-object-storage-first analytics is now mainstream, not edge usage.

### D. Memory pressure, spill, and cache management
**Engines:** Apache Doris, ClickHouse, StarRocks, Velox, Gluten  
**Observed needs:**
- predictable spill behavior
- lower peak memory under concurrency
- better cache hot/cold protection
- fewer OOMs from connector/query metadata paths

Doris is especially active here with **file cache admission, 2Q-LRU, separate OLAP vs external cache control, and multi-level partition spilling**.

### E. SQL dialect compatibility and usability
**Engines:** DuckDB, StarRocks, Databend, Delta Lake, Gluten  
**Observed needs:**
- syntax compatibility for migration/generated SQL
- case-insensitive or dialect-correct function handling
- parser support for more warehouse-style SQL
- practical ergonomics (`GROUP BY ALL`, alias syntax, trigger parsing, Unicode identifiers)

### F. Semi-structured / VARIANT / JSON maturity
**Engines:** DuckDB, Iceberg, ClickHouse, Delta Lake, Gluten, Arrow  
**Observed needs:**
- correct typing/export semantics
- consistent predicate behavior
- interoperability with Parquet and schema-managed lakes
- engine-to-engine semantic parity

---

## 5. Differentiation Analysis

### By storage format stance

| Engine | Primary Storage Stance | Differentiation |
|---|---|---|
| **Apache Doris** | Native OLAP storage + federated external table/lakehouse access | Hybrid database + federated query engine |
| **ClickHouse** | Native columnar storage with growing external/lakehouse support | Performance-first OLAP engine with expanding remote storage story |
| **DuckDB** | Local/embedded analytical engine over files and in-process data | Embedded analytics and file-native SQL |
| **StarRocks** | Native engine + strong shared-data/lakehouse integration | Cloud/shared-data analytical DB with strong Iceberg focus |
| **Apache Iceberg** | Table format / metadata layer, not query engine | Interchange and transactional table substrate |
| **Delta Lake** | Transactional table format around Spark/kernel ecosystem | Governance and DSv2/kernel-centric lakehouse layer |
| **Databend** | Cloud data warehouse engine | SQL warehouse with simpler ecosystem footprint |
| **Velox** | Execution engine library | Reusable query runtime, not end-user DB |
| **Gluten** | Spark acceleration layer | Native backend for Spark via Velox/others |
| **Arrow** | In-memory columnar format + data access/tooling | Foundational data plane and interchange layer |

### By query engine design

- **Apache Doris / StarRocks / ClickHouse / Databend**: full analytical DB engines
- **DuckDB**: embedded single-process analytical engine
- **Velox**: reusable vectorized execution runtime
- **Gluten**: Spark-native acceleration layer
- **Iceberg / Delta**: storage-table abstraction layers, not primary SQL engines
- **Arrow**: shared memory/format/runtime library underpinning engines

### By target workload

- **Apache Doris**: interactive analytics, lakehouse federation, cloud analytics, emerging hybrid search
- **ClickHouse**: very high-performance OLAP, real-time analytics, distributed large-scale querying
- **StarRocks**: MPP analytics with strong shared-data/lakehouse deployment patterns
- **DuckDB**: notebook/local analytics, embedded processing, data science workflows
- **Iceberg / Delta**: managed lakehouse tables, governance, streaming/batch interoperability
- **Velox / Gluten**: engine builders and Spark acceleration users
- **Arrow**: engine interoperability, data transport, file and in-memory columnar processing

### By SQL compatibility posture

- **Most warehouse/BI compatibility pressure visible today:** DuckDB, StarRocks, Databend, Gluten
- **Most core-engine correctness pressure under advanced SQL rewrites:** Doris, StarRocks, DuckDB
- **More protocol/semantic parity than end-user SQL surface focus:** Delta, Iceberg, Arrow, Velox

---

## 6. Community Momentum & Maturity

### Rapidly iterating
These projects show high feature and fix velocity, with substantial ongoing architecture work:

- **ClickHouse**
- **Apache Doris**
- **StarRocks**
- **DuckDB**

These are the fastest-moving end-user analytical engines right now.

### Iterating with strong infrastructure depth
These projects are active but more subsystem- or platform-layer oriented:

- **Apache Iceberg**
- **Velox**
- **Delta Lake**
- **Apache Arrow**
- **Apache Gluten**

Their momentum is real, but often expressed through **integration layers, metadata evolution, and platform hardening** rather than obvious end-user features.

### Smaller-scale but healthy maturation
- **Databend**

Databend has less visible ecosystem scale than the largest peers, but shows good responsiveness and coherent SQL/runtime improvement.

### Stabilizing vs expanding

**More expansion-oriented**
- Apache Doris
- StarRocks
- Iceberg
- Delta Lake
- Velox/Gluten

**More stabilization-pressure-oriented**
- DuckDB (post-1.5 regression hardening)
- ClickHouse (26.2 regressions, fuzz/CI/storage fixes)
- Arrow (Parquet hardening, packaging reliability)

### Doris’s maturity signal

Doris looks like a project in **late expansion / early consolidation**:
- large roadmap ambition remains intact
- contributor throughput is strong
- but correctness in MVs, external catalogs, and optimizer/lakehouse edges now becomes the gating factor for broader trust

---

## 7. Trend Signals

### 1. The market wants “one engine” across warehouse + lakehouse + semi-structured data
Strongest in **Apache Doris, StarRocks, ClickHouse**, with enabling substrate work in **Iceberg, Delta, Arrow**.  
**Value for architects:** fewer systems to operate; more federation and interoperability become first-class design criteria.

### 2. Open table formats are no longer optional
Iceberg and Delta ecosystem gravity is shaping nearly every analytical engine roadmap.  
**Value for data engineers:** engine choice increasingly depends on **how well it reads, plans, caches, and governs open-format tables**, not just native storage speed.

### 3. Correctness is becoming a bigger differentiator than benchmark speed
MVs, view rewrites, pruning, joins, schema evolution, and metadata propagation issues show up across multiple engines.  
**Value for decision-makers:** production trust now depends heavily on optimizer transparency, regression rate, and maintenance responsiveness.

### 4. Cloud object storage behavior is a strategic battleground
S3/GCS cache behavior, connection pooling, timeout controls, LIST avoidance, and remote scan efficiency recur across projects.  
**Value for architects:** object-store economics and tail-latency behavior should be treated as core evaluation criteria.

### 5. Semi-structured and VARIANT support is moving into the mainstream
Visible across Iceberg, DuckDB, ClickHouse, Delta, Gluten, Arrow.  
**Value for data engineers:** modern analytical platforms are expected to handle mixed structured and semi-structured data without forcing separate systems.

### 6. SQL compatibility still matters for adoption
Even advanced engines are spending effort on parser and semantic compatibility because migration friction remains real.  
**Value for platform teams:** dialect compatibility reduces BI-tool friction, generated SQL breakage, and migration cost.

### 7. Apache Doris-specific signal
Doris is well positioned if the market continues toward **unified analytics + lakehouse federation + hybrid search**, but it must continue closing the reliability gap at the integration boundary—especially for **Iceberg/Nessie, MV rewrite correctness, and optimizer safety**. If it does, it remains one of the strongest contenders in the open-source analytical DB tier.

---

If you want, I can next convert this into either:
1. a **short executive summary**,  
2. a **Doris-vs-ClickHouse-vs-StarRocks deep comparison**, or  
3. a **decision matrix for selecting an engine by workload**.

---

## Peer Engine Reports

<details>
<summary><strong>ClickHouse</strong> — <a href="https://github.com/ClickHouse/ClickHouse">ClickHouse/ClickHouse</a></summary>

# ClickHouse Project Digest — 2026-03-12

## 1) Today's Overview

ClickHouse remains extremely active: **39 issues** and **210 pull requests** were updated in the last 24 hours, with **67 PRs merged/closed** and **14 issues closed**. The overall signal is that the project is in a high-throughput stabilization-and-feature phase rather than a release phase, with **no new releases published today**. Current activity clusters around **performance regressions in 26.2**, **storage/cache behavior on S3/Iceberg**, **CI/fuzz crash triage**, and **incremental SQL/usability improvements**. Project health looks strong in terms of maintainer throughput, though there are still important open items around **replication edge cases, insert performance, and query execution inefficiencies**.

## 2) Project Progress

With **67 PRs merged/closed today**, ClickHouse appears to be advancing on several fronts even though the provided PR sample is biased toward currently open work.

### Query engine and SQL behavior
Ongoing work suggests sustained investment in SQL semantics and execution behavior:
- **Analyzer optimization for repeated aliases** could improve planning overhead in complex SQL workloads: [PR #88043](https://github.com/ClickHouse/ClickHouse/pull/88043)
- **`cast_keep_nullable` extended to Dynamic/JSON types** points to better consistency for semi-structured data handling: [PR #96504](https://github.com/ClickHouse/ClickHouse/pull/96504)
- **`insert_deduplication_token` fix for `INSERT SELECT`** addresses correctness in ingestion semantics: [PR #99206](https://github.com/ClickHouse/ClickHouse/pull/99206)
- **Support for text index on `mapValues(... )` with `IN`** expands index usability for map-heavy schemas: [PR #99286](https://github.com/ClickHouse/ClickHouse/pull/99286)

### Storage engine and replication work
Several active PRs indicate continued development in storage/distributed systems:
- **Skip last N shards when writing to Distributed tables** adds more operational control for distributed ingest/failover scenarios: [PR #99264](https://github.com/ClickHouse/ClickHouse/pull/99264)
- **NuRaft segfault fix** is a notable stability item for keeper/consensus internals: [PR #99133](https://github.com/ClickHouse/ClickHouse/pull/99133)
- **Simplified partition mutations** remains an important long-running improvement for MergeTree maintenance operations: [PR #48941](https://github.com/ClickHouse/ClickHouse/pull/48941)

### Lakehouse and external storage
Lakehouse interoperability continues to be an investment area:
- **Iceberg external paths support** broadens compatibility with real-world table layouts and mixed storage topologies: [PR #90740](https://github.com/ClickHouse/ClickHouse/pull/90740)
- **Fix `system.query_log.read_rows` for Iceberg** improves observability and operational trust in Iceberg scans: [PR #99282](https://github.com/ClickHouse/ClickHouse/pull/99282)

### Operations, security, and multi-tenancy
There are also roadmap signals in deployment ergonomics:
- **`DATABASE NAMESPACE` for multi-tenant isolation** is a substantial feature with platform implications: [PR #98477](https://github.com/ClickHouse/ClickHouse/pull/98477)
- **Disallow settings profiles from config in SQL** improves access-control hardening: [PR #98662](https://github.com/ClickHouse/ClickHouse/pull/98662)
- **Native protocol client-settable `session_id`** is requested on the issue side and aligns with proxy/failover-friendly deployments: [Issue #99040](https://github.com/ClickHouse/ClickHouse/issues/99040)

## 3) Community Hot Topics

### 1. LowCardinality behavior and read-path efficiency
- [Issue #98968](https://github.com/ClickHouse/ClickHouse/issues/98968) — **LowCardinality vs index_granularity**
- [Issue #99236](https://github.com/ClickHouse/ClickHouse/issues/99236) — **Compressed data is decompressed repeatedly for a single query**
- [PR #99285](https://github.com/ClickHouse/ClickHouse/pull/99285) — **Do not invalidate dictionary if there is only one of them**

These items collectively point to a real user need: **predictable performance for lookup-heavy tables with `LowCardinality`, arrays, and compressed storage**. The open issue about repeated decompression plus the PR reducing dictionary invalidation suggest maintainers are actively addressing inefficiencies in the read path.

### 2. Performance regressions after upgrading to 26.2
- [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241) — **INSERT queries are 3x slower after upgrading from 25.12 to 26.2**

This is one of the most important operational signals today. A reported **3x insert slowdown** on `ReplacingMergeTree` after upgrade is exactly the kind of regression that can block adoption of a new stable line. Even without a linked fix PR in the provided data, this is likely to receive fast maintainer attention because it directly affects production upgrade confidence.

### 3. S3 / remote storage behavior
- [Issue #98004](https://github.com/ClickHouse/ClickHouse/issues/98004) — **Filesystem cache discards fully-downloaded segments when query fails/times out**
- [Issue #99140](https://github.com/ClickHouse/ClickHouse/issues/99140) — **S3 function logs Bad Request errors during normal reads**
- [PR #98856](https://github.com/ClickHouse/ClickHouse/pull/98856) — **Redis-backed distributed query result cache**
- [PR #90740](https://github.com/ClickHouse/ClickHouse/pull/90740) — **Iceberg support for external paths**

The community is clearly pushing ClickHouse deeper into **remote-object-storage-first analytics**. Users want better cache warming, fewer misleading errors, and more robust external table path handling. This is a strategic area, especially for cloud and lakehouse deployments.

### 4. Replication and cluster DDL edge cases
- [Issue #44070](https://github.com/ClickHouse/ClickHouse/issues/44070) — **DDLWorker replay failure with offline replica**
- [Issue #87111](https://github.com/ClickHouse/ClickHouse/issues/87111) — **ZooKeeper table structure mismatch after altering with dead replica**
- [PR #99012](https://github.com/ClickHouse/ClickHouse/pull/99012) — **Fix flaky mutation finalization test under TSan parallel**
- [PR #99133](https://github.com/ClickHouse/ClickHouse/pull/99133) — **NuRaft segfault fix**

The underlying need here is operational safety in **replicated MergeTree / Keeper / DDL replay scenarios**. These are not flashy features, but they are core to production trust.

## 4) Bugs & Stability

Ranked by likely operational severity based on the issue summaries.

### Critical
1. **26.2 insert regression: 3x slower INSERTs**
   - [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)
   - Severity rationale: direct production throughput impact on upgrade path; tagged `v26.2-affected`.
   - Fix PR in provided data: **none explicitly linked**.

2. **NuRaft segfault**
   - [PR #99133](https://github.com/ClickHouse/ClickHouse/pull/99133)
   - Severity rationale: keeper/consensus crashes can affect cluster availability.
   - This is a positive sign because a fix PR is already open.

3. **CI crash: double free or corruption in `MergeTreeDataPartCompact`**
   - [Issue #98949](https://github.com/ClickHouse/ClickHouse/issues/98949)
   - Severity rationale: memory corruption in storage-layer code is high risk even if currently observed in CI.

### High
4. **Repeated decompression within a single query**
   - [Issue #99236](https://github.com/ClickHouse/ClickHouse/issues/99236)
   - Severity rationale: likely substantial read amplification/perf waste on some schemas.

5. **Window function parallel evaluation can regress performance**
   - [Issue #97284](https://github.com/ClickHouse/ClickHouse/issues/97284)
   - Severity rationale: affects analytical workloads and could surprise users after optimizer/runtime changes.

6. **Filesystem cache discards fully downloaded segments if query fails/times out**
   - [Issue #98004](https://github.com/ClickHouse/ClickHouse/issues/98004)
   - Severity rationale: hurts incremental cache warming and remote scan efficiency.

7. **S3 function logging spurious Bad Request errors**
   - [Issue #99140](https://github.com/ClickHouse/ClickHouse/issues/99140)
   - Severity rationale: may not break reads, but damages observability and operator confidence.

### Medium
8. **Keeper client cannot connect to ClickHouse Keeper**
   - [Issue #99238](https://github.com/ClickHouse/ClickHouse/issues/99238)
   - Severity rationale: likely configuration/environment-specific, but operationally important.

9. **Vector skip index not used when alias referenced in `WHERE`**
   - [Issue #96647](https://github.com/ClickHouse/ClickHouse/issues/96647)
   - Severity rationale: correctness of planning/index usage for vector search workloads.

10. **`clickhouse format --obfuscate` does not respect index types**
   - [Issue #99248](https://github.com/ClickHouse/ClickHouse/issues/99248)
   - Severity rationale: tooling bug, low production risk, easy-task class.

### Fuzz / CI stability stream
Open and recently closed fuzz issues continue to show heavy automated testing pressure:
- [Issue #99258](https://github.com/ClickHouse/ClickHouse/issues/99258)
- [Issue #96588](https://github.com/ClickHouse/ClickHouse/issues/96588)
- [Issue #99194](https://github.com/ClickHouse/ClickHouse/issues/99194)
- [Issue #99037](https://github.com/ClickHouse/ClickHouse/issues/99037)
- [Issue #99261](https://github.com/ClickHouse/ClickHouse/issues/99261)

This is not necessarily a negative signal; in ClickHouse, a steady flow of fuzz issues often reflects **strong test coverage and aggressive bug surfacing**.

## 5) Feature Requests & Roadmap Signals

### Strong signals
1. **Distributed Redis-backed query result cache**
   - [PR #98856](https://github.com/ClickHouse/ClickHouse/pull/98856)
   - Likely impact: major for repeated BI/dashboard workloads and multi-node cache sharing.
   - Probability of near-term landing: **high**, given concrete implementation and “can be tested”.

2. **Multi-tenant database isolation via `DATABASE NAMESPACE`**
   - [PR #98477](https://github.com/ClickHouse/ClickHouse/pull/98477)
   - Likely impact: important for SaaS/platform operators.
   - Probability: **medium-high**, but feature breadth may require careful review.

3. **Client-settable `session_id` in Native protocol**
   - [Issue #99040](https://github.com/ClickHouse/ClickHouse/issues/99040)
   - Likely impact: useful for proxies, reconnects, and stateful client workflows.
   - Probability: **medium**, clear use case but still issue-stage.

4. **Float output precision setting**
   - [Issue #99199](https://github.com/ClickHouse/ClickHouse/issues/99199)
   - Likely impact: quality-of-life improvement for exports and APIs.
   - Probability: **medium-high**, labeled `easy task`.

5. **Kafka 4 rebalance protocol support via `librdkafka` upgrade**
   - [Issue #88482](https://github.com/ClickHouse/ClickHouse/issues/88482)
   - Likely impact: important for streaming users on newer Kafka stacks.
   - Probability: **medium**, but dependency upgrades can be nontrivial.

6. **Iceberg external paths**
   - [PR #90740](https://github.com/ClickHouse/ClickHouse/pull/90740)
   - Likely impact: strong lakehouse interoperability win.
   - Probability: **high**, mature PR with a clear target use case.

### Likely next-version candidates
Most likely to appear in a near upcoming version based on maturity and practical value:
- [PR #98856](https://github.com/ClickHouse/ClickHouse/pull/98856) Redis-backed query cache
- [PR #99206](https://github.com/ClickHouse/ClickHouse/pull/99206) dedup token bugfix
- [PR #99232](https://github.com/ClickHouse/ClickHouse/pull/99232) executable UDF stderr behavior
- [PR #99281](https://github.com/ClickHouse/ClickHouse/pull/99281) MATERIALIZED + EPHEMERAL mutation fix
- [PR #99282](https://github.com/ClickHouse/ClickHouse/pull/99282) Iceberg query_log fix
- [PR #99133](https://github.com/ClickHouse/ClickHouse/pull/99133) NuRaft segfault fix

## 6) User Feedback Summary

Today’s user feedback highlights a few recurring themes:

### Upgrade safety matters a lot
- The clearest pain point is the **26.2 insert regression**: [Issue #99241](https://github.com/ClickHouse/ClickHouse/issues/99241)
- Users are sensitive not just to crashes, but to **throughput regressions after upgrade**.

### Remote storage and cache behavior remain a major battleground
- Incremental cache warming is not working as users expect when a long query fails: [Issue #98004](https://github.com/ClickHouse/ClickHouse/issues/98004)
- S3 reads may succeed while still producing noisy errors in logs: [Issue #99140](https://github.com/ClickHouse/ClickHouse/issues/99140)

### Advanced schema types still expose sharp edges
- `LowCardinality`, arrays, JSON/Dynamic, and vector indexes all appeared in active discussions:
  - [Issue #98968](https://github.com/ClickHouse/ClickHouse/issues/98968)
  - [Issue #99236](https://github.com/ClickHouse/ClickHouse/issues/99236)
  - [Issue #96647](https://github.com/ClickHouse/ClickHouse/issues/96647)
  - [PR #96504](https://github.com/ClickHouse/ClickHouse/pull/96504)

### Replication correctness under partial outage is still a trust issue
- Offline/dead replica scenarios continue to surface as real-world operational pain:
  - [Issue #44070](https://github.com/ClickHouse/ClickHouse/issues/44070)
  - [Issue #87111](https://github.com/ClickHouse/ClickHouse/issues/87111)

Overall sentiment from the data is that users value ClickHouse’s breadth, but they want **more predictability in upgrades, more efficient remote reads, and fewer cluster-edge-case surprises**.

## 7) Backlog Watch

These are older or strategically important items that still seem to need maintainer attention.

### Long-running important issues
1. **DDL replay failure on offline replica**
   - [Issue #44070](https://github.com/ClickHouse/ClickHouse/issues/44070)
   - Open since **2022-12-09**
   - Why it matters: distributed DDL + replication correctness in degraded clusters.

2. **Replicated PostgreSQL decimal mismatch**
   - [Issue #68032](https://github.com/ClickHouse/ClickHouse/issues/68032)
   - Open since **2024-08-08**
   - Why it matters: cross-database replication and type compatibility remain adoption blockers.

3. **Kafka 4 consumer rebalance protocol support**
   - [Issue #88482](https://github.com/ClickHouse/ClickHouse/issues/88482)
   - Open since **2025-10-13**
   - Why it matters: connector modernization for streaming users.

### Long-running important PRs
4. **Simplified partition mutations**
   - [PR #48941](https://github.com/ClickHouse/ClickHouse/pull/48941)
   - Open since **2023-04-19**
   - Why it matters: mutations are fundamental to MergeTree operability.

5. **Iceberg support for external paths**
   - [PR #90740](https://github.com/ClickHouse/ClickHouse/pull/90740)
   - Open since **2025-11-24**
   - Why it matters: broadens compatibility with real-world lakehouse layouts.

6. **Analyzer optimization with repeat aliases**
   - [PR #88043](https://github.com/ClickHouse/ClickHouse/pull/88043)
   - Open since **2025-10-02**
   - Why it matters: planner performance improvements can have wide user benefit.

## Bottom Line

ClickHouse is showing **very strong development velocity** and healthy maintainer responsiveness, especially on bugfixes and infrastructure hardening. The most important watch item today is the **26.2 insert performance regression**, while the strongest forward-looking themes are **remote storage/lakehouse integration**, **query/cache efficiency**, and **multi-tenant/operational usability**. For operators, the project looks active and well-maintained, but upgrade testing—especially around **insert-heavy workloads, replication behavior, and S3-backed scans**—remains essential.

</details>

<details>
<summary><strong>DuckDB</strong> — <a href="https://github.com/duckdb/duckdb">duckdb/duckdb</a></summary>

# DuckDB Project Digest — 2026-03-12

## 1. Today's Overview

DuckDB showed very high development activity over the last 24 hours, with 64 PRs updated and 16 issues touched, indicating an active stabilization and feature-integration cycle around the 1.5 line. The issue mix is notable: several reports are regressions or correctness/stability problems in 1.5.0, especially around CLI behavior, optimizer behavior, JSON/VARIANT handling, and some crash scenarios. At the same time, the PR stream suggests maintainers are actively addressing low-level storage issues, SQL grammar compatibility, Parquet/metadata execution, and internal engine cleanup. Overall project health looks strong in throughput, but current user-facing signals point to a “fast-moving but bug-fixing-heavy” phase rather than a quiet release-hardening period.

## 2. Project Progress

Merged/closed PRs and issues over the period point to meaningful progress in storage reliability, compatibility, and correctness:

- **Storage crash / memory corruption fixes landed**
  - PR [#21270](https://github.com/duckdb/duckdb/pull/21270) fixed a memory error in transforming to `v1.0.0` ART storage and explicitly references two serious user-reported failures:
    - Issue [#21254](https://github.com/duckdb/duckdb/issues/21254): `INSERT OR IGNORE` crash with `read_parquet()`
    - Issue [#21246](https://github.com/duckdb/duckdb/issues/21246): crash on `CREATE TABLE AS SELECT`
  - This is an important signal that maintainers are treating storage/index transformation bugs as high priority.

- **Storage versioning advanced**
  - PR [#21287](https://github.com/duckdb/duckdb/pull/21287) bumped the storage version to `v1.5.1`.
  - This strongly suggests upcoming patch-level storage compatibility or bugfix packaging work, and may foreshadow a near-term 1.5.1 release.

- **CSV/header detection correctness improved**
  - PR [#21292](https://github.com/duckdb/duckdb/pull/21292) fixed type-count expansion in CSV header detection.
  - This is a small but practical ingestion correctness improvement affecting schema inference workflows.

- **ADBC URI usability improved**
  - PR [#21293](https://github.com/duckdb/duckdb/pull/21293) added support for `duckdb://` URI handling in ADBC options.
  - Although closed, it indicates continued connector/interop polish around client APIs.

- **Optimizer regressions appear to have been addressed in some cases**
  - Issue [#19277](https://github.com/duckdb/duckdb/issues/19277) on missing filter pushdown for expressions that can throw errors was closed.
  - Issue [#20958](https://github.com/duckdb/duckdb/issues/20958) on CTE materialization preventing column pruning, causing major slowdown, was also closed.
  - These closures suggest active optimization work on scan pruning and materialization behavior—core concerns for analytical workloads on wide Parquet datasets.

In short, today’s closed work skewed toward **stability of storage/index internals**, **query planning/performance**, and **connector/usability fixes** rather than large end-user features.

## 3. Community Hot Topics

### 1) Prefix aliases with column names in `FROM`
- PR [#21017](https://github.com/duckdb/duckdb/pull/21017)
- Status: Open, Ready For Review

This is one of the clearest SQL compatibility improvements under discussion: supporting syntax like `FROM r(n): range(1, 3)`. The demand here is about parser flexibility and dialect ergonomics, especially for users coming from systems or tooling that generate alias-heavy SQL. This kind of feature tends to matter more than it first appears because DuckDB is increasingly used as an embedded SQL execution target for generated queries, notebooks, and transpilers.

### 2) Crash on `CREATE TABLE AS SELECT`
- Issue [#21246](https://github.com/duckdb/duckdb/issues/21246)
- 7 comments
- Status: Open, under review

This is among the most serious user-facing reports because it involves intermittent heap corruption (`free(): corrupted unsorted chunks`) during a common ETL pattern. The linked fix path appears to be PR [#21270](https://github.com/duckdb/duckdb/pull/21270), but the issue remains open, suggesting validation or release propagation may still be pending.

### 3) Windows CLI `.utf8` output corruption
- Issue [#21295](https://github.com/duckdb/duckdb/issues/21295)
- 7 comments
- Status: Open, reproduced
- Potential fix: PR [#21319](https://github.com/duckdb/duckdb/pull/21319)

This issue reflects growing CLI use on Windows and highlights a classic encoding boundary problem: UTF-8/UTF-16 conversion in terminal output. The quick appearance of a targeted PR suggests maintainers can likely resolve this soon. The underlying need is reliable cross-platform interactive use, especially as DuckDB’s shell becomes more prominent for local analytics.

### 4) Parquet timestamp metadata compatibility
- PR [#20976](https://github.com/duckdb/duckdb/pull/20976)
- Status: Open, Ready For Review

This PR would make Parquet `isAdjustedToUTC` configurable for timestamps without timezone. That is an interoperability hotspot for users writing files into pre-specified schemas or mixed-engine data lakes. The technical need is not just standards compliance, but **schema contract compatibility** with downstream readers.

### 5) Trigger syntax support
- PR [#21265](https://github.com/duckdb/duckdb/pull/21265)
- Status: Open

This adds parsing support for `CREATE TRIGGER`, though execution is still unsupported. Even as a parser-only first step, it is a meaningful roadmap signal: users want broader transactional/OLTP-adjacent SQL compatibility, or at least enough syntax support for tooling and migrations.

## 4. Bugs & Stability

Ranked by severity and likely user impact:

### Critical / High Severity

1. **Crash on `CREATE TABLE AS SELECT`**
   - Issue: [#21246](https://github.com/duckdb/duckdb/issues/21246)
   - Impact: process crash / heap corruption during a core ETL pattern
   - Status: Open, under review
   - Related fix: [#21270](https://github.com/duckdb/duckdb/pull/21270)
   - Assessment: highest urgency due to memory corruption characteristics.

2. **`INSERT OR IGNORE` crash from `read_parquet()` into keyed table**
   - Issue: [#21254](https://github.com/duckdb/duckdb/issues/21254)
   - Status: Closed
   - Related fix: [#21270](https://github.com/duckdb/duckdb/pull/21270)
   - Assessment: important storage/indexing stability fix now apparently addressed.

3. **Regression in `unnest` with joins causing internal error**
   - Issue: [#21322](https://github.com/duckdb/duckdb/issues/21322)
   - Status: Open, needs triage
   - Impact: query failure with internal cast/type mismatch
   - Assessment: likely a query planner/binder/expression rewrite regression in 1.5; severe for nested/list-heavy analytics.

4. **Internal binder error on column reference**
   - Issue: [#21304](https://github.com/duckdb/duckdb/issues/21304)
   - Status: Open, reproduced
   - Impact: `INTERNAL Error: Failed to bind column reference`
   - Assessment: correctness bug in query binding, likely regression-worthy because it returns an internal engine exception.

### Medium Severity

5. **JSON → VARIANT integer typing breaks Parquet export**
   - Issue: [#21311](https://github.com/duckdb/duckdb/issues/21311)
   - Status: Open, needs triage
   - Impact: normal JSON integers become `UINT64`, then Parquet `VARIANT` export fails
   - Assessment: important for semi-structured data pipelines and lakehouse interchange.

6. **`storage_compatibility_version` with `latest` / `v1.5.0` doesn’t allow VARIANT**
   - Issue: [#21321](https://github.com/duckdb/duckdb/issues/21321)
   - Status: Open, needs triage
   - Impact: feature gating / persistence confusion around VARIANT and compatibility settings
   - Assessment: impacts adoption of new type features and upgrade planning.

7. **RTREE index not used when table includes extra id column**
   - Issue: [#21320](https://github.com/duckdb/duckdb/issues/21320)
   - Status: Open, needs triage
   - Impact: missed index usage in spatial workloads
   - Assessment: performance bug for GIS use cases, especially extension users.

8. **Filter pushdown with scalar macro not working**
   - Issue: [#21312](https://github.com/duckdb/duckdb/issues/21312)
   - Status: Open, needs triage
   - Impact: poor Parquet/hive partition pruning
   - Assessment: important for data-lake query efficiency.

9. **1.5.x regression on `min(...)` after `UNION ALL` over temp view on `read_parquet(...)`**
   - Issue: [#21302](https://github.com/duckdb/duckdb/issues/21302)
   - Status: Open, reproduced
   - Impact: significant slowdown in record linkage/blocking workload shape
   - Assessment: meaningful optimizer regression for generated analytical SQL.

### Lower Severity but User-Visible

10. **Windows CLI `.utf8` mode corrupts duckbox output**
    - Issue: [#21295](https://github.com/duckdb/duckdb/issues/21295)
    - Possible fix: PR [#21319](https://github.com/duckdb/duckdb/pull/21319)
    - Assessment: usability issue, not engine correctness, but highly visible.

11. **`.multiline` dot command errors on startup**
    - Issue: [#21308](https://github.com/duckdb/duckdb/issues/21308)
    - Assessment: CLI regression affecting shell startup configs.

12. **PyGILState_Release error after querying Arrow RecordBatchReader from generator**
    - Issue: [#20715](https://github.com/duckdb/duckdb/issues/20715)
    - Status: Open, reproduced
    - Assessment: Python embedding / lifecycle bug; important for streaming Arrow integration users.

13. **Cannot `SELECT` from JSON column with multiple `WHERE` clauses**
    - Issue: [#20366](https://github.com/duckdb/duckdb/issues/20366)
    - Status: Open, reproduced
    - Assessment: likely expression ordering/casting issue in JSON predicates.

## 5. Feature Requests & Roadmap Signals

Several open PRs and issues reveal likely roadmap directions:

- **Broader SQL dialect and parser compatibility**
  - Prefix alias syntax support: [#21017](https://github.com/duckdb/duckdb/pull/21017)
  - `CREATE TRIGGER` parsing: [#21265](https://github.com/duckdb/duckdb/pull/21265)
  - Prediction: parser-level compatibility features are likely to continue landing incrementally, especially where they unblock migration or generated SQL workloads.

- **Semi-structured data maturity**
  - VARIANT export/type issues: [#21311](https://github.com/duckdb/duckdb/issues/21311), [#21321](https://github.com/duckdb/duckdb/issues/21321)
  - Prediction: expect follow-up work on VARIANT storage/export semantics and compatibility flags in the next patch/minor cycle.

- **Parquet interoperability and metadata execution**
  - Timestamp metadata configurability: [#20976](https://github.com/duckdb/duckdb/pull/20976)
  - Parallel parquet metadata support: [#21314](https://github.com/duckdb/duckdb/pull/21314)
  - Prediction: strong chance these areas see continued investment because Parquet remains central to DuckDB adoption.

- **Internal extensibility / optimizer plumbing**
  - Table function input plan stealing: [#21309](https://github.com/duckdb/duckdb/pull/21309)
  - Dedicated `ProjectionIndex` class: [#21313](https://github.com/duckdb/duckdb/pull/21313)
  - Prediction: these are more architectural than user-visible, but they often precede future optimizer and extension capabilities.

- **Possible near-term patch release**
  - Storage version bump to `v1.5.1`: [#21287](https://github.com/duckdb/duckdb/pull/21287)
  - Prediction: a 1.5.1 patch release looks plausible if current regression and crash fixes stabilize quickly.

## 6. User Feedback Summary

Main user pain points visible today:

- **1.5.0 regressions are being noticed quickly**
  - Multiple reports explicitly cite “as of 1.5” or “1.5.x regression,” including:
    - `unnest` + joins failure: [#21322](https://github.com/duckdb/duckdb/issues/21322)
    - CLI `.multiline` regression: [#21308](https://github.com/duckdb/duckdb/issues/21308)
    - performance regression in temp-view/`UNION ALL` query shape: [#21302](https://github.com/duckdb/duckdb/issues/21302)

- **Wide-table / Parquet performance remains a core workload**
  - Column pruning, filter pushdown, hive partition pruning, and scan efficiency appear repeatedly:
    - [#19277](https://github.com/duckdb/duckdb/issues/19277)
    - [#20958](https://github.com/duckdb/duckdb/issues/20958)
    - [#21312](https://github.com/duckdb/duckdb/issues/21312)
    - [#21302](https://github.com/duckdb/duckdb/issues/21302)
  - This reinforces DuckDB’s role in local/lakehouse analytics rather than purely relational embedded use.

- **Semi-structured data users want fewer edge cases**
  - JSON/VARIANT issues are visible in both query execution and export:
    - [#20366](https://github.com/duckdb/duckdb/issues/20366)
    - [#21311](https://github.com/duckdb/duckdb/issues/21311)
    - [#21321](https://github.com/duckdb/duckdb/issues/21321)

- **CLI polish matters**
  - Windows encoding and shell startup behavior matter because many users are engaging with DuckDB directly, not just through Python/R APIs:
    - [#21295](https://github.com/duckdb/duckdb/issues/21295)
    - [#21308](https://github.com/duckdb/duckdb/issues/21308)

- **Python/Arrow integration remains strategically important**
  - The Arrow RecordBatchReader generator teardown issue:
    - [#20715](https://github.com/duckdb/duckdb/issues/20715)
  - indicates advanced in-memory/streaming use cases are active in the user base.

Overall, users still seem highly engaged and willing to provide repros, especially around performance and correctness. That is a positive ecosystem signal, though today’s feedback leans more toward “please stabilize regressions” than “new features are delighting users.”

## 7. Backlog Watch

Important items that appear to need maintainer attention despite relevance:

- **Arrow/Python lifecycle bug**
  - Issue [#20715](https://github.com/duckdb/duckdb/issues/20715)
  - Reproduced, still open
  - Why it matters: impacts generator-based Arrow streaming, an important memory-safe ingestion/query pattern.

- **JSON predicate correctness issue**
  - Issue [#20366](https://github.com/duckdb/duckdb/issues/20366)
  - Reproduced, still open
  - Why it matters: JSON columns are increasingly common, and predicate-order-dependent behavior suggests a deeper expression/cast bug.

- **Parquet timestamp metadata configurability PR**
  - PR [#20976](https://github.com/duckdb/duckdb/pull/20976)
  - Ready For Review, still open
  - Why it matters: high practical interoperability value with external schema-managed systems.

- **Prefix alias SQL compatibility PR**
  - PR [#21017](https://github.com/duckdb/duckdb/pull/21017)
  - Ready For Review, still open
  - Why it matters: clean SQL ergonomics and compatibility for generated queries.

- **Trigger parsing support**
  - PR [#21265](https://github.com/duckdb/duckdb/pull/21265)
  - Open
  - Why it matters: useful roadmap marker; even parser-only support could benefit compatibility tooling.

## Bottom Line

DuckDB is moving fast, with strong code throughput and active maintainer response, but today’s signal is dominated by **post-1.5.0 regression fixing and hardening**. The most important progress is in **storage crash remediation** and **optimizer/pruning corrections**, while the main risk area is that users are surfacing multiple new correctness and performance regressions in quick succession. If the current fixes are rolled into a patch release soon, the project should remain in good health; a near-term **1.5.1** looks increasingly likely based on the storage-version bump and the nature of recent fixes.

</details>

<details>
<summary><strong>StarRocks</strong> — <a href="https://github.com/StarRocks/StarRocks">StarRocks/StarRocks</a></summary>

# StarRocks Project Digest — 2026-03-12

## 1. Today's Overview

StarRocks remained highly active over the last 24 hours, with **129 PRs updated** and **14 issues updated**, indicating a strong development and backport cadence across maintained branches. The day’s activity was dominated by **bug fixes, backports, documentation maintenance, and query/storage engine improvements**, rather than by a new release. A notable pattern is the project’s continued focus on **query correctness**, **Iceberg integration**, **shared-data/lakehouse stability**, and **operational robustness under concurrency**. Overall, project health looks solid: maintainers are closing user-reported bugs quickly, while also pushing forward medium-term engine work in compaction, metadata cleanup, and SQL compatibility.

---

## 3. Project Progress

### Query engine and SQL-layer progress
Several merged or actively backported fixes point to continued hardening of the optimizer and execution layer:

- **SplitTopNRule fix for partition-pruned plans** was merged and immediately backported, resolving the bug behind an `"Invalid plan"` error on AGGREGATE KEY tables with `ORDER BY + LIMIT`.  
  - Merged fix: [PR #70154](https://github.com/StarRocks/starrocks/pull/70154)  
  - Backports/open follow-ups: [PR #70168](https://github.com/StarRocks/starrocks/pull/70168), [PR #70169](https://github.com/StarRocks/starrocks/pull/70169)  
  - Related closed issue: [Issue #69364](https://github.com/StarRocks/starrocks/issues/69364)

- **Partition predicate pruning correctness** is being improved for range partitions where boundary comparisons involve mismatched types, especially expressions like `str2date(...)`. This is a meaningful optimizer correctness fix for time-based partitioned tables.  
  - Open: [PR #70097](https://github.com/StarRocks/starrocks/pull/70097)

- **MV transparent rewrite correctness for Iceberg** is under active repair: StarRocks is addressing stale results when base-table partitions have been dropped but the MV rewrite still uses outdated assumptions. This is important for lakehouse query correctness.  
  - Open: [PR #70130](https://github.com/StarRocks/starrocks/pull/70130)

### Storage engine and compaction progress
Storage-side work today suggests investment in both performance and scalability:

- **Range-split parallel compaction for non-overlapping output** is under proto-review. This design shifts parallel compaction from segment-index-based splitting to **sort-key-range splitting**, which should improve compaction parallelism while preserving non-overlap guarantees in output rowsets.  
  - Open: [PR #70162](https://github.com/StarRocks/starrocks/pull/70162)

- A broader **transaction/edit-log architecture refactor toward WAL format** was closed today, indicating continued backend evolution in persistence/logging internals.  
  - Closed: [PR #69911](https://github.com/StarRocks/starrocks/pull/69911)

- Tooling around **shared-data inspection** also advanced, showing attention to operability in cloud/shared-storage deployments.  
  - Closed: [PR #70129](https://github.com/StarRocks/starrocks/pull/70129)

### Metadata lifecycle and concurrency robustness
One of the most practically important in-flight fixes is around FE memory usage:

- **Per-query connector metadata cleanup after planning** is being backported to prevent FE OOM under concurrent query workloads. This is especially relevant for Iceberg and other external connectors with per-query caches.  
  - Open backport: [PR #70166](https://github.com/StarRocks/starrocks/pull/70166)

### Testing and maintenance
- Shared-data testing infrastructure was improved via **mock journal support** for mock clusters, while preserving a BDB-backed test path.  
  - Open backports: [PR #70159](https://github.com/StarRocks/starrocks/pull/70159), [PR #70160](https://github.com/StarRocks/starrocks/pull/70160)

- Documentation CI maintenance was cleaned up through **Lychee link-check fixes**, with multiple backports merged the same day.  
  - Main PR: [PR #70027](https://github.com/StarRocks/starrocks/pull/70027)  
  - Backports: [PR #70171](https://github.com/StarRocks/starrocks/pull/70171), [PR #70172](https://github.com/StarRocks/starrocks/pull/70172), [PR #70173](https://github.com/StarRocks/starrocks/pull/70173)

---

## 4. Community Hot Topics

### 1) ClickHouse interoperability as a query engine
- [Issue #53950](https://github.com/StarRocks/starrocks/issues/53950) — **Support Query ClickHouse AggregatingMergeTree Engine Table**
- Labels: enhancement, good first issue
- Comments: 4

This is the most commented open issue in the provided set and highlights a recurring market need: StarRocks is increasingly being used as a **unified query layer** over external systems. The specific pain point is querying ClickHouse materialized/aggregated table semantics correctly, especially around `AggregatingMergeTree`. The technical need underneath is stronger **cross-engine semantic compatibility**, not just raw connector support.

### 2) SQL ergonomics: `GROUP BY ALL`
- [Issue #69953](https://github.com/StarRocks/starrocks/issues/69953) — **Support GROUP BY ALL syntax to simplify queries**
- Reactions: 👍 3

This request has the strongest visible positive reaction in the issue set. It signals user demand for **SQL dialect compatibility and analyst ergonomics**, especially for workloads migrated from other warehouses or BI-oriented SQL environments. This kind of syntax support often has outsized adoption value because it reduces query maintenance burden and friction in iterative analytics.

### 3) Iceberg feature depth
- [Issue #69692](https://github.com/StarRocks/starrocks/issues/69692) — **Add `$properties` Iceberg metadata table**
- [Issue #69847](https://github.com/StarRocks/starrocks/issues/69847) — **Support row lineage feature in Iceberg v3**
- [PR #69525](https://github.com/StarRocks/starrocks/pull/69525) — **Support Iceberg v3 default value feature**

The cluster of Iceberg-related work is one of the clearest roadmap signals. Users want StarRocks to be not just an external query engine for Iceberg tables, but a **first-class Iceberg-aware analytics engine** with metadata introspection, schema evolution support, lineage visibility, and correctness in MV rewrite.

### 4) Shared-data and object storage behavior
- [Issue #70024](https://github.com/StarRocks/starrocks/issues/70024) — **S3 VIP always connects to same backend IP**
- [Issue #68783](https://github.com/StarRocks/starrocks/issues/68783) — **Remove object storage LIST during random-bucket load** (closed)

These items show users care deeply about the economics and operational behavior of **object-store-backed deployments**. The underlying need is reduced pressure on object stores, better endpoint load distribution, and lower latency/cost in shared-data mode.

---

## 5. Bugs & Stability

Ranked by likely severity and end-user impact:

### Critical / High

1. **Wrong query result: missing rows**
   - [Issue #70145](https://github.com/StarRocks/starrocks/issues/70145)
   - Status: Open
   - Severity: **High**
   
   Query correctness bugs are the most serious class in analytical databases. This report describes a simple query returning missing rows, which may indicate planner, scan, or predicate pushdown issues. No linked fix PR is visible yet in the provided data, so this needs prompt triage.

2. **MV rewrite may return stale data after dropped Iceberg partitions**
   - [PR #70130](https://github.com/StarRocks/starrocks/pull/70130)
   - Status: Open
   - Severity: **High**
   
   This is a correctness bug in transparent rewrite logic. If confirmed, users relying on MVs over Iceberg could receive outdated results after partition deletions. A fix is already in progress, which is a positive sign.

3. **Partition predicates pruned unexpectedly due to type-boundary mismatch**
   - [PR #70097](https://github.com/StarRocks/starrocks/pull/70097)
   - Status: Open
   - Severity: **High**
   
   Incorrect partition pruning can either miss data or produce wrong results. The mention of `str2date(...)` and reserved partitions suggests subtle optimizer boundary logic issues in time-based partitioning.

### Medium

4. **Use-after-free of ExprContext when node init fails**
   - [PR #70164](https://github.com/StarRocks/starrocks/pull/70164)
   - Status: Open
   - Severity: **Medium-High**
   
   This is a native-engine memory-safety bug. It appears to happen on plan-node initialization failure paths. While likely less common than correctness bugs, such lifetime issues can lead to crashes or undefined behavior and deserve careful review.

5. **FE OOM due to delayed connector metadata cleanup**
   - [PR #70166](https://github.com/StarRocks/starrocks/pull/70166)
   - Status: Open
   - Severity: **Medium-High**
   
   This is a stability and scalability issue affecting concurrent query execution, especially with external connectors like Iceberg. The fact that it is being backported suggests maintainers view it as production-relevant.

6. **S3 VIP traffic pinned to a single backend IP**
   - [Issue #70024](https://github.com/StarRocks/starrocks/issues/70024)
   - Status: Open
   - Severity: **Medium**
   
   This is an availability/performance imbalance issue rather than a correctness defect, but for large shared-data clusters it can create hotspots and degrade object-store behavior.

7. **Week granularity in time-based range partitioning is undocumented or fails silently**
   - [Issue #70082](https://github.com/StarRocks/starrocks/issues/70082)
   - Status: Open
   - Severity: **Medium**
   
   The report suggests a possible documentation/behavior mismatch. Silent acceptance of unsupported syntax is dangerous because it can create latent partitioning bugs.

### Recently resolved

8. **Invalid plan on AGGREGATE KEY + ORDER BY + LIMIT**
   - [Issue #69364](https://github.com/StarRocks/starrocks/issues/69364)
   - Fixed by: [PR #70154](https://github.com/StarRocks/starrocks/pull/70154)
   - Status: Closed

9. **Java UDTF/UDAF crashes with generic method parameters**
   - [Issue #69195](https://github.com/StarRocks/starrocks/issues/69195)
   - Status: Closed

10. **`str_to_date` loses microsecond precision during Routine Load**
    - [Issue #70056](https://github.com/StarRocks/starrocks/issues/70056)
    - Status: Closed

11. **`UNION ALL` on STRUCT matched fields by position instead of name**
    - [Issue #67031](https://github.com/StarRocks/starrocks/issues/67031)
    - Status: Closed
   
    This was an important SQL correctness issue for semi-structured data users; its closure improves confidence in complex type semantics.

---

## 6. Feature Requests & Roadmap Signals

### Strongest roadmap signals

1. **Deeper Iceberg v3 support**
   - [Issue #69692](https://github.com/StarRocks/starrocks/issues/69692) — `$properties` metadata table
   - [Issue #69847](https://github.com/StarRocks/starrocks/issues/69847) — row lineage in Iceberg v3
   - [PR #69525](https://github.com/StarRocks/starrocks/pull/69525) — default value support

This is the clearest multi-item feature theme. Expect future releases, likely **4.2+**, to keep expanding Iceberg metadata, schema evolution, and governance features.

2. **SQL dialect compatibility and usability**
   - [Issue #69953](https://github.com/StarRocks/starrocks/issues/69953) — `GROUP BY ALL`

This is a relatively scoped feature with clear user value and low conceptual risk. It looks like a plausible candidate for inclusion in a near-term minor version if parser/planner complexity is acceptable.

3. **Cross-engine federation improvements**
   - [Issue #53950](https://github.com/StarRocks/starrocks/issues/53950) — ClickHouse `AggregatingMergeTree` support

This signals strategic demand for StarRocks as a **federated analytical query layer**, but implementation complexity may be higher because it requires semantic mapping to ClickHouse aggregation storage behavior.

4. **Build/toolchain portability**
   - [Issue #69612](https://github.com/StarRocks/starrocks/issues/69612) — PIC for tenann dependencies on branch-3.4.5

This is narrower than user-facing SQL features, but relevant for integrators, downstream packagers, and hardened deployment environments.

5. **Python/SQLAlchemy ecosystem support**
   - [Issue #69264](https://github.com/StarRocks/starrocks/issues/69264) — alembic `NotImplementedError`

This reflects ecosystem maturity needs: teams increasingly expect StarRocks support in migration/tooling stacks, not just in JDBC/BI connections.

### Likely next-version candidates
Most plausible near-term candidates based on branch labels and active implementation signals:

- Iceberg metadata/default-value related work: [PR #69525](https://github.com/StarRocks/starrocks/pull/69525), [Issue #69692](https://github.com/StarRocks/starrocks/issues/69692)
- Query correctness and pruning fixes already being backported: [PR #70097](https://github.com/StarRocks/starrocks/pull/70097), [PR #70130](https://github.com/StarRocks/starrocks/pull/70130)
- `GROUP BY ALL`: [Issue #69953](https://github.com/StarRocks/starrocks/issues/69953)

---

## 7. User Feedback Summary

### Main pain points users are reporting

- **Query correctness remains the top concern**
  - Missing rows: [Issue #70145](https://github.com/StarRocks/starrocks/issues/70145)
  - Invalid plans in optimizer edge cases: [Issue #69364](https://github.com/StarRocks/starrocks/issues/69364)
  - STRUCT union field alignment correctness: [Issue #67031](https://github.com/StarRocks/starrocks/issues/67031)

Users are clearly sensitive to correctness regressions in optimizer and type-handling logic, especially around complex SQL or partitioned datasets.

- **Lakehouse integration depth matters**
  - Iceberg defaults: [PR #69525](https://github.com/StarRocks/starrocks/pull/69525)
  - Iceberg properties table: [Issue #69692](https://github.com/StarRocks/starrocks/issues/69692)
  - Iceberg lineage: [Issue #69847](https://github.com/StarRocks/starrocks/issues/69847)
  - MV rewrite correctness over Iceberg: [PR #70130](https://github.com/StarRocks/starrocks/pull/70130)

This suggests users are running StarRocks in real lakehouse production scenarios, not just as an internal OLAP store.

- **Operational behavior in cloud/shared-data mode is a recurring theme**
  - S3 VIP connection imbalance: [Issue #70024](https://github.com/StarRocks/starrocks/issues/70024)
  - Avoiding expensive object-store LISTs: [Issue #68783](https://github.com/StarRocks/starrocks/issues/68783)

Users care not only about query speed, but also about **object storage cost efficiency and backend load distribution**.

- **Compatibility with external engines and tooling is increasingly important**
  - ClickHouse `AggregatingMergeTree`: [Issue #53950](https://github.com/StarRocks/starrocks/issues/53950)
  - Python Alembic support gap: [Issue #69264](https://github.com/StarRocks/starrocks/issues/69264)
  - Java generic UDTF/UDAF crash: [Issue #69195](https://github.com/StarRocks/starrocks/issues/69195)

This reflects broader adoption outside pure SQL-console usage: users want StarRocks to fit into modern multi-engine, application, and DevOps ecosystems.

### Satisfaction signals
The best implicit satisfaction signal today is responsiveness: several significant bugs were closed quickly or had immediate backports prepared, especially:
- [Issue #69364](https://github.com/StarRocks/starrocks/issues/69364) → [PR #70154](https://github.com/StarRocks/starrocks/pull/70154)
- [Issue #70056](https://github.com/StarRocks/starrocks/issues/70056)
- [Issue #69195](https://github.com/StarRocks/starrocks/issues/69195)

---

## 8. Backlog Watch

These items appear important and still need maintainer attention, either because they are older, cross-cutting, or strategically significant:

1. **ClickHouse `AggregatingMergeTree` query support**
   - [Issue #53950](https://github.com/StarRocks/starrocks/issues/53950)
   - Open since 2024-12-15
   
   This is old enough to be backlog-significant and strategically relevant for federation use cases.

2. **Dynamic partition creation deduplication**
   - [PR #67793](https://github.com/StarRocks/starrocks/pull/67793)
   - Open since 2026-01-12
   
   This addresses FE contention and duplicate partition-creation requests under dynamic overwrite. It looks operationally important for high-parallel ingestion paths and deserves review progress.

3. **Iceberg v3 default values**
   - [PR #69525](https://github.com/StarRocks/starrocks/pull/69525)
   - Open since 2026-02-26
   
   Given the project’s lakehouse direction, this is an important capability gap to close.

4. **Python Alembic integration bug**
   - [Issue #69264](https://github.com/StarRocks/starrocks/issues/69264)
   - Open since 2026-02-13
   
   Not core-engine critical, but important for developer adoption and ecosystem credibility.

5. **tenann PIC/build portability issue on 3.4.5**
   - [Issue #69612](https://github.com/StarRocks/starrocks/issues/69612)
   - Open since 2026-02-28
   
   This matters for downstream build hardening and may affect enterprise packaging scenarios.

6. **S3 VIP single-IP behavior**
   - [Issue #70024](https://github.com/StarRocks/starrocks/issues/70024)
   - Open since 2026-03-09
   
   Recent but potentially impactful in production shared-data clusters; should be triaged quickly if reproducible.

---

## Overall Assessment

StarRocks shows **strong engineering velocity and healthy maintenance discipline**. The current work mix indicates a mature project balancing:
- **short-term stability fixes**,
- **multi-branch backports**,
- **lakehouse feature expansion**,
- **query optimizer correctness**, and
- **shared-data/cloud operational improvements**.

The main risk area remains what users most visibly report: **correctness issues in edge-case planning, partition pruning, and MV rewrite logic**. The positive counter-signal is that these issues are being addressed quickly and, in multiple cases, backported across release lines.

</details>

<details>
<summary><strong>Apache Iceberg</strong> — <a href="https://github.com/apache/iceberg">apache/iceberg</a></summary>

# Apache Iceberg Project Digest — 2026-03-12

## 1. Today's Overview

Apache Iceberg showed **high development activity** over the last 24 hours, with **43 PRs updated** and **10 issues updated**, but **no new releases**. Most activity is concentrated in **Spark, core metadata/manifest evolution, Flink SQL/variant support, and storage I/O behavior across S3/GCS/Hadoop cloud backends**. The project appears healthy in terms of contributor throughput, though the issue stream highlights ongoing **operational stability pain points** in long-running streaming and cloud-object-storage deployments. Overall, today’s signal is one of **active feature development with persistent attention needed on storage-layer reliability and connector correctness**.

---

## 3. Project Progress

### Merged/closed PRs today

Even without a release, several closed PRs indicate where maintainers are accepting or rejecting direction.

- **[PR #15580](https://github.com/apache/iceberg/pull/15580)** — *feat: Add iceberg-lance module with Lance columnar format support* — **Closed**
  - Proposed a new `iceberg-lance` module to support the Lance format for ML/AI-oriented columnar workloads.
  - Although closed rather than merged, this is a notable roadmap signal: the community is exploring **new file/columnar format integrations** beyond traditional Parquet/Avro/ORC.
  - Its closure suggests maintainers are currently cautious about broadening format scope without stronger architectural alignment.

- **[PR #15206](https://github.com/apache/iceberg/pull/15206)** — *Kafka Connect: add start/end offsets per source partition in snapshot properties* — **Closed**
  - Would have improved **snapshot lineage and traceability** for Kafka Connect ingestion.
  - Even though it closed, it highlights demand for **auditable ingestion metadata**, especially in streaming pipelines.

- **[PR #15205](https://github.com/apache/iceberg/pull/15205)** — *Kafka Connect: avoid always adding evolved columns as optional* — **Closed**
  - Addressed schema-evolution correctness in Kafka Connect.
  - Closure means the specific implementation did not land, but the underlying concern remains highly relevant for **schema fidelity** across connector-based ingestion.

### Important open PRs that represent current forward progress

- **[PR #15590](https://github.com/apache/iceberg/pull/15590)** — *Core: Auto-flush accumulated data files to manifests in MergingSnapshotProducer*
  - A meaningful **storage/metadata scalability optimization**.
  - Targets bulk commits involving **hundreds of thousands of data files**, reducing peak memory and commit latency by spreading manifest writes over time.
  - This is one of the strongest signals today for core engine scalability work.

- **[PR #15049](https://github.com/apache/iceberg/pull/15049)** — *API, Core: Introduce foundational types for V4 manifest support*
- **[PR #14533](https://github.com/apache/iceberg/pull/14533)** — *[WIP] V4 Manifest Read Support*
  - Together these show sustained investment in **next-generation metadata structures**, likely tied to the adaptive metadata tree / single-file commit direction.
  - This is strategically important for scaling metadata operations and commit efficiency.

- **[PR #15299](https://github.com/apache/iceberg/pull/15299)** — *Spark 4.1: New Async Spark Micro Batch Planner*
  - Advances **Spark structured streaming planning performance**.
  - Suggests ongoing work to improve **micro-batch latency and planner parallelism** for Spark 4.1 users.

- **[PR #15061](https://github.com/apache/iceberg/pull/15061)** and **[PR #15588](https://github.com/apache/iceberg/pull/15588)**
  - Both address a Spark inconsistency where **DELETE operations fail to inherit custom snapshot properties** the same way INSERT/UPDATE do.
  - This is a **SQL semantics / operational metadata consistency** improvement.

- **[PR #15471](https://github.com/apache/iceberg/pull/15471)** — *Flink SQL: Add variant avro dynamic record generator*
- **[PR #15283](https://github.com/apache/iceberg/pull/15283)** — *Kafka Connect: Support VARIANT when record convert*
- **[PR #14297](https://github.com/apache/iceberg/pull/14297)** — *Spark: Support writing shredded variant in Iceberg-Spark*
  - Cross-engine momentum is building around **VARIANT / semi-structured data support**.
  - This is one of the clearest multi-engine feature themes in the current backlog.

---

## 4. Community Hot Topics

### 1) Cloud storage connection management and I/O scaling
- **[Issue #15411](https://github.com/apache/iceberg/issues/15411)** — *GCSFileIO connection pooling / exploding TCP connections*
- **[Issue #15587](https://github.com/apache/iceberg/issues/15587)** — *Configure GCS connection and read timeouts*
- **[Issue #13863](https://github.com/apache/iceberg/issues/13863)** — *Connection pool shut down for S3FileIO*
- **[Issue #15353](https://github.com/apache/iceberg/issues/15353)** — *Improve HadoopFileIO performance with cloud storage*
- **[PR #15122](https://github.com/apache/iceberg/pull/15122)** — *AWS: support custom S3 MetricPublisher*

**Analysis:**  
A major operational theme is **object-store client behavior under production load**. Users are reporting excessive TCP connection creation on GCS, pool shutdowns on S3, and missed optimization opportunities in HadoopFileIO against cloud stores. This points to a deeper technical need for:
- better **connection lifecycle management**
- more configurable **timeouts/retries/metrics**
- less reliance on older filesystem APIs that incur extra metadata requests

This is one of the strongest real-world reliability themes in today’s data.

### 2) Metadata scale and manifest architecture
- **[PR #15590](https://github.com/apache/iceberg/pull/15590)** — auto-flush data files to manifests
- **[PR #15049](https://github.com/apache/iceberg/pull/15049)** — foundational V4 manifest types
- **[PR #14533](https://github.com/apache/iceberg/pull/14533)** — V4 manifest read support
- **[Issue #8450](https://github.com/apache/iceberg/issues/8450)** — partition stats task tracker, **closed**, 👍 7

**Analysis:**  
The technical need here is clear: Iceberg is being pushed into **larger table counts, larger commit sizes, and richer metadata planning/statistics workloads**. The closure of the partition stats tracker suggests some work has been completed in that area, while the open V4 manifest work shows maintainers are still evolving the metadata substrate for the next scaling tier.

### 3) Multi-engine support for VARIANT and semi-structured data
- **[PR #14297](https://github.com/apache/iceberg/pull/14297)** — Spark shredded variant writes
- **[PR #15471](https://github.com/apache/iceberg/pull/15471)** — Flink variant Avro dynamic record generation
- **[PR #15283](https://github.com/apache/iceberg/pull/15283)** — Kafka Connect VARIANT support

**Analysis:**  
There is growing demand to treat Iceberg as a home for **semi-structured, nested, and polymorphic data**, not only strongly typed warehouse schemas. The consistent appearance of VARIANT-related work across Spark, Flink, and Kafka Connect suggests this is becoming a cross-project design priority.

### 4) Most commented / reacted issues
- **[Issue #13593](https://github.com/apache/iceberg/issues/13593)** — *Metadata stops being written after random period of time*  
  Comments: 29, 👍 3
- **[Issue #13973](https://github.com/apache/iceberg/issues/13973)** — *Data scanning issue after AppendFiles + PartitionedFanoutWriter*  
  Comments: 5, 👍 1
- **[Issue #13928](https://github.com/apache/iceberg/issues/13928)** — *Flink rewrite files action with z-order sort support*  
  Comments: 4, 👍 1
- **[Issue #8450](https://github.com/apache/iceberg/issues/8450)** — *Partition stats task tracker*  
  👍 7

These items show the community is most engaged around **metadata durability, scan correctness, compaction/sort optimization, and statistics infrastructure**.

---

## 5. Bugs & Stability

Ranked by likely severity based on operational impact:

### High severity

1. **[Issue #13593](https://github.com/apache/iceberg/issues/13593)** — *Metadata stops being written after random period of time; commit retries fail*
   - Affects **Athena + AWS MSK Iceberg Connector** with Iceberg 1.9.1.
   - This looks like a **production-ingestion reliability issue** where metadata commits stop progressing.
   - Severity is high because it threatens **data freshness and write continuity**.
   - No directly linked fix PR appears in today’s PR list.

2. **[Issue #15584](https://github.com/apache/iceberg/issues/15584)** — *Kafka Connect multi-topic → multi-table routing writes all records to all tables when schemas are identical*
   - A serious **data correctness / routing isolation** bug.
   - If confirmed, this can cause **cross-table contamination**, one of the most severe ingestion failure modes.
   - Newly opened and should get prompt maintainer attention.
   - No fix PR visible today.

3. **[Issue #13863](https://github.com/apache/iceberg/issues/13863)** — *Connection pool shut down for S3FileIO*
   - Reported in **PySpark structured streaming** reading from S3.
   - High severity because it causes **eventual job crashes** in long-running streaming applications.
   - Potentially related to broader storage-client lifecycle issues discussed elsewhere today.

### Medium severity

4. **[Issue #13973](https://github.com/apache/iceberg/issues/13973)** — *Scan failures after AppendFiles + PartitionedFanoutWriter*
   - Impacts **table readability after write path usage**.
   - Suggests either a writer contract issue or metadata/data-file mismatch.
   - Severity is medium-to-high because it affects **query correctness and recoverability**.

5. **[Issue #15411](https://github.com/apache/iceberg/issues/15411)** — *GCSFileIO creates massive numbers of TCP connections*
   - More of a **performance/stability under load** problem than immediate correctness failure.
   - Still important for cloud production environments due to infrastructure impact and possible throttling.

6. **[Issue #15587](https://github.com/apache/iceberg/issues/15587)** — *Need configurable GCS connection/read timeouts*
   - Operationally important but currently framed as a **configurability gap** rather than confirmed defect.

### Lower severity / resolved today

7. **[Issue #13919](https://github.com/apache/iceberg/issues/13919)** — *ExposeLocality parameter in Flink* — **Closed**
   - More of a documentation/behavior clarification than a severe bug.

8. **[Issue #8450](https://github.com/apache/iceberg/issues/8450)** — *Partition stats task tracker* — **Closed**
   - Improvement tracker closed, indicating some progress on metadata stats infrastructure.

---

## 6. Feature Requests & Roadmap Signals

### Strong roadmap signals

1. **Next-gen metadata / V4 manifests**
   - **[PR #15049](https://github.com/apache/iceberg/pull/15049)**
   - **[PR #14533](https://github.com/apache/iceberg/pull/14533)**
   - These are strong indicators of future releases focusing on **metadata scalability, adaptive manifest structures, and commit-path evolution**.

2. **Manifest/memory scalability for large commits**
   - **[PR #15590](https://github.com/apache/iceberg/pull/15590)**
   - This has a good chance of landing in a near-term version because it is practical, bounded, and addresses a clear production pain point.

3. **VARIANT support across engines**
   - **[PR #14297](https://github.com/apache/iceberg/pull/14297)**
   - **[PR #15471](https://github.com/apache/iceberg/pull/15471)**
   - **[PR #15283](https://github.com/apache/iceberg/pull/15283)**
   - Likely to be phased in incrementally, engine by engine.

4. **Spark snapshot metadata consistency**
   - **[PR #15061](https://github.com/apache/iceberg/pull/15061)**
   - **[PR #15588](https://github.com/apache/iceberg/pull/15588)**
   - These are relatively targeted fixes and therefore plausible candidates for the next release train.

5. **Cloud FileIO modernization**
   - **[Issue #15353](https://github.com/apache/iceberg/issues/15353)**
   - **[Issue #15587](https://github.com/apache/iceberg/issues/15587)**
   - **[PR #15122](https://github.com/apache/iceberg/pull/15122)**
   - This looks likely to continue as an area of investment because it reflects multiple user reports across AWS and GCP.

### User-requested features of note

- **[Issue #13928](https://github.com/apache/iceberg/issues/13928)** — Flink rewrite action with **z-order / sort order** support
  - A clear request for **data layout optimization parity** with Spark.
  - Good candidate for future backlog grooming, though probably not immediate unless a design owner emerges.

- **[PR #15450](https://github.com/apache/iceberg/pull/15450)** — OpenAPI: promote S3 signing endpoint to main REST spec
  - Important roadmap signal for **REST catalog standardization** and cloud-provider-neutral remote signing patterns.

- **[PR #15561](https://github.com/apache/iceberg/pull/15561)** — Add `FileIO` to Scan API
  - A notable API evolution that could unlock more flexible scan implementations and integrations.

### Prediction: likely next-version inclusions
Most likely near-term candidates based on maturity and scope:
- Spark custom snapshot property fixes for DELETE
- core manifest auto-flush optimization
- some cloud FileIO improvements or configuration additions
- incremental VARIANT support, especially where implementation is already deep in progress

---

## 7. User Feedback Summary

Today’s user feedback is dominated by **production operations**, not introductory usage.

### Main pain points
- **Long-running streaming instability**
  - S3 connection pools shutting down in Spark streaming:
    - [Issue #13863](https://github.com/apache/iceberg/issues/13863)
  - metadata commits stalling in MSK/Athena-connected workflows:
    - [Issue #13593](https://github.com/apache/iceberg/issues/13593)

- **Cloud object storage inefficiency**
  - GCS connection explosion:
    - [Issue #15411](https://github.com/apache/iceberg/issues/15411)
  - missing timeout tuning on GCS:
    - [Issue #15587](https://github.com/apache/iceberg/issues/15587)
  - desire for better Hadoop cloud storage behavior:
    - [Issue #15353](https://github.com/apache/iceberg/issues/15353)

- **Connector correctness**
  - Kafka Connect routing bug causing writes to wrong tables:
    - [Issue #15584](https://github.com/apache/iceberg/issues/15584)
  - Kafka Connect schema evolution and offset metadata proposals were active but closed:
    - [PR #15205](https://github.com/apache/iceberg/pull/15205)
    - [PR #15206](https://github.com/apache/iceberg/pull/15206)

- **Cross-engine feature parity**
  - Flink users want compaction/sort-order capabilities closer to Spark:
    - [Issue #13928](https://github.com/apache/iceberg/issues/13928)

### Satisfaction signals
There are fewer explicit positive sentiment markers today, but:
- **[Issue #8450](https://github.com/apache/iceberg/issues/8450)** receiving 👍 7 and now closing indicates support for richer statistics/metadata planning work.
- The volume of advanced PRs across Spark/Flink/Kafka Connect suggests contributors see Iceberg as a strategic platform worth extending rather than a stagnant project.

---

## 8. Backlog Watch

These items appear important and in need of maintainer attention due to age, severity, or strategic value.

### Aging issues with ongoing relevance

- **[Issue #13593](https://github.com/apache/iceberg/issues/13593)** — metadata writes stop after random period  
  Created 2025-07-18, 29 comments  
  - Old, active, and operationally severe.
  - Needs definitive triage or root-cause direction.

- **[Issue #13973](https://github.com/apache/iceberg/issues/13973)** — scan issue after AppendFiles + PartitionedFanoutWriter  
  Created 2025-09-02  
  - Potential correctness issue in low-level write APIs.
  - Worth clarifying whether misuse, unsupported path, or engine defect.

- **[Issue #13928](https://github.com/apache/iceberg/issues/13928)** — Flink z-order rewrite support  
  Created 2025-08-27  
  - Not urgent from a stability standpoint, but important for **Flink feature parity**.

- **[Issue #13863](https://github.com/apache/iceberg/issues/13863)** — S3FileIO connection pool shut down  
  Created 2025-08-19  
  - Long-lived and still active, with direct production-crash implications.

### Strategic PRs needing review bandwidth

- **[PR #14533](https://github.com/apache/iceberg/pull/14533)** — V4 Manifest Read Support  
  - WIP but strategically central; likely complex and review-heavy.

- **[PR #15049](https://github.com/apache/iceberg/pull/15049)** — foundational V4 manifest types  
  - Important precursor work; deserves coordinated review because many future changes may depend on it.

- **[PR #14297](https://github.com/apache/iceberg/pull/14297)** — Spark shredded variant write support  
  - Important for semi-structured roadmap, but likely blocked on broader design questions.

- **[PR #15299](https://github.com/apache/iceberg/pull/15299)** — async Spark micro-batch planner  
  - Significant engine behavior change with performance upside; likely needs careful validation.

- **[PR #15450](https://github.com/apache/iceberg/pull/15450)** — OpenAPI S3 signing endpoint promotion  
  - High strategic importance for REST catalog ecosystem compatibility.

---

## Overall Health Assessment

Apache Iceberg remains **highly active and strategically evolving**, especially in **Spark integration, metadata architecture, and semi-structured data support**. However, today’s issue set shows that **storage I/O robustness and connector correctness** are the clearest operational risks, particularly for **streaming and cloud-native deployments**. The absence of releases suggests maintainers are in a period of **integration and review rather than packaging**, with several foundational PRs that could shape upcoming versions.

If you'd like, I can also turn this into a **shorter exec summary**, a **maintainer-style changelog**, or a **table format by engine (Spark/Flink/Kafka Connect/Core/REST)**.

</details>

<details>
<summary><strong>Delta Lake</strong> — <a href="https://github.com/delta-io/delta">delta-io/delta</a></summary>

# Delta Lake Project Digest — 2026-03-12

## 1) Today's Overview

Delta Lake was active over the last 24 hours, with **33 pull requests updated** and **1 issue updated**, indicating a **developer-driven day focused more on implementation than on inbound bug reports**. The workstream is concentrated in three areas: **Spark/DSv2 integration**, **Delta Kernel feature parity and type handling**, and **Unity Catalog (UC) managed-table semantics**. There were **no new releases**, but the opening of **`4.2.0-SNAPSHOT`** suggests the project is moving into the next development cycle. Overall, project health looks **good and forward-moving**, with multiple stacked PR series showing coordinated feature development rather than ad hoc patching.

## 3) Project Progress

### Merged/closed PRs today

Several PRs were closed today, and while not all are confirmed merged from the provided data, they show where engineering effort is landing.

- **Add UC staged replace handoff support** — PR [#6251](https://github.com/delta-io/delta/pull/6251)  
  This points to continued work on **atomic replace/create table flows** and tighter **Unity Catalog handoff behavior**. It is a roadmap signal for more robust transactional DDL semantics in managed catalog environments.

- **[Spark] Send table schema to UC server when creating managed tables** — PR [#6204](https://github.com/delta-io/delta/pull/6204)  
  This improves correctness for **UC-managed table creation**, ensuring schema metadata is synchronized with the control plane. That reduces the risk of local-success/remote-inconsistency behavior in managed deployments.

- **[kernel-spark] Support excludeRegex readOption in DSV2** — PR [#6088](https://github.com/delta-io/delta/pull/6088)  
  Closed after recent activity, this is part of a larger trend toward **DSv2 read-option parity** in kernel-spark. It suggests the read path is becoming more configurable and closer to Spark-native expectations.

- **[kernel-spark] [Spark] Add StringStartsWith filter pushdown to ExpressionUtils** — PR [#6104](https://github.com/delta-io/delta/pull/6104)  
  This advances **predicate pushdown/filter translation**, which is directly relevant to scan pruning and query efficiency. It also reflects continued work on **SQL/filter compatibility** between Spark and Delta’s lower-level execution layers.

- **[Spark] Improve Error Handling for NullType in UDTs** — PR [#6254](https://github.com/delta-io/delta/pull/6254)  
  This is a correctness and stability hardening change. Blocking writes with `NullType` inside UDT columns aligns behavior with existing restrictions in arrays/maps and prevents ambiguous or invalid schema persistence.

- **[WIP] Add required java version into README.md** — PR [#6211](https://github.com/delta-io/delta/pull/6211)  
  While minor, this reflects ongoing attention to **developer onboarding and environment clarity**, often necessary as a project grows across Spark, Kernel, and UC-related modules.

### Active engineering themes

From the open PR set, Delta Lake is clearly investing in:

- **DataSource V2 / kernel-spark scan capabilities**
  - PR [#6203](https://github.com/delta-io/delta/pull/6203): populate catalog stats in DSv2 scan
  - PR [#6224](https://github.com/delta-io/delta/pull/6224): report output partitioning in DSv2 scan
  - PRs [#6245](https://github.com/delta-io/delta/pull/6245), [#6246](https://github.com/delta-io/delta/pull/6246), [#6249](https://github.com/delta-io/delta/pull/6249), [#6250](https://github.com/delta-io/delta/pull/6250): read-option compatibility such as `ignoreDeletes`, `skipChangeCommits`, `ignoreChanges`, `ignoreFileDeletion`

- **Type system and expression compatibility in Delta Kernel**
  - PR [#6257](https://github.com/delta-io/delta/pull/6257): implicit casts between DECIMAL types with differing precisions

- **Unity Catalog managed table semantics**
  - PR [#6243](https://github.com/delta-io/delta/pull/6243): block metadata changes on UC-managed `CatalogOwned` tables
  - PR [#6166](https://github.com/delta-io/delta/pull/6166): extend stagingCatalog for non-Spark session catalog
  - PRs [#6155](https://github.com/delta-io/delta/pull/6155), [#6156](https://github.com/delta-io/delta/pull/6156): UC commit metrics transport/payload work

These collectively advance **planner intelligence**, **scan optimization**, **control-plane integration**, and **semantic consistency across Delta runtimes**.

## 4) Community Hot Topics

The dataset does not include reliable comment counts beyond ordering, so “hot topics” are inferred from repeated themes, stacked PRs, and architectural concentration.

### A. DSv2 read-option parity in kernel-spark
- [#6245](https://github.com/delta-io/delta/pull/6245) — `ignoreDeletes`
- [#6246](https://github.com/delta-io/delta/pull/6246) — `skipChangeCommits`
- [#6249](https://github.com/delta-io/delta/pull/6249) — `ignoreChanges`
- [#6250](https://github.com/delta-io/delta/pull/6250) — `ignoreFileDeletion`

**Why it matters:** Users want **behavioral parity between Delta’s DSv2 path and legacy read semantics**, especially for streaming/incremental/change-heavy workloads. The cluster of stacked PRs suggests a concrete technical need: enterprises migrating to newer scan APIs still require operational options used to tolerate change-log edge cases or specific ingestion patterns.

### B. Spark planner/optimizer integration for DSv2
- [#6203](https://github.com/delta-io/delta/pull/6203) — catalog stats in DSv2 scan
- [#6224](https://github.com/delta-io/delta/pull/6224) — `SupportsReportPartitioning`

**Underlying need:** Better **cost-based planning**, **shuffle reduction**, and more accurate scan estimates. This is a strong signal that Delta wants DSv2 not just to function, but to participate fully in Spark optimizer decisions.

### C. UC-managed table correctness and governance
- [#6243](https://github.com/delta-io/delta/pull/6243) — block metadata changes on UC-managed tables
- [#6204](https://github.com/delta-io/delta/pull/6204) — send schema to UC on managed table creation
- [#6251](https://github.com/delta-io/delta/pull/6251) — staged replace handoff support
- [#6166](https://github.com/delta-io/delta/pull/6166) — stagingCatalog for non-Spark session catalog

**Underlying need:** Stronger **catalog authority boundaries** and safer **managed-table lifecycle operations**. This points to real-world deployment pressure from users running Delta in governed, multi-catalog environments.

### D. Kernel expression/type compatibility
- [#6257](https://github.com/delta-io/delta/pull/6257) — DECIMAL implicit cast support
- Issue [#6247](https://github.com/delta-io/delta/issues/6247) — case-insensitive column matching in Java Kernel data skipping

**Underlying need:** Delta Kernel is being pushed toward **semantic parity with Spark**, especially in expression evaluation and predicate/data-skipping behavior. This is crucial if Kernel is to be trusted for independent connectors and engines.

## 5) Bugs & Stability

### 1. Case-sensitive column matching in Java Kernel data skipping
- Issue [#6247](https://github.com/delta-io/delta/issues/6247) — **Open**
- Tags: `bug`, `good first issue`

**Severity:** High for correctness, medium for blast radius.  
**Why:** Delta protocol semantics require case-insensitive column-name uniqueness, and Spark already resolves these fields case-insensitively in relevant paths. If Java Kernel data skipping is using case-sensitive matching, filters may **fail to match eligible stats columns**, leading to **missed pruning** and potentially inconsistent behavior across runtimes. This is primarily a **query performance and semantic consistency** bug, though in some edge cases it can also create confusion about filter effectiveness.

**Fix status:** No linked fix PR was provided in the data.

### 2. NullType handling in UDT writes
- PR [#6254](https://github.com/delta-io/delta/pull/6254) — **Closed**
  
**Severity:** Medium.  
**Why:** Writes involving `NullType` nested in UDTs can create schema ambiguity or unsupported persisted states. Even though this surfaced as a fix rather than a newly opened bug, it’s a noteworthy stability hardening item.

### 3. Managed-table metadata mutation inconsistency under UC
- PR [#6243](https://github.com/delta-io/delta/pull/6243) — **Open**
  
**Severity:** High in managed enterprise deployments.  
**Why:** The PR description explicitly says metadata mutations can **succeed locally but leave remote state inconsistent** for `CatalogOwned` UC-managed tables. That is a serious governance/correctness issue in catalog-managed environments.

## 6) Feature Requests & Roadmap Signals

Today’s strongest roadmap signals are not from user-filed feature issues, but from concentrated PR activity.

### Likely near-term features for the next version

1. **Stronger DSv2 support in Spark/kernel-spark**
   - [#6203](https://github.com/delta-io/delta/pull/6203)
   - [#6224](https://github.com/delta-io/delta/pull/6224)
   - [#6245](https://github.com/delta-io/delta/pull/6245)
   - [#6246](https://github.com/delta-io/delta/pull/6246)
   - [#6249](https://github.com/delta-io/delta/pull/6249)
   - [#6250](https://github.com/delta-io/delta/pull/6250)

   **Prediction:** Very likely to appear in the next release line, because this work is broad, actively stacked, and touches core scan behavior.

2. **More complete Delta Kernel SQL/type semantics**
   - [#6257](https://github.com/delta-io/delta/pull/6257)
   - [#6247](https://github.com/delta-io/delta/issues/6247)

   **Prediction:** High probability. These are the sort of parity fixes that often get prioritized before or during a minor release.

3. **Deeper Unity Catalog transactional integration**
   - [#6243](https://github.com/delta-io/delta/pull/6243)
   - [#6166](https://github.com/delta-io/delta/pull/6166)
   - [#6251](https://github.com/delta-io/delta/pull/6251)
   - [#6155](https://github.com/delta-io/delta/pull/6155)
   - [#6156](https://github.com/delta-io/delta/pull/6156)

   **Prediction:** Likely to land incrementally, especially for managed-table correctness and telemetry/metrics transport.

4. **Possible optimizer/statistics controls**
   - [#5888](https://github.com/delta-io/delta/pull/5888) — force stats collection during query optimizations

   **Prediction:** Less certain, but it reflects user demand for more deterministic optimization behavior in performance-sensitive workloads.

### Versioning signal
- [#6256](https://github.com/delta-io/delta/pull/6256) — **Change master version to 4.2.0-SNAPSHOT**

This is the clearest roadmap marker in the data. It suggests the project has advanced past the prior release line and is now accumulating changes for **4.2.0**.

## 7) User Feedback Summary

Based on the issues and PRs updated today, user pain points are concentrated in four practical areas:

- **Consistency across execution paths**  
  Users expect Delta behavior to match whether they access it through Spark internals, DSv2, or Delta Kernel. The case-insensitive data-skipping bug in [#6247](https://github.com/delta-io/delta/issues/6247) shows that semantic drift between runtimes is still painful.

- **Need for DSv2 behavioral parity**  
  The stacked read-option PRs — [#6245](https://github.com/delta-io/delta/pull/6245), [#6246](https://github.com/delta-io/delta/pull/6246), [#6249](https://github.com/delta-io/delta/pull/6249), [#6250](https://github.com/delta-io/delta/pull/6250) — indicate users are actively depending on compatibility flags when reading tables with deletes/change commits or non-append activity.

- **Governed catalog correctness matters**  
  UC-related work such as [#6243](https://github.com/delta-io/delta/pull/6243) and [#6204](https://github.com/delta-io/delta/pull/6204) reflects real deployment pressure from users who need Delta to behave correctly in centralized metadata/governance setups, not just local Spark sessions.

- **Performance remains a core expectation**  
  Efforts around stats propagation and partition reporting in [#6203](https://github.com/delta-io/delta/pull/6203) and [#6224](https://github.com/delta-io/delta/pull/6224) suggest users care not only that queries run, but that Spark can optimize them effectively.

There is **no strong negative sentiment signal** in today’s data such as a flood of bug reports or regressions; instead, the pattern is one of **maturing integration and closing semantic gaps**.

## 8) Backlog Watch

These items look important and worthy of maintainer attention because they are older, still open, and tied to core functionality.

- **[SPARK] Improve check for V2WriteCommand with fallback to V1 in PrepareDeltaScan** — PR [#5804](https://github.com/delta-io/delta/pull/5804)  
  Open since 2026-01-08. This touches **write-path planning correctness** and compatibility with mixed V1/V2 execution. Long-lived planner-path PRs can hide subtle edge cases and deserve review.

- **Add a flag to force stats collection during query optimizations** — PR [#5888](https://github.com/delta-io/delta/pull/5888)  
  Open since 2026-01-20. This could materially affect **optimizer reliability and performance predictability**, especially for users dealing with stale/missing statistics.

- **[UC Commit Metrics] Add skeleton transport wiring and smoke tests** — PR [#6155](https://github.com/delta-io/delta/pull/6155)  
- **[UC Commit Metrics] Add full payload construction and schema tests** — PR [#6156](https://github.com/delta-io/delta/pull/6156)  
  Open since 2026-02-27. These likely matter for **observability, governance, and enterprise telemetry**, but stacked PRs can stall if the base layer is not reviewed quickly.

- **[Delta-Spark] Extend stagingCatalog for non-Spark session catalog** — PR [#6166](https://github.com/delta-io/delta/pull/6166)  
  Open since 2026-03-02. Important for **catalog abstraction and broader engine integration**, particularly if Delta is expanding support beyond the default Spark catalog assumptions.

## Link Index

- Issue [#6247](https://github.com/delta-io/delta/issues/6247)
- PR [#6257](https://github.com/delta-io/delta/pull/6257)
- PR [#6243](https://github.com/delta-io/delta/pull/6243)
- PR [#6203](https://github.com/delta-io/delta/pull/6203)
- PR [#6224](https://github.com/delta-io/delta/pull/6224)
- PR [#6245](https://github.com/delta-io/delta/pull/6245)
- PR [#6246](https://github.com/delta-io/delta/pull/6246)
- PR [#6166](https://github.com/delta-io/delta/pull/6166)
- PR [#6256](https://github.com/delta-io/delta/pull/6256)
- PR [#6204](https://github.com/delta-io/delta/pull/6204)
- PR [#6249](https://github.com/delta-io/delta/pull/6249)
- PR [#6250](https://github.com/delta-io/delta/pull/6250)
- PR [#5888](https://github.com/delta-io/delta/pull/5888)
- PR [#6088](https://github.com/delta-io/delta/pull/6088)
- PR [#6104](https://github.com/delta-io/delta/pull/6104)
- PR [#6155](https://github.com/delta-io/delta/pull/6155)
- PR [#6156](https://github.com/delta-io/delta/pull/6156)
- PR [#5804](https://github.com/delta-io/delta/pull/5804)
- PR [#6254](https://github.com/delta-io/delta/pull/6254)
- PR [#6251](https://github.com/delta-io/delta/pull/6251)

If you want, I can also turn this into a **short exec-summary version** or a **more technical maintainer-oriented digest**.

</details>

<details>
<summary><strong>Databend</strong> — <a href="https://github.com/databendlabs/databend">databendlabs/databend</a></summary>

# Databend Project Digest — 2026-03-12

## 1. Today's Overview

Databend showed **healthy day-to-day development velocity** over the last 24 hours, with **15 PRs updated** and **9 issues updated**, alongside **5 PRs closed/merged** and **6 issues closed**. The current work is concentrated in the **query layer**: SQL correctness, planner behavior, join execution, function semantics, and parser/identifier compatibility. There is also visible effort on **codebase cleanup and architectural simplification**, especially around table branch/tag internals and expression evaluation paths. Overall, project health looks solid: maintainers are closing bug reports quickly, but there are still a few **high-severity correctness issues** open in the execution engine.

## 2. Project Progress

### Merged/closed PRs today

#### SQL compatibility and parser fixes
- [#19526](https://github.com/databendlabs/databend/pull/19526) — **fix(query): support unquoted Unicode aliases and identifiers**  
  Closed/merged today. This improves SQL compatibility by allowing unquoted Unicode alphabetic identifiers such as `AS 中文`, aligning Databend better with multilingual SQL usage and modern identifier expectations. It addresses [Issue #19522](https://github.com/databendlabs/databend/issues/19522).

#### Function semantics correctness
- [#19527](https://github.com/databendlabs/databend/pull/19527) — **fix(query): try_to_timestamp should return null when convert error**  
  Closed/merged. This is a correctness fix for `TRY_` function behavior: invalid timestamp conversions should yield `NULL` instead of throwing. It resolves [Issue #19525](https://github.com/databendlabs/databend/issues/19525) and strengthens Databend’s SQL function consistency.

#### DML / MERGE stability
- [#19529](https://github.com/databendlabs/databend/pull/19529) — **fix(query): avoid merge-into unmatched panic**  
  Closed/merged. This removes a panic path in `MERGE INTO` unmatched-clause handling and ensures expressions are bound against the right mutation schema. This is a valuable stability fix for users relying on warehouse-style upsert/merge workflows.

#### Test and CI maintenance
- [#19531](https://github.com/databendlabs/databend/pull/19531) — **chore(ut): fix test_sync_agg_index**  
  Closed/merged. A maintenance fix that improves test reliability around aggregate index synchronization.
- [#19540](https://github.com/databendlabs/databend/pull/19540) — **ci: upgrade go-version**  
  Closed quickly to address CI failures. This indicates maintainers are actively keeping the build/test pipeline operational.

### What this means technically
Today’s closed work shows progress in three practical areas:
1. **SQL language compatibility**: Unicode identifiers and `TRY_` semantics.
2. **Execution stability**: panic removal in `MERGE INTO`.
3. **Developer velocity**: CI/toolchain maintenance and test fixes to reduce friction.

## 3. Community Hot Topics

### 1) Case sensitivity affecting built-in functions
- [Issue #19536](https://github.com/databendlabs/databend/issues/19536) — **Bug: unquoted_ident_case_sensitive affects built-in function names and system internals**
- [PR #19537](https://github.com/databendlabs/databend/pull/19537) — **fix(query): builtin function names should be case-insensitive regardless of unquoted_ident_case_sensitive**

This is the clearest hot topic today because it combines a fresh bug report with an immediate fix PR. The underlying technical need is **clean separation between user identifier rules and engine-reserved/built-in resolution**. Users expect table/column case-sensitivity settings to affect their own schema objects, but not built-in functions or internal system queries. Fast response here suggests maintainers view parser/analyzer correctness as a priority.

### 2) New hash join correctness
- [Issue #19533](https://github.com/databendlabs/databend/issues/19533) — **new hash join misprojects LEFT JOIN output when build side is empty**
- [PR #19539](https://github.com/databendlabs/databend/pull/19539) — **fix(join): project build columns for fast returning left join**

This is one of the most important active threads because it concerns **query correctness in distributed execution** and can even surface as **Arrow/Flight deserialization failures**. The underlying need is confidence in Databend’s newer join implementation, especially under empty-build-side edge cases. Users running distributed analytics will care more about correctness than micro-optimizations, so this issue is strategically important.

### 3) Planner decorrelation for scalar subqueries
- [PR #19532](https://github.com/databendlabs/databend/pull/19532) — **fix(planner): decorrelate correlated scalar subquery limit**
  
This open PR indicates continued investment in **planner maturity**. The technical need is to correctly support correlated scalar subqueries with `LIMIT` and `ORDER BY ... LIMIT`, which are common in complex BI-generated SQL and advanced analytical workloads.

### 4) Ongoing architectural cleanup
- [PR #19534](https://github.com/databendlabs/databend/pull/19534) — **remove legacy table branch/tag implementation**
- [PR #19499](https://github.com/databendlabs/databend/pull/19499) — **table branch refactor**
- [PR #19505](https://github.com/databendlabs/databend/pull/19505) — **refactor hash shuffle**
- [PR #19538](https://github.com/databendlabs/databend/pull/19538) — **simplify filter and lambda evaluation**

These are less visible to end users but important roadmap signals. The project is spending effort paying down complexity in planner/expression/table internals, which usually precedes more reliable feature delivery and lower regression rates.

## 4. Bugs & Stability

Ranked by severity based on likely user impact:

### High severity

#### 1) LEFT JOIN correctness bug in new hash join
- [Issue #19533](https://github.com/databendlabs/databend/issues/19533)  
- Fix available: [PR #19539](https://github.com/databendlabs/databend/pull/19539)

This appears to be the most severe open issue today. It can produce **schema/DataBlock column-order mismatches** and may lead to **Arrow / Flight deserialization errors** in distributed execution. This is both a correctness and stability problem, especially for clusters using `enable_experimental_new_join = 1`.

#### 2) Built-in function resolution broken by case-sensitive identifier setting
- [Issue #19536](https://github.com/databendlabs/databend/issues/19536)  
- Fix available: [PR #19537](https://github.com/databendlabs/databend/pull/19537)

This bug affects parser/analyzer behavior and can break normal SQL execution in surprising ways. Because it touches **built-in functions and system internals**, it has broad surface area even if the trigger is a specific session setting.

### Medium severity

#### 3) Broken docs/reference link(s)
- [Issue #19535](https://github.com/databendlabs/databend/issues/19535)

Automated link checker found one documentation/reference error. This is not runtime-critical but affects usability and documentation trustworthiness.

#### 4) Historical CI flakiness
- [Issue #17287](https://github.com/databendlabs/databend/issues/17287)

Closed today, this points to prior instability in test reproducibility. While resolved, it is a reminder that planner/execution edge cases can surface as flaky logic tests.

### Recently resolved stability/correctness bugs

- [Issue #19525](https://github.com/databendlabs/databend/issues/19525) / [PR #19527](https://github.com/databendlabs/databend/pull/19527) — `try_to_timestamp` now properly returns `NULL` on invalid input.
- [Issue #19522](https://github.com/databendlabs/databend/issues/19522) / [PR #19526](https://github.com/databendlabs/databend/pull/19526) — Unicode aliases now supported unquoted.
- [PR #19529](https://github.com/databendlabs/databend/pull/19529) — removes a `MERGE INTO` panic path.
- [Issue #17948](https://github.com/databendlabs/databend/issues/17948) — duplicated Prometheus metrics issue closed today.
- [Issue #16068](https://github.com/databendlabs/databend/issues/16068) — ORC via stage/object storage exception closed today.
- [Issue #13995](https://github.com/databendlabs/databend/issues/13995) — historical vacuum assertion failure closed today.

## 5. Feature Requests & Roadmap Signals

There were **no major net-new user-facing feature requests** filed today, but the PR stream gives strong roadmap signals:

### Likely near-term themes

#### Query planner and execution engine hardening
- [PR #19532](https://github.com/databendlabs/databend/pull/19532) — correlated scalar subquery decorrelation
- [PR #19539](https://github.com/databendlabs/databend/pull/19539) — hash join output correctness
- [PR #19505](https://github.com/databendlabs/databend/pull/19505) — hash shuffle refactor
- [PR #19538](https://github.com/databendlabs/databend/pull/19538) — expression evaluation simplification

These strongly suggest the next release will continue to improve **planner correctness and execution robustness** rather than introduce flashy syntax.

#### Advanced join optimization
- [PR #19530](https://github.com/databendlabs/databend/pull/19530) — **Runtime Filter support spatial index join**

This is a meaningful performance-oriented roadmap signal. If completed, it could improve selective join execution for workloads involving spatial indexing or specialized join paths.

#### Internal metadata/model simplification
- [PR #19499](https://github.com/databendlabs/databend/pull/19499)
- [PR #19534](https://github.com/databendlabs/databend/pull/19534)

The branch/tag refactoring suggests Databend is converging toward a cleaner metadata design. This may not show up as an obvious feature in release notes, but it can enable future governance/versioning capabilities with less technical debt.

#### Test infrastructure decoupling
- [PR #19528](https://github.com/databendlabs/databend/pull/19528) — extract sqllogictest to a separate repository

This signals investment in **test scalability and maintainability**, which usually benefits release quality over time.

### Prediction for next version
Most likely to land in the next version:
1. **Case-insensitive built-in function fix** ([PR #19537](https://github.com/databendlabs/databend/pull/19537))
2. **LEFT JOIN new hash join correctness fix** ([PR #19539](https://github.com/databendlabs/databend/pull/19539))
3. **Planner support for correlated scalar subquery + LIMIT forms** ([PR #19532](https://github.com/databendlabs/databend/pull/19532))
4. Possibly **runtime filter enhancements for spatial index joins** if review proceeds smoothly ([PR #19530](https://github.com/databendlabs/databend/pull/19530))

## 6. User Feedback Summary

Based on the issues and fixes updated today, real user pain points are concentrated in:

### SQL compatibility and ergonomics
Users expect Databend to behave like a mature analytical SQL engine in edge cases:
- `TRY_` functions should never hard-fail on malformed input.
- Built-in functions should remain case-insensitive.
- Unicode/CJK identifiers should work naturally.

These are not niche complaints; they reflect users integrating Databend into multilingual environments, SQL-generation tools, and compatibility-sensitive workloads.

### Query correctness over experimental performance
The open join bug shows users are testing newer execution paths and immediately noticing incorrect output or distributed protocol failures. This suggests a user base that values **correctness and predictability in production-like workloads**, especially for joins and distributed queries.

### Reliability of advanced DML
The `MERGE INTO` panic fix indicates users are actively exercising more advanced warehouse semantics, not just simple read queries. Databend is being used in ETL/ELT-style mutation workflows where crash-free behavior is essential.

### Operational visibility
The now-closed duplicated Prometheus metrics issue shows users monitor Databend in observability stacks and care about metric quality. This is a sign of production deployment maturity.

## 7. Backlog Watch

These items deserve maintainer attention due to age, scope, or architectural importance:

### Open, high-priority current bugs
- [Issue #19533](https://github.com/databendlabs/databend/issues/19533) — join correctness issue with distributed failure symptoms  
  Even with [PR #19539](https://github.com/databendlabs/databend/pull/19539) open, this should stay high priority until merged and validated.
- [Issue #19536](https://github.com/databendlabs/databend/issues/19536) — built-in function case sensitivity regression  
  Has an immediate fix in [PR #19537](https://github.com/databendlabs/databend/pull/19537); quick merge would reduce user-facing confusion.

### Large or strategic open PRs
- [PR #19499](https://github.com/databendlabs/databend/pull/19499) — table branch refactor  
  Potentially important but broad; large refactors can stall and should get active review to avoid divergence.
- [PR #19534](https://github.com/databendlabs/databend/pull/19534) — remove legacy table branch/tag implementation  
  Important for reducing technical debt, but such removals need careful migration and compatibility review.
- [PR #19505](https://github.com/databendlabs/databend/pull/19505) — hash shuffle refactor  
  This touches distributed query mechanics and should receive scrutiny due to potential performance/correctness tradeoffs.
- [PR #19528](https://github.com/databendlabs/databend/pull/19528) — extract sqllogictest to separate repo  
  Valuable for maintainability, but test infra changes can affect contributor workflow and regression detection.

### Documentation hygiene
- [Issue #19535](https://github.com/databendlabs/databend/issues/19535) — link checker report  
  Low severity, but worth quick cleanup to keep docs quality high.

## 8. Project Health Assessment

Databend appears to be in a **solid but actively hardening phase**. The maintainers are responsive on user-reported SQL correctness bugs, and there is strong evidence of disciplined follow-through from issue report to fix PR within a day. The main risk area remains the **query engine’s newer or more advanced paths**—joins, planner rewrites, and mutation semantics—where correctness bugs can still surface. Net assessment: **good project momentum, strong maintainer responsiveness, and a clear focus on analytical engine maturity**.

</details>

<details>
<summary><strong>Velox</strong> — <a href="https://github.com/facebookincubator/velox">facebookincubator/velox</a></summary>

# Velox Project Digest — 2026-03-12

## 1) Today's Overview

Velox remained highly active over the last 24 hours, with **25 issues updated** and **50 PRs updated**, indicating strong ongoing development velocity across execution, memory management, GPU/cuDF integration, and connector work. The day’s changes skewed toward **stability and infrastructure hardening**, especially around CI reliability, flaky tests, and memory arbitration behavior, while also advancing **TableWrite semantics**, **Iceberg support**, and **runtime observability**. There were **no new releases**, so current progress is landing incrementally through PRs rather than packaged version cuts. Overall, project health looks solid, but there are still visible pressure points in **test flakiness**, **GPU backend completeness**, and a few **query correctness / type-registration regressions**.

## 2) Project Progress

### Merged/closed PRs today

#### CI/build reliability improved
- **PR #16728 — fix(build): Improve CI dependency download reliability**  
  https://github.com/facebookincubator/velox/pull/16728  
  Merged. This switches GEOS downloads away from the unavailable OSGeo host to a GitHub mirror and also fixes LZO download handling. This is a practical but important improvement for build reproducibility and developer velocity, especially given the related build outage report in issue #16725.

#### Memory arbitration test stability improved
- **PR #16731 — fix: Fix race condition in MockSharedArbitrationTest.localArbitrationRunInParallelWithGlobalArbitration**  
  https://github.com/facebookincubator/velox/pull/16731  
  Merged. This addresses a race in test setup around `SCOPED_TESTVALUE_SET` callback registration versus arbitration-triggering thread startup. It directly advances confidence in Velox’s shared-memory arbitration model and closes out a known flaky area.

#### Header / compile hygiene cleanup
- **PR #16670 — misc: Move folly/Hash.h include from Type.h to Type.cpp**  
  https://github.com/facebookincubator/velox/pull/16670  
  Merged. While not a feature, this reduces transitive header cost on one of the most-included types in the codebase, helping compile-time efficiency and dependency hygiene.

#### Closed but not materially product-facing
- **PR #16734 — folly removal test**  
  https://github.com/facebookincubator/velox/pull/16734  
  Closed without obvious user-facing impact.

### Significant open work advancing today

#### TableWrite / TableWriteMerge correctness and operability
A cluster of PRs suggests concentrated work on write-path semantics:
- **PR #16736 — Handle mixed stats/data batches in TableWriteMerge**  
  https://github.com/facebookincubator/velox/pull/16736  
  Fixes a correctness issue where mixed batches could silently drop data rows if classification relied only on row 0.
- **PR #16724 — Document TableWriteNode and TableWriteMergeNode**  
  https://github.com/facebookincubator/velox/pull/16724  
  Adds detailed docs around multiplexed output format and execution topology.
- **PR #16738 — Add stats spec to TableWrite/TableWriteMerge toString output**  
  https://github.com/facebookincubator/velox/pull/16738  
  Improves explainability/debuggability of write plans.

This cluster materially improves write-path transparency and likely reduces operational debugging time for distributed write workflows.

#### Iceberg connector capability expansion
- **PR #16715 — Add positional update support for Velox Iceberg connector**  
  https://github.com/facebookincubator/velox/pull/16715  
  This is a notable connector feature: merge-on-read positional updates extend Iceberg read semantics beyond deletes, strengthening Velox’s lakehouse compatibility story.

#### Runtime metrics and observability
- **PR #16711 — Add blockedWaitFor runtime metrics in Driver::closeByTask()**  
  https://github.com/facebookincubator/velox/pull/16711  
  Improves query-failure diagnostics by ensuring blocked wait metrics are still emitted during task-driven closure paths.

## 3) Community Hot Topics

### 1. Time zone correctness in Iceberg/Gluten workflows
- **Issue #16507 — TimeZoneMap cannot distinguish GMT**  
  https://github.com/facebookincubator/velox/issues/16507  
  Most commented active issue today among open items. The report comes from a real integration path involving **Gluten + Velox + Spark 4.0 + Iceberg**, which makes it especially important. The underlying need is better semantic correctness around timezone normalization / identity mapping, an area that can silently affect analytics correctness in cross-engine interoperability.

### 2. GPU backend completeness for filters and operator coverage
- **Issue #16198 — [cuDF] Request for kMultiRange Filter support in CuDF**  
  https://github.com/facebookincubator/velox/issues/16198  
  Closed today, but the request highlights a real gap: unsupported filter forms can force failure rather than graceful execution.
- **Issue #15772 — [cuDF] Expand GPU operator support for Presto TPC-DS**  
  https://github.com/facebookincubator/velox/issues/15772  
  https://github.com/facebookincubator/velox/issues/15772  
  Signals ongoing demand to reduce CPU fallback in GPU-enabled Presto workloads.
- **Issue #16722 — [cuDF] Add accurate runtime statistics for cudf operators**  
  https://github.com/facebookincubator/velox/issues/16722  
  Shows community demand has moved beyond “does it run?” to “can we measure it correctly?”, which is a maturity signal for GPU adoption.

**Technical need:** complete pushdown/operator support plus correct asynchronous timing instrumentation for CUDA-stream execution.

### 3. Dot product UDF churn and type coverage regression
- **Issue #16723 — Failed test `DotProductTest.floatArrays` in debug build**  
  https://github.com/facebookincubator/velox/issues/16723  
- **PR #16726 — Add missing float array registration for dot_product VDF**  
  https://github.com/facebookincubator/velox/pull/16726  
- **PR #16739 — Remove dot_product UDF**  
  https://github.com/facebookincubator/velox/pull/16739  
- **PR #16740 — Re-add dot_product UDF with test fix**  
  https://github.com/facebookincubator/velox/pull/16740  

This is the clearest live engineering thread today: a new SQL/UDF surface appears to have landed with incomplete type registration, triggering immediate build/test breakage and rapid reconsideration. The deeper need is stronger registration/test matrix coverage for numeric overload families before exposing new SQL functions.

### 4. Memory arbitration and spilling simplification
Several issues closed today indicate continued consolidation of memory management behavior:
- **Issue #8218 — Deprecate test inject and threshold triggered Spilling in Velox**  
  https://github.com/facebookincubator/velox/issues/8218
- **Issue #8220 — Remove NoOp memory arbitrator kind**  
  https://github.com/facebookincubator/velox/issues/8220
- **Issue #15336 — localArbitrationRunInParallelWithGlobalArbitration is flaky**  
  https://github.com/facebookincubator/velox/issues/15336

**Technical need:** converge on a simpler, production-aligned memory arbitration model centered on `SharedArbitrator`, while retiring older testing or legacy modes.

## 4) Bugs & Stability

Ranked by likely severity / user impact:

### Critical / high severity

#### 1. Potential data loss in write path when stats/data rows mix
- **PR #16736 — Handle mixed stats/data batches in TableWriteMerge**  
  https://github.com/facebookincubator/velox/pull/16736  
  This is the highest-impact item in today’s open PRs because it describes **silent dropping of data rows** when exchange output mixes row types in one vector. If reproducible in production topologies, this is a correctness bug affecting write results. No separate linked issue is shown in the provided data, but this PR itself is the active fix.

#### 2. Timezone semantic bug affecting Iceberg/Gluten
- **Issue #16507 — TimeZoneMap cannot distinguish GMT**  
  https://github.com/facebookincubator/velox/issues/16507  
  This appears user-facing and integration-relevant. Timezone bugs can produce incorrect reads, parsing failures, or cross-engine incompatibilities. No fix PR is shown yet.

#### 3. Expression fuzzer crash involving TIME semantics
- **Issue #16663 — [CI] Expression Fuzzer crashes: IS DISTINCT FROM with TIME type not handled by Presto reference runner**  
  https://github.com/facebookincubator/velox/issues/16663  
  This is partly a reference-runner compatibility issue rather than confirmed engine correctness failure, but it blocks verification confidence for TIME semantics. No fix PR listed.

### Medium severity

#### 4. Debug-build JITIFY crash on process exit
- **Issue #16707 — JITIFY crash on test/benchmark app exit if built Debug**  
  https://github.com/facebookincubator/velox/issues/16707  
  Affects debug/test/benchmark executables including cuDF. Mostly developer-facing, but painful for GPU backend contributors. No fix PR shown yet.

#### 5. Build outage due to external dependency host failure
- **Issue #16725 — Builds fail because osgeo.org is unavailable**  
  https://github.com/facebookincubator/velox/issues/16725  
  Fixed quickly by:
- **PR #16728 — Improve CI dependency download reliability**  
  https://github.com/facebookincubator/velox/pull/16728

#### 6. Dot product type mismatch regression
- **Issue #16723 — Failed test `DotProductTest.floatArrays` in debug build**  
  https://github.com/facebookincubator/velox/issues/16723  
  Related PRs:
  - **#16726** fix registration  
    https://github.com/facebookincubator/velox/pull/16726
  - **#16739** remove function  
    https://github.com/facebookincubator/velox/pull/16739
  - **#16740** re-add with test fix  
    https://github.com/facebookincubator/velox/pull/16740

This is a contained regression, but it exposed fragility in how function registration aligns with generic implementation coverage.

### Ongoing flaky / infra stability concerns

- **Issue #15817 — Flaky tests: SpillerTest/AllTypesSpillerTest.readaheadTest/N**  
  https://github.com/facebookincubator/velox/issues/15817
- **Issue #10027 — Flaky HashJoinTest.failedToReclaimFromHashJoinBuildersInNonReclaimableSection**  
  https://github.com/facebookincubator/velox/issues/10027
- **Issue #10295 — Flaky AggregationTest.maxSpillBytes**  
  https://github.com/facebookincubator/velox/issues/10295
- **Issue #13308 — Flaky HashJoinBridgeTest.multiThreading/0**  
  https://github.com/facebookincubator/velox/issues/13308
- **Issue #15119 — Flaky test: MockSharedArbitrationTest.freeUnusedCapacityWhenReclaimMemoryPool**  
  https://github.com/facebookincubator/velox/issues/15119
- **Issue #10034 — Flaky MultiFragmentTest.taskTerminateWithProblematicRemainingRemoteSplits**  
  https://github.com/facebookincubator/velox/issues/10034
- **Issue #11992 — Flaky HashJoinTest.reclaimDuringOutputProcessing**  
  https://github.com/facebookincubator/velox/issues/11992

The good news is many of these were closed today, suggesting active maintenance rather than neglect.

## 5) Feature Requests & Roadmap Signals

### Strongest roadmap signals

#### Iceberg read-path sophistication is increasing
- **PR #16715 — positional update support for Velox Iceberg connector**  
  https://github.com/facebookincubator/velox/pull/16715  
  This is a significant roadmap indicator. Velox appears to be deepening Iceberg merge-on-read compatibility, likely important for engines integrating lakehouse mutation semantics.

#### GPU/cuDF remains a strategic investment
- **Issue #15772 — Expand GPU operator support for Presto TPC-DS**  
  https://github.com/facebookincubator/velox/issues/15772
- **Issue #16722 — Add accurate runtime statistics for cudf operators**  
  https://github.com/facebookincubator/velox/issues/16722
- **Issue #16733 — Consider using new cuDF memcpy APIs**  
  https://github.com/facebookincubator/velox/issues/16733
- **Issue #16105 — Add CudfVector coalescing when batches get too small**  
  https://github.com/facebookincubator/velox/issues/16105
- **Issue #16179 — Join Filters do not check that expression can be evaluated by CUDF**  
  https://github.com/facebookincubator/velox/issues/16179

Expected near-term direction: better GPU fallback handling, more complete filter/operator coverage, and more accurate observability for async device execution.

#### SQL/function surface may expand, but cautiously
- **Dot product UDF PR chain (#16726, #16739, #16740)**  
  These PRs imply appetite to add analytical/math vector functions, but also show maintainers are sensitive to quality bar and registration completeness.

#### Filter evaluation and pushdown improvements
- **PR #15738 — Allow merging OR-ed bigint single value ranges**  
  https://github.com/facebookincubator/velox/pull/15738  
  This points to continued work on filter normalization and evaluability, relevant for scan pushdown and connector efficiency.

### Likely candidates for the next version
Most likely to land in an upcoming release based on current momentum:
1. **Iceberg positional updates**  
2. **TableWrite / TableWriteMerge correctness and documentation improvements**  
3. **Additional runtime/debug metrics**  
4. **Incremental cuDF backend completeness and instrumentation**  
5. **Build/dependency hardening**

## 6) User Feedback Summary

### Main user pain points seen today

#### Cross-engine compatibility remains a major concern
The timezone issue in a **Gluten + Spark + Iceberg** path shows users are exercising Velox in realistic heterogeneous stacks, not just isolated benchmarks:
- **Issue #16507**  
  https://github.com/facebookincubator/velox/issues/16507

#### GPU users want fewer unsupported fallbacks and better diagnostics
Multiple cuDF issues indicate users are running substantive workloads and hitting backend coverage limits rather than setup issues:
- **Issue #15772**  
  https://github.com/facebookincubator/velox/issues/15772
- **Issue #16722**  
  https://github.com/facebookincubator/velox/issues/16722
- **Issue #16707**  
  https://github.com/facebookincubator/velox/issues/16707

This suggests satisfaction with the general direction of GPU enablement, but frustration with incomplete operator support, fragile debug behavior, and misleading timing metrics.

#### Developers are sensitive to CI and dependency brittleness
- **Issue #16725**  
  https://github.com/facebookincubator/velox/issues/16725  
  The quick fix in PR #16728 shows maintainers are responsive, but it also highlights how external dependency hosts can still disrupt contributor workflows.

#### Memory/spill behavior is still one of the most operationally sensitive areas
The number of spill/arbitration-related flaky tests closed today implies this continues to be a complex subsystem under load and concurrency. Users likely care about predictable behavior here because these failures map directly to out-of-memory prevention and large-query robustness.

## 7) Backlog Watch

These older items still look important and worthy of maintainer attention:

### Long-lived correctness / capability gaps

- **Issue #3263 — Add spilling support for distinct hash aggregation**  
  https://github.com/facebookincubator/velox/issues/3263  
  Open since 2022. This is a substantive execution-engine limitation: distinct aggregation under spill pressure is a core large-scale analytics scenario.

- **Issue #15772 — [cuDF] Expand GPU operator support for Presto TPC-DS**  
  https://github.com/facebookincubator/velox/issues/15772  
  Important for demonstrating GPU backend completeness on canonical benchmarks.

- **PR #16019 — Use FBThrift instead of Apache Thrift**  
  https://github.com/facebookincubator/velox/pull/16019  
  Open since January. This could materially affect dependency simplification and Parquet-related integration, but likely needs careful compatibility review.

### Stale but potentially useful PRs

- **PR #14677 — Support compression for TextWriter**  
  https://github.com/facebookincubator/velox/pull/14677  
  Open since 2025-09. Useful storage/output feature, especially for practical file-generation workflows.

- **PR #15430 — Report number of lookups to the AsyncDataCache**  
  https://github.com/facebookincubator/velox/pull/15430  
  Observability enhancement with likely operational value.

- **PR #15738 — Allow merging OR-ed bigint single value ranges**  
  https://github.com/facebookincubator/velox/pull/15738  
  Could improve filter execution/planning quality; seems worth revisiting.

- **PR #15713 — remove unused variable in ST_Area**  
  https://github.com/facebookincubator/velox/pull/15713  
  Low priority, but stale housekeeping PRs can create avoidable review noise if left indefinitely open.

---

## Bottom line

Velox is showing **strong development throughput** and healthy responsiveness to CI and test issues, with meaningful work underway in **write-path correctness**, **Iceberg support**, and **GPU backend maturation**. The most important watch items are the **TableWriteMerge correctness fix**, **timezone compatibility bug**, and continued **cuDF completeness/instrumentation** work. Stability is improving, but the volume of closed flaky-test issues confirms that **memory arbitration, spilling, and concurrency** remain the engine’s most maintenance-intensive areas.

</details>

<details>
<summary><strong>Apache Gluten</strong> — <a href="https://github.com/apache/incubator-gluten">apache/incubator-gluten</a></summary>

# Apache Gluten Project Digest — 2026-03-12

## 1. Today's Overview

Apache Gluten remained highly active over the last 24 hours, with **27 pull requests updated** and **5 issues active**, indicating strong ongoing engineering throughput. The main themes were **Velox backend compatibility**, **Spark 4.x test re-enablement**, **infrastructure cleanup after TLP graduation**, and **dependency/version alignment with upstream Velox**. No new release was published, but repository activity suggests the project is in an important transition phase: simultaneously improving runtime correctness and modernization while completing the move from Incubator to a full Apache Top Level Project. Overall project health looks **active and forward-moving**, though there are still notable correctness and compatibility gaps under active tracking.

## 3. Project Progress

### Merged/closed PRs today

#### 1. Enable `assert_not_null` expression for Velox backend
- PR: [#11685](https://github.com/apache/incubator-gluten/pull/11685)
- Status: Closed
- Area: Velox, core, data lake compatibility

This change maps Spark’s `AssertNotNull` expression to Velox’s native `assert_not_null` function. That is a meaningful SQL/data-write compatibility improvement because Spark uses this path during insert-time NOT NULL constraint enforcement. Practically, it reduces fallback to Spark for a common write validation path and improves native execution coverage for table insert workloads.

**Why it matters:**  
This is a query engine correctness and compatibility improvement, especially for lakehouse and structured table writes where schema constraints must be preserved.

---

#### 2. Enable `GlutenDataFrameSubquerySuite` for Spark 4.1
- PR: [#11727](https://github.com/apache/incubator-gluten/pull/11727)
- Status: Closed
- Area: Spark 4.1 compatibility, Velox backend

This PR fixes validation for **struct-typed join keys** and re-enables a Spark 4.1 test suite involving subquery semantics. The underlying issue came from Spark 4.1’s `isin(Dataset)` API introducing struct IN subquery predicates that become `BroadcastHashJoin` plans with struct keys.

**Why it matters:**  
This is a direct SQL compatibility improvement tied to newer Spark planner behavior. Re-enabling previously disabled suites is one of the clearest signals of engine maturity.

---

#### 3. Follow-up fix for Spark 4.1 nightly packaging
- PR: [#11744](https://github.com/apache/incubator-gluten/pull/11744)
- Status: Closed
- Area: Infrastructure, Spark 4.1 packaging

A smaller but important follow-up to stabilize Spark 4.1 nightly build/package workflows.

**Why it matters:**  
Packaging stability is foundational for contributors and downstream adopters testing Spark 4.1 support.

---

### Other notable in-flight engineering work

#### Parquet type widening support
- PR: [#11719](https://github.com/apache/incubator-gluten/pull/11719)

This is one of the most important open feature/fix PRs in the queue. It addresses **SPARK-18108**, parquet-thrift compatibility, and adds **Parquet type widening support** to the Velox backend, reportedly enabling **79/84 tests** in `GlutenParquetTypeWideningSuite`.

**Impact:**  
Strong signal of progress on analytical storage compatibility and schema evolution behavior.

#### Multi-segment-per-partition columnar shuffle
- PR: [#11722](https://github.com/apache/incubator-gluten/pull/11722)

Adds support for multiple segments per partition in the Velox columnar shuffle writer, allowing incremental flushes and lowering peak memory pressure.

**Impact:**  
This is a genuine storage/runtime optimization relevant to large shuffles and memory-bound workloads.

#### Variant type suite re-enablement
- PR: [#11726](https://github.com/apache/incubator-gluten/pull/11726)

Re-enables several Variant-related suites for Spark 4.0 and 4.1, with fixes around validator support and variant shredded structs.

**Impact:**  
This is another sign that Spark 4.x feature parity work is actively progressing.

## 4. Community Hot Topics

### 1. Velox upstream PR tracking
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)
- Comments: 16
- Reactions: 👍 4

This is the most active issue in the set. It tracks useful Velox PRs, many originating from the Gluten community, that are not yet merged upstream.

**Technical need behind it:**  
Gluten’s development velocity depends heavily on upstream Velox landing required features/fixes. This tracker shows an ongoing coordination cost between downstream engine integration and upstream dependency governance. It also implies some desired features/fixes may be blocked not by Gluten implementation effort, but by upstream merge latency.

---

### 2. Spark 4.x disabled test suites tracker
- Issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550)
- Comments: 6

This issue tracks disabled Spark 4.x suites and is one of the clearest roadmap indicators in the repository.

**Technical need behind it:**  
The project is still converging on full Spark 4.x compatibility. Many recent PRs, including [#11727](https://github.com/apache/incubator-gluten/pull/11727) and [#11726](https://github.com/apache/incubator-gluten/pull/11726), appear directly aligned with burning down this tracker.

---

### 3. Dynamic partition pruning regression
- Issue: [#11692](https://github.com/apache/incubator-gluten/issues/11692)
- Comments: 6
- Link: [#11692](https://github.com/apache/incubator-gluten/issues/11692)

This bug reports failures in Spark unit tests from `DynamicPartitionPruningHiveScanSuite` starting from Gluten **1.5.1 onwards**.

**Technical need behind it:**  
Dynamic partition pruning is performance-critical in analytical query execution, especially for partitioned tables and star-schema-style workloads. A regression here has implications beyond tests: it may indicate planner/expression translation mismatch affecting query correctness or optimization eligibility.

---

### 4. TLP graduation workstream
- Issue: [#11713](https://github.com/apache/incubator-gluten/issues/11713)
- PRs: [#11735](https://github.com/apache/incubator-gluten/pull/11735), [#11737](https://github.com/apache/incubator-gluten/pull/11737), [#11738](https://github.com/apache/incubator-gluten/pull/11738), [#11739](https://github.com/apache/incubator-gluten/pull/11739), [#11741](https://github.com/apache/incubator-gluten/pull/11741), [#11742](https://github.com/apache/incubator-gluten/pull/11742)

A major concentration of activity is around repository/path renaming, workflow updates, release script changes, and removing Incubator-era references.

**Technical need behind it:**  
This is not runtime-facing, but it is strategically significant. It signals project maturity and likely precedes wider adoption, cleaner release operations, and reduced contributor confusion around repository naming.

## 5. Bugs & Stability

Ranked by likely severity and user impact:

### High severity

#### 1. Dynamic partition pruning Hive scan test failures since 1.5.1
- Issue: [#11692](https://github.com/apache/incubator-gluten/issues/11692)

Reported failing Spark suites:
- `DynamicPartitionPruningHiveScanSuiteAEOff`
- `DynamicPartitionPruningHiveScanSuiteAEOn`

The summary suggests a mismatch around dynamic pruning expression/input handling.

**Why severe:**  
This touches **query planning correctness and optimization compatibility** for partitioned table scans. Since the report explicitly says failures begin from **1.5.1 onward**, this looks like a regression.

**Fix PR status:**  
No direct fix PR is listed in the provided data.

---

### Medium severity

#### 2. Spark 4.x disabled suites remain an umbrella stability concern
- Issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550)

This is not one bug, but a collection of unresolved compatibility gaps. Recent PRs show progress:
- [#11727](https://github.com/apache/incubator-gluten/pull/11727) closed one subquery-related gap
- [#11726](https://github.com/apache/incubator-gluten/pull/11726) targets Variant suites
- [#11719](https://github.com/apache/incubator-gluten/pull/11719) addresses Parquet widening tests

**Why medium severity:**  
These issues affect confidence in Spark 4.x production readiness, though many are being actively worked.

---

### Low to medium severity

#### 3. Folly version skew with upstream Velox
- Issue: [#11740](https://github.com/apache/incubator-gluten/issues/11740)
- PR: [#11745](https://github.com/apache/incubator-gluten/pull/11745)

Velox has already moved to `folly v2026.01.05`, and Gluten needs to follow due to newly used APIs.

**Why it matters:**  
This is primarily a **build/runtime dependency compatibility** concern. If left unresolved, it can block syncing with newer Velox snapshots or break builds.

**Fix PR status:**  
An implementation PR already exists: [#11745](https://github.com/apache/incubator-gluten/pull/11745)

## 6. Feature Requests & Roadmap Signals

### Strong signals likely to land in the next version

#### 1. More complete Spark 4.0/4.1 compatibility
Evidence:
- Issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550)
- PRs: [#11727](https://github.com/apache/incubator-gluten/pull/11727), [#11726](https://github.com/apache/incubator-gluten/pull/11726), [#11744](https://github.com/apache/incubator-gluten/pull/11744)

**Prediction:**  
Expect the next release to emphasize **Spark 4.x compatibility expansion**, especially around subqueries, Variant types, packaging, and disabled suite reduction.

---

#### 2. Better Parquet schema evolution / type widening support
- PR: [#11719](https://github.com/apache/incubator-gluten/pull/11719)

**Prediction:**  
High chance this appears in the next release notes if merged soon. It directly improves compatibility with real-world data lakes where Parquet schema drift and widening are common.

---

#### 3. Lower-memory shuffle execution
- PR: [#11722](https://github.com/apache/incubator-gluten/pull/11722)

**Prediction:**  
This looks like a high-value performance feature for production workloads. If merged, it could become a notable runtime optimization highlight.

---

#### 4. TimestampNTZ and time function validation improvements
- PRs: [#11720](https://github.com/apache/incubator-gluten/pull/11720), [#11656](https://github.com/apache/incubator-gluten/pull/11656)

These indicate active work around validation/fallback behavior for `TimestampNTZType` and time expressions such as `CurrentTimestamp`.

**Prediction:**  
Expect future releases to reduce unnecessary Spark fallback for temporal expressions, improving native Velox coverage.

---

#### 5. Dependency alignment with upstream Velox/Folly
- Issue: [#11740](https://github.com/apache/incubator-gluten/issues/11740)
- PR: [#11745](https://github.com/apache/incubator-gluten/pull/11745)
- Daily sync PR: [#11736](https://github.com/apache/incubator-gluten/pull/11736)

**Prediction:**  
Continued frequent upstream synchronization remains a core part of Gluten’s roadmap, especially for Velox-backed execution.

## 7. User Feedback Summary

Based on the current issue/PR set, the most visible user and contributor pain points are:

### 1. Spark version compatibility remains a practical adoption blocker
The repeated focus on disabled Spark 4.x suites, Spark 4.1 packaging, and planner-specific semantics suggests users want Gluten to track Spark changes faster and with fewer fallback/correctness gaps.

Relevant items:
- [#11550](https://github.com/apache/incubator-gluten/issues/11550)
- [#11727](https://github.com/apache/incubator-gluten/pull/11727)
- [#11744](https://github.com/apache/incubator-gluten/pull/11744)

### 2. Query correctness matters more than raw acceleration
Recent work is not just performance-oriented; a lot of it addresses semantic parity:
- `AssertNotNull` support: [#11685](https://github.com/apache/incubator-gluten/pull/11685)
- DPP regression report: [#11692](https://github.com/apache/incubator-gluten/issues/11692)
- Timestamp validation/fallback behavior: [#11720](https://github.com/apache/incubator-gluten/pull/11720)

This suggests users are pushing Gluten toward deeper compatibility for production SQL semantics, not just benchmark speedups.

### 3. Data lake interoperability is an important adoption theme
Parquet widening support and insert constraint support both indicate real-world lakehouse usage patterns:
- [#11719](https://github.com/apache/incubator-gluten/pull/11719)
- [#11685](https://github.com/apache/incubator-gluten/pull/11685)

### 4. Contributors are sensitive to upstream dependency lag
The Velox PR tracker and Folly bump request imply frustration or at least operational burden from waiting on upstream integration:
- [#11585](https://github.com/apache/incubator-gluten/issues/11585)
- [#11740](https://github.com/apache/incubator-gluten/issues/11740)

## 8. Backlog Watch

### 1. WIP: add bolt backend in gluten
- PR: [#11261](https://github.com/apache/incubator-gluten/pull/11261)
- Created: 2025-12-05
- Status: Open

This is the oldest visible open PR in the provided set and spans many areas: core, build, Velox, infra, ClickHouse, docs, and BOLT.

**Why it needs attention:**  
A backend addition is strategically important but expensive to keep long-lived. Without active maintainer review, it risks bit-rot, rebase burden, and unclear roadmap signaling.

---

### 2. Velox upstream useful PR tracker
- Issue: [#11585](https://github.com/apache/incubator-gluten/issues/11585)

**Why it needs attention:**  
This issue reflects dependency on upstream merge velocity. Maintainers may need a clearer policy on temporary downstream carrying, cherry-picking, or feature gating to reduce contributor uncertainty.

---

### 3. Spark 4.x disabled suites tracker
- Issue: [#11550](https://github.com/apache/incubator-gluten/issues/11550)

**Why it needs attention:**  
This is one of the most important quality gates for broader Spark 4.x readiness. It is active, but still represents a significant backlog of compatibility debt.

---

### 4. Maven dependency cache CI improvement
- PR: [#11655](https://github.com/apache/incubator-gluten/pull/11655)
- Created: 2026-02-25
- Status: Open

**Why it needs attention:**  
CI speed and stability directly affect contributor productivity. Infra PRs often get deprioritized, but this one may reduce build cost and friction across the project.

---

### 5. Dynamic partition pruning regression
- Issue: [#11692](https://github.com/apache/incubator-gluten/issues/11692)

**Why it needs attention:**  
This appears to be the most important unresolved correctness regression in the current issue list and should likely receive higher prioritization than cosmetic or migration cleanup work.

---

## Overall Health Assessment

Apache Gluten looks **very active and technically healthy**, with strong contributor momentum and a visible stream of Spark/Velox integration work. The most positive signal is that engineering effort is going into **semantic correctness, test re-enablement, schema compatibility, and memory efficiency**, which are exactly the areas that move an acceleration engine from experimental to production-grade. The biggest risks remain **Spark 4.x parity gaps**, **upstream Velox dependency lag**, and at least one notable **post-1.5.1 regression in dynamic partition pruning**. The project’s recent TLP graduation work also signals institutional maturity and likely improved release/process stability in the near term.

</details>

<details>
<summary><strong>Apache Arrow</strong> — <a href="https://github.com/apache/arrow">apache/arrow</a></summary>

# Apache Arrow Project Digest — 2026-03-12

## 1) Today's Overview

Apache Arrow remained highly active over the last 24 hours, with **25 updated issues** and **25 updated PRs**, indicating steady maintainer and contributor engagement across C++, Parquet, FlightRPC, packaging, Python, and R. The day’s work skewed toward **stability and platform compatibility**, especially around **Parquet correctness/security**, **CI reliability**, and **Flight SQL ODBC installer/test support** on Windows and macOS. There were **no new releases**, so today’s signal is more about **hardening the upcoming release train** than shipping user-facing milestones. Overall project health looks solid: critical bugs are being closed quickly, but there is also visible pressure from a growing backlog of older enhancement requests, especially around **Substrait, Parquet metadata, and cross-platform packaging**.

## 2) Project Progress

### Merged/closed PRs today

#### 1. Critical Parquet decoder safety fix landed
- PR: [#49478](https://github.com/apache/arrow/pull/49478) — **[C++][Parquet] Fix multiplication overflow in PLAIN BYTE_ARRAY decoder**
- Related issue: [#49477](https://github.com/apache/arrow/issues/49477)

This is the most important project advancement today. Arrow closed a **critical fix** for undefined behavior in Parquet decoding discovered via OSS-Fuzz. For analytical storage engines, this matters directly to **query correctness, crash resistance, and secure ingestion** of malformed or adversarial Parquet files. It also shows the project’s fuzzing pipeline is actively surfacing deep decoder issues and maintainers are responding fast.

#### 2. Meson build correctness improved for tensor/json extension sources
- PR: [#49487](https://github.com/apache/arrow/pull/49487) — **[CI][C++] Fix Meson build missing tensor extension sources**

This improves build-system consistency between Meson and CMake by restoring missing sources and headers. While not a query-engine feature per se, this helps downstream integrators and distributors who rely on Meson, reducing packaging drift and improving reproducibility.

#### 3. R package registration fix closed
- PR: [#49481](https://github.com/apache/arrow/pull/49481) — **[R] Fix all.equal registration**

A smaller but useful polish item for the R binding. It reflects ongoing maintenance in Arrow’s language integrations, which remain important for analytics users building on Arrow-backed data frames and Parquet workflows.

#### 4. Old stale items were closed
Closed issues included:
- [#30202](https://github.com/apache/arrow/issues/30202) — R file closing behavior
- [#30192](https://github.com/apache/arrow/issues/30192) — R factor levels in `coalesce()` / `if_else()`
- [#30191](https://github.com/apache/arrow/issues/30191) — Dataset scanner readahead limits
- [#30258](https://github.com/apache/arrow/issues/30258) — R threading model docs
- [#30215](https://github.com/apache/arrow/issues/30215) — Python docs: connecting to Rust
- [#30214](https://github.com/apache/arrow/issues/30214) — Python docs: connecting to C++
- [#30186](https://github.com/apache/arrow/issues/30186) — Windows UTC timestamp-to-string cast
- [#45302](https://github.com/apache/arrow/issues/45302) — suppress gRPC debug context
- [#45340](https://github.com/apache/arrow/pull/45340) — experimental schema dedup when scanning datasets

These closures reduce backlog noise, though some are more administrative than product-progress signals.

## 3) Community Hot Topics

### A. Flight SQL ODBC packaging and platform support
- Issue: [#49404](https://github.com/apache/arrow/issues/49404) — **Manual ODBC Windows MSI installer signing**
- Issue: [#47876](https://github.com/apache/arrow/issues/47876) — **ODBC macOS Installer**
- PR: [#49267](https://github.com/apache/arrow/pull/49267) — **Fix ODBC tests for MacOS**
- Issue: [#49500](https://github.com/apache/arrow/issues/49500) — **Read booleans for applicable SqlInfoOptions**
- Issue: [#49497](https://github.com/apache/arrow/issues/49497) / PR: [#49498](https://github.com/apache/arrow/pull/49498) — **Add `is_update` field to ActionCreatePreparedStatementResult**

This is the clearest short-term product theme. Arrow Flight SQL is being pushed toward **more complete ODBC driver usability and SQL-driver interoperability**, especially on desktop client platforms. The technical need underneath is clear: Arrow is not just a columnar library here, but also infrastructure for **database connectivity**, and users now expect polished installer behavior, signed binaries, correct SQL capability reporting, and API semantics that map cleanly to prepared statement workflows.

### B. Platform/build reliability on macOS and Windows
- PR: [#49491](https://github.com/apache/arrow/pull/49491) — **Fix macOS protobuf@33 keg-only discovery**
- Issue: [#49499](https://github.com/apache/arrow/issues/49499) — **Snappy/Brotli debug libraries linked in Release builds via vcpkg**
- PR: [#49462](https://github.com/apache/arrow/pull/49462) — **Fix intermittent segfault in arrow-json-test on Windows MinGW**
- PR: [#48539](https://github.com/apache/arrow/pull/48539) — **Windows ARM64 PyArrow support**

A strong share of community attention is going to **toolchain and packaging edge cases**, not new APIs. This typically happens when a project is mature and widely embedded: more users are integrating Arrow in diverse build environments, and friction shows up in package managers, CI images, ARM platforms, and mixed debug/release dependency graphs.

### C. Long-tail design gaps in C++ / format layer
- Issue: [#31018](https://github.com/apache/arrow/issues/31018) — **Parquet field-level metadata support**
- Issue: [#31022](https://github.com/apache/arrow/issues/31022) — **LargeMap with 64-bit offsets**
- Issue: [#31006](https://github.com/apache/arrow/issues/31006) — **Generate YAML for Substrait extension functions/types**
- Issue: [#31008](https://github.com/apache/arrow/issues/31008) — **Timezone strings in Substrait**
- Issue: [#31007](https://github.com/apache/arrow/issues/31007) — **Dictionary encoding in Substrait**
- Issue: [#31030](https://github.com/apache/arrow/issues/31030) — **Expose MergeOptions in array Concatenate**

These older issues resurfacing through stale warnings show where Arrow still has unresolved architectural/design work. The common thread is **schema fidelity, interchange semantics, and large-scale type-system completeness**—all highly relevant for OLAP engines, query planners, and data interchange layers.

## 4) Bugs & Stability

Ranked by severity:

### 1. Critical: Undefined behavior in Parquet decoder
- Issue: [#49477](https://github.com/apache/arrow/issues/49477)
- Fix PR: [#49478](https://github.com/apache/arrow/pull/49478)

Severity: **Critical**

An OSS-Fuzz report found undefined behavior in Parquet decoding. Since this touches low-level decoding of `PLAIN BYTE_ARRAY`, the risk includes crashes, corrupted reads, or security-relevant behavior on malformed files. The good news is the fix was closed rapidly, a strong positive signal for storage-engine robustness.

### 2. High: Parquet writer regression causing floating point exception
- Issue: [#49480](https://github.com/apache/arrow/issues/49480)

Severity: **High**

A user reported a regression after upgrading from Arrow 21.0.0 to 23.0.1, where `WriteTable` / `WriteRecordBatch` causes a **floating point exception (core dumped)**. This is a serious write-path regression for Parquet workloads. No fix PR is listed in the provided data, so this remains a significant watch item.

### 3. High: Ubuntu clang / parquet fuzzing CI breakage
- Issue: [#49495](https://github.com/apache/arrow/issues/49495)
- Fix PR: [#49496](https://github.com/apache/arrow/pull/49496)

Severity: **High for CI / release engineering**

This is not a user-facing crash in production, but it affects confidence in CI and downstream packaging, especially CRAN-related validation paths. The proposed fix is small (`typename` addition), suggesting low implementation risk.

### 4. Medium: Release builds linking debug Snappy/Brotli under vcpkg multi-config
- Issue: [#49499](https://github.com/apache/arrow/issues/49499)

Severity: **Medium-High for Windows consumers**

This causes linker mismatch errors in Visual Studio / vcpkg static builds. For enterprise Windows users embedding Arrow, this is a painful integration blocker, even if not a runtime correctness issue.

### 5. Medium: Missing OpenTelemetry in `features-python-maximal`
- Issue: [#49493](https://github.com/apache/arrow/issues/49493)
- Fix PR: [#49494](https://github.com/apache/arrow/pull/49494)

Severity: **Medium**

This is mainly a build/configuration completeness issue affecting Python maximal builds. It matters because observability features are increasingly part of production analytics stacks.

### 6. Medium: Windows MinGW intermittent JSON test segfault
- PR: [#49462](https://github.com/apache/arrow/pull/49462)

Severity: **Medium**

An intermittent CI segfault in `arrow-json-test` weakens trust in the JSON reader path on one platform/toolchain combination, though this looks more like CI flakiness than a broadly reproduced production bug.

## 5) Feature Requests & Roadmap Signals

### Most notable new/active requests

#### Flight SQL protocol/API evolution
- [#49497](https://github.com/apache/arrow/issues/49497) / [#49498](https://github.com/apache/arrow/pull/49498) — add `is_update` to prepared statement result

This looks likely to land soon because it already has an accompanying PR and stems from cross-driver API compatibility needs. Expect this to appear in the next release if review proceeds smoothly.

#### ODBC distribution maturity
- [#49404](https://github.com/apache/arrow/issues/49404) — Windows MSI signing
- [#47876](https://github.com/apache/arrow/issues/47876) — macOS installer
- [#49500](https://github.com/apache/arrow/issues/49500) — SQLGetInfo boolean handling

These are strong roadmap signals that Flight SQL ODBC is moving from “functional” toward “production-distributable.” This is especially relevant for BI tools and SQL clients expecting native installer experiences.

#### Python / extension type ergonomics
- [#48746](https://github.com/apache/arrow/pull/48746) — construct `UuidArray` from extension scalars
- [#47663](https://github.com/apache/arrow/pull/47663) — optional `default_column_type` for CSV reading
- [#49355](https://github.com/apache/arrow/pull/49355) — docs for `filters_to_expression`

These improve PyArrow usability for real analytical pipelines: cleaner extension-type handling, more predictable CSV schema inference, and better expression pushdown guidance.

#### Longer-horizon format/type-system enhancements
- [#31018](https://github.com/apache/arrow/issues/31018) — field-level metadata in Parquet
- [#31022](https://github.com/apache/arrow/issues/31022) — `LargeMap`
- [#31006](https://github.com/apache/arrow/issues/31006), [#31008](https://github.com/apache/arrow/issues/31008), [#31007](https://github.com/apache/arrow/issues/31007) — Substrait integration details

These are strategically important but less likely for the immediate next version unless a champion picks them up. They require design consensus, not just implementation.

### Likely next-version candidates
Most likely to make the next release, based on current momentum:
1. [#49498](https://github.com/apache/arrow/pull/49498) — Flight SQL `is_update`
2. [#49496](https://github.com/apache/arrow/pull/49496) — clang/parquet fuzzing CI fix
3. [#49494](https://github.com/apache/arrow/pull/49494) — OpenTelemetry CMake preset update
4. [#49491](https://github.com/apache/arrow/pull/49491) — macOS protobuf discovery fix
5. Potentially [#49267](https://github.com/apache/arrow/pull/49267) — macOS ODBC test fixes

## 6) User Feedback Summary

Today’s user-visible pain points are concentrated in four areas:

### 1. Installation and trust on desktop platforms
- [#49404](https://github.com/apache/arrow/issues/49404)
- [#47876](https://github.com/apache/arrow/issues/47876)

Users need Arrow Flight SQL ODBC drivers to install cleanly on Windows and macOS. On Windows specifically, unsigned MSI artifacts trigger Defender friction, which is a real blocker for enterprise adoption.

### 2. Version upgrade regressions in Parquet write/read paths
- [#49480](https://github.com/apache/arrow/issues/49480)
- [#49477](https://github.com/apache/arrow/issues/49477)

Users continue to stress Arrow’s Parquet implementation in production-like scenarios, and regressions or decoder bugs are highly visible. The quick close on the fuzz-discovered decoder bug is reassuring; the write-path floating point exception is more concerning until resolved.

### 3. Build integration complexity
- [#49499](https://github.com/apache/arrow/issues/49499)
- [#49493](https://github.com/apache/arrow/issues/49493)
- [#49491](https://github.com/apache/arrow/pull/49491)

Consumers embedding Arrow through vcpkg, Homebrew, CMake presets, and mixed-language environments are still hitting friction. This reflects Arrow’s role as infrastructure software: correctness in package metadata and presets matters nearly as much as core APIs.

### 4. Interoperability semantics in SQL and Substrait
- [#49497](https://github.com/apache/arrow/issues/49497)
- [#31006](https://github.com/apache/arrow/issues/31006)
- [#31008](https://github.com/apache/arrow/issues/31008)
- [#31007](https://github.com/apache/arrow/issues/31007)

Users are asking Arrow to better encode execution semantics and type metadata across protocol boundaries. This is a sign that Arrow is deeply embedded in query engines and federated data systems, where interchange edge cases matter.

## 7) Backlog Watch

These items appear important and still need maintainer attention:

### Long-open issues resurfacing today
- [#31018](https://github.com/apache/arrow/issues/31018) — **Parquet field-level metadata**
  - Important for schema fidelity and metadata-preserving pipelines.
- [#31022](https://github.com/apache/arrow/issues/31022) — **LargeMap with 64-bit offsets**
  - Relevant for very large nested datasets and type completeness.
- [#31006](https://github.com/apache/arrow/issues/31006) — **Substrait extension YAML generation**
- [#31008](https://github.com/apache/arrow/issues/31008) — **Timezone strings in Substrait**
- [#31007](https://github.com/apache/arrow/issues/31007) — **Dictionary encoding in Substrait**
  - Together, these signal unfinished Arrow↔Substrait design work.
- [#30992](https://github.com/apache/arrow/issues/30992) — **Filter node performance improvements**
  - Potentially high impact for query execution performance, but currently quiet.
- [#31030](https://github.com/apache/arrow/issues/31030) — **Expose MergeOptions in array Concatenate**
  - Small surface area, potentially useful API consistency win.

### Long-running PRs that may need review bandwidth
- [#48431](https://github.com/apache/arrow/pull/48431) — **Parquet flatbuffers metadata integration**
  - Potentially significant storage-format evolution; likely needs careful design review.
- [#48539](https://github.com/apache/arrow/pull/48539) — **Windows ARM64 PyArrow support**
  - Increasingly relevant platform support.
- [#47663](https://github.com/apache/arrow/pull/47663) — **CSV `default_column_type`**
  - Pragmatic API improvement for ingestion consistency.
- [#48746](https://github.com/apache/arrow/pull/48746) — **construct arrays from extension scalars**
  - Useful ergonomics, but sitting in review.
- [#49357](https://github.com/apache/arrow/pull/49357) — **stub docstring script relocation**
  - Lower strategic weight, but helps build hygiene.

## Bottom Line

Apache Arrow is in a **healthy but infrastructure-heavy phase**: the strongest signals today are **Parquet hardening**, **Flight SQL ODBC maturity**, and **cross-platform build/package reliability**. The project is responding quickly to critical correctness issues, especially in Parquet C++, which is a positive sign for analytical storage users. At the same time, several strategically important design topics—especially around **Substrait semantics, Parquet metadata fidelity, and advanced type support**—remain stuck in the backlog and would benefit from renewed maintainer focus.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*