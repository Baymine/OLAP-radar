# OLAP Ecosystem Index Digest 2026-04-05

> Generated: 2026-04-05 01:44 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project OLAP Data Infrastructure Comparison — 2026-04-05

## 1. Ecosystem Overview
The OLAP data infrastructure ecosystem remains active, but current activity is uneven across layers of the stack. Today, **dbt-core** shows the strongest user-facing momentum around execution correctness, safer authoring, and production ergonomics, while **Apache Spark** is iterating more heavily on runtime efficiency, Python interoperability, and operational resilience. **Substrait** shows no activity in the last 24 hours, suggesting a quieter period rather than a directional shift. Overall, the landscape points to a maturing ecosystem where correctness, observability, and automation-readiness are now as important as raw performance.

## 2. Activity Comparison

| Project | Issues Updated Today | PRs Updated Today | Release Status Today | Primary Activity Signal |
|---|---:|---:|---|---|
| dbt-core | 2 | 11 | No new release | Strong focus on correctness, config safety, runtime behavior |
| Apache Spark | 0 | 10 | No new release | Strong focus on execution engine, PySpark compatibility, build/streaming reliability |
| Substrait | 0 | 0 | No new release | No visible activity in last 24 hours |

## 3. Shared Feature Directions

### A. Stronger correctness guardrails
- **Projects:** dbt-core, Spark
- **Specific needs:**
  - **dbt-core:** prevent silent failure modes such as incorrect exit codes and ambiguous SQL UDF parameter shadowing.
  - **Spark:** replace opaque runtime failures such as stream-stream join NPEs with actionable errors.
- **Why it matters:** Both communities are prioritizing systems that fail clearly rather than silently or cryptically, which is critical for production pipelines.

### B. Better production operability and reliability
- **Projects:** dbt-core, Spark
- **Specific needs:**
  - **dbt-core:** reliable exit signaling for CI/CD, runtime prioritization, configurable operational limits.
  - **Spark:** release build hardening, test artifact cleanup, state-store recovery improvements.
- **Why it matters:** Reliability work is increasingly centered on automated environments, not just local developer experience.

### C. Reduced surprise from configuration and environment handling
- **Projects:** dbt-core, Spark
- **Specific needs:**
  - **dbt-core:** warnings on unknown config flags, improved `env_var` semantics, unit tests with incomplete runtime context.
  - **Spark:** compatibility handling for pandas 3 and numpy-backed object columns.
- **Why it matters:** Both projects are absorbing complexity from heterogeneous execution environments and external dependencies.

### D. Performance efficiency without changing user-facing abstractions
- **Projects:** dbt-core, Spark
- **Specific needs:**
  - **dbt-core:** execution prioritization and minor internal performance cleanups.
  - **Spark:** improved join estimation, avoiding unnecessary `ColumnarToRow`, lazy-loading UI assets.
- **Why it matters:** Optimization work is increasingly incremental and surgical, targeting real bottlenecks rather than broad architectural rewrites.

## 4. Differentiation Analysis

### dbt-core
- **Scope:** Analytics engineering and transformation orchestration layer.
- **Target users:** Analytics engineers, data platform teams, CI/CD owners, governance-aware BI/data modeling teams.
- **Technical approach:** Declarative project configuration, DAG-driven SQL transformation, strong emphasis on developer workflow and safe defaults.
- **Current emphasis:** Preventing incorrect outcomes caused by silent misconfiguration or misleading runtime behavior.

### Apache Spark
- **Scope:** General-purpose distributed compute engine spanning SQL, Python, batch, and streaming.
- **Target users:** Data engineers, platform teams, ML/data infrastructure teams, large-scale processing operators.
- **Technical approach:** Engine-level optimization, execution planning, stateful runtime systems, language interoperability.
- **Current emphasis:** Improving engine behavior under real-world complexity—Python ecosystem changes, incomplete stats, streaming recovery, and build/release stability.

### Substrait
- **Scope:** Cross-engine query plan representation and interoperability standard.
- **Target users:** Engine developers, interoperability architects, standards-oriented infrastructure teams.
- **Technical approach:** Specification and ecosystem alignment rather than end-user workflow tooling or execution runtime.
- **Current emphasis today:** No visible movement; compared with dbt-core and Spark, its cadence appears slower and more standards-driven.

