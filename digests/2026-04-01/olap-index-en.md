# OLAP Ecosystem Index Digest 2026-04-01

> Generated: 2026-04-01 01:49 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project Comparison Report — OLAP Data Infrastructure Ecosystem  
**Date:** 2026-04-01

## 1. Ecosystem Overview
The current OLAP data infrastructure landscape shows active investment across three layers of the stack: transformation orchestration (**dbt-core**), execution engine/runtime (**Apache Spark**), and interoperability/specification (**Substrait**). Across all three projects, the strongest signals are around correctness, semantic clarity, and developer ergonomics rather than major release events. Spark remains the highest-volume implementation-focused community, dbt-core is balancing near-term usability fixes with roadmap expansion, and Substrait continues maturing as a standards layer through specification refinement. Overall, the ecosystem is moving toward more observable, interoperable, and production-safe analytical systems.

## 2. Activity Comparison

| Project | Updated Issues Today | PRs Mentioned in Digest | Release Status Today |
|---|---:|---:|---|
| dbt-core | 4 | 10 | No release noted |
| Apache Spark | 6 | 10 | No new release |
| Substrait | 0 | 6 | No release noted |

### Notes
- **Spark** had the broadest visible activity, especially across PySpark, SQL, streaming, and core architecture.
- **dbt-core** showed lower issue volume but meaningful product-direction discussion, especially around model freshness and CLI ergonomics.
- **Substrait** had no issue activity but still showed steady PR-driven specification work.

## 3. Shared Feature Directions

### A. Better semantic correctness and predictable behavior
**Projects:** dbt-core, Spark, Substrait  
**Specific needs:**
- **dbt-core:** clearer parsing/config errors, predictable config inheritance, selector behavior correctness
- **Spark:** schema evolution correctness, AQE edge cases, return-type documentation, safer JDBC defaults
- **Substrait:** decimal `avg` return-type semantics, statistical function typing, extension type precision

**Why it matters:** Teams increasingly depend on analytical systems behaving predictably under automation, CI, and cross-engine execution.

---

### B. Improved developer ergonomics
**Projects:** dbt-core, Spark  
**Specific needs:**
- **dbt-core:** `run-operation --inline`, better error messages, lighter operational workflows
- **Spark:** DataFrame input to `spark.read.json()`, improved docs, more notebook/in-memory-friendly APIs

**Why it matters:** Power users and platform teams want lower-friction workflows for scripting, experimentation, and automation.

---

### C. Stronger interoperability and platform compatibility
**Projects:** Spark, Substrait, dbt-core  
**Specific needs:**
- **Spark:** pandas 3 / pyarrow compatibility, Connect build support, integration questions with Unity Catalog
- **Substrait:** canonical URNs for extensions, unsigned integer extensions, breaking change policy
- **dbt-core:** schema syncing with dbt-fusion, metadata/catalog tracking

**Why it matters:** The ecosystem is becoming more modular, and users expect tools to work reliably across runtimes, catalogs, metadata layers, and language stacks.

---

### D. Better observability and operational confidence
**Projects:** dbt-core, Spark  
**Specific needs:**
- **dbt-core:** model freshness checks, CI reliability improvements
- **Spark:** streaming admission control documentation, performance-safe defaults, AQE behavior visibility

**Why it matters:** Data teams are pushing beyond development-time correctness toward production SLAs, performance predictability, and operational governance.

## 4. Differentiation Analysis

| Project | Primary Scope | Target Users | Technical Approach |
|---|---|---|---|
| dbt-core | Analytics engineering and transformation workflow orchestration | Analytics engineers, data modelers, platform teams | Declarative SQL transformation framework with config/model/test abstractions |
| Apache Spark | Distributed compute engine for large-scale batch, SQL, streaming, and ML-adjacent workloads | Data engineers, platform engineers, infra teams, advanced Python/SQL users | Runtime execution engine with APIs across SQL, DataFrame, Python, JVM, streaming |
| Substrait | Cross-engine query plan and function semantics specification | Engine implementers, platform architects, interoperability-focused vendors | Standard/spec layer defining plans, types, functions, and extension mechanisms |

### Key differences
- **dbt-core** is closest to end-user analytics workflow productivity.
- **Spark** is the execution-heavy platform where performance, compatibility, and runtime semantics dominate.
- **Substrait** is infrastructure for interoperability, with progress measured more by semantic precision and implementer adoption than end-user features.

