# OLAP Ecosystem Index Digest 2026-03-14

> Generated: 2026-03-14 01:15 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — 2026-03-14

## 1. Ecosystem Overview
The OLAP data infrastructure ecosystem continues to show strong investment in **correctness, determinism, and operational usability** rather than purely net-new surface area. Across dbt-core, Spark, and Substrait, maintainers and contributors are focusing on reducing edge-case failures in dependency handling, type semantics, SQL/runtime behavior, and developer tooling. This suggests a maturing stack where users increasingly expect reproducibility, stronger validation, and better interoperability across components. At the same time, Spark remains the broadest execution-layer innovator, dbt-core is sharpening workflow reliability for analytics engineering, and Substrait is concentrating on spec precision that underpins cross-engine portability.

## 2. Activity Comparison

| Project | Issues Discussed Today | PRs Discussed Today | Release Status |
|---|---:|---:|---|
| dbt-core | 9 | 5 | No new releases |
| Apache Spark | 0 updated issues | 10 | No new releases |
| Substrait | 0 updated issues | 3 | No new releases |

### Notes
- **dbt-core** had the richest issue-level signal, especially around package management and config validation.
- **Spark** showed the highest PR throughput, indicating strong implementation momentum despite no issue updates.
- **Substrait** had lighter volume but high-leverage changes around spec correctness.

## 3. Shared Feature Directions

### A. Stronger correctness and validation
- **dbt-core**: stricter `flags:` validation, better `packages.yml` error handling, state/selector correctness.
- **Spark**: numerical stability fixes, join correctness regression coverage, dtype fidelity, shell/config parsing reliability.
- **Substrait**: function return type correction, nullability-conformance enforcement.
- **Shared need**: fail earlier, behave more predictably, and reduce silent or confusing misbehavior.

### B. Determinism and reproducibility
- **dbt-core**: lockfile determinism, avoiding environment-variable-driven `package-lock.yml` churn.
- **Spark**: more predictable config/path handling and partition discovery behavior under varied filesystem layouts.
- **Substrait**: spec-level consistency in function signatures and nullability semantics for interoperable implementations.
- **Shared need**: stable behavior across environments, CI systems, and downstream consumers.

### C. Better developer ergonomics
- **dbt-core**: support for additional docs extensions, improved package validation UX, more expressive selector composition.
- **Spark**: pandas-on-Spark usability improvements, shell startup robustness, plotting enhancements.
- **Substrait**: CI/tooling fixes that reduce contributor friction.
- **Shared need**: lower friction for both day-to-day users and contributors.

### D. Interoperability and semantic fidelity
- **dbt-core**: metadata and state behavior matter for integrations with platforms like Databricks and CI workflows.
- **Spark**: DSv2 transactions, geospatial SRID support, pandas compatibility improvements.
- **Substrait**: precise function/type semantics as a portability contract across engines.
- **Shared need**: tighter alignment between declared semantics and real execution across tools.

## 4. Differentiation Analysis

### dbt-core
- **Scope**: Analytics engineering framework, transformation orchestration, dependency/package workflows, documentation/testing semantics.
- **Target users**: Analytics engineers, data platform teams, CI/CD owners for SQL transformation projects.
- **Technical approach**: Declarative project configuration, manifest/state-based workflows, package-driven extensibility.
- **Current emphasis**: Dependency reproducibility, config strictness, and workflow ergonomics.

### Apache Spark
- **Scope**: General-purpose distributed compute and SQL execution engine with broad API and runtime surface area.
- **Target users**: Data engineers, platform engineers, ML/data science practitioners, engine integrators.
- **Technical approach**: Large-scale execution engine with SQL planner/runtime, Python APIs, DSv2 connector model, streaming and batch support.
- **Current emphasis**: Engine correctness, configurability, pandas parity, transaction foundations, and geospatial expansion.

### Substrait
- **Scope**: Cross-engine query plan and function semantics specification.
- **Target users**: Engine developers, connector authors, interoperability/tooling implementers.
- **Technical approach**: Specification-first standardization of types, functions, nullability, and portable semantics.
- **Current emphasis**: Semantic correctness in extensions, conformance testing, and spec/tooling stability.

