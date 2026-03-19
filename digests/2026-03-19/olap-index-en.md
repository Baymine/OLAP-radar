# OLAP Ecosystem Index Digest 2026-03-19

> Generated: 2026-03-19 01:25 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project OLAP Infrastructure Comparison Report — 2026-03-19

## 1. Ecosystem Overview
The current OLAP infrastructure landscape shows healthy activity across three layers of the stack: transformation orchestration (dbt-core), distributed execution and query processing (Apache Spark), and interoperable plan/specification standards (Substrait). Community work is concentrated less on headline releases and more on correctness, usability, performance, and semantic consistency. Across projects, maintainers are tightening edge-case behavior in parsing, typing, optimizer logic, and execution semantics—an indicator of ecosystem maturation. For technical teams, this suggests the market is moving from feature expansion alone toward production hardening and cross-engine interoperability.

## 2. Activity Comparison

| Project | Updated Issues Today | PRs Highlighted | Release Status Today |
|---|---:|---:|---|
| dbt-core | 10 | 10 | No release noted |
| Apache Spark | 1 | 10 | No new releases |
| Substrait | 0 | 10 | No release noted |

### Observations
- **dbt-core** shows the broadest visible issue churn, especially around parser/runtime correctness, catalog integration, and test semantics.
- **Spark** has lower issue visibility today but strong PR throughput, indicating active implementation work despite limited issue updates.
- **Substrait** is currently PR-led, with work concentrated in specification refinement rather than user-reported issue traffic.

## 3. Shared Feature Directions

### A. Stronger correctness and semantic consistency
- **Projects:** dbt-core, Spark, Substrait
- **Specific needs:**
  - **dbt-core:** parser hardening, partial parsing correctness, state-based CI accuracy, duplicate test semantics
  - **Spark:** CBO stats propagation, typed partition reducers, schema inference correctness, TLS leak fix
  - **Substrait:** nullability/type binding clarification, return type corrections, explicit window semantics
- **Interpretation:** All three communities are prioritizing deterministic behavior over permissive or ambiguous behavior.

### B. Better developer ergonomics and faster feedback loops
- **Projects:** dbt-core, Spark
- **Specific needs:**
  - **dbt-core:** batch reporting of validation errors, clearer config/deprecation warnings, more composable selectors
  - **Spark:** faster PySpark import/startup, cleanup of Python interop behavior
- **Interpretation:** Developer productivity is now a first-class concern, especially in CI and interactive workflows.

### C. Improved interoperability across systems and abstractions
- **Projects:** dbt-core, Spark, Substrait
- **Specific needs:**
  - **dbt-core:** uniform `catalogs.yml` support across commands, Core/Fusion parity
  - **Spark:** CDC API support, Arrow/pandas interoperability cleanup, dependency compatibility concerns
  - **Substrait:** valid URN clarification, physical operator coverage, extension schema improvements
- **Interpretation:** Cross-system portability is increasingly important, whether at the metadata layer, API layer, or plan/spec layer.

### D. Expansion of advanced analytical semantics
- **Projects:** Spark, Substrait
- **Specific needs:**
  - **Spark:** CDC queries, geospatial SRID support, semi-structured schema inference improvements
  - **Substrait:** new built-in functions, execution-context functions, `TopNRel`, richer type-system support
- **Interpretation:** The ecosystem continues to broaden beyond core SQL into richer analytical and execution semantics.

## 4. Differentiation Analysis

### dbt-core
- **Scope:** Analytics engineering framework for transformation, testing, selection, and deployment workflows.
- **Target users:** Analytics engineers, BI/data teams, platform teams operating transformation CI/CD.
- **Technical approach:** Declarative modeling plus compile-time graph construction, with strong emphasis on configs, parsers, and state-aware execution.
- **Current focus:** Reliability of developer workflows—parsing, selectors, tests, catalog-aware commands, and Core/Fusion consistency.

