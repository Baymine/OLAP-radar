# OLAP & Data Infra Open Source Trends 2026-04-04

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-04-04 01:21 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report  
**Date:** 2026-04-04

## Step 1 — Filtered for OLAP / Data Infrastructure Relevance

From **today’s GitHub trending list**, only these are clearly relevant:
- [google-research/timesfm](https://github.com/google-research/timesfm) — time-series foundation model, relevant to analytics/time-series data workflows

Excluded as not primarily OLAP/data-infra:
- oh-my-codex, onyx, openscreen, fff.nvim, prompts.chat, sherlock

From the **topic search results**, I filtered in repositories clearly tied to analytics databases, lakehouse, query engines, ingestion, observability/BI, and related data tooling. I excluded obvious non-data or marginally relevant entries such as BIM visualization, shell utilities, generic “awesome” lists, spreadsheet libraries, and SAP sample-content repos.

---

## 1. Today's Highlights

The strongest pure data-related signal on today’s trending list is [TimesFM](https://github.com/google-research/timesfm), showing that **time-series intelligence and ML-native analytics** continue to attract broad attention beyond traditional OLAP engines. In the broader topic search, the ecosystem remains centered on **high-performance analytics databases and lakehouse infrastructure**, led by projects like [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Trino](https://github.com/trinodb/trino), [Apache Doris](https://github.com/apache/doris), and [StarRocks](https://github.com/StarRocks/starrocks).  

A notable pattern is the continued rise of **Rust-based data infrastructure**, especially in projects such as [Databend](https://github.com/databendlabs/databend), [Apache DataFusion](https://github.com/apache/datafusion), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake). Another clear trend is convergence: modern systems increasingly combine **analytics, search, streaming, vector capabilities, and AI-facing interfaces** rather than remaining single-purpose OLAP engines.

---

## 2. Top Projects by Category

## 🗄️ OLAP Engines

- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — **⭐46,686**
  - Real-time columnar analytics database and still one of the most important reference points for open-source OLAP performance and operational maturity.
- [DuckDB](https://github.com/duckdb/duckdb) — **⭐37,164**
  - In-process analytical SQL database that continues to shape the embedded OLAP and local analytics workflow model.
- [Apache Doris](https://github.com/apache/doris) — **⭐15,175**
  - Unified analytics database with strong momentum in real-time and interactive analytical workloads.
- [StarRocks](https://github.com/StarRocks/starrocks) — **⭐11,539**
  - High-speed query engine for lakehouse and multidimensional analytics, increasingly relevant in sub-second BI scenarios.
- [QuestDB](https://github.com/questdb/questdb) — **⭐16,823**
  - High-performance time-series OLAP database, notable as time-series remains a hot operational analytics segment.
- [OceanBase](https://github.com/oceanbase/oceanbase) — **⭐10,046**
  - Distributed database positioning itself across transactional, analytical, and AI workloads, reflecting HTAP convergence.
- [chDB](https://github.com/chdb-io/chdb) — **⭐2,653**
  - In-process OLAP engine powered by ClickHouse, worth watching as embedded analytics becomes more attractive.

## 📦 Storage Formats & Lakehouse

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — **⭐707**
  - New extensible file format for large columnar datasets, a noteworthy signal in the still-evolving storage-format layer.
- [Databend](https://github.com/databendlabs/databend) — **⭐9,226**
  - Cloud-native warehouse/lakehouse architecture on object storage with strong AI-facing positioning.
- [LakeSoul](https://github.com/lakesoul-io/LakeSoul) — **⭐3,227**
  - End-to-end real-time lakehouse framework focused on ingestion, updates, and incremental analytics.
- [Apache Gravitino](https://github.com/apache/gravitino) — **⭐2,933**
  - Federated metadata lake/catalog project, relevant as governance and multi-engine interoperability become core lakehouse concerns.
- [Apache Polaris](https://github.com/apache/polaris) — **⭐1,890**
  - Open Iceberg catalog project, important because the catalog layer is increasingly strategic in lakehouse architecture.
- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — **⭐1,239**
  - Rust-based Iceberg REST catalog emphasizing secure and lightweight catalog infrastructure.
- [Apache Fluss](https://github.com/apache/fluss) — **⭐1,841**
  - Streaming storage for real-time analytics, relevant to the merging of stream processing and analytical storage.

## ⚙️ Query & Compute

- [Trino](https://github.com/trinodb/trino) — **⭐12,688**
  - Leading distributed SQL query engine for federated analytics across diverse storage systems.
- [Presto](https://github.com/prestodb/presto) — **⭐16,677**
  - Still a foundational distributed SQL engine in the open analytics stack and highly relevant in multi-source querying.
- [Apache DataFusion](https://github.com/apache/datafusion) — **⭐8,557**
  - Rust-native SQL query engine with growing strategic importance as a reusable compute layer across projects.
- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — **⭐2,004**
  - Distributed execution layer for DataFusion, important for scaling Rust-based compute beyond embedded use.
- [go-mysql-server](https://github.com/dolthub/go-mysql-server) — **⭐2,622**
  - Storage-agnostic SQL query engine showing ongoing interest in modular query layers.
- [Firebolt Core](https://github.com/firebolt-db/firebolt-core) — **⭐196**
  - Self-hosted edition of Firebolt’s distributed query engine, notable as cloud warehouse tech becomes more open.
- [liquid-cache](https://github.com/XiangpengHao/liquid-cache) — **⭐396**
  - Pushdown cache for DataFusion, an interesting signal around performance optimization at the query-runtime layer.

## 🔗 Data Integration & ETL

- [OLake](https://github.com/datazip-inc/olake) — **⭐1,313**
  - Fast ingestion and replication from databases, Kafka, and S3 into Iceberg or Parquet for real-time analytics.
- [dlt](https://github.com/dlt-hub/dlt) — **⭐5,167**
  - Python-native data loading framework that continues to lower the operational cost of warehouse/lakehouse ingestion.
- [RudderStack Server](https://github.com/rudderlabs/rudder-server) — **⭐4,384**
  - Event/data pipeline infrastructure for warehouse-centric data movement with privacy emphasis.
- [Multiwoven](https://github.com/Multiwoven/multiwoven) — **⭐1,648**
  - Open-source reverse ETL, reflecting continued demand to operationalize warehouse data into downstream systems.
- [Transformalize](https://github.com/dalenewman/Transformalize) — **⭐161**
  - Configurable ETL framework, smaller but still representative of practical data movement tooling.

## 🧰 Data Tooling

- [Apache Superset](https://github.com/apache/superset) — **⭐72,207**
  - Leading open-source BI and exploration platform, still central to SQL-based analytics workflows.
- [Metabase](https://github.com/metabase/metabase) — **⭐46,733**
  - Widely adopted self-service BI tool, important for broadening access to warehouse and OLAP systems.
- [Grafana](https://github.com/grafana/grafana) — **⭐72,960**
  - Key observability and visualization layer that increasingly overlaps with operational analytics.
- [PostHog](https://github.com/PostHog/posthog) — **⭐32,367**
  - Product analytics platform expanding toward integrated warehouse and data platform capabilities.
- [Elementary](https://github.com/elementary-data/elementary) — **⭐2,296**
  - dbt-native observability tool, relevant as data quality and pipeline health remain top operational concerns.
- [ClickBench](https://github.com/ClickHouse/ClickBench) — **⭐981**
  - Benchmark suite for analytical databases, especially useful as performance claims across OLAP vendors intensify.
- [Hue](https://github.com/cloudera/hue) — **⭐1,445**
  - SQL assistant and warehouse UI layer, useful in multi-engine analytics environments.

---

## 3. Trend Signal Analysis

Today’s strongest community attention is not going to classic dashboards or ETL tools, but to **intelligence applied to analytical data**, especially time-series, as seen in [TimesFM](https://github.com/google-research/timesfm) with **+916 today**. While not an OLAP engine itself, its traction suggests the analytics ecosystem is moving from “store and query data” toward “model and reason over data” — particularly for forecasting, anomaly-aware planning, and operational analytics.

In the broader open-source data stack, the hottest sustained area remains **lakehouse-aligned analytical execution**: object-storage-native warehouses, federated query engines, and metadata/catalog layers. Projects such as [Databend](https://github.com/databendlabs/databend), [StarRocks](https://github.com/StarRocks/starrocks), [Apache Doris](https://github.com/apache/doris), [Apache Polaris](https://github.com/apache/polaris), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper) show that the ecosystem is still investing heavily in the control plane around open table architectures, especially Iceberg-oriented patterns.

A notable emerging direction is **new storage and execution substrates**. [facebookincubator/nimble](https://github.com/facebookincubator/nimble) stands out as a fresh signal around extensible columnar file formats, while [Apache DataFusion](https://github.com/apache/datafusion) and its surrounding ecosystem indicate increasing confidence in **Rust-based reusable compute kernels**. This aligns with recent lakehouse and cloud-warehouse evolution: the stack is becoming more modular, with storage, catalog, compute, ingestion, and AI/agent interfaces decoupling into interchangeable layers rather than monolithic platforms.

---

## 4. Community Hot Spots

- [google-research/timesfm](https://github.com/google-research/timesfm)  
  Time-series foundation models are becoming directly relevant to analytics engineering, especially for forecasting-heavy operational data stacks.

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)  
  A new columnar file format from Meta’s ecosystem is a meaningful signal; storage-format innovation is rare and worth close monitoring.

- [Apache DataFusion](https://github.com/apache/datafusion)  
  The growing Rust query-engine layer is becoming foundational infrastructure for many new analytical systems and embedded SQL products.

- [Apache Polaris](https://github.com/apache/polaris) and [Lakekeeper](https://github.com/lakekeeper/lakekeeper)  
  Catalog infrastructure is becoming a battleground in lakehouse architecture as interoperability and governance move to the center.

- [Databend](https://github.com/databendlabs/databend), [StarRocks](https://github.com/StarRocks/starrocks), and [Apache Doris](https://github.com/apache/doris)  
  These systems best reflect the current direction of open analytics platforms: real-time, lakehouse-aware, cloud-native, and increasingly AI-adjacent.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*