# OLAP Ecosystem Index Digest 2026-03-24

> Generated: 2026-03-24 01:17 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project OLAP Infrastructure Comparison Report — 2026-03-24

## 1. Ecosystem Overview

Across dbt-core, Apache Spark, and Substrait, today’s activity shows an OLAP infrastructure ecosystem focused less on headline releases and more on hardening correctness, semantics, and developer experience. A common pattern is maturation of core surfaces: dbt is tightening validation and state behavior, Spark is improving execution resilience and Python/DSv2 parity, and Substrait is refining specification precision and deprecation cleanup. The ecosystem is also moving toward better interoperability, with stronger function semantics, richer type systems, and clearer runtime/context modeling. For technical teams, this suggests that reliability, portability, and operational ergonomics are now as strategically important as raw feature expansion.

## 2. Activity Comparison

| Project | Hot Issues Updated/Highlighted Today | Key PRs Highlighted Today | Release Status Today |
|---|---:|---:|---|
| dbt-core | 10 | 10 | No new release highlighted |
| Apache Spark | 2 | 10 | No new release |
| Substrait | 0 | 10 | No new release |

### Notes
- **dbt-core** had the broadest visible issue activity, with active discussion across Python compatibility, seeds, microbatching, functions, snapshots, and config validation.
- **Spark** had lighter issue count today, but still showed high engineering throughput via substantial PR activity across SQL, PySpark, streaming, and infra.
- **Substrait** showed no issue updates, but strong PR-driven spec evolution, indicating focused maintainer-led design work rather than issue-heavy community traffic.

## 3. Shared Feature Directions

### A. Better error handling, validation, and developer-facing feedback
- **Projects:** dbt-core, Spark, Substrait
- **Specific needs:**
  - **dbt-core:** replace raw Python exceptions with dbt-native exceptions, warn on unknown flags, improve package/snapshot validation messages.
  - **Spark:** fix misleading/internal planner error paths, improve test safety, reduce hidden execution surprises.
  - **Substrait:** clarify ambiguous spec areas such as function argument modeling and extension relation schema behavior.
- **Why it matters:** Users increasingly expect actionable failures rather than internal stack traces or underspecified semantics.

### B. More precise function and type semantics
- **Projects:** dbt-core, Spark, Substrait
- **Specific needs:**
  - **dbt-core:** expanding function/UDF support, including state tracking and governance behavior.
  - **Spark:** new nanosecond timestamp types, stronger schema enforcement in Arrow paths, SQL semantic expansion.
  - **Substrait:** enum-based function arguments, integer support for statistical functions, execution-context variables, list `element_at`.
- **Why it matters:** Analytical systems are under pressure to represent richer SQL/runtime semantics consistently across engines and tools.

### C. Greater interoperability and parity across execution surfaces
- **Projects:** Spark, Substrait, indirectly dbt-core
- **Specific needs:**
  - **Spark:** DSv2 parity (`CREATE TABLE LIKE`, `TABLESAMPLE SYSTEM` pushdown), PySpark/JVM alignment, pandas/Arrow compatibility.
  - **Substrait:** portable spec definitions for runtime variables, function semantics, deprecation cleanup to reduce ambiguity.
  - **dbt-core:** more consistent behavior across resource types such as models, snapshots, analyses, and functions.
- **Why it matters:** Teams want fewer semantic gaps between engines, languages, catalogs, and resource abstractions.

### D. Operational correctness for selective, large-scale, or adaptive execution
- **Projects:** dbt-core, Spark
- **Specific needs:**
  - **dbt-core:** correct `state:modified`, partial parsing, microbatch targeting, seed memory behavior, unit test concurrency correctness.
  - **Spark:** AQE fallback from failed broadcast joins, checkpoint/persistence semantics, state reader support for streaming internals.
- **Why it matters:** Production data systems increasingly rely on selective reruns, adaptive execution, and operationally predictable behavior under scale.

## 4. Differentiation Analysis

