# OLAP Ecosystem Index Digest 2026-03-17

> Generated: 2026-03-17 01:25 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project OLAP Infrastructure Comparison Report — 2026-03-17

## 1. Ecosystem Overview
The OLAP data infrastructure ecosystem remains highly active, but current community signals show different layers of the stack evolving in distinct ways. **dbt-core** is seeing strong pressure around developer ergonomics, configuration predictability, snapshot safety, and enterprise workflow support. **Apache Spark** continues to focus on execution correctness, observability, streaming operability, and contributor tooling, reflecting its role as a broad execution engine used at scale. **Substrait** shows lighter day-to-day volume, with current activity concentrated on specification clarity and interoperability semantics rather than rapid feature churn. Overall, the landscape suggests a maturing stack where usability, correctness, and cross-system compatibility are now as important as raw capability.

## 2. Activity Comparison

| Project | Issues updated / highlighted today | PRs active / highlighted today | Release status today |
|---|---:|---:|---|
| dbt-core | 10 hot issues highlighted | 6 PRs highlighted | No new release noted |
| Apache Spark | 1 issue updated | 10 PRs highlighted | No new release noted |
| Substrait | 0 issues updated | 1 PR highlighted | No new release noted |

### Notes
- **dbt-core** had the strongest visible issue-level signal, indicating active user demand and unresolved workflow pain points.
- **Spark** had the strongest PR velocity in the digest, suggesting steady implementation throughput across multiple subsystems.
- **Substrait** had low activity volume today, but its active docs work is strategically important because specification precision affects downstream engine interoperability.

## 3. Shared Feature Directions

### A. Better correctness and safer semantics
- **dbt-core:** snapshot duplicate-row bugs, duplicate column warnings, state comparison correctness, full-refresh precedence clarity.
- **Spark:** SQL planner correctness (`dropDuplicates` + `ExceptAll`), catalog cache coherence, duplicate-column handling in Spark Connect.
- **Substrait:** spec clarification around enumeration arguments vs options to reduce implementation ambiguity.
- **Shared need:** users want systems to behave deterministically in edge cases, especially where subtle semantic bugs can corrupt outputs or create hard-to-debug failures.

### B. Improved observability and debuggability
- **dbt-core:** better logging, clearer failure messaging, more actionable operational feedback.
- **Spark:** improved textual plans, Spark UI readability, sortable metrics, state store load metrics.
- **Shared need:** engineers want faster root-cause analysis, clearer runtime context, and fewer opaque internal failures.

### C. Configuration and metadata predictability
- **dbt-core:** modular config requests, config merge semantics, env var null handling, package invalidation behavior.
- **Spark:** function registry/cache invalidation after `DROP DATABASE`, view qualification and object resolution semantics.
- **Substrait:** clearer spec semantics for function definition constructs.
- **Shared need:** metadata, config, and object-resolution behavior must be predictable to support CI, governance, and production reliability.

### D. Enterprise and production workflow readiness
- **dbt-core:** private PyPI support for Python UDFs, dependency/package workflow safety, percentage-based tests for real SLAs.
- **Spark:** cloud state-store metrics, snapshot repair tuning, developer tooling modernization.
- **Shared need:** communities are optimizing for production operations, not just local development or isolated workloads.

## 4. Differentiation Analysis

### dbt-core
- **Scope:** analytics engineering and transformation workflow orchestration, primarily model-centric and developer-facing.
- **Target users:** analytics engineers, data platform teams, BI/data quality owners.
- **Technical approach:** declarative project configuration, SQL- and Python-based transformation definitions, state-aware build/test workflows.
- **Current emphasis:** usability, config governance, test semantics, snapshot reliability, enterprise packaging support.

### Apache Spark
- **Scope:** general-purpose distributed compute and query execution engine spanning SQL, streaming, UI, Python, and Connect APIs.
- **Target users:** data engineers, platform teams, ML/data infrastructure developers, streaming operators.
- **Technical approach:** distributed execution engine with optimizer, runtime subsystems, multi-language APIs, and production-scale operational tooling.
- **Current emphasis:** SQL correctness, execution observability, stateful streaming resilience, and contributor productivity.