## 5. Community Momentum & Maturity

### Most active today
- **Apache Spark** shows the highest implementation velocity with **10 active PRs**, spanning engine internals, SQL semantics, Python ergonomics, and operations.
- **dbt-core** shows the strongest **user-facing issue signal**, with multiple meaningful discussions tied directly to production workflow pain points.
- **Substrait** is less active by volume, but its changes are disproportionately important because small spec corrections can affect many downstream engines.

### Maturity signals
- **dbt-core** appears to be in a mature-hardening phase: users are pushing for stricter validation, deterministic packaging, and fewer ambiguous behaviors.
- **Spark** remains both mature and highly iterative: it is still expanding into new areas like transactions and geospatial SQL while also polishing numerous edge cases.
- **Substrait** is maturing as an ecosystem contract: lower activity volume, but high sensitivity to correctness because spec mistakes propagate broadly.

### Rapid iteration
- **Spark** is iterating fastest at the code level.
- **dbt-core** is iterating quickly around workflow reliability and developer experience.
- **Substrait** is iterating more carefully, with emphasis on precision over volume.

## 6. Trend Signals

### 1. Reliability is now a primary product feature
Community activity indicates that users increasingly value **predictable, deterministic behavior** as much as new functionality. Lockfile stability in dbt-core, numeric/path correctness in Spark, and type/nullability precision in Substrait all reinforce this.

### 2. Validation is shifting left
There is clear pressure for systems to catch malformed config, semantic mismatches, and type errors earlier:
- dbt-core: stricter config and dependency validation
- Spark: regression coverage and safer built-ins
- Substrait: stronger conformance semantics

For data engineers, this means future tooling will likely become less permissive but easier to trust in CI and production.

### 3. Semantic interoperability is gaining importance
Spark’s DSv2 and geospatial work, dbt’s metadata/state correctness, and Substrait’s function-signature precision all point toward a stack where interoperability matters more than isolated features. Teams building lakehouse platforms or multi-engine architectures should treat semantic alignment as a selection criterion.

### 4. Advanced workflows are becoming mainstream
State-based builds, selector composition, transactional table operations, and portable function semantics are no longer niche concerns. Community attention suggests these are becoming standard expectations for production-grade OLAP systems.

### 5. Developer experience remains a competitive differentiator
Small improvements—clearer errors, better docs file support, more robust shell behavior, CI fixes—continue to matter. For technical decision-makers, this is a reminder that ecosystem adoption is shaped not just by raw capability, but by how safely and efficiently engineers can operate the tool.

## Bottom Line
- **Choose dbt-core** when analytics workflow reliability, package governance, and transformation ergonomics are central.
- **Choose Spark** when broad execution capability, engine extensibility, and high-velocity platform evolution matter most.
- **Track Substrait closely** if cross-engine portability, standards alignment, and future-proof semantic interoperability are strategic priorities.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-03-14

## Today's Highlights
dbt-core activity today centered on package management correctness, especially around `package-lock.yml` determinism and validation edge cases. There’s also visible momentum on contributor-driven quality-of-life improvements, including support for additional docs file extensions and better package validation, while maintainers continue to surface stricter configuration behavior and selector ergonomics as important longer-term themes.

## Hot Issues

