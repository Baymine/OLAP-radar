# OLAP Ecosystem Index Digest 2026-04-04

> Generated: 2026-04-04 01:21 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — OLAP Data Infrastructure Ecosystem
**Date:** 2026-04-04

## 1. Ecosystem Overview
The current OLAP data infrastructure landscape shows steady investment in **correctness, interoperability, and operational ergonomics** rather than headline-grabbing releases. Across dbt-core, Spark, and Substrait, maintainers are addressing different layers of the analytics stack: dbt at the transformation/workflow layer, Spark at the execution/runtime layer, and Substrait at the cross-engine plan/specification layer. A common pattern is visible: communities are pushing toward **safer automation, clearer semantics, and better compatibility with modern warehouse/lakehouse expectations**. At the same time, the projects differ sharply in maturity and pace, with Spark showing the broadest active implementation surface, Substrait advancing specification depth, and dbt surfacing high-signal operational reliability concerns.

## 2. Activity Comparison

| Project | Updated Issues Today | Updated PRs Today | Release Status Today | Primary Signal |
|---|---:|---:|---|---|
| **dbt-core** | 2 | 4 | No new release | Reliability and parsing/caching correctness |
| **Apache Spark** | 2 | 10 | No new release | Broad runtime, SQL, Python, and streaming iteration |
| **Substrait** | 0 | 10 | No new release | Spec evolution and interoperability expansion |

## 3. Shared Feature Directions

### A. Stronger correctness and safer semantics
- **dbt-core:** Exit code may incorrectly return success on failed runs/tests; UDF parameter/column shadowing risk.
- **Spark:** API behavior mismatch in `spark.conf.get(..., default)`; DSv2 metrics and SQL semantics work improve correctness and observability.
- **Substrait:** Breaking fix for `subtract:date_iday`; DAG-safe outer reference handling; lateral join semantics.
- **Common need:** Users increasingly expect systems to prevent or clearly expose **valid-but-wrong behavior**, not just syntax/runtime failures.

### B. Better observability and operational debugging
- **dbt-core:** Ongoing work on partial parsing log levels; operational risk from incorrect process exit codes.
- **Spark:** Streaming query/batch IDs in logs; DSv2 update metrics; admission control documentation.
- **Substrait:** Less runtime-observability oriented, but governance/docs work improves implementation clarity.
- **Common need:** Teams want more explicit signals for **automation, CI/CD, production monitoring, and debugging**.

### C. Improved interoperability and standards alignment
- **Spark:** `QUALIFY` support, nanosecond timestamp types, Python/Connect API improvements.
- **Substrait:** URN-based extension references, richer dialect constraints, unsigned integer extensions.
- **dbt-core:** Less standards-driven in today’s updates, but Docker/Python version alignment reflects ecosystem compatibility concerns.
- **Common need:** Better alignment with **modern SQL dialects, external engines, and evolving type systems**.

### D. Developer productivity and reduced friction
- **dbt-core:** Partial parse cache invalidation fix reduces unnecessary reparsing.
- **Spark:** JSON ingestion from DataFrame, Arrow-path optimization for Python UDFs, clearer streaming docs.
- **Substrait:** Canonical extension identifiers and clearer compatibility policy reduce implementer ambiguity.
- **Common need:** Communities are prioritizing **fewer paper cuts and more predictable behavior** for daily developer workflows.

## 4. Differentiation Analysis

### dbt-core
- **Scope:** Analytics engineering workflow, SQL transformation orchestration, testing, parsing, and build lifecycle.
- **Target users:** Analytics engineers, transformation owners, CI/CD pipeline operators.
- **Technical approach:** Declarative project compilation and execution with strong emphasis on developer workflow, reproducibility, and orchestration safety.
- **Current focus:** Reliability of automation signals and parser/cache consistency.

### Apache Spark
- **Scope:** General-purpose distributed compute engine spanning SQL, batch, streaming, Python APIs, runtime controls, and connector interfaces.
- **Target users:** Data engineers, platform teams, streaming operators, connector developers, Python and JVM application developers.
- **Technical approach:** Large execution engine with broad surface area, balancing API ergonomics, optimizer/runtime behavior, and multi-mode deployment support.
- **Current focus:** Simultaneous iteration across SQL compatibility, Python usability, streaming reliability, and cluster/runtime consistency.