### dbt-core
- **Scope:** Analytics engineering workflow orchestration and transformation authoring.
- **Target users:** Analytics engineers, BI engineering teams, transformation-heavy warehouse users.
- **Technical approach:** Declarative project configuration, SQL/Python transformation management, state-aware build/test workflows.
- **Current emphasis:** UX hardening, config correctness, resource-parity gaps, state/selective execution reliability.

### Apache Spark
- **Scope:** General-purpose distributed data processing engine spanning SQL, batch, streaming, ML-adjacent workloads, and Python/JVM APIs.
- **Target users:** Data engineers, platform teams, large-scale ETL developers, streaming operators.
- **Technical approach:** Runtime engine optimization, adaptive query execution, DSv2 connector architecture, multi-language APIs.
- **Current emphasis:** Runtime resilience, DSv2 maturity, PySpark/Arrow correctness, streaming operability, infrastructure stability.

### Substrait
- **Scope:** Cross-engine query plan and function specification standard.
- **Target users:** Engine developers, connector authors, standards/interoperability stakeholders.
- **Technical approach:** Specification-first modeling of plans, types, functions, and extension semantics.
- **Current emphasis:** Semantic precision, deprecation removal, function modeling cleanup, portability for implementers.

### Key differences
- **dbt-core** is closest to end-user workflow productivity.
- **Spark** is the execution substrate handling performance and scale.
- **Substrait** sits at the interoperability/specification layer, shaping how engines and tools can exchange semantics.

## 5. Community Momentum & Maturity

### Most visibly active community today: dbt-core
dbt-core shows the highest combined issue-and-PR signal in this digest. The breadth of topics and fast issue-to-PR response cycle suggest an engaged user base with active maintainer attention, especially around sharp-edge DX problems.

### Highest engineering throughput on core runtime surfaces: Apache Spark
Spark’s issue count was lower today, but the PR set is deep and technically substantial. This indicates a mature, high-capacity engineering community where much of the important work happens through ongoing subsystem development rather than issue churn alone.

### Fast-moving but maintainer-centric iteration: Substrait
Substrait appears less community-noisy but highly active in coordinated spec evolution. Its momentum is strong in design quality and modernization, though likely concentrated among implementers and spec contributors rather than a broad operational end-user community.

### Maturity readout
- **Spark:** highest platform maturity, broadest system scope, strongest subsystem depth.
- **dbt-core:** mature product with active UX and correctness refinement as adoption broadens into newer resource types.
- **Substrait:** maturing standard with growing importance, but still earlier in ecosystem breadth compared with Spark and dbt.

## 6. Trend Signals

### 1. Reliability and usability are now top-tier roadmap priorities
Community work is heavily focused on better failures, clearer validation, and safer defaults rather than only net-new features. For data engineers, this is a positive signal that production ergonomics are being treated as strategic infrastructure concerns.

### 2. Functions/UDFs and richer semantics are expanding across the stack
dbt is increasing first-class function support, Spark is evolving SQL/type behavior, and Substrait is tightening portable function definitions. This points to an industry shift toward more expressive computation pushed closer to the data platform.

### 3. Interoperability layers are becoming more important
Substrait’s semantic cleanup and Spark’s DSv2 evolution show that open table ecosystems and cross-engine portability remain key investment areas. Teams building multi-engine or hybrid stacks should expect standards alignment to matter more over time.

### 4. Python and Arrow remain critical—and fragile—interfaces
Spark’s continued work on Arrow schema enforcement, memory leak detection, and pandas compatibility mirrors broader ecosystem dependence on Python-centric workflows. Data engineers should treat Python execution paths as strategic but still operationally sensitive.

### 5. Selective execution and state-aware workflows are increasingly expected
dbt’s work on `state:modified`, partial parsing, and microbatch control, alongside Spark’s AQE and checkpoint semantics, shows that users want systems that can rerun only what is necessary and adapt safely at runtime.

### 6. Deprecation and semantic cleanup will continue to create migration work
Substrait’s removal of legacy types/fields and dbt’s tightening validation both indicate a broader shift toward stricter contracts. The payoff is better long-term consistency, but teams should budget for compatibility maintenance and CI validation as upstream projects mature.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-03-24

