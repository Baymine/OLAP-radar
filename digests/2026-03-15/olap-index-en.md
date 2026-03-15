# OLAP Ecosystem Index Digest 2026-03-15

> Generated: 2026-03-15 01:28 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project OLAP Infrastructure Comparison Report — 2026-03-15

## 1. Ecosystem Overview
The OLAP data infrastructure ecosystem remains active, but today’s signals skew more toward correctness, ergonomics, and operational refinement than major feature launches. Across dbt-core, Spark, and Substrait, maintainers are addressing different layers of the analytics stack: transformation authoring and governance in dbt, execution engine correctness and observability in Spark, and interoperability/spec conformance in Substrait. A consistent pattern is that mature communities are focusing on edge cases, performance overhead, and clearer semantics rather than broad platform redefinition. For practitioners, this suggests a market entering a consolidation phase where reliability, debuggability, and declarative control are increasingly strategic.

## 2. Activity Comparison

| Project | Issues highlighted/updated today | PRs highlighted today | Release status | Main themes |
|---|---:|---:|---|---|
| dbt-core | 7 hot issues | 1 PR | No new release | snapshots, adapter behavior, testing ergonomics, parsing performance, governance |
| Apache Spark | 1 updated issue | 10 PRs | No new release | SQL correctness, AQE UI, V2 catalog parity, numerical stability, streaming docs |
| Substrait | 0 updated issues | 1 PR | No new release | spec conformance, nullability semantics, test-case correctness |

## 3. Shared Feature Directions

### A. Correctness and semantic precision
- **Spark**: Fixes for Unicode `LIKE`, hyperbolic function overflow, vectorized reader error classification, cache invalidation, and a Catalyst planner bug.
- **Substrait**: Null literal and declared-output nullability handling in conformance tests.
- **dbt-core**: Duplicate data test semantics and Snowflake transaction rollback behavior.
- **Shared need**: Users want systems to behave predictably in edge cases, with fewer ambiguous semantics and fewer internal failures.

### B. Better testing and validation ergonomics
- **dbt-core**: Macro override behavior in unit tests; duplicate test handling.
- **Substrait**: More precise validation behavior for function test cases.
- **Spark**: CI/test reliability improvements around RocksDB state store.
- **Shared need**: Advanced users need stronger testing models that match real production composition patterns and reduce false confidence.

### C. Performance and efficiency improvements
- **dbt-core**: Skip parsing disabled models; simplify snapshots for deletion-only use cases.
- **Spark**: Ongoing work to improve runtime debugging and execution clarity, plus tighter handling of runtime failure conditions.
- **Shared need**: Teams want to reduce unnecessary compute and shorten feedback loops, especially in large-scale or multi-tenant environments.

### D. Improved operational visibility and control
- **Spark**: AQE UI enhancements and clearer streaming documentation.
- **dbt-core**: Requests around grants, compute propagation, and transaction correctness.
- **Shared need**: Operators increasingly expect declarative, inspectable, and warehouse-aware control surfaces instead of opaque runtime behavior.

## 4. Differentiation Analysis

### dbt-core
- **Scope**: Transformation development framework and analytics engineering control plane.
- **Target users**: Analytics engineers, data platform teams, warehouse governance owners.
- **Technical approach**: Declarative SQL/model configuration with adapter-specific execution behavior layered onto warehouse platforms.
- **Current emphasis**: Package behavior, adapter fidelity, test semantics, and reducing project overhead in large repos.

### Apache Spark
- **Scope**: General-purpose distributed data processing and SQL execution engine.
- **Target users**: Data engineers, platform engineers, streaming teams, large-scale compute operators.
- **Technical approach**: Runtime engine and optimizer-centric development, with active work across SQL planner correctness, catalog APIs, UI, and streaming subsystems.
- **Current emphasis**: SQL correctness, V2 feature parity, numerical robustness, and better execution observability.