## 5. Community Momentum & Maturity

### Most active community
**Apache Spark** currently shows the strongest day-to-day engineering throughput, with active work spanning Python compatibility, SQL internals, streaming, JDBC behavior, and core UDF architecture. This suggests a large, mature community maintaining both breadth and depth.

### Fastest product iteration on workflow usability
**dbt-core** appears highly responsive on user-facing correctness issues, with at least one selector bug reported and fixed the same day. Its community momentum is notable in roadmap expansion as well, especially the new model freshness epic.

### Most specification-focused maturity
**Substrait** shows a different maturity pattern: lower issue churn, but steady progress on semantic refinement, type coverage, and governance. That is typical of an emerging standard moving from broad concept validation toward implementation-grade precision.

### Practical interpretation
- **Spark:** strongest contributor scale and subsystem diversity
- **dbt-core:** fast feedback loop for practitioner pain points
- **Substrait:** slower but strategically important standards consolidation

## 6. Trend Signals

### 1) Observability is moving deeper into transformed data
The dbt-core model freshness epic signals that freshness/SLA expectations are no longer limited to raw sources. For data engineers, this suggests future platforms will treat transformed models as first-class monitored assets.

### 2) Python compatibility remains a strategic battleground
Spark’s pandas 3 and pyarrow-related work reinforces that Python ecosystem churn directly affects production analytics platforms. Teams standardizing on PySpark should expect ongoing compatibility evaluation as part of upgrade planning.

### 3) Semantic precision is becoming a competitive requirement
Substrait’s decimal and statistical typing work, combined with Spark’s SQL correctness efforts and dbt’s config/selector fixes, indicate that correctness in edge cases is increasingly important. This matters for multi-engine portability, testing reliability, and governance.

### 4) Ergonomic APIs are now a platform selection factor
Requests like dbt inline operations and Spark’s in-memory JSON ingestion show demand for tools that reduce ceremony. Data engineers should expect usability and automation friendliness to matter more in platform evaluations.

### 5) Interoperability layers are gaining strategic value
Substrait’s extension governance and Spark’s catalog integration questions point to a future where engines, catalogs, and semantic layers must compose cleanly. This is especially relevant for organizations building heterogeneous lakehouse or federated analytics stacks.

### 6) Safe defaults and operational resilience are increasingly expected
Spark JDBC fetch sizing, AQE behavior, streaming docs, and dbt CI reliability work all reflect the same market expectation: tools should fail less, scale more predictably, and require less expert tuning.

If you want, I can also convert this into a **one-page executive brief**, **Slack update**, or **machine-readable JSON comparison**.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-04-01

## 1. Today's Highlights
dbt-core activity over the last 24 hours centered on parser/config correctness, workflow reliability, and a few notable forward-looking feature discussions. The biggest themes were a new epic for **model freshness checks**, a fresh bug report on **snapshot schema config inheritance**, and quick turnaround on a selector inheritance bug that was reported and fixed the same day.

## 3. Hot Issues
> Note: Only 4 issues were updated in the last 24 hours, so this section includes all available noteworthy issues from the provided data.

