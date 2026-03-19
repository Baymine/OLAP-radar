# OLAP & Data Infra Open Source Trends 2026-03-19

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-19 01:25 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report  
**Date:** 2026-03-19

## Step 1 — Filtered Scope
From today’s GitHub trending list, **none of the 6 repos are clearly OLAP/data-infrastructure projects**, so the meaningful signal comes primarily from the **data-infra topic search results**.  
Included below are projects clearly relevant to **OLAP engines, analytics databases, lakehouse/catalog/storage, query engines, ETL/integration, and data tooling/BI/observability**.  
Excluded are unrelated repos such as coding agents, emulators, physics engines, general frontend/tools, and weakly related items without clear data-engineering relevance.

---

## 1. Today’s Highlights

Today’s strongest open-source signal in OLAP and data infra is **continued concentration around analytical databases and SQL execution engines**, led by mature projects like [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), and [StarRocks](https://github.com/StarRocks/starrocks). A second major theme is the **broadening of “analytics database” into hybrid systems** that combine OLAP with **search, AI, vector, and lake-native storage**, visible in projects like [Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), and [SeekDB](https://github.com/oceanbase/seekdb).  

Lakehouse infrastructure also remains active, especially around **catalogs, streaming storage, and Iceberg-oriented tooling**, with [Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [Apache Fluss](https://github.com/apache/fluss) standing out. On the query side, the ecosystem continues to standardize around **decoupled compute layers** such as [Trino](https://github.com/trinodb/trino), [Presto](https://github.com/prestodb/presto), and [Apache DataFusion](https://github.com/apache/datafusion). Finally, data teams are still investing heavily in **tooling around BI, observability, benchmarking, and SQL access**, with [Superset](https://github.com/apache/superset), [Metabase](https://github.com/metabase/metabase), [Elementary](https://github.com/elementary-data/elementary), and [ClickBench](https://github.com/ClickHouse/ClickBench) staying highly relevant.

---

## 2. Top Projects by Category

### 🗄️ OLAP Engines
- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — **⭐ 46,388**
  - Real-time analytical DBMS and still one of the clearest center-of-gravity projects for open-source OLAP.
- [DuckDB](https://github.com/duckdb/duckdb) — **⭐ 36,761**
  - In-process analytical SQL database; worth attention because embedded/local analytics continues to expand into mainstream data workflows.
- [Apache Doris](https://github.com/apache/doris) — **⭐ 15,123**
  - Unified analytics database with strong positioning for interactive analytics and lakehouse-facing deployments.
- [StarRocks](https://github.com/StarRocks/starrocks) — **⭐ 11,485**
  - High-performance query engine for sub-second analytics on and off the lakehouse; notable for hybrid warehouse/lake positioning.
- [Databend](https://github.com/databendlabs/databend) — **⭐ 9,199**
  - Cloud-native warehouse architecture on object storage, increasingly framed around analytics + search + AI convergence.
- [QuestDB](https://github.com/questdb/questdb) — **⭐ 16,772**
  - Time-series database optimized for high-ingest, real-time analytics; especially relevant for observability/market-data style workloads.
- [MatrixOne](https://github.com/matrixorigin/matrixone) — **⭐ 1,873**
  - MySQL-compatible HTAP system blending transactional, analytical, vector, and full-text capabilities in one engine.
- [Apache Cloudberry](https://github.com/apache/cloudberry) — **⭐ 1,191**
  - Mature MPP database lineage and a notable open alternative in the Greenplum-style warehouse segment.

### 📦 Storage Formats & Lakehouse
- [Apache Polaris](https://github.com/apache/polaris) — **⭐ 1,879**
  - Open catalog for Apache Iceberg; important because open metadata control is becoming foundational in lakehouse interoperability.
- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — **⭐ 1,222**
  - Rust-based Iceberg REST catalog emphasizing performance and secure open lakehouse operations.
- [Apache Gravitino](https://github.com/apache/gravitino) — **⭐ 2,920**
  - Federated metadata lake/catalog layer, reflecting growing interest in cross-region and multi-engine metadata control.
- [Apache Fluss](https://github.com/apache/fluss) — **⭐ 1,824**
  - Streaming storage built for real-time analytics, connecting streaming and analytical storage semantics more directly.
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — **⭐ 699**
  - New file format for large columnar datasets; notable as a direct storage-format innovation signal.
- [YTsaurus](https://github.com/ytsaurus/ytsaurus) — **⭐ 2,136**
  - Big data platform with lakehouse-adjacent characteristics across storage, compute, and large-scale data processing.
- [OLake](https://github.com/datazip-inc/olake) — **⭐ 1,310**
  - Ingestion into Iceberg or Parquet with real-time orientation, showing how lakehouse adoption is pulling replication tools toward open table formats.

### ⚙️ Query & Compute
- [Apache DataFusion](https://github.com/apache/datafusion) — **⭐ 8,509**
  - Rust SQL query engine and one of the strongest signals for modular, embeddable analytical compute.
- [Trino](https://github.com/trinodb/trino) — **⭐ 12,646**
  - Distributed SQL query engine with enduring relevance as the federated access layer across modern data stacks.
- [Presto](https://github.com/prestodb/presto) — **⭐ 16,666**
  - Still a major distributed query engine in lakehouse and warehouse-adjacent deployments.
- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — **⭐ 1,993**
  - Distributed execution layer for DataFusion, worth watching as Rust-native query compute matures.
- [go-mysql-server](https://github.com/dolthub/go-mysql-server) — **⭐ 2,617**
  - Storage-agnostic MySQL-compatible query engine, useful as evidence of composable SQL infrastructure demand.
- [chDB](https://github.com/chdb-io/chdb) — **⭐ 2,641**
  - In-process OLAP SQL engine powered by ClickHouse; important for embedded analytics and local-first execution.
- [QLever](https://github.com/ad-freiburg/qlever) — **⭐ 798**
  - High-performance RDF/SPARQL engine, showing continued specialization of query systems for graph/semantic analytics.
- [KiteSQL](https://github.com/KipData/KiteSQL) — **⭐ 685**
  - Embedded relational database with native Rust API, aligned with the rise of application-embedded compute.

### 🔗 Data Integration & ETL
- [dlt](https://github.com/dlt-hub/dlt) — **⭐ 5,062**
  - Python-native loading framework that remains relevant as teams seek simpler ingestion into modern warehouses and lakehouses.
- [RudderStack Server](https://github.com/rudderlabs/rudder-server) — **⭐ 4,375**
  - Event and pipeline infrastructure positioned as a privacy-focused Segment alternative.
- [Dinky](https://github.com/DataLinkDC/dinky) — **⭐ 3,709**
  - Flink-based real-time data development platform, notable for stream-oriented engineering workflows.
- [Multiwoven](https://github.com/Multiwoven/multiwoven) — **⭐ 1,643**
  - Open-source Reverse ETL, reflecting continued activation of warehouse/lakehouse data into business systems.
- [OLake](https://github.com/datazip-inc/olake) — **⭐ 1,310**
  - Fast replication from databases, Kafka, and S3 into Iceberg or Parquet, directly aligned with lakehouse ingestion trends.
- [Transformalize](https://github.com/dalenewman/Transformalize) — **⭐ 161**
  - Configurable ETL framework; smaller project, but still relevant in traditional pipeline use cases.

### 🧰 Data Tooling
- [Apache Superset](https://github.com/apache/superset) — **⭐ 71,014**
  - Leading open BI/data exploration platform and still a standard front-end for analytical warehouses and engines.
- [Metabase](https://github.com/metabase/metabase) — **⭐ 46,441**
  - Widely adopted self-service BI tool, important for the democratization layer above data infra.
- [Grafana](https://github.com/grafana/grafana) — **⭐ 72,700**
  - Observability and visualization platform increasingly used across metrics, logs, traces, and SQL-backed analytics.
- [Elementary](https://github.com/elementary-data/elementary) — **⭐ 2,277**
  - dbt-native data observability, highlighting the operationalization of analytics engineering.
- [ClickBench](https://github.com/ClickHouse/ClickBench) — **⭐ 973**
  - Benchmark suite for analytical databases; worth attention because benchmarking remains central to OLAP adoption narratives.
- [Hue](https://github.com/cloudera/hue) — **⭐ 1,449**
  - SQL assistant and UI for databases/warehouses, still relevant where teams need broad warehouse access tooling.
- [Redash](https://github.com/getredash/redash) — **⭐ 28,283**
  - Mature query, dashboarding, and sharing layer for operational analytics.
- [Wren Engine](https://github.com/Canner/wren-engine) — **⭐ 567**
  - Open context engine for AI agents, notable because semantic/data access tooling is increasingly intersecting with analytics infrastructure.

---

## 3. Trend Signal Analysis

The most visible trend is not a single breakout repo from today’s general trending page, but rather a **structural strengthening of the OLAP core**: analytical databases, embedded SQL engines, and decoupled query layers continue to dominate attention. Projects such as [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), and [Apache DataFusion](https://github.com/apache/datafusion) show that the community remains focused on **fast analytical execution**, whether deployed as distributed clusters, in-process runtimes, or lakehouse query layers.

A notable directional shift is the rise of **hybrid analytics systems**. Newer positioning increasingly combines OLAP with **search, vector retrieval, AI-native workflows, and object-storage-first architectures**. [Databend](https://github.com/databendlabs/databend), [SeekDB](https://github.com/oceanbase/seekdb), and [MatrixOne](https://github.com/matrixorigin/matrixone) exemplify this convergence. This suggests that the next competitive frontier is no longer just “faster SQL,” but **unified multimodal analytical infrastructure**.

On storage, the appearance and growth of projects like [facebookincubator/nimble](https://github.com/facebookincubator/nimble), [Apache Polaris](https://github.com/apache/polaris), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper) indicate continued momentum behind **open metadata and storage standards**, especially around Iceberg-compatible ecosystems. Meanwhile, [Apache Fluss](https://github.com/apache/fluss) points to a deeper merger between **streaming storage and analytical serving**.

Relative to recent lakehouse/cloud-warehouse evolution, the ecosystem is moving toward a common shape: **object storage + open catalog + pluggable query engine + lightweight ingestion + BI/observability on top**. The projects getting mindshare today fit squarely into that modular architecture.

---

## 4. Community Hot Spots

- **[DuckDB](https://github.com/duckdb/duckdb) + embedded analytics**
  - Embedded/local OLAP continues to expand from notebooks into apps, developer tooling, and edge analytics use cases.

- **[Apache DataFusion](https://github.com/apache/datafusion) and Rust query infrastructure**
  - DataFusion, Ballista, and adjacent Rust-native systems suggest a durable shift toward modular high-performance query components.

- **[Apache Polaris](https://github.com/apache/polaris) / [Lakekeeper](https://github.com/lakekeeper/lakekeeper)**
  - Open Iceberg catalog control is becoming a key strategic layer in the lakehouse stack.

- **Hybrid analytics engines like [Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), and [SeekDB](https://github.com/oceanbase/seekdb)**
  - These projects show how OLAP is converging with search, vector, AI agents, and object-storage-native architecture.

- **[Apache Fluss](https://github.com/apache/fluss) and real-time analytical storage**
  - Streaming-first storage for analytics is worth watching as batch/stream/lake boundaries continue to blur.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*