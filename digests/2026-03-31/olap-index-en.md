# OLAP Ecosystem Index Digest 2026-03-31

> Generated: 2026-03-31 01:28 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — OLAP Data Infrastructure Ecosystem  
**Date:** 2026-03-31

## 1. Ecosystem Overview
Across dbt-core, Apache Spark, and Substrait, the last 24 hours show an OLAP ecosystem focused less on headline releases and more on reliability, semantics, and operational usability. dbt-core activity emphasizes developer ergonomics, state correctness, and machine-readable artifacts; Spark is advancing SQL surface area, optimizer behavior, Python parity, and security hardening; Substrait continues tightening the spec through deprecation cleanup and type-system evolution. Taken together, the ecosystem is maturing around stronger interoperability contracts, better automation support, and fewer edge-case failures in production workflows. This is a healthy signal for data teams: foundational projects are investing in correctness and integration quality, not just new features.

## 2. Activity Comparison

| Project | Updated Issues Today | Notable PRs Today | Release Status |
|---|---:|---:|---|
| **dbt-core** | 7 | 10 key PRs + 5 additional notable PRs | No release |
| **Apache Spark** | 7 | 10 key PRs | No release |
| **Substrait** | 0 | 6 notable PRs | No release |

### Notes
- **dbt-core** had the highest visible mix of issue + PR activity oriented toward day-to-day user pain.
- **Spark** matched dbt on issue volume and key PR count, with broader surface area across SQL, runtime, Python, infra, and security.
- **Substrait** showed lower raw activity, but its PRs were disproportionately strategic because several are breaking spec cleanups.

## 3. Shared Feature Directions

### A. Better correctness and predictability in production behavior  
**Projects:** dbt-core, Spark, Substrait  
- **dbt-core:** state diff fidelity, selector correctness, artifact completeness, exception normalization  
- **Spark:** AQE correctness, columnar CBO modeling, shuffle timeout behavior, metadata fidelity  
- **Substrait:** deprecated field/type removal, stricter canonical semantics  
**Shared need:** teams want systems that behave deterministically across environments, query plans, and version upgrades.

### B. Stronger metadata, introspection, and machine-readable interfaces  
**Projects:** dbt-core, Spark  
- **dbt-core:** `run_results.json` improvements, `dbt list --output verbose`, catalogs tracking  
- **Spark:** `SHOW COLLATIONS`, richer `createTableLike` metadata propagation, DSv2/catal​​og improvements  
**Shared need:** orchestration, observability, governance, and automation increasingly depend on complete structured metadata rather than log scraping.

### C. SQL semantics expansion and alignment with user expectations  
**Projects:** Spark, Substrait  
- **Spark:** new `INSERT ... REPLACE ON/USING`, `SHOW COLLATIONS`, additional SQL/catalog surface  
- **Substrait:** integer support for `std_dev`/`variance`, current date/time variable proposals, broader type coverage  
**Shared need:** users expect warehouse-grade SQL behavior and fewer semantic gaps between logical plans, engine behavior, and standard SQL patterns.

### D. Cross-environment and cross-platform resilience  
**Projects:** dbt-core, Spark  
- **dbt-core:** line-ending normalization, case-sensitivity fixes, permission handling, git output handling  
- **Spark:** Apple Silicon test failures, Ubuntu temp-dir behavior, generated-code build issues  
**Shared need:** modern data platforms must work consistently across ARM laptops, containers, CI runners, Linux variants, and mixed developer environments.

### E. Governance and upgrade safety  
**Projects:** dbt-core, Substrait, Spark  
- **dbt-core:** Python 3.14 readiness, versioned model alias expectations  
- **Substrait:** breaking-change policy documentation, active removal of deprecated constructs  
- **Spark:** CI supply-chain pinning, security hardening, evolving defaults such as virtual threads  
**Shared need:** adopters want clearer lifecycle policy, safer upgrades, and fewer surprises from ecosystem drift.

## 4. Differentiation Analysis

### dbt-core
- **Scope:** analytics engineering workflow layer for transformation, testing, selection, artifacts, and DAG-oriented development.
- **Target users:** analytics engineers, BI platform teams, data model owners, CI/CD maintainers.
- **Technical approach:** declarative project metadata, compiler/runtime orchestration, artifact-driven automation, warehouse-native execution.
- **Current emphasis:** usability, state-based CI correctness, better failure messaging, and model lifecycle ergonomics.

