# OLAP & Data Infra Open Source Trends 2026-03-27

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-27 01:27 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report  
**Date:** 2026-03-27

## Step 1 — Filtered for OLAP / Data Infrastructure Relevance

### Relevant from Today’s Trending
Only **1** repository from today’s general trending list is clearly data/analytics adjacent:

- [datalab-to/chandra](https://github.com/datalab-to/chandra) — OCR for complex tables/forms; relevant as a **data extraction / ingestion** tool

All other trending repos are primarily AI agents, coding tools, CRM, speech, or sensing projects and are **not core OLAP/data-infra**.

### Relevant from Topic Search
The topic search results contain the meaningful OLAP / lakehouse / query / analytics infrastructure set, including:
- Analytical databases and engines: ClickHouse, DuckDB, Doris, StarRocks, QuestDB, OceanBase, CrateDB, Cloudberry, Databend
- Lakehouse/catalog/storage layer projects: LakeSoul, Apache Polaris, Apache Gravitino, Apache Fluss, Lakekeeper, OLake
- Query/compute engines: Trino, Presto, DataFusion, Ballista, chDB, DuckDB-Wasm, go-mysql-server
- Data integration / ETL / observability / BI tooling: dlt, Rudder Server, Elementary, Superset, Metabase, Cube, ClickBench, Hue, Chandra

---

## 1. Today’s Highlights

Today’s strongest signal is that **core OLAP infrastructure remains centered on mature engines**, not brand-new GitHub-trending breakouts: [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), and [Trino](https://github.com/trinodb/trino) continue to anchor attention across analytics and lakehouse workloads.  
The one directly relevant repo on today’s hot trending list is [Chandra](https://github.com/datalab-to/chandra), which points to growing interest in **turning messy documents and tables into analyzable structured data**—an upstream trend feeding analytics systems.  
Another major signal is the continued convergence of **lakehouse metadata/catalog layers** with analytics engines, visible in [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and ingestion tools such as [OLake](https://github.com/datazip-inc/olake).  
Overall, the ecosystem is reinforcing three themes: **real-time analytics**, **open lakehouse interoperability**, and **embedded/in-process analytics**.

---

## 2. Top Projects by Category

## 🗄️ OLAP Engines

- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,556  
  Real-time analytical DBMS and still one of the strongest open-source benchmarks for high-performance OLAP at scale.

- [DuckDB](https://github.com/duckdb/duckdb) — ⭐36,972  
  In-process analytical database that continues to define the embedded OLAP category for local, notebook, and application analytics.

- [Apache Doris](https://github.com/apache/doris) — ⭐15,157  
  Unified analytics database emphasizing easy operations and strong performance across real-time and interactive analytic workloads.

- [StarRocks](https://github.com/StarRocks/starrocks) — ⭐11,514  
  High-speed open analytics engine positioned strongly for sub-second queries on both internal storage and lakehouse data.

- [Databend](https://github.com/databendlabs/databend) — ⭐9,205  
  Cloud-native warehouse/lakehouse engine with a modern architecture around object storage and increasingly AI-adjacent positioning.

- [QuestDB](https://github.com/questdb/questdb) — ⭐16,789  
  Time-series-focused analytical database worth watching as observability and real-time analytics continue to merge.

- [Apache Cloudberry](https://github.com/apache/cloudberry) — ⭐1,195  
  Mature open MPP database lineage gives it relevance for teams seeking warehouse-style scale-out systems.

- [Mooncake pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) — ⭐1,945  
  Brings real-time analytics to Postgres tables, reflecting the ongoing “OLAP close to operational data” trend.

---

## 📦 Storage Formats & Lakehouse

- [LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,226  
  End-to-end real-time lakehouse framework focused on ingestion, concurrent updates, and incremental analytics.

- [Apache Polaris](https://github.com/apache/polaris) — ⭐1,886  
  Open catalog for Apache Iceberg and a key signal of continued investment in interoperable lakehouse control planes.

- [Apache Gravitino](https://github.com/apache/gravitino) — ⭐2,926  
  Federated metadata catalog targeting multi-region, multi-engine data management—important for open lakehouse governance.

- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,227  
  Rust-based Iceberg REST catalog that stands out for lightweight, modern implementation in the catalog layer.

- [Apache Fluss](https://github.com/apache/fluss) — ⭐1,832  
  Streaming storage for real-time analytics, showing how storage layers are becoming more event-native.

- [OLake](https://github.com/datazip-inc/olake) — ⭐1,313  
  Replication pipeline to Iceberg or Parquet, directly tying ingestion workflows to lakehouse table/storage standards.

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐703  
  Emerging columnar file format effort worth noting as storage efficiency and AI/analytics interoperability evolve.

---

## ⚙️ Query & Compute

- [Trino](https://github.com/trinodb/trino) — ⭐12,665  
  Leading distributed SQL query engine for federated analytics, still central in open lakehouse query stacks.

- [Presto](https://github.com/prestodb/presto) — ⭐16,667  
  Foundational distributed SQL engine whose continued activity keeps it relevant in large enterprise deployments.

- [Apache DataFusion](https://github.com/apache/datafusion) — ⭐8,539  
  Rust query engine becoming increasingly strategic as a composable execution layer for modern data systems.

- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — ⭐2,000  
  Distributed execution counterpart to DataFusion, important for the modular query-engine movement.

- [chDB](https://github.com/chdb-io/chdb) — ⭐2,644  
  In-process OLAP SQL engine powered by ClickHouse, notable for embedded analytics and local compute use cases.

- [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,950  
  Browser-side analytical execution highlights the growth of client-side and serverless data applications.

- [go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,619  
  Storage-agnostic SQL engine useful as a building block for custom data platforms and developer-facing query services.

- [Firebolt Core](https://github.com/firebolt-db/firebolt-core) — ⭐195  
  Self-hosted distributed query engine from a commercial warehouse lineage, interesting as cloud warehouse ideas move open-source.

---

## 🔗 Data Integration & ETL

- [Chandra](https://github.com/datalab-to/chandra) — ⭐0 (**+557 today**)  
  OCR for complex tables/forms/handwriting; noteworthy today because document extraction is becoming a critical ingestion path for analytics systems.

- [dlt](https://github.com/dlt-hub/dlt) — ⭐5,125  
  Python-native loading framework lowering the barrier to building reliable ingestion into warehouses and lakehouses.

- [Rudder Server](https://github.com/rudderlabs/rudder-server) — ⭐4,379  
  Event pipeline / Segment alternative relevant for product analytics and warehouse-native customer data flows.

- [Multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,644  
  Reverse ETL tool signaling continued interest in activating warehouse data back into business systems.

- [OLake](https://github.com/datazip-inc/olake) — ⭐1,313  
  High-speed replication from databases, Kafka, and S3 into Iceberg/Parquet for real-time analytics.

- [Dinky](https://github.com/DataLinkDC/dinky) — ⭐3,713  
  Flink-based real-time data development platform, relevant where streaming engineering and analytics converge.

---

## 🧰 Data Tooling

- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐975  
  Important benchmark suite for comparing analytical databases; useful as engine competition intensifies.

- [Apache Superset](https://github.com/apache/superset) — ⭐71,154  
  Open data exploration and BI platform that remains a default interface layer for many OLAP backends.

- [Metabase](https://github.com/metabase/metabase) — ⭐46,584  
  Easy-to-adopt BI tool that continues to expand open analytics access for broader internal users.

- [Cube](https://github.com/cube-js/cube) — ⭐19,708  
  Semantic layer for BI and embedded analytics, increasingly important as metric consistency and AI access converge.

- [Elementary](https://github.com/elementary-data/elementary) — ⭐2,288  
  dbt-native observability tool reflecting sustained demand for data quality and pipeline monitoring.

- [Hue](https://github.com/cloudera/hue) — ⭐1,451  
  SQL assistant and data warehouse interface layer still relevant for multi-engine enterprise environments.

- [ROAPI](https://github.com/roapi/roapi) — ⭐3,416  
  Exposes APIs over static/slow-moving datasets, useful for lightweight analytical serving patterns.

---

## 3. Trend Signal Analysis

The strongest community signal is continued momentum around **open analytics engines that sit directly on modern storage layers**. Rather than a single breakout repo dominating today’s trending feed, attention is distributed across a stable set of infrastructure projects: [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), [Trino](https://github.com/trinodb/trino), and [Apache DataFusion](https://github.com/apache/datafusion). This suggests the market is in a consolidation phase where execution quality, interoperability, and deployment flexibility matter more than novelty alone.

A notable directional signal is the rise of **catalog- and metadata-centric lakehouse infrastructure**. Projects like [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper) indicate that open table formats are no longer enough; governance, federation, and interoperable control planes are becoming first-class battlegrounds.

On the compute side, **composable Rust-based query layers** keep gaining importance. [Apache DataFusion](https://github.com/apache/datafusion) and related projects show a broader shift toward reusable execution kernels, embedded SQL, and custom analytic systems built from modular components rather than monolithic warehouses.

The clearest “new-ish” upstream signal from today’s hot list is [Chandra](https://github.com/datalab-to/chandra): extracting structured data from visually messy documents. That aligns with recent lakehouse and cloud-warehouse evolution, where the boundary between ingestion, AI-assisted parsing, and analytics is collapsing. In practice, the next growth wave likely combines **real-time ingestion + open table formats + flexible execution + semantic/BI layers** into unified stacks.

---

## 4. Community Hot Spots

- **[Apache Polaris](https://github.com/apache/polaris) / [Lakekeeper](https://github.com/lakekeeper/lakekeeper) / [Apache Gravitino](https://github.com/apache/gravitino)**  
  Catalog and metadata interoperability is becoming foundational for serious Iceberg/lakehouse adoption.

- **[Apache DataFusion](https://github.com/apache/datafusion) and the Rust analytics stack**  
  DataFusion is emerging as a key execution substrate for next-generation query engines, semantic layers, and embedded analytics services.

- **[DuckDB](https://github.com/duckdb/duckdb) + [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm) + [chDB](https://github.com/chdb-io/chdb)**  
  Embedded and client-side OLAP continues to expand, enabling analytics inside apps, notebooks, edge runtimes, and browsers.

- **[StarRocks](https://github.com/StarRocks/starrocks), [Apache Doris](https://github.com/apache/doris), and [ClickHouse](https://github.com/ClickHouse/ClickHouse)**  
  These remain the most important open-source engines to watch for real-time, sub-second, and lakehouse-connected analytics workloads.

- **[Chandra](https://github.com/datalab-to/chandra) and document-to-table ingestion**  
  Data engineers should watch this area because unstructured business documents are increasingly being pulled directly into analytical pipelines.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*