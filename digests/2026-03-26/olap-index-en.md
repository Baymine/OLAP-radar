# OLAP Ecosystem Index Digest 2026-03-26

> Generated: 2026-03-26 01:27 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — OLAP Data Infrastructure Ecosystem  
**Date:** 2026-03-26

## 1. Ecosystem Overview
The current OLAP data infrastructure landscape shows a strong emphasis on **correctness, interoperability, and operational ergonomics**. Across dbt-core, Spark, and Substrait, communities are investing in stricter validation, clearer semantics, and better developer experience rather than only pursuing net-new features. Spark remains the most execution-focused and operationally sensitive project, dbt-core is maturing its analytics engineering control plane with stronger config and artifact behavior, and Substrait is deepening specification rigor to support engine portability. Overall, the ecosystem is moving toward **more reliable, standardized, and debuggable analytical systems**.

## 2. Activity Comparison

| Project | Updated Issues Today | Active/Updated PRs Highlighted | Release Status Today |
|---|---:|---:|---|
| **dbt-core** | 10 hot issues highlighted | 10 PRs highlighted | No release noted |
| **Apache Spark** | 2 updated issues | 10 PRs highlighted | No new releases |
| **Substrait** | 1 updated issue | 9 PRs highlighted | No release noted |

### Notes
- **dbt-core** had the broadest issue-level discussion, especially around config strictness, function lifecycle support, parsing, and environment handling.
- **Spark** had fewer issue updates but high PR throughput, indicating strong maintainer/contributor execution velocity.
- **Substrait** showed lower issue volume but meaningful spec-level PR activity, which is typical for a standards-focused project.

## 3. Shared Feature Directions

### A. Better validation, semantics, and fail-fast behavior
- **dbt-core:** strict `flags:` validation, warnings on unknown configuration, selection/state correctness.
- **Spark:** improved named errors, better diagnostics for schema evolution and DSv2 failures.
- **Substrait:** tighter semantics for outer references, clearer schema contracts for extension relations, removal of deprecated types.
- **Shared need:** reduce silent misconfiguration and ambiguous behavior.

### B. Stronger developer ergonomics and local workflow reliability
- **dbt-core:** `.env` support, Windows env var handling, parser reliability.
- **Spark:** better error messages, pandas API consistency, cleaner Arrow serializer internals.
- **Substrait:** `pixi`-based build environment for reproducibility and contributor onboarding.
- **Shared need:** lower friction in development, debugging, and cross-platform setup.

### C. Interoperability and API consistency
- **Spark:** parity between `spark.catalog.*` and DDL, pandas-on-Spark compatibility with upstream pandas.
- **Substrait:** standardized function/type surface area for portable plan representation across engines.
- **dbt-core:** more consistent project-level config handling and artifact behavior.
- **Shared need:** align behavior across interfaces, tools, and engines.

### D. Richer support for advanced analytical abstractions
- **dbt-core:** function resources, full-refresh semantics for functions, function property diffing, hook behavior.
- **Spark:** richer SQL write semantics (`INSERT ... REPLACE`), DSv2-aware cache behavior, streaming checkpoint recovery.
- **Substrait:** list functions, execution-context variables, richer extension types (`fp16`, `decimal256`, `duration`).
- **Shared need:** support more sophisticated analytics workloads without ad hoc workarounds.

## 4. Differentiation Analysis

### dbt-core
- **Scope:** Analytics engineering framework for transformation modeling, testing, metadata, and deployment behavior.
- **Target users:** Analytics engineers, data platform teams, warehouse-centric developers.
- **Technical approach:** Declarative project configuration, DAG-aware parsing, artifact-driven state and selection logic.
- **Current focus:** Configuration correctness, function lifecycle maturity, parser/selection edge cases, local-dev ergonomics.

### Apache Spark
- **Scope:** General-purpose distributed compute and SQL execution engine.
- **Target users:** Data engineers, platform teams, ML/data application developers, large-scale batch/streaming operators.
- **Technical approach:** Distributed runtime with APIs spanning SQL, DataFrames, PySpark, Structured Streaming, Connect, and DSv2.
- **Current focus:** execution correctness, security/runtime reliability, API consistency, error diagnosability, streaming resilience.

