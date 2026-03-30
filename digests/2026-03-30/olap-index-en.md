# OLAP Ecosystem Index Digest 2026-03-30

> Generated: 2026-03-30 01:45 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project OLAP Ecosystem Comparison Report — 2026-03-30

## 1. Ecosystem Overview
The OLAP data infrastructure ecosystem shows strong momentum around three themes: **developer ergonomics**, **operational reliability**, and **interoperability**.  
`dbt-core` is currently optimizing the practitioner experience through better error messages, logging, artifact usability, and safer CLI behavior. `Apache Spark` is balancing platform-scale operational improvements with continued investment in Spark Connect, SQL/DataSource V2, and connector compatibility. `Substrait`, while quieter in raw activity, is advancing the standards layer by expanding portable analytical semantics and filling physical plan modeling gaps that matter for cross-engine execution.

## 2. Activity Comparison

| Project | Updated Issues Today | Notable PRs Updated Today | Release Status Today | Main Activity Pattern |
|---|---:|---:|---|---|
| **dbt-core** | 0 | 10 key PRs highlighted | No new release | Heavy contributor-led UX, error clarity, CLI/artifact improvements |
| **Apache Spark** | 3 | 10 key PRs highlighted | No new release | Broad activity across SHS, Spark Connect, SQL/DSv2, JDBC/docs |
| **Substrait** | 0 | 1 PR updated | **New release: v0.87.0** | Standards evolution: aggregate semantics and physical operator modeling |

## 3. Shared Feature Directions

### A. Better debuggability and clearer errors
**Projects:** `dbt-core`, `Apache Spark`  
**Specific needs:**
- **dbt-core:** more contextual compilation/runtime errors, macro/file-path visibility, clearer selector validation, preserved failure details in artifacts
- **Spark:** named DSv2 errors instead of legacy codes, better docs around API return types, clearer build behavior around generated code

**Why it matters:** Teams increasingly expect infrastructure tools to fail with actionable context, especially in CI/CD and large multi-contributor analytics environments.

---

### B. Operational reliability at scale
**Projects:** `dbt-core`, `Apache Spark`  
**Specific needs:**
- **dbt-core:** shorter telemetry timeout, more accurate test/store-failures behavior, better clone visibility, cross-platform reliability
- **Spark:** SHS scan reduction, more accurate on-demand metadata loading, Spark Connect transport stability via gRPC/Netty upgrades

**Why it matters:** Both communities are responding to production-scale friction where small reliability issues create disproportionate operator cost.

---

### C. Better interface ergonomics for practitioners
**Projects:** `dbt-core`, `Apache Spark`  
**Specific needs:**
- **dbt-core:** pretty-printed JSON artifacts, stable test naming, per-model clone logs
- **Spark:** clearer SQL/docs behavior, parity improvements in DSv2 SQL commands, explicit compatibility configs for JDBC mappings

**Why it matters:** As these tools become embedded in governed platform workflows, operator-friendly outputs and predictable semantics become first-order requirements.

---

### D. Stronger interoperability and semantic precision
**Projects:** `Apache Spark`, `Substrait`  
**Specific needs:**
- **Spark:** JDBC type mapping controls, language-agnostic UDF IPC, modern catalog/table parity
- **Substrait:** standardized statistical aggregates, explicit physical `TopNRel` representation, less ambiguity in exchange semantics

**Why it matters:** The ecosystem is moving toward composable multi-engine architectures, where portability and semantic fidelity are increasingly strategic.

## 4. Differentiation Analysis

### dbt-core
- **Scope:** Analytics engineering workflow orchestration, modeling, testing, project compilation, and developer tooling
- **Target users:** Analytics engineers, data transformation developers, package maintainers
- **Technical approach:** High emphasis on CLI behavior, Jinja/macro ergonomics, artifact generation, and compile-time/runtime safety

**Distinctive signal:** dbt-core is most focused on the **day-to-day developer experience** of analytics code authoring and execution.

---