### Apache Spark
- **Scope:** General-purpose distributed compute and SQL engine spanning batch, streaming, Python APIs, and optimizer/runtime internals.
- **Target users:** Data engineers, platform engineers, ML/data science users, lakehouse operators.
- **Technical approach:** Large-scale execution engine with optimizer-driven planning and broad API surface across JVM, SQL, Python, and Connect.
- **Current focus:** Runtime efficiency, SQL planning quality, Python ergonomics, and production reliability.

### Substrait
- **Scope:** Cross-engine query/plan and function specification standard.
- **Target users:** Engine implementers, query framework authors, interoperability platform teams, standards-minded ecosystem builders.
- **Technical approach:** Formal spec and protobuf/YAML-based semantic definitions rather than end-user execution tooling.
- **Current focus:** Tightening spec precision—nullability, type rules, URNs, physical operators, and standardized function behavior.

## 5. Community Momentum & Maturity

### Most active user-facing community: dbt-core
dbt-core shows the highest visible mix of issue and PR activity, with many reports tied directly to production workflows. This typically signals a large and highly engaged practitioner base. The issues are concrete and workflow-oriented, suggesting a mature product under heavy real-world use.

### Strong implementation momentum: Apache Spark
Spark’s visible activity today is PR-heavy rather than issue-heavy. That pattern often reflects a mature project with established contribution pipelines and ongoing subsystem optimization. The breadth of work—from PySpark imports to SQL stats and streaming internals—shows deep, continuous iteration across a very large codebase.

### Rapid spec refinement with narrower community surface: Substrait
Substrait appears highly active at the specification layer, even without updated issues. Its momentum is strongest among implementers and standards contributors rather than broad end-user traffic. This is characteristic of an earlier-stage but strategically important interoperability project moving quickly to close semantic gaps.

### Maturity summary
- **Most operationally mature:** Spark
- **Most workflow-mature and end-user pressured:** dbt-core
- **Most rapidly evolving specification layer:** Substrait

## 6. Trend Signals

### 1. Correctness is becoming a competitive differentiator
Communities are investing in parser resilience, optimizer accuracy, nullability/type precision, and deterministic test behavior. For data engineers, this means vendor/project evaluation should increasingly include edge-case correctness, not just feature coverage.

### 2. Interoperability is moving up the stack
The emphasis on catalog integration, CDC APIs, Arrow/pandas cleanup, URN clarity, and plan portability points to a more composable data ecosystem. Teams building multi-engine platforms should expect interoperability quality to become a major selection criterion.

### 3. Developer experience is now infrastructure work
dbt selector composition, bulk validation feedback, and PySpark startup improvements all point to the same pattern: time-to-feedback matters. This has practical value for engineering productivity, CI efficiency, and local development loops.

### 4. Specification rigor is increasingly important
Substrait’s work on explicit semantics mirrors similar concerns in dbt and Spark around ambiguity reduction. For teams standardizing internal platforms, clearer semantics reduce migration risk and improve cross-tool consistency.

### 5. Advanced semantics are expanding beyond traditional SQL warehousing
CDC, geospatial types, execution-context functions, richer collection functions, and physical top-N operators all suggest that OLAP infrastructure is absorbing more real-time, domain-specific, and execution-aware requirements.

## Bottom Line for Data Engineers
- **Choose dbt-core** when transformation workflow quality, CI behavior, and model/test ergonomics are primary.
- **Choose Spark** when distributed execution breadth, SQL/runtime capability, and multi-modal processing matter most.
- **Track Substrait closely** if interoperability, engine-neutral planning, or long-term platform portability are strategic priorities.

If you want, I can also turn this into:
1. a **one-slide executive summary**,  
2. a **CTO-style investment/risk memo**, or  
3. a **scored comparison matrix** for architecture decisions.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-03-19

## Today's Highlights
dbt-core activity over the last day centered on parser/runtime correctness and catalog integration support, especially around commands that were missing `@requires.catalogs`. The most notable community-visible change is continued follow-through on Snowflake/custom catalog integration bugs, alongside a meaningful selector usability improvement that closes a long-running request. Unit test behavior, partial parsing, and config validation remain active pain points.