### Substrait
- **Scope:** Cross-engine query plan and function/type specification for interoperability.
- **Target users:** Engine builders, query planner authors, connector/framework maintainers.
- **Technical approach:** Open specification with protobuf/grammar/extensions defining portable semantics.
- **Current focus:** semantic precision, function/type expansion, deprecation cleanup, contributor tooling.

### Key difference
- **dbt-core** operates at the transformation orchestration/modeling layer.
- **Spark** operates at the execution/runtime layer.
- **Substrait** operates at the interoperability/specification layer.

## 5. Community Momentum & Maturity

### Most active community today
- **dbt-core** appears to have the highest visible issue diversity today, with active discussion spanning configuration, parser behavior, functions, and environment management.
- **Spark** shows the strongest implementation throughput in PRs, especially across SQL, PySpark, pandas API on Spark, and streaming.
- **Substrait** has a smaller but focused community, with activity concentrated in semantically important spec PRs rather than broad user-facing issue volume.

### Maturity signals
- **Spark** is the most mature operational platform of the three, reflected by attention to security disclosures, YARN encryption correctness, checkpoint recovery, and API parity.
- **dbt-core** is in a strong maturity phase where user expectations are shifting from feature availability to stricter correctness and fewer silent failures.
- **Substrait** is maturing as a standard: lower volume, but high-value changes around semantics, deprecation, and formalization suggest rapid architectural consolidation.

### Rapid iteration
- **dbt-core:** fast iteration around usability gaps and correctness bugs, often with same-day PRs tied to new issues.
- **Spark:** fast engineering cadence across many subsystems, but changes are often deeper and more runtime-sensitive.
- **Substrait:** iterative but deliberate; changes can be spec-breaking, so velocity is measured more by semantic progress than raw volume.

## 6. Trend Signals

### 1. Reliability is becoming a top ecosystem priority
Communities are prioritizing **strict validation, precise semantics, and clearer diagnostics**. For data engineers, this signals that tooling selection should increasingly favor systems that minimize silent failure modes.

### 2. Developer experience is now a platform concern
`.env` handling in dbt-core, build reproducibility in Substrait, and better Spark error messaging all show that **DX is no longer secondary**. Teams should expect platform tools to support faster onboarding and more predictable local iteration.

### 3. Functions, types, and SQL semantics are expanding
dbt-core’s function materialization work, Spark’s richer SQL mutation semantics, and Substrait’s growing function/type catalog indicate broader demand for **more expressive analytical programming models**.

### 4. Interoperability remains strategically important
Substrait’s spec work and Spark/dbt consistency efforts point toward a future where **cross-engine portability and standardized semantics** matter more, especially in heterogeneous lakehouse and warehouse environments.

### 5. Operational edge cases remain decisive in production adoption
Spark’s security and encryption issue flow, dbt’s selection/hook correctness concerns, and Substrait’s ambiguity around nested references all reinforce a key buyer lesson: **production trust depends on edge-case behavior, not just headline features**.

### Practical reference value for data engineers
- Choose **dbt-core** when governance, transformation modeling, testability, and warehouse workflow discipline are primary.
- Choose **Spark** when scale, mixed batch/streaming execution, and runtime flexibility are central.
- Track **Substrait** closely if your organization depends on multi-engine planning, portable semantics, or building interoperable data infrastructure.

If you want, I can also convert this into a **one-page executive briefing** or a **scored comparison matrix** for architecture evaluation.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-03-26

## 1. Today's Highlights
dbt-core activity today centered on configuration correctness, function materialization edge cases, and parser/runtime behavior ahead of future releases. The most notable themes were new work on `.env` support, stricter validation of project-level flags, several PostgreSQL function-related feature requests, and active fixes for selection, environment variable handling on Windows, and manifest/catalog behavior.

## 3. Hot Issues