### Apache Spark
- **Scope:** distributed execution engine spanning SQL, batch, streaming, Python APIs, cluster runtime, and storage/catalog integrations.
- **Target users:** data platform engineers, large-scale ETL teams, ML/data engineering users, engine contributors.
- **Technical approach:** general-purpose distributed compute engine with optimizer layers, runtime scheduling, DSv2 connectors, and multi-language APIs.
- **Current emphasis:** SQL feature expansion, optimizer/planner improvements, PySpark consistency, infra security, and runtime modernization.

### Substrait
- **Scope:** cross-engine query plan/specification layer for interoperability between systems.
- **Target users:** engine developers, connector authors, interoperability tooling builders, standards-oriented platform teams.
- **Technical approach:** formal specification, protobuf schema, extension model, semantic standardization.
- **Current emphasis:** spec simplification, deprecation enforcement, type/function coverage, and governance clarity.

### Bottom line
- **dbt-core** is optimizing the developer control plane for analytics workflows.
- **Spark** is evolving the execution plane for scalable data processing.
- **Substrait** is shaping the interchange/semantic contract layer between engines and tools.

## 5. Community Momentum & Maturity

### Most active communities today
- **Apache Spark** and **dbt-core** are the clear leaders in day-to-day visible community activity, each with **7 updated issues** and roughly **10 major PRs** highlighted.
- **Spark** appears broader in contributor footprint because activity spans SQL, Python, optimizer internals, security, and CI.
- **dbt-core** shows especially strong community responsiveness to practical user pain, including multiple small-but-important quality-of-life fixes.

### Most rapidly iterating
- **dbt-core** looks fastest in turning user pain into targeted fixes: snapshot validation output, temp table collisions, line-ending normalization, git behavior, permission errors, and artifact enhancements all point to quick iteration on real operator friction.
- **Spark** is rapidly iterating too, but often across deeper engine surfaces that may take longer to stabilize due to wider compatibility and runtime implications.
- **Substrait** has lower activity volume, but high-impact iteration: its changes are more architectural and governance-heavy than velocity-heavy.

### Maturity signals
- **dbt-core maturity:** strong focus on error taxonomy, selection semantics, and artifact quality suggests a product moving from feature growth toward operational polish.
- **Spark maturity:** active security hardening, CI pinning, planner refinements, and Java/Python consistency work are signs of a large mature project maintaining a very wide surface responsibly.
- **Substrait maturity:** breaking-change policy documentation and removal of deprecated constructs indicate movement from exploratory standard to more disciplined governance phase.

## 6. Trend Signals

### 1) Reliability and operability are now first-class product requirements
Community activity is heavily concentrated on state correctness, optimizer edge cases, clean errors, artifact completeness, and environment handling. For data engineers, this means tool selection should increasingly weigh operational behavior, not just feature checklists.

### 2) Structured metadata is becoming essential infrastructure
Both dbt-core and Spark are improving introspection and metadata propagation. This reflects an industry shift toward automation-native data platforms where observability, lineage, orchestration, and governance depend on stable machine-readable outputs.

### 3) SQL engines and surrounding tools are converging on richer semantic contracts
Spark is adding warehouse-like SQL ergonomics, while Substrait is tightening plan semantics and function/type coverage. The direction of travel is toward fewer gaps between author intent, optimizer representation, and engine execution.

### 4) Cross-platform developer experience matters more than before
ARM development, containerized execution, read-only environments, and CI heterogeneity are now common enough to drive core roadmap work. Data platform teams should expect tooling quality to be judged partly by how well it behaves outside the “standard Linux VM” assumption.

### 5) Versioning, compatibility, and governance are strategic differentiators
dbt-core’s versioned model discussion and Substrait’s breaking-change policy work both signal that upgrade safety is becoming a major adoption factor. Technical decision-makers should track not just features, but also deprecation discipline and compatibility guarantees.

### 6) Python remains a major control point in the data stack
Spark’s PySpark parity/performance work and dbt-core’s Python 3.14 dependency concerns show that Python ecosystem alignment remains strategically important across the OLAP stack. For teams standardizing internal platforms, Python compatibility windows should remain part of upgrade planning.