- **[Issue #12719 — [EPIC] Model freshness checks](https://github.com/dbt-labs/dbt-core/issues/12719)**  
  A significant roadmap item proposing freshness checks for models, extending the long-standing source freshness concept deeper into dbt-managed assets. This matters for teams that want stronger SLAs and observability on transformed data, not just upstream tables. Community reaction appears early-stage but active, with discussion underway.

- **[Issue #12478 — [Feature] `dbt run-operation --inline` for adhoc database statements](https://github.com/dbt-labs/dbt-core/issues/12478)**  
  This request would let users execute inline database statements without first wrapping them in a macro. It’s especially relevant for power users, automation workflows, and AI-assisted tooling that benefit from lightweight one-off execution. The issue signals continued demand for a more ergonomic operational surface in dbt CLI.

- **[Issue #12756 — Snapshot schema from `dbt_project.yml` only applied when YAML config stub exists](https://github.com/dbt-labs/dbt-core/issues/12756)**  
  A newly reported bug affecting snapshot configuration behavior. It suggests project-level snapshot schema settings are only partially applied unless a YAML config stub is present, which can create surprising inconsistencies in project structure and deployment behavior. This is important for maintainability and trust in config inheritance.

- **[Issue #12753 — [Bug] exclude with `test_name` not inherited when using selector method](https://github.com/dbt-labs/dbt-core/issues/12753)**  
  Although now closed, this issue mattered because it impacted selector composability: exclusions using `test_name` were not inherited through selector references. That kind of bug can quietly skew test execution and CI behavior. The fast close indicates strong maintainer responsiveness.

## 4. Key PR Progress
- **[PR #12758 — catch `InvalidFieldValue` and raise `ParsingError` during context config generation](https://github.com/dbt-labs/dbt-core/pull/12758)**  
  Open. Improves parser ergonomics by converting low-level config validation failures into clearer dbt parsing errors. This should make troubleshooting malformed configs easier for developers.

- **[PR #12757 — bump integration test timeout to 60 minutes](https://github.com/dbt-labs/dbt-core/pull/12757)**  
  Open. A pragmatic CI stability change aimed at reducing flaky failures on Windows runners and unblocking release validation. Not user-facing, but important for delivery velocity.

- **[PR #12754 — Add community issue labeling with triage label](https://github.com/dbt-labs/dbt-core/pull/12754)**  
  Open. Extends automation to label community-opened issues with `triage`, which should improve issue routing and maintainer workflows. This is a process improvement for scaling community support.

- **[PR #12751 — fix: exclude `test_name` not inherited when using selector method](https://github.com/dbt-labs/dbt-core/pull/12751)**  
  Closed. Direct fix for Issue #12753. Important because it restores expected selector inheritance semantics and reduces the risk of tests running unexpectedly.

- **[PR #12755 — fix: handle null config in generic test builder](https://github.com/dbt-labs/dbt-core/pull/12755)**  
  Closed. Addresses robustness in generic test construction when configs are null. This kind of defensive fix helps avoid parser/runtime surprises in edge cases.

- **[PR #12747 — Add catalogs tracking](https://github.com/dbt-labs/dbt-core/pull/12747)**  
  Closed. Adds telemetry/tracking around catalog counts and catalog type per model run. While not a direct end-user feature, it suggests ongoing investment in metadata visibility and product instrumentation.

- **[PR #12759 — chore: sync JSON schemas from dbt-fusion](https://github.com/dbt-labs/dbt-core/pull/12759)**  
  Closed. Keeps dbt-core schema definitions aligned with dbt-fusion. This reflects continued coordination across dbt’s evolving platform components.

- **[PR #12688 — Fix: improve error message when version key is missing from `packages.yml`](https://github.com/dbt-labs/dbt-core/pull/12688)**  
  Closed, community contribution. Replaces a raw `KeyError` path with a clearer validation message. A small but high-value usability improvement for package management.

- **[PR #12653 — feat: support `.jinja`/`.jinja2`/`.j2` extensions for docs files](https://github.com/dbt-labs/dbt-core/pull/12653)**  
  Closed, community contribution. Expands supported docs file extensions beyond `.md`, improving compatibility with common editor and templating workflows.

- **[PR #12687 — add new flag and integrate event manager's error deferral](https://github.com/dbt-labs/dbt-core/pull/12687)**  
  Open. A more architectural change related to event/error handling, also marked `needs_fusion_implementation`. Potentially important for improving failure management across runtime events.

## 5. Feature Request Trends
- **Data freshness beyond sources**  
  The model freshness epic shows demand for richer observability directly on dbt-built assets, not just upstream source tables.

- **More ad hoc / operational CLI workflows**  
  The `run-operation --inline` request highlights interest in lighter-weight database interaction from dbt, especially for automation, agents, and developer productivity.

- **Better configuration ergonomics and clearer errors**  
  Several PRs and bugs point to a strong need for predictable config inheritance, safer parsing, and more actionable error messages.

- **Improved metadata and platform interoperability**  
  Work around catalogs tracking and schema syncing suggests growing emphasis on metadata consistency across dbt-core, adapters, and adjacent platform components.

## 6. Developer Pain Points
- **Config inheritance is still a source of confusion**  
  The snapshot schema bug and selector inheritance bug both point to lingering complexity in how dbt applies and composes configuration across files and abstractions.

- **Error messages still need refinement in edge cases**  
  Fixes around parsing errors, null configs, and missing `packages.yml` keys show that low-level exceptions can still leak through in ways that slow debugging.

- **CI reliability remains a practical concern**  
  The integration test timeout bump signals that test infrastructure, especially on Windows, is still creating friction for maintainers and release processes.

- **Operational tasks can feel heavier than necessary**  
  Requests for inline execution indicate that some users want dbt to better support quick, direct database actions without macro scaffolding.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-04-01

## 1. Today's Highlights
Spark saw no new releases in the last 24 hours, but activity remained high in PySpark, SQL, and streaming-related pull requests. The day’s most notable themes were Python compatibility work for pandas 3 / pyarrow, SQL engine improvements around schema evolution and collation, and early architectural work on a language-agnostic UDF worker framework.

On the issue side, the queue was small but practical: documentation gaps, environment-specific test/build failures, AQE behavior around cached queries, and questions around integrating Spark Declarative Pipelines with Unity Catalog.

## 2. Hot Issues

> Note: only 6 issues were updated in the last 24 hours, so this section includes all noteworthy current issue activity rather than 10 items.

### 1) Compile failure in `spark-connect-common` for 4.1.1
- [Issue #55082](https://github.com/apache/spark/issues/55082)
- Status: Closed
- Why it matters: Build/compile failures in Spark Connect modules can block downstream adopters trying to build against 4.1.1, especially where generated protobuf classes are involved.
- Community reaction: Limited discussion, but the issue was resolved quickly, suggesting maintainers treated it as a support/build hygiene problem rather than a deeper product regression.

### 2) Missing docs for aggregate function return types
- [Issue #54986](https://github.com/apache/spark/issues/54986)
- Status: Open
- Why it matters: Users rely on PySpark docs to understand schema behavior, and undocumented return types for `stddev`, `variance`, and related functions create ambiguity in production pipelines and test assertions.
- Community reaction: The discussion is modest but this is the kind of docs gap that affects many users indirectly, especially those doing typed downstream processing.

### 3) AQE optimization not applied with `TableCacheQueryStageExec`
- [Issue #55094](https://github.com/apache/spark/issues/55094)
- Status: Closed
- Why it matters: This points to a subtle optimizer/runtime edge case where Adaptive Query Execution may miss shuffle coalescing opportunities when caching queries with shuffle-heavy plans.
- Community reaction: Even with few comments, this is operationally important because it impacts performance efficiency and can produce unexpected resource usage in cached workloads.

### 4) Unit tests failing with `UnsatisfiedLinkError` on Apple Silicon
- [Issue #55093](https://github.com/apache/spark/issues/55093)
- Status: Closed
- Why it matters: Apple Silicon remains a common local development environment, and native dependency failures in LevelDBJNI-backed test suites make contributor workflows fragile.
- Community reaction: Small thread, but highly relevant to contributors and committers who validate changes on ARM-based Macs.

### 5) Ubuntu 25.10 `/tmp` access denial
- [Issue #55096](https://github.com/apache/spark/issues/55096)
- Status: Open
- Why it matters: Temp-directory access problems can manifest as opaque startup or runtime failures in Spark, especially as Linux distributions tighten defaults and hardening behavior evolves.
- Community reaction: Early-stage discussion only, but this may foreshadow compatibility adjustments needed for newer distro baselines.

### 6) Spark Declarative Pipelines with Unity Catalog
- [Issue #55113](https://github.com/apache/spark/issues/55113)
- Status: Open
- Why it matters: This is a signal of user interest in combining emerging Spark pipeline abstractions with modern catalog/governance layers. Compatibility here matters for local experimentation and future lakehouse workflows.
- Community reaction: No comments yet, but strategically this is the most forward-looking issue in the current batch.

## 3. Key PR Progress

### 1) Add Python Kafka test support
- [PR #53415](https://github.com/apache/spark/pull/53415)
- Area: Structured Streaming / Build / Python
- What changed: Adds the ability to run Kafka tests in Python.
- Why it matters: Better Python-side test coverage for Kafka integrations should improve confidence in streaming APIs and reduce JVM/Python parity gaps.

### 2) `spark.read.json` accepts DataFrame input
- [PR #55097](https://github.com/apache/spark/pull/55097)
- Area: PySpark / Connect
- What changed: Allows `spark.read.json()` to parse a DataFrame containing a single string column, not just file paths or RDDs.
- Why it matters: This makes in-memory JSON ingestion more ergonomic, especially in notebook workflows, service pipelines, and Connect scenarios where file-based staging is awkward.

### 3) pandas 3 dtype handling in `DataFrame.toPandas()`
- [PR #55118](https://github.com/apache/spark/pull/55118)
- Area: PySpark
- What changed: Updates dtype correction logic for pandas 3.x, including `StringType` mapping.
- Why it matters: This is important compatibility work for users upgrading Python stacks without wanting schema or nullability surprises in DataFrame conversion.

### 4) Preserve legacy pandas-on-Spark `idxmax` / `idxmin` behavior
- [PR #55121](https://github.com/apache/spark/pull/55121)
- Area: pandas API on Spark
- What changed: Keeps legacy `skipna=False` behavior for pandas 2 versions as a follow-up fix.
- Why it matters: This reduces semantic drift and upgrade pain for users straddling pandas major versions.

### 5) Refactor `SQL_WINDOW_AGG_ARROW_UDF`
- [PR #55123](https://github.com/apache/spark/pull/55123)
- Area: Python / SQL execution
- What changed: Refactors Arrow-based window aggregate UDF execution to be more self-contained.
- Why it matters: This looks like maintainability groundwork that should simplify future optimization and reduce complexity in Python UDF execution paths.

### 6) Simplify schema calculation for `MERGE INTO` schema evolution
- [PR #54934](https://github.com/apache/spark/pull/54934)
- Area: SQL
- What changed: Streamlines internal schema evolution logic by replacing `sourceSchemaForSchemaEvolution` with `pendingChanges`.
- Why it matters: Cleaner merge/schema-evolution logic helps one of the most complex and heavily scrutinized areas of modern table operations.

### 7) Enable geo types with pre-built SRID registry
- [PR #54780](https://github.com/apache/spark/pull/54780)
- Area: SQL / Geospatial
- What changed: Allows Geometry and Geography types to use SRIDs from a pre-built registry.
- Why it matters: This is meaningful for geospatial SQL adoption, making Spark more practical for location-aware analytics with standards-based coordinate handling.

### 8) Document admission control in PySpark streaming sources
- [PR #54807](https://github.com/apache/spark/pull/54807)
- Area: Structured Streaming / Python / Docs
- What changed: Adds docs and examples for admission control and `Trigger.AvailableNow` in custom PySpark streaming sources.
- Why it matters: Better streaming docs often have outsized impact, especially in advanced backpressure and bounded-available processing scenarios.

### 9) Default PostgreSQL JDBC `fetchSize`
- [PR #55053](https://github.com/apache/spark/pull/55053)
- Area: SQL / JDBC
- What changed: Proposes a default `fetchSize` of 1000 for the PostgreSQL dialect.
- Why it matters: This could materially reduce accidental memory blowups when reading large PostgreSQL tables through JDBC without explicit tuning.

### 10) Introduce core abstraction for language-agnostic UDF worker
- [PR #55089](https://github.com/apache/spark/pull/55089)
- Area: Core / UDF architecture
- What changed: Introduces foundational abstractions for a language-agnostic UDF worker framework.
- Why it matters: This is one of the most strategically important changes in flight, potentially setting up a cleaner execution model for non-JVM and multi-language UDFs.

## 4. Feature Request Trends

Based on current issues and PRs, the main feature directions are:

- **Better Python ecosystem compatibility**
  - Ongoing work around pandas 3, pyarrow compatibility, type hints, and Python test coverage shows continued demand for PySpark to track the fast-moving Python data stack more closely.

- **More ergonomic developer APIs**
  - PRs like DataFrame input support for `spark.read.json()` indicate interest in smoother in-memory and notebook-friendly workflows rather than file- or RDD-first APIs.

- **Stronger SQL correctness and modern semantics**
  - Active work on collation, schema evolution, geo types, and JDBC behavior suggests the community wants Spark SQL to behave more predictably for database-style workloads.

- **Improved streaming operability**
  - Admission control docs and deduplication normalization work point to a focus on making Structured Streaming easier to reason about under production constraints.

- **Next-generation UDF execution**
  - The UDF worker abstraction effort suggests sustained interest in more modular, language-agnostic extensibility for user-defined compute.

## 5. Developer Pain Points

Recurring frustrations visible in today’s activity include:

- **Environment-specific build and test breakage**
  - Apple Silicon native library issues and distro-specific temp directory behavior show that local dev environments remain a source of friction.

- **Documentation lag behind implementation**
  - Missing return-type docs and new streaming capability docs reinforce that users often discover behavior by reading source instead of official documentation.

- **Compatibility churn across dependencies**
  - pandas 3, pyarrow version differences, and Python typing work highlight the maintenance burden caused by rapidly evolving upstream libraries.

- **Performance surprises from implicit defaults**
  - AQE edge cases and JDBC fetch behavior both reflect a broader theme: users want Spark to choose safer, more efficient defaults without requiring expert tuning.

- **Integration uncertainty for new platform combinations**
  - Questions around Declarative Pipelines plus Unity Catalog show that users are already trying to combine newer Spark capabilities with governance/catalog systems, but guidance is still sparse.

If you want, I can also turn this into a **newsletter-style version**, a **Slack-friendly summary**, or a **JSON digest schema** for automation.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait Community Digest — 2026-04-01

## 1. Today's Highlights
Substrait saw a specification-heavy day centered on function semantics, extension typing, and test infrastructure. The most notable movement includes a fix to decimal `avg` return-type behavior, continued work on unsigned integer extension types, and a test-framework update to use canonical extension URNs instead of file paths.

A notable closure also landed for execution-context variables, adding support for `current_date`, `current_timestamp`, and `current_timezone`, which improves interoperability for engines implementing temporal semantics.

## 2. Hot Issues
No issues were updated in the last 24 hours.

## 3. Key PR Progress

- [PR #1028](https://github.com/substrait-io/substrait/pull/1028) — **feat(tests): use URN instead of path for extension references**  
  Updates the test framework to reference extensions by canonical URN rather than repository file paths. This matters because it aligns tests with the logical identity of extensions, making them more portable and less coupled to repo layout.

- [PR #953](https://github.com/substrait-io/substrait/pull/953) — **feat(extensions): add unsigned integer extension types (u8, u16, u32, u64)**  
  Introduces unsigned integer types as first-class extension types, along with arithmetic overloads and test coverage. This is important for systems that need better interoperability with engines and formats that expose unsigned numeric domains.

- [PR #1027](https://github.com/substrait-io/substrait/pull/1027) — **fix: use input precision for avg decimal return type**  
  Proposes changing `AVG(DECIMAL<P,S>)` to return `DECIMAL<P,S>` instead of widening precision to `DECIMAL<38,S>`. This is a meaningful semantic fix for implementers who need predictable decimal behavior and closer alignment with actual average semantics.

- [PR #945](https://github.com/substrait-io/substrait/pull/945) — **feat: add current_date, current_timestamp and current_timezone variables**  
  Closed on 2026-03-31. Adds execution-context variables for current date, timestamp, and timezone. This improves expressiveness for query planning and execution across engines that need standardized temporal session/context variables.

- [PR #1012](https://github.com/substrait-io/substrait/pull/1012) — **feat(extensions): support int arguments with std_dev and variance functions**  
  Expands statistical function support so integer arguments are accepted for `std_dev` and variance-related functions. This helps reduce avoidable casting requirements and better reflects common SQL engine behavior.

- [PR #1026](https://github.com/substrait-io/substrait/pull/1026) — **docs: supported libraries + breaking change policy**  
  Documentation-focused PR clarifying supported libraries and the project’s breaking change policy. This is strategically important for adopters who need stability guarantees and clearer compatibility expectations.

## 4. Feature Request Trends
Based on current PR activity, the main feature direction is toward **broader type-system coverage and more precise function semantics**. Unsigned integers, better decimal aggregation rules, and support for integer inputs to statistical functions all point to a push for more complete and implementation-friendly typing behavior.

A second trend is **better portability and governance**, seen in the move toward canonical URN-based extension references and clearer breaking-change documentation. Together, these suggest the community is focusing on making Substrait easier to implement consistently across engines and over time.

## 5. Developer Pain Points
A recurring friction point appears to be **semantic ambiguity in function behavior**, especially around numeric types and return-type inference. PRs like the decimal `avg` fix and expanded statistical function signatures indicate implementers are still working through mismatches between spec behavior and practical engine expectations.

Another likely pain point is **extension and compatibility management**. The URN migration in tests and the breaking-change policy documentation both suggest developers want less ambiguity around how extensions are referenced, versioned, and maintained across integrations.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*