### Substrait
- **Scope**: Cross-engine query plan and function specification/interoperability standard.
- **Target users**: Engine implementers, compiler authors, interoperability and standards contributors.
- **Technical approach**: Spec-first development with conformance artifacts, extension YAML, and validation semantics.
- **Current emphasis**: Precise typing and nullability semantics in tests rather than broad end-user feature delivery.

## 5. Community Momentum & Maturity
- **Most active by code-change volume today: Apache Spark.** Spark shows the highest PR throughput, indicating strong maintainer activity and ongoing iteration across multiple subsystems.
- **Most active by surfaced user pain points today: dbt-core.** dbt has a lighter PR/release day, but a richer issue signal around practical production concerns, suggesting a large and engaged downstream user base.
- **Most quiet but highly specialized: Substrait.** Activity is low-volume, but the work is high-leverage for implementers who depend on semantic consistency across engines.
- **Maturity signal**: All three projects appear mature, but in different ways:
  - **Spark**: mature, large-scale engine refining broad platform behavior.
  - **dbt-core**: mature user-facing framework dealing with ecosystem complexity and adapter variance.
  - **Substrait**: maturing standard/spec project focused on correctness and interoperability details.
- **Rapid iteration today**: Spark leads clearly; dbt’s momentum is more issue-driven than merge-driven; Substrait is steady but slow-moving.

## 6. Trend Signals

### 1. Reliability is becoming a stronger buying criterion than raw feature breadth
Today’s signals favor fixes for transactional correctness, planner stability, nullability semantics, and numeric precision. For data engineers, this means platform evaluation should increasingly include edge-case behavior, not just headline capabilities.

### 2. Declarative governance is moving deeper into the stack
dbt’s grants and compute-routing issues show rising demand for policy, privilege, and environment behavior to be encoded directly in transformation workflows. This is especially relevant for enterprises standardizing on Databricks Unity Catalog or similar governed lakehouse platforms.

### 3. Debuggability and observability are now core platform features
Spark’s AQE UI improvements and dbt’s operational issue themes both indicate that users expect systems to explain themselves better. Tools that expose optimizer decisions, execution changes, and config propagation clearly will have an adoption advantage.

### 4. Standards and interoperability depend on semantic rigor
Substrait’s nullability-focused PR is a reminder that cross-engine interoperability succeeds only when type and function semantics are exact. For organizations investing in portable execution or federated query planning, conformance quality remains critical.

### 5. Large-scale projects want leaner execution paths
Requests to stop parsing disabled dbt models and simplify deletion-only snapshots reflect pressure to cut unnecessary work in complex deployments. Efficiency gains at the metadata/planning layer are becoming as important as raw execution speed.

### 6. Data engineers should expect more warehouse- and engine-specific nuance, not less
Adapter-specific behaviors in dbt and V2/catalog-specific evolution in Spark show that abstraction layers are still incomplete. Technical decision-makers should plan for targeted validation on their chosen warehouse, catalog, and governance stack rather than assuming perfect portability.

If you want, I can also convert this into a **one-page executive briefing**, **Slack update**, or **project-by-project scorecard**.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-03-15

## Today's Highlights
Activity in `dbt-core` was light over the last 24 hours, with no new releases and just one maintenance PR merged. The issue queue, however, continues to surface important themes for practitioners: adapter-specific behavior gaps, testing ergonomics, snapshot simplification, and performance concerns around parsing and duplicate test handling.

## Hot Issues

