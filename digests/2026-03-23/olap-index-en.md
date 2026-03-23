# OLAP Ecosystem Index Digest 2026-03-23

> Generated: 2026-03-23 01:23 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — OLAP Data Infrastructure Ecosystem  
**Date:** 2026-03-23

## 1. Ecosystem Overview
The current OLAP data infrastructure landscape shows a strong emphasis on **correctness, resilience, and developer ergonomics** rather than headline feature launches. Across dbt-core, Spark, and Substrait, communities are prioritizing safer execution behavior, clearer diagnostics, and more predictable semantics in production workflows. Spark remains the most execution-engine-centric and optimizer-heavy project, dbt-core is focused on workflow reliability and UX in analytics engineering, and Substrait continues to mature as a specification layer through precision fixes and metadata improvements. Overall, the ecosystem appears to be moving from rapid feature expansion toward **hardening core behavior for enterprise-scale adoption and interoperability**.

## 2. Activity Comparison

| Project | Hot Issues Today | Active / Notable PRs Today | Release Status |
|---|---:|---:|---|
| **dbt-core** | 10 | 2 | No new release |
| **Apache Spark** | 1 | 10 | No new release |
| **Substrait** | 0 | 0 | **v0.86.0 released** |

### Notes
- **dbt-core** had the broadest issue backlog surfaced today, mostly around correctness, config semantics, and developer experience.
- **Spark** showed the highest visible PR velocity, especially in SQL optimizer, AQE resilience, and test stability.
- **Substrait** was quiet in issue/PR traffic but had the most concrete ship event via a new release.

## 3. Shared Feature Directions

### A. Stronger correctness guarantees
**Projects:** dbt-core, Spark, Substrait  
**Specific needs:**
- **dbt-core:** source freshness timezone support, uniqueness test correctness, partial parsing correctness, state/defer precedence
- **Spark:** empty-table grouping semantics, broadcast join failure fallback, Parquet/test regression fixes
- **Substrait:** corrected extension signatures and return types

**Takeaway:** All three communities are investing in reducing semantic ambiguity and preventing silent incorrect behavior.

### B. Better failure handling and resilience
**Projects:** dbt-core, Spark  
**Specific needs:**
- **dbt-core:** fail-fast selector syntax, offline telemetry timeout, multiprocessing exception hangs
- **Spark:** AQE fallback from failed broadcast joins to shuffle joins, preview regression containment

**Takeaway:** Users increasingly expect systems to degrade gracefully instead of failing unpredictably.

### C. Improved developer ergonomics and diagnostics
**Projects:** dbt-core, Spark, Substrait  
**Specific needs:**
- **dbt-core:** clearer deprecation guidance, better node-type-aware error messages
- **Spark:** improved contributor workflow docs, better Python observability APIs
- **Substrait:** optional descriptions for improved spec/tooling readability

**Takeaway:** Documentation and error quality are now treated as product features, not just maintenance work.

### D. Interoperability and embedded/programmatic usage
**Projects:** dbt-core, Spark, Substrait  
**Specific needs:**
- **dbt-core:** programmatic invocation parity with CLI behavior
- **Spark:** Python API parity, Spark Connect literal handling
- **Substrait:** more precise extension contracts for engines, validators, and tooling

**Takeaway:** The ecosystem increasingly assumes tools will be embedded in larger platforms, not used only through native CLIs.

## 4. Differentiation Analysis

### dbt-core
- **Scope:** Analytics engineering workflow layer
- **Target users:** Analytics engineers, data platform teams, transformation pipeline owners
- **Technical approach:** Declarative SQL modeling, testing, selection, state-aware builds
- **Current focus:** Predictability of project behavior, test semantics, parsing correctness, config precedence

dbt-core’s issues are closest to the day-to-day workflow problems faced by analytics teams: naming, selection syntax, freshness logic, state handling, and test trustworthiness.

### Apache Spark
- **Scope:** General-purpose distributed compute and SQL execution engine
- **Target users:** Data engineers, platform engineers, ML practitioners, engine contributors
- **Technical approach:** Runtime optimizer, distributed execution, adaptive query planning, broad API surface
- **Current focus:** Query resilience, optimizer rewrites, execution correctness, infrastructure/test stability

Spark’s activity is deeper in execution internals and engine behavior, reflecting its role as the system of record for large-scale compute performance and runtime correctness.