### Substrait
- **Scope:** Cross-engine query plan and type interoperability specification.
- **Target users:** Engine developers, query planner authors, connector and interoperability implementers.
- **Technical approach:** Specification-first standardization of plan semantics, types, extensions, and dialect metadata.
- **Current focus:** Representational completeness for complex SQL, stronger typing semantics, and cleaner interoperability contracts.

## 5. Community Momentum & Maturity

### Most active implementation community: Apache Spark
Spark shows the broadest visible momentum today, with **10 active PRs** across execution, SQL, Python, streaming, and runtime control. This breadth indicates a highly active and mature community capable of parallel iteration across many subsystems. Its issue count is low today, but PR diversity signals sustained maintainer and contributor throughput.

### Most active specification iteration: Substrait
Substrait also has **10 active PRs**, but the activity is concentrated in **spec expansion and governance**, not runtime bug fixing. Multiple PMC-ready proposals suggest a project that is still rapidly defining core semantics and closing representational gaps. This is a sign of strong forward motion, though maturity should be interpreted as **emerging standard maturity**, not operational runtime maturity.

### Highest operational risk signal: dbt-core
dbt-core has lower raw activity today, but the **exit-code regression report** is strategically important because it touches trust in production automation. Its PR set is smaller and more maintenance-oriented, suggesting a comparatively lighter day, but the issues that did surface are high leverage for users. dbt appears mature in adoption, with today’s signals centered more on **stability and correctness under real workflows** than on expansive new capability.

## 6. Trend Signals

### 1) Silent failure modes are becoming unacceptable
The dbt exit-code issue and Spark API correctness discussions reinforce that modern data platforms are judged not just on features, but on whether they fail **explicitly and machine-detectably**. This is highly relevant for teams operating CI pipelines, schedulers, and production data contracts.

### 2) SQL/lakehouse interoperability remains a priority
Spark’s `QUALIFY` work and Substrait’s extension/type-system evolution indicate continued pressure toward **cross-engine SQL portability** and better compatibility with warehouse-style semantics. Data engineers should expect ongoing convergence around common analytical SQL constructs and richer type fidelity.

### 3) Python remains a strategic interface, but performance and ergonomics still need work
Spark’s Python-focused PRs show that Python is still central to analytics engineering and ML-adjacent workloads, yet execution-path inefficiencies and API friction remain active investment areas. Teams relying heavily on PySpark should view this as positive momentum, but also as evidence that optimization opportunities remain.

### 4) Streaming maturity is shifting from features to operability
Spark’s streaming-related PRs emphasize logging, checkpoint recovery, and admission control rather than brand-new streaming abstractions. This suggests the market is demanding **production-hardening and observability** more than net-new streaming primitives.

### 5) Interoperability standards are moving from theory to implementation detail
Substrait’s work on outer references, lateral joins, URNs, and type constraints shows that standardization is entering harder semantic territory. For engine builders and platform architects, this is a strong signal that interoperability layers are becoming more practical and more consequential for long-term architecture decisions.

### 6) Developer experience now includes internal transparency
Across dbt and Spark especially, log levels, metrics, and clearer behavior around parsing/runtime internals matter more than before. Data engineers increasingly need systems that are not only powerful, but also **explainable under failure, fallback, and optimization paths**.

If you want, I can also convert this into:
- a **1-page executive briefing**,
- a **Slack-friendly summary table**, or
- a **scored vendor/technology watchlist view**.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-04-04

## 1. Today's Highlights
dbt-core saw no new releases in the last 24 hours, but two notable issue updates surfaced around correctness and operational reliability. The most urgent appears to be a newly reported bug where failing `dbt run` or `dbt test` commands may still return exit code `0`, while community PR activity continued around parsing stability, Docker/Python version maintenance, and codebase cleanup.

## 3. Hot Issues

