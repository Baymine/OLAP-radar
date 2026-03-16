# OLAP Ecosystem Index Digest 2026-03-16

> Generated: 2026-03-16 01:28 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project OLAP Ecosystem Comparison Report — 2026-03-16

## 1. Ecosystem Overview
The current OLAP data infrastructure landscape shows a mix of **execution-engine hardening, metadata ergonomics, and semantic correctness work** across projects. Spark is the most implementation-active today, with broad PR activity spanning SQL semantics, streaming performance, catalog behavior, and Spark Connect lifecycle correctness. dbt-core shows stronger **user-facing issue pressure**, especially around snapshots, parsing efficiency, and manifest/graph programmability. Substrait is comparatively quiet, but its visible activity reinforces its role as a **specification layer where type precision and interoperability correctness matter more than volume of changes**.

## 2. Activity Comparison

| Project | Updated Issues Today | Active / Updated PRs Highlighted Today | Release Status Today |
|---|---:|---:|---|
| dbt-core | 7 hot issues highlighted | 3 PRs highlighted | No new release noted |
| Apache Spark | 0 updated issues | 10 key PRs highlighted (+ several notable others) | No new release |
| Substrait | 0 updated issues | 1 PR highlighted | No new release |

### Observations
- **dbt-core** has the strongest visible issue-driven community feedback loop today.
- **Spark** has the highest engineering throughput, concentrated in PRs rather than issue discussion.
- **Substrait** is low-volume but focused on high-leverage spec correctness.

## 3. Shared Feature Directions

### A. Semantic correctness and standards alignment
- **Spark:** SQL correctness fixes (`dropDuplicates` + `exceptAll`), `TIMESTAMP WITH LOCAL TIME ZONE`, catalog precedence rules.
- **Substrait:** correcting extension return-type semantics for `add:date_iyear`.
- **dbt-core:** snapshot correctness issues and config interpretation ambiguity (`static_analysis: off`).
- **Shared need:** predictable semantics across planning, metadata, and runtime behavior.

### B. Better support for advanced metadata and introspection
- **dbt-core:** request and PR to expose macros in the Jinja `graph` context.
- **Spark:** ongoing work around catalog resolution and metadata behavior such as `_metadata` coverage and namespace precedence.
- **Shared need:** richer metadata surfaces for dynamic tooling, package logic, and federated platform workflows.

### C. Performance and operational efficiency
- **dbt-core:** stop parsing disabled models; configurable seed-size constraints.
- **Spark:** multiple Structured Streaming and RocksDB state-store optimizations.
- **Shared need:** lower overhead in large-scale deployments, whether at compile/parse time or runtime/state-store time.

### D. Reliability in production workflows
- **dbt-core:** snapshot duplicate-row bug, clearer unique-key error messaging.
- **Spark:** interrupt handling in Spark Connect, state-store test and performance hardening.
- **Substrait:** spec-level type correctness to avoid downstream engine divergence.
- **Shared need:** fewer edge-case failures in production data pipelines and platform integrations.

## 4. Differentiation Analysis

| Dimension | dbt-core | Apache Spark | Substrait |
|---|---|---|---|
| Primary scope | Analytics engineering / transformation orchestration | Distributed compute engine for batch, SQL, and streaming | Cross-engine query specification / interoperability standard |
| Main user base | Analytics engineers, dbt package authors, data platform teams | Data engineers, platform engineers, ML/data infra teams | Engine implementers, query planners, interoperability/tooling developers |
| Current technical focus | Snapshots, manifest metadata, parse-time ergonomics, enterprise Python workflows | SQL planner correctness, streaming state efficiency, Connect robustness, catalog semantics | Type-system/spec correctness in extensions |
| Mode of community demand | User-reported workflow pain and feature requests | Code-centric iteration through PRs and subsystem improvements | Low-volume, standards-driven refinement |
| Typical adoption driver | Faster, governed analytics development | Scalable execution and unified processing | Portability and consistent semantics across engines |

### Key differences
- **dbt-core** is closest to the analyst and transformation-author workflow, so its issues skew toward usability, correctness, and project ergonomics.
- **Spark** operates at the execution layer, so current work is more implementation-heavy and performance-sensitive.
- **Substrait** is a coordination/specification layer; even a single type fix can have outsized ecosystem impact because it affects interoperability contracts.

## 5. Community Momentum & Maturity