### Substrait
- **Scope:** Cross-engine query plan and function specification standard
- **Target users:** Engine implementers, interoperability/tooling developers, standards-oriented platform teams
- **Technical approach:** Spec-driven interoperability via formal plan and function contracts
- **Current focus:** Signature correctness, type semantics, metadata/documentation quality

Substrait is distinct in being a **coordination layer** rather than an end-user runtime or workflow tool; its changes are fewer but can have broad downstream interoperability impact.

## 5. Community Momentum & Maturity

### Most active community by visible engineering throughput: **Apache Spark**
Spark has the highest PR volume today and a wide spread of active work across SQL, ML, YARN, Python, and contributor tooling. This suggests a large, mature contributor base with parallel workstreams.

### Most user-friction-driven issue activity: **dbt-core**
dbt-core shows more surfaced end-user pain points than code throughput today. Its activity pattern indicates an active and engaged community focused on usability and correctness in real production workflows.

### Fastest spec-level iteration with lower traffic: **Substrait**
Substrait has low day-to-day GitHub churn but meaningful release impact. Its maturity pattern is typical of a specification project: fewer events, but each release can require downstream implementer action.

### Maturity read
- **Spark:** highly mature, broad surface area, continuous incremental refinement
- **dbt-core:** mature but still actively smoothing workflow and behavior edge cases as adoption deepens
- **Substrait:** earlier in ecosystem maturity than Spark/dbt, but increasingly important as interoperability expectations rise

## 6. Trend Signals

### 1. Reliability is now a competitive feature
Communities are prioritizing semantic correctness, stable fallbacks, and trustworthy validation. For data engineers, this means tool evaluation should increasingly include edge-case behavior, not just performance or feature breadth.

### 2. Developer experience is shifting from “nice to have” to core platform value
Error messages, deprecation guidance, and clearer docs are recurring investment areas. This is especially relevant for teams operating large shared data platforms, where debugging cost often outweighs raw execution cost.

### 3. Programmatic and multi-interface usage is becoming standard
dbt embedding, PySpark observability, Spark Connect hardening, and Substrait contract precision all point toward a more composable ecosystem. Data engineers should expect future tooling choices to hinge on API stability and integration friendliness.

### 4. Runtime adaptability is increasingly expected
Spark’s AQE fallback work and dbt’s fail-fast/config-precedence concerns reflect a broader demand for systems that respond safely to real runtime conditions. This matters for production SLAs, especially in heterogeneous lakehouse and warehouse environments.

### 5. Interoperability standards are gaining practical importance
Substrait’s release demonstrates that spec-level fixes can be breaking and operationally relevant. For teams building cross-engine stacks, standards maturity is becoming a strategic consideration rather than an abstract one.

### Practical reference value for data engineers
- If you are optimizing **query execution and platform resilience**, Spark remains the strongest signal source.
- If you are focused on **analytics workflow reliability and transformation governance**, dbt-core’s issue stream is highly relevant.
- If your roadmap involves **cross-engine portability, federation, or shared semantic contracts**, Substrait deserves close monitoring despite lower daily activity.

If you want, I can also convert this into:
1. a **one-page executive briefing**,  
2. a **Slack update**, or  
3. a **scored comparison matrix** for architecture review.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

## Today's Highlights

dbt-core had no new releases in the last 24 hours, but community activity focused on usability and correctness in core workflows: source freshness, test semantics, selector syntax, state/defer behavior, and partial parsing. On the contribution side, two community PRs moved forward, both improving error quality and deprecation guidance—small changes with outsized impact on day-to-day developer experience.

## Hot Issues

