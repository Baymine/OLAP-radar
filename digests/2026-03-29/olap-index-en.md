# OLAP Ecosystem Index Digest 2026-03-29

> Generated: 2026-03-29 01:43 UTC | Projects covered: 3

- [dbt-core](https://github.com/dbt-labs/dbt-core)
- [Apache Spark](https://github.com/apache/spark)
- [Substrait](https://github.com/substrait-io/substrait)

---

## Cross-Project Comparison

# Cross-Project OLAP Ecosystem Comparison Report  
**Date:** 2026-03-29

## 1. Ecosystem Overview

The current OLAP data infrastructure landscape shows active investment in both **developer ergonomics** and **production-grade platform completeness**. Across dbt-core and Apache Spark, maintainers and contributors are focusing less on headline releases and more on removing friction in day-to-day workflows: better diagnostics, richer SQL support, stronger metadata semantics, and improved operational tooling. Spark activity is broader and heavier, reflecting its role as a full execution engine, while dbt-core’s activity is more targeted around analytics engineering productivity and warehouse integration. Substrait showed no activity in the provided window, suggesting a quieter day rather than a directional change, but it also highlights that momentum is currently concentrated in execution and transformation-layer projects.

## 2. Activity Comparison

| Project | Updated Issues Today | Updated PRs Today | Release Status Today | Main Focus of Activity |
|---|---:|---:|---|---|
| **dbt-core** | 1 | 4 | No release activity noted | Error diagnostics, docs parsing, Snowflake grants support |
| **Apache Spark** | 2 | 10 | No release activity noted | SQL feature expansion, DSv2/catalog work, UI scalability, CI hardening |
| **Substrait** | 0 | 0 | No activity | No activity in the last 24 hours |

## 3. Shared Feature Directions

Several ecosystem requirements appear across multiple communities, though they show up at different layers of the stack.

### A. Better developer feedback and usability
- **dbt-core:** PRs improving missing env var errors and macro/Jinja compilation error context.
- **Spark:** Documentation improvements, SQL UI enhancements, and History Server fixes improve operator and developer experience.
- **Shared need:** Faster root-cause analysis and lower debugging cost in complex data workflows.

### B. Stronger compatibility with modern analytical SQL and warehouse patterns
- **Spark:** `QUALIFY`, `TABLESAMPLE SYSTEM`, V2 view creation, and richer `DESCRIBE TABLE` semantics.
- **dbt-core:** Snowflake database-role support in `grants`, reflecting demand for better alignment with warehouse-native governance models.
- **Shared need:** Reduce impedance mismatch between OSS tooling and cloud warehouse expectations.

### C. Metadata/modeling completeness for production environments
- **Spark:** Continued DSv2 and catalog completeness work.
- **dbt-core:** Better docs file extension support and grants support requests show pressure to support real-world project structures and governance practices.
- **Shared need:** Make the platform abstractions complete enough that teams do not need custom workarounds.

### D. Enterprise-scale operability
- **Spark:** SQL tab pagination, SHS fixes, CI security hardening.
- **dbt-core:** CI efficiency improvements via test duration updates.
- **Shared need:** Mature tooling must scale not only in execution but also in maintainability, observability, and contributor workflow.

## 4. Differentiation Analysis

### dbt-core
- **Scope:** Transformation orchestration, modeling, documentation, and warehouse-facing analytics engineering workflows.
- **Target users:** Analytics engineers, BI/data platform teams, governance-conscious warehouse users.
- **Technical approach:** Declarative project/model framework layered on top of warehouses; emphasizes compilation, developer experience, and adapter-driven warehouse integration.
- **Current differentiation:** Focused on usability and governance alignment rather than engine-level execution features.

### Apache Spark
- **Scope:** Distributed compute engine spanning SQL execution, query planning, catalogs, connectors, UI, and infrastructure.
- **Target users:** Data engineers, platform teams, large-scale processing teams, engine integrators.
- **Technical approach:** Execution-engine-centric, with ongoing expansion of SQL dialect support and DSv2/catalyst/catalog capabilities.
- **Current differentiation:** Much broader technical surface area and stronger emphasis on engine semantics, execution behavior, and operational scale.

### Substrait
- **Scope:** Cross-system query plan interoperability standard.
- **Target users:** Engine builders, connector authors, interoperability-focused platform teams.
- **Technical approach:** Standard/specification layer rather than end-user runtime or modeling framework.
- **Current differentiation:** Strategic ecosystem role, but no visible short-term signal in this 24-hour window.

## 5. Community Momentum & Maturity

**Apache Spark** shows the strongest day-level momentum in the provided data, with **2 updated issues and 10 updated PRs** spanning SQL syntax, metadata systems, UI, and CI security. This breadth suggests a large, mature community with multiple parallel workstreams and sustained contributor throughput.

**dbt-core** has lighter absolute activity (**1 updated issue, 4 updated PRs**) but a clear and coherent direction. The work is tightly aligned with known user pain points—debuggability and warehouse-native permissions—which is often a sign of a mature product refining high-friction edges rather than chasing speculative features.

**Substrait** had no visible activity in this window, so it cannot be assessed as active on a daily basis from this snapshot alone. Relative to Spark and dbt-core, it appears less visibly iterative in the short term, though that may reflect the cadence typical of standards-oriented projects.

## 6. Trend Signals

1. **SQL engines are converging toward warehouse-style ergonomics.**  
   Spark’s `QUALIFY` work and related SQL enhancements indicate that users increasingly expect portable analytical SQL across engines, not just basic ANSI compliance.

2. **Governance integration is becoming a first-class requirement.**  
   dbt-core’s Snowflake database-role request shows that security and access-control semantics are now part of core platform evaluation, especially for enterprise deployments.

3. **Developer experience is now infrastructure work, not polish.**  
   Better error context in dbt and UI/observability improvements in Spark both point to the same lesson: teams value faster debugging and clearer feedback as highly as net-new features.

4. **Metadata and catalog completeness remain strategic battlegrounds.**  
   Spark’s DSv2 work and dbt’s friction around grants/docs/project conventions both reinforce that modern data platforms are judged on how completely they model real production environments.

5. **Operational trust and supply-chain hygiene are rising in importance.**  
   Spark’s GitHub Actions SHA pinning is a signal that build security and reproducibility are becoming expected practices in mature data infrastructure projects.

## Bottom Line for Data Engineers

- **Choose Spark** when engine capability, SQL surface expansion, catalog evolution, and operational scale are primary concerns.
- **Choose dbt-core** when analytics engineering productivity, warehouse-centric modeling, and governance-aware transformation workflows are the priority.
- **Watch Substrait** for long-term interoperability value, but there is no immediate momentum signal from today’s data.

If you want, I can also convert this into:
- a **1-page executive brief**,
- a **Slack-friendly summary table**, or
- a **weekly trend memo with investment/architecture implications**.

---

## Per-Project Reports

<details>
<summary><strong>dbt-core</strong> — <a href="https://github.com/dbt-labs/dbt-core">dbt-labs/dbt-core</a></summary>

## Today's Highlights

dbt-core activity over the last 24 hours was concentrated on developer experience improvements rather than releases. Two new community PRs aim to make parsing and compilation failures much easier to debug by adding file or node context to error messages, while one recently closed PR expands docs parsing to support common Jinja-style file extensions.  

On the issues side, the main active request is continued demand for stronger Snowflake grants support—specifically database roles—which signals ongoing pressure to deepen warehouse-native security integrations.

## Hot Issues

> Note: Only 1 issue was updated in the provided GitHub data during the last 24 hours.

1. **[Issue #10587](https://github.com/dbt-labs/dbt-core/issues/10587) — [Feature] Support Snowflake Database Roles in grants**  
   This enhancement request asks dbt-core to support Snowflake **database roles** within the `grants` config. That matters because Snowflake customers increasingly rely on database roles for least-privilege access control and modern governance patterns, and lack of support creates friction between dbt model deployment and native security administration.  
   Community reaction is modest but meaningful: **6 👍 reactions** and ongoing discussion indicate this is a real need for Snowflake-heavy teams, especially enterprises standardizing on warehouse-native RBAC.

## Key PR Progress

> Note: Only 4 PRs were updated in the provided GitHub data during the last 24 hours.

1. **[PR #12726](https://github.com/dbt-labs/dbt-core/pull/12726) — fix: include node context in env var missing error messages**  
   A usability-focused fix that improves `env_var()` error reporting by showing which node/file triggered a missing environment variable failure. This is valuable for large projects where searching for `DBT_*` references across many models, seeds, and configs can be time-consuming.  
   If merged, this should reduce parse-time debugging overhead and improve CI triage.

2. **[PR #12724](https://github.com/dbt-labs/dbt-core/pull/12724) — fix: include macro filename in compilation error messages**  
   This PR improves compilation errors for Jinja syntax problems by surfacing the **macro filename** responsible. That is a high-leverage change for package authors and advanced dbt users with large macro libraries, where current line-only errors can be difficult to trace.  
   It’s another strong signal that contributor effort is going into better diagnostics and faster root-cause analysis.

3. **[PR #12653](https://github.com/dbt-labs/dbt-core/pull/12653) — feat: support .jinja/.jinja2/.j2 extensions for docs files**  
   Recently closed, this feature adds support for `.jinja`, `.jinja2`, and `.j2` file extensions for docs markdown sources. This aligns dbt better with common editor and templating workflows, especially for teams that maintain richly templated documentation outside pure `.md` conventions.  
   The practical benefit is smoother docs authoring without forcing file renames or inconsistent IDE behavior.

4. **[PR #12725](https://github.com/dbt-labs/dbt-core/pull/12725) — Update test durations for pytest-split**  
   This bot-authored maintenance PR refreshes test timing metadata used by `pytest-split`. While not user-facing, it helps keep CI parallelization balanced and efficient, which can shorten feedback loops for contributors and maintainers.  
   Faster, more predictable test execution indirectly improves project throughput.

## Feature Request Trends

Based on the latest issue activity, the clearest feature direction is:

- **Deeper warehouse-native permissions support**, especially for **Snowflake database roles**.  
  Users want dbt grants management to reflect modern security models used in production warehouses, reducing the need for custom post-hooks, manual SQL, or out-of-band role administration.

A secondary trend visible from PR activity rather than issues is:

- **Better error observability and context-rich diagnostics**.  
  Contributors are actively improving error messages so users can identify the failing file, macro, or node faster. This suggests that reliability of developer feedback remains a priority area for the community.

## Developer Pain Points

Several recurring frustrations are evident from the current issue and PR set:

- **Insufficient error context during parsing and compilation**  
  Missing environment variables and Jinja syntax problems can be hard to trace in large dbt repositories. The new PRs explicitly target this pain by attaching file/node context to failures.  
  Relevant PRs: [#12726](https://github.com/dbt-labs/dbt-core/pull/12726), [#12724](https://github.com/dbt-labs/dbt-core/pull/12724)

- **Gaps between dbt abstractions and warehouse-specific security models**  
  The Snowflake database roles issue highlights a broader challenge: teams expect dbt to map more completely onto platform-native governance and permission constructs.  
  Relevant issue: [#10587](https://github.com/dbt-labs/dbt-core/issues/10587)

- **Documentation workflows constrained by file-extension assumptions**  
  The recently closed docs extension PR suggests users have felt friction when working with Jinja-templated docs in IDEs or mixed documentation pipelines.  
  Relevant PR: [#12653](https://github.com/dbt-labs/dbt-core/pull/12653)

If you'd like, I can also reformat this into a shorter Slack-style daily update or a more executive weekly digest format.

</details>

<details>
<summary><strong>Apache Spark</strong> — <a href="https://github.com/apache/spark">apache/spark</a></summary>

# Apache Spark Community Digest — 2026-03-29

## 1. Today's Highlights

Spark SQL is the clear center of gravity today, with fresh activity around long-requested SQL ergonomics such as `QUALIFY`, DSv2 metadata support, sampling semantics, and V2 view creation. In parallel, the project is seeing a meaningful stream of UI and infrastructure work, including SQL tab scalability improvements, Spark History Server fixes, and CI hardening through GitHub Actions pinning.

A notable pattern is that user demand and contributor action are aligning: a new issue requesting `QUALIFY` support appeared at almost the same time as an open implementation PR, suggesting strong momentum toward better cross-engine SQL compatibility.

## 2. Hot Issues

Only 2 issues were updated in the last 24 hours, so this section covers all noteworthy issue activity available today.

1. **Feature Request: Add support for qualify clause in SQL**  
   [#55052](https://github.com/apache/spark/issues/55052)  
   Why it matters: `QUALIFY` is a high-value SQL usability feature for filtering on window function results without wrapping queries in subqueries. It improves portability for users coming from Databricks, Snowflake, and BigQuery-style SQL workflows.  
   Community reaction: Early discussion is still light, but the request is timely because there is already an active implementation PR, indicating practical interest rather than purely speculative demand.

2. **Support mapUnsignedTinyIntToShort**  
   [#55076](https://github.com/apache/spark/issues/55076)  
   Why it matters: This points to a federated-query interoperability gap, specifically around MySQL `TINYINT` unsigned handling and type coercion. These JDBC edge cases matter a lot in production because they surface as runtime failures rather than planner-time warnings.  
   Community reaction: No comments yet, but the issue is grounded in a concrete failure mode and references an external knowledge-base article, which usually helps accelerate triage.

## 3. Key PR Progress

1. **Support `QUALIFY` clause in Spark SQL**  
   [#55074](https://github.com/apache/spark/pull/55074)  
   This is one of the most user-visible PRs in flight. It adds `QUALIFY` support, including pipe-operator syntax, reducing the need for nested subqueries when filtering window-function outputs and bringing Spark closer to mainstream analytical SQL dialects.

2. **Support v2 `DESCRIBE TABLE .. PARTITION`**  
   [#55064](https://github.com/apache/spark/pull/55064)  
   Important DSv2 metadata work. This improves partition introspection for V2 tables and helps close feature gaps between legacy and modern catalog/table APIs.

3. **Add `CREATE VIEW AS SELECT` for V2 `ViewCatalog`**  
   [#55042](https://github.com/apache/spark/pull/55042)  
   A strategic catalog feature. If merged, it would materially improve the completeness of the V2 SQL object model and make external catalog integrations more practical.

4. **Add `TABLESAMPLE SYSTEM` with DSv2 pushdown**  
   [#54972](https://github.com/apache/spark/pull/54972)  
   This is a substantial SQL optimizer and datasource integration enhancement. Block-level sampling can be much more efficient than row-level Bernoulli sampling, especially when connectors can push the operation down.

5. **Derive `outputOrdering` from `KeyedPartitioning` key expressions**  
   [#55036](https://github.com/apache/spark/pull/55036)  
   This is a planner/optimizer correctness and efficiency improvement. Exposing structural ordering guarantees can unlock better physical planning decisions and reduce unnecessary sorting.

6. **Add server-side pagination for SQL tab query listing**  
   [#55073](https://github.com/apache/spark/pull/55073)  
   A strong operational UI improvement. The SQL tab currently becomes unwieldy at scale if the frontend has to fetch and render all executions; server-side pagination should improve responsiveness for large deployments.

7. **Pin official GitHub Actions to commit SHA**  
   [#55063](https://github.com/apache/spark/pull/55063)  
   A meaningful infrastructure security hardening change. Pinning action versions reduces supply-chain risk and aligns Spark CI practices with current OSS security recommendations.

8. **Pin third-party GitHub Actions to commit SHA**  
   [#55066](https://github.com/apache/spark/pull/55066)  
   Complements the previous PR by extending SHA pinning to non-official actions. Together, these two PRs signal active attention to CI integrity and reproducibility.

9. **Document return type (`DoubleType`) for aggregate functions in PySpark**  
   [#55075](https://github.com/apache/spark/pull/55075)  
   Small but valuable documentation work. Return-type ambiguity in PySpark often leads to downstream schema surprises, so explicit docs reduce friction for API users.

10. **Recently merged UI fixes and enhancements**  
   - **Fix SHS application list table header/data column mismatch** — [#55062](https://github.com/apache/spark/pull/55062)  
   - **Add Job Timeline to SQL execution detail page** — [#55050](https://github.com/apache/spark/pull/55050)  
   These recently closed PRs improve observability and usability in Spark’s web UI and History Server. The Job Timeline is particularly useful for diagnosing SQL execution behavior at the job level.

## 4. Feature Request Trends

Based on today’s issue and PR flow, the strongest feature directions are:

- **Better analytical SQL parity**  
  `QUALIFY`, `TABLESAMPLE SYSTEM`, and richer describe/view semantics all point to a push for broader ANSI and warehouse-style SQL coverage. Spark users increasingly expect smooth portability from modern cloud data warehouse dialects.

- **DSv2 and catalog completeness**  
  Work on V2 `DESCRIBE TABLE .. PARTITION`, V2 view creation, and DSv2 pushdown signals continued investment in making DataSource V2 the default long-term abstraction for metadata and execution capabilities.

- **Improved interoperability with external systems**  
  The MySQL unsigned tinyint mapping issue reflects ongoing friction in federated access and JDBC type handling. Cross-system correctness remains a practical priority.

- **Operational scalability in the UI**  
  SQL tab pagination and recent SHS fixes show attention to what happens when Spark runs at real enterprise scale, where metadata volumes and execution histories can overwhelm browser-side rendering.

- **Security and build reproducibility in project infrastructure**  
  CI action pinning is not user-facing, but it reflects an ecosystem-wide trend toward more controlled, auditable build pipelines.

## 5. Developer Pain Points

Several recurring frustrations are visible in today’s activity:

- **SQL ergonomics still lag behind user expectations**  
  The `QUALIFY` request highlights a broader frustration: many common analytical SQL patterns still require extra nesting or workaround syntax in Spark compared with other engines.

- **Type mapping bugs in heterogeneous environments**  
  JDBC and federated-query users continue to hit painful edge cases around numeric types, signedness, and casting behavior. These issues are especially disruptive because they often appear only at runtime with external systems.

- **Metadata and object-management gaps in DSv2**  
  Users working with modern catalogs still encounter missing features around views, partition description, and richer object semantics, slowing migration away from older APIs.

- **Web UI performance and correctness at scale**  
  The need for SQL tab pagination and recent SHS table fixes suggests that UI components can still degrade or misbehave under large execution histories.

- **Long tail of stale contributions**  
  Several older PRs were closed as stale today, indicating that some potentially useful work is not making it through review or rebasing. For contributors, that can be discouraging and may slow feature delivery in less central areas.

If you want, I can also turn this into a **short-form Slack digest** or a **markdown newsletter version with cleaner link formatting**.

</details>

<details>
<summary><strong>Substrait</strong> — <a href="https://github.com/substrait-io/substrait">substrait-io/substrait</a></summary>

No activity in the last 24 hours.

</details>

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*