1. **Root `.env` file support requested**
   - Issue: [#12106](https://github.com/dbt-labs/dbt-core/issues/12106)
   - Why it matters: Native `.env` loading would simplify local developer setup and reduce reliance on shell-specific environment management.
   - Community reaction: Moderate discussion so far, but the request gained immediate traction because a linked implementation PR was opened the same day.

2. **Project-level `flags:` should be strict**
   - Issue: [#12590](https://github.com/dbt-labs/dbt-core/issues/12590)
   - Why it matters: Today dbt silently accepts unknown keys under `flags:`, which can hide typos and create hard-to-debug configuration drift.
   - Community reaction: Low comment volume, but this is strategically important and already has an active community PR proposing warnings.

3. **Mypy 1.20.x compatibility**
   - Issue: [#12385](https://github.com/dbt-labs/dbt-core/issues/12385)
   - Why it matters: Dependency compatibility affects contributor workflows, CI reliability, and downstream package maintenance.
   - Community reaction: One of the more visibly supported issues in this set with 5 👍, signaling interest from contributors maintaining typed Python environments.

4. **`dbt test --select` skips YAML data tests for models containing `_show`**
   - Issue: [#12539](https://github.com/dbt-labs/dbt-core/issues/12539)
   - Why it matters: This is a node-selection correctness bug that can cause test coverage gaps without obvious user awareness.
   - Community reaction: Limited discussion, but the issue already has a targeted fix PR from the community, which suggests reproducibility and clear root cause.

5. **Behavior change flags targeted for v1.12 default flips**
   - Issue: [#12713](https://github.com/dbt-labs/dbt-core/issues/12713)
   - Why it matters: This is a release-planning signal. Defaults changing in v1.12 could alter project behavior for teams that have not explicitly pinned flag settings.
   - Community reaction: New issue with no comments yet, but highly relevant for maintainers and platform teams preparing upgrade paths.

6. **`--full-refresh` support requested for function materializations**
   - Issue: [#12708](https://github.com/dbt-labs/dbt-core/issues/12708)
   - Why it matters: PostgreSQL function replacement semantics do not handle parameter renames and some return-type changes cleanly, making schema evolution difficult.
   - Community reaction: Newly opened, but it addresses a real operational gap for teams using dbt to manage UDFs.

7. **Warn or fail on SQL function parameter names shadowing columns**
   - Issue: [#12707](https://github.com/dbt-labs/dbt-core/issues/12707)
   - Why it matters: This is a subtle correctness issue in PostgreSQL SQL-language functions that can silently produce wrong results.
   - Community reaction: Early-stage, but notable because it surfaces dbt’s growing use in function lifecycle management, not just tables/views.

8. **`post_hook` from `dbt_project.yml` ignored for custom materializations**
   - Issue: [#12706](https://github.com/dbt-labs/dbt-core/issues/12706)
   - Why it matters: Silent hook omission is especially dangerous because teams may assume governance, grants, or audit actions are running when they are not.
   - Community reaction: No comments yet, but this is a high-severity usability issue for custom materialization adopters.

9. **Compressed seed ingestion**
   - Issue: [#11860](https://github.com/dbt-labs/dbt-core/issues/11860)
   - Why it matters: Compressed seed support would improve repository ergonomics and reduce storage overhead for large seed-based workflows.
   - Community reaction: Still light activity, but it reflects persistent interest in making seed workflows more production-friendly.

10. **Re-evaluating performance benefits of dbt-extractor**
    - Issue: [#8674](https://github.com/dbt-labs/dbt-core/issues/8674)
    - Why it matters: This touches core parsing architecture and whether Rust-based static Jinja extraction still justifies its complexity.
    - Community reaction: Little recent discussion, but the issue remains strategically important as maintainers revisit performance and technical debt tradeoffs.

## 4. Key PR Progress

1. **Populate model constraints even when contracts are not enforced**
   - PR: [#12710](https://github.com/dbt-labs/dbt-core/pull/12710)
   - Importance: Broadens constraint metadata availability beyond strict contract enforcement, which could improve artifact completeness and downstream tooling behavior.

2. **Preserve case-insensitive env var lookup on Windows**
   - PR: [#12681](https://github.com/dbt-labs/dbt-core/pull/12681)
   - Importance: Fixes a platform-specific regression where `env_var()` could fail if casing differed from the OS environment variable definition.

3. **Backport for independent sqlparse token/depth defaults**
   - PR: [#12696](https://github.com/dbt-labs/dbt-core/pull/12696)
   - Importance: Indicates continued hardening around SQL parsing limits and safer defaults, with a backport path for stable users.

4. **Fix selection bug behind `_show` test skipping**
   - PR: [#12562](https://github.com/dbt-labs/dbt-core/pull/12562)
   - Importance: Community-submitted fix for a small but impactful selection bug caused by substring-style logic instead of tuple membership checking.

5. **Support for `.env` files**
   - PR: [#12711](https://github.com/dbt-labs/dbt-core/pull/12711)
   - Importance: Direct implementation for one of the day’s most visible feature requests, potentially improving local development ergonomics.

6. **Analyses project-level config support**
   - PR: [#12709](https://github.com/dbt-labs/dbt-core/pull/12709)
   - Importance: Extends project-level configuration consistency to analyses, addressing a long-standing capability gap for teams organizing non-model SQL assets.

7. **Warn on unknown flags in `dbt_project.yml`**
   - PR: [#12689](https://github.com/dbt-labs/dbt-core/pull/12689)
   - Importance: A meaningful UX improvement aimed at catching typos and invalid config before they become silent misconfigurations.

8. **Partial parser fix for access changes via config block**
   - PR: [#12563](https://github.com/dbt-labs/dbt-core/pull/12563)
   - Importance: Improves reparse/revalidation scheduling when model access changes to private, reducing stale graph state during partial parsing.

9. **Function property changes now detected by `state:modified`**
   - PR: [#12548](https://github.com/dbt-labs/dbt-core/pull/12548) — Closed
   - Importance: This fix already landed and closes an issue where YAML property changes for `resource_type:function` were missed in state comparison workflows.

10. **Catalog loading coupled with manifest loading**
    - PR: [#12705](https://github.com/dbt-labs/dbt-core/pull/12705) — Closed
    - Importance: Addresses command behavior around catalog requirements and reflects ongoing cleanup of artifact-loading expectations across subcommands.

## 5. Feature Request Trends
Several feature directions are emerging clearly from the current issue set:

- **Stricter configuration validation**
  - Requests around strict `flags:` handling and warnings for unknown configuration keys show strong demand for fail-fast behavior and less silent acceptance of invalid project settings.
- **Better environment and local-dev ergonomics**
  - `.env` support and Windows environment variable handling both point to a broader need for more predictable environment configuration across platforms.
- **Stronger support for database functions as first-class dbt resources**
  - Multiple new issues focus on function materialization lifecycle management, including `--full-refresh`, hook behavior, property diffing, and SQL safety checks.
- **More reliable selection/state semantics**
  - Bugs around `dbt test --select` and `state:modified` indicate ongoing demand for precise graph selection and artifact diffing.
- **Operational scalability improvements**
  - Compressed seeds and parser/performance re-evaluation both reflect interest in making dbt easier to run at larger project sizes and data volumes.

## 6. Developer Pain Points
Recurring frustrations in the latest activity include:

- **Silent failures or silent ignores**
  - Unknown `flags:` entries, ignored `post_hook` configs for custom materializations, and subtle SQL function name-shadowing problems all share the same theme: dbt often does not warn loudly enough when something important is being misconfigured or skipped.
- **Function resource maturity gaps**
  - Users managing UDFs/functions in dbt are surfacing multiple rough edges at once: state comparison, refresh semantics, hook execution, and DDL limitations.
- **Cross-platform environment inconsistencies**
  - Windows env var behavior and demand for `.env` support show that environment resolution remains a source of friction.
- **Selection and parser edge cases**
  - Node selection bugs and partial parsing/revalidation issues continue to affect trust in incremental development workflows.
- **Dependency and tooling drift**
  - Compatibility with upcoming mypy versions highlights the maintenance burden for contributors and teams integrating dbt-core into stricter Python toolchains.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-26

## 1. Today's Highlights
Spark activity over the last 24 hours centered on two themes: a potentially important runtime/security discussion around Spark 4.x, and a concrete correctness bug affecting AES-GCM RPC encryption on YARN. On the development side, the PR stream was especially active in SQL, PySpark, pandas API on Spark, and Structured Streaming, with several changes aimed at API consistency, error-message quality, and execution/runtime correctness.

## 2. Hot Issues

> Note: Only 2 issues were updated in the last 24 hours, so the digest includes all noteworthy issue activity available from the provided dataset.

1. **Security vulnerabilities on Spark version 4.0.2**  
   [#55012](https://github.com/apache/spark/issues/55012)  
   This issue asks for a release plan addressing reported security vulnerabilities in Spark 4.0.2, noting that many may still be present in 4.1.1. It matters because users running Spark in enterprise environments need clarity on patch timelines and upgrade guidance, especially where compliance and vulnerability scanning are mandatory.  
   **Community reaction:** limited visible discussion so far (2 comments), but the topic is strategically important because it affects upgrade planning and production risk management.

2. **AES-GCM for RPC encryption does not work on YARN**  
   [#54999](https://github.com/apache/spark/issues/54999)  
   This open bug reports that AES-GCM RPC encryption support breaks when multiple messages are sent per channel in YARN deployments, causing post-authentication RPC traffic to be dropped or corrupted. This is high-impact because it affects secure cluster operation and can make YARN containers hang until killed.  
   **Community reaction:** no comments yet, but the issue is technically significant and likely to draw quick maintainer attention because it impacts a security-sensitive path and a major resource manager integration.

## 3. Key PR Progress

1. **Catch Spark Connect analysis errors earlier in pandas-on-Spark `.loc`**  
   [#55027](https://github.com/apache/spark/pull/55027)  
   Improves the pandas-on-Spark indexing path under Spark Connect so analysis failures are surfaced before `InternalFrame.__init__`. This should make `.loc` failures more predictable and easier to debug in Connect-based workflows.

2. **Refactor Arrow stream serializers for grouped and cogrouped paths**  
   [#55026](https://github.com/apache/spark/pull/55026)  
   Extracts `ArrowStreamGroupSerializer` and `ArrowStreamCoGroupSerializer` from the general Arrow stream serializer. This is a maintainability improvement that should make grouped Arrow execution paths easier to reason about and evolve.

3. **Close feature gaps between `spark.catalog.*` APIs and DDL commands**  
   [#55025](https://github.com/apache/spark/pull/55025)  
   Works toward parity between catalog APIs and SQL DDL behavior, especially around cached tables. This matters for users who mix programmatic metadata access with SQL administration and expect consistent semantics.

4. **Align pandas-on-Spark `groupby().idxmax/idxmin(skipna=False)` with pandas 2/3**  
   [#55021](https://github.com/apache/spark/pull/55021)  
   Updates behavior to better match upstream pandas across version boundaries. This is important for compatibility and reduces migration surprises for users porting pandas workloads to Spark.

5. **Replace legacy DSv2 connector error codes with named errors**  
   [#54971](https://github.com/apache/spark/pull/54971)  
   Replaces temporary legacy error codes in the Data Source V2 connector API with descriptive named error conditions. This improves diagnosability for connector developers and downstream integrators.

6. **Improve error messages for `VIEW ... WITH SCHEMA EVOLUTION` failures**  
   [#55024](https://github.com/apache/spark/pull/55024)  
   Enhances messaging when automatic schema synchronization for evolving views fails, for example due to permissions. Better diagnostics here can reduce time spent debugging catalog-related failures in managed environments.

7. **Add `INSERT INTO ... REPLACE ON/USING` SQL syntax**  
   [#54722](https://github.com/apache/spark/pull/54722)  
   Proposes richer `INSERT` semantics for conditional row replacement. If merged, this would expand Spark SQL’s data modification expressiveness and could simplify ETL/upsert-style workflows.

8. **Integrate checkpoint V2 with auto-repair snapshots in Structured Streaming**  
   [#55015](https://github.com/apache/spark/pull/55015)  
   Adds corruption recovery logic to the checkpoint V2 load path. This is one of the more operationally important PRs in flight because it improves resiliency for stateful streaming jobs.

9. **Backport unified Arrow conversion error handling for UDFs/UDTFs to 4.1**  
   [#55011](https://github.com/apache/spark/pull/55011)  
   Brings improved and more consistent Arrow conversion error messages into the 4.1 branch. This should help PySpark users troubleshoot vectorized execution failures more effectively on a stable line.

10. **Prototype DSv2-aware `df.cache()` for optimizer pushdown rules**  
    [#55017](https://github.com/apache/spark/pull/55017)  
    This WIP proposes wiring `df.cache()` through DSv2 interfaces so optimizer rules like `V2ScanRelationPushDown` can still apply. If it progresses, it could improve performance and planning consistency for DSv2-backed sources.

## 4. Feature Request Trends

Based on the current issue and PR activity, the strongest feature directions are:

- **Better SQL data modification ergonomics**  
  Spark contributors continue pushing toward richer SQL write/update semantics, exemplified by conditional `INSERT ... REPLACE` syntax. This reflects demand for warehouse-style DML that is easier to express natively in Spark SQL.

- **API consistency across SQL, catalog APIs, and pandas compatibility layers**  
  Multiple changes aim to align behavior between DDL and `spark.catalog.*`, and between pandas-on-Spark and upstream pandas. Users clearly want fewer semantic mismatches across interfaces.

- **Stronger error reporting and diagnosability**  
  Named errors in DSv2, improved schema-evolution messages, and unified Arrow conversion failures all point to a broad effort to make Spark easier to operate and debug.

- **More resilient streaming/state management**  
  Structured Streaming checkpoint recovery improvements suggest continued demand for self-healing mechanisms in long-running stateful pipelines.

- **Cleaner internals for Arrow and Python execution**  
  Serializer refactors and Python typing/error-class utilities indicate sustained investment in PySpark maintainability and developer ergonomics.

## 5. Developer Pain Points

- **Security and patch visibility remain a concern**  
  The security vulnerability issue highlights a recurring frustration: users need clearer remediation status and release timelines for known vulnerabilities across supported branches.

- **Secure runtime paths can still fail in deployment-specific environments**  
  The AES-GCM-on-YARN bug shows how features that look complete in principle may still break under real cluster managers, creating operational risk for production adopters.

- **Inconsistent behavior across APIs increases cognitive overhead**  
  Differences between SQL DDL, catalog APIs, Spark Connect behavior, and pandas-on-Spark compatibility continue to generate friction for developers moving between interfaces.

- **Diagnostics are often not actionable enough**  
  Several PRs directly target poor or ambiguous error messages, reinforcing that developers still spend too much time tracing failures through internal abstractions.

- **Advanced execution paths need better maintainability**  
  Ongoing refactors in Arrow serialization, Python typing, and DSv2 error handling suggest contributors are still paying down complexity in areas that power high-performance and extension-heavy use cases.

## 6. Releases

No new releases were published in the last 24 hours.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait Community Digest — 2026-03-26

## 1. Today’s Highlights
Substrait activity over the last 24 hours centered on two themes: continued expansion of the function/type surface area and deeper cleanup of core semantics and build tooling. The most notable discussions were a new issue proposing a more robust model for outer-reference resolution, alongside active PRs covering build reproducibility, list functions, extension relation documentation, and several spec-breaking cleanup items.

## 2. Hot Issues

> Only 1 issue was updated in the last 24 hours.

- [#1024 Unified outer reference handling with common subexpression](https://github.com/substrait-io/substrait/issues/1024)  
  This issue tackles a core semantic challenge in Substrait’s current offset-based outer-reference model, especially in nested plans where implementers must walk relation trees and understand exact binding boundaries. It matters because correlated subqueries and common subexpression handling are foundational for interoperable query plans, and ambiguity here can lead to inconsistent engine behavior. Community reaction is still early: the issue is newly opened and has no comments yet, but it signals an important design-area discussion rather than a narrow bug report.

## 3. Key PR Progress

- [#1021 build: use pixi to manage build environment](https://github.com/substrait-io/substrait/pull/1021)  
  Proposes moving Substrait’s build workflow to `pixi`, consolidating environment setup and reducing manual prerequisites. This is important for contributor onboarding, CI consistency, and reproducible local development.

- [#987 feat: add has_overlap function to functions_list.yaml](https://github.com/substrait-io/substrait/pull/987)  
  Adds a `has_overlap` scalar function for checking whether two lists share common elements. This continues Substrait’s push to make collection semantics more portable across engines.

- [#1018 docs: clarify output schema handling for extension relations](https://github.com/substrait-io/substrait/pull/1018)  
  Clarifies that extension relation output schemas cannot be inferred the same way as standard relations and must be defined by the extension itself. This documentation change is highly relevant to engine implementers building custom relations and serializers.

- [#1020 feat(extensions): add subscript_operator and index_of functions](https://github.com/substrait-io/substrait/pull/1020)  
  Introduces two common list-oriented functions: element access and position lookup. These are practical additions for SQL interoperability, especially where engines need canonical semantics for list processing.

- [#1019 feat(extensions)!: deprecate std_dev and variance using function options](https://github.com/substrait-io/substrait/pull/1019)  
  A breaking-change PR that deprecates option-based signatures for `std_dev` and `variance` in favor of enum arguments. This is part of a broader effort to simplify and standardize function signature modeling.

- [#978 feat(extensions): add fp16, decimal256, and duration extension types](https://github.com/substrait-io/substrait/pull/978)  
  Adds new extension types for `fp16`, `decimal256`, and `duration`, with corresponding arithmetic overloads. This expands Substrait’s expressiveness for analytical engines with richer type systems.

- [#994 [PMC Ready] feat!: remove deprecated time, timestamp and timestamp_tz types](https://github.com/substrait-io/substrait/pull/994)  
  Removes deprecated temporal types across protobuf definitions, grammar, docs, tests, and extension YAMLs. This is one of the most significant active cleanup efforts and indicates the project is serious about reducing legacy surface area.

- [#945 [PMC Ready] feat: add current_date, current_timestamp and current_timezone variables](https://github.com/substrait-io/substrait/pull/945)  
  Adds execution-context variables commonly required for SQL compatibility. These variables are important for representing non-deterministic or environment-dependent expressions in a standard way.

- [#1012 [PMC Ready] feat(extensions): support int arguments with std_dev and variance functions](https://github.com/substrait-io/substrait/pull/1012)  
  Extends aggregate support so `std_dev` and `variance` can accept integer inputs, leveraging the newer enum-argument approach. This improves practical usability and closes type coverage gaps for analytics workloads.

## 4. Feature Request Trends
Based on current issue and PR activity, the strongest feature direction is toward **more complete SQL and engine interoperability**, especially around collection functions, execution-context variables, richer numeric types, and standardized aggregate signatures. A second clear trend is **tightening semantic precision**: outer-reference resolution, extension-relation schema rules, and deprecation/removal of legacy types all point to the community prioritizing clearer contracts for implementers. Finally, there is growing momentum around **developer ergonomics**, with build environment simplification emerging as an important contributor concern.

## 5. Developer Pain Points
The most visible pain point is **semantic ambiguity in complex plans**, especially for nested scopes, correlated references, and reusable subexpressions; issue #1024 is the clearest signal of this. Another recurring frustration is **spec evolution overhead**: several active PRs involve deprecations, signature migrations, and type removals, which can be valuable long term but create churn for engine maintainers. A third pain point is **setup and tooling friction**, reflected in the push to centralize build dependencies with `pixi` and reduce fragmented local environment steps.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*