### Most active today
- **Apache Spark** shows the strongest raw implementation momentum, with a large number of concurrent PRs across multiple subsystems.
- **dbt-core** shows the strongest visible end-user feedback pressure, especially around snapshots and project ergonomics.

### Rapid iteration signals
- **Spark** appears to be rapidly iterating in Spark 4.x-era areas: Connect, Structured Streaming, SQL dialect coverage, and catalog behavior.
- **dbt-core** is iterating around high-friction product surfaces rather than broad subsystem expansion, especially snapshots and metadata APIs.

### Maturity signals
- **Spark** demonstrates mature-project behavior: many targeted fixes, standards-compliance work, runtime cleanup, and documentation refinement.
- **dbt-core** also shows maturity, but with persistent pressure on long-standing ergonomics and correctness gaps that matter directly to production trust.
- **Substrait** looks mature in a different way: lower activity, but high sensitivity to specification precision and breaking-change discipline.

## 6. Trend Signals

### 1. Semantic precision is becoming a top-tier requirement
Across dbt-core, Spark, and Substrait, communities are prioritizing correctness in snapshots, SQL planning, catalog resolution, and type definitions. For data engineers, this signals that **semantic mismatches remain a major source of operational risk**, especially in heterogeneous stacks.

### 2. Metadata programmability is increasingly strategic
dbt’s `graph` enhancement request and Spark’s metadata/catalog work both indicate growing demand for **introspectable platform metadata**. This is especially relevant for teams building reusable frameworks, governance automation, lineage-aware tooling, and dynamic SQL generation.

### 3. Stateful and interactive systems need stronger operational guarantees
Spark’s work on Connect cancellation and state-store optimization highlights the need for **more predictable behavior in interactive and streaming workloads**. For engineering teams, this raises the importance of validating cancellation semantics, state growth patterns, and subsystem-specific tuning in production.

### 4. Enterprise platform requirements are moving upstream
dbt’s private PyPI request and Spark’s steady hardening of operational defaults reflect a broader trend: **enterprise deployment constraints are no longer edge cases**. Secure package management, controllable limits, and explicit config semantics are increasingly baseline expectations.

### 5. Large-scale usability matters as much as feature depth
dbt parsing overhead and Spark streaming-state efficiency point to the same macro trend: users want systems that remain manageable as projects scale in model count, catalog complexity, or state size. For practitioners, this means tool evaluation should include **operability at scale**, not just feature checklists.

## Bottom Line for Data Engineers
- Choose **dbt-core** when transformation workflow productivity, metadata-driven development, and analytics engineering governance are primary concerns—but watch snapshot reliability and enterprise Python support maturity.
- Choose **Spark** when execution breadth, streaming scale, and SQL/runtime sophistication are central—but expect ongoing complexity in stateful streaming and catalog behavior.
- Track **Substrait** if interoperability, portable plans, or multi-engine strategy matter; its low activity volume should not be mistaken for low importance.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-03-16

## Today's Highlights
dbt-core activity over the last day centered on snapshots, graph metadata access, and a few long-running ergonomics requests. The most notable movement was a community PR to expose macros through the Jinja `graph` context, directly responding to a freshly opened feature request. Snapshot-related issues also remain a visible pain point, spanning correctness bugs, simpler deletion-tracking workflows, and clearer error messages.

## Hot Issues