1. **`package-lock.yml` hash instability when using `--add-package`**  
   Issue: [#10913](https://github.com/dbt-labs/dbt-core/issues/10913)  
   This remains one of the more meaningful package-management bugs because it affects lockfile reproducibility depending on how dependencies are added. For teams relying on deterministic dependency state across CI and developer machines, inconsistent hashes can create noisy diffs and trust issues in dependency workflows. Community engagement is moderate, with sustained discussion indicating it is still unresolved operationally.

2. **Avoid unnecessary `package-lock.yml` regeneration for git packages using env vars**  
   Issue: [#11953](https://github.com/dbt-labs/dbt-core/issues/11953)  
   This enhancement request matters for organizations that inject credentials or hostnames via environment variables in git package URLs. The current behavior can regenerate lockfiles unnecessarily across environments, making dependency state appear changed when the actual package target is not. It’s a low-comment thread, but strategically important because it touches reproducibility and cross-machine consistency.

3. **Make project-level `flags:` strict**  
   Issue: [#12590](https://github.com/dbt-labs/dbt-core/issues/12590)  
   This proposal pushes dbt toward stricter config validation by rejecting arbitrary values in `flags:` rather than accepting any YAML shape. That matters for catching silent misconfiguration early, especially in larger teams where typoed or unsupported flags can linger undetected. Community reaction is still early, but the request aligns with broader ecosystem pressure for stronger schema enforcement.

4. **Compatibility with upcoming mypy 1.20.x**  
   Issue: [#12385](https://github.com/dbt-labs/dbt-core/issues/12385)  
   Although not a user-facing runtime issue, dependency compatibility with future mypy versions matters for contributors, packagers, and downstream tooling. The request suggests interest in keeping dbt-core’s Python dependency constraints modern and reducing friction for static analysis users. Limited discussion so far, but it is relevant for maintainability and ecosystem hygiene.

5. **Missing package version in `packages.yml` causes cryptic `KeyError` in `dbt debug`**  
   Issue: [#12649](https://github.com/dbt-labs/dbt-core/issues/12649)  
   This is a high-signal bug because it points to poor validation UX: a malformed dependency spec produces an internal-looking `KeyError` instead of a helpful user-facing message. These failures are especially frustrating for new users and CI troubleshooting. The issue already has a corresponding PR, suggesting quick community response and likely near-term resolution.

6. **Ambiguity around duplicate data tests**  
   Issue: [#12643](https://github.com/dbt-labs/dbt-core/issues/12643)  
   This is part bug report, part product-design question: should dbt allow duplicate data tests or enforce uniqueness? It matters because test duplication can affect manifest behavior, execution semantics, and user expectations in large projects. There’s no comment activity yet, but the issue could influence future test model semantics.

7. **`dbt run --empty` generates invalid SQL with Databricks Lakehouse Federation options**  
   Issue: [#11676](https://github.com/dbt-labs/dbt-core/issues/11676)  
   This bug was closed, but it is still notable because it highlights adapter/runtime edge cases introduced by optimization flags and special SQL clauses. For Databricks users, `--empty` should be a safe workflow shortcut, so SQL invalidation in that path is consequential. Closure suggests the problem is understood or resolved, which is useful for affected users.

8. **Unity Catalog table descriptions not appearing in Databricks**  
   Issue: [#12172](https://github.com/dbt-labs/dbt-core/issues/12172)  
   Also closed, this issue pointed to a metadata propagation gap where model descriptions did not show up as expected in Unity Catalog even though column descriptions did. That matters because dbt’s documentation value proposition depends on reliable metadata publication into platform catalogs. Its closure signals progress for Databricks metadata consistency.

9. **`state:modified+` misses column-level custom key changes in YAML**  
   Issue: [#12469](https://github.com/dbt-labs/dbt-core/issues/12469)  
   This closed bug is relevant for teams relying on state-based slim CI and selective builds. If dbt fails to detect changes in custom YAML keys such as `databricks_tags`, downstream automation can silently skip necessary work. Closure suggests state comparison logic is maturing, but the issue underscores how sensitive these workflows are to manifest semantics.

## Key PR Progress

1. **Exclude environment variables when generating package lockfiles**  
   PR: [#11954](https://github.com/dbt-labs/dbt-core/pull/11954)  
   This community PR directly addresses lockfile nondeterminism for git packages that use environment-variable-based URLs. If merged, it should reduce machine-specific package hashes and make `package-lock.yml` more stable in collaborative and CI-heavy environments.

2. **Support `.jinja`, `.jinja2`, and `.j2` extensions for docs files**  
   PR: [#12653](https://github.com/dbt-labs/dbt-core/pull/12653)  
   This is a useful developer-experience enhancement for teams that store Jinja-templated docs in editor-friendly file formats rather than plain `.md`. It broadens dbt’s docs parsing conventions without changing authoring semantics, making documentation workflows more flexible.

3. **Fix package version validation for missing property cases**  
   PR: [#12650](https://github.com/dbt-labs/dbt-core/pull/12650)  
   This PR responds quickly to issue [#12649](https://github.com/dbt-labs/dbt-core/issues/12649) by improving validation when a hub package omits `version` entirely. The likely impact is clearer errors and less debugging time for malformed dependency specs.

4. **First pass: `dbtRunnerFs`**  
   PR: [#12652](https://github.com/dbt-labs/dbt-core/pull/12652)  
   The summary is sparse, but the naming suggests filesystem-oriented runner work, potentially tied to internal execution or API ergonomics. This looks like foundational infrastructure rather than an end-user feature, so it may be important longer term even if immediate impact is unclear.

5. **Implementation of selector selector method**  
   PR: [#12582](https://github.com/dbt-labs/dbt-core/pull/12582)  
   This is a significant usability enhancement: selectors would become composable as another selector method rather than only being usable as defaults or via `--selector`. For advanced project orchestration, that would make resource selection much more expressive and reduce awkward CLI indirection.

## Feature Request Trends
Several requests point to a clear product direction:

- **More deterministic dependency management**  
  Issues [#10913](https://github.com/dbt-labs/dbt-core/issues/10913) and [#11953](https://github.com/dbt-labs/dbt-core/issues/11953), plus PR [#11954](https://github.com/dbt-labs/dbt-core/pull/11954), all reflect demand for lockfiles that behave consistently across machines, workflows, and credential-injection patterns.

- **Stricter validation and better error messaging**  
  Issue [#12590](https://github.com/dbt-labs/dbt-core/issues/12590) and issue/PR pair [#12649](https://github.com/dbt-labs/dbt-core/issues/12649) / [#12650](https://github.com/dbt-labs/dbt-core/pull/12650) show appetite for dbt to fail earlier and more clearly on malformed config rather than allowing silent or cryptic behavior.

- **More expressive project selection semantics**  
  PR [#12582](https://github.com/dbt-labs/dbt-core/pull/12582) indicates continued interest in richer selector composition, which is especially relevant for large DAGs, slim CI, and reusable deployment patterns.

- **Better ergonomics for docs and test authoring**  
  PR [#12653](https://github.com/dbt-labs/dbt-core/pull/12653) and issue [#12643](https://github.com/dbt-labs/dbt-core/issues/12643) point to ongoing work around content authoring flexibility and test-definition semantics.

## Developer Pain Points
Recurring frustrations in the current issue flow are fairly consistent:

- **Dependency workflows still feel brittle**  
  Lockfile regeneration, environment-dependent hashes, and validation gaps in `packages.yml` continue to cause friction. This is especially painful in CI/CD, monorepos, and teams standardizing package updates.

- **Error messages can be too internal or too permissive**  
  Developers are running into both sides of the UX problem: some invalid inputs produce cryptic exceptions, while other invalid configs are silently accepted. Both cases slow debugging and reduce confidence in project correctness.

- **State- and selector-based workflows remain sensitive**  
  Issues around `state:modified+` correctness and selector flexibility show that advanced dbt workflows are powerful but still easy to trip over. Users want these features to be both more predictable and more composable.

- **Adapter/platform edge cases still surface in production workflows**  
  Databricks-related bugs in SQL generation and metadata publication reinforce that cross-platform behavior remains an operational concern, especially for enterprise users leaning on catalog integration and federated query paths.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-14

## 1. Today's Highlights
Spark activity over the last 24 hours was concentrated in pull requests rather than issues or releases, with visible momentum in SQL engine work, pandas-on-Spark ergonomics, and operational usability. Several PRs target correctness and stability in edge cases—especially around filesystem handling, numeric functions, streaming joins, and Spark Connect shell behavior—while longer-horizon work continues on DSv2 transactions and geospatial SQL support.

## 2. Hot Issues
No GitHub issues were updated in the last 24 hours, so there are no issue-level discussion trends to report today.

## 3. Key PR Progress

1. **Fix SPARK_CONNECT_MODE parsing in `bin/pyspark`**  
   Closed: [#54796](https://github.com/apache/spark/pull/54796)  
   This fix replaces stdout-based parsing with exit-code-based detection for `SPARK_CONNECT_MODE`, avoiding failures caused by invisible characters such as carriage returns or whitespace. It matters because it improves startup reliability for PySpark users and reduces shell-environment fragility.

2. **Add Plotly pie chart subplots support in pandas-on-Spark**  
   Open: [#54706](https://github.com/apache/spark/pull/54706)  
   This PR adds `subplots` and `layout` arguments to pie chart rendering in the Plotly backend. It expands pandas-on-Spark visualization parity and makes notebook-based exploratory analysis more practical for multi-column categorical data.

3. **Simplify `super()` syntax in PySpark**  
   Open: [#54790](https://github.com/apache/spark/pull/54790)  
   A cleanup-oriented Python PR that modernizes inheritance calls. While not user-facing, these changes improve code maintainability and reduce boilerplate in the PySpark codebase.

4. **Enable geospatial types with SRIDs from the pre-built registry**  
   Open: [#54780](https://github.com/apache/spark/pull/54780)  
   This SQL-focused geospatial enhancement builds on prior SRID registry work and would allow Geometry and Geography types to use precompiled SRIDs. This is strategically important for Spark’s expanding geospatial story and for interoperability with OGC-style standards.

5. **DSv2 Transaction API foundations**  
   Open: [#54642](https://github.com/apache/spark/pull/54642)  
   One of the most significant platform-level efforts in flight, this PR lays groundwork for transaction support in Data Source V2 DML. If merged, it could materially improve correctness and connector capabilities for modern table formats and transactional engines.

6. **Fix default warehouse directory handling when paths contain spaces**  
   Open: [#54794](https://github.com/apache/spark/pull/54794)  
   This addresses a practical filesystem/configuration edge case around warehouse directory paths with whitespace. It is a small but high-value reliability fix for local development, desktop environments, and certain managed deployments.

7. **Preserve non-`int64` index dtypes in `restore_index`**  
   Open: [#54789](https://github.com/apache/spark/pull/54789)  
   This pandas-on-Spark fix ensures index dtype fidelity is maintained when restoring pandas indexes from columns. It matters for compatibility-sensitive workloads where dtype drift can break downstream expectations or test suites.

8. **Add regression tests for SPJ partial clustering dedup correctness**  
   Open: [#54714](https://github.com/apache/spark/pull/54714)  
   A test-focused SQL PR that targets correctness risks in post-join deduplication with partial clustering. Although it does not change behavior directly, regression coverage here is important because join correctness bugs are costly and difficult to detect in production.

9. **Fix numerical instability in `asinh`/`acosh` for very large values**  
   Open: [#54677](https://github.com/apache/spark/pull/54677)  
   This SQL math fix adopts a more stable formulation for extreme values to avoid overflow. It improves reliability for scientific, analytical, and ML-adjacent workloads that depend on numerically robust built-in functions.

10. **Add configurable traversal depth before parallel partition discovery**  
    Open: [#54787](https://github.com/apache/spark/pull/54787)  
    This introduces `spark.sql.sources.parallelPartitionDiscovery.traversalDepth` to tune how directory trees are expanded before parallelization. It addresses a real performance/usability problem in deep-narrow partition layouts and gives operators more control over file listing behavior.

## 4. Feature Request Trends

Based on the PR stream, the strongest feature and enhancement directions today are:

- **Stronger SQL engine correctness and configurability**  
  Work on partition discovery, join correctness tests, numerical stability, and broad type support points to continued investment in making Spark SQL more predictable at scale.

- **Deeper support for modern table and transaction semantics**  
  The DSv2 transaction API foundation suggests continued pressure from the ecosystem for richer connector contracts and safer DML execution.

- **Growing geospatial capability**  
  The SRID registry/geotypes work indicates geospatial SQL remains an active expansion area, likely driven by demand for native spatial processing in lakehouse environments.

- **Better pandas-on-Spark fidelity and usability**  
  Plotting improvements, dtype preservation, and test alignment continue the trend toward reducing behavioral gaps between pandas and pandas-on-Spark.

- **Operational polish in developer tooling and UI**  
  Environment-page export support and shell/config parsing fixes show demand for smoother day-2 operations and easier local debugging.

## 5. Developer Pain Points

Recurring frustrations implied by today’s activity include:

- **Edge-case configuration handling remains brittle**  
  Issues like whitespace in warehouse paths and shell-mode parsing show that environment-dependent behavior can still trip up users in surprising ways.

- **Filesystem and partition discovery performance is workload-sensitive**  
  The new traversal-depth configuration reflects pain around file listing overhead in complex directory structures, especially in object-store-heavy deployments.

- **Correctness bugs in advanced SQL and streaming paths are expensive**  
  Regression tests for SPJ deduplication and fixes around stream-stream joins highlight how subtle planner/state-format issues can create production risk.

- **pandas compatibility details still matter a lot**  
  Index dtype preservation and categorical test behavior reinforce that users notice even small semantic mismatches between pandas and pandas-on-Spark.

- **Developers want more robust built-in behavior, not just more features**  
  Numeric stability fixes and better assertions indicate ongoing demand for clearer failures and safer defaults across Spark internals.

## 6. Releases
No new releases were published in the last 24 hours.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait Community Digest — 2026-03-14

## 1. Today's Highlights
Substrait saw no new releases or issue activity in the last 24 hours, but pull request activity focused on two important themes: correctness in type/nullability semantics and tooling stability in CI. The most consequential open change is a breaking extension fix that corrects the return type of `add:date_iyear` from `timestamp` to `date`, alongside ongoing work to align test cases with declared function nullability behavior.

## 4. Key PR Progress

1. **PR #1007 — Correct return type for `add:date_iyear`**
   - Status: **Open**
   - Why it matters: This is a **breaking extension fix** that changes the return type of `add:date_iyear` from `timestamp` to `date`, bringing the function signature in line with expected date-plus-year/month interval semantics. This is important for engine implementers, type checkers, and compatibility validation across Substrait consumers.
   - Link: [substrait-io/substrait PR #1007](https://github.com/substrait-io/substrait/pull/1007)

2. **PR #989 — Enforce nullable types for null literals in test cases**
   - Status: **Open**
   - Why it matters: This update strengthens test correctness by ensuring null literal typing follows each function’s declared `nullability` rules in extension YAML. It is especially relevant for implementers validating `MIRROR` and `DECLARED_OUTPUT` behaviors, and should reduce ambiguity in conformance testing.
   - Link: [substrait-io/substrait PR #989](https://github.com/substrait-io/substrait/pull/989)

3. **PR #1008 — Fix commitlint tinyexec module resolution failure**
   - Status: **Closed**
   - Why it matters: Although not user-facing, this CI fix improves contributor workflow reliability by avoiding broken `npx` dependency resolution for commitlint. Healthier CI and commit validation reduce friction for maintainers and external contributors.
   - Link: [substrait-io/substrait PR #1008](https://github.com/substrait-io/substrait/pull/1008)

## 5. Feature Request Trends
No issues were updated in the last 24 hours, so there is no fresh issue-driven signal on feature demand. Based on current PR activity alone, the strongest direction remains **spec and extension correctness**, particularly around precise function signatures, nullability semantics, and stronger validation through tests.

## 6. Developer Pain Points
Recent activity suggests two practical pain points for contributors and implementers:

- **Type-system edge cases in extensions**  
  The open fix for `add:date_iyear` indicates that even core function definitions can surface subtle return-type inconsistencies with downstream impact on engines and validators.  
  Reference: [PR #1007](https://github.com/substrait-io/substrait/pull/1007)

- **Nullability and conformance complexity**  
  The ongoing test-case update shows that null literal handling and output nullability rules remain a source of implementation complexity, particularly when driven by extension YAML semantics.  
  Reference: [PR #989](https://github.com/substrait-io/substrait/pull/989)

- **Contributor tooling friction in CI**  
  The commitlint resolution fix highlights avoidable setup and pipeline instability in the development workflow.  
  Reference: [PR #1008](https://github.com/substrait-io/substrait/pull/1008)

## 3. Hot Issues
No issues were updated in the last 24 hours.

## 2. Releases
No new releases in the last 24 hours.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*