## Practical Takeaways for Data Engineers
- Choose **dbt-core** if your primary concern is analytics workflow productivity, CI/state selection, and artifact-driven orchestration.
- Choose **Spark** when execution scalability, SQL breadth, Python integration, and engine-level flexibility are the main requirements.
- Track **Substrait** if interoperability, portable plans, or multi-engine architecture matter to your roadmap.
- Across all three, expect 2026 priorities to center on **correctness, metadata quality, semantic clarity, and upgrade safety** rather than purely net-new headline features.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-03-31

## Today's Highlights
dbt-core activity over the last 24 hours centered on quality-of-life fixes, error handling, and state/selection correctness rather than major releases. Community PRs were especially strong, with multiple contributions targeting noisy stacktraces, artifact completeness, cross-platform state diffs, temp table collisions, and `dbt deps` edge cases.  
On the roadmap side, discussion continues around bigger modeling ergonomics: versioned model aliases to the latest version and the new epic for model freshness checks stand out as strategic themes.

## Hot Issues

1. **Versioned models: unsuffixed relation should point to latest version**  
   [Issue #7442](https://github.com/dbt-labs/dbt-core/issues/7442)  
   This remains one of the most visible open feature requests, with **100 👍 and 34 comments**. It matters because versioned models are much easier to adopt if downstream users can keep querying the stable, unsuffixed relation while producers manage version transitions behind the scenes. Community reaction indicates strong demand for a smoother producer/consumer contract in multi-project and model versioning workflows.

2. **Python 3.14 support blocked by dependency upgrades**  
   [Issue #12098](https://github.com/dbt-labs/dbt-core/issues/12098)  
   Support for Python 3.14 is a forward-compatibility issue that affects packaging, CI images, and enterprise upgrade planning. The issue points to required updates in `mashumaro` and possibly `pydantic`, making it more than a simple version bump. With **35 👍**, the community clearly cares about staying aligned with the Python ecosystem.

3. **[EPIC] Model freshness checks**  
   [Issue #12719](https://github.com/dbt-labs/dbt-core/issues/12719)  
   This newly opened epic is strategically important because it extends dbt’s freshness paradigm from sources toward models themselves. For teams operating layered DAGs and downstream SLAs, model freshness could become a major observability primitive. Early comments are limited, but the issue likely signals a significant upcoming design track.

4. **Warning for `dataset` key in sources was incorrect**  
   [Issue #12327](https://github.com/dbt-labs/dbt-core/issues/12327)  
   This bug is now closed, but it mattered because it generated misleading warnings for source definitions, especially in BigQuery-oriented projects. The underlying problem touched config validation and adapter-specific aliasing behavior, which can create confusion during migrations and upgrades. Its closure indicates active maintenance on deprecation/warning correctness.

5. **dbt should load env vars from root `.env` file**  
   [Issue #12106](https://github.com/dbt-labs/dbt-core/issues/12106)  
   Although closed, this request highlights a recurring desire for simpler local developer ergonomics. Environment variable loading is a common friction point for onboarding and containerized development. Even when not adopted directly, the request reflects pressure for dbt to reduce external setup burden.

6. **`state:modified` missed changes to function properties in YAML**  
   [Issue #12547](https://github.com/dbt-labs/dbt-core/issues/12547)  
   This bug is important for teams relying on state-based slim CI and selective builds. Missing function property changes means dbt can under-select impacted resources, reducing confidence in automated change detection. The issue’s closure suggests ongoing improvements to state comparison fidelity.

7. **Snapshot YAML validation produced a noisy stacktrace**  
   [Issue #12692](https://github.com/dbt-labs/dbt-core/issues/12692)  
   This was a smaller but meaningful papercut: users missing `strategy` and/or `unique_key` in YAML snapshots were seeing an intimidating stacktrace instead of a clean validation message. It matters because error clarity directly affects adoption and debugging speed, especially for less experienced users. The issue was turned around quickly.

> Note: Only 7 issues were updated in the source data during the last 24 hours, so this section includes all noteworthy issue activity rather than forcing 10 lower-signal entries.

## Key PR Progress

1. **Avoid false positive `AmbiguousCatalogMatchError` for case-only differences**  
   [PR #12644](https://github.com/dbt-labs/dbt-core/pull/12644)  
   An important fix for catalog matching behavior where identifiers differing only by case could trigger false ambiguity errors. This is especially relevant across warehouses and adapters with different case-sensitivity semantics.

2. **Suppress stacktrace when snapshot validation fails**  
   [PR #12700](https://github.com/dbt-labs/dbt-core/pull/12700)  
   Closed and directly tied to Issue #12692. It replaces an ugly Python stacktrace with cleaner dbt-style validation output when YAML snapshot config is incomplete.

3. **Replace Python Exceptions with `DbtException` subclasses**  
   [PR #12686](https://github.com/dbt-labs/dbt-core/pull/12686)  
   This foundational cleanup improves consistency in how dbt surfaces internal errors. It should help standardize CLI failure handling and reduce cases where raw Python exceptions leak through.

4. **Prototype `dbt list --output verbose`**  
   [PR #12752](https://github.com/dbt-labs/dbt-core/pull/12752)  
   A notable usability enhancement in progress. A more verbose listing mode could make selection debugging, metadata inspection, and automation workflows much easier.

5. **Fix selector inheritance where `exclude: test_name` was ignored**  
   [PR #12751](https://github.com/dbt-labs/dbt-core/pull/12751)  
   This addresses a subtle but impactful selector bug. For advanced teams using reusable selectors heavily, silent exclusion failures can produce incorrect execution sets and brittle CI behavior.

6. **Include exception message in `run_results.json` for `run-operation` failures**  
   [PR #12730](https://github.com/dbt-labs/dbt-core/pull/12730)  
   A strong operational improvement. Today some orchestrators must parse logs to understand `run-operation` failures; this change would make artifacts much more reliable as machine-readable sources of truth.

7. **Prevent unit test temp table collisions by including model name in alias**  
   [PR #12701](https://github.com/dbt-labs/dbt-core/pull/12701)  
   This fixes parallel execution hazards when unit tests on different models share the same name. It matters for teams scaling test suites with `--threads > 1`.

8. **Reduce Snowplow telemetry timeout from 5s to 1s**  
   [PR #12741](https://github.com/dbt-labs/dbt-core/pull/12741)  
   A practical performance fix: unreachable telemetry endpoints should not noticeably delay dbt command completion. This is the kind of quality-of-life change users immediately feel in constrained or locked-down network environments.

9. **Normalize line endings in `FileHash` to prevent false `state:modified` results**  
   [PR #12731](https://github.com/dbt-labs/dbt-core/pull/12731)  
   One of the more important CI-related PRs in this batch. It targets a classic cross-platform problem where Windows CRLF vs Linux LF line endings cause false positives in state-based selection.

10. **Handle permission errors gracefully when writing `package-lock.yml`**  
   [PR #12729](https://github.com/dbt-labs/dbt-core/pull/12729)  
   This improves behavior in read-only or containerized environments, where `dbt deps` can currently fail with an unhandled `PermissionError`. Better messaging here reduces friction for modern deployment setups.

### Additional notable PRs
- **Use `git tag --no-column` to avoid `dbt deps` breakage with columnar git output** — [PR #12728](https://github.com/dbt-labs/dbt-core/pull/12728)  
- **Implement `week` batch size for microbatch incremental strategy** — [PR #12749](https://github.com/dbt-labs/dbt-core/pull/12749)  
- **Add catalogs tracking** — [PR #12747](https://github.com/dbt-labs/dbt-core/pull/12747)  
- **Improve error message wording for similar database identifiers by node type** — [PR #12691](https://github.com/dbt-labs/dbt-core/pull/12691)  
- **Respect `name` in `{{ config() }}` blocks for singular data tests** — [PR #12745](https://github.com/dbt-labs/dbt-core/pull/12745)

## Feature Request Trends
- **Safer model lifecycle management:** The long-running demand in [#7442](https://github.com/dbt-labs/dbt-core/issues/7442) shows continued interest in better abstractions for versioned models, especially stable aliases to the latest version.
- **Richer freshness and observability semantics:** The new [model freshness epic](https://github.com/dbt-labs/dbt-core/issues/12719) suggests a push beyond source freshness toward health signals on transformed assets.
- **Better CLI and artifact ergonomics:** PR activity around verbose listing, `run_results.json` completeness, and clearer errors indicates strong demand for dbt to be easier to automate and debug.
- **Incremental strategy flexibility:** The `week` batch size PR points to ongoing appetite for more expressive incremental/microbatch controls.
- **Developer environment simplification:** Requests like root `.env` loading continue to surface, showing that local setup friction remains a meaningful theme.

## Developer Pain Points
- **State-based selection still has edge-case trust issues.** Between the closed function-property bug and the open line-ending normalization PR, teams clearly want `state:modified` to be deterministic across resource types and operating systems.
- **Error messages and stacktraces remain a frequent source of frustration.** Several fixes this cycle target misleading warnings, noisy tracebacks, missing artifact messages, and inaccurate error phrasing.
- **Cross-environment behavior is brittle in subtle ways.** Read-only filesystems, git output formatting, case sensitivity, and platform-specific line endings all surfaced in active PRs.
- **Selectors and test ergonomics need polish.** Bugs around inherited selector exclusions, singular test naming, and unit-test temp table collisions point to pain in larger, more automated dbt projects.
- **Operational metadata should be more complete and machine-readable.** Work on `run_results.json`, catalog tracking, and verbose list output reflects a broader need for dbt to integrate more cleanly with orchestration and observability tooling.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-31

## 1. Today's Highlights
Spark saw no new releases in the last 24 hours, but repository activity remained strong across SQL, Python, infrastructure, and security. The most notable themes were continued SQL surface expansion, optimizer and AQE correctness gaps, Python error/serialization improvements, and a security hardening PR for stream path traversal. On the issue side, developers are still surfacing environment-specific breakages and planner edge cases that matter for production reliability.

## 2. Hot Issues

> Note: only 7 issues were updated in the last 24 hours, so all noteworthy items are included below.

### 1) AQE misses optimizations with `TableCacheQueryStageExec`
- **Issue:** [#55094](https://github.com/apache/spark/issues/55094)
- **Why it matters:** This reports that Adaptive Query Execution does not coalesce small shuffle partitions when a `CACHE TABLE` wraps a query containing a shuffle. That could leave cached workloads with avoidable overhead and weaker runtime optimization than equivalent uncached plans.
- **Community signal:** Newly opened with no comments yet, but this is the kind of optimizer correctness issue that can affect broad SQL workloads, especially BI and iterative analytics patterns.

### 2) Apple Silicon unit tests fail with `UnsatisfiedLinkError`
- **Issue:** [#55093](https://github.com/apache/spark/issues/55093)
- **Why it matters:** Test failures tied to LevelDB-backed suites on macOS Apple Silicon point to ongoing multi-architecture build and native dependency friction. This affects contributors and downstream packagers using ARM-based development machines.
- **Community signal:** No discussion yet, but Apple Silicon compatibility remains strategically important as ARM becomes standard for developer laptops.

### 3) Shuffle connection timeout does not fail executor as expected
- **Issue:** [#55092](https://github.com/apache/spark/issues/55092)
- **Why it matters:** A running executor that does not terminate after repeated shuffle connection retries suggests ambiguity in failure handling and task lifecycle behavior. This can lead to stuck jobs, resource leakage, and harder production debugging.
- **Community signal:** Fresh report, but highly relevant for operators running older 3.1.x clusters in enterprise environments.

### 4) Ubuntu 25.10 `/tmp` access denied despite permissive mode
- **Issue:** [#55096](https://github.com/apache/spark/issues/55096)
- **Why it matters:** Environment-level filesystem behavior can break Spark startup or temp-file operations in surprising ways. As newer Linux distributions change defaults, these reports often reveal hidden assumptions in Java or Spark temp path handling.
- **Community signal:** No comments yet; still useful as an early warning for future distro compatibility issues.

### 5) Document return types for aggregate functions in PySpark docs
- **Issue:** [#54986](https://github.com/apache/spark/issues/54986)
- **Why it matters:** Missing return type documentation for `stddev`, `variance`, and related functions creates API ambiguity for users building typed pipelines or validating schema contracts. The reporter notes these functions appear to always return `DoubleType`.
- **Community signal:** A modest documentation thread with comments already, indicating practical user demand for clearer type guarantees in PySpark APIs.

### 6) CBO should model columnar operators more precisely
- **Issue:** [#55058](https://github.com/apache/spark/issues/55058)
- **Why it matters:** This proposes better cost modeling for columnar execution, including row/column conversion costs. As Spark increasingly mixes row-based and columnar operators, weak costing can cause suboptimal plans.
- **Community signal:** No comments yet, but this aligns with a broader community push toward smarter physical planning for modern vectorized execution paths.

### 7) Spark Connect common module compile error in 4.1.1
- **Issue:** [#55082](https://github.com/apache/spark/issues/55082)
- **Why it matters:** A compile-time problem in `spark-connect-common`, apparently around generated proto classes, directly affects contributors and integrators building Spark Connect-related modules from source.
- **Community signal:** Already closed after 4 comments, suggesting quick triage or guidance was provided. Even so, it highlights build ergonomics pain around generated artifacts.

## 3. Key PR Progress

### 1) New SQL syntax: `INSERT INTO ... REPLACE ON/USING`
- **PR:** [#54722](https://github.com/apache/spark/pull/54722)
- **What it does:** Adds richer `INSERT` replacement semantics via `REPLACE ON <condition>` and `REPLACE USING (<columns>)`.
- **Why it matters:** This is a meaningful SQL usability expansion, potentially simplifying upsert-like data modification patterns for lakehouse and warehouse users.

### 2) Security hardening for `NettyStreamManager.openStream`
- **PR:** [#55077](https://github.com/apache/spark/pull/55077)
- **What it does:** Adds canonical path validation to prevent path traversal in directory streaming paths.
- **Why it matters:** This is the most security-sensitive update in the current PR set and improves the safety of file-serving logic in Spark’s network layer.

### 3) Add `SHOW COLLATIONS` command
- **PR:** [#55099](https://github.com/apache/spark/pull/55099)
- **What it does:** Introduces SQL introspection for available collations.
- **Why it matters:** Collation support is becoming more important for SQL correctness, interoperability, and internationalization-sensitive workloads.

### 4) Pass richer table metadata in `createTableLike`
- **PR:** [#55101](https://github.com/apache/spark/pull/55101)
- **What it does:** Refactors `createTableLike` to propagate full `TableInfo`, including schema, partitioning, constraints, and owner.
- **Why it matters:** Better metadata fidelity improves catalog consistency and helps Spark behave more predictably with modern table/catalog abstractions.

### 5) Enable master REST virtual threads by default
- **PR:** [#55102](https://github.com/apache/spark/pull/55102)
- **What it does:** Switches `spark.master.rest.virtualThread.enabled` default from `false` to `true`.
- **Why it matters:** This continues Spark’s modernization on Java 21+, with potential scalability and thread-management benefits for cluster REST handling.

### 6) Add Java error classes to Python side
- **PR:** [#55100](https://github.com/apache/spark/pull/55100)
- **What it does:** Brings Java error classes into Python-facing behavior.
- **Why it matters:** This should improve cross-language error consistency, making PySpark failures easier to interpret and align with JVM-side semantics.

### 7) Re-enable `predict_batch_udf` caching test
- **PR:** [#55104](https://github.com/apache/spark/pull/55104)
- **What it does:** Restores a previously disabled test around `predict_batch_udf` caching.
- **Why it matters:** Small on the surface, but important for regression coverage in Python ML-adjacent execution paths.

### 8) Extract specialized Arrow stream serializers for group/cogroup
- **PR:** [#55026](https://github.com/apache/spark/pull/55026)
- **What it does:** Refactors `ArrowStreamSerializer` into dedicated serializers for grouped and cogrouped loading.
- **Why it matters:** This improves maintainability and likely prepares Spark Python execution for more specialized Arrow-based data exchange optimizations.

### 9) Add ASV benchmarks for window Arrow UDFs
- **PR:** [#55056](https://github.com/apache/spark/pull/55056)
- **What it does:** Adds ASV micro-benchmarks for `SQL_WINDOW_AGG_ARROW_UDF`.
- **Why it matters:** Benchmark coverage is critical as Spark extends Arrow-based Python execution paths and needs measurable performance baselines.

### 10) Pin third-party GitHub Actions to commit SHAs
- **PR:** [#55066](https://github.com/apache/spark/pull/55066)
- **What it does:** Replaces mutable CI action tags with pinned commit SHAs.
- **Why it matters:** This is a supply-chain and reproducibility improvement for Spark’s CI infrastructure and aligns with secure OSS maintenance practices.

## 4. Feature Request Trends

### SQL surface area keeps expanding
Recent PRs show sustained momentum around SQL syntax and metadata introspection:
- `INSERT ... REPLACE ON/USING` ([#54722](https://github.com/apache/spark/pull/54722))
- `SHOW COLLATIONS` ([#55099](https://github.com/apache/spark/pull/55099))
- v2 `DESCRIBE TABLE .. PARTITION` ([#55064](https://github.com/apache/spark/pull/55064))

**Trend:** The community is clearly pushing Spark SQL toward richer warehouse-style DDL/DML ergonomics and better catalog observability.

### DataSource V2 and catalog correctness remain a priority
Multiple PRs target DSv2 planner ergonomics, metadata handling, and optimizer integration:
- Simplify extraction from `DataSourceV2ScanRelation` ([#55070](https://github.com/apache/spark/pull/55070))
- `createTableLike` full `TableInfo` propagation ([#55101](https://github.com/apache/spark/pull/55101))
- WIP cache integration for V2 pushdown rules ([#55017](https://github.com/apache/spark/pull/55017))

**Trend:** Spark’s evolution continues to center on DSv2 becoming the clean, extensible path for connectors and catalogs.

### Python performance and parity work is accelerating
Python-related PRs cover error semantics, Arrow serializers, benchmarks, stateful processing, and test restoration:
- Java error classes in Python ([#55100](https://github.com/apache/spark/pull/55100))
- Arrow serializer refactor ([#55026](https://github.com/apache/spark/pull/55026))
- Arrow UDF benchmarks ([#55056](https://github.com/apache/spark/pull/55056))
- Python stateful processor serialization optimization ([#55039](https://github.com/apache/spark/pull/55039))

**Trend:** PySpark remains a top investment area, especially around performance and consistency with JVM behavior.

### Optimizer intelligence is under active refinement
Issues and PRs both point to planner maturity work:
- AQE cache-stage gap ([#55094](https://github.com/apache/spark/issues/55094))
- Columnar-aware CBO proposal ([#55058](https://github.com/apache/spark/issues/55058))
- Infer filters from more complex joins ([#55045](https://github.com/apache/spark/pull/55045))
- Derive ordering from `KeyedPartitioning` ([#55036](https://github.com/apache/spark/pull/55036))

**Trend:** There is strong demand for more accurate physical and logical optimization, especially in hybrid row/columnar and DSv2-heavy plans.

## 5. Developer Pain Points

### 1) Environment-specific build and test breakage
Contributors continue to hit issues tied to generated sources, native libraries, OS upgrades, and architecture differences:
- Spark Connect proto/class generation confusion ([#55082](https://github.com/apache/spark/issues/55082))
- Apple Silicon native test failures ([#55093](https://github.com/apache/spark/issues/55093))
- Ubuntu 25.10 temp directory access issues ([#55096](https://github.com/apache/spark/issues/55096))

**Pain point:** Building and validating Spark across modern environments is still more fragile than many contributors expect.

### 2) Planner behavior is hard to predict in edge cases
AQE, CBO, caching, and shuffle handling continue to surprise users:
- AQE not optimizing cached shuffle plans ([#55094](https://github.com/apache/spark/issues/55094))
- Columnar cost modeling gaps ([#55058](https://github.com/apache/spark/issues/55058))
- Executor behavior after shuffle timeout ([#55092](https://github.com/apache/spark/issues/55092))

**Pain point:** Advanced users increasingly need stronger guarantees and clearer diagnostics for optimizer and runtime decisions.

### 3) Documentation lags actual engine behavior
- Missing aggregate return type docs in PySpark ([#54986](https://github.com/apache/spark/issues/54986))

**Pain point:** Even when behavior is stable in code, API documentation can leave important schema/type details implicit, slowing adoption and increasing trial-and-error.

### 4) Security and infra hygiene remain active maintenance areas
- Path traversal fix in stream serving ([#55077](https://github.com/apache/spark/pull/55077))
- CI action pinning ([#55066](https://github.com/apache/spark/pull/55066))

**Pain point:** Spark’s broad footprint means maintainers must continuously harden both runtime code paths and project infrastructure.

If you'd like, I can also turn this into:
1. a **short Slack-ready version**,
2. a **Markdown newsletter format**, or
3. a **JSON digest schema** for automated publishing.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait Community Digest — 2026-03-31

## 1. Today’s Highlights
Substrait activity over the last 24 hours was concentrated in pull requests rather than releases or issue traffic. The main themes are continued spec cleanup of deprecated fields and types, expansion of extension/type coverage, and documentation work to clarify supported libraries and breaking-change expectations.

## 2. Key PR Progress

1. **PR #994 — Remove deprecated `time`, `timestamp`, and `timestamp_tz` types**  
   Link: https://github.com/substrait-io/substrait/pull/994  
   This is the biggest active change because it is explicitly breaking and removes long-deprecated temporal types across proto definitions, dialect schema, extension YAMLs, grammar, tests, coverage tooling, and docs. It matters for implementers because it signals the project is actively enforcing deprecation boundaries and reducing ambiguity in temporal semantics.

2. **PR #1002 — Remove deprecated `Aggregate.Grouping.grouping_expressions`**  
   Link: https://github.com/substrait-io/substrait/pull/1002  
   Another breaking cleanup, this PR removes a field that was superseded by `expression_references`. For engine and tooling maintainers, this is important because it tightens aggregate plan encoding and pushes implementations toward the newer representation introduced earlier.

3. **PR #953 — Add unsigned integer extension types (`u8`, `u16`, `u32`, `u64`)**  
   Link: https://github.com/substrait-io/substrait/pull/953  
   This PR expands the type system via first-class extension types and includes arithmetic function support plus test coverage. It is notable for systems that need interoperability with unsigned-native runtimes or file formats, and it continues the pattern of using extensions to broaden expressiveness without overloading the core spec.

4. **PR #1012 — Support integer arguments for `std_dev` and `variance`**  
   Link: https://github.com/substrait-io/substrait/pull/1012  
   This change improves aggregate function usability by allowing integer inputs for statistical functions. For query engines and planners, it reduces type friction and aligns function behavior more closely with what users expect in analytical SQL environments.

5. **PR #1026 — Document supported libraries and breaking change policy**  
   Link: https://github.com/substrait-io/substrait/pull/1026  
   Although documentation-focused, this PR is strategically important because it sets expectations for compatibility and governance. A clearer breaking-change policy is especially relevant now that multiple removal PRs are moving through review.

6. **PR #945 — Add `current_date`, `current_timestamp`, and `current_timezone` variables**  
   Link: https://github.com/substrait-io/substrait/pull/945  
   This PR was closed after recent activity. It proposed execution-context variables for current date/time and timezone access, which would improve support for context-sensitive expressions and make Substrait plans easier to map from mainstream SQL semantics.

## 3. Feature Request Trends
No issues were updated in the last 24 hours, so there is no fresh issue-driven signal to analyze. Based on current PR flow, the strongest feature directions appear to be:

- **Type system expansion via extensions** — especially for unsigned integers and richer interoperability needs.  
- **Spec simplification through deprecation removal** — the community is moving from compatibility grace periods toward enforcement.  
- **Better SQL semantic coverage** — current-date/time variables and broader function signatures suggest ongoing work to reduce gaps between SQL engines and Substrait plans.  
- **Governance/documentation maturity** — supported-library guidance and breaking-change policy are becoming higher priority as adoption broadens.

## 4. Developer Pain Points
With no active issue updates in the period, explicit complaints are limited. Still, the current PR set points to a few likely pressure points for implementers:

- **Managing breaking changes** — multiple PMC-ready PRs remove deprecated constructs, which creates migration work for producers, consumers, and validators.  
- **Type compatibility complexity** — unsigned integer extensions and temporal type cleanup highlight continuing friction around canonical type representation.  
- **Function signature alignment** — support for integer arguments in statistical functions suggests prior gaps between expected SQL behavior and Substrait function definitions.  
- **Need for clearer lifecycle guidance** — the documentation PR on supported libraries and breaking changes indicates maintainers and adopters want more predictable compatibility policy.

There were **no releases** and **no updated issues** in the last 24 hours, so those sections are omitted today.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*