1. **Duplicate rows with snapshot `check` strategy**  
   [Issue #11235](https://github.com/dbt-labs/dbt-core/issues/11235)  
   This is the most consequential active bug in the current set: users report that snapshots using the `check` strategy can sometimes create duplicate rows, which directly threatens historical correctness and trust in SCD-style tracking. It has the strongest visible engagement in this batch, with 14 comments and 2 👍, suggesting active investigation and community concern.

2. **Streamlined snapshots for deletion-only protection**  
   [Issue #11867](https://github.com/dbt-labs/dbt-core/issues/11867)  
   This feature request asks for a lighter-weight snapshot mode when teams only want to preserve rows deleted from source tables, rather than full change history. It matters because many teams use snapshots for retention and recovery use cases, and current semantics may feel heavier than necessary for that pattern.

3. **Add macros to the `graph` context variable**  
   [Issue #12647](https://github.com/dbt-labs/dbt-core/issues/12647)  
   This request would make macros visible in the Jinja `graph` API alongside nodes, sources, metrics, and other resources. It matters for advanced metadata-driven workflows, macro introspection, and package authors building dynamic behavior on top of the manifest.

4. **Stop parsing disabled models**  
   [Issue #11955](https://github.com/dbt-labs/dbt-core/issues/11955)  
   Users packaging dbt projects with many disabled models want parsing to skip those resources entirely. This reflects a broader performance and developer-experience theme: teams want faster project startup and less overhead from configuration patterns that intentionally disable large model sets.

5. **Improve snapshot unique-key error messaging**  
   [Issue #10864](https://github.com/dbt-labs/dbt-core/issues/10864)  
   Labeled `good_first_issue`, this asks for better error messages when snapshot `unique_key` assumptions are violated. Even without high engagement, it is important because snapshot failures can be difficult to diagnose, and clearer guidance would reduce time-to-resolution for many users.

6. **`static_analysis: off` interpreted as `false`**  
   [Issue #12015](https://github.com/dbt-labs/dbt-core/issues/12015)  
   This bug points to configuration parsing ambiguity in Fusion-era settings, where `off` is being treated as boolean `false`. That matters because config semantics need to be predictable, especially as dbt introduces richer configuration vocabularies across runtimes.

7. **Private PyPI packages in Python UDFs**  
   [Issue #12655](https://github.com/dbt-labs/dbt-core/issues/12655)  
   A newly opened request, this highlights enterprise demand for secure dependency management in Python UDF workflows. Support for private packages would make dbt more viable in regulated or internal-platform-heavy environments where public package indexes are insufficient.

## Key PR Progress

1. **Expose macros in the manifest flat graph / Jinja graph API**  
   [PR #12656](https://github.com/dbt-labs/dbt-core/pull/12656)  
   This is the clearest piece of forward motion today: a community PR was opened to add macro metadata to the `graph` context, explicitly closing Issue #12647. If merged, it would improve programmability for users who rely on manifest metadata inside Jinja.

2. **Make `MAXIMUM_SEED_SIZE_MIB` configurable**  
   [PR #11177](https://github.com/dbt-labs/dbt-core/pull/11177)  
   This longstanding PR revisits an old request to make dbt’s 1 MiB seed-size limit configurable. It matters for teams loading moderately sized CSV seeds and reflects continued demand for fewer hard-coded operational limits.

3. **Update pytest-split test durations**  
   [PR #12654](https://github.com/dbt-labs/dbt-core/pull/12654)  
   This bot-authored PR was closed after updating test duration metadata used by `pytest-split`. While not user-facing, it supports CI efficiency and signals ongoing maintenance of test execution performance.

## Feature Request Trends
Several request patterns are emerging from the current issue set:

- **Snapshots need both simplification and reliability.** Users want fewer correctness surprises, clearer errors, and more targeted snapshot behaviors for specific use cases like deletion retention.
- **Manifest and graph metadata should be more complete and programmable.** The request to expose macros in `graph` shows demand for richer introspection capabilities inside Jinja and package logic.
- **Performance and parsing efficiency remain important.** Requests like skipping disabled-model parsing indicate continued friction in large or modular dbt projects.
- **Enterprise Python workflows are expanding.** The private PyPI request suggests users increasingly expect dbt to integrate with internal package ecosystems and governed software supply chains.
- **Configuration semantics must be explicit.** The `static_analysis: off` issue reinforces the need for unambiguous config handling as dbt adds more advanced options.

## Developer Pain Points
Recurring frustrations in this batch are fairly consistent with long-term dbt-core themes:

- **Snapshot ergonomics are still rough.** Users are hitting both functional bugs and usability issues, especially around `check` strategy behavior, deletion handling, and poor validation messages.
- **Large-project performance is still a concern.** Parsing disabled models feels wasteful for package-based architectures and suggests overhead in common enterprise setups.
- **Advanced metadata access is incomplete.** Power users want more resource types available in graph/manifest contexts to enable meta-programming and dynamic project behavior.
- **Operational limits and defaults can feel too rigid.** Seed size caps and config parsing edge cases continue to surface as friction points.
- **Enterprise dependency management remains underpowered.** Python UDF users want first-class support for private package repositories, a common requirement in production data platforms.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-16

## 1. Today's Highlights
Apache Spark activity over the last 24 hours was concentrated in pull requests rather than issues or releases, with notable momentum in SQL semantics, Structured Streaming state-store optimization, and Spark Connect operation lifecycle handling. The day’s most meaningful changes point to continued hardening of Spark 4.x behavior: better correctness around query planning and catalog resolution, improved streaming efficiency on RocksDB-backed state, and several incremental documentation and developer-experience fixes.

## 2. Hot Issues
No GitHub issues were updated in the last 24 hours for `apache/spark`.

## 3. Key PR Progress

1. **Spark Connect interrupt handling in pending operations**  
   PR [#54774](https://github.com/apache/spark/pull/54774) — **[SPARK-53339][CONNECT] Fix interrupt on pending operations by moving `postStarted()` and allowing Pending to Canceled/Failed transition**  
   This is one of the more important correctness fixes in flight. It addresses a broken state transition path in Spark Connect where interrupting an operation while still `Pending` could throw `IllegalStateException` and leave the operation unrecoverable. This matters for remote clients and interactive workloads where cancellation semantics must be reliable.

2. **Structured Streaming LeftSemi join optimization**  
   PR [#54769](https://github.com/apache/spark/pull/54769) — **[SPARK-55973][SS] LeftSemi optimization for stream-stream join**  
   A significant streaming optimization proposal focused on reducing unnecessary state-store work in stream-stream LeftSemi joins. For data engineers running stateful pipelines, improvements here can directly translate into lower state footprint, less I/O, and better end-to-end latency.

3. **RocksDB prefix scan upper bound optimization**  
   PR [#54816](https://github.com/apache/spark/pull/54816) — **[SPARK-55997][SS] Set upper bound to prefixScan in RocksDB state store provider**  
   This change aims to make RocksDB scans stop earlier by setting an explicit upper bound for prefix scans. It is a targeted but potentially high-impact state-store efficiency improvement for streaming jobs with prefix-based key access patterns.

4. **Fix for `dropDuplicates(columns)` followed by `exceptAll`**  
   PR [#54814](https://github.com/apache/spark/pull/54814) — **[SPARK-54724][SQL] Fix dropDuplicates(columns) followed by exceptAll causing INTERNAL_ERROR_ATTRIBUTE_NOT_FOUND**  
   A strong correctness fix in Catalyst planning. The proposal preserves original expression IDs during deduplication rewrites, preventing planner failures in a specific but realistic query pattern. This is exactly the type of subtle optimizer bug that can surprise production SQL users.

5. **Support `TIMESTAMP WITH LOCAL TIME ZONE` syntax**  
   PR [#54813](https://github.com/apache/spark/pull/54813) — **[SPARK-55995][SQL] Support TIMESTAMP WITH LOCAL TIME ZONE in SQL syntax**  
   This is an important SQL compatibility and standards-alignment enhancement. Better support for local time zone semantics helps users migrating workloads from other warehouses and federated SQL engines.

6. **Support `CREATE TABLE LIKE` for DataSource V2**  
   PR [#54809](https://github.com/apache/spark/pull/54809) — **[SPARK-33902][SQL] Support CREATE TABLE LIKE for V2**  
   This is a meaningful catalog and DDL capability gap closure. As more connectors and table implementations rely on DataSource V2, parity for common DDL workflows like `CREATE TABLE LIKE` becomes increasingly important.

7. **`to_json` enhancement with `sort_keys` option**  
   PR [#54810](https://github.com/apache/spark/pull/54810) — **[SPARK-54878][SQL] Support sort_keys option inside to_json**  
   This proposed feature improves determinism and interoperability in JSON generation. Sorted object keys are useful for testing, reproducibility, downstream comparisons, and integration with systems that expect stable serialized output.

8. **Catalog precedence fix for BUILTIN and SESSION schemas**  
   PR [#54765](https://github.com/apache/spark/pull/54765) — **[SPARK-55964] system catalog wins over user catalog for BUILTIN, and SESSION schemas**  
   This addresses namespace resolution behavior between system and user catalogs. It matters because catalog ambiguity is a recurring source of confusion in multi-catalog deployments and lakehouse-style environments.

9. **Remove default `jdk.reflect.useDirectMethodHandle=false`**  
   PR [#54815](https://github.com/apache/spark/pull/54815) — **[SPARK-55996][CORE] Remove default `jdk.reflect.useDirectMethodHandle=false`**  
   This is a notable core/runtime change with Java compatibility implications. It appears to revisit an earlier workaround for Java reflection behavior, suggesting the project is cleaning up legacy JVM flags and reassessing default runtime assumptions.

10. **PySpark streaming docs for admission control and AvailableNow**  
    PR [#54807](https://github.com/apache/spark/pull/54807) — **[SPARK-55450][SS][PYTHON][DOCS] Document admission control and Trigger.AvailableNow in PySpark streaming data sources**  
    While documentation-focused, this is strategically useful for Python users building custom streaming sources. Admission control and `Trigger.AvailableNow` are increasingly relevant for production-grade bounded catch-up and incremental batch-like streaming use cases.

### Other notable PRs
- PR [#54794](https://github.com/apache/spark/pull/54794) — Fix default warehouse dir handling when paths include whitespace.
- PR [#54783](https://github.com/apache/spark/pull/54783) — Add golden-file coverage for `_metadata` column resolution.
- PR [#54782](https://github.com/apache/spark/pull/54782) — Upgrade `black` to 26.3.1 for Python tooling/security hygiene.
- PR [#54695](https://github.com/apache/spark/pull/54695) — Remove outdated ANSI-off suggestion from datetime error messaging.
- PR [#54808](https://github.com/apache/spark/pull/54808) — Closed test-only fix for a flaky RocksDB bounded-memory integration test.

## 4. Feature Request Trends
Based on current PR activity and recently touched work, the main feature directions in the Spark community appear to be:

- **More complete SQL dialect and standards coverage**  
  Work on `TIMESTAMP WITH LOCAL TIME ZONE`, `CREATE TABLE LIKE` for V2, `to_json(sort_keys)`, and broader SQL correctness indicates ongoing demand for compatibility with mainstream warehouse/database behavior.

- **Stronger Structured Streaming performance and operability**  
  Multiple changes target state-store behavior, especially RocksDB and stream-stream join efficiency. This suggests continued pressure from users running larger, lower-latency stateful streaming workloads.

- **Better multi-catalog and namespace semantics**  
  Catalog precedence and metadata resolution remain active areas, reflecting complexity in deployments mixing system catalogs, session catalogs, and external lakehouse catalogs.

- **Improved Spark Connect robustness**  
  Fixes around operation lifecycle and cancellation imply that remote execution and client/server interaction quality remain a priority as Connect adoption grows.

- **PySpark developer ergonomics and documentation maturity**  
  Documentation enhancements and tooling upgrades suggest continued investment in making advanced features more accessible to Python-first users.

## 5. Developer Pain Points
Recurring friction points visible from today’s activity include:

- **Subtle SQL planner correctness bugs**  
  Cases like `dropDuplicates(columns)` followed by `exceptAll` show how specific operator combinations can still expose internal optimizer edge cases.

- **State-store complexity in streaming**  
  RocksDB-related performance tuning and flaky tests continue to signal that stateful streaming remains one of Spark’s most operationally sensitive subsystems.

- **Cancellation and lifecycle edge cases in Spark Connect**  
  Interrupt handling bugs are particularly painful in interactive and service-based environments where users expect deterministic cancellation behavior.

- **Catalog ambiguity and namespace resolution surprises**  
  Multi-catalog behavior remains a source of confusion, especially when system-defined namespaces compete with user-defined catalogs.

- **Migration friction around evolving defaults**  
  Cleanup of ANSI-mode messaging and JVM reflection flags highlights a common pain point: historical workarounds and changed defaults can leave users uncertain about current best practices.

## 6. Releases
No new Spark releases were published in the last 24 hours.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait Community Digest — 2026-03-16

## 1. Today's Highlights
Substrait activity was quiet over the last 24 hours, with no new releases or issue updates. The main notable change is an open breaking-change PR that corrects the return type of `add:date_iyear`, aligning the extension spec more closely with expected date arithmetic semantics.

## 4. Key PR Progress
1. [PR #1007](https://github.com/substrait-io/substrait/pull/1007) — **fix(extensions)!: correct return type for `add:date_iyear` operation**  
   This open PR proposes a breaking change to update the return type of `add:date_iyear` from `timestamp` to `date`. It matters because interval-year arithmetic on a `date` should preserve date semantics, improving consistency for implementers across engines and planners. Community reaction appears limited so far, with no visible momentum yet in comments or reactions.

## 5. Feature Request Trends
No issue activity was updated in the last 24 hours, so there are no fresh feature-request patterns to report. The only visible signal is continued attention to semantic correctness in extension function definitions, as reflected in [PR #1007](https://github.com/substrait-io/substrait/pull/1007).

## 6. Developer Pain Points
Current visible developer pain points center on **type-system precision and spec correctness** in extension operations. The proposed fix in [PR #1007](https://github.com/substrait-io/substrait/pull/1007) suggests that implementers are sensitive to mismatches in declared return types, especially where such discrepancies can create interoperability issues or force downstream workarounds in query engines and tooling.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*