## Today's Highlights
dbt-core activity over the last 24 hours centered on error handling, configuration validation, and snapshot/unit test correctness rather than major releases. The strongest signal from both issues and PRs is a push toward clearer user-facing failures: better deprecation messages, suppression of raw stacktraces, warnings for invalid config/flags, and more accurate exception types.

At the same time, contributors are continuing to harden newer surface areas such as functions/UDFs, snapshots, unit tests, and partial parsing. Community PR volume is healthy, with several fixes opened or merged quickly against recently reported issues.

## Hot Issues

1. **Python 3.14 compatibility remains open**
   - Issue: [#12098](https://github.com/dbt-labs/dbt-core/issues/12098)
   - Why it matters: Python runtime compatibility is foundational for teams planning upgrades to newer developer environments and CI images. This issue points to dependency updates, including mashumaro and possibly pydantic-related changes.
   - Community reaction: One of the highest-engagement issues in this batch with **32 👍**, indicating strong downstream interest.

2. **`dbt seed` memory usage is still a notable performance concern**
   - Issue: [#9524](https://github.com/dbt-labs/dbt-core/issues/9524)
   - Why it matters: Large seed files are still common in analytics engineering workflows, and sustained memory growth can make local runs and CI unstable.
   - Community reaction: The issue has accumulated discussion over time and remains open with **help_wanted**, signaling room for contributor involvement.

3. **Microbatch users want targeted relative-batch execution**
   - Issue: [#11242](https://github.com/dbt-labs/dbt-core/issues/11242)
   - Why it matters: More precise microbatch control would help teams rerun only recent windows or selected relative batches, improving recovery and backfill ergonomics.
   - Community reaction: Moderate engagement with **8 👍**, reflecting growing interest in microbatch refinement.

4. **Project-wide string typing for seeds is a recurring usability request**
   - Issue: [#10985](https://github.com/dbt-labs/dbt-core/issues/10985)
   - Why it matters: Teams want a simple default to coerce all seed columns to STRING without repetitive per-file config, especially for messy CSV inputs and cross-database consistency.
   - Community reaction: Modest but clear demand with **6 👍**.

5. **Function resource state tracking misses `.yml` property changes**
   - Issue: [#12547](https://github.com/dbt-labs/dbt-core/issues/12547)
   - Why it matters: `state:modified` is central to slim CI and selective deploy patterns. Missing function property changes weakens confidence in state-based workflows for UDF-heavy projects.
   - Community reaction: Limited comments, but practical impact is high; notably, there is an active community PR addressing it.

6. **On-run-end schema handling appears incomplete for functions**
   - Issue: [#12516](https://github.com/dbt-labs/dbt-core/issues/12516)
   - Why it matters: As dbt expands function/UDF support, post-run governance operations such as ownership updates need to include function schemas reliably.
   - Community reaction: Early-stage discussion, but relevant for enterprise governance users.

7. **YAML snapshots can emit an overly noisy stacktrace when required fields are missing**
   - Issue: [#12692](https://github.com/dbt-labs/dbt-core/issues/12692)
   - Why it matters: This is a classic developer-experience bug: the actual validation problem is simple, but the CLI currently obscures it with a long Python traceback.
   - Community reaction: Reported and turned into a PR almost immediately, suggesting maintainers see it as a sharp edge worth smoothing.

8. **`analyses` still lacks project-level configuration support**
   - Issue: [#11427](https://github.com/dbt-labs/dbt-core/issues/11427)
   - Why it matters: Resource-type consistency matters in large projects. The inability to manage analyses via project-level config creates an exception to otherwise standard dbt configuration patterns.
   - Community reaction: Low comment volume, but the issue affects predictability of configuration behavior.

9. **Private model cross-group references should fail at parse time, not runtime**
   - Issue: [#12271](https://github.com/dbt-labs/dbt-core/issues/12271)
   - Why it matters: Earlier feedback shortens iteration loops and makes access-control semantics more trustworthy, especially in projects adopting model groups and private/public boundaries.
   - Community reaction: The issue itself is quiet, but an active PR is in review, showing clear maintainer interest.

10. **Javascript UDF support is now an explicit feature request**
    - Issue: [#12332](https://github.com/dbt-labs/dbt-core/issues/12332)
    - Why it matters: UDF language flexibility is becoming a larger theme in dbt-core. Javascript support would broaden compatibility with warehouses that support JS runtime UDFs.
    - Community reaction: No public discussion yet, but it aligns with the broader expansion of first-class function support.

## Key PR Progress

1. **Fix temp-table collisions in unit tests by including model name in aliases**
   - PR: [#12701](https://github.com/dbt-labs/dbt-core/pull/12701)
   - What changed: Prevents collisions when different models use unit tests with the same test name under multithreaded execution.
   - Why it matters: Important correctness fix for teams scaling unit test coverage with parallel runs.

2. **Warn on unknown flags in `dbt_project.yml`**
   - PR: [#12689](https://github.com/dbt-labs/dbt-core/pull/12689)
   - What changed: Adds feedback when users set unrecognized flags, avoiding silent no-ops caused by typos.
   - Why it matters: Strong quality-of-life improvement for project configuration hygiene.

3. **Suppress stacktraces for invalid YAML snapshot configs**
   - PR: [#12700](https://github.com/dbt-labs/dbt-core/pull/12700)
   - What changed: Converts raw validation failure behavior into cleaner dbt-style error reporting when `strategy` or `unique_key` is missing.
   - Why it matters: Direct response to [#12692](https://github.com/dbt-labs/dbt-core/issues/12692), reducing noise in CLI failures.

4. **Guard `same_contract()` against `KeyError` with custom constraints**
   - PR: [#12699](https://github.com/dbt-labs/dbt-core/pull/12699)
   - What changed: Adds protection against uncaught key access errors in contract comparison logic.
   - Why it matters: Another example of hardening error paths and converting internals into predictable dbt behavior.

5. **Broader move from built-in Python exceptions to `DbtException` subclasses**
   - PR: [#12686](https://github.com/dbt-labs/dbt-core/pull/12686)
   - What changed: Replaces generic Python exceptions with dbt-specific exception types.
   - Why it matters: This is strategically important for consistent UX, cleaner CLI output, and better downstream tooling expectations.

6. **Function resources: detect `.yml` property changes in `state:modified`**
   - PR: [#12548](https://github.com/dbt-labs/dbt-core/pull/12548)
   - What changed: Extends state comparison so function property changes in YAML are recognized.
   - Why it matters: Important for selective builds and deployment correctness in projects using functions/UDFs.

7. **Fix partial parsing when access changes to private via config block**
   - PR: [#12563](https://github.com/dbt-labs/dbt-core/pull/12563)
   - What changed: Ensures referencing nodes are reparsed when access semantics change, including changes nested under `config:`.
   - Why it matters: Tightens correctness around model-group access control and addresses [#12271](https://github.com/dbt-labs/dbt-core/issues/12271).

8. **Improve missing-version error message in `packages.yml`**
   - PR: [#12688](https://github.com/dbt-labs/dbt-core/pull/12688)
   - What changed: Replaces a raw `KeyError` path with a more useful validation error when hub packages omit `version`.
   - Why it matters: Another focused developer-experience fix around configuration validation.

9. **Backport merged fix for sqlparse option defaults**
   - PR: [#12696](https://github.com/dbt-labs/dbt-core/pull/12696)
   - Related merged PR: [#12695](https://github.com/dbt-labs/dbt-core/pull/12695)
   - What changed: Makes `MAX_GROUPING_TOKENS` and `MAX_GROUPING_DEPTH` behave independently when using `--sqlparse`.
   - Why it matters: Better control over SQL parsing safety/performance settings, especially for pathological SQL inputs.

10. **Recently merged deprecation/config correctness fixes**
    - PRs: [#12667](https://github.com/dbt-labs/dbt-core/pull/12667), [#12618](https://github.com/dbt-labs/dbt-core/pull/12618), [#12684](https://github.com/dbt-labs/dbt-core/pull/12684), [#12685](https://github.com/dbt-labs/dbt-core/pull/12685)
    - What changed: These merged changes improved deprecation logic for custom config keys, corrected misleading generic-test warnings, changed cycle detection to raise `CompilationError`, and aligned jsonschema deprecation handling with pre-Jinja schemas.
    - Why it matters: Collectively, these point to a strong maintainer focus on making validation and failure modes more intelligible.

## Feature Request Trends

1. **More ergonomic configuration defaults**
   - Signals: [#10985](https://github.com/dbt-labs/dbt-core/issues/10985), [#11427](https://github.com/dbt-labs/dbt-core/issues/11427), [#9501](https://github.com/dbt-labs/dbt-core/issues/9501)
   - Trend: Users want project-level defaults and more predictable configuration behavior across resource types, alongside better logging and visibility.

2. **Incremental and microbatch control is becoming more important**
   - Signals: [#11242](https://github.com/dbt-labs/dbt-core/issues/11242), [#10959](https://github.com/dbt-labs/dbt-core/issues/10959)
   - Trend: Teams increasingly want fine-grained control over how time-based and batch-based processing behaves, especially for partial reruns and behavior changes.

3. **Function/UDF support is expanding**
   - Signals: [#12516](https://github.com/dbt-labs/dbt-core/issues/12516), [#12547](https://github.com/dbt-labs/dbt-core/issues/12547), [#12332](https://github.com/dbt-labs/dbt-core/issues/12332)
   - Trend: UDFs are moving from edge case to active product surface, with asks around governance, state tracking, and additional supported languages.

4. **Performance and scale continue to matter**
   - Signals: [#9524](https://github.com/dbt-labs/dbt-core/issues/9524), [#11177](https://github.com/dbt-labs/dbt-core/pull/11177)
   - Trend: Memory usage for seeds and configurable size limits remain relevant for teams handling larger local assets and CI workloads.

## Developer Pain Points

1. **Raw Python exceptions still leak through too often**
   - Seen in snapshot validation, package validation, cycle detection, and contract comparison work. Users want actionable dbt errors, not stacktraces or `KeyError`/`RuntimeError` internals.

2. **Silent misconfiguration is a recurring frustration**
   - Unknown flags, custom config keys, and misleading deprecation warnings all point to the same problem: dbt sometimes accepts invalid or malformed config too quietly.

3. **State-based workflows still have edge cases**
   - Gaps around function resources and partial parsing reduce trust in `state:modified` and slim CI patterns, especially as projects adopt newer resource types.

4. **Newer resource types lag mature model behavior**
   - Functions/UDFs, YAML snapshots, and analyses are all showing parity gaps in configuration, validation, and lifecycle handling.

5. **Concurrency exposes naming and compilation edge cases**
   - Unit test alias collisions and snapshot compile-path bugs show that parallelism and multi-block file handling still surface correctness issues in advanced workflows.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-24

## 1. Today’s Highlights

Spark saw no new releases today, but core development activity remained strong across SQL, PySpark, structured streaming, and infrastructure. The most notable themes were resilience improvements in AQE and testing, deeper Data Source V2 work, and continued alignment with pandas 3 and Arrow-based execution paths. Community attention also centered on two practical pain points: CI instability caused by Apache-wide GitHub Actions policy changes and checkpoint persistence behavior in `Dataset.localCheckpoint()`.

## 3. Hot Issues

> Note: Only 2 issues were updated in the last 24 hours, so this section includes all currently active noteworthy issue updates from the provided data.

1. **`Dataset.localCheckpoint()` should accept a `StorageLevel` parameter**  
   [#54954](https://github.com/apache/spark/issues/54954)  
   This issue highlights a real execution-efficiency problem: `localCheckpoint()` always materializes with `MEMORY_AND_DISK`, even if the dataset was previously persisted differently. For large pipelines, this can create a double-copy effect and undermine storage planning, making it especially relevant for data engineers running memory-constrained workloads.  
   **Community reaction:** The issue was quickly closed, suggesting maintainers likely clarified intended behavior, redirected to a design path, or handled it via follow-up code review rather than issue discussion.

2. **GitHub Actions failing due to new Apache security policy**  
   [#54931](https://github.com/apache/spark/issues/54931)  
   This is an infrastructure-wide blocker rather than a Spark-specific product bug. It matters because broken CI slows review velocity, raises contributor friction, and can delay merges across SQL, Python, and runtime subsystems.  
   **Community reaction:** The issue was framed as a placeholder for confused contributors, indicating broad awareness and immediate operational impact across the repo.

## 4. Key PR Progress

1. **Arrow memory leak detection added to tests**  
   [#54689](https://github.com/apache/spark/pull/54689) — **[SPARK-55890] Check arrow memory at end of tests**  
   This PR fixes off-heap Arrow memory leaks in Spark Connect-related tests and adds `afterAll` guards to catch future regressions before merge. It is important because Arrow leaks are notoriously hard to detect and can destabilize long-running test suites and services.

2. **`CREATE TABLE LIKE` support for Data Source V2**  
   [#54809](https://github.com/apache/spark/pull/54809) — **[SPARK-33902][SQL] Support CREATE TABLE LIKE for V2**  
   A meaningful SQL/catalog capability upgrade, this would bring better parity between legacy and V2 table operations. It matters for lakehouse-oriented deployments that increasingly depend on DSv2 catalogs and connectors.

3. **Replace manual Arrow coercion with `enforce_schema` in PySpark**  
   [#54967](https://github.com/apache/spark/pull/54967) — **[SPARK-56166][PYTHON] Use ArrowBatchTransformer.enforce_schema to replace column-wise type coercion logic**  
   This streamlines multiple Arrow serializer paths by centralizing schema enforcement. The likely benefit is more consistent behavior, less duplicated logic, and fewer edge-case mismatches in Python UDF/UDTF execution.

4. **AQE fallback from failed broadcast join to shuffle join**  
   [#54925](https://github.com/apache/spark/pull/54925) — **[SPARK-56065][SQL] Add AQE fallback from failed broadcast joins to shuffle joins**  
   This is one of the most operationally significant PRs in today’s set. It adds an opt-in adaptive recovery path when broadcast joins fail due to size or row-count constraints, improving robustness for workloads whose statistics or runtime cardinality differ from planning assumptions.

5. **ANSI `TABLESAMPLE SYSTEM` with DSv2 pushdown**  
   [#54972](https://github.com/apache/spark/pull/54972) — **[SPARK-55978][SQL] Add TABLESAMPLE SYSTEM block sampling with DSv2 pushdown**  
   This expands SQL sampling support with block-level semantics and connector pushdown. For data exploration and approximate analytics, this can reduce scan costs and align Spark more closely with ANSI SQL expectations.

6. **YARN CPU visibility control via `ActiveProcessorCount`**  
   [#51948](https://github.com/apache/spark/pull/51948) — **[SPARK-53209][YARN] Add ActiveProcessorCount JVM option to YARN executor and AM**  
   A practical resource-management enhancement: it helps the JVM respect Spark-assigned cores rather than node-wide CPU visibility. This can improve thread-pool sizing and GC behavior in multi-tenant YARN clusters.

7. **Fix `ClassCastException` in error reporting for transformed `GetStructField` plans**  
   [#54970](https://github.com/apache/spark/pull/54970) — **[SPARK-56169][SQL] Fix `ClassCastException` in error reporting when `GetStructField` child type is changed by plan transformation**  
   This is a correctness and debuggability fix in Catalyst analysis/error reporting. It matters because planner/analyzer transformations can surface confusing failures, and stable error handling is essential for both connector developers and advanced SQL users.

8. **PySpark support for CDC `changes()` API**  
   [#54746](https://github.com/apache/spark/pull/54746) — **[SPARK-55950][PYTHON] Add PySpark support for CDC changes() API**  
   This extends change-data-capture access into PySpark for both batch and streaming readers, including Spark Connect. It is significant for Python-first data engineering workflows that need parity with JVM-side table change APIs.

9. **State data source reader support for state format v4 in stream-stream join**  
   [#54845](https://github.com/apache/spark/pull/54845) — **[SPARK-55729][SS] Support state data source reader for new state format v4 on stream-stream join**  
   This improves introspection and operability for structured streaming state. For teams running complex stateful joins, better state reader support is valuable for debugging, observability, and operational tooling.

10. **Nanosecond timestamp DataType classes introduced**  
    [#54966](https://github.com/apache/spark/pull/54966) — **[SPARK-56160][SQL] Add DataType classes for nanosecond timestamp types**  
    This is an important foundational type-system enhancement. Adding `TimestampNSType` and `TimestampNTZNSType` suggests Spark is preparing for higher-precision time semantics, which matters for interoperability with modern data systems and fine-grained event workloads.

## 5. Feature Request Trends

Based on the issue and PR stream, the strongest feature directions are:

- **More resilient adaptive query execution**
  - AQE fallback for failed broadcast joins shows demand for runtime recovery instead of hard query failure.
  - Query planning is increasingly expected to degrade gracefully under data-size surprises.

- **Deeper Data Source V2 and catalog maturity**
  - `CREATE TABLE LIKE` for V2, `TABLESAMPLE SYSTEM` pushdown, and DSv2 error modernization all point to continued investment in the connector and catalog ecosystem.
  - Spark’s SQL surface is steadily being aligned with modern pluggable table engines.

- **Higher-fidelity Python and Arrow execution**
  - Work on Arrow schema enforcement, CDC APIs in PySpark, and pandas 3 compatibility indicates sustained demand for fewer semantic mismatches between Python and JVM execution.
  - The emphasis is shifting from basic support to production-grade correctness and compatibility.

- **Richer streaming operability**
  - State reader support for newer state formats suggests users want better tooling around structured streaming internals, especially for debugging and state inspection.

- **Precision and type-system expansion**
  - New nanosecond timestamp types and broader types-framework work imply long-term movement toward more expressive and extensible SQL typing.

## 6. Developer Pain Points

- **CI and contribution workflow fragility**
  - The GitHub Actions security-policy breakage is the clearest immediate pain point. Contributors are being blocked by external policy changes rather than code quality issues, which creates uncertainty and slows iteration.

- **Unexpected persistence and checkpoint semantics**
  - The `localCheckpoint()` storage-level behavior exposes a gap between user expectations and actual runtime semantics. This kind of hidden materialization policy is especially painful in large ETL pipelines where memory and disk planning are critical.

- **Arrow-related correctness and memory management**
  - Multiple PRs focus on Arrow coercion paths and leak detection, reinforcing that Arrow integration remains powerful but operationally delicate.

- **Cross-version compatibility churn in Python ecosystem**
  - pandas 3 adjustments and serializer refinements show ongoing maintenance burden for PySpark developers who need predictable behavior across dependency upgrades.

- **Complexity in Catalyst and DSv2 internals**
  - Fixes around `GetStructField`, SPJ ordering, and error-code modernization suggest that advanced optimizer and connector code paths still create difficult-to-debug edge cases for contributors and downstream integrators.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait Community Digest — 2026-03-24

## 1. Today's Highlights
Substrait saw a concentrated burst of specification and extension work rather than releases or issue activity. The most important theme is a coordinated cleanup of function signatures and deprecated spec elements, especially around `std_dev`/`variance`, legacy temporal types, and aggregate grouping fields.

A second notable trend is improved expressiveness in extensions and execution context support, with new proposals for `current_date`, `current_timestamp`, `current_timezone`, and a new `element_at` list function. Documentation also advanced with clarification around output schema responsibilities for extension relations.

## 4. Key PR Progress

1. **Add current execution-context variables**  
   PR [#945](https://github.com/substrait-io/substrait/pull/945) proposes three new variables: `current_date`, `current_timestamp`, and `current_timezone`. This matters for portability across engines because these are common SQL/session-level semantics that often differ subtly in implementation.

2. **Support integer arguments for `std_dev` and `variance`**  
   PR [#1012](https://github.com/substrait-io/substrait/pull/1012) extends extension definitions and generated test cases so `std_dev` and `variance` accept integer inputs. This improves practical interoperability since many engines allow integer measures and perform widening internally.

3. **Convert `distribution` to an enum argument for `std_dev` and `variance`**  
   PR [#1011](https://github.com/substrait-io/substrait/pull/1011) updates these function signatures to use an enum argument instead of function options. This is an important semantic cleanup that aligns with recent clarification on function options versus enum arguments.

4. **Deprecate old option-based `std_dev` and `variance` signatures**  
   PR [#1019](https://github.com/substrait-io/substrait/pull/1019) is the breaking-change follow-up to #1011, formally deprecating the older option-based forms. Together, #1011 and #1019 signal a push toward stricter and clearer function modeling.

5. **Add `element_at` for lists**  
   PR [#1020](https://github.com/substrait-io/substrait/pull/1020) adds an `element_at` list function with explicit enum-controlled negative index semantics and configurable out-of-bounds behavior. This is useful because list indexing semantics vary widely across engines, and the proposal makes those choices explicit.

6. **Clarify output schemas for extension relations**  
   PR [#1018](https://github.com/substrait-io/substrait/pull/1018) improves docs by stating that output schema derivation for extension relations must be handled by the extension definition itself. This closes an important spec interpretation gap for implementers building custom relations.

7. **Remove deprecated temporal types**  
   PR [#994](https://github.com/substrait-io/substrait/pull/994) removes deprecated `time`, `timestamp`, and `timestamp_tz` types across proto, dialect schema, extension YAMLs, grammar, tests, tooling, and docs. This is one of the largest compatibility-facing changes currently in flight and will affect implementers maintaining older type mappings.

8. **Remove deprecated aggregate grouping field**  
   PR [#1002](https://github.com/substrait-io/substrait/pull/1002) removes `Aggregate.Grouping.grouping_expressions` in favor of `expression_references`. This continues the project’s deprecation cleanup and reduces ambiguity in aggregate plan encoding.

9. **Enum argument support added to test grammar**  
   PR [#1010](https://github.com/substrait-io/substrait/pull/1010) was closed after adding explicit enum argument support to the `FuncTestCase` grammar. Although already merged/closed, it is foundational because it enables follow-on work like #1011 and #1012 and improves correctness in extension test definitions.

10. **Overall momentum: coordinated spec modernization**  
   Taken together, the active PR set points to a strong maintainability push: cleaner type systems, clearer aggregate semantics, more precise extension modeling, and stronger test grammar support. For downstream engine authors, this means near-term migration work but a more consistent spec surface over time.

## 3. Hot Issues
No issues were updated in the last 24 hours, so there are no active “Hot Issues” to report for today.

## 5. Feature Request Trends
Based on the current PR activity, the strongest feature direction is **more precise extension and function semantics**. Contributors are refining how functions express behavior through enum arguments instead of looser option mechanisms, suggesting demand for less ambiguous cross-engine interoperability.

A second trend is **better support for real-world SQL/runtime semantics**, especially execution-context variables like current date/time/timezone and richer collection functions such as `element_at`. These are practical gaps for engines trying to round-trip or standardize everyday query behavior.

A third trend is **spec simplification through deprecation removal**. Multiple PRs focus on deleting legacy fields and types, indicating the community values a cleaner, less duplicated standard even when it introduces migration work.

## 6. Developer Pain Points
The biggest recurring pain point appears to be **semantic ambiguity in the spec**, especially around when to use function options versus enum arguments, and how extension relations communicate output schemas. Several PRs directly address areas where implementers could reasonably interpret behavior differently.

Another likely pain point is **deprecation burden and compatibility churn**. The removal of old temporal types and aggregate fields shows that downstream consumers may need to update parsers, generators, tests, and type mappings in lockstep.

Finally, **test and grammar expressiveness** remains a practical concern. The need for dedicated enum argument support in function test cases suggests that previous tooling made some valid semantics awkward or incorrectly represented, creating friction for extension authors.

## 2. Releases
No new releases were published in the last 24 hours.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*