1. **Source freshness needs timezone-aware configuration**  
   [#11066](https://github.com/dbt-labs/dbt-core/issues/11066) — `Add time_zone configuration for source freshness checks`  
   This matters for teams running freshness checks outside UTC, where current behavior can produce misleading staleness calculations. It has modest community support so far, but it touches a common enterprise need: making freshness SLAs reliable across regions.

2. **Custom test names not honored inside `config` blocks**  
   [#9740](https://github.com/dbt-labs/dbt-core/issues/9740) — `Custom test name not honoured in "config" blocks`  
   This affects test observability and naming consistency, especially for teams relying on customized test metadata in larger projects. The issue has a bit more visible community endorsement than most of today’s list, suggesting this is a practical annoyance rather than an edge case.

3. **Selector syntax should catch hanging `+` in intersections**  
   [#10388](https://github.com/dbt-labs/dbt-core/issues/10388) — `Warn or error when intersection selection syntax includes a hanging +`  
   This is a classic ergonomics request: users want dbt to fail fast on ambiguous selector syntax rather than silently doing the wrong thing. It reflects ongoing pressure to make model selection safer and more debuggable.

4. **Programmatic invocations lack a reliable `flags.INVOCATION_COMMAND`**  
   [#10313](https://github.com/dbt-labs/dbt-core/issues/10313) — ``flags.INVOCATION_COMMAND` for programmatic dbt invocations`  
   Important for embedding dbt in Python test harnesses, orchestration wrappers, and custom tooling. As dbt is increasingly used as a library as well as a CLI, parity gaps like this become more painful.

5. **CLI flags appear not to override `DBT_DEFER_STATE`**  
   [#11216](https://github.com/dbt-labs/dbt-core/issues/11216) — `CLI flags do not take precedence over env var DBT_DEFER_STATE`  
   This is a correctness and predictability issue in state-aware workflows. For CI/CD and promotion pipelines that depend on defer behavior, precedence rules must be explicit and trustworthy.

6. **dbt exceptions can hang under multiprocessing**  
   [#10527](https://github.com/dbt-labs/dbt-core/issues/10527) — `dbt's custom exceptions inside a multiprocessing context hangs`  
   This is particularly relevant for tool authors integrating dbt into parallelized workflows, linters, or test runners. Even with limited engagement, a hang is a severe failure mode and points to friction in nonstandard but increasingly common execution contexts.

7. **BigQuery uniqueness test reportedly passes with duplicates present**  
   [#11067](https://github.com/dbt-labs/dbt-core/issues/11067) — `Test for uniqueness passes when duplicates are present in BigQuery column`  
   If reproducible, this is one of the more serious open items because it undermines trust in built-in data tests. Community reaction is still light, but the implication is high impact for data quality enforcement.

8. **Anonymous tracking should fail fast when offline**  
   [#9989](https://github.com/dbt-labs/dbt-core/issues/9989) — `Quick connection timeout for anonymous snowplow tracking`  
   This highlights the need for better offline/degraded-network behavior. It matters most for local development, air-gapped environments, and lightweight adapters like DuckDB where startup latency is very noticeable.

9. **Partial parsing may ignore `alias` and invalidate cache incorrectly**  
   [#11289](https://github.com/dbt-labs/dbt-core/issues/11289) — ``alias` ignored and cache invalidation issue when using partial parse`  
   Partial parsing is critical to dbt performance, so correctness bugs here can be especially disruptive: they are intermittent, hard to diagnose, and can lead to confusing compile/parse outcomes. This is a good example of speed features creating trust issues when edge cases appear.

10. **Tests that edit profiles are not thread-safe**  
    [#9254](https://github.com/dbt-labs/dbt-core/issues/9254) — `Editing profiles as part of tests is not thread-safe`  
    This is more internal-facing, but it matters for contributors and maintainers working on adapter/plugin CI reliability. It also reinforces a broader theme in dbt-core: concurrency support is still a pain point in some test and execution paths.

## Key PR Progress

1. **Correct deprecation raised for generic test config placement**  
   [#12618](https://github.com/dbt-labs/dbt-core/pull/12618) — `fix: raise correct deprecation when config key is top-level in generic test`  
   This community PR improves a misleading deprecation path when properties like `where` are defined at the top level of a generic test. The fix is mainly about developer guidance, but it should reduce confusion during test migration and cleanup.

2. **Ambiguous identifier error now references the right node type**  
   [#12691](https://github.com/dbt-labs/dbt-core/pull/12691) — `Fix: improve error message for similar database identifiers to reference correct node type`  
   A targeted error-message improvement: instead of always saying “created by the model,” dbt will identify whether the conflicting object is tied to a source, seed, snapshot, or model. This should make catalog/debug workflows much clearer, especially for mixed resource types.

3. **PR trend: better generic test UX and migration messaging**  
   [#12618](https://github.com/dbt-labs/dbt-core/pull/12618)  
   While only one PR is explicitly in this lane today, it reflects an ongoing focus area: making generic test configuration errors more actionable and less opaque.

4. **PR trend: more precise node/resource typing in core errors**  
   [#12691](https://github.com/dbt-labs/dbt-core/pull/12691)  
   This is part of a larger quality-of-life arc in dbt-core—turning broadly correct but vague messages into resource-aware diagnostics that speed up issue resolution.

5. **Community contribution remains active**  
   [#12618](https://github.com/dbt-labs/dbt-core/pull/12618), [#12691](https://github.com/dbt-labs/dbt-core/pull/12691)  
   Both active PRs are community-authored, a positive signal for contributor engagement even on a relatively quiet day.

6. **Review-ready work is landing in core UX layers**  
   [#12618](https://github.com/dbt-labs/dbt-core/pull/12618)  
   Marked `ready_for_review`, this suggests maintainers are getting polished contributions around validation/deprecation behavior rather than only backend internals.

7. **Fresh PR activity around long-standing user confusion points**  
   [#12691](https://github.com/dbt-labs/dbt-core/pull/12691)  
   Opened and updated the same day, this PR responds to a known confusion point in catalog matching errors and shows continued incremental polish.

8. **Both PRs emphasize error correctness over net-new features**  
   [#12618](https://github.com/dbt-labs/dbt-core/pull/12618), [#12691](https://github.com/dbt-labs/dbt-core/pull/12691)  
   That’s notable because it aligns with the issue backlog: developers currently seem to want dbt-core to be more predictable and explain itself better.

9. **Testing and validation semantics remain a contribution hotspot**  
   [#12618](https://github.com/dbt-labs/dbt-core/pull/12618)  
   Generic tests continue to be an area where small core changes can remove a lot of downstream user confusion.

10. **Object resolution and catalog behavior remain under refinement**  
    [#12691](https://github.com/dbt-labs/dbt-core/pull/12691)  
    Even small wording changes in identifier-matching errors matter in larger warehouses where similar object names are common and debugging ambiguity is costly.

## Feature Request Trends

- **Better correctness and configurability for validation workflows**  
  Freshness checks, uniqueness tests, and generic test configuration continue to drive requests. Users want dbt’s built-in validation primitives to be both more accurate and more adaptable to real warehouse conditions.

- **Stronger CLI/programmatic parity**  
  Requests like `flags.INVOCATION_COMMAND` show that users increasingly embed dbt in custom Python tooling and expect first-class support for non-CLI execution patterns.

- **Safer, more explicit command behavior**  
  Selector syntax warnings and state/env precedence fixes point to demand for fail-fast behavior and unambiguous configuration rules.

- **Performance features must remain trustworthy**  
  Partial parsing issues underscore that speed optimizations are only valuable if they preserve deterministic behavior.

- **Improved offline and infrastructure-aware ergonomics**  
  Fast timeouts for telemetry/network calls and better handling of git tag output show continued interest in making dbt robust across constrained or heterogeneous environments.

## Developer Pain Points

- **Confusing or misleading error/deprecation messages**  
  Both active PRs and several issues point to the same frustration: dbt often has the right underlying model, but the surfaced message can send users in the wrong direction.

- **Non-determinism in advanced workflows**  
  Partial parsing, state/defer resolution, and multiprocessing hangs all create intermittent behavior that is hard to reproduce and erodes confidence.

- **Selection and configuration syntax footguns**  
  Small syntax mistakes or precedence surprises can lead to silent misbehavior instead of obvious failures, costing time in debugging.

- **Cross-environment inconsistencies**  
  Time zones, env vars, offline execution, and adapter-specific behavior—especially BigQuery—remain recurring sources of friction.

- **Contributor/maintainer test infrastructure debt**  
  Thread-safety issues, legacy directory cleanup, and CI/test-organization tech debt are still present in the backlog, suggesting ongoing maintenance burden beneath user-facing features.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-23

## 1. Today's Highlights
Spark saw no new releases in the last 24 hours, but activity focused on SQL optimizer work, adaptive execution resilience, and a notable ML test regression in Spark 4.2.0-preview3. The most actionable development is a newly opened fix PR for a corrupted Parquet footer error affecting `DecisionTreeClassifierSuite` under Scala 2.13, alongside several SQL improvements targeting AQE fallback behavior, join optimization, and correctness for grouping semantics.

## 2. Hot Issues

### 1. DecisionTreeClassifierSuite fails in Spark 4.2.0-preview3 with corrupted Parquet footer error
- **Issue:** [#54916](https://github.com/apache/spark/issues/54916)
- **Area:** ML / Parquet / Scala 2.13 / test stability
- **Why it matters:** This is the only issue updated in the last 24 hours and it affects Spark 4.2.0-preview3 test reliability. The regression appears in ML tree test suites and may indicate a behavioral change introduced by earlier Parquet-related work, with implications for preview release quality and Scala 2.13 compatibility.
- **Community reaction:** Early but concrete: the bug report is reproducible, references a suspected upstream PR, and already has a linked fix PR, suggesting fast maintainer and contributor attention.

## 3. Key PR Progress

### 1. AQE fallback from failed broadcast joins to shuffle joins
- **PR:** [#54925](https://github.com/apache/spark/pull/54925)
- **Area:** SQL / AQE
- **What it does:** Adds an opt-in adaptive fallback path so Spark can recover from broadcast join failures caused by size or row-limit overruns by switching to shuffle joins instead of failing the query.
- **Why it matters:** This improves robustness in production SQL workloads where cardinality estimates or runtime data characteristics make broadcast joins brittle.

### 2. Fix Parquet footer error in DecisionTree test suites by caching RDDs
- **PR:** [#54941](https://github.com/apache/spark/pull/54941)
- **Area:** ML / test infrastructure
- **What it does:** Proposes caching RDDs used in tree model test setup to avoid `CANNOT_READ_FILE_FOOTER` failures seen in `DecisionTreeClassifierSuite` and `DecisionTreeRegressorSuite`.
- **Why it matters:** It is the direct response to issue [#54916](https://github.com/apache/spark/issues/54916) and may unblock Spark 4.2.0-preview3 validation for Scala 2.13.

### 3. Simplify schema calculation for Merge Into schema evolution
- **PR:** [#54934](https://github.com/apache/spark/pull/54934)
- **Area:** SQL
- **What it does:** Reworks merge schema evolution internals by replacing `sourceSchemaForSchemaEvolution` with `pendingChanges` and reducing path-based comparisons.
- **Why it matters:** This is maintainability work in a complex SQL write path, likely reducing logical complexity and future bug surface in schema evolution handling.

### 4. Fix missing grand total row for ROLLUP/CUBE on runtime-empty tables
- **PR:** [#54938](https://github.com/apache/spark/pull/54938)
- **Area:** SQL correctness
- **What it does:** Introduces a new optimizer rule, `SplitEmptyGroupingSet`, to preserve correct grand-total semantics for `ROLLUP`/`CUBE` queries when input tables are empty at runtime.
- **Why it matters:** This is a correctness fix for analytical SQL behavior, especially relevant to BI-style aggregate workloads.

### 5. Push down Join through Union when the right side is broadcastable
- **PR:** [#54865](https://github.com/apache/spark/pull/54865)
- **Area:** SQL optimizer
- **What it does:** Adds `PushDownJoinThroughUnion`, transforming joins over unions into unions of joins when the right side is broadcastable.
- **Why it matters:** This could unlock better plans and lower execution cost for union-heavy ETL and federated query patterns.

### 6. Improve AGENTS.md with inline build/test commands and PR workflow guidance
- **PR:** [#54899](https://github.com/apache/spark/pull/54899)
- **Area:** Infra / contributor workflow
- **What it does:** Rewrites `AGENTS.md` with clearer build/test commands, PR workflow details, and development notes intended for AI coding agents and contributors.
- **Why it matters:** Better contributor tooling and workflow docs can reduce friction for both human developers and automated assistants working in the Spark codebase.

### 7. Add ActiveProcessorCount JVM option to YARN executor and AM
- **PR:** [#51948](https://github.com/apache/spark/pull/51948)
- **Area:** YARN / Core
- **What it does:** Passes `ActiveProcessorCount` to YARN-launched JVMs so the JVM respects Spark-configured CPU limits rather than all node cores.
- **Why it matters:** This is significant for resource isolation and more predictable thread-pool and GC behavior in multi-tenant YARN environments.

### 8. Add getExecutorInfos to StatusTracker in Python
- **PR:** [#54389](https://github.com/apache/spark/pull/54389)
- **Area:** Python API
- **What it does:** Exposes executor info retrieval via Python `StatusTracker`.
- **Why it matters:** Improves parity with JVM-side observability and helps PySpark users inspect cluster state programmatically.

### 9. Rework Spark Connect literal handling
- **PR:** [#53430](https://github.com/apache/spark/pull/53430)
- **Area:** Connect / SQL / ML / Python
- **What it does:** Refactors literal handling in Spark Connect, including removal of an unshipped `dataType` field that could create inconsistent literal states.
- **Why it matters:** Connect remains a strategic interface, and correctness in literal encoding is foundational for multi-language clients.

### 10. Path (WIP)
- **PR:** [#54869](https://github.com/apache/spark/pull/54869)
- **Area:** Unclear / WIP
- **What it does:** Still marked work-in-progress with minimal exposed detail.
- **Why it matters:** Limited information so far, but its active status suggests ongoing design or API work that may become clearer in coming days.

## 4. Feature Request Trends
Based on current issue and PR activity, the strongest development directions are:

- **More resilient adaptive query execution:** Work like [#54925](https://github.com/apache/spark/pull/54925) shows clear demand for runtime recovery instead of hard query failures.
- **SQL optimizer expansion:** Several open PRs target plan rewrites and semantic correctness, including join-through-union and empty-grouping-set handling.
- **Better schema evolution and merge behavior:** Ongoing simplification in [#54934](https://github.com/apache/spark/pull/54934) signals continued investment in complex lakehouse-style write semantics.
- **Improved developer and operator observability:** Python status tracking and YARN CPU-awareness indicate demand for better introspection and resource control.
- **Spark Connect protocol hardening:** Literal handling work remains active, reflecting a broader push toward stronger client/server API stability.

## 5. Developer Pain Points
Recurring frustrations visible in today’s activity include:

- **Preview-release regressions and test instability:** The ML Parquet footer issue in [#54916](https://github.com/apache/spark/issues/54916) highlights the cost of subtle runtime or IO regressions, especially under Scala 2.13.
- **Runtime plan fragility in SQL:** Broadcast joins can still fail at execution time, motivating fallback mechanisms like [#54925](https://github.com/apache/spark/pull/54925).
- **Complexity in schema evolution code paths:** The need to simplify merge schema calculation suggests current logic is difficult to maintain and reason about.
- **Correctness edge cases on empty datasets:** Analytical SQL semantics over runtime-empty inputs remain a source of subtle bugs, as seen in [#54938](https://github.com/apache/spark/pull/54938).
- **Contributor workflow friction:** The existence of [#54899](https://github.com/apache/spark/pull/54899) shows that build/test navigation and contribution instructions still need streamlining.
- **Backlog churn from stale PRs:** Multiple PRs updated today were closed as stale, indicating some contributor work is aging out before review or merge.

## 6. Releases
No new Spark releases were published in the last 24 hours.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait Community Digest — 2026-03-23

## 1. Today's Highlights
Substrait published [v0.86.0](https://github.com/substrait-io/substrait/releases/tag/v0.86.0), with two breaking changes focused on extension correctness and function signature cleanup. The release also adds optional descriptions, signaling continued investment in spec clarity and metadata quality. No new issues or pull requests were updated in the last 24 hours, so today’s activity is centered entirely on the release.

## 2. Releases
### [v0.86.0](https://github.com/substrait-io/substrait/releases/tag/v0.86.0)
Released on 2026-03-22.

**Key changes**
- **Breaking:** fixed a random extraneous argument for `repeat varchar` in extensions. This likely affects implementers who generated or validated function signatures against the previous definition.
- **Breaking:** corrected the return type of `add:date_iyear`. Engines and tooling that depend on the old type contract may need updates.
- **Feature:** added **optional description** support, which should improve extension/spec readability and downstream tooling documentation.

**Why it matters**
This is a correctness-oriented release. For engine authors, validator maintainers, and codegen/tooling developers, the breaking changes are important because they tighten function semantics and reduce ambiguity in interoperability.

## 3. Hot Issues
No issues were updated in the last 24 hours in the Substrait repository.

## 4. Key PR Progress
No pull requests were updated in the last 24 hours in the Substrait repository.

## 5. Feature Request Trends
With no new or updated issues in the last 24 hours, there are no fresh feature-request signals from GitHub activity today. The only visible direction from the latest release is a continued push toward:
- **Better spec metadata and documentation**, via optional descriptions
- **More precise extension contracts**, via function signature and return type corrections

## 6. Developer Pain Points
Today’s release suggests two recurring implementation pain points in the Substrait ecosystem:
- **Extension signature drift and ambiguity** — breaking fixes to `repeat varchar` indicate that even small argument-definition issues can create downstream incompatibilities for engines and validators.
- **Type contract correctness** — the `add:date_iyear` return type correction highlights how sensitive interoperability is to exact type semantics.
- **Documentation discoverability** — the addition of optional descriptions implies ongoing demand for richer embedded documentation to help implementers interpret functions and extensions consistently.

If you'd like, I can also turn this into a shorter Slack-style update or a more newsletter-like version.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*