### Substrait
- **Scope:** cross-engine query plan/specification interoperability layer.
- **Target users:** engine implementers, query engine vendors, interoperability-focused platform engineers.
- **Technical approach:** formal specification and plan semantics rather than end-user transformation or execution workflows.
- **Current emphasis:** spec precision, semantic clarity, and implementer guidance.

### Key contrast
- **dbt-core** is closest to the analytics developer experience layer.
- **Spark** is the execution and runtime systems layer.
- **Substrait** is the interoperability/specification layer.
Together, they represent complementary parts of the OLAP stack rather than directly competing products.

## 5. Community Momentum & Maturity

### Most active user-demand signal: dbt-core
dbt-core shows the strongest visible issue momentum today, with multiple long-running requests and active debates around config behavior, snapshots, tests, and dependency handling. This indicates a large, engaged user base pushing on operational polish and product ergonomics—typical of a mature tool with broad production adoption.

### Strongest implementation throughput: Apache Spark
Spark shows the broadest active PR surface, spanning SQL internals, UI, streaming state, Python tooling, and Spark Connect. This suggests a highly mature, modular project with sustained maintainer and contributor throughput. Even on a quiet issue day, implementation work remains substantial.

### Lower volume but strategically important: Substrait
Substrait has the lightest visible activity, but that is not necessarily a weakness; specification projects often move more slowly and deliberately. Its maturity signal comes less from velocity and more from whether semantic clarifications reduce downstream incompatibility across engines.

### Rapid iteration vs stability
- **Rapid iteration:** Spark, especially across execution/runtime/tooling areas.
- **High community pressure with product ergonomics focus:** dbt-core.
- **Deliberate, standards-oriented evolution:** Substrait.

## 6. Trend Signals

### 1) Reliability is now a top-tier feature
Across dbt-core and Spark, correctness bugs and semantic edge cases are receiving sustained attention. For data engineers, this means vendor/tool selection should weigh failure modes, not just performance or feature breadth.

### 2) Observability is becoming table stakes
Spark’s UI and metrics work, combined with dbt’s logging demands, show that users increasingly expect introspection by default. Tools that cannot explain what happened, why work was skipped, or how plans executed will face adoption friction in production environments.

### 3) Configuration complexity is a scaling bottleneck
dbt-core’s recurring config and dependency issues show that as projects scale, maintainability of configuration becomes an operational concern. This is highly relevant for teams managing large monorepos, multi-environment deployments, or governed analytics platforms.

### 4) Production semantics must match real data quality practice
The push for percentage-based test thresholds in dbt-core and correctness fixes in Spark reflects a broader industry move away from simplistic pass/fail assumptions. Data systems increasingly need to encode tolerances, drift detection, and nuanced operational SLAs.

### 5) Cloud-native and stateful workloads continue to drive engine evolution
Spark’s streaming state-store metrics and repair tuning show sustained demand from operators running durable, cloud-based streaming pipelines. This is a useful signal for teams investing in long-lived stateful analytics or real-time OLAP architectures.

### 6) Interoperability still depends on specification clarity
Substrait’s documentation work reinforces that cross-engine interoperability fails when semantics are underspecified. For decision-makers, this means standards adoption should be evaluated not only on schema coverage, but also on precision of behavioral definitions.

## Bottom Line
- **dbt-core** is currently strongest in surfacing user-facing workflow and governance needs.
- **Spark** shows the deepest implementation momentum and broadest subsystem activity.
- **Substrait** remains strategically relevant as a semantic compatibility layer, despite lower daily volume.

For data engineers and platform leads, the clearest takeaway is that the OLAP stack is shifting from feature expansion toward **predictability, debuggability, and production-grade interoperability**.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-03-17

## Today's Highlights
dbt-core activity in the last 24 hours centered on long-running configuration and snapshot discussions, plus a small but notable burst of PR activity around state comparison, dependency handling, logging, and a revert related to ephemeral model compilation. The strongest signals from issues remain consistent: users want more predictable config behavior, safer snapshot semantics, and better operational feedback from dbt when things go wrong.

## Hot Issues

