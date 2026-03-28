# OLAP Ecosystem Index Digest 2026-03-28

> Generated: 2026-03-28 01:21 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project OLAP Infrastructure Comparison Report — 2026-03-28

## 1. Ecosystem Overview

The OLAP data infrastructure ecosystem remains active even without release activity today, with development concentrated in usability, optimizer intelligence, interoperability, and advanced semantics. dbt-core is focused on configuration correctness, parser consistency, and operational safety; Spark is pushing planner/SQL ergonomics, DSv2 maturity, and streaming-state tooling; Substrait is advancing spec completeness and compatibility for cross-engine plan exchange. Across all three, the strongest signal is a shift from basic functionality toward production-grade correctness, clearer semantics, and better support for complex modern analytics workloads. This suggests a maturing ecosystem where developer trust, interoperability, and advanced workload coverage are becoming the primary battlegrounds.

## 2. Activity Comparison

| Project | Updated Issues Today | Notable PRs Today | Release Status Today | Primary Activity Pattern |
|---|---:|---:|---|---|
| dbt-core | 8 highlighted issues | 9 highlighted PRs | No new release | UX, config validation, selector/parsing correctness, freshness roadmap |
| Apache Spark | 2 updated issues | 10 highlighted PRs | No new release | SQL planner improvements, DSv2 ergonomics, PySpark polish, streaming state |
| Substrait | 0 updated issues | 10 highlighted PRs | No new release | Spec evolution, deprecation cleanup, function/type-system expansion |

## 3. Shared Feature Directions

### 1. Stronger correctness and clearer semantics
- **dbt-core**: warnings for unknown flags, better validation errors, parser/selector consistency, semantic-model error clarity.
- **Spark**: optimizer behavior improvements, ordering inference, filter inference, cleanup of confusing execution paths.
- **Substrait**: clarification of URNs, function signatures, grouping semantics, and deprecation cleanup.
- **Shared need**: users want systems to behave more predictably and explain failures or semantics precisely, especially in production and cross-team environments.

### 2. Better support for advanced analytics patterns
- **dbt-core**: model freshness, custom materializations, semantic models, advanced project structures.
- **Spark**: `QUALIFY`, richer `INSERT ... REPLACE` syntax, nested partition predicates, complex join optimization.
- **Substrait**: lateral joins, `UNNEST`/row expansion, grouping-set compatibility, JSON/list support.
- **Shared need**: modern analytics teams increasingly require first-class handling for nontrivial SQL patterns, nested data, and platform-specific complexity without resorting to fragile workarounds.

### 3. Improved developer ergonomics
- **dbt-core**: suppression of noisy stack traces, better node-type-specific error messages, config warnings.
- **Spark**: PySpark convenience APIs, DSv2 developer documentation, code simplification.
- **Substrait**: supported-library documentation, breaking-change policy, clarifying spec text for implementers.
- **Shared need**: communities are prioritizing lower cognitive overhead for both end users and contributors.

### 4. Interoperability and compatibility discipline
- **dbt-core**: dependency compatibility maintenance, consistency between Core/Fusion behavior.
- **Spark**: SQL dialect alignment pressures and DSv2 API stabilization.
- **Substrait**: explicit compatibility guidance, removal of deprecated constructs, extension/type standardization.
- **Shared need**: teams want fewer surprises when integrating tools, upgrading versions, or moving workloads across engines.

## 4. Differentiation Analysis

### dbt-core
- **Scope**: transformation orchestration, project configuration, metadata/model lifecycle, developer workflow.
- **Target users**: analytics engineers, data transformation owners, platform teams managing dbt deployments.
- **Technical approach**: declarative project configuration and compilation-centric workflows layered over warehouses.
- **Current emphasis**: trust in parsing/config behavior, actionable errors, and extending observability from sources to models.

### Apache Spark
- **Scope**: general-purpose distributed compute engine spanning SQL, batch, streaming, Python APIs, and connector interfaces.
- **Target users**: data engineers, platform engineers, streaming teams, connector developers, ML/data application builders.
- **Technical approach**: runtime query planning and execution with heavy focus on optimizer quality, execution models, and source integration.
- **Current emphasis**: planner intelligence, SQL dialect modernization, DSv2 maintainability, and streaming-state observability.