### 1) Exit codes may incorrectly report success on failed runs/tests
- **Issue:** [#12770](dbt-labs/dbt-core Issue #12770) — **[Bug] Errors/Test Failures in DBT commands falsely returning exit code 0**
- **Why it matters:** This is potentially a high-severity operational regression. CI/CD systems, orchestrators, and deployment pipelines depend on dbt’s process exit codes to detect failure; if dbt returns success on failed models or tests, teams could unknowingly promote broken artifacts downstream.
- **Community reaction:** Newly opened with no comments yet, but this type of issue is likely to draw attention quickly because it affects automation guarantees and production safety.

### 2) UDF parameter names silently shadowed by column names
- **Issue:** [#12707](dbt-labs/dbt-core Issue #12707) — **[UDFs] [Feature] Warn or fail when SQL-language function parameter names shadow column names**
- **Why it matters:** The report highlights a subtle correctness hazard in PostgreSQL SQL-language functions: when a function parameter name collides with a referenced column name, PostgreSQL resolves to the column silently. For dbt users building UDFs, this can create hard-to-detect semantic errors and incorrect results.
- **Community reaction:** Early-stage discussion so far, with limited engagement, but it touches a real trust issue for users adopting dbt-managed UDF workflows.

> Note: Only two issues were updated in the provided 24-hour window, so the digest includes all available noteworthy issue activity rather than forcing a top 10.

## 4. Key PR Progress

### 1) Fix partial parse cache invalidation when `meta` uses integer keys
- **PR:** [#12771](dbt-labs/dbt-core PR #12771) — **Fix partial parse cache drop when meta contains integer keys**
- **What it does:** Addresses a parsing/cache stability issue caused by YAML integer keys in `meta` blocks. Since PyYAML can deserialize bare numeric keys as Python integers, dbt’s serialization path could behave inconsistently and trigger unnecessary cache drops.
- **Why it matters:** Partial parsing is a key performance feature in dbt. Fixing avoidable cache invalidation improves developer feedback loops and reduces confusion around why projects re-parse unexpectedly.

### 2) Dockerfile maintenance: move Python baseline from 3.11 to 3.12
- **PR:** [#11182](dbt-labs/dbt-core PR #11182) — **fix: python version up to 3.12 from 3.11 in Dockerfile #9654**
- **What it does:** Updates the Dockerfile’s Python version to 3.12.
- **Why it matters:** Keeping dbt’s container environment current helps users align with supported Python versions, receive active bug fixes, and reduce drift between local and containerized execution environments.

### 3) Internal refactor of `safe_run_hooks`
- **PR:** [#10944](dbt-labs/dbt-core PR #10944) — **[Tidy-First] Refactor safe run hooks**
- **What it does:** Cleans up the implementation of `safe_run_hooks` without intending logical changes.
- **Why it matters:** While not user-facing, hook execution is a core runtime path. Readability improvements can lower maintenance cost and make future bug fixes in hook behavior safer.

### 4) Revisit log levels for partial parsing messages
- **PR:** [#8934](dbt-labs/dbt-core PR #8934) — **changes log levels for partial parsing messages**
- **What it does:** Adjusts logging verbosity/severity for partial parsing messages.
- **Why it matters:** Partial parsing behavior can be confusing to users. Better-calibrated logs help developers understand whether dbt is behaving normally, falling back, or invalidating caches in ways that affect performance and reliability.

> Note: Only four PRs were updated in the provided data, so all available PR activity is included.

## 5. Feature Request Trends
Based on the current issue set, two feature directions stand out:

- **Stronger correctness safeguards for newer dbt abstractions:** The UDF-related issue shows growing demand for dbt to proactively detect SQL semantics that can produce valid-but-wrong behavior, especially as dbt expands beyond straightforward model compilation.
- **More explicit failure signaling and safer defaults:** Even though one item is filed as a bug, it reflects a broader user expectation that dbt should fail loudly and unambiguously in automation scenarios rather than relying on users to infer errors from logs.

## 6. Developer Pain Points
Several recurring frustrations are evident from today’s updates and PR activity:

- **Silent failure modes are unacceptable in production workflows:** The exit-code bug is especially painful for teams running dbt in CI, Airflow, Dagster, GitHub Actions, and other orchestrators.
- **Subtle parsing/serialization edge cases still disrupt iteration speed:** The integer-key `meta` fix points to continued sensitivity in YAML parsing and partial parsing cache behavior.
- **Observability of dbt internals needs tuning:** The long-running effort to adjust partial parsing log levels suggests users and maintainers still need clearer signals about what dbt is doing under the hood.
- **Environment drift remains a maintenance concern:** The Docker/Python update underscores ongoing pressure to keep dbt’s runtime images aligned with current Python support expectations.

If you'd like, I can also turn this into a shorter Slack-style version or a more editorial newsletter format.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-04-04

## 1. Today's Highlights
Spark had a light issue day but an active PR queue, with most visible momentum around SQL semantics, Python/Connect ergonomics, Structured Streaming internals, and runtime behavior across deployment modes. Two themes stand out: incremental polish for developer-facing APIs and a deeper push into execution/runtime correctness, especially around DSv2, Python interoperability, and processor-count controls in standalone and local environments.

## 2. Hot Issues

> Note: only 2 issues were updated in the last 24 hours from the provided dataset, so this section includes all currently active noteworthy items available.

### 1) PySpark `spark.conf.get(..., default)` raises instead of returning the default
- **Issue:** [#55155](https://github.com/apache/spark/issues/55155)
- **Status:** Closed
- **Why it matters:** This touches a basic PySpark usability contract. If `spark.conf.get("non-existent-key", "my_default")` throws `AnalysisException` instead of returning the fallback, it breaks expectations set by the documentation and can force defensive exception handling into common application code.
- **Community reaction:** Limited discussion volume, but the issue is important because it concerns API correctness and documentation alignment in a widely used surface area.

### 2) Spark binary download webpage is broken
- **Issue:** [#55187](https://github.com/apache/spark/issues/55187)
- **Status:** Open
- **Why it matters:** Broken dropdowns on the downloads page directly affect onboarding and upgrades, especially for users fetching prebuilt binaries rather than building from source. This is a high-visibility ecosystem issue even if the technical scope is small.
- **Community reaction:** Only one comment so far, but this is the sort of website breakage that often impacts many more users than the thread volume suggests.

## 3. Key PR Progress

### 1) Document admission control in PySpark streaming data sources
- **PR:** [#54807](https://github.com/apache/spark/pull/54807)
- **Area:** Structured Streaming / Python docs
- **What changed:** Adds documentation and examples for admission control in PySpark custom streaming data sources.
- **Why it matters:** Better docs around backpressure/admission behavior reduce the barrier to implementing robust Python streaming connectors and help align PySpark capabilities with JVM-side streaming expectations.

### 2) Skip `ColumnarToRow` for Arrow-backed input to Python UDFs
- **PR:** [#55120](https://github.com/apache/spark/pull/55120)
- **Area:** SQL / Python execution
- **What changed:** Proposes bypassing an unnecessary `ColumnarToRow` conversion when Python UDF input is already Arrow-backed.
- **Why it matters:** This is a meaningful execution-path optimization. Reducing format conversions can improve Python UDF performance and lower overhead in mixed columnar/Python workloads.

### 3) Support `limitActiveProcessorCount` in standalone mode
- **PR:** [#55190](https://github.com/apache/spark/pull/55190)
- **Area:** Core / cluster runtime
- **What changed:** Extends `spark.executor.limitActiveProcessorCount.enabled` and `spark.driver.limitActiveProcessorCount.enabled` to standalone mode.
- **Why it matters:** This improves CPU-governance consistency across cluster managers and helps operators better control JVM-visible processor counts in standalone deployments.

### 4) Support `limitActiveProcessorCount` in local mode
- **PR:** [#55132](https://github.com/apache/spark/pull/55132)
- **Area:** Core / local runtime
- **What changed:** Extends active-processor-count limiting to local mode by injecting the JVM flag into the local driver path.
- **Why it matters:** Important for reproducibility, resource isolation, and local testing parity with clustered deployments.

### 5) Make `spark.read.json` accept DataFrame input
- **PR:** [#55097](https://github.com/apache/spark/pull/55097)
- **Area:** Python / Connect
- **What changed:** Allows `spark.read.json()` to parse a single-string-column DataFrame as input.
- **Why it matters:** This improves in-memory ingestion ergonomics and removes the need for awkward `parallelize`-style workarounds when parsing JSON text already held in DataFrames.

### 6) Add operation metrics for `UPDATE` queries in DSv2
- **PR:** [#55141](https://github.com/apache/spark/pull/55141)
- **Area:** Data Source V2 / SQL
- **What changed:** Adds metrics such as `numUpdatedRows` and `numCopiedRows` for DSv2 `UPDATE` operations.
- **Why it matters:** Better mutation observability is valuable for lakehouse connectors, query debugging, and operational monitoring of row-level updates.

### 7) Add `QUALIFY` clause support
- **PR:** [#55019](https://github.com/apache/spark/pull/55019)
- **Area:** SQL
- **What changed:** Implements support for the SQL `QUALIFY` clause.
- **Why it matters:** `QUALIFY` is a frequently requested SQL ergonomics feature that simplifies filtering on window-function outputs and improves compatibility with modern analytical SQL dialects.

### 8) Include streaming query and batch IDs in scheduling logs
- **PR:** [#55166](https://github.com/apache/spark/pull/55166)
- **Area:** Streaming / observability
- **What changed:** Adds structured identifiers for streaming query and batch IDs to scheduling logs.
- **Why it matters:** This helps operators correlate scheduling behavior with specific micro-batches and queries, making production streaming debugging easier.

### 9) Integrate checkpoint V2 with auto-repair snapshot
- **PR:** [#55015](https://github.com/apache/spark/pull/55015)
- **Area:** Structured Streaming / state store
- **What changed:** Brings auto-repair snapshot support into the checkpoint V2 load path.
- **Why it matters:** This strengthens failure recovery in stateful streaming, especially where snapshot corruption or partial state issues would previously bypass repair logic.

### 10) Add DataType classes for nanosecond timestamp types
- **PR:** [#54966](https://github.com/apache/spark/pull/54966)
- **Area:** SQL types
- **What changed:** Introduces `TimestampNanosType` and `TimestampNTZNanosType`.
- **Why it matters:** Nanosecond precision is increasingly relevant for event processing, high-frequency telemetry, and interoperability with modern storage engines and external systems.

## 4. Feature Request Trends

Based on the current issue/PR activity, the strongest feature directions are:

- **Better SQL dialect coverage and warehouse compatibility**
  - Examples: `QUALIFY`, richer column comment semantics, nanosecond timestamp types, clearer DSv2 error conditions.
  - Direction: Spark continues to close gaps with cloud data warehouse and lakehouse SQL expectations.

- **Improved Python and Spark Connect ergonomics**
  - Examples: `spark.read.json(DataFrame)`, PySpark streaming docs, Connect dependency cleanup, Python UDF execution-path optimization.
  - Direction: The project is investing in reducing friction for Python-first users and making Connect behave more like core Spark APIs.

- **More production-grade streaming reliability and observability**
  - Examples: checkpoint V2 auto-repair integration, admission control docs, batch/query IDs in logs.
  - Direction: Structured Streaming maturity remains a clear focus, especially around operability rather than just raw features.

- **Stronger runtime resource controls across environments**
  - Examples: active processor count support in standalone and local mode.
  - Direction: Spark is working toward more consistent resource semantics across YARN, standalone, and local execution.

- **Richer DSv2 introspection and framework cleanup**
  - Examples: `UPDATE` metrics, named errors, scan relation simplification, types framework integration.
  - Direction: DSv2 remains a strategic foundation area, with emphasis on maintainability, observability, and connector-facing APIs.

## 5. Developer Pain Points

- **API behavior that diverges from documentation**
  - The `spark.conf.get(..., default)` issue is a good example of how small inconsistencies create outsized developer friction, especially in PySpark.

- **Basic UX and ecosystem paper cuts**
  - A broken downloads page is not a core engine bug, but it directly impacts adoption, upgrades, and first impressions.

- **Python execution inefficiencies**
  - Ongoing work around Arrow-backed Python UDF paths shows that serialization/conversion overhead is still a practical pain point for users mixing Spark SQL and Python logic.

- **Streaming operability remains complex**
  - Multiple PRs focus on logging, checkpoint recovery, and admission control documentation, indicating that running stateful streaming workloads is still harder than many teams want.

- **Cross-mode behavior inconsistencies**
  - The need to extend processor-count controls into standalone and local modes highlights a recurring frustration: features often arrive first in one deployment mode and only later become consistent elsewhere.

- **Connector and DSv2 complexity**
  - Work on named errors, metrics, and relation-pattern simplification suggests connector developers still face unnecessary complexity in Spark’s evolving DSv2 surface.

## 6. Releases

No new Spark releases were reported in the last 24 hours.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait Community Digest — 2026-04-04

## 1) Today’s Highlights
Substrait saw continued momentum in specification and test-infrastructure work, with notable activity around extension references, dialect parameterization, and several proposal-level PRs that are approaching PMC review readiness. The most consequential changes in flight are a breaking fix to date/interval subtraction semantics, support for parameterized type limits in dialects, and ongoing work to improve correlated subquery handling in DAG-shaped plans.

## 4) Key PR Progress

1. **[#1028](https://github.com/substrait-io/substrait/pull/1028) — feat(tests): use URN instead of path for extension references**  
   This updates the test framework to use canonical URNs such as `extension:io.substrait:functions_arithmetic` rather than file paths. It matters because it makes extension resolution more stable, portable, and aligned with how implementations should identify extensions. It also closes a long-standing issue around path-based ambiguity.

2. **[#1029](https://github.com/substrait-io/substrait/pull/1029) — fix(extensions)!: correct return type for subtract:date_iday operation**  
   A breaking change proposal corrects `subtract:date_iday` to return `precision_timestamp` instead of `date`. This is important for semantic correctness: subtracting an `interval_day` can involve sub-day precision, so a date-only result was lossy. Engine implementers will want to watch this closely because it may require compatibility handling.

3. **[#1030](https://github.com/substrait-io/substrait/pull/1030) — feat(dialect): support max length, scale, precision for parameterized types**  
   This adds `max_length` for string/binary-like types and `max_precision`/`max_scale` for decimals in the dialect schema. The change improves how dialects express implementation constraints and should help engines communicate type-system limits more precisely.

4. **[#973](https://github.com/substrait-io/substrait/pull/973) — feat: introduce lateral join in the JoinRel for a correlated subquery evaluation**  
   Marked PMC Ready, this proposal introduces lateral join semantics to support correlated subqueries that cannot be cleanly decorrelated. This is a significant step for representing more realistic SQL plans and for improving interoperability across optimizers and execution engines.

5. **[#1031](https://github.com/substrait-io/substrait/pull/1031) — feat: add id-based outer reference resolution for DAG plans**  
   Also PMC Ready, this PR adds `RelCommon.id` and `OuterReference.id_reference` to enable unambiguous outer reference resolution in DAG-shaped plans. This addresses a real modeling gap where `steps_out` works for trees but becomes fragile in the presence of shared subexpressions.

6. **[#1009](https://github.com/substrait-io/substrait/pull/1009) — feat: add TopNRel physical operator with WITH TIES support**  
   This adds a physical `TopNRel` operator combining sort and fetch, including `WITH TIES`. It fills an explicit gap between documented physical behavior and protobuf coverage, making physical plan interchange more complete.

7. **[#953](https://github.com/substrait-io/substrait/pull/953) — feat(extensions): add unsigned integer extension types (u8, u16, u32, u64)**  
   Another PMC Ready item, this PR proposes unsigned integer extension types with arithmetic functions and tests. It is especially relevant for systems that need closer alignment with Arrow-style type systems or source engines that expose unsigned values natively.

8. **[#1026](https://github.com/substrait-io/substrait/pull/1026) — docs: supported libraries + breaking change policy**  
   This documentation PR aims to clarify supported libraries and establish a breaking-change policy. While not a feature change, it is strategically important because implementers need predictable governance and compatibility expectations.

9. **[#1032](https://github.com/substrait-io/substrait/pull/1032) — chore(deps): bump prefix-dev/setup-pixi from 0.9.4 to 0.9.5**  
   Routine dependency maintenance for GitHub Actions. Low strategic impact, but useful for keeping CI current and reducing tooling drift.

10. **Overall PR queue signal**  
   The current open PR set leans heavily toward spec evolution rather than bug triage: correlated subqueries, DAG references, physical Top-N, unsigned integer types, and richer dialect constraints. That suggests the project is in an active capability-expansion phase, with several changes likely to affect downstream engine implementations once merged.

## 5) Feature Request Trends
Based on current PR activity, the strongest feature direction is **richer plan semantics for complex SQL**, especially correlated subqueries, lateral joins, and DAG-safe outer references. A second trend is **more expressive typing and dialect metadata**, including parameterized type limits and unsigned integer support. A third is **improved interoperability and canonicalization**, visible in work to move extension references to URNs and in efforts to formalize compatibility policy.

## 6) Developer Pain Points
A recurring pain point is **ambiguity in plan representation**, particularly around outer references and correlated subqueries in non-tree plan structures. Another is **insufficient precision in type semantics**, as shown by the breaking fix for date/interval subtraction and the push for explicit max length/precision metadata in dialects. Finally, developers appear to need **clearer compatibility and extension-governance guidance**, which helps explain the attention on breaking-change policy and canonical extension identifiers.

## Notes
- **Releases:** No new releases in the last 24 hours.
- **Hot Issues:** No issues were updated in the last 24 hours, so there is no issue activity to summarize today.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*