1. **Support streamlined snapshots for deletion-only use cases**  
   Issue [#11867](https://github.com/dbt-labs/dbt-core/issues/11867)  
   This feature request asks for a lighter-weight snapshot mode when teams only need to preserve rows deleted from the source, rather than full SCD-style change tracking. It matters because many warehouse teams use snapshots primarily as a safeguard against source deletes, and current behavior may be more complex or expensive than necessary. Community reaction is still limited, but the request points to demand for simpler, more cost-efficient snapshot patterns.

2. **`databricks_compute` not applied correctly for models imported via packages**  
   Issue [#11240](https://github.com/dbt-labs/dbt-core/issues/11240)  
   This bug highlights a configuration propagation problem affecting packaged models on Databricks. For teams standardizing compute selection through package reuse, this can break deployment expectations and create environment-specific surprises. The thread is still awaiting response, suggesting the issue remains unresolved and relevant for package-heavy Databricks users.

3. **Stop parsing disabled models**  
   Issue [#11955](https://github.com/dbt-labs/dbt-core/issues/11955)  
   This enhancement request targets parse-time efficiency by skipping disabled models entirely. It matters for large monorepos and package-based deployments where many resources are intentionally disabled but still impose overhead during parsing. While engagement is modest, the issue reflects a recurring performance concern in enterprise dbt projects.

4. **Support `MANAGE` privilege in `+grants` for Databricks Unity Catalog**  
   Issue [#11653](https://github.com/dbt-labs/dbt-core/issues/11653)  
   This asks dbt to support Unity Catalog’s `MANAGE` privilege through standard grants configuration. The request is important for platform teams trying to manage governance and permissions declaratively in dbt rather than through side-channel administration. Even with only one comment, it points to continuing pressure for richer adapter-specific privilege models.

5. **Allow macro overrides in unit tests for nested macros**  
   Issue [#12165](https://github.com/dbt-labs/dbt-core/issues/12165)  
   The issue describes a testing limitation where overriding an inner macro does not work when that macro is called indirectly through another macro. This impacts teams using dbt’s unit test framework for modular macro-heavy logic, especially in reusable packages. The ask is significant because deeper macro composability is increasingly common in mature dbt codebases.

6. **Snowflake rollback skipped after SQL step failure with explicit transactions**  
   Issue [#12330](https://github.com/dbt-labs/dbt-core/issues/12330)  
   This bug raises a transactional correctness concern on Snowflake when explicit transactions are used and a SQL step fails. For production pipelines, rollback behavior is critical to preventing partial writes or inconsistent state. Even with low visible engagement, this is one of the higher-risk operational issues in the current issue set.

7. **Decide whether duplicate data tests should be allowed**  
   Issue [#12643](https://github.com/dbt-labs/dbt-core/issues/12643)  
   This newly opened bug/feature discussion revisits whether duplicate data tests should be accepted after earlier changes enabled them. It matters because duplicate test semantics affect project determinism, package composition, and CI reliability. Although there are no comments yet, the issue has architectural implications for how dbt treats test identity and deduplication.

## Key PR Progress

1. **Maintenance update for pytest-split test durations**  
   PR [#12654](https://github.com/dbt-labs/dbt-core/pull/12654)  
   This auto-generated PR updates the duration metadata used by `pytest-split` to balance test execution across parallel workers. While not a user-facing feature, it improves CI efficiency and helps maintain faster feedback cycles for contributors. It was created and closed on the same day, indicating routine repository maintenance.

## Feature Request Trends
Based on the current issue activity, several feature directions stand out:

- **Leaner, more targeted execution paths**: Requests like [#11867](https://github.com/dbt-labs/dbt-core/issues/11867) and [#11955](https://github.com/dbt-labs/dbt-core/issues/11955) show demand for reducing unnecessary work, whether in snapshots or parsing.
- **Stronger testing ergonomics**: Issues [#12165](https://github.com/dbt-labs/dbt-core/issues/12165) and [#12643](https://github.com/dbt-labs/dbt-core/issues/12643) suggest ongoing refinement of unit and data test behavior is a priority for advanced users.
- **Richer adapter-specific configuration support**: Databricks- and Snowflake-related issues, including [#11240](https://github.com/dbt-labs/dbt-core/issues/11240), [#11653](https://github.com/dbt-labs/dbt-core/issues/11653), and [#12330](https://github.com/dbt-labs/dbt-core/issues/12330), reflect the need for dbt-core to better model warehouse-specific operational semantics.
- **Declarative governance and package compatibility**: Several requests indirectly point to teams wanting more predictable behavior when combining packages, grants, and environment-specific configs.

## Developer Pain Points
Recurring frustrations in the current issue set cluster around a few themes:

- **Adapter inconsistencies create operational risk**: Databricks and Snowflake users are reporting gaps that affect compute routing, privileges, and transaction safety. These are not cosmetic issues; they influence production correctness and governance.
- **Performance overhead in large projects**: Parsing disabled models remains a sore spot for teams running package-heavy or multi-project setups, where unnecessary parse work adds latency and complexity.
- **Testing behavior is still maturing**: Macro override limitations and ambiguity around duplicate data tests show that teams pushing dbt’s testing framework into more advanced use cases still encounter friction.
- **Core abstractions can feel too broad for focused use cases**: The snapshot simplification request suggests some users want narrower, purpose-built functionality rather than full-featured mechanisms when their needs are limited.

If you'd like, I can also turn this into a **Slack-ready daily update** or a **newsletter-style version with more ecosystem context**.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-15

## 1. Today's Highlights
Spark saw no new releases in the last 24 hours, but SQL and UI work remained active. The most notable themes were continued polish around SQL correctness and numerical stability, plus a visible push to modernize the Spark UI for AQE plan inspection and execution navigation. A newly updated issue also flags a potentially important Catalyst/query-planning bug involving `dropDuplicates(columns)` followed by `exceptAll`.

## 3. Hot Issues

> Note: Only **1 issue** was updated in the provided 24h dataset, so this section includes all available noteworthy issue activity rather than 10 items.

1. **`dropDuplicates(columns)` followed by `ExceptAll` results in `INTERNAL_ERROR_ATTRIBUTE_NOT_FOUND`**  
   [#54724](https://github.com/apache/spark/issues/54724)  
   This appears to be a Spark SQL/Catalyst correctness bug where a valid DataFrame sequence triggers an internal attribute resolution failure. It matters because `dropDuplicates` and set operations are common building blocks in ETL and dedup pipelines, so planner instability here can break production jobs unexpectedly. Community reaction is still early: the issue is newly updated, still open, and has no comments yet, suggesting it is awaiting triage and reproduction validation.

## 4. Key PR Progress

1. **Support `CREATE TABLE LIKE` for V2 catalogs**  
   [#54809](https://github.com/apache/spark/pull/54809)  
   This extends familiar SQL DDL behavior to DataSource V2, reducing friction for modern catalog/table implementations. It is strategically important because Spark continues to converge feature parity between V1 and V2 table semantics.

2. **Do not swallow vectorized reader capacity overflow as corrupt-file handling**  
   [#54805](https://github.com/apache/spark/pull/54805)  
   This SQL fix tightens error handling so integer overflows in vectorized reads are surfaced properly instead of being masked as ignorable corruption. That should improve debuggability and prevent silent misclassification of serious runtime failures.

3. **Fix flaky RocksDB state store bounded-memory test**  
   [#54808](https://github.com/apache/spark/pull/54808)  
   Although test-focused, this matters for Structured Streaming reliability because RocksDB-backed state management is central to production streaming workloads. Reducing flakiness improves contributor confidence and CI signal quality.

4. **Document admission control and `Trigger.AvailableNow` for PySpark streaming data sources**  
   [#54807](https://github.com/apache/spark/pull/54807)  
   This is a docs-oriented improvement, but a meaningful one: custom streaming source authors in PySpark need clearer operational guidance. Better documentation here lowers adoption friction for newer streaming APIs.

5. **Side-by-side Initial vs Final AQE plan comparison in the UI**  
   [#54806](https://github.com/apache/spark/pull/54806)  
   A strong usability enhancement for Spark SQL debugging. By making AQE rewrites easier to compare visually, this PR helps engineers understand optimizer behavior and tune query execution more efficiently.

6. **Fix `LIKE` pattern matching for supplementary Unicode characters**  
   [#54665](https://github.com/apache/spark/pull/54665)  
   This addresses correctness for characters beyond the BMP, such as emoji and other surrogate-pair representations. It is important for globalized datasets and text-heavy analytics workloads where Unicode edge cases can cause subtle query mismatches.

7. **Clear function registry cache on `DROP DATABASE`**  
   [#54781](https://github.com/apache/spark/pull/54781)  
   This targets cache coherence in catalog/function resolution. The fix matters for long-lived sessions and metadata-heavy environments, where stale function entries can lead to confusing name resolution behavior after DDL changes.

8. **Numerical stability fix for `asinh`/`acosh` on large values**  
   [#54677](https://github.com/apache/spark/pull/54677)  
   This SQL math fix prevents overflow to infinity for large inputs using a more stable formulation. It is particularly relevant for scientific, statistical, and ML-adjacent workloads relying on Spark SQL functions for numeric transformations.

9. **Backport hyperbolic-function overflow fix to Spark 4.0**  
   [#54804](https://github.com/apache/spark/pull/54804)  
   The presence of an explicit backport indicates maintainers view the numerical issue as important enough for release lines beyond mainline. This improves confidence for users standardizing on Spark 4.0.

10. **Backport hyperbolic-function overflow fix to Spark 3.5**  
    [#54803](https://github.com/apache/spark/pull/54803)  
    A second backport to 3.5 broadens impact further, signaling that correctness fixes in SQL math remain a cross-version maintenance priority for the project.

## 5. Feature Request Trends
Based on the current PR and issue flow, the strongest direction is **Spark SQL correctness and standards alignment**: V2 DDL support, Unicode handling, catalog cache coherence, and numeric stability all point to continued investment in making SQL behavior more predictable and production-safe. A second trend is **developer observability**, especially in the UI, with work on AQE plan comparison and better execution/stage navigation. Finally, **streaming ergonomics and documentation** remain active, especially around PySpark custom streaming sources and state-store reliability.

## 6. Developer Pain Points
Developers are still running into **hard-to-diagnose SQL planner/runtime failures**, especially where internal Catalyst errors surface instead of user-actionable messages. There is also ongoing frustration around **edge-case correctness**: Unicode handling, numeric overflow, metadata cache invalidation, and vectorized reader failure modes all suggest that production users want Spark to behave more transparently in non-happy-path scenarios. On the tooling side, UI and docs improvements indicate persistent demand for **better debugging surfaces** and clearer guidance for advanced features like AQE and custom streaming sources.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

## Today's Highlights
Activity in the Substrait repository was quiet over the last 24 hours, with no new releases and no issues updated. The only notable movement was on [PR #989](https://github.com/substrait-io/substrait/pull/989), which tightens test-case handling for null literals so output nullability matches each function’s declared nullability semantics in the extension YAML. This is a small but important correctness fix for implementers validating function behavior against the spec.

## Key PR Progress
- [PR #989](https://github.com/substrait-io/substrait/pull/989) - **fix: enforce nullable types for null literals in test cases**  
  Open and updated on 2026-03-14 by @benbellick. This change ensures test cases correctly encode nullability for null literals based on the function definition’s `nullability` rules in extension YAML. In particular, it aligns MIRROR behavior with nullable inputs and enforces DECLARED_OUTPUT functions to use the declared return nullability.  
  **Why it matters:** For engine authors and validator maintainers, this reduces ambiguity in conformance testing and helps prevent false positives or false negatives when checking function signatures and result typing.

## Feature Request Trends
No issues were updated in the last 24 hours, so there is not enough current signal to identify active feature-request trends for today’s digest.

## Developer Pain Points
The limited activity means there are no newly surfaced pain points from issues today. However, the update on [PR #989](https://github.com/substrait-io/substrait/pull/989) suggests that nullability semantics in function test cases remain a sensitive area for implementers, especially where spec-defined behavior must be reflected precisely in automated validation.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*