### Substrait
- **Scope**: interoperability specification for portable query plans, functions, types, and relational semantics.
- **Target users**: engine authors, connector/adapter builders, query federation vendors, standards-oriented platform teams.
- **Technical approach**: formal spec and protocol modeling rather than end-user execution or orchestration.
- **Current emphasis**: semantic completeness, deprecation cleanup, and reducing implementation drift across ecosystems.

## 5. Community Momentum & Maturity

### Most active end-user-facing communities
- **Spark** appears to have the broadest engineering surface area today, with 10 notable PRs spanning optimizer work, DSv2, PySpark, and Structured Streaming.
- **dbt-core** shows strong practical community engagement despite no release, with a dense mix of usability bugs, operational issues, and workflow fixes that reflect active real-world production usage.

### Fastest specification iteration
- **Substrait** shows the clearest signs of rapid spec iteration: many open PRs, several breaking-change cleanups, and continued expansion into advanced relational/function semantics.  
- This is high momentum, but it also indicates a platform still consolidating standards rather than one fully stabilized.

### Relative maturity signals
- **dbt-core**: mature adoption, but still refining sharp edges around configuration and parser consistency; issues indicate heavy production use.
- **Spark**: highly mature core platform with ongoing incremental refinement in optimizer and APIs; current work is evolutionary rather than foundational.
- **Substrait**: comparatively earlier in ecosystem maturity; strong design momentum, but compatibility policy and deprecation management remain active concerns.

## 6. Trend Signals

### 1. Production trust is becoming more important than raw feature count
Community discussions increasingly center on deadlocks, stale parsing, misconfiguration warnings, cost-model correctness, and spec ambiguity. For data engineers, this means tool selection should weigh operational predictability and debuggability as heavily as headline capabilities.

### 2. SQL and semantic portability are strategic priorities
Spark’s `QUALIFY` request and richer SQL syntax proposals, along with Substrait’s semantic and function-model work, indicate rising demand for portable analytics logic across warehouses, lakehouses, and engines. Teams investing in multi-engine strategies should watch these efforts closely.

### 3. Nested, semi-structured, and advanced query patterns are now mainstream
Spark’s nested partition support and Substrait’s work on JSON, lists, lateral operations, and unnesting show that semi-structured analytics is no longer peripheral. Platform choices should be evaluated on how well they support these patterns without excessive custom engineering.

### 4. Metadata and observability are moving up the stack
dbt-core’s model freshness epic is a strong signal that observability expectations are expanding from ingestion-layer checks to transformed assets. Data teams should expect governance and SLA monitoring to increasingly target models, not just sources or pipelines.

### 5. Connector and extension ecosystems are a key competitive layer
Spark’s DSv2 work and Substrait’s implementation guidance both highlight the strategic importance of extensibility. For technical decision-makers, ecosystem leverage may increasingly depend on how easy it is to build, maintain, and standardize integrations.

### 6. Breaking-change governance matters more as ecosystems mature
Substrait’s breaking-change policy work and dbt-core’s compatibility maintenance both show that ecosystem stability is now a management concern, not just a technical detail. Data engineers and platform owners should factor upgrade discipline, migration cost, and compatibility guarantees into roadmap planning.

If you want, I can also turn this into:
- a **one-page executive brief**,
- a **CTO-style investment/risk assessment**, or
- a **project scoring matrix** across dbt-core, Spark, and Substrait.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-03-28

## Today's Highlights
dbt-core saw no new releases in the last 24 hours, but there was meaningful activity across usability, config validation, and selector behavior. The biggest themes were clearer error handling, stricter config feedback, and continued discussion around model freshness as a next-step expansion beyond source freshness. Community attention also remains on long-running operational issues in Postgres and parsing/config inconsistencies.

## Hot Issues