## 5. Community Momentum & Maturity
- **Most active today:** **dbt-core** and **Apache Spark** are both active, with dbt-core showing slightly more visible movement due to both issue and PR activity, while Spark’s activity is concentrated in PRs.
- **Most user-facing iteration:** **dbt-core** appears to be iterating rapidly on pain points directly experienced by practitioners—exit codes, config validation, test ergonomics, and SQL safety.
- **Most infrastructure-heavy iteration:** **Spark** continues deep systems work, especially where changes require engine-level or subsystem-level expertise.
- **Quietest project:** **Substrait** had no activity in the last 24 hours, consistent with a standards project that may evolve in bursts rather than continuously.
- **Maturity signal:** Both dbt-core and Spark show mature-project behavior: fewer flashy features, more investment in correctness, compatibility, observability, and edge-case hardening.

## 6. Trend Signals

### 1. Silent failure is no longer acceptable
Community attention is shifting toward explicit warnings, accurate exit codes, and clearer runtime errors. For data engineers, this reinforces the need to favor tools and workflows that provide machine-detectable failure states and actionable diagnostics.

### 2. Production-readiness now includes ergonomics
Operational maturity is not just about scale; it includes understandable config behavior, predictable test execution, and reliable automation hooks. dbt-core’s current direction is especially relevant for teams standardizing analytics engineering in CI/CD.

### 3. Python ecosystem volatility remains a major pressure point
Spark’s PRs show that pandas and numpy changes continue to drive maintenance cost. Teams building Python-heavy OLAP workflows should expect ongoing compatibility churn and plan dependency upgrade testing accordingly.

### 4. Metadata quality still limits optimizer quality
Spark’s join estimation work highlights a broader industry truth: missing or weak statistics still degrade performance significantly. Data engineers should treat metadata collection and stats maintenance as part of performance engineering, not an afterthought.

### 5. Recovery, resilience, and maintainability are rising in priority
State recovery, dependency cleanup, build reproducibility, and safer defaults are all prominent. This suggests the ecosystem is moving from rapid capability expansion toward durable, enterprise-grade operability.

### 6. Interoperability standards remain important, but execution-layer projects dominate day-to-day momentum
Substrait’s lack of visible activity today contrasts with the rapid cadence of dbt-core and Spark. For practitioners, immediate value is still being created mainly in orchestration and execution projects, while interoperability standards likely remain a longer-horizon strategic bet.

If you want, I can also turn this into a **decision matrix** for:
- **analytics engineering teams**
- **lakehouse/platform teams**
- **query engine/interop architects**

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-04-05

## Today's Highlights
Two themes stand out in dbt-core today: execution correctness and safer authoring. A newly reported bug says `dbt run` and `dbt test` may return exit code `0` even when failures occur, while a paired issue/PR aims to warn users when SQL UDF parameter names silently shadow column names in PostgreSQL, a subtle source of incorrect results.

On the contribution side, community PR activity remains strong across scheduling, config validation, logging metadata, seed configurability, selector behavior, and runtime ergonomics. There were no new releases in the last 24 hours.

## Hot Issues