### Apache Spark
- **Scope:** General-purpose distributed compute engine spanning SQL, batch, connectors, cluster/runtime behavior, and remote execution via Connect
- **Target users:** Data engineers, platform engineers, connector developers, Spark application developers
- **Technical approach:** Large-surface systems engineering across runtime internals, transport stack, SQL semantics, resource management, and connectors

**Distinctive signal:** Spark has the broadest technical surface and is addressing both **platform-scale operations** and **next-generation remote/client execution**.

---

### Substrait
- **Scope:** Cross-engine query and plan representation standard
- **Target users:** Engine implementers, query planner authors, interoperability architects
- **Technical approach:** Specification and protobuf evolution, standard function semantics, physical plan formalization

**Distinctive signal:** Substrait operates at the **interoperability/specification layer**, influencing how engines exchange meaning rather than how end users directly run workloads.

## 5. Community Momentum & Maturity

### Most active community today: Apache Spark
Spark shows the broadest distribution of activity across issues and PRs, covering runtime, SQL, connectors, docs, and Connect. This indicates a **large, mature, multi-front community** with active maintenance and parallel roadmap execution.

### Fastest visible contributor iteration today: dbt-core
dbt-core had no updated issues but a dense set of highly targeted PRs, mostly around usability and correctness. That pattern suggests a community in **rapid polish mode**, with strong responsiveness to real user pain points and a healthy contributor pipeline.

### Smaller but strategically important standards momentum: Substrait
Substrait is much quieter in raw volume, but its activity is disproportionately important for ecosystem architecture. A release plus ongoing physical operator work indicates **steady standards maturation**, even if community throughput is lower than product-facing platforms.

### Maturity assessment
- **Spark:** highest platform maturity, widest contributor surface, strongest signs of enterprise-scale operational hardening
- **dbt-core:** highly mature in user workflow focus, with continued refinement of product ergonomics
- **Substrait:** earlier-stage relative to Spark/dbt in ecosystem size, but increasingly important as a foundation for engine interoperability

## 6. Trend Signals

### 1. Developer experience is now infrastructure work
Across dbt-core and Spark, better errors, documentation, logs, and output formats are being treated as core product improvements rather than secondary polish. For data engineers, this means tool selection should increasingly factor in **debuggability and operator UX**, not just raw capability.

### 2. Production reliability is shifting left into defaults and guardrails
Timeout tuning, malformed selector validation, transport upgrades, metadata correctness, and compatibility toggles show communities are trying to prevent failure before it becomes an incident. This is valuable for teams standardizing tools across mixed local, CI, and managed environments.

### 3. Multi-engine interoperability is becoming more concrete
Spark’s language-agnostic UDF IPC work and Substrait’s semantic/operator standardization both point toward a future where execution layers are more modular. For platform teams, this increases the strategic value of **open interfaces and portable semantics**.

### 4. SQL/catalog modernization remains incomplete but active
Spark’s DSv2 parity work and connector-type mapping controls show that modern table/catalog ecosystems still have rough edges. Data engineers working with Iceberg, Delta, federated JDBC, or custom catalogs should expect continued improvement, but also ongoing behavior differences that require validation.

### 5. Standards and semantics are gaining importance alongside engines
Substrait’s statistical aggregate additions and physical Top-N modeling show that the ecosystem increasingly cares about **how semantics travel across systems**, not just how one engine executes them. This is a key reference signal for teams building heterogeneous OLAP stacks.

---

## Bottom Line
- **dbt-core:** strongest signal in analytics developer productivity and workflow polish  
- **Spark:** strongest signal in platform breadth, scale operations, and remote execution maturity  
- **Substrait:** strongest signal in long-term interoperability and semantic standardization  

For technical decision-makers, the combined picture is clear: the OLAP ecosystem is moving toward **more reliable tooling, better developer/operator UX, and more portable execution semantics**.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

# dbt-core Community Digest — 2026-03-30