1. **Folder-level vars/configs outside `dbt_project.yml` closed after long discussion**  
   [Issue #2955](https://github.com/dbt-labs/dbt-core/issues/2955)  
   This long-standing request asked for splitting variables and folder-level configs into separate YAML files to reduce `dbt_project.yml` sprawl. It matters because large enterprise projects increasingly treat dbt configuration as code that needs modularity and maintainability. Community reaction was strong over time, with **71 👍**, making it one of the clearest signals for config ergonomics even though the issue is now closed.

2. **Tests that warn/fail by percentage remain a high-value quality feature**  
   [Issue #4723](https://github.com/dbt-labs/dbt-core/issues/4723)  
   Users want generic/data tests to fail based on the percentage of bad rows rather than absolute counts. This is especially important for large fact tables where small volumes of bad records are tolerable but systemic drift is not. The issue keeps resurfacing because it would make dbt tests more production-friendly for real-world SLAs.

3. **Automatic invalidation when `packages.yml` changes is still open**  
   [Issue #4557](https://github.com/dbt-labs/dbt-core/issues/4557)  
   This request targets a very common operational gotcha: changing dependencies without rerunning `dbt deps`. It matters because stale packages can create confusing mismatches between local state, CI, and production. Community interest remains steady because this would remove a frequent source of non-obvious build errors.

4. **Snapshot `check` strategy duplicate-row bug remains unresolved**  
   [Issue #11235](https://github.com/dbt-labs/dbt-core/issues/11235)  
   This bug reports duplicate rows appearing in snapshots when using the `check` strategy. It is important because snapshot correctness is foundational for SCD2-style history tracking; duplicate history records can undermine trust in downstream analytics. The issue has drawn sustained attention and points to continued fragility in snapshot edge cases.

5. **Request to support `exclude` semantics in snapshot `check_cols`**  
   [Issue #10438](https://github.com/dbt-labs/dbt-core/issues/10438)  
   Instead of explicitly listing columns to compare, users want to say “check everything except these columns.” This matters for wide and evolving tables where maintenance overhead is high and schemas change frequently. It aligns with broader community demand for more scalable snapshot configuration.

6. **`full_refresh: true` behavior vs `--full-refresh` flag still debated**  
   [Issue #6013](https://github.com/dbt-labs/dbt-core/issues/6013)  
   The current behavior treats model config as overriding the CLI flag entirely, which many users find unintuitive. This matters because incremental build semantics are central to dbt performance and operational safety. The issue reflects a larger desire for clearer precedence rules between project config and invocation-time control.

7. **Warning on duplicate columns in snapshot `check` strategy could prevent bad history**  
   [Issue #9656](https://github.com/dbt-labs/dbt-core/issues/9656)  
   This feature request proposes warning users when duplicate columns are present in snapshot check logic. It matters because subtle schema duplication can lead to incorrect snapshot comparisons and difficult debugging. The `help_wanted` label also suggests a tractable contribution opportunity for the community.

8. **`env_var` default should accept `None`**  
   [Issue #10485](https://github.com/dbt-labs/dbt-core/issues/10485)  
   Users want `env_var()` to treat `None`/`none` as a valid default value. This is a small request with outsized ergonomics impact, especially in environments where variables are optional and downstream logic distinguishes null from empty string. It reflects a broader push for more expressive and Python/Jinja-consistent templating semantics.

9. **Debate over whether duplicated data tests should be allowed**  
   [Issue #12643](https://github.com/dbt-labs/dbt-core/issues/12643)  
   This very recent issue calls out ambiguity introduced by prior behavior changes that permit duplicate data tests. It matters because test identity, deduplication, and artifact consistency affect CI reliability and developer expectations. While early-stage, it could influence how dbt defines test uniqueness going forward.

10. **Private PyPI packages for Python UDFs opens new enterprise workflow needs**  
    [Issue #12655](https://github.com/dbt-labs/dbt-core/issues/12655)  
    This new feature request asks for support for private package indexes in Python UDF workflows. It matters because enterprise users increasingly expect dbt’s Python surface area to integrate with internal package ecosystems, not just public PyPI. This is an important signal for dbt’s ongoing expansion beyond SQL-only transformation patterns.

## Key PR Progress

1. **State comparison for vars changes has been restored**  
   [PR #12660](https://github.com/dbt-labs/dbt-core/pull/12660)  
   A new PR aimed at restoring `state:modified` detection when vars change. This is important for slim CI and state-aware workflows, where missing var diffs can cause incorrect cache reuse or skipped runs.

2. **Revert of revert around duplicate CTE race condition in ephemeral compilation**  
   [PR #12659](https://github.com/dbt-labs/dbt-core/pull/12659)  
   This PR reverts an earlier revert related to fixing duplicate CTE race conditions in ephemeral model compilation. The sequence suggests maintainers are still stabilizing a tricky correctness issue in compilation behavior, likely with broad impact for projects relying heavily on ephemerals.

3. **Relative local dependencies of local dependencies has been closed**  
   [PR #10600](https://github.com/dbt-labs/dbt-core/pull/10600)  
   This community PR addressed transitive relative-path resolution for local packages. It matters for monorepo and multi-package development workflows, where local dependency graphs are increasingly common. Its closure indicates movement on a real pain point in package management.

4. **Configurable maximum seed size still progressing**  
   [PR #11177](https://github.com/dbt-labs/dbt-core/pull/11177)  
   This PR would make `MAXIMUM_SEED_SIZE_MIB` configurable instead of relying on a fixed 1 MiB threshold. That matters for teams with larger seed files and for users who want stricter or looser safeguards depending on warehouse and deployment context.

5. **Logging improvements continue in open PR**  
   [PR #12555](https://github.com/dbt-labs/dbt-core/pull/12555)  
   A broad “Better Logging” PR remains active. Given the issue trend around missing context in warnings and runtime messages, this could be part of a larger push to make dbt diagnostics more actionable during development and CI.

6. **Minor documentation/link fix remains open**  
   [PR #11838](https://github.com/dbt-labs/dbt-core/pull/11838)  
   Small in scope, but notable because even lightweight community PRs are part of the maintenance stream. These fixes improve docs and polish, especially for new contributors and users navigating reference material.

## Feature Request Trends
Several themes stand out across current issue activity:

- **Configuration ergonomics and predictability**: modular config files, config merge semantics, CLI-vs-config precedence, and null/default handling are recurring asks.  
- **Snapshot safety and maintainability**: duplicate protection, uniqueness validation, `exclude` support for `check_cols`, and warning surfaces all point to snapshots remaining a sharp edge.  
- **Testing flexibility**: users want richer test semantics, especially percentage-based failure thresholds and clarity on duplicate test handling.  
- **Dependency/package management improvements**: automatic package invalidation and better handling of local/transitive dependencies continue to matter for CI and monorepo workflows.  
- **Better error messages and logging**: multiple issues point to a simple request—when dbt fails or skips work, users want clearer explanations and source locations.  
- **Python ecosystem support**: the request for private PyPI in Python UDFs shows ongoing pressure to make dbt’s Python features enterprise-ready.

## Developer Pain Points
The most common frustrations visible in today’s issue set are:

- **Confusing config behavior**: users still struggle with where configs should live, how they merge, and which setting wins.  
- **Snapshot edge cases**: duplicate rows, duplicate columns, and lack of pre-merge validation continue to make snapshots feel risky in some production scenarios.  
- **Opaque operational feedback**: missing context in env var errors, skipped introspective queries, and generic logging all slow debugging.  
- **Dependency drift**: package changes that are not automatically reflected create frequent local/CI mismatches.  
- **Testing semantics not matching production needs**: absolute-failure thresholds and ambiguity around duplicate tests limit dbt’s usefulness in nuanced data quality programs.  
- **Enterprise integration gaps**: Python UDF packaging and other advanced workflows still need stronger support for private infrastructure and internal dependency management.



</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-17

## 1. Today's Highlights
Spark had a quiet day on releases, but repository activity remained strong across SQL, UI, PySpark, Spark Connect, Streaming State Store, and build/dependency maintenance. The most notable themes were SQL correctness and usability improvements, better Spark UI introspection, and continued work on developer tooling and ecosystem upgrades.

A newly updated issue points to a potential Catalyst/query-planning bug involving `dropDuplicates(columns)` followed by `EXCEPT ALL`, while active PRs show momentum around metadata cache coherence, plan/UI readability, PySpark benchmark ergonomics, and Spark Connect correctness.

## 3. Hot Issues

> Note: only **one** issue was updated in the last 24 hours from the provided dataset, so the digest includes all available issue activity rather than inventing additional items.

### 1) `dropDuplicates(columns)` followed by `ExceptAll` triggers `INTERNAL_ERROR_ATTRIBUTE_NOT_FOUND`
- **Issue:** [#54724](https://github.com/apache/spark/issues/54724)
- **Why it matters:** This appears to be a correctness bug in Spark SQL query analysis or execution planning. Workflows that combine partial-column deduplication with set operations are common in ETL validation, CDC reconciliation, and data quality pipelines.
- **What’s happening:** The reporter shows that applying `dropDuplicates` on a subset of columns and then `ExceptAll` can fail with an internal attribute resolution error rather than producing a result or a user-facing analysis exception.
- **Community reaction:** Limited so far—only one comment and no visible reactions in the provided snapshot—but the failure mode is significant because it suggests an internal planner inconsistency rather than simple user misuse.

## 4. Key PR Progress

### 1) Clear function registry cache on `DROP DATABASE`
- **PR:** [#54781](https://github.com/apache/spark/pull/54781)
- **Focus:** SQL catalog/cache coherence
- **Why it matters:** Prevents stale scalar and table function entries from surviving after a database is dropped. This improves session catalog correctness and avoids confusing name resolution behavior in long-lived sessions.

### 2) Qualified session views
- **PR:** [#53630](https://github.com/apache/spark/pull/53630)
- **Focus:** SQL object resolution semantics
- **Why it matters:** This long-running SQL PR suggests continued work on making session views easier to reference in qualified form. If merged, it could simplify object scoping and reduce ambiguity in mixed catalog/database environments.

### 3) Improve `GroupPartitions` textual plan representation
- **PR:** [#54801](https://github.com/apache/spark/pull/54801)
- **Focus:** SQL plan readability
- **Why it matters:** Closed today, this improves how `GroupPartitionsExec` appears in explain plans. Better textual output makes debugging partitioning and execution behavior much easier for advanced users.

### 4) Improve `GroupPartitions` Spark UI presentation
- **PR:** [#54842](https://github.com/apache/spark/pull/54842)
- **Focus:** SQL UI/UX
- **Why it matters:** A follow-up to earlier `GroupPartitions` work, this PR extends observability improvements from explain output into the Spark UI. It should help users understand reducers and plan behavior for the newer SPJ group operator.

### 5) Increase AutoSnapshotRepair replay threshold from 50 to 500
- **PR:** [#54843](https://github.com/apache/spark/pull/54843)
- **Focus:** Structured Streaming / State Store
- **Why it matters:** Raising the default threshold may reduce unnecessary repair churn and improve resilience/performance characteristics in stateful streaming environments using auto snapshot repair logic.

### 6) Add `dev/asv` wrapper for PySpark benchmarks
- **PR:** [#54834](https://github.com/apache/spark/pull/54834)
- **Focus:** Python developer tooling / infra
- **Why it matters:** This lowers friction for running ASV benchmarks from the repository root. Small ergonomics improvements like this often increase the likelihood that contributors run and share performance data before submitting changes.

### 7) Use Ruff as formatter for Python code
- **PR:** [#54840](https://github.com/apache/spark/pull/54840)
- **Focus:** PySpark code quality/tooling
- **Why it matters:** Consolidating around Ruff can speed formatting and linting workflows, reduce tooling complexity, and modernize Python contribution workflows across the project.

### 8) Make SQL plan visualization metrics table sortable
- **PR:** [#54823](https://github.com/apache/spark/pull/54823)
- **Focus:** Spark UI
- **Why it matters:** A practical usability win. Sortable metrics tables make it much faster to inspect skew, operator costs, and SQL execution bottlenecks during troubleshooting.

### 9) Add metrics for state store loads from cloud storage
- **PR:** [#54567](https://github.com/apache/spark/pull/54567)
- **Focus:** Structured Streaming observability
- **Why it matters:** Adds visibility into when RocksDB state is loaded from remote storage. This is especially useful for cloud-native operators debugging startup/recovery latency and state restoration behavior.

### 10) Spark Connect Scala client: use positional Arrow row binding
- **PR:** [#54832](https://github.com/apache/spark/pull/54832)
- **Focus:** Spark Connect correctness
- **Why it matters:** Fixes deserialization behavior for duplicate column names by switching from name-based lookup to positional binding. This is an important compatibility and correctness improvement for Connect users working with non-unique schemas.

## 5. Feature Request Trends
Based on the current issue/PR stream, the strongest direction signals are:

- **Better SQL correctness at edge cases:** Several active items touch planner semantics, catalog resolution, Unicode correctness, duplicate column handling, and partitioning behavior. The community remains highly focused on eliminating subtle SQL correctness gaps.
- **Improved observability and debuggability:** There is visible investment in explain-plan clarity, Spark UI improvements, sortable metrics, and additional state-store metrics. Users want faster root-cause analysis for production jobs.
- **Cloud/stateful streaming operability:** State-store recovery metrics and snapshot repair tuning indicate ongoing demand for more robust and transparent structured streaming behavior in cloud environments.
- **Lower-friction contributor workflows:** Python benchmark wrappers and formatter modernization show continued interest in making Spark easier to develop, test, and maintain.
- **Dependency freshness and platform upkeep:** Arrow, JAXB, and Netty-related changes suggest ongoing demand for keeping Spark aligned with ecosystem libraries and security/compatibility updates.

## 6. Developer Pain Points
The current activity points to several recurring frustrations:

- **Opaque internal SQL/planner failures:** The updated `dropDuplicates` + `ExceptAll` bug is a strong example of users hitting internal errors where they expect deterministic SQL behavior.
- **Catalog and metadata staleness:** The cache-coherence PR around `DROP DATABASE` shows that stale object/function resolution remains a practical source of confusion.
- **Debugging execution plans is still too hard:** Multiple PRs focus on making execution nodes and metrics easier to read in plans and in the UI, implying current tooling is not yet sufficient for production debugging.
- **Streaming state recovery lacks enough visibility:** The push for cloud-load metrics and snapshot repair tuning suggests operators still struggle to understand state restoration costs and failure recovery paths.
- **Contributor ergonomics in Python can be smoother:** Benchmark execution and formatting standardization remain active areas, indicating friction in the PySpark development workflow.
- **Schema edge cases continue to hurt interoperability:** Duplicate column names, supplementary Unicode handling, and sort-direction SQL rendering all point to rough edges that surface in real-world heterogeneous data systems.

If you'd like, I can also turn this into a **Slack-style daily update**, **newsletter format**, or **JSON schema for automated community digests**.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

## Today's Highlights
Activity in the Substrait repo was light over the last 24 hours, with no new releases and no issue updates. The main visible change is an open documentation PR clarifying the spec-level distinction between **enumeration arguments** and **options**, an important nuance for implementers building compliant function signatures and validators.

## Key PR Progress
1. [PR #1005](https://github.com/substrait-io/substrait/pull/1005) — **feat(docs): clarify distinction between enumeration arguments and options**  
   This open documentation update improves the function-spec language around two similar but semantically different mechanisms for fixed-set string values. The PR matters because ambiguity here can lead to inconsistent engine implementations, especially in function binding, validation, and interoperability layers.  
   - **Why it matters:** Enumeration arguments and options may look similar to implementers, but they serve different roles in the spec. Clearer wording reduces misinterpretation in producers and consumers of Substrait plans.  
   - **Current status:** Open, updated on 2026-03-16.

## Feature Request Trends
No issues were updated in the last 24 hours, so there is not enough new GitHub issue activity to infer fresh feature-request trends for today. The only visible signal is continued attention to **spec clarity and implementer guidance**, especially where subtle semantic distinctions can affect cross-engine compatibility.

## Developer Pain Points
With no issue activity in the reporting window, there are no newly surfaced pain points from GitHub discussions today. However, the active docs PR suggests an ongoing friction point for developers: **interpreting closely related spec constructs consistently**, particularly in function definitions and argument modeling.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*