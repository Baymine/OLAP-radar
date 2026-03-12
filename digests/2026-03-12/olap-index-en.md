# OLAP Ecosystem Index Digest 2026-03-12

> Generated: 2026-03-12 03:16 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — OLAP Data Infrastructure Ecosystem  
**Date:** 2026-03-12

## 1. Ecosystem Overview

The OLAP data infrastructure ecosystem remains highly active, but current community activity shows a shift from headline feature launches toward **correctness, operational control, and developer ergonomics**. Across dbt-core, Spark, and Substrait, maintainers and contributors are focusing on making production workflows more reliable: better execution semantics, stronger type/function consistency, and fewer silent edge-case failures. Spark continues to drive the broadest systems-level innovation, especially around SQL execution and connector APIs, while dbt-core is evolving its authoring and orchestration semantics for analytics engineering workflows. Substrait’s lighter activity reflects its role as a specification layer, where even small function-signature issues can have outsized interoperability impact.

## 2. Activity Comparison

| Project | Updated / Notable Issues Today | Active / Notable PRs Today | Release Status Today | Activity Read |
|---|---:|---:|---|---|
| **dbt-core** | 10 highlighted issues | 10 highlighted PRs | No new release | High repository activity across parser behavior, docs/catalog, UDFs, selectors, execution UX |
| **Apache Spark** | 2 updated issues in snapshot | 10 highlighted PRs | No new release | High engineering activity, especially SQL correctness, DSv2, CDC, Arrow, PySpark |
| **Substrait** | 1 updated issue | 0 PRs | No new release | Light activity; focused on spec completeness and type consistency |

## 3. Shared Feature Directions

### A. **Correctness and semantic consistency**
- **Projects:** Spark, dbt-core, Substrait
- **Specific needs:**
  - **Spark:** fixing wrong-result behavior in dedup with SPJ partial clustering.
  - **dbt-core:** clarifying duplicate data test semantics, fixing parse/render inconsistencies, improving compile behavior consistency across resource types.
  - **Substrait:** filling type coverage gaps in built-in function signatures such as `sqrt`.
- **Why this matters:** communities are prioritizing trust in output and predictable semantics over purely additive features.

### B. **Better support for advanced production workflows**
- **Projects:** dbt-core, Spark
- **Specific needs:**
  - **dbt-core:** microbatch rerun control, downstream continuation on model failure, applied-state progress.
  - **Spark:** CDC APIs, partition-stat filtering, planner behavior for modern lakehouse execution.
- **Why this matters:** users increasingly need systems that support partial reruns, incremental change processing, and resilient large-scale operations.

### C. **Developer ergonomics and usability**
- **Projects:** dbt-core, Spark, Substrait
- **Specific needs:**
  - **dbt-core:** selector composition, local package install modes, macro testing, source/docs configurability.
  - **Spark:** simpler and faster Python/Arrow paths, NumPy/ArrayType support, SQL function usability.
  - **Substrait:** more complete and intuitive numeric type support to reduce unnecessary casts.
- **Why this matters:** productivity improvements are now closely tied to adoption, especially for teams managing complex data platforms.

### D. **Metadata, interface, and interoperability improvements**
- **Projects:** dbt-core, Spark, Substrait
- **Specific needs:**
  - **dbt-core:** docs/catalog reliability, schema sync, richer metadata configs.
  - **Spark:** richer DSv2 connector contracts and SQL interfaces such as `CHANGES`.
  - **Substrait:** more complete function spec behavior for cross-engine portability.
- **Why this matters:** the ecosystem is increasingly integrated, so interface quality and compatibility are becoming strategic concerns.

## 4. Differentiation Analysis

### dbt-core
- **Scope:** analytics engineering framework for transformation, testing, documentation, and project execution semantics.
- **Target users:** analytics engineers, data platform teams, dbt package authors, governance/documentation stakeholders.
- **Technical approach:** declarative project configuration and DAG-driven SQL transformation, with growing focus on execution controls and first-class support for additional resource types like functions/UDFs.
- **Current emphasis:** test semantics, docs/catalog edge cases, UDF parity, selector/package UX, and production execution flexibility.

### Apache Spark
- **Scope:** general-purpose distributed compute engine spanning SQL, batch, streaming, connectors, and Python/JVM execution.
- **Target users:** data engineers, platform engineers, lakehouse teams, ML/data processing teams, connector developers.
- **Technical approach:** optimizer- and runtime-centric evolution with deep investment in SQL planner correctness, DataSource V2 APIs, vectorized execution, and Python interoperability.
- **Current emphasis:** correctness in advanced planning paths, expression/runtime performance, CDC support, and Arrow/PySpark quality.

