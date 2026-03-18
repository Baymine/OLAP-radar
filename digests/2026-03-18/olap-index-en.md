# OLAP Ecosystem Index Digest 2026-03-18

> Generated: 2026-03-18 02:04 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project OLAP Infrastructure Comparison Report — 2026-03-18

## 1. Ecosystem Overview
The OLAP data infrastructure ecosystem remains highly active, but the center of gravity differs by layer: dbt-core is focused on developer experience and workflow correctness, Spark on runtime reliability and SQL/streaming correctness, and Substrait on specification precision and interoperability. Across all three, the dominant pattern is not headline feature expansion but hardening: clearer validation, better error semantics, stronger correctness guarantees, and improved operability. This suggests a maturing stack where users are scaling adoption and now pushing deeply on edge cases, automation, and cross-system consistency. For technical teams, the signal is clear: ecosystem value is increasingly coming from reliability, semantics, and integration quality rather than just net-new capabilities.

## 2. Activity Comparison

| Project | Hot Issues Today | Key PRs Mentioned | Release Status Today |
|---|---:|---:|---|
| dbt-core | 10 | 10 | No release noted |
| Apache Spark | 0 updated issues | 10 | No new releases |
| Substrait | 1 | 10 | No release noted |

### Notes
- **dbt-core** shows the highest visible issue-level churn today, with a strong bug-fix and UX-validation emphasis.
- **Spark** appears active mainly through PR flow rather than issue discussion, consistent with a mature project operating through branch maintenance and incremental hardening.
- **Substrait** has lower raw volume than dbt-core but shows dense spec-level iteration with several semantically important PRs.

## 3. Shared Feature Directions

### A. Clearer validation and better error semantics
**Projects:** dbt-core, Spark, Substrait  
**Evidence:**
- **dbt-core:** validation fixes for `packages.yml`, config keys, selector behavior, deprecation warnings, ambiguous relation errors.
- **Spark:** wrapping Avro parse NPEs in `SchemaParseException`, SQL correctness fixes, safer storage format handling.
- **Substrait:** unique function-name requirements, nullability enforcement, corrected return types, clearer enum/option semantics.

**Shared need:** users want systems to fail earlier, with domain-meaningful errors instead of low-level exceptions or ambiguous behavior.

---

### B. Correctness over edge cases and semantic consistency
**Projects:** dbt-core, Spark, Substrait  
**Evidence:**
- **dbt-core:** partial parsing bugs, threaded unit test naming collisions, catalog-aware `dbt test` behavior.
- **Spark:** SPJ dedup correctness backports, numeric precision improvements for `asinh`/`acosh`, RocksDB recovery integrity.
- **Substrait:** function signature normalization, null-literal semantics, aggregate argument modeling, `date_iyear` return-type correction.

**Shared need:** production users are stressing edge conditions, and maintainers are prioritizing semantic correctness over breadth.

---

### C. Better support for automation and scalable operations
**Projects:** dbt-core, Spark  
**Evidence:**
- **dbt-core:** env-var-driven selector parameters, configurable seed size, concurrency/threading issues.
- **Spark:** History Server caching and cleanup, cloud-state metrics, checksum verification for remote state recovery.

**Shared need:** teams are running larger, more automated deployments and need more controllable, observable, and CI/orchestrator-friendly behavior.

---

### D. Interoperability and abstraction quality
**Projects:** Spark, Substrait, dbt-core  
**Evidence:**
- **Spark:** Avro compatibility handling, metastore/storage format follow-ups, Python API docs improvements.
- **Substrait:** broader SQL/common-function coverage, richer physical plan expressiveness, tighter extension schema definitions.
- **dbt-core:** catalog integrations, advanced selector semantics, macro config support.

**Shared need:** the ecosystem is increasingly integration-led; projects are being judged on how predictably they compose with adjacent tooling and standards.

## 4. Differentiation Analysis