1. **Warning about `dataset` placement in source configs**  
   [Issue #12327](https://github.com/dbt-labs/dbt-core/issues/12327)  
   This bug matters because it affects source configuration ergonomics and may generate misleading warnings in dbt Cloud for otherwise valid projects. It has moderate engagement, including 13 comments and 4 reactions, suggesting this is more than an isolated edge case and may require backport consideration.

2. **Postgres deadlocks during `__dbt_backup` drop cascade**  
   [Issue #9246](https://github.com/dbt-labs/dbt-core/issues/9246)  
   One of the more operationally significant open issues, this reports deadlocks tied to backup table cleanup during runs. With 9 👍 reactions, it stands out as a real production pain point for teams running dbt against Postgres with dependency-heavy schemas.

3. **Disabled model still parsed as enabled in Core**  
   [Issue #11948](https://github.com/dbt-labs/dbt-core/issues/11948)  
   Although now closed, this issue is noteworthy because it highlights a discrepancy between Core and Fusion behavior around disabled resources. That kind of parser inconsistency can break package interoperability and creates uncertainty for maintainers relying on disabled nodes to suppress invalid references.

4. **`alias` ignored under partial parsing with cache invalidation problems**  
   [Issue #11289](https://github.com/dbt-labs/dbt-core/issues/11289)  
   Partial parsing remains a performance win, but issues like this undermine trust when dbt appears to compile against stale or incorrect metadata. Even with low engagement so far, this is high impact because nondeterministic parse behavior is hard to debug in CI and local development.

5. **Epic: model freshness checks**  
   [Issue #12719](https://github.com/dbt-labs/dbt-core/issues/12719)  
   This is the clearest strategic product thread in the current issue set. It signals movement toward extending freshness concepts from sources to models, which could materially improve observability and SLAs for transformed datasets, not just raw ingestion tables.

6. **`post_hook` in `dbt_project.yml` ignored for custom materializations**  
   [Issue #12706](https://github.com/dbt-labs/dbt-core/issues/12706)  
   This issue matters for teams using advanced warehouse patterns such as functions/UDFs or bespoke materializations. Silent ignoring of hooks is especially problematic because it creates hidden correctness risks rather than explicit failures.

7. **Poor compile-time error for `relation_name none is not an allowed value`**  
   [Issue #12722](https://github.com/dbt-labs/dbt-core/issues/12722)  
   This is a classic developer-experience problem: the engine emits a low-level validation error without enough context to identify the broken semantic model or config. As semantic-layer usage grows, better fault localization will become increasingly important.

8. **Dependency compatibility with mypy 1.20.x**  
   [Issue #12385](https://github.com/dbt-labs/dbt-core/issues/12385)  
   Now closed, this issue is still worth noting because it reflects ongoing maintenance pressure around Python dependency compatibility. These “small” packaging fixes matter disproportionately for contributors, plugin authors, and users with stricter internal tooling stacks.

## Key PR Progress

1. **Suppress stacktraces for snapshot validation failures**  
   [PR #12700](https://github.com/dbt-labs/dbt-core/pull/12700)  
   This community PR improves CLI usability by replacing noisy Python stacktraces with cleaner validation errors when YAML snapshots are missing required fields like `strategy` or `unique_key`. It directly addresses a common “bad UX on user mistake” class of issue.

2. **Improve ambiguous identifier error messaging by node type**  
   [PR #12691](https://github.com/dbt-labs/dbt-core/pull/12691)  
   A targeted but valuable fix: errors involving catalog ambiguity will reference the correct node type instead of always saying “model.” This should reduce confusion for source, seed, and snapshot users debugging relation collisions.

3. **Add `docs` config support for sources**  
   [PR #12646](https://github.com/dbt-labs/dbt-core/pull/12646)  
   This is one of the more meaningful feature PRs in flight. Extending docs config support to sources would improve metadata consistency and make source documentation more configurable in larger analytics engineering projects.

4. **Warn on unknown flags in `dbt_project.yml`**  
   [PR #12689](https://github.com/dbt-labs/dbt-core/pull/12689)  
   This PR addresses a high-value configuration footgun: typos in project flags are currently ignored silently. Adding warnings should save teams from subtle misconfiguration and shorten debugging cycles.

5. **Selector handling fix in `show` and `compile`**  
   [PR #12562](https://github.com/dbt-labs/dbt-core/pull/12562)  
   This ready-for-review fix corrects a tuple-membership bug caused by checking a single character rather than the full selection argument. It is a small code change with outsized importance because selector correctness underpins many development and inspection workflows.

6. **Pass selectors through to source freshness**  
   [PR #12718](https://github.com/dbt-labs/dbt-core/pull/12718)  
   Closed quickly, this fix resolved a runtime error caused by `config.selectors` not being passed into the source freshness task. Its fast closure suggests maintainers viewed this as a straightforward but necessary correction.

7. **Test coverage for selector selector-method path**  
   [PR #12720](https://github.com/dbt-labs/dbt-core/pull/12720)  
   Also closed, this PR strengthened test coverage around selector behavior. While not user-facing on its own, it supports the broader pattern of stabilizing selection logic across dbt commands.

8. **Pathspec version update tied to dependency compatibility**  
   [PR #12714](https://github.com/dbt-labs/dbt-core/pull/12714)  
   Closed in support of the mypy compatibility thread, this maintenance PR shows continued dependency hygiene work in the repo. These changes are important for keeping CI and contributor environments healthy.

9. **README-only GitHub test change**  
   [PR #12712](https://github.com/dbt-labs/dbt-core/pull/12712)  
   Not product-relevant, but worth noting as closed housekeeping activity. It appears to have been used to validate GitHub workflow behavior rather than to change dbt-core functionality.

## Feature Request Trends
Across current issues and PRs, three feature directions are emerging:

- **Richer freshness semantics**  
  The [model freshness epic](https://github.com/dbt-labs/dbt-core/issues/12719) suggests demand is moving beyond source freshness toward monitoring transformed assets directly.

- **Stronger config validation and feedback**  
  Work around unknown flags, source config structure, docs config for sources, and better compile/validation errors indicates users want dbt to fail earlier and explain misconfigurations more precisely.

- **Better support for advanced project structures**  
  Issues involving custom materializations, semantic models, partial parsing, and disabled resources show growing pressure from sophisticated production deployments that push beyond default dbt patterns.

## Developer Pain Points
The recurring frustrations in this cycle are fairly consistent:

- **Silent misconfiguration**  
  Users are frustrated when dbt ignores invalid flags or hooks without warning, as seen in [Issue #12706](https://github.com/dbt-labs/dbt-core/issues/12706) and [PR #12689](https://github.com/dbt-labs/dbt-core/pull/12689).

- **Errors without actionable context**  
  Several threads center on cryptic or overly technical failures, including [Issue #12722](https://github.com/dbt-labs/dbt-core/issues/12722), [PR #12700](https://github.com/dbt-labs/dbt-core/pull/12700), and [PR #12691](https://github.com/dbt-labs/dbt-core/pull/12691).

- **Parser and selector inconsistency**  
  Partial parsing bugs, disabled-node behavior, and selector propagation problems continue to create low-trust experiences in compilation and task execution paths.

- **Operational safety in production databases**  
  The persistent Postgres deadlock issue in [#9246](https://github.com/dbt-labs/dbt-core/issues/9246) shows that reliability under real warehouse concurrency remains a key concern for advanced users.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-28

## 1. Today’s Highlights

Spark saw no new releases today, but repository activity remained focused on SQL planner behavior, Data Source V2 ergonomics, PySpark API polish, and Structured Streaming state handling. The most notable signals are a new proposal to improve CBO awareness of columnar execution costs, a feature request for `QUALIFY` SQL support, and several active PRs that tighten optimizer semantics, DSv2 usability, and streaming state tooling.

## 2. Hot Issues

Only 2 issues were updated in the last 24 hours, so today’s issue section covers all available noteworthy items.

1. **CBO should account for columnar operators through a generic interface**  
   [#55058](https://github.com/apache/spark/issues/55058)  
   This issue proposes improving Spark’s cost-based optimizer so it can reason about columnar operators more accurately, including both their execution advantages and row/column conversion overheads. This matters because Spark increasingly mixes row-based and columnar execution paths, and weak costing can lead to poor physical-plan choices. Community reaction is still early: the issue is newly opened with no comments yet, but it points at an important long-term optimizer gap.

2. **Feature request: support `QUALIFY` clause in SQL**  
   [#55052](https://github.com/apache/spark/issues/55052)  
   The request asks Spark SQL to support `QUALIFY`, a widely appreciated convenience feature for filtering on window-function results without subqueries. For data engineers moving across modern warehouse and lakehouse SQL dialects, this improves portability and reduces query verbosity. There is no visible discussion yet, but the request aligns with continued pressure for Spark SQL dialect modernization.

## 3. Key PR Progress

1. **State data source reader support for stream-stream join state format v4 — merged/closed**  
   [#54845](https://github.com/apache/spark/pull/54845)  
   Adds state-data-source reader support for the newer v4 state format in stream-stream joins. This is important for observability and tooling around Structured Streaming state inspection, especially as state formats evolve.

2. **Follow-up test fix for Structured Streaming state work**  
   [#55071](https://github.com/apache/spark/pull/55071)  
   A follow-up patch addressing failing tests caused by interaction between earlier streaming changes. While small in scope, it shows the project is actively stabilizing recent state-management work.

3. **Remove confusing defensive code in `SortExec.rowSorter`**  
   [#55048](https://github.com/apache/spark/pull/55048)  
   Cleans up SQL execution code and adds warning comments around a tricky sorting path. This kind of maintenance helps reduce future regressions in core execution components.

4. **Simplify extraction of fields from `DataSourceV2ScanRelation`**  
   [#55070](https://github.com/apache/spark/pull/55070)  
   Refactors pattern-matching usage so callers are less tightly coupled to case-class constructor shape. This improves maintainability in the DSv2 planning layer and lowers future refactor cost.

5. **Support nested partition columns for DSv2 `PartitionPredicate`**  
   [#54995](https://github.com/apache/spark/pull/54995)  
   Extends partition predicate handling to nested columns in Data Source V2. This is a meaningful improvement for modern semi-structured datasets and partition layouts, helping pushdown logic better match real-world schemas.

6. **Add developer documentation for Spark Data Source V2 — closed**  
   [#55046](https://github.com/apache/spark/pull/55046)  
   Adds a new developer-facing DSv2 architecture document. Even though it is already closed, it stands out because DSv2 remains a high-complexity area where better docs directly improve contributor onboarding and connector development.

7. **Add `SparkSession.emptyDataFrame(schema)` in PySpark**  
   [#55055](https://github.com/apache/spark/pull/55055)  
   Introduces a more direct API for creating empty DataFrames with a schema. This is a small but practical usability enhancement for PySpark developers who currently rely on more awkward patterns.

8. **Derive `outputOrdering` from `KeyedPartitioning` expressions**  
   [#55036](https://github.com/apache/spark/pull/55036)  
   Exposes ordering guarantees implied by keyed partitioning to the planner. If merged, this could unlock better optimization opportunities by allowing downstream operators to reuse structural properties already present in the data.

9. **Improve `InferFiltersFromConstraints` for complex join expressions**  
   [#55045](https://github.com/apache/spark/pull/55045)  
   Revives and simplifies prior work to infer filters from more complex join conditions. This is the kind of optimizer enhancement that can produce silent but meaningful query performance wins across a broad workload base.

10. **Add `INSERT INTO ... REPLACE ON/USING` syntax**  
   [#54722](https://github.com/apache/spark/pull/54722)  
   Proposes richer SQL syntax for conditional row replacement during insert operations. This is relevant for lakehouse mutation workflows and indicates ongoing interest in narrowing ergonomic gaps with warehouse-style SQL systems.

## 4. Feature Request Trends

Based on today’s updated issues and PR flow, the strongest feature directions are:

- **SQL dialect expansion and ergonomics**  
  Requests like `QUALIFY` support and work on richer `INSERT ... REPLACE` semantics show demand for more expressive, warehouse-familiar SQL in Spark. Users increasingly expect Spark SQL to support concise constructs common in Databricks and broader analytical SQL ecosystems.

- **Smarter optimizer behavior**  
  The new CBO issue and active optimizer PRs suggest continued investment in plan quality, especially around columnar execution, filter inference, ordering propagation, and cost modeling. This reflects Spark’s growing need to optimize heterogeneous execution strategies, not just classic row-based plans.

- **Better Data Source V2 support**  
  DSv2 remains a major axis of change, with work spanning nested partition predicate support, relation API cleanup, and fresh developer docs. The direction is clear: make DSv2 more capable, easier to maintain, and easier for connector authors to implement correctly.

- **PySpark developer experience improvements**  
  Multiple Python PRs on typing, imports, and convenience APIs point to a steady quality push for PySpark. This is especially valuable as Python remains the dominant Spark entry point for many data teams.

- **Structured Streaming state introspection and correctness**  
  The merged state-reader enhancement and immediate follow-up test fix show sustained attention to streaming state formats, test reliability, and debugging support.

## 5. Developer Pain Points

The recurring frustrations visible in today’s activity are:

- **Optimizer blind spots around modern execution models**  
  As Spark blends row and columnar operators, developers want cost models that reflect real tradeoffs instead of relying on incomplete heuristics.

- **SQL portability gaps**  
  Missing constructs such as `QUALIFY` still create friction for users migrating workloads from warehouses and managed Spark dialects.

- **DSv2 complexity and maintainability**  
  Repeated refactors and documentation work imply that DSv2 is powerful but still cumbersome for both Spark contributors and connector developers.

- **PySpark rough edges in everyday workflows**  
  The volume of small Python fixes suggests ongoing annoyance with missing convenience APIs, typing issues, and packaging/import details.

- **Streaming changes can introduce cross-patch instability**  
  The need for follow-up fixes after recent Structured Streaming work highlights how tightly coupled state-management changes can be, increasing test and maintenance burden.

## 6. Links Referenced

- Issue: [#55058](https://github.com/apache/spark/issues/55058)
- Issue: [#55052](https://github.com/apache/spark/issues/55052)
- PR: [#54845](https://github.com/apache/spark/pull/54845)
- PR: [#55071](https://github.com/apache/spark/pull/55071)
- PR: [#55048](https://github.com/apache/spark/pull/55048)
- PR: [#55070](https://github.com/apache/spark/pull/55070)
- PR: [#54995](https://github.com/apache/spark/pull/54995)
- PR: [#55046](https://github.com/apache/spark/pull/55046)
- PR: [#55055](https://github.com/apache/spark/pull/55055)
- PR: [#55036](https://github.com/apache/spark/pull/55036)
- PR: [#55045](https://github.com/apache/spark/pull/55045)
- PR: [#54722](https://github.com/apache/spark/pull/54722)

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait Community Digest — 2026-03-28

## 1. Today's Highlights
Substrait had no new releases or issue activity in the last 24 hours, but PR activity remains strong and focused on spec evolution, compatibility cleanup, and function/type-system refinement. The most notable themes are breaking-change cleanup of deprecated fields and types, richer support for complex query patterns like lateral joins and unnesting, and continued clarification of extension/function semantics for implementers.

## 2. Hot Issues
No issues were updated in the last 24 hours.

## 3. Key PR Progress

1. **Docs: supported libraries + breaking change policy**  
   PR [#1026](https://github.com/substrait-io/substrait/pull/1026)  
   A documentation-focused PR that could improve downstream adoption by clarifying ecosystem support and how breaking changes are managed. This matters because Substrait is seeing more spec evolution, and implementers need predictable compatibility guidance.

2. **Unsigned integer extension types (u8/u16/u32/u64)**  
   PR [#953](https://github.com/substrait-io/substrait/pull/953)  
   Adds unsigned integer extension types with arithmetic support and test coverage. This expands type-system expressiveness for engines and connectors that need native unsigned semantics without overloading signed integer behavior.

3. **Remove deprecated time/timestamp/timestamp_tz types**  
   PR [#994](https://github.com/substrait-io/substrait/pull/994)  
   A significant breaking-change PR removing deprecated temporal types across proto, grammar, extension YAMLs, tests, and docs. This is important for reducing long-term spec ambiguity, though it will require coordinated updates across implementations.

4. **GenerateRel for lateral view and unnest operations**  
   PR [#917](https://github.com/substrait-io/substrait/pull/917)  
   Introduces a new relational operator for table-function-driven row expansion, enabling SQL patterns like `LATERAL VIEW`, `EXPLODE`, and `UNNEST`. This is one of the more strategically important additions for modern semi-structured and nested-data workloads.

5. **Clarify valid URNs**  
   PR [#881](https://github.com/substrait-io/substrait/pull/881)  
   Tightens documentation around URN syntax and existing implementation assumptions. This matters because inconsistent URN parsing can create subtle interoperability bugs across Java, Go, Python, and Rust implementations.

6. **AggregateRel compatibility for grouping set semantics**  
   PR [#890](https://github.com/substrait-io/substrait/pull/890)  
   Addresses corner-case behavior in aggregation semantics, especially around grouping sets and database compatibility. This kind of work is crucial for preserving semantic fidelity when translating plans between engines.

7. **Simple JSON extension**  
   PR [#887](https://github.com/substrait-io/substrait/pull/887)  
   Proposes a lightweight JSON extension. JSON remains a common cross-engine type gap, so this PR could become a foundational interoperability piece for semi-structured workloads.

8. **Add `has_overlap` for lists**  
   PR [#987](https://github.com/substrait-io/substrait/pull/987)  
   Adds a scalar function to determine whether two lists share common elements. This improves expressiveness for collection-oriented queries and reflects growing attention to nested and list-centric data processing.

9. **Support integer arguments with std_dev and variance**  
   PR [#1012](https://github.com/substrait-io/substrait/pull/1012)  
   Extends aggregate/statistical function support to integer inputs. This is a practical improvement for implementers aiming for better alignment with existing SQL engine behavior and fewer implicit-cast edge cases.

10. **Deprecate std_dev and variance signatures using function options**  
    PR [#1019](https://github.com/substrait-io/substrait/pull/1019)  
    Deprecates option-based function signatures in favor of enum arguments for these statistical functions. Together with related docs and function work, this signals a broader push toward cleaner, more uniform function signature modeling.

## 4. Feature Request Trends
With no fresh issue activity, current PRs still make the roadmap direction fairly clear:

- **More complete support for nested and semi-structured data**  
  Work on [GenerateRel #917](https://github.com/substrait-io/substrait/pull/917), [JSON extension #887](https://github.com/substrait-io/substrait/pull/887), and list functions like [#987](https://github.com/substrait-io/substrait/pull/987) and [#1020](https://github.com/substrait-io/substrait/pull/1020) shows strong demand for better modeling of arrays, JSON, and row-expanding operations.

- **Better subquery and advanced relational semantics**  
  PRs like [lateral join #973](https://github.com/substrait-io/substrait/pull/973) and [GenerateRel #917](https://github.com/substrait-io/substrait/pull/917) suggest continued pressure to represent correlated subqueries and advanced SQL constructs more faithfully.

- **Spec cleanup and deprecation follow-through**  
  Several open breaking-change PRs—such as [#994](https://github.com/substrait-io/substrait/pull/994), [#1002](https://github.com/substrait-io/substrait/pull/1002), and [#1019](https://github.com/substrait-io/substrait/pull/1019)—indicate an active effort to retire deprecated constructs and reduce ambiguity before they become entrenched in implementations.

- **Clearer function signature semantics**  
  Ongoing work around enum arguments, options, nullability, and variadic behavior—see [#1005](https://github.com/substrait-io/substrait/pull/1005), [#960](https://github.com/substrait-io/substrait/pull/960), and [#851](https://github.com/substrait-io/substrait/pull/851)—shows sustained demand for precision in the function model.

- **Cross-engine compatibility and implementation guidance**  
  PRs such as [#881](https://github.com/substrait-io/substrait/pull/881), [#890](https://github.com/substrait-io/substrait/pull/890), and [#1026](https://github.com/substrait-io/substrait/pull/1026) point to a strong community need for better interoperability rules and clearer operational guidance for library authors.

## 5. Developer Pain Points
Several recurring friction points are evident from the PR backlog:

- **Ambiguity in spec wording creates implementation drift**  
  Documentation PRs on URNs, variadic functions, enum arguments vs options, and extension relation schema handling—[#881](https://github.com/substrait-io/substrait/pull/881), [#851](https://github.com/substrait-io/substrait/pull/851), [#1005](https://github.com/substrait-io/substrait/pull/1005), [#1018](https://github.com/substrait-io/substrait/pull/1018)—suggest implementers are still hitting unclear corners of the spec.

- **Breaking changes are necessary but operationally costly**  
  Cleanup PRs like [#994](https://github.com/substrait-io/substrait/pull/994), [#1002](https://github.com/substrait-io/substrait/pull/1002), and [#932](https://github.com/substrait-io/substrait/pull/932) improve long-term consistency but create migration overhead for engines, SDKs, and test suites.

- **Advanced SQL semantics remain hard to model consistently**  
  Grouping sets, lateral joins, correlated subqueries, and unnest-like operations—[#890](https://github.com/substrait-io/substrait/pull/890), [#973](https://github.com/substrait-io/substrait/pull/973), [#917](https://github.com/substrait-io/substrait/pull/917)—continue to be challenging areas for portable plan representation.

- **Type/function coverage gaps still matter for adoption**  
  Requests for unsigned integers, JSON, list operations, and more complete statistical function support—[#953](https://github.com/substrait-io/substrait/pull/953), [#887](https://github.com/substrait-io/substrait/pull/887), [#987](https://github.com/substrait-io/substrait/pull/987), [#1012](https://github.com/substrait-io/substrait/pull/1012)—show that practical completeness is still a major adoption concern.

- **Consumers need stronger compatibility guarantees**  
  The presence of [supported libraries + breaking change policy #1026](https://github.com/substrait-io/substrait/pull/1026) indicates that ecosystem participants want clearer expectations around what is stable, what is deprecated, and how to track support across implementations.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*