### 1) Exit codes may incorrectly report success on failures
- **Issue:** [#12770](https://github.com/dbt-labs/dbt-core/issues/12770) — **[Bug] Errors/Test Failures in DBT commands falsely returning exit code 0**
- **Why it matters:** This is the highest-severity item in today’s feed because CI/CD systems, orchestrators, and shell automation rely on non-zero exit codes to detect failure. If dbt reports success despite failed runs/tests, pipelines can silently promote bad states downstream.
- **Community reaction:** Early-stage report with limited discussion so far, but the impact area is broad enough that this will likely draw attention quickly from teams using dbt in automated deployment and validation workflows.

### 2) SQL UDF parameter shadowing can silently change query semantics
- **Issue:** [#12707](https://github.com/dbt-labs/dbt-core/issues/12707) — **[UDFs] [Feature] Warn or fail when SQL-language function parameter names shadow column names**
- **Why it matters:** The issue highlights a PostgreSQL-specific footgun: in SQL-language functions, a parameter name can be shadowed by a column name without warning. That can lead to silently incorrect outputs rather than obvious compilation/runtime failures.
- **Community reaction:** Only a small amount of discussion so far, but it already triggered a same-day implementation proposal in PR form, indicating fast validation of the concern by contributors.

> Note: Only 2 issues were updated in the last 24 hours, so today’s issue section includes all currently active issue movement.

## Key PR Progress

### 1) Runtime priority for runnable models
- **PR:** [#12773](https://github.com/dbt-labs/dbt-core/pull/12773) — **Configuration for runtime "priority" among models with satisfied dependencies**
- **What it does:** Proposes a way to prioritize execution order among models whose dependencies are already satisfied.
- **Why it matters:** This could improve wall-clock performance and resource utilization in large DAGs, especially where some nodes are more latency-sensitive or expensive than others.

### 2) Warning for SQL function parameter shadowing
- **PR:** [#12772](https://github.com/dbt-labs/dbt-core/pull/12772) — **Warn when SQL function parameter name shadows a column in a referenced model**
- **What it does:** Implements a warning to catch the UDF naming ambiguity described in issue #12707.
- **Why it matters:** This is a correctness-focused safety feature that helps prevent subtle logic bugs in generated SQL functions.

### 3) Unknown `dbt_project.yml` flags should no longer fail silently
- **PR:** [#12689](https://github.com/dbt-labs/dbt-core/pull/12689) — **feat: warn on unknown flags in dbt_project.yml**
- **What it does:** Adds feedback when users define unsupported or misspelled flags in project config.
- **Why it matters:** Silent config ignores are a common source of confusion; surfacing these mistakes should reduce debugging time and misconfiguration risk.

### 4) Performance cleanup in dictionary membership checks
- **PR:** [#12191](https://github.com/dbt-labs/dbt-core/pull/12191) — **perf: replace 'in dict.keys()' with 'in dict' for better performance**
- **What it does:** Replaces unnecessary `.keys()` membership checks across several code paths.
- **Why it matters:** This is a small but sensible cleanup that improves readability and marginally reduces overhead in frequently used internals.

### 5) Add `meta` config to test log messages
- **PR:** [#10812](https://github.com/dbt-labs/dbt-core/pull/10812) — **Add meta config to test log messages**
- **What it does:** Enriches structured test logs with model `meta` information.
- **Why it matters:** Better observability helps teams route failures, tag ownership, and connect logs to platform metadata or governance systems.

### 6) Make maximum seed size configurable
- **PR:** [#11177](https://github.com/dbt-labs/dbt-core/pull/11177) — **Make MAXIMUM_SEED_SIZE_MIB configurable**
- **What it does:** Replaces a hardcoded seed-size limit with configuration.
- **Why it matters:** This addresses long-standing friction for teams with larger CSV seeds and makes dbt more adaptable to varied workflows and environments.

### 7) Improve `env_var` handling when default is `none`
- **PR:** [#10629](https://github.com/dbt-labs/dbt-core/pull/10629) — **Ct 10485/env var none**
- **What it does:** Changes `env_var` default handling so `none` behaves more intuitively, aligning better with user expectations from `var`.
- **Why it matters:** Environment configuration semantics are a recurring source of developer pain; this would reduce surprising failures in templated projects.

### 8) Unit tests without full context
- **PR:** [#10849](https://github.com/dbt-labs/dbt-core/pull/10849) — **fix: dbt unit tests feat without proper context**
- **What it does:** Addresses failures or limitations when dbt unit tests run without complete `env_var` / `var` context.
- **Why it matters:** This is important for local development and test ergonomics, where strict runtime context requirements can make unit testing cumbersome.

### 9) Config-based selection for saved queries
- **PR:** [#11635](https://github.com/dbt-labs/dbt-core/pull/11635) — **Extend Eligible Nodes for ConfigSelectorMethod to include Saved Query Nodes**
- **What it does:** Expands config selector support to saved query nodes.
- **Why it matters:** As dbt node types expand, consistent selector behavior becomes more valuable for discoverability, automation, and governance workflows.

### 10) Prevent errors when `node.tags` is `None`
- **PR:** [#10520](https://github.com/dbt-labs/dbt-core/pull/10520) — **Prevent error when `node.tags` is `None`**
- **What it does:** Adds defensive handling for manifests where `tags` may be present but null.
- **Why it matters:** This is a compatibility and robustness fix, particularly relevant for integrations that consume manifests programmatically.

### 11) CI maintenance update merged
- **PR:** [#12725](https://github.com/dbt-labs/dbt-core/pull/12725) — **Update test durations for pytest-split**
- **What it does:** Refreshes timing data used to balance parallel test execution.
- **Why it matters:** While operational rather than user-facing, healthy CI performance helps contributor velocity and review turnaround.

## Feature Request Trends
Based on the current issue and PR stream, several product directions are consistently emerging:

- **Safer defaults and stronger guardrails**
  - Examples: [#12707](https://github.com/dbt-labs/dbt-core/issues/12707), [#12772](https://github.com/dbt-labs/dbt-core/pull/12772), [#12689](https://github.com/dbt-labs/dbt-core/pull/12689)
  - Trend: Contributors want dbt to warn earlier when behavior is legal but dangerous, especially around SQL semantics and configuration typos.

- **More predictable runtime and orchestration behavior**
  - Examples: [#12770](https://github.com/dbt-labs/dbt-core/issues/12770), [#12773](https://github.com/dbt-labs/dbt-core/pull/12773)
  - Trend: Execution correctness, accurate status signaling, and more control over scheduling continue to matter for production users.

- **Greater configurability over hardcoded limits**
  - Example: [#11177](https://github.com/dbt-labs/dbt-core/pull/11177)
  - Trend: Teams want fewer fixed assumptions in core, especially where file sizes, runtime limits, and environment-specific constraints vary.

- **Improved observability and metadata propagation**
  - Example: [#10812](https://github.com/dbt-labs/dbt-core/pull/10812)
  - Trend: Structured logs and richer metadata remain important as dbt becomes more deeply integrated into platform tooling.

- **More consistent behavior across node types and contexts**
  - Examples: [#11635](https://github.com/dbt-labs/dbt-core/pull/11635), [#10849](https://github.com/dbt-labs/dbt-core/pull/10849), [#10629](https://github.com/dbt-labs/dbt-core/pull/10629)
  - Trend: Users increasingly expect selectors, tests, variables, and environment handling to behave uniformly across features.

## Developer Pain Points
Recurring frustrations visible in today’s activity include:

- **Silent failures or silent ignores**
  - Misleading success exit codes: [#12770](https://github.com/dbt-labs/dbt-core/issues/12770)
  - Ignored config typos: [#12689](https://github.com/dbt-labs/dbt-core/pull/12689)
  - Ambiguous SQL resolution with no warning: [#12707](https://github.com/dbt-labs/dbt-core/issues/12707)

- **Configuration semantics that feel unintuitive**
  - `env_var` default behavior: [#10629](https://github.com/dbt-labs/dbt-core/pull/10629)
  - Unit test context requirements: [#10849](https://github.com/dbt-labs/dbt-core/pull/10849)

- **Need for production-grade control and flexibility**
  - Runtime prioritization: [#12773](https://github.com/dbt-labs/dbt-core/pull/12773)
  - Configurable seed size limits: [#11177](https://github.com/dbt-labs/dbt-core/pull/11177)

- **Edge-case robustness for downstream integrations**
  - Null tags in manifests: [#10520](https://github.com/dbt-labs/dbt-core/pull/10520)
  - Selector support gaps for newer node types: [#11635](https://github.com/dbt-labs/dbt-core/pull/11635)

Overall, the dbt-core community is pushing toward a platform that is less silent, more explicit, and better suited for automated, large-scale production use.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-04-05

## 1. Today's Highlights
Apache Spark saw no new releases or issue activity in the last 24 hours, but pull request flow remained active across PySpark, SQL optimization, build reliability, Web UI efficiency, and Structured Streaming state management. The most notable themes today are continued work on Python/pandas compatibility, cost-based optimizer improvements for joins, and build/test hardening aimed at reducing repo bloat and release fragility.

## 2. Hot Issues
No issues were updated in the last 24 hours.

## 3. Key PR Progress

1. **PySpark pandas compatibility follow-up for pandas 3**
   - PR: [#55158](https://github.com/apache/spark/pull/55158)
   - Status: Closed
   - This test-only follow-up fixes inferred time unit handling for pandas >= 3, reflecting upstream behavior changes. It matters because pandas version transitions often surface subtle compatibility regressions in PySpark and pandas API on Spark.

2. **PySpark: handle `np.ndarray` in list-valued pandas columns**
   - PR: [#55196](https://github.com/apache/spark/pull/55196)
   - Status: Open
   - Adds preprocessing to convert `np.ndarray` elements inside object-dtype pandas Series into native Python lists before conversion. This improves robustness when moving semi-structured data from pandas into Spark DataFrames.

3. **Release build fix for artifact fetching failures**
   - PR: [#55198](https://github.com/apache/spark/pull/55198)
   - Status: Open
   - Addresses a release build failure during documentation generation caused by artifact fetch errors. Build pipeline stability is especially important for downstream packagers and release managers.

4. **Better error handling for stream-stream join NPE**
   - PR: [#55197](https://github.com/apache/spark/pull/55197)
   - Status: Open, WIP
   - Aims to replace a null-pointer failure path in stream-stream joins with a clearer error. Better diagnostics here are valuable because Structured Streaming joins are already operationally complex and difficult to debug.

5. **SQL optimizer: improve join stats estimation without column stats**
   - PR: [#55195](https://github.com/apache/spark/pull/55195)
   - Status: Open
   - Proposes a better fallback for equi-join cardinality estimation when join key statistics are missing, avoiding Cartesian-product-style overestimates. This can materially improve plan quality in real-world environments where table stats are incomplete.

6. **Kubernetes build dependency cleanup via Netty exclusions**
   - PR: [#55188](https://github.com/apache/spark/pull/55188)
   - Status: Open
   - Excludes Netty transitive dependencies from Vert.x in Kubernetes modules. This kind of dependency hygiene reduces classpath conflict risk and keeps Spark’s Kubernetes integration more maintainable.

7. **Web UI optimization: lazy-load timeline resources**
   - PR: [#55193](https://github.com/apache/spark/pull/55193)
   - Status: Open
   - Moves `vis-timeline` resources out of the common header so they load only on pages that actually use timeline views. This should reduce unnecessary asset loading and improve UI responsiveness.

8. **Structured Streaming state store: checkpoint V2 with auto-repair snapshot**
   - PR: [#55015](https://github.com/apache/spark/pull/55015)
   - Status: Open
   - Integrates checkpoint V2 load paths with auto-repair snapshot logic. This is important infrastructure work for making state recovery more resilient when snapshots are corrupted.

9. **Build/tests: generate Java test JARs dynamically**
   - PR: [#55192](https://github.com/apache/spark/pull/55192)
   - Status: Open
   - Replaces pre-built Java binary test JARs in the repository with dynamic compilation at test time. This reduces binary artifacts checked into source control and improves repository cleanliness.

10. **SQL/Python execution path: skip `ColumnarToRow` for Arrow-backed Python UDF input**
    - PR: [#55120](https://github.com/apache/spark/pull/55120)
    - Status: Open
    - Avoids unnecessary row conversion for Arrow-backed input to Python UDFs. This could improve Python execution efficiency and better preserve columnar processing benefits.

## 4. Feature Request Trends
Based on current PR activity, the strongest development directions are:

- **Better Python interoperability**
  - Ongoing fixes for pandas 3 compatibility, numpy object handling, stronger type hints, and JSON ingestion flexibility show continued investment in PySpark ergonomics and correctness.
  - Relevant PRs: [#55158](https://github.com/apache/spark/pull/55158), [#55196](https://github.com/apache/spark/pull/55196), [#55178](https://github.com/apache/spark/pull/55178), [#55097](https://github.com/apache/spark/pull/55097)

- **Smarter SQL planning and execution**
  - Join statistics estimation and reducing unnecessary `ColumnarToRow` transitions indicate a focus on improving both optimizer accuracy and runtime efficiency.
  - Relevant PRs: [#55195](https://github.com/apache/spark/pull/55195), [#55120](https://github.com/apache/spark/pull/55120)

- **Operational resilience in build and streaming subsystems**
  - Release-build fixes, dynamic test artifact generation, and state-store recovery enhancements suggest sustained work on reliability for contributors and production operators.
  - Relevant PRs: [#55198](https://github.com/apache/spark/pull/55198), [#55192](https://github.com/apache/spark/pull/55192), [#55015](https://github.com/apache/spark/pull/55015)

- **Leaner UI and dependency footprint**
  - UI lazy-loading and dependency exclusions reflect a pattern toward reducing overhead in both runtime assets and module dependency trees.
  - Relevant PRs: [#55193](https://github.com/apache/spark/pull/55193), [#55188](https://github.com/apache/spark/pull/55188)

## 5. Developer Pain Points
Several recurring developer frustrations are evident from today’s PR set:

- **Upstream ecosystem churn**
  - pandas 3 behavior changes and numpy object handling continue to create compatibility edge cases for PySpark users and maintainers.
  - Examples: [#55158](https://github.com/apache/spark/pull/55158), [#55196](https://github.com/apache/spark/pull/55196)

- **Insufficient diagnostics in complex runtime paths**
  - Stream-stream join failures surfacing as NPEs instead of actionable errors remain painful for developers debugging streaming workloads.
  - Example: [#55197](https://github.com/apache/spark/pull/55197)

- **Optimizer dependence on incomplete metadata**
  - Missing column statistics can still degrade planning quality significantly, especially for joins on large datasets.
  - Example: [#55195](https://github.com/apache/spark/pull/55195)

- **Build and release fragility**
  - Artifact-fetching errors, checked-in binary test assets, and dependency conflicts continue to consume contributor time.
  - Examples: [#55198](https://github.com/apache/spark/pull/55198), [#55192](https://github.com/apache/spark/pull/55192), [#55188](https://github.com/apache/spark/pull/55188)

- **Streaming recovery complexity**
  - Corrupt snapshot recovery remains a real operational concern in stateful streaming environments.
  - Example: [#55015](https://github.com/apache/spark/pull/55015)

## 6. Releases
No new releases in the last 24 hours.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

No activity in the last 24 hours.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*