### Substrait
- **Scope:** cross-engine query plan and function specification standard.
- **Target users:** engine implementers, interoperability platform teams, connector/query engine authors.
- **Technical approach:** specification-first standardization of function semantics, types, and portable plan representation.
- **Current emphasis:** function signature completeness and type consistency rather than end-user workflow features.

## 5. Community Momentum & Maturity

- **Most active broad engineering motion:** **Apache Spark**  
  Spark shows the strongest systems-level momentum, with active PRs spanning correctness fixes, new SQL capabilities, connector evolution, approximate analytics, and Python runtime improvements. Its community appears highly mature, with simultaneous work on bug fixes, benchmarks, APIs, and backports.

- **Most active analytics-engineering workflow iteration:** **dbt-core**  
  dbt-core has strong issue and PR visibility around practical user pain points. Its community is iterating rapidly on semantics that matter directly to modern analytics teams: test behavior, docs fidelity, UDF support, package handling, and fault-tolerant execution.

- **Most stable/spec-oriented pace:** **Substrait**  
  Substrait’s lower volume is consistent with a standards-layer project. Momentum is lighter, but individual issues can be strategically important because they affect portability and consistency across multiple engines.

- **Maturity signal by project type:**  
  - **Spark:** mature platform with ongoing high-throughput innovation.
  - **dbt-core:** mature but still actively expanding its control surface for production analytics engineering.
  - **Substrait:** maturing specification ecosystem where completeness and precision matter more than raw volume.

## 6. Trend Signals

### 1. **Correctness is a top priority again**
Communities are reacting strongly to silent wrong-result risks and semantic ambiguity. For data engineers, this is a reminder to validate advanced optimizer paths, test dedup logic carefully, and watch release notes for behavior changes that affect trust in outputs.

### 2. **Operational control is becoming a key differentiator**
dbt-core requests around microbatch control and failure handling, alongside Spark’s CDC and connector-planning work, show that users want more precise execution behavior. This is highly relevant for teams running cost-sensitive incremental pipelines and recovery workflows.

### 3. **Lakehouse-native connector capabilities are still expanding**
Spark’s DSv2 and CDC work signals that connector contracts remain an active battleground. For platform teams, this means source/table format choice still materially affects feature availability, performance, and correctness.

### 4. **Python and semi-structured data remain major pressure points**
Spark’s map lookup optimization and Arrow/PySpark work indicate continued demand from teams processing nested, sparse, and Python-heavy workloads. Data engineers should expect ongoing gains here, but also continued complexity in memory behavior and execution internals.

### 5. **Metadata and documentation quality are moving closer to production-critical**
dbt-core’s docs/catalog and source metadata work shows that documentation artifacts are no longer treated as secondary. For governed analytics environments, metadata reliability increasingly affects developer trust, lineage workflows, and self-service adoption.

### 6. **Interoperability depends on small specification details**
Substrait’s `sqrt` type gap is a useful signal: standardization work often advances through seemingly minor edge cases. For teams investing in portable plans or multi-engine architectures, these details are worth tracking because they influence actual cross-engine compatibility.

If you want, I can also convert this into:
- a **1-page executive briefing**,
- a **Slack/Teams update**, or
- a **machine-readable JSON comparison**.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-03-12

## Today's Highlights
dbt-core had no new releases in the last 24 hours, but repository activity was strong around parser behavior, docs/catalog edge cases, UDF ergonomics, and selector/package UX. The most notable signals today are a fresh debate on duplicate data tests, progress on fixing case-sensitive catalog collisions in `dbt docs generate`, and continued community contributions that extend selectors, docs configs, and source definitions.

## Hot Issues