## Hot Issues

1. **Collect all `NoNodeForYamlKey` errors under `--warn-error-options`**  
   Issue: [#12339](https://github.com/dbt-labs/dbt-core/issues/12339)  
   This open enhancement asks dbt-core to report all YAML-node mismatch errors rather than stopping at the first one when warnings are escalated to errors. It matters for large projects because CI cleanup becomes iterative and slow if teams can only fix one YAML issue per run. Community reaction is still light, but this is the kind of workflow polish that strongly affects enterprise adoption.

2. **Disabled models still error during Core parse**  
   Issue: [#11948](https://github.com/dbt-labs/dbt-core/issues/11948)  
   The report highlights a Core/Fusion inconsistency: Fusion parses a disabled Zendesk package model cleanly, while Core still raises a compilation error. This matters because package consumers expect disabled resources to disappear cleanly from graph validation. The issue being open and recently updated suggests the compatibility gap is still unresolved.

3. **Duplicate row detected during incremental DML**  
   Issue: [#10432](https://github.com/dbt-labs/dbt-core/issues/10432)  
   Although now closed/stale, this bug reflects ongoing sensitivity around incremental models sourced from ephemeral chains and unique key enforcement. Incremental correctness is one of the highest-risk operational areas in dbt projects, so even closed reports like this shape how teams evaluate merge semantics and adapter behavior. Limited community response suggests it may be environment-specific, but the underlying theme remains important.

4. **`dbt test` failing with AWS Glue Catalog Integration in Snowflake**  
   Issue: [#12662](https://github.com/dbt-labs/dbt-core/issues/12662)  
   This issue was closed quickly after identifying that `dbt test` lacked the catalog decorator required for custom catalog integrations. It matters because dbt-core is still extending catalog-aware behavior beyond `run/build`, and every missed subcommand becomes a production paper cut. The fast turnaround shows strong maintainer responsiveness.

5. **`dbt run --empty` creating empty tables during unit test schema evolution**  
   Issue: [#12658](https://github.com/dbt-labs/dbt-core/issues/12658)  
   This was closed as `wontfix`, but it surfaces a real tension between schema evolution workflows and safe CI behavior. Teams using unit-test fixtures want lightweight metadata updates without side effects on upstream consumers. The closure suggests users may need stronger environment isolation rather than relying on `--empty` semantics.

6. **Unit tests with duplicate names break under multithreading**  
   Issue: [#12665](https://github.com/dbt-labs/dbt-core/issues/12665)  
   This open bug points to thread-safety or scheduling assumptions when unit test names are not globally unique. It matters because parallelization is standard in CI, and naming collisions should ideally fail deterministically or be disallowed explicitly. Even with few comments, this is a good example of correctness issues appearing only at scale.

7. **Allow or forbid duplicate data tests consistently**  
   Issue: [#12643](https://github.com/dbt-labs/dbt-core/issues/12643)  
   This triage issue asks for a product decision: should duplicate data tests be supported or rejected? The ambiguity matters because partial support creates subtle graph and execution edge cases, especially after prior changes enabled duplicates. It is less about one bug and more about defining contract semantics for test identity.

8. **`state:modified` misses YAML property changes for functions**  
   Issue: [#12547](https://github.com/dbt-labs/dbt-core/issues/12547)  
   This open, backport-targeted bug affects slim CI and state-based builds for `resource_type:function`. If YAML metadata changes are not detected, deployments can silently skip needed updates. The backport label indicates maintainers see this as important for current stable users.

9. **Custom `ref` overrides ignored in unit tests and generic data tests**  
   Issue: [#12148](https://github.com/dbt-labs/dbt-core/issues/12148)  
   This issue exposes another Core/Fusion discrepancy: Fusion respects custom `ref` overrides with kwargs in tests, while Core fails. It matters for advanced macro customization and adapter abstractions, especially in organizations with custom lineage/versioning patterns. Momentum is increasing because there is now an active PR.

10. **Partial parsing drops versioned model nodes after `schema.yml` changes**  
    Issue: [#12666](https://github.com/dbt-labs/dbt-core/issues/12666)  
    This fresh bug is important because partial parsing is critical to developer productivity, but correctness regressions can make it dangerous in dbt Cloud. Losing a versioned model node after a YAML edit is the kind of non-obvious graph corruption that undermines trust. Early attention here will be important.

## Key PR Progress

1. **Selector method implementation closes a long-standing UX gap**  
   PR: [#12582](https://github.com/dbt-labs/dbt-core/pull/12582)  
   This closed PR implements a `selector:` selector method so YAML selectors can be combined directly with CLI selection logic. It resolves both [#5009](https://github.com/dbt-labs/dbt-core/issues/5009) and [#10992](https://github.com/dbt-labs/dbt-core/issues/10992), making selector composition much more flexible for real-world workflows.

2. **Backport: add `@requires.catalogs` to `test` command**  
   PR: [#12676](https://github.com/dbt-labs/dbt-core/pull/12676)  
   This closed backport carries the custom-catalog fix into the 1.11 line. It is directly relevant for Snowflake users with AWS Glue or other catalog-linked integrations and reduces command-to-command inconsistency.

3. **Original fix for catalog-aware `dbt test`**  
   PR: [#12663](https://github.com/dbt-labs/dbt-core/pull/12663)  
   The original community PR added the missing decorator to `test`, fixing failures where `catalogs.yml` integrations were ignored. This is a small code change with outsized impact because it restores parity with commands like `run`, `build`, and `snapshot`.

4. **Backport: add `@requires.catalogs` to `compile`**  
   PR: [#12675](https://github.com/dbt-labs/dbt-core/pull/12675)  
   This closed backport extends the same catalog-awareness fix to `compile`, preventing failures on REST/catalog-linked database setups. Together with the test fix, it shows dbt-core is systematically closing gaps in catalog support.

5. **Original `compile` catalog support fix**  
   PR: [#12388](https://github.com/dbt-labs/dbt-core/pull/12388)  
   This earlier closed PR fixed `dbt compile` for catalog-linked databases and is now being propagated via backports. It is a strong sign that catalog abstractions are becoming first-class across more of the command surface.

6. **Support custom `ref` kwargs in unit and generic data tests**  
   PR: [#12668](https://github.com/dbt-labs/dbt-core/pull/12668)  
   This open PR addresses [#12148](https://github.com/dbt-labs/dbt-core/issues/12148) by aligning Core with Fusion on custom `ref` behavior in tests. If merged, it will remove a notable compatibility issue for advanced macro users.

7. **Config key validation and deprecation cleanup**  
   PR: [#12667](https://github.com/dbt-labs/dbt-core/pull/12667)  
   This open PR improves warnings for unrecognized custom config keys in `dbt_project.yml` and simplifies deprecation logic. That matters because config mistakes currently slip through too easily or surface as confusing warnings.

8. **Correct deprecation for top-level generic test config keys**  
   PR: [#12618](https://github.com/dbt-labs/dbt-core/pull/12618)  
   This ready-for-review community PR fixes misleading deprecation messaging when users place config such as `where` at the wrong level in generic tests. Better diagnostics here should reduce support burden and improve self-service debugging.

9. **Parser hardening: non-constant docs block arguments**  
   PR: [#12673](https://github.com/dbt-labs/dbt-core/pull/12673)  
   This open PR prevents an `AttributeError` when `doc()` is called with non-literal Jinja expressions. It is another example of parser resilience work, especially important for projects pushing the edges of templated documentation.

10. **Parser hardening: invalid generic test config scalar**  
    PR: [#12674](https://github.com/dbt-labs/dbt-core/pull/12674)  
    This open fix handles cases where generic test config is a scalar instead of a dict. While niche, these crash-proofing changes improve dbt-core’s ability to fail gracefully with actionable errors rather than Python exceptions.

## Feature Request Trends

- **More composable selection semantics**  
  The closure of selector-composition work shows strong demand for combining YAML selectors with CLI selection/exclusion. Users want graph targeting to behave like a consistent query language rather than a set of mutually exclusive modes.

- **Better observability and instrumentation**  
  OpenTelemetry tracing remains a visible request via [#11367](https://github.com/dbt-labs/dbt-core/issues/11367). As dbt estates grow, teams increasingly want native hooks into tracing, runtime attribution, and platform observability stacks.

- **Stronger validation with better batch feedback**  
  Issues like [#12339](https://github.com/dbt-labs/dbt-core/issues/12339) reflect demand for compiler/parser behavior that reports all actionable problems in one run. The trend is toward “strict mode” workflows that are CI-friendly without being noisy or iterative.

- **Fusion/Core behavior parity**  
  Several open items point to users expecting Core to match Fusion semantics, especially around disabled resources and custom `ref` behavior in tests. Cross-engine consistency is becoming a product expectation, not just a nice-to-have.

- **Catalog integration everywhere**  
  The cluster of fixes around `parse`, `seed`, `snapshot`, `compile`, and `test` suggests users want `catalogs.yml` support to be uniformly honored by all relevant subcommands.

## Developer Pain Points

- **Inconsistent command behavior across subcommands**  
  Missing `@requires.catalogs` decorators on some commands created confusing failures where `run` worked but `test` or `compile` did not. These inconsistencies are especially painful in automated pipelines.

- **Test framework edge cases**  
  Duplicate names, ambiguous duplicate-test semantics, and custom `ref` incompatibilities all point to friction in the newer unit/generic test stack. Teams are clearly pushing test features harder in CI and finding boundary cases.

- **Partial parsing trust issues**  
  Fresh reports like [#12666](https://github.com/dbt-labs/dbt-core/issues/12666) show that performance features still risk correctness regressions. Developers value speed, but not at the cost of hidden graph corruption.

- **Parser failures from non-ideal YAML/Jinja inputs**  
  Multiple PRs are focused on turning raw Python exceptions into controlled validation behavior. This indicates ongoing frustration with brittle parsing around docs blocks, config structures, and disabled resources.

- **State-based CI missing meaningful changes**  
  Bugs like [#12547](https://github.com/dbt-labs/dbt-core/issues/12547) show that slim CI remains sensitive to metadata blind spots. When `state:modified` misses real changes, teams lose confidence in selective deployment workflows.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-19

## 1. Today's Highlights
Spark saw no new releases in the last 24 hours, but repository activity remains strong around SQL planning, PySpark startup performance, and streaming behavior. The most visible themes today are Python import-time optimization, ongoing SQL/CBO correctness improvements, and a user-raised dependency security question around Derby and Hive versions.

## 2. Hot Issues

> Note: only **1 issue** was updated in the last 24 hours from the provided dataset, so the digest includes all available noteworthy issue activity rather than 10 items.

### 1) Derby/Hive dependency upgrade and security exposure
- **Issue:** [#54563](https://github.com/apache/spark/issues/54563) — **Update Derby and Hive version**
- **Why it matters:** This raises a practical security and platform-maintenance concern: Spark reportedly uses Derby 10.16.1.1, while newer Derby releases fix known CVEs. The question also extends to Hive version alignment, which affects metastore compatibility and downstream enterprise deployments.
- **Community reaction:** Limited visible discussion so far (1 comment), but the topic is important because dependency refreshes often become release-blocking when tied to security advisories and embedded metastore behavior.

## 3. Key PR Progress

### 1) Improve load balancing in LowLatencyMemoryStream
- **PR:** [#54848](https://github.com/apache/spark/pull/54848) — **[SPARK-56023][SS] Better load balance in LowLatencyMemoryStream**
- **Why it matters:** Targets Structured Streaming internals, likely improving fairness and throughput characteristics for low-latency in-memory test or execution paths. This can help reduce skew-like behavior in streaming micro-batch ingestion and testing scenarios.

### 2) Reduce PySpark import overhead by isolating `memory_profiler`
- **PR:** [#54895](https://github.com/apache/spark/pull/54895) — **[SPARK-56062][PYTHON] Isolate memory_profiler to improve import time**
- **Why it matters:** Import-time latency is a persistent developer-experience issue in PySpark. Isolating optional profiling dependencies should make CLI startup and interactive notebook use feel faster, especially in lightweight environments.

### 3) Remove legacy empty-table workaround in `toPandas`
- **PR:** [#53824](https://github.com/apache/spark/pull/53824) — **[SPARK-55059][PYTHON] Remove empty table workaround in toPandas**
- **Why it matters:** This cleans up compatibility logic around Arrow-to-pandas conversion after upstream fixes. It suggests the Arrow interop stack is stabilizing, which is important for pandas-heavy data science workflows on Spark.

### 4) Add typed SPJ partition-key reducers
- **PR:** [#54884](https://github.com/apache/spark/pull/54884) — **[SPARK-56046][SQL] Typed SPJ partition key `Reducer`s**
- **Why it matters:** This is a lower-level SQL planner/runtime correctness improvement. Typed reducer output helps avoid type ambiguity after SPJ refactoring and appears especially relevant to Iceberg-related tests and partition-aware joins.

### 5) Speed up variant shredding schema inference
- **PR:** [#54343](https://github.com/apache/spark/pull/54343) — **[SPARK-55568][SQL] Separate schema construction from field stats collection**
- **Why it matters:** The proposal replaces expensive fold-based schema merging with deferred schema construction and single-pass field-stat collection. This is meaningful for semi-structured data processing where per-file inference cost can materially affect scan planning latency.

### 6) Fix TLS memory leak
- **PR:** [#54894](https://github.com/apache/spark/pull/54894) — **[SPARK-56057] Fix TLS Memory Leak**
- **Why it matters:** Memory leaks in transport/security layers can be severe in long-running clusters. Even with limited detail in the summary, anything involving TLS leaks has potential reliability and operational impact.

### 7) Enable geo types with SRIDs from the pre-built registry
- **PR:** [#54780](https://github.com/apache/spark/pull/54780) — **[SPARK-55981][SQL] Allow Geo Types with SRID's fro the pre-built registry**
- **Why it matters:** Geospatial support continues to mature in Spark SQL. Adding SRID-aware geometry/geography support improves standards alignment and expands analytical use cases for location data.

### 8) Lazy import `numpy` to improve startup speed
- **PR:** [#54896](https://github.com/apache/spark/pull/54896) — **[SPARK-56066][PYTHON] Lazy import numpy to improve import speed**
- **Why it matters:** This is one of several PySpark startup-time improvements in flight. Delaying heavyweight imports can materially improve shell responsiveness, short-lived job startup, and development ergonomics.

### 9) Propagate `distinctCount` through `Union` in CBO stats
- **PR:** [#54883](https://github.com/apache/spark/pull/54883) — **[SPARK-56047][SQL] Propagate distinctCount through Union in CBO statistics estimation**
- **Why it matters:** Cost-based optimizer quality depends on complete column stats. Preserving `distinctCount` across union operations should improve cardinality estimation and potentially downstream join ordering and plan selection.

### 10) Add DataFrame API and Spark Connect support for CDC queries
- **PR:** [#54739](https://github.com/apache/spark/pull/54739) — **[SPARK-55949][SQL] Add DataFrame API and Spark Connect support for CDC queries**
- **Why it matters:** This is one of the most strategically important changes in the current queue. Native DataFrame and Spark Connect support for CDC queries would make Spark more compelling for incremental processing, lakehouse ingestion, and client-server execution patterns.

## 4. Feature Request Trends

Based on the issue and PR activity in the provided snapshot, the strongest direction signals are:

- **Faster PySpark startup and tooling ergonomics**
  - Multiple PRs target lazy imports and benchmark workflow simplification, indicating strong demand for better developer experience in Python-first environments.
  - Relevant PRs: [#54895](https://github.com/apache/spark/pull/54895), [#54896](https://github.com/apache/spark/pull/54896), [#54897](https://github.com/apache/spark/pull/54897), [#54834](https://github.com/apache/spark/pull/54834)

- **More capable SQL engine behavior**
  - There is active work on optimizer statistics, schema inference efficiency, partition-key typing, JSON output options, and CDC APIs.
  - Relevant PRs: [#54883](https://github.com/apache/spark/pull/54883), [#54343](https://github.com/apache/spark/pull/54343), [#54884](https://github.com/apache/spark/pull/54884), [#54717](https://github.com/apache/spark/pull/54717), [#54739](https://github.com/apache/spark/pull/54739)

- **Broader data format and domain support**
  - Geospatial typing with SRIDs and CDC query APIs show momentum toward richer analytical semantics beyond core batch processing.
  - Relevant PRs: [#54780](https://github.com/apache/spark/pull/54780), [#54739](https://github.com/apache/spark/pull/54739)

- **Operational hardening and dependency hygiene**
  - Security-sensitive dependency upgrades and memory leak fixes remain important undercurrents.
  - Relevant items: [#54563](https://github.com/apache/spark/issues/54563), [#54894](https://github.com/apache/spark/pull/54894)

## 5. Developer Pain Points

From the current activity, the recurring frustrations appear to be:

- **PySpark feels too heavy to import**
  - The cluster of lazy-import PRs strongly suggests contributors are attacking real startup-time pain in shells, notebooks, and lightweight scripts.
  - Relevant PRs: [#54895](https://github.com/apache/spark/pull/54895), [#54896](https://github.com/apache/spark/pull/54896), [#54897](https://github.com/apache/spark/pull/54897)

- **SQL planner/statistics edge cases still affect correctness and performance**
  - Missing stats propagation, expensive schema inference, and type-handling issues in partition reduction indicate ongoing complexity in the optimizer and semi-structured data stack.
  - Relevant PRs: [#54883](https://github.com/apache/spark/pull/54883), [#54343](https://github.com/apache/spark/pull/54343), [#54884](https://github.com/apache/spark/pull/54884)

- **Interoperability details continue to create friction**
  - Arrow/pandas conversion cleanup, Spark Connect mode parsing, warehouse path handling with spaces, and CDC API integration all point to operational rough edges at system boundaries.
  - Relevant PRs: [#53824](https://github.com/apache/spark/pull/53824), [#54800](https://github.com/apache/spark/pull/54800), [#54794](https://github.com/apache/spark/pull/54794), [#54739](https://github.com/apache/spark/pull/54739)

- **Security and runtime reliability remain top-of-mind**
  - The Derby CVE concern and the TLS leak fix both reflect production users’ focus on dependency safety and long-running service stability.
  - Relevant items: [#54563](https://github.com/apache/spark/issues/54563), [#54894](https://github.com/apache/spark/pull/54894)

## 6. Releases

No new Spark releases were reported in the last 24 hours.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

## Substrait Community Digest — 2026-03-19

### Today's Highlights
Substrait saw active specification work across function semantics, physical operators, and extension modeling, with several PRs updated on March 18. The most notable themes are continued refinement of nullability and type rules, expansion of built-in functions, and movement on execution-oriented spec gaps such as a physical `TopNRel` operator. A small but important breaking fix also landed for `add:date_iyear`, correcting its return type from `timestamp` to `date`.

### Hot Issues
No issues were updated in the last 24 hours.

### Key PR Progress

1. **Add `has_overlap` list function**  
   PR [#987](https://github.com/substrait-io/substrait/pull/987)  
   This open PR adds a `has_overlap` scalar function to `functions_list.yaml` for testing whether two lists share any common elements. It matters because it fills a practical gap in collection-oriented semantics while also clarifying where list-vs-set behaviors belong in the extension catalog.

2. **Enforce nullable types for null literals in tests**  
   PR [#989](https://github.com/substrait-io/substrait/pull/989)  
   Marked PMC Ready, this PR aligns test cases with extension YAML nullability rules, especially for `MIRROR` and `DECLARED_OUTPUT` behaviors. This is important for implementers because conformance tests often expose interoperability issues before they become runtime incompatibilities.

3. **Require window bounds and support multi-column order-by**  
   PR [#932](https://github.com/substrait-io/substrait/pull/932)  
   This long-running, breaking-change PR would remove default window function bounds and add support for multiple order-by columns in bindings. It is strategically important because window semantics are a common source of cross-engine ambiguity, and this change aims to make them more explicit and portable.

4. **Clarify valid URNs**  
   PR [#881](https://github.com/substrait-io/substrait/pull/881)  
   This documentation PR addresses ambiguity in valid URN formats, based on cross-language implementation behavior in Java, Python, and Go. It matters because inconsistent parsing of identifiers can create subtle ecosystem-level incompatibilities across tooling and engines.

5. **Add optional description field to function implementations**  
   PR [#1013](https://github.com/substrait-io/substrait/pull/1013)  
   Also PMC Ready, this PR adds an optional `description` field to individual function implementations in the extension schema. This improves extension authoring and documentation quality, and could make downstream tooling more self-describing.

6. **Add `TopNRel` physical operator with `WITH TIES` support**  
   PR [#1009](https://github.com/substrait-io/substrait/pull/1009)  
   This PR proposes a physical `TopNRel` in `algebra.proto`, combining sort and fetch into a single operator. It is a meaningful step for execution-oriented interoperability, especially for systems that need a canonical representation of top-N planning semantics including `WITH TIES`.

7. **Clarify nullability binding with `any` type parameters**  
   PR [#960](https://github.com/substrait-io/substrait/pull/960)  
   This PR documents how nullability modes such as `MIRROR`, `DECLARED_OUTPUT`, and `DISCRETE` interact with `any[n]` type parameter binding. This is highly relevant for extension authors and engine implementers because generic typing rules are often difficult to interpret consistently.

8. **Add unsigned integer extension types**  
   PR [#953](https://github.com/substrait-io/substrait/pull/953)  
   PMC Ready, this proposal introduces `u8`, `u16`, `u32`, and `u64` as first-class extension types with arithmetic support and tests. This expands type-system coverage for engines and formats where unsigned numeric semantics are common.

9. **Add current execution-context functions**  
   PR [#945](https://github.com/substrait-io/substrait/pull/945)  
   PMC Ready, this PR adds `current_date`, `current_timestamp`, and `current_timezone`. These are foundational context-sensitive functions needed for parity with mainstream SQL systems and for representing time-aware plans more faithfully.

10. **Fix return type for `add:date_iyear`**  
    PR [#1007](https://github.com/substrait-io/substrait/pull/1007)  
    This PR was closed after correcting the return type of `add:date_iyear` from `timestamp` to `date`, with a breaking-change note. Even though it is narrowly scoped, it is significant because return-type precision directly affects planner correctness and function portability.

### Feature Request Trends
Based on current PR activity, the strongest feature direction is **continued expansion of the function catalog**, especially around collection operations, temporal/context functions, and better-defined overload semantics. A second clear trend is **tighter specification of type and nullability behavior**, suggesting the community is prioritizing interoperability and conformance over permissive interpretation. There is also visible momentum toward **closing physical-plan representation gaps**, as seen in work on `TopNRel` and more explicit window semantics.

### Developer Pain Points
The most recurring pain point appears to be **ambiguity in spec interpretation**, particularly around nullability propagation, generic type binding, and identifier formats like URNs. Another persistent frustration is **mismatch between documented behavior and machine-readable definitions**, which shows up in areas like physical operator coverage and function return types. Finally, extension authors seem to need **better ergonomics and metadata support**, reflected in improvements such as per-implementation descriptions and clearer organization of function definitions.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*