| Project | Primary Scope | Target Users | Technical Center of Gravity | Current Focus |
|---|---|---|---|---|
| dbt-core | Analytics engineering framework / transformation orchestration | Analytics engineers, platform teams, CI/CD operators | Project parsing, config/schema validation, DAG selection, testing workflows | UX hardening, config correctness, advanced project structures |
| Apache Spark | Distributed compute engine for batch, SQL, and streaming | Data engineers, platform operators, engine contributors | Runtime execution, SQL engine semantics, streaming state management, infra tooling | Operational reliability, SQL correctness, state-store resilience |
| Substrait | Cross-engine query plan/specification standard | Engine implementers, query planners, interoperability/tooling builders | Function/extension schema, plan semantics, canonical representation | Spec precision, interoperability semantics, physical-plan coverage |

### Key differences
- **dbt-core** is closest to day-to-day analytics developer workflows; its issues are highly user-facing and often tied to ergonomics and predictable project behavior.
- **Spark** operates at execution-engine scale; its active work is more infrastructure-heavy, with performance, correctness, branch backports, and streaming durability dominating.
- **Substrait** is specification-centric; its progress matters less through user-facing bugs and more through semantic alignment that affects many downstream engines and translators.

## 5. Community Momentum & Maturity

### Most visibly active today: dbt-core
dbt-core has the strongest visible issue-plus-PR momentum today. The pattern of issue-to-PR turnaround on several items indicates a responsive contributor loop and a community actively surfacing production friction. Its activity profile suggests a large and growing operator base pushing on real-world workflow complexity.

### Most mature and maintenance-heavy: Apache Spark
Spark shows the hallmarks of a highly mature project: fewer issue updates in the daily window, but steady PR activity across correctness, observability, infrastructure, and multi-branch backports. This is typical of a broadly deployed platform with high compatibility obligations and a disciplined maintenance cadence.

### Fastest spec iteration per unit of activity: Substrait
Substrait has lower overall volume but high semantic density. A small number of issues/PRs are driving foundational changes in type semantics, function modeling, and physical plan representation. That indicates a project still evolving core abstractions relatively quickly, with outsized downstream impact for interoperable engines.

### Maturity summary
- **dbt-core:** active growth + operational refinement
- **Spark:** mature platform + reliability/backport discipline
- **Substrait:** emerging standard + rapid semantic tightening

## 6. Trend Signals

### 1. Reliability and correctness are now the main battleground
Across all three communities, maintainers are spending significant effort on removing ambiguity, improving validation, and fixing correctness edge cases. For data engineers, this means tool selection should increasingly consider failure semantics and operational predictability, not just features.

### 2. Enterprise-scale usage is pushing deeper edge cases
Threading bugs, partial parsing issues, History Server scaling, cloud-state recovery, and spec nullability details all point to users operating these systems in larger and more complex environments. Buyers and adopters should expect mature usage patterns to expose non-obvious constraints in concurrency, metadata, and compatibility layers.

### 3. Interoperability is becoming strategic
Catalog integrations in dbt-core, compatibility/error handling in Spark, and function/schema normalization in Substrait all reflect a broader shift: standalone tools are less valuable than tools that integrate cleanly into a heterogeneous stack. This raises the importance of open standards, stable contracts, and machine-readable semantics.

### 4. Observability and actionable errors are critical product qualities
Several changes across projects target not raw performance but diagnosability. For platform teams, this is a practical evaluation criterion: systems that surface high-quality errors and metrics reduce time-to-resolution and operational cost.

### 5. Specification quality is increasingly a platform concern
Substrait’s activity shows that formal semantics are no longer niche. As cross-engine planning, federation, and portable query representation become more important, spec precision will have direct downstream value for engine compatibility and tooling ecosystems.

### Practical takeaway for data engineers
- Choose **dbt-core** when workflow ergonomics, modular analytics engineering, and CI-friendly transformation management matter most.
- Choose **Spark** when execution scale, streaming durability, and engine-level performance/correctness dominate.
- Track **Substrait** closely if your roadmap depends on interoperability, portable plans, or multi-engine architecture.

If you want, I can also turn this into a **one-slide executive summary** or a **scored comparison matrix** for architecture decisions.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-03-18

## 1. Today’s Highlights
dbt-core saw a bug-fix-heavy day, with several new reports centered on parsing, config validation, catalog integrations, and concurrency edge cases. Community contributions are moving quickly into PRs, especially around clearer validation behavior, environment-variable support for selection, and fixes for catalog-aware `dbt test` execution.

## 3. Hot Issues