1. **Unit test support for macros** — [#10547](https://github.com/dbt-labs/dbt-core/issues/10547)  
   This remains one of the more visible feature requests, with **20 👍 reactions** and steady discussion. It matters because macros are central to reusable dbt logic, yet they still lack first-class unit testing support, creating a testing gap for teams building complex package ecosystems and adapter-specific abstractions.

2. **Applied State (part 2)** — [#9425](https://github.com/dbt-labs/dbt-core/issues/9425)  
   This epic was updated and is now **closed**, signaling progress on dbt’s broader effort to improve visibility into actual warehouse state in a performant way. Even without a lot of reaction volume, this is strategically important for state-aware builds, deferral workflows, and future orchestration efficiency.

3. **Interactive compile should include compiled snapshot code** — [#7867](https://github.com/dbt-labs/dbt-core/issues/7867)  
   This older issue was also **closed**, reflecting movement on long-standing consistency problems in compile behavior. It matters for developers who inspect generated SQL during debugging and CI, especially when snapshots behave differently from models and tests.

4. **Configure microbatch models to process relative batches** — [#11242](https://github.com/dbt-labs/dbt-core/issues/11242)  
   This request points to a growing need for more operational control over incremental and microbatch execution. The feature would help teams rerun targeted windows of data more flexibly, which is especially relevant for late-arriving events, backfills, and cost-controlled recovery workflows.

5. **Add `grants` and `post/pre-hook`s to functions** — [#12536](https://github.com/dbt-labs/dbt-core/issues/12536)  
   UDF/function support continues to mature, and this request highlights current config gaps versus models. The ask matters because teams increasingly want to manage functions as first-class dbt resources, including permissions and operational hooks, rather than treating them as second-tier artifacts.

6. **Support PyPI packages for Python UDFs** — [#12041](https://github.com/dbt-labs/dbt-core/issues/12041)  
   This issue was **closed**, and the outcome is notable: package support was effectively already available via shared config behavior. That suggests some friction now lies less in implementation and more in discoverability and documentation for new UDF capabilities.

7. **`dbt docs generate` fails when object names differ only by case** — [#11776](https://github.com/dbt-labs/dbt-core/issues/11776)  
   This bug matters for warehouses and naming conventions where case-sensitive or quoted identifiers are common. It directly impacts metadata generation and catalog reliability, which can break docs workflows even when builds themselves succeed.

8. **Applied State (part 1)** — [#8316](https://github.com/dbt-labs/dbt-core/issues/8316)  
   This earlier epic was also **closed**, reinforcing that applied-state work is moving from broad planning into completed milestones and follow-on implementation. For advanced teams, this is one of the more meaningful long-term architecture threads in dbt-core.

9. **Allow data tests to be duplicated or not** — [#12643](https://github.com/dbt-labs/dbt-core/issues/12643)  
   Opened yesterday, this issue raises an important parser and semantics question: should duplicate data tests be permitted? It matters because duplicate test definitions can be accidental noise or intentional behavior depending on project patterns, and dbt will need to clarify expected guarantees around test uniqueness.

10. **Microbatch and execution-control demand continues to surface** — [#11242](https://github.com/dbt-labs/dbt-core/issues/11242)  
   Worth calling out again as a trend signal: requests are increasingly about *operational precision*, not just model authoring. The community reaction here suggests users want dbt-core to expose more explicit execution controls for production-scale incremental pipelines.

## Key PR Progress

1. **Selector-as-selector-method implementation** — [#12582](https://github.com/dbt-labs/dbt-core/pull/12582)  
   This is a meaningful UX enhancement: selectors would become composable selector methods instead of only top-level CLI/default constructs. If merged, it would make node selection far more expressive for complex project automation and reusable selection logic.

2. **Fix list-type metric filters rendered at parse time** — [#12634](https://github.com/dbt-labs/dbt-core/pull/12634)  
   This PR was **closed** after addressing a parser/rendering bug affecting v2 metrics under `models:`. It’s a good example of dbt tightening schema rendering boundaries so semantic-layer-like configs don’t get evaluated too early.

3. **Add docs config for sources** — [#12646](https://github.com/dbt-labs/dbt-core/pull/12646)  
   Newly opened and community-authored, this would extend docs configurability to sources. That’s useful for teams investing in richer generated documentation and more consistent metadata management across all resource types.

4. **Avoid false positive `AmbiguousCatalogMatchError` for case-only differences** — [#12644](https://github.com/dbt-labs/dbt-core/pull/12644)  
   This is the active fix for issue #11776 and one of today’s more practical PRs. It targets docs/catalog generation in environments where object names differ only by case, reducing friction in mixed-quoting warehouses.

5. **Update test durations via PR flow** — [#12631](https://github.com/dbt-labs/dbt-core/pull/12631)  
   This internal tooling improvement matters because it adapts maintenance automation to branch protections. It shows dbt-core maintainers are hardening repository operations, not just product features.

6. **Sync JSON schemas from dbt-fusion** — [#12640](https://github.com/dbt-labs/dbt-core/pull/12640)  
   This PR keeps dbt-core JSON schemas aligned with the newer fusion-side definitions. It’s important as an interoperability and consistency signal, especially for editors, validation tooling, and future config surface expansion.

7. **Write compiled SQL for snapshots during `dbt compile`** — [#12568](https://github.com/dbt-labs/dbt-core/pull/12568)  
   Now **closed**, this resolves a long-standing inconsistency where snapshots were missing from normal compiled output. That should improve debugging parity and make artifact inspection more predictable.

8. **Python UDF package tests** — [#12633](https://github.com/dbt-labs/dbt-core/pull/12633)  
   This closed PR confirmed that `packages` are already specifiable for Python UDFs. The practical takeaway is that recent UDF capabilities may be broader than many users realize, but the docs/discoverability story still needs attention.

9. **Allow installing local packages with deepcopy** — [#12524](https://github.com/dbt-labs/dbt-core/pull/12524)  
   This open PR adds explicit control over local package installation behavior. It matters for teams working across filesystems, containers, CI, and monorepos where symlink-based installs can be fragile or undesirable.

10. **Allow continuing downstream models on model error** — [#12483](https://github.com/dbt-labs/dbt-core/pull/12483)  
   One of the more operationally significant open PRs, this proposes configurable `on_error` behavior so children can continue even if a parent fails. If accepted, it would materially change run semantics for resilient pipelines and partial DAG completion strategies.

## Feature Request Trends

- **More first-class testing primitives**  
  Macro unit testing remains a clear unmet need, and the new duplicate-data-test discussion shows users want dbt to be more explicit about test semantics and test ergonomics.

- **Greater operational control over execution**  
  Requests around microbatch relative-batch selection and downstream continuation after model failure point to demand for more granular, production-friendly run behavior.

- **UDFs/functions becoming first-class dbt resources**  
  Community asks increasingly focus on parity features for functions: hooks, grants, package dependencies, and better surrounding documentation.

- **Richer metadata and docs configuration**  
  Source docs config, source-definition enhancements, and catalog edge-case fixes all indicate heavy interest in documentation fidelity and resource metadata consistency.

- **More expressive project/package/selector configuration**  
  Selector composition, local package install modes, and schema/config expansion suggest users want more modular and controllable project authoring patterns.

## Developer Pain Points

- **Inconsistent behavior across resource types**  
  Snapshots, functions, metrics, and sources still expose edge cases where behavior differs from models in ways that surprise users.

- **Parser/rendering ambiguity**  
  Several updates reflect friction around when dbt should render or validate YAML/config content, especially for advanced resource definitions.

- **Docs/catalog fragility in real-world naming environments**  
  Case sensitivity and quoting continue to trip up `dbt docs generate`, which is painful for enterprise warehouses with mixed identifier conventions.

- **Operational workflows need finer controls**  
  Teams want dbt-core to better support partial reruns, backfills, selective batch processing, and fault-tolerant DAG execution.

- **Discoverability lags implementation**  
  The Python UDF packages issue is a good example: capability existed, but users still opened issues because the behavior was not obvious enough from docs or UX.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-12

## 1. Today's Highlights

Apache Spark saw no new releases in the last 24 hours, but activity concentrated around SQL correctness, connector evolution, and Python/runtime quality. The most notable themes were a deduplication correctness bug tied to Storage-Partitioned Join partial clustering, a push to speed up large-map lookups in SQL expressions, and continued investment in DataSource V2, CDC, Arrow, and PySpark ergonomics.

## 3. Hot Issues

> Note: only 2 issues were updated in the last 24 hours from the provided dataset, so this section includes all currently active noteworthy items available in the snapshot.

1. **[Issue #54378](https://github.com/apache/spark/issues/54378) — [SQL] dropDuplicates and Window dedup produce incorrect results with SPJ partiallyClusteredDistribution**  
   This is the most critical issue in the current feed because it is a **correctness bug**, not just a performance regression. It reports that `dropDuplicates()` and `row_number()`-based dedup can return wrong results when Storage-Partitioned Join is used with `partiallyClusteredDistribution` enabled, which directly affects trust in query output for modern lakehouse workloads.  
   **Why it matters:** incorrect deduplication can silently corrupt downstream analytics and ETL pipelines.  
   **Community reaction:** moderate discussion so far (7 comments), with clear follow-up in an associated fix PR, indicating maintainers are treating it seriously.

2. **[Issue #54646](https://github.com/apache/spark/issues/54646) — Spark map lookup is O(n)**  
   This issue highlights a practical SQL/runtime performance bottleneck: map access on very large maps degrades due to linear scanning. For users working with semi-structured data or large map-typed columns, this can become a severe CPU hotspot.  
   **Why it matters:** large-scale lookup-heavy queries can suffer major slowdowns, especially in data engineering pipelines using map columns as sparse dictionaries or feature stores.  
   **Community reaction:** still early (5 comments), but the issue already triggered an optimization PR, suggesting strong alignment between user pain and contributor response.

## 4. Key PR Progress

1. **[PR #54748](https://github.com/apache/spark/pull/54748) — [SPARK-55959][SQL] Optimize Map Key Lookup for `GetMapValue` and `ElementAt`**  
   This is the clearest response to the map lookup performance issue. The proposal introduces a **hash-based lookup path for large maps**, replacing repeated linear scans in expressions like `map['key']` and `element_at`.  
   **Why it matters:** potentially meaningful CPU savings for SQL workloads over complex or semi-structured columns.

2. **[PR #54751](https://github.com/apache/spark/pull/54751) — [SPARK-55848][SQL][4.1] Fix incorrect dedup results with SPJ partial clustering**  
   This PR backports a fix for the dedup correctness issue to the 4.1 branch. It adjusts partitioning semantics around partially clustered distributions so Spark no longer incorrectly assumes a distribution satisfies dedup requirements.  
   **Why it matters:** this is a high-priority stability fix for users of SPJ and Iceberg-style partition-aware query plans.

3. **[PR #54738](https://github.com/apache/spark/pull/54738) — [SPARK-55948][SQL] Add DSv2 CDC connector API, analyzer resolution, and SQL `CHANGES` clause**  
   A major feature PR that pushes Spark toward native **change data capture** support in DataSource V2. It introduces connector-side CDC interfaces plus SQL syntax for consuming row-level changes.  
   **Why it matters:** strategically important for lakehouse ingestion, incremental ETL, and interoperability with modern table formats and CDC-capable systems.

4. **[PR #54745](https://github.com/apache/spark/pull/54745) — [SPARK-55939][SQL] Add built-in DataSketches ItemsSketch (Frequent Items) functions**  
   This adds built-in SQL functions for **frequent item / heavy hitter** analytics using Apache DataSketches ItemsSketch.  
   **Why it matters:** expands Spark SQL’s approximate analytics toolkit for streaming, telemetry, and high-cardinality summarization workloads.

5. **[PR #54459](https://github.com/apache/spark/pull/54459) — [SPARK-55596][SQL] DSV2 Enhanced Partition Stats Filtering**  
   This PR improves partition pruning/filtering for DataSource V2 sources that expose partition statistics.  
   **Why it matters:** better stats-aware filtering can reduce scan costs and improve query planning efficiency for modern connectors.

6. **[PR #54689](https://github.com/apache/spark/pull/54689) — [SPARK-55890] Check arrow memory at end of tests**  
   Focused on detecting and preventing **Arrow off-heap memory leaks**, especially in Spark Connect-related tests.  
   **Why it matters:** memory leak prevention is essential for long-running services and for maintaining confidence in Arrow-based execution paths.

7. **[PR #54705](https://github.com/apache/spark/pull/54705) — [SPARK-55902][PYTHON] Refactor SQL_ARROW_BATCHED_UDF to use ArrowStreamSerializer**  
   This refactors Arrow-based batched UDF handling in PySpark to separate I/O serialization from conversion logic more cleanly.  
   **Why it matters:** improves maintainability and may reduce fragility in Python execution internals, especially around Arrow interoperability.

8. **[PR #54743](https://github.com/apache/spark/pull/54743) — [SPARK-55947][PYTHON] Add ASV micro-benchmarks for grouped map Arrow UDF eval types**  
   Adds ASV micro-benchmarks for grouped map Arrow UDF variants.  
   **Why it matters:** benchmark coverage is a prerequisite for improving Python UDF performance without regressions; this is infrastructure work that enables safer optimization.

9. **[PR #54143](https://github.com/apache/spark/pull/54143) — [SQL, PYTHON] [SPARK-55324][PYTHON]: Make convert_numpy support ArrayType**  
   Extends NumPy conversion support to Spark `ArrayType`.  
   **Why it matters:** improves PySpark usability and closes a common impedance mismatch between Python-native structures and Spark schemas.

10. **[PR #54676](https://github.com/apache/spark/pull/54676) — [SPARK-55557][SQL] Hyperbolic functions should not overflow with large inputs**  
   Fixes numerical overflow behavior in `asinh` and `acosh` for large values.  
   **Why it matters:** strengthens correctness for scientific, statistical, and ML-adjacent SQL workloads where edge-case numerical stability matters.

## 5. Feature Request Trends

Based on the current issue and PR flow, the strongest feature directions are:

- **Better performance for complex data types and expressions**  
  The map lookup issue and its linked optimization PR show demand for making Spark SQL more efficient on nested and semi-structured data.

- **Deeper DataSource V2 capabilities**  
  Work on CDC APIs and partition-stats filtering points to continued demand for richer connector contracts, better pushdown, and more lakehouse-native behavior.

- **Expanded built-in analytics primitives**  
  The DataSketches ItemsSketch work suggests users want more approximate and probabilistic functions directly in SQL rather than relying on external libraries.

- **Stronger PySpark and Arrow integration**  
  Multiple PRs target Arrow UDF execution, benchmarks, type hints, NumPy conversion, and compatibility checks, reflecting steady demand for better Python ergonomics and performance.

- **Improved correctness guarantees in advanced planning paths**  
  The SPJ dedup bug underscores the need for cautious evolution of optimizer/distribution-aware features, especially where new physical planning behaviors interact with semantic operators.

## 6. Developer Pain Points

Recurring frustrations visible in this snapshot include:

- **Silent correctness risks in advanced optimizer features**  
  The SPJ partial clustering bug is especially painful because it can produce wrong answers without obvious failure signals.

- **Performance cliffs for large in-memory structures**  
  Large map lookups being effectively O(n) is exactly the kind of hidden implementation detail that surprises production users at scale.

- **Complexity around Arrow memory and Python execution paths**  
  Several PRs indicate ongoing developer burden around leak detection, serializer design, and UDF performance validation.

- **Type-system and API polish gaps in PySpark**  
  Type hints, NumPy conversion behavior, Connect dataframe conversion, and pandas version handling all point to friction in day-to-day Python development.

- **Connector evolution still requires substantial plumbing**  
  CDC support and partition-stat filtering are valuable, but the amount of API/analyzer work involved shows that advanced source capabilities remain an active integration challenge.

If you'd like, I can also turn this into a **newsletter-style version**, a **Slack-ready summary**, or a **JSON digest schema** for automation.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait Community Digest — 2026-03-12

## 1. Today's Highlights
Activity was light in the last 24 hours, with no new releases or pull requests in the Substrait repository. The main update is a new issue reporting a type coverage gap in the `sqrt` function signature, where smaller integer types (`i8`, `i16`, `i32`) are currently unsupported despite `i64` being accepted.

This matters because function signature consistency and type coercion behavior are central to interoperability across engines implementing the Substrait specification.

## 3. Hot Issues

### 1) `sqrt` does not support integers smaller than `i64`
- **Issue:** [#1003](https://github.com/substrait-io/substrait/issues/1003)
- **Status:** Open
- **Author:** @mbwhite
- **Why it matters:** This issue points to a likely inconsistency in scalar function definitions: `sqrt` accepts `i64` but excludes `i8`, `i16`, and `i32`. For implementers, such omissions can create unnecessary casting requirements, divergent engine behavior, and friction in query plan portability.
- **Community reaction:** Early-stage only so far, with no comments or reactions yet, but it surfaces a concrete spec ergonomics problem that could affect multiple consumers.

## 5. Feature Request Trends
With only one newly updated issue in the period, the clearest emerging direction is **better completeness and consistency in function type signatures**. In practice, implementers appear to expect scalar functions like `sqrt` to either:
- support the full family of relevant numeric input types, or
- define predictable coercion/promotion rules across integer widths.

This suggests ongoing value in tightening function specification coverage, especially where minor type mismatches can lead to cross-engine incompatibilities.

## 6. Developer Pain Points
A visible pain point from today’s activity is **unexpected type restrictions in built-in function definitions**. For engine authors and integrators, gaps like missing `i8`/`i16`/`i32` support in `sqrt` can force ad hoc casts or custom compatibility layers, undermining the goal of a clean, portable intermediate representation.

More broadly, this kind of issue usually signals demand for:
- clearer numeric type promotion rules,
- more exhaustive function signature matrices,
- and stronger validation that function definitions behave consistently across related input types.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*