## Today's Highlights
Community activity in `dbt-core` was heavily concentrated in pull requests today, with a large batch of contributor-led fixes focused on error clarity, CLI usability, artifact quality, and cross-platform reliability. The dominant theme is developer experience: clearer compilation and validation messages, better runtime logging, and fewer “silent” or misleading failures across tests, snapshots, selectors, state comparison, and `dbt deps`.

## Hot Issues
No GitHub issues were updated in the last 24 hours.

## Key PR Progress

1. **Honor `name` in singular data test `config()` blocks**  
   PR [#12745](https://github.com/dbt-labs/dbt-core/pull/12745) fixes a long-standing inconsistency where `{{ config(name='...') }}` in singular `.sql` data tests was ignored. This matters for teams that rely on stable, human-readable test names in CLI output and downstream automation.

2. **Pretty-print JSON artifacts with a new CLI/env flag**  
   PR [#12744](https://github.com/dbt-labs/dbt-core/pull/12744) adds `--write-json-indent` and `DBT_WRITE_JSON_INDENT`, enabling readable `manifest.json`, `run_results.json`, and related artifacts. This is a practical quality-of-life improvement for debugging artifacts, reviewing changes, and integrating with CI workflows.

3. **Per-model logging for `dbt clone`**  
   PR [#12743](https://github.com/dbt-labs/dbt-core/pull/12743) adds model-level log output to `dbt clone`, addressing a visibility gap in clone operations. For users cloning large projects, this should make progress tracking and troubleshooting much easier.

4. **Macro name and file path in Jinja compilation errors**  
   PR [#12742](https://github.com/dbt-labs/dbt-core/pull/12742) improves compilation diagnostics by including both macro name and file path when Jinja syntax errors occur. This directly targets a painful debugging workflow in macro-heavy projects.

5. **Reduce Snowplow telemetry timeout**  
   PR [#12741](https://github.com/dbt-labs/dbt-core/pull/12741) lowers telemetry network timeouts from 5 seconds to 1 second. This could materially reduce end-of-invocation delays for users in restricted or unreliable network environments.

6. **Clear errors for malformed graph selectors**  
   PR [#12740](https://github.com/dbt-labs/dbt-core/pull/12740) introduces actionable runtime errors for selector patterns like `+`, `@`, `2+`, or malformed operator spacing. This should reduce confusion around graph selection syntax that previously failed silently or unpredictably.

7. **Contributor testing guide added**  
   PR [#12739](https://github.com/dbt-labs/dbt-core/pull/12739) proposes a dedicated `TESTING.md` for contributors. While not user-facing product work, it is strategically important for improving contribution quality and lowering barriers for new community developers.

8. **Suppress misleading `store_failures` message on test errors**  
   PR [#12738](https://github.com/dbt-labs/dbt-core/pull/12738) prevents dbt from claiming a failures table exists when a test errored before one could be created. This addresses a subtle but frustrating mismatch between logs and actual warehouse state.

9. **Fix false-positive macro arg validation for generic tests**  
   PR [#12737](https://github.com/dbt-labs/dbt-core/pull/12737) avoids warnings triggered by implicit generic test arguments like `model` and `column_name`. This should reduce noise for teams using `validate_macro_args: true` and documenting custom tests.

10. **Warn on `run_query` usage outside `{% if execute %}`**  
    PR [#12736](https://github.com/dbt-labs/dbt-core/pull/12736) adds guardrails for introspective macros that run during parse time and currently fail with cryptic `None`-type errors. This is especially valuable for macro authors and advanced package maintainers.

## Feature Request Trends
Based on current PR activity, the strongest feature direction is **better debuggability across the dbt lifecycle**. Contributors are repeatedly addressing missing context in errors, opaque parser behavior, and CLI/logging gaps.

Other clear trend lines:

- **More readable and automation-friendly artifacts**  
  Example: PR [#12744](https://github.com/dbt-labs/dbt-core/pull/12744) for indented JSON output and PR [#12730](https://github.com/dbt-labs/dbt-core/pull/12730) for preserving failure messages in `run_results.json`.

- **More contextual error reporting**  
  Seen in PRs [#12742](https://github.com/dbt-labs/dbt-core/pull/12742), [#12734](https://github.com/dbt-labs/dbt-core/pull/12734), and [#12732](https://github.com/dbt-labs/dbt-core/pull/12732), all of which push errors closer to the actual node, macro, or file that caused them.

- **Safer, more explicit behavior in edge cases**  
  Examples include malformed selector handling in [#12740](https://github.com/dbt-labs/dbt-core/pull/12740), snapshot validation behavior in [#12700](https://github.com/dbt-labs/dbt-core/pull/12700), and unit-test handling for ephemeral inputs in [#12735](https://github.com/dbt-labs/dbt-core/pull/12735).

- **Operational reliability across environments**  
  Cross-platform hashing and git behavior fixes in [#12731](https://github.com/dbt-labs/dbt-core/pull/12731) and [#12728](https://github.com/dbt-labs/dbt-core/pull/12728) suggest ongoing demand for reproducible behavior in mixed local/CI/cloud setups.

## Developer Pain Points
Several recurring frustrations stand out from today’s PR queue:

- **Errors lack enough context to debug quickly**  
  Missing node names, macro names, file paths, and exception messages continue to slow users down. PRs [#12742](https://github.com/dbt-labs/dbt-core/pull/12742), [#12734](https://github.com/dbt-labs/dbt-core/pull/12734), [#12732](https://github.com/dbt-labs/dbt-core/pull/12732), and [#12730](https://github.com/dbt-labs/dbt-core/pull/12730) all tackle this directly.

- **Silent or misleading behavior in advanced workflows**  
  Users are still hitting cases where dbt appears to succeed quietly, logs the wrong thing, or fails opaquely. Examples include `dbt clone` visibility ([#12743](https://github.com/dbt-labs/dbt-core/pull/12743)), `store_failures` messaging ([#12738](https://github.com/dbt-labs/dbt-core/pull/12738)), and parse-time introspection mistakes ([#12736](https://github.com/dbt-labs/dbt-core/pull/12736)).

- **Platform and environment differences cause avoidable breakage**  
  Line ending mismatches and git config variance remain real sources of friction in distributed teams. PRs [#12731](https://github.com/dbt-labs/dbt-core/pull/12731) and [#12728](https://github.com/dbt-labs/dbt-core/pull/12728) reflect the need for stronger normalization and defensive defaults.

- **Testing and contributor ergonomics need polish**  
  The addition of `TESTING.md` in [#12739](https://github.com/dbt-labs/dbt-core/pull/12739) underscores that contribution workflows are still hard to navigate, especially for first-time contributors.

- **CLI and artifact output still need stronger operator ergonomics**  
  Readable JSON, meaningful per-node logs, and correct surfaced names remain active asks, addressed in [#12744](https://github.com/dbt-labs/dbt-core/pull/12744), [#12743](https://github.com/dbt-labs/dbt-core/pull/12743), and [#12745](https://github.com/dbt-labs/dbt-core/pull/12745).

## Releases
No new releases were published in the last 24 hours.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-30

## 1. Today’s Highlights
Spark saw no new releases today, but repository activity points to meaningful momentum in three areas: Spark History Server scalability, Spark Connect reliability, and SQL/connector ergonomics. The most notable PRs focus on reducing SHS scan/load overhead, upgrading gRPC/Netty to address Spark Connect transport failures, and tightening SQL/DataSource V2 behavior and documentation.

## 2. Hot Issues

> Note: Only 3 issues were updated in the last 24 hours from the provided dataset, so this section includes all currently active noteworthy items available.

### 1) spark-connect-common module compile error
- [Issue #55082](https://github.com/apache/spark/issues/55082)
- **Why it matters:** A compile failure in `spark-connect-common` blocks contributors and downstream builders working with Spark 4.1.1, especially around generated protobuf classes and Connect build setup.
- **What’s happening:** The report suggests confusion around how required proto-generated classes are produced, which may indicate a build-doc gap or packaging inconsistency.
- **Community reaction:** Early-stage triage only, but this is the kind of issue that quickly affects adoption if reproducible.

### 2) [DOCS] Document return types for aggregate functions
- [Issue #54986](https://github.com/apache/spark/issues/54986)
- **Why it matters:** PySpark users rely heavily on API docs for schema expectations; undocumented return types for `stddev`, `variance`, and related functions can lead to subtle downstream type assumptions and test failures.
- **What’s happening:** The issue points out that several aggregate functions appear to always return `DoubleType`, regardless of input type.
- **Community reaction:** Low-comment but high practical value; this is exactly the kind of documentation fix that improves day-to-day developer productivity.

### 3) Support mapUnsignedTinyIntToShort
- [Issue #55076](https://github.com/apache/spark/issues/55076)
- **Why it matters:** MySQL federation and JDBC interoperability remain critical for Spark SQL users. Incorrect mapping of `TINYINT UNSIGNED` can produce out-of-range failures in real deployments.
- **What’s happening:** The issue requests support for mapping unsigned tinyint to `ShortType`, aligning Spark behavior with operational expectations in federated query scenarios.
- **Community reaction:** Small but targeted discussion; important for connector compatibility and reduced surprise in mixed database environments.

## 3. Key PR Progress

### 1) Disable SHS log directory scanning by path pattern
- [PR #55029](https://github.com/apache/spark/pull/55029)
- **Area:** Core / Spark History Server
- **What it does:** Adds `spark.history.fs.update.scanDisabledPathPatterns` so SHS can skip scanning selected log paths by regex.
- **Why it matters:** Large shared storage backends can make SHS directory scans expensive. This is a practical operator-facing scalability control.

### 2) Populate accurate metadata immediately during on-demand SHS loading
- [PR #55086](https://github.com/apache/spark/pull/55086)
- **Area:** Core / Spark History Server
- **What it does:** Improves on-demand loading so SHS records accurate application metadata immediately instead of placeholder entries.
- **Why it matters:** Better metadata consistency should improve UI correctness and reduce operational confusion during deferred loading.

### 3) Reuse metadata plans for Spark Connect Python DataFrames
- [PR #54939](https://github.com/apache/spark/pull/54939)
- **Area:** Python / Connect
- **Status:** Closed
- **What it does:** Reuses metadata plans internally in Connect’s Python DataFrame implementation.
- **Why it matters:** Even as an internal cleanup, this points toward lower plan duplication and more efficient Connect-side behavior.

### 4) Add `ActiveProcessorCount` JVM option to YARN executor and AM
- [PR #51948](https://github.com/apache/spark/pull/51948)
- **Area:** YARN / Core
- **What it does:** Limits JVM CPU visibility on YARN to match Spark-configured resources.
- **Why it matters:** Prevents JVM subsystems like GC and thread pools from over-sizing based on full-node cores, improving resource isolation and predictability.

### 5) Upgrade gRPC and Netty to fix Spark Connect mid-frame failures
- [PR #55081](https://github.com/apache/spark/pull/55081)
- **Area:** Build / Connect
- **What it does:** Upgrades gRPC to 1.76.0 and Netty to 4.1.124 on branch 4.0.
- **Why it matters:** Targets intermittent `"Encountered end-of-stream mid-frame"` errors during complex Spark Connect operations. This is a high-impact reliability fix for remote execution users.

### 6) Replace legacy error codes with named errors in DSv2 connector API
- [PR #54971](https://github.com/apache/spark/pull/54971)
- **Area:** SQL / Data Source V2
- **What it does:** Replaces temporary legacy error codes with named, descriptive error conditions across DSv2 connector interfaces.
- **Why it matters:** Better error semantics improve connector development, troubleshooting, and long-term API maintainability.

### 7) Support v2 `DESCRIBE TABLE .. PARTITION`
- [PR #55064](https://github.com/apache/spark/pull/55064)
- **Area:** SQL
- **What it does:** Extends v2 table support for partition-aware `DESCRIBE TABLE`.
- **Why it matters:** Closes SQL feature gaps between catalog/table implementations and improves consistency for modern table providers.

### 8) Add language-agnostic UDF IPC protocol, phase 1
- [PR #55084](https://github.com/apache/spark/pull/55084)
- **Area:** Connect / SQL
- **What it does:** Defines the initial gRPC + Arrow IPC protocol for executing UDFs written in arbitrary languages.
- **Why it matters:** This is strategically important. It could broaden Spark’s UDF ecosystem beyond Python/JVM-centric workflows toward Go, Rust, and other runtimes.

### 9) Document return types for aggregate functions
- [PR #55083](https://github.com/apache/spark/pull/55083)
- **Area:** Docs / PySpark
- **What it does:** Adds doc notes for aggregate return types such as `stddev`, `variance`, and related functions.
- **Why it matters:** Directly addresses issue #54986 and reduces ambiguity in schema reasoning for PySpark users.

### 10) Add legacy config for MySQL unsigned `TINYINT` mapping
- [PR #55080](https://github.com/apache/spark/pull/55080)
- **Area:** SQL / JDBC
- **What it does:** Introduces `spark.sql.legacy.mysql.unsignedTinyIntMapping.enabled` to control whether MySQL unsigned tinyint maps to `ShortType`.
- **Why it matters:** Gives users an explicit compatibility lever for federated MySQL workloads without forcing a one-size-fits-all behavior.

## 4. Feature Request Trends

### Spark History Server scalability and operability
Recent PRs show a clear push to make SHS more efficient in large environments:
- selective scan disabling by path pattern
- better on-demand metadata population

This suggests operators are feeling pressure from ever-larger event log estates and want more control over SHS cost and responsiveness.

### Spark Connect maturity and transport stability
Connect remains a major investment area:
- build/compile pain in `spark-connect-common`
- gRPC/Netty upgrade for transport errors
- internal metadata plan reuse
- language-agnostic UDF protocol work

The pattern is clear: Spark Connect is moving from early feature expansion toward hardening, ecosystem extension, and production-readiness.

### SQL/DataSource V2 parity and usability
There is continued demand for:
- v2 command parity like `DESCRIBE TABLE .. PARTITION`
- structured output formats like `SHOW TABLES ... AS JSON`
- clearer DSv2 error reporting

This reflects ongoing adoption of modern catalogs and table formats, where consistent SQL semantics matter.

### JDBC/type compatibility with external systems
The MySQL unsigned tinyint request highlights a recurring integration theme: Spark users want safer, more explicit type mappings when interacting with external databases, especially in federated and JDBC-heavy environments.

### Documentation as a product feature
The aggregate return type issue and corresponding docs PR reinforce that API docs quality remains a real usability concern, particularly for PySpark where dynamic typing increases the value of precise docs.

## 5. Developer Pain Points

### Build and generated-code friction in Spark Connect
The compile error in `spark-connect-common` suggests contributors still face nontrivial setup friction around protobuf/code generation. That hurts both first-time contributors and teams trying to patch or embed Spark Connect components.

### Unclear type behavior in APIs and connectors
Two separate threads point to this:
- undocumented aggregate return types in PySpark
- surprising unsigned MySQL tinyint mappings

Developers want type behavior to be both predictable and documented, especially where silent coercion or overflow risks exist.

### Operational overhead in the History Server
The SHS PRs indicate that scanning and metadata freshness are still pain points at scale. Operators need better ways to constrain background work and preserve UI accuracy.

### Reliability issues in remote execution paths
The gRPC/Netty upgrade proposal shows that Spark Connect users are still encountering transport-layer instability under complex schemas or larger payloads. This remains a meaningful blocker for production trust.

### SQL and catalog consistency gaps
Ongoing work on DSv2 errors, v2 `DESCRIBE TABLE`, and JSON output for metadata commands shows users continue to hit rough edges when moving from legacy Spark SQL semantics to newer catalog/table abstractions.

If you'd like, I can also turn this into:
1. a shorter Slack-style digest, or
2. a more opinionated analyst brief with ecosystem implications.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

# Substrait Community Digest — 2026-03-30

## 1. Today's Highlights
Substrait published a new release, **[v0.87.0](https://github.com/substrait-io/substrait/releases/tag/v0.87.0)**, extending the standard function set with `std_dev` and `variance` support via a distribution enum argument. This is a meaningful step for analytical engine interoperability, especially for systems that need portable statistical aggregate semantics.

On the contribution side, the main active change is **[PR #1009](https://github.com/substrait-io/substrait/pull/1009)**, which proposes adding a physical `TopNRel` operator with `WITH TIES` support, helping close a modeling gap between the physical relations documentation and protobuf definitions.

## 2. Releases
### [v0.87.0](https://github.com/substrait-io/substrait/releases/tag/v0.87.0)
Released on 2026-03-29.

**What changed**
- Added statistical aggregate extensions for **`std_dev`** and **`variance`**
- Introduced a **distribution enum argument**, likely to distinguish semantics such as population vs. sample variants

**Why it matters**
This improves portability for analytical workloads across engines implementing Substrait extensions. Statistical aggregates are common in OLAP pipelines, and standardizing their signatures reduces ambiguity in query exchange and execution planning.

## 3. Hot Issues
No issues were updated in the last 24 hours.

Given the source data, there are **no currently active “hot issues”** to highlight for today. This suggests a relatively quiet issue queue in the most recent window, with activity concentrated instead in release work and open pull request discussion.

## 4. Key PR Progress
Only one pull request was updated in the last 24 hours.

### [PR #1009](https://github.com/substrait-io/substrait/pull/1009) — feat: add TopNRel physical operator with WITH TIES support
**Status:** Open  
**Author:** @jcamachor

**What it does**
- Adds a new **`TopNRel`** message to `algebra.proto`
- Models Top-N as a dedicated **physical relation**
- Combines **sort + fetch** into a single operator
- Supports:
  - sort fields via existing `SortField`
  - offset
  - count/fetch semantics
  - `WITH TIES`

**Why it matters**
This is an important physical-planning enhancement for execution engines and exchange formats. Top-N is a common optimization pattern in distributed SQL and analytical engines, and making it explicit in protobuf improves fidelity between documented semantics and serialized plans.

**Current community signal**
- Recently updated on 2026-03-29
- No visible reaction count yet in the provided data
- Noteworthy because it closes a known specification/protobuf mismatch rather than adding a purely optional extension

## 5. Feature Request Trends
Based on the limited activity in this window, the strongest visible feature direction is:

- **Richer analytical function standardization**
  - The `v0.87.0` release adds statistical aggregates (`std_dev`, `variance`)
  - This points to continued demand for broader, more precise aggregate and math function coverage in the standard

- **More complete physical operator modeling**
  - [PR #1009](https://github.com/substrait-io/substrait/pull/1009) shows momentum toward filling gaps in physical plan representation
  - Features like explicit `TopNRel` indicate implementers want less ambiguity when exchanging optimized physical plans

Overall, the current trend is toward **deeper execution fidelity** and **broader analytical semantics**, both of which are critical for cross-engine interoperability.

## 6. Developer Pain Points
From today’s activity, two likely developer pain points stand out:

- **Spec-to-protobuf gaps**
  - The `TopNRel` PR exists because the physical Top-N concept is documented, but not fully represented in protobuf
  - These mismatches create friction for engine implementers trying to serialize plans consistently

- **Ambiguity in aggregate semantics**
  - The addition of `std_dev` and `variance` with a distribution enum suggests prior uncertainty around how these aggregates should be expressed portably
  - Developers integrating Substrait need precise function signatures to avoid incompatibilities across runtimes

In short, the ecosystem continues to prioritize **clearer formalization of execution operators** and **less ambiguous analytical function definitions**.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*