1. **Misleading deprecation warning for generic test properties**  
   [#12572](https://github.com/dbt-labs/dbt-core/issues/12572) — Open  
   This bug reports that `MissingArgumentsPropertyInGenericTestDeprecation` is raised for valid YAML property usage, which can confuse users trying to modernize test definitions. It matters because deprecation guidance needs to be precise; misleading warnings erode trust in upgrade paths. Community reaction is modest so far, but it carries a backport label, signaling maintainer interest.

2. **`dbt test` fails with AWS Glue Catalog Integration in Snowflake**  
   [#12662](https://github.com/dbt-labs/dbt-core/issues/12662) — Open  
   A newly reported interoperability issue shows `dbt test` failing when custom catalog integrations are used via `catalogs.yml`. This is important for teams adopting more advanced metadata/catalog patterns across Snowflake and AWS Glue. It quickly led to a corresponding community PR, suggesting the issue is reproducible and actionable.

3. **Support env vars for selector parameters**  
   [#12193](https://github.com/dbt-labs/dbt-core/issues/12193) — Open  
   This feature request asks for environment variables such as `DBT_ENGINE_{SELECTOR,SELECT,EXCLUDE}` to control selection behavior in automated workflows. It matters for CI/CD, templated deployments, and scheduler-driven runs where flags are cumbersome to inject directly. Recent activity and a linked PR indicate renewed momentum.

4. **Validate selector nodes like standard selections**  
   [#7513](https://github.com/dbt-labs/dbt-core/issues/7513) — Open  
   Longstanding request to make selector node validation behave consistently with normal node selection. This matters because selection semantics are foundational to build reliability, especially in large projects using reusable selectors. The `help_wanted` label and recent update make it notable for contributors.

5. **Missing `version` in `packages.yml` causes cryptic `KeyError` in `dbt debug`**  
   [#12649](https://github.com/dbt-labs/dbt-core/issues/12649) — Open  
   Instead of surfacing a validation error, dbt throws a low-level `KeyError` when `version` is absent from a hub package declaration. This is exactly the kind of UX bug that slows down onboarding and troubleshooting. It already has a paired PR, so users may see relief soon.

6. **Custom config keys should raise deprecation errors**  
   [#12542](https://github.com/dbt-labs/dbt-core/issues/12542) — Open  
   This issue argues that invalid custom keys inside `config` should produce the expected deprecation warning, rather than being silently accepted or inconsistently handled. It matters for config hygiene and migration correctness, especially as dbt tightens schema validation. Backport labeling suggests relevance to active release lines.

7. **Ambiguous warehouse relation error messaging**  
   [#12629](https://github.com/dbt-labs/dbt-core/issues/12629) — Open  
   The issue highlights confusing messaging when dbt detects two relations with similar database identifiers. This is important because relation-resolution errors can be difficult to diagnose in multi-database or case-sensitive environments. Community reaction is still light, but the underlying usability problem is significant.

8. **Better errors and warnings**  
   [#12566](https://github.com/dbt-labs/dbt-core/issues/12566) — Closed  
   Although now closed, this issue is worth tracking because it reflects a broad community desire for more structured and recognizable warning/error output. Better severity labeling and readability directly improve operational debugging. Its closure points to maintainers accepting at least part of that direction.

9. **Partial parsing drops versioned model after `schema.yml` edit**  
   [#12666](https://github.com/dbt-labs/dbt-core/issues/12666) — Open  
   A new partial parsing bug reports versioned model nodes disappearing after schema changes, leading to “v2 not found”-style failures. This matters for dbt Cloud and fast-feedback development workflows, where partial parsing is a major performance feature. Even with no comments yet, this could affect many teams using model versioning.

10. **Duplicate unit test names interact badly with `--threads` on BigQuery**  
    [#12665](https://github.com/dbt-labs/dbt-core/issues/12665) — Open  
    This concurrency-related issue shows duplicate unit test names causing problems when threading is increased. It matters because parallelism and test scaling are critical in mature dbt projects, and race-like naming collisions can create flaky behavior. Early-stage issue, but relevant for teams expanding unit test coverage.

## 4. Key PR Progress

1. **Fix package version validation for missing property**  
   [#12650](https://github.com/dbt-labs/dbt-core/pull/12650) — Open  
   Community PR addressing [#12649](https://github.com/dbt-labs/dbt-core/issues/12649). It aims to replace a cryptic `KeyError` path with proper validation when `packages.yml` omits `version`, improving debuggability for package management.

2. **Check config keys comprehensively and simplify deprecation logic**  
   [#12667](https://github.com/dbt-labs/dbt-core/pull/12667) — Open  
   This PR resolves [#12542](https://github.com/dbt-labs/dbt-core/issues/12542) by tightening config-key checks and improving how deprecation warnings are triggered. It looks like an important cleanup in config validation behavior and is marked for backport.

3. **Revert of duplicate CTE race-condition revert**  
   [#12659](https://github.com/dbt-labs/dbt-core/pull/12659) — Closed  
   This PR reverts a prior revert related to duplicate CTE race conditions in ephemeral model compilation. While operationally narrow, it signals ongoing churn around concurrency-sensitive compilation logic and suggests maintainers are still stabilizing the fix path.

4. **Make maximum seed size configurable**  
   [#11177](https://github.com/dbt-labs/dbt-core/pull/11177) — Open  
   A longer-running PR to make the 1 MiB seed size limit configurable. This is a meaningful operational feature for teams with larger CSV seeds, and its continued activity shows the request remains relevant.

5. **Support environment variables for selector parameters**  
   [#12664](https://github.com/dbt-labs/dbt-core/pull/12664) — Open  
   Community contribution implementing env-var-driven selector inputs, tied to [#12193](https://github.com/dbt-labs/dbt-core/issues/12193). If merged, it would improve ergonomics for CI pipelines, orchestrators, and reusable deployment templates.

6. **Earlier `DBT_SELECTOR` env-var PR closed in favor of broader approach**  
   [#12194](https://github.com/dbt-labs/dbt-core/pull/12194) — Closed  
   This earlier narrower implementation introduced only `DBT_SELECTOR`. Its closure alongside the newer broader PR suggests the project is converging on a more complete environment-variable interface rather than a one-off addition.

7. **Add `@requires.catalogs` decorator to `test` command**  
   [#12663](https://github.com/dbt-labs/dbt-core/pull/12663) — Open  
   Fast follow-up to [#12662](https://github.com/dbt-labs/dbt-core/issues/12662). It proposes aligning `dbt test` with other commands so catalog integrations are initialized correctly, an important compatibility fix for advanced Snowflake catalog usage.

8. **Micro-performance cleanup for dictionary membership checks**  
   [#12191](https://github.com/dbt-labs/dbt-core/pull/12191) — Open  
   This PR replaces `in dict.keys()` with `in dict` across several code paths. The change is small but useful: modest performance cleanup, improved readability, and the kind of maintenance work that compounds in a large codebase.

9. **Support config properties for macros**  
   [#12559](https://github.com/dbt-labs/dbt-core/pull/12559) — Closed  
   This merged PR adds config support for macros, including `meta` and `docs` inside config structures. It’s a notable enhancement for consistency across resource types and was important enough to receive a backport PR.

10. **Support `.jinja`, `.jinja2`, and `.j2` doc file extensions**  
    [#12653](https://github.com/dbt-labs/dbt-core/pull/12653) — Closed  
    This community contribution expands docs parsing beyond `.md` files, helping teams whose editors or workflows prefer explicit Jinja-oriented extensions. It’s a practical quality-of-life improvement for documentation authoring.

## 5. Feature Request Trends
A few themes stand out across recent issue and PR activity:

- **More automation-friendly CLI behavior**  
  The request for environment-variable support around `select`, `exclude`, and `selector` points to growing demand from CI/CD and orchestration users for less flag-heavy invocation patterns.

- **Stricter, clearer validation**  
  Several bugs and fixes revolve around config keys, package definitions, selector validation, and deprecation messaging. The community clearly wants dbt to fail earlier and with more actionable feedback.

- **Better support for advanced project structures**  
  Ongoing attention to selectors, versioned models, macro configs, and catalog integrations indicates users are stretching dbt-core into more modular and enterprise-style usage patterns.

- **Operational flexibility at scale**  
  Requests like configurable seed-size limits and fixes for threaded/unit-test behavior suggest teams are pushing dbt in larger, more parallelized workloads.

## 6. Developer Pain Points
Recurring frustrations in the latest activity are consistent:

- **Cryptic errors instead of guided validation**  
  Low-level exceptions like `KeyError`, ambiguous relation errors, and misleading deprecation warnings remain a major usability problem.

- **Inconsistent behavior across commands**  
  The catalog integration bug in `dbt test` highlights how command-level inconsistencies can break otherwise valid project setups.

- **Partial parsing and concurrency edge cases**  
  Versioned models disappearing after schema edits, duplicate test name problems under threading, and ongoing race-condition work all point to fragility in high-speed or parallel workflows.

- **Configuration semantics are still easy to get wrong**  
  Missing prefixes, unsupported custom keys, and package-version requirements show that config ergonomics remain a source of friction, especially during upgrades or refactors.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-18

## 1. Today's Highlights
Spark activity today centered on infrastructure reliability, SQL correctness, and Structured Streaming state-store hardening. The most notable themes were Spark History Server improvements, multiple follow-up fixes in SQL compatibility and correctness, and continued investment in RocksDB-backed streaming state durability and observability.  
There were no new releases and no recently updated GitHub Issues, so the pulse of the community is best read through active pull requests and backport work across the 3.5 and 4.0 lines.

## 2. Hot Issues
No GitHub Issues were updated in the last 24 hours, so there is no issue-driven discussion to summarize today.

## 3. Key PR Progress

1. **Use Nisse as plugin and bump to 0.7.0**  
   PR: [#54825](https://github.com/apache/spark/pull/54825)  
   This build-infra change replaces Nisse as an extension with plugin usage and upgrades it from 0.4.6 to 0.7.0. It matters because it should improve IntelliJ import behavior, reducing friction for Spark contributors working on the Maven-based developer workflow.

2. **Cache and reuse AppStatus in the History Server**  
   PR: [#54878](https://github.com/apache/spark/pull/54878)  
   This WIP proposal allows the Spark History Server to cache serialized `AppStatus` protobuf materialization for completed applications. If merged, it could significantly reduce reload overhead and improve responsiveness when revisiting completed application UIs.

3. **Checksum verification for RocksDB checkpoint zip reads**  
   PR: [#54493](https://github.com/apache/spark/pull/54493)  
   This Structured Streaming change ensures RocksDB checkpoint zip downloads use the checkpoint file abstraction so read-time checksum validation is preserved. It is an important reliability fix for state-store recovery, especially on cloud or distributed filesystems.

4. **Improve precision of `asinh` / `acosh` using fdlibm algorithms**  
   PR: [#54677](https://github.com/apache/spark/pull/54677)  
   This SQL follow-up ports the fdlibm/OpenJDK implementations for `Asinh` and `Acosh`, replacing numerically weaker formulas. It matters for correctness-sensitive analytical workloads that depend on stable floating-point behavior near edge cases.

5. **Document `parseJson` in Python more clearly**  
   PR: [#54795](https://github.com/apache/spark/pull/54795)  
   A docs-oriented PySpark PR, but still useful: it improves guidance around `parseJson`, which helps avoid API misuse and lowers onboarding costs for Python users adopting newer JSON parsing functionality.

6. **Follow-up fix for `CatalogStorageFormat` serde parameter handling**  
   PR: [#54860](https://github.com/apache/spark/pull/54860)  
   This SQL follow-up moves `serdeName` to the last constructor parameter and filters empty strings. The change aims at source compatibility and safer storage-format handling, reducing the chance of subtle metastore-related regressions.

7. **Wrap Avro 1.12 parse NPEs in `SchemaParseException`**  
   PR: [#54876](https://github.com/apache/spark/pull/54876)  
   Spark proposes to normalize an Avro 1.12.x `NullPointerException` from `ParseContext.resolve()` into a more meaningful `SchemaParseException`. This is a practical error-handling improvement that should make schema debugging far easier for users integrating Avro.

8. **Add metrics for RocksDB loads from cloud storage**  
   PR: [#54567](https://github.com/apache/spark/pull/54567)  
   This Structured Streaming PR introduces `rocksdbLoadedFromCloud`, exposing how often state snapshots are fetched remotely during load. It improves observability for state-store performance and can help operators diagnose latency spikes or inefficient checkpoint locality.

9. **Fix HistoryServerDiskManager cleanup logic**  
   PR: [#54877](https://github.com/apache/spark/pull/54877)  
   This Core fix addresses a bug where app-store directories may not be deleted on release if the app is absent from the active in-memory map. It is an operationally important cleanup patch because leaked History Server disk state can accumulate silently over time.

10. **Backports for incorrect dedup results with SPJ partial clustering**  
    PRs: [#54851](https://github.com/apache/spark/pull/54851), [#54852](https://github.com/apache/spark/pull/54852)  
    These backports bring a previously merged correctness fix to Spark 4.0 and 3.5. The issue affects deduplication results under storage-partitioned join partial clustering, so this is high priority for users depending on SPJ optimizations in production SQL pipelines.

## 4. Feature Request Trends
Although there were no updated Issues today, the active PR set reveals several clear direction signals:

- **More resilient Structured Streaming state management**  
  Multiple PRs focus on checksum verification, cloud-load metrics, and state-store tuning. This indicates sustained demand for more durable and debuggable streaming recovery behavior, especially with RocksDB and object-store-backed checkpoints.

- **Better History Server scalability and hygiene**  
  Work on AppStatus caching and disk cleanup suggests users are pushing Spark toward more efficient operation for large fleets with many completed applications.

- **SQL correctness over edge cases and backport coverage**  
  Unicode handling, numeric function precision, and SPJ dedup correctness all point to a strong community emphasis on semantics and stability, not just new features.

- **Improved developer ergonomics**  
  Build tooling and API documentation changes show ongoing demand to reduce contributor setup friction and clarify newer APIs for end users.

## 5. Developer Pain Points
Recurring frustrations visible from today’s PRs include:

- **State-store reliability in cloud environments**  
  The repeated focus on checksum behavior, download paths, and remote snapshot visibility implies that debugging checkpoint corruption, replay behavior, and restore performance remains painful.

- **History Server operational inefficiencies**  
  Caching and cleanup bugs suggest that large deployments still encounter sluggish reloads and disk-management issues in the History Server.

- **Hard-to-diagnose SQL and schema errors**  
  PRs around Avro exception wrapping and SQL edge-case correctness indicate that users want clearer failures and fewer silent or confusing semantic bugs.

- **Branch maintenance complexity**  
  The presence of multiple correctness backports across 3.5 and 4.0 highlights the overhead of keeping behavior aligned across supported Spark branches.

- **Contributor tooling friction**  
  Build-system work such as the Nisse plugin change suggests IDE import and local development setup continue to be a quality-of-life issue for contributors.

## 6. Releases
No new releases were published in the last 24 hours.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

## Today's Highlights

Substrait activity on 2026-03-18 centered on extension/function semantics, with multiple PRs refining function signatures, nullability behavior, enum arguments, and documentation around extension YAMLs. The most notable completed change is a breaking fix to `add:date_iyear`, while open work shows the community tightening correctness and consistency in the function specification layer.  

There is also continued momentum on execution semantics and physical planning, including current time/context functions and a new `TopNRel` physical operator with `WITH TIES` support.

## Hot Issues

1. [#931](https://github.com/substrait-io/substrait/issues/931) — **Require function names to be unique within extension YAML files**  
   This issue matters because duplicate function names in extension YAMLs can break code generation, validation, and downstream tooling that expects a one-name/one-definition mapping. It points to a structural quality problem in the extension catalog rather than a one-off typo.  
   Community reaction appears modest but positive so far, with limited discussion and 1 👍, suggesting agreement on the need for cleanup and stronger schema rules.

## Key PR Progress

1. [#1007](https://github.com/substrait-io/substrait/pull/1007) — **fix(extensions)!: correct return type for `add:date_iyear` operation**  
   Closed today, this breaking fix changes the return type from `timestamp` to `date`. It improves semantic correctness for date plus year/month interval arithmetic and is likely important for engine compatibility and conformance.

2. [#989](https://github.com/substrait-io/substrait/pull/989) — **[PMC Ready] fix: enforce nullable types for null literals in test cases**  
   This PR aligns function test cases with declared nullability semantics in extension YAMLs. It is important because null propagation rules are a common source of interoperability bugs between producers and consumers.

3. [#1013](https://github.com/substrait-io/substrait/pull/1013) — **[PMC Ready] feat: add optional description field to function implementations**  
   Adds a per-implementation `description` field to the extension schema. This improves documentation fidelity and may help tools surface more precise semantics where a single function has multiple implementations.

4. [#1005](https://github.com/substrait-io/substrait/pull/1005) — **feat(docs): clarify distinction between enumeration arguments and options**  
   A specification/documentation clarification PR that separates two easily conflated mechanisms for fixed-set string values. This matters because ambiguity at the spec layer often cascades into incompatible implementations.

5. [#1011](https://github.com/substrait-io/substrait/pull/1011) — **fix(extensions): change distribution option to enum arg for std_dev and variance**  
   This breaking signature update applies the clarified enum-vs-option guidance to aggregate functions. It signals active normalization of function definitions to make them more precise and machine-interpretable.

6. [#1010](https://github.com/substrait-io/substrait/pull/1010) — **feat(tests): add enum argument support to FuncTestCase grammar**  
   Adds explicit enum argument support in the function test grammar. This is foundational work that enables more accurate testing of function signatures and semantics introduced by other PRs.

7. [#945](https://github.com/substrait-io/substrait/pull/945) — **[PMC Ready] feat: add current_date, current_timestamp and current_timezone functions**  
   Introduces execution-context-dependent scalar functions. These are broadly useful for SQL interoperability and practical engine support, especially for planners translating common SQL built-ins into Substrait.

8. [#1012](https://github.com/substrait-io/substrait/pull/1012) — **feat(extensions): support int arguments with std_dev and variance functions**  
   Extends aggregate support to integer inputs and builds on the enum/test grammar changes. This improves completeness of core statistical functions and better reflects common engine behavior.

9. [#1009](https://github.com/substrait-io/substrait/pull/1009) — **feat: add TopNRel physical operator with WITH TIES support**  
   Adds a physical relation combining sort and fetch semantics, including `WITH TIES`. This is a meaningful step for physical plan expressiveness and closes a gap between documentation and protobuf definitions.

10. [#797](https://github.com/substrait-io/substrait/pull/797) — **[Stale] feat: support with ties in FetchRel**  
   Although closed as stale, this older PR remains relevant as context for the newer `TopNRel` work. It shows the community’s long-running interest in standardized `WITH TIES` semantics and likely influenced the newer design direction.

## Feature Request Trends

- **Stricter extension schema correctness and normalization**  
  The issue and PR flow strongly emphasizes making extension YAMLs more deterministic: unique function names, correct return types, explicit nullability, and clearer per-implementation metadata.

- **Clearer function argument modeling**  
  Multiple PRs focus on distinguishing enum arguments from options and updating both test grammar and function definitions accordingly. This suggests a broader push toward better machine-readable function signatures.

- **Broader SQL and engine interoperability**  
  Additions like `current_date`, `current_timestamp`, `current_timezone`, and improved support for statistical functions indicate continued demand for common SQL semantics in Substrait.

- **Richer physical plan expressiveness**  
  The `TopNRel` proposal shows interest in encoding execution-oriented operators more directly, especially for features like `WITH TIES` that are common in production databases.

## Developer Pain Points

- **Ambiguity in extension/function specification semantics**  
  Developers appear to be running into uncertainty around nullability rules, duplicate names, enum arguments versus options, and per-function implementation details. These ambiguities make it harder to build reliable validators, generators, and engine integrations.

- **Spec/tooling mismatch in tests and generated artifacts**  
  Several PRs indicate that current test grammars and generated test cases lag behind the evolving function model. This creates friction for contributors trying to verify correctness across implementations.

- **Gaps between documented capabilities and protobuf/schema support**  
  The `TopNRel` work highlights a recurring frustration: features may be conceptually documented or desired by implementers before they are properly represented in the canonical schema.

- **Breaking corrections are necessary but costly**  
  Fixes like the `add:date_iyear` return type and aggregate signature changes improve correctness, but they also imply churn for downstream consumers that have already implemented earlier definitions.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*