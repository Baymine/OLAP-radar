# OLAP & Data Infra Open Source Trends 2026-03-26

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-26 01:27 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report  
*Date: 2026-03-26*

## Step 1 — Filtered Projects Relevant to OLAP / Data Infrastructure / Analytics

### From Today’s Trending
Only **1 repository** is clearly relevant to OLAP/data infrastructure/analytics:
- [supermemoryai/supermemory](https://github.com/supermemoryai/supermemory) — memory/data layer for AI applications; adjacent to data infra

Excluded as non-OLAP/data-infra: agent frameworks, coding tools, security tools, 3D editor, offline survival computer, WiFi sensing, trading agent app, etc.

### From Topic Search
Relevant repositories include:
- OLAP / analytical databases: [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse), [duckdb/duckdb](https://github.com/duckdb/duckdb), [apache/doris](https://github.com/apache/doris), [StarRocks/starrocks](https://github.com/StarRocks/starrocks), [questdb/questdb](https://github.com/questdb/questdb), [databendlabs/databend](https://github.com/databendlabs/databend), [crate/crate](https://github.com/crate/crate), [apache/cloudberry](https://github.com/apache/cloudberry), [Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake), [chdb-io/chdb](https://github.com/chdb-io/chdb), [RayforceDB/rayforce](https://github.com/RayforceDB/rayforce), [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)
- Storage/lakehouse/catalog/formats: [facebookincubator/nimble](https://github.com/facebookincubator/nimble), [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul), [apache/gravitino](https://github.com/apache/gravitino), [apache/polaris](https://github.com/apache/polaris), [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper), [apache/fluss](https://github.com/apache/fluss), [datazip-inc/olake](https://github.com/datazip-inc/olake), [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)
- Query/compute: [apache/datafusion](https://github.com/apache/datafusion), [trinodb/trino](https://github.com/trinodb/trino), [prestodb/presto](https://github.com/prestodb/presto), [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista), [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm), [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server), [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core), [roapi/roapi](https://github.com/roapi/roapi), [Canner/wren-engine](https://github.com/Canner/wren-engine)
- Integration / ETL: [dlt-hub/dlt](https://github.com/dlt-hub/dlt), [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server), [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven), [datazip-inc/olake](https://github.com/datazip-inc/olake), [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit)
- Tooling / BI / observability / benchmark / SQL UX: [apache/superset](https://github.com/apache/superset), [metabase/metabase](https://github.com/metabase/metabase), [grafana/grafana](https://github.com/grafana/grafana), [cube-js/cube](https://github.com/cube-js/cube), [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench), [elementary-data/elementary](https://github.com/elementary-data/elementary), [cloudera/hue](https://github.com/cloudera/hue), [GoogleCloudPlatform/bigquery-utils](https://github.com/GoogleCloudPlatform/bigquery-utils)

---

## 1. Today's Highlights

The clearest signal today is that **core OLAP repositories remain highly stable rather than newly spiking on the general trending page**; almost all GitHub-wide heat is going to AI agent infrastructure, not analytics databases. Within the filtered set, [supermemoryai/supermemory](https://github.com/supermemoryai/supermemory) stands out because it reflects a growing convergence between **data infrastructure and AI memory/state systems**. In the topic-based results, the center of gravity is still around mature analytical engines such as [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), and the Rust query ecosystem led by [Apache DataFusion](https://github.com/apache/datafusion). A secondary but important trend is continued momentum in **lakehouse catalog/control-plane projects** such as [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper), suggesting metadata interoperability remains a strategic focus.

---

## 2. Top Projects by Category

## 🗄️ OLAP Engines
- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,537  
  A leading real-time analytical DBMS and still one of the strongest community anchors for open-source OLAP.
- [DuckDB](https://github.com/duckdb/duckdb) — ⭐36,956  
  The dominant in-process analytics database, increasingly used as the default local OLAP engine for data engineering and notebook workflows.
- [Apache Doris](https://github.com/apache/doris) — ⭐15,154  
  A unified analytics database with strong adoption for user-facing analytics and real-time BI workloads.
- [StarRocks](https://github.com/StarRocks/starrocks) — ⭐11,514  
  A high-performance OLAP/lakehouse query engine worth watching for sub-second analytics against mixed storage backends.
- [Databend](https://github.com/databendlabs/databend) — ⭐9,204  
  A cloud-native warehouse design centered on object storage and increasingly positioned for analytics + AI workloads.
- [QuestDB](https://github.com/questdb/questdb) — ⭐16,788  
  A high-performance time-series analytical database that remains relevant as observability and market-data use cases grow.
- [chDB](https://github.com/chdb-io/chdb) — ⭐2,644  
  An in-process OLAP SQL engine powered by ClickHouse, notable for embedding analytical execution directly into applications and Python workflows.
- [Apache Cloudberry](https://github.com/apache/cloudberry) — ⭐1,194  
  An open-source MPP warehouse alternative in the Greenplum lineage, relevant for teams wanting mature parallel SQL architecture.

## 📦 Storage Formats & Lakehouse
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐702  
  A new file format for large columnar datasets and one of the more interesting lower-level storage experiments in the current landscape.
- [LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,226  
  A realtime cloud-native lakehouse framework, relevant for teams combining BI and streaming-heavy AI/analytics use cases.
- [Apache Polaris](https://github.com/apache/polaris) — ⭐1,885  
  An open Iceberg catalog project and an important sign of growing emphasis on interoperable lakehouse metadata planes.
- [Apache Gravitino](https://github.com/apache/gravitino) — ⭐2,925  
  A federated open data catalog aiming to unify metadata across environments, highly aligned with multi-engine lakehouse architectures.
- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,225  
  A Rust-based Iceberg REST catalog that reflects demand for lightweight and modern catalog services.
- [Apache Fluss](https://github.com/apache/fluss) — ⭐1,831  
  Streaming storage built for real-time analytics, showing the continued merge between stream processing and analytical serving.
- [OLake](https://github.com/datazip-inc/olake) — ⭐1,313  
  An ingestion layer targeting Iceberg and Parquet, notable because it bridges operational sources directly into lakehouse storage.

## ⚙️ Query & Compute
- [Apache DataFusion](https://github.com/apache/datafusion) — ⭐8,536  
  The flagship Rust SQL query engine and arguably the most important reusable compute substrate in modern open data infrastructure.
- [Trino](https://github.com/trinodb/trino) — ⭐12,663  
  A major distributed SQL engine that remains central to federated analytics and lakehouse query access.
- [Presto](https://github.com/prestodb/presto) — ⭐16,666  
  Still a major engine in the distributed SQL ecosystem and relevant for large-scale warehouse/lake querying.
- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — ⭐2,000  
  Distributed execution for DataFusion, important as the Rust analytics stack moves beyond embedded execution into cluster-scale compute.
- [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,948  
  Brings analytical SQL to the browser and edge environments, a meaningful direction for client-side analytics and portable compute.
- [ROAPI](https://github.com/roapi/roapi) — ⭐3,416  
  Exposes columnar datasets through APIs without custom backend code, reflecting the productization of analytical data access.
- [Wren Engine](https://github.com/Canner/wren-engine) — ⭐599  
  A context/query engine for AI agents built on DataFusion, highlighting the overlap between semantic access layers and analytical compute.
- [Firebolt Core](https://github.com/firebolt-db/firebolt-core) — ⭐195  
  A self-hosted distributed query engine from a commercial warehouse lineage, worth attention as more warehouse tech gets opened.

## 🔗 Data Integration & ETL
- [dlt](https://github.com/dlt-hub/dlt) — ⭐5,117  
  A developer-friendly Python loading framework that continues to resonate with teams simplifying ingestion into modern warehouses and lakes.
- [Rudder Server](https://github.com/rudderlabs/rudder-server) — ⭐4,377  
  A Segment alternative for event pipelines, relevant to analytics engineering and customer-data infrastructure.
- [Multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,644  
  An open-source reverse ETL platform, showing continued demand for activation layers on top of warehouse data.
- [OLake](https://github.com/datazip-inc/olake) — ⭐1,313  
  A fast replication and ingestion project for Kafka, databases, and S3 into Iceberg/Parquet, strongly aligned with lakehouse operationalization.
- [Versatile Data Kit](https://github.com/vmware/versatile-data-kit) — ⭐478  
  A framework for developing and operating Python/SQL data workflows, useful for pragmatic warehouse-oriented pipeline teams.

## 🧰 Data Tooling
- [Apache Superset](https://github.com/apache/superset) — ⭐71,124  
  The leading open-source BI and exploration layer, still the default dashboarding choice in many modern data stacks.
- [Metabase](https://github.com/metabase/metabase) — ⭐46,563  
  A widely adopted self-service analytics tool valued for ease of deployment and broad warehouse compatibility.
- [Grafana](https://github.com/grafana/grafana) — ⭐72,803  
  Though observability-first, it remains highly relevant as a visualization and SQL-facing analytics surface across data backends.
- [Cube](https://github.com/cube-js/cube) — ⭐19,696  
  An open semantic layer increasingly important for governed BI, embedded analytics, and AI-facing metric access.
- [Elementary](https://github.com/elementary-data/elementary) — ⭐2,287  
  A dbt-native observability project, relevant as data reliability becomes a first-class concern in analytics engineering.
- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐974  
  A benchmark suite for analytical databases and a useful lens into performance competition across the OLAP ecosystem.
- [Hue](https://github.com/cloudera/hue) — ⭐1,451  
  A mature SQL UI and assistant layer for warehouses and databases, still useful in multi-engine environments.
- [BigQuery Utils](https://github.com/GoogleCloudPlatform/bigquery-utils) — ⭐1,289  
  A practical utility repository for warehouse operations and optimization, reflecting enduring demand for SQL/ops tooling.

### Adjacent Emerging Data-Infra Signal
- [supermemory](https://github.com/supermemoryai/supermemory) — ⭐0 (+810 today)  
  A fast, scalable memory engine/API for AI applications; not classic OLAP, but relevant because AI-native state stores are increasingly behaving like specialized analytical infrastructure.

---

## 3. Trend Signal Analysis

Today’s hot-list signal is unusual for the OLAP ecosystem: **there is very little direct GitHub-trending breakout activity in classic analytics databases**, while topic-level discovery shows continued strength in mature engines and surrounding infrastructure. The broad open-source attention wave is currently centered on AI agents, but the one data-adjacent breakout, [supermemory](https://github.com/supermemoryai/supermemory), suggests the market is rewarding projects that package data access, persistence, retrieval, and low-latency serving as **AI-native infrastructure primitives**.

Within core data infra, the strongest structural trend remains the split between **embedded/local analytics** and **cloud/lakehouse-scale distributed analytics**. On one side, [DuckDB](https://github.com/duckdb/duckdb), [chDB](https://github.com/chdb-io/chdb), and [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm) reinforce the momentum of portable, in-process OLAP. On the other, [ClickHouse](https://github.com/ClickHouse/ClickHouse), [StarRocks](https://github.com/StarRocks/starrocks), [Apache Doris](https://github.com/apache/doris), and [Databend](https://github.com/databendlabs/databend) continue to define high-performance analytical serving over object storage and real-time ingestion.

A notable emerging direction is the **metadata/catalog layer becoming strategic infrastructure**. Projects like [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper) show that lakehouse competition is shifting from only storage and compute to **interoperability control planes**. At the lower level, [facebookincubator/nimble](https://github.com/facebookincubator/nimble) is worth watching as a new storage-format experiment, while [Apache DataFusion](https://github.com/apache/datafusion) continues to anchor a modular Rust-based query stack that increasingly powers agent-facing and semantic data systems.

---

## 4. Community Hot Spots

- **[Apache DataFusion](https://github.com/apache/datafusion) and its ecosystem**  
  The Rust query stack is increasingly foundational for new engines, semantic layers, and embedded analytics products.

- **[Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Catalogs are becoming the governance and interoperability backbone of the lakehouse era.

- **[DuckDB](https://github.com/duckdb/duckdb), [chDB](https://github.com/chdb-io/chdb), and [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm)**  
  Embedded OLAP is expanding from laptops to apps, browsers, and edge runtimes.

- **[Databend](https://github.com/databendlabs/databend), [StarRocks](https://github.com/StarRocks/starrocks), and [Apache Doris](https://github.com/apache/doris)**  
  These projects represent the strongest open-source push toward cloud-warehouse-class performance with open architectures.

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble) and AI-adjacent memory infra like [supermemory](https://github.com/supermemoryai/supermemory)**  
  New storage abstractions and AI-oriented serving layers may become the next frontier where data infra and application infrastructure merge.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*